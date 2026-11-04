<template>
  <scroll-view class="module-scroll" scroll-y="true">
    <view class="content">
      <view class="system-img">
        <!-- 系统启停按钮 -->
        <view class="start-button">
          <view class="start-circle" @click="$emit('start-stop')">
            <image src="/static/images/start.svg" class="start-bg" />
            <text class="start-text">{{ systemRunning ? '运行中' : '启动' }}</text>
          </view>
        </view>

        <image src="/static/images/system-architecture-new.png"
          style="width:100%; height:96%; position: absolute; top:0; left:0; z-index: 1; padding: 20rpx;"></image>
        <!-- 光伏 -->
        <view class="device-label-top-left">
          <text class="device-name">光伏</text>
          <view class="power-row">
            <text class="device-power">{{ formattedValues['archPvPower'] || '--' }}</text>
            <text class="power-unit">kW</text>
          </view>
        </view>
        <!-- 电网 -->
        <view class="device-label-top-right">
          <text class="device-name">电网</text>
          <view class="power-row">
            <text class="device-power">{{ formattedValues['archGridPower'] || '--' }}</text>
            <text class="power-unit">kW</text>
          </view>
        </view>
        <!-- 负荷 -->
        <view class="device-label" style="left: 36%; top: 31%;">
          <view class="power-row">
            <text class="device-power">{{ formattedValues['archLoadMidPower'] || '--' }}</text>
            <text class="power-unit">kW</text>
          </view>
        </view>
        <!-- 储能 -->
        <view class="device-label" style="left: 18%; top: 78%;">
          <text class="device-name">储能</text>
          <view class="power-row">
            <text class="device-power">
              <text>{{ formattedValues['archStorageStatus'] || '--' }}</text>
              <text> {{ formattedValues['archStoragePower'] || '--' }}</text>
            </text>
            <text class="power-unit">kW</text>
          </view>
          <text class="device-soc">{{ formattedValues['archSoc'] || '--' }}%</text>
        </view>
        <!-- 交流负荷 -->
        <view class="device-label" style="left: 1%; top: 71%;">
          <text class="device-name">交流负荷</text>
          <view class="power-row">
            <text class="device-power">{{ formattedValues['archLoadPower'] || '--' }}</text>
            <text class="power-unit">kW</text>
          </view>
        </view>
      </view>

      <!-- 关键指标卡片：2×2，独立圆角卡 + 左侧色条区分口径 -->
      <view class="card-section">
        <view class="metric-card metric-card--left metric-blue">
          <text class="metric-title">今日发电</text>
          <view class="metric-value-row">
            <text class="metric-value">{{ formattedValues['archGenToday'] || '--' }}</text>
            <text class="metric-unit">kWh</text>
          </view>
        </view>
        <view class="metric-card metric-green">
          <text class="metric-title">今日用电</text>
          <view class="metric-value-row">
            <text class="metric-value">{{ formattedValues['archUseToday'] || '--' }}</text>
            <text class="metric-unit">kWh</text>
          </view>
        </view>
        <view class="metric-card metric-card--left metric-cyan">
          <text class="metric-title">储能剩余</text>
          <view class="metric-value-row">
            <text class="metric-value">{{ formattedValues['archStorageRemaining'] || '--' }}</text>
            <text class="metric-unit">%</text>
          </view>
        </view>
        <view class="metric-card metric-violet">
          <text class="metric-title">电网供电</text>
          <view class="metric-value-row">
            <text class="metric-value">{{ formattedValues['archGridSupply'] || '--' }}</text>
            <text class="metric-unit">kWh</text>
          </view>
        </view>
      </view>

      <!-- 储能SOC/状态模块 -->
      <view class="arch-status-container">
        <view class="arch-status-content">
          <view class="arch-status-indicator">
            <image class="arch-battery-icon" src="/static/images/img-storage.png" />
            <view class="arch-soc-container">
              <view class="arch-soc-progress">
                <image src="/static/images/storage.svg" class="arch-soc-icon" />
                <view class="arch-progress-track">
                  <view class="arch-progress-fill" :style="{
                    width: (formattedValues['archSocNumeric'] || 0) + '%',
                    background: formattedValues['archStorageStatusGradient'] || '#8c8c8c'
                  }">
                    <text class="arch-progress-text">{{ formattedValues['archSoc'] || '--' }}%</text>
                  </view>
                </view>
                <text class="arch-status-text" :style="{ color: formattedValues['archStorageStatusGradient'] || '#8c8c8c' }">
                  {{ formattedValues['archStorageStatusExtended'] || '--' }}
                </text>
              </view>
              <view class="arch-soc-remaining">
                <text>剩余电量预计可用</text>
                <text class="arch-soc-hours">{{ formattedValues['archStorageRemainingHours'] || '--' }} 小时</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 电网统计模块 -->
      <StatSection
        title="电网数据"
        :rows="[
          { cols: [
            { subs: [
              { label: '电网实时功率', value: formattedValues['archGridPower'], unit: 'kW' },
              { label: '电网频率', value: formattedValues['archGridFrequency'], unit: 'Hz' }
            ]},
            { subs: [
              { label: '电网今日馈电量', value: formattedValues['archTodayFeedEnergy'], unit: 'kWh' },
              { label: '电网累计馈电量', value: formattedValues['archTotalFeedEnergy'], unit: 'kWh' }
            ]},
            { subs: [
              { label: '电网今日供电', value: formattedValues['archTodaySupplyEnergy'], unit: 'kWh' },
              { label: '电网累计供电', value: formattedValues['archTotalSupplyEnergy'], unit: 'kWh' }
            ]}
          ]}
        ]"
      />

      <!-- 光伏统计模块 -->
      <StatSection
        title="光伏数据"
        :rows="[
          { cols: [
            { center: true, subs: [
              { label: '当日发电量', value: formattedValues['archPvTodayGen'], unit: 'kWh' }
            ]},
            { subs: [
              { label: '累计发电量', value: formattedValues['archPvTotalGen'], unit: 'kWh' },
              { label: '累计发电时长', value: formattedValues['archPvTotalGenDays'], unit: '天' }
            ]}
          ]},
          { divider: true },
          { cols: [
            { subs: [
              { label: '日最高发电量', value: formattedValues['archPvDayMaxGen'], unit: 'kWh' },
              { label: '出现在', value: formattedValues['archPvDayMaxGenTime'], small: true }
            ]},
            { subs: [
              { label: '历史最高发电功率', value: formattedValues['archPvHistMaxPower'], unit: 'kW' }
            ]}
          ]}
        ]"
      />

      <!-- 负荷设备模块 -->
      <view class="arch-device-stats">
        <view class="arch-section-title">
          <text class="arch-title-text">设备信息</text>
        </view>
        <view class="arch-device-grid">
          <view class="arch-device-item">
            <text class="arch-device-number">{{ formattedValues['archDeviceCounts'] ? formattedValues['archDeviceCounts'].dljQuantity : 0 }}</text>
            <text class="arch-device-text">空调</text>
          </view>
          <view class="arch-device-item">
            <text class="arch-device-number">{{ formattedValues['archDeviceCounts'] ? formattedValues['archDeviceCounts'].cdzQuantity : 0 }}</text>
            <text class="arch-device-text">充电桩</text>
          </view>
          <view class="arch-device-item">
            <text class="arch-device-number">{{ formattedValues['archDeviceCounts'] ? formattedValues['archDeviceCounts'].lightQuantity : 0 }}</text>
            <text class="arch-device-text">照明</text>
          </view>
          <view class="arch-device-item">
            <text class="arch-device-number">{{ formattedValues['archDeviceCounts'] ? formattedValues['archDeviceCounts'].unknownDeviceQuantity : 0 }}</text>
            <text class="arch-device-text">未知设备</text>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import StatSection from '../StatSection.vue'

