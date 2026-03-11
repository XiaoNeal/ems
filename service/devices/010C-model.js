import DeviceBase from "./device-base.model"

export class Model010C extends DeviceBase {
  constructor () {
    super();
    this.energyData = new EnergyData()
    this.statusData = new StatusData()
  }

  getEnergyData(jsonData) {
    this.energyData.lowSideVoltage.value = jsonData.B0
    this.energyData.lowSideCurrent.value = jsonData.B2
    this.energyData.radiatorTemperature.value = jsonData.B4
    this.energyData.highSideVoltage.value = jsonData.B6
    this.energyData.highSideCurrent.value = jsonData.B8
    this.energyData.busVoltage.value = jsonData.B10
    this.energyData.batteryVoltage.value = jsonData.B12
    this.energyData.chargeVoltageSet.value = jsonData.B14
    this.energyData.chargeCurrentSet.value = jsonData.B16
    this.energyData.dischargeVoltageSet.value = jsonData.B18
    this.energyData.dischargeCurrentSet.value = jsonData.B20
    this.energyData.systemMaxChargeCurrent.value = jsonData.B22
    this.energyData.systemMaxDischargeCurrent.value = jsonData.B24
    this.energyData.batterySOC.value = jsonData.B26
    this.energyData.batteryChargeCapacity.value = jsonData.B28
    this.energyData.batteryDischargeCapacity.value = jsonData.B30
    this.energyData.batteryTotalVoltage.value = jsonData.B32
    this.energyData.batteryTotalCurrent.value = jsonData.B34
    this.energyData.packMaxSOC.value = jsonData.B36
    this.energyData.packMinSOC.value = jsonData.B38
    this.energyData.packMaxVoltage.value = jsonData.B40
    this.energyData.packMinVoltage.value = jsonData.B42
    this.energyData.packMaxTemperature.value = jsonData.B44
    this.energyData.packMinTemperature.value = jsonData.B46
    this.energyData.systemMaxChargePower.value = jsonData.B48
    this.energyData.systemMaxDischargePower.value = jsonData.B50
    this.energyData.heartBeat.value = jsonData.B52
  }

  getStatusData(jsonData) {
    this.statusData.workingCondition.value = workingConditionEnum[jsonData.data.B0] || jsonData.data.B0
    this.statusData.errorCode.value = jsonData.data.B2
    this.statusData.powerOn.value = powerOnEnum[jsonData.data.B4] || jsonData.data.B4
    this.statusData.workingConditionSet.value = workingConditionEnum[jsonData.data.B6] || jsonData.data.B6
    this.statusData.BMSWoringCondition.value = BMSWoringConditionEnum[jsonData.data.B8] || jsonData.data.B8
  }
}

class EnergyData {
    lowSideVoltage={ name: '低压侧电压值(V)', value: '--', unit: 'V' }
    lowSideCurrent={ name: '低压侧电流值(A)', value: '--', unit: 'A' }
    radiatorTemperature= { name: '散热器温度(℃)', value: '--', unit: '℃' }
    highSideVoltage= { name: '高压侧电压值(V)', value: '--', unit: 'V' }
    highSideCurrent= { name: '高压侧电流值(A)', value: '--', unit: 'A' }
    busVoltage= { name: '直流母线电压(V)', value: '--', unit: 'V' }
    batteryVoltage= { name: '电池电压(V)', value: '--', unit: 'V' }
    chargeVoltageSet= { name: '充电电压设定值(V)', value: '--', unit: 'V' }
    chargeCurrentSet= { name: '充电电流设定值(A)', value: '--', unit: 'A' }
    dischargeVoltageSet= { name: '放电电压设定值(V)', value: '--', unit: 'V' }
    dischargeCurrentSet= { name: '放电电流设定值(A)', value: '--', unit: 'A' }
    systemMaxChargeCurrent= { name: '当前系统最大允许充电电流(A)', value: '--', unit: 'A' }
    systemMaxDischargeCurrent= { name: '当前系统最大允许放电电流(A)', value: '--', unit: 'A' }
    batterySOC= { name: '电池组SOC(%)', value: '--', unit: '%' }
    batteryChargeCapacity= { name: '电池组可充电量(kWh)', value: '--', unit: 'kWh' }
    batteryDischargeCapacity= { name: '电池组可放电量(kWh)', value: '--', unit: 'kWh' }
    batteryTotalVoltage= { name: '电池组总电压(V)', value: '--', unit: 'V' }
    batteryTotalCurrent= { name: '电池组总电流(A)', value: '--', unit: 'A' }
    packMaxSOC= { name: '电池单体最高SOC(%)', value: '--', unit: '%' }
    packMinSOC= { name: '电池单体最低SOC(%)', value: '--', unit: '%' }
    packMaxVoltage= { name: '电池单体最高电压(V)', value: '--', unit: 'V' }
    packMinVoltage= { name: '电池单体最低电压(V)', value: '--', unit: 'V' }
    packMaxTemperature= { name: '电池单体最高温度(℃)', value: '--', unit: '℃' }
    packMinTemperature= { name: '电池单体最低温度(℃)', value: '--', unit: '℃' }
    systemMaxChargePower= { name: '当前系统最大允许充电功率(kW)', value: '--', unit: 'kW' }
    systemMaxDischargePower= { name: '当前系统最大允许放电功率(kW)', value: '--', unit: 'kW' }
    heartBeat= { name: '心跳帧', value: '--' }
}

class StatusData {
    workingCondition = { name: '当前工作状态', value: '--' }
    errorCode = { name: '故障码', value: '--' }
    powerOn = { name: '开机/关机', value: '--' }
    workingConditionSet = { name: '工作状态设定值', value: '--' }
    BMSWoringCondition = { name: 'BMS工作状态信息', value: '--' }
}

// 当前工作状态
const workingConditionEnum = {
  '0000': '待机',
  '5555': '充电',
  '6666': '恒流放电',
  '7777': '恒压放电'
}

// 故障码
const errorCodeEnum = {
  '0000': '无故障'
}

// 开机/关机
const powerOnEnum = {
  '1111': '开机',
  '2222': '关机'
}

// BMS工作状态信息
const BMSWoringConditionEnum = {
  '1111': '禁充',
  '2222': '禁放',
  '5555': '待机',
  'aaaa': '跳机',
  'bbbb': '正常',
  'cccc': '预警'
}
