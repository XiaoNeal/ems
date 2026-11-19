/**
 * 「系统权限」页的数据与能力：权限清单、状态检测、跳转系统设置。
 *
 * 设计参考小米运动健康「我的 → 系统权限」：逐项说明权限用途、显示当前状态、
 * 点击直达系统设置。结合本应用现场问题（部分荣耀 / 华为机型重装后把
 * 「附近的设备」默认置为禁止，导致连不上设备热点），把「附近的设备」
 * 与「位置信息」放在最前面。
 *
 * 状态口径（重要，勿随意改成一律显示「已允许」）：
 *  - 能可靠检测的：ACCESS_FINE_LOCATION、CAMERA（标准运行时权限）、
 *    REQUEST_INSTALL_PACKAGES（API 26+ canRequestPackageInstalls）；
 *  - 不能可靠检测的：附近的设备（国产 ROM 聚合开关，无公开 API）、
 *    通知（未声明 POST_NOTIFICATIONS，各 ROM 口径不一致）、剪贴板（无公开
 *    API）——统一显示「前往查看」，绝不冒充能检测，避免误导用户。
 *
 * 面向用户的文案统一使用易懂表述，不出现底层通信协议术语。
 */

import { openPermissionSettings } from './device-permission.js'

export const STATE_GRANTED = 'granted'
export const STATE_DENIED = 'denied'
export const STATE_UNKNOWN = 'unknown'

/** 安卓应用清单：与 manifest.json 中实际声明 / 系统权限页中实际出现的项对应 */
const APP_ITEMS = [
  {
    key: 'location',
    title: '位置信息权限',
    desc: '连接设备热点时，需要读取当前连接的 WiFi 名称以确认设备；不会获取或上传您的实际位置。',
    setting: 'appDetails'
  },
  {
    key: 'nearby',
    title: '附近的设备权限',
    desc: '用于发现并连接附近的设备热点；若连接失败，请重点确认本项与「位置信息」已允许。',
    setting: 'appDetails'
  },
  {
    key: 'camera',
    title: '相机权限',
    desc: '用于扫描设备二维码，快速读取设备热点信息。',
    setting: 'appDetails'
  },
  {
    key: 'notification',
    title: '通知权限',
    desc: '用于接收设备告警与运行提醒消息。',
    setting: 'notification'
  },
  {
    key: 'clipboard',
    title: '剪贴板权限',
    desc: '用于一键复制设备热点密码，方便您在系统 WiFi 设置中粘贴。',
    setting: 'appDetails'
  },
  {
    key: 'install',
    title: '应用内安装其他应用权限',
    desc: '用于在下载完成后安装本应用的新版本，不会安装其它来源的应用。',
    setting: 'installUnknownSource'
  }
]

/** 微信小程序：权限由微信统一管理，只保留与本应用功能直接相关的两项 */
const MP_ITEMS = [
  {
    key: 'location',
    title: '位置信息权限',
    desc: '连接设备热点时，需要读取当前连接的 WiFi 名称以确认设备；不会获取或上传您的实际位置。',
    setting: 'mpSetting'
  },
  {
    key: 'camera',
    title: '相机权限',
    desc: '用于扫描设备二维码，快速读取设备热点信息。',
    setting: 'mpSetting'
  }
]

function isAppEnv() {
  return typeof plus !== 'undefined'
}

function isAndroidApp() {
  return isAppEnv() && !!plus.android
}

/** 小程序端判断：APP 里不存在 wx，用 isAppEnv 先排除，避免误判 */
function isWeixinMp() {
  return !isAppEnv() && typeof wx !== 'undefined' && typeof wx.getSetting === 'function'
}

/** 当前页所处的平台与环境能力 */
export function getPermissionItems() {
  if (isWeixinMp()) {
    return {
      platform: 'mp',
      manageable: true,
      items: MP_ITEMS.slice(),
      intro: '以下为本应用所需的系统权限及当前授权状态，仅在使用对应功能时申请。',
      tip: '点按任意一项前往小程序设置；返回本页或下拉刷新后会更新授权状态，「前往查看」的权限由微信管理。',
      allLinkText: '前往小程序设置'
    }
  }
  if (isAppEnv()) {
    return {
      platform: 'app',
      manageable: true,
      items: APP_ITEMS.slice(),
      intro: '以下为本应用所需的系统权限及当前授权状态，仅在使用对应功能时申请。',
      tip: '点按任意一项前往系统设置；返回本页或下拉刷新后会更新授权状态，「前往查看」的开关由手机系统管理。',
      allLinkText: '查看全部权限'
    }
  }
  return {
    platform: 'h5',
    manageable: false,
    items: APP_ITEMS.slice(),
    intro: '以下为本应用运行所需的系统权限说明。',
    tip: '当前环境不支持管理系统权限，请在手机 APP 或微信小程序中查看。',
    allLinkText: '查看全部权限'
  }
}

