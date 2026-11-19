/**
 * 设备 WiFi 检测与连接辅助
 *
 * 现场设备会开放一个名为 GCNZ-<功率>-<容量>-<编号> 的热点，手机必须连上
 * 这个热点才能与设备通信。本模块负责：
 *   1. 读取当前 WiFi（APP-Android 用 WifiManager 原生直读，其余端用 uni API）
 *   2. 判断是否为设备热点
 *   3. 未连上时尝试自动连接已保存的热点，失败则引导用户去系统 WiFi 设置
 *
 * 面向用户的文案只出现「WiFi / 设备热点」，不出现 MQTT / Broker / TCP /
 * Topic 等协议术语；底层细节只写 console.warn。
 *
 * 重要：读不到 SSID（定位权限未授、WiFi 关闭、平台不支持）一律按「未知」
 * 放行，不拦截原有连接流程 —— 否则用户会被一个关不掉的提示挡在门外，
 * 反而比连不上设备更糟。
 */

import { logLine } from './device-log.js'

export const DEVICE_WIFI_PREFIX = 'GCNZ'
export const WIFI_CONFIG_STORAGE_KEY = 'direct_device_config'
/**
 * 设备热点统一密码，内置在程序里。
 * 现场二维码只带热点名称（SSID），不带 P 字段；用户无需、也没有入口输入密码。
 * 扫码连接与自动重连共用这一个常量，改密码只改这里。
 */
export const DEFAULT_DEVICE_WIFI_PASSWORD = '20150509'

/** 自动连接失败后的冷却时间，避免 onShow 反复触发系统 WiFi 授权弹窗 */
const AUTO_CONNECT_COOLDOWN_MS = 60 * 1000
/** uni.connectWifi 最长等待 */
const CONNECT_TIMEOUT_MS = 12000
/** 读取当前 WiFi 最长等待 */
const READ_TIMEOUT_MS = 2500
/** 系统限制类错误后不再反复尝试自动重连的时间窗 */
const UNSUPPORTED_SKIP_MS = 60 * 1000
/** Android 10+ 不允许应用删改已保存的 WiFi 配置，这些错误重试也不会成功 */
const WIFI_UNSUPPORTED_CODES = [12001, 12002, 12007, 12010, 12013]

let _lastAutoConnectAt = 0
let _lastUnsupportedAt = 0
let _lastConnectErrCode = 0
let _startWifiReady = false
let _guideShowing = false

/** 去掉 Android getSSID() 的引号与占位值；读不到统一返回空串 */
export function normalizeSsid(raw) {
  let s = String(raw == null ? '' : raw).trim()
  if (s.length > 1 && s.charAt(0) === '"' && s.charAt(s.length - 1) === '"') {
    s = s.slice(1, -1).trim()
  }
  // 未授定位权限 / WiFi 关闭时 Android 返回 <unknown ssid> 或 0x
  if (!s || /^<unknown|^0x/i.test(s)) return ''
  return s
}

/**
 * 设备热点名提示。只给出名称本身（含示例），不逐段解释规则 —— 弹窗要短。
 * 已保存热点直接显示名称，未保存时给一个示例，用户在 WiFi 列表里照着认即可。
 */
export function describeDeviceWifi(ssid) {
  const s = normalizeSsid(ssid)
  return s ? `设备热点「${s}」` : '设备热点（名称形如 GCNZ-50-129-01）'
}

/**
 * 是否为设备热点。与配置页 parseSsid 同一前缀，但不强求容量/编号段：
 * 现场出现过 GCNZ_50kW_129_01、GCNZ-50-129-01-5G 等变体，宽松匹配更稳。
 */
export function isDeviceWifi(ssid) {
  const s = normalizeSsid(ssid)
  return !!s && s.toUpperCase().indexOf(DEVICE_WIFI_PREFIX) === 0
}

