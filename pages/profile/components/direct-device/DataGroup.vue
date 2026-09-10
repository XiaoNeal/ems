<template>
  <view class="data-group">
    <view class="group-title">
      <text>{{ title }}</text>
    </view>
    <slot></slot>
  </view>
</template>

<script>
/**
 * 数据分组外壳组件
 * 用法：<DataGroup title="相电压"><DataGrid :items="..." /></DataGroup>
 */
export default {
  name: 'DataGroup',
  props: {
    title: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.data-group {
  margin-bottom: 20rpx;
  &:last-child { margin-bottom: 0; }
}
.group-title {
  display: flex;
  align-items: center;
  padding: 8rpx 4rpx 8rpx 16rpx;
  position: relative;
  margin-bottom: 4rpx;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6rpx;
    height: 24rpx;
    border-radius: 3rpx;
    background: #4488fb;
  }
  text {
    font-size: 28rpx;
    font-weight: bold;
    color: #555;
  }
}
</style>
