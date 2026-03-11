import DeviceBase from "./device-base.model"


export class Model1318 extends DeviceBase {
    energyData;
   
  
    constructor() {
        super();
     
        this.energyData = new FlowMeterEnergyDataModel();
       

    }

    getEnergyData(jsonData) {
        if (jsonData.B0 < 0) return
        this.energyData.transientFlowCondition = this.toFixed(jsonData.B0);
        this.energyData.totalFlowCondition = this.toFixed(jsonData.B4);
        this.energyData.transientFlowStardard = this.toFixed(jsonData.B12);
        this.energyData.totalFlowStardard = this.toFixed(jsonData.B16);

        this.energyData.flow = this.toFixed(jsonData.B12);
        this.energyData.useQuantity = this.toFixed(jsonData.B16);
        // this.airCompressioFlownData.transientFlowStardard.value = this.stateData.flow.value = this.toFixed(jsonData.B12) + this.unitChange(jsonData.B12) + this.setHtmlText('m³/h');;
        // this.airCompressioFlownData.totalFlowStardard.value = this.stateData.accumulativeFlow.value = this.toFixed(jsonData.B16) + this.unitChange(jsonData.B16) + this.setHtmlText('m³');;
}

    getStatusData(jsonData) {
        if (jsonData.data.B0 < 0) return
        this.energyData.temperature = this.toFixed(jsonData.data.B0);
        this.energyData.pressure = this.toFixed(jsonData.data.B4);
        this.energyData.pressureUnit = jsonData.data.B8

        // this.airCompressioFlownData.temperature.value = this.toFixed(jsonData.data.B0) + this.setHtmlText('℃');

        // this.stateData.temperature.value = this.toFixed(jsonData.data.B0) + this.setHtmlText('℃');
        // this.stateData.pressure.value = this.getPressureData(jsonData.data.B4, jsonData.data.B8) + this.setHtmlText('Mpa');
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
// export class StatusDataModel {
//     temperature: any = { name: '温度', value: '--' };
//     flow: any = { name: '标况瞬时流量', value: '--' };
//     pressure: any = { name: '压力', value: '--' };
//     accumulativeFlow: any = { name: '标况累计流量', value: '--' };
//     temperatureDewPoint: any = { name: '压力露点', value: '--' };
//     atmosphericDewPoint: any = { name: '常压露点', value: '--' };
// }

// export class AirCompressionFlowModel {
//     temperature: any = { name: '介质温度', value: '--' };
//     // transientFlowCondition: any = { name: '工况瞬时流量', value: '--' };
//     // totalFlowCondition: any = { name: '工况累计流量', value: '--' };

//     transientFlowStardard: any = { name: '标况瞬时流量', value: '--' };
//     totalFlowStardard: any = { name: '标况累计流量', value: '--' };
// }
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
	transientFlowCondition="--"; //工况瞬时流量
	totalFlowCondition ="--"; //工况累计流量
	transientFlowStardard="--"; //标况瞬时流量
	totalFlowStardard='--'; //标况累计流量
}