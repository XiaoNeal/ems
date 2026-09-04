/**
 * uni-app WebSocket 适配器
 *
 * 用途：把 mqtt.js 期望的 WHATWG 浏览器 WebSocket API 适配到 uni.connectSocket
 *   - H5/浏览器环境原生有 WebSocket，不替换
 *   - App (Android/iOS) / 小程序环境无全局 WebSocket，注册本适配器
 *
 * 这样 mqtt.js 在所有 uni-app 平台都能用，且天然跨平台（无需 plus.android / plus.ios 桥接）
 */

// WHATWG WebSocket readyState 常量
const CONNECTING = 0
const OPEN = 1
const CLOSING = 2
const CLOSED = 3

export class UniappWebSocketAdapter {
  constructor(url, protocols, options) {
    this.url = url
    this.protocols = protocols
    this.readyState = CONNECTING
    this.binaryType = 'arraybuffer'   // mqtt.js 默认按 ArrayBuffer 接收二进制
    this.bufferedAmount = 0
    this.extensions = ''
    this.protocol = ''

    // 事件处理器（赋值式）
    this.onopen = null
    this.onmessage = null
    this.onclose = null
    this.onerror = null
    // addEventListener 形式（mqtt.js 通过 onmessage 调用，简单实现即可）
    this._listeners = { open: [], message: [], close: [], error: [] }

    // 调用 uni.connectSocket 创建底层 socket
    // 注意：必须给 socketTask 引用，否则无法调用 send/close
    // 构造参数：没有实际子协议时不传 protocols 字段（避免触发 WebSocket 子协议协商）
    const connectOpts = {
      url,
      fail: (err) => {
        // 同步失败：直接触发 error
        this._fire('error', { type: 'error', message: (err && err.errMsg) || 'connectSocket failed' })
      }
    }
    const resolvedProtocols = Array.isArray(protocols) ? protocols : (protocols ? [protocols] : null)
    if (resolvedProtocols && resolvedProtocols.length > 0) {
      connectOpts.protocols = resolvedProtocols
    }
    this._socketTask = uni.connectSocket(connectOpts)

    if (this._socketTask) {
      this._socketTask.onOpen(() => {
        this.readyState = OPEN
        this._fire('open', { type: 'open' })
      })
      this._socketTask.onMessage((res) => {
        // res.data 可能是 string 或 ArrayBuffer
        // mqtt.js 期望 Buffer/Uint8Array，需要把 ArrayBuffer 包成 Uint8Array
        let data = res.data
        if (data instanceof ArrayBuffer) {
          data = new Uint8Array(data)
        } else if (data && typeof data === 'object' && !ArrayBuffer.isView(data) && typeof data !== 'string') {
          // 某些平台可能返回 { data: ... } 包装
          if (data.data instanceof ArrayBuffer) {
            data = new Uint8Array(data.data)
          }
        }
        this._fire('message', { type: 'message', data })
      })
      this._socketTask.onClose((res) => {
        this.readyState = CLOSED
        this._fire('close', {
          type: 'close',
          code: res && res.code,
          reason: res && res.reason,
          wasClean: !!(res && res.wasClean)
        })
      })
      this._socketTask.onError((err) => {
        this._fire('error', { type: 'error', message: (err && err.errMsg) || 'socket error' })
      })
    }
  }

  /**
   * 发送数据。mqtt.js 调用时 data 通常是 Buffer (Uint8Array) 或 string
   * uni.connectSocket.send 接受 { data: string | ArrayBuffer }
   */
  send(data) {
    if (this.readyState !== OPEN) {
      throw new Error('WebSocket is not in OPEN state')
    }
    let payload = data
    if (data && typeof data !== 'string') {
      if (ArrayBuffer.isView(data)) {
        // Uint8Array / Buffer 等 ArrayBufferView -> 取底层 ArrayBuffer 的视图切片
        const ab = data.buffer
        const offset = data.byteOffset || 0
        const len = data.byteLength
        // 如果不是从 0 开始或长度不等于整个 buffer，需要 slice 一份
        payload = (offset === 0 && len === ab.byteLength) ? ab : ab.slice(offset, offset + len)
      } else if (data instanceof ArrayBuffer) {
        payload = data
      } else {
        // 其他类型降级为字符串
        payload = String(data)
      }
    }
    this._socketTask.send({
      data: payload,
      fail: (err) => {
        this._fire('error', { type: 'error', message: (err && err.errMsg) || 'send failed' })
      }
    })
  }

  close(code, reason) {
    if (this.readyState === CLOSED || this.readyState === CLOSING) return
    this.readyState = CLOSING
    try {
      this._socketTask && this._socketTask.close({ code, reason })
    } catch (e) {
      // 忽略
    }
  }

  // ---------- 事件分发 ----------
  _fire(type, evt) {
    // on{type} 形式
    const handler = this['on' + type]
    if (typeof handler === 'function') {
      try { handler.call(this, evt) } catch (e) { console.error('WebSocket handler error:', e) }
    }
    // addEventListener 形式
    const arr = this._listeners[type] || []
    for (const fn of arr) {
      try { fn.call(this, evt) } catch (e) { console.error('WebSocket listener error:', e) }
    }
  }

  addEventListener(type, listener) {
    if (!this._listeners[type]) this._listeners[type] = []
    this._listeners[type].push(listener)
  }
  removeEventListener(type, listener) {
    if (!this._listeners[type]) return
    this._listeners[type] = this._listeners[type].filter(fn => fn !== listener)
  }

  dispatchEvent(evt) {
    if (!evt || !evt.type) return
    this._fire(evt.type, evt)
  }
}

// 静态常量
UniappWebSocketAdapter.CONNECTING = CONNECTING
UniappWebSocketAdapter.OPEN = OPEN
UniappWebSocketAdapter.CLOSING = CLOSING
UniappWebSocketAdapter.CLOSED = CLOSED

/**
 * 在 mqtt.js 被使用前注册到全局（如缺失）
 */
export function ensureWebSocketShim() {
  const g = (typeof globalThis !== 'undefined') ? globalThis
          : (typeof global !== 'undefined') ? global
          : (typeof window !== 'undefined') ? window
          : null
  if (!g) return
  if (typeof g.WebSocket === 'undefined' || g.WebSocket === null) {
    g.WebSocket = UniappWebSocketAdapter
    // 同时挂常量
    g.WebSocket.CONNECTING = CONNECTING
    g.WebSocket.OPEN = OPEN
    g.WebSocket.CLOSING = CLOSING
    g.WebSocket.CLOSED = CLOSED
  }
}
