<template>
  <view class="container">
    <!-- 头部区域 - 包含安全区域占位和标题栏 -->
    <view class="header">
      <view class="header-safe-area"></view>
      <view class="header-content">
        <view class="header-left">
          <image v-if="currentTab === 0" src="./static/images/logo.png" class="header-icon"></image>
          <text class="title">光储直柔能源站EMS</text>
        </view>
        <view class="chart-actions">
          <button class="refresh-btn" @click="refreshData" hover-class="btn-hover">
            <uni-icons type="refresh" size="24" color="#666"></uni-icons>
          </button>
        </view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view
      class="content-scroll"
      scroll-y
      enable-back-to-top
      @scrolltolower="tabbarPageScrollLower"
      :scroll-top="scrollTop"
      ref="contentScroll"
      :bounces="false"
      @scroll="onScroll"
    >
      <view class="content-pages">
        <view v-if="currentTab === 0" class="page-item">
          <Monitor ref="monitor"></Monitor>
        </view>
        <view v-if="currentTab === 1" class="page-item">
          <System ref="system"></System>
        </view>
        <view v-if="currentTab === 2" class="page-item">
          <Profile ref="profile"></Profile>
        </view>
      </view>
    </scroll-view>

    <!-- 底部TabBar -->
    <view class="tab-bar-container">
      <view class="tab-bar">
        <view v-for="(tab, index) in tabs" :key="index" class="tab-item"
          :class="{ 'active': currentTab === index }" @click="switchTab(index)">
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
import Monitor from './monitor.vue'
import Profile from './profile.vue'
import System from './system.vue'

export default {
  components: {
    Monitor,
    Profile,
    System
  },
  data() {
    return {
      tabs: ['监测', '系统', '我的'],
      currentTab: 0,
      activeColor: '#007aff',
      inactiveColor: '#8a8a8a',
      activeIcons: {
        0: require('./static/images/monitor-active.png'),
        1: require('./static/images/系统-pre.png'),
        2: require('./static/images/mine-active.png')
      },
      inactiveIcons: {
        0: require('./static/images/monitor.png'),
        1: require('./static/images/系统-nor.png'),
        2: require('./static/images/mine.png')
      },
      scrollPositions: { 0: 0, 1: 0, 2: 0 },
      scrollTop: 0,
      realScrollTop: 0,
    }
  },
  onReady() {
    this.forceScrollToTop()
  },
  methods: {
    onScroll(e) {
      this.realScrollTop = e.detail.scrollTop
    },
    switchTab(index) {
      if (this.currentTab === index) return;
      this.currentTab = index;
      this.forceScrollToTop()
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
  background-color: #f5f5f5;
  overflow: hidden;
}

.container {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
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
  position: absolute;
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
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>