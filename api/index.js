import request from '@/utils/request.js'

/**
 * 能源站系统 API 模块
 * 提供能源站系统整体的数据查询功能
 */

/**
 * 查询系统整体概况
 * @param {Object} data - 查询参数
 * @returns {Promise} 系统概况数据
 */
export const systemOverview = (data) => {
    return request.get('/api/energyStation/systemOverview', {
        params: data
    })
}

/**
 * 查询能源站日发电功率曲线
 * @param {string} esId - 能源站 ID
 * @param {string} date - 日期
 * @returns {Promise} 日发电功率数据
 */
export const queryDayGeneratedPower = (esId,date) => {
    return request.get(`/api/energyStation/queryDayGeneratedPower?esId=${esId}&date=${date}`)
}

/**
 * 查询能源站月发电功率曲线
 * @param {string} esId - 能源站 ID
 * @param {string} date - 日期
 * @returns {Promise} 月发电功率数据
 */
export const queryMonthGeneratedPower = (esId,date) => {
    return request.get(`/api/energyStation/queryMonthGeneratedPower?esId=${esId}&date=${date}`)
}

/**
 * 查询能源站年发电功率曲线
 * @param {string} esId - 能源站 ID
 * @param {string} date - 日期
 * @returns {Promise} 年发电功率数据
 */
export const queryYearGeneratedPower = (esId,date) => {
    return request.get(`/api/energyStation/queryYearGeneratedPower?esId=${esId}&date=${date}`)
}

/**
 * 查询能源站日电量统计
 * @param {string} esId - 能源站 ID
 * @param {string} date - 日期
 * @returns {Promise} 日电量统计数据
 */
export const queryDayElectricityStatistic = (esId,date) => {
    return request.get(`/api/energyStation/queryDayElectricityStatistic?esId=${esId}&date=${date}`)
}

/**
 * 查询能源站月电量统计
 * @param {string} esId - 能源站 ID
 * @param {string} startDate - 开始日期
 * @param {string} endDate - 结束日期
 * @returns {Promise} 月电量统计数据
 */
export const queryMonthElectricityStatistic = (esId,startDate,endDate) => {
    return request.get(`/api/energyStation/queryMonthElectricityStatistic?esId=${esId}&startDate=${startDate}&endDate=${endDate}`)
}

/**
 * 查询能源站年电量统计
 * @param {string} esId - 能源站 ID
 * @param {string} year - 年份
 * @returns {Promise} 年电量统计数据
 */
export const queryYearElectricityStatistic = (esId,year) => {
    return request.get(`/api/energyStation/queryYearElectricityStatistic?esId=${esId}&year=${year}`)
}

/**
 * 查询光伏发电和电网供电数据
 * @param {Object} params - 查询参数
 * @returns {Promise} 本日和累计节约电量数据
 */
export const queryPhotovoltaicPowerGenerationAndGridPowerSupply = (params) => {
    return request.get(`/api/energyStation/queryPhotovoltaicPowerGenerationAndGridPowerSupply`, { params })
}

/**
 * 查询当前告警信息
 * @returns {Promise} 当前告警数据
 */
export const queryRealTimeAlarmInfo = () => {
    return request.get(`/api/energyStation/queryRealTimeAlarmInfo`)
}

/**
 * 查询能源站发电量排名（前五）
 * @returns {Promise} 发电量排名数据
 */
export const queryPowerGenerationRank = () => {
    return request.get(`/api/energyStation/queryPowerGenerationRank`)
}

/**
 * 查询日收益
 * @param {string} date - 日期
 * @returns {Promise} 日收益数据
 */
export const queryDayIncome = (date) => {
    return request.get(`/api/energyStation/queryDayIncome?date=${date}`)
}

/**
 * 查询月收益
 * @param {string} startDate - 开始日期
 * @param {string} endDate - 结束日期
 * @returns {Promise} 月收益数据
 */
export const queryMonthIncome = (startDate,endDate) => {
    return request.get(`/api/energyStation/queryMonthIncome?startDate=${startDate}&endDate=${endDate}`)
}

/**
 * 查询年收益
 * @param {string} year - 年份
 * @returns {Promise} 年收益数据
 */
export const queryYearIncome = (year) => {
    return request.get(`/api/energyStation/queryYearIncome?year=${year}`)
}

/**
 * 查询柔度调蓄量
 * @returns {Promise} 柔度调蓄量数据
 */
export const flexibleControlCount = () => {
    return request.get(`/api/energyStation/flexibleControlCount`)
}

/**
 * 查询供电可靠性
 * @returns {Promise} 供电可靠性数据
 */
export const getReliabilityRate = () => {
    return request.get(`/api/energyStation/getReliabilityRate`)
}


