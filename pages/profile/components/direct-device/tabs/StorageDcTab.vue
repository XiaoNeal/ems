<template>
  <scroll-view class="module-scroll" scroll-y="true">
    <view class="content">
      <view class="module">
        <view class="module-title">储能DC</view>
        <DataGroup title="DCDC状态">
          <DataGrid :items="[
            { label: '故障标志', value: formattedValues['171D_B0'] },
            { label: '运行状态', value: formattedValues['171D_B2'] },
            { label: '工作状态', value: formattedValues['171D_B4'] },
            { label: '充电模式', value: formattedValues['171D_B6'] },
            { label: '电池电压(V)', value: formattedValues['171D_B8'] },
            { label: '电池电流(A)', value: formattedValues['171D_B10'] },
            { label: '充电功率(kW)', value: formattedValues['171D_B12'] },
            { label: '放电功率(kW)', value: formattedValues['171D_B14'] },
            { label: 'BUS电压(V)', value: formattedValues['171D_B16'] },
            { label: 'BUS+(V)', value: formattedValues['171D_B18'] },
            { label: 'BUS-(V)', value: formattedValues['171D_B20'] }
          ]" />
        </DataGroup>
        <DataGroup title="DCDC电气参数">
          <DataGrid :items="[
            { label: '环境温度(℃)', value: formattedValues['171D_B22'] }
          ]" />
        </DataGroup>
        <DataGroup title="DCDC报警状态">
          <StatusGrid variant="fault" :items="dcdcAlarmStatus" />
        </DataGroup>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { DCDC_ALARM_FIELDS } from '../../../direct-device-constants.js'
import DataGroup from '../DataGroup.vue'
import DataGrid from '../DataGrid.vue'
import StatusGrid from '../StatusGrid.vue'

/**
 * 储能DC tab 组件
 * 展示 DCDC 状态、电气参数、报警状态
 * dcdcAlarmStatus 计算属性内聚于此组件
 */
export default {
  name: 'StorageDcTab',
  components: { DataGroup, DataGrid, StatusGrid },
  props: {
    formattedValues: {
      type: Object,
      default: () => ({})
    },
    rawValues: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    dcdcAlarmStatus() {
      const data = this.rawValues['171D'] || {}
      return DCDC_ALARM_FIELDS.map(f => {
        const value = data[f.key]
        return { name: f.name, value: value || '--', isAlarm: value === '告警' || Number(value) === 1 }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.module-scroll {
  height: 100%;
}
.content {
  padding: 0 16rpx 20rpx;
}
.module {
  padding: 20rpx 0;
}
.module-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  padding-left: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 4rpx;
    bottom: 14rpx;
    width: 6rpx;
    border-radius: 3rpx;
    background: #007aff;
  }
}
</style>
