<template>
  <view class="container">

    <uni-segmented-control :current="currentTab" :values="['系统报表', '报警记录']" @clickItem="switchTab" style-type="button"
      active-color="#1890FF" />

    <!-- 报表查询模块 -->
    <view v-if="currentTab === 0" class="content-box">
      <view class="toolbar">
        <uni-datetime-picker type="date" v-model="dateValue" @change="(e) => loadReportData(e)" :popup-options="{
          zIndex: 1002,
          position: 'top'
        }" class="datetime-picker-fix" /> 
      </view>

      <scroll-view class="table-container" scroll-x="true">
        <view class="data-table">
          <view class="table-header fixed-header">
            <view class="header-row">
              <text class="col-date">日期</text>
              <view class="col vertical-layout">
                <text>供电量</text>
                <text class="unit">(kWh)</text>
              </view><view class="col vertical-layout">
                <text>发电量</text>
                <text class="unit">(kWh)</text>
              </view><view class="col vertical-layout">
                <text>消耗量</text>
                <text class="unit">(kWh)</text>
              </view><view class="col vertical-layout">
                <text>馈电量</text>
                <text class="unit">(kWh)</text>
              </view>
              <view class="col vertical-layout">
                <text>反向供电</text>
                <text class="unit">(kWh)</text>
              </view>
            </view>
          </view>
          <view class="table-body" v-if="reportData.length">
            <view class="table-row" v-for="(item, index) in reportData" :key="index">
              <view class="data-row">
                <text class="col-date">{{ item.date }}</text>
                <text class="col">{{ item.supply }}</text>
                <text class="col">{{ item.generating }}</text>
                <text class="col">{{ item.consume }}</text>
                <text class="col">{{ item.feed }}</text>
                <text class="col">{{ item.reverseSupply }}</text>
              </view>
            </view>
          </view>
          <view v-else class="no-data">
            <uni-icons type="info" size="40" color="#999" />
            <text>暂无数据</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 报警查询模块 -->
    <view v-else class="content-box">
      <view class="filter-bar">
        <uni-datetime-picker type="daterange" v-model="alarmDateRange" @change="loadAlarmData"
          class="full-width-picker" />
        <picker class="status-filter" @change="statusFilterChange" :value="statusIndex" :range="statusOptions">
          <view class="filter-item">
            {{ statusOptions[statusIndex] || '选择状态' }}
            <uni-icons type="arrowdown" size="16" color="#666" />
          </view>
        </picker>
      </view>

      <view class="alarm-list">
        <view class="alarm-item" v-for="(item, index) in alarmList" :key="index">
          <view class="alarm-header">
            <uni-icons :type="item.level === 1 ? 'notification-filled' : 'notification'"
              :color="item.level === 1 ? '#FF4D4F' : '#FAAD14'" size="20" />
            <text class="device-name">{{ item.device }}</text>
            <text class="alarm-status" :style="{ color: item.status === '未处理' ? '#FF4D4F' : '#52C41A' }">
              {{ item.status }}
            </text>
          </view>
          <view class="alarm-info">
            <text class="alarm-time">{{ item.time }}</text>
            <text class="alarm-desc">{{ item.description }}</text>
          </view>
          <view class="alarm-details">
            <text class="detail-item">发生时间：{{ item.occurTime }}</text>
            <text class="detail-item" v-if="item.recoverTime">恢复时间：{{ item.recoverTime }}</text>
            <!-- <text class="detail-item">报警参数：{{ JSON.stringify(item.alarmValue) || '无' }}</text> -->
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      statusOptions: Object.freeze(['已处理', '未处理']), // 移除"全部"选项
      statusIndex: 0,
      alarmList: [],
      reportData: [],
      currentTab: 0,
      dateValue:  new Date().toISOString().split('T')[0], // 单个日期
      alarmDateRange: [
        new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().slice(0, 10).replace(/-/g, '-'), // 当前日期-7天
        new Date().toISOString().split('T')[0]
      ]
    }
  },
  mounted() {
    this.loadReportData(this.dateValue);
  },
  methods: {
  
    switchTab(e) {
      this.currentTab = e.currentIndex
      // 根据当前标签动态加载数据
      if (this.currentTab === 0) {
        this.loadReportData(this.dateValue)
      } else {
        this.loadAlarmData()
      }
    },
    // getToday() {
    //   const d = new Date();
    //   // 修正时区偏移问题
    //   return d.toLocaleDateString('zh-CN', { 
    //     year: 'numeric', 
    //     month: '2-digit', 
    //     day: '2-digit' 
    //   }).replace(/\//g, '-');
    // },
    loadReportData(newDate) {
      // 恢复使用中间变量保证值一致性
      const selectedDate = newDate || this.dateValue;
      console.log('当前日期参数:', selectedDate)

      request.get(`/api/energyStation/queryEnergyStationDayReport?esId=${this.$store.state.powerStationsId}&date=${selectedDate}`).then((res) => {
        console.log(res)
        let reportData = res.data.map(item => ({
            date: item.time?.slice(11, 16) || '00:00', // 从第11位开始取5个字符（HH:mm格式）
            supply: item.supplyCount?.toFixed(2) || '0.00',
            generating: item.generatingCount?.toFixed(2) || '0.00',
            consume: item.consumeCount?.toFixed(2) || '0.00',
            feed: item.feedCount?.toFixed(2) || '0.00',
            reverseSupply: item.supplyCountReverse?.toFixed(2) || '0.00'
          }));
          this.reportData = reportData
          console.log('图表数据:', this.reportData, this.reportData.length)
      })

      // request({
      //   ,
      //   success: (res) => {
      //     console.log(res)
      //     console.log('响应数据:', res.data, '请求日期:', selectedDate)

         
      //   },
      //   fail: (err) => {
      //     uni.showToast({
      //       title: '数据加载失败',
      //       icon: 'none'
      //     });
      //   },
      //   complete: () => {
      //     uni.hideLoading();
      //   }
      // });
    },
    loadAlarmData() {
      const statusMap = {
        0: 0,    // 已处理对应值0
        1: 1     // 未处理对应值1
      };
      
      // 确保日期格式正确
      const [startDate, endDate] = this.alarmDateRange.map(date => {
        return date.includes(':') ? date : `${date} 00:00:00`
      });
      console.log('响应数据:', '请求日期:', [startDate, endDate])

      request.get(`/api/energyStation/details/list/${this.$store.state.powerStationsId}/${startDate}/${endDate}/${statusMap[this.statusIndex]}`).then((res) => {
        console.log('报警数据:', res)
            this.alarmList = res.map(item => ({
              device: item.deviceName,
              time: item.occurTime.split(' ')[1].substr(0, 5),  // 使用发生时间
              status: item.status === 0 ? '未处理' : '已处理',  // 修正状态显示
              level: item.alarmLevel,
              description: item.attributeNameCn,  // 使用中文报警名称
              additionalContent: item.errorInfo,  // 新增错误信息字段
              alarmValue: item.alarmValue ? JSON.parse(item.alarmValue) : {},  // 添加空对象兜底
              occurTime: item.occurTime,
              recoverTime: item.recoverTime,
              alarmLevelValue: item.alarmLevelValue
            }));
      })
   
    },
    statusFilterChange(e) {
      const rawValue = e.detail.value;
      // 双重验证机制
      this.statusIndex = Math.max(0, Math.min(Number(rawValue), 2));
      
      // 调试日志增强
      console.log('[状态筛选] 原始值:', rawValue, 
                 '处理后:', this.statusIndex, 
                 '有效值:', this.statusOptions[this.statusIndex]);
      
      this.loadAlarmData();
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
}

.content-box {
  background: #fff;
  border-radius: 12rpx;
  margin: 20rpx;
  padding: 20rpx;
}

.toolbar,
.filter-bar {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

::v-deep .uni-datetime-picker {
  &--daterange {
    flex: 1;
    margin-left: 20rpx;
  }
  
  .uni-datetime-picker-input {
    padding: 24rpx 30rpx;
    border-radius: 12rpx;
    border: 1rpx solid #eee;
    font-size: 28rpx;
    color: #333;
    background: #fff;
    
    &--active {
      border-color: #1890FF;
      box-shadow: 0 0 0 2rpx rgba(24, 144, 255, 0.2);
    }
  }
}

.datetime-picker-fix {
  ::v-deep .uni-datetime-picker-popup {
    z-index: 1002;
    max-height: 70vh;
    border-radius: 24rpx 24rpx 0 0;
    box-shadow: 0 -10rpx 30rpx rgba(0, 0, 0, 0.1);
    
    &__header {
      padding: 30rpx;
      border-bottom: 1rpx solid #f0f0f0;
    }
    
    &__btn {
      font-size: 30rpx;
      color: #1890FF;
      padding: 30rpx 0;
    }
  }
}

.full-width-picker {
  flex: 1;
  margin-right: 20rpx;
}

.chart-container {
  height: 400rpx;
}

.table-container {
  margin-top: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  height: calc(100vh - 400rpx); // 添加高度限制
}

.table-container {
  height: 100%; // 确保高度继承
  overflow: visible; // 修改overflow属性
}

.data-table {
  min-width: 1200rpx;
  border: 2rpx solid #eee; // 添加表格整体边框
}

.table-header {
  padding: 20rpx 0;
  background: #f8faff;

  .header-row {
    display: flex;
    justify-content: space-between;
  }
}

.data-row {
  display: flex;
  justify-content: space-between;
}

.col-date,
.col {
  flex: 0 0 14%;
  width: 14%;
  text-align: center;
  padding: 20rpx 10rpx;
  font-size: 24rpx; // 从28rpx调整为24rpx
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4; // 新增行高优化
}

.table-header {

  .col-date,
  .col {
    font-weight: 500;
    color: #333;
    font-size: 22rpx; // 表头字体从25rpx调整为22rpx
    background: linear-gradient(180deg, #e6f7ff 0%, #f0faff 100%);
    border-radius: 8rpx;
    margin: 0 5rpx;
    padding: 18rpx 10rpx; // 减小内边距
  }
}

.table-row {
  padding: 28rpx 0;
  border-bottom: 1rpx solid #eee;
  transition: all 0.2s ease;
  
  &:nth-child(even) {
    background-color: #f8fafb;
  }
  
  &:hover {
    background-color: #f3f9ff;
    transform: translateX(10rpx);
  }
}

.col {
  font-size: 26rpx;
  color: #333;
  padding: 20rpx 10rpx;
  
  &:first-child {
    color: #1890ff;
    font-weight: 500;
  }
}

.no-data {
  padding: 80rpx 0;
  background: #fafafa;
  border-radius: 16rpx;
  
  uni-icons {
    margin-bottom: 30rpx;
    animation: pulse 1.5s infinite;
  }
  
  text {
    font-size: 30rpx;
    color: #666;
    letter-spacing: 2rpx;
    font-weight: 300;
  }
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20rpx) rotate(-2deg);
  }
  to { 
    opacity: 0.8; 
    transform: translateY(0) rotate(0);
  }
}
.col-date,
.col {
  flex: 0 0 180rpx; // 强制固定宽度
  width: 180rpx; // 兼容写法
  min-width: 180rpx; // 最小宽度约束
  max-width: 180rpx; // 最大宽度约束
  text-align: center;
  padding: 0 12rpx;
  border-right: 1rpx solid #eee;
  box-sizing: border-box; // 包含边框和内边距

  &:last-child {
    border-right: none;
  }
}

.table-header {

  .col-date,
  .col {
    flex: 0 0 180rpx; // 强制固定宽度
    width: 180rpx; // 兼容写法
    min-width: 180rpx; // 最小宽度约束
    max-width: 180rpx; 
  }
}


.datetime-picker-fix {
  ::v-deep .uni-datetime-picker-popup {
    bottom: 120rpx !important; // 从底部定位
    top: auto !important;
    max-height: 70vh;
    box-shadow: 0 -10rpx 30rpx rgba(0, 0, 0, 0.1);

    .uni-datetime-picker-btn {
      position: sticky;
      bottom: 0;
      background: #fff;
      padding: 30rpx 0;
      z-index: 9999;
      box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
    }
  }
}

::v-deep .uni-calendar--fixed {
  bottom: 80rpx !important;
}


.col-date {
  font-size: 28rpx;
  color: #666;
  padding: 0 16rpx;
}

.col-date {
  color: #1890FF;
  font-weight: 500;
}

.table-header .col-date,
.table-header .col {
  font-weight: bold;
  color: #333;
  font-size: 25rpx;
}

.table-header text {
  font-weight: bold;
  color: #333;
  flex: 1;
  text-align: center;
}

.table-row text {
  flex: 1;
  text-align: center;
  color: #666;
}

.alarm-item {
  padding: 30rpx;
  margin-bottom: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

.alarm-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.device-name {
  flex: 1;
  margin-left: 20rpx;
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.alarm-status {
  font-size: 26rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  background-color: rgba(255, 77, 79, 0.1);
}

.alarm-info {
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.alarm-time {
  font-size: 26rpx;
  color: #999;
  margin-right: 30rpx;
}

.alarm-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.alarm-details {
  .detail-item {
    font-size: 26rpx;
    color: #888;
    line-height: 1.8;
    
    & + .detail-item {
      margin-top: 12rpx;
    }
  }
}
.status-filter {
  background: #fff;
  border-radius: 8rpx;
  padding: 0 20rpx;
  border: 1rpx solid #eee;
  min-height: 80rpx;
  font-size: 28rpx;
  color: #333;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
  opacity: 0.8;
  animation: fadeIn 0.6s ease;

  uni-icons {
    margin-bottom: 20rpx;
  }

  text {
    font-size: 28rpx;
    color: #909399;
    letter-spacing: 2rpx;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 0.8; transform: translateY(0); }
}

.col.vertical-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.unit {
  font-size: 24rpx;
  color: #666;
}
</style>

