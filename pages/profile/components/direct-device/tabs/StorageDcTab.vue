<template>
  <scroll-view class="module-scroll" scroll-y="true">
    <view class="content">
      <!-- 50kW：170C V1.1 协议面板 -->
      <view v-if="is50KwMode" class="module">
        <view class="module-title">储能DCDC模块</view>
        <Dc170cPanel :bucket="bucket50" faultTitle="储能DC故障信息" />
      </view>

      <!-- 20kW：171D 旧协议 -->
      <view v-else class="module">
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
import Dc170cPanel from './Dc170cPanel.vue'

/**
 * 储能DC tab 组件
 * 20kW：旧协议 171D（DCDC 状态 + 报警位）
 * 50kW：新协议 170C V1.1（bucket 170C_STORAGE）
 */
export default {
  name: 'StorageDcTab',
  components: { DataGroup, DataGrid, StatusGrid, Dc170cPanel },
  props: {
    formattedValues: {
      type: Object,
      default: () => ({})
    },
    rawValues: {
      type: Object,
      default: () => ({})
    },
    is50KwMode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bucket50() {
      return this.rawValues['170C_STORAGE'] || {}
    },
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
  padding: 0 20rpx 32rpx;
}
.module {
  padding: 0;
}
.module-title {
  display: flex;
  align-items: center;
  margin: 0 0 18rpx;
  padding-left: 18rpx;
  position: relative;
  font-size: 30rpx;
  font-weight: 600;
  color: #1d2430;
  letter-spacing: 0.5rpx;
  line-height: 1.3;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8rpx;
    height: 30rpx;
    border-radius: 4rpx;
    background: linear-gradient(180deg, #63a4ff 0%, #2f7cf6 100%);
  }
}
</style>
