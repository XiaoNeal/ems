<template>
    <view class="outer-container" style="padding:5px">

        <view class="header">
            <!-- <image class="building-img" src="https://serviceiems.gree.com/esOperation/img/gfw-background.252630dc.jpg"
                mode="widthFix"></image> -->
            <view class="title">
                <image src="./static/images/location.png" class="location-icon"></image>
                <text class="gradient-text">珠海·光伏未来屋社区</text>
                <view class="days-container">
                    <text class="days-label">运行天数</text>
                    <view class="days-counter">
                        <view class="days-number-wrapper">
                            <view class="days-number" v-for="(number, index) in runningDates" :key="index">
                                <text class="number-value">{{ number }}</text>
                                <view class="number-shadow"></view>
                            </view>
                        </view>
                    </view>
                    <text class="days-unit">天</text>
                </view>
            </view>
        </view>

        <!-- 统计数据卡片 -->
        <view class="stats-card">
            <view class="stats-item">
                <text class="stats-value">{{ yearTotalData.energyConsumption.int }}{{
                    yearTotalData.energyConsumption.dec }}</text>
                <text class="stats-unit">kWh</text>
                <text class="stats-desc">本年能源总能耗</text>
            </view>
            <view class="divider"></view>
            <view class="stats-item">
                <text class="stats-value">{{ yearTotalData.gridForward.int }}{{
                    yearTotalData.gridForward.dec }}</text>
                <text class="stats-unit">kWh</text>
                <text class="stats-desc">本年电网总供电</text>
            </view>
            <view class="divider"></view>
            <view class="stats-item">
                <text class="stats-value">{{ yearTotalData[carbonStats[0].key].int }}{{
                    yearTotalData[carbonStats[0].key].dec }}</text>
                <text class="stats-unit">千克标准煤</text>
                <text class="stats-desc">本年碳减排总量</text>
            </view>

            <view class="stats-item">
                <text class="stats-value">{{ yearTotalData[carbonStats[1].key].int }} {{
                    yearTotalData[carbonStats[1].key].dec }}</text>
                <text class="stats-unit">千克标准煤</text>
                <text class="stats-desc">本年碳排放总量</text>
            </view>
            <view class="divider"></view>
            <view class="stats-item stats-img">
                <text class="stats-value">{{ yearTotalData.generation.int }}{{
                    yearTotalData.generation.dec }}</text>
                <text class="stats-unit">kW</text>
                <text class="stats-desc">本年新能源发电</text>
            </view>
            <view class="divider"></view>
            <view class="stats-item stats-img">
                <text class="stats-value">{{ yearTotalData.storageCharge.int }}{{
                    yearTotalData.storageDischarge.dec }}</text>
                <text class="stats-unit">kW</text>
                <text class="stats-desc">本年储能充电</text>
            </view>
            <view class="stats-item stats-img">
                <text class="stats-value">{{ yearTotalData.storageDischarge.int }}{{
                    yearTotalData.storageDischarge.dec }}</text>
                <text class="stats-unit">kW</text>
                <text class="stats-desc">本年储能放电</text>
            </view>
        </view>




        <view style="background: #fff">


            <!-- 能源数据选项卡 -->
            <view class="tab-container">
                <view v-for="(item, index) in energyDataTabs" :key="index" class="tab"
                    :class="{ 'active': dateType == item.type }" @click="changeEnergyDataType(item.type)">
                    <view class="tab-label">{{ item.label }}</view>
                </view>
            </view>

            <!-- 能源数据监测标题 -->
            <view class="third-item">
                <view class="section-header">
                    <text class="section-title">能源数据监测</text>
                </view>
            </view>
            <view class="section-divider"></view>

            <!-- 用能结构 -->
            <view class="energy-structure-container card">
                <view class="section-header" style="padding:0 0 10px 0;">
                    <view class="flex items-center">
                        <text class="section-title" style="font-weight: unset;">用能结构</text>
                    </view>
                    <view class="section-unit">单位kWh(度)</view>
                </view>
                <view class="energy-grid"> <!-- 移除 grid-auto-fit 类，改用内部样式控制 -->
                    <view v-for="(item, index) in energyItems" :key="index" class="energy-card"
                        :style="{ '--card-color': item.color }">
                        <view class="card-header flex items-center">
                            <image :src="item.icon" class="card-icon" mode="aspectFit"></image>
                            <text class="energy-label">{{ item.label }}</text>
                        </view>
                        <view class="energy-value-container">
                            <text class="energy-value">{{ energyStructure[item.key] }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 光伏发电图表 -->
            <view class="chart-tab-bar">
                <view v-for="(tab, i) in ['光伏发电', '用电', '储能']" :key="i"
                    :class="['chart-tab-item', { active: activeChartTab === tab }]" @click="updatePhotoChart(tab)"
                    :style="{
                        backgroundColor: activeChartTab === tab ? '#4488FB' : 'white',
                        color: activeChartTab === tab ? 'white' : '#4488FB'
                    }">
                    {{ tab }}
                </view>
            </view>
            <view class="section-divider" style="margin:0 10px;background:#4488FB;"></view>
            <view class="chart-container ">
                <qiun-data-charts type="column" v-if="activeChartTab !== '储能'" :chartId="'photo-power-generate'"
                    :chartData="photoChartData" :ontouch="true" :canvas2d="canvas2d" :opts="photoChartOption"
                    class="chart-content"></qiun-data-charts>
                <qiun-data-charts type="area" v-if="activeChartTab === '储能'" :chartId="'storage-chart'"
                    :chartData="storageChartData" :opts="storageChartOption" :ontouch="true" :canvas2d="canvas2d"
                    class="chart-content"></qiun-data-charts>
            </view>

            <!-- 储能图表 -->
            <!-- <view class="chart-container">
            <view class="chart-header">
                <view class="flex items-center">
                    <text class="chart-title">储能</text>
                </view>
            </view> -->

            <!-- </view> -->




            <!-- 碳排放监测标题 -->
            <view class="third-item" style="margin-top: 10px;">
                <view class="section-header">
                    <text class="section-title">碳排放监测</text>

                </view>
            </view>
            <view class="section-divider"></view>

            <!-- 碳排放图表 -->
            <view class="carbon-chart card">
                <view class="chart-header">
                    <view class="flex items-center">
                        <text class="chart-title" style="font-weight: unset;">碳排放量</text>
                    </view>
                </view>
                <qiun-data-charts type="column" :chartId="'carbon-emisson-chart'" :chartData="carbonChartData"
                    :ontouch="true" :canvas2d="canvas2d" :opts="carbonChartOption"
                    class="chart-content"></qiun-data-charts>
            </view>

            <!-- 各排放源碳排放量 -->
            <view class="emission-source card">
                <view class="section-header" style="padding:0 0 10px 0;">
                    <view class="flex items-center">
                        <text class="section-title" style="font-weight:unset">各排放源碳排放量</text>
                    </view>
                    <text class="section-unit">单位：千克</text>

                </view>
                <view class="energy-grid">
                    <view class="energy-card" :style="{ '--item-color': '#409EFF' }">
                        <text class="energy-label">市电</text>
                        <text class="energy-value">{{ carbonEmission.electricity }}</text>
                        <text class="energy-unit">{{ carbonEmission.electricityPercent }}%</text>
                    </view>
                    <view class="energy-card" :style="{ '--item-color': '#E6A23C' }">
                        <text class="energy-label">汽油</text>
                        <text class="energy-value">{{ carbonEmission.oil }}</text>
                        <text class="energy-unit">{{ carbonEmission.oilPercent }}%</text>
                    </view>
                </view>
            </view>

            <!-- 社会贡献 -->
            <view class="social-contribution card">
                <view class="section-header">
                    <view class="flex items-center">
                        <text class="section-title" style="font-weight: unset;">社会贡献</text>
                    </view>

                </view>
                <view class="contribution-content">
                    <view class="card-container">
                        <view class="icon-container">
                            <image src="./static/images/tree.png" class="icon"></image>
                        </view>
                        <view class="data-container">
                            <view class="contribution-item">
                                <view class="item-left">
                                    <text class="contribution-label">节约标准煤</text>
                                    <text class="contribution-unit">单位：千克</text>
                                </view>
                                <view class="item-right">
                                    <text class="contribution-value">{{ contribution.coalSaving }}</text>
                                </view>
                            </view>
                            <view class="item-divider"></view>
                            <view class="contribution-item">
                                <view class="item-left">
                                    <text class="contribution-label">等效植树量</text>
                                    <text class="contribution-unit">单位：棵</text>
                                </view>
                                <view class="item-right">
                                    <text class="contribution-value">{{ contribution.plantingAmout }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 系统低碳指标 -->
            <view class="low-carbon-indicators card" style="padding: unset;">
                <view class="section-header" style="padding: 10px;padding-bottom:unset">
                    <view class="flex items-center">
                        <text class="section-title" style="font-weight: unset">系统低碳指标</text>
                    </view>

                </view>
                <view class="indicators-content">

                    <qiun-data-charts type="gauge" :chartId="'dashboard'" :chartData="dashboardChartData"
                        :opts="dashboardChartOption" :ontouch="true" :canvas2d="canvas2d" class="indicator-chart"
                        style="max-width: calc(45% - 10rpx);height:220rpx "></qiun-data-charts>
                    <qiun-data-charts type="radar" :chartId="'radar-chart'" :opts="radarChartOption"
                        :chartData="radarChartData" :ontouch="true" :canvas2d="canvas2d" class="indicator-chart"
                        style="max-width: calc(55% - 10rpx) "></qiun-data-charts>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// import { ammeterList } from './devices'
// import nyz from '@/api/nyz'
import nyz_new from '@/api/nyz_new'
import energy from '@/api/energy'
import energy_new from '@/api/energy_new'
import {
    dateStandardFormat,
} from "@/utils/date-format"
import { mapGetters } from 'vuex';


export default {
    data() {
        return {
            canvas2d: this.$Config.ISCANVAS2D,
            carbonStats: [
                {
                    title: '本年碳减排总量',
                    key: 'carbonReduction',
                    unit: '千克',
                    color: '#00ffaa'
                },
                {
                    title: '本年碳排放总量',
                    key: 'carbonEmission',
                    unit: '千克',
                    color: '#ff6666'
                }
            ],
            energyDataTabs: [
                { type: 'date', label: '日', color: '#00ffff' },
                { type: 'month', label: '月', color: '#00ffaa' },
                { type: 'year', label: '年', color: '#0099ff' }
            ],
            energyConsumptionData: {
                title: '本年能源总能耗',
                value: 'yearTotalData.energyConsumption',
                unit: '吨标准煤',
                color: '#00ffff'
            },
            energyStats: [
                { key: 'generation', title: '本年新能源发电', unit: 'kWh' },
                { key: 'storageCharge', title: '本年储能充电', unit: 'kWh' },
                { key: 'storageDischarge', title: '本年储能放电', unit: 'kWh' }
            ],
            energyItems: [
                { label: '电网', key: 'grid', unit: 'kWh', color: '#00ffff', icon: './static/images/power-grid.png' },
                { label: '光伏', key: 'greenElectricity', unit: 'kWh', color: '#00ffaa', icon: './static/images/PV.png' },
                { label: '用电', key: 'consumption', unit: 'kWh', color: '#0099ff', icon: './static/images/load.png' },
                { label: '储能', key: 'soc', unit: 'kWh', color: '#ff9900', icon: './static/images/ES.png' },
                { label: '备电', key: 'bankup', unit: 'kWh', color: '#ff9900', icon: './static/images/backup-power.png' }
            ],
            // 定时器
            dataInterval: null,
            nowYear: new Date().getFullYear(),
            // 日期类型
            dateType: "date",
            // 本年数据
            yearTotalData: {
                energyConsumption: { int: '--', dec: '' },
                generation: { int: '--', dec: '' },
                storageCharge: { int: '--', dec: '' },
                storageDischarge: { int: '--', dec: '' },
                carbonEmission: { int: '--', dec: '' },
                carbonReduction: { int: '--', dec: '' },
                gridForward: { int: '--', dec: '' },
                gridReverse: { int: '--', dec: '' },
            },
            // 用能结构
            energyStructure: {
                grid: "--",
                greenElectricity: "--",
                consumption: "--",
                soc: "--",
                bankup: '--'
            },
            // 碳排因子
            carbonFactor: {},
            // 碳排放量
            carbonEmission: {
                electricity: "--",
                electricityPercent: 0,
                oil: "--",
                oilPercent: 0
            },
            // 社会贡献
            contribution: {
                coalSaving: "--",
                plantingAmout: "--"
            },
            // 图表
            radarChartOption: {
                color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [0, 0, 0, 0],
                dataLabel: true,
                dataPointShape: false,
                enableScroll: false,
                fontSize: 10,
                legend: {
                    show: false,

                },
                extra: {
                    radar: {
                        gridType: "radar",
                        gridColor: "#CCCCCC",
                        gridCount: 2,
                        opacity: 1,
                        max: 1,
                        labelShow: true,
                        linearType: "custom",
                        border: false,
                        axisLabel: true,
                    }
                }
            },
            radarChartData: {},

            dashboardChartOption: {
            },
            dashboardChartData: {
            },
            photoChartOption: {
                extra: {
                    column: {
                        type: "group",
                        width: 10,
                        activeBgColor: "#CDF8F0",
                        activeBgOpacity: 0.3,
                        linearType: "custom"
                    }
                },
                color: ["#CDF8F0", "#00ffaa"],
                padding: [15, 15, 0, 15],
                legend: {
                    show: true,
                    position: "top",
                    float: "center",
                    fontSize: 12,
                    margin: 5,
                    itemGap: 10
                },
                xAxis: {
                    disableGrid: true,
                    axisLineColor: "#0d2b60",
                    axisLabelColor: "#ffffff",
                    labelCount: 12,
                    fontSize: 10
                },
                yAxis: {
                    gridType: "dash",
                    dashLength: 2,
                    gridColor: "#CDF8F0",
                    splitNumber: 5,
                    showTitle: true,
                    data: [{

                        title: "单位:kWh"
                    }],
                    axisLabelColor: "#ffffff",
                    fontSize: 10
                },
                dataLabel: false,
                extra: {
                    column: {
                        // type: "group",
                        // width: 10,
                        // activeBgColor: "#00aaff",
                        // activeBgOpacity: 1,
                        // linearType: "custom"


                        type: "group",
                        width: 10,
                        // activeBgColor: "#000000",
                        activeBgOpacity: 0.08,
                        // customColor: ["#CDF8F0", "#F7CB6B"]
                    }
                },
            },
            photoChartData: {},
            storageChartData: {},
            storageChartOption: {
                color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [15, 15, 0, 15],
                enableScroll: false,
                legend: {},
                xAxis: {
                    disableGrid: true,
                    // boundaryGap: "justify",
                    // format: "xAxisDemo2",
                    labelCount: 6
                },
                yAxis: {
                    gridType: "dash",
                    dashLength: 2,
                    showTitle: true,
                    data: [{
                        position: "left",
                        title: "单位:kWh"
                    }],
                },
                extra: {
                    area: {
                        type: "curve",
                        opacity: 0.2,
                        addLine: false,
                        width: 2,
                        // gradient: true,
                        // activeType: "hollow"
                    }
                },

                dataLabel: false
            },
            carbonChartData: {},
            carbonChartOption: {
                dataLabel: false,
                color: ["#CDF8F0", "#F7CB6B", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [15, 15, 0, 5],
                enableScroll: false,
                legend: {},
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    gridType: "dash",
                    dashLength: 2,
                    showTitle: true,
                    data: [
                        {
                            min: 0,
                            title: '单位:千克'
                        }
                    ]
                },
                extra: {
                    column: {
                        type: "group",
                        width: 10,
                        activeBgColor: "#000000",
                        activeBgOpacity: 0.08,
                        customColor: ["#CDF8F0", "#F7CB6B"]
                    }
                }
            },
            photoData: {},
            activeChartTab: '光伏发电',
            storageBatteryRemain: 0,
            nyzStorageBatteryData: {
                charge: 53,
                discharge: 53,
                batterySum: 0 // 初始化 batterySum 属性
            },
        }
    },

    computed: {
        // 运行时长
        runningDates() {
            const startDate = this.currentSystem ? this.currentSystem.startDate : new Date().toISOString().split('T')[0];
            const days = this.$moment().diff(this.$moment(startDate), "day")
            return days.toString().padStart(4, '0').split('')
        },
        ...mapGetters([
            'currentSystem'
        ]),
        ammeterList() {
            return this.currentSystem ? this.currentSystem.ammeterList : [];
        },
    },

    methods: {

        // 初始化
        async initPage() {
            this.getYearData()

            let opt = await this.handleData(this.dateType)
            let opt2 = await this.handleNyzSolarData(this.dateType)
            await this.getStorageBatteryData()
            this.getEnergyData(opt, opt2)
            this.getCarbonData(opt, opt2)
            this.getCarbonIndexData(opt)
            this.getStorageRemainEnergy()


            // this.handleNyzSolarData('date')
        },


        // 更新光伏图表数据
        updatePhotoChart(type) {
            this.activeChartTab = type;

            let data = [];
            this.photoChartData.categories.map((item, index) => {
                if (this.dateType === 'date') {
                    data[item] = type === '光伏发电' ? this.photoData.solar[index] : this.photoData.electricity[index];
                    ;
                } else {
                    data[item - 1] = type === '光伏发电' ? this.photoData.solar[index] : this.photoData.electricity[index];
                }
            });

            this.photoChartData.series[0].name = type === '光伏发电' ? '光伏发电' : '用电'
            this.photoChartData.series[0].data = data;


        },

        async getYearData() {
            const boxids = this.currentSystem.boxidsbyYear
            const date = this.$moment().format('YYYY-MM-DD')
            const result = await energy_new.findYearStatisticsDetailsByLevelIdsAndYear(boxids, date)
            // 能源数据
            const sum = result.data.reduce((pre, curr) => {
                pre.solar += parseFloat(curr.total_provide_q)
                pre.charge += parseFloat(curr.total_storage_forward_q)
                pre.discharge += parseFloat(curr.total_storage_reverse_q)
                pre.electricity += parseFloat(curr.total_consume_electricity_q)
                pre.gridForward += parseFloat(curr.total_grid_forward_q)
                pre.gridReverse += parseFloat(curr.total_grid_reverse_q)
                return pre
            }, { solar: 0, charge: 0, discharge: 0, electricity: 0, gridForward: 0, gridReverse: 0 })
            try {
                const nyzResult = await this.handleNyzData('year')
                const nyzSolarResult = await this.handleNyzSolarData('year')
                const nyzConsumResult = await this.handleNyzConsumData('year')
                const nyzGridResult = await this.handleNyzGridData('year')

                const nyzSum = {
                    charge: nyzResult.charge.reduce((pre, curr) => pre += curr, 0),
                    discharge: nyzResult.discharge.reduce((pre, curr) => pre += curr, 0),
                    solar: nyzSolarResult.solar.reduce((pre, curr) => pre += curr, 0),
                    electricity: nyzConsumResult.electricity.reduce((pre, curr) => pre += curr, 0),
                    gridForward: nyzGridResult.gridForward.reduce((pre, curr) => pre += curr, 0),
                    gridReverse: nyzGridResult.gridReverse.reduce((pre, curr) => pre += curr, 0),
                }

                this.yearTotalData.storageCharge = this.getIntAndDec((sum.charge + nyzSum.charge).toFixed(2))
                this.yearTotalData.storageDischarge = this.getIntAndDec((sum.discharge + nyzSum.discharge).toFixed(2))
                this.yearTotalData.generation = this.getIntAndDec((sum.solar + nyzSum.solar).toFixed(2))
                const factorELE = this.carbonFactor.factorELE
                this.yearTotalData.carbonReduction = this.getIntAndDec(((sum.solar + nyzSum.solar) * factorELE).toFixed(2))
                this.yearTotalData.carbonEmission = this.getIntAndDec(((sum.electricity + nyzSum.electricity) * factorELE).toFixed(2))
                this.yearTotalData.energyConsumption = this.getIntAndDec((sum.electricity + nyzSum.electricity).toFixed(2))
                this.yearTotalData.gridForward = this.getIntAndDec((sum.gridForward + nyzSum.gridForward).toFixed(2))
                this.yearTotalData.gridReverse = this.getIntAndDec((sum.gridReverse + nyzSum.gridReverse).toFixed(2))
            } catch (err) {
                console.error(err)
                this.yearTotalData.storageCharge = this.getIntAndDec(sum.charge.toFixed(2))
                this.yearTotalData.storageDischarge = this.getIntAndDec(sum.discharge.toFixed(2))
            }


            console.log(result)
            // 碳排数据
            // let carbonOpt = new options.carbonOptions('year')
            const factorELE = this.carbonFactor.factorELE
            // this.yearTotalData.carbonEmission = this.getIntAndDec((sum.electricity*factorELE).toFixed(2))
            const temp = result.data.reduce((pre, curr) => {
                pre.time.push(curr.month)
                pre.solar.push(curr.total_provide_q)
                pre.electricity.push(curr.total_consume_electricity_q)
                return pre
            }, { time: [], solar: [], electricity: [] })

            const nyzConsumResult = await this.handleNyzConsumData('year')
            // 合并 nyzConsumResult.electricity 和 temp.electricity 的值
            if (nyzConsumResult && nyzConsumResult.electricity) {
                temp.electricity = temp.electricity.map((value, index) => {
                    const nyzValue = nyzConsumResult.electricity[index] || 0;
                    return parseFloat(value) + parseFloat(nyzValue);
                })
            }

            const nyzSolarResult = await this.handleNyzSolarData('year')
            // 合并 nyzSolarResult.solar 和 temp.solar 的值
            if (nyzSolarResult && nyzSolarResult.solar) {
                temp.solar = temp.solar.map((value, index) => {
                    const nyzValue = nyzSolarResult.solar[index] || 0;
                    return parseFloat(value) + parseFloat(nyzValue);
                });
            }

            const xAxis = this.xAxisFormat(temp.time, 'year')

            const solarArr = temp.solar.map(item => (item * factorELE).toFixed(2))
            const electricityArr = temp.electricity.map(item => (item * factorELE).toFixed(2))
            const solarData = []
            const electricityData = []
            xAxis.map((item, index) => {
                solarData[item - 1] = solarArr[index]
                electricityData[item - 1] = electricityArr[index]

            })


            this.carbonChartData = {
                categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                series: [
                    {
                        name: '碳减排',
                        data: solarData,

                    },
                    {
                        name: '碳排放',
                        data: electricityData,
                    }
                ],
            };
            console.log(this.carbonChartData, "-----", solarArr, electricityArr, temp)

            return

            // 碳排数据
            // let carbonOpt = new options.carbonOptions('year')
            // const factorELE = this.carbonFactor.factorELE
            // // this.yearTotalData.carbonEmission = this.getIntAndDec((sum.electricity*factorELE).toFixed(2))
            // const temp = result.data.reduce((pre, curr) => {
            //     pre.time.push(curr.month)
            //     pre.solar.push(curr.total_provide_q)
            //     pre.electricity.push(curr.total_consume_electricity_q)
            //     return pre
            // }, { time: [], solar: [], electricity: [] })

            // const nyzConsumResult = await this.handleNyzConsumData('year')
            // // 合并 nyzConsumResult.electricity 和 temp.electricity 的值
            // if (nyzConsumResult && nyzConsumResult.electricity) {
            //     temp.electricity = temp.electricity.map((value, index) => {
            //         const nyzValue = nyzConsumResult.electricity[index] || 0;
            //         return parseFloat(value) + parseFloat(nyzValue);
            //     })
            // }

            // const nyzSolarResult = await this.handleNyzSolarData('year')
            // // 合并 nyzSolarResult.solar 和 temp.solar 的值
            // if (nyzSolarResult && nyzSolarResult.solar) {
            //     temp.solar = temp.solar.map((value, index) => {
            //         const nyzValue = nyzSolarResult.solar[index] || 0;
            //         return parseFloat(value) + parseFloat(nyzValue);
            //     });
            // }

            // const xAxis = this.xAxisFormat(temp.time, 'year')
            // const solarArr = temp.solar.map(item => (item * factorELE).toFixed(2))
            // const electricityArr = temp.electricity.map(item => (item * factorELE).toFixed(2))
            // const solarData = []
            // const electricityData = []
            // xAxis.map((item, index) => {
            //     solarData[item - 1] = solarArr[index]
            //     electricityData[item - 1] = electricityArr[index]
            //     // this.carbonChartOption.series[0].data[item] = solarArr[index]
            //     // this.carbonChartOption.series[1].data[item] = electricityArr[index]
            // })
            // carbonOpt.title.subtext = "单位：kg"
            // carbonOpt.series[0].data = solarData
            // carbonOpt.series[1].data = electricityData
            // this.carbonChartOption = carbonOpt

        },


        async handleNyzConsumData(dateType) {
            try {
                const consumIdOne = this.ammeterList.find(item => item.deviceName == '1#负载DC直流表').deviceId
                const consumIdTwo = this.ammeterList.find(item => item.deviceName == '2#负载DC直流表').deviceId
                const consumIds = [consumIdOne, consumIdTwo]

                let result = []
                let nyzData = []

                const timeMap = {
                    'date': 'hour',
                    'month': 'date',
                    'year': 'month'
                }
                if (dateType == 'date') {
                    result = await energy_new.findEveryHourByDeviceIds({
                        deviceIds: consumIds,
                        day: this.$moment().format("YYYY-MM-DD"),
                    })
                } else if (dateType == 'month') {
                    result = await energy_new.findEveryDayByDeviceIds({
                        deviceIds: consumIds,
                        year: new Date().getFullYear(),
                        month: new Date().getMonth() + 1
                    })
                } else if (dateType == 'year') {
                    result = await energy_new.findEveryMonthByDeviceIds({
                        deviceIds: consumIds,
                        year: new Date().getFullYear()
                    })
                }
                console.log(result, "123123123112313213")
                nyzData = result.data.reduce((pre, curr) => {
                    pre.time.push(curr[timeMap[dateType]])
                    pre.electricity.push(curr.total_consume_electricity_q)
                    return pre
                }, { time: [], electricity: [] })

                return nyzData
            } catch (err) {
                console.error(err)
            }
        },


        async getStorageRemainEnergy() {
            const result = await nyz_new.getStorageRemainEnergy({ deviceId: this.currentSystem.storageDeviceid, start: this.$moment().format("YYYY-MM-DD 00:00:00"), end: this.$moment().format("YYYY-MM-DD 23:59:59"), intervalMinutes: 1, aggregationType: 'LAST' });
            if (result.data) {
                // this.storageChartOption = new options.storageOptions();
                let chartData = result.data.reduce((pre, curr) => {
                    pre.xAxis.push(this.$moment(curr.time).format('HH:mm'))
                    pre.battery.push(curr.battery_stack_power_available_electricity)
                    return pre
                }, { xAxis: [], battery: [] })
                // this.storageChartOption.xAxis[0].data = chartData.xAxis
                // this.storageChartOption.series[0].data = chartData.battery
                this.storageChartData = {
                    categories: chartData.xAxis,
                    series: [{
                        name: '剩余电量',
                        data: chartData.battery,
                    }


                    ]
                }
                // 获取 battery 数组的最后一个元素赋值给 storageBatteryRemain
                this.storageBatteryRemain = chartData.battery.at(-1) || 0;
            }
        },

        async getStorageBatteryData() {
            try {
                console.log(11111111111111111111)
                const storageIdOne = this.ammeterList.find(item => item.deviceName == '1#储能DC直流表').deviceId
                const storageIdTwo = this.ammeterList.find(item => item.deviceName == '2#储能DC直流表').deviceId
                const storageIds = [storageIdOne, storageIdTwo]

                let result = []
                let dateType = this.dateType

                if (dateType == 'date') {
                    await this.getStorageRemainEnergy(); // 调用折线图方法
                    result = await energy_new.findEveryHourByDeviceIds({
                        deviceIds: storageIds,
                        day: this.$moment().format("YYYY-MM-DD"),
                    })
                    const sumData = result.data.reduce((pre, curr) => {
                        pre.charge += parseFloat(curr.total_storage_forward_q)
                        pre.discharge += parseFloat(curr.total_storage_reverse_q)
                        return pre
                    }, { charge: 0, discharge: 0 })
                    this.nyzStorageBatteryData.charge = this.getIntAndDec(sumData.charge.toFixed(2))
                    this.nyzStorageBatteryData.discharge = this.getIntAndDec(sumData.discharge.toFixed(2))
                    // 计算电池充放电差值
                    this.nyzStorageBatteryData.batterySum = parseFloat((sumData.charge - sumData.discharge).toFixed(2))
                    this.energyStructure.soc = parseFloat((sumData.charge - sumData.discharge).toFixed(2))
                    return;
                } else if (dateType == 'month') {
                    result = await energy_new.findEveryDayByDeviceIds({
                        deviceIds: storageIds,
                        year: new Date().getFullYear(),
                        month: new Date().getMonth() + 1
                    })
                } else if (dateType == 'year') {
                    result = await energy_new.findEveryMonthByDeviceIds({
                        deviceIds: storageIds,
                        year: new Date().getFullYear()
                    })
                }
                // --- “月”和“年”视图的新逻辑开始 ---

                // 1. 初始化X轴标签和数据数组
                let xAxisData = [];
                let chargeData = [];
                let dischargeData = [];

                if (this.dateType === 'month') {
                    // 使用 moment.js 获取当前月份的天数，能正确处理闰年2月
                    const daysInMonth = this.$moment().daysInMonth();
                    for (let i = 1; i <= daysInMonth; i++) {
                        xAxisData.push(`${i}日`);
                        chargeData.push(0); // 填充0作为默认值
                        dischargeData.push(0); // 填充0作为默认值
                    }
                    result = await energy_new.findEveryDayByDeviceIds({
                        deviceIds: storageIds,
                        year: new Date().getFullYear(),
                        month: new Date().getMonth() + 1
                    });
                } else if (this.dateType === 'year') {
                    for (let i = 1; i <= 12; i++) {
                        xAxisData.push(`${i}月`);
                        chargeData.push(0); // 填充0作为默认值
                        dischargeData.push(0); // 填充0作为默认值
                    }
                    result = await energy_new.findEveryMonthByDeviceIds({
                        deviceIds: storageIds,
                        year: new Date().getFullYear()
                    });
                }

                // --- 核心修改开始 ---

                // 1. 创建一个 Set，用来存储从API返回的真实数据所对应的日期标签
                const validDataPoints = new Set();

                if (result.data) {
                    const timeMapKey = this.dateType === 'month' ? 'date' : 'month';
                    result.data.forEach(item => {
                        let index;
                        let label;

                        if (timeMapKey === 'date') {
                            const dayOfMonth = this.$moment(item.date).date();
                            index = dayOfMonth - 1;
                            label = `${dayOfMonth}日`;
                        } else {
                            index = item.month - 1;
                            label = `${item.month}月`;
                        }

                        // 2. 将这个标签添加到我们的“有效数据点”集合中
                        validDataPoints.add(label);

                        if (index >= 0 && index < xAxisData.length) {
                            chargeData[index] = parseFloat(item.total_storage_forward_q.toFixed(2));
                            dischargeData[index] = parseFloat(item.total_storage_reverse_q.toFixed(2));
                        }
                    });
                }

                // 3. 在创建图表配置实例时，将这个“有效数据点”集合传递过去
                // const storageOpt = new options.storageBarOptions(this.dateType, validDataPoints);

                // storageOpt.series[0].data = chargeData;
                // storageOpt.series[1].data = dischargeData;
                // storageOpt.xAxis[0].data = xAxisData;
                // this.storageChartOption = storageOpt;
                this.storageChartData = {
                    categories: xAxisData,
                    series: [{
                        name: '充电量',
                        data: chargeData,
                    },
                    {
                        name: '放电量',
                        data: dischargeData,
                    }


                    ]
                }

                const sumData = result.data.reduce((pre, curr) => {
                    pre.charge += parseFloat(curr.total_storage_forward_q)
                    pre.discharge += parseFloat(curr.total_storage_reverse_q)
                    return pre
                }, { charge: 0, discharge: 0 })

                this.nyzStorageBatteryData.charge = this.getIntAndDec(sumData.charge.toFixed(2))
                this.nyzStorageBatteryData.discharge = this.getIntAndDec(sumData.discharge.toFixed(2))
                // 计算电池充放电差值
                this.nyzStorageBatteryData.batterySum = parseFloat((sumData.charge - sumData.discharge).toFixed(2))
                this.energyStructure.soc = parseFloat((sumData.charge - sumData.discharge).toFixed(2))

            } catch (err) {
                console.error(err)
            }
        },




        async getEnergyData(opt, opt2) {
            // let opt = await this.handleData(this.dateType)
            // let opt2 = await this.handleNyzSolarData(this.dateType)
            let nyzSolar = []
            opt2.time.map((item, index) => {
                nyzSolar.push({ time: item, solar: opt2.solar[index] })
            })
            // opt.time.map((item, index) => {
            //     let idx = nyzSolar.findIndex(e => e.time == item)
            //     if (idx > -1) {
            //         opt.solar[index] = parseFloat((opt.solar[index] + nyzSolar[idx].solar).toFixed(2))
            //     }
            // })
            console.log(opt, opt2, "99999")
            opt.time.map((item, index) => {
                let idx = nyzSolar.findIndex(e => e.time == item)
                if (idx > -1) {
                    opt.solar[index] = parseFloat((opt.solar[index] + nyzSolar[idx].solar).toFixed(2))
                }
            })


            const filteredSolar = opt2.solar.filter(value => value !== null);
            const totalGreenEle = [...opt.solar, ...filteredSolar].reduce((pre, curr) => {
                return pre + parseFloat(curr)
            }, 0)
            let opt1 = await this.handleData(this.dateType)
            let opt3 = await this.handleNyzConsumData(this.dateType)

            let nyzConsum = []
            opt3.time.map((item, index) => {
                nyzConsum.push({ time: item, electricity: opt3.electricity[index] })
            })
            opt.time.map((item, index) => {
                let idx = nyzConsum.findIndex(e => e.time == item)
                if (idx > -1) {
                    opt.electricity[index] = parseFloat((opt.electricity[index] + nyzConsum[idx].electricity).toFixed(2))
                }
            })


            this.photoData = opt;


            let opt4 = await this.handleNyzGridData(this.dateType)
            // 过滤 opt3.electricity 中的 null 值
            const filteredElectricity = opt3.electricity.filter(value => value !== null);
            const totalEle = [...opt1.electricity, ...filteredElectricity].reduce((pre, curr) => {
                return pre + parseFloat(curr)
            }, 0)
            // const totalEle =  [...opt1.electricity, ...opt3.electricity].reduce((pre, curr) => {
            //     return pre + parseFloat(curr)
            // }, 0)

            const filteredGridForward = opt4.gridForward.filter(value => value !== null);
            const totalGrid = [...opt.grid, ...filteredGridForward].reduce((pre, curr) => {
                return pre + parseFloat(curr)
            }, 0)





            // 用能结构
            // const totalGreenEle = opt.solar.reduce((pre, curr) => pre += curr, 0)
            const totalWater = opt.water.reduce((pre, curr) => pre += curr, 0)
            this.energyStructure.grid = totalGrid.toFixed(2)
            this.energyStructure.greenElectricity = totalGreenEle.toFixed(2)
            // this.energyStructure.water = totalWater.toFixed(2)
            this.energyStructure.consumption = totalEle.toFixed(2)

            const xAxis = this.xAxisFormat(opt.time, this.dateType)
            let solarData = []
            let consumData = []
            xAxis.map((item, index) => {
                if (this.dateType == 'date') {
                    solarData[item] = opt.solar[index]
                    consumData[item] = opt.electricity[index]
                } else {
                    solarData[item - 1] = opt.solar[index]
                    consumData[item - 1] = opt.electricity[index]
                }
            })



            // 光伏图表
            let solarOpt = {
                categories: xAxis,
                series: [
                    {
                        name: '光伏',

                        data: [],
                        // color: '#91cc75'
                    }
                ]
            }
            solarOpt.series[0].data = solarData
            // solarOpt.series[1].data = consumData
            // this.photoChartOption = solarOpt


            // solarOpt.series[0].data = solarData
            this.photoChartData = solarOpt
            console.log(111111111111111111111, this.photoChartData)
            let storageOpt = {
                categories: [],
                series: [
                    {
                        name: '充电',

                        data: [],
                        // color: '#91cc75'
                    },
                    {
                        name: '放电',

                        data: [],
                        // color: '#ee6666'
                    }
                ]
            }


            // 储能图表
            // let storageOpt = new options.storageOptions(this.dateType)
            try {
                // this.storageChartOption = new options.storageOptions(this.dateType)
                const nyzdata = await this.handleNyzData(this.dateType)
                if (!nyzdata) {
                    const xAxis = this.xAxisFormat(opt.time, this.dateType)
                    const chargeData = []
                    const dischargeData = []
                    xAxis.map((item, index) => {
                        // this.storageChartOption.series[0].data[item] = opt.charge[index]
                        // this.storageChartOption.series[1].data[item] = opt.discharge[index]
                        if (this.dateType == 'date') {
                            chargeData[item] = opt.charge[index]
                            dischargeData[item] = opt.discharge[index]
                        } else {
                            chargeData[item - 1] = opt.charge[index]
                            dischargeData[item - 1] = opt.discharge[index]
                        }
                    })

                }
                let opt1 = []
                let opt2 = []
                opt.time.map((item, index) => {
                    opt1.push({
                        time: item,
                        charge: opt.charge[index],
                        discharge: opt.discharge[index]
                    })
                })
                nyzdata.time.map((item, index) => {
                    opt2.push({
                        time: item,
                        charge: nyzdata.charge[index],
                        discharge: nyzdata.discharge[index]
                    })
                })
                const mergedata = [...opt1, ...opt2].reduce((pre, curr) => {
                    const existing = pre.find(item => item.time == curr.time)
                    if (existing) {
                        existing.charge += curr.charge
                        existing.discharge += curr.discharge
                    } else {
                        pre.push({ ...curr })
                    }
                    return pre
                }, [])
                const timeArr = mergedata.map(item => item.time)
                const xAxis = this.xAxisFormat(timeArr, this.dateType)
                const chargeArr = mergedata.map(item => item.charge)
                const dischargeArr = mergedata.map(item => item.discharge)
                const chargeData = []
                const dischargeData = []
                xAxis.map((item, index) => {
                    // this.storageChartOption.series[0].data[item] = chargeArr[index]
                    // this.storageChartOption.series[1].data[item] = dischargeArr[index]
                    if (this.dateType == 'date') {
                        chargeData[item] = chargeArr[index]
                        dischargeData[item] = dischargeArr[index]
                    } else {
                        chargeData[item - 1] = chargeArr[index]
                        dischargeData[item - 1] = dischargeArr[index]
                    }
                })

                // storageOpt.categories = xAxis
                // storageOpt.series[0].data = chargeData
                // storageOpt.series[1].data = dischargeData
                // this.storageChartData = storageOpt
            } catch (err) {
                console.error(err)
            }
        },


        async handleNyzGridData(dateType) {
            try {
                const gridId = this.ammeterList.find(item => item.deviceName == '1#电网AC交流表').deviceId
                const gridIds = [gridId]
                let result = []
                let nyzData = []

                const timeMap = {
                    'date': 'hour',
                    'month': 'date',
                    'year': 'month'
                }
                if (dateType == 'date') {
                    result = await energy_new.findEveryHourByDeviceIds({
                        deviceIds: gridIds,
                        day: this.$moment().format("YYYY-MM-DD"),
                    })
                } else if (dateType == 'month') {
                    result = await energy_new.findEveryDayByDeviceIds({
                        deviceIds: gridIds,
                        year: new Date().getFullYear(),
                        month: new Date().getMonth() + 1
                    })
                } else if (dateType == 'year') {
                    result = await energy_new.findEveryMonthByDeviceIds({
                        deviceIds: gridIds,
                        year: new Date().getFullYear()
                    })
                }
                nyzData = result.data.reduce((pre, curr) => {
                    pre.time.push(curr[timeMap[dateType]])
                    pre.gridForward.push(curr.total_grid_forward_q)
                    pre.gridReverse.push(curr.total_grid_reverse_q)
                    return pre
                }, { time: [], gridForward: [], gridReverse: [] })

                return nyzData
            } catch (err) {
                console.error(err)
            }
        },


        async getCarbonData(opt, opt2) {
            // let opt = await this.handleData(this.dateType)
            let opt1 = await this.handleNyzConsumData(this.dateType)
            // 过滤 opt1.electricity 中的 null 值
            const filteredElectricity = opt1.electricity.filter(value => value !== null);
            const totalEle = [...opt.electricity, ...filteredElectricity].reduce((pre, curr) => {
                return pre + parseFloat(curr)
            }, 0)
            // const totalEle =  [...opt.electricity, ...opt1.electricity].reduce((pre, curr) => {
            //     return pre + parseFloat(curr)
            // }, 0)
            const factorELE = this.carbonFactor.factorELE
            const carbon_electricity = totalEle * factorELE
            const carbon_oil = 0
            this.carbonEmission.electricity = carbon_electricity.toFixed(2)
            this.carbonEmission.electricityPercent = (carbon_electricity / (carbon_electricity + carbon_oil) * 100).toFixed(1)

            // let opt2 = await this.handleNyzSolarData(this.carbonDataType)
            let nyzSolar = []
            opt2.time.map((item, index) => {
                nyzSolar.push({ time: item, solar: opt2.solar[index] })
            })
            opt.time.map((item, index) => {
                let idx = nyzSolar.findIndex(e => e.time == item)
                if (idx > -1) {
                    opt.solar[index] = parseFloat((opt.solar[index] + nyzSolar[idx].solar).toFixed(2))
                }
            })
            const totalSolar = opt.solar.reduce((pre, curr) => {
                return pre + parseFloat(curr)
            }, 0)
            // 等效植树量相关系数
            const caculatorCoefficient = 0.785
            // 单棵树日吸收CO₂量=5
            const treeFactor = 5
            const totalSaving = totalSolar * 400 / 1000
            //节约标准煤量（kgce）=发电量（kWh）×标准煤折算系数（kgce/kWh）
            let totalSavingKg = totalSolar * 400 / 1000000 * 1000
            this.contribution.coalSaving = totalSavingKg.toFixed(2)
            //等效植树数（棵）= (日均发电量（kWh/天）× 排放因子（kg CO₂/kWh）× 1000)/ 单棵树日吸收CO₂量(g/天)
            this.contribution.plantingAmout = (totalSolar * caculatorCoefficient / treeFactor).toFixed(2)
        },

        // 获取系统低碳指标
        async getCarbonIndexData(optl) {
            let opt = await this.handleData(this.dateType)
            console.log(opt, optl, "111343434341111111111111111")

            let opt1 = await this.handleNyzConsumData(this.dateType)
            let opt2 = await this.handleNyzSolarData(this.dateType)
            let nyzSolar = []
            opt2.time.map((item, index) => {
                nyzSolar.push({ time: item, solar: opt2.solar[index] })
            })
            opt.time.map((item, index) => {
                let idx = nyzSolar.findIndex(e => e.time == item)
                if (idx > -1) {
                    opt.solar[index] = parseFloat((opt.solar[index] + nyzSolar[idx].solar).toFixed(2))
                }
            })
            const total_solar = opt.solar.reduce((pre, curr) => {
                return pre += parseFloat(curr)
            }, 0)


            // 过滤 opt1.electricity 中的 null 值
            const filteredElectricity = opt1.electricity.filter(value => value !== null);
            const total_electricity = [...opt.electricity, ...filteredElectricity].reduce((pre, curr) => {
                return pre + parseFloat(curr)
            }, 0)

            const dailyCharge = this.nyzStorageBatteryData.charge.int + parseFloat(this.nyzStorageBatteryData.charge.dec);
            console.log(dailyCharge, this.nyzStorageBatteryData.charge)
            const percent = total_solar / (total_electricity + dailyCharge) * 100

            console.log(dailyCharge, total_solar, total_electricity, this.nyzStorageBatteryData.charge)
            const finalPercent = percent > 100 ? 100 : percent;
            // const percent = total_solar / total_electricity * 100
            this.dashboardChartOption = {
                color: ["red", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [30, 30, 30, 30],
                fontSize: 10,
                dataLabel: false,
                title: {
                    name: finalPercent.toFixed(2) + "%",
                    fontSize: 10,
                    color: "#2fc25b",
                    offsetY: 40
                },
                subtitle: {
                    name: "自给自足率",
                    fontSize: 10,
                    color: "#666666",
                    offsetY: 40
                },
                extra: {
                    gauge: {
                        type: "default",
                        width: 30,
                        labelColor: "#666666",
                        startAngle: 0.75,
                        endAngle: 0.25,
                        startNumber: 0,
                        endNumber: 100,
                        labelFormat: "",
                        splitLine: {
                            fixRadius: 0,
                            splitNumber: 10,
                            width: 30,
                            color: "#FFFFFF",
                            childNumber: 5,
                            childWidth: 12
                        },
                        pointer: {
                            width: 24,
                            color: "auto"
                        }
                    }
                }
            }

            this.dashboardChartData = {
                categories: [{ value: 0.15, color: "#f2f047" }, // 起始黄色
                { value: 0.30, color: "#d8e043" },
                { value: 0.45, color: "#b3d13f" },
                { value: 0.60, color: "#7fc23a" },
                { value: 1, color: "#1ed94f" }],

                series: [
                    {
                        name: '自给自足率',
                        data: finalPercent / 100
                    }
                ]
            }


            const cleanRate = (total_solar / total_electricity).toFixed(2)
            // this.radarChartData.radar[0].indicator[0].name = "清洁度\n" + cleanRate
            const radarData = [cleanRate, 0.7, 0.75, 0.7, 0.8]
            this.radarChartData = {
                categories: ['清洁度', '安全度', '可靠度', '智慧度', '高效度'],
                series: [
                    {
                        name: '',
                        data: radarData
                    }
                ]
            }
        },

        async handleData(dateType) {
            const boxids = this.currentSystem.boxidsbyDay
            const yearBoxids = this.currentSystem.boxidsbyYear
            const date = this.$moment().format('YYYY-MM-DD')
            const timeMap = {
                'date': 'hour',
                'month': 'date',
                'year': 'month'
            }
            let result = null
            if (dateType == 'date') {
                result = await energy_new.findDayStatisticsDetailsByLevelIdsAndDay(boxids, date)
            } else if (dateType == 'month') {
                result = await energy_new.findMonthStatisticsDetailsByLevelIdsAndMonth(boxids, date)
            } else if (dateType == 'year') {
                result = await energy_new.findYearStatisticsDetailsByLevelIdsAndYear(yearBoxids, date)
            }
            let fullTimeRange = []
            if (dateType === 'date') {
                fullTimeRange = Array.from({ length: 24 }, (_, i) => i.toString())
            } else if (dateType === 'month') {
                const daysInMonth = this.$moment().daysInMonth()
                fullTimeRange = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())
            } else if (dateType === 'year') {
                fullTimeRange = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
            }
            let fullData = []
            console.log(result, "99999999999999999999999999999999999999")

            fullTimeRange.map(item => {
                if (!result.data.find(e => e[timeMap[dateType]] == item)) {
                    fullData.push({
                        time: item,
                        electricity: 0,
                        solar: 0,
                        charge: 0,
                        discharge: 0,
                        grid: 0,
                        gridForward: 0,
                        gridReverse: 0,
                        water: 0,
                    })
                } else {
                    let curr = result.data.find(e => e[timeMap[dateType]] == item)
                    fullData.push({
                        time: item,
                        electricity: curr.total_consume_electricity_q,
                        solar: curr.total_provide_q,
                        charge: curr.total_storage_forward_q,
                        discharge: curr.total_storage_reverse_q,
                        grid: parseFloat(curr.total_grid_forward_q) - parseFloat(curr.total_grid_reverse_q),
                        gridForward: curr.total_grid_forward_q,
                        gridReverse: curr.total_grid_reverse_q,
                        water: curr.total_consume_water_q,

                    })
                }
            })
            const opt = fullData.reduce((pre, curr) => {
                pre.time.push(curr.time)
                pre.electricity.push(curr.electricity)
                pre.solar.push(curr.solar)
                pre.charge.push(curr.charge)
                pre.discharge.push(curr.discharge)
                pre.grid.push(curr.grid)
                pre.gridForward.push(curr.gridForward)
                pre.gridReverse.push(curr.gridReverse)

                // pre.electricity.push(curr.total_consume_electricity_q)
                // pre.solar.push(curr.total_provide_q)
                // pre.charge.push(curr.total_storage_forward_q)
                // pre.discharge.push(curr.total_storage_reverse_q)
                // pre.grid.push(parseFloat(curr.total_grid_forward_q) - parseFloat(curr.total_grid_reverse_q))
                // pre.gridForward.push(curr.total_grid_forward_q)
                // pre.gridReverse.push(curr.total_grid_reverse_q)
                // pre.water.push(curr.total_consume_water_q)
                return pre
            }, { time: [], electricity: [], solar: [], charge: [], discharge: [], grid: [], gridForward: [], gridReverse: [], water: [] })

            console.log(opt, "opt")
            return opt
        },

        // 处理能源站数据
        async handleNyzData(dateType) {
            try {
                const storageIdOne = this.ammeterList.find(item => item.deviceName == '1#储能DC直流表').deviceId
                const storageIdTwo = this.ammeterList.find(item => item.deviceName == '2#储能DC直流表').deviceId
                const storageIds = [storageIdOne, storageIdTwo]
                let result = []
                let nyzData = []

                const timeMap = {
                    'date': 'hour',
                    'month': 'date',
                    'year': 'month'
                }
                if (dateType == 'date') {
                    result = await energy_new.findEveryHourByDeviceIds({
                        deviceIds: storageIds,
                        day: dateStandardFormat(new Date()),
                    })
                } else if (dateType == 'month') {
                    result = await energy_new.findEveryDayByDeviceIds({
                        deviceIds: storageIds,
                        year: new Date().getFullYear(),
                        month: new Date().getMonth() + 1
                    })
                } else if (dateType == 'year') {
                    result = await energy_new.findEveryMonthByDeviceIds({
                        deviceIds: storageIds,
                        year: new Date().getFullYear()
                    })
                }
                nyzData = result.data.reduce((pre, curr) => {
                    pre.time.push(curr[timeMap[dateType]])
                    pre.charge.push(curr.total_storage_forward_q)
                    pre.discharge.push(curr.total_storage_reverse_q)
                    return pre
                }, { time: [], charge: [], discharge: [] })

                return nyzData
            } catch (err) {
                console.error(err)
            }
        },

        // 能源站光伏数据
        async handleNyzSolarData(dateType) {
            try {
                const solarIdOne = this.ammeterList.find(item => item.deviceName == '1#光伏DC直流表').deviceId
                const solarIdTwo = this.ammeterList.find(item => item.deviceName == '2#光伏DC直流表').deviceId
                const solarIds = [solarIdOne, solarIdTwo]

                let result = []
                let nyzData = []

                const timeMap = {
                    'date': 'hour',
                    'month': 'date',
                    'year': 'month'
                }
                if (dateType == 'date') {
                    result = await energy_new.findEveryHourByDeviceIds({
                        deviceIds: solarIds,
                        day: dateStandardFormat(new Date()),
                    })
                } else if (dateType == 'month') {
                    result = await energy_new.findEveryDayByDeviceIds({
                        deviceIds: solarIds,
                        year: new Date().getFullYear(),
                        month: new Date().getMonth() + 1
                    })
                } else if (dateType == 'year') {
                    result = await energy_new.findEveryMonthByDeviceIds({
                        deviceIds: solarIds,
                        year: new Date().getFullYear()
                    })
                }
                nyzData = result.data.reduce((pre, curr) => {
                    pre.time.push(curr[timeMap[dateType]])
                    pre.solar.push(curr.total_provide_q)
                    return pre
                }, { time: [], solar: [] })

                return nyzData
            } catch (err) {
                console.error(err)
            }
        },

        // 切换能源数据结构
        async changeEnergyDataType(dateType) {
            this.dateType = dateType
            // this.getEnergyData()
            // this.getCarbonData()
            // this.getCarbonIndexData()
            // let opt = await this.handleData(this.dateType)
            // this.getEnergyData(opt)
            // this.getCarbonData(opt)
            // this.getCarbonIndexData(opt)
            console.log(11111)
            await this.getStorageBatteryData()
            let opt = await this.handleData(this.dateType)
            let opt2 = await this.handleNyzSolarData(this.dateType)
            this.getEnergyData(opt, opt2)
            this.getCarbonData(opt, opt2)
            this.getCarbonIndexData(opt)

        },


        // 查询碳排因子
        async getCarbonFactor() {
            const carbonFactorData = {
                factorELE: 0.785
            }
            this.carbonFactor = carbonFactorData
        },

        // 获取整数和小数部分
        getIntAndDec(num) {
            const integerPart = Math.floor(num);
            const decimalPart = (num - integerPart).toFixed(2).replace(/^0/, '');
            return {
                int: integerPart,
                dec: decimalPart
            }
        },

        // 图表时间格式化
        xAxisFormat(arr, dateType) {
            if (dateType == 'date') {
                return arr.map(item => item)
            } else if (dateType == 'month') {
                return arr.map(item => {
                    const date = new Date(item);
                    return String(date.getDate()).padStart(2, '0');  // 保持两位数格式
                })
            } else if (dateType == 'year') {
                return arr.map(item => item)
            }
            return arr
        },

        refresh() {
            console.log('Home组件刷新数据');
            // 这里实现具体的刷新逻辑，例如重新调用API获取数据
            this.getCarbonFactor()
            this.initPage()
        }

    },


    mounted() {
        this.getCarbonFactor()
        this.dataInterval = setInterval(() => {
            this.initPage()
        }, 1000 * 60 * 10);

        this.initPage()

    },

    unmounted() {
        this.dataInterval && clearInterval(this.dataInterval)
    },

};
</script>
<style lang="scss" scoped>
// .container {
//     padding: 10px;
//     background-color: #fff;
// }

.header {
    position: relative;
    height: 420rpx;
    border-radius: 24rpx 24rpx 0 0;
    overflow: hidden;
    background:
        url('https://serviceiems.gree.com/esOperation/img/gfw-background.252630dc.jpg') center/cover;


}





.title {
    font-size: 40rpx;
    color: #fff;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.4);
    margin-bottom: 16rpx;
}

.run-days {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 8rpx;
}

.location {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
}

.stats-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 10px 0;
    // margin-bottom: unset;
    background: #fff;
    border-radius: 6px;
    align-items: center;
}

