<template>
  <view class="quick-control">
    <u-navbar title="快捷控制" :autoBack="true" :placeholder="true" />

    <!-- 全局编辑控制 -->
    <view class="global-edit-bar">
      <view v-if="!isEditing" class="edit-btn primary" @click="handleEditConfig">
        <text class="edit-text">修改配置</text>
      </view>
      <view v-else class="edit-btn close" @click="closeEdit">
        <text class="edit-text">关闭编辑</text>
      </view>
    </view>

    <view class="content">
      <!-- 储能DC一键控制 -->
      <view class="control-card">
        <view class="card-title">储能DC一键控制</view>
        <view class="btn-group">
          <view class="control-btn" :class="{ active: selectedStorageDcAction === 'start', 'btn-disabled': !isEditing }"
            @click="selectStorageDcAction('start')">
            一键开机
          </view>
          <view class="control-btn" :class="{ active: selectedStorageDcAction === 'stop', 'btn-disabled': !isEditing }"
            @click="selectStorageDcAction('stop')">
            关机
          </view>
        </view>
      </view>

      <!-- 光伏DC控制 -->
      <view class="control-card">
        <view class="card-title">光伏DC控制</view>
        <view class="btn-group">
          <view class="control-btn" :class="{ active: selectedPvDcAction === 'start', 'btn-disabled': !isEditing }" @click="pvDcAction('start')">
            一键开机
          </view>
          <view class="control-btn" :class="{ active: selectedPvDcAction === 'stop', 'btn-disabled': !isEditing }" @click="pvDcAction('stop')">
            关机
          </view>
        </view>
      </view>

      <!-- 综合控制 -->
      <view class="control-card">
        <view class="card-title">综合控制</view>

        <!-- PCS模式选择 -->
        <view class="control-section">
          <view class="section-title">PCS模式选择</view>
          <view class="btn-group triple">
            <view
              class="control-btn"
              :class="{ active: selectedPcsMode === 'charge', 'btn-disabled': !isEditing }"
              @click="handlePcsModeClick('charge')"
            >
              并网充电
            </view>
            <view
              class="control-btn"
              :class="{ active: selectedPcsMode === 'discharge', 'btn-disabled': !isEditing }"
              @click="handlePcsModeClick('discharge')"
            >
              并网放电
            </view>
            <view
              class="control-btn"
              :class="{ active: selectedPcsMode === 'off-grid', 'btn-disabled': !isEditing }"
              @click="handlePcsModeClick('off-grid')"
            >
              离网
            </view>
          </view>
        </view>

        <!-- 充电功率设置 -->
        <view class="control-section">
          <view class="section-title">充电功率设置</view>
          <view class="param-row">
            <view class="param-info">
              <text class="param-name">充电功率</text>
              <text class="param-range">范围: 1~10kW</text>
            </view>
            <view class="param-right-wrapper">
              <view class="param-right">
                <view class="param-value-box" :class="{ editing: editingChargePower }">
                  <text v-if="!editingChargePower" class="val-text">{{ chargePower || '--' }}</text>
                  <input v-else class="val-input" type="digit" v-model="tempChargePower" placeholder="请输入"
                    @input="validateTempChargePower" />
                </view>
                <text class="unit-text">kW</text>
              </view>
              <view class="btn-group vertical">
                <view v-if="!editingChargePower" class="btn btn-edit" :class="{ 'btn-disabled': !isEditing }" @click="handleEditChargePower">
                  <uni-icons type="compose" size="14" color="#6699ff"></uni-icons>
                  <text>编辑</text>
                </view>
                <template v-else>
                  <view class="btn btn-sure" :class="{ 'btn-loading': isSubmittingChargePower }"
                    @click="submitChargePower">
                    <text v-if="!isSubmittingChargePower">下发</text>
                    <view v-else class="loading-spinner"></view>
                  </view>
                  <view class="btn btn-cancel" @click="cancelEditChargePower">
                    <uni-icons type="closeempty" size="14" color="#999"></uni-icons>
                  </view>
                </template>
              </view>
            </view>
          </view>
        </view>

        <!-- 放电功率设置 -->
        <view class="control-section">
          <view class="section-title">放电功率设置</view>
          <view class="param-row">
            <view class="param-info">
              <text class="param-name">放电功率</text>
              <text class="param-range">范围: 1~10kW</text>
            </view>
            <view class="param-right-wrapper">
              <view class="param-right">
                <view class="param-value-box" :class="{ editing: editingDischargePower }">
                  <text v-if="!editingDischargePower" class="val-text">{{ dischargePower || '--' }}</text>
                  <input v-else class="val-input" type="digit" v-model="tempDischargePower" placeholder="请输入"
                    @input="validateTempDischargePower" />
                </view>
                <text class="unit-text">kW</text>
              </view>
              <view class="btn-group vertical">
                <view v-if="!editingDischargePower" class="btn btn-edit" :class="{ 'btn-disabled': !isEditing }" @click="handleEditDischargePower">
                  <uni-icons type="compose" size="14" color="#6699ff"></uni-icons>
                  <text>编辑</text>
                </view>
                <template v-else>
                  <view class="btn btn-sure" :class="{ 'btn-loading': isSubmittingDischargePower }"
                    @click="submitDischargePower">
                    <text v-if="!isSubmittingDischargePower">下发</text>
                    <view v-else class="loading-spinner"></view>
                  </view>
                  <view class="btn btn-cancel" @click="cancelEditDischargePower">
                    <uni-icons type="closeempty" size="14" color="#999"></uni-icons>
                  </view>
                </template>
              </view>
            </view>
          </view>
        </view>

        <!-- PCS开关机 -->
        <view class="control-section">
          <view class="section-title">PCS开关机</view>
          <view class="btn-group">
            <view class="control-btn" :class="{ active: selectedPcsAction === 'start', 'btn-disabled': !isEditing }" @click="pcsAction('start')">
              开机
            </view>
            <view class="control-btn" :class="{ active: selectedPcsAction === 'stop', 'btn-disabled': !isEditing }" @click="pcsAction('stop')">
              关机
            </view>
          </view>
        </view>
      </view>


    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'

