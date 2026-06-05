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
          <text class="service-title">智能客服</text>
          <text class="service-desc">AI智能助手，随时为您服务</text>
        </view>
        <view class="service-btn">
          <text>立即咨询</text>
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

        <scroll-view class="chat-body" id="chatBody" scroll-y :scroll-with-animation="true" :scroll-into-view="scrollToId">
          <view class="chat-messages">
            <view 
              v-for="(msg, index) in chatMessages" 
              :key="index" 
              :id="'msg-' + index"
              class="chat-message" 
              :class="msg.type"
            >
              <view class="message-avatar" :class="msg.type">
                <uni-icons v-if="msg.type === 'bot'" type="headphones" size="24" color="#fff" />
                <uni-icons v-else type="person" size="24" color="#fff" />
              </view>
              <view class="message-content" :class="msg.type">
                <text class="message-text">{{ msg.text }}</text>
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

            <!-- 加载动画 -->
            <view class="chat-message bot" v-if="isLoading">
              <view class="message-avatar bot">
                <uni-icons type="headphones" size="24" color="#fff" />
              </view>
              <view class="message-content bot">
                <view class="loading-indicator">
                  <view class="loading-dot"></view>
                  <view class="loading-dot"></view>
                  <view class="loading-dot"></view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>

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
        { text: '如何绑定微能站？', icon: 'plus', color: '#4a8cff', answer: '在"设备管理"页面点击"添加设备"，扫描微能站设备二维码或手动输入设备编号即可完成绑定。' },
        { text: '微能站数据怎么看？', icon: 'bar-chart', color: '#fa8c16', answer: '进入微能站详情页面，即可查看实时发电数据、能耗统计、历史曲线等信息。' },
        { text: '设备故障怎么办？', icon: 'alert', color: '#f5222d', answer: '在设备详情页面查看故障告警信息，系统会自动推送通知，也可联系技术支持协助排查。' },
        { text: '如何分享设备？', icon: 'share', color: '#722ed1', answer: '作为设备管理员，在设备列表中点击分享按钮，生成分享码或二维码即可分享给其他用户。' }
      ],
      faqList: [
        {
          question: '微能站支持哪些功能？',
          answer: '微能站EMS系统提供光伏监测、储能管理、微能站远程控制、能耗分析、数据报表等功能，帮助您全面管理微能站设备。'
        },
        {
          question: '微能站数据更新频率是多少？',
          answer: '微能站实时数据每分钟更新一次，历史数据可按日、月、年维度查看和导出。'
        },
        {
          question: '如何绑定微能站设备？',
          answer: '在"设备管理"页面点击"添加设备"，扫描微能站设备二维码或手动输入设备编号即可完成绑定。'
        },
        {
          question: '微能站故障如何排查？',
          answer: '在设备详情页面查看实时状态和故障告警信息，系统会自动推送故障通知，也可联系技术支持协助排查。'
        }
      ],
      chatSuggestions: [
        '如何绑定微能站？',
        '微能站数据怎么看？',
        '设备故障怎么办？',
        '如何分享设备？'
      ],
      // 私有知识库
      knowledgeBase: [
        {
          keywords: ['绑定', '添加', '设备', '微能站'],
          question: '如何绑定微能站设备？',
          answer: '在"设备管理"页面点击"添加设备"，扫描微能站设备二维码或手动输入设备编号即可完成绑定。绑定成功后，您可以在设备列表中查看微能站的实时状态和数据。'
        },
        {
          keywords: ['数据', '查看', '监测', '报表', '统计'],
          question: '如何查看微能站数据？',
          answer: '进入微能站详情页面，即可查看实时发电数据、能耗统计、历史曲线等信息。数据每分钟更新一次，支持按日、月、年维度查看和导出报表。'
        },
        {
          keywords: ['故障', '报警', '异常', '排查', '维修'],
          question: '设备故障怎么办？',
          answer: '在设备详情页面查看故障告警信息，系统会自动推送通知。常见故障可参考故障指南排查，如需专业支持，请联系技术支持团队。'
        },
        {
          keywords: ['分享', '权限', '管理员', '协作'],
          question: '如何分享微能站？',
          answer: '作为设备管理员，在设备列表中点击分享按钮，生成分享码或二维码即可分享给其他用户。您可以设置分享权限和有效期。'
        },
        {
          keywords: ['光伏', '发电', '效率', '太阳'],
          question: '光伏发电效率如何提升？',
          answer: '1. 定期清洁光伏板表面灰尘；2. 确保光伏板朝向最佳角度；3. 检查组件连接是否正常；4. 及时处理阴影遮挡问题；5. 定期维护逆变器设备。'
        },
        {
          keywords: ['储能', '电池', '充放电', '调度'],
          question: '储能系统如何管理？',
          answer: '储能系统支持自动和手动两种模式。自动模式下系统根据电价和负荷自动调度充放电；手动模式可手动控制充放电。建议定期检查电池健康状态。'
        },
        {
          keywords: ['注册', '登录', '账号', '密码'],
          question: '如何注册和登录？',
          answer: '点击首页"注册"按钮，填写手机号和验证码完成注册。登录时输入手机号和密码，支持短信验证码快捷登录。忘记密码可通过手机号找回。'
        },
        {
          keywords: ['安装', '调试', '部署', '配置'],
          question: '微能站如何安装调试？',
          answer: '微能站安装需由专业人员进行。安装流程包括：设备开箱检查、支架安装、组件安装、接线调试、并网测试。安装完成后由技术人员进行系统调试和验收。'
        },
        {
          keywords: ['能耗', '节能', '优化', '管理'],
          question: '如何优化能耗管理？',
          answer: '通过EMS系统查看能耗分析报表，识别高耗能设备和时段。合理利用储能系统削峰填谷，优化用电时间。定期进行设备能效评估和维护。'
        },
        {
          keywords: ['报表', '导出', '数据', '分析'],
          question: '如何导出数据报表？',
          answer: '在数据统计页面选择时间范围，点击"导出"按钮即可下载Excel格式报表。支持日报、周报、月报和年报导出，包含发电量、能耗、效率等关键指标。'
        }
      ],
      showSuggestions: true,
      chatMessage: '',
      chatPopup: null,
      // 聊天消息列表
      chatMessages: [
        {
          type: 'bot',
          text: '您好！我是微能站EMS系统的AI智能客服，很高兴为您服务！请问有什么关于微能站的问题需要咨询吗？'
        }
      ],
      scrollToId: '',
      // API配置
      apiKey: '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',
      baseURL: 'https://integrate.api.nvidia.com/v1',
      systemPrompt: '您是微能站EMS能源管理系统的专业AI客服助手，专注于微能站相关业务：\n\n1. **微能站管理**：微能站设备绑定、状态监控、远程控制\n2. **光伏系统**：光伏发电监测、效率分析、故障预警\n3. **储能系统**：储能设备管理、充放电控制、能量调度策略\n4. **能源监控**：实时能耗监测、发电量统计、数据分析报表\n5. **系统功能**：用户注册登录、设备分享、权限管理、数据导出\n6. **常见问题**：微能站安装调试、设备故障排查、数据异常处理\n\n请根据用户问题，提供专业、准确、友好的回答，结合微能站EMS系统的实际功能进行解答。',
      conversationHistory: [],
      isLoading: false
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
      this.loadChatHistory()
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
      
      // 添加用户消息
      this.chatMessages.push({
        type: 'user',
        text: message
      })
      
      // 更新对话历史
      this.conversationHistory.push({
        role: 'user',
        content: message
      })
      
      // 滚动到底部
      setTimeout(() => {
        this.scrollToId = 'msg-' + (this.chatMessages.length - 1)
      }, 100)
      
      // 调用真实AI API
      this.callNVIDIAAPI(message)
    },
    sendSuggestion(text) {
      this.chatMessage = text
      this.sendMessage()
    },
    // 从知识库查找答案
    searchKnowledgeBase(question) {
      const lowerQuestion = question.toLowerCase()
      let bestMatch = null
      let maxMatches = 0

      for (const item of this.knowledgeBase) {
        let matches = 0
        for (const keyword of item.keywords) {
          if (lowerQuestion.includes(keyword.toLowerCase())) {
            matches++
          }
        }
        
        if (matches > maxMatches) {
          maxMatches = matches
          bestMatch = item
        }
      }

      // 如果匹配到至少2个关键词，返回知识库答案
      if (bestMatch && maxMatches >= 2) {
        return bestMatch.answer
      }
      
      // 如果只有1个关键词匹配，但问题非常相关，也返回答案
      if (bestMatch && maxMatches === 1) {
        const questionLower = question.toLowerCase()
        const keywordsLower = bestMatch.keywords.map(k => k.toLowerCase())
        const hasExactMatch = keywordsLower.some(k => questionLower.includes(k))
        if (hasExactMatch && question.length < 20) {
          return bestMatch.answer
        }
      }

      return null
    },
    // 调用NVIDIA API获取AI回复（优先从知识库查找）
    async callNVIDIAAPI(userMessage) {
      // 首先从私有知识库查找答案
      const kbAnswer = this.searchKnowledgeBase(userMessage)
      if (kbAnswer) {
        this.addBotMessage(kbAnswer)
        this.conversationHistory.push({ role: 'assistant', content: kbAnswer })
        this.saveChatHistory()
        return
      }

      // 如果知识库没有匹配，调用外部AI API
      if (!this.apiKey) {
        this.addBotMessage('抱歉，我暂时无法回答这个问题，请联系人工客服。')
        return
      }

      this.isLoading = true
      
      try {
        const [err, response] = await uni.request({
          url: `${this.baseURL}/chat/completions`,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json'
          },
          data: {
            model: 'deepseek-ai/deepseek-v4-pro',
            messages: [
              { role: 'system', content: this.systemPrompt },
              ...this.conversationHistory
            ],
            temperature: 1,
            top_p: 0.95,
            max_tokens: 16384,
            chat_template_kwargs: { thinking: false },
            stream: false
          }
        })

        this.isLoading = false

        if (err) {
          console.error('API请求失败:', err)
          this.addBotMessage('抱歉，网络连接失败，请稍后再试。')
          return
        }

        if (response.statusCode === 200) {
          const aiReply = response.data.choices[0]?.message?.content || '抱歉，我没有理解您的问题。'
          
          // 添加AI回复
          this.addBotMessage(aiReply)
          
          // 更新对话历史
          this.conversationHistory.push({
            role: 'assistant',
            content: aiReply
          })
          
          // 保存历史记录
          this.saveChatHistory()
        } else {
          console.error('API返回错误:', response.statusCode, response.data)
          this.addBotMessage('抱歉，AI服务暂时不可用，请稍后再试。')
        }
      } catch (error) {
        this.isLoading = false
        console.error('API调用异常:', error)
        this.addBotMessage('抱歉，AI服务暂时不可用，请稍后再试。')
      }
    },
    // 添加机器人消息
    addBotMessage(text) {
      this.chatMessages.push({
        type: 'bot',
        text: text
      })
      
      // 滚动到底部
      setTimeout(() => {
        this.scrollToId = 'msg-' + (this.chatMessages.length - 1)
      }, 100)
    },
    // 保存聊天历史
    saveChatHistory() {
      try {
        const history = {
          chatMessages: this.chatMessages,
          conversationHistory: this.conversationHistory
        }
        uni.setStorageSync('aiChatHistory', JSON.stringify(history))
      } catch (error) {
        console.error('保存历史记录失败:', error)
      }
    },
    // 加载聊天历史
    loadChatHistory() {
      try {
        const historyStr = uni.getStorageSync('aiChatHistory')
        if (historyStr) {
          const history = JSON.parse(historyStr)
          this.chatMessages = history.chatMessages || this.chatMessages
          this.conversationHistory = history.conversationHistory || []
          
          // 滚动到底部
          setTimeout(() => {
            this.scrollToId = 'msg-' + (this.chatMessages.length - 1)
          }, 100)
        }
      } catch (error) {
        console.error('加载历史记录失败:', error)
      }
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
    justify-content: flex-start;
  }

  &.user {
    align-items: flex-start;
    justify-content: flex-end;
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

  &.user {
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
    margin-left: 16rpx;
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

  &.user {
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
    padding: 24rpx;
    border-radius: 24rpx;
    border-top-right-radius: 8rpx;

    .message-text {
      color: #fff;
    }
  }
}

.message-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

/* 加载动画 */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 0;
}

.loading-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a8cff 0%, #6b9dff 100%);
  animation: loading 1.4s infinite ease-in-out both;
}

.loading-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
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