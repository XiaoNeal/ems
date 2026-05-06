<template>
  <view class="container">

    <!-- 设备统计区块 -->
    <view class="card device-stats">
      <view class="section-header">
        <text class="title">设备信息</text>
      </view>
      <view class="device-grid">
        <view class="device-item">
          <text class="number">{{ nyzData.dljQuantity || 1 }}</text>
          <text class="text">多联机</text>
        </view>
        <view class="device-item">
          <text class="number">{{ nyzData.mkjQuantity || 2 }}</text>
          <text class="text">模块机</text>
        </view>
        <view class="device-item">
          <text class="number">{{ nyzData.nyzQuantity || 3 }}</text>
          <text class="text">能源站</text>
        </view>
        <view class="device-item">
          <text class="number">{{ nyzData.unknownDeviceQuantity || 4 }}</text>
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
        <qiun-data-charts type="line" :chartData="loadChartData" :opts="loadChartOptions" canvasId="load-chart"
          class="main-chart" :ontouch="true" :canvas2d="canvas2d" />
      </view>
    </view>

    <!-- 设备列表 -->
    <view class="card device-list">
      <view class="list-header">
        <text class="list-title">负荷列表</text>
        <view class="access-setting-btn" @click="goToAccessSetting">
          <text class="setting-icon">⚙️</text>
          <text class="setting-text">接入设置</text>
        </view>
      </view>

      <!-- 卡片网格容器 -->
      <view class="device-card-grid">
        <view v-for="(item, index) in deviceList" :key="index" @click="onDeviceClick(item)" class="device-card">
          <view class="device-name">{{ item.deviceName }}</view>
          <!-- 设备图标 -->
          <view class="device-image">
            <img class="device-icon" v-if="item.type == '0305'" src="../../community/static/images/VRV.png" />
            <img class="device-icon" v-if="item.type == 2" src="../../community/static/images/load-airconditioner.png" />
            <img class="device-icon" v-if="item.type == 3" src="../../community/static/images/load-chargingPile.png" />
          </view>
          <!-- 设备信息 -->
          <view class="device-info">
            <view class="device-data">
              <view class="data-item">
                <text class="data-label">功率</text>
                <text class="data-value">{{ item.power }} W</text>
              </view>
              <view class="data-item">
                <text class="data-label">用电量</text>
                <text class="data-value">{{ item.energyConsumption }} kWh</text>
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
import energy from '@/api/energy_new'
import { queryDayGeneratedPower } from '@/api/power'
import dyDate from '@/components/dy-Date/dy-Date.vue';
const commonArcbarOptions = {
  padding: [15,15,0,15],
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
export default {
  components: { dyDate },
  name: 'load-management',
  data() {
    return {
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
        '多联机': 0,
        '未知设备': 0,
        '模块机': 0,
        '能源站': 0
      },
      nyzData: {
        dljQuantity: "2",
        cdzQuantity: "1",
        mkjQuantity: "--",
        lightQuantity: "0",
        unknownDeviceQuantity: "--",
        nyzFlexibility: "--",
        totalLoadrate: "--",
        totalEnergyEfficiencyLevel: "--"
      },
      curveLoading: false,
      loadOptions: {},
      softValueOptions: {},
      loadRateOptions: {},
      efficiencyOptions: {},
      loadChartOptions: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 10, 0, 15],
        dataLabel: false,
        dataPointShape: false,
        enableScroll: false,
        legend: {},
        xAxis: { labelCount: 7, disableGrid: true },
        yAxis: { gridType: "dash", dashLength: 2, showTitle: true, data: [{ title: "W" }] },
        extra: { line: { type: "curve", width: 2, activeType: "hollow", linearType: "custom" } }
      },
      loadChartData: {
        categories: [],
        series: [{ name: '空调总负荷功率', data: [] }]
      },
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
      selectedDate: new Date().toISOString().split('T')[0],
    };
  },
  mounted() {
    this.datetimerange = ["2021-07-08 0:01:10", "2021-08-08 23:59:59"]
    this.getDeviceCount();
    this.getDeviceInfo();
    this.getNyzRealTimeData();
    this.findFlexibilityLoadPowerTotal();
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
    getNyzRealTimeData() {
      getSocketinstance().socket.emit("register")
      getSocketinstance().socket.on("nyzData", (jsonData) => {
        const { deviceType, address, dataType, data } = jsonData
        if (deviceType === "1712_V2" && address == "64" && dataType == "2") {
          this.nyzData.dljQuantity = parseFloat(data.B4)
          this.nyzData.mkjQuantity = parseFloat(data.B10)
          this.nyzData.unknownDeviceQuantity = parseFloat(data.B12)
          this.nyzData.nyzFlexibility = parseFloat(data.B14)
          this.nyzData.totalLoadrate = parseFloat(data.B16)
          this.nyzData.totalEnergyEfficiencyLevel = parseFloat(data.B18)
        }
      })
    },
    async findFlexibilityLoadPowerTotal() {
      const esId = this.$store.state.powerStationsId || 8;
      const areaLevelIds = this.$store.state.areaInfoId || 940;
      const result = await queryDayGeneratedPower({
        esId: esId,
        date: this.selectedDate,
        areaLevelIds: areaLevelIds
      });
      if (result && result.data) {
        const data = result.data;
        if (data.list && data.list.length > 0) {
          this.loadChartData.categories = data.list.map(item => {
            const time = item.time || item.datetime || '';
            return time.substring(11, 16) || time;
          });
          this.loadChartData.series[0].data = data.list.map(item => {
            return Number(item.value || item.power || 0);
          });
        } else {
          this.loadChartData.categories = [];
          this.loadChartData.series[0].data = [];
        }
      }
    },
    async getDeviceCount() {
      try {
        const result = await energy.findAllDeviceInfo();
        if (result.data) this.deviceCount = result.data.deviceInfoMap;
      } catch (err) { console.error(err); }
    },
    getDeviceStatus(idx) {
      const map = { '0': '离线', '1': '等待注册', '2': '等待配置', '3': '运行', '4': '在线' };
      return map[idx]
    },
    async getDeviceInfo() {
      try {
        const result = await energy.queryFlexibility({ 
          barCode: "F2 00 12 00 00 00 00 00 00 00 00 00 00 00 00", 
          typeCode: "1712_V2" 
        });
        if (result.data) {
          const filterData = result.data.filter(item => item.deviceType != '0000')
          this.deviceList = filterData.map((item, index) => {
            item.deviceName = this.getDeviceName(item.deviceType)
            item.deviceStatusName = this.getDeviceStatus(item.networkStatus)
            item.deviceStatus = item.networkStatus
            item.type = item.deviceType
            item.power = Math.round(1000 + Math.random() * 4000)
            item.energyConsumption = (5 + Math.random() * 15).toFixed(2)
            return item
          });
          const generateDevice = (id, flexibility, loadRatio, efficiencyLevel) => ({
            deviceType: '2',
            networkStatus: 0,
            devId: `AC-${String(id).padStart(3, '0')}`,
            deviceFlexibility: flexibility,
            deviceLoadRatio: loadRatio.toFixed(2),
            deviceEnergyEfficiencyLevel: efficiencyLevel,
            power: Math.round(1000 + Math.random() * 4000),
            energyConsumption: (5 + Math.random() * 15).toFixed(2)
          });
          const newAirConditioners = [
            { ...generateDevice(1, 0.7, 0.5, 2), deviceType: '3' },
            ...Array.from({ length: 17 }, (_, i) => {
              const base = i % 3;
              return generateDevice(i + 2, 0.6 + base * 0.1, 0.4 + base * 0.1, base + 1);
            })
          ];
          const newAirConditionersProcessed = newAirConditioners.map((item, index) => {
            const newIndex = this.deviceList.length + index;
            item.deviceName = this.getDeviceName(item.deviceType);
            item.deviceStatusName = this.getDeviceStatus(item.networkStatus);
            item.deviceStatus = item.networkStatus;
            item.type = item.deviceType;
            item.projectAddress = (newIndex % 4) + 1;
            return item;
          });
          this.deviceList = [...this.deviceList, ...newAirConditionersProcessed];
          this.dljTotalDeviceCount = this.deviceList.filter(item => item.deviceType === '0305' || item.deviceType === '2').length;
        }
      } catch (err) { console.error(err); }
    },
    getDeviceName(idx) {
      const map = {
        "0": "未知设备", "1": "分体机", "0305": "多联机",
        "3": "充电桩", "4": "照明", "306": "内机"
      }
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
.custom-picker { border: unset; max-width: fit-content; }
.device-image { width: 120rpx; height: 120rpx; border-radius: 16rpx; overflow: hidden; flex-shrink: 0; transition: transform 0.2s ease; }
.device-icon { width: 100%; height: 100%; }
@media (max-width: 480px) { .device-image { width: 100rpx; height: 100rpx; } }

/* 基础容器 */
.container { padding: 10rpx; background: #f5f7fa; }
.card { background: #fff; border-radius: 12rpx; margin-bottom: 16px; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05); overflow: hidden; }
.section-header { border-bottom: 1px solid #f0f0f0; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; background-color: #f8f9fa; }
.title { font-size: 16px; font-weight: 600; color: #333; min-width: fit-content; }
.chart-container { height: 300px; padding: 20px; }
.date-picker { font-size: 14px; color: #666; }
.main-chart { width: 100%; height: 100%; }

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
.list-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
.list-title { font-size: 16px; font-weight: 600; color: #333; }
.access-setting-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: #1890FF; color: white; border-radius: 4px; font-size: 14px; }
.setting-icon { font-size: 14px; }
.setting-text { font-size: 14px; }

/* 核心：设备卡片一行两个 */
.device-list { padding: 0; }
.device-card-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  gap: 10rpx;    /* 卡片间距 */
}
.device-card {
  width: calc(50% - 10rpx); /* 严格一行两个 */
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
.device-name { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }
.device-image { width: 100px; height: 100px; border-radius: 12px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; margin: 12px 0; position: relative; overflow: hidden; }
.device-image::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 10px; background: #e9ecef; border-radius: 0 0 12px 12px; }
.device-icon { width: 60px; height: 60px; object-fit: contain; z-index: 1; position: relative; }
.device-info { width: 100%; margin-top: 12px; }
.device-data { width: 100%; }
.data-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.data-label { font-size: 12px; color: #666; }
.data-value { font-size: 14px; font-weight: 600; color: #333; }

/* 响应式 */
@media (max-width: 480px) {
  .device-card { width: calc(50% - 10rpx); }
  .device-image { width: 80px; height: 80px; }
  .device-icon { width: 50px; height: 50px; }
}

::v-deep .uni-date-btn--ok { padding: 10rpx 15px }
::v-deep .uni-calendar--fixed { margin-bottom: 50px }
</style>