export default {
  name: "QuickControl",
  data() {
    return {
      chargePower: '',
      dischargePower: '',
      deviceConfig: {
        idCode: '',
        typeCode: '3401',
        address: '01'
      },
      selectedPcsAction: '',
      selectedPvDcAction: '',
      selectedStorageDcAction: '',
      selectedPcsMode: '',
      lastSendTimes: {},
      // 编辑模式
      isEditing: false,
      // 编辑状态
      editingChargePower: false,
      editingDischargePower: false,
      // 临时值
      tempChargePower: '',
      tempDischargePower: '',
      // 提交状态
      isSubmittingChargePower: false,
      isSubmittingDischargePower: false
    };
  },
  computed: {
    userId() {
      return this.$store.state.userInfo?.userId || 0
    }
  },
  mounted() {
    const currentDevice = this.$store.state.currentSelectDevice || {}
    const deviceControl = currentDevice.list.find(item => item.controlType == 1);
    if (deviceControl) {
      this.deviceConfig.idCode = deviceControl.homeBarCode || deviceControl.barCode || '';
      this.deviceConfig.typeCode = deviceControl.typeCode || '3401';
      // this.deviceConfig.address = deviceControl.address || '01';
    }
  },
  methods: {
    async executeCommand(options) {
      const { title, content, apiSufix, commandBuilder, action, stateKey, successMsg, failMsg } = options;

      const now = Date.now();
      const paramLastSendTime = this.lastSendTimes[apiSufix] || 0;
      if (now - paramLastSendTime < 5000) {
        uni.showToast({
          title: '请间隔5秒后再下发',
          icon: 'none'
        });
        return Promise.resolve(false);
      }

      return new Promise((resolve) => {
        uni.showModal({
          title,
          content,
          success: async (res) => {
            if (!res.confirm) {
              resolve(false);
              return;
            }

            try {
              this.lastSendTimes[apiSufix] = Date.now();

              uni.showLoading({ title: '下发中...' });
              const commands = typeof commandBuilder === 'function' ? commandBuilder(action) : commandBuilder;

              await sendCommandFrame({
                apiSufix,
                idCode: this.deviceConfig.idCode,
                typeCode: this.deviceConfig.typeCode,
                address: this.deviceConfig.address,
                userId: this.userId,
                commands
              });

              uni.hideLoading();
              if (stateKey) {
                this[stateKey] = action;
                // 5秒后清除状态，颜色恢复
                setTimeout(() => {
                  if (this[stateKey] === action) {
                    this[stateKey] = '';
                  }
                }, 5000);
              }
              uni.showToast({
                title: successMsg || `${title}成功`,
                icon: 'success'
              });
              resolve(true);
            } catch (error) {
              uni.hideLoading();
              uni.showToast({
                title: failMsg || `${title}失败`,
                icon: 'none'
              });
              console.error(`${apiSufix} error:`, error);
              resolve(false);
            }
          }
        });
      });
    },

    buildCommand(registerAddress, registerValue) {
      return [{
        deviceCategory: '171F',
        addr: '01',
        deviceId: '01',
        registerAddress,
        registerValue: registerValue.toString(),
        valueType: '01',
        registerType: '03',
        extra1: '00',
        extra2: '00',
        extra3: '00'
      }];
    },

    pcsAction(action) {
      if (!this.isEditing) {
        uni.showToast({
          title: '请先点击修改配置',
          icon: 'none'
        });
        return;
      }
      const actionText = action === 'start' ? '开机' : '关机';
      this.executeCommand({
        title: 'PCS开关机',
        content: `确定要执行PCS${actionText}操作吗？`,
        apiSufix: 'pcsControl',
        commandBuilder: () => this.buildCommand('108', action === 'start' ? '1' : '2'),
        action,
        stateKey: 'selectedPcsAction',
        successMsg: `PCS${actionText}成功`,
        failMsg: `PCS${actionText}失败`
      });
    },

    pvDcAction(action) {
      if (!this.isEditing) {
        uni.showToast({
          title: '请先点击修改配置',
          icon: 'none'
        });
        return;
      }
      const actionText = action === 'start' ? '一键开机' : '关机';
      this.executeCommand({
        title: '光伏DC控制',
        content: `确定要执行光伏DC${actionText}操作吗？`,
        apiSufix: 'pvDcControl',
        commandBuilder: () => this.buildCommand('110', action === 'start' ? '1' : '2'),
        action,
        stateKey: 'selectedPvDcAction',
        successMsg: `光伏DC${actionText}成功`,
        failMsg: `光伏DC${actionText}失败`
      });
    },

    selectStorageDcAction(action) {
      if (!this.isEditing) {
        uni.showToast({
          title: '请先点击修改配置',
          icon: 'none'
        });
        return;
      }
      const actionText = action === 'start' ? '一键开机' : '关机';
      this.executeCommand({
        title: '储能DC一键控制',
        content: `确定要执行储能DC${actionText}操作吗？`,
        apiSufix: 'storageDcControl',
        commandBuilder: () => this.buildCommand('100', action === 'start' ? '1' : '2'),
        action,
        stateKey: 'selectedStorageDcAction',
        successMsg: `储能DC${actionText}成功`,
        failMsg: `储能DC${actionText}失败`
      });
    },

    // PCS模式点击下发
    async handlePcsModeClick(mode) {
      const now = Date.now();
      const paramLastSendTime = this.lastSendTimes['pcsMode'] || 0;
      if (now - paramLastSendTime < 5000) {
        uni.showToast({
          title: '请间隔5秒后再下发',
          icon: 'none'
        });
        return;
      }

      this.lastSendTimes['pcsMode'] = Date.now();

      const modeMap = {
        'charge': '1',
        'discharge': '2',
        'off-grid': '3'
      };

      try {
        await sendCommandFrame({
          apiSufix: 't3401_171F_control',
          idCode: this.deviceConfig.idCode,
          typeCode: this.deviceConfig.typeCode,
          address: this.deviceConfig.address,
          userId: this.userId,
          commands: this.buildCommand('102', modeMap[mode] || '0')
        });
        this.selectedPcsMode = mode;
        uni.showToast({
          title: 'PCS模式下发成功',
          icon: 'success'
        });
      } catch (error) {
        console.error('pcsModeControl error:', error);
        uni.showToast({
          title: 'PCS模式下发失败',
          icon: 'none'
        });
      }
    },

    // 编辑配置相关方法
    handleEditConfig() {
      this.isEditing = true;
      uni.showToast({
        title: '已进入编辑模式',
        icon: 'success'
      });
    },

    closeEdit() {
      this.isEditing = false;
      this.editingChargePower = false;
      this.editingDischargePower = false;
      uni.showToast({
        title: '已退出编辑模式',
        icon: 'success'
      });
    },

    // 充电功率编辑相关方法
    handleEditChargePower() {
      if (!this.isEditing) {
        uni.showToast({
          title: '请先点击修改配置',
          icon: 'none'
        });
        return;
      }
      this.editingChargePower = true;
      this.tempChargePower = this.chargePower || '';
    },

    cancelEditChargePower() {
      this.editingChargePower = false;
      this.tempChargePower = '';
    },

    validateTempChargePower() {
      let value = String(this.tempChargePower);
      value = value.replace(/[^\d]/g, '');
      if (value.length > 2) {
        value = value.substring(0, 2);
      }
      if (value.length > 1 && value[0] === '0') {
        value = value.replace(/^0+/, '');
      }
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue < 1) {
        value = '';
      } else if (numValue > 10) {
        value = '10';
      }
      if (value !== this.tempChargePower) {
        this.tempChargePower = value;
      }
    },

    async submitChargePower() {
      if (!this.tempChargePower) {
        uni.showToast({
          title: '请输入充电功率',
          icon: 'none'
        });
        return;
      }

      const now = Date.now();
      const paramLastSendTime = this.lastSendTimes['chargePower'] || 0;
      if (now - paramLastSendTime < 5000) {
        uni.showToast({
          title: '请间隔5秒后再下发',
          icon: 'none'
        });
        return;
      }

      this.isSubmittingChargePower = true;
      this.lastSendTimes['chargePower'] = Date.now();

      try {
        await sendCommandFrame({
          apiSufix: 't3401_171F_control',
          idCode: this.deviceConfig.idCode,
          typeCode: this.deviceConfig.typeCode,
          address: this.deviceConfig.address,
          userId: this.userId,
          commands: this.buildCommand('104', this.tempChargePower * 10)
        });
        this.chargePower = this.tempChargePower;
        this.editingChargePower = false;
        uni.showToast({
          title: '充电功率下发成功',
          icon: 'success'
        });
      } catch (error) {
        console.error('chargePowerControl error:', error);
        uni.showToast({
          title: '充电功率下发失败',
          icon: 'none'
        });
      } finally {
        this.isSubmittingChargePower = false;
      }
    },

    // 放电功率编辑相关方法
    handleEditDischargePower() {
      if (!this.isEditing) {
        uni.showToast({
          title: '请先点击修改配置',
          icon: 'none'
        });
        return;
      }
      this.editingDischargePower = true;
      this.tempDischargePower = this.dischargePower || '';
    },

    cancelEditDischargePower() {
      this.editingDischargePower = false;
      this.tempDischargePower = '';
    },

    validateTempDischargePower() {
      let value = String(this.tempDischargePower);
      value = value.replace(/[^\d]/g, '');
      if (value.length > 2) {
        value = value.substring(0, 2);
      }
      if (value.length > 1 && value[0] === '0') {
        value = value.replace(/^0+/, '');
      }
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue < 1) {
        value = '';
      } else if (numValue > 10) {
        value = '10';
      }
      if (value !== this.tempDischargePower) {
        this.tempDischargePower = value;
      }
    },

    async submitDischargePower() {
      if (!this.tempDischargePower) {
        uni.showToast({
          title: '请输入放电功率',
          icon: 'none'
        });
        return;
      }

      const now = Date.now();
      const paramLastSendTime = this.lastSendTimes['dischargePower'] || 0;
      if (now - paramLastSendTime < 5000) {
        uni.showToast({
          title: '请间隔5秒后再下发',
          icon: 'none'
        });
        return;
      }

      this.isSubmittingDischargePower = true;
      this.lastSendTimes['dischargePower'] = Date.now();

      try {
        await sendCommandFrame({
          apiSufix: 't3401_171F_control',
          idCode: this.deviceConfig.idCode,
          typeCode: this.deviceConfig.typeCode,
          address: this.deviceConfig.address,
          userId: this.userId,
          commands: this.buildCommand('106', this.tempDischargePower * 10)
        });
        this.dischargePower = this.tempDischargePower;
        this.editingDischargePower = false;
        uni.showToast({
          title: '放电功率下发成功',
          icon: 'success'
        });
      } catch (error) {
        console.error('dischargePowerControl error:', error);
        uni.showToast({
          title: '放电功率下发失败',
          icon: 'none'
        });
      } finally {
        this.isSubmittingDischargePower = false;
      }
    },

    getPcsModeText(mode) {
      const map = {
        'charge': '并网充电',
        'discharge': '并网放电',
        'off-grid': '离网'
      };
      return map[mode] || '';
    }
  }
}
</script>

