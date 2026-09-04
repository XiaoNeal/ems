import { parseStruct, createFields, C_TYPE, combine32LH, combineMixed, FREQUENCY_PARAM, applyPTCorrection } from './protocol-utils'

const UINT16 = C_TYPE.UINT16
const INT16 = C_TYPE.INT16

// 180A_000A 三相电能表 (YD2037)
// EnergyData: 86 bytes
// EnergyControlData: 66 bytes
// 对应 C++: 180A_000A::ParseEnergyData / ParseEnergyControlData
//
// 特殊处理:
//   1. B66/B70/B74/B78: 由两个 uint16 组合为 32 位 (低字在前)
//   2. B54: 频率 = uint16 / FREQUENCY_PARAM
//   3. B82/B84: PT/CT 变比 (不参与后处理)
//   4. 解析完成后, 对电压/电流/功率/电能字段乘以 PT 或 CT 或 PT*CT

// EnergyData 字段定义
// 使用自定义 read 函数处理 32 位组合字段和频率计算
const energyDataFields = createFields([
  // A相
  { name: 'B0', cType: UINT16, scale: 100, desc: '相电压Ua' },
  { name: 'B2', cType: UINT16, scale: 100, desc: '线电压Uca' },
  { name: 'B4', cType: UINT16, scale: 10, desc: 'A相电流' },
  { name: 'B6', cType: UINT16, desc: '预留' },
  { name: 'B8', cType: INT16, scale: 40, desc: 'A相有功功率' },
  { name: 'B10', cType: UINT16, scale: 10000, desc: 'A相功率因数' },
  { name: 'B12', cType: INT16, scale: 40, desc: 'A相无功功率' },
  { name: 'B14', cType: UINT16, scale: 20, desc: 'A相视在功率' },
  // B相
  { name: 'B16', cType: UINT16, scale: 100, desc: '相电压Ub' },
  { name: 'B18', cType: UINT16, scale: 100, desc: '线电压Uab' },
  { name: 'B20', cType: UINT16, scale: 10, desc: 'B相电流' },
  { name: 'B22', cType: UINT16, desc: '预留' },
  { name: 'B24', cType: INT16, scale: 40, desc: 'B相有功功率' },
  { name: 'B26', cType: UINT16, scale: 10000, desc: 'B相功率因数' },
  { name: 'B28', cType: INT16, scale: 40, desc: 'B相无功功率' },
  { name: 'B30', cType: UINT16, scale: 20, desc: 'B相视在功率' },
  // C相
  { name: 'B32', cType: UINT16, scale: 100, desc: '相电压Uc' },
  { name: 'B34', cType: UINT16, scale: 100, desc: '线电压Ubc' },
  { name: 'B36', cType: UINT16, scale: 10, desc: 'C相电流' },
  { name: 'B38', cType: UINT16, desc: '预留' },
  { name: 'B40', cType: INT16, scale: 40, desc: 'C相有功功率' },
  { name: 'B42', cType: UINT16, scale: 10000, desc: 'C相功率因数' },
  { name: 'B44', cType: INT16, scale: 40, desc: 'C相无功功率' },
  { name: 'B46', cType: UINT16, scale: 20, desc: 'C相视在功率' },
  // 三相平均
  { name: 'B48', cType: UINT16, scale: 100, desc: '三相平均线电压' },
  { name: 'B50', cType: UINT16, scale: 100, desc: '三相平均相电压' },
  { name: 'B52', cType: UINT16, scale: 10, desc: '三相平均相电流' },
  // 频率 (特殊: uint16 / FREQUENCY_PARAM)
  { name: 'B54', cType: UINT16, scale: FREQUENCY_PARAM, desc: '频率' },
  { name: 'B56', cType: INT16, scale: 40, desc: '三相有功功率' },
  { name: 'B58', cType: UINT16, scale: 10000, desc: '三相总功率因数' },
  { name: 'B60', cType: INT16, scale: 40, desc: '三相无功功率' },
  { name: 'B62', cType: UINT16, scale: 20, desc: '三相视在功率' },
  { name: 'B64', cType: UINT16, desc: '预留' },
  // 32位电能累加 (低字在前, 高字在后, 合成后 / 1000)
  { name: 'B66', read: combine32LH, readBytes: 4, scale: 1000, desc: '正向有功电能累加值' },
  { name: 'B70', read: combine32LH, readBytes: 4, scale: 1000, desc: '负向有功电能累加值' },
  { name: 'B74', read: combine32LH, readBytes: 4, scale: 1000, desc: '正向无功电能累加值' },
  { name: 'B78', read: combine32LH, readBytes: 4, scale: 1000, desc: '负向无功电能累加值' },
  // PT/CT 变比
  { name: 'B82', cType: UINT16, desc: '电压变比PT' },
  { name: 'B84', cType: UINT16, desc: '电流变比CT' },
])

