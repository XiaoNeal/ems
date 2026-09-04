import { parseStruct, createFields, C_TYPE } from './protocol-utils'

const UINT8 = C_TYPE.UINT8
const INT16 = C_TYPE.INT16
const UINT16 = C_TYPE.UINT16
const UINT32 = C_TYPE.UINT32

// 171D_000A DCDC设备
// EnergyData: 50 bytes (B0-B49)
// EnergyControlData: 54 bytes (B0-B53)
// 对应 C++: 171D_000A::ParseEnergyData / ParseEnergyControlData
// B12/B14 充放电功率: C++ 使用 ReadInt16_t 但结构体字段为 uint16_t，此处按 int16 处理

const energyDataFields = createFields([
  // 状态标志
  { name: 'B0', cType: UINT16, desc: 'DCDC故障区标志' },
  { name: 'B2', cType: UINT16, desc: '系统工作状态' },
  { name: 'B4', cType: UINT16, desc: '电池工作状态' },
  { name: 'B6', cType: UINT16, desc: '电池充电状态' },
  // 电池电压/电流/功率
  { name: 'B8', cType: INT16, scale: 10, desc: '电池电压' },
  { name: 'B10', cType: INT16, scale: 10, desc: '电池电流' },
  { name: 'B12', cType: INT16, desc: '充电功率' },
  { name: 'B14', cType: INT16, desc: '放电功率' },
  // BUS母线电压
  { name: 'B16', cType: INT16, scale: 10, desc: 'BUS母线电压' },
  { name: 'B18', cType: INT16, scale: 10, desc: 'BUS+母线电压' },
  { name: 'B20', cType: INT16, scale: 10, desc: 'BUS-母线电压' },
  { name: 'B22', cType: INT16, scale: 10, desc: '环境温度' },
  // 累计量
  { name: 'B24', cType: UINT32, scale: 100, desc: '放电量累计' },
  { name: 'B28', cType: UINT32, scale: 100, desc: '充电量累计' },
  // 版本信息
  { name: 'B32', cType: UINT16, desc: '协议版本' },
  { name: 'B34', cType: UINT16, desc: 'DCDC固件版本' },
  { name: 'B36', cType: INT16, desc: 'DCDC软件版本' },
  { name: 'B38', cType: UINT8, skip: true, desc: '预留' },
  { name: 'B39', cType: UINT8, skip: true, desc: '预留' },
  // 故障状态位
  { name: 'B40', cType: UINT8, bitfield: true, desc: '电池故障状态1' },
  { name: 'B41', cType: UINT8, bitfield: true, desc: '电池故障状态2' },
  { name: 'B42', cType: UINT8, bitfield: true, bitMask: [0, 1, 5, 7], desc: 'BUS故障状态' },
  { name: 'B43', cType: UINT8, bitfield: true, desc: 'BUS1故障状态' },
  { name: 'B44', cType: UINT8, bitfield: true, desc: 'BUS母线故障状态' },
  { name: 'B45', cType: UINT8, bitfield: true, desc: 'DCDC故障状态1' },
  { name: 'B46', cType: UINT8, bitfield: true, desc: 'DCDC故障状态2' },
  { name: 'B47', cType: UINT8, bitfield: true, desc: '过载/软启/温度故障' },
  { name: 'B48', cType: UINT8, bitfield: true, desc: '辅助/风扇/E2PROM故障' },
  { name: 'B49', cType: UINT8, bitfield: true, desc: '通讯/继电器/EPO故障' },
])

const energyControlDataFields = createFields([
  { name: 'B0', cType: UINT16, desc: 'Can波特率设置' },
  { name: 'B2', cType: UINT16, desc: '认证标准码' },
  { name: 'B4', cType: UINT16, desc: '机器类型' },
  { name: 'B6', cType: UINT16, desc: '故障清除' },
  { name: 'B8', cType: UINT16, desc: '运行模式设置' },
  { name: 'B10', cType: UINT16, desc: '运行状态设置' },
  { name: 'B12', cType: UINT16, desc: '系统开关机' },
  { name: 'B14', cType: UINT16, desc: '恢复出厂设置' },
  { name: 'B16', cType: UINT16, desc: '组ID号' },
  { name: 'B18', cType: UINT16, desc: '模块数量' },
  { name: 'B20', cType: UINT16, desc: '电池类型' },
  { name: 'B22', cType: UINT16, scale: 10, desc: '直流母线电压' },
  { name: 'B24', cType: UINT16, desc: '充放电指令' },
  { name: 'B26', cType: UINT16, scale: 10, desc: '充放电功率设定' },
  { name: 'B28', cType: UINT16, scale: 10, desc: '电池均充电压' },
  { name: 'B30', cType: UINT16, scale: 10, desc: '充电电流设置' },
  { name: 'B32', cType: UINT16, scale: 10, desc: '电池浮充电压' },
  { name: 'B34', cType: UINT16, scale: 10, desc: '放电电压设置' },
  { name: 'B36', cType: UINT16, scale: 10, desc: '放电电流设置' },
  { name: 'B38', cType: UINT16, scale: 10, desc: '电池过压关机点' },
  { name: 'B40', cType: UINT16, scale: 10, desc: '电池低压告警点' },
  { name: 'B42', cType: UINT16, scale: 10, desc: '电池低压关机点' },
  { name: 'B44', cType: UINT16, scale: 10, desc: '电池激活功能' },
  { name: 'B46', cType: UINT16, desc: '自动重启功能' },
  { name: 'B48', cType: UINT16, scale: 10, desc: '充电母线电压上限' },
  { name: 'B50', cType: UINT16, scale: 10, desc: '放电母线电压下限' },
  { name: 'B52', cType: UINT8, skip: true, desc: '预留' },
  { name: 'B53', cType: UINT8, bitfield: true, bitMask: [0, 1], desc: '通讯使能位' },
])

export const protocol_171D_000A = {
  deviceType: '171D',
  version: '000A',
  structs: {
    energyData: { fields: energyDataFields, bytes: 50 },
    energyControlData: { fields: energyControlDataFields, bytes: 54 },
  },

  parseEnergyData(bytes) {
    return parseStruct(bytes, energyDataFields)
  },

  parseEnergyControlData(bytes) {
    return parseStruct(bytes, energyControlDataFields)
  },
}
