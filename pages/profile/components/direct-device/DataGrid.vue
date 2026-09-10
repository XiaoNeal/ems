<template>
  <view class="data-grid">
    <view
      v-for="(item, index) in items"
      :key="index"
      class="grid-item"
      :class="{ 'grid-item--wide': item.wide }"
    >
      <text class="item-label">{{ item.label }}</text>
      <text class="item-value" :class="{ alarm: item.danger }">
        {{ item.value !== undefined && item.value !== null && item.value !== '' ? item.value : '--' }}
        <text v-if="item.unit" class="item-unit">{{ item.unit }}</text>
      </text>
    </view>
    <text v-if="items.length === 0" class="grid-empty">暂无数据</text>
  </view>
</template>

<script>
/**
 * 数据网格组件（标签/值 卡片网格）
 * 用法：<DataGrid :items="[{label:'A相(V)', value:'220.5'}, ...]" />
 */
export default {
  name: 'DataGrid',
  props: {
    items: {
      type: Array,
      default: () => []
      // item: { label, value, unit?, danger?, wide? }
    }
  }
}
</script>

<style lang="scss" scoped>
.data-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  padding: 12rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border-radius: 16rpx;
}
.grid-item {
  width: calc(33.333% - 8rpx);
  background: #fff;
  padding: 18rpx 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: none;
  &:active {
    transform: scale(0.96);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  }
  &.grid-item--wide { width: calc(50% - 6rpx); }
}
.item-label {
  font-size: 22rpx;
  color: #8a8a8a;
  display: block;
  margin-bottom: 6rpx;
  text-align: center;
  font-weight: 400;
}
.item-value {
  font-size: 30rpx;
  color: #1a1a1a;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5rpx;
  &.alarm { color: #e6434a; }
}
.item-unit {
  font-size: 20rpx;
  color: #999;
  font-weight: 400;
}
.grid-empty {
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 26rpx;
  padding: 30rpx 0;
}
</style>
