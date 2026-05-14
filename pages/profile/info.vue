<template>
  <view  class="sub-page">
    <u-navbar title="个人信息" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
      :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>

<!-- 
      <u-navbar title="系统设置" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
      :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar> -->

    <!-- 个人信息模块 -->
    <view class="custom-list">
      <view class="list-item" @click="changeAvatar">
        <view class="item-left">
          <uni-icons type="user" size="24" color="#666" />
          <text class="item-title">个人头像</text>
        </view>
        <view class="item-right">
          <image :src="avatar || '/static/logo_n.png'" mode="aspectFill" class="avatar-img"></image>
          <uni-icons type="arrowright" size="18" color="#bbb" />
        </view>
      </view>
      <view class="list-item" @click="goto(1)">
        <view class="item-left">
          <uni-icons type="contact" size="24" color="#666" />
          <text class="item-title">用户名</text>
        </view>
        <view class="item-right">
          <text class="right-text">{{ userName || '-' }}</text>
          <uni-icons type="arrowright" size="18" color="#bbb" />
        </view>
      </view>
      <view class="list-item" @click="goto(2)">
        <view class="item-left">
          <uni-icons type="phone" size="24" color="#666" />
          <text class="item-title">手机号码</text>
        </view>
        <view class="item-right">
          <text class="right-text">{{ phone || '-' }}</text>
          <uni-icons type="arrowright" size="18" color="#bbb" />
        </view>
      </view>
      <view class="list-item" @click="goto(3)">
        <view class="item-left">
          <uni-icons type="mail" size="24" color="#666" />
          <text class="item-title">邮箱</text>
        </view>
        <view class="item-right">
          <text class="right-text">{{ email || '-' }}</text>
          <uni-icons type="arrowright" size="18" color="#bbb" />
        </view>
      </view>
    </view>

    <view class="logout-wrapper">
      <view class="logout-item" @click="logout">
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

export default {
  data() {
    return {
      setUserName: '',
      setUserPhone: '',
      setUserPassword: '',
      isOK: true,
      oldPassword: '',
      isAdmin: null
    }
  },
  computed: {
    ...mapState('user', ['userId', 'userName', 'phone', 'email', 'avatar']),
  },
  onLoad: function (option) {
    this.isAdmin = option.admin
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
  background: #f5f5f5;
  min-height: 100vh;
}

.custom-list {
  background: #fff;
  margin: 15px;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx;
  border-bottom: 1rpx solid #f5f6f7;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #fafafa;
  }
}

.item-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.item-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.right-text {
  font-size: 30rpx;
  color: #666;
}

.avatar-img {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #f5f5f5;
  border: 3rpx solid #eee;
}

.logout-wrapper {
  padding: 0 24rpx;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
}

.logout-item {
  background: linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%);
  text-align: center;
  padding: 28rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(255, 68, 68, 0.1);
  border: 2rpx solid rgba(255, 68, 68, 0.1);
  transition: all 0.25s ease;

  &:active {
    background: linear-gradient(135deg, #ffeaea 0%, #ffd5d5 100%);
    transform: scale(0.98);
  }
}

.logout-text {
  font-size: 32rpx;
  color: #ff4444;
  font-weight: 500;
}
</style>