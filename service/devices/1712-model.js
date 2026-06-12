import DeviceBase from "./device-base.model"

// 主类：1712设备Model
export class Model1712 extends DeviceBase {
    constructor() {
        super();
        // 初始化三个数据分类
        this.energyData = new EnergyData();
        this.stateData = new StateData();
        this.controlData = new ControlData();
    }

    getEnergyData(jsonData, jsonData2, barCode) {
        const data = jsonData.data || jsonData;
        for (const key in data) {
            if (this.energyData.hasOwnProperty(key) && this.energyData[key]) {
                let value = data[key];
                // 根据需要添加特定字段的数据格式化
                if (typeof value === 'number') {
                    // 默认保留两位小数，可根据需要调整
                    value = value.toFixed(2);
                }
                this.energyData[key].value = value;
            }
        }
    }

    getControlData(jsonData) {
        const data = jsonData.data || jsonData;
        for (const key in data) {
            if (this.controlData.hasOwnProperty(key) && this.controlData[key]) {
                this.controlData[key].value = data[key];
            }
        }
    }

    // 处理能源数据
    handleEnergyData(jsonData, jsonData2) {
        const data = jsonData.data || jsonData;
        for (const key in data) {
            if (this.energyData.hasOwnProperty(key) && this.energyData[key]) {
                let value = data[key];
                // 根据需要添加特定字段的数据格式化
                if (typeof value === 'number') {
                    // 默认保留两位小数，可根据需要调整
                    value = value.toFixed(2);
                }
                this.energyData[key].value = value;
            }
        }
    }

