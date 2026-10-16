import DeviceBase from "./device-base.model"

// 0318 V2.3 水冷机/TMS 设备Model
export class Model0318V2_3 extends DeviceBase {
    energyData;
    stateData;

    constructor() {
        super();
        this.energyData = new EnergyData();
        this.stateData = new StateData();
    }

    getEnergyData(jsonData) {
        if (!jsonData) return
        const data = jsonData.data || jsonData
        for (const key in data) {
            if (this.energyData.hasOwnProperty(key) && this.energyData[key]) {
                let value = data[key]
                const fn = fieldTransforms[key]
                if (fn && value != null && value !== '' && value !== '--') {
                    value = fn(value)
                }
                this.energyData[key].value = value
            }
        }
    }

    getStatusData(jsonData) {
        if (!jsonData) return
        const data = jsonData.data || jsonData
        for (const key in data) {
            if (this.stateData.hasOwnProperty(key) && this.stateData[key]) {
                let value = data[key]
                const fn = stateFieldTransforms[key]
                if (fn && value != null && value !== '' && value !== '--') {
                    value = fn(value)
                }
                this.stateData[key].value = value
            }
        }
    }
}

// ============ 枚举映射 ============

// 启动模式
const startModeEnum = { 0: '手动', 1: '自动' }

// 工作模式
const workModeEnum = {
    0: '待机', 1: '制冷', 2: '加热', 3: '自循环', 4: '自动'
}

// 供回水控制目标
const targetCtrlEnum = { 0: '供水', 1: '回水' }

// 波特率
const baudRateEnum = { 0: '9600', 1: '4800', 2: '19200' }

// 机组运行状态：低字节(状态) + 高字节(模式)
const unitRunStatusEnum = {
    0: '空闲', 1: '准备启动', 2: '运行', 3: '延时停机', 4: '故障'
}
const unitRunModeEnum = {
    0: '待机', 1: '制冷', 2: '加热', 3: '自循环'
}
const decodeUnitRunStatus = (v) => {
    const val = Number(v)
    if (isNaN(val)) return v
    const status = val & 0xFF
    const mode = (val >> 8) & 0xFF
    const s = unitRunStatusEnum[status] ?? `状态${status}`
    const m = unitRunModeEnum[mode] ?? `模式${mode}`
    return `${s} / ${m}`
}

// DI 电平 (0低电平/1高电平)
const diLevel = v => (Number(v) === 1 ? '高电平' : (Number(v) === 0 ? '低电平' : v))

// DO 输出 (0断开/1输出)
const doOutput = v => (Number(v) === 1 ? '输出' : (Number(v) === 0 ? '断开' : v))

// 故障 (0无故障/1有故障)
const hasFault = v => (Number(v) === 1 ? '有故障' : (Number(v) === 0 ? '无故障' : v))

// 通用转换
const v10 = v => Number(v) / 10

// ============ 能源数据字段转换 ============
const fieldTransforms = {
    // 配置参数
    'B0':  v => startModeEnum[v] ?? v,     // 启动模式
    'B2':  v => workModeEnum[v] ?? v,      // 工作模式
    'B4':  v => targetCtrlEnum[v] ?? v,    // 供回水控制目标
    // B6~B20: 温度/转速 直传
    'B22': v10,  // 回水压力过低点
    'B24': v10,  // 供水压力过高点
    'B26': v10,  // 供水压力预警点
    'B28': v10,  // 供水压力预警回差
    // B32: 485通讯地址 直传
    'B34': v => baudRateEnum[v] ?? v,      // 波特率

    // 实时温度 (实际值*10)
    'B36': decodeUnitRunStatus,            // 机组运行状态
    'B46': v10,  // 供液温度
    'B48': v10,  // 回液温度
    'B50': v10,  // 系统蒸进
    'B54': v10,  // 蒸出温度
    'B56': v10,  // 环境温度
    'B58': v10,  // 系统冷凝
    // B60: 节流电膨当前开度 直传
    // B62: 水泵当前转速 直传
    // B64: 压缩机当前转速 直传
    // B66: 风机转速 直传
    'B70': v10,  // 供水压力
    'B72': v10,  // 回水压力
    'B74': v10,  // 排气压力
    // 变频器输出功率
    'B80': v10,  // 变频器输出功率 (0.1kW)
}

