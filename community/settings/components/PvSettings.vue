<template>
  <view class="pv-settings">
    <view class="param-card">
      <view class="card-header">
        <text class="card-title">光伏DC/DC</text>
      </view>
      
      <!-- 开关型参数 -->
      <view class="switch-section">
        <view v-for="param in pvSwitchParams" :key="param.key" class="param-row">
          <text class="param-name">{{ param.label }}</text>
          <view class="switch-btns">
            <view 
              v-for="option in param.options" 
              :key="option.value" 
              class="switch-btn"
              :class="[
                getParamValue(param.key) === option.value ? 'btn-active' : '', 
                !isEditing ? 'btn-disabled' : '',
                clickedButton === param.key + '-' + option.value ? 'btn-clicked' : ''
              ]"
              @click="setSwitchParam(param.key, option.value)"
            >
              {{ option.label }}
            </view>
          </view>
        </view>
      </view>

      <!-- 数值型参数 -->
      <view class="divider"></view>
      <view class="param-list">
        <view v-for="param in pvParams" :key="param.key" class="param-row">
          <text class="param-name">{{ param.label }}</text>
          <view class="param-right">
            <view class="param-value-box" :class="{ editing: editingParam === param.key }">
              <text v-if="editingParam !== param.key" class="val-text">{{ (params && params.pv && params.pv[param.field]) || "--" }}</text>
              <input v-else class="val-input" type="number" :value="params && params.pv && params.pv[param.field]" @input="updateParamValue(param.field, $event)" placeholder="请输入" focus />
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
  name: 'PvSettings',
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
      deviceAddress: '03',
      clickedButton: '',
      lastSendTime: 0,
      pvParams: [
        { key: 'pv.B0', field: 'B0', label: '设置模块工作海拔值', unit: 'm' },
        { key: 'pv.B4', field: 'B4', label: '设置模块输出电流值', unit: 'A' },
        { key: 'pv.B8', field: 'B8', label: '设置组号', unit: '' },
        { key: 'pv.B16', field: 'B16', label: '设置模块输出功率', unit: 'kW' },
        { key: 'pv.B20', field: 'B20', label: '设置模块输出电压', unit: 'V' },
        { key: 'pv.B24', field: 'B24', label: '设置模块限流点', unit: 'A' },
        { key: 'pv.B28', field: 'B28', label: '设置模块输出电压上限值', unit: 'V' }
      ],
      pvSwitchParams: [
        { key: 'pv.B12', label: '设置模块地址分配方式', options: [
          { label: '自动分配', value: 'auto' },
          { label: '拨码设置', value: 'dip' }
        ]},
        { key: 'pv.B32', label: '开关机', options: [
          { label: '开机', value: 'on' },
          { label: '关机', value: 'off' }
        ]},
        { key: 'pv.B36', label: '设置模块过压复位', options: [
          { label: '禁止', value: 'disable' },
          { label: '复位', value: 'reset' }
        ]},
        { key: 'pv.B40', label: '设置模块输出过压保护关联是否允许', options: [
          { label: '允许', value: 'allow' },
          { label: '禁止', value: 'forbid' }
        ]},
        { key: 'pv.B44', label: '设置模块短路复位', options: [
          { label: '禁止', value: 'disable' },
          { label: '复位', value: 'reset' }
        ]},
        { key: 'pv.B48', label: '设置模块输入模式', options: [
          { label: '交流模式', value: 'ac' },
          { label: '直流模式', value: 'dc' }
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
            registerValue: value.toString().padStart(8, '0'),
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
      if (!this.params || !this.params[module]) {
        return ''
      }
      const hexValue = this.params[module][key]
      
      if (paramKey === 'pv.B12') {
        return hexValue === '0x00030000' ? 'auto' : 'dip'
      } else if (paramKey === 'pv.B32') {
        return hexValue === '0x00010000' ? 'on' : 'off'
      } else if (paramKey === 'pv.B36') {
        return hexValue === '0x00010000' ? 'reset' : 'disable'
      } else if (paramKey === 'pv.B40') {
        return hexValue === '0x00010000' ? 'allow' : 'forbid'
      } else if (paramKey === 'pv.B44') {
        return hexValue === '0x00010000' ? 'reset' : 'disable'
      } else if (paramKey === 'pv.B48') {
        return hexValue === '0x00000001' ? 'ac' : 'dc'
      }
      
      return hexValue
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
        if (value === 'disable' || value === 'forbid' || value === 'off') {
          hexValue = '0x00000000'
        } else if (value === 'reset' || value === 'allow' || value === 'on') {
          hexValue = '0x00010000'
        } else if (value === 'auto') {
          hexValue = '0x00030000'
        } else if (value === 'dip') {
          hexValue = '0x00010000'
        } else if (value === 'ac') {
          hexValue = '0x00000001'
        } else if (value === 'dc') {
          hexValue = '0x00000002'
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
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.param-list {
  padding: 0 32rpx;
}

.param-row {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.param-name {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  margin-right:2px;
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
  padding: 0 32rpx;
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
    background: #f5f5f5;
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
  border-color: #6699ff !important;
  color: #ffffff !important;
  background: #6699ff !important;
  box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.4) !important;
}

.btn-disabled {
  opacity: 0.7;
  pointer-events: none;
}
</style>