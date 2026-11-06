import DeviceBase from "./device-base.model"

// (0x171C) BMS 设备协议(TCP) V2.0 —— 依据协议文档生成（与网页版 171Cv2-model.js 对齐）
export class Model171C_V2 extends DeviceBase {
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

    // 能源数据
    getEnergyData(jsonData) {
        const data = jsonData || {};
        this.energyData.B0b0.value = energyEnums.B0b0[data.B0b0] || data.B0b0;
        this.energyData.B1b0.value = energyEnums.B1b0[data.B1b0] || data.B1b0;
        this.energyData.B1b2.value = energyEnums.B1b2[data.B1b2] || data.B1b2;
        this.energyData.B1b4.value = energyEnums.B1b4[data.B1b4] || data.B1b4;
        this.energyData.B2.value = data.B2;
        this.energyData.B4.value = data.B4;
        this.energyData.B6.value = data.B6;
        this.energyData.B8.value = data.B8;
        this.energyData.B10.value = data.B10;
        this.energyData.B12.value = data.B12;
        this.energyData.B14.value = data.B14;
        this.energyData.B16.value = data.B16;
        this.energyData.B18.value = data.B18;
        this.energyData.B20.value = data.B20;
        this.energyData.B22.value = data.B22;
        this.energyData.B24.value = data.B24;
        this.energyData.B25.value = data.B25;
        this.energyData.B26.value = data.B26;
        this.energyData.B27.value = data.B27;
        this.energyData.B28.value = data.B28;
        this.energyData.B30.value = data.B30;
        this.energyData.B32.value = data.B32;
        this.energyData.B34.value = data.B34;
        this.energyData.B36.value = data.B36;
        this.energyData.B38.value = data.B38;
        this.energyData.B40.value = data.B40;
        this.energyData.B42.value = data.B42;
        this.energyData.B44.value = data.B44;
        this.energyData.B47b0.value = energyEnums.B47b0[data.B47b0] || data.B47b0;
        this.energyData.B47b2.value = energyEnums.B47b2[data.B47b2] || data.B47b2;
        this.energyData.B47b3.value = energyEnums.B47b3[data.B47b3] || data.B47b3;
        this.energyData.B47b4.value = energyEnums.B47b4[data.B47b4] || data.B47b4;
        this.energyData.B47b5.value = energyEnums.B47b5[data.B47b5] || data.B47b5;
        this.energyData.B47b6.value = energyEnums.B47b6[data.B47b6] || data.B47b6;
        this.energyData.B47b7.value = energyEnums.B47b7[data.B47b7] || data.B47b7;
        this.energyData.B48.value = data.B48;
        this.energyData.B50.value = energyEnums.B50[data.B50] || data.B50;
        this.energyData.B53b0.value = energyEnums.B53b0[data.B53b0] || data.B53b0;
        this.energyData.B53b1.value = energyEnums.B53b1[data.B53b1] || data.B53b1;
        this.energyData.B53b2.value = energyEnums.B53b2[data.B53b2] || data.B53b2;
        this.energyData.B53b3.value = energyEnums.B53b3[data.B53b3] || data.B53b3;
        this.energyData.B55b0.value = energyEnums.B55b0[data.B55b0] || data.B55b0;
        this.energyData.B55b2.value = energyEnums.B55b2[data.B55b2] || data.B55b2;
        this.energyData.B55b4.value = energyEnums.B55b4[data.B55b4] || data.B55b4;
        this.energyData.B55b6.value = energyEnums.B55b6[data.B55b6] || data.B55b6;
        this.energyData.B56.value = data.B56;
        this.energyData.B58.value = data.B58;
        this.energyData.B60.value = data.B60;
        this.energyData.B62.value = data.B62;
        this.energyData.B66.value = energyEnums.B66[data.B66] || data.B66;
        this.energyData.B68.value = data.B68;
        this.energyData.B70.value = data.B70;
        this.energyData.B72.value = data.B72;
        this.energyData.B74.value = data.B74;
        this.energyData.B78.value = data.B78;
        this.energyData.B80.value = data.B80;
        this.energyData.B82.value = data.B82;
        this.energyData.B84.value = data.B84;
        this.energyData.B86.value = data.B86;
        this.energyData.B88.value = data.B88;
        this.energyData.B90.value = data.B90;
        this.energyData.B92.value = data.B92;
        this.energyData.B94.value = data.B94;
        this.energyData.B96.value = data.B96;
        this.energyData.B98.value = data.B98;
        this.energyData.B100.value = data.B100;
        this.energyData.B102.value = data.B102;
        this.energyData.B104.value = data.B104;
        this.energyData.B106.value = data.B106;
        this.energyData.B108.value = data.B108;
        this.energyData.B112.value = data.B112;
        this.energyData.B114.value = data.B114;
        this.energyData.B116.value = data.B116;
        this.energyData.B118.value = data.B118;
        this.energyData.B120.value = data.B120;
        this.energyData.B124.value = data.B124;
        this.energyData.B128.value = data.B128;
        this.energyData.B130.value = data.B130;
        this.energyData.B134.value = data.B134;
        this.energyData.B138.value = data.B138;
        this.energyData.B142.value = data.B142;
        this.energyData.B144.value = data.B144;
        this.energyData.B148.value = data.B148;
        this.energyData.B149.value = data.B149;
        this.energyData.B150.value = data.B150;
        this.energyData.B152.value = data.B152;
        this.energyData.B156.value = data.B156;
        this.energyData.B158.value = data.B158;
        this.energyData.B159.value = data.B159;
        this.energyData.B160.value = data.B160;
        this.energyData.B161.value = data.B161;
        this.energyData.B162.value = data.B162;
        this.energyData.B163.value = data.B163;
        this.energyData.B164.value = data.B164;
        this.energyData.B165.value = data.B165;
        this.energyData.B170.value = data.B170;
        this.energyData.B172.value = data.B172;
        this.energyData.B176.value = data.B176;
        this.energyData.B178.value = data.B178;
        this.energyData.B179.value = data.B179;
        this.energyData.B180.value = data.B180;
        this.energyData.B182.value = data.B182;
        this.energyData.B184.value = data.B184;
        this.energyData.B186.value = data.B186;
        this.energyData.B188.value = data.B188;
        this.energyData.B190.value = data.B190;
        this.energyData.B192.value = data.B192;
        this.energyData.B194.value = data.B194;
        this.energyData.B195.value = data.B195;
        this.energyData.B196.value = data.B196;
        this.energyData.B198.value = data.B198;
        this.energyData.B200.value = data.B200;
        this.energyData.B202.value = data.B202;
        this.energyData.B204.value = data.B204;
        this.energyData.B206.value = data.B206;
        this.energyData.B208.value = data.B208;
        this.energyData.B210.value = data.B210;
        this.energyData.B211.value = data.B211;
        this.energyData.B212.value = data.B212;
        this.energyData.B214.value = data.B214;
        this.energyData.B216.value = data.B216;
        this.energyData.B218.value = data.B218;
        this.energyData.B220.value = data.B220;
        this.energyData.B222.value = data.B222;
    }

