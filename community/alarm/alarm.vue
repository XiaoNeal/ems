<template>
  <view class="container">
    <u-navbar title="报警" :autoBack="true" :placeholder="true">
    </u-navbar>

    <!-- 报警等级统计 -->
    <view class="alarm-stats-card">
      <view class="card-title">报警等级统计</view>
      <view class="stats-content">

        <view class="chart-box">
          <qiun-data-charts 
            type="ring"
            :opts="ringOpts"
            :chartData="alarmLevelData"
            canvas-id="ringChart"
            :canvas2d="canvas2d"
            :ontouch="true"
            @touch="handleChartTouch"
          />
        </view>

        <view class="info-group">
          <view class="level-list">
            <view class="level-item">
              <view class="dot urgent"></view>
              <view class="num">{{ alarmLevelCount.urgent }}</view>
              <view class="label">紧急</view>
            </view>
            <view class="level-item">
              <view class="dot important"></view>
              <view class="num">{{ alarmLevelCount.important }}</view>
              <view class="label">重要</view>
            </view>
          </view>

          <view class="level-list">
            <view class="level-item">
              <view class="dot minor"></view>
              <view class="num">{{ alarmLevelCount.minor }}</view>
              <view class="label">次要</view>
            </view>
            <view class="level-item">
              <view class="dot prompt"></view>
              <view class="num">{{ alarmLevelCount.prompt }}</view>
              <view class="label">提示</view>
            </view>
          </view>

          <view class="status-box">
            <view class="status-item">
              <view class="num">{{ alarmTimes.ended }}</view>
              <view class="label">已结束</view>
            </view>
            <view class="status-item proceed">
              <view class="num">{{ alarmTimes.proceed }}</view>
              <view class="label">发生中</view>
            </view>
          </view>
        </view>

      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-wrap">
      <view class="search-input">
        <uni-icons type="search" size="16" color="#999"></uni-icons>
        <input 
          v-model="searchKeyword" 
          @input="handleSearch"
          placeholder="请输入告警名称"
        />
        <uni-icons 
          v-if="searchKeyword" 
          type="clear" 
          size="16" 
          color="#999" 
          @click="clearSearch"
        ></uni-icons>
      </view>
      <view class="filter-btn" :class="{ active: hasActiveFilter }" @click="handleFilter">
        <uni-icons type="filter" size="20" :color="hasActiveFilter ? '#4488FB' : '#999'"></uni-icons>
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
            <view 
              class="level-option" 
              :class="{ active: filterLevel === -1 }"
              @click="filterLevel = -1"
            >全部</view>
            <view 
              class="level-option urgent" 
              :class="{ active: filterLevel === 0 }"
              @click="filterLevel = 0"
            >紧急</view>
            <view 
              class="level-option important" 
              :class="{ active: filterLevel === 1 }"
              @click="filterLevel = 1"
            >重要</view>
            <view 
              class="level-option minor" 
              :class="{ active: filterLevel === 2 }"
              @click="filterLevel = 2"
            >次要</view>
            <view 
              class="level-option prompt" 
              :class="{ active: filterLevel === 3 }"
              @click="filterLevel = 3"
            >提示</view>
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
      <view 
        class="tab-btn" 
        :class="{ active: tableType === 0 }"
        @click="ontableTypeChange(0)"
      >
        全部（{{ alarmTimes.total }}）
      </view>
      <view 
        class="tab-btn" 
        :class="{ active: tableType === 1 }"
        @click="ontableTypeChange(1)"
      >
        进行中（{{ alarmTimes.proceed }}）
      </view>
      <view 
        class="tab-btn" 
        :class="{ active: tableType === 2 }"
        @click="ontableTypeChange(2)"
      >
        已结束（{{ alarmTimes.ended }}）
      </view>
    </view>

    <!-- 列表 -->
    <uni-scroll-view 
      class="list-container" 
      scroll-y
      refresher-enabled
      :refresher-loading="refresherLoading"
      @refresherrefresh="onRefresh"
    >
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

      <view 
        v-for="item in apiDataShow" 
        :key="item.id"
        class="alarm-item"
        hover-class="hover"
      >
        <view class="level-icon" :class="'level-' + item.alarmLevel">
          <uni-icons type="info" size="20" color="#fff"></uni-icons>
        </view>

        <view class="alarm-info">
          <view class="title">{{ item.alarmMsg }}</view>
          <view class="row">
            <text class="label">设备状态：</text>
            <text class="value">{{ item.deviceStatus === 1 ? '在线' : '离线' }}</text>
          </view>
          <view class="row">
            <text class="label">设备名称：</text>
            <text class="value">{{ item.deviceName }}</text>
          </view>
          <view class="row">
            <text class="label">报警位置：</text>
            <text class="value">{{ item.area }}</text>
          </view>
          <view class="row">
            <text class="label">报警时间：</text>
            <text class="value">{{ item.startTime }}</text>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="isLoadingMore" class="load-more">
        <uni-loading-icon size="18" color="#4488FB"></uni-loading-icon>
        <text>加载中...</text>
      </view>
      <view 
        v-else-if="apiDataShow.length < filteredTotalCount && filteredTotalCount > 0"
        class="load-more"
        @click="loadMore"
      >
        点击加载更多
      </view>
      <view v-if="apiDataShow.length && apiDataShow.length >= filteredTotalCount" class="no-more">
        已显示全部
      </view>

    </uni-scroll-view>
  </view>
