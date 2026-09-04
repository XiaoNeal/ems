import { parseStruct, createFields, C_TYPE } from './protocol-utils'

const UINT16 = C_TYPE.UINT16
const INT16 = C_TYPE.INT16
const UINT32 = C_TYPE.UINT32
const INT32 = C_TYPE.INT32

// 170D_000A 电池簇设备
// EnergyData: 192 bytes (2 clusters + 7 channels)
// 对应 C++: 170D_000A::ParseEnergyData

const energyDataFields = createFields([
  // 簇1
  { name: 'B0', cType: UINT16, scale: 10, desc: '簇1电压V' },
  { name: 'B2', cType: UINT16, scale: 10, desc: '簇1电流A' },
  { name: 'B4', cType: UINT16, scale: 100, desc: '簇1SOC' },
  { name: 'B6', cType: UINT16, scale: 100, desc: '簇1SOH' },
  { name: 'B8', cType: UINT16, scale: 100, desc: '簇1SOE' },
  { name: 'B10', cType: UINT16, scale: 1000, desc: '簇1单体最高电压' },
  { name: 'B12', cType: UINT16, desc: '簇1单体最高电压ID' },
  { name: 'B14', cType: UINT16, scale: 1000, desc: '簇1单体最低电压' },
  { name: 'B16', cType: UINT16, desc: '簇1单体最低电压ID' },
  { name: 'B18', cType: INT16, scale: 10, desc: '簇1单体最高温度' },
  { name: 'B20', cType: UINT16, desc: '簇1单体最高温度ID' },
  { name: 'B22', cType: INT16, scale: 10, desc: '簇1单体最低温度' },
  { name: 'B24', cType: UINT16, desc: '簇1单体最低温度ID' },
  // 簇2
  { name: 'B26', cType: UINT16, scale: 10, desc: '簇2电压V' },
  { name: 'B28', cType: UINT16, scale: 10, desc: '簇2电流A' },
  { name: 'B30', cType: UINT16, scale: 100, desc: '簇2SOC' },
  { name: 'B32', cType: UINT16, scale: 100, desc: '簇2SOH' },
  { name: 'B34', cType: UINT16, scale: 100, desc: '簇2SOE' },
  { name: 'B36', cType: UINT16, scale: 1000, desc: '簇2单体最高电压' },
  { name: 'B38', cType: UINT16, desc: '簇2单体最高电压ID' },
  { name: 'B40', cType: UINT16, scale: 1000, desc: '簇2单体最低电压' },
  { name: 'B42', cType: UINT16, desc: '簇2单体最低电压ID' },
  { name: 'B44', cType: INT16, scale: 10, desc: '簇2单体最高温度' },
  { name: 'B46', cType: UINT16, desc: '簇2单体最高温度ID' },
  { name: 'B48', cType: INT16, scale: 10, desc: '簇2单体最低温度' },
  { name: 'B50', cType: UINT16, desc: '簇2单体最低温度ID' },
  // 通道1
  { name: 'B52', cType: UINT32, scale: 1000, desc: '电压1' },
  { name: 'B56', cType: UINT32, scale: 1000, desc: '电流1' },
  { name: 'B60', cType: INT32, scale: 1000, desc: '功率1' },
  { name: 'B64', cType: UINT32, scale: 100, desc: '正向电能1' },
  { name: 'B68', cType: UINT32, scale: 100, desc: '反向电能1' },
  // 通道2
  { name: 'B72', cType: UINT32, scale: 1000, desc: '电压2' },
  { name: 'B76', cType: UINT32, scale: 1000, desc: '电流2' },
  { name: 'B80', cType: INT32, scale: 1000, desc: '功率2' },
  { name: 'B84', cType: UINT32, scale: 100, desc: '正向电能2' },
  { name: 'B88', cType: UINT32, scale: 100, desc: '反向电能2' },
  // 通道3
  { name: 'B92', cType: UINT32, scale: 1000, desc: '电压3' },
  { name: 'B96', cType: UINT32, scale: 1000, desc: '电流3' },
  { name: 'B100', cType: INT32, scale: 1000, desc: '功率3' },
  { name: 'B104', cType: UINT32, scale: 100, desc: '正向电能3' },
  { name: 'B108', cType: UINT32, scale: 100, desc: '反向电能3' },
  // 通道4
  { name: 'B112', cType: UINT32, scale: 1000, desc: '电压4' },
  { name: 'B116', cType: UINT32, scale: 1000, desc: '电流4' },
  { name: 'B120', cType: INT32, scale: 1000, desc: '功率4' },
  { name: 'B124', cType: UINT32, scale: 100, desc: '正向电能4' },
  { name: 'B128', cType: UINT32, scale: 100, desc: '反向电能4' },
  // 通道5
  { name: 'B132', cType: UINT32, scale: 1000, desc: '电压5' },
  { name: 'B136', cType: UINT32, scale: 1000, desc: '电流5' },
  { name: 'B140', cType: INT32, scale: 1000, desc: '功率5' },
  { name: 'B144', cType: UINT32, scale: 100, desc: '正向电能5' },
  { name: 'B148', cType: UINT32, scale: 100, desc: '反向电能5' },
  // 通道6
  { name: 'B152', cType: UINT32, scale: 1000, desc: '电压6' },
  { name: 'B156', cType: UINT32, scale: 1000, desc: '电流6' },
  { name: 'B160', cType: INT32, scale: 1000, desc: '功率6' },
  { name: 'B164', cType: UINT32, scale: 100, desc: '正向电能6' },
  { name: 'B168', cType: UINT32, scale: 100, desc: '反向电能6' },
  // 通道7
  { name: 'B172', cType: UINT32, scale: 1000, desc: '电压7' },
  { name: 'B176', cType: UINT32, scale: 1000, desc: '电流7' },
  { name: 'B180', cType: INT32, scale: 1000, desc: '功率7' },
  { name: 'B184', cType: UINT32, scale: 100, desc: '正向电能7' },
  { name: 'B188', cType: UINT32, scale: 100, desc: '反向电能7' },
])

export const protocol_170D_000A = {
  deviceType: '170D',
  version: '000A',
  structs: {
    energyData: { fields: energyDataFields, bytes: 192 },
  },

  parseEnergyData(bytes) {
    return parseStruct(bytes, energyDataFields)
  },
}