/**
 * 概览 tab 组件
 * 展示系统架构图、关键数据卡片、储能SOC、电网/光伏统计、设备信息
 * 所有数据通过 formattedValues 传入，无专属计算属性
 */
export default {
  name: 'OverviewTab',
  components: { StatSection },
  props: {
    formattedValues: {
      type: Object,
      default: () => ({})
    },
    /** 系统是否在运行（来自 171F 策略状态） */
    systemRunning: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.module-scroll {
  height: 100%;
}
.content {
  padding: 0 20rpx 32rpx;
}

/* 系统架构图 */
.system-img {
  position: relative;
  flex-shrink: 0;
  height: 500rpx;
  margin: 20rpx 0 16rpx;
  border-radius: 18rpx;
  border: 1rpx solid #eef1f5;
  overflow: hidden;
  background: #fff;
}

/* 启动/停止按钮 */
.start-button {
  position: absolute;
  top: 8%;
  left: 77%;
  z-index: 5;
}
.start-circle {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 4rpx 12rpx rgba(68, 136, 251, 0.25);
  position: relative;
}
.start-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}
.start-text {
  font-size: 26rpx;
  font-weight: bold;
  position: relative;
  z-index: 2;
  color: #4488FB;
}

.device-label,
.device-label-top-left,
.device-label-top-right {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
 // background: rgba(255, 255, 255, 0.88);
 // box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.device-label-top-left {
  top: 7%;
  left: 34%;
}

.device-label-top-right {
  top: 19%;
  left: 1%;
}

.device-name {
  font-size: 22rpx;
  color: #555;
  margin-bottom: 2rpx;
  font-weight: 500;
}

.device-power {
  font-size: 26rpx;
  color: #4488fb;
  font-weight: bold;
}

.device-soc {
  font-size: 22rpx;
  color: #52c41a;
  margin-top: 2rpx;
  font-weight: bold;
}

.power-row {
  display: flex;
  align-items: baseline;
}

.power-unit {
  font-size: 18rpx;
  color: #999;
  margin-left: 2rpx;
}

/* 关键指标卡片 */
.card-section {
  display: flex;
  flex-wrap: wrap;
  margin: 16rpx 0 4rpx;
}

.metric-card {
  position: relative;
  width: calc(50% - 8rpx);
  box-sizing: border-box;
  padding: 22rpx 20rpx 20rpx 24rpx;
  margin-bottom: 16rpx;
  background: #ffffff;
  border: 1rpx solid #eef1f5;
  border-radius: 18rpx;
  overflow: hidden;

  /* 左列由模板加类控制间距，不依赖 nth-child */
  &--left {
    margin-right: 16rpx;
  }

  /* 左侧细色条：用颜色区分发电 / 用电 / 储能 / 电网四种口径 */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 24rpx;
    bottom: 24rpx;
    width: 5rpx;
    border-radius: 0 3rpx 3rpx 0;
    background: #2f7cf6;
  }
}

