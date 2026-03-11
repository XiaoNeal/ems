import DeviceBase from "./device-base.model"

export class Model2309 extends DeviceBase {
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
		this.stateData.B2.value = jsonData.data.B2 + this.setHtmlText('Mpa');
		this.stateData.B6.value = jsonData.data.B6 + this.setHtmlText('Mpa');
		this.stateData.B10.value = jsonData.data.B10 + this.setHtmlText('Mpa');
		this.stateData.B14.value = jsonData.data.B14 + this.setHtmlText('Mpa');
		this.stateData.B22.value = jsonData.data.B22 + this.setHtmlText('℃');
		this.stateData.B26.value = jsonData.data.B26 + this.setHtmlText('℃');
		this.stateData.B30.value = jsonData.data.B30 + this.setHtmlText('℃');
		this.stateData.B34.value = jsonData.data.B34 + this.setHtmlText('℃');
		this.stateData.B42.value = jsonData.data.B42 + this.setHtmlText('℃');
		this.stateData.B46.value = jsonData.data.B46 + this.setHtmlText('℃');

		this.stateData.B50.value = jsonData.data.B50 + this.setHtmlText('%');

		this.energyData.containerAPressure = jsonData.data.B2;
		this.energyData.containerBPressure = jsonData.data.B6;
		this.energyData.dewPoint = jsonData.data.B46
		this.energyData.inletTemp = jsonData.data.B22;
		this.energyData.heaterTemp = jsonData.data.B26;

	}
	toFixed(data) {
		return !isNaN(parseFloat(data)) ? parseFloat(data).toFixed(2) : '--'
	}
}

export class StateData {
	B2 = {
		name: '容器A压力',
		value: '--'
	};
	B6 = {
		name: '容器B压力',
		value: '--'
	};
	B10 = {
		name: '进出口压差',
		value: '--'
	};
	B14 = {
		name: '再生阀压差',
		value: '--'
	};
	B22 = {
		name: '干燥器进口',
		value: '--'
	};
	B26 = {
		name: '加热器出口',
		value: '--'
	};
	B30 = {
		name: '容器A底端温度',
		value: '--'
	};

	B34 = {
		name: '容器B底端温度',
		value: '--'
	};
	B42 = {
		name: '冷却器1空气进口温度',
		value: '--'
	};
	B46 = {
		name: '干燥器压力露点',
		value: '--'
	};
	B50 = {
		name: '再生阀关闭比例',
		value: '--'
	};
}


export class EnergyData {
	containerAPressure="--";
	containerBPressure="--";
	dewPoint="--";
	inletTemp="--";
	heaterTemp="--";
}
export class AlarmData {
	B0 = {
		name: '工作压力',
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




}