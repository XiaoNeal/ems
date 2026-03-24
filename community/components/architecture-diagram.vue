<template>
    <view class="container">
        <!-- 顶部导航栏 -->
        <!-- <view class="nav-bar">
            <view class="nav-title">光储直柔能源站EMS</view>
            <view class="nav-menu">
                <view class="nav-item active">架构图</view>
                <view class="nav-item">光伏</view>
                <view class="nav-item">储能</view>
                <view class="nav-item">电网</view>
                <view class="nav-item">负荷</view>
            </view>
        </view> -->

        <!-- 警告框和启动按钮 -->
        <view class="warning-and-start">
            <!-- 警告框 -->
            <view class="warning-box">
                <text class="warning-icon">⚠️</text>
                <view class="warning-content">
                    <text class="warning-title">能源基础电力装备 非专业禁止操作!</text>
                    <text class="warning-text">1.系统内置锂电光伏发电，电网断网后仍带电，</text>
                    <text class="warning-text">请谨慎操作;</text>
                    <text class="warning-text">2.长期断电将导致锂电过放报警，请联系厂家;</text>
                    <text class="warning-text">3.系统具备离网应急功能，请依需要谨慎配置和</text>
                    <text class="warning-text">管理使用。</text>
                </view>
            </view>

            <!-- 启动按钮 -->
            <view class="start-button">
                <view class="start-circle" @click="showStartModal">
                    <image src="../static/images/start.svg" class="start-bg" />
                    <text class="start-text">启动</text>
                </view>
            </view>
        </view>
        
        <!-- 自定义启动弹窗 -->
        <view class="modal-overlay" v-if="showModal" @click="closeModal">
            <view class="modal-content" @click.stop>
                <view class="modal-header">
                    <text class="modal-icon">⚠️</text>
                    <text class="modal-title">系统启动警告</text>
                </view>
                <view class="modal-body">
                    <text class="modal-text">启动后系统将开始运行，请确保所有设备连接正常。</text>
                    <text class="modal-text">确认启动系统？</text>
                </view>
                <view class="modal-footer">
                    <button class="modal-cancel" @click="closeModal">取消</button>
                    <button class="modal-confirm" @click="confirmStart">启动</button>
                </view>
            </view>
        </view>

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


            <view class="power-label" style="left: 20vw;top: 40%">
                {{ ((currentStatus['600a29b2cdf9e30600897f26'] ? currentStatus['600a29b2cdf9e30600897f26'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 35vw;top: 40%">
                {{ ((currentStatus['616e66f584c6e1930fa05917'] ? currentStatus['616e66f584c6e1930fa05917'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 50vw;top: 40%">
                {{ ((currentStatus['616e670d84c6e1930fa05919'] ? currentStatus['616e670d84c6e1930fa05919'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 65vw;top: 40%">
                {{ ((currentStatus['616e671a84c6e1930fa0591b'] ? currentStatus['616e671a84c6e1930fa0591b'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 20vw;top: 60%">
                {{ ((currentStatus['616e672b84c6e1930fa0591d'] ? currentStatus['616e672b84c6e1930fa0591d'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 35vw;top: 60%">
                {{ ((currentStatus['637dcbf0d326f0333863b971'] ? currentStatus['637dcbf0d326f0333863b971'].P : 0) /
                    1000).toFixed(1) }}kW
            </view>
            <view class="power-label" style="left: 50vw;top: 60%">
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
                        <image src="../static/images/consumption.png" class="card-icon"></image>
                        <text class="card-title">今日用电</text>
                    </view>
                    <view class="card-item">
                        <text class="card-value">{{ totalConsumptionQ.consumptionQData }} </text>
                        <text class="card-unit"> kWh</text>
                    </view>
                </view>
            </view>
            <view class="card-row">
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

                <view class="chart-date-info">
                    <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker"
                        v-model="selectedDate" class="custom-picker date-picker" />
                    <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker"
                        v-model="selectedDate" class="custom-picker date-picker" />
                    <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate"
                        class="custom-picker date-picker" />
                    <view class="fullscreen-button">
                        <text>全屏</text>
                    </view>
                </view>
            </view>
            <view class="chart-card">
                <h3 class="chart-title">能源</h3>
                <qiun-data-charts ref="energyChart"
                    v-if="electricityData.categories && electricityData.categories.length > 0" type="area"
                    :chartData="electricityData" :ontouch="true" :canvas2d="canvas2d" :opts="electricityOpts" />
                <view v-else class="empty-chart">
                    <text class="empty-text">暂无能源数据</text>
                </view>
                <view class="chart-legend">
                    <view class="legend-item">
                        <view class="legend-color" style="background-color: #1890FF;"></view>
                        <text>发电</text>
                    </view>
                    <view class="legend-item">
                        <view class="legend-color" style="background-color: #91CB74;"></view>
                        <text>负荷</text>
                    </view>
                    <view class="legend-item">
                        <view class="legend-color" style="background-color: #FAC858;"></view>
                        <text>充电</text>
                    </view>
                    <view class="legend-item">
                        <view class="legend-color" style="background-color: #EE6666;"></view>
                        <text>放电</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

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
import { realtimeDataProvider } from '@/service/websocket'; // 导入realtimeDataProvider
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
            showModal: false,
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
            const power1 = parseFloat(this.nyzData.storagePower1 || 0);
            const power2 = parseFloat(this.nyzData.storagePower2 || 0);
            const power = isNaN(power1) ? 0 : power1 + (isNaN(power2) ? 0 : power2);
            const status = power == 0 ? "不充不放" : power > 0 ? "充电中" : "放电中"
            return {
                power: power.toFixed(2),
                status
            }
        },

        totalLoadData() {
            const power1 = this.nyzData.loadPower1 == '--' ? '--' : (parseFloat(this.nyzData.loadPower1) || 0)
            const power2 = this.nyzData.loadPower2 == '--' ? '--' : (parseFloat(this.nyzData.loadPower2) || 0)
            const power3 = this.gridPower == '--' ? '--' : (parseFloat(this.gridPower) || 0)
            const power = this.getSum([power1, power2, power3])
            return { power }
        },

        totalConsumptionQ() {
            const provideQ = parseFloat(this.totalProvideQ || 0) || 0;
            const storageDisChargeQ = parseFloat(this.totalStorageDisChargeQ || 0) || 0;
            const gridForwardQ = parseFloat(this.dayEnergyData.totalGridForwardQ || 0) || 0;
            const gridReverseQ = parseFloat(this.dayEnergyData.totalGridReverseQ || 0) || 0;
            const storageChargeQ = parseFloat(this.totalStorageChargeQ || 0) || 0;
            const consumptionQData = provideQ + storageDisChargeQ + gridForwardQ - gridReverseQ - storageChargeQ;
            return { consumptionQData: consumptionQData.toFixed(2) }
        },

        totalSolarData() {
            const power1 = this.nyzData.photovoltaicPower1 == '--' ? '--' : Math.abs(parseFloat(this.nyzData.photovoltaicPower1) || 0)
            const power2 = this.nyzData.photovoltaicPower2 == '--' ? '--' : Math.abs(parseFloat(this.nyzData.photovoltaicPower2) || 0)
            let power3 = '--';
            if (this.selectedEnergyData.P !== '--' && !isNaN(this.selectedEnergyData.P)) {
                power3 = Math.abs(parseFloat(this.selectedEnergyData.P) / 1000).toFixed(2);
            }
            const power = this.getSum([power1, power2, power3])
            return {
                power
            }
        },

    },
    mounted() {
        // 初始化realtimeDataProvider
        realtimeDataProvider.createScoket(uni.getStorageSync('currentTemplate'), uni.getStorageSync('urlPrefix'));
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
        // 使用realtimeDataProvider替代getSocketinstance
        realtimeDataProvider.unregister();
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
            realtimeDataProvider.emit("register")
            realtimeDataProvider.on("center", (data) => {
                this.currentStatus = data;
            })

            // 总表电网实时数据
            this.gridPower = "--"
            // 获取社区的电网数据
            realtimeDataProvider.on("Grid", (data) => {
                if (data.data.B56) {
                    this.gridPower = (data.data.B56 / 1000).toFixed(3);
                }
            });

            // 获取箱子全部据 和 社区的光伏、储能、用电数据
            realtimeDataProvider.on("box", (data) => {
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
            realtimeDataProvider.emit("register")
            realtimeDataProvider.on("nyzData", (jsonData) => {
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
                            let socValue = parseFloat(data.B4);
                            // 确保SOC在0-100%之间
                            if (isNaN(socValue)) {
                                this.nyzData.SOC = "--";
                            } else {
                                let clampedSoc = Math.max(0, Math.min(100, socValue));
                                this.nyzData.SOC = clampedSoc.toFixed(2);
                            }
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
            // return this.$api.statistic.findHomeCommunityCapacitySumByLevelIds({}
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
                            let nyzIdx = res.data.findIndex(e => e.month == item)
                            if (nyzIdx > -1) {
                                solarIncome.push((res.data[nyzIdx].total_provide_q * 0.85).toFixed(2))
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
            }
        },

        setXAxisData(type, date) {
            let xAxisData = []
            if (type === 'hour') {
                for (let i = 0; i < 24; i++) {
                    xAxisData.push(i + ':00')
                }
            } else if (type === 'day') {
                const year = date.getFullYear()
                const month = date.getMonth() + 1
                const daysInMonth = new Date(year, month, 0).getDate()
                for (let i = 1; i <= daysInMonth; i++) {
                    xAxisData.push(i)
                }
            } else if (type === 'month') {
                for (let i = 1; i <= 12; i++) {
                    xAxisData.push(i)
                }
            }
            return xAxisData
        },

        getSum(arr) {
            if (arr.includes('--')) {
                return '--'
            }
            return arr.reduce((acc, val) => acc + val, 0)
        },

        getPowerData2() {
            upgrade.findDayEnergyAndIncome({
                day: dateStandardFormat(this.powerDate),
            }).then((result) => {
                if (result && result.data) {
                    let generationData = []
                    let loadData = []
                    let xAxisData = []
                    result.data.forEach((item) => {
                        generationData.push(item.provideQ)
                        loadData.push(item.consumptionQ)
                        xAxisData.push(item.hour)
                    })
                    this.electricityData = {
                        categories: xAxisData,
                        series: [
                            { data: generationData, name: '发电' },
                            { data: loadData, name: '用电' }
                        ]
                    }
                }
            })
        },
        // 显示启动弹窗
        showStartModal() {
            this.showModal = true;
        },
        // 关闭弹窗
        closeModal() {
            this.showModal = false;
        },
        // 确认启动
        confirmStart() {
            this.showModal = false;
            uni.showToast({
                title: '系统已启动',
                icon: 'success'
            });
        }
    }
}
</script>

<style scoped>
.container {
    padding-bottom: 50px;
}

.nav-bar {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 10px 15px;
}

.nav-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.nav-menu {
    display: flex;
    overflow-x: auto;
}

.nav-item {
    padding: 5px 15px;
    margin-right: 10px;
    border-radius: 15px;
    font-size: 14px;
    color: #666;
    white-space: nowrap;
}

.nav-item.active {
    background-color: #4488FB;
    color: white;
}

.system-img {
    position: relative;
    height: 200px;
    margin: 10px;
    border-radius: 4px;
    overflow: hidden;
    background-color: #f5f5f5;
}

.detail-storage,
.detail-grid,
.detail-solar {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
}

.detail-storage {
    top: 10px;
    left: 10px;
}

.detail-grid {
    top: 10px;
    right: 10px;
}

.detail-solar {
    bottom: 10px;
    left: 10px;
}

.power-label {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    z-index: 2;
}

.card-section {
    margin: 10px;
}

.card-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.card {
    flex: 1;
    background-color: #fff;
    border-radius: 4px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-right: 10px;
}

.card:last-child {
    margin-right: 0;
}

.card-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.card-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
}

.card-title {
    font-size: 14px;
    color: #666;
}

.card-value {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.card-unit {
    font-size: 14px;
    color: #666;
}

.chart-container {
    margin: 10px;
    background-color: #fff;
    border-radius: 4px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-tab-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.chart-tabs {
    display: flex;
}

.chart-tab-item {
    padding: 8rpx 20rpx;
    margin-right: 10rpx;
    border-radius: 20rpx;
    font-size: 20rpx;
    cursor: pointer;
    font-weight: bold;
}

.chart-date-info {
    display: flex;
    align-items: center;
}

.date-picker {
    margin-right: 15rpx;
}

.fullscreen-button {
    padding: 8rpx 16rpx;
    border: 1px solid #4488FB;
    border-radius: 4rpx;
    font-size: 16rpx;
    color: #4488FB;
    cursor: pointer;
}

.chart-card {
    margin-bottom: 20px;
}

.chart-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
}

.empty-chart {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 4px;
}

.empty-text {
    font-size: 14px;
    color: #999;
}

.chart-legend {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}

.legend-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    font-size: 12px;
    color: #666;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-right: 5px;
}

.warning-and-start {
    margin: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FFF7E6;
    border: 1px solid #FFD1CF;
    border-radius: 8rpx;
    padding: 15rpx;
}

.warning-box {
    flex: 1;
    display: flex;
    align-items: flex-start;
}

.warning-icon {
    font-size: 24rpx;
    margin-right: 10rpx;
    margin-top: 2rpx;
}

.warning-content {
    flex: 1;
}

.warning-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #4488fb;
    margin: 0 0 5rpx 0;
    display: block;
    text-align: center;
}

.warning-text {
    font-size: 20rpx;
    color: #666666;
    margin: 0 0 2rpx 0;
    line-height: 1.4;
    display: block;
    text-align: left;
}

.start-button {
    margin-left: 20rpx;
}

.start-circle {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.start-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: 1;
}

.start-text {
    color: #4488fb;
    font-size: 24rpx;
    font-weight: bold;
    position: relative;
    z-index: 2;
}

/* 自定义弹窗样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    width: 80%;
    max-width: 500rpx;
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.modal-header {
    padding: 32rpx;
    background-color: #FFFAF0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1rpx solid #FFE5B4;
}

.modal-icon {
    font-size: 40rpx;
    margin-right: 16rpx;
    color: #F56C6C;
}

.modal-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #F56C6C;
}

.modal-body {
    padding: 32rpx;
    line-height: 1.6;
}

.modal-text {
    display: block;
    font-size: 22rpx;
    color: #606266;
    margin-bottom: 20rpx;
    text-align: center;
}

.modal-footer {
    display: flex;
    border-top: 1rpx solid #EBEEF5;
    height: 88rpx;
}

.modal-cancel {
    flex: 1;
    background-color: #fff;
    border: none;
    font-size: 24rpx;
    color: #909399;
    border-right: 1rpx solid #EBEEF5;
}

.modal-confirm {
    flex: 1;
    background-color: #F56C6C;
    border: none;
    font-size: 24rpx;
    color: #fff;
}
</style>