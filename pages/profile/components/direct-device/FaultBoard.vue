<template>
  <view class="fault-board">
    <!-- 未收到数据 / 无位定义：不能把「全 0」当成全部正常 -->
    <view v-if="!hasData || totalCount === 0" class="fb-empty">{{ hint }}</view>

    <template v-else>
      <!-- 汇总条：故障数 + 总量 + 状态标签 -->
      <view class="fb-summary" :class="hitCount > 0 ? 'is-bad' : 'is-ok'">
        <view class="fb-summary-left">
          <text class="fb-num">{{ hitCount }}</text>
          <text class="fb-num-unit">项故障</text>
        </view>
        <view class="fb-summary-right">
          <text class="fb-total">共 {{ totalCount }} 项</text>
          <view class="fb-tag">
            <view class="fb-tag-dot"></view>
            <text>{{ hitCount > 0 ? '存在故障' : '全部正常' }}</text>
          </view>
        </view>
      </view>

      <!-- 分组：组名 + 命中数，组内双列对齐 -->
      <view v-for="(g, gi) in normalized" :key="gi" class="fb-group">
        <view v-if="g.title" class="fb-head">
          <text class="fb-title">{{ g.title }}</text>
          <text class="fb-count" :class="{ hit: g.hit > 0 }">{{ g.hit }}/{{ g.items.length }}</text>
        </view>
        <view class="fb-grid">
          <view
            v-for="(it, ii) in g.items"
            :key="g.title + '-' + ii"
            class="fb-cell"
            :class="{ active: it.active }"
          >
            <view class="fb-dot"></view>
            <text class="fb-text">{{ it.name }}</text>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
/**
 * 故障看板组件
 *
 * 把「一大片药丸标签」改成「汇总条 + 分类 + 双列网格」：
 *   1. 顶部汇总条给出总故障数与总项数，一眼看清严重程度；
 *   2. 按字节/语义分组，组头右侧显示 命中/总数；
 *   3. 组内固定双列，标签宽度一致，行列对齐；命中项红底红字 + 实心圆点。
 *
 * 用法：
 *   <FaultBoard :groups="[{ title: '功率模块', items: [{ name: 'A相IGBT故障', active: true }] }]" />
 * 分组标题传空字符串则只渲染网格（不分节）。
 */
export default {
  name: 'FaultBoard',
  props: {
    // [{ title, items: [{ name, active }] }]
    groups: {
      type: Array,
      default: () => []
    },
    hint: {
      type: String,
      default: '暂无故障位数据'
    },
    /** 是否已收到有效帧：false 时只显示 hint，避免「全 0」被误读成全部正常 */
    hasData: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    /** 过滤空名位并统计每组命中数 */
    normalized() {
      return (this.groups || [])
        .map(g => {
          const items = (g.items || []).filter(it => it && it.name)
          return {
            title: g.title || '',
            items,
            hit: items.filter(it => it.active).length
          }
        })
        .filter(g => g.items.length > 0)
    },
    totalCount() {
      return this.normalized.reduce((sum, g) => sum + g.items.length, 0)
    },
    hitCount() {
      return this.normalized.reduce((sum, g) => sum + g.hit, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.fault-board {
  padding: 4rpx;
}

/* ---------- 汇总条 ---------- */
.fb-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  margin: 6rpx 4rpx 4rpx;
  border-radius: 14rpx;
  background: #f7f9fb;
  border: 1rpx solid #edf1f5;

  &.is-bad {
    background: #fff5f4;
    border-color: #ffd9d4;
    .fb-num { color: #e6434a; }
    .fb-tag { background: rgba(230, 67, 74, 0.08); color: #e6434a; }
  }
  &.is-ok {
    background: #f5fbf6;
    border-color: #d8efdc;
    .fb-num { color: #2f9e63; }
    .fb-tag { background: rgba(47, 158, 99, 0.08); color: #2f9e63; }
  }
}
.fb-summary-left {
  display: flex;
  align-items: baseline;
}
.fb-num {
  font-size: 44rpx;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -1rpx;
}
.fb-num-unit {
  font-size: 22rpx;
  color: #7a828c;
  margin-left: 8rpx;
}
.fb-summary-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.fb-total {
  font-size: 20rpx;
  color: #9aa1aa;
  margin-bottom: 8rpx;
}
.fb-tag {
  display: flex;
  align-items: center;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  line-height: 1.4;
}
.fb-tag-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: currentColor;
  margin-right: 6rpx;
}

/* ---------- 分组 ---------- */
.fb-group {
  margin-top: 18rpx;
}
.fb-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6rpx 10rpx;
  margin-bottom: 12rpx;
  border-bottom: 1rpx solid #f2f4f7;
}
.fb-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #5a6270;
  letter-spacing: 0.5rpx;
}
.fb-count {
  font-size: 21rpx;
  color: #b3b9c1;
  &.hit {
    color: #e6434a;
    font-weight: 600;
  }
}

/* ---------- 双列网格 ---------- */
.fb-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}
.fb-cell {
  display: flex;
  align-items: center;
  /* 圆点 + 名称整体居中（同 FaultCodeBoard）：双列固定宽，
     左对齐时右列右半边全是空白，两列视觉重心不齐 */
  justify-content: center;
  width: calc((100% - 8rpx) / 2);
  min-height: 54rpx;
  padding: 8rpx 14rpx;
  box-sizing: border-box;
  border-radius: 10rpx;
  background: #f8fafc;
  border: 1rpx solid #eef1f5;

  &.active {
    background: #fff2f0;
    border-color: #ffd3cd;
    .fb-dot { background: #f2544c; }
    .fb-text { color: #d93a32; font-weight: 600; }
  }
}
.fb-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #d8dce2;
  margin-right: 10rpx;
  flex-shrink: 0;
}
.fb-text {
  /* 不再 flex:1 撑满剩余宽度，否则文字被拉到左侧、居中失效 */
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  font-size: 22rpx;
  color: #8d949e;
  line-height: 1.3;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* ---------- 空态 ---------- */
.fb-empty {
  font-size: 24rpx;
  color: #9aa1aa;
  padding: 24rpx 12rpx;
  text-align: center;
}
</style>
