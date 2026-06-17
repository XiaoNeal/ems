<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar title="策略配置" :autoBack="true" :placeholder="true">
    </u-navbar>

    <!-- 导航栏占位层 -->
    <!-- <view class="navbar-placeholder"></view> -->

    <!-- 内容区域 -->
    <view class="content">
      <!-- 非编辑模式遮罩层（仅在配置模式下生效） -->
      <view class="content-mask" v-if="!showStatus && !isEditing"></view>

      <!-- 模式选择 - 合并后的统一区域 -->
      <view class="mode-section" v-if="!showStatus">
        <view class="mode-header">
          <text class="section-title">{{ showStatus ? '状态参数' : '运行模式' }}</text>
          <view class="edit-config-btn" :class="{ disabled: !configurable }" @click="handleEditConfig">
            <text class="edit-icon">✎</text>
            <text>{{ isEditing ? '取消编辑' : '修改配置' }}</text>
          </view>
        </view>
        <view class="mode-buttons">
          <view class="mode-btn" :class="{ active: activeMode === 'peakValley' }" @click="switchMode('peakValley')">峰谷运行
          </view>
          <view class="mode-btn" :class="{ active: activeMode === 'flexControl' }" @click="switchMode('flexControl')">
            柔性控制</view>
          <view class="mode-btn" :class="{ active: activeMode === 'aiStrategy' }" @click="switchMode('aiStrategy')">AI策略
          </view>
        </view>
        <view class="mode-buttons">
          <view class="mode-btn" :class="{ active: activeMode === 'selfUse' }" @click="switchMode('selfUse')">自发自用
          </view>
          <view class="mode-btn" :class="{ active: activeMode === 'dischargeFirst' }"
            @click="switchMode('dischargeFirst')">放电优先</view>
          <view class="mode-btn" :class="{ active: activeMode === 'peakShaving' }" @click="switchMode('peakShaving')">
            削峰填谷</view>
        </view>
        <view class="mode-buttons">
          <view class="mode-btn" :class="{ active: activeMode === 'sellFirst' }" @click="switchMode('sellFirst')">售电优先
          </view>
          <view class="mode-btn" :class="{ active: activeMode === 'limitLoad' }" @click="switchMode('limitLoad')">限制负荷
          </view>
          <view class="mode-btn" :class="{ active: activeMode === 'zeroExport' }" @click="switchMode('zeroExport')">零出口
          </view>
        </view>
      </view>

      <!-- 星期选择 -->
      <view class="week-section" v-if="!showStatus">
        <text class="section-title">星期选择</text>
        <view class="week-selector" @click.stop="showWeekPicker">
          <text class="week-text">{{ selectedWeekText }}</text>
          <view class="arrow-icon" v-if="isEditing">
            <view class="arrow-right"></view>
          </view>
        </view>
      </view>

      <!-- 充放电时段设置 -->
      <view class="time-section" v-if="!showStatus">
        <view class="time-section-header">
          <text class="section-title">充、放电时间设置</text>
          <text class="add-time-link" v-if="isEditing" @click="addTimeSlot">添加时段</text>
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
              <picker mode="time" :value="slot.startTime" @change="(e) => updateStartTime(index, e)">
                <view class="time-picker">
                  <text>{{ slot.startTime || '00:00' }}</text>
                  <text class="picker-arrow">▼</text>
                </view>
              </picker>
            </view>
            <view class="td-time">
              <picker mode="time" :value="slot.endTime" @change="(e) => updateEndTime(index, e)">
                <view class="time-picker">
                  <text>{{ slot.endTime || '00:00' }}</text>
                  <text class="picker-arrow">▼</text>
                </view>
              </picker>
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
              <input type="digit" v-model="slot.power" class="power-input" placeholder="0.00" />
            </view>
            <view class="td-delete">
              <view class="delete-btn" @click="deleteTimeSlot(index)">删除</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 状态显示区域 -->
      <view v-if="showStatus">
        <!-- 状态参数头部 -->
        <view class="mode-section">
          <view class="mode-header">
            <text class="section-title">状态参数</text>
            <view class="edit-config-btn" :class="{ disabled: !configurable }" @click="handleEditConfig">
              <text class="edit-icon">✎</text>
              <text>{{ isEditing ? '取消编辑' : '修改配置' }}</text>
            </view>
          </view>
        </view>

        <!-- 状态参数分组 -->
        <view class="status-group" v-for="(group, index) in statusGroups" :key="index">
          <view class="status-group-header">
            <text class="status-group-title">{{ group.title }}</text>
          </view>
          <!-- 普通参数显示（键值对形式） -->
          <template v-if="group.type === 'normal'">
            <!-- 表格头部 -->
            <view class="status-table-header">
              <view class="status-th-name">参数名称</view>
              <view class="status-th-value">参数值</view>
            </view>
            <!-- 参数列表 -->
            <view class="status-table-body">
              <view class="status-row" v-for="param in group.params" :key="param.key">
                <view class="status-td-name">{{ param.name }}</view>
                <view class="status-td-value">{{ getControlDataValue(param.key) }}</view>
              </view>
            </view>
          </template>
          <!-- 策略参数显示（表格形式） -->
          <template v-else-if="group.type === 'strategy'">
            <!-- 星期选择（如果有） -->
            <view class="weekday-row" v-if="group.weekday">
              <view class="weekday-item" v-for="(day, index) in group.weekday.days" :key="day">
                <view class="weekday-name">{{ day }}</view>
                <view class="weekday-value">{{ getWeekdayValue(group.weekday.keys[index]) }}</view>
              </view>
            </view>
            <!-- 表格头部 -->
            <view class="strategy-table-header">
              <view class="strategy-th-name">名称</view>
              <view class="strategy-th-power" v-if="group.params[0] && group.params[0].powerKey">功率(kW)</view>
              <view class="strategy-th-enabled">启用</view>
              <view class="strategy-th-time">开始时间</view>
              <view class="strategy-th-time">停止时间</view>
            </view>
            <!-- 参数列表 -->
            <view class="strategy-table-body">
              <view class="strategy-row" v-for="param in group.params" :key="param.key">
                <view class="strategy-td-name">{{ param.name }}</view>
                <view class="strategy-td-power" v-if="param.powerKey">{{ getControlDataValue(param.powerKey) }}</view>
                <view class="strategy-td-enabled">{{ getEnabledValue(param.enabledKey) }}</view>
                <view class="strategy-td-time">{{ getTimeValue(param.startHourKey, param.startMinKey) }}</view>
                <view class="strategy-td-time">{{ getTimeValue(param.endHourKey, param.endMinKey) }}</view>
              </view>
            </view>
          </template>
          <!-- 星期参数简化显示 -->
          <template v-else-if="group.type === 'weekday'">
            <view class="weekday-row">
              <view class="weekday-item" v-for="day in ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']" :key="day">
                <view class="weekday-name">{{ day }}</view>
                <view class="weekday-value">--</view>
              </view>
            </view>
          </template>
          <!-- 默认显示（键值对形式） -->
          <template v-else>
            <!-- 表格头部 -->
            <view class="status-table-header">
              <view class="status-th-name">参数名称</view>
              <view class="status-th-value">参数值</view>
            </view>
            <!-- 参数列表 -->
            <view class="status-table-body">
              <view class="status-row" v-for="param in group.params" :key="param.key">
                <view class="status-td-name">{{ param.name }}</view>
                <view class="status-td-value">{{ param.value }}</view>
              </view>
            </view>
          </template>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="save-section" v-if="!showStatus && isEditing">
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
          <view class="week-option" v-for="(day, index) in weekDays" :key="index" @click="toggleWeekDay(index)">
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
          <view class="action-option" :class="{ selected: tempAction === 'charge' }" @click="selectAction('charge')">
            <text class="action-option-text charge">充电</text>
          </view>
          <view class="action-option" :class="{ selected: tempAction === 'discharge' }"
            @click="selectAction('discharge')">
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
import { realtimeDataProvider } from '@/service/websocket'

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
      modeData: {},
      configurable: true, // 是否可配置
      isEditing: false, // 是否处于编辑模式
      showStatus: true, // 是否显示状态模式（默认显示状态）
      statusGroups: [], // 状态参数分组数据
      deviceList: [] // 设备列表
    }
  },
  mounted() {
    this.loadStrategyConfig()
    this.initRealtimeData() // 初始化实时数据
    this.loadStatusData() // 默认加载状态数据
  },
  beforeUnmount() {
    // 页面卸载时取消注册
    realtimeDataProvider.unregister()
  },
  computed: {
    selectedWeekDays() {
      if (!this.modeData[this.activeMode]) return [0, 1, 2, 3, 4, 5, 6]
      return this.modeData[this.activeMode].selectedWeekDays || [0, 1, 2, 3, 4, 5, 6]
    },
    timeSlots() {
      if (!this.modeData[this.activeMode]) return []
      return this.modeData[this.activeMode].timeSlots || []
    },
    selectedWeekText() {
      const days = this.selectedWeekDays
      if (days.length === 7) return '每天'
      if (days.length === 0) return '请选择'
      return days.map(i => this.weekDays[i]).join('、')
    },
    // 获取 171F 设备
    device171F() {
      const deviceList = realtimeDataProvider.getDeviceList()
      return deviceList.find(item => item && item.deviceType.includes('171F'))
    }
  },
  methods: {
    switchMode(mode) {
      this.activeMode = mode
    },
    handleEditConfig() {
      if (!this.configurable) {
        uni.showToast({
          title: '当前不可配置',
          icon: 'none'
        })
        return
      }
      if (this.isEditing) {
        // 退出编辑模式，回到状态显示
        this.isEditing = false
        this.showStatus = true
        uni.showToast({
          title: '已退出编辑模式',
          icon: 'none'
        })
      } else {
        // 进入编辑模式，显示配置界面
        this.isEditing = true
        this.showStatus = false
        uni.showToast({
          title: '进入编辑模式',
          icon: 'none'
        })
      }
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
      if (!this.modeData[this.activeMode]) {
        this.$set(this.modeData, this.activeMode, {
          selectedWeekDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlots: []
        })
      }
      const newTimeType = this.modeData[this.activeMode].timeSlots.length + 1
      this.modeData[this.activeMode].timeSlots.push({
        timeType: newTimeType,
        startTime: '',
        endTime: '',
        action: 'charge',
        power: ''
      })
    },
    deleteTimeSlot(index) {
      if (this.modeData[this.activeMode]) {
        this.modeData[this.activeMode].timeSlots.splice(index, 1)
        // 重新编号
        this.modeData[this.activeMode].timeSlots.forEach((slot, i) => {
          slot.timeType = i + 1
        })
      }
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
      if (this.currentSlotIndex > -1 && this.modeData[this.activeMode]) {
        this.modeData[this.activeMode].timeSlots[this.currentSlotIndex].action = action
      }
      this.closeActionPicker()
    },
    updateStartTime(index, e) {
      if (this.modeData[this.activeMode]) {
        this.modeData[this.activeMode].timeSlots[index].startTime = e.detail.value
      }
    },
    updateEndTime(index, e) {
      if (this.modeData[this.activeMode]) {
        this.modeData[this.activeMode].timeSlots[index].endTime = e.detail.value
      }
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
        const currentDevice = this.$store.state.currentSelectDevice || {}
        const areaLevelId = currentDevice.areaLevelId
        const response = await request({
          url: '/api/energyStation/getEsStrategyConfig',
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

      console.log(data, "data")
      // 初始化所有模式的默认数据
      const modeKeys = Object.keys(this.modeToStrategyType)
      modeKeys.forEach(mode => {
        this.$set(this.modeData, mode, {
          selectedWeekDays: [0, 1, 2, 3, 4, 5, 6],
          timeSlots: []
        })
      })

      if (data.strategyTypes && data.strategyTypes.length > 0) {
        data.strategyTypes.forEach(strategy => {
          const strategyType = strategy.strategyType
          // 找到对应的模式
          for (const [mode, type] of Object.entries(this.modeToStrategyType)) {
            if (type === strategyType) {
              // 设置为当前激活模式（第一个匹配的）
              if (!this.activeMode) {
                this.activeMode = mode
              }
              // 设置星期
              if (strategy.daysOfWeek) {
                const days = strategy.daysOfWeek.split(',').map(Number)
                this.modeData[mode].selectedWeekDays = days.map(d => d - 1) // 转换为0-based索引
              }
              // 设置时间配置
              if (strategy.timeConfig) {
                this.modeData[mode].timeSlots = strategy.timeConfig.map(config => ({
                  timeType: config.timeType,
                  startTime: config.startTime,
                  endTime: config.endTime,
                  action: config.action === 1 ? 'charge' : 'discharge',
                  power: String(config.power)
                }))
              }
              break
            }
          }
        })
      }
    },
    // 保存策略配置
    async saveStrategyConfig() {
      try {

        console.log(this.$store.state, "99999999999999")
        const currentDevice = this.$store.state.currentSelectDevice || {}
        const areaLevelId = currentDevice.areaLevelId
        // 构建请求数据
        const requestData = {
          areaLevelId: areaLevelId,
          strategyType: this.modeToStrategyType[this.activeMode],
          daysOfWeek: this.selectedWeekDays.map(d => d + 1).join(','), // 转换为1-based索引
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
    },
    // 初始化实时数据
    initRealtimeData() {
      const device171F = {
        deviceType: '171F',
        address: '01',
        barCode: '00 00 02 20 26 05 18 15 21 04 02 00 00 00 00',
        deviceId: '171F',
        name: 'DCDC设备'
      };
      realtimeDataProvider.initDeviceList([device171F])
      this.deviceList = realtimeDataProvider.getDeviceList()
      console.log('deviceList---------------------------', this.deviceList)
    },
    // 加载状态数据
    async loadStatusData() {
      try {
        this.statusGroups = [
          {
            title: '基本策略参数',
            type: 'normal',
            params: [
              { key: 'B14', name: '运行策略' },
              { key: 'B16', name: '电池优先策略的目标SOC值' },
              { key: 'B18', name: '售卖优先策略（是否卖储能电）' },
              { key: 'B20', name: '限制消费策略功率' },
              { key: 'B22', name: '启动防逆流' },
              { key: 'B24', name: '防逆流服务端交流总表功率' },
              { key: 'B28', name: '防逆流服务端控制能源站数量' },
              { key: 'B32', name: '防逆流电网侧目标功率' },
              { key: 'B34', name: '防逆流电网侧目标功率上下边界波动幅度' }
            ]
          },
          {
            title: '削峰填谷策略',
            type: 'strategy',
            weekday: { keys: ['B38', 'B40', 'B42', 'B44', 'B46', 'B48', 'B50'], days: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'] },
            params: [
              { key: 'B52-B62', name: '削峰填谷策略1', enabledKey: 'B54', startHourKey: 'B56', startMinKey: 'B58', endHourKey: 'B60', endMinKey: 'B62' },
              { key: 'B64-B74', name: '削峰填谷策略2', enabledKey: 'B66', startHourKey: 'B68', startMinKey: 'B70', endHourKey: 'B72', endMinKey: 'B74' },
              { key: 'B76-B86', name: '削峰填谷策略3', enabledKey: 'B78', startHourKey: 'B80', startMinKey: 'B82', endHourKey: 'B84', endMinKey: 'B86' },
              { key: 'B88-B98', name: '削峰填谷策略4', enabledKey: 'B90', startHourKey: 'B92', startMinKey: 'B94', endHourKey: 'B96', endMinKey: 'B98' },
              { key: 'B100-B110', name: '削峰填谷策略5', enabledKey: 'B102', startHourKey: 'B104', startMinKey: 'B106', endHourKey: 'B108', endMinKey: 'B110' },
              { key: 'B112-B122', name: '削峰填谷策略6', enabledKey: 'B114', startHourKey: 'B116', startMinKey: 'B118', endHourKey: 'B120', endMinKey: 'B122' }
            ]
          },
          {
            title: '峰谷策略',
            type: 'strategy',
            weekday: { keys: ['B126', 'B128', 'B130', 'B132', 'B134', 'B136', 'B138'], days: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'] },
            params: [
              { key: 'B140-B152', name: '峰谷策略1', powerKey: 'B142', enabledKey: 'B144', startHourKey: 'B146', startMinKey: 'B148', endHourKey: 'B150', endMinKey: 'B152' },
              { key: 'B154-B166', name: '峰谷策略2', powerKey: 'B156', enabledKey: 'B158', startHourKey: 'B160', startMinKey: 'B162', endHourKey: 'B164', endMinKey: 'B166' },
              { key: 'B168-B180', name: '峰谷策略3', powerKey: 'B170', enabledKey: 'B172', startHourKey: 'B174', startMinKey: 'B176', endHourKey: 'B178', endMinKey: 'B180' },
              { key: 'B182-B194', name: '峰谷策略4', powerKey: 'B184', enabledKey: 'B186', startHourKey: 'B188', startMinKey: 'B190', endHourKey: 'B192', endMinKey: 'B194' },
              { key: 'B196-B208', name: '峰谷策略5', powerKey: 'B198', enabledKey: 'B200', startHourKey: 'B202', startMinKey: 'B204', endHourKey: 'B206', endMinKey: 'B208' },
              { key: 'B210-B222', name: '峰谷策略6', powerKey: 'B212', enabledKey: 'B214', startHourKey: 'B216', startMinKey: 'B218', endHourKey: 'B220', endMinKey: 'B222' }
            ]
          }
        ]
      } catch (error) {
        console.error('加载状态数据失败:', error)
      }
    },
    // 获取控制数据值
    getControlDataValue(key) {
      if (!this.device171F || !this.device171F.controlData) return '--'
      const data = this.device171F.controlData[key]
      if (!data || data.value === '--') return '--'

      // B18 字段特殊转换：1出售储能电，0不出售储能电
      if (key === 'B18') {
        return data.value == 1 ? '出售储能电' : (data.value == 0 ? '不出售储能电' : data.value)
      }

      // B20 限制消费策略中PCS设定功率值，单位：kW
      if (key === 'B20') {
        return `${data.value} kW`
      }

      // B22 字段特殊转换：1启动防逆流功能，其他不启动防逆流
      if (key === 'B22') {
        return data.value == 1 ? '启动防逆流功能' : '不启动防逆流'
      }

      // B24 防逆流服务端交流总表功率，单位：W
      if (key === 'B24') {
        return `${data.value} W`
      }

      // B28 防逆流服务端控制能源站数量，单位：台
      if (key === 'B28') {
        return `${data.value} 台`
      }

      // B32 防逆流电网侧目标功率，单位：kW
      if (key === 'B32') {
        return `${data.value} kW`
      }

      // B34 防逆流电网侧目标功率上下边界波动幅度，单位：kW
      if (key === 'B34') {
        return `${data.value} kW`
      }

      return data.value
    },
    // 获取星期值
    getWeekdayValue(key) {
      if (!key) return '--'
      const value = this.getControlDataValue(key)
      return value !== '--' ? (value == 1 ? '是' : '否') : '--'
    },
    // 获取时间值
    getTimeValue(hourKey, minKey) {
      if (!hourKey || !minKey) return '--'
      const hour = this.getControlDataValue(hourKey)
      const min = this.getControlDataValue(minKey)
      if (hour === '--' || min === '--') return '--'
      return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
    },
    // 获取启用状态值
    getEnabledValue(key) {
      const value = this.getControlDataValue(key)
      return value !== '--' ? (value == 1 ? '是' : '否') : '--'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.navbar-placeholder {
  height: calc(env(safe-area-inset-top) + 88rpx);
}

.content {
  padding: 20rpx;
  position: relative;
  box-sizing: border-box;
}

.content-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: transparent;
  pointer-events: auto;
}

/* 模式选择 */
.mode-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.mode-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  padding: 8rpx 20rpx;
  font-size: 24rpx;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 16rpx;
  transition: all 0.3s ease;

  &.active {
    background-color: #6699ff;
    color: #fff;
  }
}

.edit-config-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  background-color: #6699ff;
  color: #fff;
  border-radius: 24rpx;
  font-size: 26rpx;
  transition: all 0.3s ease;
  position: relative;
  // z-index: 100;

  &:active {
    transform: scale(0.95);
    background-color: #4488fb;
  }

  &.disabled {
    background-color: #e8e8e8;
    color: #999;
    pointer-events: none;
  }
}

.edit-icon {
  font-size: 24rpx;
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

  &.disabled {
    pointer-events: none;

    .arrow-right {
      opacity: 0.3;
    }
  }
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

  &.disabled {
    color: #999;
    pointer-events: none;
  }
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

.time-picker {
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
  display: flex;
  align-items: center;
  justify-content: center;

  &.disabled {
    background-color: #fafafa;
    color: #999;
  }
}

.time-picker:active {
  background-color: #fff;
  border-color: #1890ff;
}

.picker-arrow {
  font-size: 16rpx;
  color: #999;
  margin-left: 8rpx;

  &.hidden {
    display: none;
  }
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

  &.disabled {
    pointer-events: none;
    opacity: 0.6;
  }
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

  &.hidden {
    display: none;
  }
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

  &.disabled {
    background-color: #fafafa;
    color: #999;
  }
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

  &.disabled {
    color: #ccc;
    background-color: #fafafa;
    pointer-events: none;
  }
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
.week-popup,
.action-popup {
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

/* 状态分组显示 */
.status-group {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 0;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid #f0f0f0;
}

.status-group-header {
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: linear-gradient(135deg, #fafbfc 0%, #fff 100%);
}

.status-group-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
  position: relative;
  padding-left: 20rpx;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6rpx;
    height: 24rpx;
    background: linear-gradient(180deg, #1890ff 0%, #6699ff 100%);
    border-radius: 3rpx;
  }
}

/* 状态表格头部 */
.status-table-header {
  display: flex;
  padding: 20rpx 32rpx;
  background-color: #f8fafc;
  border-bottom: 1rpx solid #e8e8e8;
}

.status-th-name {
  flex: 2;
  font-size: 26rpx;
  color: #8c8c8c;
  font-weight: 500;
}

.status-th-value {
  flex: 1;
  font-size: 26rpx;
  color: #8c8c8c;
  font-weight: 500;
  text-align: right;
}

/* 状态表格内容 */
.status-table-body {
  padding: 0;
}

.status-row {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:nth-child(even) {
    background-color: #fafbfc;
  }

  &:active {
    background-color: #f0f5ff;
  }
}

.status-td-name {
  flex: 2;
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
}

.status-td-value {
  flex: 1;
  font-size: 28rpx;
  color: #666;
  text-align: right;
  font-weight: 500;
  padding-left: 20rpx;
}

/* 策略表格头部 */
.strategy-table-header {
  display: flex;
  padding: 20rpx 32rpx;
  background-color: #f8fafc;
  border-bottom: 1rpx solid #e8e8e8;
}

.strategy-th-name {
  flex: 1.5;
  font-size: 26rpx;
  color: #8c8c8c;
  font-weight: 500;
}

.strategy-th-power {
  flex: 1;
  font-size: 26rpx;
  color: #8c8c8c;
  font-weight: 500;
  text-align: center;
}

.strategy-th-enabled {
  flex: 0.8;
  font-size: 26rpx;
  color: #8c8c8c;
  font-weight: 500;
  text-align: center;
}

.strategy-th-time {
  flex: 1;
  font-size: 26rpx;
  color: #8c8c8c;
  font-weight: 500;
  text-align: center;
}

/* 策略表格内容 */
.strategy-table-body {
  padding: 0;
}

.strategy-row {
  display: flex;
  align-items: center;
  padding: 22rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:nth-child(even) {
    background-color: #fafbfc;
  }

  &:active {
    background-color: #f0f5ff;
  }
}

.strategy-td-name {
  flex: 1.5;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.strategy-td-power {
  flex: 1;
  font-size: 28rpx;
  color: #666;
  text-align: center;
  font-weight: 500;
}

.strategy-td-enabled {
  flex: 0.8;
  font-size: 26rpx;
  color: #666;
  text-align: center;

  &.enabled {
    color: #52c41a;
    font-weight: 500;
  }

  &.disabled {
    color: #999;
  }
}

.strategy-td-time {
  flex: 1;
  font-size: 26rpx;
  color: #666;
  text-align: center;
  font-family: 'Monaco', 'Menlo', monospace;
}

/* 星期参数简化显示 */
.weekday-row {
  display: flex;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  background-color: #f8fafc;
  border-bottom: 1rpx solid #e8e8e8;
}

.weekday-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70rpx;
  padding: 12rpx 8rpx;
  border-radius: 8rpx;
  transition: background-color 0.2s ease;

  &.active {
    background-color: #e6f7ff;
  }
}

.weekday-name {
  font-size: 24rpx;
  color: #8c8c8c;
  margin-bottom: 10rpx;
}

.weekday-value {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}
</style>
