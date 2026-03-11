<template>
    <view class="weather-monitoring">
        <!-- 概览区域 -->
        <view class="overview-card">
            <view class="card-header">
                <text class="card-title">环境概览</text>
                <text class="card-date">{{ selectedDate | formatDate }}</text>
            </view>
            <view class="overview-content">
                <!-- 天气图标 -->
                <view class="weather-icon-container">
                    <view class="weather-icon" :class="[getWeatherImgUrl(overview.irradiance)]"></view>
                    <view class="weather-status">
                        <text class="status-text">{{ getWeatherStatus(overview.irradiance) }}</text>
                    </view>
                </view>

                <!-- 数据统计 -->
                <view class="overview-stats">
                    <view class="stat-card" :style="{ '--bg-color': '#E8F3FF' }">
                        <text class="stat-label">辐照度</text>
                        <view class="stat-value">
                            <text class="value-number">{{ overview.irradiance }}</text>
                            <text class="value-unit">W/m²</text>
                        </view>
                    </view>

                    <view class="stat-card" :style="{ '--bg-color': '#FFF3E0' }">
                        <text class="stat-label">温度</text>
                        <view class="stat-value">
                            <text class="value-number">{{ overview.realTiemTem }}</text>
                            <text class="value-unit">℃</text>
                        </view>
                    </view>

                    <view class="stat-card" :style="{ '--bg-color': '#E8F5E9' }">
                        <text class="stat-label">风速</text>
                        <view class="stat-value">
                            <text class="value-number">{{ overview.wind.direction }}</text>
                            <text class="value-unit">{{ overview.wind.level }}级</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 极值数据区域 -->
        <view class="extreme-values-card">
            <view class="card-header">
                <text class="card-title">今日极值</text>
            </view>
            <view class="extreme-values">
                <view class="extreme-value-card"
                    :style="{ '--gradient': 'linear-gradient(135deg, #E8F3FF 0%, #D6EAF8 100%)' }">
                    <text class="value-label">当日最高发电功率</text>
                    <view class="value-display">
                        <text class="value-int">{{ overview.maxSolarPower.int }}</text>
                        <text class="value-dec">{{ overview.maxSolarPower.dec }}</text>
                        <text class="value-unit">kW</text>
                    </view>
                </view>

                <view class="extreme-value-card"
                    :style="{ '--gradient': 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' }">
                    <text class="value-label">当日最高负荷</text>
                    <view class="value-display">
                        <text class="value-int">{{ overview.maxLoadPower.int }}</text>
                        <text class="value-dec">{{ overview.maxLoadPower.dec }}</text>
                        <text class="value-unit">kW</text>
                    </view>
                </view>

                <view class="extreme-value-card"
                    :style="{ '--gradient': 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' }">
                    <text class="value-label">当日最高辐照度</text>
                    <view class="value-display">
                        <text class="value-int">{{ overview.maxIrradiance.int }}</text>
                        <text class="value-dec">{{ overview.maxIrradiance.dec }}</text>
                        <text class="value-unit">W/m²</text>
                    </view>
                </view>

                <view class="extreme-value-card history-card"
                    :style="{ '--gradient': 'linear-gradient(135deg, #EDE7F6 0%, #D1C4E9 100%)' }">
                    <view class="history-content" style="display: flex;;;">
                        <text class="value-label">历史最高辐照度</text>
                        <view class="value-display">
                            <text class="value-int" style="font-size: 12px">{{ overview.maxIrradiancePrevious.int
                                }}</text>
                            <text class="value-dec">{{ overview.maxIrradiancePrevious.dec }}</text>
                            <text class="value-unit" style="font-size: 8px">W/m²</text>
                        </view>
                    </view>
                    <view class="value-history-time">
                        <text>出现在</text>
                        <text class="timestamp">{{ overview.timeOfMaxIrradiancePrevious }}</text>
                    </view>

                </view>
            </view>
        </view>

        <!-- 图表区域 -->
        <view class="chart-section">
            <view class="chart-header">
                <text class="chart-title">当日曲线</text>
                <dy-date timeType="day" @getData="onDateChange" v-model="selectedDate" class="date-picker" />
            </view>

            <!-- 环境数据图表 -->
            <view class="chart-card" :style="{ '--border-color': '#1890FF' }">
                <view class="chart-card-header">
                    <text class="card-title">辐照度/温度</text>
                    <view class="chart-indicators">
                        <view class="indicator" :style="{ '--color': '#1890FF' }">
                            <view class="indicator-dot"></view>
                            <text class="indicator-text">辐照度</text>
                        </view>
                        <view class="indicator" :style="{ '--color': '#FAC858' }">
                            <view class="indicator-dot"></view>
                            <text class="indicator-text">温度</text>
                        </view>
                    </view>
                </view>
                <view class="chart-container">
                    <qiun-data-charts type="mix" :chartData="weatherChartData" :canvas2d="canvas2d" :inScrollView="true"
                        :opts="chartOptions" :ontouch="true" canvasId="weatherChart" />
                </view>
            </view>

            <view class="divider-line"></view>

            <!-- 电力数据图表 -->
            <view class="chart-card" :style="{ '--border-color': '#4CAF50' }">
                <view class="chart-card-header">
                    <text class="card-title">光伏功率/负荷</text>
                    <view class="chart-indicators">
                        <view class="indicator" :style="{ '--color': '#4CAF50' }">
                            <view class="indicator-dot"></view>
                            <text class="indicator-text">光伏功率</text>
                        </view>
                        <view class="indicator" :style="{ '--color': '#FF9800' }">
                            <view class="indicator-dot"></view>
                            <text class="indicator-text">负荷</text>
                        </view>
                    </view>
                </view>
                <view class="chart-container">
                    <qiun-data-charts ref="energyChart" type="line" :chartData="electricityData" :ontouch="true"
                        :canvas2d="canvas2d" :opts="electricityOpts" />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getSocketinstance } from "@/service/websocket";
