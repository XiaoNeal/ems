<template>
  <view class="pv-monitor container" :class="{ fullscreen: isFullScreen }">

    <!-- 全屏模式头部 -->
    <view v-if="isFullScreen" class="fullscreen-header">
      <text class="fullscreen-title">{{ fullScreenType === 'power' ? '发电功率曲线' : '发电量统计' }}</text>
      <view class="fullscreen-exit-btn" @click="toggleFullScreen(fullScreenType)">
        <text>退出全屏</text>
      </view>
    </view>

    <!-- 数据卡片区域 -->
    <view class="stats-box">
      <view class="stat-row">
        <view class="stat-item vertical" style="justify-content: center;">
          <view class="stat-subitem">
            <text class="stat-label">当日发电量</text>
            <text class="stat-value">{{ device171F && device171F.energyData && device171F.energyData.B78 !== undefined ?
              device171F.energyData.B78.value : "--" }}<text class="stat-unit">kWh</text></text>
          </view>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item vertical">
          <view class="stat-subitem">
            <text class="stat-label">累计发电量</text>
            <text class="stat-value">{{ device171F && device171F.energyData && device171F.energyData.B106 !== undefined
              ?
              device171F.energyData.B106.value : "--" }}<text class="stat-unit">kWh</text></text>
          </view>
          <view class="stat-subitem">
            <text class="stat-label">累计发电时长</text>
            <text class="stat-value">{{ device171F && device171F.energyData && device171F.energyData.B110 !== undefined
              ?
              device171F.energyData.B110.value : "--" }}<text class="stat-unit">天</text></text>
          </view>
        </view>
      </view>

      <view class="section-divider"></view>

      <view class="stat-row">
        <view class="stat-item vertical">
          <view class="stat-subitem">
            <text class="stat-label">日最高发电量</text>
            <text class="stat-value">{{ device171F && device171F.energyData && device171F.energyData.B82 !== undefined
              ?
              device171F.energyData.B82.value : "--" }}<text class="stat-unit">kWh</text></text>
          </view>
          <view class="stat-subitem">
            <text class="stat-label">出现在</text>
            <text class="stat-value small">{{ formatMaxGenerationTime(device171F) }}</text>
          </view>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item vertical">
          <view class="stat-subitem">
            <text class="stat-label">历史最高发电功率</text>
            <text class="stat-value ">{{ device171F && device171F.energyData && device171F.energyData.B92 !== undefined
              ?
              device171F.energyData.B92.value : "--" }}<text class="stat-unit">kW</text></text>
          </view>
          <view class="stat-subitem">
            <text class="stat-label">出现在</text>
            <text class="stat-value small">{{ formatMaxPowerTime(device171F) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 数据图表板块 -->
    <view class="data-chart-section">
      <!-- 图表区域 -->
      <view class="chart-section">
        <view class="chart-card" :class="{ 'power-chart-card': isFullScreen && fullScreenType === 'power' }">
          <view class="chart-header">
            <text class="chart-title">发电功率曲线</text>
            <dy-date timeType="day" @getData="onPowerDateChange" v-model="powerDate" class="compact-date-picker" />
          </view>
          <view class="chart-body">
            <qiun-data-charts type="area" :chartData="powerCurveData" :opts="powerCurveOptions" :ontouch="true"
              :canvas2d="canvas2d" class="power-chart" :canvas-id="chartId + '-power'" />
          </view>
        </view>

        <!-- 分割线 -->
        <view class="card-divider"></view>

        <view class="chart-card" :class="{ 'generation-chart-card': isFullScreen && fullScreenType === 'generation' }">
          <view class="chart-header">
            <text class="chart-title">发电量统计</text>
            <view class="chart-controls">
              <view class="chart-tab fullscreen-btn" @click="toggleFullScreen('generation')">
                {{ isFullScreen && fullScreenType === 'generation' ? '退出全屏' : '全屏' }}
              </view>
            </view>
          </view>
          <view class="chart-tab-bar">
            <view class="chart-tabs">
              <view v-for="(tab, i) in ['日', '月', '年']" :key="i"
                :class="['chart-tab-item', { active: activeDateTab === tab }]" @click="switchDateTab(tab)">
                {{ tab }}
              </view>
            </view>
            <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate"
              class="custom-picker date-picker" />
            <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker" v-model="selectedDate"
              class="custom-picker date-picker" />
            <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate"
              class="custom-picker date-picker" />
          </view>
          <view class="chart-body">
            <qiun-data-charts type="column" :chartData="generationData" :opts="generationOptions" :ontouch="true"
              :canvas2d="canvas2d" class="generation-chart" :canvas-id="chartId + '-generation'" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import dyDate from '@/components/dy-Date/dy-Date.vue';
import {
  findPhotovoltaicEnergyInfo,
  // queryDayGeneratedPower,
  getPowerData,
  queryDayElectricityStatistic,
  queryMonthElectricityStatistic,
  queryYearElectricityStatistic
} from '../../api/power';
import { realtimeDataProvider } from '@/service/websocket';

export default {
  components: {
    dyDate,
  },
  name: "PV-Management",
  data() {
    return {
      chartId: 'pv-' + Math.random().toString(36).substr(2, 9),
      canvas2d: this.$Config?.ISCANVAS2D ?? false,
      dailyGeneration: "--",
      totalGeneration: "--",
      incomeValue: "--",
      runningDays: "--",
      maxGeneration: "--",
      historyGenerationPower: "--",
      maxGenerationTime: "--",
      historyGenerationPowerTime: "--",

      activeDateTab: "日",
      timeTypeIndex: 0,
      selectedDate: new Date().toISOString().split('T')[0],
      powerDate: new Date().toISOString().split('T')[0],
      isFullScreen: false,
      fullScreenType: '', // 当前全屏的图表类型 'power' | 'generation'

      powerCurveSeries: [],
      generationSeries: [],
      generationCategories: [],
      deviceList: []
    };
  },

  computed: {

    device171F() {
      // return this.deviceList
      // console.log(this.deviceList, 'deviceList1211113333333333333', this.deviceList.find(item => item && item.deviceType === '171F'));
      let device = this.deviceList.find(item => item && item.deviceType === '171F');

      return device;
    },
    powerCurveData() {
      return {
        categories: this.powerCurveSeries.length > 0 ? ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'] : [],
        series: [{ data: this.powerCurveSeries.length > 0 ? this.powerCurveSeries : [], name: '发电功率' }]
      }
    },
    powerCurveOptions() {
      return {
        dataLabel: false,
        dataPointShape: false,
        color: ["#6DE188"],
        xAxis: { labelCount: 6, disableGrid: true },
        yAxis: { gridType: "dash", data: [{ position: "left", title: "单位:kW" }] },
        extra: { area: { type: "curve", gradient: true } }
      }
    },
    generationData() {
      return {
        categories: this.generationCategories.length > 0 ? this.generationCategories : [],
        series: [{ data: this.generationSeries.length > 0 ? this.generationSeries : [], name: '发电量' }]
      }
    },
    generationOptions() {
      return {
        dataLabel: false,
        dataPointShape: false,
        color: ["#6DE188"],
        xAxis: { labelCount: 8, disableGrid: true },
        yAxis: { gridType: "dash", data: [{ position: "left", title: "单位:kWh" }] },
      }
    }
  },
  mounted() {
    this.init171FDevice();
    this.getPhotovoltaicEnergyInfo();
    this.getDayGeneratedPower();
    this.getElectricityStatistic();
  },



  methods: {
    init171FDevice() {
      const device171F = {
        deviceType: '171F',
        typeCode: '171F',
        address: '01',
        barCode: '00 00 02 20 26 05 18 15 21 04 02 00 00 00 00',
        deviceId: '171F001',
        name: 'DCDC设备171F'
      };
      realtimeDataProvider.initDeviceList([device171F]);
      this.deviceList = realtimeDataProvider.getDeviceList();

      // console.log(this.deviceList, 'deviceList121111', this.deviceList.find(item => item && item.deviceType === '171F'));
    },
    formatMaxGenerationTime(device) {
      if (!device || !device.energyData) return "--";
      const year = device.energyData.B86?.value;
      const month = device.energyData.B88?.value;
      const day = device.energyData.B90?.value;
      
      if (year && month && day) {
        const monthStr = String(month).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year}-${monthStr}-${dayStr}`;
      }
      return "--";
    },
    formatMaxPowerTime(device) {
      if (!device || !device.energyData) return "--";
      const year = device.energyData.B96?.value;
      const month = device.energyData.B98?.value;
      const day = device.energyData.B100?.value;
      const hour = device.energyData.B102?.value;
      const minute = device.energyData.B104?.value;
      
      if (year && month && day) {
        const monthStr = String(month).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const hourStr = hour ? String(hour).padStart(2, '0') : '00';
        const minuteStr = minute ? String(minute).padStart(2, '0') : '00';
        return `${year}-${monthStr}-${dayStr} ${hourStr}:${minuteStr}`;
      }
      return "--";
    },
    getPhotovoltaicEnergyInfo() {
      findPhotovoltaicEnergyInfo({
        esId: 8,
        areaLevelIds: 940
      }).then((res) => {
        if (!res.data) return;
        this.dailyGeneration = res.data.dayProvideQ ?? "--";
        this.totalGeneration = res.data.totalProvideQ ?? "--";
        this.incomeValue = res.data.dayProvideIncome ?? "--";
        this.runningDays = res.data.totalProvideTime ?? "--";
        this.maxGeneration = res.data.dayMaxProvideQ ?? "--";
        this.maxGenerationTime = res.data.dayMaxProvideQDatetime ?? "--";
        this.historyGenerationPower = res.data.maxProvidePower ?? "--";
        this.historyGenerationPowerTime = res.data.maxProvidePowerDatetime ?? "--";
      });
    },

    getDayGeneratedPower() {
      getPowerData({
        esId: 8,
        date: this.selectedDate,
        areaLevelIds: 940
      }).then((res) => {
        if (!res.data || res.data.length === 0) {
          this.powerCurveSeries = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          return;
        }

        const dataList = res.data;
        const hourlyData = [];
        
        // 按每2小时聚合数据（0-23小时，每2小时取一个点）
        for (let i = 0; i < 24; i += 2) {
          // 找到该小时范围内的数据
          const hourData = dataList.filter(item => {
            const time = item.dateTime || '';
            const hour = parseInt(time.substring(11, 13)) || 0;
            return hour >= i && hour < i + 2;
          });
          
          if (hourData.length > 0) {
            // 计算平均值
            const avgValue = hourData.reduce((sum, item) => sum + (parseFloat(item.generatedPower || 0)), 0) / hourData.length;
            hourlyData.push(parseFloat(avgValue.toFixed(2)));
          } else {
            hourlyData.push(0);
          }
        }
        
        this.powerCurveSeries = hourlyData;
      });
    },

    getElectricityStatistic() {
      if (this.timeTypeIndex === 0) {
        this.getDayElectricityStatistic();
      } else if (this.timeTypeIndex === 1) {
        this.getMonthElectricityStatistic();
      } else if (this.timeTypeIndex === 2) {
        this.getYearElectricityStatistic();
      }
    },

    getDayElectricityStatistic() {
      queryDayElectricityStatistic({
        esId: 8,
        date: this.selectedDate,
        areaLevelIds: 940
      }).then((res) => {
        if (!res.data) {
          this.generationSeries = Array.from({ length: 24 }, () => 0);
          this.generationCategories = Array.from({ length: 24 }, (_, i) => i + 1);
          return;
        }

        const generatedPower = parseFloat(res.data.photovoltaicPower) || 0;
        this.generationSeries = Array.from({ length: 24 }, (_, i) => {
          const hour = i;
          if (hour >= 6 && hour <= 18) {
            const value = generatedPower * Math.sin((hour - 6) * Math.PI / 12);
            return parseFloat(value.toFixed(2));
          }
          return 0;
        });
        this.generationCategories = Array.from({ length: 24 }, (_, i) => i + 1);
      });
    },

    getMonthElectricityStatistic() {
      const date = new Date(this.selectedDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

      queryMonthElectricityStatistic({
        esId: 8,
        startDate: startDate,
        endDate: endDate,
        areaLevelIds: 940
      }).then((res) => {
        if (!res.data || !res.data || res.data.length === 0) {
          this.generationSeries = Array.from({ length: 30 }, () => 0);
          this.generationCategories = Array.from({ length: 30 }, (_, i) => i + 1);
          return;
        }

        this.generationSeries = res.data.map(item => parseFloat(item.photovoltaicPower) || 0);
        this.generationCategories = res.data.map((item, i) => i + 1);
      });
    },

    getYearElectricityStatistic() {
      const date = new Date(this.selectedDate);
      const year = date.getFullYear();

      queryYearElectricityStatistic({
        esId: 8,
        year: year,
        areaLevelIds: 940
      }).then((res) => {

        console.log(res.data, "111111111111");
        if (!res.data || !res.data || res.data.length === 0) {
          this.generationSeries = Array.from({ length: 12 }, () => 0);
          this.generationCategories = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
          return;
        }
        console.log(res.data, "111111111111");
        this.generationSeries = res.data.map(item => parseFloat(item.photovoltaicPower) || 0);
        this.generationCategories = res.data.map((item, i) => `${i + 1}月`);
      });
    },

    switchDateTab(tab) {
      this.activeDateTab = tab;
      if (tab === '日') {
        this.timeTypeIndex = 0;
      } else if (tab === '月') {
        this.timeTypeIndex = 1;
      } else if (tab === '年') {
        this.timeTypeIndex = 2;
      }
      this.getElectricityStatistic();
    },

    handleDatePicker(value) {
      this.selectedDate = value;
      this.getDayGeneratedPower();
      this.getElectricityStatistic();
      console.log("选中日期：", value, " 类型：", this.activeDateTab);
    },

    onPowerDateChange(date) {
      console.log('发电功率曲线日期变化:', date);
      this.powerDate = date;
      this.selectedDate = date;
      this.getDayGeneratedPower();
    },

    toggleFullScreen(type) {
      if (this.isFullScreen && this.fullScreenType === type) {
        // 退出全屏
        this.isFullScreen = false;
        this.fullScreenType = '';

        // #ifdef APP-PLUS
        plus.screen.lockOrientation('portrait-primary');
        plus.navigator.setFullscreen(false);
        // #endif
      } else {
        // 进入全屏
        this.isFullScreen = true;
        this.fullScreenType = type;

        // #ifdef APP-PLUS
        plus.screen.lockOrientation('landscape-primary');
        plus.navigator.setFullscreen(true);
        // #endif
      }

      uni.showToast({
        title: this.isFullScreen ? (type === 'power' ? '发电功率曲线全屏' : '发电量统计全屏') : '退出全屏',
        icon: 'none',
        duration: 1500
      });
    }
  },


}
</script>

<style scoped>
/* 基础样式 */
.container {
  padding: 20rpx;
  background-color: #f5f7fa;
}

.pv-monitor {
  background-color: #f5f7fa;
}

/* 全屏模式 */
.pv-monitor.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

/* 全屏头部 */
.fullscreen-header {
  position: fixed;
  top: env(safe-area-inset-top);
  left: 0;
  right: 0;
  z-index: 1001;
  height: 88rpx;
  padding: 0 20rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fullscreen-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.fullscreen-exit-btn {
  padding: 10rpx 20rpx;
  background: #4488FB;
  border-radius: 40rpx;
  font-size: 24rpx;
  color: #fff;
}

/* 全屏内容区域 */
.pv-monitor.fullscreen .data-chart-section {
  padding-top: calc(env(safe-area-inset-top) + 88rpx);
  height: 100vh;
  box-sizing: border-box;
}

/* 全屏时隐藏统计卡片 */
.pv-monitor.fullscreen .stats-box {
  display: none;
}

/* 全屏时日期选择器固定 */
.pv-monitor.fullscreen .date-selector {
  position: fixed;
  top: calc(env(safe-area-inset-top) + 88rpx);
  left: 0;
  right: 0;
  z-index: 1000;
  margin: 0;
  border-radius: 0;
  border-bottom: 1rpx solid #f0f0f0;
}

/* 全屏时图表区域 */
.pv-monitor.fullscreen .chart-section {
  padding-top: calc(env(safe-area-inset-top) + 176rpx);
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 176rpx);
  margin: 0;
  overflow: hidden;
}

/* 全屏时只显示当前图表 */
.pv-monitor.fullscreen .chart-card {
  display: none;
}

.pv-monitor.fullscreen .chart-card.power-chart-card,
.pv-monitor.fullscreen .chart-card.generation-chart-card {
  display: block;
  padding: 20rpx;
  border-radius: 0;
  height: 100%;
}

.pv-monitor.fullscreen .chart-card:not(.power-chart-card):not(.generation-chart-card) {
  display: none;
}

.pv-monitor.fullscreen .card-divider {
  display: none;
}

/* 全屏按钮样式 */
.fullscreen-btn {
  cursor: pointer;
  background: #f0f4ff;
  color: #4488FB;
}

.fullscreen-btn:hover {
  background: #e0e9ff;
}

/* 数据卡片 */
.stats-box {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx 10rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 区块分割线 */
.section-divider {
  height: 1rpx;
  background-color: #eee;
  margin: 20rpx 0;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.stat-row:last-child {
  margin-bottom: 0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  /* background: #f8f9fa; */
  border-radius: 8rpx;
}

.stat-item:last-child {
  margin-right: 0;
}

.stat-item.vertical {
  flex-direction: column;
  align-items: flex-start;
}

.stat-divider {
  width: 1rpx;
  height: 80rpx;
  background-color: #e8e8e8;
  margin: 0 16rpx;
  align-self: center;
}

.stat-subitem {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8rpx;
}

.stat-subitem:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-right: 8rpx;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #4488FB;
}

.stat-value.small {
  font-size: 10px;
  font-weight: normal;
}

.stat-unit {
  font-size: 8px;
  color: #666;
  margin-left: 4rpx;
}

.date-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 20rpx;
  background: #fff;
}

.date-tabs {
  display: flex;
}

.date-tab {
  padding: 8rpx 24rpx;
  border: 1rpx solid #e8e8e8;
  font-size: 14px;
  color: #666;
  background: #f8f9fa;
}

.date-tab.active {
  background: #4488FB;
  color: #fff;
  border-color: #4488FB;
}

.section-divider {
  height: 1rpx;
  background-color: #f0f0f0;
  margin: 0;
}

.card-divider {
  height: 1rpx;
  background-color: #f0f0f0;
  margin: 10rpx 0;
}

.chart-section {
  margin-top: 10rpx;
}

.chart-card {
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.chart-title {
  font-size: 32rpx;
  font-weight: 600;
}

.chart-controls {
  display: flex;
}

.chart-tab {
  padding: 6rpx 16rpx;
  background: #f0f4ff;
  border-radius: 6rpx;
  font-size: 12px;
  color: #666;
}

.chart-body {
  margin-top: 10rpx;
}

.power-chart,
.generation-chart {
  width: 100%;
  min-height: 400rpx;
}

.custom-picker {
  font-size: 12px;
}

.date-picker {
  font-size: 12px;
}

/* 图表日期选择栏 */
.chart-tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16rpx 20rpx;
  margin: 12rpx 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 100;
}

.chart-tabs {
  display: flex;
}

.chart-tab-item {
  padding: 6rpx 30rpx;
  border: 1rpx solid #e8e8e8;
  font-size: 15px;
  color: #666;
  background: #f8f9fa;
  cursor: pointer;
}

.chart-tab-item.active {
  background: #4488FB;
  color: #fff;
  border-color: #4488FB;
}

/* 紧凑型日期选择器 */
.compact-date-picker {
  font-size: 12px;
  color: #4488FB;
}
</style>