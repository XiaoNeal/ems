<template>
  <view>
    <!-- <view v-if="placeholder" class="navbar-placeholder" :style="{ backgroundColor: bgColor }"></view> -->
    <view class="header" :class="[platformClass, { 'navbar-fixed': fixed }]" :style="{ backgroundColor: bgColor }">
       <view class="header-safe-area"></view>
      <view class="header-content">
        <view class="back-btn" @click="handleBack" v-if="showBack">
          <slot name="left">
            <uni-icons type="back" :size="20" :color="leftIconColor"></uni-icons>
          </slot>
        </view>
        <view v-else>
          <slot name="left"></slot>
        </view>
        <view class="header-center">
          <slot name="center">
            <text class="title" :style="titleStyle">{{ title }}</text>
          </slot>
        </view>
        <view class="header-right">
          <slot name="right"></slot>
        </view>
      </view>
    </view>
     <!-- <view class="fixed-placeholder"></view> -->
  </view>
</template>

<script>
export default {
  name: 'DyNavbar',
  data() {
    const sysInfo = uni.getSystemInfoSync()
    return {
      platformClass: sysInfo.platform === 'ios' ? 'ios-platform' : 'android-platform'
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: Boolean,
      default: false
    },
    statusBar: {
      type: Boolean,
      default: true
    },
    bgColor: {
      type: String,
      default: '#fff'
    },
    leftIconColor: {
      type: String,
      default: '#303133'
    },
    titleStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    handleBack() {
      this.$emit('click-left')
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  z-index: 100;
  background-color: #fff;
  // height: calc(25px + 44px);
}

.header-safe-area {
  height: calc(25px + 20px);
}

.ios-platform .header-safe-area {
  height: calc(59px);
}

.android-platform .header-safe-area {
  height: calc(25px + 20px);
}

.navbar-placeholder {
  height: calc(25px + 44px);
}

.fixed-placeholder {
  height: calc(25px + 44px + 20px);
}

.navbar-fixed {
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
}

.header-content {
  height: 44px;
  // margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 44px 0 15px;
  box-sizing: border-box;
}

.header-center {
  flex: 1;
  text-align: center;
}

.back-btn {
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-right {
  width: 44px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>