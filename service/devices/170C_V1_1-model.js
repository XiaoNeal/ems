import DeviceBase from "./device-base.model"

// 170C V1.1 储能/光伏 DC-DC 变流器设备Model
// 与网页版 micro-energy-station 170C_V1_1-model.js 对齐：
// camelCase 字段键、云端 JSON 已预缩放（本地不做二次缩放）、故障码保留 raw 原值
export class Model170C_V1_1Model extends DeviceBase {
    constructor(number) {
        super();
        this.energyData = new EnergyData()
        this.stateData = new StatusData()
    }

    getEnergyData(jsonData) {
        if (!jsonData) return
        this.energyData.BATSetVoltage.value = jsonData.B0;
        this.energyData.maxChargeCurrent.value = jsonData.B2;
        this.energyData.maxDischargeCurrent.value = jsonData.B4;
        this.energyData.BUSSetVoltage.value = jsonData.B6;
        this.energyData.BUSSetCurrent.value = jsonData.B8;
        this.energyData.sagVoltageCoefficient.value = jsonData.B10;
        this.energyData.maxPowerLimit.value = jsonData.B12;
        this.energyData.BATUndervoltagePoint.value = jsonData.B14;
        this.energyData.BATOvervoltagePoint.value = jsonData.B16;
        this.energyData.BUSUndervoltagePoint.value = jsonData.B18;
        this.energyData.BUSOvervoltagePoint.value = jsonData.B20;
        this.energyData.BATChargeCurrentPoint.value = jsonData.B22;
        this.energyData.BATDishargeCurrentPoint.value = jsonData.B24;
        this.energyData.BUSChargeCurrentPoint.value = jsonData.B26;
        this.energyData.BUSDishargeCurrentPoint.value = jsonData.B28;
        this.energyData.BATVoltage.value = jsonData.B30;
        this.energyData.BUSVoltage.value = jsonData.B32;
        this.energyData.BUSCurrent.value = jsonData.B34;
        this.energyData.BATCurrent.value = jsonData.B36;
        this.energyData.maxTemperature.value = jsonData.B38;
        this.energyData.allowRunPower.value = jsonData.B40;
        this.energyData.runPower.value = jsonData.B42;
    }

    getStatusData(jsonData) {
        if (!jsonData || !jsonData.data) return
        // raw 保存后端原始码值（B0/B2/B4/B6），value 保存枚举中文，供页面展示与参数设置回显
        this.stateData.startOrder.value = startOrderEnum[jsonData.data.B0] || jsonData.data.B0;
        this.stateData.startOrder.raw = jsonData.data.B0;
        this.stateData.moduleMode.value = moduleModeEnum[jsonData.data.B2] || jsonData.data.B2;
        this.stateData.moduleMode.raw = jsonData.data.B2;
        this.stateData.workMode.value = workModeEnum[jsonData.data.B4] || jsonData.data.B4;
        this.stateData.workMode.raw = jsonData.data.B4;
        this.stateData.moduleShareCurrent.value = moduleShareCurrentEnum[jsonData.data.B6] || jsonData.data.B6;
        this.stateData.moduleShareCurrent.raw = jsonData.data.B6;
        this.stateData.runState.value = decodeRunState(jsonData.data.B8);
        this.stateData.runState.states = parseRunState(jsonData.data.B8);
        this.stateData.runState.raw = jsonData.data.B8;
        this.stateData.errorCode.value = errorCodeEnum[jsonData.data.B10] || jsonData.data.B10;
        this.stateData.errorCode.raw = jsonData.data.B10;
    }
}

