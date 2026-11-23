import { getProtocol, hasProtocol } from './index'
import { parseIemsFrame, isIemsBinaryFrame, IEMS_DATA_TYPE } from '../socket/iems-frame-parser'

/**
 * 统一协议解析入口
 *
 * 使用方式1: 解析完整的 IEMS 二进制帧
 *   parseDeviceFrame(rawBytes) → { deviceType, dataType, data, dateTime, ... }
 *   parseIemsFrame() 内部已自动调用协议模块解析 payload
 *
 * 使用方式2: 直接解析指定设备类型的 payload 数据
 *   parseDevicePayload(deviceType, dataType, payloadBytes) → { ...parsedData }
 *
 * 使用方式3: 解析 MQTT 消息（自动识别二进制帧或 JSON）
 *   parseMqttMessage(payloadBytes, deviceType?) → { ...parsedData }
 */

// DataType 映射: IEMS_DATA_TYPE → 协议方法名
const DataTypeMethodMap = {
  [IEMS_DATA_TYPE.ENERGY]: 'energyData',
  [IEMS_DATA_TYPE.CONTROL]: 'energyControlData',
  [IEMS_DATA_TYPE.STATE]: 'specialData',
}

/**
 * 根据设备类型和数据类型解析 payload
 * 用于直接解析已剥离 IEMS 帧头的 payload 数据
 * @param {string} deviceType - 设备类型 (如 '171F', '170D', '180A')
 * @param {number} dataType - 数据类型 (IEMS_DATA_TYPE 枚举值: 0x02=ENERGY, 0x03=STATE, 0x04=CONTROL)
 * @param {Uint8Array} payload - 原始 payload 字节数据
 * @returns {Object|null} 解析后的数据对象, 设备类型未注册或无对应解析方法时返回 null
 */
export function parseDevicePayload(deviceType, dataType, payload) {
  const protocol = getProtocol(deviceType)
  if (!protocol) {
    console.warn(`[protocol-parser] 未注册的设备类型: ${deviceType}`)
    return null
  }

  const structKey = DataTypeMethodMap[dataType]
  if (!structKey) {
    console.warn(`[protocol-parser] 不支持的数据类型: ${dataType} (设备: ${deviceType})`)
    return null
  }

  const parserMethod = `parse${structKey.charAt(0).toUpperCase() + structKey.slice(1)}`
  if (typeof protocol[parserMethod] !== 'function') {
    console.warn(`[protocol-parser] 协议 ${deviceType} 不支持 ${structKey} 解析`)
    return null
  }

  // 检查 payload 长度是否匹配
  const structDef = protocol.structs[structKey]
  if (structDef && structDef.bytes && payload.length < structDef.bytes) {
    console.warn(`[protocol-parser] payload 长度不足: 期望 ${structDef.bytes} 字节, 实际 ${payload.length} 字节 (设备: ${deviceType}, 类型: ${structKey})`)
  }

  try {
    return protocol[parserMethod](payload)
  } catch (err) {
    console.error(`[protocol-parser] 解析失败: ${err.message} (设备: ${deviceType}, 类型: ${structKey})`)
    return null
  }
}

/**
 * 解析完整的 IEMS 二进制帧
 * parseIemsFrame() 内部已自动使用协议模块解析 payload
 * @param {Uint8Array} rawBytes - 完整的 IEMS 帧字节数据
 * @returns {Object|null} 解析结果, 包含帧信息和已解析的业务数据
 */
export function parseDeviceFrame(rawBytes) {
  // 第一步: 解析 IEMS 帧结构（内部已调用协议模块解析 payload）
  const frameResult = parseIemsFrame(rawBytes)
  if (!frameResult) {
    console.warn('[protocol-parser] IEMS 帧解析失败')
    return null
  }

  return {
    frameType: frameResult.frameType,
    deviceType: frameResult.deviceType,
    dataType: frameResult.dataType,
    data: frameResult.data || {},
    dateTime: frameResult.dateTime,
    payload: frameResult.payload,
    crcOk: frameResult.crcOk,
    _dataTypeNum: frameResult._dataTypeNum,
    _deviceTypeNum: frameResult._deviceTypeNum,
  }
}

/**
 * 便捷方法: 从 MQTT 消息解析设备数据
 * 自动检测是否为 IEMS 二进制帧
 * @param {Uint8Array} payloadBytes - MQTT 消息字节数据
 * @param {string} [deviceType] - 可选, 已知设备类型时直接解析
 * @returns {Object|null} 解析结果
 */
export function parseMqttMessage(payloadBytes, deviceType) {
  // 尝试解析为 IEMS 二进制帧
  if (isIemsBinaryFrame(payloadBytes)) {
    return parseDeviceFrame(payloadBytes)
  }

  // 如果已知设备类型, 尝试直接作为 payload 解析
  if (deviceType && hasProtocol(deviceType)) {
    // 默认用 ENERGY 类型尝试
    return parseDevicePayload(deviceType, IEMS_DATA_TYPE.ENERGY, payloadBytes)
  }

  console.warn('[protocol-parser] 无法识别的数据格式')
  return null
}

export { IEMS_DATA_TYPE } from '../socket/iems-frame-parser'
export { isIemsBinaryFrame, parseIemsFrame } from '../socket/iems-frame-parser'
export { getProtocol, hasProtocol, getRegisteredDeviceTypes } from './index'
export { C_TYPE, C_TYPE_SIZE } from './protocol-utils'
export { protocolRegistry } from './index'

export default {
  parseDevicePayload,
  parseDeviceFrame,
  parseMqttMessage,
}
