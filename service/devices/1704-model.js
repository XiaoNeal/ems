import DeviceBase from "./device-base.model"

export class Model1704 extends DeviceBase {
    energyData
    stateData
    controlData
    batteryStackEnergyData
    batteryStackStateData

    constructor(number) {
        super()
        const str = number ? '簇' + number : ''
        this.energyData = new EnergyData(str)
        this.stateData = new StateData(str)
        this.controlData = new ControlData()
        this.batteryStackEnergyData = new BatteryStackEnergyData()
        this.batteryStackStateData = new BatteryStackStateData(str)
    }

    getEnergyData(jsonData) {
        const data = jsonData.data || jsonData
        // 电池堆数据
        const stackFields = [
            ['voltage', 'B0'], ['current', 'B2'], ['soc', 'B4'],
            ['soh', 'B6'], ['soe', 'B8'],
            ['maxCellVoltage', 'B10'], ['minCellVoltage', 'B12'],
            ['maxCellTemperature', 'B14'], ['minCellTemperature', 'B16'],
            ['chargeLimitCurrent', 'B18'], ['dischargeLimitCurrent', 'B20'],
            ['chargeLimitVoltage', 'B22'], ['dischargeLimitVoltage', 'B24'],
            ['chargeAvailableEletricity', 'B26'], ['dischargeAvailableEletricity', 'B28'],
            ['totalCharge', 'B30'], ['totalDischarge', 'B34']
        ]
        for (const [field, key] of stackFields) {
            if (data[key] != null && data[key] !== '' && data[key] !== '--') {
                let value = data[key]
                if (['maxCellTemperature', 'minCellTemperature'].includes(field)) {
                    value = Number(value).toFixed(2)
                }
                this.batteryStackEnergyData[field].value = value
            }
        }
        // 电池簇数据
        const clusterFields = [
            ['voltage', 'B38'], ['current', 'B40'], ['soc', 'B42'],
            ['soh', 'B44'], ['soe', 'B46'],
            ['maxCellVoltage', 'B48'], ['maxCellVoltageId', 'B50'],
            ['minCellVoltage', 'B52'], ['minCellVoltageId', 'B54'],
            ['maxCellTemperature', 'B56'], ['maxCellTemperatureId', 'B58'],
            ['minCellTemperature', 'B60'], ['minCellTemperatureId', 'B62']
        ]
        for (const [field, key] of clusterFields) {
            if (data[key] != null && data[key] !== '' && data[key] !== '--') {
                this.energyData[field].value = data[key]
            }
        }
    }

    getStatusData(jsonData) {
        const data = jsonData.data || jsonData
        // 电池堆状态
        if (data.B0 != null) {
            this.batteryStackStateData.runState.value = runStateEnum[data.B0] || data.B0
        }
        if (data.B2 != null) {
            this.batteryStackStateData.chargeState.value = chargeStateEnum[data.B2] || data.B2
        }
        if (data.B4 != null) {
            this.batteryStackStateData.alarmLevel.value = alarmLevelEnum[data.B4] || data.B4
        }
        // 电池簇状态
        const stateFields = [
            ['runState', 'B6'], ['chargeState', 'B8'],
            ['alarmLevel', 'B10'], ['chargerState', 'B12'],
            ['mainNegativeState', 'B14'], ['mainPositiveState', 'B16']
        ]
        const enumMap = {
            'runState': runStateEnum,
            'chargeState': chargeStateEnum,
            'alarmLevel': alarmLevelEnum,
            'chargerState': circuitStateEnum,
            'mainNegativeState': circuitStateEnum,
            'mainPositiveState': circuitStateEnum
        }
        for (const [field, key] of stateFields) {
            if (data[key] != null) {
                const val = String(data[key])
                this.stateData[field].value = enumMap[field][val] || val
            }
        }
    }
}

