<template>
  <view class="container">
    <!-- 头部区域 - 包含安全区域占位和标题栏 -->
    <view class="header">
      <view class="header-safe-area"></view>
      <view class="header-content">
        <view class="header-left">
          <image v-if="currentTab === 0" src="/static/images/logo.png" class="header-icon"></image>
          <text class="title">{{ currentTitle }}</text>
        </view>
        <!-- 返回按钮 - 从设备列表进入时显示 -->
        <!-- <view v-if="showBackBtn" class="back-btn" @click="goBackToList">
          <uni-icons type="back" size="28" color="#333"></uni-icons>
        </view> -->
      </view>
    </view>

    <!-- 内容区域：WebView 原生页面滚动（与 direct-device.vue 同方案）。
         APP 端内嵌 scroll-view 在旧 WebView 上无法可靠滚动（滑不动/滑不到底），
         纵向滚动交给页面本身；头部与底部导航 fixed，内容用 padding 让出位置。
         切换设备期间整块内容 visibility:hidden，避免图表 canvas / z-index 较高的
         装饰块透过加载遮罩露出来 -->
    <view class="content-pages" :class="{ 'content-pages--switching': deviceSwitching && !showDeviceList }">
      <!-- 设备列表页面 -->
      <!-- 个人中心 - 优先级最高，始终可以访问 -->
      <view v-if="currentTab === 2" class="page-item">
        <Profile ref="profile"></Profile>
      </view>
      <!-- 设备列表页面 -->
      <view v-else-if="showDeviceList" class="page-item device-list-page">
        <DeviceList ref="deviceList" @selectDevice="handleDeviceSelect"></DeviceList>
      </view>

      <!-- 监测页面 -->
      <view v-else-if="currentTab === 0" class="page-item">
        <Monitor ref="monitor"></Monitor>
      </view>

      <!-- 系统页面 -->
      <view v-else-if="currentTab === 1" class="page-item">
        <System ref="system"></System>
      </view>

      <!-- 性能分析页面 -->
      <view v-else-if="currentTab === 3" class="page-item">
        <PerformanceAnalysis ref="performance" :embedded="true"></PerformanceAnalysis>
      </view>
    </view>

    <!-- 设备切换加载态：盖住内容区，避免闪出上一台设备的数据 -->
    <view v-if="deviceSwitching && !showDeviceList" class="device-switch-mask">
      <view class="switch-loading">
        <view class="switch-spinner"></view>
        <text class="switch-loading-text">正在加载设备数据…</text>
      </view>
    </view>

    <!-- 底部TabBar -->
    <view class="tab-bar-container">
      <view class="tab-bar">
        <!-- 监测Tab - 始终显示 -->
        <view class="tab-item" :class="{ 'active': currentTab === 0 }" @click="switchTab(0)">
          <view class="tab-icon">
            <image :src="currentTab === 0 ? activeIcons[0] : inactiveIcons[0]" mode="widthFix" />
          </view>
          <text class="tab-text">监测</text>
        </view>
         <!-- 性能分析Tab - 与系统Tab同条件显示 -->
        <view v-if="!showDeviceList && esIds.length > 0 && selectedDeviceId" class="tab-item"
          :class="{ 'active': currentTab === 3 }" @click="switchTab(3)">
          <view class="tab-icon">
            <image :src="currentTab === 3 ? activeIcons[3] : inactiveIcons[3]" mode="widthFix" />
          </view>
          <text class="tab-text">性能分析</text>
        </view>
        <!-- 系统Tab - 非设备列表页面且有设备且选择设备后才显示 -->
        <view v-if="!showDeviceList && esIds.length > 0 && selectedDeviceId" class="tab-item"
          :class="{ 'active': currentTab === 1 }" @click="switchTab(1)">
          <view class="tab-icon">
            <image :src="currentTab === 1 ? activeIcons[1] : inactiveIcons[1]" mode="widthFix" />
          </view>
          <text class="tab-text">系统</text>
        </view>
       
        <!-- 我的Tab - 始终显示 -->
        <view class="tab-item" :class="{ 'active': currentTab === 2 }" @click="switchTab(2)">
          <view class="tab-icon">
            <image :src="currentTab === 2 ? activeIcons[2] : inactiveIcons[2]" mode="widthFix" />
          </view>
          <text class="tab-text">我的</text>
        </view>
      </view>
      <view class="safe-area-bottom"></view>
    </view>
  </view>
</template>

<script>
import Monitor from '../monitor.vue'
import Profile from '../profile.vue'
import System from '../system.vue'
import PerformanceAnalysis from '../performance-analysis/performance-analysis.vue'
import DeviceList from '../components/device-list.vue'
import { findUserInfoByCodeId, getUserCenterInfo, findEnergyStation } from '@/api/user'
import { getDeviceByAreaId } from '@/api/devices'
import { realtimeDataProvider } from '@/service/websocket'

