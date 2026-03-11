import request from '@/utils/request.js'

// 17.能源站设备数据
export const queryAllEnergyStationSituation = (esId) => {
    return request.get(`/api/energyStation/queryAllEnergyStationSituation?esId=${esId}`)
}

// 18.设备弹窗-日
export const queryEnergyStationByDay = (deviceId,date) => {
    return request.get(`/api/energyStation/queryEnergyStationByDay?deviceId=${deviceId}&date=${date}`)
}

// 19.设备弹窗-月
export const queryEnergyStationByMonth = (deviceId,startDate,endDate) => {
    return request.get(`/api/energyStation/queryEnergyStationByMonth?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}`)
}

// 20.设备弹窗-年
export const queryEnergyStationByYear = (deviceId,year) => {
    return request.get(`/api/energyStation/queryEnergyStationByYear?deviceId=${deviceId}&year=${year}`)
}

// 21.储能详细数据-日
export const queryStoredEnergyByDay = (deviceId,year) => {
    return request.get(`/api/energyStation/queryStoredEnergyByDay?deviceId=${deviceId}&year=${year}`)
}

// 22.储能详细数据-月
export const queryStoredEnergyByMonth = (deviceId,startDate,endDate) => {
    return request.get(`/api/energyStation/queryStoredEnergyByMonth?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}`)
}

// 23.储能详细数据-年
export const queryStoredEnergyByYear = (deviceId,year) => {
    return request.get(`/api/energyStation/queryStoredEnergyByYear?deviceId=${deviceId}&year=${year}`)
}

// 37.导出数据
export const download = (deviceId,dataType,startTime,endTime) => {
    return request.post(`/api/energyStation/download?deviceId=${deviceId}&dataType=${dataType}&startTime=${startTime}&endTime=${endTime}`)
}

// 23.储能详细数据-年
export const queryEnergyStationStorageInfo = (esId) => {
    return request.get(`/api/energyStation/queryEnergyStationStorageInfo?esId=${esId}`)
}

// xx.设备名称修改
export const alterDeviceNameByDeviceId = (datas) => {
    return request.post(`/api/energyStation/alterDeviceNameByDeviceId`,datas)
}

// 24.光伏发电量和收益
export const queryEnergyStationPVData = (esId,date) => {
    return request.get(`/api/energyStation/pv/data?esId=${esId}&date=${date}`)
}

// 25.电网供馈电量
export const queryEnergyStationGridData = (esId,date) => {
    return request.get(`/api/energyStation/grid/data?esId=${esId}&date=${date}`)
}

// 26.储能充放电次数和收益
export const queryEnergyStationBatteryData = (esId,date) => {
    return request.get(`/api/energyStation/battery/data?esId=${esId}&date=${date}`)
}

// 27.直流负载用电量
export const queryEnergyStationDCData = (esId,date) => {
    return request.get(`/api/energyStation/dc/data?esId=${esId}&date=${date}`)
}


