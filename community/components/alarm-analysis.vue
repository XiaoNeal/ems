<template>
  <view class="container">
    <!-- 日期选择区 -->
    <view class="chart-tab-bar">
      <view class="chart-tabs">
        <view v-for="(tab, i) in ['日', '月', '年']" :key="i"
          :class="['chart-tab-item', { active: activeChartTab === tab }]" @click="handleDateTypeChange(tab)">
          {{ tab }}
        </view>
      </view>

      <!-- 日期选择器 -->
      <dy-date v-show="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate"
        class="date-picker" />
      <dy-date v-show="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker" v-model="selectedDate"
        class="date-picker" />
      <dy-date v-show="timeTypeIndex === 2" timeType="year" @getData="handleDatePicker" v-model="selectedDate"
        class="date-picker" />
    </view>

    <!-- 报警统计区域 -->
    <view class="alarm-statistics-col">
      <view class="header">
        <text class="title">报警统计</text>
      </view>

      <!-- 统计卡片 -->
      <view class="stats-card">
        <!-- 环形图表 -->
        <qiun-data-charts type="ring" :style="{ width: '55%', maxWidth: '220px', height: '140px' }" :opts="opts"
          :chartData="alarmLevelData" canvas-id="alarmLevelChart" :ontouch="true" @touch="handleChartTouch"
          :canvas2d="canvas2d" />

        <view class="status-group">
          <view class="stat-item">
            <text class="stat-value success">{{ alarmTimes.ended }}</text>
            <text class="stat-label">已处理</text>
          </view>
          <view class="stat-item">
            <text class="stat-value warning">{{ alarmTimes.proceed }}</text>
            <text class="stat-label">进行中</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 报警列表区域 -->
    <view class="alarm-table">
      <view class="card-title">
        <view class="btn-group">
          <view class="btn" :class="{ 'activated': tableType === 0 }" @click="ontableTypeChange(0)">
            全部（{{ alarmTimes.total }}）
          </view>
          <view class="btn" :class="{ 'activated': tableType === 1 }" @click="ontableTypeChange(1)">
            进行中（{{ alarmTimes.proceed }}）
          </view>
          <view class="btn" :class="{ 'activated': tableType === 2 }" @click="ontableTypeChange(2)">
            已结束（{{ alarmTimes.ended }}）
          </view>
        </view>
      </view>

      <!-- 列表容器 -->
      <uni-scroll-view class="card-content" scroll-y @refresherrefresh="onRefresh" refresher-enabled
        refresher-threshold="80" :refresher-loading="refresherLoading">

        <!-- 加载状态 -->
        <view v-if="listLoading && apiDataShow.length === 0" class="loading-container">
          <uni-loading-icon size="24" color="#4488FB"></uni-loading-icon>
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 空状态 -->
        <view v-if="!listLoading && apiDataShow.length === 0" class="empty-container">
          <uni-icons type="empty" size="60" color="#ccc"></uni-icons>
          <text class="empty-text">暂无报警数据</text>
        </view>

        <!-- 报警列表 - 使用原生view提升性能 -->
        <transition-group name="list-enter">
          <view 
            v-for="(item, index) in apiDataShow" 
            :key="item.id || index" 
            class="alarm-card"
            hover-class="card-hover"
            v-memo="[item.id, tableType, item.status]"
          >
            <view class="card-content">
              <view class="card-row primary">
                <view class="device-status" v-if="columns[0].slot === 'deviceStatus'">
                  <view class="status-dot"
                    :class="{ 'bg-gray': item.deviceStatus == 0, 'bg-green': item.deviceStatus == 1 }"></view>
                  <text :class="{ 'text-gray': item.deviceStatus == 0, 'text-green': item.deviceStatus == 1 }">
                    {{ item.deviceStatus == 0 ? '离线' : '在线' }}
                  </text>
                </view>
                <view class="alarm-level" v-if="columns[2].slot === 'alarmLevel'">
                  <uni-icons type="alert" :color="alarmLevelMap(item.alarmLevel).color" size="18" />
                  <text>{{ alarmLevelMap(item.alarmLevel).text }}</text>
                </view>
                <view class="device-name">{{ item.deviceName }}</view>
              </view>

              <view class="card-row secondary">
                <text class="label">{{ columns[3].title }}：</text>
                <text class="value">{{ item.area || '--' }}</text>
              </view>

              <view class="card-row secondary">
                <text class="label">{{ columns[5].title }}：</text>
                <text class="value">{{ item.startTime || '--' }}</text>
              </view>

              <view class="card-row secondary" v-if="item.endTime && item.endTime !== '--'">
                <text class="label">{{ columns[6].title }}：</text>
                <text class="value">{{ item.endTime }}</text>
              </view>

              <view class="card-row message">
                <text class="label">{{ columns[7].title }}：</text>
                <text class="value">{{ item.alarmMsg || '--' }}</text>
              </view>
            </view>
          </view>
        </transition-group>

        <!-- 加载更多状态优化 -->
        <view 
          v-if="!isLoadingMore && apiDataShow.length < filteredTotalCount && filteredTotalCount > 0" 
          @click="loadMore" 
          class="load-more-container"
        >
          <text class="load-more-text">点击加载更多</text>
        </view>
        <view v-if="isLoadingMore" class="load-more-container">
          <uni-loading-icon size="20" color="#4488FB"></uni-loading-icon>
          <text class="load-more-text">加载中...</text>
        </view>

        <!-- 已显示全部数据 -->
        <view 
          v-if="!listLoading && !isLoadingMore && apiDataShow.length >= filteredTotalCount && filteredTotalCount > 0" 
          class="no-more"
        >
          <text>已显示全部数据</text>
        </view>
      </uni-scroll-view>
    </view>
  </view>
