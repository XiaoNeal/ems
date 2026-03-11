<template>
  <view class="container">
    <!-- 负荷曲线区块 -->
    <view class="card">
      <view class="section-header">

        <text class="title">负荷曲线</text>
        <dy-date timeType="day" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
      </view>

      <view class="chart-container">
        <qiun-data-charts type="line" :chartData="loadChartData" :opts="loadChartOptions" canvasId="load-chart"
          class="main-chart" :ontouch="true" :canvas2d="canvas2d" />
      </view>
    </view>

    <!-- 设备统计区块 -->
    <view class="card device-stats">
      <view class="section-header">
        <text class="title">设备统计</text>
      </view>

      <view class="stats-grid">
        <!-- 已接设备 -->
        <view class="device-group">
          <view class="group-title">已接设备</view>
          <view class="device-grid">
            <view class="device-item">
              <div class="number">{{ nyzData.dljQuantity }}/{{ dljTotalDeviceCount }}</div>
              <div class="text">空调</div>
              <div class="text">
                在线数/总数
              </div>
            </view>
            <view class="device-item">
              <div class="number">{{ nyzData.cdzQuantity }}/{{ cdzTotalDeviceCount }}</div>
              <div class="text">充电桩</div>
              <div class="text">
                在线数/总数
              </div>
            </view>

          </view>
        </view>


        <view class="chart-group">
          <view class="chart-item">
            <qiun-data-charts type="arcbar" :chartData="softChartData" :opts="softChartOptions" canvasId="soft-chart"
              class="dashboard-chart" :ontouch="true" :canvas2d="canvas2d" />
          </view>
          <view class="chart-item">
            <qiun-data-charts type="arcbar" :chartData="loadRateChartData" :opts="loadRateChartOptions"
              canvasId="loadrate-chart" class="dashboard-chart" :ontouch="true" :canvas2d="canvas2d" />
          </view>
          <view class="chart-item">
            <qiun-data-charts type="arcbar" :chartData="efficiencyChartData" :opts="efficiencyChartOptions"
              canvasId="efficiency-chart" class="dashboard-chart" :ontouch="true" :canvas2d="canvas2d" />
          </view>
        </view>
      </view>
    </view>

    <!-- 设备列表 -->
    <view class="card device-list">


      <view v-for="(item, index) in deviceList" :key="index" @click="onDeviceClick(item)" class="device-card">

        <view class="device-name">{{ item.deviceName }}</view>
        <!-- <view class="card-content"> -->
        <!-- 设备图标 -->
        <view class="device-image">
          <img class="device-icon" v-if="item.type == '0305'" src="../static/images/VRV.png" />
          <img class="device-icon" v-if="item.type == 2" src="../static/images/load-airconditioner.png" />
          <img class="device-icon" v-if="item.type == 3" src="../static/images/load-chargingPile.png" />
        </view>
        <!-- 设备信息 -->
        <view class="device-info">


          <!-- 指标进度条 -->
          <view class="progress-group">
            <view class="progress-item">
              <text class="progress-label">柔度</text>
              <view class="custom-progress-container">
                <view class="custom-progress-bar" :style="{
                  width: `${item.deviceFlexibility * 100}%`,
                  background: `linear-gradient(90deg, #06e30a, ${getProgressEndColor(item.deviceFlexibility)})`
                }">
                </view>
              </view>
              <text class="progress-value">{{ (item.deviceFlexibility) }}</text>
            </view>

            <view class="progress-item">
              <text class="progress-label">负载率</text>
              <view class="custom-progress-container">
                <view class="custom-progress-bar" :style="{
                  width: `${item.deviceLoadRatio}%`,
                  background: `linear-gradient(90deg, #06e30a, ${getProgressEndColor(item.deviceLoadRatio)})`
                }">
                </view>
              </view>
              <text class="progress-value">{{ (item.deviceLoadRatio) }}</text>
            </view>
          </view>

          <!-- 能效指示器 -->
          <view class="energy-indicator">
            <text class="indicator-title">能效水平</text>
            <view class="indicator-levels">
              <view v-for="level in 3" :key="level"
                :class="['level-dot', { 'active': item.deviceEnergyEfficiencyLevel === level }]">
              </view>
            </view>
          </view>
        </view>

      </view>

    </view>
  </view>
