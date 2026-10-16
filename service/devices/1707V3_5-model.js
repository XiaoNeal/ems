import DeviceBase from "./device-base.model"

// 1707 V3.5 PCS 储能变流器设备Model
export class Model1707V3_5 extends DeviceBase {
    energyData;
    stateData;
    controlData;

    constructor() {
        super();
        this.energyData = new EnergyData();
        this.stateData = new StateData();
        this.controlData = new ControlData();
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

// ============ 通用转换 ============
const v10 = v => Number(v) / 10
const v100 = v => Number(v) / 100
const v1000 = v => Number(v) / 1000

// 布尔状态 (1有效/0无效或相反)
const boolOn = v => (Number(v) === 1 ? '有效' : (Number(v) === 0 ? '无效' : v))
const boolRun = v => (Number(v) === 1 ? '运行' : (Number(v) === 0 ? '停机' : v))
// 远程/就地
const remoteLocal = v => (Number(v) === 1 ? '远程' : (Number(v) === 0 ? '就地' : v))
// 合/分闸
const closeOpen = v => (Number(v) === 1 ? '合闸' : (Number(v) === 0 ? '分闸' : v))
// 故障 (1故障/0正常)
const hasFault = v => (Number(v) === 1 ? '故障' : (Number(v) === 0 ? '正常' : v))

// 运行模式选择
const runModeSelectEnum = {
    0: '无', 1: '恒流充电', 2: '恒压充电', 3: '恒功率充电'
}

// BMS/CMS 工作指令
const bmsWorkCmdEnum = {
    0x1111: '禁充', 0x2222: '禁放', 0x5555: '待机',
    0xaaaa: '故障', 0xbbbb: '正常', 0xcccc: '告警'
}

// ============ 能源数据字段转换 ============
const fieldTransforms = {
    // PCS 端口电压 (实际值*10)
    'B0': v10, 'B2': v10, 'B4': v10,   // A/B/C 相电压
    // PCS 输出电流 (实际值*10)
    'B6': v10, 'B8': v10, 'B10': v10,  // A/B/C 相电流
    // 电网频率 (实际值*100)
    'B12': v100,
    // 有功功率 (实际值*10) A/B/C/总
    'B14': v10, 'B16': v10, 'B18': v10, 'B20': v10,
    // 无功功率 (实际值*10) A/B/C/总
    'B22': v10, 'B24': v10, 'B26': v10, 'B28': v10,
    // 视在功率 (实际值*10) A/B/C/总
    'B30': v10, 'B32': v10, 'B34': v10, 'B36': v10,
    // 功率因数 (实际值*1000) A/B/C/总
    'B38': v1000, 'B40': v1000, 'B42': v1000, 'B44': v1000,
    // 输入功率/电压/电流 (实际值*10)
    'B46': v10, 'B48': v10, 'B50': v10,
    // B52: 散热器温度 直传
    // 累计电量 (实际值*1000) 低/高 16位
    'B54': v1000, 'B56': v1000,   // 交流充电 低/高
    'B58': v1000, 'B60': v1000,   // 交流放电 低/高
    'B62': v1000, 'B64': v1000,   // 直流充电 低/高
    'B66': v1000, 'B68': v1000,   // 直流放电 低/高
    // B70: 通讯状态字 直传
    // 系统时钟 直传
    // PCS 程序版本 (实际值*10)
    'B84': v10,
    // B86: FPGA版本 直传
    // N 相电流 (实际值*10)
    'B88': v10,
    // B90~B104: 状态查询码 直传
    // 片上 SOC 温度 (实际值*10)
    'B106': v10,
    // IGBT 温度 1-1 ~ 4-2 直传
    // DCDC 输入/输出 电压电流 (实际值*10)
    'B124': v10, 'B126': v10,   // 输入/输出电压
    'B128': v10, 'B130': v10,   // 输入/输出电流
    'B132': v10,                // 输入功率
    // B134: DCDC散热器温度 直传
    // B140~B146: DCDC 故障字 直传
    // BMS/CMS 工作指令
    'B148': v => bmsWorkCmdEnum[v] ?? v,
    // BMS/CMS 允许充放电电流 (实际值*10)
    'B150': v10, 'B152': v10,
    // BMS/CMS SOC (实际值*10)
    'B154': v10,
    // BMS/CMS 可充放电电量 (实际值*10)
    'B156': v10, 'B158': v10,
    // BMS/CMS 总电压/总电流 (实际值*10)
    'B160': v10, 'B162': v10,
    // BMS/CMS 单体最高/最低 SOC (实际值*10)
    'B164': v10, 'B166': v10,
    // BMS/CMS 单体最高/最低电压 (实际值*10)
    'B168': v10, 'B170': v10,
    // BMS/CMS 单体最高/最低温度 (实际值*10)
    'B172': v10, 'B174': v10,
    // BMS/CMS 允许充放电功率 (实际值*10)
    'B176': v10, 'B178': v10,
}

// ============ 状态数据字段转换 ============
const stateFieldTransforms = {
    'B0': boolRun,      // 停机状态
    'B2': v => (Number(v) === 1 ? '待机' : '无效'),  // 待机状态
    'B4': v => (Number(v) === 1 ? '运行' : '无效'),  // 运行状态
    'B6': hasFault,     // 总故障状态
    'B8': v => (Number(v) === 1 ? '告警' : '正常'),  // 总报警状态
    'B10': remoteLocal, // 远程/就地状态
    'B12': v => (Number(v) === 1 ? '急停有效' : '正常'), // 急停输入状态
    'B14': v => (Number(v) === 1 ? '并网' : '离网'), // 并网状态
    'B16': v => (Number(v) === 1 ? 'VF离网' : '正常'), // VF离网状态
    'B18': v => (Number(v) === 1 ? '过载发生' : '正常'), // 过载降容
    'B22': v => (Number(v) === 1 ? '故障有效' : '正常'), // BMS干接点输入
}

// ============ 控制数据字段转换 ============
const controlFieldTransforms = {
    'B0': v => (Number(v) === 1 ? '复位' : '无'),     // 故障复位
    'B2': v => (Number(v) === 1 ? '启动' : '无'),     // 设备启动
    'B4': v => (Number(v) === 1 ? '停机' : '无'),     // 设备停机
    'B6': v => (Number(v) === 1 ? '急停' : '无'),     // 远程急停
    'B8': v => (Number(v) === 1 ? '清零' : '无'),     // 累计充电电量清零
    'B10': v => (Number(v) === 1 ? '清零' : '无'),    // 累计放电电量清零
    'B12': remoteLocal,  // 远程/就地设置
    'B14': v => (Number(v) === 1 ? '待机' : '无效'),  // 设备待机
    'B16': closeOpen,    // 外部电操开关

    // ===== 运行模式 / 设定值 =====
    'B18': v => runModeSelectEnum[v] ?? v,  // 运行模式选择
    // B20: 恒压充电电压设定值 直传
    // B22: 恒流充电电流设定值 直传
    'B24': v10,  // 恒功率有功功率期望
    'B26': v10,  // 恒功率无功功率期望
    // B28: 并离网设置 直传
    // B30: 离网输出电压给定 直传
    'B32': v100, // 离网输出频率给定
    // 分相控制 有功 (实际值*10)
    'B34': v10, 'B36': v10, 'B38': v10,  // A/B/C 相有功
    // 分相控制 无功 (实际值*10)
    'B40': v10, 'B42': v10, 'B44': v10,  // A/B/C 相无功
    // B46/B48/B50: 离网输出电压分相给定 A/B/C 直传
    // B52: 微网直流电压下垂系数 直传
    'B54': v100, // 一次调频频率死区
    // B56: 一次调频K值 直传
    // B58: VSG频率下垂系数 直传
    // B60: VSG电压下垂系数 直传
    // B62: 并离网开关运行模式 直传
    // B64~B70: 电池/超容 允许充放电电压电流 直传
    // B72~B82: 对时 秒/分/时/日/月/年 直传
    // B94~B102: 柜体风机 温度/时间/命令 直传
}

// ============ 故障字段（批量，0正常/1故障）============
const faultFieldNames = [
    'ARM软件故障-保留1','ARM软件故障-保留2','ARM软件故障-保留3','ARM软件故障-保留4',
    'ARM软件故障-保留5','ARM软件故障-保留6','ARM软件故障-保留7','ARM软件故障-保留8',
    'ARM软件故障-保留9','ARM软件故障-电池软件过压','ARM软件故障-电池软件欠压','ARM软件故障-母线不平衡异常',
    'ARM软件故障-母线半直压过压','ARM软件故障-DCDC启动超时','ARM软件故障-保留10','ARM软件故障-交流漏电流保护',
    'FPGA硬件故障-保留1','FPGA硬件故障-开关电源欠压','FPGA硬件故障-A相IGBT故障','FPGA硬件故障-B相IGBT故障',
    'FPGA硬件故障-C相IGBT故障','FPGA硬件故障-N相IGBT故障','FPGA硬件故障-过温故障','FPGA硬件故障-保留2',
    'FPGA硬件故障-A相硬件过流','FPGA硬件故障-B相硬件过流','FPGA硬件故障-C相硬件过流','FPGA硬件故障-N相硬件过流',
    'FPGA硬件故障-保留3','FPGA硬件故障-保留4','FPGA硬件故障-单元直压故障','FPGA硬件故障-保留5',
    'ARM软件故障-交流过压','ARM软件故障-交流欠压','ARM软件故障-输出过压','ARM软件故障-输出欠压',
    'ARM软件故障-电压THDU超限','ARM软件故障-系统缺相','ARM软件故障-系统相序错误','ARM软件故障-直流极性反接',
    'ARM软件故障-A相输出过流','ARM软件故障-A相输出速断','ARM软件故障-B相输出过流','ARM软件故障-B相输出速断',
    'ARM软件故障-C相输出过流','ARM软件故障-C相输出速断','ARM软件故障-N相输出速断1','ARM软件故障-N相输出速断2',
    'ARM软件故障-交流主接合闸故障','ARM软件故障-交流主接分闸故障','ARM软件故障-交流软启合闸故障','ARM软件故障-交流软启分闸故障',
    'ARM软件故障-直流主接合闸故障','ARM软件故障-直流主接分闸故障','ARM软件故障-直流软启合闸故障','ARM软件故障-直流软启合闸故障2',
    'ARM软件故障-直流母线软件过压','ARM软件故障-直流母线软件欠压','ARM软件故障-系统过频率','ARM软件故障-系统欠频率',
    'ARM软件故障-直流充电过流','ARM软件故障-直流放电过流','ARM软件故障-孤岛保护','ARM软件故障-直流分量超限',
    'ARM软件故障-BMS通讯故障','ARM软件故障-BMS温度异常','ARM软件故障-BMS跳机','ARM软件告警-BMS电池告警',
    'ARM软件故障-DCDC通讯故障','ARM软件故障-EMS通讯故障','ARM软件故障-急停或熔芯故障','ARM软件故障-PCS光纤通讯故障',
    'ARM软件故障-铁电参数存储错误','ARM软件故障-直流软起失败','ARM软件故障-保留11','ARM软件故障-保留12',
    'ARM软件故障-起机条件不满足','ARM软件故障-运行中开关故障','ARM软件故障-逆变启动超时','ARM软件故障-参数下发设置错误'
]
// 故障位从状态区之后连续分配
const faultStartAddr = 24
const faultAddrMap = {}
let _fa = faultStartAddr
for (const name of faultFieldNames) {
    const key = `B${_fa}`
    faultAddrMap[name] = key
    stateFieldTransforms[key] = hasFault
    _fa += 2
}

// ============ 数据容器 ============

export class ControlData {
    B0  = { name: '故障复位', value: "--" };
    B2  = { name: '设备启动', value: "--" };
    B4  = { name: '设备停机', value: "--" };
    B6  = { name: '远程急停', value: "--" };
    B8  = { name: '累计充电电量清零', value: "--" };
    B10 = { name: '累计放电电量清零', value: "--" };
    B12 = { name: '远程/就地设置', value: "--" };
    B14 = { name: '设备待机', value: "--" };
    B16 = { name: '外部电操开关', value: "--" };

    // ===== 运行模式 / 设定值 =====
    B18 = { name: '运行模式选择', value: "--" };
    B20 = { name: '恒压充电电压设定值(V)', value: "--" };
    B22 = { name: '恒流充电电流设定值(A)', value: "--" };
    B24 = { name: '恒功率有功功率期望(kW)', value: "--" };
    B26 = { name: '恒功率无功功率期望(kVar)', value: "--" };
    B28 = { name: '并离网设置', value: "--" };
    B30 = { name: '离网输出电压给定(V)', value: "--" };
    B32 = { name: '离网输出频率给定(Hz)', value: "--" };

    // 分相控制 有功/无功 (三相四线制)
    B34 = { name: '分相控制A相有功功率(kW)', value: "--" };
    B36 = { name: '分相控制B相有功功率(kW)', value: "--" };
    B38 = { name: '分相控制C相有功功率(kW)', value: "--" };
    B40 = { name: '分相控制A相无功功率(kVar)', value: "--" };
    B42 = { name: '分相控制B相无功功率(kVar)', value: "--" };
    B44 = { name: '分相控制C相无功功率(kVar)', value: "--" };

    // 离网输出电压分相给定
    B46 = { name: '离网输出电压分相给定A(V)', value: "--" };
    B48 = { name: '离网输出电压分相给定B(V)', value: "--" };
    B50 = { name: '离网输出电压分相给定C(V)', value: "--" };

    // 微网 / 一次调频 / VSG
    B52 = { name: '微网直流电压下垂系数(V)', value: "--" };
    B54 = { name: '一次调频频率死区(Hz)', value: "--" };
    B56 = { name: '一次调频K值', value: "--" };
    B58 = { name: 'VSG频率下垂系数', value: "--" };
    B60 = { name: 'VSG电压下垂系数', value: "--" };
    B62 = { name: '并离网开关运行模式', value: "--" };

    // 电池/超容 允许充放电
    B64 = { name: '电池/超容允许充电电压(V)', value: "--" };
    B66 = { name: '电池/超容允许放电电压(V)', value: "--" };
    B68 = { name: '电池/超容允许充电电流(A)', value: "--" };
    B70 = { name: '电池/超容允许放电电流(A)', value: "--" };

    // 对时
    B72 = { name: '对时-秒', value: "--" };
    B74 = { name: '对时-分', value: "--" };
    B76 = { name: '对时-时', value: "--" };
    B78 = { name: '对时-日', value: "--" };
    B80 = { name: '对时-月', value: "--" };
    B82 = { name: '对时-年', value: "--" };

    // 柜体风机
    B94 = { name: '柜体风机开启温度(℃)', value: "--" };
    B96 = { name: '柜体风机开启时间(秒)', value: "--" };
    B98 = { name: '柜体风机停止温度(℃)', value: "--" };
    B100 = { name: '柜体风机停止时间(秒)', value: "--" };
    B102 = { name: '柜体风机强制开启命令', value: "--" };
}

export class StateData {
    // ===== 运行状态 =====
    B0  = { name: '停机状态', value: "--" };
    B2  = { name: '待机状态', value: "--" };
    B4  = { name: '运行状态', value: "--" };
    B6  = { name: '总故障状态', value: "--" };
    B8  = { name: '总报警状态', value: "--" };
    B10 = { name: '远程/就地状态', value: "--" };
    B12 = { name: '急停输入状态', value: "--" };
    B14 = { name: '并网状态', value: "--" };
    B16 = { name: 'VF离网状态', value: "--" };
    B18 = { name: '过载降容', value: "--" };
    B22 = { name: 'BMS干接点输入', value: "--" };

    // ===== 故障标志（批量注入）=====
    constructor() {
        for (const name of faultFieldNames) {
            this[faultAddrMap[name]] = { name, value: "--" }
        }
    }
}

export class EnergyData {
    // ===== PCS 端口电压 =====
    B0  = { name: 'PCS端口A相电压(V)', value: "--" };
    B2  = { name: 'PCS端口B相电压(V)', value: "--" };
    B4  = { name: 'PCS端口C相电压(V)', value: "--" };
    // ===== PCS 输出电流 =====
    B6  = { name: 'PCS输出A相电流(A)', value: "--" };
    B8  = { name: 'PCS输出B相电流(A)', value: "--" };
    B10 = { name: 'PCS输出C相电流(A)', value: "--" };
    // 频率
    B12 = { name: '电网频率(Hz)', value: "--" };
    // ===== 有功功率 =====
    B14 = { name: 'PCS A相输出有功功率(kW)', value: "--" };
    B16 = { name: 'PCS B相输出有功功率(kW)', value: "--" };
    B18 = { name: 'PCS C相输出有功功率(kW)', value: "--" };
    B20 = { name: 'PCS 总输出有功功率(kW)', value: "--" };
    // ===== 无功功率 =====
    B22 = { name: 'PCS A相输出无功功率(kVar)', value: "--" };
    B24 = { name: 'PCS B相输出无功功率(kVar)', value: "--" };
    B26 = { name: 'PCS C相输出无功功率(kVar)', value: "--" };
    B28 = { name: 'PCS 总输出无功功率(kVar)', value: "--" };
    // ===== 视在功率 =====
    B30 = { name: 'PCS A相输出视在功率(kVA)', value: "--" };
    B32 = { name: 'PCS B相输出视在功率(kVA)', value: "--" };
    B34 = { name: 'PCS C相输出视在功率(kVA)', value: "--" };
    B36 = { name: 'PCS 总输出视在功率(kVA)', value: "--" };
    // ===== 功率因数 =====
    B38 = { name: 'PCS输出A相功率因数', value: "--" };
    B40 = { name: 'PCS输出B相功率因数', value: "--" };
    B42 = { name: 'PCS输出C相功率因数', value: "--" };
    B44 = { name: 'PCS输出总功率因数', value: "--" };
    // ===== 输入 =====
    B46 = { name: 'PCS输入功率(kW)', value: "--" };
    B48 = { name: 'PCS输入电压(V)', value: "--" };
    B50 = { name: 'PCS输入电流(A)', value: "--" };
    B52 = { name: 'PCS散热器温度(℃)', value: "--" };

    // ===== 累计电量 (低/高16位) =====
    B54 = { name: 'PCS交流累计充电电量-低16位(kWh)', value: "--" };
    B56 = { name: 'PCS交流累计充电电量-高16位(kWh)', value: "--" };
    B58 = { name: 'PCS交流累计放电电量-低16位(kWh)', value: "--" };
    B60 = { name: 'PCS交流累计放电电量-高16位(kWh)', value: "--" };
    B62 = { name: 'PCS直流累计充电电量-低16位(kWh)', value: "--" };
    B64 = { name: 'PCS直流累计充电电量-高16位(kWh)', value: "--" };
    B66 = { name: 'PCS直流累计放电电量-低16位(kWh)', value: "--" };
    B68 = { name: 'PCS直流累计放电电量-高16位(kWh)', value: "--" };

    // ===== 通讯 / 时钟 / 版本 =====
    B70 = { name: 'PCS通讯状态字', value: "--" };
    B72 = { name: '系统时钟-秒', value: "--" };
    B74 = { name: '系统时钟-分', value: "--" };
    B76 = { name: '系统时钟-时', value: "--" };
    B78 = { name: '系统时钟-日', value: "--" };
    B80 = { name: '系统时钟-月', value: "--" };
    B82 = { name: '系统时钟-年', value: "--" };
    B84 = { name: 'PCS程序版本', value: "--" };
    B86 = { name: 'FPGA程序版本', value: "--" };
    B88 = { name: 'N相电流有效值(A)', value: "--" };

    // ===== 状态查询码 =====
    B90 = { name: 'PCS状态查询码1', value: "--" };
    B92 = { name: 'PCS状态查询码2', value: "--" };
    B94 = { name: 'PCS状态查询码3', value: "--" };
    B96 = { name: 'PCS状态查询码4', value: "--" };
    B98 = { name: 'PCS状态查询码5', value: "--" };
    B100 = { name: 'PCS状态查询码6', value: "--" };
    B102 = { name: 'PCS状态查询码7', value: "--" };
    B104 = { name: 'PCS状态查询码8', value: "--" };

    // ===== 温度 =====
    B106 = { name: '片上SOC温度(℃)', value: "--" };
    B108 = { name: 'IGBT温度1-1', value: "--" };
    B110 = { name: 'IGBT温度1-2', value: "--" };
    B112 = { name: 'IGBT温度2-1', value: "--" };
    B114 = { name: 'IGBT温度2-2', value: "--" };
    B116 = { name: 'IGBT温度3-1', value: "--" };
    B118 = { name: 'IGBT温度3-2', value: "--" };
    B120 = { name: 'IGBT温度4-1', value: "--" };
    B122 = { name: 'IGBT温度4-2', value: "--" };

    // ===== DCDC =====
    B124 = { name: 'DCDC输入电压(V)', value: "--" };
    B126 = { name: 'DCDC输出电压(V)', value: "--" };
    B128 = { name: 'DCDC输入电流(A)', value: "--" };
    B130 = { name: 'DCDC输出电流(A)', value: "--" };
    B132 = { name: 'DCDC输入功率(kW)', value: "--" };
    B134 = { name: 'DCDC散热器温度', value: "--" };
    B136 = { name: 'DCDC程序版本', value: "--" };

    // ===== DCDC 故障字 =====
    B140 = { name: 'DCDC故障字1', value: "--" };
    B142 = { name: 'DCDC故障字2', value: "--" };
    B144 = { name: 'DCDC故障字3', value: "--" };
    B146 = { name: 'DCDC故障字4', value: "--" };

    // ===== BMS/CMS =====
    B148 = { name: 'BMS/CMS工作指令', value: "--" };
    B150 = { name: 'BMS/CMS允许充电电流(A)', value: "--" };
    B152 = { name: 'BMS/CMS允许放电电流(A)', value: "--" };
    B154 = { name: 'BMS/CMS SOC(%)', value: "--" };
    B156 = { name: 'BMS/CMS可充电电量(kWh)', value: "--" };
    B158 = { name: 'BMS/CMS可放电电量(kWh)', value: "--" };
    B160 = { name: 'BMS/CMS总电压(V)', value: "--" };
    B162 = { name: 'BMS/CMS总电流(A)', value: "--" };
    B164 = { name: 'BMS/CMS单体最高SOC(%)', value: "--" };
    B166 = { name: 'BMS/CMS单体最低SOC(%)', value: "--" };
    B168 = { name: 'BMS/CMS单体最高电压(V)', value: "--" };
    B170 = { name: 'BMS/CMS单体最低电压(V)', value: "--" };
    B172 = { name: 'BMS/CMS单体最高温度(℃)', value: "--" };
    B174 = { name: 'BMS/CMS单体最低温度(℃)', value: "--" };
    B176 = { name: 'BMS/CMS允许充电功率(kW)', value: "--" };
    B178 = { name: 'BMS/CMS允许放电功率(kW)', value: "--" };
}
