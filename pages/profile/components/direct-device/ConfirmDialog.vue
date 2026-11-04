<template>
  <view v-if="visible" class="confirm-mask" @click="$emit('cancel')">
    <view class="confirm-dialog" @click.stop>
      <view class="confirm-title"><text>{{ title || '确认操作' }}</text></view>
      <view class="confirm-content"><text>{{ content }}</text></view>
      <view class="confirm-btns">
        <view class="confirm-btn cancel" @click="$emit('cancel')"><text>取消</text></view>
        <view class="confirm-btn ok" @click="$emit('confirm')"><text>确认</text></view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 确认弹窗组件
 * 事件: cancel, confirm
 */
export default {
  name: 'ConfirmDialog',
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: '确认操作' },
    content: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.confirm-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.confirm-dialog {
  width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 24rpx 64rpx rgba(15, 23, 42, 0.24);
}
.confirm-title {
  padding: 38rpx 32rpx 10rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #1d2430;
}
.confirm-content {
  padding: 10rpx 44rpx 38rpx;
  text-align: center;
  font-size: 27rpx;
  line-height: 1.6;
  color: #6b7480;
}
.confirm-btns {
  display: flex;
  padding: 0 24rpx 24rpx;

  .confirm-btn + .confirm-btn {
    margin-left: 16rpx;
  }
}
.confirm-btn {
  flex: 1;
  padding: 24rpx 0;
  text-align: center;
  font-size: 29rpx;
  border-radius: 14rpx;
  transition: opacity 0.15s ease;

  &.cancel {
    color: #6b7480;
    background: #f2f4f8;
  }
  &.ok {
    color: #ffffff;
    font-weight: 600;
    background: #2f7cf6;
    box-shadow: 0 6rpx 16rpx rgba(47, 124, 246, 0.24);
  }
  &:active { opacity: 0.82; }
}
</style>
