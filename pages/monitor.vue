<template>
  <view class="container">
    <!-- 页面头部 -->

    <!-- 顶部导航/标签栏 -->
    <!-- <view class="tab-bar">
      <text :class="{ 'active-tab': currentTab === 0 }" @click="switchTab(0)">架构图</text>
      <text :class="{ 'active-tab': currentTab === 1 }" @click="switchTab(1)">光伏</text>
      <text :class="{ 'active-tab': currentTab === 2 }" @click="switchTab(2)">储能</text>
      <text :class="{ 'active-tab': currentTab === 3 }" @click="switchTab(3)">负荷</text>
    </view> -->


    <view class="tab-bar">
      <view v-for="(item, index) in tabList" :key="index" :class="['tab-item', { active: currentTab === index }]"
        @tap="switchTab(index)">
        {{ item }}
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="device-content">
      <ArchitectureDiagram v-if="currentTab === 0" />
      <PvManagement v-else-if="currentTab === 1" />
      <EnergyStorage v-else-if="currentTab === 2" />
      <GridManagement v-else-if="currentTab === 3" />
      <LoadManagement v-else-if="currentTab === 4" />
    </view>

  </view>
</template>


<script>
import ArchitectureDiagram from './components/architecture-diagram.vue'
import PvManagement from './components/pv-management.vue'
import EnergyStorage from './components/energy-storage.vue'
import LoadManagement from './components/load-management.vue'
import GridManagement from './components/grid-management.vue'
import { realtimeDataProvider } from '@/service/websocket'

export default {
  components: {
    ArchitectureDiagram,
    PvManagement,
    EnergyStorage,
    LoadManagement,
    GridManagement
  },
  data() {
    return {
      currentTab: 0,
      tabList: ['架构图', '光伏', '储能', '电网', '负荷'],
      device171FList: [], // 171F设备列表
      device171FRegistered: false, // 是否已注册
    };
  },
  provide() {
    return {
      get171FDeviceList: this.get171FDeviceList
    };
  },
  computed: {
    // 屏幕方向检测
    isLandscape() {
      return uni.getSystemInfoSync().windowWidth > uni.getSystemInfoSync().windowHeight;
    }
  },
  methods: {
    register171FDevice() {
      // if (this.device171FRegistered) {
      //   console.log('171F设备已注册，跳过', this.device171FList);
      //   this.device171FList = realtimeDataProvider.getDeviceList();
      //   return this.device171FList;
      // }

      const currentDevice = this.$store.state.currentSelectDevice || {};
      console.log('注册171F设备:', currentDevice);

      let address = '';
      let barCode = '';

      if (currentDevice.list && Array.isArray(currentDevice.list)) {
        const foundDevice = currentDevice.list.find(item =>
          item.typeCode === '171F' || item.deviceType === '171F' || item.description?.includes('171F')
        );
        if (foundDevice) {
          address = foundDevice.address || address;
          barCode = foundDevice.barCode || foundDevice.homeBarCode || barCode;
          console.log('找到171F设备:', foundDevice);
        }
      }

      const deviceConfig = {
        deviceType: '171F',
        typeCode: '171F',
        address: address,
        barCode: barCode,
        deviceId: '171F001',
        name: 'DCDC设备171F'
      };
      console.log('注册171F设备:', deviceConfig);
      realtimeDataProvider.initDeviceList([deviceConfig]);
      this.device171FList = realtimeDataProvider.getDeviceList();
      this.device171FRegistered = true;
      console.log('171F设备注册完成:', this.device171FList);
      return this.device171FList;
    },
    get171FDeviceList() {
      if (!this.device171FRegistered) {
        return this.register171FDevice();
      }
      return this.device171FList;
    },
    switchTab(tab) {
      if (tab !== this.currentTab) {
        this.currentTab = tab;
        uni.vibrateShort({ type: 'light' });
      }
    },
    handleTabChange(e) {
      const newIndex = Number(e.detail.current);
      if (newIndex !== this.currentTab) {
        this.currentTab = newIndex;
        uni.vibrateShort({ type: 'light' });
      }
    },
    // 监听屏幕旋转事件
    onOrientationChange() {
      this.$forceUpdate();
    },
    // 刷新数据方法
    refresh() {
      try {
        const currentComponentRefs = [
          'architectureDiagram',
          'pvManagement',
          'energyStorage',
          'loadManagement',
          'gridManagement'
        ];

        const currentComponent = this.$refs[currentComponentRefs[this.currentTab]];

        if (currentComponent && currentComponent.refresh) {
          currentComponent.refresh();
        } else {
          console.log('当前子组件未实现refresh方法');
        }
      } catch (error) {
        console.error('刷新失败:', error);
        uni.showToast({
          title: '刷新失败',
          icon: 'error',
          duration: 1500
        });
      }
    },


  },
  mounted() {
    // 注册171F设备（只注册一次）
    this.register171FDevice();
    // 监听屏幕旋转事件
    uni.onWindowResize(this.onOrientationChange);
  },
  beforeDestroy() {
    // 移除监听器
    uni.offWindowResize(this.onOrientationChange);
  }
};
</script>



<style lang="scss" scoped>
// 定义颜色变量
$primary-color: #165DFF;
$success-color: #00B42A;
$info-color: #606266;
$light-bg: #F5F7FA;
$dark-bg: #E4E7ED;
$card-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
$card-hover-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);

.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #EFF4FB;
  box-sizing: border-box;
}

.tab-bar {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #eee;
  background-color: #FFF;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  //color: #333;
}

.tab-item.active {
  color: #007aff;
  border-bottom: 2px solid #007aff;
}





// 内容区域
.device-content {
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.content-swiper {
  width: 100%;
  height: 100%;
}
</style>
