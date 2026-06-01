<template>
  <view class="storage-settings">
    <view class="param-card">
      <view class="card-header">
        <text class="card-title">储能DC/DC 参数设置</text>
      </view>
      
      <!-- 开关型参数 -->
      <view class="switch-section">
        <view v-for="param in storageSwitchParams" :key="param.key" class="param-row">
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
        <view v-for="param in storageParams" :key="param.key" class="param-row">
          <text class="param-name">{{ param.label }}</text>
          <view class="param-right">
            <view class="param-value-box" :class="{ editing: editingParam === param.key }">
              <text v-if="editingParam !== param.key" class="val-text">{{ params.storage[param.field] || "--" }}</text>
              <input v-else class="val-input" type="number" v-model="params.storage[param.field]" placeholder="请输入" />
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
  name: 'StorageSettings',
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
      deviceAddress: '02',
      clickedButton: '',
      lastSendTime: 0,
      storageParams: [
        { key: 'storage.B16', field: 'B16', label: '组ID号', unit: '' },
        { key: 'storage.B18', field: 'B18', label: '模块数量', unit: '' },
        { key: 'storage.B22', field: 'B22', label: '直流母线电压', unit: 'V' },
        { key: 'storage.B26', field: 'B26', label: '充放电功率设定', unit: 'kW' },
        { key: 'storage.B28', field: 'B28', label: '电池均充电压', unit: 'V' },
        { key: 'storage.B30', field: 'B30', label: '充电电流设置', unit: 'A' },
        { key: 'storage.B32', field: 'B32', label: '电池浮充电压', unit: 'V' },
        { key: 'storage.B34', field: 'B34', label: '放电电压设置', unit: 'V' },
        { key: 'storage.B36', field: 'B36', label: '放电电流设置', unit: 'A' },
        { key: 'storage.B38', field: 'B38', label: '电池过压关机点', unit: 'V' },
        { key: 'storage.B40', field: 'B40', label: '电池低压告警点', unit: 'V' },
        { key: 'storage.B42', field: 'B42', label: '电池低压关机点', unit: 'V' },
        { key: 'storage.B48', field: 'B48', label: '充电母线电压上限', unit: 'V' },
        { key: 'storage.B50', field: 'B50', label: '放电母线电压下限', unit: 'V' }
      ],
      storageSwitchParams: [
        { key: 'storage.B0', label: 'Can波特率设置', options: [
          { label: '1000kbps', value: '0' },
          { label: '500kbps', value: '1' },
          { label: '250kbps', value: '2' },
          { label: '125kbps', value: '3' }
        ]},
        { key: 'storage.B2', label: '认证标准码', options: [
          { label: '中国标准I', value: '0' },
          { label: '中国标准II', value: '1' },
          { label: '美国标准', value: '2' },
          { label: '德国标准', value: '3' }
        ]},
        { key: 'storage.B4', label: '机器类型', options: [
          { label: 'IBDC30060', value: '1' },
          { label: 'IBG30060', value: '2' }
        ]},
        { key: 'storage.B8', label: '运行模式设置', options: [
          { label: '自适应', value: '0' },
          { label: '并网', value: '1' },
          { label: '离网', value: '2' }
        ]},
        { key: 'storage.B10', label: '运行状态设置', options: [
          { label: '待机', value: '0' },
          { label: '充电', value: '1' },
          { label: '放电', value: '2' },
          { label: 'BAT自动', value: '3' },
          { label: 'BUS自动', value: '4' },
          { label: '关充电', value: '5' },
          { label: '高压PV', value: '6' },
          { label: '低压PV', value: '7' }
        ]},
        { key: 'storage.B12', label: '系统开关机', options: [
          { label: '开机', value: 'on' },
          { label: '关机', value: 'off' }
        ]},
        { key: 'storage.B14', label: '恢复出厂设置', options: [
          { label: '恢复所有值', value: 'all' },
          { label: '恢复用户值', value: 'user' }
        ]},
        { key: 'storage.B20', label: '电池类型', options: [
          { label: '铅酸电池', value: '0' },
          { label: '锂电池', value: '1' }
        ]},
        { key: 'storage.B24', label: '充放电指令', options: [
          { label: '待机', value: '0' },
          { label: '充电', value: '1' },
          { label: '放电', value: '2' },
          { label: 'BAT自动', value: '3' },
          { label: 'BUS自动', value: '4' },
          { label: '关充电', value: '5' },
          { label: '高压PV', value: '6' },
          { label: '低压PV', value: '7' }
        ]},
        { key: 'storage.B44', label: '电池激活功能', options: [
          { label: '禁止', value: '0' },
          { label: '使能', value: '1' }
        ]},
        { key: 'storage.B46', label: '自动重启功能', options: [
          { label: '禁止', value: '0' },
          { label: '使能', value: '1' }
        ]},
        { key: 'storage.B53b0', label: 'CAN通讯使能位', options: [
          { label: '禁止', value: '0' },
          { label: '使能', value: '1' }
        ]},
        { key: 'storage.B53b1', label: '485通讯使能位', options: [
          { label: '禁止', value: '0' },
          { label: '使能', value: '1' }
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
          'storage.B0': '0', 'storage.B2': '2', 'storage.B4': '4',
          'storage.B6': '6', 'storage.B8': '8', 'storage.B10': '10',
          'storage.B12': '12', 'storage.B14': '14', 'storage.B16': '16',
          'storage.B18': '18', 'storage.B20': '20', 'storage.B22': '22',
          'storage.B24': '24', 'storage.B26': '26', 'storage.B28': '28',
          'storage.B30': '30', 'storage.B32': '32', 'storage.B34': '34',
          'storage.B36': '36', 'storage.B38': '38', 'storage.B40': '40',
          'storage.B42': '42', 'storage.B44': '44', 'storage.B46': '46',
          'storage.B48': '48', 'storage.B50': '50'
        }
        const registerAddress = registerMap[paramKey] || '00000000'

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
      return this.params[module][key]
    },
    setSwitchParam(paramKey, value) {
      if (!this.checkEditMode()) return
      
      const now = Date.now()
      if (now - this.lastSendTime < 5000) {
        uni.showToast({ title: '请间隔5秒后再下发', icon: 'none' })
        return
      }
      
      const param = this.storageSwitchParams.find(p => p.key === paramKey)
      if (param) {
        let hexValue = '0x00000000'
        
        if (paramKey === 'storage.B0') {
          const baudValues = { '0': '0x00000000', '1': '0x00010000', '2': '0x00020000', '3': '0x00030000' }
          hexValue = baudValues[value]
        } else if (paramKey === 'storage.B2') {
          const codeValues = { '0': '0x00000000', '1': '0x00010000', '2': '0x00020000', '3': '0x00030000' }
          hexValue = codeValues[value]
        } else if (paramKey === 'storage.B4') {
          const typeValues = { '1': '0x00010000', '2': '0x00020000' }
          hexValue = typeValues[value]
        } else if (paramKey === 'storage.B8') {
          const statusValues = { '0': '0x00000000', '1': '0x00010000', '2': '0x00020000' }
          hexValue = statusValues[value]
        } else if (paramKey === 'storage.B10' || paramKey === 'storage.B24') {
          hexValue = `0x000${value}0000`
        } else if (paramKey === 'storage.B12') {
          if (value === 'on') hexValue = '0x00010000'
          else hexValue = '0x00000000'
        } else if (paramKey === 'storage.B14') {
          if (value === 'all') hexValue = '0x00000000'
          else hexValue = '0x00010000'
        } else if (paramKey === 'storage.B20' || paramKey === 'storage.B44' || paramKey === 'storage.B46' || paramKey === 'storage.B53b0' || paramKey === 'storage.B53b1') {
          const typeValues = { '0': '0x00000000', '1': '0x00010000' }
          hexValue = typeValues[value]
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
.storage-settings {
  background: #f7f8fa;
  min-height: 100vh;
  padding: 20rpx;
}

.param-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.card-header {
  padding: 30rpx 32rpx;
  border-bottom: 1rpx solid #f2f3f5;
  background: #fafbfc;
}

.card-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #1d2129;
}

/* 开关参数区域 */
.switch-section {
  padding: 0 32rpx;
}

/* 统一参数行样式 */
.param-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f2f3f5;

  &:last-child {
    border-bottom: none;
  }
}

.param-name {
  font-size: 28rpx;
  color: #333;
  flex: 0 0 260rpx;
}

.switch-btns {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.switch-btn {
  padding: 14rpx 28rpx;
  font-size: 26rpx;
  border: 1rpx solid #6699ff;
  border-radius: 10rpx;
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

.btn-disabled {
  opacity: 0.7;
  pointer-events: none;
}

.btn-clicked {
  border-color: #4488fb !important;
  color: #ffffff !important;
  background: #4488fb !important;
  box-shadow: 0 4rpx 16rpx rgba(68, 136, 251, 0.4) !important;
}

.divider {
  height: 20rpx;
  background: #f7f8fa;
  margin: 0;
}

/* 数值参数区域 */
.param-list {
  padding: 0 32rpx;
}

.param-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-right: 16rpx;
}

.param-value-box {
  width: 200rpx;
  height: 68rpx;
  line-height: 68rpx;
  background: #f7f8fa;
  border-radius: 12rpx;
  text-align: center;
  font-size: 28rpx;
  
  &.editing {
    background: #ffffff;
    border: 1rpx solid #6699ff;
  }
}

.val-text {
  color: #333;
}

.val-input {
  width: 100%;
  height: 100%;
  font-size: 28rpx;
  text-align: center;
  background: transparent;
  border: none;
  color: #333;
}

.unit-text {
  font-size: 26rpx;
  color: #86909c;
  min-width: 40rpx;
}

.btn-group {
  display: flex;
  gap: 16rpx;
}

.btn {
  padding: 14rpx 28rpx;
  font-size: 26rpx;
  border-radius: 12rpx;
  font-weight: 500;
  transition: all 0.2s;
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
  color: #4e5969;
  background: #f2f3f5;
}
</style>