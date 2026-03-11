import DeviceBase from "./device-base.model"

export class Model1D02 extends DeviceBase {
	// energyData: Meter1D02EnergyDataModel;
	energyData;
	stateData;
	controlData;
	photovoltaicData;
	constructor() {
		super();
		this.energyData = new EnergyData();
		this.stateData = new StateData();
		this.controlData = new ControlData()
		this.photovoltaicData = new Meter1D02EnergyDataModel();
	}
	getRunningMode(key) {
		switch (key) {
			case 0:
				return '系统待机'
			case 1:
				return '纯光伏发电工作模式'
			case 2:
				return '光伏空调工作模式'
			case 3:
				return '光伏空调及系统发电工作模式'
			case 4:
				return '光伏空调及系统用电工作模式'
			case 5:
				return '纯空调工作模式'
			default:
				return key;
		}
	}

	getCrewState(key) {
		switch (key) {
			case 0:
				return '已停机'
			case 1:
				return '正在启动'
			case 2:
				return '待机'
			case 3:
				return '正在关机'
			case 4:
				return '运行'
			case 5:
				return '故障'
			case 6:
				return '未联网'
			default:
				return key;
		}
	}
	getEnergyData(jsonData, jsonData2, barCode) {


		this.energyData.dateTime = jsonData2.dateTime
		this.energyData.B0.value = this.toFixed(jsonData.B0) + this.setHtmlText('℃');
		this.energyData.B2.value = this.toFixed(jsonData.B2) + this.setHtmlText('℃');
		this.energyData.B4.value = this.toFixed(jsonData.B4) + this.setHtmlText('℃');
		this.energyData.B6.value = this.toFixed(jsonData.B6) + this.setHtmlText('℃');
		this.energyData.B8.value = this.toFixed(jsonData.B8) + this.setHtmlText('℃');
		this.energyData.B10.value = this.toFixed(jsonData.B10) + this.setHtmlText('℃');
		this.energyData.B12.value = this.toFixed(jsonData.B12) + this.setHtmlText('℃');
		this.energyData.B14.value = this.toFixed(jsonData.B14) + this.setHtmlText('℃');
		this.energyData.B16.value = this.toFixed(jsonData.B16) + this.setHtmlText('℃');

		this.energyData.B18.value = this.getRunningMode(jsonData.B18);
		this.energyData.B20.value = this.toFixed(jsonData.B20) + this.setHtmlText('℃');
		this.energyData.B22.value = this.toFixed(jsonData.B22) + this.setHtmlText('℃');
		this.energyData.B24.value = this.toFixed(jsonData.B24) + this.setHtmlText('℃');
		this.energyData.B26.value = this.toFixed(jsonData.B26) + this.setHtmlText('℃');
		this.energyData.B28.value = this.toFixed(jsonData.B28) + this.setHtmlText('kPa');
		this.energyData.B30.value = this.toFixed(jsonData.B30) + this.setHtmlText('kPa');
		this.energyData.B32.value = this.toFixed(jsonData.B32) + this.setHtmlText('kPa');
		this.energyData.B34.value = this.toFixed(jsonData.B34) + this.setHtmlText('kPa');
		this.energyData.B36.value = this.toFixed(jsonData.B36) + this.setHtmlText('kPa');
		this.energyData.B38.value = this.toFixed(jsonData.B38) + this.setHtmlText('%');
		this.energyData.B40.value = this.toFixed(jsonData.B40) + this.setHtmlText('%');
		this.energyData.B42.value = this.toFixed(jsonData.B42) + this.setHtmlText('%');
		this.energyData.B44.value = this.toFixed(jsonData.B44) + this.setHtmlText('℃');
		this.energyData.B46.value = this.toFixed(jsonData.B46) + this.setHtmlText('℃');
		this.energyData.B48.value = this.toFixed(jsonData.B48) + this.setHtmlText('%');
		this.energyData.B50.value = this.toFixed(jsonData.B50) + this.setHtmlText('℃');
		this.energyData.B52.value = this.toFixed(jsonData.B52) + this.setHtmlText('℃');
		this.energyData.B54.value = this.toFixed(jsonData.B54) + this.setHtmlText('℃');
		this.energyData.B56.value = this.getCrewState(jsonData.B56);
		this.energyData.B58.value = this.toFixed(jsonData.B58) + this.setHtmlText('Hz');
		this.energyData.B60.value = this.toFixed(jsonData.B60) + this.setHtmlText('℃');
		this.energyData.B62.value = this.toFixed(jsonData.B62) + this.setHtmlText('℃');
		this.energyData.B64.value = this.toFixed(jsonData.B64) + this.setHtmlText('V');
		this.energyData.B66.value = this.toFixed(jsonData.B66) + this.setHtmlText('V');
		this.energyData.B68.value = this.toFixed(jsonData.B68) + this.setHtmlText('V');
		this.energyData.B70.value = this.toFixed(jsonData.B70) + this.setHtmlText('Hz');
		this.energyData.B72.value = this.toFixed(jsonData.B72) + this.setHtmlText('V');
		this.energyData.B74.value = this.toFixed(jsonData.B74) + this.setHtmlText('℃');
		this.energyData.B76.value = this.toFixed(jsonData.B76) + this.setHtmlText('A');
		this.energyData.B78.value = this.toFixed(jsonData.B78) + this.setHtmlText('A');
		this.energyData.B80.value = this.toFixed(jsonData.B80) + this.setHtmlText('A');
		this.energyData.B82.value = this.toFixed(jsonData.B82) + this.setHtmlText('A');
		this.energyData.B84.value = this.toFixed(jsonData.B84) + this.setHtmlText('A');
		this.energyData.B86.value = this.toFixed(jsonData.B86) + this.setHtmlText('A');
		this.energyData.B88.value = this.toFixed(jsonData.B88) + this.setHtmlText('%');
		this.energyData.B90.value = this.toFixed(jsonData.B90) + this.setHtmlText('%');
		this.energyData.B92.value = this.toFixed(jsonData.B92) + this.setHtmlText('℃');
		this.energyData.B94.value = jsonData.B94 + this.setHtmlText('h');
		this.energyData.B96.value = jsonData.B96 + this.setHtmlText('次');
		this.energyData.B98.value = jsonData.B98 + this.setHtmlText('次');
		this.energyData.B100.value = this.toFixed(jsonData.B100) + this.setHtmlText('%');
		this.energyData.B102.value = this.toFixed(jsonData.B102) + this.setHtmlText('%');
		this.energyData.B104.value = this.toFixed(jsonData.B104) + this.setHtmlText('%');
		this.energyData.B106.value = this.toFixed(jsonData.B106) + this.setHtmlText('%');
		this.energyData.B108.value = this.toFixed(jsonData.B108) + this.setHtmlText('%');
		this.energyData.B110.value = this.toFixed(jsonData.B110) + this.setHtmlText('%');
		this.energyData.B112.value = this.toFixed(jsonData.B112) + this.setHtmlText('%');
		this.energyData.B114.value = this.toFixed(jsonData.B114) + this.setHtmlText('A');
		this.energyData.B116.value = this.toFixed(jsonData.B116) + this.setHtmlText('Vdc');
		this.energyData.B118.value = this.toFixed(jsonData.B118) + this.setHtmlText('kW');
		this.energyData.B120.value = this.toFixed(jsonData.B120) + this.setHtmlText('kWh');
		this.energyData.B122.value = this.toFixed(jsonData.B122) + this.setHtmlText('kW');
		this.energyData.B124.value = this.toFixed(jsonData.B124) + this.setHtmlText('kWh');
		this.energyData.B126.value = this.toFixed(jsonData.B126) + this.setHtmlText('kW');
		this.energyData.B128.value = this.toFixed(jsonData.B128) + this.setHtmlText('kWh');
		this.energyData.B130.value = this.toFixed(jsonData.B130) + this.setHtmlText('W');
		this.energyData.B134.value = this.toFixed(jsonData.B134) + this.setHtmlText('℃');
		this.energyData.B136.value = this.toFixed(jsonData.B136) + this.setHtmlText('℃');
		this.energyData.B138.value = this.toFixed(jsonData.B138) + this.setHtmlText('%');
		this.energyData.B140.value = this.toFixed(jsonData.B140) + this.setHtmlText('%');
		this.energyData.B142.value = this.toFixed(jsonData.B142) + this.setHtmlText('秒');
		this.energyData.B144.value = this.toFixed(jsonData.B144) + this.setHtmlText('秒');
		this.energyData.B146.value = this.toFixed(jsonData.B146) + this.setHtmlText('秒');
		this.energyData.B148.value = this.toFixed(jsonData.B148) + this.setHtmlText('秒');
		this.energyData.B150.value = this.toFixed(jsonData.B150) + this.setHtmlText('℃');
		this.energyData.B152.value = this.toFixed(jsonData.B152) + this.setHtmlText('℃');
		this.energyData.rationPower.value = this.toFixed(jsonData.B126 / 180 * 100) + this.setHtmlText('%');
		this.photovoltaicData.photovoltaicGenerationCurrent = jsonData.B114; //光伏发电电流
		this.photovoltaicData.photovoltaicGenerationVoltage = jsonData.B116; //光伏发电电压
		this.photovoltaicData.gridSupplyPower = jsonData.B118; //（电网）供电功率
		this.photovoltaicData.gridSupplyElectricDaily = jsonData.B120; //（电网）当天供电量
		this.photovoltaicData.photovoltaicGenerationPower = jsonData.B122; //（光伏）发电功率
		this.photovoltaicData.photovoltaicGenerationElectricDaily = jsonData.B124; //（光伏）当天发电量
		this.photovoltaicData.unitPowerConsumption = jsonData.B126; //（机组）耗电功率
		this.photovoltaicData.unitElectricConsumptionDaily = jsonData.B128; //（机组）当天耗电量
		this.photovoltaicData.unitConsumptionPower = jsonData.B130; //机组消耗功率
		
	}
	toFixed(data) {
		return data ? data.toFixed(2) : data;
	}

