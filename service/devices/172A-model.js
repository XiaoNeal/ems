import DeviceBase from "./device-base.model"

export class Model172A extends DeviceBase {
    energyData;
    stateData;
    mergeData;

    constructor() {
        super();
        this.energyData = new EnergyData();
        this.stateData = new StateData();
        this.mergeData = new MergeData();
    }

    getEnergyData(jsonData, jsonData2) {
        if (!jsonData) return
        const data = jsonData.data || jsonData
        for (const key in data) {
            if (this.energyData.hasOwnProperty(key) && this.energyData[key]) {
                this.energyData[key].value = data[key]
            }
        }
    }

    setHtmlText(unit) {
        return ''
        return `<span style='font-size:.8rem'> ${unit}</span>`;
    }

    getStatusData(jsonData) {
    }
}

export class EnergyData {
    B0 = {
        name: '环境温度',
        value: "--"
    };
    B2 = {
        name: '内部温度',
        value: "--"
    };
    B4 = {
        name: '温度启动值',
        value: "--"
    };
    B6 = {
        name: '温度关闭值',
        value: "--"
    };
    B8 = {
        name: '湿度',
        value: "--"
    };
    B10 = {
        name: '湿度启动值',
        value: "--"
    };
    B12 = {
        name: '湿度关闭值',
        value: "--"
    };
    B14 = {
        name: '控湿状态',
        value: "--"
    };
    B16 = {
        name: '控温状态',
        value: "--"
    };
    B18 = {
        name: '除霜状态',
        value: "--"
    };
    B20 = {
        name: '故障状态',
        value: "--"
    };
    B22 = {
        name: '外部温度传感器故障状态',
        value: "--"
    };
    B24 = {
        name: '内部温度传感器故障状态',
        value: "--"
    };
    B26 = {
        name: '湿度传感器故障状态',
        value: "--"
    };
    B28 = {
        name: '风机故障状态',
        value: "--"
    };
    B30 = {
        name: '控温方式',
        value: "--"
    };
    B32 = {
        name: '控温开启值',
        value: "--"
    };
    B34 = {
        name: '控温关闭值',
        value: "--"
    };
    B36 = {
        name: '控湿度关闭值',
        value: "--"
    };
    B38 = {
        name: '控湿度关闭值',
        value: "--"
    };
    B40 = {
        name: '温度报警上限值',
        value: "--"
    };
    B42 = {
        name: '温度报警下限值',
        value: "--"
    };
   
}

export class StateData {
}

export class MergeData {
}
