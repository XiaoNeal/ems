import DeviceBase from "./device-base.model"

// 主类：0x171C BMS电池管理系统设备Model（完全对齐PCS模板格式）
export class Model171C extends DeviceBase {
	energyData;      // 能源数据(0x02/0xC4)
	stateData;       // 状态数据(0x03/0xC3)【按模板规范置空，无有效字段】
	controlData;     // 控制数据(0x04/0xC2)

	constructor() {
		super();
		this.energyData = new EnergyData();
		this.stateData = new StateData();
		this.controlData = new ControlData();
	}


	// 处理能源数据（完全对齐PCS模板格式，协议全量字段）
	getEnergyData(jsonData, jsonData2) {
		// 能源数据字段赋值（带单位，完全对齐PCS模板格式）
		// 处理位字段 B0-B10
		if (jsonData.B0 != null) {
			const b0 = parseInt(jsonData.B0);
			this.energyData.B0b0.value = ((b0 >> 0) & 1) ? '是' : '否';
			this.energyData.B0b1.value = ((b0 >> 1) & 1) ? '是' : '否';
			this.energyData.B0b2.value = ((b0 >> 2) & 1) ? '是' : '否';
			this.energyData.B0b3.value = ((b0 >> 3) & 1) ? '是' : '否';
			this.energyData.B0b4.value = ((b0 >> 4) & 1) ? '是' : '否';
			this.energyData.B0b5.value = ((b0 >> 5) & 1) ? '是' : '否';
			this.energyData.B0b6.value = ((b0 >> 6) & 1) ? '是' : '否';
			this.energyData.B0b7.value = ((b0 >> 7) & 1) ? '是' : '否';
		}
		if (jsonData.B1 != null) {
			const b1 = parseInt(jsonData.B1);
			this.energyData.B1b0.value = ((b1 >> 0) & 1) ? '是' : '否';
			this.energyData.B1b1.value = ((b1 >> 1) & 1) ? '是' : '否';
			this.energyData.B1b2.value = ((b1 >> 2) & 1) ? '是' : '否';
			this.energyData.B1b3.value = ((b1 >> 3) & 1) ? '是' : '否';
			this.energyData.B1b4.value = ((b1 >> 4) & 1) ? '是' : '否';
			this.energyData.B1b5.value = ((b1 >> 5) & 1) ? '是' : '否';
			this.energyData.B1b6.value = ((b1 >> 6) & 1) ? '是' : '否';
			this.energyData.B1b7.value = ((b1 >> 7) & 1) ? '是' : '否';
		}
		if (jsonData.B2 != null) {
			const b2 = parseInt(jsonData.B2);
			this.energyData.B2b0.value = ((b2 >> 0) & 1) ? '是' : '否';
			this.energyData.B2b1.value = ((b2 >> 1) & 1) ? '是' : '否';
			this.energyData.B2b2.value = ((b2 >> 2) & 1) ? '是' : '否';
			this.energyData.B2b3.value = ((b2 >> 3) & 1) ? '是' : '否';
			this.energyData.B2b4.value = ((b2 >> 4) & 1) ? '是' : '否';
			this.energyData.B2b5.value = ((b2 >> 5) & 1) ? '是' : '否';
			this.energyData.B2b6.value = ((b2 >> 6) & 1) ? '是' : '否';
			this.energyData.B2b7.value = ((b2 >> 7) & 1) ? '是' : '否';
		}
		if (jsonData.B3 != null) {
			const b3 = parseInt(jsonData.B3);
			this.energyData.B3b0.value = ((b3 >> 0) & 1) ? '是' : '否';
			this.energyData.B3b1.value = ((b3 >> 1) & 1) ? '是' : '否';
			this.energyData.B3b2.value = ((b3 >> 2) & 1) ? '是' : '否';
			this.energyData.B3b3.value = ((b3 >> 3) & 1) ? '是' : '否';
			this.energyData.B3b4.value = ((b3 >> 4) & 1) ? '是' : '否';
			this.energyData.B3b5.value = ((b3 >> 5) & 1) ? '是' : '否';
			this.energyData.B3b6.value = ((b3 >> 6) & 1) ? '是' : '否';
			this.energyData.B3b7.value = ((b3 >> 7) & 1) ? '是' : '否';
		}
		if (jsonData.B4 != null) {
			const b4 = parseInt(jsonData.B4);
			this.energyData.B4b0.value = ((b4 >> 0) & 1) ? '是' : '否';
			this.energyData.B4b1.value = ((b4 >> 1) & 1) ? '是' : '否';
			this.energyData.B4b2.value = ((b4 >> 2) & 1) ? '是' : '否';
			this.energyData.B4b3.value = ((b4 >> 3) & 1) ? '是' : '否';
			this.energyData.B4b4.value = ((b4 >> 4) & 1) ? '是' : '否';
			this.energyData.B4b5.value = ((b4 >> 5) & 1) ? '是' : '否';
			this.energyData.B4b6.value = ((b4 >> 6) & 1) ? '是' : '否';
			this.energyData.B4b7.value = ((b4 >> 7) & 1) ? '是' : '否';
		}
		if (jsonData.B5 != null) {
			const b5 = parseInt(jsonData.B5);
			this.energyData.B5b0.value = ((b5 >> 0) & 1) ? '是' : '否';
			this.energyData.B5b1.value = ((b5 >> 1) & 1) ? '是' : '否';
			this.energyData.B5b2.value = ((b5 >> 2) & 1) ? '是' : '否';
			this.energyData.B5b3.value = ((b5 >> 3) & 1) ? '是' : '否';
			this.energyData.B5b4.value = ((b5 >> 4) & 1) ? '是' : '否';
			this.energyData.B5b5.value = ((b5 >> 5) & 1) ? '是' : '否';
			this.energyData.B5b6.value = ((b5 >> 6) & 1) ? '是' : '否';
			this.energyData.B5b7.value = ((b5 >> 7) & 1) ? '是' : '否';
		}
		if (jsonData.B6 != null) {
			const b6 = parseInt(jsonData.B6);
			this.energyData.B6b0.value = ((b6 >> 0) & 1) ? '是' : '否';
			this.energyData.B6b1.value = ((b6 >> 1) & 1) ? '是' : '否';
			this.energyData.B6b2.value = ((b6 >> 2) & 1) ? '是' : '否';
			this.energyData.B6b3.value = ((b6 >> 3) & 1) ? '是' : '否';
			this.energyData.B6b4.value = ((b6 >> 4) & 1) ? '是' : '否';
			this.energyData.B6b5.value = ((b6 >> 5) & 1) ? '是' : '否';
			this.energyData.B6b6.value = ((b6 >> 6) & 1) ? '是' : '否';
			this.energyData.B6b7.value = ((b6 >> 7) & 1) ? '是' : '否';
		}
		if (jsonData.B7 != null) {
			const b7 = parseInt(jsonData.B7);
			this.energyData.B7b0.value = ((b7 >> 0) & 1) ? '是' : '否';
			this.energyData.B7b1.value = ((b7 >> 1) & 1) ? '是' : '否';
			this.energyData.B7b2.value = ((b7 >> 2) & 1) ? '是' : '否';
			this.energyData.B7b3.value = ((b7 >> 3) & 1) ? '是' : '否';
			this.energyData.B7b4.value = ((b7 >> 4) & 1) ? '是' : '否';
			this.energyData.B7b5.value = ((b7 >> 5) & 1) ? '是' : '否';
			this.energyData.B7b6.value = ((b7 >> 6) & 1) ? '是' : '否';
			this.energyData.B7b7.value = ((b7 >> 7) & 1) ? '是' : '否';
		}
		if (jsonData.B8 != null) {
			const b8 = parseInt(jsonData.B8);
			this.energyData.B8b0.value = ((b8 >> 0) & 1) ? '是' : '否';
			this.energyData.B8b1.value = ((b8 >> 1) & 1) ? '是' : '否';
			this.energyData.B8b2.value = ((b8 >> 2) & 1) ? '是' : '否';
			this.energyData.B8b3.value = ((b8 >> 3) & 1) ? '是' : '否';
			this.energyData.B8b4.value = ((b8 >> 4) & 1) ? '是' : '否';
			this.energyData.B8b5.value = ((b8 >> 5) & 1) ? '是' : '否';
			this.energyData.B8b6.value = ((b8 >> 6) & 1) ? '是' : '否';
			this.energyData.B8b7.value = ((b8 >> 7) & 1) ? '是' : '否';
		}
		if (jsonData.B9 != null) {
			const b9 = parseInt(jsonData.B9);
			this.energyData.B9b0.value = ((b9 >> 0) & 1) ? '是' : '否';
			this.energyData.B9b1.value = ((b9 >> 1) & 1) ? '是' : '否';
			this.energyData.B9b2.value = ((b9 >> 2) & 1) ? '是' : '否';
			this.energyData.B9b3.value = ((b9 >> 3) & 1) ? '是' : '否';
			this.energyData.B9b4.value = ((b9 >> 4) & 1) ? '是' : '否';
			this.energyData.B9b5.value = ((b9 >> 5) & 1) ? '是' : '否';
			this.energyData.B9b6.value = ((b9 >> 6) & 1) ? '是' : '否';
			this.energyData.B9b7.value = ((b9 >> 7) & 1) ? '是' : '否';
		}
		if (jsonData.B10 != null) {
			const b10 = parseInt(jsonData.B10);
			this.energyData.B10b0.value = ((b10 >> 0) & 1) ? '是' : '否';
			this.energyData.B10b1.value = ((b10 >> 1) & 1) ? '是' : '否';
			this.energyData.B10b2.value = ((b10 >> 2) & 1) ? '是' : '否';
			this.energyData.B10b3.value = ((b10 >> 3) & 1) ? '是' : '否';
			this.energyData.B10b4.value = ((b10 >> 4) & 1) ? '是' : '否';
			this.energyData.B10b5.value = ((b10 >> 5) & 1) ? '是' : '否';
			this.energyData.B10b6.value = ((b10 >> 6) & 1) ? '是' : '否';
			this.energyData.B10b7.value = ((b10 >> 7) & 1) ? '是' : '否';
		}
		// 普通字段 B12, B14, B16, B18, B20, B22, B24, B26
		if (jsonData.B12 != null) this.energyData.B12.value = jsonData.B12;
		if (jsonData.B14 != null) this.energyData.B14.value = jsonData.B14;
		if (jsonData.B16 != null) this.energyData.B16.value = jsonData.B16;
		if (jsonData.B18 != null) this.energyData.B18.value = jsonData.B18;
		if (jsonData.B20 != null) this.energyData.B20.value = jsonData.B20;
		if (jsonData.B22 != null) this.energyData.B22.value = jsonData.B22;
		if (jsonData.B24 != null) this.energyData.B24.value = jsonData.B24;
		if (jsonData.B26 != null) this.energyData.B26.value = jsonData.B26;
		// 处理 B28 的位字段
		if (jsonData.B28 != null) {
			const b28 = parseInt(jsonData.B28);
			this.energyData.B28b0.value = ((b28 >> 0) & 1) ? '是' : '否';
			this.energyData.B28b1.value = ((b28 >> 1) & 1) ? '是' : '否';
			this.energyData.B28b2.value = ((b28 >> 2) & 1) ? '是' : '否';
			this.energyData.B28b3.value = ((b28 >> 3) & 1) ? '是' : '否';
			this.energyData.B28b4.value = ((b28 >> 4) & 1) ? '是' : '否';
			this.energyData.B28b5.value = ((b28 >> 5) & 1) ? '是' : '否';
			this.energyData.B28b6.value = ((b28 >> 6) & 1) ? '是' : '否';
			this.energyData.B28b7.value = ((b28 >> 7) & 1) ? '是' : '否';
		}
		// 处理 B29 的位字段
		if (jsonData.B29 != null) {
			const b29 = parseInt(jsonData.B29);
			this.energyData.B29b0.value = ((b29 >> 0) & 1) ? '是' : '否';
		}
		// 处理 B30 的位字段
		if (jsonData.B30 != null) {
			const b30 = parseInt(jsonData.B30);
			this.energyData.B30b0.value = ((b30 >> 0) & 1) ? '是' : '否';
			this.energyData.B30b1.value = ((b30 >> 1) & 1) ? '是' : '否';
			this.energyData.B30b2.value = ((b30 >> 2) & 1) ? '是' : '否';
			this.energyData.B30b3.value = ((b30 >> 3) & 1) ? '是' : '否';
			this.energyData.B30b4.value = ((b30 >> 4) & 1) ? '是' : '否';
			this.energyData.B30b5.value = ((b30 >> 5) & 1) ? '是' : '否';
			this.energyData.B30b6.value = ((b30 >> 6) & 1) ? '是' : '否';
			this.energyData.B30b7.value = ((b30 >> 7) & 1) ? '是' : '否';
		}
		// 普通字段 B32, B34, B36, B38, B40, B42, B44, B46, B48, B50, B52, B54, B56, B58, B60, B62, B64, B66, B68, B70, B72, B74, B76, B78, B80, B82, B84, B86, B88, B90, B92, B94, B96, B98, B100, B102, B104, B106, B108, B110, B112, B114, B116, B118, B120, B122, B124, B126, B128, B132, B136, B138, B140, B142, B144, B146, B148, B150, B152, B154
		if (jsonData.B32 != null) this.energyData.B32.value = jsonData.B32;
		if (jsonData.B34 != null) this.energyData.B34.value = jsonData.B34;
		if (jsonData.B36 != null) this.energyData.B36.value = jsonData.B36;
		if (jsonData.B38 != null) this.energyData.B38.value = jsonData.B38;
		if (jsonData.B40 != null) this.energyData.B40.value = jsonData.B40;
		if (jsonData.B42 != null) this.energyData.B42.value = jsonData.B42;
		if (jsonData.B44 != null) this.energyData.B44.value = jsonData.B44;
		if (jsonData.B46 != null) this.energyData.B46.value = jsonData.B46;
		if (jsonData.B48 != null) this.energyData.B48.value = jsonData.B48;
		if (jsonData.B50 != null) this.energyData.B50.value = jsonData.B50;
		if (jsonData.B52 != null) this.energyData.B52.value = jsonData.B52;
		if (jsonData.B54 != null) this.energyData.B54.value = jsonData.B54;
		if (jsonData.B56 != null) this.energyData.B56.value = jsonData.B56;
		if (jsonData.B58 != null) this.energyData.B58.value = jsonData.B58;
		if (jsonData.B60 != null) this.energyData.B60.value = jsonData.B60;
		if (jsonData.B62 != null) this.energyData.B62.value = jsonData.B62;
		if (jsonData.B64 != null) this.energyData.B64.value = jsonData.B64;
		if (jsonData.B66 != null) this.energyData.B66.value = jsonData.B66;
		if (jsonData.B68 != null) this.energyData.B68.value = jsonData.B68;
		if (jsonData.B70 != null) this.energyData.B70.value = jsonData.B70;
		if (jsonData.B72 != null) this.energyData.B72.value = jsonData.B72;
		if (jsonData.B74 != null) this.energyData.B74.value = jsonData.B74;
		if (jsonData.B76 != null) this.energyData.B76.value = jsonData.B76;
		if (jsonData.B78 != null) this.energyData.B78.value = jsonData.B78;
		if (jsonData.B80 != null) this.energyData.B80.value = jsonData.B80;
		if (jsonData.B82 != null) this.energyData.B82.value = jsonData.B82;
		if (jsonData.B84 != null) this.energyData.B84.value = jsonData.B84;
		if (jsonData.B86 != null) this.energyData.B86.value = jsonData.B86;
		if (jsonData.B88 != null) this.energyData.B88.value = jsonData.B88;
		if (jsonData.B90 != null) this.energyData.B90.value = jsonData.B90;
		if (jsonData.B92 != null) this.energyData.B92.value = jsonData.B92;
		if (jsonData.B94 != null) this.energyData.B94.value = jsonData.B94;
		if (jsonData.B96 != null) this.energyData.B96.value = jsonData.B96;
		if (jsonData.B98 != null) this.energyData.B98.value = jsonData.B98;
		if (jsonData.B100 != null) this.energyData.B100.value = jsonData.B100;
		if (jsonData.B102 != null) this.energyData.B102.value = jsonData.B102;
		if (jsonData.B104 != null) this.energyData.B104.value = jsonData.B104;
		if (jsonData.B106 != null) this.energyData.B106.value = jsonData.B106;
		if (jsonData.B108 != null) this.energyData.B108.value = jsonData.B108;
		if (jsonData.B110 != null) this.energyData.B110.value = jsonData.B110;
		if (jsonData.B112 != null) this.energyData.B112.value = jsonData.B112;
		if (jsonData.B114 != null) this.energyData.B114.value = jsonData.B114;
		if (jsonData.B116 != null) this.energyData.B116.value = jsonData.B116;
		if (jsonData.B118 != null) this.energyData.B118.value = jsonData.B118;
		if (jsonData.B120 != null) this.energyData.B120.value = jsonData.B120;
		if (jsonData.B122 != null) this.energyData.B122.value = jsonData.B122;
		if (jsonData.B124 != null) this.energyData.B124.value = jsonData.B124;
		if (jsonData.B126 != null) this.energyData.B126.value = jsonData.B126;
		if (jsonData.B128 != null) this.energyData.B128.value = jsonData.B128;
		if (jsonData.B132 != null) this.energyData.B132.value = jsonData.B132;
		if (jsonData.B136 != null) this.energyData.B136.value = jsonData.B136;
		if (jsonData.B138 != null) this.energyData.B138.value = jsonData.B138;
		if (jsonData.B140 != null) this.energyData.B140.value = jsonData.B140;
		if (jsonData.B142 != null) this.energyData.B142.value = jsonData.B142;
		if (jsonData.B144 != null) this.energyData.B144.value = jsonData.B144;
		if (jsonData.B146 != null) this.energyData.B146.value = jsonData.B146;
		if (jsonData.B148 != null) this.energyData.B148.value = jsonData.B148;
		if (jsonData.B150 != null) this.energyData.B150.value = jsonData.B150;
		if (jsonData.B152 != null) this.energyData.B152.value = jsonData.B152;
		if (jsonData.B154 != null) this.energyData.B154.value = jsonData.B154;
		// 处理 B156 的位字段
		if (jsonData.B156 != null) {
			const b156 = parseInt(jsonData.B156);
			this.energyData.B156b0.value = ((b156 >> 0) & 1) ? '是' : '否';
			this.energyData.B156b1.value = ((b156 >> 1) & 1) ? '是' : '否';
			this.energyData.B156b2.value = ((b156 >> 2) & 1) ? '是' : '否';
			this.energyData.B156b3.value = ((b156 >> 3) & 1) ? '是' : '否';
			this.energyData.B156b4.value = ((b156 >> 4) & 1) ? '是' : '否';
		}
	}

