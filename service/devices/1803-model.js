import DeviceBase from "./device-base.model"

//三相电表模块
export class Model1803 extends DeviceBase {
	energyData;
	// stateData;
	constructor() {
		super();
		this.energyData = new ThreePhaseMeterEnergyDataModel();
		// this.stateData = new StateData()
	}



	getEnergyData(jsonData, jsonData2, barCode) {
		this.energyData.todayIncome = jsonData.B194.toFixed(2)
		this.energyData.totalIncome = jsonData.B198.toFixed(2)
		if (jsonData2.deviceType == '1803_V2' || jsonData2.deviceType == '1803_V2_2') {
			this.getV2EnergyData(jsonData)
			return
		}
		if (jsonData.B0 > 300) {
			this.energyData.phaseA.Voltage = (jsonData.B0 / Math.sqrt(3)).toFixed(2);
			this.energyData.lineVoltageAB = jsonData.B0.toFixed(2);


		} else {
			this.energyData.phaseA.Voltage = jsonData.B0.toFixed(2);
			this.energyData.lineVoltageAB = (jsonData.B0 * Math.sqrt(3)).toFixed(2);
		}

		this.energyData.phaseA.Current = jsonData.B12.toFixed(2);
		this.energyData.phaseA.Power = jsonData.B28.toFixed(2);

		if (jsonData.B4 > 300) {
			this.energyData.phaseB.Voltage = (jsonData.B4 / Math.sqrt(3)).toFixed(2);
			this.energyData.lineVoltageBC = jsonData.B4.toFixed(2);


		} else {
			this.energyData.phaseB.Voltage = jsonData.B4.toFixed(2);
			this.energyData.lineVoltageBC = (jsonData.B4 * Math.sqrt(3)).toFixed(2);
		}
		this.energyData.phaseB.Current = jsonData.B16.toFixed(2);
		this.energyData.phaseB.Power = jsonData.B32.toFixed(2);

		if (jsonData.B8 > 300) {
			this.energyData.phaseC.Voltage = (jsonData.B8 / Math.sqrt(3)).toFixed(2);
			this.energyData.lineVoltageCA = jsonData.B8.toFixed(2);

		} else {
			this.energyData.phaseC.Voltage = jsonData.B8.toFixed(2);
			this.energyData.lineVoltageCA = (jsonData.B8 * Math.sqrt(3)).toFixed(2);
		}

		this.energyData.phaseC.Current = jsonData.B20.toFixed(2);
		// this.energyData.phaseC.Power = jsonData.B36.toFixed(2);
		this.energyData.activePower = ((jsonData.B24 / 1000).toFixed(2));
		this.energyData.reactivePower = (jsonData.B40.toFixed(2));
		this.energyData.electricConsume = jsonData.B72.toFixed(2);
		// this.energyData.Current = parseFloat(jsonData.B12).toFixed(2);
		// this.energyData.Voltage = parseFloat(jsonData.B0).toFixed(2);
		// this.energyData.Power = (parseFloat(jsonData.B24) / 1000).toFixed(2);
		// this.energyData.ElectricQuantity = parseFloat(jsonData.B72).toFixed(2);

		if (!isNaN(parseFloat(this.energyData.activePower)) && !isNaN(parseFloat(this.energyData.activePower))) {
			let sum = Math.pow(parseFloat(this.energyData.activePower), 2) + Math.pow(parseFloat(this.energyData
				.reactivePower), 2)
			if (sum > 0)
				this.energyData.powerFactor = (parseFloat(this.energyData.activePower) / Math.sqrt(sum)).toFixed(2);
			else this.energyData.powerFactor = this.energyData.activePower
		}


		// this.stateData.phaseVoltageA.value = jsonData.B0.toFixed(2) + this.setHtmlText('V');
		// this.stateData.phaseCurrentA.value = jsonData.B12.toFixed(2) + this.setHtmlText('A');
		// this.stateData.phaseAPower.value = jsonData.B28.toFixed(2) + this.setHtmlText('W');
		// this.stateData.phaseVoltageB.value = jsonData.B4.toFixed(2) + this.setHtmlText('V');
		// this.stateData.phaseCurrentB.value = jsonData.B16.toFixed(2) + this.setHtmlText('A');
		// this.stateData.phaseBPower.value = jsonData.B32.toFixed(2) + this.setHtmlText('W');
		// this.stateData.phaseVoltageC.value = jsonData.B8.toFixed(2) + this.setHtmlText('V');;
		// this.stateData.phaseCurrentC.value = jsonData.B20.toFixed(2) + this.setHtmlText('A');;
		// this.stateData.phaseCPower.value = jsonData.B36.toFixed(2) + this.setHtmlText('W');;
		// this.stateData.activePower.value = (jsonData.B24.toFixed(2)) + this.setHtmlText('W');;
		// this.stateData.reactivePower.value = (jsonData.B40.toFixed(2)) + this.setHtmlText('Var');;
		// this.stateData.electricConsume.value = jsonData.B72.toFixed(2) + this.setHtmlText('kWh');;
		// this.stateData.powerFactor.value = this.energyData.powerFactor
	}
	setVoltage(jsonData) {
		if (jsonData.B0 > 300) {
			this.energyData.phaseA.Voltage = (jsonData.B0 / Math.sqrt(3)).toFixed(2);
			this.energyData.lineVoltageAB = jsonData.B0.toFixed(2);


		} else {
			this.energyData.phaseA.Voltage = jsonData.B0.toFixed(2);
		}


		if (jsonData.B4 > 300) {
			this.energyData.phaseB.Voltage = (jsonData.B4 / Math.sqrt(3)).toFixed(2);
			this.energyData.lineVoltageBC = jsonData.B4.toFixed(2);


		} else {
			this.energyData.phaseB.Voltage = jsonData.B4.toFixed(2);
		}

		if (jsonData.B8 > 300) {
			this.energyData.phaseC.Voltage = (jsonData.B8 / Math.sqrt(3)).toFixed(2);
			this.energyData.lineVoltageCA = jsonData.B8.toFixed(2);

		} else {
			this.energyData.phaseC.Voltage = jsonData.B8.toFixed(2);
		}
	}
	getV2EnergyData(jsonData) {
		// this.energyData.Current = parseFloat(jsonData.B12).toFixed(2);
		// this.energyData.Voltage = parseFloat(jsonData.B0).toFixed(2);
		// this.energyData.Power = (parseFloat(jsonData.B56) / 1000).toFixed(2);
		// this.energyData.ElectricQuantity = parseFloat(jsonData.B122).toFixed(2);
		this.energyData.phaseA.Voltage = jsonData.B0.toFixed(2);
		this.energyData.phaseB.Voltage = jsonData.B4.toFixed(2);
		this.energyData.phaseC.Voltage = jsonData.B8.toFixed(2);
		this.energyData.phaseA.Current = jsonData.B12.toFixed(2);
		this.energyData.phaseB.Current = jsonData.B16.toFixed(2);
		this.energyData.phaseC.Current = jsonData.B20.toFixed(2);
		this.energyData.activePower = ((jsonData.B56 / 1000).toFixed(2));
		// this.energyData.phaseA.Power = jsonData.B60.toFixed(2);
		this.energyData.lineVoltageAB = jsonData.B24.toFixed(2);
		this.energyData.lineVoltageBC = jsonData.B28.toFixed(2);
		this.energyData.lineVoltageCA = jsonData.B32.toFixed(2);
		this.setVoltage(jsonData)
		// this.energyData.phaseB.Power = jsonData.B64.toFixed(2);
		// this.energyData.phaseC.Power = jsonData.B68.toFixed(2);
		this.energyData.reactivePower = (jsonData.B72.toFixed(2));
		this.energyData.electricConsume = jsonData.B122.toFixed(2);
		// this.energyData.reverseElectricConsume = jsonData.B142.toFixed(2);
		// this.energyData.positiveElectricConsume = jsonData.B126.toFixed(2);
		let activePower = parseFloat(jsonData.B56)
		let reactivePower = parseFloat(jsonData.B72)
		if (!isNaN(activePower) && !isNaN(reactivePower)) {
			let sum = Math.pow(activePower, 2) + Math.pow(reactivePower, 2)
		
			if (sum > 0){
				this.energyData.powerFactor = (activePower / Math.sqrt(sum)).toFixed(2);
			}
			else this.energyData.powerFactor = jsonData.B56.toFixed(2);
		}
		// this.stateData.phaseVoltageA.value = jsonData.B0.toFixed(2) + this.setHtmlText('V');
		// this.stateData.phaseCurrentA.value = jsonData.B12.toFixed(2) + this.setHtmlText('A');
		// this.stateData.phaseAPower.value = jsonData.B60.toFixed(2) + this.setHtmlText('W');
		// this.stateData.phaseVoltageB.value = jsonData.B4.toFixed(2) + this.setHtmlText('V');
		// this.stateData.phaseCurrentB.value = jsonData.B16.toFixed(2) + this.setHtmlText('A');
		// this.stateData.phaseBPower.value = jsonData.B64.toFixed(2) + this.setHtmlText('W');
		// this.stateData.phaseVoltageC.value = jsonData.B8.toFixed(2) + this.setHtmlText('V');;
		// this.stateData.phaseCurrentC.value = jsonData.B20.toFixed(2) + this.setHtmlText('A');;
		// this.stateData.phaseCPower.value = jsonData.B68.toFixed(2) + this.setHtmlText('W');;
		// this.stateData.activePower.value = (jsonData.B56.toFixed(2)) + this.setHtmlText('W');;
		// this.stateData.reactivePower.value = (jsonData.B72.toFixed(2)) + this.setHtmlText('Var');;
		// this.stateData.electricConsume.value = jsonData.B122.toFixed(2) + this.setHtmlText('kWh');;
		// this.stateData.powerFactor.value = this.energyData.powerFactor
	}
	setHtmlText(unit) {
		return `<span style='color:#fff;font-size:0.8rem'> ${unit}</span>`
	}

	getStatusData(jsonData) {
		// this.stateData.faultData = jsonData.data.B12
		// this.energyData.powerFactor = jsonData.data.B0
	}


}

class ThreePhaseMeterEnergyDataModel {
	todayIncome='--'
	totalIncome='--'
	phaseA = {
		Voltage: '--',
		Current: '--',
	}; //A相
	phaseB = {
		Voltage: '--',
		Current: '--',
	}; //B相
	phaseC = {
		Voltage: '--',
		Current: '--',
	}; //C相
	lineVoltageCA = '--'; //线电压 Uca
	lineVoltageAB = '--'; //线电压 Uab
	lineVoltageBC = '--'; //线电压 Ubc
	activePower = '--'; //三相有功功率
	reactivePower = '--'; //三相无功功率
	electricConsume = '--'; //耗电量（kWh）
	powerFactor = '--' //三相总功率因素
	// PT = '--'; //电压变比
	// CT = '--'; //电流变比
	// dateTime;
	reverseElectricConsume = '--' //反向电能
	positiveElectricConsume = '--'


}