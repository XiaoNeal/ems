<template>
  <view class="arch-stats-section">
    <view class="arch-section-title">
      <text class="arch-title-text">{{ title }}</text>
    </view>
    <view class="arch-stats-box">
      <block v-for="(row, rIdx) in rows" :key="rIdx">
        <!-- 行间分割线 -->
        <view v-if="row.divider" class="arch-section-divider"></view>
        <!-- 统计行 -->
        <view v-else class="arch-stat-row">
          <block v-for="(col, cIdx) in row.cols" :key="cIdx">
            <view
              v-if="cIdx > 0"
              class="arch-stat-divider"
            ></view>
            <view
              class="arch-stat-item vertical"
              :class="{ 'arch-center': col.center }"
            >
              <view
                v-for="(sub, sIdx) in col.subs"
                :key="sIdx"
                class="arch-stat-subitem"
              >
                <text class="arch-stat-label">{{ sub.label }}</text>
                <text class="arch-stat-value" :class="{ small: sub.small }">
                  {{ sub.value !== undefined && sub.value !== null && sub.value !== '' ? sub.value : '--' }}<text v-if="sub.unit" class="arch-stat-unit">{{ sub.unit }}</text>
                </text>
              </view>
            </view>
          </block>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
/**
 * 概览统计区块组件（电网/光伏数据等）
 * rows: [
 *   { cols: [ { center?: Boolean, subs: [ {label, value, unit?, small?} ] } ] },
 *   { divider: true },
 *   ...
 * ]
 */
export default {
  name: 'StatSection',
  props: {
    title: { type: String, default: '' },
    rows: { type: Array, default: () => [] }
  }
}
</script>

<style lang="scss" scoped>
.arch-stats-section {
  background: #ffffff;
  border: 1rpx solid #eef1f5;
  border-radius: 18rpx;
  padding: 26rpx 26rpx;
  margin-bottom: 16rpx;
}
.arch-section-title {
  margin-bottom: 18rpx;
  padding-left: 20rpx;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 7rpx;
    height: 28rpx;
    border-radius: 4rpx;
    background: linear-gradient(180deg, #63a4ff 0%, #2f7cf6 100%);
  }
}
.arch-title-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #1d2430;
  letter-spacing: 0.5rpx;
}
.arch-stats-box {
  width: 100%;
  background: #f8fafc;
  border: 1rpx solid #eef1f5;
  border-radius: 14rpx;
  overflow: hidden;
}
.arch-stat-row {
  display: flex;
  align-items: stretch;
  min-height: 112rpx;
}
.arch-stat-divider {
  width: 1rpx;
  background-color: #eef1f5;
  margin: 20rpx 0;
}
.arch-section-divider {
  height: 1rpx;
  background-color: #eef1f5;
  margin: 0;
}
.arch-stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  &.vertical {
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    padding: 20rpx 22rpx;
    gap: 16rpx;
  }
  &.arch-center {
    justify-content: center;
    align-items: center;
  }
}
.arch-stat-subitem {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 6rpx;
}
.arch-stat-label {
  font-size: 21rpx;
  color: #98a2ae;
  white-space: nowrap;
}
.arch-stat-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #1d2430;
  font-family: 'Menlo', 'Consolas', monospace;
  line-height: 1.3;
  &.small {
    font-size: 25rpx;
    font-weight: 400;
    color: #5c6673;
    font-family: inherit;
  }
}
.arch-stat-unit {
  font-size: 21rpx;
  color: #98a2ae;
  font-weight: 400;
  margin-left: 4rpx;
  font-family: inherit;
}
</style>
