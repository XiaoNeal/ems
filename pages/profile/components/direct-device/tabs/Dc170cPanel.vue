<template>
  <view class="dc-panel">
    <DataGroup title="运行参数">
      <DataGrid :items="runItems" />
    </DataGroup>

    <DataGroup title="状态参数">
      <view class="state-card">
        <text class="state-title">机器运行状态</text>
        <view class="state-badges">
          <view
            v-for="s in runStateBadges"
            :key="s.name"
            class="badge"
            :class="[s.active ? 'active ' + s.tone : '']"
          >
            <text>{{ s.name }}</text>
          </view>
        </view>
      </view>
    </DataGroup>

    <DataGroup :title="faultTitle">
      <FaultCodeBoard
        :groups="faultGroups"
        :current="faultCode"
        :has-data="hasStateFrame"
        hint="暂无故障码数据"
      />
    </DataGroup>
  </view>
</template>

<script>
import { DC_RUN, DC_RUN_STATE_BITS, DC_ERROR_GROUPS } from '../../../direct-device-50kw-fields.js'
import { fmtItems, decodeRunState } from '../../../direct-device-50kw-format.js'
import DataGroup from '../DataGroup.vue'
import DataGrid from '../DataGrid.vue'
import FaultCodeBoard from '../FaultCodeBoard.vue'

/**
 * 50kW 储能/光伏 DC-DC 面板（170C V1.1）
 * 运行参数取自能源帧，机器运行状态/故障码取自状态帧（S_ 前缀）
 */
export default {
  name: 'Dc170cPanel',
  components: { DataGroup, DataGrid, FaultCodeBoard },
  props: {
    bucket: {
      type: Object,
      default: () => ({})
    },
    faultTitle: {
      type: String,
      default: 'DC故障信息'
    }
  },
  computed: {
    runItems() {
      return fmtItems(DC_RUN, this.bucket)
    },
    /** 是否收到过状态帧（键带 S_ 前缀）。用于避免误读能源帧同号 B 键 */
    hasStateFrame() {
      const b = this.bucket || {}
      return Object.keys(b).some(k => k.indexOf('S_') === 0)
    },
    /** 机器运行状态：状态帧 S_B8；仅有 JSON 直报（无状态帧）时才回退裸 B8 */
    runStateBadges() {
      const raw = this.hasStateFrame ? this.bucket['S_B8'] : this.bucket['B8']
      return decodeRunState(DC_RUN_STATE_BITS, raw)
    },
    /** 故障码：状态帧 S_B10（能源帧同名 B10 是下垂电压系数，不能混用） */
    faultCode() {
      const raw = this.hasStateFrame ? this.bucket['S_B10'] : this.bucket['B10']
      if (raw === undefined || raw === null || raw === '') return NaN
      const num = Number(raw)
      return Number.isFinite(num) ? num : NaN
    },
    faultGroups() {
      return DC_ERROR_GROUPS
    }
  }
}
</script>
<style lang="scss" scoped>
.state-card {
  background: #ffffff;
  border: 1rpx solid #eef1f5;
  border-radius: 16rpx;
  padding: 18rpx 18rpx 12rpx;
}
.state-title {
  font-size: 22rpx;
  color: #78838f;
  letter-spacing: 0.2rpx;
  display: block;
  margin-bottom: 12rpx;
}
.state-badges {
  display: flex;
  flex-wrap: wrap;
  margin: -5rpx;
}
.badge {
  padding: 9rpx 18rpx;
  margin: 5rpx;
  border-radius: 10rpx;
  background: #f8fafc;
  border: 1rpx solid #eef1f5;
  text {
    font-size: 22rpx;
    color: #9aa4b1;
  }
  &.active.green {
    background: #f2fbf5;
    border-color: #c6ecd2;
    text { color: #1f9254; font-weight: 600; }
  }
  &.active.red {
    background: #fff2f0;
    border-color: #ffd3cd;
    text { color: #e5484d; font-weight: 600; }
  }
  &.active.orange {
    background: #fff8ec;
    border-color: #ffdfae;
    text { color: #d9820a; font-weight: 600; }
  }
  &.active.blue {
    background: #eef5ff;
    border-color: #cfe3ff;
    text { color: #2f7cf6; font-weight: 600; }
  }
}

/* 故障码区由 FaultCodeBoard 组件渲染，样式见 FaultCodeBoard.vue */
</style>
