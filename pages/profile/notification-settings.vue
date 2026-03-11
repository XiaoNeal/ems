<template>
  <view class="sub-page">
    <uni-nav-bar title="通知设置" left-icon="back" @clickLeft="back" />
    <view class="content">
      <view class="uni-list">
        <view class="uni-list-item">
          <text class="uni-list-item-title">接收系统通知</text>
          <switch :checked="systemNotify" @change="toggleSetting('systemNotify', $event)" />
        </view>
        <view class="uni-list-item">
          <text class="uni-list-item-title">消息提醒声音</text>
          <switch :checked="soundNotify" @change="toggleSetting('soundNotify', $event)" />
        </view>
        <view class="uni-list-item">
          <text class="uni-list-item-title">振动提醒</text>
          <switch :checked="vibrateNotify" @change="toggleSetting('vibrateNotify', $event)" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      systemNotify: true,
      soundNotify: true,
      vibrateNotify: false
    }
  },
  onShow() {
    this.loadSettings()
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    loadSettings() {
      uni.getStorage({
        key: 'notification_settings',
        success: res => {
          Object.assign(this, res.data)
        }
      })
    },
    toggleSetting(key, e) {
      this[key] = e.detail.value
      this.saveSettings()
    },
    saveSettings() {
      uni.setStorage({
        key: 'notification_settings',
        data: {
          systemNotify: this.systemNotify,
          soundNotify: this.soundNotify,
          vibrateNotify: this.vibrateNotify
        }
      })
      this.syncToServer()
    },
    syncToServer() {
      uni.request({
        url: '/api/notification/settings',
        method: 'POST',
        data: {
          systemNotify: this.systemNotify,
          soundNotify: this.soundNotify,
          vibrateNotify: this.vibrateNotify
        }
      })
    }
  }
}
</script>

<style scoped>
/* 复用原有样式 */
.uni-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
}
</style>