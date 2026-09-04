import { parseStruct, structBytes, createFields, C_TYPE } from './protocol-utils'

const UINT16 = C_TYPE.UINT16
const INT32 = C_TYPE.INT32
const UINT32 = C_TYPE.UINT32

// 1714_000A 设备协议
// EnergyData: structBytes(energyDataFields) 字节 (B0-B76)
// 对应 C++: 1714_000A::ParseEnergyData

const energyDataFields = createFields([
  { name: 'B0', cType: UINT16, desc: '设备id' },
  { name: 'B2', cType: UINT16, desc: '设备类型' },
  { name: 'B4', cType: UINT16, desc: '设备位置' },
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
  { name: 'B42', cType: UINT16, desc: '设备所属子网关ID' },
  { name: 'B44', cType: UINT16, desc: '设备协议版本' },
  { name: 'B46', cType: UINT16, desc: '设备状态数据区偏移寄存器数量' },
  { name: 'B48', cType: UINT16, desc: '设备控制数据区偏移寄存器数量' },
  { name: 'B50', cType: UINT16, desc: '操作' },
  { name: 'B52', cType: UINT16, scale: 100, desc: '设置柔度' },
  { name: 'B54', cType: UINT16, desc: '设置四级分类' },
  { name: 'B56', cType: UINT32, scale: 1000, desc: '可调节功率' },
  { name: 'B60', cType: UINT16, desc: '累计响应次数' },
  { name: 'B62', cType: UINT32, desc: '累计响应时间' },
  { name: 'B66', cType: UINT32, scale: 1000, desc: '累计响应电量' },
  { name: 'B70', cType: UINT16, desc: '开关' },
  { name: 'B72', cType: UINT16, desc: '是否调控' },
  { name: 'B74', cType: UINT16, desc: '响应等级' },
  { name: 'B76', cType: UINT16, desc: '调控时长' },
])

export const protocol_1714_000A = {
  deviceType: '1714',
  version: '000A',
  structs: {
    energyData: { fields: energyDataFields, bytes: structBytes(energyDataFields) },
  },

  parseEnergyData(bytes) {
    return parseStruct(bytes, energyDataFields)
  },
}
