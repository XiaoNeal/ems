<template>
  <view class="settings-panel">
    <!-- 顶部信息条：设备身份 + 参数规模 + 编辑开关 -->
    <view class="sp-hero">
      <view class="sp-hero-icon">
        <uni-icons type="gear-filled" size="20" color="#2f7cf6"></uni-icons>
      </view>
      <view class="sp-hero-text">
        <text class="sp-hero-title">{{ tabCfg.title }}</text>
        <text class="sp-hero-sub">{{ heroSub }}</text>
      </view>
      <view
        class="sp-edit-btn"
        :class="{ 'is-editing': editing }"
        @click="onToggleEdit"
      >
        <uni-icons
          :type="editing ? 'checkmarkempty' : 'compose'"
          size="14"
          color="#ffffff"
        ></uni-icons>
        <text>{{ editing ? '完成' : '修改' }}</text>
      </view>
    </view>

    <!-- 编辑态提示条 -->
    <view v-if="editing" class="sp-edit-hint">
      <uni-icons type="compose" size="13" color="#18855a"></uni-icons>
      <text class="sp-edit-hint-text">编辑模式已开启，点击命令或参数后立即下发</text>
    </view>

    <!-- 组合报文卡片：同组参数（如储能DC开关机 / 充放电选择 / 总功率）合并成一帧下发 -->
    <view
      v-for="b in bundleGroups"
      :key="b.key"
      class="sp-card sp-card--bundle"
      :class="editing ? 'is-editing' : 'is-locked'"
    >
      <view class="sp-card-head">
        <view class="sp-card-title-wrap">
          <view class="sp-card-bar"></view>
          <text class="sp-card-title">{{ b.title }}</text>
          <!-- <text class="sp-bundle-tag">合并下发</text> -->
        </view>
        <text v-if="editing" class="sp-card-hint">设置完成后点击下方按钮</text>
      </view>

      <view v-for="p in b.switchItems" :key="p.key" class="sp-switch-row">
        <view class="sp-switch-top"> 
          <text class="sp-switch-label">{{ p.label }}</text>
          <text v-if="currentLabelOf(p)" class="sp-switch-cur">{{ currentLabelOf(p) }}</text>
        </view>
        <view class="sp-seg" :class="{ 'sp-seg--wrap': (p.options || []).length > 4 }">
          <view
            v-for="(opt, oi) in (p.options || [])"
            :key="oi"
            class="sp-seg-item"
            :class="{ 'is-active': isActive(p, opt), 'is-danger': opt.dangerous }"
            @click="onBundleSwitch(p, oi)"
          >{{ opt.label }}</view>
        </view>
      </view>

      <view v-if="b.numericItems.length" class="sp-num-grid sp-num-grid--bundle" :class="{ 'sp-num-grid--single': b.numericItems.length === 1 }">
        <view
          v-for="(p, pi) in b.numericItems"
          :key="p.key"
          class="sp-num-item"
          :class="{ 'sp-num-item--right': pi % 2 === 1 }"
          @click="onBundleNumeric(p)"
        >
          <text class="sp-num-name">{{ p.label }}</text>
          <view class="sp-num-value-row">
            <text class="sp-num-value">{{ formatCurrentText(p) }}</text>
            <text v-if="p.unit" class="sp-num-unit">{{ p.unit }}</text>
          </view>
          <text v-if="hasRange(p)" class="sp-num-range">
            {{ p.min }} ~ {{ p.max }}{{ p.unit }}
          </text>
          <text v-else class="sp-num-range">--</text>
          <view class="sp-num-edit" :class="{ 'is-on': editing }">
            <uni-icons
              :type="editing ? 'compose' : 'locked'"
              size="11"
              :color="editing ? '#2f7cf6' : '#c6ced8'"
            ></uni-icons>
          </view>
        </view>
      </view>

      <!-- 统一的下发入口：上面怎么调都只改本地选择，点这里才真正把三项合成一帧发出去 -->
      <view class="sp-bundle-foot">
        <view class="sp-bundle-state" :class="{ 'is-pending': bundleDirty(b) }">
          <view class="sp-bundle-dot"></view>
          <text>{{ bundleDirty(b) ? '有未下发的修改' : '将按当前设置一并下发' }}</text>
        </view>
        <view
          class="sp-bundle-send"
          :class="{ 'is-disabled': !editing }"
          @click="onBundleSend(b)"
        >
          <uni-icons type="paperplane" size="14" :color="editing ? '#ffffff' : '#a8b1bd'"></uni-icons>
          <text class="sp-bundle-send-text">一键下发</text>
        </view>
      </view>
    </view>

    <!-- 命令 / 模式：先在编辑态下才允许点击下发（未点「修改」时点击只会提示） -->
    <view v-for="(sec, si) in sections" :key="sec.key" class="sp-card" :class="{ 'is-locked': !editing }">
      <view class="sp-card-head">
        <view class="sp-card-title-wrap">
          <view class="sp-card-bar"></view>
          <text class="sp-card-title">{{ sec.title }}</text>
        </view>
        <text v-if="editing" class="sp-card-hint">选择后立即下发</text>
      </view>

      <view v-for="p in sec.items" :key="p.key" class="sp-switch-row">
        <view class="sp-switch-top">
          <text class="sp-switch-label">{{ p.label }}</text>
          <text v-if="currentLabelOf(p)" class="sp-switch-cur">{{ currentLabelOf(p) }}</text>
        </view>
        <view class="sp-seg" :class="{ 'sp-seg--wrap': (p.options || []).length > 4 }">
          <view
            v-for="(opt, oi) in (p.options || [])"
            :key="oi"
            class="sp-seg-item"
            :class="{ 'is-active': isActive(p, opt), 'is-danger': opt.dangerous }"
            @click="onSwitchTap(p, oi)"
          >{{ opt.label }}</view>
        </view>
      </view>
    </view>

    <!-- 数值分组切换：某个设备的数值项过多时，按 tabCfg.numericGroups 分段，
         一次只渲染选中那段；只有一段（当前 BMS 就只剩温控 15 项）时不显示这排 -->
    <scroll-view v-if="numericSections.length > 1" class="sp-num-tabs" scroll-x :show-scrollbar="false">
      <view class="sp-num-tabs-inner">
        <view
          v-for="(sec, si) in numericSections"
          :key="sec.key"
          class="sp-num-tab"
          :class="{ 'is-active': si === activeNumSection }"
          @click="activeNumSection = si"
        >
          <text class="sp-num-tab-text">{{ sec.short || sec.title }}</text>
          <text class="sp-num-tab-count">{{ sec.items.length }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 数值设定：两列栅格，点卡片即可编辑 -->
    <view v-for="(sec, si) in visibleNumericSections" :key="sec.key" class="sp-card" :class="editing ? 'is-editing' : 'is-locked'">
      <view class="sp-card-head">
        <view class="sp-card-title-wrap">
          <view class="sp-card-bar"></view>
          <text class="sp-card-title">{{ sec.title }}</text>
        </view>
        <text v-if="editing" class="sp-card-hint">{{ sec.items.length }} 项 · 点击卡片可修改</text>
      </view>

      <view class="sp-num-grid" :class="{ 'sp-num-grid--single': sec.items.length === 1 }">
        <view
          v-for="(p, pi) in sec.items"
          :key="p.key"
          class="sp-num-item"
          :class="{ 'sp-num-item--right': pi % 2 === 1 }"
          @click="onNumericTap(p)"
        >
          <text class="sp-num-name">{{ p.label }}</text>
          <view class="sp-num-value-row">
            <text class="sp-num-value">{{ formatCurrentText(p) }}</text>
            <text v-if="p.unit" class="sp-num-unit">{{ p.unit }}</text>
          </view>
          <!-- 用 != null 同时排除 undefined 与 null：小程序 setData 会把 undefined 变成 null；无范围则不渲染 -->
          <text v-if="hasRange(p)" class="sp-num-range">
            {{ p.min }} ~ {{ p.max }}{{ p.unit }}
          </text>
          <view class="sp-num-edit" :class="{ 'is-on': editing }">
            <uni-icons
              :type="editing ? 'compose' : 'locked'"
              size="11"
              :color="editing ? '#2f7cf6' : '#c6ced8'"
            ></uni-icons>
          </view>
        </view>
      </view>
    </view>

    <!-- 配置为空时的兜底，任何时候都不白屏 -->
    <view v-if="!sections.length && !numericSections.length" class="sp-empty">
      <uni-icons type="info" size="26" color="#c6ced8"></uni-icons>
      <text class="sp-empty-text">该设备暂无可配置参数</text>
    </view>
  </view>
</template>

<script>
/**
 * 设置面板组件（数据驱动，对应 SETTINGS_TABS 中的一项）
 * 事件: toggle-edit(editKey)       —— 点「修改 / 完成」
 *       need-edit                 —— 未进编辑态就点了命令或数值（页面据此提示）
 *       switch-click({ dataKey, key, optionIndex, value, label })   —— 普通命令卡：点选即下发
 *       numeric-edit({ dataKey, key })                              —— 普通数值卡：改完即下发
 *       bundle-select({ dataKey, key, optionIndex, value, label })  —— 组合卡：只改本地选择
 *       bundle-value-edit({ dataKey, key })                         —— 组合卡：只改本地数值
 *       bundle-send({ group })                                      —— 组合卡：合成一帧下发
 *
 * 门禁：命令与数值都必须先点「修改」进入编辑态，未进入时点击只发 need-edit，不下发。
 *
 * ⚠️ 事件载荷只传「定位信息」（数组 key + 参数 key + 选项下标），不传参数/选项对象本身。
 *    小程序把组件事件转发给页面时会做一次 detail 序列化，直接传 Vue 响应式对象
 *    （含 options 数组、定时器句柄等）容易丢字段，表现为「点了按钮但下发值为空」，
 *    页面侧再从自己的数组里按 key 反查，拿到的永远是完整的原始对象。
 *
 * 结构：顶部信息条 → 命令/模式分段控件 → 数值两列栅格
 * 分段控件（segmented）替代原来的独立按钮：选项等宽、选中态一眼可辨，
 * 且 4 个以上选项自动换行，不会因「并网一键开机」这类长文案挤成一团。
 */
export default {
  name: 'SettingsPanel',
  props: {
    tabCfg: { type: Object, required: true },
    // 所有参数数组的映射：{ pcsSwitchParams: [...], bmsNumericParams: [...] }
    paramsMap: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
    formatCurrentLabel: { type: Function, default: () => '--' },
    formatCurrentValue: { type: Function, default: () => null },
    formatCurrentText: { type: Function, default: () => '--' }
  },
  data() {
    return {
      // 本地即时编辑态：点击「修改」立刻生效，不等父组件回传 prop，
      // 避免事件往返期间按钮「点了没反应」；null 表示跟随父组件的 isEditing
      localEditing: null,
      // 当前选中的数值分组（仅当 numericGroups 配了多段时用得上）
      activeNumSection: 0
    }
  },
  computed: {
    /** 只渲染选中的那一组数值卡片；不足两组时全渲染 */
    visibleNumericSections() {
      const list = this.numericSections
      if (list.length <= 1) return list
      const i = Math.min(this.activeNumSection, list.length - 1)
      return [list[i]]
    },
    editing() {
      return this.localEditing === null ? this.isEditing : this.localEditing
    },
    /**
     * 组合报文分组（tabCfg.bundleSections）
     * 协议要求「同组参数放在一个报文里下发」时用：组内开关 + 数值渲染在同一张卡里，
     * 点任意一项，页面都会把同组其它项的当前值一起带出，合成一帧。
     */
    bundleGroups() {
      const cfg = this.tabCfg || {}
      const specs = cfg.bundleSections
      if (!specs || !specs.length) return []
      const swArr = this.getParams(cfg.dataKey)
      const numArr = this.getParams(cfg.numericKey)
      // 数值项可能定义在 dataKey 数组里，两个来源都查
      const findNum = k => numArr.find(x => x.key === k) || swArr.find(x => x.key === k) || null
      return specs.map((b, i) => ({
        key: 'b' + i,
        group: b.group || '',
        title: b.title || '组合指令',
        switchItems: this.withOptions((b.switchKeys || []).map(k => swArr.find(x => x.key === k)).filter(Boolean)),
        numericItems: (b.numericKeys || []).map(findNum).filter(Boolean)
      })).filter(g => g.switchItems.length || g.numericItems.length)
    },
    /** 已归入组合报文的 key：普通分区里要排掉，否则同一项会出现两次 */
    bundleKeys() {
      const cfg = this.tabCfg || {}
      const out = []
      ;(cfg.bundleSections || []).forEach(b => {
        (b.switchKeys || []).forEach(k => out.push(k))
        ;(b.numericKeys || []).forEach(k => out.push(k))
      })
      return out
    },
    /** 命令/模式分区：快捷控制是多段，其余是单段（BMS 可能带额外开关段） */
    sections() {
      const cfg = this.tabCfg || {}
      const skip = k => this.bundleKeys.indexOf(k) !== -1
      if (cfg.switchSections && cfg.switchSections.length) {
        const mapped = cfg.switchSections.map((ss, i) => ({
          key: 's' + i,
          title: ss.title,
          items: this.withOptions(this.sectionParams(ss)).filter(p => !skip(p.key))
        }))
        if (mapped.some(s => s.items.length)) return mapped.filter(s => s.items.length)
        // 分区 key 与参数 key 对不上（协议模板切换时序问题）时平铺全部开关项，避免整页空白
        const all = this.withOptions(this.getParams(cfg.dataKey)).filter(p => !skip(p.key))
        return all.length ? [{ key: 's0', title: cfg.switchTitle || '命令 / 模式', items: all }] : []
      }
      const out = []
      const main = this.withOptions(this.getParams(cfg.dataKey)).filter(p => !skip(p.key))
      if (main.length) out.push({ key: 's0', title: cfg.switchTitle || '命令 / 模式', items: main })
      if (cfg.extraSwitchKey) {
        const extra = this.withOptions(this.getParams(cfg.extraSwitchKey)).filter(p => !skip(p.key))
        if (extra.length) out.push({ key: 's1', title: cfg.extraSwitchTitle || '开关控制', items: extra })
      }
      return out
    },
    /** 数值分区：支持 numericGroups 按 group 标签拆分（如 BMS 阈值 / 温控），否则单段 */
    numericSections() {
      const cfg = this.tabCfg || {}
      const all = this.getParams(cfg.numericKey).filter(p => this.bundleKeys.indexOf(p.key) === -1)
      if (!all.length) return []
      const groups = cfg.numericGroups
      if (!groups || !groups.length) {
        return [{ key: 'n0', title: cfg.numericTitle || '数值设定', items: all }]
      }
      return groups
        .map((g, i) => ({ key: 'n' + i, title: g.title, short: g.short, items: all.filter(p => (p.group || '') === g.tag) }))
        .filter(g => g.items.length)
    },
    heroSub() {
      // 组合卡里的项也要计数，否则顶部会显示「命令 5 项」却看不到那两项
      const bundleSw = this.bundleGroups.reduce((sum, b) => sum + b.switchItems.length, 0)
      const bundleNum = this.bundleGroups.reduce((sum, b) => sum + b.numericItems.length, 0)
      const sw = this.sections.reduce((sum, s) => sum + s.items.length, 0) + bundleSw
      const nm = this.numericSections.reduce((sum, s) => sum + s.items.length, 0) + bundleNum
      const parts = []
      if (sw) parts.push('命令 ' + sw + ' 项')
      if (nm) parts.push('参数 ' + nm + ' 项')
      return parts.length ? parts.join(' · ') : '暂无可配置项'
    }
  },
  watch: {
    // 父组件回传的编辑态变化时以父组件为准（切换 tab、下发后自动退出等）
    isEditing(v) {
      this.localEditing = v
    },
    // 换到另一个 tab：编辑态回到初始（各 tab 有自己的编辑开关），数值分组回到第一段
    'tabCfg.editKey'() {
      this.localEditing = null
      this.activeNumSection = 0
    }
  },
  methods: {
    /** 「修改 / 完成」按钮：本地先切，再通知页面同步 */
    onToggleEdit() {
      this.localEditing = !this.editing
      this.$emit('toggle-edit', this.tabCfg && this.tabCfg.editKey)
    },
    getParams(key) {
      if (!key) return []
      return (this.paramsMap && this.paramsMap[key]) || []
    },
    /** 只保留有选项的开关项：没有 options 的项渲染出来会是空行 */
    withOptions(list) {
      return (list || []).filter(p => p && p.options && p.options.length)
    },
    /** 分区取参数：支持 filterKey（单 key）与 keys（多 key，如「策略开关」两个寄存器） */
    sectionParams(ss) {
      const keys = (ss && ss.keys && ss.keys.length) ? ss.keys : (ss && ss.filterKey ? [ss.filterKey] : [])
      const all = this.getParams(this.tabCfg && this.tabCfg.dataKey)
      if (!keys.length) return all
      return all.filter(p => keys.indexOf(p.key) !== -1)
    },
    /** 是否给出取值范围（0 也要显示，所以用 != null 而不是真值判断） */
    hasRange(p) {
      return p.min != null && p.max != null
    },
    /**
     * 组合卡里的开关：只改本地选择，不下发。
     * 三项必须「调好一起发」，逐项即时发会被下一帧覆盖。
     */
    onBundleSwitch(p, optionIndex) {
      if (!p) return
      if (!this.editing) {
        this.$emit('need-edit')
        return
      }
      const opt = (p.options || [])[optionIndex]
      if (!opt) return
      this.$emit('bundle-select', {
        dataKey: this.tabCfg.dataKey,
        key: p.key,
        optionIndex,
        value: opt.value,
        label: opt.label
      })
    },
    /** 组合卡里的数值：只改本地值，等「下发组合指令」统一发 */
    onBundleNumeric(p) {
      if (!p) return
      if (!this.editing) {
        this.$emit('need-edit')
        return
      }
      this.$emit('bundle-value-edit', {
        dataKey: this.tabCfg.numericKey || this.tabCfg.dataKey,
        key: p.key
      })
    },
    /** 组合下发：把卡内三项的当前选择合成一帧 */
    onBundleSend(b) {
      if (!b) return
      if (!this.editing) {
        this.$emit('need-edit')
        return
      }
      this.$emit('bundle-send', { group: b.group || 'storageDc', title: b.title })
    },
    /** 卡内是否有尚未下发的本地改动（参数上的 _pending 标记） */
    bundleDirty(b) {
      const all = (b.switchItems || []).concat(b.numericItems || [])
      return all.some(p => p && p._pending)
    },
    /**
     * 开关项点击：只透传定位信息，具体参数对象由页面按 key 反查
     * 未进入编辑态时不下发，只发 need-edit 让页面提示「先点修改」——
     * 开关类命令风险最高（并网/离网、开关机），绝不能被误触直接打到设备。
     */
    onSwitchTap(p, optionIndex) {
      if (!p) return
      if (!this.editing) {
        this.$emit('need-edit')
        return
      }
      const opt = (p.options || [])[optionIndex] || {}
      this.$emit('switch-click', {
        dataKey: this.tabCfg.dataKey,
        key: p.key,
        optionIndex,
        // 值/文案再冗余带一份：任何一端反查失败都能直接用它下发
        value: opt.value,
        label: opt.label
      })
    },
    /**
     * 数值项点击：同样受编辑态门禁控制。
     * 未点「修改」时只提示，不自动打开编辑态、更不弹输入框，
     * 否则「修改」按钮就失去意义了（用户会以为可以直接改）。
     */
    onNumericTap(p) {
      if (!p) return
      if (!this.editing) {
        this.$emit('need-edit')
        return
      }
      this.$emit('numeric-edit', {
        dataKey: this.tabCfg.numericKey || this.tabCfg.dataKey,
        key: p.key
      })
    },
    /** 行右侧的「当前 xxx」：回读不到时不显示，避免满屏「当前 --」 */
    currentLabelOf(p) {
      if (!p.options) return ''
      const label = this.formatCurrentLabel(p)
      if (!label || label === '--') return ''
      return '当前 ' + label
    },
    /**
     * 当前选项是否处于选中态
     * 数值可能来自实时帧（number）或本地乐观更新（string），必须统一转字符串比较，
     * 否则会出现「点了没反应 / 明明发了却不亮」的假象。
     */
    isActive(p, opt) {
      const cur = this.formatCurrentValue(p)
      if (cur === null || cur === undefined || cur === '') return false
      return String(cur) === String(opt.value)
    }
  }
}
</script>

<style lang="scss" scoped>
$primary: #2f7cf6;
$primary-soft: #eef4ff;
$danger: #e5484d;
/* 编辑态语义色：完成 / 可下发一律用绿色系，与主蓝（修改）区分状态 */
$success: #18855a;
$success-soft: #f1faf5;
$success-line: #d5ecdf;
$text-1: #16202d;
$text-2: #58626f;
/* 三级灰原先偏浅（#97a1ad 在灰底上对比不足），压深一档保证可读 */
$text-3: #7e8896;
$border: #e9edf3;
$border-soft: #f2f5f9;
$fill: #f6f8fb;

.settings-panel {
  padding-bottom: 8rpx;
}

/* ========== 顶部信息条 ========== */
.sp-hero {
  display: flex;
  align-items: center;
  padding: 22rpx;
  margin-bottom: 18rpx;
  background: #ffffff;
  border: 1rpx solid $border;
  border-radius: 20rpx;
  box-shadow: 0 1rpx 3rpx rgba(20, 32, 52, 0.03);
}

.sp-hero-icon {
  flex-shrink: 0;
  width: 62rpx;
  height: 62rpx;
  margin-right: 18rpx;
  border-radius: 16rpx;
  background: $primary-soft;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sp-hero-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.sp-hero-title {
  font-size: 29rpx;
  font-weight: 600;
  line-height: 1.3;
  color: $text-1;
  letter-spacing: 0.3rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sp-hero-sub {
  margin-top: 5rpx;
  font-size: 22rpx;
  line-height: 1.35;
  color: $text-3;
  letter-spacing: 0.2rpx;
}

.sp-edit-btn {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16rpx;
  /* 触控高度约 40px，避免“点了没反应” */
  /* 定宽而非 min-width：笔图标与勾图标宽度不同，切换编辑态时按钮会跳 1~2px */
  width: 148rpx;
  padding: 15rpx 0;
  border-radius: 999rpx;
  background: $primary;
  box-shadow: 0 2rpx 6rpx rgba(20, 32, 52, 0.10);
  transition: background-color 0.18s ease, box-shadow 0.18s ease, opacity 0.15s ease;

  text {
    margin-left: 6rpx;
    font-size: 23rpx;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.6rpx;
  }

  &:active {
    opacity: 0.86;
  }

  /* 编辑中：实心绿「完成」。
     之前用浅绿底 + 绿字，在白色卡片上几乎融进背景，看不出这是可点的按钮；
     改成实心后既是状态标识（已进入编辑态），也是明确的终点操作。 */
  &.is-editing {
    background: $success;
    box-shadow: 0 2rpx 6rpx rgba(24, 133, 90, 0.22);

    text {
      color: #ffffff;
    }

    &:active {
      opacity: 1;
      background: #14734e;
    }
  }
}

/* ========== 编辑态提示条 ========== */
.sp-edit-hint {
  display: flex;
  align-items: center;
  padding: 14rpx 18rpx;
  margin-bottom: 18rpx;
  background: $success-soft;
  border: 1rpx solid $success-line;
  border-radius: 12rpx;
}

.sp-edit-hint-text {
  flex: 1;
  min-width: 0;
  margin-left: 10rpx;
  font-size: 21rpx;
  line-height: 1.4;
  color: #17734c;
}

/* ========== 区块卡片 ========== */
.sp-card {
  position: relative;
  padding: 0 22rpx 8rpx;
  margin-bottom: 18rpx;
  background: #ffffff;
  border: 1rpx solid $border;
  border-radius: 20rpx;
  box-shadow: 0 1rpx 3rpx rgba(20, 32, 52, 0.03);

  &:last-child {
    margin-bottom: 0;
  }

  /* 编辑态：数值卡换成淡蓝底，明确「这些值现在可以改」 */
  &.is-editing {
    .sp-num-item {
      background: #f5f9ff;
      border-color: #dbe7f9;
    }

    .sp-num-edit {
      opacity: 1;
    }
  }

  /* 只读态：命令与数值都不可操作，整体压灰，避免看起来像能点 */
  &.is-locked {
    .sp-seg-item {
      color: #a8b1bd;

      /* 去掉按压缩放/变淡的触感反馈，只读就是只读 */
      &:active {
        opacity: 1;
      }

      /* 只读态的选中也要看得见：白底 + 深灰字，不用主色蓝避免显得可点 */
      &.is-active {
        background: #ffffff;
        color: #45505f;
        font-weight: 600;
        box-shadow: 0 1rpx 3rpx rgba(20, 32, 52, 0.07);
      }

      /* 危险项的当前态：暗红文字提示，但不能用轨道灰底——会和未选中项融为一体 */
      &.is-danger.is-active {
        background: #ffffff;
        color: #c25256;
        box-shadow: 0 1rpx 3rpx rgba(20, 32, 52, 0.07);
      }
    }

    .sp-num-item {
      &:active {
        background: $fill;
        border-color: $border;
      }
    }
  }
}

/* 组合下发卡：卡片头做淡蓝底，与普通卡一眼可分（不用渐变、不用顶部色条） */
.sp-card--bundle {
  overflow: hidden;
  border-color: #e2ebfa;

  .sp-card-head {
    margin: 0 -22rpx;
    padding: 22rpx 22rpx 16rpx;
    background: #f6f9ff;
    border-radius: 20rpx 20rpx 0 0;
    border-bottom: 1rpx solid #e6eefb;
  }
}

.sp-bundle-tag {
  flex-shrink: 0;
  margin-left: 10rpx;
  padding: 3rpx 10rpx;
  border-radius: 6rpx;
  font-size: 18rpx;
  line-height: 1.4;
  color: $primary;
  background: rgba(47, 124, 246, 0.09);
}

.sp-num-grid--bundle {
  padding-top: 14rpx;
  padding-bottom: 6rpx;
}

/* ========== 数值分组切换（设备数值项过多时按 numericGroups 分段） ========== */
.sp-num-tabs {
  width: 100%;
  margin-bottom: 16rpx;
  white-space: nowrap;
  /* 五段在 375pt 屏上会挤，横向滚动而不是换行，保持一行高度一致 */
  background: transparent;
}

.sp-num-tabs-inner {
  display: inline-flex;
  align-items: center;
  padding: 6rpx;
  background: #ffffff;
  border: 1rpx solid $border;
  border-radius: 16rpx;
}

.sp-num-tab {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 12rpx 18rpx;
  border-radius: 12rpx;
  transition: background 0.15s ease;

  &.is-active {
    background: $primary;

    .sp-num-tab-text,
    .sp-num-tab-count {
      color: #ffffff;
    }

    .sp-num-tab-count {
      background: rgba(255, 255, 255, 0.22);
    }
  }
}

.sp-num-tab-text {
  font-size: 24rpx;
  font-weight: 600;
  color: $text-2;
  line-height: 1;
}

.sp-num-tab-count {
  margin-left: 8rpx;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
  font-size: 18rpx;
  line-height: 1.4;
  color: $text-3;
  background: $fill;
  font-variant-numeric: tabular-nums;
}

/* ========== 组合卡：状态 + 下发按钮 ========== */
.sp-bundle-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 0;
  margin-top: 2rpx;
  border-top: 1rpx solid $border-soft;
}

.sp-bundle-state {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  font-size: 20rpx;
  line-height: 1.3;
  color: $text-3;
}

.sp-bundle-dot {
  flex-shrink: 0;
  width: 8rpx;
  height: 8rpx;
  margin-right: 10rpx;
  border-radius: 50%;
  background: #cfd6df;
}

.sp-bundle-state.is-pending {
  color: $primary;

  .sp-bundle-dot {
    background: $primary;
  }
}

.sp-bundle-send {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 186rpx;
  margin-left: 16rpx;
  padding: 14rpx 24rpx;
  border-radius: 12rpx;
  background: $primary;

  &:active {
    opacity: 0.88;
  }

  &.is-disabled {
    background: #f0f3f7;

    .sp-bundle-send-text {
      color: #a8b1bd;
    }
  }
}

.sp-bundle-send-text {
  margin-left: 8rpx;
  font-size: 23rpx;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5rpx;
}

/* 只有一个数值项时给整行，别留半张空卡 */
.sp-num-grid--single .sp-num-item {
  width: 100%;

  &--right {
    margin-left: 0;
  }
}

/* ========== 卡片头 ========== */
.sp-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 0 16rpx;
  border-bottom: 1rpx solid $border-soft;
}

.sp-card-title-wrap {
  display: flex;
  align-items: center;
  min-width: 0;
}

.sp-card-bar {
  flex-shrink: 0;
  width: 4rpx;
  height: 22rpx;
  margin-right: 12rpx;
  border-radius: 2rpx;
  background: $primary;
}

.sp-card-title {
  font-size: 26rpx;
  font-weight: 600;
  line-height: 1.3;
  color: $text-1;
  letter-spacing: 0.3rpx;
}

/* 只读态不显示操作提示：每张卡重复一句「请先点击修改」是噪音，
   入口交给顶部主色「修改」按钮，误触时另有点击提示兜底 */
.sp-card-hint {
  flex-shrink: 0;
  margin-left: 12rpx;
  font-size: 20rpx;
  color: #b3bbc7;
}

/* ========== 命令 / 模式行 ========== */
.sp-switch-row {
  padding: 20rpx 0 18rpx;
  border-bottom: 1rpx solid $border-soft;

  &:last-child {
    border-bottom: none;
    padding-bottom: 14rpx;
  }
}

.sp-switch-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
}

