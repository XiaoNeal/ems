<template>
  <view class="container">

    <!-- 设备统计区块 -->
    <view class="card device-stats">
      <view class="section-header">
        <text class="title">设备信息</text>
      </view>
      <view class="device-grid">
        <view class="device-item">
          <text class="number">{{ nyzData.dljQuantity || 0 }}</text>
          <text class="text">空调</text>
        </view>
        <view class="device-item">
          <text class="number">{{ nyzData.cdzQuantity || 1 }}</text>
          <text class="text">充电桩</text>
        </view>
        <view class="device-item">
          <text class="number">{{ nyzData.nyzQuantity || 0 }}</text>
          <text class="text">照明</text>
        </view>
        <view class="device-item">
          <text class="number">{{ nyzData.unknownDeviceQuantity || 0 }}</text>
          <text class="text">未知设备</text>
        </view>
      </view>
    </view>

    <!-- 负荷曲线区块 -->
    <view class="card">
      <view class="section-header">
        <text class="title">负荷曲线</text>
        <dy-date timeType="day" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
      </view>
      <view class="chart-container">
        <view v-if="curveLoading" class="chart-loading">
          <view class="loading-spinner"></view>
          <text class="loading-text">加载中...</text>
        </view>
        <view v-else-if="loadChartData.series[0] && loadChartData.series[0].data.length > 0" class="chart-loaded">
          <qiun-data-charts type="area" :chartData="loadChartData" :opts="loadChartOptions" :ontouch="true"
            :canvas2d="canvas2d" class="main-chart" :canvas-id="chartId + '-load'" />
        </view>
        <EmptyState v-else title="暂无数据" desc="当前时段暂无负荷数据" @refresh="findFlexibilityLoadPowerTotal" />
      </view>
    </view>

    <!-- 设备列表 -->
    <view class="card device-list" v-if="false">
      <view class="list-header">
        <text class="list-title">负荷列表</text>
        <!-- <view class="access-setting-btn" @click="goToAccessSetting">
          <text class="setting-icon">⚙️</text>
          <text class="setting-text">接入设置</text>
        </view> -->
      </view>

      <!-- 卡片网格容器 -->
      <view class="device-card-grid">
        <view v-for="(item, index) in deviceList" :key="index" @click="onDeviceClick(item)" class="device-card">
          <view class="device-name">{{ item.deviceName }}</view>
          <!-- 设备图标 -->
          <view class="device-image">
            <img class="device-icon" v-if="item.type == '0305'" src="../../community/static/images/VRV.png" />
            <img class="device-icon" v-if="item.type == 2"
              src="../../community/static/images/load-airconditioner.png" />
            <img class="device-icon" v-if="item.type == 3" src="../../community/static/images/load-chargingPile.png" />
          </view>
          <!-- 设备信息 -->
          <view class="device-info">
            <view class="device-data">
              <view class="data-item">
                <text class="data-label">功率</text>
                <text class="data-value">{{ item.power || '--' }} W</text>
              </view>
              <view class="data-item">
                <text class="data-label">用电量</text>
                <text class="data-value">{{ item.energyConsumption || '--' }} kWh</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>


<script>
import {
  getSocketinstance
} from "@/service/websocket";
import { queryDayGeneratedPower, getPowerData } from '../../api/power'
import dyDate from '@/components/dy-Date/dy-Date.vue';
import EmptyState from '@/components/empty-state/empty-state.vue';
const commonArcbarOptions = {
  padding: [15, 15, 0, 15],
  title: { name: '75%', fontSize: 12, color: '#1890FF' },
  subtitle: { name: '完成率', fontSize: 12, color: '#666' },
  extra: {
    arcbar: {
      type: 'circle',
      width: 6,
      startAngle: 0.75,
      backgroundColor: '#F0F2F5',
      gradient: true
    }
  }
}
import { calculateYAxisMax } from '@/utils/tools';

