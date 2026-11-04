/**
 * 50kW 微能站（1707 PCS V3.5 / 170C DC-DC V1.1 / 171C BMS V2.0）展示字段表
 *
 * 用途：直连设备页 4 个监测 tab 在 50kW 模式下的分组、字段名、单位与系数，
 *       与云端监控页（community/monitor-data）保持一致。
 *
 * 字段说明：
 *   key      协议字节地址键（由 service/protocols/{1707_V3_5,170C_V1_1,171C_V2}.js 产出）
 *   scale    点表系数：显示值 = 原始值 / scale
 *   offset   点表偏移：显示值 = 原始值 / scale + offset
 *   decimals 小数位
 *   unit     单位（附加在数值后）
 *   map      枚举：{ 原始值: 显示文案 }
 *   keys     多字节合并：[低16位key, 高16位key]，按 (high<<16)|low 计算
 */

// ==================== PCS 1707 V3.5 ====================

// 设备状态位 0/1 → 文案
const STATUS_ON = { 0: '--', 1: '是' }
const REMOTE_LOCAL = { 0: '本地', 1: '远程' }

// 交流侧 / 直流侧 / 温度 / 电量 / 版本
const PCS_AC = [
  { key: 'B4', label: 'PCS端口A相电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B6', label: 'PCS端口B相电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B8', label: 'PCS端口C相电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B10', label: 'PCS输出A相电流(A)', scale: 10, decimals: 1, unit: 'A' },
  { key: 'B12', label: 'PCS输出B相电流(A)', scale: 10, decimals: 1, unit: 'A' },
  { key: 'B14', label: 'PCS输出C相电流(A)', scale: 10, decimals: 1, unit: 'A' },
  { key: 'B96', label: 'N相电流有效值(A)', scale: 10, decimals: 1, unit: 'A' },
  { key: 'B16', label: '电网频率(Hz)', scale: 100, decimals: 2, unit: 'Hz' },
  { key: 'B18', label: 'PCSA相输出有功功率(kW)', scale: 10, decimals: 1, unit: 'kW' },
  { key: 'B20', label: 'PCSB相输出有功功率(kW)', scale: 10, decimals: 1, unit: 'kW' },
  { key: 'B22', label: 'PCSC相输出有功功率(kW)', scale: 10, decimals: 1, unit: 'kW' },
  { key: 'B24', label: 'PCS总输出有功功率(kW)', scale: 10, decimals: 1, unit: 'kW' },
  { key: 'B26', label: 'PCSA相输出无功功率(kVar)', scale: 10, decimals: 1, unit: 'kVar' },
  { key: 'B28', label: 'PCSB相输出无功功率(kVar)', scale: 10, decimals: 1, unit: 'kVar' },
  { key: 'B30', label: 'PCSC相输出无功功率(kVar)', scale: 10, decimals: 1, unit: 'kVar' },
  { key: 'B32', label: 'PCS总输出无功功率(kVar)', scale: 10, decimals: 1, unit: 'kVar' },
  { key: 'B34', label: 'PCSA相输出视在功率(kVA)', scale: 10, decimals: 1, unit: 'kVA' },
  { key: 'B36', label: 'PCSB相输出视在功率(kVA)', scale: 10, decimals: 1, unit: 'kVA' },
  { key: 'B38', label: 'PCSC相输出视在功率(kVA)', scale: 10, decimals: 1, unit: 'kVA' },
  { key: 'B40', label: 'PCS总输出视在功率(kVA)', scale: 10, decimals: 1, unit: 'kVA' },
  { key: 'B42', label: 'PCS输出A相功率因数', scale: 1000, decimals: 3, unit: '' },
  { key: 'B44', label: 'PCS输出B相功率因数', scale: 1000, decimals: 3, unit: '' },
  { key: 'B46', label: 'PCS输出C相功率因数', scale: 1000, decimals: 3, unit: '' },
  { key: 'B48', label: 'PCS输出总功率因数', scale: 1000, decimals: 3, unit: '' }
]

const PCS_DC = [
  { key: 'B50', label: 'PCS输入功率(kW)', scale: 10, decimals: 1, unit: 'kW' },
  { key: 'B52', label: 'PCS输入电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B54', label: 'PCS输入电流(A)', scale: 10, decimals: 1, unit: 'A' }
]

