<template>
  <scroll-view class="module-scroll" scroll-y="true">
    <view class="content">
      <view class="module">
        <view class="module-title">BMS</view>
        <DataGroup title="电池簇运行状态">
          <DataGrid :items="[
            { label: '电池状态', value: formattedValues['171C_B26'] }
          ]" />
        </DataGroup>
        <DataGroup title="簇级核心电气参数">
          <DataGrid :items="[
            { label: '簇电压(V)', value: formattedValues['171C_B12'] },
            { label: '簇电流(A)', value: formattedValues['171C_B14'] },
            { label: '负载电压(V)', value: formattedValues['171C_B144'] },
            { label: 'SOC(%)', value: formattedValues['171C_B16'] },
            { label: 'SOH(%)', value: formattedValues['171C_B18'] },
            { label: 'SOE(kWh)', value: formattedValues['171C_B20'] },
            { label: '绝缘R+(MΩ)', value: formattedValues['171C_B22'] },
            { label: '绝缘R-(MΩ)', value: formattedValues['171C_B24'] }
          ]" />
        </DataGroup>
        <DataGroup title="DI/DO状态">
          <DataGrid :items="[
            { label: 'DI1', value: formattedValues['171C_B28b0'] },
            { label: 'DI2', value: formattedValues['171C_B28b1'] },
            { label: 'DI3', value: formattedValues['171C_B28b2'] },
            { label: 'DI4', value: formattedValues['171C_B28b3'] },
            { label: 'DI5', value: formattedValues['171C_B28b4'] },
            { label: 'DI6', value: formattedValues['171C_B28b5'] },
            { label: 'DI7', value: formattedValues['171C_B28b6'] },
            { label: 'DI8', value: formattedValues['171C_B28b7'] },
            { label: 'SLP', value: formattedValues['171C_B29b0'] },
            { label: 'DO1', value: formattedValues['171C_B30b0'] },
            { label: 'DO2', value: formattedValues['171C_B30b1'] },
            { label: 'DO3', value: formattedValues['171C_B30b2'] },
            { label: 'DO4', value: formattedValues['171C_B30b3'] },
            { label: 'DO5', value: formattedValues['171C_B30b4'] },
            { label: 'DO6', value: formattedValues['171C_B30b5'] },
            { label: 'DO7', value: formattedValues['171C_B30b6'] },
            { label: 'DO8', value: formattedValues['171C_B30b7'] }
          ]" />
        </DataGroup>
        <DataGroup title="温度采集参数">
          <DataGrid :items="[
            { label: '温度点数', value: formattedValues['171C_B32'] },
            { label: '最高温度(℃)', value: formattedValues['171C_B34'] },
            { label: '最高温模块', value: formattedValues['171C_B36'] },
            { label: '最高温序号', value: formattedValues['171C_B38'] },
            { label: '最低温度(℃)', value: formattedValues['171C_B40'] },
            { label: '最低温模块', value: formattedValues['171C_B42'] },
            { label: '最低温序号', value: formattedValues['171C_B44'] },
            { label: '平均温度(℃)', value: formattedValues['171C_B46'] },
            { label: '电池箱最高温(℃)', value: formattedValues['171C_B106'] }
          ]" />
        </DataGroup>
        <DataGroup title="控制指令">
          <ControlCard
            :list="controlList"
            :isConnected="isConnected"
            :clickedBtn="clickedBtn"
            @control-click="onControlClick"
          />
        </DataGroup>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import DataGroup from '../DataGroup.vue'
import DataGrid from '../DataGrid.vue'
import ControlCard from '../ControlCard.vue'

/**
 * BMS tab 组件
 * 展示电池簇状态、电气参数、DI/DO、温度采集、控制指令
 * 控制点击事件通过 control-click 透传给父组件
 */
export default {
  name: 'BmsTab',
  components: { DataGroup, DataGrid, ControlCard },
  props: {
    formattedValues: {
      type: Object,
      default: () => ({})
    },
    controlList: {
      type: Array,
      default: () => []
    },
    isConnected: {
      type: Boolean,
      default: false
    },
    clickedBtn: {
      type: Object,
      default: null
    }
  },
  methods: {
    onControlClick(ctrl, opt) {
      this.$emit('control-click', ctrl, opt)
    }
  }
}
</script>

<style lang="scss" scoped>
.module-scroll {
  height: 100%;
}
.content {
  padding: 0 16rpx 20rpx;
}
.module {
  padding: 20rpx 0;
}
.module-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  padding-left: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 4rpx;
    bottom: 14rpx;
    width: 6rpx;
    border-radius: 3rpx;
    background: #007aff;
  }
}
</style>
