import request from "@/utils/request";
import { DATA,URL } from '@/utils/forSpringBoot'
// import Moment from 'moment'

const getNyzUrl = (url) => {
    return  `/shequApi` + url
}

const nyz_new = {
    /**
     * 查询充放电最大最小功率
     */
    queryHighestChargeAndPower(data) {
        return request({
            url: getNyzUrl("/homeCommunity/queryHighestChargeAndPower"),
            method: 'post',
            data
        })
    },
    /**
     * 查询储能日功率曲线
     */
    queryStoragePowerCurve(data) {
        return request({
            url: URL("/homeCommunity/queryStoragePowerCurve"),
            method: 'post',
            data
        })
    },
    /**
     * 查询正反向电能
     */
    findEveryHourByDeviceIds(data) {
        return request({
            url: getNyzUrl('/shangHaiZYNYL/findEveryHourByDeviceIds'),
            method: "POST",
            data: DATA(data)
        })
    },
    findEveryDayByDeviceIds(data) {
        return request({
            url: getNyzUrl('/shangHaiZYNYL/findEveryDayByDeviceIds'),
            method: "POST",
            data: DATA(data)
        })
    },
    findEveryMonthByDeviceIds(data) {
        return request({
            url: getNyzUrl('/shangHaiZYNYL/findEveryMonthByDeviceIds'),
            method: "POST",
            data: DATA(data)
        })
    },

    getStorageRemainEnergy(params) {
        return request({
            url: URL('/homeCommunity/v4/quickQuery/battery_stack_discharge/db_deviceId'),
            method: "get",
            params
        })
    },
}

export default nyz_new;