export default {
  components: { dyDate, EmptyState },
  name: 'load-management',
  data() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    return {
      chartId: 'load-' + Math.random().toString(36).substr(2, 9),
      datetimesingle: '',
      canvas2d: this.$Config.ISCANVAS2D,
      dljTotalDeviceCount: "2",
      cdzTotalDeviceCount: "1",
      current: "load-management",
      selectDateType: 'date',
      selectTime: new Date(),
      deviceStatus: 1,
      deviceCount: {
        '充电桩': 0,
        '多联机': 1,
        '未知设备': 0,
        '模块机': 0,
        '能源站': 0
      },
      nyzData: {
        dljQuantity: "0",
        cdzQuantity: "1",
        mkjQuantity: "0",
        lightQuantity: "0",
        unknownDeviceQuantity: "0",
        nyzFlexibility: "--",
        totalLoadrate: "--",
        totalEnergyEfficiencyLevel: "--"
      },
      curveLoading: false,
      loadOptions: {},
      softValueOptions: {},
      loadRateOptions: {},
      efficiencyOptions: {},

      loadChartData: {
        categories: [],
        series: [{ name: '总功率', data: [] }]
      },
      loadChartMax: 1,
      opts: {},
      softChartOptions: { ...commonArcbarOptions, title: { name: `--%`, fontSize: 12 }, subtitle: { name: '系统柔度', fontSize: 12 }, color: ['#1890FF', '#36CFC9'] },
      loadRateChartOptions: { ...commonArcbarOptions, title: { name: `--%`, fontSize: 12 }, subtitle: { name: '负载率', fontSize: 12, }, color: ['#FF9F5C', '#FFC53D'] },
      efficiencyChartOptions: { ...commonArcbarOptions, title: { name: `--%`, fontSize: 12 }, subtitle: { name: '能效水平', fontSize: 12 }, color: ['#87D068', '#95DE64'] },
      softChartData: { series: [{ data: 0 }] },
      loadRateChartData: { series: [{ data: 0 }] },
      efficiencyChartData: { series: [{ data: 0 }] },
      deviceList: [
        { deviceName: '设备名称', devId: "--", projectAddress: "--", deviceFlexibility: 0.6, deviceLoadRatio: 0, deviceEnergyEfficiencyLevel: 1 },
        { deviceName: '设备名称', devId: "--", projectAddress: "--", deviceFlexibility: 0.6, deviceLoadRatio: 0.3, deviceEnergyEfficiencyLevel: 2 },
        { deviceName: '设备名称', devId: "--", projectAddress: "--", deviceFlexibility: 0.6, deviceLoadRatio: 0.6, deviceEnergyEfficiencyLevel: 3 },
        { deviceName: '设备名称', devId: "--", projectAddress: "--", deviceFlexibility: 0.6, deviceLoadRatio: 0.9, deviceEnergyEfficiencyLevel: 1 },
      ],
      selectedDate: today,
    };
  },
  mounted() {
    this.datetimerange = ["2021-07-08 0:01:10", "2021-08-08 23:59:59"]
    this.getDeviceCount();
    // this.getDeviceInfo();
    // this.getNyzRealTimeData();
    this.findFlexibilityLoadPowerTotal();
  },
  computed: {
    loadChartOptions() {
      const maxValue = calculateYAxisMax(this.loadChartData.series[0]?.data || []);
      return {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        dataLabel: false,
        dataPointShape: false,
        xAxis: { labelCount: 6, disableGrid: true },
        padding: [15, 20, 20, 15],
        yAxis: {
          gridType: "dash",
          showTitle: true,
          data: [{ position: "left", title: "单位:kW", min: null, max: maxValue }],
          dashLength: 2,
          tofix: 2
        },
        extra: { area: { type: "curve", gradient: true } }
      }
    }
  },
  methods: {
    handleDatePicker(value) {
      this.selectedDate = value
      this.findFlexibilityLoadPowerTotal();
    },
    getEnergyColor(level) {
      const colors = { 1: '#FF4D4F', 2: '#FFC53D', 3: '#87D068' }
      return colors[level] || '#EEE'
    },
    // getNyzRealTimeData() {
    //   getSocketinstance().socket.emit("register")
    //   getSocketinstance().socket.on("nyzData", (jsonData) => {
    //     const { deviceType, address, dataType, data } = jsonData
    //     if (deviceType === "1712_V2" && address == "64" && dataType == "2") {
    //       this.nyzData.dljQuantity = parseFloat(data.B4)
    //       this.nyzData.mkjQuantity = parseFloat(data.B10)
    //       this.nyzData.unknownDeviceQuantity = parseFloat(data.B12)
    //       this.nyzData.nyzFlexibility = parseFloat(data.B14)
    //       this.nyzData.totalLoadrate = parseFloat(data.B16)
    //       this.nyzData.totalEnergyEfficiencyLevel = parseFloat(data.B18)
    //     }
    //   })
    // },
    async findFlexibilityLoadPowerTotal() {
      this.curveLoading = true
      try {
        const currentDevice = this.$store.state.currentSelectDevice || {};
        const esId = currentDevice.esId || currentDevice.id;
        const areaLevelIds = currentDevice.areaLevelId || this.$store.state.areaInfoId;
        const result = await getPowerData({
          esId: esId,
          date: this.selectedDate,
          areaLevelIds: areaLevelIds
        });
        if (result && result.data && Array.isArray(result.data)) {
          const data = result.data;
          if (data.length > 0) {
            this.loadChartData.categories = data.map(item => {
              const time = item.dateTime || '';
              return time.substring(11, 16) || time;
            });
            this.loadChartData.series[0].data = data.map(item => {
              return Number(item.loadPower || 0);
            });
          } else {
            this.loadChartData.categories = [];
            this.loadChartData.series[0].data = [];
          }
        }
      } finally {
        this.curveLoading = false
      }
    },
    async getDeviceCount() {
      try {
        // const result = await energy.findAllDeviceInfo();
        // if (result.data) this.deviceCount = result.data.deviceInfoMap;
      } catch (err) { console.error(err); }
    },
    getDeviceStatus(idx) {
      const map = { '0': '离线', '1': '等待注册', '2': '等待配置', '3': '运行', '4': '在线' };
      return map[idx]
    },
    onDeviceClick(device) {
      console.log(device)
      uni.navigateTo({
        url: `/community/device-detail/device-detail?deviceInfo=${encodeURIComponent(JSON.stringify(device))}`
      });
    },
    goToAccessSetting() {
      uni.navigateTo({ url: '/community/access-setting/access-setting' });
    },
    getProgressEndColor(value) {
      const num = Math.round(value * 10) / 10;
      const gradientValueMap = {
        '0': '#32cd32', '0.1': '#2fc744', '0.2': '#2bc057', '0.3': '#28ba69',
        '0.4': '#24b47b', '0.5': '#21ad8e', '0.6': '#1ea7a0', '0.7': '#1aa1b2',
        '0.8': '#179bc4', '0.9': '#1394d7', '1': '#108ee9',
      };
      return gradientValueMap[num];
    }
  }
}
</script>

