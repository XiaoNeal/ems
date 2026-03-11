<template>
  <view class="container">


    <view class="data-grid">
      <view class="data-cell">
        <view class="vertical-layout">
          <text class="data-label">日用电量</text>
          <view class="data-container">
            <text class="data-value">{{ storageData.todayConsume }}</text>
            <text class="data-unit">kWh</text>
          </view>
        </view>
      </view>
      <view class="data-cell">
        <view class="vertical-layout">
          <text class="data-label">累计用电量</text>
          <view class="data-container">
            <text class="data-value">{{ storageData.totalConsume }}</text>
            <text class="data-unit">kWh</text>
          </view>
        </view>
      </view>
    </view>


    <view class="chart-box">
      <view class="date-picker-container" style="display: flex; flex-direction: column; gap: 8px;">
        <uni-segmented-control :current="dateTypeIndex" :values="['日', '月', '年']" @clickItem="handleDateTypeChange" />

        <!-- 日模式 -->
        <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate"
          class="custom-picker date-picker" />

        <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker" v-model="selectedDate"
          class="custom-picker date-picker" />

        <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate"
          class="custom-picker date-picker" />
      </view>
      <qiun-data-charts type="column" :chartData="electricityChartData" :ontouch="true" :opts="electricityChartOptions"
        :canvas2d="canvas2d" :inScrollView="true" canvasId="electricity-charts" />
    </view>



    <!-- 光伏DC -->

    <view class="grid-content dcdc-parameter"
      style="background: #fff; border-radius: 16rpx; padding: 20rpx; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);">
      <view class="dcdc-title"
        style="font-size: 34rpx; color: #303133; margin-bottom: 20rpx; padding-bottom: 20rpx; border-bottom: 1rpx solid #ebeef5;">
        负载DC
        <text style="font-size: 28rpx; color: #909399; margin-left: 15rpx;">实时数据</text>
      </view>
      <view class="dcdc-device"
        style="display: flex; margin: 20rpx 0; background: #f5f7fa; border-radius: 8rpx; padding: 15rpx 0;">
        <view style="flex: 1; text-align: center; font-weight: 500; color: #4488fb;">设备</view>
        <view style="flex: 1; text-align: center; font-weight: 500; color: #4488fb;">1#</view>
        <view style="flex: 1; text-align: center; font-weight: 500; color: #4488fb;">2#</view>
      </view>
      <scroll-view class="dcdc-data-box" scroll-y style="height: calc(100% - 160rpx);">
        <view class="dcdc-data-item" v-for="(item, index) in loaddcdcRealData" :key="index"
          style="display: flex; align-items: center; padding: 24rpx 0; border-bottom: 1rpx solid #ebeef5;">
          <view class="dcdc-data-name" style="flex: 2; font-size: 28rpx; color: #606266;">{{ item.name }}
          </view>
          <view class="dcdc-data-value"
            style="flex: 1; text-align: center; font-size: 30rpx; color: #303133; font-weight: 500;">{{
              item.value1 }}</view>
          <view class="dcdc-data-value"
            style="flex: 1; text-align: center; font-size: 30rpx; color: #303133; font-weight: 500;">{{
              item.value2 }}</view>
        </view>
      </scroll-view>
    </view>




  </view>
</template>

