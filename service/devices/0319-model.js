
import DeviceBase from "./device-base.model"

class Model0319 extends DeviceBase {

    energyData;
    stateData;

    constructor () {
      super()
      this.energyData = new Meter0319EnergyData()
      this.stateData = new Meter0319StateData()
    }

    getData (json) {
      if (json.dataType == "2") {
        this.getEnergyData(json.data)
      }
      if (json.dataType == "3") {
        this.getStatusData(json)
      }
    }

    getEnergyData (data) {
      
    }

    getStatusData (jsonData) {
      const { data } = jsonData
      this.stateData.responseStatus.value = EnumResponseStatus(data.B0)
      this.stateData.responseMode.value = EnumResponseMode(data.B1)
      this.stateData.responseTime.value = parseFloat(data.B2)
      this.stateData.outdoorUnitRealPower.value = parseFloat(data.B4).toFixed(2)
      this.stateData.outdoorUnitTargetPower.value = parseFloat(data.B8).toFixed(2)
      this.stateData.setSoftValue.value = parseFloat(data.B12).toFixed(2)
      this.stateData.busVoltage.value = parseFloat(data.B13).toFixed(2)
      this.stateData.forwardEnergy.value = parseFloat(data.B17).toFixed(2)
      this.stateData.reverseEnergy.value = parseFloat(data.B21).toFixed(2)
      this.stateData.runMode.value = EnumRunMode(data.B25)
      this.stateData.breakdown.value = EnumBreakDown(data.B26)
      this.stateData.envTemperature.value = parseFloat(data.B27).toFixed(2)
      this.stateData.indoorOneStatus.value = EnumIndoorStatus(data.B31)
      this.stateData.indoorOneRunMode.value = EnumIndoorRunMode(data.B32)
      this.stateData.indoorOneSetTemperature.value = parseFloat(data.B33).toFixed(2)
      this.stateData.indoorOneSetWindSpeed.value = EnumSetWindSpeed(data.B35)
      this.stateData.indoorOneEnvTemperature.value = parseFloat(data.B36).toFixed(2)
      this.stateData.indoorTwoStatus.value = EnumIndoorStatus(data.B41)
      this.stateData.indoorTwoRunMode.value = EnumIndoorRunMode(data.B42)
      this.stateData.indoorTwoSetTemperature.value = parseFloat(data.B43).toFixed(2)
      this.stateData.indoorTwoSetWindSpeed.value = EnumSetWindSpeed(data.B45)
      this.stateData.indoorTwoEnvTemperature.value = parseFloat(data.B46).toFixed(2)
    }
}

class Meter0319EnergyData {
  constructor () {
    
  }
}

class Meter0319StateData {
  constructor () {
    this.responseStatus = { name: '需求响应模式状态', value: '--' }
    this.responseMode = { name: '功率响应命令持续模式', value: '--' }
    this.responseTime = { name: '需求响应模式维持时间', value: '--', unit: 'min' }
    this.outdoorUnitRealPower = { name: '室外机总实时功率', value: '--', unit: 'W' }
    this.outdoorUnitTargetPower = { name: '室外机目标功率', value: '--', unit: 'W' }
    this.setSoftValue = { name: '设定柔度值', value: '--' }
    this.busVoltage = { name: '母线电压', value: '--', unit: 'V' }
    this.forwardEnergy = { name: '正向电度', value: '--', unit: 'kWh' }
    this.reverseEnergy = { name: '反向电度', value: '--', unit: 'kWh' }
    this.runMode = { name: '整机运行模式', value: '--' }
    this.breakdown = { name: '停整机故障', value: '--' }
    this.envTemperature = { name: '室外环境温度', value: '--', unit: '℃' }
    this.indoorOneStatus = { name: '室内机1启停状态', value: '--' }
    this.indoorOneRunMode = { name: '室内机1运行模式', value: '--' }
    this.indoorOneSetTemperature = { name: '室内机1温度设定', value: '--' }
    this.indoorOneSetWindSpeed = { name: '室内机1风速设定', value: '--' }
    this.indoorOneEnvTemperature = { name: '室内机1室内环境温度', value: '--', unit: '℃' }
    this.indoorTwoStatus = { name: '室内机2启停状态', value: '--' }
    this.indoorTwoRunMode = { name: '室内机2运行模式', value: '--' }
    this.indoorTwoSetTemperature = { name: '室内机2温度设定', value: '--' }
    this.indoorTwoSetWindSpeed = { name: '室内机2风速设定', value: '--' }
    this.indoorTwoEnvTemperature = { name: '室内机2室内环境温度', value: '--', unit: '℃' }
  }
}

const EnumResponseStatus = (data) => {
  switch (data) {
    case 0:
      return "自由运行模式";
    case 1:
      return "能源站屏幕调控中";
    case 2:
      return "能源站PN值调控中";
    case 3:
      return "网页三级调控中";
    case 4:
      return "碳排放责任因子调控中";
    default:
      return "--";
  }
}

const EnumResponseMode = (data) => {
  switch (data) {
    case 0:
      return "自由运行";
    case 1:
      return "1级响应(25%)";
    case 2:
      return "2级响应(50%)";
    case 3:
      return "3级响应(75%)";
    default:
      return "--";
  }
}

const EnumRunMode = (data) => {
  switch (data) {
    case 0:
      return "无效";
    case 1:
      return "单冷";
    case 2:
      return "制热";
    case 3:
      return "冷暖";
    case 4:
      return "送风";
    default:
      return "--";
  }
}

const EnumBreakDown = (data) => {
  switch (data) {
    case 0:
      return "正常";
    case 1:
      return "故障";
    default:
      return "--";
  }
}

const EnumIndoorStatus = (data) => {
  switch (data) {
    case 0:
      return "关";
    case 1:
      return "开";
    default:
      return "--";
  }
}

const EnumIndoorRunMode = (data) => {
  switch (data) {
    case 0:
      return "无效";
    case 1:
      return "制冷";
    case 2:
      return "抽湿";
    case 3:
      return "送风";
    case 4:
      return "制热";
    case 5:
      return "自动";
    case 6:
      return "地暖";
    case 7:
      return "快热";
    case 8:
      return "供暖";
    default:
      return "--";
  }
}

const EnumSetWindSpeed = (data) => {
  switch (data) {
    case 0:
      return "无效";
    case 1:
      return "自动风速";
    case 2:
      return "低档";
    case 3:
      return "中低档";
    case 4:
      return "中档";
    case 5:
      return "中高档";
    case 6:
      return "高档";
    default:
      return "--";
  }
}

export { Model0319 };
