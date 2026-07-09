<template>
  <view class="container" :class="platformClass">
    <DyNavbar title="报警" :placeholder="true" />
    <view class="fixed-placeholder"></view>

    <view class="content-wrap">
      <!-- 报警等级统计 -->
      <view class="alarm-stats-card">
        <view class="card-title">报警等级统计</view>
        <view class="stats-content">

          <view class="stats-top-row">
            <view class="chart-box">
              <qiun-data-charts type="ring" :opts="ringOpts" :chartData="alarmLevelData" canvas-id="ringChart"
                :canvas2d="canvas2d" :ontouch="true" @touch="handleChartTouch" />
            </view>

            <view class="info-group">
              <view class="level-row">
                <view class="level-card urgent">
                  <view class="dot"></view>
                  <text class="label">紧急</text>
                  <text class="num">{{ alarmLevelCount.urgent }}</text>
                </view>
                <view class="level-card important">
                  <view class="dot"></view>
                  <text class="label">重要</text>
                  <text class="num">{{ alarmLevelCount.important }}</text>
                </view>
              </view>
              <view class="level-row">
                <view class="level-card prompt">
                  <view class="dot"></view>
                  <text class="label">提示</text>
                  <text class="num">{{ alarmLevelCount.prompt }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="stats-divider"></view>

          <view class="status-row">
            <text class="status-text">发生中 {{ alarmTimes.proceed }}</text>
            <text class="status-divider">·</text>
            <text class="status-text">已结束 {{ alarmTimes.ended }}</text>
          </view>

        </view>
      </view>

      <!-- 日期选择栏 -->
      <view class="date-picker-wrap">
        <picker mode="date" :value="selectedDate" @change="onDateChange">
          <view class="date-picker">
            <text>{{ selectedDate || '请选择日期' }}</text>
            <uni-icons type="arrowdown" size="18" color="#999"></uni-icons>
          </view>
        </picker>
        <view class="quick-dates">
          <view v-for="item in quickDateOptions" :key="item.value" class="quick-date-btn"
            :class="{ active: quickDate === item.value }" @click="selectQuickDate(item.value)">
            {{ item.label }}
          </view>
        </view>
      </view>

      <!-- 搜索栏 -->
      <view class="search-wrap">
        <view class="search-input">
          <text class="search-icon">🔍</text>
          <input v-model="searchKeyword" @input="handleSearch" placeholder="请输入告警名称" />
          <text v-if="searchKeyword" class="clear-icon" @click="clearSearch">✕</text>
        </view>
        <view class="filter-btn" :class="{ active: hasActiveFilter }" @click="handleFilter">
          <text class="filter-icon">☰</text>
        </view>
      </view>

      <!-- 筛选弹窗 -->
      <u-popup v-model="showFilter" mode="bottom" :border-radius="20" :closeable="true">
        <view class="filter-popup">
          <view class="popup-header">
            <text class="popup-title">筛选条件</text>
            <text class="popup-reset" @click="resetFilter">重置</text>
          </view>

          <view class="filter-section">
            <view class="section-title">报警等级</view>
            <view class="level-options">
              <view class="level-option" :class="{ active: filterLevel === -1 }" @click="filterLevel = -1">全部</view>
              <view class="level-option urgent" :class="{ active: filterLevel === 0 }" @click="filterLevel = 0">紧急
              </view>
              <view class="level-option important" :class="{ active: filterLevel === 1 }" @click="filterLevel = 1">重要
              </view>
              <view class="level-option minor" :class="{ active: filterLevel === 2 }" @click="filterLevel = 2">次要</view>
              <view class="level-option prompt" :class="{ active: filterLevel === 3 }" @click="filterLevel = 3">提示
              </view>
            </view>
          </view>

          <view class="filter-section">
            <view class="section-title">时间范围</view>
            <view class="time-range">
              <picker mode="date" @change="onStartTimeChange" :value="filterStartTime">
                <view class="time-picker">
                  <text>{{ filterStartTime || '开始时间' }}</text>
                  <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
                </view>
              </picker>
              <text class="time-separator">至</text>
              <picker mode="date" @change="onEndTimeChange" :value="filterEndTime">
                <view class="time-picker">
                  <text>{{ filterEndTime || '结束时间' }}</text>
                  <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
                </view>
              </picker>
            </view>
          </view>

          <view class="popup-footer">
            <view class="popup-btn cancel" @click="showFilter = false">取消</view>
            <view class="popup-btn confirm" @click="applyFilter">确定</view>
          </view>
        </view>
      </u-popup>

      <!-- 列表切换 -->
      <view class="table-tab">
        <view class="tab-btn" :class="{ active: tableType === 1 }" @click="ontableTypeChange(1)">
          进行中（{{ alarmTimes.proceed }}）
        </view>
        <view class="tab-btn" :class="{ active: tableType === 2 }" @click="ontableTypeChange(2)">
          已结束（{{ alarmTimes.ended }}）
        </view>
         <view class="tab-btn" :class="{ active: tableType === 0 }" @click="ontableTypeChange(0)">
          全部（{{ alarmTimes.total }}）
        </view>
      </view>

      <!-- 列表 -->
      <uni-scroll-view class="list-container" scroll-y refresher-enabled :refresher-loading="refresherLoading"
        @refresherrefresh="onRefresh">
        <!-- 加载中 -->
        <view v-if="listLoading && apiDataShow.length === 0" class="loading">
          <uni-loading-icon color="#4488FB"></uni-loading-icon>
          <text>加载中...</text>
        </view>

        <!-- 空状态 -->
        <view v-if="!listLoading && apiDataShow.length === 0" class="empty">
          <uni-icons type="empty" size="60" color="#ddd"></uni-icons>
          <text>暂无报警数据</text>
        </view>

        <view v-for="item in apiDataShow" :key="item.id" class="alarm-item" hover-class="hover">
          <view class="level-icon" :class="'level-' + item.alarmLevel">
            <uni-icons type="info" size="20" color="#fff"></uni-icons>
          </view>

          <view class="alarm-info" :class="'level-' + item.alarmLevel">
            <view class="title">
              <text class="level-tag" :class="'level-' + item.alarmLevel">{{ item.alarmLevel === 0 ? '紧急' :
                item.alarmLevel === 1 ? '重要' : '提示' }}</text>
              <text class="type-name">{{ item.typeName }}</text>
              {{ item.alarmName }}
            </view>
            <view class="time-row">
              <text class="time-item">{{ item.alarmTime }}</text>
              <text v-if="item.recoverTime" class="time-item">恢复：{{ item.recoverTime }}</text>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="isLoadingMore" class="load-more">
          <uni-loading-icon size="18" color="#4488FB"></uni-loading-icon>
          <text>加载中...</text>
        </view>
        <view v-else-if="apiDataShow.length < filteredTotalCount && filteredTotalCount > 0" class="load-more"
          @click="loadMore">
          点击加载更多
        </view>
        <view v-if="apiDataShow.length && apiDataShow.length >= filteredTotalCount" class="no-more">
          已显示全部
        </view>

      </uni-scroll-view>
    </view>
  </view>
</template>

<script>
import { debounce } from '@/utils/tools'
import { findDayAlarmRecord, getAlarmRecord } from '@/api/alarm.js'
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'

export default {
  components: {
    DyNavbar
  },
  data() {
    return {
      platformClass: "",
      canvas2d: this.$Config?.ISCANVAS2D ?? false,
      tableType: 1,
      searchKeyword: '',
      showFilter: false,
      filterLevel: -1,
      filterStartTime: '',
      filterEndTime: '',

      alarmTimes: { total: 0, ended: 0, proceed: 0 },
      alarmLevelCount: { urgent: 0, important: 0, minor: 0, prompt: 0 },

      ringOpts: {
        rotate: false,
        color: ['#EB3341', '#FF7A2E', '#4D7BF1'],
        padding: [0, 0, 0, 0],
        dataLabel: false,
        legend: { show: false },
        title: { name: '', fontSize: 28, color: '#111' },
        subtitle: { name: '报警', fontSize: 12, color: '#999' },
        extra: { ring: { ringWidth: 10, borderColor: '#fff' } }
      },

      alarmLevelData: {},
      apiData: [],
      apiDataShow: [],
      pageNumber: 1,
      pageSize: 6,
      totalCount: 0,
      filteredTotalCount: 0,
      listLoading: false,
      refresherLoading: false,
      isLoadingMore: false,

      selectedDate: '',
      quickDate: 'today',
      quickDateOptions: [
        { label: '今天', value: 'today' },
        { label: '昨天', value: 'yesterday' }
      ]
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === "ios" ? "ios-platform" : "android-platform";
      },
    });
  },
  mounted() {
    const today = new Date()
    this.selectedDate = this.formatDate(today)
    this.getNyzAlarmData()
  },
  methods: {
    onRefresh() {
      this.refresherLoading = true
      this.pageNumber = 1
      this.apiData = []
      this.getNyzAlarmData().finally(() => {
        this.refresherLoading = false
      })
    },

    loadMore() {
      if (this.isLoadingMore) return
      if (this.apiDataShow.length >= this.filteredTotalCount) return
      this.isLoadingMore = true
      this.pageNumber++
      this.filterListData().finally(() => {
        this.isLoadingMore = false
      })
    },

    async getNyzAlarmData() {
      if (this.listLoading) return
      this.listLoading = true
      try {
        console.log(this.$Config, "-------111-----------------", this.listLoading)
        const currentDevice = this.$store.state.currentSelectDevice || {}
        const date = this.selectedDate || this.formatDate(new Date())
        const res = await getAlarmRecord({
          date: date,
          areaLevelIds: currentDevice.areaLevelId
        })

        // 告警列表
        let alarmList = res.data || []
        // 按告警时间倒序，最新时间放最前面
        alarmList = alarmList.sort((a, b) => {
          // 方案A：时间戳字段
          // return b.alarmTime - a.alarmTime
          // 方案B：日期字符串（'2026-07-08 12:30:00'）
          return new Date(b.alarmTime) - new Date(a.alarmTime)
        })
        console.log('告警接口返回数据:', alarmList)
        const list = (alarmList || []).map(it => this.formatAlarmItem(it))
        this.apiData = list
        this.totalCount = list.length
        this.alarmTimes.total = list.length
        this.alarmTimes.proceed = list.filter(i => i.status === 1).length
        this.alarmTimes.ended = list.filter(i => i.status === 0).length
        this.ringOpts.title.name = this.totalCount
        this.updateChart(list)
        this.pageNumber = 1
        await this.filterListData()
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.listLoading = false
      }
    },

    ontableTypeChange(t) {
      this.tableType = t
      this.pageNumber = 1
      this.filterListData()
    },

    async filterListData() {
      let data = this.apiData.filter(item => {
        if (this.tableType === 1) return item.status === 1
        if (this.tableType === 2) return item.status === 0
        return true
      })

      if (this.filterLevel !== -1) {
        data = data.filter(it => it.alarmLevel === this.filterLevel)
      }

      if (this.filterStartTime) {
        data = data.filter(it => {
          const itemDate = new Date(it.startTime).getTime()
          const startDate = new Date(this.filterStartTime).getTime()
          return itemDate >= startDate
        })
      }

      if (this.filterEndTime) {
        data = data.filter(it => {
          const itemDate = new Date(it.startTime).getTime()
          const endDate = new Date(this.filterEndTime + ' 23:59:59').getTime()
          return itemDate <= endDate
        })
      }

      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase()
        data = data.filter(it => (it.typeName || '').toLowerCase().includes(kw))
      }
      this.filteredTotalCount = data.length
      const end = this.pageNumber * this.pageSize
      this.apiDataShow = data.slice(0, end)
    },

    formatAlarmItem(item) {
      const alarmLevel = (item.alarmLevel || '').toLowerCase()
      let level = 1
      if (alarmLevel.includes('紧急') || alarmLevel.includes('严重')) level = 0
      else if (alarmLevel.includes('重要')) level = 1
      else if (alarmLevel.includes('提示') || alarmLevel.includes('轻微')) level = 2

      return {
        id: item.deviceId || Date.now() + Math.random(),
        alarmLevel: level,
        typeName: item.typeName,
        alarmName: item.alarmName || '-',
        deviceName: item.typeName,
        startTime: item.alarmTime || '-',
        alarmTime: item.alarmTime || '-',
        endTime: item.recoverTime || '-',
        recoverTime: item.recoverTime || '-',
        status: item.recoverTime ? 0 : 1
      }
    },

    updateChart(list) {
      const count = [0, 0, 0]
      list.forEach(it => {
        const l = it.alarmLevel
        if (l >= 0 && l <= 2) count[l]++
      })
      this.alarmLevelCount = {
        urgent: count[0],
        important: count[1],
        prompt: count[2]
      }
      this.alarmLevelData = {
        series: [{
          data: [
            { name: '紧急', value: count[0] },
            { name: '重要', value: count[1] },
            { name: '提示', value: count[2] }
          ]
        }]
      }
    },

    handleChartTouch(e) {
      const idx = e.detail.dataIndex
      const item = this.alarmLevelData.series[0].data[idx]
      if (item) uni.showToast({ title: `${item.name}：${item.value}`, icon: 'none' })
    },

    handleSearch() {
      this.pageNumber = 1
      this.filterListData()
    },

    clearSearch() {
      this.searchKeyword = ''
      this.pageNumber = 1
      this.filterListData()
    },

    handleFilter() {
      this.showFilter = true
    },

    resetFilter() {
      this.filterLevel = -1
      this.filterStartTime = ''
      this.filterEndTime = ''
    },

    applyFilter() {
      this.pageNumber = 1
      this.showFilter = false
      this.filterListData()
    },

    onStartTimeChange(e) {
      this.filterStartTime = e.detail.value
    },

    onEndTimeChange(e) {
      this.filterEndTime = e.detail.value
    },

    onDateChange(e) {
      this.selectedDate = e.detail.value
      this.quickDate = ''
      this.onRefresh()
    },

    selectQuickDate(value) {
      this.quickDate = value
      const today = new Date()
      if (value === 'today') {
        this.selectedDate = this.formatDate(today)
      } else if (value === 'yesterday') {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        this.selectedDate = this.formatDate(yesterday)
      }
      this.onRefresh()
    },

    formatDate(date) {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    }
  },
  computed: {
    hasActiveFilter() {
      return this.filterLevel !== -1 || this.filterStartTime || this.filterEndTime
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  // padding: 20rpx;
  background: #f6f7fb;
  min-height: 100vh;

  &.android-platform {
    .fixed-placeholder {
      height: calc(25px + 44px + 20px);
    }
  }

  &.ios-platform {
    .fixed-placeholder {
      height: calc(44px);
      background: #fff;
    }
  }
}

.content-wrap {
  margin: 20rpx;
}

/* 统计卡片 */
.alarm-stats-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;

  .card-title {
    font-size: 32rpx;
    font-weight: 500;
    text-align: center;
    margin-bottom: 30rpx;
    color: #222;
  }

  .stats-content {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  .stats-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .chart-box {
    width: 200rpx;
    height: 200rpx;
  }

  .info-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    margin-left: 20rpx;
  }

  .level-row {
    display: flex;
    gap: 16rpx;
  }

  .level-card {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 16rpx 20rpx;
    border-radius: 16rpx;

    .dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .label {
      font-size: 26rpx;
      color: #333;
      flex-shrink: 0;
    }

    .num {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-left: auto;
    }

    &.urgent {
      background: #FFF2F0;

      .dot {
        background: #EB3341;
      }
    }

    &.important {
      background: #FFF7E8;

      .dot {
        background: #FF7A2E;
      }
    }

    &.prompt {
      background: #EEF4FF;

      .dot {
        background: #4D7BF1;
      }
    }
  }

  .stats-divider {
    height: 1rpx;
    background: rgba(0, 0, 0, 0.06);
    margin: 0 -20rpx;
  }

  .status-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    padding-top: 8rpx;

    .status-text {
      font-size: 26rpx;
      color: #666;
    }

    .status-divider {
      font-size: 24rpx;
      color: #999;
    }

    &.proceed .num {
      color: #EB3341;
    }
  }
}

