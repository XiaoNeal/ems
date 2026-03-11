import {
	login,
	getUserInfo,
	logout,
	userLogin,
	loginByPhone,
	getUserInfoApi
} from '@/api/user'

import {
	findByProjectId
} from '@/api/invert'



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
		roles: [],
		stationId: '',
		stationIds: [],
		roleId: '',
		roleName: '',
		permissions: [],
		powerStationsId: '', // 新增缓存字段
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
		state.avatar = payload.avatar
		state.stationId = payload.stationId
		state.stationIds = payload.stationIds
		state.roleId = payload.roleId
		state.roleName = payload.roleName
		state.permissions = payload.permissions
		state.powerStationsId = payload.powerStationsId

		// 新增持久化存储
		uni.setStorageSync('userInfo', {
			id: payload.id,
			userName: payload.username,
			token: payload.token,
			sessionId: payload.sessionId,
			avatar: payload.avatar,
			stationId: payload.stationId,
			stationIds: payload.stationIds,
			roleId: payload.roleId,
			roleName: payload.roleName,
			permissions: payload.permissions,
			powerStationsId: payload.powerStationsId
		})
	},

	UPDATE_USER(state, payload) {
		// state.user = {

		state.avatar = payload.imageFile;
		state.email = payload.email;
		state.userName = payload.userName
		state.mobile = payload.mobile;
		// };
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

			})
		})
	},

	loginByPhone1({
		commit
	}, data) {
		const {
			phone,
			verificationCode
		} = data
		return new Promise((resolve, reject) => {
			loginByPhone(phone, verificationCode).then(response => {
				console.log(response, 'loginByPhone');
				const code = response.status
				if (code != 200) { resolve(code); return; }
				const {
					mobile,
					userName,
					token,
					role,
					projectCategory

				} = response.data
				resolve(response)

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




	async getInfo({ commit }, { userId,sessionId }) {
		const { data } = await getUserInfoApi(userId)
		console.log('getUserInfoApi', data)
		const payload = {
			id: userId,
			sessionId: sessionId,
			roleId: data.roleId,
			roleName: data.roleName,
			stationId: 0,
			stationIds: data.esIds,
			permissions: data.pagePermission,
		}
		commit('SET_USER_INFO', payload)
	},
	// user logout
	logout({
		commit,
		state,
	}) {

		return new Promise((resolve, reject) => {
			// logout().then(() => {
			// uni.removeStorageSync("userInfo")
			// uni.removeStorageSync("token")
			uni.clearStorageSync();
			commit('SET_HAS_LOGIN', false)
			commit('SET_NICKNAME', '')
			commit('SET_AVATAR', '')
			commit('SET_BALANCE', '')
			commit('SET_MEMBERID', '')
			state.lifeData = null
			resolve()
			// }).catch(error => {
			// 	reject(error)
			// })
		})
	}
}

const getters = {
	isLoggedIn: (state) => !!state.sessionId,
	isSingle: (state) => state.stationIds.length == 1,
	hasRole: (state) => (role) => state.roles.includes(role),
	hasPermission: (state) => (permission) =>
		state.permissions.includes(permission),
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