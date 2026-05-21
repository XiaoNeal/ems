<template>
  <view class="container">
    <!-- 头部区域 - 包含安全区域占位和标题栏 -->
    <view class="header">
      <view class="header-safe-area"></view>
      <view class="header-content">
        <view class="header-left">
          <image v-if="currentTab === 0" src="/static/images/logo.png" class="header-icon"></image>
          <text class="title">{{ currentTitle }}</text>
        </view>
        <!-- 返回按钮 - 从设备列表进入时显示 -->
        <view v-if="showBackBtn" class="back-btn" @click="goBackToList">
          <uni-icons type="back" size="28" color="#333"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y enable-back-to-top @scrolltolower="tabbarPageScrollLower"
      :scroll-top="scrollTop" ref="contentScroll" :bounces="false" @scroll="onScroll">
      <view class="content-pages">
        <!-- 设备列表页面 -->
        <view v-if="showDeviceList" class="page-item device-list-page">
          <DeviceList ref="deviceList" @selectDevice="handleDeviceSelect"></DeviceList>
        </view>
        
        <!-- 监测页面 -->
        <view v-else-if="currentTab === 0" class="page-item">
          <Monitor ref="monitor"></Monitor>
        </view>
        
        <!-- 系统页面 -->
        <view v-else-if="currentTab === 1" class="page-item">
          <System ref="system"></System>
        </view>
        
        <!-- 个人中心 -->
        <view v-else class="page-item">
          <Profile ref="profile"></Profile>
        </view>
      </view>
    </scroll-view>

    <!-- 底部TabBar -->
    <view class="tab-bar-container">
      <view class="tab-bar">
        <!-- 监测Tab - 始终显示 -->
        <view class="tab-item" :class="{ 'active': currentTab === 0 }" @click="switchTab(0)">
          <view class="tab-icon">
            <image :src="currentTab === 0 ? activeIcons[0] : inactiveIcons[0]" mode="widthFix" />
          </view>
          <text class="tab-text">监测</text>
        </view>
        <!-- 系统Tab - 选择设备后才显示 -->
        <view v-if="selectedDeviceId" class="tab-item" :class="{ 'active': currentTab === 1 }" @click="switchTab(1)">
          <view class="tab-icon">
            <image :src="currentTab === 1 ? activeIcons[1] : inactiveIcons[1]" mode="widthFix" />
          </view>
          <text class="tab-text">系统</text>
        </view>
        <!-- 我的Tab - 始终显示 -->
        <view class="tab-item" :class="{ 'active': currentTab === 2 }" @click="switchTab(2)">
          <view class="tab-icon">
            <image :src="currentTab === 2 ? activeIcons[2] : inactiveIcons[2]" mode="widthFix" />
          </view>
          <text class="tab-text">我的</text>
        </view>
      </view>
      <view class="safe-area-bottom"></view>
    </view>
  </view>
</template>

<script>
import Monitor from '../monitor.vue'
import Profile from '../profile.vue'
import System from '../system.vue'
import DeviceList from '../components/device-list.vue'
import { findUserInfoByCodeId } from '@/api/user'

