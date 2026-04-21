import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import sapi from './sapi'
import { nyzDeviceListbySystem1, nyzDeviceListbySystem2 } from '../service/config/devices'
import { menuItemsSystem1, menuItemsSystem2, analysisSubMenuSystem1, analysisSubMenuSystem2 } from '../service/config/memu'

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
	'vuex_userInfo', 'token', 'currentTemplate',
	'userName', 'hasLogin', 'memberId', 'deviceCategoryId', 'areaInfoId',
	'userAvatar', 'userPhone', 'projectCategory', 'currentSystemInfo',
	'currentStorageArea', 'headerTabBg', 'bGColor', 'fontColor', 'urlPrefix',
	'dragLists', 'gatewayDetailLists', 'newVersion', 'notUpdated', 'userRole',
	'areaInfoName', 'createdNewPowerStation', 'powerStationName',
	'powerStationAuthorization', 'noEncryption', 'clearPasswordToo',
	'powerStationsId', 'userInfo' // 新增缓存字段
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
			console.log('当前电站ID:', state.powerStationsId) // 调试输出
			const versionMap = new Map()
				.set(1, 2).set(2, 2).set(3, 2).set(4, 1).set(5, 2)
			return versionMap.get(state.powerStationsId) || 1 // 添加默认值
		},
		currentSystem: state => state.systems.find(system => system.id === state.currentSystemId),
		allSystems: state => state.systems.map(s => ({ id: s.id, name: s.name })),
	}),
	state: {
		userInfo: lifeData.userInfo ? lifeData.userInfo : {},
		headerTabBg: lifeData.headerTabBg ? lifeData.headerTabBg : '#fff', //背景颜色
		bGColor: lifeData.bGColor ? lifeData.bGColor : '#fff',
		fontColor: lifeData.fontColor ? lifeData.fontColor : '#000',
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		vuex_userInfo: lifeData.vuex_userInfo ? lifeData.vuex_userInfo : {},
		token: lifeData.token ? lifeData.token : '',
		// 如果vuex_version无需保存到本地永久存储，无需lifeData.vuex_version方式
		vuex_version: '1.0',
		//登录信息

		vuex_wxCode: '',
		
		
		currentTemplate: lifeData.currentTemplate ? lifeData.currentTemplate : "0",
		deviceCategoryId: lifeData.deviceCategoryId ? lifeData.deviceCategoryId : '',
		areaInfoId: lifeData.areaInfoId ? lifeData.areaInfoId : '',

		currentSystemInfo: lifeData.currentSystemInfo ? lifeData.currentSystemInfo : {},
		currentStorageArea: lifeData.currentStorageArea ? lifeData.currentStorageArea : {},
		urlPrefix: lifeData.urlPrefix ? lifeData.urlPrefix : '',
		dragLists: lifeData.dragLists ? lifeData.dragLists : [],
		gatewayDetailLists: lifeData.gatewayDetailLists ? lifeData.gatewayDetailLists : [],
		notUpdated: lifeData.notUpdated ? lifeData.notUpdated : false,
		newVersion: lifeData.newVersion ? lifeData.newVersion : 'v1.6.0',
		areaInfoName: lifeData.areaInfoName ? lifeData.areaInfoName : '',
		createdNewPowerStation: lifeData.createdNewPowerStation ? lifeData.createdNewPowerStation : false,
		powerStationName: lifeData.powerStationName ? lifeData.powerStationName : '',
		powerStationAuthorization: lifeData.powerStationAuthorization ? lifeData.powerStationAuthorization : [],
		noEncryption: lifeData.noEncryption ? lifeData.noEncryption : false,
		clearPasswordToo: lifeData.clearPasswordToo ? lifeData.clearPasswordToo : false,
		sessionId: lifeData.sessionId ? lifeData.sessionId : '', // 新增缓存字段
		hasLogin: lifeData.hasLogin ? lifeData.hasLogin : false, // 新增缓存字段
		userName: lifeData.userName ? lifeData.userName : '', // 新增缓存字段

		// deviceList:lifeData.deviceList?lifeData.deviceList:[],
		// realTimeService:new RealtimeDataProviderService()
		powerStationNames: [
			{ name: '上海交大光储直柔能源站', esId: 1 },
			{ name: '光伏未来屋光储直柔能源站', esId: 2 },
			{ name: '清华节能楼光储直柔能源站', esId: 3 },
			{ name: '杭州格力光储直柔能源站', esId: 4 },
			{ name: '光伏未来屋智能光储机', esId: 5 },
			{ name: '十千瓦级光储直柔微能源站', esId: 6 }
		],
		
		storageRealData: [],
		powerStationsId: lifeData.powerStationsId ? lifeData.powerStationsId : undefined,
		homeSelectedEsId: lifeData.homeSelectedEsId ? lifeData.homeSelectedEsId : undefined,
		centerList: lifeData.centerList ? lifeData.centerList : [],
		
		currentSystemId: 1,
		currentSystemId: 387
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
		changePowerStationId(state, data) {
			state.powerStationsId = data
		},
		/**
		 * 修改存储实时数据
		 * 
		 * 此函数用于更新状态对象中的存储实时数据该函数接受两个参数：
		 * - state: 任意类型，代表当前的状态对象
		 * - data: 任意类型，代表要更新的实时数据
		 * 
		 * 函数没有返回值其作用是将状态对象中的 storageRealData 属性更新为传入的 data
		 */
		changeStorageRealData(state, data) {
			state.storageRealData = data
		},
		UPDATE_CENTERLIST(state, value) {
			state.centerList = value
			console.log('------------------122', value)
			saveLifeData('centerList', value)
		}
	},
	actions: {
		// 自定义action
		getCenterList(ctx) {
			// const userInfo = JSON.parse(localStorage.getItem('userInfo'))
			const userInfo = {
				_id: "60054086019dcc42e41c91f7",
				username: "homeAdmin",
				name: "NEIIC 国创联能",
				__v: 0,
				role: {
					_id: "60068a98fa3cf1513b206a74",
					name: "admin",
					description: "管理员"
				},
				level: "admin"
			}
			const roleId = userInfo.role._id
			sapi.getCenterList({ roleId }).then(res => {
				console.log(res, 'centerList')
				ctx.commit('UPDATE_CENTERLIST', res.data)
			})
		}
	}
})



export default store