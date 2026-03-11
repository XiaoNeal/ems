import DeviceBase from "./device-base.model"

export class Model1704 extends DeviceBase {
    constructor(number) {
        super();
        const str = number ? '簇' + number : ''
        this.energyData = {
            voltage: { name: str + '电压(V)', value: '--' },
            current: { name: str + '电流(A)', value: '--' },
            soc: { name: str + 'SOC(%)', value: '--' },
            soh: { name: str + 'SOH(%)', value: '--' },
            soe: { name: str + 'SOE(%)', value: '--' },
            maxCellVoltage: { name: str + '单体最高电压(V)', value: '--' },
            maxCellVoltageId: { name: str + '单体最高电压ID', value: '--' },
            minCellVoltage: { name: str + '单体最低电压(V)', value: '--' },
            minCellVoltageId: { name: str + '单体最低电压ID', value: '--' },
            maxCellTemperature: { name: str + '单体最高温度(℃)', value: '--' },
            maxCellTemperatureId: { name: str + '单体最高温度ID', value: '--' },
            minCellTemperature: { name: str + '单体最低温度(℃)', value: '--' },
            minCellTemperatureId: { name: str + '单体最低温度ID', value: '--' },
        }
        this.stateData = {
            runState: { name: str + '运行状态', value: '--' },
            chargeState: { name: str + '充放电状态', value: '--' },
            alarmLevel: { name: str + '告警等级', value: '--' },
            chargerState: { name: str + '预充电器状态', value: '--' },
            mainNegativeState: { name: str + '主负继电器状态', value: '--' },
            mainPositiveState: { name: str + '主正继电器状态', value: '--' },
        }
        this.batteryStackEnergyData = {
            voltage: { name: '电压(V)', value: '--' },
            current: { name: '电流(A)', value: '--' },
            soc: { name: 'SOC', value: '--' },
            soh: { name: 'SOH', value: '--' },
            soe: { name: 'SOE', value: '--' },
            maxCellVoltage: { name: '单体最高电压(V)', value: '--' },
            minCellVoltage: { name: '单体最低电压(V)', value: '--' },
            maxCellTemperature: { name: '单体最高温度', value: '--' },
            minCellTemperature: { name: '单体最低温度', value: '--' },
            chargeLimitCurrent: { name: '充电限制电流(A)', value: '--' },
            dischargeLimitCurrent: { name: '放电限制电流(A)', value: '--' },
            chargeLimitVoltage: { name: '充电限制电压(V)', value: '--' },
            dischargeLimitVoltage: { name: '放电限制电压(V)', value: '--' },
            chargeAvailableEletricity: { name: '充电可用电量(kWh)', value: '--' },
            dischargeAvailableEletricity: { name: '放电可用电量(kWh)', value: '--' },
            totalCharge: { name: '总充电量(kWh)', value: '--' },
            totalDischarge: { name: '总放电量(kWh)', value: '--' },
        }
        this.batteryStackStateData = {
            runState: { name: str + '运行状态', value: '--' },
            chargeState: { name: str + '充放电状态', value: '--' },
            alarmLevel: { name: str + '告警等级', value: '--' },
        }
    }

