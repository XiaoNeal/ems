<template>
  <view class="container">


    <view class="status-container">
      <!-- <view class="status-card"> -->
      <!-- <view class="status-header">
          <image class="battery-icon"
            src="https://serviceiems.gree.com/communitythree/img/%E5%82%A8%E8%83%BD.48da49d1.png" />
          <text class="status-title">储能系统实时状态</text>
        </view> -->

      <view class="status-content">
        <view class="status-indicator">
          <image class="battery-icon" src="../static/images/img-storage.png" />
          <text class="status-tag" :class="statusClass">{{ nyzRealTimeData.status }}</text>
          <view class="soc-progress-container">
            <text class="soc-label">SOC {{ totalStorageData.soc }}%</text>
            <view class="soc-progress">
              <view class="progress-track">
                <view class="progress-fill" :style="{
                  width: `${totalStorageData.soc}%`,
                  background: statusGradient,
                  animation: 'progressGrow 0.8s ease-out'
                }"></view>
              </view>
              <view class="soc-labels">
                <text>0%</text>
                <text>100%</text>
              </view>
            </view>
          </view>
        </view>

        <view class="ratio-container">
          <qiun-data-charts type="arcbar" :opts="optimizedChartOptions" :chartData="chartRatioData" :ontouch="true"
            :canvas2d="canvas2d" class="efficiency-chart" />
        </view>
      </view>
      <!-- </view> -->
    </view>


    <view class="stats-box">
      <view class="stat-item">

        <view class="stat-content">
          <text class="stat-label">日最高发电量</text>
          <view>
            <text class="stat-value">{{ dayMaxChargeQ || "--" }}</text>
            <text class="stat-unit">kWh</text>
          </view>


        </view>
        <view class="stat-content">
          <text class="stat-label">出现在</text>
          <text class="stat-unit">{{ dayMaxChargeQTime || "--" }}</text>
        </view>

      </view>
      <view class="stat-item">
        <view class="stat-content">
          <text class="stat-label">历史最高充电功率</text>
          <view>
            <text class="stat-value">{{ hisMaxChargePower || "--" }}</text>
            <text class="stat-unit">kW</text>
          </view>

        </view>
        <view class="stat-content">
          <text class="stat-label">出现在</text>
          <text class="stat-unit">{{ hisMaxChargePowerTime || "--" }}</text>
        </view>


      </view>
      <view class="stat-item">
        <view class="stat-content">
          <text class="stat-label">日最高放电量</text>
          <view>
            <text class="stat-value">{{ dayMaxDischargeQ || "--" }}</text>
            <text class="stat-unit">kW</text>
          </view>

        </view>
        <view class="stat-content">
          <text class="stat-label">出现在</text>
          <text class="stat-unit">{{ dayMaxDischargeQTime || "--" }}</text>
        </view>


      </view>
      <view class="stat-item">
        <view class="stat-content">
          <text class="stat-label">历史最高放电功率</text>
          <view>
            <text class="stat-value">{{ hisMaxDischargePower || "--" }}</text>
            <text class="stat-unit">kW</text>
          </view>

        </view>
        <view class="stat-content">
          <text class="stat-label">出现在</text>
          <text class="stat-unit">{{ hisMaxDischargePowerTime || "--" }}</text>
        </view>


      </view>
    </view>



    <!-- <view class="stats-grid">


      <view class="stat-item card-gradient" data-type="charge">
        <view class="card-header">
          <text class="stat-label"><text class="iconfont icon-charge"></text> 日最高充电量</text>
        </view>
        <view class="value-group">
          <text class="value accent-blue">{{ dayMaxChargeQ || "--" }}</text>
          <text class="unit">kWh</text>
        </view>
        <view class="meta-info">
          <text class="meta-label">峰值时间</text>
          <text class="meta-value">{{ dayMaxChargeQTime || "--" }}</text>
        </view>
      </view>


      <view class="stat-item card-gradient" data-type="charge-power">
        <view class="card-header">
          <text class="stat-label"><text class="iconfont icon-power"></text> 历史最高充电功率</text>
        </view>
        <view class="value-group">
          <text class="value accent-green">{{ hisMaxChargePower || "--" }}</text>
          <text class="unit">kW</text>
        </view>
        <view class="meta-info">
          <text class="meta-label">记录时间</text>
          <text class="meta-value">{{ hisMaxChargePowerTime || "--" }}</text>
        </view>
      </view>



      <view class="stat-item card-gradient" data-type="discharge">
        <view class="card-header">
          <text class="stat-label"><text class="iconfont icon-discharge"></text> 日最高放电量</text>
        </view>
        <view class="value-group">
          <text class="value accent-orange">{{ dayMaxDischargeQ || "--" }}</text>
          <text class="unit">kWh</text>
        </view>
        <view class="meta-info">
          <text class="meta-label">出现时间</text>
          <text class="meta-value">{{ dayMaxDischargeQTime || "--" }}</text>
        </view>
      </view>


      <view class="stat-item card-gradient" data-type="discharge-power">
        <view class="card-header">
          <text class="stat-label"><text class="iconfont icon-discharge-power"></text> 历史最高放电功率</text>
        </view>
        <view class="value-group">
          <text class="value accent-red">{{ hisMaxDischargePower || "--" }}</text>
          <text class="unit">kW</text>
        </view>
        <view class="meta-info">
          <text class="meta-label">记录时间</text>
          <text class="meta-value">{{ hisMaxDischargePowerTime || "--" }}</text>
        </view>
      </view>

    </view> -->
    <view class="charts-content">
      <view class="chart-container">
        <view class="power-chart card">
          <view class="chart-header">
            <text class="chart-title">充放电功率曲线</text>
            <view class="date-picker-wrapper">
              <dy-date timeType="day" @getData="onPowerDateChange" v-model="powerDate" class="compact-date-picker" />
            </view>
          </view>
          <qiun-data-charts type="line" :chartData="storageChartData" :opts="storagePowerOptions" canvasId="electricity"
            class="chart-view" :ontouch="true" :canvas2d="canvas2d" />
        </view>

        <view class="capacity-chart card">
          <view class="chart-header" style="display:flex;flex-direction:column;align-items: unset;">
            <text class="chart-title">充放电量/放电达成率</text>
            <!-- <view class="date-controls">
              <uni-segmented-control :current="dateTypeIndex" :values="['日', '月', '年']"
                @clickItem="handleDateTypeChange" class="segmented-control" />
              <view class="date-picker-group">
                <dy-date v-if="timeTypeIndex === 0" timeType="day" @getData="handleDatePicker" v-model="selectedDate"
                  class="dynamic-date-picker" />
                <dy-date v-else-if="timeTypeIndex === 1" timeType="month" @getData="handleDatePicker"
                  v-model="selectedDate" class="dynamic-date-picker" />
                <dy-date v-else timeType="year" @getData="handleDatePicker" v-model="selectedDate"
                  class="dynamic-date-picker" />
              </view>
            </view> -->
          </view>
          <view class="chart-tab-bar">
            <view class="chart-tabs">
              <view v-for="(tab, i) in ['日', '月', '年']" :key="i"
                :class="['chart-tab-item', { active: activeChartTab === tab }]" @click="handleDateTypeChange(tab)"
                :style="{
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

          <qiun-data-charts type="column" :chartData="storageQData" :opts="storageQOptions" canvasId="storageQ-chart"
            class="chart-view" :ontouch="true" :canvas2d="canvas2d" />
        </view>
      </view>
    </view>


  </view>
