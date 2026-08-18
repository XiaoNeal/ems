<template>
  <view class="profile-container">
    <!-- 头部信息 -->
    <!-- <view class="profile-header">
      <view class="header-bg">
        <view class="gradient-overlay" />
      </view>
      <view class="flex-container">
        <view class="avatar-container" style="flex-shrink: 0; margin-right: 20rpx">
          <image :src="user.avatar || '/static/logo_n.png'" class="avatar-image" mode="aspectFill" />
        </view>
        <view class="user-info-box" style="flex-grow: 1">
          <view class="name-line">
            <text class="user-name">{{ user.userName }}</text>
            
          </view>
        </view>
      </view>
    </view> -->

    <view class="user-info" @click="navigateToU('/pages/profile/info')">
      <image class="avatar" :src="user.avatar && user.avatar.trim() ? user.avatar : '/static/logo_n.png'"></image>
      <view class="item-title">
        <view class="user-name">{{ user.userName }}</view>
        <view class="phone">
          {{ user.mobile ? user.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '' }}
        </view>
      </view>
      <!-- <view > -->
      <uni-icons class="arrow-icon" type="arrowright" size="24" color="#999"></uni-icons>
      <!-- </view> -->

    </view>




    <!-- 功能列表 -->
    <view class="function-list">
      <!-- <view class="list-item" @click="navigateToU('/pages/profile/info')">
        <view class="item-content">
          <uni-icons type="person" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">个人信息</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#999"></uni-icons>
        </view>
      </view> -->
      <view class="list-item" @click="navigateToDeviceList">
        <view class="item-content">
          <uni-icons type="list" size="20" color="#007AFF"></uni-icons>
          <view class="item-title-wrapper">
            <text class="item-title">设备列表</text>
            <view v-if="currentDeviceName" class="title-divider"></view>
            <text v-if="currentDeviceName" class="device-name">{{ currentDeviceName }}</text>
          </view>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#999"></uni-icons>
        </view>
      </view>
      <!-- <view class="list-item" @click="navigateToU('/pages/profile/notifications')">
        <view class="item-content">
          <uni-icons type="notification" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">消息通知</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#999"></uni-icons>
        </view>
      </view> -->




      <view class="list-item" @click="navigateToU('/pages/profile/security')">
        <view class="item-content">
          <uni-icons type="locked" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">安全设置</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#999"></uni-icons>
        </view>
      </view>
      <view v-if="[1, 2].includes($store.state.currentEsRoleId)" class="list-item" @click="navigateToU('/pages/profile/user-management')">
        <view class="item-content">
          <uni-icons type="contact" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">用户管理</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#999"></uni-icons>
        </view>
      </view>



      <!-- <view class="list-item" @click="navigateToU('/pages/profile/settings')">
        <view class="item-content">
          <uni-icons type="gear" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">系统设置</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#999"></uni-icons>
        </view>
      </view> -->
      <!-- <view class="list-item" @click="navigateToU('/pages/profile/service')" style="margin:20rpx 0 ">
        <view class="item-content">
          <uni-icons type="headphones" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">智能客服</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#999"></uni-icons>
        </view>
      </view> -->
      <view class="list-item" @click="navigateToU('/pages/profile/about')">
        <view class="item-content">
          <uni-icons type="info" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">关于</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#999"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { findUserInfoByCodeId, getUserCenterInfo, findEnergyStation } from "@/api/user.js";
