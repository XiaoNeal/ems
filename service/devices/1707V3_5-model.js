import DeviceBase from "./device-base.model"

// 1707 V3.5 PCS 储能变流器设备Model
// 与网页版 micro-energy-station 1707_v3_5-model.js 对齐：
// camelCase 字段键、云端 JSON 已预缩放（本地不做二次缩放）、单位挂在字段定义上
export class Model1707V3_5 extends DeviceBase {
    constructor() {
        super()
        this.energyData = new EnergyData()
        this.stateData = new StatusData()
    }

    getEnergyData(data) {
        if (!data) return
        this.energyData.Fault_reset.value = data.B0b0; // 故障复位
        this.energyData.Device_Start.value = data.B0b1; // 设备启动
        this.energyData.Device_Shutdown.value = data.B0b2; // 设备停机
        this.energyData.Remote_E_Stop.value = data.B0b3; // 远程急停
        this.energyData.Reset_Charge_Energy.value = data.B0b4; // 累计充电电量清零
        this.energyData.Reset_Discharge_Energy.value = data.B0b5; // 累计放电电量清零
        this.energyData.Remote_Local_Setting.value = data.B0b6; // 远程就地设置
        this.energyData.Device_Standby.value = data.B0b7; // 设备待机
        this.energyData.External_Switch.value = data.B1b0; // 外部电操开关
        this.energyData.Shutdown_Status.value = data.B2b0; // 停机状态
        this.energyData.Standby_Status.value = data.B2b1; // 待机状态
        this.energyData.Operation_Status.value = data.B2b2; // 运行状态
        this.energyData.Total_Fault_Status.value = data.B2b3; // 总故障状态
        this.energyData.Total_Alarm_Status.value = data.B2b4; // 总报警状态
        this.energyData.Remote_Local_Status.value = data.B2b5; // 远程就地状态
        this.energyData.E_Stop_Input_Status.value = data.B2b6; // 急停输入状态
        this.energyData.Grid_Connected_Status.value = data.B2b7; // 并网状态
        this.energyData.VF_Off_Grid_Status.value = data.B3b0; // VF离网状态
        this.energyData.Overload_Derating.value = data.B3b1; // 过载降容
        this.energyData.BMS_Dry_Contact_Input.value = data.B3b5; // BMS干接点输入
        this.energyData.PCS_Port_A_Voltage.value = data.B4; // PCS端口A相电压
        this.energyData.PCS_Port_B_Voltage.value = data.B6; // PCS端口B相电压
        this.energyData.PCS_Port_C_Voltage.value = data.B8; // PCS端口C相电压
        this.energyData.PCS_Output_A_Current.value = data.B10; // PCS输出A相电流
        this.energyData.PCS_Output_B_Current.value = data.B12; // PCS输出B相电流
        this.energyData.PCS_Output_C_Current.value = data.B14; // PCS输出C相电流
        this.energyData.Grid_Frequency.value = data.B16; // 电网频率
        this.energyData.PCS_A_Active_Power.value = data.B18; // PCSA相输出有功功率
        this.energyData.PCS_B_Active_Power.value = data.B20; // PCSB相输出有功功率
        this.energyData.PCS_C_Active_Power.value = data.B22; // PCSC相输出有功功率
        this.energyData.PCS_Total_Active_Power.value = data.B24; // PCS总输出有功功率
        this.energyData.PCS_A_Reactive_Power.value = data.B26; // PCSA相输出无功功率
        this.energyData.PCS_B_Reactive_Power.value = data.B28; // PCSB相输出无功功率
        this.energyData.PCS_C_Reactive_Power.value = data.B30; // PCSC相输出无功功率
        this.energyData.PCS_Total_Reactive_Power.value = data.B32; // PCS总输出无功功率
        this.energyData.PCS_A_Apparent_Power.value = data.B34; // PCSA相输出视在功率
        this.energyData.PCS_B_Apparent_Power.value = data.B36; // PCSB相输出视在功率
        this.energyData.PCS_C_Apparent_Power.value = data.B38; // PCSC相输出视在功率
        this.energyData.PCS_Total_Apparent_Power.value = data.B40; // PCS总输出视在功率
        this.energyData.PCS_A_Power_Factor.value = data.B42; // PCS输出A相功率因数
        this.energyData.PCS_B_Power_Factor.value = data.B44; // PCS输出B相功率因数
        this.energyData.PCS_C_Power_Factor.value = data.B46; // PCS输出C相功率因数
        this.energyData.PCS_Total_Power_Factor.value = data.B48; // PCS输出总功率因数
        this.energyData.PCS_Input_Power.value = data.B50; // PCS输入功率
        this.energyData.PCS_Input_Voltage.value = data.B52; // PCS输入电压
        this.energyData.PCS_Input_Current.value = data.B54; // PCS输入电流
        this.energyData.PCS_Cooler_Temp.value = data.B56; // PCS散热器温度
        this.energyData.PCS_AC_Charge_Energy.value = data.B62; // PCS交流累计充电电量
        this.energyData.PCS_AC_Discharge_Energy.value = data.B66; // PCS交流累计放电电量
        this.energyData.PCS_DC_Charge_Energy.value = data.B70; // PCS直流累计充电电量
        this.energyData.PCS_DC_Discharge_Energy.value = data.B74; // PCS直流累计放电电量
        this.energyData.PCS_Communication_Status.value = data.B78; // PCS通讯状态字
        this.energyData.System_Clock_Sec.value = data.B80; // 系统时钟-秒
        this.energyData.System_Clock_Min.value = data.B82; // 系统时钟-分
        this.energyData.System_Clock_Hour.value = data.B84; // 系统时钟-时
        this.energyData.System_Clock_Day.value = data.B86; // 系统时钟-日
        this.energyData.System_Clock_Month.value = data.B88; // 系统时钟-月
        this.energyData.System_Clock_Year.value = data.B90; // 系统时钟-年
        this.energyData.PCS_Program_Version.value = data.B92; // PCS程序版本
        this.energyData.FPGA_Program_Version.value = data.B94; // FPGA程序版本
        this.energyData.N_Phase_RMS_Current.value = data.B96; // N相电流有效值
        this.energyData.PCS_Status_Code_1.value = data.B98; // PCS状态查询码1
        this.energyData.PCS_Status_Code_2.value = data.B100; // PCS状态查询码2
        this.energyData.PCS_Status_Code_3.value = data.B102; // PCS状态查询码3
        this.energyData.PCS_Status_Code_4.value = data.B104; // PCS状态查询码4
        this.energyData.PCS_Status_Code_5.value = data.B106; // PCS状态查询码5
        this.energyData.PCS_Status_Code_6.value = data.B108; // PCS状态查询码6
        this.energyData.PCS_Status_Code_7.value = data.B110; // PCS状态查询码7
        this.energyData.PCS_Status_Code_8.value = data.B112; // PCS状态查询码8
        this.energyData.Battery_Overvoltage.value = data.B115b1; // ARM软件故障-电池软件过压
        this.energyData.Battery_Undervoltage.value = data.B115b2; // ARM软件故障-电池软件欠压
        this.energyData.Bus_Imbalance.value = data.B115b3; // ARM软件故障-母线不平衡异常
        this.energyData.Bus_Half_Voltage_Overvoltage.value = data.B115b4; // ARM软件故障-母线半直压过压
        this.energyData.DCDC_Start_Timeout.value = data.B115b5; // ARM软件故障-DCDC启动超时
        this.energyData.AC_Leakage_Current.value = data.B115b7; // ARM软件故障-交流漏电流保护
        this.energyData.On_Chip_SOC_Temperature.value = data.B116; // 片上SOC温度
        this.energyData.IGBT_Temperature_1_1.value = data.B118; // IGBT温度1-1
        this.energyData.IGBT_Temperature_1_2.value = data.B119; // IGBT温度1-2
        this.energyData.IGBT_Temperature_2_1.value = data.B120; // IGBT温度2-1
        this.energyData.IGBT_Temperature_2_2.value = data.B121; // IGBT温度2-2
        this.energyData.IGBT_Temperature_3_1.value = data.B122; // IGBT温度3-1
        this.energyData.IGBT_Temperature_3_2.value = data.B123; // IGBT温度3-2
        this.energyData.IGBT_Temperature_4_1.value = data.B124; // IGBT温度4-1
        this.energyData.IGBT_Temperature_4_2.value = data.B125; // IGBT温度4-2
        this.energyData.DCDC_Input_Voltage.value = data.B128; // DCDC输入电压
        this.energyData.DCDC_Output_Voltage.value = data.B130; // DCDC输出电压
        this.energyData.DCDC_Input_Current.value = data.B132; // DCDC输入电流
        this.energyData.DCDC_Output_Current.value = data.B134; // DCDC输出电流
        this.energyData.DCDC_Input_Power.value = data.B136; // DCDC输入功率
        this.energyData.DCDC_Cooler_Temp.value = data.B138; // DCDC散热器温度
        this.energyData.DCDC_Program_Version.value = data.B144; // DCDC程序版本
        this.energyData.Switching_Supply_Undervoltage.value = data.B146b1; // FPGA硬件故障-开关电源欠压
        this.energyData.A_Phase_IGBT_Fault.value = data.B146b2; // FPGA硬件故障-A相IGBT故障
        this.energyData.B_Phase_IGBT_Fault.value = data.B146b3; // FPGA硬件故障-B相IGBT故障
        this.energyData.C_Phase_IGBT_Fault.value = data.B146b4; // FPGA硬件故障-C相IGBT故障
        this.energyData.N_Phase_IGBT_Fault.value = data.B146b5; // FPGA硬件故障-N相IGBT故障
        this.energyData.Over_Temperature.value = data.B146b6; // FPGA硬件故障-过温故障
        this.energyData.A_Phase_Overcurrent.value = data.B147b0; // FPGA硬件故障-A相硬件过流
        this.energyData.B_Phase_Overcurrent.value = data.B147b1; // FPGA硬件故障-B相硬件过流
        this.energyData.C_Phase_Overcurrent.value = data.B147b2; // FPGA硬件故障-C相硬件过流
        this.energyData.N_Phase_Overcurrent.value = data.B147b3; // FPGA硬件故障-N相硬件过流
        this.energyData.Unit_Direct_Voltage.value = data.B147b6; // FPGA硬件故障-单元直压故障
        this.energyData.AC_Overvoltage.value = data.B148b0; // ARM软件故障-交流过压
        this.energyData.AC_Undervoltage.value = data.B148b1; // ARM软件故障-交流欠压
        this.energyData.Output_Overvoltage.value = data.B148b2; // ARM软件故障-输出过压
        this.energyData.Output_Undervoltage.value = data.B148b3; // ARM软件故障-输出欠压
        this.energyData.Voltage_THDU_Exceeded.value = data.B148b4; // ARM软件故障-电压THDU超限
        this.energyData.System_Phase_Loss.value = data.B148b5; // ARM软件故障-系统缺相
        this.energyData.System_Phase_Sequence_Error.value = data.B148b6; // ARM软件故障-系统相序错误
        this.energyData.DC_Polarity_Reversed.value = data.B148b7; // ARM软件故障-直流极性反接
        this.energyData.A_Phase_Output_Overcurrent.value = data.B149b0; // ARM软件故障-A相输出过流
        this.energyData.A_Phase_Output_Fast_Trip.value = data.B149b1; // ARM软件故障-A相输出速断
        this.energyData.B_Phase_Output_Overcurrent.value = data.B149b2; // ARM软件故障-B相输出过流
        this.energyData.B_Phase_Output_Fast_Trip.value = data.B149b3; // ARM软件故障-B相输出速断
        this.energyData.C_Phase_Output_Overcurrent.value = data.B149b4; // ARM软件故障-C相输出过流
        this.energyData.C_Phase_Output_Fast_Trip.value = data.B149b5; // ARM软件故障-C相输出速断
        this.energyData.N_Phase_Output_Fast_Trip1.value = data.B149b6; // ARM软件故障-N相输出速断
        this.energyData.N_Phase_Output_Fast_Trip2.value = data.B149b7; // ARM软件故障-N相输出速断
        this.energyData.AC_Main_Closure_Fault.value = data.B150b0; // ARM软件故障-交流主接合闸故障
        this.energyData.AC_Main_Opening_Fault.value = data.B150b1; // ARM软件故障-交流主接分闸故障
        this.energyData.AC_Soft_Start_Closure_Fault.value = data.B150b2; // ARM软件故障-交流软启合闸故障
        this.energyData.AC_Soft_Start_Opening_Fault.value = data.B150b3; // ARM软件故障-交流软启分闸故障
        this.energyData.DC_Main_Closure_Fault.value = data.B150b4; // ARM软件故障-直流主接合闸故障
        this.energyData.DC_Main_Opening_Fault.value = data.B150b5; // ARM软件故障-直流主接分闸故障
        this.energyData.DC_Soft_Start_Closure_Fault1.value = data.B150b6; // ARM软件故障-直流软启合闸故障
        this.energyData.DC_Soft_Start_Closure_Fault2.value = data.B150b7; // ARM软件故障-直流软启合闸故障
        this.energyData.DC_Bus_Overvoltage.value = data.B151b0; // ARM软件故障-直流母线软件过压
        this.energyData.DC_Bus_Undervoltage.value = data.B151b1; // ARM软件故障-直流母线软件欠压
        this.energyData.System_Over_Frequency.value = data.B151b2; // ARM软件故障-系统过频率
        this.energyData.System_Under_Frequency.value = data.B151b3; // ARM软件故障-系统欠频率
        this.energyData.DC_Charge_Overcurrent.value = data.B151b4; // ARM软件故障-直流充电过流
        this.energyData.DC_Discharge_Overcurrent.value = data.B151b5; // ARM软件故障-直流放电过流
        this.energyData.Islanding_Protection.value = data.B151b6; // ARM软件故障-孤岛保护
        this.energyData.DC_Component_Exceeded.value = data.B151b7; // ARM软件故障-直流分量超限
        this.energyData.BMS_Communication_Fault.value = data.B152b0; // ARM软件故障-BMS通讯故障
        this.energyData.BMS_Temperature_Abnormal.value = data.B152b1; // ARM软件故障-BMS温度异常
        this.energyData.BMS_Trip.value = data.B152b2; // ARM软件故障-BMS跳机
        this.energyData.ARM_Software_Alarm_BMS_Battery_Alarm.value = data.B152b3; // ARM软件告警-BMS电池告警
        this.energyData.DCDC_Communication_Fault.value = data.B152b4; // ARM软件故障-DCDC通讯故障
        this.energyData.EMS_Communication_Fault.value = data.B152b5; // ARM软件故障-EMS通讯故障
        this.energyData.E_Stop_or_Fuse_Fault.value = data.B152b6; // ARM软件故障-急停或熔芯故障
        this.energyData.PCS_Fiber_Communication_Fault.value = data.B152b7; // ARM软件故障-PCS光纤通讯故障
        this.energyData.Ferroelectric_Parameter_Storage_Error.value = data.B153b0; // ARM软件故障-铁电参数存储错误
        this.energyData.DC_Soft_Start_Failure.value = data.B153b1; // ARM软件故障-直流软起失败
        this.energyData.Start_Up_Conditions_Not_Met.value = data.B153b4; // ARM软件故障-起机条件不满足
        this.energyData.Switch_Fault_During_Operation.value = data.B153b5; // ARM软件故障-运行中开关故障
        this.energyData.Inverter_Start_Timeout.value = data.B153b6; // ARM软件故障-逆变启动超时
        this.energyData.Parameter_Download_Setting_Error.value = data.B153b7; // ARM软件故障-参数下发设置错误
        this.energyData.DCDC_Fault_Code_1.value = data.B154; // DCDC故障字1
        this.energyData.DCDC_Fault_Code_2.value = data.B156; // DCDC故障字2
        this.energyData.DCDC_Fault_Code_3.value = data.B158; // DCDC故障字3
        this.energyData.DCDC_Fault_Code_4.value = data.B160; // DCDC故障字4
        this.energyData.BMSCMS_Work_Command.value = data.B162; // BMSCMS工作指令
        this.energyData.BMSCMS_Allowed_Charge_Current.value = data.B164; // BMSCMS允许充电电流
        this.energyData.BMSCMS_Allowed_Discharge_Current.value = data.B166; // BMSCMS允许放电电流
        this.energyData.BMSCMS_SOC.value = data.B168; // BMSCMSSOC
        this.energyData.BMSCMS_Chargeable_Energy.value = data.B170; // BMSCMS可充电电量
        this.energyData.BMSCMS_Dischargeable_Energy.value = data.B172; // BMSCMS可放电电量
        this.energyData.BMSCMS_Total_Voltage.value = data.B174; // BMSCMS总电压
        this.energyData.BMSCMS_Total_Current.value = data.B176; // BMSCMS总电流
        this.energyData.BMSCMS_Highest_Cell_SOC.value = data.B178; // BMSCMS单体最高SOC
        this.energyData.BMSCMS_Lowest_Cell_SOC.value = data.B180; // BMSCMS单体最低SOC
        this.energyData.BMSCMS_Highest_Cell_Voltage.value = data.B182; // BMSCMS单体最高电压
        this.energyData.BMSCMS_Lowest_Cell_Voltage.value = data.B184; // BMSCMS单体最低电压
        this.energyData.BMSCMS_Highest_Cell_Temp.value = data.B186; // BMSCMS单体最高温度
        this.energyData.BMSCMS_Lowest_Cell_Temp.value = data.B188; // BMSCMS单体最低温度
        this.energyData.BMSCMS_Allowed_Charge_Power.value = data.B190; // BMSCMS允许充电功率
        this.energyData.BMSCMS_Allowed_Discharge_Power.value = data.B192; // BMSCMS允许放电功率
    }

