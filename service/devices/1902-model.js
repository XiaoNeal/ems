import DeviceBase from "./device-base.model"


export class Model1902 extends DeviceBase {
	energyData;

	constructor() {
		super();
		this.energyData = new FlowMeterEnergyDataModel();
	}

	getEnergyData(jsonData) {
	
		this.energyData.flow = this.toFixed(jsonData.B4) 
		this.energyData.totalFlowStardard = this.toFixed(jsonData.B14)
		this.energyData.useQuantity = this.toFixed(jsonData.B14)
	}

	getStatusData(jsonData) {
		this.energyData.temperature = this.toFixed(jsonData.data.B0)
		this.energyData.pressure = this.toFixed(jsonData.data.B2 / 1000)
	}

	setHtmlText(unit) {
		return `<span style='color:#fff;font-size:0.8rem'> ${unit}</span>`
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

}
class FlowMeterEnergyDataModel {
	temperature= "--"; //温度
	pressure= "--"; //压力
	pressureUnit; //压力单位
	frontCompensatoryFlow= "--"; //补偿前流量
	laterCompensatoryFlow= "--"; //补偿后流量
	accumulativeFlow= "--"; //累计流量
	density= "--"; //密度
	useQuantity= "--";
	flow= "--";
	purity= "--";
	temperatureDewPoint= "--"; //压力露点
	atmosphericDewPoint= "--"; //常压露点
	transientFlowCondition; //工况瞬时流量
	totalFlowCondition; //工况累计流量
	transientFlowStardard; //标况瞬时流量
	totalFlowStardard='--'; //标况累计流量
}