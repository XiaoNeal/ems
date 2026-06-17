<template>
  <view class="storage-settings">
    <view class="param-card">
      <view class="card-header">
        <text class="card-title">储能 DC/DC 参数设置</text>
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
        <view v-for="param in storageSwitchParams" :key="param.key" class="param-row">
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
        <view v-for="param in storageParams" :key="param.key" class="param-row"
          :class="{ 'editing-row': editingParam === param.key }">
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
                <input v-else class="val-input" type="digit" v-model="tempValue" :min="param.min" :max="param.max"
                  placeholder="请输入" focus @blur="handleInputBlur(param)" @confirm="handleInputConfirm(param)" />
              </view>
              <text class="unit-text">{{ param.unit || '' }}</text>
            </view>
            <view class="btn-group">
              <view v-if="editingParam !== param.key" class="btn btn-edit" :class="{ 'btn-disabled': !isEditing }" @click="handleParamEdit(param)">
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
      <uni-icons :type="operationLog.type === 'success' ? 'checkmarkempty' : 'closeempty'" size="20"
        :color="operationLog.type === 'success' ? '#52c41a' : '#ff4d4f'"></uni-icons>
      <text class="toast-text">{{ operationLog.message }}</text>
    </view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'

export default {
  name: 'StorageSettings',
  props: {},
  computed: {
    userId() {
      return this.$store.state.userInfo?.userId || 0
    }
  },
  data() {
    return {
      idCode: '00 00 02 20 26 06 05 15 34 58 01 00 00 00 00',
      deviceAddress: '02',
      isEditing: false,
      clickedButton: '',
      lastSendTimes: {},
      editingParam: '',
      tempValue: '',
      isSubmitting: false,
      params: {
        storage: {}
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
      storageParams: [
        // { key: 'storage.B16', field: 'B16', address: '60024', label: '组ID号', unit: '', min: 1, max: 31, default: 1 },
        // { key: 'storage.B18', field: 'B18', address: '60025', label: '模块数量', unit: '', min: 1, max: 31, default: 1 },
        { key: 'storage.B22', field: 'B22', address: '60040', label: '直流母线电压', unit: 'V', min: 350, max: 850, scale: 10, default: 720 },
        { key: 'storage.B26', field: 'B26', address: '60043', label: '充放电功率设定', unit: '%', min: 0, max: 130, scale: 10, default: 100 },
        { key: 'storage.B28', field: 'B28', address: '60044', label: '电池均充电压', unit: 'V', min: 40, max: 360, scale: 10, default: 60 },
        { key: 'storage.B30', field: 'B30', address: '60045', label: '充电电流设置', unit: 'A', min: 0, max: 130, scale: 10, default: 100 },
        { key: 'storage.B32', field: 'B32', address: '60046', label: '电池浮充电压', unit: 'V', min: 40, max: 360, scale: 10, default: 60 },
        { key: 'storage.B34', field: 'B34', address: '60047', label: '放电电压设置', unit: 'V', min: 40, max: 360, scale: 10, default: 40 },
        { key: 'storage.B36', field: 'B36', address: '60048', label: '放电电流设置', unit: 'A', min: 0, max: 130, scale: 10, default: 100 },
        { key: 'storage.B38', field: 'B38', address: '60049', label: '电池过压关机点', unit: 'V', min: 40, max: 370, scale: 10, default: 370 },
        { key: 'storage.B40', field: 'B40', address: '60050', label: '电池欠压告警点', unit: 'V', min: 35, max: 355, scale: 10, default: 450 },
        { key: 'storage.B42', field: 'B42', address: '60051', label: '电池欠压关机点', unit: 'V', min: 35, max: 355, scale: 10, default: 350 },
        { key: 'storage.B48', field: 'B48', address: '60054', label: '充电母线电压上限', unit: 'V', min: 350, max: 850, scale: 10, default: 630 },
        { key: 'storage.B49', field: 'B49', address: '60055', label: '放电母线电压下限', unit: 'V', min: 350, max: 850, scale: 10, default: 570 }
      ],
      storageSwitchParams: [
        // {
        //   key: 'storage.B0', field: 'B0', address: '60016', label: 'Can波特率设置', options: [
        //     { label: '1000kbps', value: '0' },
        //     { label: '500kbps', value: '1' },
        //     { label: '250kbps', value: '2' },
        //     { label: '125kbps', value: '3' }
        //   ]
        // },
        // {
        //   key: 'storage.B2', field: 'B2', address: '60017', label: '认证标准码', options: [
        //     { label: '中国标准I', value: '0' },
        //     { label: '中国标准II', value: '1' },
        //     { label: '美国标准', value: '2' },
        //     { label: '德国标准', value: '3' }
        //   ]
        // },
        // {
        //   key: 'storage.B4', field: 'B4', address: '60018', label: '机器类型', options: [
        //     { label: 'IBDC30060', value: '1' },
        //     { label: 'IBG30060', value: '2' }
        //   ]
        // },
        {
          key: 'storage.B6', field: 'B6', address: '60019', label: '故障清除', options: [
            { label: '清除所有故障', value: '0x0055', dangerous: true }
          ]
        },
        // {
        //   key: 'storage.B8', field: 'B8', address: '60020', label: '运行模式设置', options: [
        //     { label: '无输出模式', value: '0' },
        //     { label: '正常运行模式', value: '1' },
        //     { label: '开环调试模式', value: '2' },
        //     { label: '发波调试模式', value: '3' }
        //   ]
        // },
        {
          key: 'storage.B10', field: 'B10', address: '60021', label: '运行状态设置', options: [
            { label: '自适应', value: '0' },
            { label: '并网', value: '1' },
            { label: '离网', value: '2' }
          ]
        },
        {
          key: 'storage.B12', field: 'B12', address: '60022', label: '系统开关机', options: [
            { label: '开机', value: '0x0055', dangerous: true },
            { label: '关机', value: '0x00AA', dangerous: true }
          ]
        },
        // {
        //   key: 'storage.B14', field: 'B14', address: '60023', label: '恢复出厂设置', options: [
        //     { label: '恢复所有值', value: '0x0055', dangerous: true },
        //     { label: '恢复用户值', value: '0x00AA', dangerous: true }
        //   ]
        // },
        // {
        //   key: 'storage.B20', field: 'B20', address: '60038', label: '电池类型', options: [
        //     { label: '铅酸电池', value: '0' },
        //     { label: '锂电池', value: '1' }
        //   ]
        // },
        {
          key: 'storage.B24', field: 'B24', address: '60042', label: '充放电指令', options: [
            { label: '待机', value: '0' },
            { label: '充电', value: '1' },
            { label: '放电', value: '2' },
            // { label: 'BAT自动', value: '3' },
            { label: 'BUS自动', value: '4' },
            // { label: '关充电', value: '5' },
            // { label: '高压PV', value: '6' },
            // { label: '低压PV', value: '7' }
          ]
        },
        // {
        //   key: 'storage.B44', field: 'B44', address: '60052', label: '电池激活功能', options: [
        //     { label: '禁止', value: '0' },
        //     { label: '使能', value: '1' }
        //   ]
        // },
        // {
        //   key: 'storage.B46', field: 'B46', address: '60053', label: '自动重启功能', options: [
        //     { label: '禁止', value: '0' },
        //     { label: '使能', value: '1' }
        //   ]
        // },
        // {
        //   key: 'storage.B53b1', field: 'B53b1', address: '60100', label: '告警屏蔽位1-Bit1', options: [
        //     { label: 'CAN通讯使能位', value: '0' },
        //     { label: '485通讯使能位', value: '1' }
        //   ]
        // }
        // {
        //   key: 'storage.B53b0', field: 'B53b0', address: '60100', label: 'CAN通讯使能位', options: [
        //     { label: '禁止', value: '0' },
        //     { label: '使能', value: '1' }
        //   ]
        // },
        // {
        //   key: 'storage.B53b1', field: 'B53b1', address: '60100', label: '485通讯使能位', options: [
        //     { label: '禁止', value: '0' },
        //     { label: '使能', value: '1' }
        //   ]
        // }
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

    isDangerousOption(option) {
      return option.dangerous === true
    },

    getCurrentOptionLabel(param) {
      const currentValue = this.getParamValue(param.key)
      const option = param.options.find(opt => opt.value === currentValue)
      return option ? option.label : ''
    },

    handleSwitchClick(param, option) {
      if (!this.checkEditMode()) return

      const currentValue = this.getParamValue(param.key)
      if (currentValue === option.value) {
        this.showToast('已经是当前设置', 'warning')
        return
      }

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
        this.executeSwitchCommand(param, option)
      }
    },

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

    formatParamValue(param) {
      const value = this.params.storage[param.field]
      if (value === undefined || value === null || value === '') {
        return '--'
      }
      return value
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

      value = Math.round(value)
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
        oldValue: this.params.storage[param.field] || '--',
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
        const registerAddress = param.address

        // 支持 scale 参数：传输值 = 实际值 × scale
        const scale = param.scale || 1
        const registerValue = (Math.round(parseFloat(value) * scale)).toString()

        const commandData = {
          apiSufix: 't3401_171D_control',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '171D',
            addr: 30,
            deviceId: '30',
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
        this.params.storage[param.field] = value
        this.editingParam = ''
        this.showToast(`${param.label}: ${value}${param.unit || ''}下发成功`, 'success')
      } catch (error) {
        this.showToast(`${param.label}下发失败`, 'error')
        console.error('命令帧发送失败:', error)
      } finally {
        this.isSubmitting = false
      }
    },

    async submitSwitchParam(param, value) {
      // const registerMap = {
      //   'storage.B0': '0', 'storage.B2': '2', 'storage.B4': '4',
      //   'storage.B6': '6', 'storage.B8': '8', 'storage.B10': '10',
      //   'storage.B12': '12', 'storage.B14': '14', 'storage.B20': '20',
      //   'storage.B24': '24', 'storage.B44': '44', 'storage.B46': '46',
      //   'storage.B53b0': '53', 'storage.B53b1': '53'
      // }
      // const registerAddress = registerMap[param.key] || '00000000'

      const registerAddress = param.address

      const commandData = {
        apiSufix: 'multiControl',
        idCode: this.idCode,
        typeCode: '3401',
        address: this.deviceAddress,
        userId: this.userId,
        commands: [{
          deviceCategory: '171D',
          addr: 30,
          deviceId: '30',
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

      const [module, key] = param.key.split('.')
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
      if (!this.isEditing) {
        uni.showToast({
          title: '请先点击修改配置',
          icon: 'none'
        });
        return;
      }
      this.editingParam = param.key
      this.tempValue = this.params.storage[param.field] || ''
    },

    handleParamCancel() {
      this.editingParam = ''
      this.tempValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.storage-settings {
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