const PCS_TEMP = [
  { key: 'B56', label: 'PCS散热器温度(℃)', scale: 1, decimals: 0, unit: '℃' },
  { key: 'B116', label: '片上SOC温度(℃)', scale: 10, decimals: 1, unit: '℃' },
  { key: 'B118', label: 'IGBT温度1-1', scale: 1, decimals: 0, unit: '℃' },
  { key: 'B119', label: 'IGBT温度1-2', scale: 1, decimals: 0, unit: '℃' },
  { key: 'B120', label: 'IGBT温度2-1', scale: 1, decimals: 0, unit: '℃' },
  { key: 'B121', label: 'IGBT温度2-2', scale: 1, decimals: 0, unit: '℃' },
  { key: 'B122', label: 'IGBT温度3-1', scale: 1, decimals: 0, unit: '℃' },
  { key: 'B123', label: 'IGBT温度3-2', scale: 1, decimals: 0, unit: '℃' },
  { key: 'B124', label: 'IGBT温度4-1', scale: 1, decimals: 0, unit: '℃' },
  { key: 'B125', label: 'IGBT温度4-2', scale: 1, decimals: 0, unit: '℃' }
]

const PCS_ENERGY = [
  { keys: ['B62', 'B64'], label: 'PCS交流累计充电电量(kWh)', scale: 1000, decimals: 1, unit: 'kWh' },
  { keys: ['B66', 'B68'], label: 'PCS交流累计放电电量(kWh)', scale: 1000, decimals: 1, unit: 'kWh' },
  { keys: ['B70', 'B72'], label: 'PCS直流累计充电电量(kWh)', scale: 1000, decimals: 1, unit: 'kWh' },
  { keys: ['B74', 'B76'], label: 'PCS直流累计放电电量(kWh)', scale: 1000, decimals: 1, unit: 'kWh' }
]

const PCS_VERSION = [
  { key: 'B78', label: 'PCS通讯状态字', scale: 1, decimals: 0, unit: '' },
  { key: 'B92', label: 'PCS程序版本', scale: 10, decimals: 1, unit: '' },
  { key: 'B94', label: 'FPGA程序版本', scale: 1, decimals: 0, unit: '' },
  { key: 'B98', label: 'PCS状态查询码1', scale: 1, decimals: 0, unit: '' },
  { key: 'B100', label: 'PCS状态查询码2', scale: 1, decimals: 0, unit: '' },
  { key: 'B102', label: 'PCS状态查询码3', scale: 1, decimals: 0, unit: '' },
  { key: 'B104', label: 'PCS状态查询码4', scale: 1, decimals: 0, unit: '' },
  { key: 'B106', label: 'PCS状态查询码5', scale: 1, decimals: 0, unit: '' },
  { key: 'B108', label: 'PCS状态查询码6', scale: 1, decimals: 0, unit: '' },
  { key: 'B110', label: 'PCS状态查询码7', scale: 1, decimals: 0, unit: '' },
  { key: 'B112', label: 'PCS状态查询码8', scale: 1, decimals: 0, unit: '' },
  { keys: ['B80', 'B82', 'B84', 'B86', 'B88', 'B90'], combine: 'clock', label: '系统时钟', scale: 1, decimals: 0, unit: '' }
]

const PCS_STATUS = [
  { key: 'B2b0', label: '停机状态', map: { 0: '--', 1: '停机' } },
  { key: 'B2b1', label: '待机状态', map: { 0: '--', 1: '待机' } },
  { key: 'B2b2', label: '运行状态', map: { 0: '--', 1: '运行' } },
  { key: 'B2b3', label: '总故障状态', map: { 0: '--', 1: '故障' } },
  { key: 'B2b4', label: '总报警状态', map: { 0: '--', 1: '告警' } },
  { key: 'B2b5', label: '远程就地状态', map: REMOTE_LOCAL },
  { key: 'B2b6', label: '急停输入状态', map: { 0: '--', 1: '有效' } },
  { key: 'B2b7', label: '并网状态', map: { 0: '--', 1: '并网' } },
  { key: 'B3b0', label: 'VF离网状态', map: { 0: '--', 1: 'VF离网' } },
  { key: 'B3b1', label: '过载降容', map: { 0: '--', 1: '过载发生' } },
  { key: 'B3b5', label: 'BMS干接点输入', map: { 0: '--', 1: '故障有效' } },
  { key: 'B1b0', label: '外部电操开关', map: { 0: '分闸', 1: '合闸' } }
]

