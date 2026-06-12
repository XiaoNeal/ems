<template>
  <view class="container">
    <!-- 警告框和启动按钮 -->
    <!-- <view class="warning-and-start"> -->
    <!-- <view class="warning-box" >
        <text class="warning-icon" @click="toggleWarning">⚠️</text>
        <view class="warning-content">
          <text class="warning-title">能源装备·非专业禁止操作</text>
        </view>
      </view> -->

    <!-- </view>  -->

    <!-- 系统架构图 -->
    <view class="system-img">
      <view class="start-button" style="position:absolute;top: 8%;left: 77%; ">
        <view class="start-circle" @click="handleStartStop">
          <image :src="systemRunning ? '/static/images/start.svg' : '/static/images/start.svg'" class="start-bg" />
          <text class="start-text">{{ getSystemStatus() }}</text>
        </view>
      </view>
      <image src="/static/images/system-architecture-new.png"
        style="width:100%; height:96%; position: absolute; top:0; left:0; z-index: 1;padding: 20rpx;"></image>
      <!-- 光伏 -->
      <view class="device-label-top-left">
        <text class="device-name">光伏</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B0 &&
            device171F.energyData.B0.value != '--' ?
            device171F.energyData.B0.value : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view>
      <!-- 电网 -->
      <view class="device-label-top-right">
        <text class="device-name">电网</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B4 &&
            device171F.energyData.B4.value != '--' ?
            device171F.energyData.B4.value : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view>
      <!-- 设备数据标签 -->
      <view class="device-label" style="left: 3%;top: 75%">
        <text class="device-name">交流负荷</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B8 &&
            device171F.energyData.B8.value != '--' ?
            device171F.energyData.B8.value : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view>
      <view class="device-label" style="left: 22%;top: 78%">
        <text class="device-name">储能</text>
        <view class="power-row">
          <text class="device-power">
            <text v-if="device171F && device171F.energyData && device171F.energyData.B60 && device171F.energyData.B60.value != '--'">
              {{ parseFloat(device171F.energyData.B60.value) > 0 ? '充电' : (parseFloat(device171F.energyData.B60.value) < 0 ? '放电' : '静置') }}
            </text>
            <text v-if="device171F && device171F.energyData && device171F.energyData.B60 && device171F.energyData.B60.value != '--'">
              {{ ' ' }}
            </text>
            {{ device171F && device171F.energyData && device171F.energyData.B60 &&
            device171F.energyData.B60.value != '--' ?
            device171F.energyData.B60.value : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
        <text class="device-soc">{{ device171F && device171F.energyData && device171F.energyData.B128 &&
          device171F.energyData.B128.value != '--' ?
          device171F.energyData.B128.value : '--' }}%</text>
      </view>
      <view class="device-label" style="left: 38%;top: 78%">
        <text class="device-name">空调</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B18 &&
            device171F.energyData.B18.value != '--' ?
            device171F.energyData.B18.value : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view>
      <view class="device-label" style="left: 47%;top: 78%">
        <text class="device-name">柔性直流充电桩</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B26 &&
            device171F.energyData.B26.value != '--' ?
            device171F.energyData.B26.value : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view>
      <view class="device-label" style="left: 70%;top: 78%">
        <text class="device-name">照明</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B30 &&
            device171F.energyData.B30.value != '--' ?
            device171F.energyData.B30.value : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view>
      <view class="device-label" style="left: 83%;top: 78%">
        <text class="device-name">其他负荷</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B22 &&
            device171F.energyData.B22.value != '--' ?
            device171F.energyData.B22.value : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view>
    </view>

    <!-- 数据卡片 -->
    <view class="card-section">
      <view class="card-row">
        <view class="card card-top-left">
          <view class="card-item">
            <image src="/static/images/solar.png" class="card-icon"></image>
            <text class="card-title">今日发电</text>
          </view>
          <view class="card-item">
            <text class="card-value">{{ device171F && device171F.energyData && device171F.energyData.B34 &&
              device171F.energyData.B34.value != '--' ?
              device171F.energyData.B34.value : '--' }} </text>
            <text class="card-unit"> kWh</text>
          </view>
        </view>
        <view class="card-horizontal-divider"></view>
        <view class="card card-top-right">
          <view class="card-item">
            <image src="/static/images/consumption.png" class="card-icon"></image>
            <text class="card-title">今日用电</text>
          </view>
          <view class="card-item">
            <text class="card-value">{{ device171F && device171F.energyData && device171F.energyData.B38 &&
              device171F.energyData.B38.value != '--' ?
              device171F.energyData.B38.value : '--' }} </text>
            <text class="card-unit"> kWh</text>
          </view>
        </view>
      </view>
      <view class="card-divider"></view>
      <view class="card-row">
        <view class="card card-bottom-left">
          <view class="card-item">
            <image src="/static/images/storage.png" class="card-icon"></image>
            <text class="card-title">储能剩余</text>
          </view>
          <view class="card-item">
            <text class="card-value">{{ device171F && device171F.energyData && device171F.energyData.B128 &&
              device171F.energyData.B128.value != '--' ?
              device171F.energyData.B128.value : '--' }}</text>
            <text class="card-unit">%</text>
          </view>
        </view>
        <view class="card-horizontal-divider"></view>
        <view class="card card-bottom-right">
          <view class="card-item">
            <image src="/static/images/grid.png" class="card-icon"></image>
            <text class="card-title">电网供电</text>
          </view>
          <view class="card-item">
            <text class="card-value">{{ device171F && device171F.energyData && device171F.energyData.B42 &&
              device171F.energyData.B42.value != '--' ?
              device171F.energyData.B42.value : '--' }} </text>
            <text class="card-unit"> kWh</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 图表区域（全屏核心） -->
    <view class="chart-container" :class="{ 'fullscreen-chart': isFullScreen }" :style="chartContainerStyle">
      <view class="date-selector">
        <view class="date-tabs">
          <view v-for="(tab, i) in ['日', '月', '年']" :key="i" :class="['date-tab', { active: activeChartTab === tab }]"
            @click="handleDateTypeChange(tab)">
            {{ tab }}
          </view>
        </view>
        <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate"
          class="custom-picker date-picker" />
        <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker" v-model="selectedDate"
          class="custom-picker date-picker" />
        <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate"
          class="custom-picker date-picker" />
      </view>
      <view class="chart-divider"></view>
      <view class="chart-header">
        <text class="chart-title">能量</text>
        <view class="fullscreen-btn" @click="handleFullScreen">
          <text>{{ isFullScreen ? '退出全屏' : '全屏' }}</text>
        </view>
      </view>
      <view class="chart-card" :style="chartCardStyle">
        <qiun-data-charts v-if="electricityData.categories && electricityData.categories.length > 0" type="area"
          :chartData="electricityData" :ontouch="true" :canvas2d="canvas2d" :opts="electricityOpts"
          :canvasId="chartId + '-energy'" />
        <view v-else class="empty-chart">
          <text class="empty-text">暂无能源数据</text>
        </view>
        <!-- <view class="chart-legend">
          <view class="legend-item">
            <view class="legend-color" style="background-color: #1810FF;"></view>
            <text>发电</text>
          </view>
          <view class="legend-item">
            <view class="legend-color" style="background-color: #91CB74;"></view>
            <text>负荷</text>
          </view>
          <view class="legend-item">
            <view class="legend-color" style="background-color: #8AC858;"></view>
            <text>充电</text>
          </view>
          <view class="legend-item">
            <view class="legend-color" style="background-color: #EE6666;"></view>
            <text>放电</text>
          </view>
        </view> -->
      </view>
    </view>

    <!-- 启动弹窗 -->
    <view class="modal-overlay" v-if="showModal" @click="closeModal">
      <!-- 警告图标 - 位于弹窗正上方，确保在最上层 -->
      <image src="/static/images/img-警告.png" class="modal-icon-absolute" />
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">是否启动策略</text>
        </view>
        <view class="modal-body">
          <text class="modal-text">请确认您是专业人士，已知悉相关影响和责任，并取得授权。</text>
        </view>
        <view class="modal-footer">
          <button class="modal-cancel" @click="closeModal">取消</button>
          <button class="modal-confirm" @click="confirmStart">确认</button>
        </view>
      </view>
    </view>

    <!-- 停止策略弹窗 -->
    <view class="modal-overlay" v-if="showStopModal" @click="closeStopModal">
      <!-- 警告图标 - 位于弹窗正上方，确保在最上层 -->
      <image src="/static/images/img-警告.png" class="modal-icon-absolute" />
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">确认停止系统运行？</text>
        </view>
        <view class="modal-body">
          <text class="modal-text">停止系统运行将影响所有设备的电力供应，</text>
          <text class="modal-text">请确保已做好相关准备工作。</text>
        </view>
        <view class="modal-footer">
          <button class="modal-cancel" @click="closeStopModal">取消</button>
          <button class="modal-confirm" @click="confirmStop">确认停止</button>
        </view>
      </view>
    </view>

    <!-- 警告详情弹窗 -->
    <view class="modal-overlay warning-modal-overlay" v-if="showWarningModal" @click="closeWarningModal">
      <view class="modal-content warning-modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">⚠️ 安全警告</text>
        </view>
        <view class="modal-body warning-modal-body">
          <text class="warning-modal-title">能源装备·非专业禁止操作</text>
          <view class="warning-item">
            <text class="warning-number">1.</text>
            <text class="warning-modal-text">系统内置锂电光伏发电，电网断网后仍带电，请谨慎操作</text>
          </view>
          <view class="warning-item">
            <text class="warning-number">2.</text>
            <text class="warning-modal-text">长期断电将导致锂电过放报警，请联系厂家</text>
          </view>
          <view class="warning-item">
            <text class="warning-number">3.</text>
            <text class="warning-modal-text">系统具备离网应急功能，请依需要谨慎配置和管理使用</text>
          </view>
        </view>
        <view class="modal-footer">
          <button class="modal-confirm warning-confirm" @click="closeWarningModal">我知道了</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { dateStandardFormat } from "@/utils/date-format";

import { getPowerData } from '../../api/power';
import dyDate from '@/components/dy-Date/dy-Date.vue';
import { realtimeDataProvider } from '@/service/websocket';

import { sendCommandFrame } from '@/api/control.js'

export default {
  components: { dyDate },
  name: "ArchitectureDiagram",
  data() {
    return {
      chartId: 'architecture-' + Math.random().toString(36).substr(2, 9),
      activeChartTab: '日',
      canvas2d: this.$Config?.ISCANVAS2D ?? false,
      timeTypeIndex: 0,
      selectedDate: new Date().toISOString().split('T')[0],
      storageStatus: "放电中",
      currentStatus: {},
      gridStatus: "供电中",
      showFullWarning: false,
      gridPower: "--",
      totalProvideQ: "--",
      totalStorageDisChargeQ: "--",
      totalStorageChargeQ: "--",
      dayEnergyData: {
        totalProvideQ: 0,
        totalStorageForwardQ: 0,
        totalStorageReverseQ: 0,
        totalGridForwardQ: 0,
        totalGridReverseQ: 0,
        totalConsumeElectricityQ: 0,
      },
      deviceList: [],
      dcdc171FData: null,
      nyzData: { SOC: "--" },
      // 设备配置参数
      deviceConfig: {
        idCode: '00 00 02 20 26 05 18 15 21 04 02 00 00 00 00',
        typeCode: '3401',
        address: '01'
      },
      electricityOpts: {
        color: ["#57dd76", "#ffa13c", "#71a6ff", "#a670ff"],
        // padding: [15, 20, 0, 15],
        // dataLabel: false,
        // xAxis: { labelCount: 6, disableGrid: true },
        // yAxis: { gridType: "dash", showTitle: true, data: [{ position: "left", title: "单位:kW" }] },
        // extra: { area: { type: "straight", width: 2 } },
        // yAxis: {
        //   gridType: "dash",
        //   dashLength: 2
        // },

        dataLabel: false,
        dataPointShape: false,
        padding: [15, 15, 0, 15],
        enableScroll: false,
        legend: {},
        xAxis: { labelCount: 6, disableGrid: true },
        yAxis: {
          gridType: "dash",
          dashLength: 2
        },
        extra: {
          area: {
            type: "curve",
            opacity: 0.2,
            addLine: true,
            width: 2,
            // gradient: true,
            activeType: "hollow"
          }
        }

      },
      electricityData: { categories: [], series: [{ data: [], name: '发电功率' }] },
      showModal: false,
      showStopModal: false,
      showWarningModal: false,
      systemRunning: false,
      isFullScreen: false,
      statusBarHeight: 93, // 默认状态栏高度
      navBarHeight: 44, // 导航栏高度
      topSafeArea: 0 // 顶部安全区域总高度
    }
  },
  computed: {
    chartContainerStyle() {
      if (this.isFullScreen) {
        return `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          margin: 0;
          background: #fff;
          z-index: 9999;
          overflow: hidden;
        `;
      }
      return '';
    },
    chartCardStyle() {
      if (this.isFullScreen) {
        const headerHeight = 88; // chart-header 高度
        const dateSelectorHeight = 88; // date-selector 高度
        return `
          height: calc(100vh - ${this.topSafeArea}px - ${headerHeight}rpx - ${dateSelectorHeight}rpx - env(safe-area-inset-bottom));
          padding-top: ${this.topSafeArea}px;
        `;
      }
      return '';
    },
    device171F() {
      return this.deviceList.find(item => item && item.deviceType === '171F');
    },
    userId() {
      return this.$store.state.userInfo?.userId || 0
    }
  },
  onLoad() {
    // 获取设备状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 93;
    console.log('statusBarHeight', this.statusBarHeight);
  },
  mounted() {
    // realtimeDataProvider.createScoket(uni.getStorageSync('currentTemplate'), uni.getStorageSync('urlPrefix'));
    this.init171FDevice();
    this.getSqRealTimeData();
    this.getNyzRealTimeData();
    this.initPage();
    this.dataInterval = setInterval(() => { this.initPage() }, 1000 * 60 * 5);

    // 获取系统信息并设置CSS变量
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
    this.navBarHeight = systemInfo.platform === 'android' ? 48 : 44;
    this.topSafeArea = this.statusBarHeight + this.navBarHeight;

    // 设置CSS变量用于全屏模式
    const safeAreaTop = systemInfo.safeArea?.top || systemInfo.statusBarHeight || 0;
    const safeAreaBottom = systemInfo.safeArea?.bottom || 0;
    try {
      document.documentElement.style.setProperty('--safe-area-top', safeAreaTop + 'px');
      document.documentElement.style.setProperty('--safe-area-bottom', safeAreaBottom + 'px');
    } catch (e) {
      console.warn('Failed to set CSS variables:', e);
    }

    console.log('statusBarHeight:', this.statusBarHeight, 'navBarHeight:', this.navBarHeight, 'topSafeArea:', this.topSafeArea);
  },
  beforeDestroy() {
    this.dataInterval && clearInterval(this.dataInterval);
    realtimeDataProvider.unregister();
    // #ifdef APP-PLUS
    plus.navigator.setStatusBarStyle('default');
    plus.navigator.setStatusBarBackground('#ffffff');
    plus.screen.lockOrientation('portrait-primary');
    // #endif
  },
  methods: {
    init171FDevice() {
      const device171F = {
        deviceType: '171F',
        address: '01',
        barCode: '00 00 02 20 26 05 18 15 21 04 02 00 00 00 00',
        deviceId: '171F001',
        name: 'DCDC设备171F'
      };


      realtimeDataProvider.initDeviceList([device171F]);
      this.deviceList = realtimeDataProvider.getDeviceList();
      console.log('deviceList--------', this.deviceList);


    },
    handle171FData(jsonData) {
      console.log('171F设备数据:', jsonData);
      this.dcdc171FData = jsonData;
    },
    handle170CData(jsonData) {
      console.log('170C设备数据:', jsonData);
    },
    async handleFullScreen() {
      this.isFullScreen = !this.isFullScreen;

      // ================== App 横屏 + 状态栏处理 ==================
      // #ifdef APP-PLUS
      if (this.isFullScreen) {
        plus.screen.lockOrientation('landscape-primary');
        plus.navigator.setFullscreen(true);
        uni.showToast({ title: '已横屏全屏', icon: 'none' });
      } else {
        plus.screen.lockOrientation('portrait-primary');
        plus.navigator.setFullscreen(false);
        uni.showToast({ title: '退出全屏', icon: 'none' });
      }
      // #endif

      // ================== 小程序/H5 全屏处理 ==================
      // #ifndef APP-PLUS
      if (this.isFullScreen) {
        // uni.showToast({
        //   title: '已适配安全区，内容不遮挡',
        //   icon: 'none',
        //   duration: 2000
        // });
      } else {
        uni.showToast({ title: '退出全屏', icon: 'none' });
      }
      // #endif
    },
    initPage() {
      // this.getAreaData();
      // this.getStatisticData();
      // this.getProvideCurve();
      // this.findDayStorageQAndPower();
      this.getPowerData2();
    },
    handleDateTypeChange(tab) {
      this.activeChartTab = tab;
      const map = { '日': 0, '月': 1, '年': 2 };
      this.timeTypeIndex = map[tab];
      const currentDate = new Date();
      this.selectedDate = {
        0: currentDate.toISOString().split('T')[0],
        1: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
        2: `${currentDate.getFullYear()}`
      }[this.timeTypeIndex];
      this.handleDatePicker(this.selectedDate);
    },
    handleDatePicker(value) {
      // 更新选中的日期
      this.selectedDate = value;
      const typeMap = { 0: 'hour', 1: 'day', 2: 'month' };
      this.type = typeMap[this.timeTypeIndex];
      if (this.type === "hour") this.getPowerData2();
      else if (this.type === "day") this.findMonthEnergyAndIncome();
      else if (this.type === "month") this.findYearEnergyAndIncome();
    },
    // getAreaData() {
    //   this.areaData = this.$store.state.centerList.filter(item => item.level == 0 || item.level == 2);
    // },
    getProvideCurve() {
      // upgrade.findDayProvideQAndPower({ day: dateStandardFormat(new Date()) }).then(result => {
      //   const totallyProvideQ = result.data.provideQMap.reduce((acc, cur) => acc + cur.provideQ, 0);
      //   const solarIds = this.nyzDeviceList?.filter(item => item.type == 2).map(item => item.deviceId) || [];
      //   energy_new.findEveryHourByDeviceIds({ deviceIds: solarIds, day: dateStandardFormat(new Date()) }).then(res => {
      //     this.totalProvideQ = parseFloat(totallyProvideQ).toFixed(2);
      //   });
      // });
    },
    findDayStorageQAndPower() {
      // const storageIds = [352, 354];
      // nyz.findEveryHourByDeviceIds({ deviceIds: storageIds, day: dateStandardFormat(new Date()) }).then(result => {
      //   let storageQ = result.data.reduce((acc, item) => {
      //     acc.charge += item.total_storage_forward_q;
      //     acc.discharge += item.total_storage_reverse_q;
      //     return acc;
      //   }, { charge: 0, discharge: 0 });
      //   this.totalStorageChargeQ = storageQ.charge;
      //   this.totalStorageDisChargeQ = storageQ.discharge;
      // });
    },
    getSqRealTimeData() {
      // realtimeDataProvider.on("center", (data) => { this.currentStatus = data; });
      // realtimeDataProvider.on("Grid", (data) => { this.gridPower = data.data.B56 ? (data.data.B56 / 1000).toFixed(3) : "--"; });
    },
    getNyzRealTimeData() {
      // realtimeDataProvider.on("nyzData", (jsonData) => {
      //   const { deviceType, address, data } = jsonData;
      //   if (deviceType === "1804_V2_2") {
      //     if (address === "18") this.nyzData.storagePower1 = parseFloat(data.B8).toFixed(2);
      //     else if (address === "19") this.nyzData.storagePower2 = parseFloat(data.B8).toFixed(2);
      //     else if (address === "1A") this.nyzData.photovoltaicPower1 = parseFloat(data.B8).toFixed(2);
      //     else if (address === "1B") this.nyzData.photovoltaicPower2 = parseFloat(data.B8).toFixed(2);
      //     else if (address === "31") this.nyzData.loadPower1 = parseFloat(data.B8).toFixed(2);
      //     else if (address === "32") this.nyzData.loadPower2 = parseFloat(data.B8).toFixed(2);
      //   } else if (deviceType === "1704_V1_2" && address === "02") {
      //     const socValue = parseFloat(data.B4);
      //     this.nyzData.SOC = isNaN(socValue) ? "--" : Math.max(0, Math.min(100, socValue)).toFixed(2);
      //     this.storageStatus = this.enumStorageStatus(data.B2);
      //   }
      // });
    },
    enumStorageStatus(status) {
      const statusMap = { 0: "初始化", 1: "充电", 2: "放电", 3: "静置" };
      return statusMap[status] || "--";
    },
    // getStatisticData() {
    //   sapi.findHomeCommunityCapacitySumByLevelIds({
    //     areaLevelIds: this.$store.state.centerList[0]?.origin || '',
    //     date: dateStandardFormat(new Date())
    //   }).then(res => {
    //     this.dayEnergyData = res.data || {};
    //   });
    // },
    getPowerData2() {
      // 准备接口参数
      const params = {
        esId:  8,
        date: this.selectedDate,
        areaLevelIds: this.$store.state.areaInfoId || 950
      };

      // 调用新接口
      getPowerData(params).then(result => {
        if (result.data && result.data.length > 0) {
          const dataList = result.data;
          const generationData = [], loadData = [], chargeData = [], dischargeData = [], xAxisData = [];
          
          // 按小时聚合数据（0-23小时）
          for (let h = 0; h < 24; h++) {
            const time = `${String(h).padStart(2, "0")}:00`;
            xAxisData.push(time);
            
            // 找到该小时范围内的数据
            const hourData = dataList.filter(item => {
              const dateTime = item.dateTime || '';
              const hour = parseInt(dateTime.substring(11, 13)) || 0;
              return hour === h;
            });
            
            if (hourData.length > 0) {
              // 计算平均值
              const avgGeneration = hourData.reduce((sum, item) => sum + (parseFloat(item.generatedPower || 0)), 0) / hourData.length;
              const avgLoad = hourData.reduce((sum, item) => sum + (parseFloat(item.loadPower || 0)), 0) / hourData.length;
              const avgStorage = hourData.reduce((sum, item) => sum + (parseFloat(item.storagePowerReverse || 0)), 0) / hourData.length;
              
              generationData.push(parseFloat(avgGeneration.toFixed(2)));
              loadData.push(parseFloat(avgLoad.toFixed(2)));
              chargeData.push(avgStorage >= 0 ? parseFloat(avgStorage.toFixed(2)) : 0);
              dischargeData.push(avgStorage < 0 ? parseFloat((-avgStorage).toFixed(2)) : 0);
            } else {
              // 该小时无数据，补充0值确保曲线连贯
              generationData.push(0);
              loadData.push(0);
              chargeData.push(0);
              dischargeData.push(0);
            }
          }
          
          this.electricityData = {
            categories: xAxisData,
            series: [
              { data: generationData, name: '发电' },
              { data: loadData, name: '用电' },
              { data: chargeData, name: '充电' },
              { data: dischargeData, name: '放电' },
            ]
          };
        }

        console.log(this.electricityData, 'electricityData');
      });
    },
    findMonthEnergyAndIncome() { },
    findYearEnergyAndIncome() { },
    getSum(arr) {
      return arr.includes('--') ? '--' : arr.reduce((acc, val) => acc + val, 0);
    },
    showStartModal() { this.showModal = true; },
    closeModal() { this.showModal = false; },
    openStopModal() { this.showStopModal = true; },
    closeStopModal() { this.showStopModal = false; },

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

    // 确认启动
    async confirmStart() {
      this.showModal = false;
      const success = await this.executeCommand({
        title: '系统启动',
        content: '确定要启动系统吗？',
        apiSufix: 'systemControl',
        commandBuilder: () => this.buildCommand('100', '1'),
        action: 'start',
        stateKey: 'systemRunning'
      });
      if (success) {
        this.systemRunning = true;
      }
    },

    // 确认停止
    async confirmStop() {
      this.showStopModal = false;
      const success = await this.executeCommand({
        title: '系统停止',
        content: '确定要停止系统吗？',
        apiSufix: 'systemControl',
        commandBuilder: () => this.buildCommand('100', '0'),
        action: 'stop',
        stateKey: 'systemRunning'
      });
      if (success) {
        this.systemRunning = false;
      }
    },

    handleStartStop() {
      if (this.systemRunning) {
        this.showStopModal = true;
      } else {
        this.showModal = true;
      }
    },
    toggleWarning() {
      this.showWarningModal = true;
    },
    closeWarningModal() {
      this.showWarningModal = false;
    },
    getSystemStatus() {
      const b0Value = this.device171F && this.device171F.controlData && this.device171F.controlData.B0 && this.device171F.controlData.B0.value;
      if (b0Value === 1 || b0Value === '1') {
        return '运行中';
      } else if (b0Value === 0 || b0Value === '0') {
        return '启动';
      }
      return '启动';
    },
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 30rpx;
}

.warning-and-start {
  margin: 20rpx;
  display: flex;
  align-items: center;
  background: #FFF7E6;
  /* border: 1px solid #FFD1CF; */
  border-radius: 12rpx;
  padding: 20rpx;
}

.warning-box {
  flex: 1;
  display: flex;
  align-items: flex-start;
  padding: 20rpx;
  background: linear-gradient(135deg, #fff9e6 0%, #fff5d6 100%);
  border-radius: 12rpx;
  border: 1rpx solid #ffe4a0;
  cursor: pointer;
}

.warning-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
  color: #ff762c;
  flex-shrink: 0;
}

.warning-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff762c;
  display: block;
  margin-bottom: 8rpx;
}

.warning-text {
  font-size: 22rpx;
  color: #8c6a4a;
  line-height: 1.6;
  display: block;
}

.expand-icon {
  font-size: 20rpx;
  color: #ff762c;
  margin-left: 12rpx;
  flex-shrink: 0;
}

.start-button {
  margin-left: 20rpx;
}

.start-circle {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  position: relative;
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
  font-size: 26rpx;
  font-weight: bold;
  position: relative;
  z-index: 2;
  color: #4488FB;
}

.system-img {
  position: relative;
  /* height: 440rpx; */
  height: 516rpx;
  margin: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #fff;
}

.detail-storage,
.detail-grid,
.detail-solar {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  padding: 8rpx 12rpx;
  border-radius: 6rpx;
  font-size: 22rpx;
}

.detail-storage {
  top: 10rpx;
  left: 10rpx;
}

.detail-grid {
  top: 10rpx;
  right: 10rpx;
}

.detail-solar {
  bottom: 10rpx;
  left: 10rpx;
}

.device-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.device-label-top-left {
  position: absolute;
  top: 7%;
  left: 34%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.device-label-top-right {
  position: absolute;
  top: 19%;
  left: 1%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.device-name {
  font-size: 20rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.device-power {
  font-size: 22rpx;
  color: #4488fb;
  font-weight: bold;
}

.device-soc {
  font-size: 20rpx;
  color: #52c41a;
  margin-top: 2rpx;
}

.power-row {
  display: flex;
  align-items: baseline;
}

.power-unit {
  font-size: 16rpx;
  color: #999;
  margin-left: 2rpx;
}

.card-section {
  margin: 20rpx;
}

.card-row {
  display: flex;
}

.card-divider {
  height: 1rpx;
  background-color: #eee;
  margin: 0 auto;
  width: 90%;
}

.card {
  flex: 1;
  background: #fff;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.card-top-left {
  border-radius: 12rpx 0 0 0;
}

.card-top-right {
  border-radius: 0 12rpx 0 0;
}

.card-bottom-left {
  border-radius: 0 0 0 12rpx;
}

.card-bottom-right {
  border-radius: 0 0 12rpx 0;
}

.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-item-divider {
  width: 1rpx;
  background-color: #eee;
}

.card-horizontal-divider {
  width: 1rpx;
  height: 60%;
  background-color: #e8e8e8;
  margin: auto 0;
}

.card-icon {
  width: 28rpx;
  height: 28rpx;
  margin-bottom: 8rpx;
}

.card-title {
  font-size: 14px;
  color: #666;
}

.card-value {
  font-size: 16px;
  font-weight: bold;
  color: #4488FB;
  margin-bottom: 4rpx;
}

.card-unit {
  font-size: 12px;
  color: #666;
}

/* 图表容器基础样式 */
.chart-container {
  margin: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  /* 安全区适配 */
  padding-top: max(20rpx, env(safe-area-inset-top));
  padding-left: max(20rpx, env(safe-area-inset-left));
  padding-right: max(20rpx, env(safe-area-inset-right));
}

/* 全屏时安全区样式 */
.fullscreen-chart {
  padding-top: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-bottom: 0 !important;
}

.fullscreen-chart .date-selector {
  position: fixed;
  top: calc(env(safe-area-inset-top) + 44px);
  left: 0;
  right: 0;
  z-index: 1001;
  margin: 0;
  border-radius: 0;
  border-bottom: 1rpx solid #f0f0f0;
  background: #fff;
}

.fullscreen-chart .chart-header {
  position: fixed;
  top: calc(env(safe-area-inset-top) + 44px + 88rpx);
  left: 0;
  right: 0;
  z-index: 1002;
  padding: 0 20rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fullscreen-chart .chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.fullscreen-chart .fullscreen-btn {
  padding: 10rpx 20rpx;
  background: #4488FB;
  border-radius: 40rpx;
  font-size: 24rpx;
  color: #fff;
}

.fullscreen-chart .chart-card {
  padding-top: calc(env(safe-area-inset-top) + 44px + 176rpx);
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 44px - 176rpx);
}

.date-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16rpx 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 100;
}

.date-tabs {
  display: flex;
}

.date-tab {
  padding: 6rpx 30rpx;
  border: 1rpx solid #e8e8e8;
  font-size: 15px;
  color: #666;
  background: #f8f9fa;
  cursor: pointer;
}

.date-tab.active {
  background: #4488FB;
  color: #fff;
  border-color: #4488FB;
}

.chart-divider {
  height: 1rpx;
  background: #e5e7eb;
  margin-bottom: 24rpx;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.fullscreen-btn {
  padding: 10rpx 20rpx;
  background: #f5f5f5;
  border-radius: 40rpx;
  font-size: 24rpx;
  color: #666;
}

.chart-card {
  margin-top: 10rpx;
}

.empty-chart {
  height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 30rpx;
  margin-top: 20rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
}

.legend-color {
  width: 20rpx;
  height: 20rpx;
  border-radius: 4rpx;
  margin-right: 8rpx;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  width: 80%;
  max-width: 500rpx;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
  z-index: 9999;
}

.modal-header {
  padding: 32rpx;
  /* background: #FFFAF0; */
  display: flex;
  align-items: center;
  justify-content: center;
  /* border-bottom: 1rpx solid #FFE5B4; */

  padding-top: 15%
}

.modal-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon-absolute {
  position: fixed;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -100%);
  width: 80rpx;
  height: 80rpx;
  z-index: 10000;
  margin-top: -120rpx;
  pointer-events: none;
}

.modal-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #F56C6C;
  text-align: center;
}

.modal-body {
  padding: 32rpx;
}

.modal-text {
  display: block;
  font-size: 22rpx;
  color: #606266;
  margin-bottom: 20rpx;
  text-align: center;
}

.modal-footer {
  display: flex;
  /* border-top: 1rpx solid #EBEEF5; */
  height: 88rpx;
  margin-bottom: 5%
}

.modal-cancel {
  flex: 1;
  background: #fff;
  border: 1rpx solid #D9D9D9;
  font-size: 24rpx;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  margin: 4px 20rpx
}

.modal-confirm {
  flex: 1;
  background: #fff;
  border: 1rpx solid #F56C6C;
  font-size: 24rpx;
  font-weight: bold;
  color: #F56C6C;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  margin: 4px 20rpx
}

/* 警告弹窗样式 */
.warning-modal-overlay {
  z-index: 10001;
}

.warning-modal-content {
  max-width: 600rpx;
  width: 85%;
}

.warning-modal-body {
  padding: 20rpx 32rpx 32rpx;
}

.warning-modal-title {
  display: block;
  font-size: 26rpx;
  font-weight: bold;
  color: #F56C6C;
  margin-bottom: 24rpx;
  text-align: center;
}

.warning-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.warning-number {
  font-size: 24rpx;
  color: #F56C6C;
  font-weight: bold;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.warning-modal-text {
  font-size: 24rpx;
  color: #606266;
  line-height: 1.6;
  flex: 1;
}

.warning-confirm {
  background: #F56C6C;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  margin: 0 32rpx 32rpx;
  height: 72rpx;
}
</style>