<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar title="报警记录" :autoBack="true" :placeholder="true">
    </u-navbar>
    
    <!-- 内容区域 -->
    <view class="content">
      <view class="alarm-item" v-for="(alarm, index) in alarmList" :key="index">
        <view class="alarm-time">{{ alarm.time }}</view>
        <view class="alarm-content">
          <text class="alarm-title">{{ alarm.title }}</text>
          <text class="alarm-desc">{{ alarm.description }}</text>
        </view>
        <view class="alarm-status" :class="alarm.status">{{ alarm.statusText }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "Alarm",
  data() {
    return {
      alarmList: [
        {
          time: '2026-03-23 10:30',
          title: '储能系统异常',
          description: '储能系统SOC值异常，当前值为105%',
          status: 'warning',
          statusText: '未处理'
        },
        {
          time: '2026-03-23 09:15',
          title: '光伏系统故障',
          description: '光伏板1号模块输出功率为0',
          status: 'error',
          statusText: '已处理'
        },
        {
          time: '2026-03-22 16:45',
          title: '电网波动',
          description: '电网电压波动超过阈值',
          status: 'info',
          statusText: '已处理'
        }
      ]
    };
  },
  methods: {
    // 刷新数据方法
    refresh() {
      // 显示加载提示
      uni.showLoading({
        title: '刷新中...'
      });

      try {
        // 模拟刷新数据
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: '刷新成功',
            icon: 'success',
            duration: 1500
          });
        }, 500);
      } catch (error) {
        console.error('刷新失败:', error);
        uni.hideLoading();
        uni.showToast({
          title: '刷新失败',
          icon: 'error',
          duration: 1500
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #EFF4FB;
}



.content {
  padding: 20rpx;
  flex: 1;
}

.alarm-item {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.alarm-time {
  font-size: 14rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.alarm-content {
  margin-bottom: 10rpx;
}

.alarm-title {
  font-size: 16rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5rpx;
}

.alarm-desc {
  font-size: 14rpx;
  color: #666;
  line-height: 1.4;
}

.alarm-status {
  font-size: 12rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  align-self: flex-start;
}

.alarm-status.warning {
  background-color: #fff7e6;
  color: #fa8c16;
}

.alarm-status.error {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.alarm-status.info {
  background-color: #e6f7ff;
  color: #1890ff;
}
</style>