// 故障信息（FPGA 硬件故障 / ARM 软件故障）
// 按点表的字节地址分组：每个字节约对应一类保护，组名取该字节的语义，
// 便于在有限屏宽下分节浏览（原先是 64 个标签平铺，视觉上没有层次）。
const PCS_FAULT_GROUPS = [
  {
    title: '电池与母线',
    items: [
      { key: 'B115b1', name: '电池软件过压' },
      { key: 'B115b2', name: '电池软件欠压' },
      { key: 'B115b3', name: '母线不平衡' },
      { key: 'B115b4', name: '母线半直压过压' },
      { key: 'B115b5', name: 'DCDC启动超时' },
      { key: 'B115b7', name: '交流漏电流保护' }
    ]
  },
  {
    title: '功率模块',
    items: [
      { key: 'B146b1', name: '开关电源欠压' },
      { key: 'B146b2', name: 'A相IGBT故障' },
      { key: 'B146b3', name: 'B相IGBT故障' },
      { key: 'B146b4', name: 'C相IGBT故障' },
      { key: 'B146b5', name: 'N相IGBT故障' },
      { key: 'B146b6', name: '过温故障' }
    ]
  },
  {
    title: '硬件过流',
    items: [
      { key: 'B147b0', name: 'A相硬件过流' },
      { key: 'B147b1', name: 'B相硬件过流' },
      { key: 'B147b2', name: 'C相硬件过流' },
      { key: 'B147b3', name: 'N相硬件过流' },
      { key: 'B147b6', name: '单元直压故障' }
    ]
  },
  {
    title: '交流电网',
    items: [
      { key: 'B148b0', name: '交流过压' },
      { key: 'B148b1', name: '交流欠压' },
      { key: 'B148b2', name: '输出过压' },
      { key: 'B148b3', name: '输出欠压' },
      { key: 'B148b4', name: '电压THDU超限' },
      { key: 'B148b5', name: '系统缺相' },
      { key: 'B148b6', name: '系统相序错误' },
      { key: 'B148b7', name: '直流极性反接' }
    ]
  },
  {
    title: '输出保护',
    items: [
      { key: 'B149b0', name: 'A相输出过流' },
      { key: 'B149b1', name: 'A相输出速断' },
      { key: 'B149b2', name: 'B相输出过流' },
      { key: 'B149b3', name: 'B相输出速断' },
      { key: 'B149b4', name: 'C相输出过流' },
      { key: 'B149b5', name: 'C相输出速断' },
      { key: 'B149b6', name: 'N相输出速断1' },
      { key: 'B149b7', name: 'N相输出速断2' }
    ]
  },
  {
    title: '开关与软启',
    items: [
      { key: 'B150b0', name: '交流主接合闸故障' },
      { key: 'B150b1', name: '交流主接分闸故障' },
      { key: 'B150b2', name: '交流软启合闸故障' },
      { key: 'B150b3', name: '交流软启分闸故障' },
      { key: 'B150b4', name: '直流主接合闸故障' },
      { key: 'B150b5', name: '直流主接分闸故障' },
      { key: 'B150b6', name: '直流软启合闸故障1' },
      { key: 'B150b7', name: '直流软启合闸故障2' }
    ]
  },
  {
    title: '直流与频率',
    items: [
      { key: 'B151b0', name: '直流母线软件过压' },
      { key: 'B151b1', name: '直流母线软件欠压' },
      { key: 'B151b2', name: '系统过频率' },
      { key: 'B151b3', name: '系统欠频率' },
      { key: 'B151b4', name: '直流充电过流' },
      { key: 'B151b5', name: '直流放电过流' },
      { key: 'B151b6', name: '孤岛保护' },
      { key: 'B151b7', name: '直流分量超限' }
    ]
  },
  {
    title: '通讯与联锁',
    items: [
      { key: 'B152b0', name: 'BMS通讯故障' },
      { key: 'B152b1', name: 'BMS温度异常' },
      { key: 'B152b2', name: 'BMS跳机' },
      { key: 'B152b3', name: 'BMS电池告警' },
      { key: 'B152b4', name: 'DCDC通讯故障' },
      { key: 'B152b5', name: 'EMS通讯故障' },
      { key: 'B152b6', name: '急停或熔芯故障' },
      { key: 'B152b7', name: 'PCS光纤通讯故障' }
    ]
  },
  {
    title: '系统与起机',
    items: [
      { key: 'B153b0', name: '铁电参数存储错误' },
      { key: 'B153b1', name: '直流软起失败' },
      { key: 'B153b4', name: '起机条件不满足' },
      { key: 'B153b5', name: '运行中开关故障' },
      { key: 'B153b6', name: '逆变启动超时' },
      { key: 'B153b7', name: '参数下发设置错误' }
    ]
  }
]

