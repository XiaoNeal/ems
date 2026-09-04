// import io from 'socket.io-client'
// export const zhSocket = io.connect('http://10.2.44.199:9012');
// export const Socket = io.connect('http://10.2.44.199:9012');
import io from '@hyoga/uni-socket.io';

/** 检查是否已登录（从 lifeData.hasLogin 判断） */
function isLoggedIn() {
	try {
		const lifeData = uni.getStorageSync('lifeData') || {};
		return !!lifeData.hasLogin;
	} catch (e) {
		return false;
	}
}

/** 检查是否处于直连模式
 * 核心规则：只要是登录用户就不是直连模式
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
			console.log('[CloudSocket] 未登录，跳过 WebSocket 创建');
			return true;
		}
		return isDirectMode();
	} catch (e) {
		return false;
	}
}

let _Socket = null;

/** 创建云端 WebSocket 连接 */
function createSocket() {
	if (_Socket) return _Socket;
	if (shouldSkipCloudSocket()) return null;

	console.log('[CloudSocket] 创建云端 WebSocket 连接');
	_Socket = io.connect('wss://serviceiems.gree.com', {
		secure: true,
		query: 'areaInfoId=' + 1,
		transports: ['websocket'],
		path: `${uni.getStorageSync('urlPrefix')}/socket.io`,
		reconnectionAttempts: 20,
		reconnectionDelay: 10000,
		reconnectionDelayMax: 30000
	});
	return _Socket;
}

/** 获取 Socket，若未创建则尝试创建 */
function getSocket() {
	if (!_Socket && !shouldSkipCloudSocket()) {
		createSocket();
	}
	return _Socket;
}

// 模块加载时尝试创建（已有 token 且非直连则立即创建，否则返回 null）
_Socket = shouldSkipCloudSocket() ? null : createSocket();

// 兼容旧代码直接 import { Socket }
export { _Socket as Socket, createSocket, getSocket };