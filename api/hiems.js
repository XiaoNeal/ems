import request from '@/utils/request'
import {
	dateStandardFormat,
	dateFormatTime
} from "@/utils/date-format"
import {
	methods
} from '../uni_modules/uview-ui/libs/mixin/mixin'

// 通用post接口
export const commonPost =(baseUrl,formData) =>{
	return request({
		url: baseUrl,
		method: 'POST',
		data: {data:formData},
		header: {
			'content-type': 'application/json;'
		}
	})
}
// 1、获取多个层级年的每月层级统计数据
export const findYearStatisticsDetailsByLevelIdsAndYear = (formData) => {
	return commonPost('/api/homeCommunity/findYearStatisticsDetailsByLevelIdsAndYear',formData)
}

// 2、获取多个层级月的每天层级统计数据
export const findMonthStatisticsDetailsByLevelIdsAndMonth = (formData) => {
	return commonPost('/api/homeCommunity/findMonthStatisticsDetailsByLevelIdsAndMonth',formData)
}

// 3、获取多个层级天的每小时层级统计数据
export const findDayStatisticsDetailsByLevelIdsAndDay = (formData) => {
	return commonPost('/api/homeCommunity/findDayStatisticsDetailsByLevelIdsAndDay',formData)
}

// 4.获取各网关的信息
export const findBarCodeAndDeviceTypeByAreaIdList = (formData) => {
	return commonPost('/api/homeCommunity/findBarCodeAndDeviceTypeByAreaIdList',formData)
}


// 5、获取某个层级某天的总用电、人均用电、单位面积用电
export const findSubareaConsumptionByDay = (day) => {
	// 请求参数：String  day (yyyy-MM-dd)
	return request({
		url: `/api/homeCommunity/findSubareaConsumptionByDay?day=${day}`,
		method: 'get'
	})
}

// 6、获取某个层级某月的总用电、人均用电、单位面积用电
export const findSubareaConsumptionByMonth = (day) => {
	// 请求参数：String  day (yyyy-MM-dd)
	return request({
		url: `/api/homeCommunity/findSubareaConsumptionByMonth?month=${day}`,
		method: 'get'
	})
}

// 7、获取某个层级某年的总用电、人均用电、单位面积用电
export const findSubareaConsumptionByYear = (day) => {
	// 请求参数：String  day (yyyy-MM-dd)
	return request({
		url: `/api/homeCommunity/findSubareaConsumptionByYear?year=${day}`,
		method: 'get'
	})
}


// 8.获取多个层级的发电、储能、电网、用电的实时功率
export const findHomeCommunityPowerSumByLevelIds = (formData) => {
	// let formData = JSON.stringify({
	// 	areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
	// 	startDate:"2021-03-24 15:40:00", //开始日期，字符串
	// 	endDate:"2021-03-24 18:55:00" //结束日期，字符串
	// })
	return commonPost('/api/homeCommunity/findHomeCommunityPowerSumByLevelIds',formData)
}



// 9.获取多个层级的发电、储能、电网、用电的实时功率
export const findCleanElectricityType = (formData) => {
	// let formData = JSON.stringify({
	// 	areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
	// 	startDate:"2021-03-24 15:40:00", //开始日期，字符串
	// 	endDate:"2021-03-24 18:55:00" //结束日期，字符串
	// })
	return commonPost('/api/homeCommunity/findCleanElectricityType',formData)
}

// 10、获取多个层级的某日的发电、储能、电网、用电的电量总和
export const findHomeCommunityCapacitySumByLevelIds = (formData) => {
	// let formData = JSON.stringify({
	// 	areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
	// 	date:"2021-03-24", //开始日期，字符串

	// })
	return commonPost('/api/homeCommunity/findHomeCommunityCapacitySumByLevelIds',formData)
	// return commonPost('/api/homeCommunity/findHomeCommunityCapacitySumByLevelIds',formData)
}

// 11、获取多个层级的总的发电、储能、电网、用电的电量总和
export const findHomeCommunityTotalCapacitySumByLevelIds = (formData) => {
	// let formData = JSON.stringify({
	// 	areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
	// })
	// return commonPost('/api/homeCommunity/findHomeCommunityTotalCapacitySumByLevelIds',formData)
	return commonPost('/api/homeCommunity/findHomeCommunityTotalCapacitySumByLevelIds',formData)
}