// 扁平清单（保持旧引用可用）
const PCS_FAULTS = PCS_FAULT_GROUPS.reduce((acc, g) => acc.concat(g.items), [])


// ==================== 储能 / 光伏 170C V1.1 ====================

const DC_RUN = [
  { key: 'B30', label: 'BAT侧电压显示(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B32', label: 'BUS侧电压显示(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B34', label: 'BUS侧电流显示(A)', scale: 10, decimals: 1, unit: 'A' },
  { key: 'B36', label: 'BAT侧电流显示(A)', scale: 10, decimals: 1, unit: 'A' },
  { key: 'B38', label: '模块最高温度(℃)', scale: 1, decimals: 0, unit: '℃' },
  { key: 'B40', label: '允许运行功率(kW)', scale: 10, decimals: 1, unit: 'kW' },
  { key: 'B42', label: '当前运行功率(kW)', scale: 10, decimals: 1, unit: 'kW' }
]

// 机器运行状态（状态帧 B8 掩码，BIT0~BIT7 可多位同时置位）
const DC_RUN_STATE_BITS = [
  { bit: 0, name: '停机' },
  { bit: 1, name: '运行' },
  { bit: 2, name: '故障' },
  { bit: 3, name: '过载' },
  { bit: 4, name: 'BAT 软起' },
  { bit: 5, name: 'BAT 主接' },
  { bit: 6, name: 'BUS 软起' },
  { bit: 7, name: 'BUS 主接' }
]

// 故障码（状态帧 B10）
const DC_ERROR_CODE = {
  0: '无故障', 1: '保留', 2: 'BUS侧过流保护', 3: '通讯故障', 4: '过流保护',
  5: '保留', 6: 'BUS侧过压故障', 7: 'BAT侧过压故障', 8: 'BUS侧过压保护',
  9: 'BAT侧欠压故障', 10: '风扇故障', 11: 'BAT侧过压故障', 12: 'BAT侧过流',
  13: 'BUS侧过流', 14: '散热器过热', 15: '单元1过流故障', 16: '单元2过流故障',
  17: '单元3过流故障', 18: '单元4过流故障', 19: '单元5过流故障', 20: '单元6过流故障',
  21: 'EEPORM读写故障（ERR21）', 22: '单元1VCE保护', 23: '单元2VCE保护',
  24: '单元3VCE保护', 25: '单元4VCE保护', 26: '单元5VCE保护', 27: '单元6VCE保护',
  28: 'Can地址重复故障', 41: '急停故障'
}

/**
 * 故障码分组（170C 故障码是「单值枚举」，同一时刻只会命中 1 个，
 * 与 PCS 的 63 位状态量语义不同，因此单独用 FaultCodeBoard 渲染）
 * 组内 27 项 = 点表中除「保留」外的全部有效码
 */
const DC_ERROR_GROUPS = [
  { title: '母线（BUS 侧）', codes: [2, 6, 8, 13] },
  { title: '电池（BAT 侧）', codes: [7, 9, 11, 12] },
  { title: '功率单元 · 过流', codes: [15, 16, 17, 18, 19, 20] },
  { title: '功率单元 · VCE', codes: [22, 23, 24, 25, 26, 27] },
  { title: '硬件与通讯', codes: [3, 10, 14, 21, 28] },
  { title: '系统保护', codes: [4, 41] }
].map(g => ({
  title: g.title,
  items: g.codes.map(code => ({ code, name: DC_ERROR_CODE[code] }))
}))

