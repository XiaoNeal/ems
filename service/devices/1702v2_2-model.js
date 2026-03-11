import DeviceBase from "./device-base.model"

export class Model1702v2_2 extends DeviceBase {
  constructor () {
    super();
    this.energyData = new EnergyData()
    this.statusData = new StatusData()
  }

  getEnergyData(jsonData) {
    this.energyData.muxiance_voltage.value = jsonData.B0; // 母线侧电压
    this.energyData.voltage_side_voltage.value = jsonData.B2; // 电池侧电压
    this.energyData.electric_sense1.value = jsonData.B4; // 电感1电流
    this.energyData.electric_sense2.value = jsonData.B6; // 电感2电流
    this.energyData.charge_power.value = jsonData.B8; // 充电功率
    this.energyData.discharge_power.value = jsonData.B10; // 放电功率
    this.energyData.charge_capacity.value = jsonData.B12; // 充电电量
    this.energyData.discharge_capacity.value = jsonData.B16; // 放电电量
    this.energyData.singleton_higher_voltage.value = jsonData.B20; // 单体电芯最高电压
    this.energyData.singleton_lower_voltage.value = jsonData.B22; // 单体电芯最低电压
  }

  getStatusData(jsonData) {
    this.statusData.dc_dc_mode.value = enum_dc_dc_mode[jsonData.data.B0] || jsonData.data.B0; // DC/DC工作模式
    this.statusData.dc_dc_module_temperature.value = jsonData.data.B1; // DC-DC模块温度
    this.statusData.soc_value.value = jsonData.data.B2; // SOC数值
    this.statusData.single_temp_minus.value = jsonData.data.B3; // 单体温度差
    this.statusData.electric_core_type.value = enum_electric_core_type[jsonData.data.B4] || jsonData.data.B4; // 电芯类型
    this.statusData.soh.value = jsonData.data.B5; // soh
    this.statusData.cycle_index.value = jsonData.data.B6; // 循环次数
    this.statusData.dc_dc_ready.value = jsonData.data.B8b0; // DC/DC准备状态
    this.statusData.dc_dc_failure.value = jsonData.data.B8b1; // DC/DC故障状态
    this.statusData.muxiance_voltage_overhigh_protect.value = jsonData.data.B8b2; // 母线侧电压过高保护
    this.statusData.muxiance_voltage_overlow_protect.value = jsonData.data.B8b3; // 母线侧电压过低保护
    this.statusData.muxiance_extreme_inverse_protect.value = jsonData.data.B8b4; // 母线侧极性反接保护
    this.statusData.battery_side_voltage_overhigh_protect.value = jsonData.data.B8b5; // 电池侧电压过高保护
    this.statusData.battery_side_voltage_overlow_protect.value = jsonData.data.B8b6; // 电池侧电压过低保护
    this.statusData.battery_exterme_inverse_protect.value = jsonData.data.B8b7; // 电池侧极性反接保护
    this.statusData.software_overflow_failure.value = jsonData.data.B8b0; // 软件过流故障
    this.statusData.current_sense_failure.value = jsonData.data.B8b1; // 电流传感器故障
    this.statusData.temperature_sense_failure.value = jsonData.data.B8b2; // 温度传感器故障
    this.statusData.connection_failed.value = jsonData.data.B8b3; // 通信故障
    this.statusData.hardware_overflow_failure.value = jsonData.data.B8b4; // 硬件过流故障
  }
}

class EnergyData {
  muxiance_voltage = { name: '母线侧电压', value: '--', unit: "V" };
  voltage_side_voltage = { name: '电池侧电压', value: '--', unit: "V" };
  electric_sense1 = { name: '电感1电流', value: '--', unit: "A" };
  electric_sense2 = { name: '电感2电流', value: '--', unit: "A" };
  charge_power = { name: '充电功率', value: '--', unit: "W" };
  discharge_power = { name: '放电功率', value: '--', unit: "W" };
  charge_capacity = { name: '充电电量', value: '--', unit: "kWh" };
  discharge_capacity = { name: '放电电量', value: '--', unit: "kWh" };
  singleton_higher_voltage = { name: '单体电芯最高电压', value: '--', unit: "mV" };
  singleton_lower_voltage = { name: '单体电芯最低电压', value: '--', unit: "mV" };
}

class StatusData {
  dc_dc_mode = { name: 'DC/DC工作模式', value: '--', unit: "" };
  dc_dc_module_temperature = { name: 'DC-DC模块温度', value: '--', unit: "" };
  soc_value = { name: 'SOC数值', value: '--', unit: "" };
  single_temp_minus = { name: '单体温度差', value: '--', unit: "" };
  electric_core_type = { name: '电芯类型', value: '--', unit: "" };
  soh = { name: 'soh', value: '--', unit: "" };
  cycle_index = { name: '循环次数', value: '--', unit: "" };
  dc_dc_ready = { name: 'DC/DC准备状态', value: '--', unit: "" };
  dc_dc_failure = { name: 'DC/DC故障状态', value: '--', unit: "" };
  muxiance_voltage_overhigh_protect = { name: '母线侧电压过高保护', value: '--', unit: "" };
  muxiance_voltage_overlow_protect = { name: '母线侧电压过低保护', value: '--', unit: "" };
  muxiance_extreme_inverse_protect = { name: '母线侧极性反接保护', value: '--', unit: "" };
  battery_side_voltage_overhigh_protect = { name: '电池侧电压过高保护', value: '--', unit: "" };
  battery_side_voltage_overlow_protect = { name: '电池侧电压过低保护', value: '--', unit: "" };
  battery_exterme_inverse_protect = { name: '电池侧极性反接保护', value: '--', unit: "" };
  software_overflow_failure = { name: '软件过流故障', value: '--', unit: "" };
  current_sense_failure = { name: '电流传感器故障', value: '--', unit: "" };
  temperature_sense_failure = { name: '温度传感器故障', value: '--', unit: "" };
  connection_failed = { name: '通信故障', value: '--', unit: "" };
  hardware_overflow_failure = { name: '硬件过流故障', value: '--', unit: "" };
  reserver1 = { name: '预留', value: '--', unit: "" };
  reserver2 = { name: '预留', value: '--', unit: "" };
  reserver3 = { name: '预留', value: '--', unit: "" };
}

const enum_dc_dc_mode = {
  '00': '正常',
  '01': '放电',
  '10': '充电',
  '11': '无效'
}

const enum_electric_core_type = {
  '01': '三元',
  '02': '钛酸锂',
  '03': '钛酸铁锂'
}

const enum_dc_dc_ready = {
  '0': '未完成',
  '1': '完成'
}

const enum_alarm = {
  '0': '正常',
  '1': '故障'
}