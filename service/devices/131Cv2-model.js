import DeviceBase from "./device-base.model"

export class Model131Cv2 extends DeviceBase {
  constructor () {
    super();
    this.energyData = new EnergyData()
    this.statusData = new StatusData()
  }

  getEnergyData(jsonData) {

  }

  getStatusData(jsonData) {
    this.statusData.temperature.value = jsonData.data.B0
    this.statusData.humidness.value = jsonData.data.B4
  }
}

class EnergyData {

}

class StatusData {
    temperature = { name: '温度', value: '--', unit: '℃' }
    humidness = { name: '湿度', value: '--', unit: '%RH' }
}
