/**
 * direct-device 页面常量集中定义
 * 从 direct-device.vue 提取，便于组件复用与维护
 */
import {
  BMS_NUMERIC_PARAMS,
  BMS_SWITCH_PARAMS,
  BMS_POWER_PARAMS,
  PCS_NUMERIC_PARAMS,
  PCS_SWITCH_PARAMS,
  PV_NUMERIC_PARAMS,
  PV_SWITCH_PARAMS,
  STORAGE_NUMERIC_PARAMS,
  STORAGE_SWITCH_PARAMS,
  QUICK_CONTROL_PARAMS,
  QUICK_POWER_PARAMS
} from '@/service/devices/control-params.js'

const STORAGE_KEY = 'direct_device_config'

const DEVICE_TYPES = [null, '171B', '171D', '171E', '171C', null, null, null, null, null]

// 50kW 新协议 bucket key（与 _normalizeDeviceType 输出一致）
// index 0=概览, 1=PCS, 2=储能DC, 3=光伏, 4=BMS, 10=液冷机监测；5~9=设置（tab 编号由 SETTINGS_TABS 定义）
const DEVICE_TYPES_50KW = [null, '1707', '170C_STORAGE', '170C_PV', '171C_V2', null, null, null, null, null, '0318']

// 监测 tab 组：20kW 只有 5 个（概览+PCS+储能DC+光伏+BMS），50kW 加多液冷机
const TAB_GROUP_MONITOR = [0, 1, 2, 3, 4]
const TAB_GROUP_MONITOR_50KW = [0, 1, 2, 3, 4, 10]
const TAB_GROUP_CONTROL = [5, 6, 7, 8, 9]

const MONITOR_LAST_INDEX = 4
const MONITOR_LAST_INDEX_50KW = 10

// tab 标题索引：监测 tab (0~4, 10) 从此表取；设置 tab (5~9, 11+) 优先从 SETTINGS_TABS / SETTINGS_TABS_50KW 取 title
const TAB_TITLES = {
  0: '概览', 1: 'PCS', 2: '储能DC', 3: '光伏', 4: 'BMS',
  5: 'PCS设置', 6: 'BMS设置', 7: '光伏设置', 8: '储能设置', 9: '快捷控制',
  10: '液冷机',
  11: '快捷控制'
}

// 设备类型 → 寄存器映射：供 updateDisplay(deviceType) 取监控字段
// 20kW 用 DEVICE_TYPES 下标 0~4 的桶，50kW 用 DEVICE_TYPES_50KW 下标 0~4 + 10

const GROUP_TITLE = {
  cluster: '电池簇核心',
  temp: '温度信息',
  cell: '单体电压与内阻',
  soc: '单体 SOC / SOH',
  box: '电池箱温度',
  energy: '累计电量',
  limit: '允许值',
  system: '系统信息',
  status: '运行状态',
  battery: '电池参数',
  power: '功率数据',
  bus: '母线电压',
  voltage: '相电压',
  current: '相电流',
  lineVoltage: '线电压',
  acSide: '交流侧',
  dcSide: '直流侧',
  electrical: '电气参数',
  info: '设备信息'
}

const DEVICE_GROUPS = {
  '171B': ['status', 'voltage', 'current', 'lineVoltage', 'power', 'acSide', 'dcSide', 'system'],
  '171C': ['cluster', 'temp', 'cell', 'soc', 'box', 'energy', 'limit', 'system'],
  '171D': ['status', 'battery', 'power', 'bus', 'temp', 'system'],
  '171E': ['status', 'electrical', 'info']
}

const DEVICE_NAME_MAP = {
  '171B': 'PCS 功率变换系统',
  '171C': 'BMS 电池管理系统',
  '171D': '储能DC-DC变流器',
  '171E': '光伏逆变器'
}

// ============ 状态位/告警位定义（模块级常量，避免每次 computed 重建） ============

// PCS B64 状态位定义：[name, bitPos, isError?]
const PCS_B64_BITS = [
  ['工作模式', 12, false, true], // 特殊：modeMap
  ['U1状态', 21, false, true],
  ['U2状态', 22, false, true],
  ['模块故障', 0, true], ['模块保护', 1, true], ['交流输入缺相', 2, true],
  ['SCI通信故障', 3, true], ['交流侧接线错相', 4, true], ['孤岛告警', 5, true],
  ['内部母线过欠压', 6, true], ['交流侧欠压', 7, true], ['交流侧过压', 8, true],
  ['直流侧过压', 9, true], ['直流侧欠压', 10, true], ['锁相错误', 11, true],
  ['U1过流保护', 14, true], ['风扇故障', 15, true], ['CAN通信故障', 16, true],
  ['模块不均流', 17, true], ['地址重复', 18, true], ['泄放故障', 20, true],
  ['模块限功率', 23, true], ['温度限功率', 24, true], ['交流限功率', 25, true],
  ['交流侧欠频', 26, true], ['交流侧过频', 27, true], ['直流侧短路', 28, true],
  ['堵风道过温', 29, true], ['模块过温', 30, true], ['环温过温', 31, true]
]
const PCS_B64_STATUS_MAP = {
  '工作模式': '#1890FF', 'U1状态': '#52c41a', 'U2状态': '#52c41a',
  '模块故障': '#FF4D4F', '模块保护': '#FAAD14', '交流输入缺相': '#FF4D4F',
  'SCI通信故障': '#FF4D4F', '交流侧接线错相': '#FF4D4F', '孤岛告警': '#FAAD14',
  '内部母线过欠压': '#FF4D4F', '交流侧欠压': '#FAAD14', '交流侧过压': '#FAAD14',
  '直流侧过压': '#FF4D4F', '直流侧欠压': '#FAAD14', '锁相错误': '#FF4D4F',
  'U1过流保护': '#FF4D4F', '风扇故障': '#FF4D4F', 'CAN通信故障': '#FF4D4F',
  '模块不均流': '#FAAD14', '地址重复': '#FF4D4F', '泄放故障': '#FF4D4F',
  '模块限功率': '#FAAD14', '温度限功率': '#FAAD14', '交流限功率': '#FAAD14',
  '交流侧欠频': '#FAAD14', '交流侧过频': '#FAAD14', '直流侧短路': '#FF4D4F',
  '堵风道过温': '#FF4D4F', '模块过温': '#FF4D4F', '环温过温': '#FF4D4F'
}
const PCS_MODE_MAP = { 0: '并网', 1: '离网', 2: '整流' }

// 光伏 B56 状态位定义：[name, bitPos]
const PV_B56_BITS = [
  ['模块故障', 0], ['模块保护', 1], ['SCI通信故障', 3], ['输入模式检测错误', 4],
  ['输入模式不匹配', 5], ['DCDC过压', 7], ['PFC电压异常', 8], ['光伏侧欠压', 9],
  ['光伏侧欠压2', 14], ['CAN通信故障', 16], ['模块不均流', 17], ['模块限功率', 23],
  ['温度限功率', 24], ['光伏侧限功率', 25], ['风扇故障', 27], ['DCDC短路', 28],
  ['DCDC过温', 30], ['DCDC输出过压', 31], ['DCDC状态', 22, false, true] // 特殊：开机/关机
]