    // 状态数据
    getStatusData(jsonData) {
        const data = jsonData.data || jsonData || {};
        this.stateData.B0b0.value = statusEnums.B0b0[data.B0b0] || data.B0b0;
        this.stateData.B0b1.value = statusEnums.B0b1[data.B0b1] || data.B0b1;
        this.stateData.B0b2.value = statusEnums.B0b2[data.B0b2] || data.B0b2;
        this.stateData.B0b3.value = statusEnums.B0b3[data.B0b3] || data.B0b3;
        this.stateData.B0b4.value = statusEnums.B0b4[data.B0b4] || data.B0b4;
        this.stateData.B0b5.value = statusEnums.B0b5[data.B0b5] || data.B0b5;
        // this.stateData.B0b6.value = statusEnums.B0b6[data.B0b6] || data.B0b6;
        this.stateData.B0b7.value = statusEnums.B0b7[data.B0b7] || data.B0b7;
        // this.stateData.B1b0.value = statusEnums.B1b0[data.B1b0] || data.B1b0;
        // this.stateData.B1b1.value = statusEnums.B1b1[data.B1b1] || data.B1b1;
        // this.stateData.B1b2.value = statusEnums.B1b2[data.B1b2] || data.B1b2;
        // this.stateData.B1b3.value = statusEnums.B1b3[data.B1b3] || data.B1b3;
        this.stateData.B1b4.value = statusEnums.B1b4[data.B1b4] || data.B1b4;
        // this.stateData.B1b5.value = statusEnums.B1b5[data.B1b5] || data.B1b5;
        // this.stateData.B1b6.value = statusEnums.B1b6[data.B1b6] || data.B1b6;
        // this.stateData.B1b7.value = statusEnums.B1b7[data.B1b7] || data.B1b7;
        this.stateData.B2b0.value = statusEnums.B2b0[data.B2b0] || data.B2b0;
        this.stateData.B2b1.value = statusEnums.B2b1[data.B2b1] || data.B2b1;
        // this.stateData.B2b2.value = statusEnums.B2b2[data.B2b2] || data.B2b2;
        // this.stateData.B2b3.value = statusEnums.B2b3[data.B2b3] || data.B2b3;
        // this.stateData.B2b4.value = statusEnums.B2b4[data.B2b4] || data.B2b4;
        // this.stateData.B2b5.value = statusEnums.B2b5[data.B2b5] || data.B2b5;
        // this.stateData.B2b6.value = statusEnums.B2b6[data.B2b6] || data.B2b6;
        // this.stateData.B2b7.value = statusEnums.B2b7[data.B2b7] || data.B2b7;
        // this.stateData.B3b0.value = statusEnums.B3b0[data.B3b0] || data.B3b0;
        // this.stateData.B3b1.value = statusEnums.B3b1[data.B3b1] || data.B3b1;
        // this.stateData.B3b2.value = statusEnums.B3b2[data.B3b2] || data.B3b2;
        // this.stateData.B3b3.value = statusEnums.B3b3[data.B3b3] || data.B3b3;
        // this.stateData.B3b4.value = statusEnums.B3b4[data.B3b4] || data.B3b4;
        this.stateData.B3b5.value = statusEnums.B3b5[data.B3b5] || data.B3b5;
        this.stateData.B3b6.value = statusEnums.B3b6[data.B3b6] || data.B3b6;
        this.stateData.B3b7.value = statusEnums.B3b7[data.B3b7] || data.B3b7;
        // this.stateData.B4b0.value = statusEnums.B4b0[data.B4b0] || data.B4b0;
        // this.stateData.B4b1.value = statusEnums.B4b1[data.B4b1] || data.B4b1;
        // this.stateData.B4b2.value = statusEnums.B4b2[data.B4b2] || data.B4b2;
        // this.stateData.B4b3.value = statusEnums.B4b3[data.B4b3] || data.B4b3;
        // this.stateData.B4b4.value = statusEnums.B4b4[data.B4b4] || data.B4b4;
        // this.stateData.B6b0.value = statusEnums.B6b0[data.B6b0] || data.B6b0;
        // this.stateData.B6b1.value = statusEnums.B6b1[data.B6b1] || data.B6b1;
        // this.stateData.B6b2.value = statusEnums.B6b2[data.B6b2] || data.B6b2;
        // this.stateData.B6b3.value = statusEnums.B6b3[data.B6b3] || data.B6b3;
        // this.stateData.B6b4.value = statusEnums.B6b4[data.B6b4] || data.B6b4;
        // this.stateData.B6b5.value = statusEnums.B6b5[data.B6b5] || data.B6b5;
        // this.stateData.B6b6.value = statusEnums.B6b6[data.B6b6] || data.B6b6;
        // this.stateData.B6b7.value = statusEnums.B6b7[data.B6b7] || data.B6b7;
        // this.stateData.B7b0.value = statusEnums.B7b0[data.B7b0] || data.B7b0;
        // this.stateData.B7b1.value = statusEnums.B7b1[data.B7b1] || data.B7b1;
        // this.stateData.B7b2.value = statusEnums.B7b2[data.B7b2] || data.B7b2;
        // this.stateData.B7b3.value = statusEnums.B7b3[data.B7b3] || data.B7b3;
        // this.stateData.B7b4.value = statusEnums.B7b4[data.B7b4] || data.B7b4;
        // this.stateData.B7b5.value = statusEnums.B7b5[data.B7b5] || data.B7b5;
        // this.stateData.B7b6.value = statusEnums.B7b6[data.B7b6] || data.B7b6;
        // this.stateData.B7b7.value = statusEnums.B7b7[data.B7b7] || data.B7b7;
        // this.stateData.B8b0.value = statusEnums.B8b0[data.B8b0] || data.B8b0;
        // this.stateData.B8b1.value = statusEnums.B8b1[data.B8b1] || data.B8b1;
        // this.stateData.B8b2.value = statusEnums.B8b2[data.B8b2] || data.B8b2;
        // this.stateData.B8b3.value = statusEnums.B8b3[data.B8b3] || data.B8b3;
        // this.stateData.B8b4.value = statusEnums.B8b4[data.B8b4] || data.B8b4;
        // this.stateData.B8b5.value = statusEnums.B8b5[data.B8b5] || data.B8b5;
        // this.stateData.B8b6.value = statusEnums.B8b6[data.B8b6] || data.B8b6;
        // this.stateData.B8b7.value = statusEnums.B8b7[data.B8b7] || data.B8b7;
        // this.stateData.B9b0.value = statusEnums.B9b0[data.B9b0] || data.B9b0;
        // this.stateData.B9b1.value = statusEnums.B9b1[data.B9b1] || data.B9b1;
        // this.stateData.B9b2.value = statusEnums.B9b2[data.B9b2] || data.B9b2;
        // this.stateData.B9b3.value = statusEnums.B9b3[data.B9b3] || data.B9b3;
        // this.stateData.B9b4.value = statusEnums.B9b4[data.B9b4] || data.B9b4;
        // this.stateData.B9b5.value = statusEnums.B9b5[data.B9b5] || data.B9b5;
        // this.stateData.B9b6.value = statusEnums.B9b6[data.B9b6] || data.B9b6;
        // this.stateData.B9b7.value = statusEnums.B9b7[data.B9b7] || data.B9b7;
        // this.stateData.B10b0.value = statusEnums.B10b0[data.B10b0] || data.B10b0;
        // this.stateData.B10b1.value = statusEnums.B10b1[data.B10b1] || data.B10b1;
        // this.stateData.B10b2.value = statusEnums.B10b2[data.B10b2] || data.B10b2;
        // this.stateData.B10b3.value = statusEnums.B10b3[data.B10b3] || data.B10b3;
        // this.stateData.B10b4.value = statusEnums.B10b4[data.B10b4] || data.B10b4;
        // this.stateData.B10b5.value = statusEnums.B10b5[data.B10b5] || data.B10b5;
        // this.stateData.B10b6.value = statusEnums.B10b6[data.B10b6] || data.B10b6;
        // this.stateData.B10b7.value = statusEnums.B10b7[data.B10b7] || data.B10b7;
        // this.stateData.B11b0.value = statusEnums.B11b0[data.B11b0] || data.B11b0;
        // this.stateData.B11b1.value = statusEnums.B11b1[data.B11b1] || data.B11b1;
        // this.stateData.B11b2.value = statusEnums.B11b2[data.B11b2] || data.B11b2;
        // this.stateData.B11b3.value = statusEnums.B11b3[data.B11b3] || data.B11b3;
        // this.stateData.B11b4.value = statusEnums.B11b4[data.B11b4] || data.B11b4;
        // this.stateData.B11b5.value = statusEnums.B11b5[data.B11b5] || data.B11b5;
        // this.stateData.B11b6.value = statusEnums.B11b6[data.B11b6] || data.B11b6;
        // this.stateData.B11b7.value = statusEnums.B11b7[data.B11b7] || data.B11b7;
        // this.stateData.B12b0.value = statusEnums.B12b0[data.B12b0] || data.B12b0;
        // this.stateData.B12b1.value = statusEnums.B12b1[data.B12b1] || data.B12b1;
        // this.stateData.B12b2.value = statusEnums.B12b2[data.B12b2] || data.B12b2;
        // this.stateData.B12b3.value = statusEnums.B12b3[data.B12b3] || data.B12b3;
        // this.stateData.B12b4.value = statusEnums.B12b4[data.B12b4] || data.B12b4;
        // this.stateData.B12b5.value = statusEnums.B12b5[data.B12b5] || data.B12b5;
        // this.stateData.B12b6.value = statusEnums.B12b6[data.B12b6] || data.B12b6;
        // this.stateData.B12b7.value = statusEnums.B12b7[data.B12b7] || data.B12b7;
        // this.stateData.B13b0.value = statusEnums.B13b0[data.B13b0] || data.B13b0;
        // this.stateData.B13b1.value = statusEnums.B13b1[data.B13b1] || data.B13b1;
        // this.stateData.B13b2.value = statusEnums.B13b2[data.B13b2] || data.B13b2;
        // this.stateData.B13b3.value = statusEnums.B13b3[data.B13b3] || data.B13b3;
        // this.stateData.B13b4.value = statusEnums.B13b4[data.B13b4] || data.B13b4;
        // this.stateData.B13b5.value = statusEnums.B13b5[data.B13b5] || data.B13b5;
        // this.stateData.B13b6.value = statusEnums.B13b6[data.B13b6] || data.B13b6;
        // this.stateData.B13b7.value = statusEnums.B13b7[data.B13b7] || data.B13b7;
        // this.stateData.B16.value = statusEnums.B16[data.B16] || data.B16;
        // this.stateData.B18.value = statusEnums.B18[data.B18] || data.B18;
        // this.stateData.B20.value = statusEnums.B20[data.B20] || data.B20;
        // this.stateData.B22.value = statusEnums.B22[data.B22] || data.B22;
        // this.stateData.B24.value = statusEnums.B24[data.B24] || data.B24;
        // this.stateData.B26.value = statusEnums.B26[data.B26] || data.B26;
        // this.stateData.B28.value = statusEnums.B28[data.B28] || data.B28;
        // this.stateData.B30.value = statusEnums.B30[data.B30] || data.B30;
        // this.stateData.B32.value = statusEnums.B32[data.B32] || data.B32;
        // this.stateData.B34.value = data.B34;
        // this.stateData.B36.value = data.B36;
        // this.stateData.B38.value = data.B38;
        // this.stateData.B40.value = data.B40;
        // this.stateData.B42.value = data.B42;
        // this.stateData.B44.value = data.B44;
        // this.stateData.B48.value = data.B48;
        // this.stateData.B50.value = data.B50;
        // this.stateData.B52.value = data.B52;
        // this.stateData.B54.value = data.B54;
        // this.stateData.B56.value = data.B56;
        // this.stateData.B58.value = data.B58;
        // this.stateData.B60.value = data.B60;
        // this.stateData.B62.value = data.B62;
        // this.stateData.B64.value = data.B64;
        // this.stateData.B66.value = data.B66;
        this.stateData.B70.value = data.B70;
        this.stateData.B72.value = data.B72;
        this.stateData.B74.value = data.B74;
        this.stateData.B76.value = data.B76;
        this.stateData.B78.value = data.B78;
        this.stateData.B80.value = data.B80;
        // this.stateData.B85.value = data.B85;
        // this.stateData.B87.value = data.B87;
        // this.stateData.B89.value = data.B89;
        // this.stateData.B91.value = data.B91;
        // this.stateData.B93.value = data.B93;
        // this.stateData.B95.value = data.B95;
        // this.stateData.B97.value = data.B97;
        // this.stateData.B99.value = data.B99;
        // this.stateData.B102.value = data.B102;
        // this.stateData.B104.value = data.B104;
        // this.stateData.B106.value = data.B106;
        // this.stateData.B108.value = data.B108;
        // this.stateData.B111b0.value = statusEnums.B111b0[data.B111b0] || data.B111b0;
        // this.stateData.B111b4.value = statusEnums.B111b4[data.B111b4] || data.B111b4;
        // this.stateData.B112.value = data.B112;
        // this.stateData.B114.value = data.B114;
        // this.stateData.B116.value = data.B116;
        // this.stateData.B118.value = statusEnums.B118[data.B118] || data.B118;
        // this.stateData.B120.value = data.B120;
        // this.stateData.B122.value = data.B122;
        // this.stateData.B124.value = data.B124;
        // this.stateData.B126.value = data.B126;
        // this.stateData.B128.value = data.B128;
        // this.stateData.B130.value = data.B130;
        // this.stateData.B131.value = data.B131;
        // this.stateData.B131b1.value = data.B131b1;
        // this.stateData.B131b2.value = data.B131b2;
        // this.stateData.B131b3.value = data.B131b3;
        // this.stateData.B131b4.value = data.B131b4;
        // this.stateData.B131b5.value = data.B131b5;
        // this.stateData.B131b6.value = data.B131b6;
        // this.stateData.B131b7.value = data.B131b7;
        // this.stateData.B132.value = data.B132;
        // this.stateData.B134.value = data.B134;
        // this.stateData.B136.value = data.B136;
        // this.stateData.B138.value = data.B138;
        // this.stateData.B140.value = data.B140;
        // this.stateData.B142.value = data.B142;
        // this.stateData.B144.value = data.B144;
        // this.stateData.B146.value = data.B146;
        // this.stateData.B148.value = data.B148;
        // this.stateData.B150.value = data.B150;
        // this.stateData.B152.value = data.B152;
        // this.stateData.B154.value = data.B154;
        // this.stateData.B156.value = data.B156;
        // this.stateData.B158.value = data.B158;
        // this.stateData.B160.value = data.B160;
        // this.stateData.B162.value = data.B162;
        // this.stateData.B166.value = data.B166;
        // this.stateData.B168.value = data.B168;
        // this.stateData.B170.value = data.B170;
        // this.stateData.B172.value = data.B172;
        // this.stateData.B174.value = data.B174;
        // this.stateData.B176.value = data.B176;
        // this.stateData.B178.value = data.B178;
        // this.stateData.B180.value = data.B180;
        // this.stateData.B182.value = data.B182;
        // this.stateData.B184.value = data.B184;
        // this.stateData.B186.value = data.B186;
        // this.stateData.B188.value = data.B188;
        // this.stateData.B190.value = data.B190;
        // this.stateData.B192.value = data.B192;
        // this.stateData.B194.value = data.B194;
        // this.stateData.B196.value = data.B196;
        // this.stateData.B198.value = data.B198;
        // this.stateData.B200.value = data.B200;
        // this.stateData.B202.value = data.B202;
        // this.stateData.B204.value = data.B204;
        // this.stateData.B206.value = data.B206;
        // this.stateData.B208.value = data.B208;
        // this.stateData.B210.value = data.B210;
        // this.stateData.B212.value = data.B212;
        // this.stateData.B216.value = data.B216;
        // this.stateData.B218.value = data.B218;
        // this.stateData.B220.value = data.B220;
        // this.stateData.B222.value = data.B222;
        // this.stateData.B224.value = data.B224;
        // this.stateData.B226.value = data.B226;
        // this.stateData.B228.value = data.B228;
        // this.stateData.B231.value = data.B231;
        // this.stateData.B231b1.value = data.B231b1;
        // this.stateData.B231b2.value = data.B231b2;
        // this.stateData.B231b3.value = data.B231b3;
        // this.stateData.B231b4.value = data.B231b4;
    }