	setHtmlText(unit) {
		// return unit
		return `${unit}`
	}

	setFaultState(key) {
		switch (key) {
			case 1:
				return '有';
			case 0:

				return '无';
			default:
				return key;;
		}
	}

	setFaultState2(key) {
		switch (key) {
			case 1:
				return '停机';
			case 0:
				return '正常运行';
			default:
				return key;;
		}
	}

	setFaultState3(key) {
		switch (key) {
			case 1:
				return '稳定';
			case 0:
				return '未稳定';
			default:
				return key;;
		}
	}
	setFaultState4(key) {
		switch (key) {
			case 1:
				return '起浮';
			case 0:
				return '不起浮';
			default:
				return key;;
		}
	}

	setFaultState5(key) {
		switch (key) {
			case 1:
				return '故障';
			case 0:
				return '正常';
			default:
				return key;;
		}
	}

	setFaultState6(key) {
		switch (key) {
			case 1:
				return '紧急停机';
			case 0:
				return '不紧急停机';
			default:
				return key;;
		}
	}


	setSwitchState(key) {
		switch (key) {
			case 1:
				return '闭合';
			case 0:
				return '断开';
			default:
				return key;;
		}
	}

	setSwitchState2(key) {
		switch (key) {
			case 1:
				return '开';
			case 0:
				return '关';
			default:
				return key;;
		}
	}

	setSwitchState3(key) {
		switch (key) {
			case 1:
				return '停机';
			case 0:
				return '正常运行';
			default:
				return key;;
		}

	}
	setSwitchState4(key) {
		switch (key) {
			case 1:
				return '启动';
			case 0:
				return '关闭';
			default:
				return key;;
		}
	}
	setSwitchState5(key) {
		switch (key) {
			case 1:
				return '手动';
			case 0:
				return '自动';
			default:
				return key;;
		}
	}

	setSwitchState6(key) {
		switch (key) {
			case 1:
				return '开启';
			case 0:
				return '关闭';
			default:
				return key;;
		}
	}

