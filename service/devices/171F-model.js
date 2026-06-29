import DeviceBase from "./device-base.model"

// 主类：171F设备Model
export class Model171F extends DeviceBase {
    constructor() {
        super();
        // 初始化三个数据分类
        this.energyData = new EnergyData();
        this.stateData = new StateData();
        this.controlData = new ControlData();
    }


    getEnergyData(jsonData, jsonData2, barCode) {
        // console.log(jsonData, "jsonData");
        const data = jsonData.data || jsonData;
        for (const key in data) {
            if (this.energyData.hasOwnProperty(key) && this.energyData[key]) {
                let value = data[key];
                // B4（电网实时功率）保留两位小数
                if (key === 'B4' && typeof value === 'number') {
                    value = value.toFixed(2);
                }
                // B128（SOC）取整数
                if (key === 'B128' && typeof value === 'number') {
                    value = Math.round(value);
                }
                this.energyData[key].value = value;
            }
        }
        // console.log(this.energyData, "energyData");
    }


    getControlData(jsonData) {
        // console.log(jsonData, "jsonData----111111");
        const data = jsonData.data || jsonData;
        for (const key in data) {
            if (this.controlData.hasOwnProperty(key) && this.controlData[key]) {
                if (key === 'B14') {
                    const strategyMap = {
                        0: '峰谷',
                        1: '恒限功率',
                        2: '柔度',
                        3: '自发自用',
                        4: '电池优先',
                        5: '削峰填谷',
                        6: '售卖优先',
                        7: '限制消费',
                        8: '零出口',
                        9: '1113+防逆流',
                        10: 'AI调度'
                    };
                    this.controlData[key].value = strategyMap[data[key]] || data[key];
                } else {
                    this.controlData[key].value = data[key];
                }
            }
        }
        // console.log(this.controlData, "controlData");
    }


    // 处理能源数据
    handleEnergyData(jsonData, jsonData2) {
        const data = jsonData.data || jsonData;
        for (const key in data) {
            if (this.energyData.hasOwnProperty(key) && this.energyData[key]) {
                let value = data[key];
                // B4（电网实时功率）保留两位小数
                if (key === 'B4' && typeof value === 'number') {
                    value = value.toFixed(2);
                }
                // B128（SOC）取整数
                if (key === 'B128' && typeof value === 'number') {
                    value = Math.round(value);
                }
                this.energyData[key].value = value;
            }
        }
    }

    // 处理状态数据（按协议置空，仅保留结构）
    handleStateData(jsonData) {
        const data = jsonData.data || jsonData;
        for (const key in data) {
            if (this.stateData.hasOwnProperty(key) && this.stateData[key]) {
                this.stateData[key].value = data[key];
            }
        }
    }

    // 处理控制数据
    handleControlData(jsonData) {
        const data = jsonData.data || jsonData;
        for (const key in data) {
            if (this.controlData.hasOwnProperty(key) && this.controlData[key]) {
                this.controlData[key].value = data[key];
            }
        }
    }
}

