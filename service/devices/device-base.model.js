export default class DeviceBase {
    address; // 设备地址
    barCode; // 网关
    deviceType;

    constructor() {}

    getDeviceData(jsonData, barCode) {
        switch (jsonData.dataType) {
            case '1':
                this.getBaseData(jsonData);
                break;
            case '2':
                this.getEnergyData(jsonData.data, jsonData, barCode);
                break;
            case '3':
                this.getStatusData(jsonData);
                break;
            case '4':
                this.getControlData(jsonData);
                break;
        }
    }

    getBaseData(jsonData) {}

    getEnergyData(jsonData, jsonData2, barCode) {}
    
    getStatusData(jsonData) {}
    
    getControlData(jsonData) {}
}