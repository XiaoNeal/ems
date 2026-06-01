<template>
  <view class="pcs-settings">
    <view class="param-card">
      <view class="card-header">
        <text class="card-title">PCS 参数设置</text>
      </view>

      <!-- 开关型参数 -->
      <view class="switch-section">
        <view v-for="param in pcsSwitchParams" :key="param.key" class="param-row">
          <text class="param-name">{{ param.label }}</text>
          <view class="switch-btns">
            <view v-for="option in param.options" :key="option.value" class="switch-btn" :class="[
              getParamValue(param.key) === option.value ? 'btn-active' : '',
              !isEditing ? 'btn-disabled' : '',
              clickedButton === param.key + '-' + option.value ? 'btn-clicked' : ''
            ]" @click="setSwitchParam(param.key, option.value)">
              {{ option.label }}
            </view>
          </view>
        </view>
      </view>

      <!-- 数值型参数 -->
      <view class="divider"></view>
      <view class="param-list">
        <view v-for="param in pcsParams" :key="param.key" class="param-row">
          <text class="param-name">{{ param.label }}</text>
          <view class="param-right">
            <view class="param-value-box" :class="{ editing: editingParam === param.key }">
              <text v-if="editingParam !== param.key" class="val-text">{{ params.pcs[param.field] || "--" }}</text>
              <input v-else class="val-input" type="number" v-model="params.pcs[param.field]" :min="param.min"
                :max="param.max" placeholder="请输入" focus />
            </view>
            <text class="unit-text">{{ param.unit }}</text>
          </view>
          <view class="btn-group">
            <view v-if="editingParam !== param.key" class="btn btn-edit" @click="$emit('edit', param.key)">编辑</view>
            <template v-else>
              <view class="btn btn-sure" @click="submitParam(param.key, param.label)">下发</view>
              <view class="btn btn-cancel" @click="$emit('cancel')">取消</view>
            </template>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'

export default {
  name: 'PcsSettings',
  props: {
    params: {
      type: Object,
      required: true
    },
    editingParam: {
      type: String,
      default: ''
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    userId() {
      return this.$store.state.userInfo?.userId || 0
    }
  },
  data() {
    return {
      idCode: 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF',
      deviceAddress: '01',
      clickedButton: '',
      lastSendTime: 0,
      pcsParams: [
        { key: 'pcs.B0', field: 'B0', label: '设置模块工作海拔值', unit: 'm', min: 1000, max: 5000 },
        { key: 'pcs.B4', field: 'B4', label: '设置组号', unit: '', min: 0, max: 7 },
        { key: 'pcs.B40', field: 'B40', label: '设置直流侧电压', unit: 'V' },
        { key: 'pcs.B44', field: 'B44', label: '设置直流侧电流', unit: 'A' },
        { key: 'pcs.B48', field: 'B48', label: '设置交流侧总有功功率(并网模式的功率控制模式)', unit: 'kW' },
        { key: 'pcs.B50', field: 'B50', label: '设置交流侧总有功功率(交流侧总有功功率值)', unit: 'kW' },
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
            { label: '开机', value: '0x00010000' },
            { label: '关机', value: '0x00000000' }
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
        uni.showToast({ title: '请先点击修改配置', icon: 'none' })
        return false
      }
      return true
    },
    async submitParam(paramKey, paramName, value) {
      if (value === undefined) {
        value = this.getParamValue(paramKey)
        if (!value && value !== 0) {
          uni.showToast({ title: '请输入参数值', icon: 'none' })
          return
        }
      }

      const paramConfig = this.pcsParams.find(p => p.key === paramKey)
      if (paramConfig) {
        if (paramConfig.min !== undefined && parseFloat(value) < paramConfig.min) {
          uni.showToast({ title: `${paramName}不能小于${paramConfig.min}`, icon: 'none' })
          return
        }
        if (paramConfig.max !== undefined && parseFloat(value) > paramConfig.max) {
          uni.showToast({ title: `${paramName}不能大于${paramConfig.max}`, icon: 'none' })
          return
        }
      }

      uni.showLoading({ title: '下发中...' })
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
        const registerAddress = registerMap[paramKey] || '00000000'

        const valueMultiplier = {
          'pcs.B0': 1000
        }
        const hexParams = ['pcs.B4']
        const multiplier = valueMultiplier[paramKey] || 1
        const finalValue = parseFloat(value) * multiplier
        const registerValue = hexParams.includes(paramKey)
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
        uni.hideLoading()
        this.$emit('cancel')
        uni.showToast({ title: `${paramName}指令已下发`, icon: 'success' })
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '下发失败', icon: 'none' })
        console.error('命令帧发送失败:', error)
      }
    },
    getParamValue(paramKey) {
      const [module, key] = paramKey.split('.')
      return this.params[module][key]
    },
    setSwitchParam(paramKey, value) {
      if (!this.checkEditMode()) return

      const now = Date.now()
      if (now - this.lastSendTime < 5000) {
        uni.showToast({ title: '请间隔5秒后再下发', icon: 'none' })
        return
      }

      const param = this.pcsSwitchParams.find(p => p.key === paramKey)
      if (param) {
        let hexValue = '0x00010000'
        if (value === 'disable' || value === 'none' || value === 'off') {
          hexValue = '0x00000000'
        } else if (value === 'grid') {
          hexValue = '0x00000000'
        } else if (value === 'offgrid') {
          hexValue = '0x00020000'
        } else if (value === 'auto') {
          hexValue = '0x00000000'
        } else if (value === 'on') {
          hexValue = '0x00010000'
        }

        this.clickedButton = paramKey + '-' + value
        this.lastSendTime = now

        setTimeout(() => {
          this.clickedButton = ''
        }, 5000)

        this.submitParam(paramKey, param.label, hexValue)
      }
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
}