.sp-switch-label {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
  font-weight: 500;
  line-height: 1.35;
  color: #2b3240;
}

/* 当前值做成小胶囊，比裸文字更像正式 App 的状态标注 */
.sp-switch-cur {
  flex-shrink: 0;
  margin-left: 12rpx;
  padding: 4rpx 12rpx;
  font-size: 19rpx;
  line-height: 1.3;
  color: #6c7787;
  background: #f2f5f9;
  border-radius: 8rpx;
}

/* ========== 分段控件 ========== */
.sp-seg {
  display: flex;
  padding: 4rpx;
  background: #f2f4f8;
  border-radius: 12rpx;
}

.sp-seg-item {
  flex: 1 1 0;
  min-width: 0;
  padding: 13rpx 8rpx;
  border-radius: 9rpx;
  font-size: 22rpx;
  line-height: 1.3;
  color: $text-2;
  text-align: center;
  word-break: break-all;
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;

  &:active {
    opacity: 0.7;
  }

  /* 选中：白底 + 主色文字，与未选中的灰底一眼可分 */
  &.is-active {
    background: #ffffff;
    color: $primary;
    font-weight: 600;
    box-shadow: 0 1rpx 4rpx rgba(20, 32, 52, 0.10);
  }

  /* 危险动作只有选中后才转红，未选中不使用红字（红字易被误读成已选中） */
  &.is-danger.is-active {
    background: $danger;
    color: #ffffff;
    box-shadow: none;
  }
}

