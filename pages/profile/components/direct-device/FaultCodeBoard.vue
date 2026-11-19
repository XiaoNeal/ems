<template>
  <view class="code-board">
    <!-- 未收到数据：不能把 0 当成「无故障」 -->
    <view v-if="!hasData || !valid" class="cb-empty">{{ hint }}</view>

    <!-- 分组模式（储能DC / 光伏DC）：按点表 6 类语义分组，标题右侧给码号，
         组内仍按码号升序；与云端监控页及 PCS 故障字分组保持一致的层次感。 -->
    <view v-else-if="showGroupTitles" class="cb-groups">
      <view v-for="(g, gi) in normalizedGroups" :key="gi" class="cb-group">
        <view class="cb-group-title">
          <text>{{ g.title }}</text>
          <text class="cb-group-codes">{{ g.codes }}</text>
        </view>
        <view class="cb-tags">
          <view v-for="(it, i) in g.items" :key="it.code + '-' + i" class="cb-tag" :class="{ active: it.active }">
            <text class="cb-tag-code">{{ pad(it.code) }}</text>
            <text class="cb-tag-text">{{ it.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 默认模式：全部故障码按码号升序平铺成三列等宽标签，
         编号独立一行、名称居中，命中项红底红字；无「当前故障码」大卡。 -->
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
 * 传 showGroupTitles 时按 DC_ERROR_GROUPS 的 6 类语义分组（组内仍按码号升序），
 * 与云端监控页一致；不传则保持「全部码号升序平铺」的旧行为。
 *
 * 用法：<FaultCodeBoard :groups="DC_ERROR_GROUPS" :current="code" :has-data="true" :show-group-titles="true" />
 */

/**
 * 无论平铺还是分组，组内都按故障码数值升序。
 * 平铺模式（showGroupTitles=false）：全部 27 个码号连续递增，按码查表最快。
 * 分组模式：组间保持点表 6 类语义顺序、组内升序，标题徽标给出该组码号。
 * 改回 false = 保留数据原始顺序（不推荐）。
 */
const SORT_BY_CODE = true

/** 码号补零显示：02、06、41；无效码显示 -- */
const padCode = (n) => {
  const num = Number(n)
  if (!Number.isFinite(num)) return '--'
  return num < 10 ? '0' + num : String(num)
}
/** 按码号数值升序（分组模式在组内排序，平铺模式全局排序） */
const byCode = (a, b) => {
  const ca = Number(a.code)
  const cb = Number(b.code)
  if (!Number.isFinite(ca)) return 1
  if (!Number.isFinite(cb)) return -1
  return ca - cb
}

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
    },
    /** 是否按点表 6 类语义分组显示标题；默认 false = 全部码号升序平铺 */
    showGroupTitles: {
      type: Boolean,
      default: false
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
    /** 分组模式：组内按码号升序，组间保持点表分类顺序；标题徽标给出该组码号 */
    normalizedGroups() {
      const groups = Array.isArray(this.groups) ? this.groups : []
      return groups.map(g => {
        const items = (g.items || [])
          .filter(it => it && it.name)
          .map(it => ({
            code: it.code,
            name: it.name,
            active: this.isFault && it.code === this.current
          }))
        if (SORT_BY_CODE) items.sort(byCode)
        return {
          title: g.title || '',
          codes: items.map(it => padCode(it.code)).join(' / '),
          items
        }
      }).filter(g => g.items.length > 0)
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
      if (SORT_BY_CODE) out.sort(byCode)
      return out
    }
  },
  methods: {
    pad(n) {
      return padCode(n)
    }
  }
}
</script>

<style lang="scss" scoped>
.code-board {
  padding: 6rpx 2rpx;
}

/* ---------- 分组模式：点表语义标题 + 该组码号徽标 ---------- */
.cb-groups {
  width: 100%;
}
.cb-group + .cb-group {
  margin-top: 20rpx;
}
.cb-group-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #666;
}
.cb-group-codes {
  font-size: 22rpx;
  font-weight: 400;
  color: #8a94a1;
  background: #f2f4f7;
  border-radius: 6rpx;
  padding: 2rpx 10rpx;
  line-height: 1.5;
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
