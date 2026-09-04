import { parseStruct, createFields, C_TYPE } from './protocol-utils'

const UINT8 = C_TYPE.UINT8
const UINT32 = C_TYPE.UINT32

// 170C_000A DCDC模块设备
// EnergyData: 16 bytes (4 × uint32)
// SpecialData: 8 bytes
// 对应 C++: 170C_000A::ParseEnergyData / ParseSpecialData

const energyDataFields = createFields([
  { name: 'B0', cType: UINT32, desc: 'DCDC模块直流高压侧电压（mV）' },
  { name: 'B4', cType: UINT32, desc: 'DCDC模块直流高压侧电流（mA）' },
  { name: 'B8', cType: UINT32, desc: '系统直流侧电压（mV）' },
  { name: 'B12', cType: UINT32, desc: '系统直流侧总电流（mA）' },
])

// SpecialData 位域说明:
//   B4 模块状态 (全8位):
//     B4b0=模块DC关机, B4b1=模块故障告警, B4b2=模块保护告警, B4b3=风扇故障,
//     B4b4=过温告警, B4b5=输出过压告警, B4b6=WALK-IN使能, B4b7=模块通信中断
//   B5 输出/休眠/放电异常 (仅 B5b0, B5b4, B5b5)
//   B7 输入/限功率状态 (B7b0-B7b7 全部8位)
const specialDataFields = createFields([
  { name: 'B0', cType: UINT32, desc: '工作模式' },
  { name: 'B4', cType: UINT8, bitfield: true, desc: '模块状态' },
  { name: 'B5', cType: UINT8, bitfield: true, bitMask: [0, 4, 5], desc: '输出/休眠/放电异常' },
  { name: 'B6', cType: UINT8, skip: true, desc: '跳过预留' },
  { name: 'B7', cType: UINT8, bitfield: true, desc: '输入/限功率状态' },
])

export const protocol_170C_000A = {
  deviceType: '170C',
  version: '000A',
  structs: {
    energyData: { fields: energyDataFields, bytes: 16 },
    specialData: { fields: specialDataFields, bytes: 8 },
  },

  parseEnergyData(bytes) {
    return parseStruct(bytes, energyDataFields)
  },

  parseSpecialData(bytes) {
    return parseStruct(bytes, specialDataFields)
  },
}