// 12、获取多个层级的低碳指标、碳中和指标?
export const findLowCarbonDataByLevelIds = (formData) => {
	return commonPost('/api/homeCommunity/findLowCarbonDataByLevelIds',formData)
}
// 13、获取社区日统计报表
export const dayCapacityAnalyze = (formData) => {
	// let formData = JSON.stringify({
	// 	areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
	// 	date:"2021-07-01" //日期，字符串
	// })
	return commonPost('/api/homeCommunity/dayCapacityAnalyze',formData)
}
// 14、获取今天每个小时的辐照信息
export const findIrradianceInfoByLevelIds = (userId,deviceCategoryId) => {
	return request({
		url: `/api/homeCommunity/findIrradianceInfoByLevelIds`,
		method: 'get'
	})
}
// 15、获取多个层级的每小时用电量的同比值、环比值、峰平比
export const findDayConsumptionQProportionByLevelIds = (areaLevelIds) => {
	let formData = JSON.stringify({
		areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
	})
	return commonPost('/api/homeCommunity/findDayConsumptionQProportionByLevelIds',formData)
}

// 16、获取多个层级的每天用电量的同比值、环比值、峰平比
export const findMonthConsumptionQProportionByLevelIds = (areaLevelIds) => {
	let formData = JSON.stringify({
		areaLevelIds:areaLevelIds, //数组集合形式，传递多个层级ID
	})
	return commonPost('/api/homeCommunity/findMonthConsumptionQProportionByLevelIds',formData)
}
// 17、获取多个层级的每月用电量的同比值、峰平比
export const findYearConsumptionQProportionByLevelIds = (areaLevelIds) => {
	let formData = JSON.stringify({
		areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
	})
	return commonPost('/api/homeCommunity/findYearConsumptionQProportionByLevelIds',formData)
}
// 18、获取天的每个小时层级统计数据、报表数据（SOC）
export const findDayStatisticsDetailsByLevelIdAndDay = (areaLevelId,day) => {
	//层级ID、日期（yyyy-MM-dd）
	return request({
		url: `/api/homeCommunity/findDayStatisticsDetailsByLevelIdAndDay?areaLevelId=${areaLevelId}&day=${day}`,
		// url: `/homeCommunity/findDayStatisticsDetailsByLevelIdAndDay?areaLevelId=${areaLevelId}&day=${day}`,
		method: 'get'
	})
}
// 19、获取月的每天层级统计数据、报表数据（同比、环比、SOC、峰平比）
export const findMonthStatisticsDetailsByLevelIdAndMonth = (areaLevelId,year,month) => {
	//层级ID、年、月
	return request({
		url: `/api/homeCommunity/findMonthStatisticsDetailsByLevelIdAndMonth?areaLevelId=${areaLevelId}&year=${year}&month=${month}`,
		method: 'get'
	})
}

// 20、获取年的每月层级统计数据、报表数据（同比、SOC、峰平比）
export const findYearStatisticsDetailsByLevelIdAndYear = (areaLevelId,year) => {
	//层级ID、年、月
	return request({
		url: `/api/homeCommunity/findYearStatisticsDetailsByLevelIdAndYear?areaLevelId=${areaLevelId}&year=${year}`,
		method: 'get'
	})
}

// 21、获取每个层级的某日的发电、储能、电网、用电的电量
export const findHomeCommunityCapacityByLevelIdsAndDay = (formData) => {
	return commonPost('/api/homeCommunity/findHomeCommunityCapacityByLevelIdsAndDay',formData)
}



// 22、周报表每日统计数据
export const findStatisticsDayByLevelIdsAndDays = (areaLevelIds,date) => {
	let formData = JSON.stringify({
		areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
		date:"2021-07-01" //日期，字符串
	})
	return commonPost('/api/homeCommunity/findStatisticsDayByLevelIdsAndDays',formData)
}

// 23、获取全年最大发电量/最大用电量及日期
export const findMaxQAndDateByLevelIdsAndYear = (areaLevelIds,year) => {
	let formData = JSON.stringify({
		areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
		year:2021 //日期，字符串
	})
	return commonPost('/api/homeCommunity/findMaxQAndDateByLevelIdsAndYear',formData)
}

