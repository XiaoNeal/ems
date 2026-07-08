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


      <view
        style=" position:absolute;top:41%;left:36%;background: #fff;width:50px;height:100px;z-index: 1000;opacity: 0.5;">
      </view>
      <view
        style=" position:absolute;top:41%;left:66%;background: #fff;width:50px;height:100px;z-index: 1000;opacity: 0.5;">
      </view>
      <view
        style=" position:absolute;top:41%;left:81%;background: #fff;width:50px;height:100px;z-index: 1000;opacity: 0.5;">
      </view>


      <image src="/static/images/system-architecture-new.png"
        style="width:100%; height:96%; position: absolute; top:0; left:0; z-index: 1;padding: 20rpx;"></image>
      <!-- 光伏 -->
      <view class="device-label-top-left">
        <text class="device-name">光伏</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B0 ?
            this.formatValue(device171F.energyData.B0.value, 2) : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view>
      <!-- 电网 -->
      <view class="device-label-top-right">
        <text class="device-name">电网</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B4 ?
            this.formatValue(device171F.energyData.B4.value, 2) : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view>


      <view class="device-label" style="left:36%;top: 31%;">
        <!-- <text class="device-name">交流负荷</text> -->
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B14 ?
            this.formatValue(device171F.energyData.B14.value, 2) : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view>
      <!-- 设备数据标签 -->
      <view class="device-label" style="left: 3%;top: 75%">
        <text class="device-name">交流负荷</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B68 ?
            this.formatValue(device171F.energyData.B68.value, 2) : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view>
      <view class="device-label" style="left: 18%;top: 78%">
        <text class="device-name">储能</text>
        <view class="power-row">
          <text class="device-power">
            <text v-if="device171F && device171F.energyData && device171F.energyData.B60">
              {{ parseFloat(device171F.energyData.B60.value) > 0 ? '充电' : (parseFloat(device171F.energyData.B60.value) <
                0 ? '放电' : '静置') }} </text>
                <text v-if="device171F && device171F.energyData && device171F.energyData.B60">
                  {{ ' ' }}
                </text>
                {{ device171F && device171F.energyData && device171F.energyData.B8 ?
                  this.formatValue(device171F.energyData.B8.value, 2) : '--' }}</text>
            <text class="power-unit">kW</text>
        </view>
        <text class="device-soc">{{ device171F && device171F.energyData && device171F.energyData.B128 ?
          this.formatValue(device171F.energyData.B128.value, 2) : '--' }}%</text>
      </view>
      <!-- <view class="device-label" style="left: 38%;top: 78%">
        <text class="device-name">空调</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B18 ?
            this.formatValue(device171F.energyData.B18.value, 2) : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view> -->
      <!-- <view class="device-label" style="left: 47%;top: 78%">
        <text class="device-name">柔性直流充电桩</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B26 ?
            this.formatValue(device171F.energyData.B26.value, 2) : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view> -->
      <!-- <view class="device-label" style="left: 70%;top: 78%">
        <text class="device-name">照明</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B30 ?
            this.formatValue(device171F.energyData.B30.value, 2) : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view> -->
      <!-- <view class="device-label" style="left: 83%;top: 78%">
        <text class="device-name">其他负荷</text>
        <view class="power-row">
          <text class="device-power">{{ device171F && device171F.energyData && device171F.energyData.B14 ?
            this.formatValue(device171F.energyData.B14.value, 2) : '--' }}</text>
          <text class="power-unit">kW</text>
        </view>
      </view> -->
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
            <text class="card-value">{{ device171F && device171F.energyData && device171F.energyData.B34 ?
              this.formatValue(device171F.energyData.B34.value, 2) : '--' }} </text>
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
            <text class="card-value">{{ device171F && device171F.energyData && device171F.energyData.B38 ?
              this.formatValue(device171F.energyData.B38.value, 2) : '--' }} </text>
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
            <text class="card-value">{{ device171F && device171F.energyData && device171F.energyData.B128 ?
              this.formatValue(device171F.energyData.B128.value, 2) : '--' }}</text>
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
            <text class="card-value">{{ device171F && device171F.energyData && device171F.energyData.B42 ?
              this.formatValue(device171F.energyData.B42.value, 2) : '--' }} </text>
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
        <view v-if="electricityLoading" class="loading-chart">
          <view class="loading-spinner"></view>
          <text class="loading-text">加载中...</text>
        </view>
        <!--  -->
        <qiun-data-charts v-else-if="electricityData.categories && electricityData.categories.length > 0"
          :type="electricityChartType" :chartData="electricityData" :ontouch="true" :canvas2d="canvas2d"
          :opts="electricityOpts" :canvasId="chartId + '-energy'" />
        <EmptyState v-else title="暂无能源数据" desc="当前时段暂无能源数据记录" @refresh="handleRefresh" />
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
          <text class="modal-title">是否停止策略</text>
        </view>
        <view class="modal-body">
          <text class="modal-text">请确认您是专业人士，已知悉相关影响和责任，并取得授权。</text>
          <!-- <text class="modal-text">请确保已做好相关准备工作。</text> -->
        </view>
        <view class="modal-footer">
          <button class="modal-cancel" @click="closeStopModal">取消</button>
          <button class="modal-confirm" @click="confirmStop">确认</button>
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

