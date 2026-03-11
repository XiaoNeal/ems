<template>
  <view class="flex-container" style="height: 100vh;">
    <!-- 左侧容器 -->
    <view class="flex-item" style="width: 50%;">
      <view class="card-content grid-content" style="display: flex; flex-direction: column;">
        <!-- 设备信息区块 -->
        <view class="device-section">
          <view class="img-storage"></view>
          <view class="info-group">
            <view class="info-item">
              <text class="info-label">设备类型</text>
              <text class="info-value">{{ stationConfig.deviceType }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">额定功率 (kW)</text>
              <text class="info-value">{{ stationConfig.maxP }}</text>
            </view>
          </view>
          <view class="info-group">
            <view class="info-item">
              <text class="info-label">厂家标识</text>
              <text class="info-value">{{ stationConfig.deviceFlag }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">额定电量 (kWh)</text>
              <text class="info-value">{{ stationConfig.maxQ }}</text>
            </view>
          </view>
        </view>

        <!-- 状态指示区块 -->
        <view class="status-section">
          <view v-for="(item, index) in statusList" :key="index" class="status-item">
            <view class="status-dot" ></view>
            <text class="status-title">{{ item.title }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 右侧参数区块 -->
    <view class="flex-item" style="width: 50%;">
      <view class="parameter-section">
        <text class="section-title">设备参数</text>
        <scroll-view scroll-y style="height: 80vh;">
          <view class="parameter-list">
            <view v-for="(item, index) in dataContainer" :key="index" class="parameter-item">
              <text class="param-name">{{ item.name }} ({{ item.unit }})</text>
              <text class="param-value">{{ item.value }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
export default {
  props: {
    deviceList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dataContainer: [],
      statusDataContainer: {},
      stationConfig: {
        deviceType: '储能',
        deviceFlag: 'GIE-GA10K',
        maxP: 5,
        maxQ: 9.6
      },
      statusListDefaultValue: [
        { title: 'DC/DC准备状态', status: 1 },
        { title: '电池侧极性反接保护', status: 0 },
        { title: 'DC/DC故障状态', status: 0 },
        { title: '软件过流故障', status: 0 },
        { title: '母线侧电压过高保护', status: 0 },
        { title: '电流传感器故障', status: 0 },
        { title: '母线侧电压过低保护', status: 0 },
        { title: '温度传感器故障', status: 0 },
        { title: '母线侧极性反接保护', status: 0 },
        { title: '通信故障', status: 0 },
        { title: '电池侧电压过高保护', status: 0 },
        { title: '硬件过流故障', status: 0 },
        { title: '电池侧电压过低保护', status: 0 },
      ]
    }
  },
  computed: {
    statusList() {
      if(Object.keys(this.statusDataContainer).length === 0) return this.statusListDefaultValue;
      return [
        { title: 'DC/DC准备状态', status: this.statusDataContainer.dc_dc_ready.value },
        { title: '电池侧极性反接保护', status: this.statusDataContainer.battery_exterme_inverse_protect.value },
        { title: 'DC/DC故障状态', status: this.statusDataContainer.dc_dc_failure.value },
        { title: '软件过流故障', status: this.statusDataContainer.software_overflow_failure.value },
        { title: '母线侧电压过高保护', status: this.statusDataContainer.muxiance_voltage_overhigh_protect.value },
        { title: '电流传感器故障', status: this.statusDataContainer.current_sense_failure.value },
        { title: '母线侧电压过低保护', status: this.statusDataContainer.muxiance_voltage_overlow_protect.value },
        { title: '温度传感器故障', status: this.statusDataContainer.temperature_sense_failure.value },
        { title: '母线侧极性反接保护', status: this.statusDataContainer.muxiance_extreme_inverse_protect.value },
        { title: '通信故障', status: this.statusDataContainer.connection_failed.value },
        { title: '电池侧电压过高保护', status: this.statusDataContainer.battery_side_voltage_overhigh_protect.value },
        { title: '硬件过流故障', status: this.statusDataContainer.hardware_overflow_failure.value },
        { title: '电池侧电压过低保护', status: this.statusDataContainer.battery_side_voltage_overlow_protect.value },
      ];
    }
  },
  watch: {
    deviceList: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.getRealData();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getRealData();
  },
  methods: {
    getStatusClass(status, index) {
      const isActive = (index === 0 && status === 1) || (index !== 0 && status === 0);
      return isActive ? 'active' : 'inactive';
    },
    getRealData() {
      const storageDevice = this.deviceList.filter((item) => (item.deviceType.includes("1702_V2_2")));
      this.dataContainer = storageDevice[0]?.energyData ?? new Model1702v2_2().energyData;
      this.statusDataContainer = storageDevice[0]?.statusData ?? this.statusListDefaultValue;
    }
  }
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.grid-content {
  border-radius: 4px;
  width: 100%;
  height: 100%;
  background-color: var(--device-list-bg-color);
}
.pcs-parameter {
  padding: 10px;
  .pcs-title {
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
  }
  .pcs-scrollbar {
    height: 380px;
    overflow: auto;
  }
  .pcs-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .dcdc-data-item {
      width: 30%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px 0;
      padding-left: 20px;

      .dcdc-data-name {
        width: 60%;
      }
      .dcdc-data-value {
        width: 40%;
        height: 21px;
        line-height: 21px;
        text-align: center;
        color: var(--theme-blue);
      }
    }
  }
}

.card-content {
    width: 100%;
    height: 100%;

    .img-storage {
        width: 60%;
        height: 60%;
        margin: 5% auto;
        background: url(https://serviceiems.gree.com/esOperation/img/img-storage.b5a17888.png) no-repeat;
        background-size: 100% 100%;
    }

    .device-info {
        height: 10%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--theme-text-color);

        .device-info-item {
            width: 45%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .device-info-name {
                width: 45%;
            }

            .device-info-value {
                width: 55%;
                text-align: right;
            }

            .device-info-name-right {
                width: 70%;
            }

            .device-info-value-right {
                width: 30%;
                text-align: right;
            }
        }
    }
}

.status-item {
    width: 50%;
    height: 15%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: var(--theme-text-color);

    .status-dot {
        width: 15px;
        height: 15px;
        border-radius: 50%;

        &.active {
            background-color: aqua;
        }

        &.inactive {
            background-color: #ff5722;
        }
    }

    .status-title {
        flex: 1;
        margin-left: 10px;
    }
}
.flex-container {
  display: flex;
  flex-wrap: nowrap;
  padding: 10rpx;
}

.flex-item {
  flex: 1;
  margin: 10rpx;
}

.parameter-section {
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
}

.parameter-item {
  display: flex;
  justify-content: space-between;
  padding: 15rpx;
  border-bottom: 1rpx solid #eee;
}

</style>