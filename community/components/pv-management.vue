<template>
  <view class="pv-monitor container">


    <view class="stats-box">
      <view class="stat-item">

        <view class="stat-content">
          <text class="stat-label">日最高发电量</text>
          <view>
            <text class="stat-value">{{ maxGeneration || "--" }}</text>
            <text class="stat-unit">kWh</text>
          </view>


        </view>
        <view class="vertical-divider"></view>
        <view class="stat-content">
          <text class="stat-label">出现在</text>
          <text class="stat-unit" style="color: #4488FB;font-weight: bold;">{{ maxGenerationTime || "--" }}</text>
        </view>

      </view>
      <view class="horizontal-divider"></view>
      <view class="stat-item">
        <view class="stat-content">
          <text class="stat-label">历史最高发电功率</text>
          <view>
            <text class="stat-value">{{ historyGenerationPower || "--" }}</text>
            <text class="stat-unit">kW</text>
          </view>

        </view>
        <view class="vertical-divider"></view>
        <view class="stat-content">
          <text class="stat-label">出现在</text>
          <text class="stat-unit" style="color: #4488FB;font-weight: bold;">{{ historyGenerationPowerTime || "--"
            }}</text>
        </view>


      </view>
      <view class="horizontal-divider"></view>
      <view class="stat-item">
        <view class="stat-content">
          <text class="stat-label">累计发电量</text>
          <view>
            <text class="stat-value">{{ totalGeneration || "--" }}</text>
            <text class="stat-unit">kWh</text>
          </view>

        </view>
        <view class="vertical-divider"></view>
        <view class="stat-content">
          <text class="stat-label">累计发电时长 </text>
          <view>
            <text class="stat-value" v-for="(number, index) in runningDates" :key="index"> {{ number }}</text>
            <text class="stat-unit">天</text>
          </view>

        </view>

      </view>
      <view class="horizontal-divider"></view>
      <view class="stat-item">
        <view class="stat-content">
          <text class="stat-label">当日发电量</text>
          <view>
            <text class="stat-value">{{ dailyGeneration }}</text>
            <text class="stat-unit">kWh</text>
          </view>

        </view>
        <view class="vertical-divider"></view>
        <view class="stat-content">
          <text class="stat-label">当日发电收益 </text>
          <view>
            <text class="stat-value">{{ incomeValue }}</text>
            <text class="stat-unit">元</text>
          </view>

        </view>

      </view>
    </view>



    <!-- 图表区域 -->
    <view class="chart-section">
      <!-- 发电功率曲线 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">发电功率曲线</text>

          <dy-date timeType="day" @getData="onPowerDateChange" v-model="powerDate" class="custom-picker date-picker" />
        </view>
        <view class="chart-body">
          <qiun-data-charts type="area" :chartData="providePowerData" :opts="providePowerOptions" :ontouch="true"
            :canvas2d="canvas2d" class="power-chart" />
        </view>
      </view>

      <!-- 发电量统计 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">发电量统计</text>

        </view>
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






        <!-- <view>
          <uni-segmented-control :current="dateTypeIndex" :values="['日', '月', '年']" @clickItem="handleDateTypeChange"
            class="segment-control" />
          <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate"
            class="custom-picker date-picker" />
          <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker" v-model="selectedDate"
            class="custom-picker date-picker" />
          <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate"
            class="custom-picker date-picker" />
        </view> -->
        <view class="chart-body">
          <qiun-data-charts type="column" :chartData="generationData" :opts="generationOptions" :ontouch="true"
            :canvas2d="canvas2d" class="generation-chart" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { nyzDeviceList } from '@/config/devices'
