/**
 * 实时数据非响应式仓库（直连设备监测页）
 *
 * 背景：uni-app 小程序端每次 patch 都会执行 vendor.js 的 cloneWithData()，
 * 把 vm._data + 所有 computed 的返回值整体深拷贝一遍再 diff。
 * 实时数据（activeRv 快照 / formattedValues）过去挂在页面 data 里并作为
 * props 传给 6 个常驻 tab，等于每 1.5s 把几百个寄存器字段 × 7 份
 * 反复深拷贝 + 过桥，这正是「MQTT 一连上、实时数据一显示就卡」的根源。
 *
 * 现在这些数据放在模块级普通对象里（Vue 观测不到），面板组件通过
 * subscribe() 订阅变化：数据更新时只递增面板内部的 rtVer，只有当前这
 * 一个可见面板重渲染，父页面完全不参与收帧的 render。
 *
 * 契约：
 *   1) 只读 getFormatted/getSnapshot/getBucket，写入一律走本文件的方法；
 *   2) setSnapshot / patchFormatted / resetFormatted 必须 notify()；
 *      面板组件用 realtime-subscribe mixin 订阅并在销毁时退订；
 *   3) 页面退出 / MQTT 断开必须调 resetRealtimeStore()，避免跨次残留；
 *   4) 不要把仓库数据重新挂回 Vue data / props，也不要让父页面模板
 *      间接依赖 storeVer，否则每帧提交又会拖整页 render。
 */

/** 冻结空对象：无数据时给子组件用，引用恒定 */
const EMPTY = Object.freeze({})

/** 全部寄存器桶：dt -> frozen bucket（页面业务代码 this.rawValues 读这里） */
const rawStore = Object.create(null)

/** 当前激活 tab 的桶快照：{ dt: frozen bucket }（tab 组件 this.rawValues 读这里） */
let snapshot = EMPTY

/** 预格式化显示值（OverviewTab 与各 tab 的 formattedValues 读这里） */
const formatted = {
  archDeviceCounts: { dljQuantity: 0, cdzQuantity: 0, lightQuantity: 0, unknownDeviceQuantity: 0 },
  archSocNumeric: 0,
  archStorageStatusGradient: '#8c8c8c'
}

/** 快照版本号：每次重建 activeRv 递增 */
let snapVer = 0
/** 格式化值版本号：formattedValues 中有键真正变化时递增 */
let fmtVer = 0

/**
 * 订阅者：当前可见的面板组件。
 * 以前数据刷新靠父页面把数字版本号作为 props 往下传，父页面每次收帧都要
 * 整页 render 一遍（navbar / 设备卡 / 标签栏 / 底部栏全部重建 vnode），
 * 才能把新版本号送到唯一的可见面板。现在面板自己订阅仓库，收帧只通知
 * 那一个组件，父页面完全不参与数据帧的渲染。
 */
const listeners = []

/**
 * 当前可见面板的 rtKey。
 * 面板改成「挂载后 v-show 常驻」后，仓库里会有多个订阅者；若每 1.5s
 * 的提交把全部订阅者都叫醒，隐藏面板也会整片重渲染，等于把之前的
 * 卡顿又请回来。notify() 只通知 activeKey 对应的那一个面板。
 * 兼容：没有传 rtKey 的订阅者（key 为 null）不做过滤，始终通知。
 */
let activeKey = null

function notify() {
  for (let i = 0; i < listeners.length; i++) {
    const l = listeners[i]
    if (activeKey != null && l.key != null && l.key !== activeKey) continue
    try { l.fn() } catch (e) { /* 单个订阅者异常不影响其他人 */ }
  }
}

/**
 * 切换可见面板。必须在 currentTab 赋值 / _rebuildActiveRv() 之前调用：
 *   - 旧面板不会再收到本次切 tab 的快照通知（白 render 一次）；
 *   - 新面板若已经挂载，在这里补一次刷新（隐藏期间的数据变化此前没通知它）；
 *   - 新面板若是首次挂载，没有订阅者，落空也没关系 —— 挂载时的首帧 render
 *     本来就会从仓库读最新值。
 */
export function setActiveKey(key) {
  if (activeKey === key) return
  activeKey = key
  for (let i = 0; i < listeners.length; i++) {
    if (listeners[i].key === key) {
      try { listeners[i].fn() } catch (e) { /* 同上 */ }
    }
  }
}

/** 订阅数据变化，返回退订函数（组件 beforeDestroy 必须调用） */
export function subscribe(fn, key) {
  if (typeof fn !== 'function') return () => {}
  const entry = { fn, key: key || null }
  listeners.push(entry)
  return function unsubscribe() {
    const i = listeners.indexOf(entry)
    if (i !== -1) listeners.splice(i, 1)
  }
}

