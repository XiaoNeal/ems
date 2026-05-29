<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <u-navbar title="快捷控制" :autoBack="true" :placeholder="true" />
    
    <!-- 内容区域 -->
    <view class="content">
      <view class="control-section inline-section">
        <text class="section-title">PCS一键开机</text>
        <view class="action-buttons">
          <view 
            class="action-btn secondary" 
            :class="{ selected: selectedPcsAction === 'start' }"
            @click="pcsAction('start')"
          >开机</view>
          <view 
            class="action-btn secondary" 
            :class="{ selected: selectedPcsAction === 'stop' }"
            @click="pcsAction('stop')"
          >关机</view>
        </view>
      </view>
      
      <view class="control-section inline-section">
        <text class="section-title">光伏DC开机</text>
        <view class="action-buttons">
          <view 
            class="action-btn secondary" 
            :class="{ selected: selectedPvDcAction === 'start' }"
            @click="pvDcAction('start')"
          >开机</view>
          <view 
            class="action-btn secondary" 
            :class="{ selected: selectedPvDcAction === 'stop' }"
            @click="pvDcAction('stop')"
          >关机</view>
        </view>
      </view>
      
      <view class="control-section">
        <text class="section-title">储能DC开关机</text>
        <view class="action-buttons">
          <view 
            class="action-btn secondary" 
            :class="{ selected: selectedStorageDcAction === 'grid-connect' }"
            @click="storageDcAction('grid-connect')"
          >并网一键开机</view>
          <view 
            class="action-btn secondary" 
            :class="{ selected: selectedStorageDcAction === 'stop' }"
            @click="storageDcAction('stop')"
          >一键关机</view>
          <view 
            class="action-btn secondary" 
            :class="{ selected: selectedStorageDcAction === 'off-grid' }"
            @click="storageDcAction('off-grid')"
          >离网一键开机</view>
        </view>
      </view>
      
      <view class="control-section inline-section">
        <text class="section-title">储能充放电选择</text>
        <view class="action-buttons">
          <view 
            class="action-btn secondary" 
            :class="{ selected: selectedStorageMode === 'charge' }"
            @click="storageModeAction('charge')"
          >充电</view>
          <view 
            class="action-btn secondary" 
            :class="{ selected: selectedStorageMode === 'discharge' }"
            @click="storageModeAction('discharge')"
          >放电</view>
        </view>
      </view>
      
      <view class="control-section">
        <text class="section-title">充放电总功率</text>
        <view class="power-setting">
          <input type="text" v-model="powerValue" placeholder="请输入功率值(1-10kW)" @input="validatePower" maxlength="2" />
          <text class="unit">kW</text>
        </view>
        <view class="action-buttons">
          <view class="action-btn primary" @click="setPower">确认设置</view>
        </view>
      </view>
    </view>
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
        idCode: 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF',
        typeCode: '3401',
        address: '01'
      },
      // 当前选中的操作状态（空表示未选中/不启用）
      selectedPcsAction: '',
      selectedPvDcAction: '',
      selectedStorageDcAction: '',
      selectedStorageMode: ''
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
      const { title, content, apiSufix, commandBuilder, action, stateKey } = options;
      
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
                title: `${title}成功`,
                icon: 'success'
              });
              resolve(true);
            } catch (error) {
              uni.hideLoading();
              uni.showToast({
                title: `${title}失败`,
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
        title: 'PCS一键开机',
        content: `确定要执行PCS${actionText}操作吗？`,
        apiSufix: 'pcsControl',
        commandBuilder: () => this.buildCommand('100', action === 'start' ? '1' : '0'),
        action,
        stateKey: 'selectedPcsAction'
      });
    },
    
    // 光伏DC操作
    pvDcAction(action) {
      const actionText = action === 'start' ? '开机' : '关机';
      this.executeCommand({
        title: '光伏DC开机',
        content: `确定要执行光伏DC${actionText}操作吗？`,
        apiSufix: 'pvDcControl',
        commandBuilder: () => this.buildCommand('102', action === 'start' ? '1' : '0'),
        action,
        stateKey: 'selectedPvDcAction'
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
        title: '储能DC开关机',
        content: `确定要执行储能DC${actionMap[action]}操作吗？`,
        apiSufix: 'storageDcControl',
        commandBuilder: () => this.buildCommand('104', valueMap[action] || '0'),
        action,
        stateKey: 'selectedStorageDcAction'
      });
    },
    
    // 储能模式操作
    storageModeAction(mode) {
      const modeText = mode === 'charge' ? '充电' : '放电';
      this.executeCommand({
        title: '储能充放电选择',
        content: `确定要设置储能为${modeText}模式吗？`,
        apiSufix: 'storageModeControl',
        commandBuilder: () => this.buildCommand('106', mode === 'charge' ? '1' : '2'),
        mode,
        stateKey: 'selectedStorageMode'
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
        stateKey: null
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
.container {
  min-height: 100vh;
  background: #F5F7FA;
}

.content {
  padding: 24rpx;
}

.control-section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);

  &.inline-section {
    .action-buttons {
      margin-top: 24rpx;
    }
  }
}

.section-title {
  font-size: 28rpx;
  color: #1F2937;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
}

.action-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 16rpx;
  text-align: center;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
    color: #ffffff;
    box-shadow: 0 8rpx 24rpx rgba(68, 136, 251, 0.3);
  }

  &.secondary {
    background: #F3F4F6;
    color: #6B7280;
    border: 2rpx solid #E4E7ED;

    &.selected {
      background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
      color: #ffffff;
      border-color: #4488FB;
      box-shadow: 0 8rpx 24rpx rgba(68, 136, 251, 0.3);
    }
  }

  &.tertiary {
    background: linear-gradient(135deg, #00D4AA 0%, #00B894 100%);
    color: #ffffff;
    box-shadow: 0 8rpx 24rpx rgba(0, 212, 170, 0.3);
  }

  &:active {
    transform: scale(0.96);
  }
}

.power-setting {
  display: flex;
  align-items: center;
  margin-top: 24rpx;
  padding: 20rpx 24rpx;
  background: #F8FAFC;
  border-radius: 12rpx;
  border: 2rpx solid #E5E7EB;

  input {
    flex: 1;
    font-size: 30rpx;
    color: #1F2937;
    border: none;
    outline: none;
    background: transparent;
  }

  .unit {
    font-size: 28rpx;
    color: #6B7280;
    margin-left: 16rpx;
  }
}

input::placeholder {
  color: #9CA3AF;
}
</style>