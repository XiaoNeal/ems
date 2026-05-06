import { Model170A } from "./170A-model";
import { Model1804 } from "./1804-model";
import { Model0110 } from "./0110-model";
import { Model2502 } from "./2502-model";
import { Model1803 } from "./1803-model";
import { Model1902 } from "./1902-model";
import { Model1318 } from "./1318-model";
import { Model130B } from "./130B-model";
import { Model1707 } from "./1707-model";
import { Model2305 } from './2305-model.js'
import { Model2306 } from './2306-model.js'
import { Model2307 } from './2307-model.js'
import { Model2309 } from './2309-model.js'
import { Model230A } from './230A-model.js'
import { Model2801 } from './2801-model.js'
import { Model1904 } from './1904-model.js'
import { Model170Cv1 } from "./170Cv1-model.js";
import { Model170C } from './170C-model.js'
import { Model1704 } from './1704-model.js'
import { Model1D02 } from "./1D02-model";
import { Model1707v3_2 } from "./1707v3_2-model.js";
import { Model1707V3 } from './1707V3-model.js'
import { Model1704v1_1 } from './1704v1_1-model.js'
import { Model0319 } from './0319-model.js'
import { Model0318v1_1 } from "./0318v1_1-model.js";
import { Model010C } from "./010C-model.js";
import { Model1312v1_1 } from "./1312v1_1-model.js";
import { Model131Cv2 } from './131Cv2-model.js'
import { Model170C_V1_1Model } from './170C_V1_1-model.js'
import { Model170F } from './170F-model.js'

export class DeviceFactory {
	static create(jsonData, gateway) {
		let dev;
		switch (jsonData.deviceType) {
			case '1707_V3_2': {
				dev = new Model1707v3_2();
				break;
			}
			case '1707_V3_3': {
				dev = new Model1707V3();
				break;
			}
			case '1704_V1_1': {
				dev = new Model1704();
				break;
			}
			case '1704_V1_2': {
				dev = new Model1704();
				break;
			}
			case '0318_V1_1': {
				dev = new Model0318v1_1();
				break;
			}
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
			case '130B': {
				dev = new Model130B()
				break;
			}
			case '1707_V3': {
				dev = new Model1707()
				break;
			}
			case '2305_V1.1': {
				dev = new Model2305('2305_V1.1')
				break;
			}
			case '2306_V2.2': {
				dev = new Model2306()
				break;
			}
			case '2307': {
				dev = new Model2307()
				break;
			}
			case '2309': {
				dev = new Model2309()
				break;
			}
			case '230A': {
				dev = new Model230A()
				break;
			}
			case '2801': {
				dev = new Model2801()
				break;
			}
			case '1904': {
				dev = new Model1904()
				break;
			}
			case '1D02_V2':
			{
				dev = new Model1D02()
				break;
			}
			case '1D02':{
				dev = new Model1D02()
				break;
			}
			case '0319':{
				dev = new Model0319()
				break;
			}
			case '010C':{
				dev = new Model010C()
				break;
			}
			case '1312_V1_1':{
				dev = new Model1312v1_1()
				break;
			}
			case '131C_V2':{
				dev = new Model131Cv2()
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

			default:
				// dev = new DeviceBase();
				break;
		}

		if (dev) {
			dev.address = jsonData.address;
			dev.deviceType = jsonData.deviceType
			dev.barCode = gateway
			dev.deviceId = jsonData.deviceId
			dev.name = jsonData.name
		}

		return dev;
	}
}