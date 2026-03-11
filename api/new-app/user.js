import request from '@/utils/request'

// 通用post接口
export const commonPost =(baseUrl,formData) =>{
	return request({
		url: baseUrl,
		method: 'POST',
		data: formData,
		header: {
			'content-type': 'application/json;'
		}
	})
}


// 1、获取当前超管用户的所掌管的账号，包括自己的。普通用户返回自己的账号信息
export const FindUserInfoById = (userId) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/appletAPI/FindUserInfoById?UserId=${userId}`,
		method: 'get'
	})
}

// 2、修改用户权限接口,授权电站
export const UpdateUserPermission = (formData) => {
	return commonPost('/appletAPI/UpdateUserPermission',formData)
}


// 修改密码
export const UpdatePassword = (formData) => {
	return commonPost('/appletAPI/UpdatePassword',formData)
}

// 获取验证码
export const GetVerificationCode = (phone) => {
	return request({
		url: `/appletAPI/GetVerificationCode?phone=${phone}`,
		method: 'get'
	})
}

