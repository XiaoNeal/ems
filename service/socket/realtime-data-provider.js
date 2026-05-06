import RealTimeWebSokcetProtocolHandler from '@/service/socket/realtime-websocket-protocolhandler';


import io from '@hyoga/uni-socket.io';
var socket = undefined;
// let realtimeDataProvider = new RealtimeDataProviderService();

 export class RealtimeDataProviderService {
	// upgradeProgramResponseFrame: EventEmitter<any>;
	deviceList = [];
	barCode = new Set()
	realTimeWebSocketProtocolHandler = new RealTimeWebSokcetProtocolHandler()

	constructor() {
		this.createScoket()
	}


	createScoket() {
		// let urlPrefix = ""
		// if (currentTemplate == 3) {
		// 	urlPrefix = _urlPrefix
		// }
		if (socket) return
		socket = io.connect('wss://iems.neiic.com', {
			secure: true,
			query: 'areaInfoId=' + 1,
			transports: ['websocket'],
			// path: '/socket.io',
			//  path: '/hangzhou/socket.io',
			path: `/socket.io`, //'/luoyang/socket.io',
			reconnectionAttempts: 20,
			reconnectionDelay: 10000,
			reconnectionDelayMax: 30000
		});
		this.getConnectedSocket()
	}

	// IEMS_0106V2State_
	// IEMS_1702State_
	
	initDeviceList(deviceList) {
		this.deviceList = [];
		this.barCode = new Set()

// 		address: "1F"
// barCode: "IEMS_00 00 02 20 25 06 05 09 37 11 2E 00 00 00 00"
// deviceId: "170C001"
// deviceType: "170C_V1_1"
// name: "DCDC设备"
		for (let i = 0; deviceList && i < deviceList.length; i++) {
			let barCode = deviceList[i].barCode || deviceList[i].barcode
			let findData = this.deviceList.find(ele => ele.address == deviceList[i].address && ele.barCode ==
				barCode && ele.deviceType == deviceList[i].typeCode)
				console.log('findData',findData);

			if (findData) continue;
			else {
				let device = {
					deviceId: deviceList[i].deviceId,
					name: deviceList[i].name != '' ? deviceList[i].name : '未命名',
					address: deviceList[i].address,
					barCode: barCode,
					deviceType: deviceList[i].typeCode||deviceList[i].deviceType,
					// parentId:deviceList[i].parentId,
				}

				this.realTimeWebSocketProtocolHandler.initDevice(device, barCode, this.deviceList)
				console.log('device',device,this.deviceList);
				this.barCode.add(barCode)
			}

		}

		console.log('barCode',this.deviceList,deviceList);
		this.barCode && this.barCode.forEach((value, key) => {
			this.bindDevicesRealtimeData(value)
		})


	}

	unregister() {
		this.barCode.forEach((value, key) => {
			socket.emit('unregister', value);
		})
	}
	getDeviceList() {
		return this.deviceList
	}

	bindDevicesRealtimeData(barCode) {
		if (!socket) this.createScoket(uni.getStorageSync('currentTemplate'), uni.getStorageSync('urlPrefix'))
		// let barCode = "A7 00 00 00 00 00 00 00 00 00 00 00 00 00 00"
		socket.emit('register', barCode);
		// socket.emit('register', gateway.code);
		socket.on("IEMS_" + barCode, (jsonData) => {
			try {
				if (typeof jsonData == 'string') {
					let index = jsonData.lastIndexOf("}"); /**socket上报的数据末尾多了一个空格，去掉后才能解析 */
					if (index >= 0) {
						jsonData = jsonData.substring(0, index + 1);
					}
					if (jsonData.includes('\"dataType\"' + ':' + '\"1\"') || jsonData.includes('gateway'))
						return
					jsonData = JSON.parse(jsonData);
					// let key = barCode + jsonData.deviceType+jsonData.address+jsonData
					this.realTimeWebSocketProtocolHandler.parseJsonData(jsonData, barCode, this.deviceList);
				}

			} catch (error) {
				// delay(10000);
			}
		});
	}

	//     initDeviceList() {
	//         let jsonData = {
	//             deviceType: '1804_V2',
	//             address: '04'
	//         }
	//         this.realTimeWebSocketProtocolHandler.parseJsonData(jsonData, "2D 00 00 00 00 00 00 00 00 00 00 00 00 00 00");
	//     }

	getConnectedSocket() {
		// console.log("socket", socket)
		if (!socket) this.createScoket(uni.getStorageSync('currentTemplate'), uni.getStorageSync('urlPrefix'))
		socket.on('connect', () => {
			console.log("socket已连接上");

		})
		socket.on('connect_timeout', (timeout, error) => {
			console.log("socket超时", timeout, error)
		});

		socket.on('connect_error', (error) => {
			console.log('尝试重新连接中...', error);
		});

		socket.on('connect_failed', function(data) {
			console.log('连接失败...');
		});

		// 监听连接断开事件
		socket.on('disconnect', () => {
			console.log('连接断开')
		})
		// 监听连接错误事件
		socket.on('error', (error) => {
			console.log('连接错误：', error)
		})
		// 监听重连事件
		socket.on('reconnect', () => {
			console.log('重新连接成功')
		})
	}



	sendMessage(msg) {
		let sendMsg = "C8 00 00 00 00 00 00 00 00 00 00 00 00 00 00" + "_" + msg;
		// console.log('controlCode', sendMsg)
		socket.emit('controlCode', sendMsg);
	}

	// 添加emit方法
	emit(event, data) {
		if (socket) {
			socket.emit(event, data);
		}
	}

	// 添加on方法
	on(event, callback) {
		if (socket) {
			socket.on(event, callback);
		}
	}

	// 添加off方法
	off(event) {
		if (socket) {
			socket.off(event);
		}
	}

	static closeSocket() {
		// socket.colse()
		if(socket){
			socket.disconnect()
			socket = undefined;
		}
		
	}


}
