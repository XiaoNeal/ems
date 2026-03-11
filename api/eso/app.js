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

// // 1、查询工程
// export const FindAllAreaInfoByUserId = (userId) => {
// 	// 请求参数：String  year(yyyy)
// 	return request({
// 		url: `/appletAPI/FindAllAreaInfoByUserId?UserId=${userId}`,
// 		method: 'get'
// 	})
// }
// 1、根据DeviceIds查询报表数据，按日查询
export const findEveryHourByDeviceIds = (formData) => {
	return commonPost('/api/shangHaiZYNYL/findEveryHourByDeviceIds', formData)
}

// 2、根据DeviceIds查询报表数据，按月查询
export const findEveryDayByDeviceIds = (formData) => {
	return commonPost('/api/shangHaiZYNYL/findEveryDayByDeviceIds', formData)
}

// 3、根据DeviceIds查询报表数据，按年查询
export const findEveryMonthByDeviceIds = (formData) => {
	return commonPost('/api/shangHaiZYNYL/findEveryMonthByDeviceIds', formData)
}