.stats-item {
    width: 30%;
    text-align: center;
    margin-bottom: 10px;
    padding: 10px 0;
    // background-color: #f8f8f8;
    // border-radius: 8px;
}

.divider {
    width: 1px;
    height: 40px;
    background-color: #eaeaea;
    // margin: 0 10px;
}

.stats-img {
    background-image: url('./static/images/img.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.stats-value {
    font-size: 16px;
    font-weight: bold;
    color: #1E88E5;
}

.stats-unit {
    font-size: 12px;
    color: #999;
    display: block;
}

.stats-desc {
    font-size: 12px;
    color: #666;
    display: block;
    margin-top: 2px;
}

/* 通用样式 */
// * {
//     box-sizing: border-box;
//     margin: 0;
//     padding: 0;
// }





.outer-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #EFF4FB;
    color: #333;
    padding: 10rpx;
    display: flex;
    flex-direction: column;
}

/* 标题样式 */
.title {
    text-align: center;
    margin-bottom: 20px;
}

.location-icon {
    width: 16px;
    height: 24px;
    position: absolute;
    bottom: 32rpx;
    right: 320rpx
}

.gradient-text {
    font-size: 24px;
    font-weight: bold;
    background: linear-gradient(90deg, #f7cb6b, #bc8c3a, #f7cb6b, #bc8c3a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    position: absolute;
    right: 20rpx;
    bottom: 32rpx;
    font-size: 32rpx;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.15);
    // background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.days-container {
    // background: linear-gradient(135deg, #4488fb 0%, #6ca2ff 100%);
    border-radius: 24rpx;
    padding: 32rpx;
    // box-shadow: 0 8rpx 24rpx rgba(68, 136, 251, 0.2);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.days-label {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
    // margin-bottom: 16rpx;
    display: block;
}

