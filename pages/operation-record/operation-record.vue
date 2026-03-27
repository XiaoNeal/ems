<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar title="操作记录" :autoBack="true" :placeholder="true" />
    
    <!-- 内容区域 -->
    <view class="content">
      <view class="operation-item" v-for="(operation, index) in operationList" :key="index">
        <view class="operation-time">{{ operation.time }}</view>
        <view class="operation-content">
          <text class="operation-user">{{ operation.user }}</text>
          <text class="operation-desc">{{ operation.description }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "OperationRecord",
  data() {
    return {
      operationList: [
        {
          time: '2026-03-23 10:30',
          user: 'admin',
          description: '修改了储能系统充放电策略'
        },
        {
          time: '2026-03-23 09:15',
          user: 'admin',
          description: '重启了光伏逆变器'
        },
        {
          time: '2026-03-22 16:45',
          user: 'system',
          description: '系统自动调整了负荷分配'
        },
        {
          time: '2026-03-22 14:20',
          user: 'admin',
          description: '添加了新的设备节点'
        }
      ]
    };
  },
  methods: {
    refresh() {
      uni.showLoading({ title: '刷新中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({ title: '刷新成功', icon: 'success' });
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #EFF4FB;
}

.content {
  padding: 30rpx;
  flex: 1;
}

.operation-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.operation-time {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.operation-user {
  font-size: 30rpx;
  font-weight: 500;
  color: #222;
  display: block;
  margin-bottom: 12rpx;
}

.operation-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}
</style>