    getStatusData(jsonData) {
        if (!jsonData || !jsonData.data) return
        this.stateData.operating_mode.value = jsonData.data.B0; // 运行模式选择
        this.stateData.Constant_Voltage_Charge_Voltage_Setpoint.value = jsonData.data.B2; // 恒压充电电压设定值
        this.stateData.Constant_Current_Charge_Current_Setpoint.value = jsonData.data.B4; // 恒流充电电流设定值
        this.stateData.Constant_Power_Active_Power_Target.value = jsonData.data.B6; // 恒功率有功功率期望
        this.stateData.Constant_Power_Reactive_Power_Target.value = jsonData.data.B8; // 恒功率无功功率期望
        this.stateData.Grid_Connected_Off_Grid_Setting.value = jsonData.data.B10; // 并离网设置
        this.stateData.Off_Grid_Output_Voltage_Setpoint.value = jsonData.data.B12; // 离网输出电压给定
        this.stateData.Off_Grid_Output_Frequency_Setpoint.value = jsonData.data.B14; // 离网输出频率给定
        this.stateData.Phase_Controlled_A_Phase_Active_Power.value = jsonData.data.B16; // 分相控制A相有功功率
        this.stateData.Phase_Controlled_B_Phase_Active_Power.value = jsonData.data.B18; // 分相控制B相有功功率
        this.stateData.Phase_Controlled_C_Phase_Active_Power.value = jsonData.data.B20; // 分相控制C相有功功率
        this.stateData.Phase_Controlled_A_Phase_Reactive_Power.value = jsonData.data.B22; // 分相控制A相无功功率
        this.stateData.Phase_Controlled_B_Phase_Reactive_Power.value = jsonData.data.B24; // 分相控制B相无功功率
        this.stateData.Phase_Controlled_C_Phase_Reactive_Power.value = jsonData.data.B26; // 分相控制C相无功功率
        this.stateData.Off_Grid_Output_Voltage_Phase_A_Setpoint.value = jsonData.data.B28; // 离网输出电压分相给定A
        this.stateData.Off_Grid_Output_Voltage_Phase_B_Setpoint.value = jsonData.data.B30; // 离网输出电压分相给定B
        this.stateData.Off_Grid_Output_Voltage_Phase_C_Setpoint.value = jsonData.data.B32; // 离网输出电压分相给定C
        this.stateData.Microgrid_DC_Voltage_Droop_Coefficient.value = jsonData.data.B34; // 微网直流电压下垂系数
        this.stateData.Primary_Frequency_Regulation_Frequency_Deadband.value = jsonData.data.B36; // 一次调频频率死区
        this.stateData.Primary_Frequency_Regulation_K_Value.value = jsonData.data.B38; // 一次调频K值
        this.stateData.VSG_Frequency_Droop_Coefficient.value = jsonData.data.B40; // VSG频率下垂系数
        this.stateData.VSG_Voltage_Droop_Coefficient.value = jsonData.data.B44; // VSG电压下垂系数
        this.stateData.Switch_Operation_Mode.value = jsonData.data.B46; // 并离网开关运行模式
        this.stateData.Battery_Overcapacity_Allowed_Charge_Voltage.value = jsonData.data.B50; // 电池超容允许充电电压
        this.stateData.Battery_Overcapacity_Allowed_Discharge_Voltage.value = jsonData.data.B52; // 电池超容允许放电电压
        this.stateData.Battery_Overcapacity_Allowed_Charge_Current.value = jsonData.data.B54; // 电池超容允许充电电流
        this.stateData.Battery_Overcapacity_Allowed_Discharge_Current.value = jsonData.data.B56; // 电池超容允许放电电流
        this.stateData.Second.value = jsonData.data.B58; // 对时-秒
        this.stateData.Minute.value = jsonData.data.B60; // 对时-分
        this.stateData.Hour.value = jsonData.data.B62; // 对时-时
        this.stateData.Day.value = jsonData.data.B64; // 对时-日
        this.stateData.Month.value = jsonData.data.B66; // 对时-月
        this.stateData.Year.value = jsonData.data.B68; // 对时-年
        this.stateData.Enclosure_Fan_Start_Temperature.value = jsonData.data.B80; // 柜体风机开启温度
        this.stateData.Enclosure_Fan_Start_Time.value = jsonData.data.B82; // 柜体风机开启时间
        this.stateData.Enclosure_Fan_Stop_Temperature.value = jsonData.data.B84; // 柜体风机停止温度
        this.stateData.Enclosure_Fan_Stop_Time.value = jsonData.data.B86; // 柜体风机停止时间
        this.stateData.Enclosure_Fan_Forced_Start_Command.value = jsonData.data.B88; // 柜体风机强制开启命令
    }
}

