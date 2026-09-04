import { parseStruct, structBytes, createFields, C_TYPE } from './protocol-utils'

const UINT16 = C_TYPE.UINT16
const INT32 = C_TYPE.INT32

// 1713_000A 柔性网关协议
// EnergyData: structBytes(energyDataFields) 字节 (B0-B24)
// 对应 C++: 1713_000A::ParseEnergyData

const energyDataFields = createFields([
  { name: 'B0', cType: UINT16, desc: '柔性网关数量' },
  { name: 'B2', cType: UINT16, desc: '当前设备总数' },
  { name: 'B4', cType: UINT16, desc: '当前设备总数(已注册)' },
  { name: 'B6', cType: UINT16, desc: '多联机内机扫描数量(已注册)' },
  { name: 'B8', cType: UINT16, desc: '多联机外机扫描数量(已注册)' },
  { name: 'B10', cType: UINT16, desc: '直流电表扫描数量(已注册)' },
  { name: 'B12', cType: UINT16, desc: '充电桩扫描数量(已注册)' },
  { name: 'B14', cType: UINT16, desc: '照明扫描数量(已注册)' },
  { name: 'B16', cType: UINT16, desc: '未知设备数量' },
  { name: 'B18', cType: UINT16, scale: 100, desc: '柔度(平均值)' },
  { name: 'B20', cType: UINT16, scale: 100, desc: '负载率(平均值)' },
  { name: 'B22', cType: UINT16, desc: '能效水平(平均值)' },
  { name: 'B24', cType: INT32, scale: 1000, desc: '负荷功率（高位）' },
])

export const protocol_1713_000A = {
  deviceType: '1713',
  version: '000A',
  structs: {
    energyData: { fields: energyDataFields, bytes: structBytes(energyDataFields) },
  },

  parseEnergyData(bytes) {
    return parseStruct(bytes, energyDataFields)
  },
}
