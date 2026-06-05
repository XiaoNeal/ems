<template>
  <view class="quick-control">
    <!-- 顶部导航栏 -->
    <u-navbar title="快捷控制" :autoBack="true" :placeholder="true" />
    
    <!-- 内容区域 -->
    <view class="content">
      <!-- PCS控制 -->
      <view class="control-card">
        <view class="card-header">
          <text class="card-title">PCS一键控制</text>
        </view>
        <view class="switch-btns-wrapper">
          <view class="switch-btns">
            <view 
              class="switch-btn" 
              :class="{ 'btn-active': selectedPcsAction === 'start' }"
              @click="pcsAction('start')"
            >
              开机
            </view>
            <view 
              class="switch-btn" 
              :class="{ 'btn-active': selectedPcsAction === 'stop' }"
              @click="pcsAction('stop')"
            >
              关机
            </view>
          </view>
        </view>
      </view>
      
      <!-- 光伏DC控制 -->
      <view class="control-card">
        <view class="card-header">
          <text class="card-title">光伏DC控制</text>
        </view>
        <view class="switch-btns-wrapper">
          <view class="switch-btns">
            <view 
              class="switch-btn" 
              :class="{ 'btn-active': selectedPvDcAction === 'start' }"
              @click="pvDcAction('start')"
            >
              开机
            </view>
            <view 
              class="switch-btn" 
              :class="{ 'btn-active': selectedPvDcAction === 'stop' }"
              @click="pvDcAction('stop')"
            >
              关机
            </view>
          </view>
        </view>
      </view>
      
      <!-- 储能DC控制 -->
      <view class="control-card">
        <view class="card-header">
          <text class="card-title">储能DC控制</text>
        </view>
        <view class="switch-btns-wrapper">
          <view class="switch-btns triple">
            <view 
              class="switch-btn" 
              :class="{ 'btn-active': selectedStorageDcAction === 'grid-connect' }"
              @click="storageDcAction('grid-connect')"
            >
              并网开机
            </view>
            <view 
              class="switch-btn" 
              :class="{ 'btn-active': selectedStorageDcAction === 'stop' }"
              @click="storageDcAction('stop')"
            >
              一键关机
            </view>
            <view 
              class="switch-btn" 
              :class="{ 'btn-active': selectedStorageDcAction === 'off-grid' }"
              @click="storageDcAction('off-grid')"
            >
              离网开机
            </view>
          </view>
        </view>
      </view>
      
      <!-- 储能模式 -->
      <view class="control-card">
        <view class="card-header">
          <text class="card-title">储能模式选择</text>
        </view>
        <view class="switch-btns-wrapper">
          <view class="switch-btns">
            <view 
              class="switch-btn charge" 
              :class="{ 'btn-active': selectedStorageMode === 'charge' }"
              @click="storageModeAction('charge')"
            >
              充电
            </view>
            <view 
              class="switch-btn discharge" 
              :class="{ 'btn-active': selectedStorageMode === 'discharge' }"
              @click="storageModeAction('discharge')"
            >
              放电
            </view>
          </view>
        </view>
      </view>
      
      <!-- 功率设置 -->
      <view class="control-card">
        <view class="card-header">
          <text class="card-title">充放电总功率</text>
        </view>
        <view class="param-row">
          <view class="param-info">
            <text class="param-name">功率值</text>
            <text class="param-range">范围: 1~10kW</text>
          </view>
          <view class="param-right-wrapper">
            <view class="param-right">
              <view class="param-value-box" :class="{ editing: powerValue }">
                <input 
                  type="digit" 
                  v-model="powerValue" 
                  placeholder="请输入" 
                  @input="validatePower" 
                  maxlength="2"
                  class="val-input"
                />
              </view>
              <text class="unit-text">kW</text>
            </view>
            <view class="btn btn-sure" @click="setPower">
              <text>下发</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部安全区域适配 -->
    <view class="safe-bottom"></view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'

