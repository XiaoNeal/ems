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
        <view v-if="currentTab === 0 && showDeviceList" class="page-item">
          <DeviceList ref="deviceList" @selectDevice="handleDeviceSelect"></DeviceList>
        </view>
        
        <!-- 监测页面 -->
        <view v-if="currentTab === 0 && !showDeviceList" class="page-item">
          <Monitor ref="monitor"></Monitor>
        </view>
        
        <!-- 系统页面 -->
        <view v-if="currentTab === 1" class="page-item">
          <System ref="system"></System>
        </view>
        
        <!-- 个人中心 -->
        <view v-if="currentTab === 2" class="page-item">
          <Profile ref="profile"></Profile>
        </view>
      </view>
    </scroll-view>

    <!-- 底部TabBar -->
    <view class="tab-bar-container">
      <view class="tab-bar">
        <view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ 'active': currentTab === index }"
          @click="switchTab(index)">
          <view class="tab-icon">
            <image :src="currentTab === index ? activeIcons[index] : inactiveIcons[index]" mode="widthFix" />
          </view>
          <text class="tab-text">{{ tab }}</text>
        </view>
      </view>
      <view class="safe-area-bottom"></view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
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
    ...mapState(['userInfo']),
    
    // 获取 esIds 数组
    esIds() {
      if (this.userInfo && this.userInfo.esIds) {
        return Array.isArray(this.userInfo.esIds) ? this.userInfo.esIds : []
      }
      return []
    },
    
    // 是否显示设备列表
    showDeviceList() {
      // 如果设备数量为0，显示设备列表；如果设备数量>=2且未选择设备，也显示设备列表；如果从profile跳转过来，也显示设备列表
      return this.esIds.length === 0 || (this.esIds.length >= 2 && !this.selectedDeviceId) || this.fromProfile
    },
    
    // 是否显示返回按钮
    showBackBtn() {
      // 从设备列表选择设备后显示返回按钮
      return this.showDeviceList && this.selectedDeviceId !== null
    },
    
    // 当前页面标题
    currentTitle() {
      // if (this.showBackBtn && this.selectedDeviceId) {
      //   const station = this.$store.state.powerStationNames.find(s => s.esId === Number(this.selectedDeviceId))
      //   const stationName = station ? station.name : '设备'
      //   console.log('stationName', stationName,this.currentTab )
      
      // }

        // 根据当前 tab 显示不同标题
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
      fromProfile: false
    }
  },
  mounted() {
    console.log('onMounted----------------------------------------------------------')
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
    this.forceScrollToTop()
  },
  methods: {
    checkFromProfile() {
      const fromProfile = uni.getStorageSync('fromProfile')
      if (fromProfile === 'true') {
        this.selectedDeviceId = null
        this.fromProfile = true
        uni.removeStorageSync('fromProfile')
      }
    },
    checkLoginStatus() {
      console.log('checkLoginStatus', this.userInfo)

      // 检查登录状态，使用 userInfo 判断
      if (!this.userInfo || !this.userInfo.isLogin) {
        // 未登录，跳转到登录页面
        uni.redirectTo({
          url: '/pages/login/login'
        })
        return
      }

      // 已登录，调用接口获取设备列表
      if (this.fromProfile) {
        this.fetchDeviceListWithoutAutoSelect()
      } else {
        this.fetchDeviceList()
      }
    },

    async fetchDeviceListWithoutAutoSelect() {
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

        this.selectedDeviceId = null
      } catch (error) {
        console.error('获取设备列表失败:', error)
      }
    },

    // 获取设备列表
    async fetchDeviceList() {
      try {
        const userId = this.userInfo.userId
        const res = await findUserInfoByCodeId(userId)
        console.log('获取设备列表:', res)

        let energyStations = []
        if (res.code === 200 && res.data) {
          energyStations = res.data.energyStations || []
        }

        // 更新 store 中的设备列表
        const userInfo = { ...this.userInfo }
        userInfo.esIds = energyStations
        this.$store.commit('SET_LOGIN', userInfo)

        // 根据设备数量决定显示内容
        if (energyStations.length === 1) {
          // 只有一个设备，直接选中并显示监测页面
          this.selectedDeviceId = energyStations[0]
          this.$store.commit('changePowerStationId', energyStations[0])
          uni.setStorageSync('currentEsId', energyStations[0])
        } else {
          // 0个或多个设备，显示设备列表
          this.selectedDeviceId = null
        }
      } catch (error) {
        console.error('获取设备列表失败:', error)
        // 获取失败时，保持原有逻辑
      }
    },
    
    // 处理设备选择
    handleDeviceSelect(esId) {
      this.selectedDeviceId = esId
      this.fromProfile = false
      // 设置当前选中的设备ID到全局状态
      this.$store.commit('changePowerStationId', esId)
      uni.setStorageSync('currentEsId', esId)
      // 触发监测页面刷新
      this.$nextTick(() => {
        this.$refs.monitor?.refresh?.()
      })
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
    switchTab(index) {
      if (this.currentTab === index) return;
      this.currentTab = index;
      this.forceScrollToTop()
      // 切换到监测页时，刷新设备列表
      if (index === 0) {
        this.fetchDeviceList()
      }
    },
    forceScrollToTop() {
      this.scrollTop = this.realScrollTop
      this.$nextTick(() => {
        this.scrollTop = 0
        this.$refs.contentScroll?.scrollTo({ top: 0, duration: 0 })
      })
    },
    getIconType(index) {
      const icons = ['list', 'bar-chart', 'file-text', 'settings', 'user'];
      return icons[index];
    },
    tabbarPageScrollLower() {
      const currentRef = ['monitor', 'analysis', 'report', 'system', 'profile'][this.currentTab];
      this.$refs[currentRef]?.loadMore?.();
    },
    refreshData() {
      uni.showLoading({ title: '刷新中...' });
      try {
        const currentRef = ['monitor', 'analysis', 'report', 'system', 'profile'][this.currentTab];
        const currentComponent = this.$refs[currentRef];
        if (currentComponent && currentComponent.refresh) currentComponent.refresh();

        ['monitor', 'system', 'profile'].forEach(refName => {
          const component = this.$refs[refName];
          if (component && component.refresh && refName !== currentRef) component.refresh();
        });

        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: '刷新成功', icon: 'success', duration: 1500 });
        }, 500);
      } catch (error) {
        console.error('刷新失败:', error);
        uni.hideLoading();
        uni.showToast({ title: '刷新失败', icon: 'error' });
      }
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
  margin-top:20px
}

/* 头部 – 对齐微信导航栏 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #fff;
    margin-top:20px
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

/* 刷新按钮垂直居中对齐 */
.chart-actions {
  display: flex;
  align-items: center;
}

.refresh-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
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
  margin-top: 20px;
}

.page-item {
  width: 100%;
  min-height: 100%;
  animation: fadeIn 0.2s ease-out;
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>