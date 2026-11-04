// ========== 50kW 新协议设备参数（十进制寄存器地址，与 20kW 旧协议的 0x hex 地址区分）==========
// 来源: D:\developer\micro-energy-station\src\pages\front\monitoring\microStation-Management\ControlLog.vue

// 50kW PCS (1707_V3_5, deviceCategory: 171B) 地址表，源自《pcs控制数据》
const PCS50_ADDR = {
  Fault_reset: '331', Device_Start: '332', Device_Shutdown: '333', Remote_E_Stop: '334',
  Reset_Charge_Energy: '335', Reset_Discharge_Energy: '336', Remote_Local_Setting: '337',
  Device_Standby: '338', External_Switch: '339', operating_mode: '340',
  Constant_Voltage_Charge_Voltage_Setpoint: '342', Constant_Current_Charge_Current_Setpoint: '344',
  Constant_Power_Active_Power_Target: '346', Constant_Power_Reactive_Power_Target: '348',
  Grid_Connected_Off_Grid_Setting: '350', Off_Grid_Output_Voltage_Setpoint: '352',
  Off_Grid_Output_Frequency_Setpoint: '354',
  Phase_Controlled_A_Phase_Active_Power: '356', Phase_Controlled_B_Phase_Active_Power: '358',
  Phase_Controlled_C_Phase_Active_Power: '360', Phase_Controlled_A_Phase_Reactive_Power: '362',
  Phase_Controlled_B_Phase_Reactive_Power: '364', Phase_Controlled_C_Phase_Reactive_Power: '366',
  Off_Grid_Output_Voltage_Phase_A_Setpoint: '368', Off_Grid_Output_Voltage_Phase_B_Setpoint: '370',
  Off_Grid_Output_Voltage_Phase_C_Setpoint: '372', Microgrid_DC_Voltage_Droop_Coefficient: '374',
  Primary_Frequency_Regulation_Frequency_Deadband: '376', Primary_Frequency_Regulation_K_Value: '378',
  VSG_Frequency_Droop_Coefficient: '380', VSG_Voltage_Droop_Coefficient: '384',
  Switch_Operation_Mode: '386',
  Battery_Overcapacity_Allowed_Charge_Voltage: '388', Battery_Overcapacity_Allowed_Discharge_Voltage: '390',
  Battery_Overcapacity_Allowed_Charge_Current: '392', Battery_Overcapacity_Allowed_Discharge_Current: '394',
  Second: '396', Minute: '398', Hour: '400', Day: '402', Month: '404', Year: '406',
  Enclosure_Fan_Start_Temperature: '408', Enclosure_Fan_Start_Time: '410',
  Enclosure_Fan_Stop_Temperature: '412', Enclosure_Fan_Stop_Time: '414',
  Enclosure_Fan_Forced_Start_Command: '416'
};
const PCS50_LABELS = {
  Fault_reset: '故障复位', Device_Start: '设备启动', Device_Shutdown: '设备停机',
  Remote_E_Stop: '远程急停', Reset_Charge_Energy: '充电电量清零', Reset_Discharge_Energy: '放电电量清零',
  Remote_Local_Setting: '远控/本控切换', Device_Standby: '设备待机', External_Switch: '外部开关',
  operating_mode: '运行模式', Constant_Voltage_Charge_Voltage_Setpoint: '恒压充电电压给定',
  Constant_Current_Charge_Current_Setpoint: '恒流充电电流给定',
  Constant_Power_Active_Power_Target: '恒功率有功功率给定', Constant_Power_Reactive_Power_Target: '恒功率无功功率给定',
  Grid_Connected_Off_Grid_Setting: '并离网设置', Off_Grid_Output_Voltage_Setpoint: '离网输出电压给定',
  Off_Grid_Output_Frequency_Setpoint: '离网输出频率给定',
  Phase_Controlled_A_Phase_Active_Power: 'A相有功功率给定', Phase_Controlled_B_Phase_Active_Power: 'B相有功功率给定',
  Phase_Controlled_C_Phase_Active_Power: 'C相有功功率给定', Phase_Controlled_A_Phase_Reactive_Power: 'A相无功功率给定',
  Phase_Controlled_B_Phase_Reactive_Power: 'B相无功功率给定', Phase_Controlled_C_Phase_Reactive_Power: 'C相无功功率给定',
  Off_Grid_Output_Voltage_Phase_A_Setpoint: 'A相输出电压给定', Off_Grid_Output_Voltage_Phase_B_Setpoint: 'B相输出电压给定',
  Off_Grid_Output_Voltage_Phase_C_Setpoint: 'C相输出电压给定',
  Microgrid_DC_Voltage_Droop_Coefficient: '直流电压下垂系数', Primary_Frequency_Regulation_Frequency_Deadband: '一次调频频率死区',
  Primary_Frequency_Regulation_K_Value: '一次调频K值', VSG_Frequency_Droop_Coefficient: 'VSG频率下垂系数',
  VSG_Voltage_Droop_Coefficient: 'VSG电压下垂系数', Switch_Operation_Mode: '开关机命令',
  Battery_Overcapacity_Allowed_Charge_Voltage: '电池/超容允许充电电压', Battery_Overcapacity_Allowed_Discharge_Voltage: '电池/超容允许放电电压',
  Battery_Overcapacity_Allowed_Charge_Current: '电池/超容允许充电电流', Battery_Overcapacity_Allowed_Discharge_Current: '电池/超容允许放电电流',
  Second: '对时-秒', Minute: '对时-分', Hour: '对时-时', Day: '对时-日', Month: '对时-月', Year: '对时-年',
  Enclosure_Fan_Start_Temperature: '柜体风机开启温度', Enclosure_Fan_Start_Time: '柜体风机开启时间',
  Enclosure_Fan_Stop_Temperature: '柜体风机停止温度', Enclosure_Fan_Stop_Time: '柜体风机停止时间',
  Enclosure_Fan_Forced_Start_Command: '柜体风机强制开启命令'
};
const PCS50_UNITS = {
  Constant_Voltage_Charge_Voltage_Setpoint: 'V', Constant_Current_Charge_Current_Setpoint: 'A',
  Constant_Power_Active_Power_Target: 'kW', Constant_Power_Reactive_Power_Target: 'kVar',
  Off_Grid_Output_Voltage_Setpoint: 'V', Off_Grid_Output_Frequency_Setpoint: 'Hz',
  Phase_Controlled_A_Phase_Active_Power: 'kW', Phase_Controlled_B_Phase_Active_Power: 'kW',
  Phase_Controlled_C_Phase_Active_Power: 'kW', Phase_Controlled_A_Phase_Reactive_Power: 'kVar',
  Phase_Controlled_B_Phase_Reactive_Power: 'kVar', Phase_Controlled_C_Phase_Reactive_Power: 'kVar',
  Off_Grid_Output_Voltage_Phase_A_Setpoint: 'V', Off_Grid_Output_Voltage_Phase_B_Setpoint: 'V',
  Off_Grid_Output_Voltage_Phase_C_Setpoint: 'V', Primary_Frequency_Regulation_Frequency_Deadband: 'Hz',
  Battery_Overcapacity_Allowed_Charge_Voltage: 'V', Battery_Overcapacity_Allowed_Discharge_Voltage: 'V',
  Battery_Overcapacity_Allowed_Charge_Current: 'A', Battery_Overcapacity_Allowed_Discharge_Current: 'A',
  Enclosure_Fan_Start_Temperature: '℃', Enclosure_Fan_Start_Time: 's',
  Enclosure_Fan_Stop_Temperature: '℃', Enclosure_Fan_Stop_Time: 's'
};
const PCS50_SCALE10 = ['346', '348', '356', '358', '360', '362', '364', '366'];
const PCS50_SCALE100 = ['354', '376'];
const PCS50_SWITCH_KEYS = ['Fault_reset', 'Device_Start', 'Device_Shutdown', 'Remote_E_Stop',
  'Reset_Charge_Energy', 'Reset_Discharge_Energy', 'Remote_Local_Setting', 'Device_Standby', 'External_Switch'];
