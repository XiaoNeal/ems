<template>
  <view class="sub-page">
    <u-navbar title="通知设置" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
      :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>
    
    <view class="custom-list">
      <view class="list-item">
        <view class="item-left">
          <uni-icons type="bell" size="24" color="#007AFF" />
          <text class="item-title">接收系统通知</text>
        </view>
        <view class="item-right">
          <switch :checked="systemNotify" @change="toggleSetting('systemNotify', $event)" color="#007AFF" />
        </view>
      </view>
      
      <view class="list-item">
        <view class="item-left">
          <uni-icons type="volume-high" size="24" color="#007AFF" />
          <text class="item-title">消息提醒声音</text>
        </view>
        <view class="item-right">
          <switch :checked="soundNotify" @change="toggleSetting('soundNotify', $event)" color="#007AFF" />
        </view>
      </view>
      
      <view class="list-item">
        <view class="item-left">
          <uni-icons type="mic" size="24" color="#007AFF" />
          <text class="item-title">振动提醒</text>
        </view>
        <view class="item-right">
          <switch :checked="vibrateNotify" @change="toggleSetting('vibrateNotify', $event)" color="#007AFF" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      systemNotify: true,
      soundNotify: true,
      vibrateNotify: false
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
          Object.assign(this, settings)
        }
      } catch (e) {
        console.error('加载通知设置失败:', e)
      }
    },
    toggleSetting(key, e) {
      this[key] = e.detail.value
      this.saveSettings()
    },
    saveSettings() {
      try {
        uni.setStorageSync('notification_settings', {
          systemNotify: this.systemNotify,
          soundNotify: this.soundNotify,
          vibrateNotify: this.vibrateNotify
        })
        this.syncToServer()
      } catch (e) {
        console.error('保存通知设置失败:', e)
      }
    },
    syncToServer() {
      uni.request({
        url: '/api/notification/settings',
        method: 'POST',
        data: {
          systemNotify: this.systemNotify,
          soundNotify: this.soundNotify,
          vibrateNotify: this.vibrateNotify
        },
        fail: () => {
          console.log('通知设置同步失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.custom-list {
  background: #fff;
  border-radius: 12rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.list-item {
  padding: 28rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2rpx solid #f5f5f5;
  transition: background 0.2s ease;

  &:active {
    background: #fafafa;
  }

  &:last-child {
    border-bottom: none;
  }
}

.item-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.item-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.item-right {
  display: flex;
  align-items: center;
}

switch {
  transform: scale(0.85);
}
</style>