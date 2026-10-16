import DeviceBase from "./device-base.model"

// 171C V2.0 BMS电池管理系统设备Model
export class Model171C_V2 extends DeviceBase {
    energyData;
    stateData;
    controlData;

    constructor() {
        super();
        this.energyData = new EnergyData();
        this.stateData = new StateData();
        this.controlData = new ControlData();
    }

    getEnergyData(jsonData, jsonData2) {
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

    getControlData(jsonData) {
        if (!jsonData) return
        const data = jsonData.data || jsonData
        for (const key in data) {
            if (this.controlData.hasOwnProperty(key) && this.controlData[key]) {
                let value = data[key]
                const fn = controlFieldTransforms[key]
                if (fn && value != null && value !== '' && value !== '--') {
                    value = fn(value)
                }
                this.controlData[key].value = value
            }
        }
    }
}

// ============ 枚举映射 ============

// BMS接触器状态
const contactorStatusEnum = {
    0: '已断开',
    1: '正在连接_1',
    2: '正在连接_2',
    3: '已连接',
    4: '连接失败'
}

// 故障告警等级
const faultLevelEnum = {
    0: '无故障',
    1: '1级',
    2: '2级',
    3: '3级'
}

// 电池充放电状态
const chargeDischargeStatusEnum = {
    0: '空闲',
    1: '充电中',
    2: '放电中'
}

// BMS运行状态
const bmsRunStatusEnum = {
    0: '正常',
    1: '禁止充电',
    2: '禁止放电',
    3: '待机',
    4: '停止'
}

// 预充状态
const prechargeStatusEnum = {
    0: '无',
    1: '预充电',
    2: '已预充电',
    3: '预充电失败'
}

// 0/1 状态
const onOffEnum = { 0: '无效', 1: '有效' }
const balanceEnum = { 0: '未在均衡', 1: '在均衡' }
const relayEnum = { 0: '断开', 1: '闭合' }

// 自检状态
const selfCheckEnum = {
    0: '检查中',
    1: '完成',
    2: '失败',
    3: '预留'
}

// 继电器故障
const relayFaultEnum = {
    0: '无故障',
    1: '粘连故障',
    2: '开路故障',
    3: '诊断电路故障'
}

// 电池连接失败原因
const connectFailReasonEnum = {
    0: '成功',
    1: '通信失败',
    2: '数据错误',
    3: '其他错误'
}

// ============ 字段转换规则 ============
// 传输值 → 显示值
//  val/10      : 传输值=实际值*10
//  val/10-1000 : 传输值=(实际值+1000)*10
//  val-50      : 传输值=实际值+50 (温度)
//  val*5       : 传输值=实际值*5 (时间,单位5min)
//  enum        : 枚举映射

const v10 = v => v / 10
const v10_1000 = v => v / 10 - 1000
const vSub50 = v => v - 50
const vMul5 = v => v * 5

const fieldTransforms = {
    // 枚举状态
    'B0':  v => contactorStatusEnum[v] ?? v,
    'B2':  v => faultLevelEnum[v] ?? v,
    'B4':  v => chargeDischargeStatusEnum[v] ?? v,
    'B6':  v => bmsRunStatusEnum[v] ?? v,
    'B56': v => prechargeStatusEnum[v] ?? v,
    'B58': v => balanceEnum[v] ?? v,
    'B60': v => onOffEnum[v] ?? v,
    'B62': v => onOffEnum[v] ?? v,
    'B64': v => onOffEnum[v] ?? v,
    'B66': v => onOffEnum[v] ?? v,
    'B68': v => onOffEnum[v] ?? v,
    'B72': v => selfCheckEnum[v] ?? v,
    'B74': v => relayEnum[v] ?? v,
    'B76': v => relayEnum[v] ?? v,
    'B78': v => relayEnum[v] ?? v,
    'B80': v => relayEnum[v] ?? v,
    'B82': v => relayFaultEnum[v] ?? v,
    'B84': v => relayFaultEnum[v] ?? v,
    'B86': v => relayFaultEnum[v] ?? v,
    'B88': v => relayFaultEnum[v] ?? v,
    'B98': v => connectFailReasonEnum[v] ?? v,

    // 电压/电流/SOC/电量 (val/10)
    'B8':  v10,   // 充电最大电压
    'B10': v10,   // 最大放电电流
    'B12': v10,   // 放电最小电压
    'B14': v10,   // 最大充电电流
    'B16': v10,   // 电池电压
    'B42': v10,   // SOC
    'B44': v10,   // 实际电池剩余容量
    'B50': v10,   // HV1电压
    'B52': v10,   // HV2电压
    'B54': v10,   // BAT+电压
    'B70': v10,   // 电池累计电压
    'B140': v10,  // SOH
    'B142': v10,  // pack总容量
    'B144': v10,  // 单次放电累计电量
    'B146': v10,  // 单次充电累计电量
    'B148': v10,  // 放电累计电量
    'B150': v10,  // 充电累计电量
    'B160': v10,  // 当日累计充电量
    'B162': v10,  // 当日累计放电量
    'B194': v10,  // PACK1总压
    'B212': v10,  // PACK2总压
    'B230': v10,  // PACK3总压

    // 电流 (val/10 - 1000)
    'B18': v10_1000,  // 电池电流
    'B90': v10_1000,  // 分流器电流
    'B92': v10_1000,  // 霍尔电流1
    'B94': v10_1000,  // 霍尔电流2
    'B96': v10_1000,  // CAN霍尔电流

    // 温度 (val - 50)
    'B30': vSub50,  // 最高单体温度
    'B32': vSub50,  // 最低单体温度
    'B34': vSub50,  // 最大温差
    'B36': vSub50,  // 电池平均温度
    'B164': vSub50, // 极柱最大温度
    'B166': vSub50, // 极柱最小温度
    'B174': vSub50, // PDU1极柱温度
    'B176': vSub50, // PDU2极柱温度
    'B178': vSub50, // PDU3极柱温度
    'B180': vSub50, // PDU4极柱温度
    'B182': vSub50, // PDU5极柱温度
    'B184': vSub50, // PDU6极柱温度
    'B186': vSub50, // PDU7极柱温度
    'B188': vSub50, // PDU8极柱温度
    'B196': vSub50, // PACK1最高单体温度
    'B198': vSub50, // PACK1最低单体温度
    'B214': vSub50, // PACK2最高单体温度
    'B216': vSub50, // PACK2最低单体温度
    'B232': vSub50, // PACK3最高单体温度
    'B234': vSub50, // PACK3最低单体温度

    // 时间 (val * 5, 单位5min → 分钟)
    'B154': vMul5,  // 总使用时间
    'B156': vMul5,  // 总放电时间
    'B158': vMul5,  // 总充电时间
}

// ============ 状态数据转换规则 ============

// 0:无效/异常/关闭  1:有效/正常/开启
const stateOnOff = v => onOffEnum[v] ?? v
// 0:正常  1:异常
const normalAbnormal = v => (v === 0 ? '正常' : v === 1 ? '异常' : v)
// 0:无故障  1:有故障
const hasFault = v => (v === 0 ? '无故障' : v === 1 ? '有故障' : v)
// 0:关闭  1:开启
const closeOpen = v => (v === 0 ? '关闭' : v === 1 ? '开启' : v)
// 温度 (实际值+50)*10 → val/10 - 50
const v10Sub50 = v => v / 10 - 50
// 压力 实际值*1000 → val/1000
const v1000 = v => v / 1000

// TMS运行模式
const tmsRunModeEnum = { 1: '制冷', 2: '加热', 3: '自循环', 4: '自动', 5: '停机' }
// TMS运行状态
const tmsRunStatusEnum = { 0: '空闲', 1: '准备启动', 2: '运行中', 3: '延迟关机', 4: '故障', 5: '通信失败' }
// TMS供应商代码
const tmsSupplierEnum = { 0: '未知', 1: '泰铂', 2: '英维克', 3: '黑盾', 4: '同飞', 5: '零熵' }
// 产品机型
const productModelEnum = { 1: '8Kw单相', 2: '8KW三相', 3: '20KW三相', 4: '40KW三相', 5: '50KW三相', 6: '60KW三相' }
// TMS开关机故障复位
const tmsPowerEnum = { 0: '无效', 1: '开机', 2: '关机', 3: '故障复位' }
// TMS模式设置
const tmsModeSetEnum = { 0: '无效', 1: '制冷', 2: '制热', 3: '自循环' }
// 控制模式
const controlModeEnum = { 0: '出水温度控制模式', 1: '进水温度控制模式' }
// 报警等级
const alarmLevelEnum2 = { 0: '正常', 1: '1级', 2: '2级', 3: '3级' }
// 通信状态(0无效 1正常 2异常)
const commStatusEnum2 = { 0: '无效', 1: '通信正常', 2: '通信异常' }
// 通信状态(0异常 1正常)
const commStatusEnum3 = { 0: '异常', 1: '正常' }

const stateFieldTransforms = {
    // IO 状态 (0无效/1有效)
    'B0': stateOnOff, 'B2': stateOnOff, 'B4': stateOnOff, 'B6': stateOnOff,
    'B8': stateOnOff, 'B10': stateOnOff, 'B12': stateOnOff, 'B14': stateOnOff,
    'B16': stateOnOff, 'B18': stateOnOff, 'B20': stateOnOff, 'B22': stateOnOff, 'B24': stateOnOff,
    'B26': stateOnOff, 'B28': stateOnOff, 'B30': stateOnOff, 'B32': stateOnOff,
    'B34': stateOnOff, 'B36': stateOnOff, 'B38': stateOnOff, 'B40': stateOnOff,
    'B42': stateOnOff, 'B44': stateOnOff, 'B46': stateOnOff, 'B48': stateOnOff,
    'B50': stateOnOff, 'B52': stateOnOff, 'B54': stateOnOff, 'B56': stateOnOff, 'B58': stateOnOff,
    'B60': stateOnOff, 'B62': stateOnOff, 'B64': stateOnOff, 'B66': stateOnOff, 'B68': stateOnOff,
    'B70': stateOnOff, 'B72': stateOnOff, 'B74': stateOnOff,
    // 从机 HSS1/HSS2/DIL1/DIL2 (B76~B202)
    'B76': stateOnOff, 'B78': stateOnOff, 'B80': stateOnOff, 'B82': stateOnOff,
    'B84': stateOnOff, 'B86': stateOnOff, 'B88': stateOnOff, 'B90': stateOnOff,
    'B92': stateOnOff, 'B94': stateOnOff, 'B96': stateOnOff, 'B98': stateOnOff,
    'B100': stateOnOff, 'B102': stateOnOff, 'B104': stateOnOff, 'B106': stateOnOff,
    'B108': stateOnOff, 'B110': stateOnOff, 'B112': stateOnOff, 'B114': stateOnOff,
    'B116': stateOnOff, 'B118': stateOnOff, 'B120': stateOnOff, 'B122': stateOnOff,
    'B124': stateOnOff, 'B126': stateOnOff, 'B128': stateOnOff, 'B130': stateOnOff,
    'B132': stateOnOff, 'B134': stateOnOff, 'B136': stateOnOff, 'B138': stateOnOff,
    'B140': stateOnOff, 'B142': stateOnOff, 'B144': stateOnOff, 'B146': stateOnOff,
    'B148': stateOnOff, 'B150': stateOnOff, 'B152': stateOnOff, 'B154': stateOnOff,
    'B156': stateOnOff, 'B158': stateOnOff, 'B160': stateOnOff, 'B162': stateOnOff,
    'B164': stateOnOff, 'B166': stateOnOff, 'B168': stateOnOff, 'B170': stateOnOff,
    'B172': stateOnOff, 'B174': stateOnOff, 'B176': stateOnOff, 'B178': stateOnOff,
    'B180': stateOnOff, 'B182': stateOnOff, 'B184': stateOnOff, 'B186': stateOnOff,
    'B188': stateOnOff, 'B190': stateOnOff, 'B192': stateOnOff, 'B194': stateOnOff,
    'B196': stateOnOff, 'B198': stateOnOff, 'B200': stateOnOff, 'B202': stateOnOff,

    // 充放电故障 (0无故障/1有故障)
    'B204': hasFault, 'B206': hasFault, 'B208': hasFault,
    'B210': hasFault, 'B212': hasFault, 'B214': hasFault,
    'B216': hasFault, 'B218': hasFault, 'B220': hasFault,

    // CC电压 / CP占空比
    'B224': v1000,   // CC电压值 (实际值*1000)
    'B232': v10,     // CP PWM占空比 (实际值*10)

    // 温度 (实际值+50, int16)
    'B248': vSub50,  // 板载NTC温度
    'B250': vSub50,  // RTC片内温度
    'B252': vSub50,  // 分流器ADC片内温度

    // 额定电压/容量 (实际值*10)
    'B254': v10,     // 额定电压
    'B256': v10,     // 额定容量

    // 风机温度 (实际值+50, int8)
    'B266': vSub50, 'B268': vSub50, 'B270': vSub50, 'B272': vSub50,

    // 液冷压力/温度
    'B282': v1000,   // 回液压力
    'B284': v1000,   // 供液压力
    'B286': v10Sub50, // 环境温度
    'B288': v10Sub50, // TMS温度设置

    // TMS 枚举
    'B290': v => tmsRunModeEnum[v] ?? v,
    'B292': v => tmsRunStatusEnum[v] ?? v,
    'B294': v10Sub50, // TMS入口温度
    'B296': v10Sub50, // TMS出口温度
    'B298': v => tmsSupplierEnum[v] ?? v,
    'B300': v => productModelEnum[v] ?? v,
    'B304': v => controlModeEnum[v] ?? v,
    'B306': v1000,    // 进出水压差值
    'B312': v => commStatusEnum3[v] ?? v,

    // 机组状态 (0异常/1正常 或 0关闭/1开启)
    'B314': v => commStatusEnum3[v] ?? v,  // 机组运行状态
    'B316': v => commStatusEnum3[v] ?? v,  // 自检状态
    'B318': closeOpen,  // 制冷运行状态
    'B320': closeOpen,  // 制热运行状态
    'B322': closeOpen,  // 水泵运行状态
    'B324': closeOpen,  // 外风机运行状态
    'B326': v => commStatusEnum3[v] ?? v,  // 报警状态
    'B328': closeOpen,  // 补水泵运行状态

    // 压力/温度
    'B332': v1000,    // 低压侧压力值
    'B334': v1000,    // 高压侧压力值
    'B336': v10Sub50, // 冷凝盘管温度
    'B338': v10Sub50, // 板换温度
    'B340': v10Sub50, // 吸气温度
    'B342': v10Sub50, // 排气温度
    'B344': v10Sub50, // 环境温度
    'B352': v1000,    // 2#低压侧压力值
    'B354': v1000,    // 2#高压侧压力值
    'B356': v10Sub50, // 2#吸气温度
    'B358': v10Sub50, // 2#排气温度

    // TMS控制
    'B394': v => tmsPowerEnum[v] ?? v,
    'B396': v => tmsModeSetEnum[v] ?? v,
    'B398': v10Sub50, // 制冷设定点
    'B400': v10,      // 制冷回差
    'B402': v10Sub50, // 制热设定点
    'B404': v10,      // 制热回差
    'B406': v10Sub50, // 制冷目标参数设置
    'B408': v10Sub50, // 制热目标参数设置

    // 传感器
    'B410': v => commStatusEnum2[v] ?? v,
    'B420': v10Sub50, // 温度数值
    'B422': v => alarmLevelEnum2[v] ?? v,

    // 浓度报警 (0正常/1异常)
    'B424': normalAbnormal, 'B426': normalAbnormal,
    'B428': normalAbnormal, 'B430': normalAbnormal, 'B432': normalAbnormal,
}

// ============ 控制数据枚举映射 ============

// 请求类 (0无请求/1请求)
const reqNoReqEnum = { 0: '无请求', 1: '请求' }
const reqNoReq = v => reqNoReqEnum[v] ?? v

// 强控 (0不强控/1强控)
const forceCtlEnum = { 0: '不强控', 1: '强控' }
const forceCtl = v => forceCtlEnum[v] ?? v

// 绝缘检测控制 (0开启/1关闭/2上电只检测一次)
const insulationCtlEnum = { 0: '开启绝缘检测', 1: '关闭绝缘检测', 2: '上电只检测一次' }

// 系统锁 (0无请求/1释放)
const sysLockEnum = { 0: '无请求', 1: '系统锁释放' }

// ============ 控制数据字段转换 ============
const controlFieldTransforms = {
    // 心跳 - 直传
    // B0: 心跳 (无转换)

    // 上下电/预充请求 (0无请求/1请求)
    'B2': reqNoReq,   // 上高压请求
    'B4': reqNoReq,   // 下高压请求
    'B6': reqNoReq,   // 紧急下电请求
    'B8': reqNoReq,   // 预充请求

    // 绝缘检测开关 (0开启/1关闭)
    'B10': v => insulationCtlEnum[v] ?? v,

    // 重启/断路器/系统锁/故障复位
    'B12': reqNoReq,                    // 请求BMS重启
    'B14': reqNoReq,                    // 交流断路器切断请求
    'B16': v => sysLockEnum[v] ?? v,    // 系统锁
    'B18': reqNoReq,                    // 故障复位

    // 强控 (0不强控/1强控)
    'B20': forceCtl, 'B22': forceCtl, 'B24': forceCtl,  // HSS8, LSS1, LSS2
    'B26': forceCtl, 'B28': forceCtl, 'B30': forceCtl,  // DO1, DO2, DO3
    'B32': forceCtl, 'B34': forceCtl,                   // 强控预留 x2
    'B36': forceCtl,                                    // 强控使能位
    'B38': forceCtl, 'B40': forceCtl, 'B42': forceCtl,  // HSS1, HSS2, HSS3
    'B44': forceCtl, 'B46': forceCtl, 'B48': forceCtl,  // HSS4, HSS5, HSS6
    'B50': forceCtl,                                    // HSS7

    // 绝缘检测控制
    'B52': v => insulationCtlEnum[v] ?? v,

    // TMS开关机故障复位 / 模式设置 - 直传 (枚举同 state)
    'B54': v => tmsPowerEnum[v] ?? v,
    'B56': v => tmsModeSetEnum[v] ?? v,

    // TMS设定点/回差/目标参数
    'B58': v10Sub50,  // 制冷设定点
    'B60': v10,       // 制冷回差
    'B62': v10Sub50,  // 制热设定点
    'B64': v10,       // 制热回差
    'B66': v10Sub50,  // 制冷目标参数设置
    'B68': v10Sub50,  // 制热目标参数设置

    // 控温控湿
    'B70': v10Sub50,  // 控温开启值
    'B72': v10Sub50,  // 控温关闭值
    'B74': v10,       // 控湿度开启值
    'B76': v10,       // 控湿度关闭值

    // 温度报警上下限
    'B78': v10Sub50,  // 温度报警上限值
    'B80': v10Sub50,  // 温度报警下限值
}

// ============ 数据容器 ============

export class EnergyData {
    // 状态枚举
    B0  = { name: 'BMS接触器状态', value: "--" };
    B2  = { name: '故障告警等级', value: "--" };
    B4  = { name: '电池充放电状态', value: "--" };
    B6  = { name: 'BMS运行状态', value: "--" };

