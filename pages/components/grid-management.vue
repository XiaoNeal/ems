<template>
  <view class="grid-management" :class="{ fullscreen: isFullScreen }">

    <!-- 全屏模式头部 -->
    <view v-if="isFullScreen" class="fullscreen-header">
      <text class="fullscreen-title">{{ fullScreenType === 'power' ? '电网功率曲线' : '供馈电量统计' }}</text>
      <view class="fullscreen-exit-btn" @click="toggleFullScreen(fullScreenType)">
        <text>退出全屏</text>
      </view>
    </view>

    <view class="content">
      <!-- 电网数据卡片 -->
      <view class="stats-container">
        <view class="stat-row">
          <view class="stat-item double">
            <view class="stat-subitem">
              <text class="stat-label">电网实时功率</text>
              <view>
                <text class="stat-value">{{ gridPower !== undefined ? gridPower : '--' }}</text>
                <text class="stat-unit">kW</text>
              </view>
            </view>
            <view class="stat-subitem">
              <text class="stat-label">电网频率</text>
              <view>
                <text class="stat-value">{{ gridFrequency !== undefined ? gridFrequency : '--' }}</text>
                <text class="stat-unit">Hz</text>
              </view>
            </view>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item double">
            <view class="stat-subitem">
              <text class="stat-label">电网今日馈电量</text>
              <view>
                <text class="stat-value">{{ todayFeedEnergy !== undefined ? todayFeedEnergy : '--' }}</text>
                <text class="stat-unit">kWh</text>
              </view>
            </view>
            <view class="stat-subitem">
              <text class="stat-label">电网累计馈电量</text>
              <view>
                <text class="stat-value">{{ totalFeedEnergy !== undefined ? totalFeedEnergy : '--' }}</text>
                <text class="stat-unit">kWh</text>
              </view>
            </view>
          </view>
        </view>
        <view class="stat-row">
          <view class="stat-item double">
            <view class="stat-subitem">
              <text class="stat-label">电网今日供电</text>
              <view>
                <text class="stat-value">{{ todaySupplyEnergy !== undefined ? todaySupplyEnergy : '--' }}</text>
                <text class="stat-unit">kWh</text>
              </view>
            </view>
            <view class="stat-subitem">
              <text class="stat-label">电网累计供电</text>
              <view>
                <text class="stat-value">{{ totalSupplyEnergy !== undefined ? totalSupplyEnergy : '--' }}</text>
                <text class="stat-unit">kWh</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 电网数据区块 -->
      <view class="grid-data-section">
        <!-- 电网功率曲线 -->
        <view class="chart-section" :class="{ 'power-chart-section': isFullScreen && fullScreenType === 'power' }">
          <view class="chart-header">
            <text class="chart-title">电网功率曲线</text>
            <dy-date timeType="day" @getData="onPowerDateChange" v-model="powerDate" class="compact-date-picker" />
          </view>
          <view class="chart-body">
            <!-- <view class="axis-unit y-axis-unit">kW</view> -->
            <view v-if="powerCurveLoading" class="chart-loading">
              <view class="loading-spinner"></view>
              <text class="loading-text">加载中...</text>
            </view>
            <view v-else-if="powerCurveCategories.length > 0" class="chart-loaded">
              <qiun-data-charts type="area" :chartData="powerCurveData" :opts="powerCurveOptions" :ontouch="true"
                :canvas2d="canvas2d" class="power-chart" canvasId="CamoFLVpowerBqPYEJXtAEDIxdbLdHpZAvPitPOEWER"
                :key="powerCurveCategories.length" />
            </view>
            <EmptyState v-else title="暂无数据" desc="当前时段暂无电网功率数据" @refresh="getPowerCurveData" />
            <!-- <view class="axis-unit x-axis-unit">时</view> -->
          </view>
        </view>

        <view class="divider"></view>

        <!-- 供馈电量统计 -->
        <view class="chart-section" :class="{ 'energy-chart-section': isFullScreen && fullScreenType === 'energy' }">
          <view class="chart-header">
            <text class="chart-title">供馈电量统计</text>
            <view class="fullscreen-button" @click="toggleFullScreen('energy')">
              <text>{{ isFullScreen && fullScreenType === 'energy' ? '退出全屏' : '全屏' }}</text>
            </view>
          </view>
          <view class="chart-tab-bar">
            <view class="chart-tabs">
              <view v-for="(tab, i) in ['日', '月', '年']" :key="i"
                :class="['chart-tab-item', { active: activeDateTab === tab }]" @click="handleDateTypeChange(tab)">
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
            <!-- <view class="axis-unit y-axis-unit">kWh</view> -->
            <view v-if="energyLoading" class="chart-loading">
              <view class="loading-spinner"></view>
              <text class="loading-text">加载中...</text>
            </view>
            <view
              v-else-if="energyData.series && energyData.series[0] && energyData.series[0].data && energyData.series[0].data.length > 0"
              class="chart-loaded">
              <qiun-data-charts type="column" :chartData="energyData" :opts="energyOptions" :ontouch="true"
                :canvas2d="canvas2d" class="energy-chart" canvasId="CamoFLVBqPYEJXtAEDIxdbLdHpZAvPitEnergy" />
            </view>
            <EmptyState v-else title="暂无数据" desc="当前时段暂无供馈电量统计数据" @refresh="getElectricityStatistic" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import dyDate from '@/components/dy-Date/dy-Date.vue';
