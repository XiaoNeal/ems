<template>
  <view class="container">
    <custom-nav-bar title="充电记录"></custom-nav-bar>
    <view class="content">
      <!-- 记录列表 -->
      <view class="record-list">
        <view class="record-item" v-for="record in records" :key="record.id" @click="viewRecordDetail(record.id)">
          <view class="record-info">
            <view class="record-title">
              <text class="pile-name">{{ record.pileName }}</text>
              <text class="record-status">{{ record.status }}</text>
            </view>
            <view class="record-time">{{ record.time }}</view>
          </view>
          <view class="record-data">
            <view class="data-item">
              <text class="data-label">电量</text>
              <text class="data-value">{{ record.energy }}kWh</text>
            </view>
            <view class="data-item">
              <text class="data-label">费用</text>
              <text class="data-value">{{ record.cost }}元</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 没有记录提示 -->
      <view class="no-record" v-if="records.length === 0">
        <image src="/static/images/no-record.png" mode="aspectFit"></image>
        <text>暂无充电记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import CustomNavBar from './components/custom-nav-bar.vue';

export default {
  components: {
    CustomNavBar
  },
  data() {
    return {
      records: [
        // 模拟数据
        {
          id: 1,
          pileName: '充电桩A',
          status: '已完成',
          time: '2023-05-15 14:30-15:45',
          energy: 5.2,
          cost: 9.36
        },
        {
          id: 2,
          pileName: '充电桩C',
          status: '已完成',
          time: '2023-05-14 09:15-10:00',
          energy: 3.8,
          cost: 6.84
        }
      ]
    };
  },
  onLoad() {
    // 加载充电记录
    this.loadRecords();
  },
  methods: {
    loadRecords() {
      // 实际项目中调用API获取充电记录
      // 为简化示例，使用模拟数据
    },
    viewRecordDetail(id) {
      // 查看记录详情
      uni.navigateTo({
        url: `/charging/record-detail?id=${id}`
      });
    }
  },
  onPullDownRefresh() {
    // 下拉刷新
    this.loadRecords();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding-top: 44px;
  background-color: #f5f5f5;
}

.content {
  padding: 15px;
  margin-top:44px
}

.record-list {
  margin-bottom: 20px;
}

.record-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.record-info {
  margin-bottom: 10px;
}

.record-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.pile-name {
  font-size: 16px;
  font-weight: bold;
}

.record-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  background-color: #00B42A;
  color: #fff;
}

.record-time {
  font-size: 14px;
  color: #666;
}

.record-data {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px dashed #eee;
}

.data-item {
  display: flex;
  flex-direction: column;
}

.data-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 3px;
}

.data-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.no-record {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.no-record image {
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.no-record text {
  color: #999;
  font-size: 14px;
}
</style>