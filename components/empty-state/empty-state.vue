<template>
  <view class="empty-state-container">
    <view class="empty-icon-wrapper">
      <view class="empty-icon">
        <uni-icons type="bar-chart" size="56" color="#71a6ff" />
      </view>
    </view>
    <view class="empty-content">
      <text class="empty-title">{{ title || '暂无数据' }}</text>
      <text class="empty-desc">{{ desc || '当前没有数据，稍后再试' }}</text>
    </view>
    <view v-if="showRefresh" class="empty-action" @click="handleRefresh">
      <uni-icons type="refresh" size="22" color="#71a6ff" />
      <text class="action-text">点击刷新</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    title: {
      type: String,
      default: '暂无数据'
    },
    desc: {
      type: String,
      default: '当前没有数据，稍后再试'
    },
    showRefresh: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleRefresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
}

.empty-icon-wrapper {
  margin-bottom: 32rpx;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  background: rgba(113, 166, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 24rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.empty-desc {
  font-size: 26rpx;
  color: #999;
}

.empty-action {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 32rpx;
  background: rgba(113, 166, 255, 0.1);
  border-radius: 32rpx;
}

.action-text {
  font-size: 28rpx;
  color: #71a6ff;
  font-weight: 500;
}
</style>