	setSwitchState7(key) {
		switch (key) {
			case 1:
				return '开机';
			case 0:
				return '关机';
			default:
				return key;;
		}
	}
	getStatusData(jsonData) {
		this.stateData.B0b0.value = this.setFaultState(jsonData.data.B0b0);
		this.stateData.B0b1.value = this.setFaultState(jsonData.data.B0b1)
		this.stateData.B0b2.value = this.setFaultState(jsonData.data.B0b2)
		this.stateData.B0b3.value = this.setFaultState(jsonData.data.B0b3)
		this.stateData.B0b4.state = this.setSwitchState(jsonData.data.B0b4)
		this.stateData.B0b5.state = this.setSwitchState(jsonData.data.B0b5)

		this.stateData.B0b4.value = jsonData.data.B0b4
		this.stateData.B0b5.value = jsonData.data.B0b5

		this.stateData.B0b6.value = this.setFaultState(jsonData.data.B0b6)
		this.stateData.B0b7.value = this.setFaultState(jsonData.data.B0b7)

		this.stateData.B1b0.value = this.setSwitchState2(jsonData.data.B1b0)
		this.stateData.B1b1.value = this.setSwitchState4(jsonData.data.B1b1)
		this.stateData.B1b2.value = this.setSwitchState3(jsonData.data.B1b2)
		this.stateData.B1b3.value = this.setSwitchState5(jsonData.data.B1b3)
		this.stateData.B1b4.value = this.setSwitchState6(jsonData.data.B1b4);
		this.stateData.B1b5.value = this.setFaultState6(jsonData.data.B1b5);
		this.stateData.B1b6.value = this.setSwitchState7(jsonData.data.B1b6);
		this.stateData.B1b7.value = this.setSwitchState2(jsonData.data.B1b7);
		this.stateData.B2b0.value = this.setSwitchState2(jsonData.data.B2b0);
		this.stateData.B2b1.value = this.setSwitchState2(jsonData.data.B2b1);
		this.stateData.B2b2.value = this.setSwitchState2(jsonData.data.B2b2);
		this.stateData.B2b3.value = this.setSwitchState2(jsonData.data.B2b3);
		this.stateData.B2b4.value = this.setSwitchState2(jsonData.data.B2b4);
		this.stateData.B2b5.value = this.setSwitchState(jsonData.data.B2b5);
		this.stateData.B2b6.value = this.setSwitchState2(jsonData.data.B2b6);
		this.stateData.B2b7.value = this.setSwitchState2(jsonData.data.B2b7);

		this.stateData.B3b0.value = this.setSwitchState2(jsonData.data.B3b0);
		this.stateData.B3b1.value = this.setFaultState(jsonData.data.B3b1);
		this.stateData.B3b2.value = this.setFaultState(jsonData.data.B3b2);
		this.stateData.B3b3.value = this.setFaultState(jsonData.data.B3b3);
		this.stateData.B3b4.value = this.setFaultState(jsonData.data.B3b4);
		this.stateData.B3b5.value = this.setFaultState(jsonData.data.B3b5);
		this.stateData.B3b6.value = this.setFaultState(jsonData.data.B3b6);
		this.stateData.B3b7.value = this.setFaultState(jsonData.data.B3b7);

		this.stateData.B4b0.value = this.setFaultState(jsonData.data.B4b0);
		this.stateData.B4b1.value = this.setFaultState(jsonData.data.B4b1);
		this.stateData.B4b2.value = this.setFaultState(jsonData.data.B4b2);
		this.stateData.B4b3.value = this.setFaultState(jsonData.data.B4b3)
		this.stateData.B4b4.value = this.setFaultState(jsonData.data.B4b4);
		this.stateData.B4b5.value = this.setFaultState(jsonData.data.B4b5);
		this.stateData.B4b6.value = this.setFaultState(jsonData.data.B4b6);
		this.stateData.B4b7.value = this.setFaultState(jsonData.data.B4b7);
		this.stateData.B5b0.value = this.setFaultState(jsonData.data.B5b0);
		this.stateData.B5b1.value = this.setFaultState(jsonData.data.B5b1);
		this.stateData.B5b2.value = this.setFaultState(jsonData.data.B5b2);
		this.stateData.B5b3.value = this.setFaultState(jsonData.data.B5b3);
		this.stateData.B5b4.value = this.setFaultState(jsonData.data.B5b4);
		this.stateData.B5b5.value = this.setFaultState(jsonData.data.B5b5);
		this.stateData.B5b6.value = this.setFaultState(jsonData.data.B5b6);
		this.stateData.B5b7.value = this.setFaultState(jsonData.data.B5b7);
		this.stateData.B6b0.value = this.setFaultState(jsonData.data.B6b0);
		this.stateData.B6b1.value = this.setFaultState(jsonData.data.B6b1);
		this.stateData.B6b2.value = this.setFaultState(jsonData.data.B6b2);
		this.stateData.B6b3.value = this.setFaultState(jsonData.data.B6b3);
		this.stateData.B6b4.value = this.setFaultState(jsonData.data.B6b4);
		this.stateData.B6b5.value = this.setFaultState(jsonData.data.B6b5);
		this.stateData.B6b6.value = this.setFaultState(jsonData.data.B6b6)
		this.stateData.B6b7.value = this.setFaultState(jsonData.data.B6b7);
		this.stateData.B7b0.value = this.setFaultState(jsonData.data.B7b0);
		this.stateData.B7b1.value = this.setFaultState(jsonData.data.B7b1);
		this.stateData.B7b2.value = this.setFaultState(jsonData.data.B7b2);
		this.stateData.B7b3.value = this.setFaultState3(jsonData.data.B7b3);
		this.stateData.B7b4.value = this.setFaultState(jsonData.data.B7b4);
		this.stateData.B7b5.value = this.setFaultState(jsonData.data.B7b5);
		this.stateData.B7b6.value = this.setFaultState(jsonData.data.B7b6);
		this.stateData.B7b7.value = this.setFaultState(jsonData.data.B7b7);
		this.stateData.B8b0.value = this.setFaultState(jsonData.data.B8b0);
		this.stateData.B8b1.value = this.setFaultState(jsonData.data.B8b1);
		this.stateData.B8b2.value = this.setFaultState(jsonData.data.B8b2);
		this.stateData.B8b3.value = this.setFaultState(jsonData.data.B8b3);
		this.stateData.B8b4.value = this.setFaultState4(jsonData.data.B8b4);
		this.stateData.B8b5.value = this.setFaultState(jsonData.data.B8b5);
		this.stateData.B8b6.value = this.setFaultState(jsonData.data.B8b6);
		this.stateData.B8b7.value = this.setFaultState(jsonData.data.B8b7);
		this.stateData.B9b0.value = this.setFaultState(jsonData.data.B9b0)
		this.stateData.B9b1.value = this.setFaultState(jsonData.data.B9b1);
		this.stateData.B9b2.value = this.setFaultState(jsonData.data.B9b2);
		this.stateData.B9b3.value = this.setFaultState(jsonData.data.B9b3);
		this.stateData.B9b4.value = this.setFaultState(jsonData.data.B9b4);
		this.stateData.B9b5.value = this.setFaultState(jsonData.data.B9b5);
		this.stateData.B9b6.value = this.setFaultState(jsonData.data.B9b6);
		this.stateData.B9b7.value = this.setFaultState(jsonData.data.B9b7);
		this.stateData.B10b0.value = this.setFaultState(jsonData.data.B10b0);
		this.stateData.B10b1.value = this.setFaultState(jsonData.data.B10b1);
		this.stateData.B10b2.value = this.setFaultState(jsonData.data.B10b2);
		this.stateData.B10b3.value = this.setFaultState(jsonData.data.B10b3);
		this.stateData.B10b4.value = this.setFaultState(jsonData.data.B10b4);
		this.stateData.B10b5.value = this.setFaultState(jsonData.data.B10b5);
		this.stateData.B10b6.value = this.setFaultState(jsonData.data.B10b6);
		this.stateData.B10b7.value = this.setFaultState(jsonData.data.B10b7);
		this.stateData.B11b0.value = this.setFaultState(jsonData.data.B11b0);
		this.stateData.B11b1.value = this.setFaultState(jsonData.data.B11b1);
		this.stateData.B11b2.value = this.setFaultState(jsonData.data.B11b2);
		this.stateData.B11b3.value = this.setFaultState(jsonData.data.B11b3);
		this.stateData.B11b4.value = this.setFaultState(jsonData.data.B11b4);
		this.stateData.B11b5.value = this.setFaultState(jsonData.data.B11b5);
		this.stateData.B11b6.value = this.setFaultState(jsonData.data.B11b6);
		this.stateData.B11b7.value = this.setFaultState(jsonData.data.B11b7);
		this.stateData.B12b0.value = this.setFaultState(jsonData.data.B12b0);
		this.stateData.B12b1.value = this.setFaultState(jsonData.data.B12b1);
		this.stateData.B12b2.value = this.setFaultState(jsonData.data.B12b2);
		this.stateData.B12b3.value = this.setFaultState(jsonData.data.B12b3);
		this.stateData.B12b4.value = this.setFaultState(jsonData.data.B12b4);
		this.stateData.B12b5.value = this.setFaultState(jsonData.data.B12b5);
		this.stateData.B12b6.value = this.setFaultState(jsonData.data.B12b6);
		this.stateData.B12b7.value = this.setFaultState(jsonData.data.B12b7);
		this.stateData.B13b0.value = this.setFaultState(jsonData.data.B13b0);
		this.stateData.B13b1.value = this.setFaultState(jsonData.data.B13b1);
		this.stateData.B13b2.value = this.setFaultState(jsonData.data.B13b2);
		this.stateData.B13b3.value = this.setFaultState(jsonData.data.B13b3);
		this.stateData.B13b4.value = this.setFaultState(jsonData.data.B13b4);
		this.stateData.B13b5.value = this.setFaultState(jsonData.data.B13b5);
		this.stateData.B13b6.value = this.setFaultState(jsonData.data.B13b6);
		this.stateData.B13b7.value = this.setFaultState(jsonData.data.B13b7);
		this.stateData.B14b0.value = this.setFaultState(jsonData.data.B14b0);
		this.stateData.B14b1.value = this.setFaultState(jsonData.data.B14b1);
		this.stateData.B14b2.value = this.setFaultState(jsonData.data.B14b2);
		this.stateData.B14b3.value = this.setFaultState(jsonData.data.B14b3);
		this.stateData.B14b4.value = this.setFaultState(jsonData.data.B14b4);
		this.stateData.B14b5.value = this.setFaultState(jsonData.data.B14b5);
		this.stateData.B14b6.value = this.setFaultState(jsonData.data.B14b6);
		this.stateData.B14b7.value = this.setFaultState(jsonData.data.B14b7);
		this.stateData.B15b0.value = this.setFaultState(jsonData.data.B15b0);
		this.stateData.B15b1.value = this.setFaultState(jsonData.data.B15b1);
		this.stateData.B15b2.value = this.setFaultState(jsonData.data.B15b2);
		this.stateData.B15b3.value = this.setFaultState(jsonData.data.B15b3);
		this.stateData.B15b4.value = this.setFaultState(jsonData.data.B15b4);
		this.stateData.B15b5.value = this.setFaultState(jsonData.data.B15b5);
		this.stateData.B15b6.value = this.setFaultState(jsonData.data.B15b6);
		this.stateData.B15b7.value = this.setFaultState(jsonData.data.B15b7);
		this.stateData.B16b0.value = this.setFaultState(jsonData.data.B16b0);
		this.stateData.B16b1.value = this.setFaultState(jsonData.data.B16b1);
		this.stateData.B16b2.value = this.setFaultState(jsonData.data.B16b2);
		this.stateData.B16b3.value = this.setFaultState(jsonData.data.B16b3);
		this.stateData.B16b4.value = this.setFaultState(jsonData.data.B16b4);
		this.stateData.B16b5.value = this.setFaultState(jsonData.data.B16b5);
		this.stateData.B16b6.value = this.setFaultState(jsonData.data.B16b6);
		this.stateData.B16b7.value = this.setFaultState(jsonData.data.B16b7);
		this.stateData.B17b0.value = this.setFaultState(jsonData.data.B17b0);
		this.stateData.B17b1.value = this.setSwitchState2(jsonData.data.B17b1);
		this.stateData.B17b2.value = this.setSwitchState(jsonData.data.B17b2);
		this.stateData.B17b3.value = this.setSwitchState2(jsonData.data.B17b3);
		this.stateData.B17b4.value = this.setSwitchState7(jsonData.data.B17b4);
		this.stateData.B17b5.value = this.setFaultState(jsonData.data.B17b5);
		this.stateData.B17b6.value = this.setSwitchState6(jsonData.data.B17b6);
		this.stateData.B17b7.value = this.setSwitchState6(jsonData.data.B17b7);
		this.stateData.B18b0.value = this.setFaultState(jsonData.data.B18b0);
		this.stateData.B18b1.value = this.setFaultState(jsonData.data.B18b1);
		this.stateData.B18b2.value = this.setFaultState(jsonData.data.B18b2);
		this.stateData.B18b3.value = this.setFaultState(jsonData.data.B18b3);
		this.stateData.B18b4.value = this.setFaultState(jsonData.data.B18b4);
		this.stateData.B18b5.value = this.setFaultState(jsonData.data.B18b5);
		this.stateData.B18b6.value = this.setFaultState(jsonData.data.B18b6);
		this.stateData.B18b7.value = this.setFaultState(jsonData.data.B18b7);
		this.stateData.B19b0.value = this.setFaultState(jsonData.data.B19b0);
		this.stateData.B19b1.value = this.setFaultState(jsonData.data.B19b1);
		this.stateData.B19b2.value = this.setFaultState5(jsonData.data.B19b2);
		this.stateData.B19b3.value = this.setFaultState5(jsonData.data.B19b3);
		this.stateData.B19b4.value = this.setFaultState5(jsonData.data.B19b4);
		this.stateData.B19b5.value = this.setFaultState5(jsonData.data.B19b5);
		this.stateData.B19b6.value = this.setFaultState5(jsonData.data.B19b6);
		this.stateData.B19b7.value = this.setFaultState5(jsonData.data.B19b7);
		this.stateData.B20b0.value = this.setFaultState(jsonData.data.B20b0);
		this.stateData.B20b1.value = this.setFaultState(jsonData.data.B20b1);
		this.stateData.B20b2.value = this.setFaultState(jsonData.data.B20b2);
		this.stateData.B20b3.value = this.setFaultState(jsonData.data.B20b3);
		this.stateData.B20b4.value = this.setFaultState(jsonData.data.B20b4);
		this.stateData.B20b5.value = this.setFaultState(jsonData.data.B20b5);
		this.stateData.B20b6.value = this.setFaultState(jsonData.data.B20b6);
		this.stateData.B20b7.value = this.setFaultState(jsonData.data.B20b7);
		this.stateData.B21b0.value = this.setFaultState(jsonData.data.B21b0);
		this.stateData.B21b1.value = this.setFaultState(jsonData.data.B21b1);
		this.stateData.B21b2.value = this.setFaultState(jsonData.data.B21b2);
		this.stateData.B21b3.value = this.setFaultState(jsonData.data.B21b3);
	}
	getControlData(jsonData) {
		this.controlData.B0.value = jsonData.data.B0;
		this.controlData.B2.value = jsonData.data.B2;
		this.controlData.B4.value = jsonData.data.B4;
		this.controlData.B6.value = jsonData.data.B6;
		this.controlData.B8.value = jsonData.data.B8;
		this.controlData.B10.value = jsonData.data.B10;
		this.controlData.B12.value = jsonData.data.B12;
		this.controlData.B14.value = jsonData.data.B14;
		this.controlData.B16.value = jsonData.data.B16;
		this.controlData.B18.value = jsonData.data.B18;
		this.controlData.B20.value = jsonData.data.B20;
		this.controlData.B22.value = jsonData.data.B22;
		this.controlData.B24.value = jsonData.data.B24;
		this.controlData.B26.value = jsonData.data.B26;
		this.controlData.B28.value = jsonData.data.B28;
		this.controlData.B30.value = jsonData.data.B30;
		this.controlData.B32.value = jsonData.data.B32;
		this.controlData.B34.value = jsonData.data.B34;
		this.controlData.B36.value = jsonData.data.B36;
		this.controlData.B38.value = jsonData.data.B38;
		this.controlData.B40.value = jsonData.data.B40;
	}
}
export class EnergyData {
	dateTime;
	B0 = {
		name: '冷冻水进水温度',
		value: '--'
	};
	B2 = {
		name: '冷冻水出水温度',
		value: '--'
	};
	B4 = {
		name: '冷却水进水温度',
		value: '--'
	};
	B6 = {
		name: '冷却水出水温度',
		value: '--'
	};
	B8 = {
		name: '地埋管进水温度',
		value: '--'
	};
	B10 = {
		name: '地埋管出水温度',
		value: '--'
	};
	B12 = {
		name: '压缩机排气温度',
		value: '--'
	};
	B14 = {
		name: '压缩机供油温度',
		value: '--'
	};
	B16 = {
		name: '压缩机油箱温度',
		value: '--'
	};

