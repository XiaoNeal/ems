import DeviceBase from "./device-base.model"

// 0318 V2.3 水冷机组/液冷 —— 与网页版 micro-energy-station 0318v2_3-model.js 对齐
// camelCase 参数字段 + B86~B95 故障位本地解码，云端 JSON 已预缩放（本地不做二次缩放）
class Model0318V2_3 extends DeviceBase {
    constructor() {
        super()
        this.energyData = {
            startMode: { name: '启动模式', value: '--' },
            workMode: { name: '工作模式', value: '--' },
            supplyReturnTarget: { name: '供回水控制目标', value: '--' },
            coolingTempSetting: { name: '制冷预设温度(℃)', value: '--' },
            coolingDiff: { name: '制冷回差(℃)', value: '--' },
            heatingTempSetting: { name: '制热预设温度(℃)', value: '--' },
            heatingDiff: { name: '制热回差(℃)', value: '--' },
            tempControlPumpSpeed: { name: '控温时泵转速(%)', value: '--' },
            circulationPumpSpeed: { name: '自循环泵转速(%)', value: '--' },
            liquidTempHigh: { name: '液温过高点(℃)', value: '--' },
            liquidTempLow: { name: '液温过低点(℃)', value: '--' },
            returnPressureLow: { name: '回水压力过低点(bar)', value: '--' },
            supplyPressureHigh: { name: '供水压力过高点(bar)', value: '--' },
            supplyPressureWarning: { name: '供水压力预警点(bar)', value: '--' },
            supplyPressureWarningDiff: { name: '供水压力预警回差(bar)', value: '--' },
            // byte 38 电平信号（低字节 8 bit）
            B38b1: { name: '加热管过载', value: '--' },
            B38b2: { name: '风机过载', value: '--' },
            // byte 39 电平信号
            B39b0: { name: '系统高压', value: '--' },
            B39b2: { name: '系统低压', value: '--' },
            B39b5: { name: '液位开关', value: '--' },
            B39b6: { name: '供水泵过载', value: '--' },
            modbusAddr: { name: '485通讯地址', value: '--' },
            baudRate: { name: '波特率', value: '--' },
            unitRunStatus: { name: '机组运行状态', value: '--' },
            // byte 41 输出位
            B41b3: { name: '风机输出', value: '--' },
            B41b5: { name: '加热管输出', value: '--' },
            B41b6: { name: '报警继电器输出', value: '--' },
            B41b7: { name: '加热带输出', value: '--' },
            supplyLiquidTemp: { name: '供液温度(℃)', value: '--' },
            returnLiquidTemp: { name: '回液温度(℃)', value: '--' },
            systemEvapInlet: { name: '系统蒸进(℃)', value: '--' },
            evapOutletTemp: { name: '蒸出温度(℃)', value: '--' },
            envTemp: { name: '环境温度(℃)', value: '--' },
            systemCondensing: { name: '系统冷凝(℃)', value: '--' },
            expansionValveOpening: { name: '节流电膨当前开度(步)', value: '--' },
            pumpSpeed: { name: '水泵当前转速(%)', value: '--' },
            compressorSpeed: { name: '压缩机当前转速(RPS)', value: '--' },
            fanSpeed: { name: '风机转速(RPS)', value: '--' },
            supplyPressure: { name: '供水压力(bar)', value: '--' },
            returnPressure: { name: '回水压力(bar)', value: '--' },
            dischargePressure: { name: '排气压力(bar)', value: '--' },
            B86b0: { name: '供水压力传感器故障', value: '--' },
            B86b1: { name: '主板IIC故障', value: '--' },
            B86b2: { name: '回水压力低故障', value: '--' },
            B86b3: { name: '供水压力过高预警', value: '--' },
            B86b4: { name: '电压过高', value: '--' },
            B86b5: { name: '电压过低', value: '--' },
            B86b6: { name: '风机驱动电流过载', value: '--' },
            B86b7: { name: '供回水压差超低报警', value: '--' },
            B87b0: { name: '供水泵故障', value: '--' },
            B87b1: { name: '泵空转保护', value: '--' },
            B87b2: { name: '泵堵转保护', value: '--' },
            B87b3: { name: '泵过流故障', value: '--' },
            B87b4: { name: '泵欠压故障', value: '--' },
            B87b5: { name: '泵过压故障', value: '--' },
            B87b6: { name: '泵缺相/电流采样偏移/失步/预充故障', value: '--' },
            B87b7: { name: '泵驱动过热保护故障', value: '--' },
            B88b0: { name: '风机变频器通讯故障', value: '--' },
            B88b1: { name: '压机变频器其他故障', value: '--' },
            B88b2: { name: '风机变频器其他故障', value: '--' },
            B88b3: { name: '供回水压差低报警', value: '--' },
            B89b0: { name: '系统低压', value: '--' },
            B89b1: { name: '电加热保护', value: '--' },
            B89b2: { name: '风机过载', value: '--' },
            B89b3: { name: '系统高压故障', value: '--' },
            B89b4: { name: '蒸发进口探头故障', value: '--' },
            B89b5: { name: '蒸发出口探头故障', value: '--' },
            B89b6: { name: '系统高压报警锁定', value: '--' },
            B89b7: { name: '压机变频器通讯故障', value: '--' },
            B90b0: { name: '掉电报警', value: '--' },
            B90b1: { name: '液位故障', value: '--' },
            B91b0: { name: '液温探头故障', value: '--' },
            B91b1: { name: '回液探头故障', value: '--' },
            B91b2: { name: '环境探头故障', value: '--' },
            B91b3: { name: '液温过高', value: '--' },
            B91b4: { name: '回水压力传感器故障', value: '--' },
            B91b5: { name: '排气压力传感器故障', value: '--' },
            B91b6: { name: '液温过低', value: '--' },
            B91b7: { name: '供水压力过高预警', value: '--' },
            B92b0: { name: '压机运行中欠压', value: '--' },
            B92b1: { name: '压机输出缺相', value: '--' },
            B92b2: { name: '压机功率器件保护', value: '--' },
            B92b3: { name: '压机过热', value: '--' },
            B92b4: { name: '压机过载', value: '--' },
            B92b5: { name: '压机检测压机过载', value: '--' },
            B92b6: { name: '压机负载过重', value: '--' },
            B92b7: { name: '压机速度过大', value: '--' },
            B93b0: { name: '压机起动瞬间过流', value: '--' },
            B93b1: { name: '压机加速运行过流', value: '--' },
            B93b2: { name: '压机减速运行过流', value: '--' },
            B93b3: { name: '压机恒速运行过流', value: '--' },
            B93b4: { name: '压机加速运行过压', value: '--' },
            B93b5: { name: '压机减速运行过压', value: '--' },
            B93b6: { name: '压机恒速运行过压', value: '--' },
            B93b7: { name: '压机待机时过压', value: '--' },
            B94b0: { name: '压机中断溢出1', value: '--' },
            B94b1: { name: '压机中断溢出2', value: '--' },
            B94b2: { name: '压机启动中转子抖动过大', value: '--' },
            B94b3: { name: '压机运行中转子抖动过大', value: '--' },
            B94b4: { name: 'PFC过流', value: '--' },
            B94b5: { name: 'PFC峰值电流过大', value: '--' },
            B94b6: { name: 'PFC有效值电流过大', value: '--' },
            B95b0: { name: '压机D轴电流过大', value: '--' },
            B95b1: { name: '压机Q轴电流过大', value: '--' },
            B95b2: { name: '压机参数存储失败', value: '--' },
            B95b3: { name: '压机通讯异常', value: '--' },
            B95b4: { name: '压机电流检测故障', value: '--' },
            B95b5: { name: '压机启动中电机堵转', value: '--' },
            B95b6: { name: '压机运行中电机堵转', value: '--' },
            B95b7: { name: '压机失步故障', value: '--' },
            inverterFaultCode: { name: '变频器故障代码', value: '--' },
            systemFaultLevel: { name: '系统总故障等级', value: '--' },
            systemFaultCode: { name: '系统总故障代码', value: '--' },
            pfcFaultCode: { name: '三相PFC故障号', value: '--' },
            inverterOutputPower: { name: '变频器输出功率(W)', value: '--' },
            pumpRunHours: { name: '水泵累计运行小时(h)', value: '--' },
            pumpRunWeeks: { name: '水泵累计运行周数(天)', value: '--' },
            heatingRunHours: { name: '加热累计运行小时(h)', value: '--' },
            heatingRunWeeks: { name: '加热累计运行周数(天)', value: '--' },
            compressorRunHours: { name: '压缩机累计运行小时(h)', value: '--' },
            compressorRunWeeks: { name: '压缩机累计运行周数(天)', value: '--' },
            fanRunHours: { name: '风机累计运行时长(h)', value: '--' },
            fanRunWeeks: { name: '风机累计运行周数(天)', value: '--' },
        }
        this.stateData = {}
        // 位型字段 raw 属性防御：确保 energyData 里所有字段在初始化阶段就存在 raw 键
        // 避免某些环境下 raw 未定义导致故障标红判断失效
        Object.values(this.energyData).forEach(f => {
            if (f && typeof f === 'object' && !('raw' in f)) f.raw = null;
        });
    }