// PT/CT 后处理的字段分类
const PT_FIELDS = ['B0', 'B2', 'B16', 'B18', 'B32', 'B34', 'B48', 'B50']      // 电压类: ×PT
const CT_FIELDS = ['B4', 'B20', 'B36', 'B52']                                   // 电流类: ×CT
const PTCT_FIELDS = [                                                            // 功率/电能类: ×PT×CT
  'B8', 'B12', 'B14', 'B24', 'B28', 'B30', 'B40', 'B44', 'B46',
  'B56', 'B60', 'B62', 'B66', 'B70', 'B74', 'B78'
]

// EnergyControlData 字段定义
// 注意: B66/B70/B74/B78 使用 combineMixed (uiH<<8 | uiL, 不同于 EnergyData 的 uiH<<16 | uiL)
const energyControlDataFields = createFields([
  { name: 'B0', cType: UINT16, desc: '相电压Ua阀值' },
  { name: 'B2', cType: UINT16, desc: '线电压Uca阀值' },
  { name: 'B4', cType: UINT16, desc: 'A相电流阀值' },
  { name: 'B6', cType: UINT16, desc: '开入状态检测阀值' },
  { name: 'B8', cType: UINT16, desc: 'A相有功功率阀值' },
  { name: 'B10', cType: UINT16, desc: 'A相功率因数阀值' },
  { name: 'B12', cType: UINT16, desc: 'A相无功功率阀值' },
  { name: 'B14', cType: UINT16, desc: 'A相视在功率阀值' },
  { name: 'B16', cType: UINT16, desc: '相电压Ub阀值' },
  { name: 'B18', cType: UINT16, desc: '线电压Uab阀值' },
  { name: 'B20', cType: UINT16, desc: 'B相电流阀值' },
  { name: 'B22', cType: UINT16, desc: '开出状态检测阀值' },
  { name: 'B24', cType: UINT16, desc: 'B相有功功率阀值' },
  { name: 'B26', cType: UINT16, desc: 'B相功率因数阀值' },
  { name: 'B28', cType: UINT16, desc: 'B相无功功率阀值' },
  { name: 'B30', cType: UINT16, desc: 'B相视在功率阀值' },
  { name: 'B32', cType: UINT16, desc: '相电压Uc阀值' },
  { name: 'B34', cType: UINT16, desc: '线电压Ubc阀值' },
  { name: 'B36', cType: UINT16, desc: 'C相电流阀值' },
  { name: 'B38', cType: UINT16, desc: '预留' },
  { name: 'B40', cType: UINT16, desc: 'C相有功功率阀值' },
  { name: 'B42', cType: UINT16, desc: 'C相功率因数阀值' },
  { name: 'B44', cType: UINT16, desc: 'C相无功功率阀值' },
  { name: 'B46', cType: UINT16, desc: 'C相视在功率阀值' },
  { name: 'B48', cType: UINT16, desc: '三相平均线电压阀值' },
  { name: 'B50', cType: UINT16, desc: '三相平均相电压阀值' },
  { name: 'B52', cType: UINT16, desc: '三相平均相电流阀值' },
  { name: 'B54', cType: UINT16, desc: '频率阀值' },
  { name: 'B56', cType: UINT16, desc: '三相有功功率阀值' },
  { name: 'B58', cType: UINT16, desc: '三相总功率因数阀值' },
  { name: 'B60', cType: UINT16, desc: '三相无功功率阀值' },
  { name: 'B62', cType: UINT16, desc: '三相视在功率阀值' },
  { name: 'B64', cType: UINT16, desc: '预留' },
  // 32位电能累加 (混合编码: uiH<<8 | uiL)
  { name: 'B66', read: combineMixed, readBytes: 4, desc: '正向有功电能累加值阀值' },
  { name: 'B70', read: combineMixed, readBytes: 4, desc: '负向有功电能累加值阀值' },
  { name: 'B74', read: combineMixed, readBytes: 4, desc: '正向无功电能累加值阀值' },
  { name: 'B78', read: combineMixed, readBytes: 4, desc: '负向无功电能累加值阀值' },
  { name: 'B82', cType: UINT16, desc: '电压变比PT' },
  { name: 'B84', cType: UINT16, desc: '电流变比CT' },
])

export const protocol_180A_000A = {
  deviceType: '180A',
  version: '000A',
  structs: {
    energyData: { fields: energyDataFields, bytes: 86 },
    energyControlData: { fields: energyControlDataFields, bytes: 66 },
  },

  parseEnergyData(bytes) {
    const data = parseStruct(bytes, energyDataFields)
    const pt = data.B82 || 1
    const ct = data.B84 || 1
    return applyPTCorrection(data, pt, ct, PT_FIELDS, CT_FIELDS, PTCT_FIELDS)
  },

  parseEnergyControlData(bytes) {
    return parseStruct(bytes, energyControlDataFields)
  },
}