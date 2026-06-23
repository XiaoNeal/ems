import RealTimeWebSokcetProtocolHandler from '@/service/socket/realtime-websocket-protocolhandler';
import store from '@/store';

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
		// this.deviceList = [];


		// 清空store中的设备状态
		// store.commit('CLEAR_DEVICE_STATE');
		// this.barCode = new Set()
		for (let i = 0; deviceList && i < deviceList.length; i++) {
			let barCode = deviceList[i].barCode || deviceList[i].barcode
			let address = deviceList[i].address
			let deviceType = deviceList[i].typeCode || deviceList[i].deviceType

			// 使用barCode、address和deviceType组合作为唯一键
			let deviceKey = `${barCode}_${address}_${deviceType}`
			console.log(deviceKey, 'deviceKey')

			// 从store中获取deviceMap
			const currentDeviceMap = store.state.deviceMap;
			// 检查设备是否已存在
			if (!currentDeviceMap.has(deviceKey)) {
				let device = {
					deviceId: deviceList[i].deviceId,
					name: deviceList[i].name != '' ? deviceList[i].name : '未命名',
					address: address,
					barCode: barCode,
					deviceType: deviceType,
					// parentId:deviceList[i].parentId,
				}
				// 记录当前deviceList的长度
				let beforeLength = this.deviceList.length;

				// 调用initDevice，它会将模型添加到deviceList
				this.realTimeWebSocketProtocolHandler.initDevice(device, barCode, this.deviceList);

				// 获取initDevice添加的模型对象
				let addedModel = this.deviceList[beforeLength];

				// 存储到store的deviceMap中
				store.commit('ADD_DEVICE_TO_MAP', { key: deviceKey, device: addedModel });
				// 存储到store的barCodes中
				store.commit('ADD_BAR_CODE', barCode);
				console.log(addedModel, 'addedModel')
			}
		}
		// 从store中获取barCodes
		const storeBarCodes = store.state.barCodes;
		console.log(storeBarCodes, 'storeBarCodes')
		storeBarCodes.forEach((value) => {

			this.bindDevicesRealtimeData(value)
		})

		console.log('初始化设备列表:', this.deviceList, store.state.deviceMap)
		// 将this.deviceList值赋值给deviceLists
		// deviceLists = this.deviceList;
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

		socket.on('connect_failed', function (data) {
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
		// socket.on('reconnect', () => {
		// 	console.log('重新连接成功')


		// })


		socket.on('reconnect', (attemptNumber) => {
			// 从store中获取barCodes
			const storeBarCodes = store.state.barCodes;
			console.log('socket重新连接成功，尝试次数:', attemptNumber, storeBarCodes);
			// this.initDeviceList(deviceLists)
			// 重新注册设备
			if (storeBarCodes && storeBarCodes.size > 0) {
				console.log('重新注册设备:', storeBarCodes);
				storeBarCodes.forEach((value) => {
					if (socket) {
						socket.emit('register', value);
					}
				});
			}
		});
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
		if (socket) {
			socket.disconnect()
			socket = undefined;
		}

	}


}
