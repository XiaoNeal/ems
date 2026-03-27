<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar title="快捷控制" :autoBack="true" :placeholder="true" />
    
    <!-- 内容区域 -->
    <view class="content">
      <view class="control-section">
        <text class="section-title">模式选择</text>
        <view class="mode-buttons">
          <view class="mode-btn" :class="{ active: selectedMode === 'grid' }" @click="selectMode('grid')">并网模式</view>
          <view class="mode-btn" :class="{ active: selectedMode === 'offGrid' }" @click="selectMode('offGrid')">离网模式</view>
          <view class="mode-btn" :class="{ active: selectedMode === 'mains' }" @click="selectMode('mains')">市电模式</view>
        </view>
      </view>
      
      <view class="control-section">
        <text class="section-title">PCS控制命令</text>
        <view class="action-buttons">
          <view class="action-btn primary" @click="pcsAction('start')">一键启动</view>
          <view class="action-btn secondary" @click="pcsAction('stop')">停机</view>
        </view>
      </view>
      
      <view class="control-section">
        <text class="section-title">光伏DC/DC</text>
        <view class="action-buttons">
          <view class="action-btn primary" @click="pvDcAction('start')">开机</view>
          <view class="action-btn secondary" @click="pvDcAction('stop')">关机</view>
        </view>
      </view>
      
      <view class="control-section">
        <text class="section-title">储能DC/DC</text>
        <view class="action-buttons">
          <view class="action-btn primary" @click="storageDcAction('start')">一键开机</view>
          <view class="action-btn secondary" @click="storageDcAction('stop')">停机</view>
        </view>
      </view>
      
      <view class="control-section">
        <text class="section-title">储能DC/DC工作模式</text>
        <view class="action-buttons">
          <view class="action-btn primary" @click="storageModeAction('charge')">充电</view>
          <view class="action-btn secondary" @click="storageModeAction('discharge')">放电</view>
        </view>
      </view>
      
      <view class="control-section">
        <text class="section-title">储能DC/DC功率设置</text>
        <view class="power-setting">
          <input type="number" v-model="powerValue" placeholder="请输入功率值" />
          <text class="unit">kW</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "QuickControl",
  data() {
    return {
      selectedMode: 'grid',
      powerValue: ''
    };
  },
  methods: {
    selectMode(mode) {
      this.selectedMode = mode;
    },
    pcsAction(action) {
      const actionText = action === 'start' ? '启动' : '停机';
      uni.showModal({
        title: 'PCS控制',
        content: `确定要执行PCS${actionText}操作吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: `PCS${actionText}成功`,
              icon: 'success'
            });
          }
        }
      });
    },
    pvDcAction(action) {
      const actionText = action === 'start' ? '开机' : '关机';
      uni.showModal({
        title: '光伏DC/DC控制',
        content: `确定要执行光伏DC/DC${actionText}操作吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: `光伏DC/DC${actionText}成功`,
              icon: 'success'
            });
          }
        }
      });
    },
    storageDcAction(action) {
      const actionText = action === 'start' ? '开机' : '停机';
      uni.showModal({
        title: '储能DC/DC控制',
        content: `确定要执行储能DC/DC${actionText}操作吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: `储能DC/DC${actionText}成功`,
              icon: 'success'
            });
          }
        }
      });
    },
    storageModeAction(mode) {
      const modeText = mode === 'charge' ? '充电' : '放电';
      uni.showModal({
        title: '储能DC/DC工作模式',
        content: `确定要设置储能DC/DC为${modeText}模式吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: `储能DC/DC已设置为${modeText}模式`,
              icon: 'success'
            });
          }
        }
      });
    },
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

.control-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #222;
  margin-bottom: 24rpx;
  display: block;
}

.mode-buttons {
  display: flex;
  gap: 20rpx;
}

.mode-btn {
  flex: 1;
  padding: 28rpx 20rpx;
  text-align: center;
  border-radius: 16rpx;
  font-size: 28rpx;
  background: #F5F7FA;
  color: #333;
  transition: all 0.3s;
  
  &.active {
    background: #3388FF;
    color: #fff;
  }
}

.action-buttons {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 28rpx 20rpx;
  text-align: center;
  border-radius: 16rpx;
  font-size: 28rpx;
  transition: all 0.3s;
  
  &.primary {
    background: #3388FF;
    color: #fff;
  }
  
  &.secondary {
    background: #F5F7FA;
    color: #333;
  }
}

.power-setting {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  border-radius: 16rpx;
  border: 2rpx solid #E5E6EB;
  padding: 0 24rpx;
  background: #fff;

  input {
    flex: 1;
    height: 100%;
    font-size: 30rpx;
    color: #333;
  }

  .unit {
    font-size: 28rpx;
    color: #666;
    margin-left: 10rpx;
  }
}
</style>