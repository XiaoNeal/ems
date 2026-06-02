<template>
  <view class="pv-settings">
    <view class="param-card">
      <view class="card-header">
        <text class="card-title">光伏DC/DC</text>
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
        <view v-for="param in pvSwitchParams" :key="param.key" class="param-row">
          <text class="param-name">{{ param.label }}</text>
          <view class="switch-btns-wrapper">
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
      </view>

      <!-- 数值型参数 -->
      <view class="divider"></view>
      <view class="param-list">
        <view v-for="param in pvParams" :key="param.key" class="param-row">
          <text class="param-name">{{ param.label }}</text>
          <view class="param-right-wrapper">
            <view class="param-right">
              <view class="param-value-box" :class="{ editing: editingParam === param.key }">
                <text v-if="editingParam !== param.key" class="val-text">{{ params.pv[param.field] || "--" }}</text>
                <input v-else class="val-input" type="number" v-model="params.pv[param.field]" placeholder="请输入" focus />
              </view>
              <text class="unit-text">{{ param.unit || '' }}</text>
            </view>
            <view class="btn-group">
              <view v-if="editingParam !== param.key" class="btn btn-edit" @click="handleParamEdit(param.key)">编辑</view>
              <template v-else-if="editingParam === param.key">
                <view class="btn btn-sure" @click="submitParam(param.key, param.label)">下发</view>
                <view class="btn btn-cancel" @click="handleParamCancel()">取消</view>
              </template>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'

export default {
  name: 'PvSettings',
  props: {},
  computed: {
    userId() {
      return this.$store.state.userInfo?.userId || 0
    }
  },
  data() {
    return {
      idCode: 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF',
      deviceAddress: '03',
      isEditing: false,
      clickedButton: '',
      editingParam: '',
      params: {
        pv: {}
      },
      lastSendTime: 0,
      pvParams: [
        { key: 'pv.B0', field: 'B0', label: '设置模块工作海拔值', unit: 'm', min: 1000, max: 5000 },
        { key: 'pv.B4', field: 'B4', label: '设置模块输出电流值', unit: 'A' },
        { key: 'pv.B8', field: 'B8', label: '设置组号', unit: '', min: 0, max: 60 },
        { key: 'pv.B16', field: 'B16', label: '设置模块输出功率', unit: 'kW', min: 0.1, max: 1 },
        { key: 'pv.B20', field: 'B20', label: '设置模块输出电压', unit: 'V' },
        { key: 'pv.B24', field: 'B24', label: '设置模块限流点', unit: 'A' },
        { key: 'pv.B28', field: 'B28', label: '设置模块输出电压上限值', unit: 'V' }
      ],
      pvSwitchParams: [
        { key: 'pv.B12', label: '设置模块地址分配方式', options: [
          { label: '自动分配', value: '0x00000000' },
          { label: '拨码设置', value: '0x00010000' }
        ]},
        { key: 'pv.B32', label: '开关机', options: [
          { label: '开机', value: '0x00010000' },
          { label: '关机', value: '0x00000000' }
        ]},
        { key: 'pv.B36', label: '设置模块过压复位', options: [
          { label: '禁止', value: '0x00000000' },
          { label: '复位', value: '0x00010000' }
        ]},
        { key: 'pv.B40', label: '设置模块输出过压保护关联是否允许', options: [
          { label: '允许', value: '0x00000000' },
          { label: '禁止', value: '0x00010000' }
        ]},
        { key: 'pv.B44', label: '设置模块短路复位', options: [
          { label: '禁止', value: '0x00000000' },
          { label: '复位', value: '0x00010000' }
        ]},
        { key: 'pv.B48', label: '设置模块输入模式', options: [
          { label: '交流模式', value: '0x00000001' },
          { label: '直流模式', value: '0x00000002' }
        ]}
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
    updateParamValue(field, event) {
      if (this.params && this.params.pv) {
        this.params.pv[field] = event.detail.value
      }
    },
    async submitParam(paramKey, paramName, value) {
      if (value === undefined) {
        value = this.getParamValue(paramKey)
        if (!value && value !== 0) {
          uni.showToast({ title: '请输入参数值', icon: 'none' })
          return
        }
      }

      let registerValue = value
      if (paramKey === 'pv.B16') {
        registerValue = parseFloat(value) * 20000
      }

      uni.showLoading({ title: '下发中...' })
      try {
        const registerMap = {
          'pv.B0': '0', 'pv.B4': '4', 'pv.B8': '8',
          'pv.B12': '12', 'pv.B16': '16', 'pv.B20': '20',
          'pv.B24': '24', 'pv.B28': '28', 'pv.B32': '32',
          'pv.B36': '36', 'pv.B40': '40', 'pv.B44': '44',
          'pv.B48': '48'
        }
        const registerAddress = registerMap[paramKey] || '00000000'

        const commandData = {
          apiSufix: 'multiControl',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '171E',
            addr: 6,
            deviceId: '6',
            registerAddress: registerAddress,
            registerValue: registerValue.toString().padStart(8, '0'),
            valueType: '01',
            registerType: '03',
            extra1: '00',
            extra2: '00',
            extra3: '00'
          }]
        }

        await sendCommandFrame(commandData)
        uni.hideLoading()
        // this.$emit('cancelParam')
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

      const param = this.pvSwitchParams.find(p => p.key === paramKey)
      if (param) {
        let hexValue = '0x00010000'
        if (value === '0x00000000' || value === 'none' || value === 'off') {
          hexValue = '0x00000000'
        } else if (value === 'grid') {
          hexValue = '0x00000000'
        } else if (value === 'offgrid') {
          hexValue = '0x00020000'
        } else if (value === 'auto') {
          hexValue = '0x00000000'
        } else if (value === 'on') {
          hexValue = '0x00010000'
        } else {
          hexValue = value
        }

        this.clickedButton = paramKey + '-' + value
        this.lastSendTime = now

        setTimeout(() => {
          this.clickedButton = ''
        }, 5000)

        this.submitParam(paramKey, param.label, hexValue)
      }
    },
    handleEditConfig() {
      this.isEditing = true
    },
    closeEdit() {
      this.isEditing = false
      this.editingParam = ''
    },
    handleParamEdit(paramKey) {
      this.editingParam = paramKey
    },
    handleParamCancel() {
      this.editingParam = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.pv-settings {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.action-btns {
  display: flex;
  gap: 16rpx;
}

.edit-btn {
  padding: 8rpx 24rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  
  &.primary {
    background: #6699ff;
    color: #ffffff;
  }
  
  &.close {
    background: #f5f5f5;
    color: #666;
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
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.param-name {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  width:40%;
  max-width: fit-content;
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
  width: 80rpx;
  text-align: left;
}

.btn-group {
  display: flex;
  gap: 12rpx;
  flex-direction: column;
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
  padding: 12rpx 20rpx;
  font-size: 22rpx;
  border: 1rpx solid #6699ff;
  border-radius: 6rpx;
  color: #6699ff;
  background: #ffffff;
  transition: all 0.15s ease;
  white-space: normal;
  word-break: break-all;
  text-align: center;
  width: 100rpx;
  line-height: 1.5;
  // min-height: 80rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: fit-content;

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