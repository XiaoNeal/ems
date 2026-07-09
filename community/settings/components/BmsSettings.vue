<template>
  <view class="bms-settings">
    <view class="param-card">
      <view class="card-header">
        <text class="card-title">BMS参数设置</text>
        <view v-if="!isEditing" class="edit-btn primary" @click="handleEditConfig">
          <text class="edit-text">修改配置</text>
        </view>
        <view v-else class="action-btns">
          <view class="edit-btn close" @click="closeEdit">
            <text class="edit-text">关闭编辑</text>
          </view>
        </view>
      </view>

      <!-- 开关型参数 -->
      <view class="switch-section">
        <view v-for="param in bmsSwitchParams" :key="param.key" class="param-row">
          <view class="param-info">
            <text class="param-name">{{ param.label }}</text>

          </view>
          <view class="switch-btns-wrapper">
            <view class="switch-btns">
              <view v-for="option in param.options" :key="option.value" class="switch-btn" :class="[
                getParamValue(param.key) === option.value ? 'btn-active' : '',
                !isEditing ? 'btn-disabled' : '',
                clickedButton === param.key + '-' + option.value ? 'btn-clicked' : '',
                isDangerousOption(option) ? 'btn-danger' : ''
              ]" @click="handleSwitchClick(param, option)">
                {{ option.label }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 数值型参数 -->
      <view class="divider"></view>
      <view class="param-list">
        <view v-for="param in bmsParams" :key="param.key" class="param-row"
          :class="{ 'editing-row': editingParam === param.key }">
          <template v-if="param.type === 'combined'">
            <view class="combined-full">
              <view class="combined-header">
                <text class="param-name">{{ param.label }}</text>
                <view class="combined-btn-group">
                  <view v-if="editingParam !== param.key" class="btn btn-edit" :class="{ 'btn-disabled': !isEditing }"
                    @click="handleParamEdit(param)">
                    <uni-icons type="compose" size="14" color="#6699ff"></uni-icons>
                    <text>编辑</text>
                  </view>
                  <template v-else-if="editingParam === param.key">
                    <view class="btn btn-sure" :class="{ 'btn-loading': isSubmitting }" @click="submitParam(param)">
                      <text v-if="!isSubmitting">下发</text>
                      <view v-else class="loading-spinner"></view>
                    </view>
                    <view class="btn btn-cancel" @click="handleParamCancel()">
                      <uni-icons type="closeempty" size="14" color="#999"></uni-icons>
                    </view>
                  </template>
                </view>
              </view>
              <view class="combined-body">
                <view v-if="param.modeOptions && !param.voltageMin" class="mode-row">
                  <text class="mode-label">选择类型：</text>
                  <view class="mode-switch">
                    <view v-for="option in param.modeOptions" :key="option.value" class="switch-btn" :class="{
                      'btn-active': (combinedParams && combinedParams[param.key] && combinedParams[param.key].selectedMode === option.value) || (tempSelectedMode === option.value),
                      'btn-disabled': editingParam !== param.key
                    }" @click="handleCombinedModeClick(param, option)">
                      {{ option.label }}
                    </view>
                  </view>
                </view>
                <view class="power-input-row">
                  <text class="power-label">{{ param.powerLabel }}</text>
                  <view class="param-value-box" :class="{ editing: editingParam === param.key }">
                    <text v-if="editingParam !== param.key" class="val-text" style="color: #333 !important;">
                      {{ showCombinedValue(param.key) }}
                    </text>
                    <input v-else class="val-input" type="digit"
                      :value="(combinedParams && combinedParams[param.key] && combinedParams[param.key].powerValue !== undefined) ? combinedParams[param.key].powerValue : ''"
                      @input="handleCombinedInput(param, $event)" :min="param.min" :max="param.max" placeholder="请输入"
                      focus />
                  </view>
                  <text class="unit-text">{{ param.unit || '' }}</text>
                  <text class="range-text">{{ param.min }}~{{ param.max }}</text>
                </view>
              </view>
            </view>
          </template>
          <template v-else>
            <view class="param-info">
              <text class="param-name">{{ param.label }}</text>
              <text v-if="param.min !== undefined && param.max !== undefined" class="param-range">
                范围: {{ param.min }}~{{ param.max }}{{ param.unit }}
              </text>
            </view>
            <view class="param-right-wrapper">
              <view class="param-right">
                <view class="param-value-box" :class="{ editing: editingParam === param.key }">
                  <text v-if="editingParam !== param.key" class="val-text">{{ formatParamValue(param) }}</text>
                  <input v-else class="val-input" type="digit" v-model="tempValue" :min="param.min" :max="param.max"
                    placeholder="请输入" focus @blur="handleInputBlur(param)" @confirm="handleInputConfirm(param)" />
                </view>
                <text class="unit-text">{{ param.unit || '' }}</text>
              </view>
              <view class="btn-group">
                <view v-if="editingParam !== param.key" class="btn btn-edit" :class="{ 'btn-disabled': !isEditing }"
                  @click="handleParamEdit(param)">
                  <uni-icons type="compose" size="14" color="#6699ff"></uni-icons>
                  <text>编辑</text>
                </view>
                <template v-else-if="editingParam === param.key">
                  <view class="btn btn-sure" :class="{ 'btn-loading': isSubmitting }" @click="submitParam(param)">
                    <text v-if="!isSubmitting">下发</text>
                    <view v-else class="loading-spinner"></view>
                  </view>
                  <view class="btn btn-cancel" @click="handleParamCancel()">
                    <uni-icons type="closeempty" size="14" color="#999"></uni-icons>
                  </view>
                </template>
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>

    <!-- 操作确认弹窗 -->
    <uni-popup ref="confirmPopup" type="center">
      <view class="confirm-popup">
        <view class="popup-header">
          <uni-icons v-if="confirmData.isDangerous" type="info-filled" size="48" color="#ff6b6b"></uni-icons>
          <uni-icons v-else type="help-filled" size="48" color="#6699ff"></uni-icons>
          <text class="popup-title">{{ confirmData.title }}</text>
        </view>
        <view class="popup-content">
          <text class="popup-desc">{{ confirmData.content }}</text>
          <view v-if="confirmData.oldValue" class="value-change">
            <text class="value-old">原值: {{ confirmData.oldValue }}</text>
            <uni-icons type="arrowright" size="16" color="#999"></uni-icons>
            <text class="value-new">新值: {{ confirmData.newValue }}</text>
          </view>
        </view>
        <view class="popup-actions">
          <view class="popup-btn btn-cancel" @click="closeConfirmPopup">取消</view>
          <view class="popup-btn btn-confirm" :class="{ 'btn-danger': confirmData.isDangerous }" @click="confirmAction">
            <text v-if="!isSubmitting">确认</text>
            <view v-else class="loading-spinner small"></view>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 操作结果提示 -->
    <view v-if="operationLog.visible" class="operation-toast" :class="operationLog.type">
      <uni-icons :type="operationLog.type === 'success' ? 'checkmarkempty' : 'closeempty'" size="20"
        :color="operationLog.type === 'success' ? '#52c41a' : '#ff4d4f'"></uni-icons>
      <text class="toast-text">{{ operationLog.message }}</text>
    </view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'