import { WWindUtil } from "@/utils/wind.js";
import weather from '@/api/weather'
import sapi from '@/store/sapi'
import energy_new from '@/api/energy_new'
import { mapGetters } from 'vuex';
import dyDate from '@/components/dy-Date/dy-Date.vue';

export default {
    components: { dyDate },
    name: 'weather-analyze',
    data() {
        return {
            current: "weather",
            canvas2d: this.$Config.ISCANVAS2D,
            areaData: [],
            selectTime: new Date(),
            environmentLoading: false,
            environmentOptions: {},
            eleOptions: {},
            chartOptions: {
                dataLabel: false,
                color: ["#1890FF", "#FAC858"],
                padding: [15, 15, 0, 15],
                xAxis: {
                    disableGrid: true,
                    rotateLabel: false,
                    fontSize: 10,
                    boundaryGap: true,
                    splitNumber: 12,
                    labelCount: 6,
                },
                yAxis: {
                    disabled: false,
                    disableGrid: false,
                    splitNumber: 5,
                    gridType: "dash",
                    dashLength: 4,
                    gridColor: "#EEEEEE",
                    padding: 10,
                    showTitle: true,
                    data: [
                        { position: "left", title: "辐射 (W/m²)" },
                        { position: "right", title: "温度(°C)", textAlign: "left" }
                    ]
                },
                extra: { mix: { column: { width: 16 } } }
            },
            electricityOpts: {
                dataLabel: false,
                padding: [15, 20, 0, 15],
                dataPointShape: false,
                xAxis: {
                    disableGrid: true,
                    rotateLabel: true,
                    fontSize: 10,
                    boundaryGap: true,
                    splitNumber: 12,
                    labelCount: 6,
                },
                yAxis: {
                    showTitle: true,
                    data: [
                        { title: '单位:kW' }
                    ]
                }
            },
            overview: {
                irradiance: "566",
                realTiemTem: "28",
                temperature: { max: "--", min: "--" },
                wind: { direction: "北风", level: "一" },
                maxSolarPower: { int: "--", dec: "" },
                maxLoadPower: { int: "--", dec: "" },
                maxIrradiance: { int: "--", dec: "" },
                maxIrradiancePrevious: { int: "--", dec: "" },
                timeOfMaxIrradiancePrevious: "--"
            },
            selectedDate: new Date().toISOString().split('T')[0],
            electricityData: {},
            weatherChartData: {}
        }
    },
    filters: {
        formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        }
    },
    mounted() {
        this.getAreaData();
        this.getTrendData();
        this.getWeatherData();
        this.getPowerData();
        this.getRealTimeData();
        this.getHisMaxIrradiance();
    },
    computed: {
        ...mapGetters(['currentSystem']),
        nyzDeviceList() {
            return this.currentSystem ? this.currentSystem.ammeterList : [];
        },
    },
    methods: {
        getWeatherStatus(irradiance) {
            if (irradiance >= 100) return '晴朗';
            if (irradiance >= 50) return '多云';
            if (irradiance >= 0) return '阴天';
            return '阴雨';
        },
        getAreaData() {
            this.areaData = this.$store.state.centerList.filter(item => item.level === 0 || item.level === 2);
            this.areaData.sort((a, b) => a.level !== b.level ? a.level - b.level : a.origin[0] - b.origin[0]);
        },
        getRealTimeData() {
            getSocketinstance().socket.emit("register");
            getSocketinstance().socket.on("nyzHcData", (jsonData) => {
                const { deviceType, address, dataType, data } = jsonData;
                if (deviceType === "1A01" && address === "01" && dataType === "3") {
                    this.overview.irradiance = parseFloat(data.B2);
                    this.overview.realTiemTem = parseFloat(data.B8)
                    this.overview.wind.direction = WWindUtil.windValueFormat(data.B0);
                    this.overview.wind.level = WWindUtil.WindtoLevel(data.B6).level;
                }
            });
        },
        onDateChange() {
            this.getWeatherData();
            this.getPowerData();
        },
        getWeatherImgUrl(irradiance) {
            if (irradiance >= 100) return 'img-sunny';
            if (irradiance >= 50 && irradiance < 100) return 'img-cloudy-1';
            if (irradiance >= 0 && irradiance < 50) return 'img-cloudy-2';
            if (irradiance < 0) return 'img-rainy';
        },
        async getTrendData() {
            try {
                const result = await weather.findWeatherMonitoringByFrameDatetimeBetweenByDeviceId({
                    deviceId: 5000535
                });
                if (result.data) {
                    const temperature = result.data.temperatureAnalysisDataModelList.reduce((pre, curr, idx) => {
                        const isActive = new Date(curr.date).toDateString() === new Date().toDateString();
                        const dateStr = isActive ? '今日' : this.$moment(curr.date).format('MM/DD');
                        if (isActive) {
                            this.overview.temperature.max = curr.maxWeatherData;
                            this.overview.temperature.min = curr.minWeatherData;
                        }
                        let windIndex = result.data.windSpeedDataModelList.findIndex(item => item.date === curr.date);
                        let windLevel = windIndex > -1
                            ? WWindUtil.WindtoLevel(result.data.windSpeedDataModelList[windIndex].maxWeatherData || 0).level
                            : '0';
                        let irradianceLevel = '低';
                        if (result.data.radiationAnalysisDataModelList && result.data.radiationAnalysisDataModelList[idx]) {
                            const irradianceValue = result.data.radiationAnalysisDataModelList[idx].minWeatherData;
                            irradianceLevel = irradianceValue < 5 ? '低' : (irradianceValue < 10 ? '中' : '高');
                        }
                        pre.trendList.push({ date: dateStr, wind: windLevel, irradiance: irradianceLevel, active: isActive });
                        pre.maxTemp.push(curr.maxWeatherData);
                        pre.minTemp.push(curr.minWeatherData);
                        return pre;
                    }, { trendList: [], maxTemp: [], minTemp: [] });
                    this.trendList = temperature.trendList;
                }
            } catch (err) {
                console.error('获取趋势数据失败:', err);
            }
        },
        async getWeatherData() {
            this.environmentLoading = true;
            try {
                const result = await weather.findWeatherStationByDaysByDeviceId({
                    startDay: this.selectedDate,
                    endDay: this.selectedDate,
                    deviceId: 5000535
                });
                if (result.data) {
                    const chartData = result.data.allWeatherStationStateModel.reduce((pre, curr) => {
                        pre.xAxis.push(this.$moment(curr.frame_datetime).format("HH:mm"));
                        pre.temperature.push(curr.channel5);
                        pre.irradiance.push(curr.channel2);
                        return pre;
                    }, { xAxis: [], temperature: [], irradiance: [] });
                    this.weatherChartData = {
                        categories: chartData.xAxis,
                        series: [
                            { name: '辐照度', data: chartData.irradiance, style: "curve", type: "line" },
                            { name: '温度', data: chartData.temperature, index: 1, style: "curve", type: 'line' }
                        ]
                    };
                    this.overview.maxIrradiance = this.getIntAndDec(Math.max(...chartData.irradiance));
                }
            } catch (err) {
                console.error('获取天气数据失败:', err);
            } finally {
                this.environmentLoading = false;
            }
        },
        async getPowerData() {
            try {
                const loadResult = await sapi.findPowerByLevelIdsAndDate({
                    areaLevelIds: this.areaData[0].origin,
                    startDate: this.selectedDate,
                    endDate: this.selectedDate,
                });
                if (!loadResult) return
                const allLoadData = loadResult.data.consumePower.allConsumePower;
                const chartData = allLoadData.reduce((pre, curr) => {
                    const dateStr = this.$moment(curr.frameDatetime).format('HH:mm');
                    pre.xAxis.push(dateStr);
                    pre.load.push(curr.forwardPower);
                    return pre;
                }, { xAxis: [], load: [] });
                const solarIds = this.nyzDeviceList.filter(item => item.type === 2).map(item => item.deviceId);
                const solarResult = await energy_new.queryStoragePowerCurve({
                    deviceIdList: solarIds,
                    date: this.selectedDate
                });
                if (solarResult.data) {
                    const solarData = {};
                    Object.keys(solarResult.data).forEach(key => {
                        const timeStr = this.$moment(key).format('HH:mm');
                        solarData[timeStr] = parseFloat(solarResult.data[key].toFixed(2));
                    });
                    chartData.solar = chartData.xAxis.map(time => solarData[time] || 0);
                } else {
                    chartData.solar = chartData.xAxis.map(() => 0);
                }
                this.electricityData = {
                    categories: chartData.xAxis,
                    series: [
                        { name: '光伏功率', data: chartData.solar },
                        { name: '负荷', data: chartData.load }
                    ]
                };
                this.overview.maxSolarPower = this.getIntAndDec(Math.max(...chartData.solar));
                this.overview.maxLoadPower = this.getIntAndDec(Math.max(...chartData.load));
            } catch (err) {
                console.error('获取电力数据失败:', err);
            }
        },
        async getHisMaxIrradiance() {
            try {
                const result = await weather.queryMaxIrradiance({ deviceId: 957107 });
                if (result.data) {
                    this.overview.maxIrradiancePrevious = this.getIntAndDec(result.data.maxIrradiance);
                    this.overview.timeOfMaxIrradiancePrevious = result.data.timeOfMaxIrradiance + ":00";
                }
            } catch (err) {
                console.error('获取历史最高辐照度失败:', err);
            }
        },
        getIntAndDec(num) {
            if (isNaN(num) || num === null || num === undefined) {
                return { int: "--", dec: "" };
            }
            const parts = num.toString().split('.');
            return { int: parts[0], dec: parts.length > 1 ? `.${parts[1]}` : "" };
        }
    }
}
</script>

