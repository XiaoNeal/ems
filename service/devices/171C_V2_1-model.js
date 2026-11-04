import DeviceBase from "./device-base.model"

// (0x171C) BMS1级告警阈值(TCP) V2.1 —— 依据协议文档生成（与网页版 171Cv2_1-model.js 对齐）
export class Model171C_V2_1 extends DeviceBase {
    constructor() {
        super()
        this.deviceData = new DeviceData()
        this.energyData = new EnergyData()
        this.stateData = new StateData()
        this.controlData = new ControlData()
    }

    // 设备信息
    getBaseData(jsonData) {
        const data = jsonData.data || jsonData || {};
        this.deviceData.B0.value = data.B0;
        this.deviceData.B1.value = data.B1;
        this.deviceData.B12.value = data.B12;
        this.deviceData.B13.value = data.B13;
        this.deviceData.B14.value = data.B14;
        this.deviceData.B15.value = data.B15;
        this.deviceData.B16.value = data.B16;
        this.deviceData.B17.value = data.B17;
        this.deviceData.B18.value = data.B18;
        this.deviceData.B19.value = data.B19;
        this.deviceData.B20.value = data.B20;
        this.deviceData.B21b0.value = deviceEnums.B21b0[data.B21b0] || data.B21b0;
        this.deviceData.B22.value = data.B22;
        this.deviceData.B23.value = data.B23;
        this.deviceData.B24.value = data.B24;
        this.deviceData.B25.value = data.B25;
        this.deviceData.B26.value = data.B26;
        this.deviceData.B27.value = data.B27;
        this.deviceData.B28.value = data.B28;
        this.deviceData.B29.value = data.B29;
        this.deviceData.B30.value = data.B30;
        this.deviceData.B31.value = data.B31;
        this.deviceData.B32.value = data.B32;
        this.deviceData.B33.value = data.B33;
        this.deviceData.B34.value = data.B34;
        this.deviceData.B35.value = data.B35;
        this.deviceData.B36.value = data.B36;
        this.deviceData.B37.value = data.B37;
        this.deviceData.B38.value = data.B38;
        this.deviceData.B39.value = data.B39;
        this.deviceData.B40.value = data.B40;
        this.deviceData.B41.value = data.B41;
        this.deviceData.B42.value = data.B42;
    }

