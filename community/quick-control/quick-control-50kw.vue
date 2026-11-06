<template>
  <view class="quick-control" :class="platformClass">
    <DyNavbar title="快捷控制" :placeholder="true" />
    <view class="fixed-placeholder"></view>

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
      <!-- 储能综合控制：储能DC开关机 + 充放电选择 + 充放电总功率 一个报文统一下发 -->
      <view class="control-card">
        <view class="card-title">储能综合控制</view>

        <!-- 储能DC开关机 -->
        <view class="control-section">
          <view class="section-title">储能DC开关机</view>
          <view class="btn-group triple">
            <view class="control-btn" :class="{ active: storageDcAction === 'grid-connect', 'btn-disabled': !isEditing }"
              @click="selectStorageDcAction('grid-connect')">
              并网一键开机
            </view>
            <view class="control-btn" :class="{ active: storageDcAction === 'stop', 'btn-disabled': !isEditing }"
              @click="selectStorageDcAction('stop')">
              一键关机
            </view>
            <view class="control-btn" :class="{ active: storageDcAction === 'off-grid', 'btn-disabled': !isEditing }"
              @click="selectStorageDcAction('off-grid')">
              离网一键开机
            </view>
          </view>
        </view>

        <!-- 储能充放电选择 -->
        <view class="control-section">
          <view class="section-title">储能充放电选择</view>
          <view class="btn-group">
            <view class="control-btn charge" :class="{ active: storageMode === 'charge', 'btn-disabled': !isEditing }"
              @click="selectStorageMode('charge')">
              充电
            </view>
            <view class="control-btn discharge" :class="{ active: storageMode === 'discharge', 'btn-disabled': !isEditing }"
              @click="selectStorageMode('discharge')">
              放电
            </view>
          </view>
        </view>

        <!-- 充放电总功率 -->
        <view class="control-section">
          <view class="section-title">充放电总功率</view>
          <view class="param-row">
            <view class="param-info">
              <text class="param-name">总功率</text>
              <text class="param-range">范围: 1~50kW</text>
            </view>
            <view class="param-right-wrapper">
              <view class="param-right">
                <view class="param-value-box" :class="{ editing: isEditing }">
                  <text v-if="!isEditing" class="val-text">{{ currentPower }}</text>
                  <input v-else class="val-input" type="digit" v-model="powerValue" placeholder="请输入"
                    @input="validatePower" maxlength="2" />
                </view>
                <text class="unit-text">kW</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 统一下发按钮（一个报文） -->
        <view class="submit-wrapper">
          <view class="btn btn-submit" :class="{ 'btn-disabled': !isEditing }" @click="submitStorageAll">
            <text>下发</text>
          </view>
        </view>
      </view>

      <!-- PCS一键开机（单独下发：协议仅支持开机指令） -->
      <view class="control-card">
        <view class="card-title">PCS一键开机</view>
        <view class="btn-group">
          <view class="control-btn" :class="{ active: pcsStartStatus === 'start', 'btn-disabled': !isEditing }"
            @click="pcsOneKeyStart">
            一键开机
          </view>
        </view>
      </view>

      <!-- 光伏DC控制（单独下发） -->
      <view class="control-card">
        <view class="card-title">光伏DC控制</view>
        <view class="btn-group">
          <view class="control-btn" :class="{ active: pvDcStatus === 'start', 'btn-disabled': !isEditing }"
            @click="pvDcAction('start')">
            一键开机
          </view>
          <view class="control-btn" :class="{ active: pvDcStatus === 'stop', 'btn-disabled': !isEditing }"
            @click="pvDcAction('stop')">
            关机
          </view>
        </view>
      </view>

      <!-- 策略启动（圆形启动按钮，单独下发） -->
      <view class="control-card">
        <view class="card-title">策略启动</view>
        <view class="start-wrapper">
          <view class="start-circle" @click="handleStartStop">
            <image src="/static/images/start.svg" class="start-bg" />
            <text class="start-text" :class="{ running: systemRunning }">{{ systemRunning ? '运行中' : '启动' }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="safe-bottom"></view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'
import { realtimeDataProvider } from '@/service/websocket'

// 50kW EMS(0x171F) 快捷控制寄存器地址，取自《EMS(0x171F)》点表「地址(byte)」列：
// PCS一键开机=331、光伏DC开机=333、储能DC开关机=335、储能充放电选择=337、
// 充放电总功率=339（传输值=实际值×10）、启动按钮=343。
// 注：储能DC开关机、充放电选择、总功率 必须放在一个报文里下发；
//     PCS一键开机、光伏DC开机、启动按钮 为单独下发。
const ADDR_PCS_START = '331';      // PCS一键开机：0 否（默认），1 是（网关自动设 PCS 恒压模式/母线750V/开机）
const ADDR_PV_DC = '333';          // 光伏DC开机：0 不启用（默认），1 开机，2 关机
const ADDR_STORAGE_SWITCH = '335'; // 储能DC开关机：0 不启用（默认），1 并网一键开机，2 一键关机，3 离网一键开机
const ADDR_STORAGE_MODE = '337';   // 储能充放电选择：0 不充不放（默认），1 充电，2 放电（仅开关机=1 时有效）
const ADDR_STORAGE_POWER = '339';  // 充放电总功率：传输值=实际值×10（0.1kW）
const ADDR_SYSTEM_START = '343';   // 启动按钮：0 默认/停止，1 开启

export default {
  components: {
    DyNavbar
  },
  name: "QuickControl50kW",
  data() {
    return {
      platformClass: "",
      // 下发网关（homeBarCode）
      sendBarCode: '',
      // 接收网关（171F 设备实际连接的 gateway）
      receiveBarCode: '',
      sendConfig: {
        typeCode: '3401',
        address: '01'
      },
      // 储能综合控制选择
      storageDcAction: '',
      storageMode: '',
      powerValue: '',
      // 数据版本号，强制触发响应式更新
      _dataVersion: 0,
      // 参数级别发送时间记录
      lastSendTimes: {},
      // 编辑模式
      isEditing: false
    };
  },
  computed: {
    userId() {
      return this.$store.state.userInfo?.userId || 0
    },
    // 订阅设备列表变化：_dataVersion 作为响应式触发源
    deviceList() {
      const _ = this._dataVersion
      return realtimeDataProvider.getDeviceList()
    },
    device171F() {
      const list = this.deviceList
      // 按接收网关匹配
      let device = list.find(item => item && item.deviceType === '171F' && item.barCode === this.receiveBarCode)
      return device
    },
    controlData() {
      return (this.device171F && this.device171F.controlData) || {}
    },
    // 储能DC开关机状态（B4：1 并网开机，2 关机，3 离网开机）
    storageDcStatus() {
      const v = this.controlData.B4?.value
      if (v === 1 || v === '1') return 'grid-connect'
      if (v === 2 || v === '2') return 'stop'
      if (v === 3 || v === '3') return 'off-grid'
      return this.storageDcAction || ''
    },
    // 储能充放电选择状态（B6：1 充电，2 放电）
    storageModeStatus() {
      const v = this.controlData.B6?.value
      if (v === 1 || v === '1') return 'charge'
      if (v === 2 || v === '2') return 'discharge'
      return this.storageMode || ''
    },
    // 充放电总功率（B8：传输值=实际值×10，0.1kW）
    currentPower() {
      const v = this.controlData.B8?.value
      if (v !== undefined && v !== null && v !== '--' && v !== '') {
        const num = parseFloat(v)
        if (!isNaN(num)) return (num / 10).toFixed(1)
      }
      return '--'
    },
    // PCS一键开机状态（B0：0 否，1 是）
    pcsStartStatus() {
      const v = this.controlData.B0?.value
      if (v === 1 || v === '1') return 'start'
      return ''
    },
    // 光伏DC状态（B2：1 开机，2 关机）
    pvDcStatus() {
      const v = this.controlData.B2?.value
      if (v === 1 || v === '1') return 'start'
      if (v === 2 || v === '2') return 'stop'
      return ''
    },
    // 策略启动状态（B12 启动按钮：0 默认，1 开启）
    systemRunning() {
      const v = this.controlData.B12?.value
      return v === 1 || v === '1'
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === "ios" ? "ios-platform" : "android-platform";
      },
    });

    // 先设置回调（在 initDevice 之前就绑定好，确保实时数据到达时能立刻更新）
    realtimeDataProvider.onDataUpdate = () => {
      this._dataVersion++;
    };

    // 清空旧设备列表，防止跨页面残留的不同网关设备导致显示与下发不一致
    realtimeDataProvider.clearDeviceState();

    // 注册 171F 设备
    this.init171FDevice();

    // 立即触发一次数据刷新
    this._dataVersion++;
  },
  methods: {
    init171FDevice() {
      const currentDevice = this.$store.state.currentSelectDevice || {};

      // 下发：通过 controlType == 1 查找控制设备，使用 homeBarCode
      const deviceControl = currentDevice.list && currentDevice.list.find(item => item.controlType == 1);
      if (deviceControl) {
        this.sendBarCode = deviceControl.homeBarCode;
      }

      // 接收：通过 171F 类型查找设备，使用 barCode
      let address = '';
      if (currentDevice.list && Array.isArray(currentDevice.list)) {
        const foundDevice = currentDevice.list.find(item =>
          item.typeCode === '171F' || item.deviceType === '171F' || item.description?.includes('171F')
        );
        if (foundDevice) {
          this.receiveBarCode = foundDevice.barCode;
          address = foundDevice.address;
        }
      }

      const deviceConfig = {
        deviceType: '171F',
        typeCode: '171F',
        address: address,
        barCode: this.receiveBarCode,
        deviceId: '171F001',
        name: 'EMS网关171F'
      };

      realtimeDataProvider.initDeviceList([deviceConfig]);
    },
    // 编辑配置入口：角色 / 在线 / 策略运行三重校验（与 20kW 快捷控制一致）
    handleEditConfig() {
      const currentRoleId = this.$store.state.currentEsRoleId
      if (![1, 2, 4, 5].includes(currentRoleId)) {
        uni.showToast({ title: '无权限操作', icon: 'none' });
        return;
      }
      const b0Value = this.controlData.B0 && this.controlData.B0.value

      if (b0Value === undefined || b0Value === null || b0Value === '' || b0Value === '--') {
        uni.showModal({
          title: '提示',
          content: '当前设备离线，暂不支持修改',
          showCancel: false
        })
        return
      }

      if (this.systemRunning) {
        uni.showModal({
          title: '提示',
          content: '策略运行中，参数修改需停止策略！！！',
          showCancel: false
        })
        return
      }

      // 进入编辑模式时，用当前实际功率预填输入框
      this.powerValue = this.currentPower !== '--' ? String(Math.round(parseFloat(this.currentPower))) : '';
      this.isEditing = true;
      uni.showToast({
        title: '已进入编辑模式',
        icon: 'success'
      });
    },
    closeEdit() {
      this.isEditing = false;
      this.powerValue = '';
      uni.showToast({
        title: '已退出编辑模式',
        icon: 'none'
      });
    },
    // 编辑模式守卫
    ensureEditing() {
      if (!this.isEditing) {
        uni.showToast({
          title: '请先点击修改配置',
          icon: 'none'
        });
        return false;
      }
      return true;
    },
    // 参数级别 5 秒节流
    checkThrottle(apiSufix) {
      const now = Date.now();
      const paramLastSendTime = this.lastSendTimes[apiSufix] || 0;
      if (now - paramLastSendTime < 5000) {
        uni.showToast({
          title: '请间隔5秒后再下发',
          icon: 'none'
        });
        return false;
      }
      this.lastSendTimes[apiSufix] = Date.now();
      return true;
    },
    // 构建单条寄存器命令
    buildCommand(registerAddress, registerValue) {
      return {
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
      };
    },
    // 通用下发
    async sendCommands(apiSufix, commands) {
      return sendCommandFrame({
        apiSufix,
        idCode: this.sendBarCode,
        typeCode: this.sendConfig.typeCode,
        address: this.sendConfig.address,
        userId: this.userId,
        commands
      });
    },
    // 功率输入验证：1~50kW
    validatePower() {
      let value = String(this.powerValue);
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
      } else if (numValue > 50) {
        value = '50';
      }
      if (value !== this.powerValue) {
        this.powerValue = value;
      }
    },
    selectStorageDcAction(action) {
      if (!this.ensureEditing()) return;
      this.storageDcAction = action;
    },
    selectStorageMode(mode) {
      if (!this.ensureEditing()) return;
      this.storageMode = mode;
    },
    // 储能综合控制统一下发：储能DC开关机 + 充放电选择 + 总功率 在一个报文中
    submitStorageAll() {
      if (!this.ensureEditing()) return;

      if (!this.storageDcAction) {
        uni.showToast({ title: '请选择储能DC开关机', icon: 'none' });
        return;
      }
      if (!this.storageMode) {
        uni.showToast({ title: '请选择储能充放电', icon: 'none' });
        return;
      }
      if (!this.powerValue || parseFloat(this.powerValue) < 1) {
        uni.showToast({ title: '请输入1-50kW范围内的功率值', icon: 'none' });
        return;
      }

      const actionMap = {
        'grid-connect': '并网一键开机',
        'stop': '一键关机',
        'off-grid': '离网一键开机'
      };
      const modeText = this.storageMode === 'charge' ? '充电' : '放电';
      const actionValueMap = { 'grid-connect': '1', 'stop': '2', 'off-grid': '3' };
      const modeValueMap = { 'charge': '1', 'discharge': '2' };

      // 三项合并为一个 commands 数组 → 一个报文下发
      const commands = [
        this.buildCommand(ADDR_STORAGE_SWITCH, actionValueMap[this.storageDcAction]),
        this.buildCommand(ADDR_STORAGE_MODE, modeValueMap[this.storageMode]),
        this.buildCommand(ADDR_STORAGE_POWER, parseInt(this.powerValue, 10) * 10)
      ];

      if (!this.checkThrottle('storageAll')) return;

      uni.showModal({
        title: '储能综合控制',
        content: `确定要执行以下操作吗？\n• 储能DC: ${actionMap[this.storageDcAction]}\n• 充放电选择: ${modeText}\n• 充放电总功率: ${this.powerValue}kW`,
        success: async (res) => {
          if (!res.confirm) {
            return;
          }
          uni.showLoading({ title: '下发中...' });
          try {
            await this.sendCommands('t3401_171F_control', commands);
            uni.hideLoading();
            uni.showToast({ title: '下发成功', icon: 'success' });
          } catch (error) {
            uni.hideLoading();
            uni.showToast({ title: '下发失败', icon: 'none' });
            console.error('storageAll error:', error);
          }
        }
      });
    },
    // PCS一键开机（单独下发，协议仅支持开机指令）
    pcsOneKeyStart() {
      if (!this.ensureEditing()) return;
      if (!this.checkThrottle('pcsStart')) return;

      uni.showModal({
        title: 'PCS一键开机',
        content: '确定要执行PCS一键开机操作吗？\n（网关将自动设置PCS恒压模式、母线电压750V并开机）',
        success: async (res) => {
          if (!res.confirm) return;
          uni.showLoading({ title: '下发中...' });
          try {
            await this.sendCommands('pcsControl', [this.buildCommand(ADDR_PCS_START, '1')]);
            uni.hideLoading();
            uni.showToast({ title: 'PCS一键开机成功', icon: 'success' });
          } catch (error) {
            uni.hideLoading();
            uni.showToast({ title: 'PCS一键开机失败', icon: 'none' });
            console.error('pcsStart error:', error);
          }
        }
      });
    },
    // 光伏DC开机/关机（单独下发）
    pvDcAction(action) {
      if (!this.ensureEditing()) return;
      if (!this.checkThrottle('pvDcControl')) return;

      const actionText = action === 'start' ? '开机' : '关机';
      uni.showModal({
        title: '光伏DC控制',
        content: `确定要执行光伏DC${actionText}操作吗？`,
        success: async (res) => {
          if (!res.confirm) return;
          uni.showLoading({ title: '下发中...' });
          try {
            await this.sendCommands('pvDcControl', [this.buildCommand(ADDR_PV_DC, action === 'start' ? '1' : '2')]);
            uni.hideLoading();
            uni.showToast({ title: `光伏DC${actionText}成功`, icon: 'success' });
          } catch (error) {
            uni.hideLoading();
            uni.showToast({ title: `光伏DC${actionText}失败`, icon: 'none' });
            console.error('pvDcControl error:', error);
          }
        }
      });
    },
    // 策略启动/停止（圆形启动按钮，单独下发；不受编辑模式限制）
    handleStartStop() {
      const b12Value = this.controlData.B12 && this.controlData.B12.value;
      if (b12Value === undefined || b12Value === null || b12Value === '' || b12Value === '--') {
        uni.showModal({
          title: '提示',
          content: '当前设备离线，暂不支持下发指令',
          showCancel: false
        });
        return;
      }
      if (!this.checkThrottle('systemControl')) return;

      const isRunning = this.systemRunning;
      uni.showModal({
        title: isRunning ? '策略停止' : '策略启动',
        content: isRunning ? '确定要停止策略吗？' : '确定要启动策略吗？',
        success: async (res) => {
          if (!res.confirm) return;
          uni.showLoading({ title: '下发中...' });
          try {
            await this.sendCommands('systemControl', [this.buildCommand(ADDR_SYSTEM_START, isRunning ? '0' : '1')]);
            uni.hideLoading();
            uni.showToast({ title: isRunning ? '策略停止成功' : '策略启动成功', icon: 'success' });
          } catch (error) {
            uni.hideLoading();
            uni.showToast({ title: isRunning ? '策略停止失败' : '策略启动失败', icon: 'none' });
            console.error('systemControl error:', error);
          }
        }
      });
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

  &.android-platform {
    .fixed-placeholder { height: calc(25px + 44px + 20px); }
  }

  &.ios-platform {
    .fixed-placeholder {
      height: calc(44px);
      background: #fff;
    }
  }
}

