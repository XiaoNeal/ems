<template>
  <scroll-view class="module-scroll" scroll-y="true">
    <view class="content">
      <view class="module">
        <view class="module-title">PCS</view>
        <DataGroup v-for="g in displayGroups" :key="g.title" :title="g.title">
          <StatusGrid v-if="g.variant" :variant="g.variant" :items="g.items" />
          <!-- 50kW：故障信息按字节分组，汇总条 + 双列网格 -->
          <FaultBoard
            v-else-if="g.faultGroups"
            :groups="g.faultGroups"
            :has-data="bucket50HasData"
            hint="暂无故障位数据（未收到 1707 能源帧）"
          />
          <DataGrid v-else :items="g.items" />
        </DataGroup>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { PCS_B64_BITS, PCS_B64_STATUS_MAP, PCS_MODE_MAP } from '../../../direct-device-constants.js'
import {
  PCS_AC, PCS_DC, PCS_TEMP, PCS_ENERGY, PCS_VERSION, PCS_STATUS, PCS_FAULT_GROUPS
} from '../../../direct-device-50kw-fields.js'
import { fmtItems } from '../../../direct-device-50kw-format.js'
import DataGroup from '../DataGroup.vue'
import DataGrid from '../DataGrid.vue'
import StatusGrid from '../StatusGrid.vue'
import FaultBoard from '../FaultBoard.vue'

/**
 * PCS tab 组件
 * 20kW：旧协议 171B（B64 状态位 + 电气参数）
 * 50kW：新协议 1707 V3.5（按点表分组：设备状态 / 交流侧 / 直流侧 / 温度测点 / 累计电量 / 版本与通讯 / 故障信息）
 */