/* 选项超过 4 个（运行策略 11 项）：改为自适应宽度并允许换行 */
.sp-seg--wrap {
  flex-wrap: wrap;

  .sp-seg-item {
    flex: 0 0 auto;
    padding: 12rpx 20rpx;
    margin: 3rpx;
    font-size: 21rpx;
  }
}

/* ========== 数值两列栅格 ========== */
.sp-num-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 16rpx 0 10rpx;
}

.sp-num-item {
  position: relative;
  width: calc(50% - 10rpx);
  box-sizing: border-box;
  padding: 16rpx 18rpx 14rpx;
  margin-bottom: 12rpx;
  background: $fill;
  border: 1rpx solid $border;
  border-radius: 14rpx;
  transition: background 0.15s ease, border-color 0.15s ease;

  /* 右列由模板按奇偶加左间距，不依赖 nth-child（小程序选择器支持不一致） */
  &--right {
    margin-left: 12rpx;
  }

  &:active {
    background: #f1f5fa;
    border-color: #dfe7f2;
  }
}

/* 名称固定两行高：短名也让两列的值横向对齐，不会高低参差 */
.sp-num-name {
  display: block;
  height: 58rpx;
  overflow: hidden;
  font-size: 22rpx;
  line-height: 29rpx;
  color: $text-2;
}

.sp-num-value-row {
  display: flex;
  align-items: baseline;
  margin-top: 6rpx;
  min-width: 0;
}

.sp-num-value {
  max-width: 100%;
  font-size: 33rpx;
  font-weight: 600;
  line-height: 1.2;
  color: $text-1;
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
  letter-spacing: -0.2rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sp-num-unit {
  flex-shrink: 0;
  margin-left: 4rpx;
  font-size: 19rpx;
  color: $text-3;
}

.sp-num-range {
  display: block;
  margin-top: 6rpx;
  font-size: 19rpx;
  line-height: 1.3;
  color: #a9b3bf;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sp-num-edit {
  position: absolute;
  right: 12rpx;
  top: 12rpx;
  width: 26rpx;
  height: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
  transition: opacity 0.2s ease;

  /* 只读态是灰色小锁，编辑态换成主色铅笔：状态一眼可辨 */
  &.is-on {
    opacity: 1;
  }
}

/* ========== 空态 ========== */
.sp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 90rpx 0;
}

.sp-empty-text {
  margin-top: 14rpx;
  font-size: 24rpx;
  color: $text-3;
}
</style>
