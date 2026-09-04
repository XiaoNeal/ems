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
import { buildIemsControlFrame } from './iems-frame-parser.js'

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
    if (!this.brokerUrl) throw new Error('未配置 Broker URL')

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
    return this.client.publish(topic, message, opts)
  }

  /**
   * 下发控制指令（IEMS 二进制帧 → hex 字符串，与真实设备兼容）
   * 真实设备通过 MQTT 传输 hex 字符串格式的 IEMS 帧
   * @param {string} field 寄存器字段名 (如 'B12')
   * @param {*} value 目标整数值
   * @param {string} [deviceType] 设备类型，不传则用 setDeviceType 设置的
   */
  async sendControl(field, value, deviceType) {
    const dt = deviceType || this._currentDeviceType
    if (!dt) throw new Error('sendControl: 未指定 deviceType，请先调 setDeviceType')

    const topic = this.controlSetTopic || 'neiic/microEnergyStationCtl002'
    const registers = {}
    registers[field] = Number(value) & 0xffff

    // 构建 IEMS 下行控制帧 (frameType=0x16, dataType=0xC2)
    const frame = buildIemsControlFrame(dt, 1, 0, registers)
    // 转为 hex 字符串（真实设备 MQTT 传输格式）
    const frameHex = Array.from(frame).map(b => b.toString(16).padStart(2, '0')).join(' ')

    console.log('========== MQTT 控制指令下发 (MqttDirectClient) ==========')
    console.log('[MQTT] topic      :', topic)
    console.log('[MQTT] deviceType :', dt)
    console.log('[MQTT] field      :', field, '=', value, '(寄存器=' + (Number(value) & 0xffff) + ')')
    console.log('[MQTT] hex string :', frameHex)
    console.log('==========================================================')

    // 发 hex 字符串，不是二进制
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