// 储能DC DCDC告警位定义
const DCDC_ALARM_FIELDS = [
  { key: 'B40b0', name: '电池过压告警' }, { key: 'B40b1', name: '电池过压关机' },
  { key: 'B40b2', name: '电池快速过压' }, { key: 'B40b3', name: '电池欠压告警' },
  { key: 'B40b4', name: '电池欠压关机' }, { key: 'B40b5', name: '电池快速欠压' },
  { key: 'B40b6', name: '电池输入短路' }, { key: 'B40b7', name: '充放电过流' },
  { key: 'B41b0', name: '充放电快速过流' }, { key: 'B41b1', name: '充放电硬件过流' },
  { key: 'B41b2', name: '电池未接' }, { key: 'B41b3', name: '电池反接' },
  { key: 'B41b4', name: 'BUS3过压' }, { key: 'B41b5', name: 'BUS3快速过压' },
  { key: 'B41b6', name: 'BUS3欠压' }, { key: 'B41b7', name: 'BUS3快速欠压' },
  { key: 'B42b0', name: 'BUS2过压' }, { key: 'B42b1', name: 'BUS2快速过压' },
  { key: 'B42b5', name: 'BUS2欠压' }, { key: 'B42b7', name: 'BUS1+过压' },
  { key: 'B43b0', name: 'BUS1+快速过压' }, { key: 'B43b1', name: 'BUS1-过压' },
  { key: 'B43b2', name: 'BUS1-快速过压' }, { key: 'B43b3', name: 'BUS1电压不平衡' },
  { key: 'B43b4', name: 'BUS1+快速欠压' }, { key: 'B43b5', name: 'BUS1-快速欠压' },
  { key: 'B43b6', name: 'BUS+母线过压' }, { key: 'B43b7', name: 'BUS+母线快速过压' },
  { key: 'B44b0', name: 'BUS-母线过压' }, { key: 'B44b1', name: 'BUS-母线快速过压' },
  { key: 'B44b2', name: 'BUS母线电压不平衡' }, { key: 'B44b3', name: 'BUS母线未接' },
  { key: 'B44b4', name: 'BUS母线反接' }, { key: 'B44b5', name: 'BUS母线短路' },
  { key: 'B44b6', name: 'BUS母线欠压关机' }, { key: 'B44b7', name: 'BUS+母线快速欠压' },
  { key: 'B45b0', name: 'BUS-母线快速欠压' }, { key: 'B45b1', name: 'DCDC1过流' },
  { key: 'B45b2', name: 'DCDC1快速过流' }, { key: 'B45b3', name: 'DCDC1硬件过流' },
  { key: 'B45b4', name: 'DCDC2过流' }, { key: 'B45b5', name: 'DCDC2快速过流' },
  { key: 'B45b6', name: 'DCDC2硬件过流' }, { key: 'B45b7', name: 'DCDC3过流' },
  { key: 'B46b0', name: 'DCDC3快速过流' }, { key: 'B46b1', name: 'DCDC3硬件过流' },
  { key: 'B46b2', name: 'DCDC不均流' }, { key: 'B46b3', name: 'BUS1+硬件过压' },
  { key: 'B46b4', name: '谐振电感A1硬件过流' }, { key: 'B46b5', name: 'BUS1-硬件过压' },
  { key: 'B46b6', name: '谐振电感A2硬件过流' }, { key: 'B46b7', name: '过载110%' },
  { key: 'B47b0', name: '过载125%' }, { key: 'B47b1', name: 'BuckBoost 软启故障' },
  { key: 'B47b2', name: 'DCDC母线软启故障' }, { key: 'B47b3', name: 'DCDC电池软启故障' },
  { key: 'B47b4', name: 'BAT散热器过温' }, { key: 'B47b5', name: 'DCDC原边过温' },
  { key: 'B47b6', name: 'DCDC副边过温' }, { key: 'B47b7', name: 'DCDC环境过温' },
  { key: 'B48b0', name: '辅助电源故障' }, { key: 'B48b1', name: 'DCDC功率降额' },
  { key: 'B48b2', name: 'DCDC风扇A故障' }, { key: 'B48b3', name: 'DCDC风扇B故障' },
  { key: 'B48b4', name: 'E2PROM读故障' }, { key: 'B48b5', name: 'E2PROM写故障' },
  { key: 'B48b6', name: 'DCDC心跳检测异常' }, { key: 'B48b7', name: 'DCDC软件版本错误' },
  { key: 'B49b0', name: '监控CANA通讯故障' }, { key: 'B49b1', name: '并机CANB通讯故障' },
  { key: 'B49b2', name: 'SPI通讯故障' }, { key: 'B49b3', name: '485通讯故障' },
  { key: 'B49b4', name: '母线侧主继电器故障' }, { key: 'B49b5', name: '电池侧主继电器故障' },
  { key: 'B49b6', name: 'DC 机型配置错误' }, { key: 'B49b7', name: 'EPO故障' }
]

// BMS告警位定义
const BMS_ALARM_FIELDS = [
  { key: 'B0b0', name: '组端过压1级告警' }, { key: 'B0b1', name: '组端过压2级告警' },
  { key: 'B0b2', name: '组端过压3级告警' }, { key: 'B0b3', name: '组端欠压1级告警' },
  { key: 'B0b4', name: '组端欠压2级告警' }, { key: 'B0b5', name: '组端欠压3级告警' },
  { key: 'B0b6', name: '组端放电过流1级告警' }, { key: 'B0b7', name: '组端放电过流2级告警' },
  { key: 'B1b0', name: '组端放电过流3级告警' }, { key: 'B1b1', name: '组端充电过流1级告警' },
  { key: 'B1b2', name: '组端充电过流2级告警' }, { key: 'B1b3', name: '组端充电过流3级告警' },
  { key: 'B1b4', name: '组端温度1级告警' }, { key: 'B1b5', name: '组端温度2级告警' },
  { key: 'B1b6', name: '组端温度3级告警' }, { key: 'B1b7', name: '单体电池充电过温1级告警' },
  { key: 'B2b0', name: '单体电池充电过温2级告警' }, { key: 'B2b1', name: '单体电池充电过温3级告警' },
  { key: 'B2b2', name: '单体电池充电欠温1级告警' }, { key: 'B2b3', name: '单体电池充电欠温2级告警' },
  { key: 'B2b4', name: '单体电池充电欠温3级告警' }, { key: 'B2b5', name: '单体电压过压1级告警' },
  { key: 'B2b6', name: '单体电压过压2级告警' }, { key: 'B2b7', name: '单体电压过压3级告警' },
  { key: 'B3b0', name: '单体电压欠压1级告警' }, { key: 'B3b1', name: '单体电压欠压2级告警' },
  { key: 'B3b2', name: '单体电压欠压3级告警' }, { key: 'B3b3', name: '单体压差过高1级告警' },
  { key: 'B3b4', name: '单体压差过高2级告警' }, { key: 'B3b5', name: '单体压差过高3级告警' },
  { key: 'B3b6', name: '单体温差过高1级告警' }, { key: 'B3b7', name: '单体温差过高2级告警' },
  { key: 'B4b0', name: '单体温差过高3级告警' }, { key: 'B4b1', name: 'SOC过低1级告警' },
  { key: 'B4b2', name: 'SOC过低2级告警' }, { key: 'B4b3', name: 'SOC过低3级告警' },
  { key: 'B4b4', name: '动力母线温度过高1级告警' }, { key: 'B4b5', name: '动力母线温度过高2级告警' },
  { key: 'B4b6', name: '动力母线温度过高3级告警' }, { key: 'B4b7', name: '电池模组过压1级告警' },
  { key: 'B5b0', name: '电池模组过压2级告警' }, { key: 'B5b1', name: '电池模组过压3级告警' },
  { key: 'B5b2', name: '电池模组欠压1级告警' }, { key: 'B5b3', name: '电池模组欠压2级告警' },
  { key: 'B5b4', name: '电池模组欠压3级告警' }, { key: 'B5b5', name: 'DI1故障' },
  { key: 'B5b6', name: 'DI2故障' }, { key: 'B5b7', name: 'DI3故障' },
  { key: 'B6b0', name: 'DI4故障' }, { key: 'B6b1', name: 'DI5故障' },
  { key: 'B6b2', name: 'DI6故障' }, { key: 'B6b3', name: 'DI7故障' },
  { key: 'B6b4', name: 'DI8故障' }, { key: 'B6b5', name: '内网通信故障' },
  { key: 'B6b6', name: '单体电压采集异常' }, { key: 'B6b7', name: '单体温度采集异常' },
  { key: 'B7b0', name: '绝缘检测故障' }, { key: 'B7b1', name: '组内压差大' },
  { key: 'B7b2', name: '组内线路故障' }, { key: 'B7b3', name: '电池熔断故障' },
  { key: 'B7b4', name: '项目固件版本参数不一致' }, { key: 'B7b5', name: '非CAN通信故障' },
  { key: 'B7b6', name: 'PC保护调试模式' }, { key: 'B7b7', name: 'CAN总线传感器故障' },
  { key: 'B8b0', name: 'CAN总线传感器通信故障' }, { key: 'B8b1', name: '硬件自检异常' },
  { key: 'B8b2', name: '单体电压断线故障' }, { key: 'B8b3', name: '校准故障' },
  { key: 'B8b4', name: 'EMS通信故障' }, { key: 'B8b5', name: '与三级BMS通信故障' },
  { key: 'B8b6', name: '单体电池放电过温1级告警' }, { key: 'B8b7', name: '单体电池放电过温2级告警' },
  { key: 'B9b0', name: '单体电池放电过温3级告警' }, { key: 'B9b1', name: '单体电池放电欠温1级告警' },
  { key: 'B9b2', name: '单体电池放电欠温2级告警' }, { key: 'B9b3', name: '单体电池放电欠温3级告警' },
  { key: 'B9b4', name: 'SOC过高1级告警' }, { key: 'B9b5', name: 'SOC过高2级告警' },
  { key: 'B9b6', name: 'SOC过高3级告警' }, { key: 'B9b7', name: '温升过快1级告警' },
  { key: 'B10b0', name: '温升过快2级告警' }, { key: 'B10b1', name: '温升过快3级告警' }
]

