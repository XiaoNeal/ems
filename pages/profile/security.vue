<template>
  <view class="security-container">
    <!-- <uni-nav-bar 
      title="安全设置" 
      left-icon="back"
      :border="false"
      @clickLeft="back"
    /> -->
    <u-navbar title="安全设置" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
      :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>


    <view class="security-content">
      <!-- 带图标的列表项 -->
      <view class="list-item" @click="goto(3)">
        <uni-icons type="locked" size="20" color="#2b9939" />
        <text class="item-title">修改密码</text>
        <uni-icons type="arrowright" size="16" color="#999" />
      </view>

      <view class="divider" />

      <view class="list-item" @click="goToAccountCancellation">
        <uni-icons type="safety" size="20" color="#007AFF" />
        <text class="item-title">账户注销</text>
        <uni-icons type="arrowright" size="16" color="#999" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.security-container {
  background: #f8f8f8;
  min-height: 100vh;
  padding: 20px 15px;
}

.security-content {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.list-item {
  display: flex;
  align-items: center;
  padding: 18px 15px;
  position: relative;

  .item-title {
    flex: 1;
    margin-left: 12px;
    font-size: 15px;
    color: #333;
  }
}

.divider {
  height: 1px;
  background: #f5f5f5;
  margin: 0 15px;
}

/* 优化导航栏样式 */
/deep/ .uni-nav-bar--border {
  border-bottom-width: 0 !important;
}
</style>

<script>
export default {
  methods: {
    back() {
      uni.navigateBack();
    },
    goToAccountCancellation() { //账户注销
      uni.navigateTo({
        url: '/pages-public/account-cancellation/account-cancellation'
      })
    },
    goto(e) {
      // if (this.isAdmin == "admin") {
      //   this.showToast('error', '您无权修改该账号个人信息');
      //   return;
      // }
      let url = '';
      switch (e) {
        case 3:
          url = '/pages-public/userOptions/setUserName?type=3';
          break;
        case 4:
          url = '/pages-public/userOptions/setUserName?type=4';
          break;
        default:
          return;
      }
      uni.navigateTo({
        url: url
      });
    },
    showToast(type, title) {
      this.$refs.uToast.show({
        type: type,
        icon: false,
        title: '失败主题',
        message: title
      });
    }
  }
};
</script>

<style scoped lang="scss">
.security-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.security-content {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.list {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.uni-icons {
  font-size: 16px;
  color: #007AFF;
}
</style>