<style scoped>
/* 基础样式 */
.weather-monitoring {
    background-color: #f8f9fa;
    min-height: 100vh;
    /* padding: 10rpx; */
    box-sizing: border-box;
}

/* 卡片通用样式 */
.overview-card,
.extreme-values-card,
.chart-section,
.chart-card {
    background-color: white;
    border-radius: 16rpx;
    /* box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05); */
    margin-bottom: 10rpx;
    overflow: hidden;
    /* transition: transform 0.3s ease, box-shadow 0.3s ease; */
}

.divider-line {
    height: 1px;
    background-color: #eaeaea;
    margin: 10px 0;
}



/* 卡片头部样式 */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.card-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
}

/* .card-title::before {
    content: '';
    width: 6rpx;
    height: 28rpx;
    background-color: #1890FF;
    border-radius: 3rpx;
    margin-right: 12rpx;
} */

.card-date {
    font-size: 24rpx;
    color: #666;
}

/* 概览区域样式 */
.overview-content {
    display: flex;
    padding: 32rpx;
    flex-direction: column;
}

.weather-icon-container {
    /* width: 240rpx;
    height: 240rpx; */
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    justify-content: space-around;
    margin-right: 32rpx;
    background: linear-gradient(135deg, #E6F7FF 0%, #BAE7FF 100%);
    border-radius: 16rpx;
    box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.1);
}

