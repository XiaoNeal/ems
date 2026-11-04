import DeviceBase from "./device-base.model"

export class Model170F extends DeviceBase {
    energyData
    stateData
    controlData

    constructor() {
        super()
        this.energyData = new EnergyData()
        this.stateData = new StateData()
        this.controlData = new ControlData()
    }

    getEnergyData(jsonData) {
        const data = jsonData.data || jsonData
        const fields = [
            'B0', 'B4', 'B8', 'B12', 'B16', 'B24', 'B28', 'B32', 'B36', 'B40',
            'B44', 'B46', 'B50', 'B54', 'B58', 'B62', 'B66', 'B68', 'B70', 'B72',
            'B76', 'B80', 'B82', 'B84', 'B86', 'B88', 'B90', 'B92', 'B94', 'B96',
            'B98', 'B100', 'B102', 'B104', 'B106', 'B108', 'B110', 'B112', 'B114',
            'B116', 'B118', 'B120', 'B122', 'B124', 'B126', 'B128', 'B130', 'B132',
            'B134', 'B136', 'B138', 'B140', 'B142', 'B144', 'B146', 'B148', 'B150',
            'B152', 'B154', 'B158', 'B162', 'B166', 'B170', 'B174', 'B178'
        ]
        for (const key of fields) {
            if (this.energyData[key] && data[key] != null && data[key] !== '' && data[key] !== '--') {
                this.energyData[key].value = data[key]
            }
        }
    }

    getStatusData(jsonData) {
        const data = jsonData.data || jsonData
        for (const key in data) {
            if (this.stateData.hasOwnProperty(key) && this.stateData[key]) {
                this.stateData[key].value = data[key]
            }
        }
    }
}

class EnergyData {
    B0 = { name: '光伏（实时功率）', value: '--', unit: 'kW' }
    B4 = { name: '电网（实时功率）', value: '--', unit: 'kW' }
    B8 = { name: '储能（实时功率）', value: '--', unit: 'kW' }
    B12 = { name: '负荷功率（实时功率）', value: '--', unit: 'kW' }
    B16 = { name: '柔性直流空调(总功率，实时)', value: '--', unit: 'kW' }
    B24 = { name: '柔性直流充电桩(分支功率，实时)', value: '--', unit: 'kW' }
    B28 = { name: '照明(分支功率，实时)', value: '--', unit: 'kW' }
    B32 = { name: '今日发电', value: '--', unit: 'kWh' }
    B36 = { name: '今日用电', value: '--', unit: 'kWh' }
    B40 = { name: '电网供电', value: '--', unit: 'kWh' }
    B44 = { name: '储能剩余电量', value: '--', unit: 'kWh' }
    B46 = { name: '总馈电量', value: '--', unit: 'kWh' }
    B50 = { name: '日最高发电量', value: '--', unit: 'kWh' }
    B54 = { name: '历史最高发电功率', value: '--', unit: 'kWh' }
    B58 = { name: '累计发电量', value: '--', unit: 'kWh' }
    B62 = { name: '累计发电时长', value: '--', unit: '天' }
    B66 = { name: 'SOC', value: '--', unit: '%' }
    B68 = { name: '剩余电量预计可用小时', value: '--', unit: '小时' }
    B70 = { name: '充放电比', value: '--' }
    B72 = { name: '日最高充电量', value: '--', unit: 'kWh' }
    B76 = { name: '日最高放电量', value: '--', unit: 'kWh' }
    B80 = { name: '放电达成率（日）', value: '--', unit: '%' }
    B82 = { name: '已接设备数', value: '--' }
    B84 = { name: '空调数量', value: '--' }
    B86 = { name: '照明数量', value: '--' }
    B88 = { name: '充电桩数量', value: '--' }
    B90 = { name: '未知设备数量', value: '--' }
    B92 = { name: '柔度(能源站)', value: '--', unit: '%' }
    B94 = { name: '负载率(总)', value: '--', unit: '%' }
    B96 = { name: '能效水平(总)', value: '--', unit: '%' }
    B98 = { name: '柔度(设备1)', value: '--', unit: '%' }
    B100 = { name: '负载率(设备1)', value: '--', unit: '%' }
    B102 = { name: '能效水平(设备1)', value: '--', unit: '%' }
    B104 = { name: '柔度(设备2)', value: '--', unit: '%' }
    B106 = { name: '负载率(设备2)', value: '--', unit: '%' }
    B108 = { name: '能效水平(设备2)', value: '--', unit: '%' }
    B110 = { name: '柔度(设备3)', value: '--', unit: '%' }
    B112 = { name: '负载率(设备3)', value: '--', unit: '%' }
    B114 = { name: '能效水平(设备3)', value: '--', unit: '%' }
    B116 = { name: '柔度(设备4)', value: '--', unit: '%' }
    B118 = { name: '负载率(设备4)', value: '--', unit: '%' }
    B120 = { name: '能效水平(设备4)', value: '--', unit: '%' }
    B122 = { name: '柔度(设备5)', value: '--', unit: '%' }
    B124 = { name: '负载率(设备5)', value: '--', unit: '%' }
    B126 = { name: '能效水平(设备5)', value: '--', unit: '%' }
    B128 = { name: '柔度(设备6)', value: '--', unit: '%' }
    B130 = { name: '负载率(设备6)', value: '--', unit: '%' }
    B132 = { name: '能效水平(设备6)', value: '--', unit: '%' }
    B134 = { name: '柔度(设备7)', value: '--', unit: '%' }
    B136 = { name: '负载率(设备7)', value: '--', unit: '%' }
    B138 = { name: '能效水平(设备7)', value: '--', unit: '%' }
    B140 = { name: '柔度(设备8)', value: '--', unit: '%' }
    B142 = { name: '负载率(设备8)', value: '--', unit: '%' }
    B144 = { name: '能效水平(设备8)', value: '--', unit: '%' }
    B146 = { name: '柔度(设备9)', value: '--', unit: '%' }
    B148 = { name: '负载率(设备9)', value: '--', unit: '%' }
    B150 = { name: '能效水平(设备9)', value: '--', unit: '%' }
    B152 = { name: '照明数量', value: '--' }
    B154 = { name: '设备响应能力（1）', value: '--' }
    B158 = { name: '设备响应能力（2）', value: '--' }
    B162 = { name: '设备响应能力（3）', value: '--' }
    B166 = { name: '设备响应能力（4）', value: '--' }
    B170 = { name: '设备响应能力（5）', value: '--' }
    B174 = { name: '设备响应能力（6）', value: '--' }
    B178 = { name: '总功率曲线', value: '--' }
}

class StateData {
}

class ControlData {
}
