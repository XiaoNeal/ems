<template>
  <view class="container">
  
      <!-- 水冷机实时数据模块优化 -->
        <view class="cooling-panel">
      <view class="panel-header">
        <text class="title">液冷机实时数据</text>
      </view>
      <view  class="data-list">
            <view class="data-item" v-for="(item, index) in pcsRealData" :key="index">
              <text class="data-name">{{ item.name }}</text>
              <text class="data-value">{{ item.value }}</text>
            </view>
          </view>
        </view>
    <!-- 环境监测模块优化 -->
    <view class="environment-panel">
      <view class="panel-header">
        <text class="title">🌡️ 环境监测</text>
      </view>
      <view class="sensor-grid">
        <view class="env-item">
          <view class="symbol-icon">
            <text class="icon">🌡️</text>
          </view>
          <text class="sensor-label">温度：</text>
          <text class="env-value">{{ environmentData.statusData.temperature.value }}</text>
          <text class="unit">℃</text>
        </view>
        <view class="env-item">
          <view class="symbol-icon">
            <text class="icon">💧</text>
          </view>
          <text class="sensor-label">湿度：</text>
          <text class="env-value">{{ environmentData.statusData.humidness.value }}</text>
          <text class="unit">%RH</text>
        </view>
      </view>
    </view>

    <!-- 消防监控模块优化 -->
    <view class="fire-panel">
      <view class="panel-header">
        <text class="title">消防监控</text>
        <text class="count">共{{ fireDeviceList.length }}模块</text>
      </view>
      <view class="device-grid">
        <view class="module-item" v-for="(module) in fireDeviceList" :key="module.deviceId">
          <view class="module-header">
            <text class="module-name">{{ module.name }}</text>
            <text :class="['status-label', module.statusData.warningLevel.value === '系统正常' ? 'normal' : 'abnormal']">
              {{ module.statusData.warningLevel.value === '系统正常' ? '正常' : '异常' }}
            </text>
          </view>
          <view class="module-details">
            <text class="detail-item">预警级别: {{ module.statusData.warningLevel.value }}</text>
            <text class="detail-item">故障类型: {{ module.statusData.faultType.value }}</text>
            <text class="detail-item">启动类型: {{ module.statusData.startType.value }}</text>
            <text class="detail-item">子阀状态: {{ module.statusData.subvalveCondition.value }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { Model0318v1_1 } from '@/service/devices/0318v1_1-model'
import { RealtimeDataProviderService } from '@/service/socket/realtime-data-provider.js';
export default {
  
  data() {
    return {
      // pcsRealData: [],
      realTimeService: new RealtimeDataProviderService(),
      powerStationId: this.$store.state.powerStationsId,
      coolingEnergyData:new Model0318v1_1().energyData,
      coolingStatusData:new Model0318v1_1().stateData,
      fireDeviceList:[],
      options:[],
      environmentData: {
        statusData: {
          temperature: { value: 0 },
          humidness: { value: 0 }
        }
      }
    };
  },
  computed: {
    pcsRealData() {
      const energy = [...Object.values(this.coolingEnergyData)];
      const state = [...Object.values(this.coolingStatusData)];
      return [...energy, ...state].map((item) => ({
        name: item.name,
        value: item.value
      }));
    }
    // 移除以下计算属性
    // normalCount() {
    //   return this.fireDeviceList.filter(d => d.statusData.warningLevel.value === '系统正常').length
    // },
    // abnormalCount() {
    //   return this.fireDeviceList.length - this.normalCount
    // }
  },
  methods: {
    async testRealData() {
      console.log('testRealData')
      let findData;
      if(this.powerStationId != this.$store.state.station.stationId || this.$store.state.station.deviceList.length == 0) {
        await this.$store.dispatch('station/getDeviceList', this.powerStationId);
      }
      findData = this.$store.state.station.deviceList;

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
  console.log('deviceLists', deviceLists)
  this.fireDeviceList = []
  deviceLists.forEach((item) => {
    switch (item.deviceType) {
      case "0318_V1_1":
        this.coolingEnergyData = item.energyData
        this.coolingStatusData = item.stateData
        break;
      case "1312_V1_1":
        this.fireDeviceList.push(item)
        break;
      case "131C_V2":
        environmentData = item
        break;
      default:
        break;
    }
  });
  // await nextTick();
    },
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
    }
  },
  mounted() {
    console.log('testRealData',this.$store.state)
    this.testRealData();
    this.initDeviceIdList();
  }
}

</script>

<style lang="scss">
.container {
  padding: 24rpx;
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  gap: 32rpx;  // 统一模块间距
}

/* 统一面板样式 */
.cooling-panel,
.environment-panel,
.fire-panel {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
  margin-bottom: 32rpx;
}

