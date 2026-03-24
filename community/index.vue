<template>
  <view class="container">
    <!-- 头部区域 - 包含安全区域占位和标题栏 -->


    <view class="header">
      <view class="header-safe-area"></view>
      <view class="header-content">
        <view class="header-left">
          <image v-if="currentTab === 0" src="./static/images/logo.png" class="header-icon"></image>
          <text class="title">
            光储直柔能源站EMS
          </text>
        </view>
        <view class="chart-actions">
          <button class="refresh-btn" @click="refreshData" hover-class="btn-hover">
            <uni-icons type="refresh" size="24" color="#666"></uni-icons>
          </button>
        </view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y enable-back-to-top @scrolltolower="tabbarPageScrollLower"
      :scroll-top="scrollTop" ref="contentScroll">
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
    <view class="tab-bar">
      <view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ 'active': currentTab === index }"
        @click="switchTab(index)">
        <view class="tab-icon">

          <image :src="currentTab === index ? activeIcons[index] : inactiveIcons[index]" mode="widthFix" />
        </view>
        <text class="tab-text">{{ tab }}</text>
      </view>
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
        1: require('./static/images/mine-active.png'),
        2: require('./static/images/mine-active.png')
      },
      inactiveIcons: {
        0: require('./static/images/monitor.png'),
        1: require('./static/images/mine.png'),
        2: require('./static/images/mine.png')
      },
      scrollPositions: { 0: 0, 1: 0, 2: 0 },
      scrollTop: 0,
    }
  },
  methods: {
    switchTab(index) {
      if (this.currentTab === index) return;

      // 重置scrollTop触发滚动
      this.scrollTop = Math.random();

      // 切换tab
      this.currentTab = index;

      // 确保滚动到顶部
      this.$nextTick(() => {
        this.scrollTop = 0;
        if (this.$refs.contentScroll && this.$refs.contentScroll.scrollTo) {
          this.$refs.contentScroll.scrollTo({ top: 0, duration: 0 });
        }
      });
    },
    getIconType(index) {
      const icons = ['list', 'bar-chart', 'file-text', 'settings', 'user'];
      return icons[index];
    },
    tabbarPageScrollLower() {
      // 加载更多逻辑
      const currentRef = ['monitor', 'analysis', 'report', 'system', 'profile'][this.currentTab];
      this.$refs[currentRef]?.loadMore?.();
    },

    // 刷新数据方法
    refreshData() {
      // 显示加载提示
      uni.showLoading({
        title: '刷新中...'
      });

      try {
        // 通知当前活跃的子组件进行刷新
        const currentRef = ['monitor', 'analysis', 'report', 'system', 'profile'][this.currentTab];
        const currentComponent = this.$refs[currentRef];

        if (currentComponent && currentComponent.refresh) {
          currentComponent.refresh();
        } else {
          console.log(`当前组件${currentRef}未实现refresh方法`);
        }

        // 刷新所有子组件（可选，根据需求决定）
        ['monitor', 'system', 'profile'].forEach(refName => {
          const component = this.$refs[refName];
          if (component && component.refresh && refName !== currentRef) {
            component.refresh();
          }
        });

        // 刷新成功后隐藏加载提示
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: '刷新成功',
            icon: 'success',
            duration: 1500
          });
        }, 500);
      } catch (error) {
        console.error('刷新失败:', error);
        uni.hideLoading();
        uni.showToast({
          title: '刷新失败',
          icon: 'error',
          duration: 1500
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 基础布局 */
.container {
  width: 100%;
  // display: flex;
  // flex-direction: column;
  background-color: #f5f5f5;
  // overflow: hidden;
  overflow: hidden;
  height: 100%;
}

/* 头部区域 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #fff;
}

/* 安全区域占位容器 */
.header-safe-area {
  height: 50px;
  background-color: #fff;
}

/* 标题栏内容 */
.header-content {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.header-icon {
  width: 30px;
  height: 17px;
  margin: 0 8px;
}



.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-left: 8px;
}

/* 内容滚动区域 */
.content-scroll {
  margin-top: calc(50px + 44px);
  height: calc(100vh - 50px - 44px - 50px);
  margin-bottom: 50px;
  box-sizing: border-box;
}

.content-pages {
  width: 100%;
}

.page-item {
  width: 100%;
  min-height: 100%;
}

/* 底部TabBar */
.tab-bar {
  height: 50px;
  background-color: #fff;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/* Tab项样式 */
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

/* 选中状态 */
.active .tab-text {
  color: #007aff;
}

.active .tab-icon uni-icons {
  color: #007aff;
}

/* 页面切换动画 */
.page-item {
  animation: fadeIn 0.2s ease-out;
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

.chart-actions {
  margin-right: 8px;

  .refresh-btn {
    width: 50rpx;
    height: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
}
</style>