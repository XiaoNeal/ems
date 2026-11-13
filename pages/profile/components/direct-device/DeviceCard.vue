<template>
  <view class="device-card" :class="connectionState">
    <view class="device-card-content">
      <!-- 头部：图标 + 信息 + 操作按钮 -->
      <view class="device-header">
        <!-- 品牌标识改为文字：原来这里是一个大齿轮，与右侧「配置」按钮的小齿轮重复，
             一张设备卡上出现两个设置图标，容易被误认成两个设置入口。 -->
        <view class="device-icon-wrap" :class="{ 'is-online': connectionState === 'online' }">
          <view class="device-icon">
            <text class="device-icon-text">EMS</text>
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
          <!-- 副标题恒为空（按用户要求不再显示任何副标题），整行不渲染 -->
          <view v-if="deviceSubtitle" class="device-model">
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

      <!-- 展开详情：设备地址 / 数据通道等协议信息不再展示，面向用户的页面
           不出现 Broker / Topic / TCP / MQTT 等术语，排障信息只在控制台保留。
           这里只保留「更新时刻」和「断开连接」两个用户用得上的入口。 -->
      <view v-if="showDeviceMeta" class="device-meta">
        <view class="meta-row">
          <view class="meta-icon"><uni-icons type="clock" size="12" color="rgba(255,255,255,0.6)"></uni-icons></view>
          <text class="meta-label">更新</text>
          <text class="meta-value">{{ clockText }}</text>
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
 *
 * 「更新 HH:MM:SS」不再由父页面 props 下传：父页面为了 APP 性能把数据提交
 * 节流到 1.5s、页头文案又额外锁 4s，导致每秒上报却 4~6s 才跳一次。
 * 现在卡片自己订阅 realtime-store 的帧时钟，按秒刷新一个文本节点，
 * 父页面完全不参与收帧渲染（与 tab 面板同一套订阅架构）。
 */
import { subscribeFrameTick, getLastFrameAt } from './realtime-store.js'

function formatClock(ts) {
  if (!ts) return '--'
  const d = new Date(ts)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export default {
  name: 'DeviceCard',
  props: {
    connectionState: { type: String, default: 'offline' }, // online | offline | connecting
    connecting: { type: Boolean, default: false },
    isConnected: { type: Boolean, default: false },
    deviceName: { type: String, default: '' },
    deviceSubtitle: { type: String, default: '' },
    statusText: { type: String, default: '' },
    showDeviceMeta: { type: Boolean, default: false }
  },
  data() {
    // 首帧渲染就能显示本连接已收到的最后时刻（例如页头重挂载）
    return { clockText: formatClock(getLastFrameAt()) }
  },
  watch: {
    // 详情折叠时不白重渲染；展开瞬间补上最新时刻
    showDeviceMeta(v) {
      if (v) this.clockText = formatClock(getLastFrameAt())
    }
  },
  created() {
    this._unsubscribeFrameTick = subscribeFrameTick(ts => {
      // 「更新」那行在 v-if="showDeviceMeta" 里，折叠时只记不刷，避免每秒一次无谓 patch
      if (this.showDeviceMeta) this.clockText = formatClock(ts)
    })
  },
  beforeDestroy() {
    if (this._unsubscribeFrameTick) {
      this._unsubscribeFrameTick()
      this._unsubscribeFrameTick = null
    }
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

  /* 去掉 z-index：卡片内部的层叠上下文会在切换帧与页面其它合成层叠加，
     微信渲染层重绘错位时卡片内容会只剩一块白底（截图里的「白色矩形」） */
  .device-card-content { position: relative; padding: 26rpx 30rpx; }
  .device-header { display: flex; align-items: center; gap: 20rpx; }

  .device-icon-wrap {
    position: relative; width: 76rpx; height: 76rpx; flex-shrink: 0;
    .device-icon {
      width: 76rpx; height: 76rpx; border-radius: 18rpx;
      background: rgba(255, 255, 255, 0.20);
      display: flex; align-items: center; justify-content: center;
      .device-icon-text {
        color: #fff; font-size: 24rpx; font-weight: 700; letter-spacing: 1rpx;
        line-height: 1;
      }
    }
  }

  .device-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8rpx; }
  .device-name-row { display: flex; align-items: center; gap: 12rpx; }
  .device-name {
    font-size: 34rpx; color: #fff; font-weight: 600; letter-spacing: 0.6rpx;
  }

  /* 状态徽章统一白底半透明，只用圆点颜色表状态：
     满色徽章（绿/黄）会和蓝色卡面抢色，看起来像两个色块拼在一起 */
  .status-badge {
    display: flex; align-items: center; gap: 8rpx; font-size: 26rpx;
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
      font-size: 27rpx; color: rgba(255, 255, 255, 0.82); letter-spacing: 0.3rpx;
      /* 副标题固定单行：参数设置类名称较长，换行会把卡片头部撑高 */
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
  }

  .header-actions { display: flex; align-items: center; gap: 10rpx; flex-shrink: 0; }
  .action-btn {
    width: 56rpx; height: 56rpx; border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    display: flex; align-items: center; justify-content: center;
    /* 点击反馈只用背景色：opacity / transform 会额外建合成层 */
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
  .meta-row { display: flex; align-items: center; font-size: 28rpx; }
  .meta-icon { width: 36rpx; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .meta-label { color: rgba(255, 255, 255, 0.68); width: 90rpx; flex-shrink: 0; letter-spacing: 0.3rpx; }
  .meta-value {
    color: #fff; flex: 1; text-align: right; word-break: break-all;
    font-size: 27rpx; font-variant-numeric: tabular-nums; letter-spacing: 0.2rpx;
  }
  .disconnect-row {
    margin-top: 4rpx; padding: 18rpx 20rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.15);
    display: flex; align-items: center; justify-content: space-between;
    .disconnect-text { color: #ff7875; font-size: 28rpx; font-weight: 500; }
    &:active .disconnect-text { opacity: 0.6; }
  }
}

</style>
