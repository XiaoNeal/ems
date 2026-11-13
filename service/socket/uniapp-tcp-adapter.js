/**
 * uni-app TCP Socket 适配器
 *
 * 把原生 TCP Socket 封装成与 UniappWebSocketAdapter 相同的 WHATWG WebSocket 风格接口，
 * 这样 light-mqtt-client.js 可以无差别使用 TCP 或 WebSocket 传输 MQTT 报文。
 *
 * 平台支持：
 *   - 微信小程序 (基础库 >= 2.7.0)：wx.createTCPSocket() 原生 TCP
 *   - App (Android/iOS)：通过 UTS 插件或降级 WebSocket
 *   - H5：降级 WebSocket
 */

// WHATWG WebSocket readyState 常量（与 UniappWebSocketAdapter 保持一致）
import { logLine } from '../../utils/device-log.js'

const CONNECTING = 0
const OPEN = 1
const CLOSING = 2
const CLOSED = 3

/**
 * APP(Android) plus.android 读取循环的空闲轮询间隔（毫秒）。
 *
 * 「APP 切 tab 偶发 0.6~1.6s 冻结」的根因已由 11:08 真机日志定量确认：
 * 小程序走 wx.createTCPSocket 的事件回调，收数据不占 JS 线程；APP 无该 API，
 * 降级到 plus.android Java Socket，由 JS 轮询 available()，再对收到的每个字节
 * 调用一次 read() —— 全是同步 JS↔原生桥调用。日志显示 桥读≈4000/s 而
 * TCP轮询只有 1~19/s，即单次 readLoop 一次连续做了几千次桥调用，构成 1 秒级
 * 同步长任务；切 tab 的 render patch 排在它后面，就被记成 1461/1538ms 全在
 * 「patch 段」。不是 V8 GC，也不是 Vue/DOM 规模。
 *
 * 20ms 只用于「空闲」；有积压数据时见 TCP_MAX_READ_PER_TICK 的续读逻辑。
 * A/B：改回 10 = 旧行为。
 */
const TCP_POLL_INTERVAL_MS = 20

/**
 * 单次 readLoop 最多读多少字节（= 最多多少次同步 read() 桥调用）。
 *
 * 纯 NJS 无法批量读：Java byte[] 是「传出参数」，plus.android 桥接不可靠，
 * 就算能传进去，取回内容仍要逐字节 getAttribute，省不了桥调用（这也是原实现
 * 注释「逐字节 read(int) 绕过 JSB byte[] 桥」的由来）。因此根治要 UTS/原生插件
 * 把读循环放进原生线程，或让 Broker 提供 WebSocket 端口改用事件回调。
 *
 * 在不动传输层的前提下，把「一次读几千字节」切成「每次最多 128 字节 + 让出
 * 一次事件循环」：单次同步长任务从 ~1.5s 降到几十毫秒，Vue 的 nextTick
 * (microtask) 能在每个切片之间插进来，切 tab 不再被整段吞掉。
 * LightMqttClient._onSocketMessage 有 _recvBuffer 按 MQTT 固定头组包、不足即
 * break 等下一片，任意分片安全；每片仍是一次完整 available 区间的字节，顺序不变。
 *
 * 注意这只切碎长任务、不减少桥调用总量（CPU 总占用不变），换来的是 UI 可响应。
 * A/B：改 8192 = 旧行为（复现 1.5s 冻结）；改 64 = 更细粒度但 setTimeout 更密。
 */
const TCP_MAX_READ_PER_TICK = 128

/** 热路径调试日志总开关：正式包必须关闭（每条 console.log 都要过一次原生日志桥） */
const TCP_DEBUG_LOG = false

/**
 * 供页面 [perf] 面板读取的桥调用计数（普通对象，非响应式、不发事件、不跨桥）。
 * 每 10s 由 direct-device.vue 的 _maybePerfReport 读出并清零。
 * maxPerTick / longTasks 用于验收切片是否生效：生效后 maxPerTick ≤ 128、longTasks=0。
 */
export const tcpReadStats = {
  polls: 0, reads: 0, bytes: 0, chunks: 0, maxPerTick: 0, longTasks: 0
}

