import DeviceBase from "./device-base.model"

// 主类：3301设备Model
export class Model3301 extends DeviceBase {
    constructor() {
        super();
        // 初始化三个数据分类
        this.energyData = new EnergyData();
        this.stateData = new StateData();
        this.controlData = new ControlData();
    }


    // 处理能源数据
    getEnergyData(jsonData, jsonData2) {

    }


    getStatusData(jsonData) {
        for (const key in jsonData) {
            if (this.stateData.hasOwnProperty(key) && this.stateData[key]) {
                this.stateData[key].value = jsonData[key];
            }
        }
    }










    // 工具方法：寄存器类型转换
    setRegisterType(key) {
        switch (key) {
            case 1: return '线圈寄存器';
            case 2: return '离散寄存器';
            case 3: return '保持寄存器';
            case 4: return '输入寄存器';
            default: return key;
        }
    }

    // 工具方法：通信状态标识转换
    setCommFlag(key) {
        switch (key) {
            case 0: return 'EMS与设备通信正常';
            case 1: return 'EMS未读取到该设备数据';
            default: return key;
        }
    }
}

// 能源数据类（136个字段）
class EnergyData {
    constructor() {


    }
}

// 状态数据类
class StateData {
    constructor() {
        // 初始化字段
        this.B0 = { name: '设备大类（一字节，无符号）', value: "--" };
        this.B2 = { name: '设备小类（一字节，无符号）', value: "--" };
        this.B3 = { name: '设备在同类型设备中的索引号（ADDR，无符号）', value: "--" };
        this.B5 = { name: '设备ID值（双字节，无符号）', value: "--" };
        this.B9 = { name: '告警地址（四字节，无符号）', value: "--" };
        this.B13 = { name: '故障值（四字节，有符号）', value: "--" };
        this.B14 = { name: '补充说明（1字节，无符号）1：标识线圈寄存器；2：标识离散寄存器；3：标识保持寄存器；4：标识输入寄存器', value: "--" };
        this.B15 = { name: '补充说明（1字节，无符号）1：EMS未读取到该设备数据；0：EMS与该设备通信正常', value: "--" };
        this.B17 = { name: '补充说明（2字节，无符号）', value: "--" };
    }
}

// 控制数据类（13个字段）
class ControlData {
    constructor() {
        // 动态生成13个字段，匹配协议字节地址
    }
}