import request from '@/utils/request.js'

// 2. 调压调功：母线电压
export const quickControlBusVoltage = (idCode, address, voltage) => {
  return request.post('/api/homeCommunity/quickControl', {
    apiSufix: 'powerAjust2',
    idCode,
    address,
    dc_bus_voltage: voltage,
    on: '0'
  })
}

// 3. 调压调功：放大系数
export const quickControlAmplificationFactor = (idCode, address, status, factor, time) => {
  return request.post('/api/homeCommunity/quickControl', {
    apiSufix: 'powerAjust1',
    idCode,
    address,
    regulation_enable: status,
    voltage_sense_time: time,
    amplification_factor: factor
  })
}

// 查询指定设备信息
export const queryDeviceInfo = (typeCode) => {
  return request.get(`/api/energyStation/deviceInfo?typeCode=${typeCode}`)
}

// 查询下发控制时间
export const queryScheduleTime = (typeCode, esId) => {
  return request.get(`/api/energyStation/scheduleTime?typeCode=${typeCode}&esId=${esId}`)
}

// 添加下发时间
export const insertScheduleTime = (typeCode, esId, startTime, endTime, value, status) => {
  return request.post('/api/energyStation/scheduleTime/in', {
    esId,
    typeCode,
    startTime,
    endTime,
    value,
    status
  })
}

// 删除下发时间
export const deleteScheduleTime = (id, startTime, endTime, value) => {
  return request.post('/api/energyStation/scheduleTime/up', {
    id,
    startTime,
    endTime,
    value,
    status: 0
  })
}

// 恢复默认值
export const sendInit = (esId, typeCode) => {
  return request.get(`/api/energyStation/sendInit?typeCode=${typeCode}&esId=${esId}`)
}