import { realtimeDataProvider } from '@/service/websocket'

export default {
  name: 'BmsSettings',
  props: {},
  computed: {
    userId() {
      return this.$store.state.userInfo?.userId || 0
    }
  },
  mounted() {
    const currentDevice = this.$store.state.currentSelectDevice || {}
    const deviceControl = currentDevice.list.find(item => item.controlType == 1);
    if (deviceControl) {
      this.idCode = deviceControl.homeBarCode || deviceControl.barCode || '';
      // this.deviceAddress = deviceControl.address || '04';
    }
  },
  data() {
    return {
      idCode: '',
      deviceAddress: '04',
      isEditing: false,
      editingParam: '',
      tempValue: '',
      isSubmitting: false,
      clickedButton: '',
      lastSendTimes: {},
      combinedParams: {},
      tempSelectedMode: '',
      params: {
        bms: {}
      },
      confirmData: {
        title: '',
        content: '',
        oldValue: '',
        newValue: '',
        isDangerous: false,
        action: null,
        param: null
      },
      operationLog: {
        visible: false,
        type: 'success',
        message: '',
        timer: null
      },
      bmsParams: [
        { key: 'bms.1', field: '1', address: '1', label: '组端过压 1 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.2', field: '2', address: '2', label: '组端过压 2 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.3', field: '3', address: '3', label: '组端过压 3 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.4', field: '4', address: '4', label: '组端过压报警回差值', unit: 'V', min: 0, max: 25, scale: 10 },
        { key: 'bms.5', field: '5', address: '5', label: '组端欠压 1 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.6', field: '6', address: '6', label: '组端欠压 2 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.7', field: '7', address: '7', label: '组端欠压 3 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.8', field: '8', address: '8', label: '组端欠压报警回差值', unit: 'V', min: 0, max: 25, scale: 10 },
        { key: 'bms.9', field: '9', address: '9', label: '组端放电过流 1 级报警阈值', unit: 'A', min: 0, max: 1000, scale: 10 },
        { key: 'bms.10', field: '10', address: '10', label: '组端放电过流 2 级报警阈值', unit: 'A', min: 0, max: 1000, scale: 10 },
        { key: 'bms.11', field: '11', address: '11', label: '组端放电过流 3 级报警阈值', unit: 'A', min: 0, max: 1000, scale: 10 },
        { key: 'bms.12', field: '12', address: '12', label: '组端放电过流报警回差值', unit: 'A', min: 0, max: 25, scale: 10 },
        { key: 'bms.13', field: '13', address: '13', label: '组端充电过流 1 级报警阈值', unit: 'A', min: 0, max: 1000, scale: 10 },
        { key: 'bms.14', field: '14', address: '14', label: '组端充电过流 2 级报警阈值', unit: 'A', min: 0, max: 1000, scale: 10 },
        { key: 'bms.15', field: '15', address: '15', label: '组端充电过流 3 级报警阈值', unit: 'A', min: 0, max: 1000, scale: 10 },
        { key: 'bms.16', field: '16', address: '16', label: '组端充电过流报警回差值', unit: 'A', min: 0, max: 25, scale: 10 },
        { key: 'bms.17', field: '17', address: '17', label: '组端绝缘 1 级报警阈值', unit: 'kΩ', min: 0, max: 60000 },
        { key: 'bms.18', field: '18', address: '18', label: '组端绝缘 2 级报警阈值', unit: 'kΩ', min: 0, max: 60000 },
        { key: 'bms.19', field: '19', address: '19', label: '组端绝缘 3 级报警阈值', unit: 'kΩ', min: 0, max: 60000 },
        { key: 'bms.20', field: '20', address: '20', label: '组端绝缘报警回差值', unit: 'kΩ', min: 0, max: 255 },
        { key: 'bms.21', field: '21', address: '21', label: '单体充电过温 1 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.22', field: '22', address: '22', label: '单体充电过温 2 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.23', field: '23', address: '23', label: '单体充电过温 3 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.24', field: '24', address: '24', label: '电池充电过温报警回差值', unit: '℃', min: 0, max: 100, scale: 10 },
        { key: 'bms.25', field: '25', address: '25', label: '单体充电欠温 1 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.26', field: '26', address: '26', label: '单体充电欠温 2 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.27', field: '27', address: '27', label: '单体充电欠温 3 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.28', field: '28', address: '28', label: '单体充电欠温报警回差值', unit: '℃', min: 0, max: 100, scale: 10 },
        { key: 'bms.29', field: '29', address: '29', label: '单体电压过压 1 级报警阈值', unit: 'mV', min: 0, max: 4.5, scale: 1000 },
        { key: 'bms.30', field: '30', address: '30', label: '单体电压过压 2 级报警阈值', unit: 'mV', min: 0, max: 4.5, scale: 1000 },
        { key: 'bms.31', field: '31', address: '31', label: '单体电压过压 3 级报警阈值', unit: 'mV', min: 0, max: 4.5, scale: 1000 },
        { key: 'bms.32', field: '32', address: '32', label: '单体电压过压报警回差值', unit: 'mV', min: 0, max: 0.25, scale: 1000 },
        { key: 'bms.33', field: '33', address: '33', label: '单体电压欠压 1 级报警阈值', unit: 'mV', min: 0, max: 4.5, scale: 1000 },
        { key: 'bms.34', field: '34', address: '34', label: '单体电压欠压 2 级报警阈值', unit: 'mV', min: 0, max: 4.5, scale: 1000 },
        { key: 'bms.35', field: '35', address: '35', label: '单体电压欠压 3 级报警阈值', unit: 'mV', min: 0, max: 4.5, scale: 1000 },
        { key: 'bms.36', field: '36', address: '36', label: '单体电压欠压报警回差值', unit: 'mV', min: 0, max: 0.25, scale: 1000 },
        { key: 'bms.37', field: '37', address: '37', label: '单体电压差压 1 级报警阈值', unit: 'mV', min: 0, max: 4.5, scale: 1000 },
        { key: 'bms.38', field: '38', address: '38', label: '单体电压差压 2 级报警阈值', unit: 'mV', min: 0, max: 4.5, scale: 1000 },
        { key: 'bms.39', field: '39', address: '39', label: '单体电压差压 3 级报警阈值', unit: 'mV', min: 0, max: 4.5, scale: 1000 },
        { key: 'bms.40', field: '40', address: '40', label: '单体电压差压报警回差值', unit: 'mV', min: 0, max: 0.25, scale: 1000 },
        { key: 'bms.41', field: '41', address: '41', label: '单体温度温差 1 级报警阈值', unit: '℃', min: 0, max: 100, scale: 10 },
        { key: 'bms.42', field: '42', address: '42', label: '单体温度温差 2 级报警阈值', unit: '℃', min: 0, max: 100, scale: 10 },
        { key: 'bms.43', field: '43', address: '43', label: '单体温度温差 3 级报警阈值', unit: '℃', min: 0, max: 100, scale: 10 },
        { key: 'bms.44', field: '44', address: '44', label: '单体温度温差报警回差值', unit: '℃', min: 0, max: 10, scale: 10 },
        { key: 'bms.45', field: '45', address: '45', label: 'SOC 过低 1 级报警阈值', unit: '%', min: 0, max: 100, scale: 10 },
        { key: 'bms.46', field: '46', address: '46', label: 'SOC 过低 2 级报警阈值', unit: '%', min: 0, max: 100, scale: 10 },
        { key: 'bms.47', field: '47', address: '47', label: 'SOC 过低 3 级报警阈值', unit: '%', min: 0, max: 100, scale: 10 },
        { key: 'bms.48', field: '48', address: '48', label: 'SOC 过低报警回差值', unit: '%', min: 0, max: 100, scale: 10 },
        { key: 'bms.49', field: '49', address: '49', label: '动力插箱温度过高 1 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.50', field: '50', address: '50', label: '动力插箱温度过高 2 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.51', field: '51', address: '51', label: '动力插箱温度过高 3 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.52', field: '52', address: '52', label: '动力插箱温度过高报警回差值', unit: '℃', min: 0, max: 25, scale: 10 },
        { key: 'bms.53', field: '53', address: '53', label: '电池模组过压 1 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.54', field: '54', address: '54', label: '电池模组过压 2 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.55', field: '55', address: '55', label: '电池模组过压 3 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.56', field: '56', address: '56', label: '电池模组过压报警回差值', unit: 'V', min: 0, max: 25, scale: 10 },
        { key: 'bms.57', field: '57', address: '57', label: '电池模组欠压 1 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.58', field: '58', address: '58', label: '电池模组欠压 2 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.59', field: '59', address: '59', label: '电池模组欠压 3 级报警阈值', unit: 'V', min: 0, max: 1000, scale: 10 },
        { key: 'bms.60', field: '60', address: '60', label: '电池模组欠压报警回差值', unit: 'V', min: 0, max: 25, scale: 10 },
        { key: 'bms.61', field: '61', address: '61', label: '单体放电过温 1 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.62', field: '62', address: '62', label: '单体放电过温 2 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.63', field: '63', address: '63', label: '单体放电过温 3 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.64', field: '64', address: '64', label: '单体放电过温报警回差值', unit: '℃', min: 0, max: 100, scale: 10 },
        { key: 'bms.65', field: '65', address: '65', label: '单体放电欠温 1 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.66', field: '66', address: '66', label: '单体放电欠温 2 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.67', field: '67', address: '67', label: '单体放电欠温 3 级报警阈值', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.68', field: '68', address: '68', label: '电池放电欠温报警回差值', unit: '℃', min: 0, max: 100, scale: 10 },
        { key: 'bms.69', field: '69', address: '69', label: 'SOC 过高 1 级报警阈值', unit: '%', min: 0, max: 100, scale: 10 },
        { key: 'bms.70', field: '70', address: '70', label: 'SOC 过高 2 级报警阈值', unit: '%', min: 0, max: 100, scale: 10 },
        { key: 'bms.71', field: '71', address: '71', label: 'SOC 过高 3 级报警阈值', unit: '%', min: 0, max: 100, scale: 10 },
        { key: 'bms.72', field: '72', address: '72', label: 'SOC 过高报警回差值', unit: '%', min: 0, max: 100, scale: 10 },
        { key: 'bms.73', field: '73', address: '73', label: '温升快 1 级报警阈值', unit: '℃/min', min: 0, max: 100, scale: 10 },
        { key: 'bms.74', field: '74', address: '74', label: '温升快 2 级报警阈值', unit: '℃/min', min: 0, max: 100, scale: 10 },
        { key: 'bms.75', field: '75', address: '75', label: '温升快 3 级报警阈值', unit: '℃/min', min: 0, max: 100, scale: 10 },
        { key: 'bms.76', field: '76', address: '76', label: '温升快报警回差值', unit: '℃/min', min: 0, max: 100, scale: 10 },
        { key: 'bms.102', field: '102', address: '102', label: '风扇启动温度', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.103', field: '103', address: '103', label: '风扇关闭温度', unit: '℃', min: -40, max: 120, temperature: true },
        { key: 'bms.104', field: '104', address: '104', label: 'SOC/SOH 设置电池序号', unit: '', min: 0, max: 480 },
        {
          key: 'bms.105', field: '105', address: '105', label: 'SOC/SOH 设置', type: 'combined',
          modeOptions: [
            { label: 'SOC', value: '1' },
            { label: 'SOH', value: '2' }
          ],
          powerLabel: 'SOC/SOH 值',
          unit: '%',
          min: 0,
          max: 100
        },
        { key: 'bms.107', field: '107', address: '107', label: '可调风扇控制-占空比', unit: '%', min: 0, max: 100, fanControl: true },
        { key: 'bms.112', field: '112', address: '112', label: '累计充电电量(高16位)', unit: 'kWh',  scale: 10, hex16: true  },
        { key: 'bms.113', field: '113', address: '113', label: '累计充电电量(低16位)', unit: 'kWh',  scale: 10, hex16: true },
        { key: 'bms.114', field: '114', address: '114', label: '累计放电电量(高16位)', unit: 'kWh', scale: 10, hex16: true  },
        { key: 'bms.115', field: '115', address: '115', label: '累计放电电量(低16位)', unit: 'kWh',  scale: 10, hex16: true  },
        { key: 'bms.117', field: '117', address: '117', label: '电池容量', unit: 'Ah' },
        { key: 'bms.118', field: '118', address: '118', label: '电传感器量程 1', unit: '' },
        { key: 'bms.119', field: '119', address: '119', label: '电传感器量程 2', unit: '' },
        { key: 'bms.120', field: '120', address: '120', label: '电传感器量程 3', unit: '' },
        { key: 'bms.121', field: '121', address: '121', label: '簇内电池节数', unit: '' },
        { key: 'bms.122', field: '122', address: '122', label: '簇内电压个数', unit: '' },
        { key: 'bms.123', field: '123', address: '123', label: '簇内从控模块个数', unit: '' },
        { key: 'bms.124', field: '124', address: '124', label: '从控 1~48 的电压个数', unit: '' },
        { key: 'bms.172', field: '172', address: '172', label: '从控 1~48 的温度个数', unit: '' },
        { key: 'bms.220', field: '220', address: '220', label: '从控站址自动分配', unit: '' }
      ],
      bmsSwitchParams: [
        // { key: 'bms.99', address: '99', label: '控制指令模式', options: [
        //   { label: '单簇系统', value: '1' },
        //   { label: '并簇系统', value: '2' },
        //   { label: '强控模式', value: '3' }
        // ]},
        // { key: 'bms.100', address: '100', label: '上下电控制指令', options: [
        //   { label: '上电', value: '0x55', dangerous: true },
        //   { label: '下电', value: '0xAA', dangerous: true }
        // ]},
        {
          key: 'bms.101', address: '101', label: 'DO 控制', options: [
            { label: '闭合', value: '1' },
            { label: '断开', value: '0' }
          ]
        },
        {
          key: 'bms.106', address: '106', label: '绝缘采集控制', options: [
            { label: '开启', value: '1' },
            { label: '关闭', value: '0' },
            { label: '无效值', value: '2' }
          ]
        },
        {
          key: 'bms.108', address: '108', label: '复归指令', options: [
            { label: '默认状态', value: '0' },
            { label: '复归准备', value: '1' }
          ]
        },
        {
          key: 'bms.109', address: '109', label: '跳机指令', options: [
            { label: '默认状态', value: '0' },
            { label: '跳机', value: '1', dangerous: true }
          ]
        },
        // { key: 'bms.110', address: '110', label: '显控检测故障', options: [
        //   { label: '无故障', value: '0' },
        //   { label: '故障', value: '1' }
        // ]},
        {
          key: 'bms.111', address: '111', label: '主控均衡控制', options: [
            { label: '关闭均衡', value: '0' },
            { label: '开启均衡', value: '1' },
            { label: '主控自主', value: '2' }
          ]
        },
        // { key: 'bms.B116', address: '116', label: '电池类型', options: [
        //   { label: '磷酸铁锂电池', value: '1' },
        //   { label: '钛酸锂电池', value: '2' },
        //   { label: '锰酸锂电池', value: '3' },
        //   { label: '三元电池', value: '4' }
        // ]},
        // { key: 'bms.221', label: '风扇控制功能', options: [
        //   { label: '风扇开启', value: '0x1' },
        //   { label: '风扇关闭', value: '0x2' },
        //   { label: '退出控制', value: '0x3' }
        // ]}
      ]
    }
  },
  methods: {
    checkEditMode() {
      if (!this.isEditing) {
        this.showToast('请先点击修改配置', 'warning')
        return false
      }
      return true
    },

    showToast(message, type = 'success') {
      if (this.operationLog.timer) {
        clearTimeout(this.operationLog.timer)
      }
      this.operationLog = {
        visible: true,
        type,
        message,
        timer: null
      }
      this.operationLog.timer = setTimeout(() => {
        this.operationLog.visible = false
      }, 3000)
    },

    isDangerousOption(option) {
      return option.dangerous === true
    },

    getCurrentOptionLabel(param) {
      const currentValue = this.getParamValue(param.key)
      const option = param.options.find(opt => opt.value === currentValue)
      return option ? option.label : ''
    },

    handleSwitchClick(param, option) {
      if (!this.checkEditMode()) return

      const currentValue = this.getParamValue(param.key)
      if (currentValue === option.value) {
        this.showToast('已经是当前设置', 'warning')
        return
      }

      if (this.isDangerousOption(option)) {
        this.openConfirmPopup({
          title: '危险操作确认',
          content: `确定要执行"${param.label}"的"${option.label}"操作吗？此操作可能影响系统运行。`,
          oldValue: this.getCurrentOptionLabel(param),
          newValue: option.label,
          isDangerous: true,
          action: () => this.executeSwitchCommand(param, option),
          param: param
        })
      } else {
        this.executeSwitchCommand(param, option)
      }
    },

    async executeSwitchCommand(param, option) {
      const now = Date.now()
      const paramLastSendTime = this.lastSendTimes[param.key] || 0
      if (now - paramLastSendTime < 5000) {
        this.showToast('请间隔5秒后再下发', 'warning')
        return
      }

      this.clickedButton = param.key + '-' + option.value
      this.lastSendTimes[param.key] = Date.now()

      setTimeout(() => {
        this.clickedButton = ''
      }, 5000)

      try {
        await this.submitSwitchParam(param, option.value)
        this.showToast(`${param.label}: ${option.label}成功`, 'success')
      } catch (error) {
        this.showToast(`${param.label}: ${option.label}失败`, 'error')
      }
    },

    openConfirmPopup(data) {
      this.confirmData = { ...data }
      this.$refs.confirmPopup.open()
    },

    closeConfirmPopup() {
      this.$refs.confirmPopup.close()
      this.confirmData = {
        title: '',
        content: '',
        oldValue: '',
        newValue: '',
        isDangerous: false,
        action: null,
        param: null
      }
    },

    async confirmAction() {
      if (this.confirmData.action) {
        this.isSubmitting = true
        await this.confirmData.action()
        this.isSubmitting = false
      }
      this.closeConfirmPopup()
    },

    formatParamValue(param) {
      const value = this.params.bms[param.field]
      if (value === undefined || value === null || value === '') {
        return '--'
      }
      return value
    },

    handleInputBlur(param) {
      this.validateAndFormatValue(param)
    },

    handleInputConfirm(param) {
      this.validateAndFormatValue(param)
    },

    validateAndFormatValue(param) {
      let value = parseFloat(this.tempValue)
      if (isNaN(value)) {
        return
      }

      if (param.min !== undefined && value < param.min) {
        value = param.min
        this.showToast(`不能小于${param.min}`, 'warning')
      }
      if (param.max !== undefined && value > param.max) {
        value = param.max
        this.showToast(`不能大于${param.max}`, 'warning')
      }

      value = Math.round(value)
      this.tempValue = value.toString()
    },

    async submitParam(param) {
      if (param.type === 'combined') {
        const combinedData = this.combinedParams[param.key]
        if (!combinedData || !combinedData.selectedMode) {
          this.showToast('请选择类型', 'warning')
          return
        }

        const powerValue = combinedData.powerValue
        if (!powerValue && powerValue !== '0') {
          this.showToast(`请输入${param.powerLabel}`, 'warning')
          return
        }

        const numValue = parseFloat(powerValue)
        if (isNaN(numValue)) {
          this.showToast(`请输入有效的${param.powerLabel}`, 'warning')
          return
        }

        if (param.min !== undefined && numValue < param.min) {
          this.showToast(`${param.powerLabel}不能小于${param.min}`, 'warning')
          return
        }
        if (param.max !== undefined && numValue > param.max) {
          this.showToast(`${param.powerLabel}不能大于${param.max}`, 'warning')
          return
        }

        const now = Date.now()
        const paramLastSendTime = this.lastSendTimes[param.key] || 0
        if (now - paramLastSendTime < 5000) {
          this.showToast('请间隔5秒后再下发', 'warning')
          return
        }

        const modeLabel = param.modeOptions.find(opt => opt.value === combinedData.selectedMode)?.label || ''
        const newValue = `${modeLabel} ${powerValue}${param.unit}`

        this.openConfirmPopup({
          title: '参数下发确认',
          content: `确定要下发"${param.label}"参数吗？`,
          oldValue: this.params.bms[param.field] || '--',
          newValue: newValue,
          isDangerous: false,
          param: param,
          action: () => this.executeSubmitParam(param, powerValue)
        })
        return
      }

      const value = this.tempValue
      if (!value && value !== '0') {
        this.showToast('请输入参数值', 'warning')
        return
      }

      const numValue = parseFloat(value)
      if (isNaN(numValue)) {
        this.showToast('请输入有效的数值', 'warning')
        return
      }

      if (param.min !== undefined && numValue < param.min) {
        this.showToast(`${param.label}不能小于${param.min}`, 'warning')
        return
      }
      if (param.max !== undefined && numValue > param.max) {
        this.showToast(`${param.label}不能大于${param.max}`, 'warning')
        return
      }

      const now = Date.now()
      const paramLastSendTime = this.lastSendTimes[param.key] || 0
      if (now - paramLastSendTime < 5000) {
        this.showToast('请间隔5秒后再下发', 'warning')
        return
      }

      this.openConfirmPopup({
        title: '参数下发确认',
        content: `确定要下发"${param.label}"参数吗？`,
        oldValue: this.params.bms[param.field] || '--',
        newValue: value + (param.unit || ''),
        isDangerous: false,
        param: param,
        action: () => this.executeSubmitParam(param, value)
      })
    },

    handleCombinedModeClick(param, option) {
      if (this.editingParam !== param.key) {
        this.showToast('请先点击编辑按钮', 'warning')
        return
      }
      this.tempSelectedMode = option.value
      if (!this.combinedParams) {
        this.combinedParams = {}
      }
      if (!this.combinedParams[param.key]) {
        this.$set(this.combinedParams, param.key, { selectedMode: '', powerValue: '' })
      }
      this.$set(this.combinedParams[param.key], 'selectedMode', option.value)
    },

    handleCombinedInput(param, event) {
      if (!this.combinedParams) {
        this.combinedParams = {}
      }
      const value = event.detail.value
      if (!this.combinedParams[param.key]) {
        this.$set(this.combinedParams, param.key, {
          selectedMode: '1',
          powerValue: value
        })
      } else {
        const existing = this.combinedParams[param.key]
        this.$set(existing, 'powerValue', value)
        if (existing.selectedMode === undefined) {
          this.$set(existing, 'selectedMode', '1')
        }
      }
    },

    showCombinedValue(paramKey) {
      if (this.combinedParams && this.combinedParams[paramKey]) {
        const { selectedMode, powerValue } = this.combinedParams[paramKey]
        if (selectedMode !== undefined) {
          const modeLabel = selectedMode === '1' ? 'SOC' : selectedMode === '2' ? 'SOH' : ''
          return modeLabel ? `${modeLabel}: ${powerValue || '--'}%` : '--'
        }
        return powerValue !== undefined ? `${powerValue || '--'}` : '--'
      }
      return '--'
    },

    async executeSubmitParam(param, value) {
      this.isSubmitting = true
      this.lastSendTimes[param.key] = Date.now()

      try {
        let registerValue = value

        if (param.type === 'combined') {
          const combinedData = this.combinedParams[param.key]
          if (!combinedData || !combinedData.selectedMode || !combinedData.powerValue) {
            this.showToast('请选择类型并输入数值', 'warning')
            this.isSubmitting = false
            return
          }
          const highByte = parseInt(combinedData.selectedMode)
          const lowByte = parseInt(combinedData.powerValue)
          const combinedValue = (highByte << 8) | lowByte
          registerValue = combinedValue.toString(16).toUpperCase().padStart(4, '0')
        } else if (param.hex16) {
          const rawValue = parseFloat(value)
          const scaledValue = param.scale ? rawValue * param.scale : rawValue
          registerValue = Math.round(scaledValue).toString(16).toUpperCase().padStart(4, '0')
        } else if (param.temperature) {
          registerValue = (parseFloat(value) - 40) * 10
        } else if (param.fanControl) {
          const val = parseFloat(value)
          registerValue = val >= 0 && val <= 100 ? val * 10 : 255
        } else if (param.scale) {
          registerValue = parseFloat(value) * param.scale
        }

        const commandData = {
          apiSufix: 'multiControl',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '171C',
            addr: this.deviceAddress,
            deviceId: '1',
            registerAddress: param.address,
            registerValue: registerValue.toString(),
            valueType: '01',
            registerType: '03',
            extra1: '00',
            extra2: '00',
            extra3: '00'
          }]
        }

        await sendCommandFrame(commandData)
        this.params.bms[param.field] = value
        this.editingParam = ''
        if (param.type === 'combined') {
          const combinedData = this.combinedParams[param.key]
          const modeLabel = combinedData && combinedData.selectedMode === '1' ? 'SOC' : 'SOH'
          const powerValue = combinedData && combinedData.powerValue ? combinedData.powerValue : ''
          this.showToast(`${param.label}: ${modeLabel} ${powerValue}%下发成功`, 'success')
        } else {
          this.showToast(`${param.label}: ${value}${param.unit || ''}下发成功`, 'success')
        }
      } catch (error) {
        this.showToast(`${param.label}下发失败`, 'error')
        console.error('命令帧发送失败:', error)
      } finally {
        this.isSubmitting = false
      }
    },

    async submitSwitchParam(param, value) {
      let hexValue = value
      if (param.key === 'bms.100') {
        hexValue = parseInt(value, 16).toString()
      }

      const commandData = {
        apiSufix: 't3401_171C_control',
        idCode: this.idCode,
        typeCode: '3401',
        address: this.deviceAddress,
        userId: this.userId,
        commands: [{
          deviceCategory: '171C',
          addr: this.deviceAddress,
          deviceId: '1',
          registerAddress: param.address,
          registerValue: hexValue,
          valueType: '01',
          registerType: '03',
          extra1: '00',
          extra2: '00',
          extra3: '00'
        }]
      }

      await sendCommandFrame(commandData)

      const [module, key] = param.key.split('.')
      this.params[module][key] = value
    },

    getParamValue(paramKey) {
      const [module, key] = paramKey.split('.')
      return this.params[module]?.[key]
    },

    handleEditConfig() {
      const currentRoleId = this.$store.state.currentEsRoleId || this.$store.state.userInfo?.roleId || this.$store.state.user?.roleId
      if (![1, 2, 4, 5].includes(currentRoleId)) {
        uni.showToast({ title: '无权限操作', icon: 'none' });
        return;
      }
      const deviceList = realtimeDataProvider.getDeviceList()
      const device171F = deviceList.find(item => item && item.deviceType === '171F')
      const b12Value = device171F && device171F.controlData && device171F.controlData.B12 && device171F.controlData.B12.value
      console.log('b12Value:', b12Value)
      if (b12Value === undefined || b12Value === null || b12Value === '--') {
        uni.showModal({
          title: '提示',
          content: '当前设备离线，暂不支持修改',
          showCancel: false
        })
        return
      }

      if (b12Value !== 0 && b12Value !== '0') {
        uni.showModal({
          title: '提示',
          content: '策略运行中，参数修改需停止策略！！！',
          showCancel: false
        })
        return
      }

      this.isEditing = true
      this.showToast('已进入编辑模式', 'success')
    },

    closeEdit() {
      this.isEditing = false
      this.editingParam = ''
      this.showToast('已退出编辑模式', 'success')
    },

    handleParamEdit(param) {
      if (!this.isEditing) {
        uni.showToast({
          title: '请先点击修改配置',
          icon: 'none'
        });
        return;
      }
      this.editingParam = param.key
      this.tempValue = this.params.bms[param.field] || ''
    },

    handleParamCancel() {
      this.editingParam = ''
      this.tempValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.bms-settings {
  background: #f5f5f5;
  min-height: 100vh;
  // padding: 20rpx;
}

.param-card {
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  position: relative;
  padding-left: 20rpx;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6rpx;
    height: 28rpx;
    background: linear-gradient(180deg, #6699ff 0%, #4488fb 100%);
    border-radius: 3rpx;
  }
}

.action-btns {
  display: flex;
  gap: 16rpx;
}

.edit-btn {
  padding: 12rpx 28rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  transition: all 0.2s ease;

  &.primary {
    background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
    color: #ffffff;
    box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);

    &:active {
      transform: scale(0.95);
      box-shadow: 0 2rpx 6rpx rgba(102, 153, 255, 0.2);
    }
  }

  &.close {
    background: #f5f5f5;
    color: #666;
    border: 1rpx solid #e0e0e0;

    &:active {
      background: #e8e8e8;
    }
  }
}

.edit-text {
  font-size: 26rpx;
}

.param-list {
  padding: 0 20rpx;
}

.param-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &.editing-row {
    background: #f8fbff;
    margin: 0 -20rpx;
    padding: 28rpx 20rpx;
  }
}

.param-info {
  flex: 0 0 auto;
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.param-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  line-height: 1.4;
}

.param-current {
  font-size: 22rpx;
  color: #6699ff;
  background: rgba(102, 153, 255, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  display: inline-block;
  width: fit-content;
}

.param-range {
  font-size: 22rpx;
  color: #999;
}

.param-right-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16rpx;
  flex: 1;
  min-width: 300rpx;
}



.param-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.param-value-box {
  width: 150rpx;
  height: 64rpx;
  line-height: 64rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  text-align: center;
  border: 2rpx solid transparent;
  transition: all 0.2s ease;

  &.editing {
    background: #ffffff;
    border-color: #6699ff;
    box-shadow: 0 0 0 4rpx rgba(102, 153, 255, 0.1);
  }
}

.val-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.val-input {
  width: 100%;
  height: 100%;
  font-size: 28rpx;
  text-align: center;
  background: transparent;
  border: none;
  color: #333;

  &:focus {
    outline: none;
  }
}

.unit-text {
  font-size: 24rpx;
  color: #999;
  min-width: 40rpx;
  text-align: left;
}

.btn-group {
  display: flex;
  gap: 12rpx;
  flex-direction: column;
}

.btn {
  padding: 12rpx 20rpx;
  font-size: 24rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  transition: all 0.2s ease;
}

.btn-edit {
  color: #6699ff;
  background: #ffffff;
  border: 2rpx solid #6699ff;

  &:active {
    background: #f0f5ff;
  }
}

.btn-sure {
  color: #ffffff;
  background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
  box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);
  min-width: 100rpx;

  &:active {
    transform: scale(0.95);
  }

  &.btn-loading {
    opacity: 0.8;
    pointer-events: none;
  }
}

