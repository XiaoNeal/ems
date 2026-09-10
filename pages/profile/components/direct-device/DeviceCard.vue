<template>
  <view class="device-card" :class="connectionState">
    <!-- 装饰光斑背景 -->
    <view class="device-card-bg">
      <view class="bg-orb bg-orb-1"></view>
      <view class="bg-orb bg-orb-2"></view>
      <view class="bg-orb bg-orb-3"></view>
    </view>

    <view class="device-card-content">
      <!-- 头部：图标 + 信息 + 操作按钮 -->
      <view class="device-header">
        <view class="device-icon-wrap">
          <view class="device-icon">
            <uni-icons type="gear-filled" size="26" color="#fff"></uni-icons>
          </view>
          <view v-if="connectionState === 'online'" class="icon-pulse"></view>
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
            <view class="model-chip">{{ config.protocol === 'mqtt' ? 'MQTT直连' : 'TCP' }}</view>
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
  border-radius: 28rpx;
  overflow: hidden;
  position: relative;
  box-shadow: 0 12rpx 40rpx rgba(0, 122, 255, 0.25);

  .device-card-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #007AFF 0%, #00C6FF 60%, #5AC8FA 100%);
    .bg-orb {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      filter: blur(2rpx);
    }
    .bg-orb-1 { width: 260rpx; height: 260rpx; top: -80rpx; right: -60rpx; background: rgba(255,255,255,0.18); }
    .bg-orb-2 { width: 140rpx; height: 140rpx; bottom: -30rpx; right: 80rpx; background: rgba(255,255,255,0.1); }
    .bg-orb-3 { width: 80rpx;  height: 80rpx;  top: 50rpx;  right: 200rpx; background: rgba(255,255,255,0.12); }
  }

  &.offline {
    box-shadow: 0 12rpx 40rpx rgba(138, 148, 166, 0.25);
    .device-card-bg { background: linear-gradient(135deg, #6b7280 0%, #9ca3af 60%, #d1d5db 100%); }
  }
  &.connecting {
    box-shadow: 0 12rpx 40rpx rgba(240, 160, 32, 0.3);
    .device-card-bg { background: linear-gradient(135deg, #d97706 0%, #f0a020 50%, #fbbf24 100%); }
  }

  .device-card-content { position: relative; padding: 28rpx 32rpx; z-index: 1; }
  .device-header { display: flex; align-items: center; gap: 20rpx; }

  .device-icon-wrap {
    position: relative; width: 72rpx; height: 72rpx; flex-shrink: 0;
    .device-icon {
      width: 72rpx; height: 72rpx; border-radius: 20rpx;
      background: rgba(255, 255, 255, 0.25); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
    }
    .icon-pulse {
      position: absolute; inset: -8rpx; border-radius: 24rpx;
      border: 4rpx solid rgba(76, 217, 100, 0.6); animation: iconPulse 2s ease-out infinite;
    }
  }

  .device-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6rpx; }
  .device-name-row { display: flex; align-items: center; gap: 12rpx; }
  .device-name {
    font-size: 32rpx; color: #fff; font-weight: 700; letter-spacing: 0.5rpx;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }

  .status-badge {
    display: flex; align-items: center; gap: 6rpx; font-size: 22rpx;
    padding: 4rpx 14rpx; border-radius: 20rpx;
    background: rgba(255, 255, 255, 0.22); backdrop-filter: blur(4px); flex-shrink: 0;
    .status-dot {
      width: 10rpx; height: 10rpx; border-radius: 50%; background: rgba(255, 255, 255, 0.6);
    }
    .status-dot.online {
      background: #4cd964; box-shadow: 0 0 8rpx rgba(76, 217, 100, 0.8);
      animation: dotPulse 1.5s ease-in-out infinite;
    }
    .status-dot.connecting { background: #ffc960; animation: dotPulse 1s ease-in-out infinite; }
    &.online { background: rgba(76, 217, 100, 0.25); }
    &.offline { background: rgba(0, 0, 0, 0.18); }
    &.connecting { background: rgba(255, 201, 96, 0.3); }
    .status-text { color: #fff; font-weight: 500; }
  }

  .device-model {
    display: flex; align-items: center; gap: 10rpx;
    .model-label { font-size: 22rpx; color: rgba(255, 255, 255, 0.85); }
    .model-chip {
      font-size: 20rpx; color: rgba(255, 255, 255, 0.95);
      background: rgba(255, 255, 255, 0.2); padding: 2rpx 12rpx; border-radius: 8rpx;
      font-family: 'Menlo', 'Consolas', monospace; letter-spacing: 1rpx;
    }
  }

  .header-actions { display: flex; align-items: center; gap: 8rpx; flex-shrink: 0; }
  .action-btn {
    width: 52rpx; height: 52rpx; border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s ease; backdrop-filter: blur(4px);
    &:active { background: rgba(255, 255, 255, 0.45); transform: scale(0.9); }
    &.more { background: transparent; }
    &.more:active { background: rgba(255, 255, 255, 0.15); }
    &.disabled { opacity: 0.4; pointer-events: none; }
  }

  .device-meta {
    margin-top: 24rpx; padding: 20rpx 24rpx; border-radius: 16rpx;
    background: rgba(0, 0, 0, 0.12); backdrop-filter: blur(10px);
    display: flex; flex-direction: column; gap: 14rpx;
  }
  .meta-row { display: flex; align-items: center; font-size: 24rpx; }
  .meta-icon { width: 36rpx; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .meta-label { color: rgba(255, 255, 255, 0.6); width: 90rpx; flex-shrink: 0; }
  .meta-value {
    color: #fff; flex: 1; text-align: right; word-break: break-all;
    font-family: 'Menlo', 'Consolas', monospace; font-size: 22rpx;
  }
  .disconnect-row {
    margin-top: 4rpx; padding: 18rpx 20rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.12);
    display: flex; align-items: center; justify-content: space-between;
    .disconnect-text { color: #ff7875; font-size: 26rpx; font-weight: 500; }
    &:active .disconnect-text { opacity: 0.6; }
  }
}

@keyframes iconPulse { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(1.6); opacity: 0; } }
@keyframes dotPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.85); } }
</style>
