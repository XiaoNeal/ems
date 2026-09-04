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
		}
		return dev;
	}
}