</template>

<script>
import nyz from '@/api/nyz'
import dyDate from '@/components/dy-Date/dy-Date.vue';
import { debounce } from '@/utils/tools';

export default {
  components: { dyDate },
  data() {
    return {
      canvas2d: this.$Config.ISCANVAS2D,
      activeChartTab: '日',
      alarmTimes: { total: 0, ended: 0, proceed: 0 },
      timeTypeIndex: 0,
      selectedDate: new Date().toISOString().split('T')[0],
      selectDateType: 'date',
      tableType: 0,
      columns: [
        { title: "设备状态", slot: "deviceStatus", align: "center" },
        { title: "设备名称", key: "deviceName", align: "center" },
        { title: "报警等级", slot: "alarmLevel", align: "center" },
        { title: "所属区域", key: "area", align: "center" },
        { title: "类型", key: "deviceType", align: "center" },
        { title: "报警时间", key: "startTime", align: "center" },
        { title: "结束时间", key: "endTime", align: "center" },
        { title: "报警信息", key: "alarmMsg", align: "center" },
      ],
      apiData: [],
      apiDataShow: [],
      pageNumber: 1,
      pageSize: 6,
      totalCount: 0,
      filteredTotalCount: 0, // 过滤后的总数据量
      listLoading: false,
      refresherLoading: false,
      isLoadingMore: false, // 加载更多状态锁
      opts: {
        rotate: false,
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666"],
        padding: [5, 5, 5, 5],
        dataLabel: false,
        legend: { show: true, position: "right", fontSize: 12 },
        title: { name: "", fontSize: 15 },
        subtitle: { name: "报警", fontSize: 10, color: "#ccc" },
        extra: {
          ring: { ringWidth: 10, border: true, borderColor: "#FFFFFF" }
        }
      },
      alarmLevelData: {},
      timeDimensionData: {}
    };
  },

  mounted() {
    this.getNyzAlarmData();
  },

  methods: {
    handleDateTypeChange: debounce(function (tab) {
      this.activeChartTab = tab;
      const indexMap = { '日': 0, '月': 1, '年': 2 };
      this.timeTypeIndex = indexMap[tab];
      const now = new Date();
      this.selectedDate = this.timeTypeIndex === 0
        ? `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
        : this.timeTypeIndex === 1
          ? `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
          : `${now.getFullYear()}`;
      this.selectDateType = ['date', 'month', 'year'][this.timeTypeIndex];
      this.pageNumber = 1;
      this.apiData = [];
      this.getNyzAlarmData();
    }, 300),

    handleDatePicker(value) {
      this.selectedDate = value;
      this.pageNumber = 1;
      this.apiData = [];
      this.getNyzAlarmData();
    },

    onRefresh() {
      this.refresherLoading = true;
      this.pageNumber = 1;
      this.apiData = [];
      this.getNyzAlarmData().finally(() => {
        this.refresherLoading = false;
      });
    },

    // 修复加载更多逻辑
    loadMore() {
      // 防止重复触发加载
      if (this.isLoadingMore) return;
      
      // 使用过滤后的总数据量判断
      if (this.apiDataShow.length >= this.filteredTotalCount) {
        return;
      }
      
      this.isLoadingMore = true;
      this.pageNumber++;
      this.filterListData().finally(() => {
        this.isLoadingMore = false;
      });
    },

    getNyzAlarmData() {
      if (this.listLoading || this.apiData.length > 0) return;
      this.listLoading = true;
      const areaLevelId = 1;
      nyz.findAlarmRecord(this.selectDateType, this.selectedDate, areaLevelId)
        .then(result => {
          if (result.data && Array.isArray(result.data)) {
            // 直接处理数据，避免额外复制
            result.data.forEach((item, index) => {
              result.data[index] = this.formatAlarmItem(item);
            });
            
            this.totalCount = result.data.length;
            this.apiData = result.data;

            this.alarmTimes.total = this.totalCount;
            this.alarmTimes.proceed = this.apiData.filter(item => item.status === 1).length;
            this.alarmTimes.ended = this.apiData.filter(item => item.status === 0).length;
            this.opts.title.name = this.totalCount;
            this.updateChartData(result.data);

            this.pageNumber = 1; // 重置页码
            this.filterListData();
          }
        })
        .catch(err => {
          console.error('获取报警数据失败:', err);
          uni.showToast({ title: '加载失败', icon: 'none' });
        })
        .finally(() => {
          this.listLoading = false; // 正确重置加载状态
        });
    },

    ontableTypeChange(type) {
      this.tableType = type;
      this.pageNumber = 1; // 切换类型时重置页码
      this.filterListData();
    },

    // 优化过滤逻辑，使用Promise减少阻塞
    filterListData() {
      return new Promise(resolve => {
        // 缓存过滤后的数据，避免重复计算
        let filteredData = this.apiData.filter(item => {
          if (this.tableType === 1) return item.status === 1;
          if (this.tableType === 2) return item.status === 0;
          return true;
        });
        
        // 更新过滤后的总数据量
        this.filteredTotalCount = filteredData.length;
        
        // 计算需要显示的数据范围
        const endIndex = Math.min(this.pageNumber * this.pageSize, this.filteredTotalCount);
        this.apiDataShow = filteredData.slice(0, endIndex);
        resolve();
      });
    },

    // 优化数据格式化方法
    formatAlarmItem(item) {
      // 预计算报警级别，减少字符串操作
      let alarmLevel = 1; // 默认次要
      if (item.deviceName.includes("轻微")) {
        alarmLevel = 0;
      } else if (item.deviceName.includes("严重")) {
        alarmLevel = 2;
      }
      
      return {
        id: item.id || item.createTime,
        alarmLevel,
        alarmMsg: item.deviceName,
        area: "能源站",
        deviceName: "能源站",
        deviceStatus: 1,
        deviceType: this.getDeviceType(item),
        endTime: item.recoverTime || '--',
        startTime: item.createTime,
        status: item.status || 0,
      };
    },

    getDeviceType(item) {
      const type1 = ["1704_V1_2", "1707_V3_3", "0318_V1_1"];
      if (type1.includes(item.deviceType)) return item.deviceName;
      if (item.deviceType === "170C_1_1") return "DCDC告警";
      return "--";
    },

    updateChartData(originalData) {
      const levelCount = [0, 0, 0, 0];
      originalData.forEach(item => {
        const level = this.formatAlarmItem(item).alarmLevel;
        if (level >= 0 && level <= 3) {
          levelCount[level]++;
        }
      });
      this.alarmLevelData = {
        series: [{
          data: [
            { name: '提示', value: levelCount[0] },
            { name: '次要', value: levelCount[1] },
            { name: '重要', value: levelCount[2] },
            { name: '紧急', value: levelCount[3] }
          ]
        }]
      };
      this.timeDimensionData = this.getDimensionData(originalData);
    },

    getDimensionData(originalData) {
      if (this.selectDateType === 'date') {
        const alarmCount = Array(24).fill(0);
        originalData.forEach(item => {
          const hour = new Date(item.createTime).getHours();
          alarmCount[hour]++;
        });
        return {
          categories: Array.from({ length: 24 }, (_, i) => `${i}时`),
          series: [{ name: '报警次数', data: alarmCount }]
        };
      } else if (this.selectDateType === 'month') {
        const days = new Date(
          new Date(this.selectedDate).getFullYear(),
          new Date(this.selectedDate).getMonth() + 1,
          0
        ).getDate();
        const alarmCount = Array(days).fill(0);
        originalData.forEach(item => {
          const day = new Date(item.createTime).getDate() - 1;
          alarmCount[day]++;
        });
        return {
          categories: Array.from({ length: days }, (_, i) => `${i + 1}日`),
          series: [{ name: '报警次数', data: alarmCount }]
        };
      } else {
        const alarmCount = Array(12).fill(0);
        originalData.forEach(item => {
          const month = new Date(item.createTime).getMonth();
          alarmCount[month]++;
        });
        return {
          categories: Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
          series: [{ name: '报警次数', data: alarmCount }]
        };
      }
    },

    handleChartTouch(e) {
      const { dataIndex } = e.detail;
      const item = this.alarmLevelData.series[0].data[dataIndex];
      if (item) {
        uni.showToast({
          title: `${item.name}: ${item.value}次`,
          icon: 'none',
          duration: 2000
        });
      }
    },

    alarmLevelMap(level) {
      const map = [
        { color: 'rgb(75,173,31)', text: '提示' },
        { color: 'rgb(71,137,251)', text: '次要' },
        { color: 'rgb(255,118,44)', text: '重要' },
        { color: 'rgb(203,33,54)', text: '紧急' }
      ];
      return map[level] || map[0];
    }
  }
};
</script>

