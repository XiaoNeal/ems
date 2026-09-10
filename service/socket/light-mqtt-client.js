/**
 * 轻量 MQTT 客户端（v3.1.1 协议）
 *
 * 设计目标：
 *   - 零外部依赖（不依赖 mqtt npm 包），彻底规避 webpack 模块解析问题
 *   - 仅实现我们需要的子集：CONNECT / SUBSCRIBE(QoS0) / PUBLISH(QoS0) / PING / DISCONNECT
 *   - 基于 uni.connectSocket 的 WebSocket 适配器，跨平台（Android / iOS / 小程序 / H5）
 *   - 自带接收缓冲区，处理 WebSocket 分片
 *   - 手动 UTF-8 编解码，确保 uni-app 运行时兼容
 *
 * MQTT v3.1.1 报文结构：
 *   固定头 (1-5 字节) + 可变头 + 载荷
 *   固定头: 报文类型(4bit) | 标志位(4bit) | 剩余长度(变长编码)
 */

import { UniappWebSocketAdapter } from './uniapp-websocket-shim.js'
import { UniappTcpAdapter } from './uniapp-tcp-adapter.js'
import { buildIemsCommandFrame } from './iems-frame-parser.js'

/**
 * 根据 brokerUrl 协议自动选择传输适配器
 *   - tcp:// → UniappTcpAdapter（微信小程序原生 wx.createTCPSocket）
 *   - ws:// / wss:// → UniappWebSocketAdapter（跨平台 WebSocket）
 *   - 未带协议时默认 tcp://
 *   - tcp:// 但平台不支持原生 TCP 时，自动降级为 ws://
 */
function createTransport(brokerUrl) {
  let url = brokerUrl
  if (!/^(tcp|wss?):\/\//i.test(url)) {
    url = 'tcp://' + url
  }
  const isTcp = /^tcp:\/\//i.test(url)
  console.log('[MQTT] createTransport, url=', url, 'isTcp=', isTcp)
  if (isTcp) {
    // 尝试原生 TCP，不可用时降级 WebSocket
    try {
      const adapter = new UniappTcpAdapter(url, null)
      console.log('[MQTT] 使用 UniappTcpAdapter')
      return adapter
    } catch (e) {
      console.warn('[MQTT] TCP 适配器创建失败:', e.message)
      if (/不支持原生 TCP|TCPSocket/i.test(e.message)) {
        const wsUrl = url.replace(/^tcp:\/\//i, 'ws://')
        console.warn('[MQTT] 降级为 WebSocket:', wsUrl)
        return new UniappWebSocketAdapter(wsUrl, null)
      }
      throw e
    }
  }
  console.log('[MQTT] 使用 UniappWebSocketAdapter')
  return new UniappWebSocketAdapter(url, null)
}

// 报文类型
const T = {
  CONNECT: 1, CONNACK: 2, PUBLISH: 3, PUBACK: 4,
  SUBSCRIBE: 8, SUBACK: 9, UNSUBSCRIBE: 10, UNSUBACK: 11,
  PINGREQ: 12, PINGRESP: 13, DISCONNECT: 14
}

// ============ 手动 UTF-8 编解码（兼容 uni-app 运行时） ============
function encodeUtf8(str) {
  const out = []
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i)
    if (c < 0x80) {
      out.push(c)
    } else if (c < 0x800) {
      out.push(0xC0 | (c >> 6))
      out.push(0x80 | (c & 0x3F))
    } else if (c < 0xD800 || c >= 0xE000) {
      out.push(0xE0 | (c >> 12))
      out.push(0x80 | ((c >> 6) & 0x3F))
      out.push(0x80 | (c & 0x3F))
    } else {
      // 代理对
      i++
      const c2 = str.charCodeAt(i)
      const cp = 0x10000 + (((c & 0x3FF) << 10) | (c2 & 0x3FF))
      out.push(0xF0 | (cp >> 18))
      out.push(0x80 | ((cp >> 12) & 0x3F))
      out.push(0x80 | ((cp >> 6) & 0x3F))
      out.push(0x80 | (cp & 0x3F))
    }
  }
  return new Uint8Array(out)
}