class EnergyData {
    Fault_reset = { name: '故障复位', value: '--', unit: "" };
    Device_Start = { name: '设备启动', value: '--', unit: "" };
    Device_Shutdown = { name: '设备停机', value: '--', unit: "" };
    Remote_E_Stop = { name: '远程急停', value: '--', unit: "" };
    Reset_Charge_Energy = { name: '累计充电电量清零', value: '--', unit: "" };
    Reset_Discharge_Energy = { name: '累计放电电量清零', value: '--', unit: "" };
    Remote_Local_Setting = { name: '远程就地设置', value: '--', unit: "" };
    Device_Standby = { name: '设备待机', value: '--', unit: "" };
    External_Switch = { name: '外部电操开关', value: '--', unit: "" };
    Shutdown_Status = { name: '停机状态', value: '--', unit: "" };
    Standby_Status = { name: '待机状态', value: '--', unit: "" };
    Operation_Status = { name: '运行状态', value: '--', unit: "" };
    Total_Fault_Status = { name: '总故障状态', value: '--', unit: "" };
    Total_Alarm_Status = { name: '总报警状态', value: '--', unit: "" };
    Remote_Local_Status = { name: '远程就地状态', value: '--', unit: "" };
    E_Stop_Input_Status = { name: '急停输入状态', value: '--', unit: "" };
    Grid_Connected_Status = { name: '并网状态', value: '--', unit: "" };
    VF_Off_Grid_Status = { name: 'VF离网状态', value: '--', unit: "" };
    Overload_Derating = { name: '过载降容', value: '--', unit: "" };
    BMS_Dry_Contact_Input = { name: 'BMS干接点输入', value: '--', unit: "" };
    PCS_Port_A_Voltage = { name: 'PCS端口A相电压', value: '--', unit: "V" };
    PCS_Port_B_Voltage = { name: 'PCS端口B相电压', value: '--', unit: "V" };
    PCS_Port_C_Voltage = { name: 'PCS端口C相电压', value: '--', unit: "V" };
    PCS_Output_A_Current = { name: 'PCS输出A相电流', value: '--', unit: "A" };
    PCS_Output_B_Current = { name: 'PCS输出B相电流', value: '--', unit: "A" };
    PCS_Output_C_Current = { name: 'PCS输出C相电流', value: '--', unit: "A" };
    Grid_Frequency = { name: '电网频率', value: '--', unit: "Hz" };
    PCS_A_Active_Power = { name: 'PCSA相输出有功功率', value: '--', unit: "KW" };
    PCS_B_Active_Power = { name: 'PCSB相输出有功功率', value: '--', unit: "KW" };
    PCS_C_Active_Power = { name: 'PCSC相输出有功功率', value: '--', unit: "KW" };
    PCS_Total_Active_Power = { name: 'PCS总输出有功功率', value: '--', unit: "KW" };
    PCS_A_Reactive_Power = { name: 'PCSA相输出无功功率', value: '--', unit: "kVar" };
    PCS_B_Reactive_Power = { name: 'PCSB相输出无功功率', value: '--', unit: "kVar" };
    PCS_C_Reactive_Power = { name: 'PCSC相输出无功功率', value: '--', unit: "kVar" };
    PCS_Total_Reactive_Power = { name: 'PCS总输出无功功率', value: '--', unit: "kVar" };
    PCS_A_Apparent_Power = { name: 'PCSA相输出视在功率', value: '--', unit: "kVA" };
    PCS_B_Apparent_Power = { name: 'PCSB相输出视在功率', value: '--', unit: "kVA" };
    PCS_C_Apparent_Power = { name: 'PCSC相输出视在功率', value: '--', unit: "kVA" };
    PCS_Total_Apparent_Power = { name: 'PCS总输出视在功率', value: '--', unit: "kVA" };
    PCS_A_Power_Factor = { name: 'PCS输出A相功率因数', value: '--', unit: "" };
    PCS_B_Power_Factor = { name: 'PCS输出B相功率因数', value: '--', unit: "" };
    PCS_C_Power_Factor = { name: 'PCS输出C相功率因数', value: '--', unit: "" };
    PCS_Total_Power_Factor = { name: 'PCS输出总功率因数', value: '--', unit: "" };
    PCS_Input_Power = { name: 'PCS输入功率', value: '--', unit: "kW" };
    PCS_Input_Voltage = { name: 'PCS输入电压', value: '--', unit: "V" };
    PCS_Input_Current = { name: 'PCS输入电流', value: '--', unit: "A" };
    PCS_Cooler_Temp = { name: 'PCS散热器温度', value: '--', unit: "℃" };
    PCS_AC_Charge_Energy = { name: 'PCS交流累计充电电量', value: '--', unit: "kWh" };
    PCS_AC_Discharge_Energy = { name: 'PCS交流累计放电电量', value: '--', unit: "kWh" };
    PCS_DC_Charge_Energy = { name: 'PCS直流累计充电电量', value: '--', unit: "kWh" };
    PCS_DC_Discharge_Energy = { name: 'PCS直流累计放电电量', value: '--', unit: "kWh" };
    PCS_Communication_Status = { name: 'PCS通讯状态字', value: '--', unit: "" };
    System_Clock_Sec = { name: '系统时钟-秒', value: '--', unit: "" };
    System_Clock_Min = { name: '系统时钟-分', value: '--', unit: "" };
    System_Clock_Hour = { name: '系统时钟-时', value: '--', unit: "" };
    System_Clock_Day = { name: '系统时钟-日', value: '--', unit: "" };
    System_Clock_Month = { name: '系统时钟-月', value: '--', unit: "" };
    System_Clock_Year = { name: '系统时钟-年', value: '--', unit: "" };
    PCS_Program_Version = { name: 'PCS程序版本', value: '--', unit: "" };
    FPGA_Program_Version = { name: 'FPGA程序版本', value: '--', unit: "" };
    N_Phase_RMS_Current = { name: 'N相电流有效值', value: '--', unit: "A" };
    PCS_Status_Code_1 = { name: 'PCS状态查询码1', value: '--', unit: "" };
    PCS_Status_Code_2 = { name: 'PCS状态查询码2', value: '--', unit: "" };
    PCS_Status_Code_3 = { name: 'PCS状态查询码3', value: '--', unit: "" };
    PCS_Status_Code_4 = { name: 'PCS状态查询码4', value: '--', unit: "" };
    PCS_Status_Code_5 = { name: 'PCS状态查询码5', value: '--', unit: "" };
    PCS_Status_Code_6 = { name: 'PCS状态查询码6', value: '--', unit: "" };
    PCS_Status_Code_7 = { name: 'PCS状态查询码7', value: '--', unit: "" };
    PCS_Status_Code_8 = { name: 'PCS状态查询码8', value: '--', unit: "" };
    Battery_Overvoltage = { name: 'ARM软件故障-电池软件过压', value: '--', unit: "" };
    Battery_Undervoltage = { name: 'ARM软件故障-电池软件欠压', value: '--', unit: "" };
    Bus_Imbalance = { name: 'ARM软件故障-母线不平衡异常', value: '--', unit: "" };
    Bus_Half_Voltage_Overvoltage = { name: 'ARM软件故障-母线半直压过压', value: '--', unit: "" };
    DCDC_Start_Timeout = { name: 'ARM软件故障-DCDC启动超时', value: '--', unit: "" };
    AC_Leakage_Current = { name: 'ARM软件故障-交流漏电流保护', value: '--', unit: "" };
    On_Chip_SOC_Temperature = { name: '片上SOC温度', value: '--', unit: "℃" };
    IGBT_Temperature_1_1 = { name: 'IGBT温度1-1', value: '--', unit: "" };
    IGBT_Temperature_1_2 = { name: 'IGBT温度1-2', value: '--', unit: "" };
    IGBT_Temperature_2_1 = { name: 'IGBT温度2-1', value: '--', unit: "" };
    IGBT_Temperature_2_2 = { name: 'IGBT温度2-2', value: '--', unit: "" };
    IGBT_Temperature_3_1 = { name: 'IGBT温度3-1', value: '--', unit: "" };
    IGBT_Temperature_3_2 = { name: 'IGBT温度3-2', value: '--', unit: "" };
    IGBT_Temperature_4_1 = { name: 'IGBT温度4-1', value: '--', unit: "" };
    IGBT_Temperature_4_2 = { name: 'IGBT温度4-2', value: '--', unit: "" };
    DCDC_Input_Voltage = { name: 'DCDC输入电压', value: '--', unit: "V" };
    DCDC_Output_Voltage = { name: 'DCDC输出电压', value: '--', unit: "V" };
    DCDC_Input_Current = { name: 'DCDC输入电流', value: '--', unit: "A" };
    DCDC_Output_Current = { name: 'DCDC输出电流', value: '--', unit: "A" };
    DCDC_Input_Power = { name: 'DCDC输入功率', value: '--', unit: "KW" };
    DCDC_Cooler_Temp = { name: 'DCDC散热器温度', value: '--', unit: "" };
    DCDC_Program_Version = { name: 'DCDC程序版本', value: '--', unit: "" };
    Switching_Supply_Undervoltage = { name: 'FPGA硬件故障-开关电源欠压', value: '--', unit: "" };
    A_Phase_IGBT_Fault = { name: 'FPGA硬件故障-A相IGBT故障', value: '--', unit: "" };
    B_Phase_IGBT_Fault = { name: 'FPGA硬件故障-B相IGBT故障', value: '--', unit: "" };
    C_Phase_IGBT_Fault = { name: 'FPGA硬件故障-C相IGBT故障', value: '--', unit: "" };
    N_Phase_IGBT_Fault = { name: 'FPGA硬件故障-N相IGBT故障', value: '--', unit: "" };
    Over_Temperature = { name: 'FPGA硬件故障-过温故障', value: '--', unit: "" };
    A_Phase_Overcurrent = { name: 'FPGA硬件故障-A相硬件过流', value: '--', unit: "" };
    B_Phase_Overcurrent = { name: 'FPGA硬件故障-B相硬件过流', value: '--', unit: "" };
    C_Phase_Overcurrent = { name: 'FPGA硬件故障-C相硬件过流', value: '--', unit: "" };
    N_Phase_Overcurrent = { name: 'FPGA硬件故障-N相硬件过流', value: '--', unit: "" };
    Unit_Direct_Voltage = { name: 'FPGA硬件故障-单元直压故障', value: '--', unit: "" };
    AC_Overvoltage = { name: 'ARM软件故障-交流过压', value: '--', unit: "" };
    AC_Undervoltage = { name: 'ARM软件故障-交流欠压', value: '--', unit: "" };
    Output_Overvoltage = { name: 'ARM软件故障-输出过压', value: '--', unit: "" };
    Output_Undervoltage = { name: 'ARM软件故障-输出欠压', value: '--', unit: "" };
    Voltage_THDU_Exceeded = { name: 'ARM软件故障-电压THDU超限', value: '--', unit: "" };
    System_Phase_Loss = { name: 'ARM软件故障-系统缺相', value: '--', unit: "" };
    System_Phase_Sequence_Error = { name: 'ARM软件故障-系统相序错误', value: '--', unit: "" };
    DC_Polarity_Reversed = { name: 'ARM软件故障-直流极性反接', value: '--', unit: "" };
    A_Phase_Output_Overcurrent = { name: 'ARM软件故障-A相输出过流', value: '--', unit: "" };
    A_Phase_Output_Fast_Trip = { name: 'ARM软件故障-A相输出速断', value: '--', unit: "" };
    B_Phase_Output_Overcurrent = { name: 'ARM软件故障-B相输出过流', value: '--', unit: "" };
    B_Phase_Output_Fast_Trip = { name: 'ARM软件故障-B相输出速断', value: '--', unit: "" };
    C_Phase_Output_Overcurrent = { name: 'ARM软件故障-C相输出过流', value: '--', unit: "" };
    C_Phase_Output_Fast_Trip = { name: 'ARM软件故障-C相输出速断', value: '--', unit: "" };
    N_Phase_Output_Fast_Trip1 = { name: 'ARM软件故障-N相输出速断', value: '--', unit: "" };
    N_Phase_Output_Fast_Trip2 = { name: 'ARM软件故障-N相输出速断', value: '--', unit: "" };
    AC_Main_Closure_Fault = { name: 'ARM软件故障-交流主接合闸故障', value: '--', unit: "" };
    AC_Main_Opening_Fault = { name: 'ARM软件故障-交流主接分闸故障', value: '--', unit: "" };
    AC_Soft_Start_Closure_Fault = { name: 'ARM软件故障-交流软启合闸故障', value: '--', unit: "" };
    AC_Soft_Start_Opening_Fault = { name: 'ARM软件故障-交流软启分闸故障', value: '--', unit: "" };
    DC_Main_Closure_Fault = { name: 'ARM软件故障-直流主接合闸故障', value: '--', unit: "" };
    DC_Main_Opening_Fault = { name: 'ARM软件故障-直流主接分闸故障', value: '--', unit: "" };
    DC_Soft_Start_Closure_Fault1 = { name: 'ARM软件故障-直流软启合闸故障', value: '--', unit: "" };
    DC_Soft_Start_Closure_Fault2 = { name: 'ARM软件故障-直流软启合闸故障', value: '--', unit: "" };
    DC_Bus_Overvoltage = { name: 'ARM软件故障-直流母线软件过压', value: '--', unit: "" };
    DC_Bus_Undervoltage = { name: 'ARM软件故障-直流母线软件欠压', value: '--', unit: "" };
    System_Over_Frequency = { name: 'ARM软件故障-系统过频率', value: '--', unit: "" };
    System_Under_Frequency = { name: 'ARM软件故障-系统欠频率', value: '--', unit: "" };
    DC_Charge_Overcurrent = { name: 'ARM软件故障-直流充电过流', value: '--', unit: "" };
    DC_Discharge_Overcurrent = { name: 'ARM软件故障-直流放电过流', value: '--', unit: "" };
    Islanding_Protection = { name: 'ARM软件故障-孤岛保护', value: '--', unit: "" };
    DC_Component_Exceeded = { name: 'ARM软件故障-直流分量超限', value: '--', unit: "" };
    BMS_Communication_Fault = { name: 'ARM软件故障-BMS通讯故障', value: '--', unit: "" };
    BMS_Temperature_Abnormal = { name: 'ARM软件故障-BMS温度异常', value: '--', unit: "" };
    BMS_Trip = { name: 'ARM软件故障-BMS跳机', value: '--', unit: "" };
    ARM_Software_Alarm_BMS_Battery_Alarm = { name: 'ARM软件告警-BMS电池告警', value: '--', unit: "" };
    DCDC_Communication_Fault = { name: 'ARM软件故障-DCDC通讯故障', value: '--', unit: "" };
    EMS_Communication_Fault = { name: 'ARM软件故障-EMS通讯故障', value: '--', unit: "" };
    E_Stop_or_Fuse_Fault = { name: 'ARM软件故障-急停或熔芯故障', value: '--', unit: "" };
    PCS_Fiber_Communication_Fault = { name: 'ARM软件故障-PCS光纤通讯故障', value: '--', unit: "" };
    Ferroelectric_Parameter_Storage_Error = { name: 'ARM软件故障-铁电参数存储错误', value: '--', unit: "" };
    DC_Soft_Start_Failure = { name: 'ARM软件故障-直流软起失败', value: '--', unit: "" };
    Start_Up_Conditions_Not_Met = { name: 'ARM软件故障-起机条件不满足', value: '--', unit: "" };
    Switch_Fault_During_Operation = { name: 'ARM软件故障-运行中开关故障', value: '--', unit: "" };
    Inverter_Start_Timeout = { name: 'ARM软件故障-逆变启动超时', value: '--', unit: "" };
    Parameter_Download_Setting_Error = { name: 'ARM软件故障-参数下发设置错误', value: '--', unit: "" };
    DCDC_Fault_Code_1 = { name: 'DCDC故障字1', value: '--', unit: "" };
    DCDC_Fault_Code_2 = { name: 'DCDC故障字2', value: '--', unit: "" };
    DCDC_Fault_Code_3 = { name: 'DCDC故障字3', value: '--', unit: "" };
    DCDC_Fault_Code_4 = { name: 'DCDC故障字4', value: '--', unit: "" };
    BMSCMS_Work_Command = { name: 'BMSCMS工作指令', value: '--', unit: "" };
    BMSCMS_Allowed_Charge_Current = { name: 'BMSCMS允许充电电流', value: '--', unit: "A" };
    BMSCMS_Allowed_Discharge_Current = { name: 'BMSCMS允许放电电流', value: '--', unit: "A" };
    BMSCMS_SOC = { name: 'BMSCMSSOC', value: '--', unit: "%" };
    BMSCMS_Chargeable_Energy = { name: 'BMSCMS可充电电量', value: '--', unit: "KWh" };
    BMSCMS_Dischargeable_Energy = { name: 'BMSCMS可放电电量', value: '--', unit: "KWh" };
    BMSCMS_Total_Voltage = { name: 'BMSCMS总电压', value: '--', unit: "V" };
    BMSCMS_Total_Current = { name: 'BMSCMS总电流', value: '--', unit: "A" };
    BMSCMS_Highest_Cell_SOC = { name: 'BMSCMS单体最高SOC', value: '--', unit: "%" };
    BMSCMS_Lowest_Cell_SOC = { name: 'BMSCMS单体最低SOC', value: '--', unit: "%" };
    BMSCMS_Highest_Cell_Voltage = { name: 'BMSCMS单体最高电压', value: '--', unit: "V" };
    BMSCMS_Lowest_Cell_Voltage = { name: 'BMSCMS单体最低电压', value: '--', unit: "V" };
    BMSCMS_Highest_Cell_Temp = { name: 'BMSCMS单体最高温度', value: '--', unit: "℃" };
    BMSCMS_Lowest_Cell_Temp = { name: 'BMSCMS单体最低温度', value: '--', unit: "℃" };
    BMSCMS_Allowed_Charge_Power = { name: 'BMSCMS允许充电功率', value: '--', unit: "KW" };
    BMSCMS_Allowed_Discharge_Power = { name: 'BMSCMS允许放电功率', value: '--', unit: "KW" };
}