/**
 * 读取本地保存的设备热点凭据（配置页扫码 / 热点识别时写入）。
 * 旧版本配置或「在系统设置里手动连过、本地没存到密码」时，回退到内置密码，
 * 保证自动重连也能带上密码；明确标记过开放网络（wifiNoPassword）的除外。
 */
export function getSavedWifi() {
  try {
    const cfg = uni.getStorageSync(WIFI_CONFIG_STORAGE_KEY) || {}
    const ssid = normalizeSsid(cfg.wifiSsid)
    const stored = String(cfg.wifiPassword || '')
    const password = stored || (!ssid || cfg.wifiNoPassword === true
      ? ''
      : DEFAULT_DEVICE_WIFI_PASSWORD)
    return { ssid, password }
  } catch (e) {
    return { ssid: '', password: '' }
  }
}

/**
 * 保存 / 更新设备热点凭据。
 * 用户在系统设置里手动连热点时拿不到密码：同一热点保留已存密码，
 * 换了热点则清空（旧密码带过去只会让自动连接失败）。
 * options.clearPassword=true 用于明确知道该热点无密码的场景（二维码 T:nopass）。
 * 换热点时重置自动连接冷却，允许立刻再试一次。
 */
export function saveWifiCredential(ssid, password, options = {}) {
  const target = normalizeSsid(ssid)
  if (!target) return
  try {
    const cfg = uni.getStorageSync(WIFI_CONFIG_STORAGE_KEY) || {}
    let pwd
    if (options.clearPassword === true) {
      pwd = ''
    } else if (password == null || password === '') {
      pwd = normalizeSsid(cfg.wifiSsid) === target ? String(cfg.wifiPassword || '') : ''
    } else {
      pwd = String(password)
    }
    if (cfg.wifiSsid !== target) _lastAutoConnectAt = 0
    const next = {
      ...cfg,
      wifiSsid: target,
      wifiPassword: pwd
    }
    // 开放网络标记只在「明确无密码 / 明确带密码」时改动；
    // onShow 识别热点时的无参调用不能把它抹掉。
    if (options.clearPassword === true) next.wifiNoPassword = true
    else if (pwd) next.wifiNoPassword = false
    uni.setStorageSync(WIFI_CONFIG_STORAGE_KEY, next)
  } catch (e) {
    console.warn('[设备WiFi] 保存热点信息失败:', e)
  }
}

/**
 * APP-Android 用 WifiManager 直读 SSID，不触发 startWifi。
 * 原因同配置页：uni-wifi 的 getConnectedWifi 要求先 startWifi，会弹定位权限、
 * 注册广播并触发扫描；原生直读只需已声明的 ACCESS_WIFI_STATE。
 * 非 APP 端 plus 不存在，直接返回空串走 uni API 分支。
 */
function readAndroidSsidSync() {
  try {
    if (typeof plus === 'undefined' || !plus.android || !plus.android.runtimeMainActivity) return ''
    const main = plus.android.runtimeMainActivity()
    if (!main) return ''
    const wm = plus.android.invoke(main, 'getSystemService', 'wifi')
    if (!wm) return ''
    const info = plus.android.invoke(wm, 'getConnectionInfo')
    if (!info) {
      logLine('WiFi', '原生读取：getConnectionInfo 为空（权限不足 / WiFi 未开启）')
      return ''
    }
    const raw = plus.android.invoke(info, 'getSSID')
    const ssid = normalizeSsid(raw)
    // 读不到热点名称是最关键的现场判据：国产 ROM 把「附近的设备」设为禁止时，
    // 系统返回 <unknown ssid>，后续无法自动重连热点，TCP 也常走不出去。
    logLine('WiFi', '原生读取 SSID：' + (ssid || '读不到（<unknown ssid> / 权限受限）'))
    return ssid
  } catch (e) {
    console.warn('[设备WiFi] 原生读取失败:', e)
    logLine('WiFi', '原生读取异常：' + String((e && e.message) || e))
    return ''
  }
}

