import RealTimeWebSokcetProtocolHandler from '@/service/socket/realtime-websocket-protocolhandler';
import { parseIemsFrame, isIemsBinaryFrame } from '@/service/socket/iems-frame-parser';
import store from '@/store';

import io from '@hyoga/uni-socket.io';
var socket = undefined;
// let realtimeDataProvider = new RealtimeDataProviderService();

/** 检查是否已登录（从 lifeData.hasLogin 判断） */
function isLoggedIn() {
	try {
		const lifeData = uni.getStorageSync('lifeData') || {};
		console.log(lifeData,'lifeData')
		return !!lifeData.hasLogin;
	} catch (e) {
		return false;
	}
}

/** 检查是否处于直连模式
 * 核心规则：只要是登录用户就不是直连模式（直连是绕开云端登录的纯本地调试）
 */
function isDirectMode() {
	try {
		if (isLoggedIn()) return false;

		const cfg = uni.getStorageSync('direct_device_config');
		const activated = !!uni.getStorageSync('direct_device_activated');
		const enabled = !!(cfg && cfg.enabled);
		const hasValidBroker = !!(cfg && (cfg.brokerUrl || (cfg.ip && cfg.ip.trim())));
		return enabled && hasValidBroker && activated;
	} catch (e) {
		return false;
	}
}

/** 检查是否应该跳过云端 WebSocket（直连模式 或 未登录） */
function shouldSkipCloudSocket() {
	try {
		if (!isLoggedIn()) {
			console.log('[RealtimeDataProvider] 未登录，跳过云端 WebSocket');
			return true;
		}
		return isDirectMode();
	} catch (e) {
		return false;
	}
}

export class RealtimeDataProviderService {
	deviceList = [];
	barCode = new Set()
	realTimeWebSocketProtocolHandler = new RealTimeWebSokcetProtocolHandler()
	registeredBarCodes = new Set()
	onDataUpdate = null

	constructor() {
		// 直连模式或未登录时不自动连接云端 WebSocket
		if (shouldSkipCloudSocket()) {
			return;
		}
		this._initConnection();
	}

	/** 初始化 WebSocket 和定时器（登录后延迟创建时用） */
	_initConnection() {
		this.createScoket();
		// 定时检查数据是否超时（每分钟检查一次）
		if (!this.expiredCheckTimer) {
			this.expiredCheckTimer = setInterval(() => {
				this.checkAllDevicesExpired();
			}, 60 * 1000);
		}
	}

	/** 确保 WebSocket 已连接——登录成功后调用 */
	ensureConnected() {
		if (socket) return; // 已连接
		if (shouldSkipCloudSocket()) return; // 仍然不该连

		console.log('[RealtimeDataProvider] ensureConnected: 延迟创建云端 WebSocket（登录后）');
		this._initConnection();
	}

	// 检查所有设备数据是否超时
	checkAllDevicesExpired() {
		let hasExpired = false;
		for (let i = 0; i < this.deviceList.length; i++) {
			const device = this.deviceList[i];
			if (device && typeof device.checkDataExpired === 'function') {
				const before = device.lastUpdateTime;
				device.checkDataExpired();
				// 如果数据被清空了，标记需要刷新UI
				if (before && !device.lastUpdateTime) {
					hasExpired = true;
				}
			}
		}
		// 如果有数据超时被清空，触发UI更新
		if (hasExpired && typeof this.onDataUpdate === 'function') {
			this.onDataUpdate();
		}
	}