	B18 = {
		name: '光伏运行模式',
		value: '--'
	};
	B20 = {
		name: '电机绕组温度',
		value: '--'
	};
	B22 = {
		name: '变频器环境温度',
		value: '--'
	};
	B24 = {
		name: '冷凝温度',
		value: '--'
	};
	B26 = {
		name: '蒸发温度',
		value: '--'
	};
	B28 = {
		name: '冷凝压力',
		value: '--'
	};
	B30 = {
		name: '蒸发压力',
		value: '--'
	};
	B32 = {
		name: '压缩机供油压力',
		value: '--'
	};
	B34 = {
		name: '压缩机油箱压力',
		value: '--'
	};


	B36 = {
		name: '压缩机供油-油箱压力差',
		value: '--'
	};
	B38 = {
		name: '冷却水进水阀开度',
		value: '--'
	};
	B40 = {
		name: '压缩机导叶运行开度',
		value: '--'
	};
	B42 = {
		name: '冷却水旁通阀开度',
		value: '--'
	};
	B44 = {
		name: '热回收进水温度',
		value: '--'
	};
	B46 = {
		name: '热回收出水温度',
		value: '--'
	};
	B48 = {
		name: '机组负荷',
		value: '--'
	};
	B50 = {
		name: '整流进口温度',
		value: '--'
	};
	B52 = {
		name: '整流中间温度',
		value: '--'
	};
	B54 = {
		name: '整流出口温度',
		value: '--'
	};
	B56 = {
		name: '机组状态',
		value: '--'
	};
	B58 = {
		name: '目标频率',
		value: '--'
	};
	B60 = {
		name: '整流模块温度',
		value: '--'
	};
	B62 = {
		name: '逆变模块温度',
		value: '--'
	};
	B64 = {
		name: '交流R、S相之间的线电压',
		value: '--'
	};
	B66 = {
		name: '交流S、T相之间的线电压',
		value: '--'
	};
	B68 = {
		name: '交流T、R相之间的线电压',
		value: '--'
	};
	B70 = {
		name: '运行频率',
		value: '--'
	};

