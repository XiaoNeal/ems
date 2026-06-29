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
		// console.log(jsonData, "999999999999999999999999999999");
		this.energyData.B0b0.value = this.setAlarmStatus(jsonData.B0b0);
		this.energyData.B0b1.value = this.setAlarmStatus(jsonData.B0b1);
		this.energyData.B0b2.value = this.setAlarmStatus(jsonData.B0b2);
		this.energyData.B0b3.value = this.setAlarmStatus(jsonData.B0b3);
		this.energyData.B0b4.value = this.setAlarmStatus(jsonData.B0b4);
		this.energyData.B0b5.value = this.setAlarmStatus(jsonData.B0b5);
		this.energyData.B0b6.value = this.setAlarmStatus(jsonData.B0b6);
		this.energyData.B0b7.value = this.setAlarmStatus(jsonData.B0b7);

		this.energyData.B1b0.value = this.setAlarmStatus(jsonData.B1b0);
		this.energyData.B1b1.value = this.setAlarmStatus(jsonData.B1b1);
		this.energyData.B1b2.value = this.setAlarmStatus(jsonData.B1b2);
		this.energyData.B1b3.value = this.setAlarmStatus(jsonData.B1b3);
		this.energyData.B1b4.value = this.setAlarmStatus(jsonData.B1b4);
		this.energyData.B1b5.value = this.setAlarmStatus(jsonData.B1b5);
		this.energyData.B1b6.value = this.setAlarmStatus(jsonData.B1b6);
		this.energyData.B1b7.value = this.setAlarmStatus(jsonData.B1b7);

		this.energyData.B2b0.value = this.setAlarmStatus(jsonData.B2b0);
		this.energyData.B2b1.value = this.setAlarmStatus(jsonData.B2b1);
		this.energyData.B2b2.value = this.setAlarmStatus(jsonData.B2b2);
		this.energyData.B2b3.value = this.setAlarmStatus(jsonData.B2b3);
		this.energyData.B2b4.value = this.setAlarmStatus(jsonData.B2b4);
		this.energyData.B2b5.value = this.setAlarmStatus(jsonData.B2b5);
		this.energyData.B2b6.value = this.setAlarmStatus(jsonData.B2b6);
		this.energyData.B2b7.value = this.setAlarmStatus(jsonData.B2b7);

		this.energyData.B3b0.value = this.setAlarmStatus(jsonData.B3b0);
		this.energyData.B3b1.value = this.setAlarmStatus(jsonData.B3b1);
		this.energyData.B3b2.value = this.setAlarmStatus(jsonData.B3b2);
		this.energyData.B3b3.value = this.setAlarmStatus(jsonData.B3b3);
		this.energyData.B3b4.value = this.setAlarmStatus(jsonData.B3b4);
		this.energyData.B3b5.value = this.setAlarmStatus(jsonData.B3b5);
		this.energyData.B3b6.value = this.setAlarmStatus(jsonData.B3b6);
		this.energyData.B3b7.value = this.setAlarmStatus(jsonData.B3b7);

		this.energyData.B4b0.value = this.setAlarmStatus(jsonData.B4b0);
		this.energyData.B4b1.value = this.setAlarmStatus(jsonData.B4b1);
		this.energyData.B4b2.value = this.setAlarmStatus(jsonData.B4b2);
		this.energyData.B4b3.value = this.setAlarmStatus(jsonData.B4b3);
		this.energyData.B4b4.value = this.setAlarmStatus(jsonData.B4b4);
		this.energyData.B4b5.value = this.setAlarmStatus(jsonData.B4b5);
		this.energyData.B4b6.value = this.setAlarmStatus(jsonData.B4b6);
		this.energyData.B4b7.value = this.setAlarmStatus(jsonData.B4b7);

		this.energyData.B5b0.value = this.setAlarmStatus(jsonData.B5b0);
		this.energyData.B5b1.value = this.setAlarmStatus(jsonData.B5b1);
		this.energyData.B5b2.value = this.setAlarmStatus(jsonData.B5b2);
		this.energyData.B5b3.value = this.setAlarmStatus(jsonData.B5b3);
		this.energyData.B5b4.value = this.setAlarmStatus(jsonData.B5b4);
		this.energyData.B5b5.value = this.setAlarmStatus(jsonData.B5b5);
		this.energyData.B5b6.value = this.setAlarmStatus(jsonData.B5b6);
		this.energyData.B5b7.value = this.setAlarmStatus(jsonData.B5b7);

		this.energyData.B6b0.value = this.setAlarmStatus(jsonData.B6b0);
		this.energyData.B6b1.value = this.setAlarmStatus(jsonData.B6b1);
		this.energyData.B6b2.value = this.setAlarmStatus(jsonData.B6b2);
		this.energyData.B6b3.value = this.setAlarmStatus(jsonData.B6b3);
		this.energyData.B6b4.value = this.setAlarmStatus(jsonData.B6b4);
		this.energyData.B6b5.value = this.setAlarmStatus(jsonData.B6b5);
		this.energyData.B6b6.value = this.setAlarmStatus(jsonData.B6b6);
		this.energyData.B6b7.value = this.setAlarmStatus(jsonData.B6b7);

		this.energyData.B7b0.value = this.setAlarmStatus(jsonData.B7b0);
		this.energyData.B7b1.value = this.setAlarmStatus(jsonData.B7b1);
		this.energyData.B7b2.value = this.setAlarmStatus(jsonData.B7b2);
		this.energyData.B7b3.value = this.setAlarmStatus(jsonData.B7b3);
		this.energyData.B7b4.value = this.setAlarmStatus(jsonData.B7b4);
		this.energyData.B7b5.value = this.setAlarmStatus(jsonData.B7b5);
		this.energyData.B7b6.value = this.setAlarmStatus(jsonData.B7b6);
		this.energyData.B7b7.value = this.setAlarmStatus(jsonData.B7b7);

		this.energyData.B8b0.value = this.setAlarmStatus(jsonData.B8b0);
		this.energyData.B8b1.value = this.setAlarmStatus(jsonData.B8b1);
		this.energyData.B8b2.value = this.setAlarmStatus(jsonData.B8b2);
		this.energyData.B8b3.value = this.setAlarmStatus(jsonData.B8b3);
		this.energyData.B8b4.value = this.setAlarmStatus(jsonData.B8b4);
		this.energyData.B8b5.value = this.setAlarmStatus(jsonData.B8b5);
		this.energyData.B8b6.value = this.setAlarmStatus(jsonData.B8b6);
		this.energyData.B8b7.value = this.setAlarmStatus(jsonData.B8b7);
		// }
		// if (jsonData.B9 != null) {
		// const b9 = parseInt(jsonData.B9);
		this.energyData.B9b0.value = this.setAlarmStatus(jsonData.B9b0);
		this.energyData.B9b1.value = this.setAlarmStatus(jsonData.B9b1);
		this.energyData.B9b2.value = this.setAlarmStatus(jsonData.B9b2);
		this.energyData.B9b3.value = this.setAlarmStatus(jsonData.B9b3);
		this.energyData.B9b4.value = this.setAlarmStatus(jsonData.B9b4);
		this.energyData.B9b5.value = this.setAlarmStatus(jsonData.B9b5);
		this.energyData.B9b6.value = this.setAlarmStatus(jsonData.B9b6);
		this.energyData.B9b7.value = this.setAlarmStatus(jsonData.B9b7);

		this.energyData.B10b0.value = this.setAlarmStatus(jsonData.B10b0);
		this.energyData.B10b1.value = this.setAlarmStatus(jsonData.B10b1);

		this.energyData.B12.value = jsonData.B12;
		this.energyData.B14.value = jsonData.B14;
		this.energyData.B16.value = jsonData.B16;
		this.energyData.B18.value = jsonData.B18;
		this.energyData.B20.value = jsonData.B20;
		this.energyData.B22.value = jsonData.B22;
		this.energyData.B24.value = jsonData.B24;
		this.energyData.B26.value = this.setBatteryStatus(jsonData.B26);
		this.energyData.B28b0.value = jsonData.B28b0;
		this.energyData.B28b1.value = jsonData.B28b1;
		this.energyData.B28b2.value = jsonData.B28b2;
		this.energyData.B28b3.value = jsonData.B28b3;
		this.energyData.B28b4.value = jsonData.B28b4;
		this.energyData.B28b5.value = jsonData.B28b5;
		this.energyData.B28b6.value = jsonData.B28b6;
		this.energyData.B28b7.value = jsonData.B28b7;
		this.energyData.B29b0.value = jsonData.B29b0;
		this.energyData.B30b0.value = jsonData.B30b0;
		this.energyData.B30b1.value = jsonData.B30b1;
		this.energyData.B30b2.value = jsonData.B30b2;
		this.energyData.B30b3.value = jsonData.B30b3;
		this.energyData.B30b4.value = jsonData.B30b4;
		this.energyData.B30b5.value = jsonData.B30b5;
		this.energyData.B30b6.value = jsonData.B30b6;
		this.energyData.B30b7.value = jsonData.B30b7;

		this.energyData.B32.value = jsonData.B32;
		this.energyData.B34.value = jsonData.B34;
		this.energyData.B36.value = jsonData.B36;
		this.energyData.B38.value = jsonData.B38;
		this.energyData.B40.value = jsonData.B40;
		this.energyData.B42.value = jsonData.B42;
		this.energyData.B44.value = jsonData.B44;
		this.energyData.B46.value = jsonData.B46;
		this.energyData.B48.value = jsonData.B48;
		this.energyData.B50.value = jsonData.B50;
		this.energyData.B52.value = jsonData.B52;
		this.energyData.B54.value = jsonData.B54;
		this.energyData.B56.value = jsonData.B56;
		this.energyData.B58.value = jsonData.B58;
		this.energyData.B60.value = jsonData.B60;
		this.energyData.B62.value = jsonData.B62;
		this.energyData.B64.value = jsonData.B64;
		this.energyData.B66.value = jsonData.B66;
		this.energyData.B68.value = jsonData.B68;
		this.energyData.B70.value = jsonData.B70;
		this.energyData.B72.value = jsonData.B72;
		this.energyData.B74.value = jsonData.B74;
		this.energyData.B76.value = jsonData.B76;
		this.energyData.B78.value = jsonData.B78;
		this.energyData.B80.value = jsonData.B80;
		this.energyData.B82.value = jsonData.B82;
		this.energyData.B84.value = jsonData.B84;
		this.energyData.B86.value = jsonData.B86;
		this.energyData.B88.value = jsonData.B88;
		this.energyData.B90.value = jsonData.B90;
		this.energyData.B92.value = jsonData.B92;
		this.energyData.B94.value = jsonData.B94;
		this.energyData.B96.value = jsonData.B96;
		this.energyData.B98.value = jsonData.B98;
		this.energyData.B100.value = jsonData.B100;
		this.energyData.B102.value = jsonData.B102;
		this.energyData.B104.value = jsonData.B104;
		this.energyData.B106.value = jsonData.B106;
		this.energyData.B108.value = jsonData.B108;
		this.energyData.B110.value = jsonData.B110;
		this.energyData.B112.value = jsonData.B112;
		this.energyData.B114.value = jsonData.B114;
		this.energyData.B116.value = jsonData.B116;
		this.energyData.B118.value = jsonData.B118;
		this.energyData.B120.value = jsonData.B120;
		this.energyData.B122.value = jsonData.B122;
		this.energyData.B124.value = jsonData.B124;
		this.energyData.B126.value = jsonData.B126;
		this.energyData.B128.value = jsonData.B128;
		this.energyData.B132.value = jsonData.B132;
		this.energyData.B136.value = jsonData.B136;
		this.energyData.B138.value = jsonData.B138;
		this.energyData.B140.value = jsonData.B140;
		this.energyData.B142.value = jsonData.B142;
		this.energyData.B144.value = jsonData.B144;
		this.energyData.B146.value = jsonData.B146;
		this.energyData.B148.value = jsonData.B148;
		this.energyData.B150.value = jsonData.B150;
		this.energyData.B152.value = jsonData.B152;
		this.energyData.B154.value = jsonData.B154 === 0 ? '关闭' : (jsonData.B154 === 1 ? '开启' : jsonData.B154);
		// 处理 B156 的位字段
		// if (jsonData.B156 != null) {
		// 	const b156 = parseInt(jsonData.B156);
		this.energyData.B156b0.value = jsonData.B156b0 === 0 ? '无效' : (jsonData.B156b0 === 1 ? '有效' : jsonData.B156b0);
		this.energyData.B156b1.value = jsonData.B156b1 === 0 ? '无效' : (jsonData.B156b1 === 1 ? '有效' : jsonData.B156b1);
		this.energyData.B156b2.value = jsonData.B156b2 === 0 ? '无效' : (jsonData.B156b2 === 1 ? '有效' : jsonData.B156b2);
		this.energyData.B156b3.value = jsonData.B156b3 === 0 ? '无效' : (jsonData.B156b3 === 1 ? '有效' : jsonData.B156b3);
		this.energyData.B156b4.value = jsonData.B156b4 === 0 ? '无效' : (jsonData.B156b4 === 1 ? '有效' : jsonData.B156b4);


		this.energyData.B158.value = jsonData.B158;
		const releaseConditionMap = {
			0: '初始值',
			1: '故障解除',
			2: '反向电流',
			3: '反向电流或电压低于限值',
			4: '时间',
			5: '时间或反向电流',
			6: '故障复归解除',
			'00FF': '无效值'
		};
		this.energyData.B160.value = releaseConditionMap[jsonData.B160] || jsonData.B160;
		this.energyData.B162.value = this.setTime(jsonData);
		this.energyData.B164.value = jsonData.B164;
		this.energyData.B166.value = jsonData.B166;
		this.energyData.B168.value = (jsonData.B168);
		this.energyData.B170.value = (jsonData.B170);
		this.energyData.B172.value = jsonData.B172;
		this.energyData.B174.value = jsonData.B174;
		this.energyData.B176.value = jsonData.B176;
		this.energyData.B178.value = jsonData.B178;
		this.energyData.B180.value = jsonData.B180;
		this.energyData.B182.value = jsonData.B182;
		this.energyData.B184.value = jsonData.B184;
		this.energyData.B186.value = jsonData.B186;
		this.energyData.B184.value = jsonData.B184;
		this.energyData.B186.value = jsonData.B186;
		this.energyData.B188.value = jsonData.B188;
		this.energyData.B190.value = jsonData.B190;
		this.energyData.B192.value = jsonData.B192;
		this.energyData.B196.value = jsonData.B196;
		this.energyData.B200.value = jsonData.B200;
		this.energyData.B202.value = jsonData.B202;
		this.energyData.B204.value = jsonData.B204;
		this.energyData.B206.value = jsonData.B206;
		this.energyData.B208.value = jsonData.B208;
		this.energyData.B210.value = jsonData.B210;
		// }
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

	}

	// 工具方法：带单位的HTML文本（完全对齐PCS模板）
	setHtmlText(unit) {
		return Math.random() + `<span style='font-size:.8rem'>  ${unit}</span>`
	}

	// 工具方法：数值固定2位小数（完全对齐PCS模板）
	toFixed(data) {
		return parseFloat(data) ? parseFloat(data).toFixed(2) : (Math.random() * 100).toFixed(2)
	}

	// 工具方法：告警状态转换（0-无告警，1-告警）
	setAlarmStatus(key) {
		switch (key) {
			case 0:
				return '无告警';
			case 1:
				return '告警';
			default:
				return key;
		}
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

	setBatteryStatus(key) {
		switch (key) {
			case 1:
				return '初始化状态';
			case 2:
				return '自检';

			case 3:
				return '上电';
			case 4:
				return '上电完成';
			case 5:
				return '禁充';
			case 6:
				return '禁放';
			case 7:
				return '待机';

			case 8:
				return '故障下电';

			case 9:
				return '故障下电后故障已清除';
			case 10:
				return '测试模式';
			case 11:
				return '单簇维护';

			case 12:
				return '下电中';

			case 13:
				return '下电完成';

			default:
				return key;
		}
	}

	// 工具方法：故障等级转换（与PCS模板结构完全一致）
	setFaultLevel(key) {
	
		switch (key) {
			case 0:
				return '初始值';
			case 1:
				return '故障解除';
			case 2:
				return '反向电流';
			case 3:
				return '反向电流或电压低于限值';
			case 4:
				return '时间';
			case 5:
				return '时间或反向电流';
			case 6:
				return '故障复归解除';
			case '00FF':
				return '无效值';
			default:
				return key;
		}
	}

	setTime(jsonData) {

		if (jsonData.B162 == '00FF') {
			return '-- 分钟';
		}
		if (jsonData.B160 == 4 || jsonData.B160 == 5) {
			return jsonData.B162 + ' 分钟';
		} else {
			return jsonData.B162;
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


	B28b0 = { name: 'DI1 状态', value: "--" };
	B28b1 = { name: 'DI2 状态', value: "--" };
	B28b2 = { name: 'DI3 状态', value: "--" };
	B28b3 = { name: 'DI4 状态', value: "--" };
	B28b4 = { name: 'DI5 状态', value: "--" };
	B28b5 = { name: 'DI6 状态', value: "--" };
	B28b6 = { name: 'DI7 状态', value: "--" };
	B28b7 = { name: 'DI8 状态', value: "--" };

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


	B158 = { name: '系统告警状态', value: "--" };
	B160 = { name: '系统告警状态-禁充/禁放解除条件', value: "--" };
	B162 = { name: '系统告警状态-禁充/禁放解除时间', value: "--" };
	B164 = { name: '最大允许充电电流', value: "--" };
	B166 = { name: '最大允许放电电流', value: "--" };
	B168 = { name: '最大允许充电功率(kW)', value: "--" };
	B170 = { name: '最大允许放电功率(kW)', value: "--" };
	B172 = { name: '最大单体电压节号', value: "--" };
	B174 = { name: '最小单体电压节号', value: "--" };
	B176 = { name: '最大单体温度节号', value: "--" };
	B178 = { name: '最小单体温度节号', value: "--" };
	B180 = { name: '最大 SOC 节号', value: "--" };
	B182 = { name: '最小 SOC 节号', value: "--" };
	B184 = { name: '最大 SOH 节号', value: "--" };
	B186 = { name: '最小SOH 节号', value: "--" };
	B188 = { name: '最大电池内阻节号', value: "--" };
	B190 = { name: '最小电池内阻节号', value: "--" };
	B192 = { name: '单日累计充电电量', value: "--" };
	B196 = { name: '单日累计放电电量', value: "--" };
	B200 = { name: '主控采集 NTC 温度 1', value: "--" };
	B202 = { name: '主控采集 NTC 温度 2', value: "--" };
	B204 = { name: '主控采集 NTC 温度 3', value: "--" };
	B206 = { name: '主控采集 NTC 温度 4', value: "--" };
	B208 = { name: '通讯协议版本号主版本', value: "--" };
	B210 = { name: '通讯协议版本号子版本', value: "--" };






}

// 状态数据类【按模板规范置空，无有效字段，完全对齐PCS模板格式】
export class StateData {
	B0 = { name: '当前故障 1-故障码', value: "--" };
	B2 = { name: '故障信息 1-电池簇总压', value: "--" };
	B4 = { name: '故障信息 2-电池簇电流', value: "--" };
	B6 = { name: '故障信息 3-电池簇 SOC', value: "--" };
	B8 = { name: '故障信息 4-绝缘电值', value: "--" };
	B10 = { name: '故障信息 5-最大电压', value: "--" };
	B12 = { name: '故障信息 6-最大电压节号', value: "--" };
	B14 = { name: '故障信息 7-最小电压', value: "--" };
	B16 = { name: '故障信息 8-最小电压节号', value: "--" };
	B18 = { name: '故障信息9-最大温度', value: "--" };
	B20 = { name: '故障信息 10-最大温度节号', value: "--" };
	B22 = { name: '故障信息 11-最小温度', value: "--" };
	B24 = { name: '故障信息 12-最小温度节号', value: "--" };
	B26 = { name: '故障信息 13-DO 状态', value: "--" };
	B28 = { name: '故障信息 14-DI 状态', value: "--" };
	B30 = { name: '故障信息 15-年', value: "--" };
	B31 = { name: '故障信息 15-月', value: "--" };
	B32 = { name: '故障信息 16-日', value: "--" };
	B33 = { name: '故障信息 16-时', value: "--" };
	B34 = { name: '故障信息 17-分', value: "--" };
	B35 = { name: '故障信息 17-秒', value: "--" };
	B36 = { name: '预留故障信息', value: "--" };
	B38 = { name: '预留故障信息', value: "--" };
	B40 = { name: '预留故障信息', value: "--" };
	B42 = { name: '预留故障信息', value: "--" };
	B44 = { name: '预留故障信息', value: "--" };
	B46 = { name: '预留故障信息', value: "--" };
	B48 = { name: '预留故障信息', value: "--" };
	B50 = { name: '预留故障信息', value: "--" };
	B52 = { name: '预留故障信息', value: "--" };
	B54 = { name: '预留故障信息', value: "--" };
	B56 = { name: '预留故障信息', value: "--" };
	B58 = { name: '预留故障信息', value: "--" };
	B60 = { name: '当前故障 2-故障码', value: "--" };
	B62 = { name: '故障信息 1-电池簇总压', value: "--" };
	B64 = { name: '故障信息 2-电池簇电流', value: "--" };
	B66 = { name: '故障信息 3-电池簇 SOC', value: "--" };
	B68 = { name: '故障信息 4-绝缘电值', value: "--" };
	B70 = { name: '故障信息 5-最大电压', value: "--" };
	B72 = { name: '故障信息 6-最大电压节号', value: "--" };
	B74 = { name: '故障信息 7-最小电压', value: "--" };
	B76 = { name: '故障信息 8-最小电压节号', value: "--" };
	B78 = { name: '故障信息 9-最大温度', value: "--" };
	B80 = { name: '故障信息 10-最大温度节号', value: "--" };
	B82 = { name: '故障信息 11-最小温度', value: "--" };
	B84 = { name: '故障信息 12-最小温度节号', value: "--" };
	B86 = { name: '故障信息 13-DO 状态', value: "--" };
	B88 = { name: '故障信息 14-DI 状态', value: "--" };
	B90 = { name: '故障信息 15-年', value: "--" };
	B91 = { name: '故障信息 15-月', value: "--" };
	B92 = { name: '故障信息 16-日', value: "--" };
	B93 = { name: '故障信息 16-时', value: "--" };
	B94 = { name: '故障信息 17-分', value: "--" };
	B95 = { name: '故障信息 17-秒', value: "--" };
	B96 = { name: '预留故障信息', value: "--" };
	B98 = { name: '预留故障信息', value: "--" };
	B100 = { name: '预留故障信息', value: "--" };
	B102 = { name: '预留故障信息', value: "--" };
	B104 = { name: '预留故障信息', value: "--" };
	B106 = { name: '预留故障信息', value: "--" };
	B108 = { name: '预留故障信息', value: "--" };
	B110 = { name: '预留故障信息', value: "--" };
	B112 = { name: '预留故障信息', value: "--" };
	B114 = { name: '预留故障信息', value: "--" };
	B116 = { name: '预留故障信息', value: "--" };
	B118 = { name: '预留故障信息', value: "--" };
	B120 = { name: '当前故障 3-故障码', value: "--" };
	B122 = { name: '故障信息 1-电池簇总压', value: "--" };
	B124 = { name: '故障信息 2-电池簇电流', value: "--" };
	B126 = { name: '故障信息 3-电池簇 SOC', value: "--" };
	B128 = { name: '故障信息 4-绝缘电值', value: "--" };
	B130 = { name: '故障信息 5-最大电压', value: "--" };
	B132 = { name: '故障信息 6-最大电压节号', value: "--" };
	B134 = { name: '故障信息 7-最小电压', value: "--" };
	B136 = { name: '故障信息8-最小电压节号', value: "--" };
	B138 = { name: '故障信息9-最大温度', value: "--" };
	B140 = { name: '故障信息 10-最大温度节号', value: "--" };
	B142 = { name: '故障信息 11-最小温度', value: "--" };
	B144 = { name: '故障信息 12-最小温度节号', value: "--" };
	B146 = { name: '故障信息 13-DO 状态', value: "--" };
	B148 = { name: '故障信息 14-DI 状态', value: "--" };
	B150 = { name: '故障信息 15-年', value: "--" };
	B151 = { name: '故障信息 15-月', value: "--" };
	B152 = { name: '故障信息 16-日', value: "--" };
	B153 = { name: '故障信息 16-时', value: "--" };
	B154 = { name: '故障信息 17-分', value: "--" };
	B155 = { name: '故障信息 17-秒', value: "--" };
	B156 = { name: '预留故障信息', value: "--" };
	B158 = { name: '预留故障信息', value: "--" };
	B160 = { name: '预留故障信息', value: "--" };
	B162 = { name: '预留故障信息', value: "--" };
	B164 = { name: '预留故障信息', value: "--" };
	B166 = { name: '预留故障信息', value: "--" };
	B168 = { name: '预留故障信息', value: "--" };
	B170 = { name: '预留故障信息', value: "--" };
	B172 = { name: '预留故障信息', value: "--" };
	B174 = { name: '预留故障信息', value: "--" };
	B176 = { name: '预留故障信息', value: "--" };
	B178 = { name: '预留故障信息', value: "--" };










}

export class ControlData {
	constructor() {
		this.B128 = { name: '电池簇 SOC', value: "--" };
	}
}

