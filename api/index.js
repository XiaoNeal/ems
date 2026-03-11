import request from '@/utils/request.js'
import requestOuter from '@/utils/request-outer.js'

// 1.查看系统整体的情况
export const systemOverview = (data) => {
    return request.get('/api/energyStation/systemOverview', {
        params: data
    })
}

// 2.查询能源站的发电功率曲线-日
export const queryDayGeneratedPower = (esId,date) => {
    return request.get(`/api/energyStation/queryDayGeneratedPower?esId=${esId}&date=${date}`)
}

// 2.1 查询能源站的发电功率曲线-月
export const queryMonthGeneratedPower = (esId,date) => {
    return request.get(`/api/energyStation/queryMonthGeneratedPower?esId=${esId}&date=${date}`)
}

// 2.2 查询能源站的发电功率曲线-年
export const queryYearGeneratedPower = (esId,date) => {
    return request.get(`/api/energyStation/queryYearGeneratedPower?esId=${esId}&date=${date}`)
}

// 3.能源站的电量统计柱状图-日
export const queryDayElectricityStatistic = (esId,date) => {
    return request.get(`/api/energyStation/queryDayElectricityStatistic?esId=${esId}&date=${date}`)
}

// 4.能源站的电量统计柱状图-月
export const queryMonthElectricityStatistic = (esId,startDate,endDate) => {
    return request.get(`/api/energyStation/queryMonthElectricityStatistic?esId=${esId}&startDate=${startDate}&endDate=${endDate}`)
}

// 5.能源站的电量统计柱状图-年
export const queryYearElectricityStatistic = (esId,year) => {
    return request.get(`/api/energyStation/queryYearElectricityStatistic?esId=${esId}&year=${year}`)
}

// 6.本日和累计节约电量
export const queryPhotovoltaicPowerGenerationAndGridPowerSupply = (params) => {
    return request.get(`/api/energyStation/queryPhotovoltaicPowerGenerationAndGridPowerSupply`, { params })
}

// 7.当前告警
export const queryRealTimeAlarmInfo = () => {
    return request.get(`/api/energyStation/queryRealTimeAlarmInfo`)
}

// 8.能源站发电量前五排名
export const queryPowerGenerationRank = () => {
    return request.get(`/api/energyStation/queryPowerGenerationRank`)
}

// 9.收益柱状图-日
export const queryDayIncome = (date) => {
    return request.get(`/api/energyStation/queryDayIncome?date=${date}`)
}

// 10.收益柱状图-月
export const queryMonthIncome = (startDate,endDate) => {
    return request.get(`/api/energyStation/queryMonthIncome?startDate=${startDate}&endDate=${endDate}`)
}

// 11.收益柱状图-年
export const queryYearIncome = (year) => {
    return request.get(`/api/energyStation/queryYearIncome?year=${year}`)
}
// export const findDCThreePhaseDataByDeviceIdsAndDateAndType = (data) => {
//     return request.post('/api/shangHaiZYNYL/findDCThreePhaseDataByDeviceIdsAndDateAndType', {
//         data: data
//     })
// }
// 12.柔度调蓄量
export const flexibleControlCount = () => {
    return request.get(`/api/energyStation/flexibleControlCount`)
}
// 13.供电可靠性
export const getReliabilityRate = () => {
    return request.get(`/api/energyStation/getReliabilityRate`)
}


export const getWeather = (url,params) => {
    return requestOuter.get(url,params)
}