const PCS50_MODE_OPTIONS = {
  operating_mode: [
    { label: '待机', value: '0' }, { label: '恒压', value: '1' }, { label: '恒流', value: '2' },
    { label: '恒功率', value: '3' }, { label: 'VF', value: '4' }, { label: '下垂', value: '5' }, { label: 'VSG', value: '6' }
  ],
  Grid_Connected_Off_Grid_Setting: [{ label: '并网', value: '0' }, { label: '离网', value: '1' }],
  Switch_Operation_Mode: [{ label: '待机', value: '0' }, { label: '启动', value: '1' }],
  Enclosure_Fan_Forced_Start_Command: [{ label: '自动', value: '0' }, { label: '强制开启', value: '1' }]
};

// 50kW BMS (171C_V2, deviceCategory: 171C)
const BMS50_TMS_ADDR = { B0: 331, B2: 339, B4: 343, B6: 345, B8: 347, B10: 349, B12: 351, B14: 353, B16: 355, B18: 357, B20: 359, B22: 361, B24: 363, B26: 365, B28: 367, B30: 369, B32: 371 };
const BMS50_TMS_LABELS = { B0: '心跳', B2: '绝缘检测控制', B4: 'TMS故障复位', B6: 'TMS模式选择', B8: 'TMS制冷开启值', B10: 'TMS制冷开启时间', B12: 'TMS制冷关闭值', B14: 'TMS制冷关闭时间', B16: 'TMS加热开启值', B18: 'TMS加热开启时间', B20: 'TMS加热关闭值', B22: 'TMS加热关闭时间', B24: 'TMS控温开启值', B26: 'TMS控温开启时间', B28: 'TMS控温关闭值', B30: 'TMS控温关闭时间', B32: 'TMS控湿度开启值' };
const BMS50_TMS_UNITS = { B8: '℃', B10: 's', B12: '℃', B14: 's', B16: '℃', B18: 's', B20: '℃', B22: 's', B24: '℃', B26: 's', B28: '℃', B30: 's', B32: '℃' };
const BMS50_TMS_RATIOS = { B8: 0.1, B10: 0.01, B12: 0.1, B14: 0.01, B16: 0.1, B18: 0.01, B20: 0.1, B22: 0.01, B24: 0.1, B26: 0.01, B28: 0.1, B30: 0.01 };
const BMS50_TMS_OPTIONS = {
  B2: [{ label: '开启绝缘检测', value: '0' }, { label: '关闭绝缘检测', value: '1' }, { label: '上电只检测一次绝缘', value: '2' }],
  B4: [{ label: '无请求', value: '0' }, { label: '故障复位', value: '1' }],
  B6: [{ label: '待机', value: '0' }, { label: '制冷', value: '1' }, { label: '加热', value: '2' }, { label: '自动', value: '3' }]
};
const BMS50_BIT_ADDR = { B3b0: 1077, B3b1: 1078, B3b2: 1079, B3b3: 1080, B3b4: 1081, B5b0: 1082, B5b1: 1083, B5b2: 1084, B5b3: 1085, B6: 1086, B7: 1087, B7b1: 1088, B7b2: 1089, B7b3: 1090, B7b4: 1091, B7b5: 1092, B7b6: 1093, B7b7: 1094, B6b1: 1095, B6b2: 1096, B6b3: 1097, B6b4: 1098, B6b5: 1099 };
const BMS50_BIT_LABELS = { B3b0: '上高压请求', B3b1: '下高压请求', B3b2: '紧急下电请求', B3b3: '预充请求', B3b4: '绝缘检测开关', B5b0: '请求BMS重启', B5b1: '交流断路器切断请求', B5b2: '系统锁释放', B5b3: '故障复位', B6: '强控使能位', B7: '强控HSS1', B7b1: '强控HSS2', B7b2: '强控HSS3', B7b3: '强控HSS4', B7b4: '强控HSS5', B7b5: '强控HSS6', B7b6: '强控HSS7', B7b7: '强控HSS8', B6b1: '强控LSS1', B6b2: '强控LSS2', B6b3: '强控DO1', B6b4: '强控DO2', B6b5: '强控DO3' };
const BMS50_THRESHOLD_OFFSETS = [
  { k: 'B0', off: 0, label: '单体过压级X级告警阈值', unit: 'mV', ratio: 1 },
  { k: 'B2', off: 2, label: '单体过压级X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B4', off: 4, label: '单体过压级X级释放阈值', unit: 'mV', ratio: 1 },
  { k: 'B6', off: 6, label: '单体过压级X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B8', off: 8, label: '单体欠压级X级告警阈值', unit: 'mV', ratio: 1 },
  { k: 'B10', off: 10, label: '单体欠压级X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B12', off: 12, label: '单体欠压级X级释放阈值', unit: 'mV', ratio: 1 },
  { k: 'B14', off: 14, label: '单体欠压级X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B16', off: 16, label: '单体压差X级告警阈值', unit: 'mV', ratio: 1 },
  { k: 'B18', off: 18, label: '单体压差X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B20', off: 20, label: '单体压差X级释放阈值', unit: 'mV', ratio: 1 },
  { k: 'B22', off: 22, label: '单体压差X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B24', off: 24, label: '总压过压级X级告警阈值', unit: 'V', ratio: 0.1 },
  { k: 'B26', off: 26, label: '总压过压级X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B28', off: 28, label: '总压过压级X级释放阈值', unit: 'V', ratio: 0.1 },
  { k: 'B30', off: 30, label: '总压过压级X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B32', off: 32, label: '总压欠压级X级告警阈值', unit: 'V', ratio: 0.1 },
  { k: 'B34', off: 34, label: '总压欠压级X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B36', off: 36, label: '总压欠压级X级释放阈值', unit: 'V', ratio: 0.1 },
  { k: 'B38', off: 38, label: '总压欠压级X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B40', off: 40, label: '总压压差X级告警阈值', unit: 'V', ratio: 0.1 },
  { k: 'B42', off: 42, label: '总压压差X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B44', off: 44, label: '总压压差X级释放阈值', unit: 'V', ratio: 0.1 },
  { k: 'B46', off: 46, label: '总压压差X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B48', off: 48, label: '放电过流X级告警阈值', unit: 'A', ratio: 0.1 },
  { k: 'B50', off: 50, label: '放电过流X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B52', off: 52, label: '放电过流X级释放阈值', unit: 'A', ratio: 0.1 },
  { k: 'B54', off: 54, label: '放电过流X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B56', off: 56, label: '充电过流X级告警阈值', unit: 'A', ratio: 0.1 },
  { k: 'B58', off: 58, label: '充电过流X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B60', off: 60, label: '充电过流X级释放阈值', unit: 'A', ratio: 0.1 },
  { k: 'B62', off: 62, label: '充电过流X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B64', off: 64, label: '放电高温X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B66', off: 66, label: '放电高温X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B68', off: 68, label: '放电高温X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B70', off: 70, label: '放电高温X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B72', off: 72, label: '充电高温X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B74', off: 74, label: '充电高温X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B76', off: 76, label: '充电高温X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B78', off: 78, label: '充电高温X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B80', off: 80, label: '放电低温X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B82', off: 82, label: '放电低温X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B84', off: 84, label: '放电低温X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B86', off: 86, label: '放电低温X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B88', off: 88, label: '充电低温X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B90', off: 90, label: '充电低温X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B92', off: 92, label: '充电低温X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B94', off: 94, label: '充电低温X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B96', off: 96, label: '温差X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B98', off: 98, label: '温差X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B100', off: 100, label: '温差X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B102', off: 102, label: '温差X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B104', off: 104, label: '绝缘阻值低X级告警阈值', unit: 'ohm/V', ratio: 1 },
  { k: 'B106', off: 106, label: '绝缘阻值低X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B108', off: 108, label: '绝缘阻值低X级释放阈值', unit: 'ohm/V', ratio: 1 },
  { k: 'B110', off: 110, label: '绝缘阻值低X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B112', off: 112, label: 'T1高温X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B114', off: 114, label: 'T1高温X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B116', off: 116, label: 'T1高温X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B118', off: 118, label: 'T1高温X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B120', off: 120, label: 'T2高温X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B122', off: 122, label: 'T2高温X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B124', off: 124, label: 'T2高温X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B126', off: 126, label: 'T2高温X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B128', off: 128, label: 'T3高温X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B130', off: 130, label: 'T3高温X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B132', off: 132, label: 'T3高温X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B134', off: 134, label: 'T3高温X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B136', off: 136, label: 'T4高温X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B138', off: 138, label: 'T4高温X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B140', off: 140, label: 'T4高温X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B142', off: 142, label: 'T4高温X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B144', off: 144, label: 'T5高温X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B146', off: 146, label: 'T5高温X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B148', off: 148, label: 'T5高温X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B150', off: 150, label: 'T5高温X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B152', off: 152, label: 'T6高温X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B154', off: 154, label: 'T6高温X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B156', off: 156, label: 'T6高温X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B158', off: 158, label: 'T6高温X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B160', off: 160, label: '极柱高温X级告警阈值', unit: '℃', ratio: 0.1 },
  { k: 'B162', off: 162, label: '极柱高温X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B164', off: 164, label: '极柱高温X级释放阈值', unit: '℃', ratio: 0.1 },
  { k: 'B166', off: 166, label: '极柱高温X级告警释放时间', unit: 's', ratio: 0.01 },
  { k: 'B168', off: 168, label: 'SOC低X级告警阈值', unit: '%', ratio: 0.1 },
  { k: 'B170', off: 170, label: 'SOC低X级告警触发时间', unit: 's', ratio: 0.01 },
  { k: 'B172', off: 172, label: 'SOC低X级释放阈值', unit: '%', ratio: 0.1 },
  { k: 'B174', off: 174, label: 'SOC低X级告警释放时间', unit: 's', ratio: 0.01 }
];
const BMS50_THRESHOLD_BASES = { '1级': 373, '2级': 549, '3级': 725, '4级': 901 };

