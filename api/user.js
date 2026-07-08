/**
 * 用户相关api
 */
import request from '@/utils/request'
import store from '@/store'
import md5 from "@/utils/md5.min.js";
export const userLogin = (userName, password) => {
	const systemInfo = uni.getSystemInfoSync();
	let deviceId = `${systemInfo.brand}-${systemInfo.model}-${systemInfo.screenWidth}x${systemInfo.screenHeight}`;
	let deviceHash = md5(deviceId);
	const requestData = {
		username: userName,
		password: password,
		hashIP: deviceHash
	};

	return request({
		url: `/SsoServer/app/LoginByJson`,
		method: 'post',
		data: JSON.stringify(requestData),
		header: {
			'Content-Type': 'application/json'
		}
	});
};



export const getUserInfoApi = (roleId) => {
	return request.get(`/api/energyStation/relation/userDetails/${roleId}`)
}



export const appLogin = (userName, password) => {
	let paramData = JSON.stringify({
		"userName": userName,
		"password": password
	});
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://serviceiems.gree.com/appletAPI/Login',
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
};



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

export const appRegister = (formdata) => {
	return request({
		url: `/appletAPI/Register`,
		method: 'post',
		data: formdata,
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
}


export function getUserInfo() {
	return uni.request({
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
	const systemInfo = uni.getSystemInfoSync();
	let deviceId = `${systemInfo.brand}-${systemInfo.model}-${systemInfo.screenWidth}x${systemInfo.screenHeight}`;
	let deviceHash = md5(deviceId);
	const requestData = {
		tel: phone,
		code: verificationCode,
		hashIP: deviceHash
	};
	return request({
		url: '/SsoServer/app/LoginByTelJson',
		method: 'POST',
		header: {
			'Content-Type': 'application/json'
		},
		data: JSON.stringify(requestData),
	});
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
		url: `/SsoServer/app/getVerificationCode?tel=${phoneNumber}`,
		method: 'GET',
	})
}

export function updateUserInfo(formData) {
	return request({
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
	return request({
		url: `/appletAPI/downloadAPK?version=${version}&osName=${osName}`,
		method: 'get'
	})
}

export const UpdatePasswordBySms = (data) => {
	return request({
		url: '/SsoServer/app/ForgetPasswordByTel',
		method: 'POST',
		header: {
			'Content-Type': 'application/json'
		},
		data: data,
	});
}

export const loginPermission = (data) => {
	return request({
		url: "/SsoServer/homeCommunity/loginPermission",
		method: 'post',
		header: {
			'Content-Type': 'application/json'
		},
		data: data,
	})
}

// 微信登录
export const loginByWechat = (code) => {
	return request({
		url: '/SsoServer/app/LoginByWechatJson',
		method: 'POST',
		header: {
			'Content-Type': 'application/json'
		},
		data: JSON.stringify({
			code: code
		})
	})
}

// 新微信登录接口
export const wechatLogin = (code, key = 1) => {
	return request({
		url: '/SsoServer/wechatLogin',
		method: 'GET',
		data: {
			code: code,
			key: key
		}
	})
}

// 获取用户区域等级
export const getUserAreaLevel = (userId) => {
	return request({
		url: `/api/Homecommunity/getLevelsOfUser?userId=${userId}`,
		method: 'GET'
	})
}

export const wxLoginApi = (code, key = 0) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `/SsoServer/es/wechatLogin?code=${code}&key=${key}`,
		method: 'get'
	})
}

// 根据用户CodeId获取设备列表信息
export const findUserInfoByCodeId = (codeId) => {
	return request({
		url: `/SsoServer/es/FindUserInfoByCodeId`,
		method: 'GET',
		data: {
			CodeId: codeId
		}
	})
}

// 绑定设备到用户
export const bindEsUserByQrId = (qrId, esUserId) => {
	return request({
		url: `/api/Homecommunity/BindEsUserByQrId`,
		method: 'GET',
		data: {
			qrId: qrId,
			esUserId: esUserId
		}
	})
}

// 删除设备
export const deleteEsUser = (data) => {
	return request({
		url: `/api/Homecommunity/deleteEsUser`,
		method: 'POST',
		data: data,
		header: {
			'Content-Type': 'application/json'
		}
	})
}

export const getUserInfoByEsId = (esId) => {
	return request({
		url: `/api/Homecommunity/GetUserInfoByEsId`,
		method: 'GET',
		params: {
			esId: esId
		}
	})
}

export const bindEsUserByTelAndEsId = (tel, esId) => {
	return request({
		url: `/api/Homecommunity/BindEsUserByTelAndEsId`,
		method: 'GET',
		params: {
			Tel: tel,
			esId: esId
		}
	})
}

export const changeEsUserByTelAndEsId = (tel, esId) => {
	return request({
		url: `/api/Homecommunity/ChangeEsUserByTelAndEsId`,
		method: 'GET',
		params: {
			Tel: tel,
			esId: esId
		}
	})
}

export const changeEsUserRoleByUserIdAndEsId = (userId, esId, roleId) => {
	return request({
		url: `/api/Homecommunity/ChangeEsUserRoleByUserIdAndEsId`,
		method: 'GET',
		params: {
			userId: userId,
			esId: esId,
			roleId: roleId
		}
	})
}