// 能源数据类（根据实际数据格式定义）
class EnergyData {
    constructor() {
        // 实时功率数据（每4字节）
        this.B0 = { name: '光伏（实时功率）', value: "--" };
        this.B4 = { name: '电网（实时功率）', value: "--" };
        this.B8 = { name: '储能（实时功率）', value: "--" };
        this.B12 = { name: '储能充放电状态', value: "--" };
        this.B14 = { name: '负荷功率（实时功率）', value: "--" };
        this.B18 = { name: '柔性直流空调（分支，实时）', value: "--" };
        this.B22 = { name: '其他负荷功率（分支，实时）', value: "--" };
        this.B26 = { name: '柔性直流充电桩（分支功率，实时）', value: "--" };
        this.B30 = { name: '照明（分支功率，实时）', value: "--" };
        // 今日统计数据
        this.B34 = { name: '今日发电量', value: "--" };
        this.B38 = { name: '今日用电量', value: "--" };
        this.B42 = { name: '今日电网供电', value: "--" };
        // 预留字段
        this.B54 = { name: '电网状态', value: "--" };
        this.B56 = { name: '启动按钮', value: "--" };
        this.B58 = { name: '储能剩余电量', value: "--" };
        
        // this.B62 = { name: '预留', value: "--" };
        this.B60 = { name: '储能功率（正充负放）', value: "--" };

        this.B62 = { name: '电网累计供电量', value: "--" };


        // 预留字段
        this.B68 = { name: '交流负荷功率', value: "--" };
        this.B78 = { name: '当日发电量', value: "--" };
        this.B82 = { name: '日发最高发电量', value: "--" };
        // 日最高发电量数据
        this.B86 = { name: '日最高发电量出现日期（年）', value: "--" };
        this.B88 = { name: '日最高发电量出现日期（月）', value: "--" };
        this.B90 = { name: '日最高发电量出现日期（日）', value: "--" };
        this.B92 = { name: '历史最高发电功率', value: "--" };
        // 历史最高发电功率数据
        this.B96 = { name: '历史最高发电功率出现时间（年）', value: "--" };
        this.B98 = { name: '历史最高发电功率出现时间（月）', value: "--" };
        this.B100 = { name: '历史最高发电功率出现时间（日）', value: "--" };
        this.B102 = { name: '历史最高发电功率出现时间（时）', value: "--" };
        this.B104 = { name: '历史最高发电功率出现时间（分）', value: "--" };
        this.B106 = { name: '累计发电量', value: "--" };
        this.B110 = { name: '累计发电时长（天）', value: "--" };
        // 累计统计数据
        this.B128 = { name: 'SOC', value: "--" };
        this.B130 = { name: '剩余电量预计可用小时', value: "--" };
        this.B134 = { name: '日最高充电量', value: "--" };
        // 日最高充电量数据
        this.B138 = { name: '日最高充电量出现日期(年)', value: "--" };
        this.B140 = { name: '日最高充电量出现日期(月)', value: "--" };
        this.B142 = { name: '日最高充电量出现日期(日)', value: "--" };
        this.B144 = { name: '日最高放电量', value: "--" };
        // 日最高放电量数据
        this.B148 = { name: '日最高放电量出现日期（年）', value: "--" };
        this.B150 = { name: '日最高放电量出现日期（月）', value: "--" };
        this.B152 = { name: '日最高放电量出现日期（日）', value: "--" };
        this.B154 = { name: '充电量统计（日）', value: "--" };
        this.B158 = { name: '放电量统计（日）', value: "--" };
        // 充放电量统计
        this.B170 = { name: '总有功功率', value: "--" };
        this.B174 = { name: '频率', value: "--" };
        this.B176 = { name: '正向有功电度', value: "--" };
        // 交流负荷及功率数据
        this.B180 = { name: '反向有功电度', value: "--" };
        this.B184 = { name: '当天正向有功电度', value: "--" };
        this.B188 = { name: '当天反向有功电度', value: "--" };
    }
}

// 状态数据类（按协议置空，仅保留结构）
class StateData {
    constructor() {
        // 无有效字段，按协议置空
    }
}

