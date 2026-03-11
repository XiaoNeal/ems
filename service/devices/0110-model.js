
import DeviceBase from "./device-base.model"

class Model0110 extends DeviceBase {

    energyData;
    stateData;

    constructor() {
        super();
        this.energyData = new EnergyData();
        this.stateData = new StateData();
        // var energyData = ref(EnergyData)
    }

    getEnergyData(jsonData, jsonData2, barCode) {
        // this.energyData.power = jsonData.B0
        this.energyData.frameTime = jsonData2.dateTime
       
        this.energyData.power = (jsonData.B84/1000).toFixed(2) 

    }

  

    getStatusData(jsonData) {
       
    }

}
class EnergyData {
    frameTime;
	power = '--';

}

class StateData {  
}

export { Model0110 };

