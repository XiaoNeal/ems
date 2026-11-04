<template>
  <scroll-view class="module-scroll" scroll-y="true">
    <view class="content">
      <!-- 50kW：171C V2.0 协议 -->
      <view v-if="is50KwMode" class="module">
        <view class="module-title">BMS电池管理系统</view>
        <DataGroup v-for="g in groups50" :key="g.title" :title="g.title">
          <DataGrid v-if="g.items" :items="g.items" />
          <FaultBoard
            v-else-if="g.faultGroups"
            :groups="g.faultGroups"
            :has-data="rawBucketHasData"
            hint="暂无故障位数据（未收到 171C 能源帧）"
          />
        </DataGroup>
        <DataGroup title="控制指令">
          <ControlCard
            :list="controlList"
            :isConnected="isConnected"
            :clickedBtn="clickedBtn"
            @control-click="onControlClick"
          />
        </DataGroup>
      </view>

      <!-- 20kW：171C 旧协议 -->
      <view v-else class="module">
        <view class="module-title">BMS</view>
        <DataGroup title="电池簇运行状态">
          <DataGrid :items="[
            { label: '电池状态', value: formattedValues['171C_B26'] }
          ]" />
        </DataGroup>
        <DataGroup title="簇级核心电气参数">
          <DataGrid :items="[
            { label: '簇电压(V)', value: formattedValues['171C_B12'] },
            { label: '簇电流(A)', value: formattedValues['171C_B14'] },
            { label: '负载电压(V)', value: formattedValues['171C_B144'] },
            { label: 'SOC(%)', value: formattedValues['171C_B16'] },
            { label: 'SOH(%)', value: formattedValues['171C_B18'] },
            { label: 'SOE(kWh)', value: formattedValues['171C_B20'] },
            { label: '绝缘R+(MΩ)', value: formattedValues['171C_B22'] },
            { label: '绝缘R-(MΩ)', value: formattedValues['171C_B24'] }
          ]" />
        </DataGroup>
        <DataGroup title="DI/DO状态">
          <DataGrid :items="[
            { label: 'DI1', value: formattedValues['171C_B28b0'] },
            { label: 'DI2', value: formattedValues['171C_B28b1'] },
            { label: 'DI3', value: formattedValues['171C_B28b2'] },
            { label: 'DI4', value: formattedValues['171C_B28b3'] },
            { label: 'DI5', value: formattedValues['171C_B28b4'] },
            { label: 'DI6', value: formattedValues['171C_B28b5'] },
            { label: 'DI7', value: formattedValues['171C_B28b6'] },
            { label: 'DI8', value: formattedValues['171C_B28b7'] },
            { label: 'SLP', value: formattedValues['171C_B29b0'] },
            { label: 'DO1', value: formattedValues['171C_B30b0'] },
            { label: 'DO2', value: formattedValues['171C_B30b1'] },
            { label: 'DO3', value: formattedValues['171C_B30b2'] },
            { label: 'DO4', value: formattedValues['171C_B30b3'] },
            { label: 'DO5', value: formattedValues['171C_B30b4'] },
            { label: 'DO6', value: formattedValues['171C_B30b5'] },
            { label: 'DO7', value: formattedValues['171C_B30b6'] },
            { label: 'DO8', value: formattedValues['171C_B30b7'] }
          ]" />
        </DataGroup>
        <DataGroup title="温度采集参数">
          <DataGrid :items="[
            { label: '温度点数', value: formattedValues['171C_B32'] },
            { label: '最高温度(℃)', value: formattedValues['171C_B34'] },
            { label: '最高温模块', value: formattedValues['171C_B36'] },
            { label: '最高温序号', value: formattedValues['171C_B38'] },
            { label: '最低温度(℃)', value: formattedValues['171C_B40'] },
            { label: '最低温模块', value: formattedValues['171C_B42'] },
            { label: '最低温序号', value: formattedValues['171C_B44'] },
            { label: '平均温度(℃)', value: formattedValues['171C_B46'] },
            { label: '电池箱最高温(℃)', value: formattedValues['171C_B106'] }
          ]" />
        </DataGroup>
        <DataGroup title="控制指令">
          <ControlCard
            :list="controlList"
            :isConnected="isConnected"
            :clickedBtn="clickedBtn"
            @control-click="onControlClick"
          />
        </DataGroup>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import DataGroup from '../DataGroup.vue'
import DataGrid from '../DataGrid.vue'
import ControlCard from '../ControlCard.vue'
import FaultBoard from '../FaultBoard.vue'
import {
  BMS_CELL, BMS_CONFIG, BMS_MEASURE, BMS_STATE, BMS_ENERGY, BMS_PDU, BMS_PACK,
  ENV_ITEMS, BMS_FAULT_WORDS
} from '../../../direct-device-50kw-fields.js'
import { fmtItems, withPrefixAliases } from '../../../direct-device-50kw-format.js'

/**
 * BMS tab 组件
 * 20kW：旧协议 171C
 * 50kW：新协议 171C V2.0（按《电池簇信息记录》栏目：环境数据 / 设备状态 / 系统配置 / 系统信息 / 单体信息 / 故障信息）
 */