/** 标准运行时权限查询；查询失败返回 unknown，不据此判定为「已禁止」 */
function checkDeclaredPermission(perm) {
  if (!isAndroidApp()) return STATE_UNKNOWN
  try {
    const main = plus.android.runtimeMainActivity()
    if (!main) return STATE_UNKNOWN
    const r = plus.android.invoke(main, 'checkSelfPermission', perm)
    return Number(r) === 0 ? STATE_GRANTED : STATE_DENIED
  } catch (e) {
    return STATE_UNKNOWN
  }
}

/** 应用内安装权限：API 26+ 有公开查询接口；低版本系统无此开关，按未知处理 */
function checkInstallPermission() {
  if (!isAndroidApp()) return STATE_UNKNOWN
  try {
    const V = plus.android.importClass('android.os.Build$VERSION')
    const sdk = Number(V && V.SDK_INT) || 0
    if (sdk < 26) return STATE_UNKNOWN
    const main = plus.android.runtimeMainActivity()
    const pm = plus.android.invoke(main, 'getPackageManager')
    const allowed = plus.android.invoke(pm, 'canRequestPackageInstalls')
    return allowed ? STATE_GRANTED : STATE_DENIED
  } catch (e) {
    return STATE_UNKNOWN
  }
}

function authState(authSetting, scope) {
  if (!authSetting || authSetting[scope] === undefined) return STATE_UNKNOWN
  return authSetting[scope] === true ? STATE_GRANTED : STATE_DENIED
}

/**
 * 刷新权限状态。返回 Promise，兼容小程序端异步的 getSetting。
 * 从系统设置 / 小程序设置返回时由页面 onShow 重新调用，用户下拉刷新时也会重新调用。
 */
export function getPermissionStates() {
  if (isWeixinMp()) {
    return new Promise(resolve => {
      const fallback = { location: STATE_UNKNOWN, camera: STATE_UNKNOWN }
      try {
        uni.getSetting({
          success: res => {
            const auth = (res && res.authSetting) || {}
            resolve({
              location: authState(auth, 'scope.userLocation'),
              camera: authState(auth, 'scope.camera')
            })
          },
          fail: () => resolve(fallback)
        })
      } catch (e) {
        resolve(fallback)
      }
    })
  }
  return Promise.resolve({
    location: checkDeclaredPermission('android.permission.ACCESS_FINE_LOCATION'),
    nearby: STATE_UNKNOWN,
    camera: checkDeclaredPermission('android.permission.CAMERA'),
    notification: STATE_UNKNOWN,
    clipboard: STATE_UNKNOWN,
    install: checkInstallPermission()
  })
}

/** 状态文案：模块级纯函数，避免小程序端把函数当 props 传递后 this 指向异常 */
export function getStateText(state) {
  if (state === STATE_GRANTED) return '已允许'
  if (state === STATE_DENIED) return '去开启'
  return '前往查看'
}

/**
 * 直达「应用内安装其他应用」与「通知」的系统开关页；
 * 系统版本不支持或 ROM 不兼容时返回 false，由调用方回退到通用应用详情页。
 */
function openSpecialSettings(type) {
  if (!isAndroidApp()) return false
  try {
    const Intent = plus.android.importClass('android.content.Intent')
    const Settings = plus.android.importClass('android.provider.Settings')
    const Uri = plus.android.importClass('android.net.Uri')
    const main = plus.android.runtimeMainActivity()
    const pkg = String(plus.android.invoke(main, 'getPackageName'))
    const action = type === 'install'
      ? Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES
      : Settings.ACTION_APP_NOTIFICATION_SETTINGS
    if (!action) return false
    const intent = new Intent(action)
    if (type === 'install') {
      intent.setData(Uri.fromParts('package', pkg, null))
    } else {
      plus.android.invoke(intent, 'putExtra', 'android.provider.extra.APP_PACKAGE', pkg)
    }
    main.startActivity(intent)
    return true
  } catch (e) {
    return false
  }
}

/** 点击某一项：优先直达对应开关页，失败回退到应用详情 / 应用权限页 */
export function openPermissionPage(item) {
  const target = item && item.setting
  if (isWeixinMp()) {
    try {
      uni.openSetting({})
      return true
    } catch (e) {
      return false
    }
  }
  if (!isAndroidApp()) return false
  if (target === 'installUnknownSource' && openSpecialSettings('install')) return true
  if (target === 'notification' && openSpecialSettings('notification')) return true
  return openPermissionSettings()
}
