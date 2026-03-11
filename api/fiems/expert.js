import request from '@/utils/request'
import {
	dateStandardFormat,
	dateFormatTime
} from "@/utils/date-format"
import store from '@/store'

export const queryTimeSharingEnergyConsumption = (areaLevelId, startDate, endDate) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/queryTimeSharingEnergyConsumption?areaLevelId=${areaLevelId}&startDate=${dateStandardFormat(startDate)}&endDate=${dateStandardFormat(endDate)}`,
		method: 'get'
	})
}


export const queryDailyPeakValleyPower = (level_id, startDate, endDate, areaInfoId) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/queryDailyPeakValleyPower?level_id=${level_id}&startDate=${dateStandardFormat(startDate)}&endDate=${dateStandardFormat(endDate)}&valueType=3&areaInfoId=${areaInfoId}`,
		method: 'get'
	})
}

export const queryEnergyConsumptonByDay = (areaLevelId, areaInfoId, level, date) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/queryEnergyConsumptonByDay?areaLevelId=${areaLevelId}&areaInfoId=${areaInfoId}&level=${level}&date=${dateStandardFormat(date)}`,
		method: 'get'
	})
}

export const queryTotalConsumeQ = (areaInfoId, deviceCategory, date, areaLevelId) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/queryTotalConsumeQ?areaInfoId=${areaInfoId}&deviceCategory=${deviceCategory}&date=${dateStandardFormat(date)}&areaLevelId=${areaLevelId}`,
		method: 'get'
	})
}


// export const queryEnergyConsumptonByDay= (areaInfoId,level,date) => {
// 	return request({
// 		url: `${store.state.urlPrefix}/api/queryEnergyConsumptonByDay?areaInfoId=${areaInfoId}&level=2&date=${dateStandardFormat(date)}`,
// 		method: 'get'
// 	})
// }

export const queryEnergyConsumptonByMonth = (areaLevelId, areaInfoId, level, date) => {

	let year = date.getFullYear();
	let month = date.getMonth() + 1
	return request({
		url: `${store.state.urlPrefix}/api/queryEnergyConsumptonByMonth?areaLevelId=${areaLevelId}&areaInfoId=${areaInfoId}&level=${level}&year=${year}&month=${month}`,
		method: 'get'
	})
}


export const queryEnergyConsumptonByYear = (areaLevelId, areaInfoId, level, date) => {
	let year = date.getFullYear();
	return request({
		url: `${store.state.urlPrefix}/api/queryEnergyConsumptonByYear?areaLevelId=${areaLevelId}&areaInfoId=${areaInfoId}&level=${level}&year=${year}`,
		method: 'get'
	})
}

/**
 * 返回电价、峰平谷时间段、以及峰平谷总用电量
 * @param startDate 
 * @param endDate 
 * @param areaLevelId 
 */
export const getUrlByDay = (startDate, endDate, areaLevelId, areaInfoId) => {
	let queryUrl = `${store.state.urlPrefix}/api/queryDailyPeakValleyPower?level_id=` + areaLevelId +
		"&&startDate=" + dateStandardFormat(startDate) +
		"&&endDate=" + dateStandardFormat(endDate) +
		"&&valueType=3" + '&&areaInfoId=' + areaInfoId;
	return request({
		url: queryUrl,
		method: 'get'
	})
}


/**
 * 返回各区域timeType=1和timeType=2的用电量
 * @param startDate 
 * @param endDate 
 * @param areaLevelId 
 */
export const getPeakValleyPowerByAreaId = (startDate, endDate, areaLevelId) => {
	let queryUrl = `${store.state.urlPrefix}/api/queryPeakValleyPowerByAreaId?areaId=` + areaLevelId +
		"&&startDate=" + dateStandardFormat(startDate) +
		"&&endDate=" + dateStandardFormat(endDate);
	return request({
		url: queryUrl,
		method: 'get'
	})
}