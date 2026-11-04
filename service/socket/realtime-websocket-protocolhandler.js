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
		if (!jsonData || !jsonData.deviceType) return
		// deviceType 归一化：统一大写 + 去下划线 + 去 0x 前缀 + 去空格（与网页版对齐）
		// 入参可能是字符串、数字或数组，统一转字符串后再处理，避免 toUpperCase 报错
		const normFull = t => String(t == null ? '' : t).toUpperCase().replace(/_/g, '').replace(/^0X/, '').replace(/\s+/g, '')
		// 基础版本号去掉（如 _V1 / V2 / _V2_4），用于兼容 API typeCode='171B' vs 报文 deviceType='171B_V1'
		const normBase = t => normFull(t).replace(/V\d+$/g, '')
		// 支持 jsonData.deviceType 为数组（服务端可能下发多个候选类型）
		const normList = v => (Array.isArray(v) ? v : [v]).map(normFull).filter(Boolean)
		const fullList = normList(jsonData.deviceType)
		const full = fullList[0] || ''
		const base = normBase(full)
		const typesOf = ele => {
			const raw = [ele.deviceType, ele.rawDeviceType, ele.typeCode]
			// 设备侧 deviceType 也可能是数组，逐个展开归一化
			return raw.reduce((acc, t) => {
				(Array.isArray(t) ? t : [t]).forEach(item => {
					const v = normFull(item)
					if (v) acc.push(v)
				})
				return acc
			}, [])
		}
		const exact = ele => typesOf(ele).some(t => fullList.includes(t))
		const sameAddr = ele => ele && ele.address == jsonData.address

		// 1) 第一优先：address + deviceType + barCode 精确匹配（含协议与版本号，
		//    不同版本如 171C_V2 / 171C_V2_1 各自落在自己的实例上，互不串数据）
		let model = deviceList.find(ele => sameAddr(ele) && exact(ele) && ele.barCode == gateway)

		// 2) 第二优先：address + deviceType 精确匹配（网关可能已变更为服务端推送的 gateway）
		if (!model) {
			model = deviceList.find(ele => sameAddr(ele) && exact(ele))
			if (model && model.barCode !== gateway) {
				// 更新设备的 barCode 为服务端实际推送的 gateway，确保后续匹配和下发一致
				model.barCode = gateway
			}
		}

		if (model) {
			model.getDeviceData(jsonData, gateway)
			return
		}

		// 3) 未命中已配置设备时，按报文 deviceType 新建独立实例
		//    （50kW 站的 171C_V2_1 ~ 171C_V2_4 属于此类，配置侧没有对应类型）
		if (!Array.isArray(jsonData.deviceType)) {
			const created = DeviceFactory.create(jsonData, gateway)
			if (created) {
				deviceList.push(created)
				created.getDeviceData(jsonData, gateway)
				return
			}
		}

		// 4) 兼容配置侧类型不带版本号、上报带版本号的历史情况（如配置 171C、上报 171C_V2）
		const family = deviceList.filter(ele => sameAddr(ele) && typesOf(ele).some(t =>
			!fullList.includes(t) && t === normBase(t) && fullList.some(f => f.startsWith(t))))
		if (family.length) {
			family.forEach(ele => ele.getDeviceData(jsonData, gateway))
			return
		}

		// 5) 兜底：去版本后缀的前缀匹配（保留历史分隔符匹配行为）
		if (base && base !== full) {
			const loose = deviceList.find(ele => sameAddr(ele) && typesOf(ele).some(t => normBase(t) === base))
			if (loose) {
				loose.getDeviceData(jsonData, gateway)
			}
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