function decodeUtf8(bytes, offset, length) {
  const end = offset + length
  let out = ''
  let i = offset
  while (i < end) {
    const b1 = bytes[i++]
    if (b1 < 0x80) {
      out += String.fromCharCode(b1)
    } else if (b1 < 0xC0) {
      // continuation byte: skip
    } else if (b1 < 0xE0) {
      const b2 = bytes[i++]
      out += String.fromCharCode(((b1 & 0x1F) << 6) | (b2 & 0x3F))
    } else if (b1 < 0xF0) {
      const b2 = bytes[i++], b3 = bytes[i++]
      out += String.fromCharCode(((b1 & 0x0F) << 12) | ((b2 & 0x3F) << 6) | (b3 & 0x3F))
    } else {
      const b2 = bytes[i++], b3 = bytes[i++], b4 = bytes[i++]
      const cp = ((b1 & 0x07) << 18) | ((b2 & 0x3F) << 12) | ((b3 & 0x3F) << 6) | (b4 & 0x3F)
      const offset2 = cp - 0x10000
      out += String.fromCharCode(0xD800 + (offset2 >> 10), 0xDC00 + (offset2 & 0x3FF))
    }
  }
  return out
}

function encodeRemainingLength(len) {
  const bytes = []
  do {
    let digit = len % 128
    len = Math.floor(len / 128)
    if (len > 0) digit |= 0x80
    bytes.push(digit)
  } while (len > 0)
  return bytes
}

function decodeRemainingLength(buf, offset) {
  let multiplier = 1
  let value = 0
  let i = offset
  let digit
  do {
    digit = buf[i++]
    value += (digit & 0x7F) * multiplier
    multiplier *= 128
    if (multiplier > 128 * 128 * 128) throw new Error('Malformed remaining length')
  } while ((digit & 0x80) !== 0)
  return { value, nextOffset: i }
}

function encodeUtf8String(str) {
  const bytes = encodeUtf8(str)
  const result = new Uint8Array(2 + bytes.length)
  result[0] = (bytes.length >> 8) & 0xFF
  result[1] = bytes.length & 0xFF
  result.set(bytes, 2)
  return result
}

function decodeUtf8String(buf, offset) {
  const len = (buf[offset] << 8) | buf[offset + 1]
  const start = offset + 2
  const str = decodeUtf8(buf, start, len)
  return { value: str, nextOffset: start + len }
}

// CRC32 用于报文校验（简化版，MQTT 不用 CRC，但我们用固定头做基本校验）

export class LightMqttClient {
  constructor(config = {}) {
    this.brokerUrl = config.brokerUrl || ''
    this.clientId = config.clientId || ('app_' + Math.random().toString(16).slice(2, 10))
    this.username = config.username || ''
    this.password = config.password || ''
    this.keepalive = parseInt(config.keepalive) || 30
    this.connectTimeout = parseInt(config.connectTimeout) || 4000

    this.ws = null
    this.connected = false
    this.connecting = false
    this.nextPacketId = 1
    this._pingTimer = null
    this._reconnectTimer = null
    this._recvBuffer = new Uint8Array(0)
    // 自动重连：默认关闭，开启后断线自动重连
    this.autoReconnect = config.autoReconnect !== false
    this.reconnectInterval = parseInt(config.reconnectInterval) || 3000
    this._maxReconnectAttempts = parseInt(config.maxReconnectAttempts) || 10
    this._reconnectAttempts = 0
    this._manualDisconnect = false
    // 当前默认设备类型（sendControl 未传 deviceType 时用这个）
    this._deviceType = null

    // 回调
    this.onConnect = null
    this.onDisconnect = null
    this.onError = null
    this.onMessage = null         // (topic, payloadStr, payloadBytes)
    this._topicHandlers = new Map()  // Map<topic, Set<handler>> — 同一 topic 支持多个 handler
  }