.metric-blue::before { background: #2f7cf6; }
.metric-green::before { background: #1f9254; }
.metric-cyan::before { background: #0f9b8e; }
.metric-violet::before { background: #7c5cf5; }

.metric-title {
  display: block;
  font-size: 22rpx;
  color: #98a2ae;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  margin-top: 10rpx;
  min-width: 0;
}

.metric-value {
  max-width: 100%;
  font-size: 40rpx;
  font-weight: 700;
  color: #1d2430;
  font-family: 'Menlo', 'Consolas', monospace;
  letter-spacing: -1rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-unit {
  flex-shrink: 0;
  margin-left: 6rpx;
  font-size: 20rpx;
  color: #98a2ae;
}

/* 储能SOC进度条模块 */
.arch-status-container {
  background: #ffffff;
  border: 1rpx solid #eef1f5;
  border-radius: 18rpx;
  padding: 22rpx 24rpx;
  margin-bottom: 16rpx;
}

.arch-status-content {
  width: 100%;
}

.arch-status-indicator {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.arch-battery-icon {
  width: 80rpx;
  height: 80rpx;
  flex-shrink: 0;
}

.arch-soc-container {
  flex: 1;
  min-width: 0;
}

.arch-soc-progress {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.arch-soc-icon {
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
}

.arch-progress-track {
  flex: 1;
  height: 32rpx;
  background-color: #f0f2f5;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
}

.arch-progress-fill {
  height: 100%;
  border-radius: 16rpx;
  min-width: 0;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16rpx;
  box-sizing: border-box;
}

.arch-progress-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
  white-space: nowrap;
}

.arch-status-text {
  font-size: 24rpx;
  flex-shrink: 0;
  font-weight: 500;
}

.arch-soc-remaining {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  color: #555;
}

.arch-soc-hours {
  font-weight: bold;
  color: #333;
}

/* 公共区块标题 */
.arch-section-title {
  margin-bottom: 16rpx;
  padding-bottom: 0;
  padding-left: 20rpx;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6rpx;
    height: 30rpx;
    border-radius: 3rpx;
    background: linear-gradient(180deg, #6699ff 0%, #4488fb 100%);
  }
}

.arch-title-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #1d2430;
  letter-spacing: 0.5rpx;
}

/* 负荷设备模块 */
.arch-device-stats {
  background: #ffffff;
  border: 1rpx solid #eef1f5;
  border-radius: 18rpx;
  padding: 26rpx 26rpx;
  margin-bottom: 16rpx;
}
.arch-device-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.arch-device-item {
  width: calc((100% - 36rpx) / 4);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1rpx solid #eef1f5;
  border-radius: 14rpx;
  padding: 18rpx 6rpx;
  gap: 6rpx;
}

.arch-device-number {
  font-size: 34rpx;
  font-weight: 700;
  color: #2f7cf6;
  font-family: 'Menlo', 'Consolas', monospace;
}

.arch-device-text {
  font-size: 22rpx;
  color: #7a828c;
}
</style>
