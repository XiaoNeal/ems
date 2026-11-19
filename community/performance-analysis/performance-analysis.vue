<template>
  <view class="container performance-analysis" :class="platformClass">
    <DyNavbar title="性能分析" :placeholder="true" />
    <view class="fixed-placeholder"></view>

    <view class="content">
      <!-- 费用 KPI -->
      <view class="kpi-card">
        <view class="kpi-main">
          <text class="kpi-main-label">综合节省费用</text>
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
      </view>

      <!-- 本地供给构成 -->
      <view class="chart-card">
        <view class="card-header">
          <text class="card-title">本地供给构成</text>
          <view class="card-tools">
            <dy-date :timeType="dateTypes.supply" v-model="cards.supply.date"
              @getData="onCardDateChange('supply')" class="date-picker" />
            <view class="period-switch">
              <view v-for="t in periodTabs" :key="t" class="period-tab"
                :class="{ active: cards.supply.period === t }" @click="onPeriodChange('supply', t)">{{ t }}</view>
            </view>
          </view>
        </view>
        <view class="banner">
          <view class="banner-item">
            <text class="banner-label">自平衡率</text>
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
          <view v-if="supplyPct.grid > 0" class="ring-line" :style="supplyLineStyles.grid"></view>
          <view v-if="supplyPct.pv > 0" class="ring-line" :style="supplyLineStyles.pv"></view>
          <view v-if="supplyPct.discharge > 0" class="ring-line" :style="supplyLineStyles.discharge"></view>
          <view class="ring-tip tip-grid">
            <view class="tip-top">
              <text class="tip-name">电网供电</text>
              <text class="tip-pct tip-pct-grid">{{ supplyPct.grid }}%</text>
            </view>
            <text class="tip-value">{{ supplyValueText.grid }}<text class="tip-unit">kWh</text></text>
          </view>
          <view class="ring-tip tip-pv">
            <view class="tip-top">
              <text class="tip-name">光伏发电</text>
              <text class="tip-pct tip-pct-pv">{{ supplyPct.pv }}%</text>
            </view>
            <text class="tip-value">{{ supplyValueText.pv }}<text class="tip-unit">kWh</text></text>
          </view>
          <view class="ring-tip tip-storage">
            <view class="tip-top">
              <text class="tip-name">储能放电</text>
              <text class="tip-pct tip-pct-storage">{{ supplyPct.discharge }}%</text>
            </view>
            <text class="tip-value">{{ supplyValueText.discharge }}<text class="tip-unit">kWh</text></text>
          </view>
        </view>
        <EmptyState v-else title="暂无数据" desc="当前时段暂无供给数据" @refresh="loadAll" />
      </view>

      <!-- 分时电价 · 理论负荷用电费 · 综合节省电费 -->
      <view class="chart-card">
        <view class="card-header">
          <text class="card-title">分时电价 · 理论负荷用电费 · 综合节省电费</text>
          <view class="card-tools">
            <dy-date :timeType="dateTypes.price" v-model="cards.price.date"
              @getData="onCardDateChange('price')" class="date-picker" />
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
      </view>

      <!-- 自给率趋势 -->
      <view class="chart-card">
        <view class="card-header">
          <text class="card-title">自给率趋势</text>
          <view class="card-tools">
            <dy-date :timeType="dateTypes.self" v-model="cards.self.date"
              @getData="onCardDateChange('self')" class="date-picker" />
            <view class="period-switch">
              <view v-for="t in periodTabs" :key="t" class="period-tab"
                :class="{ active: cards.self.period === t }" @click="onPeriodChange('self', t)">{{ t }}</view>
            </view>
          </view>
        </view>
        <view v-if="hasDataOf('self')" class="chart-body">
          <qiun-data-charts type="mix" :chartData="selfRateChartData" :opts="selfRateChartOptions"
            :canvas2d="canvas2d" :canvas-id="chartId + '-self'" :ontouch="true" class="chart chart-tall" />
        </view>
        <EmptyState v-else title="暂无数据" desc="当前时段暂无自给率数据" @refresh="loadAll" />
      </view>

      <!-- 自平衡率趋势 -->
      <view class="chart-card">
        <view class="card-header">
          <text class="card-title">自平衡率趋势</text>
          <view class="card-tools">
            <dy-date :timeType="dateTypes.balance" v-model="cards.balance.date"
              @getData="onCardDateChange('balance')" class="date-picker" />
            <view class="period-switch">
              <view v-for="t in periodTabs" :key="t" class="period-tab"
                :class="{ active: cards.balance.period === t }" @click="onPeriodChange('balance', t)">{{ t }}</view>
            </view>
          </view>
        </view>
        <view v-if="hasDataOf('balance')" class="chart-body">
          <qiun-data-charts type="mix" :chartData="balanceRateChartData" :opts="balanceRateChartOptions"
            :canvas2d="canvas2d" :canvas-id="chartId + '-balance'" :ontouch="true" class="chart chart-tall" />
        </view>
        <EmptyState v-else title="暂无数据" desc="当前时段暂无自平衡率数据" @refresh="loadAll" />
      </view>

      <!-- 母线电压 -->
      <view class="chart-card">
        <view class="card-header">
          <text class="card-title">母线电压（{{ busRatedVoltage }}V 额定 · 实时 · 偏差率）</text>
          <view class="card-tools">
            <dy-date :timeType="dateTypes.bus" v-model="cards.bus.date"
              @getData="onCardDateChange('bus')" class="date-picker" />
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
  data() {
    const today = formatDate(new Date())
    return {
      chartId: 'pa-' + Math.random().toString(36).slice(2, 9),
      canvas2d: this.$Config?.ISCANVAS2D ?? false,
      platformClass: '',
      periodTabs: ['日', '月', '年'],
      loadingCount: 0,
      busRatedVoltage: BUS_RATED_VOLTAGE,
      cards: {
        supply: createCardState(today),
        price: createCardState(today),
        self: createCardState(today),
        balance: createCardState(today),
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
    // KPI 跟随「分时电价」卡片的数据
    theoryCost() {
      const card = this.cards.price
      const fee = this.sumFeeFromApi(card)
      if (fee) return fee.loadFee.toFixed(2)
      return (this.sumSupplyOf(card).load * this.avgPriceOf(card)).toFixed(2)
    },
    savedCost() {
      const card = this.cards.price
      const fee = this.sumFeeFromApi(card)
      if (fee) return fee.saveFee.toFixed(2)
      const s = this.sumSupplyOf(card)
      return (s.load * this.avgPriceOf(card) - s.grid * this.avgPriceOf(card)).toFixed(2)
    },
    actualCost() {
      const card = this.cards.price
      const fee = this.sumFeeFromApi(card)
      if (fee) return Math.max(fee.loadFee - fee.saveFee, 0).toFixed(2)
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
    supplyLineStyles() {
      return {
        pv: this.supplyLineStyle('pv'),
        discharge: this.supplyLineStyle('discharge'),
        grid: this.supplyLineStyle('grid')
      }
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
        savedArr = feeFromApi.saveFeeArr.map(v => (v === null ? 0 : v))
      } else {
        theoryArr = data.map((item, i) => +((parseFloat(item.loadPower) || 0) * priceArr[i]).toFixed(2))
        savedArr = data.map((item, i) => {
          const load = parseFloat(item.loadPower) || 0
          const grid = parseFloat(item.gridPowerSupply) || 0
          return +Math.max((load - grid) * priceArr[i], 0).toFixed(2)
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
        xAxis: { labelCount: 6, disableGrid: true, fontSize: 9 },
        yAxis: { gridType: 'dash', dashLength: 3, showTitle: false, data: yAxisData },
        extra: { mix: { column: { width: 6 }, line: { type: 'curve', width: 2 } } }
      }
    },
    selfRateChartData() {
      return this.buildRateChartData(this.cards.self, '自给率', false)
    },
    balanceRateChartData() {
      return this.buildRateChartData(this.cards.balance, '自平衡率', true)
    },
    selfRateChartOptions() {
      return this.buildRateChartOptions('自给率')
    },
    balanceRateChartOptions() {
      return this.buildRateChartOptions('自平衡率')
    },
    busChartData() {
      const card = this.cards.bus
      const categories = this.xLabelsOf(card)
      const n = categories.length
      const rated = Array.from({ length: n }, () => BUS_RATED_VOLTAGE)
      const deviation = this.busVoltageArr.map(v => (v === null ? null : +(((v - BUS_RATED_VOLTAGE) / BUS_RATED_VOLTAGE) * 100).toFixed(2)))
      return {
        categories,
        series: [
          { name: '额定母线电压', type: 'line', index: 0, data: rated },
          { name: '实时母线电压', type: 'line', index: 0, data: this.busVoltageArr },
          { name: '偏差率', type: 'line', index: 1, data: deviation }
        ]
      }
    },
    busChartOptions() {
      return {
        color: ['#94a3b8', '#2563eb', '#f97316'],
        padding: [4, 10, 0, 4],
        dataLabel: false,
        dataPointShape: false,
        legend: { show: true, position: 'top', fontSize: 9, lineHeight: 16 },
        xAxis: { labelCount: 6, disableGrid: true, fontSize: 9 },
        yAxis: {
          gridType: 'dash',
          dashLength: 3,
          showTitle: false,
          data: [
            { position: 'left', title: '电压(V)', titleFontSize: 9, tofix: 1 },
            { position: 'right', title: '偏差率(%)', titleFontSize: 9, tofix: 1, formatter: val => `${val}%` }
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
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: res => {
        this.platformClass = res.platform === 'ios' ? 'ios-platform' : 'android-platform'
      }
    })
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
    // 环形图扇区 → 标签块的引导线（rpx 定位，扇区起始角为 3 点钟方向，顺时针）
    supplyLineStyle(key) {
      const pct = this.supplyPct
      const cum = { pv: 0, discharge: pct.pv, grid: pct.pv + pct.discharge }
      const theta = (2 * Math.PI * (cum[key] + pct[key] / 2)) / 100
      const cx = 333
      const cy = 160
      const r = 118
      const startX = cx + r * Math.cos(theta)
      const startY = cy + r * Math.sin(theta)
      const endMap = {
        pv: [516, 52],
        discharge: [516, 280],
        grid: [150, 158]
      }
      const end = endMap[key]
      const dx = end[0] - startX
      const dy = end[1] - startY
      const len = Math.sqrt(dx * dx + dy * dy)
      const deg = (Math.atan2(dy, dx) * 180) / Math.PI
      return `left:${startX.toFixed(1)}rpx;top:${(startY - 1).toFixed(1)}rpx;width:${len.toFixed(1)}rpx;transform:rotate(${deg.toFixed(2)}deg);`
    },
    // 供给率趋势：比率曲线 + 光伏/负荷柱状
    buildRateChartData(card, rateName, includeStorage) {
      const data = this.hourAlignedOf(card)
      const pvData = data.map(item => +(parseFloat(item.photovoltaicPower) || 0).toFixed(2))
      const loadData = data.map(item => +(parseFloat(item.loadPower) || 0).toFixed(2))
      const rateData = data.map(item => {
        const pv = parseFloat(item.photovoltaicPower) || 0
        const discharge = includeStorage ? (parseFloat(item.storageDischarge) || 0) : 0
        const load = parseFloat(item.loadPower) || 0
        if (load <= 0) return 0
        return +Math.min((pv + discharge) / load, 1).toFixed(2)
      })
      return {
        categories: this.xLabelsOf(card),
        series: [
          { name: rateName, type: 'line', index: 0, data: rateData },
          { name: '光伏发电量', type: 'column', index: 1, data: pvData },
          { name: '负荷用电量', type: 'column', index: 1, data: loadData }
        ]
      }
    },
    buildRateChartOptions(rateName) {
      return {
        color: ['#4f7cf6', '#34c38f', '#c9d6e8'],
        padding: [4, 10, 0, 4],
        dataLabel: false,
        legend: { show: true, position: 'top', fontSize: 9, lineHeight: 16 },
        xAxis: { labelCount: 6, disableGrid: true, fontSize: 9 },
        yAxis: {
          gridType: 'dash',
          dashLength: 3,
          showTitle: false,
          data: [
            { position: 'left', title: rateName, titleFontSize: 9, tofix: 1, min: 0 },
            { position: 'right', title: '电量(kWh)', titleFontSize: 9, tofix: 0 }
          ]
        },
        extra: { mix: { column: { width: 6 }, line: { type: 'curve', width: 2 } } }
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
    // 周期内时间槽标签
    xLabelsOf(card) {
      const data = card.apiData || []
      if (card.period === '日') return Array.from({ length: 24 }, (_, i) => pad2(i))
      if (!data.length) {
        return card.period === '月'
          ? Array.from({ length: 31 }, (_, i) => `${i + 1}日`)
          : Array.from({ length: 12 }, (_, i) => `${i + 1}月`)
      }
      if (card.period === '月') {
        return data.map(item => {
          const day = item.date ? parseInt(item.date.split('-')[2], 10) : (item.day || 0)
          return `${day}日`
        })
      }
      return data.map((item, i) => `${item.month || (i + 1)}月`)
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
      ['supply', 'price', 'self', 'balance', 'bus'].forEach(key => this.loadCard(key))
    },

    // 每张卡片独立加载自己周期/日期的数据
    async loadCard(key) {
      if (!this.getEsId()) return
      const card = this.cards[key]
      const areaLevelIds = this.getAreaLevelIds()
      this.loadingCount++
      try {
        if (key === 'price') {
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
        result[idx] = result[idx] === null ? +v.toFixed(1) : +((result[idx] + v) / 2).toFixed(1)
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
  flex-shrink: 0;
  margin-left: 8rpx;
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
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
  background: linear-gradient(120deg, #8fb4f8 0%, #5d8df1 46%, #487ce8 100%);
  border-radius: 20rpx;
  padding: 10rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 8rpx 20rpx rgba(75, 127, 232, 0.2);
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
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx 18rpx 12rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(15, 23, 42, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.card-title {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.tip-pv {
  right: 0;
  top: 24rpx;
}

.tip-storage {
  right: 0;
  bottom: 16rpx;
}

.tip-grid {
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

<!-- 卡片头部内嵌日期控件紧凑样式（仅作用于本页卡片头部） -->
<style lang="scss">
.performance-analysis .card-tools .date-picker {
  width: 170rpx;
  height: 52rpx;
  max-width: 170rpx;
  padding: 0 10rpx;
  border-color: #e6ecf5;
  border-radius: 10rpx;
}

.performance-analysis .card-tools .date-picker .calendar-icon {
  font-size: 20rpx;
  margin-right: 4rpx;
}

.performance-analysis .card-tools .date-picker .date-text {
  font-size: 20rpx;
  line-height: 52rpx;
}
</style>