	createScoket() {
		// 直连模式或未登录时跳过创建云端 WebSocket
		if (shouldSkipCloudSocket()) {
			return;
		}
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

	clearDeviceState() {
		this.unregister()
		this.deviceList = [];
		this.barCode = new Set()
		store.commit('CLEAR_DEVICE_STATE');
	}
	initDeviceList(deviceList) {
		console.log(deviceList, 'deviceList-------------------------')
		for (let i = 0; deviceList && i < deviceList.length; i++) {
			let barCode = deviceList[i].barCode || deviceList[i].barcode
			if (!barCode) continue
			let address = deviceList[i].address
			// 使用原始 deviceType 用于 WebSocket 匹配
			let deviceType = deviceList[i].deviceType || deviceList[i].typeCode
			// 跳过没有 deviceType 的设备，避免匹配错误
			if (!deviceType) {
				console.warn('设备缺少 deviceType，跳过初始化:', deviceList[i])
				continue
			}
			// 保存原始类型用于匹配
			let originalDeviceType = deviceList[i].rawDeviceType || deviceType

			// 使用barCode、address和deviceType组合作为唯一键
			let deviceKey = `${barCode}_${address}_${deviceType}`
			// console.log(deviceKey, 'deviceKey')

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
					typeCode: deviceList[i].typeCode || deviceType,
					rawDeviceType: originalDeviceType,
					// parentId:deviceList[i].parentId,
				}
				// 记录当前deviceList的长度
				let beforeLength = this.deviceList.length;

				// 调用initDevice，它会将模型添加到deviceList
				this.realTimeWebSocketProtocolHandler.initDevice(device, barCode, this.deviceList);

				// 获取initDevice添加的模型对象
				let addedModel = this.deviceList[beforeLength];

				// 保存typeCode和rawDeviceType到模型对象中，用于后续筛选和匹配
				if (addedModel) {
					addedModel.typeCode = device.typeCode;
					addedModel.rawDeviceType = originalDeviceType;
				}

				// 存储到store的deviceMap中
				store.commit('ADD_DEVICE_TO_MAP', { key: deviceKey, device: addedModel });
				// 存储到store的barCodes中
				store.commit('ADD_BAR_CODE', barCode);
				// console.log(addedModel, 'addedModel')
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
		if (!socket) return
		this.registeredBarCodes.forEach((barCode) => {
			try {
				socket.emit('unregister', barCode)
				socket.off("IEMS_" + barCode)
			} catch (e) {
				console.error('unregister error', barCode, e)
			}
		})
		this.registeredBarCodes.clear()
	}
	getDeviceList() {
		return this.deviceList
	}

	bindDevicesRealtimeData(barCode) {
		// 直连模式或未登录下跳过云端 WebSocket 绑定——数据由 MQTT/Modbus 提供或用户未登录
		if (shouldSkipCloudSocket()) {
			return;
		}

		if (!socket) this.createScoket()

		// createScoket 可能因直连模式/未登录等原因未成功创建 socket
		if (!socket) {
			console.warn('[RealtimeDataProvider] socket 未创建成功，跳过绑定:', barCode)
			return;
		}

		if (this.registeredBarCodes.has(barCode)) {
			return;
		}
		this.registeredBarCodes.add(barCode);
		socket.emit('register', barCode);

		socket.on("IEMS_" + barCode, (jsonData) => {
			try {
				if (typeof jsonData == 'string') {
					let index = jsonData.lastIndexOf("}")
					if (index >= 0) {
						jsonData = jsonData.substring(0, index + 1);
					}
					if (jsonData.includes('\"dataType\"' + ':' + '\"1\"'))
						return
					jsonData = JSON.parse(jsonData);
					// console.log('[数据流] 收到 IEMS_' + barCode + ' 数据, deviceType:', jsonData.deviceType, 'gateway:', jsonData.gateway)
					const actualGateway = jsonData.gateway || barCode;
					this.realTimeWebSocketProtocolHandler.parseJsonData(jsonData, actualGateway, this.deviceList);
					if (typeof this.onDataUpdate === 'function') {
						this.onDataUpdate();
					}
				} else if (jsonData instanceof ArrayBuffer || (jsonData && jsonData.buffer instanceof ArrayBuffer)) {
					// 二进制帧：使用协议模块解析
					const bytes = jsonData instanceof Uint8Array ? jsonData : new Uint8Array(jsonData)
					if (!isIemsBinaryFrame(bytes)) return
					const frame = parseIemsFrame(bytes)
					if (!frame) return
					// 跳过设备信息帧（dataType=1）
					if (frame._dataTypeNum === 0x01) return
					// 转换为 parseJsonData 期望的格式
					const parsedJson = {
						deviceType: frame.deviceType,
						address: parseInt(frame.address, 16).toString(), // 转十进制字符串以匹配设备列表
						dataType: String(frame._dataTypeNum),
						data: frame.data,
						dateTime: frame.dateTime,
						gateway: barCode,
					}
					this.realTimeWebSocketProtocolHandler.parseJsonData(parsedJson, barCode, this.deviceList)
					if (typeof this.onDataUpdate === 'function') {
						this.onDataUpdate();
					}
				}
			} catch (error) {
				console.error('parseJsonData error', barCode, error)
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
		if (isDirectMode()) {
			console.log('[RealtimeDataProvider] 直连模式，跳过 getConnectedSocket')
			return;
		}
		if (!socket) this.createScoket()
		if (!socket) {
			console.warn('[RealtimeDataProvider] socket 未创建，跳过事件绑定')
			return;
		}
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