/** 读取当前已连接 WiFi 的名称；读不到返回空串（由调用方按「未知」放行） */
export function readCurrentSsid() {
  return new Promise(resolve => {
    const isApp = typeof plus !== 'undefined'
    const native = isApp ? readAndroidSsidSync() : ''
    if (native) {
      resolve(native)
      return
    }
    // APP 端原生直读失败（iOS 或定位权限未授）时直接返回空，按「未知」放行。
    // 这里刻意不 fallback 到 uni.getConnectedWifi / startWifi：后者会弹定位
    // 权限、注册广播并触发扫描，正是项目此前明确规避的行为。
    // iOS 本来也读不到 SSID，放行比误报更合适。
    if (isApp || typeof uni.getConnectedWifi !== 'function') {
      resolve('')
      return
    }

    let done = false
    let timer = null
    const finish = v => {
      if (done) return
      done = true
      if (timer) clearTimeout(timer)
      resolve(v)
    }
    timer = setTimeout(() => finish(''), READ_TIMEOUT_MS)

    const query = () => {
      try {
        uni.getConnectedWifi({
          partialInfo: true,
          success: res => finish(normalizeSsid(res && res.wifi && res.wifi.SSID)),
          fail: () => finish('')
        })
      } catch (e) {
        finish('')
      }
    }

    // 微信小程序要求先 startWifi 才能读 SSID。APP 端若原生直读成功根本不会
    // 走到这里；只在首次读取时调用一次，失败也不重复弹授权。
    if (typeof uni.startWifi === 'function' && !_startWifiReady) {
      _startWifiReady = true
      try {
        uni.startWifi({
          success: () => { if (!done) query() },
          fail: () => { if (!done) query() }
        })
        return
      } catch (e) { /* 落到直接读取 */ }
    }
    query()
  })
}

/**
 * 尝试连接指定热点；成功/失败/超时都 resolve 布尔值，不向界面抛底层错误。
 *
 * options.silentUi=true 时完全不弹全局 loading：用于「刚进入监测页」这类
 * 自动前置检查。以前这里用 mask:true 的全屏遮罩，自动重连最长要等 12s，
 * 用户看到的就是「点了『进入监测』、页面好几秒不出现」——实际上页面早已
 * 打开，只是被遮罩盖住了。手动触发（刷新 / 引导弹窗里点「去连接」）仍保留
 * 提示，但改成 mask:false，不再挡住页面与返回按钮。
 */
export function connectWifi(ssid, password, isActive, options = {}) {
  const target = normalizeSsid(ssid)
  if (!target) return Promise.resolve(false)
  if (typeof uni.connectWifi !== 'function') return Promise.resolve(false)
  if (isActive && !isActive()) return Promise.resolve(false)
  const silentUi = options.silentUi === true

  return new Promise(resolve => {
    let done = false
    if (!silentUi) {
      try {
        uni.showLoading({ title: '正在连接设备 WiFi...', mask: false })
      } catch (e) { /* 某些端不支持 loading，忽略 */ }
    }

    const finish = ok => {
      if (done) return
      done = true
      clearTimeout(timer)
      if (!silentUi) {
        try { uni.hideLoading() } catch (e) { }
      }
      resolve(!!ok)
    }
    const timer = setTimeout(() => {
      console.warn('[设备WiFi] 自动连接超时:', target)
      finish(false)
    }, CONNECT_TIMEOUT_MS)

    const doConnect = () => {
      // startWifi 是异步的，页面可能在回调前就被关闭；此时不再弹全局 loading
      if (isActive && !isActive()) {
        finish(false)
        return
      }
      const opts = { SSID: target, maunal: false }
      if (password) opts.password = password
      opts.success = () => {
        console.log('[设备WiFi] 已发起连接:', target)
        finish(true)
      }
      opts.fail = err => {
        const code = Number((err && (err.errCode != null ? err.errCode : err.code)) || 0)
        _lastConnectErrCode = code
        // 系统限制类错误（典型：12001 已保存配置删不掉）重试只会重复触发
        // 系统弹窗，直接转入「去系统 WiFi 设置」引导，冷却期内不再自动尝试。
        if (WIFI_UNSUPPORTED_CODES.indexOf(code) >= 0) _lastUnsupportedAt = Date.now()
        console.warn('[设备WiFi] 连接失败:', code, (err && err.errMsg) || err)
        finish(false)
      }
      try {
        uni.connectWifi(opts)
      } catch (e) {
        console.warn('[设备WiFi] 连接调用异常:', e)
        finish(false)
      }
    }

    // startWifi 幂等，connectWifi 的前置条件；只在需要自动连接时才调用。
    if (typeof uni.startWifi === 'function') {
      try {
        uni.startWifi({
          success: () => { if (!done) doConnect() },
          fail: err => {
            console.warn('[设备WiFi] WiFi 模块启动失败:', (err && err.errMsg) || err)
            finish(false)
          }
        })
      } catch (e) {
        finish(false)
      }
    } else {
      doConnect()
    }
  })
}

