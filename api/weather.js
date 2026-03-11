/**
 * 关于天气所用到的接口封装
 */
import request from '@/utils/request'
import { URL, DATA } from '@/utils/forSpringBoot'
// import { findOriginBy_id, findOriginByLevel } from './utils/findOrigin'

const weather = {
    findWeatherMonitoringByFrameDatetimeBetween() {
        return request({
            url: URL('/homeCommunity/findWeatherMonitoringByFrameDatetimeBetween'),
            method: "GET"
        })
    },

    //气象站从能源站上报后用设备id查询气象数据
    findWeatherMonitoringByFrameDatetimeBetweenByDeviceId(params) {
        return request({
            url: URL('/homeCommunity/findWeatherMonitoringByFrameDatetimeBetweenByDeviceId'),
            method: "GET",
            params
        })
    },

    // 2.获取天气数据（辐照度和温度）用设备id查询
    findWeatherStationByDaysByDeviceId(params) {
        return request({
            url: URL('/homeCommunity/findWeatherStationByDaysByDeviceId'),
            method: 'GET',
            params
        })
    },

    // 获取历史最大辐照度
    queryMaxIrradiance(params) {
        return request({
            url: URL('/homeCommunity/queryMaxIrradiance'),
            method: "GET",
            params
        })
    }
}

export default weather