import request from '@/utils/request'
// import dateFormatTime from '@/utils/date-format'

	import {
		dateFormatTime
	} from '@/utils/date-format'
export const getAllInfoFromDeviceBaseInfo = () => {
	// if (!areaId) 
	let areaId = 149
	return request({
		url: `/api/getAllInfoFromDeviceBaseInfo?areaInfoId=${areaId}`,
		method: 'get'
	})
}

export const getSingleBatteryState = (deviceId1706, deviceId1708) => {
	return request({
		url: '/api/T1706State/findStateByDeviceIds?deviceId1=' + deviceId1706 + '&deviceId2=' +
			deviceId1708,
		method: 'get'
	})
	// return this.http.Get('T1706State/findStateByDeviceIds?deviceId1=' + deviceId1706 + '&deviceId2=' + deviceId1708)
}

export const get1706energyByDays = (deviceId, startDatetime, endDatetime) => {
	return request({
		url: '/api/T1706Energy/findRecentByDeviceIdAndDays?deviceId=' + deviceId + '&startDatetime=' +
		dateFormatTime(startDatetime) + '&endDatetime=' + dateFormatTime(
			endDatetime),
		method: 'get'
	})
}

export const get1706StateIncomeByDate=(deviceId, startDatetime, endDatetime)=> {
	return request({
		url: '/api/T1706State/findRecentByDeviceIdAndDays?deviceId=' + deviceId + '&startDatetime=' +
		dateFormatTime(startDatetime) + '&endDatetime=' + dateFormatTime(
			endDatetime),
		method: 'get'
	})
  }