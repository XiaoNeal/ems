<template>
  <view class="container">
    <!-- 头部导航 -->
    <u-navbar title="AI客服" :autoBack="true" :placeholder="true">
      <view slot="right"></view>
    </u-navbar>

    <!-- 聊天区域 -->
    <scroll-view class="chat-container" scroll-y="true" :scroll-into-view="scrollToView" scroll-with-animation="true">
      <!-- 系统消息 -->
      <view class="message-item system-message">
        <text class="system-text">您好，我是AI客服助手，有什么可以帮助您的？</text>
      </view>

      <!-- 消息列表 -->
      <view v-for="(message, index) in messages" :key="index" :class="['message-item', message.type === 'user' ? 'user-message' : 'ai-message']">
        <!-- 用户消息 -->
        <template v-if="message.type === 'user'">
          <view class="message-avatar user-avatar">
            <image src="/static/images/mine.png" class="avatar-image" />
          </view>
          <view class="message-content user-content">
            <text class="message-text">{{ message.content }}</text>
            <text class="message-time">{{ formatTime(message.timestamp) }}</text>
          </view>
        </template>

        <!-- AI消息 -->
        <template v-else>
          <view class="message-avatar ai-avatar">
            <image src="/static/images/矢量智能对象.png" class="avatar-image" />
          </view>
          <view class="message-content ai-content">
            <text class="message-text">{{ message.content }}</text>
            <text class="message-time">{{ formatTime(message.timestamp) }}</text>
          </view>
        </template>
      </view>

      <!-- 加载动画 -->
      <view class="message-item ai-message" v-if="isLoading">
        <view class="message-avatar ai-avatar">
          <image src="/static/images/矢量智能对象.png" class="avatar-image" />
        </view>
        <view class="message-content ai-content">
          <view class="loading-indicator">
            <view class="loading-dot"></view>
            <view class="loading-dot"></view>
            <view class="loading-dot"></view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-container">
      <input
        type="text"
        v-model="inputText"
        placeholder="请输入您的问题..."
        class="input-field"
        @keyup.enter="sendMessage"
      />
      <button class="send-button" @click="sendMessage" :disabled="!inputText.trim()">
        <text class="send-icon">发送</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ai-service',
  data() {
    return {
      messages: [],
      inputText: '',
      isLoading: false,
      scrollToView: '',
      apiKey: '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', // 请在这里填写您的NVIDIA API Key
      systemPrompt: '您是一个专业的能源管理系统AI客服助手，负责回答用户关于系统使用、设备管理、数据监控等方面的问题。请保持回答专业、简洁、友好。',
      conversationHistory: []
    };
  },
  mounted() {
    this.loadHistory();
  },
  beforeUnmount() {
    this.saveHistory();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    sendMessage() {
      if (!this.inputText.trim()) return;

      // 添加用户消息
      const userMessage = {
        type: 'user',
        content: this.inputText.trim(),
        timestamp: new Date().getTime()
      };
      this.messages.push(userMessage);
      this.inputText = '';

      // 更新对话历史
      this.conversationHistory.push({
        role: 'user',
        content: userMessage.content
      });

      // 滚动到底部
      this.scrollToBottom();
      // 保存历史记录
      this.saveHistory();

      // 调用NVIDIA API获取回复
      this.isLoading = true;
      this.callDeepSeekAPI().then(response => {
        this.isLoading = false;
        const aiMessage = {
          type: 'ai',
          content: response,
          timestamp: new Date().getTime()
        };
        this.messages.push(aiMessage);
        
        // 更新对话历史
        this.conversationHistory.push({
          role: 'assistant',
          content: response
        });
        
        this.scrollToBottom();
        // 保存历史记录
        this.saveHistory();
      }).catch(error => {
        this.isLoading = false;
        const errorMessage = {
          type: 'ai',
          content: '抱歉，AI服务暂时不可用，请稍后再试。',
          timestamp: new Date().getTime()
        };
        this.messages.push(errorMessage);
        this.scrollToBottom();
        // 保存历史记录
        this.saveHistory();
        console.error('NVIDIA API error:', error);
      });
    },
    async callDeepSeekAPI() {
      if (!this.apiKey) {
        return '请先在代码中设置您的NVIDIA API Key';
      }

      try {
        const [err, response] = await uni.request({
          url: 'https://integrate.api.nvidia.com/v1/chat/completions',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json'
          },
          data: {
            model: 'moonshotai/kimi-k2.5',
            messages: [
              {
                role: 'system',
                content: this.systemPrompt
              },
              ...this.conversationHistory
            ],
            temperature: 1.0,
            max_tokens: 16384,
            top_p: 1.0,
            chat_template_kwargs: { thinking: true }
          }
        });

        console.log('NVIDIA API response:', response);

        if (err) {
          throw new Error(`请求失败: ${err.message}`);
        }

        if (response.statusCode === 200) {
          return response.data.choices[0].message.content;
        } else {
          throw new Error(`API请求失败: ${response.statusCode}`);
        }
      } catch (error) {
        throw error;
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollToView = 'bottom';
      });
    },
    saveHistory() {
      try {
        const history = {
          messages: this.messages,
          conversationHistory: this.conversationHistory
        };
        uni.setStorageSync('aiChatHistory', JSON.stringify(history));
      } catch (error) {
        console.error('保存历史记录失败:', error);
      }
    },
    loadHistory() {
      try {
        const historyStr = uni.getStorageSync('aiChatHistory');
        if (historyStr) {
          const history = JSON.parse(historyStr);
          this.messages = history.messages || [];
          this.conversationHistory = history.conversationHistory || [];
          this.scrollToBottom();
        }
      } catch (error) {
        console.error('加载历史记录失败:', error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

/* 头部导航 */
.header {
  height: 44px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}

.header-left {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 24px;
  color: #333;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-right {
  width: 40px;
}

/* 聊天区域 */
.chat-container {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.message-item {
  display: flex;
  margin-bottom: 18px;
  align-items: flex-start;
  padding: 0 8px;
}

.system-message {
  justify-content: center;
  margin: 10px 0 20px 0;
}

.system-text {
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  max-width: 80%;
  text-align: center;
}

.user-message {
  flex-direction: row-reverse;
}

.ai-message {
  flex-direction: row;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 12px;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-content {
  background-color: #007aff;
  border-bottom-right-radius: 4px;
  align-items: flex-end;
}

.ai-content {
  background-color: #fff;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  align-items: flex-start;
}

.message-text {
  font-size: 15px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.user-content .message-text {
  color: #fff;
}

.ai-content .message-text {
  color: #333;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
}

.user-content .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.ai-content .message-time {
  color: rgba(0, 0, 0, 0.5);
}

/* 加载动画 */
.loading-indicator {
  display: flex;
  align-items: center;
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #007aff;
  margin: 0 2px;
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
  }
  40% {
    transform: scale(1);
  }
}

/* 输入区域 */
.input-container {
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 15px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
}

.input-field {
  flex: 1;
  height: 36px;
  background-color: #f0f0f0;
  border-radius: 18px;
  padding: 0 15px;
  font-size: 14px;
  border: none;
  outline: none;
}

.send-button {
  width: 60px;
  height: 36px;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 18px;
  font-size: 14px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:disabled {
  background-color: #ccc;
}

.send-icon {
  font-size: 14px;
}

/* 底部安全区域 */
.safe-area {
  height: env(safe-area-inset-bottom);
  background-color: #fff;
}
</style>