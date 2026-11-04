<template>
  <view class="data-grid" :class="{ 'data-grid--bare': bare }">
    <view
      v-for="(item, index) in items"
      :key="index"
      class="grid-item"
      :class="{ 'grid-item--wide': item.wide, 'grid-item--alarm': item.danger }"
    >
      <text class="item-label">{{ item.label }}</text>
      <view class="item-value-row">
        <text class="item-value">{{ cell(item) }}</text>
        <text v-if="item.unit" class="item-unit">{{ item.unit }}</text>
      </view>
    </view>
    <text v-if="items.length === 0" class="grid-empty">暂无数据</text>
  </view>
</template>

<script>
/**
 * 数据网格组件（标签/值 栅格）
 * 用法：<DataGrid :items="[{label:'A相(V)', value:'220.5'}, ...]" />
 *
 * 视觉约定：白底卡片 + 细横线分行，单元格不加底色和阴影，
 * 数值统一等宽字体，长数字右对齐不跳动。
 */
export default {
  name: 'DataGrid',
  props: {
    items: {
      type: Array,
      default: () => []
      // item: { label, value, unit?, danger?, wide? }
    },
    /** 去掉外层白卡（外层已有卡片容器时使用） */
    bare: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cell(item) {
      const v = item.value
      if (v === undefined || v === null || v === '') return '--'
      return v
    }
  }
}
</script>

<style lang="scss" scoped>
.data-grid {
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  border: 1rpx solid #eef1f5;
  border-radius: 18rpx;
  overflow: hidden;

  &--bare {
    background: transparent;
    border: none;
    border-radius: 0;
  }
}

.grid-item {
  width: 33.3333%;
  box-sizing: border-box;
  padding: 20rpx 10rpx 18rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #f3f5f8;
  transition: background-color 0.15s ease;

  &:active {
    background: #f8fafc;
  }

  &.grid-item--wide {
    width: 66.6666%;
  }
}

.item-label {
  max-width: 100%;
  font-size: 21rpx;
  line-height: 1.3;
  color: #98a2ae;
  text-align: center;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-value-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  max-width: 100%;
  min-width: 0;
}

.item-value {
  max-width: 100%;
  font-size: 30rpx;
  font-weight: 600;
  color: #1d2430;
  /* 等宽字体：数值刷新时宽度不跳动 */
  font-family: 'Menlo', 'Consolas', 'Roboto Mono', monospace;
  letter-spacing: -0.5rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-unit {
  flex-shrink: 0;
  margin-left: 4rpx;
  font-size: 20rpx;
  font-weight: 400;
  color: #98a2ae;
}

.grid-item--alarm {
  background: #fff6f6;

  .item-value {
    color: #e5484d;
  }
}

.grid-empty {
  width: 100%;
  padding: 36rpx 0;
  text-align: center;
  font-size: 24rpx;
  color: #98a2ae;
}
</style>
