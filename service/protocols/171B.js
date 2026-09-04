import { parseStruct, createFields, C_TYPE } from './protocol-utils'

const UINT8 = C_TYPE.UINT8
const INT16 = C_TYPE.INT16
const UINT16 = C_TYPE.UINT16
const INT32 = C_TYPE.INT32
const UINT32 = C_TYPE.UINT32

// 171B_000A 交流模块设备
// EnergyData: 84 bytes (B0-B82)
// EnergyControlData: 116 bytes (B0-B112)
// 对应 C++: 171B_000A::ParseEnergyData / ParseEnergyControlData

const energyDataFields = createFields([
  // 交流相电压/电流
  { name: 'B0', cType: INT16, scale: 10, desc: '交流A相相电压' },
  { name: 'B2', cType: INT16, scale: 100, desc: '交流A相相电流' },
  { name: 'B4', cType: INT16, scale: 10, desc: '交流B相相电压' },
  { name: 'B6', cType: INT16, scale: 100, desc: '交流B相相电流' },
  { name: 'B8', cType: INT16, scale: 10, desc: '交流C相相电压' },
  { name: 'B10', cType: INT16, scale: 100, desc: '交流C相相电流' },
  // 交流线电压
  { name: 'B12', cType: INT32, scale: 10, desc: '交流AB线电压' },
  { name: 'B16', cType: INT32, scale: 10, desc: '交流BC线电压' },
  { name: 'B20', cType: INT32, scale: 10, desc: '交流CA线电压' },
  // 各相有功/无功功率
  { name: 'B24', cType: INT16, desc: 'A相有功功率' },
  { name: 'B26', cType: INT16, desc: 'A相无功功率' },
  { name: 'B28', cType: INT16, desc: 'B相有功功率' },
  { name: 'B30', cType: INT16, desc: 'B相无功功率' },
  { name: 'B32', cType: INT16, desc: 'C相有功功率' },
  { name: 'B34', cType: INT16, desc: 'C相无功功率' },
  // 频率/温度/总功率
  { name: 'B36', cType: INT32, desc: '交流频率' },
  { name: 'B40', cType: INT32, scale: 1000, desc: '模块面板温度' },
  { name: 'B44', cType: INT32, desc: '总有功功率' },
  { name: 'B48', cType: INT32, desc: '总无功功率' },
  { name: 'B52', cType: INT32, desc: '总视在功率' },
  // 直流侧
  { name: 'B56', cType: INT16, scale: 10, desc: '直流侧电压' },
  { name: 'B58', cType: INT16, scale: 100, desc: '直流侧电流' },
  { name: 'B60', cType: INT32, scale: 1000, desc: '额定输出功率' },
  // 告警/预留/模块信息
  { name: 'B64', cType: INT32, desc: '读取模块当前告警状态' },
  { name: 'B68', cType: INT32, desc: '预留' },
  { name: 'B72', cType: INT16, desc: '模块组号' },
  { name: 'B74', cType: INT16, desc: '模块地址' },
  { name: 'B76', cType: INT32, desc: '当前设定的海拔值' },
  { name: 'B80', cType: UINT8, skip: true, desc: '预留' },
  { name: 'B81', cType: UINT8, skip: true, desc: '预留' },
  { name: 'B82', cType: INT16, desc: '模块软件版本号' },
])