    // 控制数据
    getControlData(jsonData) {
        const data = jsonData.data || jsonData || {};
        this.controlData.B0.value = data.B0;
        this.controlData.B2.value = data.B2;
        this.controlData.B4.value = data.B4;
        this.controlData.B6.value = data.B6;
        this.controlData.B8.value = data.B8;
        this.controlData.B10.value = data.B10;
        this.controlData.B12.value = data.B12;
        this.controlData.B14.value = data.B14;
        this.controlData.B16.value = data.B16;
        this.controlData.B18.value = data.B18;
        this.controlData.B20.value = data.B20;
        this.controlData.B22.value = data.B22;
        this.controlData.B24.value = data.B24;
        this.controlData.B26.value = data.B26;
        this.controlData.B28.value = data.B28;
        this.controlData.B30.value = data.B30;
        this.controlData.B32.value = data.B32;
        this.controlData.B34.value = data.B34;
        this.controlData.B36.value = data.B36;
        this.controlData.B38.value = data.B38;
        this.controlData.B40.value = data.B40;
        this.controlData.B42.value = data.B42;
        this.controlData.B44.value = data.B44;
        this.controlData.B46.value = data.B46;
        this.controlData.B48.value = data.B48;
        this.controlData.B50.value = data.B50;
        this.controlData.B52.value = data.B52;
        this.controlData.B54.value = data.B54;
        this.controlData.B56.value = data.B56;
        this.controlData.B58.value = data.B58;
        this.controlData.B60.value = data.B60;
        this.controlData.B62.value = data.B62;
        this.controlData.B64.value = data.B64;
        this.controlData.B66.value = data.B66;
        this.controlData.B68.value = data.B68;
        this.controlData.B70.value = data.B70;
        this.controlData.B72.value = data.B72;
        this.controlData.B74.value = data.B74;
        this.controlData.B76.value = data.B76;
        this.controlData.B78.value = data.B78;
        this.controlData.B80.value = data.B80;
        this.controlData.B82.value = data.B82;
        this.controlData.B84.value = data.B84;
        this.controlData.B86.value = data.B86;
        this.controlData.B88.value = data.B88;
        this.controlData.B90.value = data.B90;
        this.controlData.B92.value = data.B92;
        this.controlData.B94.value = data.B94;
        this.controlData.B96.value = data.B96;
        this.controlData.B98.value = data.B98;
        this.controlData.B100.value = data.B100;
        this.controlData.B102.value = data.B102;
        this.controlData.B104.value = data.B104;
        this.controlData.B106.value = data.B106;
        this.controlData.B108.value = data.B108;
        this.controlData.B110.value = data.B110;
        this.controlData.B112.value = data.B112;
        this.controlData.B114.value = data.B114;
        this.controlData.B116.value = data.B116;
        this.controlData.B118.value = data.B118;
        this.controlData.B120.value = data.B120;
        this.controlData.B122.value = data.B122;
        this.controlData.B124.value = data.B124;
        this.controlData.B126.value = data.B126;
        this.controlData.B128.value = data.B128;
        this.controlData.B130.value = data.B130;
        this.controlData.B132.value = data.B132;
        this.controlData.B134.value = data.B134;
        this.controlData.B136.value = data.B136;
        this.controlData.B138.value = data.B138;
        this.controlData.B140.value = data.B140;
        this.controlData.B142.value = data.B142;
        this.controlData.B144.value = data.B144;
        this.controlData.B146.value = data.B146;
        this.controlData.B148.value = data.B148;
        this.controlData.B150.value = data.B150;
        this.controlData.B152.value = data.B152;
        this.controlData.B154.value = data.B154;
        this.controlData.B156.value = data.B156;
        this.controlData.B158.value = data.B158;
        this.controlData.B160.value = data.B160;
        this.controlData.B162.value = data.B162;
        this.controlData.B164.value = data.B164;
        this.controlData.B166.value = data.B166;
        this.controlData.B168.value = data.B168;
        this.controlData.B170.value = data.B170;
        this.controlData.B172.value = data.B172;
        this.controlData.B174.value = data.B174;
    }

}

class DeviceData {
    B0 = { name: '设备大类', value: '--' }
    B1 = { name: '设备小类', value: '--' }
    B12 = { name: '协议版本V2.0 （高五位大版本， 第三位小版本）', value: '--' }
    B13 = { name: '设备地址', value: '--' }
    B14 = { name: '南北', value: '--' }
    B15 = { name: '纬度（整数部分）', value: '--' }
    B16 = { name: '纬度（小数部分）', value: '--' }
    B17 = { name: '东西', value: '--' }
    B18 = { name: '经度（整数部分）', value: '--' }
    B19 = { name: '经度（小数部分）', value: '--' }
    B20 = { name: '软件版本 （高四位大版本， 第四位小版本）', value: '--' }
    B21b0 = { name: '通信状态', value: '--' }
    B22 = { name: 'MAC地址（40~47）', value: '--' }
    B23 = { name: 'MAC地址（32~39）', value: '--' }
    B24 = { name: 'MAC地址（24~31）', value: '--' }
    B25 = { name: 'MAC地址（16~23）', value: '--' }
    B26 = { name: 'MAC地址（8~15）', value: '--' }
    B27 = { name: 'MAC地址（0~7）', value: '--' }
    B28 = { name: '条形码（第13位）', value: '--' }
    B29 = { name: '条形码（第12位）', value: '--' }
    B30 = { name: '条形码（第11位）', value: '--' }
    B31 = { name: '条形码（第10位）', value: '--' }
    B32 = { name: '条形码（第9位）', value: '--' }
    B33 = { name: '条形码（第8位）', value: '--' }
    B34 = { name: '条形码（第7位）', value: '--' }
    B35 = { name: '条形码（第6位）', value: '--' }
    B36 = { name: '条形码（第5位）', value: '--' }
    B37 = { name: '条形码（第4位）', value: '--' }
    B38 = { name: '条形码（第3位）', value: '--' }
    B39 = { name: '条形码（第2位）', value: '--' }
    B40 = { name: '条形码（第1位）', value: '--' }
    B41 = { name: '设备名称有效字节个数', value: '--' }
    B42 = { name: '设备名称', value: '--' }
}

