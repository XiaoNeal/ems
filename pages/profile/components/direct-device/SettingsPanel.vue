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
          size="13"
          :color="editing ? '#1f9254' : '#ffffff'"
        ></uni-icons>
        <text>{{ editing ? '完成' : '修改' }}</text>
      </view>
    </view>

    <!-- 编辑态提示条：让「修改」按钮的切换有明确反馈，而不是只变个颜色 -->
    <view v-if="editing" class="sp-edit-hint">
      <uni-icons type="compose" size="13" color="#2f7cf6"></uni-icons>
      <text class="sp-edit-hint-text">编辑中 · 点击下方数值卡片修改，确认后立即下发</text>
    </view>

    <!-- 命令 / 模式：先在编辑态下才允许点击下发（未点「修改」时点击只会提示） -->
    <view v-for="(sec, si) in sections" :key="sec.key" class="sp-card" :class="{ 'is-locked': !editing }">
      <view class="sp-card-head">
        <view class="sp-card-title-wrap">
          <view class="sp-card-bar"></view>
          <text class="sp-card-title">{{ sec.title }}</text>
        </view>
        <text class="sp-card-hint" :class="{ 'is-warn': !editing }">{{ editing ? '选择后下发' : '先点「修改」' }}</text>
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

    <!-- 数值设定：两列栅格，点卡片即可编辑 -->
    <view v-for="(sec, si) in numericSections" :key="sec.key" class="sp-card" :class="editing ? 'is-editing' : 'is-locked'">
      <view class="sp-card-head">
        <view class="sp-card-title-wrap">
          <view class="sp-card-bar"></view>
          <text class="sp-card-title">{{ sec.title }}</text>
        </view>
        <text class="sp-card-hint">{{ sec.items.length }} 项 · {{ editing ? '点击卡片可改' : '先点「修改」' }}</text>
      </view>

      <view class="sp-num-grid">
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
      <text class="sp-empty-text">当前标签页暂无可用参数</text>
    </view>
  </view>
</template>

