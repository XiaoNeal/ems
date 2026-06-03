<template>
  <view class="sub-page">
    <u-navbar title="系统通知" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
      :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>

    <scroll-view class="content" scroll-y>
      <view v-if="notifications.length === 0" class="empty-state">
        <uni-icons type="bell" size="60" color="#ccc" />
        <text class="empty-text">暂无系统通知</text>
      </view>

      <view v-else class="notification-list">
        <view 
          v-for="item in notifications" 
          :key="item.id" 
          class="notification-item"
          :class="{ 'read': item.read }"
          @click="markAsRead(item)"
        >
          <view class="notification-icon" :class="item.type">
            <uni-icons :type="getIconType(item.type)" :size="24" color="#fff" />
          </view>
          <view class="notification-content">
            <view class="notification-header">
              <text class="notification-title">{{ item.title }}</text>
              <text class="notification-time">{{ formatTime(item.time) }}</text>
            </view>
            <text class="notification-desc">{{ item.description }}</text>
          </view>
          <view v-if="!item.read" class="unread-dot"></view>
        </view>
      </view>

      <view class="footer-space"></view>
    </scroll-view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      notifications: []
    }
  },
  computed: {
    ...mapState({
      headerTabBg: state => state.headerTabBg,
      fontColor: state => state.fontColor
    })
  },
  onShow() {
    this.loadNotifications()
  },
  methods: {
    loadNotifications() {
      this.notifications = [
        {
          id: 1,
          title: '系统升级通知',
          description: '系统将于今晚22:00-00:00进行维护升级，期间服务可能会短暂中断，请提前保存好您的工作。',
          type: 'system',
          time: '2024-01-15 10:30',
          read: false
        },
        {
          id: 2,
          title: '新功能上线',
          description: '新增设备智能诊断功能，可自动识别设备异常并提供优化建议。',
          type: 'info',
          time: '2024-01-14 15:20',
          read: false
        },
        {
          id: 3,
          title: '安全提醒',
          description: '您的账户在新设备上登录，如非本人操作请及时修改密码。',
          type: 'warning',
          time: '2024-01-13 09:15',
          read: true
        },
        {
          id: 4,
          title: '数据备份完成',
          description: '您的设备数据已成功备份至云端，可随时恢复。',
          type: 'success',
          time: '2024-01-12 14:00',
          read: true
        },
        {
          id: 5,
          title: '服务协议更新',
          description: '《用户服务协议》已更新，请您阅读并确认。',
          type: 'info',
          time: '2024-01-10 11:30',
          read: true
        }
      ]
    },
    getIconType(type) {
      const icons = {
        system: 'settings',
        info: 'info',
        warning: 'alert',
        success: 'checkmark'
      }
      return icons[type] || 'info'
    },
    formatTime(time) {
      const now = new Date()
      const msgTime = new Date(time)
      const diff = now - msgTime
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor(diff / (1000 * 60))

      if (days > 0) {
        return `${days}天前`
      } else if (hours > 0) {
        return `${hours}小时前`
      } else if (minutes > 0) {
        return `${minutes}分钟前`
      } else {
        return '刚刚'
      }
    },
    markAsRead(item) {
      if (!item.read) {
        item.read = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.content {
  height: calc(100vh - 88rpx);
  padding: 20rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-text {
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #999;
}

.notification-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.notification-item {
  display: flex;
  padding: 28rpx;
  border-bottom: 2rpx solid #f5f5f5;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #fafafa;
  }

  &.read {
    .notification-title {
      color: #999;
    }
    .notification-desc {
      color: #bbb;
    }
  }
}

.notification-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 20rpx;

  &.system {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  &.info {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
  &.warning {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  }
  &.success {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12rpx;
}

.notification-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.notification-time {
  font-size: 24rpx;
  color: #999;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.notification-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.unread-dot {
  width: 12rpx;
  height: 12rpx;
  background: #ff5500;
  border-radius: 50%;
  margin-left: 12rpx;
  flex-shrink: 0;
}

.footer-space {
  height: 40rpx;
}
</style>