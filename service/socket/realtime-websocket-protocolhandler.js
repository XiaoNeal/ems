// import { EnergyGateway } from '../devices/energy-gateway.model';
// import { DeviceBase } from '../devices/device-type/device-base.model';
import store from '@/store';
import {
	DeviceFactory
} from '../devices/device-factory.model';
// import store from '../devices/model'



export default class RealTimeWebSokcetProtocolHandler {

	constructor() {

	}


	initDevice(jsonData, gateway, deviceList) {
		// console.log(jsonData,'-----------111111-111111')
		let model = DeviceFactory.create(jsonData, gateway);
		if (model)
			deviceList.push(model)


	}

	parseJsonData(jsonData, gateway, deviceList) {

		// let key = gateway + jsonData.deviceType + jsonData.address
		// // let deviceList = store.getters.deviceList

		let model = deviceList.find(ele => ele && (ele.address == jsonData.address && 
			(ele.deviceType == jsonData.deviceType || 
			 jsonData.deviceType.includes(ele.deviceType) ||
			 (ele.rawDeviceType && (ele.rawDeviceType == jsonData.deviceType || jsonData.deviceType.includes(ele.rawDeviceType))))  
			 && ele.barCode == gateway))

		if (model) {
			// console.log('parseJsonData - 匹配成功:', {
			// 	address: jsonData.address,
			// 	deviceType: jsonData.deviceType,
			// 	modelType: model.deviceType,
			// 	modelTypeCode: model.typeCode,
			// 	modelRawType: model.rawDeviceType
			// });
			model.getDeviceData(jsonData, gateway)
		} else {
			// console.log('parseJsonData - 匹配失败:', {
			// 	address: jsonData.address,
			// 	deviceType: jsonData.deviceType,
			// 	availableDevices: deviceList.map(d => ({
			// 		address: d.address,
			// 		deviceType: d.deviceType,
			// 		typeCode: d.typeCode,
			// 		rawDeviceType: d.rawDeviceType,
			// 		barCode: d.barCode
			// 	}))
			// });
		} 

	}

	/**GDC升级方法之后单独抽离出来 */
	initFrameHandlers() {
		// this.frameHandlers.set('23', this.frameType23Hanlder); // "23"请求升级
		// this.frameHandlers.set("20", this.frameType20Handler);
	}
	handlerFrameType(jsonData) {
		// return this.frameHandlers.get(jsonData.frameType)(jsonData.data);
	}


	frameType23Hanlder(jsonData) {
		if (jsonData.data.B6 === '85' || (jsonData.data.B6 === '170')) { // "85"允许升级,"170"升级完成
			// 前面都取出B6了，这里还再判断json.data
			if (jsonData.data) {
				const arrayData = [];
				arrayData.length = 0;
				arrayData.push(jsonData.data.B0);
				arrayData.push(jsonData.data.B1);
				arrayData.push(jsonData.data.B2);
				arrayData.push(jsonData.data.B4);
				arrayData.push(jsonData.data.B6);
				// this.upgradeProgramResponseFrame.emit(arrayData);
			}
		}
	}
}