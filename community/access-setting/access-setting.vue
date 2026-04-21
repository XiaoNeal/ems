<template>
  <view class="container">


    <!-- 头部导航 -->
    <!-- <view class="header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="header-title">接入设置</text>
      <view class="header-right"></view>
    </view> -->

    <u-navbar title="接入设置" :autoBack="true" :placeholder="true">
    </u-navbar>

    <!-- 设备列表 -->
    <view class="device-list">
      <view v-for="(device, index) in deviceList" :key="index" class="device-item">
        <view class="device-info">
          <text class="device-name">{{ device.deviceName }}</text>
          <view class="device-details">
            <view class="detail-item">
              <text class="detail-label">柔度值设置</text>
              <text class="detail-value">{{ device.flexibility }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">四级分类设置</text>
              <text class="detail-value">{{ device.category || '无' }}</text>
            </view>
          </view>
        </view>
        <view class="config-btn" @click="onConfigClick(device)">
          <text class="config-icon">⚙️</text>
          <text class="config-text">配置</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'access-setting',
  data() {
    return {
      deviceList: [
        { deviceName: '01.直流空调', flexibility: 0.11, category: '无' },
        { deviceName: '01.直流空调', flexibility: 0.11, category: '无' },
        { deviceName: '01.直流空调', flexibility: 0.11, category: '无' },
        { deviceName: '01.直流空调', flexibility: 0.11, category: '无' },
        { deviceName: '01.直流空调', flexibility: 0.11, category: '无' },
        { deviceName: '01.直流空调', flexibility: 0.11, category: '无' },
        { deviceName: '01.直流空调', flexibility: 0.11, category: '无' }
      ]
    };
  },
  methods: {
    goBack() {
      // 返回上一页
      uni.navigateBack();
    },
    onConfigClick(device) {
      // 配置设备
      console.log('配置设备:', device);
      // 这里可以跳转到具体的设备配置页面
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 头部导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background-color: #fff;
  padding: 0 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 24px;
  color: #333;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-right {
  width: 40px;
}

/* 设备列表 */
.device-list {
  padding: 10px;
}

.device-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.device-info {
  flex: 1;
}

.device-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.device-details {
  margin-top: 8px;
  display: flex;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  flex-direction: column;
}

.detail-label {
  font-size: 14px;
  color: #666;
  margin-right: 16px;
  width: 100px;
  text-align: center;
}

.detail-value {
  font-size: 14px;
  color: #333;
}

/* 配置按钮 */
.config-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background-color: #1890FF;
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.config-btn:hover {
  background-color: #40a9ff;
}

.config-icon {
  font-size: 14px;
}

.config-text {
  font-size: 14px;
}
</style>