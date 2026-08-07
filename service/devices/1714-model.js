import DeviceBase from "./device-base.model"

export class Model1714 extends DeviceBase {
	energyData;
	stateData;
	controlData;

	constructor() {
		super();
		this.energyData = new EnergyData();
		this.stateData = new StateData();
		this.controlData = new ControlData();
	}

	getEnergyData(jsonData, jsonData2) {
		const data = jsonData.data || jsonData;
		// 倍率转换表：{ 字段: 转换函数 }
		// 传输值 = 实际值 * 倍率，所以实际值 = 传输值 / 倍率
		const scaleMap = {
			
			'B6': v => v ,   // 设备柔度
			'B8': v => v ,   // 设备负载率
			'B52': v => v ,  // 设置柔度
		
			'B12': v => v / 1000, // 设备额定功率
			'B16': v => v , // 设备电压
			'B20': v => v , // 设备电流
			'B24': v => v / 1000, // 设备功率
			'B56': v => v / 1000, // 可调节功率
			'B66': v => v , // 累计响应电量
		
			'B28': v => v ,  // 设备累计正向电能
			'B32': v => v ,  // 设备累计反向电能
		};
		
		for (const key in data) {
			if (this.energyData.hasOwnProperty(key) && this.energyData[key]) {
				let value = data[key];
				// 应用倍率转换
				if (scaleMap[key] && value !== null && value !== undefined && value !== '--' && value !== '') {
					value = scaleMap[key](parseFloat(value));
				}
				this.energyData[key].value = value;
			}
		}
	}

	getStatusData(jsonData) {
	}

	getControlData(jsonData) {
		// const data = jsonData.data || jsonData;
		// for (const key in data) {
		// 	if (this.controlData.hasOwnProperty(key) && this.controlData[key]) {
		// 		this.controlData[key].value = data[key];
		// 	}
		// }
	}
}

export class EnergyData {
	B0 = { name: '设备id', value: "--" };
	B2 = { name: '设备类型', value: "--" };
	B4 = { name: '设备位置', value: "--" };
	B6 = { name: '设备柔度', value: "--" };
	B8 = { name: '设备负载率', value: "--" };
	B10 = { name: '设备能效水平', value: "--" };
	B12 = { name: '设备额定功率', value: "--" };
	B16 = { name: '设备电压', value: "--" };
	B20 = { name: '设备电流', value: "--" };
	B24 = { name: '设备功率', value: "--" };
	B28 = { name: '设备累计正向电能', value: "--" };
	B32 = { name: '设备累计反向电能', value: "--" };
	B36 = { name: '设备入网状态', value: "--" };
	B38 = { name: '设备通讯状态', value: "--" };
	B40 = { name: '设备四级分类类型', value: "--" };
	B42 = { name: '设备所属子网关ID', value: "--" };
	B44 = { name: '设备协议版本', value: "--" };
	B46 = { name: '设备状态数据区偏移寄存器数量', value: "--" };
	B48 = { name: '设备控制数据区偏移寄存器数量', value: "--" };
	B50 = { name: '操作', value: "--" };
	B52 = { name: '设置柔度', value: "--" };
	B54 = { name: '设置四级分类', value: "--" };
	B56 = { name: '可调节功率', value: "--" };
	B60 = { name: '累计响应次数', value: "--" };
	B62 = { name: '累计响应时间', value: "--" };
	B66 = { name: '累计响应电量', value: "--" };
	B70 = { name: '开关', value: "--" };
	B72 = { name: '是否调控', value: "--" };
	B74 = { name: '响应等级', value: "--" };
	B76 = { name: '调控时长', value: "--" };
}

export class StateData {
}

export class ControlData {
}
