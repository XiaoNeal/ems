<template>
  <view class="container">
    <!-- 导航栏 -->
    <view class="navbar">
      <view v-for="(item, index) in navbarList" :key="index" class="navbar-item"
        :class="{ active: navbarIndex === index }" @tap="changeNavBar(index)">
        {{ item }}
      </view>
    </view>
    <!-- 主内容区 -->
      <!-- 电源控制 -->
      <view class="card ">
        <view class="card-header">
          <text>电源控制</text>
        </view>
        <view class="card-body">
          <view class="control-group">
            <view class="control-item">
              <text>母线电压</text>
              <uni-number-box v-model="setVoltage" :min="0" :max="1000" class="input-box"></uni-number-box>
            </view>
            <view class="control-item">
              <text>调节时间</text>
              <uni-datetime-picker type="datetimerange" v-model="setVoltageTime" class="time-picker" />
            </view>
            <view class="control-item">
              <uni-button type="primary" class="confirm-btn" @click="changeVoltage"
                :loading="btnLoading">确认</uni-button>
            </view>
          </view>
          <scroll-view scroll-y class="data-table">
            <view class="table-row header">
              <text>时间</text>
              <text>母线电压(V)</text>
              <text>操作</text>
            </view>
            <view v-if="tableData.length">
              <view v-for="(item, index) in tableData" :key="index" class="table-row">
                <text>{{ item.timeRange }}</text>
                <text>{{ item.voltage }}</text>
                <uni-button type="warn" size="mini" @click="handleRemoveTimeRange(item, index)">删除</uni-button>
              </view>
            </view>
            <view v-else class="no-data">
              <uni-icons type="info" size="28" color="#999" />
              <text>暂无数据</text>
            </view>
          </scroll-view>
        </view>
      </view>
      <!-- 负荷控制 -->
      <view class="card " >
        <view class="card-header">
          <text>负荷控制</text>
        </view>
        <view class="card-body">
          <view class="control-item">
            <text>选择设备</text>
            <picker @change="handleDeviceChange" :value="selectValue" :range="options" range-key="label"
              class="device-picker">
              <view class="picker-view">{{ options[selectValue].label }}</view>
            </picker>
          </view>
          <view class="control-item">
            <text>电压感知时间</text>
            <uni-number-box v-model="setLoadTime" :min="0" class="input-box"></uni-number-box>
          </view>
          <view class="control-item">
            <text>放大系数</text>
            <uni-number-box v-model="setFactor" :min="0" class="input-box"></uni-number-box>
          </view>
          <view class="btn-group">
            <uni-button type="primary" :loading="btnLoading" @click="handleFactorChange(1)">使能开</uni-button>
            <uni-button type="warn" :loading="btnLoading" @click="handleFactorChange(0)">使能关</uni-button>
          </view>
        </view>
      </view>
      <!-- 实时曲线 -->
      <view class="card ">
        <view class="card-header">
          <text>实时曲线</text>
        </view>
        <view class="chart-container" style="height: 400rpx;">
          <qiun-data-charts type="mix" :canvas2d="canvas2d" :inScrollView="true" :chartData="realTimeChartData"
            :ontouch="true" :opts="chartOptions" canvasId="realTimeChart" />
        </view>
      </view>
      <!-- 历史功率查询 -->
      <view class="card">
        <view class="card-header">
          <view class="date-picker-container">
            <text>历史功率查询</text>
            <uni-datetime-picker 
              type="datetimerange" 
              v-model="historyChartTime" 
              class="date-picker"
              @change="onChangeHistoryChart" />
          </view>
        </view>
        <qiun-data-charts type="mix" :canvas2d="canvas2d" :inScrollView="true" :chartData="historyChartData"
          :ontouch="true" :opts="chartOptions" canvasId="historyChart" />
      </view>
  </view>
</template>

