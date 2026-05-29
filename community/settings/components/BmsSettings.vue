<template>
  <view class="bms-settings">
    <view class="control-section">
      <text class="section-title">BMS参数设置</text>

      <view v-for="param in bmsParams" :key="param.key" class="param-item">
        <text class="param-label">{{ param.label }}</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === param.key }">
            <text v-if="editingParam !== param.key" class="param-value">{{ params.bms[param.field] || "--" }}</text>
            <input v-else type="number" v-model="params.bms[param.field]" placeholder="请输入" focus />
          </view>
          <text class="param-unit">{{ param.unit }}</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== param.key" class="param-btn edit" @click="$emit('edit', param.key)">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam(param.key, param.label)">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'

export default {
  name: 'BmsSettings',
  props: {
    params: {
      type: Object,
      required: true
    },
    editingParam: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      idCode: 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF',
      deviceAddress: '04',
      userId: 0,
      bmsParams: [
        { key: 'bms.B0', field: 'B0', label: '组端过压 1 级报警阈值', unit: 'V' },
        { key: 'bms.B2', field: 'B2', label: '组端过压 2 级报警阈值', unit: 'V' },
        { key: 'bms.B4', field: 'B4', label: '组端过压 3 级报警阈值', unit: 'V' },
        { key: 'bms.B6', field: 'B6', label: '组端过压报警回差值', unit: 'V' },
        { key: 'bms.B8', field: 'B8', label: '组端欠压 1 级报警阈值', unit: 'V' },
        { key: 'bms.B10', field: 'B10', label: '组端欠压 2 级报警阈值', unit: 'V' },
        { key: 'bms.B12', field: 'B12', label: '组端欠压 3 级报警阈值', unit: 'V' },
        { key: 'bms.B14', field: 'B14', label: '组端欠压报警回差值', unit: 'V' },
        { key: 'bms.B16', field: 'B16', label: '组端放电过流 1 级报警阈值', unit: 'A' },
        { key: 'bms.B18', field: 'B18', label: '组端放电过流 2 级报警阈值', unit: 'A' },
        { key: 'bms.B20', field: 'B20', label: '组端放电过流 3 级报警阈值', unit: 'A' },
        { key: 'bms.B22', field: 'B22', label: '组端放电过流报警回差值', unit: 'A' },
        { key: 'bms.B24', field: 'B24', label: '组端充电过流 1 级报警阈值', unit: 'A' },
        { key: 'bms.B26', field: 'B26', label: '组端充电过流 2 级报警阈值', unit: 'A' },
        { key: 'bms.B28', field: 'B28', label: '组端充电过流 3 级报警阈值', unit: 'A' },
        { key: 'bms.B30', field: 'B30', label: '组端充电过流报警回差值', unit: 'A' },
        { key: 'bms.B32', field: 'B32', label: '组端绝缘 1 级报警阈值', unit: 'kΩ' },
        { key: 'bms.B34', field: 'B34', label: '组端绝缘 2 级报警阈值', unit: 'kΩ' },
        { key: 'bms.B36', field: 'B36', label: '组端绝缘 3 级报警阈值', unit: 'kΩ' },
        { key: 'bms.B38', field: 'B38', label: '组端绝缘报警回差值', unit: 'kΩ' },
        { key: 'bms.B40', field: 'B40', label: '单体充电过温 1 级报警阈值', unit: '℃' },
        { key: 'bms.B42', field: 'B42', label: '单体充电过温 2 级报警阈值', unit: '℃' },
        { key: 'bms.B44', field: 'B44', label: '单体充电过温 3 级报警阈值', unit: '℃' },
        { key: 'bms.B46', field: 'B46', label: '电池充电过温报警回差值', unit: '℃' },
        { key: 'bms.B48', field: 'B48', label: '单体充电欠温 1 级报警阈值', unit: '℃' },
        { key: 'bms.B50', field: 'B50', label: '单体充电欠温 2 级报警阈值', unit: '℃' },
        { key: 'bms.B52', field: 'B52', label: '单体充电欠温 3 级报警阈值', unit: '℃' },
        { key: 'bms.B54', field: 'B54', label: '单体充电欠温报警回差值', unit: '℃' },
        { key: 'bms.B56', field: 'B56', label: '单体电压过压 1 级报警阈值', unit: 'mV' },
        { key: 'bms.B58', field: 'B58', label: '单体电压过压 2 级报警阈值', unit: 'mV' },
        { key: 'bms.B60', field: 'B60', label: '单体电压过压 3 级报警阈值', unit: 'mV' },
        { key: 'bms.B62', field: 'B62', label: '单体电压过压报警回差值', unit: 'mV' },
        { key: 'bms.B64', field: 'B64', label: '单体电压欠压 1 级报警阈值', unit: 'mV' },
        { key: 'bms.B66', field: 'B66', label: '单体电压欠压 2 级报警阈值', unit: 'mV' },
        { key: 'bms.B68', field: 'B68', label: '单体电压欠压 3 级报警阈值', unit: 'mV' },
        { key: 'bms.B70', field: 'B70', label: '单体电压欠压报警回差值', unit: 'mV' },
        { key: 'bms.B72', field: 'B72', label: '单体电压差压 1 级报警阈值', unit: 'mV' },
        { key: 'bms.B74', field: 'B74', label: '单体电压差压 2 级报警阈值', unit: 'mV' },
        { key: 'bms.B76', field: 'B76', label: '单体电压差压 3 级报警阈值', unit: 'mV' },
        { key: 'bms.B78', field: 'B78', label: '单体电压差压报警回差值', unit: 'mV' },
        { key: 'bms.B80', field: 'B80', label: '单体温度温差 1 级报警阈值', unit: '℃' },
        { key: 'bms.B82', field: 'B82', label: '单体温度温差 2 级报警阈值', unit: '℃' },
        { key: 'bms.B84', field: 'B84', label: '单体温度温差 3 级报警阈值', unit: '℃' },
        { key: 'bms.B86', field: 'B86', label: '单体温度温差报警回差值', unit: '℃' },
        { key: 'bms.B88', field: 'B88', label: 'SOC 过低 1 级报警阈值', unit: '%' },
        { key: 'bms.B90', field: 'B90', label: 'SOC 过低 2 级报警阈值', unit: '%' },
        { key: 'bms.B92', field: 'B92', label: 'SOC 过低 3 级报警阈值', unit: '%' },
        { key: 'bms.B94', field: 'B94', label: 'SOC 过低报警回差值', unit: '%' },
        { key: 'bms.B96', field: 'B96', label: '动力插箱温度过高 1 级报警阈值', unit: '℃' },
        { key: 'bms.B98', field: 'B98', label: '动力插箱温度过高 2 级报警阈值', unit: '℃' },
        { key: 'bms.B100', field: 'B100', label: '动力插箱温度过高 3 级报警阈值', unit: '℃' },
        { key: 'bms.B102', field: 'B102', label: '动力插箱温度过高报警回差值', unit: '℃' },
        { key: 'bms.B104', field: 'B104', label: '电池模组过压 1 级报警阈值', unit: 'V' },
        { key: 'bms.B106', field: 'B106', label: '电池模组过压 2 级报警阈值', unit: 'V' },
        { key: 'bms.B108', field: 'B108', label: '电池模组过压 3 级报警阈值', unit: 'V' },
        { key: 'bms.B110', field: 'B110', label: '电池模组过压报警回差值', unit: 'V' },
        { key: 'bms.B112', field: 'B112', label: '电池模组欠压 1 级报警阈值', unit: 'V' },
        { key: 'bms.B114', field: 'B114', label: '电池模组欠压 2 级报警阈值', unit: 'V' },
        { key: 'bms.B116', field: 'B116', label: '电池模组欠压 3 级报警阈值', unit: 'V' },
        { key: 'bms.B118', field: 'B118', label: '电池模组欠压报警回差值', unit: 'V' },
        { key: 'bms.B120', field: 'B120', label: '单体放电过温 1 级报警阈值', unit: '℃' },
        { key: 'bms.B122', field: 'B122', label: '单体放电过温 2 级报警阈值', unit: '℃' },
        { key: 'bms.B124', field: 'B124', label: '单体放电过温 3 级报警阈值', unit: '℃' },
        { key: 'bms.B126', field: 'B126', label: '单体放电过温报警回差值', unit: '℃' },
        { key: 'bms.B128', field: 'B128', label: '单体放电欠温 1 级报警阈值', unit: '℃' },
        { key: 'bms.B130', field: 'B130', label: '单体放电欠温 2 级报警阈值', unit: '℃' },
        { key: 'bms.B132', field: 'B132', label: '单体放电欠温 3 级报警阈值', unit: '℃' },
        { key: 'bms.B134', field: 'B134', label: '电池放电欠温报警回差值', unit: '℃' },
        { key: 'bms.B136', field: 'B136', label: 'SOC 过高 1 级报警阈值', unit: '%' },
        { key: 'bms.B138', field: 'B138', label: 'SOC 过高 2 级报警阈值', unit: '%' },
        { key: 'bms.B140', field: 'B140', label: 'SOC 过高 3 级报警阈值', unit: '%' },
        { key: 'bms.B142', field: 'B142', label: 'SOC 过高报警回差值', unit: '%' },
        { key: 'bms.B144', field: 'B144', label: '温升快 1 级报警阈值', unit: '℃/min' },
        { key: 'bms.B146', field: 'B146', label: '温升快 2 级报警阈值', unit: '℃/min' },
        { key: 'bms.B148', field: 'B148', label: '温升快 3 级报警阈值', unit: '℃/min' },
        { key: 'bms.B150', field: 'B150', label: '温升快报警回差值', unit: '℃/min' }
      ]
    }
  },
  methods: {
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
          'bms.B0': '00000000', 'bms.B2': '00000002', 'bms.B4': '00000004',
          'bms.B6': '00000006', 'bms.B8': '00000008', 'bms.B10': '0000000A',
          'bms.B12': '0000000C', 'bms.B14': '0000000E', 'bms.B16': '00000010',
          'bms.B18': '00000012', 'bms.B20': '00000014', 'bms.B22': '00000016',
          'bms.B24': '00000018', 'bms.B26': '0000001A', 'bms.B28': '0000001C',
          'bms.B30': '0000001E', 'bms.B32': '00000020', 'bms.B34': '00000022',
          'bms.B36': '00000024', 'bms.B38': '00000026', 'bms.B40': '00000028',
          'bms.B42': '0000002A', 'bms.B44': '0000002C', 'bms.B46': '0000002E',
          'bms.B48': '00000030', 'bms.B50': '00000032', 'bms.B52': '00000034',
          'bms.B54': '00000036', 'bms.B56': '00000038', 'bms.B58': '0000003A',
          'bms.B60': '0000003C', 'bms.B62': '0000003E', 'bms.B64': '00000040',
          'bms.B66': '00000042', 'bms.B68': '00000044', 'bms.B70': '00000046',
          'bms.B72': '00000048', 'bms.B74': '0000004A', 'bms.B76': '0000004C',
          'bms.B78': '0000004E', 'bms.B80': '00000050', 'bms.B82': '00000052',
          'bms.B84': '00000054', 'bms.B86': '00000056', 'bms.B88': '00000058',
          'bms.B90': '0000005A', 'bms.B92': '0000005C', 'bms.B94': '0000005E',
          'bms.B96': '00000060', 'bms.B98': '00000062', 'bms.B100': '00000064',
          'bms.B102': '00000066', 'bms.B104': '00000068', 'bms.B106': '0000006A',
          'bms.B108': '0000006C', 'bms.B110': '0000006E', 'bms.B112': '00000070',
          'bms.B114': '00000072', 'bms.B116': '00000074', 'bms.B118': '00000076',
          'bms.B120': '00000078', 'bms.B122': '0000007A', 'bms.B124': '0000007C',
          'bms.B126': '0000007E', 'bms.B128': '00000080', 'bms.B130': '00000082',
          'bms.B132': '00000084', 'bms.B134': '00000086', 'bms.B136': '00000088',
          'bms.B138': '0000008A', 'bms.B140': '0000008C', 'bms.B142': '0000008E',
          'bms.B144': '00000090', 'bms.B146': '00000092', 'bms.B148': '00000094',
          'bms.B150': '00000096'
        }
        const registerAddress = registerMap[paramKey] || '00000000'

        const commandData = {
          apiSufix: 'multiControl',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '0105',
            addr: this.deviceAddress,
            deviceId: '0064',
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
    }
  }
}
</script>

