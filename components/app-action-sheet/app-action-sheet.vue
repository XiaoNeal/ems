<template>
  <view v-if="rendered" class="as-root" :class="{ 'as-root--show': shown }" @touchmove.stop="noop">
    <view class="as-mask" @click="handleCancel"></view>

    <view class="as-panel">
      <view class="as-grabber"></view>

      <view class="as-head">
        <text class="as-title">{{ title }}</text>
        <text v-if="subtitle" class="as-subtitle">{{ subtitle }}</text>
      </view>

      <view class="as-list">
        <view
          v-for="(item, index) in safeItems"
          :key="item.key || index"
          class="as-item"
          :class="{ 'as-item--primary': item.primary === true }"
          hover-class="as-item--hover"
          :hover-stay-time="80"
          @click="handleSelect(index, item)"
        >
          <view class="as-icon" :class="item.primary === true ? 'as-icon--primary' : 'as-icon--plain'">
            <uni-icons :type="item.icon || 'info'" size="22" :color="item.primary === true ? '#007AFF' : '#7b8794'"></uni-icons>
          </view>
          <view class="as-item-body">
            <text class="as-item-label" :class="{ 'as-item-label--primary': item.primary === true }">{{ item.label }}</text>
            <text v-if="item.desc" class="as-item-desc">{{ item.desc }}</text>
          </view>
          <uni-icons type="arrowright" size="18" color="#c4cbd4"></uni-icons>
        </view>
      </view>

      <view class="as-cancel" hover-class="as-cancel--hover" :hover-stay-time="80" @click="handleCancel">
        <text class="as-cancel-text">{{ cancelText }}</text>
      </view>

      <view class="as-safe-area"></view>
    </view>
  </view>
</template>

<script>
/**
 * 底部操作面板（替代 uni.showActionSheet 的系统默认样式）
 * 兼容 APP-PLUS / MP-WEIXIN，带滑入动画、点击遮罩关闭、底部安全区适配。
 * 用法：:visible / :items / @select({ index, item }) / @close
 */
export default {
  name: 'AppActionSheet',
  props: {
    visible: { default: false },
    title: { default: '' },
    subtitle: { default: '' },
    items: { default: () => [] },
    cancelText: { default: '取消' }
  },
  data() {
    return {
      rendered: false,
      shown: false,
      locked: false,
      openTimer: null,
      closeTimer: null
    }
  },
  computed: {
    safeItems() {
      return Array.isArray(this.items) ? this.items : []
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.openPanel()
        } else {
          this.closePanel()
        }
      }
    }
  },
  beforeDestroy() {
    if (this.openTimer) clearTimeout(this.openTimer)
    if (this.closeTimer) clearTimeout(this.closeTimer)
  },
  methods: {
    noop() {},
    openPanel() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer)
        this.closeTimer = null
      }
      this.locked = false
      this.rendered = true
      if (this.openTimer) clearTimeout(this.openTimer)
      this.$nextTick(() => {
        this.openTimer = setTimeout(() => {
          this.shown = true
          this.openTimer = null
        }, 20)
      })
    },
    closePanel() {
      if (this.openTimer) {
        clearTimeout(this.openTimer)
        this.openTimer = null
      }
      this.shown = false
      if (!this.rendered) return
      if (this.closeTimer) clearTimeout(this.closeTimer)
      this.closeTimer = setTimeout(() => {
        this.rendered = false
        this.closeTimer = null
      }, 240)
    },
    handleCancel() {
      if (this.locked) return
      this.locked = true
      this.$emit('close')
    },
    handleSelect(index, item) {
      if (this.locked) return
      this.locked = true
      this.$emit('select', { index: index, item: item })
    }
  }
}
</script>

<style lang="scss" scoped>
.as-root {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.as-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(20, 28, 40, 0.42);
  opacity: 0;
  transition: opacity 0.22s ease;
}

.as-root--show .as-mask {
  opacity: 1;
}

.as-panel {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 0 24rpx;
  background: #ffffff;
  border-radius: 32rpx 32rpx 0 0;
  box-shadow: 0 -12rpx 40rpx rgba(20, 28, 40, 0.1);
  transform: translateY(100%);
  transition: transform 0.28s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.as-root--show .as-panel {
  transform: translateY(0);
}

.as-grabber {
  width: 72rpx;
  height: 8rpx;
  margin: 20rpx auto 8rpx;
  border-radius: 8rpx;
  background: #e3e7ed;
}

.as-head {
  display: flex;
  flex-direction: column;
  padding: 16rpx 8rpx 24rpx;
}

.as-title {
  font-size: 34rpx;
  font-weight: 600;
  line-height: 48rpx;
  color: #1f2937;
}

.as-subtitle {
  margin-top: 6rpx;
  font-size: 24rpx;
  line-height: 36rpx;
  color: #8a94a1;
}

.as-list {
  overflow: hidden;
  border: 2rpx solid #eef1f5;
  border-radius: 20rpx;
  background: #ffffff;
}

.as-item {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
  border-bottom: 2rpx solid #f1f3f6;

  &:last-child {
    border-bottom: none;
  }
}

.as-item--hover {
  background: #f7f9fc;
}

.as-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  margin-right: 20rpx;
  border-radius: 20rpx;
}

.as-icon--primary {
  background: #eaf3ff;
}

.as-icon--plain {
  background: #f3f5f8;
}

.as-item-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.as-item-label {
  font-size: 30rpx;
  font-weight: 500;
  line-height: 42rpx;
  color: #2b3440;
}

.as-item-label--primary {
  color: #007aff;
}

.as-item-desc {
  margin-top: 4rpx;
  font-size: 24rpx;
  line-height: 34rpx;
  color: #98a1ad;
}

.as-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96rpx;
  margin-top: 20rpx;
  border-radius: 20rpx;
  background: #f5f7fa;
}

.as-cancel--hover {
  background: #eaeef3;
}

.as-cancel-text {
  font-size: 30rpx;
  color: #5b6572;
}

.as-safe-area {
  height: calc(16rpx + constant(safe-area-inset-bottom));
  height: calc(16rpx + env(safe-area-inset-bottom));
}
</style>
