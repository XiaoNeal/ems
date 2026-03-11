
import DeviceBase from "./device-base.model"

class Model2101 extends DeviceBase {

    energyData;
    stateData;
    controlData;

    constructor () {
      super()
      this.energyData = new Meter2101EnergyData()
      this.stateData = new Meter2101StateData()
      this.controlData = new Meter2101ControlData()
    }

    getData (json) {
      if (json.dataType == '2') {
        this.getEnergyData(json)
      }
      if (json.dataType == '3') {
        this.getStatusData(json)
      }
    }

    getEnergyData (jsonData) {
      const { data } = jsonData
      this.energyData.voltage.value = parseFloat(data.B0).toFixed(2)
      this.energyData.current.value = parseFloat(data.B4).toFixed(2)
      this.energyData.power.value = parseFloat(data.B8).toFixed(2)
      this.energyData.forwardEnergy.value = parseFloat(data.B12).toFixed(2)
      this.energyData.reverseEnergy.value = parseFloat(data.B16).toFixed(2)
    }

    getStatusData (jsonData) {
      const { data } = jsonData
      this.stateData.enableSetVoltageAndPower.value = enumEnableSetVoltageAndPower(data.B0)
      this.stateData.voltageSensingTime.value = data.B1
      this.stateData.amplificationFactor.value = data.B3
    }
}

class Meter2101EnergyData {
  constructor () {
    this.voltage = { name: '电压', value: '--', unit: 'V' }
    this.current = { name: '电流', value: '--', unit: 'A' }
    this.power = { name: '功率', value: '--', unit: 'W' }
    this.forwardEnergy = { name: '正向电能', value: '--', unit: 'kWh' }
    this.reverseEnergy = { name: '反向电能', value: '--', unit: 'kWh' }
  }
}

class Meter2101StateData {
  constructor () {
    this.enableSetVoltageAndPower = { name: '调压调功使能', value: '--' }
    this.voltageSensingTime = { name: '电压感知时间', value: '--', unit: 's' }
    this.amplificationFactor = { name: '放大系数', value: '--' }
  }
}

class Meter2101ControlData {
  constructor () {
    this.enableSetVoltageAndPower = { name: '调压调功使能', value: '--' }
    this.voltageSensingTime = { name: '电压感知时间', value: '--', unit: 's' }
    this.amplificationFactor = { name: '放大系数', value: '--' }
  }
}

const enumEnableSetVoltageAndPower = (data) => {
  switch (data) {
    case 0:
      return '开'
    case 1:
      return '关'
  }
}

export { Model2101 };
