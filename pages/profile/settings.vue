<template>
  <view class="sub-page" :class="platformClass">
    <DyNavbar title="系统设置" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :placeholder="true" :leftIconColor="fontColor"></DyNavbar>
    <view class="fixed-placeholder"></view>
    
    <view class="custom-list">
      <view class="list-item" @click="changeLanguage">
        <view class="item-left">
          <uni-icons type="language" size="20" color="#007AFF" />
          <text class="item-title">语言设置</text>
        </view>
        <view class="item-right">
          <text class="right-text">{{ language }}</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#ccc" />
        </view>
      </view>

      <view class="list-item" @click="changeTheme">
        <view class="item-left">
          <uni-icons type="paintbrush" size="20" color="#007AFF" />
          <text class="item-title">主题设置</text>
        </view>
        <view class="item-right">
          <text class="right-text">{{ theme }}</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#ccc" />
        </view>
      </view>

      <view class="list-item" @click="clearCache">
        <view class="item-left">
          <uni-icons type="trash" size="20" color="#007AFF" />
          <text class="item-title">清除缓存</text>
        </view>
        <view class="item-right">
          <text class="right-text">{{ cacheSize }}</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#ccc" />
        </view>
      </view>

      <view class="list-item" @click="changeFontSize">
        <view class="item-left">
          <uni-icons type="text" size="20" color="#007AFF" />
          <text class="item-title">字体大小</text>
        </view>
        <view class="item-right">
          <text class="right-text">{{ fontSizeText }}</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#ccc" />
        </view>
      </view>

    </view>

    <!-- 直连设备配置入口 -->
    <view class="custom-list">
      <view class="list-item" @click="enterDirectDevice">
        <view class="item-left">
          <uni-icons type="wifi" size="20" color="#007AFF" />
          <text class="item-title">直连设备配置</text>
        </view>
        <view class="item-right">
          <text class="right-text">{{ directDeviceStatus }}</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#ccc" />
        </view>
      </view>
    </view>

    <!-- 设备连接操作面板 -->
    <app-action-sheet
      :visible="directActionVisible"
      title="设备连接"
      subtitle="已保存配置，请选择要进行的操作"
      :items="directActionItems"
      @select="onDirectActionSelect"
      @close="closeDirectAction"
    />

  </view>
</template>

<script>
import { mapState } from 'vuex'
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'
import AppActionSheet from '@/components/app-action-sheet/app-action-sheet.vue'

