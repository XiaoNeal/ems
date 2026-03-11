import request from '@/utils/request'

// 通用post接口
export const commonPost = (baseUrl, formData) => {
	return request({
		url: baseUrl,
		method: 'POST',
		data: formData,
		header: {
			'content-type': 'application/json;'
		}
	})
}


// 1、创建网关，绑定工程号
/**
{
    "home_name": null,网关名
    "area_info_id": null,工程号
    "bar_code": null网关号
}*/
export const saveHomeInfo = (formData) => {
	return commonPost('/appletAPI/saveHomeInfo', formData)
}

// 2、通过网关code获取设备信息
export const findDeviceIdByHomeCode = (homeCode) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/appletAPI/findDeviceIdByHomeCode?homeCode=${homeCode}`,
		method: 'get'
	})
}

// 3、通过userid获取用户绑定的网关信息
export const findHomeInfoByUserId = (UserId) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/appletAPI/findHomeInfoByUserId?UserId=${UserId}`,
		method: 'get'
	})
}