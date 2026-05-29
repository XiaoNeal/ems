<template>
  <view class="param-item">
    <text class="param-label">{{ param.name }}</text>
    <view class="param-input-wrap">
      <view class="param-input" :class="{ editing: isEditing }">
        <text v-if="!isEditing" class="param-value">{{ value || "--" }}</text>
        <input v-else type="number" :value="value" @input="handleInput" placeholder="请输入" focus />
      </view>
      <text class="param-unit">{{ param.unit }}</text>
    </view>
    <view class="param-actions">
      <view v-if="!isEditing" class="param-btn edit" @click="$emit('edit', param.key)">编辑</view>
      <template v-else>
        <view class="param-btn confirm" @click="handleSubmit">下发</view>
        <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
      </template>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ParamItem',
  props: {
    param: {
      type: Object,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: this.value
    }
  },
  methods: {
    handleInput(e) {
      this.inputValue = e.detail.value
    },
    handleSubmit() {
      this.$emit('submit', {
        key: this.param.key,
        name: this.param.name,
        value: this.inputValue
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.param-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  background: #fff;
  margin-bottom: 16rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.param-label {
  font-size: 28rpx;
  color: #333;
  flex: 1;
  margin-right: 20rpx;
}

.param-input-wrap {
  display: flex;
  align-items: center;
  gap: 6rpx;
  flex-shrink: 0;
}

.param-input {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 72rpx;
  padding: 0 20rpx;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
  border-radius: 12rpx;
  min-width: 200rpx;
}

.param-input.editing {
  background: #fff;
  border: 2rpx solid #4080FF;
}

.param-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.param-unit {
  font-size: 24rpx;
  color: #999;
  margin-left: 8rpx;
}

.param-actions {
  display: flex;
  gap: 16rpx;
  margin-left: 20rpx;
  flex-shrink: 0;
}

.param-btn {
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 500;
}

.param-btn.edit {
  background: linear-gradient(135deg, #4080FF 0%, #3060CC 100%);
  color: #fff;
}

.param-btn.confirm {
  background: linear-gradient(135deg, #52C41A 0%, #389E0D 100%);
  color: #fff;
}

.param-btn.cancel {
  background: #F5F5F5;
  color: #666;
}

.param-btn:active {
  opacity: 0.8;
}
</style>