export default {
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    userInfoData() {
      return this.$store.state.userInfo || {}
    },
    user() {
      const info = this.userInfoData
      return {
        avatar: info.imageFile || info.wxAvaterUrl || '',
        userName: info.user_name || info.userName || '',
        mobile: info.mobile_phone || info.mobile || ''
      }
    },
    currentDeviceName() {
      const currentDevice = this.$store.state.currentSelectDevice
      if (!currentDevice) {
        return ''
      }

      // 如果用户没有设备列表，直接返回空
      if (!this.userInfoData?.esIds || !Array.isArray(this.userInfoData.esIds) || this.userInfoData.esIds.length === 0) {
        return ''
      }

      // 如果 currentDevice 有 name 属性，直接返回
      if (currentDevice.name) {
        return currentDevice.name
      }

      // 如果 currentDevice 是对象但没有 name，从 esIds 中查找
      const deviceId = currentDevice.id || currentDevice.esId
      const device = this.userInfoData.esIds.find(item => {
        if (typeof item === 'object') {
          return item.esId === deviceId || item.id === deviceId
        }
        return item === deviceId
      })
      if (device && typeof device === 'object' && device.name) {
        return device.name
      }

      return ''
    }
  },
  mounted() {
  },
  async created() {
    try {
      const userId = this.$store.state.userInfo?.userId || this.$store.state.user?.id || '';
      if (!userId) return
      const loginType = this.$store.state.userInfo?.loginType
      let userInfo = {}
      if (loginType === 'account') {
        // 账号密码登录：先 getUserCenterInfo，再根据 roleId 决定 findEnergyStation 是否带 userId
        const userRes = await getUserCenterInfo(userId)
        const userData = (userRes.code === 200 && userRes.data) ? userRes.data : {}
        const stationUserId = [1, 2].includes(userData.roleId) ? null : userId
        const stationRes = await findEnergyStation('microStation', stationUserId)
        const stations = (stationRes.status === 200 && stationRes.data) ? stationRes.data.map(item => ({ ...item, esId: item.id })) : []
        userInfo = {
          ...this.userInfoData,
          ...userData,
          energyStations: stations,
          esIds: stations,
          esUsers: userData.es_users || [],
          userName: userData.user_name || '',
          mobile_phone: userData.mobile_phone || '',
          imageFile: userData.imageFile || '',
          wxAvaterUrl: userData.wxAvaterUrl || '',
          roleId: userData.roleId || this.userInfoData.roleId
        }
      } else {
        // 手机快捷登录：调用 findUserInfoByCodeId（含/es/）
        const emsRes = await findUserInfoByCodeId(userId)
        const emsData = (emsRes.code === 200 && emsRes.data) ? emsRes.data : {}
        userInfo = {
          ...this.userInfoData,
          ...emsData,
          energyStations: emsData.energyStations || [],
          esIds: emsData.energyStations || [],
          esUsers: emsData.es_users || [],
          userName: emsData.user_name || '',
          mobile_phone: emsData.mobile_phone || '',
          imageFile: emsData.imageFile || '',
          wxAvaterUrl: emsData.wxAvaterUrl || '',
          roleId: emsData.roleId || this.userInfoData.roleId
        }
      }
      if (!userInfo.sessionId) {
        userInfo.sessionId = this.$store.state.userInfo.sessionId
      }
      this.$store.commit('SET_LOGIN', userInfo)
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  },
  onShow() {
    this.refreshUserInfo()
  },
  methods: {
    async refreshUserInfo() {
      try {
        const userId = this.$store.state.userInfo?.userId || this.$store.state.user?.id
        if (!userId) return
        const loginType = this.$store.state.userInfo?.loginType
        let userInfo = {}
        if (loginType === 'account') {
          // 账号密码登录：先 getUserCenterInfo，再根据 roleId 决定 findEnergyStation 是否带 userId
          const userRes = await getUserCenterInfo(userId)
          const userData = (userRes.code === 200 && userRes.data) ? userRes.data : {}
          const stationUserId = [1, 2].includes(userData.roleId) ? null : userId
          const stationRes = await findEnergyStation('microStation', stationUserId)
          const stations = (stationRes.status === 200 && stationRes.data) ? stationRes.data.map(item => ({ ...item, esId: item.id })) : []
          userInfo = {
            ...this.$store.state.userInfo,
            ...userData,
            energyStations: stations,
            esIds: stations,
            esUsers: userData.es_users || [],
            userName: userData.user_name || this.$store.state.userInfo.userName || '',
            mobile_phone: userData.mobile_phone || this.$store.state.userInfo.mobile_phone || '',
            imageFile: userData.imageFile || this.$store.state.userInfo.imageFile || '',
            wxAvaterUrl: userData.wxAvaterUrl || this.$store.state.userInfo.wxAvaterUrl || ''
          }
        } else {
          // 手机快捷登录：调用 findUserInfoByCodeId（含/es/）
          const emsRes = await findUserInfoByCodeId(userId)
          const emsData = (emsRes.code === 200 && emsRes.data) ? emsRes.data : {}
          userInfo = {
            ...this.$store.state.userInfo,
            ...emsData,
            energyStations: emsData.energyStations || [],
            esIds: emsData.energyStations || [],
            esUsers: emsData.es_users || [],
            userName: emsData.user_name || this.$store.state.userInfo.userName || '',
            mobile_phone: emsData.mobile_phone || this.$store.state.userInfo.mobile_phone || '',
            imageFile: emsData.imageFile || this.$store.state.userInfo.imageFile || '',
            wxAvaterUrl: emsData.wxAvaterUrl || this.$store.state.userInfo.wxAvaterUrl || ''
          }
        }
        if (!userInfo.sessionId) {
          userInfo.sessionId = this.$store.state.userInfo.sessionId
        }
        this.$store.commit('SET_LOGIN', userInfo)
      } catch (e) {
        console.error('刷新用户信息失败', e)
      }
    },
    // 新增方法：加载用户数据
    loadUserData() {
      const userData = uni.getStorageSync('loginData') || {};
      // this.user1 = {
      //   ...this.user1,
      //   ...userData,
      //   role: this.mapRole(userData.systemType),
      //   expireTime: this.formatTime(userData.expireFreshTime)
      // }
    },




    navigateToDeviceList() {
      uni.setStorageSync('fromProfile', 'true')
      uni.navigateTo({
        url: '/pages/index/index'
      })
    },

    navigateToU(url) {
      uni.navigateTo({
        url: url,
        success: () => {
          console.log('导航成功');
        },
        fail: (err) => {
          console.error('导航失败:', err);
        }
      });
    },

  }
}
</script>

