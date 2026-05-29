<template>
  <view class="system-info-page">
    <!-- 头部导航栏 -->
    <u-navbar title="系统信息" :auto-back="true" :placeholder="true" />

    <!-- 内容区域 -->
    <view class="content">
      <!-- 硬件信息 -->
      <view class="section">
        <text class="section-title">硬件信息</text>
        <view class="info-card">
          <view class="info-item" v-for="(item, index) in hardwareList" :key="index">
            <text class="item-label">{{ item.label }}</text>
            <text class="item-value">{{ item.value }}</text>
          </view>
        </view>
      </view>

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
      <view class="section">
        <text class="section-title">日期信息</text>
        <view class="info-card">
          <view class="info-item" v-for="(item, index) in dateList" :key="index">
            <text class="item-label">{{ item.label }}</text>
            <text class="item-value">{{ item.value }}</text>
          </view>
        </view>
      </view>

      <!-- 资质证书 -->
      <view class="section section-cert">
        <image src="../static/images/certificate.png" class="cert-image" mode="widthFix" />
      </view>

      <!-- 用户协议 -->
      <view class="section section-agreement">
        <scroll-view scroll-y class="agreement-scroll">
          <text class="agreement-text">
            欢迎您使用【xxxxxx系统】（下文简称XXX），XXXX是【国创能源互联网创新中心（广东）有限公司】（以下简称"国创联能"）提供的产品和服务（以下简称"本服务"）！
            在您使用我们的G-FIEMS服务前，请您务必仔细阅读、充分理解各条款内容，特别是涉及您重大权益的条款，包括免除或者限制国创联能责任的条款、对您的权利进行限制的条款、约定争议解决方式和司法管辖的条款等。以及开通或使用某项服务的单独协议或规则。前述条款可
          </text>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 系统信息页面
 * 优化点：数据驱动、代码规范、体验优化、结构清晰
 */
export default {
  name: 'SystemInfo',
  data() {
    return {
      // 硬件信息列表
      hardwareList: [
        { label: 'PCS版本', value: 'PCS/L2073/397' },
        { label: 'BMS版本', value: 'RCU-A_H020N_B0_1.5.7-F03D-SDLP-S06_V1.0.9' },
        { label: 'DCDC版本', value: 'DCDC-11' }
      ],
      // 软件信息列表
      softwareList: [
        { label: 'PCS版本', value: 'PCS/L2073/397' },
        { label: 'BMS版本', value: 'RCU-A_H020N_B0_1.5.7-F03D-SDLP-S06_V1.0.9' },
        { label: 'DCDC版本', value: 'DCDC-11' }
      ],
      // 日期信息列表
      dateList: [
        { label: '更新日期', value: '2024年6月6日' },
        { label: '生效日期', value: '2024年6月6日' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
/* 全局页面样式 */
.system-info-page {
  min-height: 100vh;
  background-color: #f5f5f5;
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

// 证书模块
.section-cert {
  display: flex;
  justify-content: center;

  .cert-image {
    width: 540rpx;
    border-radius: 8rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  }
}

// 协议模块
.section-agreement {
  .agreement-scroll {
    height: 300rpx;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  }

  .agreement-text {
    font-size: 24rpx;
    line-height: 1.6;
    color: #666;
    word-break: break-all;
  }
}
</style>