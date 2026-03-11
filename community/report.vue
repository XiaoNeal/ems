<template>
    <view class="container">

        <view class="table-head mobile-table-head" style="padding:unset">
            <!-- 使用flex布局垂直排列筛选条件 -->
            <view class="filter-group">
                <view class="filter-item">
                    <text class="filter-label">区域</text>
                    <view class="selector-container">
                        <picker :value="selectedIndex" :range="areaOptions" @change="handleAreaChange"
                            class="area-picker">
                            <view class="picker-content">
                                {{ areaOptions[selectedIndex] || '请选择区域' }}
                            </view>
                        </picker>
                    </view>
                </view>

                <view class="filter-item">
                    <text class="filter-label">统计方式</text>
                    <view class="report-type-picker">
                        <picker :value="reportTypeIndex" :range="reportTypeOptions" @change="handleReportTypeChange"
                            class="type-selector">
                            <view class="picker-label">
                                {{ reportTypeOptions[reportTypeIndex] || '选择报表类型' }}
                            </view>
                        </picker>
                    </view>
                </view>
            </view>

            <!-- 时间选择器 -->
            <view class="filter-item time-select">
                <text v-if="selectedReportType !== 'week'" class="filter-label">时间区间</text>
                <view class="select">
                    <dy-date v-if="selectedReportType === 'date'" timeType="day" @getData="datePickerChange"
                        v-model="datePicker" class="custom-date-picker" />
                    <dy-date v-else-if="selectedReportType === 'month'" timeType="month" @getData="monthPickerChange"
                        v-model="monthPicker" class="custom-date-picker" />
                    <dy-date v-else-if="selectedReportType === 'year'" timeType="year" @getData="yearPickerChange"
                        v-model="yearPicker" class="custom-date-picker" />
                </view>
            </view>
        </view>
        <view class="table">
            <DateReport v-if="selectedReportType === 'date'" :dateReportData="dateReportData"
                :selectedName="selectedName" :ExportFlag="ExportFlag" :loading="loading">
            </DateReport>
            <WeekReport v-if="selectedReportType === 'week'" :weekReportData="weekReportData" :ExportFlag="ExportFlag"
                :loading="loading" :width="width"></WeekReport>
            <MonthReport v-if="selectedReportType === 'month'" :monthReportData="monthReportData"
                :selectedName="selectedName" :ExportFlag="ExportFlag" :loading="loading">
            </MonthReport>
            <YearReport v-if="selectedReportType === 'year'" :yearReportData="yearReportData" :loading="loading">
            </YearReport>

        </view>


    </view>
</template>

<script>
import DateReport from "./components/dateReport";
import WeekReport from "./components/weekReport";
import MonthReport from "./components/monthReport";
import YearReport from "./components/yearReport";
// import deviceConfig from '@/service/config/devices'
import center from '@/api/center'
import statistic from '@/api/statistic'
import { mapGetters } from 'vuex'; // 引入 mapGetters