class EnergyData {
    BATSetVoltage = { name: 'BAT侧电压给定(V)', value: '--' }
    maxChargeCurrent = { name: '最大充电电流限制(A)', value: '--' }
    maxDischargeCurrent = { name: '最大放电电流限制(A)', value: '--' }
    BUSSetVoltage = { name: 'BUS侧电压给定(V)', value: '--' }
    BUSSetCurrent = { name: 'BUS侧电流给定(A)', value: '--' }
    sagVoltageCoefficient = { name: '下垂电压系数(V)', value: '--' }
    maxPowerLimit = { name: '最大功率限制(kW)', value: '--' }
    BATUndervoltagePoint = { name: 'BAT侧欠压保护点(V)', value: '--' }
    BATOvervoltagePoint = { name: 'BAT侧过压保护点(V)', value: '--' }
    BUSUndervoltagePoint = { name: 'BUS侧欠压保护点(V)', value: '--' }
    BUSOvervoltagePoint = { name: 'BUS侧过压保护点(V)', value: '--' }
    BATChargeCurrentPoint = { name: 'BAT侧充电过流保护点(A)', value: '--' }
    BATDishargeCurrentPoint = { name: 'BAT侧放电过流保护点(A)', value: '--' }
    BUSChargeCurrentPoint = { name: 'BUS侧充电过流保护点(A)', value: '--' }
    BUSDishargeCurrentPoint = { name: 'BUS侧放电过流保护点(A)', value: '--' }
    BATVoltage = { name: 'BAT侧电压显示(V)', value: '--' }
    BUSVoltage = { name: 'BUS侧电压显示(V)', value: '--' }
    BUSCurrent = { name: 'BUS侧电流显示(A)', value: '--' }
    BATCurrent = { name: 'BAT侧电流显示(A)', value: '--' }
    maxTemperature = { name: '模块最高温度(℃)', value: '--' }
    allowRunPower = { name: '允许运行功率(kW)', value: '--' }
    runPower = { name: '当前运行功率(kW)', value: '--' }
}

class StatusData {
    startOrder = { name: '启动指令', value: '--' }
    moduleMode = { name: '模块功能选择', value: '--' }
    workMode = { name: '工作模式选择', value: '--' }
    moduleShareCurrent = { name: '模块并联均流', value: '--' }
    runState = { name: '机器运行状态', value: '--' }
    errorCode = { name: '故障码', value: '--' }
}

// 启动指令（0 为设备待机态，点表未列出，实测帧返回）
const startOrderEnum = {
    '0': '待机',
    '1': '启动',
    '2': '停机',
    '3': '复位'
}

// 模块功能选择
const moduleModeEnum = {
    '0': 'MPPT模块',
    '1': '双向DC/DC模块'
}

// 工作模式选择
const workModeEnum = {
    '1': 'BUS侧恒压',
    '2': 'BUS侧恒流',
    '3': 'BAT侧恒压',
    '4': 'BAT侧恒流',
    '5': 'BAT侧恒功率',
}

// 模块并联均流
const moduleShareCurrentEnum = {
    '0': '无均流',
    '1': '均流方式 1',
    '2': '均流方式 2',
    '3': '均流方式 3'
}

// 机器运行状态：B8 为 16 位掩码，BIT0~BIT7 各自独立置位（可多位同时为 1），BIT8~BIT15 保留
const runStateBits = [
    { bit: 0, name: '停机' },
    { bit: 1, name: '运行' },
    { bit: 2, name: '故障' },
    { bit: 3, name: '过载' },
    { bit: 4, name: 'BAT 软起' },
    { bit: 5, name: 'BAT 主接' },
    { bit: 6, name: 'BUS 软起' },
    { bit: 7, name: 'BUS 主接' },
]

// 将 B8 原始值转为二进制，提取 BIT0~BIT7 中置 1 的位，返回命中的中文状态数组
function parseRunState(val) {
    const num = Number(val)
    if (val === undefined || val === null || val === '' || isNaN(num)) return []
    return runStateBits.filter(item => (num >> item.bit) & 1).map(item => item.name)
}

// 机器运行状态展示值：多位命中时用「、」合并，无命中或非法值显示 --
function decodeRunState(val) {
    const states = parseRunState(val)
    return states.length ? states.join('、') : '--'
}

// 故障码
export const errorCodeEnum = {
    '0': '无故障',
    '1': '保留',
    '2': 'BUS侧过流保护',
    '3': '通讯故障',
    '4': '过流保护',
    '5': '保留',
    '6': 'BUS侧过压故障',
    '7': 'BAT侧过压故障',
    '8': 'BUS侧过压保护',
    '9': 'BAT侧欠压故障',
    '10': '修改为风扇故障',
    '11': 'BAT侧过压故障',
    '12': 'BAT侧过流',
    '13': 'BUS侧过流',
    '14': '散热器过热',
    '15': '单元1过流故障',
    '16': '单元2过流故障',
    '17': '单元3过流故障',
    '18': '单元4过流故障',
    '19': '单元5过流故障',
    '20': '单元6过流故障',
    '21': 'EEPORM读写故障（ERR21）',
    '22': '单元1VCE保护',
    '23': '单元2VCE保护',
    '24': '单元3VCE保护',
    '25': '单元4VCE保护',
    '26': '单元5VCE保护',
    '27': '单元6VCE保护',
    '28': 'Can地址重复故障',
    '41': '急停故障'
}