<script>
/**
 * 设置面板组件（数据驱动，对应 SETTINGS_TABS 中的一项）
 * 事件: toggle-edit(editKey)       —— 点「修改 / 完成」
 *       need-edit                 —— 未进编辑态就点了命令或数值（页面据此提示）
 *       switch-click({ dataKey, key, optionIndex, value, label })
 *       numeric-edit({ dataKey, key })
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
      localEditing: null
    }
  },
  computed: {
    editing() {
      return this.localEditing === null ? this.isEditing : this.localEditing
    },
    /** 命令/模式分区：快捷控制是多段，其余是单段（BMS 可能带额外开关段） */
    sections() {
      const cfg = this.tabCfg || {}
      if (cfg.switchSections && cfg.switchSections.length) {
        const mapped = cfg.switchSections.map((ss, i) => ({
          key: 's' + i,
          title: ss.title,
          items: this.withOptions(this.sectionParams(ss))
        }))
        if (mapped.some(s => s.items.length)) return mapped.filter(s => s.items.length)
        // 分区 key 与参数 key 对不上（协议模板切换时序问题）时平铺全部开关项，避免整页空白
        const all = this.withOptions(this.getParams(cfg.dataKey))
        return all.length ? [{ key: 's0', title: cfg.switchTitle || '命令 / 模式', items: all }] : []
      }
      const out = []
      const main = this.withOptions(this.getParams(cfg.dataKey))
      if (main.length) out.push({ key: 's0', title: cfg.switchTitle || '命令 / 模式', items: main })
      if (cfg.extraSwitchKey) {
        const extra = this.withOptions(this.getParams(cfg.extraSwitchKey))
        if (extra.length) out.push({ key: 's1', title: cfg.extraSwitchTitle || '开关控制', items: extra })
      }
      return out
    },
    /** 数值分区：支持 numericGroups 按 group 标签拆分（如 BMS 阈值 / 温控），否则单段 */
    numericSections() {
      const cfg = this.tabCfg || {}
      const all = this.getParams(cfg.numericKey)
      if (!all.length) return []
      const groups = cfg.numericGroups
      if (!groups || !groups.length) {
        return [{ key: 'n0', title: cfg.numericTitle || '数值设定', items: all }]
      }
      return groups
        .map((g, i) => ({ key: 'n' + i, title: g.title, items: all.filter(p => (p.group || '') === g.tag) }))
        .filter(g => g.items.length)
    },
    heroSub() {
      const sw = this.sections.reduce((sum, s) => sum + s.items.length, 0)
      const nm = this.numericSections.reduce((sum, s) => sum + s.items.length, 0)
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
    // 换到另一个 tab：编辑态回到初始（各 tab 有自己的编辑开关）
    'tabCfg.editKey'() {
      this.localEditing = null
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
$primary-soft: #eaf2ff;
$danger: #e5484d;
$text-1: #1d2430;
$text-2: #5c6673;
$text-3: #98a2ae;
$border: #eef1f5;
$border-soft: #f3f5f8;
$bg-soft: #f8fafc;

.settings-panel {
  padding-bottom: 8rpx;
}

/* ========== 顶部信息条 ========== */
.sp-hero {
  position: relative;
  display: flex;
  align-items: center;
  padding: 24rpx 22rpx;
  margin-bottom: 16rpx;
  background: #ffffff;
  border: 1rpx solid $border;
  border-radius: 20rpx;
  overflow: hidden;

  /* 右上角一枚极淡的蓝色光晕，纯装饰，不抢内容
     z-index: 0 让它固定在按钮下层：小程序的伪元素对 pointer-events 支持不一致，
     只靠 pointer-events:none 有过「光晕盖住修改按钮、点了没反应」的坑 */
  &::after {
    content: '';
    position: absolute;
    right: -70rpx;
    top: -70rpx;
    width: 210rpx;
    height: 210rpx;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(47, 124, 246, 0.12) 0%, rgba(47, 124, 246, 0) 70%);
    pointer-events: none;
    z-index: 0;
  }
}

.sp-hero-icon {
  flex-shrink: 0;
  width: 64rpx;
  height: 64rpx;
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
  font-size: 30rpx;
  font-weight: 700;
  color: $text-1;
  letter-spacing: 0.5rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sp-hero-sub {
  margin-top: 6rpx;
  font-size: 21rpx;
  color: $text-3;
}

.sp-edit-btn {
  position: relative;
  /* 必须高于装饰光晕（z-index:0），否则部分小程序版本里点击会被伪元素吃掉 */
  z-index: 2;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  /* 触控区偏小容易「点了没反应」，这里保证高度足够（约 40px） */
  padding: 18rpx 28rpx;
  border-radius: 999rpx;
  background: $primary;
  box-shadow: 0 6rpx 16rpx rgba(47, 124, 246, 0.26);
  transition: all 0.2s ease;

  text {
    margin-left: 6rpx;
    font-size: 23rpx;
    font-weight: 600;
    color: #ffffff;
  }

  &:active {
    transform: scale(0.95);
    opacity: 0.9;
  }

  /* 编辑中：转成绿色「完成」，提示当前处于可编辑状态 */
  &.is-editing {
    background: #eafaf0;
    box-shadow: none;

    text {
      color: #1f9254;
    }
  }
}

/* ========== 编辑态提示条 ========== */
.sp-edit-hint {
  display: flex;
  align-items: center;
  padding: 14rpx 20rpx;
  margin-bottom: 16rpx;
  background: $primary-soft;
  border: 1rpx solid #d8e6fb;
  border-radius: 14rpx;
}

.sp-edit-hint-text {
  margin-left: 10rpx;
  font-size: 21rpx;
  line-height: 1.35;
  color: #2f6bd8;
}

/* ========== 区块卡片 ========== */
.sp-card {
  padding: 0 22rpx 6rpx;
  margin-bottom: 16rpx;
  background: #ffffff;
  border: 1rpx solid $border;
  border-radius: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }

  /* 编辑态：数值卡换成淡蓝底，明确「这些值现在可以改」 */
  &.is-editing {
    .sp-num-item {
      background: #f5f9ff;
      border-color: #d8e6fb;
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
        color: #4a5464;
        font-weight: 600;
        box-shadow: 0 2rpx 8rpx rgba(29, 36, 48, 0.08);
      }

      /* 危险项的当前态：暗红文字提示，但不能用轨道灰底——会和未选中项融为一体 */
      &.is-danger.is-active {
        background: #ffffff;
        color: #c25256;
        box-shadow: 0 2rpx 8rpx rgba(29, 36, 48, 0.08);
      }
    }
  }
}

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
  width: 6rpx;
  height: 24rpx;
  margin-right: 12rpx;
  border-radius: 3rpx;
  background: linear-gradient(180deg, #63a4ff 0%, #2f7cf6 100%);
}

