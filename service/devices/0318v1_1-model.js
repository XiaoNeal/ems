import DeviceBase from "./device-base.model"

class Model0318v1_1 extends DeviceBase {
    constructor() {
        super()
        this.energyData = {
            deviceId: { name: '机型ID', value: '--' },
            protocolVersion: { name: '远程监控协议版本', value: '--' },
            supplyLiquidTemperatureSetting: { name: '供液温度设定(℃)', value: '--' },
            supplyLiquidTemperature: { name: '供液温度(℃)', value: '--' },
            returnLiquidTemperature: { name: '回液温度(℃)', value: '--' },
            supplyLiquidPressure: { name: '供液压力(kPa)', value: '--' },
            returnLiquidPressure: { name: '回液压力(kPa)', value: '--' },
            outsideEnvironmentTemperature: { name: '室外环境温度(℃)', value: '--' },
            supplyLiquidRunLevel: { name: '供液泵运行档位', value: '--' },
        }
        this.stateData = {
            powerOn: { name: '开关机', value: '--' },
            runMode: { name: '运行模式', value: '--' },
            workState: { name: '工作状态', value: '--' },
            errorState: { name: '故障状态', value: '--' },
        }
    }

    getData(json) {
        if (json.dataType == "2") {
            this.getEnergyData(json)
        } else if (json.dataType == "3") {
            this.getStatusData(json)
        }
    }

    getEnergyData(data) {
        this.energyData.deviceId.value = data.B0;
        this.energyData.protocolVersion.value = data.B2;
        this.energyData.supplyLiquidTemperatureSetting.value = data.B4;
        this.energyData.supplyLiquidTemperature.value = data.B6;
        this.energyData.returnLiquidTemperature.value = data.B8;
        this.energyData.supplyLiquidPressure.value = data.B10;
        this.energyData.returnLiquidPressure.value = data.B12;
        this.energyData.outsideEnvironmentTemperature.value = data.B14;
        this.energyData.supplyLiquidRunLevel.value = data.B16;
    }

    getStatusData(jsonData) {
        this.stateData.powerOn.value = powerOnEnum[jsonData.data.B0] || jsonData.data.B0;
        this.stateData.runMode.value = runModeEnum[jsonData.data.B2] || jsonData.data.B2;
        this.stateData.workState.value = workStateEnum[jsonData.data.B4] || jsonData.data.B4;
        this.stateData.errorState.value = errorStateEnum[jsonData.data.B6] || jsonData.data.B6;
    }

}

// 开关机状态
const powerOnEnum = {
    '00AA': '开机',
    '0055': '关机'
}

// 运行模式
const runModeEnum = {
    '1': '自动运行',
    '2': '制冷',
    '3': '制热',
    '4': '自循环',
    '5': '待机'
}

// 工作状态
const workStateEnum = {
    '0': '关机',
    '1': '运行',
    '2': '故障'
}

// 故障状态
const errorStateEnum = {
    '0': '无故障',
    '1': '一般故障',
    '2': '严重故障'
}

export { Model0318v1_1 }
