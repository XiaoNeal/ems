/**
 * 本地告警通知（仅 APP-PLUS 生效）
 *
 * 设计口径（务必保留）：
 * - 轮询云端告警接口检测「新产生」的告警，用 plus.push.createMessage 在系统通知栏提醒。
 * - 首次启动 / 切换设备时先建立基线，只通知基线之后新出现的告警，避免把历史告警全推一遍。
 * - 本地通知不需要厂商推送证书，但打包必须在 manifest.json 勾选 Push 模块，否则 plus.push 不可用。
 * - APP 退到后台后 JS 定时器会被系统冻结，本方案只在 APP 活跃时可靠；真正的后台离线推送需要服务端推送通道。
 * - 所有异常静默处理，不向用户暴露底层错误；不写 console、不写业务日志热路径。
 */
import { getAlarmRecord } from '@/api/alarm.js'
import store from '@/store'

const ENABLED_KEY = 'alarm_local_notify_enabled'
const STATE_KEY = 'alarm_local_notify_state'
const CHECK_INTERVAL = 60 * 1000
const MAX_TRACKED_IDS = 500
const MAX_NOTIFY_PER_CHECK = 3

let timer = null
let checking = false

function readStorage(key, fallback) {
	try {
		const value = uni.getStorageSync(key)
		return value === '' || value === null || value === undefined ? fallback : value
	} catch (e) {
		return fallback
	}
}

function writeStorage(key, value) {
	try {
		uni.setStorageSync(key, value)
	} catch (e) { }
}

/** 是否启用：默认开启 */
export function isNotificationEnabled() {
	const value = readStorage(ENABLED_KEY, true)
	return value !== false && value !== 'false' && value !== 0
}

/** 开关：关闭时立即停止轮询 */
export function setNotificationEnabled(enabled) {
	const next = !!enabled
	writeStorage(ENABLED_KEY, next)
	if (next) {
		startNotification()
	} else {
		stopNotification()
	}
}

/** 当前设备的隔离键：不同站点各自维护基线，切换设备不误报 */
function areaKey() {
	const device = store.state.currentSelectDevice || {}
	return String(device.areaLevelId || device.id || device.esId || 'default')
}

/** 告警唯一标识，口径与报警页一致（设备 + 时间 + 名称） */
function alarmId(item) {
	return `${item.deviceId || ''}|${item.alarmTime || ''}|${item.alarmName || ''}`
}

function today() {
	const d = new Date()
	const y = d.getFullYear()
	const m = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${y}-${m}-${day}`
}

function levelText(level) {
	return level === 0 ? '故障' : level === 1 ? '保护' : '告警'
}

/** 在系统通知栏创建本地消息；payload 带 local 标记，避免 iOS receive 事件误判为云端推送 */
function createLocalMessage(title, content, id) {
	// #ifdef APP-PLUS
	try {
		if (typeof plus === 'undefined' || !plus.push || typeof plus.push.createMessage !== 'function') {
			return false
		}
		plus.push.createMessage(content, JSON.stringify({ local: true, type: 'alarm', id }), {
			title,
			cover: false,
			sound: 'system'
		})
		return true
	} catch (e) {
		return false
	}
	// #endif
	// #ifndef APP-PLUS
	return false
	// #endif
}

/** 执行一次检测：读云端告警 → 与新基线对比 → 对新增项发通知 */
export async function checkAlarmsOnce() {
	if (checking) return
	if (!isNotificationEnabled()) return

	const token = store.state.token
	const hasLogin = store.state.hasLogin
	if (!token || !hasLogin) return

	const device = store.state.currentSelectDevice || {}
	if (!device.areaLevelId) return

	checking = true
	try {
		const res = await getAlarmRecord({
			date: today(),
			areaLevelIds: device.areaLevelId
		})
		const list = Array.isArray(res && res.data) ? res.data : []
		const currentIds = list.map(alarmId)

		const allState = readStorage(STATE_KEY, {}) || {}
		const key = areaKey()
		const bucket = allState[key] || { ids: [], ready: false }
		const known = Array.isArray(bucket.ids) ? bucket.ids : []

		if (!bucket.ready) {
			// 首次进入 / 切换设备：只建立基线，不推送历史告警
			bucket.ids = currentIds.slice(0, MAX_TRACKED_IDS)
			bucket.ready = true
		} else {
			const fresh = list.filter(item => known.indexOf(alarmId(item)) === -1)
			// 先写状态再发通知，避免通知成功但状态未落盘导致重复推送
			const merged = currentIds.concat(known)
			const deduped = []
			merged.forEach(id => {
				if (deduped.indexOf(id) === -1) deduped.push(id)
			})
			bucket.ids = deduped.slice(0, MAX_TRACKED_IDS)

			fresh.slice(0, MAX_NOTIFY_PER_CHECK).forEach(item => {
				const id = alarmId(item)
				const title = `${levelText(item.alarmLevel)} · ${item.typeName || '设备告警'}`
				const content = `${item.alarmName || '检测到告警'}（${item.alarmTime || ''}）`
				createLocalMessage(title, content, id)
			})
		}

		allState[key] = bucket
		writeStorage(STATE_KEY, allState)
	} catch (e) {
		// 静默：告警通知失败不影响主流程
	} finally {
		checking = false
	}
}

/** 启动轮询（仅 APP-PLUS）；重复调用安全 */
export function startNotification() {
	// #ifdef APP-PLUS
	if (timer) return
	if (!isNotificationEnabled()) return
	// 启动后先建立基线，避免把已经存在的告警全推一遍
	checkAlarmsOnce()
	timer = setInterval(() => {
		checkAlarmsOnce()
	}, CHECK_INTERVAL)
	// #endif
}

/** 停止轮询 */
export function stopNotification() {
	if (timer) {
		clearInterval(timer)
		timer = null
	}
}

/** 应用回到前台：立即补检一次（后台期间定时器可能被冻结） */
export function resumeNotification() {
	// #ifdef APP-PLUS
	if (!isNotificationEnabled()) {
		stopNotification()
		return
	}
	if (!timer) {
		startNotification()
	} else {
		checkAlarmsOnce()
	}
	// #endif
}

/** 退出登录时清空基线，避免换账号后沿用上一个账号的告警记录 */
export function resetNotificationState() {
	stopNotification()
	writeStorage(STATE_KEY, {})
}
