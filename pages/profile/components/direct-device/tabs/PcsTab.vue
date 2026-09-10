<template>
  <scroll-view class="module-scroll" scroll-y="true">
    <view class="content">
      <view class="module">
        <view class="module-title">PCS</view>
        <DataGroup title="运行状态">
          <StatusGrid
            variant="status"
            :items="parsedB64Status.filter(s => ['工作模式', 'U1状态', 'U2状态'].includes(s.name))"
          />
        </DataGroup>
        <DataGroup title="相电压">
          <DataGrid :items="[
            { label: 'A相(V)', value: formattedValues['171B_B0'] },
            { label: 'B相(V)', value: formattedValues['171B_B4'] },
            { label: 'C相(V)', value: formattedValues['171B_B8'] }
          ]" />
        </DataGroup>
        <DataGroup title="相电流">
          <DataGrid :items="[
            { label: 'Ia(A)', value: formattedValues['171B_B2'] },
            { label: 'Ib(A)', value: formattedValues['171B_B6'] },
            { label: 'Ic(A)', value: formattedValues['171B_B10'] }
          ]" />
        </DataGroup>
        <DataGroup title="线电压">
          <DataGrid :items="[
            { label: 'AB(V)', value: formattedValues['171B_B12'] },
            { label: 'BC(V)', value: formattedValues['171B_B16'] },
            { label: 'CA(V)', value: formattedValues['171B_B20'] }
          ]" />
        </DataGroup>
        <DataGroup title="相功率">
          <DataGrid :items="[
            { label: 'A相有功(kW)', value: formattedValues['171B_B24'] },
            { label: 'B相有功(kW)', value: formattedValues['171B_B28'] },
            { label: 'C相有功(kW)', value: formattedValues['171B_B32'] },
            { label: 'A相无功(kVar)', value: formattedValues['171B_B26'] },
            { label: 'B相无功(kVar)', value: formattedValues['171B_B30'] },
            { label: 'C相无功(kVar)', value: formattedValues['171B_B34'] }
          ]" />
        </DataGroup>
        <DataGroup title="交流侧">
          <DataGrid :items="[
            { label: '总有功(kW)', value: formattedValues['171B_B44'] },
            { label: '总无功(kVar)', value: formattedValues['171B_B48'] },
            { label: '总视在(kVA)', value: formattedValues['171B_B52'] },
            { label: '频率(Hz)', value: formattedValues['171B_B36'] },
            { label: '温度(℃)', value: formattedValues['171B_B40'] }
          ]" />
        </DataGroup>
        <DataGroup title="直流侧">
          <DataGrid :items="[
            { label: '直流电压(V)', value: formattedValues['171B_B56'] },
            { label: '直流电流(A)', value: formattedValues['171B_B58'] }
          ]" />
        </DataGroup>
        <DataGroup title="故障状态">
          <StatusGrid
            variant="fault"
            :items="pcsFaultStatus"
          />
        </DataGroup>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { PCS_B64_BITS, PCS_B64_STATUS_MAP, PCS_MODE_MAP } from '../../../direct-device-constants.js'
import DataGroup from '../DataGroup.vue'
import DataGrid from '../DataGrid.vue'
import StatusGrid from '../StatusGrid.vue'

/**
 * PCS tab 组件
 * 展示 PCS 运行状态、电气参数、故障状态
 * parsedB64Status / pcsFaultStatus 计算属性内聚于此组件
 */
export default {
  name: 'PcsTab',
  components: { DataGroup, DataGrid, StatusGrid },
  props: {
    formattedValues: {
      type: Object,
      default: () => ({})
    },
    rawValues: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    parsedB64Status() {
      const b64Value = this.rawValues['171B'] && this.rawValues['171B']['B64']
      if (b64Value === undefined || b64Value === null || b64Value === '--') return []
      // 字符串格式（带冒号分隔）：直接解析
      if (typeof b64Value === 'string' && b64Value.includes(':')) {
        return b64Value.split('; ').map(item => {
          const [name, value] = item.split(':')
          const isError = value === '发生'
          return {
            name: name || '', value: value || '',
            color: isError ? '#FF4D4F' : (PCS_B64_STATUS_MAP[name] || '#666'),
            bgColor: isError ? '#FFF1F0' : '#F6FFED',
            borderColor: isError ? '#FFCCC7' : '#B7EB8F'
          }
        })
      }
      // 数值格式：按位解析
      const b64 = Number(b64Value) || 0
      return PCS_B64_BITS.map(([name, bitPos, isError, isMode]) => {
        let value
        if (isMode && name === '工作模式') {
          value = PCS_MODE_MAP[(b64 >>> 12) & 0x03] || String((b64 >>> 12) & 0x03)
        } else if (isMode) {
          const v = (b64 >>> bitPos) & 1
          value = name === 'U1状态' || name === 'U2状态' ? (v === 0 ? '开机' : '关机') : String(v)
        } else {
          value = (b64 >>> bitPos) & 1 ? '发生' : '正常'
        }
        const finalIsError = isError && value === '发生'
        return {
          name, value,
          color: finalIsError ? '#FF4D4F' : (PCS_B64_STATUS_MAP[name] || '#666'),
          bgColor: finalIsError ? '#FFF1F0' : '#F6FFED',
          borderColor: finalIsError ? '#FFCCC7' : '#B7EB8F'
        }
      })
    },
    /** PCS 故障状态（排除工作模式/U1/U2），附加 isAlarm 字段供 StatusGrid fault 模式使用 */
    pcsFaultStatus() {
      return this.parsedB64Status
        .filter(s => !['工作模式', 'U1状态', 'U2状态'].includes(s.name))
        .map(s => ({ ...s, isAlarm: s.value === '发生' }))
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
