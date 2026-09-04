import { parseStruct, createFields, C_TYPE } from './protocol-utils'

const UINT16 = C_TYPE.UINT16
const INT16 = C_TYPE.INT16
const UINT32 = C_TYPE.UINT32
const INT32 = C_TYPE.INT32

// 170F_000A 能源站设备
// EnergyData: 92 bytes (B0-B90)
// SpecialData: 108 bytes (B0-B104)
// 对应 C++: 170F_000A::ParseEnergyData / ParseSpecialData

const energyDataFields = createFields([
  // 实时功率
  { name: 'B0', cType: INT32, scale: 1000, desc: '光伏（实时功率）' },
  { name: 'B4', cType: INT32, scale: 1000, desc: '电网（实时功率）' },
  { name: 'B8', cType: INT32, scale: 1000, desc: '储能（实时功率）' },
  { name: 'B12', cType: INT32, scale: 1000, desc: '负荷功率（实时功率）' },
  { name: 'B16', cType: INT32, scale: 1000, desc: '柔性直流空调1' },
  { name: 'B20', cType: INT32, scale: 1000, desc: '柔性直流空调2' },
  { name: 'B24', cType: INT32, scale: 1000, desc: '柔性直流充电桩' },
  { name: 'B28', cType: INT32, scale: 1000, desc: '照明' },
  // 电量统计
  { name: 'B32', cType: INT32, scale: 100, desc: '今日发电' },
  { name: 'B36', cType: INT32, scale: 100, desc: '今日用电' },
  { name: 'B40', cType: INT32, scale: 100, desc: '电网供电' },
  { name: 'B44', cType: UINT16, scale: 100, desc: '储能剩余电量' },
  { name: 'B46', cType: INT32, scale: 100, desc: '当日发电量' },
  { name: 'B50', cType: INT32, scale: 100, desc: '日最高发电量' },
  { name: 'B54', cType: INT32, scale: 100, desc: '历史最高发电功率' },
  { name: 'B58', cType: INT32, scale: 100, desc: '累计发电量' },
  { name: 'B62', cType: UINT32, desc: '累计发电时长（天）' },
  { name: 'B66', cType: UINT16, scale: 100, desc: 'SOC' },
  { name: 'B68', cType: UINT16, desc: '剩余电量预计可用小时' },
  { name: 'B70', cType: UINT16, desc: '充放电比' },
  { name: 'B72', cType: INT32, scale: 100, desc: '日最高充电量' },
  { name: 'B76', cType: INT32, scale: 100, desc: '日最高放电量' },
  { name: 'B80', cType: UINT16, scale: 100, desc: '放电达成率（日）' },
  { name: 'B82', cType: INT32, scale: 1000, desc: '总功率曲线' },
  { name: 'B86', cType: INT32, scale: 100, desc: '电网累计供电' },
  { name: 'B90', cType: INT16, scale: 1000, desc: '交流负荷功率' },
])

const specialDataFields = createFields([
  // 状态量
  { name: 'B0', cType: UINT16, desc: '储能充放电状态' },
  { name: 'B2', cType: UINT16, desc: '电网状态' },
  { name: 'B4', cType: UINT16, desc: '启动按钮' },
  // 日最高发电量出现日期
  { name: 'B6', cType: UINT16, desc: '日最高发电量出现日期（年）' },
  { name: 'B8', cType: UINT16, desc: '日最高发电量出现日期（月）' },
  { name: 'B10', cType: UINT16, desc: '日最高发电量出现日期（日）' },
  { name: 'B12', cType: UINT16, desc: '日最高发电量出现日期（时）' },
  { name: 'B14', cType: UINT16, desc: '日最高发电量出现日期（分）' },
  { name: 'B16', cType: UINT16, desc: '日最高发电量出现日期（秒）' },
  // 历史最高发电功率出现时间
  { name: 'B18', cType: UINT16, desc: '历史最高发电功率出现时间（年）' },
  { name: 'B20', cType: UINT16, desc: '历史最高发电功率出现时间（月）' },
  { name: 'B22', cType: UINT16, desc: '历史最高发电功率出现时间（日）' },
  { name: 'B24', cType: UINT16, desc: '历史最高发电功率出现时间（时）' },
  { name: 'B26', cType: UINT16, desc: '历史最高发电功率出现时间（分）' },
  { name: 'B28', cType: UINT16, desc: '历史最高发电功率出现时间（秒）' },
  { name: 'B30', cType: UINT16, desc: '充电状态' },
  // 日最高充电量出现日期
  { name: 'B32', cType: UINT16, desc: '日最高充电量出现日期(年)' },
  { name: 'B34', cType: UINT16, desc: '日最高充电量出现日期(月)' },
  { name: 'B36', cType: UINT16, desc: '日最高充电量出现日期(日)' },
  { name: 'B38', cType: UINT16, desc: '日最高充电量出现日期(时)' },
  { name: 'B40', cType: UINT16, desc: '日最高充电量出现日期(分)' },
  { name: 'B42', cType: UINT16, desc: '日最高充电量出现日期(秒)' },
  // 日最高放电量出现日期
  { name: 'B44', cType: UINT16, desc: '日最高放电量出现日期（年）' },
  { name: 'B46', cType: UINT16, desc: '日最高放电量出现日期（月）' },
  { name: 'B48', cType: UINT16, desc: '日最高放电量出现日期（日）' },
  { name: 'B50', cType: UINT16, desc: '日最高放电量出现日期（时）' },
  { name: 'B52', cType: UINT16, desc: '日最高放电量出现日期（分）' },
  { name: 'B54', cType: UINT16, desc: '日最高放电量出现日期（秒）' },
  // 响应查询
  { name: 'B56', cType: UINT16, desc: '响应次数查询' },
  { name: 'B58', cType: UINT16, desc: '响应时长查询' },
  { name: 'B60', cType: INT32, scale: 100, desc: '响应量查询' },
  { name: 'B64', cType: INT32, scale: 100, desc: '响应收益查询' },
  { name: 'B68', cType: INT32, scale: 100, desc: '收益统计曲线' },
  // 设备收益分析
  { name: 'B72', cType: INT32, scale: 100, desc: '设备收益分析（1）' },
  { name: 'B76', cType: INT32, scale: 100, desc: '设备收益分析（2）' },
  { name: 'B80', cType: INT32, scale: 100, desc: '设备收益分析（3）' },
  { name: 'B84', cType: INT32, scale: 100, desc: '设备收益分析（4）' },
  { name: 'B88', cType: INT32, scale: 100, desc: '设备收益分析（5）' },
  { name: 'B92', cType: INT32, scale: 100, desc: '设备收益分析（6）' },
  // 日统计
  { name: 'B96', cType: INT32, scale: 100, desc: '发电量统计（日）' },
  { name: 'B100', cType: INT32, scale: 100, desc: '充电量统计查询（日）' },
  { name: 'B104', cType: INT32, scale: 100, desc: '放电量统计查询（日）' },
])

export const protocol_170F_000A = {
  deviceType: '170F',
  version: '000A',
  structs: {
    energyData: { fields: energyDataFields, bytes: 92 },
    specialData: { fields: specialDataFields, bytes: 108 },
  },

  parseEnergyData(bytes) {
    return parseStruct(bytes, energyDataFields)
  },

  parseSpecialData(bytes) {
    return parseStruct(bytes, specialDataFields)
  },
}