import nyz_new from '@/api/nyz_new'
import energy_new from '@/api/energy_new'
import dyDate from '@/components/dy-Date/dy-Date.vue';
export default {
    name: "report",
    components: { DateReport, WeekReport, MonthReport, YearReport, dyDate },
    data: function () {
        return {
            current: "areaReport",
            // userInfo: JSON.parse(localStorage.getItem("userInfo")),
            loading: true,
            selectedReportType: "date",
            selectedAreaId: "", // 被选择区域的唯一标识id(mongo中区别任一对象的id)
            areaLevelId: [],
            selectedLevel: 0,
            selectedName: "",
            datePicker: new Date().toISOString().split('T')[0],
            monthPicker: this.$moment().format('YYYY-MM'),
            yearPicker: this.$moment().format('YYYY'),
            areaData: [], // 选择区域的数据


            reportTypeData: [
                {
                    id: "001",
                    value: "date",
                    name: "日报表",
                },
                {
                    id: "002",
                    value: "week",
                    name: "周报表",
                },
                {
                    id: "003",
                    value: "month",
                    name: "月报表",
                },
                {
                    id: "004",
                    value: "year",
                    name: "年报表",
                },
            ],

            dateReportData: [], // 日报表数据
            weekReportData: [], // 周报表数据
            monthReportData: [], // 月报表数据
            yearReportData: [], // 年报表数据
            ExportFlag: 0, // 是否导出: 只要该值发生改变,就进行导出操作
            // 每个箱子的Id => name
            boxIdName: {
                381: "1号箱",
                382: "2号箱",
                383: "3号箱",
                384: "4号箱",
                385: "5号箱",
                386: "6号箱",
                387: "7号箱",
                388: "8号箱",
                389: "9号箱",
                401: "10/11号箱",
                402: "12号箱",
                403: "13号箱",
                502: "14号箱",
                503: "15号箱",
                504: "16号箱",
                505: "17号箱",
                506: "18号箱",
                399: "光伏墙",
                400: "车库",
                545: "数据中心",
                566: "19号箱",
                567: "20号箱",
                568: "21号箱",
                569: "22号箱",
            },


            areaOptions: [],
            selectedIndex: 0,
            reportTypeIndex: 0,
            reportTypeOptions: [],
        }
    },
    computed: {
        userInfo() {
            return {
                _id: "60054086019dcc42e41c91f7",
                username: "homeAdmin",
                name: "NEIIC 国创联能",
                __v: 0,
                role: {
                    _id: "60068a98fa3cf1513b206a74",
                    name: "admin",
                    description: "管理员"
                },
                level: "admin"
            }
        },
        ...mapGetters([
            'currentSystem'
        ]),
        nyzDeviceList() {
            return this.currentSystem ? this.currentSystem.ammeterList : [];
        },
    },
    methods: {


        // 从后台koa获取下拉框的数据
        getAreaData() {
            // 获取社区、分中心、全部箱子
            center
                .getCenterList({ roleId: this.userInfo.role._id })
                .then((result) => {
                    if (result && result.data) {
                        this.areaData = result.data;
                        this.areaData.sort((a, b) => {
                            if (a.level !== b.level) {
                                return a.level - b.level;
                            } else {
                                return a.origin[0] - b.origin[0];
                            }
                        });
                        this.areaData.push({
                            origin: [545],
                            name: "数据中心",
                            level: 2,
                            _id: 0,
                            role: "60068a98fa3cf1513b206a74",
                        });
                        // console.log(this.areaData);
                        this.selectedAreaId = this.areaData[0]._id;
                        this.areaLevelId = this.areaData[0].origin;
                        this.selectedLevel = this.areaData[0].level;
                        this.selectedName = this.areaData[0].name;
                        this.areaOptions = this.areaData.map(item => item.name);
                    }
                });
        },

        // 获取能源站光伏储能数据
        async getNyzData() {
            // let solarIds = deviceConfig.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
            // let storageIds = deviceConfig.nyzDeviceList.filter(item => item.type == 1).map(item => item.deviceId)
            // let consumIds = deviceConfig.nyzDeviceList.filter(item => item.type == 3).map(item => item.deviceId)
            // let gridIds = deviceConfig.nyzDeviceList.filter(item => item.type == 4).map(item => item.deviceId)

            let solarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
            let storageIds = this.nyzDeviceList.filter(item => item.type == 1).map(item => item.deviceId)
            let consumIds = this.nyzDeviceList.filter(item => item.type == 3).map(item => item.deviceId)
            let gridIds = this.nyzDeviceList.filter(item => item.type == 4).map(item => item.deviceId)
            let pMap = {
                'date': [
                    energy_new.findEveryHourByDeviceIds({
                        deviceIds: solarIds,
                        day: this.$moment(this.datePicker).format("YYYY-MM-DD")
                    }),
                    nyz_new.findEveryHourByDeviceIds({
                        deviceIds: storageIds,
                        day: this.$moment(this.datePicker).format("YYYY-MM-DD")
                    }),
                    energy_new.findEveryHourByDeviceIds({
                        deviceIds: consumIds,
                        day: this.$moment(this.datePicker).format("YYYY-MM-DD")
                    }),
                    energy_new.findEveryHourByDeviceIds({
                        deviceIds: gridIds,
                        day: this.$moment(this.datePicker).format("YYYY-MM-DD")
                    })
                ],
                'month': [
                    energy_new.findEveryDayByDeviceIds({
                        deviceIds: solarIds,
                        year: this.$moment(this.monthPicker).format("YYYY"),
                        month: this.$moment(this.monthPicker).format("MM")
                    }),
                    nyz_new.findEveryDayByDeviceIds({
                        deviceIds: storageIds,
                        year: this.$moment(this.monthPicker).format("YYYY"),
                        month: this.$moment(this.monthPicker).format("MM")
                    }),
                    energy_new.findEveryDayByDeviceIds({
                        deviceIds: consumIds,
                        year: this.$moment(this.monthPicker).format("YYYY"),
                        month: this.$moment(this.monthPicker).format("MM")
                    }),
                    energy_new.findEveryDayByDeviceIds({
                        deviceIds: gridIds,
                        year: this.$moment(this.monthPicker).format("YYYY"),
                        month: this.$moment(this.monthPicker).format("MM")
                    })
                ],
                'year': [

                    energy_new.findEveryMonthByDeviceIds({
                        deviceIds: solarIds,
                        year: this.$moment(this.yearPicker).format("YYYY")
                    }),
                    nyz_new.findEveryMonthByDeviceIds({
                        deviceIds: storageIds,
                        year: this.$moment(this.yearPicker).format("YYYY")
                    }),
                    energy_new.findEveryMonthByDeviceIds({
                        deviceIds: consumIds,
                        year: this.$moment(this.yearPicker).format("YYYY")
                    }),
                    energy_new.findEveryMonthByDeviceIds({
                        deviceIds: gridIds,
                        year: this.$moment(this.yearPicker).format("YYYY")
                    })
                ]
            }
            const fieldMap = { 'date': 'hour', 'month': 'date', 'year': 'month' }
            let [solarResult, storageResult, consumResult, gridResult] = await Promise.all(pMap[this.selectedReportType])
            let data = solarResult.data.reduce((pre, curr) => {
                let time = curr[fieldMap[this.selectedReportType]]
                // pre.time.push(time)
                // pre.solar.push(curr.total_provide_q)
                let idx = storageResult.data.findIndex(item => item[fieldMap[this.selectedReportType]] == time)
                let consumIdx = consumResult.data.findIndex(item => item[fieldMap[this.selectedReportType]] == time)
                let gridIndex = gridResult.data.findIndex(item => item[fieldMap[this.selectedReportType]] == time)
                if (idx > -1) {
                    pre.push({
                        time,
                        solar: curr.total_provide_q,
                        storageCharge: storageResult.data[idx].total_storage_forward_q,
                        storageDischarge: storageResult.data[idx].total_storage_reverse_q,
                        consum: consumResult.data[consumIdx].total_consume_electricity_q,
                        gridForwardQ: gridResult.data[gridIndex].total_grid_forward_q,
                        gridReverseQ: gridResult.data[gridIndex].total_grid_reverse_q
                    })
                    // pre.storageCharge.push(storageResult.data[idx].total_storage_forward_q)
                    // pre.storageDischarge.push(storageResult.data[idx].total_storage_reverse_q)
                } else {
                    pre.push({
                        time,
                        solar: curr.total_provide_q,
                        storageCharge: null,
                        storageDischarge: null,
                        consum: null,
                        gridForwardQ: null,
                        gridReverseQ: null
                    })

                }
                return pre
            }, [])
            return data
        },

        // 从后台koa获取日报表数据
        getDateReportData() {
            this.loading = true;
            // 获取每个箱子的日报表数据
            if (this.selectedLevel === 2) {
                statistic
                    .findDayStatisticsDetailsByLevelIdAndDay({
                        id: this.selectedAreaId,
                        day: this.$moment(this.datePicker).format("YYYY-MM-DD"),
                    })
                    .then((result) => {
                        if (result && result.data && result.data.dayStatisticsData) {
                            result.data.dayStatisticsData.forEach((item) => {
                                let dailyData = {};
                                dailyData.dailyAreaName = this.selectedName;
                                dailyData.dailydate = item.date;
                                dailyData.dailyHour = item.hour;
                                dailyData.dailyGeneratingElectrical = item.total_provide_q;

                                dailyData.dailyStorageDischarging =
                                    item.total_storage_forward_q;
                                dailyData.dailyStorageCharging = item.total_storage_reverse_q;

                                dailyData.dailyElectricityConsumption = item.total_consume_electricity_q !== undefined && item.total_consume_electricity_q !== null
                                    ? Math.max(item.total_consume_electricity_q, 0)
                                    : '--';

                                dailyData.dailyPowerGridPowerSupply = item.total_grid_forward_q;
                                dailyData.dailyPowerGridPowerFeed = item.total_grid_reverse_q;

                                dailyData.dailyAirConditioner = "--";
                                dailyData.dailyIllumination = "--";
                                dailyData.dailyComputer = "--";
                                dailyData.dailyOthers = "--";
                                //车库目前仅安装了发电侧计量模块，储能及电网侧无计量，且车库无用电，发电=馈电，后续安装储能及电网侧计量后，相关代码需删除。
                                if (item.areaLevelId == 400 || item.areaLevelId == 399) {
                                    dailyData.dailyElectricityConsumption = 0;
                                    dailyData.dailyPowerGridPowerFeed =
                                        item.total_consume_electricity_q;
                                }
                                this.dateReportData.push(dailyData);

                            });
                        } else {
                            this.dateReportData = [];
                        }
                        this.loading = false;
                    });
            } else {

                // 获取光伏未来社区、分中心的日报表数据
                statistic
                    .findDayStatisticsDetailsByLevelIdsAndDay({
                        roleId: this.userInfo.role._id,
                        id: this.selectedAreaId,
                        date: this.$moment(this.datePicker).format("YYYY-MM-DD"),
                    })
                    .then(async (result) => {
                        if (result?.data) {
                            const isDefaultArea = this.selectedAreaId === this.areaData[0]?._id;
                            const nyzData = isDefaultArea ? await this.getNyzData() : null;

                            const createDailyData = (item, nyzItem) => {
                                const {
                                    total_provide_q,
                                    total_storage_forward_q,
                                    total_storage_reverse_q,
                                    total_consume_electricity_q,
                                    total_grid_forward_q,
                                    total_grid_reverse_q,
                                    date,
                                    hour
                                } = item;

                                return {
                                    dailyAreaName: this.selectedName,
                                    dailydate: date,
                                    dailyHour: hour,
                                    dailyGeneratingElectrical: nyzItem
                                        ? Number((total_provide_q + nyzItem.solar).toFixed(2))
                                        : total_provide_q,
                                    dailyStorageDischarging: nyzItem
                                        ? Number((total_storage_forward_q + nyzItem.storageDischarge).toFixed(2))
                                        : total_storage_forward_q,
                                    dailyStorageCharging: nyzItem
                                        ? Number((total_storage_reverse_q + nyzItem.storageCharge).toFixed(2))
                                        : total_storage_reverse_q,
                                    dailyElectricityConsumption: nyzItem
                                        ? Number((total_consume_electricity_q + nyzItem.consum).toFixed(2))
                                        : total_consume_electricity_q,
                                    dailyPowerGridPowerSupply: nyzItem
                                        ? Number((total_grid_forward_q + nyzItem.gridForwardQ).toFixed(2))
                                        : total_grid_forward_q,
                                    dailyPowerGridPowerFeed: nyzItem
                                        ? Number((total_grid_reverse_q + nyzItem.gridReverseQ).toFixed(2))
                                        : total_grid_reverse_q,
                                    dailyAirConditioner: "--",
                                    dailyIllumination: "--",
                                    dailyComputer: "--",
                                    dailyOthers: "--"
                                };
                            };

                            this.dateReportData = result.data.map(item => {
                                if (!isDefaultArea) return createDailyData(item);

                                const nyzIndex = nyzData.findIndex(e => e.time === item.hour);
                                return createDailyData(item, nyzIndex > -1 ? nyzData[nyzIndex] : null);
                            });
                        } else {
                            this.dateReportData = [];
                        }
                        this.loading = false;
                    })
                    .catch(err => {
                        console.error(err)
                    });
            }
        },

        // 从后台koa获取周报表数据
        // ... 已有代码 ...
        getWeekReportData() {
            this.loading = true;
            this.width = "auto";
            let areaLevelIds = this.areaLevelId.sort();
            areaLevelIds.includes(545) || areaLevelIds.push(545);

            // 设置一周的起始日为周一
            this.$moment.locale('zh-cn', {
                week: {
                    dow: 1 // 周一为一周的第一天
                }
            });

            // 获取当前周的周一和周日日期
            const currentDate = this.$moment(this.currentDate);
            const startOfWeek = currentDate.clone().startOf('week');
            const endOfWeek = currentDate.clone().endOf('week');
            const weekDates = [];
            for (let i = 0; i < 7; i++) {
                weekDates.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'));
            }

            energy_new
                .findStatisticsDayByLevelIdsAndDays({
                    // roleId: this.userInfo.role._id,
                    areaLevelIds,
                    date: this.$moment(this.currentDate).format("YYYY-MM-DD"),
                })
                .then((result) => {
                    // console.log(result);
                    if (result && result.data) {
                        // 过滤掉 areaLevelId 值为 372 的数据
                        const filteredData = result.data.filter(element => {
                            return element.length > 0 && element[0].areaLevelId !== 372;
                        });
                        this.weekReportData = [];
                        filteredData.forEach((element) => {
                            let weekData = {};
                            const areaLevelId = element[0].areaLevelId;
                            weekData.weekAreaName = this.boxIdName[areaLevelId];

                            // 初始化一周的数据为默认值
                            weekDates.forEach((date, index) => {
                                const indexWeek = index + 1;
                                weekData[`GeneratingElectrical${indexWeek}`] = '--';
                                weekData[`StorageCharging${indexWeek}`] = '--';
                                weekData[`StorageDischarging${indexWeek}`] = '--';
                                weekData[`ElectricityConsumption${indexWeek}`] = '--';
                                weekData[`PowerGridPowerSupply${indexWeek}`] = '--';
                                weekData[`PowerGridPowerFeed${indexWeek}`] = '--';
                            });

                            // 用实际数据覆盖默认值
                            element.forEach((item) => {
                                const dateIndex = weekDates.indexOf(item.date);
                                if (dateIndex > -1) {
                                    const indexWeek = dateIndex + 1;
                                    // 判断数据是否为 0 或无数据
                                    weekData[`GeneratingElectrical${indexWeek}`] = item.total_provide_q !== undefined && item.total_provide_q !== null ? item.total_provide_q : '--';
                                    weekData[`StorageCharging${indexWeek}`] = item.total_storage_reverse_q !== undefined && item.total_storage_reverse_q !== null ? item.total_storage_reverse_q : '--';
                                    weekData[`StorageDischarging${indexWeek}`] = item.total_storage_forward_q !== undefined && item.total_storage_forward_q !== null ? item.total_storage_forward_q : '--';
                                    // 判断数据是否为 undefined、null 或负值，负值显示 0
                                    weekData[`ElectricityConsumption${indexWeek}`] = item.total_consume_electricity_q !== undefined && item.total_consume_electricity_q !== null
                                        ? Math.max(item.total_consume_electricity_q, 0)
                                        : '--';
                                    weekData[`PowerGridPowerSupply${indexWeek}`] = item.total_grid_forward_q !== undefined && item.total_grid_forward_q !== null ? item.total_grid_forward_q : '--';
                                    weekData[`PowerGridPowerFeed${indexWeek}`] = item.total_grid_reverse_q !== undefined && item.total_grid_reverse_q !== null ? item.total_grid_reverse_q : '--';
                                }
                            });

                            this.weekReportData.push(weekData);
                        });
                    }
                    this.loading = false;
                    this.width = "3500";
                });
        },
        // ... 已有代码 ...
        // 从后台koa获取月报表数据
        getMonthReportData() {
            this.loading = true;
            // 获取每个箱子的月报表数据
            if (this.selectedLevel === 2) {
                statistic
                    .findMonthStatisticsDetailsByLevelIdAndMonth({
                        id: this.selectedAreaId,
                        year: this.$moment(this.monthPicker).format("YYYY"),
                        month: this.$moment(this.monthPicker).format("MM"),
                    })
                    .then((result) => {
                        if (result && result.data) {
                            result.data.forEach((item) => {
                                let monthData = {};
                                monthData.monthAreaName = this.selectedName;
                                monthData.month = item.month == null ? "--" : item.month;
                                monthData.monthday = item.day == null ? "--" : item.day;
                                monthData.monthGeneratingElectrical =
                                    item.provideQDetailModel.provideQ == null
                                        ? "--"
                                        : item.provideQDetailModel.provideQ;
                                // monthData.monthGeneratingElectricalMonthByMonthPercent = item.provideQDetailModel.monthByMonthPercent==null ? "--" : item.provideQDetailModel.monthByMonthPercent;
                                // monthData.monthGeneratingElectricalYearByYearPercent = item.provideQDetailModel.yearByYearPercent==null ? "--" : item.provideQDetailModel.yearByYearPercent;
                                monthData.monthStorageCharging =
                                    item.storageQDetailModel.storageReverseQ == null
                                        ? "--"
                                        : item.storageQDetailModel.storageReverseQ;
                                monthData.monthStorageDischarging =
                                    item.storageQDetailModel.storageForwardQ == null
                                        ? "--"
                                        : item.storageQDetailModel.storageForwardQ;
                                // monthData.monthStorageSOC = item.storageQDetailModel.soc==null ? "--" : item.storageQDetailModel.soc;
                                monthData.monthElectricityConsumption =
                                    item.consumptionQDetailModel.consumptionQ == null
                                        ? "--"
                                        : item.consumptionQDetailModel.consumptionQ;
                                // monthData.monthElectricityConsumptionMonthByMonthPercent = item.consumptionQDetailModel.monthByMonthPercent==null ? "--" : item.consumptionQDetailModel.monthByMonthPercent;
                                // monthData.monthElectricityConsumptionYearByYearPercent = item.consumptionQDetailModel.yearByYearPercent==null ? "--" : item.consumptionQDetailModel.yearByYearPercent;
                                monthData.monthPowerGridPowerSupply =
                                    item.gridQDetailModel.gridForwardQ == null
                                        ? "--"
                                        : item.gridQDetailModel.gridForwardQ;
                                monthData.monthPowerGridPowerFeed =
                                    item.gridQDetailModel.gridReverseQ == null
                                        ? "--"
                                        : item.gridQDetailModel.gridReverseQ;
                                // monthData.monthPowerGridPeakToAverageRatio = item.gridQDetailModel.peakNormalRadio==null ? "--" : item.gridQDetailModel.peakNormalRadio;
                                monthData.monthAirConditioner = "--";
                                monthData.monthIllumination = "--";
                                monthData.monthComputer = "--";
                                monthData.monthOthers = "--";
                                //车库目前仅安装了发电侧计量模块，储能及电网侧无计量，且车库无用电，发电=馈电，后续安装储能及电网侧计量后，相关代码需删除。
                                if (
                                    result.selectedAreaId == 400 ||
                                    result.selectedAreaId == 399
                                ) {
                                    monthData.monthElectricityConsumption = 0;
                                    // monthData.monthElectricityConsumptionMonthByMonthPercent = "--";
                                    // monthData.monthElectricityConsumptionYearByYearPercent = "--";
                                    monthData.monthPowerGridPowerFeed =
                                        item.consumptionQDetailModel.consumptionQ;
                                }
                                this.monthReportData.push(monthData);
                            });
                        } else {
                            this.monthReportData = [];
                        }
                        this.loading = false;
                    });
            } else {
                // 获取光伏未来社区、分中心的月报表数据
                statistic
                    .findMonthStatisticsDetailsByLevelIdsAndMonth({
                        roleId: this.userInfo.role._id,
                        id: this.selectedAreaId,
                        year: this.$moment(this.monthPicker).format("YYYY"),
                        month: this.$moment(this.monthPicker).format("MM"),
                    })
                    .then(async (result) => {
                        if (result && result.data) {
                            if (this.selectedAreaId == this.areaData[0]._id) {
                                let nyzData = await this.getNyzData()
                                result.data.forEach((item) => {
                                    let monthData = {};
                                    let idx = nyzData.findIndex(e => e.time == item.date)
                                    if (idx > -1) {
                                        monthData.monthGeneratingElectrical = ((item.total_provide_q == null ? 0 : item.total_provide_q) + nyzData[idx].solar).toFixed(2)
                                        monthData.monthStorageDischarging = ((item.total_storage_forward_q == null ? 0 : item.total_storage_forward_q) + nyzData[idx].storageDischarge).toFixed(2)
                                        monthData.monthStorageCharging = ((item.total_storage_reverse_q == null ? 0 : item.total_storage_reverse_q) + nyzData[idx].storageCharge).toFixed(2)
                                        monthData.monthElectricityConsumption = ((item.total_consume_electricity_q == null ? "--" : item.total_consume_electricity_q) + nyzData[idx].consum).toFixed(2);
                                        monthData.monthPowerGridPowerSupply =
                                            ((item.total_grid_forward_q == null ? 0 : item.total_grid_forward_q) + nyzData[idx].gridForwardQ).toFixed(2);
                                        monthData.monthPowerGridPowerFeed =
                                            ((item.total_grid_reverse_q == null ? 0 : item.total_grid_reverse_q) + nyzData[idx].gridReverseQ).toFixed(2);
                                    } else {
                                        monthData.monthGeneratingElectrical = item.total_provide_q == null ? "--" : item.total_provide_q
                                        monthData.monthStorageDischarging = item.total_storage_forward_q == null ? "--" : item.total_storage_forward_q
                                        monthData.monthStorageCharging = item.total_storage_reverse_q == null ? "--" : item.total_storage_reverse_q
                                        monthData.monthElectricityConsumption = item.total_consume_electricity_q == null ? "--" : item.total_consume_electricity_q;
                                        monthData.monthPowerGridPowerSupply =
                                            item.total_grid_forward_q == null ? "--" : item.total_grid_forward_q;
                                        monthData.monthPowerGridPowerFeed =
                                            item.total_grid_reverse_q == null ? "--" : item.total_grid_reverse_q;
                                    }
                                    monthData.monthAreaName = this.selectedName;
                                    monthData.monthday = item.date == null ? "--" : item.date;
                                    // monthData.monthPowerGridPowerSupply =
                                    //     item.total_grid_forward_q == null ? "--" : item.total_grid_forward_q;
                                    // monthData.monthPowerGridPowerFeed =
                                    //     item.total_grid_reverse_q == null ? "--" : item.total_grid_reverse_q;
                                    monthData.monthAirConditioner = "--";
                                    monthData.monthIllumination = "--";
                                    monthData.monthComputer = "--";
                                    monthData.monthOthers = "--";
                                    this.monthReportData.push(monthData);
                                });
                            } else {
                                result.data.forEach((item) => {
                                    let monthData = {};
                                    monthData.monthAreaName = this.selectedName;
                                    monthData.monthday = item.date == null ? "--" : item.date;
                                    monthData.monthGeneratingElectrical =
                                        item.total_provide_q == null ? "--" : item.total_provide_q;
                                    // monthData.monthGeneratingElectricalMonthByMonthPercent = "--";
                                    // monthData.monthGeneratingElectricalYearByYearPercent = "--";
                                    monthData.monthStorageCharging =
                                        item.total_storage_reverse_q == null
                                            ? "--"
                                            : item.total_storage_reverse_q;
                                    monthData.monthStorageDischarging =
                                        item.total_storage_forward_q == null
                                            ? "--"
                                            : item.total_storage_forward_q;
                                    // monthData.monthStorageSOC = "--";
                                    monthData.monthElectricityConsumption =
                                        item.total_consume_electricity_q == null
                                            ? "--"
                                            : item.total_consume_electricity_q;
                                    // monthData.monthElectricityConsumptionMonthByMonthPercent = item.total_consume_gas_q==null ? "--" : item.total_consume_gas_q;
                                    // monthData.monthElectricityConsumptionYearByYearPercent = item.total_consume_water_q==null ? "--" : item.total_consume_water_q;
                                    monthData.monthPowerGridPowerSupply =
                                        item.total_grid_forward_q == null
                                            ? "--"
                                            : item.total_grid_forward_q;
                                    monthData.monthPowerGridPowerFeed =
                                        item.total_grid_reverse_q == null
                                            ? "--"
                                            : item.total_grid_reverse_q;
                                    // monthData.monthPowerGridPeakToAverageRatio = "--";
                                    monthData.monthAirConditioner = "--";
                                    monthData.monthIllumination = "--";
                                    monthData.monthComputer = "--";
                                    monthData.monthOthers = "--";
                                    this.monthReportData.push(monthData);
                                });
                            }
                        } else {
                            this.monthReportData = [];
                        }
                        this.loading = false;
                    });
            }
        },
        // 从后台koa获取年报表数据
        getYearReportData() {
            this.loading = true;
            // 获取每个箱子的年报表数据
            if (this.selectedLevel === 2) {
                statistic
                    .findYearStatisticsDetailsByLevelIdAndYear({
                        id: this.selectedAreaId,
                        year: this.$moment(this.yearPicker).format("YYYY"),
                    })
                    .then((result) => {
                        if (result && result.data) {
                            result.data.forEach((item) => {
                                let yearData = {};
                                yearData.yearAreaName = this.selectedName;
                                yearData.yearMonth = item.month == null ? "--" : item.month;
                                yearData.yearGeneratingElectrical =
                                    item.provideQDetailModel.provideQ == null
                                        ? "--"
                                        : item.provideQDetailModel.provideQ;
                                // yearData.yearGeneratingElectricalMonthByMonthPercent = item.provideQDetailModel.monthByMonthPercent == null ? "--" : item.provideQDetailModel.monthByMonthPercent;
                                // yearData.yearGeneratingElectricalYearByYearPercent = item.provideQDetailModel.yearByYearPercent == null ? "--" : item.provideQDetailModel.yearByYearPercent;
                                yearData.yearStorageCharging =
                                    item.storageQDetailModel.storageReverseQ == null
                                        ? "--"
                                        : item.storageQDetailModel.storageReverseQ;
                                yearData.yearStorageDischarging =
                                    item.storageQDetailModel.storageForwardQ == null
                                        ? "--"
                                        : item.storageQDetailModel.storageForwardQ;
                                // yearData.yearStorageSOC = item.storageQDetailModel.soc == null ? "--" : item.storageQDetailModel.soc;
                                yearData.yearElectricityConsumption =
                                    item.consumptionQDetailModel.consumptionQ == null
                                        ? "--"
                                        : item.consumptionQDetailModel.consumptionQ;
                                // yearData.yearElectricityConsumptionMonthByMonthPercent = item.consumptionQDetailModel.monthByMonthPercent == null ? "--" : item.consumptionQDetailModel.monthByMonthPercent;
                                // yearData.yearElectricityConsumptionYearByYearPercent = item.consumptionQDetailModel.yearByYearPercent == null ? "--" : item.consumptionQDetailModel.yearByYearPercent;
                                yearData.yearPowerGridPowerSupply =
                                    item.gridQDetailModel.gridForwardQ == null
                                        ? "--"
                                        : item.gridQDetailModel.gridForwardQ;
                                yearData.yearPowerGridPowerFeed =
                                    item.gridQDetailModel.gridReverseQ == null
                                        ? "--"
                                        : item.gridQDetailModel.gridReverseQ;
                                // yearData.yearPowerGridPeakToAverageRatio = item.gridQDetailModel.peakNormalRadio == null ? "--" : item.gridQDetailModel.peakNormalRadio;
                                yearData.yearAirConditioner = "--";
                                yearData.yearIllumination = "--";
                                yearData.yearComputer = "--";
                                yearData.yearOthers = "--";
                                //车库目前仅安装了发电侧计量模块，储能及电网侧无计量，且车库无用电，发电=馈电，后续安装储能及电网侧计量后，相关代码需删除。
                                if (
                                    result.selectedAreaId == 400 ||
                                    result.selectedAreaId == 399
                                ) {
                                    yearData.yearElectricityConsumption = 0;
                                    // yearData.yearElectricityConsumptionMonthByMonthPercent = "--";
                                    // yearData.yearElectricityConsumptionYearByYearPercent = "--";
                                    yearData.yearPowerGridPowerFeed =
                                        item.consumptionQDetailModel.consumptionQ;
                                }
                                this.yearReportData.push(yearData);
                            });
                        } else {
                            this.yearReportData = [];
                        }
                        this.loading = false;
                    });
            } else {
                // 获取光伏未来社区、分中心的年报表数据
                statistic
                    .findYearStatisticsDetailsByLevelIdsAndYear({
                        roleId: this.userInfo.role._id,
                        id: this.selectedAreaId,
                        year: this.$moment(this.yearPicker).format("YYYY"),
                    })
                    .then(async (result) => {
                        if (result && result.data) {
                            if (this.selectedAreaId == this.areaData[0]._id) {
                                let nyzData = await this.getNyzData()
                                result.data.forEach((item) => {
                                    let yearData = {};
                                    let idx = nyzData.findIndex(e => e.time == item.month)
                                    if (idx > -1) {
                                        yearData.yearGeneratingElectrical = ((item.total_provide_q == null ? 0 : item.total_provide_q) + nyzData[idx].solar).toFixed(2)
                                        yearData.yearStorageDischarging = ((item.total_storage_forward_q == null ? 0 : item.total_storage_forward_q) + nyzData[idx].storageDischarge).toFixed(2)
                                        yearData.yearStorageCharging = ((item.total_storage_reverse_q == null ? 0 : item.total_storage_reverse_q) + nyzData[idx].storageCharge).toFixed(2)
                                        yearData.yearElectricityConsumption = ((item.total_consume_electricity_q == null ? "--" : item.total_consume_electricity_q) + nyzData[idx].consum).toFixed(2);
                                        yearData.yearPowerGridPowerSupply =
                                            ((item.total_grid_forward_q == null ? 0 : item.total_grid_forward_q) + nyzData[idx].gridForwardQ).toFixed(2);
                                        yearData.yearPowerGridPowerFeed =
                                            ((item.total_grid_reverse_q == null ? 0 : item.total_grid_reverse_q) + nyzData[idx].gridReverseQ).toFixed(2);
                                    } else {
                                        yearData.yearGeneratingElectrical = item.total_provide_q == null ? "--" : item.total_provide_q
                                        yearData.yearStorageDischarging = item.total_storage_forward_q == null ? "--" : item.total_storage_forward_q
                                        yearData.yearStorageCharging = item.total_storage_reverse_q == null ? "--" : item.total_storage_reverse_q
                                        yearData.yearElectricityConsumption = item.total_consume_electricity_q == null ? "--" : item.total_consume_electricity_q;
                                        yearData.yearPowerGridPowerSupply =
                                            item.total_grid_forward_q == null
                                                ? "--"
                                                : item.total_grid_forward_q;
                                        yearData.yearPowerGridPowerFeed =
                                            item.total_grid_reverse_q == null
                                                ? "--"
                                                : item.total_grid_reverse_q;
                                    }
                                    yearData.yearAreaName = this.selectedName;
                                    yearData.yearMonth = item.month == null ? "--" : item.month;
                                    // yearData.yearPowerGridPowerSupply =
                                    //     item.total_grid_forward_q == null
                                    //         ? "--"
                                    //         : item.total_grid_forward_q;
                                    // yearData.yearPowerGridPowerFeed =
                                    //     item.total_grid_reverse_q == null
                                    //         ? "--"
                                    //         : item.total_grid_reverse_q;
                                    yearData.yearAirConditioner = "--";
                                    yearData.yearIllumination = "--";
                                    yearData.yearComputer = "--";
                                    yearData.yearOthers = "--";
                                    this.yearReportData.push(yearData);
                                });
                            } else {
                                result.data.forEach((item) => {
                                    let yearData = {};
                                    yearData.yearAreaName = this.selectedName;
                                    yearData.yearMonth = item.month == null ? "--" : item.month;
                                    yearData.yearGeneratingElectrical =
                                        item.total_provide_q == null ? "--" : item.total_provide_q;
                                    // yearData.yearGeneratingElectricalMonthByMonthPercent = "--";
                                    // yearData.yearGeneratingElectricalYearByYearPercent = "--";
                                    yearData.yearStorageCharging =
                                        item.total_storage_reverse_q == null
                                            ? "--"
                                            : item.total_storage_reverse_q;
                                    yearData.yearStorageDischarging =
                                        item.total_storage_forward_q == null
                                            ? "--"
                                            : item.total_storage_forward_q;
                                    // yearData.yearStorageSOC = "--";
                                    yearData.yearElectricityConsumption =
                                        item.total_consume_electricity_q == null
                                            ? "--"
                                            : item.total_consume_electricity_q;
                                    // yearData.yearElectricityConsumptionMonthByMonthPercent = item.total_consume_water_q == null ? "--" : item.total_consume_water_q;
                                    // yearData.yearElectricityConsumptionYearByYearPercent = item.total_consume_gas_q == null ? "--" : item.total_consume_gas_q;
                                    yearData.yearPowerGridPowerSupply =
                                        item.total_grid_forward_q == null
                                            ? "--"
                                            : item.total_grid_forward_q;
                                    yearData.yearPowerGridPowerFeed =
                                        item.total_grid_reverse_q == null
                                            ? "--"
                                            : item.total_grid_reverse_q;
                                    // yearData.yearPowerGridPeakToAverageRatio = "--";
                                    yearData.yearAirConditioner = "--";
                                    yearData.yearIllumination = "--";
                                    yearData.yearComputer = "--";
                                    yearData.yearOthers = "--";
                                    this.yearReportData.push(yearData);
                                });
                            }
                        } else {
                            this.yearReportData = [];
                        }
                        this.loading = false;
                    });
            }
        },

        // 方法调整
        handleReportTypeChange(e) {
            this.reportTypeIndex = e.detail.value;
            this.selectedReportType = this.reportTypeData[this.reportTypeIndex].value;
        },

        handleAreaChange(e) {
            const index = e.detail.value;
            this.selectedIndex = index;
            this.selectedAreaId = this.areaData[index]._id;
            this.areaLevelId = this.areaData[index].origin;
            this.selectedLevel = this.areaData[index].level;
            this.selectedName = this.areaData[index].name;

        },

        // 当某日的日期改变时
        datePickerChange(e) {
            this.dateReportData = [];
            this.datePicker = e

            this.getDateReportData(); // 从后台koa获取日报表数据
        },
        // 当某月的日期改变时
        monthPickerChange(e) {
            this.monthReportData = [];
            this.monthPicker = e
            this.getMonthReportData(); // 从后台koa获取月报表数据
        },
        // 当某年的日期改变时
        yearPickerChange(e) {
            this.yearReportData = [];
            this.yearPicker = e
            this.getYearReportData(); // 从后台koa获取年报表数据
        },

    },

    mounted() {
        // this.loadAreaData();
        this.reportTypeOptions = this.reportTypeData.map(item => item.name);

        this.getAreaData(); // 从后台koa获取下拉框的数据
    },
    beforeDestroy() {

    },

    watch: {
        selectedReportType: {
            handler(newVal, oldVal) {
                if (this.selectedReportType === "date") {
                    this.dateReportData = [];
                    this.getDateReportData(); // 从后台koa获取日报表数据
                } else if (this.selectedReportType === "week") {
                    this.weekReportData = [];
                    this.getWeekReportData(); // 从后台koa获取周报表数据
                } else if (this.selectedReportType === "month") {
                    this.monthReportData = [];
                    this.getMonthReportData(); // 从后台koa获取月报表数据
                } else if (this.selectedReportType === "year") {
                    this.yearReportData = [];
                    this.getYearReportData(); // 从后台koa获取年报表数据
                }
            },
        },
        selectedAreaId: {
            handler(newVal, oldVal) {
                if (this.selectedReportType === "date") {
                    this.dateReportData = [];
                    this.getDateReportData(); // 从后台koa获取日报表数据
                } else if (this.selectedReportType === "month") {
                    this.monthReportData = [];
                    this.getMonthReportData(); // 从后台koa获取月报表数据
                } else if (this.selectedReportType === "year") {
                    this.yearReportData = [];
                    this.getYearReportData(); // 从后台koa获取年报表数据
                }
            },
        },
    },

}
</script>