    // 电压电流
    B8  = { name: '充电最大电压(V)', value: "--" };
    B10 = { name: '最大放电电流(A)', value: "--" };
    B12 = { name: '放电最小电压(V)', value: "--" };
    B14 = { name: '最大充电电流(A)', value: "--" };
    B16 = { name: '电池电压(V)', value: "--" };
    B18 = { name: '电池电流(A)', value: "--" };
    B20 = { name: '电池平均电压(mV)', value: "--" };
    B22 = { name: '最大电池电压(mV)', value: "--" };
    B24 = { name: '最小电池电压(mV)', value: "--" };
    B26 = { name: '最大电压电池位置', value: "--" };
    B28 = { name: '最小电压电池位置', value: "--" };

    // 温度
    B30 = { name: '最高单体温度(℃)', value: "--" };
    B32 = { name: '最低单体温度(℃)', value: "--" };
    B34 = { name: '最大温差(℃)', value: "--" };
    B36 = { name: '电池平均温度(℃)', value: "--" };
    B38 = { name: '最大温度电池位置', value: "--" };
    B40 = { name: '最小温度电池位置', value: "--" };

    // SOC / 绝缘
    B42 = { name: 'SOC(%)', value: "--" };
    B44 = { name: '实际电池剩余容量(%)', value: "--" };
    B46 = { name: '正绝缘电阻(kΩ)', value: "--" };
    B48 = { name: '负绝缘电阻(kΩ)', value: "--" };