const energyControlDataFields = createFields([
  { name: 'B0', cType: UINT32, scale: 1000, desc: '设置模块工作海拔值' },
  { name: 'B4', cType: UINT8, skip: true, desc: '预留' },
  { name: 'B5', cType: UINT8, skip: true, desc: '预留' },
  { name: 'B6', cType: UINT8, skip: true, desc: '预留' },
  { name: 'B7', cType: UINT8, bitfield: true, bitMask: [5, 6, 7], desc: '设置组号(b5-b7)' },
  { name: 'B8', cType: UINT32, desc: '设置模块地址分配方式' },
  { name: 'B12', cType: UINT32, desc: '设置离网模式交流侧欠压复位' },
  { name: 'B16', cType: UINT32, desc: '设置整流模式直流侧欠压复位' },
  { name: 'B20', cType: UINT32, desc: '设置模块工作模式' },
  { name: 'B24', cType: UINT32, desc: '设置模块开关机' },
  { name: 'B28', cType: UINT32, desc: '设置模块直流侧过压复位' },
  { name: 'B32', cType: UINT32, desc: '设置模块短路复位' },
  { name: 'B36', cType: UINT32, desc: '设置直流侧电压' },
  { name: 'B40', cType: UINT32, desc: '设置直流侧电流' },
  { name: 'B44', cType: UINT16, desc: '设置并网模式的功率控制模式' },
  { name: 'B46', cType: UINT16, desc: '设置交流侧总有功功率值' },
  { name: 'B48', cType: UINT32, desc: '设置交流侧总无功功率' },
  { name: 'B52', cType: UINT32, scale: 1000, desc: '设置交流侧功率因素PF' },
  { name: 'B56', cType: UINT32, desc: '设置交流侧无功功率类型' },
  { name: 'B60', cType: UINT16, scale: 10, desc: '设置交流相电压' },
  { name: 'B62', cType: UINT16, scale: 10, desc: '设置交流频率' },
  { name: 'B64', cType: UINT32, desc: '设置是否错相' },
  { name: 'B68', cType: UINT32, scale: 10, desc: '设置直流欠压保护电压' },
  { name: 'B72', cType: UINT32, scale: 10, desc: '设置直流过压保护电压' },
  // 一级交流保护
  { name: 'B76', cType: UINT16, scale: 10, desc: '设置一级交流欠压保护线电压' },
  { name: 'B78', cType: UINT16, desc: '设置一级交流欠压保护时间' },
  { name: 'B80', cType: UINT16, scale: 10, desc: '设置一级交流过压保护线电压' },
  { name: 'B82', cType: UINT16, desc: '设置一级交流过压保护时间' },
  { name: 'B84', cType: UINT16, scale: 100, desc: '设置一级交流欠频保护频率' },
  { name: 'B86', cType: UINT16, desc: '设置一级交流欠频保护时间' },
  { name: 'B88', cType: UINT16, scale: 100, desc: '设置一级交流过频保护频率' },
  { name: 'B90', cType: UINT16, desc: '设置一级交流过频保护时间' },
  { name: 'B92', cType: UINT16, scale: 100, desc: '设置一级交流过频保护时间' },
  { name: 'B94', cType: UINT16, desc: '设置一级交流过频保护时间' },
  // 二级交流保护
  { name: 'B96', cType: UINT16, scale: 100, desc: '设置二级交流过频保护频率' },
  { name: 'B98', cType: UINT16, desc: '设置二级交流过频保护时间' },
  { name: 'B100', cType: UINT32, desc: '设置是否过载输出' },
  { name: 'B104', cType: UINT16, scale: 100, desc: '设置二级交流欠压保护线电压' },
  { name: 'B106', cType: UINT16, desc: '设置二级交流欠压保护线时间' },
  { name: 'B108', cType: UINT16, scale: 10, desc: '设置二级交流过压保护线电压' },
  { name: 'B110', cType: UINT16, scale: 10, desc: '设置二级交流过压保护线时间' },
  { name: 'B112', cType: UINT32, desc: '设置是否使能输入电压环' },
])

export const protocol_171B_000A = {
  deviceType: '171B',
  version: '000A',
  structs: {
    energyData: { fields: energyDataFields, bytes: 84 },
    energyControlData: { fields: energyControlDataFields, bytes: 116 },
  },

  parseEnergyData(bytes) {
    return parseStruct(bytes, energyDataFields)
  },

  parseEnergyControlData(bytes) {
    return parseStruct(bytes, energyControlDataFields)
  },
}
