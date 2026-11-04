/**
 * MQTT 直连客户端（跨平台：Android / iOS / 小程序 / H5）
 *
 * 设计要点：
 *   1. 使用自研 LightMqttClient（零外部依赖）+ uni-app WebSocket 适配器
 *   2. 不依赖 mqtt npm 包，彻底规避 webpack 模块解析问题
 *   3. 暴露与 ModbusTCPClient 类似的 API，便于在 direct-device.vue 中按 protocol 分派
 *
 * 主题约定：
 *   neiic/microEnergyStation001      设备 → APP，实时数据 JSON
 *   neiic/microEnergyStationCtl002  APP ↔ 设备，控制指令下发与响应
 */

import { LightMqttClient, testMqttConnection as _testMqttConnection } from './light-mqtt-client.js'
import { buildIemsCommandFrame, normalizeRegisterAddress } from './iems-frame-parser.js'
import { resolveDeviceProfile } from './control-device-profile.js'

/**
 * 控制帧下行载荷格式（设备侧 MQTT 通道是文本协议，改这一行即可切换）
 *   'hex'    —— 发 "16 34 01 00 ..." 空格分隔的 hex 文本（默认，与平台/设备一致）
 *   'json'   —— 发 {"Send Data":"16 34 01 ..."}（网关要求 JSON 信封时）
 *   'binary' —— 直接发原始 Uint8Array（仅当设备端按二进制帧解析时才可用）
 *
 * 注意：发原始二进制会被设备侧按 UTF-8 文本解码成乱码，判为「无法识别的消息格式」；
 *      同时本机订阅同一个 control topic，回环消息也会在日志里显示成一串乱码。
 */
const CONTROL_PAYLOAD_MODE = 'hex'

/** hex 文本的字节分隔符（' ' → "16 34 01"；'' → "163401"） */
const CONTROL_HEX_SEPARATOR = ' '

export class MqttDirectClient {
  constructor(config = {}) {
    this.brokerUrl = config.brokerUrl || ''
    this.realtimeTopic = config.realtimeTopic || 'neiic/microEnergyStation001'
    this.statusTopic = config.statusTopic || 'neiic/microEnergyStation001'
    this.controlSetTopic = config.controlSetTopic || 'neiic/microEnergyStationCtl002'
    this.controlRespTopic = config.controlRespTopic || 'neiic/microEnergyStationCtl002'
    this.clientId = config.clientId || ('app_' + Math.random().toString(16).slice(2, 10))
    this.username = config.username || ''
    this.password = config.password || ''
    this.connectTimeout = parseInt(config.connectTimeout) || 4000
    this.keepalive = parseInt(config.keepalive) || 30
    this.autoReconnect = config.autoReconnect !== false
    this.reconnectInterval = parseInt(config.reconnectInterval) || 3000
    this.maxReconnectAttempts = parseInt(config.maxReconnectAttempts) || 10

    this.client = null
    this.connected = false
    this.connecting = false
    this._connectPromise = null

    this.onConnect = null
    this.onDisconnect = null
    this.onError = null
    this.onMessage = null
  }

  setConfig(config) {
    if (config.brokerUrl !== undefined) this.brokerUrl = config.brokerUrl
    if (config.realtimeTopic !== undefined) this.realtimeTopic = config.realtimeTopic
    if (config.statusTopic !== undefined) this.statusTopic = config.statusTopic
    if (config.controlSetTopic !== undefined) this.controlSetTopic = config.controlSetTopic
    if (config.controlRespTopic !== undefined) this.controlRespTopic = config.controlRespTopic
    if (config.username !== undefined) this.username = config.username
    if (config.password !== undefined) this.password = config.password
  }

  setTopics(topics) {
    if (topics.realtime) this.realtimeTopic = topics.realtime
    if (topics.status) this.statusTopic = topics.status
    if (topics.controlSet) this.controlSetTopic = topics.controlSet
    if (topics.controlResp) this.controlRespTopic = topics.controlResp
    if (this.client && typeof this.client.setTopics === 'function') {
      this.client.setTopics(topics)
    }
  }

  async connect() {
    if (this.connected) return true
    // 并发去重：页面 onShow / 手动重连可能同时触发
    if (this._connectPromise) return this._connectPromise
    if (!this.brokerUrl) throw new Error('未配置 Broker URL')
    this._connectPromise = this._doConnect()
    try {
      return await this._connectPromise
    } finally {
      this._connectPromise = null
    }
  }

