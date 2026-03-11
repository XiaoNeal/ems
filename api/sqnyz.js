import request from '@/utils/request.js'
export const findDayStatisticsDetailsByLevelIdsAndDay = (data) => {
    /**
     * {
	"data" : 
		{
			"areaLevelIds" : [381,382,383,384,385,386],	//数组集合形式，传递多个层级ID
			"date" : "2022-02-21"	//日期
		}
}
     */
    return request.post('/api/homeCommunity/findDayStatisticsDetailsByLevelIdsAndDay', {
        data: data
    })
}

// 2.月报表
export const findMonthStatisticsDetailsByLevelIdsAndMonth = (data) => {
    /**
     * {
	"data" : 
		{
			"areaLevelIds" : [381,382,383,384,385,386],	//数组集合形式，传递多个层级ID
			"year" : "2022"	//日期
            "month" : "2"
		}
}
     */
    return request.post('/api/homeCommunity/findMonthStatisticsDetailsByLevelIdsAndMonth', {
        data: data
    })
}

// 3.年报表
export const findYearStatisticsDetailsByLevelIdsAndYear = (data) => {
    /**
     * {
	"data" : 
		{
			"areaLevelIds" : [381,382,383,384,385,386],	//数组集合形式，传递多个层级ID
			"year" : "2022"	//日期
		}
}
     */
    return request.post('/api/homeCommunity/findYearStatisticsDetailsByLevelIdsAndYear', {
        data: data
    })
}

// 4.累计数据


export const findHomeCommunityTotalCapacitySumByLevelIds = (data) => {
    /**
     * {
	"data" : 
		{
			"areaLevelIds" : [381,382,383,384,385,386],	//数组集合形式，传递多个层级ID
			"year" : "2022"	//日期
		}
}
     */
    return request.post('/api/homeCommunity/findHomeCommunityTotalCapacitySumByLevelIds', {
        data: data
    })
}

// 查询0319多联机历史功率
export const findRunningPowerByBarCodeAndAddressAndDay = (params) => {
  return request.get('/api/homeCommunity/findRunningPowerByBarCodeAndAddressAndDay', { params })
}

// 控制0319多联机状态
export const setClusterDeviceContrastControl = (data) => {
  return request.post('/shequKoa/control/setClusterDeviceControl', { data })
}

// 查询1804直流表历史数据
export const quickQueryEsDirect = (address, startTime, endTime) => {
  return request.get(decodeURI(`/api/homeCommunity/v2/quickQuery/esDirect/${address}/${startTime}/${endTime}`))
}