class StatusData {
    operating_mode = { name: '运行模式选择', value: '--', unit: "" };
    Constant_Voltage_Charge_Voltage_Setpoint = { name: '恒压充电电压设定值', value: '--', unit: "V" };
    Constant_Current_Charge_Current_Setpoint = { name: '恒流充电电流设定值', value: '--', unit: "A" };
    Constant_Power_Active_Power_Target = { name: '恒功率有功功率期望', value: '--', unit: "KW" };
    Constant_Power_Reactive_Power_Target = { name: '恒功率无功功率期望', value: '--', unit: "kVar" };
    Grid_Connected_Off_Grid_Setting = { name: '并离网设置', value: '--', unit: "" };
    Off_Grid_Output_Voltage_Setpoint = { name: '离网输出电压给定', value: '--', unit: "V" };
    Off_Grid_Output_Frequency_Setpoint = { name: '离网输出频率给定', value: '--', unit: "KW" };
    Phase_Controlled_A_Phase_Active_Power = { name: '分相控制A相有功功率', value: '--', unit: "KW" };
    Phase_Controlled_B_Phase_Active_Power = { name: '分相控制B相有功功率', value: '--', unit: "KW" };
    Phase_Controlled_C_Phase_Active_Power = { name: '分相控制C相有功功率', value: '--', unit: "KW" };
    Phase_Controlled_A_Phase_Reactive_Power = { name: '分相控制A相无功功率', value: '--', unit: "kVar" };
    Phase_Controlled_B_Phase_Reactive_Power = { name: '分相控制B相无功功率', value: '--', unit: "kVar" };
    Phase_Controlled_C_Phase_Reactive_Power = { name: '分相控制C相无功功率', value: '--', unit: "kVar" };
    Off_Grid_Output_Voltage_Phase_A_Setpoint = { name: '离网输出电压分相给定A', value: '--', unit: "V" };
    Off_Grid_Output_Voltage_Phase_B_Setpoint = { name: '离网输出电压分相给定B', value: '--', unit: "V" };
    Off_Grid_Output_Voltage_Phase_C_Setpoint = { name: '离网输出电压分相给定C', value: '--', unit: "V" };
    Microgrid_DC_Voltage_Droop_Coefficient = { name: '微网直流电压下垂系数', value: '--', unit: "V" };
    Primary_Frequency_Regulation_Frequency_Deadband = { name: '一次调频频率死区', value: '--', unit: "Hz" };
    Primary_Frequency_Regulation_K_Value = { name: '一次调频K值', value: '--', unit: "" };
    VSG_Frequency_Droop_Coefficient = { name: 'VSG频率下垂系数', value: '--', unit: "" };
    VSG_Voltage_Droop_Coefficient = { name: 'VSG电压下垂系数', value: '--', unit: "" };
    Switch_Operation_Mode = { name: '并离网开关运行模式', value: '--', unit: "" };
    Battery_Overcapacity_Allowed_Charge_Voltage = { name: '电池超容允许充电电压', value: '--', unit: "V" };
    Battery_Overcapacity_Allowed_Discharge_Voltage = { name: '电池超容允许放电电压', value: '--', unit: "V" };
    Battery_Overcapacity_Allowed_Charge_Current = { name: '电池超容允许充电电流', value: '--', unit: "A" };
    Battery_Overcapacity_Allowed_Discharge_Current = { name: '电池超容允许放电电流', value: '--', unit: "A" };
    Second = { name: '对时-秒', value: '--', unit: "" };
    Minute = { name: '对时-分', value: '--', unit: "" };
    Hour = { name: '对时-时', value: '--', unit: "" };
    Day = { name: '对时-日', value: '--', unit: "" };
    Month = { name: '对时-月', value: '--', unit: "" };
    Year = { name: '对时-年', value: '--', unit: "" };
    Enclosure_Fan_Start_Temperature = { name: '柜体风机开启温度', value: '--', unit: "℃" };
    Enclosure_Fan_Start_Time = { name: '柜体风机开启时间', value: '--', unit: "秒" };
    Enclosure_Fan_Stop_Temperature = { name: '柜体风机停止温度', value: '--', unit: "℃" };
    Enclosure_Fan_Stop_Time = { name: '柜体风机停止时间', value: '--', unit: "秒" };
    Enclosure_Fan_Forced_Start_Command = { name: '柜体风机强制开启命令', value: '--', unit: "" };
}

