import DeviceBase from "./device-base.model"


export class Model130B extends DeviceBase {
	energyData;


	constructor() {
		super();

		this.energyData = new FlowMeterEnergyDataModel();


	}

	getEnergyData(jsonData) {
	
	}

	getStatusData(jsonData) {
		this.energyData.temperature = this.toFixed(jsonData.data.B0);
		// this.airCompressionData.relativeHumidity.value = jsonData.data.B4 + this.setHtmlText('%rH');
		this.energyData.pressure = this.toFixed(jsonData.data.B8);
		this.energyData.temperatureDewPoint = this.toFixed(jsonData.data.B12);
		this.energyData.atmosphericDewPoint = this.toFixed(jsonData.data.B16);
	}

	toFixed(data) {
		return !isNaN(parseFloat(data)) ? this.dataChange(data) : '--'
	}


	dataChange(data) {

		return data.toFixed(2)
	}

	unitChange(data) {

		return ''
	}


	getPressureData(pressureData, pressureUnit) {
		//压力单位 0 表示Kpa;1表示Mpa;2表示Pa; 无表示bar
		if (pressureData) {
			if (pressureUnit == 0) {
				return (pressureData / 1000).toFixed(2)

			} else if (pressureUnit == 1) {
				return (pressureData).toFixed(2)

			} else if (pressureUnit == 2) {
				return (pressureData / 1000 / 1000).toFixed(2)
			} else if (parseFloat(pressureData)) {
				// return (data.ameterData.energyData.pressure / 10).toFixed(2)
				return (parseFloat(pressureData)).toFixed(2)
			} else return '--'

		} else {
			return "--"
		}
	}

	setHtmlText(unit) {
		return `<span style='color:#fff;font-size:0.8rem'> ${unit}</span>`
	}
}

class FlowMeterEnergyDataModel {
	temperature = "--"; //温度
	pressure = "--"; //压力
	pressureUnit; //压力单位
	frontCompensatoryFlow = "--"; //补偿前流量
	laterCompensatoryFlow = "--"; //补偿后流量
	accumulativeFlow = "--"; //累计流量
	density = "--"; //密度
	useQuantity = "--";
	flow = "--";
	purity = "--";
	temperatureDewPoint = "--"; //压力露点
	atmosphericDewPoint = "--"; //常压露点
	transientFlowCondition; //工况瞬时流量
	totalFlowCondition; //工况累计流量
	transientFlowStardard; //标况瞬时流量
	totalFlowStardard = '--'; //标况累计流量
}