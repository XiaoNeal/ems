import DeviceBase from "./device-base.model"

export class Model170F extends DeviceBase {
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
        // 光伏（实时功率）
        this.energyData.B0.value = jsonData.B0 + this.setHtmlText('kW');
        
        // 电网（实时功率）
        this.energyData.B4.value = jsonData.B4 + this.setHtmlText('kW');
        
        // 储能（实时功率）
        this.energyData.B8.value = jsonData.B8 + this.setHtmlText('kW');
        
        // 负荷功率（实时功率）
        this.energyData.B12.value = jsonData.B12 + this.setHtmlText('kW');
        
        // 柔性直流空调(总功率，实时)
        this.energyData.B16.value = jsonData.B16 + this.setHtmlText('kW');
        
        // 柔性直流充电桩(分支功率，实时)
        this.energyData.B24.value = jsonData.B24 + this.setHtmlText('kW');
        
        // 照明(分支功率，实时)
        this.energyData.B28.value = jsonData.B28 + this.setHtmlText('kW');
        
        // 今日发电
        this.energyData.B32.value = jsonData.B32 + this.setHtmlText('kWh');
        
        // 今日用电
        this.energyData.B36.value = jsonData.B36 + this.setHtmlText('kWh');
        
        // 电网供电
        this.energyData.B40.value = jsonData.B40 + this.setHtmlText('kWh');
        
        // 储能剩余电量
        this.energyData.B44.value = jsonData.B44 + this.setHtmlText('kWh');
        
        // 总馈电量
        this.energyData.B46.value = jsonData.B46 + this.setHtmlText('kWh');
        
        // 日最高发电量
        this.energyData.B50.value = jsonData.B50 + this.setHtmlText('kWh');
        
        // 历史最高发电功率
        this.energyData.B54.value = jsonData.B54 + this.setHtmlText('kWh');
        
        // 累计发电量
        this.energyData.B58.value = jsonData.B58 + this.setHtmlText('kWh');
        
        // 累计发电时长（天）
        this.energyData.B62.value = jsonData.B62 + this.setHtmlText('天');
        
        // SOC
        this.energyData.B66.value = jsonData.B66 + this.setHtmlText('%');
        
        // 剩余电量预计可用小时
        this.energyData.B68.value = jsonData.B68 + this.setHtmlText('小时');
        
        // 充放电比
        this.energyData.B70.value = jsonData.B70;
        
        // 日最高充电量
        this.energyData.B72.value = jsonData.B72 + this.setHtmlText('kWh');
        
        // 日最高放电量
        this.energyData.B76.value = jsonData.B76 + this.setHtmlText('kWh');
        
        // 放电达成率（日）
        this.energyData.B80.value = jsonData.B80 + this.setHtmlText('%');
        
        // 已接设备数
        this.energyData.B82.value = jsonData.B82;
        
        // 空调数量
        this.energyData.B84.value = jsonData.B84;
        
        // 照明数量
        this.energyData.B86.value = jsonData.B86;
        
        // 充电桩数量
        this.energyData.B88.value = jsonData.B88;
        
        // 未知设备数量
        this.energyData.B90.value = jsonData.B90;
        
        // 柔度(能源站)
        this.energyData.B92.value = jsonData.B92 + this.setHtmlText('%');
        
        // 负载率(总)
        this.energyData.B94.value = jsonData.B94 + this.setHtmlText('%');
        
        // 能效水平(总)
        this.energyData.B96.value = jsonData.B96 + this.setHtmlText('%');
        
        // 柔度(设备1)
        this.energyData.B98.value = jsonData.B98 + this.setHtmlText('%');
        
        // 负载率(设备1)
        this.energyData.B100.value = jsonData.B100 + this.setHtmlText('%');
        
        // 能效水平(设备1)
        this.energyData.B102.value = jsonData.B102 + this.setHtmlText('%');
        
        // 柔度(设备2)
        this.energyData.B104.value = jsonData.B104 + this.setHtmlText('%');
        
        // 负载率(设备2)
        this.energyData.B106.value = jsonData.B106 + this.setHtmlText('%');
        
        // 能效水平(设备2)
        this.energyData.B108.value = jsonData.B108 + this.setHtmlText('%');
        