// 50kW 储能DC / 光伏DC (171D_V2 / 171E_V2, deviceCategory: 171D/171E)
const STORAGE50_ENTRIES = [
  { addr: '331', label: 'BAT侧电压给定', unit: 'V', ratio: 0.1 },
  { addr: '332', label: '最大充电电流限制', unit: 'kW', ratio: 0.1 },
  { addr: '333', label: '最大放电电流限制', unit: 'A', ratio: 0.1 },
  { addr: '334', label: 'BUS侧电压给定', unit: 'V', ratio: 0.1 },
  { addr: '335', label: 'BUS侧电流给定', unit: 'A', ratio: 0.1 },
  { addr: '336', label: '下垂电压系数', unit: 'V', ratio: 0.1 },
  { addr: '337', label: '模块功能选择', switch: [{ label: 'MPPT模块', value: '0' }, { label: '双向DC/DC模块', value: '1' }] },
  { addr: '338', label: '工作模式选择', switch: [
    { label: 'BUS侧恒压', value: '1' }, { label: 'BUS侧恒流', value: '2' },
    { label: 'BAT侧恒压', value: '3' }, { label: 'BAT侧恒流', value: '4' }, { label: 'BAT侧恒功率', value: '5' }
  ]},
  { addr: '339', label: '模块并联均流', switch: [
    { label: '无均流', value: '0' }, { label: '均流方式1', value: '1' },
    { label: '均流方式2', value: '2' }, { label: '均流方式3', value: '3' }
  ]},
  { addr: '340', label: '最大功率限制', unit: 'kW', ratio: 0.1 },
  { addr: '341', label: 'BAT侧欠压保护点', unit: 'V', ratio: 0.1 },
  { addr: '342', label: 'BAT侧过压保护点', unit: 'V', ratio: 0.1 },
  { addr: '343', label: 'BUS侧欠压保护点', unit: 'V', ratio: 0.1 },
  { addr: '344', label: 'BUS侧过压保护点', unit: 'V', ratio: 0.1 },
  { addr: '345', label: 'BAT侧充电过流保护点', unit: 'A', ratio: 0.1 },
  { addr: '346', label: 'BAT侧放电过流保护点', unit: 'A', ratio: 0.1 },
  { addr: '347', label: 'BUS侧充电过流保护点', unit: 'A', ratio: 0.1 },
  { addr: '348', label: 'BUS侧放电过流保护点', unit: 'A', ratio: 0.1 },
  { addr: '362', label: '启动指令', switch: [{ label: '启动', value: '1' }, { label: '停机', value: '2' }, { label: '复位', value: '3' }] }
];

