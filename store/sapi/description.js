// {
//     name:'',  //接口方法名
//     method:'get',  //请求方法
//     url:'',  //接口url    
//     docs:''  //接口说明，便于输出接口文档（当前没有配置此功能）

//     name:'',  
//     method:'get',  
//     url:'',   
//     docs:''  
// },
import koa_url from "@/utils/get-url"; //koa的接口拼接
import { URL } from '@/utils/forSpringBoot' //SPRINGBOOT接口拼接
const apiList = [
    //------接口描述-------
    /**
     *  全局使用的数据
     */
    {
        name: 'getCenterList',
        method: 'get',
        url: koa_url('/center/getCenterList'),
        docs: 'koa--获取社区所有节点列表'
    },
    /**
     *   单页面使用的数据
     */
    {
        name: 'getCenterDayEnergyData',
        method: 'get',
        url: koa_url('/statistic/getCenterDayEnergyData'),
        docs: 'koa--首页/能源管理--/能源分析--获取当前日储能数据--复杂运算(getStatisticsDayByLevelAndDays)'
    },
    {
        name: 'getCenterTotalEnergyData',
        method: 'get',
        url: koa_url('/statistic/getCenterTotalEnergyData'),
        docs: 'koa--首页--获取当前区域年统计数据--复杂运算(getStatisticsYearByLevelAndYears)'
    },
    {
        name: 'findLowCarbonDataByLevelIds',
        method: 'post',
        url: URL('/homeCommunity/findLowCarbonDataByLevelIds'),
        docs: '首页/能源管理--/能源信息--获取多个层级的低碳指标、碳中和指标'
    },
    {
        name: 'findHomeCommunityPowerSumByLevelIds',
        method: 'post',
        url: URL('/homeCommunity/findHomeCommunityPowerSumByLevelIds'),
        docs: '首页--获取当前多个层级实时功率'
    },
    {
        name: 'findHomeCommunityCapacitySumByLevelIds',
        method: 'post',
        url: URL('/homeCommunity/findHomeCommunityCapacitySumByLevelIds'),
        docs: '首页/能源监测--/今日数据--获取当前多个层级当日能源数据'
    },
    {
        name: 'findHomeCommunityTotalCapacitySumByLevelIds',
        method: 'post',
        url: URL('/homeCommunity/findHomeCommunityTotalCapacitySumByLevelIds'),
        docs: '首页--获取当前多个层级累计能源数据'
    },
    {
        name: 'findMaxQAndDateByLevelIdsAndYear',
        method: 'post',
        url: URL('/homeCommunity/findMaxQAndDateByLevelIdsAndYear'),
        docs: '首页--获取全年最大发电量/最大用电量及日期'
    },
    {
        name: 'findCleanElectricityType',
        method: 'post',
        url: URL('/homeCommunity/findCleanElectricityType'),
        docs: '能源监测--系统结构图--获取某个层级下的能量类型'
    },
    {
        name: 'findSubareaConsumptionByDay',
        method: 'get',
        url: URL('/homeCommunity/findSubareaConsumptionByDay'),
        docs: '能源监测/能源管理--今日数据/分区用电--获取某日的总用电、获取多个层级（社区/分中心）的发、储、并、用的每分钟功率'
    },
    {
        name: 'getCenterHourStatisticData',
        method: 'get',
        url: koa_url('/statistic/getCenterHourStatisticData'),
        docs: 'koa-能源管理--能源分析--获取当前区域小时统计数据列表'
    },
    {
        name: 'getCenterDayStatisticData',
        method: 'get',
        url: koa_url('/statistic/getCenterDayStatisticData'),
        docs: 'koa-能源管理--能源分析--获取当前区域日统计数据列表'
    },
    {
        name: 'getCenterMonthStatisticData',
        method: 'get',
        url: koa_url('/statistic/getCenterMonthStatisticData'),
        docs: 'koa-能源管理--能源分析--获取当前区域月统计数据列表'
    },
    {
        name: 'getCenterHourEnergyData',
        method: 'get',
        url: koa_url('/statistic/getCenterHourEnergyData'),
        docs: 'koa-能源管理--能源分析--获取当前区域小时统计数据'
    },
    //day的在前面有
    {
        name: 'getCenterMonthEnergyData',
        method: 'get',
        url: koa_url('/statistic/getCenterMonthEnergyData'),
        docs: 'koa-能源管理--能源分析--获取当前区域月统计数据'
    },
    {
        name: 'findDayConsumptionQProportionByLevelIds',
        method: 'post',
        url: URL('/homeCommunity/findDayConsumptionQProportionByLevelIds'),
        docs: '能源管理--能源分析--获取多个层级的每小时用电量的同比值、环比值、峰平比'
    },
    {
        name: 'findMonthConsumptionQProportionByLevelIds',
        method: 'post',
        url: URL('/homeCommunity/findMonthConsumptionQProportionByLevelIds'),
        docs: '能源管理--能源分析--获取多个层级的天用电量的同比值、环比值、峰平比'
    },
    {
        name: 'findYearConsumptionQProportionByLevelIds',
        method: 'post',
        url: URL('/homeCommunity/findYearConsumptionQProportionByLevelIds'),
        docs: '能源管理--能源分析--获取多个层级的每月用电量的同比值、环比值、峰平比'
    },
    {
        name: 'findHomeCommunityCapacityByLevelIdsAndDay',
        method: 'post',
        url: URL('/homeCommunity/findHomeCommunityCapacityByLevelIdsAndDay'),
        docs: '能源管理--能源分析--获取每个层级的某日的发电、储能、电网、用电的电量'
    },
    {
        name: 'findHomeCommunityMonthCapacitySumByLevelIds',
        method: 'post',
        url: URL('/homeCommunity/findHomeCommunityMonthCapacitySumByLevelIds'),
        docs: '能源管理--能源分析--获取每个层级的某月的发电、储能、电网、用电的电量'
    },
    {
        name: 'findHomeCommunityYearCapacitySumByLevelIds',
        method: 'post',
        url: URL('/homeCommunity/findHomeCommunityYearCapacitySumByLevelIds'),
        docs: '能源管理--能源分析--获取每个层级的某年的发电、储能、电网、用电的电量'
    },
    {
        name: 'findDayIrradianceInfo',
        method: 'get',
        url: URL('/homeCommunity/findDayIrradianceInfo'),
        docs: '能源管理--能源分析--获取某日每小时的辐照信息'
    },
    {
        name: 'findMonthIrradianceInfo',
        method: 'get',
        url: URL('/homeCommunity/findMonthIrradianceInfo'),
        docs: '能源管理--能源分析--获取某月每天的辐照信息'
    },
    {
        name: 'findYearIrradianceInfo',
        method: 'get',
        url: URL('/homeCommunity/findYearIrradianceInfo'),
        docs: '能源管理--能源分析--获取某年每月的辐照信息'
    },
    {
        name: 'findDayStorageEfficiency',
        method: 'post',
        url: URL('/homeCommunity/findDayStorageEfficiency'),
        docs: '能源管理--能源分析--获取社区储能利用率'
    },
    {
        name: 'findMonthStorageEfficiency',
        method: 'post',
        url: URL('/homeCommunity/findMonthStorageEfficiency'),
        docs: '能源管理--能源分析--获取多个层级的月储能利用率（含社区）'
    },
    {
        name: 'findYearStorageEfficiency',
        method: 'post',
        url: URL('/homeCommunity/findYearStorageEfficiency'),
        docs: '能源管理--能源分析--获取多个层级的年储能利用率（含社区）'
    },
    {
        name: 'findDeviceCategoryConsumptionByDay',
        method: 'post',
        url: URL('/homeCommunity/findDeviceCategoryConsumptionByDay'),
        docs: '能源管理--分类用电--获取全部层级某天的某类设备(空调、照明、电脑)用电占比'
    },
    {
        name: 'findDeviceCategoryConsumptionByMonth',
        method: 'post',
        url: URL('/homeCommunity/findDeviceCategoryConsumptionByMonth'),
        docs: '能源管理--分类用电--获取全部层级某月的某类设备(空调、照明、电脑)用电占比'
    },
    {
        name: 'findDeviceCategoryConsumptionByYear',
        method: 'post',
        url: URL('/homeCommunity/findDeviceCategoryConsumptionByYear'),
        docs: '能源管理--分类用电--获取全部层级某年的某类设备(空调、照明、电脑)用电占比'
    },
    {
        name: 'findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay',
        method: 'post',
        url: URL('/homeCommunity/findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay'),
        docs: '能源管理--分类用电--获取天的每小时随机多层级分类统计数据'
    },
    {
        name: 'findMonthCategoryStatisticsDetailsByRandomLevelIdsAndMonth',
        method: 'post',
        url: URL('/homeCommunity/findMonthCategoryStatisticsDetailsByRandomLevelIdsAndMonth'),
        docs: '能源管理--分类用电--获取月的每天随机多层级分类统计数据'
    },
    {
        name: 'findYearCategoryStatisticsDetailsByRandomLevelIdsAndYear',
        method: 'post',
        url: URL('/homeCommunity/findYearCategoryStatisticsDetailsByRandomLevelIdsAndYear'),
        docs: '能源管理--分类用电--获取年的每月随机多层级分类统计数据'
    },
    {
        name: 'findHomeCommunityPowerSumByRandomLevelIdsAndDataType',
        method: 'post',
        url: URL('/homeCommunity/findHomeCommunityPowerSumByRandomLevelIdsAndDataType'),
        docs: '能源管理--发电分析--获取各个箱子的发电数据（预测发电量，实际发电量，相差）'
    },
    {
        name: 'findWeatherStationByDays',
        method: 'get',
        url: URL('/homeCommunity/findWeatherStationByDays'),
        docs: '能源管理--发电分析--获取天气数据（辐照度和温度）'
    },
    {
        name: 'findDayStatisticsDetailsByLevelIdsAndDay',
        method: 'post',
        url: URL('/homeCommunity/findDayStatisticsDetailsByLevelIdsAndDay'),
        docs: '能源管理--能源信息--获取多个层级天的每小时层级统计数据'
    },
    {
        name: 'findMonthStatisticsDetailsByLevelIdsAndMonth',
        method: 'post',
        url: URL('/homeCommunity/findMonthStatisticsDetailsByLevelIdsAndMonth'),
        docs: '能源管理--能源信息--获取多个层级月的每天层级统计数据'
    },
    {
        name: 'findYearStatisticsDetailsByLevelIdsAndYear',
        method: 'post',
        url: URL('/homeCommunity/findYearStatisticsDetailsByLevelIdsAndYear'),
        docs: '能源管理--能源信息--获取多个层级年的每月层级统计数据'
    },
    {
        name: 'findHomeCommunityPowerSumByLevelIdAndDataType',
        method: 'post',
        url: URL('/homeCommunity/findHomeCommunityPowerSumByLevelIdAndDataType'),
        docs: '能源管理--能源曲线--获取某个层级某天的类型（发/储/用/网）功率之和'
    },
    {
        name: 'findPowerByLevelIdsAndDate',
        method: 'post',
        url: URL('/homeCommunity/findPowerByLevelIdsAndDate'),
        docs: '能源管理--能源曲线--获取多个层级（社区/分中心）的发、储、并、用的每分钟功率'
    },
    {
        name: 'findSubareaConsumptionByMonth',
        method: 'get',
        url: URL('/homeCommunity/findSubareaConsumptionByMonth'),
        docs: '能源管理--分区用电--获取某月的总用电、人均用电、单位面积用电'
    },
    {
        name: 'findSubareaConsumptionByYear',
        method: 'get',
        url: URL('/homeCommunity/findSubareaConsumptionByYear'),
        docs: '能源管理--分区用电--获取某年的总用电、人均用电、单位面积用电'
    },
    {
        name: 'findDayStatisticsDetailsByRandomLevelIdsAndDay',
        method: 'post',
        url: URL('/homeCommunity/findDayStatisticsDetailsByRandomLevelIdsAndDay'),
        docs: '能源管理--分区用电--获取多个层级天的每小时随机的多个层级统计数据'
    },
    {
        name: 'findMonthStatisticsDetailsByRandomLevelIdsAndMonth',
        method: 'post',
        url: URL('/homeCommunity/findMonthStatisticsDetailsByRandomLevelIdsAndMonth'),
        docs: '能源管理--分区用电--获取多个层级月的每小时随机的多个层级统计数据'
    },
    {
        name: 'findYearStatisticsDetailsByRandomLevelIdsAndYear',
        method: 'post',
        url: URL('/homeCommunity/findYearStatisticsDetailsByRandomLevelIdsAndYear'),
        docs: '能源管理--分区用电--获取多个层级年的每小时随机的多个层级统计数据'
    },
    {
        name: 'findWeatherMonitoringByFrameDatetimeBetween',
        method: 'get',
        url: URL('/homeCommunity/findWeatherMonitoringByFrameDatetimeBetween'),
        docs: '环境监测--气象监测--所用到温度辐照度和风的数据'
    },
    {
        name: 'findIrrationalConsumptionByLevelIdAndDays',
        method: 'get',
        url: URL('/homeCommunity/findIrrationalConsumptionByLevelIdAndDays'),
        docs: '数据查询--不合理用电查询--所用到的数据'
    },
    {
        name: 'findAllDeviceInfoByAreaLevelId',
        method: 'get',
        url: URL('/homeCommunity/findAllDeviceInfoByAreaLevelId'),
        docs: '系统管理--工程管理--通过区域id获取对应区域设备信息'
    },
    {
        name: 'updateDeviceAddressByDeviceId',
        method: 'get',
        url: URL('/homeCommunity/updateDeviceAddressByDeviceId'),
        docs: '系统管理--工程管理--传设备id和设备地址修改信息'
    },
]
export {
    apiList
}