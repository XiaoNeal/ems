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
const CONNECTING = 0
const OPEN = 1
const CLOSING = 2
const CLOSED = 3

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
    this._listeners = { open: [], message: [], close: [], error: [] }

    try {
      // 优先用 wx/uni.createTCPSocket（微信小程序 & HBuilderX App）
      const tcpFactory = (typeof wx !== 'undefined' && wx && wx.createTCPSocket)
        ? wx.createTCPSocket.bind(wx)
        : (typeof uni !== 'undefined' && uni && uni.createTCPSocket)
          ? uni.createTCPSocket.bind(uni)
          : null

      if (tcpFactory) {
        this._tcpSocket = tcpFactory()
        console.log('[TCP] Socket 创建成功(wx/uni), 连接', this.host + ':' + this.port)
        this._bindWxTcpEvents()
        this._tcpSocket.connect({ address: this.host, port: this.port })
      } else if (typeof plus !== 'undefined' && plus.android) {
        // App 端降级：用 Java Socket
        console.log('[TCP] 使用 plus.android Java Socket, 连接', this.host + ':' + this.port)
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
      setTimeout(() => this._fire('error', { type: 'error', message: String(e.message || e) }), 0)
    }
  }

  /** 绑定 wx/uni TCPSocket 事件 */
  _bindWxTcpEvents() {
    this._tcpSocket.onConnect(() => {
      console.log('[TCP] onConnect 触发!')
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
      this.readyState = CLOSED
      this._fire('close', { type: 'close', code: res && res.code, reason: res && res.reason, wasClean: true })
    })

    this._tcpSocket.onError((err) => {
      const msg = (err && (err.errMsg || err.message || err.errCode))
        ? String(err.errMsg || err.message || err.errCode)
        : 'TCP socket error'
      console.log('[TCP] onError:', msg, JSON.stringify(err))
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
      this.readyState = OPEN

      const _this = this
      setTimeout(() => {
        console.log('[TCP] plus.android 异步触发 open')
        _this._fire('open', { type: 'open' })
        _this._startAndroidReadLoop()
      }, 10)
    } catch (e) {
      console.error('[TCP] plus.android 连接失败:', e.message)
      this.readyState = CLOSED
      this._fire('error', { type: 'error', message: 'Android Socket 连接失败: ' + (e.message || e) })
    }
  }

  /** plus.android 读取循环 —— 逐字节 read(int) 绕过 JSB byte[] 桥 */
  _startAndroidReadLoop() {
    const _this = this
    let loopCount = 0
    console.log('[TCP] readLoop 启动 (逐字节 read)')

    function readLoop() {
      if (_this.readyState !== OPEN || !_this._javaInput) {
        console.log('[TCP] readLoop 退出, readyState=' + _this.readyState)
        return
      }
      try {
        loopCount++
        const available = _this._javaInput.available()

        if (available > 0) {
          const bytes = []
          const toRead = Math.min(Number(available), 8192)
          for (let i = 0; i < toRead; i++) {
            const b = _this._javaInput.read()   // 无参 read() 逐字节读，返回 0-255 或 -1
            if (b === -1) break
            bytes.push(b & 0xff)
          }
          if (bytes.length > 0) {
            const u8 = new Uint8Array(bytes)
            console.log('[TCP] 收到 ' + bytes.length + 'B, hex: ' + bytes.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join(' '))
            _this._fire('message', { type: 'message', data: u8 })
          }
        }

        if (loopCount <= 3 || loopCount % 200 === 0) {
          console.log('[TCP] readLoop #' + loopCount + ' available=' + available)
        }
        setTimeout(readLoop, 10)
      } catch (e) {
        const msg = (e && e.message) || String(e)
        if (msg.indexOf('SocketTimeout') >= 0 || msg.indexOf('timed out') >= 0) {
          setTimeout(readLoop, 10)  // SoTimeout 是我们设的 2s，继续轮询
          return
        }
        if (msg.indexOf('Stream closed') >= 0 || msg.indexOf('Connection reset') >= 0) {
          console.log('[TCP] 连接断开:', msg)
          _this.readyState = CLOSED
          _this._fire('close', { type: 'close', wasClean: false })
          return
        }
        console.error('[TCP] plus.android 读取异常:', msg)
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

    const hexPreview = Array.from(new Uint8Array(cleanAb).slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' ')
    console.log('[TCP] send() byteLen=', cleanAb.byteLength, 'hexPreview:', hexPreview)

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
        console.log('[TCP] Java write逐字节+' + u8.length + 'B flush OK, isConnected=' + this._javaSocket.isConnected())
      }
      console.log('[TCP] write() called OK')
    } catch (e) {
      console.error('[TCP] write() FAILED:', e.message, e.stack)
      this._fire('error', { type: 'error', message: String(e.message || e) })
    }
  }

  close(code, reason) {
    if (this.readyState !== OPEN && this.readyState !== CONNECTING) return
    this.readyState = CLOSING
    try {
      if (this._tcpSocket) this._tcpSocket.close()
      if (this._javaSocket) {
        this._javaInput && this._javaInput.close()
        this._javaOutput && this._javaOutput.close()
        this._javaSocket.close()
      }
    } catch (e) {
      // 忽略关闭异常
    }
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
