<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar title="设置参数" :autoBack="true" :placeholder="true">
    </u-navbar>
    
    <!-- 内容区域 -->
    <view class="content">
      <!-- 标签页 -->
      <view class="tab-bar">
        <view class="tab-item" :class="{ active: activeTab === 'pcs' }" @click="switchTab('pcs')">并网PCS</view>
        <view class="tab-item" :class="{ active: activeTab === 'storage' }" @click="switchTab('storage')">储能DC/DC</view>
        <view class="tab-item" :class="{ active: activeTab === 'pv' }" @click="switchTab('pv')">光伏DC/DC</view>
        <view class="tab-item" :class="{ active: activeTab === 'cooling' }" @click="switchTab('cooling')">液冷</view>
      </view>
      
      <!-- 本地/远程控制 -->
      <view class="control-section">
        <text class="section-title">本地/远程设置</text>
        <view class="control-buttons">
          <view class="control-btn" :class="{ active: controlMode === 'local' }" @click="setControlMode('local')">本地</view>
          <view class="control-btn" :class="{ active: controlMode === 'remote' }" @click="setControlMode('remote')">远程</view>
        </view>
      </view>
      
      <!-- 并网/离网设置 -->
      <view class="control-section">
        <text class="section-title">并网/离网设置</text>
        <view class="control-buttons">
          <view class="control-btn" :class="{ active: gridMode === 'grid' }" @click="setGridMode('grid')">并网</view>
          <view class="control-btn" :class="{ active: gridMode === 'offGrid' }" @click="setGridMode('offGrid')">离网</view>
        </view>
      </view>
      
      <!-- 控制按钮组 -->
      <view class="control-section">
        <text class="section-title">控制操作</text>
        <view class="action-buttons">
          <view class="action-btn" @click="resetSystem">复位</view>
        </view>
        <view class="action-buttons">
          <view class="action-btn" @click="startDevice">启动</view>
        </view>
        <view class="action-buttons">
          <view class="action-btn" @click="stopDevice">停机</view>
        </view>
        <view class="action-buttons">
          <view class="action-btn" @click="feedDevice">馈送</view>
        </view>
      </view>
      
      <!-- 参数设置 -->
      <view class="control-section">
        <text class="section-title">参数设置</text>
        <view class="param-item">
          <text class="param-label">恒压充电电压定值</text>
          <view class="param-input">
            <input type="number" v-model="params.constantVoltage" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">恒流充电电流定值</text>
          <view class="param-input">
            <input type="number" v-model="params.constantCurrent" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">并网侧出线频率定值</text>
          <view class="param-input">
            <input type="number" v-model="params.gridFrequency" placeholder="请输入" />
            <text class="param-unit">Hz</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">并网侧出线电压定值</text>
          <view class="param-input">
            <input type="number" v-model="params.gridVoltage" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
      </view>
      
      <!-- 复位按钮 -->
      <view class="control-section">
        <text class="section-title">系统复位</text>
        <view class="action-buttons">
          <view class="action-btn" @click="resetBms">故障复位BMS</view>
        </view>
        <view class="action-buttons">
          <view class="action-btn" @click="resetLoad">负载复位</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      activeTab: 'pcs',
      controlMode: 'local',
      gridMode: 'grid',
      params: {
        constantVoltage: '',
        constantCurrent: '',
        gridFrequency: '',
        gridVoltage: ''
      }
    };
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
    setControlMode(mode) {
      this.controlMode = mode;
    },
    setGridMode(mode) {
      this.gridMode = mode;
    },
    resetSystem() {
      uni.showModal({
        title: '系统复位',
        content: '确定要执行系统复位操作吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '系统已复位',
              icon: 'success'
            });
          }
        }
      });
    },
    startDevice() {
      uni.showModal({
        title: '设备启动',
        content: '确定要启动设备吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '设备已启动',
              icon: 'success'
            });
          }
        }
      });
    },
    stopDevice() {
      uni.showModal({
        title: '设备停机',
        content: '确定要停止设备吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '设备已停机',
              icon: 'success'
            });
          }
        }
      });
    },
    feedDevice() {
      uni.showModal({
        title: '设备馈送',
        content: '确定要执行馈送操作吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '馈送操作已执行',
              icon: 'success'
            });
          }
        }
      });
    },
    resetBms() {
      uni.showModal({
        title: '故障复位BMS',
        content: '确定要执行BMS故障复位吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: 'BMS故障已复位',
              icon: 'success'
            });
          }
        }
      });
    },
    resetLoad() {
      uni.showModal({
        title: '负载复位',
        content: '确定要执行负载复位吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '负载已复位',
              icon: 'success'
            });
          }
        }
      });
    },
    refresh() {
      uni.showLoading({
        title: '刷新中...'
      });

      try {
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

.tab-bar {
  display: flex;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 10rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
  flex: 1;
  padding: 15rpx;
  text-align: center;
  font-size: 16rpx;
  color: #666;
  border-radius: 8rpx;
}

.tab-item.active {
  background-color: #1890ff;
  color: #fff;
}

.control-section {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.control-buttons {
  display: flex;
  gap: 15rpx;
  margin-bottom: 15rpx;
}

.control-btn {
  flex: 1;
  padding: 15rpx;
  text-align: center;
  border-radius: 8rpx;
  font-size: 16rpx;
  background-color: #f0f0f0;
  color: #333;
}

.control-btn.active {
  background-color: #1890ff;
  color: #fff;
}

.action-buttons {
  margin-bottom: 15rpx;
}

.action-btn {
  width: 100%;
  padding: 15rpx;
  text-align: center;
  border-radius: 8rpx;
  font-size: 16rpx;
  background-color: #1890ff;
  color: #fff;
}

.param-item {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.param-label {
  font-size: 16rpx;
  color: #333;
  width: 300rpx;
}

.param-input {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  padding: 0 15rpx;
}

.param-input input {
  flex: 1;
  padding: 15rpx 0;
  font-size: 16rpx;
  color: #333;
}

.param-unit {
  margin-left: 10rpx;
  font-size: 16rpx;
  color: #999;
}
</style>