// 24、获取某个层级某天的类型（发/储/用/网）功率之和
export const findHomeCommunityPowerSumByLevelIdAndDataType = (areaLevelIds,dataType,startDate,endDate) => {
	let formData = JSON.stringify({
		areaLevelId: 504,		//层级ID，整型
		dataType: 1,		//类型，0：发电，1：储能，2：电网，3：用电
		startDate: "2022-02-18",	//开始日期
		endDate: "2022-02-20"	//结束日期
	})
	return commonPost('/api/homeCommunity/findHomeCommunityPowerSumByLevelIdAndDataType',formData)
}

// 25、获取某个层级的光储直柔数据
export const getOpticalStorageEnergyData = (areaLevelId) => {
	//层级ID
	return request({
		url: `/api/homeCommunity/getOpticalStorageEnergyData?areaLevelId=${areaLevelId}`,
		method: 'get'
	})
}

// 26、根据选择区域获取该区域下设备信息的接口
export const findDeviceInfoByAreaLevelIdByHiems = (areaLevelId) => {
	//层级ID
	return request({
		url: `/api/homeCommunity/findDeviceInfoByAreaLevelId?areaLevelId=${areaLevelId}`,
		method: 'get'
	})
}

// 27、根据设备Id获取功率曲线
export const findPowerByDeviceIdAndDate = (deviceId,StartDate,endDate) => {
	return request({
		url: `/api/homeCommunity/findPowerByDeviceIdAndDate?deviceId=${deviceId}&StartDate=${StartDate}&endDate=${endDate}`,
		method: 'get'
	})
}


// 28、获取某个层级某天的人均用电
export const findPersonConsumptionByDay = (day) => {
	// 请求参数：String  day (yyyy-MM-dd)
	return request({
		url: `/api/homeCommunity/findPersonConsumptionByDay?day=${day}`,
		method: 'get'
	})
}

// 29、获取某个层级某天的单位面积用电
export const findUnitAreaConsumptionByDay = (day) => {
	// 请求参数：String  day (yyyy-MM-dd)
	return request({
		url: `/api/homeCommunity/findUnitAreaConsumptionByDay?day=${day}`,
		method: 'get'
	})
}

// 30、获取某个层级某月的人均用电
export const findPersonConsumptionByMonth = (month) => {
	// 请求参数：String  month (yyyy-MM)
	return request({
		url: `/api/homeCommunity/findPersonConsumptionByMonth?month=${month}`,
		method: 'get'
	})
}

// 31、获取某个层级某月的单位面积用电
export const findUnitAreaConsumptionByMonth = (month) => {
	// 请求参数：String  month (yyyy-MM)
	return request({
		url: `/api/homeCommunity/findUnitAreaConsumptionByMonth?month=${month}`,
		method: 'get'
	})
}

// 32、获取某个层级某年的人均用电
export const findPersonConsumptionByYear = (year) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/homeCommunity/findPersonConsumptionByYear?year=${year}`,
		method: 'get'
	})
}

// 33、获取某个层级某年的单位面积用电
export const findUnitAreaConsumptionByYear = (year) => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/homeCommunity/findUnitAreaConsumptionByYear?year=${year}`,
		method: 'get'
	})
}

