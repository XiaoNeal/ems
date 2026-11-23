<template>
  <view class="container performance-analysis" :class="[platformClass, { embedded }]">
    <DyNavbar v-if="!embedded" title="性能分析" :placeholder="true" />
    <view v-if="!embedded" class="fixed-placeholder"></view>

    <view class="content">
      <!-- 费用 KPI -->
      <view class="kpi-card">
        <view class="kpi-main">
          <view class="kpi-title-row">
            <text class="kpi-main-label">综合节省费用</text>
            <view class="info-tip-btn" @tap="toggleTooltip('kpi')">
              <text class="info-tip-icon">i</text>
            </view>
          </view>
          <text class="kpi-main-value"><text class="kpi-currency">¥</text>{{ savedCostText }}</text>
        </view>
        <view class="kpi-side">
          <view class="kpi-side-row">
            <text class="kpi-side-label">理论购电费用</text>
            <text class="kpi-side-value">¥{{ theoryCostText }}</text>
          </view>
          <view class="kpi-side-row">
            <text class="kpi-side-label">购电费用</text>
            <text class="kpi-side-value">¥{{ actualCostText }}</text>
          </view>
        </view>
        <view class="card-tools kpi-tools">
          <dy-date :timeType="dateTypes.kpi" v-model="cards.kpi.date"
            @getData="onCardDateChange('kpi')" class="date-picker" compact />
          <view class="period-switch">
            <view v-for="t in periodTabs" :key="t" class="period-tab"
              :class="{ active: cards.kpi.period === t }" @click="onPeriodChange('kpi', t)">{{ t }}</view>
          </view>
        </view>
        <!-- KPI 说明弹层 -->
        <view v-if="tooltipKey === 'kpi'" class="tooltip-mask" @tap="hideTooltip"></view>
        <view v-if="tooltipKey === 'kpi'" class="tooltip-popover" @tap.stop>
          <view class="tooltip-title">费用计算口径</view>
          <view class="tooltip-line"><text class="tooltip-term">理论购电费用</text>＝Σ(每小时负荷电量 × 分时电价)</view>
          <view class="tooltip-line"><text class="tooltip-term">购电费用</text>＝Σ(每小时电网供电量 × 分时电价)</view>
          <view class="tooltip-line"><text class="tooltip-term">综合节省费用</text>＝光伏发电量 × 峰时电价</view>
        </view>
      </view>

      <!-- 本地供给构成 -->
      <view class="chart-card">
        <view class="card-header">
          <view class="card-title-row">
            <text class="card-title">本地供给构成</text>
            <view class="info-tip-btn" @tap="toggleTooltip('supply')">
              <text class="info-tip-icon">i</text>
            </view>
          </view>
          <view class="card-tools">
            <dy-date :timeType="dateTypes.supply" v-model="cards.supply.date"
              @getData="onCardDateChange('supply')" class="date-picker" compact />
            <view class="period-switch">
              <view v-for="t in periodTabs" :key="t" class="period-tab"
                :class="{ active: cards.supply.period === t }" @click="onPeriodChange('supply', t)">{{ t }}</view>
            </view>
          </view>
        </view>
        <view class="banner">
          <view class="banner-item">
            <text class="banner-label">光伏自驱率</text>
            <text class="banner-value">{{ supplySelfSufficiencyRate }}<text class="banner-unit">%</text></text>
          </view>
          <view class="banner-divider"></view>
          <view class="banner-item">
            <text class="banner-label">自给率</text>
            <text class="banner-value">{{ supplySelfBalanceRate }}<text class="banner-unit">%</text></text>
          </view>
          <view class="banner-divider"></view>
          <view class="banner-item">
            <text class="banner-label">碳减排量</text>
            <text class="banner-value">{{ supplyCarbonReduction }}<text class="banner-unit">tCO₂</text></text>
          </view>
        </view>
        <view v-if="supplySums.total > 0" class="chart-body ring-stage">
          <view class="ring-chart">
            <qiun-data-charts type="ring" :chartData="supplyChartData" :opts="supplyChartOptions"
              :canvas2d="canvas2d" :canvas-id="chartId + '-supply'" :ontouch="true" class="chart chart-ring" />
          </view>
          <view v-for="tip in ringTips" :key="tip.lineKey" class="ring-line" :style="tip.lineStyle"></view>
          <view v-for="tip in ringTips" :key="tip.tipKey" class="ring-tip" :class="tip.slotClass">
            <view class="tip-top">
              <text class="tip-name">{{ tip.name }}</text>
              <text class="tip-pct" :class="tip.pctClass">{{ tip.pct }}%</text>
            </view>
            <text class="tip-value">{{ tip.value }}<text class="tip-unit">kWh</text></text>
          </view>
        </view>
        <EmptyState v-else title="暂无数据" desc="当前时段暂无供给数据" @refresh="loadAll" />
        <!-- 构成说明弹层 -->
        <view v-if="tooltipKey === 'supply'" class="tooltip-mask" @tap="hideTooltip"></view>
        <view v-if="tooltipKey === 'supply'" class="tooltip-popover" @tap.stop>
          <view class="tooltip-title">构成说明</view>
          <view class="tooltip-note">各曲线为对应周期内的瞬时功率（kW）</view>
          <view class="tooltip-line"><text class="tooltip-term">光伏发电</text>：光伏 DC 输出功率</view>
          <view class="tooltip-line"><text class="tooltip-term">储能充/放电</text>：储能 DC-DC 的充放电功率</view>
          <view class="tooltip-line"><text class="tooltip-term">负荷</text>：本地负载功率</view>
          <view class="tooltip-line"><text class="tooltip-term">供电/馈电</text>：电网双向功率</view>
          <view class="tooltip-line"><text class="tooltip-term">光伏自驱率</text>＝光伏发电 / 负荷 × 100%</view>
          <view class="tooltip-line"><text class="tooltip-term">自给率</text>＝(光伏 + 储能放电) / 负荷 × 100%</view>
          <view class="tooltip-line"><text class="tooltip-term">碳减排</text>＝光伏发电量 × 0.0005 tCO₂/kWh</view>
        </view>
      </view>

      <!-- 分时电价 · 理论负荷用电费 · 综合节省电费 -->
      <view class="chart-card">
        <view class="card-header">
          <view class="card-title-row">
            <text class="card-title">分时电价 · 理论负荷用电费 · 综合节省电费</text>
            <view class="info-tip-btn" @tap="toggleTooltip('price')">
              <text class="info-tip-icon">i</text>
            </view>
          </view>
          <view class="card-tools">
            <dy-date :timeType="dateTypes.price" v-model="cards.price.date"
              @getData="onCardDateChange('price')" class="date-picker" compact />
            <view class="period-switch">
              <view v-for="t in periodTabs" :key="t" class="period-tab"
                :class="{ active: cards.price.period === t }" @click="onPeriodChange('price', t)">{{ t }}</view>
            </view>
          </view>
        </view>
        <view v-if="hasDataOf('price')" class="chart-body">
          <qiun-data-charts type="mix" :chartData="priceChartData" :opts="priceChartOptions"
            :canvas2d="canvas2d" :canvas-id="chartId + '-price'" :ontouch="true" class="chart chart-tall" />
        </view>
        <EmptyState v-else title="暂无数据" desc="当前时段暂无电费数据" @refresh="loadAll" />
        <!-- 电费图表说明弹层 -->
        <view v-if="tooltipKey === 'price'" class="tooltip-mask" @tap="hideTooltip"></view>
        <view v-if="tooltipKey === 'price'" class="tooltip-popover" @tap.stop>
          <view class="tooltip-title">电费图表说明</view>
          <view class="tooltip-line"><text class="tooltip-term">分时电价</text>：取自系统设定电价（仅日周期显示）</view>
          <view class="tooltip-line"><text class="tooltip-term">理论负荷用电费</text>：该时段内假设全部负荷都从电网买电的费用，用电量 × 分时电价</view>
          <view class="tooltip-line"><text class="tooltip-term">综合节省电费</text>＝该时段光伏发电量 × 峰时电价</view>
        </view>
      </view>

      <!-- 光伏自驱率 · 自给率 趋势（合并） -->
      <view class="chart-card">
        <view class="card-header">
          <view class="card-title-row">
            <text class="card-title">光伏自驱率 · 自给率 趋势</text>
            <view class="info-tip-btn" @tap="toggleTooltip('rate')">
              <text class="info-tip-icon">i</text>
            </view>
          </view>
          <view class="card-tools">
            <dy-date :timeType="dateTypes.rate" v-model="cards.rate.date"
              @getData="onCardDateChange('rate')" class="date-picker" compact />
            <view class="period-switch">
              <view v-for="t in periodTabs" :key="t" class="period-tab"
                :class="{ active: cards.rate.period === t }" @click="onPeriodChange('rate', t)">{{ t }}</view>
            </view>
          </view>
        </view>
        <view v-if="hasDataOf('rate')" class="chart-body">
          <qiun-data-charts type="mix" :chartData="rateChartData" :opts="rateChartOptions"
            :canvas2d="canvas2d" :canvas-id="chartId + '-rate'" :ontouch="true" class="chart chart-tall" />
        </view>
        <EmptyState v-else title="暂无数据" desc="当前时段暂无比率数据" @refresh="loadAll" />
        <!-- 指标说明弹层 -->
        <view v-if="tooltipKey === 'rate'" class="tooltip-mask" @tap="hideTooltip"></view>
        <view v-if="tooltipKey === 'rate'" class="tooltip-popover" @tap.stop>
          <view class="tooltip-title">指标计算公式</view>
          <view class="tooltip-line"><text class="tooltip-term">光伏自驱率</text>＝光伏发电量 / 负荷用电量 × 100%</view>
          <view class="tooltip-line"><text class="tooltip-term">自给率</text>＝(光伏发电量 + 储能放电量) / 负荷用电量 × 100%</view>
          <view class="tooltip-note">自给率越高，说明本地微能站对电网的依赖越低</view>
          <view class="tooltip-note">当自给率 ≥ 100% 时，表示本地供给完全覆盖负荷</view>
        </view>
      </view>

      <!-- 母线电压 -->
      <view class="chart-card">
        <view class="card-header">
          <view class="card-title-row">
            <text class="card-title">母线电压（{{ busRatedVoltage }}V 额定 · 实时 · 偏差率）</text>
            <view class="info-tip-btn" @tap="toggleTooltip('bus')">
              <text class="info-tip-icon">i</text>
            </view>
          </view>
          <view class="card-tools">
            <dy-date :timeType="dateTypes.bus" v-model="cards.bus.date"
              @getData="onCardDateChange('bus')" class="date-picker" compact />
            <view class="period-switch">
              <view v-for="t in periodTabs" :key="t" class="period-tab"
                :class="{ active: cards.bus.period === t }" @click="onPeriodChange('bus', t)">{{ t }}</view>
            </view>
          </view>
        </view>
        <view v-if="busVoltageArr.length > 0" class="chart-body">
          <qiun-data-charts type="line" :chartData="busChartData" :opts="busChartOptions"
            :canvas2d="canvas2d" :canvas-id="chartId + '-bus'" :ontouch="true" class="chart chart-tall" />
        </view>
        <EmptyState v-else title="暂无数据" desc="当前时段暂无母线电压数据" @refresh="loadAll" />
        <!-- 母线电压说明弹层 -->
        <view v-if="tooltipKey === 'bus'" class="tooltip-mask" @tap="hideTooltip"></view>
        <view v-if="tooltipKey === 'bus'" class="tooltip-popover" @tap.stop>
          <view class="tooltip-title">母线电压说明</view>
          <view class="tooltip-line"><text class="tooltip-term">母线电压</text>：取自储能 DC 母线电压（V）</view>
          <view class="tooltip-line"><text class="tooltip-term">额定电压</text>：{{ busRatedVoltage }}V 水平参考线</view>
          <view class="tooltip-line"><text class="tooltip-term">偏差率</text>＝(实时 − 额定) / 额定 × 100%</view>
          <view class="tooltip-note">正值表示高于额定值，负值表示低于额定值</view>
        </view>
      </view>

      <view class="bottom-space"></view>
    </view>

    <view v-if="loading" class="loading-mask">
      <view class="loading-box">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'
