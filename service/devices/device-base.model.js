export default class DeviceBase {
    address; // 设备地址
    barCode; // 网关
    deviceType;

    constructor() {}

    getDeviceData(jsonData, barCode) {
        // dataType 归一化：兼容后端传字符串('1')与数字(1)两种格式，本地/生产不一致导致 switch 全 miss
        const type = String(jsonData.dataType);
        switch (type) {
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