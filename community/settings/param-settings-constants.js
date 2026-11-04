// 设置页共享常量（与网页版 MonitoringData.vue 对齐）
// 来源: D:\developer\micro-energy-station\src\pages\front\monitoring\microStation-Management\MonitoringData.vue

// ========== 50kW PCS (1707_V3_5) ==========
const MOVED_PCS_ENERGY_KEYS = [
  'Fault_reset', 'Device_Start', 'Device_Shutdown', 'Remote_E_Stop',
  'Reset_Charge_Energy', 'Reset_Discharge_Energy', 'Remote_Local_Setting', 'Device_Standby',
  'External_Switch'
];
const MOVED_PCS_STATE_KEYS = [
  'operating_mode',
  'Constant_Voltage_Charge_Voltage_Setpoint', 'Constant_Current_Charge_Current_Setpoint',
  'Constant_Power_Active_Power_Target', 'Constant_Power_Reactive_Power_Target',
  'Grid_Connected_Off_Grid_Setting', 'Off_Grid_Output_Voltage_Setpoint', 'Off_Grid_Output_Frequency_Setpoint',
  'Phase_Controlled_A_Phase_Active_Power', 'Phase_Controlled_B_Phase_Active_Power', 'Phase_Controlled_C_Phase_Active_Power',
  'Phase_Controlled_A_Phase_Reactive_Power', 'Phase_Controlled_B_Phase_Reactive_Power', 'Phase_Controlled_C_Phase_Reactive_Power',
  'Off_Grid_Output_Voltage_Phase_A_Setpoint', 'Off_Grid_Output_Voltage_Phase_B_Setpoint', 'Off_Grid_Output_Voltage_Phase_C_Setpoint',
  'Microgrid_DC_Voltage_Droop_Coefficient', 'Primary_Frequency_Regulation_Frequency_Deadband', 'Primary_Frequency_Regulation_K_Value',
  'VSG_Frequency_Droop_Coefficient', 'VSG_Voltage_Droop_Coefficient', 'Switch_Operation_Mode',
  'Battery_Overcapacity_Allowed_Charge_Voltage', 'Battery_Overcapacity_Allowed_Discharge_Voltage',
  'Battery_Overcapacity_Allowed_Charge_Current', 'Battery_Overcapacity_Allowed_Discharge_Current',
  'Second', 'Minute', 'Hour', 'Day', 'Month', 'Year',
  'Enclosure_Fan_Start_Temperature', 'Enclosure_Fan_Start_Time', 'Enclosure_Fan_Stop_Temperature',
  'Enclosure_Fan_Stop_Time', 'Enclosure_Fan_Forced_Start_Command'
];
const PCS1707_SWITCH_KEYS = [
  'Fault_reset', 'Device_Start', 'Device_Shutdown', 'Remote_E_Stop',
  'Reset_Charge_Energy', 'Reset_Discharge_Energy', 'Remote_Local_Setting',
  'Device_Standby', 'External_Switch'
];
const PCS1707_SWITCH_OPTIONS = [
  { label: '不执行', value: '0' },
  { label: '执行', value: '1' }
];
const PCS1707_MODE_OPTIONS = {
  Switch_Operation_Mode: [
    { label: '无', value: '0' },
    { label: '手动', value: '1' },
    { label: '自动', value: '2' },
    { label: '混合', value: '3' },
    { label: '静默', value: '4' }
  ],
  operating_mode: [
    { label: '无', value: '0' },
    { label: '恒流充电', value: '1' },
    { label: '恒压充电', value: '2' },
    { label: '恒功率充电', value: '3' },
    { label: '直流恒压模式', value: '4' }
  ],
  Grid_Connected_Off_Grid_Setting: [
    { label: '并网', value: '0' },
    { label: '离网', value: '1' }
  ]
};
// 50kW PCS(1707_V3_5) 控制下发地址表，源自《pcs控制数据》点表 A 列「地址(byte)」。
// 点表原值为十进制 byte 地址（331~387），直接用十进制数字符串。
// 前 9 个位命令各占 1 个 byte，其余各项跨 2 个 byte，均取起始 byte 作为寄存器地址。
// 电池超容/对时/柜体风机等字段点表未定义，故无地址（下发时跳过）。
const PCS1707_ADDRESS_MAP = {
  Fault_reset: '331',
  Device_Start: '332',
  Device_Shutdown: '333',
  Remote_E_Stop: '334',
  Reset_Charge_Energy: '335',
  Reset_Discharge_Energy: '336',
  Remote_Local_Setting: '337',
  Device_Standby: '338',
  External_Switch: '339',
  operating_mode: '340',
  Constant_Voltage_Charge_Voltage_Setpoint: '342',
  Constant_Current_Charge_Current_Setpoint: '344',
  Constant_Power_Active_Power_Target: '346',
  Constant_Power_Reactive_Power_Target: '348',
  Grid_Connected_Off_Grid_Setting: '350',
  Off_Grid_Output_Voltage_Setpoint: '352',
  Off_Grid_Output_Frequency_Setpoint: '354',
  Phase_Controlled_A_Phase_Active_Power: '356',
  Phase_Controlled_B_Phase_Active_Power: '358',
  Phase_Controlled_C_Phase_Active_Power: '360',
  Phase_Controlled_A_Phase_Reactive_Power: '362',
  Phase_Controlled_B_Phase_Reactive_Power: '364',
  Phase_Controlled_C_Phase_Reactive_Power: '366',
  Off_Grid_Output_Voltage_Phase_A_Setpoint: '368',
  Off_Grid_Output_Voltage_Phase_B_Setpoint: '370',
  Off_Grid_Output_Voltage_Phase_C_Setpoint: '372',
  Microgrid_DC_Voltage_Droop_Coefficient: '374',
  Primary_Frequency_Regulation_Frequency_Deadband: '376',
  Primary_Frequency_Regulation_K_Value: '378',
  VSG_Frequency_Droop_Coefficient: '380',
  VSG_Voltage_Droop_Coefficient: '384',
  Switch_Operation_Mode: '386',
  Battery_Overcapacity_Allowed_Charge_Voltage: '388',
  Battery_Overcapacity_Allowed_Discharge_Voltage: '390',
  Battery_Overcapacity_Allowed_Charge_Current: '392',
  Battery_Overcapacity_Allowed_Discharge_Current: '394',
  Second: '396',
  Minute: '398',
  Hour: '400',
  Day: '402',
  Month: '404',
  Year: '406',
  Enclosure_Fan_Start_Temperature: '408',
  Enclosure_Fan_Start_Time: '410',
  Enclosure_Fan_Stop_Temperature: '412',
  Enclosure_Fan_Stop_Time: '414',
  Enclosure_Fan_Forced_Start_Command: '416'
};

