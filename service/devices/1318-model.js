import DeviceBase from "./device-base.model"

export class Model1318 extends DeviceBase {
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
            this.energyData.transientFlowCondition.value = this.toFixed(data.B0)
        }
        if (data.B4 != null && data.B4 !== '' && data.B4 !== '--') {
            this.energyData.totalFlowCondition.value = this.toFixed(data.B4)
        }
        if (data.B12 != null && data.B12 !== '' && data.B12 !== '--') {
            this.energyData.transientFlowStardard.value = this.toFixed(data.B12)
            this.energyData.flow.value = this.toFixed(data.B12)
        }
        if (data.B16 != null && data.B16 !== '' && data.B16 !== '--') {
            this.energyData.totalFlowStardard.value = this.toFixed(data.B16)
            this.energyData.useQuantity.value = this.toFixed(data.B16)
        }
    }

    getStatusData(jsonData) {
        const data = jsonData.data || jsonData
        if (data.B0 != null && data.B0 !== '' && data.B0 !== '--') {
            this.energyData.temperature.value = this.toFixed(data.B0)
        }
        if (data.B4 != null && data.B4 !== '' && data.B4 !== '--') {
            this.energyData.pressure.value = this.toFixed(data.B4)
        }
        if (data.B8 != null) {
            this.energyData.pressureUnit.value = data.B8
        }
    }

    toFixed(data) {
        return !isNaN(parseFloat(data)) ? parseFloat(data).toFixed(2) : '--'
    }
}

class EnergyData {
    temperature = { name: '温度', value: '--', unit: '℃' }
    pressure = { name: '压力', value: '--', unit: 'MPa' }
    pressureUnit = { name: '压力单位', value: '--' }
    frontCompensatoryFlow = { name: '补偿前流量', value: '--', unit: 'm³/h' }
    laterCompensatoryFlow = { name: '补偿后流量', value: '--', unit: 'm³/h' }
    accumulativeFlow = { name: '累计流量', value: '--', unit: 'm³' }
    density = { name: '密度', value: '--', unit: 'kg/m³' }
    useQuantity = { name: '用量', value: '--', unit: 'm³' }
    flow = { name: '瞬时流量', value: '--', unit: 'm³/h' }
    purity = { name: '纯度', value: '--', unit: '%' }
    temperatureDewPoint = { name: '压力露点', value: '--', unit: '℃' }
    atmosphericDewPoint = { name: '常压露点', value: '--', unit: '℃' }
    transientFlowCondition = { name: '工况瞬时流量', value: '--', unit: 'm³/h' }
    totalFlowCondition = { name: '工况累计流量', value: '--', unit: 'm³' }
    transientFlowStardard = { name: '标况瞬时流量', value: '--', unit: 'm³/h' }
    totalFlowStardard = { name: '标况累计流量', value: '--', unit: 'm³' }
}

class StateData {
}

class ControlData {
}