.btn-cancel {
  color: #999;
  background: #f5f5f5;
  border: 2rpx solid #e0e0e0;
  min-width: 60rpx;

  &:active {
    background: #e8e8e8;
  }
}

.divider {
  height: 16rpx;
  background: #f8f9fa;
  margin: 0;
}

.combined-full {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  border: 2rpx solid #e8e8e8;
}

.combined-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10rpx;
}

.combined-header .param-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.combined-body {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #e8e8e8;
}

.power-input-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.power-input-row .power-label {
  font-size: 26rpx;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
  width: 120rpx;
  min-width: fit-content;
}

.power-input-row .param-value-box {
  width: 180rpx;
  height: 72rpx;
  line-height: 72rpx;
  background: #ffffff;
  border-radius: 8rpx;
  text-align: center;
  border: 2rpx solid #e8e8e8;
  transition: all 0.2s ease;

  &.editing {
    background: #ffffff;
    border-color: #6699ff;
    box-shadow: 0 0 0 4rpx rgba(102, 153, 255, 0.1);
  }
}

.power-input-row .unit-text {
  font-size: 26rpx;
  color: #666;
  min-width: 60rpx;
}

.power-input-row .combined-btn-group {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  flex-shrink: 0;
  margin-left: auto;
}

.power-input-row .combined-btn-group .btn {
  padding: 16rpx 28rpx;
  font-size: 26rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  transition: all 0.2s ease;
  min-width: 100rpx;
}

