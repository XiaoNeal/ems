import DeviceBase from "./device-base.model"

export class Model230A extends DeviceBase {
    energyData
    stateData
    alarmData
    controlData

    constructor() {
        super()
        this.energyData = new EnergyData()
        this.stateData = new StateData()
        this.alarmData = new AlarmData()
        this.controlData = new ControlData()
    }

    getEnergyData(jsonData) {
        const data = jsonData.data || jsonData
        if (data.B4 != null && data.B4 !== '' && data.B4 !== '--') {
            this.energyData.containerAPressure.value = Number(data.B4).toFixed(2)
        }
        if (data.B8 != null && data.B8 !== '' && data.B8 !== '--') {
            this.energyData.containerBPressure.value = Number(data.B8).toFixed(2)
        }
        if (data.B28 != null && data.B28 !== '' && data.B28 !== '--') {
            this.energyData.dewPointTemp.value = Number(data.B28).toFixed(2)
        }
        if (data.B12 != null && data.B12 !== '' && data.B12 !== '--') {
            this.energyData.inletTemp.value = Number(data.B12).toFixed(2)
        }
        if (data.B16 != null && data.B16 !== '' && data.B16 !== '--') {
            this.energyData.heaterTemp.value = Number(data.B16).toFixed(2)
        }
    }

    getStatusData(jsonData) {
        const data = jsonData.data || jsonData
        const fields = ['B0', 'B4', 'B8', 'B12', 'B16', 'B20', 'B24', 'B28', 'B32']
        for (const key of fields) {
            if (this.stateData[key] && data[key] != null && data[key] !== '' && data[key] !== '--') {
                let value = data[key]
                if (key === 'B32') {
                    value = value == 0 ? '停机' : (value == 1 ? '运行' : '故障')
                }
                this.stateData[key].value = value
            }
        }
    }
}

class EnergyData {
    containerAPressure = { name: 'A塔压力', value: '--', unit: 'MPa' }
    containerBPressure = { name: 'B塔压力', value: '--', unit: 'MPa' }
    dewPointTemp = { name: '露点温度', value: '--', unit: '℃' }
    inletTemp = { name: '进气温度', value: '--', unit: '℃' }
    heaterTemp = { name: '加热温度', value: '--', unit: '℃' }
}

class StateData {
    B0 = { name: '风机电流', value: '--', unit: 'A' }
    B4 = { name: 'A塔压力', value: '--', unit: 'MPa' }
    B8 = { name: 'B塔压力', value: '--', unit: 'MPa' }
    B12 = { name: '实时进气温度', value: '--', unit: '℃' }
    B16 = { name: '实时加热温度', value: '--', unit: '℃' }
    B20 = { name: '实时冷却温度', value: '--', unit: '℃' }
    B24 = { name: '实时放空温度', value: '--', unit: '℃' }
    B28 = { name: '实时露点温度', value: '--', unit: '℃' }
    B32 = { name: '设备状态', value: '--' }
}

class AlarmData {
}

class ControlData {
}
