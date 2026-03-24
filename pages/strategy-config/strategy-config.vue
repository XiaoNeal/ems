<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar title="策略配置" :autoBack="true" :placeholder="true">
    </u-navbar>
    
    <!-- 内容区域 -->
    <view class="content">
      <!-- 策略选择标签 -->
      <view class="strategy-tabs">
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 0 }"
          @click="switchTab(0)"
        >峰谷运行</view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 1 }"
          @click="switchTab(1)"
        >最佳效果</view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 2 }"
          @click="switchTab(2)"
        >AI策略</view>
      </view>
      
      <!-- 模式选择 -->
      <view class="mode-section">
        <view class="mode-buttons">
          <view 
            class="mode-btn" 
            :class="{ active: activeMode === 'selfUse' }"
            @click="switchMode('selfUse')"
          >自发自用</view>
          <view 
            class="mode-btn" 
            :class="{ active: activeMode === 'dischargeFirst' }"
            @click="switchMode('dischargeFirst')"
          >放电优先</view>
          <view 
            class="mode-btn" 
            :class="{ active: activeMode === 'peakShaving' }"
            @click="switchMode('peakShaving')"
          >削峰填谷</view>
        </view>
        <view class="mode-buttons">
          <view 
            class="mode-btn" 
            :class="{ active: activeMode === 'sellFirst' }"
            @click="switchMode('sellFirst')"
          >售电优先</view>
          <view 
            class="mode-btn" 
            :class="{ active: activeMode === 'limitLoad' }"
            @click="switchMode('limitLoad')"
          >限制负荷</view>
          <view 
            class="mode-btn" 
            :class="{ active: activeMode === 'zeroExport' }"
            @click="switchMode('zeroExport')"
          >零出口</view>
        </view>
      </view>
      
      <!-- 星期选择 -->
      <view class="week-section">
        <text class="section-title">星期选择</text>
        <view class="week-selector" @click.stop="showWeekPicker">
          <text class="week-text">{{ selectedWeekText }}</text>
          <text class="arrow-icon">></text>
        </view>
      </view>
      
      <!-- 充放电时段设置 -->
      <view class="time-section">
        <text class="section-title">充、放电时间设置</text>
        <view class="add-time-btn" @click="addTimeSlot">
          <text>+ 添加时段</text>
        </view>
        
        <!-- 时段列表 -->
        <view class="time-slots">
          <view class="time-slot" v-for="(slot, index) in timeSlots" :key="index">
            <view class="slot-header" @click.stop>
              <text class="slot-title">时段{{ index + 1 }}</text>
              <view class="slot-operate">
                <view class="checkbox-wrap" @click.stop="toggleSlot(index)">
                  <view class="checkbox" :class="{ checked: slot.enabled }"></view>
                </view>
                <text class="del-btn" @click.stop="deleteTimeSlot(index)">删除</text>
              </view>
            </view>
            <view class="slot-content" @click.stop>
              <view class="time-inputs">
                <view class="time-item">
                  <text class="time-label">起始</text>
                  <input 
                    type="text" 
                    v-model="slot.startTime" 
                    class="time-input" 
                    placeholder="00:00"
                    @click.stop
                  />
                </view>
                <view class="time-item">
                  <text class="time-label">结束</text>
                  <input 
                    type="text" 
                    v-model="slot.endTime" 
                    class="time-input" 
                    placeholder="00:00"
                    @click.stop
                  />
                </view>
              </view>
              <view class="action-selector">
                <text class="action-label">充放电</text>
                <view class="action-options">
                  <view 
                    class="action-option" 
                    :class="{ active: slot.action === 'charge' }"
                    @click.stop="setSlotAction(index, 'charge')"
                  >充电</view>
                  <view 
                    class="action-option" 
                    :class="{ active: slot.action === 'discharge' }"
                    @click.stop="setSlotAction(index, 'discharge')"
                  >放电</view>
                </view>
              </view>
              <view class="power-input">
                <text class="power-label">功率 (kW)</text>
                <input 
                  type="digit" 
                  v-model="slot.power" 
                  class="power-input-field" 
                  placeholder="请输入功率"
                  @click.stop
                />
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 保存按钮 -->
      <view class="save-btn" @click.stop="saveConfig">
        <text>✓</text>
      </view>
    </view>
    
    <!-- 星期选择弹窗 -->
    <view class="week-picker" v-if="showWeekPickerDialog" @click.stop="cancelWeekPicker">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-title">星期选择</text>
        </view>
        <view class="week-list">
          <view 
            class="week-item" 
            v-for="(day, index) in weekDays" 
            :key="index"
            @click.stop
          >
            <text class="week-name">{{ day.name }}</text>
            <view class="checkbox-wrap" @click.stop="toggleWeekDay(index)">
              <view class="week-checkbox" :class="{ checked: day.selected }"></view>
            </view>
          </view>
        </view>
        <view class="picker-footer">
          <view class="cancel-btn" @click.stop="cancelWeekPicker">取消</view>
          <view class="confirm-btn" @click.stop="confirmWeekPicker">确定</view>
        </view>
      </view>
    </view>

    <!-- 下发指令确认弹窗 -->
    <view class="confirm-dialog" v-if="showConfirmDialog" @click.stop>
      <view class="dialog-content">
        <text class="dialog-title">是否下发当前指令</text>
        <view class="dialog-buttons">
          <view class="dialog-btn cancel" @click.stop="closeConfirmDialog">退出</view>
          <view class="dialog-btn confirm" @click.stop="confirmSendCommand">下发指令</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "StrategyConfig",
  data() {
    return {
      activeTab: 0,
      activeMode: 'selfUse',
      showWeekPickerDialog: false,
      showConfirmDialog: false, // 新增：下发指令弹窗控制
      weekDays: [
        { name: '星期一', selected: true },
        { name: '星期二', selected: true },
        { name: '星期三', selected: true },
        { name: '星期四', selected: true },
        { name: '星期五', selected: true },
        { name: '星期六', selected: true },
        { name: '星期日', selected: true }
      ],
      timeSlots: [
        { enabled: true, startTime: '08:00', endTime: '10:00', action: 'charge', power: '15.00' },
        { enabled: true, startTime: '20:00', endTime: '23:00', action: 'charge', power: '25.00' },
        { enabled: true, startTime: '23:00', endTime: '00:00', action: 'charge', power: '100.00' }
      ]
    };
  },
  computed: {
    selectedWeekText() {
      this.$forceUpdate();
      const selectedDays = this.weekDays.filter(day => day.selected);
      
      if (selectedDays.length === 0) {
        return '请选择星期';
      }
      if (selectedDays.length === 7) {
        return '周一至周日';
      }
      
      const shortNames = selectedDays.map(day => {
        return day.name.replace('星期', '周');
      });
      return shortNames.join('、');
    }
  },
  methods: {
    switchTab(index) {
      this.activeTab = index;
    },
    switchMode(mode) {
      this.activeMode = mode;
    },
    showWeekPicker() {
      if (this.showWeekPickerDialog) return;
      this.showWeekPickerDialog = true;
      this.$nextTick(() => {
        uni.pageScrollTo({ scrollTop: 0, duration: 0 });
      });
    },
    cancelWeekPicker() {
      this.showWeekPickerDialog = false;
      uni.pageScrollTo({ scrollTop: 0, duration: 0 });
    },
    confirmWeekPicker() {
      this.weekDays = [...this.weekDays];
      this.showWeekPickerDialog = false;
      uni.showToast({
        title: `已选择${this.selectedWeekText}`,
        icon: 'none',
        duration: 1500
      });
    },
    toggleWeekDay(index) {
      this.$set(this.weekDays, index, {
        ...this.weekDays[index],
        selected: !this.weekDays[index].selected
      });
    },
    addTimeSlot() {
      this.timeSlots.push({
        enabled: true,
        startTime: '00:00',
        endTime: '00:00',
        action: 'charge',
        power: '0.00'
      });
    },
    deleteTimeSlot(index) {
      uni.showModal({
        title: '提示',
        content: '确定删除此时段吗？',
        success: (res) => {
          if (res.confirm) {
            this.timeSlots.splice(index, 1);
          }
        }
      });
    },
    toggleSlot(index) {
      this.$set(this.timeSlots, index, {
        ...this.timeSlots[index],
        enabled: !this.timeSlots[index].enabled
      });
    },
    setSlotAction(index, action) {
      this.$set(this.timeSlots, index, {
        ...this.timeSlots[index],
        action: action
      });
    },
    // 修改：保存配置先验证数据，再弹出下发确认弹窗
    saveConfig() {
      // 第一步：数据验证
      for (let i = 0; i < this.timeSlots.length; i++) {
        const slot = this.timeSlots[i];
        if (!slot.startTime || slot.startTime === '00:00' && !slot.endTime) {
          uni.showToast({ title: `时段${i+1}：请填写完整时间`, icon: 'none' });
          return;
        }
        if (!slot.power || Number(slot.power) <= 0) {
          uni.showToast({ title: `时段${i+1}：请输入有效功率`, icon: 'none' });
          return;
        }
      }

      // 第二步：验证通过，显示下发确认弹窗
      this.showConfirmDialog = true;
    },
    // 新增：关闭下发确认弹窗
    closeConfirmDialog() {
      this.showConfirmDialog = false;
    },
    // 新增：确认下发指令
    confirmSendCommand() {
      // 1. 关闭弹窗
      this.showConfirmDialog = false;
      
      // 2. 组装配置数据
      const config = {
        strategy: this.activeTab,
        mode: this.activeMode,
        weeks: this.weekDays,
        timeSlots: this.timeSlots
      };
      
      // 3. 模拟下发指令（实际项目中替换为真实接口调用）
      uni.showLoading({ title: '下发中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ 
          title: '指令下发成功', 
          icon: 'success',
          duration: 2000
        });
        console.log('下发的配置：', config);
      }, 1000);
    },
    refresh() {
      uni.showLoading({ title: '刷新中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '刷新成功', icon: 'success' });
      }, 800);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #EFF4FB;
}

