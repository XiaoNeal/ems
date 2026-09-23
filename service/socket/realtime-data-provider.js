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

	// 设备去重映射（保持为普通 Map，绝不放进 Vuex/Vue 响应式容器，
	// 否则实时模型会被深度 observe，每帧上百字段写入会拖垮所有页面）
	modelKeyMap = new Map()

	// —— 数据更新事件：多订阅者 + 全局节流 ——
	// 实时帧每秒可达数十条，逐帧通知会让所有存活页面（含后台隐藏页）整页重渲染。
	// 所有通知合并到最多 NOTIFY_INTERVAL_MS 一次。
	static NOTIFY_INTERVAL_MS = 300
	_dataListeners = new Set()
	_notifyTimer = null
	// 首页等宿主页面隐藏时暂停多订阅者通知（活动页的 legacy 单回调不受影响）
	_subscribersPaused = false
	// 兼容旧代码 realtimeDataProvider.onDataUpdate = fn / null 的单回调写法
	_legacyListener = null

	/** 暂停/恢复 subscribe() 多订阅者通知（宿主页面 onHide/onShow 调用） */
	setSubscribersPaused(paused) {
		this._subscribersPaused = !!paused
	}

	get onDataUpdate() {
		return this._legacyListener
	}
	set onDataUpdate(cb) {
		this._legacyListener = typeof cb === 'function' ? cb : null
	}

	/**
	 * 订阅实时数据更新（已节流，最多约 3 次/秒）
	 * @param {Function} cb 数据更新回调
	 * @returns {Function} 取消订阅函数
	 */
	subscribe(cb) {
		if (typeof cb === 'function') this._dataListeners.add(cb)
		return () => this._dataListeners.delete(cb)
	}

	_notifyDataUpdate() {
		if (this._notifyTimer) return
		this._notifyTimer = setTimeout(() => {
			this._notifyTimer = null
			if (!this._subscribersPaused) {
				this._dataListeners.forEach(cb => {
					try { cb() } catch (e) { console.error('[RealtimeDataProvider] listener error', e) }
				})
			}
			if (typeof this._legacyListener === 'function') {
				try { this._legacyListener() } catch (e) { console.error('[RealtimeDataProvider] listener error', e) }
			}
		}, RealtimeDataProviderService.NOTIFY_INTERVAL_MS)
	}

	/**
	 * 生成设备列表的冻结快照（浅拷贝高频数据容器）。
	 * 快照不可被 Vue observe，组件渲染只读快照、不订阅实时字段，
	 * 仅在拿到新快照引用时重渲染一次。
	 * 注意：
	 * 1) 模型高频容器在 device-factory 中被改为非可枚举属性，
	 *    必须用 Object.getOwnPropertyNames 遍历，对象展开会漏掉它们；
	 * 2) Vue2 会给被 observe 过的模型挂非可枚举内部标记 __ob__（Observer 实例），
	 *    绝不能拷进快照——否则会生成一个被冻结的「假 __ob__」（dep 无 depend 方法），
	 *    小程序端 dependArray/cloneWithData 遍历时会抛
	 *    "e.__ob__.dep.depend is not a function" 并中断整页渲染。
	 */
	takeSnapshot() {
		const OBSERVE_KEY = '__ob__'
		// 浅拷贝一个普通对象（顺带剥离 __ob__），再冻结
		const shallowCopy = (o) => {
			const cc = {}
			Object.keys(o).forEach(fk => {
				if (fk === OBSERVE_KEY) return
				cc[fk] = o[fk]
			})
			return Object.freeze(cc)
		}
		const copyContainer = (c) => {
			if (Array.isArray(c)) return Object.freeze(c.slice())
			const cc = {}
			Object.keys(c).forEach(fk => {
				if (fk === OBSERVE_KEY) return
				const f = c[fk]
				// 字段对象（{ value, unit... }）也走剥离+冻结，防止快照被深度 observe
				cc[fk] = (f && typeof f === 'object') ? shallowCopy(f) : f
			})
			return Object.freeze(cc)
		}
		return this.deviceList.map(d => {
			if (!d || typeof d !== 'object') return d
			const snap = {}
			Object.getOwnPropertyNames(d).forEach(k => {
				if (k === OBSERVE_KEY) return
				const v = d[k]
				snap[k] = (v !== null && typeof v === 'object') ? copyContainer(v) : v
			})
			return Object.freeze(snap)
		})
	}

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
		if (hasExpired) {
			this._notifyDataUpdate();
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
		this.modelKeyMap.clear()
		this.barCode = new Set()
		store.commit('CLEAR_DEVICE_STATE');
	}
	initDeviceList(deviceList) {
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

			// 用普通 Map 去重（不经过 Vuex，保证实时模型不被响应式化）
			if (!this.modelKeyMap.has(deviceKey)) {
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

				this.modelKeyMap.set(deviceKey, addedModel)
				// barCode 仍写入 Vuex 供重连逻辑读取（Set 本身不会被 Vue2 深度 observe）
				store.commit('ADD_BAR_CODE', barCode);
			}
		}
		// 从store中获取barCodes
		const storeBarCodes = store.state.barCodes;
		storeBarCodes.forEach((value) => {

			this.bindDevicesRealtimeData(value)
		})

		console.log('初始化设备列表完成, 设备数:', this.deviceList.length)
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
					this._notifyDataUpdate();
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
					this._notifyDataUpdate()
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
