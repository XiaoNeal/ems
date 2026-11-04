<template>
  <view class="data-group">
    <view class="group-head" :class="{ 'is-collapsed': collapsed }" @tap="toggle">
      <view class="group-bar"></view>
      <text class="group-title">{{ title }}</text>
      <view class="group-tail">
        <text v-if="collapsed && summary" class="group-summary">{{ summary }}</text>
        <view class="group-arrow" :class="{ up: !collapsed }">
          <uni-icons type="down" size="12" color="#98a2ae"></uni-icons>
        </view>
      </view>
    </view>
    <view v-show="!collapsed" class="group-body">
      <slot></slot>
    </view>
  </view>
</template>

<script>
/**
 * 数据分组外壳组件
 * 用法：<DataGroup title="相电压"><DataGrid :items="..." /></DataGroup>
 *
 * 标题行浅灰底 + 左侧渐变色条，整行可点折叠（默认展开）。
 * 长列表（BMS 10 组、液冷机 6 组）折叠后一屏能看到全部分组，避免无休止滚动。
 */
export default {
  name: 'DataGroup',
  props: {
    title: { type: String, default: '' },
    /** 是否允许折叠标题行 */
    collapsible: { type: Boolean, default: true },
    /** 初始是否收起 */
    defaultCollapsed: { type: Boolean, default: false },
    /** 收起时在标题右侧显示的摘要文字（如「12 项」） */
    summary: { type: String, default: '' }
  },
  data() {
    return {
      collapsed: this.defaultCollapsed
    }
  },
  methods: {
    toggle() {
      if (!this.collapsible) return
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<style lang="scss" scoped>
.data-group {
  margin-bottom: 18rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.group-head {
  display: flex;
  align-items: center;
  padding: 14rpx 16rpx 14rpx 16rpx;
  background: #f4f6f9;
  border-radius: 14rpx;
  transition: background-color 0.15s ease;

  &:active {
    background: #eef2f7;
  }

  &.is-collapsed {
    background: #f7f9fb;
  }
}

.group-bar {
  flex-shrink: 0;
  width: 7rpx;
  height: 24rpx;
  margin-right: 12rpx;
  border-radius: 4rpx;
  background: linear-gradient(180deg, #63a4ff 0%, #2f7cf6 100%);
}

.group-title {
  flex: 1;
  min-width: 0;
  font-size: 27rpx;
  font-weight: 600;
  color: #3a4350;
  letter-spacing: 0.5rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group-tail {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.group-summary {
  margin-right: 8rpx;
  font-size: 21rpx;
  color: #98a2ae;
}

.group-arrow {
  width: 34rpx;
  height: 34rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.22s ease;

  /* 展开时箭头朝上，收起时朝下 */
  &.up {
    transform: rotate(180deg);
  }
}

.group-body {
  padding-top: 12rpx;
}
</style>