</template>

<script>

// import { getSocketinstance } from '@/service/websocket'
import {
  getSocketinstance
} from "@/service/websocket";
import upgrade from '@/api/upgrade_new'
import nyz_new from '@/api/nyz_new'
import dyDate from '@/components/dy-Date/dy-Date.vue'; // 导入日期选择器组件
import nyz from '@/api/nyz'
import energy_new from '@/api/energy_new'
import { mapGetters } from 'vuex';
export default {
  components: {
    dyDate, // 注册日期选择器组件
  },
  name: "Storage-Management",
  data: function () {
    return {
      activeChartTab: '日',
      canvas2d: this.$Config.ISCANVAS2D,
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
      type: "hour",
      percent: 80,
      // date: new Date(),
      // month: new Date(),
      // year: new Date(),

      // 充放电功率曲线日期
      powerDate: new Date().toISOString().split('T')[0],
      // 能源站功率
      nyzRealTimeData: {
        status: '--',
        storagePower1: 0,
        storagePower2: 0,
        soc: 0,
        charge1: 0,
        charge2: 0,
        discharge1: 0,
        discharge2: 0
      },
      progress: 0, // 初始进度值
      chartRatioData: {

      },
      optimizedChartOptions: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: undefined,
        title: {
          name: "--%",
          fontSize: 15,
          color: "#2fc25b"
        },
        subtitle: {
          name: "充放电比",
          fontSize: 12,
          color: "#666666"
        },
        extra: {
          arcbar: {
            type: "default",
            width: 12,
            backgroundColor: "#E9E9E9",
            startAngle: 0.75,
            endAngle: 0.25,
            gap: 2,
            linearType: "custom"
          }
        }
      },
      storagePowerOptions: {
        dataLabel: false,
        padding: [15, 20, 0, 15],
        dataPointShape: false,
        enableScroll: false,
        legend: {},
        xAxis: {
          labelCount: 6,
          disableGrid: true
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          showTitle: true,
          data: [{
            position: "left",
            title: "单位:kWh"
          }],
        },
        extra: {
          line: {
            type: "curve",
            width: 2,
            activeType: "hollow",
            linearType: "custom"
          }
        }
      },
      storageChartData: {

      },

      storageQOptions: {
        dataLabel: false,
        padding: [15, 20, 0, 15],
        xAxis: {
          disableGrid: true,
          labelCount: 6,
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2
        },
      },
      storageQData: {


      },
      dateTypeIndex: 0, // 当前日期类型索引 0:日 1:月 2:年
      timeTypeIndex: 0,
      selectedDate: new Date().toISOString().split('T')[0],

    }
  },



  computed: {
    ...mapGetters([
      'currentSystem'
    ]),
    storageammeterDeviceids() {
      return this.currentSystem ? this.currentSystem.storageammeterDeviceids : [];
    },
    progressStyle() {
      return {
        '--progress': this.totalStorageData.ratio,
        '--progress-color': '#2ecc71', // 进度颜色
      };
    },
    statusClass() {
      return {
        'charging': this.nyzRealTimeData.status === '充电',
        'discharging': this.nyzRealTimeData.status === '放电',
        'idle': this.nyzRealTimeData.status === '静置'
      }
    },
    totalStorageData() {
      let totalPower = parseFloat(this.nyzRealTimeData.storagePower1) + parseFloat(this.nyzRealTimeData.storagePower2)
      let status = totalPower > 0 ? "充电中" : totalPower < 0 ? "放电中" : "不充不放"
      let charge = parseFloat(this.nyzRealTimeData.charge1) + parseFloat(this.nyzRealTimeData.charge2)
      let discharge = parseFloat(this.nyzRealTimeData.discharge1) + parseFloat(this.nyzRealTimeData.discharge2)
      let soc = parseFloat(this.nyzRealTimeData.soc) || 0
      let ratio = ((discharge / charge) * 100).toFixed(2)

      let res = {
        series: [
          {
            name: "充放电比",
            color: "#2fc25b",
            data: 0.8
          }
        ]
      };
      this.optimizedChartOptions.title.name = `${ratio}%`;
      this.chartRatioData = JSON.parse(JSON.stringify(res));

      return {
        power: totalPower.toFixed(2),
        status,
        soc,
        ratio
      }
    }
  },

  mounted() {
    this.findEnergyStorageInfo()
    this.findDayStorageQAndPower()
    this.getHighestChargeAndPower()
    this.getPowerCurve()
    this.getNyzRealTimeData()
  },

  methods: {
    //跳转页面
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

      this.type = dateMap[this.dateTypeIndex].dateType;
      if (this.type === "hour") {
        this.findDayStorageQAndPower();
      } else if (this.type === "day") {
        this.findMonthStorageQAndPower();
      } else if (this.type === "month") {
        this.findYearStorageQAndPower();
      }

      // this.getProvideCurve()
    },

    // 能源站实时数据
    getNyzRealTimeData() {
      getSocketinstance().socket2.emit("register")
      getSocketinstance().socket2.on("nyzData", (json) => {
        const { deviceType, dataType, address, data } = json
        if (deviceType == '1804_V2_2' && dataType == '2' && address == '18') {
          this.nyzRealTimeData.storagePower1 = parseFloat(data.B8).toFixed(2)
          this.nyzRealTimeData.charge1 = parseFloat(data.B12).toFixed(2)
          this.nyzRealTimeData.discharge1 = parseFloat(data.B16).toFixed(2)
        } else if (deviceType == '1804_V2_2' && dataType == '2' && address == '19') {
          this.nyzRealTimeData.storagePower2 = parseFloat(data.B8).toFixed(2)
          this.nyzRealTimeData.charge2 = parseFloat(data.B12).toFixed(2)
          this.nyzRealTimeData.discharge2 = parseFloat(data.B16).toFixed(2)
        } else if (deviceType == '1704_V1_2' && dataType == '2' && address == '02') {
          this.nyzRealTimeData.soc = parseFloat(data.B4).toFixed(2)
        } else if (deviceType == '1704_V1_2' && dataType == '3' && address == '02') {
          this.nyzRealTimeData.status = this.enumStorageStatus(data.B2)
        }
      })
    },

    enumStorageStatus(status) {
      if (status == 0) return "初始化"
      else if (status == 1) return "充电"
      else if (status == 2) return "放电"
      else if (status == 3) return "静置"
      else return "--"
    },


    findEnergyStorageInfo() {
      let that = this;
      upgrade.findEnergyStorageInfo({

      }).then((result) => {
        if (result && result.data) {
          that.dayMaxChargeQ = result.data.dayMaxChargeQ;
          that.dayMaxChargeQTime = result.data.dayMaxChargeQDatetime;
          that.dayMaxDischargeQ = result.data.dayMaxDischargeQ;
          that.dayMaxDischargeQTime = result.data.dayMaxDischargeQDatetime;
          that.hisMaxChargePower = result.data.maxChargePower;
          that.hisMaxChargePowerTime = result.data.maxChargePowerDatetime;
          that.hisMaxDischargePower = result.data.maxDischargePower;
          that.hisMaxDischargePowerTime = result.data.maxDischargePowerDatetime
          // that.storageStatus = result.data.energyStorageStatus;
          this.percent = result.data.dumpEnergy ? parseFloat(result.data.dumpEnergy) : 50;
        }
      })
    },

    findDayStorageQAndPower() {
      let storageChargeQData = [];
      let storageDisChargeQData = [];
      const storageIds = this.storageammeterDeviceids
      energy_new.findEveryHourByDeviceIds({
        deviceIds: storageIds,
        day: this.selectedDate,
      }).then((result) => {
        result.data.forEach(element => {
          storageChargeQData.push(element.total_storage_forward_q);
          storageDisChargeQData.push(element.total_storage_reverse_q);
        });
        this.storageQData =
        {
          categories: Array.from([...Array(24).keys()], (v) => v),
          series: [{
            name: '充电量',
            data: storageChargeQData,
          },
          {
            name: '放电量',
            data: storageDisChargeQData,
          }
          ]
        }

      })

    },

    findMonthStorageQAndPower() {
      let storageChargeQData = [];
      let storageDisChargeQData = [];
      this.xAxisData = [];
      const storageIds = this.storageammeterDeviceids
      energy_new.findEveryDayByDeviceIds({
        deviceIds: storageIds,
        month: String(new Date(this.selectedDate).getMonth() + 1).padStart(2, '0'),
        year: new Date(this.selectedDate).getFullYear(),
      }).then((result) => {
        const today = new Date(this.selectedDate)
        const days = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate()
        let xAxis = Array.from([...Array(days).keys()], (v) => v + 1);
        xAxis.map(item => {
          // let idx = result.data.findIndex(e => e.date == this.$moment(this.month).format("YYYY-MM") + "-" + String(item).padStart(2, "0"))
          let idx = result.data.findIndex(e => e.date === `${this.selectedDate}-${String(item).padStart(2, "0")}`)
          if (idx > -1) {
            storageChargeQData.push(result.data[idx].total_storage_forward_q)
            storageDisChargeQData.push(result.data[idx].total_storage_reverse_q)
          } else {
            storageChargeQData.push(0)
            storageDisChargeQData.push(0)
          }
        })
        // result.data.forEach(element => {
        //     this.storageChargeQData.push(element.total_storage_forward_q);
        //     this.storageDisChargeQData.push(element.total_storage_reverse_q);
        //     this.xAxisData.push(element.date)
        // });
        // this.storageQOptions.xAxis.data = xAxis;
        // this.storageQOptions.series[0].data = this.storageChargeQData;
        // this.storageQOptions.series[1].data = this.storageDisChargeQData;


        this.storageQData = {
          categories: xAxis,
          series: [{
            name: '充电量',
            data: storageChargeQData,
          }
            ,
          {
            name: '放电量',
            data: storageDisChargeQData,
          }
          ]
        }
      })

    },

    findYearStorageQAndPower() {
      let storageChargeQData = [];
      let storageDisChargeQData = [];
      this.xAxisData = [];
      const storageIds = this.storageammeterDeviceids;
      energy_new.findEveryMonthByDeviceIds({
        deviceIds: storageIds,
        year: this.selectedDate
      }).then((result) => {
        let xAxis = Array.from([...Array(12).keys()], (v) => v + 1);
        xAxis.map(item => {
          let idx = result.data.findIndex(e => e.month == item)
          if (idx > -1) {
            storageChargeQData.push(result.data[idx].total_storage_forward_q)
            storageDisChargeQData.push(result.data[idx].total_storage_reverse_q)
          } else {
            storageChargeQData.push(0)
            storageDisChargeQData.push(0)
          }
        })

        // this.storageQOptions.xAxis.data = xAxis;
        // this.storageQOptions.series[0].data = this.storageChargeQData;
        // this.storageQOptions.series[1].data = this.storageDisChargeQData;

        this.storageQData = {
          categories: xAxis,
          series: [{
            name: '充电量',
            data: storageChargeQData,
          },
          {
            name: '放电量',
            data: storageDisChargeQData,
          }
          ]
        }
      })

    },

    // 查询日最高充放电量和历史最高充放电功率
    getHighestChargeAndPower() {
      nyz_new.queryHighestChargeAndPower({
        deviceIdList: [352, 354],
        date: new Date().toISOString().split('T')[0]
      }).then(result => {
        if (result.data) {
          this.dayMaxChargeQ = result.data.dailyMaxCharge
          this.dayMaxChargeQTime = result.data.dailyMaxChargeTime
          this.hisMaxChargePower = result.data.maxPower
          this.hisMaxChargePowerTime = result.data.timeOfMaxPower + ":00"
          this.dayMaxDischargeQ = result.data.dailyMaxDisCharge
          this.dayMaxDischargeQTime = result.data.dailyMaxDisChargeTime
          this.hisMaxDischargePower = -result.data.mimPower
          this.hisMaxDischargePowerTime = result.data.timeOfMinPower + ":00"
        }
      })
    },

    // 功率曲线日期
    onPowerDateChange() {
      this.getPowerCurve()
    },

    // 查询功率曲线
    getPowerCurve() {
      // this.powerLoading = true
      nyz_new.queryStoragePowerCurve({
        deviceIdList: this.storageammeterDeviceids,
        date: this.powerDate
      }).then(result => {
        if (result.data) {
          let timeArray = []
          let chargeArray = []
          let disChargeArray = []
          for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m++) {
              let formattedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
              timeArray.push(formattedTime)

              let key = `${this.powerDate} ${formattedTime}:00`
              if (result.data.hasOwnProperty(key)) {
                let val = result.data[key]
                chargeArray.push(val >= 0 ? val.toFixed(2) : 0)
                disChargeArray.push(val < 0 ? -val.toFixed(2) : 0)
              } else {
                chargeArray.push(0)
                disChargeArray.push(0)
              }
            }
          }



          let res = {
            categories: timeArray,
            series: [{
              name: '充电功率',
              data: chargeArray,
            },
            {
              name: '放电功率',
              data: disChargeArray,
            }
            ]
          }

          this.storageChartData = JSON.parse(JSON.stringify(res));
        }
      }).finally(() => {

      })
    },
  }

}
</script>