  setConfig(config) {
    if (config.brokerUrl !== undefined) this.brokerUrl = config.brokerUrl
    if (config.username !== undefined) this.username = config.username
    if (config.password !== undefined) this.password = config.password
  }

  async connect() {
    if (this.connected) return true
    if (!this.brokerUrl) throw new Error('未配置 Broker URL')

    this._manualDisconnect = false
    this.connecting = true
    return new Promise((resolve, reject) => {
      // 保存 resolve/reject，供 _handleConnack 异步回调
      this._connectResolve = resolve
      this._connectReject = reject

      this.ws = createTransport(this.brokerUrl)
      // console.log('[MQTT] ws created, type=', this.ws.constructor.name, 'readyState=', this.ws.readyState)

      this.ws.onopen = () => {
        // console.log('[MQTT] ws.onopen fired, sending CONNECT...')
        this._sendConnect()
      }

      this.ws.onmessage = (evt) => {
        // console.log('[MQTT] ws.onmessage fired! evt=', evt ? 'type=' + evt.type + ' dataType=' + (evt.data && evt.data.constructor && evt.data.constructor.name) : 'null')
        this._onSocketMessage(evt.data)
      }

      this.ws.onerror = (evt) => {
        const msg = evt && evt.message ? evt.message : 'WebSocket error'
        if (!this.connected) {
          this.connecting = false
          if (this._connectReject) {
            const err = new Error('WebSocket 连接失败: ' + msg)
            this._connectReject(err)
            this._connectReject = null
            this._connectResolve = null
          }
        }
        if (typeof this.onError === 'function') this.onError(new Error(msg))
      }

      this.ws.onclose = () => {
        const wasConnected = this.connected
        this.connected = false
        this.connecting = false
        this._stopPing()
        if (wasConnected && typeof this.onDisconnect === 'function') {
          this.onDisconnect()
        }
        // 自动重连（非主动断开时）
        this._scheduleReconnect()
      }

      // 超时
      setTimeout(() => {
        if (!this.connected && this.connecting) {
          this.connecting = false
          try { this.ws && this.ws.close() } catch (e) {}
          if (this._connectReject) {
            this._connectReject(new Error(`连接超时（${this.connectTimeout}ms），请检查 Broker URL 与 WiFi`))
            this._connectReject = null
            this._connectResolve = null
          }
        }
      }, this.connectTimeout)
    })
  }

  /**
   * 自动重连调度
   */
  _scheduleReconnect() {
    if (!this.autoReconnect) return
    if (this._manualDisconnect) return
    if (this._reconnectAttempts >= this._maxReconnectAttempts) {
      console.warn('[mqtt] 达到最大重连次数，停止重连')
      if (typeof this.onError === 'function') {
        this.onError(new Error('达到最大重连次数，已停止重连'))
      }
      return
    }
    this._reconnectAttempts++
    if (this._reconnectTimer) clearTimeout(this._reconnectTimer)
    this._reconnectTimer = setTimeout(() => {
      // 重新订阅需保留的 handler 由调用方在 onConnect 中处理
      this._reconnectTimer = null
      this.connect().catch((e) => {
        console.warn('[mqtt] 重连失败:', e.message)
        this._scheduleReconnect()
      })
    }, this.reconnectInterval)
  }