import { getPowerData, queryMonthElectricityStatistic, queryYearElectricityStatistic } from '../../api/power';
import dyDate from '@/components/dy-Date/dy-Date.vue';
import { realtimeDataProvider } from '@/service/websocket';
import EmptyState from '@/components/empty-state/empty-state.vue';

import { sendCommandFrame } from '@/api/control.js'

export default {
  components: { dyDate, EmptyState },
  name: "ArchitectureDiagram",
  inject: ['get171FDeviceList'],
  data() {
    return {
      chartId: 'architecture-' + Math.random().toString(36).substr(2, 9),
      activeChartTab: '日',
      canvas2d: this.$Config?.ISCANVAS2D ?? false,
      timeTypeIndex: 0,
      selectedDate: (() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      })(),
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
      nyzData: { SOC: "--" },
      // 设备配置参数
      deviceConfig: {
        idCode: '',
        typeCode: '3401',
        address: '01'
      },
      electricityOpts: {
        color: ["#57dd76", "#ffa13c", "#71a6ff", "#a670ff"],
        animation: false,

        dataLabel: false,
        dataPointShape: false,
        padding: [15, 20, 0, 15],
        enableScroll: false,
        legend: { select: true },
        xAxis: { labelCount: 6, disableGrid: true },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          showTitle: true,
          fontSize: 10,
          // tofix: 0,
          data: [{ title: "功率(kW)", tofix: 0 }],
          // title: "kW"
        },
        extra: {
          area: {
            type: "curve",
            opacity: 0.15, // 降低填充透明度，解决遮挡（关键！示例浅色填充）
            addLine: true,
            width: 2, // 加粗曲线，线条更清晰
            gradient: true,
            activeType: "hollow",
            stack: false, // 关闭堆叠，每条曲线独立计算y值
            zIndex: [4, 3, 2, 1] // 层级：发电最上层，放电最下层，避免浅色被盖住 // 关键：关闭堆叠，四条曲线独立分开，和柱子逻辑一致
          },
          column: {
            type: "group", // 必须开启分组多柱子
            // width: 14,     // 单根柱子宽度
            categoryGap: 2 // 两组时间点之间的空隙百分比
          },
        }

      },
      type: 'hour',
      electricityData: {},
      electricityLoading: false,
      showModal: false,
      showStopModal: false,
      showWarningModal: false,
      systemRunning: false,
      isFullScreen: false,
      statusBarHeight: 93, // 默认状态栏高度
      navBarHeight: 44, // 导航栏高度
      topSafeArea: 0, // 顶部安全区域总高度
      device171F: null
    }
  },
  watch: {
    '$store.state.currentSelectDevice': {
      handler() {
        console.log('currentSelectDevice111111111', this.$store.state.currentSelectDevice)
        this.updateDevice171F()
      },
      immediate: true,
      deep: true
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

    userId() {
      return this.$store.state.userInfo?.userId || 0
    },
    electricityChartType() {
      // 月和年数据用柱状图，小时数据用面积图
      const type = this.type === 'hour' ? 'area' : 'column';
      return type;
    }
  },
  onLoad() {
    // 获取设备状态栏高度
    const windowInfo = uni.getWindowInfo();
    this.statusBarHeight = windowInfo.statusBarHeight || 93;
    console.log('statusBarHeight', this.statusBarHeight);
  },
  mounted() {

    const currentDevice = this.$store.state.currentSelectDevice || {}
    const deviceControl = (currentDevice.list || []).find(item => item.controlType == 1);
    this.deviceConfig.idCode = deviceControl?.homeBarCode || '';
    // this.deviceConfig.typeCode = deviceControl || '3401';
    // this.deviceConfig.address = deviceControl?.address || '01';

    // 获取系统信息并设置CSS变量
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 20;
    this.navBarHeight = systemInfo.platform === 'android' ? 48 : 44;
    this.topSafeArea = this.statusBarHeight + this.navBarHeight;
    // 设置CSS变量用于全屏模式（仅在H5环境中执行）
    const safeAreaTop = systemInfo.safeArea?.top || systemInfo.statusBarHeight || 0;
    const safeAreaBottom = systemInfo.safeArea?.bottom || 0;
    // 检查是否为H5环境（小程序中没有document对象）
    if (typeof document !== 'undefined' && document.documentElement) {
      try {
        document.documentElement.style.setProperty('--safe-area-top', safeAreaTop + 'px');
        document.documentElement.style.setProperty('--safe-area-bottom', safeAreaBottom + 'px');
      } catch (e) {
        console.warn('Failed to set CSS variables:', e);
      }
    }
    this.getPowerData();
  },
  beforeDestroy() {
    this.dataInterval && clearInterval(this.dataInterval);
    // realtimeDataProvider.unregister();
    // #ifdef APP-PLUS
    plus.navigator.setStatusBarStyle('default');
    plus.navigator.setStatusBarBackground('#ffffff');
    plus.screen.lockOrientation('portrait-primary');
    // #endif
  },
  methods: {
    updateDevice171F() {
      this.deviceList = realtimeDataProvider.getDeviceList()
      console.log('deviceList架构图', this.deviceList)
      this.device171F = this.deviceList.find(item => item && item.deviceType === '171F');
      const b12Value = this.device171F && this.device171F.controlData && this.device171F.controlData.B12 && this.device171F.controlData.B12.value;
      if (b12Value !== undefined && b12Value !== null) {
        this.systemRunning = (b12Value === 1 || b12Value === '1');
      }
    },
    formatValue(value, decimals = 2) {
      const num = parseFloat(value);
      return isNaN(num) ? "--" : num.toFixed(decimals);
    },
    // init171FDevice() {
    //   this.get171FDeviceList();
    //   this.deviceList = realtimeDataProvider.getDeviceList()
    //   console.log('deviceList--------', this.deviceList);
    // },
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
    handleDateTypeChange(tab) {
      this.activeChartTab = tab;
      const map = { '日': 0, '月': 1, '年': 2 };
      this.timeTypeIndex = map[tab];
      const currentDate = new Date();
      this.selectedDate = {
        0: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
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
      if (this.type === "hour") this.getPowerData();
      else if (this.type === "day") this.findMonthElectricity();
      else if (this.type === "month") this.findYearEnergyAndIncome();
    },

    enumStorageStatus(status) {
      const statusMap = { 0: "初始化", 1: "充电", 2: "放电", 3: "静置" };
      return statusMap[status] || "--";
    },

    getPowerData() {
      this.electricityLoading = true;
      // 从store获取当前设备信息
      const currentDevice = this.$store.state.currentSelectDevice || {};

      console.log('currentDevice:', this.selectedDate, currentDevice, this.$store.state.currentSelectDevice, this.$store.state);
      // 准备接口参数
      const params = {
        esId: currentDevice.id,
        date: this.selectedDate,
        areaLevelIds: currentDevice.areaLevelId
      };
      getPowerData(params).then(result => {
        if (result.data && result.data.length > 0) {
          const dataList = result.data;
          const generationData = [], loadData = [], chargeData = [], dischargeData = [], xAxisData = [], gridData = [], gridReverseData = [];
          dataList.forEach(item => {
            const dateTime = item.dateTime || '';
            const timeStr = dateTime.substring(11, 16);
            xAxisData.push(timeStr);

            const generatedPower = parseFloat(item.generatedPower || 0);
            const loadPower = parseFloat(item.loadPower || 0);
            const dischargePower = parseFloat(item.storagePowerReverse || 0);
            const chargePower = parseFloat(item.storagePower || 0);
            const gridPower = parseFloat(item.gridPower || 0);
            const gridReversePower = parseFloat(item.gridPowerReverse || 0);

            // console.log('gridData', gridPower, gridReversePower);

            generationData.push(isNaN(generatedPower) ? 0 : parseFloat(generatedPower.toFixed(2)));
            loadData.push(isNaN(loadPower) ? 0 : parseFloat(loadPower.toFixed(2)));
            chargeData.push(isNaN(chargePower) ? 0 : parseFloat(chargePower.toFixed(2)));
            dischargeData.push(isNaN(dischargePower) ? 0 : parseFloat(dischargePower.toFixed(2)));
            gridData.push(isNaN(gridPower) ? 0 : parseFloat(gridPower.toFixed(2)));
            gridReverseData.push(isNaN(gridReversePower) ? 0 : parseFloat(gridReversePower.toFixed(2)));
          });
          // console.log('xAxisData', generationData, loadData, chargeData, dischargeData);
          this.electricityOpts.yAxis.data[0].title = '功率(kW)';

          // this.electricityOpts.yAxis.data[0].max = Math.max(...generationData, ...loadData, ...chargeData, ...dischargeData, ...gridData, ...gridReverseData);
          const rawMax = Math.max(...generationData, ...loadData, ...chargeData, ...dischargeData, ...gridData, ...gridReverseData);
          let targetMax;

          if (rawMax < 0) {
            // 负数向下取整：-0.02 → -1，-3.1 → -4
            targetMax = Math.floor(rawMax);
          } else if (rawMax < 1) {
            // 0~1之间统一设为1
            targetMax = 1;
          } else {
            // 正数向上取整
            targetMax = Math.ceil(rawMax);
          }

          this.electricityOpts.yAxis.data[0].max = targetMax;
          this.electricityData = {
            categories: xAxisData,
            series: [
              { data: generationData, name: '发电' },
              { data: loadData, name: '用电' },
              { data: chargeData, name: '充电' },
              { data: dischargeData, name: '放电' },
              { data: gridData, name: '供电' },
              { data: gridReverseData, name: '馈电' },
            ]
          };
          console.log('this.electricityData', this.electricityData);
        }
        this.electricityLoading = false;
      }).catch(() => {
        this.electricityLoading = false;
      });
    },
    findMonthElectricity() {
      this.electricityLoading = true;
      const currentDevice = this.$store.state.currentSelectDevice || {};
      const esId = currentDevice.esId || currentDevice.id || 0;
      const areaLevelIds = currentDevice.areaLevelId || 0;

      const now = new Date();
      const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}`;

      queryMonthElectricityStatistic({
        esId: esId,
        startDate: startDate,
        endDate: endDate,
        areaLevelIds: areaLevelIds
      }).then((res) => {
        const dataList = res.data || [];

        if (dataList.length > 0) {
          const sortedData = dataList.sort((a, b) => new Date(a.date) - new Date(b.date));
          this.electricityOpts.yAxis.data[0].title = '电量(kWh)';

          const generationData = [], loadData = [], chargeData = [], dischargeData = [], xAxisData = [];
          sortedData.forEach(item => {
            const date = new Date(item.date);
            xAxisData.push(`${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
            generationData.push(isNaN(parseFloat(item.photovoltaicPower) || 0) ? 0 : parseFloat(item.photovoltaicPower.toFixed(2)));
            loadData.push(isNaN(parseFloat(item.loadPower) || 0) ? 0 : parseFloat(item.loadPower.toFixed(2)));
            chargeData.push(isNaN(parseFloat(item.storageCharge) || 0) ? 0 : parseFloat(item.storageCharge.toFixed(2)));
            dischargeData.push(isNaN(parseFloat(item.storageDischarge) || 0) ? 0 : parseFloat(item.storageDischarge.toFixed(2)));
          });

          // console.log('xAxisData', generationData, loadData, chargeData, dischargeData);
          const rawMax = Math.max(...generationData, ...loadData, ...chargeData, ...dischargeData);
          let targetMax;

          if (rawMax < 0) {
            // 负数向下取整：-0.02 → -1，-3.1 → -4
            targetMax = Math.floor(rawMax);
          } else if (rawMax < 1) {
            // 0~1之间统一设为1
            targetMax = 1;
          } else {
            // 正数向上取整
            targetMax = Math.ceil(rawMax);
          }

          this.electricityOpts.yAxis.data[0].max = targetMax;
          this.electricityData = {
            categories: sortedData.map(item => {
              const date = new Date(item.date);
              return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }),
            series: [
              { data: sortedData.map(item => parseFloat(item.photovoltaicPower) || 0), name: '发电' },
              { data: sortedData.map(item => parseFloat(item.loadPower) || 0), name: '用电' },
              { data: sortedData.map(item => parseFloat(item.storageCharge) || 0), name: '充电' },
              { data: sortedData.map(item => parseFloat(item.storageDischarge) || 0), name: '放电' },
            ]
          };
        }


        this.electricityLoading = false;
      }).catch((err) => {
        this.electricityLoading = false;
        console.error('获取月电量数据失败:', err);
      });
    },
    findYearEnergyAndIncome() {
      this.electricityLoading = true;
      const currentDevice = this.$store.state.currentSelectDevice || {};
      const esId = currentDevice.esId || currentDevice.id || 0;
      const areaLevelIds = currentDevice.areaLevelId || 0;
      const now = new Date();
      const year = now.getFullYear();
      queryYearElectricityStatistic({
        esId: esId,
        year: year,
        areaLevelIds: areaLevelIds
      }).then((res) => {
        if (res.data && res.data.length > 0) {
          const dataList = res.data;
          const generationData = [], loadData = [], chargeData = [], dischargeData = [], xAxisData = [];

          for (let m = 0; m < 12; m++) {
            const month = m + 1;
            xAxisData.push(`${month}月`);

            const monthData = dataList.filter(item => {
              const itemMonth = parseInt(item.month) || 0;
              return itemMonth === month;
            });
            if (monthData.length > 0) {
              const totalGeneration = monthData.reduce((sum, item) => sum + (parseFloat(item.photovoltaicPower) || 0), 0);
              const totalLoad = monthData.reduce((sum, item) => sum + (parseFloat(item.loadPower) || 0), 0);
              const totalCharge = monthData.reduce((sum, item) => sum + (parseFloat(item.storageCharge) || 0), 0);
              const totalDischarge = monthData.reduce((sum, item) => sum + (parseFloat(item.storageDischarge) || 0), 0);

              generationData.push(parseFloat(totalGeneration.toFixed(2)));
              loadData.push(parseFloat(totalLoad.toFixed(2)));
              chargeData.push(parseFloat(totalCharge.toFixed(2)));
              dischargeData.push(parseFloat(totalDischarge.toFixed(2)));
            } else {
              generationData.push(0);
              loadData.push(0);
              chargeData.push(0);
              dischargeData.push(0);
            }
          }

          this.electricityOpts.yAxis.data[0].title = '电量(kWh)';
          const rawMax = Math.max(...generationData, ...loadData, ...chargeData, ...dischargeData);
          let targetMax;

          if (rawMax < 0) {
            // 负数向下取整：-0.02 → -1，-3.1 → -4
            targetMax = Math.floor(rawMax);
          } else if (rawMax < 1) {
            // 0~1之间统一设为1
            targetMax = 1;
          } else {
            // 正数向上取整
            targetMax = Math.ceil(rawMax);
          }

          this.electricityOpts.yAxis.data[0].max = targetMax;

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
        this.electricityLoading = false;
      }).catch((err) => {
        this.electricityLoading = false;
        console.error('获取年电量数据失败:', err);
      });
    },

    showStartModal() { this.showModal = true; },
    closeModal() { this.showModal = false; },
    openStopModal() { this.showStopModal = true; },
    closeStopModal() { this.showStopModal = false; },

    // 通用命令执行方法
    async executeCommand(options) {
      const { title, content, apiSufix, commandBuilder, action, stateKey } = options;

      return new Promise(async (resolve) => {

        try {
          uni.showLoading({ title: '下发中...' });
          const commands = typeof commandBuilder === 'function' ? commandBuilder(action) : commandBuilder;

          let res = await sendCommandFrame({
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
        return
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
        title: '策略启动',
        content: '确定要启动策略吗？',
        apiSufix: 'systemControl',
        commandBuilder: () => this.buildCommand('112', '1'),
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
        title: '策略停止',
        content: '确定要停止策略吗？',
        apiSufix: 'systemControl',
        commandBuilder: () => this.buildCommand('112', '0'),
        action: 'stop',
        stateKey: 'systemRunning'
      });
      if (success) {
        this.systemRunning = false;
      }
    },

    handleStartStop() {
      console.log(this.$store,"----------------------")
      // const globalRoleId = this.$store.state.userInfo?.roleId || this.$store.state.user?.roleId
      // if (![1, 2].includes(globalRoleId)) {
      //   const currentRoleId = this.$store.state.currentEsRoleId
      //   if (![1, 2].includes(currentRoleId)) {
      //     uni.showToast({ title: '无权限操作', icon: 'none' });
      //     return;
      //   }
      // }
      const status = this.getSystemStatus();
      if (status === '运行中') {
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
      return this.systemRunning ? '运行中' : '启动';
    },
    handleRefresh() {
      this.handleDatePicker(this.selectedDate);
    },
  }
};
</script>

<style scoped>
.container {
  min-height: calc(100vh - 120rpx);
  background: #f5f7fa;
  /* padding-bottom: 30rpx; */
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
  height: 450rpx;
}

.loading-chart {
  height: 450rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12rpx;
  animation: fadeIn 0.3s ease-out;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #e0e0e0;
  border-top-color: #4488FB;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.loading-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 16rpx;
}

.empty-chart {
  height: 450rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12rpx;
  animation: fadeIn 0.5s ease-out;
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