<script>
import * as dateUtils from "@/utils/date";
import { mapState } from 'vuex';
import { RealtimeDataProviderService } from "@/service/socket/realtime-data-provider.js";
import { queryDayElectricityStatistic, queryMonthElectricityStatistic, queryYearElectricityStatistic } from "@/api/index";
import { queryEnergyStationDCData } from "@/api/devices";
import { Model170C } from '@/service/devices/170C-model'
import dyDate from '@/components/dy-Date/dy-Date.vue'; // 导入日期选择器组件
export default {
  components: {
    dyDate, // 注册日期选择器组件
  },
  data() {
    return {
      canvas2d: this.$Config.ISCANVAS2D,
      options: [],
      barDate: Array.from({ length: 24 }, (_, i) => `${i}`),
      realTimeService: new RealtimeDataProviderService(),
      dcdcOneData: {},
      dcdcTwoData: {},
      dcdcOnestateData: {},
      dcdcTwostateData: {},
      bmsOneData: {},
      bmsTwoData: {},
      bmsOnestateDataData: {},
      bmsTwostateDataData: {},
      pcsInitialData: [],
      powerStationId: this.$store.state.powerStationsId,
      loaddcdcOneData: new Model170C().energyData,
      loaddcdcTwoData: new Model170C().energyData,
      loaddcdcOnestateData: new Model170C().stateData,
      loaddcdcTwostateData: new Model170C().stateData,
      storageData: {
        todayConsume: "--",
        totalConsume: "--"
      },
      electricityChartData: {},
      electricityChartOptions: {},
      dateTypeIndex: 0, // 当前日期类型索引 0:日 1:月 2:年
      timeTypeIndex: 0,
      selectedDate: new Date().toISOString().split('T')[0],
    };
  },
  computed: {
    ...mapState(['powerStationsId']),
    loaddcdcRealData() {
      const arr1 = [...Object.values(this.loaddcdcOneData), ...Object.values(this.loaddcdcOnestateData)];
      const arr2 = [...Object.values(this.loaddcdcTwoData), ...Object.values(this.loaddcdcTwostateData)];
      const map = arr2.reduce((pre, curr) => {
        pre[curr.name] = curr.value;
        return pre;
      }, {});
      return arr1.map((item) => ({
        name: item.name,
        value1: item.value,
        value2: map[item.name] !== undefined ? map[item.name] : '--'
      }));
    }
  },
  watch: {
    '$store.state.powerStationsId': function (newVal, oldVal) {
      this.powerStationId = newVal;
    },
    '$store.state.storageRealData': function (newVlue, oldValue) {
      this.testRealData();
      this.initDeviceIdList();
    }
  },
  methods: {
    async testRealData() {
      let findData;
      if (this.powerStationId != this.$store.state.station.stationId || this.$store.state.station.deviceList.length == 0) {
        await this.$store.dispatch('station/getDeviceList', this.powerStationId)
      }
      findData = this.$store.state.station.deviceList
      // if (Object.keys(store.state.storageRealData).length === 0) {
      //   const tempfindData = localStorage.getItem("storageRealData");
      //   findData = JSON.parse(tempfindData);
      // } else {
      //   findData = store.state.storageRealData;
      // }
      console.log('findData', findData)
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
      // 使用 filter 方法来查找所有 name 包含 "BMS" 的对象
      const bmsItems = deviceLists.filter((item) => item.name.includes("BMS"));
      // 使用 filter 方法来查找所有 name 包含 "DC" 的对象
      const dcdcItems = deviceLists.filter((item) => item.name.includes("光伏DC"));
      const loaddcdcItems = deviceLists.filter((item) => item.name.includes("负载DC"))
      dcdcItems.sort((a, b) => {
        if (a.name.includes("能源")) return -1;
        if (a.name.includes("状态")) return 1;
        return 0; // 如果都是同一种类型，则保持原有顺序
      });
      loaddcdcItems.sort((a, b) => {
        if (a.name.includes("能源")) return -1;
        if (a.name.includes("状态")) return 1;
        return 0; // 如果都是同一种类型，则保持原有顺序
      });
      bmsItems.forEach((item, index) => {
        if (index % 2 === 0) {
          this.bmsOneData = item.energyData;
          this.bmsOnestateDataData = item.stateData; // 将偶数索引的对象放入第一个数组
        } else {
          this.bmsTwoData = item.energyData;
          this.bmsTwostateDataData = item.stateData; // 将奇数索引的对象放入第二个数组
        }
      });
      dcdcItems.forEach((item, index) => {
        if (index % 2 === 0) {
          if (item.name.includes("能源")) {
            this.dcdcOneData = item.energyData;
          } else {
            this.dcdcOnestateData = item.stateData;
          }
        } else {
          if (item.name.includes("能源")) {
            this.dcdcTwoData = item.energyData;
          } else {
            this.dcdcTwostateData = item.stateData;
          }
        }
      });
      // loaddcdcItems.forEach((item, index) => {
      //   if (index % 2 === 0) {
      //     if (item.name.includes("能源")) {
      //       loaddcdcOneData.value = item.energyData;
      //     } else {
      //       loaddcdcOnestateData.value = item.stateData;
      //     }
      //   } else {
      //     if (item.name.includes("能源")) {
      //       loaddcdcTwoData.value = item.energyData;
      //     } else {
      //       loaddcdcTwostateData.value = item.stateData;
      //     }
      //   }
      // });
      const dcLoadEnergys = loaddcdcItems.filter(item => item.name.includes("能源"))
      const dcLoadStates = loaddcdcItems.filter(item => item.name.includes("状态"))
      dcLoadEnergys.map((item, index) => {
        if (index % 2 === 0) {
          this.loaddcdcOneData = item.energyData;
        } else {
          this.loaddcdcTwoData = item.energyData;
        }
      })
      dcLoadStates.map((item, index) => {
        if (index % 2 === 0) {
          this.loaddcdcOnestateData = item.stateData;
        } else {
          this.loaddcdcTwostateData = item.stateData;
        }
      })
      deviceLists.forEach((item) => {
        switch (item.deviceType) {
          case "1707_V3_3":
            this.pcsInitialData = item.energyData;
            break;
          default:
            break;
        }
      });
      // await nextTick();
    },


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
    async getStorageData() {
      queryEnergyStationDCData(this.powerStationId, dateUtils.dateYMD(new Date()))
        .then((res) => {
          if (res.status != 200) return;
          this.storageData.todayConsume = res.data.dailyConsume == 'nu' ? 0 : res.data.dailyConsume;
          this.storageData.totalConsume = res.data.totalConsume == 'nu' ? 0 : res.data.totalConsume;
        })
        .catch((err) => {
          console.error(err);
        });
    },

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

    async getTodayElectricityData(dateType, dateList, esId, day, date, year) {
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
      let datas = {
        storageCharge: [],
        storageDischarge: [],
        photovoltaicPower: [],
        gridSupply: [],
        gridSupplyReverse: []
      };
      res.data.forEach((item, index) => {
        datas.storageCharge[index] = item.storageCharge;
        datas.storageDischarge[index] = item.storageDischarge;
        datas.photovoltaicPower[index] = item.photovoltaicPower;
        datas.gridSupply[index] = item.gridPowerSupply;
        datas.gridSupplyReverse[index] = item.gridPowerSupplyReverse;
      });
      this.chartsInit(datas, dateList);
    },


    chartsInit(datas, date) {
      this.$nextTick(() => {
        this.electricityChartData = {
          categories: date,
          series: [
            {
              name: "供电量",
              data: datas.gridSupply,
              // color: colors.themeColor
            },
            {
              name: "馈电量",
              data: datas.gridSupplyReverse,
              // color: "rgba(0, 205, 167, 1)"
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
                title: `电量(kWh)`
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
    // 初始化曲线图
    // chartsInit(datas, date, unit, title, colors) {
    //   this.electricityChartData = {
    //     categories: date,
    //     series: [{
    //       name: title,
    //       data: datas.gridSupply,
    //       // color: colors.themeColor
    //     }]
    //   };

    //   this.electricityChartOptions = {
    //     title: {
    //       text: title,
    //       textStyle: {
    //         color: colors.themeColor
    //       }
    //     },
    //     grid: {
    //       bottom: 20,
    //       right: 20,
    //       left: 40
    //     },
    //     legend: {
    //       show: true,
    //       right: 0,
    //       textStyle: {
    //         color: colors.textColor
    //       }
    //     },
    //     xAxis: {
    //       axisLine: {
    //         lineStyle: {
    //           color: colors.themeColor
    //         }
    //       },
    //       axisLabel: {
    //         color: colors.textColor
    //       }
    //     },
    //     yAxis: {
    //       name: unit,
    //       nameTextStyle: {
    //         color: colors.textColor
    //       },
    //       axisLine: {
    //         lineStyle: {
    //           color: colors.textColor
    //         }
    //       },
    //       splitLine: {
    //         lineStyle: {
    //           type: "dashed"
    //         }
    //       }
    //     }
    //   };
    // }
  },
  mounted() {
    this.testRealData();
    this.initDeviceIdList();
    this.getStorageData();
    this.getTodayElectricityData("date", this.barDate, this.powerStationId, this.selectedDate, null, null, true);
  },
  beforeDestroy() {
    this.realTimeService.unregister();
    uni.removeStorageSync("storageRealData");
    uni.removeStorageSync("powerStationsId");
  }
};
</script>

<style scoped>
/* 新增整体布局样式 */
.container {
  padding: 20rpx;
  background: #f5f7fa;
}

/* 基本信息区块优化 */
.basic-info {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx;
}

.data-cell {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.data-cell:active {
  transform: scale(0.98);
}

.vertical-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.data-label {
  font-size: 28rpx;
  color: #909399;
  font-weight: 400;
}

.data-value {
  font-size: 40rpx;
  font-weight: 600;
  color: #303133;
  letter-spacing: -0.5rpx;
}

.data-unit {
  font-size: 24rpx;
  color: #909399;
  margin-top: -4rpx;
}

.basic-info-left {
  flex: 1;
  padding: 20rpx;
  border-right: 1rpx solid #ebeef5;
}

.basic-info-right {
  flex: 1;
  padding: 20rpx 0;
}

.basic-info-item {
  margin-bottom: 30rpx;
  text-align: center;
}

.basic-info-name {
  font-size: 28rpx;
  color: #909399;
  margin-bottom: 10rpx;
}

.basic-info-value {
  font-size: 36rpx;
  color: #4488fb;
  font-weight: 600;
}

/* 日期选择器容器优化 */
.chose-date {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

/* 新增设备标题样式 */
.dcdc-device view {
  flex: 1;
  text-align: center;
  font-weight: 500;
  color: #303133;
  padding: 15rpx 0;
  background: #f5f7fa;
  border-radius: 8rpx;
  margin: 0 10rpx;
}

/* 数据滚动区域优化 */
.dcdc-data-box {
  background: #fff;
  border-radius: 12rpx;
  padding: 0 20rpx;
}

.block {
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  margin: 20rpx;
}

.demonstration {
  font-size: 32rpx;
  color: #606266;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.picker {
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 8rpx;
  color: #606266;
}

.chart-box {
  height: 90%;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  padding: 20rpx;
}

.btns {
  background: #4488fb;
  color: white;
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  display: inline-block;
  margin-left: 20rpx;
  transition: opacity 0.3s;
}

.btns:active {
  opacity: 0.8;
}

.dcdc-title {
  font-size: 36rpx;
  color: #303133;
  font-weight: 600;
  padding: 20rpx 0;
}

.dcdc-data-item {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #ebeef5;
}

.dcdc-data-name {
  flex: 2;
  color: #909399;
}

.dcdc-data-value {
  flex: 1;
  text-align: center;
  color: #303133;
  font-weight: 500;
}

.date-picker {
  width: 100%;
  max-width: 300px;
  background: #ffffff;
  padding: 10px 15px;
  /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); */
  transition: all 0.3s ease;
}
</style>

<style scoped>
.data-container {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.data-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #303133;
}

.data-unit {
  font-size: 24rpx;
  color: #909399;
}
</style>
