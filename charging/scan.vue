<template>
  <view class="page-container">
    <!-- 导航栏 -->
    <custom-nav-bar title="扫码充电" bgColor="#0f2e47" textColor="#ffffff" :showBack="true"
      backIconColor="#ffffff"></custom-nav-bar>

    <!-- 主内容区 -->
    <view class="main-content">
      <!-- 余额信息卡片 -->
      <view class="balance-card">
        <view class="balance-info">
          <text class="balance-label">账户余额</text>
          <text class="balance-amount">¥{{ balance.toFixed(2) }}</text>
          <button class="recharge-btn" @click="goRecharge">充值</button>
        </view>
      </view>

      <!-- 扫码引导提示 -->
      <view class="scan-guide">
        <text class="guide-text">请扫描充电桩二维码</text>
      </view>

      <!-- 扫码区域容器 -->
      <view class="scan-area-container">
        <!-- 扫码区域 -->
        <view class="scan-area">
          <!-- 扫描辅助边框 -->
          <view class="scan-border" :class="{ scanning: isScanning }">
            <!-- 扫码框 -->
            <view class="scan-frame">
              <!-- 扫码线动画 -->
              <view class="scan-line" :style="{ transform: `translateY(${scanLinePosition}px)` }" v-if="isScanning">
              </view>

              <!-- 扫描网格背景 -->
              <view class="scan-grid" v-if="isScanning"></view>

              <!-- 角落标记 -->
              <view class="corner top-left"></view>
              <view class="corner top-right"></view>
              <view class="corner bottom-left"></view>
              <view class="corner bottom-right"></view>
            </view>
          </view>

          <!-- 扫描区域外的遮罩 -->
          <view class="scan-mask"></view>

          <!-- 扫描状态图标 -->
          <view class="scan-status-icon" v-if="!isScanning">
            <uni-icons type="scan" size="60" color="#409eff" v-if="!errorMessage"></uni-icons>
            <uni-icons type="error" size="60" color="#f56c6c" v-if="errorMessage"></uni-icons>
          </view>
        </view>

        <!-- 扫描区域提示 -->
        <view class="scan-hint">
          <text>将二维码对准扫描框</text>
        </view>
      </view>

      <!-- 扫码状态提示 -->
      <view class="scan-status" :class="{ error: errorMessage, success: successMessage }"
        v-if="errorMessage || successMessage || isScanning">
        <text v-if="isScanning">正在识别二维码...</text>
        <text v-if="successMessage">{{ successMessage }}</text>
        <text v-if="errorMessage">{{ errorMessage }}</text>
      </view>

      <!-- 功能按钮区 -->
      <view class="scan-actions">
        <view class="action-btn" @click="showManualInput" :class="{ disabled: scanInProgress }">
          <uni-icons type="edit" size="24" color="#ffffff"></uni-icons>
          <text>输入编号充电</text>
        </view>

        <view class="action-btn primary" @click="retryScan" v-if="!isScanning && !scanInProgress">
          <uni-icons type="refresh" size="24" color="#0f2e47"></uni-icons>
          <text>重新扫描</text>
        </view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="scan-footer">
      <text>支持国家电网、特来电、星星充电等主流运营商</text>
    </view>

    <!-- 手动输入弹窗 -->
    <view class="modal-backdrop" v-if="showInputPopup" @click="onModalBackdropClick"></view>
    <view class="modal" v-if="showInputPopup">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">输入充电桩编号</text>
          <view class="modal-close" @click="showInputPopup = false">
            <uni-icons type="close" size="20" color="#999"></uni-icons>
          </view>
        </view>

        <view class="input-section">
          <view class="input-wrapper">
            <input type="text" v-model="pileNumber" placeholder="请输入8-16位编号" placeholder-style="color: #999"
              @input="validateInput" @confirm="confirmManualInput" maxlength="16" class="number-input"
              ref="pileInput" />
          </view>

          <view class="input-info">
            <text class="input-length">{{ pileNumber.length }}/16</text>
            <text class="input-valid" v-if="pileNumber.length > 0">
              {{ isPileNumberValid ? '✓ 格式正确' : '✗ 请输入8-16位字母或数字' }}
            </text>
          </view>

          <text class="input-desc">编号通常位于充电桩显示屏或机身标签上</text>
        </view>

        <view class="modal-buttons">
          <button class="modal-btn cancel-btn" @click="showInputPopup = false">取消</button>
          <button class="modal-btn confirm-btn" @click="confirmManualInput" :disabled="!isPileNumberValid">
            确认连接
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      scanLinePosition: 0,    // 扫码线位置
      scanTimer: null,        // 扫描动画定时器
      isScanning: false,      // 是否正在扫描中
      errorMessage: '',       // 错误信息
      successMessage: '',     // 成功信息
      scanInProgress: false,  // 防止重复调用扫码API
      pileNumber: '',         // 手动输入的充电桩编号
      isPileNumberValid: false, // 充电桩编号是否有效
      showInputPopup: false,  // 是否显示输入弹窗
      balance: 56.80          // 账户余额
    };
  },
  onLoad() {
    this.initScanAnimation();
    // 延迟一点时间再调用startScan，确保页面完全加载
    setTimeout(() => {
      this.startScan();
    }, 500);
  },
  onMounted() {
    // 如果onLoad中扫码失败，这里作为备用
    if (!this.isScanning && !this.scanInProgress) {
      setTimeout(() => {
        this.startScan();
      }, 1000);
    }
  },
  onUnload() {
    if (this.scanTimer) {
      clearInterval(this.scanTimer);
      this.scanTimer = null;
    }
    this.isScanning = false;
  },
  methods: {
    initScanAnimation() {
      const maxPosition = 260;
      if (this.scanTimer) {
        clearInterval(this.scanTimer);
      }
      this.scanTimer = setInterval(() => {
        if (!this.isScanning) return;
        this.scanLinePosition += 1.5;
        if (this.scanLinePosition > maxPosition) {
          this.scanLinePosition = 0;
        }
      }, 15);
    },
    startScan() {
      this.errorMessage = '';
      this.successMessage = '';
      this.isScanning = true;
      this.scanInProgress = true;
      this.pileNumber = '';

      // 调用扫码API
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode'],
        success: (res) => {
          this.handleScanSuccess(res);
        },
        fail: (err) => {
          this.handleScanFail(err);
        },
        complete: () => {
          this.scanInProgress = false;
        }
      });
    },
    handleScanSuccess(res) {
      this.isScanning = false;
      console.log('扫码成功:', res.result);
      if (this.validatePileId(res.result)) {
        this.successMessage = '识别成功，正在连接充电桩...';
        this.startChargingProcess(res.result);
      } else {
        this.errorMessage = '二维码格式不正确，请尝试手动输入';
        setTimeout(() => {
          this.showManualInput();
        }, 1500);
      }
    },
    handleScanFail(err) {
      this.isScanning = false;
      console.error('扫码失败:', err);
      if (err.errMsg && err.errMsg.includes('cancel')) {
        this.errorMessage = '已取消扫码';
      } else {
        this.errorMessage = '扫码失败，请检查二维码或手动输入';
      }
    },
    retryScan() {
      if (this.scanInProgress) return;
      this.startScan();
    },
    showManualInput() {
      this.pileNumber = '';
      this.isPileNumberValid = false;
      this.showInputPopup = true;
      this.$nextTick(() => {
        if (this.$refs.pileInput) {
          this.$refs.pileInput.focus();
        }
      });
    },
    onModalBackdropClick() {
      this.showInputPopup = false;
    },
    validatePileId(pileId) {
      if (!pileId) return false;
      const reg = /^[A-Za-z0-9]{8,16}$/;
      return reg.test(pileId);
    },
    validateInput() {
      this.isPileNumberValid = this.validatePileId(this.pileNumber);
    },
    confirmManualInput() {
      if (!this.isPileNumberValid) return;
      this.showInputPopup = false;
      this.successMessage = '正在连接充电桩...';
      this.startChargingProcess(this.pileNumber);
    },
    startChargingProcess(pileId) {
      uni.showLoading({
        title: '连接充电桩中...',
        mask: true
      });
      setTimeout(() => {
        uni.hideLoading();
        uni.navigateTo({
          url: `/charging/charging-process?pileId=${encodeURIComponent(pileId)}`
        });
      }, 1500);
    },
    // 充值功能
    goRecharge() {
      uni.navigateTo({
        url: '/pages/recharge/index'
      });
    }
  }
};
</script>