<style lang="scss" scoped>
.container {
  padding: 10rpx
}

/* 图表容器样式 */
.chart-container {
  // padding: 0 24rpx;
  margin-bottom: 10rpx;
}

.power-chart,
.capacity-chart {
  margin-top: 10rpx;
}

.status-container {
  padding: 20rpx;
  background: #f8f9fa;
  // border-radius: 16rpx;
  // margin: 20rpx;
  // box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

// .status-card {
//   background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
//   border: 1rpx solid #ebeef5;
// }

.status-title {
  font-size: 32rpx;
  color: #2d3139;
  font-weight: 600;
  letter-spacing: 1rpx;
}

.status-body {
  margin-top: 24rpx;
}

.status-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right:10px;
  width:calc(100% - 220rpx)
  // margin-bottom: 32rpx;
}

.status-value {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 44rpx;
  font-weight: 700;

  &.charging {
    color: #34c759;
  }

  &.discharging {
    color: #ff3b30;
  }

  &.idle {
    color: #8e8e93;
  }
}

.soc-container {
  background: #ffffff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.soc-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.soc-title {
  font-size: 28rpx;
  color: #6b7683;
}

.soc-percent {
  font-family: 'Roboto Mono', monospace;
  font-size: 32rpx;
  color: #2d3139;
}

