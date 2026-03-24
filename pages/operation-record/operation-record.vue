<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar title="操作记录" :autoBack="true" :placeholder="true">
    </u-navbar>
    
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

.operation-item {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.operation-time {
  font-size: 14rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.operation-content {
  margin-bottom: 10rpx;
}

.operation-user {
  font-size: 16rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5rpx;
}

.operation-desc {
  font-size: 14rpx;
  color: #666;
  line-height: 1.4;
}
</style>