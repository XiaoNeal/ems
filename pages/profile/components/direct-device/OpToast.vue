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
  padding: 24rpx 48rpx;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  z-index: 998;
  pointer-events: none;
  &.success {
    background: rgba(82, 196, 26, 0.9);
  }
}
</style>