import { realtimeDataProvider } from '@/service/websocket';
import EmptyState from '@/components/empty-state/empty-state.vue';
import { getPowerData, queryDayElectricityStatistic, queryMonthElectricityStatistic, queryYearElectricityStatistic } from '../../api/power';
import { calculateYAxisMax } from '@/utils/tools';
export default {
  components: {
    dyDate,
    EmptyState,
  },
  name: "GridManagement",
  inject: ['get171FDeviceList'],
  data() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    return {
      chartId: 'grid-' + Math.random().toString(36).substr(2, 9),
      gridStatus: "正常",
      isFullScreen: false,
      fullScreenType: '', // 当前全屏的图表类型 'power' | 'energy'
      activeDateTab: '日',
      timeTypeIndex: 0,
      selectedDate: today,
      powerDate: today,
      canvas2d: this.$Config?.ISCANVAS2D ?? false,
      deviceList: [],
      device171F: null,
      // 电网功率曲线数据
      powerCurveSeries: [],
      powerCurveReverseSeries: [],
      powerCurveCategories: [],
      powerCurveLoading: false,
      energyLoading: false,
      // 供馈电量统计数据
      energyData: {
        categories: [],
        series: []
      },
    };
  },
  watch: {
    '$store.state.currentSelectDevice': {
      handler() {
        this.updateDevice171F()
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    energyOptions() {
      return {
        dataLabel: false,
        dataPointShape: false,
        color: ['#52C41A', '#FAAD14'],
        padding: [15, 20, 0, 15],
        enableScroll: false,
        animation: false,
        legend: { select: true },
        xAxis: { labelCount: 6, disableGrid: true },
        yAxis: {
          gridType: "dash",
          showTitle: true,
          data: [{ position: "left", title: "单位:kWh" }],
          dashLength: 2
        },
        extra: {
          column: {
            type: "group",
            categoryGap: 2
          }
        }
      }
    },
    powerCurveData() {
      return {
        categories: this.powerCurveCategories.length > 0 ? this.powerCurveCategories : [],
        series: [
          {
            name: '供电',
            data: this.powerCurveSeries.length > 0 ? this.powerCurveSeries : [],
            color: '#1890FF'
          },
          {
            name: '馈电',
            data: this.powerCurveReverseSeries.length > 0 ? this.powerCurveReverseSeries : [],
            color: '#52C41A'
          }
        ]
      }
    },
    gridFrequency() {
      const value = this.getFieldValue('B174');
      if (value === '--' || value === undefined || value === null) {
        return '--';
      }
      return parseFloat(value).toFixed(2);
    },
    gridPower() {
      return this.getFieldValue('B4');
    },
    todaySupplyEnergy() {
      return this.getFieldValue('B184');
    },
    totalSupplyEnergy() {
      return this.getFieldValue('B176');
    },
    todayFeedEnergy() {
      return this.getFieldValue('B188');
    },
    totalFeedEnergy() {
      return this.getFieldValue('B180');
    },
    powerCurveOptions() {
      const maxValue = calculateYAxisMax(this.powerCurveSeries, this.powerCurveReverseSeries);
      console.log(maxValue, 'maxValue')
      return {
        dataLabel: false,
        dataPointShape: false,
        padding: [15, 20, 0, 15],
        enableScroll: false,
        animation: false,
        legend: { select: true, tapLegend: true },
        xAxis: {
          labelCount: 6,
          disableGrid: true,
        },
        yAxis: {
          gridType: 'dash',
          dashLength: 2,
          showTitle: true,
          data: [{ title: "单位:kW", max: maxValue }],
          zeroLine: true,
          scale: true,
          splitNumber: 5,
          axisLabel: {
            format: val => val.toFixed(2)
          }
        },
        extra: { area: { type: "curve", gradient: true } },
        // extra: {
        //   area: {
        //     type: 'straight',
        //     opacity: 0.2,
        //     addLine: true,
        //     width: 2
        //   }
        // }
      }


    },
    energyOptions() {
      const allData = this.energyData.series.flatMap(s => s.data || []);
      const maxValue = calculateYAxisMax(allData);
      return {
        dataLabel: false,
        dataPointShape: false,
        color: ['#52C41A', '#FAAD14'],
        padding: [15, 20, 0, 15],
        enableScroll: false,
        animation: false,
        legend: { select: true },
        xAxis: { labelCount: 6, disableGrid: true },
        yAxis: {
          gridType: "dash",
          showTitle: true,
          data: [{ position: "left", title: "单位:kWh", max: maxValue }],
          dashLength: 2
        },
        extra: {
          column: {
            type: "group",
            categoryGap: 2
          }
        }
      }
    }
  },
  methods: {
    updateDevice171F() {
      this.deviceList = realtimeDataProvider.getDeviceList()
      this.device171F = this.deviceList.find(item => item && item.deviceType === '171F');
    },
    init171FDevice() {
      this.deviceList = this.get171FDeviceList();
    },
    getFieldValue(key) {
      if (!this.device171F || !this.device171F.energyData || this.device171F.energyData[key] === undefined) {
        return "--";
      }
      return this.device171F.energyData[key].value;
    },
    // 获取电网功率曲线数据
    async getPowerCurveData() {
      this.powerCurveLoading = true;
      try {
        const currentDevice = this.$store.state.currentSelectDevice || {};

        const params = {
          esId: currentDevice.id || 28,
          date: this.powerDate,
          areaLevelIds: currentDevice.areaLevelId || 991
        };
        const res = await getPowerData(params);
        if (res && res.data && res.data.length > 0) {
          const dataList = res.data;
          const categories = [];
          const series = [];
          const reverseSeries = [];

          // 分别获取正向和反向电网功率
          dataList.forEach(item => {
            const dateTime = item.dateTime || '';
            const timeStr = dateTime.substring(11, 16);
            categories.push(timeStr);

            // 正向电网功率
            const gridPower = parseFloat(item.gridPower || 0);
            series.push(isNaN(gridPower) ? 0 : parseFloat(gridPower.toFixed(2)));

            // 反向电网功率
            // const gridPowerReverse = parseFloat(item.gridPowerReverse || 0);
            // reverseSeries.push(isNaN(gridPowerReverse) ? 0 : parseFloat(gridPowerReverse.toFixed(2)));
            let gridPowerReverse = parseFloat(item.gridPowerReverse || 0);
            // if (!isNaN(gridPowerReverse)) {
            //   // 统一：无论原始正负，反向功率强制为负
            //   gridPowerReverse = -Math.abs(gridPowerReverse);
            // }
            reverseSeries.push(parseFloat(gridPowerReverse.toFixed(2)));
          });

          this.powerCurveCategories = categories;
          this.powerCurveSeries = series;
          this.powerCurveReverseSeries = reverseSeries;

          console.log('电网功率曲线数据:', this.powerCurveCategories, this.powerCurveSeries, this.powerCurveReverseSeries);
        } else {
          this.powerCurveCategories = [];
          this.powerCurveSeries = [];
          this.powerCurveReverseSeries = [];
        }
        this.powerCurveLoading = false;
      } catch (error) {
        console.error('获取电网功率曲线数据失败:', error);
        this.powerCurveCategories = [];
        this.powerCurveSeries = [];
        this.powerCurveReverseSeries = [];
        this.powerCurveLoading = false;
      }
    },
    refresh() {
      // 刷新数据
      console.log('刷新电网管理数据');
      this.getPowerCurveData();
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
        title: this.isFullScreen ? (type === 'power' ? '电网功率曲线全屏' : '供馈电量统计全屏') : '退出全屏',
        icon: 'none',
        duration: 1500
      });
    },
    handleDateTypeChange(type) {
      this.activeDateTab = type;
      if (type === '日') {
        this.timeTypeIndex = 0;
      } else if (type === '月') {
        this.timeTypeIndex = 1;
      } else if (type === '年') {
        this.timeTypeIndex = 2;
      }
      this.getElectricityStatistic();
    },

    getElectricityStatistic() {
      this.energyLoading = true;
      if (this.timeTypeIndex === 0) {
        this.getDayElectricityStatistic();
      } else if (this.timeTypeIndex === 1) {
        this.getMonthElectricityStatistic();
      } else if (this.timeTypeIndex === 2) {
        this.getYearElectricityStatistic();
      }
    },

    getDayElectricityStatistic() {
      const currentDevice = this.$store.state.currentSelectDevice;
      const esId = currentDevice.esId || currentDevice.id;
      const areaLevelIds = currentDevice.areaLevelId;

      queryDayElectricityStatistic({
        esId: esId,
        date: this.selectedDate,
        areaLevelIds: areaLevelIds
      }).then((res) => {
        const dataList = res.data || [];
        const sortedData = dataList.sort((a, b) => a.hour - b.hour);
        this.energyData = {
          categories: sortedData.map(item => `${(item.hour)}时`),
          series: [
            { name: "供电量", data: sortedData.map(item => parseFloat(item.gridPowerSupply) || 0), color: '#52C41A' },
            { name: "馈电量", data: sortedData.map(item => parseFloat(item.gridPowerSupplyReverse) || 0), color: '#FAAD14' }
          ],
        };
        this.energyLoading = false;
      }).catch(() => {
        this.energyData = {
          categories: [],
          series: [
            { name: "供电量", data: [], color: '#52C41A' },
            { name: "馈电量", data: [], color: '#FAAD14' }
          ],
        };
        this.energyLoading = false;
      });
    },

    getMonthElectricityStatistic() {
      const date = new Date(this.selectedDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

      const currentDevice = this.$store.state.currentSelectDevice || {};
      const esId = currentDevice.esId || currentDevice.id;
      const areaLevelIds = currentDevice.areaLevelId;

      queryMonthElectricityStatistic({
        esId: esId,
        startDate: startDate,
        endDate: endDate,
        areaLevelIds: areaLevelIds
      }).then((res) => {
        const dataList = res.data || [];
        this.energyData = {
          categories: dataList.map(item => {
            const day = parseInt(item.date?.split('-')[2]) || item.day || 0;
            return day > 0 ? `${day}日` : `${dataList.indexOf(item) + 1}日`;
          }),
          series: [
            { name: "供电量", data: dataList.map(item => parseFloat(item.gridPowerSupply) || 0), color: '#52C41A' },
            { name: "馈电量", data: dataList.map(item => parseFloat(item.gridPowerSupplyReverse) || 0), color: '#FAAD14' }
          ],
        };
        this.energyLoading = false;
      }).catch(() => {
        this.energyData = {
          categories: [],
          series: [
            { name: "供电量", data: [], color: '#52C41A' },
            { name: "馈电量", data: [], color: '#FAAD14' }
          ],
        };
        this.energyLoading = false;
      });
    },

    getYearElectricityStatistic() {
      const date = new Date(this.selectedDate);
      const year = date.getFullYear();

      const currentDevice = this.$store.state.currentSelectDevice || {};
      const esId = currentDevice.esId || currentDevice.id;
      const areaLevelIds = currentDevice.areaLevelId;

      queryYearElectricityStatistic({
        esId: esId,
        year: year,
        areaLevelIds: areaLevelIds
      }).then((res) => {
        const dataList = res.data || [];
        this.energyData = {
          categories: dataList.map(item => {
            const month = parseInt(item.date?.split('-')[1]) || item.month || 0;
            return month > 0 ? `${month}月` : `${dataList.indexOf(item) + 1}月`;
          }),
          series: [
            { name: "供电量", data: dataList.map(item => parseFloat(item.gridPowerSupply) || 0), color: '#52C41A' },
            { name: "馈电量", data: dataList.map(item => parseFloat(item.gridPowerSupplyReverse) || 0), color: '#FAAD14' }
          ],
        };

        this.energyLoading = false;
      }).catch(() => {
        this.energyData = {
          categories: [],
          series: [
            { name: "供电量", data: [], color: '#52C41A' },
            { name: "馈电量", data: [], color: '#FAAD14' }
          ],
        };
        this.energyLoading = false;
      });
    },
    handleDatePicker(date) {
      console.log('选择的日期:', date);
      this.selectedDate = date;
      this.getElectricityStatistic();
    },
    onPowerDateChange(date) {
      console.log('功率曲线日期变化:', date);
      this.powerDate = date;
      this.getPowerCurveData();
    }
  },
  mounted() {
    this.init171FDevice();
    this.getPowerCurveData();
    this.getElectricityStatistic();
  }
};
</script>

