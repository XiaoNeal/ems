import DeviceBase from "./device-base.model"


export class Model2305 extends DeviceBase {
	stateData;
	energyData;
	constructor(deviceType) {
		super();
		if (deviceType == '2305_V1.1') {
			this.stateData = new StateDataV11()
		} else {
			this.stateData = new StateData();
		}

		this.energyData = new EnergyData();

	}
	getEnergyData(jsonData) {}

	setHtmlText(unit) {
		return `<span style='color:#fff;font-size:0.8rem'> ${unit}</span>`
	}
	getStatusData(jsonData) {
		if (jsonData.deviceType == '2305_V1.1') {
			this.getStatusDataV11(jsonData)
			return
		}
		this.stateData.lubricationOilPressure.value = jsonData.data.B0 + this.setHtmlText('Mpa');
		this.stateData.coolingWaterPressure.value = jsonData.data.B4 + this.setHtmlText('Mpa');
		this.stateData.intakePressure.value = jsonData.data.B8 + this.setHtmlText('Mpa');
		this.stateData.firstStageExhaustPrssure.value = jsonData.data.B12 + this.setHtmlText('Mpa');
		this.stateData.secondStageExhaustPrssure.value = jsonData.data.B16 + this.setHtmlText('Mpa');
		this.stateData.lubricationOilTemperature.value = jsonData.data.B20 + this.setHtmlText('°C ');
		this.stateData.firstStageExhaustTemperature.value = jsonData.data.B24 + this.setHtmlText('°C ');
		this.stateData.secondStageExhaustTemperature.value = jsonData.data.B28 + this.setHtmlText('°C ');
		this.stateData.mainMotorFrontAxleTemperature.value = jsonData.data.B32 + this.setHtmlText('°C ');
		this.stateData.mainMotorRearAxleTemperature.value = jsonData.data.B36 + this.setHtmlText('°C ');
		this.stateData.mainMotorAPhaseWindingTemperature.value = jsonData.data.B40 + this.setHtmlText('°C ');
		this.stateData.mainMotorBPhaseWindingTemperature.value = jsonData.data.B44 + this.setHtmlText('°C ');
		this.stateData.mainMotorCPhaseWindingTemperature.value = jsonData.data.B48 + this.setHtmlText('°C ');
		this.stateData.oliPumpMotorCurrent.value = jsonData.data.B52 + this.setHtmlText('A');
		this.stateData.mainMotorCurrent.value = jsonData.data.B56 + this.setHtmlText('A');
		this.stateData.CompressorAccumulatedRunningTime.value = jsonData.data.B60 + this.setHtmlText('H');
	}
	getStatusDataV11(jsonData) {
		this.stateData.lubricationOilPressure.value = this.toFixed(jsonData.data.B0) + this.setHtmlText('Mpa');
		this.stateData.coolingWaterPressure.value = this.toFixed(jsonData.data.B4) + this.setHtmlText('Mpa');
		this.stateData.intakePressure.value = this.toFixed(jsonData.data.B8) + this.setHtmlText('Mpa');
		this.stateData.firstStageExhaustPrssure.value = this.toFixed(jsonData.data.B12) + this.setHtmlText('Mpa');
		this.stateData.secondStageExhaustPrssure.value = this.toFixed(jsonData.data.B16) + this.setHtmlText('Mpa');
		this.stateData.systemPressure.value = this.toFixed(jsonData.data.B20) + this.setHtmlText('Mpa');

		this.stateData.firstStageExhaustTemperature.value = this.toFixed(jsonData.data.B24) + this.setHtmlText(
			'°C');
		this.stateData.secondStageExhaustTemperature.value = this.toFixed(jsonData.data.B28) + this.setHtmlText(
			'°C');

		this.stateData.lubricationOilTemperature.value = this.toFixed(jsonData.data.B32) + this.setHtmlText('°C');
		this.stateData.mainMotorFrontAxleTemperature.value = this.toFixed(jsonData.data.B36) + this.setHtmlText(
			'°C');
		this.stateData.mainMotorRearAxleTemperature.value = this.toFixed(jsonData.data.B40) + this.setHtmlText(
			'°C');
		this.stateData.mainMotorAPhaseWindingTemperature.value = this.toFixed(jsonData.data.B44) + this.setHtmlText(
			'°C');
		this.stateData.mainMotorBPhaseWindingTemperature.value = this.toFixed(jsonData.data.B48) + this.setHtmlText(
			'°C');
		this.stateData.mainMotorCPhaseWindingTemperature.value = this.toFixed(jsonData.data.B52) + this.setHtmlText(
			'°C');
		this.stateData.motorCurrent.value = this.toFixed(jsonData.data.B56) + this.setHtmlText('A');
		this.stateData.mainMotorCurrent.value = this.toFixed(jsonData.data.B60) + this.setHtmlText('A');
		this.stateData.fuselageVibrationInspectionX.value = this.toFixed(jsonData.data.B64) + this.setHtmlText(
			'mm');
		this.stateData.fuselageVibrationInspectionY.value = this.toFixed(jsonData.data.B68) + this.setHtmlText(
			'mm');
		this.stateData.CompressorAccumulatedRunningTime.value = jsonData.data.B72 + this.setHtmlText('小时 ') +
			jsonData.data.B76 + this.setHtmlText('分钟');
		
	
		this.energyData.systemPressure = this.toFixed(jsonData.data.B20);
		this.energyData.coolingWaterPressure = this.toFixed(jsonData.data.B4)
		this.energyData.secondStageExhaustTemperature = this.toFixed(jsonData.data.B28)
		this.energyData.lubricationOilTemperature = this.toFixed(jsonData.data.B32)
		this.energyData.mainMotorCurrent = this.toFixed(jsonData.data.B60)
		
	}
	toFixed(data) {
		return !isNaN(parseFloat(data)) ? parseFloat(data).toFixed(2) : '--'
	}
}
export class StateData {
	lubricationOilPressure = {
		name: '润滑油压力',
		value: '--'
	};
	coolingWaterPressure = {
		name: '冷却水压力',
		value: '--'
	};
	intakePressure = {
		name: '进气压力',
		value: '--'
	};
	firstStageExhaustPrssure = {
		name: '一级排气压力',
		value: '--'
	};
	secondStageExhaustPrssure = {
		name: '二级排气压力',
		value: '--'
	};
	lubricationOilTemperature = {
		name: '润滑油温度',
		value: '--'
	};
	firstStageExhaustTemperature = {
		name: '一级排气温度',
		value: '--'
	};
	secondStageExhaustTemperature = {
		name: '二级排气温度',
		value: '--'
	};
	mainMotorFrontAxleTemperature = {
		name: '主电机前轴温度',
		value: '--'
	};
	mainMotorRearAxleTemperature = {
		name: '主电机后轴温度',
		value: '--'
	};
	mainMotorAPhaseWindingTemperature = {
		name: '主电机A相绕组温度',
		value: '--'
	};
	mainMotorBPhaseWindingTemperature = {
		name: '主电机B相绕组温度',
		value: '--'
	};
	mainMotorCPhaseWindingTemperature = {
		name: '主电机C相绕组温度',
		value: '--'
	};
	oliPumpMotorCurrent = {
		name: '油泵电机电流',
		value: '--'
	};
	mainMotorCurrent = {
		name: '主机电机电流',
		value: '--'
	};
	CompressorAccumulatedRunningTime = {
		name: '压缩机累计运行时间',
		value: '--'
	};
}
export class StateDataV11 {
	lubricationOilPressure = {
		name: '润滑油压力',
		value: '--'
	};
	coolingWaterPressure = {
		name: '冷却水压力',
		value: '--'
	};
	intakePressure = {
		name: '进气压力',
		value: '--'
	};
	firstStageExhaustPrssure = {
		name: '一级排气压力',
		value: '--'
	};
	secondStageExhaustPrssure = {
		name: '二级排气压力',
		value: '--'
	};
	systemPressure = {
		name: '系统供气压力',
		value: '--'
	};

