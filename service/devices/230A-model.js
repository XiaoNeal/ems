import DeviceBase from "./device-base.model"

export class Model230A extends DeviceBase {
	stateData;
	energyData;
	alarmData;
	constructor() {
		super();
		this.stateData = new StateData();
		this.energyData = new EnergyData()
		this.alarmData = new AlarmData();
	}
	getEnergyData(jsonData) {}

	setHtmlText(unit) {
		return `<span style='color:#fff;font-size:0.8rem'> ${unit}</span>`
	}

	getStatusData(jsonData) {


		this.stateData.B0.value = jsonData.data.B0 + this.setHtmlText('A');
		this.stateData.B4.value = jsonData.data.B4 + this.setHtmlText('MPa');
		this.stateData.B8.value = jsonData.data.B8 + this.setHtmlText('MPa');
		this.stateData.B12.value = jsonData.data.B12 + this.setHtmlText('℃');
		this.stateData.B16.value = jsonData.data.B16 + this.setHtmlText('℃');
		this.stateData.B20.value = jsonData.data.B20 + this.setHtmlText('℃');

		this.stateData.B24.value = jsonData.data.B24 + this.setHtmlText('℃');
		this.stateData.B28.value = jsonData.data.B28 + this.setHtmlText('℃');
		this.stateData.B32.value = jsonData.data.B32 == 0 ? '停机' : (jsonData.data.B32 == 1 ? '运行' : '故障');


		this.energyData.containerAPressure = jsonData.data.B4;
		this.energyData.containerBPressure = jsonData.data.B8;
		this.energyData.dewPointTemp = jsonData.data.B28
		this.energyData.inletTemp = jsonData.data.B12;
		this.energyData.heaterTemp = jsonData.data.B16;
	}
	toFixed(data) {
		return !isNaN(parseFloat(data)) ? parseFloat(data).toFixed(2) : '--'
	}



}

export class StateData {
	B0 = {
		name: '风机电流',
		value: '--'
	};
	B4 = {
		name: 'A塔压力',
		value: '--'
	};
	B8 = {
		name: 'B塔压力',
		value: '--'
	};
	B12 = {
		name: '实时进气温度',
		value: '--'
	};
	B16 = {
		name: '实时加热温度',
		value: '--'
	};
	B20 = {
		name: '实时冷却温度',
		value: '--'
	};
	B24 = {
		name: '实时放空温度',
		value: '--'
	};

	B28 = {
		name: '实时露点温度',
		value: '--'
	};
	B32 = {
		name: '设备状态',
		value: '--'
	};
}


export class EnergyData {
	containerAPressure = "--";
	containerBPressure = "--";
	dewPointTemp = "--";
	inletTemp = "--";
	heaterTemp = "--";
}

export class AlarmData {



}