<style lang="scss" scoped>
/* 基础样式重置与全局配置 */
page {
    background-color: #f5f7fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
    color: #333;
    font-size: 28rpx;
    line-height: 1.5;
    padding-bottom: 30rpx;
}

.container {
    padding: 10rpx;
    box-sizing: border-box;
    // background-color: #fff;
    display: flex;
    flex-direction: column;
    background: #EFF4FB;
}


/* 头部筛选区域样式 */
.table-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 20rpx 30rpx;
    // border-bottom: 1rpx solid #eee;
}

.areaSelect,
.statistical-method,
.time-select {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
    width: 100%;
    min-width: 240rpx;
}

.areaSelect {
    margin-right: 4%;
}

.statistical-method {
    margin-right: 4%;
}

.text {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-right: 12rpx;
    white-space: nowrap;
}

/* 选择器样式优化 */
.selector-container,
.report-type-picker {
    flex: 1;
    position: relative;
}

.picker-content,
.picker-label {
    height: 70rpx;
    line-height: 70rpx;
    padding: 0 20rpx;
    background-color: #f9f9f9;
    border-radius: 35rpx;
    font-size: 26rpx;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.picker-content::after,
.picker-label::after {
    content: '';
    display: inline-block;
    width: 32rpx;
    height: 32rpx;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: 10rpx;
}

/* 日期选择器样式 */
.select {
    flex: 1;
}

.custom-date-picker {
    width: 100%;
}


/* 加载状态样式 */
.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300rpx;
    color: #999;
}