.days-counter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
}

.days-number-wrapper {
    perspective: 1000rpx;
    display: flex;
}

.days-number {
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s ease-in-out;
}

.number-value {
    font-size: 48rpx;
    font-weight: 700;
    color: #fff;
    position: relative;
    display: inline-block;
    padding: 0 8rpx;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8rpx;
}

.number-shadow {
    position: absolute;
    bottom: -8rpx;
    left: 5%;
    width: 90%;
    height: 16rpx;
    background: rgba(0, 0, 0, 0.1);
    filter: blur(8rpx);
    border-radius: 50%;
}

.days-unit {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
    align-self: flex-end;
    margin-left: 8rpx;
    padding-bottom: 6rpx;
}




/* 卡片样式 */
.card {

    padding: 10px;

}



/* 标题图标样式 */
.title-icon {
    width: 80px;
    height: 80px;
    margin-right: 10px;
}

/* 部分标题样式 */
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx // margin-bottom: 10px;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
}

.section-unit {
    font-size: 14px;
}

.section-divider {
    flex: 1;
    height: 1px;
    background-color: #ccc;
    margin: 10px;
}

/* 数值组样式 */
.value-group {
    display: flex;
    align-items: baseline;
    font-size: 20px;
}

.value-int {
    font-weight: bold;
}

