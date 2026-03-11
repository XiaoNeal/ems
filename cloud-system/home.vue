<template>
  <view class="container">


    <view class="project-intro">
      <text class="title">项目简介</text>
      <text>{{ projectInfo[projectId - 1].description }}</text>
    </view>

    <view class="image-container">
      <image :src="projectInfo[projectId - 1].imagePath" mode="aspectFill" class="project-image"
        :animation="fadeInAnimation"></image>
    </view>
    <view class="weather-card">
      <view class="weather-info">
        <view class="weather-item"><text>🌡️ 温度：</text>{{ weatherData.temperature }}℃</view>
        <view class="weather-item"><text>🌤️ 天气：</text>{{ weatherData.weather }}</view>
        <view class="weather-item"><text>🧭 风向：</text>{{ weatherData.winddirection }}（{{ weatherData.windpower }}级）
        </view>
        <view class="weather-item"><text>💧 湿度：</text>{{ weatherData.humidity }}%</view>
      </view>
      <view class="update-time">数据更新时间：{{ weatherData.reporttime }}</view>
    </view>
    <view class="stats-grid">

      <view class="stat-card ">
        <text class="stat-title">光伏板总装机容量</text>
        <view class="center-layout">
          <text class="stat-value">{{ projectInfo[projectId - 1] && projectInfo[projectId - 1].totalInstalledCapacity ||
            0 }}</text>
          <text class="unit-label">kWp</text>
        </view>
      </view>

      <view class="stat-card">
        <text class="stat-title">储能总额定容量</text>
        <view class="center-layout">
          <text class="stat-value">{{ projectInfo[projectId - 1] && projectInfo[projectId -
            1].totalEnergyStorageCapacity
            || 0 }}</text>
          <text class="unit-label">kWh</text>
        </view>
      </view>

      <view class="stat-card">
        <text class="stat-title">电网总容量</text>
        <view class="center-layout">
          <text class="stat-value">{{ projectInfo[projectId - 1] && projectInfo[projectId - 1].totalPowerSupplyCapacity
            || 0 }}</text>
          <text class="unit-label">kW</text>
        </view>
      </view>

      <view class="stat-card">
        <text class="stat-title">负荷配电总容量</text>
        <view class="center-layout">
          <text class="stat-value">{{ projectInfo[projectId - 1] && projectInfo[projectId - 1].totalLoadCapacity || 0
          }}</text>
          <text class="unit-label">kW</text>
        </view>
      </view>


    </view>

    <!-- 添加图表区域 -->
    <view class="charts-container">
      <view class="chart-group">
        <!-- 功率趋势图表 -->
        <view class="chart-card" style="width: 100%">
          <view class="chart-header">
            <text class="chart-title">📈 功率趋势</text>
            <view class="toolbar">
              <uni-datetime-picker v-model="selectedDate" type="date" placeholder="选择日期" class="date-picker"
                size="mini" />

            </view>
          </view>
          <view class="chart-wrapper">
            <qiun-data-charts type="line" :chartData="carbonChartData" :opts="carbonChartOptions" :ontouch="true"
              canvasId="XkloZdBtQYjFOYuZxpgSUAdZkogOMqxg" :canvas2d="canvas2d" :inScrollView="true" />
          </view>
        </view>

        <!-- 电量统计图表 -->
        <view class="chart-card" style="width: 100%">
          <view class="chart-header">
            <text class="chart-title">📊 电量统计</text>
          </view>
          <view class="chart-wrapper">
            <qiun-data-charts type="column" :chartData="electricityChartData" :canvas2d="canvas2d" :inScrollView="true"
              :opts="chartOptions" :ontouch="true" canvasId="electricity-chart" />
          </view>
        </view>
      </view>
    </view>

    <!-- 设备列表 -->
    <view class="device-list">
      <view class="device-grid">
        <view v-for="(item) in deviceList" :key="item.deviceId" class="device-card">
          <view class="device-header">
            <view class="device-title">
              <text v-show="!item.isEditDeviceName" class="device-name">{{ item.name }}</text>
              <!-- <uni-easyinput v-show="item.isEditDeviceName" v-model="editDeviceNameTemp[index]" :placeholder="item.name"
                class="device-name-input" /> -->
            </view>
            <view class="device-actions">

              <!-- <uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">底部弹出 Popup 自定义圆角</uni-popup> -->
              <uni-icons type="info" class="action-icon" @click.stop="showPopover($refs.popover)"></uni-icons>
              <uni-popup ref="popover" type="center">

                <!-- <template #content> -->
                <view class="device-info-popup">
                  <text>设备ID: {{ item.deviceId }}</text>
                  <text>设备类型: {{ item.deviceType }}</text>
                  <text>地址: 0x{{ item.address }}</text>
                  <text>网关号: {{ item.barCode }}</text>
                </view>
                <!-- </template> -->
              </uni-popup>

            </view>
          </view>
          <view class="device-data-grid">
            <view v-for="(data, key) in getDeviceData(item)" :key="key" class="data-item">
              <text class="data-label">{{ data.label }}</text>
              <text class="data-value">
                <text class="value">{{ data.value }}</text>
                <text class="unit">{{ data.unit }}</text>
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import * as dateUtils from "@/utils/date";
import { useStore } from 'vuex';
// import DatePicker from "@/components/DatePicker.vue";
// import Popup from './popup.vue';
import {
  queryAllEnergyStationSituation,
  queryEnergyStationByDay,
  queryEnergyStationByMonth,
  queryEnergyStationByYear,
  alterDeviceNameByDeviceId
} from "@/api/devices";
import { RealtimeDataProviderService } from '@/service/socket/realtime-data-provider.js';
import { queryEnergyStationNameList } from "@/api/report";
import {
  queryDayGeneratedPower,
  queryMonthGeneratedPower,
  queryYearGeneratedPower,
  queryDayElectricityStatistic,
  queryMonthElectricityStatistic,
  queryYearElectricityStatistic,
  getWeather
} from "@/api/index";
import { projectInfo } from './projectInfo';
import { mapState, mapGetters } from 'vuex';
export default {

  // components: {
  //   // DatePicker,
  // },
  data() {

    return {
      canvas2d: this.$Config.ISCANVAS2D,
      carbonChartData: {},
      electricityChartData: {},
      carbonChartOptions: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [10, 15, 25, 15],
        dataLabel: false,
        enableScroll: true,
        enableMarkLine: true,
        legend: {},
        xAxis: {
          // labelCount: 4,
          itemCount: 12,
          fontSize: 8,
          rotateLabel: true,
          disableGrid: true,
          gridColor: "#CCCCCC",
          gridType: "solid",
          dashLength: 4,
          scrollShow: true,
          scrollAlign: "left",
          scrollColor: "#A6A6A6",
          scrollBackgroundColor: "#EFEBEF"
        },
        yAxis: {
          // showTitle: true,
          position: 'right',          // 将y轴定位到右侧
          axisLabel: {
            align: 'right',          // 标签右对齐
            margin: 20,              // 增加右侧间距
            verticalAlign: 'bottom'  // 垂直对齐方式
          },
          gridType: "dash",
          dashLength: 4,
          splitNumber: 5,
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
      chartOptions: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [10, 15, 25, 15],
        dataLabel: false,
        enableScroll: true,
        legend: {},
        xAxis: {
          disableGrid: true,
          // rotateAngle: 90, // 标签旋转45度
          rotateLabel: false,
          itemCount: 12, // 显示间隔为2小时（24小时数据）
          fontSize: 8, // 缩小字体
          boundaryGap: true,
          splitNumber: 12, // 显示12个刻度
          axisLabel: {
            interval: 2, // 间隔显示标签（0时、2时、4时...）
            width: 60,
            showMaxLabel: true, // 始终显示最后一个标签
            formatter: function (value, index) {
              return index % 2 === 0 ? value : ''; // 每隔1个显示标签
            }
          },
          scrollShow: true // 启用滚动条
        },
        yAxis: {
          showTitle: true,
          fontSize: 12,
          labelInterval: 2,
          gridType: "dash",
          dashLength: 4,
          splitNumber: 5,
          data: [{
            title: '电量(kWh)',
            type: 'value',
            // min: 0,
            // max: 1000,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#666'
              }
            }
          }]
        },
        extra: {
          column: {
            type: "group",
            width: 30,
            activeBgColor: "#000000",
            activeBgOpacity: 0.08
          }
        }
      },
      tenMinInterval: null,
      powerStationNameList: [],
      chartsDataLoading: true,
      isShowMask: false,
      dayDate: Array.from({ length: 24 }, (_, i) => `${i}时`),
      selectedEsId: 1,
      deviceList: [],
      deviceName: "",
      radioIndex: 0,
      getDeviceId: "",
      realTimeService: null,
      storageDevice: [],
      totalDeviceList: [],
      totalStorageData: [],
      editDeviceNameTemp: [],
      isEditDeviceName: false,
      projectInfo,
      API_URL: 'https://restapi.amap.com/v3/weather/weatherInfo',
      KEY: 'a25401720ebdc8f010c616ce1a0069ee',
      weatherData: {
        temperature: '--',
        weather: '--',
        winddirection: '--',
        windpower: '--',
        humidity: '--',
        reporttime: '--'
      },
      loading: true,
      error: null,
      cityName: '',
      projectId: undefined,
      lineLoading: false,
      barLoading: true,
      selectedDate: dateUtils.dateYMD(new Date())
    };
  },
  computed: {
    ...mapState( ['user','hasLogin', 'userName'])
  },
  methods: {
    showPopover(popover) {
      popover.open()
    },
    formatChartData(res) {
      const categories = [];
      const series = [];

      res.data.data.forEach(element => {
        categories.push(element.time);
        series.push(element.value);
      });

      return {
        categories,
        series: [{
          name: '数据',
          data: series
        }]
      };
    },

    // 统一设备数据处理
    getDeviceData(item) {
      const data = [];
      const { energyData } = item;

      // 处理电压电流数据
      if (item.deviceType === "1803_V2_2") {
        ['A', 'B', 'C'].forEach(phase => {
          data.push(
            { label: `${phase}相电压`, value: energyData[`phase${phase}`].Voltage, unit: "V" },
            { label: `${phase}相电流`, value: energyData[`phase${phase}`].Current, unit: "A" }
          );
        });
      } else {
        data.push(
          { label: "最新电压", value: energyData.voltage?.value || 0, unit: "V" },
          { label: "最新电流", value: energyData.current?.value || 0, unit: "A" }
        );
      }

      // 处理功率数据
      const powerValue = energyData.power?.value;
      const activePowerValue = energyData.activePower?.value;
      const source = energyData.power && powerValue != null ? energyData.power :
        energyData.activePower && activePowerValue != null ? energyData.activePower :
          energyData.activePower;

      data.push({
        label: "最新功率",
        value: source?.value ?? source,
        unit: source ? "kW" : "W"
      });

      return data;
    },

    async fetchWeather(city_code) {
      try {
        const response = await getWeather(this.API_URL, {
          params: {
            city: city_code,
            key: this.KEY,
            extensions: 'base' // 获取实时天气
          }
        })
        if (response.status === '1') {
          const { temperature, weather, winddirection, windpower, humidity, reporttime } = response.lives[0];
          this.weatherData = {
            temperature,
            weather,
            winddirection,
            windpower: windpower.replace('≤', ''),
            humidity,
            reporttime
          };
          this.cityName = response.lives[0].city;
        } else {
          throw new Error(response.info || '获取天气数据失败')
        }
      } catch (err) {
        // error.value = err.message || '接口请求失败'
        console.log('获取天气数据失败:', err)
      } finally {
        this.loading = false
      }
    },

    // 获取设备列表
    async getDeviceList(esId) {
      this.$nextTick(async () => {
        this.realTimeService = new RealtimeDataProviderService();
        let res = await queryAllEnergyStationSituation(esId);
        let findData = [];
        let storageData = [];
        res.data.forEach((item) => {

          if (
            item.typeCode == "1803_V2_2" ||
            item.typeCode == "1804_V2_2"
          ) {
            findData.push(item);
          } else {
            storageData.push(item);
          }
        });
        // 统一排序
        const order = ["交流", "PCS", "BMS", "光伏", "负载"]
        const getOrderIndex = (name) => {
          let index = order.indexOf(name)
          if (index === -1) {
            index = order.findIndex((key) => name.includes(key))
          }
          return index
        }
        findData = findData.sort((a, b) => {
          const indexA = getOrderIndex(a.name)
          const indexB = getOrderIndex(b.name)
          if (indexA === -1 && indexB === -1) return 1
          if (indexA === -1) return 1
          if (indexB === -1) return -1
          if (indexA === indexB) {
            return a.address - b.address
          }
          return indexA - indexB
        })
        this.realTimeService.initDeviceList(findData);
        let deviceLists = this.realTimeService.getDeviceList();
        deviceLists.forEach(item => {
          item.isEditDeviceName = false
        })
        let obj = {
          esId: esId,
          datas: deviceLists,
        };
        let obj2 = {
          esId: esId,
          datas: storageData,
        };
        this.totalDeviceList.push(obj);
        this.totalStorageData.push(obj2);
        this.deviceList = deviceLists;
        this.storageDevice = storageData;
        this.$store.commit("changeStorageRealData", storageData);
      });
    },

    // 打开弹窗或跳转储能详细页面
    popupDeviceDatas(name, id) {
      this.isShowMask = true;
      this.deviceName = name;
      const currentTime = dateUtils.dateYMD(new Date());
      const day = new Date();
      let month = day.getMonth() + 1;
      let year = day.getFullYear();
      // this.getDeviceId = id;
      this.getDeviceId = 1
      this.initElectricityCharts(id, "date", currentTime, month, year);
    },

    // 处理切换不同日期
    handleDatePicker(value) {
      this.initElectricityCharts(
        this.getDeviceId,
        value.dateType,
        value.day.slice(0, 10),
        value.month,
        value.year
      );
    },


    // 禁用未来日期
    disabledDate(time) {
      return time.getTime() > Date.now();
    },

    // 处理日期变化
    handleDateChange(value) {
      if (value) {
        getTodayPowerData(this.projectId);
        getTodayElectricityData(this.projectId);
      }
    },

    // 获取当日曲线数据
    async getTodayPowerData(esId = 1) {

      this.lineLoading = true;
      const currentDate = this.selectedDate || dateUtils.dateYMD(new Date());
      try {
        const res = await queryDayGeneratedPower(esId, currentDate);
        const xAxisArr = this.generateTimeArray();
        const datas = res.data.reduce((pre, curr) => {
          pre.generated.push(Math.abs(curr.generatedPower).toFixed(2));
          pre.storage.push(parseFloat(curr.storagePower).toFixed(2));
          pre.grid.push(parseFloat(curr.gridPower).toFixed(2));
          pre.load.push(parseFloat(curr.loadPower).toFixed(2));
          return pre;
        }, {
          generated: [],
          storage: [],
          grid: [],
          load: []
        });
        this.initCarbonChart(datas, xAxisArr);

      } catch (error) {
        console.error("获取功率趋势数据失败:", error);
        this.lineLoading = false;
      }
    },

    // 获取当日电量柱状图数据
    async getTodayElectricityData(esId = 1) {
      this.barLoading = true;
      try {
        const currentDate = this.selectedDate || dateUtils.dateYMD(new Date());
        const res = await queryDayElectricityStatistic(esId, currentDate);

        let loadPower = [];
        let photovoltaicPower = [];
        let storageCharge = [];
        let storageDischarge = [];
        let gridPowerSupply = [];
        let gridPowerSupplyReverse = [];
        const barDate = Array.from({ length: 24 }, (_, i) => `${i}h`);
        res.data.forEach((item) => {
          loadPower[item.hour] = item.loadPower;
          photovoltaicPower[item.hour] = item.photovoltaicPower;
          storageCharge[item.hour] = item.storageCharge;
          storageDischarge[item.hour] = item.storageDischarge;
          gridPowerSupply[item.hour] = item.gridPowerSupply;
          gridPowerSupplyReverse[item.hour] = item.gridPowerSupplyReverse;
        });

        const isOpposite = [4].includes(this.$store.state.powerStationsId)
        // const isOpposite = true
        if (isOpposite) {
          this.initchartElectricity(photovoltaicPower, loadPower, gridPowerSupply, gridPowerSupplyReverse, storageCharge, storageDischarge, barDate);
        } else {
          this.initchartElectricity(photovoltaicPower, loadPower, gridPowerSupply, gridPowerSupplyReverse, storageDischarge, storageCharge, barDate);
        }
      } catch (error) {
        console.error("获取电量统计数据失败:", error);
        this.barLoading = false;
      }
    },
    // 初始化电量统计图表
    initchartElectricity(pvData, loadData, gridSupply, gridSupplyReverse, storageCharge, storageDischarge, dates) {

      this.electricityChartData = this.initChart({
        categories: dates,
        series: [
          { name: '光伏', data: pvData },
          { name: '负载', data: loadData },
          { name: '充电', data: storageCharge },
          { name: '放电', data: storageDischarge },
          { name: '供电', data: gridSupply },
          { name: '馈电', data: gridSupplyReverse }
        ]
      }, 'bar', 'electricity-chart', '电量统计');
      // this.barLoading = false;
    },


    // 统一图表初始化方法
    initChart(chartData, chartType, canvasId, title) {
      return {
        categories: chartData.categories,
        series: chartData.series.map(series => ({
          ...series,
          type: chartType,
          showSymbol: true
        })),
        title: {
          text: title,
        }
      };
    },

    // 图表相关定时更新
    // 统一管理定时器
    manageInterval(callback, interval = 10 * 60 * 1000) {
      if (this.tenMinInterval) {
        clearInterval(this.tenMinInterval);
      }
      this.tenMinInterval = setInterval(() => {
        if (this.selectedDate === dateUtils.dateYMD(new Date())) {
          callback();
        }
      }, interval);
    },


    // 初始化碳排放曲线图
    initCarbonChart(datas, xAxisArr) {
      console.log('initCarbonChart', datas, xAxisArr)
      this.carbonChartOptions.xAxis.itemCount = 12;
      this.carbonChartData = this.initChart({
        categories: xAxisArr,
        series: [
          { name: '光伏', data: datas.generated },
          { name: '负载', data: datas.load },
          { name: '储能', data: datas.storage },
          { name: '电网', data: datas.grid }
        ]
      }, 'line', 'carbon-chart', '功率趋势');
      // this.carbonChartData = JSON.parse(JSON.stringify(carbonChartData));
      this.lineLoading = false;
    },

    // 五分钟时间列表
    generateTimeArray() {
      const times = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
          const formattedHour = hour.toString().padStart(2, '0');
          const formattedMinute = minute.toString().padStart(2, '0');
          times.push(formattedHour + ':' + formattedMinute);
        }
      }
      return times;
    },

    // 新增小时列表
    generateHourArray() {
      const hours = [];
      for (let hour = 0; hour < 24; hour++) {
        const formattedHour = hour.toString().padStart(2, '0');
        hours.push(`${formattedHour}h`);
      }
      return hours;
    },


    initPowerStationId() {
      // if (!this.$store.getters['user/isSingle']) return
      console.log('store.state.user.stationIds[0]', this.$store.state.user.stationIds[0])
      const id = this.$store.state.user.stationIds[0]
      this.$store.commit("changePowerStationId", id);
      // localStorage.setItem("powerStationsId", id);
    }

  },


  // 观察esId是否有变化，并更新设备
  watch: {
    '$store.state.powerStationsId': {
      handler: async function (newVal, oldVal) {
        console.log("状态变更:", newVal, oldVal)
        // if (newVal === oldVal) return;
        // this.selectedDate = dateUtils.dateYMD(new Date());
        // try {
        //   await Promise.all([
        //     this.getTodayPowerData(newVal),
        //     this.getTodayElectricityData(newVal)
        //   ]);
        //   this.projectId = newVal;
        //   await this.fetchWeather(this.projectInfo[newVal - 1].city_code);
        //   this.selectedEsId = newVal;

        //   // 优化设备列表查找逻辑
        //   const targetDevice = this.totalDeviceList.find(item => newVal == item.esId);
        //   if (targetDevice) {
        //     this.$store.commit("changeStorageRealData", 
        //       this.totalStorageData.find(t => t.esId === newVal)?.datas || []
        //     );
        //     this.deviceList = targetDevice.datas;
        //   } else {
        //     this.realTimeService.unregister();
        //     await this.getDeviceList(newVal);
        //   }
        // } catch (err) {
        //   console.error("状态监听错误:", err)
        // }
      },
      immediate: true
    }
  },


  beforeMount() {
    // 清除定时器
    if (this.tenMinInterval) {
      clearInterval(this.tenMinInterval);
    }
  },

  beforeDestroy() {
    // 清除定时器
    if (this.tenMinInterval) {
      clearInterval(this.tenMinInterval);
    }

  },
  mounted() {
    this.initPowerStationId()
    const esId = this.$store.state.powerStationsId
    console.log('m this.$store.state.powerStationsIdounted', this.$store.state, this.hasLogin, this.user, this.$store.state.powerStationsId);
    this.getDeviceList(esId);
    this.projectId = esId;
    this.fetchWeather(this.projectInfo[esId - 1].city_code);
    console.log('mounted', this.projectInfo[esId - 1]);
    this.getTodayPowerData(esId);
    this.getTodayElectricityData(esId);
    // 使用统一方法管理定时器
    this.manageInterval(() => {
      this.getTodayPowerData(this.selectedEsId);
      this.getTodayElectricityData(this.selectedEsId);
    });

    // 天气更新定时器
    this.manageInterval(this.fetchWeather, 5 * 60 * 1000);
  }
}

