<template>
  <view class="device-card" :class="connectionState">
    <view class="device-card-content">
      <!-- 头部：图标 + 信息 + 操作按钮 -->
      <view class="device-header">
        <view class="device-icon-wrap" :class="{ 'is-online': connectionState === 'online' }">
          <view class="device-icon">
            <uni-icons type="gear-filled" size="26" color="#fff"></uni-icons>
          </view>
        </view>

        <view class="device-info">
          <view class="device-name-row">
            <text class="device-name">{{ deviceName }}</text>
            <view class="status-badge" :class="connectionState">
              <view class="status-dot" :class="connectionState"></view>
              <text class="status-text">{{ statusText }}</text>
            </view>
          </view>
          <view class="device-model">
            <text class="model-label">{{ deviceSubtitle }}</text>
          </view>
        </view>

        <view class="header-actions">
          <view class="action-btn" :class="{ disabled: connecting }" @click="!connecting && $emit('refresh')">
            <uni-icons type="refresh" size="16" color="#fff"></uni-icons>
          </view>
          <view class="action-btn" @click="$emit('go-config')">
            <uni-icons type="gear" size="16" color="#fff"></uni-icons>
          </view>
          <view class="action-btn more" @click="$emit('update:showDeviceMeta', !showDeviceMeta)">
            <uni-icons :type="showDeviceMeta ? 'up' : 'more'" size="16" color="#fff"></uni-icons>
          </view>
        </view>
      </view>

      <!-- 展开详情 -->
      <view v-if="showDeviceMeta" class="device-meta">
        <view class="meta-row">
          <view class="meta-icon"><uni-icons type="server" size="12" color="rgba(255,255,255,0.6)"></uni-icons></view>
          <text class="meta-label">{{ config.protocol === 'mqtt' ? 'Broker' : 'IP' }}</text>
          <text class="meta-value">{{ config.protocol === 'mqtt' ? (config.brokerUrl || '--') : (config.ip || '--') }}</text>
        </view>
        <view class="meta-row">
          <view class="meta-icon"><uni-icons type="paperplane" size="12" color="rgba(255,255,255,0.6)"></uni-icons></view>
          <text class="meta-label">{{ config.protocol === 'mqtt' ? 'Topic' : 'Port' }}</text>
          <text class="meta-value">{{ config.protocol === 'mqtt' ? (config.realtimeTopic || '--') : (config.port || '--') }}</text>
        </view>
        <view class="meta-row">
          <view class="meta-icon"><uni-icons type="clock" size="12" color="rgba(255,255,255,0.6)"></uni-icons></view>
          <text class="meta-label">更新</text>
          <text class="meta-value">{{ lastUpdateText }}</text>
        </view>
        <view v-if="isConnected" class="disconnect-row" @click="$emit('disconnect')">
          <text class="disconnect-text">断开连接</text>
          <uni-icons type="right" size="12" color="rgba(255,255,255,0.25)"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 顶部设备卡片组件
 * 事件: refresh, go-config, update:showDeviceMeta, disconnect
 */
export default {
  name: 'DeviceCard',
  props: {
    connectionState: { type: String, default: 'offline' }, // online | offline | connecting
    connecting: { type: Boolean, default: false },
    isConnected: { type: Boolean, default: false },
    config: { type: Object, default: () => ({}) },
    deviceName: { type: String, default: '' },
    deviceSubtitle: { type: String, default: '' },
    statusText: { type: String, default: '' },
    lastUpdateText: { type: String, default: '--' },
    showDeviceMeta: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.device-card {
  flex-shrink: 0;
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  position: relative;
  background: #2f7cf6;
  box-shadow: 0 4rpx 14rpx rgba(20, 32, 52, 0.10);

  &.offline {
    background: #7c8798;
    box-shadow: 0 4rpx 14rpx rgba(20, 32, 52, 0.06);
  }
  &.connecting {
    background: #e09012;
    box-shadow: 0 4rpx 14rpx rgba(20, 32, 52, 0.06);
  }

  .device-card-content { position: relative; padding: 26rpx 30rpx; z-index: 1; }
  .device-header { display: flex; align-items: center; gap: 20rpx; }

  .device-icon-wrap {
    position: relative; width: 76rpx; height: 76rpx; flex-shrink: 0;
    .device-icon {
      width: 76rpx; height: 76rpx; border-radius: 18rpx;
      background: rgba(255, 255, 255, 0.20);
      display: flex; align-items: center; justify-content: center;
    }
  }

  .device-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8rpx; }
  .device-name-row { display: flex; align-items: center; gap: 12rpx; }
  .device-name {
    font-size: 32rpx; color: #fff; font-weight: 600; letter-spacing: 0.6rpx;
  }

  /* 状态徽章统一白底半透明，只用圆点颜色表状态：
     满色徽章（绿/黄）会和蓝色卡面抢色，看起来像两个色块拼在一起 */
  .status-badge {
    display: flex; align-items: center; gap: 8rpx; font-size: 21rpx;
    padding: 5rpx 14rpx; border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.18);
    flex-shrink: 0;
    .status-dot {
      width: 10rpx; height: 10rpx; border-radius: 50%;
      background: rgba(255, 255, 255, 0.65);
    }
    .status-dot.online { background: #4cd964; }
    .status-dot.connecting { background: #ffc960; }
    .status-text { color: #fff; font-weight: 500; letter-spacing: 0.3rpx; }
  }

  .device-model {
    display: flex; align-items: center; gap: 10rpx;
    min-width: 0;
    .model-label {
      flex: 1; min-width: 0;
      font-size: 22rpx; color: rgba(255, 255, 255, 0.82); letter-spacing: 0.3rpx;
      /* 副标题固定单行：参数设置类名称较长，换行会把卡片头部撑高 */
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
  }

  .header-actions { display: flex; align-items: center; gap: 10rpx; flex-shrink: 0; }
  .action-btn {
    width: 56rpx; height: 56rpx; border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.2s ease;
    &:active { background: rgba(255, 255, 255, 0.4); }
    &.more {
      background: transparent;
    }
    &.more:active { background: rgba(255, 255, 255, 0.18); }
    &.disabled { opacity: 0.4; pointer-events: none; }
  }

  .device-meta {
    margin-top: 24rpx; padding: 22rpx 26rpx; border-radius: 14rpx;
    background: rgba(0, 0, 0, 0.15);
    display: flex; flex-direction: column; gap: 16rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.08);
  }
  .meta-row { display: flex; align-items: center; font-size: 24rpx; }
  .meta-icon { width: 36rpx; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .meta-label { color: rgba(255, 255, 255, 0.68); width: 90rpx; flex-shrink: 0; letter-spacing: 0.3rpx; }
  .meta-value {
    color: #fff; flex: 1; text-align: right; word-break: break-all;
    font-size: 22rpx; font-variant-numeric: tabular-nums; letter-spacing: 0.2rpx;
  }
  .disconnect-row {
    margin-top: 4rpx; padding: 18rpx 20rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.15);
    display: flex; align-items: center; justify-content: space-between;
    .disconnect-text { color: #ff7875; font-size: 26rpx; font-weight: 500; }
    &:active .disconnect-text { opacity: 0.6; }
  }
}

</style>
