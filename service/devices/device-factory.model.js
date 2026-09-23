import { Model170A } from "./170A-model";
import { Model1804 } from "./1804-model";
import { Model0110 } from "./0110-model";
import { Model2502 } from "./2502-model";
import { Model1803 } from "./1803-model";
import { Model1902 } from "./1902-model";
import { Model1318 } from "./1318-model";
import { Model1904 } from './1904-model.js'
import { Model170Cv1 } from "./170Cv1-model.js";
import { Model0319 } from './0319-model.js'
import { Model170C_V1_1Model } from './170C_V1_1-model.js'
import { Model170F } from './170F-model.js'
import { Model171E } from './171E-model.js'
import { Model171B } from './171B-model.js'
import { Model171C } from './171C-model.js'
import { Model171D } from './171D-model.js'
import { Model171F } from './171F-model.js'
import { Model1714 } from './1714-model.js'
import { Model1712 } from './1712-model.js'
import { Model1713 } from './1713-model.js'

export class DeviceFactory {
	static create(jsonData, gateway) {
		// return
		let dev;
		
		switch (jsonData.deviceType) {
		
			case '170C': {
				dev = new Model170Cv1();
				break;
			}
			// case '170C_V1_1': {
			// 	dev = new Model170C();
			// 	break;
			// }
			case '170C_V1_1': {
				dev = new Model170C_V1_1Model();
				break;
			}
			case '170A_V2': {
				dev = new Model170A();
				break;
			}
			case '1804_V2': {
				dev = new Model1804();
				break;
			}
			case '1804_V2_2': {
				dev = new Model1804();
				break;
			}
			case '0110': {
				dev = new Model0110();
				break;
			}
			case '2502': {
				dev = new Model2502();

				break;
			}
			case '1803': {
				dev = new Model1803()
				break;
			}
			case '1803_V2': {
				dev = new Model1803()
				break;
			}
			case '1803_V2_2': {
				dev = new Model1803()
				break;
			}
			case '1902': {
				dev = new Model1902()
				break;
			}
			case '1318': {
				dev = new Model1318()
				break;
			}
		
		
			case '1904': {
				dev = new Model1904()
				break;
			}
			
			case '0319':{
				dev = new Model0319()
				break;
			}
			
			
		
			case '170F':{
				dev = new Model170F()
				break;
			}
			case '170F_V1_2':{
				dev = new Model170F()
				break;
			}
			case '171B':{
				dev = new Model171B()
				break;
			}
			case '171C':{
				console.log(jsonData,"----------171C-------------")
				dev = new Model171C()
				break;
			}
			case '171D':{
				dev = new Model171D()
				break;
			}
			case '171E':{
				dev = new Model171E()
				break;
			}
			case '171F':{
				console.log(jsonData,"----------171F-------------")
				dev = new Model171F()
				break;
			}
			case '1714':{
				dev = new Model1714()
				break;
			}
			case '0305':{
				dev = new Model1714()
				break;
			}
			case '1712':{
				console.log(jsonData,"----------1712-------------")
				dev = new Model1712()
				break;
			}
			case '1713':{
				dev = new Model1713()
				break;
			}
	
			

			default:
			console.warn('未知 deviceType:', jsonData.deviceType)
			break;
		}

		if (dev) {
			dev.address = jsonData.address;
			dev.deviceType = jsonData.deviceType
			// 设置 typeCode：对于 0305 类型映射为 1714
			dev.typeCode = jsonData.deviceType === '0305' ? '1714' : jsonData.deviceType
			dev.barCode = gateway
			dev.deviceId = jsonData.deviceId
			dev.name = jsonData.name

			// 性能关键：阻止 Vue2 深度 observe 高频实时数据容器
			// （energyData/stateData/controlData/alarmData 等）。
			//
			// 做法：给容器挂 Symbol.toStringTag，使
			// Object.prototype.toString.call(容器) 返回 '[object XxxData]'
			// 而不是 '[object Object]'。Vue2 observe() 的创建条件要求 isPlainObject，
			// 命中失败后直接跳过、不会 new Observer，于是：
			//   - 容器及其内部上百个 { value } 字段都不会被 observe，
			//     协议处理器逐帧写字段不再触发 dep.notify()（卡顿根因消除）；
			//   - 容器和字段全部是「可枚举自有字符串属性」——这是小程序端的硬性要求：
			//     uni-app mp 运行时 setData 前用 rfdc 深克隆（for-in 只拷可枚举键），
			//     wxml 又直接绑定 device171F.energyData.B0 这类路径；
			//   - 不能用 _isVue 让 observe 跳过：mp 运行时的 clearInstance reviver
			//     会把任何带 _isVue 的对象克隆成 {}，视图层数据会被清空（踩过的坑）；
			//   - Symbol 键不会被 for-in / JSON.stringify / setData 枚举传输；
			//   - 容器仍可扩展可写，动态新增寄存器键（如 171E）不受影响。
			//
			// 页面侧改由 realtimeDataProvider.subscribe()/takeSnapshot()
			// 按节流频率用「新数组引用」驱动重渲染。
			Object.getOwnPropertyNames(dev).forEach(k => {
				const desc = Object.getOwnPropertyDescriptor(dev, k)
				if (!desc || !desc.configurable || 'get' in desc) return
				if (k === 'lastUpdateTime') {
					// 标量、每帧高频写入，但视图不绑定：非可枚举即可让 observe 跳过
					if (desc.writable && desc.enumerable) {
						Object.defineProperty(dev, k, {
							value: desc.value,
							enumerable: false,
							writable: true,
							configurable: true
						})
					}
					return
				}
				const v = desc.value
				if (v !== null && typeof v === 'object' && !Array.isArray(v) && v[Symbol.toStringTag] === undefined) {
					// 注意：对象字面量容器的 constructor.name 是 'Object'，标签不能用它，
					// 否则 toString 仍是 '[object Object]'，Vue2 isPlainObject 判定不会跳过
					const ctorName = v.constructor && v.constructor.name
					const tag = (ctorName && ctorName !== 'Object') ? ctorName : 'RealtimeData'
					Object.defineProperty(v, Symbol.toStringTag, {
						value: tag,
						enumerable: false,
						writable: false,
						configurable: true
					})
				}
			})
		}
		return dev;
	}
}