export default {
  components: { DyNavbar, AppActionSheet },
  data() {
    return {
      language: '简体中文',
      theme: '默认',
      cacheSize: '0MB',
      fontSize: 1,
      platformClass: "",
      directDeviceConfig: null,
      directActionVisible: false,
      directActionItems: [
        { key: 'monitor', label: '进入监测页', desc: '查看设备实时运行数据', icon: 'eye', primary: true },
        { key: 'config', label: '修改配置', desc: '重新设置设备连接信息', icon: 'gear' }
      ]
    }
  },
  computed: {
    ...mapState({
      headerTabBg: state => state.headerTabBg,
      fontColor: state => state.fontColor
    }),
    fontSizeText() {
      return ['小', '中', '大'][this.fontSize]
    },
    directDeviceStatus() {
      const cfg = this.directDeviceConfig
      if (cfg && cfg.enabled && cfg.ip) {
        return '已启用'
      }
      return 'Modbus TCP'
    }
  },
  onLoad() {
    // 基础库 2.20+ 已废弃 getSystemInfo；此处只需 platform，改为同步读取设备信息
    let devicePlatform = ""
    try {
      if (typeof uni.getDeviceInfo === "function") devicePlatform = (uni.getDeviceInfo() || {}).platform || ""
    } catch (e) { }
        this.platformClass = devicePlatform === "ios" ? "ios-platform" : "android-platform";
  },
  onShow() {
    this.loadSettings()
    this.calculateCacheSize()
    this.loadDirectDeviceConfig()
  },
  onBackPress() {
    if (this.directActionVisible) {
      this.directActionVisible = false
      return true
    }
  },
  methods: {
    loadSettings() {
      try {
        const settings = uni.getStorageSync('app_settings')
        if (settings) {
          this.language = settings.language || '简体中文'
          this.theme = settings.theme || '默认'
          this.fontSize = settings.fontSize !== undefined ? settings.fontSize : 1
        }
      } catch (e) {
        console.error('加载设置失败:', e)
      }
    },
    saveSettings() {
      try {
        uni.setStorageSync('app_settings', {
          language: this.language,
          theme: this.theme,
          fontSize: this.fontSize
        })
      } catch (e) {
        console.error('保存设置失败:', e)
      }
    },
    changeLanguage() {
      uni.showActionSheet({
        itemList: ['简体中文', 'English'],
        success: (res) => {
          this.language = ['简体中文', 'English'][res.tapIndex]
          this.saveSettings()
          uni.showToast({
            title: '语言已切换',
            icon: 'success'
          })
        }
      })
    },
    changeTheme() {
      uni.showActionSheet({
        itemList: ['默认', '深色', '浅色'],
        success: (res) => {
          this.theme = ['默认', '深色', '浅色'][res.tapIndex]
          this.saveSettings()
          this.applyTheme(this.theme)
          uni.showToast({
            title: '主题已切换',
            icon: 'success'
          })
        }
      })
    },
    applyTheme(theme) {
      const themes = {
        '默认': { bg: '#fff', font: '#000', header: '#fff' },
        '深色': { bg: '#1a1a1a', font: '#fff', header: '#2a2a2a' },
        '浅色': { bg: '#f5f7fa', font: '#333', header: '#fff' }
      }
      const selected = themes[theme] || themes['默认']
      
      try {
        this.$store.commit('$uStore', { name: 'bGColor', value: selected.bg })
        this.$store.commit('$uStore', { name: 'fontColor', value: selected.font })
        this.$store.commit('$uStore', { name: 'headerTabBg', value: selected.header })
      } catch (e) {
        console.error('应用主题失败:', e)
      }
    },
    calculateCacheSize() {
      try {
        const info = uni.getStorageInfoSync()
        const size = info.currentSize || 0
        if (size < 1024) {
          this.cacheSize = size + 'KB'
        } else {
          this.cacheSize = (size / 1024).toFixed(1) + 'MB'
        }
      } catch (e) {
        this.cacheSize = '0KB'
        console.error('计算缓存大小失败:', e)
      }
    },
    clearCache() {
      uni.showModal({
        title: '提示',
        content: '确定要清除缓存吗？',
        success: (res) => {
          if (res.confirm) {
            try {
              uni.clearStorageSync()
              this.cacheSize = '0KB'
              uni.showToast({
                title: '缓存已清除',
                icon: 'success'
              })
            } catch (e) {
              console.error('清除缓存失败:', e)
              uni.showToast({
                title: '清除失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },
    changeFontSize() {
      uni.showActionSheet({
        itemList: ['小', '中', '大'],
        success: (res) => {
          this.fontSize = res.tapIndex
          this.saveSettings()
          uni.showToast({
            title: `已设置为${['小', '中', '大'][res.tapIndex]}号字体`,
            icon: 'none'
          })
        }
      })
    },
    navigateTo(url) {
      uni.navigateTo({ url })
    },
    loadDirectDeviceConfig() {
      try {
        const cfg = uni.getStorageSync('direct_device_config')
        this.directDeviceConfig = cfg || null
      } catch (e) {
        this.directDeviceConfig = null
      }
    },
    enterDirectDevice() {
      const cfg = this.directDeviceConfig
      // 未开启或未配置 IP：跳转配置页
      if (!cfg || !cfg.enabled || !cfg.ip) {
        uni.navigateTo({ url: '/pages/profile/direct-device-config' })
        return
      }
      // 弹出选择：进入监测页 / 修改配置
      this.directActionVisible = true
    },
    closeDirectAction() {
      this.directActionVisible = false
    },
    onDirectActionSelect(payload) {
      const index = payload && payload.index
      this.directActionVisible = false
      if (index === 0) {
        uni.navigateTo({ url: '/pages/profile/direct-device' })
      } else if (index === 1) {
        uni.navigateTo({ url: '/pages/profile/direct-device-config' })
      }
    },
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
  gap: 15rpx;
}

.right-text {
  font-size: 28rpx;
  color: #999;
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

.sub-page {
  .fixed-placeholder {
    height: calc(25px + 44px);
  }
  
  &.android-platform {
    .fixed-placeholder { height: calc(25px + 44px + 20px); }
  }
  
  &.ios-platform {
    .fixed-placeholder { height: calc( 44px); 
      background: #fff;
    }
  }
}
</style>