// 设置面板配置：驱动 init/sync/toggle 的统一数据源
const SETTINGS_PANELS = [
  { dataKey: 'bmsNumericParams',   source: BMS_NUMERIC_PARAMS,   deviceType: '171C', editKey: 'isEditingBms' },
  { dataKey: 'bmsSwitchParams',    source: BMS_SWITCH_PARAMS,    deviceType: '171C', editKey: 'isEditingBms' },
  { dataKey: 'bmsPowerParams',     source: BMS_POWER_PARAMS,     deviceType: '171C', editKey: 'isEditingBms' },
  { dataKey: 'pcsNumericParams',   source: PCS_NUMERIC_PARAMS,   deviceType: '171B', editKey: 'isEditingPcs' },
  { dataKey: 'pcsSwitchParams',     source: PCS_SWITCH_PARAMS,    deviceType: '171B', editKey: 'isEditingPcs' },
  { dataKey: 'pvNumericParams',     source: PV_NUMERIC_PARAMS,    deviceType: '171E', editKey: 'isEditingPv' },
  { dataKey: 'pvSwitchParams',      source: PV_SWITCH_PARAMS,     deviceType: '171E', editKey: 'isEditingPv' },
  { dataKey: 'storageNumericParams',source: STORAGE_NUMERIC_PARAMS,deviceType: '171D', editKey: 'isEditingStorage' },
  { dataKey: 'storageSwitchParams', source: STORAGE_SWITCH_PARAMS,deviceType: '171D', editKey: 'isEditingStorage' },
  { dataKey: 'quickControlParams',  source: QUICK_CONTROL_PARAMS, deviceType: '171F', editKey: 'isEditingQuickControl' },
  { dataKey: 'quickPowerParams',    source: QUICK_POWER_PARAMS,   deviceType: '171F', editKey: 'isEditingQuickControl' }
]

// ========== 50kW 新协议设置面板配置（直连版，key 与 MQTT 帧解析产出的 B-key 对齐） ==========
// 帧键前缀规则（见 direct-device.vue applyIemsFrame）：
//   ENERGY 帧保持原键（B0/B0b0…），STATE 帧键加 'S_' 前缀，CONTROL 帧键加 'C_' 前缀
// 避免同一 bucket 内 ENERGY 与 STATE/CONTROL 共享 B-key 互相覆盖
// address 为十进制寄存器地址（0x3401 附件2 地址列即十进制：331 就是 331，不是 0x331），
// 下发时经 overrides.registerAddress 传给 buildIemsCommandFrame，由 normalizeRegisterAddress
// 统一按十进制规整后再写成 4 字节大端（331 → 00 00 01 4B）。地址里不要写 0x 或 A~F 字母。
// 字段/地址/缩放依据协议：(0x1707)PCS模块协议 V3.5、(0x170C)储能DC设备协议 V1.1、(0x171C)BMS设备协议 V2.0

// 危险操作关键词（命中即在下发前弹二次确认）
const DANGEROUS_LABEL_PATTERN = /执行|强控|故障复位|停机|重启|切断|下电/

/**
 * 危险选项判定
 * 否定式标签（「不执行」「不强控」）本身不含危险语义，必须先排除，
 * 否则会被 /执行/ 命中而误弹二次确认、误标红。
 */
function _isDangerousLabel(label) {
  const txt = String(label == null ? '' : label)
  if (/^不/.test(txt)) return false
  return DANGEROUS_LABEL_PATTERN.test(txt)
}

function _mkOpts(pairs) {
  return pairs.map(([label, value]) => ({
    label,
    value: String(value),
    dangerous: _isDangerousLabel(label)
  }))
}

function _mkParam(def, deviceType) {
  const options = def.options || null
  const param = {
    key: def.key,
    // field 有两个用途：
    //   1) 下发兜底 —— 没有 address 时用 B{n} 反推寄存器号；
    //   2) 回显 —— 帧解析出的键名（171F 控制帧是 B0/B4/B12…，带 C_ 前缀存储）。
    // 显式给了 field 就用 field，否则退回 address（旧行为，保证 331 这类地址仍可兜底）。
    field: def.field !== undefined ? def.field : def.address,
    label: def.label,
    unit: def.unit || '',
    deviceType,
    address: def.address,
    bit: def.bit !== undefined ? def.bit : null,
    // 补充说明（0x3401 命令块第 22 字节）：1=线圈 2=离散 3=保持 4=输入
    regType: def.regType !== undefined ? def.regType : 3,
    scale: def.scale,
    // 编码偏移：点表写「传输值=((实际值+40)*10)」时 offset=-40，
    // 即 工程值 = 原始值 / scale + offset，下发 原始值 = (工程值 - offset) * scale。
    // 温度类阈值全部走这条（-40℃ 偏移），不处理会把 41℃ 发成 410 而不是 810。
    offset: def.offset || 0,
    decimals: def.decimals !== undefined ? def.decimals : (def.scale === 1000 ? 3 : def.scale === 100 ? 2 : def.scale === 10 ? 1 : 0),
    options,
    // 位命令：帧上报单比特 0/1，选项值用 0x00000000/0x00010000 表示（同步显示时按 bitHex 归一化）
    bitHex: !!def.bitHex,
    // 脉冲型命令（故障复位/启动/停机等）：值只在动作瞬间有效，下发后本地回落到 0=不执行，
    // 否则会一直显示「执行」且无法重复下发（守卫逻辑会判定「当前已是 执行」而拦掉）
    pulse: !!def.pulse,
    // 回显时协议层已经做过 scale/offset（如 171F 控制帧 B8 已按 10 缩放、B16 已按 100 缩放），
    // 面板不能再除一次，否则 5.0kW 会显示成 0.5kW。
    protoScaled: !!def.protoScaled,
    dangerous: !!options && options.some(o => o.dangerous)
  }
  // 取值范围（工程值，点表「数据范围[a,b]」）：
  // 只有点表明确给出范围时才写入 key —— 小程序 setData 会把 undefined 序列化成 null，
  // 若这里写成 min: def.min（undefined），视图层就会渲染出「范围: null~nullV」。
  if (def.min !== undefined && def.min !== null) param.min = def.min
  if (def.max !== undefined && def.max !== null) param.max = def.max
  return param
}

