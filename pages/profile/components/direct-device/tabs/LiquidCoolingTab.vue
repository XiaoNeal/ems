<template>
  <view class="liquid-tab">
    <!-- 非 50kW 站点没有液冷机 -->
    <DataGroup v-if="!is50KwMode" title="液冷机组" :collapsible="false">
      <StatusGrid variant="status" :items="[{
        name: '模式',
        value: '不可用',
        bgColor: '#f8fafc',
        borderColor: '#eef1f5',
        color: '#98a2ae'
      }]" />
    </DataGroup>

    <template v-else>
      <!-- 未收到数据时仍显示完整参数模板，仅数值为 -- -->
      <view v-if="!hasData" class="tip-banner">尚未接收到液冷机数据，以下为参数模板，数值显示为 --</view>

      <!-- 运行状态 -->
      <DataGroup title="运行状态">
        <view class="state-cards">
          <view class="state-card">
            <text class="state-label">机组运行状态</text>
            <text class="state-value" :class="{ warn: runStatus.fault }">{{ runStatus.text }}</text>
          </view>
          <view class="state-card">
            <text class="state-label">启动模式</text>
            <text class="state-value">{{ enums.startMode }}</text>
          </view>
          <view class="state-card">
            <text class="state-label">工作模式</text>
            <text class="state-value">{{ enums.workMode }}</text>
          </view>
          <view class="state-card">
            <text class="state-label">供回水控制目标</text>
            <text class="state-value">{{ enums.supplyTarget }}</text>
          </view>
          <view class="state-card">
            <text class="state-label">485通讯地址</text>
            <text class="state-value">{{ misc.addr }}</text>
          </view>
          <view class="state-card">
            <text class="state-label">波特率</text>
            <text class="state-value">{{ enums.baudRate }}</text>
          </view>
        </view>
      </DataGroup>

      <!-- 开关量 -->
      <DataGroup title="开关量">
        <view class="signal-grid">
          <view
            v-for="s in signalItems"
            :key="s.label"
            class="signal-item"
            :class="{ active: s.on, danger: s.on && s.danger }"
          >
            <text class="signal-name">{{ s.label }}</text>
            <text class="signal-value">{{ s.text }}</text>
          </view>
        </view>
      </DataGroup>

      <!-- 运行参数 -->
      <DataGroup title="运行参数">
        <DataGrid :items="runItems" />
      </DataGroup>

      <!-- 故障码 -->
      <DataGroup title="故障等级与代码">
        <DataGrid :items="faultCodeItems" />
      </DataGroup>

      <!-- 运行统计 -->
      <DataGroup title="累计运行时长">
        <DataGrid :items="runtimeItems" />
      </DataGroup>

      <!-- 故障报警 -->
      <DataGroup title="故障报警">
        <view v-if="!hasData" class="fault-empty">等待液冷机故障数据</view>
        <view v-else-if="!faultReported" class="fault-empty">故障字未上报（设备未返回有效故障数据）</view>
        <FaultBoard
          v-else
          :groups="faultGroups"
          hint="暂无故障位数据"
        />
      </DataGroup>
    </template>
  </view>
</template>

<script>
import DataGroup from '../DataGroup.vue'
import DataGrid from '../DataGrid.vue'
import StatusGrid from '../StatusGrid.vue'
import {
  COOL_START_MODE, COOL_WORK_MODE, COOL_SUPPLY_TARGET, COOL_BAUD_RATE,
  COOL_RUN_STATUS, COOL_RUN_MODE,
  COOL_RUN_ITEMS, COOL_RUNTIME_ITEMS, COOL_FAULT_CODES,
  COOL_LEVEL_BITS, COOL_OUTPUT_BITS, COOL_FAULT_WORDS, COOL_FAULT_ACTIVE_LOW
} from '../../../direct-device-0318-fields.js'
import { fmtItem, fmtItems } from '../../../direct-device-50kw-format.js'
import FaultBoard from '../FaultBoard.vue'

