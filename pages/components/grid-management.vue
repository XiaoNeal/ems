<template>
  <view class="grid-management" :class="{ fullscreen: isFullScreen }">
    
    <view class="content">
      <!-- 电网数据卡片 -->
      <view class="stats-container">
        <view class="stat-row">
          <view class="stat-item vertical">
            <view class="stat-subitem">
              <text class="stat-label">电网实时功率</text>
              <view>
                <text class="stat-value negative">-3.7</text>
                <text class="stat-unit">kW</text>
              </view>
            </view>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item vertical">
            <view class="stat-subitem">
              <text class="stat-label">电网今日馈电量</text>
              <view>
                <text class="stat-value">157.12</text>
                <text class="stat-unit">kWh</text>
              </view>
            </view>
          </view>
        </view>
        <view class="stat-row">
          <view class="stat-item vertical">
            <view class="stat-subitem">
              <text class="stat-label">电网频率</text>
              <view>
                <text class="stat-value">0.0</text>
                <text class="stat-unit">Hz</text>
              </view>
            </view>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item vertical">
            <view class="stat-subitem">
              <text class="stat-label">电网累计馈电量</text>
              <view>
                <text class="stat-value">157.12</text>
                <text class="stat-unit">kWh</text>
              </view>
            </view>
          </view>
        </view>
        <view class="stat-row">
          <view class="stat-item vertical">
            <view class="stat-subitem">
              <text class="stat-label">电网今日供电</text>
              <view>
                <text class="stat-value">157.12</text>
                <text class="stat-unit">kWh</text>
              </view>
            </view>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item vertical">
            <view class="stat-subitem">
              <text class="stat-label">电网累计供电</text>
              <view>
                <text class="stat-value">157.12</text>
                <text class="stat-unit">kWh</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 电网数据区块 -->
      <view class="grid-data-section">
        <!-- 日期选择 -->
        <view class="date-selector">
          <view class="date-tabs">
            <view v-for="(tab, i) in ['日', '月', '年']" :key="i" :class="['date-tab', { active: activeDateTab === tab }]" @click="handleDateTypeChange(tab)">
              {{ tab }}
            </view>
          </view>
          <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
          <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
          <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
        </view>
        
        <view class="divider"></view>
        
        <!-- 电网功率曲线 -->
        <view class="chart-section">
          <view class="chart-header">
            <text class="chart-title">电网功率曲线</text>
            <view class="fullscreen-button" @click="toggleFullScreen('power')">
              <text>全屏</text>
            </view>
          </view>
          <view class="chart-body">
            <qiun-data-charts type="area" :chartData="powerCurveData" :opts="powerCurveOptions" :ontouch="true"
              :canvas2d="canvas2d" class="power-chart" />
          </view>
        </view>

        <view class="divider"></view>

        <!-- 供馈电量统计 -->
        <view class="chart-section">
          <view class="chart-header">
            <text class="chart-title">供馈电量统计</text>
            <view class="fullscreen-button" @click="toggleFullScreen('energy')">
              <text>全屏</text>
            </view>
          </view>
          <view class="chart-body">
            <qiun-data-charts type="column" :chartData="energyData" :opts="energyOptions" :ontouch="true"
              :canvas2d="canvas2d" class="energy-chart" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import dyDate from '@/components/dy-Date/dy-Date.vue';