export default {
  components: {
    Monitor,
    Profile,
    System,
    PerformanceAnalysis,
    DeviceList
  },
  computed: {
    // 是否显示设备列表
    showDeviceList() {
      return this.esIds.length === 0 || (this.esIds.length >= 2 && !this.selectedDeviceId) || this.fromProfile
    },

    // 是否显示返回按钮
    showBackBtn() {
      return this.showDeviceList && this.selectedDeviceId !== null
    },

    // 当前页面标题
    currentTitle() {
      if (this.currentTab === 0) {
        return '光储直柔能源站EMS'
      } else if (this.currentTab === 1) {
        return '系统管理'
      } else if (this.currentTab === 2) {
        return '我的'
      } else if (this.currentTab === 3) {
        return '性能分析'
      }
      return '光储直柔能源站EMS'
    }
  },
  data() {
    return {
      tabs: ['监测', '系统', '我的', '性能分析'],
      currentTab: 0,
      activeColor: '#007aff',
      inactiveColor: '#8a8a8a',
      activeIcons: {
        0: '/static/images/monitor-active.png',
        1: '/static/images/system-pre.png',
        2: '/static/images/mine-active.png',
        3: '/static/images/report-active.png'
      },
      inactiveIcons: {
        0: '/static/images/monitor.png',
        1: '/static/images/system-nor.png',
        2: '/static/images/mine.png',
        3: '/static/images/report.png'
      },
      scrollPositions: { 0: 0, 1: 0, 2: 0, 3: 0 },
      selectedDeviceId: null,
      fromProfile: false,
      isDeviceListLoaded: false,
      deviceListLoading: false,
      isNavigating: false, // 防止重复跳转的节流锁
      lastClickTime: 0, // 上次点击时间戳，用于防重复点击
      device171FList: [],
      device171FRegistered: false,
      deviceSwitching: false, // 设备切换中：显示加载态，屏蔽上一台设备的残留数据
      refreshing: false, // 下拉刷新进行中（页面级 onPullDownRefresh 的去重锁）
      esIds: [] // 响应式设备列表（替代 computed，确保 reLaunch 后立即可用）
    }
  },
  mounted() {
    this._initEsIds()
    const userInfo = this._getUserInfo();
    if (!userInfo || !userInfo.isLogin || !userInfo.sessionId) {
      uni.redirectTo({ url: '/pages/login/login' })
      return
    }
    // 登录后兜底：确保云端 WebSocket 已连接
    try {
      const { realtimeDataProvider } = require('@/service/websocket.js');
      if (realtimeDataProvider && typeof realtimeDataProvider.ensureConnected === 'function') {
        realtimeDataProvider.ensureConnected();
      }
    } catch (e) {
      console.warn('[mounted] ensureConnected 失败:', e.message);
    }
    // 切换设备直达：URL 参数已带完整设备清单，立即注册（不再重复拉取用户信息/站点/设备清单），
    // 避免新页面在等待接口期间停留在旧数据上
    if (this._fastSwitchList && this._fastSwitchList.length) {
      const fastList = this._fastSwitchList
      this._fastSwitchList = null
      this.registerDevices(fastList)
      if (realtimeDataProvider.getDeviceList().length) {
        this.isDeviceListLoaded = true
        // 后台只刷新站点清单，不重新注册实时模型（避免刚加载的新数据被二次清空）
        this.$nextTick(() => { this.fetchDeviceList({ stationsOnly: true }) })
      } else {
        // 参数中的设备清单无效，回退到完整加载链路
        this.fetchDeviceList()
      }
    } else if (!this.isDeviceListLoaded && !this.deviceListLoading) {
      this.fetchDeviceList()
    }
    // 注册实时数据回调：使用 subscribe 多订阅者模式（避免与 Monitor.vue 的 onDataUpdate 单槽互相覆盖）
    this._unsubscribeRealtime = realtimeDataProvider.subscribe(() => {
      this.device171FList = [...realtimeDataProvider.getDeviceList()]
    })
    // 订阅设备切换态：注册即回放当前状态，保证 redirectTo 出来的新页面也立即进入加载态
    this._unsubscribeSwitch = realtimeDataProvider.subscribeSwitchState(v => {
      this.deviceSwitching = !!v
    })
    // 立即刷一次，避免首次 render 前订阅回调没机会触发
    this.device171FList = [...realtimeDataProvider.getDeviceList()]
  },
  onHide() {
    // 页面隐藏（进入子页面）时暂停首页子组件们的订阅通知，避免后台渲染抢主线程
    realtimeDataProvider.setSubscribersPaused(true)
  },
  onUnload() {
    if (typeof this._unsubscribeRealtime === 'function') {
      this._unsubscribeRealtime()
      this._unsubscribeRealtime = null
    }
    if (typeof this._unsubscribeSwitch === 'function') {
      this._unsubscribeSwitch()
      this._unsubscribeSwitch = null
    }
    // 离页前清掉下拉刷新的定时器，避免回弹动画残留到下一个页面
    clearTimeout(this._refreshTimer)
    clearTimeout(this._refreshTimeout)
    this._refreshTimer = null
    this._refreshTimeout = null
  },
  onLoad(options) {
    // 优先使用完整设备对象参数 - 直接处理，不调用handleDeviceSelect避免循环跳转
    if (options.device) {
      try {
        const device = JSON.parse(decodeURIComponent(options.device))
        const deviceId = device.id || device.esId
        this.selectedDeviceId = deviceId
        this.fromProfile = false
        // 清除fromProfile存储，防止onShow覆盖状态
        uni.removeStorageSync('fromProfile')
        // 切换设备：立即隔离上一台设备的数据（幂等），新页面只显示加载态与此设备的数据
        realtimeDataProvider.beginDeviceSwitch(deviceId)
        // 参数中已带完整设备清单 → mounted 直达注册，跳过重复的接口请求
        this._fastSwitchList = Array.isArray(device.list) && device.list.length ? device.list : null
        this.$store.commit('changeCurrentSelectDevice', device)
        this.updateCurrentEsRole(deviceId)
      } catch (e) {
        console.error('解析device参数失败:', e)
      }
    } else if (options.esId) {
      // 兼容旧的esId参数
      const device = { id: options.esId }
      this.selectedDeviceId = options.esId
      this.fromProfile = false
      uni.removeStorageSync('fromProfile')
      realtimeDataProvider.beginDeviceSwitch(options.esId)
      this.$store.commit('changeCurrentSelectDevice', device)
      this.updateCurrentEsRole(options.esId)


    } else {
      // 恢复上次选择的设备
      const savedDevice = uni.getStorageSync('currentSelectDevice')
      if (savedDevice) {
        const deviceId = savedDevice.id || savedDevice.esId
        this.selectedDeviceId = deviceId
        this.$store.commit('changeCurrentSelectDevice', savedDevice)
        this.updateCurrentEsRole(deviceId)
      }
    }
    this.checkFromProfile()
  },
  onShow() {
    this.checkFromProfile()
    // 只从 storage 初始化 esIds，不做任何 store 操作
    // 所有 store 写入统一由 fetchDeviceList 完成，避免竞态
    if (!this.isDeviceListLoaded) {
      this._initEsIds()
    }
    // 回到前台：解除订阅暂停 + 补发当前快照 + 重放设备注册（服务端收到 register 会立刻推一帧），
    // 否则后台期间被暂停/超时的实时值一直是 '--'，要手动刷新才恢复
    realtimeDataProvider.resumeRealtime()
    // 子页面兜底：快速控制 onLoad 会 clearDeviceState() 清空 provider 的设备清单与监听
    // （策略配置卸载时会 unregister()），resumeRealtime 只能补注册、无法重建设备模型。
    // 清单为空或没有任何已注册 barCode 时重新拉取注册，与「切回监测 tab」的恢复路径一致，
    // 否则从子页面返回后实时数据永远是 '--'，必须切一次 tab 才有数据
    if ((!realtimeDataProvider.getDeviceList().length || !realtimeDataProvider.hasRegisteredCodes())
      && !this.deviceListLoading && !this.deviceSwitching) {
      this.fetchDeviceList()
    }
    // 确保订阅者已注册（onShow 可能在 mounted 之前触发？uni-app 通常是 mounted → onShow，
    // 但 reLaunch/redirectTo 后新页的 onShow 先于旧页销毁，做个兜底）
    if (!this._unsubscribeRealtime) {
      this._unsubscribeRealtime = realtimeDataProvider.subscribe(() => {
        this.device171FList = [...realtimeDataProvider.getDeviceList()]
      })
    }
    // 切换态订阅兜底：onShow 可能早于 mounted（redirectTo 后新页面先走 onShow）
    if (!this._unsubscribeSwitch) {
      this._unsubscribeSwitch = realtimeDataProvider.subscribeSwitchState(v => {
        this.deviceSwitching = !!v
      })
    }
    this.device171FList = [...realtimeDataProvider.getDeviceList()]
  },
  onReady() {
    this.scrollToTop()
  },
  /** 页面级滚动：滚动位置只记到实例属性，滚动过程零渲染 */
  onPageScroll(e) {
    this._realScrollTop = e.scrollTop
  },
  /** 页面级触底：分派给当前 tab 的 loadMore */
  onReachBottom() {
    this.tabbarPageScrollLower()
  },
  /** 页面级下拉刷新（pages.json 的 enablePullDownRefresh 已开启） */
  onPullDownRefresh() {
    this._startPullRefresh()
  },
  methods: {
    /**
     * 下拉刷新的实际分派逻辑（onPullDownRefresh 顶层钩子调用）。
     * 监测页保持实时连接，只补发快照，不重建连接、不重复拉取接口。
     */
    _startPullRefresh() {
      if (this.refreshing) {
        uni.stopPullDownRefresh()
        return
      }
      this.refreshing = true
      const startedAt = Date.now()
      // 请求异常或一直不返回时兜底收起，避免刷新圈一直转
      clearTimeout(this._refreshTimeout)
      this._refreshTimeout = setTimeout(() => {
        this._refreshTimeout = null
        this._stopRefresh()
      }, 8000)
      let task = null
      try {
        task = this._refreshCurrentView()
      } catch (e) {
        console.warn('[index] 下拉刷新失败:', e && e.message)
      }
      Promise.resolve(task).then(
        () => this._finishRefresh(startedAt),
        (e) => {
          console.warn('[index] 下拉刷新失败:', e && e.message)
          this._finishRefresh(startedAt)
        }
      )
    },
    /** 最短展示 600ms 后收起，避免动画一闪而过 */
    _finishRefresh(startedAt) {
      if (!this.refreshing) return
      const rest = 600 - (Date.now() - (startedAt || 0))
      clearTimeout(this._refreshTimer)
      if (rest <= 0) {
        this._stopRefresh()
        return
      }
      this._refreshTimer = setTimeout(() => {
        this._refreshTimer = null
        this._stopRefresh()
      }, rest)
    },
    _stopRefresh() {
      clearTimeout(this._refreshTimer)
      clearTimeout(this._refreshTimeout)
      this._refreshTimer = null
      this._refreshTimeout = null
      // 页面级下拉刷新：显式收起转圈（重复调用幂等）
      uni.stopPullDownRefresh()
      this.refreshing = false
    },
    _refreshCurrentView() {
      // 设备切换期间不做任何刷新，避免与切换流程抢注册、清掉刚到位的数据
      if (this.deviceSwitching) return null
      // 设备列表：重新获取站点与设备清单
      if (this.showDeviceList) return this.fetchDeviceList()
      if (this.currentTab === 0) {
        // 监测：解除订阅暂停 + 补发当前快照 + 重放注册，让服务端立刻推一帧；
        // 不重新拉接口、不重建连接，避免实时值被清空闪成 '--'
        realtimeDataProvider.resumeRealtime()
        return null
      }
      if (this.currentTab === 2) {
        const profile = this.$refs.profile
        if (profile && typeof profile.refreshUserInfo === 'function') {
          return profile.refreshUserInfo()
        }
        return null
      }
      if (this.currentTab === 3) {
        // 性能分析：重新拉取当前设备各卡片数据
        const performance = this.$refs.performance
        if (performance && typeof performance.loadAll === 'function') {
          return performance.loadAll()
        }
        return null
      }
      // 系统页为静态入口，无数据可刷新，直接收起动画
      return null
    },
    checkFromProfile() {
      const fromProfile = uni.getStorageSync('fromProfile')
      if (fromProfile === 'true') {
        this.selectedDeviceId = null
        this.fromProfile = true
        uni.removeStorageSync('fromProfile')
        this.$store.commit('changeCurrentSelectDevice', {})
        if (!this.isDeviceListLoaded) {
          this.fetchDeviceList()
        }
      }
    },
    // 初始化 esIds（从 storage 或 Vuex 读取到 data 属性）
    _initEsIds() {
      const lifeData = uni.getStorageSync('lifeData') || {};
      const stored = lifeData.userInfo?.esIds;
      if (stored && Array.isArray(stored) && stored.length > 0) {
        this.esIds = stored;
        return;
      }
      const vi = this._getUserInfo();
      if (vi.esIds && Array.isArray(vi.esIds) && vi.esIds.length > 0) {
        this.esIds = vi.esIds;
        return;
      }
      this.esIds = [];
    },

    // 从 storage 读取用户信息（比 Vuex mapState 更可靠）
    _getUserInfo() {
      const lifeData = uni.getStorageSync('lifeData') || {};
      return lifeData.userInfo || this.$store.state.userInfo || this.userInfo || {};
    },

    checkLoginStatus() {
      const userInfo = this._getUserInfo();

      if (!userInfo || !userInfo.isLogin || !userInfo.sessionId) {
        uni.redirectTo({
          url: '/pages/login/login'
        })
        return
      }

      if (!this.isDeviceListLoaded && !this.deviceListLoading) {
        this.fetchDeviceList()
      }
    },

    // 获取设备列表 - 统一入口，消除竞态
    // options.stationsOnly：切换设备后的后台静默刷新，只更新站点清单与用户信息，
    // 不重新选择站点、不重复注册实时模型（否则刚加载的新实时数据会被二次清空）
    async fetchDeviceList(options = {}) {
      if (this.deviceListLoading) return
      this.deviceListLoading = true

      try {
        const storeUserInfo = this._getUserInfo();
        const userId = storeUserInfo.userId
        const loginType = storeUserInfo.loginType
        let userData = {}
        let energyStations = []
        if (loginType === 'account') {
          const userRes = await getUserCenterInfo(userId)
          userData = (userRes.code === 200 && userRes.data) ? userRes.data : {}
          const stationUserId = [1, 2].includes(userData.roleId) ? null : userId
          const stationRes = await findEnergyStation('microStation', stationUserId)
          energyStations = (stationRes.status === 200 && stationRes.data) ? stationRes.data.map(item => ({ ...item, esId: item.id })) : []
        } else {
          const userInfoRes = await findUserInfoByCodeId(userId)
          // console.log('[数据流] findUserInfoByCodeId 响应:', JSON.stringify(userInfoRes).slice(0, 200))
          userData = (userInfoRes.code === 200 && userInfoRes.data) ? userInfoRes.data : {}
          energyStations = userData.energyStations || []
          // console.log('[数据流] energyStations 数量:', energyStations.length)
        }

        const userInfo = { ...storeUserInfo, ...userData }
        userInfo.esIds = energyStations
        userInfo.energyStations = energyStations
        userInfo.esUsers = userData.es_users || []
        if (!userInfo.sessionId) {
          userInfo.sessionId = storeUserInfo.sessionId
        }
        this.$store.commit('SET_LOGIN', userInfo)
        // 后台静默刷新返回空清单时不覆盖已有列表，避免误判为「无设备」而跳回设备列表页
        if (!options.stationsOnly || energyStations.length > 0) {
          this.esIds = energyStations
        }
        // console.log('[数据流] 设置 esIds:', this.esIds.length, '个')

        if (options.stationsOnly) {
          this.isDeviceListLoaded = true
          return
        }

        if (energyStations.length >= 1) {
          // 优先沿用已选中的设备（来自 device 参数或本地存储），避免切换设备后被重置为第一台
          const prevDevice = this.$store.state.currentSelectDevice || {}
          const selectedId = prevDevice.id || prevDevice.esId || this.selectedDeviceId
          let station = energyStations[0]
          if (selectedId) {
            const matched = energyStations.find(item => (item.id || item.esId) === selectedId)
            if (matched) {
              station = { ...matched, list: matched.list || prevDevice.list }
            }
          }
          const stationId = station.id || station.esId
          this.selectedDeviceId = stationId
          this.updateCurrentEsRole(stationId)

          const areaId = station.areaId
          try {
            const deviceInfo = await getDeviceByAreaId(areaId)
            const list = deviceInfo?.data?.list || []
            // console.log('[数据流] 设备列表长度:', list.length)

            // 接口返回空列表时保留已缓存的设备列表，避免切换后无数据
            if (list.length > 0 || !station.list) {
              station.list = list
            }
            // 附加额外信息
            station.areaId = station.areaId || areaId
          } catch (err) {
            console.error('[数据流] 获取设备信息失败:', err)
          }

          // 一次性提交所有数据
          this.$store.commit('changeCurrentSelectDevice', station)
          uni.setStorageSync('currentSelectDevice', station)
          // 直接传递设备列表，不再从 store 读取
          // 切换设备时，旧页面残留的未完成请求不再注册，避免与新页面的直达注册互相覆盖
          if (!this._skipRegisterOnFetch) {
            this.registerDevices(station.list)
          }
        }

        this.isDeviceListLoaded = true
      } catch (error) {
        console.error('获取设备列表失败:', error)
      } finally {
        this.deviceListLoading = false
      }
    },

    // EMS 网关类型判定：171F（V1 显示协议）与 171F_V2（50kW EMSV2.0）都算同一类网关
    isEmsGatewayType(t) {
      return /^171F(_V\d+)*$/i.test(String(t == null ? '' : t).trim())
    },

    // 直接用设备列表注册 WebSocket，不依赖 store 状态
    registerDevices(list) {
      if (!list || list.length === 0) {
        console.warn('[数据流] 设备列表为空，跳过注册')
        return
      }

      // 过滤有效设备
      const validDevices = list.filter(item => {
        const typeCode = (item.typeCode || '').trim();
        const homeBarCode = (item.homeBarCode || '').trim();
        const barCode = (item.barCode || '').trim();
        return (typeCode && typeCode !== '-1') || homeBarCode || barCode;
      });

      const configs = validDevices.map(item => {
        const typeCode = (item.typeCode || '').trim() || String(item.deviceType || '');
        // barCode 可能存在于多种字段名下，逐一尝试
        const barCode = (
          item.homeBarCode || item.barCode || item.gateway || item.gateWay ||
          item.serialCode || item.sn || item.serialNumber || item.deviceCode || item.code || ''
        ).trim();
        return {
          deviceType: typeCode,
          typeCode: typeCode,
          address: (item.address || '').trim(),
          barCode: barCode,
          deviceId: item.id || item.deviceId,
          name: item.deviceName || item.description || typeCode,
          rawDeviceType: item.deviceType
        };
      });

      // 兜底：如果全部设备 barCode 都为空，用 store.currentSelectDevice.areaId 作为 fallback
      // （服务端通常按 areaId 聚合网关数据，areaId 是唯一的区域标识）
      const fallbackBarCode = this.$store.state.currentSelectDevice?.areaId ? String(this.$store.state.currentSelectDevice.areaId) : ''
      if (fallbackBarCode && configs.every(c => !c.barCode)) {
        console.warn('[数据流] 所有设备 barCode 为空，使用 areaId=' + fallbackBarCode + ' 作为 fallback')
        configs.forEach(c => { c.barCode = fallbackBarCode })
      }

      // 检查是否有 171F 设备（含 50kW 的 171F_V2 带版本后缀类型），没有则用第一个替代
      const has171F = configs.some(c => this.isEmsGatewayType(c.typeCode) || this.isEmsGatewayType(c.rawDeviceType));
      if (!has171F && configs.length > 0) {
        // 保留原类型码，避免把真实设备类型彻底覆盖掉（后续排查需要）
        configs[0].rawDeviceType = configs[0].rawDeviceType || configs[0].typeCode;
        configs[0].deviceType = '171F';
        configs[0].typeCode = '171F';
        // console.log('[数据流] 无171F设备，使用', configs[0].name, '作为汇总设备')
      }

      // console.log('[数据流] 准备注册:', configs.length, '个设备')
      // 全量替换：unregister 旧监听 → 清旧实例 → 重新 push + bind 新设备
      realtimeDataProvider.replaceDeviceList(configs)
      const registeredList = [...realtimeDataProvider.getDeviceList()];
      // console.log('[数据流] 注册完成, 设备列表:', registeredList.length, '个设备')
      this.device171FList = registeredList;
      this.device171FRegistered = true;
    },

    // 处理设备选择
    async handleDeviceSelect(esId) {


      // 节流锁1：防止重复点击（500ms内只响应一次）
      const now = Date.now()
      if (now - this.lastClickTime < 500) {
        return
      }
      this.lastClickTime = now

      // 节流锁2：防止正在跳转时重复触发
      if (this.isNavigating) {
        return
      }
      this.isNavigating = true

      // 复制一份，避免直接改动设备列表数据；同时不带入列表项里可能残留的旧设备清单，
      // 一律以本次接口返回的清单为准（接口失败则交给新页面走完整加载链路）
      const device = typeof esId === 'object' ? { ...esId } : { id: esId }
      delete device.list
      const deviceId = device.id || device.esId || esId
      this.selectedDeviceId = deviceId
      this.fromProfile = false
      
      // 点击瞬间就隔离上一台设备的数据：注销旧监听、清空旧模型并广播空快照，
      // 页面改显「正在加载设备数据」，避免新页面订阅时重放出上一台设备的实时值。
      // 后续 onLoad 会用同一 deviceId 再调一次（幂等，不重置等待计时）
      realtimeDataProvider.beginDeviceSwitch(deviceId)
      // 当前页面若还有未完成的设备列表请求，切换后不再让它重复注册设备
      this._skipRegisterOnFetch = true

      this.$store.commit('changeCurrentSelectDevice', device)
      // 保存设备选择到本地存储，防止刷新丢失
      uni.setStorageSync('currentSelectDevice', device)
      
      // 更新当前能源站角色
      this.updateCurrentEsRole(deviceId)

      // 先调用接口获取设备信息
      try {
        const areaId = device.areaId
        const deviceInfo = await getDeviceByAreaId(areaId)
        // 如果接口返回了设备信息，提取list添加到device对象中
        if (deviceInfo && deviceInfo.data && deviceInfo.data.list) {
          device.list = deviceInfo.data.list

          this.$store.commit('changeCurrentSelectDevice', device)
          uni.setStorageSync('currentSelectDevice', device)
        }
      } catch (err) {
        console.error('获取设备信息失败:', err)
        // 即使获取设备信息失败，也继续跳转
      }

      // 跳转到设备详情页面，传递完整设备对象
      const deviceStr = encodeURIComponent(JSON.stringify(device))
      // 使用redirectTo代替navigateTo，避免页面栈累积
      uni.redirectTo({
        url: `/pages/index/index?device=${deviceStr}`,
        fail: (err) => {
          console.error('跳转失败:', err)
          uni.showToast({
            title: '跳转失败',
            icon: 'none'
          })
          this.isNavigating = false
          // 跳转失败：结束切换态并重新加载当前设备，避免界面长期停在加载态
          realtimeDataProvider.endDeviceSwitch()
          this._skipRegisterOnFetch = false
          this.fetchDeviceList()
        },
        complete: () => {
          this.isNavigating = false
        }
      })
    },

    updateCurrentEsRole(esId) {
      const esUsers = this.$store.state.userInfo?.esUsers || []
      const esUser = esUsers.find(item => item.esId === esId)
      const roleId = esUser?.esRoleId || 0
      this.$store.commit('SET_CURRENT_ES_ROLE_ID', roleId)
    },

    register171FDevice() {
      if (this.device171FRegistered) {

        this.device171FList = [...realtimeDataProvider.getDeviceList()];
        return this.device171FList;
      }

      const currentDevice = this.$store.state.currentSelectDevice || {};
      const deviceList = currentDevice.list || [];


      // 收集所有有效设备（有 typeCode 或 homeBarCode）
      const validDevices = deviceList.filter(item => {
        const typeCode = (item.typeCode || '').trim();
        const homeBarCode = (item.homeBarCode || '').trim();
        const barCode = (item.barCode || '').trim();
        return (typeCode && typeCode !== '-1') || homeBarCode || barCode;
      });

      // 构建注册配置列表
      const configs = validDevices.map(item => {
        const typeCode = (item.typeCode || '').trim() || String(item.deviceType || '');
        // barCode 可能存在于多种字段名下，逐一尝试
        const barCode = (
          item.homeBarCode || item.barCode || item.gateway || item.gateWay ||
          item.serialCode || item.sn || item.serialNumber || item.deviceCode || item.code || ''
        ).trim();
        return {
          deviceType: typeCode,
          typeCode: typeCode,
          address: (item.address || '').trim(),
          barCode: barCode,
          deviceId: item.id || item.deviceId,
          name: item.deviceName || item.description || typeCode,
          rawDeviceType: item.deviceType
        };
      });

      // 兜底：如果全部设备 barCode 都为空，用 currentDevice.areaId 作为 fallback
      const fallbackBarCode = currentDevice?.areaId ? String(currentDevice.areaId) : ''
      if (fallbackBarCode && configs.every(c => !c.barCode)) {
        console.warn('[数据流] register171FDevice 所有设备 barCode 为空，使用 areaId=' + fallbackBarCode + ' 作为 fallback')
        configs.forEach(c => { c.barCode = fallbackBarCode })
      }

      // 检查是否有 171F 设备（含 50kW 的 171F_V2 带版本后缀类型），没有则用第一个有效设备作为替代
      const has171F = configs.some(c => this.isEmsGatewayType(c.typeCode) || this.isEmsGatewayType(c.rawDeviceType));
      if (!has171F && configs.length > 0) {
        // 用第一个有效设备作为汇总设备；原类型码留在 rawDeviceType 便于排查
        configs[0].rawDeviceType = configs[0].rawDeviceType || configs[0].typeCode;
        configs[0].deviceType = '171F';
        configs[0].typeCode = '171F';
        configs[0].name = configs[0].name + '(汇总)';
        // console.log('[数据流] 无171F设备，使用', configs[0].typeCode, '作为汇总设备');
      }

      // console.log('[数据流] 准备注册:', configs.length, '个设备');
      realtimeDataProvider.initDeviceList(configs);
      this.device171FList = [...realtimeDataProvider.getDeviceList()];
      this.device171FRegistered = true;
      // console.log('[数据流] 注册完成, 设备列表:', this.device171FList.length, '个设备');
      return this.device171FList;
    },

    // 返回设备列表
    goBackToList() {
      this.selectedDeviceId = null
      this.$store.commit('changeCurrentSelectDevice', {})
    },

    // 优化：简化tab切换逻辑
    switchTab(index) {
      // 如果当前显示设备列表（从Profile跳转过来但未选择设备）
      if (this.showDeviceList && this.fromProfile) {
        // 切换到"我的"Tab（index=2）允许返回
        if (index === 2) {
          // 返回"我的"页面时重置状态
          this.fromProfile = false
        } else {
          // 切换到监测或系统Tab需要先选择设备
          uni.showToast({ title: '请先选择设备', icon: 'none' })
          return
        }
      }

      // 系统/性能分析Tab未显示时，不允许切换到对应Tab
      if ((index === 1 || index === 3) && !this.selectedDeviceId) {
        return
      }

      // 如果已经在当前tab，不执行任何操作
      if (this.currentTab === index) {
        return
      }

      // 记录当前滚动位置
      this.scrollPositions[this.currentTab] = this._realScrollTop || 0

      // 切换tab
      this.currentTab = index

      // 切回监测：v-if 会重建 Monitor 及其子组件。等新组件挂载完再补发一次快照并重放注册，
      // 避免「从我的切回来全是 --、必须重新加载刷新」的问题；
      // 设备列表被清空过（退出登录/切换站点）时补建一次，否则重放注册也没有目标。
      if (index === 0) {
        this.$nextTick(() => {
          realtimeDataProvider.resumeRealtime()
          if (!realtimeDataProvider.getDeviceList().length && !this.deviceListLoading) {
            this.fetchDeviceList()
          }
        })
      }

      // 滚动到顶部
      this.scrollToTop()
    },

    // 页面级滚动：直接调原生 pageScrollTo 归零
    scrollToTop() {
      this.$nextTick(() => {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
        this._realScrollTop = 0
      })
    },

    getIconType(index) {
      const icons = ['list', 'bar-chart', 'file-text', 'settings', 'user'];
      return icons[index];
    },

    tabbarPageScrollLower() {
      const refMap = { 0: 'monitor', 1: 'system', 2: 'profile', 3: 'performance' };
      const currentRef = refMap[this.currentTab];
      this.$refs[currentRef]?.loadMore?.();
    }
  }
}
</script>

