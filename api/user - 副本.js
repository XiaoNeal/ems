/**
 * 用户相关api
 */
import request from '@/utils/request'
export const userLogin = (userName, password) => {
	// let wifiName = uni.getStorageSync('wifiName')
	let wifiName = ''
	let _this = this
	uni.startWifi({
		complete(res){
			uni.getConnectedWifi({
				complete(res){
					_this.wifiName= res.wifi.SSID
				}
			})
		}
	})
	let paramData = JSON.stringify({
		"userName": userName,
		"password": password
	});

	if (wifiName == "Neiic-14#") {
		return new Promise((resolve, reject) => {
			uni.request({
				url: 'http://172.17.160.46/homecommunity/login',
				method: 'POST',
				header: {
					'Content-Type': 'application/json'

				},
				success: res => {
					resolve(res.data);
				},
				fail: res => {
					reject(res);
				}
			});
		});
	} else {
		return new Promise((resolve, reject) => {
			uni.request({
				url: 'https://serviceiems.gree.com/appletAPI/user/login',
				// url: 'http://172.17.160.46/homecommunity/login',
				method: 'POST',
				header: {
					'Content-Type': 'application/json'
				},
				data: {
					"userName": userName,
					"password": password
				},
				success: res => {
					resolve(res.data);
				},
				fail: res => {
					reject(res);
				}
			});
		});
	}

};

// export const userLogin = (userName, password) => {
// 	let paramData = JSON.stringify({
// 		"userName": userName,
// 		"password": password
// 	})

// 	uni.request({
// 		url: '/appletAPI/user/login',
// 		method: 'POST',
// 		header:{
// 			'Content-Type' : 'application/json',
// 			// token : uni.getStorageSync("TOKEN")
// 		},
// 		data: {
// 			"userName": userName,
// 			"password": password
// 		},
// 		success: res => {
// 			return res
// 		},
// 		fail: () => {},
// 		complete: () => {}
// 	});

// 	// return uni.request({url:'/appletAPI/user/login',method: 'POST',data:paramData})
// 	// return request({
// 	// 	url: `/appletAPI/user/login`,
// 	// 	method: 'post',
// 	// 	data: paramData,
// 	// 	header: {
// 	// 		'content-type': 'application/json;'
// 	// 	}
// 	// })
// }
export const userRegister = (formdata) => {
	let paramData = JSON.stringify({
		"data": formdata
	})
	return request({
		url: `/appletAPI/user/register`,
		method: 'post',
		data: paramData,
		header: {
			'content-type': 'application/json;'
		}
	})
}

// H5/Android/IOS 手机短信验证码登录
export function login(username, password) {
	let paramData = JSON.stringify({
		username: username,
		password: password
	})
	return uni.request({
		url: '/api/token/authorization',
		method: 'POST',
		data: {
			data: paramData
		}
	})
	// return request({
	// 	// url: '/youlai-auth/oauth/token',
	// 	url: '/api/token/authorization',
	// 	method: 'POST',
	// 	data: {
	// 		data: paramData
	// 	},
	// 	header: {
	// 		'content-type': 'application/json;'
	// 	}
	// })
}


export function logout() {
	return uni.request({
		url: '/youlai-auth/oauth/logout',
		method: 'delete',
		headers: {
			'auth': true // 需要认证，通过
		}
	})
}

export function getUserInfo() {

	return uni.request({
		// url: '/youlai-auth/oauth/token',
		url: 'https://serviceiems.gree.com/api/userLogin2',
		method: 'POST',
		data: {

		},
		header: {
			'content-type': 'application/json;charset:utf-8'
		}
	})
}

export function loginByPhone(phone, verificationCode) {
	let paramData = JSON.stringify({
		"phone": phone,
		"verificationCode": verificationCode
	})
	return request({
		// url: '/youlai-auth/oauth/token',
		url: `/appletAPI/user/loginByPhone`,
		method: 'POST',
		data: {
			data: paramData
		},
		header: {
			'content-type': 'application/json;charset:utf-8'
		}
	})
}

// export function sendSmsCode(phoneNumber) {
// 	return uni.request({
// 		url: '/youlai-auth/sms-code',
// 		method: 'post',
// 		params: {
// 			phoneNumber: phoneNumber
// 		}
// 	})
// }
export function sendSmsCode(phoneNumber) { //获取验证码
	return request({
		url: `/appletAPI/user/getVerificationCode?phone=${phoneNumber}`,
		method: 'GET',
	})

}

export function updateUserInfo(formData) { //更改用户信息

	return request({
		// url: '/youlai-auth/oauth/token',
		url: `/appletAPI/user/updateUserInfo`,
		method: 'POST',
		data: {
			data: formData
		},
		header: {
			'content-type': 'application/json;charset:utf-8'
		}
	})
}


export const downloadAPK = (version, osName) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `/appletAPI/downloadAPK?version=${deviceId}&osName=${type}`,
		method: 'get'
	})
}