    getEnergyData(jsonData) {
        // 电池堆数据
        this.batteryStackEnergyData.voltage.value = jsonData.B0
        this.batteryStackEnergyData.current.value = jsonData.B2
        this.batteryStackEnergyData.soc.value = jsonData.B4
        this.batteryStackEnergyData.soh.value = jsonData.B6
        this.batteryStackEnergyData.soe.value = jsonData.B8
        this.batteryStackEnergyData.maxCellVoltage.value = jsonData.B10
        this.batteryStackEnergyData.minCellVoltage.value = jsonData.B12
        this.batteryStackEnergyData.maxCellTemperature.value = jsonData.B14.toFixed(2)
        this.batteryStackEnergyData.minCellTemperature.value = jsonData.B16.toFixed(2)
        this.batteryStackEnergyData.chargeLimitCurrent.value = jsonData.B18
        this.batteryStackEnergyData.dischargeLimitCurrent.value = jsonData.B20
        this.batteryStackEnergyData.chargeLimitVoltage.value = jsonData.B22
        this.batteryStackEnergyData.dischargeLimitVoltage.value = jsonData.B24
        this.batteryStackEnergyData.chargeAvailableEletricity.value = jsonData.B26
        this.batteryStackEnergyData.dischargeAvailableEletricity.value = jsonData.B28
        this.batteryStackEnergyData.totalCharge.value = jsonData.B30
        this.batteryStackEnergyData.totalDischarge.value = jsonData.B34

        // 电池簇数据
        this.energyData.voltage.value = jsonData.B38;
        this.energyData.current.value = jsonData.B40;
        this.energyData.soc.value = jsonData.B42;
        this.energyData.soh.value = jsonData.B44;
        this.energyData.soe.value = jsonData.B46;
        this.energyData.maxCellVoltage.value = jsonData.B48;
        this.energyData.maxCellVoltageId.value = jsonData.B50;
        this.energyData.minCellVoltage.value = jsonData.B52;
        this.energyData.minCellVoltageId.value = jsonData.B54;
        this.energyData.maxCellTemperature.value = jsonData.B56;
        this.energyData.maxCellTemperatureId.value = jsonData.B58;
        this.energyData.minCellTemperature.value = jsonData.B60;
        this.energyData.minCellTemperatureId.value = jsonData.B62;
        // this.energyData.chargeLimitVoltage.value = jsonData.data.B64;
        // this.energyData.chargeLimitCurrent.value = jsonData.data.B66;
        // this.energyData.dischargeLimitVoltage.value = jsonData.data.B68;
        // this.energyData.dischargeLimitCurrent.value = jsonData.data.B70;
        // this.energyData.voltageHigherLightAlarm.value = jsonData.data.B72;
        // this.energyData.voltageHigherModerateAlarm.value = jsonData.data.B74;
        // this.energyData.voltageHigherHeavyAlarm.value = jsonData.data.B76;
        // this.energyData.voltageLowerLightAlarm.value = jsonData.data.B78;
        // this.energyData.voltageLowerModerateAlarm.value = jsonData.data.B80;
        // this.energyData.voltageLowerHeavyAlarm.value = jsonData.data.B82;
        // this.energyData.singleVoltageLowerLightAlarm.value = jsonData.data.B84;
        // this.energyData.singleVoltageLowerModerateAlarm.value = jsonData.data.B86;
        // this.energyData.singleVoltageLowerHeavyAlarm.value = jsonData.data.B88;
        // this.energyData.singleVoltageHigherLightAlarm.value = jsonData.data.B90;
        // this.energyData.singleVoltageHigherModerateAlarm.value = jsonData.data.B92;
        // this.energyData.singleVoltageHigherHeavyAlarm.value = jsonData.data.B94;
        // this.energyData.socLowerLightAlarm.value = jsonData.data.B96;
        // this.energyData.socLowerModerateAlarm.value = jsonData.data.B98;
        // this.energyData.socLowerHeavyAlarm.value = jsonData.data.B100;
        // this.energyData.socHigherLightAlarm.value = jsonData.data.B102;
        // this.energyData.socHigherModerateAlarm.value = jsonData.data.B104;
        // this.energyData.socHigherHeavyAlarm.value = jsonData.data.B106;
        // this.energyData.chargeTempLowerLightAlarm.value = jsonData.data.B108;
        // this.energyData.chargeTempLowerModerateAlarm.value = jsonData.data.B110;
        // this.energyData.chargeTempLowerHeavyAlarm.value = jsonData.data.B112;
        // this.energyData.chargeTempHigherLightAlarm.value = jsonData.data.B114;
        // this.energyData.chargeTempHigherModerateAlarm.value = jsonData.data.B116;
        // this.energyData.chargeTempHigherHeavyAlarm.value = jsonData.data.B118;
        // this.energyData.dischargeTempLowerLightAlarm.value = jsonData.data.B120;
        // this.energyData.dischargeTempLowerModerateAlarm.value = jsonData.data.B122;
        // this.energyData.dischargeTempLowerHeavyAlarm.value = jsonData.data.B124;
        // this.energyData.dischargeTempHigherLightAlarm.value = jsonData.data.B126;
        // this.energyData.dischargeTempHigherModerateAlarm.value = jsonData.data.B128;
        // this.energyData.dischargeTempHigherHeavyAlarm.value = jsonData.data.B130;
        // this.energyData.chargeOverCurrentLightAlarm.value = jsonData.data.B132;
        // this.energyData.chargeOverCurrentModerateAlarm.value = jsonData.data.B134;
        // this.energyData.chargeOverCurrentHeavyAlarm.value = jsonData.data.B136;
        // this.energyData.dischargeOverCurrentLightAlarm.value = jsonData.data.B138;
        // this.energyData.dischargeOverCurrentModerateAlarm.value = jsonData.data.B140;
        // this.energyData.dischargeOverCurrentHeavyAlarm.value = jsonData.data.B142;
        // this.energyData.insulationImpedanceLowerLightAlarm.value = jsonData.data.B144;
        // this.energyData.insulationImpedanceLowerModerateAlarm.value = jsonData.data.B146;
        // this.energyData.insulationImpedanceLowerHeavyAlarm.value = jsonData.data.B148;
        // this.energyData.tempDiffHigherLightAlarm.value = jsonData.data.B150;
        // this.energyData.tempDiffHigherModerateAlarm.value = jsonData.data.B152;
        // this.energyData.tempDiffHigherHeavyAlarm.value = jsonData.data.B154;
        // this.energyData.pressureDiffHigherLightAlarm.value = jsonData.data.B156;
        // this.energyData.pressureDiffHigherModerateAlarm.value = jsonData.data.B158;
        // this.energyData.pressureDiffHigherHeavyAlarm.value = jsonData.data.B160;
        // this.energyData.singleTempChangeFasterLightAlarm.value = jsonData.data.B162;
        // this.energyData.singleTempChangeFasterModerateAlarm.value = jsonData.data.B164;
        // this.energyData.singleTempChangeFasterHeavyAlarm.value = jsonData.data.B166;
    }

