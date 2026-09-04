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
		// 类型匹配：精确相等 或 版本前缀匹配（如 "171C_V1_1" 匹配 "171C"）
		// 使用 '_' 分隔符匹配，避免裸 includes() 子串误匹配（如 "171" 误匹配 "1712"）
		// 同时支持 jsonData.deviceType 为数组（服务端可能下发多个候选类型）
		const matchDeviceType = (ele) => {
			if (!ele.deviceType || !jsonData.deviceType) return false
			const jsonType = jsonData.deviceType
			const types = Array.isArray(jsonType) ? jsonType : [jsonType]
			const isMatch = (t) => {
				if (t == null) return false
				const ts = String(t)
				return types.some(jt => {
					const js = String(jt)
					return js === ts || js.startsWith(ts + '_') || ts.startsWith(js + '_')
				})
			}
			return isMatch(ele.deviceType) || (ele.rawDeviceType && isMatch(ele.rawDeviceType))
		}

		// 第一优先：按 address + deviceType + barCode 精确匹配
		let model = deviceList.find(ele => ele && (ele.address == jsonData.address &&
			matchDeviceType(ele) && ele.barCode == gateway))

		if (model) {
			model.getDeviceData(jsonData, gateway)
			return
		}

		// 第二优先：按 address + deviceType 匹配（网关可能已变更为服务端推送的 gateway）
		model = deviceList.find(ele => ele && (ele.address == jsonData.address &&
			matchDeviceType(ele)))

		if (model) {
			// 更新设备的 barCode 为服务端实际推送的 gateway，确保后续匹配和下发一致
			if (model.barCode !== gateway) {
				model.barCode = gateway
				// 同步更新 store 中的 deviceMap key
				const storeKey = `${gateway}_${model.address}_${model.deviceType}`
				// 注意：此处不重建 store，仅更新模型自身字段
			}
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