<template>
  <view class="sub-page">
    <!-- <uni-nav-bar title="帮助与反馈" left-icon="back" @clickLeft="back" /> -->
    <u-navbar title="帮助与反馈" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
      :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>
    <view class="help-container">
      <view class="menu-card">
        <view class="menu-item" v-for="item in menuItems" :key="item.title" @click="handleMenuClick(item)">
          <view class="item-left">
            <uni-icons :type="item.icon" size="24" :color="item.color" />
            <text class="item-title">{{ item.title }}</text>
          </view>
          <uni-icons type="forward" size="20" color="#999" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        {
          title: '常见问题',
          icon: 'help',
          color: '#3399ff',
          handler: () => this.navigateTo('/pages/profile/faq')
        },
        {
          title: '意见反馈',
          icon: 'compose',
          color: '#ff9900',
          handler: () => this.openFeedback()
        },
        {
          title: '联系我们',
          icon: 'phone',
          color: '#52c41a',
          handler: () => this.contactUs()
        }
      ]
    }
  },
  methods: {
    handleMenuClick(item) {
      item.handler()
    },
    navigateTo(path) {
      uni.navigateTo({ url: path })
    },
    openFeedback() {
      // 反馈逻辑
    },
    contactUs() {
      uni.makePhoneCall({ phoneNumber: '400-123-4567' })
    },
    back() {
      uni.navigateBack()
    },
    navigateTo(url) {
      uni.navigateTo({
        url: url
      });
    },
    openFeedback() {
      uni.showModal({
        title: '意见反馈',
        content: '请描述您遇到的问题或建议',
        editable: true,
        placeholderText: '请输入您的反馈内容',
        success: (res) => {
          if (res.confirm) {
            this.submitFeedback(res.content)
          }
        }
      });
    },
    submitFeedback(content) {
      uni.showLoading({
        title: '提交中...'
      });
      // 这里可以调用API提交反馈
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        });
      }, 1000);
    },
    contactUs() {
      uni.makePhoneCall({
        phoneNumber: '400-123-4567'
      });
    }
  }
}
</script>

<style scoped lang="scss">
.help-container {
  padding: 30rpx;

  .menu-card {
    background: #fff;
    border-radius: 24rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);

    .menu-item {
      padding: 32rpx 40rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2rpx solid #f5f5f5;
      transition: all 0.2s ease;

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background-color: #f8f8f8;
      }

      .item-left {
        display: flex;
        align-items: center;
        gap: 24rpx;
      }

      .item-title {
        font-size: 30rpx;
        color: #333;
        font-weight: 500;
      }
    }
  }
}
</style>