<template>
  <view class="faq-container" :class="platformClass">
    <DyNavbar title="常见问题" :titleStyle="{ color: fontColor }" :leftIconColor="fontColor"></DyNavbar>
    <view class="fixed-placeholder"></view>

    <view class="question-list">
      <view 
        v-for="(item, index) in faqList" 
        :key="index" 
        class="question-item"
        @click="toggleAnswer(index)">
        <view class="question-header">
          <text class="question-title">{{ item.question }}</text>
          <uni-icons 
            :type="activeIndex === index ? 'arrowdown' : 'arrowright'" 
            size="18" 
            color="#666"/>
        </view>
        
        <view 
          class="answer-content"
          :class="{ active: activeIndex === index }">
          {{ item.answer }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'

export default {
  components: { DyNavbar },
  data() {
    return {
      activeIndex: -1,
      platformClass: '',
      faqList: [
        {
          question: '如何重置密码？',
          answer: '登录页面点击"忘记密码"，按指引完成验证后即可重置。'
        },
        {
          question: '如何查看电站数据？',
          answer: '进入电站详情页面，在实时监测模块可查看各项数据。'
        },
        {
          question: '设备离线如何处理？',
          answer: '1. 检查设备网络连接\n2. 重启设备\n3. 联系技术支持'
        }
      ]
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === "ios" ? "ios-platform" : "android-platform";
      },
    });
  },
  methods: {
    toggleAnswer(index) {
      this.activeIndex = this.activeIndex === index ? -1 : index
    }
  }
}
</script>

<style lang="scss" scoped>
.faq-container {
  padding: 20rpx 30rpx;

  &.android-platform {
    .fixed-placeholder { height: calc(25px + 44px + 20px); }
  }
  &.ios-platform {
    .fixed-placeholder { height: calc( 44px); 
      background: #fff;
    }
  }
  
  .question-list {
    background: #fff;
    border-radius: 16rpx;
    padding: 0 24rpx;
  }

  .question-item {
    padding: 28rpx 0;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .question-title {
    font-size: 30rpx;
    color: #333;
    flex: 1;
  }

  .answer-content {
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
    font-size: 28rpx;
    color: #666;
    padding-left: 20rpx;
    margin-top: 10rpx;

    &.active {
      max-height: 300rpx;
      padding: 20rpx 0 10rpx 20rpx;
    }
  }
}
</style>