import {
	login,
	getUserInfo,
	userLogin,
	loginByPhone,
	getUserInfoApi
} from '@/api/user'
import { realtimeDataProvider } from '@/service/websocket.js'




const state = {
	// 初始化时从缓存读取
	...uni.getStorageSync('userInfo') || {
		avatar: '',
		balance: 0,
		memberId: '',
		userName: '',
		projectId: '',
		mobile: '',
		id: '',
		token: '',
		sessionId: '',
		loginTime: '',
		roles: [],
		stationId: '',
		stationIds: [],
		roleId: '',
		roleName: '',
		permissions: [],
		esIds: [], // 设备列表
		esUsers: [], // 设备角色关联
	},
	hasLogin: false,
	nickname: '',
	balance: 0,
	memberId: '',
	userName: '',
	projectId: ''
}


const mutations = {
	SET_HAS_LOGIN: (state, hasLogin) => {
		state.hasLogin = hasLogin
	},
	SET_NICKNAME: (state, nickname) => {
		state.nickname = nickname
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	},
	SET_BALANCE: (state, balance) => {
		state.balance = balance
	},
	SET_MEMBERID: (state, memberId) => {
		state.memberId = memberId
	},
	SET_USERNAME: (state, userName) => {
		state.userName = userName
	},
	SET_PROJECTID: (state, projectId) => {
		state.projectId = projectId
	},
	// SET_CURRENTTEMPLATE:(state,currentTemplate)=>{
	// 	state.currentTemplate = currentTemplate
	// }
	SET_USER_INFO(state, payload) {
		state.id = payload.id
		state.userName = payload.username
		state.token = payload.token
		state.sessionId = payload.sessionId
		state.loginTime = payload.loginTime
		state.avatar = payload.avatar
		state.stationId = payload.stationId
		state.stationIds = payload.stationIds || []
		state.roleId = payload.roleId
		state.roleName = payload.roleName
		state.permissions = payload.permissions || []
		state.esIds = payload.esIds || []
		state.esUsers = payload.esUsers || []

		// 新增持久化存储
		uni.setStorageSync('userInfo', {
			id: payload.id,
			userName: payload.username,
			token: payload.token,
			sessionId: payload.sessionId,
			loginTime: payload.loginTime,
			avatar: payload.avatar,
			stationId: payload.stationId,
			stationIds: payload.stationIds || [],
			roleId: payload.roleId,
			roleName: payload.roleName,
			permissions: payload.permissions || [],
			esIds: payload.esIds || [],
			esUsers: payload.esUsers || []
		})
	},

	UPDATE_USER(state, payload) {
		console.log(payload, 'UPDATE_USER')
		if (payload.avatar !== undefined) {
			state.avatar = payload.avatar;
		}
		if (payload.imageFile !== undefined) {
			state.avatar = payload.imageFile;
		}
		if (payload.email !== undefined) {
			state.email = payload.email;
		}
		if (payload.userName !== undefined) {
			state.userName = payload.userName;
		}
		if (payload.mobile !== undefined) {
			state.mobile = payload.mobile;
		}
		if (payload.roleId !== undefined) {
			state.roleId = payload.roleId;
		}
		if (payload.roleName !== undefined) {
			state.roleName = payload.roleName;
		}
	}
}

const actions = {
	login({
		commit
	}, data) {
		const {
			username,
			password
		} = data

		return new Promise((resolve, reject) => {
			userLogin(username, password).then(response => {
				const code = response.status || response.code
				if (code != 200 && code != 10000) { resolve(code); return; }
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},

	loginByPhone({
		commit
	}, data) {
		const {
			phone,
			verificationCode
		} = data
		return new Promise((resolve, reject) => {
			loginByPhone(phone, verificationCode).then(response => {
				const code = response.code
				if (code != 200) { resolve(code); return; }
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})

	},


	// get user info
	getUserInfo({
		commit,
		state
	}) {
		return new Promise((resolve, reject) => {
			getUserInfo().then(response => {
				const {
					data
				} = response
				if (!data) {
					reject('Verification failed, please Login again.')
				}
				const {
					id,
					nickName,
					avatarUrl,
					balance
				} = data
				commit('SET_NICKNAME', nickName)
				commit('SET_AVATAR', avatarUrl)
				commit('SET_BALANCE', balance)
				commit('SET_MEMBERID', id)
				resolve(data)
			}).catch(error => {
				reject(error)
			})
		})
	},




	async getInfo({ commit }, { userId,sessionId, loginTime }) {
		const { data } = await getUserInfoApi(userId)
		const payload = {
			id: userId,
			sessionId: sessionId,
			loginTime: loginTime,
			roleId: data.roleId,
			roleName: data.roleName,
			stationId: 0,
			stationIds: data.esIds || [],
			esIds: data.esIds || [],
			esUsers: data.esUsers || data.es_users || [],
			permissions: data.pagePermission || [],
		}
		commit('SET_USER_INFO', payload)
	},
	// user logout
	logout({
		commit
	}) {
		return new Promise((resolve, reject) => {
			// 清理 WebSocket 连接
			try {
				realtimeDataProvider.clearDeviceState();
			} catch (e) {
				console.warn('清理实时数据连接失败:', e);
			}
			uni.clearStorageSync();
			commit('SET_HAS_LOGIN', false)
			commit('SET_NICKNAME', '')
			commit('SET_AVATAR', '')
			commit('SET_BALANCE', '')
			commit('SET_MEMBERID', '')
			commit('SET_USER_INFO', {
				id: '', userName: '', token: '', sessionId: '', loginTime: '',
				avatar: '', stationId: '', stationIds: [], roleId: '', roleName: '',
				permissions: [], esIds: [], esUsers: []
			})
			resolve()
		})
	}
}

const getters = {
	isLoggedIn: (state) => !!state.sessionId,
	isSingle: (state) => (state.stationIds || []).length == 1,
	hasRole: (state) => (role) => (state.roles || []).includes(role),
	hasPermission: (state) => (permission) =>
		(state.permissions || []).includes(permission),
	pagePermission: (state) => (pageId) => {
		console.log(state.permissions, pageId, 'pagePermission');
		const permissionItem = state.permissions.find((item) => item.pageId === pageId);
		return permissionItem && permissionItem.operationTypes || [];
	}

}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}