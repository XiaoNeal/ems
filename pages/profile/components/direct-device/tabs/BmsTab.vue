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
            hint="暂无故障位数据"
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
      </view>
    </view>
  </scroll-view>
</template>

<script>
import DataGroup from '../DataGroup.vue'
import DataGrid from '../DataGrid.vue'
import FaultBoard from '../FaultBoard.vue'
import {
  BMS_CELL, BMS_CONFIG, BMS_MEASURE, BMS_STATE, BMS_DEVICE_STATUS, BMS_FIRE,
  BMS_ENERGY, BMS_PDU, BMS_PACK,
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
  components: { DataGroup, DataGrid, FaultBoard },
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
    /** 171C V2.0 原始寄存器 bucket（B 号为字节地址，值未缩放） */
    rawBucket() {
      return this._mergeFrames((this.rawValues && this.rawValues['171C_V2']) || {})
    },
    /** 是否收到过 171C V2 帧（无帧时故障位全 0，不能当作“全部正常”） */
    rawBucketHasData() {
      return Object.keys(this.rawBucket).length > 0
    },
    groups50() {
      const b = this.rawBucket || {}
      return [
        { title: '环境数据', items: this.envItems },
        { title: '设备状态', items: fmtItems(BMS_DEVICE_STATUS, b).concat(fmtItems(BMS_STATE, b)) },
        { title: '设备信息', items: fmtItems(BMS_MEASURE, b).concat(fmtItems(BMS_ENERGY, b)) },
        { title: '系统配置', items: fmtItems(BMS_CONFIG, b) },
        { title: 'PACK信息', items: fmtItems(BMS_PACK, b) },
        { title: '单体信息', items: fmtItems(BMS_CELL, b) },
        { title: '高压盒信息', items: fmtItems(BMS_PDU, b) },
        { title: '消防信息', items: fmtItems(BMS_FIRE, b) },
        { title: '故障信息', faultGroups: this.faultWordGroups }
      ]
    },
    envItems() {
      // 131C 环境监测（float32）：帧类型不同键前缀不同（能源帧 B0/B4、状态帧 S_B0/S_B4），统一容错
      const env = withPrefixAliases((this.rawValues && this.rawValues['131C']) || {})
      return fmtItems(ENV_ITEMS, env)
    },
    /**
     * 故障字 1~16 分组（FaultBoard 用：组名 = 故障字等级，组内 16 位）
     *
     * ⚡ 故障位是「慢变量」：12 个故障字一天也变不了几次，但它们是本页最大的
     *    一组节点（150 个药丸标签）。以前每次刷新都重建分组对象 → FaultBoard 的
     *    props 变了 → 150 个标签整片重排 + 一轮 setData。
     *    这里用 12 个故障字拼个签名，签名没变直接复用上次的对象（引用不变 →
     *    子组件不重渲染），一次刷新能省掉一半的渲染数据量。
     */
    faultWordGroups() {
      const b = this.rawBucket || {}
      const words = BMS_FAULT_WORDS
      let sig = ''
      for (let i = 0; i < words.length; i++) {
        const v = b[words[i].key]
        sig += (v === undefined || v === null ? '-' : String(v)) + ','
      }
      if (sig === this._faultSig && this._faultGroups) return this._faultGroups
      this._faultSig = sig
      this._faultGroups = words.map(word => {
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
      return this._faultGroups
    }
  },
  methods: {
    /**
     * 帧类型前缀合并（必须放 methods：它是被调用的工具函数，不是计算属性）
     *   171C V2.0 的字段分散在三类帧：能源帧(0x02) 存裸键 B2/B10…，状态帧(0x03) 存 S_ 前缀
     *   （系统配置 B70~B80 只在状态帧里），控制帧(0x04) 存 C_ 前缀。
     *   点表里同名 B 号在两类帧中含义不同，所以不能简单互相覆盖：
     *   裸键（能源帧）优先，S_/C_ 只补裸键缺的字段。
     *
     * ⚠️ 这里必须「保留原键 + 补裸键别名」，不能只输出裸键：
     *   BMS_CONFIG 的 6 项系统配置（额定电压/额定容量/串数/温感数/pack 数/极柱温感数）
     *   在字段表里写的就是 'S_B70'…'S_B80'（它们只存在于状态帧），
     *   旧实现把 S_ 前缀全部剥掉，于是桶里只剩 B70…，按 'S_B70' 查永远是 undefined，
     *   整块「系统配置」就固定显示 '--'。
     */
    _mergeFrames(src) {
      const out = {}
      const bareInSrc = {}
      Object.keys(src).forEach(k => {
        if (!/^[SC]_/.test(k)) bareInSrc[k] = true
      })
      // 1) 原样保留（含 S_/C_ 前缀），保证显式写了 'S_B70' 这类键的字段能精确命中
      Object.keys(src).forEach(k => { out[k] = src[k] })
      // 2) 带前缀的键补一份裸键别名：只在能源帧没有同名裸键时补，避免状态帧覆盖能源帧同号字段
      Object.keys(src).forEach(k => {
        if (!/^[SC]_/.test(k)) return
        const bare = String(k).replace(/^[SC]_/, '')
        if (bareInSrc[bare]) return
        if (out[bare] === undefined) out[bare] = src[k]
      })
      return out
    }
  },
  data() {
    return {}
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
    background: #2f7cf6;
  }
}

/* 故障信息区由 FaultBoard 组件渲染，样式见 FaultBoard.vue */
</style>
