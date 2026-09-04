import { parseStruct, createFields, C_TYPE } from './protocol-utils'

const UINT8 = C_TYPE.UINT8
const FLOAT = C_TYPE.FLOAT
const INT32 = C_TYPE.INT32

// 171E_000A 整流模块设备
// EnergyData: 92 bytes (B0-B88)
// EnergyControlData: 52 bytes (B0-B48)
// 对应 C++: 171E_000A::ParseEnergyData / ParseEnergyControlData
//
// 注意: EnergyData 中 B0-B52 使用 IEEE754 float。
// C++ 实现为 ReadUint32_t + IEEE754ToFloat，JS 端使用 cType:'float'
// (getFloat32 big-endian) 读取 IEEE754，二者等价。
// EnergyControlData 含特殊 scale: B4 scale=1024, B16 scale=20000。

const energyDataFields = createFields([
  // 模块基本参数 (float)
  { name: 'B0', cType: FLOAT, desc: '模块电压' },
  { name: 'B4', cType: FLOAT, desc: '模块电流' },
  { name: 'B8', cType: FLOAT, desc: '模块限流点' },
  { name: 'B12', cType: FLOAT, desc: '模块DC板温度' },
  { name: 'B16', cType: FLOAT, desc: '模块输入相电压' },
  { name: 'B20', cType: FLOAT, desc: '模块PFC0电压' },
  { name: 'B24', cType: FLOAT, desc: '模块PFC1电压' },
  { name: 'B28', cType: FLOAT, desc: '模块面板温度' },
  { name: 'B32', cType: FLOAT, desc: '模块交流A相电压' },
  { name: 'B36', cType: FLOAT, desc: '模块交流B相电压' },
  { name: 'B40', cType: FLOAT, desc: '模块交流C相电压' },
  { name: 'B44', cType: FLOAT, desc: '模块PFC板温度' },
  { name: 'B48', cType: FLOAT, desc: '模块额定输出功率' },
  { name: 'B52', cType: FLOAT, desc: '模块额定输出电流' },
  // 状态/组号/功率 (int32)
  { name: 'B56', cType: INT32, desc: '读取当前告警状态' },
  { name: 'B60', cType: INT32, desc: '读取组号和拨码地址' },
  { name: 'B64', cType: INT32, desc: '读取输入功率' },
  { name: 'B68', cType: INT32, desc: '读取当前设定的海拔值' },
  { name: 'B72', cType: INT32, desc: '读取当前模块输入工作模式' },
  { name: 'B76', cType: INT32, desc: '读节点SearialNo号低位' },
  { name: 'B80', cType: INT32, desc: '读节点SearialNo号高位' },
  { name: 'B84', cType: INT32, desc: '读DCDC版本号' },
  { name: 'B88', cType: INT32, desc: '读PFC版本号' },
])

const energyControlDataFields = createFields([
  { name: 'B0', cType: INT32, desc: '设置模块工作海拔值' },
  { name: 'B4', cType: INT32, scale: 1024, desc: '设置模块输出电流值' },
  { name: 'B8', cType: UINT8, skip: true, desc: '预留' },
  { name: 'B9', cType: UINT8, skip: true, desc: '预留' },
  { name: 'B10', cType: UINT8, skip: true, desc: '预留' },
  { name: 'B11', cType: UINT8, bitfield: true, bitMask: [2], desc: '设置组号(b2)' },
  { name: 'B12', cType: INT32, desc: '设置模块地址分配方式' },
  { name: 'B16', cType: INT32, scale: 20000, desc: '设置模块输出功率' },
  { name: 'B20', cType: INT32, desc: '设置模块输出电压' },
  { name: 'B24', cType: INT32, desc: '设置模块限流点' },
  { name: 'B28', cType: INT32, desc: '设置模块输出电压上限值' },
  { name: 'B32', cType: INT32, desc: '开关机' },
  { name: 'B36', cType: INT32, desc: '设置模块过压复位' },
  { name: 'B40', cType: INT32, desc: '设置模块输出过压保护关联是否允许' },
  { name: 'B44', cType: INT32, desc: '设置模块短路复位' },
  { name: 'B48', cType: INT32, desc: '设置模块输入模式' },
])

export const protocol_171E_000A = {
  deviceType: '171E',
  version: '000A',
  structs: {
    energyData: { fields: energyDataFields, bytes: 92 },
    energyControlData: { fields: energyControlDataFields, bytes: 52 },
  },

  parseEnergyData(bytes) {
    return parseStruct(bytes, energyDataFields)
  },

  parseEnergyControlData(bytes) {
    return parseStruct(bytes, energyControlDataFields)
  },
}