import dyDate from '@/components/dy-Date/dy-Date.vue'
import EmptyState from '@/components/empty-state/empty-state.vue'
import {
  queryDayElectricityStatistic,
  queryMonthElectricityStatistic,
  queryYearElectricityStatistic,
  getPriceByAreaId,
  getPerHourBusVolte,
  getPerDayBusVolte,
  getPerMonthBusVolte,
  queryPerHourFee,
  queryPerDayFee,
  queryPerMonthFee
} from '@/api/power'

// 碳排放因子 (tCO₂/kWh)
const CARBON_FACTOR = 0.0005
// 分时电价兜底默认值（接口未返回时使用）
const FALLBACK_PRICE_24H = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.0, 0.9, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.2]
// 母线额定电压（V）
const BUS_RATED_VOLTAGE = 750
// 分时电价所属区域（与网页端保持一致，后续可改为按站点区域动态获取）
const PRICE_AREA_ID = 387

const pad2 = n => String(n).padStart(2, '0')
const formatDate = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

// 每张卡片独立的周期 / 日期 / 数据
const createCardState = date => ({
  period: '日',
  date,
  apiData: [],
  price24H: FALLBACK_PRICE_24H.slice(),
  busVoltageData: [],
  feeData: []
})

export default {
  name: 'PerformanceAnalysis',
  components: { DyNavbar, dyDate, EmptyState },
  props: {
    // 作为首页 Tab 内容嵌入时隐藏独立导航栏与占位
    embedded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const today = formatDate(new Date())
    return {
      chartId: 'pa-' + Math.random().toString(36).slice(2, 9),
      canvas2d: this.$Config?.ISCANVAS2D ?? false,
      platformClass: '',
      periodTabs: ['日', '月', '年'],
      loadingCount: 0,
      busRatedVoltage: BUS_RATED_VOLTAGE,
      tooltipKey: null, // 当前展开的说明卡：null | 'kpi' | 'bus'
      ringStageWidth: 0, // 环形图容器实测尺寸（px），用于精确计算引导线
      ringStageHeight: 0,
      ringCenter: { x: 0, y: 0, r: 0 }, // 实测 canvas 圆心/半径（相对 .ring-stage）
      cards: {
        kpi: createCardState(today),
        supply: createCardState(today),
        price: createCardState(today),
        rate: createCardState(today),
        bus: createCardState(today)
      }
    }
  },
  computed: {
    loading() {
      return this.loadingCount > 0
    },
    // 本地供给汇总（光伏 / 储能放电 / 电网供电 / 负荷）
    supplySums() {
      return this.sumSupplyOf(this.cards.supply)
    },
    // 光伏自驱率 = 光伏发电 / 负荷 × 100%（与趋势图口径一致，上限 100%）
    supplySelfSufficiencyRate() {
      const s = this.supplySums
      return s.load > 0 ? (Math.min(s.pv / s.load, 1) * 100).toFixed(1) : '0.0'
    },
    supplySelfBalanceRate() {
      const s = this.supplySums
      return s.load > 0 ? (((s.pv + s.discharge) / s.load) * 100).toFixed(1) : '0.0'
    },
    supplyCarbonReduction() {
      return (this.supplySums.pv * CARBON_FACTOR).toFixed(3)
    },
    // 本地供给构成占比
    supplyPct() {
      const s = this.supplySums
      const total = s.total || 1
      return {
        pv: +((s.pv / total) * 100).toFixed(1),
        discharge: +((s.discharge / total) * 100).toFixed(1),
        grid: +((s.grid / total) * 100).toFixed(1)
      }
    },
    // KPI 使用自身卡片的周期/日期数据
    theoryCost() {
      const card = this.cards.kpi
      const fee = this.sumFeeFromApi(card)
      if (fee) return fee.loadFee.toFixed(2)
      return (this.sumSupplyOf(card).load * this.avgPriceOf(card)).toFixed(2)
    },
    savedCost() {
      const card = this.cards.kpi
      const fee = this.sumFeeFromApi(card)
      // 接口 saveFee 可能返回负值（含义是"实际比理论少花的费用"），取绝对值即节省费用
      if (fee) return String(Math.abs(fee.saveFee || 0).toFixed(2))
      // 前端兜底口径：光伏发电量 × 分时电价（与网页端一致）
      const data = this.hourAlignedOf(card)
      const isDay = card.period === '日'
      const priceArr = isDay ? card.price24H : data.map(() => this.avgPriceOf(card))
      let total = 0
      data.forEach((item, i) => {
        total += (parseFloat(item.photovoltaicPower) || 0) * (priceArr[i] || 0)
      })
      return total.toFixed(2)
    },
    actualCost() {
      const card = this.cards.kpi
      const fee = this.sumFeeFromApi(card)
      // saveFee 取绝对值后作为节省费用，购电费用 = 理论 − 节省
      if (fee) return Math.max(fee.loadFee - Math.abs(fee.saveFee || 0), 0).toFixed(2)
      return (this.sumSupplyOf(card).grid * this.avgPriceOf(card)).toFixed(2)
    },
    // 小程序模板不支持方法调用，统一在 computed 中格式化
    savedCostText() {
      return this.fmtMoney(this.savedCost)
    },
    theoryCostText() {
      return this.fmtMoney(this.theoryCost)
    },
    actualCostText() {
      return this.fmtMoney(this.actualCost)
    },
    supplyValueText() {
      const s = this.supplySums
      return {
        pv: this.fmtMoney(s.pv),
        discharge: this.fmtMoney(s.discharge),
        grid: this.fmtMoney(s.grid)
      }
    },
    // 环形图标签与引导线：按容器实测尺寸定位，按扇区质心角度匹配最近标签槽位，避免连线指空或交叉
    ringTips() {
      if (!(this.supplySums.total > 0)) return []
      const pct = this.supplyPct
      const segments = [
        { key: 'pv', name: '光伏发电', pct: pct.pv, value: this.supplyValueText.pv, pctClass: 'tip-pct-pv' },
        { key: 'discharge', name: '储能放电', pct: pct.discharge, value: this.supplyValueText.discharge, pctClass: 'tip-pct-storage' },
        { key: 'grid', name: '电网供电', pct: pct.grid, value: this.supplyValueText.grid, pctClass: 'tip-pct-grid' }
      ]
      // 扇区自 3 点钟方向顺时针排布；角度用精确数值算，避免百分比四舍五入带来偏移
      const s = this.supplySums
      const values = [s.pv, s.discharge, s.grid] // 与 series data 顺序一致
      const total = values.reduce((a, b) => a + b, 0) || 1
      let cum = 0
      segments.forEach((item, i) => {
        item.midAngle = ((cum + values[i] / 2) / total) * 360
        cum += values[i]
      })
      const px = v => (typeof uni !== 'undefined' && uni.upx2px ? uni.upx2px(v) : v)
      const stageW = this.ringStageWidth || px(682)
      const stageH = this.ringStageHeight || px(340)
      const tipW = px(150)
      const tipHalfH = px(32)
      // 圆心取实测 canvas 矩形；UCharts 画环时 radius = 半宽 - pieChartTextPadding(5px)，
      // 环带宽 ringWidth=22rpx，线起点应落在环带中线，否则会悬在环外
      const cx = this.ringCenter.x || stageW / 2
      const cy = this.ringCenter.y || px(160)
      const r = (this.ringCenter.r || px(130)) - 5 - px(22) / 2
      // 标签槽位：右上 / 右下 / 左中，edge 为朝向环的标签边缘
      const slotOf = (centerX, centerY, edgeX, className) => ({
        angle: ((Math.atan2(centerY - cy, centerX - cx) * 180) / Math.PI + 360) % 360,
        edge: [edgeX, centerY],
        className
      })
      const slots = [
        slotOf(stageW - tipW / 2, px(24) + tipHalfH, stageW - tipW, 'tip-slot-rt'),
        slotOf(stageW - tipW / 2, stageH - px(16) - tipHalfH, stageW - tipW, 'tip-slot-rb'),
        slotOf(tipW / 2, px(126) + tipHalfH, tipW, 'tip-slot-l')
      ]
      // 取与扇区角度总偏差最小的排列，使标签块与扇区方位一致
      const permutations = arr => arr.length <= 1 ? [arr] : arr.reduce((res, item, i) =>
        res.concat(permutations(arr.slice(0, i).concat(arr.slice(i + 1))).map(rest => [item].concat(rest))), [])
      let best = null
      permutations(slots).forEach(items => {
        const cost = segments.reduce((sum, seg, i) => sum + this.angleDistance(seg.midAngle, items[i].angle), 0)
        if (!best || cost < best.cost) best = { cost, items }
      })
      return segments.map((seg, i) => {
        const slot = best.items[i]
        const rad = seg.midAngle * Math.PI / 180
        const startX = cx + r * Math.cos(rad)
        const startY = cy + r * Math.sin(rad)
        const dx = slot.edge[0] - startX
        const dy = slot.edge[1] - startY
        const len = Math.sqrt(dx * dx + dy * dy)
        const deg = (Math.atan2(dy, dx) * 180) / Math.PI
        return {
          // 两组 v-for 在同一父节点下，key 必须唯一的字段；用小成员表达式便于编译成 wx:key
          lineKey: 'line-' + seg.key,
          tipKey: 'tip-' + seg.key,
          name: seg.name,
          pct: seg.pct,
          value: seg.value,
          pctClass: seg.pctClass,
          slotClass: slot.className,
          lineStyle: `left:${startX.toFixed(1)}px;top:${startY.toFixed(1)}px;width:${len.toFixed(1)}px;transform:rotate(${deg.toFixed(2)}deg);`
        }
      })
    },
    dateTypes() {
      const map = {}
      Object.keys(this.cards).forEach(key => {
        const p = this.cards[key].period
        map[key] = p === '日' ? 'day' : p === '月' ? 'month' : 'year'
      })
      return map
    },
    priceChartSeries() {
      const card = this.cards.price
      const data = this.hourAlignedOf(card)
      const n = this.xLabelsOf(card).length
      const isDay = card.period === '日'
      const priceArr = isDay ? card.price24H : data.map(() => this.avgPriceOf(card))
      const feeFromApi = this.buildFeeFromApi(card, n)
      let theoryArr
      let savedArr
      if (feeFromApi) {
        theoryArr = feeFromApi.loadFeeArr.map(v => (v === null ? 0 : v))
        // saveFee 接口可能返回负值，取绝对值即节省费用
        savedArr = feeFromApi.saveFeeArr.map(v => (v === null ? 0 : Math.abs(v)))
      } else {
        theoryArr = data.map((item, i) => +((parseFloat(item.loadPower) || 0) * priceArr[i]).toFixed(2))
        // 前端兜底口径：光伏发电量 × 分时电价（与网页端一致）
        savedArr = data.map((item, i) => {
          const pv = parseFloat(item.photovoltaicPower) || 0
          return +(pv * (priceArr[i] || 0)).toFixed(2)
        })
      }
      return { priceArr, theoryArr, savedArr, isDay }
    },
    busVoltageArr() {
      const card = this.cards.bus
      return this.buildBusVoltageFromApi(card, this.xLabelsOf(card).length) || []
    },

    // ---------- 图表数据 ----------
    supplyChartData() {
      const s = this.supplySums
      return {
        series: [{
          data: [
            { name: '光伏发电', value: +s.pv.toFixed(2) },
            { name: '储能放电', value: +s.discharge.toFixed(2) },
            { name: '电网供电', value: +s.grid.toFixed(2) }
          ]
        }]
      }
    },
    supplyChartOptions() {
      return {
        color: ['#34c38f', '#3b82f6', '#a9b6c9'],
        padding: [0, 0, 0, 0],
        dataLabel: false,
        legend: { show: false },
        title: { name: '' },
        subtitle: { name: '' },
        extra: {
          ring: { ringWidth: 22, activeOpacity: 0.5, border: true, borderWidth: 2, borderColor: '#ffffff' }
        }
      }
    },
    priceChartData() {
      const { priceArr, theoryArr, savedArr, isDay } = this.priceChartSeries
      const series = [
        { name: '理论负荷用电费', type: 'column', index: isDay ? 1 : 0, data: theoryArr },
        { name: '综合节省电费', type: 'column', index: isDay ? 1 : 0, data: savedArr }
      ]
      if (isDay) {
        series.push({ name: '分时电价', type: 'line', index: 0, data: priceArr })
      }
      return { categories: this.xLabelsOf(this.cards.price), series }
    },
    priceChartOptions() {
      const isDay = this.cards.price.period === '日'
      const yAxisData = isDay
        ? [
          { position: 'left', title: '电价(元)', titleFontSize: 10, tofix: 2, min: 0 },
          { position: 'right', title: '电费(元)', titleFontSize: 10, tofix: 2, min: 0 }
        ]
        : [{ position: 'left', title: '电费(元)', titleFontSize: 10, tofix: 2, min: 0 }]
      return {
        color: ['#c9d6e8', '#4f7cf6', '#f0873c'],
        padding: [4, 10, 0, 4],
        dataLabel: false,
        legend: { show: true, position: 'top', fontSize: 9, lineHeight: 16 },
        xAxis: this.xAxisOf(this.cards.price),
        yAxis: { gridType: 'dash', dashLength: 3, showTitle: true, data: yAxisData },
        extra: { mix: { column: { width: 6 }, line: { type: 'curve', width: 2 } } }
      }
    },
    // 合并的比率趋势：光伏自驱率(仅光伏) + 自给率(光伏+储能放电) + 光伏/负荷柱状
    rateChartData() {
      const card = this.cards.rate
      const data = this.hourAlignedOf(card)
      const pvData = data.map(item => +(parseFloat(item.photovoltaicPower) || 0).toFixed(2))
      const loadData = data.map(item => +(parseFloat(item.loadPower) || 0).toFixed(2))
      const selfRateData = data.map(item => {
        const pv = parseFloat(item.photovoltaicPower) || 0
        const load = parseFloat(item.loadPower) || 0
        if (load <= 0) return 0
        return +(Math.min(pv / load, 1) * 100).toFixed(1)
      })
      const balanceRateData = data.map(item => {
        const pv = parseFloat(item.photovoltaicPower) || 0
        const discharge = parseFloat(item.storageDischarge) || 0
        const load = parseFloat(item.loadPower) || 0
        if (load <= 0) return 0
        return +(Math.min((pv + discharge) / load, 1) * 100).toFixed(1)
      })
      return {
        categories: this.xLabelsOf(card),
        series: [
          { name: '光伏自驱率', type: 'line', index: 0, data: selfRateData },
          { name: '自给率', type: 'line', index: 0, data: balanceRateData },
          { name: '光伏发电量', type: 'column', index: 1, data: pvData },
          { name: '负荷用电量', type: 'column', index: 1, data: loadData }
        ]
      }
    },
    rateChartOptions() {
      return {
        color: ['#4f7cf6', '#9b6bdb', '#34c38f', '#c9d6e8'],
        padding: [4, 10, 0, 4],
        dataLabel: false,
        legend: { show: true, position: 'top', fontSize: 9, lineHeight: 16 },
        xAxis: this.xAxisOf(this.cards.rate),
        yAxis: {
          gridType: 'dash',
          dashLength: 3,
          showTitle: true,
          data: [
            { position: 'left', title: '比率(%)', titleFontSize: 9, tofix: 0, min: 0, max: 100 },
            { position: 'right', title: '电量(kWh)', titleFontSize: 9, tofix: 0 }
          ]
        },
        extra: { mix: { column: { width: 6 }, line: { type: 'curve', width: 2 } } }
      }
    },
    busChartData() {
      const card = this.cards.bus
      const categories = this.xLabelsOf(card)
      const n = categories.length
      const rated = Array.from({ length: n }, () => BUS_RATED_VOLTAGE)
      // 偏差率：(实时 − 额定) / 额定 × 100%，保留原始精度，由 display formatter 控制小数位
      const deviation = this.busVoltageArr.map(v => (v === null || v === undefined) ? null : ((v - BUS_RATED_VOLTAGE) / BUS_RATED_VOLTAGE) * 100)
      return {
        categories,
        series: [
          { name: '额定母线电压', type: 'line', index: 0, data: rated },
          { name: '实时母线电压', type: 'line', index: 0, data: this.busVoltageArr },
          { name: '偏差率', type: 'line', index: 1, data: deviation, format: val => (val === null || val === undefined) ? '--' : `${Number(val).toFixed(1)}%` }
        ]
      }
    },
    busChartOptions() {
      const voltages = this.busVoltageArr.filter(v => v !== null && v !== undefined)
      const minV = voltages.length ? Math.min(...voltages) : BUS_RATED_VOLTAGE - 15
      const maxV = voltages.length ? Math.max(...voltages) : BUS_RATED_VOLTAGE + 15
      // 让左右轴范围严格对应：左轴 V 范围 ↔ 右轴 % 范围
      const pad = Math.max(5, Math.max(BUS_RATED_VOLTAGE - minV, maxV - BUS_RATED_VOLTAGE))
      const leftMin = BUS_RATED_VOLTAGE - pad
      const leftMax = BUS_RATED_VOLTAGE + pad
      const rightMin = +(((leftMin - BUS_RATED_VOLTAGE) / BUS_RATED_VOLTAGE) * 100).toFixed(1)
      const rightMax = +(((leftMax - BUS_RATED_VOLTAGE) / BUS_RATED_VOLTAGE) * 100).toFixed(1)
      return {
        color: ['#94a3b8', '#2563eb', '#f97316'],
        padding: [4, 10, 0, 4],
        dataLabel: false,
        dataPointShape: false,
        legend: { show: true, position: 'top', fontSize: 9, lineHeight: 16 },
        xAxis: this.xAxisOf(this.cards.bus),
        yAxis: {
          gridType: 'dash',
          dashLength: 3,
          showTitle: true,
          data: [
            { position: 'left', title: '电压(V)', titleFontSize: 9, tofix: 1, min: leftMin, max: leftMax },
            { position: 'right', title: '偏差率(%)', titleFontSize: 9, tofix: 1, min: rightMin, max: rightMax, formatter: val => `${Number(val).toFixed(1)}%` }
          ]
        },
        extra: { line: { type: 'curve', width: 2 } }
      }
    }
  },
  watch: {
    '$store.state.currentSelectDevice': {
      handler() {
        this.loadAll()
      },
      immediate: true,
      deep: true
    },
    // 环形图区域是 v-if 渲染的，数据到达后要重新测量
    'supplySums.total'() {
      this.$nextTick(() => this.measureRingStage())
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: res => {
        this.platformClass = res.platform === 'ios' ? 'ios-platform' : 'android-platform'
      }
    })
  },
  mounted() {
    this.$nextTick(() => this.measureRingStage())
    if (typeof uni.onWindowResize === 'function') {
      this._onWindowResize = () => this.measureRingStage()
      uni.onWindowResize(this._onWindowResize)
    }
  },
  onShow() {
    this.measureRingStage()
  },
  beforeDestroy() {
    if (this._onWindowResize && typeof uni.offWindowResize === 'function') {
      uni.offWindowResize(this._onWindowResize)
    }
  },
  methods: {
    fmtMoney(v) {
      const n = Number(v)
      if (!Number.isFinite(n)) return '0'
      const fixed = n.toFixed(2)
      const parts = fixed.split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    },
    // 两个角度之间的最短夹角（0~180）
    angleDistance(a, b) {
      const d = Math.abs(a - b) % 360
      return Math.min(d, 360 - d)
    },
    // 实测容器与 canvas 矩形：引导线必须从真实环带边缘出发、连到标签块边缘
    measureRingStage() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.ring-stage').boundingClientRect()
      query.select('.ring-chart').boundingClientRect()
      query.exec(([stage, chart]) => {
        if (!stage || !chart || !stage.width || !chart.width) return
        this.ringStageWidth = stage.width
        this.ringStageHeight = stage.height
        this.ringCenter = {
          x: chart.left - stage.left + chart.width / 2,
          y: chart.top - stage.top + chart.height / 2,
          r: Math.min(chart.width, chart.height) / 2
        }
      })
    },
    // 横轴配置：单位与末位留空已在 xLabelsOf 的 categories 数据里生成，
    // 不再用 formatter 函数（APP 端 renderjs 传 opts 会丢失函数）。
    xAxisOf() {
      return {
        labelCount: 6,
        disableGrid: true,
        fontSize: 9
      }
    },
    getStation() {
      return this.$store.state.currentSelectDevice || {}
    },
    getEsId() {
      const station = this.getStation()
      return station.esId || station.id || ''
    },
    // 站点缺少 areaLevelId 时从登录用户的站点列表补全
    getAreaLevelIds() {
      const station = this.getStation()
      if (station.areaLevelId) return station.areaLevelId
      const esIds = this.$store.state.userInfo?.esIds || []
      const id = station.id || station.esId
      const found = esIds.find(item => (item.id || item.esId) === id)
      return found ? found.areaLevelId : ''
    },
    getYearMonth(dateStr) {
      const now = new Date()
      const parts = String(dateStr || '').split('-')
      return {
        year: parseInt(parts[0], 10) || now.getFullYear(),
        month: parseInt(parts[1], 10) || (now.getMonth() + 1)
      }
    },
    // 说明弹层切换：再次点击同一个按钮或点遮罩关闭
    toggleTooltip(key) {
      this.tooltipKey = this.tooltipKey === key ? null : key
    },
    hideTooltip() {
      this.tooltipKey = null
    },
    hasDataOf(key) {
      const list = this.cards[key].apiData
      return !!(list && list.length)
    },
    onPeriodChange(key, t) {
      const card = this.cards[key]
      if (!card || card.period === t) return
      card.period = t
      const now = new Date()
      card.date = t === '日' ? formatDate(now)
        : t === '月' ? `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`
          : `${now.getFullYear()}`
      this.loadCard(key)
    },
    onCardDateChange(key) {
      this.loadCard(key)
    },
    // 周期内时间槽标签（单位与末位留空直接写进 categories）
    // APP 端 qiun-data-charts 通过 renderjs 跨视图层传 opts，函数无法序列化会丢失，
    // 因此不能依赖 xAxis.formatter 加单位/留空，必须在数据里生成。
    xLabelsOf(card) {
      const data = card.apiData || []
      let labels
      if (card.period === '日') {
        labels = Array.from({ length: 24 }, (_, i) => `${pad2(i)}时`)
      } else if (!data.length) {
        labels = card.period === '月'
          ? Array.from({ length: 31 }, (_, i) => `${i + 1}日`)
          : Array.from({ length: 12 }, (_, i) => `${i + 1}月`)
      } else if (card.period === '月') {
        labels = data.map(item => {
          const day = item.date ? parseInt(item.date.split('-')[2], 10) : (item.day || 0)
          return `${day}日`
        })
      } else {
        labels = data.map((item, i) => `${item.month || (i + 1)}月`)
      }
      // UCharts 强制画末位分类；末位不在等分点上时留空，避免末段刻度挤压
      const labelCount = 6
      const step = Math.ceil(labels.length / (labelCount - 1))
      if (labels.length > 1 && (labels.length - 1) % step !== 0) labels[labels.length - 1] = ''
      return labels
    },
    // 日周期按 0~23 时对齐，缺失小时补 0
    hourAlignedOf(card) {
      const data = card.apiData || []
      if (card.period !== '日') return data
      const hourMap = {}
      data.forEach(item => {
        const h = parseInt(item.hour, 10)
        if (h >= 0 && h < 24) hourMap[h] = item
      })
      return Array.from({ length: 24 }, (_, i) => hourMap[i] || {
        photovoltaicPower: 0, storageDischarge: 0, loadPower: 0, gridPowerSupply: 0
      })
    },
    // 本地供给汇总（光伏 / 储能放电 / 电网供电 / 负荷）
    sumSupplyOf(card) {
      let pv = 0
      let discharge = 0
      let grid = 0
      let load = 0
      ;(card.apiData || []).forEach(item => {
        pv += parseFloat(item.photovoltaicPower) || 0
        discharge += parseFloat(item.storageDischarge) || 0
        grid += parseFloat(item.gridPowerSupply) || 0
        load += parseFloat(item.loadPower) || 0
      })
      return { pv, discharge, grid, load, total: pv + discharge + grid }
    },
    avgPriceOf(card) {
      if (card.period !== '日') return 0.6
      const arr = card.price24H || []
      if (!arr.length) return 0.6
      return arr.reduce((a, b) => a + b, 0) / arr.length
    },

    loadAll() {
      ['kpi', 'supply', 'price', 'rate', 'bus'].forEach(key => this.loadCard(key))
    },

    // 每张卡片独立加载自己周期/日期的数据
    async loadCard(key) {
      if (!this.getEsId()) return
      const card = this.cards[key]
      const areaLevelIds = this.getAreaLevelIds()
      this.loadingCount++
      try {
        if (key === 'price' || key === 'kpi') {
          const [elecRes, priceRes, feeRes] = await Promise.all([
            this.fetchElectricityFor(card).catch(() => null),
            getPriceByAreaId(PRICE_AREA_ID).catch(() => null),
            this.fetchFeeFor(card, areaLevelIds).catch(() => null)
          ])
          card.apiData = (elecRes && elecRes.data) || []
          card.price24H = this.buildPrice24H(priceRes && priceRes.data)
          card.feeData = (feeRes && feeRes.data) || []
        } else if (key === 'bus') {
          const busRes = await this.fetchBusVoltageFor(card, areaLevelIds).catch(() => null)
          card.busVoltageData = (busRes && busRes.data) || []
        } else {
          const elecRes = await this.fetchElectricityFor(card).catch(() => null)
          card.apiData = (elecRes && elecRes.data) || []
        }
      } catch (e) {
        console.error('[性能分析] 获取数据失败:', e)
        card.apiData = []
        card.busVoltageData = []
        card.feeData = []
      } finally {
        this.loadingCount--
      }
    },

    fetchElectricityFor(card) {
      const esId = this.getEsId()
      const areaLevelIds = this.getAreaLevelIds()
      if (card.period === '日') {
        return queryDayElectricityStatistic({ esId, date: card.date, areaLevelIds })
      }
      const { year, month } = this.getYearMonth(card.date)
      if (card.period === '月') {
        const startDate = `${year}-${pad2(month)}-01`
        const endDate = `${year}-${pad2(month)}-${new Date(year, month, 0).getDate()}`
        return queryMonthElectricityStatistic({ esId, startDate, endDate, areaLevelIds })
      }
      return queryYearElectricityStatistic({ esId, year, areaLevelIds })
    },

    fetchBusVoltageFor(card, areaLevelIds) {
      if (!areaLevelIds) return Promise.resolve(null)
      if (card.period === '日') {
        return getPerHourBusVolte(areaLevelIds, card.date)
      }
      const { year, month } = this.getYearMonth(card.date)
      if (card.period === '月') {
        const startDate = `${year}-${pad2(month)}-01`
        // 接口 endDate 含头不含尾，取下月 1 号
        const next = new Date(year, month, 1)
        const endDate = `${next.getFullYear()}-${pad2(next.getMonth() + 1)}-${pad2(next.getDate())}`
        return getPerDayBusVolte(areaLevelIds, startDate, endDate)
      }
      return getPerMonthBusVolte(areaLevelIds, year)
    },

    fetchFeeFor(card, areaLevelIds) {
      if (!areaLevelIds) return Promise.resolve(null)
      if (card.period === '日') {
        return queryPerHourFee(areaLevelIds, card.date)
      }
      const { year, month } = this.getYearMonth(card.date)
      if (card.period === '月') {
        const startDate = `${year}-${pad2(month)}-01`
        const next = new Date(year, month, 1)
        const endDate = `${next.getFullYear()}-${pad2(next.getMonth() + 1)}-${pad2(next.getDate())}`
        return queryPerDayFee(areaLevelIds, startDate, endDate)
      }
      return queryPerMonthFee(areaLevelIds, year)
    },

    // 分时电价时间段 → 24 小时电价数组（仅取 price，不含服务费）
    buildPrice24H(timeRanges) {
      if (!Array.isArray(timeRanges) || timeRanges.length === 0) return FALLBACK_PRICE_24H.slice()
      const arr = new Array(24).fill(0)
      timeRanges.forEach(item => {
        const startHour = parseInt((item.startTime || '00:00:00').split(':')[0], 10)
        const endHour = parseInt((item.endTime || '23:59:59').split(':')[0], 10)
        const price = parseFloat(item.price) || 0
        for (let h = startHour; h <= endHour; h++) {
          if (h >= 0 && h < 24) arr[h] = price
        }
      })
      const filled = arr.filter(v => v > 0)
      const avg = filled.length > 0 ? filled.reduce((a, b) => a + b, 0) / filled.length : 0
      return arr.map(v => (v > 0 ? +v.toFixed(4) : avg))
    },

    // 电费接口数据对齐到固定槽位
    buildFeeFromApi(card, n) {
      const list = card.feeData
      if (!Array.isArray(list) || list.length === 0) return null
      let getSlotIndex
      if (card.period === '日') {
        getSlotIndex = item => {
          const h = parseInt(item.hour, 10)
          return Number.isFinite(h) ? h : -1
        }
      } else if (card.period === '月') {
        getSlotIndex = item => {
          if (!item.date) return -1
          const day = parseInt(item.date.split('-')[2], 10)
          return Number.isFinite(day) ? day - 1 : -1
        }
      } else {
        getSlotIndex = item => {
          const m = parseInt(item.month, 10)
          return Number.isFinite(m) ? m - 1 : -1
        }
      }
      const loadArr = new Array(n).fill(null)
      const saveArr = new Array(n).fill(null)
      list.forEach(item => {
        const idx = getSlotIndex(item)
        if (idx < 0 || idx >= n) return
        const l = parseFloat(item.loadFee)
        const s = parseFloat(item.saveFee)
        if (Number.isFinite(l)) loadArr[idx] = +l.toFixed(2)
        if (Number.isFinite(s)) saveArr[idx] = +s.toFixed(2)
      })
      if (loadArr.every(v => v === null) && saveArr.every(v => v === null)) return null
      return { loadFeeArr: loadArr, saveFeeArr: saveArr }
    },

    // 母线电压接口数据对齐到固定槽位，缺失为 null（图上断档）
    buildBusVoltageFromApi(card, n) {
      const list = card.busVoltageData
      if (!Array.isArray(list) || list.length === 0) return null
      let getSlotIndex
      if (card.period === '日') {
        getSlotIndex = item => {
          const h = parseInt(item.hour, 10)
          return Number.isFinite(h) ? h : -1
        }
      } else if (card.period === '月') {
        getSlotIndex = item => {
          if (!item.date) return -1
          const day = parseInt(item.date.split('-')[2], 10)
          return Number.isFinite(day) ? day - 1 : -1
        }
      } else {
        getSlotIndex = item => {
          if (!item.month) return -1
          const m = parseInt(String(item.month).split('-')[1], 10)
          return Number.isFinite(m) ? m - 1 : -1
        }
      }
      const result = new Array(n).fill(null)
      list.forEach(item => {
        const idx = getSlotIndex(item)
        if (idx < 0 || idx >= n) return
        const v = parseFloat(item.voltage)
        if (!Number.isFinite(v)) return
        result[idx] = result[idx] === null ? v : (result[idx] + v) / 2
      })
      if (result.every(v => v === null)) return null
      return result
    },

    sumFeeFromApi(card) {
      const list = card.feeData
      if (!Array.isArray(list) || list.length === 0) return null
      let sumLoad = 0
      let sumSave = 0
      let hasAny = false
      list.forEach(item => {
        const l = parseFloat(item.loadFee)
        const s = parseFloat(item.saveFee)
        if (Number.isFinite(l)) { sumLoad += l; hasAny = true }
        if (Number.isFinite(s)) { sumSave += s; hasAny = true }
      })
      return hasAny ? { loadFee: sumLoad, saveFee: sumSave } : null
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background: #f4f7fb;
  font-size: 28rpx;
  color: #1f2937;
}