.value-dec {
    margin-left: 2px;
    font-size: 16px;
}

.value-unit {
    margin-left: 5px;
    font-size: 14px;
    color: #666;
}

/* 能源数据网格样式 */
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
}

.stat-card {
    text-align: center;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}


.stat-title {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
}

/* 选项卡样式 */
.tab-container {
    display: flex;
    justify-content: center;
    padding: 20rpx // margin-bottom: 10px;
}

.tab {
    padding: 10px 20px;
    margin: 0 1px;
    background-color: #e9e9f4;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.tab.active {
    background-color: #007BFF;
    color: #fff;
}

.tab-label {
    font-size: 14px;
}

/* 用能结构卡片样式 */
.energy-grid {
    display: flex;
    flex-wrap: wrap;
    grid-template-columns: repeat(2, 1fr);
    /* 强制两列布局 */
    gap: 16px;
    /* 网格间距 */
    width: 100%;
}

.energy-card {
    background: linear-gradient(to right,
            #4488fb 0%,
            #6ca2ff 50%,
            #aad0ff 100%) !important;
    color: #fff;
    padding: 10px 5rpx;
    // border-radius: 5px;
    text-align: center;
    // transition: transform 0.3s ease;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: calc(50% - 8px);


}



.card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40% // margin-bottom: 5px;
}

