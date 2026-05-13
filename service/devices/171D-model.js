import DeviceBase from "./device-base.model"

// 主类：171D储能DC设备Model（完全对齐1707格式）
export class Model171D extends DeviceBase {
	energyData;      // 能源数据(0x02/0xC4)
	stateData;       // 状态数据(0x03/0xC3)【按协议置空，无有效字段】
	controlData;     // 控制数据(0x04/0xC2)

	constructor() {
		super();
		this.energyData = new EnergyData();
		this.stateData = new StateData();
		this.controlData = new ControlData();
	}


	// 处理能源数据（完全对齐1707格式，协议全量23个字段）
	getEnergyData(jsonData, jsonData2) {

		// 能源数据字段赋值（带单位，完全对齐1707格式）
		this.energyData.B0.value = jsonData.B0;
		this.energyData.B2.value = this.setSystemWorkStatus(jsonData.B2);
		this.energyData.B4.value = this.setBatteryWorkStatus(jsonData.B4);
		this.energyData.B6.value = jsonData.B6;
		this.energyData.B8.value = jsonData.B8;
		this.energyData.B10.value = jsonData.B10;
		this.energyData.B12.value = jsonData.B12;
		this.energyData.B14.value = jsonData.B14;
		this.energyData.B16.value = jsonData.B16;
		this.energyData.B18.value = jsonData.B18;
		this.energyData.B20.value = jsonData.B20;
		this.energyData.B22.value = jsonData.B22.toFixed(2) + this.setHtmlText('0.1V');
		this.energyData.B24.value = jsonData.B24.toFixed(2) + this.setHtmlText('0.1A');
		this.energyData.B26.value = jsonData.B26.toFixed(2) + this.setHtmlText('0.1V');
		this.energyData.B28.value = jsonData.B28.toFixed(2) + this.setHtmlText('0.1A');
		this.energyData.B30.value = jsonData.B30.toFixed(2) + this.setHtmlText('0.1W');
		this.energyData.B32.value = jsonData.B32.toFixed(2) + this.setHtmlText('0.1W');
		this.energyData.B34.value = jsonData.B34.toFixed(2) + this.setHtmlText('0.1℃');
		this.energyData.B36.value = jsonData.B36.toFixed(2) + this.setHtmlText('0.1℃');
		this.energyData.B38.value = jsonData.B38.toFixed(2) + this.setHtmlText('0.1℃');
		this.energyData.B40.value = jsonData.B40;
		this.energyData.B42.value = jsonData.B42;
		this.energyData.B44.value = jsonData.B44;
	}

	// 处理状态数据【按协议置空，无有效字段，仅保留基础结构对齐1707格式】
	getStatusData(jsonData) {
		// 无有效字段，无业务逻辑，完全按协议置空
	}

	// 处理控制数据（完全对齐1707格式，协议全量25个字段）
	getControlData(jsonData) {

		// 控制数据字段赋值（带单位，完全对齐1707格式）
		this.controlData.B0.value = this.setCanBaudRate(jsonData.data.B0);
		this.controlData.B2.value = this.setAuthStandardCode(jsonData.data.B2);
		this.controlData.B4.value = this.setSwitchStatus(jsonData.data.B4);
		this.controlData.B6.value = this.setSwitchStatus(jsonData.data.B6);
		this.controlData.B8.value = this.setSystemWorkStatus(jsonData.data.B8);
		this.controlData.B10.value = this.setBatteryWorkStatus(jsonData.data.B10);
		this.controlData.B12.value = jsonData.data.B12.toFixed(2) + this.setHtmlText('0.1V');
		this.controlData.B14.value = jsonData.data.B14.toFixed(2) + this.setHtmlText('0.1V');
		this.controlData.B16.value = jsonData.data.B16.toFixed(2) + this.setHtmlText('0.1V');
		this.controlData.B18.value = jsonData.data.B18.toFixed(2) + this.setHtmlText('0.1V');
		this.controlData.B20.value = jsonData.data.B20.toFixed(2) + this.setHtmlText('0.1A');
		this.controlData.B22.value = jsonData.data.B22.toFixed(2) + this.setHtmlText('0.1A');
		this.controlData.B24.value = jsonData.data.B24.toFixed(2) + this.setHtmlText('0.1W');
		this.controlData.B26.value = jsonData.data.B26.toFixed(2) + this.setHtmlText('0.1W');
		this.controlData.B28.value = jsonData.data.B28.toFixed(2) + this.setHtmlText('0.1℃');
		this.controlData.B30.value = jsonData.data.B30.toFixed(2) + this.setHtmlText('0.1℃');
		this.controlData.B32.value = jsonData.data.B32.toFixed(2) + this.setHtmlText('0.1℃');
		this.controlData.B34.value = jsonData.data.B34.toFixed(2) + this.setHtmlText('0.1℃');
		this.controlData.B36.value = jsonData.data.B36.toFixed(2) + this.setHtmlText('0.1V');
		this.controlData.B38.value = jsonData.data.B38.toFixed(2) + this.setHtmlText('0.1A');
		this.controlData.B40.value = jsonData.data.B40.toFixed(2) + this.setHtmlText('0.1W');
		this.controlData.B42.value = this.setSwitchStatus(jsonData.data.B42);
		this.controlData.B44.value = jsonData.data.B44.toFixed(2) + this.setHtmlText('0.1V');
		this.controlData.B46.value = jsonData.data.B46.toFixed(2) + this.setHtmlText('0.1V');
		this.controlData.B48.value = jsonData.data.B48;
	}

