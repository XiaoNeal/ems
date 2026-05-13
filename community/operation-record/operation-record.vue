<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar title="操作记录" :autoBack="true" :placeholder="true" />
    
    <!-- 内容区域 -->
    <view class="content">
      <view v-if="operationList.length === 0" class="empty-state">
        <view class="empty-illustration">
          <view class="illustration-bg"></view>
          <view class="illustration-main">
            <uni-icons type="calendar" size="48" color="#4488FB"></uni-icons>
          </view>
          <view class="illustration-decoration">
            <view class="deco-dot"></view>
            <view class="deco-line"></view>
            <view class="deco-dot"></view>
          </view>
        </view>
        <view class="empty-content">
          <text class="empty-title">暂无操作记录</text>
          <text class="empty-desc">您还没有任何操作记录</text>
          <text class="empty-hint">操作数据将会在这里显示</text>
        </view>
      </view>
      <view v-else>
        <view class="operation-item" v-for="(operation, index) in operationList" :key="index">
          <view class="operation-time">{{ operation.time }}</view>
          <view class="operation-content">
            <text class="operation-user">{{ operation.user }}</text>
            <text class="operation-desc">{{ operation.description }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { queryQuickControlLog } from '@/api/alarm.js'

export default {
  name: "OperationRecord",
  data() {
    return {
      operationList: []
    };
  },
  mounted() {
    this.getOperationList()
  },
  methods: {
    async getOperationList() {
      try {
        const res = await queryQuickControlLog({
          areaLevelIds: [883],
          endTime: '2026-05-13 23:59:59',
          startTime: '2026-05-13 00:00:00'
        })


        this.operationList = res.data || []

        console.log(res, "-----------------32322-------")
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    refresh() {
      uni.showLoading({ title: '刷新中...' });
      this.getOperationList().then(() => {
        uni.hideLoading();
        uni.showToast({ title: '刷新成功', icon: 'success' });
      })
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 60rpx;
  background: #fff;
  border-radius: 24rpx;
  margin-top: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(68, 136, 251, 0.08);
}

.empty-illustration {
  position: relative;
  width: 180rpx;
  height: 180rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
}

.illustration-bg {
  position: absolute;
  width: 180rpx;
  height: 180rpx;
  background: linear-gradient(135deg, #EFF6FF 0%, #E8F4FF 100%);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

.illustration-main {
  position: relative;
  z-index: 2;
  width: 100rpx;
  height: 100rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(68, 136, 251, 0.2);
}

.illustration-decoration {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8rpx;
  z-index: 1;
}

.deco-dot {
  width: 8rpx;
  height: 8rpx;
  background: #4488FB;
  border-radius: 50%;
  opacity: 0.6;
}

.deco-line {
  width: 40rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #4488FB, #74B9FF);
  border-radius: 2rpx;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-title {
  font-size: 32rpx;
  color: #2D3748;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #718096;
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #a0aec0;
}
</style>