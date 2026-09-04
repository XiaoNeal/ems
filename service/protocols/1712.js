import { parseStruct, structBytes, createFields, C_TYPE } from './protocol-utils'

const UINT8 = C_TYPE.UINT8
const UINT16 = C_TYPE.UINT16
const INT32 = C_TYPE.INT32
const UINT32 = C_TYPE.UINT32

// 1712_000A 设备协议
// EnergyData: structBytes(energyDataFields) 字节 (B0-B46)
// 对应 C++: 1712_000A::ParseEnergyData
// 特殊处理: B43 为 bitfield，展开为 B43b0(注册)/B43b1(配置)/B43b2(注销)

const energyDataFields = createFields([
  { name: 'B0', cType: UINT16, desc: '网关在线设备数' },
  { name: 'B2', cType: UINT16, desc: '设备id' },
  { name: 'B4', cType: UINT16, desc: '设备类型' },
  { name: 'B6', cType: UINT16, scale: 100, desc: '设备柔度' },
  { name: 'B8', cType: UINT16, scale: 100, desc: '设备负载率' },
  { name: 'B10', cType: UINT16, desc: '设备能效水平' },
  { name: 'B12', cType: INT32, scale: 1000, desc: '设备额定功率' },
  { name: 'B16', cType: UINT32, scale: 1000, desc: '设备电压' },
  { name: 'B20', cType: UINT32, scale: 1000, desc: '设备电流' },
  { name: 'B24', cType: INT32, scale: 1000, desc: '设备功率' },
  { name: 'B28', cType: UINT32, scale: 100, desc: '设备累计正向电能' },
  { name: 'B32', cType: UINT32, scale: 100, desc: '设备累计反向电能' },
  { name: 'B36', cType: UINT16, desc: '设备入网状态' },
  { name: 'B38', cType: UINT16, desc: '设备通讯状态' },
  { name: 'B40', cType: UINT16, desc: '设备四级分类类型' },
  { name: 'B42', cType: UINT8, skip: true, desc: '预留' },
  { name: 'B43', cType: UINT8, bitfield: true, bitMask: [0, 1, 2], desc: '注册/配置/注销' },
  { name: 'B44', cType: UINT16, scale: 100, desc: '设置柔度' },
  { name: 'B46', cType: UINT16, desc: '设置四级分类' },
])

export const protocol_1712_000A = {
  deviceType: '1712',
  version: '000A',
  structs: {
    energyData: { fields: energyDataFields, bytes: structBytes(energyDataFields) },
  },

  parseEnergyData(bytes) {
    return parseStruct(bytes, energyDataFields)
  },
}
