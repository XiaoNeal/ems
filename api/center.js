import request from "../utils/request";
import getUrl from "../utils/get-url";

const center = {
    /**
     * 获取社区所有节点列表
     */
    getCenterList(params){
        return request({
            url: getUrl("/center/getCenterList"),
            method: 'get',
            params
        })
    },
    /**
     * 根据层级获取社区所有节点列表
     */
    getCenterListByLevel(params){
        return request({
            url: getUrl("/center/getCenterListByLevel"),
            method: 'get',
            params
        })
    },
    /**
     * 更新分中心节点信息
     */
    updateCenter(data){
        return request({
            url: getUrl("/center/updateCenter"),
            method: 'post',
            data
        })
    },
    /**
     * 创建分中心节点信息
     */
    createCenter(data){
        return request({
            url: getUrl("/center/createCenter"),
            method: 'post',
            data
        })
    },
    /**
     * 删除分中心节点信息
     */
    removeCenter(params){
        return request({
            url: getUrl("/center/removeCenter"),
            method: 'get',
            params
        })
    },
    /**
     * 根据选择区域的id获取该区域下的全部设备信息
     */
    findDeviceInfoByAreaLevelId(params){
        return request({
            url: getUrl("/center/findDeviceInfoByAreaLevelId"),
            method: 'get',
            params
        })
    },
}


export default center;