// ---- PCS 1707_V3_5（deviceType '1707'，addr=01） ----
// 9 个位命令在 ENERGY 帧（B0b0~B0b7、B1b0），下发地址 331~339，各占 1 字节
// STATE 帧设定值下发地址 = 340 + B号（B0→340 … B46→386）
//
// ⚠️ 331~339 在 0x3401 附件2 标注为「寄存器：1」（线圈），数据类型是无符号 int16、范围 [0,1]：
//    值必须写 1，不能写 0x00010000 —— 后者低 16 位是 0，设备读到的就是 0，表现即「点了执行没反应」。
const PCS1707_SWITCH_PARAMS = [
  ...[
    { key: 'B0b0', label: '故障复位', address: '331' },
    { key: 'B0b1', label: '设备启动', address: '332' },
    { key: 'B0b2', label: '设备停机', address: '333' },
    { key: 'B0b3', label: '远程急停', address: '334' },
    { key: 'B0b4', label: '累计充电电量清零', address: '335' },
    { key: 'B0b5', label: '累计放电电量清零', address: '336' },
    { key: 'B0b6', label: '远程就地设置', address: '337' },
    { key: 'B0b7', label: '设备待机', address: '338' },
    { key: 'B1b0', label: '外部电操开关', address: '339' }
  ].map(d => ({ ...d, regType: 1, pulse: true, options: _mkOpts([['不执行', 0], ['执行', 1]]) })),
  // 模式选项（STATE 帧，S_ 前缀）
  { key: 'S_B0', label: '运行模式选择', address: '340', options: _mkOpts([['无', 0], ['恒流充电', 1], ['恒压充电', 2], ['恒功率充电', 3], ['直流恒压模式', 4]]) },
  { key: 'S_B10', label: '并离网设置', address: '350', options: _mkOpts([['并网', 0], ['离网', 1]]) },
  { key: 'S_B46', label: '并离网开关运行模式', address: '386', options: _mkOpts([['无', 0], ['手动', 1], ['自动', 2], ['混合', 3], ['静默', 4]]) }
].map(d => _mkParam(d, '1707'))

// 数值设定（STATE 帧，S_ 前缀）；scale=10/100 表示下发值 = 页面值 × scale
const PCS1707_NUMERIC_PARAMS = [
  { key: 'S_B2', label: '恒压充电电压设定值', unit: 'V', address: '342' },
  { key: 'S_B4', label: '恒流充电电流设定值', unit: 'A', address: '344' },
  { key: 'S_B6', label: '恒功率有功功率期望', unit: 'kW', address: '346', scale: 10 },
  { key: 'S_B8', label: '恒功率无功功率期望', unit: 'kVar', address: '348', scale: 10 },
  { key: 'S_B12', label: '离网输出电压给定', unit: 'V', address: '352' },
  { key: 'S_B14', label: '离网输出频率给定', unit: 'Hz', address: '354', scale: 100 },
  { key: 'S_B16', label: '分相控制A相有功功率', unit: 'kW', address: '356', scale: 10 },
  { key: 'S_B18', label: '分相控制B相有功功率', unit: 'kW', address: '358', scale: 10 },
  { key: 'S_B20', label: '分相控制C相有功功率', unit: 'kW', address: '360', scale: 10 },
  { key: 'S_B22', label: '分相控制A相无功功率', unit: 'kVar', address: '362', scale: 10 },
  { key: 'S_B24', label: '分相控制B相无功功率', unit: 'kVar', address: '364', scale: 10 },
  { key: 'S_B26', label: '分相控制C相无功功率', unit: 'kVar', address: '366', scale: 10 },
  { key: 'S_B28', label: '离网输出电压分相给定A', unit: 'V', address: '368' },
  { key: 'S_B30', label: '离网输出电压分相给定B', unit: 'V', address: '370' },
  { key: 'S_B32', label: '离网输出电压分相给定C', unit: 'V', address: '372' },
  { key: 'S_B34', label: '微网直流电压下垂系数', unit: 'V', address: '374' },
  { key: 'S_B36', label: '一次调频频率死区', unit: 'Hz', address: '376', scale: 100 },
  { key: 'S_B38', label: '一次调频K值', unit: '', address: '378' },
  { key: 'S_B40', label: 'VSG频率下垂系数', unit: '', address: '380' },
  { key: 'S_B44', label: 'VSG电压下垂系数', unit: '', address: '384' },
  { key: 'S_B50', label: '电池超容允许充电电压', unit: 'V', address: '388' },
  { key: 'S_B52', label: '电池超容允许放电电压', unit: 'V', address: '390' },
  { key: 'S_B54', label: '电池超容允许充电电流', unit: 'A', address: '392' },
  { key: 'S_B56', label: '电池超容允许放电电流', unit: 'A', address: '394' }
].map(d => _mkParam(d, '1707'))
// ---- 储能DC / 光伏DC 170C_V1_1（deviceType '170C_STORAGE' / '170C_PV'，addr=1E / 06） ----
// 数值项在 ENERGY 帧（原键 B0~B28），点表要求全部 ×10 下发；模式项在 STATE 帧（S_ 前缀）
// 启动指令：0=待机（设备空闲态）1=启动 2=停机 3=复位。
// 此前缺「待机」一项，导致待机态在页面上无处可显示、也无法主动切回，与参考页面不一致。
const DC170C_SWITCH_DEFS = [
  { key: 'S_B0', label: '启动指令', address: '362', options: _mkOpts([['待机', 0], ['启动', 1], ['停机', 2], ['复位', 3]]) },
  { key: 'S_B2', label: '模块功能选择', address: '337', options: _mkOpts([['MPPT 模块', 0], ['双向 DC/DC 模块', 1]]) },
  { key: 'S_B4', label: '工作模式选择', address: '338', options: _mkOpts([['BUS 侧恒压', 1], ['BUS 侧恒流', 2], ['BAT 侧恒压', 3], ['BAT 侧恒流', 4], ['BAT 侧恒功率', 5]]) },
  { key: 'S_B6', label: '模块并联均流', address: '339', options: _mkOpts([['无均流', 0], ['均流方式 1', 1], ['均流方式 2', 2], ['均流方式 3', 3]]) }
]
const DC170C_NUMERIC_DEFS = [
  { key: 'B0', label: 'BAT侧电压给定', unit: 'V', address: '331', scale: 10 },
  { key: 'B2', label: '最大充电电流限制', unit: 'A', address: '332', scale: 10 },
  { key: 'B4', label: '最大放电电流限制', unit: 'A', address: '333', scale: 10 },
  { key: 'B6', label: 'BUS侧电压给定', unit: 'V', address: '334', scale: 10 },
  { key: 'B8', label: 'BUS侧电流给定', unit: 'A', address: '335', scale: 10 },
  { key: 'B10', label: '下垂电压系数', unit: 'V', address: '336', scale: 10 },
  { key: 'B12', label: '最大功率限制', unit: 'kW', address: '340', scale: 10 },
  { key: 'B14', label: 'BAT侧欠压保护点', unit: 'V', address: '341', scale: 10 },
  { key: 'B16', label: 'BAT侧过压保护点', unit: 'V', address: '342', scale: 10 },
  { key: 'B18', label: 'BUS侧欠压保护点', unit: 'V', address: '343', scale: 10 },
  { key: 'B20', label: 'BUS侧过压保护点', unit: 'V', address: '344', scale: 10 },
  { key: 'B22', label: 'BAT侧充电过流保护点', unit: 'A', address: '345', scale: 10 },
  { key: 'B24', label: 'BAT侧放电过流保护点', unit: 'A', address: '346', scale: 10 },
  { key: 'B26', label: 'BUS侧充电过流保护点', unit: 'A', address: '347', scale: 10 },
  { key: 'B28', label: 'BUS侧放电过流保护点', unit: 'A', address: '348', scale: 10 }
]