export default {
  name: 'PcsTab',
  components: { DataGroup, DataGrid, StatusGrid, FaultBoard },
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
    /** 50kW PCS 原始寄存器 bucket（1707 帧，B 号为字节地址） */
    bucket50() {
      return this.rawValues['1707'] || {}
    },
    /** formattedValues key 前缀：20kW → 171B，50kW → 1707 */
    fvPrefix() {
      return this.is50KwMode ? '1707' : '171B'
    },
    /** 是否收到过 1707 帧（无帧时故障位全 0，不能当作“全部正常”） */
    bucket50HasData() {
      return Object.keys(this.bucket50).length > 0
    },
    parsedB64Status() {
      const b64Value = this.rawValues['171B'] && this.rawValues['171B']['B64']
      if (b64Value === undefined || b64Value === null || b64Value === '--') return []
      // 字符串格式（带冒号分隔）：直接解析
      if (typeof b64Value === 'string' && b64Value.includes(':')) {
        return b64Value.split('; ').map(item => {
          const [name, value] = item.split(':')
          const isError = value === '发生'
          return {
            name: name || '', value: value || '',
            color: isError ? '#FF4D4F' : (PCS_B64_STATUS_MAP[name] || '#666'),
            bgColor: isError ? '#FFF1F0' : '#F6FFED',
            borderColor: isError ? '#FFCCC7' : '#B7EB8F'
          }
        })
      }
      // 数值格式：按位解析
      const b64 = Number(b64Value) || 0
      return PCS_B64_BITS.map(([name, bitPos, isError, isMode]) => {
        let value
        if (isMode && name === '工作模式') {
          value = PCS_MODE_MAP[(b64 >>> 12) & 0x03] || String((b64 >>> 12) & 0x03)
        } else if (isMode) {
          const v = (b64 >>> bitPos) & 1
          value = name === 'U1状态' || name === 'U2状态' ? (v === 0 ? '开机' : '关机') : String(v)
        } else {
          value = (b64 >>> bitPos) & 1 ? '发生' : '正常'
        }
        const finalIsError = isError && value === '发生'
        return {
          name, value,
          color: finalIsError ? '#FF4D4F' : (PCS_B64_STATUS_MAP[name] || '#666'),
          bgColor: finalIsError ? '#FFF1F0' : '#F6FFED',
          borderColor: finalIsError ? '#FFCCC7' : '#B7EB8F'
        }
      })
    },
    /** PCS 故障状态（20kW 旧协议） */
    pcsFaultStatus() {
      return this.parsedB64Status
        .filter(s => !['工作模式', 'U1状态', 'U2状态'].includes(s.name))
        .map(s => ({ ...s, isAlarm: s.value === '发生' }))
    },
    displayGroups() {
      return this.is50KwMode ? this.build50KwGroups() : this.build20KwGroups()
    }
  },
  methods: {
    fmt(key) {
      const v = this.formattedValues[this.fvPrefix + '_' + key]
      return v !== undefined && v !== null ? v : '--'
    },
    build20KwGroups() {
      return [
        { title: '运行状态', variant: 'status', items: this.parsedB64Status.filter(s => ['工作模式', 'U1状态', 'U2状态'].includes(s.name)) },
        { title: '相电压', items: [
          { label: 'A相(V)', value: this.fmt('B0') },
          { label: 'B相(V)', value: this.fmt('B4') },
          { label: 'C相(V)', value: this.fmt('B8') }
        ] },
        { title: '相电流', items: [
          { label: 'Ia(A)', value: this.fmt('B2') },
          { label: 'Ib(A)', value: this.fmt('B6') },
          { label: 'Ic(A)', value: this.fmt('B10') }
        ] },
        { title: '线电压', items: [
          { label: 'AB(V)', value: this.fmt('B12') },
          { label: 'BC(V)', value: this.fmt('B16') },
          { label: 'CA(V)', value: this.fmt('B20') }
        ] },
        { title: '相功率', items: [
          { label: 'A相有功(kW)', value: this.fmt('B24') },
          { label: 'B相有功(kW)', value: this.fmt('B28') },
          { label: 'C相有功(kW)', value: this.fmt('B32') },
          { label: 'A相无功(kVar)', value: this.fmt('B26') },
          { label: 'B相无功(kVar)', value: this.fmt('B30') },
          { label: 'C相无功(kVar)', value: this.fmt('B34') }
        ] },
        { title: '交流侧', items: [
          { label: '总有功(kW)', value: this.fmt('B44') },
          { label: '总无功(kVar)', value: this.fmt('B48') },
          { label: '总视在(kVA)', value: this.fmt('B52') },
          { label: '频率(Hz)', value: this.fmt('B36') },
          { label: '温度(℃)', value: this.fmt('B40') }
        ] },
        { title: '直流侧', items: [
          { label: '直流电压(V)', value: this.fmt('B56') },
          { label: '直流电流(A)', value: this.fmt('B58') }
        ] },
        { title: '故障状态', variant: 'fault', items: this.pcsFaultStatus }
      ]
    },
    /** 50kW 新协议（1707 V3.5）：字段/分组与云端监控页一致 */
    build50KwGroups() {
      const b = this.bucket50
      return [
        { title: '设备状态', items: fmtItems(PCS_STATUS, b) },
        { title: '交流侧', items: fmtItems(PCS_AC, b) },
        { title: '直流侧', items: fmtItems(PCS_DC, b) },
        { title: '温度测点', items: fmtItems(PCS_TEMP, b) },
        { title: '累计电量（电度统计）', items: fmtItems(PCS_ENERGY, b) },
        { title: '版本与通讯', items: fmtItems(PCS_VERSION, b) },
        { title: '故障信息', faultGroups: this.buildFaultGroups(b) }
      ]
    },
    /** 按字节分组组装故障看板数据（组内 active 为该位是否为 1） */
    buildFaultGroups(bucket) {
      return PCS_FAULT_GROUPS.map(g => ({
        title: g.title,
        items: g.items.map(f => ({
          name: f.name,
          active: Number(bucket[f.key]) === 1
        }))
      }))
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

/* 50kW 故障信息区由 FaultBoard 组件渲染，样式见 FaultBoard.vue */
</style>
