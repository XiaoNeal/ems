<template>
  <view class="profile-container">
    <!-- 头部信息 -->
    <view class="profile-header">
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
            <!-- <text class="role-badge">{{ $store.getters.roleName }}</text> -->
          </view>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="function-list">
      <view class="list-item" @click="navigateToU('/pages/profile/info')">
        <view class="item-content">
          <uni-icons type="person" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">个人信息</text>
          <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </view>
      </view>
      <view class="list-item" @click="navigateToU('/pages/profile/security')">
        <view class="item-content">
          <uni-icons type="locked" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">安全设置</text>
          <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </view>
      </view>
      <view class="list-item" @click="navigateToU('/pages/profile/notifications')">
        <view class="item-content">
          <uni-icons type="notification" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">消息通知</text>
          <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </view>
      </view>
      <view class="list-item" @click="navigateToU('/pages/profile/settings')">
        <view class="item-content">
          <uni-icons type="settings" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">系统设置</text>
          <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </view>
      </view>
      <view class="list-item" @click="navigateToU('/pages/profile/help')">
        <view class="item-content">
          <uni-icons type="help" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">帮助与反馈</text>
          <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </view>
      </view>
      <view class="list-item" @click="navigateToU('/pages/profile/about')">
        <view class="item-content">
          <uni-icons type="info" size="20" color="#007AFF"></uni-icons>
          <text class="item-title">关于我们</text>
          <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { decrypt } from "@/utils/decryptData.js";
export default {
  data() {
    return {
      loading: true,
      // user: {
      //   baseName: '',
      //   user_name: '',
      //   email: '',
      //   imageFile: '',
      //   roleId: null
      // }
    }
  },
  computed: {
    ...mapState('user'),
    roleMap() {
      return {
        1: '超级管理员',
        2: '系统管理员',
        3: '普通用户'
      }
    }
  },
  mounted() {

    console.log('用户信息111111:', this.$store.state.user, this.user)
    this.loadUserData();
  },
  async created() {
    try {
      console.log('用户信息112221111:', this.$store.state, this.user)
      let id = this.user.id;
      let res = await uni.request({
        url: 'https://serviceiems.gree.com/SsoServer/FindUserInfoByCodeId',
        method: 'GET',
        data: {
          CodeId: id
        },
        header: {
          'Content-Type': 'application/json'
        }
      })
      console.log('用户信息112221111decrypt:')
      console.log(res)
      res = JSON.parse(decrypt(res[1].data));
      console.log('re用户信息:', res)

      if (res.code === 200) {

        // 替换原有赋值方式
        this.$store.commit('user/UPDATE_USER', {
          // systemName: res.data.baseName,
          avatar: res.data.imageFile,
          mobile: res.data.mobile_phone,
          userName: res.data.user_name,
          email: res.data.email,
          imageFile: res.data.imageFile.replace(/`/g, '') // 去除接口返回的冗余反引号
        });

        console.log(this.user)
      } else {
        throw new Error(res.data.msg || '请求失败')
      }
    } catch (e) {
      console.log(e)
      uni.showToast({ title: '数据加载失败', icon: 'none' })
    } finally {
      this.loading = false
    }
  },
  methods: {
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

    handleImageError() {
      this.user.imageFile = '/static/default-avatar.png'
    },
    // 新增方法：角色映射
    mapRole(systemType) {
      const roleMap = {
        1: '管理员',
        3: '操作员',
        5: '访客'
      };
      return roleMap[systemType] || '普通用户';
    },
    // 新增方法：时间格式化
    formatTime(timestamp) {
      if (!timestamp) return '--';
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} 
              ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
    navigateToU(url) {
      console.log(`导航到: ${url}`);
      console.log(`导航到: ${url}`);
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
    scanQRCode() {
      uni.scanCode({
        success: (res) => {
          console.log('扫描结果:', res.result);
        }
      });
    },
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
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
// .profile-container {
//   // background: linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%);
//   min-height: 100vh;
// }

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

.avatar-section {
  display: flex;
  align-items: center;
  position: relative;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 12px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.username {
  font-size: 14px;
  color: #666;
}

.role {
  font-size: 12px;
  color: #999;
}

.expire {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.system-url {
  font-size: 12px;
  color: #007AFF;
  margin-top: 4px;
  word-break: break-all;
}

.qr-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #007AFF;
}

.function-list {
  margin-top: 15px;
  background: #ffffff;
  border-radius: 12px;
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
}

.list-item:active {
  background-color: #f8f9fa;
}

.item-content {
  display: flex;
  align-items: center;
}

.item-title {
  flex: 1;
  margin-left: 15px;
  font-size: 16px;
  color: #2c3e50;
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
</style>
