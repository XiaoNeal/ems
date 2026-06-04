<template>
  <view class="pcs-settings">
    <view class="param-card">
      <view class="card-header">
        <text class="card-title">PCS 参数设置</text>
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
        <view v-for="param in pcsSwitchParams" :key="param.key" class="param-row">
          <view class="param-info">
            <text class="param-name">{{ param.label }}</text>

          </view>
          <view class="switch-btns-wrapper">
            <view class="switch-btns">
              <view v-for="option in param.options" :key="option.value" class="switch-btn" :class="[
                getParamValue(param.key) === option.value ? 'btn-active' : '',
                !isEditing ? 'btn-disabled' : '',
                clickedButton === param.key + '-' + option.value ? 'btn-clicked' : '',
                isDangerousOption(option) ? 'btn-danger' : ''
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
        <view v-for="param in pcsParams" :key="param.key" class="param-row" :class="{ 'editing-row': editingParam === param.key }">
          <view class="param-info">
            <text class="param-name">{{ param.label }}</text>
            <text v-if="param.min !== undefined && param.max !== undefined" class="param-range">
              范围: {{ param.min }}~{{ param.max }}{{ param.unit }}
            </text>
          </view>
          <view class="param-right-wrapper">
            <view class="param-right">
              <view class="param-value-box" :class="{ editing: editingParam === param.key }">
                <text v-if="editingParam !== param.key" class="val-text">{{ formatParamValue(param) }}</text>
                <input v-else class="val-input" type="digit" v-model="tempValue" :min="param.min"
                  :max="param.max" placeholder="请输入" focus @blur="handleInputBlur(param)" @confirm="handleInputConfirm(param)" />
              </view>
              <text class="unit-text">{{ param.unit || '' }}</text>
            </view>
            <view class="btn-group">
              <view v-if="editingParam !== param.key" class="btn btn-edit" @click="handleParamEdit(param)">
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
          <view class="popup-btn btn-confirm" :class="{ 'btn-danger': confirmData.isDangerous }" @click="confirmAction">
            <text v-if="!isSubmitting">确认</text>
            <view v-else class="loading-spinner small"></view>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 操作结果提示 -->
    <view v-if="operationLog.visible" class="operation-toast" :class="operationLog.type">
      <uni-icons :type="operationLog.type === 'success' ? 'checkmarkempty' : 'closeempty'" size="20" :color="operationLog.type === 'success' ? '#52c41a' : '#ff4d4f'"></uni-icons>
      <text class="toast-text">{{ operationLog.message }}</text>
    </view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'