</template>


<script>
import {
  getSocketinstance
} from "@/service/websocket";
import energy from '@/api/energy_new'
import dyDate from '@/components/dy-Date/dy-Date.vue'; // 导入日期选择器组件
const commonArcbarOptions = {
  padding: [15,
    15,
    0,
    15],
  title: {
    name: '75%',
    fontSize: 12,
    color: '#1890FF'
  }
  ,
  subtitle: {
    name: '完成率',
    fontSize: 12,
    color: '#666'
  }

  ,
  extra: {
    arcbar: {
      type: 'circle',
      width: 6,
      startAngle: 0.75,
      backgroundColor: '#F0F2F5',
      gradient: true
    }
  }
}
export default {
  components: {
    dyDate, // 注册日期选择器组件
  },
  name: 'load-management',

  data() {

    return {
      datetimesingle: '',
      canvas2d: this.$Config.ISCANVAS2D,
      dljTotalDeviceCount: "2", // "2"
      cdzTotalDeviceCount: "1",
      current: "load-management",
      // 选择日期
      selectDateType: 'date',
      selectTime: new Date(),
      deviceStatus: 1,
      // 设备数量
      deviceCount: {
        '充电桩': 0,
        '多联机': 0,
        '未知设备': 0,
        '模块机': 0,
        '能源站': 0
      },
      //实时设备信息
      nyzData: {
        dljQuantity: "2",
        cdzQuantity: "1",
        mkjQuantity: "--",
        lightQuantity: "0",
        unknownDeviceQuantity: "--",
        nyzFlexibility: "--",
        totalLoadrate: "--",
        totalEnergyEfficiencyLevel: "--"
      },
      // 负荷曲线
      curveLoading: false,
      loadOptions: {},
      softValueOptions: {},
      loadRateOptions: {},
      efficiencyOptions: {},
      loadChartOptions: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 10, 0, 15],
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
            title: "W"
          }]
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
      loadChartData: {
        categories: [],
        series: [{
          name: '空调总负荷功率',
          data: []
        }
        ]
      },
      opts: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 20, 0, 20],
        enableScroll: false,
        dataLabel: false,
        legend: {},
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          showTitle: true,
          data: [{
            title: "W"
          }]
        },
        extra: {
          area: {
            type: "curve",
            opacity: 0.2,
            addLine: true,
            width: 2,
            gradient: true,
            activeType: "hollow"
          }
        }
      },

      softChartOptions: {
        ...commonArcbarOptions,
        title: { name: `--%`, fontSize: 12 },
        subtitle: { name: '系统柔度', fontSize: 12 },
        color: ['#1890FF', '#36CFC9']
      },
      loadRateChartOptions: {
        ...commonArcbarOptions,
        title: { name: `--%`, fontSize: 12 },
        subtitle: { name: '负载率', fontSize: 12, },
        color: ['#FF9F5C', '#FFC53D']
      },
      efficiencyChartOptions: {
        ...commonArcbarOptions,
        title: { name: `--%`, fontSize: 12 },
        subtitle: { name: '能效水平', fontSize: 12 },
        color: ['#87D068', '#95DE64']
      },
      softChartData: { series: [{ data: 0 }] },
      loadRateChartData: { series: [{ data: 0 }] },
      efficiencyChartData: { series: [{ data: 0 }] },

      // 设备信息
      deviceList: [
        { deviceName: '设备名称', devId: "--", projectAddress: "--", deviceFlexibility: 0.6, deviceLoadRatio: 0, deviceEnergyEfficiencyLevel: 1 },
        { deviceName: '设备名称', devId: "--", projectAddress: "--", deviceFlexibility: 0.6, deviceLoadRatio: 0.3, deviceEnergyEfficiencyLevel: 2 },
        { deviceName: '设备名称', devId: "--", projectAddress: "--", deviceFlexibility: 0.6, deviceLoadRatio: 0.6, deviceEnergyEfficiencyLevel: 3 },
        { deviceName: '设备名称', devId: "--", projectAddress: "--", deviceFlexibility: 0.6, deviceLoadRatio: 0.9, deviceEnergyEfficiencyLevel: 1 },
      ],
      selectedDate: new Date().toISOString().split('T')[0],
    };
  },

  watch: {

    datetimerange(newval) {
      console.log('范围选:', this.datetimerange);
    }
  },
  mounted() {
    // this.getLoadCurve();

    this.datetimerange = ["2021-07-08 0:01:10", "2021-08-08 23:59:59"]
    this.getDeviceCount();
    this.getDeviceInfo();
    this.getNyzRealTimeData();
    this.findFlexibilityLoadPowerTotal(); //获取负荷曲线
    // this.findFlexibilityLoadPowerV2(); //获取负荷曲线
  },
  methods: {

    handleDatePicker(value) {
      this.selectedDate = value
      this.findFlexibilityLoadPowerTotal(); //获取负荷曲线
    },

    getEnergyColor(level) {
      const colors = { 1: '#FF4D4F', 2: '#FFC53D', 3: '#87D068' }
      return colors[level] || '#EEE'
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
          case "1712_V2":
            if (address == "64" && dataType == "2") {
              this.nyzData.dljQuantity = parseFloat(data.B4)
              // this.nyzData.cdzQuantity = parseFloat(data.B8)
              this.nyzData.mkjQuantity = parseFloat(data.B10)
              this.nyzData.unknownDeviceQuantity = parseFloat(data.B12)
              this.nyzData.nyzFlexibility = parseFloat(data.B14)
              this.nyzData.totalLoadrate = parseFloat(data.B16)
              this.nyzData.totalEnergyEfficiencyLevel = parseFloat(data.B18)

              this.softChartOptions.title.name = `${this.nyzData.nyzFlexibility || 0}`
              this.loadRateChartOptions.title.name = `${this.nyzData.totalLoadrate || 0}%`
              this.efficiencyChartOptions.title.name = `${this.nyzData.totalEnergyEfficiencyLevel || 0}级`
              this.softChartData = { series: [{ data: this.nyzData.nyzFlexibility || 0 }] };
              this.loadRateChartData = { series: [{ data: this.nyzData.totalLoadrate || 0 }] };
              this.efficiencyChartData = { series: [{ data: this.nyzData.totalEnergyEfficiencyLevel || 0 }] };
            }
            break;

          default:
            break;
        }
      })
    },

    async findFlexibilityLoadPowerTotal() {
      const result = await energy.findFlexibilityLoadPowerTotal({
        idcode: "F2 00 12 00 00 00 00 00 00 00 00 00 00 00 00",
        start: new Date(this.selectedDate).toISOString().split('T')[0] + ' 00:00:00',
        end: new Date(this.selectedDate).toISOString().split('T')[0] + ' 23:59:59',
        intervalMinutes: 1, aggregationType: 'MAX'
      });
      if (result.data) {

        this.loadChartData.categories = result.data.map(item => {
          return item.time.split(' ')[1].substring(0, 5)
        });
        this.loadChartData.series[0].data = result.data.map(item => item.power)


      }
    },




    // 获取设备数量
    async getDeviceCount() {
      try {
        const result = await energy.findAllDeviceInfo();
        if (result.data) {
          this.deviceCount = result.data.deviceInfoMap;
        }
      }
      catch (err) {
        console.error(err);
      }
    },

    getDeviceStatus(idx) {
      const map = {
        '0': '离线',
        '1': '等待注册',
        '2': '等待配置',
        '3': '运行',
        '4': '在线'
      };
      return map[idx]
    },
    // 获取设备信息
    async getDeviceInfo() {
      try {
        // const result = await this.$napi.energy.findDeviceEnergyInfo();
        const result = await energy.queryFlexibility({ barCode: "F2 00 12 00 00 00 00 00 00 00 00 00 00 00 00", typeCode: "1712_V2" });
        if (result.data) {
          console.log(result.data, "..............");
          const filterData = result.data.filter(item => item.deviceType != '0000')
          this.deviceList = filterData.map((item, index) => {
            item['deviceName'] = this.getDeviceName(item.deviceType)
            item['deviceStatusName'] = this.getDeviceStatus(item.networkStatus)
            item['deviceStatus'] = item.networkStatus
            item['type'] = item.deviceType
            item['deviceEnergyEfficiencyLevel'] = item.deviceEnergyEfficiencyLevel
            item['projectAddress'] = (index % 4) + 1
            return item
          });

          // 定义要添加的空调数据
          // 定义要添加的空调数据
          const generateDevice = (id, flexibility, loadRatio, efficiencyLevel) => ({
            deviceType: '2',
            networkStatus: 0,
            devId: `AC-${String(id).padStart(3, '0')}`,
            deviceFlexibility: flexibility,
            deviceLoadRatio: loadRatio.toFixed(2),
            deviceEnergyEfficiencyLevel: efficiencyLevel
          });

          const newAirConditioners = [
            {
              ...generateDevice(1, 0.7, 0.5, 2),
              deviceType: '3' // 特殊设备类型
            },
            ...Array.from({ length: 17 }, (_, i) => {
              const base = i % 3;
              return generateDevice(
                i + 2,
                0.6 + base * 0.1,
                0.4 + base * 0.1,
                base + 1
              );
            })
          ];


          // 处理新添加的空调数据并添加到 deviceList
          const newAirConditionersProcessed = newAirConditioners.map((item, index) => {
            const newIndex = this.deviceList.length + index;
            item['deviceName'] = this.getDeviceName(item.deviceType);
            item['deviceStatusName'] = this.getDeviceStatus(item.networkStatus);
            item['deviceStatus'] = item.networkStatus;
            item['type'] = item.deviceType;
            item['projectAddress'] = (newIndex % 4) + 1;
            return item;
          });

          this.deviceList = [...this.deviceList, ...newAirConditionersProcessed];
          this.dljTotalDeviceCount = this.deviceList.filter(item => item.deviceType === '0305' || item.deviceType === '2').length;
        }
      }
      catch (err) {
        console.error(err);
      }
    },
    getDeviceName(idx) {
      const map = {
        "0": "未知设备",
        "1": "分体机",
        "0305": "多联机",
        "3": "充电桩",
        "4": "照明",
        "306": "内机"
      }
      return map[idx]
    },

    // 点击设备
    onDeviceClick(device) {
      console.log(device)
    },

    // 进度条颜色
    getProgressEndColor(value) {
      const num = Math.round(value * 10) / 10;
      // ['#06e30a', '#06bb91', '#07a0eb']
      const gradientValueMap = {
        '0': '#32cd32',
        '0.1': '#2fc744',
        '0.2': '#2bc057',
        '0.3': '#28ba69',
        '0.4': '#24b47b',
        '0.5': '#21ad8e',
        '0.6': '#1ea7a0',
        '0.7': '#1aa1b2',
        '0.8': '#179bc4',
        '0.9': '#1394d7',
        '1': '#108ee9',
      };
      return gradientValueMap[num];
    }
  }
}
</script>