.power-input-row .combined-btn-group .btn-edit {
  color: #6699ff;
  background: #ffffff;
  border: 2rpx solid #6699ff;

  &:active {
    background: #f0f5ff;
  }
}

.power-input-row .combined-btn-group .btn-sure {
  color: #ffffff;
  background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
  box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);

  &:active {
    transform: scale(0.95);
  }

  &.btn-loading {
    opacity: 0.8;
    pointer-events: none;
  }
}

.power-input-row .combined-btn-group .btn-cancel {
  color: #999;
  background: #f5f5f5;
  border: 2rpx solid #e0e0e0;

  &:active {
    background: #e8e8e8;
  }
}

.range-text {
  font-size: 22rpx;
  color: #999;
}

.mode-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-wrap: wrap;
}

.mode-label {
  font-size: 26rpx;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}

.mode-switch {
  display: flex;
  gap: 16rpx;
}

.mode-switch .switch-btn {
  padding: 14rpx 24rpx;
  font-size: 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  color: #666;
  background: #ffffff;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-align: center;
  min-width: 100rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.95);
    background: #f8f8f8;
  }
}

.mode-switch .btn-active {
  border-color: #6699ff;
  color: #ffffff;
  background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
  box-shadow: 0 4rpx 16rpx rgba(102, 153, 255, 0.35);

  &:active {
    background: linear-gradient(135deg, #5588ee 0%, #3377ea 100%);
    box-shadow: 0 2rpx 8rpx rgba(102, 153, 255, 0.25);
  }
}

.mode-switch .btn-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.switch-section {
  padding: 0 20rpx;
}

.switch-btns-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}

