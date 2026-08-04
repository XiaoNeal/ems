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

export class ParamConfig {
	static getList() {
		return [
			{
				key: 'deviceType', field: 'B0', address: '0', label: '设备类型', type: 'select', options: [
					{ label: '无效', value: '0' },
					{ label: '分体机', value: '1' },
					{ label: '多联机', value: '2' },
					{ label: '充电桩', value: '3' },
					{ label: '照明', value: '4' }
				]
			},
			{ key: 'deviceLocation', field: 'B2', address: '2', label: '设备位置' },
			{ key: 'deviceFlexibility', field: 'B4', address: '4', label: '设备柔度', unit: '%', scale: 100 },
			{ key: 'deviceLoadRatio', field: 'B6', address: '6', label: '设备负载率', unit: '%', scale: 100 },
			{
				key: 'deviceEnergyEfficiencyLevel', field: 'B8', address: '8', label: '设备能效水平', type: 'select', options: [
					{ label: '默认', value: '0' },
					{ label: '1级', value: '1' },
					{ label: '2级', value: '2' },
					{ label: '3级', value: '3' }
				]
			},
			{ key: 'ratedPower', field: 'B10', address: '10', label: '设备额定功率', unit: 'kW', scale: 1000 },
			{ key: 'deviceVoltage', field: 'B14', address: '14', label: '设备电压', unit: 'V', scale: 1000 },
			{ key: 'deviceCurrent', field: 'B18', address: '18', label: '设备电流', unit: 'A', scale: 1000 },
			{ key: 'devicePower', field: 'B22', address: '22', label: '设备功率', unit: 'kW', scale: 1000 },
			{ key: 'forwardEnergy', field: 'B26', address: '26', label: '设备累计正向电能', unit: 'kWh', scale: 100 },
			{ key: 'reverseEnergy', field: 'B30', address: '30', label: '设备累计反向电能', unit: 'kWh', scale: 100 },
			{
				key: 'networkStatus', field: 'B34', address: '34', label: '设备入网状态', type: 'select', options: [
					{ label: '离线', value: '0' },
					{ label: '等待注册', value: '1' },
					{ label: '等待配置', value: '2' },
					{ label: '运行', value: '3' },
					{ label: '在线', value: '4' }
				]
			},
			{
				key: 'commStatus', field: 'B36', address: '36', label: '设备通讯状态', type: 'select', options: [
					{ label: '离线', value: '0' },
					{ label: '在线', value: '1' }
				]
			},
			{
				key: 'fourthLevelType', field: 'B38', address: '38', label: '设备四级分类类型', type: 'select', options: [
					{ label: '无效', value: '0' },
					{ label: '基础型', value: '1' },
					{ label: '环境型', value: '2' },
					{ label: '功能型', value: '3' },
					{ label: '舒适型', value: '4' }
				]
			},
			{ key: 'subGatewayId', field: 'B40', address: '40', label: '设备所属子网关ID' },
			{ key: 'protocolVersion', field: 'B42', address: '42', label: '设备协议版本' },
			{ key: 'statusDataOffset', field: 'B44', address: '44', label: '设备状态数据区偏移寄存器数量' },
			{ key: 'controlDataOffset', field: 'B46', address: '46', label: '设备控制数据区偏移寄存器数量' },
			{ key: 'adjustablePower', field: 'B54', address: '54', label: '可调节功率', unit: 'kW', scale: 1000 },
			{ key: 'responseCount', field: 'B58', address: '58', label: '累计响应次数' },
			{ key: 'responseTime', field: 'B60', address: '60', label: '累计响应时间', unit: 'min' },
			{ key: 'responseEnergy', field: 'B64', address: '64', label: '累计响应电量', unit: 'kWh', scale: 1000 },
			{
				key: 'switch', field: 'B68', address: '68', label: '开关', type: 'switch', options: [
					{ label: '关闭', value: '0' },
					{ label: '开启', value: '1' }
				]
			},
			{
				key: 'adjustable', field: 'B70', address: '70', label: '是否调控', type: 'switch', options: [
					{ label: '不调控', value: '0' },
					{ label: '调控', value: '1' }
				]
			},
			{
				key: 'responseLevel', field: 'B72', address: '72', label: '响应等级', type: 'select', options: [
					{ label: '一级调控', value: '1' },
					{ label: '二级调控', value: '2' },
					{ label: '三级调控', value: '3' }
				]
			},
			{ key: 'adjustDuration', field: 'B74', address: '74', label: '调控时长', unit: 'min' }
		];
	}

	static getSwitchList() {
		return [
			{
				key: 'switch', field: 'B68', address: '68', label: '开关', options: [
					{ label: '关闭', value: '0' },
					{ label: '开启', value: '1' }
				]
			},
			{
				key: 'adjustable', field: 'B70', address: '70', label: '是否调控', options: [
					{ label: '不调控', value: '0' },
					{ label: '调控', value: '1' }
				]
			}
		];
	}
}