// 50kW 快捷控制 (171F_V2, deviceCategory: 171F)
const QUICK50_BASE = 331;
const QUICK50_OPTIONS = {
  B0: [{ label: '否', value: '0' }, { label: '是', value: '1' }],
  B2: [{ label: '不启用', value: '0' }, { label: '开机', value: '1' }, { label: '关机', value: '2' }],
  B4: [
    { label: '不启用', value: '0' }, { label: '并网一键开机', value: '1' },
    { label: '一键关机', value: '2' }, { label: '离网一键开机', value: '3' }
  ],
  B6: [{ label: '不充不放', value: '0' }, { label: '充电', value: '1' }, { label: '放电', value: '2' }],
  B12: [{ label: '默认', value: '0' }, { label: '开启', value: '1' }],
  B14: [
    { label: '峰谷', value: '0' }, { label: '自发自用', value: '3' },
    { label: '电池优先', value: '4' }, { label: '削峰填谷', value: '5' },
    { label: '售卖优先', value: '6' }, { label: '限制消费', value: '7' },
    { label: '零出口', value: '8' }, { label: '防逆流', value: '9' }
  ]
};
const QUICK50_LABELS = {
  B0: 'PCS一键开机', B2: '光伏DC开机', B4: '储能DC开关机', B6: '储能充放电选择',
  B8: '充放电总功率', B12: '启动按钮', B14: '运行策略'
};
const QUICK50_POWER_KEYS = ['B8'];
const QUICK50_RANGE = ['B0','B2','B4','B6','B8','B10','B12','B14','B16','B18','B20','B22','B24','B26','B28','B30','B32','B34','B36','B38','B40','B42','B44','B46','B48','B50','B52'];

// 50kW 液冷机 (0318_V2_3, deviceCategory: 0318)
const LIQUID50_ENTRIES = [
  { addr: '331', label: '启动方式', switch: [{ label: '手动', value: '0' }, { label: '自动', value: '1' }] },
  { addr: '333', label: '工作模式', switch: [
    { label: '待机', value: '0' }, { label: '制冷', value: '1' }, { label: '加热', value: '2' }, { label: '自循环', value: '3' }, { label: '自动', value: '4' }
  ]},
  { addr: '335', label: '供回水温度控制目标', switch: [{ label: '供水', value: '0' }, { label: '回水', value: '1' }] },
  { addr: '337', label: '制冷温度设定', unit: '℃', ratio: 0.1 },
  { addr: '339', label: '制冷温度回差', unit: '℃', ratio: 0.1 },
  { addr: '341', label: '加热温度设定', unit: '℃', ratio: 0.1 },
  { addr: '343', label: '加热温度回差', unit: '℃', ratio: 0.1 },
  { addr: '345', label: '温控泵转速' },
  { addr: '347', label: '循环泵转速' },
  { addr: '349', label: '液体温度高', unit: '℃', ratio: 0.1 },
  { addr: '351', label: '液体温度低', unit: '℃', ratio: 0.1 },
  { addr: '353', label: '回水压力低', unit: 'kPa' },
  { addr: '355', label: '供水压力高', unit: 'kPa' },
  { addr: '357', label: '供水压力报警值', unit: 'kPa' },
  { addr: '359', label: '供水压力报警回差', unit: 'kPa' },
  { addr: '363', label: 'Modbus地址' },
  { addr: '365', label: '波特率', switch: [{ label: '9600', value: '0' }, { label: '4800', value: '1' }, { label: '19200', value: '2' }] }
];

