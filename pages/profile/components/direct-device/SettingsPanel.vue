<template>
  <view>
    <!-- 设置头部 -->
    <view class="settings-header" :class="tabCfg.theme">
      <text class="settings-title">{{ tabCfg.title }}</text>
      <view class="edit-toggle" :class="{ active: isEditing }" @click="$emit('toggle-edit', tabCfg.editKey)">
        <text>{{ isEditing ? '完成编辑' : '修改配置' }}</text>
      </view>
    </view>

    <!-- 开关控制：快捷控制（分段）或常规模式 -->
    <template v-if="tabCfg.switchSections">
      <view v-for="ss in tabCfg.switchSections" :key="ss.filterKey" class="settings-section">
        <view class="section-title"><text>{{ ss.title }}</text></view>
        <view
          v-for="p in getParams(tabCfg.dataKey).filter(item => item.key === ss.filterKey)"
          :key="p.key"
          class="param-row"
        >
          <text class="param-label">{{ p.label }}</text>
          <view class="param-btns">
            <view
              v-for="opt in p.options"
              :key="opt.value"
              class="param-btn"
              :class="{ 'btn-danger': opt.dangerous, 'btn-active': formatCurrentValue(p) === opt.value }"
              @click="$emit('switch-click', p, opt)"
            >{{ opt.label }}</view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="settings-section">
        <view class="section-title"><text>{{ tabCfg.switchTitle }}</text></view>
        <view v-for="p in getParams(tabCfg.dataKey)" :key="p.key" class="param-row">
          <text class="param-label">{{ p.label }}</text>
          <view class="param-btns">
            <view
              v-for="opt in p.options"
              :key="opt.value"
              class="param-btn"
              :class="{ 'btn-danger': opt.dangerous, 'btn-active': formatCurrentValue(p) === opt.value }"
              @click="$emit('switch-click', p, opt)"
            >{{ opt.label }}</view>
          </view>
        </view>
      </view>
      <!-- 额外开关控制（BMS 的"开关控制"段） -->
      <view v-if="tabCfg.extraSwitchKey" class="settings-section">
        <view class="section-title"><text>{{ tabCfg.extraSwitchTitle }}</text></view>
        <view v-for="p in getParams(tabCfg.extraSwitchKey)" :key="p.key" class="param-row">
          <text class="param-label">{{ p.label }}</text>
          <view class="param-btns">
            <view
              v-for="opt in p.options"
              :key="opt.value"
              class="param-btn"
              :class="{ 'btn-danger': opt.dangerous, 'btn-active': formatCurrentValue(p) === opt.value }"
              @click="$emit('switch-click', p, opt)"
            >{{ opt.label }}</view>
          </view>
        </view>
      </view>
    </template>

    <!-- 数值参数（统一扁平列表） -->
    <view class="settings-section">
      <view class="section-title"><text>{{ tabCfg.numericTitle }}</text></view>
      <view
        v-for="p in getParams(tabCfg.numericKey)"
        :key="p.key"
        class="num-row"
      >
        <text class="num-label">{{ p.label }}</text>
        <view class="num-main">
          <view class="num-input" @click="$emit('numeric-edit', p)">
            <text class="num-value">{{ formatCurrentText(p) }}</text>
          </view>
          <text class="num-unit">{{ p.unit }}</text>
          <view class="num-edit" @click="$emit('numeric-edit', p)">
            <text>编辑</text>
            <uni-icons type="compose" size="12" color="#0066ff"></uni-icons>
          </view>
        </view>
        <text class="num-range" v-if="p.min !== undefined && p.max !== undefined">
          范围: {{ p.min }}~{{ p.max }}{{ p.unit }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 设置面板组件（数据驱动，对应 SETTINGS_TABS 中的一项）
 * 事件: toggle-edit(editKey), switch-click(param, opt), numeric-edit(param)
 */
export default {
  name: 'SettingsPanel',
  props: {
    tabCfg: { type: Object, required: true },
    // 所有参数数组的映射：{ pcsSwitchParams: [...], bmsNumericParams: [...] }
    paramsMap: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
    formatCurrentLabel: { type: Function, default: () => '--' },
    formatCurrentValue: { type: Function, default: () => null },
    formatCurrentText: { type: Function, default: () => '--' }
  },
  methods: {
    getParams(key) {
      return (this.paramsMap && this.paramsMap[key]) || []
    }
  }
}
</script>

<style lang="scss" scoped>
/* ========== 主题色变量 ========== */
$primary: #0066ff;
$primary-light: #e8f1ff;
$danger: #ff4d4f;
$danger-light: #fff0f0;
$text-1: #1a1a1a;
$text-2: #6b6b6b;
$text-3: #a0a0a0;
$bg-card: #ffffff;
$bg-soft: #f7f8fa;
$border: #f0f0f2;

/* ========== 设置头部 ========== */
.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 36rpx;
  border-radius: 18rpx;
  margin-bottom: 16rpx;
  position: relative;
  overflow: hidden;
  background: #f0f0f2;

  &::after {
    content: '';
    position: absolute;
    right: -40rpx;
    top: -40rpx;
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
  }
}

