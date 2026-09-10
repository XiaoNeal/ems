<template>
  <scroll-view class="module-scroll" scroll-y="true">
    <view class="content">
      <view class="module">
        <view class="module-title">光伏</view>
        <DataGroup title="运行状态">
          <DataGrid :items="pvRunStatusItems" />
        </DataGroup>
        <DataGroup title="电气参数">
          <DataGrid :items="[
            { label: 'BUS侧电压(V)', value: formattedValues['171E_B0'] },
            { label: '模块电流(A)', value: formattedValues['171E_B4'] },
            { label: '模块限流点', value: formattedValues['171E_B8'] },
            { label: 'DC板温度(℃)', value: formattedValues['171E_B12'] },
            { label: '光伏侧电压(V)', value: formattedValues['171E_B16'] },
            { label: 'PFC0电压(V)', value: formattedValues['171E_B20'] },
            { label: 'PFC1电压(V)', value: formattedValues['171E_B24'] },
            { label: '面板温度(℃)', value: formattedValues['171E_B28'] },
            { label: 'PFC板温度(℃)', value: formattedValues['171E_B44'] },
            { label: '输入功率(kW)', value: formattedValues['171E_B64'] }
          ]" />
        </DataGroup>
        <DataGroup title="告警状态">
          <StatusGrid variant="fault" :items="pvAlarmStatus" />
        </DataGroup>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { PV_B56_BITS } from '../../../direct-device-constants.js'
import DataGroup from '../DataGroup.vue'
import DataGrid from '../DataGrid.vue'
import StatusGrid from '../StatusGrid.vue'

/**
 * 光伏 tab 组件
 * 展示光伏运行状态、电气参数、告警状态
 * parsedB56Status / pvRunStatusItems / pvAlarmStatus 计算属性内聚于此组件
 */
export default {
  name: 'PvTab',
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
    parsedB56Status() {
      const b56 = this.rawValues['171E'] && this.rawValues['171E']['B56']
      if (b56 === undefined || b56 === null || b56 === '--') return []
      const v = Number(b56)
      if (!Number.isFinite(v)) return []
      return PV_B56_BITS.map(([name, bitPos, , isMode]) => {
        if (isMode) {
          return { name, value: (v >> bitPos) & 1 ? '关机' : '开机', isAlarm: 0 }
        }
        const alarmed = (v >> bitPos) & 1
        return { name, value: alarmed ? '发生' : '正常', isAlarm: alarmed ? 1 : 0 }
      })
    },
    /** 运行状态项：合并 B56 的 DCDC状态 + 171E.B72 工作模式 */
    pvRunStatusItems() {
      const items = this.parsedB56Status
        .filter(s => ['DCDC状态'].includes(s.name))
        .map(s => ({ label: s.name, value: s.value }))
      if (this.rawValues['171E'] && this.rawValues['171E']['B72'] !== undefined) {
        items.push({ label: '工作模式', value: this.formattedValues['171E_B72'] || '--' })
      }
      return items
    },
    /** 告警状态项：排除 DCDC状态 */
    pvAlarmStatus() {
      return this.parsedB56Status.filter(s => s.name !== 'DCDC状态')
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
