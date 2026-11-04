<template>
  <view v-if="visible" class="op-toast" :class="{ success: isSuccess }">
    <text>{{ text }}</text>
  </view>
</template>

<script>
/**
 * 操作反馈 Toast 组件
 */
export default {
  name: 'OpToast',
  props: {
    visible: { type: Boolean, default: false },
    text: { type: String, default: '' }
  },
  computed: {
    isSuccess() {
      return this.text && this.text.indexOf('成功') >= 0
    }
  }
}
</script>

<style lang="scss" scoped>
.op-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 560rpx;
  padding: 22rpx 44rpx;
  background: rgba(24, 32, 44, 0.88);
  color: #fff;
  border-radius: 999rpx;
  font-size: 26rpx;
  line-height: 1.4;
  text-align: center;
  box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.18);
  z-index: 998;
  pointer-events: none;

  &.success {
    background: rgba(31, 146, 84, 0.94);
  }
}
</style>