.progress-track {
  height: 24rpx;
  background: #ebedf0;
  border-radius: 12rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.5s ease-in-out;
  background: linear-gradient(90deg, #64d2ff 0%, #1890ff 100%);
}

.soc-markers {
  display: flex;
  justify-content: space-between;
  margin-top: 8rpx;
  color: #8e8e93;
  font-size: 24rpx;
}

.ratio-card {
  background: linear-gradient(135deg, #ffffff 0%, #f6f7ff 100%);
  margin-top: 24rpx;
}

.ratio-header {
  text-align: center;
  margin-bottom: 20rpx;
}

.ratio-title {
  font-size: 28rpx;
  color: #2d3139;
  font-weight: 500;
}

.ratio-value-group {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-top: 12rpx;
}

.ratio-percent {
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 48rpx;
  color: #1890ff;
  margin-right: 8rpx;
}

.ratio-unit {
  font-size: 28rpx;
  color: #8e8e93;
}

/* 图表优化 */
.ratio-chart {
  height: 280rpx;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .status-value {
    font-size: 36rpx;
  }

  .ratio-percent {
    font-size: 40rpx;
  }

  .soc-container {
    padding: 16rpx;
  }
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
  color: #1a1a1a;
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

/* 日期选择器样式 */
.date-picker-wrapper {
  border: 1rpx solid #EEE;
  border-radius: 12rpx;
  // padding: 8rpx 16rpx;
}

// .compact-date-picker {
//   width: 240rpx;
// }

/* 分段控制器样式 */
// .segmented-control {
//   margin-bottom: 16rpx;
// }

.date-picker-group {
  border: 1rpx solid #EEE;
  border-radius: 12rpx;
  padding: 8rpx;
}

.dynamic-date-picker {
  width: 100%;
}

/* 图表视图 */
.chart-view {
  width: 100%;
  height: 480rpx;
}

/* 响应式优化 */
// @media (max-width: 480px) {
//   .chart-container {
//     padding: 0 16rpx;
//   }

//   .card {
//     padding: 16rpx;
//   }

//   .chart-title {
//     font-size: 28rpx;
//   }

//   .chart-view {
//     height: 400rpx;
//   }
// }

/* 自定义进度条样式 */
.soc-progress-bar {
  height: 24rpx;
  background: #F3F4F6;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
}

.soc-progress-track {
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12rpx;
}

.soc-percent {
  position: absolute;
  right: 16rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24rpx;
  color: #FFFFFF;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.12);
}


.stats-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10rpx 0;
}

.stat-item {
  width: 49.6%;
  background-color: #fff;
  // border-radius: 5px;
  padding: 10px 20rpx;
  margin-bottom: 2rpx;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:10rpx 0
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #1a1a1a;
  // margin-bottom: 5px;
  // font-weight: 600;
}

.stat-value {
  font-size: 14px;
  color: #4488FB;
  font-weight: bold;
}

.stat-unit {
  font-size: 10px;
}

.stat-desc {
  font-size: 12px;
  color: #999;
  margin-top: 3px;
}

.meta-info {
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #EEE;
}

.meta-label {
  font-size: 24rpx;
  color: #fff;
  // margin-right: 12rpx;
}

.meta-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 26rpx;
  color: #fff;
}


/* 移动端适配 */
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    padding: 0 16rpx;
  }

  .stat-item {
    padding: 20rpx 10rpx;
  }

  .value {
    font-size: 32rpx;
  }
}