// ============ 状态数据字段转换 ============
const stateFieldTransforms = {
    // DI 电平
    'B38': diLevel,  // 加热管过载
    'B40': diLevel,  // 风机过载
    'B42': diLevel,  // 系统高压
    'B44': diLevel,  // 系统低压
    'B50': diLevel,  // 液位开关
    'B52': diLevel,  // 供水泵过载
    // DO 输出
    'B76': doOutput, // 风机
    'B78': doOutput, // 加热管
    'B80': doOutput, // 报警继电器
    'B82': doOutput, // 加热带
    // 故障标志 (从故障区起始，按表序)
}

// ============ 故障字段转换（故障区统一 0无故障/1有故障）============
// 故障位数量较多，构造时批量注入 stateFieldTransforms
const faultStartAddr = 84   // 故障区起始 B 地址（占位，连续步长2）
const faultFieldNames = [
    '供水压力传感器故障', '主板IIC故障', '回水压力低故障', '供水压力过高预警',
    '电压过高', '电压过低', '风机驱动电流过载', '供回水压差超低报警',
    '供水泵故障', '泵空转保护', '泵堵转保护', '泵过流故障', '泵欠压故障',
    '泵过压故障', '泵缺相/采样偏移/失步/预充故障', '泵驱动过热保护故障',
    '风机变频器通讯故障', '压机变频器其他故障', '风机变频器其他故障', '供回水压差低报警',
    '系统低压', '电加热保护', '风机过载', '系统高压故障',
    '蒸发进口探头故障', '蒸发出口探头故障', '系统高压报警锁定', '压机变频器通讯故障',
    '掉电报警', '液位故障', '液温探头故障', '回液探头故障',
    '环境探头故障', '液温过高', '回水压力传感器故障', '排气压力传感器故障',
    '液温过低', '供水压力过高预警', '压机运行中欠压', '压机输出缺相',
    '压机功率器件保护', '压机过热', '压机过载', '压机检测压机过载',
    '压机负载过重', '压机速度过大', '压机起动瞬间过流', '压机加速运行过流',
    '压机减速运行过流', '压机恒速运行过流', '压机加速运行过压', '压机减速运行过压',
    '压机恒速运行过压', '压机待机时过压', '压机中断溢出1', '压机中断溢出2',
    '压机启动中转子抖动过大', '压机运行中转子抖动过大', 'PFC过流', 'PFC峰值电流过大',
    'PFC有效值电流过大', '压机D轴电流过大', '压机Q轴电流过大', '压机参数存储失败',
    '压机通讯异常', '压机电流检测故障', '压机启动中电机堵转', '压机运行中电机堵转',
    '压机失速故障'
]
// 为故障字段批量生成 B 地址键（连续，步长2），跳过已定义的 DI/DO 区
// 实际地址需按协议"预留"位校准，此处按顺序连续分配
let _faultAddr = faultStartAddr
for (const name of faultFieldNames) {
    stateFieldTransforms[`B${_faultAddr}`] = hasFault
    _faultAddr += 2
}
const faultAddrMap = {} // name -> B地址，供 StateData 构造使用
_faultAddr = faultStartAddr
for (const name of faultFieldNames) {
    faultAddrMap[name] = `B${_faultAddr}`
    _faultAddr += 2
}

// ============ 数据容器 ============

