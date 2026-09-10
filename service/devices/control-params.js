/**
 * 设备控制参数定义
 * 用于 BMS/PCS/PV/Storage/QuickControl 设置面板，支持 MQTT 直接控制
 *
 * 设备类型映射:
 *   BMS: 171C, PCS: 171B, PV: 171E, Storage: 171D, QuickControl: 171F
 *
 * 字段命名规则:
 *   - 主状态字段: 直接使用协议寄存器名如 B172, B186
 *   - 控制状态字段: 使用 ctl_ 前缀如 ctl_power, ctl_mode
 */

// ============ BMS (171C) 控制参数 ============
// 寄存器定义参考 community/settings/components/BmsSettings.vue

/** BMS 数值型参数 (参考 BmsSettings.vue CONTROL 帧寄存器) */
export const BMS_NUMERIC_PARAMS = [
  // BMS 参数非常多，这里只挑常用的阈值参数
  { key: 'bms_B96',  field: 'B96',  label: 'SOC过低1级报警阈值', unit: '%',   min: 0, max: 100, scale: 10, decimals: 1, deviceType: '171C' },
  { key: 'bms_B98',  field: 'B98',  label: 'SOC过低2级报警阈值', unit: '%',   min: 0, max: 100, scale: 10, decimals: 1, deviceType: '171C' },
  { key: 'bms_B24',  field: 'B24',  label: '组端充电过流1级',     unit: 'A',   min: 0, max: 1000, scale: 10, decimals: 1, deviceType: '171C' },
  { key: 'bms_B28',  field: 'B28',  label: '组端充电过流3级',     unit: 'A',   min: 0, max: 1000, scale: 10, decimals: 1, deviceType: '171C' },
  { key: 'bms_B16',  field: 'B16',  label: '组端放电过流1级',     unit: 'A',   min: 0, max: 1000, scale: 10, decimals: 1, deviceType: '171C' },
  { key: 'bms_B20',  field: 'B20',  label: '组端放电过流3级',     unit: 'A',   min: 0, max: 1000, scale: 10, decimals: 1, deviceType: '171C' },
  { key: 'bms_B56',  field: 'B56',  label: '单体过压1级',         unit: 'V',   min: 0, max: 4.5, scale: 1000, decimals: 3, deviceType: '171C' },
  { key: 'bms_B64',  field: 'B64',  label: '单体欠压1级',         unit: 'V',   min: 0, max: 4.5, scale: 1000, decimals: 3, deviceType: '171C' },
  { key: 'bms_B40',  field: 'B40',  label: '单体充电过温1级',     unit: '℃',   min: -40, max: 120, scale: 1, decimals: 0, deviceType: '171C' },
  { key: 'bms_B48',  field: 'B48',  label: '单体充电欠温1级',     unit: '℃',   min: -40, max: 120, scale: 1, decimals: 0, deviceType: '171C' }
]

/** BMS 开关型参数 (主状态字段，都是真实 B 寄存器) */
export const BMS_SWITCH_PARAMS = [
  { key: 'bms_B172', field: 'B172', label: 'DO控制', deviceType: '171C', options: [
    { label: '闭合', value: 1 }, { label: '断开', value: 0 }
  ]},
  { key: 'bms_B182', field: 'B182', label: '绝缘采集控制', deviceType: '171C', options: [
    { label: '开启', value: 1 }, { label: '关闭', value: 0 }, { label: '无效值', value: 2 }
  ]},
  { key: 'bms_B186', field: 'B186', label: '复归指令', deviceType: '171C', options: [
    { label: '默认状态', value: 0 }, { label: '复归准备', value: 1 }
  ]},
  { key: 'bms_B188', field: 'B188', label: '跳机指令', deviceType: '171C', options: [
    { label: '默认状态', value: 0 }, { label: '跳机', value: 1, dangerous: true }
  ]},
  { key: 'bms_B192', field: 'B192', label: '主控均衡控制', deviceType: '171C', options: [
    { label: '关闭均衡', value: 0 }, { label: '开启均衡', value: 1 }, { label: '主控自主', value: 2 }
  ]}
]