export default {
  name: 'PcsSettings',
  props: {},
  computed: {
    userId() {
      return this.$store.state.userInfo?.userId || 0
    }
  },
  data() {
    return {
      idCode: 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF',
      deviceAddress: '01',
      isEditing: false,
      clickedButton: '',
      lastSendTimes: {},
      editingParam: '',
      tempValue: '',
      isSubmitting: false,
      params: {
        pcs: {}
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
      pcsParams: [
        { key: 'pcs.B0', field: 'B0', label: '设置模块工作海拔值', unit: 'm', min: 1000, max: 5000 },
        { key: 'pcs.B4', field: 'B4', label: '设置组号', unit: '', min: 0, max: 7 },
        { key: 'pcs.B40', field: 'B40', label: '设置直流侧电压', unit: 'mV' },
        { key: 'pcs.B44', field: 'B44', label: '设置直流侧电流', unit: 'mA', min: -78, max: 73.5 },
        { key: 'pcs.B48', field: 'B48', label: '设置交流侧总有功功率(并网模式的功率控制模式)', unit: 'W' },
        { key: 'pcs.B50', field: 'B50', label: '设置交流侧总有功功率(交流侧总有功功率值)', unit: 'W' },
        { key: 'pcs.B52', field: 'B52', label: '设置交流侧总无功功率', unit: 'kVar' },
        { key: 'pcs.B56', field: 'B56', label: '设置交流侧功率因素 PF', unit: '' },
        { key: 'pcs.B64', field: 'B64', label: '设置交流相电压', unit: 'V' },
        { key: 'pcs.B66', field: 'B66', label: '设置交流频率', unit: 'Hz' },
        { key: 'pcs.B72', field: 'B72', label: '设置直流欠压保护电压', unit: 'V' },
        { key: 'pcs.B76', field: 'B76', label: '设置直流过压保护电压', unit: 'V' },
        { key: 'pcs.B80', field: 'B80', label: '设置一级交流欠压保护线电压', unit: 'V' },
        { key: 'pcs.B82', field: 'B82', label: '设置一级交流欠压保护时间', unit: 's' },
        { key: 'pcs.B84', field: 'B84', label: '设置一级交流过压保护线电压', unit: 'V' },
        { key: 'pcs.B86', field: 'B86', label: '设置一级交流过压保护时间', unit: 's' },
        { key: 'pcs.B88', field: 'B88', label: '设置一级交流欠频保护频率', unit: 'Hz' },
        { key: 'pcs.B90', field: 'B90', label: '设置一级交流欠频保护时间', unit: 's' },
        { key: 'pcs.B92', field: 'B92', label: '设置一级交流过频保护频率', unit: 'Hz' },
        { key: 'pcs.B94', field: 'B94', label: '设置一级交流过频保护时间', unit: 's' },
        { key: 'pcs.B96', field: 'B96', label: '设置一级交流过频保护时间', unit: 's' },
        { key: 'pcs.B98', field: 'B98', label: '设置一级交流过频保护时间', unit: 's' },
        { key: 'pcs.B100', field: 'B100', label: '设置二级交流过频保护频率', unit: 'Hz' },
        { key: 'pcs.B102', field: 'B102', label: '设置二级交流过频保护时间', unit: 's' },
        { key: 'pcs.B108', field: 'B108', label: '设置二级交流欠压保护线电压', unit: 'V' },
        { key: 'pcs.B110', field: 'B110', label: '设置二级交流欠压保护时间', unit: 's' },
        { key: 'pcs.B112', field: 'B112', label: '设置二级交流过压保护线电压', unit: 'V' },
        { key: 'pcs.B114', field: 'B114', label: '设置二级交流过压保护时间', unit: 's' }
      ],
      pcsSwitchParams: [
        {
          key: 'pcs.B8', label: '设置模块地址分配方式', options: [
            { label: '自动分配', value: '0x00000000' },
            { label: '拨码设置', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B12', label: '设置离网模式交流侧欠压复位', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '复位', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B16', label: '设置整流模式直流侧欠压复位', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '复位', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B20', label: '设置模块工作模式', options: [
            { label: '并网', value: '0x00000000' },
            { label: '离网', value: '0x00010000' },
            { label: '整流', value: '0x00020000' }
          ]
        },
        {
          key: 'pcs.B24', label: '设置模块开关机', options: [
            { label: '开机', value: '0x00010000', dangerous: true },
            { label: '关机', value: '0x00000000', dangerous: true }
          ]
        },
        {
          key: 'pcs.B28', label: '设置模块直流侧过压复位', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '复位', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B32', label: '设置逆变模式直流侧欠压复位', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '复位', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B36', label: '设置模块短路复位', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '复位', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B60', label: '设置交流侧无功功率类型', options: [
            { label: '不设置无功功率输出功能', value: '0x00A00000' },
            { label: '通过 PF 设置命令', value: '0x00A10000' },
            { label: '通过无功功率设置命令', value: '0x00A20000' }
          ]
        },
        {
          key: 'pcs.B68', label: '设置是否错相', options: [
            { label: '否', value: '0x00000000' },
            { label: '是', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B104', label: '设置是否过载输出', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '使能', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B116', label: '设置是否使能输入电压环', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '使能', value: '0x00010000' }
          ]
        }
      ]
    }
  },
  methods: {
    checkEditMode() {
      if (!this.isEditing) {
        this.showToast('请先点击修改配置', 'warning')
        return false
      }
      return true
    },

    // 显示操作结果提示
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

    // 判断是否为危险操作
    isDangerousOption(option) {
      return option.dangerous === true
    },

    // 获取当前选项标签
    getCurrentOptionLabel(param) {
      const currentValue = this.getParamValue(param.key)
      const option = param.options.find(opt => opt.value === currentValue)
      return option ? option.label : ''
    },

    // 处理开关点击
    handleSwitchClick(param, option) {
      if (!this.checkEditMode()) return

      const currentValue = this.getParamValue(param.key)
      if (currentValue === option.value) {
        this.showToast('已经是当前设置', 'warning')
        return
      }

      // 危险操作需要确认
      if (this.isDangerousOption(option)) {
        this.openConfirmPopup({
          title: '危险操作确认',
          content: `确定要执行"${param.label}"的"${option.label}"操作吗？此操作可能影响系统运行。`,
          oldValue: this.getCurrentOptionLabel(param),
          newValue: option.label,
          isDangerous: true,
          action: () => this.executeSwitchCommand(param, option)
        })
      } else {
        // 普通操作直接执行
        this.executeSwitchCommand(param, option)
      }
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
        await this.submitSwitchParam(param, option.value)
        this.showToast(`${param.label}: ${option.label}成功`, 'success')
      } catch (error) {
        this.showToast(`${param.label}: ${option.label}失败`, 'error')
      }
    },

    // 打开确认弹窗
    openConfirmPopup(data) {
      this.confirmData = { ...data }
      this.$refs.confirmPopup.open()
    },

    // 关闭确认弹窗
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

    // 确认执行
    async confirmAction() {
      if (this.confirmData.action) {
        this.isSubmitting = true
        await this.confirmData.action()
        this.isSubmitting = false
      }
      this.closeConfirmPopup()
    },

    // 格式化参数值显示
    formatParamValue(param) {
      const value = this.params.pcs[param.field]
      if (value === undefined || value === null || value === '') {
        return '--'
      }
      return value
    },

    // 处理输入框失焦
    handleInputBlur(param) {
      this.validateAndFormatValue(param)
    },

    // 处理输入框确认
    handleInputConfirm(param) {
      this.validateAndFormatValue(param)
    },

    // 校验并格式化输入值
    validateAndFormatValue(param) {
      let value = parseFloat(this.tempValue)
      if (isNaN(value)) {
        return
      }

      // 范围限制
      if (param.min !== undefined && value < param.min) {
        value = param.min
        this.showToast(`不能小于${param.min}`, 'warning')
      }
      if (param.max !== undefined && value > param.max) {
        value = param.max
        this.showToast(`不能大于${param.max}`, 'warning')
      }

      // 精度处理
      if (param.key === 'pcs.B44') {
        value = Math.round(value * 10) / 10
      } else {
        value = Math.round(value)
      }

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

      // 范围校验
      if (param.min !== undefined && numValue < param.min) {
        this.showToast(`${param.label}不能小于${param.min}`, 'warning')
        return
      }
      if (param.max !== undefined && numValue > param.max) {
        this.showToast(`${param.label}不能大于${param.max}`, 'warning')
        return
      }

      // 打开确认弹窗
      this.openConfirmPopup({
        title: '参数下发确认',
        content: `确定要下发"${param.label}"参数吗？`,
        oldValue: this.params.pcs[param.field] || '--',
        newValue: value + (param.unit || ''),
        isDangerous: false,
        param: param,
        action: () => this.executeSubmitParam(param, value)
      })
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
        const registerMap = {
          'pcs.B0': '0', 'pcs.B8': '8', 'pcs.B12': '12',
          'pcs.B16': '16', 'pcs.B20': '20', 'pcs.B24': '24',
          'pcs.B28': '28', 'pcs.B32': '32', 'pcs.B36': '36',
          'pcs.B40': '40', 'pcs.B44': '44', 'pcs.B48': '48',
          'pcs.B52': '52', 'pcs.B56': '56', 'pcs.B60': '60',
          'pcs.B62': '62', 'pcs.B64': '64', 'pcs.B68': '68',
          'pcs.B72': '72', 'pcs.B76': '76', 'pcs.B78': '78',
          'pcs.B80': '80', 'pcs.B82': '82', 'pcs.B84': '84',
          'pcs.B86': '86', 'pcs.B88': '88', 'pcs.B90': '90',
          'pcs.B96': '96', 'pcs.B98': '98', 'pcs.B100': '100',
          'pcs.B104': '104', 'pcs.B106': '106', 'pcs.B108': '108',
          'pcs.B110': '110', 'pcs.B112': '112'
        }
        const registerAddress = registerMap[param.key] || '00000000'

        const valueMultiplier = {
          'pcs.B0': 1000
        }
        const hexParams = ['pcs.B4']
        const multiplier = valueMultiplier[param.key] || 1
        const finalValue = parseFloat(value) * multiplier
        const registerValue = hexParams.includes(param.key)
          ? '0x' + finalValue.toString(16).padStart(8, '0')
          : finalValue.toString()

        const commandData = {
          apiSufix: 'multiControl',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '171B',
            addr: this.deviceAddress,
            deviceId: '1',
            registerAddress: registerAddress,
            registerValue: registerValue,
            valueType: '01',
            registerType: '03',
            extra1: '00',
            extra2: '00',
            extra3: '00'
          }]
        }

        await sendCommandFrame(commandData)
        this.params.pcs[param.field] = value
        this.editingParam = ''
        this.showToast(`${param.label}: ${value}${param.unit || ''}下发成功`, 'success')
      } catch (error) {
        this.showToast(`${param.label}下发失败`, 'error')
        console.error('命令帧发送失败:', error)
      } finally {
        this.isSubmitting = false
      }
    },

    async submitSwitchParam(paramKey, value) {
      const param = this.pcsSwitchParams.find(p => p.key === paramKey)
      if (!param) return

      const registerMap = {
        'pcs.B8': '8', 'pcs.B12': '12', 'pcs.B16': '16',
        'pcs.B20': '20', 'pcs.B24': '24', 'pcs.B28': '28',
        'pcs.B32': '32', 'pcs.B36': '36', 'pcs.B60': '60',
        'pcs.B68': '68', 'pcs.B104': '104', 'pcs.B116': '116'
      }
      const registerAddress = registerMap[paramKey] || '00000000'

      const commandData = {
        apiSufix: 'multiControl',
        idCode: this.idCode,
        typeCode: '3401',
        address: this.deviceAddress,
        userId: this.userId,
        commands: [{
          deviceCategory: '171B',
          addr: this.deviceAddress,
          deviceId: '1',
          registerAddress: registerAddress,
          registerValue: value,
          valueType: '01',
          registerType: '03',
          extra1: '00',
          extra2: '00',
          extra3: '00'
        }]
      }

      await sendCommandFrame(commandData)
      
      // 更新本地状态
      const [module, key] = paramKey.split('.')
      this.params[module][key] = value
    },

    getParamValue(paramKey) {
      const [module, key] = paramKey.split('.')
      return this.params[module][key]
    },

    handleEditConfig() {
      this.isEditing = true
      this.showToast('已进入编辑模式', 'success')
    },

    closeEdit() {
      this.isEditing = false
      this.editingParam = ''
      this.showToast('已退出编辑模式', 'success')
    },

    handleParamEdit(param) {
      this.editingParam = param.key
      this.tempValue = this.params.pcs[param.field] || ''
    },

    handleParamCancel() {
      this.editingParam = ''
      this.tempValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.pcs-settings {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx;
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
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  transition: all 0.2s ease;
  
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
  width: 40%;
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

.param-current {
  font-size: 22rpx;
  color: #6699ff;
  background: rgba(102, 153, 255, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  display: inline-block;
  width: fit-content;
}

.param-range {
  font-size: 22rpx;
  color: #999;
}

.param-right-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16rpx;
  flex: 1;
  min-width: 300rpx;
}

.param-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.param-value-box {
  width: 160rpx;
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
  min-width: 60rpx;
  text-align: left;
}

.btn-group {
  display: flex;
  gap: 12rpx;
  flex-direction: column;
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

// 开关型参数样式
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

.btn-danger {
  border-color: #ff6b6b;
  color: #ff6b6b;
  
  &.btn-active {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
    border-color: #ff6b6b;
    color: #ffffff;
    box-shadow: 0 4rpx 16rpx rgba(255, 107, 107, 0.35);
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

// 确认弹窗样式
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
    
    &.btn-danger {
      background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
    }
  }
}

// 操作提示样式
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

// 加载动画
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