<style lang="scss" scoped>
// 主题变量
$primary: #4488FB;
$success: #00B42A;
$danger: #F53F3F;
$text: #1D2129;
$text-light: #86909C;
$bg: #FFFFFF;
$card-bg: #FFFFFF;
$border: #E5E6EB;
$transition: all 0.2s ease;

// 基础样式
.container {
  min-height: 100vh;
  background-color: $bg;
  padding: 10rpx;
}

// 日期选择区优化
.chart-tab-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  background: $card-bg;
  border-radius: 10rpx;
  padding: 8rpx 10rpx;
  box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.04);

  .chart-tabs {
    display: flex;
    flex: 1;
  }

  .chart-tab-item {
    flex: 1;
    text-align: center;
    padding: 12rpx 0;
    margin: 0 5rpx;
    border-radius: 6rpx;
    font-size: 26rpx;
    font-weight: 500;
    transition: $transition;
    color: $primary;
    border: 1px solid $primary;

    &.active {
      background-color: $primary;
      color: white;
    }

    &:active:not(.active) {
      background-color: rgba(68, 136, 251, 0.08);
    }
  }

  .date-picker {
    width: 180rpx;
    margin-left: 8rpx;
    min-width:fit-content;
    border:unset
  }
}

// 报警统计区域
.alarm-statistics-col {
  margin-bottom: 16rpx;

  .header {
    padding: 0 8rpx 12rpx;

    .title {
      font-size: 28rpx;
      color: $text;
      font-weight: 500;
    }
  }

  .stats-card {
    display: flex;
    align-items: center;
    background: $card-bg;
    border-radius: 10rpx;
    padding: 16rpx;
    box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.04);

    .status-group {
      display: flex;
      flex-direction: column;
      gap: 16rpx;
      margin-left: 10rpx;
      flex: 1;
      justify-content: center;
      align-items: center;
    }

    .stat-item {
      text-align: center;

      .stat-value {
        font-size: 34rpx;
        font-weight: bold;
        line-height: 1.1;

        &.success {
          color: $success;
        }

        &.warning {
          color: $danger;
        }
      }

      .stat-label {
        font-size: 24rpx;
        color: $text-light;
        margin-top: 4rpx;
      }
    }
  }
}