// ==================== BMS 171C V2.0 ====================
// 依据点表《(0x171C)BMS 设备协议(TCP)-V2.0-20261015》能源数据 0x02 / 状态数据 0x03
// 说明：状态帧的键在 bucket 中带 S_ 前缀（useFrameTypePrefix），能源帧不带

// 单体信息（能源数据）
const BMS_CELL = [
  { key: 'B14', label: '电池平均电压(mV)', scale: 1, decimals: 0, unit: 'mV' },
  { key: 'B16', label: '最高单体电压(mV)', scale: 1, decimals: 0, unit: 'mV' },
  { key: 'B18', label: '最低单体电压(mV)', scale: 1, decimals: 0, unit: 'mV' },
  { key: 'B20', label: '最大电压电池位置', scale: 1, decimals: 0, unit: '' },
  { key: 'B22', label: '最小电压电池位置', scale: 1, decimals: 0, unit: '' },
  { key: 'B74', label: '单体最大压差(mV)', scale: 1, decimals: 0, unit: 'mV' },
  { key: 'B70', label: '本次上电最大单体值(mV)', scale: 1, decimals: 0, unit: 'mV' },
  { key: 'B72', label: '本次上电最大单体位置', scale: 1, decimals: 0, unit: '' },
  { key: 'B24', label: '最高电芯温度(℃)', scale: 1, decimals: 0, offset: -50, unit: '℃' },
  { key: 'B25', label: '最低电芯温度(℃)', scale: 1, decimals: 0, offset: -50, unit: '℃' },
  { key: 'B26', label: '单体最大温差(℃)', scale: 1, decimals: 0, offset: -50, unit: '℃' },
  { key: 'B27', label: '电池平均温度(℃)', scale: 1, decimals: 0, offset: -50, unit: '℃' },
  { key: 'B28', label: '最高温度电池位置', scale: 1, decimals: 0, unit: '' },
  { key: 'B30', label: '最低温度电池位置', scale: 1, decimals: 0, unit: '' }
]

