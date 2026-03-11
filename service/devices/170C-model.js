import DeviceBase from "./device-base.model"

export class Model170C extends DeviceBase {
    constructor(number) {
        super();

        const str = number ? `${number}# DCDC` : ''
        this.energyData = new EnergyData()
        this.stateData = new StatusData()
    }

    getEnergyData(jsonData) {
        this.energyData.BATSetVoltage.value = jsonData.B0;
        this.energyData.maxChargeCurrent.value = jsonData.B2;
        this.energyData.maxDischargeCurrent.value = jsonData.B4;
        this.energyData.BUSSetVoltage.value = jsonData.B6;
        this.energyData.BUSSetCurrent.value = jsonData.B8;
        this.energyData.sagVoltageCoefficient.value = jsonData.B10;
        this.energyData.maxPowerLimit.value = jsonData.B12;
        this.energyData.BATUndervoltagePoint.value = jsonData.B14;
        this.energyData.BATOvervoltagePoint.value = jsonData.B16;
        this.energyData.BUSUndervoltagePoint.value = jsonData.B18;
        this.energyData.BUSOvervoltagePoint.value = jsonData.B20;
        this.energyData.BATChargeCurrentPoint.value = jsonData.B22;
        this.energyData.BATDishargeCurrentPoint.value = jsonData.B24;
        this.energyData.BUSChargeCurrentPoint.value = jsonData.B26;
        this.energyData.BUSDishargeCurrentPoint.value = jsonData.B28;
        this.energyData.BATVoltage.value = jsonData.B30;
        this.energyData.BUSVoltage.value = jsonData.B32;
        this.energyData.BUSCurrent.value = jsonData.B34;
        this.energyData.BATCurrent.value = jsonData.B36;
        this.energyData.maxTemperature.value = jsonData.B38;
        this.energyData.allowRunPower.value = jsonData.B40;
        this.energyData.runPower.value = jsonData.B42;
    }

    getStatusData(jsonData) {
        this.stateData.startOrder.value = startOrderEnum[jsonData.data.B0] || jsonData.data.B0;
        this.stateData.moduleMode.value = moduleModeEnum[jsonData.data.B2] || jsonData.data.B2;
        this.stateData.workMode.value = workModeEnum[jsonData.data.B4] || jsonData.data.B4;
        this.stateData.moduleShareCurrent.value = moduleShareCurrentEnum[jsonData.data.B6] || jsonData.data.B6;
        this.stateData.runState.value = runStateEnum[jsonData.data.B8] || jsonData.data.B8;
        this.stateData.errorCode.value = jsonData.data.B10;
    }

}

class EnergyData{
    BATSetVoltage={ name: 'BAT侧电压给定(V)', value: '--' }
    maxChargeCurrent= { name: '最大充电电流限制(A)', value: '--' }
    maxDischargeCurrent= { name: '最大放电电流限制(A)', value: '--' }
    BUSSetVoltage= { name: 'BUS侧电压给定(V)', value: '--' }
    BUSSetCurrent= { name: 'BUS侧电流给定(A)', value: '--' }
    sagVoltageCoefficient= { name: '下垂电压系数(V)', value: '--' }
    maxPowerLimit= { name:'最大功率限制(kW)', value: '--' }
    BATUndervoltagePoint= { name: 'BAT侧欠压保护点(V)', value: '--' }
    BATOvervoltagePoint= { name: 'BAT侧过压保护点(V)', value: '--' }
    BUSUndervoltagePoint= { name: 'BUS侧欠压保护点(V)', value: '--' }
    BUSOvervoltagePoint= { name: 'BUS侧过压保护点(V)', value: '--' }
    BATChargeCurrentPoint= { name: 'BAT侧充电过流保护点(A)', value: '--' }
    BATDishargeCurrentPoint= { name: 'BAT侧放电过流保护点(A)', value: '--' }
    BUSChargeCurrentPoint= { name: 'BUS侧充电过流保护点(A)', value: '--' }
    BUSDishargeCurrentPoint= { name: 'BUS侧放电过流保护点(A)', value: '--' }
    BATVoltage= { name: 'BAT侧电压显示(V)', value: '--' }
    BUSVoltage= { name: 'BUS侧电压显示(V)', value: '--' }
    BUSCurrent= { name: 'BUS侧电流显示(A)', value: '--' }
    BATCurrent= { name: 'BAT侧电流显示(A)', value: '--' }
    maxTemperature= { name: '模块最高温度(℃)', value: '--' }
    allowRunPower= { name: '允许运行功率(kW)', value: '--' }
    runPower= { name: '当前运行功率(kW)', value: '--' }
}

class StatusData{
    startOrder= { name: '启动指令', value: '--' }
    moduleMode= { name: '模块功能选择', value: '--' }
    workMode= { name: '工作模式选择', value: '--' }
    moduleShareCurrent= { name: '模块并联均流', value: '--' }
    runState= { name: '机器运行状态', value: '--' }
    errorCode= { name: '故障码', value: '--' }
}

// 启动指令
const startOrderEnum = {
    '1': '启动',
    '2': '停机',
    '3': '复位'
}

// 模块功能选择
const moduleModeEnum = {
    '0': 'MPPT模块',
    '1': '双向DC/DC模块'
}

// 工作模式选择
const workModeEnum = {
    '1': 'BUS侧恒压',
    '2': 'BUS侧恒流',
    '3': 'BAT侧恒压',
    '4': 'BAT侧恒流',
    '5': 'BAT侧恒功率',
}

// 模块并联均流
const moduleShareCurrentEnum = {
    '0': '无均流',
    '1': '均流方式 1',
    '2': '均流方式 2',
    '3': '均流方式 3'
}

// 机器运行状态
const runStateEnum = {
    '1': '停机',
    '2': '运行',
    '4': '故障',
    '8': '过载',
    '16': 'BAT软起',
    '32': 'BAT主接',
    '64': 'BUS软起',
    '128': 'BUS主接',
}