.content {
  padding: 30rpx;
  flex: 1;
}

/* 策略标签 */
.strategy-tabs {
  display: flex;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 16rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.tab-item {
  flex: 1;
  padding: 24rpx 16rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  border-radius: 12rpx;
  transition: all 0.2s;
}

.tab-item.active {
  background-color: #1890ff;
  color: #fff;
}

/* 模式选择 */
.mode-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.mode-buttons {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.mode-btn {
  flex: 1;
  padding: 24rpx 12rpx;
  text-align: center;
  border-radius: 12rpx;
  font-size: 26rpx;
  background-color: #f5f7fa;
  color: #333;
  transition: all 0.2s;
}

.mode-btn.active {
  background-color: #1890ff;
  color: #fff;
}

/* 星期选择 */
.week-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.week-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background-color: #f9fafc;
  border-radius: 12rpx;
  touch-action: manipulation;
}

.week-text {
  font-size: 28rpx;
  color: #333;
}

.arrow-icon {
  font-size: 32rpx;
  color: #999;
}

/* 时间设置 */
.time-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.add-time-btn {
  background-color: #f0f7ff;
  border-radius: 12rpx;
  padding: 24rpx;
  text-align: center;
  font-size: 28rpx;
  color: #1890ff;
  margin-bottom: 30rpx;
  border: 1px dashed #1890ff;
}

.time-slots {
  margin-top: 20rpx;
}

.time-slot {
  border: 1px solid #e5e5e5;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-sizing: border-box;
}

.slot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.slot-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.slot-operate {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.checkbox-wrap {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #dcdfe6;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.checkbox.checked {
  background-color: #1890ff;
  border-color: #1890ff;
}

.checkbox.checked::after {
  content: '✓';
  color: #fff;
  font-size: 24rpx;
  font-weight: bold;
}

.del-btn {
  font-size: 24rpx;
  color: #ff4d4f;
}

.time-inputs {
  display: flex;
  gap: 30rpx;
  margin-bottom: 24rpx;
}

.time-item {
  flex: 1;
}

.time-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.time-input {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  border: 1px solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  pointer-events: auto;
  touch-action: manipulation;
  background-color: #fff;
}

.action-selector {
  margin-bottom: 24rpx;
}

.action-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.action-options {
  display: flex;
  gap: 20rpx;
}

.action-option {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  border: 1px solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
  touch-action: manipulation;
}

.action-option.active {
  background-color: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

.power-input {
  margin-top: 12rpx;
}

.power-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
}

.power-input-field {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  border: 1px solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  pointer-events: auto;
  touch-action: manipulation;
  background-color: #fff;
}

/* 悬浮保存按钮 */
.save-btn {
  position: fixed;
  bottom: 40rpx;
  right: 40rpx;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background-color: #1890ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  box-shadow: 0 6rpx 20rpx rgba(24, 144, 255, 0.4);
  z-index: 10;
}

/* 星期弹窗 */
.week-picker {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  z-index: 9999;
  overflow: hidden;
}

.picker-content {
  background-color: #fff;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  width: 100%;
  padding: 40rpx 30rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.picker-header {
  text-align: center;
  padding: 20rpx 0 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.picker-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

.week-list {
  padding: 20rpx 0;
}

.week-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f7fa;
}

.week-name {
  font-size: 30rpx;
  color: #333;
}

.week-checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #dcdfe6;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.week-checkbox.checked {
  background-color: #1890ff;
  border-color: #1890ff;
}

.week-checkbox.checked::after {
  content: '✓';
  color: #fff;
  font-size: 24rpx;
}

.picker-footer {
  display: flex;
  gap: 30rpx;
  margin-top: 40rpx;
}

.cancel-btn {
  flex: 1;
  padding: 24rpx;
  text-align: center;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  font-size: 30rpx;
  color: #666;
}

.confirm-btn {
  flex: 1;
  padding: 24rpx;
  text-align: center;
  background-color: #1890ff;
  border-radius: 12rpx;
  font-size: 30rpx;
  color: #fff;
}

/* 新增：下发指令确认弹窗样式（匹配截图） */
.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.dialog-content {
  width: 600rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 60rpx 40rpx;
  text-align: center;
}

.dialog-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 60rpx;
  display: block;
}

.dialog-buttons {
  display: flex;
  gap: 40rpx;
  justify-content: center;
}

.dialog-btn {
  width: 200rpx;
  padding: 20rpx 0;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.dialog-btn.cancel {
  border: 1px solid #e5e5e5;
  color: #666;
}

.dialog-btn.confirm {
  background-color: #1890ff;
  color: #fff;
}
</style>