  disconnect() {
    this._manualDisconnect = true
    this.connected = false
    this.connecting = false
    this._stopPing()
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer)
      this._reconnectTimer = null
    }
    this._topicHandlers.clear()
    if (this.ws) {
      try {
        const disconnectPacket = this._encodeControlPacket(T.DISCONNECT, null)
        this.ws.send(disconnectPacket)
      } catch (e) {}
      try { this.ws.close() } catch (e) {}
      this.ws = null
    }
  }

  /**
   * 订阅主题（仅支持 QoS 0，简化实现）
   */
  async subscribe(topic, handler) {
    if (!this.connected) throw new Error('未连接到 Broker')
    const packetId = this.nextPacketId++
    // 可变头：packetId(2) + topicFilters(每个: length(2)+str + qos(1))
    const topicBytes = encodeUtf8String(topic)
    const varHeader = new Uint8Array(2 + topicBytes.length + 1)
    varHeader[0] = (packetId >> 8) & 0xFF
    varHeader[1] = packetId & 0xFF
    varHeader.set(topicBytes, 2)
    varHeader[varHeader.length - 1] = 0  // QoS 0

    const fixedHeader = this._encodeFixedHeader(T.SUBSCRIBE, 0x02, varHeader.length)
    const packet = this._concat(fixedHeader, varHeader)
    this.ws.send(packet)

    if (handler) {
      // 同一 topic 可能被订阅多次（如 realtime 和 controlResp 同一个 topic），用 Set 支持多 handler
      let handlers = this._topicHandlers.get(topic)
      if (!handlers) {
        handlers = new Set()
        this._topicHandlers.set(topic, handlers)
      }
      handlers.add(handler)
    }
    return true
  }

  /**
   * 发布消息（仅支持 QoS 0）
   * message 可以是 string / Uint8Array / ArrayBuffer / plain object(会 JSON.stringify)
   */
  async publish(topic, message, opts = {}) {
    if (!this.connected) throw new Error('未连接到 Broker')
    let payloadBytes
    if (message instanceof Uint8Array) {
      payloadBytes = message
    } else if (message instanceof ArrayBuffer) {
      payloadBytes = new Uint8Array(message)
    } else if (typeof message === 'string') {
      payloadBytes = encodeUtf8(message)
    } else {
      payloadBytes = encodeUtf8(JSON.stringify(message))
    }
    const flags = (opts.retain ? 0x01 : 0) | ((opts.qos || 0) << 1)
    this._sendPublishRaw(topic, payloadBytes, flags)
    const hex = Array.from(payloadBytes).map(b => b.toString(16).padStart(2, '0')).join(' ')
    // console.log('[MQTT] PUBLISH → topic=' + topic + ' bytes=' + payloadBytes.length + ' hex=' + hex)
    return true
  }

  /** 设置默认设备类型（后续 sendControl 未传 deviceType 时用这个） */
  setDeviceType(deviceType) {
    this._deviceType = deviceType
  }

  /**
   * 下发 IEMS 命令控制帧（参考 Settings 组件 + 后端 QuickQueryConfigImpl.sendCommandFrame）
   *
   * @param {string} field 参数字段名 (如 'B168')
   * @param {*} value 目标值（整数，UINT32 直接传 32 位值）
   * @param {string} [deviceType] 目标设备类型码（如 '171C','171E','171F'），不传则用 setDeviceType 设置的默认值
   * @param {object} [overrides] 可选覆盖 { registerAddress, deviceCategory, addr, deviceId, registerType, extra1, extra2, extra3 }
   */
  async sendControl(field, value, deviceType, overrides = {}) {
    const dt = deviceType || this._deviceType
    if (!dt) {
      throw new Error('sendControl: 未指定 deviceType，请先调 setDeviceType 或在调用时传入')
    }

    // 寄存器地址：优先用 overrides.registerAddress，否则从 field 推导 B{n} → n/2
    let regAddress
    if (overrides.registerAddress !== undefined) {
      regAddress = overrides.registerAddress
    } else {
      const m = String(field).match(/^B(\d+)$/)
      if (!m) {
        throw new Error('sendControl: 无效的字段名 ' + field + '，期望格式 B{数字}')
      }
      regAddress = parseInt(m[1], 10) / 2
      if (!Number.isInteger(regAddress)) {
        throw new Error('sendControl: 字段 ' + field + ' 的寄存器地址不是偶数，无法映射')
      }
    }

    // 按设备类型映射命令字段（参考各 Settings 组件的 commandData）
    const deviceCmdDefaults = {
      deviceCategory: dt,
      registerType: '03',
      ...({
        '171E': { addr: 6,    deviceId: '6' },
        '171D': { addr: 30,   deviceId: '30' },
        '171B': { addr: '01', deviceId: '0001' },
        '171C': { addr: '01', deviceId: '0001' },
        '171F': { addr: '01', deviceId: '0001' },
      })[dt] || { addr: '01', deviceId: '0001' },
      extra1: '00',
      extra2: '0000',
      extra3: '0000',
    }

    // 合并 overrides（最高优先级）
    const command = {
      ...deviceCmdDefaults,
      ...overrides,
      registerAddress: regAddress,
      registerValue: value,
    }

    // 构建 IEMS 命令控制帧 —— 帧头 deviceType 固定 '3401'（控制帧类型码）
    // 参考 Settings 组件 typeCode: '3401'
    const frame = buildIemsCommandFrame('3401', [command])

    // 转 hex 字符串方便查看
    const frameHex = Array.from(frame).map(b => b.toString(16).padStart(2, '0')).join(' ')
    const dtHex = typeof dt === 'string' ? dt : dt.toString(16).toUpperCase().padStart(4, '0')

    console.log('========== MQTT 命令帧下发 ==========')
    console.log('[MQTT] topic    :', this._controlSetTopic || 'neiic/microEnergyStationCtl002')
    console.log('[MQTT] deviceType:', dt, '(0x' + dtHex + ')')
    console.log('[MQTT] field    :', field, '→ registerAddress=', regAddress)
    console.log('[MQTT] value    :', value)
    console.log('[MQTT] frame length:', frame.length, 'bytes')
    console.log('[MQTT] frame hex :', frameHex)
    console.log('====================================')

    // 发送二进制帧
    return this.publish(this._controlSetTopic || 'neiic/microEnergyStationCtl002', frame, { retain: false })
  }

  /**
   * 批量订阅（统一入口）
   * handler 签名：(payloadStr, topic, payloadBytes)
   */
  async subscribeAll(handlers = {}) {
    if (handlers.onRealtime) {
      await this.subscribe(this._realtimeTopic || 'neiic/microEnergyStation001',
        (payload, topic, bytes) => handlers.onRealtime(payload, topic, bytes))
    }
    if (handlers.onStatus) {
      await this.subscribe(this._statusTopic || 'neiic/microEnergyStation001',
        (payload, topic, bytes) => handlers.onStatus(payload, topic, bytes))
    }
    if (handlers.onControlResp) {
      await this.subscribe(this._controlRespTopic || 'neiic/microEnergyStationCtl002',
        (payload, topic, bytes) => handlers.onControlResp(payload, topic, bytes))
    }
  }

  // 主题设置（由外部注入）
  setTopics(topics) {
    if (topics.realtime) this._realtimeTopic = topics.realtime
    if (topics.status) this._statusTopic = topics.status
    if (topics.controlSet) this._controlSetTopic = topics.controlSet
    if (topics.controlResp) this._controlRespTopic = topics.controlResp
  }

  // ============ 内部实现 ============

  _sendConnect() {
    const protocolName = encodeUtf8String('MQTT')
    const willTopic = this._statusTopic || 'neiic/microEnergyStation001'
    const willMessage = JSON.stringify({ online: false, clientId: this.clientId, ts: Date.now(), reason: 'will' })
    const willTopicBytes = encodeUtf8String(willTopic)
    const willMessageBytes = encodeUtf8String(willMessage)
    const clientIdBytes = encodeUtf8String(this.clientId)
    const hasUsername = !!this.username
    const hasPassword = !!this.password
    const usernameBytes = hasUsername ? encodeUtf8String(this.username) : null
    const passwordBytes = hasPassword ? encodeUtf8String(this.password) : null

    // flags: CleanSession(0x02) + WillFlag(0x04) + Username(0x80) + Password(0x40)
    let flags = 0x02 | 0x04  // clean session + will
    if (hasUsername) flags |= 0x80
    if (hasPassword) flags |= 0x40

    const parts = [
      protocolName,
      new Uint8Array([4]),
      new Uint8Array([flags]),
      this._numToBytes(this.keepalive, 2),
      clientIdBytes,
      willTopicBytes,
      willMessageBytes
    ]
    if (usernameBytes) parts.push(usernameBytes)
    if (passwordBytes) parts.push(passwordBytes)

    const payload = this._concat(...parts)
    const fixedHeader = this._encodeFixedHeader(T.CONNECT, 0, payload.length)
    const packet = this._concat(fixedHeader, payload)
    const hexStr = Array.from(packet).map(b => b.toString(16).padStart(2, '0')).join(' ')
    console.log('[mqtt] Sending CONNECT packet hex:', hexStr)
    console.log('[mqtt] CONNECT summary: protocol=MQTT version=4 flags=0x' + flags.toString(16) + ' keepalive=' + this.keepalive + ' clientId=' + this.clientId)
    this.ws.send(packet)
  }

  _sendPing() {
    const packet = this._encodeFixedHeader(T.PINGREQ, 0, 0)
    this.ws.send(packet)
  }

  _sendPublishRaw(topic, payloadBytes, flags = 0) {
    const topicBytes = encodeUtf8String(topic)
    const varHeader = this._concat(topicBytes, payloadBytes)
    const fixedHeader = this._encodeFixedHeader(T.PUBLISH, flags, varHeader.length)
    const packet = this._concat(fixedHeader, varHeader)
    this.ws.send(packet)
  }

  _encodeFixedHeader(type, flags, remainingLength) {
    const firstByte = (type << 4) | (flags & 0x0F)
    const lenBytes = encodeRemainingLength(remainingLength)
    const header = new Uint8Array(1 + lenBytes.length)
    header[0] = firstByte
    header.set(lenBytes, 1)
    return header
  }

  _encodeControlPacket(type, payload) {
    if (payload) {
      const fixedHeader = this._encodeFixedHeader(type, 0, payload.length)
      return this._concat(fixedHeader, payload)
    }
    return this._encodeFixedHeader(type, 0, 0)
  }

  _onSocketMessage(data) {
    // data 可能是 ArrayBuffer / Uint8Array / string
    // 注意：小程序运行时 instanceof ArrayBuffer / ArrayBuffer.isView 可能失效
    // 彻底用 duck-typing：有 byteLength 属性就是 Buffer-like
    let chunk
    if (data == null) {
      console.error('[mqtt] _onSocketMessage: data is null/undefined')
      return
    }
    const hasByteLength = typeof data.byteLength === 'number'
    const hasBuffer = data.buffer && typeof data.buffer.byteLength === 'number'
    const hasByteOffset = typeof data.byteOffset === 'number'

    // console.log('[mqtt] _onSocketMessage, constructor=', data.constructor && data.constructor.name,
    //   'byteLength=', data.byteLength, 'hasBuffer=', !!hasBuffer, 'hasByteOffset=', hasByteOffset,
    //   'typeof=', typeof data)

    if (typeof data === 'string') {
      chunk = encodeUtf8(data)
    } else if (hasByteLength && hasBuffer && hasByteOffset) {
      // TypedArray (Uint8Array etc.)
      chunk = new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
    } else if (hasByteLength) {
      // ArrayBuffer or duck-typed ArrayBuffer
      try {
        chunk = new Uint8Array(data)
      } catch (e) {
        // console.error('[mqtt] Uint8Array(data) 失败:', e.message)
        return
      }
    } else {
      console.error('[mqtt] _onSocketMessage: 未知数据类型, return')
      return
    }
    const hexAll = Array.from(chunk).map(b => b.toString(16).padStart(2, '0')).join(' ')
    // console.log('[mqtt] chunk hex ALL:', hexAll, 'len=', chunk.length)

    const chunkHex = Array.from(chunk.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' ')
    // console.log('[mqtt recv] raw chunk len=' + chunk.length + ' hex(前20):', chunkHex)

    // 追加到接收缓冲区
    const newBuf = new Uint8Array(this._recvBuffer.length + chunk.length)
    newBuf.set(this._recvBuffer, 0)
    newBuf.set(chunk, this._recvBuffer.length)
    this._recvBuffer = newBuf

    // 循环解析完整报文
    while (this._recvBuffer.length >= 2) {
      const firstByte = this._recvBuffer[0]
      const type = firstByte >> 4
      const flags = firstByte & 0x0F

      try {
        const { value: remainingLength, nextOffset } = decodeRemainingLength(this._recvBuffer, 1)
        const totalLen = nextOffset + remainingLength

        if (this._recvBuffer.length < totalLen) {
          // 数据不完整，等待更多分片
          break
        }

        // 提取完整报文
        const packet = this._recvBuffer.slice(0, totalLen)
        // 从缓冲区移除
        this._recvBuffer = this._recvBuffer.slice(totalLen)

        // 处理报文
        const payload = packet.slice(nextOffset, nextOffset + remainingLength)
        this._dispatchPacket(type, flags, payload)
      } catch (e) {
        // 解析失败，丢弃缓冲区避免死循环
        console.error('MQTT parse error:', e.message)
        this._recvBuffer = new Uint8Array(0)
        break
      }
    }
  }

  _dispatchPacket(type, flags, payload) {
    const typeNames = { 1:'CONNECT', 2:'CONNACK', 3:'PUBLISH', 4:'PUBACK', 8:'SUBSCRIBE', 9:'SUBACK', 10:'UNSUBSCRIBE', 11:'UNSUBACK', 12:'PINGREQ', 13:'PINGRESP', 14:'DISCONNECT' }
    // console.log('[MQTT] dispatch type=' + type + '(' + (typeNames[type]||'?') + ') flags=' + flags + ' payloadLen=' + payload.length)
    switch (type) {
      case T.CONNACK:
        this._handleConnack(payload)
        break
      case T.PUBLISH:
        this._handlePublish(payload, flags)
        break
      case T.PUBACK:
        break
      case T.SUBACK:
        break
      case T.PINGRESP:
        break
      case T.DISCONNECT:
        this.connected = false
        this._stopPing()
        break
    }
  }

  _handleConnack(payload) {
    const hex = Array.from(payload).map(b => b.toString(16).padStart(2, '0')).join(' ')
    console.log('[MQTT] CONNACK raw hex:', hex, 'len=', payload.length)
    if (payload.length < 2) return
    const returnCode = payload[1]
    console.log('[MQTT] CONNACK returnCode:', returnCode, '(0=accepted)')
    if (returnCode === 0) {
      this.connected = true
      this.connecting = false
      this._reconnectAttempts = 0
      this._startPing()
      if (this._connectResolve) {
        this._connectResolve(true)
        this._connectResolve = null
        this._connectReject = null
      }
      if (typeof this.onConnect === 'function') this.onConnect()
    } else {
      this.connecting = false
      this.connected = false
      const codes = { 1: '协议版本不支持', 2: 'Client ID 不合法', 3: '服务器不可用', 4: '用户名或密码错误', 5: '未授权' }
      const errMsg = 'MQTT CONNACK 失败: ' + (codes[returnCode] || '未知错误')
      if (this._connectReject) {
        this._connectReject(new Error(errMsg))
        this._connectReject = null
        this._connectResolve = null
      }
      throw new Error(errMsg)
    }
  }

  _handlePublish(payload, flags) {
    if (payload.length < 2) return
    const { value: topic, nextOffset } = decodeUtf8String(payload, 0)
    // PUBLISH 固定头低 4 位: DUP(bit3) | QoS(bit2-1) | RETAIN(bit0)
    const qos = (flags >> 1) & 0x03

    let payloadOffset = nextOffset
    let packetId = 0
    // QoS 1/2 在可变头中携带 2 字节 packetId
    if (qos > 0) {
      if (nextOffset + 2 > payload.length) return
      packetId = (payload[nextOffset] << 8) | payload[nextOffset + 1]
      payloadOffset = nextOffset + 2
    }

    const messageBytes = payload.slice(payloadOffset)
    const messageHex = Array.from(messageBytes.slice(0, Math.min(messageBytes.length, 30)))
      .map(b => b.toString(16).padStart(2, '0')).join(' ')

    // 诊断
    // console.log('[MQTT PUBLISH DIAG] topic=' + topic + ' topicNextOffset=' + nextOffset +
    //   ' qos=' + qos + ' payloadOffset=' + payloadOffset +
    //   ' messageBytes=' + messageBytes.length +
    //   ' hex(前30)=' + messageHex)

    const messageStr = decodeUtf8(messageBytes, 0, messageBytes.length)

    // 分发给注册了对应主题的 handler（每个 topic 是 Set<handler>）
    this._topicHandlers.forEach((handlers, pattern) => {
      if (this._matchTopic(pattern, topic)) {
        handlers.forEach(handler => {
          try { handler(messageStr, topic, messageBytes) } catch (e) { console.error('handler err:', e) }
        })
      }
    })
    // 全局 onMessage
    if (typeof this.onMessage === 'function') {
      this.onMessage(topic, messageStr, messageBytes)
    }

    // QoS 1 需要回 PUBACK（避免 broker 重传）
    if (qos === 1) {
      this._sendPuback(packetId)
    }
  }

  /**
   * 发送 PUBACK（QoS 1 PUBLISH 应答）
   */
  _sendPuback(packetId) {
    const varHeader = new Uint8Array(2)
    varHeader[0] = (packetId >> 8) & 0xFF
    varHeader[1] = packetId & 0xFF
    const fixedHeader = this._encodeFixedHeader(T.PUBACK, 0, varHeader.length)
    const packet = this._concat(fixedHeader, varHeader)
    try { this.ws && this.ws.send(packet) } catch (e) {}
  }

  _startPing() {
    this._stopPing()
    this._pingTimer = setInterval(() => {
      if (this.connected) {
        try { this._sendPing() } catch (e) {}
      }
    }, this.keepalive * 1000)
  }

  _stopPing() {
    if (this._pingTimer) {
      clearInterval(this._pingTimer)
      this._pingTimer = null
    }
  }

  _concat(...arrays) {
    let totalLen = 0
    for (const a of arrays) totalLen += a.length
    const result = new Uint8Array(totalLen)
    let offset = 0
    for (const a of arrays) {
      result.set(a, offset)
      offset += a.length
    }
    return result
  }

  _numToBytes(num, bytes) {
    const result = new Uint8Array(bytes)
    for (let i = bytes - 1; i >= 0; i--) {
      result[i] = num & 0xFF
      num >>= 8
    }
    return result
  }

  _matchTopic(pattern, topic) {
    if (pattern === topic) return true
    const p = pattern.split('/')
    const t = topic.split('/')
    for (let i = 0; i < p.length; i++) {
      if (p[i] === '#') return true
      if (p[i] !== '+' && p[i] !== t[i]) return false
    }
    return p.length === t.length
  }
}

