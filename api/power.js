/**
 * 电力相关api
 */
import request from '../utils/request'
import { URL } from '../utils/forSpringBoot'

// 获取设备功率统计
export const getDevicePowerStatistics = (params) => {
	return request({
		url: '/api/energyStation/getDevicePowerStatistics',
		method: 'GET',
		params
	})
}

// 获取电力数据
export const getPowerData = (params) => {
	return request({
		// url: '/api/energyStation/v2/queryDayGeneratedPower',
		// url: '/api/energyStation/v1/queryComprehensivePowerByMinute',
		// url: '/api/energyStation/v1/queryComprehensivePowerBy10Minute',

		url: '/api/energyStation/getPowerStatistics',

		method: 'GET',
		params: {
			interval: 10,
			...params
		}
	})
}

// 查询日发电功率数据
export const queryDayGeneratedPower = (params) => {
	return request({
		// url: '/api/energyStation/v2/queryDayGeneratedPower',
		url: '/api/energyStation/v1/queryComprehensivePowerByMinute',
		method: 'GET',
		params
	})
}

// energyStation/v1/queryComprehensivePowerByMinute

// 查询日电量统计数据
export const queryDayElectricityStatistic = (params) => {
	return request({
		url: '/api/energyStation/queryDayElectricityStatistic',
		method: 'GET',
		params
	})
}

// 查询月度电量统计数据
export const queryMonthElectricityStatistic = (params) => {
	return request({
		url: '/api/energyStation/queryMonthElectricityStatistic',
		method: 'GET',
		params
	})
}

// 查询年度电量统计数据
export const queryYearElectricityStatistic = (params) => {
	return request({
		url: '/api/energyStation/queryYearElectricityStatistic',
		method: 'GET',
		params
	})
}

// 查询光伏能源信息
export const findPhotovoltaicEnergyInfo = (params) => {
	return request({
		url: URL("/homeCommunity/findPhotovoltaicEnergyInfo"),
		method: 'GET',
		params
	})
}

// 查询分时电价（按区域）
export const getPriceByAreaId = (areaId, startDate) => {
	const params = { areaId }
	if (startDate) params.startDate = startDate
	return request({
		url: '/chargePile/GetPrice',
		method: 'GET',
		params
	})
}

// 母线电压历史统计：日
export const getPerHourBusVolte = (areaLevelIds, date) => {
	return request({
		url: '/api/energyStation/getPerHourBusVolte',
		method: 'GET',
		params: { areaLevelIds, date }
	})
}

// 母线电压历史统计：月
export const getPerDayBusVolte = (areaLevelIds, startDate, endDate) => {
	return request({
		url: '/api/energyStation/getPerDayBusVolte',
		method: 'GET',
		params: { areaLevelIds, startDate, endDate }
	})
}

// 母线电压历史统计：年
export const getPerMonthBusVolte = (areaLevelIds, year) => {
	return request({
		url: '/api/energyStation/getPerMonthBusVolte',
		method: 'GET',
		params: { areaLevelIds, year }
	})
}

// 理论负荷用电费 / 综合节省电费：日
export const queryPerHourFee = (areaLevelId, date) => {
	return request({
		url: '/api/energyStation/queryPerHourFee',
		method: 'GET',
		params: { areaLevelId, date }
	})
}

// 理论负荷用电费 / 综合节省电费：月
export const queryPerDayFee = (areaLevelId, startDate, endDate) => {
	return request({
		url: '/api/energyStation/queryPerDayFee',
		method: 'GET',
		params: { areaLevelId, startDate, endDate }
	})
}

// 理论负荷用电费 / 综合节省电费：年
export const queryPerMonthFee = (areaLevelId, year) => {
	return request({
		url: '/api/energyStation/queryPerMonthFee',
		method: 'GET',
		params: { areaLevelId, year }
	})
}