// ========== 50kW 储能DC/光伏DC (170C_V1_1) ==========
const MOVED_170C_ENERGY_KEYS = [
  'BATSetVoltage', 'maxChargeCurrent', 'maxDischargeCurrent', 'BUSSetVoltage', 'BUSSetCurrent',
  'sagVoltageCoefficient', 'maxPowerLimit',
  'BATUndervoltagePoint', 'BATOvervoltagePoint', 'BUSUndervoltagePoint', 'BUSOvervoltagePoint',
  'BATChargeCurrentPoint', 'BATDishargeCurrentPoint', 'BUSChargeCurrentPoint', 'BUSDishargeCurrentPoint',
  // BATVoltage/BUSVoltage 为只读显示值，留在监控页展示，不进入参数设置
  // 'BATVoltage', 'BUSVoltage'
];
const MOVED_170C_STATE_KEYS = ['startOrder', 'moduleMode', 'workMode', 'moduleShareCurrent'];
const STORAGE_171D_MODE_OPTIONS = {
  moduleMode: [
    { label: 'MPPT 模块', value: '0' },
    { label: '双向 DC/DC 模块', value: '1' }
  ],
  workMode: [
    { label: 'BUS侧恒压', value: '1' },
    { label: 'BUS侧恒流', value: '2' },
    { label: 'BAT侧恒压', value: '3' },
    { label: 'BAT侧恒流', value: '4' },
    { label: 'BAT侧恒功率', value: '5' }
  ],
  moduleShareCurrent: [
    { label: '无均流', value: '0' },
    { label: '均流方式 1', value: '1' },
    { label: '均流方式 2', value: '2' },
    { label: '均流方式 3', value: '3' }
  ],
  startOrder: [
    { label: '待机', value: '0' },
    { label: '启动', value: '1' },
    { label: '停机', value: '2' },
    { label: '复位', value: '3' }
  ]
};
// 50kW 储能DC/光伏DC(170C_V1_1 / 下发协议 0x171D) 控制下发地址表，源自《储能DC控制数据》点表 A 列。
// BATVoltage/BUSVoltage 为只读显示值，点表未定义控制地址，不在此表中（下发时跳过）。
const STORAGE_171D_ADDRESS_MAP = {
  BATSetVoltage: '331',
  maxChargeCurrent: '332',
  maxDischargeCurrent: '333',
  BUSSetVoltage: '334',
  BUSSetCurrent: '335',
  sagVoltageCoefficient: '336',
  moduleMode: '337',
  workMode: '338',
  moduleShareCurrent: '339',
  maxPowerLimit: '340',
  BATUndervoltagePoint: '341',
  BATOvervoltagePoint: '342',
  BUSUndervoltagePoint: '343',
  BUSOvervoltagePoint: '344',
  BATChargeCurrentPoint: '345',
  BATDishargeCurrentPoint: '346',
  BUSChargeCurrentPoint: '347',
  BUSDishargeCurrentPoint: '348',
  startOrder: '362'
};
// 下发值换算表：点表 D 列标注「传输值=(实际值*10)」的寄存器地址，下发时需 ×10。
const PARAM_SCALE10_ADDRESS = {
  // PCS（171B），源自《pcs控制数据》D 列：8 个功率类字段，单位 0.1kW / 0.1kVar
  '171B': ['346', '348', '356', '358', '360', '362', '364', '366'],
  '171D': ['331', '332', '333', '334', '335', '336', '340', '341', '342', '343', '344', '345', '346', '347', '348'],
  '171E': ['331', '332', '333', '334', '335', '336', '340', '341', '342', '343', '344', '345', '346', '347', '348'],
  // BMS（171C）V2.0 整字节回差/湿度项；温度设定点等 (实际值+50)*10 项不含在内（页面直接编辑协议传输值）
  '171C': ['349', '353', '365', '367'],
  // 液冷机（0318），源自《液冷机控制数据》D 列：4 个压力类字段，单位 0.1bar
  '0318': ['353', '355', '357', '359']
};

