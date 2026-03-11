<template>
  <view class="container">
    <!-- 主内容区 -->
    <view class="main-content">
      <view class="device-box">
        <view class="basic-info">

          <!-- 数据指标 -->
          <view class="data-grid">
            <view class="data-cell" v-for="(item, index) in storageItems" :key="index">
              <view class="vertical-layout" style="gap: 4px;">
                <text class="data-label">{{ item.label }}</text>
                <view class="horizontal-layout" style="align-items: baseline;">
                  <text class="data-value" :style="{ color: item.trendColor || '#333' }">{{ item.value }}</text>
                  <!-- <uni-icons v-if="item.trendIcon" :type="item.trendIcon" size="14"
                    :color="item.trendColor || '#67C23A'" />
                  <text v-if="item.trendValue" class="trend-text" :style="{ color: item.trendColor || '#67C23A' }">{{
                    item.trendValue }}</text> -->
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 图表区域 -->
        <view class="chart-box">
          <view class="date-picker-container" style="display: flex; flex-direction: column; gap: 8px;">
            <uni-segmented-control :current="dateTypeIndex" :values="['日', '月', '年']"
              @clickItem="handleDateTypeChange" />

            <!-- 日模式 -->
            <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate"
              class="custom-picker date-picker" />

            <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker" v-model="selectedDate"
              class="custom-picker date-picker" />

            <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate"
              class="custom-picker date-picker" />
          </view>
          <qiun-data-charts type="column" :chartData="electricityChartData" :ontouch="true"
            :opts="electricityChartOptions" :canvas2d="canvas2d" :inScrollView="true" canvasId="electricity-charts" />
        </view>
        <StorageWaterBear style="height: 60%" v-if="stationType == 4" :deviceList="deviceList"></StorageWaterBear>
        <!-- 参数展示区 -->
        <view class="param-section" v-if="stationType == 1 || stationType == 2">
          <!-- BMS参数 -->
          
              <view class=" dcdc-parameter">
                <view class="dcdc-title">BMS参数</view>
                <view class="dcdc-device">
                  <view class="device-label"></view>
                  <view class="device-label">电池簇1</view>
                  <view class="device-label">电池簇2</view>
                </view>
                <scroll-view class="dcdc-data-box" scroll-y style="height: 340px">
                  <view class="dcdc-data-item" v-for="(item, index2) in bmsRealData" :key="index2">
                    <view class="dcdc-data-name">{{ item.name }}</view>
                    <view class="dcdc-data-value">{{ item.value1 }}</view>
                    <view class="dcdc-data-value">{{ item.value2 }}</view>
                  </view>
                </scroll-view>
              </view>
           
          <!-- DCDC参数 -->
          <view class="dcdc-parameter" v-if="esVersion === 1">
            <view class="dcdc-title">DCDC参数</view>
            <uni-table :data="verticalData" style="width: 100%; height: calc(100% - 30px);">
              <uni-table-column prop="label" label="参数" width="170" fixed align="center" />
              <uni-table-column v-for="col in columns" :key="col.id" :prop="col.prop" :label="`组 ${col.id}`"
                align="center" />
            </uni-table>
          </view>

          <view class=" dcdc-parameter" v-if="esVersion === 2">
            <view class="dcdc-title">DCDC参数</view>
            <view class="dcdc-device">
              <view class="device-label"></view>
              <view class="device-label">1#储能DC</view>
              <view class="device-label">2#储能DC</view>
            </view>
            <scroll-view scroll-y="true" class="dcdc-data-box">
              <view class="dcdc-data-item" v-for="(item, index) in dcdcRealData" :key="index">
                <view class="dcdc-data-name">{{ item.name }}</view>
                <view class="dcdc-data-value">{{ item.value1 }}</view>
                <view class="dcdc-data-value">{{ item.value2 }}</view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { mapState } from 'vuex'