/**
 * 测试 Broker 可达性
 */
export function testMqttConnection(brokerUrl, timeout = 4000) {
  return new Promise((resolve, reject) => {
    const client = new LightMqttClient({
      brokerUrl,
      clientId: 'app_test_' + Math.random().toString(16).slice(2, 10),
      connectTimeout: timeout,
      autoReconnect: false
    })

    const cleanup = () => {
      try { client.disconnect() } catch (e) {}
    }

    client.onConnect = () => {
      cleanup()
      resolve(true)
    }
    client.onError = (err) => {
      cleanup()
      reject(err)
    }

    client.connect().catch((e) => {
      cleanup()
      let msg = e.message || String(e)
      if (msg.includes('refused')) reject(new Error('Broker 拒绝连接，请确认 TCP 端口 1883 是否开放'))
      else if (msg.includes('无法解析') || msg.includes('ENOTFOUND')) reject(new Error('无法解析主机名，请检查 IP 地址'))
      else if (msg.includes('超时')) reject(new Error('连接超时，请检查 WiFi 与 Broker IP'))
      else if (msg.includes('不支持原生 TCP')) reject(new Error('当前平台不支持原生 TCP MQTT，请使用微信小程序（基础库>=2.7.0）'))
      else reject(new Error('MQTT 连接失败: ' + msg))
    })
  })
}
