<template>
  <view class="container">
          <view class="data-grid">
            <view class="data-cell" v-for="(item, index) in gridStats" :key="index">
              <view class="vertical-layout" style="gap: 4px;">
                <text class="data-label">{{ item.label }}(kWh)</text>
                <text class="data-value">{{ item.value }}</text>
              </view>
            </view>
          </view>

          <view class="chart-box">
            <view class="date-picker-container" style="display: flex; flex-direction: column; gap: 8px;">
              <uni-segmented-control :current="dateTypeIndex" :values="['日', '月', '年']"
                @clickItem="handleDateTypeChange" />
              <!-- 日模式 -->
              <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate"
                class="custom-picker date-picker" />

              <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker"
                v-model="selectedDate" class="custom-picker date-picker" />

              <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate"
                class="custom-picker date-picker" />
            </view>
            <qiun-data-charts type="column" :chartData="electricityChartData" :ontouch="true"
              :opts="electricityChartOptions" :canvas2d="canvas2d" :inScrollView="true" canvasId="electricity-charts" />
          </view>
            <!-- PCS参数 -->
            <view class="grid-content pcs-parameter">
              <text class="pcs-title">PCS参数</text>
              <view class="pcs-scrollbar">
                <view class="pcs-box">
                  <view class="dcdc-data-item" v-for="(item, index3) in pcsRealData" :key="index3">
                    <text class="dcdc-data-name">{{ item.name }}</text>
                    <text class="dcdc-data-value">{{ item.value }}</text>
                  </view>
                </view>
              </view>
            </view>
         
        


  </view>
</template>