/** BMS 上下电/模式控制 */
export const BMS_POWER_PARAMS = [
  { key: 'bms_power', field: 'ctl_power', label: '上下电控制', deviceType: '171C', options: [
    { label: '上电', value: 0x5555, dangerous: true },
    { label: '下电', value: 0xAAAA, dangerous: true }
  ]},
  { key: 'bms_mode', field: 'ctl_mode', label: '控制指令模式', deviceType: '171C', options: [
    { label: '单簇系统', value: 1 }, { label: '并簇系统', value: 2 }, { label: '强控模式', value: 3 }
  ]}
]

// ============ PCS (171B) 控制参数 ============
// 寄存器定义严格匹配 service/protocols/171B.js 的 energyControlDataFields
// UINT32 字段加 width: 32，发送时 sendControl 自动拆 B{n}(高16位) + B{n+2}(低16位)

/** PCS 数值型参数 (171B CONTROL 帧，按 protocol_171B_000A.energyControlDataFields) */
export const PCS_NUMERIC_PARAMS = [
  // UINT32: width=32 → 自动拆高低寄存器
  { key: 'pcs_B0',   field: 'B0',   width: 32, label: '设置模块工作海拔值',      unit: 'm',  min: 1000, max: 5000,  scale: 1000, decimals: 0, deviceType: '171B' },
  { key: 'pcs_B36',  field: 'B36',  width: 32, label: '设置直流侧电压',            unit: 'V',  min: 0,    max: 500,   scale: 1000, decimals: 3, deviceType: '171B' },
  { key: 'pcs_B40',  field: 'B40',  width: 32, label: '设置直流侧电流',            unit: 'A',  min: -78,  max: 73.5,  scale: 1000, decimals: 3, deviceType: '171B' },
  { key: 'pcs_B44',  field: 'B44',  width: 16, label: '并网模式功率控制模式',      unit: '',   min: 0,    max: 2,     scale: 1,    decimals: 0, deviceType: '171B' },
  { key: 'pcs_B46',  field: 'B46',  width: 16, label: '交流侧总有功功率',          unit: 'kW', min: 0,    max: 22,    scale: 1,    decimals: 1, deviceType: '171B' },
  { key: 'pcs_B48',  field: 'B48',  width: 32, label: '交流侧总无功功率',          unit: 'kW', min: -22,  max: 22,    scale: 1,    decimals: 1, deviceType: '171B' },
  { key: 'pcs_B52',  field: 'B52',  width: 32, label: '交流侧功率因素 PF',         unit: '',   min: -1,   max: 1,     scale: 1000, decimals: 3, deviceType: '171B' },
  { key: 'pcs_B60',  field: 'B60',  width: 16, label: '交流相电压',                unit: 'V',  min: 200,  max: 240,   scale: 10,   decimals: 1, deviceType: '171B' },
  { key: 'pcs_B62',  field: 'B62',  width: 16, label: '交流频率',                  unit: 'Hz', min: 50,   max: 60,    scale: 10,   decimals: 1, deviceType: '171B' },
  { key: 'pcs_B68',  field: 'B68',  width: 32, group: '设置直流欠压保护', subLabel: '保护电压', label: '设置直流欠压保护电压', unit: 'V',  min: 145,  max: 500,   scale: 10,   decimals: 1, deviceType: '171B' },
  { key: 'pcs_B72',  field: 'B72',  width: 32, group: '设置直流过压保护', subLabel: '保护电压', label: '设置直流过压保护电压', unit: 'V',  min: 600,  max: 1030,  scale: 10,   decimals: 1, deviceType: '171B' },

  // —— 一级/二级交流保护（combined → 阈值 + 时间）——
  { key: 'pcs_B76',  field: 'B76',  width: 16, group: '设置一级交流欠压保护', subLabel: '线电压', label: '一级交流欠压保护线电压',  unit: 'V',  min: 260, max: 365, scale: 10,  decimals: 1, deviceType: '171B' },
  { key: 'pcs_B78',  field: 'B78',  width: 16, group: '设置一级交流欠压保护', subLabel: '保护时间', label: '一级交流欠压保护时间',    unit: 's',  min: 0.01, max: 655.35, scale: 100, decimals: 2, deviceType: '171B' },

  { key: 'pcs_B80',  field: 'B80',  width: 16, group: '设置一级交流过压保护', subLabel: '线电压', label: '一级交流过压保护线电压',  unit: 'V',  min: 396, max: 535, scale: 10,  decimals: 1, deviceType: '171B' },
  { key: 'pcs_B82',  field: 'B82',  width: 16, group: '设置一级交流过压保护', subLabel: '保护时间', label: '一级交流过压保护时间',    unit: 's',  min: 0.01, max: 655.35, scale: 100, decimals: 2, deviceType: '171B' },

  { key: 'pcs_B84',  field: 'B84',  width: 16, group: '设置一级交流欠频保护', subLabel: '频率',   label: '一级交流欠频保护频率',    unit: 'Hz', min: 45,  max: 50,  scale: 100, decimals: 2, deviceType: '171B' },
  { key: 'pcs_B86',  field: 'B86',  width: 16, group: '设置一级交流欠频保护', subLabel: '保护时间', label: '一级交流欠频保护时间',    unit: 's',  min: 0.01, max: 655.35, scale: 100, decimals: 2, deviceType: '171B' },

  { key: 'pcs_B88',  field: 'B88',  width: 16, group: '设置一级交流过频保护', subLabel: '频率',   label: '一级交流过频保护频率',    unit: 'Hz', min: 50,  max: 65,  scale: 100, decimals: 2, deviceType: '171B' },
  { key: 'pcs_B90',  field: 'B90',  width: 16, group: '设置一级交流过频保护', subLabel: '保护时间', label: '一级交流过频保护时间',    unit: 's',  min: 0.01, max: 655.35, scale: 100, decimals: 2, deviceType: '171B' },

  { key: 'pcs_B96',  field: 'B96',  width: 16, group: '设置二级交流过频保护', subLabel: '频率',   label: '二级交流过频保护频率',    unit: 'Hz', min: 50,  max: 65,  scale: 100, decimals: 2, deviceType: '171B' },
  { key: 'pcs_B98',  field: 'B98',  width: 16, group: '设置二级交流过频保护', subLabel: '保护时间', label: '二级交流过频保护时间',    unit: 's',  min: 0.01, max: 655.35, scale: 100, decimals: 2, deviceType: '171B' },

  { key: 'pcs_B104', field: 'B104', width: 16, group: '设置二级交流欠压保护', subLabel: '线电压', label: '二级交流欠压保护线电压',  unit: 'V',  min: 260, max: 365, scale: 100, decimals: 2, deviceType: '171B' },
  { key: 'pcs_B106', field: 'B106', width: 16, group: '设置二级交流欠压保护', subLabel: '保护时间', label: '二级交流欠压保护时间',    unit: 's',  min: 0.01, max: 655.35, scale: 100, decimals: 2, deviceType: '171B' },

  { key: 'pcs_B108', field: 'B108', width: 16, group: '设置二级交流过压保护', subLabel: '线电压', label: '二级交流过压保护线电压',  unit: 'V',  min: 396, max: 535, scale: 10,  decimals: 1, deviceType: '171B' },
  { key: 'pcs_B110', field: 'B110', width: 16, group: '设置二级交流过压保护', subLabel: '保护时间', label: '二级交流过压保护时间',    unit: 's',  min: 0.01, max: 655.35, scale: 100, decimals: 2, deviceType: '171B' }
]