<style scoped>
.custom-picker {
  border: unset;
  max-width: fit-content;
}

.device-chart {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 240rpx;
}

.chart-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  width: 100%;
  padding: 0 20rpx;
}

.chart-item {
  min-width: 0;
  height: 280rpx;
  background: #FFF;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .chart-group {
    grid-template-columns: repeat(3, minmax(240rpx, 1fr));
  }

  .chart-item {
    height: 240rpx;
  }
}

@media (max-width: 480px) {
  .chart-group {
    grid-template-columns: repeat(3, minmax(200rpx, 1fr));
    gap: 12rpx;
  }

  .chart-item {
    height: 200rpx;
  }
}

.chart-item {
  flex: 1;
  /* max-width: 28%; */
  height: 240rpx;
  background: #FFF;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .chart-item {
    height: 200rpx;
  }
}

@media (max-width: 480px) {
  .chart-group {
    gap: 8rpx;
    padding: 0 16rpx;
  }


}


.device-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  overflow: hidden;
  // background: #f8f9fa;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.device-icon {
  width: 100%;
  height: 100%;
  // object-fit: contain;
  // padding: 8rpx;
}

/* .dashboard-chart {
  width: 100% !important;
  height: 100% !important;
} */

/* 添加响应式调整 */
@media (max-width: 480px) {
  .device-image {
    width: 100rpx;
    height: 100rpx;
  }
}