    getStatusData(jsonData) {
        // 电池堆数据
        this.batteryStackStateData.runState.value = runStateEnum[jsonData.data.B0] || jsonData.data.B0;
        this.batteryStackStateData.chargeState.value = chargeStateEnum[jsonData.data.B2] || jsonData.data.B2;
        this.batteryStackStateData.alarmLevel.value = alarmLevelEnum[jsonData.data.B4] || jsonData.data.B4;

        // 电池簇数据
        this.stateData.runState.value = runStateEnum[jsonData.data.B6] || jsonData.data.B6;
        this.stateData.chargeState.value = chargeStateEnum[jsonData.data.B8] || jsonData.data.B8;
        this.stateData.alarmLevel.value = alarmLevelEnum[jsonData.data.B10] || jsonData.data.B10;
        this.stateData.chargerState.value = circuitStateEnum[jsonData.data.B12] || jsonData.data.B12;
        this.stateData.mainNegativeState.value = circuitStateEnum[jsonData.data.B14] || jsonData.data.B14;
        this.stateData.mainPositiveState.value = circuitStateEnum[jsonData.data.B16] || jsonData.data.B16;
    }

}

// 运行状态
const runStateEnum = {
    '0': '初始化',
    '1': '开路静置',
    '2': '禁充放',
    '3': '正常状态',
    '4': '禁充',
    '5': '禁放'
}

// 充放电状态
const chargeStateEnum = {
    '0': '初始化',
    '1': '充电',
    '2': '放电',
    '3': '静置'
}

// 告警等级
const alarmLevelEnum = {
    '0': '无告警',
    '1': '一级告警',
    '2': '二级告警',
    '3': '三级告警',
}

// 断开或闭合
const circuitStateEnum = {
    '0': '断开',
    '1': '闭合'
}