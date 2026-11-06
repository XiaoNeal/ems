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
  border: 1rpx solid #eceff4;
  border-radius: 20rpx;
  box-shadow: 0 1rpx 3rpx rgba(20, 32, 52, 0.03);
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
  font-size: 22rpx;
  line-height: 1.35;
  color: #78838f;
  letter-spacing: 0.2rpx;
  text-align: center;
  margin-bottom: 8rpx;
  /* 标签允许折行（最多 2 行）：三列时每格只有 1/3 屏宽，
     像「PCS交流累计充电电量」这类 8 字以上的名称单行必然被省略成「…」，
     信息直接丢失。改成两行显示完整名称，正常长度的标签仍是一行，不受影响。
     行高固定 1.35，两行也只用 2.7 行高，不会明显撑高卡片。 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-word;
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
  font-size: 32rpx;
  font-weight: 600;
  color: #16202d;
  /* 数字等宽：刷新时宽度不跳动，但不使用 mono 字体 ——
     安卓上 Menlo/Consolas 会落到通用 monospace，中英混排时字面高低不齐，
     换成系统 UI 字体 + 表格数字特性，既对齐又与中文同一套骨架 */
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC',
    'HarmonyOS Sans', 'Helvetica Neue', sans-serif;
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
  letter-spacing: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-unit {
  flex-shrink: 0;
  margin-left: 5rpx;
  font-size: 21rpx;
  font-weight: 500;
  color: #8a94a1;
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
  color: #8a94a1;
}
</style>