import { download, queryEnergyStationStorageInfo } from "@/api/devices";
import { RealtimeDataProviderService } from '@/service/socket/realtime-data-provider.js';
import { queryDayElectricityStatistic, queryMonthElectricityStatistic, queryYearElectricityStatistic } from "@/api/index";
import stationInfo from '@/assets/json/station_info.json'
import * as dateUtils from "@/utils/date"; // 新增导入
// import { ref } from 'vue';
// import DatePicker from '@/components/DatePicker.vue';
import StorageWaterBear from './StorageWaterBear.vue'; // Add this import
import dyDate from '@/components/dy-Date/dy-Date.vue'; // 导入日期选择器组件

export default {
  components: {
    StorageWaterBear, // Register the component
    dyDate, // 注册日期选择器组件
  },
  data() {

    return {
      canvas2d: this.$Config.ISCANVAS2D,
      timeTypeIndex: 0,
      electricityChartData: {},
      electricityChartOptions: {
      },
      dateRange: "",
      dateConfirm: [],
      selectedValue: null,
      options: [],
      barDate: Array.from({ length: 24 }, (_, i) => `${i}`),
      realTimeService: new RealtimeDataProviderService(),
      dcdcOneData: {},
      dcdcTwoData: {},
      dcdcOnestateDataData: {},
      dcdcTwostateDataData: {},
      bmsOneData: {},
      bmsTwoData: {},
      bmsOnestateDataData: {},
      bmsTwostateDataData: {},
      batteryStackStateData: {},
      pcsInitialData: [],
      selectedDevices: {},
      powerStationId: this.$store.state.powerStationsId,
      stationType: stationInfo[this.$store.state.powerStationsId].stationType,
      deviceList: [],
      todayCharge: 0,
      todayDisCharge: 0,
      storageData: {
        todayCharge: "--",
        todayDischarge: "--",
        totalCharge: "--",
        totalDischarge: "--",
        todayIncome: "--",
        monthIncome: "--",
        yearIncome: "--",
        totalIncome: "--"
      },
      dcdcList: [],
      dcdcEnergyList: [],
      dcdcStateList: [],
      batteryLabels: [
        '电池PN码', '电池SOC(%)', '电池状态', '最低电芯电压(mV)',
        '最高电芯电压(mV)', '电池包总电压(mV)', '电池包总电流(mA)',
        '继电器电压', '继电器状态', '温度(℃)'
      ],
      batterySwapData: [],
      dateTypeIndex: 0,  // 当前日期类型索引 0:日 1:月 2:年
      selectedDate: new Date().toISOString().split('T')[0],
    }
  },
  computed: {

    batteryData() {
      if (this.batterySwapData.length > 0 && this.batterySwapData[0]?.energyData) {
        return Array.from({ length: 8 }, (_, index) => {
          const compartmentNum = index + 1;
          return this.getBatteryCompartmentData(
            this.batterySwapData[0].energyData,
            compartmentNum
          );
        });
      }
      return Array.from({ length: 8 }, this.createDefaultBatteryData);
    },
    // 获取实时数据
    esVersion() {
      return this.$store.getters.getEsVersion
    },
    // DCDC数据
    dcdcRealData() {
      const arr1 = [...Object.values(this.dcdcOneData), ...Object.values(this.dcdcOnestateDataData)];
      const arr2 = [...Object.values(this.dcdcTwoData), ...Object.values(this.dcdcTwostateDataData)];
      const map = arr2.reduce((pre, curr) => {
        pre[curr.name] = curr.value;
        return pre;
      }, {});
      return arr1.map(item => ({
        name: item.name,
        value1: item.value,
        value2: item.name in map ? map[item.name] : "--"
      }));
    },

    // 原始数据（横向结构）
    tableData() {
      return (this.dcdcEnergyList || []).map((item, index) => ({
        id: index,
        DcDcVoltage: item?.energyData?.DcDcVoltage ?? '--',
        DcDcCurrent: item?.energyData?.DcDcCurrent ?? '--',
        systemVoltage: item?.energyData?.systemVoltage ?? '--',
        systemCurrent: item?.energyData?.systemCurrent ?? '--',
        workMode: item?.stateData.workMode ?? '--'
      }))
    },

    // 转换为竖向结构
    verticalData() {
      return [
        { label: 'DCDC模块直流高压侧电压(mV)', ...this.mapColumn('DcDcVoltage') },
        { label: 'DCDC模块直流高压侧电流(mA)', ...this.mapColumn('DcDcCurrent') },
        { label: '系统直流侧电压(mV)', ...this.mapColumn('systemVoltage') },
        { label: '系统直流侧总电流(mA)', ...this.mapColumn('systemCurrent') },
        // { label: '工作模式', ...this.mapColumn('workMode') }
      ]
    },

    // 动态生成列数据
    columns() {
      return this.tableData.map(item => ({ id: item.id, prop: `id${item.id}` }))
    },
    // BMS数据
    bmsRealData() {
      const arr1 = [...Object.values(this.bmsOneData), ...Object.values(this.bmsOnestateDataData)];
      const arr2 = [...Object.values(this.bmsTwoData), ...Object.values(this.bmsTwostateDataData)];
      const map = arr2.reduce((pre, curr) => {
        pre[curr.name] = curr.value;
        return pre;
      }, {});
      return arr1.map(item => ({
        name: item.name,
        value1: item.value,
        value2: item.name in map ? map[item.name] : "--"
      }));
    },

    // soc数据
    systemSOC() {
      if (this.esVersion === 1) {
        return this.bmsOneData.soc.value ?? "--"
      }
      let avg = "--";
      let num1 = this.bmsOneData.soc ? this.bmsOneData.soc.value : "--";
      let num2 = this.bmsTwoData.soc ? this.bmsTwoData.soc.value : "--";
      if (num1 != "--" && num2 != "--") {
        avg = ((num1 + num2) / 2).toFixed(2);
      }
      return avg;
    },

    // soc数据
    systemStatus() {
      if (this.esVersion === 1) {
        return this.bmsOnestateDataData.runState ? this.bmsOnestateDataData.runState?.value : "--";
      } else if (this.esVersion === 2) {
        return this.batteryStackStateData.runState?.value ?? "--"
      }
      let status = "--";
      let num1 = this.bmsOnestateDataData.runState ? this.bmsOnestateDataData.runState.value : "--";
      let num2 = this.bmsTwostateDataData.runState ? this.bmsTwostateDataData.runState.value : "--";
      if (num1 == "正常状态" && num2 == "正常状态") {
        status = "正常状态";
      } else {
        status = "异常状态";
      }
      return status;
    },

    // PCS数据
    pcsRealData() {
      let arr1 = [...Object.values(this.pcsInitialData)];
      return arr1.map((item) => {
        return {
          name: item.name,
          value: item.value,
        };
      });
    },
    storageItems() {
      return [
        { label: '当前状态', value: this.systemStatus },
        {
          label: '系统SOC',
          value: `${this.systemSOC}%`,
          trendColor: this.systemSOC > 80 ? '#67C23A' : '#E6A23C'
        },
        { label: '日充电量(kWh)', value: this.storageData.todayCharge },
        { label: '日放电量(kWh)', value: this.storageData.todayDisCharge },
        { label: '累计充电量(kWh)', value: this.storageData.totalCharge },
        { label: '累计放电量(kWh)', value: this.storageData.totalDischarge },
        { label: '今日收益(元)', value: this.storageData.todayIncome },
        { label: '本月收益(元)', value: this.storageData.monthIncome },
        { label: '本年收益(元)', value: this.storageData.yearIncome },
        { label: '累计收益(元)', value: this.storageData.totalIncome }
      ];
    },


    // 其他计算属性...
  },
  watch: {
    '$store.state.powerStationsId': {
      handler(newVal) {
        this.powerStationId = newVal;
        this.getTodayElectricityData("date", this.barDate, this.powerStationId, this.selectedDate, null, null, true);
        this.getStorageData();
      },
      immediate: true
    },
    '$store.state.storageRealData': {
      handler() {
        this.testRealData();
        this.initDeviceIdList();
      },
      deep: true
    },

  },
  methods: {
    handleDateTypeChange(e) {
      this.dateTypeIndex = e.currentIndex;
      this.timeTypeIndex = e.currentIndex;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');

      // 动态更新默认日期
      this.selectedDate = {
        0: currentDate.toISOString().split('T')[0],
        1: `${year}-${month}`,
        2: `${year}`
      }[this.timeTypeIndex];

      console.log('当前日期类型索引：', this.selectedDate, this.dateTypeIndex);
      this.handleDatePicker(this.selectedDate);
      // this.loadChartData();
    },
    handleDatePicker(value) {
      console.log("----------------")
      // 统一处理日期格式
      const dateMap = {
        0: { // 日模式
          dateType: 'date',
          dateValue: value
        },
        1: { // 月模式
          dateType: 'month',
          dateValue: value
        },
        2: { // 年模式
          dateType: 'year',
          dateValue: value
        }
      };

      console.log(dateMap[this.dateTypeIndex], value, "---------------------")

      let barDate = []
      switch (dateMap[this.dateTypeIndex].dateType) {
        case "date":
          barDate = Array.from({ length: 24 }, (_, i) => `${i}`);
          break;
        case "month":
          barDate = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
          break;
        case "year":
          barDate = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
          break;
        default:
          barDate = [];

      }
      this.getTodayElectricityData(dateMap[this.dateTypeIndex].dateType, barDate, this.powerStationId, dateMap[this.dateTypeIndex].dateValue, dateMap[this.dateTypeIndex].dateValue, dateMap[this.dateTypeIndex].dateValue);

      // this.getElectricityData(dateMap[this.dateTypeIndex]);
    },
    getBatteryCompartmentData(energyData, compartmentNum) {
      const prefix = `b${compartmentNum}_compartment_battery`;
      return {
        id: energyData[`${prefix}_pn_code`],
        soc: energyData[`${prefix}_soc`],
        status: energyData[`${prefix}_status`],
        minVoltage: energyData[`b${compartmentNum}_cell_min_cell_voltage`],
        maxVoltage: energyData[`${prefix}_max_cell_voltage`],
        voltageDiff: energyData[`${prefix}_pack_total_voltage`],
        current: energyData[`${prefix}_pack_total_current`],
        relayVoltage: energyData[`${prefix}_relay_external_voltage`],
        relaystatus: energyData[`${prefix}_relay_status`],
        temperature: energyData[`${prefix}_cell_board_max_temperature`],
        isEjected: 0  // 弹出状态，0表示未弹出，1表示已弹出
      };
    },
    createDefaultBatteryData() {
      return {
        id: '--',
        soc: '--',
        status: '--',
        minVoltage: '--',
        maxVoltage: '--',
        voltageDiff: '--',
        current: '--',
        relayVoltage: '--',
        relaystatus: '--',
        temperature: '--',
        isEjected: 0
      };
    },
    async getStorageData() {
      const res = await queryEnergyStationStorageInfo(this.powerStationId);
      if (res.status == 200) {
        this.storageData.todayCharge = res.data.dailyStorageDischarge == 'nu' ? 0 : res.data.dailyStorageDischarge;
        this.storageData.todayDisCharge = res.data.dailyStorageCharge == 'nu' ? 0 : res.data.dailyStorageCharge;
        this.storageData.totalCharge = res.data.totalStorageDischarge == 'nu' ? 0 : res.data.totalStorageDischarge;
        this.storageData.totalDisCharge = res.data.totalStorageCharge == 'nu' ? 0 : res.data.totalStorageCharge;
        this.storageData.todayIncome = res.data.dayIncome == 'nu' ? 0 : res.data.dayIncome;
        this.storageData.monthIncome = res.data.monthIncome == 'nu' ? 0 : res.data.monthIncome;
        this.storageData.yearIncome = res.data.yearIncome == 'nu' ? 0 : res.data.yearIncome;
        this.storageData.totalIncome = res.data.totalIncome == 'nu' ? 0 : res.data.totalIncome;
      }
    },


    async getTodayElectricityData(dateType, dateList, esId, day, date, year) {
      let colors = {
      };

      const [yearM, monthM] = (date || '').split('-').map(Number); // Add null check
      const startDay = dateUtils.dateYMD(new Date(yearM, monthM - 1, 1));
      const endDay = dateUtils.dateYMD(new Date(yearM, monthM, 0));
      let res;
      switch (dateType) {
        case "date":
          res = await queryDayElectricityStatistic(esId, day);
          break;
        case "month":
          res = await queryMonthElectricityStatistic(esId, startDay, endDay);
          break;
        case "year":
          res = await queryYearElectricityStatistic(esId, year);
          break;
      }
      let storageCharge = [];
      let storageDischarge = [];
      res.data.forEach((item, index) => {
        storageCharge[index] = item.storageCharge;
        storageDischarge[index] = item.storageDischarge;
      });
      const isOpposite = [4].includes(this.$store.state.powerStationsId)
      if (isOpposite) {
        this.chartsInit(storageDischarge, dateList, "kWh", "电量", colors, storageCharge);
      } else {
        this.chartsInit(storageCharge, dateList, "kWh", "电量", colors, storageDischarge);
      }
    },

    selectDevice(val) {
      this.selectedValue = val
      this.selectedDevices = this.options.find(item => item.value.id === val).value;
    },
    // 初始化设备Id列表
    initDeviceIdList() {
      const findData = this.$store.state.storageRealData;
      let temp = [];
      findData.forEach((item) => {
        let obj = {
          value: {
            name: item.name,
            id: item.deviceId,
            type: item.dataType,
            typeExplain: item.dataType === "1" ? "能源" : "状态",
          },
          label: item.name,
        };
        temp.push(obj);
      });
      this.options = temp;
    },



    async testRealData() {
      let findData;
      if ((!this.$store.state.station || this.powerStationId != this.$store.state.station.stationId) ||
        this.$store.state.station.deviceList.length == 0) {
        await this.$store.dispatch('station/getDeviceList', this.powerStationId);
      }
      findData = this.$store.state.station.deviceList;
      findData.forEach((item) => {
        if (item.name.includes("能源")) {
          item.dataType = "1";
        } else if (item.name.includes("状态")) {
          item.dataType = "2";
        } else {
          item.dataType = "1";
        }
        if (item.typeCode == "1704_V1_1") {
          item.typeCode = "1704_V1_2";
        }
      });
      this.realTimeService.initDeviceList(findData);
      let deviceLists = this.realTimeService.getDeviceList();
      this.deviceList = deviceLists;
      const bmsItems = deviceLists.filter((item) => item.name.includes("BMS"));
      const dcdcItems = deviceLists.filter((item) =>
        (item.name.includes("储能DC") || item.name.includes("DCDC") || item.name.includes("DC设备")) &&
        item.deviceType.includes("170C"));
      const batterySwap = deviceLists.filter((item) => (item.deviceType.includes("200B")));
      console.log('batterySwap', batterySwap);
      this.batterySwapData = batterySwap;
      dcdcItems.sort((a, b) => {
        if (a.name.includes("能源")) return -1;
        if (a.name.includes("状态")) return 1;
        return 0;
      });
      bmsItems.forEach((item, index) => {
        if (index % 2 === 0) {
          this.bmsOneData = item.energyData;
          this.bmsOnestateDataData = item.stateData;
          if (this.esVersion === 2) this.batteryStackStateData = item.batteryStackStateData;
        } else {
          this.bmsTwoData = item.energyData;
          this.bmsTwostateDataData = item.stateData;
        }
      });
      dcdcItems.forEach((item, index) => {
        if (index % 2 === 0) {
          if (item.name.includes("能源")) {
            this.dcdcOneData = item.energyData;
          } else {
            this.dcdcOnestateDataData = item.stateData;
          }
        } else {
          if (item.name.includes("能源")) {
            this.dcdcTwoData = item.energyData;
          } else {
            this.dcdcTwostateDataData = item.stateData;
          }
        }
      });
      deviceLists.forEach((item) => {
        switch (item.deviceType) {
          case "1707_V3_3":
            this.pcsInitialData = item.energyData;
            break;
          default:
            break;
        }
      });
      this.dcdcList = dcdcItems;
      this.dcdcEnergyList = dcdcItems.filter(item => item.name.includes('能源')).sort((a, b) => {
        const numA = parseInt(a.address.replace(/^0x/, ''), 16);
        const numB = parseInt(b.address.replace(/^0x/, ''), 16);
        return numA - numB;
      });
      this.dcdcStateList = dcdcItems.filter(item => item.name.includes('状态'));
      await this.$nextTick();
    },

    mapColumn(field) {
      return this.tableData.reduce((obj, item) => {
        obj[`id${item.id}`] = item[field]
        return obj
      }, {})
    },
    // 初始化曲线图
    chartsInit(datas, date, unit, title, colors, datasB) {
      this.$nextTick(() => {
        this.electricityChartData = {
          categories: date,
          series: [
            {
              name: '充电量',
              data: datas,

            },
            {
              name: '放电量',
              data: datasB,
            }
          ]
        };

        this.electricityChartOptions = {
          enableScroll: true,
          padding: [15, 15, 0, 15],
          dataLabel: false,
          xAxis: {
            disableGrid: true,
            boundaryGap: 'center',
            axisLine: { color: '#E4E7ED' },
            itemCount: date.length / 2,
            labelCount: date.length / 2,
            axisLabel: {
              interval: 1,
              width: 60,
              showMaxLabel: true
            },
            title: (value) => { // 智能标签格式化
              switch (this.dateTypeIndex) {
                case 0: return `${value}时`;
                case 1: return `${value}日`;
                case 2: return `${value}月`;
              }
            },
            scrollShow: true
          },
          yAxis: {
            disabled: false,
            disableGrid: false,
            splitNumber: 5,
            gridType: "dash",
            dashLength: 4,
            gridColor: "#CCCCCC",
            padding: 10,
            showTitle: true,
            data: [
              {
                position: "left",
                title: `电量(${unit})`
              }
            ]
          },
          extra: {
            column: {
              type: "group",
              width: 10,
              meterBorde: 1,
              meterFillColor: "#FFFFFF",
              activeBgColor: "#000000",
              activeBgOpacity: 0.08,
              seriesGap: 2,
              categoryGap: 2
            },
            tooltip: {
              fontSize: 10
            }
          }
        };
      });
    },
  },
  mounted() {
    this.testRealData();
    this.initDeviceIdList();
    this.getTodayElectricityData("date", this.barDate, this.powerStationId, this.selectedDate, null, null);
    this.getStorageData();
  },

  beforeDestroy() {
    this.realTimeService.unregister();
    uni.removeStorageSync("storageRealData");
    uni.removeStorageSync("powerStationsId");
  }
  // 其他生命周期钩子...
}
</script>

