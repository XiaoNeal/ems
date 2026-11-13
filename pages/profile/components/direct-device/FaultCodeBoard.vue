<template>
  <view class="code-board">
    <!-- 未收到数据：不能把 0 当成「无故障」 -->
    <view v-if="!hasData || !valid" class="cb-empty">{{ hint }}</view>

    <!-- 与 FaultBoard（BMS / 液冷机）完全相同的三列等宽标签栅格：
         编号独立一行、名称居中，行列都对齐；命中项红底红字。
         不再有「当前故障码」大卡和分组码表，界面不再层层嵌套。 -->
    <view v-else class="cb-tags">
      <view
        v-for="(it, i) in flatItems"
        :key="it.code + '-' + i"
        class="cb-tag"
        :class="{ active: it.active }"
      >
        <text class="cb-tag-code">{{ pad(it.code) }}</text>
        <text class="cb-tag-text">{{ it.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 故障码看板（170C 储能/光伏 DC-DC）
 *
 * 与 FaultBoard 的区别只在数据语义：这里同一时刻只会命中 1 个枚举码，
 * 但展示层统一为「三列等宽标签栅格」，视觉与 BMS / 液冷机一致。
 * 标签内保留两位码号，命中项高亮即为当前故障码，不再单独放大卡。
 *
 * 用法：<FaultCodeBoard :groups="DC_ERROR_GROUPS" :current="code" :has-data="true" />
 */

/**
 * 按故障码数值升序平铺。
 * 分组 title 从来不渲染（见 FaultBoard 注释），分组顺序在这里不携带任何信息，
 * 却会让编号出现 02/06 → 08/13 → 07/09 → … → 28/04/41 的跳跃，视觉上很乱。
 * 升序后编号连续递增，现场按故障码查表也更快。
 * A/B：改回 false = 恢复「按点表分组顺序」的旧排列。
 */
const SORT_BY_CODE = true

export default {
  name: 'FaultCodeBoard',
  props: {
    // 不声明 type：小程序端 setData 会把 undefined 序列化成 null，
    // 微信基础库会对 Array / Number 类型刷「type-uncompatible」警告。
    // 值统一在 computed 里规范化，H5 / APP 行为不变。
    // [{ title, items: [{ code, name }] }]
    groups: {
      default: () => []
    },
    /** 当前故障码（状态帧 B10）；-1 = 暂无有效故障码。
     *  不能用 NaN：小程序 setData 会把它序列化成 null，还会刷 NaN/Infinity 警告。 */
    current: {
      default: -1
    },
    hasData: {
      type: Boolean,
      default: true
    },
    hint: {
      type: String,
      default: '暂无故障码数据'
    }
  },
  computed: {
    valid() {
      // -1 / null / 非数字都表示「没拿到故障码」，不能把 0 当成「无故障」
      return Number.isFinite(this.current) && this.current >= 0
    },
    isFault() {
      return this.valid && this.current !== 0
    },
    /** 展平成单个标签数组；分组只用于取数据，顺序统一按码号升序 */
    flatItems() {
      const out = []
      const groups = Array.isArray(this.groups) ? this.groups : []
      for (let i = 0; i < groups.length; i++) {
        const items = groups[i].items || []
        for (let j = 0; j < items.length; j++) {
          const it = items[j]
          if (!it || !it.name) continue
          out.push({
            code: it.code,
            name: it.name,
            active: this.isFault && it.code === this.current
          })
        }
      }
      if (SORT_BY_CODE) {
        out.sort((a, b) => {
          const ca = Number(a.code)
          const cb = Number(b.code)
          if (!Number.isFinite(ca)) return 1
          if (!Number.isFinite(cb)) return -1
          return ca - cb
        })
      }
      return out
    }
  },
  methods: {
    pad(n) {
      const num = Number(n)
      if (!Number.isFinite(num)) return '--'
      return num < 10 ? '0' + num : String(num)
    }
  }
}
</script>

<style lang="scss" scoped>
.code-board {
  padding: 6rpx 2rpx;
}

/* ---------- 三列等宽标签栅格（与 FaultBoard / StatusGrid 同一套） ---------- */
.cb-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.cb-tag {
  /* 等宽是关键：以前按内容自适应，长名字撑宽、短名字收窄，每行个数忽多忽少。
     flex 默认 align-items:stretch，同行格子会被拉到同一高度，行列都对齐。 */
  width: calc((100% - 24rpx) / 3);
  min-height: 104rpx;
  padding: 10rpx 6rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1rpx solid #e3e8ee;
  border-radius: 8rpx;
  background: #fafbfc;
  line-height: 1.3;

  &.active {
    background: #fff2f0;
    border-color: #ffc9c2;
    .cb-tag-code { color: #d93a32; }
    .cb-tag-text { color: #d93a32; font-weight: 600; }
  }
}
.cb-tag-code {
  flex-shrink: 0;
  font-size: 24rpx;
  color: #b3bac4;
  margin-bottom: 4rpx;
  font-variant-numeric: tabular-nums;
}
.cb-tag-text {
  font-size: 28rpx;
  color: #7a828c;
  line-height: 1.3;
  text-align: center;
  /* 不裁剪：长名称折行完整显示，同行其它格子由 stretch 补齐高度 */
  word-break: break-all;
}

/* ---------- 空态（与液冷机页 .fault-empty 同一套最小化灰字风格，保持跨页一致） ---------- */
.cb-empty {
  font-size: 28rpx;
  color: #8a94a1;
  padding: 20rpx 12rpx;
  text-align: center;
}
</style>
