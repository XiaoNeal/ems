// 此文件暴露接口方法可以直接调用
import request from '@/utils/request'
import { DATA } from '@/utils/forSpringBoot' //SPRINGBOOT接口拼接
const { apiList } = require('./description')
var api = {}
apiList.forEach(item => {
    // GET
    if (item.method === "get") {
        api[item.name] = function(params) {
            return request({
                url: item.url,
                method: item.method,
                params,
            })
        } 
    }
    // POST
    if (item.method === "post") {
        api[item.name] = function(data) {
            return request({
                url: item.url,
                method: item.method,
                data: DATA(data),
            })
        }
    }
});
export default api