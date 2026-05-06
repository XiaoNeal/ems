<template>
  <view class="pv-monitor container">
    <!-- 数据卡片区域 -->
    <view class="stats-box">
      <view class="stat-row">
        <view class="stat-item vertical" style="justify-content: center;">
          <view class="stat-subitem">
            <text class="stat-label">当日发电量</text>
            <text class="stat-value">{{ dailyGeneration }}<text class="stat-unit">kWh</text></text>
          </view>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item vertical">
          <view class="stat-subitem">
            <text class="stat-label">累计发电量</text>
            <text class="stat-value">{{ totalGeneration }}<text class="stat-unit">kWh</text></text>
          </view>
          <view class="stat-subitem">
            <text class="stat-label">累计发电时长</text>
            <text class="stat-value">{{ runningDays }}<text class="stat-unit">天</text></text>
          </view>
        </view>
      </view>
      <view class="stat-row">
        <view class="stat-item vertical">
          <view class="stat-subitem">
            <text class="stat-label">日最高发电量</text>
            <text class="stat-value">{{ maxGeneration }}<text class="stat-unit">kWh</text></text>
          </view>
          <view class="stat-subitem">
            <text class="stat-label">出现在</text>
            <text class="stat-value small">{{ maxGenerationTime }}</text>
          </view>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item vertical">
          <view class="stat-subitem">
            <text class="stat-label">历史最高发电功率</text>
            <text class="stat-value ">{{ historyGenerationPower }}<text class="stat-unit">kW</text></text>
          </view>
          <view class="stat-subitem">
            <text class="stat-label">出现在</text>
            <text class="stat-value small">{{ historyGenerationPowerTime }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 数据图表板块 -->
    <view class="data-chart-section">
      <!-- 日期选择器：使用dy-date组件 -->
      <view class="date-selector">
        <view class="date-tabs">
          <view v-for="(tab, i) in ['日', '月', '年']" :key="i" :class="['date-tab', { active: activeDateTab === tab }]"
            @click="switchDateTab(tab)">
            {{ tab }}
          </view>
        </view>

        <!-- 使用dy-date组件 -->
        <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate"
          class="custom-picker date-picker" />
        <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker" v-model="selectedDate"
          class="custom-picker date-picker" />
        <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate"
          class="custom-picker date-picker" />
      </view>

      <!-- 分割线 -->
      <view class="section-divider"></view>

      <!-- 图表区域 -->
      <view class="chart-section">
        <view class="chart-card">
          <view class="chart-header">
            <text class="chart-title">发电功率曲线</text>
            <view class="chart-controls">
              <view class="chart-tab">今日</view>
            </view>
          </view>
          <view class="chart-body">
            <qiun-data-charts type="area" :chartData="powerCurveData" :opts="powerCurveOptions" :ontouch="true"
              :canvas2d="canvas2d" class="power-chart" />
          </view>
        </view>

        <!-- 分割线 -->
        <view class="card-divider"></view>

        <view class="chart-card">
          <view class="chart-header">
            <text class="chart-title">发电量统计</text>
            <view class="chart-controls">
              <view class="chart-tab">全部</view>
            </view>
          </view>
          <view class="chart-body">
            <qiun-data-charts type="column" :chartData="generationData" :opts="generationOptions" :ontouch="true"
              :canvas2d="canvas2d" class="generation-chart" />
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
  queryDayGeneratedPower,
  queryDayElectricityStatistic,
  queryMonthElectricityStatistic,
  queryYearElectricityStatistic
} from '@/api/power';

export default {
  components: {
    dyDate,
  },
  name: "PV-Management",
  data() {
    return {
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

      powerCurveSeries: [],
      generationSeries: [],
      generationCategories: []
    };
  },

  mounted() {
    this.getPhotovoltaicEnergyInfo();
    this.getDayGeneratedPower();
    this.getElectricityStatistic();
  },

  methods: {
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
      queryDayGeneratedPower({
        esId: 8,
        date: this.selectedDate,
        areaLevelIds: 940
      }).then((res) => {
        if (!res.data) {
          this.powerCurveSeries = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          return;
        }

        const generatedPower = parseFloat(res.data.generatedPower) || 0;
        this.powerCurveSeries = Array.from({ length: 12 }, (_, i) => {
          const hour = i * 2;
          if (hour >= 6 && hour <= 18) {
            const value = generatedPower * Math.sin((hour - 6) * Math.PI / 12);
            return parseFloat(value.toFixed(2));
          }
          return 0;
        });
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
    }
  },

  computed: {
    powerCurveData() {
      return {
        categories: this.powerCurveSeries.length > 0 ? ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'] : [],
        series: [{ data: this.powerCurveSeries.length > 0 ? this.powerCurveSeries : [], name: '发电功率' }]
      }
    },
    powerCurveOptions() {
      return {
        dataLabel: false,
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
        color: ["#6DE188"],
        xAxis: { labelCount: 8, disableGrid: true },
        yAxis: { gridType: "dash", data: [{ position: "left", title: "单位:kWh" }] },
      }
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.container {
  padding: 10rpx;
  background-color: #f5f7fa;
}

.pv-monitor {
  background-color: #f5f7fa;
}

/* 数据卡片 */
.stats-box {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx 10rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
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
  background: #f8f9fa;
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
  margin: 20rpx 0;
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
</style>