/* 移动端表格头部样式 */
.mobile-table-head {
    padding: 12px;
    background-color: #f8f8f8;
    border-radius: 8px;
    //   margin-bottom: 15px;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 10rpx;
    width: 100%;
}

.filter-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #fff;
    padding: 10rpx 12px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-label {
    min-width: 60px;
    color: #606266;
    font-size: 14px;
}

.selector-container,
.report-type-picker {
    flex: 1;
}

// .time-select {
//     background-color: #fff;
//     padding: 10px 12px;
//     border-radius: 6px;
//     box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
// }

.picker-content,
.picker-label {
    background-color: #f5f7fa;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    color: #303133;
    text-align: left;
}

.custom-date-picker {
    width: 100%;
}


/* 表格基础样式 */
// .table-header {
//     display: flex;
//     font-weight: 600;
//     background-color: #f5f7fa;
//     border-radius: 8rpx;
//     overflow: hidden;
//     margin-bottom: 20rpx;
// }

.table-cell {
    padding: 20rpx;
    text-align: center;
    font-size: 28rpx;
    color: #333;
    border-right: 1rpx solid #eee;
}

.table-cell:last-child {
    border-right: none;
}

.table-body {
    border-radius: 8rpx;
    overflow: hidden;
}

.table-row {
    display: flex;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #f9f9f9;
    }
}

.table-light-row {
    background-color: #fff;
}

.table-dark-row {
    background-color: #f9f9f9;
}

.table-data-cell {
    padding: 20rpx;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    border-right: 1rpx solid #eee;
}

.table-data-cell:last-child {
    border-right: none;
}

/* 响应式布局调整 */
@media (max-width: 375px) {

    .areaSelect,
    .statistical-method,
    .time-select {
        width: 100%;
        margin-right: 0;
        margin-bottom: 10rpx;
    }

    .table-head {
        flex-direction: column;
        padding: 20rpx;
    }
}

/* 交互反馈样式 */
.area-picker,
.type-selector {
    width: 100%;
}

/* 数据为空时的提示样式 */
.empty-data {
    text-align: center;
    padding: 40rpx 0;
    color: #999;
    font-size: 28rpx;
}

.table {
    background: #FFF
}
</style>
