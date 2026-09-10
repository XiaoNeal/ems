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
import { buildIemsCommandFrame } from './iems-frame-parser.js'

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

    // 按设备类型映射命令字段（参考各 Settings 组件）
    const deviceCmdDefaults = {
      // deviceCategory = 设备类型码本身
      deviceCategory: dt,
      registerType: '03',
      // addr / deviceId 特殊映射：PV 和 Storage 有独立地址
      ...({
        '171E': { addr: 6,    deviceId: '6' },     // PV 逆变器
        '171D': { addr: 30,   deviceId: '30' },    // 储能 DC-DC
        '171B': { addr: '01', deviceId: '0001' },  // PCS
        '171C': { addr: '01', deviceId: '0001' },  // BMS
        '171F': { addr: '01', deviceId: '0001' },  // 能量控制器
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
    // 转为 hex 字符串（真实设备 MQTT 传输格式）
    const frameHex = Array.from(frame).map(b => b.toString(16).padStart(2, '0')).join(' ')

    console.log('========== MQTT 命令帧下发 (MqttDirectClient) ==========')
    console.log('[MQTT] topic        :', topic)
    console.log('[MQTT] frameDeviceType (帧头) : 3401')
    console.log('[MQTT] deviceCategory (命令)  :', command.deviceCategory)
    console.log('[MQTT] field        :', field)
    console.log('[MQTT] registerAddr :', regAddress, '(0x' + Number(regAddress).toString(16).toUpperCase() + ')')
    console.log('[MQTT] registerValue:', value)
    console.log('[MQTT] registerType :', command.registerType)
    console.log('[MQTT] addr/deviceId:', command.addr, '/' + command.deviceId)
    console.log('[MQTT] hex string   :', frameHex)
    console.log('=======================================================')

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
