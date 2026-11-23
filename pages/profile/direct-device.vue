<template>
  <view class="sub-page" :class="platformClass">
    <!-- ⚡ 吸顶头：navbar + 设备卡 + 标签栏。
         原实现是 height:100vh + 内部原生 scroll-view，每次 setData 都要让原生
         scroll-view 重算几千个常驻节点的滚动区域，切 tab 还要靠 scroll-top 翻转
         强制重排 —— 这就是「 tab 切换 / 点按钮卡 1~2 秒」的来源。
         现在纵向滚动交给页面本身（WebView 原生滚动，不占 setData 通道），
         这三块用 sticky 吸顶，功能与视觉完全不变。 -->
    <view class="sticky-header" @longpress="openPerfLog">
      <!-- 长按本区域（约 0.35s）打开 APP 内 [perf] 日志面板；
           只在 ENABLE_IN_APP_PERF_LOG 为 true 时生效，不影响任何业务交互。 -->
      <!-- 导航栏：标题/返回图标固定深色，主题切到深色时 vuex 的 fontColor 会变白，
           而 navbar 背景恒为白色，白字白底会让整条导航栏看起来是空的。 -->
      <DyNavbar
        title="直连设备监测"
        :fixed="false"
        :placeholder="false"
        bgColor="#ffffff"
        :titleStyle="navbarTitleStyle"
        :leftIconColor="'#17202e'"
      ></DyNavbar>

      <!-- 顶部设备卡片 -->
      <DeviceCard
        :connectionState="connectionState"
        :connecting="connecting"
        :isConnected="isConnected"
        :deviceName="currentDeviceName"
        :deviceSubtitle="currentDeviceSubtitle"
        :statusText="statusText"
        :showDeviceMeta.sync="showDeviceMeta"
        @refresh="manualRefresh"
        @go-permission="goPermission"
        @disconnect="onDisconnect"
      />

      <!-- 标签栏：只在直连开启时显示（原来在 v-else 的 connected-view 里） -->
      <view v-if="config.enabled" class="tab-container">
        <!-- 横向定位一律瞬时完成：带动画的 scroll-into-view 会让微信渲染层在切换帧
             额外建一层合成层。横向这条只有 12 个节点，不是卡顿源，保留原功能。 -->
        <scroll-view scroll-x="true" class="tab-scroll" :scroll-into-view="tabScrollIntoView" :scroll-with-animation="false">
          <view class="tab-list" :class="{ 'tab-list-auto': bottomTab === 'setting' }">
            <view v-for="index in allTabIndexes" :key="index"
              :id="'tab-' + index"
              class="tab-item"
              :class="{ active: currentTab === index, 'tab-hidden': currentTabGroup.indexOf(index) === -1, 'tab-monitor': bottomTab === 'monitor', 'tab-setting': bottomTab === 'setting' }"
              @touchstart="premountPanel(index)"
              @tap="switchTab(index)">
              <text>{{ getTabTitle(index) }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

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
      <!-- ⚡ APP 端卡顿根治：只挂载当前 tab 的面板。
           旧实现把 7 个面板全部常驻 DOM（含 367 项设置参数），合计几千个 vnode。
           Vue 每次 render 都要重建 + diff 整棵树 —— 所以不只是切 tab，
           点任意按钮、收任意一帧数据都卡 1 秒。数据体积再小也救不了节点规模。
           APP 端是标准 webview，v-if 的 DOM 增删同步完成，不存在小程序
           原生 scroll-view 那种 frame 滞后一帧的残影；页面级滚动下也不会闪白。
           数据本体在非响应式仓库里，新面板挂载瞬间即可读到，无需回显等待。 -->
      <view class="content-area">
        <view class="module-scroll">

        <!-- ⚡ 面板缓存：v-if 只负责「是否已挂载」，panel-hidden class 负责「是否可见」。
             之前每次切 tab 都把旧面板整棵销毁、新面板整棵重建：几百个 vnode +
             DOM 节点 + 架构图重解码 + 一次整页 reflow，来回切就反复付这份成本。
             现在首屏只挂概览，其余由空闲预热提前建好（display:none，不参与布局），
             之后切 tab 只是 display 切换。数据通知由 rtKey 只发给可见面板，
             隐藏面板常驻也不会被每 1.5s 的收帧叫醒。 -->
        <!-- 概览标签页 -->
        <view v-if="panelMounted(0)" class="panel-slot" :class="{ 'panel-hidden': currentTab !== 0 }">
          <view class="content">
            <OverviewTab rt-key="overview" :systemRunning="systemRunningStable" @start-stop="onSystemStartStop" />
          </view>
        </view>

        <!-- PCS标签页 -->
        <view v-if="panelMounted(1)" class="panel-slot" :class="{ 'panel-hidden': currentTab !== 1 }">
          <view class="content">
            <PcsTab rt-key="pcs" :is50KwMode="is50KwMode" />
          </view>
        </view>

        <!-- 储能DC标签页 -->
        <view v-if="panelMounted(2)" class="panel-slot" :class="{ 'panel-hidden': currentTab !== 2 }">
          <view class="content">
            <StorageDcTab rt-key="storage" :is50KwMode="is50KwMode" />
          </view>
        </view>

        <!-- 光伏标签页 -->
        <view v-if="panelMounted(3)" class="panel-slot" :class="{ 'panel-hidden': currentTab !== 3 }">
          <view class="content">
            <PvTab rt-key="pv" :is50KwMode="is50KwMode" />
          </view>
        </view>

        <!-- BMS标签页 -->
        <view v-if="panelMounted(4)" class="panel-slot" :class="{ 'panel-hidden': currentTab !== 4 }">
          <view class="content">
            <BmsTab
              rt-key="bms"
              :is50KwMode="is50KwMode"
            />
          </view>
        </view>

        <!-- 液冷机监测标签页 -->
        <view v-if="panelMounted(10)" class="panel-slot" :class="{ 'panel-hidden': currentTab !== 10 }">
          <view class="content">
            <LiquidCoolingTab rt-key="liquid" :is50KwMode="is50KwMode" />
          </view>
        </view>

        <!-- 设置标签页：6 个设置 tab 共用同一个 SettingsPanel 实例（只换 tabCfg）。 -->
        <view v-if="settingsPanelReady" class="panel-slot" :class="{ 'panel-hidden': !isSettingsTabActive }">
          <view class="content">
            <SettingsPanel
              v-if="hasAccessCode"
              :active="isSettingsTabActive"
              :tabCfg="settingsTabCfg"
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
            <view v-else class="settings-placeholder">
              <view class="settings-placeholder-icon">
                <uni-icons type="locked" size="28" color="#c3cad4"></uni-icons>
              </view>
              <text class="settings-placeholder-text">尚未输入操作码</text>
              <text class="settings-placeholder-sub">请返回配置页填写操作码后重试</text>
            </view>
          </view>
        </view>
        <!-- 未挂载的当前面板：先用骨架屏顶住，真正挂载在下帧完成（移出点击帧） -->
        <view v-if="!currentPanelMounted" class="panel-skeleton">
          <view class="sk-spinner"></view>
          <text class="sk-text">加载中…</text>
        </view>
        </view><!-- module-scroll：普通 view，页面级滚动 -->
      </view>
    </view>

    <!-- 底部主导航 tab：fixed 吸底（页面滚动时固定在视口底部） -->
    <view v-if="config.enabled" class="bottom-tabbar">
      <view class="bottom-tab-item bottom-tab-monitor"
        :class="{ active: bottomTab === 'monitor' }"
        @tap="switchBottomTab('monitor')">
        <view class="bottom-tab-icon">
          <uni-icons type="list" size="24" :color="bottomTab === 'monitor' ? '#2f7cf6' : '#b0b6c0'"></uni-icons>
        </view>
        <text class="bottom-tab-label">监测</text>
      </view>
      <view class="bottom-tab-item bottom-tab-setting"
        :class="{ active: bottomTab === 'setting' }"
        @tap="switchBottomTab('setting')">
        <view class="bottom-tab-icon">
          <uni-icons type="gear" size="24" :color="bottomTab === 'setting' ? '#2f7cf6' : '#b0b6c0'"></uni-icons>
        </view>
        <text class="bottom-tab-label">设置</text>
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

    <!-- 设备 WiFi 连接提示（纯提示，单按钮；样式与设置确认弹窗一致） -->
    <ConfirmDialog
      :visible="wifiTipVisible"
      :title="wifiTipTitle"
      :content="wifiTipContent"
      :show-cancel="false"
      confirm-text="知道了"
      @cancel="onWifiTipOk"
      @confirm="onWifiTipOk"
    />

    <!-- 操作反馈 Toast -->
    <OpToast :visible="showOpToast" :text="opToast" />

    <!-- APP 正式包内查看运行日志。v-if 默认 false，不产生任何节点，
         因此不会干扰切 tab 的性能测量；长按顶部区域打开。
         缓冲区同时收 [perf] 性能日志与 [连接]/[权限]/[WiFi]/[网络] 运行日志。 -->
    <view v-if="showPerfLog" class="perf-log-mask" @tap="closePerfLog">
      <view class="perf-log-card" @tap.stop>
        <view class="perf-log-head">
          <text class="perf-log-title">运行日志（{{ perfLogLines.length }} 条）</text>
          <view class="perf-log-actions">
            <text class="perf-log-btn" @tap.stop="refreshPerfLog">刷新</text>
            <text class="perf-log-btn" @tap.stop="toggleLogFilter">{{ logFilter === 'all' ? '只看连接' : '看全部' }}</text>
            <text class="perf-log-btn" @tap.stop="copyPerfLog">复制</text>
            <text class="perf-log-btn" @tap.stop="clearPerfLogView">清空</text>
            <text class="perf-log-btn" @tap.stop="openPermissionFromLog">权限设置</text>
            <text class="perf-log-btn perf-log-close" @tap.stop="closePerfLog">关闭</text>
          </view>
        </view>
        <scroll-view scroll-y class="perf-log-body">
          <view v-if="!perfLogLines.length" class="perf-log-empty">
            <text class="perf-log-text">暂无日志：进入本页连接设备后点「刷新」</text>
          </view>
          <view v-for="(line, i) in perfLogLines" :key="i" class="perf-log-line">
            <text class="perf-log-text" :selectable="true">{{ line }}</text>
          </view>
        </scroll-view>
        <text class="perf-log-tip">最新在最上 · 复制始终导出全部 · 测耗时请先关闭本面板</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'
import { MqttDirectClient } from '@/service/socket/mqtt-client.js'
// 仅用于 [perf] 面板显示 APP(Android) TCP 读取循环的桥调用计数，以及按实测档位调屏刷频率；
// 都是普通对象 / 纯函数，非响应式、不进 render；小程序端档位恒为 0，行为不变
import { tcpReadStats, getTcpPerfTier } from '@/service/socket/uniapp-tcp-adapter.js'
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
// 设置参数仓库：非响应式，避免每轮 patch 把几百项参数树深拷贝一遍
import { paramStore, PARAM_KEYS, resetParamStore, setParamList, notifyParamChange } from './components/direct-device/param-store.js'
// 实时数据仓库：非响应式，寄存器快照 / 格式化值不再进 Vue data 与 props
import * as rtStore from './components/direct-device/realtime-store.js'
import ConfirmDialog from './components/direct-device/ConfirmDialog.vue'
import OpToast from './components/direct-device/OpToast.vue'
import OverviewTab from './components/direct-device/tabs/OverviewTab.vue'
import PcsTab from './components/direct-device/tabs/PcsTab.vue'
import StorageDcTab from './components/direct-device/tabs/StorageDcTab.vue'
import PvTab from './components/direct-device/tabs/PvTab.vue'
import BmsTab from './components/direct-device/tabs/BmsTab.vue'
import LiquidCoolingTab from './components/direct-device/tabs/LiquidCoolingTab.vue'
// APP 正式包没有调试控制台，[perf] 日志同时留一份在内存里，页面内长按可看
import { perfLog, getPerfLogs, clearPerfLogs } from './components/direct-device/perf-log.js'
// 设备热点检测：连设备前先确认手机在 GCNZ 热点上，未连上可自动重连 / 引导
import {
  ensureDeviceWifi,
  describeDeviceWifi,
  getSavedWifi,
  connectWifi,
  openWifiSettings
} from '@/utils/device-wifi.js'
// 运行时权限自检 / 主动申请 / 引导去系统设置（卸载重装后「附近的设备」会被重置）
import {
  ensureDevicePermissions,
  getLastPermissionResult,
  showPermissionGuide,
  openPermissionSettings
} from '@/utils/device-permission.js'

/**
 * 每个监测 tab 的子组件实际会读的 bucket（逐个核对过各 tab 的模板 / computed）。
 * 只把这些桶放进 activeRv 快照：以前把整个 rawValues（15 个桶、几千个键）
 * 作为 props 传给每个 tab，小程序端每一轮 setData 都要带上它。
 */
const TAB_BUCKETS = {
  0: [],                                  // 概览只读 formattedValues
  1: ['1707', '171B'],                    // PCS
  2: ['170C_STORAGE', '171D'],            // 储能 DC
  3: ['170C_PV', '171E'],                 // 光伏
  4: ['171C_V2', '131C', '171C'],         // BMS
  10: ['0318']                            // 液冷机
}

/**
 * 两组标签的固定全集（监测 0~4/10 + 设置 5~9/11）。
 * 不依赖协议模板或操作码：页面生命周期内标签节点数恒定，
 * 收帧后 is50KwMode 翻转也不会让整条标签栏增删节点。
 */
const ALL_TAB_INDEXES = [0, 1, 2, 3, 4, 10, 5, 6, 7, 8, 9, 11]

/** 监测组 tab；其余（5~9 / 11）全是设置组，共用同一个 SettingsPanel 实例 */
const MONITOR_TAB_IDS = [0, 1, 2, 3, 4, 10]

/**
 * 设置组全部编辑态开关（两套协议的 tabCfg 汇总去重）。
 * 切 tab 时统一复位：右上角按钮回到初始的「修改」，避免编辑态跨 tab 残留。
 */
const SETTINGS_EDIT_KEYS = (() => {
  const seen = {}
  const out = []
  ;(SETTINGS_TABS || []).concat(SETTINGS_TABS_50KW || []).forEach(t => {
    const k = t && t.editKey
    if (k && !seen[k]) { seen[k] = 1; out.push(k) }
  })
  return out
})()

/**
 * 控制应答提示的有效窗口（ms）。
 * 「指令已生效」只能对应一次真实下发：设备会在控制 topic 上周期性回读控制寄存器，
 * 订阅时也可能推 retained 帧，这些 0x16 帧没有下发动作，旧实现无条件弹 toast，
 * 表现为「没下发指令，也会报指令已生效」。
 */
const CONTROL_ACK_WINDOW_MS = 8000

/**
 * 设置组可见时的「参数回显心跳」间隔（ms）。
 * 回显不能只靠「帧提交且值有变化」或「点修改」触发：设备稳态上报 / 重复帧被短路 /
 * 切 tab 时恰好没有待执行定时器，都会让只读态一直停在初始 '--'。
 * 1s 与设置页的显示提交间隔（_displayCommitMs = 900ms）对齐；
 * _syncSettingsCore 内有原始值快照快路径，稳态下不写值、不通知渲染。
 */
const SETTINGS_ECHO_INTERVAL_MS = 1000

/**
 * 设置项下发成功后的「乐观显示」窗口（ms）。
 * 「当前 xxx」和分段按钮高亮本来读的是设备实时回读值，而回显心跳 1s 一次：
 * 直接写 currentValue 会在下一拍被设备的旧值刷回去，看起来像「点了没反应」。
 * 这里改成独立的显示层：下发后 3s 内显示刚下发的值，实时值仍由回显帧在后台
 * 持续维护；3s 到期直接回落到最新实时值（设备已回读就是新值，没回读就是旧值）。
 */
const SETTINGS_OPTIMISTIC_MS = 3000

/**
 * 乐观显示读取器必须放在模块级、且不能依赖 this：
 * getParamCurrentValue/Label/Text 会作为 props 函数传给 SettingsPanel，
 * 小程序端调用时 this 指向的是子组件实例（不是本页面），写成 this._displayXxx()
 * 会直接报「this._displayLabel is not a function」。勿挪回 methods。
 */
function isParamOptimistic(p) {
  return !!(p && p._optUntil && Date.now() < p._optUntil)
}
function paramDisplayValue(p) {
  if (!p) return undefined
  return isParamOptimistic(p) ? p._optValue : p.currentValue
}
function paramDisplayLabel(p) {
  if (!p) return '--'
  return isParamOptimistic(p) ? (p._optLabel || '--') : (p.currentLabel || '--')
}
function paramDisplayText(p) {
  if (!p) return '--'
  return isParamOptimistic(p) ? (p._optText || '--') : (p.currentText || '--')
}

/** tab → 面板 rtKey：realtime-store 按这个 key 只通知当前可见的面板 */
const PANEL_RT_KEYS = {
  0: 'overview',
  1: 'pcs',
  2: 'storage',
  3: 'pv',
  4: 'bms',
  10: 'liquid'
}
const SETTINGS_PANEL_KEY = 'settings'

/**
 * 面板缓存上限 / 空闲预热队列（APP 与小程序统一：7 块全缓存 + 全预热）。
 *
 * 真机日志的结论：切 tab 耗时 100% 落在 Vue 的 render/patch 段，准备段恒为 0；
 * 设置组内部切换时 v-show 对任何面板都不变化（零 display 翻转）仍出现 679ms；
 * 数据提交平均 0.0ms；同一操作重复执行耗时差 1000 倍；连「纯字符串赋值的
 * 横向标签定位帧」都会偶发 893ms。排除 reflow / 数据链路 / 重建成本后，
 * 唯一符合的是 APP webview 的 V8 major GC（stop-the-world）随机冻结主线程。
 *
 * 曾尝试 LRU=3（只留最近 3 块）削减常驻堆，第 9 轮日志已证伪：冻结毫无改善，
 * 反而因频繁淘汰制造大量「缓存=否 → 首次挂载」（实测 200~1304ms）。
 * 因此 APP 回退并与已验证流畅的小程序路径对齐：进页面后空闲帧把 7 块全建好，
 * 切 tab 永远命中缓存，永不再有首次挂载。_touchPanel / _trimPanelCache 保留但
 * 在 7/7 时不会淘汰任何面板。
 * 真正的处置改在 GC 燃料侧：APP_SKIP_DUPLICATE_FRAMES 短路重复的 MQTT 帧，
 * 配合 parser 零拷贝与去调试中间对象，减少每帧的短命对象分配。
 *
 * A/B：改 3 可复现已被证伪的 LRU 行为（仅诊断用，勿用于发布）；改 1 为极限对比。
 */
const PANEL_CACHE_LIMIT = 7
const WARMUP_QUEUE = [1, 2, 3, 4, 10, SETTINGS_PANEL_KEY]

/**
 * APP 端诊断开关（只影响 APP，小程序不受影响）。
 * 置 true 可完全关闭横向标签的自动定位：若关掉后 APP 切 tab 立刻流畅，
 * 即可确认瓶颈在 uni-app APP 端 scroll-view 的 scroll-into-view 实现，
 * 下一步把它换成 scroll-left 数值驱动即可。确认后请改回 false。
 */
const APP_DISABLE_TAB_SCROLL_INTO = false

/**
 * APP 端「重复帧短路」总开关（只影响 APP，小程序一行不走）。
 * 设备以 8~10 帧/s 反复上报同一组寄存器值，帧尾时间戳/CRC 变化但业务数据不变；
 * 每帧全量解析会产出几百个短命对象，是 V8 major GC（stop-the-world）的主要燃料，
 * 表现为「纯字符串赋值帧 893ms」「rAF 回调被推迟 1304ms」这类与业务无关的偶发冻结。
 * 置 false 立即回退到逐帧全量解析，用于 A/B 对比。
 */
const APP_SKIP_DUPLICATE_FRAMES = true

/**
 * APP 正式包内查看 [perf] 日志的总开关。
 * true：长按顶部标题栏/设备卡区域（约 0.35s）弹出日志面板，可刷新、复制、清空。
 * false：长按无响应（日志仍会进 console 与 adb logcat），页面零额外节点。
 * 面板 v-if 默认不渲染，打开它的时候不要测切换耗时（浮层本身会引起一次布局）。
 */
const ENABLE_IN_APP_PERF_LOG = true

/** 50kW 新协议桶：协议判定结果需要同步到响应式标量 has50KwMode */
const KW50_BUCKETS = [
  '1707', '170C_STORAGE', '170C_PV', '171C_V2',
  '171C_V2_1', '171C_V2_2', '171C_V2_3', '171C_V2_4'
]

/** 寄存器仓库的完整 bucket 集合（20kW 旧协议 + 50kW 新协议） */
const RAW_BUCKET_KEYS = [
  '171B', '171C', '171D', '171E', '171F',
  '1707', '170C_STORAGE', '170C_PV', '171C_V2',
  '171C_V2_1', '171C_V2_2', '171C_V2_3', '171C_V2_4',
  '0318', '131C'
]

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
      // 已挂载的面板 key（数字 = 监测 tab，'settings' = 设置面板）。
      // 首屏只有概览；其余由 _startPanelWarmup 在空闲帧陆续建好，
      // 之后切 tab 只是 v-show 的 display 切换，不再创建/销毁任何节点。
      mountedTabs: [0],
      // APP 专用：横向标签的定位目标。小程序直接用 'tab-' + currentTab；
      // APP 的 scroll-view 是 JS 组件，prop 一变就遍历子节点读 offsetLeft，
      // 会把整页同步布局压在切换帧上，所以这里推迟一帧再更新。
      tabScrollTarget: 'tab-0',
      // APP 内运行日志面板：默认不渲染，只有长按顶部区域打开时才填内容
      // 缓冲区同时收 [perf] 性能日志与 [连接]/[权限]/[WiFi]/[网络] 运行日志
      showPerfLog: false,
      perfLogLines: [],
      logFilter: 'all',
      config: {
        enabled: false,
        protocol: 'mqtt',
        deviceType: '50kW',
        deviceName: '',
        ip: '', port: '1883',
        brokerUrl: '', username: '', password: '',
        accessCode: '',
        realtimeTopic: 'neiic/microEnergyStation001',
        controlSetTopic: 'neiic/microEnergyStationCtl002',
        controlRespTopic: 'neiic/microEnergyStationCtl002'
      },
      // MQTT 客户端不进 data：它是含 socket / 定时器 / 回调的复杂对象，
      // 放进响应式 data 会被 Vue 深度 observe，并在每轮 patch 里参与遍历。
      // 改由 beforeCreate 的不可枚举 getter/setter 转发到普通实例属性。
      connecting: false,
      connected: false,
      errorMsg: '',
      // 未连上设备热点而被拦下时置位，设备卡状态直接显示「未连接设备 WiFi」。
      // 只在状态翻转时写一次，不参与收帧渲染。
      wifiBlocked: false,
      // 「更新」时间戳不再放页面 data：它由 DeviceCard 订阅 realtime-store 的帧时钟，
      // 每秒只改设备卡里的一个文本节点，父页面不参与（否则每秒一次整页 render）。
      // deviceTypes 是模块常量的副本，模板没用到，不必进响应式 data 每轮被遍历
      // ⚡ 实时数据全部**不放在 data 里**：15 个寄存器桶 + 格式化值 + 当前 tab 快照
      //    合计几千个字段，只要进了 Vue data，小程序每次 patch 的 cloneWithData
      //    都要整体深拷贝 + diff 一遍。现在统一放 realtime-store.js（普通对象），
      //    页面内部靠 storeVer 触发非渲染类 computed；可见面板自己订阅仓库刷新，
      //    父页面不再因每 1.5s 一次的数据提交而整页 render。
      storeVer: 0,
      // 50kW 协议判定结果（标量）：由收帧路径设置一次，替代 is50KwMode 里
      // 直接读 rawValues —— 否则父模板会经由它依赖 storeVer，每帧提交都拖整页 render。
      has50KwMode: false,
      // 设置面板回显不再走本页 data：参数值变化由 param-store 的通知直接推给
      // SettingsPanel（见 notifyParamChange），父页面不陪着整页 render。
      // ⚡ 面板挂载一次后缓存（v-if 只判是否挂载，panel-hidden class 判是否可见）。
      //    早期 7 个面板常驻且带大对象 props，每帧全量 diff；后来改成 v-if
      //    按需挂载，切 tab 又要反复创建几百个 DOM 节点。现在两者取长：
      //    空闲预热建好节点、隐藏时不参与布局、数据通知只发给可见面板。
      //    滚动位置只记在实例属性 _panelScrollY，不进 data。
      lastSettingsTabCfg: null,
      // 显示用结构（由 updateDisplay 同步重建）
      displayItems: [],
      // 分组显示结构（由 updateDisplay 同步重建，避免 computed 全量重建）
      groupedDisplay: [],
      platformClass: '',
      // 常量提到 data：模板里内联对象字面量每次 patch 都新建引用，
      // 会让 DyNavbar 误判 props 变化而整块重渲染（导航在吸顶头里，代价高）
      navbarTitleStyle: { color: '#17202e', width: '100%' },
      showDeviceMeta: false,
      archRefreshTimer: null,
      // 运行状态防抖后的展示值：单帧毛刺不直接改文案，避免按钮「运行中 / 启动」闪跳
      systemRunningStable: false,
      archRunningTimer: null,
      // ============ 设置面板状态 ============
      // 13 个参数数组不放在这里：见 beforeCreate 的不可枚举 getter → paramStore。
      // 编辑开关等标量仍需响应式，保留在 data。
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
      // 设备 WiFi 连接提示弹窗（齿轮入口，小程序 / H5 端）
      wifiTipVisible: false,
      wifiTipTitle: '',
      wifiTipContent: '',
      // 操作反馈 Toast
      opToast: '',
      showOpToast: false,
      // PV 设置
      isEditingPv: false,
      // Storage 设置
      isEditingStorage: false,
      // Quick Control
      isEditingQuickControl: false,
      // 液冷机（0318 V2.3）
      isEditingLiquid: false,
      // 缓存当前已初始化的协议模板（'20kw'/'50kw'），避免每次 MQTT 帧都整体重建参数数组
      settingsProtocol: '',
    }
  },
  computed: {
    ...mapState({
      // 不再订阅 fontColor：导航栏标题改用固定深色，主题切换时不必让本页整棵树重新求值
      currentSelectDevice: state => state.currentSelectDevice
    }),
    connectionState() {
      if (this.connecting) return 'connecting'
      return this.connected ? 'online' : 'offline'
    },
    statusText() {
      // 没连设备热点时不该只显示「离线」——用户会以为是设备故障
      if (this.wifiBlocked && !this.connected) return '未连接设备 WiFi'
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
    /**
     * 两组标签的并集，静态渲染一次。
     * 以前 v-for 直接绑 currentTabGroup，跨「监测/设置」切换时整批 tab 节点
     * 在同一帧被销毁重建，scroll-into-view 的目标 id 在那一帧并不存在，
     * 微信渲染层会先画一块空轨道 —— 就是「点按钮闪一下白」。
     * 它只依赖协议模板与操作码，不依赖 bottomTab / currentTab，切换时引用恒定。
     */
    allTabIndexes() {
      // 返回模块级常量：引用恒定，v-for 永远不做节点增删
      return ALL_TAB_INDEXES
    },
    /**
     * 横向标签栏的定位目标。
     * 小程序：scroll-view 是原生组件，scroll-into-view 由渲染层处理，零成本，
     *         保持「每次切 tab 都定位」的原行为（已实测不卡，不动它）。
     * APP：scroll-view 是 JS 组件，scroll-into-view 变化会在 updated 里遍历
     *      12 个子节点读 offsetLeft / clientWidth，强制一次整页同步布局；
     *      这正好压在切换帧上，是「只有 APP 切 tab 卡」的主因之一。
     *      APP 改用 tabScrollTarget，由 _syncTabScrollTarget() 推迟到切换帧
     *      绘制完成后再更新，功能完全不变（定位晚一帧，肉眼无感）。
     */
    tabScrollIntoView() {
      // #ifdef APP-PLUS
      return APP_DISABLE_TAB_SCROLL_INTO ? '' : this.tabScrollTarget
      // #endif
      // #ifndef APP-PLUS
      return 'tab-' + this.currentTab
      // #endif
    },
    hasAccessCode() {
      return !!(this.config && this.config.accessCode === '123456')
    },
    /** 50kW 大容量站判定：配置 deviceType 或 MQTT 有新协议 bucket 即认为是 50kW */
    is50KwMode() {
      if (this.config && this.config.deviceType === '50kW') return true
      // 只读标量：绝不能在这里读响应式 rawValues getter（它依赖 storeVer），
      // 否则父模板经由本 computed 建立对 storeVer 的依赖，每次收帧提交都会
      // 重建 navbar / 设备卡 / 标签栏 / 底部栏的全部 vnode。
      // 协议识别由 _use50KwProtocol() 在收帧路径里完成，命中后置此标量。
      return this.has50KwMode
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
      // 首屏就给一个有效配置，让设置面板与 6 个监测面板一起静态常驻。
      // 否则首次点「设置」才在切换帧里创建整块面板，空白又回来了。
      return this.currentSettingsTab || this.lastSettingsTabCfg || this.settingsTabs[0] || null
    },
    /** 当前是否处于设置组（6 个设置 tab 共享一块 SettingsPanel） */
    isSettingsTabActive() {
      return MONITOR_TAB_IDS.indexOf(this.currentTab) === -1 && !!this.settingsTabCfg
    },
    /** 设置面板是否已预热/访问过 */
    settingsPanelReady() {
      return this.mountedTabs.indexOf(SETTINGS_PANEL_KEY) !== -1
    },
    /** 当前 tab 对应的面板此刻是否已经挂载（未挂载→显示骨架屏） */
    currentPanelMounted() {
      if (this.isSettingsTabActive) return this.settingsPanelReady
      return this.panelMounted(this.currentTab)
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
    /** 设备卡片副标题：按用户要求不再显示任何副标题（含兜底「设备监测」）。
     *  返回空串，DeviceCard 用 v-if="deviceSubtitle" 整行不渲染，卡片头部不留空白。 */
    currentDeviceSubtitle() {
      return ''
    },
    /** 液冷机监测 tab 数据由 LiquidCoolingTab 直接读 rawValues['0318']（0318 V2.3 字段表驱动） */
    currentDeviceName() {
      const name = (this.config.deviceName || '').trim()
      // 正式产品名自 V1.0.19 起是「能源站」（manifest.json / 隐私政策 / 用户协议一致）。
      // 旧默认值写成「IEMS 微能量站」多了一个「量」字；旧版本还存过「微能站」，
      // 两者都在升级后纠正为新名称，用户自定义名称原样保留。
      if (!name || name === 'IEMS 微能量站' || name === '微能量站' || name === '微能站') return '能源站'
      return name
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
  /**
   * 只用于分段计时：Vue 在 DOM patch 完成后同步回调，正好是
   * 「render + vnode diff + dom 操作（含 v-show 的 display 翻转）」的分界点。
   * 不读写任何布局属性，不触发额外 reflow。
   */
  updated() {
    if (this._swT0 && !this._swPatched) this._swPatched = Date.now()
  },
  watch: {
    /**
     * 切 tab 只做三件事：复位编辑态（纯标量写入） + 换当前面板的数据快照 + 把重活排到切换帧之后。
     * 以前这里同步做 LRU 淘汰、骨架挂载、强制 flush、两阶段挂载、参数回显，
     * 再叠加 48 / 50 / 80 / 90 / 250 / 1500ms 六个定时器 —— 一次点击会产生
     * 8 次以上跨 1.5 秒的 setData，任何一帧渲染层没画完就是空白或残影。
     */
    currentTab() {
      // 兜底：正常路径已在 switchTab 里同步复位编辑态（右上角「✓ 完成」回到初始「修改」）。
      // 编辑态按 editKey 分 tab 存放，不清会一直挂着，切回来仍显示「完成」，
      // 且可能在用户以为只读的状态下允许下发。此处已复位时为零写入。
      this._resetEditingOnTabChange()
      const tab = this.currentTab
      const cfg = this.currentSettingsTab
      if (cfg) this.lastSettingsTabCfg = cfg
      // 兜底：正常路径已在 switchTab 里设好，这里覆盖其它赋值入口
      rtStore.setActiveKey(this._rtKeyOf(this._panelKey(tab)))
      // 静默重建当前 tab 的显示值。以前放在 $nextTick 且会 notify，等于
      // 新面板刚画完又被叫起来重渲染一次（「点一下卡两下」）。silent 只写
      // 仓库：新面板首帧 render 直接读到最新值，不产生额外一次 patch。
      if (!cfg) {
        if (this.is50KwMode) {
          if (tab === 0) this.rebuildFormattedValues(['171F'], true)
        } else {
          const dt = this.currentDeviceType
          this.rebuildFormattedValues(dt && dt !== '171F' ? [dt, '171F'] : ['171F'], true)
        }
      }
      // 换当前面板的桶快照（新面板挂载瞬间就要读它）
      this._rebuildActiveRv()
      // 收尾重活排到「宏任务」而不是 $nextTick：$nextTick 与切换帧同属
      // 一批 microtask，在展示日志回调附近就会执行；这里任何一次响应式写入
      // （displayItems / groupedDisplay 清空、参数模板兜底构建）都可能再排
      // 一轮 render。挪到 setTimeout(0) 后，切换帧只剩 display 翻转这一件事。
      setTimeout(() => {
        if (this._unloaded || this.currentTab !== tab) return // 快速连切：只让最后一次生效
        if (cfg && !this._settingsParamsReady) {
          // 参数模板正常已在 onLoad 的空闲帧预热，这里只是兜底
          this._settingsParamsReady = true
          this.initSettingsParams()
        }
        // displayItems / groupedDisplay 是早期遗留结构，模板不读，只做清空
        if (this.displayItems.length) {
          this.displayItems = []
          this.groupedDisplay = []
        }
      }, 0)
      // 设置组可见期间开回显心跳，切回监测组立即停（监测页零额外开销）
      if (cfg) this._startSettingsEchoLoop()
      else this._stopSettingsEchoLoop()
      // 参数回显排到用户已看到新面板之后，只排一次
      this._schedulePostSwitch()
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
  beforeCreate() {
    // MQTT 客户端：普通实例属性 + 不可枚举转发，业务代码 this.client 读写不变，
    // 但不会进 Vue 的 observe，也不会出现在每轮 patch 的数据快照里。
    this._mqttClient = null
    Object.defineProperty(this, 'client', {
      configurable: true,
      enumerable: false,
      get() { return this._mqttClient },
      set(v) { this._mqttClient = v }
    })
    /**
     * rawValues 既不能放 data、也不能放 computed：
     * uni-app 小程序运行时的 cloneWithData() 会把 vm._data 和
     * vm._computedWatchers 的**每一个键**深拷贝后再逐键 diff，
     * 放哪儿都会让几千个寄存器键每轮 patch 都过一遍逻辑层（真正的卡顿源）。
     * 这里用实例上的不可枚举 getter：业务代码 `this.rawValues[...]` 照常可用，
     * 运行时收集数据时完全看不到它。
     * getter 里读一下 storeVer，让依赖它的 computed 在提交后照常失效重算。
     *
     * 必须放在 beforeCreate：uni-app 的 onLoad 可能早于 created，
     * 那时 resetRawValues / rebuildFormattedValues 就要读 rawValues 了。
     */
    this._rawStore = rtStore.getAllBuckets()
    for (let i = 0; i < RAW_BUCKET_KEYS.length; i++) {
      if (!this._rawStore[RAW_BUCKET_KEYS[i]]) {
        this._rawStore[RAW_BUCKET_KEYS[i]] = Object.freeze({})
      }
    }
    Object.defineProperty(this, 'rawValues', {
      configurable: true,
      enumerable: false,
      get() {
        void this.storeVer
        return this._rawStore || {}
      }
    })

    /**
     * 快照与格式化值同样走不可枚举 getter：
     * 页面业务代码 `this.formattedValues[...]` / `this.activeRv` 一行不改，
     * 但 cloneWithData 看不到它们。面板组件改由 realtime-store 订阅通知刷新，
     * 父模板不再读这些 getter；getter 里保留一次 storeVer 读取，
     * 是为了让页面内部那些非渲染类 computed 在提交后照常失效重算。
     */
    Object.defineProperty(this, 'activeRv', {
      configurable: true,
      enumerable: false,
      get() {
        void this.storeVer
        return rtStore.getSnapshot()
      }
    })
    Object.defineProperty(this, 'formattedValues', {
      configurable: true,
      enumerable: false,
      get() {
        void this.storeVer
        return rtStore.getFormatted()
      }
    })
    Object.defineProperty(this, '_fmtVer', {
      configurable: true,
      enumerable: false,
      get() {
        void this.storeVer
        return rtStore.getFmtVer()
      }
    })
    Object.defineProperty(this, '_snapVer', {
      configurable: true,
      enumerable: false,
      get() {
        void this.storeVer
        return rtStore.getSnapVer()
      }
    })

    /**
     * 13 个设置参数数组同样用不可枚举 getter 指向非响应式 paramStore。
     * 这样 `this.bmsNumericParams` / `this[cfg.dataKey]` 等既有读写代码一行不用改，
     * 但 vm._data / vm._computedWatchers 里再没有这几棵树 —— cloneWithData 每轮
     * patch 不再深拷贝几百项参数。回显变化由 param-store 直接通知 SettingsPanel。
     */
    for (let i = 0; i < PARAM_KEYS.length; i++) {
      const key = PARAM_KEYS[i]
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: false,
        get() { return paramStore[key] },
        set(v) { setParamList(key, v) }
      })
    }
  },
  created() {
    // 冻结的空对象：喂给「后台标签页」当 props 用。
    // 引用恒定 + 不被 Vue 观测，后台面板的 computed 永远不会被逐帧失效，
    // 既不会因为每 800ms 一次落库而重渲染，也不会拖慢当前页。
    this._emptyRef = Object.freeze({})
    rtStore.setActiveKey('overview')
    this._rebuildActiveRv()
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === 'ios' ? 'ios-platform' : 'android-platform'
      }
    })
    this.loadConfig()
    // 参数模板在进页面后的空闲帧预热（不在切 tab 帧）。
    // 设置面板已静态常驻，但参数数组是空的；若等首次点「设置」才填充，
    // 那一帧会一口气创建几百个节点，表现仍是空白/残影。
    // 放到首屏画完 + 首帧数据到达之后，用户正在看概览，感知不到。
    this._settingsParamsReady = false
    this._paramsWarmTimer = setTimeout(() => {
      this._paramsWarmTimer = null
      if (this._settingsParamsReady) return
      this._settingsParamsReady = true
      this.initSettingsParams()
    }, 1500)
    // 直连模式下 rawValues 必须为空，所有数据只能来自 MQTT 帧；
    // 不要从 realtimeDataProvider（云端 WebSocket）同步数据——那是另一路数据源，
    // 会让页面在 MQTT 还没连上时就显示"假数据"
    this.resetRawValues()
    this.updateDisplay()
    // 50kW 只需要架构图那几个值（概览 tab 用），其它 tab 直接读 rawValues
    this.rebuildFormattedValues(this.is50KwMode ? ['171F'] : undefined)
    if (this.config.enabled) {
      // 连接前置检查统一走 _startEntryConnect：APP 端等首帧画完再启动，
      // 小程序保持原来的 nextTick。onLoad / onShow 都会调它，内部有去重，
      // 不再出现「两次检查并发、靠 _wifiChecking 锁兜底」。
      // 首屏只挂概览，其余面板在空闲帧里一个个建好，用户点到时只需切 display。
      this._startEntryConnect()
      this._startPanelWarmup()
      this._startDiagTicker()
    }
  },
  onUnload() {
    this._unloaded = true
    // 首帧后的连接任务还没跑就退页：必须撤掉，否则会在已销毁的页面上发起连接
    if (this._entryConnectTimer) {
      clearTimeout(this._entryConnectTimer)
      this._entryConnectTimer = null
    }
    this._entryConnectPending = false
    // 清掉本页刚弹的浮层：APP 端 toast 不随页面销毁，会残留到登录页
    this._clearOwnToast()
    this._stopSettingsEchoLoop()
    this._stopPanelWarmup()
    this._stopDiagTicker()
    if (this._tabScrollTimer) {
      clearTimeout(this._tabScrollTimer)
      this._tabScrollTimer = null
    }
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
    if (this._postSwitchTimer) {
      clearTimeout(this._postSwitchTimer)
      this._postSwitchTimer = null
    }
    if (this._paramsWarmTimer) {
      clearTimeout(this._paramsWarmTimer)
      this._paramsWarmTimer = null
    }
    if (this._permGuideTimer) {
      clearTimeout(this._permGuideTimer)
      this._permGuideTimer = null
    }
    if (this._connHintTimer) {
      clearTimeout(this._connHintTimer)
      this._connHintTimer = null
    }
    if (this._needEditTimer) {
      clearTimeout(this._needEditTimer)
      this._needEditTimer = null
    }
    if (this._premountTimer) {
      clearTimeout(this._premountTimer)
      this._premountTimer = null
    }
    // 清空非响应式参数仓库，避免下次进页面残留上一台设备的参数
    resetParamStore()
    this.stop()
  },
  onShow() {
    // 直连页禁用云端 WebSocket 数据同步——所有数据只能来自 MQTT 帧
    // MQTT 连接成功后会自动 subscribe 并在 applyIemsFrame 中填充 rawValues
    // 从后台返回：恢复收帧处理（onHide 里暂停过），并把暂停期间丢弃后的第一帧立即提交
    this._paused = false
    // 后台回来若仍停在设置组：恢复回显心跳并立刻刷新一次当前值
    if (this.currentSettingsTab) {
      this._startSettingsEchoLoop()
      this._doSyncSettingsFromRealtime()
    }
    // 预热已结束、但操作码是后来才填的：趁页面可见把设置面板补挂好，
    // 免得用户首次点「设置」时那一帧要现建几百项参数节点。
    if (this._warmDone && this.hasAccessCode && !this.settingsPanelReady) {
      this._touchPanel(SETTINGS_PANEL_KEY)
      this._mountPanelByKey(SETTINGS_PANEL_KEY)
    }

    // 息屏回来后 MQTT 连接可能已被系统断开，主动检查并重连
    // （LightMqttClient 有 autoReconnect，但微信息屏期间定时器会被挂起，
    //  回来时可能已经撞了 maxReconnectAttempts 上限停止重连）
    if (this.config.enabled) {
      // 之前因没连设备热点被拦下：从系统 WiFi 设置回来时静默重试，
      // 连上了就自动继续，不再重复弹同一个引导弹窗。
      const guide = !this._wifiBlocked
      if (!this.client) {
        // 首次进入（或自动重连还没建客户端）：走统一入口，APP 端等首帧画完
        this._startEntryConnect({ guide })
      } else if (!this.connected || !this.client.connected) {
        this.startWithWifiCheck({ guide })
      }
    }
  },
  /**
   * 页面级滚动位置：只记在实例属性上，不进 data（不产生 setData）。
   * 切 tab 时据此决定是否回顶，在顶部切 tab 时零原生属性变更。
   */
  onPageScroll(e) {
    this._panelScrollY = (e && e.scrollTop) || 0
  },
  onHide() {
    this.stopArchRefreshTimer()
    // 页面切走时立刻收起本页的浮层，避免出现在下一个页面上
    this._clearOwnToast()
    // 页面不可见时不再解析/合并/渲染：MQTT 连接保持不断（回来即用），
    // 但每帧解析 + 定时 flush + setData 在小程序里照样要过 JS/渲染桥，
    // 后台持续跑只会让返回页面那一下更卡。数据帧丢了无所谓，回来 1s 内就有新帧。
    this._paused = true
    this._stopSettingsEchoLoop()
    this._frameBatches = {}
    this._frameDirty = {}
    if (this._frameFlushTimer) {
      clearTimeout(this._frameFlushTimer)
      this._frameFlushTimer = null
    }
  },
  methods: {
    /** v-if：该监测面板是否已挂载（模板调用，依赖 mountedTabs） */
    panelMounted(index) {
      return this.mountedTabs.indexOf(index) !== -1
    },
    /** tab 序号 → 面板 key（设置组 6 个 tab 共用一个 key） */
    _panelKey(index) {
      return PANEL_RT_KEYS[index] ? index : SETTINGS_PANEL_KEY
    },
    /** 面板 key → realtime-store 的订阅 key */
    _rtKeyOf(key) {
      return key === SETTINGS_PANEL_KEY ? SETTINGS_PANEL_KEY : PANEL_RT_KEYS[key]
    },
    /** 挂载面板（幂等）；返回本次是否首次挂载 */
    _mountPanelByKey(key) {
      if (this.mountedTabs.indexOf(key) !== -1) return false
      this.mountedTabs.push(key)
      return true
    },
    /**
     * 记录 LRU 使用顺序。刻意放在普通实例属性而不是 data：
     * 调整顺序不该触发父页面 render（mountedTabs 的内容才决定 DOM）。
     */
    _touchPanel(key) {
      if (!this._lruOrder) this._lruOrder = []
      const i = this._lruOrder.indexOf(key)
      if (i !== -1) this._lruOrder.splice(i, 1)
      this._lruOrder.push(key)
    },
    /**
     * 淘汰最久未用的面板。只在切换帧之后的宏任务里调用：
     * 销毁组件本身会再触发一次 render，绝不能压在用户看到新面板的那一帧。
     * keepKey 是当前可见面板，任何情况下都不淘汰，避免出现白屏。
     */
    _trimPanelCache(keepKey) {
      const order = this._lruOrder || []
      let guard = 12
      while (this.mountedTabs.length > PANEL_CACHE_LIMIT && guard-- > 0) {
        let victim = null
        for (let i = 0; i < order.length; i++) {
          const k = order[i]
          if (k === keepKey) continue
          if (this.mountedTabs.indexOf(k) !== -1) { victim = k; break }
        }
        // 兜底：LRU 顺序里没记录到（例如 onShow 直接补挂的设置面板），
        // 就从已挂载列表里挑一个非当前面板淘汰，避免上限永远降不下来。
        if (victim === null) {
          for (let i = 0; i < this.mountedTabs.length; i++) {
            if (this.mountedTabs[i] !== keepKey) { victim = this.mountedTabs[i]; break }
          }
        }
        if (victim === null) break
        const j = this.mountedTabs.indexOf(victim)
        if (j !== -1) this.mountedTabs.splice(j, 1)
        const oi = order.indexOf(victim)
        if (oi !== -1) order.splice(oi, 1)
      }
    },
    /**
     * 手指按下时就把目标面板挂好（display:none，不参与布局）。
     * touchstart → tap 通常有 80~150ms，足够把几百个 vnode 的创建成本
     * 挪出切换帧；滑动标签栏时最多多挂一块，随后由 LRU 淘汰，代价可控。
     */
    premountPanel(index) {
      // 触摸即预挂载面板（display:none，不参与布局）。小程序与 APP 共用：
      // 触摸到点击通常有 80~150ms，足够把面板节点创建成本挪出切换帧，
      // 切换时只剩 v-show 翻转。APP 有 V8 GC 卡顿、预挂收益更大；小程序无 GC 问题，
      // 但同样能消除「首挂同步建几百节点」的瞬间开销，且让 switchTab 命中缓存只翻 v-show。
      if (index === this.currentTab) return
      if (this._premountTimer) clearTimeout(this._premountTimer)
      this._premountTimer = setTimeout(() => {
        this._premountTimer = null
        if (this._unloaded) return
        const key = this._panelKey(index)
        this._touchPanel(key)
        this._mountPanelByKey(key)
      }, 0)
    },
    /**
     * 空闲预热：首屏画完、MQTT 首帧到达后，逐个建好其余面板。
     * 预热时面板是 display:none，webview 只创建 DOM / vnode，不做布局与绘制，
     * 代价被摊到进页面后的几秒；等用户点 tab 时就只剩 display 切换。
     * 页面切到后台、或用户刚点过 tab 时自动顺延，不跟交互抢主线程。
     */
    _startPanelWarmup() {
      this._warmIndex = 0
      this._warmDone = false
      const step = () => {
        this._warmTimer = null
        if (this._unloaded || this._warmDone) return
        if (this._warmIndex >= WARMUP_QUEUE.length) {
          this._warmDone = true
          perfLog('面板预热完成，已缓存 ' + this.mountedTabs.length + ' 块')
          return
        }
        if (this._paused || Date.now() - (this._tabSwitchAt || 0) < 800) {
          this._warmTimer = setTimeout(step, 400)
          return
        }
        const key = WARMUP_QUEUE[this._warmIndex++]
        // 没操作码时设置区只显示占位提示，没必要预建几百项参数节点
        if (key !== SETTINGS_PANEL_KEY || this.hasAccessCode) {
          this._mountPanelByKey(key)
        }
        this._warmTimer = setTimeout(step, 350)
      }
      this._warmTimer = setTimeout(step, 2000)
    },
    _stopPanelWarmup() {
      if (this._warmTimer) {
        clearTimeout(this._warmTimer)
        this._warmTimer = null
      }
      this._warmDone = true
    },
    /**
     * 切换帧之后的一次性收尾：参数回显（不再强制提交暂存帧）。
     * 220ms 后用户已经看到新面板，这时再来一次 setData 不会造成可见的空白。
     * 连续快切只保留最后一次。
     */
    _schedulePostSwitch() {
      if (this._postSwitchTimer) clearTimeout(this._postSwitchTimer)
      this._postSwitchTimer = setTimeout(() => {
        this._postSwitchTimer = null
        // ⚡ 切 tab 不再强制 flush 暂存帧：800ms 的常规 flush 本来就在跑，
        //    这里再 flushPendingFramesNow() 等于切换帧刚画完 220ms 就追加一次
        //    整树提交 + 参数回显 —— 正是「点完 tab 过一秒又卡一下」的来源。
        //    新面板的数据在切换瞬间已由 _rebuildActiveRv() 从仓库读好，不依赖这次强制提交。
        if (!this.currentSettingsTab) return
        // 进入设置组（含设置组内部切子 tab）必须无条件回显一次：
        // 旧逻辑只在「恰好有等待中的节流定时器」时才同步，稳态下这个定时器
        // 通常不存在，于是只读态一整屏 '--'，直到用户点「修改」才看到当前值。
        // 同时收掉待执行的节流同步，避免 1s 后重复跑一遍。
        if (this._syncSettingsTimer) {
          clearTimeout(this._syncSettingsTimer)
          this._syncSettingsTimer = null
        }
        this._doSyncSettingsFromRealtime()
      }, 220)
    },
    /**
     * ⚡ 数据刷新不再经过父页面：模板不再向面板传 fmtVer / snapVer。
     *    每个面板通过 realtime-subscribe mixin 订阅仓库，数据变化时只递增
     *    自己内部的 rtVer，只有这一个面板重渲染；父页面的 navbar / 设备卡 /
     *    标签栏 / 底部栏不再被每 1.5s 一次的数据提交拖着重建 vnode。
     *    _fmtVer / _snapVer 仅保留作调试读取，不参与模板依赖收集。
     */
    /** 重建「当前可见面板」的数据快照：只含当前 tab 真正会读的 1~3 个桶 */
    _rebuildActiveRv() {
      const keys = TAB_BUCKETS[this.currentTab] || []
      const store = this._rawStore || {}
      const snap = {}
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i]
        if (snap[k] === undefined) snap[k] = store[k] || this._emptyRef
      }
      rtStore.setSnapshot(snap)
    },
    /**
     * 架构图启停按钮 handler — 下发策略运行指令
     * 对齐 architecture-diagram.vue handleStartStop / systemStartAddress 逻辑
     *
     * ⚠️ 必须按容量选择寄存器地址：
     *   - 20kW 旧协议站 → EMS 地址 112
     *   - 50kW 大容量站 → EMS 地址 343
     *   统一靠 is50KwMode 判定（收帧命中过新协议 bucket 或配置标记）
     */
    onSystemStartStop() {
      // MQTT 连接状态前置检测
      if (!this.client || !this.connected || !this.client.connected) {
        uni.showModal({ title: '提示', content: '设备连接中，请稍候', showCancel: false })
        return
      }
      const running = this.systemRunningStable
      const title = running ? '策略停止' : '策略启动'
      const content = running ? '确定要停止策略吗？' : '确定要启动策略吗？'
      uni.showModal({
        title,
        content,
        success: async (res) => {
          if (!res.confirm) return
          try {
            // 按容量选地址：50kW=343，20kW=112
            const regAddr = this.is50KwMode ? '343' : '112'
            this.client.setDeviceType('171F')
            await this.client.sendControl('B12', running ? 0 : 1, '171F', { registerAddress: regAddr })
            uni.showToast({ title: '指令已下发', icon: 'none' })
            // 下发后不立即更新按钮状态（乐观更新），等 MQTT 推送设备真实回传
            // 10s 兜底：主动触发一次状态刷新（防止设备响应超时未推）
            setTimeout(() => {
              // 直连模式下 MQTT 自动推送帧，按钮状态靠 rawValues['171F'].C_B12 变化驱动
              // 这里只打日志便于排查，不需要额外调用
            }, 10000)
          } catch (e) {
            console.error('[direct-device] onSystemStartStop error:', e)
            uni.showModal({ title: '下发失败', content: this.friendlyErrorText(e, '设备连接已断开，请重新连接后重试'), showCancel: false })
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
      // 清空/重连后页头「更新」回到 '--'，不许沿用上一个连接的时间
      rtStore.resetFrameTick()
      if (this._frameFlushTimer) {
        clearTimeout(this._frameFlushTimer)
        this._frameFlushTimer = null
      }
      // 原地清空非响应式仓库（冻结空桶），保持 _rawStore 与仓库同一引用
      const store = rtStore.getAllBuckets()
      const oldKeys = Object.keys(store)
      for (let i = 0; i < oldKeys.length; i++) delete store[oldKeys[i]]
      for (let i = 0; i < RAW_BUCKET_KEYS.length; i++) {
        store[RAW_BUCKET_KEYS[i]] = Object.freeze({})
      }
      this.storeVer++
      this._rebuildActiveRv()
      // 桶被清空 → 50kW 判定缓存失效，下次收帧重新识别协议
      this._has50KwData = false
      this.has50KwMode = false
      this._fieldRegCache = {}
      this._candCache = {}
      this._paramSeen = {}
    },
    updateDisplay() {
      // ⚡ 历史遗留：displayItems / groupedDisplay 是早期「寄存器 → 卡片」结构的产物。
      //    现在所有 tab 都走 formattedValues 或 activeRv 快照，模板与子组件
      //    没有任何一处读它们。构建出来只是 200 多项 × 8 字段的死数据，
      //    却被 uni-app 的 cloneWithData 每轮 patch 深拷贝 + 逐键 diff 一遍。
      //    这里只保证清空，不再重建；方法保留是为了不改动各处的调用点。
      if (this.displayItems.length) this.displayItems = []
      if (this.groupedDisplay.length) this.groupedDisplay = []
    },
    /** BMS V2 位字段打包：把同地址所有 bit 当前值合成一个整字节
     *  参考 community/settings BmsSettings.vue packHcByte 实现
     *  查找当前参数面板中 deviceType 相同、address 相同、bit !== null 的所有参数
     */
    _packBmsByte(param, optValue) {
      // 从非响应式 paramStore 找所有同 deviceType + 同 address 的参数
      const allLists = PARAM_KEYS.map(k => paramStore[k]).filter(Array.isArray)
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
    rebuildFormattedValues(deviceType, silent) {
      const ALL_BUCKETS = ['171B', '171C', '171D', '171E', '171F', '1707', '170C_STORAGE', '170C_PV', '171C_V2', '0318', '131C']
      // 需要 rebuild 的 bucket 列表：
      //   - 数组 → 原样；传单个 → 该 bucket + 171F（架构图）
      //   - 不传 → 所有可能的 bucket（20kW 旧码 + 50kW 新协议）
      let types
      if (Array.isArray(deviceType)) types = deviceType
      else if (deviceType) types = deviceType === '171F' ? ['171F'] : [deviceType, '171F']
      else types = ALL_BUCKETS
      // 只传 171F = 只有概览在用，走精简构建（只算 arch*，不摊 171F_B* 与 50kW 别名）
      const archOnly = types.length === 1 && types[0] === '171F'
      this._applyFormattedValues(this._buildFormattedValues(archOnly ? [] : types, archOnly), silent)
    },
    /** 纯计算：把若干 bucket 的原始值格式化成显示值（不做响应式赋值，供 flush 合并成一次赋值） */
    _buildFormattedValues(types, archOnly) {
      const newVals = {}
      // 概览 tab 只读 arch* 这 30 来个键。以前每轮都把 171F 桶 + 50kW 别名
      // 摊成上千个 `${dt}_B{n}` 键，这些键没有任何模板读，却每次提交都要 diff/序列化。
      // archOnly 时直接跳到下面的 arch* 计算。
      if (!archOnly) {
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
    /** 增量落值：只把变化的键写进非响应式仓库，并递增 fmtVer 推一次面板刷新 */
    _applyFormattedValues(newVals, silent) {
      return rtStore.patchFormatted(newVals, silent)
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
      if (index === this.currentTab) return
      const t0 = Date.now()
      // 分段打点：把「切换帧」拆成 准备 → render/patch → nextTick 回调 三段。
      // 慢帧若落在 patch 段，是整页 reflow；落在准备段，是 watcher/仓库的同步逻辑。
      this._swT0 = t0
      this._swPrepared = 0
      this._swPatched = 0
      // 两个时间差用来验证「偶发慢帧是否撞上空闲降频 / 数据提交」：
      // gap 是距上次切 tab，commitGap 是距上次 _commitStaged 提交。
      const gap = this._tabSwitchAt ? t0 - this._tabSwitchAt : -1
      const commitGap = this._lastCommitAt ? t0 - this._lastCommitAt : -1
      const key = this._panelKey(index)
      const rtKey = this._rtKeyOf(key)
      // ① 先切订阅目标，必须早于 currentTab watcher 的 _rebuildActiveRv()：
      //    旧面板不再收到本次快照通知（白 render 一次）；新面板若已缓存，
      //    在这里补一次刷新，把隐藏期间的数据变化带回来。
      rtStore.setActiveKey(rtKey)
      // ② 已缓存面板：本帧只翻 display（v-show），并刷新隐藏期间的数据。
      //    未挂载面板：把「挂载 + 创建几百个 DOM 节点」整体挪到下一帧（rAF），
      //    点击帧里只剩 tab 高亮 + sticky + 已缓存面板的 display 翻转，
      //    彻底消除 bms/liquid 那种 1s+ 的「点一下冻住」体感（挂载改在点击帧之后）。
      const alreadyMounted = this.mountedTabs.indexOf(key) !== -1
      this._touchPanel(key)
      if (alreadyMounted) {
        // 已缓存：本帧只翻 display（v-show），无需挂载
      } else {
        // #ifndef APP-PLUS
        // 小程序直连：同步挂载面板。requestAnimationFrame 在小程序逻辑层时序不可靠，
        // 把它用在「首挂」上会把面板挂载推迟到不可预期的时机，表现为
        // 「切到储能DC，内容却仍停在概览」。原 HEAD（已验证流畅的小程序路径）即同步挂载，
        // 小程序无 APP 那种 V8 主线程 GC 卡顿，同步建几百节点完全可接受。
        this._mountPanelByKey(key)
        if (!this._unloaded) this._trimPanelCache(key)
        perfLog('小程序同步挂载 ' + key + ' → ' + rtKey)
        // #endif
        // #ifdef APP-PLUS
        // APP：把首次挂载挪出点击帧，规避 bms/liquid 那种 1s+ 的「点一下冻住」。
        // 小程序无此问题，走上面的同步路径。
        this._pendingMountKey = key
        const self = this
        const doMount = () => {
          self._pendingMountKey = null
          if (self._unloaded) return
          // 用户在 rAF 前又切走了：放弃本次挂载，避免把不可见面板的节点建出来
          if (self.currentTab !== index) return
          self._touchPanel(key)
          self._mountPanelByKey(key)
          if (!self._unloaded) self._trimPanelCache(key)
          perfLog('延迟挂载 ' + key + ' → ' + rtKey + ' 耗时 ' + (Date.now() - t0) + 'ms（已移出点击帧）')
        }
        if (typeof requestAnimationFrame === 'function') requestAnimationFrame(doMount)
        else setTimeout(doMount, 16)
        // #endif
      }
      // 淘汰放到切换帧之后，且绝不淘汰当前可见面板
      setTimeout(() => {
        if (!this._unloaded) this._trimPanelCache(key)
      }, 0)
      this._tabSwitchAt = t0
      let backTop = false

      // #ifdef APP-PLUS
      // APP 专属：切 v-show 会改变页面内容高度。若此时还停在页面中部，
      // webview 要先 clamp 滚动位置、再重算 sticky 头，等于一次额外的整页
      // reflow；之后 uni.pageScrollTo 又是一次 JS→原生跨桥回顶，两次都撞在
      // 切换帧上。APP 页面就是标准 webview，直接滚 document 即可：同步完成、
      // 零跨桥，且放在 currentTab 赋值「之前」，换内容时页面已经在顶部。
      if (this._panelScrollY > 1) {
        backTop = true
        this._panelScrollY = 0
        try {
          window.scrollTo(0, 0)
          if (document.documentElement) document.documentElement.scrollTop = 0
          if (document.body) document.body.scrollTop = 0
        } catch (e) {}
        // 兜底：少数机型页面滚动容器不是 document，这时再补一次原生回顶
        setTimeout(() => {
          const y = window.pageYOffset ||
            (document.documentElement && document.documentElement.scrollTop) || 0
          if (y > 1) uni.pageScrollTo({ scrollTop: 0, duration: 0 })
        }, 0)
      }
      // #endif
      // #ifndef APP-PLUS
      if (this._panelScrollY > 1) {
        backTop = true
        this._panelScrollY = 0
        this.$nextTick(() => {
          uni.pageScrollTo({ scrollTop: 0, duration: 0 })
        })
      }
      // #endif

      // 切 tab 同步退出编辑态：与 currentTab 赋值合并进同一次 render，
      // 不额外多一轮 setData（watch currentTab 里的同名调用只作其它入口的兜底）。
      this._resetEditingOnTabChange()
      this._swPrepared = Date.now()
      this.currentTab = index

      // #ifdef APP-PLUS
      // 横向定位推迟一帧：切换帧里 scroll-into-view 保持旧值，uni-app 的
      // scroll-view 组件就不会在 updated 里做那次强制同步布局。
      this._syncTabScrollTarget(index)
      // #endif

      // 日志必须注册在赋值「之后」：这样回调排在 render watcher 后面，
      // 测到的才是真实渲染帧。以前放在赋值前，恒为 0ms，误导了排查。
      this.$nextTick(() => {
        const now = Date.now()
        const prepared = (this._swPrepared || t0) - t0
        const patched = (this._swPatched || now) - t0
        perfLog('切 tab ' + index + ' → ' + rtKey +
          '，切换帧 ' + (now - t0) + 'ms（准备 ' + prepared +
          ' / patch ' + (patched - prepared) + ' / 回调 ' + (now - t0 - patched) + '）' +
          '，缓存=' + (alreadyMounted ? '是' : '否') +
          '，挂载=' + (alreadyMounted ? '即时' : '延迟') +
          '，回顶=' + (backTop ? '是' : '否') +
          '，日志面板=' + (this.showPerfLog ? '开' : '关') +
          '，距上次=' + gap + 'ms，距提交=' + commitGap + 'ms' +
          '，已缓存=' + this.mountedTabs.length)
        this._swT0 = 0
      })
      // 数据快照由 currentTab watcher 同步换；参数回显排在切换帧之后
    },
    /**
     * APP 专用：把横向 scroll-into-view 的更新推到切换帧绘制完成之后。
     * 功能与「每次切 tab 都定位」完全一致，只是晚一帧；快速连切只留最后一次。
     */
    _syncTabScrollTarget(index) {
      if (APP_DISABLE_TAB_SCROLL_INTO) return
      if (this._tabScrollTimer) clearTimeout(this._tabScrollTimer)
      const target = 'tab-' + index
      this._tabScrollTimer = setTimeout(() => {
        this._tabScrollTimer = null
        if (this.currentTab !== index) return
        if (this.tabScrollTarget === target) return
        const t1 = Date.now()
        this.tabScrollTarget = target
        // 量化「延后后的定位帧」：uni-app APP 的 scroll-view 会在 updated 里
        // 遍历子节点算位置，这一帧的耗时可直接判定它是不是卡顿元凶。
        this.$nextTick(() => {
          perfLog('APP 横向标签定位帧 ' + (Date.now() - t1) + 'ms → ' + target)
        })
      }, 32)
    },
    /** APP 正式包内查看 [perf] 日志：长按顶部标题栏/设备卡区域打开 */
    openPerfLog() {
      if (!ENABLE_IN_APP_PERF_LOG) return
      this.perfLogLines = getPerfLogs(this.logFilter)
      this.showPerfLog = true
    },
    closePerfLog() {
      this.showPerfLog = false
    },
    refreshPerfLog() {
      this.perfLogLines = getPerfLogs(this.logFilter)
    },
    /** 只看连接/权限/WiFi 日志，或看全部（含 [perf] 性能日志） */
    toggleLogFilter() {
      this.logFilter = this.logFilter === 'all' ? 'connect' : 'all'
      this.refreshPerfLog()
    },
    copyPerfLog() {
      // 现场排障要的是完整时间线，复制始终取全量，不受当前筛选影响
      const all = getPerfLogs('all').join('\n')
      if (!all) {
        uni.showToast({ title: '暂无日志', icon: 'none' })
        return
      }
      uni.setClipboardData({
        data: all,
        success: () => uni.showToast({ title: '日志已复制', icon: 'none' }),
        fail: () => uni.showToast({ title: '复制失败', icon: 'none' })
      })
    },
    clearPerfLogView() {
      clearPerfLogs()
      this.perfLogLines = []
    },
    /** 日志面板里直达系统权限页：现场把「附近的设备」改成「允许」后返回即自动重试 */
    openPermissionFromLog() {
      const ok = openPermissionSettings()
      if (!ok) {
        uni.showToast({
          title: '请到系统设置里把「附近的设备」设为允许',
          icon: 'none'
        })
      }
    },

    /**
     * 连接失败后延迟判定是否弹权限引导：先给底层自动重连一点时间，
     * 几秒后仍离线且「疑似权限受限」才打扰用户，避免首连偶发超时就弹框。
     */
    _schedulePermissionGuide() {
      // #ifdef APP-PLUS
      if (this._permGuideTimer) clearTimeout(this._permGuideTimer)
      this._permGuideTimer = setTimeout(() => {
        this._permGuideTimer = null
        if (this._unloaded || this._paused) return
        if (this.connected && this.client && this.client.connected) return
        this._maybeGuidePermission()
      }, 4000)
      // #endif
    },
    _maybeGuidePermission() {
      // #ifdef APP-PLUS
      const p = getLastPermissionResult() || {}
      // 「附近的设备」是国产 ROM 聚合开关，没有公开 API 可查，只能用间接判据：
      // 标准权限缺失 / 权限状态未知 / 被永久拒绝 / 读不到热点名称。
      const wifiUnknown = !this._lastWifiStatus || this._lastWifiStatus === 'unknown'
      const suspect = (p.missing && p.missing.length > 0) ||
        p.unknown === true || p.permanentlyDenied === true || wifiUnknown
      if (showPermissionGuide({
        suspect,
        isActive: () => !this._unloaded && !this._paused
      })) return true
      // 非权限原因（设备热点没开 / 设备未上电 / 原生通道异常）时，权限引导按设计
      // 不弹；但也不能让用户一直盯着离线页、全程没有任何反馈。再给底层自动重连
      // 8s，仍全败才给一条不含协议术语的友好提示，本次进页面只提示一次。
      // 用 toast 而非弹窗，避免首连偶发超时就打断操作。
      if (this._connHintTimer) clearTimeout(this._connHintTimer)
      this._connHintTimer = setTimeout(() => {
        this._connHintTimer = null
        if (this._unloaded || this._paused) return
        if (this.connected && this.client && this.client.connected) return
        if (this._connHintShown) return
        this._connHintShown = true
        this._showDirectToast('设备没有响应，请检查设备热点是否开启后重试', 3000)
      }, 8000)
      return false
      // #endif
      // #ifndef APP-PLUS
      return false
      // #endif
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
      // 横向定位已统一为无动画瞬时跳转（见模板），这里只需换组，
      // 不再用定时器反复翻动画开关 —— 那两次 setData 正好落在切换帧上。
      this.bottomTab = type
      // 设置面板首次进入后常驻，切回监测只翻 display，不再排队销毁
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
          }
          this.config = {
            enabled: !!cfg.enabled,
            protocol: 'mqtt',
            deviceType: cfg.deviceType || '50kW',
            deviceName: cfg.deviceName || '',
            wifiSsid: cfg.wifiSsid || '',
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
    /**
     * 底层连接/下发异常会带 Broker / MQTT / TCP / WebSocket / Topic 等协议术语，
     * 用户看不懂：界面统一换成「下一步该做什么」的提示，原始错误只写控制台。
     * 不含术语的错误（如数值越界）原样返回，便于现场定位。
     */
    friendlyErrorText(err, fallback) {
      const raw = String((err && err.message) || err || '').trim()
      if (!raw) return fallback || '请稍后重试'
      console.warn('[直连] 原始错误：', raw)
      if (/broker|mqtt|tcp|websocket|topic|主题|0x[0-9a-f]/i.test(raw)) {
        return fallback || '请稍后重试'
      }
      return raw
    },
    /**
     * 连接设备前的 WiFi 前置检查。
     * - 已在 GCNZ 设备热点上 → 直接走原来的 start()
     * - 连的是别的 WiFi → 用本地保存的热点名称/密码尝试自动重连，成功再 start()
     * - 自动重连失败 / 没有凭据 → 标记 wifiBlocked（设备卡显示状态）并弹窗引导
     * - 读不到当前 WiFi（定位权限未授 / 平台限制）→ 放行，绝不误报把用户卡住
     *
     * 从系统 WiFi 设置返回时 onShow 静默重试（guide=false），不重复弹窗；
     * 用户主动点刷新则忽略冷却时间，强制再试一次自动连接。
     */
    /**
     * 进页面后的连接启动入口（onLoad / onShow 共用，带去重）。
     *
     * 以前 onLoad 用 $nextTick 直接 await 权限 + WiFi 检查：APP 端 webview
     * 创建和首帧 render 本身就重，再把原生权限桥调用、SSID 读取、可能长达
     * 12s 的自动连热点全屏遮罩压在同一批任务里，用户看到的就是「点了
     * 『进入监测』，好几秒才进得去」。现在让首帧先落地，再启动连接准备；
     * 小程序沿用 nextTick，路径与已验证版本一致。
     *
     * 页面层优化只在 APP 端生效，符合两端行为隔离的约定。
     */
    _startEntryConnect(options = {}) {
      if (this._unloaded || this._entryConnectPending) return
      this._entryConnectPending = true
      const run = () => {
        this._entryConnectTimer = null
        this._entryConnectPending = false
        if (this._unloaded || this._paused) return
        this.startWithWifiCheck(options)
      }
      // #ifdef APP-PLUS
      this._entryConnectTimer = setTimeout(run, 60)
      // #endif
      // #ifndef APP-PLUS
      this.$nextTick(run)
      // #endif
    },
    async startWithWifiCheck(options = {}) {
      if (!this.config.enabled) return
      // 首帧任务与 onShow 可能几乎同时触发；检测是异步的，
      // 不加锁会并发发起两次自动连接、弹两个引导框。
      if (this.connecting || this._wifiChecking) return
      // 在线时不需要检测：切后台回来 / 点刷新都不该反复读 SSID
      if (this.connected && this.client && this.client.connected) return

      this._wifiChecking = true
      // 前置检查期间设备卡保持「连接中」：页面已经进来，用户马上能看到状态，
      // 而不是一个看起来没反应的离线页。
      this.connecting = true
      let res
      let checked = false
      try {
        // 卸载重装后运行时权限被清空：先做一次自检与主动申请。
        // 带 2.5s 超时保底，用户不点系统授权框也继续连接，绝不拦截流程。
        // #ifdef APP-PLUS
        await ensureDevicePermissions()
        // #endif
        // 异步授权期间页面可能已退出 / 切后台，回来时 onShow 会重新检测
        if (this._unloaded || this._paused) return
        res = await ensureDeviceWifi({
          autoConnect: true,
          guide: options.guide !== false,
          forceConnect: !!options.forceConnect,
          // 自动检查（进页面 / 从 WiFi 设置返回）不弹全局 loading；
          // 只有用户手动点刷新才给连接提示，且不再用 mask 遮住页面。
          silentUi: !options.manual,
          ssid: this.config.wifiSsid || '',
          // 检测是异步的，页面可能已退出或切后台；此时工具里不再弹窗 / loading
          isActive: () => !this._unloaded && !this._paused
        })
        checked = true
      } catch (e) {
        // 权限 / WiFi 前置检查自身异常，绝不能把用户挡在门外
        console.warn('[直连] 连接前置检查异常，按原流程继续:', e)
        res = { ok: true, status: 'unknown' }
        checked = true
      } finally {
        this._wifiChecking = false
        if (!checked) this.connecting = false
      }
      // 异步返回时页面可能已卸载（弹窗没关就返回上一页）或已切后台，
      // 不要再改本页状态、不要再发起连接；回来时 onShow 会重新检测。
      if (this._unloaded || this._paused) {
        this.connecting = false
        return
      }
      // 供连接失败时判定「是否疑似权限受限」：读不到热点名称（unknown）时，
      // 国产 ROM 把「附近的设备」设为禁止是最常见的原因。
      this._lastWifiStatus = res && res.status
      if (!res.ok) {
        this.connecting = false
        this.wifiBlocked = true
        this._wifiBlocked = true
        return
      }
      this.wifiBlocked = false
      this._wifiBlocked = false
      return this.start()
    },
    /**
     * 只在直连页仍可见时弹提示。
     * APP 端 uni.showToast 是应用级浮层，页面销毁 / 切后台后不会自动消失；
     * 异步连接失败若照常弹，提示会残留在登录页等无关页面上。
     */
    _showDirectToast(title, duration) {
      if (this._unloaded || this._paused) return
      this._ownToastAt = Date.now()
      const opts = { title, icon: 'none' }
      if (duration) opts.duration = duration
      uni.showToast(opts)
    },
    /** 页面离开时只清掉自己刚弹的浮层（3s 内），避免误伤其它页面的提示 */
    _clearOwnToast() {
      if (this._ownToastAt && Date.now() - this._ownToastAt < 3000) {
        this._ownToastAt = 0
        try { uni.hideToast() } catch (e) {}
      }
    },
    async start() {
      if (!this.config.enabled) return
      this.errorMsg = ''
      this.connecting = true
      try {
        await this.startMqtt()
      } catch (e) {
        const text = this.friendlyErrorText(e, '设备没有响应，请检查 WiFi 连接')
        this.errorMsg = text
        this._schedulePermissionGuide()
        // 原始错误只进控制台；异步失败时页面可能已退出，绝不能弹到别的页面上。
        // 同一文案 8s 内只提示一次，避免自动重连循环反复刷新同一个 toast。
        console.warn('[直连] 连接失败:', text)
        const now = Date.now()
        if (!this._lastConnectErrorToastAt || now - this._lastConnectErrorToastAt > 8000) {
          this._lastConnectErrorToastAt = now
          this._showDirectToast(text)
        }
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
      rtStore.resetFormatted()
      this._rebuildActiveRv()
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
      // 首连超时/失败时 connectMqtt 已吞掉错误，底层会按退避策略自动重连。
      // 此时 client.connected=false，继续订阅只会抛「设备连接已断开」，被 start()
      // 当成用户可见错误弹成 toast。APP 端 toast 是应用级浮层，页面退出后仍会
      // 残留在登录页等无关页面上（且每次重连都会再弹一次，看起来「一直显示」）。
      // 这里静默跳过，订阅统一交给 onConnect 在连接真正建立后补。
      if (!this.client || !this.client.connected) {
        console.warn('[直连] 连接尚未建立，等待自动重连后补订阅')
        // 给底层自动重连一点时间；几秒后仍没连上且判定疑似权限受限，
        // 再弹「去设置允许」引导，避免首连偶发超时就打扰用户。
        this._schedulePermissionGuide()
        return
      }
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
      // 连接/重连成功回调：CONNACK 0 时触发（含客户端自动重连成功那一次）。
      // 首连超时被 reject 后 start() 的 await 已结束，客户端会继续按退避策略自动重连，
      // 只有在这里才能把 UI 切回「在线」——否则头部一直显示离线，而数据实际已经在跑。
      this.client.onConnect = () => {
        const wasOffline = !this.connected
        this.connected = true
        this.connecting = false
        this.errorMsg = ''
        // 已连上就撤掉待弹的权限引导（首连超时后自动重连成功属于正常恢复）
        if (this._permGuideTimer) {
          clearTimeout(this._permGuideTimer)
          this._permGuideTimer = null
        }
        if (this._connHintTimer) {
          clearTimeout(this._connHintTimer)
          this._connHintTimer = null
        }
        this._connHintShown = false
        if (wasOffline) {
          // 首次连上/断线重连：清空旧数据（可能来自上一次连接的不同 broker），等新帧到了再填
          this.resetRawValues()
          this.updateDisplay()
          this.rebuildFormattedValues()
        }
        // 底层自动重连（含首连超时后自行重连的那一次）不重建 MqttDirectClient，
        // connectionSeq 不变，但旧订阅已随 socket 销毁。强制重订阅，
        // 否则会出现「头部显示在线、一帧数据都收不到」。
        this._subscribedSeq = null
        this.subscribeMqttTopics().catch(e => {
          console.warn('[直连] 连接建立后订阅失败:', e && e.message)
        })
      }
      try {
        await this.client.connect()
      } catch (e) {
        // 首连失败不终结流程：客户端自动重连，成功后上面的 onConnect 会把头部切回在线
        console.warn('[MQTT] 首连失败，等待自动重连:', e.message)
        return
      }
      // （数据清空/回显刷新已在 onConnect 回调里统一处理）
      // 激活直连模式——只有真正连上 MQTT 才打激活标记
      try {
        uni.setStorageSync('direct_device_activated', true)
      } catch (e) { }
    },
    async subscribeMqttTopics() {
      // onConnect 与 startMqtt 可能在同一条连接上并发进来，加锁避免重复注册 handler
      if (this._subscribing || this._unloaded) return
      const realtimeTopic = this.config.realtimeTopic
      const controlTopic = this.config.controlSetTopic
      const c = this.client
      if (!c) return
      // 同一条连接只订阅一次：onShow / 重试会反复进这里，重复 subscribeAll 会让同一条消息
      // 被多个 handler 重复解析（卡顿、重复 toast 都由此而来）
      if (this._subscribedSeq === c.connectionSeq) {
        return
      }
      this._subscribing = true
      try {
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
      } finally {
        this._subscribing = false
      }
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
      // 20s 全链路诊断计数：普通数值，不进响应式数据、不触发 render
      this._diagMqtt = (this._diagMqtt || 0) + 1
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
      // ⚠️ 50kW 能源站：171C 帧头里写的仍是 '171C'（协议模块本身 deviceType 也是 '171C'），
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
      // 模拟器 JSON 帧同样算一次上报，页头时钟跟着走
      rtStore.markFrame()
      const fields = data.fields || {}
      const rawDt = (data.deviceType || '171C').toUpperCase()
      const deviceType = this._normalizeDeviceType(rawDt, data.address)
      if (!this._rawStore[deviceType]) this._rawStore[deviceType] = Object.freeze({})

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
      const keys = KW50_BUCKETS
      for (let i = 0; i < keys.length; i++) {
        const b = rv[keys[i]]
        if (b && Object.keys(b).length > 0) {
          this._has50KwData = true
          // 同步到响应式标量：is50KwMode / tab 分组 / 设置模板随即翻转一次
          this.has50KwMode = true
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
    /**
     * APP 专用：判断本帧是否与上一次同类型帧的业务数据完全一致。
     *
     * 为什么能安全地「跳过解析」：设备 8~10 帧/s 反复上报同一组寄存器，
     * 帧尾只有时间戳 / CRC 变化。协议解析的输出只取决于
     *   deviceType(帧[1..2]) + address(帧[5]) + dataType(帧[7])
     *   + startAddr(帧[8]) + payload(帧[9..9+datacount-2])
     * 这几段完全相同 ⇒ parsed.data 必然相同 ⇒ 跳过不会丢任何值。
     * 每 2s 强制放行一次，保证协议判定、控制帧回显、状态刷新等副作用照常触发。
     *
     * 只比较字节，不建对象（除一个分桶快照），因此本身几乎不制造 GC 压力。
     * @returns {boolean} true = 本帧可跳过
     */
    _shouldSkipDuplicateFrame(frameBytes) {
      if (!frameBytes || frameBytes.length < 11) return false
      const now = Date.now()
      const headLen = Math.min(frameBytes.length,
        9 + Math.max(0, (frameBytes[6] || 0) - 2))
      // 帧头 9 字节全部纳入签名（frameType / deviceType / factorySign /
      // address / datacount / dataType / startAddr），杜绝跨设备或跨帧型碰撞
      let sig = ''
      for (let i = 0; i < 9; i++) sig += frameBytes[i] + ','
      const cache = this._frameDupCache || (this._frameDupCache = {})
      if (this._frameDupCacheSize === undefined) this._frameDupCacheSize = 0
      const rec = cache[sig]
      let same = !!rec && rec.arr.length === headLen
      if (same) {
        for (let i = 0; i < headLen; i++) {
          if (rec.arr[i] !== frameBytes[i]) { same = false; break }
        }
      }
      const forceParse = !rec || now - rec.at >= 2000
      if (same && !forceParse) {
        this._perfDupFrames = (this._perfDupFrames || 0) + 1
        return true
      }
      const snap = new Array(headLen)
      for (let i = 0; i < headLen; i++) snap[i] = frameBytes[i]
      if (!rec) this._frameDupCacheSize++
      cache[sig] = { arr: snap, at: now }
      // 分桶种类异常增长（协议切换 / 多设备扫描）时清空，避免缓存无限膨胀
      if (this._frameDupCacheSize > 64) {
        this._frameDupCache = {}
        this._frameDupCacheSize = 0
      }
      return false
    },
    /**
     * APP 专用：10s 聚合诊断日志（由「收帧」驱动，而不是「提交」驱动）。
     *
     * 为什么必须挪出 _commitStaged()：APP_SKIP_DUPLICATE_FRAMES 把重复帧短路后，
     * 静止设备可能连续十几秒都没有 hasNewValue，scheduleFrameFlush 不会触发、
     * _commitStaged 也不会执行，挂在提交里的聚合日志会整段消失——恰好看不到
     * 「跳过重复帧」这个用于验收本轮优化的关键指标。
     * 改为每帧一次时间比较（8~10 次/s，纯数值比较，不建对象、不碰响应式数据），
     * 只要还在收帧就一定按窗口出日志；断流时不出日志也符合预期。
     */
    /**
     * APP 端 20s 全链路诊断（由时钟驱动，独立于收帧）。
     * 原来的 10s 聚合日志由 applyIemsFrame 驱动，一帧数据都没有时反而什么都不输出，
     * 现场只能看到「在线 + 满屏 --」却无法区分：订阅没发 / 底层没读到字节 /
     * 字节读到了但上层没解析出来。这里即使全为 0 也照常出一条，用于定位断流。
     */
    _startDiagTicker() {
      // #ifdef APP-PLUS
      if (this._diagTimer || this._unloaded) return
      this._diagLastStats = { bytes: 0, chunks: 0, reads: 0, polls: 0, frames: 0, commits: 0 }
      this._diagTimer = setInterval(() => {
        if (this._unloaded || this._paused || !tcpReadStats) return
        // 有数据时 _maybePerfReport 会清零统计，用增量 + 清零检测取差值
        const d = (cur, last) => (cur >= last ? cur - last : cur)
        const s = this._diagLastStats
        const bytes = d(tcpReadStats.bytes, s.bytes)
        const chunks = d(tcpReadStats.chunks, s.chunks)
        const reads = d(tcpReadStats.reads, s.reads)
        const polls = d(tcpReadStats.polls, s.polls)
        const frames = d(this._perfFrames || 0, s.frames)
        const commits = d(this._perfCommits || 0, s.commits)
        s.bytes = tcpReadStats.bytes
        s.chunks = tcpReadStats.chunks
        s.reads = tcpReadStats.reads
        s.polls = tcpReadStats.polls
        s.frames = this._perfFrames || 0
        s.commits = this._perfCommits || 0
        const subscribed = !!(this.client && this.client.connected && this._subscribedSeq != null)
        const bulkText = tcpReadStats.bulk === 1 ? '开' : (tcpReadStats.bulk === -1 ? '回退' : '关')
        perfLog('20s 诊断：订阅=' + (subscribed ? '是' : '否') +
          '，MQTT回调=' + (this._diagMqtt || 0) +
          '，收帧=' + frames + '，提交=' + commits +
          '，通道收=' + bytes + 'B/' + chunks + '片' +
          '，桥调用≈' + Math.round(reads / 20) + '/s' +
          '，轮询=' + Math.round(polls / 20) + '/s' +
          '，单片=' + (tcpReadStats.limit || 0) + 'B/' + (tcpReadStats.tickMs || 0) + 'ms' +
          '，档位=' + (tcpReadStats.tier || 0) +
          '，批量读=' + bulkText +
          '，异常=' + (tcpReadStats.errors || 0))
        this._diagMqtt = 0
      }, 20000)
      // #endif
    },
    _stopDiagTicker() {
      if (this._diagTimer) {
        clearInterval(this._diagTimer)
        this._diagTimer = null
      }
    },
    _maybePerfReport(now) {
      if (!this._perfAt) { this._perfAt = now; return }
      const secs = Math.round((now - this._perfAt) / 1000)
      if (secs < 10) return
      const frames = this._perfFrames || 0
      const commits = this._perfCommits || 0
      const dup = this._perfDupFrames || 0
      // APP(Android) plus.android 轮询读 TCP 的桥调用量：小程序走事件回调，这里恒为 0，
      // 因此无需条件编译——有值就追加，没值就不出现，不影响已验证流畅的小程序路径。
      // 11:08 日志已定量确认根因：桥读≈4000/s 而 TCP轮询仅 1~19/s ⇒ 单次 readLoop
      // 连做几千次同步桥调用，是秒级同步长任务，把切 tab 的 patch 整段吞掉。
      // 2026-11-13 验收口径：单片耗时 ≤12ms、长任务=0；若批量读=开，
      // 「桥调用/s」应从 ~4000 降到 ~100，这才是低端机真正不卡的原因。
      let tcpText = ''
      if (tcpReadStats && (tcpReadStats.polls || tcpReadStats.reads)) {
        const bulkText = tcpReadStats.bulk === 1 ? '开'
          : (tcpReadStats.bulk === -1 ? '回退' : '未测')
        tcpText = '，TCP轮询=' + Math.round(tcpReadStats.polls / secs) + '/s' +
          '，桥调用=' + Math.round(tcpReadStats.reads / secs) + '/s' +
          '，单片最长=' + (tcpReadStats.maxPerTick || 0) + 'B' +
          '，单片耗时=' + (tcpReadStats.tickMs || 0) + 'ms' +
          '，单片上限=' + (tcpReadStats.limit || 0) + 'B' +
          '，档位=' + (tcpReadStats.tier || 0) +
          '，批量读=' + bulkText +
          (tcpReadStats.errors ? '，回退次数=' + tcpReadStats.errors : '') +
          '，长任务=' + (tcpReadStats.longTasks || 0)
        tcpReadStats.polls = 0
        tcpReadStats.reads = 0
        tcpReadStats.bytes = 0
        tcpReadStats.chunks = 0
        tcpReadStats.maxPerTick = 0
        tcpReadStats.longTasks = 0
      }
      perfLog(secs + 's：收帧 ' + frames + '（' +
        Math.round(frames / secs) + '/s），跳过重复帧 ' + dup +
        '，实际解析 ' + Math.max(0, frames - dup) +
        '，提交 ' + commits +
        ' 次，平均提交 ' + ((this._perfBuildMs || 0) / Math.max(1, commits)).toFixed(1) +
        'ms，常驻面板=' + this.mountedTabs.length + '，tab=' + this.currentTab +
        '，有变化=' + (this._perfHasChanged ? '是' : '否') + tcpText)
      this._perfAt = now
      this._perfFrames = 0
      this._perfCommits = 0
      this._perfBuildMs = 0
      this._perfDupFrames = 0
      this._perfHasChanged = false
    },
    applyIemsFrame(frameBytes) {
      // 页头「更新」按真实收帧打点（同一秒多帧只通知一次，且只刷新设备卡一个文本）。
      // 放在 APP 重复帧过滤之前：帧被去重只是渲染优化，设备确实又上报了一次，
      // 稳态数值不变时时间戳也必须继续走。与 800ms 合并 / 1.5s 提交节流完全解耦。
      rtStore.markFrame()
      // #ifdef APP-PLUS
      // 放在自增之前：窗口切换时本帧计入新窗口，不丢计数
      this._maybePerfReport(Date.now())
      // #endif
      this._perfFrames = (this._perfFrames || 0) + 1
      // #ifdef APP-PLUS
      if (APP_SKIP_DUPLICATE_FRAMES && this._shouldSkipDuplicateFrame(frameBytes)) return
      // #endif
      try {
        // 50kW 能源站：新协议与旧协议共用同一设备类型码（170C/171C），
        // 必须显式指定协议模块，否则会落到 170C_000A / 171C_000A 旧布局上解析错位
        const protocolKey = this._protocolKeyFor(this._pendingDeviceType(frameBytes))
        const parsed = parseIemsFrame(frameBytes, protocolKey ? { protocolKey } : undefined)
        const rawDt = (parsed.deviceType || '171C').toUpperCase()
        const deviceType = this._normalizeDeviceType(rawDt, parsed.address)
        if (!this._rawStore[deviceType]) this._rawStore[deviceType] = Object.freeze({})
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

        // 170C 状态区长期显示「当前 --」时，用这条日志区分三种情况：
        //   ① 根本没有 dataType=0x03 的行 → 设备未上报状态帧；
        //   ② 有 0x03 但 startAddr>0 / B8/B10 缺失 → 分段上报或地址错位；
        //   ③ 有 0x03 且 B8/B10 齐全 → 问题在展示层取数。
        // 按「设备+帧型」10s 聚合一次，正式包不会刷屏。
        if (deviceType === '170C_PV' || deviceType === '170C_STORAGE') {
          const logKey = deviceType + '/' + dataTypeNum
          const nowTs = Date.now()
          if (!this._dcFrameLog) this._dcFrameLog = {}
          if (!this._dcFrameLog[logKey] || nowTs - this._dcFrameLog[logKey] > 10000) {
            this._dcFrameLog[logKey] = nowTs
            const ks = Object.keys(data)
            const st = ks.filter(k => /^B8|^B10/.test(k)).slice(0, 12)
            // console.log('[170C] ' + logKey +
            //   ' frameType=0x' + (parsed._frameTypeNum || 0).toString(16) +
            //   ' addr=' + parsed.address +
            //   ' startAddr=' + (parsed._startAddrNum || 0) +
            //   ' payload=' + (parsed.payload ? parsed.payload.length : 0) +
            //   ' fields=' + ks.length +
            //   ' B8/B10=' + (st.join(',') || '(无)') +
            //   ' prefix=' + (keyPrefix || 'none') +
            //   ' protocol=' + (protocolKey || 'auto'))
          }
        }

        const batch = {}
        let hasNewValue = false
        // 用 for...in 代替 Object.keys().forEach：每帧少建一个数组和一个闭包，
        // 8~10 帧/s 累积下来同样是 GC 压力。data 恒为解析器新建的普通对象字面量，
        // 原型链上无可枚举属性，遍历结果与 Object.keys 完全一致。
        for (const field in data) {
          const v = data[field]
          if (v === undefined || v === null) continue
          const storeKey = keyPrefix + field
          batch[storeKey] = v
          // 寄存器号别名仅对未加前缀的键（ENERGY/旧协议）生成，避免污染 reg 号索引
          if (!keyPrefix && fieldToReg[field] !== undefined) {
            batch[fieldToReg[field]] = v
          }
          if (bucket[storeKey] !== v) hasNewValue = true
        }

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
      // #ifdef APP-PLUS
      // 低端机按 TCP 读循环实测的桥调用成本放宽提交间隔：数值刷新稍慢（传感器本就缓变），
      // 但每轮 render / setData 变少，切 tab、滚动不再和数据提交抢主线程。
      // tier 由 uniapp-tcp-adapter.js 实测得出；未走 Java Socket（小程序 / WebSocket
      // 降级）时恒为 0，走下面的原值，已验证流畅的路径一行不改。
      const tier = getTcpPerfTier()
      if (tier >= 2) return this.currentSettingsTab ? 1400 : 2400
      if (tier === 1) return this.currentSettingsTab ? 1100 : 1900
      // #endif
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
        const needFv = !this.is50KwMode || this.currentTab === 0
        if (needFv) {
          const archOnly = this.currentTab === 0
          // 概览只算 arch*（30 来个键）；其它 tab 只重建本次有变化的当前设备桶。
          // 不再把 171F 的几百个 `171F_B{n}` 键塞进 formattedValues ——
          // 没有任何模板读它们，却每轮都要参与 diff / setData 序列化。
          const cur = this.currentDeviceType
          const visible = archOnly ? [] : types.filter(t => t === cur)
          this._applyFormattedValues(this._buildFormattedValues(visible, archOnly))
        }
      }
      // 3) 设置面板参数回显：本次确实提交了新值时确保回显心跳在跑。
      //    实际回显由 _startSettingsEchoLoop 的 1s 心跳统一驱动，不再靠
      //    「帧值变化」这一偶发条件——稳态上报时只读态也必须显示当前值。
      //    没有新帧的那几轮不会把几百项参数树过一遍。
      if (onSettings && changed) this.syncSettingsFromRealtime()
      // 「更新」时间戳不在这里写：它已在 applyIemsFrame 按收帧打点，由 DeviceCard
      // 自己订阅帧时钟刷新。这里只管数据提交（1.5s 节流），两者互不牵连。
      // 诊断计数：APP 的 10s 聚合日志由 applyIemsFrame → _maybePerfReport 输出（收帧驱动），
      // 这里只负责累加；否则重复帧被短路、长时间无提交时日志会整段消失。
      this._perfFrames = this._perfFrames || 0
      this._perfCommits = (this._perfCommits || 0) + 1
      this._perfBuildMs = (this._perfBuildMs || 0) + (Date.now() - t0)
      if (changed) this._perfHasChanged = true
      // #ifndef APP-PLUS
      // 小程序维持原「提交驱动」的诊断节奏，已验证流畅的路径一行不改
      this._maybePerfReport(now)
      // #endif
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
     *
     * ⚡ 整桶替换 + 冻结：桶是 Object.freeze 的普通对象，Vue2 不会给它内部字段
     *    建 getter/setter，于是没有上千个 Dep，也没有逐键 dep.notify。
     *    一次提交只改 rawValues[dt] 这一个顶层键（一次 setter / 一次通知），
     *    子组件依赖这一层即可在换桶时重算。值完全没变的桶连这一步都跳过。
     *    代价是每次提交序列化一个几百键的桶（约十几 KB），远小于原来
     *    「上千次响应式通知 + 整棵 vdom 深层 diff」。
     * @returns {boolean} 是否有值真的变了
     */
    _commitStaged() {
      const stage = this._stage
      if (!stage) {
        this._lastChangedTypes = []
        return false
      }
      this._stage = {}
      const rv = this._rawStore || (this._rawStore = {})
      const changedTypes = []
      for (const dt in stage) {
        const src = stage[dt]
        const bucket = rv[dt] || {}
        const keys = Object.keys(src)
        let diff = false
        for (let i = 0; i < keys.length; i++) {
          if (bucket[keys[i]] !== src[keys[i]]) { diff = true; break }
        }
        if (!diff) continue
        // 普通对象赋值：不触发任何响应式通知，也不进 setData
        rv[dt] = Object.freeze(Object.assign({}, bucket, src))
        changedTypes.push(dt)
      }
      this._lastChangedTypes = changedTypes
      if (changedTypes.length) {
        // 一次版本号递增 → 所有依赖 rawValues 的非渲染类 computed 重算
        this.storeVer++
        // 兜底：协议判定标记与 is50KwMode 保持同步。
        // is50KwMode 现在只读标量（不能再扫描 rawValues，否则父模板会依赖 storeVer），
        // 正常由 _use50KwProtocol() 在解析时置位；这里防止有写入路径绕过它。
        if (!this.has50KwMode) {
          for (let i = 0; i < changedTypes.length; i++) {
            if (KW50_BUCKETS.indexOf(changedTypes[i]) !== -1) {
              this._has50KwData = true
              this.has50KwMode = true
              break
            }
          }
        }
        // 只有变化的桶属于当前 tab 才重建快照。设备多台、帧分散到达时，
        // 别的设备的帧不应把当前面板整片重刷一遍（这是实时态卡顿的放大器）。
        const needed = TAB_BUCKETS[this.currentTab] || []
        let relevant = false
        for (let i = 0; i < changedTypes.length; i++) {
          if (needed.indexOf(changedTypes[i]) !== -1) { relevant = true; break }
        }
        if (relevant) this._rebuildActiveRv()
      }
      return changedTypes.length > 0
    },
    handleMqttStatus(payloadStr) {
      try {
        const data = JSON.parse(payloadStr)
        // online: false 通常表示其他客户端离线；不影响本连接状态
        // 仅用于日志展示，这里仅 toast 提示
        if (data.online === false && data.clientId) {
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
                // 回显照常同步，但只有确有待应答的下发才提示「已生效」
                if (changes.length && this._shouldHintControlAck()) {
                  uni.showToast({ title: '指令已生效', icon: 'success' })
                }
              }
            } catch (e) {
              // console.warn('[MQTT CONTROL RESP] parseIemsControlFrame 失败:', e.message)
              // fallback 到通用解析提取寄存器
              try {
                const frame = parseIemsFrame(bytes)
                const changes = this._extractRegisterChangesFromFrame(frame)
                if (changes.length > 0) {
                  changes.forEach(c => this._applyControlChange(c))
                  if (this._shouldHintControlAck()) {
                    uni.showToast({ title: '指令已生效', icon: 'success' })
                  }
                }
              } catch (e2) {
                console.warn('[MQTT CONTROL RESP] parseIemsFrame fallback 失败:', e2.message)
              }
            }
            return
          }

          // 0x17 = COMMON_STATUS / 0x07 = DEVICE_REPORT / 0x18 = PROJECT_REGISTER
          // 以前这里直接 return，假设 realtime topic 一定会同时收到同一帧。现场若设备
          // 只在控制 topic 回状态帧，0x03 就被整帧丢掉，170C「机器运行状态」长期全灰。
          // 转交实时解析链路写入 bucket（同一帧两路都收到时由 _forwardRespStateFrame 去重）。
          if (ft === 0x17 || ft === 0x07 || ft === 0x18) {
            this._forwardRespStateFrame(bytes)
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
          // 与 hex 路径一样先剔除本机回环帧（二进制形态），否则自己发的帧会被当成设备应答
          let binHex = ''
          for (let i = 0; i < payloadBytes.length; i++) {
            binHex += payloadBytes[i].toString(16).padStart(2, '0')
          }
          if (this._isOwnControlEcho(binHex.toUpperCase())) {
            return
          }
          try {
            const ctrlFrame = parseIemsControlFrame(payloadBytes)
            if (ctrlFrame && ctrlFrame.registers) {
              const changes = Object.entries(ctrlFrame.registers)
                .map(([field, newValue]) => ({ field, newValue }))
              changes.forEach(c => this._applyControlChange(c))
              if (changes.length && this._shouldHintControlAck()) {
                uni.showToast({ title: '指令已生效', icon: 'success' })
              }
            }
            return
          } catch (e) { /* fallthrough */ }
        }
        if (ft === 0x17 || ft === 0x07 || ft === 0x18) {
          this._forwardRespStateFrame(payloadBytes)
          return
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
     * 控制 topic 上回发的 0x03 状态帧 / 0x04 控制帧也要进实时仓库。
     * 只对这两类帧转发，避免把控制应答的普通杂帧算进收帧统计；
     * 同一帧被 realtime / controlResp 两路都收到时按整帧 hex 去重，
     * 即便重复进入，applyIemsFrame 的 hasNewValue 也会短路，不会多触发渲染。
     */
    _forwardRespStateFrame(bytes) {
      if (!bytes || bytes.length < 9) return
      const dt = bytes[7]
      if (dt !== 0x03 && dt !== 0x04) return
      let key = ''
      for (let i = 0; i < bytes.length; i++) key += bytes[i].toString(16).padStart(2, '0')
      if (key === this._lastRespFrameHex) return
      this._lastRespFrameHex = key
      try {
        this.applyIemsFrame(bytes)
      } catch (e) {
        console.warn('[MQTT CONTROL RESP] 状态帧转交实时解析失败:', e && e.message)
      }
    },
    /**
     * 是否允许为这条 0x16 应答弹「指令已生效」。
     * 门槛：本机在 CONTROL_ACK_WINDOW_MS 内确实下发过指令，且这次下发还没提示过。
     * client._lastControlAt / _lastControlHex 由 sendControl / sendControlBatch 在 publish 时写入，
     * 组合 token 保证「一次下发最多提示一次」；设备周期性控制回读帧、订阅时的 retained 帧
     * 都没有对应的下发动作，一律静默。
     * 注意：回显（_applyControlChange）不受此限制，控制寄存器状态仍照常同步。
     */
    _shouldHintControlAck() {
      const c = this.client
      const sentAt = c && c._lastControlAt
      if (!sentAt) return false
      if (Date.now() - sentAt > CONTROL_ACK_WINDOW_MS) return false
      const token = sentAt + '|' + (c._lastControlHex || '')
      if (this._lastControlAckToken === token) return false
      this._lastControlAckToken = token
      return true
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
      let changed = false
      params.forEach(p => {
        // 组合卡里待下发的本地改动优先，别被回执刷掉
        if (p._pending) return
        if (p.field === data.field && data.newValue !== undefined) {
          changed = true
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
      if (changed) this._bumpEcho()
    },
    syncAllParamsFromResp(data) {
      SETTINGS_PANELS.forEach(cfg => {
        this.syncParamFromResp(this[cfg.dataKey], data)
      })
    },
    reconnect() {
      this.stop()
      this.startWithWifiCheck()
    },
    onDisconnect() {
      this.stop()
      this._showDirectToast('已断开连接')
    },
    async manualRefresh() {
      if (this.connecting) return
      if (!this.connected) {
        // 用户主动点刷新：忽略冷却时间再试一次自动连接，并重新给出引导。
        // manual=true 保留「正在连接设备 WiFi」提示（已改成不遮罩）。
        await this.startWithWifiCheck({ guide: true, forceConnect: true, manual: true })
        return
      }
      // 设备数据主动上报，无需手动刷新；提示文案面向用户，不出现协议术语
      // uni.showToast({ title: '监测数据自动更新，无需手动刷新', icon: 'none' })
    },
    // ============ 设置面板方法 ============

    initSettingsParams() {
      // 由 onLoad 的空闲帧预热调用（currentTab watcher 里还有兜底）。
      // 按当前判定的协议模板初始化；若预热时帧还没到而判成 20kW，
      // _doSyncSettingsFromRealtime 里的协议切换分支会自动整体重建。
      const has50Kw = this.is50KwMode
      const panels = has50Kw ? SETTINGS_PANELS_50KW : SETTINGS_PANELS
      panels.forEach(cfg => this._clonePanelParams(cfg))
      this.settingsProtocol = has50Kw ? '50kw' : '20kw'
      this._bumpEcho()
      this.syncSettingsFromRealtime()
    },
    syncSettingsFromRealtime() {
      // 只要当前在设置组，就确保回显心跳在跑；心跳负责「只读态也持续有实时值」。
      // 心跳在跑时不再另排节流定时器，避免一秒里同步两次。
      this._startSettingsEchoLoop()
      if (this._settingsEchoTimer) return
      // 非设置组（连接成功 / 预热时的调用）：保留原来的一次性节流同步。
      // 数值设定（告警阈值 / 温控）不需要秒级刷新，每次同步都要遍历几百项参数，
      // 写回显字段 → 小程序要重新 diff 一遍参数树；1s 合并一次即可。
      if (this._syncSettingsTimer || this._inSettingsSync) return
      this._syncSettingsTimer = setTimeout(() => {
        this._syncSettingsTimer = null
        this._doSyncSettingsFromRealtime()
      }, SETTINGS_ECHO_INTERVAL_MS)
    },
    /**
     * 设置组可见期间的回显心跳。
     *
     * 以前回显只由「帧提交且值有变化」或「点『修改』进入编辑态」触发：设备稳态上报、
     * APP 重复帧短路、切 tab 时恰好没有待执行定时器，都会让只读态一直停在初始 '--'，
     * 用户看到的就是「设置页没有实时数据，只有点修改才有」。
     *
     * 心跳只在设置组且页面可见时运行，切回监测页 / 页面隐藏立即停；
     * _syncSettingsCore 有原始值快照快路径 + 只在值变化时 notifyParamChange，
     * 稳态下只是几百次普通对象查找，不写值、不触发任何渲染。
     */
    _startSettingsEchoLoop() {
      if (this._settingsEchoTimer || this._unloaded || this._paused) return
      if (!this.currentSettingsTab) return
      this._settingsEchoTimer = setInterval(() => {
        if (this._unloaded || this._paused || !this.currentSettingsTab) return
        this._doSyncSettingsFromRealtime()
      }, SETTINGS_ECHO_INTERVAL_MS)
    },
    _stopSettingsEchoLoop() {
      if (this._settingsEchoTimer) {
        clearInterval(this._settingsEchoTimer)
        this._settingsEchoTimer = null
      }
    },
    /** 按面板配置深克隆一份参数数组（重置回显值），供协议切换 / 自愈复用 */
    _clonePanelParams(cfg) {
      const src = cfg.source || []
      const hasOptions = src.length > 0 && src[0] && src[0].options
      this[cfg.dataKey] = src.map(p => ({
        ...p,
        currentValue: null,
        currentLabel: hasOptions ? '--' : undefined,
        currentText: hasOptions ? undefined : '--',
        // 协议切换 / 面板重建时清掉上一套参数的乐观显示残留
        _optUntil: 0,
        _optValue: undefined,
        _optLabel: undefined,
        _optText: undefined,
        _optTimer: null
      }))
      // 数组整体替换已由不可枚举 setter 写进 paramStore，不再需要重建响应式映射。
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
      // ⚡ 不在设置 tab 时直接返回：参数模板与回显只对当前设置面板有意义，
      //    监测态跑它等于每轮把几百项参数树填进 data 再被深拷贝一遍。
      if (!this.currentSettingsTab) return
      // ⚡ 这里不再 force flush。以前「800ms flush → 排 1s 同步 → 同步里又 force flush
      //    → force flush 又排一次同步 …」形成自激循环，即使一帧新数据都没有，
      //    也在每秒把几百项参数全量遍历一遍。现在回显直接读上一次提交的值
      //    （最多滞后一次显示提交，数值设定类参数本就是慢变量）。
      //    真正要保证读到最新值的入口（切 tab / 编辑 / 下发）各自调 flushPendingFramesNow()。
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
          // 协议层细节只进日志，不给用户看「控制帧 / 0x04」这类术语
          console.warn('[settings] 171C_V2 未收到 0x04 控制帧（bucket 无 C_ 键），温控参数不可读')
          uni.showToast({ title: '暂时读不到温控参数，请稍后重试', icon: 'none', duration: 2600 })
        }
      }

      // 协议模板切换：initSettingsParams 会先按 20kW 模板填充数组，
      // 检测到 50kW 后必须整体重建，否则永远显示 20kW 参数
      const targetProtocol = has50Kw ? '50kw' : '20kw'
      const sourcePanels = has50Kw ? SETTINGS_PANELS_50KW : SETTINGS_PANELS
      let rebuilt = false
      if (this.settingsProtocol !== targetProtocol) {
        sourcePanels.forEach(cfg => this._clonePanelParams(cfg))
        this.settingsProtocol = targetProtocol
        rebuilt = true
      }
      // 自愈：任何面板数组为空都按当前协议模板补一次
      // （协议切换时序、页面重进等情况下漏初始化会让设置页整页空白，这里兜住）
      sourcePanels.forEach(cfg => {
        const arr = this[cfg.dataKey]
        if (!arr || arr.length === 0) { this._clonePanelParams(cfg); rebuilt = true }
      })
      if (rebuilt) this._bumpEcho()

      // 只同步「当前设置 tab 真正用到的数组」。
      // 以前每次同步都把 9 个面板全遍历一遍（BMS 367 项 + PCS/光伏/储能/液冷上百项），
      // 一屏却只看得到一个 tab —— 其余几百项算完就扔，还把它们一起拖进参数树的 diff。
      const cfgNow = this.currentSettingsTab
      if (!cfgNow) return
      const needKeys = [cfgNow.dataKey, cfgNow.numericKey, cfgNow.extraSwitchKey]
      const panels = sourcePanels.filter(c => needKeys.indexOf(c.dataKey) !== -1)
      // 原始值快照：值没变就整项跳过（见下面快路径）
      const seenCache = this._paramSeen || (this._paramSeen = {})
      // 参数对象已非响应式：只有确实写回了新值，才递增一次版本号通知面板重渲染
      let echoChanged = false

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
          if (p.currentValue !== nextValue) { p.currentValue = nextValue; echoChanged = true }
          if (p.currentText !== nextText) { p.currentText = nextText; echoChanged = true }
          if (p.options) {
            // 位命令：帧上报单比特 0/1，选项值为 0x00000000/0x00010000，先归一化再匹配
            const matchRaw = p.bitHex ? (Number(raw) ? '0x00010000' : '0x00000000') : raw
            const opt = p.options.find(o => String(o.value) === String(matchRaw))
            const nextLabel = opt ? opt.label : (raw !== undefined ? String(raw) : '--')
            if (p.currentLabel !== nextLabel) { p.currentLabel = nextLabel; echoChanged = true }
            if (p.bitHex && p.currentValue !== matchRaw) { p.currentValue = matchRaw; echoChanged = true }
          } else {
            // 记下这次的原始值 + 落库值，下次同步就能用快路径直接跳过
            seenCache[seenKey] = { raw: raw, v: nextValue }
          }
        })
      })
      // 一次同步哪怕改了 300 项，也只通知一次；面板自己重渲染，父页面不参与
      if (echoChanged) this._bumpEcho()
    },
    /**
     * 参数树已移出响应式，值写回后必须显式通知，SettingsPanel 才会重渲染。
     * 这是「参数对象 → 渲染层」的唯一通知出口，所有写 currentValue/currentText/
     * currentLabel/_pending 的地方都要调用一次（同步侧已合并成一次）。
     */
    _bumpEcho() {
      notifyParamChange()
    },
    /**
     * 设置项显示层：下发后的 3s 乐观窗口内读 _opt*（刚下发的值），其余时间读实时回读值。
     * 不直接改 currentValue / currentLabel / currentText 的原因：
     *   1) 实时帧不被污染，设备在这 3s 内回读的新值会原样留在 currentValue 上；
     *   2) 回显心跳、控制回读帧一行都不用动，3s 到期自动就是最新实时值，
     *      设备不上报时也不会一直假显示下发值。
     * 三个 getter 只调模块级纯函数（见上方注释），不碰 this。
     */
    /** 下发成功后挂 3s 乐观显示；到期清标记并通知面板重读实时值 */
    _holdOptimistic(p, value, label, text) {
      if (!p || this._unloaded) return
      if (p._optTimer) { clearTimeout(p._optTimer); p._optTimer = null }
      p._optValue = value
      p._optLabel = label
      p._optText = text
      p._optUntil = Date.now() + SETTINGS_OPTIMISTIC_MS
      p._optTimer = setTimeout(() => {
        p._optTimer = null
        p._optUntil = 0
        p._optValue = undefined
        p._optLabel = undefined
        p._optText = undefined
        if (this._unloaded) return
        // 参数树非响应式：必须显式通知，面板才会重新调用 getter 读实时值
        this._bumpEcho()
      }, SETTINGS_OPTIMISTIC_MS)
      this._bumpEcho()
    },
    getParamCurrentValue(p) {
      return paramDisplayValue(p)
    },
    /** 模板辅助：通过 dataKey 动态获取参数数组（小程序模板不支持 this[变量]） */
    getParams(dataKey) {
      return this[dataKey] || []
    },
    /**
     * 切 tab 时把所有设置分组的编辑开关复位，按钮统一回到初始「修改」。
     * 只写当前为 true 的项：稳态下零响应式写入，不给切换帧增加渲染负担。
     */
    _resetEditingOnTabChange() {
      for (let i = 0; i < SETTINGS_EDIT_KEYS.length; i++) {
        const k = SETTINGS_EDIT_KEYS[i]
        if (this[k]) this[k] = false
      }
    },
    /** 模板辅助：通过 editKey 动态获取编辑状态 */
    isEditing(editKey) {
      return !!this[editKey]
    },
    getParamCurrentLabel(p) {
      return paramDisplayLabel(p)
    },
    getParamCurrentText(p) {
      return paramDisplayText(p)
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
      if (this[key]) {
        // 进入编辑态前把暂存帧落库：编辑/下发读的必须是最新一帧
        this.flushPendingFramesNow()
        // 立即回显一次，不再等 1s 节流定时器（点「修改」当帧就能看到当前值）
        this._doSyncSettingsFromRealtime()
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
      bundle.commands.forEach((c, i) => {
      })
      if (bundle.fallbacks.length) {
      }
      try {
        this.client.setDeviceType(deviceType)
        await this.client.sendControlBatch(bundle.commands, deviceType)
        return { ok: true, fallbacks: bundle.fallbacks }
      } catch (e) {
        uni.showModal({ title: '下发失败', content: this.friendlyErrorText(e, '设备连接已断开，请重新连接后重试'), showCancel: false })
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
      this._bumpEcho()
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
          this._bumpEcho()
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
      this._bumpEcho()
    },
    async onSwitchParamClick(payload, legacyOpt) {
      // 门禁放最前：未点「修改」时连解析都不做，直接提示
      if (!this._guardSettingsEdit()) return
      const resolved = this._resolvePanelEvent(payload, legacyOpt)
      const p = resolved.param
      const opt = resolved.option
      // 排查用：确认事件载荷与解析结果（小程序事件桥异常时这里能一眼看出丢的是哪一段）
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
      // 用「显示值」判断：3s 乐观窗口内用户看到的就是刚下发的值，重复点同一项直接提示
      if (String(paramDisplayValue(p)) === String(opt.value)) {
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

          await this.client.sendControl(sendField, sendValue, deviceType, overrides)
          if (p.pulse && p.options) {
            // 脉冲型命令（故障复位/启动/停机…）保持原行为：值只在动作瞬间有效，
            // 1.2s 后本地回落到「不执行」，否则会一直亮着「执行」，且再次点击会被
            // 「当前已是 执行」的守卫拦掉，导致无法重复下发。这类项不进 3s 乐观窗口。
            p.currentValue = opt.value
            p.currentLabel = opt.label
            this._bumpEcho()
            const idle = p.options.find(o => String(o.value) === '0')
            if (idle) {
              if (p._pulseTimer) clearTimeout(p._pulseTimer)
              p._pulseTimer = setTimeout(() => {
                p.currentValue = idle.value
                p.currentLabel = idle.label
                p._pulseTimer = null
                this._bumpEcho()
              }, 1200)
            }
          } else {
            // 3s 乐观显示：期间「当前 xxx」与分段按钮高亮保持刚下发的值；
            // 不写 currentValue/currentLabel，实时回读值继续由回显帧维护，
            // 3s 到期后 getter 自动回落到最新实时值（设备已回读就是新值）。
            this._holdOptimistic(p, opt.value, opt.label)
          }
          this.opToast = `已下发：${p.label} - ${opt.label}`
          this.showOpToast = true
          setTimeout(() => { this.showOpToast = false }, 2500)
        } catch (e) {
          uni.showModal({ title: '下发失败', content: this.friendlyErrorText(e, '设备连接已断开，请重新连接后重试'), showCancel: false })
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

            try {
              this.client.setDeviceType(this.editingParamDeviceType)
              await this.client.sendControl(p.field, rawVal, this.editingParamDeviceType, overrides)
              // Optimistic update
              const scaled = rawVal / (p.scale || 1) + (p.offset || 0)
              p.currentValue = scaled
              p.currentText = this.formatValue(scaled, p.decimals !== undefined ? p.decimals : 1)
              this._bumpEcho()
              this.opToast = `${p.label}已修改为 ${p.currentText}${p.unit ? ' ' + p.unit : ''}`
              this.showOpToast = true
              setTimeout(() => { this.showOpToast = false }, 2500)
            } catch (e) {
              uni.showModal({ title: '下发失败', content: this.friendlyErrorText(e, '设备连接已断开，请重新连接后重试'), showCancel: false })
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
    /** 设备卡齿轮：直达系统权限管理（现场把「附近的设备」改为允许后返回即自动重试） */
    goPermission() {
      // #ifdef APP-PLUS
      const ok = openPermissionSettings()
      if (!ok) {
        uni.showToast({
          title: '请到系统设置里把「附近的设备」设为允许',
          icon: 'none'
        })
      }
      // #endif
      // #ifndef APP-PLUS
      // 小程序 / H5 没有系统权限管理页：改为提示连接设备热点（名称不清楚时给示例）
      const saved = getSavedWifi()
      this.wifiTipTitle = '连接设备热点'
      this.wifiTipContent = '请将手机连接至' + describeDeviceWifi(saved.ssid) +
        '。连接成功后，本页面将自动继续监测。'
      this.wifiTipVisible = true
      // #endif
    },
    /** WiFi 提示弹窗「知道了」：带用户去设置 / 连接设备 WiFi */
    onWifiTipOk() {
      this.wifiTipVisible = false
      const saved = getSavedWifi()
      // APP 端可直达系统 WiFi 设置页
      if (openWifiSettings()) return
      // 小程序 / H5 无法打开系统 WiFi 设置：有热点名就触发系统连接确认框，
      // 系统里通常已保存该热点，用户在确认框里点连接即可。
      if (saved.ssid && typeof uni.connectWifi === 'function') {
        if (saved.password) {
          try { uni.setClipboardData({ data: saved.password }) } catch (e) { }
        }
        connectWifi(saved.ssid, saved.password, () => !this._unloaded && !this._paused)
          .then(ok => {
            if (!ok) uni.showToast({ title: '请在系统 WiFi 设置中连接设备热点', icon: 'none' })
          })
        return
      }
      uni.showToast({ title: '请打开系统 WiFi 设置连接设备热点', icon: 'none' })
    },
    /** 未开启直连时的「前往配置」入口（保留原配置页跳转） */
    goConfig() {
      uni.navigateTo({ url: '/pages/profile/direct-device-config' })
    },
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
  /* ⚡ 页面级滚动：不再写死 100vh + overflow:hidden。滚动交给 WebView 原生页面滚动，
     不占 setData 通道，也没有原生 scroll-view 每次重算几千节点滚动区域的开销。 */
  min-height: 100vh;
  /* 给吸底导航留位置，避免最后一张卡片被盖住 */
  padding-bottom: 132rpx;
  padding-bottom: calc(132rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(132rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

/* ⚡ 吸顶头：navbar + 设备卡 + 标签栏作为一个整体吸顶。
   sticky 在页面滚动时由 WebView 合成，不产生独立原生 frame，
   所以不会出现旧实现里 scroll-view 原生层滞后一帧的白色残影。

   ⚠️ 必须给 z-index：页面级滚动下，后面的 .connected-view 是普通流内容，
   一旦里面的卡片带了自身层叠上下文（阴影/圆角/border），滚动经过吸顶头时
   就会绘制在它之上 —— 现象是「往上划时概览卡片盖住导航栏，只剩蓝色设备卡
   和 tab 栏露出来」。这里的 z-index 是 sticky 正常工作的必要条件，
   和旧实现「原生 scroll-view 的合成层残影」不是同一个问题，不会复发残影。 */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #f4f6f9;
}

.connected-view {
  /* 页面级滚动后不再需要 flex 高度约束，内容自然撑开 */
  width: 100%;
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
  padding: 0rpx 0 14rpx;
  border-bottom: none;
  box-shadow: none;
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
  font-size: 28rpx;
  line-height: 1.25;
  letter-spacing: 0.4rpx;
  color: #5f6a79;
  font-weight: 500;
  background: transparent;
  border: none;
  border-radius: 999rpx;
  white-space: nowrap;

  /* 监测组标题较短：等分宽度铺满 */
  &.tab-monitor {
    flex: 1 1 0;
    padding: 12rpx 8rpx;
  }

  & + .tab-item {
    margin-left: 4rpx;
  }

  /* 点击反馈只改背景色：opacity / transform 会把元素提升为合成层，
     微信渲染层在切 tab 那一帧提升合成层就会留下白色残影 */
  &:active {
    background: #eef4ff;
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

/* 静态渲染的两组标签：不属于当前组的用 display:none 隐藏，
   切换组时节点不增删，避免整批重建造成的空轨道 */
.tab-item.tab-hidden {
  display: none;
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
    font-size: 34rpx;
    font-weight: 500;
    color: #2b2f36;
  }

  .empty-sub {
    margin-top: 14rpx;
    font-size: 28rpx;
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
  font-size: 28rpx;
}

/* 数据区：普通流，不再撑满剩余高度，由页面整体滚动 */
.content-area {
  width: 100%;
  background: #f4f6f9;
}

/* ========== 底部主导航 tab：监测 / 设置 ========== */
.bottom-tabbar {
  /* 页面级滚动：吸底导航改为 fixed，始终停在视口底部。
     z-index 必须高于内容流：否则滚动到底时最后一张卡片会盖住吸底栏。
     与吸顶头同为 100，两者分居上下、没有重叠区域，不会互相遮挡。 */
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background-color: #ffffff;
  border-top: 1rpx solid #eef0f4;
  box-shadow: 0 -4rpx 16rpx rgba(24, 39, 64, 0.05);
  /* iOS 安全区适配 */
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  gap: 2rpx;

  /* 不用 transform / opacity：点「监测/设置」的瞬间提升合成层，
     会连带上方 navbar 与设备卡片出现一帧白色残影 */
  &:active {
    background: #f4f6f9;
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
}

.bottom-tab-label {
  font-size: 27rpx;
  line-height: 1;
  letter-spacing: 0.4rpx;
  color: #8a94a1;
}

/* 数据容器：普通 view + 页面级滚动。面板挂载后靠 panel-hidden class 缓存，只有一块可见。 */
.module-scroll {
  width: 100%;
  min-height: 100rpx;
  box-sizing: border-box;
  /* 显式底色：切 tab 的瞬间若还没画内容，露出的是浅灰而非默认白块 */
  background: #f4f6f9;
}
.panel-slot {
  display: block;
  width: 100%;
  /* CSS containment：把每块面板声明为独立的布局根。
     7 块面板常驻 DOM 时，任意一块 display:none ↔ block 都可能让 webview
     重算整页布局（sticky 头、吸底栏、页面滚动高度全部跟着过一遍）。
     contain:layout 告诉浏览器这块子树内部怎么排都不影响外部兄弟节点，
     重排范围收敛到面板自身。老内核不支持时该声明被忽略，退回原行为。 */
  contain: layout style;
}
/* ⚡ 面板可见性：不能用 v-show。
   微信小程序平台把 v-show 编译成 `hidden` 属性，而 `hidden` 的 display:none
   会被元素上任意 CSS `display` 规则（如 .panel-slot{display:block}）覆盖，
   导致所有面板永远显示、切 tab 内容不切换。改用 class 切换，特异性高于
   .panel-slot，MP / APP 双端都可靠生效。 */
.panel-slot.panel-hidden {
  display: none;
}

/* 未挂载面板占位：点击帧里先顶住高度，真正的挂载在下帧完成，避免「点一下冻住」 */
.panel-skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40rpx;
  box-sizing: border-box;
}

.sk-spinner {
  width: 56rpx;
  height: 56rpx;
  border: 5rpx solid #e3e8ef;
  border-top-color: #2f7cf6;
  border-radius: 50%;
  animation: sk-rotate 0.8s linear infinite;
}

.sk-text {
  margin-top: 20rpx;
  font-size: 27rpx;
  color: #9aa4b1;
  letter-spacing: 0.5rpx;
}

@keyframes sk-rotate {
  to { transform: rotate(360deg); }
}

.content {
  /* 与 DeviceCard 的 20rpx 外边距对齐 */
  padding: 20rpx;
  padding-top: unset;
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
  font-size: 28rpx;
  font-weight: 500;
  color: #6b7480;
}

.settings-placeholder-sub {
  margin-top: 10rpx;
  font-size: 27rpx;
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
    background: #2770e0;
  }
}

/* 平台占位：已删除。
   导航栏改为流内后不再需要手写 placeholder。旧的 iOS 分支只有 44px 且自带白底，
   与 header 实际 103px 严重不符，白色块就是从这个差值里漏下去盖住设备卡片的。
   platformClass 仅保留给后续平台差异化样式使用。 */

/* ========== 设置面板样式 ========== */
/* ========== 确认弹窗 ========== */
/* ========== 操作反馈 Toast ========== */

/* ========== APP 内 [perf] 日志面板（默认不渲染，仅长按顶部区域时显示） ========== */
.perf-log-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  /* 不用半透明遮罩：全屏 rgba 层会让底层每次 display 翻转都触发整屏混合，
     开着面板切 tab 时反而会把测量的耗时放大。改成透明 + 卡片投影。 */
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.perf-log-card {
  width: 92%;
  background: #ffffff;
  border: 1rpx solid #dfe3e9;
  border-radius: 16rpx;
  box-shadow: 0 12rpx 48rpx rgba(16, 24, 38, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.perf-log-head {
  padding: 20rpx 24rpx 16rpx;
  border-bottom: 1rpx solid #e8ebf0;
}

.perf-log-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #17202e;
}

.perf-log-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 18rpx;
}

.perf-log-btn {
  font-size: 26rpx;
  color: #2f7cf6;
  padding: 8rpx 22rpx;
  margin-right: 16rpx;
  margin-bottom: 10rpx;
  border: 1rpx solid #d6e2fb;
  border-radius: 8rpx;
}

.perf-log-close {
  color: #6b7280;
  border-color: #dfe3e9;
}

.perf-log-body {
  height: 56vh;
  padding: 8rpx 20rpx;
}

.perf-log-line {
  padding: 10rpx 0;
  border-bottom: 1rpx solid #f0f2f5;
}

.perf-log-text {
  font-size: 23rpx;
  line-height: 1.5;
  color: #333b47;
  word-break: break-all;
}

.perf-log-empty {
  padding: 48rpx 0;
  text-align: center;
}

.perf-log-tip {
  font-size: 22rpx;
  color: #9099a6;
  padding: 14rpx 24rpx;
  border-top: 1rpx solid #e8ebf0;
}
</style>
