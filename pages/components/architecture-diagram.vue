<template>
  <view class="container">
    <!-- 警告框和启动按钮 -->
    <view class="warning-and-start">
      <view class="warning-box">
        <text class="warning-icon">⚠️</text>
        <view class="warning-content">
          <text class="warning-title">能源基础电力装备 非专业禁止操作!</text>
          <text class="warning-text">1.系统内置锂电光伏发电，电网断网后仍带电，请谨慎操作;</text>
          <text class="warning-text">2.长期断电将导致锂电过放报警，请联系厂家;</text>
          <text class="warning-text">3.系统具备离网应急功能，请依需要谨慎配置和管理使用。</text>
        </view>
      </view>
      <view class="start-button">
        <view class="start-circle" @click="handleStartStop">
          <image :src="systemRunning ? '../../community/static/images/stop.svg' : '../../community/static/images/start.svg'" class="start-bg" />
          <text class="start-text">{{ systemRunning ? '运行中' : '启动' }}</text>
        </view>
      </view>
    </view>

    <!-- 系统架构图 -->
    <view class="system-img">
      <image src="/static/images/system-architecture-new.png" style="width:100%; height:96%; position: absolute; top:0; left:0; z-index: 1;"></image>
      <view class="detail-storage">
        <p>{{ storageStatus }}</p>
        <p>{{ storageData.power }}kW</p>
      </view>
      <view class="detail-grid">
        <p>{{ gridStatus }}</p>
        <p>{{ totalLoadData.power }}kW</p>
      </view>
      <view class="detail-solar">
        <p>发电</p>
        <p>{{ totalSolarData.power }}kW</p>
      </view>
      <view class="power-label" style="left: 18vw;top: 80%">
        {{ ((currentStatus['600a29b2cdf9e30600897f26'] ? currentStatus['600a29b2cdf9e30600897f26'].P : 157500) / 1000).toFixed(1) }}kW
      </view>
      <view class="power-label" style="left: 33vw;top: 80%">
        {{ ((currentStatus['616e66f584c6e1930fa05917'] ? currentStatus['616e66f584c6e1930fa05917'].P : 157500) / 1000).toFixed(1) }}kW
      </view>
      <view class="power-label" style="left: 48vw;top: 80%">
        {{ ((currentStatus['616e670d84c6e1930fa05919'] ? currentStatus['616e670d84c6e1930fa05919'].P : 157500) / 1000).toFixed(1) }}kW
      </view>
      <view class="power-label" style="left: 63vw;top: 80%">
        {{ ((currentStatus['616e671a84c6e1930fa0591b'] ? currentStatus['616e671a84c6e1930fa0591b'].P : 157500) / 1000).toFixed(1) }}kW
      </view>
      <view class="power-label" style="left: 78vw;top: 80%">
        {{ ((currentStatus['616e672b84c6e1930fa0591d'] ? currentStatus['616e672b84c6e1930fa0591d'].P : 157500) / 1000).toFixed(1) }}kW
      </view>
    </view>

    <!-- 数据卡片 -->
    <view class="card-section">
      <view class="card-row">
        <view class="card">
          <view class="card-item">
            <image src="/static/images/solar.png" class="card-icon"></image>
            <text class="card-title">今日发电</text>
          </view>
          <view class="card-item">
            <text class="card-value">{{ device170F && device170F.energyData && device170F.energyData.B32 ? device170F.energyData.B32.value : '--' }} </text>
            <text class="card-unit"> kWh</text>
          </view>
        </view>
        <view class="card">
          <view class="card-item">
            <image src="/static/images/consumption.png" class="card-icon"></image>
            <text class="card-title">今日用电</text>
          </view>
          <view class="card-item">
            <text class="card-value">{{ device170F && device170F.energyData && device170F.energyData.B36 ? device170F.energyData.B36.value : '--' }} </text>
            <text class="card-unit"> kWh</text>
          </view>
        </view>
      </view>
      <view class="card-row">
        <view class="card">
          <view class="card-item">
            <image src="/static/images/storage.png" class="card-icon"></image>
            <text class="card-title">储能剩余</text>
          </view>
          <view class="card-item">
            <text class="card-value">{{ device170F && device170F.energyData && device170F.energyData.B66 ? device170F.energyData.B66.value : '--' }}</text>
            <text class="card-unit">%</text>
          </view>
        </view>
        <view class="card">
          <view class="card-item">
            <image src="/static/images/grid.png" class="card-icon"></image>
            <text class="card-title">电网供电</text>
          </view>
          <view class="card-item">
            <text class="card-value">{{ device170F && device170F.energyData && device170F.energyData.B40 ? device170F.energyData.B40.value : '--' }} </text>
            <text class="card-unit"> kWh</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 图表区域（全屏核心） -->
    <view class="chart-container" :class="{ 'fullscreen-chart': isFullScreen }" :style="chartContainerStyle">
      <view class="date-selector">
        <view class="date-tabs">
          <view v-for="(tab, i) in ['日', '月', '年']" :key="i" :class="['date-tab', { active: activeChartTab === tab }]" @click="handleDateTypeChange(tab)">
            {{ tab }}
          </view>
        </view>
        <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
        <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
        <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
      </view>
      <view class="chart-divider"></view>
      <view class="chart-header">
        <text class="chart-title">能量</text>
        <view class="fullscreen-btn" @click="handleFullScreen">
          <text>{{ isFullScreen ? '退出全屏' : '全屏' }}</text>
        </view>
      </view>
      <view class="chart-card" :style="chartCardStyle">
        <qiun-data-charts
          v-if="electricityData.categories && electricityData.categories.length > 0"
          type="area"
          :chartData="electricityData"
          :ontouch="true"
          :canvas2d="canvas2d"
          :opts="electricityOpts"
          :canvas-id="chartId + '-energy'"
        />
        <view v-else class="empty-chart">
          <text class="empty-text">暂无能源数据</text>
        </view>
        <view class="chart-legend">
          <view class="legend-item">
            <view class="legend-color" style="background-color: #1890FF;"></view>
            <text>发电</text>
          </view>
          <view class="legend-item">
            <view class="legend-color" style="background-color: #91CB74;"></view>
            <text>负荷</text>
          </view>
          <view class="legend-item">
            <view class="legend-color" style="background-color: #FAC858;"></view>
            <text>充电</text>
          </view>
          <view class="legend-item">
            <view class="legend-color" style="background-color: #EE6666;"></view>
            <text>放电</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 启动弹窗 -->
    <view class="modal-overlay" v-if="showModal" @click="closeModal">
      <!-- 警告图标 - 位于弹窗正上方，确保在最上层 -->
      <image src="/static/images/img-警告.png" class="modal-icon-absolute" />
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">相关配置将影响系统运行效能和运维安全</text>
        </view>
        <view class="modal-body">
          <text class="modal-text">请确认您是专业人士，已知悉相关影响和责任，并取得授权。</text>
        </view>
        <view class="modal-footer">
          <button class="modal-cancel" @click="closeModal">退出</button>
          <button class="modal-confirm" @click="confirmStart">已知悉风险</button>
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
  </view>
