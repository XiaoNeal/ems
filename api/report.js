import request from '@/utils/request.js'

// 13.能源站列表名称
export const queryEnergyStationNameList = () => {
    return request.get(`/api/energyStation/queryEnergyStationNameList`)
}

// 14.能源站报表导出-日
export const queryEnergyStationDayReport = (esId,date) => {
    return request.get(`/api/energyStation/queryEnergyStationDayReport?esId=${esId}&date=${date}`)
}

// 15.能源站报表导出-月
export const queryEnergyStationMonthReport = (esId,startDate,endDate) => {
    return request.get(`/api/energyStation/queryEnergyStationMonthReport?esId=${esId}&startDate=${startDate}&endDate=${endDate}`)
}

// 16.能源站报表导出-年
export const queryEnergyStationYearReport = (esId,year) => {
    return request.get(`/api/energyStation/queryEnergyStationYearReport?esId=${esId}&year=${year}`)
}