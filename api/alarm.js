import request from '@/utils/request'

export const findDayAlarmRecord = (data) => {
    return request.get('/api/shangHaiZYNYL/findDayAlarmRecord', data)
}

export const queryQuickControlLog = (data) => {
    return request.post('/api/homeCommunity/queryQuickControlLog', data)
}

export const getOperationLogByUserId = (userId) => {
    // return request.get('/api/GetOperationLogByUserId?userId=' + userId)
    return request.get('/api/GetOperationLogByUserId')
}