.container {
  padding: 32rpx;
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  box-sizing: border-box;
  padding-bottom: 64rpx;  // 新增底部间距
  margin-bottom: env(safe-area-inset-bottom);  // 适配全面屏底部
}

/* 液冷机模块高度自适应 */
.cooling-panel {
  flex: 0 0 auto;
  min-height: 420rpx;
  
  .data-list {
    padding: 24rpx;
    
    .data-item {
      padding: 32rpx;
      margin: 0 0 24rpx;
      background: #f8f9fb;
      border-radius: 16rpx;
    }
  }
}

/* 环境监测模块布局优化 */
.environment-panel {
  .sensor-grid {
    padding: 32rpx;
    gap: 40rpx;
    
    .env-item {
      padding: 32rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      
      .sensor-icon {
        width: 80rpx;
        height: 80rpx;
        margin-right: 24rpx;
      }
      
      .env-value {
        font-size: 48rpx;
        font-weight: 600;
      }
    }
  }
}

/* 消防监控模块布局修复 */
.fire-panel {
  flex: 1;
  
  .device-grid {
    padding: 24rpx;
    gap: 32rpx;
    
    .module-item {
      margin: 0;
    }
  }
}


.device-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* 删除重复冗余样式 */
.right-panel, 
.environment-box {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 16rpx;
  padding: 32rpx;
  display: flex;
  justify-content: space-around;
  
  .env-item {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    
    .env-value {
      font-size: 36rpx;
      font-weight: 600;
      color: #409eff;
      margin: 0 12rpx;
    }
  }
}

.fire-panel {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
  
  .panel-header {
    padding: 24rpx;
    border-bottom: 1rpx solid #eee;
    
    .header-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #303133;
    }
    
    .module-count {
      font-size: 26rpx;
      color: #909399;
    }
  }
}

.module-item {
  padding: 24rpx;
  margin: 16rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.06);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2rpx);
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.12);
  }
}

.status-label {
  padding: 6rpx 20rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  
  &.normal {
    background: #e8f4ff;
    color: #409eff;
  }
  
  &.abnormal {
    background: #fef0f0;
    color: #f56c6c;
  }
}

.detail-item {
  display: block;
  font-size: 26rpx;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 12rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

// 滚动条样式
.scroll-content {
  height: calc(100vh - 160rpx);
  &::-webkit-scrollbar {
    width: 6rpx;
  }
  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 4rpx;
  }
}

.normal {
  background: #e8f5e9;
  color: #2e7d32;
}

.abnormal {
  background: #ffebee;
  color: #c62828;
}

.cooling-panel {
  min-height: 480rpx;
  
  .data-list {
    padding: 32rpx;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32rpx;
    
    .data-item {
      padding: 32rpx;
      background: #f8f9fb;
      border-radius: 16rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .data-name {
        font-size: 28rpx;
        color: #909399;
      }
      
      .data-value {
        font-size: 40rpx;
        color: #303133;
        margin-top: 16rpx;
      }
    }
  }
}

.environment-panel {
  .env-item {
    padding: 40rpx 32rpx;
    border-radius: 24rpx;
    margin: 0 16rpx;
    
    .sensor-icon {
      width: 96rpx;
      height: 96rpx;
    }
    
    .env-value {
      font-size: 52rpx;
    }
  }
}

.fire-panel {
  .data-list {
    grid-template-columns: repeat(auto-fit, minmax(300rpx, 1fr));
    gap: 32rpx;
    
    .data-item {
      padding: 40rpx 32rpx;
      background: linear-gradient(145deg, #f8f9fb, #ffffff);
      box-shadow: 0 12rpx 40rpx rgba(0,0,0,0.08);
      border: 1rpx solid #f0f2f5;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      
      &:hover {
        transform: translateY(-6rpx);
        box-shadow: 0 16rpx 48rpx rgba(0,0,0,0.12);
      }
      
      .data-name {
        font-size: 30rpx;
        color: #606266;
        margin-bottom: 16rpx;
        font-weight: 500;
      }
      
      .data-value {
        font-size: 48rpx;
        font-weight: 700;
        color: #1677ff;
        text-shadow: 0 4rpx 16rpx rgba(22,119,255,0.2);
        letter-spacing: -0.05em;
      }
    }
  }
}

// 新增符号图标样式
.symbol-icon {
margin-right: 20rpx;

.icon {
font-size: 48rpx;
color: #409EFF;
}
}

// 调整环境项布局
.env-item {
padding: 32rpx;
background: linear-gradient(135deg, #f8fafc, #e6f4ff);
border-radius: 24rpx;
display: flex;
align-items: center;
}

// 删除原有图片图标相关样式
.sensor-icon, .icon {
/* 删除原有图片图标样式 */
}
</style>