/** 检查当前平台是否支持原生 TCP Socket */
function isTcpAvailable() {
  // 微信小程序：wx.createTCPSocket (基础库 >= 2.7.0)
  if (typeof wx !== 'undefined' && wx && typeof wx.createTCPSocket === 'function') {
    console.log('[TCP] wx.createTCPSocket 可用')
    return true
  }
  // uni-app App 端：uni.createTCPSocket (HBuilderX 3.x+)
  if (typeof uni !== 'undefined' && uni && typeof uni.createTCPSocket === 'function') {
    console.log('[TCP] uni.createTCPSocket 可用')
    return true
  }
  // uni-app App 端：plus.android 调用 Java Socket
  if (typeof plus !== 'undefined' && plus.android) {
    console.log('[TCP] plus.android 可用，可尝试 Java Socket')
    return true
  }
  console.log('[TCP] 原生 TCP Socket 不可用, wx=', typeof wx, 'uni=', typeof uni, 'plus=', typeof plus)
  logLine('网络', '当前平台无可用原生 TCP 通道')
  return false
}

export class UniappTcpAdapter {
  /**
   * @param {string} url 形如 tcp://192.168.1.33:1883
   */
  constructor(url, protocols, options) {
    // 解析 host:port
    const m = /^tcp:\/\/([^:\/]+):(\d+)/i.exec(url || '')
    if (!m) {
      throw new Error('TCP URL 格式错误，应为 tcp://host:port')
    }
    this.host = m[1]
    this.port = parseInt(m[2], 10)

    if (!isTcpAvailable()) {
      throw new Error('当前平台不支持原生 TCP Socket，请使用微信小程序（基础库 >= 2.7.0）或 App 构建')
    }

    this.url = url
    this.protocols = protocols
    this.readyState = CONNECTING
    this.binaryType = 'arraybuffer'
    this.bufferedAmount = 0
    this.extensions = ''
    this.protocol = ''

    this.onopen = null
    this.onmessage = null
    this.onclose = null
    this.onerror = null
    this._tcpSocket = null
    this._javaSocket = null
    this._listeners = { open: [], message: [], close: [], error: [] }

    try {
      // 优先用 wx/uni.createTCPSocket（微信小程序 & HBuilderX App）
      const tcpFactory = (typeof wx !== 'undefined' && wx && wx.createTCPSocket)
        ? wx.createTCPSocket.bind(wx)
        : (typeof uni !== 'undefined' && uni && uni.createTCPSocket)
          ? uni.createTCPSocket.bind(uni)
          : null

      if (tcpFactory) {
        let sock = null
        try {
          sock = tcpFactory()
        } catch (e) {
          // 微信在并发数超限时抛 "[TCPSocket] created too much."
          this.readyState = CLOSED
          logLine('网络', 'TCPSocket 创建抛异常：' + String((e && (e.message || e.errMsg)) || e))
          throw new Error('TCPSocket 创建失败：' + ((e && (e.message || e.errMsg)) || e))
        }
        // 配额耗尽时 createTCPSocket 可能返回 undefined，必须先校验再绑定事件，
        // 否则会变成 "Cannot read property 'onConnect' of undefined"
        if (!sock || typeof sock.onConnect !== 'function') {
          try { sock && typeof sock.close === 'function' && sock.close() } catch (e) {}
          this.readyState = CLOSED
          throw new Error('TCPSocket 创建失败：未返回有效实例（并发连接数已达上限 5 个），请关闭其他页面或重启小程序')
        }
        this._tcpSocket = sock
        console.log('[TCP] Socket 创建成功(wx/uni), 连接', this.host + ':' + this.port)
        logLine('网络', 'TCPSocket 创建成功，连接 ' + this.host + ':' + this.port)
        this._bindWxTcpEvents()
        try {
          sock.connect({ address: this.host, port: this.port })
        } catch (e) {
          this._closeUnderlying()
          this.readyState = CLOSED
          throw new Error('TCPSocket connect 失败：' + ((e && (e.message || e.errMsg)) || e))
        }
      } else if (typeof plus !== 'undefined' && plus.android) {
        // App 端降级：用 Java Socket
        console.log('[TCP] 使用 plus.android Java Socket, 连接', this.host + ':' + this.port)
        logLine('网络', 'App 端使用 Java Socket 连接 ' + this.host + ':' + this.port)
        this._connectWithPlusAndroid()
      } else if (typeof plus !== 'undefined' && plus.ios) {
        // iOS 端：用 OC Socket
        console.log('[TCP] 使用 plus.ios Socket, 连接', this.host + ':' + this.port)
        this._connectWithPlusIOS()
      } else {
        throw new Error('当前平台无可用 TCP API (wx/uni/plus 均不可用)')
      }
    } catch (e) {
      this.readyState = CLOSED
      const msg = String((e && (e.message || e.errMsg)) || e)
      // 传输层创建失败属于致命错误：向上抛，交由 createTransport 决定是否降级 / 上报
      // （不能吞掉后异步 fire error，否则调用方会拿到一个永远连不上的“空壳”适配器）
      if (/^TCPSocket 创建失败|^TCPSocket connect 失败|当前平台无可用 TCP API/.test(msg)) {
        this._closeUnderlying()
        throw new Error(msg)
      }
      setTimeout(() => this._fire('error', { type: 'error', message: msg }), 0)
    }
  }