    // HV电压
    B50 = { name: 'HV1电压(V)', value: "--" };
    B52 = { name: 'HV2电压(V)', value: "--" };
    B54 = { name: 'BAT+电压(V)', value: "--" };

    // 状态位
    B56 = { name: '预充状态', value: "--" };
    B58 = { name: '均衡状态', value: "--" };
    B60 = { name: '加热状态', value: "--" };
    B62 = { name: '制冷状态', value: "--" };
    B64 = { name: '高压低锁定状态', value: "--" };
    B66 = { name: '准备状态', value: "--" };
    B68 = { name: 'BMS模式', value: "--" };
    B70 = { name: '电池累计电压(V)', value: "--" };
    B72 = { name: '自检状态', value: "--" };

    // 继电器状态
    B74 = { name: '总正继电器', value: "--" };
    B76 = { name: '总负继电器', value: "--" };
    B78 = { name: '预充继电器', value: "--" };
    B80 = { name: '断路器', value: "--" };

    // 继电器故障
    B82 = { name: '总正继电器故障', value: "--" };
    B84 = { name: '总负继电器故障', value: "--" };
    B86 = { name: '预充继电器故障', value: "--" };
    B88 = { name: '断路器故障', value: "--" };

    // 电流
    B90 = { name: '分流器电流(A)', value: "--" };
    B92 = { name: '霍尔电流1(A)', value: "--" };
    B94 = { name: '霍尔电流2(A)', value: "--" };
    B96 = { name: 'CAN霍尔电流(A)', value: "--" };

