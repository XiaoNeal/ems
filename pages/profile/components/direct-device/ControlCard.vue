<template>
  <view class="control-card">
    <view v-for="ctrl in list" :key="ctrl.field" class="control-row">
      <view class="control-info">
        <text class="control-name">{{ ctrl.name }}</text>
        <text class="control-current">当前: {{ ctrl.currentLabel || '--' }}</text>
      </view>
      <view class="control-btns" :class="{ 'btn-disabled': !isConnected }">
        <view
          v-for="opt in ctrl.options"
          :key="opt.value"
          class="ctrl-btn"
          :class="{
            'btn-active': String(ctrl.currentValue) === String(opt.value),
            'btn-danger': opt.dangerous,
            'btn-clicked': clickedBtn === ctrl.field + '-' + opt.value
          }"
          @click="$emit('control-click', ctrl, opt)"
        >{{ opt.label }}</view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 控制指令按钮组组件
 * 事件: control-click(ctrl, opt)
 */
export default {
  name: 'ControlCard',
  props: {
    list: { type: Array, default: () => [] },
    isConnected: { type: Boolean, default: false },
    clickedBtn: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.control-card {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06), 0 1rpx 3rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;

  .control-row {
    padding: 24rpx 28rpx;
    border-bottom: 2rpx solid #f0f2f5;
    &:last-child { border-bottom: none; }
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
  }
  .control-info {
    display: flex;
    flex-direction: column;
    gap: 6rpx;
    flex: 1;
  }
  .control-name { font-size: 28rpx; color: #333; }
  .control-current { font-size: 22rpx; color: #999; }
  .control-btns {
    display: flex;
    gap: 8rpx;
    flex-shrink: 0;
  }
  .ctrl-btn {
    min-width: 88rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    padding: 0 18rpx;
    font-size: 24rpx;
    color: #666;
    background: #f5f7fa;
    border-radius: 10rpx;
    &.btn-active {
      background: #007AFF;
      color: #fff;
    }
    &.btn-danger.btn-active { background: #e6434a; }
    &.btn-clicked { transform: scale(0.94); }
  }
  .btn-disabled .ctrl-btn { opacity: 0.5; }
}
</style>