<script>
import { RealtimeDataProviderService } from '@/service/socket/realtime-data-provider.js';
import { findRunningPowerByBarCodeAndAddressAndDay, setClusterDeviceContrastControl, quickQueryEsDirect } from '@/api/sqnyz'
import { queryAllEnergyStationSituation } from '@/api/devices'
import { quickControlBusVoltage, quickControlAmplificationFactor, queryDeviceInfo, queryScheduleTime, insertScheduleTime, deleteScheduleTime, sendInit } from '@/api/control'
import * as dateUtils from '@/utils/date'
import { mapState } from 'vuex';
export default {
  data() {
    return {
      canvas2d: this.$Config.ISCANVAS2D,
      realTimeService: new RealtimeDataProviderService(),
      navbarIndex: 0,
      btnLoading: false,
      setVoltage: 0,
      setVoltageTime: [],
      tableData: [],
      selectValue: 0,
      setLoadTime: 0,
      setFactor: 0,
      historyChartData: {},
      deviceConfig: {
        energyStation: {
          barCode: 'F2 00 12 00 00 00 00 00 00 00 00 00 00 00 00',
          deviceType: '1804_V2_2',
          address: '32',
          controlpowerType: 3202,
          controlloadType: 3201
        },
        chargingPile: {
          barCode: '00 00 00 00 00 00 00 00 00 00 00 00 00 00 01',
          deviceType: '1111',
          address: '03',
          controlpowerType: 3209,
          controlloadType: 3208
        }
      },
      currentConfig: {
        barCode: 'F2 00 12 00 00 00 00 00 00 00 00 00 00 00 00',
        deviceType: '1804_V2_2',
        address: '32',
        controlpowerType: 3202,
        controlloadType: 3201
      },
      enum_permission: {
        insert: 1,
        delete: 2,
        update: 3,
        select: 4
      }, loadControlList: [],
      loadControlDevice: "",
      loadControlDeviceTem: "",
      controlList: [],
      controlDevice: "",

      // 负荷控制
      setLoadTime: 0,
      setFactor: 0,

      // 电源控制
      setVoltage: 0,
      setVoltageTime: [],
      tableData: [],
      // 参数信息实时数据
      deviceLists: [],
      // 实时曲线数据
      realtimeChartInterval: null,
      // 零点清空曲线
      deleteInterval: null,
      // 历史功率曲线
      historyChartLoading: false,
      historyChartTime: [
        (() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return dateUtils.dateFormatter(today, 'yyyy-MM-dd');
        })(),
        (() => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          return dateUtils.dateFormatter(tomorrow, 'yyyy-MM-dd');
        })()
      ],
      // 修改需求响应模式
      selectModel: 0,
      modelOptions: [
        { label: "1级响应(25%)", value: 0 },
        { label: "2级响应(50%)", value: 1 },
        { label: "3级响应(75%)", value: 2 },
        { label: "退出响应模式", value: 3 }
      ], realTimeChartData: {
        categories: [],
        series: [
          { name: '功率', data: [], style: "curve", index: 0 },
          { name: '电压', data: [], style: "curve", index: 1 }
        ]
      },

      chartOptions: {
                dataLabel: false,
                enableScroll: true,
                color: ["#1890FF", "#FAC858"],
                padding: [15, 15, 0, 15],
                xAxis: {
                    disableGrid: true,
                    // rotateAngle: 90, // 标签旋转45度
                    rotateLabel: true,
                    labelCount: 12, // 显示12个标签
                    itemCount: 12, // 显示间隔为2小时（24小时数据）
                    fontSize: 8, // 缩小字体
                    boundaryGap: true,
                    splitNumber: 12, // 显示12个刻度
                    scrollShow: true // 启用滚动条
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
                            title: "功率 (W)",
                            tofix: 0
                        },
                        {
                            position: "right",
                            min: 0,
                            title: "电压(V)",
                            textAlign: "left",
                            tofix: 0
                        },
                    ]
                },
                extra: {
                    mix: {
                        column: {
                            width: 20
                        }
                    }
                }
            },
    };
  },
  computed: {
    ...mapState(['powerStationsId']),
    navbarList() {
      return ["能源站", "充电桩"];
    },
    options() {
      return [
        { label: '全部', value: 0 },
        { label: '空调', value: 1 },
        { label: '充电桩', value: 2 },
        { label: '照明', value: 3 }
      ];
    },
    textColor() {
      return this.$store.state.themeName === "dark" ? "#ffffff" : "#999999";
    },
    permission() {
      return this.$store.getters['user/pagePermission'](2)
    },

    infoList() {
      const dataContainer = this.deviceLists.find(ele => ele.barCode === 'F2 00 02 04 00 04 03 00 00 08 04 04 00 00 01' && ele.deviceType === '0319')
      return [
        { name: "多联机柔性响应状态", value: dataContainer && dataContainer.stateData.responseStatus.value || '--' },
        { name: "响应指令", value: dataContainer && dataContainer.stateData.responseMode.value || '--' },
        { name: "维持时间", value: dataContainer && dataContainer.stateData.responseTime.value || '--', unit: "Min" },
        { name: "空调运行功率", value: dataContainer && dataContainer.stateData.outdoorUnitRealPower.value || '--', unit: "W" },
        { name: "柔度值", value: dataContainer && dataContainer.stateData.setSoftValue.value || '--' },
        { name: "室外环境温度", value: dataContainer && dataContainer.stateData.envTemperature.value || '--', unit: "℃" },
        { name: "室内平均温度", value: dataContainer && dataContainer.stateData.indoorOneEnvTemperature.value || '--', unit: "℃" }
      ]
    }
  },
  methods: {
    handleDeviceChange(value) {
      console.log(this.controlList)
      if (value === 0) {
        this.controlDevice = this.controlList[0]
      } else if (value === 1) {
        this.controlDevice = this.controlList[0]
      } else {
        this.$message({
          message: '当前设备未接入系统',
          type: 'warning',
          duration: 2000
        })
      }
    },
    getControlDeviceList() {
      console.log(this.currentConfig,"-----------getControlDeviceList-----------")
      const controlType = 3202
      queryDeviceInfo(this.currentConfig.controlpowerType)
        .then(result => {
          this.controlList = result.data
          this.controlDevice = result.data[0]
          this.getChangeVoltageHistory()
        })
        .catch(err => {
          console.error(err)
        })
    },
    getLoadControlDeviceList() {
      const controlType = 3201
      console.log(this.currentConfig,"-----------getLoadControlDeviceList-----------")
      queryDeviceInfo(this.currentConfig.controlloadType)
        .then(result => {
          console.log('loadControlList', result)
          this.loadControlList = result.data
          this.loadControlDevice = result.data[0]
          this.loadControlDeviceTem = result.data[0]
          console.log('loadControlDevice', this.loadControlDevice)
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 切换能源站、充电桩
    changeNavBar(index) {
      if (index === this.navbarIndex) return;
      this.navbarIndex = index;
      // 根据索引切换当前设备配置
      this.currentConfig = index === 0 ? this.deviceConfig.energyStation : this.deviceConfig.chargingPile;
      console.log('当前设备配置：', this.currentConfig);

      // 清空实时曲线数据
      this.realTimeChartData = {
        categories: [],
        series: [
          { name: '功率', data: [], style: "curve", index: 0 },
          { name: '电压', data: [], style: "curve", index: 1 }
        ]
      };

      // 清空历史曲线数据
      this.historyChartData = {
        categories: [],
        series: [
          { name: '历史功率', data: [], style: "curve", index: 0 },
          { name: '历史电压', data: [], style: "curve", index: 1 }
        ]
      };

      // 重新初始化图表数据
      this.initRealTimeChart()
      this.initHistoryChart()
      this.getLoadControlDeviceList()
      this.getControlDeviceList()
    },
    handleFactorChange(status) {
      if (this.setLoadTime == 0 || this.setFactor == 0) {
        // ElMessage({ type: 'error', message: '数值不能为0', })
        this.$message({
          message: '数值不能为0',
          type: 'error',
          duration: 2000
        })
        return
      }
      const idCode = '02 00 02 05 00 02 02 01 01 07 03 01 01 00 00'
      const address = '01'
      const device = this.loadControlDevice
      if (!device) {
        // ElMessage({ type: 'error', message: '未注册设备' })
        this.$message({
          message: '未注册设备',
          type: 'error',
          duration: 2000
        })
        return
      }
      quickControlAmplificationFactor(device.barCode, device.address, status, this.setFactor, this.setLoadTime)
        .then(result => {
          if (result.status == 200) {
            this.$message({
              message: '下发成功',
              type: 'success',
              duration: 2000
            })
            // ElMessage({ type: 'success', message: '下发成功' })
          } else {
            this.$message({
              message: result.msg,
              type: 'error',
              duration: 2000
            })
            // ElMessage({ type: 'error', message: result.msg })
          }
        })
        .catch(err => {
          console.error(err)
          this.$message({
            message: '下发失败',
            type: 'error',
            duration: 2000
          })

        })
    },
    changeVoltage() {
      const range = this.setVoltageTime
      const compareRanges = this.tableData.map(item => item.timeRange).map(item => item.split('~'))
      const flag = checkOverlaps(range, compareRanges)
      if (flag) {
        this.$message({
          message: '时间段不能重叠',
          type: 'error',
          duration: 2000
        })

        return
      }
      const device = this.controlDevice
      const startTime = this.setVoltageTime[0] + ':00'
      const endTime = this.setVoltageTime[1] + ':00'
      const setValue = this.setVoltage + ',1'
      insertScheduleTime(device.typeCode, device.esId, startTime, endTime, setValue, 1)
        .then(result => {
          if (result.status == 200) {
            this.$message({
              message: '下发成功',
              type: 'success',
              duration: 2000
            })
            // ElMessage({ type: 'success', message: '下发成功' })
          } else {
            this.$message({
              message: result.msg,
              type: 'error',
              duration: 2000
            })
            // ElMessage({ type: 'error', message: result.msg })
          }
        })
        .catch(err => {
          console.error(err)
        })
        .finally(() => {
          getChangeVoltageHistory()
        })
    },
    async handleRemoveTimeRange(row, idx) {
      try {
        console.log(row)
        const id = row.id
        const timeRange = row.timeRange.split('~')
        const voltage = row.voltage
        // const startTime = '00:00:00'
        // const endTime = '00:01:00'
        const startTime = timeRange[0] + ':00'
        const endTime = timeRange[1] + ':00'
        const result = await deleteScheduleTime(id, startTime, endTime, voltage)
        if (result.status !== 200) {
          this.$message({
            message: result.msg || '删除失败',
            type: 'error',
            duration: 2000
          })
          // ElMessage({ type: 'error', message: result.msg || '删除失败' })
          return
        }
        const device = this.controlDevice
        const res = await sendInit(device.esId, device.typeCode)
        if (res.status === 200) {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          // ElMessage({ type: 'success', message: '删除成功' })
        } else {
          this.$message({
            message: result.msg || '删除失败',
            type: 'error',
            duration: 2000
          })
          // ElMessage({ type: 'error', message: res.msg || '删除失败' })
        }
      } catch (err) {
        console.error(err)
        this.$message({
          message: result.msg || '删除失败',
          type: 'error',
          duration: 2000
        })
        // ElMessage({ type: 'error', message: '删除失败' })
      } finally {
        this.getChangeVoltageHistory()
      }
    },
    // 查询电压控制记录
    getChangeVoltageHistory() {
      this.tableData = []
      const device = this.controlDevice
      queryScheduleTime(device.typeCode, device.esId)
        .then(result => {
          result.data.map(item => {
            const obj = {
              id: item.id,
              timeRange: item.startTime.replace(/:..$/, '') + '~' + item.endTime.replace(/:..$/, ''),
              voltage: item.value.split(',')[0]
            }
            this.tableData.push(obj)
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 将时间转换为分钟数
    timeToMinutes(timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    },
    // 判断两个时间段是否有重叠
    hasTimeOverlap(timeRange1, timeRange2) {
      const [start1, end1] = timeRange1.map(timeToMinutes)
      const [start2, end2] = timeRange2.map(timeToMinutes)
      return start1 < end2 && start2 < end1
    },
    // 检查主时间段是否与多个时间段中的任意一个重叠
    checkOverlaps(mainRange, compareRanges) {
      return compareRanges.some(range => hasTimeOverlap(mainRange, range))
    },
    async getInfoListData(esId) {
      const res = await queryAllEnergyStationSituation(esId)
      let findData = []
      let storageData = []
      res.data.forEach((item) => {
        if (
          item.typeCode === "170C_V1_1" ||
          item.typeCode === "1707_V3_3" ||
          item.typeCode === "1704_V1_2" ||
          item.typeCode === "1704_V1_1" ||
          item.typeCode === "0318"
        ) {
          storageData.push(item)
        } else {
          findData.push(item)
        }
      })
      this.realTimeService.initDeviceList(findData)
      this.deviceLists = this.realTimeService.getDeviceList()
    },

    // 实时曲线
    initRealTimeChart() {
      const address = this.currentConfig.address
      const startTime = dateUtils.dateFormatterSec(new Date().setMinutes(new Date().getMinutes() - 20))
      const endTime = dateUtils.dateFormatterSec(new Date())
      console.log(address, startTime, endTime,"-----------------")

      quickQueryEsDirect(address, startTime, endTime).then(result => {
        this.realTimeChartData = {
          categories: (result.data.map(item =>
            dateUtils.dateFormatterSec(new Date(item.frame_datetime), 'MM-dd HH:mm:ss')
          )).slice(0, 100),
          series: [
            {
              name: '功率', style: "curve", type: "line",
              data: (result.data.map(item => item.power * 1000)), index: 0
            },
            {
              name: '电压', style: "curve", type: "line",
              data: (result.data.map(item => item.voltage)), index: 1
            }
          ]
        }
      })
    },
    updateRealTimeChartData() {
      const dataContainer = this.deviceLists.find(ele =>
        ele.barCode === this.currentConfig.barCode &&
        ele.deviceType === this.currentConfig.deviceType &&
        ele.address === this.currentConfig.address
      )

      if (dataContainer?.energyData) {
        const newTime = dateUtils.dateFormatter(new Date(), 'MM-dd HH:mm:ss')
        this.realTimeChartData = {
          categories: [...this.realTimeChartData.categories, newTime],
          series: [
            {
              ...this.realTimeChartData.series[0], style: "curve", index: 0, type: "line",
              data: [...this.realTimeChartData.series[0].data, dataContainer.energyData.power.value * 1000]
            },
            {
              ...this.realTimeChartData.series[1], style: "curve", index: 1, type: "line",
              data: [...this.realTimeChartData.series[1].data, dataContainer.energyData.voltage.value]
            }
          ]
        }
      }
    },
    initHistoryChart() {
      this.historyChartLoading = true
      const address = this.currentConfig.address
      console.log(this.historyChartTime, "-----")
      // 设置默认时间范围（最近7天）
      if (!this.historyChartTime.length) {
        const start = new Date().setDate(new Date().getDate() - 7)
        this.historyChartTime = [start, new Date()]
      }
      console.log(this.historyChartTime, "-----")
      const startTime = dateUtils.dateFormatterSec(this.historyChartTime[0])
      const endTime = dateUtils.dateFormatterSec(this.historyChartTime[1])

      quickQueryEsDirect(address, startTime, endTime).then(result => {
        this.historyChartData = {
          categories: result.data.map(item =>
            dateUtils.dateFormatter(item.frame_datetime, 'MM-dd HH:mm:ss')
          ),
          series: [
            {
              name: '历史功率', style: "curve", index: 0, type: "line",
              data: result.data.map(item => item.power * 1000)
            },
            {
              name: '历史电压', style: "curve", index: 1, type: "line",
              data: result.data.map(item => item.voltage)
            }
          ]
        }
        console.log("this.historyChartData", this.historyChartData)
      }).finally(() => {
        this.historyChartLoading = false
      })
    },
    deleteRealTimeChart(chartEle, options) {
      const nowTime = new Date()
      const isMidNight = nowTime.getHours() === 0 && nowTime.getMinutes() === 0 && nowTime.getSeconds() === 0
      if (isMidNight) {
        options.xAxis.data = []
        options.series[0].data = []
        options.series[1].data = []
        chartEle && chartEle.setOption(options)
      }
    },
    onChangeHistoryChart(timeRange) {
      // const [startTime, endTime] = timeRange
      this.historyChartTime = timeRange
      this.initHistoryChart()
    }
  },
  onLoad() {
    // this.testRealData();
    // this.initDeviceIdList();
  },





  // 监听主题颜色的变化
  watch: (
    () => this.$store.state.themeName,
    (newVal) => {
      this.initRealTimeChart()
      this.initHistoryChart()
    },
    () => this.$store.state.powerStationsId,
    async (newVal, oldVal) => {
    }
  ),
  mounted() {

    // this.historyChartTime = [
    //   dateUtils.dateFormatter(this.today, 'yyyy-MM-dd'),
    //   dateUtils.dateFormatter(this.tomorrow, 'yyyy-MM-dd')]
    // this.testRealData();
    // this.initDeviceIdList();
    this.getInfoListData(2)
    this.$nextTick(() => {
      this.initRealTimeChart()
      this.initHistoryChart()
    })

    // 查询电源控制设备


    this.getControlDeviceList()

    // 查询负荷控制设备


    this.getLoadControlDeviceList()
  },
  beforeDestroy() {
    this.realTimeService.unregister()
  },
  destroyed() {
    clearInterval(this.realtimeChartInterval)
    clearInterval(this.deleteInterval)
  },

};
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.navbar {
  display: flex;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

  &-item {
    flex: 1;
    text-align: center;
    padding: 24rpx 0;
    font-size: 32rpx;
    color: #666;
    position: relative;
    transition: all 0.3s;

    &.active {
      color: #1890FF;
      font-size: 36rpx;  /* 原36rpx */
      font-weight: 500;
      color: #333;
      padding: 24rpx 0;
      border-bottom: 2rpx solid #eee;
    }

    @media screen and (max-width: 768px) {
      .card-header {
        font-size: 30rpx;  /* 移动端适配 */
      }
    }

    &.active {
      color: #1890FF;
      font-size: 36rpx;
    }
  }
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 12rpx 0;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 24rpx;
    border-bottom: 2rpx solid #eee;
    margin-bottom: 24rpx;
    font-size: 38rpx;
    color: #303133;
    font-weight: 500;
  }
}

.control {
  &-group {
    display: grid;
    gap: 32rpx;
    margin-bottom: 32rpx;
  }

  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 32rpx;
    color: #666;

    + .control-item {
      margin-top: 24rpx;
    }
  }
}

.input-box {
  width: 240rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 16rpx 24rpx;

  /deep/ .uni-numbox__value {
    font-size: 32rpx !important;
  }
}

.confirm-btn,uni-button {
  width: 100%;
  margin-top: 32rpx;
  font-size: 32rpx;
  height: 88rpx;
  border-radius: 12rpx;
}

.data-table {
  max-height: 600rpx;
  margin-top: 24rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;

  .table-row {
    display: flex;
    align-items: center;
    padding: 24rpx;
    border-bottom: 2rpx solid #f5f5f5;

    &.header {
      background: #f8f8f8;
      font-weight: 500;
      color: #333;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }

    @media screen and (max-width: 768px) {
      .card-header {
        font-size: 12px;
        padding: 8px 0;
      }
    }

    text {
      flex: 1;
      text-align: center;
      font-size: 28rpx;
    }

    &:nth-child(even) {
      background: #fafafa;
    }
  }
}

.btn-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  margin-top: 32rpx;

  uni-button {
    height: 88rpx;
    border-radius: 12rpx;
    font-size: 32rpx;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1890FF;
    color: #fff;

  }
}

.chart-container {
  height: 400rpx;
  background: #fff;
  border-radius: 12rpx;
  // padding: 24rpx;
}

.date-picker-container {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  
  .date-picker {
    width: 100%;
    margin: 0 auto;
    
    /deep/ .uni-date-editor {
      width: 100% !important;
    }
  }
}

.device-picker {
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
  width: 240rpx;
  text-align: right;
}

.time-picker {
  width: 240rpx;
}

.navbar-item {
  font-size: 14px;
  padding: 8px 12px;
  transition: all 0.2s ease;
}

.navbar-item.active {
  font-weight: 500;  /* 仅保留字体加粗 */
  color: #1890ff;    /* 保留颜色变化 */
  border-bottom: 2px solid #1890ff;  /* 添加下划线 */
}

@media screen and (max-width: 768px) {
  .navbar-item {
    font-size: 14px;  /* 保持移动端字体一致 */
  }
  .navbar-item.active {
    font-size: 14px;  /* 确保移动端字体大小不变 */
  }
}

.data-table .header {
  font-size: 13px;  /* 原14px */
  padding: 10px 0;
}

.table-row {
  font-size: 12px;  /* 原13px */
  line-height: 1.5;
  padding: 8px 0;
}

.control-item text {
  font-size: 13px;  /* 原14px */
}

.confirm-btn {
  font-size: 13px;  /* 原14px */
  padding: 6px 12px;
}

/* 新增响应式调整 */
@media screen and (max-width: 768px) {
  .navbar-item {
    font-size: 12px;
    padding: 6px 10px;
  }
  
  .data-table .header {
    font-size: 12px;
  }
  
  .table-row {
    font-size: 11px;
  }
}


.date-picker-container {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  
  .date-picker {
    width: 100%;
    margin: 0 auto;
    
    /deep/ .uni-date-editor {
      width: 100% !important;
    }
  }
}

.device-picker {
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
  width: 240rpx;
  text-align: right;
}

.time-picker {
  width: 240rpx;
}
.no-data {
  padding: 40rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 28rpx;
  background: #fafafa;
  border-radius: 16rpx;
}

.card-header{
  font-size: 30rpx;
}
</style>