// 系统配置（状态帧 S_B70~S_B80 + 能源数据限制值 + PACK 采集数量）
const BMS_CONFIG = [
  { key: 'S_B70', label: '额定电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'S_B72', label: '额定容量(Ah)', scale: 10, decimals: 1, unit: 'Ah' },
  { key: 'S_B74', label: '电池串数', scale: 1, decimals: 0, unit: '' },
  { key: 'S_B76', label: '电池温感数', scale: 1, decimals: 0, unit: '' },
  { key: 'S_B78', label: '从机(pack)数量', scale: 1, decimals: 0, unit: '' },
  { key: 'S_B80', label: '极柱温感数', scale: 1, decimals: 0, unit: '' },
  { key: 'B170', label: 'PACK温感采集数量', scale: 1, decimals: 0, unit: '' },
  { key: 'B172', label: 'PACK电压采集数量', scale: 1, decimals: 0, unit: '' },
  { key: 'B2', label: '充电最大电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B4', label: '最大放电电流(A)', scale: 10, decimals: 1, unit: 'A' },
  { key: 'B6', label: '放电最小电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B8', label: '最大充电电流(A)', scale: 10, decimals: 1, unit: 'A' },
  { key: 'B114', label: 'PACK总容量(Ah)', scale: 10, decimals: 1, unit: 'Ah' }
]

// 电气测量（能源数据）：SOC/SOH、总压总流、绝缘、HV/BAT+、分流器与霍尔电流
const BMS_MEASURE = [
  { key: 'B32', label: 'SOC(%)', scale: 10, decimals: 1, unit: '%' },
  { key: 'B34', label: '实际剩余容量(%)', scale: 10, decimals: 1, unit: '%' },
  { key: 'B112', label: 'SOH(%)', scale: 10, decimals: 1, unit: '%' },
  { key: 'B10', label: '总电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B12', label: '总电流(A)', scale: 10, offset: -1000, decimals: 1, unit: 'A' },
  { key: 'B36', label: '正极绝缘阻值(kΩ)', scale: 1, decimals: 0, unit: 'kΩ' },
  { key: 'B38', label: '负极绝缘阻值(kΩ)', scale: 1, decimals: 0, unit: 'kΩ' },
  { key: 'B40', label: 'HV1电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B42', label: 'HV2电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B44', label: 'BAT+电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B48', label: '电池累计电压(V)', scale: 10, decimals: 1, unit: 'V' },
  { key: 'B56', label: '分流器电流(A)', scale: 10, offset: -1000, decimals: 1, unit: 'A' },
  { key: 'B58', label: '霍尔电流1(A)', scale: 10, offset: -1000, decimals: 1, unit: 'A' },
  { key: 'B60', label: '霍尔电流2(A)', scale: 10, offset: -1000, decimals: 1, unit: 'A' },
  { key: 'B62', label: 'CAN霍尔电流(A)', scale: 10, offset: -1000, decimals: 1, unit: 'A' }
]

// 状态与继电器（能源数据 B47 位组 / B53 继电器 / B55 继电器故障）
const RELAY_FAULT_MAP = { 0: '无故障', 1: '粘连故障', 2: '开路故障', 3: '诊断电路故障' }
const BMS_STATE = [
  { bitField: { key: 'B47', start: 0, width: 2 }, label: '预充状态', map: { 0: '无', 1: '预充电', 2: '已预充电', 3: '预充电失败' } },
  { key: 'B47b2', label: '均衡状态', map: { 0: '未在均衡', 1: '在均衡' } },
  { key: 'B47b3', label: '加热状态', map: { 0: '无效', 1: '有效' } },
  { key: 'B47b4', label: '制冷状态', map: { 0: '无效', 1: '有效' } },
  { key: 'B47b5', label: '高压低锁定状态', map: { 0: '无效', 1: '有效' } },
  { key: 'B47b6', label: '准备状态', map: { 0: '无效', 1: '有效' } },
  { key: 'B47b7', label: 'BMS模式', map: { 0: '无效', 1: '有效' } },
  { key: 'B50', label: '自检状态', map: { 0: '检查中', 1: '完成', 2: '失败', 3: '预留' } },
  { key: 'B53b0', label: '总正继电器状态', map: { 0: '断开', 1: '闭合' } },
  { key: 'B53b1', label: '总负继电器状态', map: { 0: '断开', 1: '闭合' } },
  { key: 'B53b2', label: '预充继电器状态', map: { 0: '断开', 1: '闭合' } },
  { key: 'B53b3', label: '断路器状态', map: { 0: '断开', 1: '闭合' } },
  { bitField: { key: 'B55', start: 0, width: 2 }, label: '总正继电器故障状态', map: RELAY_FAULT_MAP },
  { bitField: { key: 'B55', start: 2, width: 2 }, label: '总负继电器故障状态', map: RELAY_FAULT_MAP },
  { bitField: { key: 'B55', start: 4, width: 2 }, label: '预充继电器故障状态', map: RELAY_FAULT_MAP },
  { bitField: { key: 'B55', start: 6, width: 2 }, label: '断路器故障状态', map: RELAY_FAULT_MAP },
  { key: 'B66', label: '电池连接失败原因', map: { 0: '成功', 1: '通信失败', 2: '数据错误', 3: '其他错误' } },
  { key: 'B68', label: '电池未成功连接原因', scale: 1, decimals: 0, unit: '' }
]

// 电量与时长（能源数据）：累计电量 32 位；时间点表单位 5min（显示 = 原始值 × 5 min）
const BMS_ENERGY = [
  { key: 'B124', label: '累计充电电量(kWh)', scale: 10, decimals: 1, unit: 'kWh' },
  { key: 'B120', label: '累计放电电量(kWh)', scale: 10, decimals: 1, unit: 'kWh' },
  { key: 'B142', label: '当日累计充电量(kWh)', scale: 10, decimals: 1, unit: 'kWh' },
  { key: 'B144', label: '当日累计放电量(kWh)', scale: 10, decimals: 1, unit: 'kWh' },
  { key: 'B118', label: '单次充电累计电量(kWh)', scale: 10, decimals: 1, unit: 'kWh' },
  { key: 'B116', label: '单次放电累计电量(kWh)', scale: 10, decimals: 1, unit: 'kWh' },
  { key: 'B128', label: '累计充电次数(循环)', scale: 1, decimals: 0, unit: '' },
  // 点表：传输值=(实际值*5)，单位 5min → 分钟 = 原始值 × 5（scale 0.2）
  { key: 'B130', label: '累计使用时间(min)', scale: 0.2, decimals: 0, unit: 'min' },
  { key: 'B138', label: '累积充电时间(min)', scale: 0.2, decimals: 0, unit: 'min' },
  { key: 'B134', label: '累积放电时间(min)', scale: 0.2, decimals: 0, unit: 'min' }
]

// 高压盒（PDU）极柱温度：B148/B149 及 B158~B165 为单字节 uint8，偏移 -50
const BMS_PDU = [
  { key: 'B156', label: 'PDU温度数量', scale: 1, decimals: 0, unit: '' },
  { key: 'B148', label: '极柱最高温度(℃)', scale: 1, decimals: 0, offset: -50, unit: '℃' },
  { key: 'B149', label: '极柱最低温度(℃)', scale: 1, decimals: 0, offset: -50, unit: '℃' },
  { key: 'B150', label: '极柱最高温度位置', scale: 1, decimals: 0, unit: '' },
  { key: 'B152', label: '极柱最低温度位置', scale: 1, decimals: 0, unit: '' }
].concat([1, 2, 3, 4, 5, 6, 7, 8].map(n => ({
  key: 'B' + (157 + n),
  label: 'PDU' + n + '极柱温度(℃)',
  scale: 1,
  decimals: 0,
  offset: -50,
  unit: '℃'
})))

// PACK 信息：PACK1~3 各 9 项（PACK 总压 / 最高最低单体温度 / 温度与电压位置 / 最高最低单体电压）
const BMS_PACK = ['PACK1', 'PACK2', 'PACK3'].reduce((acc, name, i) => {
  const base = 176 + i * 16
  const B = n => 'B' + (base + n)
  return acc.concat([
    { key: B(0), label: name + '总压(V)', scale: 10, decimals: 1, unit: 'V' },
    { key: B(2), label: name + '最高单体温度(℃)', scale: 1, decimals: 0, offset: -50, unit: '℃' },
    { key: B(3), label: name + '最低单体温度(℃)', scale: 1, decimals: 0, offset: -50, unit: '℃' },
    { key: B(4), label: name + '最高温度位置', scale: 1, decimals: 0, unit: '' },
    { key: B(6), label: name + '最低温度位置', scale: 1, decimals: 0, unit: '' },
    { key: B(8), label: name + '最高电压位置', scale: 1, decimals: 0, unit: '' },
    { key: B(10), label: name + '最低电压位置', scale: 1, decimals: 0, unit: '' },
    { key: B(12), label: name + '最高单体电压(mV)', scale: 1, decimals: 0, unit: 'mV' },
    { key: B(14), label: name + '最低单体电压(mV)', scale: 1, decimals: 0, unit: 'mV' }
  ])
}, [])

// 兼容旧引用：系统信息 = 电气测量 + 状态继电器 + 电量时长
const BMS_INFO = BMS_MEASURE.concat(BMS_STATE, BMS_ENERGY)

// 故障字 1~12（能源数据 B78~B100，每字 16 位）
export const BMS_FAULT_WORDS = [
  {
    key: 'B78', title: '故障字1（1级）',
    bits: ['单体过压1级', '单体欠压1级', '单体压差1级', '总压过压1级', '总压欠压1级', '总压压差1级', '放电过流1级', '充电过流1级',
      '放电高温1级', '充电高温1级', '放电低温1级', '充电低温1级', '温差1级', '绝缘阻值低1级', 'T1高温1级', 'T2高温1级']
  },
  {
    key: 'B80', title: '故障字2（1级）',
    bits: ['T3高温1级', 'T4高温1级', 'T5高温1级', '极柱高温1级', '电流异常1级', '供电电压异常1级', '电压排线脱落1级', '温感排线脱落1级',
      'SOC低1级', 'T6高温1级', '', '', '', '', '', '']
  },
  {
    key: 'B82', title: '故障字3（2级）',
    bits: ['单体过压2级', '单体欠压2级', '单体压差2级', '总压过压2级', '总压欠压2级', '总压压差2级', '放电过流2级', '充电过流2级',
      '放电高温2级', '充电高温2级', '放电低温2级', '充电低温2级', '温差2级', '绝缘阻值低2级', 'T1高温2级', 'T2高温2级']
  },
  {
    key: 'B84', title: '故障字4（2级）',
    bits: ['T3高温2级', 'T4高温2级', 'T5高温2级', '极柱高温2级', '电流异常2级', '供电电压异常2级', '电压排线脱落2级', '温感排线脱落2级',
      'SOC低2级', 'T6高温2级', '', '', '', '', '', '']
  },
  {
    key: 'B86', title: '故障字5（3级）',
    bits: ['单体过压3级', '单体欠压3级', '单体压差3级', '总压过压3级', '总压欠压3级', '总压压差3级', '放电过流3级', '充电过流3级',
      '放电高温3级', '充电高温3级', '放电低温3级', '充电低温3级', '温差3级', '绝缘阻值低3级', 'T1高温3级', 'T2高温3级']
  },
  {
    key: 'B88', title: '故障字6（3级）',
    bits: ['T3高温3级', 'T4高温3级', 'T5高温3级', '极柱高温3级', '电流异常3级', '供电电压异常3级', '电压排线脱落3级', '温感排线脱落3级',
      'SOC低3级', 'T6高温3级', '', '', '', '', '', '']
  },
  {
    key: 'B90', title: '故障字7（4级）',
    bits: ['单体过压4级', '单体欠压4级', '单体压差4级', '总压过压4级', '总压欠压4级', '总压压差4级', '放电过流4级', '充电过流4级',
      '放电高温4级', '充电高温4级', '放电低温4级', '充电低温4级', '温差4级', '绝缘阻值低4级', 'T1高温4级', 'T2高温4级']
  },
  {
    key: 'B92', title: '故障字8（4级）',
    bits: ['T3高温4级', 'T4高温4级', 'T5高温4级', '极柱高温4级', '电流异常4级', '供电电压异常4级', '电压排线脱落4级', '温感排线脱落4级',
      'SOC低4级', 'T6高温4级', '', '', '', '', '', '']
  },
  {
    key: 'B94', title: '故障字9（特殊）',
    bits: ['BCU硬件故障', 'BMU硬件故障', 'EMS通信故障', '从机通信故障', '空调/TMS通信故障', 'PCS通信故障', '消防通信故障', '除湿机通信故障',
      '充电机通信故障', 'DCDC通信故障', '', '', '', '', '', '']
  },
  {
    key: 'B96', title: '故障字10（特殊）',
    bits: ['总断继电器故障标志位', '熔断器异常', '断路器异常', '预充故障', '热失控故障', '加热故障', '急停故障', '水浸故障',
      '门禁故障', '消防一级（火警）', '消防二级（消防故障）', '消防二级（消防触发）', '气溶胶故障', '', '', '']
  },
  {
    key: 'B98', title: '故障字11（特殊）',
    bits: ['总正继电器粘连', '总正继电器开路', '总负继电器粘连', '总负继电器开路', '充电继电器粘连', '充电继电器开路', '放电继电器粘连', '放电继电器开路',
      '充电负继电器粘连', '充电负继电器开路', '风扇继电器粘连', '风扇继电器开路', '加热继电器粘连', '加热继电器开路', '预留继电器粘连', '预留继电器开路']
  },
  {
    key: 'B100', title: '故障字12（特殊）',
    bits: ['总断继电器故障标志位', '总故障标志位（任意故障）', '', '', '', '', '', '',
      '', '', '', '看门狗复位', '软件复位', '上电复位', '时钟异常复位', '未知复位']
  }
]

// 环境监测 131C（float32，传输值=实际值，不缩放）
const ENV_ITEMS = [
  { key: 'S_B0', label: '温度(℃)', scale: 1, decimals: 1, unit: '℃' },
  { key: 'S_B4', label: '湿度(%RH)', scale: 1, decimals: 1, unit: '%RH' }
]

export {
  PCS_AC,
  PCS_DC,
  PCS_TEMP,
  PCS_ENERGY,
  PCS_VERSION,
  PCS_STATUS,
  PCS_FAULT_GROUPS,
  PCS_FAULTS,
  DC_RUN,
  DC_RUN_STATE_BITS,
  DC_ERROR_CODE,
  DC_ERROR_GROUPS,
  BMS_CELL,
  BMS_CONFIG,
  BMS_MEASURE,
  BMS_STATE,
  BMS_ENERGY,
  BMS_PDU,
  BMS_PACK,
  BMS_INFO,
  ENV_ITEMS
}
