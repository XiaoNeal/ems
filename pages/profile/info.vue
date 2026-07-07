<template>
  <view class="sub-page" :class="platformClass">
    <DyNavbar title="个人信息" :titleStyle="{ 'color': fontColor, 'width': '100%', 'font-weight': '600' }" :placeholder="true" :leftIconColor="fontColor"></DyNavbar>
    <view class="fixed-placeholder"></view>



    <!-- 功能列表 -->
    <view class="function-section">
      <view class="section-title">账户设置</view>
      <view class="function-list">
        <view class="list-item" @click="goto(1)">
          <view class="item-icon">
            <uni-icons type="contact" size="28" color="#4a8cff" />
          </view>
          <text class="item-label">用户名</text>
          <view class="item-value">
            <text class="value-text">{{ userName || '未设置' }}</text>
            <uni-icons class="arrow-right" type="arrowright" size="24" color="#ccc" />
          </view>
        </view>
        <view class="list-item" @click="goto(2)">
          <view class="item-icon">
            <uni-icons type="phone" size="28" color="#52c41a" />
          </view>
          <text class="item-label">手机号码</text>
          <view class="item-value">
            <text class="value-text">{{ displayPhone }}</text>
            <uni-icons class="arrow-right" type="arrowright" size="24" color="#ccc" />
          </view>
        </view>
        <view class="list-item" @click="goto(3)">
          <view class="item-icon">
            <uni-icons type="email" size="28" color="#fa8c16" />
          </view>
          <text class="item-label">邮箱</text>
          <view class="item-value">
            <text class="value-text">{{ email || '未绑定' }}</text>
            <uni-icons class="arrow-right" type="arrowright" size="24" color="#ccc" />
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <view class="logout-btn" @click="logout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>

  </view>
</template>

<script>
import store from '@/store'
import {
  updateUserInfo
} from "@/api/user.js"
import md5 from "@/utils/md5.min.js"
import { mapState } from 'vuex';
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'

export default {
  components: { DyNavbar },
  data() {
    return {
      setUserName: '',
      setUserPhone: '',
      setUserPassword: '',
      isOK: true,
      oldPassword: '',
      isAdmin: null,
      platformClass: ''
    }
  },
  computed: {
    ...mapState('user', ['userId', 'userName', 'mobile', 'email', 'avatar']),
    displayPhone() {
      return this.mobile || uni.getStorageSync('phone') || '未绑定'
    },
    displayEmail() {
      return this.email || '未绑定'
    },
  },
  onLoad: function (option) {
    this.isAdmin = option.admin
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === "ios" ? "ios-platform" : "android-platform";
      },
    });
  },
  methods: {
    goto(e) {
      uni.navigateTo({
        url: `/pages-public/userOptions/setUserName?type=${e}`
      })
    },
    save() {
      let that = this
      if (!that.isOK) return
      let obj = {
        userId: that.memberId,
        userName: that.setUserName ? that.setUserName : that.userName,
      }
      if (that.setUserPhone != '') {
        obj['Phone'] = that.setUserPhone
      }
      if (that.setUserPassword != '') {
        if (that.oldPassword == '') {
          that.showToast('error', '旧密码不能为空')
          return
        } else {
          obj.oldPassword = md5(that.oldPassword).toString()
          obj.newPassword = md5(that.setUserPassword).toString()
        }
      }
      let formData = JSON.stringify(obj)
      updateUserInfo(formData).then(res => {
        if (res.status == 200) {
          uni.showModal({
            title: '温馨提示',
            content: '修改完成，请点击确定重新登录',
            showCancel: false,
            success(response) {
              if (response.confirm) {
                uni.navigateBack()
                that.$u.vuex('currentTemplate', 0);
              }
            }
          })
        } else if (res.status == 500 && res.msg == '原密码不正确') {
          that.showToast('error', res.msg)
        }
      })
    },
    changeAvatar() {
      let that = this
      const userId = this.$store.state.userInfo?.userId || this.$store.state.user?.id || ''
      const token = this.$store.state.token || this.$store.state.user?.token || ''
      if (!userId) {
        uni.showToast({
          title: '用户信息未加载',
          icon: 'none'
        })
        return
      }
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const tempFilePaths = res.tempFilePaths
          uni.uploadFile({
            url: 'https://iems.nelic.com/SsoServer/es/upload/imageByCodeId',
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              CodeId: userId
            },
            header: {
              'Content-Type': 'multipart/form-data',
              token: token
            },
            success: (res) => {
              try {
                const data = JSON.parse(res.data)
                if (data.code === 200) {
                  that.$store.commit('UPDATE_USER', { avatar: data.data.imageUrl })
                  uni.setStorageSync('userInfo', { ...that.$store.state.user, avatar: data.data.imageUrl })
                  uni.showToast({
                    title: '上传成功',
                    icon: 'success'
                  })
                } else {
                  uni.showToast({
                    title: data.msg || '上传失败',
                    icon: 'none'
                  })
                }
              } catch (e) {
                uni.showToast({
                  title: '解析失败',
                  icon: 'none'
                })
              }
            }
          })
        }
      })
    },
    showToast(type, title) {
      this.$refs.uToast.show({
        type: type,
        icon: false,
        message: title
      })
    },
    async logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: async (res) => {
          if (res.confirm) {
            await this.$store.dispatch('user/logout');
            uni.reLaunch({
              url: '/pages/login/login'
            });
          }
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.sub-page {
  min-height: 100vh;
  background: #f5f6f8;

  &.android-platform {
    .fixed-placeholder { height: calc(25px + 44px + 20px); }
  }
  &.ios-platform {
    .fixed-placeholder { height: calc( 44px); 
      background: #fff;
    }
  }
}

/* 功能区域 */
.function-section {
  padding: 24rpx 32rpx 0;
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #999;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
}

.function-list {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
}

.list-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-bottom: 2rpx solid #f5f6f7;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #fafbfc;
  }
}

.item-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.item-label {
  flex: 1;
  font-size: 30rpx;
  color: #1a1a1a;
  font-weight: 500;
}

.item-value {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.value-text {
  font-size: 28rpx;
  color: #999;
}

.arrow-right {
  flex-shrink: 0;
  transition: all 0.2s ease;

  .list-item:active & {
    color: #4a8cff;
    transform: translateX(4rpx);
  }
}

/* 退出登录 */
.logout-section {
  padding: 48rpx 32rpx;
  padding-bottom: calc(60rpx + env(safe-area-inset-bottom));
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  background: #fff;
  border-radius: 8rpx;
  text-align: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  border: 2rpx solid #f0f0f0;
  transition: all 0.3s ease;

  &:active {
    background: #f8fafc;
    transform: scale(0.99);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  }
}

.logout-btn .logout-text {
  font-size: 30rpx;
  color: #999;
  font-weight: 500;
}
</style>