.switch-btns {
  display: flex;
  gap: 16rpx;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 100%;
}

.switch-btn {
  padding: 14rpx 24rpx;
  font-size: 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  color: #666;
  background: #ffffff;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-align: center;
  min-width: 100rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.95);
    background: #f8f8f8;
  }
}

.btn-active {
  border-color: #6699ff;
  color: #ffffff;
  background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
  box-shadow: 0 4rpx 16rpx rgba(102, 153, 255, 0.35);

  &:active {
    background: linear-gradient(135deg, #5588ee 0%, #3377ea 100%);
    box-shadow: 0 2rpx 8rpx rgba(102, 153, 255, 0.25);
  }
}

.btn-danger {
  border-color: #ff6b6b;
  color: #ff6b6b;

  &.btn-active {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
    border-color: #ff6b6b;
    color: #ffffff;
    box-shadow: 0 4rpx 16rpx rgba(255, 107, 107, 0.35);
  }
}

.btn-clicked {
  border-color: #4488fb !important;
  color: #ffffff !important;
  background: #4488fb !important;
  box-shadow: 0 4rpx 16rpx rgba(68, 136, 251, 0.4) !important;
}

.btn-disabled {
  opacity: 0.5;
  pointer-events: none;
}

// 确认弹窗样式
.confirm-popup {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 40rpx;
  width: 560rpx;
  max-width: 90vw;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
}

.popup-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-top: 16rpx;
}

