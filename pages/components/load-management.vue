<template>
  <view class="container">

    <!-- 设备统计区块 -->
    <view class="card device-stats">
      <view class="section-header">
        <text class="title">设备信息</text>
      </view>
      <view class="device-grid">
        <view class="device-item">
          <text class="number">{{ deviceCounts.dljQuantity }}</text>
          <text class="text">空调</text>
        </view>
        <view class="device-item">
          <text class="number">{{ deviceCounts.cdzQuantity }}</text>
          <text class="text">充电桩</text>
        </view>
        <view class="device-item">
          <text class="number">{{ deviceCounts.lightQuantity }}</text>
          <text class="text">照明</text>
        </view>
        <view class="device-item">
          <text class="number">{{ deviceCounts.unknownDeviceQuantity }}</text>
          <text class="text">未知设备</text>
        </view>
      </view>
    </view>

    <!-- 负荷曲线区块 -->
    <view class="card">
      <view class="section-header">
        <text class="title">负荷曲线</text>
        <dy-date timeType="day" @getData="handleDatePicker" v-model="selectedDate" class="custom-picker date-picker" />
      </view>
      <view class="chart-container">
        <view v-if="curveLoading" class="chart-loading">
          <view class="loading-spinner"></view>
          <text class="loading-text">加载中...</text>
        </view>
        <view v-else-if="loadChartData.series[0] && loadChartData.series[0].data.length > 0" class="chart-loaded">
          <qiun-data-charts type="area" :chartData="loadChartData" :opts="loadChartOptions" :ontouch="true"
            :canvas2d="canvas2d" class="main-chart" :canvas-id="chartId + '-load'" />
        </view>
        <EmptyState v-else title="暂无数据" desc="当前时段暂无负荷数据" @refresh="findFlexibilityLoadPowerTotal" />
      </view>
    </view>

    <!-- 设备列表 -->
    <view class="card device-list" >
      <view class="list-header">
        <text class="list-title">负荷列表</text>
        <!-- <view class="access-setting-btn" @click="goToAccessSetting">
          <text class="setting-icon">⚙️</text>
          <text class="setting-text">接入设置</text>
        </view> -->
      </view>

      <!-- 卡片网格容器 -->
      <view class="device-card-grid">
        <view v-for="(item, index) in deviceList" :key="index" @click="onDeviceClick(item)" class="device-card">
          <view class="device-name">{{ item.deviceName }}</view>
          <!-- 设备图标 -->
          <view class="device-image">
            <img class="device-icon" v-if="isVrvType(item.type)" src="../../community/static/images/VRV.png" />
            <img class="device-icon" v-else-if="isChargingPileType(item.type)" src="../../community/static/images/load-chargingPile.png" />
            <img class="device-icon" v-else-if="isDcAcType(item.type)" src="../../community/static/images/load-airconditioner.png" />
            <img class="device-icon" v-else src="../../community/static/images/VRV.png" />
          </view>
          <!-- 设备信息 -->
          <view class="device-info">
            <view class="device-data">
              <view class="data-item">
                <text class="data-label">功率</text>
                <text class="data-value">{{ item.power || '--' }} kW</text>
              </view>
              <!-- <view class="data-item">
                <text class="data-label">用电量</text>
                <text class="data-value">{{ item.energyConsumption || '--' }} kWh</text>
              </view> -->
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
import { getFlexDeviceInfo } from '@/api/devices';
import {  getPowerData } from '../../api/power'
import dyDate from '@/components/dy-Date/dy-Date.vue';
import EmptyState from '@/components/empty-state/empty-state.vue';
import { realtimeDataProvider } from '@/service/websocket';
const commonArcbarOptions = {
  padding: [15, 15, 0, 15],
  title: { name: '75%', fontSize: 12, color: '#1890FF' },
  subtitle: { name: '完成率', fontSize: 12, color: '#666' },
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
import { calculateYAxisMax } from '@/utils/tools';

export default {
  components: { dyDate, EmptyState },
  name: 'load-management',
  data() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    return {
      chartId: 'load-' + Math.random().toString(36).substr(2, 9),
      datetimesingle: '',
      canvas2d: this.$Config.ISCANVAS2D,
      dljTotalDeviceCount: "2",
      cdzTotalDeviceCount: "1",
      current: "load-management",
      selectDateType: 'date',
      selectTime: new Date(),
      deviceStatus: 1,
      deviceCount: {
        '充电桩': 0,
        '多联机': 1,
        '未知设备': 0,
        '模块机': 0,
        '能源站': 0
      },
      nyzData: {
        dljQuantity: "1",
        cdzQuantity: "1",
        mkjQuantity: "0",
        lightQuantity: "0",
        unknownDeviceQuantity: "0",
        nyzFlexibility: "--",
        totalLoadrate: "--",
        totalEnergyEfficiencyLevel: "--"
      },
      curveLoading: false,
      loadOptions: {},
      softValueOptions: {},
      loadRateOptions: {},
      efficiencyOptions: {},

      loadChartData: {
        categories: [],
        series: [{ name: '总功率', data: [] }]
      },
      loadChartMax: 1,
      opts: {},
      softChartOptions: { ...commonArcbarOptions, title: { name: `--%`, fontSize: 12 }, subtitle: { name: '系统柔度', fontSize: 12 }, color: ['#1890FF', '#36CFC9'] },
      loadRateChartOptions: { ...commonArcbarOptions, title: { name: `--%`, fontSize: 12 }, subtitle: { name: '负载率', fontSize: 12, }, color: ['#FF9F5C', '#FFC53D'] },
      efficiencyChartOptions: { ...commonArcbarOptions, title: { name: `--%`, fontSize: 12 }, subtitle: { name: '能效水平', fontSize: 12 }, color: ['#87D068', '#95DE64'] },
      softChartData: { series: [{ data: 0 }] },
      loadRateChartData: { series: [{ data: 0 }] },
      efficiencyChartData: { series: [{ data: 0 }] },
      deviceList: [],
      selectedDate: today,
      device1712: null,
      device1713: null,
      realtimeLoadDevices: [],
      deviceListRealtime: [],
    };
  },
  mounted() {
    this.datetimerange = ["2021-07-08 0:01:10", "2021-08-08 23:59:59"]
    this.getDeviceCount();
    this.findFlexibilityLoadPowerTotal();
    this.loadDeviceList();
  },
  beforeDestroy() {
    realtimeDataProvider.onDataUpdate = null;
  },
  computed: {
    // 设备分类统计：从 deviceList 实时计算，保证与列表一致
    deviceCounts() {
      let dlj = 0, cdz = 0, light = 0, unknown = 0
      this.deviceList.forEach(item => {
        const hex = this.getTypeHex(item.type)
        if (hex === '0x0305' || hex === '0x0306' || hex === '0x1313') {
          dlj++
        } else if (hex === '0x1310') {
          cdz++
        } else if (hex === '0x0201') {
          light++
        } else {
          unknown++
        }
      })
      return {
        dljQuantity: dlj,
        cdzQuantity: cdz,
        lightQuantity: light,
        unknownDeviceQuantity: unknown
      }
    },
    loadChartOptions() {
      const maxValue = calculateYAxisMax(this.loadChartData.series[0]?.data || []);
      return {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        dataLabel: false,
        dataPointShape: false,
        xAxis: { labelCount: 6, disableGrid: true,type:"time",  boundaryGap: true, },
        padding: [15, 20, 20, 15],
        yAxis: {
          gridType: "dash",
          showTitle: true,
          data: [{ position: "left", title: "单位:kW", min: null, max: maxValue }],
          dashLength: 2,
          tofix: 2
        },
        extra: { area: { type: "curve", gradient: true } }
      }
    }
  },
  methods: {
    // 辅助方法：获取类型的十六进制值
    // 接口返回可能是：
    //   - 十进制数字字符串（如 "4880"）→ 转换为十六进制 "0x1310"
    //   - 十六进制字符串（如 "0305", "1310"）→ 直接使用
    // 策略：先尝试作为十六进制查找，再回退到十进制转换
    getTypeHex(type) {
      if (!type) return '';
      const str = String(type).trim();
      
      // 十六进制类型映射表（用于验证）
      const validTypes = {
        '0x0000': true, '0x0305': true, '0x0306': true,
        '0x1310': true, '0x0201': true, '0x1804': true,
        '0x1311': true, '0x1312': true, '0x1313': true
      };
      
      // 1. 如果有 0x 前缀，直接规范化
      if (str.startsWith('0x') || str.startsWith('0X')) {
        return '0x' + str.slice(2).toUpperCase().padStart(4, '0');
      }
      
      // 2. 先尝试当作十六进制字符串处理
      const hexCandidate = '0x' + str.toUpperCase().padStart(4, '0');
      if (validTypes[hexCandidate]) {
        return hexCandidate;
      }
      
      // 3. 如果包含 A-F 字符，一定是十六进制
      if (/[A-Fa-f]/.test(str)) {
        return hexCandidate;
      }
      
      // 4. 尝试当作十进制处理
      const numVal = parseInt(str, 10);
      if (!isNaN(numVal)) {
        const decToHex = '0x' + numVal.toString(16).toUpperCase().padStart(4, '0');
        if (validTypes[decToHex]) {
          return decToHex;
        }
        // 如果转换后也在表中，返回
        return decToHex;
      }
      
      return '';
    },
    // 判断是否为VRV空调类型
    isVrvType(type) {
      const hex = this.getTypeHex(type);
      return hex === '0x0305' || hex === '0x0306';
    },
    // 判断是否为充电桩类型
    isChargingPileType(type) {
      const hex = this.getTypeHex(type);
      return hex === '0x1310';
    },
    // 判断是否为直流空调类型
    isDcAcType(type) {
      const hex = this.getTypeHex(type);
      return hex === '0x1313';
    },
    async loadDeviceList() {
      try {
        const currentDevice = this.$store.state.currentSelectDevice || {};
        const areaLevelId = currentDevice.areaLevelId || this.$store.state.areaInfoId || '';
        const result = await getFlexDeviceInfo(areaLevelId);
        
        const resultData = result && result.data ? result.data : result;
        
        if (resultData && resultData.load && Array.isArray(resultData.load)) {
          const loadList = resultData.load;

          // 收集所有设备用于实时数据注册
          const allDevices = [];
          ['pv', 'storage', 'grid', 'load', 'standby'].forEach(key => {
            if (resultData[key] && Array.isArray(resultData[key])) {
              allDevices.push(...resultData[key]);
            }
          });
          console.log(allDevices,'allDevices')

          // 注册所有设备到 realtimeDataProvider
          if (allDevices.length > 0) {
            const deviceConfigs = allDevices.map(item => {
              const isFlexDevice = item.flexDevice === '1';
              // load 设备统一归为 1714
              const code = item.realTypeCode || (isFlexDevice ? '1714' : item.deviceType) || '1714';
              const finalCode = code === '0305' ? '1714' : code;
              return {
                deviceType: finalCode,
                typeCode: finalCode,
                rawDeviceType: item.deviceType || '',
                address: item.realAddress || item.address || '',
                barCode: item.barCode || '',
                deviceId: item.deviceId || item.devId || '',
                name: item.deviceName || `设备${finalCode}`
              };
            });
            console.log(deviceConfigs,'deviceConfigs',allDevices)

            realtimeDataProvider.initDeviceList(deviceConfigs);
            
            realtimeDataProvider.onDataUpdate = () => {
              if (this._isUserInteracting) return;
              this.updateDeviceFromRealtime();
            };
          }

          // 使用 load 数据初始化设备列表（作为基础数据，实时数据到达后会覆盖数值）
          this.initDeviceListFromApi(loadList);
          // 尝试用实时数据更新（如果有的话）
          this.updateDeviceFromRealtime();
          this.updateNyzData();
        } else {
          console.warn('接口返回数据格式异常，未找到 load 数组');
          // this.initDefaultDevices();
        }
      } catch (err) {
        console.error('加载柔性设备列表失败:', err);
        // this.initDefaultDevices();
      }
    },
    initDeviceListFromApi(loadList) {
      const typeMap = { '0': '无效', '1': '分体机', '2': '多联机', '3': '充电桩', '4': '照明' };
      const statusMap = { '0': '离线', '1': '等待注册', '2': '等待配置', '3': '运行', '4': '在线' };
      // 十六进制类型映射表
      const flexTypeMap = {
        '0x0000': '无效',
        '0x0305': '多联机外机',
        '0x0306': '多联机内机',
        '0x1310': '充电桩',
        '0x0201': '照明',
        '0x1804': '直流表',
        '0x1311': '光伏',
        '0x1312': '直流电梯',
        '0x1313': '直流空调'
      };
      
      this.deviceList = loadList.map(item => {
        const rawType = item.deviceType != null ? String(item.deviceType) : '';
        const statusVal = item.networkStatus != null ? String(item.networkStatus) : '';
        // 统一使用 realAddress 作为匹配键，确保与实时数据一致
        const matchAddress = item.realAddress || item.address || '';
        // 使用 getTypeHex 转换类型
        const typeHex = this.getTypeHex(rawType);
        const typeLabel = flexTypeMap[typeHex] || typeMap[rawType] || rawType || '--';
        const devId = item.devId || item.deviceId || '--';
        // 设备名称：类型 + devId
        const deviceName = `${typeLabel}${devId}`;
        console.log(item,typeLabel,rawType,flexTypeMap,'item')
        return {
          deviceName:  item.deviceName,
          devId: devId,
          deviceId: item.deviceId || item.devId || '--',
          address: matchAddress,  // 使用 realAddress 匹配
          originalAddress: item.address || '',  // 保留原始 address
          type: rawType,
          typeLabel: typeLabel,
          deviceStatusName: statusMap[statusVal] || '--',
          projectAddress: item.nickName || item.deviceName || '--',
          gateway: item.barCode || '--',
          deviceFlexibility: item.flexibility != null ? parseFloat(item.flexibility) / 100 : 0,
          deviceLoadRatio: item.loadRatio != null ? parseFloat(item.loadRatio) / 100 : 0,
          deviceEnergyEfficiencyLevel: item.energyEfficiencyLevel != null ? parseInt(item.energyEfficiencyLevel) : 0,
          // 接口返回的功率需要除以1000（单位转换：W → kW）
          power: item.power != null ? (parseFloat(item.power) / 1000).toFixed(2) : '0.00',
          energyConsumption: '0.00',
          adjustablePower: item.adjustablePower != null ? (parseFloat(item.adjustablePower) / 1000).toFixed(2) : '0.00',
          powerUpCap: item.powerUpCap != null ? (parseFloat(item.powerUpCap) / 1000).toFixed(4) : '0.0000',
          powerDownCap: item.powerDownCap != null ? (parseFloat(item.powerDownCap) / 1000).toFixed(4) : '0.0000',
          flexDevice: item.flexDevice || '0',
          _rawData: item,
          _rawEnergyData: null
        };
      });
    },
    // initDefaultDevices() {
    //   const deviceConfigs = [
    //     { deviceType: '1712', typeCode: '1712', address: '', barCode: '', deviceId: '1712001', name: '子网关' },
    //     { deviceType: '1713', typeCode: '1713', address: '', barCode: '', deviceId: '1713001', name: '柔性网关统计' },
    //     { deviceType: '1714', typeCode: '1714', address: '', barCode: '', deviceId: '1714001', name: '柔性设备' }
    //   ];
      
    //   realtimeDataProvider.initDeviceList(deviceConfigs);
    //   this.updateDeviceFromRealtime();
      
    //   realtimeDataProvider.onDataUpdate = () => {
    //     if (this._isUserInteracting) return;
    //     this.updateDeviceFromRealtime();
    //   };
    // },
    updateDeviceFromRealtime() {
      this.deviceListRealtime = realtimeDataProvider.getDeviceList();
      this.device1712 = this.deviceListRealtime.find(item => item && (item.deviceType === '1712' || item.typeCode === '1712'));
      this.device1713 = this.deviceListRealtime.find(item => item && (item.deviceType === '1713' || item.typeCode === '1713'));
      // 筛选 load 类设备：兼容 typeCode 和 deviceType（实时数据创建的设备可能没有 typeCode）
      this.realtimeLoadDevices = this.deviceListRealtime.filter(item => item && (item.typeCode === '1714' || item.deviceType === '1714'));
      this.buildDeviceList();
      this.updateNyzData();
    },
    buildDeviceList() {
      if (this.realtimeLoadDevices.length === 0) {
        // 没有实时数据时保留接口的原始数据
        return;
      }
      const isValidValue = (v) => v != null && v !== '--' && v !== '' && v !== undefined && v !== null
      this.deviceList = this.deviceList.map(item => {
        const dev = this.realtimeLoadDevices.find(d => d && d.address === item.address);
        if (!dev) {
          console.log(`未找到 address=${item.address} 的实时设备`);
          return item;
        }
        const ed = dev.energyData || {};
        const typeMap = { '0': '无效', '1': '分体机', '2': '多联机', '3': '充电桩', '4': '照明' };
        const flexTypeMap = {
          '0x0000': '无效',
          '0x0305': '多联机外机',
          '0x0306': '多联机内机',
          '0x1310': '充电桩',
          '0x0201': '照明',
          '0x1804': '直流表',
          '0x1311': '光伏',
          '0x1312': '直流电梯',
          '0x1313': '直流空调'
        };
        const statusMap = { '0': '离线', '1': '等待注册', '2': '等待配置', '3': '运行', '4': '在线' };
        // 获取实时数据中的类型值，如果无效则使用接口数据
        const rawTypeFromRealTime = ed.B2?.value;
        const rawType = (rawTypeFromRealTime != null && rawTypeFromRealTime !== '--' && rawTypeFromRealTime !== '') ? rawTypeFromRealTime : item.type;
        const statusVal = ed.B36?.value;
        // 使用 getTypeHex 转换类型
        const typeHex = this.getTypeHex(rawType);
        const newType = String(rawType ?? item.type ?? '');
        const newTypeLabel = flexTypeMap[typeHex] || typeMap[newType] || newType || item.typeLabel;
        // 获取实时数据中的devId
        const devIdFromRealTime = ed.B0?.value;
        const devId = (devIdFromRealTime != null && devIdFromRealTime !== '--' && devIdFromRealTime !== '') ? devIdFromRealTime : item.devId;
        // console.log(newTypeLabel,item, `buildDeviceList - 匹配成功: ${item} -> ${devId}`);
        return {
          ...item,
          devId: devId,
          type: newType,
          typeLabel: newTypeLabel,
          // 设备名称：类型 + devId
          // deviceName: `${newTypeLabel}${devId}`,
          deviceStatusName: isValidValue(statusVal) ? statusMap[String(statusVal)] : item.deviceStatusName,
          projectAddress: isValidValue(ed.B4?.value) ? ed.B4.value : item.projectAddress,
          gateway: isValidValue(ed.B42?.value) ? ed.B42.value : item.gateway,
          // 模型层已完成倍率转换，直接使用转换后的实际值
          deviceFlexibility: isValidValue(ed.B6?.value) ? parseFloat(ed.B6.value) : item.deviceFlexibility,
          deviceLoadRatio: isValidValue(ed.B8?.value) ? parseFloat(ed.B8.value) : item.deviceLoadRatio,
          deviceEnergyEfficiencyLevel: isValidValue(ed.B10?.value) ? parseInt(ed.B10.value) : item.deviceEnergyEfficiencyLevel,
          // 功率字段：模型层已 /1000 转换为 kW
          power: isValidValue(ed.B24?.value) ? parseFloat(ed.B24.value).toFixed(2) : item.power,
          // 电量字段：模型层已 /100 转换为 kWh
          energyConsumption: isValidValue(ed.B28?.value) ? parseFloat(ed.B28.value).toFixed(2) : item.energyConsumption,
          adjustablePower: isValidValue(ed.B56?.value) ? parseFloat(ed.B56.value).toFixed(2) : item.adjustablePower,
          _rawEnergyData: ed
        };
      });
    },
    updateNyzData() {
      const ed1713 = this.device1713?.energyData || {};
      this.nyzData = {
        dljQuantity: ed1713.B6?.value ?? '1',
        cdzQuantity: ed1713.B12?.value ?? '1',
        mkjQuantity: ed1713.B8?.value ?? '--',
        lightQuantity: ed1713.B14?.value ?? '--',
        unknownDeviceQuantity: ed1713.B16?.value ?? '--',
        nyzFlexibility: ed1713.B18?.value ?? '--',
        totalLoadrate: ed1713.B20?.value ?? '--',
        totalEnergyEfficiencyLevel: ed1713.B22?.value ?? '--'
      };
    },
    handleDatePicker(value) {
      this.selectedDate = value
      this.findFlexibilityLoadPowerTotal();
    },
    getEnergyColor(level) {
      const colors = { 1: '#FF4D4F', 2: '#FFC53D', 3: '#87D068' }
      return colors[level] || '#EEE'
    },
    // getNyzRealTimeData() {
    //   getSocketinstance().socket.emit("register")
    //   getSocketinstance().socket.on("nyzData", (jsonData) => {
    //     const { deviceType, address, dataType, data } = jsonData
    //     if (deviceType === "1712_V2" && address == "64" && dataType == "2") {
    //       this.nyzData.dljQuantity = parseFloat(data.B4)
    //       this.nyzData.mkjQuantity = parseFloat(data.B10)
    //       this.nyzData.unknownDeviceQuantity = parseFloat(data.B12)
    //       this.nyzData.nyzFlexibility = parseFloat(data.B14)
    //       this.nyzData.totalLoadrate = parseFloat(data.B16)
    //       this.nyzData.totalEnergyEfficiencyLevel = parseFloat(data.B18)
    //     }
    //   })
    // },
    async findFlexibilityLoadPowerTotal() {
      this.curveLoading = true
      try {
        const currentDevice = this.$store.state.currentSelectDevice || {};
        const esId = currentDevice.esId || currentDevice.id;
        const areaLevelIds = currentDevice.areaLevelId || this.$store.state.areaInfoId;
        const result = await getPowerData({
          esId: esId,
          date: this.selectedDate,
          areaLevelIds: areaLevelIds
        });
        if (result && result.data && Array.isArray(result.data)) {
          const data = result.data;
          if (data.length > 0) {
            this.loadChartData.categories = data.map(item => {
              const time = item.dateTime || '';
              return time.substring(11, 16) || time;
            });
            this.loadChartData.series[0].data = data.map(item => {
              return Number(item.loadPower || 0);
            });
          } else {
            this.loadChartData.categories = [];
            this.loadChartData.series[0].data = [];
          }
        }
      } finally {
        this.curveLoading = false
      }
    },
    async getDeviceCount() {
      try {
        // const result = await energy.findAllDeviceInfo();
        // if (result.data) this.deviceCount = result.data.deviceInfoMap;
      } catch (err) { console.error(err); }
    },
    getDeviceStatus(idx) {
      const map = { '0': '离线', '1': '等待注册', '2': '等待配置', '3': '运行', '4': '在线' };
      return map[idx]
    },
    onDeviceClick(device) {
      const rawData = device._rawData || {};
      const payload = {
        deviceType: '1714',
        address: device.address,
        deviceId: device.deviceId,
        devId: device.devId,
        deviceName: device.deviceName,
        typeLabel: device.typeLabel,
        energyData: device._rawEnergyData || null,
        power: device.power,
        deviceFlexibility: device.deviceFlexibility,
        deviceLoadRatio: device.deviceLoadRatio,
        deviceEnergyEfficiencyLevel: device.deviceEnergyEfficiencyLevel,
        gateway: device.gateway || '--',
        projectAddress: device.projectAddress || '--',
        rawData: rawData
      };
      uni.navigateTo({
        url: `/community/device-detail/device-detail?deviceInfo=${encodeURIComponent(JSON.stringify(payload))}`
      });
    },
    goToAccessSetting() {
      uni.navigateTo({ url: '/community/access-setting/access-setting' });
    },
    getProgressEndColor(value) {
      const num = Math.round(value * 10) / 10;
      const gradientValueMap = {
        '0': '#32cd32', '0.1': '#2fc744', '0.2': '#2bc057', '0.3': '#28ba69',
        '0.4': '#24b47b', '0.5': '#21ad8e', '0.6': '#1ea7a0', '0.7': '#1aa1b2',
        '0.8': '#179bc4', '0.9': '#1394d7', '1': '#108ee9',
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

.device-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  overflow: hidden;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.device-icon {
  width: 100%;
  height: 100%;
}

@media (max-width: 480px) {
  .device-image {
    width: 100rpx;
    height: 100rpx;
  }
}

/* 基础容器 */
.container {
  padding: 20rpx;
  background: #Eff4fb;
}

.card {
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 2px;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-header {
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: fit-content;
}

.chart-container {
  margin-top: 10rpx;
  position: relative;
  height: 450rpx;
}

.date-picker {
  font-size: 14px;
  color: #666;
}

.main-chart {
  width: 100%;
  height: 100%;
}

.chart-loaded {
  width: 100%;
  height: 450rpx;
  animation: fadeIn 0.5s ease-out;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #4488FB;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: #999;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* 设备统计 */
.device-stats {
  padding: 12px 16px;
}

.device-grid {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  gap: 8px;
}

.device-item {
  flex: 1;
  text-align: center;
  padding: 10px 8px;
  background: #F8FAFF;
  border-radius: 6px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.device-item:active {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.number {
  font-size: 18px;
  font-weight: 600;
  color: #4488FB;
  margin-bottom: 4px;
  display: block;
}

.text {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
  display: block;
}

/* 列表头部 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.access-setting-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #1890FF;
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

.setting-icon {
  font-size: 14px;
}

.setting-text {
  font-size: 14px;
}

/* 核心：设备卡片一行两个 */
.device-list {
  padding: 0;
}

.device-card-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  gap: 10rpx;
  /* 卡片间距 */
}

.device-card {
  width: calc(50% - 10rpx);
  /* 严格一行两个 */
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

.device-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.device-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0;
  position: relative;
  overflow: hidden;
}

.device-image::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: #e9ecef;
  border-radius: 0 0 12px 12px;
}

.device-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
  z-index: 1;
  position: relative;
}

.device-info {
  width: 100%;
  margin-top: 12px;
}

.device-data {
  width: 100%;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.data-label {
  font-size: 12px;
  color: #666;
}

.data-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* 响应式 */
@media (max-width: 480px) {
  .device-card {
    width: calc(50% - 10rpx);
  }

  .device-image {
    width: 80px;
    height: 80px;
  }

  .device-icon {
    width: 50px;
    height: 50px;
  }
}

::v-deep .uni-date-btn--ok {
  padding: 10rpx 15px
}

::v-deep .uni-calendar--fixed {
  margin-bottom: 50px
}
</style>