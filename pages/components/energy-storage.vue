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
                    width: `${totalStorageData.soc}%`,
                    background: statusGradient,
                  }">
                    <text class="progress-text">{{ totalStorageData.soc }}%</text>
                  </view>
                </view>
                <text :style="{ fontSize: '24rpx', color: statusGradient }">{{ totalStorageData.status }}</text>
              </view>
              <view class="soc-remaining" style="display: flex; justify-content: space-between; align-items: center;">
                <text>剩余电量预计可用</text>
                <text style="font-weight: bold;">{{ remainingTime }} 小时</text>
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
              <text class="stat-value">{{ statList[0].value || "--" }}</text>
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
              <text class="stat-value">{{ statList[1].value || "--" }}</text>
              <text class="stat-unit">{{ statList[1].unit }}</text>
            </view>
          </view>
          <view class="stat-subitem">
            <text class="stat-label">出现在</text>
            <text class="stat-value small">{{ statList[1].time || "--" }}</text>
          </view>
        </view>
      </view>
      <view class="stat-row">
        <view class="stat-item vertical">
          <view class="stat-subitem">
            <text class="stat-label">{{ statList[2].label }}</text>
            <view>
              <text class="stat-value">{{ statList[2].value || "--" }}</text>
              <text class="stat-unit">{{ statList[2].unit }}</text>
            </view>
          </view>
          <view class="stat-subitem">
            <text class="stat-label">出现在</text>
            <text class="stat-value small">{{ statList[2].time || "--" }}</text>
          </view>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item vertical">
          <view class="stat-subitem">
            <text class="stat-label">{{ statList[3].label }}</text>
            <view>
              <text class="stat-value">{{ statList[3].value || "--" }}</text>
              <text class="stat-unit">{{ statList[3].unit }}</text>
            </view>
          </view>
          <view class="stat-subitem">
            <text class="stat-label">出现在</text>
            <text class="stat-value small">{{ statList[3].time || "--" }}</text>
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
          <qiun-data-charts
            v-if="showChart"
            type="line"
            :chartData="storageChartData"
            :opts="storagePowerOptions"
            canvasId="electricity"
            class="chart-view"
            :ontouch="false"
            :canvas2d="false"
          />
        </view>

        <!-- 量/达成率曲线 -->
        <view class="capacity-chart card">
          <view class="chart-header">
            <text class="chart-title">充放电量/放电达成率</text>
          </view>
          <view class="chart-tab-bar">
            <view class="chart-tabs">
              <view
                v-for="(tab, i) in ['日', '月', '年']"
                :key="i"
                :class="['chart-tab-item', { active: activeChartTab === tab }]"
                @click="handleDateTypeChange(tab)"
              >
                {{ tab }}
              </view>
            </view>
            <dy-date v-if="activeChartTab === '日'" timeType="day" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
            <dy-date v-else-if="activeChartTab === '月'" timeType="month" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
            <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
          </view>

          <qiun-data-charts
            v-if="showChart"
            type="column"
            :chartData="storageQData"
            :opts="storageQOptions"
            canvasId="storageQ-chart"
            class="chart-view"
            :ontouch="false"
            :canvas2d="false"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getSocketinstance } from "@/service/websocket";
import upgrade from "@/api/upgrade_new";
import nyz_new from "@/api/nyz_new";
import dyDate from "@/components/dy-Date/dy-Date.vue";
import nyz from "@/api/nyz";
import energy_new from "@/api/energy_new";
import { mapGetters } from "vuex";