class EnergyData {
}

class StateData {
}

class ControlData {
    B0 = { name: '单体过压级1级告警阈值(mV)', value: '--' }
    B2 = { name: '单体过压级1级告警触发时间(S)', value: '--' }
    B4 = { name: '单体过压级1级释放阈值(mV)', value: '--' }
    B6 = { name: '单体过压级1级告警释放时间(S)', value: '--' }
    B8 = { name: '单体欠压级1级告警阈值(mV)', value: '--' }
    B10 = { name: '单体欠压级1级告警触发时间(S)', value: '--' }
    B12 = { name: '单体欠压级1级释放阈值(mV)', value: '--' }
    B14 = { name: '单体欠压级1级告警释放时间(S)', value: '--' }
    B16 = { name: '单体压差1级告警阈值(mV)', value: '--' }
    B18 = { name: '单体压差1级告警触发时间(S)', value: '--' }
    B20 = { name: '单体压差1级释放阈值(mV)', value: '--' }
    B22 = { name: '单体压差1级告警释放时间(S)', value: '--' }
    B24 = { name: '总压过压级1级告警阈值(V)', value: '--' }
    B26 = { name: '总压过压级1级告警触发时间(S)', value: '--' }
    B28 = { name: '总压过压级1级释放阈值(V)', value: '--' }
    B30 = { name: '总压过压级1级告警释放时间(S)', value: '--' }
    B32 = { name: '总压欠压级1级告警阈值(V)', value: '--' }
    B34 = { name: '总压欠压级1级告警触发时间(S)', value: '--' }
    B36 = { name: '总压欠压级1级释放阈值(V)', value: '--' }
    B38 = { name: '总压欠压级1级告警释放时间(S)', value: '--' }
    B40 = { name: '总压压差1级告警阈值(V)', value: '--' }
    B42 = { name: '总压压差1级告警触发时间(S)', value: '--' }
    B44 = { name: '总压压差1级释放阈值(V)', value: '--' }
    B46 = { name: '总压压差1级告警释放时间(S)', value: '--' }
    B48 = { name: '放电过流1级告警阈值(A)', value: '--' }
    B50 = { name: '放电过流1级告警触发时间(S)', value: '--' }
    B52 = { name: '放电过流1级释放阈值(A)', value: '--' }
    B54 = { name: '放电过流1级告警释放时间(S)', value: '--' }
    B56 = { name: '充电过流1级告警阈值(A)', value: '--' }
    B58 = { name: '充电过流1级告警触发时间(S)', value: '--' }
    B60 = { name: '充电过流1级释放阈值(A)', value: '--' }
    B62 = { name: '充电过流1级告警释放时间(S)', value: '--' }
    B64 = { name: '放电高温1级告警阈值(℃)', value: '--' }
    B66 = { name: '放电高温1级告警触发时间(S)', value: '--' }
    B68 = { name: '放电高温1级释放阈值(℃)', value: '--' }
    B70 = { name: '放电高温1级告警释放时间(S)', value: '--' }
    B72 = { name: '充电高温1级告警阈值(℃)', value: '--' }
    B74 = { name: '充电高温1级告警触发时间(S)', value: '--' }
    B76 = { name: '充电高温1级释放阈值(℃)', value: '--' }
    B78 = { name: '充电高温1级告警释放时间(S)', value: '--' }
    B80 = { name: '放电低温1级告警阈值(℃)', value: '--' }
    B82 = { name: '放电低温1级告警触发时间(S)', value: '--' }
    B84 = { name: '放电低温1级释放阈值(℃)', value: '--' }
    B86 = { name: '放电低温1级告警释放时间(S)', value: '--' }
    B88 = { name: '充电低温1级告警阈值(℃)', value: '--' }
    B90 = { name: '充电低温1级告警触发时间(S)', value: '--' }
    B92 = { name: '充电低温1级释放阈值(℃)', value: '--' }
    B94 = { name: '充电低温1级告警释放时间(S)', value: '--' }
    B96 = { name: '温差1级告警阈值(℃)', value: '--' }
    B98 = { name: '温差1级告警触发时间(S)', value: '--' }
    B100 = { name: '温差1级释放阈值(℃)', value: '--' }
    B102 = { name: '温差1级告警释放时间(S)', value: '--' }
    B104 = { name: '绝缘阻值低1级告警阈值(ohm/V)', value: '--' }
    B106 = { name: '绝缘阻值低1级告警触发时间(S)', value: '--' }
    B108 = { name: '绝缘阻值低1级释放阈值(ohm/V)', value: '--' }
    B110 = { name: '绝缘阻值低1级告警释放时间(S)', value: '--' }
    B112 = { name: 'T1高温1级告警阈值(℃)', value: '--' }
    B114 = { name: 'T1高温1级告警触发时间(S)', value: '--' }
    B116 = { name: 'T1高温1级释放阈值(℃)', value: '--' }
    B118 = { name: 'T1高温1级告警释放时间(S)', value: '--' }
    B120 = { name: 'T2高温1级告警阈值(℃)', value: '--' }
    B122 = { name: 'T2高温1级告警触发时间(S)', value: '--' }
    B124 = { name: 'T2高温1级释放阈值(℃)', value: '--' }
    B126 = { name: 'T2高温1级告警释放时间(S)', value: '--' }
    B128 = { name: 'T3高温1级告警阈值(℃)', value: '--' }
    B130 = { name: 'T3高温1级告警触发时间(S)', value: '--' }
    B132 = { name: 'T3高温1级释放阈值(℃)', value: '--' }
    B134 = { name: 'T3高温1级告警释放时间(S)', value: '--' }
    B136 = { name: 'T4高温1级告警阈值(℃)', value: '--' }
    B138 = { name: 'T4高温1级告警触发时间(S)', value: '--' }
    B140 = { name: 'T4高温1级释放阈值(℃)', value: '--' }
    B142 = { name: 'T4高温1级告警释放时间(S)', value: '--' }
    B144 = { name: 'T5高温1级告警阈值(℃)', value: '--' }
    B146 = { name: 'T5高温1级告警触发时间(S)', value: '--' }
    B148 = { name: 'T5高温1级释放阈值(℃)', value: '--' }
    B150 = { name: 'T5高温1级告警释放时间(S)', value: '--' }
    B152 = { name: 'T6高温1级告警阈值(℃)', value: '--' }
    B154 = { name: 'T6高温1级告警触发时间(S)', value: '--' }
    B156 = { name: 'T6高温1级释放阈值(℃)', value: '--' }
    B158 = { name: 'T6高温1级告警释放时间(S)', value: '--' }
    B160 = { name: '极柱高温1级告警阈值(℃)', value: '--' }
    B162 = { name: '极柱高温1级告警触发时间(S)', value: '--' }
    B164 = { name: '极柱高温1级释放阈值(℃)', value: '--' }
    B166 = { name: '极柱高温1级告警释放时间(S)', value: '--' }
    B168 = { name: 'soc低1级告警阈值(%)', value: '--' }
    B170 = { name: 'soc低1级告警触发时间(S)', value: '--' }
    B172 = { name: 'soc低1级释放阈值(%)', value: '--' }
    B174 = { name: 'soc低1级告警释放时间(S)', value: '--' }
}

// 设备信息 枚举值
const deviceEnums = {
    B21b0: { 0: '通信正常', 1: '通信故障' },
}