/**
 * 页头「更新 HH:MM:SS」专用的帧时钟（与数据提交节流完全解耦）
 *
 * 以前这个时间戳挂在页面 data 里，还额外做了 4s 节流：注释理由是「整页
 * 重渲染不便宜」。但设备每秒上报，页头却 4~6s 才跳一次，看起来像掉线。
 * 现在时间戳放在模块级普通变量里，由 DeviceCard 自己订阅：收到有效帧
 * 就按「秒」去重打点，每秒最多通知一次，且只重渲染设备卡里的一个文本，
 * 父页面完全不参与 —— 既真实反映上报节奏，又不会拖整页 render。
 *
 * 注意：帧时钟走独立通道，不复用 notify()。notify() 只唤醒当前可见面板，
 * 而且绑在数据提交上（1.5s），拿它当心跳会把时间戳重新绑回节流链路。
 */
let lastFrameAt = 0
let frameTickSec = -1
const frameTickListeners = []

/**
 * 收到一帧有效实时数据时打点。同一秒内多帧（六台设备 / 分段上报）只通知一次。
 * 打点在「收到帧」而非「数据有变化」：设备稳态上报相同数值时时间戳照样走。
 */
export function markFrame(ts) {
  lastFrameAt = ts || Date.now()
  const sec = Math.floor(lastFrameAt / 1000)
  if (sec === frameTickSec) return
  frameTickSec = sec
  for (let i = 0; i < frameTickListeners.length; i++) {
    try { frameTickListeners[i](lastFrameAt) } catch (e) { /* 单个订阅者异常不影响其他人 */ }
  }
}

export function getLastFrameAt() {
  return lastFrameAt
}

/** 订阅帧时钟，返回退订函数（组件 beforeDestroy 必须调用） */
export function subscribeFrameTick(fn) {
  if (typeof fn !== 'function') return () => {}
  frameTickListeners.push(fn)
  return function unsubscribe() {
    const i = frameTickListeners.indexOf(fn)
    if (i !== -1) frameTickListeners.splice(i, 1)
  }
}

/** 断开 / 重连 / 页面进入：清掉旧连接的时间，回到 '--' */
export function resetFrameTick() {
  lastFrameAt = 0
  frameTickSec = -1
  for (let i = 0; i < frameTickListeners.length; i++) {
    try { frameTickListeners[i](0) } catch (e) { /* 同上 */ }
  }
}

export function getBucket(dt) {
  return rawStore[dt] || EMPTY
}

export function getAllBuckets() {
  return rawStore
}

export function setBucket(dt, bucket) {
  rawStore[dt] = bucket
}

/** 取当前 tab 的桶快照（tab 组件 computed 用） */
export function getSnapshot() {
  return snapshot
}

/** 重建快照：只在切 tab / 提交新值时调用，引用变化驱动子组件重渲染 */
export function setSnapshot(next) {
  snapshot = Object.freeze(next || {})
  snapVer++
  notify()
  return snapshot
}

export function getSnapVer() {
  return snapVer
}

/** 取预格式化显示值（tab 组件 computed 用） */
export function getFormatted() {
  return formatted
}

/**
 * 增量写格式化值：值没变就不递增版本号。
 * @param {boolean} silent 只写仓库不通知。切 tab 时用：新面板首帧 render
 *        本来就会读到这些新值，再 notify 一次等于让刚画完的面板白重渲染一遍。
 * @returns {boolean} 是否有键真的变了
 */
export function patchFormatted(next, silent) {
  let changed = false
  const keys = Object.keys(next || {})
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]
    if (formatted[k] !== next[k]) {
      formatted[k] = next[k]
      changed = true
    }
  }
  if (changed) {
    fmtVer++
    if (!silent) notify()
  }
  return changed
}

export function getFmtVer() {
  return fmtVer
}

/** 重置格式化值到初始态（MQTT 断开 / 页面卸载时调用） */
export function resetFormatted() {
  const keys = Object.keys(formatted)
  for (let i = 0; i < keys.length; i++) delete formatted[keys[i]]
  formatted.archDeviceCounts = { dljQuantity: 0, cdzQuantity: 0, lightQuantity: 0, unknownDeviceQuantity: 0 }
  formatted.archSocNumeric = 0
  formatted.archStorageStatusGradient = '#8c8c8c'
  fmtVer++
  notify()
}

/** 清空全部数据（页面卸载 / MQTT 断开时调用） */
export function resetRealtimeStore() {
  activeKey = null
  const keys = Object.keys(rawStore)
  for (let i = 0; i < keys.length; i++) delete rawStore[keys[i]]
  snapshot = EMPTY
  snapVer++
  resetFormatted()
  resetFrameTick()
}
