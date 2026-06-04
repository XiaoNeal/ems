/**
 * 设备管理模块
 * 用于管理能源站设备列表和当前设备信息
 */

/**
 * 设备状态
 * @property {Array} deviceList - 设备列表
 * @property {Object} currentDevice - 当前选中的设备
 * @property {Number} lastSendTime - 最后一次指令下发时间（用于控制5秒间隔）
 */
const state = {
	deviceList: [],
	currentDevice:{},
	lastSendTime: 0
}

/**
 * 设备模块 mutations
 */
const mutations = {
	/**
	 * 设置设备列表
	 * @param {Object} state - Vuex state
	 * @param {Array} value - 设备列表
	 */
	SET_DEVICE_LIST(state, value) {
		state.deviceList = value
	},
	/**
	 * 设置当前设备
	 * @param {Object} state - Vuex state
	 * @param {Object} value - 当前设备信息
	 */
	SET_CURRENT_DEVICE(state,value){
		state.currentDevice = value
	},
	/**
	 * 更新最后下发时间
	 * @param {Object} state - Vuex state
	 * @param {Number} value - 时间戳
	 */
	SET_LAST_SEND_TIME(state, value) {
		state.lastSendTime = value
	}
}

const actions = {
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
