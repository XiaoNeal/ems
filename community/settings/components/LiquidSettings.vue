<template>
  <view class="liquid-settings">
    <view class="param-card">
      <view class="card-header">
        <text class="card-title">液冷机参数设置</text>
        <view v-if="!isEditing" class="edit-btn primary" @click="handleEditConfig">
          <text class="edit-text">修改配置</text>
        </view>
        <view v-else class="action-btns">
          <view class="edit-btn close" @click="closeEdit">
            <text class="edit-text">关闭编辑</text>
          </view>
        </view>
      </view>

      <!-- 开关型参数 -->
      <view class="switch-section">
        <view v-for="param in liquidSwitchParams" :key="param.key" class="param-row">
          <view class="param-info">
            <text class="param-name">{{ param.label }}</text>
          </view>
          <view class="switch-btns-wrapper">
            <view class="switch-btns">
              <view v-for="option in param.options" :key="option.value" class="switch-btn" :class="[
                getParamValue(param.key) === option.label ? 'btn-active' : '',
                !isEditing ? 'btn-disabled' : '',
                clickedButton === param.key + '-' + option.value ? 'btn-clicked' : ''
              ]" @click="handleSwitchClick(param, option)">
                {{ option.label }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 数值型参数 -->
      <view class="divider"></view>
      <view class="param-list">
        <view v-for="param in liquidParams" :key="param.key" class="param-row"
          :class="{ 'editing-row': editingParam === param.key }">
          <view class="param-info">
            <text class="param-name">{{ param.label }}</text>
            <text v-if="param.min != null && param.max != null" class="param-range">
              范围: {{ param.min }}~{{ param.max }}{{ param.unit }}
            </text>
          </view>
          <view class="param-right">
            <view class="param-value-box" :class="{ editing: editingParam === param.key }">
              <text v-if="editingParam !== param.key" class="val-text">{{ formatParamValue(param) }}</text>
              <input v-else class="val-input" type="digit" v-model="tempValue" :min="param.min" :max="param.max"
                placeholder="请输入" focus @blur="handleInputBlur(param)" @confirm="handleInputConfirm(param)" />
            </view>
            <text class="unit-text">{{ param.unit || '' }}</text>
          </view>
          <view class="btn-group">
            <view v-if="editingParam !== param.key" class="btn btn-edit" :class="{ 'btn-disabled': !isEditing }"
              @click="handleParamEdit(param)">
              <uni-icons type="compose" size="14" color="#6699ff"></uni-icons>
              <text>编辑</text>
            </view>
            <template v-else-if="editingParam === param.key">
              <view class="btn btn-sure" :class="{ 'btn-loading': isSubmitting }" @click="submitParam(param)">
                <text v-if="!isSubmitting">下发</text>
                <view v-else class="loading-spinner"></view>
              </view>
              <view class="btn btn-cancel" @click="handleParamCancel()">
                <uni-icons type="closeempty" size="14" color="#999"></uni-icons>
              </view>
            </template>
          </view>
        </view>
      </view>
    </view>

    <!-- 操作确认弹窗 -->
    <uni-popup ref="confirmPopup" type="center">
      <view class="confirm-popup">
        <view class="popup-header">
          <uni-icons v-if="confirmData.isDangerous" type="info-filled" size="48" color="#ff6b6b"></uni-icons>
          <uni-icons v-else type="help-filled" size="48" color="#6699ff"></uni-icons>
          <text class="popup-title">{{ confirmData.title }}</text>
        </view>
        <view class="popup-content">
          <text class="popup-desc">{{ confirmData.content }}</text>
          <view v-if="confirmData.oldValue" class="value-change">
            <text class="value-old">原值: {{ confirmData.oldValue }}</text>
            <uni-icons type="arrowright" size="16" color="#999"></uni-icons>
            <text class="value-new">新值: {{ confirmData.newValue }}</text>
          </view>
        </view>
        <view class="popup-actions">
          <view class="popup-btn btn-cancel" @click="closeConfirmPopup">取消</view>
          <view class="popup-btn btn-confirm" @click="confirmAction">
            <text v-if="!isSubmitting">确认</text>
            <view v-else class="loading-spinner small"></view>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 操作结果提示 -->
    <view v-if="operationLog.visible" class="operation-toast" :class="operationLog.type">
      <uni-icons :type="operationLog.type === 'success' ? 'checkmarkempty' : 'closeempty'" size="20"
        :color="operationLog.type === 'success' ? '#52c41a' : '#ff4d4f'"></uni-icons>
      <text class="toast-text">{{ operationLog.message }}</text>
    </view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'
import { realtimeDataProvider } from '@/service/websocket'
import { PARAM_SCALE10_ADDRESS } from '../param-settings-constants.js'

export default {
  name: 'LiquidSettings',
  computed: {
    userId() {
      return this.$store.state.userInfo?.userId || 0
    },
    // 液冷机组：0318 V2.3
    device0318() {
      return this._matchDevice(['0318_V2_3', '0318V2_3', '0318'])
    },
    deviceAddress() {
      return (this.device0318 && this.device0318.address) || '01'
    }
  },
  mounted() {
    const currentDevice = this.$store.state.currentSelectDevice || {}
    const deviceControl = currentDevice.list.find(item => item.controlType == 1)
    if (deviceControl) {
      this.idCode = deviceControl.homeBarCode || deviceControl.barCode || ''
    }
    this.initDevice()
    this.deviceList = this.takeDeviceSnapshot()
    realtimeDataProvider.onDataUpdate = () => {
      if (this._dataUpdateTimer) return
      this._dataUpdateTimer = setTimeout(() => {
        this._dataUpdateTimer = null
        this.deviceList = this.takeDeviceSnapshot()
      }, 500)
    }
  },
  beforeDestroy() {
    realtimeDataProvider.onDataUpdate = null
    if (this._dataUpdateTimer) {
      clearTimeout(this._dataUpdateTimer)
      this._dataUpdateTimer = null
    }
  },
  data() {
    return {
      deviceList: [],
      idCode: '',
      isEditing: false,
      clickedButton: '',
      lastSendTimes: {},
      editingParam: '',
      tempValue: '',
      isSubmitting: false,
      params: {
        liquid: {}
      },
      confirmData: {
        title: '',
        content: '',
        oldValue: '',
        newValue: '',
        isDangerous: false,
        action: null,
        param: null
      },
      operationLog: {
        visible: false,
        type: 'success',
        message: '',
        timer: null
      },
      // 开关型参数（枚举）
      // 地址取自《液冷机控制数据》点表 A 列：十进制 331 起，每项占 2 byte
      liquidSwitchParams: [
        {
          key: 'liquid.B0', field: 'startMode', address: '331', label: '启动模式', options: [
            { label: '手动', value: '0' },
            { label: '自动', value: '1' }
          ]
        },
        {
          key: 'liquid.B2', field: 'workMode', address: '333', label: '工作模式', options: [
            { label: '待机', value: '0' },
            { label: '制冷', value: '1' },
            { label: '加热', value: '2' },
            { label: '自循环', value: '3' },
            { label: '自动', value: '4' }
          ]
        },
        {
          key: 'liquid.B4', field: 'supplyReturnTarget', address: '335', label: '供回水控制目标', options: [
            { label: '供水', value: '0' },
            { label: '回水', value: '1' }
          ]
        },
        {
          key: 'liquid.B34', field: 'baudRate', address: '365', label: '波特率', options: [
            { label: '9600', value: '0' },
            { label: '4800', value: '1' },
            { label: '19200', value: '2' }
          ]
        }
      ],
      // 数值型参数
      liquidParams: [
        { key: 'liquid.B6', field: 'coolingTempSetting', address: '337', label: '制冷预设温度', unit: '℃', min: 5, max: 45 },
        { key: 'liquid.B8', field: 'coolingDiff', address: '339', label: '制冷回差', unit: '℃', min: 0, max: 20 },
        { key: 'liquid.B10', field: 'heatingTempSetting', address: '341', label: '制热预设温度', unit: '℃', min: 5, max: 45 },
        { key: 'liquid.B12', field: 'heatingDiff', address: '343', label: '制热回差', unit: '℃', min: 0, max: 20 },
        { key: 'liquid.B14', field: 'tempControlPumpSpeed', address: '345', label: '控温时泵转速', unit: '%', min: 0, max: 100 },
        { key: 'liquid.B16', field: 'circulationPumpSpeed', address: '347', label: '自循环泵转速', unit: '%', min: 0, max: 100 },
        { key: 'liquid.B18', field: 'liquidTempHigh', address: '349', label: '液温过高点', unit: '℃', min: 0, max: 99 },
        { key: 'liquid.B20', field: 'liquidTempLow', address: '351', label: '液温过低点', unit: '℃', min: 0, max: 99 },
        { key: 'liquid.B22', field: 'returnPressureLow', address: '353', label: '回水压力过低点', unit: 'bar', min: 0, max: 20 },
        { key: 'liquid.B24', field: 'supplyPressureHigh', address: '355', label: '供水压力过高点', unit: 'bar', min: 0, max: 20 },
        { key: 'liquid.B26', field: 'supplyPressureWarning', address: '357', label: '供水压力预警点', unit: 'bar', min: 0, max: 20 },
        { key: 'liquid.B28', field: 'supplyPressureWarningDiff', address: '359', label: '供水压力预警回差', unit: 'bar', min: 0, max: 20 },
        { key: 'liquid.B32', field: 'modbusAddr', address: '363', label: '485通讯地址', min: 1, max: 247 }
      ]
    }
  },
  methods: {
    /**
     * 设备数据冻结快照（实现在 realtime-data-provider，统一维护）
     */
    takeDeviceSnapshot() {
      return realtimeDataProvider.takeSnapshot()
    },

    initDevice() {
      const currentDevice = this.$store.state.currentSelectDevice || {}
      const rawList = Array.isArray(currentDevice.list) ? currentDevice.list : []
      // 注册站点全部有效设备，由 DeviceFactory 按 typeCode 创建对应协议模型
      const configs = rawList
        .map(item => {
          const typeCode = String(item.typeCode || item.deviceType || '').trim()
          return {
            deviceType: typeCode,
            typeCode: typeCode,
            rawDeviceType: item.deviceType,
            address: String(item.address === undefined || item.address === null ? '' : item.address).trim(),
            barCode: String(item.homeBarCode || item.barCode || '').trim(),
            deviceId: item.id || item.deviceId,
            name: item.deviceName || item.description || typeCode
          }
        })
        .filter(config => config.typeCode && config.typeCode !== '-1')
      if (configs.length) {
        realtimeDataProvider.initDeviceList(configs)
      }
    },

    // 按候选类型依次匹配设备，未匹配到时返回 null
    _matchDevice(codes) {
      for (const code of codes) {
        const found = this.deviceList.find(item => {
          const t = String(item.deviceType || item.typeCode || item.rawDeviceType || '')
          return t === code || t.indexOf(code) === 0
        })
        if (found) return found
      }
      return null
    },

    // 读取绑定设备能源数据中某字段的显示值
    _fieldValue(field) {
      const dev = this.device0318
      if (dev && dev.energyData && dev.energyData[field]) {
        const value = dev.energyData[field].value
        if (value !== undefined && value !== null && value !== '') {
          return value
        }
      }
      return undefined
    },

    // 设备是否在线（有真实数据上报）
    _isDeviceOnline() {
      const dev = this.device0318
      if (!dev || !dev.energyData) return false
      return Object.keys(dev.energyData).some(k => {
        const v = dev.energyData[k] && dev.energyData[k].value
        return v !== undefined && v !== null && v !== '' && v !== '--'
      })
    },

    // 开关型参数当前值（返回选项标签，便于与按钮匹配）
    getParamValue(paramKey) {
      const param = this.liquidSwitchParams.find(p => p.key === paramKey)
      if (!param) return undefined
      const value = this._fieldValue(param.field)
      if (value !== undefined) return value
      return this.params.liquid[param.field]
    },

    // 数值型参数当前值
    formatParamValue(param) {
      const value = this._fieldValue(param.field)
      if (value === undefined) {
        const local = this.params.liquid[param.field]
        return local === undefined || local === null || local === '' ? '--' : local
      }
      return value
    },

    showToast(message, type = 'success') {
      if (this.operationLog.timer) {
        clearTimeout(this.operationLog.timer)
      }
      this.operationLog = {
        visible: true,
        type,
        message,
        timer: null
      }
      this.operationLog.timer = setTimeout(() => {
        this.operationLog.visible = false
      }, 3000)
    },

    checkEditMode() {
      if (!this.isEditing) {
        this.showToast('请先点击修改配置', 'warning')
        return false
      }
      return true
    },

    // 处理开关点击
    handleSwitchClick(param, option) {
      if (!this.checkEditMode()) return

      const currentValue = this.getParamValue(param.key)
      if (currentValue === option.label) {
        this.showToast('已经是当前设置', 'warning')
        return
      }
      this.executeSwitchCommand(param, option)
    },

    // 执行开关命令
    async executeSwitchCommand(param, option) {
      const now = Date.now()
      const paramLastSendTime = this.lastSendTimes[param.key] || 0
      if (now - paramLastSendTime < 5000) {
        this.showToast('请间隔5秒后再下发', 'warning')
        return
      }

      this.clickedButton = param.key + '-' + option.value
      this.lastSendTimes[param.key] = Date.now()

      setTimeout(() => {
        this.clickedButton = ''
      }, 5000)

      try {
        await this.submitSwitchParam(param.key, option.value)
        this.showToast(`${param.label}: ${option.label}成功`, 'success')
      } catch (error) {
        this.showToast(`${param.label}: ${option.label}失败`, 'error')
      }
    },

    openConfirmPopup(data) {
      this.confirmData = { ...data }
      this.$refs.confirmPopup.open()
    },

    closeConfirmPopup() {
      this.$refs.confirmPopup.close()
      this.confirmData = {
        title: '',
        content: '',
        oldValue: '',
        newValue: '',
        isDangerous: false,
        action: null,
        param: null
      }
    },

    async confirmAction() {
      if (this.confirmData.action) {
        this.isSubmitting = true
        await this.confirmData.action()
        this.isSubmitting = false
      }
      this.closeConfirmPopup()
    },

    handleInputBlur(param) {
      this.validateAndFormatValue(param)
    },

    handleInputConfirm(param) {
      this.validateAndFormatValue(param)
    },

    validateAndFormatValue(param) {
      let value = parseFloat(this.tempValue)
      if (isNaN(value)) {
        return
      }
      if (param.min !== undefined && value < param.min) {
        value = param.min
        this.showToast(`不能小于${param.min}`, 'warning')
      }
      if (param.max !== undefined && value > param.max) {
        value = param.max
        this.showToast(`不能大于${param.max}`, 'warning')
      }
      value = Math.round(value * 10) / 10
      this.tempValue = value.toString()
    },

    async submitParam(param) {
      const value = this.tempValue
      if (!value && value !== '0') {
        this.showToast('请输入参数值', 'warning')
        return
      }

      const numValue = parseFloat(value)
      if (isNaN(numValue)) {
        this.showToast('请输入有效的数值', 'warning')
        return
      }

      if (param.min !== undefined && numValue < param.min) {
        this.showToast(`${param.label}不能小于${param.min}`, 'warning')
        return
      }
      if (param.max !== undefined && numValue > param.max) {
        this.showToast(`${param.label}不能大于${param.max}`, 'warning')
        return
      }

      this.openConfirmPopup({
        title: '参数下发确认',
        content: `确定要下发"${param.label}"参数吗？`,
        oldValue: this.formatParamValue(param),
        newValue: value + (param.unit || ''),
        isDangerous: false,
        param: param,
        action: () => this.executeSubmitParam(param, value)
      })
    },

    // 按点表 D 列换算下发值：0318 液冷机压力类地址为「传输值=实际值×10」
    applyRegisterScale(value, address) {
      const num = Number(value)
      if (!Number.isFinite(num)) return String(value)
      const addr = String(address)
      const list = PARAM_SCALE10_ADDRESS['0318']
      if (list && list.indexOf(addr) >= 0) {
        return String(Math.round(num * 10))
      }
      return String(value)
    },

    async executeSubmitParam(param, value) {
      const now = Date.now()
      const paramLastSendTime = this.lastSendTimes[param.key] || 0
      if (now - paramLastSendTime < 5000) {
        this.showToast('请间隔5秒后再下发', 'warning')
        this.isSubmitting = false
        return
      }

      this.isSubmitting = true
      this.lastSendTimes[param.key] = Date.now()

      try {
        // 按点表 D 列换算：压力类地址(353/355/357/359)为「传输值=实际值×10」，其余原样下发
        const registerValue = this.applyRegisterScale(value, param.address)
        const commandData = {
          apiSufix: 'multiControl',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '0318',
            addr: this.deviceAddress,
            deviceId: '1',
            registerAddress: param.address,
            registerValue: registerValue,
            valueType: '01',
            registerType: '03',
            extra1: '00',
            extra2: '00',
            extra3: '00'
          }]
        }

        const res = await sendCommandFrame(commandData)
        if (res.status === 200) {
          this.$set(this.params.liquid, param.field, value)
          this.editingParam = ''
          this.showToast(`${param.label}: ${value}${param.unit || ''}下发成功`, 'success')
        } else {
          this.showToast('下发失败: ' + (res.msg || ''), 'error')
        }
      } catch (error) {
        console.error('命令帧发送失败:', error)
        this.showToast(`${param.label}下发失败`, 'error')
      } finally {
        this.isSubmitting = false
      }
    },

    async submitSwitchParam(paramKey, value) {
      const param = this.liquidSwitchParams.find(p => p.key === paramKey)
      if (!param) return

      // 开关型参数走设备专用下发路径（与网页端 PcsSettings 模式一致）
      const commandData = {
        apiSufix: 't3401_0318_control',
        idCode: this.idCode,
        typeCode: '3401',
        address: this.deviceAddress,
        userId: this.userId,
        commands: [{
          deviceCategory: '0318',
          addr: this.deviceAddress,
          deviceId: '1',
          registerAddress: param.address,
          registerValue: value,
          valueType: '01',
          registerType: '03',
          extra1: '00',
          extra2: '00',
          extra3: '00'
        }]
      }

      await sendCommandFrame(commandData)
      this.$set(this.params.liquid, param.field, value)
    },

    handleEditConfig() {
      const currentRoleId = this.$store.state.currentEsRoleId
      if (![1, 2, 4, 5].includes(currentRoleId)) {
        uni.showToast({ title: '无权限操作', icon: 'none' });
        return;
      }
      if (!this._isDeviceOnline()) {
        uni.showModal({
          title: '提示',
          content: '当前设备离线，暂不支持修改',
          showCancel: false
        })
        return
      }
      this.isEditing = true
      this.showToast('已进入编辑模式', 'success')
    },

    closeEdit() {
      this.isEditing = false
      this.editingParam = ''
      this.showToast('已退出编辑模式', 'success')
    },

    handleParamEdit(param) {
      if (!this.isEditing) {
        uni.showToast({
          title: '请先点击修改配置',
          icon: 'none'
        })
        return
      }
      this.editingParam = param.key
      const value = this._fieldValue(param.field)
      this.tempValue = value !== undefined ? String(value) : ''
    },

    handleParamCancel() {
      this.editingParam = ''
      this.tempValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.liquid-settings {
  background: #f5f5f5;
  min-height: 100vh;
}

.param-card {
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  position: relative;
  padding-left: 20rpx;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6rpx;
    height: 28rpx;
    background: linear-gradient(180deg, #6699ff 0%, #4488fb 100%);
    border-radius: 3rpx;
  }
}

.action-btns {
  display: flex;
  gap: 16rpx;
}

.edit-btn {
  padding: 12rpx 28rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  transition: all 0.2s ease;

  &.primary {
    background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
    color: #ffffff;
    box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);

    &:active {
      transform: scale(0.95);
      box-shadow: 0 2rpx 6rpx rgba(102, 153, 255, 0.2);
    }
  }

  &.close {
    background: #f5f5f5;
    color: #666;
    border: 1rpx solid #e0e0e0;

    &:active {
      background: #e8e8e8;
    }
  }
}

.edit-text {
  font-size: 26rpx;
}

.param-list {
  padding: 0 20rpx;
}

.param-row {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  transition: all 0.2s ease;
  flex-wrap: wrap;

  &:last-child {
    border-bottom: none;
  }

  &.editing-row {
    background: #f8fbff;
    margin: 0 -20rpx;
    padding: 28rpx 20rpx;
  }
}

.param-info {
  flex: 0 0 auto;
  width: 280rpx;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.param-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  line-height: 1.4;
}

.param-range {
  font-size: 22rpx;
  color: #999;
}

.param-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.param-value-box {
  width: 150rpx;
  height: 64rpx;
  line-height: 64rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  text-align: center;
  border: 2rpx solid transparent;
  transition: all 0.2s ease;

  &.editing {
    background: #ffffff;
    border-color: #6699ff;
    box-shadow: 0 0 0 4rpx rgba(102, 153, 255, 0.1);
  }
}

.val-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.val-input {
  width: 100%;
  height: 100%;
  font-size: 28rpx;
  text-align: center;
  background: transparent;
  border: none;
  color: #333;

  &:focus {
    outline: none;
  }
}

.unit-text {
  font-size: 24rpx;
  color: #999;
  min-width: 40rpx;
  text-align: left;
}

.btn-group {
  display: flex;
  gap: 12rpx;
  flex-direction: column;
  flex-shrink: 0;
}

.btn {
  padding: 12rpx 20rpx;
  font-size: 24rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  transition: all 0.2s ease;
}

.btn-edit {
  color: #6699ff;
  background: #ffffff;
  border: 2rpx solid #6699ff;

  &:active {
    background: #f0f5ff;
  }
}

.btn-sure {
  color: #ffffff;
  background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
  box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);
  min-width: 100rpx;

  &:active {
    transform: scale(0.95);
  }

  &.btn-loading {
    opacity: 0.8;
    pointer-events: none;
  }
}

