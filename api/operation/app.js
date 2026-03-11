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


// 1、能源站列表
export const queryEnergyStationList = (curPage,pageSize) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/energyStation/queryEnergyStationList?curPage=${curPage}&pageSize=${pageSize}`,
		method: 'get'
	})
}

// 2、创建工程
// export const CreateAreaInfo = (formData) => {
// 	return commonPost('/appletAPI/CreateAreaInfo', formData)
// }

// 2、能源站报表导出-日
export const queryEnergyStationDayReport = (esIdList,date) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/energyStation/queryEnergyStationDayReport?esIdList=${esIdList}&date=${date}`,
		method: 'get'
	})
}
// 3、能源站报表导出-月
export const queryEnergyStationMonthReport = (esIdList,startDate,endDate) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/energyStation/queryEnergyStationMonthReport?esIdList=${esIdList}&startDate=${startDate}&endDate=${endDate}`,
		method: 'get'
	})
}
// 4、能源站报表导出-年
export const queryEnergyStationYearReport = (esIdList,year) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/energyStation/queryEnergyStationYearReport?esIdList=${esIdList}&year=${year}`,
		method: 'get'
	})
}
// 5、能源站设备数据
export const queryAllEnergyStationSituation = (esId) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/energyStation/queryAllEnergyStationSituation?esId=${esId}`,
		method: 'get'
	})
}

// 6、设备弹窗-日
export const queryEnergyStationByDay = (deviceId,date) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/energyStation/queryEnergyStationByDay?deviceId=${deviceId}&date=${date}`,
		method: 'get'
	})
}
// 7、设备弹窗-月
export const queryEnergyStationByMonth = (deviceId,startDate,endDate) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/energyStation/queryEnergyStationByMonth?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}`,
		method: 'get'
	})
}
// 8、设备弹窗-年
export const queryEnergyStationByYear = (deviceId,year) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/energyStation/queryEnergyStationByYear?deviceId=${deviceId}&year=${year}`,
		method: 'get'
	})
}