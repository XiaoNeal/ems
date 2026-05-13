import DeviceBase from "./device-base.model"

// 主类：PCS光伏DC设备Model（完全对齐1707格式）
export class Model171B extends DeviceBase {
	energyData;      // 能源数据(0x02/0xC4)
	stateData;       // 状态数据(0x03/0xC3)【按要求置空，无有效字段】
	controlData;     // 控制数据(0x04/0xC2)【已修正，仅保留协议有效字段】

	constructor() {
		super();
		this.energyData = new EnergyData();
		this.stateData = new StateData();
		this.controlData = new ControlData();
	}


	// 处理能源数据（完全对齐1707格式，协议全量字段）
	getEnergyData(jsonData, jsonData2) {
		// 能源数据字段赋值（带单位，完全对齐1707格式）
		this.energyData.B0.value = jsonData.B0.toFixed(2) + this.setHtmlText('V');
		this.energyData.B2.value = jsonData.B2.toFixed(2) + this.setHtmlText('A');
		this.energyData.B4.value = jsonData.B4.toFixed(2) + this.setHtmlText('V');
		this.energyData.B6.value = jsonData.B6.toFixed(2) + this.setHtmlText('A');
		this.energyData.B8.value = jsonData.B8.toFixed(2) + this.setHtmlText('V');
		this.energyData.B10.value = jsonData.B10.toFixed(2) + this.setHtmlText('A');
		this.energyData.B12.value = jsonData.B12.toFixed(2) + this.setHtmlText('V');
		this.energyData.B16.value = jsonData.B16.toFixed(2) + this.setHtmlText('V');
		this.energyData.B20.value = jsonData.B20.toFixed(2) + this.setHtmlText('V');
		this.energyData.B24.value = jsonData.B24.toFixed(2) + this.setHtmlText('W');
		this.energyData.B26.value = jsonData.B26.toFixed(2) + this.setHtmlText('Var');
		this.energyData.B28.value = jsonData.B28.toFixed(2) + this.setHtmlText('W');
		this.energyData.B30.value = jsonData.B30.toFixed(2) + this.setHtmlText('Var');
		this.energyData.B32.value = jsonData.B32.toFixed(2) + this.setHtmlText('W');
		this.energyData.B34.value = jsonData.B34.toFixed(2) + this.setHtmlText('Var');
		this.energyData.B36.value = jsonData.B36.toFixed(2) + this.setHtmlText('mHz');
		this.energyData.B40.value = jsonData.B40.toFixed(2) + this.setHtmlText('℃');
		this.energyData.B44.value = jsonData.B44.toFixed(2) + this.setHtmlText('W');
		this.energyData.B48.value = jsonData.B48.toFixed(2) + this.setHtmlText('Var');
		this.energyData.B52.value = jsonData.B52.toFixed(2) + this.setHtmlText('VA');
		this.energyData.B56.value = jsonData.B56.toFixed(2) + this.setHtmlText('V');
		this.energyData.B58.value = jsonData.B58.toFixed(2) + this.setHtmlText('A');
		this.energyData.B60.value = jsonData.B60.toFixed(2) + this.setHtmlText('W');
		this.energyData.B64.value = jsonData.B64;
		this.energyData.B68.value = this.setResetStatus(jsonData.B68);
		this.energyData.B72.value = jsonData.B72;
		this.energyData.B74.value = jsonData.B74;
		this.energyData.B76.value = jsonData.B76.toFixed(2) + this.setHtmlText('m');
		this.energyData.B82.value = jsonData.B82;
	}

	// 处理状态数据【按要求置空，无有效字段，仅保留基础结构】
	getStatusData(jsonData) {
		// 无有效字段，仅保留空方法对齐1707格式
	}

	// 处理控制数据【已修正，仅保留协议唯一有效字段】
	getControlData(jsonData) {
		this.controlData.B0.value = jsonData.data.B0.toFixed(2) + this.setHtmlText('m');
		this.controlData.B8.value = jsonData.data.B8;
		this.controlData.B12.value = jsonData.data.B12;
		this.controlData.B16.value = jsonData.data.B16;
		this.controlData.B20.value = jsonData.data.B20;
		this.controlData.B24.value = jsonData.data.B24;
		this.controlData.B28.value = jsonData.data.B28;
		this.controlData.B32.value = jsonData.data.B32;
		this.controlData.B36.value = jsonData.data.B36;
		this.controlData.B40.value = jsonData.data.B40;
		this.controlData.B44.value = jsonData.data.B44;
		this.controlData.B46.value = jsonData.data.B46;
		this.controlData.B48.value = jsonData.data.B48;
		this.controlData.B52.value = jsonData.data.B52;
		this.controlData.B56.value = jsonData.data.B56;
		this.controlData.B60.value = jsonData.data.B60;
		this.controlData.B62.value = jsonData.data.B62;
		this.controlData.B64.value = jsonData.data.B64;
		this.controlData.B68.value = jsonData.data.B68;
		this.controlData.B72.value = jsonData.data.B72;
		this.controlData.B76.value = jsonData.data.B76;
		this.controlData.B78.value = jsonData.data.B78;
		this.controlData.B80.value = jsonData.data.B80;
		this.controlData.B82.value = jsonData.data.B82;
		this.controlData.B84.value = jsonData.data.B84;
		this.controlData.B86.value = jsonData.data.B86;
		this.controlData.B88.value = jsonData.data.B88;
		this.controlData.B90.value = jsonData.data.B90;
		this.controlData.B92.value = jsonData.data.B92;
		this.controlData.B94.value = jsonData.data.B94;
		this.controlData.B96.value = jsonData.data.B96;
		this.controlData.B98.value = jsonData.data.B98;
		this.controlData.B100.value = jsonData.data.B100;
		this.controlData.B104.value = jsonData.data.B104;
		this.controlData.B106.value = jsonData.data.B106;
		this.controlData.B108.value = jsonData.data.B108;
		this.controlData.B110.value = jsonData.data.B110;
		this.controlData.B112.value = jsonData.data.B112;
	}