/**
 * 打开系统 WiFi 设置页。
 * Android 可直接跳转；iOS / 小程序没有直达入口，返回 false 由调用方给文案。
 */
export function openWifiSettings() {
  try {
    if (typeof plus !== 'undefined' && plus.android && plus.android.runtimeMainActivity) {
      const Intent = plus.android.importClass('android.content.Intent')
      const intent = new Intent('android.settings.WIFI_SETTINGS')
      plus.android.runtimeMainActivity().startActivity(intent)
      return true
    }
  } catch (e) {
    console.warn('[设备WiFi] 打开系统 WiFi 设置失败:', e)
  }
  return false
}

/**
 * 把 uni-wifi 的底层错误翻译成「用户下一步该做什么」。
 *
 * 典型场景（真机 2026-11-13）：Android 10+ 不允许三方应用删除系统里已保存
 * 的 WiFi 配置，而 uni-wifi 插件连接前会先 removeNetwork(同名配置)，删不掉
 * 就 fail(12001, 'system not support')。手机只要曾经连过这台设备，之后再
 * 扫码 / 自动重连都会撞上它。原始 errMsg 只写控制台，绝不进弹窗。
 */
export function describeWifiError(err) {
  const msg = String((err && (err.errMsg || err.message)) || err || '')
  let code = Number((err && (err.errCode != null ? err.errCode : err.code)) || 0)
  // 小程序 / 部分 ROM 只回 errMsg 字符串，不带 errCode
  if (!code) {
    if (/system not support/i.test(msg)) code = 12001
    else if (/not init/i.test(msg)) code = 12000
    else if (/password/i.test(msg)) code = 12002
    else if (/not turned on/i.test(msg)) code = 12005
    else if (/expired/i.test(msg)) code = 12013
  }
  switch (code) {
    case 12001:
      return '这台手机之前保存过该热点，系统不允许应用直接切换。'
    case 12000:
      return '暂时没搜索到这个设备热点，请确认设备已上电并靠近设备。'
    case 12002:
      return '热点密码可能不正确，或系统不允许应用添加该网络。'
    case 12005:
      return '手机 WiFi 开关还没打开。'
    case 12007:
      return '系统拒绝了本次连接请求。'
    case 12010:
    case 12013:
      return '系统保存的热点配置已失效，可先在 WiFi 设置里「忘记此网络」再重试。'
    default:
      return '无法由应用直接完成连接。'
  }
}

/**
 * 自动连接被系统限制时的引导弹窗：一键打开系统 WiFi 列表，必要时复制密码。
 * 与 showWifiGuide 共用 _guideShowing，避免自动检查和扫码流程同时弹两个窗。
 * 系统里通常还保存着这个热点，用户在列表里点一下即可连上（无需重输密码）。
 */