<style lang="scss" scoped>
/* 全局安全区域适配 */
@supports (top: env(safe-area-inset-top)) {
  .grid-management {
    padding-top: calc(20rpx + env(safe-area-inset-top));
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  }

  /* 全屏时安全区样式（避开刘海/状态栏） */
  .grid-management.fullscreen {
    padding-top: env(safe-area-inset-top) !important;
    padding-left: env(safe-area-inset-left) !important;
    padding-right: env(safe-area-inset-right) !important;
    padding-bottom: env(safe-area-inset-bottom) !important;
  }
}

/* 兼容不支持安全区域的设备 */
.grid-management {
  padding: 20rpx;
  background: #EFF4FB;
  min-height: calc(100vh - 40rpx);
  box-sizing: border-box;
  transition: all 0.3s ease;
}

/* 全屏模式 */
.grid-management.fullscreen {
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
.grid-management.fullscreen .content {
  padding-top: calc(env(safe-area-inset-top) + 88rpx);
  height: 100vh;
  box-sizing: border-box;
}

/* 全屏时隐藏统计卡片 */
.grid-management.fullscreen .stats-container {
  display: none;
}

/* 全屏时日期选择器固定 */
.grid-management.fullscreen .date-selector {
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
.grid-management.fullscreen .grid-data-section {
  padding-top: calc(env(safe-area-inset-top) + 176rpx);
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 176rpx);
  margin: 0;
  border-radius: 0;
  overflow: hidden;
}

/* 全屏时只显示当前图表 */
.grid-management.fullscreen .chart-section {
  display: none;
}

.grid-management.fullscreen .chart-section.power-chart-section,
.grid-management.fullscreen .chart-section.energy-chart-section {
  display: block;
}

.grid-management.fullscreen .chart-section:not(.power-chart-section):not(.energy-chart-section) {
  display: none;
}

.header {
  margin-bottom: 20rpx;

  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
}

/* 统计数据 */
.stats-container {
  margin-bottom: 20rpx;
}

.stat-row {
  display: flex;
  // margin-bottom: 10rpx;
  background: #fff;
  padding: 16rpx 10rpx;
  // border-radius: 16rpx;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
}

.stat-item.vertical {
  flex-direction: column;
  align-items: flex-start;
}

.stat-item.double {
  display: flex;
  flex-direction: column;
  flex: 0.5;
}

.stat-divider {
  width: 1rpx;
  height: 60rpx;
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
  font-size: 18px;
  font-weight: bold;
  color: #4488FB;

  &.negative {
    color: #EB3341;
  }
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
  background: #fff;
  /* border-radius: 12rpx; */
  padding: 16rpx 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 100;
  /* 保证层级 */
}

.date-tabs {
  display: flex;
  /* gap: 10rpx; */
}

.date-tab {
  padding: 6rpx 30rpx;
  border: 1rpx solid #e8e8e8;
  /* border-radius: 20rpx; */
  font-size: 15px;
  color: #666;
  background: #f8f9fa;
  cursor: pointer;
}

.date-tab.active {
  background: #4488FB;
  color: #fff;
  border-color: #4488FB;
}

.grid-data-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  // margin-bottom: 20rpx;
}

