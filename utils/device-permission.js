/**
 * 设备连接所需运行时权限：检测 / 主动申请 / 引导去系统设置。
 *
 * 现场结论（V1.0.18，2026-11-12）：打包后卸载重装，部分荣耀 / 华为机型会把
 * 「附近的设备」权限默认置为「禁止」，此时 APP 连不上设备热点；用户在系统
 * 权限页手动改成「允许」后立即恢复。项目此前只在 manifest 里声明了权限，
 * `utils/permissions.js` 的 requestAndroidPermission / gotoAppPermissionSetting
 * 全项目零调用 —— 卸载重装后没有任何一次授权弹窗，也没有任何提示。
 *
 * 能做的：
 *  1) 检测并主动申请 manifest 里已声明的运行时权限（ACCESS_FINE_LOCATION /
 *     ACCESS_COARSE_LOCATION —— 读取设备热点名称必需），卸载重装后首次进入
 *     即弹系统授权框；
 *  2) 「附近的设备」是国产 ROM 的聚合开关，没有公开 API 能可靠查询其开关
 *     状态（不同 ROM 映射的底层权限不同，checkSelfPermission 结果不可信），
 *     因此不冒充能检测它，改用「连接结果 + 权限快照 + 读不到热点名称」
 *     间接判定，命中后弹引导让用户去系统权限页确认；
 *  3) 从设置页返回时由直连页 onShow 自动重试连接。
 *
 * 刻意不做：
 *  - 不拦截连接流程（权限不足 / 读不到热点名称一律放行，避免把用户卡在门外）；
 *  - 不申请未在 manifest 声明的权限（系统会直接拒绝且不弹框，只会造成误判）；
 *  - 不在收包热路径写日志（日志总线只记低频生命周期事件）。
 *
 * 面向用户的弹窗文案不含 MQTT / Broker / TCP / 主题 / 直连等协议术语。
 */

import { logLine } from './device-log.js'

const P_FINE_LOCATION = 'android.permission.ACCESS_FINE_LOCATION'
const P_COARSE_LOCATION = 'android.permission.ACCESS_COARSE_LOCATION'

/** 授权框最长等待：用户不点也必须在 2.5s 后继续发起连接，绝不阻塞流程 */
const REQUEST_TIMEOUT_MS = 2500
/** 引导弹窗冷却，避免自动重连循环里反复弹同一个框 */
const GUIDE_COOLDOWN_MS = 60 * 1000

let _lastResult = null
let _requestPromise = null
let _guideShowing = false
let _lastGuideAt = 0

function isAndroidApp() {
  return typeof plus !== 'undefined' && !!plus.android
}

function getMainActivity() {
  try {
    return plus.android.runtimeMainActivity()
  } catch (e) {
    return null
  }
}

/** API level；读不到返回 0，按低版本保守处理 */
function getApiLevel() {
  try {
    const V = plus.android.importClass('android.os.Build$VERSION')
    if (V && V.SDK_INT) return Number(V.SDK_INT) || 0
  } catch (e) { /* 换另一种写法再试 */ }
  try {
    const B = plus.android.importClass('android.os.Build')
    if (B && B.VERSION && B.VERSION.SDK_INT) return Number(B.VERSION.SDK_INT) || 0
  } catch (e) { /* 读不到就按 0 处理 */ }
  return 0
}

/** 单个权限是否已授予；查询失败返回 null（未知，不据此判定为缺失） */
function checkOne(main, perm) {
  try {
    const r = plus.android.invoke(main, 'checkSelfPermission', perm)
    return Number(r) === 0
  } catch (e) {
    return null
  }
}

function fmt(v) {
  return v === null ? '未知' : (v ? '已允许' : '未允许')
}

function arr(v) {
  return Array.isArray(v) ? v : []
}

/**
 * 同步权限快照。注意：这里检测的是标准运行时权限，不代表 ROM 的
 * 「附近的设备」聚合开关状态 —— 后者只能靠连接结果间接判断。
 */
export function checkDevicePermissions() {
  if (!isAndroidApp()) {
    const r = {
      supported: false, ok: true, apiLevel: 0,
      location: true, coarse: true, missing: [], unknown: false
    }
    _lastResult = r
    logLine('权限', '当前非 Android 应用环境，跳过权限检测')
    return r
  }
  const main = getMainActivity()
  if (!main) {
    const r = {
      supported: true, ok: true, apiLevel: 0,
      location: null, coarse: null, missing: [], unknown: true
    }
    _lastResult = r
    logLine('权限', '取不到主 Activity，权限状态按「未知」放行')
    return r
  }
  const apiLevel = getApiLevel()
  const location = checkOne(main, P_FINE_LOCATION)
  const coarse = checkOne(main, P_COARSE_LOCATION)
  const missing = []
  if (location === false) missing.push(P_FINE_LOCATION)
  if (coarse === false) missing.push(P_COARSE_LOCATION)
  const snapshot = {
    supported: true,
    ok: location !== null && missing.length === 0,
    apiLevel,
    location,
    coarse,
    missing,
    unknown: location === null
  }
  _lastResult = snapshot
  logLine('权限', '检测：系统 API ' + apiLevel +
    '，位置信息=' + fmt(location) + '，粗略位置=' + fmt(coarse) +
    '，缺失 ' + missing.length + ' 项')
  return snapshot
}

