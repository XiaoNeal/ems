import DeviceBase from "./device-base.model"

export class Model1704v1_1 extends DeviceBase {
    energyData
    stateData
    controlData

    constructor(number) {
        super()
        const str = number ? '簇' + number : ''
        this.energyData = new EnergyData(str)
        this.stateData = new StateData(str)
        this.controlData = new ControlData()
    }

    getEnergyData(jsonData) {
        const data = jsonData.data || jsonData
        const fields = [
            ['voltage', 'B38'], ['current', 'B40'], ['soc', 'B42'],
            ['soh', 'B44'], ['soe', 'B46'],
            ['maxCellVoltage', 'B48'], ['maxCellVoltageId', 'B50'],
            ['minCellVoltage', 'B52'], ['minCellVoltageId', 'B54'],
            ['maxCellTemperature', 'B56'], ['maxCellTemperatureId', 'B58'],
            ['minCellTemperature', 'B60'], ['minCellTemperatureId', 'B62']
        ]
        for (const [field, key] of fields) {
            if (data[key] != null && data[key] !== '' && data[key] !== '--') {
                this.energyData[field].value = data[key]
            }
        }
    }

    getStatusData(jsonData) {
        const data = jsonData.data || jsonData
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
        this.soc = { name: str + 'SOC', value: '--', unit: '%' }
        this.soh = { name: str + 'SOH', value: '--', unit: '%' }
        this.soe = { name: str + 'SOE', value: '--', unit: '%' }
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