.btn-cancel {
  color: #999;
  background: #f5f5f5;
  border: 2rpx solid #e0e0e0;
  min-width: 60rpx;

  &:active {
    background: #e8e8e8;
  }
}

.divider {
  height: 16rpx;
  background: #f8f9fa;
  margin: 0;
}

.switch-section {
  padding: 0 20rpx;
}

.switch-btns-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}

.switch-btns {
  display: flex;
  gap: 16rpx;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 100%;
}

.switch-btn {
  padding: 14rpx 24rpx;
  font-size: 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  color: #666;
  background: #ffffff;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-align: center;
  min-width: 100rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.95);
    background: #f8f8f8;
  }
}

.btn-active {
  border-color: #6699ff;
  color: #ffffff;
  background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
  box-shadow: 0 4rpx 16rpx rgba(102, 153, 255, 0.35);

  &:active {
    background: linear-gradient(135deg, #5588ee 0%, #3377ea 100%);
    box-shadow: 0 2rpx 8rpx rgba(102, 153, 255, 0.25);
  }
}

.btn-clicked {
  border-color: #4488fb !important;
  color: #ffffff !important;
  background: #4488fb !important;
  box-shadow: 0 4rpx 16rpx rgba(68, 136, 251, 0.4) !important;
}

.btn-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.confirm-popup {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 40rpx;
  width: 560rpx;
  max-width: 90vw;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
}

.popup-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-top: 16rpx;
}