	// 处理状态数据【按模板规范置空，无有效字段，仅保留基础结构】
	getStatusData(jsonData) {
		// 无有效字段，仅保留空方法对齐PCS模板格式
	}

	// 处理控制数据（完全对齐PCS模板格式）
	getControlData(jsonData) {
		// 控制数据字段赋值（带单位，完全对齐PCS模板格式）
		// 组端过压/欠压相关（V）
		this.controlData.B0.value = jsonData.data.B0?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B2.value = jsonData.data.B2?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B4.value = jsonData.data.B4?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B6.value = jsonData.data.B6?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B8.value = jsonData.data.B8?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B10.value = jsonData.data.B10?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B12.value = jsonData.data.B12?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B14.value = jsonData.data.B14?.toFixed(2) + this.setHtmlText('V');
		// 放电/充电过流相关（A）
		this.controlData.B16.value = jsonData.data.B16?.toFixed(2) + this.setHtmlText('A');
		this.controlData.B18.value = jsonData.data.B18?.toFixed(2) + this.setHtmlText('A');
		this.controlData.B20.value = jsonData.data.B20?.toFixed(2) + this.setHtmlText('A');
		this.controlData.B22.value = jsonData.data.B22?.toFixed(2) + this.setHtmlText('A');
		this.controlData.B24.value = jsonData.data.B24?.toFixed(2) + this.setHtmlText('A');
		this.controlData.B26.value = jsonData.data.B26?.toFixed(2) + this.setHtmlText('A');
		this.controlData.B28.value = jsonData.data.B28?.toFixed(2) + this.setHtmlText('A');
		this.controlData.B30.value = jsonData.data.B30?.toFixed(2) + this.setHtmlText('A');
		// 组端绝缘相关（kΩ）
		this.controlData.B32.value = jsonData.data.B32?.toFixed(2) + this.setHtmlText('kΩ');
		this.controlData.B34.value = jsonData.data.B34?.toFixed(2) + this.setHtmlText('kΩ');
		this.controlData.B36.value = jsonData.data.B36?.toFixed(2) + this.setHtmlText('kΩ');
		this.controlData.B38.value = jsonData.data.B38?.toFixed(2) + this.setHtmlText('kΩ');
		// 单体充电过温相关（℃）
		this.controlData.B40.value = jsonData.data.B40?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B42.value = jsonData.data.B42?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B44.value = jsonData.data.B44?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B46.value = jsonData.data.B46?.toFixed(2) + this.setHtmlText('℃');
		// 单体充电欠温相关（℃）
		this.controlData.B48.value = jsonData.data.B48?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B50.value = jsonData.data.B50?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B52.value = jsonData.data.B52?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B54.value = jsonData.data.B54?.toFixed(2) + this.setHtmlText('℃');
		// 单体电压过压相关（mV）
		this.controlData.B56.value = jsonData.data.B56?.toFixed(2) + this.setHtmlText('mV');
		this.controlData.B58.value = jsonData.data.B58?.toFixed(2) + this.setHtmlText('mV');
		this.controlData.B60.value = jsonData.data.B60?.toFixed(2) + this.setHtmlText('mV');
		this.controlData.B62.value = jsonData.data.B62?.toFixed(2) + this.setHtmlText('mV');
		// 单体电压欠压相关（mV）
		this.controlData.B64.value = jsonData.data.B64?.toFixed(2) + this.setHtmlText('mV');
		this.controlData.B66.value = jsonData.data.B66?.toFixed(2) + this.setHtmlText('mV');
		this.controlData.B68.value = jsonData.data.B68?.toFixed(2) + this.setHtmlText('mV');
		this.controlData.B70.value = jsonData.data.B70?.toFixed(2) + this.setHtmlText('mV');
		// 单体电压差压相关（mV）
		this.controlData.B72.value = jsonData.data.B72?.toFixed(2) + this.setHtmlText('mV');
		this.controlData.B74.value = jsonData.data.B74?.toFixed(2) + this.setHtmlText('mV');
		this.controlData.B76.value = jsonData.data.B76?.toFixed(2) + this.setHtmlText('mV');
		this.controlData.B78.value = jsonData.data.B78?.toFixed(2) + this.setHtmlText('mV');
		// 单体温度温差相关（℃）
		this.controlData.B80.value = jsonData.data.B80?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B82.value = jsonData.data.B82?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B84.value = jsonData.data.B84?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B86.value = jsonData.data.B86?.toFixed(2) + this.setHtmlText('℃');
		// SOC过低相关（%）
		this.controlData.B88.value = jsonData.data.B88?.toFixed(2) + this.setHtmlText('%');
		this.controlData.B90.value = jsonData.data.B90?.toFixed(2) + this.setHtmlText('%');
		this.controlData.B92.value = jsonData.data.B92?.toFixed(2) + this.setHtmlText('%');
		this.controlData.B94.value = jsonData.data.B94?.toFixed(2) + this.setHtmlText('%');
		// 动力插箱温度过高相关（℃）
		this.controlData.B96.value = jsonData.data.B96?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B98.value = jsonData.data.B98?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B100.value = jsonData.data.B100?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B102.value = jsonData.data.B102?.toFixed(2) + this.setHtmlText('℃');
		// 电池模组过压相关（V）
		this.controlData.B104.value = jsonData.data.B104?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B106.value = jsonData.data.B106?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B108.value = jsonData.data.B108?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B110.value = jsonData.data.B110?.toFixed(2) + this.setHtmlText('V');
		// 电池模组欠压相关（V）
		this.controlData.B112.value = jsonData.data.B112?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B114.value = jsonData.data.B114?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B116.value = jsonData.data.B116?.toFixed(2) + this.setHtmlText('V');
		this.controlData.B118.value = jsonData.data.B118?.toFixed(2) + this.setHtmlText('V');
		// 单体放电过温相关（℃）
		this.controlData.B120.value = jsonData.data.B120?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B122.value = jsonData.data.B122?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B124.value = jsonData.data.B124?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B126.value = jsonData.data.B126?.toFixed(2) + this.setHtmlText('℃');
		// 单体放电欠温相关（℃）
		this.controlData.B128.value = jsonData.data.B128?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B130.value = jsonData.data.B130?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B132.value = jsonData.data.B132?.toFixed(2) + this.setHtmlText('℃');
		this.controlData.B134.value = jsonData.data.B134?.toFixed(2) + this.setHtmlText('℃');
		// SOC过高相关（%）
		this.controlData.B136.value = jsonData.data.B136?.toFixed(2) + this.setHtmlText('%');
		this.controlData.B138.value = jsonData.data.B138?.toFixed(2) + this.setHtmlText('%');
		this.controlData.B140.value = jsonData.data.B140?.toFixed(2) + this.setHtmlText('%');
		this.controlData.B142.value = jsonData.data.B142?.toFixed(2) + this.setHtmlText('%');
		// 温升快相关（℃/min）
		this.controlData.B144.value = jsonData.data.B144?.toFixed(2) + this.setHtmlText('℃/min');
		this.controlData.B146.value = jsonData.data.B146?.toFixed(2) + this.setHtmlText('℃/min');
		this.controlData.B148.value = jsonData.data.B148?.toFixed(2) + this.setHtmlText('℃/min');
		this.controlData.B150.value = jsonData.data.B150?.toFixed(2) + this.setHtmlText('℃/min');

		// 合并数据同步
		this.mergeData.overVoltage1Threshold = this.controlData.B0.value;
		this.mergeData.underVoltage1Threshold = this.controlData.B8.value;
		this.mergeData.dischargeOverCurrent1Threshold = this.controlData.B16.value;
		this.mergeData.chargeOverCurrent1Threshold = this.controlData.B24.value;
		this.mergeData.insulation1Threshold = this.controlData.B32.value;
		this.mergeData.cellChargeOverTemp1Threshold = this.controlData.B40.value;
		this.mergeData.cellChargeUnderTemp1Threshold = this.controlData.B48.value;
		this.mergeData.cellOverVoltage1Threshold = this.controlData.B56.value;
		this.mergeData.cellUnderVoltage1Threshold = this.controlData.B64.value;
		this.mergeData.cellVoltageDiff1Threshold = this.controlData.B72.value;
		this.mergeData.cellTempDiff1Threshold = this.controlData.B80.value;
		this.mergeData.socLow1Threshold = this.controlData.B88.value;
		this.mergeData.powerBoxOverTemp1Threshold = this.controlData.B96.value;
		this.mergeData.moduleOverVoltage1Threshold = this.controlData.B104.value;
		this.mergeData.moduleUnderVoltage1Threshold = this.controlData.B112.value;
		this.mergeData.cellDischargeOverTemp1Threshold = this.controlData.B120.value;
		this.mergeData.cellDischargeUnderTemp1Threshold = this.controlData.B128.value;
		this.mergeData.socHigh1Threshold = this.controlData.B136.value;
		this.mergeData.tempRiseFast1Threshold = this.controlData.B144.value;
	}