/* 嵌入首页 Tab 时去掉整页高度与独立底色，避免撑出空白 */
.container.embedded {
  min-height: 0;
  background: transparent;
}

.fixed-placeholder {
  height: calc(25px + 20px + 44px);
  background: #fff;
}

.ios-platform {
  .fixed-placeholder {
    height: calc(44px);
  }
}

.content {
  padding: 16rpx;
}

/* ---------- 日期 ---------- */
.date-picker {
  margin-right: 8rpx;
}

/* ---------- 周期胶囊 ---------- */
.card-tools {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  width: 100%;
  min-height: 52rpx;
  margin-top: 12rpx;
  margin-bottom: 4rpx;
}

.period-switch {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  background: #f1f5fb;
  border: 1rpx solid #e6ecf5;
  border-radius: 999rpx;
  padding: 3rpx;
}

.period-tab {
  padding: 5rpx 14rpx;
  font-size: 22rpx;
  color: #8b95a5;
  border-radius: 999rpx;
  line-height: 1.5;

  &.active {
    background: #fff;
    color: #3f7bf5;
    font-weight: 600;
    box-shadow: 0 2rpx 6rpx rgba(15, 23, 42, 0.1);
  }
}

/* ---------- 费用 KPI ---------- */
.kpi-card {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  box-sizing: border-box;
  background: linear-gradient(120deg, #8fb4f8 0%, #5d8df1 46%, #487ce8 100%);
  border-radius: 20rpx;
  padding: 10rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 8rpx 20rpx rgba(75, 127, 232, 0.2);
}

/* KPI 卡片内的日期/周期工具行（蓝色底适配） */
.kpi-tools {
  margin-top: 10rpx;
  margin-bottom: 2rpx;
}

.kpi-tools .period-switch {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.35);
}