.sp-card-title {
  font-size: 27rpx;
  font-weight: 600;
  color: $text-1;
  letter-spacing: 0.5rpx;
}

.sp-card-hint {
  flex-shrink: 0;
  font-size: 20rpx;
  color: #b6bec9;

  /* 未进入编辑态：用暖色把「先点修改」推到视线里，而不是灰到看不见 */
  &.is-warn {
    color: #cf9a3a;
  }
}

/* ========== 命令 / 模式行 ========== */
.sp-switch-row {
  padding: 22rpx 0 20rpx;
  border-bottom: 1rpx solid $border-soft;

  &:last-child {
    border-bottom: none;
    padding-bottom: 16rpx;
  }
}

.sp-switch-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14rpx;
}

.sp-switch-label {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
  font-weight: 500;
  color: #2b3240;
  line-height: 1.35;
}

.sp-switch-cur {
  flex-shrink: 0;
  margin-left: 12rpx;
  font-size: 21rpx;
  color: $text-3;
}

/* ========== 分段控件 ========== */
.sp-seg {
  display: flex;
  padding: 5rpx;
  background: #f2f4f8;
  border-radius: 14rpx;
}

.sp-seg-item {
  flex: 1 1 0;
  min-width: 0;
  padding: 14rpx 8rpx;
  border-radius: 10rpx;
  font-size: 23rpx;
  line-height: 1.25;
  color: $text-2;
  text-align: center;
  word-break: break-all;
  transition: all 0.18s ease;

  &:active {
    opacity: 0.7;
  }

  /* 选中：白底 + 主色文字 + 轻投影，与未选中的灰底一眼可分 */
  &.is-active {
    background: #ffffff;
    color: $primary;
    font-weight: 600;
    box-shadow: 0 2rpx 8rpx rgba(47, 124, 246, 0.16);
  }

  /* 危险动作只有选中后才转红，未选中不使用红字（红字易被误读成已选中） */
  &.is-danger.is-active {
    background: $danger;
    color: #ffffff;
    box-shadow: 0 3rpx 10rpx rgba(229, 72, 77, 0.28);
  }
}

/* 选项超过 4 个（运行策略 11 项）：改为自适应宽度并允许换行 */
.sp-seg--wrap {
  flex-wrap: wrap;

  .sp-seg-item {
    flex: 0 0 auto;
    padding: 14rpx 22rpx;
    margin: 3rpx;
  }
}

/* ========== 数值两列栅格 ========== */
.sp-num-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 18rpx 0 12rpx;
}

.sp-num-item {
  position: relative;
  width: calc(50% - 6rpx);
  box-sizing: border-box;
  padding: 18rpx 18rpx 16rpx;
  margin-bottom: 12rpx;
  background: $bg-soft;
  border: 1rpx solid $border;
  border-radius: 14rpx;
  transition: all 0.15s ease;

  /* 右列由模板按奇偶加左间距，不依赖 nth-child（小程序选择器支持不一致） */
  &--right {
    margin-left: 12rpx;
  }

  &:active {
    background: #f1f5fa;
    border-color: #dbe6f5;
  }
}

.sp-num-name {
  display: block;
  height: 60rpx;
  overflow: hidden;
  font-size: 22rpx;
  line-height: 1.35;
  color: $text-2;
}

.sp-num-value-row {
  display: flex;
  align-items: baseline;
  margin-top: 4rpx;
  min-width: 0;
}

.sp-num-value {
  max-width: 100%;
  font-size: 34rpx;
  font-weight: 600;
  color: $text-1;
  font-family: 'Menlo', 'Consolas', 'Roboto Mono', monospace;
  letter-spacing: -0.5rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sp-num-unit {
  flex-shrink: 0;
  margin-left: 4rpx;
  font-size: 20rpx;
  color: $text-3;
}

.sp-num-range {
  display: block;
  margin-top: 6rpx;
  font-size: 19rpx;
  line-height: 1.3;
  color: #b6bec9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sp-num-edit {
  position: absolute;
  right: 14rpx;
  top: 14rpx;
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
  padding: 100rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sp-empty-text {
  font-size: 26rpx;
  color: $text-3;
}
</style>
