<template>
  <view class="container">
    <!-- 状态区域 -->
    <view class="status-container">
      <view class="status-content">
        <view class="status-indicator">
          <image class="battery-icon" src="/static/images/img-storage.png" />
          <view class="soc-container">
            <!-- <view class="soc-progress-container"> -->
            <view class="soc-progress" style="display: flex; align-items: center; gap: 16rpx;">
              <image src="/static/images/storage.svg" style="width: 40rpx; height: 40rpx;" />
              <view class="progress-track" style="flex: 1;">
                <view class="progress-fill" :style="{
                  width: `${device171F && device171F.energyData && device171F.energyData.B128 ? parseFloat(device171F.energyData.B128.value) : 0}%`,
                  background: statusGradient,
                }">
                  <text class="progress-text">{{ device171F && device171F.energyData && device171F.energyData.B128 ?
                    device171F.energyData.B128.value : '--' }}%</text>
                </view>
              </view>
              <text :style="{ fontSize: '24rpx', color: statusGradient }">{{ totalStorageData.status }}</text>
            </view>
            <view class="soc-remaining" style="display: flex; justify-content: space-between; align-items: center;">
              <text>剩余电量预计可用</text>
              <text style="font-weight: bold;">{{ device171F && device171F.energyData && device171F.energyData.B130 ?
                device171F.energyData.B130.value : '--' }} 小时</text>
            </view>
            <!-- </view> -->
          </view>
        </view>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="stats-container">
      <view class="stat-row">
        <view class="stat-item vertical">
          <view class="stat-subitem">
            <text class="stat-label">{{ statList[0].label }}</text>
            <view>
              <text class="stat-value">{{ statList[0].value !== undefined ? statList[0].value : "--" }}</text>
              <text class="stat-unit">{{ statList[0].unit }}</text>
            </view>
          </view>
          <view class="stat-subitem">
            <text class="stat-label">出现在</text>
            <text class="stat-value small">{{ statList[0].time || "--" }}</text>
          </view>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item vertical">
          <view class="stat-subitem">
            <text class="stat-label">{{ statList[1].label }}</text>
            <view>
              <text class="stat-value">{{ statList[1].value !== undefined ? statList[1].value : "--" }}</text>
              <text class="stat-unit">{{ statList[1].unit }}</text>
            </view>
          </view>
          <view class="stat-subitem">
            <text class="stat-label">出现在</text>
            <text class="stat-value small">{{ statList[1].time || "--" }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 图表区域 -->
    <view class="charts-content">
      <view class="chart-container">
        <!-- 功率曲线 -->
        <view class="power-chart card">
          <view class="chart-header">
            <text class="chart-title">充放电功率曲线</text>
            <dy-date timeType="day" @getData="onPowerDateChange" v-model="powerDate" class="compact-date-picker" />
          </view>
          <view class="chart-view">
            <qiun-data-charts type="line" :chartData="storageChartData" :opts="storagePowerOptions"
              canvasId="CamoFLVBqPYEJXtAEDIxdbLdHpZAvPitPOEWER" :ontouch="false" :canvas2d="canvas2d" />
          </view>
        </view>

        <!-- 量/达成率曲线 -->
        <view class="capacity-chart card">
          <view class="chart-header">
            <text class="chart-title">充放电量统计</text>
          </view>
          <view class="chart-tab-bar">
            <view class="chart-tabs">
              <view v-for="(tab, i) in ['日', '月', '年']" :key="i"
                :class="['chart-tab-item', { active: activeChartTab === tab }]" @click="handleDateTypeChange(tab)">
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

          <view class="chart-view">
            <qiun-data-charts type="column" :chartData="storageQData" :opts="storageQOptions" :canvasId="chartId + '-q'"
              :ontouch="false" :canvas2d="canvas2d" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { getSocketinstance } from "@/service/websocket";
import { realtimeDataProvider } from '@/service/websocket';
// import upgrade from "@/api/upgrade_new";
// import nyz_new from "@/api/nyz_new";
import dyDate from "@/components/dy-Date/dy-Date.vue";
// import nyz from "@/api/nyz";
// import energy_new from "@/api/energy_new";
// import { mapGetters } from "vuex";
import { queryHighestChargeAndPower, getPowerData, queryDayElectricityStatistic, queryMonthElectricityStatistic, queryYearElectricityStatistic } from "../../api/power";

export default {
  components: { dyDate },
  name: "Storage-Management",
  inject: ['get171FDeviceList'],
  data() {
    return {
      canvas2d: this.$Config?.ISCANVAS2D ?? false,

      chartId: 'storage-' + Math.random().toString(36).substr(2, 9),
      showChart: false,
      activeChartTab: "日",
      timeTypeIndex: 0,
      current: "Storage-Management",
      powerDate: new Date().toISOString().split("T")[0],
      deviceList: [],
      nyzRealTimeData: {
        status: "--",
        storagePower1: 0,
        storagePower2: 0,
        soc: 0,
        charge1: 0,
        charge2: 0,
        discharge1: 0,
        discharge2: 0,
      },
      storagePowerOptions: {
        dataLabel: false,
        padding: [15, 20, 0, 15],
        dataPointShape: false,
        enableScroll: false,
        legend: {},
        xAxis: { labelCount: 8, disableGrid: true },
        yAxis: { gridType: "dash",
        showTitle: true,
        data: [{ position: "left", title: "单位:kWh" }],
         dashLength: 2 },
        extra: { line: { type: "straight", width: 1 } },
        animation: false,
      },
      storageChartData: {},
      storageQOptions: {
        dataLabel: false,
        animation: false,
        xAxis: { labelCount: 8, disableGrid: true },
        yAxis: { gridType: "dash",
        showTitle: true,
       data: [{ position: "left", title: "单位:kWh" }],
         dashLength: 2 },
      },
      storageQData: {
        categories: [...Array(24).keys()].map(h => `${h + 1}时`),
        series: [{ name: "充电量", data: Array(24).fill(0) }, { name: "放电量", data: Array(24).fill(0) }],
      },
      selectedDate: new Date().toISOString().split("T")[0],
      timeTypeMap: { 日: "day", 月: "month", 年: "year" },
      updateTimer: null,
    };
  },
  computed: {
    // storageammeterDeviceids() {
    //   return this.currentSystem?.storageammeterDeviceids || [];
    // },
    device171F() {
      // console.log(this.deviceList, this.deviceList.find(item => item && item.deviceType === '171F'), "171F");
      this.deviceList = realtimeDataProvider.getDeviceList()
      return this.deviceList.find(item => item && item.deviceType === '171F');
    },
    totalStorageData() {
      const storagePower = parseFloat(this.getFieldValue('B60')) || 0;
      let status = '不充不放';
      if (storagePower > 0) {
        status = '充电中';
      } else if (storagePower < 0) {
        status = '放电中';
      }
      return { power: storagePower.toFixed(2), status, soc: 0, ratio: 0 };
    },
    remainingTime() { return 23; },
    statusGradient() {
      // if (this.totalStorageData.status === "充电中") return "#2ecc71";
      // if (this.totalStorageData.status === "放电中") return "#f39c12";
      // return "#95a5a6";
      return "#00c934";
    },
    statList() {
      return [
        { label: "日最高充电量", value: this.getFieldValue('B134'), unit: "kWh", time: this.formatChargeDate() },
        { label: "日最高放电量", value: this.getFieldValue('B144'), unit: "kWh", time: this.formatDischargeDate() },
      ];
    },
  },
  mounted() {
    // 先加载数据，不渲染图表
    // this.findEnergyStorageInfo();
    // this.getNyzRealTimeData();
    this.handleDatePicker(this.selectedDate);
    // this.init170FDevice();
    this.init171FDevice();

    // 页面稳定后再画图表
    setTimeout(() => {
      this.showChart = true;
      this.getPowerCurve();
    }, 300);
  },
  beforeDestroy() {
    this.showChart = false;
    if (this.updateTimer) clearTimeout(this.updateTimer);
  },
  methods: {

    init171FDevice() {
      this.deviceList = this.get171FDeviceList();
    },
    getFieldValue(key) {
      // console.log(this.device171F, this.device171F.energyData, key, "----121---------------");
      if (!this.device171F || !this.device171F.energyData || this.device171F.energyData[key] === undefined) {

        return "--";
      }
      return this.device171F.energyData[key].value;
    },
    formatChargeDate() {
      if (!this.device171F || !this.device171F.energyData) return "--";
      const year = this.device171F.energyData.B138?.value;
      const month = this.device171F.energyData.B140?.value;
      const day = this.device171F.energyData.B142?.value;

      if (year && month && day) {
        const monthStr = String(month).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year}-${monthStr}-${dayStr}`;
      }
      return "--";
    },
    formatDischargeDate() {
      if (!this.device171F || !this.device171F.energyData) return "--";
      const year = this.device171F.energyData.B148?.value;
      const month = this.device171F.energyData.B150?.value;
      const day = this.device171F.energyData.B152?.value;

      if (year && month && day) {
        const monthStr = String(month).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year}-${monthStr}-${dayStr}`;
      }
      return "--";
    },
    formatHistoryChargePowerTime() {
      return "--";
    },
    formatHistoryDischargePowerTime() {
      return "--";
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
      const typeMap = { 0: '日', 1: '月', 2: '年' };
      const type = typeMap[this.timeTypeIndex];
      if (type === "日") this.findDayStorageQAndPower();
      if (type === "月") this.findMonthStorageQAndPower();
      if (type === "年") this.findYearStorageQAndPower();
    },

    enumStorageStatus(s) {
      return [, "充电", "放电", "静置"][s] || "--";
    },
    findDayStorageQAndPower() {
      const currentDevice = this.$store.state.currentSelectDevice || {};
      const esId = currentDevice.esId || currentDevice.id;
      const areaLevelIds = currentDevice.areaLevelId;
      
      queryDayElectricityStatistic({
        esId: esId,
        date: this.selectedDate,
        areaLevelIds: areaLevelIds
      }).then((res) => {
        const dataList = res.data || [];
        
        const sortedData = dataList.sort((a, b) => (a.hour || 0) - (b.hour || 0));
        
        this.storageQData = {
          categories: sortedData.map(item => `${(item.hour || 0) + 1}时`),
          series: [
            { name: "充电量", data: sortedData.map(item => parseFloat(item.storageCharge) || 0) },
            { name: "放电量", data: sortedData.map(item => parseFloat(item.storageDischarge) || 0) }
          ],
        };
      });
    },
    findMonthStorageQAndPower() {
      const date = new Date(this.selectedDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const days = new Date(year, month, 0).getDate();
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDate = `${year}-${String(month).padStart(2, "0")}-${days}`;

      const currentDevice = this.$store.state.currentSelectDevice || {};
      const esId = currentDevice.esId || currentDevice.id;
      const areaLevelIds = currentDevice.areaLevelId;
      
      queryMonthElectricityStatistic({
        esId: esId,
        startDate,
        endDate,
        areaLevelIds: areaLevelIds
      }).then((res) => {
        const c = [], d = [];

        if (res.data) {
          // 假设接口返回日数据数组
          const dailyData = res.data;
          for (let i = 1; i <= days; i++) {
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
            const item = dailyData.find((it) => it.date === dateStr);
            c.push(item?.storageCharge || 0);
            d.push(item?.storageDischarge || 0);
          }
        } else {
          // 无数据时生成空数据
          for (let i = 1; i <= days; i++) {
            c.push(0);
            d.push(0);
          }
        }

        this.storageQData = {
          categories: [...Array(days).keys()].map(i => `${i + 1}日`),
          series: [{ name: "充电量", data: c }, { name: "放电量", data: d }]
        };
      });
    },
    findYearStorageQAndPower() {
      const year = new Date(this.selectedDate).getFullYear();

      const currentDevice = this.$store.state.currentSelectDevice || {};
      const esId = currentDevice.esId || currentDevice.id ;
      const areaLevelIds = currentDevice.areaLevelId ;
      
      queryYearElectricityStatistic({
        esId: esId,
        year,
        areaLevelIds: areaLevelIds
      }).then((res) => {

        console.log(res, "-----------121--------");
        const c = [], d = [];

        if (res.data) {
          // 假设接口返回月数据数组
          const monthlyData = res.data;
          for (let i = 1; i <= 12; i++) {
            const item = monthlyData.find((it) => it.month === i);
            c.push(item?.storageCharge || 0);
            d.push(item?.storageDischarge || 0);
          }
        } else {
          // 无数据时生成空数据
          for (let i = 1; i <= 12; i++) {
            c.push(0);
            d.push(0);
          }
        }

        this.storageQData = {
          categories: [...Array(12).keys()].map(i => `${i + 1}月`),
          series: [{ name: "充电量", data: c }, { name: "放电量", data: d }]
        };
      });
    },
    onPowerDateChange(value) {
      // 更新选中的日期
      this.powerDate = value;
      if (this.updateTimer) clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        this.getPowerCurve();
      }, 200);
    },

    getPowerCurve() {
      const currentDevice = this.$store.state.currentSelectDevice || {};

      const params = {
        esId: currentDevice.id || 28,
        date: this.selectedDate,
        areaLevelIds: currentDevice.areaLevelId || 991
      };
      getPowerData(params).then((res) => {
        const categories = [], charge = [], discharge = [];

        if (res.data && res.data.length > 0) {
          const dataList = res.data;

          // 按小时聚合数据（0-23小时，每小时取一个点）
          for (let h = 0; h < 24; h++) {
            categories.push(`${h + 1}时`);

            // 找到该小时范围内的数据
            const hourData = dataList.filter(item => {
              const dateTime = item.dateTime || '';
              const hour = parseInt(dateTime.substring(11, 13)) || 0;
              return hour === h;
            });

            if (hourData.length > 0) {
              // 计算平均值
              const avgValue = hourData.reduce((sum, item) => sum + (parseFloat(item.storagePowerReverse || 0)), 0) / hourData.length;
              charge.push(avgValue >= 0 ? parseFloat(avgValue.toFixed(2)) : 0);
              discharge.push(avgValue < 0 ? parseFloat((-avgValue).toFixed(2)) : 0);
            } else {
              charge.push(0);
              discharge.push(0);
            }
          }
        } else {
          // 无数据时生成空数据
          for (let h = 0; h < 24; h++) {
            categories.push(`${h + 1}时`);
            charge.push(0);
            discharge.push(0);
          }
        }

        this.storageChartData = { categories, series: [{ name: "充电功率", data: charge }, { name: "放电功率", data: discharge }] };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background: #f5f7fa;
}

.chart-container {
  margin-bottom: 10rpx;
}

.status-container {
  padding: 20rpx;
  background: #fff;
}

.status-content {
  display: flex;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 16rpx;
  width: 100%;
}

.battery-icon {
  width: 150rpx;
  height: 120rpx;
  margin-right: 16rpx;
}

.soc-container {
  flex: 1;

}

.progress-track {
  height: 28rpx;
  background: #f3f4f6;
}

.progress-fill {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 12rpx;
  color: #fff;
  font-size: 24rpx;
  font-weight: bold;
}

.soc-remaining {
  margin-top: 16rpx;
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
}

/* 统计数据 */
.stats-container {
  margin: 10rpx 0;
}

.stat-row {
  display: flex;
  margin-bottom: 1rpx;
  background: #fff;
  padding: 16rpx 20rpx;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
}

.stat-item.vertical {
  flex-direction: column;
  align-items: flex-start;
}

.stat-divider {
  width: 1rpx;
  height: 80rpx;
  background-color: #e8e8e8;
  margin: 0 16rpx;
  align-self: center;
}

.stat-subitem {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8rpx;
}

.stat-subitem:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-size: 12px;
  color: #000;
  margin-right: 8rpx;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #4488FB;
}

.stat-value.small {
  font-size: 10px;
  font-weight: normal;
}

.stat-unit {
  font-size: 8px;
  color: #666;
  margin-left: 4rpx;
}

/* 图表 */
.charts-content {
  margin-top: 10rpx;
}

.chart-header {
  padding: 12rpx 20rpx;
  border-bottom: 1rpx solid #f0f4ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-size: 32rpx;
  font-weight: 600;
}

.chart-tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16rpx 20rpx;
  margin: 12rpx 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 100;
}

.chart-tabs {
  display: flex;
}

.chart-tab-item {
  padding: 6rpx 30rpx;
  border: 1rpx solid #e8e8e8;
  font-size: 15px;
  color: #666;
  background: #f8f9fa;
  cursor: pointer;
}

.chart-tab-item.active {
  background: #4488FB;
  color: #fff;
  border-color: #4488FB;
}

.chart-view {
  width: 100%;
  height: 400rpx;
}

.card {
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 10rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}
</style>