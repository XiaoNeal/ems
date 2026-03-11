<template>
  <view class="container">
    <custom-nav-bar 
      title="我的" 
      :showBack="false"
      bgColor="#165DFF"
      textColor="#fff"
    ></custom-nav-bar>
    
    <view class="content">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="avatar-area">
          <view class="avatar">
            <uni-icons 
              type="person" 
              size="40" 
              color="#165DFF"
            ></uni-icons>
          </view>
          <view class="user-status">
            <view class="user-name">{{ userInfo.name }}</view>
            <view class="user-phone">{{ userInfo.phone }}</view>
          </view>
          <view class="edit-btn" @click="editUserInfo">
            <uni-icons type="edit" size="18" color="#fff"></uni-icons>
          </view>
        </view>
        
        <!-- 充电统计 -->
        <view class="charge-stats">
          <view class="stat-item">
            <view class="stat-value">{{ totalCharge }}</view>
            <view class="stat-label">总充电量(kWh)</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">{{ totalTimes }}</view>
            <view class="stat-label">充电次数</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">¥{{ totalCost.toFixed(2) }}</view>
            <view class="stat-label">总消费</view>
          </view>
        </view>
      </view>
      
      <!-- 功能列表 -->
      <view class="function-list">
        <view class="function-item" @click="navigateTo('records')">
          <view class="item-icon">
            <uni-icons type="list" size="22" color="#165DFF"></uni-icons>
          </view>
          <view class="item-text">充电记录</view>
          <view class="item-arrow">
            <uni-icons type="right" size="18" color="#999"></uni-icons>
          </view>
        </view>
        <view class="function-item" @click="navigateTo('wallet')">
          <view class="item-icon">
            <uni-icons type="money" size="22" color="#165DFF"></uni-icons>
          </view>
          <view class="item-text">我的钱包</view>
          <view class="item-arrow">
            <uni-icons type="right" size="18" color="#999"></uni-icons>
          </view>
        </view>
        <view class="function-item" @click="navigateTo('coupon')">
          <view class="item-icon">
            <uni-icons type="ticket" size="22" color="#165DFF"></uni-icons>
          </view>
          <view class="item-text">优惠券</view>
          <view class="item-arrow">
            <uni-icons type="right" size="18" color="#999"></uni-icons>
          </view>
        </view>
        <view class="function-item" @click="navigateTo('settings')">
          <view class="item-icon">
            <uni-icons type="setting" size="22" color="#165DFF"></uni-icons>
          </view>
          <view class="item-text">设置</view>
          <view class="item-arrow">
            <uni-icons type="right" size="18" color="#999"></uni-icons>
          </view>
        </view>
      </view>
      
      <!-- 版本信息 -->
      <view class="version-info">
        <text>版本 v1.0.0</text>
      </view>
    </view>
  </view>
</template>

<script>


export default {
 
  data() {
    return {
      userInfo: {
        name: '张三',
        phone: '138****6789'
      },
      // 充电统计数据
      totalCharge: 268.5,
      totalTimes: 36,
      totalCost: 486.35
    };
  },
  onLoad() {
    // 加载用户信息
    this.loadUserInfo();
  },
  methods: {
    loadUserInfo() {
      // 实际项目中调用API获取用户信息
      // 这里使用模拟数据
    },
    
    // 编辑用户信息
    editUserInfo() {
      uni.navigateTo({
        url: '/pages/user/edit-info'
      });
    },
    
    // 页面跳转
    navigateTo(page) {
      switch(page) {
        case 'records':
          uni.navigateTo({
            url: '/pages/charging/records'
          });
          break;
        case 'wallet':
          uni.navigateTo({
            url: '/pages/wallet/wallet'
          });
          break;
        case 'coupon':
          uni.navigateTo({
            url: '/pages/coupon/coupon'
          });
          break;
        case 'settings':
          uni.navigateTo({
            url: '/pages/settings/settings'
          });
          break;
      }
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  /* 为自定义导航栏留出空间 */
  padding-top: var(--custom-nav-bar-height, 44px);
}

.content {
  padding: 15px;
}

/* 用户信息卡片 */
.user-card {
  background: linear-gradient(135deg, #165DFF 0%, #0E42D2 100%);
  border-radius: 12px;
  padding: 20px 15px;
  margin-bottom: 15px;
  color: #fff;
  box-shadow: 0 4px 15px rgba(22, 93, 255, 0.15);
}

.avatar-area {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.user-status {
  flex: 1;
}

.user-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.user-phone {
  font-size: 14px;
  opacity: 0.8;
}

.edit-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
}

.edit-btn:active {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 充电统计 */
.charge-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  flex: 1;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

/* 功能列表 */
.function-list {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.function-item {
  display: flex;
  align-items: center;
  padding: 16px 15px;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s ease;
}

.function-item:last-child {
  border-bottom: none;
}

.function-item:active {
  background-color: #f9f9f9;
}

.item-icon {
  width: 24px;
  height: 24px;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.item-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 版本信息 */
.version-info {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 10px 0;
}
</style>