</template>

<script>
import { dateStandardFormat } from "@/utils/date-format";

import { getPowerData } from '../../api/power';
import dyDate from '@/components/dy-Date/dy-Date.vue';
import { realtimeDataProvider } from '@/service/websocket';

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
      dcdc170FData: null,
      nyzData: { SOC: "--" },
      electricityOpts: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666"],
        padding: [15, 20, 0, 15],
        dataLabel: false,
        xAxis: { labelCount: 6, disableGrid: true },
        yAxis: { gridType: "dash", showTitle: true, data: [{ position: "left", title: "单位:kWh" }] },
        extra: { area: { type: "straight", width: 2 } }
      },
      electricityData: { categories: [], series: [{ data: [], name: '发电功率' }] },
      showModal: false,
      showStopModal: false,
      systemRunning: false,
      isFullScreen: false,
      statusBarHeight: 93 // 默认状态栏高度
    }
  },
  computed: {
    chartContainerStyle() {
      if (this.isFullScreen) {
        return `
          position: fixed;
          top: 93px;
          left: 0;
          width: 100vw;
          height: calc(100vh - 20px);
          margin: 0;
          background: #fff;
          z-index: 9999;
        `;
      }
      return '';
    },
    chartCardStyle() {
      return this.isFullScreen ? 'height: 60vh;' : '';
    },
    device170F() {
      return this.deviceList.find(item => item && item.deviceType === '170F_V1_2');
    },
  },
  onLoad() {
    // 获取设备状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 93;
    console.log('statusBarHeight', this.statusBarHeight);
  },
  mounted() {
    // realtimeDataProvider.createScoket(uni.getStorageSync('currentTemplate'), uni.getStorageSync('urlPrefix'));
    this.init170CDevice();
    this.getSqRealTimeData();
    this.getNyzRealTimeData();
    this.initPage();
    this.dataInterval = setInterval(() => { this.initPage() }, 1000 * 60 * 5);
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 93;
    console.log('statusBarHeight', this.statusBarHeight);
    // this.statusBarHeight = systemInfo.statusBarHeight || 93;
    // console.log('statusBarHeight---------------', this.statusBarHeight);
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
    init170CDevice() {
      const device170C = {
        deviceType: '170C_V1_1',
        address: '1F',
        barCode: '00 00 02 20 25 06 05 09 37 11 2E 00 00 00 00',
        deviceId: '170C001',
        name: 'DCDC设备'
      };

      const device170F = {
        deviceType: '170F_V1_2',
        address: '01',
        barCode: '00 00 02 20 25 06 05 09 37 11 2E 00 00 00 00',
        deviceId: '170F001',
        name: 'DCDC设备170F'
      };

      
      realtimeDataProvider.initDeviceList([device170C, device170F]);
      this.deviceList = realtimeDataProvider.getDeviceList();
      console.log('deviceList', this.deviceList);


    },
    handle170FData(jsonData) {
      console.log('170F设备数据:', jsonData);
      this.dcdc170FData = jsonData;
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
        uni.showToast({
          title: '已适配安全区，内容不遮挡',
          icon: 'none',
          duration: 2000
        });
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
        esId: 8,
        date: dateStandardFormat(new Date()),
        areaLevelIds: 950
      };
      
      // 调用新接口
      getPowerData(params).then(result => {
        if (result.data) {
          const generationData = [], loadData = [], xAxisData = [];
          result.data.forEach(item => {
            // 确保数据为Number格式
            generationData.push(Number(item.generatedPower) || 0);
            loadData.push(Number(item.loadPower) || 0);
            // 从dateTime中提取小时部分
            const hour = item.dateTime ? item.dateTime.split(' ')[1].split(':')[0] : '';
            xAxisData.push(hour);
          });
          this.electricityData = {
            categories: xAxisData,
            series: [
              { data: generationData, name: '发电' },
              { data: loadData, name: '用电' }
            ]
          };
        }
      });
    },
    findMonthEnergyAndIncome() {},
    findYearEnergyAndIncome() {},
    getSum(arr) {
      return arr.includes('--') ? '--' : arr.reduce((acc, val) => acc + val, 0);
    },
    showStartModal() { this.showModal = true; },
    closeModal() { this.showModal = false; },
    confirmStart() {
      this.showModal = false;
      this.systemRunning = true;
      uni.showToast({ title: '系统已启动', icon: 'success' });
    },
    openStopModal() { this.showStopModal = true; },
    closeStopModal() { this.showStopModal = false; },
    confirmStop() {
      this.showStopModal = false;
      this.systemRunning = false;
      uni.showToast({ title: '系统已停止', icon: 'success' });
    },
    handleStartStop() {
      if (this.systemRunning) {
        this.showStopModal = true;
      } else {
        this.showModal = true;
      }
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
}
.warning-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
  color: #FF7D00;
}
.warning-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff762C;
  display: block;
  text-align: center;
  margin-bottom: 8rpx;
}
.warning-text {
  font-size: 22rpx;
  color: #666;
  line-height: 1.5;
  display: block;
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
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
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
  height: 440rpx;
  margin: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #f5f5f5;
}
.detail-storage, .detail-grid, .detail-solar {
  position: absolute;
  background: rgba(255,255,255,0.9);
  padding: 8rpx 12rpx;
  border-radius: 6rpx;
  font-size: 22rpx;
}
.detail-storage { top: 10rpx; left: 10rpx; }
.detail-grid { top: 10rpx; right: 10rpx; }
.detail-solar { bottom: 10rpx; left: 10rpx; }
.power-label {
  position: absolute;
  color: #4488fb;
  padding: 2rpx 6rpx;
  border-radius: 3rpx;
  font-size: 20rpx;
  z-index: 2;
}
.card-section {
  margin: 20rpx;
}
.card-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}
.card {
  flex: 1;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12rpx;
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
  padding-top: env(safe-area-inset-top) !important;
  padding-left: env(safe-area-inset-left) !important;
  padding-right: env(safe-area-inset-right) !important;
  padding-bottom: env(safe-area-inset-bottom) !important;
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
  background: rgba(0,0,0,0.5);
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

  padding-top:15%
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
  top: 46%;
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
  margin-bottom:5%
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
  margin:4px 20rpx
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
   margin:4px 20rpx
}
</style>