  async _doConnect() {
    console.log('[MQTT-client] connect() brokerUrl=', this.brokerUrl, 'realtimeTopic=', this.realtimeTopic, 'controlSetTopic=', this.controlSetTopic, 'clientId=', this.clientId)

    // 重建前必须先销毁旧实例：旧 LightMqttClient 自带重连定时器和 TCPSocket，
    // 不销毁则每次重连都多一个“幽灵客户端”，很快耗尽微信 TCPSocket 的并发名额（5 个）
    if (this.client) {
      try { this.client.disconnect() } catch (e) {}
      this.client = null
    }

    this.connecting = true

    this.client = new LightMqttClient({
      brokerUrl: this.brokerUrl,
      clientId: this.clientId,
      username: this.username,
      password: this.password,
      connectTimeout: this.connectTimeout,
      keepalive: this.keepalive,
      autoReconnect: this.autoReconnect,
      reconnectInterval: this.reconnectInterval,
      maxReconnectAttempts: this.maxReconnectAttempts
    })

    this.client.setTopics({
      realtime: this.realtimeTopic,
      status: this.statusTopic,
      controlSet: this.controlSetTopic,
      controlResp: this.controlRespTopic
    })

    this.client.onConnect = () => {
      this.connected = true
      this.connecting = false
      if (typeof this.onConnect === 'function') this.onConnect()
    }
    this.client.onDisconnect = () => {
      const wasConnected = this.connected
      this.connected = false
      if (wasConnected && typeof this.onDisconnect === 'function') {
        this.onDisconnect()
      }
    }
    this.client.onError = (err) => {
      if (typeof this.onError === 'function') this.onError(err)
    }
    this.client.onMessage = (topic, payloadStr, payloadBytes) => {
      if (typeof this.onMessage === 'function') {
        this.onMessage(topic, payloadStr, payloadBytes)
      }
    }

    try {
      await this.client.connect()
      return true
    } catch (e) {
      this.connecting = false
      this.connected = false
      throw this._wrapError(e)
    }
  }

  async subscribe(topic, handler) {
    if (!this.client || !this.connected) throw new Error('未连接到 Broker')
    return this.client.subscribe(topic, handler)
  }

  async publish(topic, message, opts = { qos: 1 }) {
    if (!this.client || !this.connected) throw new Error('未连接到 Broker')
    // 报文日志：hex 字符串原样输出，二进制转 hex，方便与设备侧抓包比对
    let payloadLog
    let payloadLen
    if (typeof message === 'string') {
      payloadLog = message
      payloadLen = message.length
    } else if (message && message.length !== undefined) {
      payloadLog = Array.from(message).map(b => b.toString(16).padStart(2, '0')).join(' ')
      payloadLen = message.length
    } else {
      payloadLog = String(message)
      payloadLen = payloadLog.length
    }
    console.log('---------- MQTT PUBLISH ----------')
    console.log('[PUBLISH] topic  :', topic)
    console.log('[PUBLISH] qos    :', (opts && opts.qos), '| retain:', (opts && opts.retain) || false)
    console.log('[PUBLISH] length :', payloadLen)
    console.log('[PUBLISH] payload:', payloadLog)
    console.log('----------------------------------')
    return this.client.publish(topic, message, opts)
  }