class EnergyData {
    constructor(str) {
        this.voltage = { name: str + '电压(V)', value: '--', unit: 'V' }
        this.current = { name: str + '电流(A)', value: '--', unit: 'A' }
        this.soc = { name: str + 'SOC(%)', value: '--', unit: '%' }
        this.soh = { name: str + 'SOH(%)', value: '--', unit: '%' }
        this.soe = { name: str + 'SOE(%)', value: '--', unit: '%' }
        this.maxCellVoltage = { name: str + '单体最高电压(V)', value: '--', unit: 'V' }
        this.maxCellVoltageId = { name: str + '单体最高电压ID', value: '--' }
        this.minCellVoltage = { name: str + '单体最低电压(V)', value: '--', unit: 'V' }
        this.minCellVoltageId = { name: str + '单体最低电压ID', value: '--' }
        this.maxCellTemperature = { name: str + '单体最高温度(℃)', value: '--', unit: '℃' }
        this.maxCellTemperatureId = { name: str + '单体最高温度ID', value: '--' }
        this.minCellTemperature = { name: str + '单体最低温度(℃)', value: '--', unit: '℃' }
        this.minCellTemperatureId = { name: str + '单体最低温度ID', value: '--' }
    }
}

class StateData {
    constructor(str) {
        this.runState = { name: str + '运行状态', value: '--' }
        this.chargeState = { name: str + '充放电状态', value: '--' }
        this.alarmLevel = { name: str + '告警等级', value: '--' }
        this.chargerState = { name: str + '预充电器状态', value: '--' }
        this.mainNegativeState = { name: str + '主负继电器状态', value: '--' }
        this.mainPositiveState = { name: str + '主正继电器状态', value: '--' }
    }
}

class BatteryStackEnergyData {
    constructor() {
        this.voltage = { name: '电压(V)', value: '--', unit: 'V' }
        this.current = { name: '电流(A)', value: '--', unit: 'A' }
        this.soc = { name: 'SOC', value: '--', unit: '%' }
        this.soh = { name: 'SOH', value: '--', unit: '%' }
        this.soe = { name: 'SOE', value: '--', unit: '%' }
        this.maxCellVoltage = { name: '单体最高电压(V)', value: '--', unit: 'V' }
        this.minCellVoltage = { name: '单体最低电压(V)', value: '--', unit: 'V' }
        this.maxCellTemperature = { name: '单体最高温度', value: '--', unit: '℃' }
        this.minCellTemperature = { name: '单体最低温度', value: '--', unit: '℃' }
        this.chargeLimitCurrent = { name: '充电限制电流(A)', value: '--', unit: 'A' }
        this.dischargeLimitCurrent = { name: '放电限制电流(A)', value: '--', unit: 'A' }
        this.chargeLimitVoltage = { name: '充电限制电压(V)', value: '--', unit: 'V' }
        this.dischargeLimitVoltage = { name: '放电限制电压(V)', value: '--', unit: 'V' }
        this.chargeAvailableEletricity = { name: '充电可用电量(kWh)', value: '--', unit: 'kWh' }
        this.dischargeAvailableEletricity = { name: '放电可用电量(kWh)', value: '--', unit: 'kWh' }
        this.totalCharge = { name: '总充电量(kWh)', value: '--', unit: 'kWh' }
        this.totalDischarge = { name: '总放电量(kWh)', value: '--', unit: 'kWh' }
    }
}

class BatteryStackStateData {
    constructor(str) {
        this.runState = { name: str + '运行状态', value: '--' }
        this.chargeState = { name: str + '充放电状态', value: '--' }
        this.alarmLevel = { name: str + '告警等级', value: '--' }
    }
}

class ControlData {
}

const runStateEnum = {
    '0': '初始化', '1': '开路静置', '2': '禁充放',
    '3': '正常状态', '4': '禁充', '5': '禁放'
}

const chargeStateEnum = {
    '0': '初始化', '1': '充电', '2': '放电', '3': '静置'
}

const alarmLevelEnum = {
    '0': '无告警', '1': '一级告警', '2': '二级告警', '3': '三级告警'
}

const circuitStateEnum = {
    '0': '断开', '1': '闭合'
}