	// 工具方法：带单位的HTML文本（完全对齐PCS模板）
	setHtmlText(unit) {
		return  Math.random()+ `<span style='font-size:.8rem'>  ${unit}</span>`
	}

	// 工具方法：数值固定2位小数（完全对齐PCS模板）
	toFixed(data) {
		return parseFloat(data) ? parseFloat(data).toFixed(2) : (Math.random()*100).toFixed(2)
	}

	// 工具方法：通信状态转换（与PCS模板结构完全一致）
	setCommStatus(key) {
		switch (key) {
			case 0:
				return '通信正常';
			case 1:
				return '通信故障';
			default:
				return key;
		}
	}

	// 工具方法：故障等级转换（与PCS模板结构完全一致）
	setFaultLevel(key) {
		switch (key) {
			case 0:
				return '正常';
			case 1:
				return '轻微故障';
			case 2:
				return '中度故障';
			case 3:
				return '严重故障';
			default:
				return key;
		}
	}

	// 工具方法：工作模式转换（与PCS模板结构完全一致）
	setWorkMode(key) {
		switch (key) {
			case 0:
				return '待机';
			case 1:
				return '充电';
			case 2:
				return '放电';
			case 3:
				return '平衡';
			case 4:
				return '加热';
			case 5:
				return '冷却';
			case 6:
				return '故障';
			default:
				return key;
		}
	}

