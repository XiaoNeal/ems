import request from "@/utils/request";
import getUrl from "@/utils/get-url";


const statistic = {
    /**
     * 获取当前年累计数据
     */
    getCenterTotalEnergyData(params) {
        return request({
            url: getUrl("/statistic/getCenterTotalEnergyData"),
            method: 'get',
            params
        })
    },
    /**
     * 获取当前日数据
     */
    getCenterDayEnergyData(params) {
        return request({
            url: getUrl("/statistic/getCenterDayEnergyData"),
            method: 'get',
            params
        })
    },
    /**
     * 获取当前小时数据
     */
    getCenterHourEnergyData(params) {
        return request({
            url: getUrl("/statistic/getCenterHourEnergyData"),
            method: 'get',
            params
        })
    },
    /**
     * 获取当前月数据
     */
    getCenterMonthEnergyData(params) {
        return request({
            url: getUrl("/statistic/getCenterMonthEnergyData"),
            method: 'get',
            params
        })
    },
    /**
     * 获取当前年数据
     */
    getCenterYearEnergyData(params) {
        return request({
            url: getUrl("/statistic/getCenterYearEnergyData"),
            method: 'get',
            params
        })
    },
    /**
     * 获取小时统计数据列表
     */
    getCenterHourStatisticData(params) {
        return request({
            url: getUrl("/statistic/getCenterHourStatisticData"),
            method: 'get',
            params
        })
    },
    /**
     * 获取天统计数据列表
     */
    getCenterDayStatisticData(params) {
        return request({
            url: getUrl("/statistic/getCenterDayStatisticData"),
            method: 'get',
            params
        })
    },
    /**
     * 获取月统计数据列表
     */
    getCenterMonthStatisticData(params) {
        return request({
            url: getUrl("/statistic/getCenterMonthStatisticData"),
            method: 'get',
            params
        })
    },
    /**
     * 获取年统计数据列表
     */
    getCenterYearStatisticData(params) {
        return request({
            url: getUrl("/statistic/getCenterYearStatisticData"),
            method: 'get',
            params
        })
    },
    /**
     * 获取多个层级的发电、储能、电网、用电的实时功率
     */
    findHomeCommunityPowerSumByLevelIds(params){
        return request({
            url: getUrl("/statistic/findHomeCommunityPowerSumByLevelIds"),
            method: 'get',
            params
        })
    },
    /**
     * 获取多个层级的某日的发电、储能、电网、用电的电量总和
     */
    findHomeCommunityCapacitySumByLevelIds(params){
        return request({
            url: getUrl("/statistic/findHomeCommunityCapacitySumByLevelIds"),
            method: 'get',
            params
        })
    },
    /**
     * 获取多个层级的累计的发电、储能、电网、用电的电量总和
     */
    findHomeCommunityTotalCapacitySumByLevelIds(params){
        return request({
            url: getUrl("/statistic/findHomeCommunityTotalCapacitySumByLevelIds"),
            method: 'get',
            params
        })
    },
    /**
     * 获取当前辐照度
     */
    findDayIrradianceInfo(params){
        return request({
            url: getUrl("/statistic/findDayIrradianceInfo"),
            method: 'get',
            params
        })
    },
    /**
     * 获取多个层级的每小时用电量的同比值、环比值、峰平比
     */
    findDayConsumptionQProportionByLevelIds(params){
        return request({
            url: getUrl("/statistic/findDayConsumptionQProportionByLevelIds"),
            method: 'get',
            params
        })
    },
    /**
     * 获取多个层级的每天用电量的同比值、环比值、峰平比
     */
    findMonthConsumptionQProportionByLevelIds(params){
        return request({
            url: getUrl("/statistic/findMonthConsumptionQProportionByLevelIds"),
            method: 'get',
            params
        })
    },
    /**
     * 获取多个层级的每月用电量的同比值、环比值、峰平比
     */
    findYearConsumptionQProportionByLevelIds(params){
        return request({
            url: getUrl("/statistic/findYearConsumptionQProportionByLevelIds"),
            method: 'get',
            params
        })
    },
    /**
     * 获取多个层级的低碳指标、碳中和指标
     */
    findLowCarbonDataByLevelIds(params){
        return request({
            url: getUrl("/statistic/findLowCarbonDataByLevelIds"),
            method: 'get',
            params
        })
    },
    /**
     * 获取天的每个小时层级统计数据、报表数据（SOC）
     */
    findDayStatisticsDetailsByLevelIdAndDay(params){
        return request({
            url: getUrl("/statistic/findDayStatisticsDetailsByLevelIdAndDay"),
            method: 'get',
            params
        })
    },
    /**
     * 获取月的每天层级统计数据、报表数据（同比、环比、SOC、峰平比）
     */
    findMonthStatisticsDetailsByLevelIdAndMonth(params){
        return request({
            url: getUrl("/statistic/findMonthStatisticsDetailsByLevelIdAndMonth"),
            method: 'get',
            params
        })
    },
    /**
     * 获取年的每月层级统计数据、报表数据（同比、SOC、峰平比）
     */
    findYearStatisticsDetailsByLevelIdAndYear(params){
        return request({
            url: getUrl("/statistic/findYearStatisticsDetailsByLevelIdAndYear"),
            method: 'get',
            params
        })
    },

    /**
     * 获取每个层级的某日的发电、储能、电网、用电的电量
     */
    findHomeCommunityCapacityByLevelIdsAndDay(params){
        return request({
            url: getUrl("/statistic/findHomeCommunityCapacityByLevelIdsAndDay"),
            method: 'get',
            params
        })
    },

    /**
     * 获取每个层级的某月的发电、储能、电网、用电的电量
     */
    findHomeCommunityMonthCapacitySumByLevelIds(params){
        return request({
            url: getUrl("/statistic/findHomeCommunityMonthCapacitySumByLevelIds"),
            method: 'get',
            params
        })
    },

    /**
     * 获取每个层级的某年的发电、储能、电网、用电的电量
     */
    findHomeCommunityYearCapacitySumByLevelIds(params){
        return request({
            url: getUrl("/statistic/findHomeCommunityYearCapacitySumByLevelIds"),
            method: 'get',
            params
        })
    },

    /**
     * 周报表每日统计数据
     */
    findStatisticsDayByLevelIdsAndDays(params){
        return request({
            url: getUrl("/statistic/findStatisticsDayByLevelIdsAndDays"),
            method: 'get',
            params
        })
    },

    /**
     * 获取某个层级某天的类型（发/储/用/网）功率之和
     */
    findHomeCommunityPowerSumByLevelIdAndDataType(params){
        return request({
            url: getUrl("/statistic/findHomeCommunityPowerSumByLevelIdAndDataType"),
            method: 'get',
            params
        })
    },

    /**
     * 获取多个层级（社区/分中心）的发、储、并、用的每分钟功率
     */
    findPowerByLevelIdsAndDate(params){
        return request({
            url: getUrl("/statistic/findPowerByLevelIdsAndDate"),
            method: 'get',
            params
        })
    },

    /**
     * 获取多个层级天的每小时层级统计数据
     */
    findDayStatisticsDetailsByLevelIdsAndDay(params){
        return request({
            url: getUrl("/statistic/findDayStatisticsDetailsByLevelIdsAndDay"),
            method: 'get',
            params
        })
    },

    /**
     * 获取多个层级天的每小时随机的多个层级统计数据
     */
    findDayStatisticsDetailsByRandomLevelIdsAndDay(params){
        return request({
            url: getUrl("/statistic/findDayStatisticsDetailsByRandomLevelIdsAndDay"),
            method: 'get',
            params
        })
    },
    
    /**
     * 获取多个层级月的每天层级统计数据
     */
    findMonthStatisticsDetailsByLevelIdsAndMonth(params){
        return request({
            url: getUrl("/statistic/findMonthStatisticsDetailsByLevelIdsAndMonth"),
            method: 'get',
            params
        })
     },

    /**
     * 获取多个层级月的每天随机的层级统计数据
     */
     findMonthStatisticsDetailsByRandomLevelIdsAndMonth(params){
        return request({
            url: getUrl("/statistic/findMonthStatisticsDetailsByRandomLevelIdsAndMonth"),
            method: 'get',
            params
        })
     },

    /**
     * 获取多个层级年的每月层级统计数据
     */
    findYearStatisticsDetailsByLevelIdsAndYear(params){
        return request({
            url: getUrl("/statistic/findYearStatisticsDetailsByLevelIdsAndYear"),
            method: 'get',
            params
        })
    },

    /**
     * 获取多个层级年的每月随机的层级统计数据
     */
     findYearStatisticsDetailsByRandomLevelIdsAndYear(params){
        return request({
            url: getUrl("/statistic/findYearStatisticsDetailsByRandomLevelIdsAndYear"),
            method: 'get',
            params
        })
     },

    /**
     * 获取某个层级下的光储直柔能源数据
    */
     getOpticalStorageEnergyData(params){
        return request({
            url: getUrl("/statistic/getOpticalStorageEnergyData"),
            method: 'get',
            params
        })
    },

    /**
     * 获取某个层级下的能量类型
     */
    findCleanElectricityType(params){
        return request({
            url: getUrl("/statistic/findCleanElectricityType"),
            method: 'get',
            params
        })
    },

    /**
     * 根据设备Id获取电表曲线的数据
     */
     findPowerByDeviceIdAndDate(params){
        return request({
            url: getUrl("/statistic/findPowerByDeviceIdAndDate"),
            method: 'get',
            params
        })
    },

    /**
     * 获取多个层级的低碳指标、碳中和指标
     */
     findLowCarbonDataByLevelIds(params){
        return request({
            url: getUrl("/statistic/findLowCarbonDataByLevelIds"),
            method: 'get',
            params
        })
    },

    /**
     * 获取多个层级的环境收益和经济收益 
     */
     findLowCarbonDatasByLevelIds(params){
        return request({
            url: getUrl("/statistic/findLowCarbonDataByLevelIds"),
            method: 'get',
            params
        })
    },

    /**
     * 获取社区储能利用率
    */
     findDayStorageEfficiency(params){
        return request({
            url: getUrl("/statistic/findDayStorageEfficiency"),
            method: 'get',
            params
        })
    },
    /**
     * 获取时间段内的气象数据（每分钟1条）
    */
     findWeatherStationByDays(params){
        return request({
            url: getUrl("/statistic/findWeatherStationByDays"),
            method: 'get',
            params
        })
    },

    /**
     * 获取某个层级某天的人均用电
     */
    getPersonConsumptionByDay(params){
        return request({
            url: getUrl("/statistic/getPersonConsumptionByDay"),
            method: 'get',
            params
        })
    },

    /**
     * 获取某个层级某天的单位面积用电
     */
    getUnitAreaConsumptionByDay(params){
        return request({
            url: getUrl("/statistic/getUnitAreaConsumptionByDay"),
            method: 'get',
            params
        })
    },

    /**
     * 获取某月的总用电、人均用电、单位面积用电
     */
    findSubareaConsumptionByMonth(params){
        return request({
            url: getUrl("/statistic/findSubareaConsumptionByMonth"),
            method: 'get',
            params
        })
    },

    /**
     * 获取某年的总用电、人均用电、单位面积用电
     */
    findSubareaConsumptionByYear(params){
        return request({
            url: getUrl("/statistic/findSubareaConsumptionByYear"),
            method: 'get',
            params
        })
    },

    /**
     * 获取多个层级的月储能利用率（含社区）
     */
    findMonthStorageEfficiency(params){
        return request({
            url: getUrl("/statistic/findMonthStorageEfficiency"),
            method: 'get',
            params
        })
    },

    /**
     * 获取多个层级的年储能利用率（含社区）
     */
    findYearStorageEfficiency(params){
        return request({
            url: getUrl("/statistic/findYearStorageEfficiency"),
            method: 'get',
            params
        })
    },

    /**
     * 获取某月每天的辐照信息 
     */
    findMonthIrradianceInfo(params){
        return request({
            url: getUrl("/statistic/findMonthIrradianceInfo"),
            method: 'get',
            params
        })
    },

    /**
     * 获取某年每月的辐照信息
     */
    findYearIrradianceInfo(params){
        return request({
            url: getUrl("/statistic/findYearIrradianceInfo"),
            method: 'get',
            params
        })
    },

    /**
    * 获取多个层级每个层级的年发电、储能、电网、用电等电量（用于多个层级获取年统计量）
    */
    getCenterYearStatisticData(params){
        return request({
            url: getUrl("/statistic/getCenterYearStatisticData"),
            method: 'get',
            params
        })
    },

    /**
     * 获取全年最大发电量/最大用电量及日期
     */
    findMaxQAndDateByLevelIdsAndYear(params){
        return request({
            url: getUrl("/statistic/findMaxQAndDateByLevelIdsAndYear"),
            method: 'get',
            params
        })
    },
    /**
     * 获取全部层级某天的某类设备(空调、照明、电脑)用电占比
     */
     findDeviceCategoryConsumptionByDay(params){
        return request({
            url: getUrl("/statistic/findDeviceCategoryConsumptionByDay"),
            method: 'get',
            params
        })
    },

    /**
     * 获取全部层级某月的某类设备(空调、照明、电脑)用电占比
     */
     findDeviceCategoryConsumptionByMonth(params){
        return request({
            url: getUrl("/statistic/findDeviceCategoryConsumptionByMonth"),
            method: 'get',
            params
        })
    },

    /**
     * 获取全部层级某年的某类设备(空调、照明、电脑)用电占比
     */
     findDeviceCategoryConsumptionByYear(params){
        return request({
            url: getUrl("/statistic/findDeviceCategoryConsumptionByYear"),
            method: 'get',
            params
        })
    },

    /**
     * 获取天的每小时随机多层级分类统计数据
     */
     findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay(params){
        return request({
            url: getUrl("/statistic/findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay"),
            method: 'get',
            params
        })
    },

    /**
     * 获取月的每天随机多层级分类统计数据
     */
     findMonthCategoryStatisticsDetailsByRandomLevelIdsAndMonth(params){
        return request({
            url: getUrl("/statistic/findMonthCategoryStatisticsDetailsByRandomLevelIdsAndMonth"),
            method: 'get',
            params
        })
    },

    /**
     * 获取年的每月随机多层级分类统计数据
     */
    findYearCategoryStatisticsDetailsByRandomLevelIdsAndYear(params){
        return request({
            url: getUrl("/statistic/findYearCategoryStatisticsDetailsByRandomLevelIdsAndYear"),
            method: 'get',
            params
        })
    },

    /**
     * 获取最新人脸信息
     */
    getFaceAccessInformation(params){
        return request({
            url: getUrl("/statistic/getFaceAccessInformation"),
            method: 'get',
            params
        })
    },
    
    getFaceAccessInformationsBytime(params){
        return request({
            url: getUrl("/statistic/getFaceAccessInformationsBytime"),
            method: 'get',
            params
        })
    },


    /**
     * 直流电弧监测模块信息
     */
    findT1804StateByAreaLevelId(params){
        return request({
            url: getUrl("/statistic/findT1804StateByAreaLevelId"),
            method: 'get',
            params
        })
    },


}

export default statistic;