    // 连接 / 单体
    B98  = { name: '电池连接失败原因', value: "--" };
    B100 = { name: '电池未成功连接原因', value: "--" };
    B102 = { name: 'BMS最大单体值(mV)', value: "--" };
    B104 = { name: '最大单体值位置', value: "--" };
    B106 = { name: '单体压差(mV)', value: "--" };

    // 故障字
    B108 = { name: '故障字1', value: "--" };
    B110 = { name: '故障字2', value: "--" };
    B112 = { name: '故障字3', value: "--" };
    B114 = { name: '故障字4', value: "--" };
    B116 = { name: '故障字5', value: "--" };
    B118 = { name: '故障字6', value: "--" };
    B120 = { name: '故障字7', value: "--" };
    B122 = { name: '故障字8', value: "--" };
    B124 = { name: '故障字9', value: "--" };
    B126 = { name: '故障字10', value: "--" };
    B128 = { name: '故障字11', value: "--" };
    B130 = { name: '故障字12', value: "--" };
    B132 = { name: '故障字13', value: "--" };
    B134 = { name: '故障字14', value: "--" };
    B136 = { name: '故障字15', value: "--" };
    B138 = { name: '故障字16', value: "--" };

    // SOH / 容量 / 电量
    B140 = { name: 'SOH(%)', value: "--" };
    B142 = { name: 'pack总容量(AH)', value: "--" };
    B144 = { name: '单次放电累计电量(KWH)', value: "--" };
    B146 = { name: '单次充电累计电量(KWH)', value: "--" };
    B148 = { name: '放电累计电量(kWh)', value: "--" };
    B150 = { name: '充电累计电量(kWh)', value: "--" };
    B152 = { name: '累计充电次数', value: "--" };
    B154 = { name: '总使用时间(min)', value: "--" };
    B156 = { name: '总放电时间(min)', value: "--" };
    B158 = { name: '总充电时间(min)', value: "--" };
    B160 = { name: '当日累计充电量(kWh)', value: "--" };
    B162 = { name: '当日累计放电量(kWh)', value: "--" };

