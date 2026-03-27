<template>
  <view class="container">
    <!-- 内容区域 -->
    <view class="content">
      <view class="system-header">
        <text class="system-title">系统管理</text>
      </view>

      <!-- 运行日志 -->
      <view class="section">
        <text class="section-title">运行日志</text>
        <view class="section-content">
          <view class="item-row">
            <view class="item" @click="goToAlarm">
              <view class="item-icon alarm-icon">
                <text class="icon-text">🔔</text>
              </view>
              <text class="item-text">报警</text>
            </view>
            <view class="item" @click="goToOperationRecord">
              <view class="item-icon record-icon">
                <text class="icon-text">📝</text>
              </view>
              <text class="item-text">操作记录</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 运行配置 -->
      <view class="section">
        <text class="section-title">运行配置</text>
        <view class="section-content">
          <view class="item-row">
            <view class="item" @click="goToStrategyConfig">
              <view class="item-icon strategy-icon">
                <text class="icon-text">⚙️</text>
              </view>
              <text class="item-text">策略配置</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 内部数据 -->
      <view class="section">
        <text class="section-title">内部数据</text>
        <view class="section-content">
          <view class="item-row">
            <view class="item" @click="goToMonitorData">
              <view class="item-icon data-icon">
                <text class="icon-text">📊</text>
              </view>
              <text class="item-text">监控数据</text>
            </view>
            <view class="item" @click="goToQuickControl">
              <view class="item-icon control-icon">
                <text class="icon-text">🎮</text>
              </view>
              <text class="item-text">快捷控制</text>
            </view>
            <view class="item" @click="goToSettings">
              <view class="item-icon setting-icon">
                <text class="icon-text">🔧</text>
              </view>
              <text class="item-text">设置参数</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 系统信息 -->
      <view class="section">
        <view class="system-info" @click="showSystemInfo">
          <view class="info-icon">
            <text class="info-icon-text">i</text>
          </view>
          <text class="info-text">系统信息</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "System",
  data() {
    return {
      systemInfo: {
        version: '1.0.0',
        deviceCount: 15,
        onlineStatus: '在线',
        lastUpdate: '2026-03-23 10:48',
        systemName: '光储直柔能源站EMS'
      }
    };
  },
  methods: {
    // 刷新数据方法
    refresh() {
      console.log('刷新系统配置数据');
      // 这里可以添加刷新逻辑
    },
    
    // 跳转到报警页面
    goToAlarm() {
      uni.navigateTo({
        url: '/pages/alarm/alarm'
      });
    },
    
    // 跳转到操作记录页面
    goToOperationRecord() {
      uni.navigateTo({
        url: '/pages/operation-record/operation-record'
      });
    },
    
    // 跳转到策略配置页面
    goToStrategyConfig() {
      uni.navigateTo({
        url: '/pages/strategy-config/strategy-config'
      });
    },
    
    // 跳转到监控数据页面
    goToMonitorData() {
      uni.navigateTo({
        url: '/pages/monitor-data/monitor-data'
      });
    },
    
    // 跳转到快捷控制页面
    goToQuickControl() {
      uni.navigateTo({
        url: '/pages/quick-control/quick-control'
      });
    },
    
    // 跳转到设置参数页面
    goToSettings() {
      uni.navigateTo({
        url: '/pages/settings/settings'
      });
    },
    
    // 跳转到系统信息页面
    showSystemInfo() {
      uni.navigateTo({
        url: '/community/system-info'
      });
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

.system-header {
  text-align: center;
  margin-bottom: 30rpx;
  padding-top: 20rpx;
}

.system-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.section {
  background-color: #fff;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.section-title {
  font-size: 14px;
  color: #666;
  padding: 15rpx 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.section-content {
  padding: 20rpx;
}

.item-row {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10rpx 0;
  width: 30%;
}

.item-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
}

.icon-text {
  font-size: 32rpx;
}

.info-icon-text {
  font-size: 14rpx;
  color: #fff;
}

.alarm-icon {
  background-color: #e6f7ff;
}

.record-icon {
  background-color: #f6ffed;
}

.strategy-icon {
  background-color: #fff7e6;
}

.data-icon {
  background-color: #f9f0ff;
}

.control-icon {
  background-color: #fff1f0;
}

.setting-icon {
  background-color: #f0f5ff;
}

.item-text {
  font-size: 12px;
  color: #666;
}

.system-info {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1px solid #f0f0f0;
}

.info-icon {
  width: 20rpx;
  height: 20rpx;
  margin-right: 10rpx;
  border-radius: 50%;
  background-color: #1890ff;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-text {
  font-size: 14px;
  color: #333;
}

</style>