/**
 * 液冷机（0318 V2.3）监测标签页
 * 分组与云端监控页「液冷机运行数据」一致：
 *   运行状态 / 开关量 / 运行参数 / 故障等级与代码 / 累计运行时长 / 故障报警
 * 数据源：rawValues['0318']（B 号为字节地址，B38/B39/B41 为单字节位信号）
 */
export default {
  name: 'LiquidCoolingTab',
  components: { DataGroup, DataGrid, StatusGrid, FaultBoard },
  props: {
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
    bucket() {
      return (this.rawValues && this.rawValues['0318']) || {}
    },
    /**
     * 归一化取值表：ENERGY 帧裸键优先 → STATE 帧（S_）补齐 → 最后才用 CONTROL 帧（C_）兜底。
     * 0318 已在 direct-device.vue 中按帧类型加前缀隔离：设置回读帧未使用的区域普遍填充 0xFF，
     * 若不隔离会把 B86~B95 故障字整片点亮（表现为 76 个故障全部报警）。
     * C_ 只做最后兜底，保证设备只回控制帧时页面不会整页空白。
     */
    data50() {
      const src = this.bucket
      const out = {}
      Object.keys(src).forEach(k => {
        if (!/^[SC]_/.test(k)) out[k] = src[k]
      })
      ;['S_', 'C_'].forEach(prefix => {
        Object.keys(src).forEach(k => {
          if (k.indexOf(prefix) === 0) {
            const bare = k.slice(2)
            if (out[bare] !== undefined) return
            const v = src[k]
            // 控制帧未使用区域填充 0xFF/0xFFFF，不能当真实值显示
            if (prefix === 'C_' && (v === 0xFF || v === 0xFFFF)) return
            out[bare] = v
          }
        })
      })
      return out
    },
    hasData() {
      return Object.keys(this.data50).length > 0
    },
    /** 机组运行状态：低字节=状态（空闲/准备启动/运行/延时停机/故障），高字节=模式 */
    runStatus() {
      const raw = this.data50['B36']
      if (raw === undefined || raw === null) return { text: '--', fault: false }
      const num = Number(raw)
      if (!Number.isFinite(num)) return { text: '--', fault: false }
      const low = num & 0xff
      const high = (num >> 8) & 0xff
      const status = COOL_RUN_STATUS[low] || `状态${low}`
      const mode = COOL_RUN_MODE[high] || `模式${high}`
      return { text: `${status}/${mode}`, fault: low === 4 }
    },
    enums() {
      const pick = (key, map) => {
        const v = this.data50[key]
        if (v === undefined || v === null) return '--'
        const txt = map[Number(v)]
        return txt !== undefined ? txt : String(v)
      }
      return {
        startMode: pick('B0', COOL_START_MODE),
        workMode: pick('B2', COOL_WORK_MODE),
        supplyTarget: pick('B4', COOL_SUPPLY_TARGET),
        baudRate: pick('B34', COOL_BAUD_RATE)
      }
    },
    misc() {
      const v = this.data50['B32']
      return { addr: v === undefined || v === null ? '--' : String(v) }
    },
    /** 开关量：电平信号（低/高电平）+ 输出信号（断开/输出） */
    signalItems() {
      const build = (defs) => defs.map(d => {
        const raw = this.data50[d.key]
        const has = raw !== undefined && raw !== null
        const on = has && Number(raw) === 1
        return {
          label: d.label,
          on,
          danger: !!d.danger,
          text: has ? (on ? d.on : d.off) : '--'
        }
      })
      return [...build(COOL_LEVEL_BITS), ...build(COOL_OUTPUT_BITS)]
    },
    runItems() {
      return fmtItems(COOL_RUN_ITEMS, this.data50)
    },
    runtimeItems() {
      return fmtItems(COOL_RUNTIME_ITEMS, this.data50)
    },
    faultCodeItems() {
      return COOL_FAULT_CODES.map(it => fmtItem({ key: it.key, label: it.label, scale: 1, decimals: 0 }, this.data50))
    },
    /**
     * 故障字取值：ENERGY 裸键 → STATE(S_) → CONTROL(C_)
     * 能源帧里的 0xFF 是**有效的全故障值**（点表 1=有故障），必须照常判定；
     * 只有控制帧 C_ 的 0xFF/0xFFFF 是设置回读时未使用区域的填充值，需要丢弃。
     */
    faultWords() {
      const out = {}
      const src = this.bucket
      COOL_FAULT_WORDS.forEach(word => {
        let raw = src[word.key]
        if (raw === undefined || raw === null) {
          const sKey = 'S_' + word.key
          raw = src[sKey]
        }
        if (raw === undefined || raw === null) {
          const cKey = 'C_' + word.key
          const cv = src[cKey]
          // 控制帧未使用区域填充 0xFF/0xFFFF，不能当作有效故障数据
          if (cv !== 0xFF && cv !== 0xFFFF) raw = cv
        }
        const num = Number(raw)
        out[word.key] = (raw !== undefined && raw !== null && Number.isFinite(num)) ? num : null
      })
      return out
    },
    /** 是否存在有效故障字（全部无效时提示“未上报”，避免全灰误解为全正常） */
    faultReported() {
      return Object.keys(this.faultWords).some(k => this.faultWords[k] !== null)
    },
    /** 故障位按故障字分组：用于 FaultBoard（组名取语义短名，未定义则回退「故障字N」） */
    faultGroups() {
      return COOL_FAULT_WORDS.map(word => {
        const val = this.faultWords[word.key]
        const has = val !== null
        return {
          title: word.groupTitle || word.title,
          items: word.bits.map((name, bit) => {
            if (!name) return null
            const bitVal = has ? ((val >> bit) & 1) : null
            // ACTIVE_LOW：1=正常 → 0 表示故障；否则 1 表示故障
            const active = bitVal === null ? false : (COOL_FAULT_ACTIVE_LOW ? bitVal === 0 : bitVal === 1)
            return { name, active }
          }).filter(Boolean)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.liquid-tab {
  padding: 0 0 16rpx;
}

/* 无数据提示条 */
.tip-banner {
  margin: 0 0 16rpx;
  padding: 16rpx 20rpx;
  font-size: 22rpx;
  color: #8a6d3b;
  background: #fffbe6;
  border: 1rpx solid #ffe58f;
  border-radius: 14rpx;
  line-height: 1.5;
}

/* 运行状态卡片：与 DataGrid 同一套栅格语言（白底 + 细横线） */
.state-cards {
  display: flex;
  flex-wrap: wrap;
  background: #ffffff;
  border: 1rpx solid #eef1f5;
  border-radius: 18rpx;
  overflow: hidden;
}
.state-card {
  width: 33.3333%;
  box-sizing: border-box;
  padding: 20rpx 10rpx 18rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1rpx solid #f3f5f8;
}
.state-label {
  font-size: 21rpx;
  color: #98a2ae;
  margin-bottom: 8rpx;
  text-align: center;
}
.state-value {
  font-size: 27rpx;
  color: #1d2430;
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
  word-break: break-all;
  &.warn {
    color: #e5484d;
  }
}

/* 开关量 */
.signal-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}
.signal-item {
  width: calc((100% - 20rpx) / 3);
  padding: 16rpx 8rpx;
  background: #ffffff;
  border: 1rpx solid #eef1f5;
  border-radius: 14rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  .signal-name {
    font-size: 20rpx;
    color: #98a2ae;
    text-align: center;
    margin-bottom: 8rpx;
    line-height: 1.3;
  }
  .signal-value {
    font-size: 24rpx;
    color: #b0b6c0;
    font-weight: 600;
  }
  &.active {
    background: #eef5ff;
    border-color: #cfe3ff;
    .signal-value {
      color: #2f7cf6;
    }
  }
  &.active.danger {
    background: #fff2f0;
    border-color: #ffd3cd;
    .signal-value {
      color: #e5484d;
    }
  }
}

/* 故障报警：列表由 FaultBoard 渲染，此处仅保留空态文案 */
.fault-empty {
  padding: 20rpx 12rpx;
  font-size: 24rpx;
  color: #8a9099;
  text-align: center;
}
</style>
