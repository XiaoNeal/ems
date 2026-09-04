<template>
  <view class="sub-page" :class="platformClass">
    <DyNavbar title="设备直连配置" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :placeholder="true"
      :leftIconColor="fontColor"></DyNavbar>
    <view class="fixed-placeholder"></view>

    <!-- Hero 状态卡 -->
    <view class="hero-card hero-on">
      <view class="hero-left">
        <view class="hero-icon hero-icon-on">
          <uni-icons type="wifi" size="28" color="#fff" />
        </view>
        <view class="hero-info">
          <view class="hero-title-row">
            <text class="hero-title">MQTT 直连</text>
            <view class="hero-badge">
              <view class="hero-pulse-dot"></view>
              <text class="hero-badge-text">已启用</text>
            </view>
          </view>
          <text class="hero-desc">填写设备 IP 后即可直连监测</text>
        </view>
      </view>
    </view>

    <!-- 配置摘要预览 -->
    <view class="preview-bar" v-if="form.ip">
      <view class="preview-item">
        <text class="preview-label">Broker</text>
        <text class="preview-value">tcp://{{ form.ip }}:{{ form.port }}</text>
      </view>
    </view>

    <!-- MQTT 参数 -->
    <view class="section">
      <view class="section-title">
        <text class="title-bar"></text>
        <text>设备类型</text>
        <text class="title-hint">必填 *</text>
      </view>
      <view class="card form-card">
        <view class="form-group">
          <view class="form-item item-block">
            <view class="form-label-row">
              <uni-icons type="settings" size="14" color="#86909c" />
              <text class="form-label">选择微能量站型号</text>
            </view>
            <view class="device-type-chips">
              <view
                v-for="t in deviceTypes"
                :key="t.value"
                class="dt-chip"
                :class="{ active: form.deviceType === t.value }"
                @click="form.deviceType = t.value"
              >
                <text class="dt-chip-title">{{ t.label }}</text>
                <text class="dt-chip-desc">{{ t.desc }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">
        <text class="title-bar"></text>
        <text>设备地址</text>
        <text class="title-hint">必填 *</text>
      </view>
      <view class="card form-card">
        <view class="form-group">
          <!-- IP 四段输入 + 端口 -->
          <view class="form-item item-inline">
            <view class="inline-half">
              <view class="form-label-row">
                <uni-icons type="link" size="14" color="#86909c" />
                <text class="form-label">IP 地址</text>
              </view>
              <view class="form-control ip-seg-row">
                <input class="ip-seg" type="number" maxlength="3" :value="ipSeg[0]" @blur="onIpSegBlur(0)" @input="onIpSegInput(0, $event)" placeholder="0" />
                <text class="ip-dot">.</text>
                <input class="ip-seg" type="number" maxlength="3" :value="ipSeg[1]" @blur="onIpSegBlur(1)" @input="onIpSegInput(1, $event)" placeholder="0" />
                <text class="ip-dot">.</text>
                <input class="ip-seg" type="number" maxlength="3" :value="ipSeg[2]" @blur="onIpSegBlur(2)" @input="onIpSegInput(2, $event)" placeholder="0" />
                <text class="ip-dot">.</text>
                <input class="ip-seg" type="number" maxlength="3" :value="ipSeg[3]" @blur="onIpSegBlur(3)" @input="onIpSegInput(3, $event)" placeholder="0" />
              </view>
            </view>
            <view class="inline-gap"></view>
            <view class="inline-half" style="max-width: 200rpx; flex: none;">
              <view class="form-label-row">
                <uni-icons type="locked" size="14" color="#86909c" />
                <text class="form-label">端口</text>
              </view>
              <view class="form-control">
                <input class="form-input" type="number" v-model="form.port" placeholder="1883" />
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 默认参数说明 -->
      <view class="defaults-info">
        <uni-icons type="info" size="13" color="#86909c" />
        <text class="defaults-text">仅需填写 IP 和端口，主题等参数使用默认值</text>
      </view>
    </view>

    <!-- 使用提示 / 注意事项 -->
    <view class="help-section">
      <view class="tips-card">
        <view class="tips-header">
          <uni-icons type="info-filled" size="16" color="#007AFF" />
          <text class="tips-title">注意事项</text>
        </view>
        <view class="tips-list">
          <view class="tips-item">
            <view class="tips-icon"><uni-icons type="wifi" size="14" color="#86909c" /></view>
            <text class="tips-text">手机需与设备在同一 WiFi 网段</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="footer-actions">
      <button class="btn btn-primary" @click="handleEnter" hover-class="btn-hover">
        <uni-icons type="power" size="18" color="#fff" />
        <text class="btn-text">进入监测</text>
      </button>
      <button class="btn btn-secondary" :disabled="testing" @click="handleTest"
        hover-class="btn-hover">
        <uni-icons :type="testing ? 'spinner-cycle' : 'search'" size="18"
          :color="'#007AFF'" />
        <text class="btn-text">{{ testing ? '测试中' : '测试连接' }}</text>
      </button>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'
import { testMqttConnection } from '@/service/socket/mqtt-client.js'

const STORAGE_KEY = 'direct_device_config'
const DEFAULT_CONFIG = {
  enabled: true,
  deviceType: '20kW',
  protocol: 'mqtt',
  ip: '',
  port: '1883',
  username: '',
  password: '',
  // realtimeTopic: 'neiic/microEnergyStation001',
  realtimeTopic: 'neiic/microEnergyStationCtl002',
  controlSetTopic: 'neiic/microEnergyStationCtl002',
  controlRespTopic: 'neiic/microEnergyStationCtl002'
}

export default {
  components: { DyNavbar },
  data() {
    return {
      form: { ...DEFAULT_CONFIG },
      ipSeg: [192, 168, 88, 1],
      testing: false,
      platformClass: '',
      deviceTypes: [
        { value: '20kW', label: '20kW', desc: '微能量站' },
        { value: '50kW', label: '50kW', desc: '微能量站' }
      ]
    }
  },
  computed: {
    ...mapState({
      fontColor: state => state.fontColor
    })
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === "ios" ? "ios-platform" : "android-platform"
      }
    })
    this.loadConfig()
  },
  watch: {
    ipSeg: {
      handler(arr) {
        // 同步 ipSeg → form.ip
        this.form.ip = arr.map(v => (v == null || v === '' ? '0' : v)).join('.')
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    loadConfig() {
      try {
        const cfg = uni.getStorageSync(STORAGE_KEY)
        if (cfg) {
          this.form = { ...DEFAULT_CONFIG, ...cfg, protocol: 'mqtt' }
        }
        // 只在 form.ip 有有效值时才覆盖 ipSeg，否则保留 data() 里的默认 [192,168,88,1]
        const ip = (this.form.ip || '').trim()
        if (ip && ip !== '0.0.0.0') {
          const parts = ip.split('.')
          const seg = []
          for (let i = 0; i < 4; i++) {
            const n = parseInt(parts[i], 10)
            seg.push((!isNaN(n) && n >= 0 && n <= 255) ? n : 0)
          }
          // 四段不全为 0 才同步（避免旧的脏数据）
          if (seg.some(v => v !== 0)) {
            for (let i = 0; i < 4; i++) {
              this.$set(this.ipSeg, i, seg[i])
            }
          }
        }
      } catch (e) {
        console.error('加载直连配置失败:', e)
      }
    },
    onIpSegBlur(idx, e) {
      let v = e && e.detail != null ? e.detail.value : this.ipSeg[idx]
      if (v == null || v === '') {
        this.$set(this.ipSeg, idx, 0)
      } else {
        const n = parseInt(v, 10)
        if (isNaN(n) || n < 0) this.$set(this.ipSeg, idx, 0)
        else if (n > 255) this.$set(this.ipSeg, idx, 255)
        else this.$set(this.ipSeg, idx, n)
      }
    },
    onIpSegInput(idx, e) {
      const v = e.detail && e.detail.value
      if (v !== undefined) {
        // 实时写回 ipSeg，触发 watcher 同步 form.ip
        const n = parseInt(v, 10)
        this.$set(this.ipSeg, idx, isNaN(n) ? (v === '' ? 0 : v) : n)
      }
    },
    loadFromStorage() {
      try {
        const cfg = uni.getStorageSync(STORAGE_KEY)
        if (cfg && cfg.enabled !== undefined) {
          this.form = { ...DEFAULT_CONFIG, ...cfg, protocol: 'mqtt' }
        }
      } catch (e) { }
    },
    /** 由 IP + 端口拼出 tcp://brokerUrl（微信小程序原生 TCP MQTT） */
    buildBrokerUrl() {
      const ip = (this.form.ip || '').trim()
      const port = (this.form.port || '').trim() || '1883'
      const url = `tcp://${ip}:${port}`
      console.log('[buildBrokerUrl]', url)
      return url
    },
    validate() {
      if (!this.form.enabled) return true
      const ip = (this.form.ip || '').trim()
      if (!ip) {
        uni.showToast({ title: '请输入设备 IP 地址', icon: 'none' })
        return false
      }
      if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
        uni.showToast({ title: 'IP 地址格式不正确', icon: 'none' })
        return false
      }
      return true
    },
    handleTest() {
      if (!this.validate()) return
      uni.vibrateShort({ type: 'light' })
      this.testConnection()
    },
    handleEnter() {
      if (!this.validate()) return
      uni.vibrateShort({ type: 'light' })
      this.enterMonitor()
    },
    testConnection() {
      this.testing = true
      uni.showLoading({ title: '测试连接中...', mask: true })
      testMqttConnection(this.buildBrokerUrl(), 4000)
        .then(() => {
          uni.hideLoading()
          this.testing = false
          uni.vibrateShort({ type: 'medium' })
          uni.showModal({
            title: '连接成功',
            content: 'MQTT Broker 连接成功',
            confirmText: '进入监测',
            cancelText: '关闭',
            success: (res) => {
              if (res.confirm) {
                this.enterMonitor()
              }
            }
          })
        })
        .catch((e) => {
          uni.hideLoading()
          this.testing = false
          uni.vibrateShort({ type: 'heavy' })
          uni.showModal({
            title: '连接失败',
            content: e.message || '无法连接到 MQTT Broker，请检查参数',
            showCancel: false
          })
        })
    },
    buildConfig() {
      const cfg = {
        enabled: this.form.enabled,
        deviceType: this.form.deviceType,
        protocol: 'mqtt',
        brokerUrl: this.buildBrokerUrl(),
        ip: (this.form.ip || '').trim(),
        port: (this.form.port || '').trim() || '1883',
        username: '',
        password: '',
        realtimeTopic: 'neiic/microEnergyStationCtl002',
        controlSetTopic: 'neiic/microEnergyStationCtl002',
        controlRespTopic: 'neiic/microEnergyStationCtl002'
      }
      return cfg
    },
    enterMonitor() {
      const cfg = this.buildConfig()
      try {
        uni.setStorageSync(STORAGE_KEY, cfg)
        uni.navigateTo({ url: '/pages/profile/direct-device' })
      } catch (e) {
        console.error('保存直连配置失败:', e)
        uni.showToast({ title: '保存失败', icon: 'none' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-page {
  background: #f0f1f5;
  min-height: 100vh;
  padding-bottom: 240rpx;

  .fixed-placeholder {
    height: calc(25px + 44px + 20px);
  }

  &.android-platform {
    .fixed-placeholder {
      height: calc(25px + 20px + 44px);
    }
  }

  &.ios-platform {
    .fixed-placeholder {
      height: calc(59px + 44px);
      background: #fff;
    }
  }
}

/* ========== Hero 状态卡 ========== */
.hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20rpx;
  padding: 32rpx 28rpx;
  border-radius: 20rpx;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &.hero-on {
    background: linear-gradient(135deg, #007AFF 0%, #4096FF 100%);
    box-shadow: 0 12rpx 32rpx rgba(0, 122, 255, 0.28);
  }

  &.hero-off {
    background: #fff;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  }
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
  min-width: 0;
}

.hero-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.4s ease;
  background: #e8eaed;

  &.hero-icon-on {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(8px);
  }
}

.hero-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.hero-title-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.hero-title {
  font-size: 34rpx;
  font-weight: 700;

  .hero-on & {
    color: #fff;
  }

  .hero-off & {
    color: #1d2129;
  }
}

.hero-badge {
  display: flex;
  align-items: center;
  gap: 6rpx;
  background: rgba(255, 255, 255, 0.22);
  padding: 4rpx 14rpx;
  border-radius: 20rpx;
}

.hero-pulse-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #fff;
  animation: hero-pulse 1.5s ease-in-out infinite;
}

@keyframes hero-pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(0.7);
  }
}

.hero-badge-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: 500;
}

.hero-desc {
  font-size: 23rpx;

  .hero-on & {
    color: rgba(255, 255, 255, 0.8);
  }

  .hero-off & {
    color: #86909c;
  }
}

/* ========== 配置摘要预览 ========== */
.preview-bar {
  display: flex;
  align-items: center;
  margin: 0 20rpx 20rpx;
  padding: 16rpx 24rpx;
  background: rgba(0, 122, 255, 0.06);
  border-radius: 12rpx;
  gap: 16rpx;
}

.preview-item {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.preview-label {
  font-size: 20rpx;
  color: #86909c;
  text-transform: uppercase;
  letter-spacing: 1rpx;
}

.preview-value {
  font-size: 24rpx;
  color: #007AFF;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-sep {
  width: 1rpx;
  height: 48rpx;
  background: rgba(0, 122, 255, 0.15);
  flex-shrink: 0;
}

/* ========== 通用 section ========== */
.section {
  margin: 24rpx 20rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 0 8rpx 16rpx;
  font-size: 26rpx;
  color: #4e5969;
  font-weight: 600;
}

.title-bar {
  width: 6rpx;
  height: 28rpx;
  background: linear-gradient(to bottom, #007AFF, #4096FF);
  border-radius: 3rpx;
}

.title-hint {
  font-size: 20rpx;
  color: #f53f3f;
  font-weight: normal;
  margin-left: auto;
}

/* ========== 卡片基础 ========== */
.card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

/* ========== 表单 ========== */
.form-card {
  padding: 8rpx 0;
}

.form-group {
  padding: 0 28rpx;
}

.form-item {
  display: flex;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &.item-block {
    flex-direction: column;
    gap: 14rpx;
  }

  &.item-inline {
    flex-direction: row;
    align-items: stretch;
  }
}

.inline-half {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.inline-gap {
  width: 24rpx;
  flex-shrink: 0;
}

.form-label-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.form-label {
  font-size: 26rpx;
  color: #4e5969;
  font-weight: 500;
}

.form-control {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f7f8fa;
  border-radius: 10rpx;
  padding: 0 20rpx;
  height: 76rpx;
  transition: all 0.25s ease;
  border: 2rpx solid transparent;

  &:focus-within {
    background: #fff;
    border-color: rgba(0, 122, 255, 0.35);
    box-shadow: 0 0 0 4rpx rgba(0, 122, 255, 0.08);
  }
}

.form-input {
  flex: 1;
  font-size: 28rpx;
  color: #1d2129;
  text-align: left;
  height: 100%;
  width: 100%;
}

/* ========== IP 四段输入 ========== */
.ip-seg-row {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.ip-seg {
  flex: 1;
  min-width: 0;
  height: 72rpx;
  line-height: 72rpx;
  text-align: center;
  font-size: 28rpx;
  color: #1d2129;
  background: #f7f8fa;
  border-radius: 8rpx;
  border: 1rpx solid #e5e6eb;
}
.ip-dot {
  font-size: 28rpx;
  color: #86909c;
  flex: none;
  padding: 0 2rpx;
}

/* ========== 设备类型 Chip 选择 ========== */
.device-type-chips {
  display: flex;
  gap: 16rpx;
  padding: 8rpx 0;
}

.dt-chip {
  flex: 1;
  padding: 24rpx 20rpx;
  background: #f7f8fa;
  border: 2rpx solid #e5e6eb;
  border-radius: 14rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  transition: all 0.25s ease;

  &:active {
    transform: scale(0.97);
  }

  &.active {
    background: linear-gradient(135deg, rgba(0, 122, 255, 0.08), rgba(64, 150, 255, 0.04));
    border-color: #007AFF;
    box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.15);

    .dt-chip-title {
      color: #007AFF;
      font-weight: 700;
    }
  }
}

.dt-chip-title {
  font-size: 32rpx;
  color: #1d2129;
  font-weight: 600;
  transition: all 0.25s ease;
}

.dt-chip-desc {
  font-size: 22rpx;
  color: #86909c;
}

/* ========== 默认参数说明 ========== */
.defaults-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 8rpx 0;
}

.defaults-text {
  font-size: 23rpx;
  color: #86909c;
}

/* ========== 快速预设 chip ========== */
.preset-chip {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 20rpx;
  margin-left: 8rpx;
  padding: 14rpx 28rpx;
  background: #fff;
  border: 2rpx solid rgba(0, 122, 255, 0.2);
  border-radius: 40rpx;
  transition: all 0.2s ease;

  &:active {
    background: rgba(0, 122, 255, 0.06);
    transform: scale(0.97);
  }
}

.preset-chip-text {
  font-size: 25rpx;
  color: #007AFF;
  font-weight: 500;
}

/* ========== 步骤卡片 ========== */
.help-section {
  margin: 32rpx 20rpx 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: #fff;
  padding: 24rpx 28rpx;
  border-radius: 14rpx;
  margin-bottom: 8rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
  position: relative;
}

.step-num {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: #f0f1f3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 700;
  color: #86909c;
  flex-shrink: 0;

  &.step-num-active {
    background: linear-gradient(135deg, #007AFF, #4096FF);
    color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
  }
}

.step-body {
  flex: 1;
}

.step-text {
  font-size: 27rpx;
  color: #4e5969;
  line-height: 1.5;
}

.step-arrow {
  position: absolute;
  bottom: -14rpx;
  left: 44rpx;
  z-index: 1;
}

/* ========== 提示卡片 ========== */
.tips-card {
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.06), rgba(0, 122, 255, 0.02));
  border: 2rpx solid rgba(0, 122, 255, 0.12);
  border-radius: 16rpx;
  padding: 28rpx 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.tips-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1d2129;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.tips-item {
  display: flex;
  align-items: flex-start;
  gap: 14rpx;
}

.tips-icon {
  width: 36rpx;
  height: 36rpx;
  border-radius: 8rpx;
  background: rgba(0, 122, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tips-text {
  flex: 1;
  font-size: 26rpx;
  color: #4e5969;
  line-height: 1.5;
  padding-top: 4rpx;
}

/* ========== 底部操作栏 ========== */
.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx 28rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.06);
  z-index: 100;
}

.btn {
  flex: 1;
  height: 92rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  font-size: 30rpx;
  font-weight: 600;
  margin: 0;
  border: none;
  transition: all 0.2s ease;

  &::after {
    border: none;
  }

  &[disabled] {
    opacity: 0.35;
  }
}

.btn-primary {
  flex: 1.6;
  background: linear-gradient(135deg, #007AFF, #4096FF);
  color: #fff;
  box-shadow: 0 6rpx 20rpx rgba(0, 122, 255, 0.3);

  &:active:not([disabled]) {
    transform: scale(0.97);
    box-shadow: 0 3rpx 10rpx rgba(0, 122, 255, 0.2);
  }
}

.btn-secondary {
  flex: 1;
  background: #fff;
  color: #007AFF;
  border: 2rpx solid #e5e6eb;

  &:active:not([disabled]) {
    background: #f7f8fa;
    border-color: #d1d5db;
  }
}

.btn-text {
  margin-top: 2rpx;
}

.btn-hover {
  opacity: 0.85;
  transform: scale(0.97);
}
</style>
