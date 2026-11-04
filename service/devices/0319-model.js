import DeviceBase from "./device-base.model"

export class Model0319 extends DeviceBase {
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
            'responseStatus', 'responseMode', 'responseTime',
            'outdoorUnitRealPower', 'outdoorUnitTargetPower',
            'setSoftValue', 'busVoltage',
            'forwardEnergy', 'reverseEnergy',
            'runMode', 'breakdown', 'envTemperature',
            'indoorOneStatus', 'indoorOneRunMode', 'indoorOneSetTemperature',
            'indoorOneSetWindSpeed', 'indoorOneEnvTemperature',
            'indoorTwoStatus', 'indoorTwoRunMode', 'indoorTwoSetTemperature',
            'indoorTwoSetWindSpeed', 'indoorTwoEnvTemperature'
        ]
        for (const key of fields) {
            if (this.energyData[key] && data[key] != null && data[key] !== '' && data[key] !== '--') {
                let value = data[key]
                if (key === 'responseTime') {
                    value = Number(value)
                } else if (['outdoorUnitRealPower', 'outdoorUnitTargetPower', 'setSoftValue', 'busVoltage', 'forwardEnergy', 'reverseEnergy', 'envTemperature', 'indoorOneSetTemperature', 'indoorOneEnvTemperature', 'indoorTwoSetTemperature', 'indoorTwoEnvTemperature'].includes(key)) {
                    value = parseFloat(value).toFixed(2)
                }
                this.energyData[key].value = value
            }
        }
    }

    getStatusData(jsonData) {
        const data = jsonData.data || jsonData
        for (const key in data) {
            if (this.stateData.hasOwnProperty(key) && this.stateData[key]) {
                this.stateData[key].value = data[key]
            }
        }
    }
}

class EnergyData {
    responseStatus = { name: '需求响应模式状态', value: '--' }
    responseMode = { name: '功率响应命令持续模式', value: '--' }
    responseTime = { name: '需求响应模式维持时间', value: '--', unit: 'min' }
    outdoorUnitRealPower = { name: '室外机总实时功率', value: '--', unit: 'W' }
    outdoorUnitTargetPower = { name: '室外机目标功率', value: '--', unit: 'W' }
    setSoftValue = { name: '设定柔度值', value: '--' }
    busVoltage = { name: '母线电压', value: '--', unit: 'V' }
    forwardEnergy = { name: '正向电度', value: '--', unit: 'kWh' }
    reverseEnergy = { name: '反向电度', value: '--', unit: 'kWh' }
    runMode = { name: '整机运行模式', value: '--' }
    breakdown = { name: '停整机故障', value: '--' }
    envTemperature = { name: '室外环境温度', value: '--', unit: '℃' }
    indoorOneStatus = { name: '室内机1启停状态', value: '--' }
    indoorOneRunMode = { name: '室内机1运行模式', value: '--' }
    indoorOneSetTemperature = { name: '室内机1温度设定', value: '--', unit: '℃' }
    indoorOneSetWindSpeed = { name: '室内机1风速设定', value: '--' }
    indoorOneEnvTemperature = { name: '室内机1室内环境温度', value: '--', unit: '℃' }
    indoorTwoStatus = { name: '室内机2启停状态', value: '--' }
    indoorTwoRunMode = { name: '室内机2运行模式', value: '--' }
    indoorTwoSetTemperature = { name: '室内机2温度设定', value: '--', unit: '℃' }
    indoorTwoSetWindSpeed = { name: '室内机2风速设定', value: '--' }
    indoorTwoEnvTemperature = { name: '室内机2室内环境温度', value: '--', unit: '℃' }
}

class StateData {
}

class ControlData {
}

const EnumResponseStatus = (data) => {
    switch (data) {
        case 0: return "自由运行模式"
        case 1: return "能源站屏幕调控中"
        case 2: return "能源站PN值调控中"
        case 3: return "网页三级调控中"
        case 4: return "碳排放责任因子调控中"
        default: return "--"
    }
}

const EnumResponseMode = (data) => {
    switch (data) {
        case 0: return "自由运行"
        case 1: return "1级响应(25%)"
        case 2: return "2级响应(50%)"
        case 3: return "3级响应(75%)"
        default: return "--"
    }
}

const EnumRunMode = (data) => {
    switch (data) {
        case 0: return "无效"
        case 1: return "单冷"
        case 2: return "制热"
        case 3: return "冷暖"
        case 4: return "送风"
        default: return "--"
    }
}

const EnumBreakDown = (data) => {
    switch (data) {
        case 0: return "正常"
        case 1: return "故障"
        default: return "--"
    }
}

const EnumIndoorStatus = (data) => {
    switch (data) {
        case 0: return "关"
        case 1: return "开"
        default: return "--"
    }
}

const EnumIndoorRunMode = (data) => {
    switch (data) {
        case 0: return "无效"
        case 1: return "制冷"
        case 2: return "抽湿"
        case 3: return "送风"
        case 4: return "制热"
        case 5: return "自动"
        case 6: return "地暖"
        case 7: return "快热"
        case 8: return "供暖"
        default: return "--"
    }
}

const EnumSetWindSpeed = (data) => {
    switch (data) {
        case 0: return "无效"
        case 1: return "自动风速"
        case 2: return "低档"
        case 3: return "中低档"
        case 4: return "中档"
        case 5: return "中高档"
        case 6: return "高档"
        default: return "--"
    }
}
