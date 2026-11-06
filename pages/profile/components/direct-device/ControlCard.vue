<template>
  <view class="control-card">
    <view v-for="(ctrl, ci) in list" :key="ctrl.field" class="control-row">
      <view class="control-info">
        <text class="control-name">{{ ctrl.name }}</text>
        <text class="control-current">当前: {{ ctrl.currentLabel || '--' }}</text>
      </view>
      <view class="control-btns" :class="{ 'btn-disabled': !isConnected }">
        <view
          v-for="(opt, oi) in (ctrl.options || [])"
          :key="oi"
          class="ctrl-btn"
          :class="{
            'btn-active': String(ctrl.currentValue) === String(opt.value),
            'btn-danger': opt.dangerous,
            'btn-clicked': clickedBtn === ctrl.field + '-' + opt.value
          }"
          @click="onCtrlTap(ci, oi)"
        >{{ opt.label }}</view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 控制指令按钮组组件
 * 事件: control-click({ index, optionIndex })
 *
 * 只透传下标，不回传 ctrl/opt 对象：小程序事件桥转发 detail 时会序列化对象，
 * 复杂对象（含 options 数组）容易丢字段，导致页面拿到「有参数、没选项」→ 下发值为空。
 * 页面侧用 controlList[index].options[optionIndex] 反查，永远是完整原始对象。
 */
export default {
  name: 'ControlCard',
  props: {
    list: { type: Array, default: () => [] },
    isConnected: { type: Boolean, default: false },
    clickedBtn: { type: String, default: '' }
  },
  methods: {
    onCtrlTap(index, optionIndex) {
      this.$emit('control-click', { index, optionIndex })
    }
  }
}
</script>

<style lang="scss" scoped>
.control-card {
  background: #fff;
  border: 1rpx solid #eceff4;
  border-radius: 20rpx;
  box-shadow: 0 1rpx 3rpx rgba(20, 32, 52, 0.03);
  overflow: hidden;

  .control-row {
    padding: 24rpx 24rpx;
    border-bottom: 1rpx solid #f4f6f9;
    &:last-child { border-bottom: none; }
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
  }
  .control-info {
    display: flex;
    flex-direction: column;
    gap: 6rpx;
    flex: 1;
    min-width: 0;
  }
  .control-name { font-size: 26rpx; color: #2b3240; font-weight: 500; }
  .control-current { font-size: 21rpx; color: #98a2ae; }
  .control-btns {
    display: flex;
    gap: 8rpx;
    flex-shrink: 0;
  }
  .ctrl-btn {
    min-width: 88rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    padding: 0 18rpx;
    font-size: 23rpx;
    color: #5c6673;
    background: #f2f4f8;
    border-radius: 10rpx;
    transition: all 0.16s ease;

    &.btn-active {
      background: #2f7cf6;
      color: #fff;
      font-weight: 600;
      box-shadow: 0 3rpx 10rpx rgba(47, 124, 246, 0.24);
    }
    &.btn-danger.btn-active { background: #e5484d; box-shadow: 0 3rpx 10rpx rgba(229, 72, 77, 0.26); }
    &.btn-clicked { transform: scale(0.94); opacity: 0.85; }
  }
  .btn-disabled .ctrl-btn { opacity: 0.45; }
}
</style>