.weather-icon {
    width: 140rpx;
    height: 140rpx;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    /* animation: float 3s ease-in-out infinite; */
}

.weather-status {
    margin-top: 16rpx;
    padding: 8rpx 20rpx;
    /* background-color: rgba(255, 255, 255, 0.7); */
    border-radius: 20rpx;
}

.status-text {
    font-size: 24rpx;
    font-weight: 500;
    color: #1890FF;
}

.overview-stats {
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 8px 0;
    overflow-x: auto;
    scrollbar-width: none;
    /* 隐藏滚动条 */
}

.stat-card {
    min-width: 100px;
    padding: 12px;
    /* border-radius: 12px; */
    background: var(--bg-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.stat-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
}

.stat-value {
    display: flex;
    align-items: baseline;
}

.value-number {
    font-size: 12px;
    font-weight: 600;
    color: #333;
}

.value-unit {
    font-size: 10px;
    color: #999;
    margin-left: 4px;
}

/* 极值数据区域样式 */
.extreme-values {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rpx;
    padding: 12rpx;
}

.extreme-value-card {
    background: var(--gradient);
    border-radius: 16rpx;
    padding: 24rpx 10rpx;
    transition: transform 0.2s ease;
    flex-direction: column;
    display: flex;
    align-items: center;
}



.value-label {
    font-size: 26rpx;
    color: #333;
    margin-bottom: 16rpx;
    font-weight: 600;
}

.value-display {
    display: flex;
    align-items: baseline;
}

.value-int {
    font-size: 40rpx;
    font-weight: 600;
    color: #1890FF;
}

.value-dec {
    font-size: 32rpx;
    font-weight: 600;
    color: #1890FF;
    margin-left: 4rpx;
}

.value-unit {
    font-size: 28rpx;
    color: #666;
    margin-left: 8rpx;
}

.history-card {
    /* grid-column: 1 / -1; */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.history-content {
    flex: 1;
}

.value-history-time {
    font-size: 24rpx;
    color: #666;
    margin-top: 8rpx;
}

.timestamp {
    color: #1890FF;
}

/* 图表区域样式 */
.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx;
    margin-bottom: 16rpx;
}

.chart-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
}