	B72 = {
		name: '母线电压',
		value: '--'
	};
	B74 = {
		name: '散热器出口温度',
		value: '--'
	};
	B76 = {
		name: '交流R相输入电流',
		value: '--'
	};
	B78 = {
		name: '交流S相输入电流',
		value: '--'
	};
	B80 = {
		name: '交流T相输入电流',
		value: '--'
	};
	B82 = {
		name: '压缩机U相电流',
		value: '--'
	};
	B84 = {
		name: '压缩机V相电流',
		value: '--'
	};
	B86 = {
		name: '压缩机W相电流',
		value: '--'
	};
	B88 = {
		name: '节流电子膨胀阀一',
		value: '--'
	};

	B90 = {
		name: '节流电子膨胀阀二',
		value: '--'
	};
	B92 = {
		name: '压缩机吸气温度',
		value: '--'
	};
	B94 = {
		name: '压缩机运行时间',
		value: '--'
	};
	B96 = {
		name: '压缩机开启次数',
		value: '--'
	};
	B98 = {
		name: '压缩机频繁保护次数',
		value: '--'
	};
	B100 = {
		name: 'A相电压总谐波含量',
		value: '--'
	};
	B102 = {
		name: 'B相电压总谐波含量',
		value: '--'
	};
	B104 = {
		name: 'C相电压总谐波含量',
		value: '--'
	};
	B106 = {
		name: '合相功率因数',
		value: '--'
	};
	B108 = {
		name: 'A相电流总谐波含量',
		value: '--'
	};
	B110 = {
		name: 'B相电流总谐波含量',
		value: '--'
	};
	B112 = {
		name: 'C相电流总谐波含量',
		value: '--'
	};
	B114 = {
		name: '（光伏）发电电流',
		value: '--'
	};
	B116 = {
		name: '（光伏）发电电压',
		value: '--'
	};
	B118 = {
		name: '（电网）供电功率',
		value: '--'
	};
	B120 = {
		name: '（电网）当天供电量',
		value: '--'
	};
	B122 = {
		name: '（光伏）发电功率',
		value: '--'
	};
	B124 = {
		name: '（光伏）当天发电量',
		value: '--'
	};