import { queryDayGeneratedPower } from '@/api/power';
export default {
  components: {
    dyDate,
  },
  name: "GridManagement",
  data() {
    return {
      gridStatus: "正常",
      gridVoltage: "220",
      gridFrequency: "0.0",
      gridPower: "-3.7",
      todayFeedEnergy: "157.12",
      totalFeedEnergy: "157.12",
      todaySupplyEnergy: "157.12",
      totalSupplyEnergy: "157.12",
      isFullScreen: false,
      activeDateTab: '年',
      timeTypeIndex: 2,
      selectedDate: new Date().toISOString().split('T')[0],
      canvas2d: this.$Config?.ISCANVAS2D ?? false,
      // 电网功率曲线数据
      powerCurveSeries: [],
      powerCurveCategories: [],
      powerCurveOptions: {
        padding: [15, 15, 0, 5],
        enableScroll: false,
        legend: {
          show: true,
          position: 'top',
          float: 'right'
        },
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          gridType: 'dash',
          dashLength: 2
        },
        extra: {
          area: {
            type: 'straight',
            opacity: 0.2,
            addLine: true,
            width: 2
          }
        }
      },
      // 供馈电量统计数据
      energyData: {
        categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
        series: [
          {
            name: '供电量',
            data: [0, 0, 0, 0, 0, 0],
            color: '#52C41A'
          },
          {
            name: '馈电量',
            data: [0, 0, 0, 0, 0, 0],
            color: '#FAAD14'
          }
        ]
      },
      energyOptions: {
        padding: [15, 15, 0, 5],
        enableScroll: false,
        legend: {
          show: true,
          position: 'top',
          float: 'right'
        },
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          gridType: 'dash',
          dashLength: 2
        },
        extra: {
          column: {
            type: 'group',
            width: 20,
            activeBgColor: '#000000',
            activeBgOpacity: 0.08
          }
        }
      }
    };
  },
  computed: {
    powerCurveData() {
      return {
        categories: this.powerCurveCategories.length > 0 ? this.powerCurveCategories : [],
        series: [{
          name: '电网功率',
          data: this.powerCurveSeries.length > 0 ? this.powerCurveSeries : [],
          color: '#1890FF'
        }]
      }
    }
  },
  methods: {
    // 获取电网功率曲线数据
    async getPowerCurveData() {
      try {
        const esId = this.$store.state.powerStationsId || 8;
        const areaLevelIds = this.$store.state.areaInfoId || 940;
        const params = {
          esId: esId,
          date: this.selectedDate,
          areaLevelIds: areaLevelIds
        };
        const res = await queryDayGeneratedPower(params);
        if (res && res.data) {
          // 处理接口返回数据
          const data = res.data;
          if (data.list && data.list.length > 0) {
            this.powerCurveCategories = data.list.map(item => {
              const time = item.time || item.datetime || '';
              return time.substring(11, 16) || time; // 提取时间部分
            });
            this.powerCurveSeries = data.list.map(item => {
              return Number(item.value || item.power || 0);
            });
          } else {
            this.powerCurveCategories = [];
            this.powerCurveSeries = [];
          }
        }
      } catch (error) {
        console.error('获取电网功率曲线数据失败:', error);
        this.powerCurveCategories = [];
        this.powerCurveSeries = [];
      }
    },
    refresh() {
      // 刷新数据
      console.log('刷新电网管理数据');
      this.getPowerCurveData();
    },
    toggleFullScreen(type) {
      this.isFullScreen = !this.isFullScreen;

      // ================== App 横屏 + 状态栏处理 ==================
      // #ifdef APP-PLUS
      if (this.isFullScreen) {
        // 强制横屏
        plus.screen.lockOrientation('landscape-primary');
        // 隐藏状态栏（彻底解决刘海遮挡）
        plus.navigator.setFullscreen(true);
        uni.showToast({ title: type === 'power' ? '电网功率曲线全屏' : '供馈电量统计全屏', icon: 'none' });
      } else {
        // 恢复竖屏 + 显示状态栏
        plus.screen.lockOrientation('portrait-primary');
        plus.navigator.setFullscreen(false);
        uni.showToast({ title: '退出全屏', icon: 'none' });
      }
      // #endif

      // ================== H5/小程序 全屏处理（模拟） ==================
      // #ifndef APP-PLUS
      uni.showToast({
        title: this.isFullScreen ? (type === 'power' ? '电网功率曲线全屏' : '供馈电量统计全屏') : '退出全屏',
        icon: 'none',
        duration: 1500
      });
      // #endif
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
      console.log('日期类型切换为:', type);
    },
    handleDatePicker(date) {
      console.log('选择的日期:', date);
      this.selectedDate = date;
      this.getPowerCurveData();
    }
  },
  mounted() {
    this.getPowerCurveData();
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
  min-height: 100vh;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

/* 全屏模式 */
.grid-management.fullscreen {
  position: fixed;
  top: 93px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  margin: 0;
  padding: 20rpx;
  height: calc(100vh - 93px);
  overflow: auto;
  background: #EFF4FB;
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
  font-size: 16px;
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
  margin-bottom: 20rpx;
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
</style>