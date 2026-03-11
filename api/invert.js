import request from '@/utils/request'
import {
	dateStandardFormat,
	dateFormatTime
} from "@/utils/date-format"
import {
	methods
} from '../uni_modules/uview-ui/libs/mixin/mixin'


// homecommunity/statistic/findDayStatisticsDetailsByLevelIdAndDay?id=616e6a5a84c6e1930fa05933&day=2023-02-17
// export const findDayStatisticsDetailsByLevelIdAndDay = (day) => {
// 	return request({
// 		url: `/api/homeCommunity/findDayStatisticsDetailsByLevelIdAndDay?areaLevelId=505&day=${dateStandardFormat(day)}`,
// 		method: 'get'

// 	})
// }

// 1、查询每日收益
// export const getStatisticsDayByLevelAndDays = (startDay, endDay) => {

// 	return request({
// 		url: `/api/homeCommunity/getStatisticsDayByLevelAndDays?areaLevelId=505&startDay=${dateStandardFormat(startDay)}&endDay=${dateStandardFormat(endDay)}`,
// 		method: 'get'

// 	})
// }


// 查询每月收益
// export const getStatisticsMonthByLevelAndYearsAndMonths = (startYear, startMonth, endYear, endMonth) => {
// 	return request({
// 		url: `/api/homeCommunity/getStatisticsMonthByLevelAndYearsAndMonths?areaLevelId=505&startYear=${2023}&startMonth=${startMonth}&endYear=${2023}
// 	&endMonth=${endMonth}`,
// 		method: 'get'

// 	})
// }

// 查询每年收益
// export const getStatisticsYearByLevelAndYears = (startYear, endYear) => {
// 	return request({
// 		url: `/api/homeCommunity/getStatisticsYearByLevelAndYears?areaLevelId=505&startYear=${startYear}&endYear=${endYear}`,
// 		method: 'get'

// 	})
// }

// 查询每年收益
// export const findHomeCommunityPowerSumByLevelIdAndDataType = (startDate, endDate) => {
// 	let paramData = JSON.stringify({
// 		"areaLevelId": 505,
// 		"dataType": 0,
// 		"startDate": dateStandardFormat(startDate),
// 		"endDate": dateStandardFormat(endDate)
// 	})
// 	return request({
// 		url: `/api/homeCommunity/findHomeCommunityPowerSumByLevelIdAndDataType`,
// 		method: 'post',
// 		data: {
// 			data: paramData
// 		},
// 		header: {
// 			'content-type': 'application/json;'
// 		}

// 	})
// }

// 1.登录接口
export const userLogin = (formdata) => {
	// let paramData = JSON.stringify({
	// 	"userName": userName,
	// 	"password": password
	// })
	// return request({
	// 	url: `/appletAPI/user/login`,
	// 	method: 'post',
	// 	data: formdata,
	// 	header: {
	// 		'content-type': 'application/json;'
	// 	}
	// })
	
	return uni.request({
		url: '/appletAPI/user/login',
		method: 'POST',
		header:{
			'Content-Type' : 'application/json',
			// token : uni.getStorageSync("TOKEN")
		},
		data: formdata
		
	});
}
// 2.根据用户id和设备大类id查询大类下用户所拥有的设备小类信息（用户的设备列表）
// export const findByProjectId = (projectId) => {
// 	return request({
// 		url: `/appletAPI/device/findByProjectId?projectId=${projectId}`,
// 		method: 'get'
// 	})
// }
export const findByUserId = (userId,deviceCategoryId) => {
	return request({
		url: `/appletAPI/device/findByUserId?userId=${userId}&deviceCategoryId=${deviceCategoryId}`,
		method: 'get'
	})
}

// 3.查询设备统计信息(日,月,年)——查询某天用户的设备用电量之和（修改）
// export const findAllByDay = (deviceId, day, type) => {
// 	// let deviceId = 0
// 	// let type = 0
// 	return request({
// 		url: `/appletAPI/statisticsAll/findAllByDay?deviceId=${deviceId}&day=${dateStandardFormat(day)}&type=${type}`,
// 		method: 'get'
// 	})
// }

export const findAllByDay = (userId, day, type,deviceCategoryId) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `/appletAPI/statisticsAll/findAllByDayV2?userId=${userId}&day=${dateStandardFormat(day)}&type=${type}&deviceCategoryId=${deviceCategoryId}`,
		method: 'get'
	})
}

// 4.查询当天每小时的统计量
export const findByDeviceIdAndDateAndType = (deviceId, day, type) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `/appletAPI/statisticsHour/findByDeviceIdAndDateAndType?deviceId=${deviceId}&day=${dateStandardFormat(day)}&type=${type}`,
		method: 'get'
	})
}

