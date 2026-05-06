import DeviceBase from "./device-base.model"

export class Model170C_V1_1Model extends DeviceBase {
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
        // DCDC故障区标志
        this.energyData.B0.value = this.setFaultZoneStatus(jsonData.B0);
        
        // 系统工作状态
        this.energyData.B2.value = this.setSystemWorkStatus(jsonData.B2);
        
        // 电池工作状态
        this.energyData.B4.value = this.setBatteryWorkStatus(jsonData.B4);
        
        // 电池充电状态
        this.energyData.B6.value = this.setBatteryChargeStatus(jsonData.B6);
        
        // 电池电压 (传输值=实际值*10, 单位:0.1V)
        this.energyData.B8.value = (jsonData.B8 / 10).toFixed(1) + this.setHtmlText('V');
        
        // 电池电流 (传输值=实际值*10, 单位:0.1A)
        this.energyData.B10.value = (jsonData.B10 / 10).toFixed(1) + this.setHtmlText('A');
        
        // 充电功率
        this.energyData.B12.value = jsonData.B12 + this.setHtmlText('W');
        
        // 放电功率
        this.energyData.B14.value = jsonData.B14 + this.setHtmlText('W');
        
        // BUS母线电压 (传输值=实际值*10, 单位:0.1V)
        this.energyData.B16.value = (jsonData.B16 / 10).toFixed(1) + this.setHtmlText('V');
        
        // BUS+母线电压 (传输值=实际值*10, 单位:0.1V)
        this.energyData.B18.value = (jsonData.B18 / 10).toFixed(1) + this.setHtmlText('V');
        
        // BUS-母线电压 (传输值=实际值*10, 单位:0.1V)
        this.energyData.B20.value = (jsonData.B20 / 10).toFixed(1) + this.setHtmlText('V');
        
        // 环境温度 (传输值=实际值*10, 单位:0.1℃)
        this.energyData.B22.value = (jsonData.B22 / 10).toFixed(1) + this.setHtmlText('℃');
        
        // 放电量累计低16位 (传输值=实际值*100, 单位:0.01kWh)
        this.energyData.B24.value = (jsonData.B24 / 100).toFixed(2) + this.setHtmlText('kWh');
        
        // 放电量累计高16位
        this.energyData.B26.value = jsonData.B26;
        
        // 充电量累计低16位 (传输值=实际值*100, 单位:0.01kWh)
        this.energyData.B28.value = (jsonData.B28 / 100).toFixed(2) + this.setHtmlText('kWh');
        
        // 充电量累计高16位
        this.energyData.B30.value = jsonData.B30;
        
        // DCDC固件版本
        this.energyData.B32.value = this.parseVersion(jsonData.B32);
        
        // DCDC软件版本
        this.energyData.B34.value = this.parseVersion(jsonData.B34);
    }

    setHtmlText(unit) {
        return `<span style='font-size:.8rem'> ${unit}</span>`;
    }

    setFaultZoneStatus(key) {
        switch (key) {
            case 0:
                return '无故障';
            case 1:
                return '有故障';
            default:
                return key;
        }
    }

    setSystemWorkStatus(key) {
        switch (key) {
            case 0:
                return '待机';
            case 1:
                return '并网运行';
            case 2:
                return '预留';
            case 3:
                return '离网运行';
            case 4:
                return 'MPPT运行';
            case 5:
                return '开环运行';
            case 6:
                return '调试模式';
            case 7:
                return '故障';
            default:
                return key;
        }
    }

    setBatteryWorkStatus(key) {
        switch (key) {
            case 0:
                return '待机';
            case 1:
                return '充电';
            case 2:
                return '放电';
            default:
                return key;
        }
    }

    setBatteryChargeStatus(key) {
        switch (key) {
            case 0:
                return '待机';
            case 1:
                return '恒流';
            case 2:
                return '恒功率';
            case 3:
                return '恒压';
            case 4:
                return '浮充';
            case 5:
                return '充满';
            default:
                return key;
        }
    }

    parseVersion(value) {
        if (!value) return "--";
        // bit0-bit6: 调试版本; bit7-bit10: 测试版本; bit11-bit15: 量产版本
        const debugVersion = value & 0x7F;
        const testVersion = (value >> 7) & 0xF;
        const releaseVersion = (value >> 11) & 0x1F;
        return `${releaseVersion}.${testVersion}.${debugVersion}`;
    }

    getStatusData(jsonData) {
        // DCDC告警字0-4
        this.stateData.B0.value = jsonData.data.B0;
        this.stateData.B4.value = jsonData.data.B4;
        this.stateData.B8.value = jsonData.data.B8;
        this.stateData.B12.value = jsonData.data.B12;
        this.stateData.B16.value = jsonData.data.B16;
    }
}

export class EnergyData {
    B0 = {
        name: 'DCDC故障区标志',
        value: "--"
    };
    B2 = {
        name: '系统工作状态',
        value: "--"
    };
    B4 = {
        name: '电池工作状态',
        value: "--"
    };
    B6 = {
        name: '电池充电状态',
        value: "--"
    };
    B8 = {
        name: '电池电压',
        value: "--"
    };
    B10 = {
        name: '电池电流',
        value: "--"
    };
    B12 = {
        name: '充电功率',
        value: "--"
    };
    B14 = {
        name: '放电功率',
        value: "--"
    };
    B16 = {
        name: 'BUS母线电压',
        value: "--"
    };
    B18 = {
        name: 'BUS+母线电压',
        value: "--"
    };
    B20 = {
        name: 'BUS-母线电压',
        value: "--"
    };
    B22 = {
        name: '环境温度',
        value: "--"
    };
    B24 = {
        name: '放电量累计低16位',
        value: "--"
    };
    B26 = {
        name: '放电量累计高16位',
        value: "--"
    };
    B28 = {
        name: '充电量累计低16位',
        value: "--"
    };
    B30 = {
        name: '充电量累计高16位',
        value: "--"
    };
    B32 = {
        name: 'DCDC固件版本',
        value: "--"
    };
    B34 = {
        name: 'DCDC软件版本',
        value: "--"
    };
}

export class StateData {
    B0 = {
        name: 'DCDC告警字0',
        value: "--"
    };
    B4 = {
        name: 'DCDC告警字1',
        value: "--"
    };
    B8 = {
        name: 'DCDC告警字2',
        value: "--"
    };
    B12 = {
        name: 'DCDC告警字3',
        value: "--"
    };
    B16 = {
        name: 'DCDC告警字4',
        value: "--"
    };
}

export class MergeData {
}
