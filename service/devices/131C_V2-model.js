import DeviceBase from "./device-base.model"

// (0x131C) EM42 环境监测 V2.0 —— 与网页版 131Cv2-model.js 对齐
export class Model131C_V2 extends DeviceBase {
  constructor() {
    super();
    this.energyData = new EnergyData()
    this.statusData = new StatusData()
  }

  getEnergyData(jsonData) {

  }

  getStatusData(jsonData) {
    if (!jsonData || !jsonData.data) return
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
