import DeviceBase from "./device-base.model"

// 主类：171E光伏DC设备Model
export  class Model171E extends DeviceBase {
    constructor() {
        super();
        // 初始化四个数据分类
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
        this.B0 = '模块电压';
        this.B4 = '模块电流';
        this.B8 = ' 模块限流点';
        this.B12 = '模块DC板温度';
        this.B16 = '模块输入相电压（直流输入电压）';
        this.B20 = ' 模块PFC0 电压（正半母线）';
        this.B24 = '模块PFC1 电压（负半母线）';
        this.B28 = '模块面板（环境）温度';
        this.B32 = '模块交流A相电压';
        this.B36 = '模块交流B相电压';
        this.B40 = '模块交流 C 相电压';
        this.B44 = '模块 PFC 板温度';
        this.B48 = '模块额定输出功率';
        this.B52 = '模块额定输出电流';
        this.B56 = '读取当前告警/状态';
        this.B60 = '读取组号和拨码地址';
        this.B64 = '读取输入功率';
        this.B68 = '读取当前设定的海拔值';
        this.B72 = '读取当前模块输入工作模式';
        this.B76 = '读节点 SearialNo 号低位（ID 号）';
        this.B80 = '读节点 SearialNo 号高位';
        this.B84 = '读 DCDC 版本号';
        this.B88 = '读 PFC 版本号';
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
        this.B0 = '设置模块工作海拔值';
        this.B4 = '设置模块输出电流值';
        this.B8 = '设置组号';
        this.B12 = '设置模块地址分配方式';
        this.B16 = '设置模块输出功率';
        this.B20 = '设置模块输出电压';
        this.B24 = '设置模块限流点';
        this.B28 = '设置模块输出电压上限值';
        this.B32 = '开关机';
        this.B36 = '设置模块过压复位';
        this.B40 = '设置模块输出过压保护关联是否允许';
        this.B44 = '设置模块短路复位';
        this.B48 = '设置模块输入模式';
    }
}