/* 日期选择栏 */
.date-picker-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 20rpx;
}

.date-picker {
  display: flex;
  align-items: center;
  gap: 12rpx;

  text {
    font-size: 28rpx;
    color: #333;
  }
}

.quick-dates {
  display: flex;
  gap: 16rpx;
}

.quick-date-btn {
  padding: 12rpx 24rpx;
  font-size: 24rpx;
  color: #666;
  background: #f5f7fa;
  border-radius: 40rpx;

  &.active {
    background: #4488FB;
    color: #fff;
  }
}

/* 搜索 */
.search-wrap {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

  .search-input {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f5f7fa;
    border-radius: 40rpx;
    padding: 24rpx 30rpx;
    min-height: 80rpx;

    .search-icon {
      font-size: 28rpx;
      color: #999;
    }

    input {
      margin-left: 16rpx;
      font-size: 28rpx;
      flex: 1;
      background: transparent;
      min-height: 40rpx;
    }

    .clear-icon {
      font-size: 24rpx;
      color: #999;
      padding: 8rpx;
      margin-left: 8rpx;
    }
  }

  .filter-btn {
    width: 80rpx;
    height: 80rpx;
    background: #f5f7fa;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    .filter-icon {
      font-size: 28rpx;
      color: #999;
    }

    &.active {
      background: #e8f0fe;

      .filter-icon {
        color: #4488FB;
      }
    }
  }
}

