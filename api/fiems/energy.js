import request from '@/utils/request'
import {
	dateStandardFormat,
	dateFormatTime,
	dateMonthFormat
} from "@/utils/date-format"
import store from '@/store'

export const findEnergyStorageDevices = (areaInfoId) => {
	// let deviceId = 0
	// let type = 0
	// return request({
	// 	url: `${store.state.urlPrefix}/api/T1706Energy/findEnergyStorageDevices?areaInfoId=${areaInfoId}`,
	// 	method: 'get'
	// })

	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://serviceiems.gree.com/api/T1706Energy/findEnergyStorageDevices?areaInfoId=${areaInfoId}`,
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

export const findDayWaterConsumption = (areaInfoId, oneDay, areaLevelId) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/T2502Energy/findDayWaterConsumption?areaInfoId=${areaInfoId}&oneDay=${dateStandardFormat(oneDay)}&areaLevelId=${areaLevelId}&pipeDiameterName=&tableName=`,
		method: 'get'
	})

}

export const queryTotalConsumeQ = (areaInfoId, date, areaLevelId) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/queryTotalConsumeQ?areaInfoId=${areaInfoId}&deviceCategory=3&date=${dateStandardFormat(date)}&areaLevelId=${areaLevelId}`,
		method: 'get'
	})
}



export const findMaxPowerByAreaInfoIdAndCategory = (areaInfoId) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/findMaxPowerByAreaInfoIdAndCategory?areaInfoId=${areaInfoId}&&category=1`,
		method: 'get'
	})

}

export const getDeviceLevelByAreaInfoIdAndCategroy = (areaInfoId, categroy, levelId) => {

	return request({
		url: `${store.state.urlPrefix}/api/getDeviceLevelByAreaInfoIdAndCategroyV2?areaInfoId=${areaInfoId}&categroy=${categroy}&levelId=${levelId}`,
		method: 'get'
	})

}

export const getDeviceLevelByAreaInfoIdAndCategroyV2 = (areaInfoId, categroy, levelId, deviceType) => {
	return request({
		url: `${store.state.urlPrefix}/api/getDeviceLevelByAreaInfoIdAndCategroyV2?areaInfoId=${areaInfoId}&categroy=${categroy}&levelId=${levelId}&deviceType=${deviceType}`,
		method: 'get'
	})

}

// export const queryByAreaInfoAndLevelId = (areaInfoId) => {
// 	// let deviceId = 0
// 	// let type = 0
// 	return request({
// 		url: `${store.state.urlPrefix}/api/queryByAreaInfoAndLevelId?areaInfoId=${areaInfoId}&deviceCategory=1&levelId=4`,
// 		method: 'get'
// 	})
// }
export const queryByAreaInfoAndLevelId = (areaInfoId) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/queryByAreaInfoAndLevelId?areaInfoId=${areaInfoId}&deviceCategory=1&levelId=4`,
		method: 'get'
	})

}

// export const  queryDevicesByParentId = (parentId) => {
// 	// let deviceId = 0
// 	// let type = 0
// 	return request({
// 		url: `${store.state.urlPrefix}/api/queryDevicesByParentId?parentId=${parentId}`,
// 		method: 'get'
// 	})

// }

export const queryDevicesByParentId = (parentId) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/queryDevicesByParentId?parentId=${parentId}`,
		method: 'get'
	})

}

export const queryDevicesAndLevelsByParentId = (parentId) => {
	// let deviceId = 0
	// let type = 0
	return request({
		url: `${store.state.urlPrefix}/api/queryDevicesAndLevelsByParentId?parentId=${parentId}`,
		method: 'get'
	})

}



export const queryDeviceInfoByLevelIdAndSub = (areaLevelId) => {
	return request({
		url: `${store.state.urlPrefix}/api/queryDeviceInfoByLevelIdAndSub?areaLevelId=${areaLevelId}`,
		method: 'get'
	})
}

export const findDischargeCapacityAndIncome = (year, month) => {
	// return request({
	// 	url: `${store.state.urlPrefix}/api/T1706Energy/findDischargeCapacityAndIncomeByYearAndMonth?year=${year}&month=${month}`,
	// 	method: 'get'
	// })

	// export const queryStorageIncome = (areaId) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://serviceiems.gree.com/api/T1706Energy/findDischargeCapacityAndIncomeByYearAndMonth?year=${year}&month=${month}`,
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
	// };
}

