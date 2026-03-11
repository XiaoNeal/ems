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

		let model = DeviceFactory.create(jsonData, gateway);
		if (model)
			deviceList.push(model)


	}

	parseJsonData(jsonData, gateway, deviceList) {

		// let key = gateway + jsonData.deviceType + jsonData.address
		// // let deviceList = store.getters.deviceList

		let model = deviceList.find(ele => ele && (ele.address == jsonData.address && (ele.deviceType ==
			jsonData.deviceType||jsonData.deviceType.includes(ele.deviceType))  && ele.barCode == gateway))

		if (model) {
			model.getDeviceData(jsonData, gateway)
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