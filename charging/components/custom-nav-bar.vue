<template>
  <view class="custom-nav-bar" :style="{'background-color': bgColor, 'height': navBarHeight + 'px'}">
    <!-- 状态栏占位 -->
    <view :style="{height: statusBarHeight + 'px'}"></view>
    
    <view class="nav-content" :style="{'height': contentHeight + 'px'}">
      <!-- 返回按钮 -->
      <view class="back-btn" v-if="showBack" @click="navigateBack" :style="{'visibility': isFirstPage ? 'hidden' : 'visible'}">
        <uni-icons type="left" size="20" :color="textColor"></uni-icons>
      </view>
      
      <!-- 标题 -->
      <view class="title" :style="{'color': textColor, 'font-size': titleSize + 'px', 'font-weight': titleBold ? 'bold' : 'normal'}">
        {{ title }}
      </view>
      
      <!-- 右侧按钮区域 -->
      <view class="right-btns" v-if="rightBtns.length > 0">
        <view class="right-btn" v-for="(btn, index) in rightBtns" :key="index" @click="handleRightBtnClick(index)">
          <uni-icons :type="btn.type" :size="btn.size || 20" :color="btn.color || textColor"></uni-icons>
        </view>
      </view>
      
      <!-- 占位元素，用于平衡左侧返回按钮 -->
      <view class="placeholder" v-if="!showBack && rightBtns.length === 0"></view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    // 导航栏标题
    title: { type: String, default: '' },
    
    // 是否显示返回按钮
    showBack: { type: Boolean, default: true },
    
    // 导航栏背景色
    bgColor: { type: String, default: '#165DFF' },
    
    // 文字颜色
    textColor: { type: String, default: '#fff' },
    
    // 标题字体大小
    titleSize: { type: Number, default: 16 },
    
    // 标题是否加粗
    titleBold: { type: Boolean, default: true },
    
    // 右侧按钮配置数组
    rightBtns: { 
      type: Array, 
      default: () => []
      // 每个按钮格式: {type: 'icon类型', size: 20, color: '#fff'}
    }
  },
  data() {
    return {
      statusBarHeight: 0, // 状态栏高度
      navBarHeight: 0,    // 整个导航栏高度
      contentHeight: 44,  // 导航内容区域高度
      isFirstPage: false  // 是否为首页
    };
  },
  created() {
    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    
    // 计算导航栏总高度 (状态栏高度 + 内容区域高度)
    this.navBarHeight = this.statusBarHeight + this.contentHeight;
    
    // 判断是否为首页
    const pages = getCurrentPages();
    this.isFirstPage = pages.length <= 1;
  },
  methods: {
    // 返回上一页
    navigateBack() {
      if (!this.isFirstPage) {
        uni.navigateBack();
      } else {
        // 如果是首页，可以返回首页或做其他处理
        uni.switchTab({
          url: '/pages/index/index'
        });
      }
    },
    
    // 右侧按钮点击事件
    handleRightBtnClick(index) {
      this.$emit('rightBtnClick', index);
    }
  }
}
</script>

<style scoped>
.custom-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.back-btn, .placeholder {
  width: 44px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
}

.right-btns {
  display: flex;
  align-items: center;
}

.right-btn {
  width: 44px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
    