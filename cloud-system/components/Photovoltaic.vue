<template>
    <view class="container">
        <!-- 顶部信息栏 -->
        <view class="info-grid">
            <view class="info-card" v-for="(item, index) in infoItems" :key="index">
                <text class="info-title">{{ item.title }}</text>
                <text class="info-value" :data-unit="item.title.match(/\((.*?)\)/)[1]">
                    {{ storageData[item.key] || '--' }}
                </text>
            </view>
        </view>

        <!-- 气象图表 -->
        <view class="chart-section">
            <view class="chart-header">
                <text>光伏气象</text>
                <text class="update-time">最后更新: {{ lastUpdateTime || '--' }}</text>
            </view>
            <qiun-data-charts type="mix" :chartData="weatherChartData" :canvas2d="canvas2d" :inScrollView="true" :opts="chartOptions" :ontouch="true"
                canvasId="weatherChart" />
            <view class="data-source">
                数据来源: Open-Meteo API (更新间隔: {{ refreshInterval / 60000 }}分钟)
            </view>
        </view>

        <!-- 新增电力数据图表 -->
        <view class="chart-section">
            <view class="chart-header">
                <text>电力数据</text>
                <text class="update-time">最后更新: {{ lastUpdateTime || '--' }}</text>
            </view>
            <qiun-data-charts type="column" :chartData="electricityChartData" :opts="electricityChartOptions"
                :disableScroll="false" :ontouch="true" :canvas2d="canvas2d" canvasId="GsDZdcafycViDorPVQTWckDCHhpoioxee"
                :inScrollView="true" />
        </view>

        <!-- 设备数据表格 -->
        <view class="data-section">
            <scroll-view scroll-y class="table-container">
                <!-- 光伏DC -->
                <view v-if="esVersion == 1" class="col-10" style="height: 100%;">
                    <view class="grid-content dcdc-parameter">
                        <view class="dcdc-title">光伏DC</view>
                        <scroll-view scroll-y style="width: 100%; height: calc(100% - 30px);">
                            <view class="table-container">
                                <!-- 表头 -->
                                <view class="table-row header">
                                    <text class="cell param-cell">参数</text>
                                    <text v-for="col in columns" :key="col.id" class="cell">
                                        编号 {{ col.id }}
                                    </text>
                                </view>
                                <!-- 数据行 -->
                                <view v-for="(row, index) in verticalData" :key="index" class="table-row">
                                    <text class="cell param-cell">{{ row.label }}</text>
                                    <text v-for="col in columns" :key="col.id" class="cell">
                                        {{ row[col.prop] }}
                                    </text>
                                </view>
                            </view>
                        </scroll-view>
                    </view>
                </view>
                <view v-if="esVersion == 2" class="col-10" style="height: 100%;">
                    <view class="grid-content dcdc-parameter">
                        <view class="dcdc-title">光伏DC</view>
                        <view class="dcdc-device">
                            <view></view>
                            <view>1#</view>
                            <view>2#</view>
                        </view>
                        <scroll-view scroll-y class="dcdc-data-box" style="height: calc(100% - 66px);">
                            <view v-for="(item, index) in dcdcRealData" :key="index" class="dcdc-data-item">
                                <text class="dcdc-data-name">{{ item.name }}</text>
                                <text class="dcdc-data-value">{{ item.value1 }}</text>
                                <text class="dcdc-data-value">{{ item.value2 }}</text>
                            </view>
                        </scroll-view>
                    </view>
                </view>
                <view v-if="stationType == 4" class="col-10" style="height: 100%;">
                    <view class="grid-content dcdc-parameter">
                        <view class="dcdc-title">设备数据</view>
                        <scroll-view scroll-y class="pcs-scrollbar">
                            <view class="pcs-box">
                                <view v-for="(item, index) in dataContainer4" :key="index" class="dcdc-data-item">
                                    <text class="dcdc-data-name">{{ item.name }}</text>
                                    <text class="dcdc-data-value">{{ item.value }}</text>
                                </view>
                            </view>
                        </scroll-view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { RealtimeDataProviderService } from '@/service/socket/realtime-data-provider.js';