    // 处理状态数据
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

// 能源数据类
class EnergyData {
    constructor() {
        // 当前设备总数(已接)
        this.B0 = { name: '当前设备总数(已接)', value: "--" };
        // 多联机内机扫描数量(已接)
        this.B2 = { name: '多联机内机扫描数量(已接)', value: "--" };
        // 多联机外机扫描数量(已接)
        this.B4 = { name: '多联机外机扫描数量(已接)', value: "--" };
        // 直流电表扫描数量(已接)
        this.B6 = { name: '直流电表扫描数量(已接)', value: "--" };
        // 充电桩扫描数量(已接)
        this.B8 = { name: '充电桩扫描数量(已接)', value: "--" };
        // 照明扫描数量(已接)
        this.B10 = { name: '照明扫描数量(已接)', value: "--" };
        // 未知设备数量
        this.B12 = { name: '未知设备数量', value: "--" };
        // 柔度(平均值)
        this.B14 = { name: '柔度(平均值)', value: "--" };
        // 负载率(平均值)
        this.B16 = { name: '负载率(平均值)', value: "--" };
        // 能效水平(平均值)
        this.B18 = { name: '能效水平(平均值)', value: "--" };
        // 负荷功率（高位）
        this.B20 = { name: '负荷功率（高位）', value: "--" };
        // 柔性网关数量
        this.B24 = { name: '柔性网关数量', value: "--" };
        // 当前设备总数
        this.B26 = { name: '当前设备总数', value: "--" };
        // 可调节总功率（高位）
        this.B28 = { name: '可调节总功率（高位）', value: "--" };
        // 累计响应总电量（高位）
        this.B30 = { name: '累计响应总电量（高位）', value: "--" };
        // 光伏设备扫描数量
        this.B32 = { name: '光伏设备扫描数量', value: "--" };
        // 直流电梯扫描数量
        this.B34 = { name: '直流电梯扫描数量', value: "--" };
        // 直流空调扫描数量
        this.B36 = { name: '直流空调扫描数量', value: "--" };
    }
}

// 状态数据类
class StateData {
    constructor() {
        // 设备类型
        this.B0 = { name: '设备类型', value: "--" };
        // 设备能效水平
        this.B4 = { name: '设备能效水平', value: "--" };
        // 设备入网状态
        this.B8 = { name: '设备入网状态', value: "--" };
        // 设备通讯状态
        this.B12 = { name: '设备通讯状态', value: "--" };
        // 设备四级分类类型
        this.B16 = { name: '设备四级分类类型', value: "--" };
        // 预留
        this.B20 = { name: '预留', value: "--" };
        this.B24 = { name: '预留', value: "--" };
        this.B28 = { name: '预留', value: "--" };
        this.B32 = { name: '预留', value: "--" };
        this.B36 = { name: '预留', value: "--" };
        this.B40 = { name: '预留', value: "--" };
        this.B44 = { name: '预留', value: "--" };
        this.B48 = { name: '预留', value: "--" };
        // bit_0置为1:注册（十进制下发1） bit_1置为1：配置（十进制下发2） bit_2置为1：注销（十进制下发4）
        this.B52 = { name: '设备操作标志位', value: "--" };
        // 预留
        this.B56 = { name: '预留', value: "--" };
        this.B60 = { name: '预留', value: "--" };
        this.B64 = { name: '预留', value: "--" };
        this.B68 = { name: '预留', value: "--" };
        this.B72 = { name: '预留', value: "--" };
        // 设置柔度
        this.B76 = { name: '设置柔度', value: "--" };
        // 设置四级分类
        this.B80 = { name: '设置四级分类', value: "--" };
        // 开关
        this.B84 = { name: '开关', value: "--" };
        // 是否调控
        this.B88 = { name: '是否调控', value: "--" };
        // 响应等级
        this.B92 = { name: '响应等级', value: "--" };
        // 调控时长
        this.B96 = { name: '调控时长', value: "--" };
        // 设备ID
        this.B100 = { name: '设备ID', value: "--" };
        // 设备位置
        this.B104 = { name: '设备位置', value: "--" };
        // 设备柔度
        this.B108 = { name: '设备柔度', value: "--" };
        // 设备负载率
        this.B112 = { name: '设备负载率', value: "--" };
        // 设备额定功率（高位）
        this.B116 = { name: '设备额定功率（高位）', value: "--" };
        // 设备电压（高位）
        this.B120 = { name: '设备电压（高位）', value: "--" };
        // 设备电流（高位）
        this.B124 = { name: '设备电流（高位）', value: "--" };
        // 设备功率（高位）
        this.B128 = { name: '设备功率（高位）', value: "--" };
        // 设备累计正向电能（高位）
        this.B132 = { name: '设备累计正向电能（高位）', value: "--" };
        // 设备累计反向电能（高位）
        this.B136 = { name: '设备累计反向电能（高位）', value: "--" };
        // 设备所属子网关ID
        this.B140 = { name: '设备所属子网关ID', value: "--" };
        // 设备协议版本
        this.B144 = { name: '设备协议版本', value: "--" };
        // 设备状态数据区偏移寄存器数量
        this.B148 = { name: '设备状态数据区偏移寄存器数量', value: "--" };
        // 设备控制数据区偏移寄存器数量
        this.B152 = { name: '设备控制数据区偏移寄存器数量', value: "--" };
        // 可调节功率
        this.B156 = { name: '可调节功率', value: "--" };
        // 累计响应次数
        this.B160 = { name: '累计响应次数', value: "--" };
        // 累计响应时间
        this.B164 = { name: '累计响应时间', value: "--" };
        // 累计响应电量
        this.B168 = { name: '累计响应电量', value: "--" };
    }
}

// 控制数据类
class ControlData {
    constructor() {
        // 是否进行功率调控
        this.B0 = { name: '是否进行功率调控', value: "--" };
        // 调控总目标功率（高位）
        this.B4 = { name: '调控总目标功率（高位）', value: "--" };
        // 是否进行三级调控
        this.B8 = { name: '是否进行三级调控', value: "--" };
        // 响应等级
        this.B12 = { name: '响应等级', value: "--" };
        // 调控时长
        this.B16 = { name: '调控时长', value: "--" };
    }
}