    // 极柱温度
    B164 = { name: '极柱最大温度(℃)', value: "--" };
    B166 = { name: '极柱最小温度(℃)', value: "--" };
    B168 = { name: '极柱最大温度位置', value: "--" };
    B170 = { name: '极柱最小温度位置', value: "--" };

    // PDU
    B172 = { name: 'PDU温度数量', value: "--" };
    B174 = { name: 'PDU1极柱温度(℃)', value: "--" };
    B176 = { name: 'PDU2极柱温度(℃)', value: "--" };
    B178 = { name: 'PDU3极柱温度(℃)', value: "--" };
    B180 = { name: 'PDU4极柱温度(℃)', value: "--" };
    B182 = { name: 'PDU5极柱温度(℃)', value: "--" };
    B184 = { name: 'PDU6极柱温度(℃)', value: "--" };
    B186 = { name: 'PDU7极柱温度(℃)', value: "--" };
    B188 = { name: 'PDU8极柱温度(℃)', value: "--" };

    // PACK 采集数量
    B190 = { name: 'PACK温感采集数量', value: "--" };
    B192 = { name: 'PACK电压采集数量', value: "--" };

    // PACK1
    B194 = { name: 'PACK1总压(V)', value: "--" };
    B196 = { name: 'PACK1最高单体温度(℃)', value: "--" };
    B198 = { name: 'PACK1最低单体温度(℃)', value: "--" };
    B200 = { name: 'PACK1最高温度位置', value: "--" };
    B202 = { name: 'PACK1最低温度位置', value: "--" };
    B204 = { name: 'PACK1最高电压位置', value: "--" };
    B206 = { name: 'PACK1最低电压位置', value: "--" };
    B208 = { name: 'PACK1最高单体电压(mV)', value: "--" };
    B210 = { name: 'PACK1最低单体电压(mV)', value: "--" };

    // PACK2
    B212 = { name: 'PACK2总压(V)', value: "--" };
    B214 = { name: 'PACK2最高单体温度(℃)', value: "--" };
    B216 = { name: 'PACK2最低单体温度(℃)', value: "--" };
    B218 = { name: 'PACK2最高温度位置', value: "--" };
    B220 = { name: 'PACK2最低温度位置', value: "--" };
    B222 = { name: 'PACK2最高电压位置', value: "--" };
    B224 = { name: 'PACK2最低电压位置', value: "--" };
    B226 = { name: 'PACK2最高单体电压(mV)', value: "--" };
    B228 = { name: 'PACK2最低单体电压(mV)', value: "--" };