import { nyzAreaLevelId, nyzDeviceList } from '@/service/config/devices'
import upgrade from '@/api/upgrade_new'
import nyz_new from '@/api/nyz_new'
// import energy from '@/api/energy_new'
import energy_new from '@/api/energy_new'
import dyDate from '@/components/dy-Date/dy-Date.vue'; // 导入日期选择器组件
import { mapGetters } from 'vuex';
export default {
  components: {
    dyDate, // 注册日期选择器组件
  },
  name: "PV-Management",
  data: function () {
    return {

      activeChartTab: '日',
      canvas2d: this.$Config.ISCANVAS2D,
      current: "PV-Management",
      maxGeneration: "--",
      maxGenerationTime: "--",
      historyGenerationPower: "",
      historyGenerationPowerTime: "",
      totalGeneration: "",
      totalGenerationTime: "",
      type: "hour",
      dayEnergyData: {
        totalProvideQ: 0,
        totalStorageForwardQ: 0,
        totalStorageReverseQ: 0,
        totalGridForwardQ: 0,
        totalGridReverseQ: 0,
        totalConsumeElectricityQ: 0,
      },
      powerDate: new Date().toISOString().split('T')[0],

      generationOptions: {
        color: ["#6DE188"],
        padding: [15, 15, 0, 5],
        dataLabel: false,
        enableScroll: false,
        xAxis: {
          labelCount: 7,
          disableGrid: true,
          format: (val) => val.split('-')[1] + '月' + val.split('-')[2] + '日'
        },
        yAxis: {
          disabled: false,
          disableGrid: false,
          gridType: "dash",
          dashLength: 4,
          gridColor: "#F0F0F0",
          showTitle: true,
          data: [{
            position: "left",
            title: "单位:kWh"
          }],
          format: (val) => val.toFixed(1) + 'kWh'
        },
        extra: {
          column: {
            type: "group",
            width: 10,
            activeBgColor: "#1890FF",
            activeBgOpacity: 0.3,
            linearType: "custom"
          }
        }
      },


      providePowerOptions: {
        color: ["#6DE188", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 18, 0, 15],
        dataLabel: false,
        dataPointShape: false,
        enableScroll: false,
        legend: {},
        xAxis: {
          labelCount: 7,
          disableGrid: true
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          showTitle: true,
          data: [{
            position: "left",
            title: "单位:kW"
          }],
        },
        extra: {
          area: {
            type: "curve",
            width: 2,
            activeType: "hollow",
            linearType: "custom",
            gradient: true
          }
        }
      },
      generationData: {

      },
      providePowerData: {

      },

      dateTypeIndex: 0, // 当前日期类型索引 0:日 1:月 2:年
      timeTypeIndex: 0,
      selectedDate: new Date().toISOString().split('T')[0],

      incomeValue: '--',
      dailyGeneration: '--',
    }
  },
  computed: {
    runningDates() {
      const startDate = "2021-01-01";
      const diffDays = Math.floor((Date.now() - new Date(startDate)) / (1000 * 60 * 60 * 24));
      return diffDays.toString().padStart(4, '0').split('');
    },
    ...mapGetters([
      'currentSystem'
    ]),
    nyzDeviceList() {
      return this.currentSystem ? this.currentSystem.ammeterList : [];
    },
  },
  mounted() {
    this.findPhotovoltaicEnergyInfo();
    this.getNyzSolarData()
    this.getProvideCurve()
  },

  methods: {
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
      // this.dateTypeIndex = e.currentIndex;
      // this.timeTypeIndex = e.currentIndex;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');

      this.selectedDate = {
        0: currentDate.toISOString().split('T')[0],
        1: `${year}-${month}`,
        2: `${year}`
      }[this.timeTypeIndex];

      this.handleDatePicker(this.selectedDate);
    },

    switchTab(value) {
      this.dateTypeIndex = value;
      this.timeTypeIndex = value;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');

      this.selectedDate = {

        0: currentDate.toISOString().split('T')[0],
        1: `${year}-${month}`,
        2: `${year}`
      }[this.timeTypeIndex];

      this.handleDatePicker(this.selectedDate);
    },

    handleDatePicker(value) {
      const dateMap = {
        0: { dateType: 'hour', dateValue: value },
        1: { dateType: 'day', dateValue: value },
        2: { dateType: 'month', dateValue: value }
      };
      this.type = dateMap[this.dateTypeIndex].dateType;
      this.getProvideCurve()
    },

    findPhotovoltaicEnergyInfo() {
      let that = this;
      upgrade.findPhotovoltaicEnergyInfo({}).then((result) => {
        if (result && result.data) {
          that.maxGeneration = result.data.dayMaxProvideQ;
          that.maxGenerationTime = result.data.dayMaxProvideQDatetime;
          that.historyGenerationPower = result.data.maxProvidePower;
          that.historyGenerationPowerTime = result.data.maxProvidePowerDatetime;
          that.totalGeneration = result.data.totalProvideQ;
          that.totalProvideTime = result.data.totalProvideTime;
        }
      })
    },

    onPowerDateChange() {
      this.getNyzSolarData()
    },

    getNyzSolarData() {
      const sqSolarIds = [1052928, 1049269, 1049278, 1053066]
      const nyzSolarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)

      Promise.all([
        energy_new.queryStoragePowerCurve({
          deviceIdList: sqSolarIds,
          date: this.powerDate
        }).catch(err => {
          console.error(err)
        }),
        energy_new.queryStoragePowerCurve({
          deviceIdList: nyzSolarIds,
          date: this.powerDate
        }).catch(err => {
          console.error(err)
        })
      ]).then(([sqResult, nyzResult]) => {
        let timeArray = []
        let dataArray = []
        for (let h = 0; h < 24; h++) {
          for (let m = 0; m < 60; m++) {
            let formattedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
            timeArray.push(formattedTime)

            let key = `${this.powerDate} ${formattedTime}:00`
            if (nyzResult.data.hasOwnProperty(key) || sqResult.data.hasOwnProperty(key)) {
              dataArray.push(((Math.abs(nyzResult.data[key]) || 0) + ((parseFloat(sqResult.data[key]) / 1000) || 0)))
            } else {
              dataArray.push(0)
            }
          }
        }
        this.providePowerData = {
          categories: timeArray,
          series: [{
            data: dataArray,
            name: '发电功率',
          }]
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
      })
    },

    getProvideCurve() {
      this.provideQData = []
      this.provideQxAxisData = []

      if (this.type == 'hour') {
        upgrade.findDayProvideQAndPower({
          day: this.selectedDate
        }).then(result => {
          let xAxisData = Array.from([...Array(24).keys()], (v) => v)
          let chartData = Array.from([...Array(24).keys()], (v) => 0)
          result.data.provideQMap.forEach((item) => {
            chartData[item.hour] = item.provideQ
          })
          const totallyProvideQ = result.data.provideQMap.reduce((acc, cur) => {
            return acc + cur.provideQ
          }, 0);
          let solarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
          nyz_new.findEveryHourByDeviceIds({
            deviceIds: solarIds,
            day: this.selectedDate
          }).then(result => {
            result.data.map(item => {
              chartData[item.hour] = parseFloat(chartData[item.hour] + item.total_provide_q)
            })
            const totallyProvideQ1 = result.data.reduce((acc, cur) => {
              return acc + cur.total_provide_q
            }, 0);
            this.generationData = {
              categories: xAxisData,
              series: [{
                name: '发电量',
                data: chartData
              }]
            }
            this.dailyGeneration = parseFloat(totallyProvideQ + totallyProvideQ1).toFixed(2)
            this.incomeValue = (parseFloat(totallyProvideQ + totallyProvideQ1) * 0.85).toFixed(2)
          })
        }).catch(err => {
          this.generationData = {
            categories: [],
            series: [{
              name: '发电量',
              data: []
            }]
          }
        }).finally(() => {
        })
      } else if (this.type == 'day') {
        upgrade.findMonthProvideQAndPower({
          month: String(new Date(this.selectedDate).getMonth() + 1).padStart(2, '0'),
          year: new Date(this.selectedDate).getFullYear(),
        }).then(result => {
          let today = new Date(this.selectedDate)
          let days = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate()
          let xAxisData = Array.from([...Array(days).keys()], (v) => v + 1)
          let chartData = Array.from([...Array(days).keys()], (v) => "0")
          result.data.provideQMap.forEach((item) => {
            let dayIndex = String(new Date(item.day).getDate()).padStart(2, '0')
            chartData[dayIndex - 1] = item.provideQ
          })

          let solarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
          nyz_new.findEveryDayByDeviceIds({
            deviceIds: solarIds,
            year: new Date(this.selectedDate).getFullYear(),
            month: String(new Date(this.selectedDate).getMonth() + 1).padStart(2, '0')
          }).then(result => {
            result.data.map(item => {
              let dayIndex = String(new Date(item.date).getDate()).padStart(2, '0')
              chartData[dayIndex - 1] = parseFloat(chartData[dayIndex - 1] + item.total_provide_q)
            })
            this.generationOptions.extra.column.width = 5;
            this.generationData = {
              categories: xAxisData,
              series: [{
                name: '发电量',
                data: chartData
              }]
            }
          })
        }).catch(err => {
          this.generationData = {
            categories: [],
            series: [{
              name: '发电量',
              data: []
            }]
          }
        }).finally(() => {
        })
      } else if (this.type == 'month') {
        upgrade.findYearProvideQAndPower({
          year: new Date(this.selectedDate).getFullYear(),
        }).then(result => {
          let xAxisData = Array.from([...Array(12).keys()], (v) => v + 1)
          let chartData = Array.from([...Array(12).keys()], (v) => "--")
          result.data.provideQMap.forEach((item) => {
            chartData[item.month - 1] = item.provideQ
          })

          let solarIds = this.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
          nyz_new.findEveryMonthByDeviceIds({
            deviceIds: solarIds,
            year: new Date(this.selectedDate).getFullYear()
          }).then(result => {
            result.data.map(item => {
              chartData[item.month - 1] = parseFloat(chartData[item.month - 1] + item.total_provide_q)
            })
            this.generationData = {
              categories: xAxisData,
              series: [{
                name: '发电量',
                data: chartData
              }]
            }
          }).finally(() => {
          })
        }).catch(err => {
          this.generationData = {
            categories: [],
            series: [{
              name: '发电量',
              data: []
            }]
          }
        }).finally(() => {
        })
      }
    },
    findDayProvideQAndPower() {
      this.provideQData = [];
      this.provideQxAxisData = [];
      let providePowerData = [];
      this.providePowerxAxisData = [];
      upgrade.findDayProvideQAndPower({
        day: this.selectedDate
      }).then((result) => {
        if (result && result.data) {
          result.data.provideQMap.forEach((item) => {
            this.provideQData.push(item.provideQ);
            this.provideQxAxisData.push(item.hour)
          });
          result.data.providePowerMap.forEach((item) => {
            providePowerData.push(item.power);
            this.providePowerxAxisData.push(item.hour)
          })
          this.generationData = {
            categories: this.provideQxAxisData,
            series: [{
              name: '发电量',
              data: this.provideQData,
              type: 'line'
            }]
          }

          this.providePowerData = {
            categories: this.providePowerxAxisData,
            series: [{
              name: '发电功率',
              data: providePowerData,
            }]
          }
        }
      })
    },
    findMonthProvideQAndPower() {
      this.provideQData = [];
      this.provideQxAxisData = [];
      providePowerData = [];
      this.providePowerxAxisData = [];
      upgrade.findMonthProvideQAndPower({
        month: String(new Date(this.selectedDate).getMonth() + 1).padStart(2, '0'),
        year: new Date(this.selectedDate).getFullYear(),
      }).then((result) => {
        if (result && result.data) {
          result.data.provideQMap.forEach((item) => {
            this.provideQData.push(item.provideQ);
            this.provideQxAxisData.push(item.day)
          });
          result.data.providePowerMap.forEach((item) => {
            providePowerData.push(item.power);
            this.providePowerxAxisData.push(item.day)
          })
          this.generationData = {
            categories: this.provideQxAxisData,
            series: [{
              name: '发电量',
              data: this.provideQData
            }]
          }

          this.providePowerData = {
            categories: this.providePowerxAxisData,
            series: [{
              name: '功率',
              data: providePowerData
            }]
          }
        }
      })
    },
    findYearProvideQAndPower() {
      this.provideQData = [];
      this.provideQxAxisData = [];
      let providePowerData = [];
      this.providePowerxAxisData = [];
      upgrade.findYearProvideQAndPower({
        year: this.selectedDate,
      }).then((result) => {
        if (result && result.data) {
          result.data.provideQMap.forEach((item) => {
            this.provideQData.push(item.provideQ);
            this.provideQxAxisData.push(item.month)
          });
          result.data.providePowerMap.forEach((item) => {
            providePowerData.push(item.power);
            this.providePowerxAxisData.push(item.month)
          })
          this.generationData = {
            categories: Array.from([...this.provideQxAxisData.values()], (v) => v + "月"),
            series: [{
              name: '发电量',
              data: this.provideQData
            }]
          }

          this.providePowerData = {
            categories: this.providePowerxAxisData,
            series: [{
              name: '功率',
              data: providePowerData
            }]
          }
        }
      })
    },
  }
}
</script>







