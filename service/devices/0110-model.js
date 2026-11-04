import DeviceBase from "./device-base.model"

export class Model0110 extends DeviceBase {
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
        if (data.B84 != null && data.B84 !== '' && data.B84 !== '--') {
            this.energyData.power.value = (Number(data.B84) / 1000).toFixed(2)
        }
        if (jsonData2 && jsonData2.dateTime) {
            this.energyData.frameTime.value = jsonData2.dateTime
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
    frameTime = { name: '帧时间', value: '--' }
    power = { name: '功率', value: '--', unit: 'kW' }
}

class StateData {
}

class ControlData {
}
