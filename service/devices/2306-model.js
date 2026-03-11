import DeviceBase from "./device-base.model"

export class Model2306 extends DeviceBase {
	stateData;
	energyData;
	constructor() {
		super();
		this.energyData = new EnergyData()
		this.stateData = new StateData();
	}
	getEnergyData(jsonData) {
	}

	setHtmlText(unit) {
		return `<span style='color:#fff;font-size:0.8rem'> ${unit}</span>`
	}

	getStatusData(jsonData) {
		this.stateData.B0.value = this.toFixed(jsonData.data.B0) + this.setHtmlText('°C');
		this.stateData.B4.value = this.toFixed(jsonData.data.B4) + this.setHtmlText('°C');
		this.stateData.B8.value = this.toFixed(jsonData.data.B8) + this.setHtmlText('°C');
		this.stateData.B12.value = this.toFixed(jsonData.data.B12) + this.setHtmlText('°C');
		this.stateData.B16.value = this.toFixed(jsonData.data.B16) + this.setHtmlText('°C');
		this.stateData.B20.value = this.toFixed(jsonData.data.B20) + this.setHtmlText('MPa');
		this.stateData.B24.value = this.toFixed(jsonData.data.B24) + this.setHtmlText('MPa');
		this.stateData.B28.value = jsonData.data.B28 == 1 ? '运行' : '停止';
		this.stateData.B29.value = jsonData.data.B29 == 1 ? '故障' : '无故障';
		this.energyData.leftTowerPressure = this.toFixed(jsonData.data.B20);
		this.energyData.rightTowerPressure = this.toFixed(jsonData.data.B24);
		this.energyData.dewPoint = this.toFixed(jsonData.data.B16)
		this.energyData.inletTemp = this.toFixed(jsonData.data.B12);
		this.energyData.heaterTemp = this.toFixed(jsonData.data.B0);
		this.energyData.outletTemp = this.toFixed(jsonData.data.B8)
		this.energyData.ventTemp = this.toFixed(jsonData.data.B4)
	}

	toFixed(data) {
		return !isNaN(parseFloat(data)) ? parseFloat(data).toFixed(2) : '--'
	}
}
export class EnergyData {
	leftTowerPressure= '--';
	rightTowerPressure= '--';
	outletTemp= '--';
	ventTemp= '--';
	dewPoint= '--';
	inletTemp='--';
	heaterTemp= '--';
}

export class StateData {
	B0 = {
		name: '加热出口温度测十四',
		value: '--'
	};
	B4 = {
		name: '排气口温度',
		value: '--'
	};
	B8 = {
		name: '后冷出口温度',
		value: '--'
	};
	B12 = {
		name: '空气进气口温度',
		value: '--'
	};
	B16 = {
		name: '露点温度',
		value: '--'
	};
	B20 = {
		name: '左塔压力',
		value: '--'
	};
	B24 = {
		name: '右塔压力',
		value: '--'
	};
	B28 = {
		name: '干燥机运行状态',
		value: '--'
	};
	B29 = {
		name: '干燥机综合故障',
		value: '--'
	};
}