	B126 = {
		name: '（机组）耗电功率',
		value: '--'
	};
	B128 = {
		name: '（机组）当天耗电量',
		value: '--'
	};
	B130 = {
		name: '机组耗电功率',
		value: '--'
	};
	B134 = {
		name: '蒸发器端温差',
		value: '--'
	};
	B136 = {
		name: '冷凝器端温差',
		value: '--'
	};
	B138 = {
		name: '液阀开度',
		value: '--'
	};
	B140 = {
		name: '气阀开度',
		value: '--'
	};
	B142 = {
		name: '蝶阀开启延时设定',
		value: '--'
	};
	B144 = {
		name: '蝶阀关闭延时设定',
		value: '--'
	};



	B146 = {
		name: '水泵关闭延时设定',
		value: '--'
	};
	B148 = {
		name: '风机运行延时设定',
		value: '--'
	};
	B150 = {
		name: '冷却塔开启温度设定',
		value: '--'
	};
	B152 = {
		name: '冷却塔关闭温度设定',
		value: '--'
	};
	photovoltaicGenerationMonth = {
		name: '',
		value: '--'
	};
	totalGeneratingCapacity = {
		name: '',
		value: '--'
	};
	gridSupplyElectricMonthly = {
		name: '',
		value: '--'
	};
	gridSupplyElectricTotal = {
		name: '',
		value: '--'
	};

	unitElectricConsumptionmonthly = {
		name: '',
		value: '--'
	};
	totalElectricConsumption = {
		name: '',
		value: '--'
	};
	rationPower = {
		name: '主机功率百分比',
		value: '--'
	};
	//光伏运行状态
	ftPowerData = '--'

	//离心机运行状态
	ctPowerData = '--'

	gridSupplyPower = "--"

}
export class StateData {
	B0b0 = {
		name: '机组频繁锁定标志位',
		value: '--'
	};
	B0b1 = {
		name: '通讯故障标志位',
		value: '--'
	};
	B0b2 = {
		name: '压缩机频繁保护报警',
		value: '--'
	};
	B0b3 = {
		name: '机组频繁启停保护',
		value: '--'
	};
	B0b4 = {
		name: '冷冻水流开关状态',
		value: '--',
		state: '--'
	};
	B0b5 = {
		name: '冷却水流开关状态',
		value: '--',
		state: '--'
	};
	B0b6 = {
		name: '冷凝器结垢提醒',
		value: '--'
	};
	B0b7 = {
		name: '待机电流异常锁定',
		value: '--'
	};

	B1b0 = {
		name: '开关机状态',
		value: '--'
	};
	B1b1 = {
		name: '压缩机启动',
		value: '--'
	};
	B1b2 = {
		name: '保护停机标志位',
		value: '--'
	};
	B1b3 = {
		name: '在线清洗装置模式设定',
		value: '--'
	};
	B1b4 = {
		name: '在线清洗装置手动控制设定',
		value: '--'
	};
	B1b5 = {
		name: '紧急停机',
		value: '--'
	};
	B1b6 = {
		name: '冷却设备',
		value: '--'
	};
	B1b7 = {
		name: '除湿电磁阀',
		value: '--'
	};

	B2b0 = {
		name: '压缩机主交流接触器',
		value: '--'
	};
	B2b1 = {
		name: '压缩机油泵',
		value: '--'
	};
	B2b2 = {
		name: '压缩机油加热器',
		value: '--'
	};
	B2b3 = {
		name: '压缩机故障输出',
		value: '--'
	};
	B2b4 = {
		name: '热回收水泵',
		value: '--'
	};
	B2b5 = {
		name: '热回收水流开关',
		value: '--'
	};
	B2b6 = {
		name: '使用侧水泵',
		value: '--'
	};
	B2b7 = {
		name: '热源侧水泵',
		value: '--'
	};
	B3b0 = {
		name: '冷却塔风机',
		value: '--'
	};
	B3b1 = {
		name: '冷冻水进水温度传感器故障',
		value: '--'
	};
	B3b2 = {
		name: '冷冻水出水温度传感器故障',
		value: '--'
	};
	B3b3 = {
		name: '冷却水进水温度传感器故障',
		value: '--'
	};
	B3b4 = {
		name: '冷却水出水温度传感器故障',
		value: '--'
	};
	B3b5 = {
		name: '冷凝压力传感器故障',
		value: '--'
	};
	B3b6 = {
		name: '蒸发压力传感器故障',
		value: '--'
	};
	B3b7 = {
		name: '冷冻水低流量保护',
		value: '--'
	};

	B4b0 = {
		name: '冷却水低流量保护',
		value: '--'
	};
	B4b1 = {
		name: '低压保护',
		value: '--'
	};
	B4b2 = {
		name: '高压保护',
		value: '--'
	};
	B4b3 = {
		name: '防冻保护',
		value: '--'
	};
	B4b4 = {
		name: '控制柜通信故障',
		value: '--'
	};
	B4b5 = {
		name: '压缩机供油温度传感器故障',
		value: '--'
	};
	B4b6 = {
		name: '压缩机电机绕组温度传感器故障',
		value: '--'
	};
	B4b7 = {
		name: '压缩机供油压力传感器故障',
		value: '--'
	};


	B5b0 = {
		name: '压缩机油箱压力传感器故障',
		value: '--'
	};
	B5b1 = {
		name: '压缩机导叶传感器故障',
		value: '--'
	};
	B5b2 = {
		name: '压缩机供油温度高温保护',
		value: '--'
	};
	B5b3 = {
		name: '压缩机油压差保护',
		value: '--'
	};
	B5b4 = {
		name: '压缩机油泵过载保护',
		value: '--'
	};
	B5b5 = {
		name: '压缩机电机绕组过热保护（开关）',
		value: '--'
	};
	B5b6 = {
		name: '压缩机启动柜综合故障',
		value: '--'
	};
	B5b7 = {
		name: '压缩机启动故障',
		value: '--'
	};
	B6b0 = {
		name: '压缩机喘振保护',
		value: '--'
	};
	B6b1 = {
		name: '压缩机电流不平衡保护',
		value: '--'
	};
	B6b2 = {
		name: '压缩机待机电流异常/启动柜分闸异常',
		value: '--'
	};
	B6b3 = {
		name: '压缩机电流高保护',
		value: '--'
	};
	B6b4 = {
		name: '压缩机电机绕组过热保护（温度）',
		value: '--'
	};
	B6b5 = {
		name: '压缩机油泵电源逆缺相保护',
		value: '--'
	};
	B6b6 = {
		name: '变频器通信故障',
		value: '--'
	};
	B6b7 = {
		name: '压缩机油箱温度传感器故障',
		value: '--'
	};

