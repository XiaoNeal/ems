<template>
  <view class="sub-page">
    <!-- 优化导航栏样式 -->
    <!-- <uni-nav-bar title="消息通知" left-icon="back" :border="false" @clickLeft="back" /> -->
    <u-navbar title="消息通知" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
    :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>

    <view class="content">
      <!-- 添加卡片容器 -->
      <view class="card-container">
        <view class="list-item" @click="navigateTo('/pages/profile/system-notifications')">
          <uni-icons type="sound" size="20" color="#2b9939" />
          <text class="item-title">系统通知</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#ccc" />
        </view>

        <view class="divider" />

        <view class="list-item" @click="navigateTo('/pages/profile/message-reminders')">
          <uni-icons type="chat" size="20" color="#007AFF" />
          <text class="item-title">消息提醒</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#ccc" />
        </view>

        <view class="divider" />

        <view class="list-item">
          <uni-icons type="bell" size="20" color="#f0ad4e" />
          <text class="item-title">免打扰模式</text>
          <switch :checked="doNotDisturb" @change="toggleDoNotDisturb" color="#2b9939" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* 新增卡片样式 */
.card-container {
  background: #fff;
  border-radius: 12px;
  padding: 0 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0;
  position: relative;
}

.item-title {
  flex: 1;
  margin-left: 12px;
  font-size: 15px;
  color: #333;
}

.divider {
  height: 1px;
  background: #f5f5f5;
  margin: 8px 0;
}

/* 优化开关样式 */
/deep/ .uni-switch-input {
  width: 52px !important;
  height: 32px !important;

  &::before {
    width: 28px !important;
    height: 28px !important;
  }

  &.uni-switch-input-checked {
    background-color: #2b9939 !important;
    border-color: #2b9939 !important;
  }
}
/* 统一箭头样式 */
.arrow-icon {
  font-size: 24rpx;
  color: #ccc;
  flex-shrink: 0;
  transition: all 0.2s ease;
  
  .list-item:active & {
    color: #007AFF;
    transform: translateX(4rpx);
  }
}

/* 页面基础样式 */
.sub-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.content {
  padding: 15px;
}

.settings-status {
  display: flex;
  gap: 8px;
}

.status-icon {
  font-size: 14px;
}

.uni-list {
  background-color: #fff;
  border-radius: 8px;
}

.uni-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.uni-list-item:last-child {
  border-bottom: none;
}

.uni-list-item-title {
  font-size: 14px;
  color: #333;
}

.uni-list-item-arrow {
  font-size: 14px;
  color: #999;
}

.notification-badge {
  background-color: #ff5500;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 8px;
}

.notification-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      doNotDisturb: false
    }
  },
  computed: {
    ...mapState({
      headerTabBg: state => state.headerTabBg,
      fontColor: state => state.fontColor
    })
  },
  onShow() {
    this.loadSettings()
  },
  methods: {
    loadSettings() {
      try {
        const settings = uni.getStorageSync('notification_settings')
        if (settings) {
          this.doNotDisturb = settings.doNotDisturb || false
        }
      } catch (e) {
        console.error('加载通知设置失败:', e)
      }
    },
    toggleDoNotDisturb(e) {
      this.doNotDisturb = e.detail.value
      this.saveSettings()
    },
    saveSettings() {
      try {
        const settings = uni.getStorageSync('notification_settings') || {}
        uni.setStorageSync('notification_settings', {
          ...settings,
          doNotDisturb: this.doNotDisturb
        })
        this.syncToServer()
      } catch (e) {
        console.error('保存免打扰设置失败:', e)
      }
    },
    syncToServer() {
      uni.request({
        url: '/api/notification/do-not-disturb',
        method: 'POST',
        data: {
          doNotDisturb: this.doNotDisturb
        },
        fail: () => {
          console.log('免打扰设置同步失败')
        }
      })
    },
    navigateTo(url) {
      uni.navigateTo({ url })
    }
  }
}
</script>
