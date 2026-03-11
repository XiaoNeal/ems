<template>
  <view class="sub-page">
    <!-- <uni-nav-bar title="系统设置" left-icon="back" @clickLeft="back" /> -->
    <u-navbar title="系统设置" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
      :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>
    <!-- <view class="content"> -->
    <view class="custom-list">
      <view class="list-item" @click="changeLanguage">
        <view class="item-left">
          <uni-icons type="language" size="20" color="#007AFF" />
          <text class="item-title">语言设置</text>
        </view>
        <view class="item-right">
          <text class="right-text">{{ language }}</text>
          <uni-icons type="arrowright" size="16" color="#999" />
        </view>
      </view>

      <view class="list-item" @click="changeTheme">
        <view class="item-left">
          <uni-icons type="paintbrush" size="20" color="#007AFF" />
          <text class="item-title">主题设置</text>
        </view>
        <view class="item-right">
          <text class="right-text">{{ theme }}</text>
          <uni-icons type="arrowright" size="16" color="#999" />
        </view>
      </view>

      <view class="list-item" @click="clearCache">
        <view class="item-left">
          <uni-icons type="trash" size="20" color="#007AFF" />
          <text class="item-title">清除缓存</text>
        </view>
        <view class="item-right">
          <text class="right-text">{{ cacheSize }}</text>
          <uni-icons type="arrowright" size="16" color="#999" />
        </view>
      </view>

      <view class="list-item" @click="changeFontSize">
        <view class="item-left">
          <uni-icons type="text" size="20" color="#007AFF" />
          <text class="item-title">字体大小</text>
        </view>
        <view class="item-right">
          <uni-icons type="arrowright" size="16" color="#999" />
        </view>
      </view>

      <view class="list-item" @click="navigateTo('/pages/profile/notification-settings')">
        <view class="item-left">
          <uni-icons type="notification" size="20" color="#007AFF" />
          <text class="item-title">通知设置</text>
        </view>
        <view class="item-right">
          <uni-icons type="arrowright" size="16" color="#999" />
        </view>
      </view>


    </view>


    <!-- </view> -->
    <view class="list-item logout-item" @click="logout">
      <!-- <view class="item-left"> -->
      <!-- <uni-icons type="logout" size="22" color="#ff4444" /> -->
      <text class="item-title" style="color: #ff4444;">退出登录</text>
      <!-- </view> -->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      language: '简体中文',
      theme: '默认',
      cacheSize: '12.3MB'
    }
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    changeLanguage() {
      uni.showActionSheet({
        itemList: ['简体中文', 'English'],
        success: (res) => {
          this.language = ['简体中文', 'English'][res.tapIndex]
        }
      });
    },
    changeTheme() {
      uni.showActionSheet({
        itemList: ['默认', '深色', '浅色'],
        success: (res) => {
          this.theme = ['默认', '深色', '浅色'][res.tapIndex]
        }
      });
    },
    clearCache() {
      uni.showModal({
        title: '提示',
        content: '确定要清除缓存吗？',
        success: (res) => {
          if (res.confirm) {
            this.cacheSize = '0MB'
            uni.showToast({
              title: '缓存已清除',
              icon: 'success'
            });
          }
        }
      });
    },
    changeFontSize() {
      uni.showActionSheet({
        itemList: ['小', '中', '大'],
        success: (res) => {
          uni.showToast({
            title: `已设置为${['小', '中', '大'][res.tapIndex]}号字体`,
            icon: 'none'
          });
        }
      });
    },
    navigateTo(url) {
      uni.navigateTo({
        url: url
      });
    },
    async logout() {


      // 为了使用 await 关键字，需要将 success 回调函数改为 async 函数
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: async (res) => {
          if (res.confirm) {
            await this.$store.dispatch('user/logout');
            uni.reLaunch({
              url: '/pages/login/login'
            });
          }

        }
      });
    }
  }
}
</script>

<style scoped>
.sub-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.content {
  padding: 15px;
}

.custom-list {
  background: #fff;
  border-radius: 12rpx;
  margin: 20rpx;
}

.list-item {
  padding: 28rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f5f5f5;
}

.list-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.item-title {
  font-size: 30rpx;
  color: #333;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.right-text {
  font-size: 28rpx;
  color: #999;
}

.logout-item .item-title {
  color: #666;
}

.logout-item {
  margin: 40rpx 20rpx;
  background: #fff8f8;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(255, 68, 68, 0.1);
  transition: all 0.3s ease;

}

.logout-item:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 6rpx rgba(255, 68, 68, 0.2);
}

.item-title {
  font-weight: 500;
  text-align: center;
  width: 100%;
}
</style>