// 34、获取各层级
export const getCenterList = () => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/homeCommunity/getCenterList?role=60068a98fa3cf1513b206a74`,
		method: 'get'
	})
}

// 35、获取气象信息
export const findWeatherMonitoringByFrameDatetimeBetween = () => {
	// 请求参数：String  year(yyyy)
	return request({
		url: `/api/homeCommunity/findWeatherMonitoringByFrameDatetimeBetween`,
		method: 'get'
	})
}

// 36、获取某层级某日的分类用电
export const findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay = (formData) => {
	return commonPost('/api/homeCommunity/findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay',formData)
}



// import request from '@/utils/request'
// import {
// 	dateStandardFormat,
// 	dateFormatTime
// } from "@/utils/date-format"
// import {
// 	methods
// } from '../uni_modules/uview-ui/libs/mixin/mixin'

// // 通用post接口
// export const commonPost =(baseUrl,formData) =>{
// 	return request({
// 		url: baseUrl,
// 		method: 'POST',
// 		data: {data:formData},
// 		header: {
// 			'content-type': 'application/json;'
// 		}
// 	})
// }



// // 1.获取多个层级的发电、储能、电网、用电的实时功率
// export const findHomeCommunityPowerSumByLevelIds = (formData) => {
// 	// let formData = JSON.stringify({
// 	// 	areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
// 	// 	startDate:"2021-03-24 15:40:00", //开始日期，字符串
// 	// 	endDate:"2021-03-24 18:55:00" //结束日期，字符串
// 	// })
// 	return commonPost('/appletAPI/homeCommunity/findHomeCommunityPowerSumByLevelIds',formData)
// }



// // 1.获取多个层级的发电、储能、电网、用电的实时功率
// export const findCleanElectricityType = (formData) => {
// 	// let formData = JSON.stringify({
// 	// 	areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
// 	// 	startDate:"2021-03-24 15:40:00", //开始日期，字符串
// 	// 	endDate:"2021-03-24 18:55:00" //结束日期，字符串
// 	// })
// 	return commonPost('/appletAPI/homeCommunity/findCleanElectricityType',formData)
// }






// // 2、获取多个层级的某日的发电、储能、电网、用电的电量总和
// export const findHomeCommunityCapacitySumByLevelIds = (formData) => {
// 	// let formData = JSON.stringify({
// 	// 	areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
// 	// 	date:"2021-03-24", //开始日期，字符串

// 	// })
// 	return commonPost('/appletAPI/homeCommunity/findHomeCommunityCapacitySumByLevelIds',formData)
// 	// return commonPost('/api/homeCommunity/findHomeCommunityCapacitySumByLevelIds',formData)
// }

// // 3、获取多个层级的总的发电、储能、电网、用电的电量总和
// export const findHomeCommunityTotalCapacitySumByLevelIds = (formData) => {
// 	// let formData = JSON.stringify({
// 	// 	areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
// 	// })
// 	// return commonPost('/api/homeCommunity/findHomeCommunityTotalCapacitySumByLevelIds',formData)
// 	return commonPost('/appletAPI/homeCommunity/findHomeCommunityTotalCapacitySumByLevelIds',formData)
// }

// // 4、获取多个层级的低碳指标、碳中和指标?
// export const findLowCarbonDataByLevelIds = (formData) => {
// 	return commonPost('/appletAPI/homeCommunity/findLowCarbonDataByLevelIds',formData)
// }

// // 5、获取今天每个小时的辐照信息
// export const findIrradianceInfoByLevelIds = (userId,deviceCategoryId) => {
// 	return request({
// 		url: `/appletAPI/homeCommunity/findIrradianceInfoByLevelIds`,
// 		method: 'get'
// 	})
// }
// // 6、获取多个层级的每小时用电量的同比值、环比值、峰平比
// export const findDayConsumptionQProportionByLevelIds = (areaLevelIds) => {
// 	let formData = JSON.stringify({
// 		areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
// 	})
// 	return commonPost('/appletAPI/homeCommunity/findDayConsumptionQProportionByLevelIds',formData)
// }

// // 7、获取多个层级的每天用电量的同比值、环比值、峰平比
// export const findMonthConsumptionQProportionByLevelIds = (areaLevelIds) => {
// 	let formData = JSON.stringify({
// 		areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
// 	})
// 	return commonPost('/appletAPI/homeCommunity/findMonthConsumptionQProportionByLevelIds',formData)
// }
// // 8、获取多个层级的每月用电量的同比值、峰平比
// export const findYearConsumptionQProportionByLevelIds = (areaLevelIds) => {
// 	let formData = JSON.stringify({
// 		areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
// 	})
// 	return commonPost('/appletAPI/homeCommunity/findYearConsumptionQProportionByLevelIds',formData)
// }
// // 9、获取天的每个小时层级统计数据、报表数据（SOC）
// export const findDayStatisticsDetailsByLevelIdAndDay = (areaLevelId,day) => {
// 	//层级ID、日期（yyyy-MM-dd）
// 	return request({
// 		url: `/appletAPI/homeCommunity/findDayStatisticsDetailsByLevelIdAndDay?areaLevelId=${areaLevelId}&day=${day}`,
// 		// url: `/appletAPI/homeCommunity/findDayStatisticsDetailsByLevelIdAndDay?areaLevelId=${areaLevelId}&day=${day}`,
// 		method: 'get'
// 	})
// }
// // 10、获取月的每天层级统计数据、报表数据（同比、环比、SOC、峰平比）
// export const findMonthStatisticsDetailsByLevelIdAndMonth = (areaLevelId,year,month) => {
// 	//层级ID、年、月
// 	return request({
// 		url: `/appletAPI/homeCommunity/findMonthStatisticsDetailsByLevelIdAndMonth?areaLevelId=${areaLevelId}&year=${year}&month=${month}`,
// 		method: 'get'
// 	})
// }

// // 11、获取年的每月层级统计数据、报表数据（同比、SOC、峰平比）
// export const findYearStatisticsDetailsByLevelIdAndYear = (areaLevelId,year) => {
// 	//层级ID、年、月
// 	return request({
// 		url: `/appletAPI/homeCommunity/findYearStatisticsDetailsByLevelIdAndYear?areaLevelId=${areaLevelId}&year=${year}`,
// 		method: 'get'
// 	})
// }

// // 12、获取每个层级的某日的发电、储能、电网、用电的电量
// export const findHomeCommunityCapacityByLevelIdsAndDay = (formData) => {
// 	return commonPost('/appletAPI/homeCommunity/findHomeCommunityCapacityByLevelIdsAndDay',formData)
// }

// // 13、获取社区日统计报表
// export const dayCapacityAnalyze = (areaLevelIds,date) => {
// 	let formData = JSON.stringify({
// 		areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
// 		date:"2021-07-01" //日期，字符串
// 	})
// 	return commonPost('/appletAPI/homeCommunity/dayCapacityAnalyze',formData)
// }

// // 14、周报表每日统计数据
// export const findStatisticsDayByLevelIdsAndDays = (areaLevelIds,date) => {
// 	let formData = JSON.stringify({
// 		areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
// 		date:"2021-07-01" //日期，字符串
// 	})
// 	return commonPost('/appletAPI/homeCommunity/findStatisticsDayByLevelIdsAndDays',formData)
// }

// // 15、获取全年最大发电量/最大用电量及日期
// export const findMaxQAndDateByLevelIdsAndYear = (areaLevelIds,year) => {
// 	let formData = JSON.stringify({
// 		areaLevelIds:[383,385], //数组集合形式，传递多个层级ID
// 		year:2021 //日期，字符串
// 	})
// 	return commonPost('/appletAPI/homeCommunity/findMaxQAndDateByLevelIdsAndYear',formData)
// }

// // 16、获取某个层级某天的类型（发/储/用/网）功率之和
// export const findHomeCommunityPowerSumByLevelIdAndDataType = (areaLevelIds,dataType,startDate,endDate) => {
// 	let formData = JSON.stringify({
// 		areaLevelId: 504,		//层级ID，整型
// 		dataType: 1,		//类型，0：发电，1：储能，2：电网，3：用电
// 		startDate: "2022-02-18",	//开始日期
// 		endDate: "2022-02-20"	//结束日期
// 	})
// 	return commonPost('/appletAPI/homeCommunity/findHomeCommunityPowerSumByLevelIdAndDataType',formData)
// }

// // 17、获取多个层级天的每小时层级统计数据
// export const findDayStatisticsDetailsByLevelIdsAndDay = (areaLevelIds,date) => {
// 	let formData = JSON.stringify({
// 		areaLevelId: 504,		//层级ID，整型
// 		date : "2022-02-21"	//日期
// 	})
// 	return commonPost('/appletAPI/homeCommunity/findDayStatisticsDetailsByLevelIdsAndDay',formData)
// }

// // 18、获取多个层级月的每天层级统计数据
// export const findMonthStatisticsDetailsByLevelIdsAndMonth = (areaLevelIds,year,month) => {
// 	let formData = JSON.stringify({
// 		areaLevelIds: [381,382,383,384,385,386],	//数组集合形式，传递多个层级ID
// 		year: 2022,	//年份
// 		month: 2	//月份
// 	})
// 	return commonPost('/appletAPI/homeCommunity/findMonthStatisticsDetailsByLevelIdsAndMonth',formData)
// }

// // 19、获取多个层级年的每月层级统计数据
// export const findYearStatisticsDetailsByLevelIdsAndYear = (areaLevelIds,year) => {
// 	let formData = JSON.stringify({
// 		areaLevelIds: [381,382,383,384,385,386],	//数组集合形式，传递多个层级ID
// 		year: 2022	//年份
// 	})
// 	return commonPost('/appletAPI/homeCommunity/findYearStatisticsDetailsByLevelIdsAndYear',formData)
// }

// // 20、获取某个层级的光储直柔数据
// export const getOpticalStorageEnergyData = (areaLevelId) => {
// 	//层级ID
// 	return request({
// 		url: `/appletAPI/homeCommunity/getOpticalStorageEnergyData?areaLevelId=${areaLevelId}`,
// 		method: 'get'
// 	})
// }

// // 21、根据选择区域获取该区域下设备信息的接口
// export const findDeviceInfoByAreaLevelId = (areaLevelId) => {
// 	//层级ID
// 	return request({
// 		url: `/appletAPI/homeCommunity/findDeviceInfoByAreaLevelId?areaLevelId=${areaLevelId}`,
// 		method: 'get'
// 	})
// }

// // 22、根据设备Id获取功率曲线
// export const findPowerByDeviceIdAndDate = (deviceId,StartDate,endDate) => {
// 	return request({
// 		url: `/appletAPI/homeCommunity/findPowerByDeviceIdAndDate?deviceId=${deviceId}&StartDate=${StartDate}&endDate=${endDate}`,
// 		method: 'get'
// 	})
// }


// // 24、获取某个层级某天的人均用电
// export const findPersonConsumptionByDay = (day) => {
// 	// 请求参数：String  day (yyyy-MM-dd)
// 	return request({
// 		url: `/appletAPI/homeCommunity/findPersonConsumptionByDay?day=${day}`,
// 		method: 'get'
// 	})
// }

// // 25、获取某个层级某天的单位面积用电
// export const findUnitAreaConsumptionByDay = (day) => {
// 	// 请求参数：String  day (yyyy-MM-dd)
// 	return request({
// 		url: `/appletAPI/homeCommunity/findUnitAreaConsumptionByDay?day=${day}`,
// 		method: 'get'
// 	})
// }

// // 26、获取某个层级某月的人均用电
// export const findPersonConsumptionByMonth = (month) => {
// 	// 请求参数：String  month (yyyy-MM)
// 	return request({
// 		url: `/appletAPI/homeCommunity/findPersonConsumptionByMonth?month=${month}`,
// 		method: 'get'
// 	})
// }

// // 27、获取某个层级某月的单位面积用电
// export const findUnitAreaConsumptionByMonth = (month) => {
// 	// 请求参数：String  month (yyyy-MM)
// 	return request({
// 		url: `/appletAPI/homeCommunity/findUnitAreaConsumptionByMonth?month=${month}`,
// 		method: 'get'
// 	})
// }

// // 28、获取某个层级某年的人均用电
// export const findPersonConsumptionByYear = (year) => {
// 	// 请求参数：String  year(yyyy)
// 	return request({
// 		url: `/appletAPI/homeCommunity/findPersonConsumptionByYear?year=${year}`,
// 		method: 'get'
// 	})
// }

// // 29、获取某个层级某年的单位面积用电
// export const findUnitAreaConsumptionByYear = (year) => {
// 	// 请求参数：String  year(yyyy)
// 	return request({
// 		url: `/appletAPI/homeCommunity/findUnitAreaConsumptionByYear?year=${year}`,
// 		method: 'get'
// 	})
// }

// // 29、获取各层级
// export const getCenterList = () => {
// 	// 请求参数：String  year(yyyy)
// 	return request({
// 		url: `/appletAPI/homeCommunity/center/getCenterList?role=61a6cb3d6197a337f0cc17b9`,
// 		method: 'get'
// 	})
// }

// // 30、获取气象信息
// export const findWeatherMonitoringByFrameDatetimeBetween = () => {
// 	// 请求参数：String  year(yyyy)
// 	return request({
// 		url: `/appletAPI/homeCommunity/findWeatherMonitoringByFrameDatetimeBetween`,
// 		method: 'get'
// 	})
// }

// // 31、获取某层级某日的分类用电
// export const findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay = (formData) => {
// 	return commonPost('/appletAPI/homeCommunity/findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay',formData)
// }