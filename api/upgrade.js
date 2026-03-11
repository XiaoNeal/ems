/**
 * energy模块所用到的接口封装
 */
 import request from '@/utils/request'
 import { URL, DATA, FORMDATA } from '@/utils/forSpringBoot'

 const upgrade = {
    /**
     * =====架构图=====
     *  */
    //日发用电量及收益数据
    findDayEnergyAndIncome(params) {
        return request({
            url: URL('/homeCommunity/findDayEnergyAndIncome'),
            method: 'GET',
            params
        })
    },

    //月发用电及收益数据
    findMonthEnergyAndIncome(params) {
        return request({
            url: URL('/homeCommunity/findMonthEnergyAndIncome'),
            method: 'GET',
            params
        })
    },

    //年发用电及收益数据
    findYearEnergyAndIncome(params) {
        return request({
            url: URL('/homeCommunity/findYearEnergyAndIncome'),
            method: 'GET',
            params
        })
    },

    /**
     * =====光伏管理=====
     *  */
    //基本数据
    findPhotovoltaicEnergyInfo() {
        return request({
            url: URL('/homeCommunity/findPhotovoltaicEnergyInfo'),
            method: 'GET',
        })
    },

    //日月年详细曲线数据
    findDayProvideQAndPower(params) {
        return request({
            url: URL('/homeCommunity/findDayProvideQAndPower'),
            method: 'GET',
            params
        })
    },

    findMonthProvideQAndPower(params) {
        return request({
            url: URL('/homeCommunity/findMonthProvideQAndPower'),
            method: 'GET',
            params
        })
    },

    findYearProvideQAndPower(params) {
        return request({
            url: URL('/homeCommunity/findYearProvideQAndPower'),
            method: 'GET',
            params
        })
    },

    /**
     * =====储能管理=====
     *  */
    //基本数据
    findEnergyStorageInfo() {
        return request({
            url: URL('/homeCommunity/findEnergyStorageInfo'),
            method: 'GET',
            
        })
    },

    findDayStorageQAndPower(params) {
        return request({
            url: URL('/homeCommunity/findDayStorageQAndPower'),
            method: 'GET',
            params
        })
    },

    findMonthStorageQAndPower(params) {
        return request({
            url: URL('/homeCommunity/findDayStorageQAndPower'),
            method: 'GET',
            params
        })
    },

    findYearStorageQAndPower(params) {
        return request({
            url: URL('/homeCommunity/findYearStorageQAndPower'),
            method: 'GET',
            params
        })
    },

    /**
     * =====报警分析=====
     *  */
    //报警信息统计
    findDayAlarmInfoCount(params) {
        return request({
            url: URL('/homeCommunity/findDayAlarmInfoCount'),
            method: 'GET',
            params
        }) 
    },

    findMonthAlarmInfoCount(params) {
        return request({
            url: URL('/homeCommunity/findMonthAlarmInfoCount'),
            method: 'GET',
            params
        }) 
    },

    findYearAlarmInfoCount(params) {
        return request({
            url: URL('/homeCommunity/findYearAlarmInfoCount'),
            method: 'GET',
            params
        }) 
    },

    findDayAreaAlarmInfoCount(params) {
        return request({
            url: URL('/homeCommunity/findDayAreaAlarmInfoCount'),
            method: 'GET',
            params
        }) 
    },

    findMonthAreaAlarmInfoCount(params) {
        return request({
            url: URL('/homeCommunity/findMonthAreaAlarmInfoCount'),
            method: 'GET',
            params
        }) 
    },

    findYearAreaAlarmInfoCount(params) {
        return request({
            url: URL('/homeCommunity/findYearAreaAlarmInfoCount'),
            method: 'GET',
            params
        }) 
    },

    /**
     * =====系统=====
     *  */
    // 报警用户管理（查询所有报警用户信息）
    findAllAlarmUser() {
        return request({
            url: URL('/homeCommunity/findAllAlarmUser'),
            method: 'GET',
        }) 
    },

    // 报警用户管理（根据工程id查询报警用户信息）
    findAlarmUserByAreaId(params) {
        return request({
            url: URL('/homeCommunity/findAlarmUserByAreaId'),
            method: 'GET',
            params
        }) 
    },

    // 报警用户管理（添加报警用户信息）
    addAlarmUser(params) {
        return request({
            url: URL('/homeCommunity/addAlarmUser'),
            method: 'GET',
            params
        }) 
    },

    /**
     * =====虚拟电力局=====
     *  */
    // 所有设备柔度数据
    findDeviceFlexibilityInfo() {
        return request({
            url: URL('/homeCommunity/findDeviceFlexibilityInfo'),
            method: 'GET',
        })
    },

    // 系统柔度信息
    findSystemFlexibilityResponseInfo() {
        return request({
            url: URL('/homeCommunity/findSystemFlexibilityResponseInfo'),
            method: 'GET',
        })
    },

    //获取系统总响应及收益数据
    findDaySystemResponseAndIncomeInfo(params) {
        return request({
            url: URL('/homeCommunity/findDaySystemResponseAndIncomeInfo'),
            method: 'GET',
            params
        })
    },

    findMonthSystemResponseAndIncomeInfo(params) {
        return request({
            url: URL('/homeCommunity/findMonthSystemResponseAndIncomeInfo'),
            method: 'GET',
            params
        })
    },

    findYearSystemResponseAndIncomeInfo(params) {
        return request({
            url: URL('/homeCommunity/findYearSystemResponseAndIncomeInfo'),
            method: 'GET',
            params
        })
    },

    //获取虚拟电力局每小时收益曲线数据
    findEveryHourResponseIncome() {
        return request({
            url: URL('/homeCommunity/findEveryHourResponseIncome'),
            method: 'GET',
        })
    }

 }

 export default upgrade