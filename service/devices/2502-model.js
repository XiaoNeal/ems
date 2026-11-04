import DeviceBase from "./device-base.model"

export class Model2502 extends DeviceBase {
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
        if (data.B0 != null && data.B0 !== '' && data.B0 !== '--') {
            this.energyData.waterFlow.value = Number(data.B0)
        }
        if (data.B4 != null && data.B4 !== '' && data.B4 !== '--') {
            this.energyData.speed.value = Number(data.B4)
        }
        if (data.B8 != null && data.B8 !== '' && data.B8 !== '--' && data.B12 != null) {
            this.energyData.positiveCum.value = parseFloat(data.B8 + "." + data.B12).toFixed(2)
        }
        if (data.B16 != null && data.B16 !== '' && data.B16 !== '--' && data.B20 != null) {
            this.energyData.reverseCum.value = parseFloat(data.B16 + "." + data.B20).toFixed(2)
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
    waterFlow = { name: '水流量', value: '--', unit: 'm³/h' }
    speed = { name: '流速', value: '--', unit: 'm/s' }
    positiveCum = { name: '正向累计流量', value: '--', unit: 'm³' }
    reverseCum = { name: '反向累计流量', value: '--', unit: 'm³' }
    temperature = { name: '温度', value: '--', unit: '℃' }
    pressure = { name: '压力', value: '--', unit: 'MPa' }
    waterConsumption = { name: '用水量', value: '--', unit: 'm³' }
    dateTime = { name: '时间', value: '--' }
}

class StateData {
}

class ControlData {
}
