<template>
  <view class="status-grid">
    <!-- status 模式：带名称+值+颜色的状态卡 -->
    <template v-if="variant === 'status'">
      <view
        v-for="(status, index) in items"
        :key="index"
        class="status-item"
        :style="{ backgroundColor: status.bgColor, borderColor: status.borderColor }"
      >
        <text class="status-name" :style="{ color: status.color }">{{ status.name }}</text>
        <text class="status-value" :class="{ error: status.value === '发生' }">{{ status.value }}</text>
      </view>
    </template>
    <!-- fault 模式：故障/告警标签，active 时高亮 -->
    <template v-else>
      <view
        v-for="(status, index) in items"
        :key="index"
        class="fault-item"
      >
        <text class="fault-name" :class="{ active: status.isAlarm || status.active }">{{ status.name }}</text>
      </view>
    </template>
    <text v-if="items.length === 0" class="status-empty">暂无数据</text>
  </view>
</template>

<script>
/**
 * 状态/告警网格组件
 * variant='status': 状态卡（名称+值+颜色）
 * variant='fault':  故障标签（名称，active高亮红）
 */
export default {
  name: 'StatusGrid',
  props: {
    items: { type: Array, default: () => [] },
    variant: { type: String, default: 'status' } // 'status' | 'fault'
  }
}
</script>

<style lang="scss" scoped>
.status-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}
.status-item {
  width: calc(33.333% - 8rpx);
  padding: 12rpx 2rpx;
  border-radius: 8rpx;
  border: 1rpx solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.status-name {
  font-size: 22rpx;
  font-weight: 500;
  margin-bottom: 4rpx;
}
.status-value {
  font-size: 24rpx;
  font-weight: 600;
  color: #52c41a;
  &.error { color: #FF4D4F; }
}
.fault-item {
  width: calc(33.333% - 8rpx);
  padding: 12rpx 2rpx;
  border-radius: 8rpx;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fault-name {
  font-size: 22rpx;
  color: #999;
  text-align: center;
  &.active {
    color: #FF4D4F;
    font-weight: 600;
  }
}
.status-empty {
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 28rpx;
  padding: 40rpx 0;
}
</style>