        // 柔度(设备3)
        this.energyData.B110.value = jsonData.B110 + this.setHtmlText('%');
        
        // 负载率(设备3)
        this.energyData.B112.value = jsonData.B112 + this.setHtmlText('%');
        
        // 能效水平(设备3)
        this.energyData.B114.value = jsonData.B114 + this.setHtmlText('%');
        
        // 柔度(设备4)
        this.energyData.B116.value = jsonData.B116 + this.setHtmlText('%');
        
        // 负载率(设备4)
        this.energyData.B118.value = jsonData.B118 + this.setHtmlText('%');
        
        // 能效水平(设备4)
        this.energyData.B120.value = jsonData.B120 + this.setHtmlText('%');
        
        // 柔度(设备5)
        this.energyData.B122.value = jsonData.B122 + this.setHtmlText('%');
        
        // 负载率(设备5)
        this.energyData.B124.value = jsonData.B124 + this.setHtmlText('%');
        
        // 能效水平(设备5)
        this.energyData.B126.value = jsonData.B126 + this.setHtmlText('%');
        
        // 柔度(设备6)
        this.energyData.B128.value = jsonData.B128 + this.setHtmlText('%');
        
        // 负载率(设备6)
        this.energyData.B130.value = jsonData.B130 + this.setHtmlText('%');
        
        // 能效水平(设备6)
        this.energyData.B132.value = jsonData.B132 + this.setHtmlText('%');
        
        // 柔度(设备7)
        this.energyData.B134.value = jsonData.B134 + this.setHtmlText('%');
        
        // 负载率(设备7)
        this.energyData.B136.value = jsonData.B136 + this.setHtmlText('%');
        
        // 能效水平(设备7)
        this.energyData.B138.value = jsonData.B138 + this.setHtmlText('%');
        
        // 柔度(设备8)
        this.energyData.B140.value = jsonData.B140 + this.setHtmlText('%');
        
        // 负载率(设备8)
        this.energyData.B142.value = jsonData.B142 + this.setHtmlText('%');
        
        // 能效水平(设备8)
        this.energyData.B144.value = jsonData.B144 + this.setHtmlText('%');
        
        // 柔度(设备9)
        this.energyData.B146.value = jsonData.B146 + this.setHtmlText('%');
        
        // 负载率(设备9)
        this.energyData.B148.value = jsonData.B148 + this.setHtmlText('%');
        
        // 能效水平(设备9)
        this.energyData.B150.value = jsonData.B150 + this.setHtmlText('%');
        
        // 照明数量
        this.energyData.B152.value = jsonData.B152;
        
        // 设备响应能力（1）
        this.energyData.B154.value = jsonData.B154;
        
        // 设备响应能力（2）
        this.energyData.B158.value = jsonData.B158;
        
        // 设备响应能力（3）
        this.energyData.B162.value = jsonData.B162;
        
        // 设备响应能力（4）
        this.energyData.B166.value = jsonData.B166;
        
        // 设备响应能力（5）
        this.energyData.B170.value = jsonData.B170;
        
        // 设备响应能力（6）
        this.energyData.B174.value = jsonData.B174;
        
