import request from '@/utils/request'
import {
	dateStandardFormat,
	dateFormatTime
} from "@/utils/date-format"
// import { async } from 'rxjs'

export const queryDeviceInfoByLevelIdAndSub = async (areaLevelId) => {
	// let deviceId = 0
	// let type = 0
	return await request({
		url: `/appletAPI/queryDeviceInfoByLevelIdAndSub?areaLevelId=${areaLevelId}`,
		method: 'get'
	})
}

export const queryStatisticsDayByDeviceIdAndDays =async (deviceId,startDay,endDay) => {
	// let deviceId = 0
	// let type = 0
	return await request({
		url: `/api/queryStatisticsDayByDeviceIdAndDays?deviceId=${deviceId}&startDay=${dateStandardFormat(startDay)}&endDay=${dateStandardFormat(endDay)}`,
		method: 'get'
	})
}

export const findStatisticsMonthByDeviceIdAndYear = async (deviceId,year) => {
	// let deviceId = 0
	// let type = 0
	return await request({
		url: `/api/findStatisticsMonthByDeviceIdAndYear?deviceId=${deviceId}&year=${year}`,
		method: 'get'
	})
}

export const findStatisticsYearByDeviceIdAndYear = async (deviceId,startYear,endYear) => {
	// let deviceId = 0
	// let type = 0
	return await request({
		url: `/api/findStatisticsYearByDeviceIdAndYear?deviceId=${deviceId}&startYear=${startYear}&endYear=${endYear}`,
		method: 'get'
	})
}