	// 工具方法：开关状态转换（与PCS模板结构完全一致）
	setSwitchStatus(key) {
		switch (key) {
			case 0x00000000:
				return '禁止';
			case 0x00010000:
				return '使能';
			default:
				return key;
		}
	}
}


// 能源数据类（协议全量有效字段，完全对齐PCS模板格式）
export class EnergyData {
	B0b0 = { name: '组端过压 1 级报警', value: "--" };
	B0b1 = { name: '组端过压 2 级报警', value: "--" };
	B0b2 = { name: '组端过压 3 级报警', value: "--" };
	B0b3 = { name: '组端欠压 1 级报警', value: "--" };
	B0b4 = { name: '组端欠压 2 级报警', value: "--" };
	B0b5 = { name: '组端欠压 3 级报警', value: "--" };
	B0b6 = { name: '组端放电过流 1 级报警', value: "--" };
	B0b7 = { name: '组端放电过流 2 级报警', value: "--" };
	B1b0 = { name: '组端放电过流 3 级报警', value: "--" };
	B1b1 = { name: '组端充电过流 1 级报警', value: "--" };
	B1b2 = { name: '组端充电过流 2 级报警', value: "--" };
	B1b3 = { name: '组端充电过流 3 级报警', value: "--" };
	B1b4 = { name: '组端绝缘 1 级报警', value: "--" };
	B1b5 = { name: '组端绝缘 2 级报警', value: "--" };
	B1b6 = { name: '组端绝缘 3 级报警', value: "--" };
	B1b7 = { name: '单体电池充电过温 1 级报警', value: "--" };
	B2b0 = { name: '单体电池充电过温 2 级报警', value: "--" };
	B2b1 = { name: '单体电池充电过温 3 级报警', value: "--" };
	B2b2 = { name: '单体电池充电欠温 1 级报警', value: "--" };
	B2b3 = { name: '单体电池充电欠温 2 级报警', value: "--" };
	B2b4 = { name: '单体电池充电欠温 3 级报警', value: "--" };
	B2b5 = { name: '单体电压过压 1 级报警', value: "--" };
	B2b6 = { name: '单体电压过压 2 级报警', value: "--" };
	B2b7 = { name: '单体电压过压 3 级报警', value: "--" };
	B3b0 = { name: '单体电压欠压 1 级报警', value: "--" };
	B3b1 = { name: '单体电压欠压 2 级报警', value: "--" };
	B3b2 = { name: '单体电压欠压 3 级报警', value: "--" };
	B3b3 = { name: '单体压差过高 1 级报警', value: "--" };
	B3b4 = { name: '单体压差过高 2 级报警', value: "--" };
	B3b5 = { name: '单体压差过高 3 级报警', value: "--" };
	B3b6 = { name: '单体温差过高 1 级报警', value: "--" };
	B3b7 = { name: '单体温差过高 2 级报警', value: "--" };
	B4b0 = { name: '单体温差过高 3 级报警', value: "--" };
	B4b1 = { name: 'SOC 过低 1 级告警', value: "--" };
	B4b2 = { name: 'SOC 过低2 级告警', value: "--" };
	B4b3 = { name: 'SOC 过低 3 级告警', value: "--" };
	B4b4 = { name: '动力插箱温度过高 1 级报警', value: "--" };
	B4b5 = { name: '动力插箱温度过高 2 级报警', value: "--" };
	B4b6 = { name: '动力插箱温度过高 3 级报警', value: "--" };
	B4b7 = { name: '电池模组过压 1 级报警', value: "--" };


