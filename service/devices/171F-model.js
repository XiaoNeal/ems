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


    // 处理能源数据
    handleEnergyData(jsonData, jsonData2) {
        for (const key in jsonData) {
            if (this.energyData.hasOwnProperty(key)) {
                this.energyData[key] = jsonData[key];
            }
        }
    }

    // 处理状态数据（按协议置空，仅保留结构）
    handleStateData(jsonData) {
        for (const key in jsonData) {
            if (this.stateData.hasOwnProperty(key)) {
                this.stateData[key] = jsonData[key];
            }
        }
    }

    // 处理控制数据
    handleControlData(jsonData) {
        for (const key in jsonData) {
            if (this.controlData.hasOwnProperty(key)) {
                this.controlData[key] = jsonData[key];
            }
        }
    }
}

// 能源数据类（按协议置空，仅保留结构）
class EnergyData {
    constructor() {
        // 无有效字段，按协议置空
    }
}

// 状态数据类（按协议置空，仅保留结构）
class StateData {
    constructor() {
        // 无有效字段，按协议置空
    }
}

// 控制数据类（114个字段）
class ControlData {
    constructor() {
        // 动态生成114个字段，匹配协议字节地址（每个字段4字节）
        for (let i = 0; i < 456; i += 4) {
            this[`B${i}`] = null;
        }
        // 核心字段重命名，匹配协议
        this.B0 = { name: 'PCS一键开机', value: "--" };
        this.B2 = { name: '光伏DC开机', value: "--" };
        this.B4 = { name: '储能DC开关机', value: "--" };
        this.B6 = { name: '储能充放电选择', value: "--" };
        this.B8 = { name: '充放电总功率', value: "--" };
        this.B10 = { name: '预留', value: "--" };
        this.B11 = { name: '预留', value: "--" };
        this.B12 = '启动按钮';
        this.B14 = '运行策略';
        this.B16 = '电池优先策略的目标SOC值';
        this.B18 = '售卖优先策略（是否卖储能电）';
        this.B20 = '限制消费策略（中PCS设定功率值）';
        this.B22 = '启动防逆流';
        this.B24 = '防逆流服务端交流总表功率';
        this.B28 = '防逆流服务端控制能源站数量';
        this.B30 = '预留';
        this.B32 = '防逆流电网侧目标功率';
        this.B34 = '防逆流电网侧目标功率上下边界波动幅度';
        this.B36 = '预留';
        this.B38 = '星期1';
        this.B40 = '星期2';
        this.B42 = '星期3';
        this.B44 = '星期4';
        this.B46 = '星期5';
        this.B48 = '星期6';
        this.B50 = '星期天';
        this.B52 = '削峰填谷策略1';
        this.B54 = '削峰填谷策略1启用标志位';
        this.B56 = '时（削峰填谷策略1开始时间）';
        this.B58 = '分（削峰填谷策略1开始时间）';
        this.B60 = '时（削峰填谷策略1停止时间）';
        this.B62 = '分（削峰填谷策略1停止时间）';
        this.B64 = '削峰填谷策略2';
        this.B66 = '削峰填谷策略2启用标志位';
        this.B68 = '时（削峰填谷策略2开始时间）';
        this.B70 = '分（削峰填谷策略2开始时间）';
        this.B72 = '时（削峰填谷策略2停止时间）';
        this.B74 = '分（削峰填谷策略2停止时间）';
        this.B76 = '削峰填谷策略3';
        this.B78 = '削峰填谷策略3启用标志位';
        this.B80 = '时（削峰填谷策略3开始时间）';
        this.B82 = '分（削峰填谷策略3开始时间）';
        this.B84 = '时（削峰填谷策略3停止时间）';
        this.B86 = '分（削峰填谷策略3停止时间）';
        this.B88 = '削峰填谷策略4';
        this.B90 = '削峰填谷策略4启用标志位';
        this.B92 = '时（削峰填谷策略4开始时间）';
        this.B94 = '分（削峰填谷策略4开始时间）';
        this.B96 = '时（削峰填谷策略4停止时间）';
        this.B98= '分（削峰填谷策略4停止时间）';
        this.B100 = '削峰填谷策略5';
        this.B102 = '削峰填谷策略5启用标志位';
        this.B104 = '时（削峰填谷策略5开始时间）';
        this.B106 = '分（削峰填谷策略5开始时间）';
        this.B108 = '时（削峰填谷策略5停止时间）';
        this.B110 = '分（削峰填谷策略5停止时间）';
        this.B112 = '削峰填谷策略6';
        this.B114 = '削峰填谷策略6启用标志位';
        this.B240 = '时（削峰填谷策略6开始时间）';
        this.B244 = '分（削峰填谷策略6开始时间）';
        this.B248 = '时（削峰填谷策略6停止时间）';
        this.B252 = '分（削峰填谷策略6停止时间）';
        this.B256 = '预留';
        this.B260 = '星期1';
        this.B264 = '星期2';
        this.B268 = '星期3';
        this.B272 = '星期4';
        this.B276 = '星期5';
        this.B280 = '星期6';
        this.B284 = '星期天';
        this.B288 = '峰谷策略1';
        this.B292 = '峰谷策略1设置功率';
        this.B296 = '峰谷策略1启用标志位';
        this.B300 = '时（峰谷策略1开始时间）';
        this.B304 = '分（峰谷策略1开始时间）';
        this.B308 = '时（峰谷策略1停止时间）';
        this.B312 = '分（峰谷策略1停止时间）';
        this.B316 = '峰谷策略2';
        this.B320 = '峰谷策略2设置功率';
        this.B324 = '峰谷策略2启用标志位';
        this.B328 = '时（峰谷策略2开始时间）';
        this.B332 = '分（峰谷策略2开始时间）';
        this.B336 = '时（峰谷策略2停止时间）';
        this.B340 = '分（峰谷策略2停止时间）';
        this.B344 = '峰谷策略3';
        this.B348 = '峰谷策略3设置功率';
        this.B352 = '峰谷策略3启用标志位';
        this.B356 = '时（峰谷策略3开始时间）';
        this.B360 = '分（峰谷策略3开始时间）';
        this.B364 = '时（峰谷策略3停止时间）';
        this.B368 = '分（峰谷策略3停止时间）';
        this.B372 = '峰谷策略4';
        this.B376 = '峰谷策略4设置功率';
        this.B380 = '峰谷策略4启用标志位';
        this.B384 = '时（峰谷策略4开始时间）';
        this.B388 = '分（峰谷策略4开始时间）';
        this.B392 = '时（峰谷策略4停止时间）';
        this.B396 = '分（峰谷策略4停止时间）';
        this.B400 = '峰谷策略5';
        this.B404 = '峰谷策略5设置功率';
        this.B408 = '峰谷策略5启用标志位';
        this.B412 = '时（峰谷策略5开始时间）';
        this.B416 = '分（峰谷策略5开始时间）';
        this.B420 = '时（峰谷策略5停止时间）';
        this.B424 = '分（峰谷策略5停止时间）';
        this.B428 = '峰谷策略6';
        this.B432 = '峰谷策略6设置功率';
        this.B436 = '峰谷策略6启用标志位';
        this.B440 = '时（峰谷策略6开始时间）';
        this.B444 = '分（峰谷策略6开始时间）';
        this.B448 = '时（峰谷策略6停止时间）';
        this.B452 = '分（峰谷策略6停止时间）';
    }
}