export class EnergyData {
    // ===== 配置参数 =====
    B0  = { name: '启动模式', value: "--" };
    B2  = { name: '工作模式', value: "--" };
    B4  = { name: '供回水控制目标', value: "--" };
    B6  = { name: '制冷预设温度(℃)', value: "--" };
    B8  = { name: '制冷回差(℃)', value: "--" };
    B10 = { name: '制热预设温度(℃)', value: "--" };
    B12 = { name: '制热回差(℃)', value: "--" };
    B14 = { name: '控温时泵转速(%)', value: "--" };
    B16 = { name: '自循环泵转速(%)', value: "--" };
    B18 = { name: '液温过高点(℃)', value: "--" };
    B20 = { name: '液温过低点(℃)', value: "--" };
    B22 = { name: '回水压力过低点(bar)', value: "--" };
    B24 = { name: '供水压力过高点(bar)', value: "--" };
    B26 = { name: '供水压力预警点(bar)', value: "--" };
    B28 = { name: '供水压力预警回差(bar)', value: "--" };
    B32 = { name: '485通讯地址', value: "--" };
    B34 = { name: '波特率', value: "--" };

    // ===== 运行状态 / 实时量 =====
    B36 = { name: '机组运行状态', value: "--" };
    // 温度
    B46 = { name: '供液温度(℃)', value: "--" };
    B48 = { name: '回液温度(℃)', value: "--" };
    B50 = { name: '系统蒸进(℃)', value: "--" };
    B54 = { name: '蒸出温度(℃)', value: "--" };
    B56 = { name: '环境温度(℃)', value: "--" };
    B58 = { name: '系统冷凝(℃)', value: "--" };
    // 转速 / 开度
    B60 = { name: '节流电膨当前开度(步)', value: "--" };
    B62 = { name: '水泵当前转速(%)', value: "--" };
    B64 = { name: '压缩机当前转速(RPS)', value: "--" };
    B66 = { name: '风机转速(RPS)', value: "--" };
    // 压力
    B70 = { name: '供水压力(bar)', value: "--" };
    B72 = { name: '回水压力(bar)', value: "--" };
    B74 = { name: '排气压力(bar)', value: "--" };
    // 功率 / 故障码
    B80 = { name: '变频器输出功率(kW)', value: "--" };
    B84 = { name: '变频器故障代码', value: "--" };
    B86 = { name: '系统总故障等级', value: "--" };
    B88 = { name: '系统总故障代码', value: "--" };
    B90 = { name: '三相PFC故障号', value: "--" };

    // ===== 累计运行时长 =====
    B92 = { name: '水泵累计运行小时(h)', value: "--" };
    B94 = { name: '水泵累计运行周数(天)', value: "--" };
    B96 = { name: '加热累计运行小时(h)', value: "--" };
    B98 = { name: '加热累计运行周数(天)', value: "--" };
    B100 = { name: '压缩机累计运行小时(h)', value: "--" };
    B102 = { name: '压缩机累计运行周数(天)', value: "--" };
    B104 = { name: '风机累计运行时长(h)', value: "--" };
    B106 = { name: '风机累计运行周数(天)', value: "--" };
}

export class StateData {
    // ===== DI 输入 =====
    B38 = { name: '加热管过载', value: "--" };
    B40 = { name: '风机过载', value: "--" };
    B42 = { name: '系统高压', value: "--" };
    B44 = { name: '系统低压', value: "--" };
    // 注意：液位开关、供水泵过载 等 DI 与温度区 B50/B52 地址冲突，
    // 需按实际协议偏移校准。此处保留字段名。

    // ===== DO 输出 =====
    B76 = { name: '风机', value: "--" };
    B78 = { name: '加热管', value: "--" };
    B80 = { name: '报警继电器', value: "--" };
    B82 = { name: '加热带', value: "--" };

    // ===== 故障标志（批量，地址见 faultAddrMap）=====
    constructor() {
        for (const name of faultFieldNames) {
            this[faultAddrMap[name]] = { name, value: "--" }
        }
    }
}