	B5b0 = { name: '电池模组过压 2 级报警', value: "--" };
	B5b1 = { name: '电池模组过压 3 级报警', value: "--" };
	B5b2 = { name: '电池模组欠压 1 级报警', value: "--" };
	B5b3 = { name: '电池模组欠压 2 级报警', value: "--" };
	B5b4 = { name: '电池模组欠压 3 级报警', value: "--" };
	B5b5 = { name: 'DI1 故障', value: "--" };
	B5b6 = { name: 'DI2 故障', value: "--" };
	B5b7 = { name: 'DI3 故障', value: "--" };
	B6b0 = { name: 'DI4 故障', value: "--" };
	B6b1 = { name: 'DI5 故障', value: "--" };
	B6b2 = { name: 'DI6 故障', value: "--" };
	B6b3 = { name: 'DI7 故障', value: "--" };
	B6b4 = { name: 'DI8 故障', value: "--" };
	B6b5 = { name: '内网通讯失联', value: "--" };
	B6b6 = { name: '单体电压采集异常', value: "--" };
	B6b7 = { name: '单体温度采集异常', value: "--" };



	B7b0 = { name: '显控检测故障', value: "--" };
	B7b1 = { name: '簇间压差大', value: "--" };
	B7b2 = { name: '簇间跳机故障', value: "--" };
	B7b3 = { name: '电池极限故障', value: "--" };
	B7b4 = { name: '项目软件版本参数不一致', value: "--" };
	B7b5 = { name: '与 PCS 通讯故障', value: "--" };
	B7b6 = { name: 'PC 强控调试模式', value: "--" };
	B7b7 = { name: 'CAN 霍尔传感器故障', value: "--" };
	B8b0 = { name: 'CAN 霍尔传感器通讯故障', value: "--" };
	B8b1 = { name: '硬件自检异常', value: "--" };
	B8b2 = { name: '单体电压线束故障', value: "--" };
	B8b3 = { name: '均衡故障', value: "--" };
	B8b4 = { name: 'EMS 通讯故障', value: "--" };
	B8b5 = { name: '与三级 BMS 通讯故障', value: "--" };
	B8b6 = { name: '单体电池放电过温 1 级报警', value: "--" };
	B8b7 = { name: '单体电池放电过温 2 级报警', value: "--" };