  /**
   * 下发控制指令（IEMS 二进制帧 → hex 字符串，与真实设备兼容）
   * 参考 Settings 组件（PvSettings/PcsSettings/BmsSettings/StorageSettings）和后端 QuickQueryConfigImpl.sendCommandFrame
   *
   * 调用方式 A（保持旧兼容）：sendControl(field, value, deviceType)
   *   - 从 field (如 'B12') 自动推导寄存器地址 = 12/2 = 6
   *   - deviceCategory/addr/deviceId/registerType 按设备类型自动映射
   *
   * 调用方式 B（完整命令）：sendControl(field, value, deviceType, { registerAddress, ...overrides })
   *   - 传入 registerAddress 覆盖自动推导
   *   - overrides 可覆盖 deviceCategory, addr, deviceId, registerType, extra1/2/3
   *
   * @param {string} field 寄存器字段名 (如 'B12')
   * @param {*} value 目标值（整数或 hex 字符串）
   * @param {string} [deviceType] 目标设备类型码（如 '171C','171E','171F'），不传则用 setDeviceType 设置的
   * @param {object} [overrides] 可选覆盖 { registerAddress, deviceCategory, addr, deviceId, registerType, extra1, extra2, extra3 }
   */
  async sendControl(field, value, deviceType, overrides = {}) {
    const dt = deviceType || this._currentDeviceType
    if (!dt) throw new Error('sendControl: 未指定 deviceType，请先调 setDeviceType')

    const topic = this.controlSetTopic || 'neiic/microEnergyStationCtl002'

    // 寄存器地址：优先用 overrides.registerAddress，否则从 field 推导 B{n} → n/2
    let regAddress
    if (overrides.registerAddress !== undefined) {
      regAddress = overrides.registerAddress
    } else {
      const m = String(field).match(/^B(\d+)$/)
      if (!m) throw new Error('sendControl: 无效的字段名 ' + field)
      regAddress = parseInt(m[1], 10) / 2
      if (!Number.isInteger(regAddress)) throw new Error('sendControl: 字段 ' + field + ' 的寄存器地址不是偶数')
    }

    // 0x3401 附件2 的地址列是十进制（331 就是 331，不是 0x331），统一按十进制规整后进帧
    regAddress = normalizeRegisterAddress(regAddress)

    // 值缺失时提前报错：直接进帧构造函数只会得到一句「字段不能为空」，
    // 看不出是哪个字段、哪个参数，现场排查成本很高
    if (value === undefined || value === null || String(value).trim() === '') {
      throw new Error(
        '下发值为空：字段 ' + (field === undefined || field === null ? '(未指定)' : field) +
        '，寄存器地址 ' + regAddress + '（十进制）'
      )
    }

    // 设备身份（大类小类 / 索引号 / 设备 ID）按 0x3401 附件1 取，
    // 不再把 50kW 的模块级协议码（1707/170C）直接当控制类型码下发
    const profile = resolveDeviceProfile(dt)
    const command = {
      deviceCategory: profile.category,
      addr: profile.addr,
      deviceId: profile.deviceId,
      registerType: 3,          // 补充说明：3=保持寄存器，线圈类用 overrides.regType 覆盖
      extra1: '00',
      extra2: '0000',
      extra3: '0000',
      ...overrides,
      registerAddress: regAddress,
      registerValue: value,
    }
    if (overrides.regType !== undefined) command.registerType = overrides.regType

    // 构建 IEMS 命令控制帧 —— 帧头 deviceType 固定 '3401'（远程控制协议类型码）
    const frame = buildIemsCommandFrame('3401', [command])
    // hex 文本（下发载荷 + 日志比对都用它，避免二进制在日志/设备侧显示为乱码）
    const frameHex = Array.from(frame).map(b => b.toString(16).padStart(2, '0')).join(CONTROL_HEX_SEPARATOR)
    // 记录最近一帧，供页面识别「本机回环消息」，避免自己发的帧被当成设备应答
    this._lastControlHex = frameHex.replace(/[\s,]/g, '').toUpperCase()
    this._lastControlAt = Date.now()

    console.log('========== MQTT 命令帧下发 (MqttDirectClient) ==========')
    console.log('[MQTT] topic        :', topic)
    console.log('[MQTT] frameDeviceType (帧头) : 3401  dataType=0xC2')
    console.log('[MQTT] deviceCategory (命令)  :', command.deviceCategory,
      ' 索引号:', command.addr, ' 设备ID:', command.deviceId)
    console.log('[MQTT] field        :', field)
    console.log('[MQTT] registerAddr :', regAddress, '(十进制) → 0x' + regAddress.toString(16).toUpperCase().padStart(8, '0'))
    console.log('[MQTT] registerValue:', value)
    console.log('[MQTT] registerType :', command.registerType)
    console.log('[MQTT] frame length :', frame.length, 'bytes')
    console.log('[MQTT] payload mode :', CONTROL_PAYLOAD_MODE)
    console.log('[MQTT] hex string   :', frameHex)
    console.log('=======================================================')

    // 按设备侧实际协议下发：默认 hex 文本
    if (CONTROL_PAYLOAD_MODE === 'binary') {
      return this.publish(topic, frame, { qos: 1 })
    }
    if (CONTROL_PAYLOAD_MODE === 'json') {
      return this.publish(topic, JSON.stringify({ 'Send Data': frameHex }), { qos: 1 })
    }
    return this.publish(topic, frameHex, { qos: 1 })
  }

  setDeviceType(deviceType) {
    this._currentDeviceType = deviceType
  }

  async subscribeAll(handlers = {}) {
    return this.client.subscribeAll(handlers)
  }

  disconnect() {
    if (this.client) {
      try { this.client.disconnect() } catch (e) {}
      this.client = null
    }
    this.connected = false
    this.connecting = false
  }

  _wrapError(e) {
    const msg = (e && e.message) ? String(e.message) : String(e)
    if (msg.includes('ECONNREFUSED')) return new Error('Broker 拒绝连接，请检查端口')
    if (msg.includes('ENOTFOUND') || msg.includes('getaddrinfo')) return new Error('无法解析 Broker 主机名')
    if (msg.includes('timeout') || msg.includes('Timeout') || msg.includes('超时')) return new Error('连接超时，请检查 WiFi 与 Broker URL')
    if (msg.includes('WebSocket')) return new Error('WebSocket 握手失败: ' + msg)
    return new Error('MQTT 错误: ' + msg)
  }
}

/**
 * 测试 Broker 可达性
 */
export function testMqttConnection(brokerUrl, timeout = 4000) {
  return _testMqttConnection(brokerUrl, timeout)
}