export default {
  name: "QuickControl",
  data() {
    return {
      powerValue: '',
      // 设备配置参数（根据实际情况配置）
      deviceConfig: {
        idCode: '00 00 02 20 26 05 18 15 21 04 02 00 00 00 00',
        typeCode: '3401',
        address: '01'
      },
      // 当前选中的操作状态（空表示未选中/不启用）
      selectedPcsAction: '',
      selectedPvDcAction: '',
      selectedStorageDcAction: '',
      selectedStorageMode: '',
      // 参数级别发送时间记录
      lastSendTimes: {}
    };
  },
  computed: {
    userId() {
      return this.$store.state.userInfo?.userId || 0
    }
  },
  methods: {
    // 通用命令执行方法
    async executeCommand(options) {
      const { title, content, apiSufix, commandBuilder, action, stateKey, successMsg, failMsg } = options;
      
      // 参数级别时间限制检查
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
              // 记录发送时间
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
              // 更新选中状态
              if (stateKey) {
                this[stateKey] = action;
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
    
    // 构建通用命令
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
    
    // PCS操作
    pcsAction(action) {
      const actionText = action === 'start' ? '开机' : '关机';
      this.executeCommand({
        title: 'PCS一键控制',
        content: `确定要执行PCS${actionText}操作吗？`,
        apiSufix: 'pcsControl',
        commandBuilder: () => this.buildCommand('100', action === 'start' ? '1' : '0'),
        action,
        stateKey: 'selectedPcsAction',
        successMsg: `PCS${actionText}成功`,
        failMsg: `PCS${actionText}失败`
      });
    },
    
    // 光伏DC操作
    pvDcAction(action) {
      const actionText = action === 'start' ? '开机' : '关机';
      this.executeCommand({
        title: '光伏DC控制',
        content: `确定要执行光伏DC${actionText}操作吗？`,
        apiSufix: 'pvDcControl',
        commandBuilder: () => this.buildCommand('102', action === 'start' ? '1' : '0'),
        action,
        stateKey: 'selectedPvDcAction',
        successMsg: `光伏DC${actionText}成功`,
        failMsg: `光伏DC${actionText}失败`
      });
    },
    
    // 储能DC操作 (1:并网一键开机, 2:一键关机, 3:离网一键开机)
    storageDcAction(action) {
      const actionMap = {
        'grid-connect': '并网一键开机',
        'stop': '一键关机',
        'off-grid': '离网一键开机'
      };
      const valueMap = {
        'grid-connect': '1',
        'stop': '2',
        'off-grid': '3'
      };
      this.executeCommand({
        title: '储能DC控制',
        content: `确定要执行储能DC${actionMap[action]}操作吗？`,
        apiSufix: 'storageDcControl',
        commandBuilder: () => this.buildCommand('104', valueMap[action] || '0'),
        action,
        stateKey: 'selectedStorageDcAction',
        successMsg: `储能DC${actionMap[action]}成功`,
        failMsg: `储能DC${actionMap[action]}失败`
      });
    },
    
    // 储能模式操作
    storageModeAction(mode) {
      const modeText = mode === 'charge' ? '充电' : '放电';
      this.executeCommand({
        title: '储能模式选择',
        content: `确定要设置储能为${modeText}模式吗？`,
        apiSufix: 'storageModeControl',
        commandBuilder: () => this.buildCommand('106', mode === 'charge' ? '1' : '2'),
        mode,
        stateKey: 'selectedStorageMode',
        successMsg: `储能${modeText}模式设置成功`,
        failMsg: `储能${modeText}模式设置失败`
      });
    },
    
    // 功率输入验证
    validatePower() {
      let value = String(this.powerValue);
      // 只能输入数字0-9
      value = value.replace(/[^\d]/g, '');
      // 限制最多2位数字
      if (value.length > 2) {
        value = value.substring(0, 2);
      }
      // 去除前导0
      if (value.length > 1 && value[0] === '0') {
        value = value.replace(/^0+/, '');
      }
      // 范围限制：1-10kW
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue < 1) {
        value = '';
      } else if (numValue > 10) {
        value = '10';
      }
      if (value !== this.powerValue) {
        this.powerValue = value;
      }
    },
    
    // 功率设置
    setPower() {
      if (!this.powerValue || parseFloat(this.powerValue) < 1) {
        uni.showToast({
          title: '请输入1-10kW范围内的功率值',
          icon: 'none'
        });
        return;
      }
      
      const power = this.powerValue;
      this.executeCommand({
        title: '充放电总功率设置',
        content: `确定要设置充放电总功率为${power}kW吗？`,
        apiSufix: 'powerControl',
        commandBuilder: () => this.buildCommand('108', power * 10),
        stateKey: null,
        successMsg: `充放电总功率设置为${power}kW成功`,
        failMsg: '充放电总功率设置失败'
      }).then((success) => {
        if (success) {
          this.powerValue = '';
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.quick-control {
  background: linear-gradient(180deg, #f0f4f8 0%, #f5f7fa 100%);
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
}

.content {
  padding: 24rpx;
  padding-bottom: 48rpx;
}

.control-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 24rpx;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.99);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 36rpx;
  border-bottom: 1rpx solid #f5f5f5;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
}

.card-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #2c3e50;
  position: relative;
  padding-left: 24rpx;
  letter-spacing: 1rpx;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8rpx;
    height: 32rpx;
    background: linear-gradient(180deg, #6699ff 0%, #4488fb 100%);
    border-radius: 4rpx;
    box-shadow: 0 0 12rpx rgba(102, 153, 255, 0.4);
  }
}

// 开关按钮样式
.switch-btns-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx 24rpx;
}

.switch-btns {
  display: flex;
  gap: 20rpx;
  width: 100%;
  
  &.triple {
    & > .switch-btn {
      flex: 1;
      min-width: calc(33.33% - 14rpx);
    }
  }
}

.switch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 32rpx;
  font-size: 28rpx;
  font-weight: 500;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border-radius: 12rpx;
  border: 2rpx solid #e8eaed;
  color: #666;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  text-align: center;
  min-width: 120rpx;
  
  &:active {
    transform: scale(0.96);
    background: #f0f2f5;
  }
  
  &.btn-active {
    background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
    border-color: #6699ff;
    color: #ffffff;
    box-shadow: 0 8rpx 24rpx rgba(102, 153, 255, 0.4);
    transform: translateY(-2rpx);
    
    &:active {
      background: linear-gradient(135deg, #5588ee 0%, #3377ea 100%);
      box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);
      transform: translateY(0);
    }
  }
  
  &.charge.btn-active {
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
    border-color: #00d4aa;
    box-shadow: 0 8rpx 24rpx rgba(0, 212, 170, 0.4);
  }
  
  &.discharge.btn-active {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
    border-color: #ff6b6b;
    box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.4);
  }
}

// 参数行样式
.param-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20rpx;
  padding: 32rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.param-info {
  flex: 0 0 auto;
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.param-name {
  font-size: 30rpx;
  color: #2c3e50;
  font-weight: 500;
  line-height: 1.4;
}

.param-range {
  font-size: 24rpx;
  color: #999;
  background: #f5f7fa;
  padding: 6rpx 12rpx;
  border-radius: 6rpx;
  display: inline-block;
  width: fit-content;
}

.param-right-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20rpx;
  flex: 1;
  min-width: 320rpx;
}

.param-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.param-value-box {
  width: 180rpx;
  height: 72rpx;
  line-height: 72rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
  border-radius: 12rpx;
  text-align: center;
  border: 2rpx solid #e8eaed;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.editing {
    background: #ffffff;
    border-color: #6699ff;
    box-shadow: 0 0 0 6rpx rgba(102, 153, 255, 0.12), 0 4rpx 16rpx rgba(102, 153, 255, 0.15);
    transform: translateY(-2rpx);
  }
}

.val-input {
  width: 100%;
  height: 100%;
  font-size: 32rpx;
  font-weight: 600;
  text-align: center;
  background: transparent;
  border: none;
  color: #2c3e50;
  
  &:focus {
    outline: none;
  }
}

.unit-text {
  font-size: 28rpx;
  color: #666;
  min-width: 70rpx;
  text-align: left;
  font-weight: 500;
}

.btn {
  padding: 16rpx 28rpx;
  font-size: 28rpx;
  font-weight: 500;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-sure {
  color: #ffffff;
  background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
  box-shadow: 0 8rpx 24rpx rgba(102, 153, 255, 0.4);
  min-width: 120rpx;
  
  &:active {
    transform: scale(0.96);
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