.kpi-tools .period-tab {
  color: rgba(255, 255, 255, 0.85);
}

.kpi-tools .period-tab.active {
  background: #fff;
  color: #3f7bf5;
  box-shadow: 0 2rpx 6rpx rgba(15, 23, 42, 0.15);
}

.kpi-main {
  flex: 0 0 42%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #dce9fd;
  border-radius: 16rpx;
  padding: 22rpx 20rpx;
}

.kpi-main-label {
  font-size: 22rpx;
  color: #5b6575;
}

.kpi-main-value {
  margin-top: 8rpx;
  font-size: 56rpx;
  font-weight: 700;
  color: #16233a;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.kpi-currency {
  font-size: 32rpx;
  font-weight: 600;
  margin-right: 2rpx;
}

.kpi-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 16rpx 0 20rpx;
}

.kpi-side-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  & + .kpi-side-row {
    margin-top: 18rpx;
  }
}

.kpi-side-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.9);
}

.kpi-side-value {
  font-size: 26rpx;
  font-weight: 600;
  color: #fff;
  font-variant-numeric: tabular-nums;
}

/* ---------- 图表卡片 ---------- */
.chart-card {
  position: relative;
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx 18rpx 12rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(15, 23, 42, 0.04);
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 10rpx;
}

.card-title {
  width: 100%;
  font-size: 28rpx;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.45;
  white-space: normal;
}