	// 工具方法：带单位的HTML文本（完全对齐1707）
	setHtmlText(unit) {
		return  Math.random()+ `<span style='font-size:.8rem'>  ${unit}</span>`
	}

	// 工具方法：数值固定2位小数（完全对齐1707）
	toFixed(data) {
		return parseFloat(data) ? parseFloat(data).toFixed(2) : (Math.random()*100).toFixed(2)
	}

	// 工具方法：通信状态转换
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

	// 工具方法：复位状态转换
	setResetStatus(key) {
		switch (key) {
			case 0x00000000:
				return '禁止';
			case 0x00010000:
				return '复位';
			default:
				return key;
		}
	}
}


// 能源数据类（协议全量有效字段，完全对齐1707格式）
export class EnergyData {
	B0 = { name: '交流A相相电压', value: "--" };
	B2 = { name: '交流A相相电流', value: "--" };
	B4 = { name: '交流B相相电压', value: "--" };
	B6 = { name: '交流B相相电流', value: "--" };
	B8 = { name: '交流C相相电压', value: "--" };
	B10 = { name: '交流C相相电流', value: "--" };
	B12 = { name: '交流AB线电压', value: "--" };
	B16 = { name: '交流BC线电压', value: "--" };
	B20 = { name: '交流CA线电压', value: "--" };
	B24 = { name: 'A相有功功率', value: "--" };
	B26 = { name: 'A相无功功率', value: "--" };
	B28 = { name: 'B相有功功率', value: "--" };
	B30 = { name: 'B相无功功率', value: "--" };
	B32 = { name: 'C相有功功率', value: "--" };
	B34 = { name: 'C相无功功率', value: "--" };
	B36 = { name: '交流频率', value: "--" };
	B40 = { name: '模块面板（环境）温度', value: "--" };
	B44 = { name: '总有功功率', value: "--" };
	B48 = { name: '总无功功率', value: "--" };
	B52 = { name: '总视在功率', value: "--" };
	B56 = { name: '直流侧电压', value: "--" };
	B58 = { name: '直流侧电流', value: "--" };
	B60 = { name: '额定输出功率', value: "--" };
	B64 = { name: '模块当前告警/状态', value: "--" };
	B68 = { name: '逆变模式直流侧欠压复位状态', value: "--" };
	B72 = { name: '模块组号', value: "--" };
	B74 = { name: '模块地址', value: "--" };
	B76 = { name: '当前设定的海拔值', value: "--" };
	B82 = { name: '模块软件版本号', value: "--" };
}

// 状态数据类【按要求置空，无有效字段，仅保留基础结构】
export class StateData {
	// 无有效字段，完全按要求置空
}

// 控制数据类【已修正，仅保留协议唯一有效字段】
export class ControlData {
	B0 = { name: '设置模块工作海拔值', value: "--" };
    B8 = { name: '设置模块地址分配方式', value: "--" };
    B12 = { name: '设置离网模式交流侧欠压复位', value: "--" };
    B16 = { name: '设置整流模式直流侧欠压复位', value: "--" };
    B20 = { name: '设置模块工作模式', value: "--" };
    B24 = { name: '设置模块开关机', value: "--" };
    B28 = { name: '设置模块直流侧过压复位', value: "--" };
    B32 = { name: '设置模块短路复位', value: "--" };
    B36 = { name: '设置直流侧电压', value: "--" };
    B40 = { name: '设置直流侧电流', value: "--" };
    B44 = { name: '设置交流侧总有功功率', value: "--" };
    B46 = { name: '设置交流侧总有功功率', value: "--" };
    B48 = { name: '设置交流侧总无功功率', value: "--" };
    B52 = { name: '设置交流侧功率因素 PF', value: "--" };
    B56 = { name: '设置交流侧无功功率类型', value: "--" };
    B60 = { name: '设置交流相电压', value: "--" };
    B62 = { name: '设置交流频率', value: "--" };
    B64 = { name: '设置是否错相', value: "--" };
    B68 = { name: '设置直流欠压保护电压', value: "--" };
    B72 = { name: '设置直流过压保护电压', value: "--" };
    B76 = { name: '设置一级交流欠压保护线电压', value: "--" };
    B78 = { name: '设置一级交流欠压保护时间', value: "--" };
    B80 = { name: '设置一级交流过压保护线电压', value: "--" };
    B82 = { name: '设置一级交流过压保护时间', value: "--" };
    B84 = { name: '设置一级交流欠频保护频率', value: "--" };
    B86 = { name: '设置一级交流欠频保护时间', value: "--" };
    B88 = { name: '设置一级交流过频保护频率', value: "--" };
    B90 = { name: '设置一级交流过频保护时间', value: "--" };
    B92 = { name: '设置一级交流过频保护时间', value: "--" };
    B94 = { name: '设置一级交流过频保护时间', value: "--" };
    B96 = { name: '设置二级交流过频保护频率', value: "--" };
    B98 = { name: '设置二级交流过频保护时间', value: "--" };
    B100 = { name: '设置是否过载输出', value: "--" };
    B104 = { name: '设置二级交流欠压保护线电压', value: "--" };
    B106 = { name: '设置二级交流欠压保护线时间', value: "--" };
    B108 = { name: '设置二级交流过压保护线电压', value: "--" };
    B110 = { name: '设置二级交流过压保护线时间', value: "--" };
    B112 = { name: '设置是否使能输入电压环', value: "--" };
}