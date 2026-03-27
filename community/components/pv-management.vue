<template>
  <view class="pv-monitor container">
    <!-- 数据卡片区域 -->
    <view class="stats-box">
      <view class="stat-row">
        <view class="stat-item">
          <text class="stat-label">当日发电量</text>
          <text class="stat-value">{{ dailyGeneration }}<text class="stat-unit">kWh</text></text>
        </view>
        <view class="stat-item">
          <text class="stat-label">累计发电量</text>
          <text class="stat-value">{{ totalGeneration }}<text class="stat-unit">kWh</text></text>
        </view>
      </view>
      <view class="stat-row">
        <view class="stat-item">
          <text class="stat-label">当日发电收益</text>
          <text class="stat-value">{{ incomeValue }}<text class="stat-unit">元</text></text>
        </view>
        <view class="stat-item">
          <text class="stat-label">累计发电时长</text>
          <text class="stat-value">{{ runningDays }}<text class="stat-unit">天</text></text>
        </view>
      </view>
      <view class="stat-row">
        <view class="stat-item">
          <text class="stat-label">日最高发电量</text>
          <text class="stat-value">{{ maxGeneration }}<text class="stat-unit">kWh</text></text>
        </view>
        <view class="stat-item">
          <text class="stat-label">历史最高发电功率</text>
          <text class="stat-value">{{ historyGenerationPower }}<text class="stat-unit">kW</text></text>
        </view>
      </view>
      <view class="stat-row">
        <view class="stat-item">
          <text class="stat-label">出现在</text>
          <text class="stat-value">{{ maxGenerationTime }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">出现在</text>
          <text class="stat-value">{{ historyGenerationPowerTime }}</text>
        </view>
      </view>
    </view>

    <!-- 日期选择器：使用dy-date组件 -->
    <view class="date-selector">
      <view class="date-tabs">
        <view
          v-for="(tab, i) in ['日', '月', '年']"
          :key="i"
          :class="['date-tab', { active: activeDateTab === tab }]"
          @click="switchDateTab(tab)"
        >
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
          <qiun-data-charts type="area" :chartData="powerCurveData" :opts="powerCurveOptions" 
            :ontouch="true" :canvas2d="canvas2d" class="power-chart" />
        </view>
      </view>

      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">发电量统计</text>
          <view class="chart-controls">
            <view class="chart-tab">全部</view>
          </view>
        </view>
        <view class="chart-body">
          <qiun-data-charts type="column" :chartData="generationData" :opts="generationOptions" 
            :ontouch="true" :canvas2d="canvas2d" class="generation-chart" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import dyDate from '@/components/dy-Date/dy-Date.vue'; // 导入日期选择器组件
export default {
  components: {
    dyDate, // 注册日期选择器组件
  },
  name: "PV-Management",
  data() {
    return {
      canvas2d: this.$Config?.ISCANVAS2D ?? false,
      // 假数据
      dailyGeneration: "157",
      totalGeneration: "157",
      incomeValue: "19",
      runningDays: "254",
      maxGeneration: "157",
      historyGenerationPower: "157",
      maxGenerationTime: "2025-07-21 12:00",
      historyGenerationPowerTime: "2025-07-21 12:00",

      // 日期选择核心
      activeDateTab: "日",
      timeTypeIndex: 0,
      selectedDate: new Date().toISOString().split('T')[0],
    };
  },

  methods: {
    // 切换日/月/年标签
    switchDateTab(tab) {
      this.activeDateTab = tab;
      if (tab === '日') {
        this.timeTypeIndex = 0;
      } else if (tab === '月') {
        this.timeTypeIndex = 1;
      } else if (tab === '年') {
        this.timeTypeIndex = 2;
      }
    },

    // 处理日期选择
    handleDatePicker(value) {
      this.selectedDate = value;
      console.log("选中日期：", value, " 类型：", this.activeDateTab);
      // 这里调用接口刷新图表数据
    }
  },

  computed: {
    powerCurveData() {
      return {
        categories: ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],
        series: [{ data: [0,0,0,20,60,100,157,140,110,50,10,0], name: '发电功率' }]
      }
    },
    powerCurveOptions() {
      return {
        color: ["#6DE188"],
        xAxis: { labelCount:6, disableGrid:true },
        yAxis: { gridType:"dash", data:[{position:"left",title:"单位:kW"}] },
        extra: { area:{type:"curve",gradient:true} }
      }
    },
    generationData() {
      return {
        categories: Array.from({length:24},(_,i)=>i+1),
        series: [{ data: [0,0,0,0,5,15,30,45,60,75,90,105,120,135,150,157,145,125,100,70,40,20,5,0], name:'发电量' }]
      }
    },
    generationOptions() {
      return {
        color:["#6DE188"],
        xAxis:{labelCount:8,disableGrid:true},
        yAxis:{gridType:"dash",data:[{position:"left",title:"单位:kWh"}]},
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
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}
.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.stat-row:last-child { margin-bottom: 0; }
.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  margin: 0 8rpx;
}
.stat-item:first-child { margin-left: 0; }
.stat-item:last-child { margin-right: 0; }
.stat-label { font-size: 14px; color: #666; margin-bottom: 8rpx; }
.stat-value { font-size: 18px; font-weight: bold; color: #4488FB; }
.stat-unit { font-size: 12px; color: #666; margin-left: 4rpx; }

/* 日期选择器：修复样式 */
.date-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 100; /* 保证层级 */
}
.date-tabs {
  display: flex;
  gap: 10rpx;
}
.date-tab {
  padding: 6rpx 16rpx;
  border: 1rpx solid #e8e8e8;
  border-radius: 20rpx;
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

/* 日期显示文字：可点击、样式美观 */
.date-display {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  padding: 8rpx 10rpx;
  border-radius: 8rpx;
  background: #f8f9fa;
}
.date-display:active {
  background: #e8e8e8;
}

/* 图表区域 */
.chart-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.chart-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.chart-header {
  padding: 16rpx 20rpx;
  border-bottom: 1rpx solid #f0f4ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chart-title { font-size: 16px; font-weight: 600; color: #333; }
.chart-controls { display: flex; gap: 12rpx; }
.chart-tab {
  padding: 6rpx 16rpx;
  border: 1rpx solid #4488FB;
  border-radius: 16rpx;
  font-size: 12px;
  color: #4488FB;
  background: #f0f4ff;
}
.chart-body { padding: 20rpx; }
.power-chart,
.generation-chart {
  width: 100%;
  height: 400rpx;
}
</style>