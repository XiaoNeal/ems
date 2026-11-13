<template>
  <!-- 滚动由页面外层 scroll-view 统一负责，避免嵌套滚动容器 -->
  <view class="panel-root">
    <view class="content">
      <!-- 50kW：170C V1.1 协议面板（bucket 170C_PV） -->
      <view v-if="is50KwMode" class="module">
        <view class="module-title">光伏DCDC设备</view>
        <Dc170cPanel :bucket="bucket50" faultTitle="光伏DC故障信息" />
      </view>

      <!-- 20kW：171E 旧协议 -->
      <view v-else class="module">
        <view class="module-title">光伏</view>
        <DataGroup title="运行状态">
          <DataGrid :items="pvRunStatusItems || []" />
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
          <StatusGrid variant="fault" :items="pvAlarmStatus || []" />
        </DataGroup>
      </view>
    </view>
  </view>
</template>

<script>
import { PV_B56_BITS } from '../../../direct-device-constants.js'
import DataGroup from '../DataGroup.vue'
import DataGrid from '../DataGrid.vue'
import StatusGrid from '../StatusGrid.vue'
import Dc170cPanel from './Dc170cPanel.vue'
import { getFormatted, getSnapshot } from '../realtime-store.js'
import { realtimeSubscribe } from '../realtime-subscribe.js'

/**
 * 光伏 tab 组件
 * 20kW：旧协议 171E（B56 状态位 + 电气参数）
 * 50kW：新协议 170C V1.1（bucket 170C_PV，与储能 DC 同一张点表）
 *
 * ⚡ 实时数据由 realtime-subscribe mixin 订阅仓库驱动，父页面不参与收帧渲染。
 */
export default {
  mixins: [realtimeSubscribe],
  name: 'PvTab',
  components: { DataGroup, DataGrid, StatusGrid, Dc170cPanel },
  props: {
    is50KwMode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedValues() {
      void this.rtVer
      return getFormatted()
    },
    rawValues() {
      void this.rtVer
      return getSnapshot()
    },
    bucket50() {
      return this.rawValues['170C_PV'] || {}
    },
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
    pvRunStatusItems() {
      const items = this.parsedB56Status
        .filter(s => ['DCDC状态'].includes(s.name))
        .map(s => ({ label: s.name, value: s.value }))
      if (this.rawValues['171E'] && this.rawValues['171E']['B72'] !== undefined) {
        items.push({ label: '工作模式', value: this.formattedValues['171E_B72'] || '--' })
      }
      return items
    },
    pvAlarmStatus() {
      return this.parsedB56Status.filter(s => s.name !== 'DCDC状态')
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-root {
  width: 100%;
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
    background: #2f7cf6;
  }
}
</style>
