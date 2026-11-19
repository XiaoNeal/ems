<template>
  <view class="fault-board">
    <!-- 未收到数据 / 无位定义：不能把「全 0」当成全部正常 -->
    <view v-if="!hasData || totalCount === 0" class="fb-empty">{{ hint }}</view>

    <!-- 分组模式（PCS 故障字1~N）：标题给出「故障字N + 点表类别」，组内仍是三列等宽标签 -->
    <view v-else-if="showGroupTitles" class="fb-groups">
      <view v-for="(g, gi) in normalizedGroups" :key="gi" class="fb-group">
        <view class="fb-group-title">
          <text>{{ g.title }}</text>
          <text v-if="g.category" class="fb-group-category">{{ g.category }}</text>
        </view>
        <view class="fb-tags">
          <view v-for="(it, i) in g.items" :key="i" class="fb-tag" :class="{ active: it.active }">
            <text class="fb-tag-text">{{ it.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 默认模式：全部故障位平铺成紧凑标签，无汇总条 / 双列网格 / 圆点，
         命中的项用红底红字标出，其余保持浅灰描边 -->
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
 * 默认按现场习惯简化为「平铺标签流」：不做汇总大卡、不做分组标题、不做双列网格、
 * 不做状态圆点；命中项红底红字，未命中项浅灰描边灰字。
 * 传 showGroupTitles 时按组渲染「故障字N + 类别」标题（PCS 50kW 专用，
 * 与液冷机/BMS 及云端监控页的分组口径一致），其他设备不传 → 行为不变。
 *
 * 用法：
 *   <FaultBoard :groups="[{ title: '故障字1', category: 'ARM软件故障', items: [...] }]" :show-group-titles="true" />
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
    },
    /** 是否显示分组标题（故障字N + 类别）；默认 false，保持其他设备的平铺样式 */
    showGroupTitles: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    /** 过滤空名位；分组模式下 title/category 会渲染成标题 */
    normalizedGroups() {
      return (this.groups || [])
        .map(g => ({
          title: g && g.title ? g.title : '',
          category: g && g.category ? g.category : '',
          items: ((g && g.items) || []).filter(it => it && it.name)
        }))
        .filter(g => g.items.length > 0)
    },
    /** 平铺模式：只取组内的项，title 仅用于维持顺序 */
    normalized() {
      return this.normalizedGroups.map(g => g.items)
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

/* ---------- 分组模式：故障字N 标题 + 类别徽标（PCS 50kW） ---------- */
.fb-groups {
  width: 100%;
}
.fb-group + .fb-group {
  margin-top: 20rpx;
}
.fb-group-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #666;
}
.fb-group-category {
  font-size: 22rpx;
  font-weight: 400;
  color: #8a94a1;
  background: #f2f4f7;
  border-radius: 6rpx;
  padding: 2rpx 10rpx;
  line-height: 1.5;
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