// 储能 170C_V1_1（deviceType '170C_STORAGE'）
const STORAGE_170C_SWITCH_PARAMS = DC170C_SWITCH_DEFS.map(d => _mkParam(d, '170C_STORAGE'))
const STORAGE_170C_NUMERIC_PARAMS = DC170C_NUMERIC_DEFS.map(d => _mkParam(d, '170C_STORAGE'))
// 光伏 170C_V1_1（deviceType '170C_PV'）
const PV_170C_SWITCH_PARAMS = DC170C_SWITCH_DEFS.map(d => _mkParam(d, '170C_PV'))
const PV_170C_NUMERIC_PARAMS = DC170C_NUMERIC_DEFS.map(d => _mkParam(d, '170C_PV'))

// ---- BMS 171C（deviceType '171C_V2'），控制项取自 0x3401 附件2「BMS1(0x171C)」 ----
// 参考产品页「BMS 参数设置」的分组：DO 控制 / 绝缘采集控制 / 复位指令 / 关机指令 / 主控均衡控制。
// 附件2 中这些是**独立字节地址**（101/106/108/109/111），不做同地址位打包；
// 早前误用 1077~1099 的「上高压请求/强控 HSS」一组，与产品页对不上，已移除。
// key 用 SW_ 前缀：若沿用 B{地址} 形式，同步回显时会去匹配能源帧同名 B 键（B101/B106 等）而串值。
const BMS171C_SWITCH_PARAMS = [
  { key: 'SW_DO', label: 'DO 控制', address: '101', options: _mkOpts([['断开', 0], ['闭合', 1]]) },
  { key: 'SW_INS', label: '绝缘采集控制', address: '106', options: _mkOpts([['开启', 1], ['关闭', 0], ['无效值', 2]]) },
  { key: 'SW_RESET', label: '复位指令', address: '108', options: _mkOpts([['默认状态', 0], ['复位准备', 1]]) },
  { key: 'SW_STOP', label: '关机指令', address: '109', options: _mkOpts([['默认状态', 0], ['关机', 1]]) },
  { key: 'SW_BALANCE', label: '主控均衡控制', address: '111', options: _mkOpts([['关闭均衡', 0], ['开启均衡', 1], ['主控自主', 2]]) }
].map(d => _mkParam(d, '171C_V2'))

