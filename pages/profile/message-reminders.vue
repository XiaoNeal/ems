<template>
  <view class="sub-page">
    <u-navbar title="消息提醒" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
      :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>

    <scroll-view class="content" scroll-y>
      <view v-if="messages.length === 0" class="empty-state">
        <uni-icons type="chat" size="60" color="#ccc" />
        <text class="empty-text">暂无消息提醒</text>
      </view>

      <view v-else class="message-list">
        <view 
          v-for="item in messages" 
          :key="item.id" 
          class="message-item"
          :class="{ 'read': item.read }"
          @click="markAsRead(item)"
        >
          <view class="avatar-wrapper">
            <view class="avatar" :style="{ background: item.avatarColor }">
              <uni-icons :type="item.avatarIcon" size="28" color="#fff" />
            </view>
            <view v-if="item.unreadCount > 0" class="badge">{{ item.unreadCount }}</view>
          </view>
          <view class="message-content">
            <view class="message-header">
              <text class="sender-name">{{ item.senderName }}</text>
              <text class="message-time">{{ formatTime(item.time) }}</text>
            </view>
            <text class="message-preview">{{ item.preview }}</text>
          </view>
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
      messages: []
    }
  },
  computed: {
    ...mapState({
      headerTabBg: state => state.headerTabBg,
      fontColor: state => state.fontColor
    })
  },
  onShow() {
    this.loadMessages()
  },
  methods: {
    loadMessages() {
      this.messages = [
        {
          id: 1,
          senderName: '设备告警',
          preview: '储能设备BMS模块出现异常，请及时检查',
          time: '2024-01-15 14:30',
          read: false,
          unreadCount: 3,
          avatarIcon: 'alert',
          avatarColor: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
        },
        {
          id: 2,
          senderName: '系统助手',
          preview: '您的月度报告已生成，请查看',
          time: '2024-01-15 10:00',
          read: false,
          unreadCount: 1,
          avatarIcon: 'help-circle',
          avatarColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
          id: 3,
          senderName: '运维团队',
          preview: '本周设备巡检计划已安排，请确认',
          time: '2024-01-14 16:20',
          read: true,
          unreadCount: 0,
          avatarIcon: 'users',
          avatarColor: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)'
        },
        {
          id: 4,
          senderName: '智能客服',
          preview: '您的问题已有回复，点击查看详情',
          time: '2024-01-14 09:45',
          read: true,
          unreadCount: 0,
          avatarIcon: 'message-circle',
          avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
          id: 5,
          senderName: '电量提醒',
          preview: '今日发电量已达到目标值的85%',
          time: '2024-01-13 18:30',
          read: true,
          unreadCount: 0,
          avatarIcon: 'battery-full',
          avatarColor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
        }
      ]
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
        item.unreadCount = 0
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

.message-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.message-item {
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
    .sender-name {
      color: #999;
    }
    .message-preview {
      color: #bbb;
    }
  }
}

.avatar-wrapper {
  position: relative;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  min-width: 32rpx;
  height: 32rpx;
  background: #ff5500;
  color: #fff;
  font-size: 20rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.sender-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.message-time {
  font-size: 24rpx;
  color: #999;
}

.message-preview {
  font-size: 26rpx;
  color: #666;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.footer-space {
  height: 40rpx;
}
</style>