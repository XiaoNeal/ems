<template>
  <view class="navbar-wrapper">
    <!-- <view v-if="placeholder" class="navbar-placeholder" :class="platformClass" :style="{ backgroundColor: bgColor }"></view> -->
    <view class="header" :class="[platformClass, { 'navbar-fixed': fixed }]" :style="{ backgroundColor: safeBgColor }">
       <view class="header-safe-area"></view>
      <view class="header-content">
        <view class="back-btn" @click="handleBack" v-if="showBack">
          <slot name="left">
            <uni-icons type="back" :size="20" :color="safeLeftIconColor"></uni-icons>
          </slot>
        </view>
        <view v-else>
          <slot name="left"></slot>
        </view>
        <view class="header-center">
          <slot name="center">
            <text class="title" :style="safeTitleStyle">{{ safeTitle }}</text>
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
    let platform = ''
    try {
      // 基础库 2.20+ 已废弃 getSystemInfoSync；这里只需要 platform，getDeviceInfo 即可满足
      if (typeof uni.getDeviceInfo === 'function') {
        platform = (uni.getDeviceInfo() || {}).platform || ''
      }
    } catch (e) {
      console.warn('getDeviceInfo failed', e)
    }
    return {
      platformClass: platform === 'ios' ? 'ios-platform' : 'android-platform'
    }
  },
  props: {
    // 同 bgColor：全局 mixin 的 computed 首帧未求值会被序列化为 null，
    // 声明 type 会触发类型校验告警，改为运行时兜底
    title: {
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
    // 不声明 type：小程序端 uni 会把 type 编译进 properties 做类型校验，
    // 而全局 mixin 的 fontColor/bGColor 是 computed，首帧 patch 尚未求值时
    // 会被序列化为 null 传入，触发 "received type-uncompatible value"。
    // default 仍保留，配合下方 computed 做运行时兜底。
    bgColor: {
      default: '#fff'
    },
    leftIconColor: {
      default: '#303133'
    },
    titleStyle: {
      default() {
        return {}
      }
    }
  },
  computed: {
    safeTitle() {
      return typeof this.title === 'string' ? this.title : ''
    },
    safeBgColor() {
      return typeof this.bgColor === 'string' && this.bgColor ? this.bgColor : '#fff'
    },
    safeLeftIconColor() {
      return typeof this.leftIconColor === 'string' && this.leftIconColor ? this.leftIconColor : '#303133'
    },
    safeTitleStyle() {
      const s = this.titleStyle
      return s && typeof s === 'object' && !Array.isArray(s) ? s : {}
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
.navbar-wrapper {
  pointer-events: none;
  flex-shrink: 0;
}

.header {
  background-color: #fff;
  pointer-events: auto;
  /* z-index 只给 fixed 模式：流内模式下微信渲染层也会为带 z-index 的元素
     额外建合成层，与页面里其它 transform / 动画层叠加时出现白色残影。
     fixed 模式仍需要盖住页面内容，层级保留在 .navbar-fixed 上。 */
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
  z-index: 100;
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