// 运行时构建 50kW 设备参数表（按地址索引）
function build50kWDeviceParams() {
  const pcs = {};
  for (const key in PCS50_ADDR) {
    const addr = PCS50_ADDR[key];
    const entry = { address: addr, label: PCS50_LABELS[key] || key };
    if (PCS50_SCALE10.includes(addr)) entry.ratio = 0.1;
    if (PCS50_SCALE100.includes(addr)) entry.ratio = 0.01;
    if (PCS50_UNITS[key]) entry.unit = PCS50_UNITS[key];
    if (PCS50_SWITCH_KEYS.includes(key)) { entry.type = 'switch'; entry.valueMap = { '0': '不执行', '1': '执行' }; }
    if (PCS50_MODE_OPTIONS[key]) { entry.type = 'switch'; entry.valueMap = {}; PCS50_MODE_OPTIONS[key].forEach(o => entry.valueMap[o.value] = o.label); }
    pcs[addr] = entry;
  }

  const bms = {};
  // TMS 段
  for (const k in BMS50_TMS_ADDR) {
    const addr = String(BMS50_TMS_ADDR[k]);
    const entry = { address: addr, label: BMS50_TMS_LABELS[k] || k };
    if (BMS50_TMS_RATIOS[k] !== undefined) entry.ratio = BMS50_TMS_RATIOS[k];
    if (BMS50_TMS_UNITS[k]) entry.unit = BMS50_TMS_UNITS[k];
    if (BMS50_TMS_OPTIONS[k]) { entry.type = 'switch'; entry.valueMap = {}; BMS50_TMS_OPTIONS[k].forEach(o => entry.valueMap[o.value] = o.label); }
    bms[addr] = entry;
  }
  // bit 段
  for (const k in BMS50_BIT_ADDR) {
    const addr = String(BMS50_BIT_ADDR[k]);
    bms[addr] = { address: addr, label: BMS50_BIT_LABELS[k] || k, type: 'switch', valueMap: { '0': '无请求/不强控', '1': '请求/强控' } };
  }
  // 告警阈值 4 段
  for (const level in BMS50_THRESHOLD_BASES) {
    const base = BMS50_THRESHOLD_BASES[level];
    BMS50_THRESHOLD_OFFSETS.forEach(info => {
      const addr = String(base + info.off);
      const label = info.label.replace('X级', level);
      bms[addr] = { address: addr, label: label, unit: info.unit, ratio: info.ratio };
    });
  }

  const storage = {};
  STORAGE50_ENTRIES.forEach(e => {
    const entry = { address: e.addr, label: e.label };
    if (e.unit) entry.unit = e.unit;
    if (e.ratio !== undefined) entry.ratio = e.ratio;
    if (e.switch) { entry.type = 'switch'; entry.valueMap = {}; e.switch.forEach(o => entry.valueMap[o.value] = o.label); }
    storage[e.addr] = entry;
  });

  const quick = {};
  QUICK50_RANGE.forEach(key => {
    const num = Number(key.slice(1));
    const addr = String(QUICK50_BASE + num);
    const label = QUICK50_LABELS[key] || key;
    const entry = { address: addr, label: label };
    if (QUICK50_OPTIONS[key]) { entry.type = 'switch'; entry.valueMap = {}; QUICK50_OPTIONS[key].forEach(o => entry.valueMap[o.value] = o.label); }
    if (QUICK50_POWER_KEYS.includes(key)) { entry.ratio = 0.1; entry.unit = 'kW'; }
    quick[addr] = entry;
  });

  const liquid = {};
  LIQUID50_ENTRIES.forEach(e => {
    const entry = { address: e.addr, label: e.label };
    if (e.unit) entry.unit = e.unit;
    if (e.ratio !== undefined) entry.ratio = e.ratio;
    if (e.switch) { entry.type = 'switch'; entry.valueMap = {}; e.switch.forEach(o => entry.valueMap[o.value] = o.label); }
    liquid[e.addr] = entry;
  });

  return { pcs, bms, storage, quick, liquid };
}

const kW50Params = build50kWDeviceParams();