<style lang="scss" scoped>
$main-color: #4080f0;
$text-dark: #2d3036;
$text-gray: #868c98;

.quick-control {
  background: linear-gradient(180deg, #f0f4f8 0%, #f5f7fa 100%);
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
}

.content {
  padding: 24rpx;
}

// 全局编辑栏
.global-edit-bar {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 24rpx;
  padding-bottom: 0;
  // background: #ffffff;
  // margin-bottom: 16rpx;
}

.control-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 12rpx;
}

.card-title {
  font-size: 34rpx;
  font-weight: bold;
  color: $text-dark;
  padding: 8px 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
  letter-spacing: 2rpx;
}

.control-section {
  padding: 12rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-of-type {
    border-bottom: none;
  }
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: $text-dark;
  margin-bottom: 20rpx;
  display: block;
}

// 参数行样式
.param-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
}

.param-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.param-name {
  font-size: 28rpx;
  color: $text-dark;
  font-weight: 500;
}

.param-value {
  font-size: 24rpx;
  color: $text-gray;
}

.param-range {
  font-size: 22rpx;
  color: $text-gray;
  background: #f5f7fa;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
  width: fit-content;
}

.param-right-wrapper {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.switch-btns-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 0;
}

.switch-btns {
  display: flex;
  gap: 12rpx;
}