<style scoped>
/* 基础样式 */
.container {
  /* padding: 32rpx; */
  /* background-color: #f5f7fa; */
}

.pv-monitor {
  padding: 10rpx;
  /* background-color: #fff; */
}

.vertical-divider {
  width: 1px;
  height: 40px;
  background-color: #e8e8e8;
  margin: 0 12px;
  align-self: center;
}


.horizontal-divider {
  height: 1px;
  width: 100%;
  background-color: #e8e8e8;
  /* margin: 12px 0; */
}


.stats-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
  background: #fff;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 10rpx;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  /* padding: 12px; */
  /* background: #f8f9fa; */
  /* border-radius: 8px; */
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%
}

.stat-label {
  font-size: 14px;
  color: #1a1a1a;
  margin-bottom: 4px;
  /* font-weight: 600 */
}

.stat-value {
  font-size: 18px;

  font-weight: bold;
  color: #4488FB;
}

.stat-unit {
  font-size: 12px;
  color: #1a1a1a;
  margin-left: 4px;
}




/* 图表区域 */
/* .chart-section {
  margin-bottom: 40rpx;
} */

.chart-card {
  background-color: #ffffff;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 10rpx;
  overflow: hidden;
}

.chart-header {
  padding: 12rpx 32rpx;
  border-bottom: 1rpx solid #f0f4ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
  min-width: fit-content
}



.chart-tabs {
  display: flex;
  /* gap: 24rpx; */
}




.chart-tab-bar {

  display: flex;
  justify-content: space-around;
  margin-top: 12rpx;
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







/* 时间选择器样式 */
.custom-picker {
  border: unset;
  max-width: fit-content;
  border-radius: 16rpx;
  /* padding: 16rpx 24rpx;
  margin-top: 20rpx; */
  background: rgba(255, 255, 255, 0.9);
}

.chart-body {
  padding: 12rpx;
}

.power-chart,
.generation-chart {
  width: 100%;
  height: 480rpx;
}

/* 响应式调整 */
@media screen and (min-width: 768px) {
  .stat-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .power-chart,
  .generation-chart {
    height: 560rpx;
  }
}

@media screen and (orientation: landscape) {
  .container {
    /* padding: 40rpx; */
  }

  .stat-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .chart-card {
    min-height: 600rpx;
  }

  .power-chart,
  .generation-chart {
    height: 640rpx;
  }
}
</style>