export default {
  components: { dyDate },
  name: "Storage-Management",
  data() {
    return {
      showChart: false,
      activeChartTab: "日",
      current: "Storage-Management",
      dayMaxChargeQ: "",
      dayMaxChargeQTime: "",
      hisMaxChargePower: "",
      hisMaxChargePowerTime: "",
      dayMaxDischargeQ: "",
      dayMaxDischargeQTime: "",
      hisMaxDischargePower: "",
      hisMaxDischargePowerTime: "",
      storageStatus: "--",
      percent: 80,
      powerDate: new Date().toISOString().split("T")[0],
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
        yAxis: { gridType: "dash", dashLength: 2 },
        extra: { line: { type: "straight", width: 1 } },
        animation: false,
      },
      storageChartData: {},
      storageQOptions: {
        dataLabel: false,
        animation: false,
        xAxis: { labelCount: 8, disableGrid: true },
        yAxis: { gridType: "dash", dashLength: 2 },
      },
      storageQData: {},
      selectedDate: new Date().toISOString().split("T")[0],
      timeTypeMap: { 日: "day", 月: "month", 年: "year" },
      updateTimer: null,
    };
  },
  computed: {
    ...mapGetters(["currentSystem"]),
    storageammeterDeviceids() {
      return this.currentSystem?.storageammeterDeviceids || [];
    },
    totalStorageData() {
      let totalPower =
        parseFloat(this.nyzRealTimeData.storagePower1 || 0) +
        parseFloat(this.nyzRealTimeData.storagePower2 || 0);
      let status = totalPower > 0 ? "充电中" : totalPower < 0 ? "放电中" : "不充不放";
      let soc = parseFloat(this.nyzRealTimeData.soc) || 0;
      return { power: totalPower.toFixed(2), status, soc, ratio: 0 };
    },
    remainingTime() { return 23; },
    statusGradient() {
      if (this.totalStorageData.status === "充电中") return "#2ecc71";
      if (this.totalStorageData.status === "放电中") return "#f39c12";
      return "#95a5a6";
    },
    statList() {
      return [
        { label: "日最高发电量", value: this.dayMaxChargeQ, unit: "kWh", time: this.dayMaxChargeQTime },
        { label: "历史最高充电功率", value: this.hisMaxChargePower, unit: "kW", time: this.hisMaxChargePowerTime },
        { label: "日最高放电量", value: this.dayMaxDischargeQ, unit: "kW", time: this.dayMaxDischargeQTime },
        { label: "历史最高放电功率", value: this.hisMaxDischargePower, unit: "kW", time: this.hisMaxDischargePowerTime },
      ];
    },
  },
  mounted() {
    // 先加载数据，不渲染图表
    this.findEnergyStorageInfo();
    this.getHighestChargeAndPower();
    this.getNyzRealTimeData();
    this.handleDatePicker(this.selectedDate);

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
    handleDateTypeChange(e) {
      this.activeChartTab = e;
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      if (e === "日") this.selectedDate = now.toISOString().split("T")[0];
      if (e === "月") this.selectedDate = `${y}-${m}`;
      if (e === "年") this.selectedDate = `${y}`;
      
      if (this.updateTimer) clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        this.handleDatePicker(this.selectedDate);
      }, 200);
    },
    handleDatePicker(value) {
      if (this.activeChartTab === "日") this.findDayStorageQAndPower();
      if (this.activeChartTab === "月") this.findMonthStorageQAndPower();
      if (this.activeChartTab === "年") this.findYearStorageQAndPower();
    },
    
    getNyzRealTimeData() {
      const socket = getSocketinstance();
      socket.socket.emit("register");
      
      let lastUpdateTime = 0;
      socket.socket.on("nyzData", (json) => {
        const now = Date.now();
        if (now - lastUpdateTime < 500) return;
        lastUpdateTime = now;
        
        const { deviceType, dataType, address, data } = json;
        if (deviceType == "1804_V2_2" && dataType == "2" && address == "18") {
          this.nyzRealTimeData.storagePower1 = parseFloat(data.B8).toFixed(2);
          this.nyzRealTimeData.charge1 = parseFloat(data.B12).toFixed(2);
          this.nyzRealTimeData.discharge1 = parseFloat(data.B16).toFixed(2);
        }
        if (deviceType == "1804_V2_2" && dataType == "2" && address == "19") {
          this.nyzRealTimeData.storagePower2 = parseFloat(data.B8).toFixed(2);
          this.nyzRealTimeData.charge2 = parseFloat(data.B12).toFixed(2);
          this.nyzRealTimeData.discharge2 = parseFloat(data.B16).toFixed(2);
        }
        if (deviceType == "1704_V1_2" && dataType == "2" && address == "02") {
          this.nyzRealTimeData.soc = parseFloat(data.B4).toFixed(2);
        }
      });
    },
    enumStorageStatus(s) {
      return [,"充电","放电","静置"][s] || "--";
    },
    findEnergyStorageInfo() {
      upgrade.findEnergyStorageInfo({}).then((res) => {
        if (!res.data) return;
        this.dayMaxChargeQ = res.data.dayMaxChargeQ;
        this.dayMaxChargeQTime = res.data.dayMaxChargeQDatetime;
        this.dayMaxDischargeQ = res.data.dayMaxDischargeQ;
        this.dayMaxDischargeQTime = res.data.dayMaxDischargeQDatetime;
        this.hisMaxChargePower = res.data.maxChargePower;
        this.hisMaxChargePowerTime = res.data.maxChargePowerDatetime;
        this.hisMaxDischargePower = res.data.maxDischargePower;
        this.hisMaxDischargePowerTime = res.data.maxDischargePowerDatetime;
      });
    },
    findDayStorageQAndPower() {
      energy_new.findEveryHourByDeviceIds({
        deviceIds: this.storageammeterDeviceids,
        day: this.selectedDate,
      }).then((res) => {
        const c = [], d = [];
        res.data?.forEach((it) => {
          c.push(it.total_storage_forward_q || 0);
          d.push(it.total_storage_reverse_q || 0);
        });
        this.storageQData = {
          categories: [...Array(24).keys()],
          series: [{ name: "充电量", data: c }, { name: "放电量", data: d }],
        };
      });
    },
    findMonthStorageQAndPower() {
      const date = new Date(this.selectedDate);
      const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      energy_new.findEveryDayByDeviceIds({
        deviceIds: this.storageammeterDeviceids,
        month: String(date.getMonth() + 1).padStart(2, "0"),
        year: date.getFullYear(),
      }).then((res) => {
        const c = [], d = [];
        for (let i = 1; i <= days; i++) {
          const item = res.data?.find((it) => it.date === `${this.selectedDate}-${String(i).padStart(2, "0")}`);
          c.push(item?.total_storage_forward_q || 0);
          d.push(item?.total_storage_reverse_q || 0);
        }
        this.storageQData = { categories: [...Array(days).keys()].map(i => i+1), series: [{ name: "充电量", data: c }, { name: "放电量", data: d }] };
      });
    },
    findYearStorageQAndPower() {
      energy_new.findEveryMonthByDeviceIds({
        deviceIds: this.storageammeterDeviceids,
        year: this.selectedDate,
      }).then((res) => {
        const c = [], d = [];
        for (let i = 1; i <= 12; i++) {
          const item = res.data?.find((it) => it.month == i);
          c.push(item?.total_storage_forward_q || 0);
          d.push(item?.total_storage_reverse_q || 0);
        }
        this.storageQData = { categories: [...Array(12).keys()].map(i => i+1), series: [{ name: "充电量", data: c }, { name: "放电量", data: d }] };
      });
    },
    getHighestChargeAndPower() {
      nyz_new.queryHighestChargeAndPower({
        deviceIdList: [352, 354],
        date: new Date().toISOString().split("T")[0],
      }).then((res) => {
        if (!res.data) return;
        this.dayMaxChargeQ = res.data.dailyMaxCharge;
        this.dayMaxChargeQTime = res.data.dailyMaxChargeTime;
        this.hisMaxChargePower = res.data.maxPower;
        this.hisMaxChargePowerTime = res.data.timeOfMaxPower;
        this.dayMaxDischargeQ = res.data.dailyMaxDisCharge;
        this.dayMaxDischargeQTime = res.data.dailyMaxDisChargeTime;
        this.hisMaxDischargePower = -res.data.mimPower;
        this.hisMaxDischargePowerTime = res.data.timeOfMinPower;
      });
    },
    onPowerDateChange() {
      if (this.updateTimer) clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        this.getPowerCurve();
      }, 200);
    },
    
    getPowerCurve() {
      nyz_new.queryStoragePowerCurve({
        deviceIdList: this.storageammeterDeviceids,
        date: this.powerDate,
      }).then((res) => {
        const categories = [], charge = [], discharge = [];
        
        // 每小时一个点，性能拉满
        for (let h = 0; h < 24; h++) {
          const time = `${String(h).padStart(2, "0")}:00`;
          categories.push(time);
          const val = res.data?.[`${this.powerDate} ${time}:00`] || 0;
          charge.push(val >= 0 ? val.toFixed(2) : 0);
          discharge.push(val < 0 ? -val.toFixed(2) : 0);
        }
        
        this.storageChartData = { categories, series: [{ name: "充电功率", data: charge }, { name: "放电功率", data: discharge }] };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 10rpx;
  background: #f5f7fa;
}
.chart-container {
  margin-bottom: 10rpx;
}
.status-container {
  padding: 20rpx;
  background: #f8f9fa;
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
  margin-bottom: 10rpx;
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
  color: #666;
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