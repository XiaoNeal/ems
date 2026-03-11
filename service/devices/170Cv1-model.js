import DeviceBase from "./device-base.model"

export class Model170Cv1 extends DeviceBase {
    constructor() {
        super();
        this.energyData = new EnergyData()
        this.stateData = new StateData()
    }

    getEnergyData(jsonData) {
        this.energyData.DcDcVoltage.value = jsonData.B0;
        this.energyData.DcDcCurrent.value = jsonData.B4;
        this.energyData.systemVoltage.value = jsonData.B8;
        this.energyData.systemCurrent.value = jsonData.B12;
    }

    getStatusData(jsonData) {
        this.stateData.workMode.value = workModeEnum[jsonData.data.B0] || jsonData.data.B0;
    }

}

class EnergyData {
    DcDcVoltage = { name: 'DCDC模块直流高压侧电压(mV)', value: '--', unit: 'mV' }
    DcDcCurrent= { name: 'DCDC模块直流高压侧电流(mA)', value: '--', unit: 'mA' }
    systemVoltage= { name: '系统直流侧电压(mV)', value: '--', unit: 'mV' }
    systemCurrent= { name: '系统直流侧总电流(mA)', value: '--', unit: 'mA' }
}

class StateData {
    workMode= { name: '工作模式', value: '--' }
}

// 工作模式选择
const workModeEnum = {
    '0': '整流模式',
    '1': '并网逆变模式',
    '2': '无',
    '3': '离网逆变模式',
}