	firstStageExhaustTemperature = {
		name: '一级排气温度',
		value: '--'
	};
	secondStageExhaustTemperature = {
		name: '二级排气温度',
		value: '--'
	};

	lubricationOilTemperature = {
		name: '润滑油温度',
		value: '--'
	};
	mainMotorFrontAxleTemperature = {
		name: '主电机前轴温度',
		value: '--'
	};
	mainMotorRearAxleTemperature = {
		name: '主电机后轴温度',
		value: '--'
	};
	mainMotorAPhaseWindingTemperature = {
		name: '主电机A相绕组温度',
		value: '--'
	};
	mainMotorBPhaseWindingTemperature = {
		name: '主电机B相绕组温度',
		value: '--'
	};
	mainMotorCPhaseWindingTemperature = {
		name: '主电机C相绕组温度',
		value: '--'
	};
	motorCurrent = {
		name: '辅机电机电流',
		value: '--'
	};
	mainMotorCurrent = {
		name: '主机电机电流',
		value: '--'
	};
	fuselageVibrationInspectionX = {
		name: '机身震动检测X',
		value: '--'
	};
	fuselageVibrationInspectionY = {
		name: '机身震动检测Y',
		value: '--'
	};
	CompressorAccumulatedRunningTime = {
		name: '压缩机累计运行时间',
		value: '--'
	};
}
export class EnergyData {
	systemPressure = "--";
	coolingWaterPressure = "--";
	secondStageExhaustTemperature = "--";
	lubricationOilTemperature = "--";
	mainMotorCurrent = "--";

}