<style scoped>
/* 基础布局 */
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #333;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding-top: var(--custom-nav-bar-height, 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--custom-nav-bar-height, 48px) + 20px) 16px 20px;
  box-sizing: border-box;
  position: relative;
}

/* 余额信息卡片 */
.balance-card {
  width: 100%;
  max-width: 340px;
  background: linear-gradient(135deg, #1e5fc8, #409eff);
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 28px;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.2);
}

.balance-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
}

.balance-amount {
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  margin: 0 10px;
  flex: 1;
  text-align: center;
}

.recharge-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  height: auto;
  line-height: normal;
  transition: all 0.3s ease;
}

.recharge-btn:active {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

/* 扫码引导提示 */
.scan-guide {
  margin-bottom: 26px;
  text-align: center;
  width: 100%;
  max-width: 340px;
}

.guide-text {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

/* 扫码区域容器 */
.scan-area-container {
  width: 100%;
  max-width: 340px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

/* 扫码区域 */
.scan-area {
  width: 340px;
  height: 340px;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background-color: #000000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* 扫描辅助边框 */
.scan-border {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  z-index: 2;
  transition: all 0.3s ease;
}

.scan-border.scanning {
  box-shadow: 0 0 0 2000px rgba(0, 0, 0, 0.5), 0 0 30px rgba(64, 158, 255, 0.6);
}

/* 扫码框 */
.scan-frame {
  width: 260px;
  height: 260px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  z-index: 3;
}

/* 扫码线动画 */
.scan-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #409eff, transparent);
  box-shadow: 0 0 15px 2px rgba(64, 158, 255, 0.8);
  z-index: 4;
}

/* 扫描网格背景 */
.scan-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(to bottom, rgba(64, 158, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to right, rgba(64, 158, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 3;
}

/* 角落标记 */
.corner {
  width: 24px;
  height: 24px;
  position: absolute;
  border: 3px solid #409eff;
  z-index: 5;
  background: transparent;
}

.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

/* 扫描区域外的遮罩 */
.scan-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
  padding: 40px;
  box-sizing: border-box;
  pointer-events: none;
}

/* 扫描状态图标 */
.scan-status-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
}

/* 扫描区域提示 */
.scan-hint {
  margin-top: 16px;
  text-align: center;
  color: #666;
  font-size: 14px;
  z-index: 1;
  width: 100%;
}

/* 扫码状态提示 */
.scan-status {
  text-align: center;
  margin: 20px 0;
  font-size: 15px;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 340px;
}

.scan-status.error {
  color: #f56c6c;
  background-color: rgba(245, 108, 108, 0.1);
}

.scan-status.success {
  color: #67c23a;
  background-color: rgba(103, 194, 58, 0.1);
}

/* 功能按钮区 - 对齐优化版 */
.scan-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  /* 调整间距使按钮更紧凑 */
  width: 100%;
  max-width: 340px;
  margin: 20px 0 30px;
  padding: 0 10px;
  box-sizing: border-box;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 15px;
  transition: all 0.3s ease;
  padding: 16px 20px;
  /* 调整内边距使按钮高度一致 */
  border-radius: 12px;
  cursor: pointer;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  width: 130px;
  /* 增加宽度以适应文字 */
  height: 100px;
  /* 固定高度确保对齐 */
}

.action-btn.primary {
  background-color: #409eff;
  color: #ffffff;
}

.action-btn:active {
  transform: scale(0.96);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.action-btn.disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* 按钮图标样式 */
.action-btn uni-icons {
  margin-bottom: 10px;
  /* 图标与文字间距 */
}

/* 按钮文字样式 */
.action-btn text {
  text-align: center;
  line-height: 1.4;
}

/* 底部提示 */
.scan-footer {
  color: #999;
  font-size: 12px;
  text-align: center;
  padding: 16px 20px;
  margin-top: auto;
  line-height: 1.5;
}

/* 弹窗样式 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.3s ease;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  opacity: 0;
  z-index: 999;
  width: 90%;
  max-width: 360px;
  animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

.modal-content {
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px 24px 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.modal-close {
  position: absolute;
  right: 18px;
  top: 18px;
  cursor: pointer;
}

.input-section {
  padding: 24px 20px 18px;
}

.number-input {
  width: 100%;
  height: 50px;
  background-color: #f5f7fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #333;
  padding: 0 16px;
  font-size: 16px;
  letter-spacing: 1.5px;
}

.number-input:focus {
  border-color: #409eff;
  outline: none;
}

.input-info {
  display: flex;
  justify-content: space-between;
  margin: 8px 0 12px;
  font-size: 13px;
}

.input-length {
  color: #999;
}

.input-valid {
  color: #f56c6c;
}

.input-valid:valid {
  color: #67c23a;
}

.input-desc {
  color: #999;
  font-size: 12px;
  line-height: 1.6;
  margin-top: 4px;
}

.modal-buttons {
  display: flex;
  gap: 16px;
  padding: 16px 20px 24px;
}

.modal-btn {
  flex: 1;
  height: 50px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
}

.cancel-btn {
  background-color: #f5f7fa;
  color: #666;
}

.cancel-btn:active {
  background-color: #eee;
}

.confirm-btn {
  background-color: #409eff;
  color: #ffffff;
}

.confirm-btn:active {
  background-color: #3688e6;
}

.confirm-btn:disabled {
  background-color: #ccc;
  color: #fff;
  cursor: not-allowed;
}
</style>