<template>
  <view v-if="isShowMask" class="pop-up">
    <view class="pop-up-header">
      <text class="pop-up-title">{{ deviceName }}</text>
      <uni-icons type="close" class="close-icon" @click="closeMask"></uni-icons>
    </view>
    <view class="pop-up-content" v-loading="chartsDataLoading" element-loading-background="rgba(255, 255, 255, 0.1)">
      <view class="toolbar">
        <DatePicker @date-picker="handleDatePicker" />
      </view>
      <view class="charts-grid">
        <qiun-data-charts type="line" :chartData="electricityChartData" :opts="chartOptions" canvasId="electricity-chart" />
        <qiun-data-charts type="line" :chartData="voltageChartData" :opts="chartOptions" canvasId="voltage-chart" />
        <qiun-data-charts type="line" :chartData="currentChartData" :opts="chartOptions" canvasId="current-chart" />
        <qiun-data-charts type="line" :chartData="powerChartData" :opts="chartOptions" canvasId="power-chart" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    isShowMask: Boolean,
    deviceName: String,
    chartsDataLoading: Boolean,
    electricityChartData: Object,
    voltageChartData: Object,
    currentChartData: Object,
    powerChartData: Object,
    chartOptions: Object
  },
  methods: {
    closeMask() {
      this.$emit('close-mask');
    },
    handleDatePicker(date) {
      this.$emit('date-picker', date);
    },
        // 初始化曲线图
        async initElectricityCharts(deviceId, dataType, day, month, year) {
      this.$nextTick(async () => {
        let colors = {
          themeColor: this.$store.state.themeName === "dark" ? "#00ffff" : "#4488fb",
          textColor: tthis.$store.state.themeName === "dark" ? "#ffffff" : "#999999",
          dashedLine: this.$store.state.themeName === "dark" ? false : true,
        };

        const res = await this.getChartData(deviceId, dataType, day, month, year);

        console.log("res-------------------------", res);

        this.electricityChartData = this.formatChartData(res.electricity);
        this.voltageChartData = this.formatChartData(res.voltage);
        this.currentChartData = this.formatChartData(res.current);
        this.powerChartData = this.formatChartData(res.power);

        const startDay = dateUtils.dateYMD(new Date(year, month - 1, 1));
        const endDay = dateUtils.dateYMD(new Date(year, month, 0));

        // let res;
        if (dataType === "date") {
          res = await queryEnergyStationByDay(deviceId, day);
        } else if (dataType === "month") {
          res = await queryEnergyStationByMonth(deviceId, startDay, endDay);
        } else if (dataType === "year") {
          res = await queryEnergyStationByYear(deviceId, year);
        }

        let totalForwardQ = [], voltage = [], voltageA = [], voltageB = [], voltageC = [], current = [], currentA = [], currentB = [], currentC = [], power = [], dayDate = [];

        res.data.data.forEach(element => {
          if (element.totalValidPower) {
            totalForwardQ.push(element.electric);
            voltageA.push(element.phaseVoltageA);
            voltageB.push(element.phaseVoltageB);
            voltageC.push(element.phaseVoltageC);
            currentA.push(element.phaseCurrentA);
            currentB.push(element.phaseCurrentB);
            currentC.push(element.phaseCurrentC);
            current.push(element.current || element.current == 0 ? element.current : element.phaseCurrentA);
            power.push(element.power || element.power == 0 ? Math.abs(element.power) : (element.totalValidPower / 1000).toFixed(2));
          } else {
            totalForwardQ.push(element.totalForwardQ || element.totalForwardQ == 0 ? element.totalForwardQ : null);
            voltageA.push(element.voltage || element.voltage == 0 ? element.voltage : null);
            current.push(element.current || element.current == 0 ? element.current : null);
            power.push(element.power || element.power == 0 ? Math.abs(element.power) : null);
          }
          dayDate.push(dataType === 'date'
            ? element.hour + '时'
            : (new Date(element.date).getMonth() + 1) + '-' + new Date(element.date).getDate() + ' ' + element.hour + ':00');
        });

        chartsInit(totalForwardQ, dayDate, electricitycarbonChart, "kWh", "电量", colors);

        if (voltageA.length > 0) {
          ABCchartsInit(voltageA, dayDate, voitagecarbonChart, "V", "电压", colors, voltageB, voltageC);
          ABCchartsInit(currentA, dayDate, currentcarbonChart, "A", "电流", colors, currentB, currentC);
        } else {
          chartsInit(voltageA, dayDate, voitagecarbonChart, "V", "电压", colors);
          chartsInit(currentA, dayDate, currentcarbonChart, "A", "电流", colors);
        }

        chartsInit(power, dayDate, powercarbonChart, "kW", "功率", colors);
        chartsDataLoading.value = false;
      });
    },

    // 弹窗后的详细数据，曲线图
    ABCchartsInit(
      datas,
      date,
      carbonChart,
      unit,
      title,
      colors,
      dataB,
      dataC
    ) {
      var maxData = Math.max(...datas);
      var minData = Math.min(...datas);
      maxData = Math.ceil(maxData / 10) * 10;
      var interval = Math.trunc(maxData / 4);
      var carbonOption;
      carbonOption = {
        title: {
          text: title,
          textStyle: {
            color: colors.themeColor,
          },
          // left:"5%"
        },
        grid: {
          bottom: 20,
          right: 10,
          left: "5%",
        },
        tooltip: {
          trigger: "axis",
        },
        color: [colors.themeColor, "rgba(0, 205, 167, 1)", "rgba(250, 200, 88)"],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: colors.themeColor,
            },
          },
          axisLabel: {
            color: colors.textColor,
          },
        },
        yAxis: {
          type: "value",
          name: unit,
          nameGap: 10,
          splitNumber: 5,
          interval: interval,
          max: maxData,
          nameTextStyle: {
            padding: [0, 30, 0, 0],
          },
          axisLine: {
            lineStyle: {
              color: colors.textColor,
              type: "dashed",
            },
          },
          axisLabel: {
            color: colors.textColor,
          },
          splitLine: {
            show: colors.dashedLine,
            lineStyle: {
              type: "dashed",
            },
          },
        },
        series: [
          {
            data: datas,
            name: `A相${title}`,
            type: "line",
            showSymbol: false,
            color: colors.themeColor,
          },
          {
            data: dataB,
            name: `B相${title}`,
            type: "line",
            showSymbol: false,
            color: "rgba(0, 205, 167, 1)",
          },
          {
            data: dataC,
            name: `C相${title}`,
            type: "line",
            showSymbol: false,
            color: "rgba(250, 200, 88)",
          },
        ],
      };
      carbonOption && carbonChart.setOption(carbonOption);
    },

    // 弹窗后的详细数据，曲线图
    chartsInit(datas, date, carbonChart, unit, title, colors) {
      var maxData = Math.max(...datas);
      var minData = Math.min(...datas);
      maxData = Math.ceil(maxData / 10) * 10;
      var interval = Math.trunc(maxData / 4);
      var carbonOption;
      carbonOption = {
        title: {
          text: title,
          textStyle: {
            color: colors.themeColor,
          },
          // left:"5%"
        },
        grid: {
          bottom: 20,
          right: 10,
          left: "5%",
        },
        tooltip: {
          trigger: "axis",
        },
        color: colors.themeColor,
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: colors.themeColor,
            },
          },
          axisLabel: {
            color: colors.textColor,
          },
        },
        yAxis: {
          type: "value",
          name: unit,
          nameGap: 10,
          splitNumber: 5,
          interval: interval,
          max: maxData,
          nameTextStyle: {
            padding: [0, 30, 0, 0],
          },
          axisLine: {
            lineStyle: {
              color: colors.textColor,
              type: "dashed",
            },
          },
          axisLabel: {
            color: colors.textColor,
          },
          splitLine: {
            show: colors.dashedLine,
            lineStyle: {
              type: "dashed",
            },
          },
        },
        series: [
          {
            data: datas,
            type: "line",
            showSymbol: false,
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(255,255,255,0)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: colors.themeColor, // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      };
      carbonOption && carbonChart.setOption(carbonOption);
      // window.addEventListener("resize", () => {
      //   carbonChart.resize();
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.pop-up {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 86.92vw;
  height: 66.94vh;
  background-color: var(--popup-bg-color);
  border: 1px solid var(--popup-border-color);
  border-radius: 4px;
  z-index: 100;
  padding: 20px;
  // background-color: var(--theme-blue);
  color: var(--theme-blue);

  .pop-up-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--popup-title-border-color);
    padding-bottom: 10px;

    .pop-up-title {
      font-size: 18px;
      color: var(--popup-title-text-color);
    }

    .close-icon {
      font-size: 18px;
      cursor: pointer;
    }
  }

  .pop-up-content {
    margin-top: 20px;

    .toolbar {
      display: flex;
      justify-content: flex-start;
      height: 2rem;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 20px;

      .chart {
        height: 200px;
      }
    }
  }
}
</style>