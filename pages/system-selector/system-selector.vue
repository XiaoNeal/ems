<template>
  <view class="container">
    <!-- 顶部标题区域 -->
    <view class="header">
      <text class="title">系统管理</text>
    </view>
    <u-toast ref="uToast"></u-toast>
    <!-- 系统列表区域 -->
    <view class="system-list">
      <view class="system-card" v-for="(system, index) in systemList" :key="index" @click="selectSystem(system)"
        :class="{ 'active-card': selectedIndex === index }" @touchstart="handleTouchStart(index)"
        @touchend="handleTouchEnd()">
        <!-- 系统图标区域 -->
        <view class="system-icon" :class="[getIconClass(system.type)]">
          <text class="icon-text">{{ getIconText(system.type) }}</text>
        </view>

        <!-- 系统信息区域 -->
        <view class="system-info">
          <text class="system-name">{{ system.name }}</text>
          <text class="system-type">{{ getSystemTypeName(system.type) }}</text>
        </view>

        <!-- 右侧箭头 -->
        <view class="arrow-right">
          <text class="iconfont icon-arrow"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import sapi from '@/store/sapi'
import request from '@/utils/request'
import md5 from "@/utils/md5.min.js";
export default {
  data() {
    return {
      systemList: [],
      selectedIndex: -1,
      touchActive: false,
      username: '',
      password: '',
    };
  },
  onLoad(options) {
    this.systemList = JSON.parse(decodeURIComponent(options.systems));
    this.username = options.username;
    this.password = options.password;
  },
  methods: {
    // 选择系统
    async selectSystem(system) {
      console.log('选择系统:', system, this.$store.state, this.sessionId);




      if (system.type == 1) {
        let res = await request({
          url: '/appletAPI/user/login',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            // token : uni.getStorageSync("TOKEN")
          },
          data: {
            "userName": this.username,
            "password": md5('admin@23')
          }
        });


        console.log(res)

        let category = res.data.projectCategory[0]
        uni.setStorageSync('urlPrefix', res.data.basePrefix);
        this.$u.vuex('userName', res.data.userName);
        this.$u.vuex('memberId', res.data.id);
        this.$u.vuex('deviceCategoryId', category.deviceCategoryId);
        this.$u.vuex('areaInfoId', category.areaInfoId);
        this.$u.vuex('userAvatar', res.data.imagePath);
        this.$u.vuex('userPhone', res.data.mobile);
        this.$u.vuex('currentSystemInfo', category.areaInfo[0]);
        this.$u.vuex('projectCategory', res.data.projectCategory);
        this.$u.vuex('urlPrefix', res.data.basePrefix);
        this.$u.vuex('hasLogin', true);
        this.$u.vuex('token', res.data.token);
        uni.setStorageSync('token', res.data.token);
        this.$u.vuex('currentTemplate', 3);
      } else if (system.type == 2) {
        // let respond = await uni.request({
        //   url: 'https://serviceiems.gree.com/SsoServer/app/Login',
        //   method: 'POST',
        //   data: {
        //     username: this.username,
        //     password: this.password,
        //      HashIP: localStorage.getItem('broserid')
        //   }
        // })
        // console.log(respond, "respond")
        const { code, data } = await request({
          url: '/ApihomecommunityKoa/login',
          method: 'POST',
          data: {
            username: this.username,
            password: this.password
          }
        });

        if (code == 10000) {
          this.$u.vuex('token', "Bearer " + data.token);
          uni.setStorageSync('token', "Bearer " + data.token);
          const userInfo = {
            _id: "60054086019dcc42e41c91f7",
            username: "homeAdmin",
            name: "NEIIC 国创联能",
            __v: 0,
            role: {
              _id: "60068a98fa3cf1513b206a74",
              name: "admin",
              description: "管理员"
            },
            level: "admin"
          }
          const roleId = userInfo.role._id
          sapi.getCenterList({ roleId }).then(res => {
            if (res.code == 10000) {
              this.showToast('success', "登录成功");
              this.$u.vuex('centerList', res.data);
              this.$store.commit('UPDATE_CENTERLIST', res.data)
              targetPath = '/community/index';
              uni.navigateTo({ url: targetPath });
            } else {
              this.showToast('error', '登录失败:服务器繁忙 ');
            }
          })


        } else {
          this.showToast('error', '登录失败:服务器繁忙 ');
        }
      } else if (system.type == 3) {
        console.log(this.$store.state.userId, this.$store.state.sessionId)
        await this.$store.dispatch('user/getInfo', {
          userId: this.$store.state.userId, // 从登录响应获取用户ID
          sessionId: this.$store.state.sessionId// 从登录响应获取sessionId
        });

      }
      uni.navigateTo({ url: system.path });

    },

    showToast(type, title) {
      this.$refs.uToast.show({
        type,
        icon: false,
        message: title
      });
    },

    // 获取系统类型名称
    getSystemTypeName(type) {
      const types = ['', '能源管理', '能碳管理', '云控平台'];
      return types[type] || '未知系统';
    },

    // 获取图标类名
    getIconClass(type) {
      const icons = ['', 'icon-energy', 'icon-carbon', 'icon-platform'];
      return icons[type] || 'icon-unknown';
    },

    // 获取图标文本
    getIconText(type) {
      const texts = ['', 'E', 'C', 'P'];
      return texts[type] || '?';
    },

    // 处理触摸开始
    handleTouchStart(index) {
      this.selectedIndex = index;
      this.touchActive = true;
    },

    // 处理触摸结束
    handleTouchEnd() {
      setTimeout(() => {
        this.selectedIndex = -1;
        this.touchActive = false;
      }, 200);
    }
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.container {
  padding: 30rpx;
}

/* 头部样式 */
.header {
  margin-top: 50px;
  /* 新增顶部外边距 */
  margin-bottom: 40rpx;
  padding: 20rpx 0;
  /* 增加内边距 */
  background: linear-gradient(135deg, #409EFF 0%, #0066CC 100%);
  border-radius: 16rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 600;
  color: #ffffff;
  /* 改为白色文字 */
  padding-left: 30rpx;
  /* 增加左侧内边距 */
}

.title::before {
  content: '';
  display: inline-block;
  width: 8rpx;
  height: 40rpx;
  background-color: #409EFF;
  border-radius: 4rpx;
  margin-right: 16rpx;
}

/* 系统列表样式 */
.system-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.system-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* 触摸反馈效果 */
.system-card:active {
  transform: scale(0.98);
}

.system-card.active-card {
  border-left: 8rpx solid #409EFF;
  box-shadow: 0 8rpx 24rpx rgba(64, 158, 255, 0.15);
}

/* 系统图标样式 */
.system-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  font-size: 36rpx;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.icon-energy {
  background-color: #52c41a;
}

.icon-carbon {
  background-color: #fa8c16;
}

.icon-platform {
  background-color: #409EFF;
}

.icon-unknown {
  background-color: #909399;
}

.icon-text {
  transform: scale(1.2);
}

/* 系统信息样式 */
.system-info {
  flex: 1;
}

.system-name {
  font-size: 32rpx;
  color: #303133;
  font-weight: 500;
  margin-bottom: 8rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.system-type {
  font-size: 24rpx;
  color: #909399;
  display: block;
}

/* 右侧箭头样式 */
.arrow-right {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  margin-left: 24rpx;
  transition: transform 0.3s ease;
}

.system-card:hover .arrow-right,
.system-card.active-card .arrow-right {
  transform: translateX(10rpx);
  color: #409EFF;
}

/* 图标字体样式 (实际项目中需要引入图标字体库) */
.iconfont {
  font-family: "iconfont" !important;
  font-size: 28rpx;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-arrow::before {
  content: "\e62f";
  /* 箭头图标编码，需根据实际图标库调整 */
}
</style>