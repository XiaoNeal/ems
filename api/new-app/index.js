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


// 1、查询工程
export const FindAllAreaInfoByUserId = (userId) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/appletAPI/FindAllAreaInfoByUserId?UserId=${userId}`,
		method: 'get'
	})
}

// 2、创建工程
export const CreateAreaInfo = (formData) => {
	return commonPost('/appletAPI/CreateAreaInfo', formData)
}

// 3、查询电站
export const FindPowerStation = (userId, areaInfoId) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/appletAPI/FindPowerStation?UserId=${userId}&AreaInfoId=${areaInfoId}`,
		method: 'get'
	})
}

// 4、新建电站
export const CreatePowerStation = (formData) => {
	return commonPost('/appletAPI/CreatePowerStation', formData)
}


// 5、删除电站
export const DeletePowerStation = (formData) => {
	return commonPost('/appletAPI/DeletePowerStation', formData)
}

// 6.电站绑定设备
/*
formdata=[
    {
        "deviceId": 1,//deviceId
        "powerStationId": 127,//电站信息
        "statisticsFlag": null,
        "percentage": null//当前设备的百分比
    },
    {
        "deviceId": 2,
        "powerStationId": 127,
        "statisticsFlag": null,
        "percentage": null
    }
]
*/
export const PowerStationBindDevice = (formData) => {
	return commonPost('/appletAPI/PowerStationBindDevice', formData)
}


// 7、电站更新图片
export const UpdatePowerStationImage = (formData) => {
	return request({
		url: '/appletAPI/UpdatePowerStationImage',
		method: 'POST',
		data: formData,
		headers: {
			"content-type": "multipart/form-data",
		}
	})
}

// 8、查询电站
export const FindEnergyDataByPowerStationId = (PowerStationId, fromDate) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/appletAPI/FindEnergyDataByPowerStationId?PowerStationId=${PowerStationId}&fromDate=${fromDate}`,
		method: 'get'
	})
}

// 9、查询电站
export const FindDeviceByPowerStationId = (PowerStationId) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/appletAPI/FindDeviceByPowerStationId?PowerStationId=${PowerStationId}`,
		method: 'get'
	})
}

// 10、修改电站信息
export const UpdatePowerStation = (formData) => {
	return commonPost('/appletAPI/UpdatePowerStation', formData)
}