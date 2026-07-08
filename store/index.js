import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	// set './app.js' => 'app'
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
	const value = modulesFiles(modulePath)
	modules[moduleName] = value.default
	return modules
}, {})

let lifeData = {};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');

} catch (e) {

}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名

let saveStateKeys = [
	'token',
	'userName', 'hasLogin', 'areaInfoId',
	'currentSystemInfo', 'headerTabBg', 'bGColor', 'fontColor',
	'currentSelectDevice', 'userInfo' // 新增缓存字段
];



// 保存变量到本地存储中
const saveLifeData = function (key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}
const store = new Vuex.Store({
	modules,
	getters: Object.assign({}, getters, {
		getEsList: (state) => {
			if (state.esConfig?.length === 0) {
				return []
			}
			return state.esConfig
		},
		getEsVersion: (state) => {
			console.log('当前设备:', state.currentSelectDevice) // 调试输出
			const versionMap = new Map()
				.set(1, 2).set(2, 2).set(3, 2).set(4, 1).set(5, 2)
			const deviceId = state.currentSelectDevice?.id || state.currentSelectDevice?.esId || 0
			return versionMap.get(deviceId) || 1 // 添加默认值
		},
		currentSystem: state => state.systems.find(system => system.id === state.currentSystemId),
		allSystems: state => state.systems.map(s => ({ id: s.id, name: s.name })),
	}),
	state: {
		userInfo: lifeData.userInfo ? lifeData.userInfo : {},
		headerTabBg: lifeData.headerTabBg ? lifeData.headerTabBg : '#fff',
		bGColor: lifeData.bGColor ? lifeData.bGColor : '#fff',
		fontColor: lifeData.fontColor ? lifeData.fontColor : '#000',
		token: lifeData.token ? lifeData.token : '',
		areaInfoId: lifeData.areaInfoId ? lifeData.areaInfoId : '',
		currentSystemInfo: lifeData.currentSystemInfo ? lifeData.currentSystemInfo : {},
		hasLogin: lifeData.hasLogin ? lifeData.hasLogin : false,
		userName: lifeData.userName ? lifeData.userName : '',
		storageRealData: [],
		currentSelectDevice: lifeData.currentSelectDevice ? lifeData.currentSelectDevice : undefined,
		homeSelectedEsId: lifeData.homeSelectedEsId ? lifeData.homeSelectedEsId : undefined,
		barCodes: new Set(),
		deviceMap: new Map(),
		currentEsRoleId: lifeData.currentEsRoleId ? lifeData.currentEsRoleId : 0
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (nameArr.length >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		},
		// 存储完整设备对象
		changeCurrentSelectDevice(state, data) {
			console.log('changeCurrentSelectDevice', data)
			state.currentSelectDevice = data || {}
			saveLifeData('currentSelectDevice', data)
		},
		SET_CURRENT_ES_ROLE_ID(state, roleId) {
			state.currentEsRoleId = roleId
			saveLifeData('currentEsRoleId', roleId)
		},
		/**
		 * 修改存储实时数据
		 */
		changeStorageRealData(state, data) {
			state.storageRealData = data
		},
		SET_LOGIN(state, userInfo) {
			state.userInfo = userInfo
			state.hasLogin = true
			saveLifeData('userInfo', userInfo)
			saveLifeData('hasLogin', true)
		},

		// 更新设备条形码集合
		UPDATE_BAR_CODES(state, barCodes) {
			state.barCodes = barCodes;
		},
		// 更新设备映射
		UPDATE_DEVICE_MAP(state, deviceMap) {
			state.deviceMap = deviceMap;
		},
		// 添加设备条形码
		ADD_BAR_CODE(state, barCode) {
			state.barCodes.add(barCode);
		},
		// 添加设备到映射
		ADD_DEVICE_TO_MAP(state, { key, device }) {
			state.deviceMap.set(key, device);
		},
		// 清空设备状态
		CLEAR_DEVICE_STATE(state) {
			state.barCodes.clear();
			state.deviceMap.clear();
			state.storageRealData = [];
		},
	},
	actions: {
	}
})



export default store