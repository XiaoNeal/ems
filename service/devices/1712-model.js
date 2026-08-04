import DeviceBase from "./device-base.model"

export class Model1712 extends DeviceBase {
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
		const data = jsonData.data || jsonData;
		for (const key in data) {
			if (this.controlData.hasOwnProperty(key) && this.controlData[key]) {
				this.controlData[key].value = data[key];
			}
		}
	}
}

export class EnergyData {
	B0 = { name: '子网关modbusRTU地址', value: "--" };
	B2 = { name: '子网关ID', value: "--" };
	B4 = { name: '子网关位置', value: "--" };
	B6 = { name: '子网关入网状态', value: "--" };
	B8 = { name: '子网关通讯状态', value: "--" };
	B10 = { name: '子网关软件版本号', value: "--" };
	B12 = { name: '子网关当前设备总数', value: "--" };
	B14 = { name: '多联机内机扫描数量', value: "--" };
	B16 = { name: '多联机外机扫描数量', value: "--" };
	B18 = { name: '直流电表扫描数量', value: "--" };
	B20 = { name: '充电桩扫描数量', value: "--" };
	B22 = { name: '照明扫描数量', value: "--" };
}

export class StateData {
}

export class ControlData {
}

export class ParamConfig {
	static getList() {
		return [
			{ key: 'modbusAddr', field: 'B0', address: '0', label: '子网关modbusRTU地址' },
			{ key: 'subGatewayId', field: 'B2', address: '2', label: '子网关ID' },
			{ key: 'subGatewayLocation', field: 'B4', address: '4', label: '子网关位置' },
			{ key: 'networkStatus', field: 'B6', address: '6', label: '子网关入网状态' },
			{ key: 'commStatus', field: 'B8', address: '8', label: '子网关通讯状态' },
			{ key: 'softwareVersion', field: 'B10', address: '10', label: '子网关软件版本号' },
			{ key: 'deviceCount', field: 'B12', address: '12', label: '子网关当前设备总数' },
			{ key: 'multisplitIndoorCount', field: 'B14', address: '14', label: '多联机内机扫描数量' },
			{ key: 'multisplitOutdoorCount', field: 'B16', address: '16', label: '多联机外机扫描数量' },
			{ key: 'dcMeterCount', field: 'B18', address: '18', label: '直流电表扫描数量' },
			{ key: 'chargerCount', field: 'B20', address: '20', label: '充电桩扫描数量' },
			{ key: 'lightingCount', field: 'B22', address: '22', label: '照明扫描数量' }
		];
	}
}