// 全局编辑控制栏
.global-edit-bar {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 24rpx 0;
}

.edit-btn {
  padding: 12rpx 32rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.primary {
    background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
    box-shadow: 0 6rpx 20rpx rgba(102, 153, 255, 0.4);
  }

  &.close {
    background: #fff;
    border: 2rpx solid #e8eaed;
  }

  .edit-text {
    font-size: 26rpx;
    font-weight: 500;
    color: #ffffff;

    .close & {
      color: #666;
    }
  }

  &:active {
    transform: scale(0.96);
  }
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

  &:active {
    transform: scale(0.99);
  }
}

.card-title {
  font-size: 34rpx;
  font-weight: 600;
  color: $text-dark;
  padding: 32rpx 36rpx;
  border-bottom: 1rpx solid #f5f5f5;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  position: relative;
  padding-left: 60rpx;
  letter-spacing: 1rpx;

  &::before {
    content: '';
    position: absolute;
    left: 36rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 8rpx;
    height: 32rpx;
    background: linear-gradient(180deg, #6699ff 0%, #4488fb 100%);
    border-radius: 4rpx;
    box-shadow: 0 0 12rpx rgba(102, 153, 255, 0.4);
  }
}

.control-section {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-of-type {
    border-bottom: none;
  }
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-dark;
  margin-bottom: 20rpx;
  display: block;
  position: relative;
  padding-left: 20rpx;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6rpx;
    height: 24rpx;
    background: linear-gradient(180deg, #6699ff 0%, #4488fb 100%);
    border-radius: 3rpx;
  }
}

.btn-group {
  display: flex;
  gap: 20rpx;
  padding: 0 4rpx 8rpx;

  &.triple {
    & > .control-btn {
      flex: 1;
      min-width: calc(33.33% - 14rpx);
    }
  }
}

.control-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  font-weight: 500;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border-radius: 12rpx;
  border: 2rpx solid #e8eaed;
  color: #666;
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

    &:active {
      background: linear-gradient(135deg, #5588ee 0%, #3377ea 100%);
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

  &.btn-disabled {
    opacity: 0.55;
  }
}

// 参数行样式
.param-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20rpx;
  padding: 12rpx 0 20rpx;
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
  color: $text-dark;
  font-weight: 500;
  line-height: 1.4;
}

.param-range {
  font-size: 24rpx;
  color: $text-gray;
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

  &.editing {
    background: #ffffff;
    border-color: #6699ff;
    box-shadow: 0 0 0 6rpx rgba(102, 153, 255, 0.12), 0 4rpx 16rpx rgba(102, 153, 255, 0.15);
  }
}

.val-text {
  font-size: 32rpx;
  font-weight: 600;
  color: $text-dark;
}

.val-input {
  width: 100%;
  height: 100%;
  font-size: 32rpx;
  font-weight: 600;
  text-align: center;
  background: transparent;
  border: none;
  color: $text-dark;

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

  &:active {
    transform: scale(0.96);
  }
}

.btn-submit {
  color: #ffffff;
  background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
  box-shadow: 0 8rpx 24rpx rgba(0, 212, 170, 0.4);
  min-width: 280rpx;
  height: 88rpx;
  font-size: 32rpx;
  font-weight: 600;

  &.btn-disabled {
    opacity: 0.55;
  }
}

.submit-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  border-top: 1rpx solid #f5f5f5;
}

// 圆形启动按钮（与 20kW 架构图页一致）
.start-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx 0 56rpx;
}

.start-circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  position: relative;

  &:active {
    transform: scale(0.95);
  }
}

.start-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
}

.start-text {
  font-size: 30rpx;
  font-weight: bold;
  position: relative;
  z-index: 2;
  color: #4488FB;

  &.running {
    color: #00b894;
  }
}

input::placeholder {
  color: #999;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