    // PACK3
    B230 = { name: 'PACK3总压(V)', value: "--" };
    B232 = { name: 'PACK3最高单体温度(℃)', value: "--" };
    B234 = { name: 'PACK3最低单体温度(℃)', value: "--" };
    B236 = { name: 'PACK3最高温度位置', value: "--" };
    B238 = { name: 'PACK3最低温度位置', value: "--" };
    B240 = { name: 'PACK3最高电压位置', value: "--" };
    B242 = { name: 'PACK3最低电压位置', value: "--" };
    B244 = { name: 'PACK3最高单体电压(mV)', value: "--" };
    B246 = { name: 'PACK3最低单体电压(mV)', value: "--" };
}

export class StateData {
    // IO 状态
    B0  = { name: 'HSS1', value: "--" };
    B2  = { name: 'HSS2', value: "--" };
    B4  = { name: 'HSS3', value: "--" };
    B6  = { name: 'HSS4', value: "--" };
    B8  = { name: 'HSS5', value: "--" };
    B10 = { name: 'HSS6', value: "--" };
    B12 = { name: 'HSS7', value: "--" };
    B14 = { name: 'HSS8', value: "--" };
    B16 = { name: 'LSS1', value: "--" };
    B18 = { name: 'LSS2', value: "--" };
    B20 = { name: 'LSS3', value: "--" };
    B22 = { name: 'LSS4', value: "--" };
    B24 = { name: 'LSS5', value: "--" };
    B26 = { name: 'SW_OUT1', value: "--" };
    B28 = { name: 'SW_OUT2', value: "--" };
    B30 = { name: 'SW_OUT3', value: "--" };
    B32 = { name: 'SW_OUT4', value: "--" };
    B34 = { name: 'DIH1', value: "--" };
    B36 = { name: 'DIH2', value: "--" };
    B38 = { name: 'DIH3', value: "--" };
    B40 = { name: 'DIH4', value: "--" };
    B42 = { name: 'DIH5', value: "--" };
    B44 = { name: 'DIH6', value: "--" };
    B46 = { name: 'DIH7', value: "--" };
    B48 = { name: 'DIH8', value: "--" };
    B50 = { name: 'DIL1', value: "--" };
    B52 = { name: 'DIL2', value: "--" };
    B54 = { name: 'DIL3', value: "--" };
    B56 = { name: 'DIL4', value: "--" };
    B58 = { name: 'DIL5', value: "--" };
    B60 = { name: 'DIS1(SWDi1)', value: "--" };
    B62 = { name: 'DIS2(SWDi2)', value: "--" };
    B64 = { name: 'DIS3(SWDi3)', value: "--" };
    B66 = { name: 'DIS4(SWDi4)', value: "--" };
    B68 = { name: 'DIS5(SWDi5)', value: "--" };
    B70 = { name: 'SW_IN1', value: "--" };
    B72 = { name: 'SW_IN2', value: "--" };
    B74 = { name: 'SW_IN3', value: "--" };

    // 从机 HSS1 (1~16号从机)
    B76 = { name: '1号从机HSS1', value: "--" };
    B78 = { name: '2号从机HSS1', value: "--" };
    B80 = { name: '3号从机HSS1', value: "--" };
    B82 = { name: '4号从机HSS1', value: "--" };
    B84 = { name: '5号从机HSS1', value: "--" };
    B86 = { name: '6号从机HSS1', value: "--" };
    B88 = { name: '7号从机HSS1', value: "--" };
    B90 = { name: '8号从机HSS1', value: "--" };
    B92 = { name: '9号从机HSS1', value: "--" };
    B94 = { name: '10号从机HSS1', value: "--" };
    B96 = { name: '11号从机HSS1', value: "--" };
    B98 = { name: '12号从机HSS1', value: "--" };
    B100 = { name: '13号从机HSS1', value: "--" };
    B102 = { name: '14号从机HSS1', value: "--" };
    B104 = { name: '15号从机HSS1', value: "--" };
    B106 = { name: '16号从机HSS1', value: "--" };

    // 从机 HSS2 (1~16号从机)
    B108 = { name: '1号从机HSS2', value: "--" };
    B110 = { name: '2号从机HSS2', value: "--" };
    B112 = { name: '3号从机HSS2', value: "--" };
    B114 = { name: '4号从机HSS2', value: "--" };
    B116 = { name: '5号从机HSS2', value: "--" };
    B118 = { name: '6号从机HSS2', value: "--" };
    B120 = { name: '7号从机HSS2', value: "--" };
    B122 = { name: '8号从机HSS2', value: "--" };
    B124 = { name: '9号从机HSS2', value: "--" };
    B126 = { name: '10号从机HSS2', value: "--" };
    B128 = { name: '11号从机HSS2', value: "--" };
    B130 = { name: '12号从机HSS2', value: "--" };
    B132 = { name: '13号从机HSS2', value: "--" };
    B134 = { name: '14号从机HSS2', value: "--" };
    B136 = { name: '15号从机HSS2', value: "--" };
    B138 = { name: '16号从机HSS2', value: "--" };

    // 从机 DIL1 (1~16号从机)
    B140 = { name: '1号从机DIL1', value: "--" };
    B142 = { name: '2号从机DIL1', value: "--" };
    B144 = { name: '3号从机DIL1', value: "--" };
    B146 = { name: '4号从机DIL1', value: "--" };
    B148 = { name: '5号从机DIL1', value: "--" };
    B150 = { name: '6号从机DIL1', value: "--" };
    B152 = { name: '7号从机DIL1', value: "--" };
    B154 = { name: '8号从机DIL1', value: "--" };
    B156 = { name: '9号从机DIL1', value: "--" };
    B158 = { name: '10号从机DIL1', value: "--" };
    B160 = { name: '11号从机DIL1', value: "--" };
    B162 = { name: '12号从机DIL1', value: "--" };
    B164 = { name: '13号从机DIL1', value: "--" };
    B166 = { name: '14号从机DIL1', value: "--" };
    B168 = { name: '15号从机DIL1', value: "--" };
    B170 = { name: '16号从机DIL1', value: "--" };