.switch-btn {
  padding: 12rpx 20rpx;
  font-size: 24rpx;
  font-weight: 500;
  background: #ffffff;
  border-radius: 8rpx;
  border: 2rpx solid #e8eaed;
  color: #666;
  transition: all 0.3s;
  white-space: nowrap;

  &:active {
    transform: scale(0.96);
  }

  &.btn-active {
    background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
    border-color: #6699ff;
    color: #ffffff;
    box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);
  }
}

.param-right {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.param-value-box {
  width: 140rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 1rpx solid #e8eaed;
  border-radius: 8rpx;
  transition: all 0.3s;

  &.editing {
    background: #ffffff;
    border-color: $main-color;
    box-shadow: 0 0 0 4rpx rgba(64, 128, 240, 0.1);
  }
}

.val-text {
  font-size: 26rpx;
  color: $text-dark;
}

.val-input {
  width: 100%;
  height: 100%;
  font-size: 26rpx;
  text-align: center;
  background: transparent;
  border: none;
  color: $text-dark;
}

.unit-text {
  font-size: 24rpx;
  color: #666;
}

// 按钮样式
.btn-group {
  display: flex;
  gap: 12rpx;
}

.btn-group.vertical {
  flex-direction: column;
  flex-shrink: 0;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  padding: 12rpx 20rpx;
  font-size: 24rpx;
  border-radius: 8rpx;
  transition: all 0.3s;
  white-space: nowrap;

  &:active {
    transform: scale(0.96);
  }
}

.btn-edit {
  color: $main-color;
  background: rgba(64, 128, 240, 0.1);
}

.btn-sure {
  color: #ffffff;
  background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
  box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);

  &.btn-loading {
    opacity: 0.7;
  }
}

