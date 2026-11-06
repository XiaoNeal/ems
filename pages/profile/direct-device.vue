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
      <scroll-view scroll-x="true" class="tab-scroll" :scroll-into-view="'tab-' + currentTab" :scroll-with-animation="tabScrollAnim">
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

      <!-- 数据区：面板首次进入才创建，之后用 v-show 复用
           v-if 每次都重建整棵节点树（BMS 近千节点 / 设置面板上百项），微信在创建 scroll-view
           与大量节点期间会先画一块空白，看起来就是“切一下白几秒”；
           常驻后只有激活面板拿实时数据（fv/rv 喂冻结空对象给后台面板），既没有重建也不会有逐帧重渲染。 -->
      <view class="content-area">
        <!-- 概览标签页 -->
        <scroll-view v-if="renderedTabs[0]" v-show="currentTab === 0" class="module-scroll" scroll-y="true">
          <view class="content">
            <OverviewTab :formattedValues="fv(0)" :systemRunning="systemRunningStable" @start-stop="onSystemStartStop" />
          </view>
        </scroll-view>

        <!-- PCS标签页 -->
        <scroll-view v-if="renderedTabs[1]" v-show="currentTab === 1" class="module-scroll" scroll-y="true">
          <view class="content">
            <PcsTab :formattedValues="fv(1)" :rawValues="rv(1)" :is50KwMode="is50KwMode" />
          </view>
        </scroll-view>

        <!-- 储能DC标签页 -->
        <scroll-view v-if="renderedTabs[2]" v-show="currentTab === 2" class="module-scroll" scroll-y="true">
          <view class="content">
            <StorageDcTab :formattedValues="fv(2)" :rawValues="rv(2)" :is50KwMode="is50KwMode" />
          </view>
        </scroll-view>

        <!-- 光伏标签页 -->
        <scroll-view v-if="renderedTabs[3]" v-show="currentTab === 3" class="module-scroll" scroll-y="true">
          <view class="content">
            <PvTab :formattedValues="fv(3)" :rawValues="rv(3)" :is50KwMode="is50KwMode" />
          </view>
        </scroll-view>

        <!-- BMS标签页 -->
        <scroll-view v-if="renderedTabs[4]" v-show="currentTab === 4" class="module-scroll" scroll-y="true">
          <view class="content">
            <BmsTab
              :formattedValues="fv(4)"
              :rawValues="rv(4)"
              :is50KwMode="is50KwMode"
            />
          </view>
        </scroll-view>

        <!-- 液冷机监测标签页（tab 10，仅 50kW 显示 tab 栏按钮，但内容始终可渲染） -->
        <scroll-view v-if="renderedTabs[10]" v-show="currentTab === 10" class="module-scroll" scroll-y="true">
          <view class="content">
            <LiquidCoolingTab :rawValues="rv(10)" :is50KwMode="is50KwMode" />
          </view>
        </scroll-view>

        <!-- 设置标签页：由当前 tab 直接驱动，只渲染一份面板
             （不再用 v-for 固定槽位 —— 槽位下标与 tab 序号（5~9、11）对不上时整块不渲染，页面就空白）
             面板常驻：切监测 tab 时只隐藏，切不同设置 tab 只换 tabCfg，不重新创建上百个参数项 -->
        <scroll-view
          v-if="settingsRendered && settingsTabCfg"
          v-show="!!currentSettingsTab"
          class="module-scroll"
          scroll-y="true"
        >
          <view class="content">
            <!-- 两阶段挂载：先画页头骨架这一帧（点按立即有反馈），下一帧再建参数面板。
                 BMS 设置 367 项、9 张卡，和「切标签 + 换面板」挤在同一帧里就是几百毫秒空白。 -->
            <view v-if="!settingsReady && hasAccessCode" class="sp-skeleton">
              <view class="sp-skeleton-hero"></view>
              <view v-for="n in 3" :key="n" class="sp-skeleton-card"></view>
            </view>
            <SettingsPanel
              v-else-if="hasAccessCode && settingsTabCfg"
              :tabCfg="settingsTabCfg"
              :paramsMap="settingsParamsMap"
              :isEditing="isEditing(settingsTabCfg.editKey)"
              :formatCurrentLabel="getParamCurrentLabel"
              :formatCurrentValue="getParamCurrentValue"
              :formatCurrentText="getParamCurrentText"
              @toggle-edit="toggleEdit"
              @switch-click="onSwitchParamClick"
              @numeric-edit="onNumericParamEdit"
              @need-edit="onNeedEdit"
              @bundle-select="onBundleSelect"
              @bundle-value-edit="onBundleValueEdit"
              @bundle-send="onBundleSend"
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
        // 171C 从机（V2.1~V2.4 四级告警阈值，帧头设备地址 02~05）
        // 必须在这里预声明：Vue2 动态新增属性不是响应式的，运行期才加会读不到更新
        '171C_V2_1': {}, '171C_V2_2': {}, '171C_V2_3': {}, '171C_V2_4': {},
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
      // 设置面板参数映射的稳定容器（数组内部变更仍响应，但对象引用不变，
      // 避免参数回显每秒触发 SettingsPanel 整块重渲染）
      paramsMapRef: null,
      // 已创建过的标签页面板：首次进入才挂载，之后用 v-show 复用。
      // 只用 v-if 时，每次切 tab 都要从零创建整棵面板（BMS 近千节点、设置面板上百项），
      // 微信在创建 scroll-view + 大量节点期间会先画一块空白，就是“切一下白几秒”的来源。
      renderedTabs: { 0: true },
      // 设置面板同理：首次进入设置后常驻，切不同设置 tab 只换 tabCfg，不重新创建
      settingsRendered: false,
      // 参数面板是否已就绪：切设置 tab 时先渲染一帧骨架，下一帧再建面板（见 currentTab watcher）
      settingsReady: false,
      // 标签条滚动动画开关：跨「监测/设置」组切换时用瞬时定位代替滑动，
      // 否则旧的横向滚动位置会带动画滑到新位置，观感就是整条标签“推片”
      tabScrollAnim: true,
      // 刚被切走的 tab：多保留 250ms 真实数据，避免和「建新面板」撞在同一帧
      keepDataTab: null,
      lastSettingsTabCfg: null,
      // 显示用结构（由 updateDisplay 同步重建）
      displayItems: [],
      // 分组显示结构（由 updateDisplay 同步重建，避免 computed 全量重建）
      groupedDisplay: [],
      platformClass: '',
      showDeviceMeta: false,
      archRefreshTimer: null,
      // 运行状态防抖后的展示值：单帧毛刺不直接改文案，避免按钮「运行中 / 启动」闪跳
      systemRunningStable: false,
      archRunningTimer: null,
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
      const hit = ['1707', '170C_STORAGE', '170C_PV', '171C_V2', '171C_V2_1', '171C_V2_2', '171C_V2_3', '171C_V2_4']
        .filter(k => rv[k] && Object.keys(rv[k]).length > 0)
      return hit.length > 0
    },
    settingsTabs() {
      return this.is50KwMode ? SETTINGS_TABS_50KW : SETTINGS_TABS
    },
    /** 当前设置标签页配置（设置区唯一数据源，避免槽位与 tab 序号错位导致空白） */
    currentSettingsTab() {
      return this.settingsTabs.find(t => t.tab === this.currentTab) || null
    },
    /**
     * 交给 SettingsPanel 的 tabCfg：
     * 设置面板常驻后，切回监测 tab 时 currentSettingsTab 会变 null，
     * 这里保留最后一次的设置配置，避免面板在隐藏瞬间被塞进 null 而报错/闪空。
     */
    settingsTabCfg() {
      return this.currentSettingsTab || this.lastSettingsTabCfg
    },
    /** 设置面板参数映射：供 SettingsPanel 子组件按 key 取参数数组 */
    settingsParamsMap() {
      // 返回稳定引用：参数数组内部属性变更照常响应（子组件直接读参数对象），
      // 但映射对象本身不重建，settingsParamsMap 就不会每秒触发面板整块重渲染
      return this.paramsMapRef || this._buildParamsMap()
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
    /**
     * 系统运行状态
     * 取值优先级：控制帧 C_B12（寄存器 112 启动按钮的回显）→ 能源帧 B56（启动按钮）。
     *
     * ⚠️ 不能用能源帧 B12：那是「储能充放电状态」（0 不充不放 / 1 充电 / 2 放电），
     *    设备在充电与放电之间切换时该值在 1、2 之间跳变，
     *    按钮就会跟着在「运行中 / 启动」之间反复闪（本次故障根因）。
     */
    archSystemRunning() {
      const bucket = this.rawValues['171F'] || {}
      const isOn = v => v !== undefined && v !== null && v !== '' && String(v).trim() === '1'
      if (bucket['C_B12'] !== undefined && bucket['C_B12'] !== null) {
        return isOn(bucket['C_B12'])
      }
      return isOn(bucket['B56'])
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
      const tab = this.currentTab
      // 首次进入某个面板时才创建它，之后复用（v-show），避免每次切换都重建整棵节点树造成白屏
      if ([0, 1, 2, 3, 4, 10].indexOf(tab) !== -1 && !this.renderedTabs[tab]) {
        this.$set(this.renderedTabs, tab, true)
      }
      if (this.currentSettingsTab) {
        this.lastSettingsTabCfg = this.currentSettingsTab
        this.settingsRendered = true
        // 设置页用不到这些监测结构，顺手清空：它们常驻在页面数据里，
        // 200 多项 × 8 个字段每秒都要参与小程序的数据 diff。
        if (this.displayItems.length) {
          this.displayItems = []
          this.groupedDisplay = []
        }
        const key = this.currentSettingsTab.editKey
        const echo = () => {
          if (this._settingsEchoTimer) clearTimeout(this._settingsEchoTimer)
          this._settingsEchoTimer = setTimeout(() => {
            this._settingsEchoTimer = null
            this.flushPendingFramesNow()
            // flush 收尾会排一个 1s 后的回显定时器，这里要立即同步一次，先把它撤掉
            if (this._syncSettingsTimer) {
              clearTimeout(this._syncSettingsTimer)
              this._syncSettingsTimer = null
            }
            this._doSyncSettingsFromRealtime()
          }, 90)
        }
        // 已挂载过同一个面板（预热过 tab5，或从监测切回来）→ 只翻 v-show，直接出内容
        if (this._mountedSettingsKey === key && this.settingsReady) {
          echo()
          return
        }
        // ⚡ 两阶段挂载：这一帧只画标签栏 + 骨架，下一帧再建参数面板。
        //   以前切设置是「切 tab + 建 367 项面板 + 强制提交一帧数据 + 逐项回显」
        //   全压在同一帧里，点按后要等几百毫秒才有画面，期间还会出现推片/白块。
        this.settingsReady = false
        this._mountedSettingsKey = key
        if (this._settingsMountTimer) clearTimeout(this._settingsMountTimer)
        this._settingsMountTimer = setTimeout(() => {
          this._settingsMountTimer = null
          this.settingsReady = true
          // 面板建好后再提交暂存帧 + 回显一次，两步都排在面板首次绘制之后
          echo()
        }, 48)
        return
      }
      this.settingsReady = true
      this.flushPendingFramesNow()
      // 50kW：监测面板全部直接读 rawValues（见各 tab 的 bucket50），
      // displayItems / formattedValues 在这套协议下没有任何模板读它，
      // 建一次就是 200 多项 × 8 个字段写进页面 data，之后每轮 setData 都要带着走。
      if (this.is50KwMode) {
        if (this.displayItems.length) {
          this.displayItems = []
          this.groupedDisplay = []
        }
        // 只有「概览」tab 用 formattedValues（架构图 KPI 来自 171F）
        if (this.currentTab === 0) this.rebuildFormattedValues(['171F'])
        return
      }
      this.updateDisplay()
      const dt = this.currentDeviceType
      this.rebuildFormattedValues(dt && dt !== '171F' ? [dt, '171F'] : ['171F'])
    },
    /** 运行状态只有连续 800ms 稳定后才落到按钮上，防止帧级毛刺造成文案闪跳 */
    archSystemRunning(v) {
      if (this.archRunningTimer) clearTimeout(this.archRunningTimer)
      this.archRunningTimer = setTimeout(() => {
        this.archRunningTimer = null
        this.systemRunningStable = v
      }, 800)
    }
  },
  created() {
    // 参数映射容器（SettingsPanel 的 props 依赖它，必须在首次渲染前就绪）
    this.paramsMapRef = this._buildParamsMap()
    // 冻结的空对象：喂给「后台标签页」当 props 用。
    // 引用恒定 + 不被 Vue 观测，后台面板的 computed 永远不会被逐帧失效，
    // 既不会因为每 800ms 一次落库而重渲染，也不会拖慢当前页。
    this._emptyRef = Object.freeze({})
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === 'ios' ? 'ios-platform' : 'android-platform'
      }
    })
    this.loadConfig()
    this.initSettingsParams()
    // 直连模式下 rawValues 必须为空，所有数据只能来自 MQTT 帧；
    // 不要从 realtimeDataProvider（云端 WebSocket）同步数据——那是另一路数据源，
    // 会让页面在 MQTT 还没连上时就显示"假数据"
    this.resetRawValues()
    this.updateDisplay()
    // 50kW 只需要架构图那几个值（概览 tab 用），其它 tab 直接读 rawValues
    this.rebuildFormattedValues(this.is50KwMode ? ['171F'] : undefined)
    if (this.config.enabled) {
      // 进入页面即尝试连接
      this.$nextTick(() => this.start())
      // 首屏画完 2.4s 后，按 500ms 间隔把还没建过的监测面板逐个「预挂载」。
      // 后台面板拿到的是冻结空数据（不会逐帧重渲染），代价只有一次性建节点；
      // 换来的是第一次点某个 tab 时不必从零创建整棵面板 —— 那一步正是“白屏几秒”的来源。
      this._prewarmBootTimer = setTimeout(() => {
        this._prewarmBootTimer = null
        this._prewarmTabs()
      }, 2400)
    }
  },
  onUnload() {
    this.stopArchRefreshTimer()
    if (this.archRunningTimer) {
      clearTimeout(this.archRunningTimer)
      this.archRunningTimer = null
    }
    if (this._frameFlushTimer) {
      clearTimeout(this._frameFlushTimer)
      this._frameFlushTimer = null
    }
    this._frameBatches = {}
    this._frameDirty = {}
    if (this._prewarmTimer) {
      clearTimeout(this._prewarmTimer)
      this._prewarmTimer = null
    }
    if (this._prewarmBootTimer) {
      clearTimeout(this._prewarmBootTimer)
      this._prewarmBootTimer = null
    }
    if (this._settingsMountTimer) {
      clearTimeout(this._settingsMountTimer)
      this._settingsMountTimer = null
    }
    if (this._settingsEchoTimer) {
      clearTimeout(this._settingsEchoTimer)
      this._settingsEchoTimer = null
    }
    if (this._tabAnimTimer) {
      clearTimeout(this._tabAnimTimer)
      this._tabAnimTimer = null
    }
    if (this._keepDataTimer) {
      clearTimeout(this._keepDataTimer)
      this._keepDataTimer = null
    }
    this.stop()
  },
  onShow() {
    // 直连页禁用云端 WebSocket 数据同步——所有数据只能来自 MQTT 帧
    // MQTT 连接成功后会自动 subscribe 并在 applyIemsFrame 中填充 rawValues
    // 从后台返回：恢复收帧处理（onHide 里暂停过），并把暂停期间丢弃后的第一帧立即提交
    this._paused = false

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
    // 页面不可见时不再解析/合并/渲染：MQTT 连接保持不断（回来即用），
    // 但每帧解析 + 定时 flush + setData 在小程序里照样要过 JS/渲染桥，
    // 后台持续跑只会让返回页面那一下更卡。数据帧丢了无所谓，回来 1s 内就有新帧。
    this._paused = true
    this._frameBatches = {}
    this._frameDirty = {}
    if (this._frameFlushTimer) {
      clearTimeout(this._frameFlushTimer)
      this._frameFlushTimer = null
    }
  },
  methods: {
    /**
     * 预热监测面板：逐个把未创建的 tab 设为已渲染（隐藏状态下建节点，用户看不到）。
     * 一次只建一个，间隔 500ms，避免和收帧/flush 抢主线程。
     */
    _prewarmTabs() {
      const queue = [1, 2, 3, 4, 10].filter(t => !this.renderedTabs[t])
      if (!queue.length) {
        this._prewarmSettingsPanel()
        return
      }
      const t = queue[0]
      this.$set(this.renderedTabs, t, true)
      if (queue.length > 1) {
        this._prewarmTimer = setTimeout(() => this._prewarmTabs(), 500)
      } else {
        // 监测面板建完后，再空一帧去预建设置面板，别和最后一块监测面板挤在一起
        this._prewarmTimer = setTimeout(() => {
          this._prewarmTimer = null
          this._prewarmSettingsPanel()
        }, 500)
      }
    },
    /**
     * 预热设置面板（默认第一个设置 tab，即「快捷控制」）。
     * 面板在隐藏状态下建好（v-show=false），点「设置」时只需翻 v-show，
     * 不必在同一帧里创建 scroll-view + 参数卡片 —— 那一步正是首次进入卡顿的来源。
     * 只有拿到操作码才建，否则渲染的是占位提示，不预热。
     */
    _prewarmSettingsPanel() {
      if (this.settingsRendered || !this.hasAccessCode) return
      const first = this.settingsTabs[0]
      if (!first) return
      this.lastSettingsTabCfg = first
      this.settingsReady = true
      this._mountedSettingsKey = first.editKey
      this.settingsRendered = true
    },
    /**
     * 标签页取数：只有当前激活的那个面板拿真实数据，
     * 常驻的后台面板一律喂冻结空对象（引用不变 → computed 不重算 → 不重渲染）。
     * keepDataTab：刚被切走的那个面板还能多留 250ms 真实数据。
     *   否则一切 tab，上一块面板的 props 立刻从 rawValues 变成空对象 →
     *   BMS 近千个文本同时变成「--」，这一下和「建新面板」撞在同一帧里就是明显掉帧。
     *   留 250ms 后再置空，用户已经看不到它了，置空的代价落在空闲帧。
     */
    fv(tab) {
      const active = this.currentTab === tab || this.keepDataTab === tab
      return active ? this.formattedValues : this._emptyRef
    },
    rv(tab) {
      const active = this.currentTab === tab || this.keepDataTab === tab
      return active ? this.rawValues : this._emptyRef
    },
    /**
     * 构建参数映射（仅在协议模板重建数组时调用）
     * 必须放在 methods 里：它是函数，不是计算属性
     */
    _buildParamsMap() {
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
    /**
     * 架构图启停按钮 handler — 下发 171F.B12 策略运行指令
     * 对齐 architecture-diagram.vue handleStartStop 逻辑
     */
    onSystemStartStop() {
      const running = this.systemRunningStable
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
      // 丢弃未落库的暂存帧：清空/重连后旧数据不允许再写进新 bucket
      this._frameBatches = {}
      this._frameDirty = {}
      this._stage = {}
      this._lastCommitAt = 0
      this._lastUpdateAt = 0
      if (this._frameFlushTimer) {
        clearTimeout(this._frameFlushTimer)
        this._frameFlushTimer = null
      }
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
        newBuckets['171C_V2_1'] = {}
        newBuckets['171C_V2_2'] = {}
        newBuckets['171C_V2_3'] = {}
        newBuckets['171C_V2_4'] = {}
        newBuckets['0318'] = {}
        newBuckets['131C'] = {}
      }
      this.rawValues = newBuckets
      // 桶被清空 → 50kW 判定缓存失效，下次收帧重新识别协议
      this._has50KwData = false
      this._fieldRegCache = {}
      this._candCache = {}
      this._paramSeen = {}
    },
    updateDisplay(deviceType) {
      // 50kW 协议不走这套「寄存器 → 卡片」显示结构（各 tab 直接读 rawValues），
      // 这里再建一遍纯属把几百项死数据塞进页面 data
      if (this.is50KwMode) {
        if (this.displayItems.length) {
          this.displayItems = []
          this.groupedDisplay = []
        }
        return
      }
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
     * @param {string|string[]} [deviceType] 设备类型或类型数组；不传则全量重建
     */
    rebuildFormattedValues(deviceType) {
      const ALL_BUCKETS = ['171B', '171C', '171D', '171E', '171F', '1707', '170C_STORAGE', '170C_PV', '171C_V2', '0318', '131C']
      // 需要 rebuild 的 bucket 列表：
      //   - 数组 → 原样；传单个 → 该 bucket + 171F（架构图）
      //   - 不传 → 所有可能的 bucket（20kW 旧码 + 50kW 新协议）
      let types
      if (Array.isArray(deviceType)) types = deviceType
      else if (deviceType) types = deviceType === '171F' ? ['171F'] : [deviceType, '171F']
      else types = ALL_BUCKETS
      this._applyFormattedValues(this._buildFormattedValues(types))
    },
    /** 纯计算：把若干 bucket 的原始值格式化成显示值（不做响应式赋值，供 flush 合并成一次赋值） */
    _buildFormattedValues(types) {
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
          // 只保留 B 号字段：控制帧/状态帧键（C_/S_ 前缀）和寄存器号别名（纯数字）没有任何模板读取，
          // 保留它们会把 formattedValues 撑到上千个 key（每次 setData 都要 diff/serialize），
          // 是小程序里最容易被忽略的渲染层开销
          if (/^[SC]_/.test(field) || /^\d+$/.test(field)) return
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
        // 只为本次要重建的前缀做别名：tab 组件按旧前缀 '171C_*' 取值的，需要由 50kW bucket 生成
        if (types.indexOf(oldPrefix) === -1 && types.indexOf(newPrefix) === -1) continue
        const aliasBucket = this.rawValues[newPrefix] || {}
        Object.keys(aliasBucket).forEach(field => {
          if (/^[SC]_/.test(field) || /^\d+$/.test(field)) return
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
      newVals['archGenToday'] = f(r('171F', 'B34'), 2)
      newVals['archUseToday'] = f(r('171F', 'B38'), 2)
      newVals['archGridSupply'] = f(r('171F', 'B42'), 2)
      // === 与 grid-management.vue 对齐的电网统计字段 ===
      // B174: 频率 (Hz), B176: 正向有功电度(累计供电 kWh), B180: 反向有功电度(累计馈电 kWh)
      // B184: 当天正向有功电度(今日供电 kWh), B188: 当天反向有功电度(今日馈电 kWh)
      newVals['archGridFrequency'] = f(r('171F', 'B174'), 2)
      newVals['archTotalSupplyEnergy'] = f(r('171F', 'B176'), 1)
      newVals['archTotalFeedEnergy'] = f(r('171F', 'B180'), 1)
      newVals['archTodaySupplyEnergy'] = f(r('171F', 'B184'), 1)
      newVals['archTodayFeedEnergy'] = f(r('171F', 'B188'), 1)
      const socVal = r('171F', 'B128') !== undefined ? r('171F', 'B128') : r('171F', 'B58')
      newVals['archSoc'] = f(socVal, 2)
      newVals['archStorageRemaining'] = f(socVal, 2)
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
      return newVals
    },
    /** 增量落值：已有 key 逐键触发响应式（setData 只带变化的字段），仅当出现全新 key 时才整包替换 */
    _applyFormattedValues(newVals) {
      const fv = this.formattedValues
      let changed = false
      let added = false
      for (const k of Object.keys(newVals)) {
        const oldVal = fv[k]
        const newVal = newVals[k]
        if (oldVal === newVal) continue
        if (oldVal === undefined) {
          // Vue2 里给已有对象加属性必须 $set，否则新键不是响应式的、不会通知面板
          this.$set(fv, k, newVal)
          added = true
        } else if (newVal !== undefined) {
          fv[k] = newVal
        }
        changed = true
      }
      // 只有「出现新键」才整包替换一次（首帧、切设备时会发生，之后基本不会）。
      // 以前每次 flush 都 `{...fv}`：formattedValues 有上千个键，等于每 800ms 把整个对象
      // 序列化给渲染层一次 —— 这是监测页和设置页共同卡顿的源头之一。
      if (added) this.formattedValues = { ...fv }
      return changed
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
        // 记住旧 tab，让它的面板晚 250ms 再置空（见 fv/rv 的 keepDataTab）
        const prev = this.currentTab
        this.keepDataTab = prev
        if (this._keepDataTimer) clearTimeout(this._keepDataTimer)
        this._keepDataTimer = setTimeout(() => {
          this._keepDataTimer = null
          this.keepDataTab = null
        }, 250)
        this.currentTab = index
        console.log('[tab] currentTab 已更新为=', index, 'is50Kw=', this.is50KwMode)
        const types = this.is50KwMode ? DEVICE_TYPES_50KW : DEVICE_TYPES
        const bucket = types[index]
        console.log('[tab] 对应 bucket=', bucket, 'rawValues[bucket] keys=', bucket ? Object.keys(this.rawValues[bucket] || {}).length : 'N/A')
        // 设置面板的「提交暂存帧 + 参数回显」改由 currentTab watcher 在面板挂载后触发
        // （见 settingsReady 两阶段挂载），这里不再 nextTick 立即执行——
        // 那一步会把「渲染新面板」排在几百项回显之后，表现就是点一下白几百毫秒。
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
      // 跨组切换时标签条内容整体换一批（监测 0~4/10 ↔ 设置 5~9/11）。
      // 若保留 scroll-with-animation，旧滚动位置会带动画滑向新标签 —— 观感就是“推片”。
      // 先关掉动画瞬时定位，再把动画恢复给同组内的点击。
      this.tabScrollAnim = false
      if (this._tabAnimTimer) clearTimeout(this._tabAnimTimer)
      this._tabAnimTimer = setTimeout(() => {
        this._tabAnimTimer = null
        this.tabScrollAnim = true
      }, 260)
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
      if (this._frameFlushTimer) {
        clearTimeout(this._frameFlushTimer)
        this._frameFlushTimer = null
      }
      this._frameBatches = {}
      this._frameDirty = {}
      // 断开后允许下一次连接重新订阅
      this._subscribedSeq = null
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
      const c = this.client
      if (!c) return
      // 同一条连接只订阅一次：onShow / 重试会反复进这里，重复 subscribeAll 会让同一条消息
      // 被多个 handler 重复解析（卡顿、重复 toast 都由此而来）
      if (this._subscribedSeq === c.connectionSeq) {
        console.log('[MQTT] 该连接已订阅过，跳过重复订阅 seq=' + c.connectionSeq)
        return
      }
      console.log('[MQTT] 订阅主题: realtime=' + realtimeTopic + ' control=' + controlTopic)
      c.setTopics({
        realtime: realtimeTopic,
        controlSet: controlTopic,
        controlResp: controlTopic
      })
      await c.subscribeAll({
        onRealtime: (payloadStr, topic, payloadBytes) => this.handleMqttRealtime(payloadStr, payloadBytes),
        onControlResp: (payloadStr, topic, payloadBytes) => this.handleMqttControlResp(payloadStr, topic, payloadBytes)
      })
      this._subscribedSeq = c.connectionSeq
    },
    /**
     * 处理 MQTT 实时数据 payload
     * 支持两种格式：
     *   1) 模拟器 JSON：{ ts, deviceType, slaveId, fields: { B12: { name, raw, eng, unit }, ... } }
     *   2) 真机二进制 IEMS 帧：首字节 0x07/0x17/0x18，用 iems-frame-parser 解析
     */
    handleMqttRealtime(payloadStr, payloadBytes) {
      // 页面不可见期间直接丢弃：连接保持，回前台后 1s 内自然有新帧
      if (this._paused) return
      try {
        // 快路径：真机二进制帧直接进解析器，跳过 hex 解包/转换（每秒多帧时这段字符串处理不便宜）
        if (payloadBytes && payloadBytes.length >= 10 && isIemsBinaryFrame(payloadBytes)) {
          this.applyIemsFrame(payloadBytes)
          return
        }

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
          // lastUpdate 不在这里写：每秒多帧都改会让页头文案跟着重渲染，统一在 flush 里更新
          this.applyIemsFrame(realBytes)
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
      // ⚠️ 50kW 微能站：171C 帧头里写的仍是 '171C'（协议模块本身 deviceType 也是 '171C'），
      // 版本只体现在显式指定的 protocolKey 上。若这里不按模式改写，BMS 数据会全部落到
      // 20kW 的 '171C' bucket，而 BMS 页（50kW 分支）读的是 '171C_V2' → 整页全是 '--'。
      else if (dt === '171C' && this._use50KwProtocol()) {
        // 站点里 171C 不止一台：地址 01 = V2.0 运行控制主机（心跳/强控/TMS 温控），
        // 地址 02~05 = V2.1~V2.4 四级告警阈值从机。五台设备的控制帧 B 号完全重号
        // （B0：主机=心跳，从机=单体过压 1 级告警阈值），共用一个 bucket 就是
        // 「谁后到谁覆盖」——从机每秒一帧、阈值全是 0，把主机心跳 100 和温控参数
        // 全刷成 0，面板于是显示 0 / -50.0℃。这里按帧头设备地址分桶，互不干扰。
        const ai = parseInt(String(addrHint || '').trim(), 16)
        if (ai === 2) result = '171C_V2_1'
        else if (ai === 3) result = '171C_V2_2'
        else if (ai === 4) result = '171C_V2_3'
        else if (ai === 5) result = '171C_V2_4'
        else result = '171C_V2'
      }
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
        // ⚡ 同 applyIemsFrame：暂存 + 800ms 节流合并写入，避免每帧全量重渲染
        if (!this._frameBatches) this._frameBatches = {}
        this._frameBatches[deviceType] = Object.assign(this._frameBatches[deviceType] || {}, batch)
        this.scheduleFrameFlush(deviceType)
      }
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
      // 命中过任意一个 50kW 桶就一直认为是 50kW（桶只会被填、不会被清空，
      // 除 stop/重置时会复位这个标记）——以前每帧都对 8 个桶做一次 Object.keys，
      // 上千个键的数组分配 × 每秒多帧，纯属浪费。
      if (this._has50KwData) return true
      const rv = this.rawValues || {}
      const keys = ['1707', '170C_STORAGE', '170C_PV', '171C_V2', '171C_V2_1', '171C_V2_2', '171C_V2_3', '171C_V2_4']
      for (let i = 0; i < keys.length; i++) {
        const b = rv[keys[i]]
        if (b && Object.keys(b).length > 0) {
          this._has50KwData = true
          return true
        }
      }
      return false
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
      this._perfFrames = (this._perfFrames || 0) + 1
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

        // 解析出 0 个字段 = 帧长与协议结构不匹配（协议版本选错 / payload 截断），
        // 现象就是对应页面整屏 '--'。按 10s 聚合打印一次，便于现场定位是哪一帧没解析出来
        if (Object.keys(data).length === 0) {
          const nowTs = Date.now()
          if (!this._emptyFrameAt || nowTs - this._emptyFrameAt > 10000) {
            this._emptyFrameAt = nowTs
            console.warn('[IEMS] 帧解析结果为空：deviceType=0x' + rawDt +
              ' dataType=0x' + (parsed.dataType || '?') +
              ' protocolKey=' + (protocolKey || '(auto)') +
              ' payload=' + (parsed.payload ? parsed.payload.length : 0) + ' 字节')
          }
          return
        }
        // 所有非 DEVICEINFO 类型的帧：都把解析到的数据存入 rawValues
        // ENERGY / STATE / CONTROL 只是用途不同，但都包含寄存器值
        // 反向表按 deviceType 缓存：以前每帧都从 map.monitor/control 重建一遍
        // （两台设备上百项），1 秒多帧时纯属白烧 CPU
        const fieldToReg = this._getFieldToReg(deviceType)

        // 非 ENERGY 帧键加前缀隔离，避免与 ENERGY 帧共享 B-key 互相覆盖
        //   50kW bucket：STATE='S_' / CONTROL='C_'
        //   171F 策略控制器：CONTROL 帧的 B0/B2/B4/B6/B8... 是控制命令，
        //     与 ENERGY 帧的 B0(光伏功率)/B4(电网功率)/B34(今日发电) 含义完全不同，
        //     不加前缀会用控制帧的原始值覆盖架构图与今日电量展示
        //   0318 液冷机：设置页下发控制后设备会回读整帧，未使用的字节普遍填充 0xFF，
        //     不加前缀会把 B86~B95 故障字覆盖成 0xFF，导致 76 个故障位全部点亮
        //   171C_V2_1~4（四级告警阈值从机）：B0~B174 既是它 0x04 控制帧的阈值寄存器，
        //     也和它自己的能源/状态帧 B 号重号，不加前缀会在两种帧之间互相覆盖，
        //     面板上就会出现「阈值时有时无、甚至整列 0」。前缀规则与主机一致。
        const useFrameTypePrefix =
          deviceType === '1707' || deviceType === '170C_STORAGE' ||
          deviceType === '170C_PV' || deviceType === '171C_V2' ||
          deviceType.indexOf('171C_V2_') === 0 ||
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
          // ⚡ 性能关键：设备每秒上报多路帧，这里不再同步写 rawValues / 重建显示值，
          // 只把本帧数据暂存进非响应式缓冲，由 800ms 节流的统一 flush 合并写一次。
          // 之前每帧 spread 替换 rawValues bucket + 重建 formattedValues，
          // 一次引用变化会让所有 v-show 挂载的 tab 组件整体重渲染，1 秒多帧时页面直接卡死。
          if (!this._frameBatches) this._frameBatches = {}
          this._frameBatches[deviceType] = Object.assign(this._frameBatches[deviceType] || {}, batch)

          // CONTROL 帧：171F 控制数据用于快捷控制回显，日志按 10s 聚合避免刷屏
          if (dataTypeNum === IEMS_DATA_TYPE.CONTROL && deviceType === this.currentDeviceType) {
            if (deviceType === '171F') {
              // 快捷控制回显依赖这一帧（0x04 控制数据）；没有这行日志说明设备根本没回控制帧。
              // 每秒一帧 → 日志按 10s 聚合，避免刷屏拖慢调试器
              const now = Date.now()
              if (!this._ctlFrameLogAt || now - this._ctlFrameLogAt > 10000) {
                this._ctlFrameLogAt = now
                const ks = Object.keys(data).filter(k => data[k] !== undefined).slice(0, 24)
                console.log('[171F] 控制数据帧字段:', ks.join(','))
              }
            }
          }
          // 171C 系列：每台设备各打一行（一次性）。BMS 设置面板读的就是 0x04 控制帧，
          // 参数整列显示 '--' 时先看这里有没有 addr=01 这一行：
          //   没有 → 设备根本没上报控制帧（要另发读命令，面板无从取值）；
          //   有但 addr 只有 02~05 → 主机控制帧缺失，或站点只有阈值从机。
          if (dataTypeNum === IEMS_DATA_TYPE.CONTROL && deviceType.indexOf('171C') === 0) {
            this._bmsCtlSeen = this._bmsCtlSeen || {}
            if (!this._bmsCtlSeen[deviceType]) {
              this._bmsCtlSeen[deviceType] = true
              const head = Object.keys(data).slice(0, 8).map(k => k + '=' + data[k]).join(',')
              console.log('[171C] 控制帧 bucket=' + deviceType + ' addr=' + (parsed.address || '?') +
                ' 字段数=' + Object.keys(data).length + ' 前 8 项=' + head)
            }
          }
          // 171C 状态帧（0x03）：BMS 概览「系统配置」6 项（额定电压/容量/串数/温感数/pack 数/
          // 极柱温感数）只在这类帧里（键带 S_ 前缀）。整块 '--' 时先看这行日志：
          //   没有这一行 → 设备没上报 0x03 状态帧；有但配置项全「无」→ 帧长/协议版本不匹配。
          if (dataTypeNum === IEMS_DATA_TYPE.STATE && deviceType.indexOf('171C') === 0) {
            this._bmsStateSeen = this._bmsStateSeen || {}
            if (!this._bmsStateSeen[deviceType]) {
              this._bmsStateSeen[deviceType] = true
              const cfg = ['B70', 'B72', 'B74', 'B76', 'B78', 'B80']
                .map(k => k + '=' + (data[k] !== undefined ? data[k] : '无')).join(',')
              console.log('[171C] 状态帧 bucket=' + deviceType + ' addr=' + (parsed.address || '?') +
                ' 字段数=' + Object.keys(data).length + ' 系统配置=' + cfg)
            }
          }
          this.scheduleFrameFlush(deviceType)
        }
      } catch (e) {
        console.error('IEMS 帧解析失败:', e && e.message, 'deviceType=', arguments[1] || '(unknown)')
      }
    },
    /** ⚡ 帧数据节流 flush：最多 800ms 把多帧数据合并进暂存区（是否提交到 rawValues 由 _displayCommitMs 决定） */
    scheduleFrameFlush(deviceType) {
      if (!this._frameDirty) this._frameDirty = {}
      this._frameDirty[deviceType] = true
      if (this._frameFlushTimer) return
      this._frameFlushTimer = setTimeout(() => {
        this._frameFlushTimer = null
        this._flushFrameBatches()
      }, 800)
    },
    /** 立即合并暂存帧并强制提交：下发前读当前值、进入编辑态同步回显前调用，避免读到 ≤1.5s 的旧值 */
    flushPendingFramesNow() {
      if (this._frameFlushTimer) {
        clearTimeout(this._frameFlushTimer)
        this._frameFlushTimer = null
      }
      // 强制提交：跳过显示节流，保证下发/编辑前读到的是最新值
      this._flushFrameBatches(true)
    },
    /** 显示提交间隔：只有「提交」这一步会让面板重渲染（改这里等于改屏刷频率） */
    _displayCommitMs() {
      // 设置页要较快回显（编辑态读的也是提交后的值）；监测页 1.5s 足够，
      // 传感器量本就缓慢变化，比 0.8s 少掉近一半的渲染 / setData 过桥
      return this.currentSettingsTab ? 900 : 1500
    },
    _flushFrameBatches(force) {
      const dirty = this._frameDirty || {}
      this._frameDirty = {}
      const batches = this._frameBatches || {}
      this._frameBatches = {}
      const types = Object.keys(dirty)
      if (!types.length) {
        // 没有新帧但暂存区还有没提交的值（上次被节流跳过）→ 强制提交
        if (force && this._stage && Object.keys(this._stage).length) this._commitStaged()
        return
      }
      // 1) 并入暂存区：普通对象写入，不产生任何响应式通知 → 收帧再密也不会推动渲染
      types.forEach(dt => {
        const batch = batches[dt]
        if (batch) this._mergeBucket(dt, batch)
      })
      // 2) 到点才把暂存区提交进 rawValues（唯一触发面板重渲染的一步）。
      //    以前 800ms 提交一次：BMS 面板 100+ 数值 + 150 个故障位每次都整树重排，
      //    再走一轮 setData 过桥；现在合并成 1.5s 一次，收帧节奏不变、桥调用砍一半。
      const now = Date.now()
      if (!force && this._lastCommitAt && now - this._lastCommitAt < this._displayCommitMs()) return
      this._lastCommitAt = now
      const changed = this._commitStaged()
      const t0 = Date.now()
      const onSettings = !!this.currentSettingsTab
      if (!onSettings) {
        // 50kW 的监测 tab 全部直接读 rawValues（BMS/PCS/储能DC/光伏/液冷），只有「概览」用
        // formattedValues；20kW 旧协议各 tab 仍走 formattedValues。
        // 以前不分模式每次都格式化上千个键，等于给没人读的对象白做一轮响应式写入。
        const needFv = !this.is50KwMode || this.currentTab === 0
        if (needFv) {
          const cur = this.currentDeviceType
          const visible = types.filter(t => t === '171F' || t === cur)
          if (visible.indexOf('171F') === -1) visible.push('171F')
          this._applyFormattedValues(this._buildFormattedValues(visible))
        }
      }
      // 3) 设置面板参数回显：只在设置 tab 可见时同步
      if (onSettings) this.syncSettingsFromRealtime()
      // 「最后更新 16:24:30」这行文案一到点就要整页重渲染一次（页面 data 里有 rawValues /
      // 参数树，diff 一遍不便宜），4s 刷一次足够看出在线，没必要跟着每次提交走
      if (!this._lastUpdateAt || now - this._lastUpdateAt >= 4000) {
        this._lastUpdateAt = now
        this.lastUpdate = now
      }
      // 诊断：每 10 秒一行。卡顿时先看这行：收帧正常而提交耗时长 → 瓶颈在面板渲染；
      // 收帧很少 → 瓶颈在解析/映射。
      this._perfFrames = this._perfFrames || 0
      this._perfCommits = (this._perfCommits || 0) + 1
      this._perfBuildMs = (this._perfBuildMs || 0) + (now - t0)
      if (!this._perfAt) this._perfAt = now
      if (now - this._perfAt >= 10000) {
        const secs = Math.max(1, Math.round((now - this._perfAt) / 1000))
        console.log('[perf] ' + secs + 's：收帧 ' + this._perfFrames + '（' +
          Math.round(this._perfFrames / secs) + '/s），提交 ' + this._perfCommits +
          ' 次，平均提交 ' + (this._perfBuildMs / Math.max(1, this._perfCommits)).toFixed(1) +
          'ms，tab=' + this.currentTab + '，有变化=' + (changed ? '是' : '否'))
        this._perfAt = now; this._perfFrames = 0; this._perfCommits = 0; this._perfBuildMs = 0
      }
    },
    /**
     * 写入「暂存区」（非响应式）。收帧再频繁也只是几次属性赋值，
     * 真正的响应式写入集中在 _commitStaged()，由显示节流控制频率。
     */
    _mergeBucket(dt, batch) {
      const stage = this._stage || (this._stage = {})
      const st = stage[dt] || (stage[dt] = {})
      const keys = Object.keys(batch)
      for (let i = 0; i < keys.length; i++) st[keys[i]] = batch[keys[i]]
    },
    /**
     * 把暂存区提交进 rawValues（唯一触发渲染的地方）。
     * 不用整对象替换：171C 主机 224 字段、四台阈值从机各 176 字段，`{...old, ...batch}`
     * 每次新建上千键对象，Vue2 要逐键 defineProperty。这里值相同跳过、已有键直接赋值
     * （只通知真正变化的键）、新键用 $set，新键很多（首帧/控制帧第一次到）时才整体替换。
     * @returns {boolean} 是否有值真的变了
     */
    _commitStaged() {
      const stage = this._stage
      if (!stage) return false
      this._stage = {}
      const rv = this.rawValues
      let changed = false
      for (const dt in stage) {
        const src = stage[dt]
        const bucket = rv[dt]
        if (!bucket) {
          this.$set(rv, dt, Object.assign({}, src))
          changed = true
          continue
        }
        const keys = Object.keys(src)
        let newKeys = 0
        for (let i = 0; i < keys.length; i++) {
          if (!(keys[i] in bucket)) newKeys++
        }
        if (newKeys > 8) {
          rv[dt] = Object.assign({}, bucket, src)
          changed = true
          continue
        }
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i]
          const v = src[k]
          if (bucket[k] === v) continue
          if (k in bucket) bucket[k] = v
          else this.$set(bucket, k, v)
          changed = true
        }
      }
      return changed
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
      // 控制 topic 上如有周期性杂帧，逐条 warn 会刷爆日志（调试器里非常卡），按 10s 聚合
      const nowTs = Date.now()
      this._ctlWarnCount = (this._ctlWarnCount || 0) + 1
      if (!this._ctlWarnAt || nowTs - this._ctlWarnAt > 10000) {
        console.warn('[MQTT CONTROL RESP] 无法识别的消息格式（10s 内 ' + this._ctlWarnCount + ' 条）' +
          (hexDump ? ' 示例 hex=' + hexDump.slice(0, 120) : '') +
          (printableText ? ' text=' + printableText : ''))
        this._ctlWarnAt = nowTs
        this._ctlWarnCount = 0
      }
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
        // 同步设置面板参数状态
        this.syncAllParamsFromResp(change)
      }
    },
    syncParamFromResp(params, data) {
      params.forEach(p => {
        // 组合卡里待下发的本地改动优先，别被回执刷掉
        if (p._pending) return
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
    // ============ 设置面板方法 ============

    initSettingsParams() {
      SETTINGS_PANELS.forEach(cfg => this._clonePanelParams(cfg))
      this.syncSettingsFromRealtime()
    },
    syncSettingsFromRealtime() {
      // 节流：设置面板 1s 合并更新一次。
      // 数值设定（告警阈值 / 温控）根本不需要秒级刷新，而每次同步都要遍历几百项参数，
      // 写回显字段 → 小程序要重新 diff 一遍参数树。以前 500ms 一次（实际上是 0ms 空转，
      // 见 _doSyncSettingsFromRealtime 的注释），是设置页持续卡顿的主要来源之一。
      if (this._syncSettingsTimer || this._inSettingsSync) return
      this._syncSettingsTimer = setTimeout(() => {
        this._syncSettingsTimer = null
        this._doSyncSettingsFromRealtime()
      }, 1000)
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
      // 数组被整体替换 → 映射容器指向新数组（引用变化只发生在协议切换/初始化这一次）
      this.paramsMapRef = this._buildParamsMap()
      // 回显用的两个缓存必须一起清：候选键依赖协议模式（100 段 / 331 段），
      // 原始值快照依赖参数集合，不清会把上一套参数的判断结果套到新参数上
      this._candCache = {}
      this._paramSeen = {}
    },
    _doSyncSettingsFromRealtime() {
      // 防自激：本方法内部会 flushPendingFramesNow()，而 flush 收尾又会调
      // syncSettingsFromRealtime()。定时器先置 null 再 flush 的老写法，等于
      // 「同步 → flush → 再排一个定时器 → 同步 …」无限空转：没收到任何数据也每秒跑几遍
      // 全量遍历。这里用同步锁切断。
      if (this._inSettingsSync) return
      this._inSettingsSync = true
      try {
        this._syncSettingsCore()
      } finally {
        this._inSettingsSync = false
      }
    },
    /** 寄存器映射的 field→reg 反向表，按 deviceType 缓存（以前每次同步、每个面板重建一遍） */
    _getFieldToReg(deviceType) {
      const cache = this._fieldRegCache || (this._fieldRegCache = {})
      let m = cache[deviceType]
      if (m) return m
      m = {}
      const regMap = getRegisterMap(deviceType)
      if (regMap && regMap.monitor) {
        regMap.monitor.forEach(p => { if (p.reg !== undefined && p.field) m[p.field] = p.reg })
      }
      if (regMap && regMap.control) {
        regMap.control.forEach(p => { if (p.reg !== undefined && p.field) m[p.field] = p.reg })
      }
      cache[deviceType] = m
      return m
    },
    /**
     * 参数回显的候选键列表（只与参数定义 + 协议模式有关，与实时值无关）。
     * 以前每项、每次同步都要重跑几条正则和数组拼接，几百项 × 每秒一次，
     * 光内存分配就够小程序喝一壶；缓存后只在首次算。
     */
    _getCandidates(p, cfg, allFieldToReg) {
      const cache = this._candCache || (this._candCache = {})
      const ck = cfg.dataKey + '|' + p.key
      let arr = cache[ck]
      if (arr) return arr
      const has50Kw = this.is50KwMode
      const fk = p.frameKey || p.key
      arr = []
      const is171FQuickCtl = cfg.deviceType === '171F' &&
        (cfg.dataKey === 'quickControlParams' || cfg.dataKey === 'quickPowerParams')
      if (is171FQuickCtl) {
        // 171F 控制帧的 B-key 与能源帧重号（B0=光伏功率、B4=电网功率、B8=储能功率…），
        // 只能读带 C_ 前缀的控制帧键；回落裸 B4 会把「电网功率」当成「储能DC开关机」
        const f = String(p.field || '')
        if (/^B\d+$/.test(f)) arr.push('C_' + f)
        arr.push(fk)
      } else if (has50Kw && /^[SC]_/.test(String(fk))) {
        // 50kW：帧键自带 S_/C_ 前缀，说明这一项「只能从那类帧读」。
        // 状态帧 B0=运行状态、控制帧 B0=心跳、能源帧 B0=接触器状态，同号不同义，
        // 一旦回落到裸 B 号就会张冠李戴 —— BMS 心跳 100 曾被能源帧 B0（接触器已断开=0）
        // 盖成 0，温控 15 项同理全被读成「原始 0 → -50.0℃」。
        // 没有对应帧时宁可显示 '--'（并提示设备未上报控制帧），也不要编一个数出来。
        arr.push(fk)
      } else {
        arr.push(fk)
        const bareKey = String(fk).replace(/^[SC]_/, '')
        if (bareKey !== fk) arr.push(bareKey)
        if (p.field) arr.push(p.field)
        if (p.address) {
          const addrNum = parseInt(p.address, 10)
          // 50kW 面板地址一律 ≥331；小于 300 的「裸地址」会命中能源帧同号寄存器，
          // 早前 BMS 告警阈值（地址 1~76）就是这么把别的量读成 10.6V 的，直接跳过
          if (!isNaN(addrNum) && !(has50Kw && addrNum < 300)) arr.push(addrNum)
        }
        // registerMap 里 field → reg 号（帧解析同时存了 B{n} 和 reg 号两种 key）
        if (allFieldToReg) {
          if (allFieldToReg[fk] !== undefined) arr.push(allFieldToReg[fk])
          if (allFieldToReg[p.field] !== undefined) arr.push(allFieldToReg[p.field])
        }
      }
      cache[ck] = arr
      return arr
    },
    _syncSettingsCore() {
      // 设置面板读的是 rawValues：先把暂存帧合并进来，保证回显用的是最新帧
      this.flushPendingFramesNow()
      // 50kW 判定：配置页选择 50kW，或已收到新协议 bucket 数据
      const has50Kw = this.is50KwMode
      const rv = this.rawValues || {}

      // BMS 设置面板的 15 项温控参数只能从 0x04 控制帧回显。
      // 主机一个字节都没收到时（bucket 里没有 C_ 键），整列显示 '--' 是正常的，
      // 这里提示一次，免得被当成「页面又坏了」——真机若是这种情况，需要设备侧开控制帧上报，
      // 或者另做一条「读参数」流程（发 0x3401 读命令收应答），不能靠全量上报。
      if (has50Kw && this.currentSettingsTab && this.currentSettingsTab.tab === 8) {
        const bmsBucket = rv['171C_V2'] || {}
        const hasAnyFrame = Object.keys(bmsBucket).length > 0
        const hasCtlFrame = Object.keys(bmsBucket).some(k => k.indexOf('C_') === 0)
        if (hasAnyFrame && !hasCtlFrame && !this._bmsCtlTipShown) {
          this._bmsCtlTipShown = true
          uni.showToast({ title: 'BMS 未上报控制帧（0x04），温控参数暂不可读', icon: 'none', duration: 2600 })
        }
      }

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

      // 只同步「当前设置 tab 真正用到的数组」。
      // 以前每次同步都把 9 个面板全遍历一遍（BMS 367 项 + PCS/光伏/储能/液冷上百项），
      // 一屏却只看得到一个 tab —— 其余几百项算完就扔，还把它们一起拖进参数树的 diff。
      const cfgNow = this.currentSettingsTab
      if (!cfgNow) return
      const needKeys = [cfgNow.dataKey, cfgNow.numericKey, cfgNow.extraSwitchKey]
      const panels = sourcePanels.filter(c => needKeys.indexOf(c.dataKey) !== -1)
      // 原始值快照：值没变就整项跳过（见下面快路径）
      const seenCache = this._paramSeen || (this._paramSeen = {})

      panels.forEach(cfg => {
        const params = this[cfg.dataKey]
        if (!params || params.length === 0) return
        const bucket = rv[cfg.deviceType] || {}
        // 同一 deviceType 可能 registerMap 是短码（170C_STORAGE 前缀匹配 '170C'），用 getRegisterMap 拿完整映射
        // 反向表按 deviceType 缓存，不再每次同步重建几百项的对象
        const allFieldToReg = this._getFieldToReg(cfg.deviceType)

        params.forEach(p => {
          // 组合卡里已改但还没下发的项：保留用户的选择，等「下发组合指令」后再由回显校准。
          // 否则设备还在报旧值，用户刚选的「放电」会在 500ms 内被刷回去。
          if (p._pending) return
          // 每项可能属于不同设备（例如 171C 站点里有主机和阈值从机），
          // 桶必须按参数自己的 deviceType 取，不能一律用面板的 cfg.deviceType。
          // strictBucket 的项（BMS 四级告警阈值）在从机没上报时直接显示 '--'，
          // 绝不回落到主机桶——两边 B0 重号，回落会把心跳 100 当成阈值。
          const pbucket = p.strictBucket
            ? (rv[p.deviceType] || {})
            : ((p.deviceType && rv[p.deviceType]) || bucket)
          // 候选键列表（多层 fallback：帧前缀键 → 裸 B 号 → field → 十进制地址 → reg 号）
          // 只与参数定义和协议模式有关，缓存后不再每次重跑正则/拼数组
          const candidates = this._getCandidates(p, cfg, allFieldToReg)

          let val
          for (let i = 0; i < candidates.length; i++) {
            const k = candidates[i]
            if (k !== undefined && pbucket[k] !== undefined) { val = pbucket[k]; break }
          }
          if (val === undefined) return  // bucket 里没这个值（控制寄存器设备不上报）

          const raw = typeof val === 'object' ? (val.raw !== undefined ? val.raw : val.eng) : val
          // 快路径：数值项的显示值只由原始值决定。原始值没变、面板值也没被本地改过
          // → 直接跳过换算与写回。367 项每秒重算一次除法 + toFixed 再写响应式属性，
          // 是这个页面持续卡顿的大头（阈值这类值几分钟都不变）。
          const seenKey = cfg.dataKey + '|' + p.key
          const seen = p.options ? null : seenCache[seenKey]
          if (seen && seen.raw === raw && seen.v === p.currentValue) return
          const eng = typeof val === 'object' ? (val.eng !== undefined ? val.eng : raw) : raw
          const sf = p.scale || 1
          const off = p.offset || 0
          let nextValue
          let nextText
          if (p.protoScaled) {
            // 协议层已按点表 scale 换算过（如 171F 控制帧 B8 已 /10、B16 已 /100），
            // 面板不能再除一次，否则 5.0kW 会变成 0.5kW
            nextValue = Number(eng)
            nextText = this.formatValue(nextValue, p.decimals !== undefined ? p.decimals : 1)
          } else if (sf !== 1 || off) {
            // 工程值 = 原始值/系数 + 偏移（温度阈值 -40℃ 类，原始 810 → 41.0℃）
            nextValue = Number(eng) / sf + off
            nextText = this.formatValue(nextValue, p.decimals !== undefined ? p.decimals : 1)
          } else {
            nextValue = raw
            nextText = raw !== undefined ? String(raw) : '--'
          }
          // 只在真的变了才写：BMS 数值设定有 367 项，每秒无条件赋值 700 多次
          // 会白白触发一轮响应式通知（小程序里就是一层层 setData）
          if (p.currentValue !== nextValue) p.currentValue = nextValue
          if (p.currentText !== nextText) p.currentText = nextText
          if (p.options) {
            // 位命令：帧上报单比特 0/1，选项值为 0x00000000/0x00010000，先归一化再匹配
            const matchRaw = p.bitHex ? (Number(raw) ? '0x00010000' : '0x00000000') : raw
            const opt = p.options.find(o => String(o.value) === String(matchRaw))
            const nextLabel = opt ? opt.label : (raw !== undefined ? String(raw) : '--')
            if (p.currentLabel !== nextLabel) p.currentLabel = nextLabel
            if (p.bitHex && p.currentValue !== matchRaw) p.currentValue = matchRaw
          } else {
            // 记下这次的原始值 + 落库值，下次同步就能用快路径直接跳过
            seenCache[seenKey] = { raw: raw, v: nextValue }
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
      this.opToast = '请先点击右上角“修改”，再执行此操作'
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
    /**
     * 组装「储能DC」组合报文
     *
     * 协议（0x3401 附件2 / EMS 0x171F，V1.2 起为 331 段地址）：储能DC开关机(335) /
     * 储能充放电选择(337) / 充放电总功率(339) 三项必须放在一个报文里下发。分三帧发的话，设备按「最后一次写入」
     * 理解，前面两项会被覆盖 —— 以前单独点「并网一键开机」再点「充电」，实际开机状态就丢了。
     *
     * @param {object} target 本次改动的参数
     * @param {number} targetRaw 该参数的目标原始值（开关量是选项值，功率是 ×10 后的整数）
     * @returns {{commands:Array, fallbacks:Array, error?:string}}
     */
    _buildStorageDcBundle(target, targetRaw) {
      // 组帧前先把暂存帧落库：避免把 ≤800ms 前的回显旧值当作「当前值」一并下发
      this.flushPendingFramesNow()
      const groups = [
        { key: 'qc_storage_dc', arr: this.quickControlParams },
        { key: 'qc_pcs_mode', arr: this.quickControlParams },
        { key: 'qc_total_power', arr: this.quickPowerParams }
      ]
      const commands = []
      const fallbacks = []
      for (let i = 0; i < groups.length; i++) {
        const g = groups[i]
        const item = (g.arr || []).find(x => x.key === g.key)
        if (!item) return { error: `缺少参数 ${g.key}，请退出页面重新进入后再试` }
        if (!item.address && !item.field) return { error: `参数“${item.label}”缺少寄存器地址` }

        let raw
        if (target && item.key === target.key) {
          raw = Number(targetRaw)
        } else {
          raw = this._paramCurrentRaw(item)
          if (raw === null) {
            // 设备还没回显这一项：用协议默认值 0 占位（不启用 / 不充不放 / 功率 0），
            // 既保证三项齐全、报文结构合法，也不会把设备推到未知状态
            raw = 0
            fallbacks.push(`${item.label}=0（未回显，按默认）`)
          }
        }
        if (!Number.isFinite(raw)) return { error: `参数“${item.label}”的当前值无法换算，请稍后重试` }
        commands.push({
          field: item.field,
          registerAddress: item.address,
          value: raw,
          regType: item.regType,
          label: item.label
        })
      }
      return { commands, fallbacks }
    },
    /** 工程值 → 下发原始值：开关量直接用选项值，数值走 (工程值 - offset) × scale */
    _paramCurrentRaw(p) {
      const cv = p.currentValue
      if (cv === undefined || cv === null || cv === '') return null
      const n = Number(cv)
      if (!Number.isFinite(n)) return null
      if (p.options) return Math.round(n)
      return Math.round((n - (p.offset || 0)) * (p.scale || 1))
    },
    /** 一帧下发组合命令（储能DC）：成功返回 { ok: true, fallbacks }，失败弹窗并返回 { ok: false } */
    async _sendStorageDcBundle(target, targetRaw) {
      const bundle = this._buildStorageDcBundle(target, targetRaw)
      if (bundle.error) {
        uni.showModal({ title: '下发失败', content: bundle.error, showCancel: false })
        return { ok: false }
      }
      const deviceType = (target && target.deviceType) || '171F'
      console.log('========== 下发组合命令帧（储能DC，一个报文） ==========')
      bundle.commands.forEach((c, i) => {
        console.log(`[CMD] 命令${i + 1} ${c.label}: 字段 ${c.field} 寄存器 ${c.registerAddress} = ${c.value}`)
      })
      if (bundle.fallbacks.length) {
        console.log('[CMD] 未回显项按默认值一并下发:', bundle.fallbacks.join('、'))
      }
      console.log('======================================================')
      try {
        this.client.setDeviceType(deviceType)
        await this.client.sendControlBatch(bundle.commands, deviceType)
        return { ok: true, fallbacks: bundle.fallbacks }
      } catch (e) {
        uni.showModal({ title: '下发失败', content: e.message || '请重试', showCancel: false })
        return { ok: false }
      }
    },
    /** 组合卡：本地选择（不下发），打 _pending 标记，未下发前不被设备回显覆盖 */
    onBundleSelect(payload) {
      if (!this._guardSettingsEdit()) return
      const r = this._resolvePanelEvent(payload, null)
      const p = r.param
      const opt = r.option
      if (!p || !opt) return
      p.currentValue = opt.value
      p.currentLabel = opt.label
      p._pending = true
      console.log('[BUNDLE] 本地选择:', p.label, '=', opt.label, '（待下发）')
    },
    /** 组合卡：本地改数值（只弹输入框，不下发） */
    onBundleValueEdit(payload) {
      if (!this._guardSettingsEdit()) return
      const p = this._resolvePanelEvent(payload, null).param
      if (!p) return
      uni.showModal({
        title: `设置 ${p.label}`,
        editable: true,
        placeholderText: `当前: ${p.currentText || '--'}${p.unit ? ' ' + p.unit : ''}，请输入新值`,
        success: (res) => {
          if (!res.confirm || res.content === undefined || res.content === '') return
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
          p.currentValue = newVal
          p.currentText = this.formatValue(newVal, p.decimals !== undefined ? p.decimals : 1)
          p._pending = true
          console.log('[BUNDLE] 本地改值:', p.label, '=', p.currentText, p.unit || '', '（待下发）')
        }
      })
    },
    /** 组合卡：点「下发组合指令」，把卡内三项的当前选择合成一帧发出 */
    async onBundleSend() {
      if (!this._guardSettingsEdit()) return
      const run = async () => {
        const r = await this._sendStorageDcBundle(null, null)
        if (!r || !r.ok) return
        this._clearBundlePending()
        const tail = r.fallbacks && r.fallbacks.length ? '，未回显项已按默认值下发' : ''
        this.opToast = `指令已下发${tail}`
        this.showOpToast = true
        setTimeout(() => { this.showOpToast = false }, 2600)
      }
      // 关机属危险动作：组合报文里含「一键关机」时先确认
      const dc = (this.quickControlParams || []).find(x => x.key === 'qc_storage_dc')
      if (dc && String(dc.currentValue) === '2') {
        this.confirmTitle = '操作确认'
        this.confirmContent = '即将执行“一键关机”，该指令将与充放电选择、充放电总功率一并下发，是否继续？'
        this.confirmPayload = null
        this.confirmCallback = run
        this.showConfirm = true
        return
      }
      await run()
    },
    /** 组合报文发完，清掉本地待下发标记，让回显重新接管 */
    _clearBundlePending() {
      const keys = ['qc_storage_dc', 'qc_pcs_mode', 'qc_total_power']
      keys.forEach(k => {
        const p = (this.quickControlParams || []).find(x => x.key === k) ||
          (this.quickPowerParams || []).find(x => x.key === k)
        if (p) p._pending = false
      })
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
        this.opToast = `${p.label} 当前已是“${opt.label}”`
        setTimeout(() => { this.showOpToast = false }, 2000)
        return
      }

      // 组合报文：储能DC开关机 / 充放电选择 / 总功率 必须同帧下发，不能走单字段 sendControl
      if (p.bundle) {
        // 组合参数不走单字段下发（会把同组另外两项覆盖掉），一律走卡片上的「统一下发」
        this.opToast = '该项需与同组参数一并下发，请在顶部卡片点击“统一下发”'
        this.showOpToast = true
        setTimeout(() => { this.showOpToast = false }, 2400)
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
            throw new Error(`参数“${p.label}”数据异常，请重新进入该页面后再试`)
          }
          if (sendValue === undefined || sendValue === null || String(sendValue).trim() === '') {
            throw new Error(`参数“${p.label}”下发值无效，请重新进入该页面后再试`)
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
          this.opToast = `已下发：${p.label} - ${opt.label}`
          this.showOpToast = true
          setTimeout(() => { this.showOpToast = false }, 2500)
        } catch (e) {
          uni.showModal({ title: '下发失败', content: e.message || '请重试', showCancel: false })
        }
      }

      if (opt.dangerous) {
        this.confirmTitle = '操作确认'
        this.confirmContent = `确定对“${p.label}”执行“${opt.label}”吗？该操作将直接影响设备运行。`
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
      if (p.bundle) {
        // 组合参数不走单字段下发（会把同组另外两项覆盖掉），一律走卡片的「下发组合指令」
        this.opToast = '该项需与同组参数一并下发，请在顶部卡片点击“统一下发”'
        this.showOpToast = true
        setTimeout(() => { this.showOpToast = false }, 2400)
        return
      }
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
                content: `参数“${p.label}”数据异常，请重新进入该页面后再试`,
                showCancel: false
              })
              return
            }
            if (!Number.isFinite(rawVal)) {
              uni.showModal({
                title: '下发失败',
                content: `参数“${p.label}”输入值超出有效范围，请重新输入`,
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
              this.opToast = `${p.label}已修改为 ${p.currentText}${p.unit ? ' ' + p.unit : ''}`
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
  /* 显式字体栈：安卓 WebView 默认字体在数字与中文混排时字重不均，
     指定系统 UI 字体后中文走苹方/HarmonyOS Sans，数字走 SF/Roboto，观感统一 */
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC',
    'HarmonyOS Sans', 'Helvetica Neue', 'Microsoft YaHei', sans-serif;
  color: #17202e;
  -webkit-font-smoothing: antialiased;
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

/* ========== 标签栏（分段控件式） ==========
   整条做成一个白色轨道，选中项是轨道里的主色滑块。
   之前每项各自一张白卡加投影，五个并排时像五张卡片在抢注意力，
   分段控件只留一个视觉焦点，更接近系统级 App 的次级导航。
   高度固定 90rpx ≈ 46px，swiperStyle 中 fixed 常量需同步
   （placeholder 89 + 卡片 95 + 标签栏 46 + 底部 tab 44） */
.tab-container {
  flex-shrink: 0;
  background-color: #f4f6f9;
  padding: 10rpx 0 14rpx;
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
  margin: 0 20rpx;
  padding: 5rpx;
  width: calc(100% - 40rpx);
  box-sizing: border-box;
  background: #ffffff;
  border: 1rpx solid #e7ecf3;
  border-radius: 999rpx;
  box-shadow: 0 1rpx 3rpx rgba(20, 32, 52, 0.04);
}

/* 设置组标题较长：容器按内容宽度排布，配合 scroll-view 横向滚动。
   右侧留 40rpx：否则最后一项会被屏幕边缘切掉半个字，看着像渲染出错 */
.tab-list-auto {
  /* 设置组标题较长：轨道按内容撑开，横向滚动；右侧多留一段，
     否则滚到末尾时最后一项紧贴轨道内壁，看起来像被切掉 */
  width: max-content;
  min-width: calc(100% - 40rpx);
  // padding-right: 44rpx;
}

.tab-item {
  /* 设置组标题较长：按内容宽度排布并允许横向滚动，避免文字互相粘连 */
  flex: 0 0 auto;
  text-align: center;
  padding: 12rpx 18rpx;
  font-size: 26rpx;
  line-height: 1.25;
  letter-spacing: 0.4rpx;
  color: #5f6a79;
  font-weight: 500;
  background: transparent;
  border: none;
  border-radius: 999rpx;
  white-space: nowrap;
  transition: color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;

  /* 监测组标题较短：等分宽度铺满 */
  &.tab-monitor {
    flex: 1 1 0;
    padding: 12rpx 8rpx;
  }

  & + .tab-item {
    margin-left: 4rpx;
  }

  &:active {
    opacity: 0.7;
  }

  /* 激活态：轨道内的主色滑块。
     两组统一配色 —— 监测/设置的身份由底部主导航表达，顶部再换一次颜色，
     同一个控件在两屏之间会「换一张脸」。
     不加字重：设置组按内容宽度排布，选中项一加粗整排会横向抖 1~2px。 */
  &.tab-monitor.active,
  &.tab-setting.active {
    color: #ffffff;
    background: #2f7cf6;
    box-shadow: 0 2rpx 5rpx rgba(20, 32, 52, 0.14);
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
  background: #f4f6f9;
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
  font-size: 22rpx;
  line-height: 1;
  letter-spacing: 0.4rpx;
  color: #8a94a1;
}

.module-scroll {
  height: 100%;
  min-height: 0;
  touch-action: pan-y;
  /* 显式底色：面板创建/切换的瞬间若还没画内容，露出的是与标签栏一致的浅灰，
     而不是微信默认的白色块（之前那种“白一块”的观感就是底色透出来的） */
  background: #f4f6f9;
}

.content {
  /* 与 DeviceCard 的 20rpx 外边距对齐 */
  padding: 20rpx;
}

/* 设置面板两阶段挂载时的骨架：与真实面板同尺寸的浅色块，
   只画一帧，代价接近 0，避免点按后出现空白/推片 */
.sp-skeleton {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.sp-skeleton-hero {
  height: 106rpx;
  border-radius: 20rpx;
  background: #ffffff;
  border: 1rpx solid #eceff4;
}
.sp-skeleton-card {
  height: 220rpx;
  border-radius: 20rpx;
  background: #ffffff;
  border: 1rpx solid #eceff4;
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
    background: #2f7cf6;
    color: #fff;
    box-shadow: 0 2rpx 8rpx rgba(20, 32, 52, 0.12);
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