/** PCS 开关型参数 (171B CONTROL 帧，全部 UINT32，width: 32) */
export const PCS_SWITCH_PARAMS = [
  // { key: 'pcs_B8',  field: 'B8',  width: 32, label: '设置模块地址分配方式', deviceType: '171B', options: [
  //   { label: '自动分配', value: 0 }, { label: '拨码设置', value: 1 }
  // ]},
  { key: 'pcs_B12', field: 'B12', width: 32, label: '设置离网模式交流侧欠压复位', deviceType: '171B', options: [
    { label: '禁止', value: 0 }, { label: '复位', value: 1 }
  ]},
  { key: 'pcs_B16', field: 'B16', width: 32, label: '设置整流模式直流侧欠压复位', deviceType: '171B', options: [
    { label: '禁止', value: 0 }, { label: '复位', value: 1 }
  ]},
  { key: 'pcs_B20', field: 'B20', width: 32, label: '设置模块工作模式', deviceType: '171B', options: [
    { label: '并网', value: 0 }, { label: '离网', value: 1 }, { label: '整流', value: 2 }
  ]},
  { key: 'pcs_B24', field: 'B24', width: 32, label: '设置模块开关机', deviceType: '171B', options: [
    { label: '开机', value: 0, dangerous: true }, { label: '关机', value: 1, dangerous: true }
  ]},
  { key: 'pcs_B28', field: 'B28', width: 32, label: '设置模块直流侧过压复位', deviceType: '171B', options: [
    { label: '禁止', value: 0 }, { label: '复位', value: 1 }
  ]},
  { key: 'pcs_B32', field: 'B32', width: 32, label: '设置模块短路复位', deviceType: '171B', options: [
    { label: '禁止', value: 0 }, { label: '复位', value: 1 }
  ]},
  // { key: 'pcs_B56', field: 'B56', width: 32, label: '设置交流侧无功功率类型', deviceType: '171B', options: [
  //   { label: '不设置无功功率输出', value: 0x00A00000 },
  //   { label: '通过 PF 设置命令', value: 0x00A10000 },
  //   { label: '通过无功功率设置命令', value: 0x00A20000 }
  // ]},
  // { key: 'pcs_B64', field: 'B64', width: 32, label: '设置是否错相', deviceType: '171B', options: [
  //   { label: '不允许', value: 0 }, { label: '允许', value: 1 }
  // ]},
  // { key: 'pcs_B100', field: 'B100', width: 32, label: '设置是否过载输出', deviceType: '171B', options: [
  //   { label: '禁用', value: 0 }, { label: '使能', value: 1 }
  // ]},
  // { key: 'pcs_B112', field: 'B112', width: 32, label: '设置是否使能输入电压环', deviceType: '171B', options: [
  //   { label: '禁用', value: 0 }, { label: '使能', value: 1 }
  // ]}
]

