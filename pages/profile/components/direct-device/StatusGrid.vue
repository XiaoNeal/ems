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
        :class="{ active: status.isAlarm || status.active }"
      >
        <view class="fault-dot"></view>
        <text class="fault-name">{{ status.name }}</text>
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
  width: calc((100% - 20rpx) / 3);
  padding: 18rpx 6rpx 16rpx;
  border-radius: 14rpx;
  border: 1rpx solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.status-name {
  font-size: 21rpx;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 6rpx;
  text-align: center;
}

.status-value {
  font-size: 25rpx;
  font-weight: 600;
  color: #1f9254;
  font-family: 'Menlo', 'Consolas', monospace;

  &.error {
    color: #e5484d;
  }
}

/* 故障位：未命中保持中性灰，命中才转红，避免整片彩色噪音 */
.fault-item {
  display: flex;
  align-items: center;
  width: calc((100% - 20rpx) / 3);
  box-sizing: border-box;
  padding: 16rpx 14rpx;
  border-radius: 12rpx;
  background: #ffffff;
  border: 1rpx solid #eef1f5;

  &.active {
    background: #fff2f0;
    border-color: #ffd3cd;

    .fault-dot {
      background: #f2544c;
    }

    .fault-name {
      color: #d93a32;
      font-weight: 600;
    }
  }
}

.fault-dot {
  flex-shrink: 0;
  width: 10rpx;
  height: 10rpx;
  margin-right: 8rpx;
  border-radius: 50%;
  background: #d8dce2;
}

.fault-name {
  flex: 1;
  min-width: 0;
  font-size: 21rpx;
  line-height: 1.3;
  color: #8d949e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-empty {
  width: 100%;
  padding: 40rpx 0;
  text-align: center;
  color: #98a2ae;
  font-size: 26rpx;
}
</style>