.dual-display {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.progress-section {
  flex: 1;
  max-width: 60%;
}

.ratio-chart {
  flex: 1;
  height: 200rpx;
  max-width: 40%;
}

@media (max-width: 480px) {
  .dual-display {
    flex-direction: column;
  }

  .progress-section,
  .ratio-chart {
    max-width: 100%;
    width: 100%;
  }
}

.status-container {
  // margin: 20rpx;
  background: #FFFFFF;
  // border-radius: 24rpx;
  // box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.status-header {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #F8F9FA;
  border-bottom: 1rpx solid #EEE;
}

.battery-icon {
  width: 180rpx;
  height: 100rpx;
  margin-right: 16rpx;
}

.status-title {
  font-size: 32rpx;
  color: #2D3139;
  font-weight: 600;
}

.status-content {
  // padding: 24rpx;
  display: flex;
  // gap: 32rpx;
}

.status-indicator {
  flex: 1;
}

.status-tag {
  display: block;
  font-family: 'Roboto Condensed';
  font-size: 28rpx;
  margin:0 10px;
  // padding: 8rpx 24rpx;
  // border-radius: 8rpx;
  // text-align: center;
  // margin-bottom: 24rpx;

  &.charging {
    background: #E6F4FF;
    color: #1890FF;
  }

  &.discharging {
    background: #FFF7E6;
    color: #FA8C16;
  }

  &.idle {
    background: #F6F6F6;
    color: #666;
  }
}

.soc-progress-container {
  margin-top: 24rpx;
}

.soc-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

/* 优化SOC容器样式 */
.soc-progress-container {
  // width: 100%;
  min-width: 280rpx;
  margin: 0 auto;
  padding: 16rpx 0;
}

.soc-label {
  display: block;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 24rpx;
}

.soc-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #999;
  padding: 0 8rpx;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .soc-progress-container {
    min-width: 240rpx;
    padding: 12rpx 0;
  }

  .soc-label {
    font-size: 26rpx;
    margin-bottom: 20rpx;
  }
}

.progress-track {
  height: 24rpx;
  background: #F3F4F6;
  border-radius: 12rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.soc-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #999;
}

.ratio-container {
  width: 200rpx;
  height: 200rpx;
  position: relative;
}

.efficiency-chart {
  width: 100% !important;
  height: 100% !important;
}

.ratio-label {
  position: absolute;
  bottom: -20rpx;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24rpx;
  color: #7f8b9a;
}

@keyframes progressGrow {
  from {
    width: 0%;
  }

  to {
    width: var(--current-percent);
  }
}



/* 基础样式定义 */
.stats-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 10rpx;
}

.card {
  background: #ffffff;

  position: relative;
  overflow: hidden;
}
</style>
