import DeviceBase from "./device-base.model"

export class Model1713 extends DeviceBase {
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
		for (const key in data) {
			if (this.energyData.hasOwnProperty(key) && this.energyData[key]) {
				this.energyData[key].value = data[key];
			}
		}
	}

	getStatusData(jsonData) {
	}

	getControlData(jsonData) {
	}
}

export class EnergyData {
	B0 = { name: '柔性网关数量', value: "--" };
	B2 = { name: '当前设备总数', value: "--" };
	B4 = { name: '当前设备总数(已注册)', value: "--" };
	B6 = { name: '多联机内机扫描数量(已注册)', value: "--" };
	B8 = { name: '多联机外机扫描数量(已注册)', value: "--" };
	B10 = { name: '直流电表扫描数量(已注册)', value: "--" };
	B12 = { name: '充电桩扫描数量(已注册)', value: "--" };
	B14 = { name: '照明扫描数量(已注册)', value: "--" };
	B16 = { name: '未知设备数量', value: "--" };
	B18 = { name: '柔度(平均值)', value: "--" };
	B20 = { name: '负载率(平均值)', value: "--" };
	B22 = { name: '能效水平(平均值)', value: "--" };
	B24 = { name: '负荷功率（高位）', value: "--" };
	B26 = { name: '负荷功率（低位）', value: "--" };
}

export class StateData {
}

export class ControlData {
}

export class ParamConfig {
	static getList() {
		return [
			{ key: 'gatewayCount', field: 'B0', address: '0', label: '柔性网关数量' },
			{ key: 'deviceTotalCount', field: 'B2', address: '2', label: '当前设备总数' },
			{ key: 'deviceRegisteredCount', field: 'B4', address: '4', label: '当前设备总数(已注册)' },
			{ key: 'multisplitIndoorRegistered', field: 'B6', address: '6', label: '多联机内机扫描数量(已注册)' },
			{ key: 'multisplitOutdoorRegistered', field: 'B8', address: '8', label: '多联机外机扫描数量(已注册)' },
			{ key: 'dcMeterRegistered', field: 'B10', address: '10', label: '直流电表扫描数量(已注册)' },
			{ key: 'chargerRegistered', field: 'B12', address: '12', label: '充电桩扫描数量(已注册)' },
			{ key: 'lightingRegistered', field: 'B14', address: '14', label: '照明扫描数量(已注册)' },
			{ key: 'unknownDeviceCount', field: 'B16', address: '16', label: '未知设备数量' },
			{ key: 'avgFlexibility', field: 'B18', address: '18', label: '柔度(平均值)', unit: '%', scale: 100 },
			{ key: 'avgLoadRatio', field: 'B20', address: '20', label: '负载率(平均值)', unit: '%', scale: 100 },
			{ key: 'avgEfficiencyLevel', field: 'B22', address: '22', label: '能效水平(平均值)', type: 'select', options: [
				{ label: '默认', value: '0' },
				{ label: '1级', value: '1' },
				{ label: '2级', value: '2' },
				{ label: '3级', value: '3' }
			]},
			{ key: 'loadPowerHigh', field: 'B24', address: '24', label: '负荷功率（高位）', unit: 'kW', scale: 1000 },
			{ key: 'loadPowerLow', field: 'B26', address: '26', label: '负荷功率（低位）', unit: 'kW', scale: 1000 }
		];
	}
}
