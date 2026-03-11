
import request from '@/utils/request'
import 	{dateStandardFormat} from "@/utils/date-format"
// 1、查询每日收益
export const findBenefitPerDayByDays = (year,month) => {

  return request({
    url: `/api/dcdcbams/findBenefitPerDayByDays?deviceId=1&year=${year}&month=${month}`,
    method: 'get'
    
  })
}


// 查询每月收益
export const findBenefitPerMonthByDays = (year) => {
  return request({
    url: `/api/dcdcbams/findBenefitPerMonthByDays?deviceId=1&year=${year}`,
    method: 'get'
    
  })
}

// 查询每年收益
export const findBenefitPerYear = () => {
  return request({
    url: '/api/dcdcbams/findBenefitPerYear?deviceId=1',
    method: 'get'
    
  })
}

export const findBenefitTodayByDay = (date) => {
  return request({
    url: `/api/dcdcbams/findBenefitTodayByDay?deviceId=1&day=${dateStandardFormat(date)}`,
    method: 'get'
    
  })
}


export const findLately50Status = () => {
  return request({
    url: `/api/dcdcbams/findLately50Status?deviceId=1`,
    method: 'get'
    
  })
}