  /** 绑定 wx/uni TCPSocket 事件 */
  _bindWxTcpEvents() {
    this._tcpSocket.onConnect(() => {
      console.log('[TCP] onConnect 触发!')
      logLine('网络', 'TCP 已连上设备（onConnect）')
      this.readyState = OPEN
      this._fire('open', { type: 'open' })
    })

    this._tcpSocket.onMessage((res) => {
    
      
      let payload = res && res.message
      if (payload && typeof payload === 'object' && typeof payload.byteLength === 'number') {
        try {
          if (ArrayBuffer.isView(payload)) {
            payload = new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength)
          } else {
            payload = new Uint8Array(payload)
          }
        } catch (e) {
          console.error('[TCP] Uint8Array 转换失败:', e.message)
        }
      }
        // console.log( payload)
      this._fire('message', { type: 'message', data: payload })
    })

    this._tcpSocket.onClose((res) => {
      console.log('[TCP] onClose, res=', JSON.stringify(res))
      logLine('网络', 'TCP 连接关闭')
      this.readyState = CLOSED
      this._fire('close', { type: 'close', code: res && res.code, reason: res && res.reason, wasClean: true })
    })

    this._tcpSocket.onError((err) => {
      const msg = (err && (err.errMsg || err.message || err.errCode))
        ? String(err.errMsg || err.message || err.errCode)
        : 'TCP socket error'
      console.log('[TCP] onError:', msg, JSON.stringify(err))
      // 这一条是现场判权限问题的关键：无「附近的设备」权限时，
      // 系统常回 EACCES / ENETUNREACH / EHOSTUNREACH / permission denied。
      logLine('网络', 'TCP 错误：' + msg)
      if (this.readyState === CONNECTING) {
        this.readyState = CLOSED
      }
      this._fire('error', { type: 'error', message: msg })
    })
  }

  /** App 端 plus.android Java Socket 连接 */
  _connectWithPlusAndroid() {
    try {
      const Socket = plus.android.importClass('java.net.Socket')
      const InetSocketAddress = plus.android.importClass('java.net.InetSocketAddress')

      const socket = new Socket()
      // 3 秒连接超时
      const addr = new InetSocketAddress(this.host, this.port)
      socket.connect(addr, 3000)

      // 关键：先把 Socket/InputStream/OutputStream 全量 importClass
      // 让所有方法直接桥接，以后 obj.method() 直接调，不用 plus.android.invoke
      plus.android.importClass(socket)
      this._javaSocket = socket
      this._javaInput = socket.getInputStream()
      this._javaOutput = socket.getOutputStream()
      plus.android.importClass(this._javaInput)
      plus.android.importClass(this._javaOutput)

      // 设置读取超时
      socket.setSoTimeout(2000)   // 2 秒超时，避免阻塞
      socket.setTcpNoDelay(true)

      console.log('[TCP] plus.android Socket 连接成功, isConnected=' + socket.isConnected())
      logLine('网络', 'Java Socket 已连上设备，isConnected=' + socket.isConnected())
      this.readyState = OPEN

      const _this = this
      setTimeout(() => {
        console.log('[TCP] plus.android 异步触发 open')
        _this._fire('open', { type: 'open' })
        _this._startAndroidReadLoop()
      }, 10)
    } catch (e) {
      console.error('[TCP] plus.android 连接失败:', e.message)
      logLine('网络', 'Java Socket 连接失败：' + String((e && e.message) || e) +
        '（若含 EACCES / permission denied，多为「附近的设备」权限被禁）')
      this.readyState = CLOSED
      this._fire('error', { type: 'error', message: 'Android Socket 连接失败: ' + (e.message || e) })
    }
  }

  /** plus.android 读取循环 —— 逐字节 read(int) 绕过 JSB byte[] 桥 + 长任务切片 */
  _startAndroidReadLoop() {
    const _this = this
    let loopCount = 0
    if (TCP_DEBUG_LOG) {
      console.log('[TCP] readLoop 启动, 轮询=' + TCP_POLL_INTERVAL_MS +
        'ms, 单片上限=' + TCP_MAX_READ_PER_TICK + 'B')
    }

    function readLoop() {
      if (_this.readyState !== OPEN || !_this._javaInput) {
        if (TCP_DEBUG_LOG) console.log('[TCP] readLoop 退出, readyState=' + _this.readyState)
        return
      }
      try {
        loopCount++
        tcpReadStats.polls++
        const available = Number(_this._javaInput.available())
        let toRead = 0
        let readBytes = 0

        if (available > 0) {
          // 关键：只取一片，绝不在一次同步任务里连做几千次 read() 桥调用
          toRead = Math.min(available, TCP_MAX_READ_PER_TICK)
          const bytes = []
          for (let i = 0; i < toRead; i++) {
            const b = _this._javaInput.read()   // 无参 read() 逐字节读，返回 0-255 或 -1
            if (b === -1) break
            bytes.push(b & 0xff)
          }
          readBytes = bytes.length
          tcpReadStats.reads += bytes.length
          tcpReadStats.bytes += bytes.length
          if (bytes.length > tcpReadStats.maxPerTick) tcpReadStats.maxPerTick = bytes.length
          if (bytes.length > TCP_MAX_READ_PER_TICK) tcpReadStats.longTasks++
          if (bytes.length > 0) {
            tcpReadStats.chunks++
            // ⚡ 正式包关闭：以前每个数据块都要 slice().map().join() 拼一段 hex 再走
            //    一次原生日志桥，9 次/s 白建一堆短命字符串。需要抓包时把 TCP_DEBUG_LOG 打开。
            if (TCP_DEBUG_LOG) {
              console.log('[TCP] 收到 ' + bytes.length + 'B, hex: ' +
                bytes.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join(' '))
            }
            _this._fire('message', { type: 'message', data: new Uint8Array(bytes) })
          }
        }

        if (TCP_DEBUG_LOG && (loopCount <= 3 || loopCount % 200 === 0)) {
          console.log('[TCP] readLoop #' + loopCount + ' available=' + available)
        }
        // 还有积压 → 让出一次事件循环后立刻续读（setTimeout 0 在嵌套调用里会被
        // clamp 到 ≥4ms，足够让点击 / Vue nextTick(microtask) 插进来）；
        // 空闲才按 20ms 轮询。这样永不出现「一次读几千字节」的秒级长任务。
        // 本次一字节都没读到（read() 提前返回 -1 等）时不按积压处理，避免 0ms 忙循环
        const hasBacklog = readBytes > 0 && available > toRead
        setTimeout(readLoop, hasBacklog ? 0 : TCP_POLL_INTERVAL_MS)
      } catch (e) {
        const msg = (e && e.message) || String(e)
        if (msg.indexOf('SocketTimeout') >= 0 || msg.indexOf('timed out') >= 0) {
          setTimeout(readLoop, TCP_POLL_INTERVAL_MS)  // SoTimeout 是我们设的 2s，继续轮询
          return
        }
        if (msg.indexOf('Stream closed') >= 0 || msg.indexOf('Connection reset') >= 0) {
          console.log('[TCP] 连接断开:', msg)
          logLine('网络', '读取中断开：' + msg)
          _this.readyState = CLOSED
          _this._fire('close', { type: 'close', wasClean: false })
          return
        }
        console.error('[TCP] plus.android 读取异常:', msg)
        logLine('网络', '读取异常：' + msg)
        _this.readyState = CLOSED
        _this._fire('error', { type: 'error', message: msg })
        _this._fire('close', { type: 'close', wasClean: false })
      }
    }
    readLoop()
  }

  /** plus.ios Socket 连接 */
  _connectWithPlusIOS() {
    // iOS 用 NSStream
    this.readyState = CLOSED
    this._fire('error', { type: 'error', message: 'iOS App 端 TCP 暂不支持，请使用微信小程序或 WebSocket 模式' })
  }

  send(data) {
    if (this.readyState !== OPEN) {
      throw new Error('TCP Socket 未连接，无法发送')
    }
    // 统一转成干净独立的 ArrayBuffer，避免底层共享 buffer 问题
    let cleanAb
    if (data && typeof data === 'string') {
      // string → UTF-8 ArrayBuffer
      const bytes = []
      for (let i = 0; i < data.length; i++) {
        const c = data.charCodeAt(i)
        if (c < 0x80) bytes.push(c)
        else if (c < 0x800) { bytes.push(0xc0 | (c >> 6)); bytes.push(0x80 | (c & 0x3f)) }
        else { bytes.push(0xe0 | (c >> 12)); bytes.push(0x80 | ((c >> 6) & 0x3f)); bytes.push(0x80 | (c & 0x3f)) }
      }
      cleanAb = new Uint8Array(bytes).buffer
    } else if (data && typeof data === 'object' && typeof data.byteLength === 'number') {
      // ArrayBuffer 或 TypedArray → new Uint8Array 复制一份干净的
      cleanAb = new Uint8Array(data).buffer
    } else {
      cleanAb = new Uint8Array(0).buffer
    }

    if (TCP_DEBUG_LOG) {
      const hexPreview = Array.from(new Uint8Array(cleanAb).slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' ')
      console.log('[TCP] send() byteLen=', cleanAb.byteLength, 'hexPreview:', hexPreview)
    }

    try {
      // wx/uni TCPSocket
      if (this._tcpSocket && typeof this._tcpSocket.write === 'function') {
        this._tcpSocket.write(cleanAb)
      }
      // plus.android Java Socket —— 逐字节 write(int) 绕过 JSB byte[] 桥不可靠问题
      else if (this._javaOutput) {
        const u8 = new Uint8Array(cleanAb)
        for (let i = 0; i < u8.length; i++) {
          this._javaOutput.write(u8[i] & 0xff)
        }
        this._javaOutput.flush()
        if (TCP_DEBUG_LOG) console.log('[TCP] Java write逐字节+' + u8.length + 'B flush OK, isConnected=' + this._javaSocket.isConnected())
      }
      if (TCP_DEBUG_LOG) console.log('[TCP] write() called OK')
    } catch (e) {
      console.error('[TCP] write() FAILED:', e.message, e.stack)
      this._fire('error', { type: 'error', message: String(e.message || e) })
    }
  }

  /**
   * 释放底层 socket（幂等）
   * 微信 TCPSocket 有并发上限（5 个），只要有一个没 close 就会挡住后续所有连接，
   * 所以无论是正常关闭、连接失败还是被上层丢弃，都必须走到这里。
   */
  _closeUnderlying() {
    const sock = this._tcpSocket
    this._tcpSocket = null
    if (sock) {
      // 先解绑回调，避免 close 触发的 onClose 再次进入上层重连逻辑
      try { typeof sock.offConnect === 'function' && sock.offConnect() } catch (e) {}
      try { typeof sock.offMessage === 'function' && sock.offMessage() } catch (e) {}
      try { typeof sock.offClose === 'function' && sock.offClose() } catch (e) {}
      try { typeof sock.offError === 'function' && sock.offError() } catch (e) {}
      try { typeof sock.close === 'function' && sock.close() } catch (e) {}
    }
    if (this._javaSocket) {
      try { this._javaInput && this._javaInput.close() } catch (e) {}
      try { this._javaOutput && this._javaOutput.close() } catch (e) {}
      try { this._javaSocket.close() } catch (e) {}
      this._javaInput = null
      this._javaOutput = null
      this._javaSocket = null
    }
  }

  close(code, reason) {
    const alreadyClosed = (this.readyState === CLOSED || this.readyState === CLOSING)
    this.readyState = CLOSING
    this._closeUnderlying()
    this.readyState = CLOSED
    // 已关闭过的不再重复抛 close 事件，避免上层重复排程重连
    if (alreadyClosed) return
    this._fire('close', { type: 'close', code, reason, wasClean: true })
  }

  /** 静默销毁：只释放资源，不触发 close/error 事件（供客户端重建传输层时调用） */
  destroy() {
    this.onopen = null
    this.onmessage = null
    this.onerror = null
    this.onclose = null
    this._listeners = { open: [], message: [], close: [], error: [] }
    this.readyState = CLOSED
    this._closeUnderlying()
  }

  // ---------- 事件分发 ----------
  _fire(type, evt) {
    // console.log('[TCP] _fire("' + type + '") handler=', typeof this['on' + type], 'listeners=', (this._listeners[type] || []).length)
    const handler = this['on' + type]
    if (typeof handler === 'function') {
      try { handler.call(this, evt) } catch (e) { console.error('TCP Socket handler error:', e) }
    }
    const arr = this._listeners[type] || []
    for (const fn of arr) {
      try { fn.call(this, evt) } catch (e) { console.error('TCP Socket listener error:', e) }
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
UniappTcpAdapter.CONNECTING = CONNECTING
UniappTcpAdapter.OPEN = OPEN
UniappTcpAdapter.CLOSING = CLOSING
UniappTcpAdapter.CLOSED = CLOSED
UniappTcpAdapter.isAvailable = isTcpAvailable
