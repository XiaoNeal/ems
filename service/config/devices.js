/**
 * type => 1:储能直流表 2:光伏直流表 3:负载直流表
 */
export const sqDeviceList = [
    { deviceId: 352, deviceName: '1#储能DC直流表', type: 1 },
    { deviceId: 354, deviceName: '2#储能DC直流表', type: 1 },
    { deviceId: 3353090, deviceName: '1#储能DC直流表', type: 2 },
    { deviceId: 3353091, deviceName: '2#储能DC直流表', type: 2 },
]

export const nyzAreaLevelId = 1
export const nyzDeviceListbySystem1 = [
    { deviceId: 3353090, deviceName: '1#储能DC直流表', type: 1 },
    { deviceId: 3353091, deviceName: '2#储能DC直流表', type: 1 },
    // { deviceId: 356, deviceName: '1#光伏DC直流表', type: 2 },能源站本地服务器
    // { deviceId: 358, deviceName: '2#光伏DC直流表', type: 2 },
    { deviceId: 3353089, deviceName: '1#光伏DC直流表', type: 2 }, //199服务器
    { deviceId: 3435873, deviceName: '2#光伏DC直流表', type: 2 },
    { deviceId: 3435875, deviceName: '1#负载DC直流表', type: 3 },
    { deviceId: 3435876, deviceName: '2#负载DC直流表', type: 3 },
    { deviceId: 3435857, deviceName: '1#电网AC交流表', type: 4 },

]

export const nyzDeviceListbySystem2 = [
]

export default {
    sqDeviceList,
    nyzAreaLevelId,
    nyzDeviceListbySystem1,
    nyzDeviceListbySystem2
}