// ============ 以下为 MQTT 直连调试页（PcsTab）专用的旧版 B 键字段定义 ============
// 直连页按 Modbus 二进制帧的紧凑寄存器号（B0/B2/.../B24 起）自行分桶解析，
// 与云端 JSON 的字节偏移布局不同；保留该导出仅为兼容 PcsTab 的故障位枚举。

const faultFieldNames = [
    'ARM软件故障-保留1','ARM软件故障-保留2','ARM软件故障-保留3','ARM软件故障-保留4',
    'ARM软件故障-保留5','ARM软件故障-保留6','ARM软件故障-保留7','ARM软件故障-保留8',
    'ARM软件故障-保留9','ARM软件故障-电池软件过压','ARM软件故障-电池软件欠压','ARM软件故障-母线不平衡异常',
    'ARM软件故障-母线半直压过压','ARM软件故障-DCDC启动超时','ARM软件故障-保留10','ARM软件故障-交流漏电流保护',
    'FPGA硬件故障-保留1','FPGA硬件故障-开关电源欠压','FPGA硬件故障-A相IGBT故障','FPGA硬件故障-B相IGBT故障',
    'FPGA硬件故障-C相IGBT故障','FPGA硬件故障-N相IGBT故障','FPGA硬件故障-过温故障','FPGA硬件故障-保留2',
    'FPGA硬件故障-A相硬件过流','FPGA硬件故障-B相硬件过流','FPGA硬件故障-C相硬件过流','FPGA硬件故障-N相硬件过流',
    'FPGA硬件故障-保留3','FPGA硬件故障-保留4','FPGA硬件故障-单元直压故障','FPGA硬件故障-保留5',
    'ARM软件故障-交流过压','ARM软件故障-交流欠压','ARM软件故障-输出过压','ARM软件故障-输出欠压',
    'ARM软件故障-电压THDU超限','ARM软件故障-系统缺相','ARM软件故障-系统相序错误','ARM软件故障-直流极性反接',
    'ARM软件故障-A相输出过流','ARM软件故障-A相输出速断','ARM软件故障-B相输出过流','ARM软件故障-B相输出速断',
    'ARM软件故障-C相输出过流','ARM软件故障-C相输出速断','ARM软件故障-N相输出速断1','ARM软件故障-N相输出速断2',
    'ARM软件故障-交流主接合闸故障','ARM软件故障-交流主接分闸故障','ARM软件故障-交流软启合闸故障','ARM软件故障-交流软启分闸故障',
    'ARM软件故障-直流主接合闸故障','ARM软件故障-直流主接分闸故障','ARM软件故障-直流软启合闸故障','ARM软件故障-直流软启合闸故障2',
    'ARM软件故障-直流母线软件过压','ARM软件故障-直流母线软件欠压','ARM软件故障-系统过频率','ARM软件故障-系统欠频率',
    'ARM软件故障-直流充电过流','ARM软件故障-直流放电过流','ARM软件故障-孤岛保护','ARM软件故障-直流分量超限',
    'ARM软件故障-BMS通讯故障','ARM软件故障-BMS温度异常','ARM软件故障-BMS跳机','ARM软件告警-BMS电池告警',
    'ARM软件故障-DCDC通讯故障','ARM软件故障-EMS通讯故障','ARM软件故障-急停或熔芯故障','ARM软件故障-PCS光纤通讯故障',
    'ARM软件故障-铁电参数存储错误','ARM软件故障-直流软起失败','ARM软件故障-保留11','ARM软件故障-保留12',
    'ARM软件故障-起机条件不满足','ARM软件故障-运行中开关故障','ARM软件故障-逆变启动超时','ARM软件故障-参数下发设置错误'
]
const faultAddrMap = {}
let _fa = 24
for (const name of faultFieldNames) {
    faultAddrMap[name] = `B${_fa}`
    _fa += 2
}

export class StateData {
    B0  = { name: '停机状态', value: "--" };
    B2  = { name: '待机状态', value: "--" };
    B4  = { name: '运行状态', value: "--" };
    B6  = { name: '总故障状态', value: "--" };
    B8  = { name: '总报警状态', value: "--" };
    B10 = { name: '远程/就地状态', value: "--" };
    B12 = { name: '急停输入状态', value: "--" };
    B14 = { name: '并网状态', value: "--" };
    B16 = { name: 'VF离网状态', value: "--" };
    B18 = { name: '过载降容', value: "--" };
    B22 = { name: 'BMS干接点输入', value: "--" };

    constructor() {
        for (const name of faultFieldNames) {
            this[faultAddrMap[name]] = { name, value: "--" }
        }
    }
}