    // 从机 DIL2 (1~16号从机)
    B172 = { name: '1号从机DIL2', value: "--" };
    B174 = { name: '2号从机DIL2', value: "--" };
    B176 = { name: '3号从机DIL2', value: "--" };
    B178 = { name: '4号从机DIL2', value: "--" };
    B180 = { name: '5号从机DIL2', value: "--" };
    B182 = { name: '6号从机DIL2', value: "--" };
    B184 = { name: '7号从机DIL2', value: "--" };
    B186 = { name: '8号从机DIL2', value: "--" };
    B188 = { name: '9号从机DIL2', value: "--" };
    B190 = { name: '10号从机DIL2', value: "--" };
    B192 = { name: '11号从机DIL2', value: "--" };
    B194 = { name: '12号从机DIL2', value: "--" };
    B196 = { name: '13号从机DIL2', value: "--" };
    B198 = { name: '14号从机DIL2', value: "--" };
    B200 = { name: '15号从机DIL2', value: "--" };
    B202 = { name: '16号从机DIL2', value: "--" };

    // 充放电故障
    B204 = { name: '放电自检故障', value: "--" };
    B206 = { name: '放电诊断故障标志', value: "--" };
    B208 = { name: '放电诊断故障动作', value: "--" };
    B210 = { name: '充电自检故障', value: "--" };
    B212 = { name: '充电诊断故障标志', value: "--" };
    B214 = { name: '充电诊断故障动作', value: "--" };
    B216 = { name: '其他放电故障1', value: "--" };
    B218 = { name: '其他充电故障2', value: "--" };
    B220 = { name: '国标充电通信故障', value: "--" };

    // CC / CP
    B222 = { name: 'CC阻值(Ω)', value: "--" };
    B224 = { name: 'CC电压值(V)', value: "--" };
    B226 = { name: 'CC2阻值(Ω)', value: "--" };
    B228 = { name: 'CC2电压值(V)', value: "--" };
    B230 = { name: 'CP PWM频率(Hz)', value: "--" };
    B232 = { name: 'CP PWM占空比(%)', value: "--" };

    // 供电电压 (mV)
    B234 = { name: 'BCU供电电压(mV)', value: "--" };
    B236 = { name: '霍尔12V供电电压(mV)', value: "--" };
    B238 = { name: '霍尔5V供电电压(mV)', value: "--" };
    B240 = { name: '霍尔基准电压(mV)', value: "--" };
    B242 = { name: '系统5V电压(mV)', value: "--" };
    B244 = { name: '系统3V电压(mV)', value: "--" };
    B246 = { name: '高压ADC12V电压(mV)', value: "--" };

    // 板载温度
    B248 = { name: '板载NTC温度(℃)', value: "--" };
    B250 = { name: 'RTC片内温度(℃)', value: "--" };
    B252 = { name: '分流器ADC片内温度(℃)', value: "--" };

    // 额定参数
    B254 = { name: '额定电压(V)', value: "--" };
    B256 = { name: '额定容量(Ah)', value: "--" };
    B258 = { name: '单体数量', value: "--" };
    B260 = { name: '电池温感数', value: "--" };
    B262 = { name: '从机(pack)数量', value: "--" };
    B264 = { name: '极柱温感数', value: "--" };

    // 风机
    B266 = { name: '风机T1温度(℃)', value: "--" };
    B268 = { name: '风机T2温度(℃)', value: "--" };
    B270 = { name: '风机T3温度(℃)', value: "--" };
    B272 = { name: '风机T4温度(℃)', value: "--" };
    B274 = { name: '风机1转速', value: "--" };
    B276 = { name: '风机2转速', value: "--" };
    B278 = { name: '风机3转速', value: "--" };
    B280 = { name: '风机4转速', value: "--" };

    // 液冷
    B282 = { name: '回液压力(bar)', value: "--" };
    B284 = { name: '供液压力(bar)', value: "--" };
    B286 = { name: '环境温度(℃)', value: "--" };
    B288 = { name: 'TMS温度设置(℃)', value: "--" };

    // TMS
    B290 = { name: 'TMS运行模式', value: "--" };
    B292 = { name: 'TMS运行状态', value: "--" };
    B294 = { name: 'TMS入口温度(℃)', value: "--" };
    B296 = { name: 'TMS出口温度(℃)', value: "--" };
    B298 = { name: 'TMS供应商代码', value: "--" };
    B300 = { name: '产品机型', value: "--" };
    B302 = { name: '软件版本', value: "--" };
    B304 = { name: '控制模式', value: "--" };
    B306 = { name: '进出水压差值(bar)', value: "--" };
    B308 = { name: '压缩机转速(rpm)', value: "--" };
    B310 = { name: '交流供电电压(V)', value: "--" };
    B312 = { name: '通信状态', value: "--" };

    // 机组运行状态
    B314 = { name: '机组运行状态', value: "--" };
    B316 = { name: '自检状态', value: "--" };
    B318 = { name: '制冷运行状态', value: "--" };
    B320 = { name: '制热运行状态', value: "--" };
    B322 = { name: '水泵运行状态', value: "--" };
    B324 = { name: '外风机运行状态', value: "--" };
    B326 = { name: '报警状态', value: "--" };
    B328 = { name: '补水泵运行状态', value: "--" };
    B330 = { name: '电子膨胀阀开度', value: "--" };
    B332 = { name: '低压侧压力值(bar)', value: "--" };
    B334 = { name: '高压侧压力值(bar)', value: "--" };
    B336 = { name: '冷凝盘管温度(℃)', value: "--" };
    B338 = { name: '板换温度(℃)', value: "--" };
    B340 = { name: '吸气温度(℃)', value: "--" };
    B342 = { name: '排气温度(℃)', value: "--" };
    B344 = { name: '环境温度(℃)', value: "--" };
    B346 = { name: '系统流量', value: "--" };
    B348 = { name: '水泵转速', value: "--" };
    B350 = { name: '2#电子膨胀阀开度', value: "--" };
    B352 = { name: '2#低压侧压力值(bar)', value: "--" };
    B354 = { name: '2#高压侧压力值(bar)', value: "--" };
    B356 = { name: '2#吸气温度(℃)', value: "--" };
    B358 = { name: '2#排气温度(℃)', value: "--" };
    B360 = { name: '2#水泵转速', value: "--" };