<style lang="scss" scoped>
.bms-settings {
  .control-section {
    background: #ffffff;
    border-radius: 20rpx;
    padding: 28rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
  }

  .section-title {
    font-size: 32rpx;
    color: #1F2937;
    font-weight: 600;
    margin-bottom: 28rpx;
    padding-left: 20rpx;
    border-left: 6rpx solid #4488FB;
    display: block;
  }

  .param-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #F3F4F6;

    &:last-child {
      border-bottom: none;
    }
  }

  .param-label {
    font-size: 28rpx;
    color: #374151;
    flex-shrink: 0;
    width: 340rpx;
    font-weight: 500;
    word-break: break-all;
    line-height: 1.4;
  }

  .param-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8rpx;
    min-width: 0;
  }

  .param-input {
    background: #F8FAFC;
    border-radius: 12rpx;
    padding: 12rpx 20rpx;
    min-width: 120rpx;
    max-width: 180rpx;
    text-align: center;
    border: 2rpx solid transparent;
    flex-shrink: 0;

    &.editing {
      background: #E8F0FE;
      border-color: #4488FB;
      box-shadow: 0 0 0 4rpx rgba(68, 136, 251, 0.1);
    }
  }

  .param-value {
    font-size: 28rpx;
    color: #1F2937;
    font-weight: 500;
  }

  .param-unit {
    font-size: 24rpx;
    color: #9CA3AF;
    flex-shrink: 0;
  }

  .param-actions {
    display: flex;
    gap: 16rpx;
    flex-shrink: 0;
    margin-left: 20rpx;
  }

  .param-btn {
    padding: 14rpx 28rpx;
    border-radius: 10rpx;
    font-size: 26rpx;
    font-weight: 500;
    border: 2rpx solid transparent;

    &.edit {
      background: #F8FAFC;
      color: #4488FB;
      border-color: #E4E7ED;
    }

    &.confirm {
      background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
      color: #ffffff;
      box-shadow: 0 4rpx 16rpx rgba(68, 136, 251, 0.3);
    }

    &.cancel {
      background: #F3F4F6;
      color: #6B7280;
    }

    &:active {
      transform: scale(0.96);
    }
  }

  input {
    font-size: 28rpx;
    color: #1F2937;
    text-align: center;
    background: transparent;
    border: none;
    outline: none;
  }

  input::placeholder {
    color: #9CA3AF;
  }
}
</style>