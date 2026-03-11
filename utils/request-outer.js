import axios from 'axios'
import store from '@/store'

import {
	decrypt
} from "@/utils/decryptData.js"
import {
	RealtimeDataProviderService
} from '@/service/socket/realtime-data-provider'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

// header: {
//     'content-type':'application/x-www-form-urlencoded' 
// },

// create an axios instance
// #ifdef MP,APP-PLUS
const service = axios.create({
	//baseURL: "https://api.youlai.tech", //  微信线上接口地址
	// baseURL: "http://app.youlai.tech/prod-api", //  H5/Android/iOS 线上地址

	baseURL: "", // 本地开发环境地址
	// baseURL: "http://172.17.160.46:9011", // 本地开发环境地址
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 10000 // request timeout
})
// #endif

// #ifdef MP-WEIXIN
const service = axios.create({
	//baseURL: "https://api.youlai.tech", //  微信线上接口地址
	// baseURL: "http://app.youlai.tech/prod-api", //  H5/Android/iOS 线上地址
	// baseURL: "http://serviceiems.gree.com", // 本地开发环境地址
	baseURL: "", // 本地开发环境地址
	// baseURL: "http://172.17.160.46:9011", // 本地开发环境地址
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 10000 // request timeout
})
// #endif

// #ifdef H5
const service = axios.create({
	//baseURL: "https://api.youlai.tech", //  微信线上接口地址
	// baseURL: "http://app.youlai.tech/prod-api", //  H5/Android/iOS 线上地址
	baseURL: "", // 本地开发环境地址
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 10000 // request timeout
})
// #endif

// request interceptor
service.interceptors.request.use(
	config => {
		// let deviceCategoryId = store.state.deviceCategoryId
		// if(deviceCategoryId==30){
		// 	config.baseURL='https://api.0756.online'
		// }
		// do something before request is sent
		// if (config.headers.auth === true) { // 判断请求是否需要认证
		const token = store.state.token || uni.getStorageSync('token')
		let wifiName = uni.getStorageSync('wifiName')
		config.headers['token'] = token
	
		return config
	},
	error => {
		// do something with request error
		return Promise.reject(error)
	}
)

service.defaults.adapter = function(config) {
	return new Promise((resolve, reject) => {
		var settle = require('axios/lib/core/settle');
		var buildURL = require('axios/lib/helpers/buildURL');
		uni.request({
			method: config.method.toUpperCase(),
			url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
			header: config.headers,
			data: config.data,
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: config.sslVerify,
			timeout:10000,
			complete: function complete(response) {
				response = {
					data: response.data,
					status: response.statusCode,
					errMsg: response.errMsg,
					header: response.header,
					config: config
				};

				settle(resolve, reject, response);
			},
			fail(err) {
			}
		})

	})
}


// response interceptor
service.interceptors.response.use(({
		config,
		data,
		errMsg
	}) => {
		const target = "timeout"
		if(errMsg.includes(target)){
			uni.hideLoading()
			uni.showToast({
				title:"网络连接异常，请检查网络",
				icon:"none"
			})
			return false
		}
		// if(!data){
			
		// }
		let result = data

		if(result.status == 200){
			
			return result;
		}
		if(store.state.noEncryption || store.state.currentTemplate==2){
			return result
		}
		return result
		// if (config.url.substring(0, 4) == "/api" || store.state.urlPrefix || (store.state.userRole && store.state.memberId != 196)) {
		// 	console.log("解密前：", data);
		// 	result = JSON.parse(decrypt(data))
		// 	return result
		// }
		
	},
	error => {
		const {
			code,
			msg
		} = error.response.data
		console.log('error',error);
		var pages = getCurrentPages()
		var page = pages[pages.length - 1];
		if (page.route == "pages/login/login") return;
		if (code === '401') { // token过期
			let that = this
			uni.showToast({
				title: '会话已过期，请重新登录',
				success() {
					// console.log(that.$store.state.currentTemplate);
					// that.$u.vuex('currentTemplate', 0);
					RealtimeDataProviderService.closeSocket()
					uni.clearStorageSync();
					uni.reLaunch({
						url: `/pages/login/login`,
						// url: '/pages/index/index'
					});
				}
			})
		} else {
			uni.showToast({
				title: msg,
				icon: 'none'
			});
			return Promise.reject(new Error(msg || 'Errors'))
		}
	}
)

export default service