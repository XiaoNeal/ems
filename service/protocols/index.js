import { protocol_171F_000A } from './171F'
import { protocol_170D_000A } from './170D'
import { protocol_170E_001E } from './170E'
import { protocol_1711_000A } from './1711'
import { protocol_180A_000A } from './180A'
import { protocol_1712_000A } from './1712'
import { protocol_171C_000A } from './171C'
import { protocol_1714_000A } from './1714'
import { protocol_171B_000A } from './171B'
import { protocol_171D_000A } from './171D'
import { protocol_171E_000A } from './171E'
import { protocol_170C_000A } from './170C'
import { protocol_170F_000A } from './170F'
import { protocol_1713_000A } from './1713'

// 协议注册表: 设备类型 → 协议模块
// key: 设备类型标识 (对应 C++ 中 deviceType 字符串)
// value: 协议模块对象, 包含:
//   - deviceType: 设备类型
//   - version: 协议版本
//   - structs: { energyData, energyControlData?, specialData? }
//   - parseEnergyData(bytes): 解析能源数据
//   - parseEnergyControlData?(bytes): 解析能源控制数据
//   - parseSpecialData?(bytes): 解析特性数据

export const protocolRegistry = {
  '171F': protocol_171F_000A,
  '170D': protocol_170D_000A,
  '170E': protocol_170E_001E,
  '170E_V3': protocol_170E_001E,
  '1711': protocol_1711_000A,
  '180A': protocol_180A_000A,
  '1712': protocol_1712_000A,
  '171C': protocol_171C_000A,
  '1714': protocol_1714_000A,
  '171B': protocol_171B_000A,
  '171D': protocol_171D_000A,
  '171E': protocol_171E_000A,
  '170C': protocol_170C_000A,
  '170F': protocol_170F_000A,
  '1713': protocol_1713_000A,
}

// 根据设备类型获取协议模块
export function getProtocol(deviceType) {
  return protocolRegistry[deviceType] || null
}

// 获取所有已注册的设备类型
export function getRegisteredDeviceTypes() {
  return Object.keys(protocolRegistry)
}

// 检查设备类型是否已注册
export function hasProtocol(deviceType) {
  return deviceType in protocolRegistry
}

export default protocolRegistry
