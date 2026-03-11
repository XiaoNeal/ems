/**
 * energy模块所用到的接口封装
 */
import request from '@/utils/request'
import { URL, DATA, FORMDATA } from '@/utils/forSpringBoot'

const energy = {
    /**
     * =====电表曲线=====
     *  */
    // 1.获取电表曲线数据（最大值，最小值，平均值）
    findPowerByDeviceIdAndDate(params) {
        return request({
            url: URL('/homeCommunity/findPowerByDeviceIdAndDate'),
            method: 'GET',
            params
        })
    },

    //2.获取电梯A相电流数据
    findAphaseCurrentByDeviceIdAndDate(params) {
        return request({
            url: URL('/homeCommunity/findAphaseCurrentByDeviceIdAndDate'),
            method: 'GET',
            params
        })
    },

    /**
     * =====发电分析=====
     */
    // 1.获取各个箱子的发电数据（预测发电量，实际发电量，相差）
    findHomeCommunityPowerSumByRandomLevelIdsAndDataType(data) {
        return request({
            url: URL('/homeCommunity/findHomeCommunityPowerSumByRandomLevelIdsAndDataType'),
            method: 'POST',
            data: DATA(data),
        })
    },
    // 2.获取天气数据（辐照度和温度）
    findWeatherStationByDays(params) {
        return request({
            url: URL('/homeCommunity/findWeatherStationByDays'),
            method: 'GET',
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

    /**
     * =====能源曲线数据=====
     */
    // 1.单个箱子数据
    findHomeCommunityPowerSumByLevelIdAndDataType(data) {
        return request({
            url: URL('/homeCommunity/findHomeCommunityPowerSumByLevelIdAndDataType'),
            method: 'POST',
            data: DATA(data)
        })
    },
    // 2.获取多个层级（社区/分中心）的发、储、并、用的每分钟功率
    findPowerByLevelIdsAndDate(data) {
        return request({
            url: URL('/homeCommunity/findPowerByLevelIdsAndDate'),
            method: 'POST',
            data: DATA(data)
        })
    },

    /**
     * 获取某日的总用电、人均用电、单位面积用电
     */
    findSubareaConsumptionByDay(params) {
        return request({
            url: URL('/homeCommunity/findSubareaConsumptionByDay'),
            method: 'GET',
            params
        })
    },

    /**
     * 周报表每日统计数据
     */
    findStatisticsDayByLevelIdsAndDays(data) {
        return request({
            url: URL('/homeCommunity/findStatisticsDayByLevelIdsAndDays'),
            method: 'POST',
            data: DATA(data)
        })
    },


    findAtrributes(params) {
        return request({
            url: URL('/homeCommunity/atrributes'),
            method: 'GET',
            params
        })
    },

    getAtrributesData(params) {
        return request({
            url: URL('/homeCommunity/atrributesData'),
            method: 'GET',
            params
        })
    },

    // 获取多个层级天的每小时层级统计数据 ------获取光伏未来社区、分中心的日报表数据
    findDayStatisticsDetailsByLevelIdsAndDay(ids, time) {
        let data = {
            areaLevelIds: ids,
            date: time
        }
        return request({
            url: URL('/homeCommunity/findDayStatisticsDetailsByLevelIdsAndDay'),
            method: 'POST',
            data: DATA(data)
        })
    },

    // 获取多个层级月的每天层级统计数据 ------获取光伏未来社区、分中心的月报表数据
    findMonthStatisticsDetailsByLevelIdsAndMonth(ids, time) {
        let data = {
            areaLevelIds: ids,
            month: new Date(time).getMonth() + 1,
            year: new Date(time).getFullYear()
        }
        return request({
            url: URL('/homeCommunity/findMonthStatisticsDetailsByLevelIdsAndMonth'),
            method: 'POST',
            data: DATA(data)
        })
    },

    // 获取多个层级年的每月层级统计数据 ------获取光伏未来社区、分中心的年报表数据
    findYearStatisticsDetailsByLevelIdsAndYear(ids, time) {
        let data = {
            areaLevelIds: ids,
            year: new Date(time).getFullYear()
        }
        return request({
            url: URL('/homeCommunity/findYearStatisticsDetailsByLevelIdsAndYear'),
            method: 'POST',
            data: DATA(data)
        })
    },

    // 获取碳排因子
    queryCarbonFactor(areaId, year) {
        return request({
            url: URL(`/carbon/factor/areaId/${areaId}/year/${year}`),
            method: 'GET',
        })
    },

    // 设备管理 => 负荷曲线
    findConsumeQAndPower(dateType, date) {
        const d = new Date(date);
        let requestURI = ''
        let params = {}
        if (dateType == 'date') {
            requestURI = '/homeCommunity/findDayConsumeQAndPower'
            params = { day:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
        } else if (dateType == 'month') {
            requestURI = '/homeCommunity/findMonthConsumeQAndPower'
            params = { year:d.getFullYear(), 
                month: String(d.getMonth()+1).padStart(2,'0') }
        } else if (dateType == 'year') {
            requestURI = '/homeCommunity/findYearConsumeQAndPower'
            params = { year: d.getFullYear() }
        }

        return request({
            url: URL(requestURI),
            method: 'GET',
            params
        })
    },

    // 设备管理 => 总设备信息
    findAllDeviceInfo() {
        return request({
            url: URL('/homeCommunity/findAllDeviceInfo'),
            method: 'GET',
        })
    },

    // 设备管理 => 所有设备
    findDeviceEnergyInfo() {
        return request({
            url: URL('/homeCommunity/findDeviceEnergyInfo'),
            method: 'GET',
        })
    },

    queryFlexibility(params) {
        return request({
            url: URL('/homeCommunity/queryFlexibility'),
            method: 'GET',
            params
        })
    },

    // 经济性分析 => 经济性分析信息概览
    findEconomicalAnalysisInfo() {
        return request({
            url: URL('/homeCommunity/findEconomicalAnalysisInfo'),
            method: 'GET',
        })
    },

    // 经济性分析 => 峰平谷电价及运行收益
    findPeakFlatValleyElectrovalenceAndIncome(dateType, date) {
        const d = new Date(date);
        let requestURI = ''
        let params = {}
        if (dateType == 'hour') {
            requestURI = '/homeCommunity/findDayPeakFlatValleyElectrovalenceAndIncome'
            params = { day: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
        } else if (dateType == 'day') {
            requestURI = '/homeCommunity/findMonthPeakFlatValleyElectrovalenceAndIncome'
            params = { year:  d.getFullYear(), 
                month: String(d.getMonth()+1).padStart(2,'0') }
        } else if (dateType == 'month') {
            requestURI = '/homeCommunity/findYearPeakFlatValleyElectrovalenceAndIncomeonsumeQAndPower'
            params = { year: d.getFullYear()}
        }

        return request({
            url: URL(requestURI),
            method: 'GET',
            params
        })
    },

    // 经济性分析 => 碳排因子响应及电力响应收益
    findCarbonEmissionFactorAndPowerFactorIncome(dateType, date) {
        const d = new Date(date);
        let requestURI = ''
        let params = {}
        if (dateType == 'hour') {
            requestURI = '/homeCommunity/findDayCarbonEmissionFactorAndPowerFactorIncome'
            params = { day: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
        } else if (dateType == 'day') {
            requestURI = '/homeCommunity/findMonthCarbonEmissionFactorAndPowerFactorIncomethConsumeQAndPower'
            params = { year: d.getFullYear(), 
                month: String(d.getMonth()+1).padStart(2,'0') }
        } else if (dateType == 'month') {
            requestURI = '/homeCommunity/findYearCarbonEmissionFactorAndPowerFactorIncome'
            params = { year: d.getFullYear() }
        }

        return request({
            url: URL(requestURI),
            method: 'GET',
            params
        })
    },

    // 设备管理 => 获取所有设备列表
    findDeviceInfoList() {
        return request({
            url: URL('/homeCommunity/findDeviceInfoList'),
            method: 'GET',
        })
    },

    // 报警分析 => 告警信息统计按日月年查询
    findAlarmInfoCount(dateType, date) {
        const d = new Date(date);
        let requestURI = ''
        let params = {}
        if (dateType == 'date') {
            requestURI = '/homeCommunity/findDayAlarmInfoCount'
            params = { day: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
        } else if (dateType == 'month') {
            requestURI = '/homeCommunity/findMonthAlarmInfoCount'
            params = { year: d.getFullYear(), 
                month: String(d.getMonth()+1).padStart(2,'0') }
        } else if (dateType == 'year') {
            requestURI = '/homeCommunity/findYearAlarmInfoCount'
            params = { year: d.getFullYear() }
        }

        return request({
            url: URL(requestURI),
            method: 'GET',
            params
        })
    },

    // 报警分析 => 告警信息统计按日月年查询
    findAreaAlarmInfoCount(dateType, date) {
        const d = new Date(date);
        let requestURI = ''
        let params = {}
        if (dateType == 'date') {
            requestURI = '/homeCommunity/findDayAreaAlarmInfoCount'
            params = { day:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
        } else if (dateType == 'month') {
            requestURI = '/homeCommunity/findMonthAreaAlarmInfoCount'
            params = { year: d.getFullYear(), 
                month: String(d.getMonth()+1).padStart(2,'0') }
        } else if (dateType == 'year') {
            requestURI = '/homeCommunity/findYearAreaAlarmInfoCount'
            params = { year: d.getFullYear() }
        }

        return request({
            url: URL(requestURI),
            method: 'GET',
            params
        })
    },

    // 报警分析 => 告警信息统计按日月年查询
    findDeviceAlarmInfoCount(dateType, date) {
        const d = new Date(date);
        let requestURI = ''
        let params = {}
        if (dateType == 'date') {
            requestURI = '/homeCommunity/findDayDeviceAlarmInfoCount'
            params = { day: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
        } else if (dateType == 'month') {
            requestURI = '/homeCommunity/findMonthDeviceAlarmInfoCount'
            params = { year:  d.getFullYear(), 
                month: String(d.getMonth()+1).padStart(2,'0') }
        } else if (dateType == 'year') {
            requestURI = '/homeCommunity/findYearDeviceAlarmInfoCount'
            params = { year:d.getFullYear()}
        }

        return request({
            url: URL(requestURI),
            method: 'GET',
            params
        })
    },

    // 报警分析 => 告警信息统计按日月年查询
    findSeverityLevelAlarmInfoCount(dateType, date) {
        const d = new Date(date);
        let requestURI = ''
        let params = {}
        if (dateType == 'date') {
            requestURI = '/homeCommunity/findDaySeverityLevelAlarmInfoCount'
            params = { day: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
        } else if (dateType == 'month') {
            requestURI = '/homeCommunity/findMonthSeverityLevelAlarmInfoCount'
            params = { year:  d.getFullYear(), 
                month: String(d.getMonth()+1).padStart(2,'0') }
        } else if (dateType == 'year') {
            requestURI = '/homeCommunity/findYearSeverityLevelAlarmInfoCount'
            params = { year: d.getFullYear() }
        }

        return request({
            url: URL(requestURI),
            method: 'GET',
            params
        })
    },

    // 报警分析 => 以列表的形式查询所有的告警信息，每个告警都有级别（紧急、次要、提示）
    findAlarmInfoList(dateType, date, deviceType, area) {
        const d = new Date(date);
        let requestURI = ''
        let params = {}
        if (dateType == 'date') {
            requestURI = '/homeCommunity/findDayAlarmInfoList'
            params = { day:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` , area, deviceType }
        } else if (dateType == 'month') {
            requestURI = '/homeCommunity/findMonthAlarmInfoList'
            params = { year: d.getFullYear(), 
                month: String(d.getMonth()+1).padStart(2,'0'), area, deviceType }
        } else if (dateType == 'year') {
            requestURI = '/homeCommunity/findYearAlarmInfoList'
            params = { year: d.getFullYear(), area, deviceType }
        }

        return request({
            url: URL(requestURI),
            method: 'GET',
            params
        })
    },

    
    // 查询设备日功率曲线
    queryStoragePowerCurve(data) {
        return request({
            url: URL("/homeCommunity/queryStoragePowerCurve"),
            method: 'post',
            data
        })
    },
}

export default energy