<style scoped lang="scss">
.profile-container {
  padding: 20rpx;
}


.flex-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.name-line {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  flex-wrap: wrap;
}

.profile-header {
  position: relative;
  padding: 24rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  background: #fff;

  .header-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 240rpx;
    background: linear-gradient(135deg, #F7FAFC 0%, #EBF4FF 100%);

    .gradient-overlay {
      animation: gradientShift 8s infinite alternate;
    }
  }

  .avatar-container {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:active {
      transform: scale(0.95);
    }
  }

  .role-badge {
    position: absolute;
    bottom: -10rpx;
    right: -10rpx;
    background: #4a90e2;
    color: white;
    padding: 6rpx 16rpx;
    border-radius: 32rpx;
    font-size: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.3);
  }

  .user-info-box {
    position: relative;
    z-index: 1;
    text-align: center;
  }

  @keyframes gradientShift {
    0% {
      opacity: 0.8;
    }

    100% {
      opacity: 0.95;
    }
  }
}

//   background: #ffffff;
//   padding: 20px 15px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
// }

// .avatar-section {
//   display: flex;
//   align-items: center;
//   position: relative;
//   padding: 10px;
//   background: #f8f9fa;
//   border-radius: 12px;
// }

// .avatar {
//   width: 60px;
//   height: 60px;
//   border-radius: 50%;
//   margin-right: 15px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
// }

// .user-info {
//   display: flex;
//   flex-direction: column;
// }

// .nickname {
//   font-size: 18px;
//   font-weight: bold;
//   color: #2c3e50;
// }

// .username {
//   font-size: 14px;
//   color: #666;
// }

// .role {
//   font-size: 12px;
//   color: #999;
// }

// .expire {
//   font-size: 12px;
//   color: #666;
//   margin-top: 4px;
// }

// .system-url {
//   font-size: 12px;
//   color: #007AFF;
//   margin-top: 4px;
//   word-break: break-all;
// }

// .qr-icon {
//   position: absolute;
//   right: 10px;
//   top: 50%;
//   transform: translateY(-50%);
//   color: #007AFF;
// }



.user-info {
  background-color: #fff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: bold;
}

.phone {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.function-list {
  margin-top: 15px;
  // background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.logout-btn {
  margin: 20px;
}

.list-item {
  padding: 16px 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.list-item:active {
  background-color: #f8f9fa;
}

.item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.item-title {
  font-size: 16px;
  color: #2c3e50;
  flex: 1;
  margin-left: 15px;
}

.item-title-wrapper {
  flex: 1;
  margin-left: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-title-wrapper .item-title {
  flex: none;
  margin-left: 0;
}

.title-divider {
  width: 1px;
  height: 24rpx;
  background: #dcdfe6;
  margin: 0 12rpx;
}

.device-name {
  font-size: 14px;
  color: #999;
  margin-left: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

button[type="warn"] {
  background: #ff4444;
  color: #fff;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(255, 68, 68, 0.2);
}

.avatar-wrapper {
  background: #f1f3f5;
  border-radius: 50%;
  padding: 16rpx;
  /* 保持与原有图片相同的容器尺寸 */
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.avatar-image:hover {
  transform: scale(1.05);
}

.loading-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.rotate {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.user-role {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 4px;
}

.contact-info {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.email {
  font-size: 12px;
  color: #666;
  margin-left: 4px;
}

/* 统一箭头样式 */
.arrow-icon {
  font-size: 24rpx;
  color: #ccc;
  flex-shrink: 0;
  transition: all 0.2s ease;

  .list-item:active &,
  .user-info:active & {
    color: #007AFF;
    transform: translateX(4rpx);
  }
}
</style>