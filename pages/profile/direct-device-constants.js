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

const TAB_LIST = ['概览', 'PCS', '储能DC', '光伏', 'BMS', 'PCS设置', 'BMS设置', '光伏设置', '储能设置', '快捷控制']
const TAB_GROUP_MONITOR = [0, 1, 2, 3, 4]
const TAB_GROUP_CONTROL = [5, 6, 7, 8, 9]
const MONITOR_LAST_INDEX = 4

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

// 设置标签页配置（模板 v-for 驱动）
const SETTINGS_TABS = [
  { tab: 5, dataKey: 'pcsSwitchParams', numericKey: 'pcsNumericParams', title: 'PCS 设置 (171B)', theme: 'pcs-theme', editKey: 'isEditingPcs', switchTitle: '开关控制', numericTitle: '数值参数' },
  { tab: 6, dataKey: 'bmsPowerParams', numericKey: 'bmsNumericParams', title: 'BMS 设置 (171C)', theme: 'bms-theme', editKey: 'isEditingBms', switchTitle: '上下电 / 模式控制', numericTitle: '数值参数', extraSwitchKey: 'bmsSwitchParams', extraSwitchTitle: '开关控制' },
  { tab: 7, dataKey: 'pvSwitchParams', numericKey: 'pvNumericParams', title: '光伏设置 (171E)', theme: 'pv-theme', editKey: 'isEditingPv', switchTitle: '开关控制', numericTitle: '数值参数' },
  { tab: 8, dataKey: 'storageSwitchParams', numericKey: 'storageNumericParams', title: '储能设置 (171D)', theme: 'storage-theme', editKey: 'isEditingStorage', switchTitle: '开关控制', numericTitle: '数值参数' },
  {
    tab: 9, dataKey: 'quickControlParams', numericKey: 'quickPowerParams',
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

export {
  STORAGE_KEY,
  DEVICE_TYPES,
  TAB_LIST,
  TAB_GROUP_MONITOR,
  TAB_GROUP_CONTROL,
  MONITOR_LAST_INDEX,
  GROUP_TITLE,
  DEVICE_GROUPS,
  DEVICE_NAME_MAP,
  PCS_B64_BITS,
  PCS_B64_STATUS_MAP,
  PCS_MODE_MAP,
  PV_B56_BITS,
  DCDC_ALARM_FIELDS,
  BMS_ALARM_FIELDS,
  SETTINGS_PANELS,
  SETTINGS_TABS
}
