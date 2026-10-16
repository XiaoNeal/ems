import DeviceBase from "./device-base.model"

export class Model172A extends DeviceBase {
    energyData;
    stateData;

    constructor() {
        super();
        this.energyData = new EnergyData();
        this.stateData = new StateData();
        this.mergeData = new MergeData();
    }

    getEnergyData(jsonData, jsonData2) {

    }

    setHtmlText(unit) {
        return ''
        return `<span style='font-size:.8rem'> ${unit}</span>`;
    }

    getStatusData(jsonData) {
        if (!jsonData) return
        const data = jsonData.data || jsonData
        for (const key in data) {
            if (this.stateData.hasOwnProperty(key) && this.stateData[key]) {
                this.stateData[key].value = data[key]
            }
        }
    }
}

export class EnergyData {


}

export class StateData {
    B0 = {
        name: '温度',
        value: "--"
    };
    B2 = {
        name: '湿度',
        value: "--"
    };
}