.popup-content {
  margin-bottom: 32rpx;
}

.popup-desc {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  line-height: 1.6;
  display: block;
}

.value-change {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-top: 24rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
}

.value-old {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}

.value-new {
  font-size: 24rpx;
  color: #6699ff;
  font-weight: 600;
}

.popup-actions {
  display: flex;
  gap: 20rpx;
}

.popup-btn {
  flex: 1;
  padding: 24rpx 0;
  border-radius: 8rpx;
  font-size: 28rpx;
  text-align: center;
  transition: all 0.2s ease;

  &.btn-cancel {
    background: #f5f5f5;
    color: #666;

    &:active {
      background: #e8e8e8;
    }
  }

  &.btn-confirm {
    background: linear-gradient(135deg, #6699ff 0%, #4488fb 100%);
    color: #ffffff;

    &:active {
      transform: scale(0.98);
    }

    &.btn-danger {
      background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
    }
  }
}

// 操作提示样式
.operation-toast {
  position: fixed;
  top: 200rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 32rpx;
  border-radius: 8rpx;
  background: #ffffff;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: slideDown 0.3s ease;

  &.success {
    border-left: 4rpx solid #52c41a;
  }

  &.error {
    border-left: 4rpx solid #ff4d4f;
  }

  &.warning {
    border-left: 4rpx solid #faad14;
  }
}

.toast-text {
  font-size: 28rpx;
  color: #333;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20rpx);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

// 加载动画
.loading-spinner {
  width: 28rpx;
  height: 28rpx;
  border: 3rpx solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  &.small {
    width: 24rpx;
    height: 24rpx;
    border-width: 2rpx;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>