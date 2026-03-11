<template>
  <view class="economic-analysis-page">


    <view class="chart-tab-bar">
      <view class="chart-tabs">
        <view v-for="(tab, i) in ['日', '月', '年']" :key="i"
          :class="['chart-tab-item', { active: activeChartTab === tab }]" @click="handleDateTypeChange(tab)" :style="{
            backgroundColor: activeChartTab === tab ? '#4488FB' : 'white',
            color: activeChartTab === tab ? 'white' : '#4488FB'
          }">
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

    <!-- 电力因子区域 -->
    <view class="card-container">
      <view class="chart-header">
        <text class="chart-title">峰平谷电价及响应收益</text>
        <view class="divider-line"></view>
      </view>
      <view class="card-header">
        <!-- <text class="card-title">(电力因子)</text> -->
        <view class="card-stats">
          <view class="stat-item">
            <text class="stat-label">峰平谷运行总次数</text>
            <text class="stat-value">{{ overviewData.totalPeakFlatValleyRunningTimes }}</text>
          </view>
          <view class="divider-vertical"></view>
          <view class="stat-item">
            <text class="stat-label">总收益</text>
            <text class="stat-value">{{ overviewData.totalPeakFlatValleyIncome }}</text>
            <text class="stat-unit">元</text>
          </view>
        </view>
      </view>


      <!-- 图表区域 -->
      <view class="chart-area">

        <view class="chart-wrapper">
          <!-- <v-chart id="peak-valley-chart" :options="peakValleyOptions" autoresize class="echart"></v-chart> -->
          <qiun-data-charts type="mix" :chartId="'peak-valley-chart'" :chartData="peakValleyData" :opts="peakOptions"
            :ontouch="true" :canvas2d="canvas2d"></qiun-data-charts>
        </view>
      </view>
    </view>

    <!-- 碳排放因子区域 -->
    <view class="card-container">
      <view class="chart-header">
        <text class="chart-title">碳因子响应收益</text>
        <view class="divider-line"></view>
      </view>
      <view class="card-header">
        <!-- <text class="card-title">(动态碳排放责任因子)</text> -->
        <view class="card-stats">
          <view class="stat-item">
            <text class="stat-label">碳因子响应总次数</text>
            <text class="stat-value">{{ overviewData.totalCarbonEmissionFactorResponseTimes }}</text>
          </view>
          <view class="divider-vertical"></view>
          <view class="stat-item">
            <text class="stat-label">总收益</text>
            <text class="stat-value">{{ overviewData.totalCarbonEmissionFactorIncome }}</text>
            <text class="stat-unit">元</text>
          </view>
        </view>
      </view>

      <!-- 图表区域 -->
      <view class="chart-area">

        <view class="chart-wrapper">
          <!-- <v-chart id="carbon-factor-chart" :options="carbonFactorOptions" autoresize class="echart"></v-chart> -->
          <qiun-data-charts type="column" :chartId="'carbon-factor-chart'" :chartData="carbonFactorData"
            :opts="chartOptions" :ontouch="true" :canvas2d="canvas2d"></qiun-data-charts>
        </view>
      </view>
    </view>

    <!-- 电力需求响应区域 -->
    <view class="card-container">
      <view class="chart-header">
        <text class="chart-title">需求侧响应收益</text>
        <view class="divider-line"></view>
      </view>
      <view class="card-header">
        <view class="card-stats">
          <view class="stat-item">
            <text class="stat-label">需求响应总次数</text>
            <text class="stat-value">{{ overviewData.totalPowerFactorResponseTimes }}</text>
          </view>
          <view class="divider-vertical"></view>
          <view class="stat-item">
            <text class="stat-label">总收益</text>
            <text class="stat-value">{{ overviewData.totalPowerFactorIncome }}</text>
            <text class="stat-unit">元</text>
          </view>
        </view>
      </view>

      <!-- 图表区域 -->
      <view class="chart-area">

        <view class="chart-wrapper">
          <!-- <v-chart id="power-demand-chart" :options="electricityFactorOptions" autoresize class="echart"></v-chart> -->
          <qiun-data-charts type="column" :chartId="'power-demand-chart'" :chartData="electricityFactorData"
            :opts="chartOptions" :ontouch="true" :canvas2d="canvas2d"></qiun-data-charts>
        </view>
      </view>
    </view>

    <!-- 分析建议区域 -->
    <view class="advice-container">
      <view class="advice-title">经济运行分析建议</view>
      <view class="advice-list">
        <view class="advice-item" v-for="(item, index) in adviceList" :key="index">
          <text class="advice-text">{{ item }}</text>
        </view>
      </view>
      <!-- <view class="config-link" @click="routerToConfig">
        <text class="link-text">点此打开配置页面进行参数配置</text>
        <text class="link-arrow">→</text>
      </view> -->
    </view>
  </view>
