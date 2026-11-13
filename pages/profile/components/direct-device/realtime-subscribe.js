/**
 * 实时数据订阅 mixin（直连设备监测页的各 tab 面板共用）
 *
 * 背景：APP 端是 webview + Vue vdom，父页面每 render 一次都要重建
 * navbar / 设备卡 / 标签栏 / 底部栏的 vnode。以前收帧后靠父页面把数字
 * 版本号作为 props 传给唯一的可见面板，等于每 1.5s 都拖着整页 render。
 *
 * 现在面板组件自己订阅 realtime-store：数据变化时只递增本组件内的
 * rtVer，只有这一个面板重渲染，父页面完全不参与数据帧。
 *
 * 用法：
 *   import { realtimeSubscribe } from '../realtime-subscribe.js'
 *   export default { mixins: [realtimeSubscribe], computed: { xxx() { void this.rtVer; ... } } }
 */
import { subscribe } from './realtime-store.js'

export const realtimeSubscribe = {
  props: {
    /** 面板标识：仓库只通知当前可见的那个面板，隐藏面板不陪着每 1.5s 重渲染 */
    rtKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return { rtVer: 0 }
  },
  created() {
    // 同一 tick 内 setSnapshot / patchFormatted 可能各通知一次，
    // rtVer 连续 ++ 会被 Vue 合并成一次 render。
    this._rtUnsubscribe = subscribe(() => {
      this.rtVer++
    }, this.rtKey || null)
  },
  beforeDestroy() {
    if (this._rtUnsubscribe) {
      this._rtUnsubscribe()
      this._rtUnsubscribe = null
    }
  }
}
