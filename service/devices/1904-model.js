import DeviceBase from "./device-base.model"

export class Model1904 extends DeviceBase {
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
        for (let i = 1; i <= 8; i++) {
            const prefix = String(i)
            const fields = [
                `totalFlowStardard${prefix}`, `transientFlowStardard${prefix}`,
                `transientFlowCondition${prefix}`, `temperature${prefix}`,
                `pressure${prefix}`, `allowance${prefix}`
            ]
            for (const key of fields) {
                if (this.energyData[key] && data[key] != null && data[key] !== '' && data[key] !== '--') {
                    this.energyData[key].value = this.toFixed(data[key])
                }
            }
            const inletKey = `inletPressure${prefix}`
            if (this.energyData[inletKey] && data[inletKey] != null) {
                this.energyData[inletKey].value = data[inletKey]
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

    toFixed(data) {
        return !isNaN(parseFloat(data)) ? parseFloat(data).toFixed(2) : '--'
    }
}

class EnergyData {
    constructor() {
        for (let i = 1; i <= 8; i++) {
            const prefix = String(i)
            this[`totalFlowStardard${prefix}`] = { name: `总流量标况${prefix}`, value: '--', unit: 'm³' }
            this[`transientFlowStardard${prefix}`] = { name: `瞬时流量标况${prefix}`, value: '--', unit: 'm³/h' }
            this[`transientFlowCondition${prefix}`] = { name: `瞬时流量工况${prefix}`, value: '--', unit: 'm³/h' }
            this[`temperature${prefix}`] = { name: `温度${prefix}`, value: '--', unit: '℃' }
            this[`pressure${prefix}`] = { name: `压力${prefix}`, value: '--', unit: 'MPa' }
            this[`allowance${prefix}`] = { name: `余量${prefix}`, value: '--', unit: '%' }
            if (i % 2 === 0) {
                this[`inletPressure${prefix}`] = { name: `入口压力${prefix}`, value: '--', unit: 'MPa' }
            }
        }
    }
}

class StateData {
}

class ControlData {
}
