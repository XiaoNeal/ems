import DeviceBase from "./device-base.model"

export class Model170A extends DeviceBase {
    energyData
    stateData
    controlData

    constructor() {
        super()
        this.energyData = new EnergyData()
        this.stateData = new StateData()
        this.controlData = new ControlData()
    }

    getEnergyData(jsonData, jsonData2) {
        const data = jsonData.data || jsonData
        const fields = [
            'group_voltage', 'group_current', 'group_soc', 'group_soh',
            'environment_temperature', 'group_positive_insulation_resistance',
            'group_negative_insulation_resistance', 'group_charge_capacity',
            'group_discharge_capacity', 'group_single_charge_capacity',
            'group_single_discharge_capacity', 'group_total_charge_capacity',
            'group_total_discharge_capacity', 'group_single_voltage_range_of_pressure',
            'single_avg_voltage', 'single_max_voltage', 'single_min_voltage',
            'group_single_temperature_range_of_pressure', 'single_avg_temperature',
            'single_max_temperature', 'single_min_temperature',
            'single_avg_internal_resistance', 'single_max_internal_resistance',
            'single_min_internal_resistance', 'single_avg_soc', 'single_max_soc',
            'single_min_soc', 'single_avg_soh', 'single_max_soh', 'single_min_soh',
            'group_current_maximum_allowable_charge_power',
            'group_current_maximum_allowable_discharge_power',
            'group_current_maximum_allowable_charge_current',
            'group_current_maximum_allowable_discharge_current',
            'low_side_voltage', 'low_side_current', 'heat_sink_temperature',
            'high_side_voltage', 'high_side_current', 'dc_bus_high_side_voltage',
            'battery_low_side_voltage'
        ]
        for (const key of fields) {
            if (data[key] != null && data[key] !== '' && data[key] !== '--') {
                let value = data[key]
                if (key === 'group_soh' || key === 'environment_temperature' || key === 'heat_sink_temperature') {
                    value = Number(value).toFixed(2)
                } else if (['dc_bus_high_side_voltage', 'battery_low_side_voltage'].includes(key)) {
                    value = Number(value).toFixed(2) + 'V'
                } else {
                    value = Number(value).toFixed(2)
                }
                if (this.energyData[key]) {
                    this.energyData[key].value = value
                }
            }
        }
        if (jsonData2 && jsonData2.dateTime) {
            this.energyData.frameTime.value = jsonData2.dateTime
        }
    }

    getStatusData(jsonData) {
        const data = jsonData.data || jsonData
        const bitFields = [
            'group_voltage_uper_limit_early_alarm', 'group_voltage_lower_limit_early_alarm',
            'charge_current_uper_limit_early_alarm', 'discharge_current_uper_limit_early_alarm',
            'single_voltage_uper_limit_early_alarm', 'single_voltage_lower_limit_early_alarm',
            'charge_temperature_uper_limit_early_alarm', 'charge_temperature_lower_limit_early_alarm',
            'discharge_temperature_uper_limit_early_alarm', 'discharge_temperature_lower_limit_early_alarm',
            'single_temperature_uper_limit_early_alarm', 'single_temperature_lower_limit_early_alarm',
            'environment_temperature_uper_limit_early_alarm', 'environment_temperature_lower_limit_early_alarm',
            'power_line_temperature_uper_limit_early_alarm', 'group_soc_uper_limit_early_alarm',
            'group_soc_lower_limit_early_alarm', 'positive_insulation_resistance_lower_limit_early_alarm',
            'negative_insulation_resistance_lower_limit_early_alarm', 'case_voltage_uper_limit_early_alarm',
            'case_temperature_uper_limit_early_alarm'
        ]
        for (const key of bitFields) {
            if (data[key] != null && data[key] !== '' && data[key] !== '--') {
                if (this.stateData[key]) {
                    this.stateData[key].value = data[key] === 1 || data[key] === '1' ? '报警' : '正常'
                }
            }
        }
        if (data['group_battery_running_status'] != null) {
            this.stateData.group_battery_running_status.value = data['group_battery_running_status']
        }
        if (data['group_battery_charge_status'] != null) {
            this.stateData.group_battery_charge_status.value = this.setBatteryChargeState(data['group_battery_charge_status'])
        }
    }

    setBatteryChargeState(key) {
        switch (Number(key)) {
            case 1: return '开路'
            case 2: return '待机'
            case 3: return '充电'
            case 4: return '放电'
            default: return key
        }
    }
}

