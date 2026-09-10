﻿<template>
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
      <uni-icons type="wifi" size="56" color="#ccc"></uni-icons>
      <text class="empty-text">直连模式未开启</text>
      <text class="empty-sub">请先在设置中配置 IP 与端口</text>
      <button class="btn primary" @click="goConfig">前往配置</button>
    </view>

    <view v-else-if="connectionState === 'offline' && !connecting" class="empty-state">
      <uni-icons type="wifi-off" size="56" color="#ccc"></uni-icons>
      <text class="empty-text">设备离线</text>
      <text class="empty-sub">{{ errorMsg || '无法连接到设备，请检查网络与配置' }}</text>
      <button class="btn primary" @click="reconnect">重新连接</button>
    </view>

    <view v-else class="connected-view">
    <!-- 标签页 + 数据区 -->
    <!-- 标签页 -->
    <view class="tab-container">
        <scroll-view scroll-x="true" class="tab-scroll">
          <view class="tab-list">
            <!-- 监测数据胶囊组 -->
            <view class="tab-pill tab-pill-monitor">
              <view v-for="index in tabGroupMonitor" :key="index"
                class="tab-item"
                :class="{ active: currentTab === index }"
                @click="switchTab(index)">
                <text>{{ tabList[index] }}</text>
              </view>
            </view>
            <!-- 控制数据胶囊组 -->
            <view class="tab-pill tab-pill-control">
              <view v-for="index in tabGroupControl" :key="index"
                class="tab-item"
                :class="{ active: currentTab === index }"
                @click="switchTab(index)">
                <text>{{ tabList[index] }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 数据区 -->
      <swiper class="content-swiper" :style="swiperStyle" :current="currentTab" @change="onSwiperChange" :duration="300">
        <!-- 概览标签页 -->
        <swiper-item>
          <OverviewTab :formattedValues="formattedValues" :systemRunning="archSystemRunning" @start-stop="onSystemStartStop" />
        </swiper-item>

        <!-- PCS标签页 -->
        <swiper-item>
          <PcsTab :formattedValues="formattedValues" :rawValues="rawValues" />
        </swiper-item>

        <!-- 储能DC标签页 -->
        <swiper-item>
          <StorageDcTab :formattedValues="formattedValues" :rawValues="rawValues" />
        </swiper-item>

        <!-- 光伏标签页 -->
        <swiper-item>
          <PvTab :formattedValues="formattedValues" :rawValues="rawValues" />
        </swiper-item>

        <!-- BMS标签页 -->
        <swiper-item>
          <BmsTab
            :formattedValues="formattedValues"
            :controlList="controlList"
            :isConnected="isConnected"
            :clickedBtn="clickedBtn"
            @control-click="onControlClick"
          />
        </swiper-item>

        <!-- 设置标签页（数据驱动，v-for 遍历 SETTINGS_TABS，无操作码时不渲染） -->
        <swiper-item v-if="hasAccessCode" v-for="tabCfg in settingsTabs" :key="tabCfg.tab">
          <scroll-view class="module-scroll" scroll-y="true">
            <view class="content">
              <SettingsPanel
                :tabCfg="tabCfg"
                :paramsMap="settingsParamsMap"
                :isEditing="isEditing(tabCfg.editKey)"
                :formatCurrentLabel="getParamCurrentLabel"
                :formatCurrentValue="getParamCurrentValue"
                :formatCurrentText="getParamCurrentText"
                @toggle-edit="toggleEdit"
                @switch-click="onSwitchParamClick"
                @numeric-edit="onNumericParamEdit"
              />
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
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
  TAB_LIST,
  TAB_GROUP_MONITOR,
  TAB_GROUP_CONTROL,
  MONITOR_LAST_INDEX,
  GROUP_TITLE,
  DEVICE_GROUPS,
  DEVICE_NAME_MAP,
  BMS_ALARM_FIELDS,
  SETTINGS_PANELS,
  SETTINGS_TABS
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
    BmsTab
  },
  data() {
    return {
      currentTab: 0,
      config: {
        enabled: false,
        protocol: 'mqtt',
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
      rawValues: { '171B': {}, '171C': {}, '171D': {}, '171E': {}, '171F': {} },
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
      isEditingQuickControl: false
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
      return TAB_LIST
    },
    tabGroupMonitor() {
      // 没有操作码时只显示概览（tab 0），有操作码才显示全部监测 tab
      return this.hasAccessCode ? TAB_GROUP_MONITOR : [0]
    },
    tabGroupControl() {
      // 没有操作码时隐藏设置面板，只显示概览和监测数据
      return this.hasAccessCode ? TAB_GROUP_CONTROL : []
    },
    hasAccessCode() {
      return !!(this.config && this.config.accessCode === '123456')
    },
    settingsTabs() {
      return SETTINGS_TABS
    },
    /** 设置面板参数映射：供 SettingsPanel 子组件按 key 取参数数组 */
    settingsParamsMap() {
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
        quickPowerParams: this.quickPowerParams
      }
    },
    // swiper 可用高度：窗口高度减去固定头部（设备卡片 + 标签栏 + 占位）
    // 架构图和卡片已移入标签页滚动内容内，不再占用固定高度
    swiperStyle() {
      const sysInfo = uni.getSystemInfoSync()
      const h = sysInfo.windowHeight || 667
      // 固定头部占位：placeholder ~89px + device-card ~95px + tab-container ~50px
      const fixed = 89 + 95 + 50
      return { height: `${Math.max(250, h - fixed)}px` }
    },
    currentDeviceType() {
      // 设置面板：从 SETTINGS_PANELS 配置获取 deviceType
      const tab = SETTINGS_TABS.find(t => t.tab === this.currentTab)
      if (tab) {
        const panel = SETTINGS_PANELS.find(p => p.dataKey === tab.dataKey)
        if (panel) return panel.deviceType
      }
      // 监控面板：走 DEVICE_TYPES 映射
      return DEVICE_TYPES[this.currentTab] || null
    },
    /** 设备卡片副标题：用户可读的设备说明（不暴露内部编号） */
    currentDeviceSubtitle() {
      // 概览
      if (this.currentTab === 0) return '场站综合监测'
      // 快捷控制
      if (this.currentTab === 9) return '快捷控制'
      // 设置面板（tab 5-8）：取 SETTINGS_TABS 标题去掉 "(171X)" 后缀
      const settingTab = SETTINGS_TABS.find(t => t.tab === this.currentTab)
      if (settingTab) return settingTab.title.replace(/\s*\(\d+\)\s*$/, '')
      // 监控面板（tab 1-4）：取 DEVICE_NAME_MAP
      const dt = DEVICE_TYPES[this.currentTab]
      if (dt && DEVICE_NAME_MAP[dt]) return DEVICE_NAME_MAP[dt]
      return '设备监测'
    },
    currentDeviceName() {
      return 'IEMS 微能量站'
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
    },
    currentSelectDevice: {
      handler() {
        this.sync171FFromRealtimeProvider()
      },
      immediate: true,
      deep: true
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
    this.updateDisplay()
    this.rebuildFormattedValues()
    // 从 realtimeDataProvider 获取 171F 架构数据
    this.sync171FFromRealtimeProvider()
    // 监听 WebSocket 数据更新以刷新架构图
    const prevOnDataUpdate = realtimeDataProvider.onDataUpdate
    realtimeDataProvider.onDataUpdate = () => {
      if (typeof prevOnDataUpdate === 'function') {
        try { prevOnDataUpdate() } catch (e) {}
      }
      this.sync171FFromRealtimeProvider()
    }
    this.startArchRefreshTimer()
    if (this.config.enabled) {
      // 进入页面即尝试连接
      this.$nextTick(() => this.start())
    }
  },
  onUnload() {
    this.stopArchRefreshTimer()
    this.stop()
  },
  onHide() {
    this.stopArchRefreshTimer()
  },
  onShow() {
    // 刷新架构图 171F 数据
    this.sync171FFromRealtimeProvider()
    this.startArchRefreshTimer()
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
            this.client.setDeviceType('171F')
            await this.client.sendControl('B12', running ? 0 : 1)
            uni.showToast({ title: '指令已下发', icon: 'none' })
          } catch (e) {
            uni.showModal({ title: '下发失败', content: e.message || '请重试', showCancel: false })
          }
        }
      })
    },

    /**
     * 从全局 realtimeDataProvider 同步 171F 能量控制器数据
     * 用于架构图展示：光伏、电网、储能、负荷等系统级功率数据
     */
    sync171FFromRealtimeProvider() {
      try {
        const deviceList = realtimeDataProvider.getDeviceList() || []
        // === 1. 同步 171F 能量控制器数据 ===
        const device171F = deviceList.find(item => item && item.deviceType === '171F')
        if (device171F && device171F.energyData) {
          const energyData = device171F.energyData
          const bucket = this.rawValues['171F'] || {}
          const batch = {}
          let hasNew = false

          // 将 energyData[key].value 转换为 rawValues[key] = value
          Object.keys(energyData).forEach(key => {
            const entry = energyData[key]
            if (entry && entry.value !== undefined && entry.value !== null) {
              const val = entry.value
              batch[key] = val
              if (bucket[key] !== val) hasNew = true
            }
          })

          if (hasNew) {
            this.rawValues['171F'] = { ...bucket, ...batch }
          }
        }
        // === 2. 计算负荷设备数量 ===
        let dlj = 0, cdz = 0, light = 0, unknown = 0
        const hasDeviceList = deviceList.length > 0
        if (hasDeviceList) {
          deviceList.forEach(item => {
            const hex = this.getTypeHex(item && item.type)
            if (hex === '0x0305' || hex === '0x0306' || hex === '0x1313') {
              dlj++
            } else if (hex === '0x1310') {
              cdz++
            } else if (hex === '0x0201') {
              light++
            } else {
              unknown++
            }
          })
        } else {
          // MQTT 直连模式：基于收到的设备消息类型估算
          if (this.rawValues['171C'] && Object.keys(this.rawValues['171C']).length > 0) dlj += 2
          if (this.rawValues['171D'] && Object.keys(this.rawValues['171D']).length > 0) cdz += 1
          if (this.rawValues['171B'] && Object.keys(this.rawValues['171B']).length > 0) light += 3
          if (this.rawValues['171E'] && Object.keys(this.rawValues['171E']).length > 0) dlj += 1
        }

        const prevCounts = this.formattedValues['archDeviceCounts'] || {}
        const countsStr = `${dlj}-${cdz}-${light}-${unknown}`
        const prevCountsStr = `${prevCounts.dljQuantity || 0}-${prevCounts.cdzQuantity || 0}-${prevCounts.lightQuantity || 0}-${prevCounts.unknownDeviceQuantity || 0}`
        const countsChanged = countsStr !== prevCountsStr

        if (countsChanged || !this.formattedValues['archDeviceCounts']) {
          this.formattedValues = {
            ...this.formattedValues,
            archDeviceCounts: {
              dljQuantity: dlj,
              cdzQuantity: cdz,
              lightQuantity: light,
              unknownDeviceQuantity: unknown
            }
          }
        }

        // 重建所有 arch* 字段（保证 171F 与设备数量都能刷新）
        this.rebuildFormattedValues('171F')
      } catch (e) {
        console.warn('同步 171F 架构数据失败:', e.message)
      }
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
      const types = deviceType
        ? (deviceType === '171F' ? ['171F'] : [deviceType, '171F'])
        : DEVICE_TYPES.concat(['171F'])
      const newVals = {}
      types.forEach(dt => {
        const bucket = this.rawValues[dt] || {}
        const map = getRegisterMap(dt)
        if (!map || !map.monitor) return
        map.monitor.forEach(p => {
          const raw = bucket[p.field]
          const decimals = p.decimals !== undefined ? p.decimals : 2
          newVals[`${dt}_${p.field}`] = this.formatValue(raw, decimals)
        })
        Object.keys(bucket).forEach(field => {
          const key = `${dt}_${field}`
          if (newVals[key] === undefined) {
            const val = bucket[field]
            const isBitField = field.includes('b')
            newVals[key] = this.formatValue(val, isBitField ? 0 : 2)
          }
        })
      })
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
      // === 设备数量估算（MQTT 直连模式）===
      if (!this.formattedValues['archDeviceCounts'] || !this.formattedValues['archDeviceCounts'].dljQuantity) {
        let dlj = 0, cdz = 0, light = 0, unknown = 0
        if (this.rawValues['171C'] && Object.keys(this.rawValues['171C']).length > 0) dlj += 2
        if (this.rawValues['171D'] && Object.keys(this.rawValues['171D']).length > 0) cdz += 1
        if (this.rawValues['171B'] && Object.keys(this.rawValues['171B']).length > 0) light += 3
        if (this.rawValues['171E'] && Object.keys(this.rawValues['171E']).length > 0) dlj += 1
        newVals['archDeviceCounts'] = {
          dljQuantity: dlj, cdzQuantity: cdz,
          lightQuantity: light, unknownDeviceQuantity: unknown
        }
      }
      this.formattedValues = { ...this.formattedValues, ...newVals }
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
    switchTab(index) {
      if (index !== this.currentTab) {
        this.currentTab = index
        if (DEVICE_TYPES[index] === '171C') {
          this.initControlList()
        }
        // 切换到设置/快捷标签页时同步最新数据
        if (index >= 5 && index <= 9) {
          this.syncSettingsFromRealtime()
        }
      }
    },
    onSwiperChange(e) {
      const newIndex = e.detail.current
      if (newIndex !== this.currentTab) {
        this.currentTab = newIndex
        if (DEVICE_TYPES[newIndex] === '171C') {
          this.initControlList()
        }
        if (newIndex >= 5 && newIndex <= 9) {
          this.syncSettingsFromRealtime()
        }
      }
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
      this.rawValues = { '171B': {}, '171C': {}, '171D': {}, '171E': {}, '171F': {} }
      this.formattedValues = {}
      this.displayItems = []
      this.groupedDisplay = []
    },
    // ============ MQTT 路径 ============
    async startMqtt() {
      await this.connectMqtt()
      await this.subscribeMqttTopics()
      this.initSettingsParams()
      // MQTT 推流模式：连接后无需主动拉取，等模拟器定时 publish
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
        // MQTT 异常断开：UI 切回离线
        this.connected = false
      }
      this.client.onError = (err) => {
        console.warn('MQTT error:', err.message)
      }
      await this.client.connect()
      this.connected = true
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
    _applyJsonRealtime(data) {
      const fields = data.fields || {}
      const deviceType = (data.deviceType || '171C').toUpperCase()
      if (!this.rawValues[deviceType]) this.rawValues[deviceType] = {}
      // console.log('[MQTT] 收到 JSON 数据 deviceType=' + deviceType + ' 字段数=' + Object.keys(fields).length)
      Object.entries(fields).slice(0, 8).forEach(([k, v]) => {
        if (v && v.eng !== undefined) {
          console.log(`    ${k}: ${v.name || ''} = ${v.eng}${v.unit ? ' ' + v.unit : ''} (raw=${v.raw})`)
        } else if (v !== null && v !== undefined) {
          console.log(`    ${k}: ${v}`)
        }
      })
      if (Object.keys(fields).length > 8) console.log(`    ... 共 ${Object.keys(fields).length} 个字段`)

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
    applyIemsFrame(frameBytes) {
      try {
        const parsed = parseIemsFrame(frameBytes)
        const deviceType = (parsed.deviceType || '171C').toUpperCase()
        if (!this.rawValues[deviceType]) this.rawValues[deviceType] = {}
        // console.log('[MQTT] IEMS 帧解析完成: deviceType=' + deviceType + ' dataType=0x' + parsed._dataTypeNum.toString(16) +
            // ' (frameType=' + parsed._frameTypeNum.toString(16) + ') 字段数=' + Object.keys(parsed.data || {}).length +
            // ' startAddr=' + parsed._startAddrNum + ' CRC=' + (parsed.crcOk ? 'OK' : 'FAIL'))
        if (parsed._dataTypeNum === IEMS_DATA_TYPE.DEVICEINFO) return

        const map = getRegisterMap(deviceType)
        const data = parsed.data || {}
        const dataTypeNum = parsed._dataTypeNum
        const bucket = this.rawValues[deviceType]

        // 所有非 DEVICEINFO 类型的帧：都把解析到的数据存入 rawValues
        // ENERGY / STATE / CONTROL 只是用途不同，但都包含寄存器值
        const fieldToReg = {}
        map.monitor.forEach(p => { if (p.reg !== undefined && p.field) fieldToReg[p.field] = p.reg })

        const batch = {}
        let hasNewValue = false
        Object.keys(data).forEach(field => {
          const v = data[field]
          if (v === undefined || v === null) return
          batch[field] = v
          if (fieldToReg[field] !== undefined) {
            batch[fieldToReg[field]] = v
          }
          if (bucket[field] !== v) hasNewValue = true
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
        }
        this.lastUpdate = Date.now()
      } catch (e) {
        console.error('IEMS 帧解析失败:', e)
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

      // 2. 尝试原始二进制
      if (payloadBytes && payloadBytes.length >= 9) {
        const ft = payloadBytes[0]
        if (ft === 0x16 || ft === 0x17 || ft === 0x07) {
          try {
            const frame = parseIemsFrame(payloadBytes)
            if (frame) {
              // console.log('[MQTT CONTROL RESP] 原始二进制帧 frameType=0x' + ft.toString(16) + ' 长度=' + payloadBytes.length)
              if (ft === 0x16) {
                uni.showToast({ title: '指令已生效', icon: 'success' })
              }
              return
            }
          } catch (e) { /* fallthrough */ }
        }
      }

      console.warn('[MQTT CONTROL RESP] 无法识别的消息格式，str=' + (payloadStr ? payloadStr.slice(0, 120) : '(empty)'))
    },
    /**
     * 把各种格式的 hex 字符串转换成 Uint8Array
     * 支持的输入格式：
     *   - "17 17 1f 00 01"  (纯空格分隔)
     *   - "Send Data: 17 17 1f 00 01"  (带前缀)
     *   - "17,17,1f,00"  (逗号分隔)
     *   - "{\"Send Data\": \"17 17 1f...\"}"  (JSON 里的 hex 值——此时应先 JSON.parse 再取 value)
     */
    /**
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
    async onControlClick(ctrl, opt) {
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
      SETTINGS_PANELS.forEach(cfg => {
        const hasOptions = cfg.source.length > 0 && cfg.source[0].options
        this[cfg.dataKey] = cfg.source.map(p => ({
          ...p, currentValue: null,
          currentLabel: hasOptions ? '--' : undefined,
          currentText: hasOptions ? undefined : '--'
        }))
      })
      this.syncSettingsFromRealtime()
    },
    syncSettingsFromRealtime() {
      SETTINGS_PANELS.forEach(cfg => {
        const params = this[cfg.dataKey]
        const bucket = this.rawValues[cfg.deviceType] || {}
        params.forEach(p => {
          const val = bucket[p.field]
          if (val !== undefined && val !== null) {
            const raw = typeof val === 'object' ? (val.raw !== undefined ? val.raw : val.eng) : val
            const eng = typeof val === 'object' ? (val.eng !== undefined ? val.eng : raw) : raw
            if (p.scale && p.scale !== 1) {
              const scaled = Number(eng) / p.scale
              p.currentValue = scaled
              p.currentText = this.formatValue(scaled, p.decimals !== undefined ? p.decimals : 1)
            } else {
              p.currentValue = raw
              p.currentText = raw !== undefined ? String(raw) : '--'
            }
            if (p.options) {
              const opt = p.options.find(o => String(o.value) === String(raw))
              p.currentLabel = opt ? opt.label : (raw !== undefined ? String(raw) : '--')
            }
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
      this[editKey] = !this[editKey]
      if (this[editKey]) {
        this.syncSettingsFromRealtime()
      }
    },
    async onSwitchParamClick(p, opt) {
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
          await this.client.sendControl(p.field, opt.value)
          // Optimistic update：本地立即更新，设备回显后再校准
          p.currentValue = opt.value
          p.currentLabel = opt.label
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
    onNumericParamEdit(p) {
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
            const rawVal = p.scale ? Math.round(newVal * p.scale) : newVal
            try {
              this.client.setDeviceType(this.editingParamDeviceType)
              await this.client.sendControl(p.field, rawVal)
              // Optimistic update
              const scaled = rawVal / (p.scale || 1)
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
  background: #f4f6fa;
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
}

/* monitor-data.vue style tab container */
.tab-container {
  flex-shrink: 0;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 14rpx 16rpx;
}

.tab-pill {
  display: flex;
  align-items: center;
  border-radius: 14rpx;
  padding: 6rpx;
  flex-shrink: 0;

  &.tab-pill-monitor {
    background: rgba(0, 122, 255, 0.08);
  }

  &.tab-pill-control {
    background: rgba(250, 140, 22, 0.08);
  }
}

.tab-item {
  padding: 12rpx 22rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
  font-size: 26rpx;
  color: #666;
  white-space: nowrap;
  transition: all 0.2s ease;
  position: relative;

  &:active {
    opacity: 0.7;
  }
}

/* 监测胶囊内激活态 */
.tab-pill-monitor .tab-item.active {
  background: #fff;
  color: #007aff;
  font-weight: bold;
  box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.18);
}

/* 控制胶囊内激活态 */
.tab-pill-control .tab-item {
  color: #7a6a55;

  &.active {
    background: #fff;
    color: #fa8c16;
    font-weight: bold;
    box-shadow: 0 2rpx 8rpx rgba(250, 140, 22, 0.2);
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 100rpx 40rpx;

  .empty-text {
    font-size: 30rpx;
    color: #666;
    margin-top: 12rpx;
  }

  .empty-sub {
    font-size: 24rpx;
    color: #999;
    text-align: center;
  }
}

/* 空数据提示 */
.empty-data {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80rpx 40rpx;
  color: #999;
  font-size: 26rpx;
}

/* swiper content area */
.content-swiper {
  flex: 1;
  min-height: 0;
  touch-action: pan-y;
  overflow: hidden;
}

/* swiper-item 默认需要撑满父高度 */
.content-swiper ::v-deep swiper-item {
  height: 100%;
}

.module-scroll {
  height: 100%;
  min-height: 0;
  touch-action: pan-y;
}

.content {
  padding: 16rpx;
}


.swiper-item {
  height: 100%;
}

/* 按钮 */
.btn {
  height: 76rpx;
  line-height: 76rpx;
  font-size: 28rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin: 0;
  border: none;
  padding: 0 32rpx;

  &::after { border: none; }

  &.primary {
    background: #007AFF;
    color: #fff;
  }

  &[disabled] {
    opacity: 0.5;
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