export const findEveryBaseIncomeByDate = (date) => {
	// return request({
	// 	url: `${store.state.urlPrefix}/api/T1706Energy/findEveryBaseIncomeByDate?date=${dateStandardFormat(date)}`,
	// 	method: 'get'
	// })
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://serviceiems.gree.com/api/T1706Energy/findEveryBaseIncomeByDate?date=${dateStandardFormat(date)}`,
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

export const findHighEnergyDeviceStatisticsDataTotal = (areaLevelId) => {
	return request({
		url: `${store.state.urlPrefix}/api/findHighEnergyDeviceStatisticsDataTotal?areaLevelId=${areaLevelId}`,
		method: 'get'
	})
}

export const getAllInfoFromDeviceBaseInfo = (areaInfoId) => {
	// return request({
	// 	url: `${store.state.urlPrefix}/api/getAllInfoFromDeviceBaseInfo?areaInfoId=${areaInfoId}`,
	// 	method: 'get'
	// })

	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://serviceiems.gree.com/api/getAllInfoFromDeviceBaseInfo?areaInfoId=${areaInfoId}`,
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

export const findStateByDeviceIds = (deviceId1, deviceId2) => {
	// return request({
	// 	url: `${store.state.urlPrefix}/api/T1706State/findStateByDeviceIds?deviceId1=${deviceId1}&deviceId2=${deviceId2}`,
	// 	method: 'get'
	// })

	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://serviceiems.gree.com/api/T1706State/findStateByDeviceIds?deviceId1=${deviceId1}&deviceId2=${deviceId2}`,
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

export const get1706energyByDays = (deviceId, startDatetime, endDatetime) => {
	// return request({
	// 	url: `${store.state.urlPrefix}/api/T1706Energy/findRecentByDeviceIdAndDays?deviceId=${deviceId}&startDatetime=${dateFormatTime(startDatetime) }&endDatetime=${dateFormatTime(endDatetime)}`,
	// 	method: 'get'
	// })
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://serviceiems.gree.com/api/T1706Energy/findRecentByDeviceIdAndDays?deviceId=${deviceId}&startDatetime=${dateFormatTime(startDatetime)}&endDatetime=${dateFormatTime(endDatetime)}`,
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

export const get1706stateByDays = (deviceId, startDatetime, endDatetime) => {
	// return request({
	// 	url: `${store.state.urlPrefix}/api/T1706State/findRecentByDeviceIdAndDays?deviceId=${deviceId}&startDatetime=${dateFormatTime(startDatetime) }&endDatetime=${dateFormatTime(endDatetime)}`,
	// 	method: 'get'
	// })
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://serviceiems.gree.com/api/T1706State/findRecentByDeviceIdAndDays?deviceId=${deviceId}&startDatetime=${dateFormatTime(startDatetime) }&endDatetime=${dateFormatTime(endDatetime)}	`,
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

export const queryHighEnergyDevice = (areaLevelId, type, category) => {
	return request({
		url: `${store.state.urlPrefix}/api/queryHighEnergyConsumptionStatisticsDataByAreaId?areaLevelId=${areaLevelId}&type=${type}&category=${category}`,
		method: 'get'
	})
}


export const queryDeviceLevelMenu = (areaInfoId, category) => {
	return request({
		url: `${store.state.urlPrefix}/api/queryDeviceLevelMenu?areaInfoId=${areaInfoId}&category=${category}`,
		method: 'get'
	})
}

export const getDevicePosotionLevelByAreaInfoIdAndCategroy = (areaInfoId, category) => {
	return request({
		url: `${store.state.urlPrefix}/api/getDevicePosotionLevelByAreaInfoIdAndCategroy?areaInfoId=${areaInfoId}&&categroy=${category}`,
		method: 'get'
	})
}



// export const getDevicePosotionLevelByAreaInfoIdAndCategroy = (areaInfoId,category)=>{
// 	return request({
// 		url:`/factory/getDevicePosotionLevelByAreaInfoIdAndCategroy?areaInfoId=${areaInfoId}&&categroy=${category}`,
// 		method: 'get'
// 	})
// }

export const queryThreePhaseMeterDataByDateNew = (startDate, endDate, deviceId) => {
	return request({
		url: `${store.state.urlPrefix}/api/queryThreePhaseMeterDataByDateNew?startDate=${dateFormatTime(startDate)}&&endDate=${dateFormatTime(endDate)}&&deviceId=${deviceId}`,
		method: 'get'
	})
}

export const getOverallCoverageRate = (option, date) => {
	return request({
		url: `${store.state.urlPrefix}/api/overallCoverageRate/${option}/1053536/${dateStandardFormat(date)}/`,
		method: 'get'
	})
}

export const getProfits = (date, areaInfoId) => {
	return request({
		url: `${store.state.urlPrefix}/api/profits/${dateStandardFormat(date)}/2/1053536/${areaInfoId}/`,
		method: 'get'
	})
	// return this.http.Get('/profits/'+DateFormatUtils.dateStandardFormat(date) +'/2/1053536/'+areaInfoId)
}


export const getPowerData = (typeStr, startDate, endDate) => {
	return request({
		url: `${store.state.urlPrefix}/api/lineChart/power/${typeStr}/1053536/${dateStandardFormat(startDate)}/${dateStandardFormat(endDate)}`,
		method: 'get'
	})
	// return this.http.Get(`/lineChart/power/${typeStr}/1053536/${DateFormatUtils.dateStandardFormat(startDate)}/${DateFormatUtils.dateStandardFormat(endDate)}`)
}

// export const  getOverallCoverageRate = (option,date) =>{
//     return this.http.Get(`/overallCoverageRate/${option}/1053536/${dateStandardFormat(date)}/`)
//   }

export const deltaChartGenerate = (option, dateType, date, date1) => {

	if (dateType == 'DAY') {
		return request({
			url: `${store.state.urlPrefix}/api/deltaChart/${option}/${dateType}/1053536/${dateStandardFormat(date)}/${dateStandardFormat(date1)}`,
			method: 'get'
		})
	} else {
		return request({
			url: `${store.state.urlPrefix}/api/deltaChart/${option}/${dateType}/1053536/${dateMonthFormat(date)}/${dateMonthFormat(date1)}`,
			method: 'get'
		})
	}

}

// 基地充放电次数
export const getAreaIdChargeCount = (date) => {
	// return request({
	// 	url: `${store.state.urlPrefix}/api/T1706Energy/findEveryBaseIncomeByDate?date=${dateStandardFormat(date)}`,
	// 	method: 'get'
	// })
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://serviceiems.gree.com/api/T1312State/getAreaIdChargeCount?dateStr=${dateStandardFormat(date)}`,
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

// 基地充放电次数
export const findAlarmRecordByAreaId = () => {
	// return request({
	// 	url: `${store.state.urlPrefix}/api/T1706Energy/findEveryBaseIncomeByDate?date=${dateStandardFormat(date)}`,
	// 	method: 'get'
	// })
	let day = new Date()
	day.setHours(0,0,0,0)
	let startDate = dateFormatTime(new Date(day))
	let date= dateFormatTime(new Date())
	return new Promise((resolve, reject) => {
		uni.request({
			url: `https://serviceiems.gree.com/api/T1312State/findAlarmRecordByAreaId?areaInfoId=149&status=1&num=0&startTime=${startDate}&endTime=${date}`,
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