<template>
  <view class="container" :class="platformClass">
    <DyNavbar title="设备详情" :placeholder="true" />
    <view class="fixed-placeholder"></view>

    <!-- 设备基本信息 -->
    <view class="device-info-card">
      <view class="info-item">
        <text class="info-label">设备名称</text>
        <text class="info-value">{{ deviceInfo.deviceName || '--' }}</text>
      </view>
      <!-- <view class="info-item">
        <text class="info-label">设备类型</text>
        <text class="info-value">{{ formatDeviceType(energyData.B2) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">设备状态</text>
        <text class="info-value">{{ formatNetworkStatus(energyData.B36) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">设备ID</text>
        <text class="info-value">{{ getFieldValue(energyData.B0) || deviceInfo.devId || '--' }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">设备位置</text>
        <text class="info-value">{{ getFieldValue(energyData.B4) || deviceInfo.projectAddress || '--' }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">所属子网关ID</text>
        <text class="info-value">{{ getFieldValue(energyData.B42) || '--' }}</text>
      </view> -->
    </view>

    <!-- 实时运行数据 -->
    <view class="device-info-card">
      <view class="card-title">实时运行数据</view>
      <view class="info-item">
        <text class="info-label">额定功率</text>
        <text class="info-value">{{ formatPower(energyData.B12) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">设备电压</text>
        <text class="info-value">{{ formatVoltage(energyData.B16) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">设备电流</text>
        <text class="info-value">{{ formatCurrent(energyData.B20) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">实时功率</text>
        <text class="info-value">{{ formatPower(energyData.B24) }}</text>
      </view>
      <!-- <view class="info-item">
        <text class="info-label">累计正向电能</text>
        <text class="info-value">{{ formatEnergy(energyData.B28) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">累计反向电能</text>
        <text class="info-value">{{ formatEnergy(energyData.B32) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">柔度</text>
        <text class="info-value">{{ formatPercent(deviceInfo.deviceFlexibility) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">负载率</text>
        <text class="info-value">{{ formatPercent(deviceInfo.deviceLoadRatio) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">能效水平</text>
        <view class="energy-levels">
          <view v-for="level in 3" :key="level"
            :class="['level-btn', { 'active': deviceInfo.deviceEnergyEfficiencyLevel === level }]">
            {{ level }}级
          </view>
        </view>
      </view> -->
    </view>

    <!-- 调控数据 -->
    <view v-if="false" class="device-info-card">
      <view class="card-title">调控数据</view>
      <view class="info-item">
        <text class="info-label">开关</text>
        <text class="info-value">{{ formatSwitch(energyData.B70) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">是否调控</text>
        <text class="info-value">{{ formatSwitch(energyData.B72) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">响应等级</text>
        <text class="info-value">{{ formatResponseLevel(energyData.B74) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">调控时长</text>
        <text class="info-value">{{ getFieldValue(energyData.B76) }} min</text>
      </view>
      <view class="info-item">
        <text class="info-label">可调节功率</text>
        <text class="info-value">{{ formatPower(energyData.B56) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">累计响应次数</text>
        <text class="info-value">{{ getFieldValue(energyData.B60) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">累计响应时间</text>
        <text class="info-value">{{ getFieldValue(energyData.B62) }} min</text>
      </view>
      <view class="info-item">
        <text class="info-label">累计响应电量</text>
        <text class="info-value">{{ formatEnergy(energyData.B66) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">入网状态</text>
        <text class="info-value">{{ formatNetworkStatus(energyData.B36) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">通讯状态</text>
        <text class="info-value">{{ formatCommStatus(energyData.B38) }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">四级分类</text>
        <text class="info-value">{{ formatFourthLevel(energyData.B40) }}</text>
      </view>
    </view>

    <!-- 电量统计 -->
    <view v-if="false" class="chart-card">
      <view class="chart-header">
        <text class="chart-title">电量统计</text>
      </view>
      <view class="chart-container">
        <view class="energy-stats">
          <view class="energy-stat-item">
            <text class="energy-value">{{ formatEnergyValue(energyData.B28) }}</text>
            <text class="energy-label">累计正向电能 (kWh)</text>
          </view>
          <view class="energy-stat-item">
            <text class="energy-value">{{ formatEnergyValue(energyData.B32) }}</text>
            <text class="energy-label">累计反向电能 (kWh)</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 功率曲线 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">功率曲线</text>
      </view>
      <view class="chart-container">
        <qiun-data-charts type="area" :opts="chartOpts" :chartData="chartData" canvas-id="devicePowerChart"
          :canvas2d="canvas2d" :ontouch="true" />
      </view>
    </view>

  </view>
</template>

<script>
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'
import { realtimeDataProvider } from '@/service/websocket'
import { getDevicePowerStatistics } from '@/api/power'

export default {
  components: {
    DyNavbar
  },
  name: 'device-detail',
  data() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    return {
      canvas2d: this.$Config.ISCANVAS2D,
      platformClass: "",
      dataVersion: 0,
      deviceInfo: {
        address: '',
        deviceName: '--',
        deviceStatusName: '--',
        devId: '--',
        projectAddress: '--',
        gateway: '--',
        typeLabel: '--',
        power: 0,
        deviceFlexibility: 0,
        deviceLoadRatio: 0,
        deviceEnergyEfficiencyLevel: 0
      },
      selectedDate: today,
      startDate: '2020-01-01',
      endDate: today,
      // 图表数据
      chartData: {
        categories: [],
        series: [
          { name: '放电功率', data: [] },
          { name: '充电功率', data: [] }
        ]
      },
      chartOpts: {
        color: ['#00c934', '#1890ff'],
        dataLabel: false,
        padding: [15, 20, 30, 25],
        dataPointShape: false,
        enableScroll: false,
        legend: {
          show: true,
          position: 'bottom',
          borderWidth: 0
        },
        xAxis: { labelCount: 5, disableGrid: true },
        yAxis: {
          gridType: 'dash',
          showTitle: true,
          data: [{ position: 'left', title: '单位:kW', min: 0 }],
          dashLength: 2
        },
        extra: {
          area: { type: 'curve', gradient: true }
        },
        animation: false
      }
    };
  },
  computed: {
    energyData() {
      void this.dataVersion
      var address = this.deviceInfo.address
      var list = realtimeDataProvider.getDeviceList() || []
      // console.log('energyData - 查找 address:', address, '设备总数:', list.length);

      // 查找设备：优先 typeCode=1714，其次 rawDeviceType=0305
      var device = list.find(function (item) {
        if (!item) return false;
        // 先检查 address 是否匹配
        if (item.address !== address) return false;
        // 再检查类型
        return item.typeCode === '1714' || item.deviceType === '1714' || item.rawDeviceType === '0305' || item.deviceType === '0305';
      });

      // console.log('energyData - 找到设备:', device ? {
      //   deviceType: device.deviceType,
      //   typeCode: device.typeCode,
      //   address: device.address,
      //   hasEnergyData: !!(device.energyData && device.energyData.B0 && device.energyData.B0.value !== '--')
      // } : null);

      return (device && device.energyData) ? device.energyData : {};
    },
    chartOptions() {
      const dischargeData = this.chartData.series?.[0]?.data || [];
      const chargeData = this.chartData.series?.[1]?.data || [];
      const max1 = dischargeData.length > 0 ? Math.max(...dischargeData) : 0;
      const max2 = chargeData.length > 0 ? Math.max(...chargeData) : 0;
      const maxValue = Math.max(max1, max2, 10); // 至少显示 10kW
      // 向上取整到合适的刻度
      const max = Math.ceil(maxValue * 1.2);
      return {
        color: ['#00c934', '#1890ff'],
        dataLabel: false,
        padding: [15, 20, 30, 25],
        dataPointShape: false,
        enableScroll: false,
        legend: {
          show: true,
          position: 'bottom',
          borderWidth: 0
        },
        xAxis: { labelCount: 5, disableGrid: true, rotateLabel: true },
        yAxis: {
          gridType: 'dash',
          showTitle: true,
          data: [{ position: 'left', title: '单位:kW', max: max }],
          dashLength: 2
        },
        extra: {
          area: { type: 'curve', gradient: true }
        },
        animation: false
      };
    }
  },
  onLoad(options) {
    if (options.deviceInfo) {
      try {
        const decoded = decodeURIComponent(options.deviceInfo);
        const parsed = JSON.parse(decoded);
        this.deviceInfo = { ...this.deviceInfo, ...parsed };
        console.log('device-detail - deviceInfo:', this.deviceInfo);
      } catch (e) {
        console.warn('deviceInfo parse failed:', e);
      }
    }

    // 注册数据更新回调
    realtimeDataProvider.onDataUpdate = () => {
      this.dataVersion++;
    };

    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === "ios" ? "ios-platform" : "android-platform";
      },
    });

    // 加载功率曲线数据
    this.loadPowerChart();

    // 调试：查看设备列表
    setTimeout(() => {
      const list = realtimeDataProvider.getDeviceList();
      console.log('device-detail - 实时设备列表:', list.map(item => ({
        deviceType: item.deviceType,
        typeCode: item.typeCode,
        rawDeviceType: item.rawDeviceType,
        address: item.address,
        hasEnergyData: !!(item.energyData && item.energyData.B0)
      })));
    }, 1000);
  },
  beforeDestroy() {
    realtimeDataProvider.onDataUpdate = null;
  },
  methods: {
    async loadPowerChart() {
      try {
        console.log('loadPowerChart - selectedDate:', this.selectedDate,this.deviceInfo);
        const deviceId = this.deviceInfo.deviceId;
        if (!deviceId || deviceId === '--') return;

        const result = await getDevicePowerStatistics({
          interval: 10,
          date: this.selectedDate,
          deviceId: deviceId
        });

        const data = result?.data || result?.res?.data || [];
        if (!Array.isArray(data) || data.length === 0) return;

        // 转换数据用于图表
        const categories = data.map(item => {
          const time = item.dateTime || '';
          const parts = time.split(' ');
          return parts[1] ? parts[1].substring(0, 5) : ''; // HH:mm
        });

        // 放电功率（flexPower）
        const dischargeData = data.map(item => {
          if (item.flexPower != null) {
            const val = parseFloat(item.flexPower);
            return isNaN(val) ? 0 : val;
          }
          return 0;
        });

        // 充电功率（flexPowerReverse，取绝对值显示）
        const chargeData = data.map(item => {
          if (item.flexPowerReverse != null) {
            const val = parseFloat(item.flexPowerReverse);
            return isNaN(val) ? 0 : Math.abs(val);
          }
          return 0;
        });

        this.chartData = {
          categories: categories,
          series: [
            { name: '正向功率', data: dischargeData },
            { name: '反向功率', data: chargeData }
          ]
        };
      } catch (err) {
        console.error('加载功率曲线失败:', err);
      }
    },
    getFieldValue(field) {
      if (!field || field.value == null || field.value === '--') return '--';
      return field.value;
    },
    // 百分比字段（柔度、负载率）：模型层已 /100 转换为实际值，直接显示加 %
    formatPercent(value) {
      if (value == null || value === '--') return '--';
      return parseFloat(value).toFixed(1) + '%';
    },
    formatPowerValue(field) {
      if (!field || field.value == null || field.value === '--') return '0.000';
      return parseFloat(field.value).toFixed(3);
    },
    formatEnergyValue(field) {
      if (!field || field.value == null || field.value === '--') return '0.00';
      return parseFloat(field.value).toFixed(2);
    },
    formatPower(field) {
      if (!field || field.value == null || field.value === '--') return '--';
      return parseFloat(field.value).toFixed(3) + ' kW';
    },
    formatVoltage(field) {
      if (!field || field.value == null || field.value === '--') return '--';
      return parseFloat(field.value).toFixed(3) + ' V';
    },
    formatCurrent(field) {
      if (!field || field.value == null || field.value === '--') return '--';
      return parseFloat(field.value).toFixed(3) + ' A';
    },
    formatEnergy(field) {
      if (!field || field.value == null || field.value === '--') return '--';
      return parseFloat(field.value).toFixed(2) + ' kWh';
    },
    formatSwitch(field) {
      if (!field || field.value == null || field.value === '--') return '--';
      return String(field.value) === '1' ? '开启' : '关闭';
    },
    formatResponseLevel(field) {
      if (!field || field.value == null || field.value === '--') return '--';
      const map = { '1': '一级调控', '2': '二级调控', '3': '三级调控' };
      return map[String(field.value)] || field.value;
    },
    formatNetworkStatus(field) {
      if (!field || field.value == null || field.value === '--') return '--';
      const map = { '0': '离线', '1': '等待注册', '2': '等待配置', '3': '运行', '4': '在线' };
      return map[String(field.value)] || field.value;
    },
    formatCommStatus(field) {
      if (!field || field.value == null || field.value === '--') return '--';
      return String(field.value) === '1' ? '在线' : '离线';
    },
    formatFourthLevel(field) {
      if (!field || field.value == null || field.value === '--') return '--';
      const map = { '0': '无效', '1': '基础型', '2': '环境型', '3': '功能型', '4': '舒适型' };
      return map[String(field.value)] || field.value;
    },
    formatDeviceType(field) {
      // 支持多种类型格式：
      //   - 数值 (如 '0', '1', '2', '3', '4') -> 基础类型
      //   - 十六进制字符串 (如 '0305', '1310') -> 柔性设备类型
      //   - 带 0x 前缀 (如 '0x0305')
      if (!field || field.value == null || field.value === '--') return '--';
      const raw = String(field.value).trim();

      // 基础类型（0:无效, 1:分体机, 2:多联机, 3:充电桩, 4:照明）
      const baseMap = { '0': '无效', '1': '分体机', '2': '多联机', '3': '充电桩', '4': '照明' };
      if (baseMap[raw]) return baseMap[raw];

      // 十六进制类型映射
      const hexMap = {
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

      // 尝试构造十六进制 key
      let hex = '';
      if (raw.startsWith('0x') || raw.startsWith('0X')) {
        hex = '0x' + raw.slice(2).toUpperCase().padStart(4, '0');
      } else if (/^[A-Fa-f]+$/.test(raw)) {
        hex = '0x' + raw.toUpperCase().padStart(4, '0');
      } else {
        // 可能是十进制数值（如 4880 -> 0x1310）
        const num = parseInt(raw, 10);
        if (!isNaN(num)) {
          hex = '0x' + num.toString(16).toUpperCase().padStart(4, '0');
        }
      }

      return hexMap[hex] || field.value;
    },
    onDateChange(e) {
      this.selectedDate = e.detail.value;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 80px;

  .fixed-placeholder {
    height: calc(25px + 44px);
  }

  &.android-platform {
    .fixed-placeholder {
      height: calc(25px + 44px + 20px);
    }
  }

  &.ios-platform {
    .fixed-placeholder {
      height: calc(44px);
    }
  }
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.device-info-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.energy-levels {
  display: flex;
  gap: 8px;
}

.level-btn {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  background-color: #f0f0f0;
  color: #666;
}

.level-btn.active {
  background-color: #1890FF;
  color: #fff;
}

.level-btn:nth-child(2).active {
  background-color: #FFC53D;
}

.level-btn:nth-child(3).active {
  background-color: #87D068;
}

.chart-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.chart-container {
  height: 300px;
  position: relative;
  padding: 0 -10px;
}

.energy-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}

.energy-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.energy-value {
  font-size: 28px;
  font-weight: 600;
  color: #1890FF;
}

.energy-label {
  font-size: 12px;
  color: #999;
}

.power-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.power-value {
  font-size: 36px;
  font-weight: 600;
  color: #FF7A2E;
}

.power-unit {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}
</style>