	B7b0 = {
		name: '压缩机导叶报警',
		value: '--'
	};
	B7b1 = {
		name: '压缩机吸气温度传感器故障',
		value: '--'
	};
	B7b2 = {
		name: '压缩机逆缺相保护',
		value: '--'
	};
	B7b3 = {
		name: '轴已悬浮稳定',
		value: '--'
	};
	B7b4 = {
		name: '机型拨码错误',
		value: '--'
	};
	B7b5 = {
		name: '节流电子膨胀阀1通信故障',
		value: '--'
	};
	B7b6 = {
		name: '节流电子膨胀阀2通信故障',
		value: '--'
	};
	B7b7 = {
		name: '电流检测板通信故障',
		value: '--'
	};

	B8b0 = {
		name: '冷却设备通信故障',
		value: '--'
	};
	B8b1 = {
		name: '冷却设备故障',
		value: '--'
	};
	B8b2 = {
		name: '可调扩压器报警',
		value: '--'
	};
	B8b3 = {
		name: '可调扩压器传感器报警',
		value: '--'
	};
	B8b4 = {
		name: '轴承起浮命令',
		value: '--'
	};
	B8b5 = {
		name: '轴承控制综合故障',
		value: '--'
	};
	B8b6 = {
		name: '变频器未准备好',
		value: '--'
	};
	B8b7 = {
		name: '变频油泵通信故障',
		value: '--'
	};
	B9b0 = {
		name: '变频油泵故障',
		value: '--'
	};
	B9b1 = {
		name: '逆功率控制器异常',
		value: '--'
	};
	B9b2 = {
		name: 'F1:485通信中断',
		value: '--'
	};
	B9b3 = {
		name: 'F2：ARM生命信号中断',
		value: '--'
	};
	B9b4 = {
		name: 'F3：主断中继无法分开',
		value: '--'
	};
	B9b5 = {
		name: 'F4：主断无法分开',
		value: '--'
	};
	B9b6 = {
		name: 'F5：主断中继无法闭合',
		value: '--'
	};
	B9b7 = {
		name: 'F6：充电超时',
		value: '--'
	};

	B10b0 = {
		name: 'F7：充电后未及时合主断路器',
		value: '--'
	};
	B10b1 = {
		name: 'F8：中间电压过低',
		value: '--'
	};
	B10b2 = {
		name: 'F9：三相输入电流不平衡',
		value: '--'
	};
	B10b3 = {
		name: 'F10：光伏空调接地保护',
		value: '--'
	};
	B10b4 = {
		name: 'F21：电流传感器故障',
		value: '--'
	};
	B10b5 = {
		name: 'F45：ADIO板通信故障',
		value: '--'
	};
	B10b6 = {
		name: 'F46：ADIO板通信故障偶校验故障',
		value: '--'
	};
	B10b7 = {
		name: 'F47：采集盒1通信故障',
		value: '--'
	};


	B11b0 = {
		name: 'F48：采集盒2通信故障',
		value: '--'
	};
	B11b1 = {
		name: 'F54：模块1通信故障',
		value: '--'
	};
	B11b2 = {
		name: 'F55：模块2通信故障',
		value: '--'
	};
	B11b3 = {
		name: 'F61：交流侧防雷设备故障',
		value: '--'
	};
	B11b4 = {
		name: 'F62：直流侧防雷设备故障',
		value: '--'
	};
	B11b5 = {
		name: 'F79：模块1温度过高故障（硬件）',
		value: '--'
	};
	B11b6 = {
		name: 'F80：模块2温度过高故障（硬件）',
		value: '--'
	};
	B11b7 = {
		name: 'F81：模块1温度传感器故障',
		value: '--'
	};
	B12b0 = {
		name: 'F84：模块2温度传感器故障',
		value: '--'
	};
	B12b1 = {
		name: 'F90：光纤硬线故障',
		value: '--'
	};
	B12b2 = {
		name: 'F91：模块1通信故障',
		value: '--'
	};
	B12b3 = {
		name: 'F93：模块2通信故障',
		value: '--'
	};
	B12b4 = {
		name: '液阀传感器故障',
		value: '--'
	};
	B12b5 = {
		name: '冷凝器液位传感器故障',
		value: '--'
	};
	B12b6 = {
		name: '气阀传感器故障',
		value: '--'
	};
	B12b7 = {
		name: '冷冻水进水压力传感器故障',
		value: '--'
	};


	B13b0 = {
		name: '冷冻水出水压力传感器故障',
		value: '--'
	};
	B13b1 = {
		name: '地埋管进水温度传感器故障',
		value: '--'
	};
	B13b2 = {
		name: '地埋管出水温度传感器故障',
		value: '--'
	};
	B13b3 = {
		name: '地埋管水低流量保护',
		value: '--'
	};
	B13b4 = {
		name: '热回收水低流量保护',
		value: '--'
	};
	B13b5 = {
		name: '热回收进水温度传感器故障',
		value: '--'
	};
	B13b6 = {
		name: '热回收出水温度传感器故障',
		value: '--'
	};
	B13b7 = {
		name: 'F109：直流过流门槛反馈故障',
		value: '--'
	};

	B14b0 = {
		name: '网压过高',
		value: '--'
	};
	B14b1 = {
		name: '网压过低',
		value: '--'
	};
	B14b2 = {
		name: '主机硬线启动信号断开',
		value: '--'
	};
	B14b3 = {
		name: '充电后未及时合主断',
		value: '--'
	};
	B14b4 = {
		name: '变频器功率模块故障',
		value: '--'
	};
	B14b5 = {
		name: '变频器接地保护',
		value: '--'
	};
	B14b6 = {
		name: '变频器与主控通道信号异常',
		value: '--'
	};
	B14b7 = {
		name: '变频器输出电流异常',
		value: '--'
	};
	B15b0 = {
		name: '变频器输入电流异常',
		value: '--'
	};
	B15b1 = {
		name: '电网异常保护',
		value: '--'
	};
	B15b2 = {
		name: '变频器直流电压异常',
		value: '--'
	};
	B15b3 = {
		name: '变频器超温保护',
		value: '--'
	};
	B15b4 = {
		name: '变频器内部通信故障',
		value: '--'
	};
	B15b5 = {
		name: '变频器内部开关动作异常',
		value: '--'
	};
	B15b6 = {
		name: '变频器主断路器异常分析',
		value: '--'
	};
	B15b7 = {
		name: '变频器光纤线故障',
		value: '--'
	};