    getData(json) {
        // 宽松比较：兼容 dataType 为字符串('2')或数字(2)
        if (String(json.dataType) === '2') {
            this.getEnergyData(json)
        }
    }

    getEnergyData(jsonData) {
        if (!jsonData) return
        const data = jsonData.data || jsonData
        // 位型字段统一读取：后端可能直接下发位键(B86b0)，也可能只下发字节键(B86)。
        // 优先位键，缺失时从字节按位提取；两者都缺失返回 null（显示 --，避免误判为无故障）
        const readBit = (byte, idx) => {
            const bitKey = data['B' + byte + 'b' + idx];
            if (bitKey !== undefined && bitKey !== null && bitKey !== '') {
                const n = parseInt(bitKey);
                if (Number.isFinite(n)) return n & 1;
            }
            const byteVal = parseInt(data['B' + byte]);
            if (!Number.isFinite(byteVal)) return null;
            return (byteVal >> idx) & 1;
        };
        // 位型字段赋值：raw 存 0/1 位值供前端标红判断，value 按枚举转中文
        const setBitField = (key, byte, idx, enumMap) => {
            const bit = readBit(byte, idx);
            this.energyData[key].raw = bit;
            this.energyData[key].value = bit === null ? '--' : (enumMap[bit] !== undefined ? enumMap[bit] : bit);
        };
        this.energyData.startMode.value = startModeEnum[data.B0] || data.B0;
        this.energyData.workMode.value = workModeEnum[data.B2] || data.B2;
        this.energyData.supplyReturnTarget.value = supplyReturnTargetEnum[data.B4] || data.B4;
        this.energyData.coolingTempSetting.value = data.B6;
        this.energyData.coolingDiff.value = data.B8;
        this.energyData.heatingTempSetting.value = data.B10;
        this.energyData.heatingDiff.value = data.B12;
        this.energyData.tempControlPumpSpeed.value = data.B14;
        this.energyData.circulationPumpSpeed.value = data.B16;
        this.energyData.liquidTempHigh.value = data.B18;
        this.energyData.liquidTempLow.value = data.B20;
        this.energyData.returnPressureLow.value = data.B22;
        this.energyData.supplyPressureHigh.value = data.B24;
        this.energyData.supplyPressureWarning.value = data.B26;
        this.energyData.supplyPressureWarningDiff.value = data.B28;
        this.energyData.modbusAddr.value = data.B32;
        this.energyData.baudRate.value = baudRateEnum[data.B34] || data.B34;
        this.energyData.baudRate.raw = data.B34;
        this.energyData.unitRunStatus.value = unitRunStatusEnum(data.B36);
        // byte 38/39 电平信号、byte 41 输出位：0/1 位值按枚举转换
        setBitField('B38b1', 38, 1, levelEnum);
        setBitField('B38b2', 38, 2, levelEnum);
        setBitField('B39b0', 39, 0, levelEnum);
        setBitField('B39b2', 39, 2, levelEnum);
        setBitField('B39b5', 39, 5, levelEnum);
        setBitField('B39b6', 39, 6, levelEnum);
        setBitField('B41b3', 41, 3, outputEnum);
        setBitField('B41b5', 41, 5, outputEnum);
        setBitField('B41b6', 41, 6, outputEnum);
        setBitField('B41b7', 41, 7, outputEnum);
        this.energyData.supplyLiquidTemp.value = data.B42;
        this.energyData.returnLiquidTemp.value = data.B44;
        this.energyData.systemEvapInlet.value = data.B46;
        this.energyData.evapOutletTemp.value = data.B50;
        this.energyData.envTemp.value = data.B52;
        this.energyData.systemCondensing.value = data.B54;
        this.energyData.expansionValveOpening.value = data.B58;
        this.energyData.pumpSpeed.value = data.B60;
        this.energyData.compressorSpeed.value = data.B62;
        this.energyData.fanSpeed.value = data.B64;
        this.energyData.supplyPressure.value = data.B72;
        this.energyData.returnPressure.value = data.B74;
        this.energyData.dischargePressure.value = data.B78;
        // 故障字 B86~B95：后端 0=无故障，1=有故障，按位提取后经 faultEnum 转中文
        [[86, 8], [87, 8], [88, 4], [89, 8], [90, 2], [91, 8], [92, 8], [93, 8], [94, 7], [95, 8]].forEach(([byte, bits]) => {
            for (let i = 0; i < bits; i++) {
                setBitField('B' + byte + 'b' + i, byte, i, faultEnum);
            }
        });
        this.energyData.inverterFaultCode.value = inverterFaultEnum[data.B100] || data.B100;
        this.energyData.systemFaultLevel.value = data.B104;
        this.energyData.systemFaultCode.value = data.B106;
        this.energyData.pfcFaultCode.value = data.B112;
        this.energyData.inverterOutputPower.value = data.B114;
        this.energyData.pumpRunHours.value = data.B116;
        this.energyData.pumpRunWeeks.value = data.B118;
        this.energyData.heatingRunHours.value = data.B120;
        this.energyData.heatingRunWeeks.value = data.B122;
        this.energyData.compressorRunHours.value = data.B124;
        this.energyData.compressorRunWeeks.value = data.B126;
        this.energyData.fanRunHours.value = data.B128;
        this.energyData.fanRunWeeks.value = data.B130;
    }
}

