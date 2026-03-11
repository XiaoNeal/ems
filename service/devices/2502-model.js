import DeviceBase from "./device-base.model"

class Model2502 extends DeviceBase {

	energyData;
	stateData;

	constructor() {
		super();
		this.energyData = new EnergyData();
		this.stateData = new StateData();
		// var energyData = ref(EnergyData)
	}

	getEnergyData(jsonData, jsonData2,barCode) {
		// this.energyData.dateTime = jsonData2.dateTime
		// console.log(jsonData)
		this.energyData.waterFlow = (jsonData.B0);
		this.energyData.speed = (jsonData.B4);
		this.energyData.positiveCum = parseFloat(jsonData.B8 + "." + (jsonData.B12)).toFixed(2);
		this.energyData.reverseCum = parseFloat(jsonData.B16 + "." + jsonData.B20).toFixed(2);
	}



	getStatusData(jsonData) {

	}

}
class EnergyData {
	waterConsumption = "--"; //用量
	waterFlow = "--";
	temperature = "--";
	pressure = "--";
	speed = '--';
	positiveCum = '--' //正向累计流量
	reverseCum = '--' //反向累计流量'
	dateTime = '--'

}

class StateData {}

export {
	Model2502
};