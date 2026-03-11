import DeviceBase from "./device-base.model"

export class Model1704v1_1 extends DeviceBase{
    constructor(number) {
        super();
        const str = number ? '簇' + number : ''
        this.energyData = {
            voltage: { name: str + '电压(V)', value: '--' },
            current: { name: str + '电流(A)', value: '--' },
            soc: { name: str + 'SOC', value: '--' },
            soh: { name: str + 'SOH', value: '--' },
            soe: { name: str + 'SOE', value: '--' },
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
    }

    getEnergyData(jsonData) {
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
    }

    getStatusData(jsonData) {
        this.stateData.runState.value = jsonData.B6;
        this.stateData.chargeState.value = jsonData.B8;
        this.stateData.alarmLevel.value = jsonData.B10;
        this.stateData.chargerState.value = jsonData.B12;
        this.stateData.mainNegativeState.value = jsonData.B14;
        this.stateData.mainPositiveState.value = jsonData.B16;
    }

}