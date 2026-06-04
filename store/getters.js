/**
 * Vuex Getters 模块
 * 用于从 store 中派生出一些状态
 */

const getters = {
	/**
	 * 是否已登录
	 * @param {Object} state - Vuex state
	 * @returns {boolean} 登录状态
	 */
	hasLogin: state => state.user.hasLogin,
	/**
	 * 用户昵称
	 * @param {Object} state - Vuex state
	 * @returns {string} 用户昵称
	 */
	nickname: state => state.user.nickname,
	/**
	 * 用户头像
	 * @param {Object} state - Vuex state
	 * @returns {string} 头像 URL
	 */
	avatar: state => state.user.avatar,
	/**
	 * 用户余额
	 * @param {Object} state - Vuex state
	 * @returns {number} 余额
	 */
	balance: state => state.user.balance,
	/**
	 * 用户 ID
	 * @param {Object} state - Vuex state
	 * @returns {string} 用户 ID
	 */
	memberId: state => state.user.memberId,
	/**
	 * 设备列表
	 * @param {Object} state - Vuex state
	 * @returns {Array} 设备列表
	 */
	deviceList:state => state.device.deviceList,
	/**
	 * 用户名
	 * @param {Object} state - Vuex state
	 * @returns {string} 用户名
	 */
	userName:state => state.user.userName,
	/**
	 * 当前模板
	 * @param {Object} state - Vuex state
	 * @returns {string} 当前模板 ID
	 */
	currentTemplate:state=>state.user.currentTemplate,
}
export default getters