// 5.查询当月每天的统计量
export const findByDates = (deviceId, startDay, endDay, type) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `/appletAPI/statisticsDay/findByDates?deviceId=${deviceId}&startDay=${dateFormatTime(startDay)}&endDay=${dateFormatTime(endDay)}&type=${type}`,
		method: 'get'
	})
}

// 6.查询当年每月的统计量
export const findByDeviceIdAndYearAndType = (deviceId, year, type) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `/appletAPI/statisticsMonth/findByDeviceIdAndYearAndType?deviceId=${deviceId}&year=${year}&type=${type}`,
		method: 'get'
	})
}

// 7.查询每年统计量
export const findByDeviceIdAndType = (deviceId, type) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `/appletAPI/statisticsYear/findByDeviceIdAndType?deviceId=${deviceId}&type=${type}`,
		method: 'get'
	})
}
// export const findByDeviceIdAndType = (deviceIds, type) => {
// 	// let deviceId = 0
// 	// let type = 0
// 	return request({
// 		url: `/appletAPI/statisticsYear/findByDeviceIdAndType?deviceIds=1053128&type=0`,
// 		method: 'get'
// 	})
// }
// 8.查询当天24小时的功率
// export const findByDeviceIdAndFrameDatetimeBetween = (deviceId, tystartDatetimepe, endDatetime) => {
// 	// let deviceId = 0
// 	return request({
// 		url: `/appletAPI/t0110Energy/findByDeviceIdAndFrameDatetimeBetween?deviceId=${deviceId}&startDatetime=${dateFormatTime(tystartDatetimepe)}&endDatetime=${dateFormatTime(endDatetime)}`,
// 		method: 'get'
// 	})
// }
export const findByDeviceIdAndFrameDatetimeBetween = (userId, startDatetime, endDatetime,deviceCategoryId) => {
	return request({
		url: `/appletAPI/t0110Energy/findByDeviceIdAndFrameDatetimeBetweenV2?userId=${userId}&startDatetime=${dateFormatTime(startDatetime)}&endDatetime=${dateFormatTime(endDatetime)}&deviceCategoryId=${deviceCategoryId}`,
		method: 'get'
	})
}

// 9.获取用户用的设备类型（新增）
export const findDeviceTypeByUserId = (deviceId, tystartDatetimepe, endDatetime) => {
	// let deviceId = 0
	return request({
		url: `/appletAPI/device/findDeviceTypeByUserId?userId=1`,
		method: 'get'
	})
}

// 10.更新设备名
export const updateDeviceNameByDeviceId = (deviceId,deviceName) => {
	// let deviceId = 0
	return request({
		url: `/appletAPI/device/updateDeviceNameByDeviceId?deviceId=${deviceId}&deviceName=${deviceName}`,
		method: 'get'
	})
}

// 11.多台设备发电量日查询
export const findByDatesTotal = (userId,startDay,endDay,deviceCategoryId) => {
	// let deviceId = 0
	return request({
		url: `/appletAPI/statisticsDay/findByDatesTotal?userId=${userId}&startDay=${dateStandardFormat(startDay)}&endDay=${dateStandardFormat(endDay)}&type=0&deviceCategoryId=${deviceCategoryId}`,
		method: 'get'
	})
}
// 12.多台设备发电量小时查询
export const findByUserIdAndDateAndTypeTotal = (userId,day,deviceCategoryId) => {
	// let deviceId = 0
	return request({
		url: `/appletAPI/statisticsHour/findByUserIdAndDateAndTypeTotal?userId=${userId}&day=${dateStandardFormat(day)}&type=0&deviceCategoryId=${deviceCategoryId}`,
		method: 'get'
	})
}
// 13.多台设备发电量月查询
export const findByUserIdAndYearAndTypeTotal = (userId,year,deviceCategoryId) => {
	// let deviceId = 0
	return request({
		url: `/appletAPI/statisticsMonth/findByUserIdAndYearAndTypeTotal?userId=${userId}&year=${year}&type=0&deviceCategoryId=${deviceCategoryId}`,
		method: 'get'
	})
}

// 14.多台设备发电量年查询
export const findByUserIdAndTypeTotal = (userId,deviceCategoryId) => {
	// let deviceId = 0
	return request({
		url: `/appletAPI/statisticsYear/findByUserIdAndTypeTotal?userId=${userId}&type=0&deviceCategoryId=${deviceCategoryId}`,
		method: 'get'
	})
}

// 15.添加新设备
export const saveNewDevice = (formdata) => {
	// let form = JSON.stringify({
	// 	data:formdata
	// })
	return request({
		url: `/appletAPI/device/saveNewDevice`,
		method: 'post',
		data: {
			data:formdata
		},
		header: {
			'content-type': 'application/json;'
		}
	})
}

