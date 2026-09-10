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
  border-radius: 20rpx;
  overflow: hidden;
}
.confirm-title {
  padding: 32rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  border-bottom: 1rpx solid #f0f0f0;
}
.confirm-content {
  padding: 32rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
}
.confirm-btns {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}
.confirm-btn {
  flex: 1;
  padding: 28rpx;
  text-align: center;
  font-size: 30rpx;
  &.cancel {
    color: #999;
    border-right: 1rpx solid #f0f0f0;
  }
  &.ok {
    color: #1890ff;
    font-weight: bold;
  }
  &:active { background: #f5f5f5; }
}
</style>