.popup-content {
  margin-bottom: 32rpx;
}

.popup-desc {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  line-height: 1.6;
  display: block;
}

.value-change {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-top: 24rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
}

.value-old {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}

.value-new {
  font-size: 24rpx;
  color: #6699ff;
  font-weight: 600;
}

.popup-actions {
  display: flex;
  gap: 20rpx;
}

.popup-btn {
  flex: 1;
  padding: 24rpx 0;
  border-radius: 8rpx;
  font-size: 28rpx;
  text-align: center;
  transition: all 0.2s ease;

  &.btn-cancel {
    background: #f5f5f5;
    color: #666;

    &:active {
      background: #e8e8e8;
    }
  }

  &.btn-confirm {
    background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
    color: #ffffff;

    &:active {
      transform: scale(0.98);
    }
  }
}

.operation-toast {
  position: fixed;
  top: 200rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 32rpx;
  border-radius: 8rpx;
  background: #ffffff;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: slideDown 0.3s ease;

  &.success {
    border-left: 4rpx solid #52c41a;
  }

  &.error {
    border-left: 4rpx solid #ff4d4f;
  }

  &.warning {
    border-left: 4rpx solid #faad14;
  }
}

.toast-text {
  font-size: 28rpx;
  color: #333;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20rpx);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.loading-spinner {
  width: 28rpx;
  height: 28rpx;
  border: 3rpx solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  &.small {
    width: 24rpx;
    height: 24rpx;
    border-width: 2rpx;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
