import { parseStruct, createFields, C_TYPE } from './protocol-utils'

const INT32 = C_TYPE.INT32

// 170E_001E 简易设备
// EnergyData: 12 bytes (3 × int32)
// 对应 C++: 170E_001E::ParseEnergyData
// B0 = int32 / 1000.0 (光伏实时功率)
// B4 = int32 / 1000.0 (储能实时功率)
// B8 = int32 raw (防逆流服务端交流总表功率)

const energyDataFields = createFields([
  { name: 'B0', cType: INT32, scale: 1000, desc: '光伏（实时功率）' },
  { name: 'B4', cType: INT32, scale: 1000, desc: '储能（实时功率）' },
  { name: 'B8', cType: INT32, desc: '防逆流服务端交流总表功率' },
])

export const protocol_170E_001E = {
  deviceType: '170E_V3',
  version: '001E',
  structs: {
    energyData: { fields: energyDataFields, bytes: 12 },
  },

  parseEnergyData(bytes) {
    return parseStruct(bytes, energyDataFields)
  },
}