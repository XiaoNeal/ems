<template>
  <view class="fault-board">
    <!-- 未收到数据 / 无位定义：不能把「全 0」当成全部正常 -->
    <view v-if="!hasData || totalCount === 0" class="fb-empty">{{ hint }}</view>

    <!-- 全部故障位平铺成一行行紧凑标签：没有汇总条、分组标题、双列网格和圆点，
         命中的项用红底红字标出，其余保持浅灰描边，一眼扫完即可。 -->
    <view v-else class="fb-tags">
      <view
        v-for="(it, i) in flatItems"
        :key="i"
        class="fb-tag"
        :class="{ active: it.active }"
      >
        <text class="fb-tag-text">{{ it.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 故障位看板（PCS / BMS / 液冷机等「位状态」告警）
 *
 * 视觉按现场习惯简化为「平铺标签流」：
 *   1. 不做汇总大卡、不做分组标题、不做双列网格、不做状态圆点；
 *   2. 所有位按原有分组顺序平铺，自动换行；
 *   3. 命中项红底红字，未命中项浅灰描边灰字 —— 信息一点不少，但界面不再层层嵌套。
 *
 * 用法：
 *   <FaultBoard :groups="[{ title: '功率模块', items: [{ name: 'A相IGBT故障', active: true }] }]" />
 * 分组的 title 现在只用于保持原有数据顺序，不再渲染成标题。
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
    /** 过滤空名位；title 只用于维持顺序，不再渲染 */
    normalized() {
      return (this.groups || [])
        .map(g => (g.items || []).filter(it => it && it.name))
        .filter(items => items.length > 0)
    },
    /** 展平成单个标签数组：模板只有一个 v-for，节点数比原来的分组网格少约 40% */
    flatItems() {
      const out = []
      const groups = this.normalized
      for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < groups[i].length; j++) out.push(groups[i][j])
      }
      return out
    },
    totalCount() {
      return this.flatItems.length
    }
  }
}
</script>

<style lang="scss" scoped>
.fault-board {
  padding: 6rpx 2rpx;
}

/* ---------- 平铺标签流：固定三列等宽，行列都对齐 ---------- */
.fb-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.fb-tag {
  /* 三列等宽：(100% - 两个间距) / 3；不用内容自适应宽度，
     否则长名字撑宽、短名字收窄，每行个数忽多忽少，视觉上很乱 */
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

  &.active {
    background: #fff2f0;
    border-color: #ffc9c2;
    .fb-tag-text {
      color: #d93a32;
      font-weight: 600;
    }
  }
}
.fb-tag-text {
  font-size: 24rpx;
  color: #7a828c;
  line-height: 1.3;
  word-break: break-all;
}

/* ---------- 空态 ---------- */
.fb-empty {
  font-size: 28rpx;
  color: #9aa1aa;
  padding: 24rpx 12rpx;
  text-align: center;
}
</style>