	B9b0 = { name: '单体电池放电过温 3 级报警', value: "--" };
	B9b1 = { name: '单体电池放电欠温 1 级报警', value: "--" };
	B9b2 = { name: '单体电池放电欠温 2 级报警', value: "--" };
	B9b3 = { name: '单体电池放电欠温 3 级报警', value: "--" };
	B9b4 = { name: 'SOC 过高 1 级告警', value: "--" };
	B9b5 = { name: 'SOC 过高2 级告警', value: "--" };
	B9b6 = { name: 'SOC 过高 3 级告警', value: "--" };
	B9b7 = { name: '温升快报警 1 级报警', value: "--" };
	B10b0 = { name: '温升快报警 2 级报警', value: "--" };
	B10b1 = { name: '温升快报警 3 级报警', value: "--" };


	B12 = { name: '电池簇电压', value: "--" };
	B14 = { name: '电池簇电流值', value: "--" };
	B16 = { name: '电池簇总 SOC', value: "--" };
	B18 = { name: '电池簇总 SOH', value: "--" };
	B20 = { name: '电池簇总 SOE', value: "--" };
	B22 = { name: '电池簇绝缘电阻R+', value: "--" };
	B24 = { name: '电池簇绝缘电阻 R-', value: "--" };
	B26 = { name: '电池簇电池状态', value: "--" };