/** 主动申请（只申请已声明且未授予的）；已授予时不会弹系统框 */
export function requestDevicePermissions() {
  if (!isAndroidApp()) return Promise.resolve(checkDevicePermissions())
  if (_requestPromise) return _requestPromise
  const snap = checkDevicePermissions()
  if (!snap.missing.length) {
    logLine('权限', '无需申请，所需权限均已允许')
    return Promise.resolve(snap)
  }
  logLine('权限', '申请授权：' + snap.missing.join(', '))
  _requestPromise = new Promise(resolve => {
    let done = false
    const finish = result => {
      if (done) return
      done = true
      _requestPromise = null
      _lastResult = result
      resolve(result)
    }
    try {
      plus.android.requestPermissions(snap.missing.slice(), r => {
        const granted = arr(r && r.granted)
        const deniedPresent = arr(r && r.deniedPresent)
        const deniedAlways = arr(r && r.deniedAlways)
        const after = checkDevicePermissions()
        const out = {
          supported: after.supported,
          ok: after.ok && deniedAlways.length === 0,
          apiLevel: after.apiLevel,
          location: after.location,
          coarse: after.coarse,
          missing: after.missing,
          unknown: after.unknown,
          granted,
          deniedPresent,
          deniedAlways,
          permanentlyDenied: deniedAlways.length > 0
        }
        logLine('权限', '授权结果：允许 ' + granted.length +
          ' 项 / 本次拒绝 ' + deniedPresent.length +
          ' 项 / 不再询问 ' + deniedAlways.length + ' 项')
        finish(out)
      }, err => {
        logLine('权限', '授权调用失败：' + String((err && err.message) || err))
        finish({ ...checkDevicePermissions(), error: true, ok: false })
      })
    } catch (e) {
      logLine('权限', '授权调用异常：' + String((e && e.message) || e))
      finish({ ...snap, error: true, ok: false })
    }
  })
  return _requestPromise
}

/**
 * 连接前的权限准备：检测 → 缺则申请。带超时保底，用户不点系统授权框时
 * 也必须继续发起连接（绝不拦截流程）。
 */
export function ensureDevicePermissions() {
  if (!isAndroidApp()) return Promise.resolve(checkDevicePermissions())
  const snap = checkDevicePermissions()
  if (snap.ok && snap.missing.length === 0) return Promise.resolve(snap)
  let timer = null
  const guard = new Promise(resolve => {
    timer = setTimeout(() => {
      logLine('权限', '授权框等待超过 ' + REQUEST_TIMEOUT_MS + 'ms，先继续连接')
      resolve({ ...snap, timedOut: true })
    }, REQUEST_TIMEOUT_MS)
  })
  return Promise.race([requestDevicePermissions(), guard]).then(res => {
    if (timer) clearTimeout(timer)
    return res || snap
  })
}

export function getLastPermissionResult() {
  return _lastResult
}

/** 跳转应用权限设置页；主入口失败时退到系统应用设置页 */
export function openPermissionSettings() {
  if (!isAndroidApp()) return false
  try {
    const Intent = plus.android.importClass('android.content.Intent')
    const Settings = plus.android.importClass('android.provider.Settings')
    const Uri = plus.android.importClass('android.net.Uri')
    const main = plus.android.runtimeMainActivity()
    const pkg = String(plus.android.invoke(main, 'getPackageName'))
    const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
    intent.setData(Uri.fromParts('package', pkg, null))
    main.startActivity(intent)
    logLine('权限', '已打开应用权限设置页')
    return true
  } catch (e) {
    try {
      const Intent = plus.android.importClass('android.content.Intent')
      const Settings = plus.android.importClass('android.provider.Settings')
      const main = plus.android.runtimeMainActivity()
      main.startActivity(new Intent(Settings.ACTION_APPLICATION_SETTINGS))
      logLine('权限', '已打开系统应用设置页')
      return true
    } catch (e2) {
      logLine('权限', '打开权限设置页失败：' + String((e2 && e2.message) || e2))
      return false
    }
  }
}

/**
 * 连接失败时的权限引导。是否「疑似权限受限」由调用方判定（suspect），
 * 本函数只负责冷却 / 去重 / 弹窗，不自行用权限快照否决 —— 因为国产 ROM 的
 * 「附近的设备」开关被禁止时，标准权限快照可能仍然显示全部已允许。
 *
 * @param {Object}  options
 * @param {boolean} options.suspect  调用方判定为疑似权限问题
 * @param {Function} options.isActive 返回 false 表示页面已离开，不再弹任何 UI
 * @returns {boolean} 是否真的弹了窗（调用方据此决定是否还弹普通错误 toast）
 */
export function showPermissionGuide(options = {}) {
  if (!isAndroidApp() || !options.suspect) return false
  const now = Date.now()
  if (_guideShowing || now - _lastGuideAt < GUIDE_COOLDOWN_MS) return false
  const isActive = typeof options.isActive === 'function' ? options.isActive : null
  if (isActive && !isActive()) return false
  _guideShowing = true
  _lastGuideAt = now
  logLine('权限', '弹出权限引导弹窗')
  try {
    uni.showModal({
      title: '需要开启设备访问权限',
      content: '请在本应用的权限设置里，把「附近的设备」和「位置信息」设为「允许」，否则可能连不上设备热点。设置完成后返回本页会自动重试。',
      confirmText: '去设置',
      cancelText: '稍后',
      success: res => {
        _guideShowing = false
        if (!res.confirm) return
        openPermissionSettings()
      },
      fail: () => { _guideShowing = false }
    })
    return true
  } catch (e) {
    _guideShowing = false
    return false
  }
}
