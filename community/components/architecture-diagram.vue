<template>
    <view class="container">
        <view class="system-img">
            <image src="../static/images/system-architecture-new.png"
                style="width:100%; height:96%; position: absolute; top:0; left:0; z-index: 1;"></image>
            <view class="detail-storage">
                <p>{{ storageStatus }}</p>
                <p>{{ storageData.power }}kW</p>
            </view>

            <view class="detail-grid">
                <p>{{ gridStatus }}</p>
                <p>{{ totalLoadData.power }}kW</p>
            </view>

            <view class="detail-solar">
                <p>发电</p>
                <p>{{ totalSolarData.power }}kW</p>
            </view>


            <view class="power-label" style="left: 27vw;top: 31%">
                {{ ((currentStatus['600a29b2cdf9e30600897f26'] ? currentStatus['600a29b2cdf9e30600897f26'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 37vw;top: 31%">
                {{ ((currentStatus['616e66f584c6e1930fa05917'] ? currentStatus['616e66f584c6e1930fa05917'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 47vw;top: 31%">
                {{ ((currentStatus['616e670d84c6e1930fa05919'] ? currentStatus['616e670d84c6e1930fa05919'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 57vw;top: 31%">
                {{ ((currentStatus['616e671a84c6e1930fa0591b'] ? currentStatus['616e671a84c6e1930fa0591b'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 67vw;top: 31%">
                {{ ((currentStatus['616e672b84c6e1930fa0591d'] ? currentStatus['616e672b84c6e1930fa0591d'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 77vw;top: 31%">
                {{ ((currentStatus['637dcbf0d326f0333863b971'] ? currentStatus['637dcbf0d326f0333863b971'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 87vw;top: 31%">
                {{ "--" }}kW
            </view>



        </view>

        <!-- 数据卡片区域 -->
        <view class="card-section">
            <view class="card-row">
                <view class="card">
                    <view class="card-item">
                        <image src="../static/images/solar.png" class="card-icon"></image>
                        <text class="card-title">今日发电</text>
                    </view>
                    <view class="card-item">
                        <text class="card-value">{{ totalProvideQ }} </text>
                        <text class="card-unit"> kWh</text>
                    </view>


                </view>
                <view class="card">
                    <view class="card-item">
                        <image src="../static/images/storage.png" class="card-icon"></image>
                        <text class="card-title">储能剩余</text>
                    </view>

                    <view class="card-item">
                        <text class="card-value">{{ nyzData.SOC }}</text>
                        <text class="card-unit">%</text>
                    </view>
                </view>
            </view>
            <view class="card-row">
                <view class="card">
                    <view class="card-item">
                        <image src="../static/images/consumption.png" class="card-icon"></image>
                        <text class="card-title">今日用电</text>
                    </view>

                    <view class="card-item">
                        <text class="card-value">{{ totalConsumptionQ.consumptionQData }} </text>
                        <text class="card-unit"> kWh</text>
                    </view>
                </view>
                <view class="card">
                    <view class="card-item">
                        <image src="../static/images/grid.png" class="card-icon"></image>
                        <text class="card-title">电网供电</text>
                    </view>

                    <view class="card-item">
                        <text class="card-value">{{ dayEnergyData.totalGridForwardQ }} </text>
                        <text class="card-unit"> kWh</text>
                    </view>
                </view>
            </view>
        </view>




        <view class="chart-container">

            <view class="chart-tab-bar">
                <view class="chart-tabs">
                    <view v-for="(tab, i) in ['日', '月', '年']" :key="i"
                        :class="['chart-tab-item', { active: activeChartTab === tab }]"
                        @click="handleDateTypeChange(tab)" :style="{
                            backgroundColor: activeChartTab === tab ? '#4488FB' : 'white',
                            color: activeChartTab === tab ? 'white' : '#4488FB'
                        }">
                        {{ tab }}
                    </view>
                </view>

                <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate"
                    class="custom-picker date-picker" />
                <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker"
                    v-model="selectedDate" class="custom-picker date-picker" />
                <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate"
                    class="custom-picker date-picker" />
            </view>
            <view class="chart-card">
                <h3 class="chart-title">能源管理</h3>
                <qiun-data-charts ref="energyChart"
                    v-if="electricityData.categories && electricityData.categories.length > 0" type="area"
                    :chartData="electricityData" :ontouch="true" :canvas2d="canvas2d" :opts="electricityOpts" />
                <view v-else class="empty-chart">
                    <text class="empty-text">暂无能源数据</text>
                </view>
            </view>

            <!-- 图表分隔线 -->
            <view style="height:1rpx;background-color:#eee;margin:10rpx"></view>

            <view class="chart-card" style="margin:5rpx 0">
                <h3 class="chart-title">收益分析</h3>
                <qiun-data-charts v-if="incomeData.categories && incomeData.categories.length > 0" ref="incomeChart"
                    type="column" :ontouch="true" :canvas2d="canvas2d" :chartData="incomeData" :opts="incomeOptions" />
            </view>
        </view>
    </view>
</template>

<script>

import {
    getSocketinstance
} from "@/service/websocket";
import { nyzAreaLevelId } from '@/service/config/devices'
import { mapGetters } from 'vuex'; // 引入 mapGetters
import upgrade from '@/api/upgrade'
import nyz from '@/api/nyz'
import nyz_new from '@/api/nyz_new'
import {
    dateStandardFormat,
} from "@/utils/date-format"
import sapi from '@/store/sapi'
import energy from '@/api/energy'
import energy_new from '@/api/energy_new'
import dyDate from '@/components/dy-Date/dy-Date.vue'; // 导入日期选择器组件
export default {
    components: {
        dyDate, // 注册日期选择器组件
    },
    name: "ArchitectureDiagram",
    data() {
        return {
            activeChartTab: '日',
            canvas2d: this.$Config.ISCANVAS2D,
            timeOptions: [
                { label: '日', value: 'hour' },
                { label: '月', value: 'day' },
                { label: '年', value: 'month' }
            ],
            // timeType: 'hour',
            selectedDate: new Date(),
            areaData: [],
            modal: false,
            areaName: "",
            storageStatus: "放电中",
            current: "system-architecture",
            storagePower: "--",
            currentStatus: {},
            gridStatus: "供电中",
            gridPower: "--",
            // generateData: 153,
            type: "hour",
            powerDate: new Date(),
            date: new Date(),
            month: new Date(),
            year: new Date(),

            incomeLoading: false,

            totalProvideQ: "--",
            totalStorageDisChargeQ: "--",
            totalStorageChargeQ: "--",
            dayEnergyData: {
                totalProvideQ: 0,
                totalStorageForwardQ: 0,
                totalStorageReverseQ: 0,
                totalGridForwardQ: 0,
                totalGridReverseQ: 0,
                totalConsumeElectricityQ: 0,
            },
            nyzData: {
                storagePower1: 0,
                storagePower2: 0,
                SOC: "--",
                photovoltaicPower1: "--",
                photovoltaicPower2: "--",
                loadPower1: "--",
                loadPower2: "--"
            },
            selectedEnergyData: {
                // 被选中光伏的数据
                I: "--",
                U: "--",
                P: "--",
                Q: "--",
            },
            incomeDate: new Date(),
            electricityOpts: {
                color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [15, 20, 0, 15],
                dataLabel: false,
                dataPointShape: false,
                enableScroll: false,
                legend: {},
                xAxis: {
                    labelCount: 6,
                    disableGrid: true
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
                        type: "straight",
                        width: 2,
                        activeType: "hollow",
                        linearType: "custom"
                    }
                }
            },
            electricityData: {
                categories: [],
                series: [
                    { data: [], name: '发电功率' },

                ]
            },
            incomeData: {
                categories: [],
                series: [
                    { data: [], name: '储能收益' },
                    { data: [], name: '光伏收益' }
                ]
            },
            incomeOptions: {
                dataLabel: false,
                color: ["#C4F0F1", '#F3DCD5'],
                padding: [15, 18, 0, 15],
                enableScroll: false,
                legend: {},
                xAxis: {
                    disableGrid: true,
                    // itemCount: 12,
                    labelCount: 10,
                },
                yAxis: {
                    gridType: "dash",
                    dashLength: 2,
                    showTitle: true,
                    data: [{
                        position: "left",
                        title: "单位:元"
                    }],
                },
                extra: {
                    column: {
                        type: "group",
                        width: 30
                    }
                }
            },
            dateTypeIndex: 0, // 当前日期类型索引 0:日 1:月 2:年
            timeTypeIndex: 0,
            selectedDate: new Date().toISOString().split('T')[0],
        }
    },
    filters: {
        format: function (value, num = 3) {
            return value ? value.toFixed(num) : 0;
        }
    },
    watch: {
        chartDataProps: {
            handler(newVal) {
                if (this.$refs.charts) {
                    this.$refs.charts.updateData(newVal)  // 使用updateData而不是直接调用draw
                }
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters([
            'currentSystem'
        ]),
        nyzDeviceList() {
            return this.currentSystem ? this.currentSystem.ammeterList : [];
        },
        storageData() {
            const power = parseFloat(this.nyzData.storagePower1 || 0) + parseFloat(this.nyzData.storagePower2 || 0)
            const status = power == 0 ? "不充不放" : power > 0 ? "充电中" : "放电中"
            return {
                power: power.toFixed(2),
                status
            }
        },

        totalLoadData() {
            const power1 = this.nyzData.loadPower1 == '--' ? '--' : this.nyzData.loadPower1
            const power2 = this.nyzData.loadPower2 == '--' ? '--' : this.nyzData.loadPower2
            const power3 = this.gridPower == '--' ? '--' : this.gridPower
            const power = this.getSum([power1, power2, power3])
            return { power }
        },

        totalConsumptionQ() {
            const consumptionQData = parseFloat(this.totalProvideQ || 0) + parseFloat(this.totalStorageDisChargeQ || 0) + parseFloat(this.dayEnergyData.totalGridForwardQ || 0) - parseFloat(this.dayEnergyData.totalGridReverseQ || 0) - parseFloat(this.totalStorageChargeQ || 0)
            return { consumptionQData: consumptionQData.toFixed(2) }
        },

        totalSolarData() {
            const power1 = this.nyzData.photovoltaicPower1 == '--' ? '--' : Math.abs(this.nyzData.photovoltaicPower1)
            const power2 = this.nyzData.photovoltaicPower2 == '--' ? '--' : Math.abs(this.nyzData.photovoltaicPower2)
            const power3 = parseFloat(this.selectedEnergyData.P / 1000).toFixed(2) == '--' ? '--' : parseFloat(this.selectedEnergyData.P / 1000).toFixed(2)
            // const power3 = parseFloat(this.selectedEnergyData.P/1000).toFixed(2)
            const power = this.getSum([power1, power2, power3])
            return {
                power
            }
        },

    },
    mounted() {
        this.getSqRealTimeData()
        this.getNyzRealTimeData()

        this.initPage()
        this.dataInterval = setInterval(() => {
            this.initPage()
        }, 1000 * 60 * 5);
    },

    unmounted() {
        this.dataInterval && clearInterval(this.dataInterval)
    },

    created() {

    },
    beforeDestroy() {
        getSocketinstance().socket && getSocketinstance().socket.off("center");
    },
    methods: {

        handleDateTypeChange(e) {

            this.activeChartTab = e;
            if (e === '日') {
                this.dateTypeIndex = 0;
                this.timeTypeIndex = 0;
            } else if (e === '月') {
                this.dateTypeIndex = 1;
                this.timeTypeIndex = 1;
            } else if (e === '年') {
                this.dateTypeIndex = 2;
                this.timeTypeIndex = 2;
            }
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');

            // 动态更新默认日期
            this.selectedDate = {
                0: currentDate.toISOString().split('T')[0],
                1: `${year}-${month}`,
                2: `${year}`
            }[this.timeTypeIndex];

            this.handleDatePicker(this.selectedDate);
        },

        handleDatePicker(value) {
            // 统一处理日期格式
            const dateMap = {
                0: { // 日模式
                    dateType: 'hour',
                    dateValue: value
                },
                1: { // 月模式
                    dateType: 'day',
                    dateValue: value
                },
                2: { // 年模式
                    dateType: 'month',
                    dateValue: value
                }
            };
            this.type = dateMap[this.dateTypeIndex].dateType
            if (this.type === "hour") {
                this.getPowerData2()
            } else if (this.type === "day") {
                this.findMonthEnergyAndIncome();
            } else if (this.type === "month") {
                this.findYearEnergyAndIncome();
            }
            this.getStorageIncome()
        },
        //初始化
        initPage() {
            this.getAreaData()
            this.getStatisticData()
            this.getProvideCurve()
            this.findDayStorageQAndPower()
            this.getPowerData2()
            this.getStorageIncome()
        },

        // 获取层级数据
        getAreaData() {
            this.areaData = this.$store.state.centerList.filter((item) => {
                return item.level == 0 || item.level == 2;
            });
            this.areaData.sort((a, b) => {
                if (a.level !== b.level) {
                    return a.level - b.level;
                } else {
                    return a.origin[0] - b.origin[0];
                }
            });
        },

        //获取能源站加社区箱子总发电数据
        getProvideCurve() {
            upgrade.findDayProvideQAndPower({
                day: dateStandardFormat(new Date())
            }).then(result => {
                const totallyProvideQ = result.data.provideQMap.reduce((acc, cur) => {
                    return acc + cur.provideQ
                }, 0);
                let solarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
                energy_new.findEveryHourByDeviceIds({
                    deviceIds: solarIds,
                    day: dateStandardFormat(new Date())
                }).then(result => {
                    const totallyProvideQ1 = result.data.reduce((acc, cur) => {
                        return acc + cur.total_provide_q
                    }, 0);
                    this.totalProvideQ = parseFloat(totallyProvideQ + totallyProvideQ1).toFixed(2)
                })
            }).catch(err => {
                console.error(err)
            })
        },

        // 获取能源站充放电量数据
        findDayStorageQAndPower() {
            const storageIds = [352, 354]
            nyz.findEveryHourByDeviceIds({
                deviceIds: storageIds,
                day: dateStandardFormat(this.date),
            }).then((result) => {
                let storageQ = result.data.reduce((acc, item) => {
                    acc.charge += item.total_storage_forward_q
                    acc.discharge += item.total_storage_reverse_q
                    return acc
                }, { charge: 0, discharge: 0 })

                this.totalStorageChargeQ = storageQ.charge;
                this.totalStorageDisChargeQ = storageQ.discharge;
            })
        },


        // 社区实时数据
        getSqRealTimeData() {
            this.selectedEnergyData = { I: "--", U: "--", P: "--", Q: "--" };
            getSocketinstance().socket && getSocketinstance().socket.emit("register")
            getSocketinstance().socket && getSocketinstance().socket.on("center", (data) => {
                this.currentStatus = data;
            })

            // 总表电网实时数据
            this.gridPower = "--"
            // 获取社区的电网数据
            getSocketinstance().socket && getSocketinstance().socket.on("Grid", (data) => {
                if (data.data.B56) {
                    this.gridPower = (data.data.B56 / 1000).toFixed(3);
                }
            });

            // 获取箱子全部据 和 社区的光伏、储能、用电数据
            getSocketinstance().socket && getSocketinstance().socket.on("box", (data) => {
                // 拿光伏未来社区的 光伏 和 储能 的数据
                var community = {
                    energy: { I: 0.0, U: 0.0, P: 0.0, Q: 0.0 },
                    storage: {
                        I: 0.0,
                        U: 0.0,
                        chargeP: 0.0,
                        dischargeP: 0.0,
                        chargeQ: 0.0,
                        dischargeQ: 0.0,
                        soc: 0,
                        surplus_storage: 0.0,
                        rated_storage: 0.0,
                        chargeI: 0.0,
                        dischargeI: 0.0,
                        chargeU: 0.0,
                        dischargeU: 0.0,
                    },
                };
                // 累加每个箱子的数据
                for (var i in data) {
                    if (i != 524) {
                        if (JSON.stringify(data[i].energy) != "{}") {
                            community.energy.I += data[i].energy.I;
                            community.energy.P += data[i].energy.P;
                            community.energy.Q += data[i].energy.Q;
                        }
                        if (
                            JSON.stringify(data[i].storage) != "{}" &&
                            i != 399 &&
                            i != 400 &&
                            i != 372
                        ) {
                            // community.storage.I += data[i].storage.I;
                            if (data[i].storage.chargeP > data[i].storage.dischargeP) {
                                // 计算全部箱子 充电时的I的和
                                community.storage.chargeI += data[i].storage.I;
                            } else if (
                                data[i].storage.chargeP < data[i].storage.dischargeP
                            ) {
                                // 计算全部箱子 放电时的I的和
                                community.storage.dischargeI += data[i].storage.I;
                            }
                            community.storage.chargeP += data[i].storage.chargeP;
                            community.storage.dischargeP += data[i].storage.dischargeP;
                            community.storage.chargeQ += data[i].storage.chargeQ;
                            community.storage.dischargeQ += data[i].storage.dischargeQ;
                        }
                    }
                }
                if (community.energy.P === 0) {
                    // P为0,则表示待机, 那么I和U就不需要计算,直接为0
                    community.energy.U = 0;
                    community.energy.I = 0;
                } else {
                    community.energy.U = community.energy.P / community.energy.I;
                }
                community.storage.soc = Math.round(
                    community.storage.surplus_storage / community.storage.rated_storage
                );
                if (community.storage.chargeP > community.storage.dischargeP) {
                    community.storage.chargeU =
                        community.storage.chargeP / community.storage.chargeI;
                    community.storage.I = community.storage.chargeI;
                    // community.storage.I = community.storage.chargeI - community.storage.dischargeI
                    community.storage.U = community.storage.chargeU;
                    // community.storage.chargeP = community.storage.chargeP - community.storage.dischargeP
                } else if (community.storage.chargeP < community.storage.dischargeP) {
                    community.storage.dischargeU =
                        community.storage.dischargeP / community.storage.dischargeI;
                    community.storage.I = community.storage.dischargeI;
                    // community.storage.I = community.storage.dischargeI - community.storage.chargeI
                    community.storage.U = community.storage.dischargeU;
                    // community.storage.dischargeP = community.storage.dischargeP - community.storage.chargeP
                }
                if (community.storage.I == 0) {
                    community.storage.U = 0;
                }
                this.selectedEnergyData = community.energy;
                this.selectedStorageData = community.storage;

            });
        },

        // 能源站实时数据
        getNyzRealTimeData() {
            getSocketinstance().socket2 && getSocketinstance().socket2.emit("register")
            getSocketinstance().socket2 && getSocketinstance().socket2.on("nyzData", (jsonData) => {
                const {
                    deviceType,
                    address,
                    dataType,
                    data
                } = jsonData
                switch (deviceType) {
                    case "1804_V2_2":
                        if (address == "18" && dataType == "2") {
                            this.nyzData.storagePower1 = parseFloat(data.B8).toFixed(2)
                        } else if (address == "19" && dataType == "2") {
                            this.nyzData.storagePower2 = parseFloat(data.B8).toFixed(2)
                        } else if (address == "1A" && dataType == "2") {
                            this.nyzData.photovoltaicPower1 = parseFloat(data.B8).toFixed(2)
                        } else if (address == "1B" && dataType == "2") {
                            this.nyzData.photovoltaicPower2 = parseFloat(data.B8).toFixed(2)
                        } else if (address == "31" && dataType == "2") {
                            this.nyzData.loadPower1 = parseFloat(data.B8).toFixed(2)
                        } else if (address == "32" && dataType == "2") {
                            this.nyzData.loadPower2 = parseFloat(data.B8).toFixed(2)
                        }
                        break;

                    case "1704_V1_2":
                        if (address == "02" && dataType == "2") {
                            this.nyzData.SOC = parseFloat(data.B4).toFixed(2)
                        } else if (address == "02" && dataType == "3") {
                            this.storageStatus = this.enumStorageStatus(data.B2)
                        }
                        break;

                    default:
                        break;
                }
            })
        },

        enumStorageStatus(status) {
            if (status == 0) return "初始化"
            else if (status == 1) return "充电"
            else if (status == 2) return "放电"
            else if (status == 3) return "静置"
            else return "--"
        },

        getStatisticData() {
            Promise.all([
                this.findHomeCommunityCapacitySumByLevelIds(),
                // this.getCenterMonthEnergyData(),
                // this.getCenterTotalEnergyData(),
            ]).then((result) => {
                if (result) {
                    this.dayEnergyData = result[0].data;
                    // this.monthEnergyData = result[1].data;
                    // this.totalEnergyData = result[2].data;
                }
            });
        },
        findHomeCommunityCapacitySumByLevelIds() {
            let origin = this.$store.state.centerList.filter(
                (item) => item.level == 0
            )[0].origin;
            // return this.$api.statistic.findHomeCommunityCapacitySumByLevelIds({
            return sapi.findHomeCommunityCapacitySumByLevelIds({
                areaLevelIds: origin,
                date: dateStandardFormat(new Date()),
            });
        },

        // 当某日的日期改变时
        datePickerChange() {
            // this.findDayEnergyAndIncome();
            this.getPowerData2()
        },
        // 当某月的日期改变时
        monthPickerChange() {
            this.findMonthEnergyAndIncome();
        },
        // 当某年的日期改变时
        yearPickerChange() {
            this.findYearEnergyAndIncome()
        },

        // 当日、月、年按钮其中之一被选择时
        select(buttonType) {
            this.type = buttonType;
            if (this.type === "hour") {
                // this.findDayEnergyAndIncome();
                // this.getNyzSolarData();
                this.getPowerData2()
            } else if (this.type === "day") {
                this.findMonthEnergyAndIncome();
            } else if (this.type === "month") {
                this.findYearEnergyAndIncome();
            }
        },
        // 当日、月、年按钮其中之一被选择时
        selectIncome(buttonType) {
            this.type = buttonType;
            this.getStorageIncome()
        },
        onIncomeDateChange() {
            this.getStorageIncome()
        },
        //日发用电及收益数据
        findDayEnergyAndIncome() {
            this.dayGenerationData = [];
            this.dayLoadData = [];
            let xAxisData = [];
            upgrade.findDayEnergyAndIncome({
                day: dateStandardFormat(this.date),
            }).then((result) => {
                if (result && result.data) {
                    result.data.forEach((item) => {
                        this.dayGenerationData.push(item.provideQ);
                        this.dayLoadData.push(item.consumptionQ);
                        xAxisData.push(item.hour)
                    });
                    this.electricityData = {
                        categories: xAxisData,
                        series: [
                            { data: this.dayGenerationData, name: '发电' },
                            { data: this.dayLoadData, name: '用电' }
                        ]
                    }
                }
            })
        },
        //月发用电及收益数据
        findMonthEnergyAndIncome() {
            this.monthGenerationData = [];
            this.monthLoadData = [];
            let xAxisData = [];
            // this.electricityOptions.setConsumeSeries()
            // this.electricityOptions = new chartOptions.electricityOptions()
            upgrade.findMonthEnergyAndIncome({
                month: (new Date(this.month).getMonth() + 1).toString().padStart(2, '0'),
                year: new Date(this.month).getFullYear(),
            }).then((result) => {
                if (result && result.data) {
                    result.data.forEach((item) => {
                        this.monthGenerationData.push(item.provideQ);
                        this.monthLoadData.push(item.consumptionQ);
                        xAxisData.push(item.day)
                    })

                    // 能源站发电量
                    let solarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
                    nyz.findEveryDayByDeviceIds({
                        deviceIds: solarIds,
                        year: new Date(this.month).getFullYear(),
                        month: (new Date(this.month).getMonth() + 1).toString().padStart(2, '0')
                    }).then(res => {
                        xAxisData.map((item, index) => {
                            let nyzIdx = res.data.findIndex(e => e.date == item)
                            if (nyzIdx > -1) {
                                this.monthGenerationData[index] = (this.monthGenerationData[index] + res.data[nyzIdx].total_provide_q).toFixed(2)
                            }
                        })
                        // this.electricityOptions.xAxis[0].data = this.xAxisData;
                        // this.electricityOptions.series[0].data = this.monthGenerationData;
                        // this.electricityOptions.series[1].data = this.monthLoadData;
                        this.electricityData = {
                            categories: xAxisData,
                            series: [
                                { data: this.monthGenerationData, name: '发电' },
                                { data: this.monthLoadData, name: '用电' }
                            ]
                        }
                    }).finally(() => {

                    })
                }
            })
        },
        //年发用电及收益数据
        findYearEnergyAndIncome() {
            this.yearGenerationData = [];
            this.yearLoadData = [];
            let xAxisData = [];

            upgrade.findYearEnergyAndIncome({
                year: new Date(this.year).getFullYear(),
            }).then((result) => {
                if (result && result.data) {
                    result.data.forEach((item) => {
                        this.yearGenerationData.push(item.provideQ);
                        this.yearLoadData.push(item.consumptionQ);
                        xAxisData.push(item.month)
                    })

                    // 能源站发电量
                    let solarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
                    nyz.findEveryMonthByDeviceIds({
                        deviceIds: solarIds,
                        year: new Date(this.incomeDate).getFullYear()
                    }).then(res => {
                        xAxisData.map((item, index) => {
                            let nyzIdx = res.data.findIndex(e => e.month == item)
                            if (nyzIdx > -1) {
                                this.yearGenerationData[index] = parseFloat(this.yearGenerationData[index] + res.data[nyzIdx].total_provide_q).toFixed(2)
                            }
                        })
                        this.electricityData = {
                            categories: xAxisData,
                            series: [
                                { data: this.yearGenerationData, name: '发电' },
                                { data: this.monthLoadData, name: '用电' }
                            ]
                        }
                    }).finally(() => {

                    })
                }
            })
        },

        // 获取能源站收益
        getStorageIncome() {
            this.incomeLoading = true
            // this.incomeOptions.setXAxisData(this.type, this.incomeDate)
            let xAxisData = this.setXAxisData(this.type, this.incomeDate);
            this.incomeData.categories = xAxisData
            let solarIncome = []
            if (this.type == 'hour') {
                upgrade.findDayEnergyAndIncome({
                    day: dateStandardFormat(this.incomeDate),
                }).then(result => {

                    let solarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
                    energy_new.findEveryHourByDeviceIds({
                        deviceIds: solarIds,
                        day: dateStandardFormat(this.incomeDate)
                    }).then(res => {
                        // let solarIncome = []
                        xAxisData.map(item => {
                            let sqIdx = result.data.findIndex(e => e.hour == item)
                            let nyzIdx = res.data.findIndex(e => e.hour == item)
                            if (sqIdx > -1 || nyzIdx > -1) {
                                const sqVal = sqIdx > -1 ? result.data[sqIdx].provideQ * 0.85 : 0
                                const nyzVal = nyzIdx > -1 ? res.data[nyzIdx].total_provide_q * 0.85 : 0
                                solarIncome.push((sqVal + nyzVal).toFixed(2))
                            } else {
                                solarIncome.push(0)
                            }
                        })
                        this.incomeData.series[1].data = solarIncome
                    }).finally(() => {
                        this.incomeLoading = false
                    })
                })
            } else if (this.type == 'day') {
                upgrade.findMonthEnergyAndIncome({
                    month: (new Date(this.month).getMonth() + 1).toString().padStart(2, '0'),
                    year: new Date(this.month).getFullYear(),
                }).then(result => {


                    let solarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
                    nyz.findEveryDayByDeviceIds({
                        deviceIds: solarIds,
                        year: new Date(this.incomeDate).getFullYear(),
                        month: (new Date(this.incomeDate).getMonth() + 1).toString().padStart(2, '0')
                    }).then(res => {
                        // let solarIncome = []
                        xAxisData.map(item => {
                            let sqIdx = result.data.findIndex(e => new Date(e.day).getDate() == item)
                            let nyzIdx = res.data.findIndex(e => Number(new Date(e.date).getDate()) == item)
                            if (sqIdx > -1 || nyzIdx > -1) {
                                const sqVal = sqIdx > -1 ? result.data[sqIdx].provideQ * 0.85 : 0
                                const nyzVal = nyzIdx > -1 ? res.data[nyzIdx].total_provide_q * 0.85 : 0
                                solarIncome.push((sqVal + nyzVal).toFixed(2))
                            } else {
                                solarIncome.push(0)
                            }
                        })
                        // this.incomeOptions.series[1].data = solarIncome
                        this.incomeData.series[1].data = solarIncome
                    }).finally(() => {
                        this.incomeLoading = false
                    })
                })
            } else if (this.type == 'month') {
                upgrade.findYearEnergyAndIncome({
                    year: new Date(this.year).getFullYear()
                }).then(result => {
                    // this.incomeOptions.setSolarIncome(this.type, result.data)

                    let solarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
                    nyz.findEveryMonthByDeviceIds({
                        deviceIds: solarIds,
                        year: new Date(this.incomeDate).getFullYear()
                    }).then(res => {
                        // let solarIncome = []
                        xAxisData.map(item => {
                            let sqIdx = result.data.findIndex(e => e.month == item)
                            let nyzIdx = res.data.findIndex(e => e.month == item)
                            if (sqIdx > -1 || nyzIdx > -1) {
                                const sqVal = sqIdx > -1 ? result.data[sqIdx].provideQ * 0.85 : 0
                                const nyzVal = nyzIdx > -1 ? res.data[nyzIdx].total_provide_q * 0.85 : 0
                                solarIncome.push((sqVal + nyzVal).toFixed(2))
                            } else {
                                solarIncome.push(0)
                            }
                        })
                        this.incomeData.series[1].data = solarIncome
                        // this.incomeOptions.series[1].data = solarIncome
                    }).finally(() => {
                        this.incomeLoading = false
                    })
                })
            }

            nyz.findSOCAndPVIncome(this.type, nyzAreaLevelId, this.incomeDate).then(result => {
                if (result.data) {

                    this.setStorageIncome(this.type, result.data, solarIncome)
                }
            }).catch(err => {
                console.error(err)
            })
        },

        setStorageIncome(dateType, data, solarIncome) {
            console.log(data, solarIncome, "data")
            let xAxis = this.getTimeXAxis()
            let res = []
            if (dateType == 'hour') {
                xAxis.map(date => {
                    const idx = data.findIndex(item => item.hour == date + 1)
                    if (idx > -1) {
                        res.push((data[idx].storageIncome).toFixed(2))
                    } else {
                        res.push(0)
                    }
                })
            } else if (dateType == 'day') {
                xAxis.map(date => {
                    const idx = data.findIndex(item => new Date(item.date).getDate() == date)
                    if (idx > -1) {
                        res.push((data[idx].storageIncome).toFixed(2))
                    } else {
                        res.push(0)
                    }
                })
            } else if (dateType == 'month') {
                xAxis.map(date => {
                    const idx = data.findIndex(item => item.month == date)
                    if (idx > -1) {
                        res.push((data[idx].storageIncome).toFixed(2))
                    } else {
                        res.push(0)
                    }
                })
            }
            this.incomeData.series[0].data = res
        },

        getTimeXAxis() {
            let timeArray = []
            for (let h = 0; h < 24; h++) {
                for (let m = 0; m < 60; m++) {
                    let formattedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
                    timeArray.push(formattedTime)
                }
            }
            return timeArray
        },
        getDaysInMonth(date) {
            const today = new Date(date)
            const days = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate()
            return days
        },

        setXAxisData(dateType, date) {
            const arrLength = { 'hour': 24, 'day': this.getDaysInMonth(date), 'month': 12 }
            let xAxisData = []
            if (dateType == 'hour') {
                xAxisData = Array.from({ length: arrLength[dateType] }, (x, i) => i)
            } else {
                xAxisData = Array.from({ length: arrLength[dateType] }, (x, i) => i + 1)
            }
            // this.xAxis[0].data = xAxisData
            return xAxisData
        },
        setPowerSeries() {
            this.yAxis[0].name = "单位：kW"
            this.series = [{
                name: "发电功率",
                color: "#00e1b9",
                type: "line",
                showSymbol: false,
                data: [],
                areaStyle: {
                    opacity: "0.2",
                },
            },
            {
                name: "负荷功率",
                type: "line",
                showSymbol: false,
                data: [],
                areaStyle: {
                    opacity: "0.2",
                },
            },
            {
                name: "充电功率",
                type: "line",
                showSymbol: false,
                data: [],
                areaStyle: {
                    opacity: "0.2",
                },
            },
            {
                name: "放电功率",
                type: "line",
                showSymbol: false,
                data: [],
                areaStyle: {
                    opacity: "0.2",
                },
            },
            ]
        },


        getPowerData2() {
            // this.eleLoading = true
            // this.electricityOptions.setTimeXAxis()
            // this.electricityOptions.setPowerSeries()

            let xAxis = this.getTimeXAxis();

            const sqSolarIds = [1052928, 1049269, 1049278, 1053066]
            const nyzSolarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
            const storageIds = this.nyzDeviceList.filter(item => item.type == 1).map(item => item.deviceId)
            const gridIds = this.nyzDeviceList.filter(item => item.type == 4).map(item => item.deviceId)

            Promise.all([
                sapi.findPowerByLevelIdsAndDate({
                    areaLevelIds: this.areaData[0].origin,
                    startDate: this.$moment(this.powerDate).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.powerDate).format('YYYY-MM-DD'),
                }).catch(err => {
                    console.error(err)
                }),
                energy_new.queryStoragePowerCurve({
                    deviceIdList: sqSolarIds,
                    date: this.$moment(this.powerDate).format("YYYY-MM-DD")
                }).catch(err => {
                    console.error(err)
                }),
                energy_new.queryStoragePowerCurve({
                    deviceIdList: nyzSolarIds,
                    date: this.$moment(this.powerDate).format("YYYY-MM-DD")
                }).catch(err => {
                    console.error(err)
                }),
                nyz_new.queryStoragePowerCurve({
                    deviceIdList: storageIds,
                    date: this.$moment(this.powerDate).format("YYYY-MM-DD")
                }).catch(err => {
                    console.error(err)
                }),
                energy_new.queryMeterDevicePower({
                    deviceId: gridIds[0],
                    intervalMinutes: 1,
                    aggregationType: "LAST",
                    start: this.$moment(this.powerDate).format("YYYY-MM-DD 00:00:00"),
                    end: this.$moment(this.powerDate).format("YYYY-MM-DD 23:59:59"),
                }).catch(err => {
                    console.error(err)
                }),
            ]).then(([sqConsumeResult, sqSolarResult, nyzSolarResult, nyzStorageResult, nyzGridResult]) => {

                let chartGridData = nyzGridResult.data.reduce((pre, curr) => {
                    pre.xAxis.push(this.$moment(curr.time).format('HH:mm'))
                    if (curr.power >= 0) {
                        // 若 power 为正数或零，添加到 forward 数组
                        pre.forward.push((parseFloat(curr.power) / 1000).toFixed(2))
                        pre.reverse.push(0)
                    } else {
                        // 若 power 为负数，添加到 reverse 数组
                        pre.reverse.push((parseFloat(-curr.power) / 1000).toFixed(2))
                        pre.forward.push(0)
                    }
                    return pre
                }, { xAxis: [], forward: [], reverse: [] })

                let sqConsume = sqConsumeResult.data.consumePower.allConsumePower.reduce((pre, curr) => {
                    pre[curr.frameDatetime] = curr.forwardPower
                    return pre
                }, {})
                let chartData = xAxis.reduce((pre, curr) => {
                    // let consumeIdx = sqConsumeResult.data.consumePower.allConsumePower.findIndex(e => curr == this.$moment(e.frameDatetime).format("HH:mm"))
                    // consumeIdx > -1 ? pre.consume.push(sqConsumeResult.data.consumePower.allConsumePower[consumeIdx].forwardPower) : pre.consume.push("-")
                    let consumeKey = `${this.$moment(this.powerDate).format("YYYY-MM-DD")} ${curr}`
                    if (sqConsume.hasOwnProperty(consumeKey)) {
                        pre.consume.push(sqConsume[consumeKey])
                    } else {
                        pre.consume.push(0)
                    }

                    let key = `${this.$moment(this.powerDate).format("YYYY-MM-DD")} ${curr}:00`
                    if (nyzSolarResult.data.hasOwnProperty(key) || sqSolarResult.data.hasOwnProperty(key)) {
                        pre.solar.push(((Math.abs(nyzSolarResult.data[key]) || 0) + ((parseFloat(sqSolarResult.data[key]) / 1000) || 0)).toFixed(3))
                    } else {
                        pre.solar.push(0)
                    }

                    if (nyzStorageResult.data.hasOwnProperty(key)) {
                        pre.charge.push(nyzStorageResult.data[key] <= 0 ? 0 : parseFloat(nyzStorageResult.data[key]).toFixed(3))
                        pre.discharge.push(nyzStorageResult.data[key] >= 0 ? 0 : parseFloat(-nyzStorageResult.data[key]).toFixed(3))
                    } else {
                        pre.charge.push(0)
                        pre.discharge.push(0)
                    }


                    // //电网
                    // if (nyzGridResult.data) {
                    //     pre.gridReverse.push(nyzGridResult.data.power <= 0 ? 0 : parseFloat(nyzGridResult.data.power).toFixed(3))
                    //     pre.gridForward.push(nyzGridResult.data.power >= 0 ? 0 : parseFloat(-nyzGridResult.data.power).toFixed(3))
                    // } else {
                    //     pre.gridReverse.push("-")
                    //     pre.gridForward.push("-")
                    // }

                    return pre
                }, { consume: [], solar: [], charge: [], discharge: [], gridReverse: [], gridForward: [] })

                // this.electricityOptions.formatXAxisLabel()
                // this.electricityOptions.series[0].data = chartData.solar
                // this.electricityOptions.series[1].data = chartData.consume
                // this.electricityOptions.series[2].data = chartData.charge
                // this.electricityOptions.series[3].data = chartData.discharge
                // // 使用 chartGridData.forward 作为电网正向功率数据
                // this.electricityOptions.series[4].data = chartGridData.forward
                // // 使用 chartGridData.reverse 作为电网反向功率数据
                // this.electricityOptions.series[5].data = chartGridData.reverse




                this.electricityData = {
                    categories: xAxis,
                    series: [
                        { name: "发电功率", data: chartData.solar },
                        { name: "负荷功率", data: chartData.consume },
                        { name: "充电功率", data: chartData.charge },
                        { name: "放电功率", data: chartData.discharge },
                        { name: "供电功率", data: chartGridData.forward },
                        { name: "馈电功率", data: chartGridData.reverse },
                    ]
                }

            }).finally(() => {
                this.eleLoading = false
            })
        },

        getPowerData3() {
            // this.electricityOptions.setTimeXAxis()
            // this.electricityOptions.setPowerSeries()

            let xAxis = this.getTimeXAxis();
            const sqSolarIds = [1052928, 1049269, 1049278, 1053066]
            const nyzSolarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
            const storageIds = this.nyzDeviceList.filter(item => item.type == 1).map(item => item.deviceId)
            Promise.all([
                sapi.findPowerByLevelIdsAndDate({
                    areaLevelIds: this.areaData[0].origin,
                    startDate: dateStandardFormat(this.powerDate),
                    endDate: dateStandardFormat(this.powerDate),
                }).catch(err => {
                    console.error(err)
                }),
                energy_new.queryStoragePowerCurve({
                    deviceIdList: sqSolarIds,
                    date: dateStandardFormat(this.powerDate)
                }).catch(err => {
                    console.error(err)
                }),
                energy_new.queryStoragePowerCurve({
                    deviceIdList: nyzSolarIds,
                    date: dateStandardFormat(this.powerDate)
                }).catch(err => {
                    console.error(err)
                }),
                nyz_new.queryStoragePowerCurve({
                    deviceIdList: storageIds,
                    date: dateStandardFormat(this.powerDate)
                }).catch(err => {
                    console.error(err)
                })
            ]).then(([sqConsumeResult, sqSolarResult, nyzSolarResult, nyzStorageResult]) => {
                let sqConsume = sqConsumeResult.data.consumePower.allConsumePower.reduce((pre, curr) => {
                    pre[curr.frameDatetime] = curr.forwardPower
                    return pre
                }, {})
                let chartData = xAxis.reduce((pre, curr) => {
                    // let consumeIdx = sqConsumeResult.data.consumePower.allConsumePower.findIndex(e => curr == this.$moment(e.frameDatetime).format("HH:mm"))
                    // consumeIdx > -1 ? pre.consume.push(sqConsumeResult.data.consumePower.allConsumePower[consumeIdx].forwardPower) : pre.consume.push("-")
                    let consumeKey = `${dateStandardFormat(this.powerDate)} ${curr}`
                    if (sqConsume.hasOwnProperty(consumeKey)) {
                        pre.consume.push(sqConsume[consumeKey])
                    } else {
                        pre.consume.push(0)
                    }

                    let key = `${dateStandardFormat(this.powerDate)} ${curr}:00`
                    if (nyzSolarResult.data.hasOwnProperty(key) || sqSolarResult.data.hasOwnProperty(key)) {
                        pre.solar.push(((Math.abs(nyzSolarResult.data[key]) || 0) + ((parseFloat(sqSolarResult.data[key]) / 1000) || 0)))
                    } else {
                        pre.solar.push(0)
                    }

                    if (nyzStorageResult.data.hasOwnProperty(key)) {
                        pre.charge.push(nyzStorageResult.data[key] <= 0 ? 0 : parseFloat(nyzStorageResult.data[key]))
                        pre.discharge.push(nyzStorageResult.data[key] >= 0 ? 0 : parseFloat(-nyzStorageResult.data[key]))
                    } else {
                        pre.charge.push(0)
                        pre.discharge.push(0)
                    }

                    return pre
                }, { consume: [], solar: [], charge: [], discharge: [] })

                this.electricityData = {
                    categories: xAxis,
                    series: [
                        { name: "发电功率", data: chartData.solar },
                        { name: "负荷功率", data: chartData.consume },
                        { name: "充电功率", data: chartData.charge },
                        { name: "放电功率", data: chartData.discharge },
                    ]
                }

            }).finally(() => {

            })
        },


        // 获取数组元素和
        getSum(arr) {
            if (arr.every(item => item == '--')) return '--'
            const sum = arr.reduce((acc, curr) => {
                if (curr == '--') {
                    return acc
                }
                return acc + parseFloat(curr)
            }, 0)
            return sum.toFixed(2)
        },
    }
}
</script>
<style lang="scss" scoped>
// 定义主题色
$primary-color: #165DFF;
$success-color: #00B42A;
$warning-color: #FF7D00;
$danger-color: #F53F3F;
$info-color: #86909C;
$light-bg: #F2F3F5;
$dark-bg: #E5E6EB;
$card-bg: #FFFFFF;
$text-color: #1D2129;
$border-color: #E5E6EB;
$shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
$hover-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

// 响应式断点
$breakpoint-mobile: 768px;
$breakpoint-tablet: 1024px;

// 动画效果
$transition: all 0.3s ease;
$animation-duration: 0.5s;

.container {
    // min-height: 100vh;
    // background-color: $light-bg;
    margin: 10rpx // padding: 20rpx;
}

/* 数据卡片 */
.card-section {
    // padding: 10rpx;
}

.card-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5rpx;
}

.card {
    width: 49.5%;
    background-color: #fff;
    border-radius: 10rpx;
    padding: 20rpx;
    display: flex;
    // flex-direction: column;
    align-items: center;
    justify-content: space-around
}

.card-item {
    display: flex;
    flex-direction: column;
}

.card-icon {
    width: 40rpx;
    height: 40rpx;
    // margin-bottom: 10rpx;
}

.card-title {
    font-size: 28rpx;
    color: #1a1a1a;
    margin-bottom: 10rpx;
}


.card-value {
    font-size: 28rpx;
    color: #4488FB;
    font-weight: bold;
}

.card-unit {
    font-size: 20rpx;
    text-align: right;
}

.chart-tab-bar {

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    border-bottom: 1px solid #e4e7ed
}


.chart-tabs {
    display: flex;
    /* gap: 24rpx; */
}

.chart-tab-item {
    padding: 12rpx 32rpx;
    margin: 0 2rpx;
    border: 1px solid #4488FB;
    color: #666;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    width: 120rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chart-tab-item.active {
    background: linear-gradient(135deg, #4488fb 0%, #6ca2ff 100%);
    color: #fff !important;
    box-shadow: 0 4rpx 12rpx rgba(68, 136, 251, 0.3);
}




// 系统架构图区域
.system-img {
    position: relative;
    height: 400rpx;
    background: $card-bg;
    border-radius: 8rpx;
    // box-shadow: $shadow;
    // margin: 20rpx 0;
    overflow: hidden;
    margin-bottom: 10rpx;

    // 背景图样式优化
    // &::before {
    //     content: '';
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     width: 100%;
    //     height: 100%;
    //     background: url('../static/images/system-architecture-new.png') no-repeat center;
    //     background-size: 90% auto;
    //     filter: brightness(1.05);
    //     transition: $transition;
    // }

    &:hover::before {
        transform: scale(1.02);
    }

    // 状态标签样式
    .detail-storage,
    .detail-grid,
    .detail-solar {
        position: absolute;
        // background: rgba(255, 255, 255, 0.9);
        border-radius: 12rpx;
        // padding: 12rpx 16rpx;
        // box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
        text-align: center;
        backdrop-filter: blur(4rpx);
        transition: $transition;

        &:hover {
            transform: translateY(-4rpx);
            box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
        }

        p {
            margin: 0;
        }

        p:first-child {
            font-size: 22rpx;
            font-weight: 500;
            color: $primary-color;
        }

        p:last-child {
            font-size: 22rpx;
            color: $primary-color;
        }
    }

    .detail-storage {
        top: 85%;
        left: 12%;
    }

    .detail-grid {
        top: 52%;
        right: unset;
        left: 1%
    }

    .detail-solar {
        top: 7%;
        left: 20%;
        // transform: translateX(-50%);
    }

    // 功率标签样式
    .power-label {
        position: absolute;
        // background: rgba(255, 255, 255, 0.8);
        border-radius: 8rpx;
        // padding: 6rpx 12rpx;
        // box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
        font-size: 20rpx;
        font-weight: 500;
        color: $primary-color;
        backdrop-filter: blur(4rpx);
        transition: $transition;

        &:hover {
            background: rgba(255, 255, 255, 0.95);
            transform: scale(1.05);
        }
    }
}


// 日期选择器样式
.custom-picker {
    border:unset;
    .uni-date__input {
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 12rpx;
        border: 1px solid $border-color;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: $text-color;
        background-color: $light-bg;
        transition: $transition;

        &:focus {
            border-color: $primary-color;
            box-shadow: 0 0 0 4rpx rgba(22, 93, 255, 0.1);
        }
    }
}

// 图表区域
.chart-container {
    //   display: grid;
    grid-template-columns: 1fr;
    gap: 20rpx;
    margin-top: 10rpx;
    background: #FFF;

    @media (min-width: $breakpoint-tablet) {
        grid-template-columns: repeat(2, 1fr);
    }

    .chart-card {
        // background: $card-bg;
        // border-radius: 8rpx;
        // padding: 24rpx;
        // box-shadow: $shadow;
        // transition: $transition;
        // padding-bottom: 10rpx;

        // &:hover {
        //     transform: translateY(-4rpx);
        //     box-shadow: $hover-shadow;
        // }

        .chart-title {
            font-size: 32rpx;
            font-weight: 600;
            color: $text-color;
            margin-bottom: 24rpx;
            position: relative;

            // &::before {
            //     content: '';
            //     position: absolute;
            //     left: 0;
            //     bottom: -8rpx;
            //     width: 60rpx;
            //     height: 4rpx;
            //     background-color: $primary-color;
            //     border-radius: 2rpx;
            // }
        }
    }
}

.empty-chart {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300rpx; // 与图表高度一致
    background-color: #f8f8f8;
    border-radius: 12rpx;

    .empty-text {
        color: #999;
        font-size: 28rpx;
    }
}

// 响应式布局调整
@media (max-width: $breakpoint-mobile) {
    //   .system-img {
    //     height: 300rpx;
    //   }

    .detail-storage,
    .detail-grid,
    .detail-solar {
        // padding: 8rpx 12rpx;

        p:first-child {
            font-size: 20rpx;
        }

        p:last-child {
            font-size: 24rpx;
        }
    }

    .power-label {
        // padding: 4rpx 8rpx;
        font-size: 20rpx;
    }

    .chart-card {
        padding: 20rpx;
        padding-bottom: 10rpx
    }

    .chart-title {
        font-size: 28rpx;
    }
}

// 竖屏布局优化
@media (orientation: portrait) {
    //   .system-img {
    //     height: 350rpx;
    //   }

    .detail-storage {
        top: 75%;
        left: 5%;
    }

    .detail-grid {
        top: 55%;
        right: 5%;
    }

    .detail-solar {
        top: 15%;
    }
}

// 横屏布局优化
@media (orientation: landscape) {
    //   .system-img {
    //     height: 300rpx;
    //   }

    .detail-storage {
        top: 70%;
        left: 10%;
    }

    .detail-grid {
        top: 50%;
        right: 10%;
    }

    .detail-solar {
        top: 15%;
    }

    .chart-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

// 动画效果
@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.05);
        opacity: 0.8;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

// 为数据卡片添加动画效果
.data-card {
    animation: fadeIn $animation-duration ease forwards;

    @for $i from 1 through 4 {
        &:nth-child(#{$i}) {
            animation-delay: $i * 0.1s;
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20rpx);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
