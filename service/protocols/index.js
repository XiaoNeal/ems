import { protocol_171F_000A, protocol_171F_V2 } from './171F'
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
// 50kW 微能站新协议（字节地址表，与旧 170C_000A / 171C_000A 布局不同，用带版本号的 key 区分）
import { protocol_1707_V3_5 } from './1707_V3_5'
import { protocol_170C_V1_1 } from './170C_V1_1'
import { protocol_171C_V2 } from './171C_V2'
import { protocol_131C_V2 } from './131C_V2'
import { protocol_0318_V2_3 } from './0318_V2_3'

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
  // 50kW 微能站 EMS 网关（EMSV2.0 表）：多储能/负荷累计电量与自发自用目标功率
  '171F_V2': protocol_171F_V2,
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
  // 50kW 微能站：1707 PCS V3.5 / 170C DC-DC V1.1 / 171C BMS V2.0
  // 这三个 key 带版本号，供直连页按站点类型显式指定（同类型码下与旧协议并存）
  '1707_V3_5': protocol_1707_V3_5,
  '170C_V1_1': protocol_170C_V1_1,
  '171C_V2': protocol_171C_V2,
  // 131C 环境监测（温度/湿度，float32）：'131C' 供帧头设备类型直接匹配，'131C_V2' 供显式指定
  '131C': protocol_131C_V2,
  '131C_V2': protocol_131C_V2,
  // 0318 同飞液冷机 V2.3（含单字节位信号 B38/B39/B41，不能走通用 16 位解析）
  '0318': protocol_0318_V2_3,
  '0318_V2_3': protocol_0318_V2_3,
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