.card-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.energy-label {
    font-size: 14px;
}

.energy-value-container {
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    width: 60%
}

.energy-unit {
    font-size: 14px;
}





.energy-label {
    color: rgba(255, 255, 255, 0.9) !important;
}

.energy-value {
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.chart-header {
    margin-bottom: 10px;
}

.chart-title {
    font-size: 32rpx;
    font-weight: bold;
}

/* 三栏布局容器 */
.carbon-container {
    display: flex;
    justify-content: space-between;
    gap: 30rpx;
    padding: 20rpx;
}

/* 统计卡片样式 */
// 定义碳排放主题色
$carbon-blue: #165DFF;
$carbon-green: #00B42A;
$carbon-bg: #F5F7FA;
$carbon-text: #1D2129;
$carbon-light: #E5E6EB;
$carbon-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
$carbon-hover-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.12);

// 卡片容器样式
/* 新增容器样式 */
.carbon-container {
    display: flex;
    gap: 32rpx;
    padding: 24rpx;
    margin-bottom: 20px;
}

/* 统计卡片样式升级 */
.carbon-card {
    flex: 1;
    padding: 32rpx 0;
    background: transparent !important;
    border-radius: 16rpx;
    transition: all 0.3s ease;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 图片容器增强 */
.deco-box {
    width: 240rpx;
    border-radius: 24rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 数值显示优化 */
.carbon-value-group {
    margin-top: 24rpx;
    display: flex;
    align-items: baseline;
    gap: 8rpx;
}

.value-int {
    font-size: 40rpx;
    font-weight: 600;
    letter-spacing: 0.5rpx;
    color: #2c3e50;
    background: linear-gradient(135deg, #3498db, #2980b9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.carbon-title {
    font-size: 28rpx;
    color: #7f8c8d;
    font-weight: 500;
    margin-bottom: 12rpx;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.value-dec {
    font-size: 24rpx;
    opacity: 0.9;
    color: #95a5a6;
}

.carbon-unit {
    font-size: 20rpx;
    color: #bdc3c7;
}

/* 新增文字阴影提升可读性 */
.carbon-card {
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}



// 中央图片区域样式
.deco-box {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    // padding: 0 32rpx;

    .center-image {
        transition: transform 0.5s ease;

        // 添加图片悬停效果
        &:hover {
            transform: scale(1.05) rotate(3deg);
        }
    }
}

// 左侧卡片样式
.carbon-card:nth-child(1) {
    // 蓝色渐变背景
    background: linear-gradient(135deg, #165DFF 0%, #4080FF 100%);
}

// 右侧卡片样式
.carbon-card:nth-child(3) {
    // 绿色渐变背景
    background: linear-gradient(135deg, #00B42A 0%, #00A126 100%);
}



.value-int,
.value-dec {
    animation: countUp 0.8s ease forwards;
    opacity: 0;
    display: inline-block;
}

.value-int {
    animation-delay: 0.2s;
}

.value-dec {
    animation-delay: 0.3s;
}


.chart-tab-bar {
    // background: rgba(255, 255, 255, 0.9);
    // border-radius: 24rpx;
    // padding: 8rpx;
    // box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
    display: inline-flex;
    padding: 10px;
    padding-bottom: unset;
}

.chart-tab-item {
    padding: 12rpx 32rpx;
    margin: 0 2rpx;
    // border-radius: 16rpx;
    border: 1px solid #4488FB;
    color: #666;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    border-bottom: unset
}

.chart-tab-item.active {
    background: linear-gradient(135deg, #4488fb 0%, #6ca2ff 100%);
    color: #fff !important;
    box-shadow: 0 4rpx 12rpx rgba(68, 136, 251, 0.3);
    transform: translateY(-2rpx);
}









/* 社会贡献卡片样式 */
.social-contribution .card-container {
    display: flex;
    align-items: center;
}

.social-contribution .icon-container {
    margin-right: 10px;
}

.social-contribution .icon {
    width: 150px;
    height: 65px;
}

.social-contribution .data-container {
    flex: 1;
}

.social-contribution .contribution-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.social-contribution .item-left {
    display: flex;
    flex-direction: column;
}


.item-right {
    background: #EFF4FB;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150rpx;
    height: 60rpx;
    color: #4588FB;
}

.social-contribution .contribution-label {
    font-size: 14px;
}

.social-contribution .contribution-unit {
    font-size: 12px;
    color: #D7DADD;
}

.social-contribution .contribution-value {
    font-size: 16px;
    font-weight: bold;
}

.social-contribution .item-divider {
    height: 1px;
    background-color: #ccc;
    margin: 10px 0;
}




/* 图表容器样式 */
.indicators-content {
    display: flex;
    /* 使用 Flexbox 布局 */
    flex-direction: row;
    /* 水平排列 */
    justify-content: space-between;
    /* 均匀分布图表，两端对齐 */
    gap: 20rpx;
    /* 图表之间的间距 */
    margin-top: 20rpx;
    width: 100%;
    align-items: center;
}

/* 单个图表样式 */
.indicator-chart {
    flex: 1;
    /* 每个图表占据相等的空间 */
    max-width: calc(50% - 10rpx);
    /* 确保两个图表都能适应容器 */
    height: 300rpx;
    /* 设置适当的高度，根据实际需求调整 */
}





.low-carbon-indicators .gauge-chart-container,
.low-carbon-indicators .radar-chart-container {
    flex: 1;
    min-width: 200px;
}

.low-carbon-indicators .chart-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 10px;
}

/* 竖屏样式 */
@media (orientation: portrait) {
    .outer-container {
        padding: 10px;
    }

    .grid-container,
    .energy-grid,
    .carbon-stats {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }

    .social-contribution .card-container {
        /* flex-direction: column; */
        align-items: center;
    }

    .social-contribution .icon-container {
        margin-bottom: 10px;
    }
}

/* 横屏样式 */
@media (orientation: landscape) {
    .outer-container {
        padding: 20px 50px;
    }

    .grid-container,
    .energy-grid,
    .carbon-stats {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
}
</style>