    // 控制数据
    getControlData(jsonData) {
        const data = jsonData.data || jsonData || {};
        this.controlData.B0.value = data.B0;
        this.controlData.B3b0.value = controlEnums.B3b0[data.B3b0] || data.B3b0;
        this.controlData.B3b1.value = controlEnums.B3b1[data.B3b1] || data.B3b1;
        this.controlData.B3b2.value = controlEnums.B3b2[data.B3b2] || data.B3b2;
        this.controlData.B3b3.value = controlEnums.B3b3[data.B3b3] || data.B3b3;
        this.controlData.B3b4.value = controlEnums.B3b4[data.B3b4] || data.B3b4;
        this.controlData.B5b0.value = controlEnums.B5b0[data.B5b0] || data.B5b0;
        this.controlData.B5b1.value = controlEnums.B5b1[data.B5b1] || data.B5b1;
        this.controlData.B5b2.value = controlEnums.B5b2[data.B5b2] || data.B5b2;
        this.controlData.B5b3.value = data.B5b3;
        this.controlData.B6.value = data.B6;
        this.controlData.B6b1.value = data.B6b1;
        this.controlData.B6b2.value = data.B6b2;
        this.controlData.B6b3.value = data.B6b3;
        this.controlData.B6b4.value = data.B6b4;
        this.controlData.B6b5.value = data.B6b5;
        this.controlData.B7.value = data.B7;
        this.controlData.B7b1.value = data.B7b1;
        this.controlData.B7b2.value = data.B7b2;
        this.controlData.B7b3.value = data.B7b3;
        this.controlData.B7b4.value = data.B7b4;
        this.controlData.B7b5.value = data.B7b5;
        this.controlData.B7b6.value = data.B7b6;
        this.controlData.B7b7.value = data.B7b7;
        this.controlData.B8.value = controlEnums.B8[data.B8] || data.B8;
        this.controlData.B12.value = data.B12;
        this.controlData.B14.value = data.B14;
        this.controlData.B16.value = data.B16;
        this.controlData.B18.value = data.B18;
        this.controlData.B20.value = data.B20;
        this.controlData.B22.value = data.B22;
        this.controlData.B24.value = data.B24;
        this.controlData.B26.value = data.B26;
        this.controlData.B30.value = data.B30;
        this.controlData.B32.value = data.B32;
        this.controlData.B34.value = data.B34;
        this.controlData.B36.value = data.B36;
        this.controlData.B38.value = data.B38;
        this.controlData.B40.value = data.B40;
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
    B0b0 = { name: 'BMS接触器状态', value: '--' }
    B1b0 = { name: '故障告警等级', value: '--' }
    B1b2 = { name: '电池充放电状态', value: '--' }
    B1b4 = { name: 'BMS运行状态', value: '--' }
    B2 = { name: '充电最大电压(V)', value: '--' }
    B4 = { name: '最大放电电流(A)', value: '--' }
    B6 = { name: '放电最小电压(V)', value: '--' }
    B8 = { name: '最大充电电流(A)', value: '--' }
    B10 = { name: '电池电压(V)', value: '--' }
    B12 = { name: '电池电流(A)', value: '--' }
    B14 = { name: '电池平均电压(mV)', value: '--' }
    B16 = { name: '最大电池电压(mV)', value: '--' }
    B18 = { name: '最小电池电压(mV)', value: '--' }
    B20 = { name: '最大电压电池位置', value: '--' }
    B22 = { name: '最小电压电池位置', value: '--' }
    B24 = { name: '最高单体温度(℃)', value: '--' }
    B25 = { name: '最低单体温度(℃)', value: '--' }
    B26 = { name: '最大温差(℃)', value: '--' }
    B27 = { name: '电池平均温度(℃)', value: '--' }
    B28 = { name: '最大温度电池位置', value: '--' }
    B30 = { name: '最小温度电池位置', value: '--' }
    B32 = { name: 'SOC(%)', value: '--' }
    B34 = { name: '实际电池剩余容量(%)', value: '--' }
    B36 = { name: '正绝缘电阻(kΩ)', value: '--' }
    B38 = { name: '负绝缘电阻(kΩ)', value: '--' }
    B40 = { name: 'HV1电压(V)', value: '--' }
    B42 = { name: 'HV2电压(V)', value: '--' }
    B44 = { name: 'BAT+电压(V)', value: '--' }
    B47b0 = { name: '预充状态', value: '--' }
    B47b2 = { name: '均衡状态', value: '--' }
    B47b3 = { name: '加热状态', value: '--' }
    B47b4 = { name: '制冷状态', value: '--' }
    B47b5 = { name: '高压低锁定状态', value: '--' }
    B47b6 = { name: '准备状态', value: '--' }
    B47b7 = { name: 'BMS模式', value: '--' }
    B48 = { name: '电池累计电压(V)', value: '--' }
    B50 = { name: '自检状态', value: '--' }
    B53b0 = { name: '总正继电器', value: '--' }
    B53b1 = { name: '总负继电器', value: '--' }
    B53b2 = { name: '预充继电器', value: '--' }
    B53b3 = { name: '断路器', value: '--' }
    B55b0 = { name: '总正继电器', value: '--' }
    B55b2 = { name: '总负继电器', value: '--' }
    B55b4 = { name: '预充继电器', value: '--' }
    B55b6 = { name: '断路器', value: '--' }
    B56 = { name: '分流器电流(A)', value: '--' }
    B58 = { name: '霍尔电流1(A)', value: '--' }
    B60 = { name: '霍尔电流2(A)', value: '--' }
    B62 = { name: 'CAN霍尔电流(A)', value: '--' }
    B66 = { name: '电池连接失败原因', value: '--' }
    B68 = { name: '电池未成功连接原因', value: '--' }
    B70 = { name: 'BMS最大单体值(mV)', value: '--' }
    B72 = { name: '最大单体值位置', value: '--' }
    B74 = { name: '单体压差(mV)', value: '--' }
    B78 = { name: '故障字1', value: '--' }
    B80 = { name: '故障字2', value: '--' }
    B82 = { name: '故障字3', value: '--' }
    B84 = { name: '故障字4', value: '--' }
    B86 = { name: '故障字5', value: '--' }
    B88 = { name: '故障字6', value: '--' }
    B90 = { name: '故障字7', value: '--' }
    B92 = { name: '故障字8', value: '--' }
    B94 = { name: '故障字9', value: '--' }
    B96 = { name: '故障字10', value: '--' }
    B98 = { name: '故障字11', value: '--' }
    B100 = { name: '故障字12', value: '--' }
    B102 = { name: '故障字13', value: '--' }
    B104 = { name: '故障字14', value: '--' }
    B106 = { name: '故障字15', value: '--' }
    B108 = { name: '故障字16', value: '--' }
    B112 = { name: 'SOH(%)', value: '--' }
    B114 = { name: 'pack总容量(AH)', value: '--' }
    B116 = { name: '单次放电累计电量(KWH)', value: '--' }
    B118 = { name: '单次充电累计电量(KWH)', value: '--' }
    B120 = { name: '放电累计电量(kWh)', value: '--' }
    B124 = { name: '充电累计电量(kWh)', value: '--' }
    B128 = { name: '累计充电次数', value: '--' }
    B130 = { name: '总使用时间(min)', value: '--' }
    B134 = { name: '总放电时间(min)', value: '--' }
    B138 = { name: '总充电时间(min)', value: '--' }
    B142 = { name: '当日累计充电量(kWh)', value: '--' }
    B144 = { name: '当日累计放电量(kWh)', value: '--' }
    B148 = { name: '极柱最大温度(℃)', value: '--' }
    B149 = { name: '极柱最小温度(℃)', value: '--' }
    B150 = { name: '极柱最大温度位置', value: '--' }
    B152 = { name: '极柱最小温度位置', value: '--' }
    B156 = { name: 'PDU温度数量', value: '--' }
    B158 = { name: 'PDU1极柱温度(℃)', value: '--' }
    B159 = { name: 'PDU2极柱温度(℃)', value: '--' }
    B160 = { name: 'PDU3极柱温度(℃)', value: '--' }
    B161 = { name: 'PDU4极柱温度(℃)', value: '--' }
    B162 = { name: 'PDU5极柱温度(℃)', value: '--' }
    B163 = { name: 'PDU6极柱温度(℃)', value: '--' }
    B164 = { name: 'PDU7极柱温度(℃)', value: '--' }
    B165 = { name: 'PDU8极柱温度(℃)', value: '--' }
    B170 = { name: 'PACK温感采集数量', value: '--' }
    B172 = { name: 'PACK电压采集数量', value: '--' }
    B176 = { name: 'PACK1总压(V)', value: '--' }
    B178 = { name: 'PACK1最高单体温度(℃)', value: '--' }
    B179 = { name: 'PACK1最低单体温度(℃)', value: '--' }
    B180 = { name: 'PACK1最高温度位置', value: '--' }
    B182 = { name: 'PACK1最低温度位置', value: '--' }
    B184 = { name: 'PACK1最高电压位置', value: '--' }
    B186 = { name: 'PACK1最低电压位置', value: '--' }
    B188 = { name: 'PACK1最高单体电压(mV)', value: '--' }
    B190 = { name: 'PACK1最低单体电压(mV)', value: '--' }
    B192 = { name: 'PACK2总压(V)', value: '--' }
    B194 = { name: 'PACK2最高单体温度(℃)', value: '--' }
    B195 = { name: 'PACK最低单体温度(℃)', value: '--' }
    B196 = { name: 'PACK2最高温度位置', value: '--' }
    B198 = { name: 'PACK2最低温度位置', value: '--' }
    B200 = { name: 'PACK2最高电压位置', value: '--' }
    B202 = { name: 'PACK2最低电压位置', value: '--' }
    B204 = { name: 'PACK2最高单体电压(mV)', value: '--' }
    B206 = { name: 'PACK2最低单体电压(mV)', value: '--' }
    B208 = { name: 'PACK3总压(V)', value: '--' }
    B210 = { name: 'PACK3最高单体温度(℃)', value: '--' }
    B211 = { name: 'PACK3最低单体温度(℃)', value: '--' }
    B212 = { name: 'PACK3最高温度位置', value: '--' }
    B214 = { name: 'PACK3最低温度位置', value: '--' }
    B216 = { name: 'PACK3最高电压位置', value: '--' }
    B218 = { name: 'PACK3最低电压位置', value: '--' }
    B220 = { name: 'PACK3最高单体电压(mV)', value: '--' }
    B222 = { name: 'PACK3最低单体电压(mV)', value: '--' }
}

class StateData {
    B0b0 = { name: '总正继电器', value: '--' }
    B0b1 = { name: '总负继电器', value: '--' }
    B0b2 = { name: '断路器脱扣控制', value: '--' }
    B0b3 = { name: '预充继电器控制', value: '--' }
    B0b4 = { name: '绿灯', value: '--' }
    B0b5 = { name: '红灯', value: '--' }
    // B0b6 = { name: '预留', value: '--' }
    B0b7 = { name: '从机唤醒', value: '--' }
    // B1b0 = { name: 'LSS1', value: '--' }
    // B1b1 = { name: 'LSS2', value: '--' }
    // B1b2 = { name: 'LSS3', value: '--' }
    // B1b3 = { name: 'LSS4', value: '--' }
    B1b4 = { name: '三级故障输出', value: '--' }
    // B1b5 = { name: 'SW_OUT2', value: '--' }
    // B1b6 = { name: 'SW_OUT3', value: '--' }
    // B1b7 = { name: 'SW_OUT4', value: '--' }
    B2b0 = { name: '消防泄放', value: '--' }
    B2b1 = { name: '水浸（常开）', value: '--' }
    // B2b2 = { name: 'DIH3', value: '--' }
    // B2b3 = { name: 'DIH4', value: '--' }
    // B2b4 = { name: 'DIH5', value: '--' }
    // B2b5 = { name: 'DIH6', value: '--' }
    // B2b6 = { name: 'DIH7', value: '--' }
    // B2b7 = { name: 'DIH8', value: '--' }
    // B3b0 = { name: 'DIL1', value: '--' }
    // B3b1 = { name: 'DIL2', value: '--' }
    // B3b2 = { name: 'DIL3', value: '--' }
    // B3b3 = { name: 'DIL4', value: '--' }
    // B3b4 = { name: 'DIL5', value: '--' }
    B3b5 = { name: 'DIS1 (SWDi1)', value: '--' }
    B3b6 = { name: 'DIS2 (SWDi2)', value: '--' }
    B3b7 = { name: 'DIS3 (SWDi3)', value: '--' }
    // B4b0 = { name: 'DIS4 (SWDi4)', value: '--' }
    // B4b1 = { name: 'DIS5 (SWDi5)', value: '--' }
    // B4b2 = { name: 'SW_IN1', value: '--' }
    // B4b3 = { name: 'SW_IN2', value: '--' }
    // B4b4 = { name: 'SW_IN3', value: '--' }
    // B6b0 = { name: 'S1HSS1', value: '--' }
    // B6b1 = { name: 'S2HSS1', value: '--' }
    // B6b2 = { name: 'S3HSS1', value: '--' }
    // B6b3 = { name: 'S4HSS1', value: '--' }
    // B6b4 = { name: 'S5HSS1', value: '--' }
    // B6b5 = { name: 'S6HSS1', value: '--' }
    // B6b6 = { name: 'S7HSS1', value: '--' }
    // B6b7 = { name: 'S8HSS1', value: '--' }
    // B7b0 = { name: 'S9HSS1', value: '--' }
    // B7b1 = { name: 'S10HSS1', value: '--' }
    // B7b2 = { name: 'S11HSS1', value: '--' }
    // B7b3 = { name: 'S12HSS1', value: '--' }
    // B7b4 = { name: 'S13HSS1', value: '--' }
    // B7b5 = { name: 'S14HSS1', value: '--' }
    // B7b6 = { name: 'S15HSS1', value: '--' }
    // B7b7 = { name: 'S16HSS1', value: '--' }
    // B8b0 = { name: 'S1HSS2', value: '--' }
    // B8b1 = { name: 'S2HSS2', value: '--' }
    // B8b2 = { name: 'S3HSS2', value: '--' }
    // B8b3 = { name: 'S4HSS2', value: '--' }
    // B8b4 = { name: 'S5HSS2', value: '--' }
    // B8b5 = { name: 'S6HSS2', value: '--' }
    // B8b6 = { name: 'S7HSS2', value: '--' }
    // B8b7 = { name: 'S8HSS2', value: '--' }
    // B9b0 = { name: 'S9HSS2', value: '--' }
    // B9b1 = { name: 'S10HSS2', value: '--' }
    // B9b2 = { name: 'S11HSS2', value: '--' }
    // B9b3 = { name: 'S12HSS2', value: '--' }
    // B9b4 = { name: 'S13HSS2', value: '--' }
    // B9b5 = { name: 'S14HSS2', value: '--' }
    // B9b6 = { name: 'S15HSS2', value: '--' }
    // B9b7 = { name: 'S16HSS2', value: '--' }
    // B10b0 = { name: 'S1DL1', value: '--' }
    // B10b1 = { name: 'S2DL1', value: '--' }
    // B10b2 = { name: 'S3DL1', value: '--' }
    // B10b3 = { name: 'S4DL1', value: '--' }
    // B10b4 = { name: 'S5DL1', value: '--' }
    // B10b5 = { name: 'S6DL1', value: '--' }
    // B10b6 = { name: 'S7DL1', value: '--' }
    // B10b7 = { name: 'S8DL1', value: '--' }
    // B11b0 = { name: 'S9DL1', value: '--' }
    // B11b1 = { name: 'S10DL1', value: '--' }
    // B11b2 = { name: 'S11DL1', value: '--' }
    // B11b3 = { name: 'S12DL1', value: '--' }
    // B11b4 = { name: 'S13DL1', value: '--' }
    // B11b5 = { name: 'S14DL1', value: '--' }
    // B11b6 = { name: 'S15DL1', value: '--' }
    // B11b7 = { name: 'S16DL1', value: '--' }
    // B12b0 = { name: 'S1DL2', value: '--' }
    // B12b1 = { name: 'S2DL2', value: '--' }
    // B12b2 = { name: 'S3DL2', value: '--' }
    // B12b3 = { name: 'S4DL2', value: '--' }
    // B12b4 = { name: 'S5DL2', value: '--' }
    // B12b5 = { name: 'S6DL2', value: '--' }
    // B12b6 = { name: 'S7DL2', value: '--' }
    // B12b7 = { name: 'S8DL2', value: '--' }
    // B13b0 = { name: 'S9DL2', value: '--' }
    // B13b1 = { name: 'S10DL2', value: '--' }
    // B13b2 = { name: 'S11DL2', value: '--' }
    // B13b3 = { name: 'S12DL2', value: '--' }
    // B13b4 = { name: 'S13DL2', value: '--' }
    // B13b5 = { name: 'S14DL2', value: '--' }
    // B13b6 = { name: 'S15DL2', value: '--' }
    // B13b7 = { name: 'S16DL2', value: '--' }
    // B16 = { name: '放电自检故障', value: '--' }
    // B18 = { name: '放电诊断故障标志', value: '--' }
    // B20 = { name: '放电诊断故障动作', value: '--' }
    // B22 = { name: '充电自检故障', value: '--' }
    // B24 = { name: '充电诊断故障标志', value: '--' }
    // B26 = { name: '充电诊断故障动作', value: '--' }
    // B28 = { name: '其他放电故障1', value: '--' }
    // B30 = { name: '其他充电故障2', value: '--' }
    // B32 = { name: '国标充电通信故障', value: '--' }
    // B34 = { name: 'CC阻值(Ω)', value: '--' }
    // B36 = { name: 'CC电压值(V)', value: '--' }
    // B38 = { name: 'CC2阻值(Ω)', value: '--' }
    // B40 = { name: 'CC2电压值(V)', value: '--' }
    // B42 = { name: 'CP PWM 频率(Hz)', value: '--' }
    // B44 = { name: 'CP PWM 占空比(%)', value: '--' }
    // B48 = { name: 'BCU供电电压(mV)', value: '--' }
    // B50 = { name: '霍尔12V供电电压(mV)', value: '--' }
    // B52 = { name: '霍尔5V供电电压(mV)', value: '--' }
    // B54 = { name: '霍尔基准电压(mV)', value: '--' }
    // B56 = { name: '系统5V电压(mV)', value: '--' }
    // B58 = { name: '系统3V电压(mV)', value: '--' }
    // B60 = { name: '高压ADC12V电压(mV)', value: '--' }
    // B62 = { name: '板载NTC温度(℃)', value: '--' }
    // B64 = { name: 'RTC片内温度(℃)', value: '--' }
    // B66 = { name: '分流器ADC片内温度(℃)', value: '--' }
    B70 = { name: '额定电压(V)', value: '--' }
    B72 = { name: '标称容量(Ah)', value: '--' }
    B74 = { name: '电池串数', value: '--' }
    B76 = { name: '温感数量', value: '--' }
    B78 = { name: '从机（pack）数量', value: '--' }
    B80 = { name: '极柱温感数', value: '--' }
    // B85 = { name: '风机T1温度(℃)', value: '--' }
    // B87 = { name: '风机T2温度(℃)', value: '--' }
    // B89 = { name: '风机T3温度(℃)', value: '--' }
    // B91 = { name: '风机T4温度(℃)', value: '--' }
    // B93 = { name: '风机1转速', value: '--' }
    // B95 = { name: '风机2转速', value: '--' }
    // B97 = { name: '风机3转速', value: '--' }
    // B99 = { name: '风机4转速', value: '--' }
    // B102 = { name: '回液压力(0.001bar)', value: '--' }
    // B104 = { name: '供液压力(0.001bar)', value: '--' }
    // B106 = { name: '环境温度(℃)', value: '--' }
    // B108 = { name: 'TMS温度设置(℃)', value: '--' }
    // B111b0 = { name: 'TMS运行模式', value: '--' }
    // B111b4 = { name: 'TMS运行状态', value: '--' }
    // B112 = { name: 'TMS入口温度(℃)', value: '--' }
    // B114 = { name: 'TMS出口温度(℃)', value: '--' }
    // B116 = { name: 'TMS供应商代码', value: '--' }
    // B118 = { name: '产品机型', value: '--' }
    // B120 = { name: '软件版本', value: '--' }
    // B122 = { name: '控制模式', value: '--' }
    // B124 = { name: '进出水压差值(0.001bar)', value: '--' }
    // B126 = { name: '压缩机转速(1rpm)', value: '--' }
    // B128 = { name: '交流供电电压(1V)', value: '--' }
    // B130 = { name: '通信状态', value: '--' }
    // B131 = { name: '机组运行状态', value: '--' }
    // B131b1 = { name: '自检状态', value: '--' }
    // B131b2 = { name: '制冷运行状态', value: '--' }
    // B131b3 = { name: '制热运行状态', value: '--' }
    // B131b4 = { name: '水泵运行状态', value: '--' }
    // B131b5 = { name: '外风机运行状态', value: '--' }
    // B131b6 = { name: '报警状态', value: '--' }
    // B131b7 = { name: '补水泵运行状态', value: '--' }
    // B132 = { name: '电子膨胀阀开度', value: '--' }
    // B134 = { name: '低压侧压力值(0.001bar)', value: '--' }
    // B136 = { name: '高压侧压力值(0.001bar)', value: '--' }
    // B138 = { name: '冷凝盘管温度(℃)', value: '--' }
    // B140 = { name: '板换温度(℃)', value: '--' }
    // B142 = { name: '吸气温度(℃)', value: '--' }
    // B144 = { name: '排气温度(℃)', value: '--' }
    // B146 = { name: '环境温度(℃)', value: '--' }
    // B148 = { name: '系统流量', value: '--' }
    // B150 = { name: '水泵转速', value: '--' }
    // B152 = { name: '2#电子膨胀阀开度', value: '--' }
    // B154 = { name: '2#低压侧压力值(0.001bar)', value: '--' }
    // B156 = { name: '2#高压侧压力值(0.001bar)', value: '--' }
    // B158 = { name: '2#吸气温度(℃)', value: '--' }
    // B160 = { name: '2#排气温度(℃)', value: '--' }
    // B162 = { name: '2#水泵转速', value: '--' }
    // B166 = { name: 'TMS故障字1透传', value: '--' }
    // B168 = { name: 'TMS故障字2透传', value: '--' }
    // B170 = { name: 'TMS故障字3透传', value: '--' }
    // B172 = { name: 'TMS故障字4透传', value: '--' }
    // B174 = { name: 'TMS故障字5透传', value: '--' }
    // B176 = { name: 'TMS故障字6透传', value: '--' }
    // B178 = { name: 'TMS故障字7透传', value: '--' }
    // B180 = { name: 'TMS故障字8透传', value: '--' }
    // B182 = { name: 'TMS故障字9透传', value: '--' }
    // B184 = { name: 'TMS故障字10透传', value: '--' }
    // B186 = { name: 'TMS故障字11透传', value: '--' }
    // B188 = { name: 'TMS故障字12透传', value: '--' }
    // B190 = { name: 'TMS故障字13透传', value: '--' }
    // B192 = { name: 'TMS故障字14透传', value: '--' }
    // B194 = { name: 'TMS故障字15透传', value: '--' }
    // B196 = { name: 'TMS故障字16透传', value: '--' }
    // B198 = { name: 'TMS开关机故障复位', value: '--' }
    // B200 = { name: 'TMS模式设置', value: '--' }
    // B202 = { name: '制冷设定点(℃)', value: '--' }
    // B204 = { name: '制冷回差', value: '--' }
    // B206 = { name: '制热设定点(℃)', value: '--' }
    // B208 = { name: '制热回差', value: '--' }
    // B210 = { name: '制冷目标参数设置(℃)', value: '--' }
    // B212 = { name: '制热目标参数设置(℃)', value: '--' }
    // B216 = { name: '通信状态', value: '--' }
    // B218 = { name: '（单设备/主机）CO浓度(ppm)', value: '--' }
    // B220 = { name: '（单设备/主机）氢气浓度(ppm)', value: '--' }
    // B222 = { name: '（单设备/主机）烟雾数值(ppm)', value: '--' }
    // B224 = { name: '（单设备/主机）VOC数值(ppm)', value: '--' }
    // B226 = { name: '（单设备/主机）温度数值(℃)', value: '--' }
    // B228 = { name: '（单设备/主机）报警等级', value: '--' }
    // B231 = { name: 'CO浓度报警', value: '--' }
    // B231b1 = { name: '氢气浓度报警', value: '--' }
    // B231b2 = { name: 'VOC浓度报警', value: '--' }
    // B231b3 = { name: '烟雾浓度报警', value: '--' }
    // B231b4 = { name: '温度报警', value: '--' }
}

class ControlData {
    B0 = { name: '心跳', value: '--' }
    B3b0 = { name: '上高压请求', value: '--' }
    B3b1 = { name: '下高压请求', value: '--' }
    B3b2 = { name: '紧急下电请求', value: '--' }
    B3b3 = { name: '预充请求', value: '--' }
    B3b4 = { name: '绝缘检测开关', value: '--' }
    B5b0 = { name: '请求BMS重启', value: '--' }
    B5b1 = { name: '交流断路器切断请求', value: '--' }
    B5b2 = { name: '系统锁', value: '--' }
    B5b3 = { name: '故障复位', value: '--' }
    B6 = { name: '强控HSS8', value: '--' }
    B6b1 = { name: '强控LSS1', value: '--' }
    B6b2 = { name: '强控LSS2', value: '--' }
    B6b3 = { name: '强控DO1', value: '--' }
    B6b4 = { name: '强控DO2', value: '--' }
    B6b5 = { name: '强控DO3', value: '--' }
    B7 = { name: '强控使能位', value: '--' }
    B7b1 = { name: '强控HSS1', value: '--' }
    B7b2 = { name: '强控HSS2', value: '--' }
    B7b3 = { name: '强控HSS3', value: '--' }
    B7b4 = { name: '强控HSS4', value: '--' }
    B7b5 = { name: '强控HSS5', value: '--' }
    B7b6 = { name: '强控HSS6', value: '--' }
    B7b7 = { name: '强控HSS7', value: '--' }
    B8 = { name: '绝缘检测控制', value: '--' }
    B12 = { name: 'TMS开关机故障复位', value: '--' }
    B14 = { name: 'TMS模式设置', value: '--' }
    B16 = { name: '制冷设定点(℃)', value: '--' }
    B18 = { name: '制冷回差(℃)', value: '--' }
    B20 = { name: '制热设定点(℃)', value: '--' }
    B22 = { name: '制热回差(℃)', value: '--' }
    B24 = { name: '制冷目标参数设置(℃)', value: '--' }
    B26 = { name: '制热目标参数设置(℃)', value: '--' }
    B30 = { name: '控温开启值(℃)', value: '--' }
    B32 = { name: '控温关闭值(℃)', value: '--' }
    B34 = { name: '控湿度开启值(%)', value: '--' }
    B36 = { name: '控湿度关闭值(%)', value: '--' }
    B38 = { name: '温度报警上限值(℃)', value: '--' }
    B40 = { name: '温度报警下限值(℃)', value: '--' }
}

// 设备信息 枚举值
const deviceEnums = {
    B21b0: { 0: '通信正常', 1: '通信故障' },
}

// 能源数据 枚举值
const energyEnums = {
    B0b0: { 0: '已断开', 1: '正在连接_1', 2: '正在连接_2', 3: '已连接', 4: '连接失败' },
    B1b0: { 0: '无故障', 1: '1级', 2: '2级', 3: '3级' },
    B1b2: { 0: '空闲', 1: '充电中', 2: '放电中' },
    B1b4: { 0: '正常', 1: '禁止充电', 2: '禁止放电', 3: '待机', 4: '停止' },
    B47b0: { 0: '无', 1: '预充电', 2: '已预充电', 3: '预充电失败' },
    B47b2: { 0: '未在均衡', 1: '在均衡' },
    B47b3: { 0: '无效', 1: '有效' },
    B47b4: { 0: '无效', 1: '有效' },
    B47b5: { 0: '无效', 1: '有效' },
    B47b6: { 0: '无效', 1: '有效' },
    B47b7: { 0: '无效', 1: '有效' },
    B50: { 0: '检查中', 1: '完成', 2: '失败' },
    B53b0: { 0: '断开', 1: '闭合' },
    B53b1: { 0: '断开', 1: '闭合' },
    B53b2: { 0: '断开', 1: '闭合' },
    B53b3: { 0: '断开', 1: '闭合' },
    B55b0: { 0: '无故障', 1: '粘连故障', 2: '开路故障', 3: '诊断电路故障' },
    B55b2: { 0: '无故障', 1: '粘连故障', 2: '开路故障', 3: '诊断电路故障' },
    B55b4: { 0: '无故障', 1: '粘连故障', 2: '开路故障', 3: '诊断电路故障' },
    B55b6: { 0: '无故障', 1: '粘连故障', 2: '开路故障', 3: '诊断电路故障' },
    B66: { 0: '成功', 1: '通信失败', 2: '数据错误', 3: '其他错误' },
}

// 状态数据 枚举值
const statusEnums = {
    B0b0: { 0: '无效', 1: '有效' },
    B0b1: { 0: '无效', 1: '有效' },
    B0b2: { 0: '无效', 1: '有效' },
    B0b3: { 0: '无效', 1: '有效' },
    B0b4: { 0: '无效', 1: '有效' },
    B0b5: { 0: '无效', 1: '有效' },
    // B0b6: { 0: '无效', 1: '有效' },
    B0b7: { 0: '无效', 1: '有效' },
    B1b0: { 0: '无效', 1: '有效' },
    B1b1: { 0: '无效', 1: '有效' },
    B1b2: { 0: '无效', 1: '有效' },
    B1b3: { 0: '无效', 1: '有效' },
    B1b4: { 0: '无效', 1: '有效' },
    B1b5: { 0: '无效', 1: '有效' },
    B1b6: { 0: '无效', 1: '有效' },
    B1b7: { 0: '无效', 1: '有效' },
    B2b0: { 0: '无效', 1: '有效' },
    B2b1: { 0: '无效', 1: '有效' },
    B2b2: { 0: '无效', 1: '有效' },
    B2b3: { 0: '无效', 1: '有效' },
    B2b4: { 0: '无效', 1: '有效' },
    B2b5: { 0: '无效', 1: '有效' },
    B2b6: { 0: '无效', 1: '有效' },
    B2b7: { 0: '无效', 1: '有效' },
    B3b0: { 0: '无效', 1: '有效' },
    B3b1: { 0: '无效', 1: '有效' },
    B3b2: { 0: '无效', 1: '有效' },
    B3b3: { 0: '无效', 1: '有效' },
    B3b4: { 0: '无效', 1: '有效' },
    B3b5: { 0: '无效', 1: '有效' },
    B3b6: { 0: '无效', 1: '有效' },
    B3b7: { 0: '无效', 1: '有效' },
    B4b0: { 0: '无效', 1: '有效' },
    B4b1: { 0: '无效', 1: '有效' },
    B4b2: { 0: '无效', 1: '有效' },
    B4b3: { 0: '无效', 1: '有效' },
    B4b4: { 0: '无效', 1: '有效' },
    B6b0: { 0: '无效', 1: '有效' },
    B6b1: { 0: '无效', 1: '有效' },
    B6b2: { 0: '无效', 1: '有效' },
    B6b3: { 0: '无效', 1: '有效' },
    B6b4: { 0: '无效', 1: '有效' },
    B6b5: { 0: '无效', 1: '有效' },
    B6b6: { 0: '无效', 1: '有效' },
    B6b7: { 0: '无效', 1: '有效' },
    B7b0: { 0: '无效', 1: '有效' },
    B7b1: { 0: '无效', 1: '有效' },
    B7b2: { 0: '无效', 1: '有效' },
    B7b3: { 0: '无效', 1: '有效' },
    B7b4: { 0: '无效', 1: '有效' },
    B7b5: { 0: '无效', 1: '有效' },
    B7b6: { 0: '无效', 1: '有效' },
    B7b7: { 0: '无效', 1: '有效' },
    B8b0: { 0: '无效', 1: '有效' },
    B8b1: { 0: '无效', 1: '有效' },
    B8b2: { 0: '无效', 1: '有效' },
    B8b3: { 0: '无效', 1: '有效' },
    B8b4: { 0: '无效', 1: '有效' },
    B8b5: { 0: '无效', 1: '有效' },
    B8b6: { 0: '无效', 1: '有效' },
    B8b7: { 0: '无效', 1: '有效' },
    B9b0: { 0: '无效', 1: '有效' },
    B9b1: { 0: '无效', 1: '有效' },
    B9b2: { 0: '无效', 1: '有效' },
    B9b3: { 0: '无效', 1: '有效' },
    B9b4: { 0: '无效', 1: '有效' },
    B9b5: { 0: '无效', 1: '有效' },
    B9b6: { 0: '无效', 1: '有效' },
    B9b7: { 0: '无效', 1: '有效' },
    B10b0: { 0: '无效', 1: '有效' },
    B10b1: { 0: '无效', 1: '有效' },
    B10b2: { 0: '无效', 1: '有效' },
    B10b3: { 0: '无效', 1: '有效' },
    B10b4: { 0: '无效', 1: '有效' },
    B10b5: { 0: '无效', 1: '有效' },
    B10b6: { 0: '无效', 1: '有效' },
    B10b7: { 0: '无效', 1: '有效' },
    B11b0: { 0: '无效', 1: '有效' },
    B11b1: { 0: '无效', 1: '有效' },
    B11b2: { 0: '无效', 1: '有效' },
    B11b3: { 0: '无效', 1: '有效' },
    B11b4: { 0: '无效', 1: '有效' },
    B11b5: { 0: '无效', 1: '有效' },
    B11b6: { 0: '无效', 1: '有效' },
    B11b7: { 0: '无效', 1: '有效' },
    B12b0: { 0: '无效', 1: '有效' },
    B12b1: { 0: '无效', 1: '有效' },
    B12b2: { 0: '无效', 1: '有效' },
    B12b3: { 0: '无效', 1: '有效' },
    B12b4: { 0: '无效', 1: '有效' },
    B12b5: { 0: '无效', 1: '有效' },
    B12b6: { 0: '无效', 1: '有效' },
    B12b7: { 0: '无效', 1: '有效' },
    B13b0: { 0: '无效', 1: '有效' },
    B13b1: { 0: '无效', 1: '有效' },
    B13b2: { 0: '无效', 1: '有效' },
    B13b3: { 0: '无效', 1: '有效' },
    B13b4: { 0: '无效', 1: '有效' },
    B13b5: { 0: '无效', 1: '有效' },
    B13b6: { 0: '无效', 1: '有效' },
    B13b7: { 0: '无效', 1: '有效' },
    B16: { 0: '无故障', 1: '有故障' },
    B18: { 0: '无故障', 1: '有故障' },
    B20: { 0: '无故障', 1: '有故障' },
    B22: { 0: '无故障', 1: '有故障' },
    B24: { 0: '无故障', 1: '有故障' },
    B26: { 0: '无故障', 1: '有故障' },
    B28: { 0: '无故障', 1: '有故障' },
    B30: { 0: '无故障', 1: '有故障' },
    B32: { 0: '无故障', 1: '有故障' },
    B111b0: { 1: '制冷', 2: '加热', 3: '自循环', 4: '自动', 5: '停机' },
    B111b4: { 0: '空闲', 1: '准备启动', 2: '运行中', 3: '延迟关机', 4: '故障', 5: '通信失败' },
    B118: { 1: '8Kw单相' },
}

// 控制数据 枚举值
const controlEnums = {
    B3b0: { 0: '无请求', 1: '请求上电' },
    B3b1: { 0: '无请求', 1: '请求下电' },
    B3b2: { 0: '无请求', 1: '请求紧急下电' },
    B3b3: { 0: '无请求', 1: '请求预充' },
    B3b4: { 0: '开启绝缘检测', 1: '关闭绝缘检测' },
    B5b0: { 0: '无请求', 1: '请求重启' },
    B5b1: { 0: '无请求', 1: '请求切断' },
    B5b2: { 0: '无请求', 1: '系统锁释放' },
    B8: { 0: '开启绝缘检测', 1: '关闭绝缘检测' },
}
