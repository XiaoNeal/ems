/**
 * 电力相关api
 */
import request from '@/utils/request'
import { URL } from '@/utils/forSpringBoot'

// 获取电力数据
export const getPowerData = (params) => {
	return request({
		url: '/api/energyStation/v3/queryDayGeneratedPower',
		method: 'GET',
		data: params
	})
}

// 查询充放电最大最小功率
export const queryHighestChargeAndPower = (data) => {
	return request({
		url: URL("/homeCommunity/queryHighestChargeAndPower"),
		method: 'post',
		data
	})
}

// 查询日发电功率数据
export const queryDayGeneratedPower = (params) => {
	return request({
		url: '/api/energyStation/v3/queryDayGeneratedPower',
		method: 'GET',
		params
	})
}

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