<template>
  <view class="grid-management" :class="{ fullscreen: isFullScreen }">
    <view class="header">
      <text class="title">电网管理</text>
    </view>
    
    <view class="content">
      <!-- 电网数据卡片 -->
      <view class="data-cards">
        <view class="card-row">
          <view class="card-item">
            <text class="item-label">电网实时功率</text>
            <text class="item-value negative">-3.7 kW</text>
          </view>
          <view class="card-item">
            <text class="item-label">电网今日馈电量</text>
            <text class="item-value">157.12 kWh</text>
          </view>
        </view>
        <view class="card-row">
          <view class="card-item">
            <text class="item-label">电网频率</text>
            <text class="item-value">0.0 Hz</text>
          </view>
          <view class="card-item">
            <text class="item-label">电网累计馈电量</text>
            <text class="item-value">157.12 kWh</text>
          </view>
        </view>
        <view class="card-row">
          <view class="card-item">
            <text class="item-label">电网今日供电</text>
            <text class="item-value">157.12 kWh</text>
          </view>
          <view class="card-item">
            <text class="item-label">电网累计供电</text>
            <text class="item-value">157.12 kWh</text>
          </view>
        </view>
      </view>
      
      <!-- 日期选择 -->
      <view class="date-selector">
        <view class="date-tabs">
          <view class="date-tab">日</view>
          <view class="date-tab">月</view>
          <view class="date-tab active">年</view>
        </view>
        <view class="year-selector">
          <text>2025年</text>
        </view>
      </view>
      
      <!-- 电网功率曲线 -->
      <view class="chart-section">
        <view class="chart-header">
          <text class="chart-title">电网功率曲线</text>
          <view class="fullscreen-button" @click="toggleFullScreen('power')">
            <text>全屏</text>
          </view>
        </view>
        <view class="chart-placeholder power-chart">
          <text>电网功率曲线图表</text>
        </view>
      </view>
      
      <!-- 供馈电量统计 -->
      <view class="chart-section">
        <view class="chart-header">
          <text class="chart-title">供馈电量统计</text>
          <view class="fullscreen-button" @click="toggleFullScreen('energy')">
            <text>全屏</text>
          </view>
        </view>
        <view class="chart-placeholder energy-chart">
          <text>供馈电量统计图表</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
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
      isFullScreen: false
    };
  },
  methods: {
    refresh() {
      // 刷新数据
      console.log('刷新电网管理数据');
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
    }
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

.data-cards {
  margin-bottom: 20rpx;
  .card-row {
    display: flex;
    gap: 20rpx;
    margin-bottom: 20rpx;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .card-item {
    flex: 1;
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    .item-label {
      display: block;
      font-size: 24rpx;
      color: #666;
      margin-bottom: 12rpx;
    }
    .item-value {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      &.negative {
        color: #EB3341;
      }
    }
  }
}

.date-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  margin-bottom: 20rpx;
  .date-tabs {
    display: flex;
    gap: 12rpx;
  }
  .date-tab {
    padding: 8rpx 24rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    color: #666;
    background: #f5f5f5;
    &.active {
      background: #4488FB;
      color: #fff;
    }
  }
  .year-selector {
    font-size: 24rpx;
    color: #666;
  }
}

.chart-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
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
    border-radius: 8rpx;
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