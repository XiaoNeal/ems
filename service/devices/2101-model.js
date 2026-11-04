import DeviceBase from "./device-base.model"

export class Model2101 extends DeviceBase {
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
            this.energyData.voltage.value = parseFloat(data.B0).toFixed(2)
        }
        if (data.B4 != null && data.B4 !== '' && data.B4 !== '--') {
            this.energyData.current.value = parseFloat(data.B4).toFixed(2)
        }
        if (data.B8 != null && data.B8 !== '' && data.B8 !== '--') {
            this.energyData.power.value = parseFloat(data.B8).toFixed(2)
        }
        if (data.B12 != null && data.B12 !== '' && data.B12 !== '--') {
            this.energyData.forwardEnergy.value = parseFloat(data.B12).toFixed(2)
        }
        if (data.B16 != null && data.B16 !== '' && data.B16 !== '--') {
            this.energyData.reverseEnergy.value = parseFloat(data.B16).toFixed(2)
        }
    }

    getStatusData(jsonData) {
        const data = jsonData.data || jsonData
        if (data.B0 != null) {
            this.stateData.enableSetVoltageAndPower.value = enumEnableSetVoltageAndPower(data.B0)
        }
        if (data.B1 != null) {
            this.stateData.voltageSensingTime.value = data.B1
        }
        if (data.B3 != null) {
            this.stateData.amplificationFactor.value = data.B3
        }
    }
}

class EnergyData {
    voltage = { name: '电压', value: '--', unit: 'V' }
    current = { name: '电流', value: '--', unit: 'A' }
    power = { name: '功率', value: '--', unit: 'W' }
    forwardEnergy = { name: '正向电能', value: '--', unit: 'kWh' }
    reverseEnergy = { name: '反向电能', value: '--', unit: 'kWh' }
}

class StateData {
    enableSetVoltageAndPower = { name: '调压调功使能', value: '--' }
    voltageSensingTime = { name: '电压感知时间', value: '--', unit: 's' }
    amplificationFactor = { name: '放大系数', value: '--' }
}

class ControlData {
    enableSetVoltageAndPower = { name: '调压调功使能', value: '--' }
    voltageSensingTime = { name: '电压感知时间', value: '--', unit: 's' }
    amplificationFactor = { name: '放大系数', value: '--' }
}

const enumEnableSetVoltageAndPower = (data) => {
    switch (data) {
        case 0: return '开'
        case 1: return '关'
        default: return data
    }
}
