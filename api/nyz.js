import request from '@/utils/request'
const getNyzUrl = (url) => {
    return  `/shequApi/shangHaiZYNYL/` + url

    // if (process.env.NODE_ENV === "development") {
    //     return location.origin + `/nyzkoa` + url;
    // } else {
    //     return location.origin + `/shequKoa` + url
    // }
}

const nyz = {
    /**
     * 查询指定设备某天每小时的发电量、供馈电量、用电量
     */
    findEveryHourByDeviceIds(data) {
        return request({
            url: getNyzUrl("/findEveryHourByDeviceIds"),
            method: 'post',
            data:JSON.stringify({data:data})
        })
    },

    /**
     * 查询指定设备某月每天的发电量、供馈电量、用电量
     */
    findEveryDayByDeviceIds(data) {
        return request({
            url: getNyzUrl("/findEveryDayByDeviceIds"),
            method: 'post',
            data:JSON.stringify({data:data}) 
        })
    },

    /**
     * 查询指定设备某年每月的发电量、供馈电量、用电量
     */
    findEveryMonthByDeviceIds(data) {
        return request({
            url: getNyzUrl("/findEveryMonthByDeviceIds"),
            method: 'post',
            data:JSON.stringify({data:data})
        })
    },

    /**
     * 查询储能收益和光伏收益
     */
    findSOCAndPVIncome(dateType, areaLevelId, date) {
        let requestURI = ''
        let params = {}
        const d = new Date(date);
        if (dateType == 'hour') {
            requestURI = '/findEveryHourSOCAndPVIncome'
            params = { day:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
            , areaLevelId }
        } else if (dateType == 'day') {
            requestURI = '/findEveryDaySOCAndPVIncome'
            params = { year: d.getFullYear(), 
                month: String(d.getMonth()+1).padStart(2,'0'), areaLevelId }
        } else if (dateType == 'month') {
            requestURI = '/findEveryMonthSOCAndPVIncome'
            params = { year: new Date(date).getFullYear(), areaLevelId }
        } 

        return request({
            url: getNyzUrl(requestURI),
            method: 'GET',
            params
        })
    },

    /**
     * 查询储能收益和光伏收益
     */
     findAlarmRecord(dateType, date, areaLevelId) {
        let requestURI = ''
        const d = new Date(date);
        let params = {}
        if (dateType == 'date') {
            requestURI = '/findDayAlarmRecord'
            params = { day:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`, areaLevelId }
        } else if (dateType == 'month') {
            requestURI = '/findMonthAlarmRecord'
            params = { year: d.getFullYear(), 
                month: String(d.getMonth()+1).padStart(2,'0'), areaLevelId }
        } else if (dateType == 'year') {
            requestURI = '/findYearAlarmRecord'
            params = { year: new Date(date).getFullYear(), areaLevelId }
        }

        return request({
            url: getNyzUrl(requestURI),
            method: 'GET',
            params
        })
    }
}

export default nyz;