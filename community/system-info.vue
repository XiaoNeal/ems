<template>
  <view class="system-info-page">
    <!-- 头部导航栏 -->
    <u-navbar title="系统信息" :autoBack="true" :placeholder="true" />

    <!-- 内容区域 -->
    <view class="content">
      <!-- 硬件信息 -->
      <view class="section">
        <text class="section-title">硬件信息</text>
        <view class="info-card">
          <view class="info-item">
            <text class="item-label">PCS版本</text>
            <text class="item-value">PCS/L2073/397</text>
          </view>
          <view class="info-item">
            <text class="item-label">BMS版本</text>
            <text class="item-value">RCU-A_H020N_B0_1.5.7-F03D-SDLP-S06_V1.0.9</text>
          </view>
          <view class="info-item">
            <text class="item-label">DCDC版本</text>
            <text class="item-value">DCDC-11</text>
          </view>
        </view>
      </view>

      <!-- 软件信息 -->
      <view class="section">
        <text class="section-title">软件信息</text>
        <view class="info-card">
          <view class="info-item">
            <text class="item-label">PCS版本</text>
            <text class="item-value">PCS/L2073/397</text>
          </view>
          <view class="info-item">
            <text class="item-label">BMS版本</text>
            <text class="item-value">RCU-A_H020N_B0_1.5.7-F03D-SDLP-S06_V1.0.9</text>
          </view>
          <view class="info-item">
            <text class="item-label">DCDC版本</text>
            <text class="item-value">DCDC-11</text>
          </view>
        </view>
      </view>

      <!-- 其他信息 -->
      <view class="section">
        <text class="section-title">软件信息</text>
        <view class="info-card">
          <view class="info-item">
            <text class="item-label">更新日期:</text>
            <text class="item-value">【2024】年【6】月【6】日</text>
          </view>
          <view class="info-item">
            <text class="item-label">生效日期:</text>
            <text class="item-value">【2024】年【6】月【6】日</text>
          </view>
        </view>
      </view>

      <!-- 证书 -->
      <view class="section">
        <view class="certificate">
          <image src="../static/images/certificate.png" class="certificate-image" />
        </view>
      </view>

      <!-- 协议文本 -->
      <view class="section">
        <view class="agreement">
          <text class="agreement-text">
            欢迎您使用【xxxxxx系统】（下文简称XXX），XXXX是【国创能源互联网创新中心（广东）有限公司】（以下简称"国创联能"）提供的产品和服务（以下简称"本服务"）！
            在您使用我们的G-FIEMS服务前，请您务必仔细阅读、充分理解各条款内容，特别是涉及您重大权益的条款，包括免除或者限制国创联能责任的条款、对您的权利进行限制的条款、约定争议解决方式和司法管辖的条款等。以及开通或使用某项服务的单独协议或规则。前述条款可
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "SystemInfo"
};
</script>

<style lang="scss" scoped>
.system-info-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  padding: 20rpx;
}

.section {
  margin-bottom: 30rpx;
  .section-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 15rpx;
    text-align: center;
  }
  .info-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      &:last-child {
        border-bottom: none;
      }
      .item-label {
        font-size: 24rpx;
        color: #666;
      }
      .item-value {
        font-size: 24rpx;
        color: #333;
      }
    }
  }
  .certificate {
    display: flex;
    justify-content: center;
    .certificate-image {
      width: 540rpx;
      height: 720rpx;
      border-radius: 8rpx;
    }
  }
  .agreement {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    .agreement-text {
      font-size: 24rpx;
      line-height: 1.5;
      color: #666;
    }
  }
}
</style>