export const deviceParams = {
  // 50kW 新协议（十进制地址）—— 按 deviceCategory + 地址格式优先匹配
  pcs_1707_V3_5: kW50Params.pcs,
  bms_171C_V2: kW50Params.bms,
  storage_171D_V2: kW50Params.storage, // 同时用于 171E 光伏DC（点表同一份）
  pv_171E_V2: kW50Params.storage,
  quick_171F_V2: kW50Params.quick,
  liquid_0318: kW50Params.liquid,

  // 171F设备参数
  _171F: {
    // 快捷控制参数
    '100': {
      label: '储能DC一键控制',
      type: 'switch',
      valueMap: {
        '0': '不启用',
        '1': '一键开机',
        '2': '关机'
      }
    },
    '102': {
      label: 'PCS模式选择',
      type: 'switch',
      valueMap: {
        '0': '不启用',
        '1': '并网充电',
        '2': '并网放电',
        '3': '离网'
      }
    },
    '104': { label: '充电功率设置', unit: 'kW', ratio: 0.1 },
    '106': { label: '放电功率设置', unit: 'kW', ratio: 0.1 },
    '108': {
      label: 'PCS开关机',
      type: 'switch',
      valueMap: {
        '0': '不启用',
        '1': '开机',
        '2': '关机'
      }
    },
    '110': {
      label: '光伏DC控制',
      type: 'switch',
      valueMap: {
        '0': '不启用',
        '1': '一键开机',
        '2': '关机'
      }
    },
    '112': {
      label: '运行策略总开关', type: 'switch', valueMap: {
        '0': '默认',
        '1': '开启',
      }
    },
    '114': {
      label: '运行策略',
      type: 'switch',
      valueMap: {
        '0': '峰谷',
        '1': '恒限功率',
        '2': '柔度',
        '3': '自发自用',
        '4': '电池优先',
        '5': '削峰填谷',
        '6': '售卖优先',
        '7': '限制消费',
        '8': '零出口',
        '9': '防逆流',
        '10': 'AI调度'
      }
    },
    // 设置参数
  },
  // 171B设备参数
  pcs_171B: {
    '0x0077': { address: '0x0077', registerAddress: '40', label: '设置直流侧电压', unit: 'V', ratio: 0.001 },
    '0x0079': { address: '0x0079', registerAddress: '44', label: '设置直流侧电流', unit: 'A', ratio: 0.001 },
    '0x0080': { address: '0x0080', registerAddress: '48', label: '设置交流侧总有功功率', unit: 'kW', ratio: 0.01 },
    '0x0087': { address: '0x0087', registerAddress: '72', label: '设置直流欠压保护电压', unit: 'V', ratio: 0.1 },
    '0x0088': { address: '0x0088', registerAddress: '76', label: '设置直流过压保护电压', unit: 'V', ratio: 0.1 },
    '0x0089': { address: '0x0089', registerAddress: '80', label: '设置一级交流欠压保护', unit: 's', ratio: 0.01 },
    '0x008A': { address: '0x008A', registerAddress: '84', label: '设置一级交流过压保护', unit: 's', ratio: 0.01 },
    '0x008B': { address: '0x008B', registerAddress: '88', label: '设置一级交流欠频保护', unit: 's', ratio: 0.01 },
    '0x008C': { address: '0x008C', registerAddress: '92', label: '设置一级交流过频保护', unit: 's', ratio: 0.01 },
    '0x008D': { address: '0x008D', registerAddress: '96', label: '设置二级交流欠频保护', unit: 's', ratio: 0.01 },
    '0x008E': { address: '0x008E', registerAddress: '100', label: '设置二级交流过频保护', unit: 's', ratio: 0.01 },
    '0x0090': { address: '0x0090', registerAddress: '108', label: '设置二级交流欠压保护', unit: 's', ratio: 0.01 },
    '0x0091': { address: '0x0091', registerAddress: '112', label: '设置二级交流过压保护', unit: 's', ratio: 0.01 },
    '0x0024': {
      address: '0x0024', registerAddress: '12', label: '设置离网模式交流侧欠压复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x0025': {
      address: '0x0025', registerAddress: '16', label: '设置整流模式直流侧欠压复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x002F': {
      address: '0x002F', registerAddress: '20', label: '设置模块工作模式', type: 'switch', valueMap: {
        '0x00000000': '并网模式',
        '0x00010000': '离网模式',
        '0x00020000': '整流模式',
      }
    },
    '0x0030': {
      address: '0x0030', registerAddress: '24', label: '设置模块开关机', type: 'switch', valueMap: {
        '0x00000000': '开机',
        '0x00010000': '关机',
      }
    },
    '0x0031': {
      address: '0x0031', registerAddress: '28', label: '设置模块直流侧过压复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x0042': {
      address: '0x0042', registerAddress: '32', label: '设置逆变模式直流侧欠压复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x0044': {
      address: '0x0044', registerAddress: '36', label: '设置模块短路复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    }
  },
  pv_171E: {
    '0x0017': { address: '0x0017', registerAddress: '0', label: '设置模块工作海拔值', unit: 'm', ratio: 1 },
    '0x001B': { address: '0x001B', registerAddress: '4', label: '设置模块输出电流值', unit: 'A', ratio: 0.000977 },
    '0x001E': { address: '0x001E', registerAddress: '8', label: '设置组号', unit: '', ratio: 1 },
    '0x0020': { address: '0x0020', registerAddress: '16', label: '设置模块输出功率', unit: 'kW', ratio: 0.05 },
    '0x0021': { address: '0x0021', registerAddress: '20', label: '设置模块输出电压', unit: 'V', ratio: 1 },
    '0x0022': { address: '0x0022', registerAddress: '24', label: '设置模块限流点', unit: 'A', ratio: 1 },
    '0x0023': { address: '0x0023', registerAddress: '28', label: '设置模块输出电压上限值', unit: 'V', ratio: 1 },
    '0x001F': {
      address: '0x001F', registerAddress: '12', label: '设置模块地址分配方式', type: 'switch', valueMap: {
        '0x00000000': '自动分配',
        '0x00010000': ':拨码设置',
      }
    },
    '0x0030': {
      address: '0x0030', registerAddress: '32', label: '开关机', type: 'switch', valueMap: {
        '0x00000000': '开机',
        '0x00010000': '关机',
      }
    },
    '0x0031': {
      address: '0x0031', registerAddress: '36', label: '设置模块过压复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x003E': {
      address: '0x003E', registerAddress: '40', label: '设置模块输出过压保护关联是否允许', type: 'switch', valueMap: {
        '0x00000000': '允许',
        '0x00010000': '禁止',
      }
    },
    '0x0044': {
      address: '0x0044', registerAddress: '44', label: '设置模块短路复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x0046': {
      address: '0x0046', registerAddress: '48', label: '设置模块输入模式', type: 'switch', valueMap: {
        '0x00000001': '交流模式',
        '0x00000002': '直流模式',
      }
    }
  },
  storage_171D: {
    '60040': { address: '60040', registerAddress: '22', label: '直流母线电压', unit: 'V', ratio: 0.1 },
    '60043': { address: '60043', registerAddress: '26', label: '充放电功率设定', unit: '%', ratio: 0.1 },
    '60044': { address: '60044', registerAddress: '28', label: '电池均充电压', unit: 'V', ratio: 0.1 },
    '60045': { address: '60045', registerAddress: '30', label: '充电电流设置', unit: 'A', ratio: 0.1 },
    '60046': { address: '60046', registerAddress: '32', label: '电池浮充电压', unit: 'V', ratio: 0.1 },
    '60047': { address: '60047', registerAddress: '34', label: '放电电压设置', unit: 'V', ratio: 0.1 },
    '60048': { address: '60048', registerAddress: '36', label: '放电电流设置', unit: 'A', ratio: 0.1 },
    '60049': { address: '60049', registerAddress: '38', label: '电池过压关机点', unit: 'V', ratio: 0.1 },
    '60050': { address: '60050', registerAddress: '40', label: '电池欠压告警点', unit: 'V', ratio: 0.1 },
    '60051': { address: '60051', registerAddress: '42', label: '电池欠压关机点', unit: 'V', ratio: 0.1 },
    '60054': { address: '60054', registerAddress: '48', label: '充电母线电压上限', unit: 'V', ratio: 0.1 },
    '60055': { address: '60055', registerAddress: '49', label: '放电母线电压下限', unit: 'V', ratio: 0.1 },
    '60019': {
      address: '60019', registerAddress: '6', label: '故障清除', type: 'switch', valueMap: {
        '0x0055': '清除所有故障',
      }
    },
    '60021': {
      address: '60021', registerAddress: '10', label: '运行状态设置', type: 'switch', valueMap: {
        '0': '自适应',
        '1': '并网',
        '2': '离网',
      }
    },
    '60022': {
      address: '60022', registerAddress: '12', label: '系统开关机', type: 'switch', valueMap: {
        '0x0055': '开机',
        '0x00AA': '关机',
      }
    },
    '60042': {
      address: '60042', registerAddress: '24', label: '充放电指令', type: 'switch', valueMap: {
        '0': '待机',
        '1': '充电',
        '2': '放电',
        '3': 'BAT自动切换',
        '4': 'BUS自动切换',
        '5': '关充电',
        '6': '高压PV模式',
        '7': '低压PV模式',
      }
    }
  },
  bms_171C: {
    '1': { label: '组端过压 1 级报警阈值', unit: 'V', ratio: 0.1 },
    '2': { label: '组端过压 2 级报警阈值', unit: 'V', ratio: 0.1 },
    '3': { label: '组端过压 3 级报警阈值', unit: 'V', ratio: 0.1 },
    '4': { label: '组端过压报警回差值', unit: 'V', ratio: 0.1 },
    '5': { label: '组端欠压 1 级报警阈值', unit: 'V', ratio: 0.1 },
    '6': { label: '组端欠压 2 级报警阈值', unit: 'V', ratio: 0.1 },
    '7': { label: '组端欠压 3 级报警阈值', unit: 'V', ratio: 0.1 },
    '8': { label: '组端欠压报警回差值', unit: 'V', ratio: 0.1 },
    '9': { label: '组端放电过流 1 级报警阈值', unit: 'A', ratio: 0.1 },
    '10': { label: '组端放电过流 2 级报警阈值', unit: 'A', ratio: 0.1 },
    '11': { label: '组端放电过流 3 级报警阈值', unit: 'A', ratio: 0.1 },
    '12': { label: '组端放电过流报警回差值', unit: 'A', ratio: 0.1 },
    '13': { label: '组端充电过流 1 级报警阈值', unit: 'A', ratio: 0.1 },
    '14': { label: '组端充电过流 2 级报警阈值', unit: 'A', ratio: 0.1 },
    '15': { label: '组端充电过流 3 级报警阈值', unit: 'A', ratio: 0.1 },
    '16': { label: '组端充电过流报警回差值', unit: 'A', ratio: 0.1 },
    '17': { label: '组端绝缘 1 级报警阈值', unit: 'kΩ', ratio: 0.1 },
    '18': { label: '组端绝缘 2 级报警阈值', unit: 'kΩ', ratio: 0.1 },
    '19': { label: '组端绝缘 3 级报警阈值', unit: 'kΩ', ratio: 0.1 },
    '20': { label: '组端绝缘报警回差值', unit: 'kΩ', ratio: 0.1 },
    '21': { label: '单体充电过温 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '22': { label: '单体充电过温 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '23': { label: '单体充电过温 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '24': { label: '电池充电过温报警回差值', unit: '℃', ratio: 0.1 },
    '25': { label: '单体充电欠温 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '26': { label: '单体充电欠温 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '27': { label: '单体充电欠温 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '28': { label: '单体充电欠温报警回差值', unit: '℃', ratio: 0.1 },
    '29': { label: '单体电压过压 1 级报警阈值', unit: 'mV', ratio: 1 },
    '30': { label: '单体电压过压 2 级报警阈值', unit: 'mV', ratio: 1 },
    '31': { label: '单体电压过压 3 级报警阈值', unit: 'mV', ratio: 1 },
    '32': { label: '单体电压过压报警回差值', unit: 'mV', ratio: 1 },
    '33': { label: '单体电压欠压 1 级报警阈值', unit: 'mV', ratio: 1 },
    '34': { label: '单体电压欠压 2 级报警阈值', unit: 'mV', ratio: 1 },
    '35': { label: '单体电压欠压 3 级报警阈值', unit: 'mV', ratio: 1 },
    '36': { label: '单体电压欠压报警回差值', unit: 'mV', ratio: 1 },
    '37': { label: '单体电压差压 1 级报警阈值', unit: 'mV', ratio: 1 },
    '38': { label: '单体电压差压 2 级报警阈值', unit: 'mV', ratio: 1 },
    '39': { label: '单体电压差压 3 级报警阈值', unit: 'mV', ratio: 1 },
    '40': { label: '单体电压差压报警回差值', unit: 'mV', ratio: 1 },
    '41': { label: '单体温度温差 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '42': { label: '单体温度温差 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '43': { label: '单体温度温差 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '44': { label: '单体温度温差报警回差值', unit: '℃', ratio: 0.1 },
    '45': { label: 'SOC 过低 1 级报警阈值', unit: '%', ratio: 0.1 },
    '46': { label: 'SOC 过低 2 级报警阈值', unit: '%', ratio: 0.1 },
    '47': { label: 'SOC 过低 3 级报警阈值', unit: '%', ratio: 0.1 },
    '48': { label: 'SOC 过低报警回差值', unit: '%', ratio: 0.1 },
    '49': { label: '动力插箱温度过高 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '50': { label: '动力插箱温度过高 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '51': { label: '动力插箱温度过高 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '52': { label: '动力插箱温度过高报警回差值', unit: '℃', ratio: 0.1 },
    '53': { label: '电池模组过压 1 级报警阈值', unit: 'V', ratio: 0.1 },
    '54': { label: '电池模组过压 2 级报警阈值', unit: 'V', ratio: 0.1 },
    '55': { label: '电池模组过压 3 级报警阈值', unit: 'V', ratio: 0.1 },
    '56': { label: '电池模组过压报警回差值', unit: 'V', ratio: 0.1 },
    '57': { label: '电池模组欠压 1 级报警阈值', unit: 'V', ratio: 0.1 },
    '58': { label: '电池模组欠压 2 级报警阈值', unit: 'V', ratio: 0.1 },
    '59': { label: '电池模组欠压 3 级报警阈值', unit: 'V', ratio: 0.1 },
    '60': { label: '电池模组欠压报警回差值', unit: 'V', ratio: 0.1 },
    '61': { label: '单体放电过温 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '62': { label: '单体放电过温 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '63': { label: '单体放电过温 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '64': { label: '单体放电过温报警回差值', unit: '℃', ratio: 0.1 },
    '65': { label: '单体放电欠温 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '66': { label: '单体放电欠温 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '67': { label: '单体放电欠温 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '68': { label: '电池放电欠温报警回差值', unit: '℃', ratio: 0.1 },
    '69': { label: 'SOC 过高 1 级报警阈值', unit: '%', ratio: 0.1 },
    '70': { label: 'SOC 过高 2 级报警阈值', unit: '%', ratio: 0.1 },
    '71': { label: 'SOC 过高 3 级报警阈值', unit: '%', ratio: 0.1 },
    '72': { label: 'SOC 过高报警回差值', unit: '%', ratio: 0.1 },
    '73': { label: '温升快 1 级报警阈值', unit: '℃/min', ratio: 0.1 },
    '74': { label: '温升快 2 级报警阈值', unit: '℃/min', ratio: 0.1 },
    '75': { label: '温升快 3 级报警阈值', unit: '℃/min', ratio: 0.1 },
    '76': { label: '温升快报警回差值', unit: '℃/min', ratio: 0.1 },
    '102': { label: '风扇启动温度', unit: '℃', ratio: 1 },
    '103': { label: '风扇关闭温度', unit: '℃', ratio: 1 },
    '104': { label: 'SOC/SOH 设置电池序号', unit: '' },
    '105': { 
      label: 'SOC/SOH 设置', 
      unit: '%', 
      type: 'combined', 
      modeOptions: [{ label: 'SOC', value: '1' }, { label: 'SOH', value: '2' }], 
      min: 0, 
      max: 100,
      transform: (val) => {
        const num = typeof val === 'string' ? parseInt(val, 16) : val
        const highByte = (num >> 8) & 0xFF
        const lowByte = num & 0xFF
        const mode = highByte === 1 ? 'SOC' : highByte === 2 ? 'SOH' : '--'
        return mode !== '--' ? `${mode}: ${lowByte}%` : '--'
      }
    },
    '107': { label: '可调风扇控制-占空比', unit: '%', ratio: 0.1 },
    '112': { 
      label: '累计充电电量', 
      unit: 'kWh', 
      type: 'combined',
      highAddress: '112', 
      lowAddress: '113',
      ratio: 0.1, 
      hex16: true,
      min: 0,
      max: 4294967295
    },
    '113': { 
      label: '累计充电电量', 
      unit: 'kWh', 
      type: 'combined',
      highAddressRef: '112',
      ratio: 0.1, 
      hex16: true 
    },
    '114': { 
      label: '累计放电电量', 
      unit: 'kWh', 
      type: 'combined',
      highAddress: '114', 
      lowAddress: '115',
      ratio: 0.1, 
      hex16: true,
      min: 0,
      max: 4294967295
    },
    '115': { 
      label: '累计放电电量', 
      unit: 'kWh', 
      type: 'combined',
      highAddressRef: '114',
      ratio: 0.1, 
      hex16: true 
    },
    '117': { label: '电池容量', unit: 'Ah', ratio: 1 },
    '118': { label: '电传感器量程 1', unit: '' },
    '119': { label: '电传感器量程 2', unit: '' },
    '120': { label: '电传感器量程 3', unit: '' },
    '121': { label: '簇内电池节数', unit: '' },
    '122': { label: '簇内电压个数', unit: '' },
    '123': { label: '簇内从控模块个数', unit: '' },
    '124': { label: '从控 1~48 的电压个数', unit: '' },
    '172': { label: '从控 1~48 的温度个数', unit: '' },
    '220': { label: '从控站址自动分配', unit: '' },
    '101': {
      label: 'DO 控制', type: 'switch', valueMap: {
        '1': '闭合',
        '0': '断开',
      }
    },
    '106': {
      label: '绝缘采集控制', type: 'switch', valueMap: {
        '1': '开启绝缘采集',
        '0': '关闭绝缘采集',
        '2': '无效值，主控自主控制',

      }
    },
    '108': {
      label: '复归指令', type: 'switch', valueMap: {
        '1': '复归',
        '0': '默认状态',
      }
    },
    '109': {
      label: '跳机指令', type: 'switch', valueMap: {
        '1': '跳机',
        '0': '默认状态',
      }
    },
    '110': {
      label: '显控检测故障', type: 'switch', valueMap: {
        '0': '无故障',
        '1': '有故障',
      }
    },

    '111': {
      label: '主控均衡控制', type: 'switch', valueMap: {
        '1': '开启',
        '0': '关闭',
        '2': '主控自主控制',
      }
    },

    '116': {
      label: '电池类型', type: 'switch', valueMap: {
        '1': '磷酸铁锂电池',
        '2': '钛酸锂电池',
        '3': '锰酸锂电池',
        '4': '三元电池'
      }
    }
  }
}





export const deviceCategoryMap = {
  '171F': '_171F',
  '171B': 'pcs_171B',
  '171E': 'pv_171E',
  '171D': 'storage_171D',
  '171C': 'bms_171C'
}

export function getDeviceKey(deviceCategory, registerAddress) {
  // 50kW 新协议用十进制地址（不以 '0x' 开头），20kW 旧协议用 0x hex 地址
  const isNewAddr = registerAddress && !String(registerAddress).toLowerCase().startsWith('0x');
  if (deviceCategory === '171B' || deviceCategory === 'PCS') return isNewAddr ? 'pcs_1707_V3_5' : 'pcs_171B';
  if (deviceCategory === '171C' || deviceCategory === 'BMS') return 'bms_171C_V2'; // BMS 新地址表全覆盖，直接用新表
  if (deviceCategory === '171D' || deviceCategory === '储能DC') return isNewAddr ? 'storage_171D_V2' : 'storage_171D';
  if (deviceCategory === '171E' || deviceCategory === '光伏DC') return isNewAddr ? 'pv_171E_V2' : 'pv_171E';
  if (deviceCategory === '171F' || deviceCategory === 'EMS') {
    // 旧协议 171F 地址范围约 100~150（也是十进制不带 0x），新协议 quick_171F_V2 从 331 起，用数值范围区分
    const addrNum = Number(registerAddress);
    if (!isNaN(addrNum) && addrNum >= 331) return 'quick_171F_V2';
    return '_171F';
  }
  if (deviceCategory === '0318') return 'liquid_0318';
  return '';
}

export function getParamInfo(deviceCategory, registerAddress) {
  // 优先按 deviceCategory + 地址格式区分 20kW/50kW
  const categoryKey = getDeviceKey(deviceCategory, registerAddress);
  const deviceParamsMap = deviceParams[categoryKey] || {}

  if (categoryKey && Object.keys(deviceParamsMap).length > 0) {
    // 50kW 新协议表（pcs_1707_V3_5 / bms_171C_V2 / storage_171D_V2 / pv_171E_V2 / quick_171F_V2 / liquid_0318）
    // 和 20kW pcs_171B / pv_171E / storage_171D：按 address 字段搜索
    if (['pcs_1707_V3_5', 'bms_171C_V2', 'storage_171D_V2', 'pv_171E_V2', 'quick_171F_V2', 'liquid_0318',
         'pcs_171B', 'pv_171E', 'storage_171D'].includes(categoryKey)) {
      for (const key in deviceParamsMap) {
        const entry = deviceParamsMap[key]
        if (entry.address === registerAddress) return entry
        if (entry.registerAddress && entry.registerAddress === registerAddress) return entry
      }
    } else {
      // _171F / bms_171C：直接用 field 作为 key 查找
      if (deviceParamsMap[registerAddress]) return deviceParamsMap[registerAddress]
    }
  }

  // 全局 fallback
  for (const dk in deviceParams) {
    const map = deviceParams[dk]
    if (!map || Object.keys(map).length === 0) continue
    // 50kW 和 20kW pcs/pv/storage：按 address 字段匹配
    if (['pcs_1707_V3_5', 'bms_171C_V2', 'storage_171D_V2', 'pv_171E_V2', 'quick_171F_V2', 'liquid_0318',
         'pcs_171B', 'pv_171E', 'storage_171D'].includes(dk)) {
      for (const key in map) {
        const entry = map[key]
        if (entry.address === registerAddress) return entry
        if (entry.registerAddress && entry.registerAddress === registerAddress) return entry
      }
    } else if (map[registerAddress]) {
      return map[registerAddress]
    }
  }

  return null
}