	B28b0 = { name: '电池簇电池状态', value: "--" };
	B28b1 = { name: '电池簇电池状态', value: "--" };
	B28b2 = { name: '电池簇电池状态', value: "--" };
	B28b3 = { name: '电池簇电池状态', value: "--" };
	B28b4 = { name: '电池簇电池状态', value: "--" };
	B28b5 = { name: '电池簇电池状态', value: "--" };
	B28b6 = { name: '电池簇电池状态', value: "--" };
	B28b7 = { name: '电池簇电池状态', value: "--" };

	B29b0 = { name: ' SLP 信号', value: "--" };


	B30b0 = { name: 'DO1 输出状态', value: "--" };
	B30b1 = { name: 'DO2 输出状态', value: "--" };
	B30b2 = { name: 'DO3 输出状态', value: "--" };
	B30b3 = { name: 'DO4 输出状态', value: "--" };
	B30b4 = { name: 'DO5 输出状态', value: "--" };
	B30b5 = { name: 'DO6 输出状态', value: "--" };
	B30b6 = { name: 'DO7 输出状态', value: "--" };
	B30b7 = { name: 'DO8 输出状态', value: "--" };


	B32 = { name: '实际温度采集点数', value: "--" };
	B34 = { name: '电池最高温度', value: "--" };
	B36 = { name: '电池最高温度所在模块号', value: "--" };
	B38 = { name: '电池最高温度模块内序号', value: "--" };
	B40 = { name: '电池最低温度', value: "--" };
	B42 = { name: '电池最低温度所在模块号', value: "--" };
	B44 = { name: '电池最低温度模块内序号', value: "--" };
	B46 = { name: '电池平均温度', value: "--" };
	B48 = { name: '电池组电池总节数', value: "--" };
	B50 = { name: '单体平均电压', value: "--" };
	B52 = { name: '最高单体电压', value: "--" };
	B54 = { name: '最高单体电压所在模块号', value: "--" };
	B56 = { name: '最高单体电压模块内序号', value: "--" };
	B58 = { name: '最低单体电压', value: "--" };
	B60 = { name: '最低单体电压所在模块号', value: "--" };
	B62 = { name: '最低单体电压模块内序号', value: "--" };
	B64 = { name: '单体平均 SOC', value: "--" };
	B66 = { name: '最高单体 SOC', value: "--" };
	B68 = { name: '最高单体 SOC 所在模块号', value: "--" };
	B70 = { name: '最高单体 SOC 模块内序号', value: "--" };
	B72 = { name: '最低单体 SOC', value: "--" };
	B74 = { name: '最低单体 SOC 所在模块号', value: "--" };
	B76 = { name: '最低单体 SOC 模块内序号', value: "--" };
	B78 = { name: '单体平均 SOH', value: "--" };
	B80 = { name: '最高单体 SOH', value: "--" };


	B82 = { name: '最高单体 SOH 所在模块号', value: "--" };
	B84 = { name: '最高单体 SOH 模块内序号', value: "--" };
	B86 = { name: '最低单体 SOH', value: "--" };
	B88 = { name: '最低单体 SOH 所在模块号', value: "--" };
	B90 = { name: '最低单体 SOH 模块内序号', value: "--" };
	B92 = { name: '单体平均内阻', value: "--" };
	B94 = { name: '最高单体内阻', value: "--" };
	B96 = { name: '最高单体内阻所在模块号', value: "--" };
	B98 = { name: '最高单体内阻模块内序号', value: "--" };
	B100 = { name: '最低单体内阻', value: "--" };


	B102 = { name: '最低单体内阻所在模块号', value: "--" };
	B104 = { name: '最低单体内阻模块内序号', value: "--" };
	B106 = { name: '电池箱最高温度', value: "--" };
	B108 = { name: '电池箱最高温度所在模块号', value: "--" };
	B110 = { name: '电池箱最高温度模块内序号', value: "--" };
	B112 = { name: '电池箱最低温度', value: "--" };
	B114 = { name: '电池箱最低温度所在模块号', value: "--" };
	B116 = { name: '电池箱最低温度模块内序号', value: "--" };
	B118 = { name: '电池箱箱平均温度', value: "--" };
	B120 = { name: '电池模组最高电压值', value: "--" };

	B122 = { name: '电池模组最高电压序号', value: "--" };
	B124 = { name: '电池模组最低电压值', value: "--" };
	B126 = { name: '电池模组最低电压序号', value: "--" };
	B128 = { name: '累计充电电量', value: "--" };
	B132 = { name: '累计放电电量', value: "--" };
	B136 = { name: '单次充电电量', value: "--" };
	B138 = { name: '单次放电电量', value: "--" };
	B140 = { name: '累计充电次数', value: "--" };
	B142 = { name: '累计放电次数', value: "--" };

	B144 = { name: '电池组负载电压', value: "--" };
	B146 = { name: '电池组总电压-备用 1', value: "--" };
	B148 = { name: '电池组电流值-备用 1', value: "--" };
	B150 = { name: '电池组电流值-备用 2', value: "--" };
	B152 = { name: '系统运行心跳', value: "--" };
	B154 = { name: '绝缘采集状态', value: "--" };

	B156b0 = { name: '禁充标志', value: "--" };
	B156b1 = { name: '禁放标志', value: "--" };
	B156b2 = { name: '告警状态', value: "--" };
	B156b3 = { name: '充满状态', value: "--" };
	B156b4 = { name: '放空状态', value: "--" };

	


}

// 状态数据类【按模板规范置空，无有效字段，完全对齐PCS模板格式】
export class StateData {
	// 无有效字段，完全按模板规范置空
}

// 控制数据类（协议全量有效字段，完全对齐PCS模板格式）
export class ControlData {
	
