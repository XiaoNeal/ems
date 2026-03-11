// import { IWebSocketDeviceData } from './Iwebsocket-device-data.model';
// import { DeviceDataType } from '../enum/device-data-type.enum';
// import { DeviceDataType } from '../devices/enum/device-data-type.enum';

export default class DeviceBase {
    // category; // 设备类型
    // name; // 设备名称
    // protocolVersion; // 协议版本
    address; // 设备地址
    barCode; // 网关
    // deviceId; // 设备id
    deviceType;

    constructor() {}

    getDeviceData(jsonData, barCode) {
        // 设备信息数据
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

            default:
                break;
        }
    }

    getBaseData(jsonData) {
        /*   this._category = jsonData.data.B0;
          this._name = jsonData.data.B2;
          this._protocolVersion = jsonData.data.B12;
          this._address = jsonData.data.B13;
          this._communicationStatus = jsonData.data.B21; */
        // model.baseInfo.B24 = jsonData.data.B24;   //奇怪？
        // model.baseInfo.B27 = jsonData.data.B27;
    }

    getEnergyData(jsonData, jsonData2, barCode) {

    }
    getStatusData(jsonData) {

    }
    getControlData(jsonData) {

    }
}