/* 基础容器 */
.container {
  padding: 10rpx;
}

/* 卡片样式 */
.card {
  background: #fff;
  border-radius: 6rpx;
  margin-bottom: 10rpx;

}

/* 区块标题 */
.section-header {
  border-bottom: 2rpx solid #eee;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between
}

.title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2c3e50;
  min-width: fit-content;
}

/* 图表容器 */
.chart-container {
  height: 480rpx;
}

/* 设备统计网格 */
.stats-grid {
  /* display: grid; */
  grid-template-columns: 2fr 1fr;
  gap: 24rpx;
}

.device-group {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.group-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.device-grid {
  display: flex;
  justify-content: space-between;
}

.device-item {
  width: 48%;
  text-align: center;
  padding: 12px;
  background: #F8FAFF;
  border-radius: 8px;
}

.number {
  font-size: 18px;
  font-weight: 600;
  color: #1890FF;
  margin-bottom: 4px;
}

.text {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

.device-grid {
  display: flex;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.device-item {
  flex: 1;
  padding: 24rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.device-item:active {
  transform: scale(0.98);
}

.number {
  font-size: 36rpx;
  font-weight: 700;
  color: #409EFF;
  margin-bottom: 8rpx;
}

.text {
  font-size: 28rpx;
  color: #2C3E50;
  margin-bottom: 4rpx;
}

.subtext {
  font-size: 24rpx;
  color: #666;
  opacity: 0.8;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .device-item {
    padding: 20rpx;
  }

  .number {
    font-size: 32rpx;
  }

  .text {
    font-size: 26rpx;
  }
}

.value {
  font-size: 36rpx;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 8rpx;
}

.label {
  font-size: 24rpx;
  color: #666;
}

/* 设备卡片 */
.device-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  margin-bottom: 16rpx;
  background: #fff;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  flex-direction: column;
}

.device-card:active {
  transform: scale(0.98);
  background: #f8f9fa;
}

/* 进度条容器 */
.progress-container {
  flex: 1;
  margin-left: 32rpx;
}

/* 能效水平指示器 */
.energy-level {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
}

.energy-level view {
  width: 60rpx;
  height: 24rpx;
  border-radius: 12rpx;
  opacity: 0.3;
  transition: opacity 0.3s;
}

.energy-level .active {
  opacity: 1;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .chart-container {
    height: 360rpx;
  }
}



/* 优化后的设备卡片样式 */
.device-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
}

.device-card {
  width: 48%;
  margin-bottom: 15px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 12px;
  box-sizing: border-box;
}

.device-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.device-image {
  text-align: center;
  margin: 8px 0;
}

// .device-icon {
//   width: 40px;
//   height: 40px;
// }

.device-info {
  margin-top: 8px;
}

.progress-group {
  margin: 8px 0;
}

.progress-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
}

.progress-label {
  width: 60px;
  font-size: 14px;
  color: #666;
}

.custom-progress-container {
  flex: 1;
  height: 12px;
  background-color: #f0f0f0;
  // border-radius: 6px;
  overflow: hidden;
  margin: 0 10px;
}

.custom-progress-bar {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-value {
  // width: 60px;
  text-align: right;
  font-size: 14px;
  color: #333;
}

.energy-indicator {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.indicator-title {
  width: 60px;
  font-size: 14px;
  color: #666;
}

.indicator-levels {
  display: flex;
  // gap: 15px;
  // padding: 5px 0;
}

.level-dot {
  width: 30px;
  height: 15px;
  // border-radius: 50%;
  border: 2px solid #fff;
  // box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  // transition: all 0.2s ease;
}

.level-dot.active {
  transform: scale(1.2);
  // box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

/* 能效颜色映射 */
.level-dot:nth-child(1) {
  background-color: #FF4D4F;
}

.level-dot:nth-child(2) {
  background-color: #FFC53D;
}

.level-dot:nth-child(3) {
  background-color: #87D068;
}

::v-deep .uni-date-btn--ok {
  padding: 10rpx 15px
}

::v-deep .uni-calendar--fixed {
  margin-bottom: 50px
}
</style>
