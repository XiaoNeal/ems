<template>
  <view class="sub-page" :class="platformClass">
    <DyNavbar title="直连设备监测" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :placeholder="true" :leftIconColor="fontColor"></DyNavbar>
    <view class="fixed-placeholder"></view>

    <!-- 顶部设备卡片 -->
    <DeviceCard
      :connectionState="connectionState"
      :connecting="connecting"
      :isConnected="isConnected"
      :config="config"
      :deviceName="currentDeviceName"
      :deviceSubtitle="currentDeviceSubtitle"
      :statusText="statusText"
      :lastUpdateText="lastUpdateText"
      :showDeviceMeta.sync="showDeviceMeta"
      @refresh="manualRefresh"
      @go-config="goConfig"
      @disconnect="onDisconnect"
    />

    <!-- 离线 / 未配置 提示 -->
    <view v-if="!config.enabled" class="empty-state">
      <view class="empty-icon">
        <uni-icons type="wifi" size="52" color="#b9bfc9"></uni-icons>
      </view>
      <text class="empty-text">直连模式未开启</text>
      <text class="empty-sub">请先在设置中配置 IP 与端口</text>
      <button class="btn primary" @tap="goConfig">前往配置</button>
    </view>

    <view v-else class="connected-view">
    <!-- 标签页 + 数据区 -->
    <!-- 标签页 -->
    <view class="tab-container">
      <scroll-view scroll-x="true" class="tab-scroll" :scroll-into-view="'tab-' + currentTab" scroll-with-animation>
        <view class="tab-list" :class="{ 'tab-list-auto': bottomTab === 'setting' }">
          <view v-for="index in currentTabGroup" :key="index"
            :id="'tab-' + index"
            class="tab-item"
            :class="{ active: currentTab === index, 'tab-monitor': bottomTab === 'monitor', 'tab-setting': bottomTab === 'setting' }"
            @tap="switchTab(index)">
            <text>{{ getTabTitle(index) }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

      <!-- 数据区：view + v-show 切换，彻底去掉 swiper -->
      <view class="content-area">
        <!-- 概览标签页 -->
        <scroll-view v-show="currentTab === 0" class="module-scroll" scroll-y="true">
          <view class="content">
            <OverviewTab :formattedValues="formattedValues" :systemRunning="archSystemRunning" @start-stop="onSystemStartStop" />
          </view>
        </scroll-view>

        <!-- PCS标签页 -->
        <scroll-view v-show="currentTab === 1" class="module-scroll" scroll-y="true">
          <view class="content">
            <PcsTab :formattedValues="formattedValues" :rawValues="rawValues" :is50KwMode="is50KwMode" />
          </view>
        </scroll-view>

        <!-- 储能DC标签页 -->
        <scroll-view v-show="currentTab === 2" class="module-scroll" scroll-y="true">
          <view class="content">
            <StorageDcTab :formattedValues="formattedValues" :rawValues="rawValues" :is50KwMode="is50KwMode" />
          </view>
        </scroll-view>

        <!-- 光伏标签页 -->
        <scroll-view v-show="currentTab === 3" class="module-scroll" scroll-y="true">
          <view class="content">
            <PvTab :formattedValues="formattedValues" :rawValues="rawValues" :is50KwMode="is50KwMode" />
          </view>
        </scroll-view>

        <!-- BMS标签页 -->
        <scroll-view v-show="currentTab === 4" class="module-scroll" scroll-y="true">
          <view class="content">
            <BmsTab
              :formattedValues="formattedValues"
              :rawValues="rawValues"
              :controlList="controlList"
              :isConnected="isConnected"
              :clickedBtn="clickedBtn"
              :is50KwMode="is50KwMode"
              @control-click="onControlClick"
            />
          </view>
        </scroll-view>

        <!-- 液冷机监测标签页（tab 10，仅 50kW 显示 tab 栏按钮，但内容始终可渲染） -->
        <scroll-view v-show="currentTab === 10" class="module-scroll" scroll-y="true">
          <view class="content">
            <LiquidCoolingTab :rawValues="rawValues" :is50KwMode="is50KwMode" />
          </view>
        </scroll-view>

        <!-- 设置标签页：由当前 tab 直接驱动，只渲染一份面板
             （不再用 v-for 固定槽位 —— 槽位下标与 tab 序号（5~9、11）对不上时整块不渲染，页面就空白） -->
        <scroll-view
          v-show="!!currentSettingsTab"
          class="module-scroll"
          scroll-y="true"
        >
          <view class="content">
            <SettingsPanel
              v-if="hasAccessCode && currentSettingsTab"
              :tabCfg="currentSettingsTab"
              :paramsMap="settingsParamsMap"
              :isEditing="isEditing(currentSettingsTab.editKey)"
              :formatCurrentLabel="getParamCurrentLabel"
              :formatCurrentValue="getParamCurrentValue"
              :formatCurrentText="getParamCurrentText"
              @toggle-edit="toggleEdit"
              @switch-click="onSwitchParamClick"
              @numeric-edit="onNumericParamEdit"
              @need-edit="onNeedEdit"
            />
            <!-- 兜底提示：设置模式下若 tab 与配置对不上，给出明确信息而不是白屏 -->
            <view v-else class="settings-placeholder">
              <view class="settings-placeholder-icon">
                <uni-icons :type="hasAccessCode ? 'info' : 'locked'" size="28" color="#c3cad4"></uni-icons>
              </view>
              <text class="settings-placeholder-text">{{ hasAccessCode ? '当前标签页没有可用的参数配置' : '尚未输入操作码' }}</text>
              <text class="settings-placeholder-sub">{{ hasAccessCode ? '请切换其它设置标签页查看' : '请返回配置页填写操作码后重试' }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 底部主导航 tab：监测 / 设置 -->
      <view class="bottom-tabbar">
        <view class="bottom-tab-item bottom-tab-monitor"
          :class="{ active: bottomTab === 'monitor' }"
          @tap="switchBottomTab('monitor')">
          <view class="bottom-tab-icon">
            <uni-icons type="list" size="21" :color="bottomTab === 'monitor' ? '#2f7cf6' : '#b0b6c0'"></uni-icons>
          </view>
          <text class="bottom-tab-label">监测</text>
        </view>
        <view class="bottom-tab-item bottom-tab-setting"
          :class="{ active: bottomTab === 'setting' }"
          @tap="switchBottomTab('setting')">
          <view class="bottom-tab-icon">
            <uni-icons type="gear" size="21" :color="bottomTab === 'setting' ? '#2f7cf6' : '#b0b6c0'"></uni-icons>
          </view>
          <text class="bottom-tab-label">设置</text>
        </view>
      </view>
    </view>

    <!-- 设置面板确认弹窗 -->
    <ConfirmDialog
      :visible="showConfirm"
      :title="confirmTitle"
      :content="confirmContent"
      @cancel="showConfirm = false"
      @confirm="onConfirmOk"
    />

    <!-- 操作反馈 Toast -->
    <OpToast :visible="showOpToast" :text="opToast" />
  </view>
</template>

<script>
import { mapState } from 'vuex'
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'
import { MqttDirectClient } from '@/service/socket/mqtt-client.js'
import {
  isIemsBinaryFrame,
  parseIemsFrame,
  parseIemsControlFrame,
  IEMS_DATA_TYPE
} from '@/service/socket/iems-frame-parser.js'
import {
  getRegisterMap
} from '@/service/devices/modbus-register-map.js'
import { realtimeDataProvider } from '@/service/websocket'
// 常量集中定义
import {
  STORAGE_KEY,
  DEVICE_TYPES,
  DEVICE_TYPES_50KW,
  TAB_TITLES,
  TAB_GROUP_MONITOR,
  TAB_GROUP_MONITOR_50KW,
  GROUP_TITLE,
  DEVICE_GROUPS,
  DEVICE_NAME_MAP,
  BMS_ALARM_FIELDS,
  SETTINGS_PANELS,
  SETTINGS_TABS,
  // 50kW 新协议（syncSettingsFromRealtime 从 SETTINGS_PANELS_50KW.source 深克隆）
  SETTINGS_PANELS_50KW,
  SETTINGS_TABS_50KW
} from './direct-device-constants.js'
// 可复用子组件
import DeviceCard from './components/direct-device/DeviceCard.vue'
import SettingsPanel from './components/direct-device/SettingsPanel.vue'
import ConfirmDialog from './components/direct-device/ConfirmDialog.vue'
import OpToast from './components/direct-device/OpToast.vue'
import OverviewTab from './components/direct-device/tabs/OverviewTab.vue'
import PcsTab from './components/direct-device/tabs/PcsTab.vue'
import StorageDcTab from './components/direct-device/tabs/StorageDcTab.vue'
import PvTab from './components/direct-device/tabs/PvTab.vue'
import BmsTab from './components/direct-device/tabs/BmsTab.vue'
import LiquidCoolingTab from './components/direct-device/tabs/LiquidCoolingTab.vue'

export default {
  components: {
    DyNavbar,
    DeviceCard,
    SettingsPanel,
    ConfirmDialog,
    OpToast,
    OverviewTab,
    PcsTab,
    StorageDcTab,
    PvTab,
    BmsTab,
    LiquidCoolingTab
  },
  data() {
    return {
      currentTab: 0,
      bottomTab: 'monitor',
      config: {
        enabled: false,
        protocol: 'mqtt',
        deviceType: '20kW',
        deviceName: '',
        ip: '', port: '1883',
        brokerUrl: '', username: '', password: '',
        accessCode: '',
        realtimeTopic: 'neiic/microEnergyStation001',
        controlSetTopic: 'neiic/microEnergyStationCtl002',
        controlRespTopic: 'neiic/microEnergyStationCtl002'
      },
      client: null,
      connecting: false,
      connected: false,
      errorMsg: '',
      lastUpdate: null,
      deviceTypes: DEVICE_TYPES,
      rawValues: {
        '171B': {}, '171C': {}, '171D': {}, '171E': {}, '171F': {},
        // 50kW 新协议 bucket（与 getRegisterMap 前缀匹配对应）
        '1707': {}, '170C_STORAGE': {}, '170C_PV': {}, '171C_V2': {},
        // 液冷机 0318（50kW 站点配置）
        '0318': {},
        // 环境监测 131C（50kW BMS 环境数据：温度/湿度）
        '131C': {}
      },
      // 预格式化显示值（key: 'deviceType_field'，直接绑定确保响应式）
      formattedValues: {
        archDeviceCounts: { dljQuantity: 0, cdzQuantity: 0, lightQuantity: 0, unknownDeviceQuantity: 0 },
        archSocNumeric: 0,
        archStorageStatusGradient: '#8c8c8c'
      },
      // 显示用结构（由 updateDisplay 同步重建）
      displayItems: [],
      // 分组显示结构（由 updateDisplay 同步重建，避免 computed 全量重建）
      groupedDisplay: [],
      controlList: [],
      clickedBtn: '',
      clickedResetTimer: null,
      platformClass: '',
      showDeviceMeta: false,
      archRefreshTimer: null,
      // ============ 设置面板状态 ============
      bmsNumericParams: [],
      bmsSwitchParams: [],
      bmsPowerParams: [],
      pcsNumericParams: [],
      pcsSwitchParams: [],
      isEditingBms: false,
      isEditingPcs: false,
      editingParamKey: null,
      editingParamValue: '',
      editingParamDeviceType: '171C',
      // 确认弹窗
      showConfirm: false,
      confirmTitle: '',
      confirmContent: '',
      confirmPayload: null,
      confirmCallback: null,
      // 操作反馈 Toast
      opToast: '',
      showOpToast: false,
      // PV 设置
      pvNumericParams: [],
      pvSwitchParams: [],
      isEditingPv: false,
      // Storage 设置
      storageNumericParams: [],
      storageSwitchParams: [],
      isEditingStorage: false,
      // Quick Control
      quickControlParams: [],
      quickPowerParams: [],
      isEditingQuickControl: false,
      // 液冷机（0318 V2.3）
      liquidSwitchParams: [],
      liquidNumericParams: [],
      isEditingLiquid: false,
      // 缓存当前已初始化的协议模板（'20kw'/'50kw'），避免每次 MQTT 帧都整体重建参数数组
      settingsProtocol: '',
    }
  },
  computed: {
    ...mapState({
      fontColor: state => state.fontColor,
      currentSelectDevice: state => state.currentSelectDevice
    }),
    connectionState() {
      if (this.connecting) return 'connecting'
      return this.connected ? 'online' : 'offline'
    },
    statusText() {
      if (this.connecting) return '连接中'
      return this.connected ? '在线' : '离线'
    },
    protocolLabel() {
      return 'MQTT'
    },
    isConnected() {
      return this.connected
    },
    tabList() {
      return TAB_TITLES
    },
    tabGroupMonitor() {
      // 没有操作码时只显示概览（tab 0），有操作码才显示全部监测 tab
      if (!this.hasAccessCode) return [0]
      return this.is50KwMode ? TAB_GROUP_MONITOR_50KW : TAB_GROUP_MONITOR
    },
    tabGroupControl() {
      // 没有操作码时隐藏设置面板，只显示概览
      if (!this.hasAccessCode) return []
      // 设置 tab 由当前协议模板决定（50kW 为 PCS/储能/光伏/BMS/液冷/快捷 共 6 个）
      return this.settingsTabs.map(t => t.tab)
    },
    currentTabGroup() {
      return this.bottomTab === 'monitor' ? this.tabGroupMonitor : this.tabGroupControl
    },
    hasAccessCode() {
      return !!(this.config && this.config.accessCode === '123456')
    },
    /** 50kW 大容量站判定：配置 deviceType 或 MQTT 有新协议 bucket 即认为是 50kW */
    is50KwMode() {
      if (this.config && this.config.deviceType === '50kW') return true
      const rv = this.rawValues || {}
      const hit = ['1707', '170C_STORAGE', '170C_PV', '171C_V2'].filter(k => rv[k] && Object.keys(rv[k]).length > 0)
      return hit.length > 0
    },
    settingsTabs() {
      return this.is50KwMode ? SETTINGS_TABS_50KW : SETTINGS_TABS
    },
    /** 当前设置标签页配置（设置区唯一数据源，避免槽位与 tab 序号错位导致空白） */
    currentSettingsTab() {
      return this.settingsTabs.find(t => t.tab === this.currentTab) || null
    },
    /** 设置面板参数映射：供 SettingsPanel 子组件按 key 取参数数组 */
    settingsParamsMap() {
      // 旧协议和 50kW 协议共用 data() 里的同名数组 key
      // syncSettingsFromRealtime 会根据检测到的协议类型初始化/填充这些数组
      return {
        bmsNumericParams: this.bmsNumericParams,
        bmsSwitchParams: this.bmsSwitchParams,
        bmsPowerParams: this.bmsPowerParams,
        pcsNumericParams: this.pcsNumericParams,
        pcsSwitchParams: this.pcsSwitchParams,
        pvNumericParams: this.pvNumericParams,
        pvSwitchParams: this.pvSwitchParams,
        storageNumericParams: this.storageNumericParams,
        storageSwitchParams: this.storageSwitchParams,
        quickControlParams: this.quickControlParams,
        quickPowerParams: this.quickPowerParams,
        liquidSwitchParams: this.liquidSwitchParams,
        liquidNumericParams: this.liquidNumericParams
      }
    },
    currentDeviceType() {
      // 设置面板：按当前协议模板取 deviceType（50kW → 1707/170C_STORAGE/170C_PV/171C_V2）
      const panels = this.is50KwMode ? SETTINGS_PANELS_50KW : SETTINGS_PANELS
      const tab = this.settingsTabs.find(t => t.tab === this.currentTab)
      if (tab) {
        const panel = panels.find(p => p.dataKey === tab.dataKey)
        if (panel) return panel.deviceType
      }
      // 监控面板：50kW 模式下用新 bucket key 映射
      const types = this.is50KwMode ? DEVICE_TYPES_50KW : DEVICE_TYPES
      return types[this.currentTab] || null
    },
    /** 设备卡片副标题：用户可读的设备说明（不暴露内部编号） */
    currentDeviceSubtitle() {
      // 概览
      if (this.currentTab === 0) return '场站综合监测'
      // 设置面板（tab >= 5）：取当前协议模板的标题去掉 "(171X)" 后缀
      const settingTab = this.settingsTabs.find(t => t.tab === this.currentTab)
      if (settingTab) return settingTab.title.replace(/\s*\([^)]*\)\s*$/, '')
      // 液冷机监测 tab 10
      if (this.currentTab === 10) return '液冷机组运行参数'
      // 监控面板（tab 1-4）：按当前协议模板取 bucket key → DEVICE_NAME_MAP
      const types = this.is50KwMode ? DEVICE_TYPES_50KW : DEVICE_TYPES
      const dt = types[this.currentTab]
      if (dt && DEVICE_NAME_MAP[dt]) return DEVICE_NAME_MAP[dt]
      return '设备监测'
    },
    /** 液冷机监测 tab 数据由 LiquidCoolingTab 直接读 rawValues['0318']（0318 V2.3 字段表驱动） */
    currentDeviceName() {
      return this.config.deviceName || 'IEMS 微能量站'
    },
    lastUpdateText() {
      if (!this.lastUpdate) return '--'
      const d = new Date(this.lastUpdate)
      const pad = n => String(n).padStart(2, '0')
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },
    kpiList() {
      const pick = (field) => {
        const it = this.displayItems.find(i => i.field === field)
        return it || { name: '', value: '--', unit: '', field }
      }
      const map = getRegisterMap(this.currentDeviceType)
      const kpiFields = map.monitor.slice(0, 4).map(p => p.field)
      return kpiFields.map(f => pick(f))
    },
    archSoc() {
      return this.getVal('171F', 'B128', 1) !== '--'
        ? this.getVal('171F', 'B128', 1)
        : this.getVal('171F', 'B58', 1)
    },
    archStorageStatus() {
      const val = this.rawValues['171F'] && this.rawValues['171F']['B60']
      if (val === undefined || val === null || val === '--') return '静置'
      const num = Number(val)
      if (isNaN(num)) return '静置'
      if (num > 0) return '充电'
      if (num < 0) return '放电'
      return '静置'
    },
    archStoragePower() {
      return this.getVal('171F', 'B8', 2)
    },
    archLoadPower() {
      return this.getVal('171F', 'B68', 2) !== '--'
        ? this.getVal('171F', 'B68', 2)
        : this.getVal('171F', 'B14', 2)
    },
    archGridPower() {
      return this.getVal('171F', 'B4', 2)
    },
    archPvPower() {
      return this.getVal('171F', 'B0', 2)
    },
    archLoadMidPower() {
      return this.getVal('171F', 'B14', 2)
    },
    archGenToday() {
      return this.getVal('171F', 'B34', 1)
    },
    archUseToday() {
      return this.getVal('171F', 'B38', 1)
    },
    archGridSupply() {
      return this.getVal('171F', 'B42', 1)
    },
    archStorageRemaining() {
      return this.getVal('171F', 'B128', 1) !== '--'
        ? this.getVal('171F', 'B128', 1)
        : this.getVal('171F', 'B58', 1)
    },
    /** 策略运行状态 (171F.B12, 对齐 architecture-diagram) */
    archSystemRunning() {
      const val = this.rawValues['171F'] && this.rawValues['171F']['B12']
      return val === 1 || val === '1'
    },
    bmsAlarmStatus() {
      const data = this.rawValues['171C'] || {}
      return BMS_ALARM_FIELDS.map(f => {
        const value = data[f.key]
        return { name: f.name, value: value || '--', isAlarm: value === '告警' || Number(value) === 1 }
      })
    }
  },
  watch: {
    currentTab() {
      this.updateDisplay()
      this.rebuildFormattedValues()
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === 'ios' ? 'ios-platform' : 'android-platform'
      }
    })
    this.loadConfig()
    this.initControlList()
    this.initSettingsParams()
    // 直连模式下 rawValues 必须为空，所有数据只能来自 MQTT 帧；
    // 不要从 realtimeDataProvider（云端 WebSocket）同步数据——那是另一路数据源，
    // 会让页面在 MQTT 还没连上时就显示"假数据"
    this.resetRawValues()
    this.updateDisplay()
    this.rebuildFormattedValues()
    if (this.config.enabled) {
      // 进入页面即尝试连接
      this.$nextTick(() => this.start())
    }
  },
  onUnload() {
    this.stopArchRefreshTimer()
    this.stop()
  },
  onShow() {
    // 直连页禁用云端 WebSocket 数据同步——所有数据只能来自 MQTT 帧
    // MQTT 连接成功后会自动 subscribe 并在 applyIemsFrame 中填充 rawValues

    // 息屏回来后 MQTT 连接可能已被系统断开，主动检查并重连
    // （LightMqttClient 有 autoReconnect，但微信息屏期间定时器会被挂起，
    //  回来时可能已经撞了 maxReconnectAttempts 上限停止重连）
    if (this.config.enabled) {
      if (!this.client) {
        this.start()
      } else if (!this.connected || !this.client.connected) {
        console.log('[direct-device] onShow: MQTT 未连接，主动重连')
        this.start()
      }
    }
  },
  onHide() {
    this.stopArchRefreshTimer()
  },
  methods: {
    /**
     * 架构图启停按钮 handler — 下发 171F.B12 策略运行指令
     * 对齐 architecture-diagram.vue handleStartStop 逻辑
     */
    onSystemStartStop() {
      const running = this.archSystemRunning
      const title = running ? '策略停止' : '策略启动'
      const content = running ? '确定要停止策略吗？' : '确定要启动策略吗？'
      uni.showModal({
        title,
        content,
        success: async (res) => {
          if (!res.confirm) return
          try {
            // 171F 启动按钮（运行策略总开关）= 0x3401 附件2 EMS 地址 112
            this.client.setDeviceType('171F')
            await this.client.sendControl('B12', running ? 0 : 1, '171F', { registerAddress: '112' })
            uni.showToast({ title: '指令已下发', icon: 'none' })
          } catch (e) {
            uni.showModal({ title: '下发失败', content: e.message || '请重试', showCancel: false })
          }
        }
      })
    },

    /**
     * 原：从全局 realtimeDataProvider（云端 WebSocket）同步 171F 架构数据
     * 现：直连模式禁用所有云端 WebSocket 数据注入——rawValues 里的数据必须全部来自 MQTT 帧；
     *     否则架构图/监控面板会在 MQTT 还没连上时就显示"假数据"
     */
    sync171FFromRealtimeProvider() {
      return
    },
    /**
     * 设备类型转十六进制字符串（与 load-management.vue / 项目规范一致）
     * 4 位字符串按 hex 解析，其它按十进制解析
     */
    getTypeHex(type) {
      if (type === undefined || type === null) return '0x0000'
      const s = String(type)
      let n
      if (/^[0-9a-fA-F]{4}$/.test(s)) {
        n = parseInt(s, 16)
      } else {
        n = parseInt(s, 10)
      }
      if (isNaN(n)) return '0x0000'
      return '0x' + n.toString(16).toUpperCase().padStart(4, '0')
    },
    /**
     * 启动架构图数据定时刷新兜底定时器（WebSocket 回调为主，定时器兜底）
     */
    startArchRefreshTimer() {
      this.stopArchRefreshTimer()
      this.archRefreshTimer = setInterval(() => {
        this.sync171FFromRealtimeProvider()
      }, 5000)
    },
    stopArchRefreshTimer() {
      if (this.archRefreshTimer) {
        clearInterval(this.archRefreshTimer)
        this.archRefreshTimer = null
      }
    },
    /**
     * 清空所有 rawValues bucket，回到纯净状态
     * 用于：页面进入时清默认数据、MQTT 重连时清旧 broker 残留、MQTT 断线时清帧数据
     * 直连模式下所有数据只能来自 MQTT 帧，禁止任何其他数据源注入
     */
    resetRawValues() {
      const newBuckets = {}
      for (const key of Object.keys(this.rawValues || {})) {
        newBuckets[key] = {}
      }
      if (Object.keys(newBuckets).length === 0) {
        // 首次调用时初始化 bucket key 集合（兼容 20kW + 50kW 全部 bucket）
        newBuckets['171B'] = {}
        newBuckets['171C'] = {}
        newBuckets['171D'] = {}
        newBuckets['171E'] = {}
        newBuckets['171F'] = {}
        newBuckets['1707'] = {}
        newBuckets['170C_STORAGE'] = {}
        newBuckets['170C_PV'] = {}
        newBuckets['171C_V2'] = {}
        newBuckets['0318'] = {}
        newBuckets['131C'] = {}
      }
      this.rawValues = newBuckets
    },
    updateDisplay(deviceType) {
      const dtype = deviceType || this.currentDeviceType
      // 概览标签页没有对应的设备类型，清空显示列表
      if (!dtype) {
        this.displayItems = []
        this.groupedDisplay = []
        return
      }
      const map = getRegisterMap(dtype)
      const bucket = this.rawValues[dtype] || {}
      this.displayItems = map.monitor.map(p => this._formatOneItem(p, bucket))
      const groupsConfig = DEVICE_GROUPS[dtype] || []
      const groups = {}
      this.displayItems.forEach(item => {
        const g = item.group || 'system'
        if (groupsConfig.length > 0 && !groupsConfig.includes(g)) return
        if (!groups[g]) groups[g] = { title: GROUP_TITLE[g] || '其他', items: [] }
        groups[g].items.push(item)
      })
      const orderMap = {}
      map.monitor.forEach((p, i) => { orderMap[p.field] = i })
      Object.keys(groups).forEach(k => {
        groups[k].items.sort((a, b) => (orderMap[a.field] ?? 999) - (orderMap[b.field] ?? 999))
      })
      this.groupedDisplay = Object.values(groups)
    },
    /** BMS V2 位字段打包：把同地址所有 bit 当前值合成一个整字节
     *  参考 community/settings BmsSettings.vue packHcByte 实现
     *  查找当前参数面板中 deviceType 相同、address 相同、bit !== null 的所有参数
     */
    _packBmsByte(param, optValue) {
      // 从 settingsParamsMap 找所有同 deviceType + 同 address 的参数
      const paramsMap = this.settingsParamsMap
      const allLists = Object.values(paramsMap).filter(Array.isArray)
      const sameAddr = allLists
        .flat()
        .filter(x =>
          x.deviceType === param.deviceType &&
          x.address === param.address &&
          x.bit !== null && x.bit !== undefined
        )
      let packed = 0
      sameAddr.forEach(x => {
        const v = String(x.key) === String(param.key) ? String(optValue) : String(x.currentValue)
        const bitIdx = Number(x.bit)
        if (Number(v) === 1) packed |= (1 << bitIdx)
      })
      return packed
    },
    formatValue(value, decimals) {
      if (value === null || value === undefined || value === '--') return '--'
      const num = Number(value)
      if (!Number.isFinite(num)) return '--'
      return decimals > 0 ? num.toFixed(decimals) : String(Math.round(num))
    },
    getVal(bucket, field, decimals) {
      const val = this.rawValues[bucket] && this.rawValues[bucket][field]
      if (val === undefined || val === null) return '--'
      return this.formatValue(val, decimals !== undefined ? decimals : 2)
    },
    /**
     * 重建指定设备类型的预格式化显示值
     * 模板直接绑定 formattedValues['171B_B0'] 以确保响应式更新
     */
    rebuildFormattedValues(deviceType) {
      // 需要 rebuild 的 bucket 列表：
      //   - 传了 deviceType → 只 rebuild 那个 bucket + 171F（架构图）
      //   - 没传 → rebuild 所有可能的 bucket（20kW 旧码 + 50kW 新协议）
      const ALL_BUCKETS = ['171B', '171C', '171D', '171E', '171F', '1707', '170C_STORAGE', '170C_PV', '171C_V2', '0318', '131C']
      const types = deviceType
        ? (deviceType === '171F' ? ['171F'] : [deviceType, '171F'])
        : ALL_BUCKETS
      const newVals = {}
      types.forEach(dt => {
        const bucket = this.rawValues[dt] || {}
        const map = getRegisterMap(dt)
        // 不管 map 有没有 monitor 定义，都遍历 bucket 里的所有字段（直连 MQTT 帧字段 key 就是 B 号）
        if (map && map.monitor && map.monitor.length > 0) {
          map.monitor.forEach(p => {
            const raw = bucket[p.field]
            if (raw === undefined) return
            const decimals = p.decimals !== undefined ? p.decimals : 2
            newVals[`${dt}_${p.field}`] = this.formatValue(raw, decimals)
          })
        }
        Object.keys(bucket).forEach(field => {
          const key = `${dt}_${field}`
          if (newVals[key] === undefined) {
            const val = bucket[field]
            const isBitField = field.includes('b')
            newVals[key] = this.formatValue(val, isBitField ? 0 : 2)
          }
        })
      })
      // === 50kW bucket → 20kW 旧码前缀别名 ===
      // tab 组件模板硬编码了 20kW 旧协议 key 前缀（'171B', '171C', '171D', '171E'），
      // 50kW bucket 数据虽然 bucket 名不同（'1707', '171C_V2', '170C_STORAGE', '170C_PV'），
      // 但字段 key（B 号）一致。这里为 50kW bucket 的每个字段值生成一份旧码前缀的别名 key，
      // 让 tab 组件在不改动模板的情况下也能显示 50kW 数据。
      // 注意：新旧协议某些 B 号含义不完全一致，alias 能保证数据显出来，但个别字段名可能对不上。
      const ALIAS_MAP = {
        '1707': '171B',         // 50kW PCS → 20kW PCS 别名
        '170C_STORAGE': '171D', // 50kW 储能DC → 20kW 储能DC 别名
        '170C_PV': '171E',      // 50kW 光伏DC → 20kW 光伏 别名
        '171C_V2': '171C'       // 50kW BMS → 20kW BMS 别名
      }
      for (const [newPrefix, oldPrefix] of Object.entries(ALIAS_MAP)) {
        const aliasBucket = this.rawValues[newPrefix] || {}
        Object.keys(aliasBucket).forEach(field => {
          const aliasKey = `${oldPrefix}_${field}`
          // 仅当 20kW bucket 没有同名 key 时才用 50kW bucket 的数据覆盖
          // （20kW bucket 优先，避免 alias 覆盖掉真实的 20kW 数据）
          if (this.rawValues[oldPrefix] && this.rawValues[oldPrefix][field] !== undefined) {
            // 20kW bucket 有数据，跳过 alias
            return
          }
          const val = aliasBucket[field]
          if (val === undefined || val === null) return
          const isBitField = field.includes('b')
          const decimals = isBitField ? 0 : 2
          if (newVals[aliasKey] === undefined) {
            newVals[aliasKey] = this.formatValue(val, decimals)
          }
        })
      }
      const f = this.formatValue.bind(this)
      const r = (t, k) => (this.rawValues[t] && this.rawValues[t][k])
      newVals['archPvPower'] = f(r('171F', 'B0'), 2)
      newVals['archGridPower'] = f(r('171F', 'B4'), 2)
      newVals['archStoragePower'] = f(r('171F', 'B8'), 2)
      newVals['archLoadPower'] = f(r('171F', 'B68') !== undefined ? r('171F', 'B68') : r('171F', 'B14'), 2)
      newVals['archLoadMidPower'] = f(r('171F', 'B14'), 2)
      newVals['archGenToday'] = f(r('171F', 'B34'), 1)
      newVals['archUseToday'] = f(r('171F', 'B38'), 1)
      newVals['archGridSupply'] = f(r('171F', 'B42'), 1)
      // === 与 grid-management.vue 对齐的电网统计字段 ===
      // B174: 频率 (Hz), B176: 正向有功电度(累计供电 kWh), B180: 反向有功电度(累计馈电 kWh)
      // B184: 当天正向有功电度(今日供电 kWh), B188: 当天反向有功电度(今日馈电 kWh)
      newVals['archGridFrequency'] = f(r('171F', 'B174'), 2)
      newVals['archTotalSupplyEnergy'] = f(r('171F', 'B176'), 1)
      newVals['archTotalFeedEnergy'] = f(r('171F', 'B180'), 1)
      newVals['archTodaySupplyEnergy'] = f(r('171F', 'B184'), 1)
      newVals['archTodayFeedEnergy'] = f(r('171F', 'B188'), 1)
      const socVal = r('171F', 'B128') !== undefined ? r('171F', 'B128') : r('171F', 'B58')
      newVals['archSoc'] = f(socVal, 1)
      newVals['archStorageRemaining'] = f(socVal, 1)
      // 储能SOC数值（用于进度条百分比）
      newVals['archSocNumeric'] = socVal !== undefined && socVal !== null ? Number(socVal) : 0
      // 剩余电量预计可用小时
      newVals['archStorageRemainingHours'] = f(r('171F', 'B130'), 0)
      const storagePow = r('171F', 'B60')
      if (storagePow !== undefined) {
        const n = Number(storagePow)
        newVals['archStorageStatus'] = isNaN(n) ? '静置' : n > 0 ? '充电' : n < 0 ? '放电' : '静置'
        newVals['archStorageStatusExtended'] = isNaN(n) ? '不充不放' : n > 0 ? '充电中' : n < 0 ? '放电中' : '不充不放'
        newVals['archStorageStatusGradient'] = isNaN(n)
          ? '#8c8c8c'
          : n > 0
            ? '#2ecc71'
            : n < 0
              ? '#f39c12'
              : '#8c8c8c'
      } else {
        newVals['archStorageStatus'] = '--'
        newVals['archStorageStatusExtended'] = '--'
        newVals['archStorageStatusGradient'] = '#8c8c8c'
      }
      // === 与 pv-management.vue 对齐的光伏统计字段（B78区）===
      // B78: 当日发电量 kWh, B106: 累计发电量 kWh, B110: 累计发电时长 天
      // B82: 日最高发电量 kWh, B92: 历史最高发电功率 kW
      newVals['archPvTodayGen'] = f(r('171F', 'B78'), 1)
      newVals['archPvTotalGen'] = f(r('171F', 'B106'), 1)
      newVals['archPvTotalGenDays'] = f(r('171F', 'B110'), 0)
      newVals['archPvDayMaxGen'] = f(r('171F', 'B82'), 1)
      const year86 = r('171F', 'B86')
      const month88 = r('171F', 'B88')
      const day90 = r('171F', 'B90')
      if (year86 !== undefined && month88 !== undefined && day90 !== undefined) {
        const mm = String(Number(month88)).padStart(2, '0')
        const dd = String(Number(day90)).padStart(2, '0')
        newVals['archPvDayMaxGenTime'] = `${year86}-${mm}-${dd}`
      } else {
        newVals['archPvDayMaxGenTime'] = '--'
      }
      newVals['archPvHistMaxPower'] = f(r('171F', 'B92'), 2)
      // === 设备数量估算（MQTT 直连模式，仅第一次 bucket 从全空变有数据时计算一次）===
      if (!this._deviceCountsComputed) {
        let dlj = 0, cdz = 0, light = 0, unknown = 0
        if (this.rawValues['171C'] && Object.keys(this.rawValues['171C']).length > 0) dlj += 2
        if (this.rawValues['171D'] && Object.keys(this.rawValues['171D']).length > 0) cdz += 1
        if (this.rawValues['171B'] && Object.keys(this.rawValues['171B']).length > 0) light += 3
        if (this.rawValues['171E'] && Object.keys(this.rawValues['171E']).length > 0) dlj += 1
        // 50kW bucket 也参与估算
        if (this.rawValues['1707'] && Object.keys(this.rawValues['1707']).length > 0) light += 3
        if (this.rawValues['170C_STORAGE'] && Object.keys(this.rawValues['170C_STORAGE']).length > 0) cdz += 1
        if (this.rawValues['171C_V2'] && Object.keys(this.rawValues['171C_V2']).length > 0) dlj += 2
        newVals['archDeviceCounts'] = {
          dljQuantity: dlj, cdzQuantity: cdz,
          lightQuantity: light, unknownDeviceQuantity: unknown
        }
        this._deviceCountsComputed = true
      }
      // 增量更新：只在值变化时才赋值，避免整包 spread 触发 Vue 全量依赖重算
      const fv = this.formattedValues
      let changed = false
      for (const k of Object.keys(newVals)) {
        const oldVal = fv[k]
        const newVal = newVals[k]
        if (oldVal !== newVal && !(oldVal === undefined && newVal === undefined)) {
          fv[k] = newVal
          changed = true
        }
      }
      // 如果有变化，手动触发一次引用更新让 Vue 检测到
      if (changed) this.formattedValues = { ...fv }
    },
    getArchValue(deviceType, field) {
      const bucket = this.rawValues[deviceType] || {}
      const map = getRegisterMap(deviceType)
      const reg = map.monitor.find(p => p.field === field)
      if (!reg) return '--'
      const raw = bucket[reg.reg]
      if (raw === undefined || raw === null) return '--'
      return this.formatValue(raw, reg.decimals !== undefined ? reg.decimals : 2)
    },
    _computeItemText(p, bucket) {
      let raw
      const b = bucket || this.rawValues[this.currentDeviceType] || {}
      if (p.combined) {
        raw = b[p.field]
      } else {
        raw = b[p.reg]
      }
      if (raw === undefined || raw === null) return '--'
      if (p.status) {
        return p.status[raw] !== undefined ? p.status[raw] : String(raw)
      }
      let val = raw
      if (p.scale && p.scale !== 1) {
        val = raw * p.scale
      }
      const decimals = p.decimals !== undefined ? p.decimals : 2
      return this.formatValue(val, decimals)
    },
    _formatOneItem(p, bucket) {
      return { ...p, value: this._computeItemText(p, bucket), isAlarm: false }
    },
    /**
     * 标签栏标题
     * ⚠️ 不能用 index <= MONITOR_LAST_INDEX_50KW 判断监测 tab：50kW 的监测末尾是 10，
     * 而设置 tab 恰好占用 5~9、11，一旦按数值比较，5~9 全部被当成监测 tab 去查 TAB_TITLES，
     * 结果 tab6 显示「BMS设置」实际是储能、tab9 显示「快捷控制」实际是液冷机。
     * 这里改为按 tab 分组归属判断。
     */
    getTabTitle(index) {
      const monitorGroup = this.is50KwMode ? TAB_GROUP_MONITOR_50KW : TAB_GROUP_MONITOR
      if (monitorGroup.indexOf(index) !== -1) {
        return TAB_TITLES[index] || ''
      }
      // 设置 tab：以当前协议模板的配置为准（title / short 都和面板内容同源，不会再串台）
      const cfg = this.settingsTabs.find(t => t.tab === index)
      if (cfg) return cfg.short || cfg.title.replace(/\s*\([^)]*\)\s*$/, '')
      return TAB_TITLES[index] || ''
    },
    switchTab(index) {
      console.log('[tab] switchTab 点击: index=', index, '当前 currentTab=', this.currentTab, 'bottomTab=', this.bottomTab)
      if (index !== this.currentTab) {
        this.currentTab = index
        console.log('[tab] currentTab 已更新为=', index, 'is50Kw=', this.is50KwMode)
        const types = this.is50KwMode ? DEVICE_TYPES_50KW : DEVICE_TYPES
        const bucket = types[index]
        console.log('[tab] 对应 bucket=', bucket, 'rawValues[bucket] keys=', bucket ? Object.keys(this.rawValues[bucket] || {}).length : 'N/A')
        if (bucket === '171C' || bucket === '171C_V2') {
          this.initControlList()
        }
        if (index >= 5) {
          this.syncSettingsFromRealtime()
          const cfg = this.settingsTabs.find(t => t.tab === index)
          console.log('[tab] 设置面板=', cfg ? cfg.title : '未命中',
            '开关项=', cfg ? (this[cfg.dataKey] || []).length : 0,
            '数值项=', cfg ? (this[cfg.numericKey] || []).length : 0,
            '当前协议=', this.settingsProtocol)
        }
      } else {
        console.log('[tab] switchTab 跳过：index 与 currentTab 相同')
      }
    },
    /** 底部主导航切换：监测 / 设置 */
    switchBottomTab(type) {
      if (this.bottomTab === type) return
      // 切到设置需要操作码
      if (type === 'setting' && !this.hasAccessCode) {
        uni.showToast({ title: '请先在配置页输入操作码', icon: 'none' })
        return
      }
      this.bottomTab = type
      // 跳到对应组的首个子 tab
      this.switchTab(type === 'monitor' ? 0 : 5)
    },
    loadConfig() {
      try {
        const cfg = uni.getStorageSync(STORAGE_KEY)
        if (cfg) {
          // 协议规范化：确保 brokerUrl 带 tcp:// 协议头
          let brokerUrl = cfg.brokerUrl || ''
          if (brokerUrl && !/^tcp:\/\//i.test(brokerUrl)) {
            // 兼容旧的 ws:// 或无协议配置，统一转为 tcp://
            const m = brokerUrl.match(/^(?:wss?:\/\/)?([^:\/]+):(\d+)/i)
            const host = m ? m[1] : brokerUrl
            const wsPort = m ? parseInt(m[2], 10) : 1883
            const tcpPort = wsPort === 9001 ? 1883 : wsPort
            brokerUrl = `tcp://${host}:${tcpPort}`
            console.log('[loadConfig] 协议规范化 → tcp:', brokerUrl)
          }
          this.config = {
            enabled: !!cfg.enabled,
            protocol: 'mqtt',
            deviceType: cfg.deviceType || '20kW',
            deviceName: cfg.deviceName || '',
            ip: cfg.ip || '',
            port: cfg.port || '1883',
            brokerUrl,
            username: cfg.username || '',
            password: cfg.password || '',
            accessCode: cfg.accessCode || '',
            realtimeTopic: cfg.realtimeTopic || 'neiic/microEnergyStation001',
            controlSetTopic: cfg.controlSetTopic || 'neiic/microEnergyStationCtl002',
            controlRespTopic: cfg.controlRespTopic || 'neiic/microEnergyStationCtl002'
          }
        }
      } catch (e) {
        console.error('加载直连配置失败:', e)
      }
    },
    initControlList() {
      const map = getRegisterMap(this.currentDeviceType)
      this.controlList = map.control.map(c => ({
        ...c,
        currentValue: null,
        currentLabel: '--'
      }))
    },
    async start() {
      if (!this.config.enabled) return
      this.errorMsg = ''
      this.connecting = true
      try {
        await this.startMqtt()
      } catch (e) {
        this.errorMsg = e.message || '连接失败'
        uni.showToast({ title: this.errorMsg, icon: 'none' })
      } finally {
        this.connecting = false
      }
    },
    stop() {
      if (this.client) {
        try { this.client.disconnect() } catch (e) {}
        this.client = null
      }
      this.connected = false
      // 清空所有 bucket（保留 50kW bucket key，下次 MQTT 重连时能正确识别新协议）
      this.resetRawValues()
      this.formattedValues = {
        archDeviceCounts: { dljQuantity: 0, cdzQuantity: 0, lightQuantity: 0, unknownDeviceQuantity: 0 },
        archSocNumeric: 0,
        archStorageStatusGradient: '#8c8c8c'
      }
      this.displayItems = []
      this.groupedDisplay = []
      this._deviceCountsComputed = false
      // 清掉 pending 的节流定时器
      if (this._syncSettingsTimer) {
        clearTimeout(this._syncSettingsTimer)
        this._syncSettingsTimer = null
      }
    },
    // ============ MQTT 路径 ============
    async startMqtt() {
      await this.connectMqtt()
      await this.subscribeMqttTopics()
      // MQTT 推流模式：连接后无需主动拉取，等模拟器定时 publish
      // initSettingsParams 已在 onLoad 执行，这里仅同步实时值
      this.syncSettingsFromRealtime()
    },
    async connectMqtt() {
      if (!this.client) {
        this.client = new MqttDirectClient({
          brokerUrl: this.config.brokerUrl,
          username: this.config.username,
          password: this.config.password,
          realtimeTopic: this.config.realtimeTopic,
          controlSetTopic: this.config.controlSetTopic,
          controlRespTopic: this.config.controlRespTopic
        })
      } else {
        this.client.setConfig({
          brokerUrl: this.config.brokerUrl,
          username: this.config.username,
          password: this.config.password,
          realtimeTopic: this.config.realtimeTopic,
          controlSetTopic: this.config.controlSetTopic,
          controlRespTopic: this.config.controlRespTopic
        })
      }
      // 断线/错误回调
      this.client.onDisconnect = () => {
        // MQTT 异常断开：UI 切回离线，清空所有数据避免残留"断开前最后一帧"被误认为实时数据
        this.connected = false
        this.resetRawValues()
        this.updateDisplay()
        this.rebuildFormattedValues()
      }
      this.client.onError = (err) => {
        console.warn('MQTT error:', err.message)
      }
      await this.client.connect()
      this.connected = true
      // MQTT 重新连上：清空旧数据（可能来自上一次连接的不同 broker），等新帧到了再填
      this.resetRawValues()
      this.updateDisplay()
      this.rebuildFormattedValues()
      // 激活直连模式——只有真正连上 MQTT 才打激活标记
      try {
        uni.setStorageSync('direct_device_activated', true)
        console.log('[直连] MQTT 已连接，激活直连标记')
      } catch (e) { }
    },
    async subscribeMqttTopics() {
      const realtimeTopic = this.config.realtimeTopic
      const controlTopic = this.config.controlSetTopic
      console.log('[MQTT] 订阅主题: realtime=' + realtimeTopic + ' control=' + controlTopic)
      this.client.setTopics({
        realtime: realtimeTopic,
        controlSet: controlTopic,
        controlResp: controlTopic
      })
      await this.client.subscribeAll({
        onRealtime: (payloadStr, topic, payloadBytes) => this.handleMqttRealtime(payloadStr, payloadBytes),
        onControlResp: (payloadStr, topic, payloadBytes) => this.handleMqttControlResp(payloadStr, topic, payloadBytes)
      })
    },
    /**
     * 处理 MQTT 实时数据 payload
     * 支持两种格式：
     *   1) 模拟器 JSON：{ ts, deviceType, slaveId, fields: { B12: { name, raw, eng, unit }, ... } }
     *   2) 真机二进制 IEMS 帧：首字节 0x07/0x17/0x18，用 iems-frame-parser 解析
     */
    handleMqttRealtime(payloadStr, payloadBytes) {
      try {
        let realBytes = payloadBytes

        // 先解开可能的 JSON 信封（{"Send Data": "17 17..."} → "17 17..."）
        const unwrapped = this._unwrapHexPayload(payloadStr)

        // 尝试从 hex 字符串转二进制（unwrapped 已经是剥掉信封的纯 hex 或原始字符串）
        if (unwrapped) {
          const converted = this._hexStringToBytes(unwrapped)
          if (converted && converted.length >= 10) {
            realBytes = converted
            // console.log('[MQTT] 检测到 hex IEMS 帧, 转换后长度=' + converted.length + ' 首字节=0x' + converted[0].toString(16))
          }
        }

        if (realBytes && isIemsBinaryFrame(realBytes)) {
          // console.log('[MQTT] 收到 IEMS 状态帧, 长度=' + realBytes.length + ' 字节')
          this.applyIemsFrame(realBytes)
          this.lastUpdate = Date.now()
          return
        }

        // 兼容模拟器 JSON 格式
        if (payloadStr && typeof payloadStr === 'string' && payloadStr.trim().startsWith('{')) {
          try {
            const data = JSON.parse(payloadStr)
            // 只对模拟器格式（带 fields 字段）才走 JSON
            if (data.fields && data.deviceType) {
              this._applyJsonRealtime(data)
              return
            }
          } catch (e) { /* 不是 JSON，跳过 */ }
        }

        console.warn('[MQTT] realtime 无法识别, strLen=' + (payloadStr ? payloadStr.length : 0) +
          ' payloadBytes=' + (payloadBytes ? payloadBytes.length : 0))
      } catch (e) {
        console.error('MQTT realtime 解析失败:', e)
      }
    },
    /**
     * 归一化设备类型 → rawValues bucket key
     * 把完整的设备类型码（如 '1707_V3_5'、'170C_V1_1'、'171C_V2'）归一化成 factory 里用的简短 key
     */
    _normalizeDeviceType(rawDt, addrHint) {
      const dt = String(rawDt || '').toUpperCase().replace(/_/g, '')
      const addr = String(addrHint || '').toUpperCase()
      let result
      if (dt === '1707' || dt.startsWith('1707')) result = '1707'
      else if (dt === '170C' || dt.startsWith('170C')) {
        if (addr === '06' || addr === '6') result = '170C_PV'
        else if (addr === '1E' || addr === '30') result = '170C_STORAGE'
        else result = '170C_STORAGE'
      } else if (dt === '171CV2' || dt.startsWith('171CV2')) result = '171C_V2'
      else if (dt === '0318' || dt.startsWith('0318')) result = '0318'
      else if (dt === '131C' || dt.startsWith('131C')) result = '131C'
      else {
        const legacyMap = {
          '171B': '171B', '171C': '171C', '171D': '171D',
          '171E': '171E', '171F': '171F'
        }
        result = legacyMap[dt] || rawDt
      }
      return result
    },
    _applyJsonRealtime(data) {
      const fields = data.fields || {}
      const rawDt = (data.deviceType || '171C').toUpperCase()
      const deviceType = this._normalizeDeviceType(rawDt, data.address)
      if (!this.rawValues[deviceType]) this.rawValues[deviceType] = {}

      const bucket = this.rawValues[deviceType]
      const batch = {}
      let hasNew = false
      Object.keys(fields).forEach(field => {
        const f = fields[field]
        if (f && f.raw !== undefined) {
          const val = (f.eng !== undefined && typeof f.eng === 'number') ? f.eng : f.raw
          batch[field] = val
          if (bucket[field] !== val) hasNew = true
        }
      })
      if (hasNew) {
        this.rawValues[deviceType] = { ...bucket, ...batch }
        this.updateDisplay(deviceType)
        this.rebuildFormattedValues(deviceType)
        this.syncSettingsFromRealtime()
      }
      if (deviceType === this.currentDeviceType) {
        this.controlList.forEach(c => {
          const f = fields[c.field]
          if (f && f.raw !== undefined) {
            c.currentValue = f.raw
            const opt = c.options && c.options.find(o => String(o.value) === String(f.raw))
            c.currentLabel = opt ? opt.label : String(f.raw)
          }
        })
      }
      this.lastUpdate = Date.now()
    },
    /**
     * 解析二进制 IEMS 帧并写入 rawValues
     * 输出与 DataCenter 推送格式一致：{frameType, deviceType, address, dataType, data:{B0:..}, dateTime}
     */
    /**
     * 50kW 新协议判定：与 is50KwMode 一致，供 applyIemsFrame 内部使用
     * （仅影响解析选用的协议模块，不影响数据来源）
     */
    _use50KwProtocol() {
      if (this.config && this.config.deviceType === '50kW') return true
      const rv = this.rawValues || {}
      return ['1707', '170C_STORAGE', '170C_PV', '171C_V2'].some(
        k => rv[k] && Object.keys(rv[k]).length > 0
      )
    },
    /** 读取帧头里的设备类型（大端 2 字节） */
    _pendingDeviceType(frameBytes) {
      if (!frameBytes || frameBytes.length < 3) return ''
      const n = (frameBytes[1] << 8) | frameBytes[2]
      return n.toString(16).toUpperCase().padStart(4, '0')
    },
    /** 设备类型 → 50kW 协议模块 key（非 50kW 模式返回 ''） */
    _protocolKeyFor(deviceTypeHex) {
      if (!this._use50KwProtocol()) return ''
      const dt = String(deviceTypeHex || '').toUpperCase()
      if (dt.startsWith('1707')) return '1707_V3_5'
      if (dt.startsWith('170C')) return '170C_V1_1'
      if (dt.startsWith('171C')) return '171C_V2'
      return ''
    },
    applyIemsFrame(frameBytes) {
      try {
        // 50kW 微能站：新协议与旧协议共用同一设备类型码（170C/171C），
        // 必须显式指定协议模块，否则会落到 170C_000A / 171C_000A 旧布局上解析错位
        const protocolKey = this._protocolKeyFor(this._pendingDeviceType(frameBytes))
        const parsed = parseIemsFrame(frameBytes, protocolKey ? { protocolKey } : undefined)
        const rawDt = (parsed.deviceType || '171C').toUpperCase()
        const deviceType = this._normalizeDeviceType(rawDt, parsed.address)
        if (!this.rawValues[deviceType]) this.rawValues[deviceType] = {}
        if (parsed._dataTypeNum === IEMS_DATA_TYPE.DEVICEINFO) return

        const map = getRegisterMap(deviceType)
        const data = parsed.data || {}
        const dataTypeNum = parsed._dataTypeNum
        const bucket = this.rawValues[deviceType]

        // 所有非 DEVICEINFO 类型的帧：都把解析到的数据存入 rawValues
        // ENERGY / STATE / CONTROL 只是用途不同，但都包含寄存器值
        const fieldToReg = {}
        ;(map.monitor || []).forEach(p => { if (p.reg !== undefined && p.field) fieldToReg[p.field] = p.reg })
        ;(map.control || []).forEach(p => { if (p.reg !== undefined && p.field) fieldToReg[p.field] = p.reg })

        // 非 ENERGY 帧键加前缀隔离，避免与 ENERGY 帧共享 B-key 互相覆盖
        //   50kW bucket：STATE='S_' / CONTROL='C_'
        //   171F 策略控制器：CONTROL 帧的 B0/B2/B4/B6/B8... 是控制命令，
        //     与 ENERGY 帧的 B0(光伏功率)/B4(电网功率)/B34(今日发电) 含义完全不同，
        //     不加前缀会用控制帧的原始值覆盖架构图与今日电量展示
        //   0318 液冷机：设置页下发控制后设备会回读整帧，未使用的字节普遍填充 0xFF，
        //     不加前缀会把 B86~B95 故障字覆盖成 0xFF，导致 76 个故障位全部点亮
        const useFrameTypePrefix =
          deviceType === '1707' || deviceType === '170C_STORAGE' ||
          deviceType === '170C_PV' || deviceType === '171C_V2' ||
          deviceType === '171F' || deviceType === '131C' ||
          deviceType === '0318'
        const keyPrefix = !useFrameTypePrefix ? ''
          : dataTypeNum === IEMS_DATA_TYPE.STATE ? 'S_'
          : dataTypeNum === IEMS_DATA_TYPE.CONTROL ? 'C_' : ''

        const batch = {}
        let hasNewValue = false
        Object.keys(data).forEach(field => {
          const v = data[field]
          if (v === undefined || v === null) return
          const storeKey = keyPrefix + field
          batch[storeKey] = v
          // 寄存器号别名仅对未加前缀的键（ENERGY/旧协议）生成，避免污染 reg 号索引
          if (!keyPrefix && fieldToReg[field] !== undefined) {
            batch[fieldToReg[field]] = v
          }
          if (bucket[storeKey] !== v) hasNewValue = true
        })

        if (hasNewValue) {
          this.rawValues[deviceType] = { ...bucket, ...batch }
          // ENERGY 和 STATE 帧都会更新数值显示
          if (dataTypeNum === IEMS_DATA_TYPE.ENERGY || dataTypeNum === IEMS_DATA_TYPE.STATE) {
            this.updateDisplay(deviceType)
            this.rebuildFormattedValues(deviceType)
          }
          // CONTROL 帧：更新设置面板上的开关/控制参数
          if (dataTypeNum === IEMS_DATA_TYPE.CONTROL) {
            if (deviceType === '171F') {
              // 快捷控制回显依赖这一帧（0x04 控制数据）；没有这行日志说明设备根本没回控制帧
              const ks = Object.keys(data).filter(k => data[k] !== undefined).slice(0, 24)
              console.log('[171F] 控制数据帧字段:', ks.join(','))
            }
            if (deviceType === this.currentDeviceType) {
              this.controlList.forEach(c => {
                const v = data[c.field]
                if (v !== undefined && v !== null) {
                  c.currentValue = v
                  const opt = c.options && c.options.find(o => String(o.value) === String(v))
                  c.currentLabel = opt ? opt.label : String(v)
                }
              })
            }
            // 某些设备的 CONTROL 帧也携带状态量（如 171D 同时包含一些状态位）
            // 所以 CONTROL 帧也触发 display 更新，确保不会漏掉任何变化
            this.updateDisplay(deviceType)
            this.rebuildFormattedValues(deviceType)
          }
          // 数据到达后同步设置面板（首次拿到 50kW bucket 即切换到新协议模板）
          this.syncSettingsFromRealtime()
        }
        this.lastUpdate = Date.now()
      } catch (e) {
        console.error('IEMS 帧解析失败:', e && e.message, 'deviceType=', arguments[1] || '(unknown)')
      }
    },
    handleMqttStatus(payloadStr) {
      try {
        const data = JSON.parse(payloadStr)
        // online: false 通常表示其他客户端离线；不影响本连接状态
        // 仅用于日志展示，这里仅 toast 提示
        if (data.online === false && data.clientId) {
          console.log('设备端离线:', data.clientId)
        }
      } catch (e) {
        console.error('MQTT status 解析失败:', e)
      }
    },
    handleMqttControlResp(payloadStr, topic, payloadBytes) {
      // console.log('[MQTT CONTROL RESP] topic=' + topic + ' strLen=' + (payloadStr ? payloadStr.length : 0))

      // 先解开可能的 JSON 信封（{"Send Data": "17 17..."} → "17 17..."）
      const unwrapped = this._unwrapHexPayload(payloadStr)

      // 0. 本机回环：控制 topic 同时被本机订阅，刚发下去的帧会原样收回，不能当成设备应答
      //    （否则会立刻弹「指令已生效」，掩盖设备实际未执行的问题）
      if (unwrapped) {
        const echoHex = unwrapped.replace(/[\s,]/g, '').toUpperCase()
        if (this._isOwnControlEcho(echoHex)) {
          console.log('[MQTT CONTROL RESP] 忽略本机回环帧: ' + echoHex.slice(0, 80))
          return
        }
      }

      // 1. 尝试 hex 字符串 → 二进制 → 用 parseIemsFrame 解析
      if (unwrapped) {
        const bytes = this._hexStringToBytes(unwrapped)
        if (bytes && bytes.length >= 9) {
          const ft = bytes[0]
          // console.log('[MQTT CONTROL RESP] hex 帧, frameType=0x' + ft.toString(16) + ' 长度=' + bytes.length)

          // 0x16 = 下行控制帧（设备控制指令的直接应答）
          if (ft === 0x16) {
            try {
              const ctrlFrame = parseIemsControlFrame(bytes)
              // console.log('[MQTT CONTROL RESP] parseIemsControlFrame OK: ' + JSON.stringify(ctrlFrame))
              if (ctrlFrame.registers) {
                const changes = Object.entries(ctrlFrame.registers).map(([field, newValue]) => ({ field, newValue }))
                changes.forEach(c => this._applyControlChange(c))
                uni.showToast({ title: '指令已生效', icon: 'success' })
              }
            } catch (e) {
              // console.warn('[MQTT CONTROL RESP] parseIemsControlFrame 失败:', e.message)
              // fallback 到通用解析提取寄存器
              try {
                const frame = parseIemsFrame(bytes)
                const changes = this._extractRegisterChangesFromFrame(frame)
                if (changes.length > 0) {
                  changes.forEach(c => this._applyControlChange(c))
                  uni.showToast({ title: '指令已生效', icon: 'success' })
                }
              } catch (e2) {
                console.warn('[MQTT CONTROL RESP] parseIemsFrame fallback 失败:', e2.message)
              }
            }
            return
          }

          // 0x17 = COMMON_STATUS（实时数据帧，设备收到控制后在同一 topic 上回发当前状态）
          // 0x07 = DEVICE_REPORT / 0x18 = PROJECT_REGISTER
          if (ft === 0x17 || ft === 0x07 || ft === 0x18) {
            // console.log('[MQTT CONTROL RESP] 收到状态帧 0x' + ft.toString(16) + ' (realtime handler 也会收到)')
            return
          }

          // 未知 frameType 也尝试 parse
          try {
            const frame = parseIemsFrame(bytes)
            if (frame) {
              // console.log('[MQTT CONTROL RESP] 通用 parseIemsFrame OK: frameType=0x' + frame._frameType.toString(16))
              return
            }
          } catch (e) {
            console.warn('[MQTT CONTROL RESP] parseIemsFrame 未知帧类型失败:', e.message)
          }
        }
      }

      // 2. 尝试原始二进制（含本机回环：自己刚发下去的 0x16 控制帧会被同 topic 订阅收回）
      if (payloadBytes && payloadBytes.length >= 9) {
        const ft = payloadBytes[0]
        if (ft === 0x16) {
          try {
            const ctrlFrame = parseIemsControlFrame(payloadBytes)
            if (ctrlFrame && ctrlFrame.registers) {
              Object.entries(ctrlFrame.registers)
                .map(([field, newValue]) => ({ field, newValue }))
                .forEach(c => this._applyControlChange(c))
              uni.showToast({ title: '指令已生效', icon: 'success' })
            }
            return
          } catch (e) { /* fallthrough */ }
        }
        if (ft === 0x17 || ft === 0x07 || ft === 0x18) {
          try {
            const frame = parseIemsFrame(payloadBytes)
            if (frame) return
          } catch (e) { /* fallthrough */ }
        }
      }

      // 兜底日志：二进制消息一律打 hex，避免 payloadStr 被 UTF-8 解码成乱码看不懂
      let hexDump = ''
      if (payloadBytes && payloadBytes.length) {
        hexDump = Array.from(payloadBytes).map(b => b.toString(16).padStart(2, '0')).join(' ')
      }
      const printableText = (payloadStr && /^[\x20-\x7e\r\n\t\u4e00-\u9fa5]*$/.test(payloadStr))
        ? payloadStr.slice(0, 140)
        : ''
      console.warn('[MQTT CONTROL RESP] 无法识别的消息格式' +
        (hexDump ? ' hex=' + hexDump.slice(0, 180) : '') +
        (printableText ? ' text=' + printableText : ''))
    },
    /**
     * 判断是否是本机刚下发的控制帧（同 topic 订阅回环）
     * @param {string} hex 收到的帧 hex（已去掉分隔符、大写）
     */
    _isOwnControlEcho(hex) {
      try {
        const c = this.client
        if (!c || !c._lastControlHex) return false
        // 3 秒窗口：超过这个时间的同内容帧更可能是设备回执
        if (Date.now() - (c._lastControlAt || 0) > 3000) return false
        return String(hex).toUpperCase() === String(c._lastControlHex).toUpperCase()
      } catch (e) {
        return false
      }
    },
    /**
     * 把各种格式的 hex 字符串转换成 Uint8Array
     * 把 hex 字符串转换成 Uint8Array
     * 只匹配"连续的空格/逗号分隔的 2 位 hex 序列"，排除 Send/Data 里的 en/da 等巧合
     * 纯 hex 输入："17 17 1f 00 01" 或 "17,17,1f"
     */
    _hexStringToBytes(hexStr) {
      if (!hexStr || typeof hexStr !== 'string') return null
      // 找第一段连续的、以空白或冒号为边界的 hex 序列
      // 先尝试"冒号 + 空格分隔 + 闭合大括号"格式：Send Data: 17 17 1f ... }
      // 再尝试"纯空格/逗号分隔"：17 17 1f ... 或 17,17,1f
      let hexPart = hexStr.trim()
      // 剥掉可能包裹的 { ... } 外壳
      if (hexPart.startsWith('{')) {
        const endBrace = hexPart.lastIndexOf('}')
        if (endBrace > 0) hexPart = hexPart.substring(1, endBrace)
        else hexPart = hexPart.substring(1)
      }
      // 冒号后面才是真正的 hex 值（处理 "Send Data: 17 17..."）
      const colonIdx = hexPart.indexOf(':')
      if (colonIdx >= 0) hexPart = hexPart.substring(colonIdx + 1)
      // 现在 hexPart 应该是 "17 17 1f 00 01 ..." 这样的了
      // 按空白/逗号 split，每个片段必须恰好是 2 位 hex
      const parts = hexPart
        .split(/[\s,]+/)
        .map(s => s.trim())
        .filter(s => /^[0-9a-fA-F]{2}$/.test(s))
      if (parts.length < 3) return null
      const bytes = new Uint8Array(parts.length)
      for (let i = 0; i < parts.length; i++) {
        bytes[i] = parseInt(parts[i], 16) & 0xff
      }
      return bytes
    },
    /**
     * 从可能的信封中提取 hex 部分
     * 支持：
     *   - JSON 信封: {"Send Data": "17 17..."} 或 {"data": "17 17..."}
     *   - JS object literal: {Send Data: 17 17...} (key/value 都没引号)
     *   - 纯 hex 字符串直接返回
     */
    _unwrapHexPayload(payloadStr) {
      if (!payloadStr || typeof payloadStr !== 'string') return payloadStr
      const trimmed = payloadStr.trim()
      if (trimmed.startsWith('{')) {
        // 1) 先尝试标准 JSON
        try {
          const data = JSON.parse(trimmed)
          const envelopeKeys = ['Send Data', 'sendData', 'SendData', 'data', 'hex', 'payload']
          for (const key of envelopeKeys) {
            const val = data[key]
            if (typeof val === 'string' && val.length >= 4) {
              // console.log('[MQTT] 从 JSON 信封提取 hex payload, key=' + key)
              return val.trim()
            }
          }
        } catch (e) { /* 不是合法 JSON，继续 */ }

        // 2) 非标准 JSON（JS object literal）→ 用正则硬捞
        // 格式: {Send Data: 17 17 1f ... } 或 { "data": 17 17 ... }
        // 匹配冒号后面到 } 之前的所有内容
        const match = trimmed.match(/\{\s*[^:]+:\s*([0-9a-fA-F\s,]+)\s*\}/)
        if (match && match[1] && match[1].trim().length >= 4) {
          // console.log('[MQTT] 从非标准信封提取 hex payload (regex)')
          return match[1].trim()
        }
      }
      return trimmed
    },
    _extractRegisterChangesFromFrame(frame) {
      const changes = []
      if (!frame || !frame.data) return changes
      // frame.data 是 { '0': value, '2': value, ... } 按寄存器偏移
      // 需要结合 startAddr 算出 B 编号
      const startAddr = frame.startAddr || 0
      for (const regOffset of Object.keys(frame.data)) {
        const val = frame.data[regOffset]
        const bNum = startAddr + parseInt(regOffset, 10)
        changes.push({ field: 'B' + bNum, newValue: val })
      }
      return changes
    },
    _applyControlChange(change) {
      // 更新快捷控制/设置面板的按钮状态
      if (change.field && change.newValue !== undefined) {
        this.controlList.forEach(c => {
          if (c.field === change.field) {
            c.currentValue = change.newValue
            const opt = c.options && c.options.find(o => String(o.value) === String(change.newValue))
            if (opt) c.currentLabel = opt.label
          }
        })
        // 同步设置面板参数状态
        this.syncAllParamsFromResp(change)
      }
    },
    syncParamFromResp(params, data) {
      params.forEach(p => {
        if (p.field === data.field && data.newValue !== undefined) {
          const raw = data.newValue
          p.currentValue = raw
          if (p.options) {
            const opt = p.options.find(o => String(o.value) === String(raw))
            p.currentLabel = opt ? opt.label : String(raw)
          }
          if (p.scale && p.scale !== 1) {
            const scaled = Number(raw) / p.scale
            p.currentText = this.formatValue(scaled, p.decimals !== undefined ? p.decimals : 1)
          } else {
            p.currentText = String(raw)
          }
        }
      })
    },
    syncAllParamsFromResp(data) {
      SETTINGS_PANELS.forEach(cfg => {
        this.syncParamFromResp(this[cfg.dataKey], data)
      })
    },
    reconnect() {
      this.stop()
      this.start()
    },
    onDisconnect() {
      this.stop()
      uni.showToast({ title: '已断开连接', icon: 'none' })
    },
    async manualRefresh() {
      if (this.connecting) return
      if (!this.connected) {
        await this.start()
        return
      }
      // MQTT 推流模式：数据自动到达，无需主动刷新
      uni.showToast({ title: 'MQTT 推流模式，数据自动到达', icon: 'none' })
    },
    async onControlClick(rawPayload, legacyOpt) {
      const payload = this._normalizePanelPayload(rawPayload)
      // 新载荷：{ index, optionIndex }（ControlCard → BmsTab → 页面，两级事件桥都只传下标）
      // 旧载荷：(ctrl, opt)，保留兼容
      let ctrl = null
      let opt = null
      if (payload && typeof payload === 'object' && payload.index !== undefined && payload.optionIndex !== undefined) {
        ctrl = (this.controlList || [])[payload.index] || null
        opt = (ctrl && ctrl.options) ? ctrl.options[payload.optionIndex] : null
      } else {
        ctrl = payload || null
        opt = legacyOpt || null
      }
      if (!ctrl || !opt || opt.value === undefined || opt.value === null || String(opt.value).trim() === '') {
        console.error('[CMD] 控制项解析失败，载荷=', payload)
        uni.showModal({
          title: '下发失败',
          content: '未能识别该按钮对应的指令，请退出页面重新进入后再试',
          showCancel: false
        })
        return
      }
      if (!this.isConnected) {
        uni.showToast({ title: '设备未连接', icon: 'none' })
        return
      }
      if (String(ctrl.currentValue) === String(opt.value)) {
        uni.showToast({ title: '已是当前状态', icon: 'none' })
        return
      }
      this.clickedBtn = ctrl.field + '-' + opt.value
      if (this.clickedResetTimer) clearTimeout(this.clickedResetTimer)
      this.clickedResetTimer = setTimeout(() => { this.clickedBtn = '' }, 600)

      const doWrite = async () => {
        try {
          // MQTT 模式：publish 控制指令到 control/set 主题，等模拟器回 controlResp
          await this.client.sendControl(ctrl.field, opt.value, this.currentDeviceType)
          uni.showToast({ title: '指令已下发，等待设备响应', icon: 'none' })
        } catch (e) {
          uni.showModal({ title: '下发失败', content: e.message || '请重试', showCancel: false })
        }
      }

      if (opt.dangerous) {
        uni.showModal({
          title: '操作确认',
          content: `确定要执行「${opt.label}」吗？此操作可能影响设备运行状态。`,
          success: (res) => {
            if (res.confirm) doWrite()
          }
        })
      } else {
        await doWrite()
      }
    },
    // ============ 设置面板方法 ============

    initSettingsParams() {
      SETTINGS_PANELS.forEach(cfg => this._clonePanelParams(cfg))
      this.syncSettingsFromRealtime()
    },
    syncSettingsFromRealtime() {
      // 节流：设置面板数据 500ms 合并更新一次，避免每帧全量遍历几十个参数做 scale 换算
      if (this._syncSettingsTimer) return
      this._syncSettingsTimer = setTimeout(() => {
        this._syncSettingsTimer = null
        this._doSyncSettingsFromRealtime()
      }, 500)
    },
    /** 按面板配置深克隆一份参数数组（重置回显值），供协议切换 / 自愈复用 */
    _clonePanelParams(cfg) {
      const src = cfg.source || []
      const hasOptions = src.length > 0 && src[0] && src[0].options
      this[cfg.dataKey] = src.map(p => ({
        ...p,
        currentValue: null,
        currentLabel: hasOptions ? '--' : undefined,
        currentText: hasOptions ? undefined : '--'
      }))
    },
    _doSyncSettingsFromRealtime() {
      // 50kW 判定：配置页选择 50kW，或已收到新协议 bucket 数据
      const has50Kw = this.is50KwMode
      const rv = this.rawValues || {}

      // 协议模板切换：initSettingsParams 会先按 20kW 模板填充数组，
      // 检测到 50kW 后必须整体重建，否则永远显示 20kW 参数
      const targetProtocol = has50Kw ? '50kw' : '20kw'
      const sourcePanels = has50Kw ? SETTINGS_PANELS_50KW : SETTINGS_PANELS
      if (this.settingsProtocol !== targetProtocol) {
        sourcePanels.forEach(cfg => this._clonePanelParams(cfg))
        this.settingsProtocol = targetProtocol
      }
      // 自愈：任何面板数组为空都按当前协议模板补一次
      // （协议切换时序、页面重进等情况下漏初始化会让设置页整页空白，这里兜住）
      sourcePanels.forEach(cfg => {
        const arr = this[cfg.dataKey]
        if (!arr || arr.length === 0) this._clonePanelParams(cfg)
      })

      // 同步实时值：遍历对应协议的 PANELS 配置
      const panels = sourcePanels
      panels.forEach(cfg => {
        const params = this[cfg.dataKey]
        if (!params || params.length === 0) return
        const bucket = rv[cfg.deviceType] || {}
        // 同一 deviceType 可能 registerMap 是短码（170C_STORAGE 前缀匹配 '170C'），用 getRegisterMap 拿完整映射
        const regMap = getRegisterMap(cfg.deviceType)
        const allFieldToReg = {}
        if (regMap && regMap.monitor) {
          regMap.monitor.forEach(p => { if (p.reg !== undefined && p.field) allFieldToReg[p.field] = p.reg })
        }
        if (regMap && regMap.control) {
          regMap.control.forEach(p => { if (p.reg !== undefined && p.field) allFieldToReg[p.field] = p.reg })
        }

        // 171F 快捷控制/功率参数来自 CONTROL 帧，而 CONTROL 帧键已加 C_ 前缀；
        // ENERGY 帧的同名 B-key（B0=光伏功率、B4=电网功率…）含义完全不同，不能误读
        const is171FQuickCtl = cfg.deviceType === '171F' &&
          (cfg.dataKey === 'quickControlParams' || cfg.dataKey === 'quickPowerParams')

        params.forEach(p => {
          // 多层 fallback 查找顺序：
          // 1. 171F 快捷控制：C_/S_ 帧前缀键（CONTROL 帧的控制命令）
          // 2. param.key（50kW 带 S_/C_ 帧前缀；旧协议 B{n}）
          // 3. 去掉前缀的裸 B-key（模拟器 JSON 上报不带帧类型前缀）
          // 4. param.field（地址字符串）
          // 5. param.address 转成整数（十进制 byte 地址）
          // 6. registerMap 里 field → reg 号（帧解析同时存了 B{n} 和 reg 号两种 key）
          const candidates = []
          if (is171FQuickCtl) {
            // 171F 控制帧的 B-key 与能源帧重号（B0=光伏功率、B4=电网功率、B8=储能功率…），
            // 只能读带 C_ 前缀的控制帧键；回落裸 B4 会把「电网功率」当成「储能DC开关机」
            const f = String(p.field || '')
            if (/^B\d+$/.test(f)) candidates.push('C_' + f)
            candidates.push(p.key)
          } else {
            candidates.push(p.key)
            const bareKey = String(p.key).replace(/^[SC]_/, '')
            if (bareKey !== p.key) candidates.push(bareKey)
            candidates.push(p.field)
            if (p.address) {
              const addrNum = parseInt(p.address, 10)
              if (!isNaN(addrNum)) candidates.push(addrNum)
            }
            if (allFieldToReg[p.key] !== undefined) candidates.push(allFieldToReg[p.key])
            if (allFieldToReg[p.field] !== undefined) candidates.push(allFieldToReg[p.field])
          }

          let val
          for (const k of candidates) {
            if (k !== undefined && bucket[k] !== undefined) { val = bucket[k]; break }
          }
          if (val === undefined) return  // bucket 里没这个值（控制寄存器设备不上报）

          const raw = typeof val === 'object' ? (val.raw !== undefined ? val.raw : val.eng) : val
          const eng = typeof val === 'object' ? (val.eng !== undefined ? val.eng : raw) : raw
          const sf = p.scale || 1
          const off = p.offset || 0
          if (p.protoScaled) {
            // 协议层已按点表 scale 换算过（如 171F 控制帧 B8 已 /10、B16 已 /100），
            // 面板不能再除一次，否则 5.0kW 会变成 0.5kW
            p.currentValue = Number(eng)
            p.currentText = this.formatValue(Number(eng), p.decimals !== undefined ? p.decimals : 1)
          } else if (sf !== 1 || off) {
            // 工程值 = 原始值/系数 + 偏移（温度阈值 -40℃ 类，原始 810 → 41.0℃）
            const scaled = Number(eng) / sf + off
            p.currentValue = scaled
            p.currentText = this.formatValue(scaled, p.decimals !== undefined ? p.decimals : 1)
          } else {
            p.currentValue = raw
            p.currentText = raw !== undefined ? String(raw) : '--'
          }
          if (p.options) {
            // 位命令：帧上报单比特 0/1，选项值为 0x00000000/0x00010000，先归一化再匹配
            const matchRaw = p.bitHex ? (Number(raw) ? '0x00010000' : '0x00000000') : raw
            const opt = p.options.find(o => String(o.value) === String(matchRaw))
            p.currentLabel = opt ? opt.label : (raw !== undefined ? String(raw) : '--')
            if (p.bitHex) p.currentValue = matchRaw
          }
        })
      })
    },
    getParamCurrentValue(p) {
      return p.currentValue
    },
    /** 模板辅助：通过 dataKey 动态获取参数数组（小程序模板不支持 this[变量]） */
    getParams(dataKey) {
      return this[dataKey] || []
    },
    /** 模板辅助：通过 editKey 动态获取编辑状态 */
    isEditing(editKey) {
      return !!this[editKey]
    },
    getParamCurrentLabel(p) {
      return p.currentLabel || '--'
    },
    getParamCurrentText(p) {
      return p.currentText || '--'
    },
    toggleEdit(editKey) {
      // editKey 从子组件事件传回，万一取不到（事件桥丢参）就退回当前 tab 的 editKey，
      // 否则会写成 this[undefined] = true，表现为「点修改没反应」
      let key = editKey
      if (typeof key !== 'string' || !(key in this.$data)) {
        key = this.currentSettingsTab && this.currentSettingsTab.editKey
      }
      if (!key) return
      this[key] = !this[key]
      console.log('[SettingsPanel] 编辑态切换:', key, '=', this[key])
      if (this[key]) {
        this.syncSettingsFromRealtime()
      }
    },
    /**
     * 设置项下发前的硬门禁：必须处于编辑态（点过「修改」）才允许下发。
     * 面板层已拦一次，这里再拦一次 —— 事件桥异常、或别的入口直接调方法时也不会误下发。
     */
    _guardSettingsEdit() {
      const key = this.currentSettingsTab && this.currentSettingsTab.editKey
      if (key && this[key]) return true
      this.onNeedEdit()
      return false
    },
    /** 未进入编辑态就点参数：明确提示，不下发（以前这里会顺手把编辑态打开，等于绕过「修改」按钮） */
    onNeedEdit() {
      this.showOpToast = true
      this.opToast = '请先点右上角「修改」，再操作参数'
      if (this._needEditTimer) clearTimeout(this._needEditTimer)
      this._needEditTimer = setTimeout(() => {
        this.showOpToast = false
        this._needEditTimer = null
      }, 2200)
    },
    /**
     * 归一化事件载荷形态
     * 不同端（H5 / 微信 / 支付宝）转发自定义组件事件时形态不一致，实测可能遇到三种：
     *   1) 直接就是我们的载荷对象
     *   2) 被包一层原生事件：{ type, detail: { __args__: [载荷] } }
     *   3) 多参数被折叠成数组：[载荷] 或 [param, option]
     * 统一摊平成对象后再解析，避免「选项丢失 → 下发值为空」这类只在真机出现的问题。
     */
    _normalizePanelPayload(payload) {
      let pl = payload
      if (pl && typeof pl === 'object' && !Array.isArray(pl) && pl.detail && typeof pl.detail === 'object') {
        const d = pl.detail
        if (Array.isArray(d.__args__) && d.__args__.length) {
          pl = d.__args__.length === 1 ? d.__args__[0] : { param: d.__args__[0], option: d.__args__[1] }
        } else {
          pl = d
        }
      }
      if (Array.isArray(pl)) {
        pl = pl.length === 1 ? pl[0] : { param: pl[0], option: pl[1] }
      }
      return pl
    },
    /**
     * 解析设置面板事件载荷
     * 新格式（SettingsPanel 当前版本）：{ dataKey, key, optionIndex }
     * 旧格式（老组件 / 其它调用方直接传对象）：(param, option)
     * 统一返回 { param, option }，option 缺失时按下标 / label / value 从 p.options 找回，
     * 避免出现「参数对象到手、选项对象丢失」→ 下发值为空 → 「字段不能为空」这种看不懂的报错。
     */
    _resolvePanelEvent(rawPayload, legacyOpt) {
      const payload = this._normalizePanelPayload(rawPayload)
      let p = null
      let opt = legacyOpt || null
      let optionIndex = null

      if (payload && typeof payload === 'object' && payload.dataKey !== undefined && payload.key !== undefined) {
        const list = this[payload.dataKey] || []
        p = list.find(x => String(x.key) === String(payload.key)) || null
        optionIndex = payload.optionIndex
        // 兜底：开关项可能来自 extraSwitchKey 段，不在 dataKey 数组里，全局再找一遍
        if (!p) {
          const PANEL_KEYS = [
            'bmsSwitchParams', 'bmsNumericParams', 'bmsPowerParams',
            'pcsSwitchParams', 'pcsNumericParams',
            'pvSwitchParams', 'pvNumericParams',
            'storageSwitchParams', 'storageNumericParams',
            'quickControlParams', 'quickPowerParams',
            'liquidSwitchParams', 'liquidNumericParams'
          ]
          for (const k of PANEL_KEYS) {
            const arr = this[k] || []
            const hit = arr.find(x => String(x.key) === String(payload.key))
            if (hit) { p = hit; break }
          }
        }
      } else if (payload && typeof payload === 'object' && payload.param) {
        p = payload.param
        opt = payload.option || opt
        optionIndex = payload.optionIndex
      } else {
        p = payload || null
      }
      if (!p) return { param: null, option: null }

      if (p.options && p.options.length) {
        if (optionIndex !== null && optionIndex !== undefined && p.options[optionIndex]) {
          opt = p.options[optionIndex]
        }
        const valid = opt && typeof opt === 'object' &&
          opt.value !== undefined && opt.value !== null && String(opt.value).trim() !== ''
        if (!valid) {
          // 二次兜底：拿到的可能是 label（字符串）、下标数字或残缺对象
          if (typeof opt === 'string' || typeof opt === 'number') {
            opt = p.options.find(o => String(o.value) === String(opt)) ||
              p.options.find(o => o.label === opt) || null
          } else if (opt && typeof opt === 'object' && opt.label) {
            opt = p.options.find(o => o.label === opt.label) || null
          } else {
            opt = null
          }
        }
        // 三次兜底：用事件里冗余带的 value/label 直接还原（反查链路全断时也能下发）
        if (!opt && payload && payload.value !== undefined && payload.value !== null &&
          String(payload.value).trim() !== '') {
          opt = { label: payload.label || String(payload.value), value: payload.value, dangerous: false }
        }
      }
      return { param: p, option: opt }
    },
    async onSwitchParamClick(payload, legacyOpt) {
      // 门禁放最前：未点「修改」时连解析都不做，直接提示
      if (!this._guardSettingsEdit()) return
      const resolved = this._resolvePanelEvent(payload, legacyOpt)
      const p = resolved.param
      const opt = resolved.option
      // 排查用：确认事件载荷与解析结果（小程序事件桥异常时这里能一眼看出丢的是哪一段）
      console.log('[SettingsPanel] switch-click 载荷=', JSON.stringify(payload),
        '→ 参数=', p && p.key, '选项=', opt && opt.label, '=', opt && opt.value)
      if (!p) return
      if (!opt) {
        console.error('[CMD] 选项解析失败，载荷=', payload, ' 参数=', p.key)
        uni.showModal({
          title: '下发失败',
          content: '未能识别该按钮对应的选项，请退出页面重新进入后再试（参数 ' + p.label + '）',
          showCancel: false
        })
        return
      }
      if (!this.isConnected) {
        uni.showToast({ title: '设备未连接', icon: 'none' })
        return
      }
      if (String(p.currentValue) === String(opt.value)) {
        this.showOpToast = true
        this.opToast = `${p.label}: 当前已是 ${opt.label}`
        setTimeout(() => { this.showOpToast = false }, 2000)
        return
      }

      const deviceType = p.deviceType || '171C'
      const doSend = async () => {
        try {
          this.client.setDeviceType(deviceType)
          // 构造 overrides：新协议有确切寄存器地址时用 registerAddress 跳过 B{n} 推导
          const overrides = {}
          if (p.address) overrides.registerAddress = p.address
          if (p.regType !== undefined) overrides.regType = p.regType
          // BMS 位字段打包：bit 存在时需要合成同地址所有 bit（V1.2 起 BMS 命令已改字节型，一般不会走这里）
          const isBit = p.bit !== null && p.bit !== undefined
          const sendField = isBit ? (p.field || 'B3') : p.field
          const sendValue = isBit ? this._packBmsByte(p, opt.value) : opt.value
          // 兜底校验：宁可在这里报一句能看懂的话，也不要让空值一路进到帧构造函数，
          // 最后只抛一个「字段不能为空」（看不出是哪个参数、为什么空）
          if (sendField === undefined || sendField === null || String(sendField).trim() === '') {
            throw new Error(`参数「${p.label}」缺少下发字段（${p.key}），请重新进入该标签页后再试`)
          }
          if (sendValue === undefined || sendValue === null || String(sendValue).trim() === '') {
            throw new Error(`参数「${p.label}」的下发值为空，请重新进入该标签页后再试`)
          }

          // 下发前打印完整指令，便于与设备侧抓包逐项比对
          console.log('========== 下发设置指令（开关量） ==========')
          console.log('[CMD] 参数      :', p.label, '(' + p.key + ')')
          console.log('[CMD] 选择      :', opt.label, '=', opt.value, opt.dangerous ? '【危险操作】' : '')
          console.log('[CMD] 设备类型  :', deviceType)
          console.log('[CMD] 下发字段  :', sendField, isBit ? '（位命令 bit=' + p.bit + '，已打包整字节）' : '')
          console.log('[CMD] 寄存器地址:', p.address ? p.address + ' (0x' + Number(p.address).toString(16).toUpperCase() + ')' : '由字段推导',
            ' 寄存器类型:', p.regType !== undefined ? p.regType : 3)
          console.log('[CMD] 下发值    :', sendValue)
          console.log('===========================================')

          await this.client.sendControl(sendField, sendValue, deviceType, overrides)
          // Optimistic update：本地立即更新，设备回显后再校准
          p.currentValue = opt.value
          p.currentLabel = opt.label
          // 脉冲型命令（故障复位/启动/停机…）：值只在动作瞬间有效，
          // 1.2s 后本地回落到「不执行」，否则会一直亮着「执行」，且再次点击会被
          // 「当前已是 执行」的守卫拦掉，导致无法重复下发。
          if (p.pulse && p.options) {
            const idle = p.options.find(o => String(o.value) === '0')
            if (idle) {
              if (p._pulseTimer) clearTimeout(p._pulseTimer)
              p._pulseTimer = setTimeout(() => {
                p.currentValue = idle.value
                p.currentLabel = idle.label
                p._pulseTimer = null
              }, 1200)
            }
          }
          this.opToast = `${p.label} → ${opt.label} 指令已下发`
          this.showOpToast = true
          setTimeout(() => { this.showOpToast = false }, 2500)
        } catch (e) {
          uni.showModal({ title: '下发失败', content: e.message || '请重试', showCancel: false })
        }
      }

      if (opt.dangerous) {
        this.confirmTitle = '操作确认'
        this.confirmContent = `确定要执行「${p.label} - ${opt.label}」吗？此操作可能影响设备运行状态。`
        this.confirmPayload = { param: p, option: opt, deviceType }
        this.confirmCallback = doSend
        this.showConfirm = true
      } else {
        await doSend()
      }
    },
    onNumericParamEdit(payload) {
      if (!this._guardSettingsEdit()) return
      const resolved = this._resolvePanelEvent(payload, null)
      const p = resolved.param
      if (!p) return
      this.editingParamKey = p.key
      this.editingParamDeviceType = p.deviceType || '171C'
      this.editingParamValue = p.currentText ? String(p.currentText) : ''
      uni.showModal({
        title: `修改 ${p.label}`,
        editable: true,
        placeholderText: `当前值: ${p.currentText || '--'}${p.unit ? ' ' + p.unit : ''}，请输入新值`,
        success: async (res) => {
          if (res.confirm && res.content !== undefined && res.content !== '') {
            const newVal = parseFloat(res.content)
            if (isNaN(newVal)) {
              uni.showToast({ title: '请输入有效数字', icon: 'none' })
              return
            }
            if (p.min !== undefined && newVal < p.min) {
              uni.showToast({ title: `不能小于 ${p.min}`, icon: 'none' })
              return
            }
            if (p.max !== undefined && newVal > p.max) {
              uni.showToast({ title: `不能大于 ${p.max}`, icon: 'none' })
              return
            }
            const rawVal = Math.round((newVal - (p.offset || 0)) * (p.scale || 1))
            const overrides = {}
            if (p.address) overrides.registerAddress = p.address
            if (p.regType !== undefined) overrides.regType = p.regType
            // 没有 address 时必须靠 field（B{n}）推导寄存器号，两者都缺就没法下发
            const hasField = p.field !== undefined && p.field !== null && String(p.field).trim() !== ''
            if (!p.address && !hasField) {
              uni.showModal({
                title: '下发失败',
                content: `参数「${p.label}」缺少寄存器地址，请重新进入该标签页后再试`,
                showCancel: false
              })
              return
            }
            if (!Number.isFinite(rawVal)) {
              uni.showModal({
                title: '下发失败',
                content: `参数「${p.label}」的换算结果无效，请重新输入`,
                showCancel: false
              })
              return
            }

            // 下发前打印完整指令
            console.log('========== 下发设置指令（数值） ==========')
            console.log('[CMD] 参数      :', p.label, '(' + p.key + ')')
            console.log('[CMD] 设备类型  :', this.editingParamDeviceType)
            console.log('[CMD] 下发字段  :', p.field)
            console.log('[CMD] 寄存器地址:', p.address ? p.address + ' (0x' + Number(p.address).toString(16).toUpperCase() + ')' : '由字段推导',
              ' 寄存器类型:', p.regType !== undefined ? p.regType : 3)
            console.log('[CMD] 页面值    :', newVal, p.unit || '', '→ 下发原始值:', rawVal,
              '(scale=' + (p.scale || 1) + ', offset=' + (p.offset || 0) + ')')
            console.log('==========================================')

            try {
              this.client.setDeviceType(this.editingParamDeviceType)
              await this.client.sendControl(p.field, rawVal, this.editingParamDeviceType, overrides)
              // Optimistic update
              const scaled = rawVal / (p.scale || 1) + (p.offset || 0)
              p.currentValue = scaled
              p.currentText = this.formatValue(scaled, p.decimals !== undefined ? p.decimals : 1)
              this.opToast = `${p.label} 已修改为 ${p.currentText}${p.unit ? ' ' + p.unit : ''}`
              this.showOpToast = true
              setTimeout(() => { this.showOpToast = false }, 2500)
            } catch (e) {
              uni.showModal({ title: '下发失败', content: e.message || '请重试', showCancel: false })
            }
          }
        }
      })
    },
    onConfirmOk() {
      if (this.confirmCallback && typeof this.confirmCallback === 'function') {
        this.confirmCallback()
      }
      this.showConfirm = false
      this.confirmPayload = null
      this.confirmCallback = null
    },
    goConfig() {
      uni.navigateTo({ url: '/pages/profile/direct-device-config' })
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-page {
  /* 与「关于我们」等页面统一的浅灰蓝底色 */
  background: #f4f6f9;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.connected-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  position: relative;
  /* 用 calc 明确高度，让内部 flex 子元素能正确分配空间 */
  /* 100vh - fixed-placeholder(~69px) - DeviceCard(~120px) - 给 20px 余量 */
  height: calc(100vh - 209px);
}

/* ========== 标签栏（胶囊选中式） ==========
   注意：本栏高度固定为 90rpx ≈ 46px，
   swiperStyle 中 fixed 常量需同步（placeholder 89 + 卡片 95 + 标签栏 46 + 底部tab 44） */
.tab-container {
  flex-shrink: 0;
  background-color: #f4f6f9;
  padding: 10rpx 0 12rpx;
  border-bottom: none;
  box-shadow: none;
  position: relative;
  z-index: 2;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  width: 100%;
  box-sizing: border-box;
}

/* 设置组标题较长：容器按内容宽度排布，配合 scroll-view 横向滚动 */
.tab-list-auto {
  width: max-content;
  min-width: 100%;
}

.tab-item {
  /* 设置组标题较长：按内容宽度排布并允许横向滚动，避免文字互相粘连 */
  flex: 0 0 auto;
  text-align: center;
  padding: 14rpx 26rpx;
  font-size: 27rpx;
  line-height: 1.2;
  color: #5c6673;
  background: #ffffff;
  border: 1rpx solid #e8edf4;
  border-radius: 999rpx;
  white-space: nowrap;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;

  /* 监测组标题较短：等分宽度铺满 */
  &.tab-monitor {
    flex: 1 1 0;
    padding: 14rpx 6rpx;
  }

  & + .tab-item {
    margin-left: 10rpx;
  }

  &:active {
    opacity: 0.75;
  }

  /* 监测组：激活态实心蓝胶囊 */
  &.tab-monitor.active {
    color: #ffffff;
    background: #2f7cf6;
    border-color: #2f7cf6;
    font-weight: 600;
    box-shadow: 0 6rpx 16rpx rgba(47, 124, 246, 0.24);
  }

  /* 设置组：激活态实心橙胶囊，提示当前处于可下发区域 */
  &.tab-setting.active {
    color: #ffffff;
    background: #e8890c;
    border-color: #e8890c;
    font-weight: 600;
    box-shadow: 0 6rpx 16rpx rgba(232, 137, 12, 0.24);
  }
}

/* 空状态：白色卡片承载，与全站卡片风格保持一致 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24rpx 20rpx;
  padding: 80rpx 40rpx 88rpx;
  background: #ffffff;
  border-radius: 20rpx;
  border: 1rpx solid #eef0f4;
  box-shadow: 0 4rpx 16rpx rgba(31, 51, 89, 0.04);

  .empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background: #f4f6f9;
    margin-bottom: 32rpx;
  }

  .empty-text {
    font-size: 32rpx;
    font-weight: 500;
    color: #2b2f36;
  }

  .empty-sub {
    margin-top: 14rpx;
    font-size: 24rpx;
    line-height: 1.6;
    color: #8a9099;
    text-align: center;
  }

  .btn {
    margin-top: 48rpx;
  }
}

/* 空数据提示 */
.empty-data {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80rpx 40rpx;
  color: #8a9099;
  font-size: 26rpx;
}

/* swiper content area */
.content-area {
  flex: 1;
  width: 100%;
  min-height: 0;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

/* ========== 底部主导航 tab：监测 / 设置 ========== */
.bottom-tabbar {
  flex-shrink: 0;
  display: flex;
  background-color: #ffffff;
  border-top: 1rpx solid #eef0f4;
  box-shadow: 0 -4rpx 16rpx rgba(24, 39, 64, 0.05);
  /* iOS 安全区适配 */
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  position: relative;
  z-index: 2;
}

.bottom-tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  gap: 2rpx;
  transition: all 0.25s ease;

  &:active {
    opacity: 0.7;
    transform: scale(0.96);
  }

  /* 激活态：图标加浅色底，文字加粗并转主色 */
  &.active {
    .bottom-tab-icon {
      background: #eaf2ff;
    }

    .bottom-tab-label {
      color: #2f7cf6;
      font-weight: 600;
    }
  }
}

.bottom-tab-icon {
  width: 52rpx;
  height: 42rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.bottom-tab-label {
  font-size: 21rpx;
  line-height: 1;
  color: #b0b6c0;
}

.module-scroll {
  height: 100%;
  min-height: 0;
  touch-action: pan-y;
}

.content {
  /* 与 DeviceCard 的 20rpx 外边距对齐 */
  padding: 20rpx;
}

/* 设置区兜底提示（配置未命中时也要有可见内容，不能白屏） */
.settings-placeholder {
  padding: 120rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.settings-placeholder-icon {
  width: 108rpx;
  height: 108rpx;
  margin-bottom: 24rpx;
  border-radius: 50%;
  background: #ffffff;
  border: 1rpx solid #eef1f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-placeholder-text {
  font-size: 27rpx;
  font-weight: 500;
  color: #6b7480;
}

.settings-placeholder-sub {
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #a8b1bd;
  text-align: center;
}

/* 按钮 */
.btn {
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  font-weight: 500;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin: 0;
  border: none;
  padding: 0 56rpx;

  &::after { border: none; }

  &.primary {
    background: #007AFF;
    color: #fff;
    box-shadow: 0 6rpx 16rpx rgba(0, 122, 255, 0.22);
  }

  &[disabled] {
    opacity: 0.5;
  }

  &:active {
    opacity: 0.9;
    transform: scale(0.98);
  }
}

/* 平台占位 */
.sub-page {
  .fixed-placeholder {
    height: calc(25px + 44px);
  }

  &.android-platform {
    .fixed-placeholder { height: calc(25px + 44px + 20px); }
  }

  &.ios-platform {
    .fixed-placeholder { height: calc(44px); background: #fff; }
  }
}

/* ========== 设置面板样式 ========== */
/* ========== 确认弹窗 ========== */
/* ========== 操作反馈 Toast ========== */
</style>