.chart-title::before {
    content: '';
    width: 6rpx;
    height: 28rpx;
    background-color: #1890FF;
    border-radius: 3rpx;
    margin-right: 12rpx;
}

.date-picker {
    width: 280rpx;
    min-width: fit-content;
    border:unset
}

/* .chart-card {
    border-top: 4rpx solid var(--border-color);
} */

.chart-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx 16rpx;
}

.chart-indicators {
    display: flex;
}

.indicator {
    display: flex;
    align-items: center;
    margin-left: 24rpx;
}

.indicator-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background-color: var(--color);
    margin-right: 8rpx;
}

.indicator-text {
    font-size: 24rpx;
    color: #666;
}

.chart-container {
    height: 520rpx;
    padding: 0 32rpx 32rpx;
}

/* 天气图标样式 */
.img-sunny {
    background-image: url("../static/images/weather-sunny.png");
}

.img-cloudy-1 {
    background-image: url("../static/images/weather-cloudy-1.png");
}

.img-cloudy-2 {
    background-image: url("../static/images/weather-cloudy-2.png");
}

.img-rainy {
    background-image: url("../static/images/weather-rainy.png");
}

/* 动画效果 */
@keyframes float {
    0% {
        transform: translateY(0rpx);
    }

    50% {
        transform: translateY(-10rpx);
    }

    100% {
        transform: translateY(0rpx);
    }
}
</style>