class EnergyData {
    frameTime = { name: '帧时间', value: '--' }
    group_voltage = { name: '组端电压', value: '--', unit: 'V' }
    group_current = { name: '组电流', value: '--', unit: 'A' }
    group_soc = { name: '组SOC', value: '--', unit: '%' }
    group_soh = { name: '组SOH', value: '--', unit: '%' }
    environment_temperature = { name: '环境温度', value: '--', unit: '℃' }
    group_positive_insulation_resistance = { name: '组正极绝缘电阻', value: '--', unit: 'kΩ' }
    group_negative_insulation_resistance = { name: '组负极绝缘电阻', value: '--', unit: 'kΩ' }
    group_charge_capacity = { name: '组可充电量', value: '--', unit: 'kWh' }
    group_discharge_capacity = { name: '组可放电量', value: '--', unit: 'kWh' }
    group_single_charge_capacity = { name: '组单次充电电量', value: '--', unit: 'kWh' }
    group_single_discharge_capacity = { name: '组单次放电电量', value: '--', unit: 'kWh' }
    group_total_charge_capacity = { name: '组累计充电电量', value: '--', unit: 'kWh' }
    group_total_discharge_capacity = { name: '组累计放电电量', value: '--', unit: 'kWh' }
    group_single_voltage_range_of_pressure = { name: '组单体电压压差极差值', value: '--', unit: 'V' }
    single_avg_voltage = { name: '单体电压平均值', value: '--', unit: 'V' }
    single_max_voltage = { name: '单体电压最大值', value: '--', unit: 'V' }
    single_min_voltage = { name: '单体电压最小值', value: '--', unit: 'V' }
    group_single_temperature_range_of_pressure = { name: '组单体温度温差极差值', value: '--', unit: '℃' }
    single_avg_temperature = { name: '单体温度平均值', value: '--', unit: '℃' }
    single_max_temperature = { name: '单体温度最大值', value: '--', unit: '℃' }
    single_min_temperature = { name: '单体温度最小值', value: '--', unit: '℃' }
    single_avg_internal_resistance = { name: '单体平均内阻', value: '--', unit: 'mΩ' }
    single_max_internal_resistance = { name: '单体内阻最大值', value: '--', unit: 'mΩ' }
    single_min_internal_resistance = { name: '单体内阻最小值', value: '--', unit: 'mΩ' }
    single_avg_soc = { name: '单体SOC平均值', value: '--', unit: '%' }
    single_max_soc = { name: '单体SOC最大值', value: '--', unit: '%' }
    single_min_soc = { name: '单体SOC最小值', value: '--', unit: '%' }
    single_avg_soh = { name: '单体SOH平均值', value: '--', unit: '%' }
    single_max_soh = { name: '单体SOH最大值', value: '--', unit: '%' }
    single_min_soh = { name: '单体SOH最小值', value: '--', unit: '%' }
    group_current_maximum_allowable_charge_power = { name: '组当前允许最大充电功率', value: '--', unit: 'kW' }
    group_current_maximum_allowable_discharge_power = { name: '组当前允许最大放电功率', value: '--', unit: 'kW' }
    group_current_maximum_allowable_charge_current = { name: '组当前允许最大充电电流', value: '--', unit: 'A' }
    group_current_maximum_allowable_discharge_current = { name: '组当前允许最大放电电流', value: '--', unit: 'A' }
    low_side_voltage = { name: '低压侧电压值', value: '--', unit: 'V' }
    low_side_current = { name: '低压侧电流值', value: '--', unit: 'A' }
    heat_sink_temperature = { name: '散热器温度值', value: '--', unit: '℃' }
    high_side_voltage = { name: '高压侧电压值', value: '--', unit: 'V' }
    high_side_current = { name: '高压侧电流值', value: '--', unit: 'A' }
    dc_bus_high_side_voltage = { name: '高压侧端口电压值(直流母线电压)', value: '--', unit: 'V' }
    battery_low_side_voltage = { name: '低压侧端口电压值(电池电压)', value: '--', unit: 'V' }
}

class StateData {
    group_battery_running_status = { name: '电池组运行状态', value: '--' }
    group_battery_charge_status = { name: '电池组充放电状态', value: '--' }
    group_voltage_uper_limit_early_alarm = { name: '组端电压上限预警', value: '--' }
    group_voltage_lower_limit_early_alarm = { name: '组端电压下限预警', value: '--' }
    charge_current_uper_limit_early_alarm = { name: '充电电流上限预警', value: '--' }
    discharge_current_uper_limit_early_alarm = { name: '放电电流上限预警', value: '--' }
    single_voltage_uper_limit_early_alarm = { name: '单体电压上限预警', value: '--' }
    single_voltage_lower_limit_early_alarm = { name: '单体电压下限预警', value: '--' }
    charge_temperature_uper_limit_early_alarm = { name: '充电温度上限预警', value: '--' }
    charge_temperature_lower_limit_early_alarm = { name: '充电温度下限预警', value: '--' }
    discharge_temperature_uper_limit_early_alarm = { name: '放电温度上限预警', value: '--' }
    discharge_temperature_lower_limit_early_alarm = { name: '放电温度下限预警', value: '--' }
    single_temperature_uper_limit_early_alarm = { name: '单体温度上限预警', value: '--' }
    single_temperature_lower_limit_early_alarm = { name: '单体温度下限预警', value: '--' }
    environment_temperature_uper_limit_early_alarm = { name: '环境温度上限预警', value: '--' }
    environment_temperature_lower_limit_early_alarm = { name: '环境温度下限预警', value: '--' }
    power_line_temperature_uper_limit_early_alarm = { name: '动力线温度上限预警', value: '--' }
    group_soc_uper_limit_early_alarm = { name: '组SOC上限预警', value: '--' }
    group_soc_lower_limit_early_alarm = { name: '组SOC下限预警', value: '--' }
    positive_insulation_resistance_lower_limit_early_alarm = { name: '正极绝缘电阻下限预警', value: '--' }
    negative_insulation_resistance_lower_limit_early_alarm = { name: '负极绝缘电阻下限预警', value: '--' }
    case_voltage_uper_limit_early_alarm = { name: '箱压差上限预警', value: '--' }
    case_temperature_uper_limit_early_alarm = { name: '箱温差上限预警', value: '--' }
}

class ControlData {
}