</template>

<script>
import { debounce } from '@/utils/tools'
import { findDayAlarmRecord } from '@/api/alarm.js'

export default {
  data() {
    return {
      canvas2d: this.$Config?.ISCANVAS2D ?? false,
      tableType: 0,
      searchKeyword: '',
      showFilter: false,
      filterLevel: -1,
      filterStartTime: '',
      filterEndTime: '',

      alarmTimes: { total: 0, ended: 0, proceed: 0 },
      alarmLevelCount: { urgent: 0, important: 0, minor: 0, prompt: 0 },

      ringOpts: {
        rotate: false,
        color: ['#EB3341', '#FF7A2E', '#4D7BF1', '#3CCF6E'],
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
      isLoadingMore: false
    }
  },
  mounted() {

    
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
        console.log(this.$Config, "-------111-----------------",this.listLoading)
        const res = await findDayAlarmRecord({
          day: '2026-05-13',
          areaLevelId: '883',
          esId: '2'
        })
        console.log(res, "------------------------")
        const list = (res.data || []).map(it => this.formatAlarmItem(it))
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
        data = data.filter(it => (it.alarmMsg || '').toLowerCase().includes(kw))
      }
      this.filteredTotalCount = data.length
      const end = this.pageNumber * this.pageSize
      this.apiDataShow = data.slice(0, end)
    },

    formatAlarmItem(item) {
      let level = 1
      const name = (item.deviceName || '').toLowerCase()
      if (name.includes('紧急') || name.includes('严重')) level = 0
      else if (name.includes('重要')) level = 1
      else if (name.includes('次要')) level = 2
      else if (name.includes('提示') || name.includes('轻微')) level = 3

      return {
        id: item.id || Date.now() + Math.random(),
        alarmLevel: level,
        alarmMsg: item.deviceName || '告警信息',
        area: item.area || '能源站',
        deviceName: '能源站设备',
        deviceStatus: 1,
        startTime: item.createTime || '-',
        endTime: item.recoverTime || '-',
        status: item.status ?? 0
      }
    },

    updateChart(list) {
      const count = [0, 0, 0, 0]
      list.forEach(it => {
        const l = it.alarmLevel
        if (l >= 0 && l <= 3) count[l]++
      })
      this.alarmLevelCount = {
        urgent: count[0],
        important: count[1],
        minor: count[2],
        prompt: count[3]
      }
      this.alarmLevelData = {
        series: [{
          data: [
            { name: '紧急', value: count[0] },
            { name: '重要', value: count[1] },
            { name: '次要', value: count[2] },
            { name: '提示', value: count[3] }
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
  padding: 20rpx;
  background: #f6f7fb;
  min-height: 100vh;
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
    gap: 20rpx;
    margin-left: 20rpx;
  }
  .level-list {
    display: flex;
    justify-content: space-around;
  }
  .level-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    .dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      &.urgent { background: #EB3341; }
      &.important { background: #FF7A2E; }
      &.minor { background: #4D7BF1; }
      &.prompt { background: #3CCF6E; }
    }
    .num {
      font-size: 32rpx;
      font-weight: bold;
      color: #222;
    }
    .label {
      font-size: 24rpx;
      color: #666;
    }
  }
  .status-box {
    display: flex;
    justify-content: space-around;
    margin-top: 10rpx;
  }
  .status-item {
    text-align: center;
    .num {
      font-size: 36rpx;
      font-weight: bold;
      color: #222;
    }
    .label {
      font-size: 24rpx;
      color: #666;
    }
    &.proceed .num {
      color: #EB3341;
    }
  }
}

/* 搜索 */
.search-wrap {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
  padding: 0 20rpx;
  
  .search-input {
    flex: 1;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 40rpx;
    padding: 20rpx 28rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
    border: 1rpx solid #f0f0f0;
    
    input {
      margin-left: 12rpx;
      font-size: 28rpx;
      flex: 1;
    }
  }
  
  .filter-btn {
    width: 76rpx;
    height: 76rpx;
    background: #fff;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
    border: 1rpx solid #f0f0f0;
    transition: all 0.3s ease;
    
    &.active {
      background: #f0f5ff;
      border-color: #4488FB;
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
  padding: 20rpx;
  max-height: 800rpx;
}
.alarm-item {
  display: flex;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
  &.hover {
    background: #f8f9fa;
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
  &.level-0 { background: #EB3341; }
  &.level-1 { background: #FF7A2E; }
  &.level-2 { background: #4D7BF1; }
  &.level-3 { background: #3CCF6E; }
}
.alarm-info {
  flex: 1;
  .title {
    font-size: 30rpx;
    font-weight: 500;
    color: #222;
    margin-bottom: 12rpx;
  }
  .row {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 6rpx;
    .label {
      color: #999;
    }
  }
}

.loading, .empty, .load-more, .no-more {
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
  
  &.urgent.active { background: #EB3341; }
  &.important.active { background: #FF7A2E; }
  &.minor.active { background: #4D7BF1; }
  &.prompt.active { background: #3CCF6E; }
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