.divider {
  height: 1px;
  background: #f0f0f0;
  margin: 24rpx 0;
}

.chart-section {
  background: transparent;
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .chart-title {
      font-size: 28rpx;
      font-weight: 500;
      color: #333;
    }

    .fullscreen-button {
      font-size: 24rpx;
      color: #4488FB;
    }
  }

  .chart-placeholder {
    height: 300rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 12rpx;

    text {
      font-size: 24rpx;
      color: #999;
    }
  }

  .power-chart {
    background: linear-gradient(to bottom, #e3f2fd 0%, #fff 100%);
  }

  .energy-chart {
    background: #f9f9f9;
  }
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

/* 坐标轴单位 */
.chart-body {
  position: relative;
  height: 450rpx;
}

.axis-unit {
  position: absolute;
  font-size: 22rpx;
  color: #999;
  z-index: 10;
}

.y-axis-unit {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
}

.x-axis-unit {
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
}

.chart-loading {
  width: 100%;
  height: 450rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8rpx;
  animation: fadeIn 0.3s ease-out;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #e0e0e0;
  border-top-color: #4488FB;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.loading-text {
  color: #999;
  font-size: 28rpx;
  margin-top: 16rpx;
}

.chart-loaded {
  width: 100%;
  height: 450rpx;
  animation: fadeIn 0.5s ease-out;
}

.chart-empty {
  width: 100%;
  height: 450rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8rpx;
  animation: fadeIn 0.5s ease-out;
}

.empty-text {
  color: #999;
  font-size: 28rpx;
}
</style>