// 启动模式
const startModeEnum = {
    '0': '手动',
    '1': '自动'
}

// 工作模式
const workModeEnum = {
    '0': '待机',
    '1': '制冷',
    '2': '加热',
    '3': '自循环',
    '4': '自动'
}

// 供回水控制目标
const supplyReturnTargetEnum = {
    '0': '供水',
    '1': '回水'
}

// 波特率
const baudRateEnum = {
    '0': '9600',
    '1': '4800',
    '2': '19200'
}

// 高低电平
const levelEnum = {
    '0': '低电平',
    '1': '高电平'
}

// 输出位（风机/加热管/报警继电器/加热带）
const outputEnum = {
    '0': '断开',
    '1': '输出'
}

// 故障状态
const faultEnum = {
    '0': '无故障',
    '1': '有故障'
}

// 变频器故障代码
const inverterFaultEnum = {
    '0': '无故障'
}

// 机组运行状态（低字节=状态，高字节=模式）
const unitRunStatusEnum = (val) => {
    if (val == null || val === '--') return '--'
    const num = parseInt(val)
    if (isNaN(num)) return val
    const lowByte = num & 0xFF
    const highByte = (num >> 8) & 0xFF
    const statusMap = ['空闲', '准备启动', '运行', '延时停机', '故障']
    const modeMap = ['待机', '制冷', '制热', '自循环']
    const status = statusMap[lowByte] || `状态${lowByte}`
    const mode = modeMap[highByte] || `模式${highByte}`
    return `${status}/${mode}`
}

export { Model0318V2_3 }