export function showManualWifiGuide(ssid, options = {}) {
  if (_guideShowing) return false
  const isActive = typeof options.isActive === 'function' ? options.isActive : null
  if (isActive && !isActive()) return false
  const target = normalizeSsid(ssid)
  const password = String(options.password || '')
  const reason = String(options.reason || '')
  const name = describeDeviceWifi(target)

  _guideShowing = true
  const content = (reason || '请在系统 WiFi 列表里连接设备热点。') +
    `\n选择${name}${password ? '（点「打开 WiFi 设置」会同时复制密码）' : ''}，连上后返回本页会自动继续。`
  try {
    uni.showModal({
      title: '请在系统 WiFi 中完成连接',
      content,
      confirmText: '打开 WiFi 设置',
      cancelText: '稍后',
      success: res => {
        _guideShowing = false
        if (!res.confirm) return
        if (password) {
          try { uni.setClipboardData({ data: password }) } catch (e) { }
        }
        if (!openWifiSettings()) {
          uni.showToast({ title: '请手动打开系统 WiFi 设置', icon: 'none' })
        }
      },
      fail: () => { _guideShowing = false }
    })
    return true
  } catch (e) {
    _guideShowing = false
    console.warn('[设备WiFi] 引导弹窗失败:', e)
    return false
  }
}

/** 未连上设备热点时的引导弹窗；同一时刻只弹一个 */
function showWifiGuide(target, isActive) {
  if (_guideShowing) return
  // 检测是异步的，结果回来时页面可能已退出（例如被踢回登录页），
  // 弹窗是全局 UI，绝不能出现在无关页面上。
  if (isActive && !isActive()) {
    console.warn('[设备WiFi] 页面已离开，跳过引导弹窗')
    return
  }
  _guideShowing = true
  const reason = _lastConnectErrCode
    ? describeWifiError({ errCode: _lastConnectErrCode }) + '\n'
    : ''
  const tip = reason + `请先连接${describeDeviceWifi(target)}，连上后返回本页会自动继续。`
  try {
    uni.showModal({
      title: '未连接设备 WiFi',
      content: tip,
      confirmText: '去连接',
      cancelText: '稍后',
      success: res => {
        _guideShowing = false
        if (!res.confirm) return
        if (openWifiSettings()) return
        // 小程序 / iOS 无法直达系统 WiFi 列表：有凭据就再发起一次连接请求，
        // 微信会弹系统确认框；无凭据只能提示用户手动连接。
        if (target) {
          connectWifi(target, getSavedWifi().password).then(ok => {
            uni.showToast({
              title: ok ? '请在弹出的确认框中允许连接' : '请在系统 WiFi 列表中连接设备热点',
              icon: 'none'
            })
          })
        } else {
          uni.showToast({ title: '请在系统 WiFi 列表中连接设备热点', icon: 'none' })
        }
      },
      fail: () => { _guideShowing = false }
    })
  } catch (e) {
    _guideShowing = false
  }
}

/**
 * 连接设备前的 WiFi 检查。
 *
 * @param {Object}  options
 * @param {boolean} options.autoConnect   是否尝试自动连接（默认 true）
 * @param {boolean} options.guide         未连上时是否弹窗引导（默认 true）
 * @param {boolean} options.forceConnect  忽略冷却时间再试一次（用户主动刷新时）
 * @param {string}  options.ssid          指定目标热点，缺省用本地保存的
 * @param {boolean} options.silentUi     自动检查时不弹全局 loading（进页面首次检查用）
 * @param {Function} options.isActive     可选，返回 false 表示调用页已离开，不再弹任何 UI
 * @returns {Promise<{ok: boolean, status: string, ssid: string, target: string}>}
 *          status: device | unknown | auto-connected | other
 */