// ============ PV (171E) 控制参数 ============
// 寄存器定义参考 community/settings/components/PvSettings.vue

/** PV 光伏 DC/DC 数值型参数 (171E CONTROL 帧) */
export const PV_NUMERIC_PARAMS = [
  { key: 'pv_B0',  field: 'B0',  label: '模块工作海拔值',  unit: 'm',  min: 1000, max: 5000, scale: 1,    decimals: 0, deviceType: '171E' },
  { key: 'pv_B4',  field: 'B4',  label: '模块输出电流值',  unit: 'A',  min: 0,    max: 100,  scale: 1024, decimals: 2, deviceType: '171E' },
  { key: 'pv_B8',  field: 'B8',  label: '组号',            unit: '',   min: 0,    max: 60,   scale: 1,    decimals: 0, deviceType: '171E' },
  { key: 'pv_B16', field: 'B16', label: '模块输出功率',    unit: 'kW', min: 2,    max: 20,   scale: 20,   decimals: 1, deviceType: '171E' },
  { key: 'pv_B20', field: 'B20', label: '模块输出电压',    unit: 'V',  min: 200,  max: 800,  scale: 1,    decimals: 0, deviceType: '171E' },
  { key: 'pv_B24', field: 'B24', label: '模块限流点',      unit: 'A',  min: 0,    max: 100,  scale: 1,    decimals: 0, deviceType: '171E' },
  { key: 'pv_B28', field: 'B28', label: '模块输出电压上限',unit: 'V',  min: 200,  max: 800,  scale: 1,    decimals: 0, deviceType: '171E' }
]

