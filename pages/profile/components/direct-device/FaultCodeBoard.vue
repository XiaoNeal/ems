<template>
  <view class="code-board">
    <!-- 未收到状态帧：不能把 0 当成「无故障」 -->
    <view v-if="!hasData || !valid" class="cb-empty">{{ hint }}</view>

    <template v-else>
      <!-- 当前码：整块只有 1 个有效码，顶部给足信息量 -->
      <view class="cb-hero" :class="isFault ? 'is-bad' : 'is-ok'">
        <view class="cb-hero-code">
          <text class="cb-code-num">{{ isFault ? pad(current) : '00' }}</text>
        </view>
        <view class="cb-hero-info">
          <text class="cb-hero-name">{{ currentName }}</text>
          <text class="cb-hero-sub">{{ isFault ? '当前故障码 · 请排查设备' : '当前无故障上报' }}</text>
        </view>
        <view class="cb-hero-tag">
          <view class="cb-hero-dot"></view>
          <text>{{ isFault ? '故障' : '正常' }}</text>
        </view>
      </view>

      <!-- 码表：按保护对象分组，命中项红底 -->
      <view v-for="(g, gi) in normalized" :key="gi" class="cb-group">
        <view class="cb-head">
          <text class="cb-title">{{ g.title }}</text>
          <text class="cb-count" :class="{ hit: g.hit > 0 }">{{ g.hit }}/{{ g.items.length }}</text>
        </view>
        <view class="cb-grid">
          <view
            v-for="(it, ii) in g.items"
            :key="ii"
            class="cb-cell"
            :class="{ active: it.active }"
          >
            <text class="cb-cell-code">{{ pad(it.code) }}</text>
            <text class="cb-cell-name">{{ it.name }}</text>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
/**
 * 故障码看板（170C 储能/光伏 DC-DC）
 *
 * 与 FaultBoard 的区别：
 *   - 170C 的故障是「单值枚举码」（0~41），同一时刻只会命中 1 个；
 *   - PCS / BMS / 液冷机的故障是「位状态」，可同时命中多个。
 * 所以这里顶部做成「当前故障码」大卡，下面用分组码表把全部可用码列出来，
 * 命中项红底，一眼能看出「现在报的是哪个码、属于哪一类保护」。
 *
 * 用法：<FaultCodeBoard :groups="DC_ERROR_GROUPS" :current="code" :has-data="true" />
 */
export default {
  name: 'FaultCodeBoard',
  props: {
    // [{ title, items: [{ code, name }] }]
    groups: {
      type: Array,
      default: () => []
    },
    /** 当前故障码（状态帧 B10） */
    current: {
      type: Number,
      default: NaN
    },
    hasData: {
      type: Boolean,
      default: true
    },
    hint: {
      type: String,
      default: '暂无故障码数据（未收到 170C 状态帧）'
    }
  },
  computed: {
    valid() {
      return Number.isFinite(this.current)
    },
    isFault() {
      return this.valid && this.current !== 0
    },
    currentName() {
      if (!this.valid) return '--'
      if (this.current === 0) return '无故障'
      const all = this.groups.reduce((acc, g) => acc.concat(g.items || []), [])
      const hit = all.find(it => it.code === this.current)
      return hit ? hit.name : '未知故障码'
    },
    normalized() {
      return (this.groups || [])
        .map(g => {
          const items = (g.items || [])
            .filter(it => it && it.name)
            .map(it => ({ code: it.code, name: it.name, active: this.isFault && it.code === this.current }))
          return {
            title: g.title || '',
            items,
            hit: items.filter(it => it.active).length
          }
        })
        .filter(g => g.items.length > 0)
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
  padding: 4rpx;
}

/* ---------- 当前故障码 ---------- */
.cb-hero {
  display: flex;
  align-items: center;
  padding: 18rpx 20rpx;
  margin: 6rpx 4rpx 4rpx;
  border-radius: 14rpx;
  background: #f7f9fb;
  border: 1rpx solid #edf1f5;

  &.is-bad {
    background: #fff5f4;
    border-color: #ffd9d4;
    .cb-code-num { color: #e6434a; }
    .cb-hero-name { color: #c9333a; }
    .cb-hero-tag { background: rgba(230, 67, 74, 0.08); color: #e6434a; }
  }
  &.is-ok {
    background: #f5fbf6;
    border-color: #d8efdc;
    .cb-code-num { color: #2f9e63; }
    .cb-hero-name { color: #2b8a58; }
    .cb-hero-tag { background: rgba(47, 158, 99, 0.08); color: #2f9e63; }
  }
}
.cb-hero-code {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 74rpx;
  padding-right: 18rpx;
  margin-right: 18rpx;
  border-right: 1rpx solid rgba(0, 0, 0, 0.06);
}
.cb-code-num {
  font-size: 46rpx;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -1rpx;
}
.cb-hero-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.cb-hero-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333a44;
  line-height: 1.3;
}
.cb-hero-sub {
  font-size: 20rpx;
  color: #9aa1aa;
  margin-top: 6rpx;
}
.cb-hero-tag {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 6rpx 14rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  line-height: 1.4;
}
.cb-hero-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: currentColor;
  margin-right: 6rpx;
}

/* ---------- 分组码表 ---------- */
.cb-group {
  margin-top: 18rpx;
}
.cb-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6rpx 10rpx;
  margin-bottom: 12rpx;
  border-bottom: 1rpx solid #f2f4f7;
}
.cb-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #5a6270;
  letter-spacing: 0.5rpx;
}
.cb-count {
  font-size: 21rpx;
  color: #b3b9c1;
  &.hit {
    color: #e6434a;
    font-weight: 600;
  }
}
.cb-grid {
  display: flex;
  flex-wrap: wrap;
  margin: -4rpx;
}
.cb-cell {
  display: flex;
  align-items: center;
  width: calc(50% - 8rpx);
  min-height: 54rpx;
  margin: 4rpx;
  padding: 0 12rpx;
  box-sizing: border-box;
  border-radius: 10rpx;
  background: #f7f8fa;
  border: 1rpx solid #f0f2f5;

  &.active {
    background: #fff2f0;
    border-color: #ffd3cd;
    .cb-cell-code { color: #d93a32; }
    .cb-cell-name { color: #d93a32; font-weight: 600; }
  }
}
.cb-cell-code {
  flex-shrink: 0;
  font-size: 19rpx;
  color: #b9bfc7;
  margin-right: 10rpx;
  font-variant-numeric: tabular-nums;
}
.cb-cell-name {
  flex: 1;
  font-size: 21rpx;
  color: #8d949e;
  line-height: 1.3;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* ---------- 空态 ---------- */
.cb-empty {
  font-size: 24rpx;
  color: #9aa1aa;
  padding: 24rpx 12rpx;
  text-align: center;
}
</style>