export default {
  name: 'BmsTab',
  components: { DataGroup, DataGrid, ControlCard, FaultBoard },
  props: {
    formattedValues: {
      type: Object,
      default: () => ({})
    },
    controlList: {
      type: Array,
      default: () => []
    },
    rawValues: {
      type: Object,
      default: () => ({})
    },
    isConnected: {
      type: Boolean,
      default: false
    },
    clickedBtn: {
      type: Object,
      default: null
    },
    is50KwMode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /** 171C V2.0 原始寄存器 bucket（B 号为字节地址，值未缩放） */
    rawBucket() {
      return (this.rawValues && this.rawValues['171C_V2']) || {}
    },
    /** 是否收到过 171C V2 帧（无帧时故障位全 0，不能当作“全部正常”） */
    rawBucketHasData() {
      return Object.keys(this.rawBucket).length > 0
    },
    groups50() {
      const b = this.rawBucket || {}
      return [
        { title: '环境数据', items: this.envItems },
        { title: '设备状态', items: this.statusItems },
        { title: '系统配置', items: fmtItems(BMS_CONFIG, b) },
        { title: '电气测量', items: fmtItems(BMS_MEASURE, b) },
        { title: '状态与继电器', items: fmtItems(BMS_STATE, b) },
        { title: '电量与时长', items: fmtItems(BMS_ENERGY, b) },
        { title: '单体信息', items: fmtItems(BMS_CELL, b) },
        { title: '高压盒信息', items: fmtItems(BMS_PDU, b) },
        { title: 'PACK信息', items: fmtItems(BMS_PACK, b) },
        { title: '故障信息', faultGroups: this.faultWordGroups }
      ]
    },
    envItems() {
      // 131C 环境监测（float32）：帧类型不同键前缀不同（能源帧 B0/B4、状态帧 S_B0/S_B4），统一容错
      const env = withPrefixAliases((this.rawValues && this.rawValues['131C']) || {})
      return fmtItems(ENV_ITEMS, env)
    },
    /**
     * 设备状态：B0 为接触器状态（bit0~2），B1 为打包字节
     *   bit0~1 故障告警等级 / bit2~3 电池充放电状态 / bit4~6 BMS 运行状态
     * 电流方向仅作为充放电状态的兜底（B1 未上报时）
     */
    statusItems() {
      const b = this.rawBucket || {}
      const CONTACTOR = { 0: '已断开', 1: '正在连接_1', 2: '正在连接_2', 3: '已连接', 4: '连接失败' }
      const LEVEL = { 0: '无故障', 1: '1级', 2: '2级', 3: '3级' }
      const CHARGE = { 0: '空闲', 1: '充电中', 2: '放电中' }
      const RUN = { 0: '正常', 1: '禁止充电', 2: '禁止放电', 3: '待机', 4: '停止' }

      const rawB0 = b['B0']
      const rawB1 = b['B1']
      const b0 = Number(rawB0)
      const b1 = Number(rawB1)
      const hasB0 = rawB0 !== undefined && rawB0 !== null && Number.isFinite(b0)
      const hasB1 = rawB1 !== undefined && rawB1 !== null && Number.isFinite(b1)

      // 点表：B0 整字节枚举 0x0~0x4（不是位组）
      const contactor = hasB0 ? (CONTACTOR[b0] || String(b0)) : '--'
      // 点表：B1 bit0~1 故障等级 / bit2~3 充放电状态 / bit4~6 运行状态
      const alarm = hasB1 ? (LEVEL[b1 & 0x03] || '--') : '--'
      const runState = hasB1 ? (RUN[(b1 >> 4) & 0x07] || '--') : '--'

      let chargeState = hasB1 ? (CHARGE[(b1 >> 2) & 0x03] || '--') : '--'
      if (chargeState === '--') {
        // 兜底：B1 未上报时按电池电流方向判定（B12 编码为 (实际值+1000)*10）
        const cur = Number(b['B12'])
        if (b['B12'] !== undefined && b['B12'] !== null && Number.isFinite(cur) && cur !== 0) {
          const amp = cur / 10 - 1000
          chargeState = amp > 0.5 ? '充电中' : amp < -0.5 ? '放电中' : '空闲'
        }
      }

      return [
        { label: 'BMS接触器状态', value: contactor, unit: '' },
        { label: '故障告警等级', value: alarm, unit: '' },
        { label: '电池充放电状态', value: chargeState, unit: '' },
        { label: 'BMS运行状态', value: runState, unit: '' }
      ]
    },
    /** 故障字 1~16 分组（FaultBoard 用：组名 = 故障字等级，组内 16 位） */
    faultWordGroups() {
      const b = this.rawBucket || {}
      return BMS_FAULT_WORDS.map(word => {
        const val = Number(b[word.key])
        const has = b[word.key] !== undefined && b[word.key] !== null && Number.isFinite(val)
        return {
          title: word.title,
          items: word.bits
            .map((name, bit) => (name
              ? { name, active: has && ((val >> bit) & 1) === 1 }
              : null))
            .filter(Boolean)
        }
      }).filter(g => g.items.length > 0)
    }
  },
  data() {
    return {}
  },
  methods: {
    /** 透传 ControlCard 的下标载荷，页面侧按 controlList 反查真实对象 */
    onControlClick(payload) {
      this.$emit('control-click', payload)
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

/* 故障信息区由 FaultBoard 组件渲染，样式见 FaultBoard.vue */
</style>
