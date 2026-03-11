
const state = {
	deviceList: [],
	currentDevice:{}
}

const mutations = {
	SET_DEVICE_LIST(state, value) {
		state.deviceList = value
	},
	SET_CURRENT_DEVICE(state,value){
		state.currentDevice = value
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