/** PV 光伏 DC/DC 开关型参数 (171E CONTROL 帧) */
export const PV_SWITCH_PARAMS = [
  { key: 'pv_B12', field: 'B12', label: '模块地址分配方式', deviceType: '171E', options: [
    { label: '自动分配', value: 0 }, { label: '拨码设置', value: 1 }
  ]},
  { key: 'pv_B32', field: 'B32', label: '开关机', deviceType: '171E', options: [
    { label: '开机', value: 0, dangerous: true }, { label: '关机', value: 1, dangerous: true }
  ]},
  { key: 'pv_B36', field: 'B36', label: '模块过压复位', deviceType: '171E', options: [
    { label: '禁止', value: 0 }, { label: '复位', value: 1 }
  ]},
  { key: 'pv_B40', field: 'B40', label: '输出过压保护关联是否允许', deviceType: '171E', options: [
    { label: '允许', value: 0 }, { label: '禁止', value: 1 }
  ]},
  { key: 'pv_B44', field: 'B44', label: '模块短路复位', deviceType: '171E', options: [
    { label: '禁止', value: 0 }, { label: '复位', value: 1 }
  ]},
  { key: 'pv_B48', field: 'B48', label: '输入模式', deviceType: '171E', options: [
    { label: '交流模式', value: 1 }, { label: '直流模式', value: 2 }
  ]}
]

// ============ Storage (171D) 控制参数 ============
// 寄存器定义参考 community/settings/components/StorageSettings.vue

/** Storage 储能 DC/DC 数值型参数 (171D CONTROL 帧) */
export const STORAGE_NUMERIC_PARAMS = [
  { key: 'st_B22', field: 'B22', label: '直流母线电压',    unit: 'V',  min: 350, max: 850, scale: 10, decimals: 1, deviceType: '171D' },
  { key: 'st_B26', field: 'B26', label: '充放电功率设定',  unit: '%',  min: 0,   max: 130, scale: 10, decimals: 1, deviceType: '171D' },
  { key: 'st_B28', field: 'B28', label: '电池均充电压',    unit: 'V',  min: 40,  max: 360, scale: 10, decimals: 1, deviceType: '171D' },
  { key: 'st_B30', field: 'B30', label: '充电电流设置',    unit: 'A',  min: 0,   max: 130, scale: 10, decimals: 1, deviceType: '171D' },
  { key: 'st_B32', field: 'B32', label: '电池浮充电压',    unit: 'V',  min: 40,  max: 360, scale: 10, decimals: 1, deviceType: '171D' },
  { key: 'st_B34', field: 'B34', label: '放电电压设置',    unit: 'V',  min: 40,  max: 360, scale: 10, decimals: 1, deviceType: '171D' },
  { key: 'st_B36', field: 'B36', label: '放电电流设置',    unit: 'A',  min: 0,   max: 130, scale: 10, decimals: 1, deviceType: '171D' },
  { key: 'st_B38', field: 'B38', label: '电池过压关机点',  unit: 'V',  min: 40,  max: 370, scale: 10, decimals: 1, deviceType: '171D' },
  { key: 'st_B40', field: 'B40', label: '电池欠压告警点',  unit: 'V',  min: 35,  max: 355, scale: 10, decimals: 1, deviceType: '171D' },
  { key: 'st_B42', field: 'B42', label: '电池欠压关机点',  unit: 'V',  min: 35,  max: 355, scale: 10, decimals: 1, deviceType: '171D' },
  { key: 'st_B48', field: 'B48', label: '充电母线电压上限',unit: 'V',  min: 350, max: 850, scale: 10, decimals: 1, deviceType: '171D' },
  { key: 'st_B50', field: 'B50', label: '放电母线电压下限',unit: 'V',  min: 350, max: 850, scale: 10, decimals: 1, deviceType: '171D' }
]