</script>



<style lang="scss" scoped>
.container {
  padding: unset;
}

.dashboard {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.left-panel {
  flex: 1;
  background-color: #fff;
  border-radius: 12px;
  // padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.project-intro {
  margin-bottom: 24px;

  .title {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
  }

  text {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
}

.right-panel {
  image {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    object-fit: cover;
  }
}

.weather-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;

  .weather-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 16px;

    .weather-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #333;

      text {
        color: #666;
      }
    }
  }

  .update-time {
    font-size: 12px;
    color: #999;
    text-align: right;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  .stat-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .stat-title {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      font-size: 24px;
      font-weight: 500;
      text-align: center;
      line-height: 1.3;
      color: #2d3436;

      .unit {
        font-size: 14px;
        color: #999;
        margin-left: 4px;
      }
    }
  }
}

.stat-card {
  flex-direction: column;
  align-items: flex-start;
}

.center-layout {
  text-align: center;
}


.unit-label {
  font-size: 14px;
  color: #888;
  margin-top: 2px;
  text-align: center;
  width: 100%;
  margin-top: 6px;
}

.charts-container {
  // padding: 0 12px; /* 与仪表盘区域统一 */
  margin-top: 16px;
  /* 保持垂直间距一致 */
}

.chart-group {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  /* 保持响应式列宽 */
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 统一阴影参数 */
  overflow: hidden;
  width: 100%;
  /* 强制宽度填充 */
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-picker {
  width: 120px;
}

.export-btn {
  padding: 4px 8px;
  border-radius: 4px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  gap: 4px;
}

.chart-wrapper {
  height: 300px;
  padding: 12px;
}

.device-list {
  padding: 20px 0;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.device-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: transform 0.2s;
}

.device-card:hover {
  transform: translateY(-2px);
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.device-title {
  flex: 1;
}

.device-name {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.device-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-icon {
  font-size: 20px;
  color: #666;
  padding: 4px;
}

.action-icon:hover {
  color: #409eff;
}

.confirm-btn {
  color: #409eff;
  cursor: pointer;
  font-weight: 500;
}

.device-data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.data-item {
  background: #f5f7fa;
  padding: 8px;
  border-radius: 8px;
}

.data-label {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.data-value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.unit {
  font-size: 14px;
  color: #999;
  margin-left: 4px;
}

.device-info-popup {
  padding: 12px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.edit-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-btn {
  padding: 4px 8px;
  border-radius: 4px;
  background: #f0f0f0;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.confirm-group {
  display: flex;
  gap: 4px;
}

.confirm-btn,
.cancel-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.confirm-btn {
  background: #007aff;
  color: white;
}

.cancel-btn {
  background: #ff3b30;
  color: white;
}

.image-container {
  margin: 20rpx 0;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.project-image {
  display: block;
  width: 100%;
  height: 400rpx;
  border-radius: 16rpx;
  transform-origin: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-image:hover {
  transform: scale(1.02);
  box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.15);
}

/* 添加加载动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.project-image {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

::v-deep .uni-calendar--fixed {
  bottom: 80rpx !important;
}
</style>