    // TMS故障字透传
    B362 = { name: 'TMS故障字1透传', value: "--" };
    B364 = { name: 'TMS故障字2透传', value: "--" };
    B366 = { name: 'TMS故障字3透传', value: "--" };
    B368 = { name: 'TMS故障字4透传', value: "--" };
    B370 = { name: 'TMS故障字5透传', value: "--" };
    B372 = { name: 'TMS故障字6透传', value: "--" };
    B374 = { name: 'TMS故障字7透传', value: "--" };
    B376 = { name: 'TMS故障字8透传', value: "--" };
    B378 = { name: 'TMS故障字9透传', value: "--" };
    B380 = { name: 'TMS故障字10透传', value: "--" };
    B382 = { name: 'TMS故障字11透传', value: "--" };
    B384 = { name: 'TMS故障字12透传', value: "--" };
    B386 = { name: 'TMS故障字13透传', value: "--" };
    B388 = { name: 'TMS故障字14透传', value: "--" };
    B390 = { name: 'TMS故障字15透传', value: "--" };
    B392 = { name: 'TMS故障字16透传', value: "--" };

    // TMS控制
    B394 = { name: 'TMS开关机故障复位', value: "--" };
    B396 = { name: 'TMS模式设置', value: "--" };
    B398 = { name: '制冷设定点(℃)', value: "--" };
    B400 = { name: '制冷回差', value: "--" };
    B402 = { name: '制热设定点(℃)', value: "--" };
    B404 = { name: '制热回差', value: "--" };
    B406 = { name: '制冷目标参数设置(℃)', value: "--" };
    B408 = { name: '制热目标参数设置(℃)', value: "--" };

    // 传感器 / 浓度
    B410 = { name: '通信状态', value: "--" };
    B412 = { name: 'CO浓度(ppm)', value: "--" };
    B414 = { name: '氢气浓度(ppm)', value: "--" };
    B416 = { name: '烟雾数值(ppm)', value: "--" };
    B418 = { name: 'VOC数值(ppm)', value: "--" };
    B420 = { name: '温度数值(℃)', value: "--" };
    B422 = { name: '报警等级', value: "--" };

    // 浓度报警
    B424 = { name: 'CO浓度报警', value: "--" };
    B426 = { name: '氢气浓度报警', value: "--" };
    B428 = { name: 'VOC浓度报警', value: "--" };
    B430 = { name: '烟雾浓度报警', value: "--" };
    B432 = { name: '温度报警', value: "--" };
}

export class ControlData {
    B0  = { name: '心跳', value: "--" };

    // 上下电 / 预充请求
    B2  = { name: '上高压请求', value: "--" };
    B4  = { name: '下高压请求', value: "--" };
    B6  = { name: '紧急下电请求', value: "--" };
    B8  = { name: '预充请求', value: "--" };
    B10 = { name: '绝缘检测开关', value: "--" };

    // 系统控制
    B12 = { name: '请求BMS重启', value: "--" };
    B14 = { name: '交流断路器切断请求', value: "--" };
    B16 = { name: '系统锁', value: "--" };
    B18 = { name: '故障复位', value: "--" };

    // 强控
    B20 = { name: '强控HSS8', value: "--" };
    B22 = { name: '强控LSS1', value: "--" };
    B24 = { name: '强控LSS2', value: "--" };
    B26 = { name: '强控DO1', value: "--" };
    B28 = { name: '强控DO2', value: "--" };
    B30 = { name: '强控DO3', value: "--" };
    B32 = { name: '强控预留1', value: "--" };
    B34 = { name: '强控预留2', value: "--" };
    B36 = { name: '强控使能位', value: "--" };
    B38 = { name: '强控HSS1', value: "--" };
    B40 = { name: '强控HSS2', value: "--" };
    B42 = { name: '强控HSS3', value: "--" };
    B44 = { name: '强控HSS4', value: "--" };
    B46 = { name: '强控HSS5', value: "--" };
    B48 = { name: '强控HSS6', value: "--" };
    B50 = { name: '强控HSS7', value: "--" };
    B52 = { name: '绝缘检测控制', value: "--" };

    // TMS控制
    B54 = { name: 'TMS开关机故障复位', value: "--" };
    B56 = { name: 'TMS模式设置', value: "--" };
    B58 = { name: '制冷设定点(℃)', value: "--" };
    B60 = { name: '制冷回差', value: "--" };
    B62 = { name: '制热设定点(℃)', value: "--" };
    B64 = { name: '制热回差', value: "--" };
    B66 = { name: '制冷目标参数设置(℃)', value: "--" };
    B68 = { name: '制热目标参数设置(℃)', value: "--" };

    // 控温控湿 / 报警阈值
    B70 = { name: '控温开启值(℃)', value: "--" };
    B72 = { name: '控温关闭值(℃)', value: "--" };
    B74 = { name: '控湿度开启值(%)', value: "--" };
    B76 = { name: '控湿度关闭值(%)', value: "--" };
    B78 = { name: '温度报警上限值(℃)', value: "--" };
    B80 = { name: '温度报警下限值(℃)', value: "--" };
}