	B16b0 = {
		name: '变频器温度传感器故障',
		value: '--'
	};
	B16b1 = {
		name: '光伏防雷设备保护',
		value: '--'
	};
	B16b2 = {
		name: '光伏输入过流',
		value: '--'
	};
	B16b3 = {
		name: '变频器电流传感器故障',
		value: '--'
	};
	B16b4 = {
		name: '电机堵转',
		value: '--'
	};
	B16b5 = {
		name: '变频器锁相异常保护',
		value: '--'
	};
	B16b6 = {
		name: '压缩机启动柜综合故障',
		value: '--'
	};
	B16b7 = {
		name: '变频器综合故障',
		value: '--'
	};

	B17b0 = {
		name: '变频器内部开关动作异常',
		value: '--'
	};
	B17b1 = {
		name: '热水泵',
		value: '--'
	};
	B17b2 = {
		name: '地埋管流水开关',
		value: '--'
	};
	B17b3 = {
		name: '在线清洗装置',
		value: '--'
	};
	B17b4 = {
		name: '干触点开关机状态',
		value: '--'
	};
	B17b5 = {
		name: 'F1：485通信故障',
		value: '--'
	};
	B17b6 = {
		name: '节能模式选择设定',
		value: '--'
	};
	B17b7 = {
		name: '进出水智能切换设定',
		value: '--'
	};
	B18b0 = {
		name: 'F58：PFC与电机CAN通讯故障',
		value: '--'
	};
	B18b1 = {
		name: 'F59：失步故障',
		value: '--'
	};
	B18b2 = {
		name: 'F60：失速故障',
		value: '--'
	};
	B18b3 = {
		name: 'F61：电机与轴承CAN通讯故障',
		value: '--'
	};
	B18b4 = {
		name: 'F79：整流模块温度过高故障',
		value: '--'
	};
	B18b5 = {
		name: 'F80：逆变模块温度过高故障',
		value: '--'
	};
	B18b6 = {
		name: 'F85：中间电压过压故障、母线过压',
		value: '--'
	};
	B18b7 = {
		name: 'F24：变频器温度传感器故障',
		value: '--'
	};

	B19b0 = {
		name: 'F25：电机温度传感器故障',
		value: '--'
	};
	B19b1 = {
		name: 'F40：电流传感器故障',
		value: '--'
	};
	B19b2 = {
		name: '冷冻水泵故障',
		value: '--'
	};
	B19b3 = {
		name: '冷冻水泵故障',
		value: '--'
	};
	B19b4 = {
		name: '冷却塔风机一故障',
		value: '--'
	};
	B19b5 = {
		name: '冷却塔风机二故障',
		value: '--'
	};
	B19b6 = {
		name: '冷却塔风机三故障',
		value: '--'
	};
	B19b7 = {
		name: '冷却塔风机四故障',
		value: '--'
	};

	B20b0 = {
		name: 'F1：通信故障',
		value: '--'
	};
	B20b1 = {
		name: 'F6：充电回路故障',
		value: '--'
	};
	B20b2 = {
		name: 'F52：网侧过欠频故障',
		value: '--'
	};
	B20b3 = {
		name: 'F63：网侧相序故障',
		value: '--'
	};
	B20b4 = {
		name: 'F70：紧急停机故障',
		value: '--'
	};
	B20b5 = {
		name: 'F72：电机启动故障',
		value: '--'
	};
	B20b6 = {
		name: 'F75：网侧电压过压故障',
		value: '--'
	};
	B20b7 = {
		name: 'F76：网侧电压欠压故障',
		value: '--'
	};

	B21b0 = {
		name: 'F81：温度传感器故障',
		value: '--'
	};
	B21b1 = {
		name: 'F91：光纤通信故障',
		value: '--'
	};
	B21b2 = {
		name: 'F96：冷却机故障停机',
		value: '--'
	};
	B21b3 = {
		name: 'F97：油泵故障停机',
		value: '--'
	};
}


export class ControlData {
	B0 = {
		name: '干触点控制开关',
		value: ''
	}
	B2 = {
		name: '开关机',
		value: ''
	}
	B4 = {
		name: '运行模式设定',
		value: ''
	}
	B6 = {
		name: '冷冻水出水温度设定',
		value: ''
	}
	B8 = {
		name: '热水出水温度设定',
		value: ''
	}
	B10 = {
		name: '机组运行最大负荷设定',
		value: ''
	}
	B12 = {
		name: '并网目标功率百分比设定',
		value: ''
	}
	B14 = {
		name: '水阀动作压差设定一',
		value: ''
	}
	B16 = {
		name: '水阀动作压差设定',
		value: ''
	}
	B18 = {
		name: '冷却水进水阀最小开度设定',
		value: ''
	}
	B20 = {
		name: '水阀动作周期设定',
		value: ''
	}
	B22 = {
		name: '制冷待机温度设定',
		value: ''
	}
	B24 = {
		name: '制冷待机重启温度设定',
		value: ''
	}
	B26 = {
		name: '制热待机温度设定',
		value: ''
	}
	B28 = {
		name: '制热待机重启温度设定',
		value: ''
	}
	B30 = {
		name: '蝶阀开启延时设定',
		value: ''
	}
	B32 = {
		name: '蝶阀关闭延时设定',
		value: ''
	}
	B34 = {
		name: '水泵关闭延时设定',
		value: ''
	}
	B36 = {
		name: '风机运行延时设定',
		value: ''
	}
	B38 = {
		name: '冷却塔开启温度设定',
		value: ''
	}
	B40 = {
		name: '冷却塔关闭温度设定',
		value: ''
	}


}
export class Meter1D02EnergyDataModel {
	dateTime;
	photovoltaicGenerationCurrent = "--"; //光伏发电电流
	photovoltaicGenerationVoltage = "--"; //光伏发电电压
	gridSupplyPower = "--"; //（电网）供电功率
	gridSupplyElectricDaily = "--"; //（电网）当天供电量
	photovoltaicGenerationPower = "--"; //（光伏）发电功率
	photovoltaicGenerationElectricDaily = "--"; //（光伏）当天发电量
	unitPowerConsumption = "--"; //（机组）耗电功率
	unitElectricConsumptionDaily = "--"; //（机组）当天耗电量
	unitConsumptionPower = "--"; //机组消耗功率
}