/* 列表tab */
.table-tab {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;

  .tab-btn {
    flex: 1;
    text-align: center;
    padding: 20rpx 0;
    font-size: 26rpx;
    color: #666;

    &.active {
      background: #4488FB;
      color: #fff;
      border-radius: 16rpx;
    }
  }
}

/* 列表 */
.list-container {
  background: #fff;
  border-radius: 20rpx;
  max-height: 800rpx;
}

.alarm-item {
  display: flex;
  padding: 24rpx;
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  &.hover {
    background: #fafafa;
  }
}

.level-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;

  &.level-0 {
    background: #EB3341;
  }

  &.level-1 {
    background: #FF7A2E;
  }

  &.level-2 {
    background: #4D7BF1;
  }
}

.alarm-info {
  flex: 1;

  .title {
    font-size: 30rpx;
    font-weight: 500;
    color: #222;
    margin-bottom: 12rpx;
    display: flex;
    align-items: center;
    gap: 12rpx;

    .level-tag {
      font-size: 20rpx;
      padding: 2rpx 10rpx;
      border-radius: 8rpx;
      color: #fff;
      flex-shrink: 0;

      &.level-0 {
        background: #EB3341;
      }

      &.level-1 {
        background: #FF7A2E;
      }

      &.level-2 {
        background: #4D7BF1;
      }
    }

    .type-name {
      flex-shrink: 0;
      font-weight: bold;
    }
  }

  &.level-0 {
    .type-name {
      color: #EB3341;
    }
  }

  &.level-1 {
    .type-name {
      color: #FF7A2E;
    }
  }

  &.level-2 {
    .type-name {
      color: #4D7BF1;
    }
  }

  .time-row {
    font-size: 24rpx;
    color: #999;
    display: flex;
    gap: 20rpx;

    .time-item {
      &:first-child {
        color: #666;
      }
    }
  }
}