/** Storage 储能 DC/DC 开关型参数 (171D CONTROL 帧) */
export const STORAGE_SWITCH_PARAMS = [
  { key: 'st_B6',  field: 'B6',  label: '故障清除', deviceType: '171D', options: [
    { label: '清除所有故障', value: 0x0055, dangerous: true }
  ]},
  { key: 'st_B10', field: 'B10', label: '运行状态设置', deviceType: '171D', options: [
    { label: '自适应', value: 0 }, { label: '并网', value: 1 }, { label: '离网', value: 2 }
  ]},
  { key: 'st_B12', field: 'B12', label: '系统开关机', deviceType: '171D', options: [
    { label: '开机', value: 0x0055, dangerous: true }, { label: '关机', value: 0x00AA, dangerous: true }
  ]},
  { key: 'st_B24', field: 'B24', label: '充放电指令', deviceType: '171D', options: [
    { label: '待机', value: 0 }, { label: '充电', value: 1 }, { label: '放电', value: 2 },
    { label: 'BAT自动', value: 3 }, { label: 'BUS自动', value: 4 },
    // { label: '关充电', value: 5 }, { label: '高压PV模式', value: 6 }, { label: '低压PV模式', value: 7 }
  ]}
]

// ============ Quick Control (171F) ============

/** Quick Control 快捷控制参数 (171F) */
export const QUICK_CONTROL_PARAMS = [
  {
    key: 'qc_storage_dc', field: 'B0', label: '储能DC一键控制', deviceType: '171F',
    options: [
      { label: '一键开机', value: 1 },
      { label: '关机', value: 2 }
    ]
  },
  {
    key: 'qc_pv_dc', field: 'B10', label: '光伏DC控制', deviceType: '171F',
    options: [
      { label: '一键开机', value: 1 },
      { label: '关机', value: 2 }
    ]
  },
  {
    key: 'qc_pcs_mode', field: 'B2', label: 'PCS模式选择', deviceType: '171F',
    options: [
      { label: '并网整流', value: 1 },
      { label: '并网逆变', value: 2 },
      { label: '离网', value: 3 }
    ]
  },
  {
    key: 'qc_pcs_action', field: 'B8', label: 'PCS开关机', deviceType: '171F',
    options: [
      { label: '开机', value: 1 },
      { label: '关机', value: 2 }
    ]
  }
]

/** Quick Control 数值型参数 (171F) - 功率设置 */
export const QUICK_POWER_PARAMS = [
  { key: 'qc_charge_power', field: 'B4', label: '充电功率', unit: 'kW', min: 1, max: 100, scale: 1, decimals: 1, deviceType: '171F' },
  { key: 'qc_discharge_power', field: 'B6', label: '放电功率', unit: 'kW', min: 1, max: 100, scale: 1, decimals: 1, deviceType: '171F' }
]

/** 聚合导出 */
export const BMS_ALL_PARAMS = [
  ...BMS_NUMERIC_PARAMS,
  ...BMS_SWITCH_PARAMS,
  ...BMS_POWER_PARAMS
]

export const PCS_ALL_PARAMS = [
  ...PCS_NUMERIC_PARAMS,
  ...PCS_SWITCH_PARAMS
]

export const PV_ALL_PARAMS = [
  ...PV_NUMERIC_PARAMS,
  ...PV_SWITCH_PARAMS
]

export const STORAGE_ALL_PARAMS = [
  ...STORAGE_NUMERIC_PARAMS,
  ...STORAGE_SWITCH_PARAMS
]

export const QUICK_CONTROL_ALL_PARAMS = [
  ...QUICK_CONTROL_PARAMS,
  ...QUICK_POWER_PARAMS
]