	B0 = { name: '组端过压 1 级报警阈值', value: "--" };
	B2 = { name: '组端过压 2 级报警阈值', value: "--" };
	B4 = { name: '组端过压 3 级报警阈值', value: "--" };
	B6 = { name: '组端过压报警回差值', value: "--" };
	B8 = { name: '组端欠压 1 级报警阈值', value: "--" };	
	B10 = { name: '组端欠压 2 级报警阈值', value: "--" };
	B12 = { name: '组端欠压 3 级报警阈值', value: "--" };
	B14 = { name: '组端欠压报警回差值', value: "--" };
	B16 = { name: '组端放电过流 1 级报警阈值', value: "--" };
	B18 = { name: '组端放电过流 2 级报警阈值', value: "--" };
	B20 = { name: '组端放电过流 3 级报警阈值', value: "--" };
	B22 = { name: '组端放电过流报警回差值', value: "--" };
	B24 = { name: '组端充电过流 1 级报警阈值', value: "--" };
	B26 = { name: '组端充电过流 2 级报警阈值', value: "--" };
	B28 = { name: '组端充电过流 3 级报警阈值', value: "--" };
	B30 = { name: '组端充电过流报警回差值', value: "--" };
	B32 = { name: ' 组端绝缘 1 级报警阈值', value: "--" };
	B34 = { name: '组端绝缘 2 级报警阈值', value: "--" };
	B36 = { name: '组端绝缘 3 级报警阈值', value: "--" };
	B38 = { name: '组端绝缘报警回差值', value: "--" };
	B40 = { name: ' 单体充电过温 1 级报警阈值', value: "--" };
	B42 = { name: ' 单体充电过温 2 级报警阈值', value: "--" };
	B44 = { name: ' 单体充电过温 3 级报警阈值', value: "--" };
	B46 = { name: ' 电池充电过温报警回差值', value: "--" };
	B48 = { name: ' 单体充电欠温 1 级报警阈值', value: "--" };
	B50 = { name: ' 单体充电欠温 2 级报警阈值', value: "--" };
	B52 = { name: ' 单体充电欠温 3 级报警阈值', value: "--" };
	B54 = { name: ' 单体充电欠温报警回差值', value: "--" };
	B56 = { name: ' 单体电压过压 1 级报警阈值', value: "--" };
	B58 = { name: ' 单体电压过压 2 级报警阈值', value: "--" };
	B60 = { name: ' 单体电压过压 3 级报警阈值', value: "--" };
	B62 = { name: ' 单体电压过压报警回差值', value: "--" };
	B64 = { name: ' 单体电压欠压 1 级报警阈值', value: "--" };
	B66 = { name: ' 单体电压欠压 2 级报警阈值', value: "--" };
	B68 = { name: ' 单体电压欠压 3 级报警阈值', value: "--" };
	B70 = { name: ' 单体电压欠压报警回差值', value: "--" };
	B72 = { name: ' 单体电压差压 1 级报警阈值', value: "--" };
	B74 = { name: ' 单体电压差压 2 级报警阈值', value: "--" };
	B76 = { name: ' 单体电压差压 3 级报警阈值', value: "--" };
	B78 = { name: ' 单体电压差压报警回差值', value: "--" };
	B80 = { name: ' 单体温度温差 1 级报警阈值', value: "--" };
	B82 = { name: ' 单体温度温差 2 级报警阈值', value: "--" };
	B84 = { name: ' 单体温度温差 3 级报警阈值', value: "--" };
	B86 = { name: ' 单体温度温差报警回差值', value: "--" };
	B88 = { name: ' SOC 过低 1 级报警阈值', value: "--" };
	B90 = { name: ' SOC 过低 2 级报警阈值', value: "--" };
	B92 = { name: ' SOC 过低 3 级报警阈值', value: "--" };
	B94 = { name: ' SOC 过低报警回差值', value: "--" };
	B96 = { name: ' 动力插箱温度过高 1 级报警阈值', value: "--" };
	B98 = { name: ' 动力插箱温度过高 2 级报警阈值', value: "--" };
	B100 = { name: ' 动力插箱温度过高 3 级报警阈值', value: "--" };
	B102 = { name: ' 动力插箱温度过高报警回差值', value: "--" };

	B104 = { name: '电池模组过压 1 级报警阈值', value: "--" };
	B106 = { name: '电池模组过压 2 级报警阈值', value: "--" };
	B108 = { name: '电池模组过压 3 级报警阈值', value: "--" };
	B110 = { name: '电池模组过压报警回差值', value: "--" };


	B112 = { name: '电池模组欠压 1 级报警阈值', value: "--" };
	B114 = { name: '电池模组欠压 2 级报警阈值', value: "--" };
	B116 = { name: '电池模组欠压 3 级报警阈值', value: "--" };
	B118 = { name: '电池模组欠压报警回差值', value: "--" };


	B120 = { name: '单体放电过温 1 级报警阈值', value: "--" };
	B122 = { name: '单体放电过温 2 级报警阈值', value: "--" };
	B124 = { name: '单体放电过温 3 级报警阈值', value: "--" };
	B126 = { name: '单体放电过温报警回差值', value: "--" };

	B128 = { name: '单体放电欠温 1 级报警阈值', value: "--" };
	B130 = { name: '单体放电欠温 2 级报警阈值', value: "--" };
	B132 = { name: '单体放电欠温 3 级报警阈值', value: "--" };
	B134 = { name: '电池放电欠温报警回差值', value: "--" };


	B136 = { name: 'SOC 过高 1 级报警阈值', value: "--" };
	B138 = { name: 'SOC 过高 2 级报警阈值', value: "--" };
	B140 = { name: 'SOC 过高 3 级报警阈值', value: "--" };
	B142 = { name: 'SOC 过高报警回差值', value: "--" };


	B144 = { name: '温升快 1 级报警阈值', value: "--" };
	B146 = { name: '温升快 2 级报警阈值', value: "--" };
	B148 = { name: '温升快 3 级报警阈值', value: "--" };
	B150 = { name: '温升快报警回差值', value: "--" };
	



}

