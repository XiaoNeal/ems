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

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y enable-back-to-top scroll-with-animation @scrolltolower="tabbarPageScrollLower"
      :scroll-top="scrollTop" ref="contentScroll" :bounces="false" @scroll="onScroll">
      <view class="content-pages">
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
      </view>
    </scroll-view>

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
import DeviceList from '../components/device-list.vue'
import { findUserInfoByCodeId, getUserCenterInfo, findEnergyStation } from '@/api/user'
import { getDeviceByAreaId } from '@/api/devices'
import { realtimeDataProvider } from '@/service/websocket'

export default {
  components: {
    Monitor,
    Profile,
    System,
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
      }
      return '光储直柔能源站EMS'
    }
  },
  data() {
    return {
      tabs: ['监测', '系统', '我的'],
      currentTab: 0,
      activeColor: '#007aff',
      inactiveColor: '#8a8a8a',
      activeIcons: {
        0: '/static/images/monitor-active.png',
        1: '/static/images/system-pre.png',
        2: '/static/images/mine-active.png'
      },
      inactiveIcons: {
        0: '/static/images/monitor.png',
        1: '/static/images/system-nor.png',
        2: '/static/images/mine.png'
      },
      scrollPositions: { 0: 0, 1: 0, 2: 0 },
      scrollTop: 0,
      realScrollTop: 0,
      selectedDeviceId: null,
      fromProfile: false,
      isDeviceListLoaded: false,
      deviceListLoading: false,
      isNavigating: false, // 防止重复跳转的节流锁
      lastClickTime: 0, // 上次点击时间戳，用于防重复点击
      device171FList: [],
      device171FRegistered: false,
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
    // 统一在 mounted 中触发数据加载
    if (!this.isDeviceListLoaded && !this.deviceListLoading) {
      console.log('[mounted] 触发 fetchDeviceList')
      this.fetchDeviceList()
    }
  },
  onLoad(options) {
    console.log('onLoad', options)
    // 优先使用完整设备对象参数 - 直接处理，不调用handleDeviceSelect避免循环跳转
    if (options.device) {
      try {
        const device = JSON.parse(decodeURIComponent(options.device))
        console.log('从device参数加载设备:', device)
        const deviceId = device.id || device.esId
        this.selectedDeviceId = deviceId
        this.fromProfile = false
        // 清除fromProfile存储，防止onShow覆盖状态
        uni.removeStorageSync('fromProfile')
        // 清空之前设备的数据
        // realtimeDataProvider.clearDeviceState()
        this.$store.commit('changeCurrentSelectDevice', device)
        this.updateCurrentEsRole(deviceId)
      } catch (e) {
        console.error('解析device参数失败:', e)
      }
    } else if (options.esId) {
      // 兼容旧的esId参数
      console.log('从esId参数加载设备:', options.esId)
      const device = { id: options.esId }
      this.selectedDeviceId = options.esId
      this.fromProfile = false
      uni.removeStorageSync('fromProfile')
      // 清空之前设备的数据
      // realtimeDataProvider.clearDeviceState()
      this.$store.commit('changeCurrentSelectDevice', device)
      this.updateCurrentEsRole(options.esId)


    } else {
      // 恢复上次选择的设备
      const savedDevice = uni.getStorageSync('currentSelectDevice')
      if (savedDevice) {
        const deviceId = savedDevice.id || savedDevice.esId
        this.selectedDeviceId = deviceId
        // 清空之前设备的数据
        // realtimeDataProvider.clearDeviceState()
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
  },
  onReady() {
    this.scrollToTop()
  },
  methods: {
    checkFromProfile() {
      const fromProfile = uni.getStorageSync('fromProfile')
      if (fromProfile === 'true') {
        console.log('从profile跳转过来')
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
      console.log('checkLoginStatus', userInfo)

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
    async fetchDeviceList() {
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
        this.esIds = energyStations
        // console.log('[数据流] 设置 esIds:', this.esIds.length, '个')

        if (energyStations.length >= 1) {
          const station = energyStations[0]
          const stationId = station.id || station.esId
          this.selectedDeviceId = stationId
          this.updateCurrentEsRole(stationId)

          const areaId = station.areaId
          try {
            const deviceInfo = await getDeviceByAreaId(areaId)
            const list = deviceInfo?.data?.list || []
            // console.log('[数据流] 设备列表长度:', list.length)

            // 把设备列表附加到能源站对象，一次性提交到 store
            station.list = list
            // 附加额外信息
            station.areaId = station.areaId || areaId

            // 一次性提交所有数据
            this.$store.commit('changeCurrentSelectDevice', station)
            uni.setStorageSync('currentSelectDevice', station)

            // 直接传递设备列表，不再从 store 读取
            this.registerDevices(list)
          } catch (err) {
            console.error('[数据流] 获取设备信息失败:', err)
          }
        }

        this.isDeviceListLoaded = true
      } catch (error) {
        console.error('获取设备列表失败:', error)
      } finally {
        this.deviceListLoading = false
      }
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
      console.log('[数据流] 有效设备:', validDevices.length, '个')

      const configs = validDevices.map(item => {
        const typeCode = (item.typeCode || '').trim() || String(item.deviceType || '');
        const barCode = (item.homeBarCode || item.barCode || '').trim();
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

      // 检查是否有 171F，没有则用第一个替代
      const has171F = configs.some(c => c.typeCode === '171F');
      if (!has171F && configs.length > 0) {
        configs[0].deviceType = '171F';
        configs[0].typeCode = '171F';
        console.log('[数据流] 无171F设备，使用', configs[0].name, '作为汇总设备')
      }

      console.log('[数据流] 准备注册:', configs.length, '个设备')
      realtimeDataProvider.initDeviceList(configs)
      const registeredList = realtimeDataProvider.getDeviceList();
      console.log('[数据流] 注册完成, 设备列表:', registeredList.length, '个设备')
      this.device171FList = registeredList;
      this.device171FRegistered = true;
    },

    // 处理设备选择
    async handleDeviceSelect(esId) {


      // 节流锁1：防止重复点击（500ms内只响应一次）
      const now = Date.now()
      if (now - this.lastClickTime < 500) {
        console.log('500ms内重复点击，忽略')
        return
      }
      this.lastClickTime = now

      // 节流锁2：防止正在跳转时重复触发
      if (this.isNavigating) {
        console.log('正在跳转中，忽略重复点击')
        return
      }
      this.isNavigating = true

      // 兼容对象和数字两种格式
      const device = typeof esId === 'object' ? esId : { id: esId }
      const deviceId = device.id || device.esId || esId
      this.selectedDeviceId = deviceId
      this.fromProfile = false
      console.log('选择设备:', device)
      
      // 清空之前设备的数据
      realtimeDataProvider.clearDeviceState()
      
      this.$store.commit('changeCurrentSelectDevice', device)
      // 保存设备选择到本地存储，防止刷新丢失
      uni.setStorageSync('currentSelectDevice', device)
      
      // 更新当前微能站角色
      this.updateCurrentEsRole(deviceId)

      // 先调用接口获取设备信息
      try {
        const areaId = device.areaId
        const deviceInfo = await getDeviceByAreaId(areaId)
        console.log('获取设备信息:', deviceInfo)
        // 如果接口返回了设备信息，提取list添加到device对象中
        if (deviceInfo && deviceInfo.data && deviceInfo.data.list) {
          device.list = deviceInfo.data.list

          console.log('获取设备信息11111111111111111111111:', device)
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
      console.log('当前微能站角色:', roleId)
    },

    register171FDevice() {
      if (this.device171FRegistered) {
        console.log('[数据流] 设备已注册，跳过', this.device171FList.length, '个设备');
        this.device171FList = realtimeDataProvider.getDeviceList();
        return this.device171FList;
      }

      const currentDevice = this.$store.state.currentSelectDevice || {};
      const deviceList = currentDevice.list || [];
      console.log('[数据流] register171FDevice 设备列表:', deviceList.length, '个设备');

      // 收集所有有效设备（有 typeCode 或 homeBarCode）
      const validDevices = deviceList.filter(item => {
        const typeCode = (item.typeCode || '').trim();
        const homeBarCode = (item.homeBarCode || '').trim();
        const barCode = (item.barCode || '').trim();
        return (typeCode && typeCode !== '-1') || homeBarCode || barCode;
      });
      console.log('[数据流] 有效设备:', validDevices.length, '个');
      validDevices.forEach(d => console.log('  -', d.typeCode, d.description, 'barCode:', d.homeBarCode?.trim() || d.barCode?.trim()));

      // 构建注册配置列表
      const configs = validDevices.map(item => {
        const typeCode = (item.typeCode || '').trim() || String(item.deviceType || '');
        const barCode = (item.homeBarCode || item.barCode || '').trim();
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

      // 检查是否有 171F 设备，没有则用第一个有效设备作为替代
      const has171F = configs.some(c => c.typeCode === '171F');
      if (!has171F && configs.length > 0) {
        // 用第一个有效设备作为汇总设备
        configs[0].deviceType = '171F';
        configs[0].typeCode = '171F';
        configs[0].name = configs[0].name + '(汇总)';
        console.log('[数据流] 无171F设备，使用', configs[0].typeCode, '作为汇总设备');
      }

      console.log('[数据流] 准备注册:', configs.length, '个设备');
      realtimeDataProvider.initDeviceList(configs);
      this.device171FList = realtimeDataProvider.getDeviceList();
      this.device171FRegistered = true;
      console.log('[数据流] 注册完成, 设备列表:', this.device171FList.length, '个设备');
      return this.device171FList;
    },

    // 返回设备列表
    goBackToList() {
      this.selectedDeviceId = null
      this.$store.commit('changeCurrentSelectDevice', {})
    },

    onScroll(e) {
      this.realScrollTop = e.detail.scrollTop
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

      // 系统Tab未显示时，不允许切换到系统Tab
      if (index === 1 && !this.selectedDeviceId) {
        return
      }

      // 如果已经在当前tab，不执行任何操作
      if (this.currentTab === index) {
        return
      }

      // 记录当前滚动位置
      this.scrollPositions[this.currentTab] = this.realScrollTop

      // 切换tab
      this.currentTab = index

      // 滚动到顶部
      this.scrollToTop()
    },

    // 优化：简化滚动到顶部操作
    scrollToTop() {
      this.$nextTick(() => {
        if (this.realScrollTop === 0) {
          this.scrollTop = 1
          this.$nextTick(() => {
            this.scrollTop = 0
          })
        } else {
          this.scrollTop = 0
        }
      })
    },

    getIconType(index) {
      const icons = ['list', 'bar-chart', 'file-text', 'settings', 'user'];
      return icons[index];
    },

    tabbarPageScrollLower() {
      const currentRef = ['monitor', 'system', 'profile'][this.currentTab];
      this.$refs[currentRef]?.loadMore?.();
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  background-color: #EFF4FB;
  overflow: hidden;
}

.container {
  width: 100%;
  height: 100vh;
  background-color: #EFF4FB;
  overflow: hidden;
  position: relative;
  /* margin-top: 20px; */
}

/* 头部 */
.header {
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
  z-index: 100;
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

/* 内容区域 */
.content-scroll {
  position: fixed;
  left: 0;
  right: 0;
  top: calc(25px + 64px);
  bottom: calc(50px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

.content-pages {
  width: 100%;
}

.page-item {
  width: 100%;
  min-height: 100%;
}

/* 底部TabBar */
.tab-bar-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
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
  height: env(safe-area-inset-bottom);
  background-color: #fff;
}
</style>