.card-header {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.param-list {
  padding: 0 20rpx;
}

.param-row {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  flex-wrap: wrap;

  &:last-child {
    border-bottom: none;
  }
}

.param-name {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 2px
}

.param-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-right: 20rpx;
}

.param-value-box {
  width: 180rpx;
  height: 60rpx;
  line-height: 60rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  text-align: center;

  &.editing {
    background: #ffffff;
    border: 1rpx solid #6699ff;
  }
}

.val-text {
  font-size: 28rpx;
  color: #333;
}

.val-input {
  width: 100%;
  height: 100%;
  font-size: 28rpx;
  text-align: center;
  background: transparent;
  border: none;

  &:focus {
    outline: none;
  }
}

.unit-text {
  font-size: 26rpx;
  color: #999;
}

.btn-group {
  display: flex;
  gap: 12rpx;
}

.btn {
  padding: 10rpx 24rpx;
  font-size: 24rpx;
  border-radius: 8rpx;
}

.btn-edit {
  color: #6699ff;
  background: #ffffff;
  border: 1rpx solid #6699ff;
}

.btn-sure {
  color: #ffffff;
  background: #6699ff;
}

.btn-cancel {
  color: #999;
  background: #f5f5f5;
}

.divider {
  height: 16rpx;
  background: #f8f9fa;
  margin: 0;
}

.switch-section {
  padding: 0 20rpx;
}

.switch-btns {
  display: flex;
  gap: 16rpx;
}

.switch-btn {
  padding: 12rpx 32rpx;
  font-size: 26rpx;
  border: 1rpx solid #6699ff;
  border-radius: 5px;
  color: #6699ff;
  background: #ffffff;
  transition: all 0.15s ease;

  &:active {
    transform: scale(0.95);
    background: #f0f5ff;
    border-color: #4a8cff;
    color: #4a8cff;
  }
}

.btn-active {
  border-color: #6699ff;
  color: #ffffff;
  background: #6699ff;
  box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);

  &:active {
    background: #4a8cff;
    border-color: #3d7ef0;
    transform: scale(0.95);
    box-shadow: 0 2rpx 6rpx rgba(102, 153, 255, 0.3);
  }
}

.btn-clicked {
  border-color: #4488fb !important;
  color: #ffffff !important;
  background: #4488fb !important;
  box-shadow: 0 4rpx 16rpx rgba(68, 136, 251, 0.4) !important;
}

.btn-disabled {
  opacity: 0.7;
  pointer-events: none;
}
</style>