<template>
  <view class="sub-page">
    <u-navbar title="AI客服" :titleStyle="{ 'color': fontColor, 'width': '100%', 'font-weight': '600' }" :leftText="null" :autoBack="true"
      :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>

    <view class="ai-container">
      <!-- AI客服头部 -->
      <view class="ai-header">
        <view class="ai-avatar">
          <view class="ai-avatar-inner">
            <uni-icons type="headphones" size="48" color="#fff" />
          </view>
          <view class="ai-status"></view>
        </view>
        <view class="ai-info">
          <text class="ai-name">AI智能客服</text>
          <text class="ai-desc">7×24小时在线为您服务</text>
        </view>
      </view>

      <!-- 快捷问题卡片 -->
      <view class="quick-card">
        <view class="quick-header">
          <text class="quick-title">猜你想问</text>
        </view>
        <view class="quick-list">
          <view class="quick-item" v-for="(item, index) in quickQuestions" :key="index" @click="handleQuestion(item)">
            <uni-icons :type="item.icon" size="24" :color="item.color" />
            <text class="quick-text">{{ item.text }}</text>
            <uni-icons class="quick-arrow" type="arrowright" size="20" color="#ccc" />
          </view>
        </view>
      </view>

      <!-- 常见问题卡片 -->
      <view class="faq-card">
        <view class="faq-header">
          <text class="faq-title">常见问题</text>
        </view>
        <view class="faq-list">
          <view class="faq-item" v-for="(item, index) in faqList" :key="index" @click="handleQuestion(item)">
            <view class="faq-q">
              <text class="faq-q-text">Q：{{ item.question }}</text>
            </view>
            <view class="faq-a">
              <text class="faq-a-text">{{ item.answer }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 人工客服入口 -->
      <view class="service-card" @click="openService">
        <view class="service-icon">
          <uni-icons type="staff" size="32" color="#fff" />
        </view>
        <view class="service-content">
          <text class="service-title">人工客服</text>
          <text class="service-desc">在线咨询，工作日 9:00-18:00</text>
        </view>
        <view class="service-btn">
          <text>立即咨询</text>
        </view>
      </view>

      <!-- 底部联系 -->
      <view class="contact-bar">
        <view class="contact-item" @click="makePhoneCall('400-123-4567')">
          <uni-icons type="phone" size="28" color="#52c41a" />
          <text>拨打电话</text>
        </view>
        <view class="contact-divider"></view>
        <view class="contact-item" @click="sendEmail">
          <uni-icons type="email" size="28" color="#fa8c16" />
          <text>发送邮件</text>
        </view>
      </view>
    </view>

    <!-- 聊天弹窗 -->
    <uni-popup ref="chatPopup" type="bottom" :safe-area="true">
      <view class="chat-modal">
        <view class="chat-header">
          <view class="chat-header-left">
            <view class="chat-ai-avatar">
              <uni-icons type="headphones" size="28" color="#fff" />
            </view>
            <view class="chat-header-info">
              <text class="chat-header-name">AI智能客服</text>
              <text class="chat-header-status">在线</text>
            </view>
          </view>
          <view class="chat-close" @click="closeChat">
            <uni-icons type="close" size="28" color="#999" />
          </view>
        </view>

        <view class="chat-body" id="chatBody">
          <view class="chat-messages">
            <view class="chat-message bot">
              <view class="message-avatar bot">
                <uni-icons type="headphones" size="24" color="#fff" />
              </view>
              <view class="message-content bot">
                <text class="message-text">您好！我是AI智能客服，请问有什么可以帮助您的？</text>
              </view>
            </view>

            <view class="chat-suggestions" v-if="showSuggestions">
              <text class="suggestions-title">您可以这样问我：</text>
              <view class="suggestions-list">
                <view class="suggestion-item" v-for="(item, index) in chatSuggestions" :key="index" @click="sendSuggestion(item)">
                  {{ item }}
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="chat-footer">
          <input 
            class="chat-input" 
            v-model="chatMessage"
            placeholder="输入您的问题..."
            :cursor-spacing="20"
          />
          <view class="chat-send" :class="{ active: chatMessage.trim() }" @click="sendMessage">
            <uni-icons type="paperplane" size="28" color="#fff" />
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      quickQuestions: [
        { text: '如何注册账号？', icon: 'personadd', color: '#4a8cff', answer: '点击首页"注册"按钮，填写手机号和验证码即可完成注册。' },
        { text: '如何找回密码？', icon: 'locked', color: '#fa8c16', answer: '在登录页面点击"忘记密码"，通过绑定的手机号验证后重置密码。' },
        { text: '如何联系人工客服？', icon: 'headphones', color: '#52c41a', answer: '您可以拨打客服热线400-123-4567，或在工作时间内在线咨询人工客服。' },
        { text: '如何修改个人信息？', icon: 'gear', color: '#722ed1', answer: '进入"我的"-"个人信息"页面，点击相应项目即可修改。' }
      ],
      faqList: [
        {
          question: '平台支持哪些功能？',
          answer: '平台提供光伏监测、储能管理、设备控制、数据分析等功能，帮助您全面管理新能源设备。'
        },
        {
          question: '数据更新频率是多少？',
          answer: '实时数据每分钟更新一次，历史数据可按日、月、年维度查看。'
        },
        {
          question: '如何绑定设备？',
          answer: '在"设备管理"页面点击"添加设备"，扫描设备二维码或手动输入设备编号即可完成绑定。'
        },
        {
          question: '账户安全如何保障？',
          answer: '平台采用金融级加密技术，支持密码、验证码多重验证，定期提示修改密码保障账户安全。'
        }
      ],
      chatSuggestions: [
        '如何注册账号？',
        '如何绑定设备？',
        '数据如何查看？',
        '账户安全设置'
      ],
      showSuggestions: true,
      chatMessage: '',
      chatPopup: null
    }
  },
  onReady() {
    this.chatPopup = this.$refs.chatPopup
  },
  methods: {
    handleQuestion(item) {
      uni.showModal({
        title: item.text,
        content: item.answer,
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#4a8cff'
      })
    },
    openService() {
      this.$refs.chatPopup.open()
    },
    closeChat() {
      this.$refs.chatPopup.close()
    },
    sendMessage() {
      if (!this.chatMessage.trim()) return
      
      const message = this.chatMessage.trim()
      this.chatMessage = ''
      this.showSuggestions = false
      
      // 模拟发送消息后的自动回复
      setTimeout(() => {
        uni.showToast({
          title: '消息已发送',
          icon: 'none'
        })
      }, 100)
    },
    sendSuggestion(text) {
      this.chatMessage = text
      this.sendMessage()
    },
    makePhoneCall(phoneNumber) {
      uni.makePhoneCall({ phoneNumber })
    },
    sendEmail() {
      uni.showModal({
        title: '发送邮件',
        content: '是否发送邮件至 support@example.com？',
        confirmText: '发送',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '即将打开邮箱应用', icon: 'none' })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.sub-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f5ff 0%, #f5f7fb 30%);
  -webkit-overflow-scrolling: touch;
}

.ai-container {
  padding: 32rpx;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  // padding-top: calc(var(--status-bar-height, 44px) + 100rpx);
}

/* AI客服头部 */
.ai-header {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 28rpx;
  padding: 40rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.06);
}

