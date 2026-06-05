<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar title="策略配置" :autoBack="true" :placeholder="true">
    </u-navbar>
    
    <!-- 内容区域 -->
    <view class="content">
      <!-- 模式选择 - 合并后的统一区域 -->
      <view class="mode-section">
        <view class="mode-buttons">
          <view 
            class="mode-btn" 
            :class="{ active: activeMode === 'peakValley' }"
            @click="switchMode('peakValley')"
          >峰谷运行</view>
          <view 
            class="mode-btn" 
            :class="{ active: activeMode === 'flexControl' }"
            @click="switchMode('flexControl')"
          >柔性控制</view>
          <view 
            class="mode-btn" 
            :class="{ active: activeMode === 'aiStrategy' }"
            @click="switchMode('aiStrategy')"
          >AI策略</view>
        </view>
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
          <view class="arrow-icon">
            <view class="arrow-right"></view>
          </view>
        </view>
      </view>
      
      <!-- 充放电时段设置 -->
      <view class="time-section">
        <view class="time-section-header">
          <text class="section-title">充、放电时间设置</text>
          <text class="add-time-link" @click="addTimeSlot">添加时段</text>
        </view>
        
        <!-- 表格头部 -->
        <view class="time-table-header">
          <view class="th-name">时段</view>
          <view class="th-time">起始</view>
          <view class="th-time">结束</view>
          <view class="th-action">动作</view>
          <view class="th-power">功率(kW)</view>
          <view class="th-delete">操作</view>
        </view>
        
        <!-- 时段列表 -->
        <view class="time-table-body">
          <view class="time-row" v-for="(slot, index) in timeSlots" :key="index">
            <view class="td-name">时段{{ slot.timeType }}</view>
            <view class="td-time">
              <input 
                type="text" 
                v-model="slot.startTime" 
                class="time-input" 
                placeholder="00:00"
              />
            </view>
            <view class="td-time">
              <input 
                type="text" 
                v-model="slot.endTime" 
                class="time-input" 
                placeholder="00:00"
              />
            </view>
            <view class="td-action">
              <view class="action-select" @click="showActionPicker(index)">
                <text :class="['action-text', slot.action === 'discharge' ? 'discharge' : 'charge']">
                  {{ slot.action === 'charge' ? '充电' : '放电' }}
                </text>
                <text class="arrow-down">▼</text>
              </view>
            </view>
            <view class="td-power">
              <input 
                type="digit" 
                v-model="slot.power" 
                class="power-input" 
                placeholder="0.00"
              />
            </view>
            <view class="td-delete">
              <view class="delete-btn" @click="deleteTimeSlot(index)">删除</view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 保存按钮 -->
      <view class="save-section">
        <button class="save-btn" @click="showConfirmModal">保存配置</button>
      </view>
    </view>
    
    <!-- 星期选择弹窗 -->
    <u-popup :show="showWeekPopup" mode="bottom" @close="closeWeekPicker" :round="16">
      <view class="week-popup">
        <view class="popup-header-center">
          <text class="popup-title">星期选择</text>
        </view>
        <view class="week-options">
          <view 
            class="week-option" 
            v-for="(day, index) in weekDays" 
            :key="index"
            @click="toggleWeekDay(index)"
          >
            <text class="week-day-text">{{ day }}</text>
            <view class="check-box" :class="{ checked: selectedWeekDays.includes(index) }">
              <text class="check-mark" v-if="selectedWeekDays.includes(index)">✓</text>
            </view>
          </view>
        </view>
        <view class="popup-footer">
          <text class="footer-btn cancel" @click="closeWeekPicker">取消</text>
          <text class="footer-btn confirm" @click="closeWeekPicker">确定</text>
        </view>
      </view>
    </u-popup>
    
    <!-- 动作选择弹窗 -->
    <u-popup :show="showActionPopup" mode="bottom" @close="closeActionPicker" :round="16">
      <view class="action-popup">
        <view class="popup-header">
          <text class="popup-title">选择动作</text>
          <text class="popup-close" @click="closeActionPicker">取消</text>
        </view>
        <view class="action-options">
          <view 
            class="action-option" 
            :class="{ selected: tempAction === 'charge' }"
            @click="selectAction('charge')"
          >
            <text class="action-option-text charge">充电</text>
          </view>
          <view 
            class="action-option" 
            :class="{ selected: tempAction === 'discharge' }"
            @click="selectAction('discharge')"
          >
            <text class="action-option-text discharge">放电</text>
          </view>
        </view>
      </view>
    </u-popup>
    
    <!-- 确认下发弹窗 -->
    <view class="confirm-modal" v-if="showConfirmDialog" @click="closeConfirmModal">
      <view class="confirm-content" @click.stop>
        <text class="confirm-title">是否下发当前指令</text>
        <view class="confirm-buttons">
          <button class="confirm-btn cancel" @click="closeConfirmModal">退出</button>
          <button class="confirm-btn submit" @click="confirmSave">下发指令</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
  data() {
    return {
      activeMode: 'peakValley',
      showWeekPopup: false,
      showActionPopup: false,
      showConfirmDialog: false,
      currentSlotIndex: -1,
      tempAction: '',
      weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // 模式到策略类型的映射
      modeToStrategyType: {
        peakValley: 1,
        flexControl: 2,
        aiStrategy: 3,
        selfUse: 4,
        dischargeFirst: 5,
        peakShaving: 6,
        sellFirst: 7,
        limitLoad: 8,
        zeroExport: 9
      },
      modeData: {
        peakValley: {
          selectedWeekDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlots: [
            { timeType: 1, startTime: '08:00', endTime: '10:00', action: 'charge', power: '13.00' },
            { timeType: 2, startTime: '10:00', endTime: '20:00', action: 'discharge', power: '25.00' },
            { timeType: 3, startTime: '20:00', endTime: '00:00', action: 'charge', power: '100.00' }
          ]
        },
        flexControl: {
          selectedWeekDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlots: [
            { timeType: 1, startTime: '08:00', endTime: '10:00', action: 'charge', power: '13.00' },
            { timeType: 2, startTime: '10:00', endTime: '20:00', action: 'discharge', power: '25.00' },
            { timeType: 3, startTime: '20:00', endTime: '00:00', action: 'charge', power: '100.00' }
          ]
        },
        aiStrategy: {
          selectedWeekDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlots: [
            { timeType: 1, startTime: '08:00', endTime: '10:00', action: 'charge', power: '13.00' },
            { timeType: 2, startTime: '10:00', endTime: '20:00', action: 'discharge', power: '25.00' },
            { timeType: 3, startTime: '20:00', endTime: '00:00', action: 'charge', power: '100.00' }
          ]
        },
        selfUse: {
          selectedWeekDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlots: [
            { timeType: 1, startTime: '08:00', endTime: '10:00', action: 'charge', power: '13.00' },
            { timeType: 2, startTime: '10:00', endTime: '20:00', action: 'discharge', power: '25.00' },
            { timeType: 3, startTime: '20:00', endTime: '00:00', action: 'charge', power: '100.00' }
          ]
        },
        dischargeFirst: {
          selectedWeekDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlots: [
            { timeType: 1, startTime: '08:00', endTime: '10:00', action: 'charge', power: '13.00' },
            { timeType: 2, startTime: '10:00', endTime: '20:00', action: 'discharge', power: '25.00' },
            { timeType: 3, startTime: '20:00', endTime: '00:00', action: 'charge', power: '100.00' }
          ]
        },
        peakShaving: {
          selectedWeekDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlots: [
            { timeType: 1, startTime: '08:00', endTime: '10:00', action: 'charge', power: '13.00' },
            { timeType: 2, startTime: '10:00', endTime: '20:00', action: 'discharge', power: '25.00' },
            { timeType: 3, startTime: '20:00', endTime: '00:00', action: 'charge', power: '100.00' }
          ]
        },
        sellFirst: {
          selectedWeekDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlots: [
            { timeType: 1, startTime: '08:00', endTime: '10:00', action: 'charge', power: '13.00' },
            { timeType: 2, startTime: '10:00', endTime: '20:00', action: 'discharge', power: '25.00' },
            { timeType: 3, startTime: '20:00', endTime: '00:00', action: 'charge', power: '100.00' }
          ]
        },
        limitLoad: {
          selectedWeekDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlots: [
            { timeType: 1, startTime: '08:00', endTime: '10:00', action: 'charge', power: '13.00' },
            { timeType: 2, startTime: '10:00', endTime: '20:00', action: 'discharge', power: '25.00' },
            { timeType: 3, startTime: '20:00', endTime: '00:00', action: 'charge', power: '100.00' }
          ]
        },
        zeroExport: {
          selectedWeekDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlots: [
            { timeType: 1, startTime: '08:00', endTime: '10:00', action: 'charge', power: '13.00' },
            { timeType: 2, startTime: '10:00', endTime: '20:00', action: 'discharge', power: '25.00' },
            { timeType: 3, startTime: '20:00', endTime: '00:00', action: 'charge', power: '100.00' }
          ]
        }
      }
    }
  },
  mounted() {
    this.loadStrategyConfig()
  },
  computed: {
    selectedWeekDays() {
      return this.modeData[this.activeMode].selectedWeekDays
    },
    timeSlots() {
      return this.modeData[this.activeMode].timeSlots
    },
    selectedWeekText() {
      const days = this.modeData[this.activeMode].selectedWeekDays
      if (days.length === 7) return '每天'
      if (days.length === 0) return '请选择'
      return days.map(i => this.weekDays[i]).join('、')
    }
  },
  methods: {
    switchMode(mode) {
      this.activeMode = mode
    },
    showWeekPicker() {
      this.showWeekPopup = true
    },
    closeWeekPicker() {
      this.showWeekPopup = false
    },
    toggleWeekDay(index) {
      const pos = this.selectedWeekDays.indexOf(index)
      if (pos > -1) {
        this.selectedWeekDays.splice(pos, 1)
      } else {
        this.selectedWeekDays.push(index)
        this.selectedWeekDays.sort()
      }
    },
    addTimeSlot() {
      const newTimeType = this.timeSlots.length + 1
      this.timeSlots.push({
        timeType: newTimeType,
        startTime: '',
        endTime: '',
        action: 'charge',
        power: ''
      })
    },
    deleteTimeSlot(index) {
      this.timeSlots.splice(index, 1)
    },
    // 移除了 enabled 字段，该方法已不再需要
    toggleSlot(index) {
      // 预留方法，可根据需求扩展
    },
    showActionPicker(index) {
      this.currentSlotIndex = index
      this.tempAction = this.timeSlots[index].action
      this.showActionPopup = true
    },
    closeActionPicker() {
      this.showActionPopup = false
      this.currentSlotIndex = -1
    },
    selectAction(action) {
      if (this.currentSlotIndex > -1) {
        this.timeSlots[this.currentSlotIndex].action = action
      }
      this.closeActionPicker()
    },
    showConfirmModal() {
      this.showConfirmDialog = true
    },
    closeConfirmModal() {
      this.showConfirmDialog = false
    },
    confirmSave() {
      this.showConfirmDialog = false
      this.saveStrategyConfig()
    },
    // 加载策略配置
    async loadStrategyConfig() {
      try {
        const areaLevelId = this.$store.state.areaInfoId || 940
        const response = await request({
          url: '/api/energyStation/upsertEsStrategyConfig',
          method: 'GET',
          params: { areaLevelId }
        })
        if (response.status === 200 && response.data) {
          this.parseStrategyConfig(response.data)
        }
      } catch (error) {
        console.error('加载策略配置失败:', error)
      }
    },
    // 解析策略配置
    parseStrategyConfig(data) {
      if (data.strategyTypes && data.strategyTypes.length > 0) {
        const firstStrategy = data.strategyTypes[0]
        // 根据策略类型设置当前模式
        const strategyType = firstStrategy.strategyType
        for (const [mode, type] of Object.entries(this.modeToStrategyType)) {
          if (type === strategyType) {
            this.activeMode = mode
            break
          }
        }
        // 设置星期
        if (firstStrategy.daysOfWeek) {
          const days = firstStrategy.daysOfWeek.split(',').map(Number)
          this.modeData[this.activeMode].selectedWeekDays = days.map(d => d - 1) // 转换为0-based索引
        }
        // 设置时间配置
        if (firstStrategy.timeConfigs) {
          this.modeData[this.activeMode].timeSlots = firstStrategy.timeConfigs.map(config => ({
            timeType: config.timeType,
            startTime: config.startTime,
            endTime: config.endTime,
            action: config.action === 1 ? 'charge' : 'discharge',
            power: String(config.power)
          }))
        }
      }
    },
    // 保存策略配置
    async saveStrategyConfig() {
      try {

        console.log(this.$store.state,"99999999999999")
        
        // 构建请求数据
        const requestData = {
          areaLevelId: this.$store.state.areaInfoId || 940,
          strategyType: this.modeToStrategyType[this.activeMode],
          DaysOfWeek: this.selectedWeekDays.map(d => d + 1).join(','), // 转换为1-based索引
          timeConfigs: this.timeSlots.map(slot => ({
            timeType: slot.timeType,
            startTime: slot.startTime,
            endTime: slot.endTime,
            action: slot.action === 'charge' ? 1 : 2,
            power: parseFloat(slot.power) || 0
          }))
        }

        const response = await request({
          url: '/api/energyStation/upsertEsStrategyConfig',
          method: 'POST',
          data: requestData
        })

        if (response.status === 200) {
          uni.showToast({ title: '保存成功', icon: 'success' })
        } else {
          uni.showToast({ title: '保存失败', icon: 'error' })
        }
      } catch (error) {
        console.error('保存策略配置失败:', error)
        uni.showToast({ title: '保存失败', icon: 'error' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.content {
  padding: 20rpx;
}

/* 模式选择 */
.mode-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.mode-buttons {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.mode-buttons:last-child {
  margin-bottom: 0;
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
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.week-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  margin-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.week-text {
  font-size: 28rpx;
  color: #333;
}

.arrow-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-right {
  width: 12rpx;
  height: 12rpx;
  border-top: 2rpx solid #999;
  border-right: 2rpx solid #999;
  transform: rotate(45deg);
}

/* 时间设置 */
.time-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.time-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.add-time-link {
  font-size: 28rpx;
  color: #1890ff;
}

/* 表格头部 */
.time-table-header {
  display: flex;
  align-items: center;
  padding: 24rpx 16rpx;
  border-bottom: 2rpx solid #e8e8e8;
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
  background-color: #fafbfc;
  border-radius: 12rpx 12rpx 0 0;
}

.th-name {
  flex: 0 0 90rpx;
  text-align: center;
}

.th-time {
  flex: 1;
  text-align: center;
  min-width: 0;
}

.th-action {
  flex: 0 0 130rpx;
  text-align: center;
}

.th-power {
  flex: 0 0 130rpx;
  text-align: center;
}

.th-delete {
  flex: 0 0 90rpx;
  text-align: center;
}

/* 表格内容 */
.time-table-body {
  margin-top: 4rpx;
  background-color: #fff;
  border-radius: 0 0 12rpx 12rpx;
}

.time-row {
  display: flex;
  align-items: center;
  padding: 20rpx 16rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.2s;
}

.time-row:hover {
  background-color: #fafbfc;
}

.time-row:last-child {
  border-bottom: none;
}

.td-name {
  flex: 0 0 90rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.td-time {
  flex: 1;
  padding: 0 6rpx;
  min-width: 0;
}

.time-input {
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
  border: 1rpx solid transparent;
  transition: all 0.2s;
  box-sizing: border-box;
}

.time-input:focus {
  background-color: #fff;
  border-color: #1890ff;
}

.td-action {
  flex: 0 0 130rpx;
  display: flex;
  justify-content: center;
}

.action-select {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  padding: 8rpx 12rpx;
  background-color: #f5f7fa;
  border-radius: 8rpx;
  width: 100%;
  box-sizing: border-box;
}

.action-text {
  font-size: 26rpx;
  font-weight: 500;
}

.action-text.charge {
  color: #1890ff;
}

.action-text.discharge {
  color: #52c41a;
}

.arrow-down {
  font-size: 18rpx;
  color: #999;
}

.td-power {
  flex: 0 0 130rpx;
  padding: 0 6rpx;
}

.power-input {
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
  border: 1rpx solid transparent;
  transition: all 0.2s;
  box-sizing: border-box;
}

.power-input:focus {
  background-color: #fff;
  border-color: #1890ff;
}

.td-delete {
  flex: 0 0 90rpx;
  display: flex;
  justify-content: center;
}

.delete-btn {
  padding: 8rpx 16rpx;
  font-size: 24rpx;
  color: #ff4d4f;
  background-color: #fff2f0;
  border-radius: 6rpx;
  transition: all 0.2s;
}

.delete-btn:active {
  background-color: #ffccc7;
}

/* 保存按钮 */
.save-section {
  padding: 40rpx 20rpx;
}

.save-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #1890ff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  border: none;
}

/* 弹窗样式 */
.week-popup, .action-popup {
  background-color: #fff;
  border-radius: 24rpx 24rpx 0 0;
  // padding-bottom: constant(safe-area-inset-bottom);
  // padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.popup-close {
  font-size: 28rpx;
  color: #1890ff;
}

/* 居中标题头部 */
.popup-header-center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.week-options {
  padding: 20rpx 30rpx;
}

.week-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.week-option:last-child {
  border-bottom: none;
}

.week-day-text {
  font-size: 30rpx;
  color: #333;
}

/* 方框勾选样式 */
.check-box {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.check-box.checked {
  background-color: #1890ff;
  border-color: #1890ff;
}

.check-mark {
  color: #fff;
  font-size: 24rpx;
  font-weight: bold;
}

/* 底部按钮 */
.popup-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 40rpx 40rpx;
  border-top: 1rpx solid #f0f0f0;
}

.footer-btn {
  font-size: 30rpx;
  padding: 20rpx 40rpx;
}

.footer-btn.cancel {
  color: #999;
}

.footer-btn.confirm {
  color: #1890ff;
}

.action-options {
  padding: 20rpx 30rpx;
}

.action-option {
  padding: 30rpx;
  text-align: center;
  border-bottom: 1rpx solid #f5f5f5;
}

.action-option:last-child {
  border-bottom: none;
}

.action-option.selected {
  background-color: #f0f7ff;
}

.action-option-text {
  font-size: 30rpx;
}

.action-option-text.charge {
  color: #1890ff;
}

.action-option-text.discharge {
  color: #52c41a;
}

/* 确认弹窗 */
.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.confirm-content {
  width: 560rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
}

.confirm-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 40rpx;
  display: block;
}

.confirm-buttons {
  display: flex;
  gap: 20rpx;
}

.confirm-btn {
  flex: 1;
  height: 72rpx;
  line-height: 72rpx;
  font-size: 28rpx;
  border-radius: 8rpx;
  border: 1rpx solid #d9d9d9;
  background-color: #fff;
  color: #666;
}

.confirm-btn.submit {
  background-color: #fff;
  color: #1890ff;
  border-color: #1890ff;
}
</style>
