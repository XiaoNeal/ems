const digit = (value:number|string, length = 2) => {
    if(typeof value === 'undefined' || value === null || String(value).length >= length) {
        return value
    }
    return (Array(length).join('0') + value).slice(-length)
}

// 格式化日期 默认到秒
export const dateFormatterSec = (time:string, format = 'yyyy-MM-dd HH:mm:ss') => {
    if(!time) return ''
    const date = new Date(time)
    const ymd = [
        digit(date.getFullYear(), 4),
        digit(date.getMonth() + 1),
        digit(date.getDate())
    ]
    const hms = [
        digit(date.getHours()),
        digit(date.getMinutes()),
        digit(date.getSeconds()),

    ]
    return format
    .replace(/yyyy/g, ymd[0].toString())
    .replace(/MM/g, ymd[1].toString())
    .replace(/dd/g, ymd[2].toString())
    .replace(/HH/g, hms[0].toString())
    .replace(/mm/g, hms[1].toString())
    .replace(/ss/g, hms[2].toString())
}

// 格式化日期 默认到毫秒
export const dateFormatter = (time:string, format = 'yyyy-MM-dd HH:mm:ss:SSS') => {
    if(!time) return ''
    const date = new Date(time)
    const ymd = [
        digit(date.getFullYear(), 4),
        digit(date.getMonth() + 1),
        digit(date.getDate())
    ]
    const hmss = [
        digit(date.getHours()),
        digit(date.getMinutes()),
        digit(date.getSeconds()),
        digit(date.getMilliseconds())
    ]
    return format
    .replace(/yyyy/g, ymd[0].toString())
    .replace(/MM/g, ymd[1].toString())
    .replace(/dd/g, ymd[2].toString())
    .replace(/HH/g, hmss[0].toString())
    .replace(/mm/g, hmss[1].toString())
    .replace(/ss/g, hmss[2].toString())
    .replace(/SSS/g, hmss[3].toString())
}

// 日期只取日月年
export const dateYMD = (time:string, format = 'yyyy-MM-dd') => {
    if(!time) return ''
    const date = new Date(time)
    const ymd = [
        digit(date.getFullYear(), 4),
        digit(date.getMonth() + 1),
        digit(date.getDate())
    ]
  
    return format
    .replace(/yyyy/g, ymd[0].toString())
    .replace(/MM/g, ymd[1].toString())
    .replace(/dd/g, ymd[2].toString())
}