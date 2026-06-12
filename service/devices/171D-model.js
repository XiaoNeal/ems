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

		console.log(jsonData,'171D',"---------------------------");

		// 能源数据字段赋值（带单位，完全对齐1707格式）
		this.energyData.B0.value = this.setFaultZoneStatus(jsonData.B0);
		this.energyData.B2.value = this.setSystemWorkStatus(jsonData.B2);
		this.energyData.B4.value = this.setBatteryWorkStatus(jsonData.B4);
		this.energyData.B6.value = this.setBatteryChargeStatus(jsonData.B6);
		this.energyData.B8.value = jsonData.B8;
		this.energyData.B10.value = jsonData.B10;
		this.energyData.B12.value = (jsonData.B12 / 1000) //+ this.setHtmlText('kW');
		this.energyData.B14.value = (jsonData.B14 / 1000) //+ this.setHtmlText('kW');
		this.energyData.B16.value = jsonData.B16;
		this.energyData.B18.value = jsonData.B18;
		this.energyData.B20.value = jsonData.B20;
		this.energyData.B22.value = jsonData.B22;
		this.energyData.B24.value = jsonData.B24;
		// this.energyData.B26.value = jsonData.B26;
		this.energyData.B28.value = jsonData.B28;
		// this.energyData.B30.value = jsonData.B30;
		this.energyData.B32.value = jsonData.B32;
		this.energyData.B34.value = jsonData.B34;
		this.energyData.B36.value = jsonData.B36;
		// this.energyData.B38.value = jsonData.B38;
		// this.energyData.B40.value = jsonData.B40;
		// this.energyData.B42.value = jsonData.B42;
		// this.energyData.B44.value = jsonData.B44;

		// 处理告警位字段 B40-B49
		this.energyData.B40b0.value = this.setAlarmStatus(jsonData.B40b0);
		this.energyData.B40b1.value = this.setAlarmStatus(jsonData.B40b1);
		this.energyData.B40b2.value = this.setAlarmStatus(jsonData.B40b2);
		this.energyData.B40b3.value = this.setAlarmStatus(jsonData.B40b3);
		this.energyData.B40b4.value = this.setAlarmStatus(jsonData.B40b4);
		this.energyData.B40b5.value = this.setAlarmStatus(jsonData.B40b5);
		this.energyData.B40b6.value = this.setAlarmStatus(jsonData.B40b6);
		this.energyData.B40b7.value = this.setAlarmStatus(jsonData.B40b7);

		this.energyData.B41b0.value = this.setAlarmStatus(jsonData.B41b0);
		this.energyData.B41b1.value = this.setAlarmStatus(jsonData.B41b1);
		this.energyData.B41b2.value = this.setAlarmStatus(jsonData.B41b2);
		this.energyData.B41b3.value = this.setAlarmStatus(jsonData.B41b3);
		this.energyData.B41b4.value = this.setAlarmStatus(jsonData.B41b4);
		this.energyData.B41b5.value = this.setAlarmStatus(jsonData.B41b5);
		this.energyData.B41b6.value = this.setAlarmStatus(jsonData.B41b6);
		this.energyData.B41b7.value = this.setAlarmStatus(jsonData.B41b7);

		this.energyData.B42b0.value = this.setAlarmStatus(jsonData.B42b0);
		this.energyData.B42b1.value = this.setAlarmStatus(jsonData.B42b1);
		// this.energyData.B42b2.value = this.setAlarmStatus(jsonData.B42b2);
		// this.energyData.B42b3.value = this.setAlarmStatus(jsonData.B42b3);
		// this.energyData.B42b4.value = this.setAlarmStatus(jsonData.B42b4);
		this.energyData.B42b5.value = this.setAlarmStatus(jsonData.B42b5);
		// this.energyData.B42b6.value = this.setAlarmStatus(jsonData.B42b6);
		this.energyData.B42b7.value = this.setAlarmStatus(jsonData.B42b7);

		this.energyData.B43b0.value = this.setAlarmStatus(jsonData.B43b0);
		this.energyData.B43b1.value = this.setAlarmStatus(jsonData.B43b1);
		this.energyData.B43b2.value = this.setAlarmStatus(jsonData.B43b2);
		this.energyData.B43b3.value = this.setAlarmStatus(jsonData.B43b3);
		this.energyData.B43b4.value = this.setAlarmStatus(jsonData.B43b4);
		this.energyData.B43b5.value = this.setAlarmStatus(jsonData.B43b5);
		this.energyData.B43b6.value = this.setAlarmStatus(jsonData.B43b6);
		this.energyData.B43b7.value = this.setAlarmStatus(jsonData.B43b7);

		this.energyData.B44b0.value = this.setAlarmStatus(jsonData.B44b0);
		this.energyData.B44b1.value = this.setAlarmStatus(jsonData.B44b1);
		this.energyData.B44b2.value = this.setAlarmStatus(jsonData.B44b2);
		this.energyData.B44b3.value = this.setAlarmStatus(jsonData.B44b3);
		this.energyData.B44b4.value = this.setAlarmStatus(jsonData.B44b4);
		this.energyData.B44b5.value = this.setAlarmStatus(jsonData.B44b5);
		this.energyData.B44b6.value = this.setAlarmStatus(jsonData.B44b6);
		this.energyData.B44b7.value = this.setAlarmStatus(jsonData.B44b7);

		this.energyData.B45b0.value = this.setAlarmStatus(jsonData.B45b0);
		this.energyData.B45b1.value = this.setAlarmStatus(jsonData.B45b1);
		this.energyData.B45b2.value = this.setAlarmStatus(jsonData.B45b2);
		this.energyData.B45b3.value = this.setAlarmStatus(jsonData.B45b3);
		this.energyData.B45b4.value = this.setAlarmStatus(jsonData.B45b4);
		this.energyData.B45b5.value = this.setAlarmStatus(jsonData.B45b5);
		this.energyData.B45b6.value = this.setAlarmStatus(jsonData.B45b6);
		this.energyData.B45b7.value = this.setAlarmStatus(jsonData.B45b7);

		this.energyData.B46b0.value = this.setAlarmStatus(jsonData.B46b0);
		this.energyData.B46b1.value = this.setAlarmStatus(jsonData.B46b1);
		this.energyData.B46b2.value = this.setAlarmStatus(jsonData.B46b2);
		this.energyData.B46b3.value = this.setAlarmStatus(jsonData.B46b3);
		this.energyData.B46b4.value = this.setAlarmStatus(jsonData.B46b4);
		this.energyData.B46b5.value = this.setAlarmStatus(jsonData.B46b5);
		this.energyData.B46b6.value = this.setAlarmStatus(jsonData.B46b6);
		this.energyData.B46b7.value = this.setAlarmStatus(jsonData.B46b7);

		this.energyData.B47b0.value = this.setAlarmStatus(jsonData.B47b0);
		this.energyData.B47b1.value = this.setAlarmStatus(jsonData.B47b1);
		this.energyData.B47b2.value = this.setAlarmStatus(jsonData.B47b2);
		this.energyData.B47b3.value = this.setAlarmStatus(jsonData.B47b3);
		this.energyData.B47b4.value = this.setAlarmStatus(jsonData.B47b4);
		this.energyData.B47b5.value = this.setAlarmStatus(jsonData.B47b5);
		this.energyData.B47b6.value = this.setAlarmStatus(jsonData.B47b6);
		this.energyData.B47b7.value = this.setAlarmStatus(jsonData.B47b7);

		this.energyData.B48b0.value = this.setAlarmStatus(jsonData.B48b0);
		this.energyData.B48b1.value = this.setAlarmStatus(jsonData.B48b1);
		this.energyData.B48b2.value = this.setAlarmStatus(jsonData.B48b2);
		this.energyData.B48b3.value = this.setAlarmStatus(jsonData.B48b3);
		this.energyData.B48b4.value = this.setAlarmStatus(jsonData.B48b4);
		this.energyData.B48b5.value = this.setAlarmStatus(jsonData.B48b5);
		this.energyData.B48b6.value = this.setAlarmStatus(jsonData.B48b6);
		this.energyData.B48b7.value = this.setAlarmStatus(jsonData.B48b7);

		this.energyData.B49b0.value = this.setAlarmStatus(jsonData.B49b0);
		this.energyData.B49b1.value = this.setAlarmStatus(jsonData.B49b1);
		this.energyData.B49b2.value = this.setAlarmStatus(jsonData.B49b2);
		this.energyData.B49b3.value = this.setAlarmStatus(jsonData.B49b3);
		this.energyData.B49b4.value = this.setAlarmStatus(jsonData.B49b4);
		this.energyData.B49b5.value = this.setAlarmStatus(jsonData.B49b5);
		this.energyData.B49b6.value = this.setAlarmStatus(jsonData.B49b6);
		this.energyData.B49b7.value = this.setAlarmStatus(jsonData.B49b7);
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
		return Math.random() + `<span style='font-size:.8rem'>  ${unit}</span>`
	}

	// 工具方法：数值固定2位小数（完全对齐1707原生格式）
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

	// 工具方法：故障区标志转换（与协议完全一致）
	setFaultZoneStatus(key) {
		switch (key) {
			case 0:
				return '故障区无故障置起';
			case 1:
				return '故障区有故障置起';
			default:
				return key;
		}
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
			case 2:
				return '预留';
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

	// 工具方法：电池充电状态转换（与协议完全一致）
	setBatteryChargeStatus(key) {
		switch (key) {
			case 0:
				return '待机';
			case 1:
				return '恒流';
			case 2:
				return '恒功率';
			case 3:
				return '恒压';
			case 4:
				return '浮充';
			case 5:
				return '充满';
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
		this.B0 = { name: 'DCDC故障区标志', value: "--" };
		this.B2 = { name: '系统工作状态', value: "--" };
		this.B4 = { name: '电池工作状态', value: "--" };
		this.B6 = { name: '电池充电状态', value: "--" };
		this.B8 = { name: '电池电压', value: "--" };
		this.B10 = { name: '电池电流', value: "--" };
		this.B12 = { name: '充电功率(kW)', value: "--" };
		this.B14 = { name: '放电功率(kW)', value: "--" };
		this.B16 = { name: 'BUS母线电压', value: "--" };
		this.B18 = { name: 'BUS+母线电压', value: "--" };
		this.B20 = { name: 'BUS-母线电压', value: "--" };
		this.B22 = { name: '环境温度', value: "--" };
		this.B24 = { name: '放电量', value: "--" };
		this.B28 = { name: '充电量', value: "--" };
		this.B32 = { name: '协议版本', value: "--" };
		this.B34 = { name: 'DCDC 固件版本', value: "--" };
		this.B36 = { name: 'DCDC软件版本', value: "--" };

		this.B40b0 = { name: '电池过压告警', value: "--" };
		this.B40b1 = { name: '电池过压关机', value: "--" };
		this.B40b2 = { name: '电池快速过压', value: "--" };
		this.B40b3 = { name: '电池欠压告警', value: "--" };
		this.B40b4 = { name: '电池欠压关机', value: "--" };
		this.B40b5 = { name: '电池快速欠压', value: "--" };
		this.B40b6 = { name: '电池输入短路', value: "--" };
		this.B40b7 = { name: '充放电过流', value: "--" };

		this.B41b0 = { name: '充放电快速过流', value: "--" };
		this.B41b1 = { name: '充放电硬件过流', value: "--" };
		this.B41b2 = { name: '电池未接', value: "--" };
		this.B41b3 = { name: '电池反接', value: "--" };
		this.B41b4 = { name: 'BUS3 过压', value: "--" };
		this.B41b5 = { name: 'BUS3 快速过压', value: "--" };
		this.B41b6 = { name: 'BUS3 欠压', value: "--" };
		this.B41b7 = { name: 'BUS3 快速欠压', value: "--" };


		this.B42b0 = { name: 'BUS2过压', value: "--" };
		this.B42b1 = { name: 'BUS2快速过压', value: "--" };
		// this.B42b2 = { name: '预留', value: "--" };
		// this.B42b3 = { name: '预留', value: "--" };
		// this.B42b4 = { name: '预留', value: "--" };
		this.B42b5 = { name: 'BUS2欠压', value: "--" };
		// this.B42b6 = { name: '预留', value: "--" };
		this.B42b7 = { name: 'BUS1+过压', value: "--" };


		this.B43b0 = { name: 'BUS1+快速过压', value: "--" };
		this.B43b1 = { name: 'BUS1-过压', value: "--" };
		this.B43b2 = { name: 'BUS1-快速过压', value: "--" };
		this.B43b3 = { name: 'BUS1电压不平衡', value: "--" };
		this.B43b4 = { name: 'BUS1+快速欠压', value: "--" };
		this.B43b5 = { name: 'BUS1-快速欠压', value: "--" };
		this.B43b6 = { name: 'BUS+母线过压', value: "--" };
		this.B43b7 = { name: 'BUS+母线快速过压', value: "--" };

		this.B44b0 = { name: 'BUS-母线过压', value: "--" };
		this.B44b1 = { name: 'BUS-母线快速过压', value: "--" };
		this.B44b2 = { name: 'BUS母线电压不平衡', value: "--" };
		this.B44b3 = { name: 'BUS母线未接', value: "--" };
		this.B44b4 = { name: 'BUS母线反接', value: "--" };
		this.B44b5 = { name: 'BUS母线短路', value: "--" };
		this.B44b6 = { name: 'BUS母线欠压关机', value: "--" };
		this.B44b7 = { name: 'BUS+母线快速欠压', value: "--" };
		

		this.B45b0 = { name: 'BUS-母线快速欠压', value: "--" };
		this.B45b1 = { name: 'DCDC1过流', value: "--" };
		this.B45b2 = { name: 'DCDC1快速过流', value: "--" };
		this.B45b3 = { name: 'DCDC1硬件过流', value: "--" };
		this.B45b4 = { name: 'DCDC2过流', value: "--" };
		this.B45b5 = { name: 'DCDC2快速过流', value: "--" };
		this.B45b6 = { name: 'DCDC2硬件过流', value: "--" };
		this.B45b7 = { name: 'DCDC3过流', value: "--" };

		this.B46b0 = { name: 'DCDC3快速过流', value: "--" };
		this.B46b1 = { name: 'DCDC3硬件过流', value: "--" };
		this.B46b2 = { name: 'DCDC不均流', value: "--" };
		this.B46b3 = { name: 'BUS1+硬件过压', value: "--" };
		this.B46b4 = { name: '谐振电感A1硬件过流', value: "--" };
		this.B46b5 = { name: 'BUS1-硬件过压', value: "--" };
		this.B46b6 = { name: '谐振电感A2硬件过流', value: "--" };
		this.B46b7 = { name: '过载110%', value: "--" };

		this.B47b0 = { name: '过载125%', value: "--" };
		this.B47b1 = { name: 'BuckBoost 软启故障', value: "--" };
		this.B47b2 = { name: 'DCDC母线软启故障', value: "--" };
		this.B47b3 = { name: 'DCDC电池软启故障', value: "--" };
		this.B47b4 = { name: 'BAT散热器过温', value: "--" };
		this.B47b5 = { name: 'DCDC原边过温', value: "--" };
		this.B47b6 = { name: 'DCDC副边过温', value: "--" };
		this.B47b7 = { name: 'DCDC环境过温', value: "--" };


		this.B48b0 = { name: '辅助电源故障', value: "--" };
		this.B48b1 = { name: 'DCDC功率降额', value: "--" };
		this.B48b2 = { name: 'DCDC风扇A故障', value: "--" };
		this.B48b3 = { name: 'DCDC风扇B故障', value: "--" };
		this.B48b4 = { name: 'E2PROM读故障', value: "--" };
		this.B48b5 = { name: 'E2PROM写故障', value: "--" };
		this.B48b6 = { name: 'DCDC心跳检测异常', value: "--" };
		this.B48b7 = { name: 'DCDC软件版本错误', value: "--" };


		this.B49b0 = { name: '监控CANA通讯故障', value: "--" };
		this.B49b1 = { name: '并机CANB通讯故障', value: "--" };
		this.B49b2 = { name: 'SPI通讯故障', value: "--" };
		this.B49b3 = { name: '485通讯故障', value: "--" };
		this.B49b4 = { name: '母线侧主继电器故障', value: "--" };
		this.B49b5 = { name: '电池侧主继电器故障', value: "--" };
		this.B49b6 = { name: 'DC 机型配置错误', value: "--" };
		this.B49b7 = { name: 'EPO故障', value: "--" };




		




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
		this.B4.name = '机器类型';
		this.B6.name = '故障清除';
		this.B8.name = '运行模式设置';
		this.B10.name = '运行状态设置';
		this.B12.name = '系统开关机';
		this.B14.name = '恢复出厂设置';
		this.B16.name = '组ID号';
		this.B18.name = '模块数量';
		this.B20.name = '电池类型';
		this.B22.name = '直流母线电压';
		this.B24.name = '充放电指令';
		this.B26.name = '充放电功率设定';
		this.B28.name = '电池均充电压';
		this.B30.name = '充电电流设置';
		this.B32.name = '电池浮充电压';
		this.B34.name = '放电电压设置';
		this.B36.name = '放电电流设置';
		this.B38.name = '电池过压关机点';
		this.B40.name = '电池低压告警点';
		this.B42.name = '电池低压关机点';
		this.B44.name = '电池激活功能';
		this.B46.name = '自动重启功能';
		this.B48.name = '充电母线电压上限';
		// this.B50.name = '放电母线电压下限';
		// this.B53b0.name = 'CAN通讯使能位';
		// this.B53b1.name = '485通讯使能位';

	}
}