        // 总功率曲线
        this.energyData.B178.value = jsonData.B178;
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
        name: '光伏（实时功率）',
        value: "--"
    };
    B4 = {
        name: '电网（实时功率）',
        value: "--"
    };
    B8 = {
        name: '储能（实时功率）',
        value: "--"
    };
    B12 = {
        name: '负荷功率（实时功率）',
        value: "--"
    };
    B16 = {
        name: '柔性直流空调(总功率，实时)',
        value: "--"
    };
    B24 = {
        name: '柔性直流充电桩(分支功率，实时)',
        value: "--"
    };
    B28 = {
        name: '照明(分支功率，实时)',
        value: "--"
    };
    B32 = {
        name: '今日发电',
        value: "--"
    };
    B36 = {
        name: '今日用电',
        value: "--"
    };
    B40 = {
        name: '电网供电',
        value: "--"
    };
    B44 = {
        name: '储能剩余电量',
        value: "--"
    };
    B46 = {
        name: '总馈电量',
        value: "--"
    };
    B50 = {
        name: '日最高发电量',
        value: "--"
    };
    B54 = {
        name: '历史最高发电功率',
        value: "--"
    };
    B58 = {
        name: '累计发电量',
        value: "--"
    };
    B62 = {
        name: '累计发电时长（天）',
        value: "--"
    };
    B66 = {
        name: 'SOC',
        value: "--"
    };
    B68 = {
        name: '剩余电量预计可用小时',
        value: "--"
    };
    B70 = {
        name: '充放电比',
        value: "--"
    };
    B72 = {
        name: '日最高充电量',
        value: "--"
    };
    B76 = {
        name: '日最高放电量',
        value: "--"
    };
    B80 = {
        name: '放电达成率（日）',
        value: "--"
    };
    B82 = {
        name: '已接设备数',
        value: "--"
    };
    B84= {
        name: '空调数量',
        value: "--"
    };
    B86 = {
        name: '照明数量',
        value: "--"
    };
    B88 = {
        name: '充电桩数量',
        value: "--"
    };
    B90= {
        name: '未知设备数量',
        value: "--"
    };
    B92 = {
        name: '柔度(能源站)',
        value: "--"
    };
    B94 = {
        name: '负载率(总)',
        value: "--"
    };
    B96 = {
        name: '能效水平(总)',
        value: "--"
    };
    B98 = {
        name: '柔度(设备1)',
        value: "--"
    };
    B100 = {
        name: '负载率(设备1)',
        value: "--"
    };
    B102 = {
        name: '能效水平(设备1)',
        value: "--"
    };
    B104 = {
        name: '柔度(设备2)',
        value: "--"
    };
    B106 = {
        name: '负载率(设备2)',
        value: "--"
    };
    B108 = {
        name: '能效水平(设备2)',
        value: "--"
    };
    B110 = {
        name: '柔度(设备3)',
        value: "--"
    };
    B112 = {
        name: '负载率(设备3)',
        value: "--"
    };
    B114 = {
        name: '能效水平(设备3)',
        value: "--"
    };
    B116 = {
        name: '柔度(设备4)',
        value: "--"
    };
    B118 = {
        name: '负载率(设备4)',
        value: "--"
    };
    B120 = {
        name: '能效水平(设备4)',
        value: "--"
    };
    B122 = {
        name: '柔度(设备5)',
        value: "--"
    };
    B124 = {
        name: '负载率(设备5)',
        value: "--"
    };
    B126 = {
        name: '能效水平(设备5)',
        value: "--"
    };
    B128 = {
        name: '柔度(设备6)',
        value: "--"
    };
    B130 = {
        name: '负载率(设备6)',
        value: "--"
    };
    B132 = {
        name: '能效水平(设备6)',
        value: "--"
    };
    B134 = {
        name: '柔度(设备7)',
        value: "--"
    };
    B136 = {
        name: '负载率(设备7)',
        value: "--"
    };
    B138 = {
        name: '能效水平(设备7)',
        value: "--"
    };
    B140 = {
        name: '柔度(设备8)',
        value: "--"
    };
    B142 = {
        name: '负载率(设备8)',
        value: "--"
    };
    B144 = {
        name: '能效水平(设备8)',
        value: "--"
    };
    B146 = {
        name: '柔度(设备9)',
        value: "--"
    };
    B148 = {
        name: '负载率(设备9)',
        value: "--"
    };
    B150 = {
        name: '能效水平(设备9)',
        value: "--"
    };
    B152 = {
        name: '照明数量',
        value: "--"
    };
    B154 = {
        name: '设备响应能力（1）',
        value: "--"
    };
    B158 = {
        name: '设备响应能力（2）',
        value: "--"
    };
    B162 = {
        name: '设备响应能力（3）',
        value: "--"
    };
    B166 = {
        name: '设备响应能力（4）',
        value: "--"
    };
    B170 = {
        name: '设备响应能力（5）',
        value: "--"
    };
    B174 = {
        name: '设备响应能力（6）',
        value: "--"
    };
    B178 = {
        name: '总功率曲线',
        value: "--"
    };
}

export class StateData {
}

export class MergeData {
}
