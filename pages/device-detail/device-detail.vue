<template>
  <view class="container">
    <!-- 头部导航 -->
    <!-- <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">设备详情</text>
      <view class="header-right"></view>
    </view> -->

    <u-navbar title="设备详情" :autoBack="true" :placeholder="true">
    </u-navbar>

    <!-- 设备基本信息 -->
    <view class="device-info-card">
      <view class="info-item">
        <text class="info-label">设备名称</text>
        <text class="info-value">{{ deviceInfo.deviceName }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">设备状态</text>
        <text class="info-value">{{ deviceInfo.deviceStatusName }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">设备ID</text>
        <text class="info-value">{{ deviceInfo.devId }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">项目地址</text>
        <text class="info-value">{{ deviceInfo.projectAddress }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">网关号</text>
        <text class="info-value">{{ deviceInfo.gateway || 'F2 00 12 01 00 00 00 00 00 00 00 00 00 00 00' }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">功率</text>
        <text class="info-value">{{ deviceInfo.power || 0.04 }}kW</text>
      </view>
      <view class="info-item">
        <text class="info-label">柔度</text>
        <text class="info-value">{{ (deviceInfo.deviceFlexibility * 100 || 1.0).toFixed(1) }}%</text>
      </view>
      <view class="info-item">
        <text class="info-label">负载</text>
        <text class="info-value">{{ (deviceInfo.deviceLoadRatio * 100 || 4.0).toFixed(1) }}%</text>
      </view>
      <view class="info-item">
        <text class="info-label">能效水平</text>
        <view class="energy-levels">
          <view 
            v-for="level in 3" 
            :key="level" 
            :class="['level-btn', { 'active': deviceInfo.deviceEnergyEfficiencyLevel === level }]"
          >
            {{ level }}级
          </view>
        </view>
      </view>
    </view>

    <!-- 电量统计 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">电量统计</text>
        <view class="chart-action">
          <text class="action-text">全屏</text>
          <text class="action-icon">↗</text>
        </view>
      </view>
      <view class="chart-container">
        <!-- 这里可以放置电量统计图表 -->
        <view class="chart-placeholder">
          <view v-for="(item, index) in 24" :key="index" class="bar-chart">
            <view class="bar" :style="{ height: `${Math.random() * 100}%` }"></view>
            <text class="bar-label">{{ index.toString().padStart(2, '0') }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 充放电功率 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">充放电功率</text>
        <view class="chart-action">
          <text class="action-text">2025.06.18</text>
          <text class="action-icon">▼</text>
        </view>
      </view>
      <view class="chart-container">
        <!-- 这里可以放置充放电功率图表 -->
        <view class="line-chart-placeholder">
          <view class="line-chart"></view>
          <view v-for="(item, index) in 24" :key="index" class="line-label">
            {{ index.toString().padStart(2, '0') }}
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <view class="bottom-nav">
      <view class="nav-item">
        <text class="nav-icon">🏠</text>
        <text class="nav-text">主页</text>
      </view>
      <view class="nav-item">
        <text class="nav-icon">⚙️</text>
        <text class="nav-text">系统管理</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'device-detail',
  data() {
    return {
      deviceInfo: {
        deviceName: '1#直流多联机',
        deviceStatusName: '在线',
        devId: '51978',
        projectAddress: '32',
        gateway: 'F2 00 12 01 00 00 00 00 00 00 00 00 00 00 00',
        power: 0.04,
        deviceFlexibility: 0.01,
        deviceLoadRatio: 0.04,
        deviceEnergyEfficiencyLevel: 1
      }
    };
  },
  onLoad(options) {
    // 从路由参数中获取设备信息
    if (options.deviceInfo) {
      this.deviceInfo = JSON.parse(options.deviceInfo);
    }
  },
  methods: {
    goBack() {
      // 返回上一页
      uni.navigateBack();
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* 头部导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: #fff;
  padding: 0 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 24px;
  color: #333;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-right {
  width: 40px;
}

/* 设备信息卡片 */
.device-info-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 能效水平 */
.energy-levels {
  display: flex;
  gap: 8px;
}

.level-btn {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  background-color: #f0f0f0;
  color: #666;
}

.level-btn.active {
  background-color: #1890FF;
  color: #fff;
}

.level-btn:nth-child(2).active {
  background-color: #FFC53D;
}

.level-btn:nth-child(3).active {
  background-color: #87D068;
}

/* 图表卡片 */
.chart-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.chart-action {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-text {
  font-size: 12px;
  color: #666;
}

.action-icon {
  font-size: 12px;
  color: #666;
}

/* 图表容器 */
.chart-container {
  height: 200px;
  position: relative;
}

/* 柱状图占位符 */
.chart-placeholder {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 160px;
  padding: 0 10px;
}

.bar-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.bar {
  width: 12px;
  background-color: #FFC53D;
  border-radius: 2px 2px 0 0;
  transition: height 0.3s ease;
}

.bar-label {
  font-size: 10px;
  color: #999;
}

/* 折线图占位符 */
.line-chart-placeholder {
  height: 160px;
  position: relative;
  padding: 0 10px;
}

.line-chart {
  position: absolute;
  top: 0;
  left: 10px;
  right: 10px;
  bottom: 20px;
  background: linear-gradient(to top, rgba(255, 197, 61, 0.2), rgba(255, 197, 61, 0));
  clip-path: polygon(0% 100%, 4% 80%, 8% 85%, 12% 70%, 16% 65%, 20% 75%, 24% 60%, 28% 55%, 32% 65%, 36% 60%, 40% 70%, 44% 65%, 48% 55%, 52% 50%, 56% 45%, 60% 50%, 64% 40%, 68% 35%, 72% 40%, 76% 30%, 80% 35%, 84% 45%, 88% 50%, 92% 40%, 96% 45%, 100% 50%, 100% 100%);
}

.line-label {
  position: absolute;
  bottom: 0;
  font-size: 10px;
  color: #999;
}

/* 底部导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.nav-icon {
  font-size: 20px;
}

.nav-text {
  font-size: 12px;
  color: #666;
}
</style>