<style scoped lang="scss">
.basic-info {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-group {
  padding: 12px;
  background: #f8fafb;
  border-radius: 8px;

  .status-item {
    &:not(:last-child) {
      border-bottom: 1px solid #e8eaec;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }

    &.horizontal-layout {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .status-label {
        color: #666;
        font-size: 14px;
        min-width: 80px;
      }

      .status-value {
        color: #2d8cf0;
        font-weight: 500;
        font-size: 15px;
      }
    }
  }
}

.chart-box {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* BMS参数区块 */
.dcdc-parameter {
  border: 1px solid #e8eaec;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 10rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .dcdc-title {
    padding: 12px 16px;
    background: #f8f9fa;
    font-size: 16px;
    font-weight: 600;
    color: #2d8cf0;
    border-bottom: 1px solid #e8eaec;
  }

  .dcdc-device {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 10px 16px;
    background: #fafbfc;

    .device-label {
      text-align: center;
      color: #666;
      font-size: 14px;
      padding: 8px 0;

      &:not(:first-child) {
        border-left: 1px solid #e8eaec;
      }
    }
  }

  .dcdc-data-box {
    height: 340px;

    .dcdc-data-item {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.2s;

      &:hover {
        background: #f8f9fa;
      }

      .dcdc-data-name {
        color: #666;
        font-size: 14px;
        white-space: nowrap;
      }

      .dcdc-data-value {
        text-align: center;
        color: #333;
        font-weight: 500;
        font-size: 14px;
        padding: 0 8px;
      }
    }
  }
}

.vertical-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 15px;
}

.data-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.data-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.data-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}



.custom-picker.date-picker {
  width: 100%;
  max-width: 300px;
  background: #ffffff;
  padding: 10px 15px;
  // box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.custom-picker.date-picker:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

.custom-picker.date-picker:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
</style>
