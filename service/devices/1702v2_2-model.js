import DeviceBase from "./device-base.model"

export class Model1702v2_2 extends DeviceBase {
    energyData
    stateData
    controlData

    constructor() {
        super()
        this.energyData = new EnergyData()
        this.stateData = new StateData()
        this.controlData = new ControlData()
    }

    getEnergyData(jsonData) {
        const data = jsonData.data || jsonData
        const fields = [
            'muxiance_voltage', 'voltage_side_voltage',
            'electric_sense1', 'electric_sense2',
            'charge_power', 'discharge_power',
            'charge_capacity', 'discharge_capacity',
            'singleton_higher_voltage', 'singleton_lower_voltage'
        ]
        for (const key of fields) {
            if (this.energyData[key] && data[key] != null && data[key] !== '' && data[key] !== '--') {
                this.energyData[key].value = Number(data[key])
            }
        }
    }

    getStatusData(jsonData) {
        const data = jsonData.data || jsonData
        const enumMap = {
            'dc_dc_mode': enum_dc_dc_mode,
            'electric_core_type': enum_electric_core_type
        }
        const bitFields = [
            'dc_dc_ready', 'dc_dc_failure', 'muxiance_voltage_overhigh_protect',
            'muxiance_voltage_overlow_protect', 'muxiance_extreme_inverse_protect',
            'battery_side_voltage_overhigh_protect', 'battery_side_voltage_overlow_protect',
            'battery_exterme_inverse_protect', 'software_overflow_failure',
            'current_sense_failure', 'temperature_sense_failure',
            'connection_failed', 'hardware_overflow_failure'
        ]
        const valueFields = [
            'dc_dc_module_temperature', 'soc_value', 'single_temp_minus', 'soh', 'cycle_index'
        ]
        for (const key of valueFields) {
            if (this.stateData[key] && data[key] != null && data[key] !== '' && data[key] !== '--') {
                this.stateData[key].value = data[key]
            }
        }
        for (const key of bitFields) {
            if (this.stateData[key] && data[key] != null && data[key] !== '' && data[key] !== '--') {
                const val = String(data[key])
                this.stateData[key].value = enum_alarm[val] || val
            }
        }
        for (const key in enumMap) {
            if (this.stateData[key] && data[key] != null) {
                const val = String(data[key])
                this.stateData[key].value = enumMap[key][val] || val
            }
        }
    }
}

class EnergyData {
    muxiance_voltage = { name: '母线侧电压', value: '--', unit: 'V' }
    voltage_side_voltage = { name: '电池侧电压', value: '--', unit: 'V' }
    electric_sense1 = { name: '电感1电流', value: '--', unit: 'A' }
    electric_sense2 = { name: '电感2电流', value: '--', unit: 'A' }
    charge_power = { name: '充电功率', value: '--', unit: 'W' }
    discharge_power = { name: '放电功率', value: '--', unit: 'W' }
    charge_capacity = { name: '充电电量', value: '--', unit: 'kWh' }
    discharge_capacity = { name: '放电电量', value: '--', unit: 'kWh' }
    singleton_higher_voltage = { name: '单体电芯最高电压', value: '--', unit: 'mV' }
    singleton_lower_voltage = { name: '单体电芯最低电压', value: '--', unit: 'mV' }
}

class StateData {
    dc_dc_mode = { name: 'DC/DC工作模式', value: '--' }
    dc_dc_module_temperature = { name: 'DC-DC模块温度', value: '--', unit: '℃' }
    soc_value = { name: 'SOC数值', value: '--', unit: '%' }
    single_temp_minus = { name: '单体温度差', value: '--', unit: '℃' }
    electric_core_type = { name: '电芯类型', value: '--' }
    soh = { name: 'SOH', value: '--', unit: '%' }
    cycle_index = { name: '循环次数', value: '--' }
    dc_dc_ready = { name: 'DC/DC准备状态', value: '--' }
    dc_dc_failure = { name: 'DC/DC故障状态', value: '--' }
    muxiance_voltage_overhigh_protect = { name: '母线侧电压过高保护', value: '--' }
    muxiance_voltage_overlow_protect = { name: '母线侧电压过低保护', value: '--' }
    muxiance_extreme_inverse_protect = { name: '母线侧极性反接保护', value: '--' }
    battery_side_voltage_overhigh_protect = { name: '电池侧电压过高保护', value: '--' }
    battery_side_voltage_overlow_protect = { name: '电池侧电压过低保护', value: '--' }
    battery_exterme_inverse_protect = { name: '电池侧极性反接保护', value: '--' }
    software_overflow_failure = { name: '软件过流故障', value: '--' }
    current_sense_failure = { name: '电流传感器故障', value: '--' }
    temperature_sense_failure = { name: '温度传感器故障', value: '--' }
    connection_failed = { name: '通信故障', value: '--' }
    hardware_overflow_failure = { name: '硬件过流故障', value: '--' }
    reserver1 = { name: '预留1', value: '--' }
    reserver2 = { name: '预留2', value: '--' }
    reserver3 = { name: '预留3', value: '--' }
}

class ControlData {
}

const enum_dc_dc_mode = {
    '00': '正常', '01': '放电', '10': '充电', '11': '无效'
}

const enum_electric_core_type = {
    '01': '三元', '02': '钛酸锂', '03': '钛酸铁锂'
}

const enum_alarm = {
    '0': '正常', '1': '故障'
}