<script>
import { queryEnergyStationGridData } from "@/api/devices";
import { RealtimeDataProviderService } from '@/service/socket/realtime-data-provider.js';
import { queryDayElectricityStatistic, queryMonthElectricityStatistic, queryYearElectricityStatistic } from "@/api/index";
import * as dateUtils from "@/utils/date";
// import DatePicker from '@/components/DatePicker.vue';
import { Model1707V3 } from '@/service/devices/1707V3-model.js'
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
      storageData: {
        todaySupply: "--",
        todaySupplyReverse: "--",
        totalSupply: "--",
        totalSupplyReverse: "--",
      },
      electricityChartData: {},
      electricityChartOptions: {},
      loaddcdcOneData: {},
      loaddcdcTwoData: {},
      loaddcdcOnestateData: {},
      loaddcdcTwostateData: {},
      dcdcOneData: {}, //初始第一个dcdc能源数据
      dcdcTwoData: {}, //初始第二个dcdc能源数据
      dcdcOnestateData: {}, //初始第一个dcdc状态数据
      dcdcTwostateData: {},
      pcsInitialData: new Model1707V3().energyData,
      powerStationId: this.$store.state.powerStationsId,
      bmsOnestateDataData: {},//初始第一个bms状态数据
      bmsTwostateDataData: {},
      dateTypeIndex: 0, // 当前日期类型索引 0:日 1:月 2:年
      timeTypeIndex: 0,
      selectedDate: new Date().toISOString().split('T')[0],
    };
  },
  computed: {
    // ...mapState(['powerStationsId']),
    pcsRealData() {
      if (!this.pcsInitialData) return [];
      let arr1 = [...Object.values(this.pcsInitialData)];
      return arr1.map((item) => {
        return {
          name: item.name,
          value: item.value,
        };
      });
    },
    // DCDC数据
    dcdcRealData() {
      const arr1 = [...Object.values(this.dcdcOneData), ...Object.values(this.dcdcOnestateData)]
      const arr2 = [...Object.values(this.dcdcTwoData), ...Object.values(this.dcdcTwostateData)]
      const map = arr2.reduce((pre, curr) => {
        pre[curr.name] = curr.value
        return pre
      }, {})
      return arr1.map((item) => {
        return {
          name: item.name,
          value1: item.value,
          value2: map[item.name] !== undefined ? map[item.name] : '--'
        }
      })
    },
    loaddcdcRealData() {
      const arr1 = [...Object.values(this.loaddcdcOneData), ...Object.values(this.loaddcdcOnestateData)]
      const arr2 = [...Object.values(this.loaddcdcTwoData), ...Object.values(this.loaddcdcTwostateData)]
      const map = arr2.reduce((pre, curr) => {
        pre[curr.name] = curr.value
        return pre
      }, {})
      return arr1.map((item) => {
        return {
          name: item.name,
          value1: item.value,
          value2: map[item.name] !== undefined ? map[item.name] : '--'
        }
      })
    },
    gridStats() {
      return [
        {
          label: '日供电量',
          value: this.storageData.todaySupply,
          trendIcon: 'arrow-up',
          trendValue: '+5%',
          trendColor: '#67C23A'
        },
        {
          label: '日馈电量',
          value: this.storageData.todaySupplyReverse,
        },
        {
          label: '累计供电量',
          value: this.storageData.totalSupply,
        },
        {
          label: '累计馈电量',
          value: this.storageData.totalSupplyReverse,
        }
      ]
    }
  },
  methods: {
    async getStorageData() {
      queryEnergyStationGridData(this.powerStationId, dateUtils.dateYMD(new Date())).then((res) => {
        if (res.status != 200) return
        this.storageData.todaySupply = res.data.dailyGridSupply == 'nu' ? 0 : res.data.dailyGridSupply;
        this.storageData.todaySupplyReverse = res.data.dailyGridSupplyReverse == 'nu' ? 0 : res.data.dailyGridSupplyReverse;
        this.storageData.totalSupply = res.data.totalGridSupply == 'nu' ? 0 : res.data.totalGridSupply;
        this.storageData.totalSupplyReverse = res.data.totalGridSupplyReverse == 'nu' ? 0 : res.data.totalGridSupplyReverse;
      });
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
      // 调用数据加载

      // this.reportDate = val.day.slice(0, 10);
      // reportMonth = val.month;
      // reportYear = val.year;
      // funsIndex = val.dateType;
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

    // 获取实时数据
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
      loaddcdcItems.forEach((item, index) => {
        if (index % 2 === 0) {
          if (item.name.includes("能源")) {
            this.loaddcdcOneData = item.energyData;
          } else {
            this.loaddcdcOnestateData = item.stateData;
          }
        } else {
          if (item.name.includes("能源")) {
            this.loaddcdcTwoData = item.energyData;
          } else {
            this.loaddcdcTwostateData = item.stateData;
          }
        }
      });
      deviceLists.forEach((item) => {
        switch (item.deviceType) {
          case "1707_V3_2":
            this.pcsInitialData = item.energyData;
            break;
          case "1707_V3_3":
            this.pcsInitialData = item.energyData;
            break;
          default:
            break;
        }
      });
      // await nextTick();
    },

    // 获取充放电量数据——曲线图
    async getTodayElectricityData(dateType, dateList, esId, day, date, year) {
      let colors = {
        themeColor: "#4488fb",
        textColor: "#999999",
        dashedLine: true,
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
      let datas = {
        storageCharge: [],
        storageDischarge: [],
        photovoltaicPower: [],
        gridSupply: [],
        gridSupplyReverse: []
      }
      res.data.forEach((item, index) => {
        datas.storageCharge[index] = item.storageCharge;
        datas.storageDischarge[index] = item.storageDischarge;
        datas.photovoltaicPower[index] = item.photovoltaicPower
        datas.gridSupply[index] = item.gridPowerSupply
        datas.gridSupplyReverse[index] = item.gridPowerSupplyReverse
      });
      this.chartsInit(datas, dateList);
    },


    // 初始化曲线图
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

    // // 初始化曲线图
    // chartsInit(datas, date, unit, title, colors) {
    //   // nextTick(() => {
    //   const chartData = {
    //     categories: date,
    //     series: [
    //       {
    //         name: "供电量",
    //         data: datas.gridSupply,
    //         // color: colors.themeColor
    //       },
    //       {
    //         name: "馈电量",
    //         data: datas.gridSupplyReverse,
    //         // color: "rgba(0, 205, 167, 1)"
    //       }
    //     ]
    //   };

    //   const chartOptions = {
    //     title: {
    //       text: title,
    //       // color: colors.themeColor,
    //       fontSize: 14,
    //       left: "center"
    //     },
    //     legend: {
    //       right: 10,
    //       // textStyle: {
    //       //   color: colors.textColor
    //       // }
    //     },
    //     xAxis: {
    //       axisLine: {
    //         lineStyle: {
    //           // color: colors.themeColor
    //         }
    //       },
    //       // axisLabel: {
    //       //   color: colors.textColor
    //       // }
    //     },
    //     yAxis: {
    //       name: unit,
    //       nameTextStyle: {
    //         // color: colors.textColor
    //       },
    //       axisLine: {
    //         lineStyle: {
    //           // color: colors.textColor,
    //           type: "dashed"
    //         }
    //       },
    //       // axisLabel: {
    //       //   color: colors.textColor
    //       // },
    //       splitLine: {
    //         show: colors.dashedLine,
    //         lineStyle: {
    //           type: "dashed"
    //         }
    //       }
    //     },
    //     tooltip: {
    //       trigger: "axis",
    //       axisPointer: {
    //         type: "shadow",
    //         shadowStyle: {
    //           color: "rgba(0, 0, 0, 0.1)"
    //         }
    //       }
    //     }
    //   };

    //   this.electricityChartData = chartData;
    //   this.electricityChartOptions = chartOptions;
    //   // });
    // }
  },
  watch: {
    '$store.state.powerStationsId': {
      handler(newVal) {
        this.powerStationId = newVal;
      },
      immediate: true
    },
    '$store.state.storageRealData': {
      handler() {
        this.testRealData();
        this.initDeviceIdList();
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.realTimeService.unregister();
    uni.removeStorageSync("storageRealData");
    uni.removeStorageSync("powerStationsId");
  },
  mounted() {
    this.testRealData();
    this.initDeviceIdList();
    this.getStorageData();
    this.getTodayElectricityData("date", this.barDate, this.powerStationId, this.initToday, null, null, true);
  }
}
</script>

<style>
.basic-info {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-image {
  width: 70%;
  height: 70%;
  margin: 0 auto;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.info-image:hover {
  transform: scale(1.05);
}

.basic-info-right {
  margin-top: 15px;
}

.data-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
}

.data-cell {
  width: calc(50% - 6px);
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.cell-content {
  align-items: center;
  gap: 4px;
}

.vertical-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
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


.info-image {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .data-grid {
    grid-template-columns: 1fr;
  }

  .info-image {
    width: 80px;
    height: 80px;
  }
}

.basic-info-item {
  margin-bottom: 10px;
  padding: 8px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.basic-info-name {
  font-size: 14px;
  color: #666;
}

.basic-info-value {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

.chart-box {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chose-date {
  margin-bottom: 15px;
}

.pcs-parameter {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pcs-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin-bottom: 15px;
}

.dcdc-data-item {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.dcdc-data-item:hover {
  background-color: #e0e0e0;
}

.dcdc-data-name {
  font-size: 14px;
  color: #666;
}

.dcdc-data-value {
  font-size: 14px;
  color: #333;
  font-weight: bold;
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

<style>
/* 新增以下样式 */
.pcs-parameter {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 16px;
}

.pcs-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
  display: block;
}

.pcs-scrollbar {
  max-height: 50vh; /* 使用视口单位动态调整高度 */
  overflow-y: auto;
  padding-right: 4px; /* 防止滚动条遮挡内容 */
}

.pcs-box {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* 自适应列宽 */
  gap: 8px;
  padding: 8px;
}

.dcdc-data-item {
  padding: 8px 12px;
  background: #f8f9fb;
  border-radius: 6px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .pcs-scrollbar {
    max-height: 40vh; /* 减小移动端高度 */
  }
  .pcs-box {
    grid-template-columns: 1fr; /* 单列布局 */
  }
}
</style>