export default {
  components: {
    Monitor,
    Profile,
    System,
    DeviceList
  },
  computed: {
    // 获取 esIds 数组
    esIds() {
      if (this.userInfo && this.userInfo.esIds) {
        return Array.isArray(this.userInfo.esIds) ? this.userInfo.esIds : []
      }
      return []
    },
    
    // 是否显示设备列表
    showDeviceList() {
      return this.esIds.length === 0 || (this.esIds.length >= 2 && !this.selectedDeviceId) || this.fromProfile
    },
    
    // 是否显示返回按钮
    showBackBtn() {
      return this.showDeviceList && this.selectedDeviceId !== null
    },
    
    // 当前页面标题
    currentTitle() {
        if (this.currentTab === 0) {
          return '光储直柔能源站EMS'
        } else if (this.currentTab === 1) {
          return '系统管理'
        } else if (this.currentTab === 2) {
          return '我的'
        }
      return '光储直柔能源站EMS'
    }
  },
  data() {
    return {
      tabs: ['监测', '系统', '我的'],
      currentTab: 0,
      activeColor: '#007aff',
      inactiveColor: '#8a8a8a',
      activeIcons: {
        0: require('../../community/static/images/monitor-active.png'),
        1: require('../../community/static/images/系统-pre.png'),
        2: require('../../community/static/images/mine-active.png')
      },
      inactiveIcons: {
        0: require('../../community/static/images/monitor.png'),
        1: require('../../community/static/images/系统-nor.png'),
        2: require('../../community/static/images/mine.png')
      },
      scrollPositions: { 0: 0, 1: 0, 2: 0 },
      scrollTop: 0,
      realScrollTop: 0,
      selectedDeviceId: null,
      fromProfile: false,
      isDeviceListLoaded: false,
      deviceListLoading: false
    }
  },
  mounted() {
    console.log('onMounted----------------------------------------------------------',this.selectedDeviceId)
    this.checkLoginStatus()
  },
  onLoad(options) {
    if (options.esId) {
      this.handleDeviceSelect(options.esId)
    }
    this.checkFromProfile()
  },
  onShow() {
    this.checkFromProfile()
  },
  onReady() {
    this.scrollToTop()
  },
  methods: {
    checkFromProfile() {
      const fromProfile = uni.getStorageSync('fromProfile')
      if (fromProfile === 'true') {
        console.log('从profile跳转过来')
        this.selectedDeviceId = null
        this.fromProfile = true
        uni.removeStorageSync('fromProfile')
        if (!this.isDeviceListLoaded) {
          this.fetchDeviceList()
        }
      }
    },
    checkLoginStatus() {
      console.log('checkLoginStatus', this.userInfo)

      if (!this.userInfo || !this.userInfo.isLogin) {
        uni.redirectTo({
          url: '/pages/login/login'
        })
        return
      }

      if (!this.isDeviceListLoaded && !this.deviceListLoading) {
        this.fetchDeviceList()
      }
    },

    // 获取设备列表 - 优化：只在首次加载或从profile跳转时调用
    async fetchDeviceList() {
      if (this.deviceListLoading) return
      this.deviceListLoading = true
      
      try {
        const userId = this.userInfo.userId
        const res = await findUserInfoByCodeId(userId)
        console.log('获取设备列表:', res)

        let energyStations = []
        if (res.code === 200 && res.data) {
          energyStations = res.data.energyStations || []
        }

        const userInfo = { ...this.userInfo }
        userInfo.esIds = energyStations
        this.$store.commit('SET_LOGIN', userInfo)

        // 如果只有一个设备，自动选中
        if (energyStations.length === 1) {
          this.selectedDeviceId = energyStations[0]
          this.$store.commit('changePowerStationId', energyStations[0])
          uni.setStorageSync('currentEsId', energyStations[0])
        }
        
        this.isDeviceListLoaded = true
      } catch (error) {
        console.error('获取设备列表失败:', error)
      } finally {
        this.deviceListLoading = false
      }
    },
    
    // 处理设备选择
    handleDeviceSelect(esId) {
      this.selectedDeviceId = esId
      this.fromProfile = false
      this.$store.commit('changePowerStationId', esId)
      uni.setStorageSync('currentEsId', esId)
    },
    
    // 返回设备列表
    goBackToList() {
      this.selectedDeviceId = null
      this.$store.commit('changePowerStationId', undefined)
      uni.removeStorageSync('currentEsId')
    },
    
    onScroll(e) {
      this.realScrollTop = e.detail.scrollTop
    },
    
    // 优化：简化tab切换逻辑
    switchTab(index) {
      // 系统Tab未显示时，不允许切换到系统Tab
      if (index === 1 && !this.selectedDeviceId) {
        return
      }
      
      // 如果已经在当前tab，不执行任何操作
      if (this.currentTab === index) {
        return
      }
      
      // 记录当前滚动位置
      this.scrollPositions[this.currentTab] = this.realScrollTop
      
      // 切换tab
      this.currentTab = index
      
      // 滚动到顶部
      this.scrollToTop()
    },
    
    // 优化：简化滚动到顶部操作
    scrollToTop() {
      this.$nextTick(() => {
        this.scrollTop = 0
        this.$refs.contentScroll?.scrollTo({ top: 0, duration: 100 })
      })
    },
    
    getIconType(index) {
      const icons = ['list', 'bar-chart', 'file-text', 'settings', 'user'];
      return icons[index];
    },
    
    tabbarPageScrollLower() {
      const currentRef = ['monitor', 'system', 'profile'][this.currentTab];
      this.$refs[currentRef]?.loadMore?.();
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  background-color: #EFF4FB;
  overflow: hidden;
}

.container {
  width: 100%;
  height: 100vh;
  background-color: #EFF4FB;
  overflow: hidden;
  position: relative;
}

/* 头部 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #fff;
}

.header-safe-area {
  height: var(--status-bar-height);
  background-color: #fff;
}

.header-content {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.back-btn {
  padding: 8px;
  margin-left: -8px;
}

.header-icon {
  width: 30px;
  height: 17px;
  margin-right: 8px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 内容区域 */
.content-scroll {
  position: fixed;
  left: 0;
  right: 0;
  top: calc(var(--status-bar-height) + 44px);
  bottom: calc(50px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

.content-pages {
  width: 100%;
}

.page-item {
  width: 100%;
  min-height: 100%;
}

/* 底部TabBar */
.tab-bar-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: #fff;
}

.tab-bar {
  height: 50px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
}

.tab-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
}

.tab-icon image {
  width: 100%;
  height: 100%;
}

.tab-text {
  font-size: 10px;
  color: #8a8a8a;
}

.active .tab-text {
  color: #007aff;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
  background-color: #fff;
}
</style>
