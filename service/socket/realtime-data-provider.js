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
		// console.log(lifeData,'lifeData')
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
	// 恢复前台后等待实时帧的宽限期：超时仍未收到任何帧则判定 socket 已失效，主动重建
	static RESUME_WATCHDOG_MS = 6000
	// 连接正常打开期间，超过该时长没有收到任何有效帧则判定为「半开连接」（TCP 已死但客户端未感知），
	// 主动断开重建（register/心跳此时都会被静默吞掉，仅靠 socket.io 自身永远无法恢复）
	static FRAME_STALE_RECONNECT_MS = 180 * 1000
	// 两次主动重建连接的最小间隔，避免离线站点场景下反复重建
	static FORCE_RECONNECT_MIN_INTERVAL_MS = 120 * 1000
	_dataListeners = new Set()
	_notifyTimer = null
	// 首页等宿主页面隐藏时暂停多订阅者通知（活动页的 legacy 单回调不受影响）
	_subscribersPaused = false
	// 兼容旧代码 realtimeDataProvider.onDataUpdate = fn / null 的单回调写法
	_legacyListener = null

	// —— 设备/站点切换隔离 ——
	// provider 是模块级单例，切换设备时旧模型与旧实时值仍留在内存里；
	// 新页面 subscribe() 会「注册即重放」这份旧快照，导致先闪出上一台设备的数据。
	// 切换开始即清空并广播空快照，页面改显示加载态，直到新设备首帧到达。
	_switching = false
	_switchTarget = ''
	_switchToken = 0
	_switchTimer = null
	_switchListeners = new Set()
	// 新设备清单完成全量替换后才允许首帧结束切换态：
	// 子组件可能先于首页注册单个设备，不能拿它的帧当作「切换完成」
	_switchArmed = false
	// 每轮 unregister 递增，用于让上一代 socket 监听失效
	_registerGeneration = 0

	// —— 连接自愈（登录后 / 息屏后 / 从后台切回 无实时数据）——
	// 最后一帧有效数据到达时间（解析成功的 IEMS_<barCode> 帧）
	_lastFrameAt = 0
	// 恢复前台看门狗：resumeRealtime 后一段时间内没等到任何新帧就重建连接
	_resumeWatchdogTimer = null
	_resumeWatchdogStart = 0
	// 上次主动重建连接的时间（限频用）
	_lastForceReconnectAt = 0
	static SWITCH_TIMEOUT_MS = 8000

	/** 暂停 subscribe() 多订阅者通知（宿主页面 onHide 调用；恢复请用 resumeRealtime） */
	setSubscribersPaused(paused) {
		this._subscribersPaused = !!paused
	}

	/**
	 * 开始设备切换：注销旧监听、清空旧模型与旧实时值，并立即广播空快照。
	 * 目的：新页面 subscribe() 的「注册即重放」拿到的是空列表，而不是上一台设备的数据。
	 * @param {String} targetKey 目标设备标识，同一目标重复调用不重置计时（幂等）
	 */
	beginDeviceSwitch(targetKey = '') {
		const key = String(targetKey || '')
		if (this._switching && this._switchTarget === key) return this._switchToken

		this._switching = true
		this._switchTarget = key
		this._switchToken += 1
		this._switchArmed = false
		const token = this._switchToken

		// unregister 会 emit unregister 并移除旧的 IEMS_<barCode> 监听
		this.unregister()
		this.deviceList = []
		this.modelKeyMap.clear()
		this.barCode = new Set()
		store.commit('CLEAR_DEVICE_STATE')

		// 所有页面立刻读到空列表，旧数值不再停留在界面上
		this._notifyNow()
		this._notifySwitchState()

		if (this._switchTimer) clearTimeout(this._switchTimer)
		// 新设备离线或服务端未推帧时兜底解除加载态，避免遮罩一直挂着
		this._switchTimer = setTimeout(() => {
			if (this._switchToken === token) this.endDeviceSwitch()
		}, RealtimeDataProviderService.SWITCH_TIMEOUT_MS)
		return token
	}

	/** 结束切换态：新设备首帧已到达，或等待超时 */
	endDeviceSwitch() {
		if (!this._switching) return
		this._switching = false
		this._switchTarget = ''
		this._switchArmed = false
		if (this._switchTimer) {
			clearTimeout(this._switchTimer)
			this._switchTimer = null
		}
		this._notifySwitchState()
		this._notifyNow()
	}

	isSwitching() {
		return this._switching
	}

	/** 订阅切换态（注册即回放当前状态），返回取消订阅函数 */
	subscribeSwitchState(cb) {
		if (typeof cb === 'function') {
			this._switchListeners.add(cb)
			try { cb(this._switching) } catch (e) { console.warn('[RealtimeDataProvider] switch replay error', e) }
		}
		return () => this._switchListeners.delete(cb)
	}

	_notifySwitchState() {
		this._switchListeners.forEach(cb => {
			try { cb(this._switching) } catch (e) { console.error('[RealtimeDataProvider] switch listener error', e) }
		})
	}

	/** 收到有效帧时解除切换态；只认当前已注册 barCode，避免上一台设备的残留帧误判 */
	_markSwitchFrame(barCode) {
		if (!this._switching) return
		if (!this._switchArmed) return
		if (!this.registeredBarCodes.has(barCode)) return
		this.endDeviceSwitch()
	}

	/**
	 * 页面回到前台 / 切回监测 tab 时调用：解除暂停 → 立即补发一次当前快照 → 重放设备注册。
	 * 解决「停留其它 tab 期间通知被暂停吞掉、实时值超时被清成 '--'，切回来一直没数据、
	 * 必须手动刷新」的问题；服务端收到 register 会立刻推一帧全量数据。
	 */
	resumeRealtime() {
		this._subscribersPaused = false
		this._notifyNow()
		// socket 已断开时主动拉起重连：后台期间系统可能掐断连接，且 socket.io
		// 重连次数（reconnectionAttempts:20）耗尽后会永久放弃，此时仅靠 sendBuffer
		// 补发 register 永远不会被冲刷，界面会一直停在 '--'
		if (socket && socket.disconnected) {
			console.log('[RealtimeDataProvider] resumeRealtime: socket 已断开，主动重连')
			try { socket.connect() } catch (e) { console.warn('[RealtimeDataProvider] resume reconnect error', e) }
		}
		// onShow 与切 tab 可能在同一帧连续触发，800ms 内只重放一次 register，
		// 避免服务端收到重复注册（数据超时是分钟级，短间隔内无需重放）
		const now = Date.now()
		if (!this._lastResumeAt || now - this._lastResumeAt > 800) {
			this._lastResumeAt = now
			this.reRegisterAllDevices()
		}
		// 无论是否重放了 register 都要布防看门狗：若 register 在半开连接上被吞
		// （客户端自认为在线、服务端会话已丢），看门狗会在宽限期后重建连接
		this._armResumeWatchdog(now)
	}

	/** 记录一次有效帧到达（登录态云端链路），供看门狗判断链路是否存活 */
	_onFrameReceived() {
		this._lastFrameAt = Date.now()
		if (this._resumeWatchdogTimer) {
			clearTimeout(this._resumeWatchdogTimer)
			this._resumeWatchdogTimer = null
		}
	}

	/** 布防「恢复前台」看门狗：RESUME_WATCHDOG_MS 内没等到任何新帧则重建连接 */
	_armResumeWatchdog(resumeAt) {
		if (this._resumeWatchdogTimer) clearTimeout(this._resumeWatchdogTimer)
		this._resumeWatchdogStart = resumeAt
		this._resumeWatchdogTimer = setTimeout(() => {
			this._resumeWatchdogTimer = null
			this._checkResumeWatchdog()
		}, RealtimeDataProviderService.RESUME_WATCHDOG_MS)
	}

	_checkResumeWatchdog() {
		if (!socket) return
		// 没有已注册设备时不处理（直连模式 / 未登录 / 空站点）
		if (!this.registeredBarCodes.size) return
		// 恢复后已经收到过新帧，链路正常
		if (this._lastFrameAt && this._lastFrameAt >= this._resumeWatchdogStart) return
		// 连接正在建立中（resume 时触发了重连）：不打断，让 connect 回调补注册后自然推帧
		if (socket.io && socket.io.readyState === 'opening') {
			console.log('[RealtimeDataProvider] 看门狗触发时连接正在建立，跳过重建')
			return
		}
		console.warn('[RealtimeDataProvider] 恢复前台后', RealtimeDataProviderService.RESUME_WATCHDOG_MS, 'ms 未收到实时帧，重建云端连接')
		this._forceReconnect('resume-watchdog', { bypassThrottle: true })
	}

	/**
	 * 主动断开并重建云端 socket。
	 * 适用两种失效场景：
	 * 1) 半开连接：TCP 已死/服务端会话已丢，但客户端仍自认为在线，
	 *    此时 register emit 与心跳全部被静默吞掉，仅靠 socket.io 自身无法恢复；
	 * 2) 重连次数耗尽：socket.io 放弃重连后 sendBuffer 里的 register 永远不会被冲刷。
	 * 重建成功后 'connect' 回调会自动 reRegisterAllDevices，服务端随即补推一帧全量数据。
	 * @param {String} reason 触发原因（日志用）
	 * @param {Object} opts bypassThrottle=true 时绕过 120s 限频（resume 看门狗：
	 *                      用户主动回到页面是显式动作，应立即修复而不是等限频窗口）
	 */
	_forceReconnect(reason, opts = {}) {
		if (!socket) return
		const now = Date.now()
		// 限频：离线站点等场景下避免反复重建
		if (!opts.bypassThrottle
			&& this._lastForceReconnectAt
			&& now - this._lastForceReconnectAt < RealtimeDataProviderService.FORCE_RECONNECT_MIN_INTERVAL_MS) return
		this._lastForceReconnectAt = now
		console.warn('[RealtimeDataProvider] 主动重建云端连接, reason:', reason)
		try {
			if (!socket.disconnected) socket.disconnect()
			socket.connect()
		} catch (e) {
			console.error('[RealtimeDataProvider] forceReconnect error', e)
		}
		// 兜底：若 connect 事件因异常未触发，延迟重发一次注册（未连接时会进 sendBuffer，
		// 连接建立后由 emitBuffered 补发）
		setTimeout(() => {
			try { this.reRegisterAllDevices() } catch (e) { console.warn('[RealtimeDataProvider] forceReconnect re-register error', e) }
		}, 1200)
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
		if (typeof cb === 'function') {
			this._dataListeners.add(cb)
			// 注册即同步一次当前快照：切 tab 时监测页及其子组件被 v-if 销毁重建，
			// 若只等下一次实时帧通知，界面会一直停在初始值 '--'（需手动刷新才恢复）。
			// 所有订阅者都只是「读 getDeviceList() 写本地 data」，立即回调安全。
			try { cb() } catch (e) { console.warn('[RealtimeDataProvider] replay error', e) }
		}
		return () => this._dataListeners.delete(cb)
	}

	_notifyDataUpdate() {
		if (this._notifyTimer) return
		this._notifyTimer = setTimeout(() => {
			this._notifyTimer = null
			if (this._subscribersPaused) {
				// 暂停期间只保留 legacy 单回调（活动页需要），多订阅者由 resumeRealtime 补发
				if (typeof this._legacyListener === 'function') {
					try { this._legacyListener() } catch (e) { console.error('[RealtimeDataProvider] listener error', e) }
				}
				return
			}
			this._notifyNow()
		}, RealtimeDataProviderService.NOTIFY_INTERVAL_MS)
	}

	/** 立即广播当前数据给全部监听者（不节流、不判暂停） */
	_notifyNow() {
		this._dataListeners.forEach(cb => {
			try { cb() } catch (e) { console.error('[RealtimeDataProvider] listener error', e) }
		})
		if (typeof this._legacyListener === 'function') {
			try { this._legacyListener() } catch (e) { console.error('[RealtimeDataProvider] listener error', e) }
		}
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
		// —— 连接自愈（每分钟随过期检查一并执行）——
		if (socket && this.registeredBarCodes.size) {
			const now = Date.now();
			if (socket.disconnected) {
				// 后台期间重连次数耗尽后 socket.io 会永久放弃，这里周期性拉起
				console.warn('[RealtimeDataProvider] 检测到 socket 断开，尝试重连');
				try { socket.connect() } catch (e) { console.warn('[RealtimeDataProvider] periodic reconnect error', e) }
			} else if (this._lastFrameAt > 0
				&& now - this._lastFrameAt > RealtimeDataProviderService.FRAME_STALE_RECONNECT_MS
				&& now - this._lastForceReconnectAt > RealtimeDataProviderService.FORCE_RECONNECT_MIN_INTERVAL_MS) {
				// 连接未断但长时间收不到任何帧：半开连接（register/心跳被静默吞掉），重建
				this._forceReconnect('stale-frame');
			}
		}
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
		// 退出登录等场景一并解除切换态，避免加载遮罩残留
		this._switching = false
		this._switchTarget = ''
		this._switchArmed = false
		if (this._switchTimer) {
			clearTimeout(this._switchTimer)
			this._switchTimer = null
		}
		// 清理连接自愈状态：停掉看门狗、清空帧时钟，避免旧数据残留导致重新登录后误判链路失效
		if (this._resumeWatchdogTimer) {
			clearTimeout(this._resumeWatchdogTimer)
			this._resumeWatchdogTimer = null
		}
		this._lastFrameAt = 0
		this._notifySwitchState()
	}
	/**
	 * 全量替换设备列表：unregister 旧监听 → 清旧实例 → 重新 push + bind 新设备。
	 * 适合首页 fetchDeviceList 这种"整批换设备"的场景。
	 */
	replaceDeviceList(deviceList) {
		this.ensureConnected();
		this.unregister();
		this.deviceList = []
		this.modelKeyMap.clear()
		store.commit('CLEAR_DEVICE_STATE')
		this.initDeviceList(deviceList)
		// 新设备清单已全量替换完成，此后收到的首帧才算「切换加载完成」
		if (this._switching) this._switchArmed = true
	}

	/**
	 * 增量追加设备：保留旧设备，新设备通过 modelKeyMap 去重。
	 * 适合 Monitor/社区等子组件的补充注册场景。
	 */
	initDeviceList(deviceList) {
		// 先确保 socket 已创建（登录后延迟初始化、重连场景都需要）
		this.ensureConnected();

		for (let i = 0; deviceList && i < deviceList.length; i++) {
			let barCode = deviceList[i].barCode || deviceList[i].barcode || ''
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

		// console.log('初始化设备列表完成, 设备数:', this.deviceList.length)
		// 将this.deviceList值赋值给deviceLists
		// deviceLists = this.deviceList;
	}

	unregister() {
		// 每代注册一个序号：即使底层 socket.off 未移除干净，旧代监听也会被丢弃，
		// 防止切换设备后上一台设备的残留帧写进新的 deviceList
		this._registerGeneration += 1
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
		// barCode 为空则跳过——服务端不会把 IEMS 数据推给空 barCode
		if (!barCode) return;

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

		const generation = this._registerGeneration;
		socket.on("IEMS_" + barCode, (jsonData) => {
			// 切换设备期间，上一代监听 / 已注销 barCode 的残留帧一律丢弃
			if (this._registerGeneration !== generation || !this.registeredBarCodes.has(barCode)) return;
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
					this._onFrameReceived();
					this._markSwitchFrame(barCode);
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
					this._onFrameReceived();
					this._markSwitchFrame(barCode);
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
			// 首次连接成功：重放已注册设备的 register。
			// 登录后 fetchDeviceList/register 往往在 socket 尚未 connected 时执行，
			// 此时 emit 依赖 socket.io 层 sendBuffer 隐式补发，uni 环境下该时机不可靠，
			// 会导致服务端收不到 register、实时数据一直不来（刷新时 socket 已连上才正常）。
			// 这里与 reconnect 分支一致地显式重放，保证首次连接后服务端一定能收到注册。
			this.reRegisterAllDevices();
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
			// 重新注册设备
			this.reRegisterAllDevices();
		});
	}

	/**
	 * 重放注册当前 store 中已登记的全部 barCode（首次 connect 与 reconnect 共用）。
	 * 只对 socket 已存在、barCode 非空的设备重发 register，
	 * 避免空 barCode 被注册到服务端。
	 */
	reRegisterAllDevices() {
		if (!socket) return;
		// 合并 store 登记与实例已注册的两组 barCode：页面重建 / 切 tab 后
		// store 可能被 CLEAR_DEVICE_STATE 清过，只取 store 会漏注册、服务端不推帧。
		const codes = new Set();
		const storeBarCodes = store.state.barCodes;
		if (storeBarCodes && typeof storeBarCodes.forEach === 'function') {
			storeBarCodes.forEach(v => { if (v) codes.add(v) });
		}
		this.registeredBarCodes.forEach(v => { if (v) codes.add(v) });
		codes.forEach(value => {
			// 关键：不在 registeredBarCodes 里的 barCode 必须走 bindDevicesRealtimeData，
			// 在补发 register 的同时重建 IEMS_<barCode> 数据监听。子页面（快速控制
			// clearDeviceState / 策略配置 unregister）会把监听摘掉，只盲发 register 的话
			// 服务端推回的帧会因为没有 socket.on 而被全部丢弃，界面永远是 '--'。
			if (!this.registeredBarCodes.has(value)) {
				this.bindDevicesRealtimeData(value)
			} else {
				socket.emit('register', value);
			}
		});
	}

	/** 是否还有已向服务端注册（有数据监听）的 barCode，供宿主页面判断实时链路是否可用 */
	hasRegisteredCodes() {
		return this.registeredBarCodes.size > 0
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