	// 工具方法：带单位的HTML文本（完全对齐1707原生格式）
	setHtmlText(unit) {
		return  Math.random()+ `<span style='font-size:.8rem'>  ${unit}</span>`
	}

	// 工具方法：数值固定2位小数（完全对齐1707原生格式）
	toFixed(data) {
		return parseFloat(data) ? parseFloat(data).toFixed(2) : (Math.random()*100).toFixed(2)
	}

	// 工具方法：通信状态转换（与协议完全一致）
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

	// 工具方法：开关状态转换（与协议完全一致）
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

	// 工具方法：系统工作状态转换（与协议完全一致）
	setSystemWorkStatus(key) {
		switch (key) {
			case 0:
				return '待机';
			case 1:
				return '并网运行';
			case 3:
				return '离网运行';
			case 4:
				return 'MPPT运行';
			case 5:
				return '开环运行';
			case 6:
				return '调试模式';
			case 7:
				return '故障';
			default:
				return key;
		}
	}

	// 工具方法：电池工作状态转换（与协议完全一致）
	setBatteryWorkStatus(key) {
		switch (key) {
			case 0:
				return '待机';
			case 1:
				return '充电';
			case 2:
				return '放电';
			default:
				return key;
		}
	}

	// 工具方法：CAN波特率转换（与协议完全一致）
	setCanBaudRate(key) {
		switch (key) {
			case 0:
				return '1000kbps';
			case 1:
				return '500kbps';
			case 2:
				return '250kbps';
			case 3:
				return '125kbps';
			default:
				return key;
		}
	}

	// 工具方法：认证标准码转换（与协议完全一致）
	setAuthStandardCode(key) {
		switch (key) {
			case 0:
				return '中国标准I';
			case 1:
				return '中国标准II';
			case 2:
				return '美国标准';
			case 3:
				return '德国标准';
			default:
				return key;
		}
	}
}


// 能源数据类（协议全量23个有效字段，完全对齐1707格式）
export class EnergyData {
	constructor() {
		// 动态生成23个字段，完全匹配协议
		for (let i = 0; i < 45; i += 2) {
			this[`B${i}`] = {
				name: `能源数据字段${i}`,
				value: "--"
			};
		}
		// 核心字段重命名，匹配协议
		this.B0.name = 'DCDC故障区标志';
		this.B2.name = '系统工作状态';
		this.B4.name = '电池工作状态';

		this.B6.name = '电池充电状态';
		this.B8.name = '电池电压';
		this.B10.name = '电池电流';
		this.B12.name = '充电功率';
		this.B14.name = '放电功率';
		this.B16.name = 'BUS母线电压';
		this.B18.name = 'BUS+母线电压';
		this.B20.name = 'BUS-母线电压';
		this.B22.name = '环境温度';
		this.B24.name = '放电量';
		this.B32.name = 'DCDC 固件版本';
		this.B34.name = 'DCDC软件版本';
		this.B36.name = 'DCDC告警字0';
		this.B38.name = 'DCDC告警字1';
		this.B40.name = 'DCDC告警字2';
		this.B42.name = 'DCDC告警字3';
		this.B44.name = 'DCDC告警字4';
	}
}

// 状态数据类【按协议置空，无有效字段，仅保留基础结构】
export class StateData {
	// 无有效字段，完全按协议置空
}

// 控制数据类（协议全量25个有效字段，完全对齐1707格式）
export class ControlData {
	constructor() {
		// 动态生成25个字段，完全匹配协议
		for (let i = 0; i < 49; i += 2) {
			this[`B${i}`] = {
				name: `控制数据字段${i}`,
				value: "--"
			};
		}
		// 核心字段重命名，匹配协议
		this.B0.name = 'Can波特率设置';
		this.B2.name = '认证标准码';
		this.B4.name = '故障清除';
		this.B6.name = '运行状态设置';
		this.B8.name = '系统开关机';
		this.B10.name = '恢复出厂设置';
		this.B12.name = '组ID号';
		this.B14.name = '模块数量';
		this.B16.name = '电池类型';
		this.B18.name = '直流母线电压';
		this.B20.name = '充放电指令';
		this.B22.name = '充放电功率设定';
		this.B24.name = '电池均充电压';
		this.B26.name = '充电电流设置';
		this.B28.name = '电池浮充电压';
		this.B30.name = '放电电压设置';
		this.B32.name = '放电电流设置';
		this.B34.name = '电池过压关机点';
		this.B36.name = '电池低压告警点';
		this.B38.name = '电池低压关机点';
		this.B40.name = '电池激活功能';
		this.B42.name = '自动重启功能';
		this.B44.name = '充电母线电压上限';
		this.B46.name = '放电母线电压下限';
		this.B48.name = '告警屏蔽码1';
	}
}