import { queryDayElectricityStatistic, queryMonthElectricityStatistic, queryYearElectricityStatistic } from "@/api/index";
import * as dateUtils from "@/utils/date"; // 新增导入
import { download, queryEnergyStationPVData } from "@/api/devices";
import chinaLocation from '@/assets/json/chinaLocation.json'
import { Model170C } from '@/service/devices/170C-model'
export default {
    data() {
        return {
            canvas2d: this.$Config.ISCANVAS2D,
            infoItems: [
                { title: '日发电量(kWh)', key: 'dailyGeneration' },
                { title: '累计发电量(kWh)', key: 'totalGeneration' },
                { title: '今日收益(元)', key: 'todayIncome' },
                { title: '本月收益(元)', key: 'monthlyIncome' },
                { title: '本年收益(元)', key: 'yearlyIncome' },
                { title: '累计收益(元)', key: 'totalIncome' }
            ],
            chartOptions: {
                dataLabel: false,
                enableScroll: true,
                color: ["#1890FF", "#FAC858"],
                padding: [15, 15, 0, 15],
                xAxis: {
                    disableGrid: true,
                    // rotateAngle: 90, // 标签旋转45度
                    rotateLabel: false,
                    itemCount: 12, // 显示间隔为2小时（24小时数据）
                    fontSize: 8, // 缩小字体
                    boundaryGap: true,
                    splitNumber: 12, // 显示12个刻度
                    axisLabel: {
                        interval: 2, // 间隔显示标签（0时、2时、4时...）
                        width: 60,
                        showMaxLabel: true, // 始终显示最后一个标签
                        formatter: function (value, index) {
                            return index % 2 === 0 ? value : ''; // 每隔1个显示标签
                        }
                    },
                    scrollShow: true // 启用滚动条
                },
                yAxis: {
                    disabled: false,
                    disableGrid: false,
                    splitNumber: 5,
                    gridType: "dash",
                    dashLength: 4,
                    gridColor: "#CCCCCC",
                    padding: 10,
                    showTitle: true,
                    data: [
                        {
                            position: "left",
                            title: "辐射 (W/m²)"
                        },
                        {
                            position: "right",
                            min: 0,
                            title: "温度(°C)",
                            textAlign: "left"
                        },
                    ]
                },
                extra: {
                    mix: {
                        column: {
                            width: 20
                        }
                    }
                }
            },
            storageData: {
                dailyGeneration: 0,
                totalGeneration: 0,
                todayIncome: 0,
                monthlyIncome: 0,
                yearlyIncome: 0,
                totalIncome: 0
            },
            weatherChartData: {},
            electricityChartOptions: {
                color: ["#2A70FF", "#00E9AA", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [5, 30, 20, 5], // 增加底部padding给x轴留空间
                enableScroll: true,
                dataLabel: false,
                xAxis: {
                    disableGrid: true,
                    // rotateAngle: 90, // 标签旋转45度
                    rotateLabel: false,
                    itemCount: 12, // 显示间隔为2小时（24小时数据）
                    fontSize: 8, // 缩小字体
                    boundaryGap: true,

                    // 新增轴标签配置
                    // axisLabel: { 
                    //     interval: 1, // 强制显示间隔
                    //     width: 60
                    // },
                    splitNumber: 12, // 显示12个刻度
                    axisLabel: {
                        interval: 2, // 间隔显示标签（0时、2时、4时...）
                        width: 60,
                        showMaxLabel: true, // 始终显示最后一个标签
                        formatter: function (value, index) {
                            return index % 2 === 0 ? value : ''; // 每隔1个显示标签
                        }
                    },
                    scrollShow: true // 启用滚动条
                },
                padding: [10, 15, 25, 15], // 增加底部padding到40
                // },
                yAxis: {
                    padding: 20,
                    showTitle: true,
                    data: [{
                        title: '电量(kWh)',
                        type: 'value',
                        // fontColor: '#fff',
                        fontSize: 10
                    }]
                },
                extra: {
                    column: {
                        type: "group",
                        width: 10,
                        meterBorde: 1,
                        meterFillColor: "#FFFFFF",
                        activeBgColor: "#000000",
                        activeBgOpacity: 0.08,
                        // linearType: "custom",
                        // linearOpacity: 0,
                        customColor: ['#0B9BA8'],
                        // barBorderCircle: true,
                        seriesGap: 2,
                        categoryGap: 2,

                    },
                    tooltip: {
                        fontSize: 10
                    }
                }

            },
            electricityChartData: {},
            lastUpdateTime: '',
            refreshInterval: 1800000,
            // dcdcRealData: [],
            initToday: dateUtils.dateYMD(new Date()), //初始化当日日期
            barDate: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
            dcdcList: [],
            initDcData: new Model170C(),
            dcdcOneData: new Model170C().energyData,
            dcdcTwoData: new Model170C().energyData,
            dcdcOnestateData: new Model170C().stateData,
            dcdcTwostateData: new Model170C().stateData, //初始第一个dcdc能源数据
        };
    },
    computed: {
        ...mapState(['powerStationsId']),
        ...mapGetters(['getEsVersion']),
        esVersion() {
            return this.getEsVersion || 2 // 添加默认值
        },
        // 原始数据（横向结构）
        tableData() {

            return (this.dcdcList || []).map((item, index) => {
                return {
                    id: index + 1,
                    lowSideVoltage: item.energyData.lowSideVoltage?.value,
                    lowSideCurrent: item.energyData.lowSideCurrent?.value,
                    radiatorTemperature: item.energyData.radiatorTemperature?.value,
                    highSideVoltage: item.energyData.highSideVoltage?.value,
                    highSideCurrent: item.energyData.highSideCurrent?.value,
                    busVoltage: item.energyData.busVoltage?.value,
                    batteryVoltage: item.energyData.batteryVoltage?.value,
                    chargeVoltageSet: item.energyData.chargeVoltageSet?.value,
                    chargeCurrentSet: item.energyData.chargeCurrentSet?.value,
                    dischargeVoltageSet: item.energyData.dischargeVoltageSet?.value,
                    dischargeCurrentSet: item.energyData.dischargeCurrentSet?.value,
                    systemMaxChargeCurrent: item.energyData.systemMaxChargeCurrent?.value,
                    systemMaxDischargeCurrent: item.energyData.systemMaxDischargeCurrent?.value,
                    batterySOC: item.energyData.batterySOC?.value,
                    batteryChargeCapacity: item.energyData.batteryChargeCapacity?.value,
                    batteryDischargeCapacity: item.energyData.batteryDischargeCapacity?.value,
                    batteryTotalVoltage: item.energyData.batteryTotalVoltage?.value,
                    batteryTotalCurrent: item.energyData.batteryTotalCurrent?.value,
                    packMaxSOC: item.energyData.packMaxSOC?.value,
                    packMinSOC: item.energyData.packMinSOC?.value,
                    packMaxVoltage: item.energyData.packMaxVoltage?.value,
                    packMinVoltage: item.energyData.packMinVoltage?.value,
                    packMaxTemperature: item.energyData.packMaxTemperature?.value,
                    packMinTemperature: item.energyData.packMinTemperature?.value,
                    systemMaxChargePower: item.energyData.systemMaxChargePower?.value,
                    systemMaxDischargePower: item.energyData.systemMaxDischargePower?.value,
                    heartBeat: item.energyData.heartBeat?.value,
                    workingCondition: item.stateData?.workingCondition?.value,
                    errorCode: item.stateData?.errorCode?.value,
                    powerOn: item.stateData?.powerOn?.value,
                    workingConditionSet: item.stateData?.workingConditionSet?.value,
                    BMSWoringCondition: item.stateData?.BMSWoringCondition?.value
                }
            })
        },
        // 转换为竖向结构
        verticalData() {
            return [
                { label: '低压侧电压值(V)', ...this.mapColumn('lowSideVoltage') },
                { label: '低压侧电流值(A)', ...this.mapColumn('lowSideCurrent') },
                { label: '散热器温度(℃)', ...this.mapColumn('radiatorTemperature') },
                { label: '高压侧电压值(V)', ...this.mapColumn('highSideVoltage') },
                { label: '高压侧电流值(A)', ...this.mapColumn('highSideCurrent') },
                { label: '直流母线电压(V)', ...this.mapColumn('busVoltage') },
                { label: '电池电压(V)', ...this.mapColumn('batteryVoltage') },
                { label: '充电电压设定值(V)', ...this.mapColumn('chargeVoltageSet') },
                { label: '充电电流设定值(A)', ...this.mapColumn('chargeCurrentSet') },
                { label: '放电电压设定值(V)', ...this.mapColumn('dischargeVoltageSet') },
                { label: '放电电流设定值(A)', ...this.mapColumn('dischargeCurrentSet') },
                { label: '当前系统最大允许充电电流(A)', ...this.mapColumn('systemMaxChargeCurrent') },
                { label: '当前系统最大允许放电电流(A)', ...this.mapColumn('systemMaxDischargeCurrent') },
                { label: '电池组SOC(%)', ...this.mapColumn('batterySOC') },
                { label: '电池组可充电量(kWh)', ...this.mapColumn('batteryChargeCapacity') },
                { label: '电池组可放电量(kWh)', ...this.mapColumn('batteryDischargeCapacity') },
                { label: '电池组总电压(V)', ...this.mapColumn('batteryTotalVoltage') },
                { label: '电池组总电流(A)', ...this.mapColumn('batteryTotalCurrent') },
                { label: '电池单体最高SOC(%)', ...this.mapColumn('packMaxSOC') },
                { label: '电池单体最低SOC(%)', ...this.mapColumn('packMinSOC') },
                { label: '电池单体最高电压(V)', ...this.mapColumn('packMaxVoltage') },
                { label: '电池单体最低电压(V)', ...this.mapColumn('packMinVoltage') },
                { label: '电池单体最高温度(℃)', ...this.mapColumn('packMaxTemperature') },
                { label: '电池单体最低温度(℃)', ...this.mapColumn('packMinTemperature') },
                { label: '当前系统最大允许充电功率(kW)', ...this.mapColumn('systemMaxChargePower') },
                { label: '当前系统最大允许放电功率(kW)', ...this.mapColumn('systemMaxDischargePower') },
                { label: '心跳帧', ...this.mapColumn('heartBeat') },
                { label: '当前工作状态', ...this.mapColumn('workingCondition') },
                { label: '故障码', ...this.mapColumn('errorCode') },
                { label: '开机/关机', ...this.mapColumn('powerOn') },
                { label: '工作状态设定值', ...this.mapColumn('workingConditionSet') },
                { label: 'BMS工作状态信息', ...this.mapColumn('BMSWoringCondition') }
            ]
        },
        // 动态生成列数据
        columns() {
            if (this.tableData.length == 0) return [];
            return   this.tableData.map(item => ({ id: item.id, prop: `id${item.id}` }))
        },

        // DCDC数据
        dcdcRealData() {
            const arr1 = [...Object.values(this.dcdcOneData), ...Object.values(this.dcdcOnestateData)]
            const arr2 = [...Object.values(this.dcdcTwoData), ...Object.values(this.dcdcTwostateData)]
            const map = arr2.reduce((pre, curr) => {
                pre[curr.name] = curr.value
                return pre
            }, {})
            return arr1.map((item) => {
                return {
                    name: item.name,
                    value1: item.value,
                    value2: map[item.name] !== undefined ? map[item.name] : '--'
                }
            })
        },

    },
    mounted() {
        this.fetchWeatherData();
        this.getStorageData();
        this.initDeviceList();
        this.getTodayElectricityData("date", this.barDate, this.$store.state.powerStationsId, this.initToday, null, null, true); // 初始化时获取电力数据
    },
    methods: {
        mapColumn(field) {
            return this.tableData.reduce((obj, item) => {
                obj[`id${item.id}`] = item[field]
                return obj
            }, {})
        },

        async fetchWeatherData() {
            try {
                const tempLocation = chinaLocation[this.$store.state.esConfig.find(item => item.esId === this.$store.state.powerStationsId)?.location]
                console.log('tempLocation', tempLocation, this.$store)
                // const LOCATION = { latitude: 39.9042, longitude: 116.4074 }; // 示例位置，可替换为实际位置或从用户位置获取
                const LOCATION = {
                    latitude: tempLocation.lat,
                    longitude: tempLocation.lng
                }

                const [err, res] = await uni.request({
                    url: 'https://api.open-meteo.com/v1/forecast',
                    data: {
                        latitude: LOCATION.latitude,
                        longitude: LOCATION.longitude,
                        hourly: 'shortwave_radiation,temperature_2m',
                        timezone: 'auto'
                    }
                });

                if (res.statusCode === 200) {
                    const hourly = res.data.hourly;
                    console.log('hourly', hourly)
                    // this.chartOptions.xAxis.itemCount = hourly.time.length/2;
                    console.log('this.chartOptions.xAxis.itemCount', this.chartOptions.xAxis.itemCount)
                    this.weatherChartData = {
                        categories: hourly.time.slice(-24).map(t => {
                            const timeMatch = t.match(/(\d{2}):\d{2}/);
                            const hour = timeMatch ? parseInt(timeMatch[1], 10) : null; // 转换为整型去除前导零
                            return hour !== null ? hour.toString() : '--';  // 返回处理后的字符串
                        }),
                        series: [
                            {
                                name: '太阳辐射', type: "line",
                                style: "curve", data: hourly.shortwave_radiation.slice(-24), index: 0
                            },
                            {
                                name: '温度', type: "line",
                                style: "curve", data: hourly.temperature_2m.slice(-24), index: 1
                            }
                        ]
                    };
                    this.lastUpdateTime = new Date().toLocaleString();
                }
            } catch (error) {
                console.log(error, '气象数据获取失败')
                uni.showToast({ title: '气象数据获取失败', icon: 'none' });
            }
        },
        async getStorageData() {
            queryEnergyStationPVData(this.$store.state.powerStationsId, dateUtils.dateYMD(new Date()))
                .then((res) => {
                    if (res.status != 200) return
                    Object.keys(this.storageData).forEach(key => {
                        this.storageData[key] = res.data[key] || 0;
                    });
                    console.log('storageData', this.storageData)
                })
                .catch((err) => {
                    console.error(err)
                    uni.showToast({ title: '数据获取失败', icon: 'none' });
                })
        },
        // 初始化设备列表
        initDeviceList() {
            const realTimeService = new RealtimeDataProviderService();
            realTimeService.initDeviceList(this.$store.state.storageRealData);

            const deviceLists = realTimeService.getDeviceList();

            const dcdcItems = deviceLists.filter((item) => item.name.includes("光伏DC"));
            const dcdcEnergyItems = dcdcItems.filter(item => item.name.includes("能源"))
            const dcdcStateItems = dcdcItems.filter(item => item.name.includes("状态"))
            dcdcEnergyItems.map((item, index) => {
                if (index % 2 === 0) {
                    this.dcdcOneData = item.energyData;
                } else {
                    this.dcdcTwoData = item.energyData;
                }
            })
            dcdcStateItems.map((item, index) => {
                if (index % 2 === 0) {
                    this.dcdcOnestateData = item.stateData;
                } else {
                    this.dcdcTwostateData = item.stateData;
                }
            })
            this.dcdcList = dcdcItems

            console.log('设备列表', this.dcdcList, dcdcItems);
        },

        // 获取充放电量数据——曲线图
        async getTodayElectricityData(dateType, dateList, esId, day, month, year, isOnlyOne) {

            const startDay = dateUtils.dateYMD(new Date(year, month - 1, 1));
            const endDay = dateUtils.dateYMD(new Date(year, month, 0));
            let res;
            switch (dateType) {
                case "date":
                    res = await queryDayElectricityStatistic(esId, day);
                    break;
                case "month":
                    res = await queryMonthElectricityStatistic(esId, startDay, endDay);
                    break;
                case "year":
                    res = await queryYearElectricityStatistic(esId, year);
                    break;
            }
            let datas = {
                storageCharge: [],
                storageDischarge: [],
                photovoltaicPower: []
            }
            res.data.forEach((item, index) => {
                datas.storageCharge[index] = item.storageCharge;
                datas.storageDischarge[index] = item.storageDischarge;
                datas.photovoltaicPower[index] = item.photovoltaicPower
            });
            this.fetchElectricityData(datas, dateList);
        },

        fetchElectricityData(datas, date) {
            // try {
            let res = {
                categories: [],
                series: [{
                    name: "发电量",
                    data: []
                }
                ]
            };

            res.categories = date;
            res.series[0].data = datas.photovoltaicPower;
            this.electricityChartOptions.xAxis.itemCount = 24/2;
            this.electricityChartData = JSON.parse(JSON.stringify(res));
        }
    }
};
</script>

<style lang="scss" scoped>
/* 新增表格样式 */
.table-container {
    width: 100%;
    border: 1px solid #ebeef5;
    border-radius: 8rpx;
    overflow: hidden;

    .table-row {
        display: flex;
        min-width: 1200rpx;

        &.header {
            background-color: #f8f9fa;
            font-weight: 500;
        }

        .cell {
            flex: 1;
            padding: 24rpx;
            text-align: center;
            font-size: 26rpx;
            color: #606266;
            border-right: 1px solid #ebeef5;
            min-width: 200rpx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &.param-cell {
                flex: 0 0 340rpx;
                background-color: #f8faff;
                font-weight: 500;
                color: #333;
            }

            &:last-child {
                border-right: none;
            }
        }
    }
}

/* 设备数据样式统一 */
.dcdc-data-item {
    display: flex;
    align-items: center;
    padding: 20rpx;
    border-bottom: 1px solid #eee;

    .dcdc-data-name {
        flex: 1;
        font-size: 28rpx;
        color: #333;
    }

    .dcdc-data-value {
        width: 200rpx;
        text-align: center;
        font-size: 28rpx;
        color: #1890FF;
    }
}

.dcdc-device {
    display: flex;
    padding: 20rpx;
    background: #f8f9fa;

    >view {
        flex: 1;
        text-align: center;
        font-weight: 500;
        color: #333;
    }
}

.container {
    // padding: 30rpx 20rpx;
    background-color: #f8f8f8;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220rpx, 1fr));
    gap: 20rpx;
    padding: 10rpx;

    .info-card {
        min-width: 220rpx;
        background: #fff;
        border-radius: 16rpx;
        padding: 30rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        /* 新增居中属性 */
        justify-content: center;
        /* 垂直居中 */
        height: 180rpx;
        /* 固定高度保持卡片一致 */
    }

    .info-title {
        font-size: 24rpx;
        color: #7f8c8d;
        margin-bottom: 15rpx;
        /* 增加下边距区分层级 */
        position: relative;

        &::before {
            content: '';
            display: block;
            width: 40rpx;
            height: 2rpx;
            background: #1890FF;
            position: absolute;
            left: 50%;
            bottom: -8rpx;
            transform: translateX(-50%);
            /* 居中装饰线 */
        }
    }

    .info-value {
        font-size: 40rpx;
        color: #2c3e50;
        font-weight: 600;
        line-height: 1.2;
        text-align: center;

        &::after {
            content: attr(data-unit);
            display: block;
            /* 单位换行显示 */
            font-size: 22rpx;
            color: #95a5a6;
            margin-top: 6rpx;
            font-weight: normal;
        }
    }

    @media (max-width: 600rpx) {
        grid-template-columns: repeat(2, 1fr);
        gap: 15rpx;
        padding: 15rpx;

        .info-card {
            padding: 20rpx;
        }
    }
}

.chart-section {
    background: #fff;
    border-radius: 24rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-4rpx);
    }

    .chart-header {
        display: flex;
        flex-direction: column; // 改为垂直布局
        align-items: flex-start;
        margin-bottom: 30rpx;

        text {
            font-size: 34rpx;
            margin-bottom: 15rpx; // 增加下边距
            font-weight: 600;
            color: #2c3e50;
            position: relative;
            padding-left: 20rpx;

            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 6rpx;
                height: 32rpx;
                background: #1890FF;
                border-radius: 4rpx;
            }
        }

        .update-time {
            font-size: 24rpx; // 从26rpx调整为24rpx
            color: #7f8c8d;
            background: #f5f6fa;
            padding: 6rpx 12rpx;
            border-radius: 20rpx;
            align-self: flex-start; // 保持左对齐
        }
    }

    .data-source {
        font-size: 24rpx;
        color: #95a5a6;
        text-align: right;
        margin-top: 30rpx;
        padding: 16rpx 0 0;
        border-top: 1rpx dashed #eee;
    }
}

// 新增电力图表单独样式
.chart-section:nth-child(3) {
    .chart-header text::before {
        background: #00E9AA; // 电力图表装饰条颜色
    }

    .update-time {
        background: #e8fcf5;
    }
}

.data-section {
    height: 40vh;
    background: #fff;
    border-radius: 16rpx;

    .table-container {
        height: 100%;
        padding: 20rpx;

        .table-header {
            display: flex;
            background: #f5f5f5;
            border-radius: 8rpx;
            padding: 15rpx 0;

            .col {
                flex: 1;
                text-align: center;
                font-weight: bold;
            }
        }

        .table-row {
            display: flex;
            padding: 15rpx 0;
            border-bottom: 1rpx solid #eee;

            .col {
                flex: 1;
                text-align: center;
            }
        }
    }
}

.table-container {
    width: 100%;
    border: 1px solid #EBEEF5;
}

.table-row {
    display: flex;
    border-bottom: 1px solid #EBEEF5;

    &.header {
        background-color: #f5f7fa;
    }
}

.cell {
    flex: 1;
    padding: 12rpx;
    text-align: center;

    &.param-cell {
        width: 340rpx;
        /* 对应原170px */
        flex: none;
    }
}
</style>