// BMS 控制数据下发地址表（171C_V2 / V2.0，addr=01），源自《BMS控制数据地址表》A 列。
// bit 为 null 表示整字节直写；同地址的多个 bit 字段下发时需打包成一个字节。
const BMS_CONTROL_ADDRESS_MAP = {
  // 整字节控制
  B0:  { address: '331', bit: null },   // 心跳（可读写）
  B8:  { address: '339', bit: null },   // 绝缘检测控制（0/1/2）
  B12: { address: '343', bit: null },   // TMS 开关机故障复位
  B14: { address: '345', bit: null },   // TMS 模式设置
  B16: { address: '347', bit: null },   // 制冷设定点
  B18: { address: '349', bit: null },   // 制冷回差 ×10
  B20: { address: '351', bit: null },   // 制热设定点
  B22: { address: '353', bit: null },   // 制热回差 ×10
  B24: { address: '355', bit: null },   // 制冷目标参数设置
  B26: { address: '357', bit: null },   // 制热目标参数设置
  B30: { address: '361', bit: null },   // 控温开启值
  B32: { address: '363', bit: null },   // 控温关闭值
  B34: { address: '365', bit: null },   // 控湿度开启值 ×10
  B36: { address: '367', bit: null },   // 控湿度关闭值 ×10
  B38: { address: '369', bit: null },   // 温度报警上限值
  B40: { address: '371', bit: null },   // 温度报警下限值
  // 位字段：新地址表（BMS控制数据地址表.xlsx）中 334~338 的 bit 字段已移至 1077~1099，
  // 且每个 bit 独占一个地址，不再共享字节，故 bit 位均为 0（整字节下发）
  B3b0: { address: '1077', bit: 0 },     // 上高压请求
  B3b1: { address: '1078', bit: 0 },     // 下高压请求
  B3b2: { address: '1079', bit: 0 },     // 紧急下电请求
  B3b3: { address: '1080', bit: 0 },     // 预充请求
  B3b4: { address: '1081', bit: 0 },     // 绝缘检测开关（0:开启 1:关闭）
  B5b0: { address: '1082', bit: 0 },     // 请求BMS重启
  B5b1: { address: '1083', bit: 0 },     // 交流断路器切断请求
  B5b2: { address: '1084', bit: 0 },     // 系统锁（0:无请求 1:系统锁释放）
  B5b3: { address: '1085', bit: 0 },     // 故障复位
  B6:   { address: '1086', bit: 0 },     // 强控使能位
  B7:   { address: '1087', bit: 0 },     // 强控HSS1
  B7b1: { address: '1088', bit: 0 },     // 强控HSS2
  B7b2: { address: '1089', bit: 0 },     // 强控HSS3
  B7b3: { address: '1090', bit: 0 },     // 强控HSS4
  B7b4: { address: '1091', bit: 0 },     // 强控HSS5
  B7b5: { address: '1092', bit: 0 },     // 强控HSS6
  B7b6: { address: '1093', bit: 0 },     // 强控HSS7
  B7b7: { address: '1094', bit: 0 },     // 强控HSS8
  B6b1: { address: '1095', bit: 0 },     // 强控LSS1
  B6b2: { address: '1096', bit: 0 },     // 强控LSS2
  B6b3: { address: '1097', bit: 0 },     // 强控DO1
  B6b4: { address: '1098', bit: 0 },     // 强控DO2
  B6b5: { address: '1099', bit: 0 }      // 强控DO3
};
// BMS 控制字段枚举项，映射取自《BMS控制数据地址表》D 列说明；选中的 value 为下发原始值
const BMS_CONTROL_MODE_OPTIONS = {
  B3b0: [{ label: '无请求', value: '0' }, { label: '请求上电', value: '1' }],
  B3b1: [{ label: '无请求', value: '0' }, { label: '请求下电', value: '1' }],
  B3b2: [{ label: '无请求', value: '0' }, { label: '请求紧急下电', value: '1' }],
  B3b3: [{ label: '无请求', value: '0' }, { label: '请求预充', value: '1' }],
  B3b4: [{ label: '开启绝缘检测', value: '0' }, { label: '关闭绝缘检测', value: '1' }],
  B5b0: [{ label: '无请求', value: '0' }, { label: '请求重启', value: '1' }],
  B5b1: [{ label: '无请求', value: '0' }, { label: '请求切断', value: '1' }],
  B5b2: [{ label: '无请求', value: '0' }, { label: '系统锁释放', value: '1' }],
  B5b3: [{ label: '无请求', value: '0' }, { label: '故障复位', value: '1' }],
  B6:   [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B6b1: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B6b2: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B6b3: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B6b4: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B6b5: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B7:   [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B7b1: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B7b2: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B7b3: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B7b4: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B7b5: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B7b6: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B7b7: [{ label: '不强控', value: '0' }, { label: '强控', value: '1' }],
  B8:   [{ label: '开启绝缘检测', value: '0' }, { label: '关闭绝缘检测', value: '1' }, { label: '上电只检测一次绝缘', value: '2' }]
};

// ========== 50kW BMS 告警阈值（171C_V2_1 ~ V2_4）==========
// V2.1~V2.4 四台从 BMS 各自拥有独立的告警阈值寄存器段（点表 A 列十进制地址）。
// 每段 176 地址（22 类告警 × 4 字段 × 2 字节/字段，地址连续递增 2）。
// 段内 key 的相对偏移在 BMS_ALARM_THRESHOLD_OFFSETS 中定义，实际地址 = base + offset。
const BMS_ALARM_THRESHOLD_BASE = {
  '171C_V2_1': 373, // 1级告警阈值段起始
  '171C_V2_2': 549, // 2级（1级 + 176）
  '171C_V2_3': 725, // 3级（1级 + 352）
  '171C_V2_4': 901  // 4级（1级 + 528）
};
// V2.1 ControlData 字段 key → 段内地址偏移量（相对于段首 373）。
// V2.2/V2.3/V2.4 模型 key 与 V2.1 完全相同，仅 name 中级别不同，偏移量通用。
const BMS_ALARM_THRESHOLD_OFFSETS = {
  B0: 0,
  B2: 2,
  B4: 4,
  B6: 6,
  B8: 8,
  B10: 10,
  B12: 12,
  B14: 14,
  B16: 16,
  B18: 18,
  B20: 20,
  B22: 22,
  B24: 24,
  B26: 26,
  B28: 28,
  B30: 30,
  B32: 32,
  B34: 34,
  B36: 36,
  B38: 38,
  B40: 40,
  B42: 42,
  B44: 44,
  B46: 46,
  B48: 48,
  B50: 50,
  B52: 52,
  B54: 54,
  B56: 56,
  B58: 58,
  B60: 60,
  B62: 62,
  B64: 64,
  B66: 66,
  B68: 68,
  B70: 70,
  B72: 72,
  B74: 74,
  B76: 76,
  B78: 78,
  B80: 80,
  B82: 82,
  B84: 84,
  B86: 86,
  B88: 88,
  B90: 90,
  B92: 92,
  B94: 94,
  B96: 96,
  B98: 98,
  B100: 100,
  B102: 102,
  B104: 104,
  B106: 106,
  B108: 108,
  B110: 110,
  B112: 112,
  B114: 114,
  B116: 116,
  B118: 118,
  B120: 120,
  B122: 122,
  B124: 124,
  B126: 126,
  B128: 128,
  B130: 130,
  B132: 132,
  B134: 134,
  B136: 136,
  B138: 138,
  B140: 140,
  B142: 142,
  B144: 144,
  B146: 146,
  B148: 148,
  B150: 150,
  B152: 152,
  B154: 154,
  B156: 156,
  B158: 158,
  B160: 160,
  B162: 162,
  B164: 164,
  B166: 166,
  B168: 168,
  B170: 170,
  B172: 172,
  B174: 174
};

// 传输值 = (实际值 + offset) × scale。key 为 deviceCategory，value 为 { address: { offset, scale } } 映射。
// BMS（171C）含偏移量 -50 的温度字段：
//   A 类（8 个，V2.0 控制段 347~371）：(实际值 + 50) × 10
//   B 类（96 个，V2.1~V2.4 告警阈值段 437~1065）：(实际值 + 50) × 1
// 这些地址不能出现在 PARAM_SCALE10_ADDRESS / PARAM_SCALE100_ADDRESS 里。
const PARAM_OFFSET_SCALE_ADDRESS = {
  '171C': (() => {
    const listA = ['347', '351', '355', '357', '361', '363', '369', '371'];
    const listB = [
      '437', '441', '445', '449', '453', '457', '461', '465',
      '469', '473', '485', '489', '493', '497', '501', '505',
      '509', '513', '517', '521', '525', '529', '533', '537',
      '613', '617', '621', '625', '629', '633', '637', '641',
      '645', '649', '661', '665', '669', '673', '677', '681',
      '685', '689', '693', '697', '701', '705', '709', '713',
      '789', '793', '797', '801', '805', '809', '813', '817',
      '821', '825', '837', '841', '845', '849', '853', '857',
      '861', '865', '869', '873', '877', '881', '885', '889',
      '965', '969', '973', '977', '981', '985', '989', '993',
      '997', '1001', '1013', '1017', '1021', '1025', '1029', '1033',
      '1037', '1041', '1045', '1049', '1053', '1057', '1061', '1065'
    ];
    const obj = {};
    listA.forEach(addr => { obj[addr] = { offset: 50, scale: 10 }; });
    listB.forEach(addr => { obj[addr] = { offset: 50, scale: 1 }; });
    return obj;
  })()
};

// 传输值 = 实际值 × 100。key 为 deviceCategory，value 为地址字符串数组。
// BMS（171C）：V2.1~V2.4 告警阈值段中所有「告警触发/释放时间」字段（单位 0.01s）。
const PARAM_SCALE100_ADDRESS = {
  // PCS（171B），源自《pcs控制数据》D 列：2 个频率类字段
  // 离网输出频率给定（354，单位 1Hz / 默认 50Hz 传输值 5000）、一次调频频率死区（376，单位 0.01Hz）
  '171B': ['354', '376'],
  '171C': [
    '375', '379', '383', '387', '391', '395', '399', '403',
    '407', '411', '415', '419', '423', '427', '431', '435',
    '439', '443', '447', '451', '455', '459', '463', '467',
    '471', '475', '479', '483', '487', '491', '495', '499',
    '503', '507', '511', '515', '519', '523', '527', '531',
    '535', '539', '543', '547', '551', '555', '559', '563',
    '567', '571', '575', '579', '583', '587', '591', '595',
    '599', '603', '607', '611', '615', '619', '623', '627',
    '631', '635', '639', '643', '647', '651', '655', '659',
    '663', '667', '671', '675', '679', '683', '687', '691',
    '695', '699', '703', '707', '711', '715', '719', '723',
    '727', '731', '735', '739', '743', '747', '751', '755',
    '759', '763', '767', '771', '775', '779', '783', '787',
    '791', '795', '799', '803', '807', '811', '815', '819',
    '823', '827', '831', '835', '839', '843', '847', '851',
    '855', '859', '863', '867', '871', '875', '879', '883',
    '887', '891', '895', '899', '903', '907', '911', '915',
    '919', '923', '927', '931', '935', '939', '943', '947',
    '951', '955', '959', '963', '967', '971', '975', '979',
    '983', '987', '991', '995', '999', '1003', '1007', '1011',
    '1015', '1019', '1023', '1027', '1031', '1035', '1039', '1043',
    '1047', '1051', '1055', '1059', '1063', '1067', '1071', '1075'
  ]
};

module.exports = {
  // PCS
  MOVED_PCS_ENERGY_KEYS,
  MOVED_PCS_STATE_KEYS,
  PCS1707_SWITCH_KEYS,
  PCS1707_SWITCH_OPTIONS,
  PCS1707_MODE_OPTIONS,
  PCS1707_ADDRESS_MAP,
  // 170C
  MOVED_170C_ENERGY_KEYS,
  MOVED_170C_STATE_KEYS,
  STORAGE_171D_MODE_OPTIONS,
  STORAGE_171D_ADDRESS_MAP,
  PARAM_SCALE10_ADDRESS,
  PARAM_OFFSET_SCALE_ADDRESS,
  PARAM_SCALE100_ADDRESS,
  // BMS
  BMS_CONTROL_ADDRESS_MAP,
  BMS_CONTROL_MODE_OPTIONS,
  BMS_ALARM_THRESHOLD_BASE,
  BMS_ALARM_THRESHOLD_OFFSETS
};