/* 标题行：标题文字 + info 按钮 */
.card-title-row {
  width: 100%;
  display: flex;
  align-items: center;
}
.kpi-title-row {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}
.kpi-title-row {
  justify-content: flex-start;
}

/* 标题行内的标题自适应宽度，给 info 按钮留位置 */
.card-title-row .card-title {
  width: auto;
  flex: 1;
  min-width: 0;
}

/* info 说明按钮 */
.info-tip-btn {
  width: 32rpx;
  height: 32rpx;
  flex: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4rpx;
}
.info-tip-icon {
  font-size: 20rpx;
  font-weight: 700;
  color: #6b7280;
  font-style: italic;
  line-height: 1;
}
.kpi-card .info-tip-btn {
  background: rgba(255, 255, 255, 0.35);
}
.kpi-card .info-tip-icon {
  color: #fff;
}

/* 弹层 */
.tooltip-mask {
  position: absolute;
  inset: 0;
  z-index: 5;
}
.tooltip-popover {
  position: absolute;
  left: 20rpx;
  right: 20rpx;
  top: 100rpx;
  z-index: 6;
  background: rgba(30, 41, 59, 0.94);
  color: #fff;
  border-radius: 16rpx;
  padding: 20rpx 22rpx;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.25);
  line-height: 1.6;
}
.kpi-card .tooltip-popover {
  top: 100rpx;
}
.chart-card .tooltip-popover {
  top: 90rpx;
}
.tooltip-title {
  font-size: 26rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
  color: #e0ecff;
}
.tooltip-line {
  font-size: 22rpx;
  color: #f8fafc;
  margin-bottom: 6rpx;
}
.tooltip-term {
  color: #8ab4ff;
  font-weight: 500;
}
.tooltip-note {
  font-size: 20rpx;
  color: #94a3b8;
  margin-top: 8rpx;
}