.btn-cancel {
  color: #666;
  background: #f5f7fa;
}

// 加载动画
.loading-spinner {
  width: 24rpx;
  height: 24rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  &.small {
    width: 20rpx;
    height: 20rpx;
    border-width: 2rpx;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// 模式选择器
.mode-selector {
  margin-top: 20rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.action-btns {
  display: flex;
  gap: 12rpx;
  margin-top: 20rpx;

  .btn {
    flex: 1;
  }
}

// 卡片头部
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.edit-btn {
  padding: 12rpx 28rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  transition: all 0.2s ease;

  &.primary {
    background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
    color: #ffffff;
    box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);

    &:active {
      transform: scale(0.95);
      box-shadow: 0 2rpx 6rpx rgba(102, 153, 255, 0.2);
    }
  }

  &.close {
    background: #f5f5f5;
    color: #666;
    border: 1rpx solid #e0e0e0;

    &:active {
      background: #e8e8e8;
    }
  }
}

.edit-text {
  font-size: 26rpx;
}

.btn-group {
  display: flex;
  gap: 20rpx;
  padding: 12rpx 32rpx;

  &.triple {
    &>.control-btn {
      flex: 1;
      min-width: calc(33.33% - 14rpx);
    }
  }
}

.control-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  font-size: 28rpx;
  font-weight: 500;
  background: #ffffff;
  border-radius: 12rpx;
  border: 2rpx solid #e8eaed;
  color: #333;
  transition: all 0.3s;
  white-space: nowrap;

  &:active {
    transform: scale(0.96);
  }

  &.active {
    background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
    border-color: #6699ff;
    color: #ffffff;
    box-shadow: 0 8rpx 24rpx rgba(102, 153, 255, 0.4);
  }

  &.btn-disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.power-setting {
  padding: 10rpx 0;
}

.power-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;

  &:not(:last-child) {
    border-bottom: 1rpx dashed #f0f0f0;
  }
}

.power-label-wrap {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.power-label {
  font-size: 28rpx;
  color: $text-dark;
  font-weight: 500;
}

.power-range {
  font-size: 22rpx;
  color: $text-gray;
  background: #f5f7fa;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
  width: fit-content;
}

.power-input-wrap {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.power-input {
  width: 160rpx;
  height: 64rpx;
  font-size: 28rpx;
  text-align: center;
  background: #f8f9fa;
  border: 1rpx solid #e8eaed;
  border-radius: 8rpx;
}

.power-unit {
  font-size: 26rpx;
  color: #666;
}

.submit-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  border-top: 1rpx solid #f5f5f5;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
  border-radius: 44rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 153, 255, 0.4);

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);
  }
}

input::placeholder {
  color: #999;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>