.ai-avatar {
  width: 120rpx;
  height: 120rpx;
  position: relative;
  margin-right: 28rpx;
  z-index: 1;
}

.ai-avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 30rpx;
  background: linear-gradient(135deg, #4a8cff 0%, #6b9dff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-status {
  position: absolute;
  bottom: 8rpx;
  right: 8rpx;
  width: 24rpx;
  height: 24rpx;
  background: #52c41a;
  border-radius: 50%;
  border: 4rpx solid #fff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.ai-info {
  flex: 1;
  z-index: 1;
}

.ai-name {
  display: block;
  font-size: 38rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10rpx;
  letter-spacing: 2rpx;
}

.ai-desc {
  font-size: 26rpx;
  color: #888;
}

/* 快捷问题卡片 */
.quick-card {
  background: #fff;
  border-radius: 28rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 32rpx;
}

.quick-header {
  padding: 28rpx 32rpx;
  background: linear-gradient(90deg, #f8fafc 0%, #fff 100%);
  border-bottom: 2rpx solid #f0f1f2;
}

.quick-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    width: 6rpx;
    height: 24rpx;
    background: linear-gradient(180deg, #4a8cff 0%, #6b9dff 100%);
    border-radius: 3rpx;
    margin-right: 16rpx;
  }
}

.quick-list {
  padding: 8rpx 0;
}

.quick-item {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:active {
    background: #f8fafc;
    transform: scale(0.99);
  }
}

.quick-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
  margin-left: 20rpx;
}

.quick-arrow {
  margin-left: 16rpx;
}

/* 常见问题卡片 */
.faq-card {
  background: #fff;
  border-radius: 28rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 32rpx;
}