/* 蓝色指标条 */
.banner {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #5b90f8 0%, #3f7bef 100%);
  border-radius: 12rpx;
  padding: 12rpx 18rpx;
  margin-bottom: 4rpx;
}

.banner-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8rpx;

  &:first-child {
    padding-right: 22rpx;
  }

  &:last-child {
    padding-left: 22rpx;
  }
}

.banner-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.92);
}

.banner-value {
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.banner-unit {
  font-size: 18rpx;
  font-weight: 400;
  opacity: 0.9;
  margin-left: 3rpx;
}

.banner-divider {
  width: 1rpx;
  height: 42rpx;
  background: rgba(255, 255, 255, 0.35);
}

.chart-body {
  width: 100%;
}

.chart {
  width: 100%;
  height: 300rpx;
}

/* ---------- 本地供给环形图 ---------- */
.ring-stage {
  position: relative;
  height: 340rpx;
}

.ring-chart {
  width: 260rpx;
  height: 260rpx;
  margin: 30rpx auto 0;
}

.chart-ring {
  width: 100%;
  height: 260rpx;
}

.ring-tip {
  position: absolute;
  z-index: 2;
  width: 150rpx;
  box-sizing: border-box;
  background: #f5f7fb;
  border: 1rpx solid #e9eef7;
  border-radius: 10rpx;
  padding: 8rpx 10rpx;
}

.ring-line {
  position: absolute;
  z-index: 1;
  height: 2rpx;
  background: #cbd5e3;
  transform-origin: 0 50%;
}

.tip-slot-rt {
  right: 0;
  top: 24rpx;
}

.tip-slot-rb {
  right: 0;
  bottom: 16rpx;
}

.tip-slot-l {
  left: 0;
  top: 126rpx;
}

.tip-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tip-name {
  font-size: 18rpx;
  color: #6b7280;
}

.tip-pct {
  font-size: 18rpx;
  font-weight: 600;
}

.tip-pct-pv {
  color: #22b573;
}

.tip-pct-storage {
  color: #3d7bf5;
}

.tip-pct-grid {
  color: #8a94a3;
}

.tip-value {
  display: block;
  margin-top: 3rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.tip-unit {
  font-size: 16rpx;
  font-weight: 400;
  color: #8a94a3;
  margin-left: 3rpx;
}

.chart-tall {
  height: 300rpx;
}

.bottom-space {
  height: 20rpx;
}

/* ---------- 加载遮罩 ---------- */
.loading-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 40rpx;
  background: rgba(30, 41, 59, 0.86);
  border-radius: 16rpx;
}

.loading-spinner {
  width: 44rpx;
  height: 44rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #fff;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
