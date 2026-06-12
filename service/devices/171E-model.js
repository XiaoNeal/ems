import DeviceBase from "./device-base.model"

// 主类：171E光伏DC设备Model
export class Model171E extends DeviceBase {
    constructor() {
        super();
        // 初始化四个数据分类
        this.energyData = new EnergyData();
        this.stateData = new StateData();
        this.controlData = new ControlData();
    }


    // 处理能源数据（完全对齐1707格式，协议全量字段）
    getEnergyData(jsonData, jsonData2) {



        this.energyData.B0.value = jsonData.B0
        this.energyData.B4.value = jsonData.B4
        this.energyData.B8.value = jsonData.B8
        this.energyData.B12.value = jsonData.B12
        this.energyData.B16.value = jsonData.B16
        this.energyData.B20.value = jsonData.B20
        this.energyData.B24.value = jsonData.B24
        this.energyData.B28.value = jsonData.B28
        this.energyData.B32.value = jsonData.B32
        this.energyData.B36.value = jsonData.B36
        this.energyData.B40.value = jsonData.B40
        this.energyData.B44.value = jsonData.B44
        this.energyData.B48.value = (jsonData.B48 / 1000)
        this.energyData.B52.value = jsonData.B52
        const dcdcStatus = (jsonData.B56 >> 22) & 1;
        this.energyData.B56.value = dcdcStatus === 0 ? 'DCDC开机' : 'DCDC关机'
        this.energyData.B60.value = jsonData.B60
        this.energyData.B64.value = (jsonData.B64 / 1000);
        this.energyData.B68.value = jsonData.B68;
        this.energyData.B72.value = this.setInputWorkMode(jsonData.B72);
        this.energyData.B76.value = jsonData.B76;
        this.energyData.B80.value = jsonData.B80;
        this.energyData.B84.value = jsonData.B84;
        this.energyData.B88.value = jsonData.B88;
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

    // 工具方法：通信状态转换
    setCommStatus(key) {
        switch (key) {
            case 0: return '通信正常';
            case 1: return '通信故障';
            default: return key;
        }
    }

    // 工具方法：开关状态转换
    setSwitchStatus(key) {
        switch (key) {
            case 0x00000000: return '禁止';
            case 0x00010000: return '使能';
            default: return key;
        }
    }

    // 工具方法：电源开关状态转换
    setPowerSwitch(key) {
        switch (key) {
            case 0x00000000: return '开机';
            case 0x00010000: return '关机';
            default: return key;
        }
    }

    // 工具方法：地址分配模式转换
    setAddressMode(key) {
        switch (key) {
            case 0x00000000: return '自动分配';
            case 0x00010000: return '拨码设置';
            default: return key;
        }
    }

    // 工具方法：输入模式转换
    setInputMode(key) {
        switch (key) {
            case 0x00000001: return '交流模式(默认)';
            case 0x00000002: return '直流模式';
            default: return key;
        }
    }

    // 工具方法：运行状态转换
    setRunStatus(key) {
        switch (key) {
            case 0: return '待机';
            case 1: return '并网运行';
            case 3: return '离网运行';
            case 4: return 'MPPT运行';
            case 5: return '开环运行';
            case 6: return '调试模式';
            case 7: return '故障';
            default: return key;
        }
    }

    // 工具方法：输入工作模式转换
    setInputWorkMode(key) {
        switch (key) {
            case '00000001': return '单相交流';
            case '00000002': return '直流';
            case '00000003': return '三相交流';
            case '00000005': return '模式不匹配（相序错误）';
            default: return key;
        }
    }

    // 工具方法：工作模式转换
    setWorkMode(key) {
        switch (key) {
            case 0: return '待机';
            case 1: return '充电';
            case 2: return '放电';
            default: return key;
        }
    }
}

// 能源数据类（95个字段）
class EnergyData {
    constructor() {
        // 动态生成95个字段，匹配协议字节地址
        for (let i = 0; i < 544; i += 4) {
            this[`B${i}`] = null;
        }
        // 核心字段重命名，匹配协议
        this.B0 = { name: '模块电压', value: "--" };
        this.B4 = { name: '模块电流', value: "--" };
        this.B8 = { name: '模块限流点', value: "--" };
        this.B12 = { name: '模块DC板温度', value: "--" };
        this.B16 = { name: '模块输入相电压（直流输入电压）', value: "--" };
        this.B20 = { name: '模块PFC0 电压（正半母线）', value: "--" };
        this.B24 = { name: '模块PFC1 电压（负半母线）', value: "--" };
        this.B28 = { name: '模块面板（环境）温度', value: "--" };
        this.B32 = { name: '模块交流A相电压', value: "--" };
        this.B36 = { name: '模块交流B相电压', value: "--" };
        this.B40 = { name: '模块交流 C 相电压', value: "--" };
        this.B44 = { name: '模块 PFC 板温度', value: "--" };
        this.B48 = { name: '模块额定输出功率(kW)', value: "--" };
        this.B52 = { name: '模块额定输出电流', value: "--" };
        this.B56 = { name: '读取当前告警/状态', value: "--" };
        this.B60 = { name: '读取组号和拨码地址', value: "--" };
        this.B64 = { name: '读取输入功率(kW)', value: "--" };
        this.B68 = { name: '读取当前设定的海拔值', value: "--" };
        this.B72 = { name: '读取当前模块输入工作模式', value: "--" };
        this.B76 = { name: '读节点 SearialNo 号低位（ID 号）', value: "--" };
        this.B80 = { name: '读节点 SearialNo 号高位', value: "--" };
        this.B84 = { name: '读 DCDC 版本号', value: "--" };
        this.B88 = { name: '读 PFC 版本号', value: "--" };
    }
}

// 状态数据类（按协议置空，仅保留结构）
class StateData {
    constructor() {
        // 无有效字段，按协议置空
    }
}

// 控制数据类（12个字段）
class ControlData {
    constructor() {
        // 动态生成12个字段，匹配协议字节地址
        for (let i = 0; i < 48; i += 4) {
            this[`B${i}`] = null;
        }
        // 核心字段重命名，匹配协议
        this.B0 = { name: '设置模块工作海拔值', value: "--" };
        this.B4 = { name: '设置模块输出电流值', value: "--" };
        this.B8 = { name: '设置组号', value: "--" };
        this.B12 = { name: '设置模块地址分配方式', value: "--" };
        this.B16 = { name: '设置模块输出功率', value: "--" };
        this.B20 = { name: '设置模块输出电压', value: "--" };
        this.B24 = { name: '设置模块限流点', value: "--" };
        this.B28 = { name: '设置模块输出电压上限值', value: "--" };
        this.B32 = { name: '开关机', value: "--" };
        this.B36 = { name: '设置模块过压复位', value: "--" };
        this.B40 = { name: '设置模块输出过压保护关联是否允许', value: "--" };
        this.B44 = { name: '设置模块短路复位', value: "--" };
        this.B48 = { name: '设置模块输入模式', value: "--" };
    }
}