.faq-header {
  padding: 28rpx 32rpx;
  background: linear-gradient(90deg, #f8fafc 0%, #fff 100%);
  border-bottom: 2rpx solid #f0f1f2;
}

.faq-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    width: 6rpx;
    height: 24rpx;
    background: linear-gradient(180deg, #722ed1 0%, #9255e8 100%);
    border-radius: 3rpx;
    margin-right: 16rpx;
  }
}

.faq-list {
  padding: 16rpx 0;
}

.faq-item {
  padding: 24rpx 32rpx;
  transition: all 0.25s ease;
  border-bottom: 2rpx solid #f5f6f7;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f8fafc;
  }
}

.faq-q {
  margin-bottom: 12rpx;
}

.faq-q-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.faq-a {
  padding-left: 0;
}

.faq-a-text {
  font-size: 26rpx;
  color: #888;
  line-height: 1.6;
}

/* 人工客服入口 */
.service-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 28rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: -80rpx;
    right: -80rpx;
    width: 200rpx;
    height: 200rpx;
    background: radial-gradient(circle, rgba(82, 196, 26, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  &:active {
    transform: scale(0.99);
    box-shadow: 0 8rpx 24rpx rgba(74, 140, 255, 0.15);
  }
}

.service-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
  box-shadow: 0 6rpx 20rpx rgba(82, 196, 26, 0.35);
}

.service-content {
  flex: 1;
}

.service-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6rpx;
}

.service-desc {
  font-size: 24rpx;
  color: #666;
}

.service-btn {
  padding: 16rpx 32rpx;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(82, 196, 26, 0.3);

  text {
    font-size: 26rpx;
    font-weight: 500;
    color: #fff;
  }
}

/* 底部联系 */
.contact-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 28rpx;
  padding: 24rpx 0;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
}

.contact-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  transition: all 0.25s ease;

  text {
    font-size: 24rpx;
    color: #666;
    margin-top: 10rpx;
  }

  &:active {
    transform: scale(0.95);
  }
}

.contact-divider {
  width: 2rpx;
  height: 60rpx;
  background: #f0f1f2;
}

/* 聊天弹窗 */
.chat-modal {
  background: #fff;
  border-radius: 36rpx 36rpx 0 0;
  height: 75vh;
  display: flex;
  flex-direction: column;
  max-height: 800rpx;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 2rpx solid #f0f1f2;
  flex-shrink: 0;
}

.chat-header-left {
  display: flex;
  align-items: center;
}

.chat-ai-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  background: linear-gradient(135deg, #4a8cff 0%, #6b9dff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.chat-header-info {
  display: flex;
  flex-direction: column;
}

.chat-header-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.chat-header-status {
  font-size: 22rpx;
  color: #52c41a;
  margin-top: 4rpx;
}

.chat-close {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f6f7;

  &:active {
    background: #e8e9ea;
  }
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 32rpx;
  background: #f5f7fa;
  -webkit-overflow-scrolling: touch;
}

.chat-messages {
  display: flex;
  flex-direction: column;
}

.chat-message {
  display: flex;
  margin-bottom: 32rpx;

  &.bot {
    align-items: flex-start;
  }
}

.message-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.bot {
    background: linear-gradient(135deg, #4a8cff 0%, #6b9dff 100%);
    margin-right: 16rpx;
  }
}

.message-content {
  max-width: 70%;

  &.bot {
    background: #fff;
    padding: 24rpx;
    border-radius: 24rpx;
    border-top-left-radius: 8rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  }
}

.message-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.chat-suggestions {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-top: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.suggestions-title {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
  display: block;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.suggestion-item {
  padding: 16rpx 28rpx;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #4a8cff;
  transition: all 0.25s ease;

  &:active {
    transform: scale(0.97);
    background: linear-gradient(135deg, #e6f0ff 0%, #d9ebff 100%);
  }
}

.chat-footer {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  border-top: 2rpx solid #f0f1f2;
  background: #fff;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  height: 80rpx;
  padding: 0 32rpx;
  background: #f5f6f7;
  border-radius: 40rpx;
  font-size: 28rpx;
  color: #333;
}

.chat-send {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #d0d5da;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
  transition: all 0.25s ease;

  &.active {
    background: linear-gradient(135deg, #4a8cff 0%, #6b9dff 100%);
    box-shadow: 0 6rpx 20rpx rgba(74, 140, 255, 0.35);

    &:active {
      transform: scale(0.95);
    }
  }
}
</style>