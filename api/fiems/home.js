import request from '@/utils/request'
import store from '@/store'
import {
	dateStandardFormat,
	dateFormatTime
} from "@/utils/date-format"
// const store.state.token||uni.getStorageSync('token') = store.state.token||uni.getStorageSync('token');
export const getStorageData = (areaInfoId) => {
	// let deviceId = 0
	// let type = 0
	// return request({
	// 	url: `${store.state.urlPrefix}/api/T1706Energy/findRecentByAreaInfoId?areaInfoId=${areaInfoId}`,
	// 	method: 'get'
	// })

	return new Promise((resolve, reject) => {

		request({
			url: `/api/T1706Energy/findRecentByAreaInfoId?areaInfoId=${areaInfoId}`,
			method: 'GET',
			header: {
				'content-type': 'application/json;charset:utf-8',
				'token': store.state.token || uni.getStorageSync('token')
			},

			success: res => {
				resolve(res.data);
			},
			fail: res => {
				reject(res);
			}
		});
	});
}

export const energyDataBetweenMonth = (areaLevelId, startYear, startMonth, endYear, endMonth) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/energyDataBetweenMonth?areaLevelId=${areaLevelId}&startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}`,
		method: 'get'
	})
}


export const energyDataBetweenYear = (areaLevelId, startYear, endYear) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/energyDataBetweenYear?areaLevelId=${areaLevelId}&startYear=${startYear}&endYear=${endYear}`,
		method: 'get'
	})
}

export const energyDataBetweenDay = (areaLevelId, startDay, endDay) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/energyDataBetweenDay?areaLevelId=${areaLevelId}&startDay=${dateStandardFormat(startDay)}&endDay=${dateStandardFormat(endDay)}`,
		method: 'get'
	})
}

// export const queryStorageIncome = (areaId) => {
// 	// let deviceId = 0
// 	// let type = 0
// 	return request({
// 		url: `${store.state.urlPrefix}/api/T1706State/queryAllDeviceIncomeByAreaIdAndTypeCode?typeCode=1706&areaId=${areaId}`,
// 		method: 'get'
// 	})
// }
export const queryStorageIncome = (areaId) => {
	return new Promise((resolve, reject) => {
		request({
			url: `/api/T1706State/queryAllDeviceIncomeByAreaIdAndTypeCode?typeCode=1706&areaId=${areaId}`,
			method: 'GET',
			header: {
				'content-type': 'application/json;charset:utf-8',
				'token': store.state.token || uni.getStorageSync('token')
			},
			success: res => {
				resolve(res.data);
			},
			fail: res => {
				reject(res);
			}
		});
	});
};


export const queryDeviceMonitorRecordByStatus = (areaInfoId, status, num, startTime, endTime) => {
	return request({
		url: `${store.state.urlPrefix}/api/queryDeviceMonitorRecordByStatus?areaInfoId=${areaInfoId}&status=${status}&num=${num}&startTime=${dateFormatTime(startTime)}&endTime=${dateFormatTime(endTime)}`,
		method: 'get'
	})
}