<style scoped>
.custom-picker {
  border: unset;
  max-width: fit-content;
}

.device-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  overflow: hidden;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.device-icon {
  width: 100%;
  height: 100%;
}

@media (max-width: 480px) {
  .device-image {
    width: 100rpx;
    height: 100rpx;
  }
}

/* 基础容器 */
.container {
  padding: 20rpx;
  background: #Eff4fb;
}

.card {
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 2px;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-header {
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: fit-content;
}

.chart-container {
  margin-top: 10rpx;
  position: relative;
  height: 450rpx;
}

.date-picker {
  font-size: 14px;
  color: #666;
}

.main-chart {
  width: 100%;
  height: 100%;
}

.chart-loaded {
  width: 100%;
  height: 450rpx;
  animation: fadeIn 0.5s ease-out;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #4488FB;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: #999;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* 设备统计 */
.device-stats {
  padding: 12px 16px;
}

.device-grid {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  gap: 8px;
}

.device-item {
  flex: 1;
  text-align: center;
  padding: 10px 8px;
  background: #F8FAFF;
  border-radius: 6px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.device-item:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.number {
  font-size: 18px;
  font-weight: 600;
  color: #4488FB;
  margin-bottom: 4px;
  display: block;
}

.text {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
  display: block;
}

/* 列表头部 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.access-setting-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #1890FF;
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

.setting-icon {
  font-size: 14px;
}

.setting-text {
  font-size: 14px;
}

/* 核心：设备卡片一行两个 */
.device-list {
  padding: 0;
}

.device-card-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  gap: 10rpx;
  /* 卡片间距 */
}

.device-card {
  width: calc(50% - 10rpx);
  /* 严格一行两个 */
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

.device-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.device-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0;
  position: relative;
  overflow: hidden;
}

.device-image::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: #e9ecef;
  border-radius: 0 0 12px 12px;
}

.device-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
  z-index: 1;
  position: relative;
}

.device-info {
  width: 100%;
  margin-top: 12px;
}

.device-data {
  width: 100%;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.data-label {
  font-size: 12px;
  color: #666;
}

.data-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* 响应式 */
@media (max-width: 480px) {
  .device-card {
    width: calc(50% - 10rpx);
  }

  .device-image {
    width: 80px;
    height: 80px;
  }

  .device-icon {
    width: 50px;
    height: 50px;
  }
}

::v-deep .uni-date-btn--ok {
  padding: 10rpx 15px
}

::v-deep .uni-calendar--fixed {
  margin-bottom: 50px
}
</style>