.settings-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: 1rpx;
}

.edit-toggle {
  padding: 10rpx 26rpx;
  border-radius: 8rpx;
  background: #0066ff;
  color: #fff;
  font-size: 24rpx;
  font-weight: 500;
  transition: all 0.25s ease;

  &.active {
    background: #f7f8fa;
    color: #0066ff;
    border: 1rpx solid #d0e3ff;
    font-weight: 600;
  }
  &:active { transform: scale(0.94); }
}

/* ========== 区块卡片 ========== */
.settings-section {
  background: $bg-card;
  border-radius: 14rpx;
  padding: 4rpx 28rpx;
  margin-bottom: 14rpx;
  box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.03);
}

.section-title {
  font-size: 26rpx;
  font-weight: 600;
  color: $text-1;
  padding: 20rpx 0 14rpx 20rpx;
  position: relative;
  border-bottom: 1rpx solid $border;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 22rpx;
    bottom: 16rpx;
    width: 5rpx;
    border-radius: 3rpx;
    background: $primary;
  }
}

/* ========== 开关参数行 ========== */
.param-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 22rpx 0;
  border-bottom: 1rpx solid $border;
  &:last-child { border-bottom: none; padding-bottom: 24rpx; }
  &:active { background: #fafbfc; }
}

.param-label {
  font-size: 28rpx;
  color: $text-1;
  font-weight: 500;
  flex-shrink: 0;
  white-space: nowrap;
}

/* ========== 开关按钮组 ========== */
.param-btns {
  display: flex;
  gap: 12rpx;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.param-btn {
  padding: 12rpx 28rpx;
  border-radius: 8rpx;
  background: #f2f3f5;
  color: $text-2;
  font-size: 26rpx;
  font-weight: 500;
  border: 1rpx solid transparent;
  transition: all 0.2s ease;

  &.btn-active {
    background: #fff;
    color: #0066ff;
    border-color: #0066ff;
    font-weight: 600;
  }
  &.btn-danger {
    color: #ff4d4f;
    background: #fff;
    border-color: #ff4d4f;
    &.btn-active {
      background: #fff;
      color: #ff4d4f;
      border-color: #ff4d4f;
      font-weight: 700;
    }
  }
  &:active { transform: scale(0.94); opacity: 0.8; }
}

/* ========== 数值参数行（统一扁平） ========== */
.num-row {
  padding: 20rpx 0;
  border-bottom: 1rpx solid $border;
  display: flex;
  flex-direction: column;
  gap: 12rpx;

  &:last-child { border-bottom: none; padding-bottom: 24rpx; }
}

.num-label {
  font-size: 28rpx;
  color: $text-1;
  font-weight: 500;
  line-height: 1.4;
}

.num-main {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.num-input {
  flex: 1;
  height: 64rpx;
  background: #f7f8fa;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  min-width: 0;

  &:active { background: #eef0f3; }
}

.num-value {
  font-size: 28rpx;
  color: $text-1;
  font-weight: 500;
}

.num-unit {
  font-size: 24rpx;
  color: $text-3;
  flex-shrink: 0;
}

.num-edit {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 10rpx 20rpx;
  font-size: 24rpx;
  color: #0066ff;
  border: 1rpx solid #d0e3ff;
  border-radius: 8rpx;
  background: #fff;
  flex-shrink: 0;

  &:active { opacity: 0.6; }
}

.num-range {
  font-size: 22rpx;
  color: $text-3;
}
</style>