.loading,
.empty,
.load-more,
.no-more {
  text-align: center;
  padding: 30rpx 0;
  color: #999;
  font-size: 24rpx;
}

/* 筛选弹窗 */
.filter-popup {
  padding: 30rpx;
  background: #fff;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #222;
}

.popup-reset {
  font-size: 28rpx;
  color: #4488FB;
}

.filter-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.level-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.level-option {
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  background: #f5f5f5;
  font-size: 28rpx;
  color: #666;

  &.active {
    background: #4488FB;
    color: #fff;
  }

  &.urgent.active {
    background: #EB3341;
  }

  &.important.active {
    background: #FF7A2E;
  }

  &.minor.active {
    background: #4D7BF1;
  }

  &.prompt.active {
    background: #4D7BF1;
  }
}

.time-range {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.time-picker {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 12rpx;

  text {
    font-size: 28rpx;
    color: #666;
  }
}

.time-separator {
  font-size: 24rpx;
  color: #999;
}

.popup-footer {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.popup-btn {
  flex: 1;
  padding: 28rpx;
  text-align: center;
  border-radius: 12rpx;
  font-size: 30rpx;

  &.cancel {
    background: #f5f5f5;
    color: #666;
  }

  &.confirm {
    background: #4488FB;
    color: #fff;
  }
}
</style>