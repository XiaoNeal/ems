<template>
  <view class="dc-panel">
    <DataGroup title="运行参数">
      <DataGrid :items="runItems || []" />
    </DataGroup>

    <DataGroup title="状态参数">
      <view class="state-card">
        <view class="state-head" @longpress="showStateDiagnostics">
          <text class="state-title">机器运行状态</text>
          <text class="state-current" :class="{ 'is-empty': !hasRunState }">当前 {{ runStateText }}</text>
        </view>
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
        :groups="faultGroups || []"
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
    // 不声明 type: Object：小程序端 setData 会把 undefined 序列化成 null，
    // 微信基础库会对 Object 类型刷「type-uncompatible」警告；值统一由 safeBucket 兜底。
    bucket: {
      default: () => ({})
    },
    faultTitle: {
      type: String,
      default: 'DC故障信息'
    }
  },
  computed: {
    /** bucket 兼容：小程序端首帧可能是 null / 非对象，统一兜成普通空对象 */
    safeBucket() {
      const b = this.bucket
      return b && typeof b === 'object' ? b : {}
    },
    runItems() {
      return fmtItems(DC_RUN, this.safeBucket)
    },
    /**
     * 状态数据的键前缀：
     *   'S_' = 0x03 状态帧；'C_' = 0x04 控制回读帧（部分现场设备把状态字放这里）；
     *   ''   = 状态数据以裸键写入（模拟器 JSON / 通用解析 / 前缀判定未命中）；
     *   null = 完全没有状态数据。
     * 裸键判定用 B8b、B9b 系列位键：能源帧字段表全是 u16/i16，不产出任何位键，
     * 所以位键出现就一定是状态数据，不会把能源帧的 B8（BUS侧电流给定）误当状态字。
     */
    stateFramePrefix() {
      const b = this.safeBucket
      const keys = Object.keys(b)
      if (keys.some(k => k.indexOf('S_') === 0)) return 'S_'
      if (keys.some(k => k.indexOf('C_') === 0)) return 'C_'
      if (keys.some(k => /^B(8|9)b[0-7]$/.test(k))) return ''
      return null
    },
    /** 是否收到过状态/回读数据 */
    hasStateFrame() {
      return this.stateFramePrefix !== null
    },
    /**
     * 机器运行状态字（点表 BIT0~BIT7）。
     * 状态字是字节地址 8 起的 16 位寄存器、大端存储，BIT0~BIT7 在【低字节】，
     * BIT8~BIT15 保留。现场设备有三种常见写法，这里逐一兼容：
     *   ① B8 为 16 位原值 → 取低字节；低字节全 0 时再取高字节（状态位落在高字节的实现）；
     *   ② B8b0~b7 位键（协议层按低字节展开，位序权威）；
     *   ③ B9b0~b7 位键（控制帧按字节逐位展开时，低字节落在地址 9）。
     * 能源帧同号裸 B8 是「BUS侧电流给定」，只在 stateFramePrefix 判定为状态数据时才读，不会误用。
     */
    runStateWord() {
      const b = this.safeBucket
      const p = this.stateFramePrefix
      if (p === null) return null

      const rawVal = b[p + 'B8']
      const raw = Number(rawVal)
      const hasRaw = rawVal !== undefined && rawVal !== null && Number.isFinite(raw)
      if (hasRaw && raw !== 0) {
        const low = raw & 0xff
        const high = (raw >> 8) & 0xff
        if (low) return low
        if (high) return high
      }

      let anyBits = false
      for (const base of ['B8b', 'B9b']) {
        let word = 0
        for (let i = 0; i < 8; i++) {
          const v = b[p + base + i]
          if (v === undefined || v === null || v === '') continue
          anyBits = true
          if (Number(v) === 1) word |= (1 << i)
        }
        if (word !== 0) return word
      }

      // 状态帧已到但状态字为 0（设备未置任何状态位）：返回 0 保持全灰，不再误判成「无数据」
      return (hasRaw || anyBits) ? 0 : null
    },
    /** 8 个状态徽标；无状态帧/无效值时不点亮任何一项 */
    runStateBadges() {
      const word = this.runStateWord
      return decodeRunState(DC_RUN_STATE_BITS, word === null ? NaN : word)
    },
    /** 是否有状态位命中 */
    hasRunState() {
      return this.runStateBadges.some(s => s.active)
    },
    /** 当前状态文字：多位命中用「、」合并，与云端 170C 模型一致 */
    runStateText() {
      const names = this.runStateBadges.filter(s => s.active).map(s => s.name)
      return names.length ? names.join('、') : '--'
    },
    /**
     * 故障码：只认状态数据 B10（能源帧同名 B10 是下垂电压系数，不能混用）。
     * 无有效值返回 -1（合法 Number）：NaN 经小程序 setData 会变成 null，
     * 既刷 Number 类型警告，又让下游拿不到明确的「无数据」语义。
     */
    faultCode() {
      const p = this.stateFramePrefix
      if (p === null) return -1
      const raw = this.safeBucket[p + 'B10']
      if (raw === undefined || raw === null || raw === '') return -1
      const num = Number(raw)
      return Number.isFinite(num) && num >= 0 ? num : -1
    },
    faultGroups() {
      return DC_ERROR_GROUPS
    },
    /** 长按诊断文本：现场确认设备到底有没有把状态数据送进来 */
    diagnosticsText() {
      const b = this.safeBucket
      const p = this.stateFramePrefix
      const src = p === 'S_' ? '状态帧' : p === 'C_' ? '控制回读帧' : p === '' ? '裸键' : '未收到'
      const keys = Object.keys(b).filter(k => /(B8|B9|B10)/.test(k)).slice(0, 10)
      return '状态数据：' + src +
        '\n状态字：' + (this.runStateWord === null ? '无' : this.runStateWord) +
        '\n故障码：' + (this.faultCode >= 0 ? this.faultCode : '无') +
        '\n相关字段：' + (keys.length ? keys.join('、') : '无')
    }
  },
  methods: {
    /** 长按「机器运行状态」标题行：弹出诊断信息，常规界面不显示 */
    showStateDiagnostics() {
      uni.showModal({
        title: '状态数据诊断',
        content: this.diagnosticsText,
        showCancel: false,
        confirmText: '知道了'
      })
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
.state-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}
.state-title {
  font-size: 27rpx;
  color: #78838f;
  letter-spacing: 0.2rpx;
}
/* 当前状态值：与云端 170C 状态参数的 item-value 对齐，避免只有标签、看不到数值 */
.state-current {
  font-size: 26rpx;
  color: #2f7cf6;
  font-weight: 600;
  &.is-empty {
    color: #8a94a1;
    font-weight: 400;
  }
}
.state-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.badge {
  /* 三列等宽栅格：与 FaultBoard（BMS/液冷机/PCS 位状态）对齐。
     不用内容自适应宽度，否则长名撑宽、短名收窄，每行个数忽多忽少。 */
  width: calc((100% - 24rpx) / 3);
  min-height: 84rpx;
  padding: 8rpx 6rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1rpx solid #e3e8ee;
  border-radius: 8rpx;
  background: #fafbfc;
  line-height: 1.3;
  text {
    font-size: 24rpx;
    color: #7a828c;
    line-height: 1.3;
    word-break: break-all;
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
