import DeviceBase from "./device-base.model"

export class Model1312v1_1 extends DeviceBase {
    constructor() {
        super();
        this.energyData = new EnergyData()
        this.statusData = new StatusData()
    }

    getEnergyData(jsonData) {

    }

    getStatusData(jsonData) {
        this.statusData.warningLevel.value = EnumWarningLevel[jsonData.data.B0] || jsonData.data.B0
        this.statusData.faultType.value = EnumFaultType[jsonData.data.B2] || jsonData.data.B2
        this.statusData.startType.value = jsonData.data.B4
        this.statusData.subvalveCondition.value = EnumSubvalveCondition[jsonData.data.B6] || jsonData.data.B6
        this.statusData.messageCounter.value = jsonData.data.B8
    }
}

class EnergyData {

}

class StatusData {
    warningLevel = { name: '预警级别', value: '--' }
    faultType = { name: '故障类型', value: '--' }
    startType = { name: '启动类型', value: '--' }
    subvalveCondition = { name: '子阀门状态', value: '--' }
    messageCounter = { name: '消息计数器', value: '--' }
}

// 预警级别
const EnumWarningLevel = {
    '0': '系统正常',
    '3': '一级预警',
    '4': '二级预警'
}

// 故障类型
const EnumFaultType = {
    '0': '无故障',
    '1': 'BIES已启动（灭火器启动）',
    '2': 'CAN1通讯故障',
    '3': '抑制装置故障',
    '4': '探测器故障（包括单箱离线故障和探测器故障）',
    '5': '探测器故障（离线故障）',
    '6': '探测器故障（传感器故障）',
    '7': '抑制装置故障（备电故障）',
    '8': '抑制装置故障（灭火器压力故障）'
}

// 启动类型
const EnumStartType = {
    '0000': '预留',
    '0001': '预留',
    '0002': '自动：火情4级，上级设备控制启动',
    '0003': '自动：火情4级，探测器自检测启动',
    '0004': '手动：强制控制，上级设备控制启动',
    '0005': '手动：强制控制，探测器自检测启动',
    '0006': '探测器失控启动',
    '0007': '预留',
    '00FF': '探测器无灭火器或子阀门控制时，在虚拟控制灭火弹时发送此0Xff,告知上级设备应备份数据'
}

// 子阀门状态
const EnumSubvalveCondition = {
    '0': '子阀关闭',
    '1': '子阀打开'
}