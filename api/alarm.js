import request from '@/utils/request'

export const findDayAlarmRecord = (data) => {
    return request.get('/api/shangHaiZYNYL/findDayAlarmRecord', data)
}

export const queryQuickControlLog = (data) => {
    return request.post('/api/homeCommunity/queryQuickControlLog', data)
}

export const getOperationLogByUserId = (params) => {
    return request.get('/api/GetOperationLogByUserId', params)
}

export const getAlarmRecord = (params) => {
    return request.get('/api/energyStation/alarm/getAlarmRecord', params)
}