<style lang="scss" scoped>
/* 页面自身滚动：勿给 page 设置 height:100% / overflow:hidden（会锁死原生滚动），
   但要给 min-height，否则内容不满一屏时 page 只到内容底部，下面露出 WebView 的白底 */
page {
  min-height: 100vh;
  background-color: #EFF4FB;
}

.container {
  width: 100%;
  min-height: 100vh;
  background-color: #EFF4FB;
  position: relative;
}

/* 头部：fixed 吸顶，内容区用 padding-top 让出位置。
   z-index 需高于加载遮罩（1100），否则切换设备时遮罩会盖住标题栏 */
.header {
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
  z-index: 1200;
  background-color: #fff;
}

.header-safe-area {
  height: calc(25px + 20px);
  background-color: #fff;
}

.header-content {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 44px 0 15px;
  box-sizing: border-box;
}

.header-icon {
  width: 30px;
  height: 17px;
  margin-right: 8px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 内容区域：padding-top 给固定头部让位；
   padding-bottom 用「先写普通值、再写带 env() 的值」的兜底链，
   旧 WebView 不支持 env() 时自动落到第一条，不会出现尺寸声明整条失效 */
.content-pages {
  width: 100%;
  padding-top: calc(25px + 64px);
  padding-bottom: 60px;
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.page-item {
  width: 100%;
}

/* 设备切换中：整块内容隐藏但保留高度，避免任何内容透过遮罩 */
.content-pages--switching {
  visibility: hidden;
}

/* 设备切换加载态：盖住头部以下整个可视区。
   z-index 必须高于内容区里所有元素（架构图装饰块 1000、图表面板 1001），
   否则会出现「遮罩下透出白块 / 日期选择条」；再低于头部与底栏（1200）以保留导航 */
.device-switch-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: calc(25px + 64px);
  bottom: 0;
  z-index: 1100;
  background-color: #EFF4FB;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.switch-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.switch-spinner {
  width: 44rpx;
  height: 44rpx;
  border: 4rpx solid #dfe5ee;
  border-top-color: #7b8ba3;
  border-radius: 50%;
  animation: switch-spin 0.8s linear infinite;
}

.switch-loading-text {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #8a94a1;
}

@keyframes switch-spin {
  to { transform: rotate(360deg); }
}

.content-pages {
  width: 100%;
}

.page-item {
  width: 100%;
}

/* 底部TabBar：fixed 吸底，内容区用 padding-bottom 让出位置。
   z-index 需高于加载遮罩（1100），切换设备时导航仍可用 */
.tab-bar-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1200;
  background-color: #fff;
}

.tab-bar {
  height: 50px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
}

.tab-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
}

.tab-icon image {
  width: 100%;
  height: 100%;
}

.tab-text {
  font-size: 10px;
  color: #8a8a8a;
}

.active .tab-text {
  color: #007aff;
}

.safe-area-bottom {
  /* 兜底链：env() 不被识别时高度为 0，不影响滚动 */
  height: 0;
  height: env(safe-area-inset-bottom);
  background-color: #fff;
}
</style>
