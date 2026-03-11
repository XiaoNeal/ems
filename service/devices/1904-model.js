import DeviceBase from "./device-base.model"

export class Model1904 extends DeviceBase {
	energyData;
	constructor() {
		super();

		this.energyData = new EnergyModel();

	}

	getEnergyData(jsonData) {}

	getStatusData(jsonData) {
		this.energyData.totalFlowStardard1 = this.toFixed(jsonData.data.B0)
		this.energyData.transientFlowStardard1 = this.toFixed(jsonData.data.B4)
		this.energyData.transientFlowCondition1 = this.toFixed(jsonData.data.B8)
		this.energyData.temperature1 = this.toFixed(jsonData.data.B12)
		this.energyData.pressure1 = this.toFixed(jsonData.data.B16)
		this.energyData.allowance1 = this.toFixed(jsonData.data.B20)
		this.energyData.totalFlowStardard2 = this.toFixed(jsonData.data.B24)
		this.energyData.transientFlowStardard2 = this.toFixed(jsonData.data.B28)
		this.energyData.transientFlowCondition2 = this.toFixed(jsonData.data.B32)
		this.energyData.temperature2 = this.toFixed(jsonData.data.B36)
		this.energyData.pressure2 = this.toFixed(jsonData.data.B40)
		this.energyData.allowance2 = this.toFixed(jsonData.data.B44)
		this.energyData.inletPressure2 = jsonData.data.B48
		this.energyData.totalFlowStardard3 = this.toFixed(jsonData.data.B52)
		this.energyData.transientFlowStardard3 = this.toFixed(jsonData.data.B56)
		this.energyData.transientFlowCondition3 = this.toFixed(jsonData.data.B60)
		this.energyData.temperature3 = this.toFixed(jsonData.data.B64)
		this.energyData.pressure3 = this.toFixed(jsonData.data.B68)
		this.energyData.allowance3 = this.toFixed(jsonData.data.B72)
		this.energyData.totalFlowStardard4 = this.toFixed(jsonData.data.B76)
		this.energyData.transientFlowStardard4 = this.toFixed(jsonData.data.B80)
		this.energyData.transientFlowCondition4 = this.toFixed(jsonData.data.B84)
		this.energyData.temperature4 = this.toFixed(jsonData.data.B88)
		this.energyData.pressure4 = this.toFixed(jsonData.data.B92)
		this.energyData.allowance4 = this.toFixed(jsonData.data.B96)
		this.energyData.inletPressure4 = jsonData.data.B100
		this.energyData.totalFlowStardard5 = this.toFixed(jsonData.data.B104)
		this.energyData.transientFlowStardard5 = this.toFixed(jsonData.data.B108)
		this.energyData.transientFlowCondition5 = this.toFixed(jsonData.data.B112)
		this.energyData.temperature5 = this.toFixed(jsonData.data.B116)
		this.energyData.pressure5 = this.toFixed(jsonData.data.B120)
		this.energyData.allowance5 = this.toFixed(jsonData.data.B124)
		this.energyData.totalFlowStardard6 = this.toFixed(jsonData.data.B128)
		this.energyData.transientFlowStardard6 = this.toFixed(jsonData.data.B132)
		this.energyData.transientFlowCondition6 = this.toFixed(jsonData.data.B136)
		this.energyData.temperature6 = this.toFixed(jsonData.data.B140)
		this.energyData.pressure6 = this.toFixed(jsonData.data.B144)
		this.energyData.allowance6 = this.toFixed(jsonData.data.B148)
		this.energyData.inletPressure6 = jsonData.data.B152
		this.energyData.totalFlowStardard7 = this.toFixed(jsonData.data.B156)
		this.energyData.transientFlowStardard7 = this.toFixed(jsonData.data.B160)
		this.energyData.transientFlowCondition7 = this.toFixed(jsonData.data.B164)
		this.energyData.temperature7 = this.toFixed(jsonData.data.B168)
		this.energyData.pressure7 = this.toFixed(jsonData.data.B172)
		this.energyData.allowance7 = this.toFixed(jsonData.data.B176)
		this.energyData.totalFlowStardard8 = this.toFixed(jsonData.data.B180)
		this.energyData.transientFlowStardard8 = this.toFixed(jsonData.data.B184)
		this.energyData.transientFlowCondition8 = this.toFixed(jsonData.data.B188)
		this.energyData.temperature8 = this.toFixed(jsonData.data.B192)
		this.energyData.pressure8 = this.toFixed(jsonData.data.B196)
		this.energyData.allowance8 = this.toFixed(jsonData.data.B200)
		this.energyData.inletPressure8 = jsonData.data.B204
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

}

export class EnergyModel {
	transientFlowStardard1
	totalFlowStardard1
	transientFlowCondition1
	temperature1
	pressure1
	allowance1
	transientFlowStardard2
	totalFlowStardard2
	transientFlowCondition2
	temperature2
	pressure2
	allowance2
	inletPressure2
	transientFlowStardard3
	totalFlowStardard3
	transientFlowCondition3
	temperature3
	pressure3
	allowance3
	transientFlowStardard4
	totalFlowStardard4
	transientFlowCondition4
	temperature4
	pressure4
	allowance4
	inletPressure4
	transientFlowStardard5
	totalFlowStardard5
	transientFlowCondition5
	temperature5
	pressure5
	allowance5
	transientFlowStardard6
	totalFlowStardard6
	transientFlowCondition6
	temperature6
	pressure6
	allowance6
	inletPressure6
	transientFlowStardard7
	totalFlowStardard7
	transientFlowCondition7
	temperature7
	pressure7
	allowance7
	transientFlowStardard8
	totalFlowStardard8
	transientFlowCondition8
	temperature8
	pressure8
	allowance8
	inletPressure8
}