// 告警阈值：附件2 地址 1~76，每 4 个一组（1/2/3 级报警阈值 + 报警回差值）。
// 系数来自点表「传输值」：×10 为 0.1V/0.1A/0.1℃ 类，×1000 为单体电压（0.001V）；
// 温度类统一是 传输值=((实际值+40)*10) → offset=-40，工程值 = 原始值/10 - 40。
// key 用 TH{地址}，避免与能源帧的 B 键（B24~B27 温度等）撞名。
const BMS171C_THRESHOLD_PARAMS = [
  { key: 'TH1', label: '组端过压 1 级报警阈值', unit: 'V', address: '1', scale: 10, min: 0, max: 1000 },
  { key: 'TH2', label: '组端过压 2 级报警阈值', unit: 'V', address: '2', scale: 10, min: 0, max: 1000 },
  { key: 'TH3', label: '组端过压 3 级报警阈值', unit: 'V', address: '3', scale: 10, min: 0, max: 1000 },
  { key: 'TH4', label: '组端过压报警回差值', unit: 'V', address: '4', scale: 10, min: 0, max: 25 },
  { key: 'TH5', label: '组端欠压 1 级报警阈值', unit: 'V', address: '5', scale: 10, min: 0, max: 1000 },
  { key: 'TH6', label: '组端欠压 2 级报警阈值', unit: 'V', address: '6', scale: 10, min: 0, max: 1000 },
  { key: 'TH7', label: '组端欠压 3 级报警阈值', unit: 'V', address: '7', scale: 10, min: 0, max: 1000 },
  { key: 'TH8', label: '组端欠压报警回差值', unit: 'V', address: '8', scale: 10, min: 0, max: 25 },
  { key: 'TH9', label: '组端放电过流 1 级报警阈值', unit: 'A', address: '9', scale: 10, min: 0, max: 1000 },
  { key: 'TH10', label: '组端放电过流 2 级报警阈值', unit: 'A', address: '10', scale: 10, min: 0, max: 1000 },
  { key: 'TH11', label: '组端放电过流 3 级报警阈值', unit: 'A', address: '11', scale: 10, min: 0, max: 1000 },
  { key: 'TH12', label: '组端放电过流报警回差值', unit: 'A', address: '12', scale: 10, min: 0, max: 25 },
  { key: 'TH13', label: '组端充电过流 1 级报警阈值', unit: 'A', address: '13', scale: 10, min: 0, max: 1000 },
  { key: 'TH14', label: '组端充电过流 2 级报警阈值', unit: 'A', address: '14', scale: 10, min: 0, max: 1000 },
  { key: 'TH15', label: '组端充电过流 3 级报警阈值', unit: 'A', address: '15', scale: 10, min: 0, max: 1000 },
  { key: 'TH16', label: '组端充电过流报警回差值', unit: 'A', address: '16', scale: 10, min: 0, max: 25 },
  { key: 'TH17', label: '组端绝缘 1 级报警阈值', unit: 'kΩ', address: '17', min: 0, max: 60000 },
  { key: 'TH18', label: '组端绝缘 2 级报警阈值', unit: 'kΩ', address: '18', min: 0, max: 60000 },
  { key: 'TH19', label: '组端绝缘 3 级报警阈值', unit: 'kΩ', address: '19', min: 0, max: 60000 },
  { key: 'TH20', label: '组端绝缘报警回差值', unit: 'kΩ', address: '20', min: 0, max: 255 },
  { key: 'TH21', label: '单体充电过温 1 级报警阈值', unit: '℃', address: '21', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH22', label: '单体充电过温 2 级报警阈值', unit: '℃', address: '22', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH23', label: '单体充电过温 3 级报警阈值', unit: '℃', address: '23', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH24', label: '电池充电过温报警回差值', unit: '℃', address: '24', scale: 10, min: 0, max: 100 },
  { key: 'TH25', label: '单体充电欠温 1 级报警阈值', unit: '℃', address: '25', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH26', label: '单体充电欠温 2 级报警阈值', unit: '℃', address: '26', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH27', label: '单体充电欠温 3 级报警阈值', unit: '℃', address: '27', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH28', label: '电池充电欠温报警回差值', unit: '℃', address: '28', scale: 10, min: 0, max: 100 },
  { key: 'TH29', label: '单体电压过压 1 级报警阈值', unit: 'V', address: '29', scale: 1000, decimals: 3, min: 0, max: 4.5 },
  { key: 'TH30', label: '单体电压过压 2 级报警阈值', unit: 'V', address: '30', scale: 1000, decimals: 3, min: 0, max: 4.5 },
  { key: 'TH31', label: '单体电压过压 3 级报警阈值', unit: 'V', address: '31', scale: 1000, decimals: 3, min: 0, max: 4.5 },
  { key: 'TH32', label: '单体电压过压报警回差值', unit: 'V', address: '32', scale: 1000, decimals: 3, min: 0, max: 0.25 },
  { key: 'TH33', label: '单体电压欠压 1 级报警阈值', unit: 'V', address: '33', scale: 1000, decimals: 3, min: 0, max: 4.5 },
  { key: 'TH34', label: '单体电压欠压 2 级报警阈值', unit: 'V', address: '34', scale: 1000, decimals: 3, min: 0, max: 4.5 },
  { key: 'TH35', label: '单体电压欠压 3 级报警阈值', unit: 'V', address: '35', scale: 1000, decimals: 3, min: 0, max: 4.5 },
  { key: 'TH36', label: '单体电压欠压报警回差值', unit: 'V', address: '36', scale: 1000, decimals: 3, min: 0, max: 0.25 },
  { key: 'TH37', label: '单体电压差压 1 级报警阈值', unit: 'V', address: '37', scale: 1000, decimals: 3, min: 0, max: 4.5 },
  { key: 'TH38', label: '单体电压差压 2 级报警阈值', unit: 'V', address: '38', scale: 1000, decimals: 3, min: 0, max: 4.5 },
  { key: 'TH39', label: '单体电压差压 3 级报警阈值', unit: 'V', address: '39', scale: 1000, decimals: 3, min: 0, max: 4.5 },
  { key: 'TH40', label: '单体电压差压报警回差值', unit: 'V', address: '40', scale: 1000, decimals: 3, min: 0, max: 0.25 },
  { key: 'TH41', label: '单体温度温差 1 级报警阈值', unit: '℃', address: '41', scale: 10, min: 0, max: 100 },
  { key: 'TH42', label: '单体温度温差 2 级报警阈值', unit: '℃', address: '42', scale: 10, min: 0, max: 100 },
  { key: 'TH43', label: '单体温度温差 3 级报警阈值', unit: '℃', address: '43', scale: 10, min: 0, max: 100 },
  { key: 'TH44', label: '单体温度温差报警回差值', unit: '℃', address: '44', scale: 10, min: 0, max: 10 },
  { key: 'TH45', label: 'SOC 过低 1 级报警阈值', unit: '%', address: '45', min: 0, max: 100 },
  { key: 'TH46', label: 'SOC 过低 2 级报警阈值', unit: '%', address: '46', min: 0, max: 100 },
  { key: 'TH47', label: 'SOC 过低 3 级报警阈值', unit: '%', address: '47', min: 0, max: 100 },
  { key: 'TH48', label: 'SOC 过低报警回差值', unit: '%', address: '48', min: 0, max: 100 },
  { key: 'TH49', label: '动力插箱温度过高 1 级报警阈值', unit: '℃', address: '49', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH50', label: '动力插箱温度过高 2 级报警阈值', unit: '℃', address: '50', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH51', label: '动力插箱温度过高 3 级报警阈值', unit: '℃', address: '51', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH52', label: '动力插箱温度过高报警回差值', unit: '℃', address: '52', scale: 10, min: 0, max: 25 },
  { key: 'TH53', label: '电池模组过压 1 级报警阈值', unit: 'V', address: '53', scale: 10, min: 0, max: 1000 },
  { key: 'TH54', label: '电池模组过压 2 级报警阈值', unit: 'V', address: '54', scale: 10, min: 0, max: 1000 },
  { key: 'TH55', label: '电池模组过压 3 级报警阈值', unit: 'V', address: '55', scale: 10, min: 0, max: 1000 },
  { key: 'TH56', label: '电池模组过压报警回差值', unit: 'V', address: '56', scale: 10, min: 0, max: 25 },
  { key: 'TH57', label: '电池模组欠压 1 级报警阈值', unit: 'V', address: '57', scale: 10, min: 0, max: 1000 },
  { key: 'TH58', label: '电池模组欠压 2 级报警阈值', unit: 'V', address: '58', scale: 10, min: 0, max: 1000 },
  { key: 'TH59', label: '电池模组欠压 3 级报警阈值', unit: 'V', address: '59', scale: 10, min: 0, max: 1000 },
  { key: 'TH60', label: '电池模组欠压报警回差值', unit: 'V', address: '60', scale: 10, min: 0, max: 25 },
  { key: 'TH61', label: '单体放电过温 1 级报警阈值', unit: '℃', address: '61', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH62', label: '单体放电过温 2 级报警阈值', unit: '℃', address: '62', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH63', label: '单体放电过温 3 级报警阈值', unit: '℃', address: '63', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH64', label: '电池放电过温报警回差值', unit: '℃', address: '64', scale: 10, min: 0, max: 100 },
  { key: 'TH65', label: '单体放电欠温 1 级报警阈值', unit: '℃', address: '65', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH66', label: '单体放电欠温 2 级报警阈值', unit: '℃', address: '66', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH67', label: '单体放电欠温 3 级报警阈值', unit: '℃', address: '67', scale: 10, offset: -40, min: -40, max: 120 },
  { key: 'TH68', label: '电池放电欠温报警回差值', unit: '℃', address: '68', scale: 10, min: 0, max: 100 },
  { key: 'TH69', label: 'SOC 过高 1 级报警阈值', unit: '%', address: '69', min: 0, max: 100 },
  { key: 'TH70', label: 'SOC 过高 2 级报警阈值', unit: '%', address: '70', min: 0, max: 100 },
  { key: 'TH71', label: 'SOC 过高 3 级报警阈值', unit: '%', address: '71', min: 0, max: 100 },
  { key: 'TH72', label: 'SOC 过高报警回差值', unit: '%', address: '72', min: 0, max: 100 },
  { key: 'TH73', label: '温升快 1 级报警阈值', unit: '℃/min', address: '73', min: 0, max: 100 },
  { key: 'TH74', label: '温升快 2 级报警阈值', unit: '℃/min', address: '74', min: 0, max: 100 },
  { key: 'TH75', label: '温升快 3 级报警阈值', unit: '℃/min', address: '75', min: 0, max: 100 },
  { key: 'TH76', label: '温升快报警回差值', unit: '℃/min', address: '76', min: 0, max: 100 },
].map(d => _mkParam(d, '171C_V2'))

// TMS 温控参数（地址 331~371），与参考页的分段一致，排在阈值之后
const BMS171C_TMS_PARAMS = [
  { key: 'C_B0', label: '心跳', unit: '', address: '331' },
  { key: 'C_B12', label: 'TMS开关机故障复位', unit: '', address: '343' },
  { key: 'C_B14', label: 'TMS模式设置', unit: '', address: '345' },
  { key: 'C_B16', label: '制冷设定点', unit: '℃', address: '347' },
  { key: 'C_B18', label: '制冷回差', unit: '℃', address: '349', scale: 10 },
  { key: 'C_B20', label: '制热设定点', unit: '℃', address: '351' },
  { key: 'C_B22', label: '制热回差', unit: '℃', address: '353', scale: 10 },
  { key: 'C_B24', label: '制冷目标参数设置', unit: '℃', address: '355' },
  { key: 'C_B26', label: '制热目标参数设置', unit: '℃', address: '357' },
  { key: 'C_B30', label: '控温开启值', unit: '℃', address: '361' },
  { key: 'C_B32', label: '控温关闭值', unit: '℃', address: '363' },
  { key: 'C_B34', label: '控湿度开启值', unit: '%', address: '365', scale: 10 },
  { key: 'C_B36', label: '控湿度关闭值', unit: '%', address: '367', scale: 10 },
  { key: 'C_B38', label: '温度报警上限值', unit: '℃', address: '369' },
  { key: 'C_B40', label: '温度报警下限值', unit: '℃', address: '371' }
].map(d => _mkParam(d, '171C_V2'))

// 数值项打 group 标签：设置面板按 group 拆成「告警阈值 / 温控参数」两张卡，
// 否则 91 项平铺要滑十几屏才能找到目标参数。
const BMS171C_NUMERIC_PARAMS = [
  ...BMS171C_THRESHOLD_PARAMS.map(p => ({ ...p, group: 'threshold' })),
  ...BMS171C_TMS_PARAMS.map(p => ({ ...p, group: 'tms' }))
]

// ---- 液冷机 0318_V2_3（deviceType '0318'），地址取自 0x3401 附件2「液冷(0x0318)」 ----
// 附件2 中该机型控制项地址为 331、333、335 … 367（步长 2），与帧内 B 号的关系是「地址 = 331 + B号」。
// 此前直接拿字序号 0/1/2/3… 下发，等于把指令写到了 0 号地址上，所以液冷机一直没反应。
const LIQUID_SWITCH_PARAMS = [
  { key: 'B0', label: '启动模式', address: '331', options: _mkOpts([['手动', 0], ['自动', 1]]) },
  { key: 'B2', label: '工作模式', address: '333', options: _mkOpts([['待机', 0], ['制冷', 1], ['加热', 2], ['自循环', 3], ['自动', 4]]) },
  { key: 'B4', label: '供回水控制目标', address: '335', options: _mkOpts([['供水', 0], ['回水', 1]]) },
  // 开关机命令是「瞬时命令」：0318 能源数据的 B0 是启动模式、B36 是机组运行状态，都不能拿来当回显，
  // 这里用独立的 key，避免设置页把「自动/制冷」误显示成「开机」
  { key: 'C_ONOFF', label: '开关机命令', address: '367', options: _mkOpts([['开机', 1], ['关机', 2], ['报警复位', 4]]) },
  { key: 'B34', label: '波特率', address: '365', options: _mkOpts([['9600', 0], ['4800', 1], ['19200', 2]]) }
].map(d => _mkParam(d, '0318'))

const LIQUID_NUMERIC_PARAMS = [
  { key: 'B6', label: '制冷预设温度', unit: '℃', address: '337' },
  { key: 'B8', label: '制冷回差', unit: '℃', address: '339' },
  { key: 'B10', label: '制热预设温度', unit: '℃', address: '341' },
  { key: 'B12', label: '制热回差', unit: '℃', address: '343' },
  { key: 'B14', label: '控温时泵转速', unit: '%', address: '345' },
  { key: 'B16', label: '自循环泵转速', unit: '%', address: '347' },
  { key: 'B18', label: '液温过高点', unit: '℃', address: '349' },
  { key: 'B20', label: '液温过低点', unit: '℃', address: '351' },
  { key: 'B22', label: '回水压力过低点', unit: 'bar', address: '353', scale: 10 },
  { key: 'B24', label: '供水压力过高点', unit: 'bar', address: '355', scale: 10 },
  { key: 'B26', label: '供水压力预警点', unit: 'bar', address: '357', scale: 10 },
  { key: 'B28', label: '供水压力预警回差', unit: 'bar', address: '359', scale: 10 },
  { key: 'B32', label: '485通讯地址', unit: '', address: '363' }
].map(d => _mkParam(d, '0318'))

// ---- 快捷控制 171F（EMS），地址取自 0x3401 附件2「EMS(0x171F)」 ----
// 下发地址与回显字段是两套东西，必须同时给：
//   address → 0x3401 远程控制的字节地址（100/102/108/110/112/114/118/122）
//   field   → 0x171F 页面显示协议「0x04 控制数据」的字节偏移（B0/B2/B4/B6/B12/B14/B18/B22），
//             设备回传的控制帧按 C_B{n} 存入 rawValues['171F']，回显只能靠它匹配。
// 只写 address 会导致「发得出去、界面永远是灰的」（上次就是这个原因）。
const QUICK_CONTROL_PARAMS_50KW = [
  // 储能DC开关机（0 不启用 / 1 一键开机 / 2 关机）↔ 171F B4
  { key: 'qc_storage_dc', label: '储能DC开关机', address: '100', field: 'B4', options: _mkOpts([['不启用', 0], ['并网一键开机', 1], ['一键关机', 2]]) },
  // 光伏DC开机（0 不启用 / 1 开机 / 2 关机）↔ 171F B2
  { key: 'qc_pv_dc', label: '光伏DC开机', address: '110', field: 'B2', options: _mkOpts([['不启用', 0], ['开机', 1], ['关机', 2]]) },
  // 储能充放电选择（0 不充不放 / 1 充电 / 2 放电 / 3 离网）↔ 171F B6
  { key: 'qc_pcs_mode', label: '储能充放电选择', address: '102', field: 'B6', options: _mkOpts([['不充不放', 0], ['充电', 1], ['放电', 2], ['离网', 3]]) },
  // PCS开关机（0 否 / 1 开机 / 2 关机）↔ 171F B0「PCS一键开机」
  { key: 'qc_pcs_action', label: 'PCS开关机', address: '108', field: 'B0', options: _mkOpts([['不启用', 0], ['开机', 1], ['关机', 2]]) },
  // 运行策略总开关（0 默认 / 1 开启）↔ 171F B12
  { key: 'qc_start_btn', label: '启动按钮', address: '112', field: 'B12', options: _mkOpts([['默认', 0], ['开启', 1]]) },
  // 运行策略（114）：0 峰谷 / 3 自发自用 / 4 电池优先 / 5 削峰填谷 / 6 售卖优先 / 7 限制消费 / 8 零出口 / 9 1113+防逆流
  // 1 恒限功率、2 柔度、10 AI 调度在点表里标注「不使用」，按下发兼容仍保留选项 ↔ 171F B14
  {
    key: 'qc_run_strategy', label: '运行策略', address: '114', field: 'B14',
    options: _mkOpts([
      ['峰谷', 0], ['恒限功率', 1], ['柔度', 2], ['自发自用', 3], ['电池优先', 4],
      ['削峰填谷', 5], ['售卖优先', 6], ['限制消费', 7], ['零出口', 8], ['1113+防逆流', 9], ['AI调度', 10]
    ])
  },
  // 售卖优先：是否卖储能电（0 不出售 / 1 出售）↔ 171F B18
  { key: 'qc_sell_storage', label: '售卖优先-出售储能电', address: '118', field: 'B18', options: _mkOpts([['不出售', 0], ['出售', 1]]) },
  // 启动防逆流（1 启动 / 其他 不启动）↔ 171F B22
  { key: 'qc_anti_backflow', label: '启动防逆流', address: '122', field: 'B22', options: _mkOpts([['不启动', 0], ['启动', 1]]) }
].map(d => _mkParam(d, '171F'))

// 数值设定：充电功率(104)/放电功率(106)（真实值 0~10kW，下发 = 实际值×10）
// + 限制消费策略 PCS 功率(120，×10)。
// 回显注意：171F 控制帧只有「充放电总功率」一项（B8，协议层已 /10），
// 没有独立的充电/放电功率，所以 104 用 B8 回显总功率，106 无对应回显字段（设备不上报）。
const QUICK_POWER_PARAMS_50KW = [
  { key: 'qc_charge_power', label: '充电功率', unit: 'kW', address: '104', field: 'B8', scale: 10, protoScaled: true, min: 0, max: 10 },
  { key: 'qc_discharge_power', label: '放电功率', unit: 'kW', address: '106', scale: 10, min: 0, max: 10 },
  { key: 'qc_limit_power', label: '限制消费-PCS设定功率', unit: 'kW', address: '120', field: 'B20', scale: 10, min: 0, max: 50 }
].map(d => _mkParam(d, '171F'))

// 50kW 设置面板配置（与 SETTINGS_PANELS 格式一致，deviceType 与 factory 产出的 param.deviceType 对齐）
const SETTINGS_PANELS_50KW = [
  { dataKey: 'pcsSwitchParams', source: PCS1707_SWITCH_PARAMS, deviceType: '1707', editKey: 'isEditingPcs' },
  { dataKey: 'pcsNumericParams', source: PCS1707_NUMERIC_PARAMS, deviceType: '1707', editKey: 'isEditingPcs' },
  { dataKey: 'storageSwitchParams', source: STORAGE_170C_SWITCH_PARAMS, deviceType: '170C_STORAGE', editKey: 'isEditingStorage' },
  { dataKey: 'storageNumericParams', source: STORAGE_170C_NUMERIC_PARAMS, deviceType: '170C_STORAGE', editKey: 'isEditingStorage' },
  { dataKey: 'pvSwitchParams', source: PV_170C_SWITCH_PARAMS, deviceType: '170C_PV', editKey: 'isEditingPv' },
  { dataKey: 'pvNumericParams', source: PV_170C_NUMERIC_PARAMS, deviceType: '170C_PV', editKey: 'isEditingPv' },
  { dataKey: 'bmsSwitchParams', source: BMS171C_SWITCH_PARAMS, deviceType: '171C_V2', editKey: 'isEditingBms' },
  { dataKey: 'bmsNumericParams', source: BMS171C_NUMERIC_PARAMS, deviceType: '171C_V2', editKey: 'isEditingBms' },
  { dataKey: 'liquidSwitchParams', source: LIQUID_SWITCH_PARAMS, deviceType: '0318', editKey: 'isEditingLiquid' },
  { dataKey: 'liquidNumericParams', source: LIQUID_NUMERIC_PARAMS, deviceType: '0318', editKey: 'isEditingLiquid' },
  { dataKey: 'quickControlParams', source: QUICK_CONTROL_PARAMS_50KW, deviceType: '171F', editKey: 'isEditingQuickControl' },
  { dataKey: 'quickPowerParams', source: QUICK_POWER_PARAMS_50KW, deviceType: '171F', editKey: 'isEditingQuickControl' }
]

// 设置标签页配置（模板 v-for 驱动）
const SETTINGS_TABS = [
  { tab: 5, short: 'PCS 设置', dataKey: 'pcsSwitchParams', numericKey: 'pcsNumericParams', title: 'PCS 设置 (171B)', theme: 'pcs-theme', editKey: 'isEditingPcs', switchTitle: '开关控制', numericTitle: '数值参数' },
  { tab: 6, short: 'BMS 设置', dataKey: 'bmsPowerParams', numericKey: 'bmsNumericParams', title: 'BMS 设置 (171C)', theme: 'bms-theme', editKey: 'isEditingBms', switchTitle: '上下电 / 模式控制', numericTitle: '数值参数', extraSwitchKey: 'bmsSwitchParams', extraSwitchTitle: '开关控制' },
  { tab: 7, short: '光伏设置', dataKey: 'pvSwitchParams', numericKey: 'pvNumericParams', title: '光伏设置 (171E)', theme: 'pv-theme', editKey: 'isEditingPv', switchTitle: '开关控制', numericTitle: '数值参数' },
  { tab: 8, short: '储能设置', dataKey: 'storageSwitchParams', numericKey: 'storageNumericParams', title: '储能设置 (171D)', theme: 'storage-theme', editKey: 'isEditingStorage', switchTitle: '开关控制', numericTitle: '数值参数' },
  {
    tab: 9, short: '快捷控制', dataKey: 'quickControlParams', numericKey: 'quickPowerParams',
    title: '快捷控制 (171F)', theme: 'quick-theme', editKey: 'isEditingQuickControl',
    numericTitle: '功率设置', isQuick: true,
    switchSections: [
      { title: '储能DC一键控制', filterKey: 'qc_storage_dc' },
      { title: '光伏DC控制', filterKey: 'qc_pv_dc' },
      { title: 'PCS模式选择', filterKey: 'qc_pcs_mode' },
      { title: 'PCS开关机', filterKey: 'qc_pcs_action' }
    ]
  }
]
// 50kW 版设置标签页配置（tab 序号必须与 swiper 子项顺序一致：监测 0~10，设置 5 起）
// short 是标签栏专用短标题：tab 序号与 20kW 重号（5~9），只靠 TAB_TITLES 兜底会串台——
// 之前 tab 9 在 50kW 是「液冷机控制」，却显示成「快捷控制」，就是兜底表串了。
const SETTINGS_TABS_50KW = [
  { tab: 5, short: 'PCS', dataKey: 'pcsSwitchParams', numericKey: 'pcsNumericParams', title: 'PCS 参数设置 (1707)', theme: 'pcs-theme', editKey: 'isEditingPcs', switchTitle: '命令 / 模式', numericTitle: '数值设定' },
  { tab: 6, short: '储能DC', dataKey: 'storageSwitchParams', numericKey: 'storageNumericParams', title: '储能 DC/DC 参数设置 (170C)', theme: 'storage-theme', editKey: 'isEditingStorage', switchTitle: '命令 / 模式', numericTitle: '数值设定' },
  { tab: 7, short: '光伏DC', dataKey: 'pvSwitchParams', numericKey: 'pvNumericParams', title: '光伏 DC/DC 参数设置 (170C)', theme: 'pv-theme', editKey: 'isEditingPv', switchTitle: '命令 / 模式', numericTitle: '数值设定' },
  {
    tab: 8, short: 'BMS', dataKey: 'bmsSwitchParams', numericKey: 'bmsNumericParams',
    title: 'BMS 参数设置 (171C)', theme: 'bms-theme', editKey: 'isEditingBms',
    switchTitle: '命令 / 模式', numericTitle: '数值设定',
    // 91 项数值按用途拆两张卡：告警阈值（1~76）/ 温控参数（331~371）
    numericGroups: [
      { title: '告警阈值（地址 1~76）', tag: 'threshold' },
      { title: '温控参数（地址 331~371）', tag: 'tms' }
    ]
  },
  { tab: 9, short: '液冷', dataKey: 'liquidSwitchParams', numericKey: 'liquidNumericParams', title: '液冷机控制 (0318)', theme: 'liquid-theme', editKey: 'isEditingLiquid', switchTitle: '命令 / 模式', numericTitle: '数值设定' },
  {
    tab: 11, short: '快捷控制', dataKey: 'quickControlParams', numericKey: 'quickPowerParams',
    title: '快捷控制 (171F)', theme: 'quick-theme', editKey: 'isEditingQuickControl',
    numericTitle: '功率设定', isQuick: true,
    switchSections: [
      { title: '储能DC开关机', filterKey: 'qc_storage_dc' },
      { title: '光伏DC开机', filterKey: 'qc_pv_dc' },
      { title: '储能充放电选择', filterKey: 'qc_pcs_mode' },
      { title: 'PCS开关机', filterKey: 'qc_pcs_action' },
      { title: '启动按钮', filterKey: 'qc_start_btn' },
      { title: '运行策略', filterKey: 'qc_run_strategy' },
      { title: '策略开关', keys: ['qc_sell_storage', 'qc_anti_backflow'] }
    ]
  }
]

export {
  STORAGE_KEY,
  // 20kW / 50kW bucket key 数组（下标对应 tab index）
  DEVICE_TYPES,
  DEVICE_TYPES_50KW,
  // tab 标题索引 + 分组
  TAB_TITLES,
  TAB_GROUP_MONITOR,
  TAB_GROUP_MONITOR_50KW,
  TAB_GROUP_CONTROL,
  MONITOR_LAST_INDEX,
  MONITOR_LAST_INDEX_50KW,
  // 设备显示元数据
  GROUP_TITLE,
  DEVICE_GROUPS,
  DEVICE_NAME_MAP,
  // 位 / 枚举常量
  PCS_B64_BITS,
  PCS_B64_STATUS_MAP,
  PCS_MODE_MAP,
  PV_B56_BITS,
  DCDC_ALARM_FIELDS,
  BMS_ALARM_FIELDS,
  // 设置面板配置
  SETTINGS_PANELS,
  SETTINGS_TABS,
  SETTINGS_PANELS_50KW,
  SETTINGS_TABS_50KW,
  // 50kW 设置参数数据源（供 _mkParam 深克隆）
  PCS1707_SWITCH_PARAMS,
  PCS1707_NUMERIC_PARAMS,
  STORAGE_170C_SWITCH_PARAMS,
  STORAGE_170C_NUMERIC_PARAMS,
  PV_170C_SWITCH_PARAMS,
  PV_170C_NUMERIC_PARAMS,
  BMS171C_SWITCH_PARAMS,
  BMS171C_THRESHOLD_PARAMS,
  BMS171C_TMS_PARAMS,
  BMS171C_NUMERIC_PARAMS,
  LIQUID_SWITCH_PARAMS,
  LIQUID_NUMERIC_PARAMS,
  QUICK_CONTROL_PARAMS_50KW,
  QUICK_POWER_PARAMS_50KW
}