export function ensureDeviceWifi(options = {}) {
  const autoConnect = options.autoConnect !== false
  const guide = options.guide !== false
  const force = !!options.forceConnect
  const silentUi = options.silentUi === true
  const isActive = typeof options.isActive === 'function' ? options.isActive : null

  return readCurrentSsid().then(current => {
    logLine('WiFi', '前置检测：当前热点=' + (current || '读不到') + '，目标=' + (options.ssid || '本地保存'))
    if (isDeviceWifi(current)) {
      logLine('WiFi', '已在设备热点上，直接连接')
      return { ok: true, status: 'device', ssid: current, target: current }
    }

    const saved = getSavedWifi()
    const target = normalizeSsid(options.ssid) || saved.ssid

    // 读不到当前 WiFi：权限 / 平台限制，放行原有连接流程，避免误报
    if (!current) {
      console.warn('[设备WiFi] 读不到当前 WiFi，跳过检测，按原流程连接')
      logLine('WiFi', '读不到热点名称 → status=unknown，按原流程放行（可能是「附近的设备」权限被禁）')
      return { ok: true, status: 'unknown', ssid: '', target }
    }

    // 二维码里可能写的是非 GCNZ 开头的自定义热点名；只要当前连的正是
    // 保存的那个热点，就算已连上，不能因为前缀不匹配反复弹窗。
    if (target && current === target) {
      logLine('WiFi', '当前热点与保存目标一致，视为已连上')
      return { ok: true, status: 'device', ssid: current, target }
    }

    // 读 SSID 是异步的，返回时页面可能已退出：不自动连接、不弹窗、不 loading
    if (isActive && !isActive()) {
      return { ok: false, status: 'other', ssid: current, target }
    }

    const tryAutoConnect = () => {
      if (!autoConnect || !target) {
        logLine('WiFi', '无保存的热点凭据 / 已禁用自动重连，跳过')
        return Promise.resolve(false)
      }
      const now = Date.now()
      if (!force && now - _lastAutoConnectAt < AUTO_CONNECT_COOLDOWN_MS) {
        console.warn('[设备WiFi] 处于自动连接冷却期，跳过本次尝试')
        logLine('WiFi', '处于自动连接冷却期，跳过本次尝试')
        return Promise.resolve(false)
      }
      // 上一次已经撞上系统限制（如 12001 已保存配置删不掉），冷却期内
      // 不再重复发起注定失败的自动连接，直接交给引导弹窗。
      if (!force && now - _lastUnsupportedAt < UNSUPPORTED_SKIP_MS) {
        logLine('WiFi', '上次连接被系统限制，跳过自动重连，直接引导')
        return Promise.resolve(false)
      }
      _lastAutoConnectAt = now
      logLine('WiFi', '当前热点=' + current + '，尝试自动重连到 ' + target)
      return connectWifi(target, saved.password, isActive, { silentUi }).then(ok => {
        if (!ok) {
          logLine('WiFi', '自动重连未成功（connectWifi 失败 / 超时）')
          return false
        }
        // 部分机型 connectWifi 的 success 只代表「请求已受理」，需复核当前热点。
        // 自定义热点名同样算连上，不能只认 GCNZ 前缀。
        return readCurrentSsid().then(after => {
          if (after && (isDeviceWifi(after) || (target && after === target))) {
            logLine('WiFi', '自动重连成功，复核热点=' + after)
            return after
          }
          console.warn('[设备WiFi] 连接请求已受理，但热点尚未切换:', after || '(未知)')
          logLine('WiFi', '连接请求已受理，但热点尚未切换：' + (after || '读不到'))
          return false
        })
      })
    }

    return tryAutoConnect().then(after => {
      if (after) {
        return { ok: true, status: 'auto-connected', ssid: after, target }
      }
      logLine('WiFi', '未能连上设备热点 → status=other' + (guide ? '，弹出引导' : ''))
      if (guide) showWifiGuide(target, isActive)
      return { ok: false, status: 'other', ssid: current, target }
    })
  }).catch(e => {
    // 检测本身出错也不能阻断原有连接流程
    console.warn('[设备WiFi] 检测异常，按原流程连接:', e)
    logLine('WiFi', '检测异常，按原流程放行：' + String((e && e.message) || e))
    return { ok: true, status: 'unknown', ssid: '', target: '' }
  })
}