// 控制数据类（根据实际数据格式定义）
class ControlData {
    constructor() {
        // PCS控制开关
        this.B0 = { name: 'PCS一键开机', value: "--" };
        this.B2 = { name: '光伏DC开机', value: "--" };
        this.B4 = { name: '储能DC开关机', value: "--" };
        this.B6 = { name: '储能充放电选择（仅当储能DC一键开机置为1时才有效）', value: "--" };
        this.B8 = { name: '充放电总功率（仅当储能DC一键开机置为2时才有效）', value: "--" };
        this.B10 = { name: '预留', value: "--" };
        this.B11 = { name: '预留', value: "--" };
        this.B12 = { name: '启动按钮', value: "--" };
        this.B14 = { name: '运行策略', value: "--" };
        this.B16 = { name: '电池优先策略的目标SOC值', value: "--" };
        this.B18 = { name: '售卖优先策略是否卖储能电（1出售储能电，0不出售储能电）', value: "--" };
        this.B20 = { name: '限制消费策略中PCS设定功率值', value: "--" };
        this.B22 = { name: '启动防逆流', value: "--" };
        this.B24 = { name: '防逆流服务端交流总表功率', value: "--" };
        // this.B32 = { name: '预留', value: "--" };
        this.B28 = { name: '防逆流服务端控制能源站数量', value: "--" };
        this.B30 = { name: '预留', value: "--" };
        this.B32 = { name: '防逆流电网侧目标功率', value: "--" };
        // this.B34 = { name: '预留', value: "--" };
        this.B34 = { name: '防逆流电网侧目标功率上下边界波动幅度', value: "--" };
        // this.B44 = { name: '预留', value: "--" };
        // 星期字段（削峰填谷策略）
        this.B38 = { name: '星期1', value: "--" };
        this.B40 = { name: '星期2', value: "--" };
        this.B42 = { name: '星期3', value: "--" };
        this.B44 = { name: '星期4', value: "--" };
        this.B46 = { name: '星期5', value: "--" };
        this.B48 = { name: '星期6', value: "--" };
        this.B50 = { name: '星期天', value: "--" };


        // 削峰填谷策略1
        this.B52 = { name: '削峰填谷策略1', value: "--" };
        this.B54 = { name: '削峰填谷策略1启用标志位', value: "--" };
        this.B56 = { name: '时（削峰填谷策略1开始时间）', value: "--" };
        this.B58 = { name: '分（削峰填谷策略1开始时间）', value: "--" };
        this.B60 = { name: '时（削峰填谷策略1停止时间）', value: "--" };
        this.B62 = { name: '分（削峰填谷策略1停止时间）', value: "--" };
        // 削峰填谷策略2
        this.B64 = { name: '削峰填谷策略2', value: "--" };
        this.B66 = { name: '削峰填谷策略2启用标志位', value: "--" };
        this.B68 = { name: '时（削峰填谷策略2开始时间）', value: "--" };
        this.B70 = { name: '分（削峰填谷策略2开始时间）', value: "--" };
        this.B72 = { name: '时（削峰填谷策略2停止时间）', value: "--" };
        this.B74 = { name: '分（削峰填谷策略2停止时间）', value: "--" };
        // 削峰填谷策略3
        this.B76 = { name: '削峰填谷策略3', value: "--" };
        this.B78 = { name: '削峰填谷策略3启用标志位', value: "--" };
        this.B80 = { name: '时（削峰填谷策略3开始时间）', value: "--" };
        this.B82 = { name: '分（削峰填谷策略3开始时间）', value: "--" };
        this.B84 = { name: '时（削峰填谷策略3停止时间）', value: "--" };
        this.B86 = { name: '分（削峰填谷策略3停止时间）', value: "--" };
        // 削峰填谷策略4
        this.B88 = { name: '削峰填谷策略4', value: "--" };
        this.B90 = { name: '削峰填谷策略4启用标志位', value: "--" };
        this.B92 = { name: '时（削峰填谷策略4开始时间）', value: "--" };
        this.B94 = { name: '分（削峰填谷策略4开始时间）', value: "--" };
        this.B96 = { name: '时（削峰填谷策略4停止时间）', value: "--" };
        this.B98 = { name: '分（削峰填谷策略4停止时间）', value: "--" };
     
        // 削峰填谷策略5
        this.B100 = { name: '削峰填谷策略5', value: "--" };
        this.B102 = { name: '削峰填谷策略5启用标志位', value: "--" };
        this.B104 = { name: '时（削峰填谷策略5开始时间）', value: "--" };
        this.B106 = { name: '分（削峰填谷策略5开始时间）', value: "--" };
        this.B108 = { name: '时（削峰填谷策略5停止时间）', value: "--" };
        this.B110 = { name: '分（削峰填谷策略5停止时间）', value: "--" };
        // 削峰填谷策略6
        this.B112 = { name: '削峰填谷策略6', value: "--" };
        this.B114 = { name: '削峰填谷策略6启用标志位', value: "--" };
        this.B116 = { name: '时（削峰填谷策略6开始时间）', value: "--" };
        this.B118 = { name: '分（削峰填谷策略6开始时间）', value: "--" };
        this.B120 = { name: '时（削峰填谷策略6停止时间）', value: "--" };
        this.B122 = { name: '分（削峰填谷策略6停止时间）', value: "--" };
        // this.B126 = { name: '预留', value: "--" };
        // 峰谷策略星期字段
        this.B126 = { name: '星期1', value: "--" };
        this.B128 = { name: '星期2', value: "--" };
        this.B130 = { name: '星期3', value: "--" };
        this.B132 = { name: '星期4', value: "--" };
        this.B134 = { name: '星期5', value: "--" };
        this.B136 = { name: '星期6', value: "--" };
        this.B138 = { name: '星期天', value: "--" };
        // 峰谷策略1
        this.B140 = { name: '峰谷策略1', value: "--" };
        this.B142 = { name: '峰谷策略1设置功率', value: "--" };
        // this.B144 = { name: '预留', value: "--" };
        this.B144 = { name: '峰谷策略1启用标志位', value: "--" };
        this.B146 = { name: '时（峰谷策略1开始时间）', value: "--" };
        this.B148 = { name: '分（峰谷策略1开始时间）', value: "--" };
        this.B150 = { name: '时（峰谷策略1停止时间）', value: "--" };
        this.B152 = { name: '分（峰谷策略1停止时间）', value: "--" };
        // 峰谷策略2
        this.B154 = { name: '峰谷策略2', value: "--" };
        this.B156 = { name: '峰谷策略2设置功率', value: "--" };
        this.B158 = { name: '峰谷策略2启用标志位', value: "--" };
        this.B160 = { name: '时（峰谷策略2开始时间）', value: "--" };
        this.B162 = { name: '分（峰谷策略2开始时间）', value: "--" };
        this.B164 = { name: '时（峰谷策略2停止时间）', value: "--" };
        this.B166 = { name: '分（峰谷策略2停止时间）', value: "--" };
        // 峰谷策略3
        this.B168 = { name: '峰谷策略3', value: "--" };
        this.B170 = { name: '峰谷策略3设置功率', value: "--" };
        this.B172 = { name: '峰谷策略3启用标志位', value: "--" };
        this.B174 = { name: '时（峰谷策略3开始时间）', value: "--" };
        this.B176 = { name: '分（峰谷策略3开始时间）', value: "--" };
        this.B178 = { name: '时（峰谷策略3停止时间）', value: "--" };
        this.B180 = { name: '分（峰谷策略3停止时间）', value: "--" };
        // 峰谷策略4
        this.B182 = { name: '峰谷策略4', value: "--" };
        this.B184 = { name: '峰谷策略4设置功率', value: "--" };
        this.B186 = { name: '峰谷策略4启用标志位', value: "--" };
        this.B188 = { name: '时（峰谷策略4开始时间）', value: "--" };
        this.B190 = { name: '分（峰谷策略4开始时间）', value: "--" };
        this.B192 = { name: '时（峰谷策略4停止时间）', value: "--" };
        this.B194 = { name: '分（峰谷策略4停止时间）', value: "--" };
        // 峰谷策略5
        this.B196 = { name: '峰谷策略5', value: "--" };
        this.B198 = { name: '峰谷策略5设置功率', value: "--" };
        this.B200 = { name: '峰谷策略5启用标志位', value: "--" };
        this.B202 = { name: '时（峰谷策略5开始时间）', value: "--" };
        this.B204 = { name: '分（峰谷策略5开始时间）', value: "--" };
        this.B206 = { name: '时（峰谷策略5停止时间）', value: "--" };
        this.B208 = { name: '分（峰谷策略5停止时间）', value: "--" };
        // 峰谷策略6
        this.B210 = { name: '峰谷策略6', value: "--" };
        this.B212 = { name: '峰谷策略6设置功率', value: "--" };
        this.B214 = { name: '峰谷策略6启用标志位', value: "--" };
        this.B216 = { name: '时（峰谷策略6开始时间）', value: "--" };
        this.B218 = { name: '分（峰谷策略6开始时间）', value: "--" };
        this.B220 = { name: '时（峰谷策略6停止时间）', value: "--" };
        this.B222 = { name: '分（峰谷策略6停止时间）', value: "--" };
    }
}