</template>

<script>
import {
  getSocketinstance
} from "@/service/websocket";
import energy from '@/api/energy_new'
import dyDate from '@/components/dy-Date/dy-Date.vue'; // 导入日期选择器组件
export default {
  components: {
    dyDate, // 注册日期选择器组件
  },
  name: "economic-analysis",
  data: function () {

    return {
      activeChartTab: '日',
      canvas2d: this.$Config.ISCANVAS2D,
      current: "economic-analysis",
      // 概览数据
      overviewData: {
        totalPeakFlatValleyRunningTimes: 0,
        totalPeakFlatValleyIncome: 0,
        totalCarbonEmissionFactorResponseTimes: 0,
        totalCarbonEmissionFactorIncome: 0,
        totalPowerFactorResponseTimes: 0,
        totalPowerFactorIncome: 0
      },
      peakOptions: {
        dataLabel: false,
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 15, 0, 15],
        enableScroll: false,
        legend: {},
        xAxis: {
          disableGrid: true,
          labelCount: 6
          // title: "单位：年"
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
              title: "电价",
              fontSize: 10
            },
            {
              position: "right",
              title: "收益",
              textAlign: "left",
              fontSize: 10
            },
            {
              position: "right",
              title: "电量",
              textAlign: "left",
              fontSize: 10
            },


          ]
        },
        extra: {
          mix: {
            column: {
              width: 2
            },
            line: {
              type: "step",
              width: 2,
              activeType: "hollow"
            }
          }
        }

      },
      // 日期选择
      // 图表配置
      chartOptions: {
        dataLabel: false,
        padding: [15, 18, 0, 15],
        xAxis: {
          labelCount: 6,
          disableGrid: true
        },
        yAxis: {
          data: [
            {
              position: "left",
              title: "单位:元",
              tofix: 0
            }]
        },
        extra: {
          column: {
            type: "group",
            width: 5,
            activeBgColor: "#000000",
            activeBgOpacity: 0.08
          }
        }
      },
      selectedDateType: 'hour',


      peakValleyData: {

      },
      carbonFactorData: {},
      electricityFactorData: {

      },

      // 分析建议
      adviceList: [
        '经济运行分析建议：当前运行模式没有按照峰平谷进行响应,按照峰平谷响应可以获取***经济效益',
        '在EMS触摸屏的运行配置页面可进行峰平谷电价设置等以获取经济效益'
      ],
      dateTypeIndex: 0, // 当前日期类型索引 0:日 1:月 2:年
      timeTypeIndex: 0,
      selectedDate: new Date().toISOString().split('T')[0],
    }
  },
  mounted() {
    this.initAPIData()
    this.getNyzRealTimeData()
  },

  methods: {

    async initAPIData() {
      let result = await energy.findPeakFlatValleyElectrovalenceAndIncome(this.selectedDateType, this.selectedDate)
      this.getPeakFlatValleyElectrovalenceAndIncome(result)
      this.getCarbonEmissionFactorIncome(result)
      this.getPowerFactorIncome(result)
    },
    // 跳转配置页面
    handleDateTypeChange(e) {

      this.activeChartTab = e;
      if (e === '日') {
        this.dateTypeIndex = 0;
        this.timeTypeIndex = 0;
      } else if (e === '月') {
        this.dateTypeIndex = 1;
        this.timeTypeIndex = 1;
      } else if (e === '年') {
        this.dateTypeIndex = 2;
        this.timeTypeIndex = 2;
      }
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');

      // 动态更新默认日期
      this.selectedDate = {
        0: currentDate.toISOString().split('T')[0],
        1: `${year}-${month}`,
        2: `${year}`
      }[this.timeTypeIndex];
      this.handleDatePicker(this.selectedDate);
      // this.loadChartData();
    },

    handleDatePicker(value) {
      // 统一处理日期格式
      const dateMap = {
        0: { // 日模式
          dateType: 'hour',
          dateValue: value
        },
        1: { // 月模式
          dateType: 'day',
          dateValue: value
        },
        2: { // 年模式
          dateType: 'month',
          dateValue: value
        }
      };
      this.selectedDateType = dateMap[this.dateTypeIndex]
      this.initAPIData()

    },



    // 能源站实时数据
    getNyzRealTimeData() {
      getSocketinstance().socket2.emit("register")
      getSocketinstance().socket2.on("nyzData", (jsonData) => {
        const {
          deviceType,
          address,
          dataType,
          data
        } = jsonData
        switch (deviceType) {
          case "1710_V1_1":
            if (address == "04" && dataType == "2") {
              this.overviewData.totalPeakFlatValleyRunningTimes = parseFloat(data.B120)
              this.overviewData.totalPeakFlatValleyIncome = Math.abs(parseFloat(data.B122))
              this.overviewData.totalCarbonEmissionFactorResponseTimes = parseFloat(data.B134)
              this.overviewData.totalCarbonEmissionFactorIncome = parseFloat(data.B136)
              this.overviewData.totalPowerFactorResponseTimes = parseFloat(data.B144)
              this.overviewData.totalPowerFactorIncome = parseFloat(data.B146)
            }
            break;
          default:
            break;
        }
      })
    },



    // 优化：数据采样函数 - 解决大数据量加载慢的问题
    sampleData(data, maxPoints = 100) {
      if (data.length <= maxPoints) return data;

      const step = Math.ceil(data.length / maxPoints);
      return data.filter((_, index) => index % step === 0);
    },

    // 获取峰平谷电价及运行收益（优化版）


    async getPeakFlatValleyElectrovalenceAndIncome(result1) {
      try {
        const storageIds = [3353090, 3353091];
        const resultDay = await energy.findEveryHourByDeviceIds({
          deviceIds: storageIds,
          day: this.$moment(this.peakValleyDate).format("YYYY-MM-DD"),
        })
        if (resultDay.data) {
          let price, income, consumQ, xAxis
          price = resultDay.data.map(item => (item.ele_price).toFixed(2))
          income = resultDay.data.map(item => (item.storage_reverse_profit + (-item.storage_forwar_profit)).toFixed(2))
          consumQ = resultDay.data.map(item => (item.total_storage_reverse_q + (-item.total_storage_forward_q)).toFixed(2))
          xAxis = Array.from({ length: 24 }, (x, i) => `${i}h`)
          // this.fengpingguOptions.setChartData({
          //   xAxis: xAxis,
          //   series0: income,
          //   series1: consumQ,
          //   series2: price
          // })

          this.peakValleyData = {
            categories: xAxis,
            series: [{
              name: '电价',
              data: price,
              // type: 'bar',
              type: "line",
              style: "step",
            },
            {
              name: '收益',
              data: income,
              index: 1,
              type: "column",
              // style: "curve",
            },
            {
              name: '电量',
              data: consumQ,
              index: 2,
              type: "column",
              // style: "curve",
            }
            ]
          }
          // --- 合并相同电价的逻辑 ---
          const rawPriceData = resultDay.data;
          const mergedPriceSteps = [];
          let currentGroup = {
            startHour: rawPriceData[0].hour,
            endHour: rawPriceData[0].hour,
            price: parseFloat(rawPriceData[0].ele_price).toFixed(2)
          };

          for (let i = 1; i < rawPriceData.length; i++) {
            const currentPrice = parseFloat(rawPriceData[i].ele_price).toFixed(2);
            if (currentPrice === currentGroup.price) {
              currentGroup.endHour = rawPriceData[i].hour;
            } else {
              mergedPriceSteps.push(currentGroup);
              currentGroup = {
                startHour: rawPriceData[i].hour,
                endHour: rawPriceData[i].hour,
                price: currentPrice
              };
            }
          }
          mergedPriceSteps.push(currentGroup); // 推入最后一个分组
          this.priceSteps = mergedPriceSteps;
          //更新当前激活的步骤 ---
          const currentHour = new Date().getHours();
          const activeIndex = this.priceSteps.findIndex(step =>
            currentHour >= step.startHour && currentHour <= step.endHour
          );
          this.currentPriceStep = activeIndex !== -1 ? activeIndex : 0;
        }

        return

        const result = await energy.findPeakFlatValleyElectrovalenceAndIncome(this.peakValleyDateType, this.peakValleyDate)
        this.peakValleyOptions.series[0].data = []
        this.peakValleyOptions.series[1].data = []
        if (result.data) {
          const arrLength = {
            'hour': 24,
            'day': this.getDaysInMonth(),
            'month': 12
          }
          // const xAxis = Array.from({ length: arrLength[this.peakValleyDateType] }, (x, i) => i)
          let electrovalence, income, xAxis
          // const fields = Object.keys(result.data.electrovalenceMap)
          electrovalence = result.data.map(item => item.peakValleyElectricityPrice)
          income = result.data.map(item => item.operatingRevenue)
          // if (this.peakValleyDateType == "hour") {
          //     xAxis = result.data.map(item => item.hour)
          // } else {
          //     xAxis = Array.from({ length: arrLength[this.peakValleyDateType] }, (x, i) => i)
          // }
          if (this.peakValleyDateType == "hour") {
            xAxis = Array.from({ length: arrLength[this.peakValleyDateType] }, (x, i) => `${i}时`)
          } else if (this.peakValleyDateType == "day") {
            xAxis = Array.from({ length: arrLength[this.peakValleyDateType] }, (x, i) => `${i + 1}日`)
          } else if (this.peakValleyDateType == "month") {
            xAxis = Array.from({ length: arrLength[this.peakValleyDateType] }, (x, i) => `${i + 1}月`)
          }

          this.peakValleyOptions.setChartData({ xAxis: xAxis, series0: income, series1: electrovalence })
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 获取碳排因子响应收益（优化版）
    async getCarbonEmissionFactorIncome(result) {
      try {
        // const result = await energy.findPeakFlatValleyElectrovalenceAndIncome(this.selectedDateType, this.selectedDate)
        // this.carbonFactorOptions.series[0].data = []

        if (result.data) {
          const arrLength = {
            'hour': 24,
            'day': this.getDaysInMonth(),
            'month': 12
          }

          // let carbonFactor
          // carbonFactor = result.data.map(item => item.totalCarbonEmissionFactorResponseRevenue)

          // const xAxis = Array.from({ length: arrLength[this.selectedDateType] }, (x, i) => i)

          // 优化：数据采样
          // const sampledCarbonFactor = this.sampleData(carbonFactor)
          // const sampledXAxis = this.sampleData(xAxis, sampledCarbonFactor.length)

          // this.carbonFactorOptions.setChartData({
          //   xAxis: sampledXAxis,
          //   series0: sampledCarbonFactor
          // })


        }


        if (result.data) {
          const arrLength = {
            'hour': 24,
            'day': this.getDaysInMonth(),
            'month': 12
          }
          // const xAxis = Array.from({ length: arrLength[this.selectedDateType] }, (x, i) => i)
          let carbonFactor, xAxis
          // const fields = Object.keys(result.data.carbonEmissionFactorIncomeMap)
          carbonFactor = result.data.map(item => item.totalCarbonEmissionFactorResponseRevenue)
          if (this.selectedDateType == "hour") {
            xAxis = Array.from({ length: arrLength[this.selectedDateType] }, (x, i) => `${i}时`)
          } else if (this.selectedDateType == "day") {
            xAxis = Array.from({ length: arrLength[this.selectedDateType] }, (x, i) => `${i + 1}日`)
          } else if (this.selectedDateType == "month") {
            xAxis = Array.from({ length: arrLength[this.selectedDateType] }, (x, i) => `${i + 1}月`)
          }
          // this.carbonFactorOptions.setChartData({ xAxis: xAxis })
          this.carbonFactorData = {
            categories: xAxis,
            series: [{
              name: '碳因子响应收益',
              data: [0, 0, 0, 0, 0, 0.28, 1.1, 2.6, 4.2, 5.3, 5.79, 3.4, 4.3, 1.68, 0.64, 0.71, 0.68, 0.43, 0, 0, 0, 0, 0, 0],
              type: 'bar',
            }]
          }
          // this.carbonFactorOptions.setChartData({ xAxis: xAxis, series0: carbonFactor })
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 获取电力响应收益（优化版）
    async getPowerFactorIncome(result) {
      try {
        // const result = await energy.findPeakFlatValleyElectrovalenceAndIncome(this.selectedDateType, this.selectedDate)
        // this.electricityFactorOptions.series[0].data = []

        if (result.data) {


          const arrLength = {
            'hour': 24,
            'day': this.getDaysInMonth(),
            'month': 12
          }
          // const xAxis = Array.from({ length: arrLength[this.selectedDateType] }, (x, i) => i)
          let electricityFactor, xAxis
          // const fields = Object.keys(result.data.electrovalenceMap)
          electricityFactor = result.data.map(item => item.totalPowerFactorResponseGain)
          if (this.selectedDateType == "hour") {
            xAxis = Array.from({ length: arrLength[this.selectedDateType] }, (x, i) => `${i}时`)
          } else if (this.selectedDateType == "day") {
            xAxis = Array.from({ length: arrLength[this.selectedDateType] }, (x, i) => `${i + 1}日`)
          } else if (this.selectedDateType == "month") {
            xAxis = Array.from({ length: arrLength[this.selectedDateType] }, (x, i) => `${i + 1}月`)
          }

          this.electricityFactorData = {
            categories: xAxis,
            series: [{
              name: '需求侧响应收益',
              data: [0, 0, 0, 0, 0, 0.28, 1.1, 2.6, 4.2, 5.3, 5.79, 3.4, 4.3, 1.68, 0.64, 0.71, 0.68, 0.43, 0, 0, 0, 0, 0, 0],
              type: 'bar',
            }]
          }
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 获取本月最大天数
    getDaysInMonth() {
      const today = new Date()
      const days = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate()
      return days
    }
  }
}
</script>

<style lang="scss" scoped>
/* 页面整体样式 */
.economic-analysis-page {
  // background-color: #FFF;
  min-height: 100vh;
  /* padding: 20rpx; */
}


.stats-card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 15px 0;
  margin-bottom: unset;
}

.stats-item {
  width: 33%;
  text-align: center;
  /* margin-bottom: 10px; */
  padding: 10px 0;
  background-color: #fff;
  border-radius: 8px;
}

.stats-img {
  background-image: url('../static/images/img.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.stats-value {
  font-size: 16px;
  font-weight: bold;
  color: #1E88E5;
}

.stats-unit {
  font-size: 12px;
  color: #999;
  display: block;
}

.stats-desc {
  font-size: 12px;
  color: #666;
  display: block;
  margin-top: 2px;
}

.stat-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10rpx 0
}


/* 卡片容器 */
.card-container {
  background-color: white;
  // border-radius: 16rpx;
  // box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  // margin-bottom: 20rpx;
  padding: 20rpx 0;
  margin:10rpx 0;
}

/* 卡片头部 */
.card-header {
  margin-bottom: 20rpx;
  padding: 0 20rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

/* 统计项 */
.card-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.stat-item {
  width: 48%;
  display: flex;
  justify-content: space-around;
}

.stat-label {
  font-size: 30rpx;
  color: #666;
  display: block;
  /* margin-bottom: 8rpx; */
}

.stat-value {
  font-size: 30rpx;
  font-weight: bold;
  color: #4488FB;
}

.stat-unit {
  font-size: 24rpx;
  color: #666;
}

/* 日期选择器 */
.chart-tab-bar {

  display: flex;
  justify-content: space-between;
  padding: 10rpx;
  background: #fff;
  align-items: center;
}


.chart-tabs {
  display: flex;
  /* gap: 24rpx; */
}

.chart-tab-item {
  padding: 12rpx 32rpx;
  margin: 0 2rpx;
  border: 1px solid #4488FB;
  color: #666;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  width: 120rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-tab-item.active {
  background: linear-gradient(135deg, #4488fb 0%, #6ca2ff 100%);
  color: #fff !important;
  box-shadow: 0 4rpx 12rpx rgba(68, 136, 251, 0.3);
}

.custom-date-picker {
  width: 100%;
}

/* 图表区域 */
.chart-area {
  margin-top: 20rpx;
}

.chart-header {
  margin-bottom: 16rpx;
  padding: 0 20rpx;
}

.chart-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.divider-line {
  height: 1px;
  background-color: #e4e7ed;
  margin: 12rpx 0;
  width: 100%;
}

.divider-vertical {
  width: 1px;
  background-color: #e4e7ed;
  // margin: 0 32rpx;
  // height: 60%;
  // align-self: center;
}

.chart-wrapper {
  width: 100%;
  height: 400rpx;
  position: relative;
}

.echart {
  width: 100%;
  height: 100%;
}

/* 分析建议区域 */
.advice-container {
  background-color: white;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  padding: 24rpx;
}

.advice-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.advice-list {
  margin-bottom: 20rpx;
}

.advice-item {
  margin-bottom: 12rpx;
}

.advice-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

.config-link {
  display: flex;
  align-items: center;
  color: #3A7BD5;
  font-size: 24rpx;
  cursor: pointer;
}

.link-text {
  margin-right: 8rpx;
}

.link-arrow {
  font-size: 20rpx;
}

.custom-picker{
  border:unset;
  max-width:fit-content;
  min-width:fit-content
}
</style>