// 报警列表区域
.alarm-table {
  background: $card-bg;
  border-radius: 10rpx;
  box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.04);

  .card-title {
    padding: 0 16rpx;
    height: 70rpx;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $border;

    .btn-group {
      display: flex;
      width: 100%;
      height: 48rpx;
      border-radius: 6rpx;
      overflow: hidden;
      border: 1px solid $primary;

      .btn {
        flex: 1;
        text-align: center;
        line-height: 48rpx;
        font-size: 24rpx;
        background: white;
        color: $primary;
        transition: $transition;

        &.activated {
          background: $primary;
          color: white;
        }
      }
    }
  }

  .card-content {
    min-height: 200rpx;
    max-height: 700rpx;
    padding: 12rpx;
  }
}

// 列表项优化 - 更紧凑的布局，使用原生view
.alarm-card {
  margin-bottom: 12rpx;
  border-radius: 8rpx;
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.03);
  background-color: $card-bg;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }

  &.card-hover {
    background-color: #f7f7f7;
  }

  .card-content {
    padding: 14rpx 16rpx;
  }

  .card-row {
    display: flex;
    align-items: center;
    padding: 6rpx 0;

    &.primary {
      justify-content: space-between;
      padding-bottom: 10rpx;
      border-bottom: 1px dashed $border;
    }

    &.secondary {
      font-size: 24rpx;
      color: $text;
    }

    &.message {
      font-size: 24rpx;
      padding-top: 8rpx;
    }

    .label {
      color: $text-light;
      min-width: 110rpx;
    }

    .value {
      flex: 1;
      word-break: break-word;
      line-height: 1.4;
    }

    .device-status,
    .alarm-level {
      display: flex;
      align-items: center;
      font-size: 24rpx;
    }

    .device-name {
      font-size: 26rpx;
      font-weight: 500;
      color: $text;
    }

    .status-dot {
      width: 14rpx;
      height: 14rpx;
      border-radius: 50%;
      margin-right: 6rpx;
    }

    .bg-gray {
      background: #ccc;
    }

    .bg-green {
      background: $success;
    }

    .text-gray {
      color: #999;
    }

    .text-green {
      color: $success;
    }
  }
}

// 加载和空状态
.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;

  .loading-text,
  .empty-text {
    font-size: 24rpx;
    color: $text-light;
    margin-top: 16rpx;
  }
}

.load-more-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;
  font-size: 22rpx;
  color: $text-light;
}

.no-more {
  text-align: center;
  padding: 30rpx 0;
  font-size: 22rpx;
  color: $text-light;
}

// 简化动画效果，提升性能
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-enter-enter {
  animation: fadeIn 0.2s ease-out;
}

// 响应式优化
@media (max-width: 350px) {
  .chart-tab-item {
    font-size: 24rpx !important;
  }

  .stats-card {
    flex-direction: column;

    .status-group {
      margin-left: 0;
      margin-top: 15rpx;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
    }
  }

  .card-row.primary {
    flex-wrap: wrap;
    gap: 10rpx 0;

    .device-name {
      width: 100%;
      padding-top: 8rpx;
    }
  }
}
</style>