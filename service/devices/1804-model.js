
import DeviceBase from "./device-base.model"

class Model1804 extends DeviceBase {

    energyData;
    stateData;

    constructor() {
        super()
        this.energyData = new Meter1804EnergyData()
        this.stateData = new Meter1804StateData()
    }

    getData(json) {
        if (json.dataType == "2") {
            this.getEnergyData(json.data)
        }
    }

    getEnergyData(data) {
        this.energyData.voltage.value = parseFloat(data.B0).toFixed(2)
        this.energyData.current.value = parseFloat(data.B4).toFixed(2)
        this.energyData.power.value = parseFloat(data.B8).toFixed(2)
        this.energyData.forwardEnergy.value = parseFloat(data.B12).toFixed(2)
        this.energyData.reverseEnergy.value = parseFloat(data.B16).toFixed(2)
        this.energyData.dayForwardEnergy.value = parseFloat(data.B20).toFixed(2)
        this.energyData.dayReverseEnergy.value = parseFloat(data.B24).toFixed(2)
    }
    }


class Meter1804EnergyData {
    constructor() {
        this.voltage = { name: '电压', value: '--', unit: 'V' }
        this.current = { name: '电流', value: '--', unit: 'A' }
        this.power = { name: '功率', value: '--', unit: 'W' }
        this.forwardEnergy = { name: '正向电能', value: '--', unit: 'kWh' }
        this.reverseEnergy = { name: '反向电能', value: '--', unit: 'kWh' }
        this.dayForwardEnergy = { name: '日正向电能', value: '--', unit: 'kWh' }
        this.dayReverseEnergy = { name: '日反向电能', value: '--', unit: 'kWh' }
    }
}

class Meter1804StateData {
    constructor() {

    }
}

export { Model1804 };

