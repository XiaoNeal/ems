<template>
  <view class="system-info-page" :class="platformClass">
    <!-- 头部导航栏 -->
    <DyNavbar title="系统信息" :placeholder="true" />
    <view class="fixed-placeholder"></view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 硬件信息 -->
      <!-- <view class="section">
        <text class="section-title">硬件信息</text>
        <view class="info-card">
          <view class="info-item" v-for="(item, index) in hardwareList" :key="index">
            <text class="item-label">{{ item.label }}</text>
            <text class="item-value">{{ item.value }}</text>
          </view>
        </view>
      </view> -->

      <!-- 软件信息 -->
      <view class="section">
        <text class="section-title">软件信息</text>
        <view class="info-card">
          <view class="info-item" v-for="(item, index) in softwareList" :key="index">
            <text class="item-label">{{ item.label }}</text>
            <text class="item-value">{{ item.value }}</text>
          </view>
        </view>
      </view>

      <!-- 日期信息 -->
      <!-- <view class="section">
        <text class="section-title">日期信息</text>
        <view class="info-card">
          <view class="info-item" v-for="(item, index) in dateList" :key="index">
            <text class="item-label">{{ item.label }}</text>
            <text class="item-value">{{ item.value }}</text>
          </view>
        </view>
      </view> -->

    </view>
  </view>
</template>

<script>
/**
 * 系统信息页面
 * 优化点：数据驱动、代码规范、体验优化、结构清晰
 */
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'

export default {
  components: {
    DyNavbar
  },
  name: 'SystemInfo',
  data() {
    return {
      platformClass: "",
      // 硬件信息列表
      hardwareList: [
        { label: 'PCS版本', value: 'PCS/L2073/397' },
        { label: 'BMS版本', value: 'RCU-A_H020N_B0_1.5.7-F03D-SDLP-S06_V1.0.9' },
        { label: 'DCDC版本', value: 'DCDC-11' }
      ],
      // 软件信息列表
      softwareList: [
        { label: '系统名称', value: '光储直柔微能源站' },
        { label: '版本号', value: 'V1.0.0' },
        // { label: 'DCDC版本', value: 'DCDC-11' }
      ],
      // 日期信息列表
      dateList: [
        { label: '更新日期', value: '2024年6月6日' },
        { label: '生效日期', value: '2024年6月6日' }
      ]
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === "ios" ? "ios-platform" : "android-platform";
      },
    });
  }
}
</script>

<style lang="scss" scoped>
/* 全局页面样式 */
.system-info-page {
  min-height: 100vh;
  background-color: #f5f5f5;

  &.android-platform {
    .fixed-placeholder { height: calc(25px + 44px + 20px); }
  }

  &.ios-platform {
    .fixed-placeholder { height: calc( 44px); }
  }
}

/* 内容容器 */
.content {
  padding: 20rpx;
  box-sizing: border-box;
}

/* 通用模块样式 */
.section {
  margin-bottom: 30rpx;

  // 模块标题
  .section-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 15rpx;
    text-align: center;
  }

  // 信息卡片
  .info-card {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  }

  // 信息项
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }

  // 标签
  .item-label {
    font-size: 24rpx;
    color: #666;
  }

  // 内容值
  .item-value {
    font-size: 24rpx;
    color: #333;
    // 长文本自动换行
    word-break: break-all;
    text-align: right;
    max-width: 70%;
  }
}
</style>