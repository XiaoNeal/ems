/**
 * 直连设备页「设置参数仓库」——非响应式单例。
 *
 * 背景（uni-app / Vue2 小程序端）：
 *   vendor.js 的 cloneWithData(vm) 每轮 patch 都会把
 *   Object.keys(vm._data) + Object.keys(vm._computedWatchers) 里的每一项取出来，
 *   再用 cloneDeepCircles 深拷贝一份交给 diff()。
 *   13 个设置参数数组（50kW 下几百项 × 十几个字段，且每项还带 options 子数组）
 *   只要还挂在页面 data 或 computed 上，不管这一轮有没有变化、当前是不是设置页，
 *   都会被完整深拷贝 + 逐键 diff —— 这就是「切 tab、点按钮、收帧样样卡」的根因。
 *
 * 做法：
 *   参数数组统一放在本模块的普通对象里（Vue 观察不到），页面/子组件通过
 *   `this.xxxParams` 的不可枚举 getter 读写，业务代码一行不用改。
 *   回显值变化时通过 subscribeParamChange/notifyParamChange 通知订阅者，
 *   只让当前可见的设置面板重渲染，父页面不必陪着整页 render。
 *
 * 注意：本模块是页面级单例，只有一个直连设备页实例，无需按实例分桶。
 */
export const PARAM_KEYS = [
  'bmsNumericParams',
  'bmsSwitchParams',
  'bmsPowerParams',
  'pcsNumericParams',
  'pcsSwitchParams',
  'pvNumericParams',
  'pvSwitchParams',
  'storageNumericParams',
  'storageSwitchParams',
  'quickControlParams',
  'quickPowerParams',
  'liquidSwitchParams',
  'liquidNumericParams'
]

/** 非响应式参数仓库；key 与 SETTINGS_PANELS*.dataKey 一一对应 */
export const paramStore = {}
PARAM_KEYS.forEach(key => { paramStore[key] = [] })

/**
 * 重建某个面板的参数数组（协议切换 / 首次预热时调用）。
 * 直接替换数组引用即可：本仓库不受 Vue 观测，不需要 $set。
 */
export function setParamList(key, list) {
  paramStore[key] = list || []
}

/** 页面退出时清空，避免下次进入页面残留上一台设备的参数 */
export function resetParamStore() {
  PARAM_KEYS.forEach(key => { paramStore[key] = [] })
}

/**
 * 参数回显订阅者（目前只有 SettingsPanel）。
 * 以前回显值变化靠页面 data 里的回显版本号递增 + props 下传，
 * 等于每次回显都让父页面整页 render 一次才能通知到这一个面板。
 * 现在面板自己订阅，通知只落在面板内部。
 */
const listeners = []

export function subscribeParamChange(fn) {
  if (typeof fn !== 'function') return () => {}
  listeners.push(fn)
  return function unsubscribe() {
    const i = listeners.indexOf(fn)
    if (i !== -1) listeners.splice(i, 1)
  }
}

/** 参数值 / 数组结构变化后调用，推一次面板重渲染 */
export function notifyParamChange() {
  for (let i = 0; i < listeners.length; i++) {
    try { listeners[i]() } catch (e) { /* 单个订阅者异常不影响其他人 */ }
  }
}
