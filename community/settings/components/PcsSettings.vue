<template>
  <view class="pcs-settings">
    <view class="param-card">
      <view class="card-header">
        <text class="card-title">PCS 参数设置</text>
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
        <view v-for="param in pcsSwitchParams" :key="param.key" class="param-row">
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
        <view v-for="param in pcsParams" :key="param.key" class="param-row"
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
                <!-- B48 专用：模式选择 -->
                <view v-if="param.modeOptions && !param.voltageMin" class="mode-row">
                  <text class="mode-label">并网模式的功率控制模式：</text>
                  <view class="mode-switch">
                    <view v-for="option in param.modeOptions" :key="option.value" class="switch-btn" :class="{
                      'btn-active': (combinedParams && combinedParams[param.key] && combinedParams[param.key].selectedMode === option.value) || (tempSelectedMode === option.value),
                      'btn-disabled': editingParam !== param.key
                    }" @click="handleCombinedModeClick(param, option)">
                      {{ option.label }}
                    </view>
                  </view>
                </view>
                <!-- 保护参数专用：电压/频率输入 -->
                <view v-if="param.voltageMin" class="power-input-row">
                  <text class="power-label">{{ param.voltageLabel || '交流相电压' }}</text>
                  <view class="param-value-box" :class="{ editing: editingParam === param.key }">
                    <text v-if="editingParam !== param.key" class="val-text" style="color: #333 !important;">
                      {{ getVoltageValue(param.key) }}
                    </text>
                    <input v-else class="val-input" type="digit"
                      :value="(combinedParams && combinedParams[param.key] && combinedParams[param.key].voltageValue !== undefined) ? combinedParams[param.key].voltageValue : ''"
                      @input="handleVoltageInput(param, $event)" :min="param.voltageMin" :max="param.voltageMax"
                      placeholder="请输入" focus />
                  </view>
                  <text class="unit-text">{{ param.voltageUnit || 'V' }}</text>
                  <text class="range-text">{{ param.voltageMin }}~{{ param.voltageMax }}</text>
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
                范围: <template v-if="param.min2 !== undefined">{{ param.min }}~{{ param.max }}, {{ param.min2 }}~{{
                  param.max2 }}</template><template v-else>{{ param.min }}~{{ param.max }}</template>{{ param.unit }}
              </text>
            </view>
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
  name: 'PcsSettings',
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
      // this.deviceAddress = deviceControl.address || '01';
    }
  },
  data() {
    return {
      idCode: '',
      deviceAddress: '01',
      isEditing: false,
      clickedButton: '',
      lastSendTimes: {},
      editingParam: '',
      tempValue: '',
      tempSelectedMode: '',
      isSubmitting: false,
      params: {
        pcs: {}
      },
      combinedParams: {},
      originalParams: {},
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
      pcsParams: [
        // { key: 'pcs.B0', field: 'B0', address: '0x0017', label: '设置模块工作海拔值', unit: 'm', min: 1000, max: 5000 },
        // { key: 'pcs.B4', field: 'B4', address: '0x001E', label: '设置组号', unit: '', min: 0, max: 7 },
        { key: 'pcs.B40', field: 'B40', address: '0x0077', label: '设置直流侧电压', unit: 'V', scale: 1000 },
        { key: 'pcs.B44', field: 'B44', address: '0x0079', label: '设置直流侧电流', unit: 'A', min: -78, max: 73.5, scale: 1000 },
        // { key: 'pcs.B52', field: 'B52', address: '0x0081', label: '设置交流侧总无功功率', unit: 'Var', min: -10648, max: 10648 },
        // { key: 'pcs.B56', field: 'B56', address: '0x0082', label: '设置交流侧功率因素 PF', unit: '', min: -1, max: -0.8, min2: 0.8, max2: 1, scale: 1000 },

        { key: 'pcs.B72', field: 'B72', address: '0x0087', label: '设置直流欠压保护电压', unit: 'V', min: 145, max: 500, scale: 10 },
        { key: 'pcs.B76', field: 'B76', address: '0x0088', label: '设置直流过压保护电压', unit: 'V', min: 600, max: 1030, scale: 10 },
        {
          key: 'pcs.B48', field: 'B48', address: '0x0080', label: '设置交流侧总有功功率', type: 'combined',
          modeOptions: [
            { label: '控DC侧功率模式', value: '0x0000' },
            { label: '控AC侧功率模式', value: '0x0001' }
          ],
          powerLabel: '交流侧总有功功率值',
          unit: 'kW',
          min: 0,
          max: 22
        },

        // {
        //   key: 'pcs.B66', field: 'B66', address: '0x0084', label: '设置交流相电压和频率', type: 'combined',
        //   modeOptions: [
        //     { label: '交流相电压', value: '0x0000' }
        //   ],
        //   powerLabel: '交流频率值',
        //   unit: 'Hz',
        //   min: 50,
        //   max: 60,
        //   voltageMin: 200,
        //   voltageMax: 240
        // },

        {
          key: 'pcs.B80', field: 'B80', address: '0x0089', label: '设置一级交流欠压保护', type: 'combined',
          powerLabel: '保护时间',
          unit: 's',
          min: 0.01,
          max: 655.35,
          voltageMin: 260,
          voltageMax: 365,
          voltageLabel: '线电压',
          voltageUnit: 'V',
          voltageScale: 100,
          timeScale: 100
        },
        {
          key: 'pcs.B84', field: 'B84', address: '0x008A', label: '设置一级交流过压保护', type: 'combined',
          powerLabel: '保护时间',
          unit: 's',
          min: 0.01,
          max: 655.35,
          voltageMin: 396,
          voltageMax: 535,
          voltageLabel: '线电压',
          voltageUnit: 'V',
          voltageScale: 100,
          timeScale: 100
        },
        {
          key: 'pcs.B88', field: 'B88', address: '0x008B', label: '设置一级交流欠频保护', type: 'combined',
          powerLabel: '保护时间',
          unit: 's',
          min: 0.01,
          max: 655.35,
          voltageMin: 45,
          voltageMax: 50,
          voltageLabel: '频率',
          voltageUnit: 'Hz',
          voltageScale: 100,
          timeScale: 100
        },
        {
          key: 'pcs.B92', field: 'B92', address: '0x008C', label: '设置一级交流过频保护', type: 'combined',
          powerLabel: '保护时间',
          unit: 's',
          min: 0.01,
          max: 655.35,
          voltageMin: 50,
          voltageMax: 65,
          voltageLabel: '频率',
          voltageUnit: 'Hz',
          voltageScale: 100,
          timeScale: 100
        },
        {
          key: 'pcs.B96', field: 'B96', address: '0x008D', label: '设置二级交流欠频保护', type: 'combined',
          powerLabel: '保护时间',
          unit: 's',
          min: 0.01,
          max: 655.35,
          voltageMin: 45,
          voltageMax: 50,
          voltageLabel: '频率',
          voltageUnit: 'Hz',
          voltageScale: 100,
          timeScale: 100
        },
        {
          key: 'pcs.B100', field: 'B100', address: '0x008E', label: '设置二级交流过频保护', type: 'combined',
          powerLabel: '保护时间',
          unit: 's',
          min: 0.01,
          max: 655.35,
          voltageMin: 50,
          voltageMax: 65,
          voltageLabel: '频率',
          voltageUnit: 'Hz',
          voltageScale: 100,
          timeScale: 100
        },
        {
          key: 'pcs.B108', field: 'B108', address: '0x0090', label: '设置二级交流欠压保护', type: 'combined',
          powerLabel: '保护时间',
          unit: 's',
          min: 0.01,
          max: 655.35,
          voltageMin: 260,
          voltageMax: 365,
          voltageLabel: '线电压',
          voltageUnit: 'V',
          voltageScale: 100,
          timeScale: 100
        },
        {
          key: 'pcs.B112', field: 'B112', address: '0x0091', label: '设置二级交流过压保护', type: 'combined',
          powerLabel: '保护时间',
          unit: 's',
          min: 0.01,
          max: 655.35,
          voltageMin: 396,
          voltageMax: 535,
          voltageLabel: '线电压',
          voltageUnit: 'V',
          voltageScale: 10,
          timeScale: 100
        }
      ],
      pcsSwitchParams: [
        // {
        //   key: 'pcs.B8', field: 'B8', address: '0x001F', label: '设置模块地址分配方式', options: [
        //     { label: '自动分配', value: '0x00000000' },
        //     { label: '拨码设置', value: '0x00010000' }
        //   ]
        // },
        {
          key: 'pcs.B12', field: 'B12', address: '0x0024', label: '设置离网模式交流侧欠压复位', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '复位', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B16', field: 'B16', address: '0x0025', label: '设置整流模式直流侧欠压复位', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '复位', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B20', field: 'B20', address: '0x002F', label: '设置模块工作模式', options: [
            { label: '并网', value: '0x00000000' },
            { label: '离网', value: '0x00010000' },
            { label: '整流', value: '0x00020000' }
          ]
        },
        {
          key: 'pcs.B24', field: 'B24', address: '0x0030', label: '设置模块开关机', options: [
            { label: '开机', value: '0x00000000', dangerous: true },
            { label: '关机', value: '0x00010000', dangerous: true }
          ]
        },
        {
          key: 'pcs.B28', field: 'B28', address: '0x0031', label: '设置模块直流侧过压复位', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '复位', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B32', field: 'B32', address: '0x0042', label: '设置逆变模式直流侧欠压复位', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '复位', value: '0x00010000' }
          ]
        },
        {
          key: 'pcs.B36', field: 'B36', address: '0x0044', label: '设置模块短路复位', options: [
            { label: '禁止', value: '0x00000000' },
            { label: '复位', value: '0x00010000' }
          ]
        },
        // {
        //   key: 'pcs.B60', field: 'B60', address: '0x0083', label: '设置交流侧无功功率类型', options: [
        //     { label: '不设置无功功率输出功能', value: '0x00A00000' },
        //     { label: '通过 PF 设置命令', value: '0x00A10000' },
        //     { label: '通过无功功率设置命令', value: '0x00A20000' }
        //   ]
        // },
        // {
        //   key: 'pcs.B68', field: 'B68', address: '0x0085', label: '设置是否错相', options: [
        //     { label: '不允许', value: '0x00000000' },
        //     { label: '允许', value: '0x00010000' }
        //   ]
        // },
        // {
        //   key: 'pcs.B104', field: 'B104', address: '0x008F', label: '设置是否过载输出', options: [
        //     { label: '禁用', value: '0x00000000' },
        //     { label: '使能', value: '0x00010000' }
        //   ]
        // },
        // {
        //   key: 'pcs.B116', field: 'B116', address: '0x0092', label: '设置是否使能输入电压环', options: [
        //     { label: '禁用', value: '0x00000000' },
        //     { label: '使能', value: '0x00010000' }
        //   ]
        // }
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

    // 显示操作结果提示
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

    // 判断是否为危险操作
    isDangerousOption(option) {
      return option.dangerous === true
    },

    // 获取当前选项标签
    getCurrentOptionLabel(param) {
      const currentValue = this.getParamValue(param.key)
      const option = param.options.find(opt => opt.value === currentValue)
      return option ? option.label : ''
    },

    // 处理开关点击
    handleSwitchClick(param, option) {
      if (!this.checkEditMode()) return

      const currentValue = this.getParamValue(param.key)
      if (currentValue === option.value) {
        this.showToast('已经是当前设置', 'warning')
        return
      }

      // 危险操作需要确认
      if (this.isDangerousOption(option)) {
        this.openConfirmPopup({
          title: '危险操作确认',
          content: `确定要执行"${param.label}"的"${option.label}"操作吗？此操作可能影响系统运行。`,
          oldValue: this.getCurrentOptionLabel(param),
          newValue: option.label,
          isDangerous: true,
          action: () => this.executeSwitchCommand(param, option)
        })
      } else {
        // 普通操作直接执行
        this.executeSwitchCommand(param, option)
      }
    },

    showCombinedValue(key) {
      // console.log('showCombinedValue called with key:', key)
      // console.log('combinedParams:', this.combinedParams)
      if (this.combinedParams && this.combinedParams[key]) {
        const powerValue = this.combinedParams[key].powerValue
        console.log('powerValue:', powerValue)
        console.log('powerValue !== undefined && powerValue !== "":', powerValue !== undefined && powerValue !== '')
        if (powerValue !== undefined && powerValue !== '') {
          return powerValue
        }
      }
      return '--'
    },

    getVoltageValue(key) {
      // console.log('getVoltageValue called with key:', key)  
      // console.log('combinedParams:', this.combinedParams) 
      if (this.combinedParams && this.combinedParams[key]) {
        const voltageValue = this.combinedParams[key].voltageValue
        // console.log('voltageValue:', voltageValue)
        // console.log('voltageValue !== undefined && voltageValue !== "":', voltageValue !== undefined && voltageValue !== '')
        if (voltageValue !== undefined && voltageValue !== '') {
          return voltageValue
        }
      }
      return '--'
    },

    handleCombinedModeClick(param, option) {
      // 直接检查是否正在编辑当前参数
      if (this.editingParam !== param.key) {
        this.showToast('请先点击编辑按钮', 'warning')
        return
      }
      // 更新临时选中状态，确保响应式更新
      this.tempSelectedMode = option.value
      console.log('tempSelectedMode updated:', this.tempSelectedMode)

      if (!this.combinedParams) {
        this.combinedParams = {}
      }
      // 使用 $set 确保响应式更新
      if (!this.combinedParams[param.key]) {
        this.$set(this.combinedParams, param.key, { selectedMode: '', powerValue: '' })
      }
      this.$set(this.combinedParams[param.key], 'selectedMode', option.value)
      console.log('combinedParams updated:', this.combinedParams)
    },

    handleCombinedInput(param, event) {
      if (!this.combinedParams) {
        this.combinedParams = {}
      }

      const value = event.detail.value
      console.log('handleCombinedInput called:', param.key, value)

      // 确保 combinedParams[param.key] 存在且包含所有必要字段
      if (!this.combinedParams[param.key]) {
        this.$set(this.combinedParams, param.key, {
          selectedMode: '0x0000',
          powerValue: value,
          voltageValue: ''
        })
      } else {
        // 保留已有值，只更新 powerValue
        const existing = this.combinedParams[param.key]
        this.$set(existing, 'powerValue', value)
        // 确保其他字段存在
        if (existing.selectedMode === undefined) {
          this.$set(existing, 'selectedMode', '0x0000')
        }
        if (existing.voltageValue === undefined) {
          this.$set(existing, 'voltageValue', '')
        }
      }

      console.log('handleCombinedInput result:', this.combinedParams[param.key])
    },

    handleVoltageInput(param, event) {
      if (!this.combinedParams) {
        this.combinedParams = {}
      }

      const value = event.detail.value
      console.log('handleVoltageInput called:', param.key, value)

      // 确保 combinedParams[param.key] 存在且包含所有必要字段
      if (!this.combinedParams[param.key]) {
        this.$set(this.combinedParams, param.key, {
          selectedMode: '0x0000',
          powerValue: '',
          voltageValue: value
        })
      } else {
        // 保留已有值，只更新 voltageValue
        const existing = this.combinedParams[param.key]
        this.$set(existing, 'voltageValue', value)
        // 确保其他字段存在
        if (existing.selectedMode === undefined) {
          this.$set(existing, 'selectedMode', '0x0000')
        }
        if (existing.powerValue === undefined) {
          this.$set(existing, 'powerValue', '')
        }
      }

      console.log('handleVoltageInput result:', this.combinedParams[param.key])
    },

    // 执行开关命令
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
        await this.submitSwitchParam(param.key, option.value)
        this.showToast(`${param.label}: ${option.label}成功`, 'success')
      } catch (error) {
        this.showToast(`${param.label}: ${option.label}失败`, 'error')
      }
    },

    // 打开确认弹窗
    openConfirmPopup(data) {
      this.confirmData = { ...data }
      this.$refs.confirmPopup.open()
    },

    // 关闭确认弹窗
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

    // 确认执行
    async confirmAction() {
      if (this.confirmData.action) {
        this.isSubmitting = true
        await this.confirmData.action()
        this.isSubmitting = false
      }
      this.closeConfirmPopup()
    },

    // 格式化参数值显示
    formatParamValue(param) {
      const value = this.params.pcs[param.field]
      if (value === undefined || value === null || value === '') {
        return '--'
      }
      return value
    },

    // 处理输入框失焦
    handleInputBlur(param) {
      this.validateAndFormatValue(param)
    },

    // 处理输入框确认
    handleInputConfirm(param) {
      this.validateAndFormatValue(param)
    },

    // 校验并格式化输入值
    validateAndFormatValue(param) {
      let value = parseFloat(this.tempValue)
      if (isNaN(value)) {
        return
      }

      // 范围限制（支持双区间）
      if (param.min2 !== undefined && param.max2 !== undefined) {
        // 双区间校验：第一组 或 第二组
        const inRange1 = value >= param.min && value <= param.max
        const inRange2 = value >= param.min2 && value <= param.max2
        if (!inRange1 && !inRange2) {
          this.showToast(`值必须在 ${param.min}~${param.max} 或 ${param.min2}~${param.max2} 范围内`, 'warning')
          value = this.tempValue
        }
      } else {
        if (param.min !== undefined && value < param.min) {
          value = param.min
          this.showToast(`不能小于${param.min}`, 'warning')
        }
        if (param.max !== undefined && value > param.max) {
          value = param.max
          this.showToast(`不能大于${param.max}`, 'warning')
        }
      }

      // 精度处理
      if (param.key === 'pcs.B44') {
        value = Math.round(value * 10) / 10
      } else if (param.scale) {
        // 带 scale 参数的，根据 scale 保留小数位
        const factor = Math.pow(10, Math.floor(Math.log10(param.scale)))
        value = Math.round(value * factor) / factor
      } else {
        value = Math.round(value)
      }

      this.tempValue = value.toString()
    },

    async submitParam(param) {
      // 处理组合参数
      if (param.type === 'combined') {
        if (!this.combinedParams) return
        const combinedData = this.combinedParams[param.key]
        if (!combinedData) return

        // 保护参数需要验证电压/频率值
        if (param.voltageMin) {
          const voltageValue = combinedData.voltageValue
          if (!voltageValue && voltageValue !== '0') {
            this.showToast(`请输入${param.voltageLabel}`, 'warning')
            return
          }
          const voltageNum = parseFloat(voltageValue)
          if (isNaN(voltageNum)) {
            this.showToast(`请输入有效的${param.voltageLabel}`, 'warning')
            return
          }
          if (param.voltageMin !== undefined && voltageNum < param.voltageMin) {
            this.showToast(`${param.voltageLabel}不能小于${param.voltageMin}`, 'warning')
            return
          }
          if (param.voltageMax !== undefined && voltageNum > param.voltageMax) {
            this.showToast(`${param.voltageLabel}不能大于${param.voltageMax}`, 'warning')
            return
          }
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

        let newValue = ''
        if (param.modeOptions) {
          // B48模式：有模式选择
          const modeLabel = param.modeOptions.find(opt => opt.value === combinedData.selectedMode)?.label || ''
          newValue = `${modeLabel} ${powerValue}${param.unit}`
        } else {
          // 保护参数：电压/频率 + 时间组合
          const voltageValue = combinedData.voltageValue || ''
          newValue = `${param.voltageLabel} ${voltageValue}${param.voltageUnit} / ${param.powerLabel} ${powerValue}${param.unit}`
        }

        this.openConfirmPopup({
          title: '参数下发确认',
          content: `确定要下发"${param.label}"参数吗？`,
          oldValue: this.params.pcs[param.field] || '--',
          newValue: newValue,
          isDangerous: false,
          param: param,
          action: () => this.executeSubmitCombinedParam(param, combinedData)
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

      // 范围校验（支持双区间）
      if (param.min2 !== undefined && param.max2 !== undefined) {
        // 双区间校验：第一组 或 第二组
        const inRange1 = numValue >= param.min && numValue <= param.max
        const inRange2 = numValue >= param.min2 && numValue <= param.max2
        if (!inRange1 && !inRange2) {
          this.showToast(`${param.label}必须在 ${param.min}~${param.max} 或 ${param.min2}~${param.max2} 范围内`, 'warning')
          return
        }
      } else {
        if (param.min !== undefined && numValue < param.min) {
          this.showToast(`${param.label}不能小于${param.min}`, 'warning')
          return
        }
        if (param.max !== undefined && numValue > param.max) {
          this.showToast(`${param.label}不能大于${param.max}`, 'warning')
          return
        }
      }

      // 打开确认弹窗
      this.openConfirmPopup({
        title: '参数下发确认',
        content: `确定要下发"${param.label}"参数吗？`,
        oldValue: this.params.pcs[param.field] || '--',
        newValue: value + (param.unit || ''),
        isDangerous: false,
        param: param,
        action: () => this.executeSubmitParam(param, value)
      })
    },

    async executeSubmitCombinedParam(param, combinedData) {
      const now = Date.now()
      const paramLastSendTime = this.lastSendTimes[param.key] || 0
      if (now - paramLastSendTime < 5000) {
        this.showToast('请间隔5秒后再下发', 'warning')
        this.isSubmitting = false
        return
      }

      this.isSubmitting = true
      this.lastSendTimes[param.key] = Date.now()

      try {
        let registerValue = ''

        // 根据参数类型判断
        if (param.voltageMin) {
          // B66 或保护参数：电压/频率 + 时间组合
          // 电压/频率（高16位）：实际值 * scale
          const voltageScale = param.voltageScale || (param.voltageUnit === 'Hz' ? 10 : 10)
          const voltageInt = Math.round(parseFloat(combinedData.voltageValue) * voltageScale)
          console.log('voltageInt:', voltageInt)
          const voltageHex = voltageInt.toString(16).toUpperCase().padStart(4, '0')
          console.log('voltageHex:', voltageHex)

          // 保护时间（低16位）：实际值 * scale（单位 s）
          const timeScale = param.timeScale || 1
          const timeInt = Math.round(parseFloat(combinedData.powerValue) * timeScale)
          console.log('timeInt:', timeInt)
          const timeHex = timeInt.toString(16).toUpperCase().padStart(4, '0')
          console.log('timeHex:', timeHex)

          // 组合成8位16进制：电压/频率值(高4位) + 时间值(低4位)
          registerValue = '0x' + voltageHex + timeHex
          console.log('registerValue:', registerValue)
        } else {
          // B48: 模式值和功率值组合（原逻辑）
          // 模式值（高16位）：0x0000 或 0x0001
          const modeHex = combinedData.selectedMode.slice(2).toUpperCase()  // 去掉0x前缀

          // 功率值（低16位）：输入值 × 1000 转成 mW 单位，再转4位16进制
          const powerInt = Math.round(parseFloat(combinedData.powerValue) * 1000)
          console.log('powerInt:', powerInt)
          const powerHex = powerInt.toString(16).toUpperCase().padStart(4, '0')
          console.log('powerHex:', powerHex)

          // 组合成8位16进制：模式值(高4位) + 功率值(低4位)
          registerValue = '0x' + modeHex + powerHex
        }

        const commandData = {
          apiSufix: 'multiControl',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '171B',
            addr: this.deviceAddress,
            deviceId: '1',
            registerAddress: param.address,
            registerValue: registerValue,
            valueType: '01',
            registerType: '03',
            extra1: '00',
            extra2: '00',
            extra3: '00'
          }]
        }

        const res = await sendCommandFrame(commandData)
        if (res.status === 200) {
          this.showToast('下发成功', 'success')
          this.params.pcs[param.field] = registerValue
          // 下发成功后，保持 combinedParams 中的值不变
          console.log('下发成功，combinedParams:', this.combinedParams)
          console.log('voltageValue:', this.combinedParams && this.combinedParams[param.key] ? this.combinedParams[param.key].voltageValue : 'N/A')
          console.log('powerValue:', this.combinedParams && this.combinedParams[param.key] ? this.combinedParams[param.key].powerValue : 'N/A')
          // 重要：不要在这里修改 combinedParams，让它保持用户输入的值
        } else {
          this.showToast('下发失败: ' + res.msg, 'error')
          // 下发失败，恢复原始值
          if (this.originalParams[param.key]) {
            this.combinedParams[param.key] = JSON.parse(JSON.stringify(this.originalParams[param.key]))
          }
        }
      } catch (error) {
        console.error('下发失败:', error)
        this.showToast('下发失败', 'error')
        // 下发失败，恢复原始值
        if (this.originalParams[param.key]) {
          this.combinedParams[param.key] = JSON.parse(JSON.stringify(this.originalParams[param.key]))
        }
      } finally {
        this.isSubmitting = false
        this.editingParam = ''
        this.tempSelectedMode = ''  // 重置临时选中状态
        this.closeConfirmPopup()
      }
    },

    async executeSubmitParam(param, value) {
      const now = Date.now()
      const paramLastSendTime = this.lastSendTimes[param.key] || 0
      if (now - paramLastSendTime < 5000) {
        this.showToast('请间隔5秒后再下发', 'warning')
        this.isSubmitting = false
        return
      }

      this.isSubmitting = true
      this.lastSendTimes[param.key] = Date.now()

      try {
        const registerAddress = param.address

        const valueMultiplier = {
          'pcs.B0': 1000,
          'pcs.B52': 1,     // 设置交流侧总无功功率 (Var)
          'pcs.B56': 1000,  // 设置交流侧功率因素 PF: 传输值 = 实际值 × 1000
          'pcs.B66': 10,    // 交流相电压: 传输值 = 实际值 × 10
          'pcs.B66F': 1000  // 交流频率: 传输值 = 实际值 × 1000 (Hz转mHz)
        }
        const hexParams = ['pcs.B4']
        // 优先使用 param.scale，其次使用映射表
        const multiplier = param.scale || valueMultiplier[param.key] || 1
        const finalValue = Math.round(parseFloat(value) * multiplier)
        const registerValue = hexParams.includes(param.key)
          ? '0x' + finalValue.toString(16).padStart(8, '0')
          : finalValue.toString()

        const commandData = {
          apiSufix: 'multiControl',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '171B',
            addr: this.deviceAddress,
            deviceId: '1',
            registerAddress: param.address || registerAddress,
            registerValue: registerValue,
            valueType: '01',
            registerType: '03',
            extra1: '00',
            extra2: '00',
            extra3: '00'
          }]
        }
        console.log(commandData, param.key)

        await sendCommandFrame(commandData)
        this.params.pcs[param.field] = value
        this.editingParam = ''
        this.showToast(`${param.label}: ${value}${param.unit || ''}下发成功`, 'success')
      } catch (error) {
        this.showToast(`${param.label}下发失败`, 'error')
        console.error('命令帧发送失败:', error)
      } finally {
        this.isSubmitting = false
      }
    },

    async submitSwitchParam(paramKey, value) {
      const param = this.pcsSwitchParams.find(p => p.key === paramKey)

      console.log(param, paramKey, value, registerAddress, "0000000000089898989")
      if (!param) return

      const registerAddress = param.address

      const commandData = {
        apiSufix: 't3401_171B_control',
        idCode: this.idCode,
        typeCode: '3401',
        address: this.deviceAddress,
        userId: this.userId,
        commands: [{
          deviceCategory: '171B',
          addr: this.deviceAddress,
          deviceId: '1',
          registerAddress: registerAddress,
          registerValue: value,
          valueType: '01',
          registerType: '03',
          extra1: '00',
          extra2: '00',
          extra3: '00'
        }]
      }

      await sendCommandFrame(commandData)

      // 更新本地状态
      const [module, key] = paramKey.split('.')
      this.params[module][key] = value
    },

    getParamValue(paramKey) {
      const [module, key] = paramKey.split('.')
      return this.params[module][key]
    },

    handleEditConfig() {
      const deviceList = realtimeDataProvider.getDeviceList()
      const device171F = deviceList.find(item => item && item.deviceType === '171F')
      const b12Value = device171F && device171F.controlData && device171F.controlData.B12 && device171F.controlData.B12.value
      
      if (b12Value === undefined || b12Value === null) {
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
      this.isEditing = true
      this.editingParam = param.key
      this.tempValue = this.params.pcs[param.field] || ''

      console.log('handleParamEdit start:', param.key)
      console.log('combinedParams before:', this.combinedParams)
      console.log('originalParams before:', this.originalParams)

      // 如果是组合参数，保存原始值以便取消时恢复
      if (param.type === 'combined') {
        if (!this.combinedParams) {
          this.combinedParams = {}
        }

        // 确保 combinedParams[param.key] 存在且包含所有必要字段
        if (!this.combinedParams[param.key]) {
          // 使用 $set 确保响应式
          this.$set(this.combinedParams, param.key, param.voltageMin
            ? { selectedMode: '0x0000', powerValue: '', voltageValue: '' }
            : { selectedMode: '', powerValue: '' }
          )
          console.log('created new combinedParams[param.key]:', this.combinedParams[param.key])
        } else {
          // 如果对象存在但缺少字段，补全字段（使用 $set 确保响应式）
          const existing = this.combinedParams[param.key]
          console.log('existing combinedParams[param.key]:', existing)
          if (param.voltageMin && existing.voltageValue === undefined) {
            this.$set(existing, 'voltageValue', '')
            console.log('added voltageValue')
          }
          if (existing.powerValue === undefined) {
            this.$set(existing, 'powerValue', '')
            console.log('added powerValue')
          }
          if (existing.selectedMode === undefined) {
            this.$set(existing, 'selectedMode', param.voltageMin ? '0x0000' : '')
            console.log('added selectedMode')
          }
        }

        // 保存原始值
        this.originalParams[param.key] = JSON.parse(JSON.stringify(this.combinedParams[param.key]))
        console.log('saved originalParams[param.key]:', this.originalParams[param.key])
      }

      // console.log('combinedParams after:', this.combinedParams)
    },

    handleParamCancel() {
      // 如果是组合参数，恢复原始值
      if (this.editingParam && this.originalParams[this.editingParam]) {
        this.combinedParams[this.editingParam] = JSON.parse(JSON.stringify(this.originalParams[this.editingParam]))
      }
      this.editingParam = ''
      this.tempValue = ''
      this.tempSelectedMode = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.pcs-settings {
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
  align-items: flex-start;
  gap: 20rpx;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  transition: all 0.2s ease;
  flex-wrap: wrap;

  &:last-child {
    border-bottom: none;
  }

  &.editing-row {
    background: #f8fbff;
    margin: 0 -20rpx;
    padding: 28rpx 20rpx;
  }

  .combined-full {
    display: block;
    width: 100%;
  }
}

.param-info {
  flex: 0 0 auto;
  width: 280rpx;
  flex-shrink: 0;
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
  align-items: flex-start;
  justify-content: flex-end;
  gap: 20rpx;
  flex: 1;
  min-width: 300rpx;
  flex-wrap: wrap;
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
  flex-shrink: 0;
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
  margin-left: 8rpx;
  flex-shrink: 0;
}

.mode-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.mode-label {
  font-size: 24rpx;
  color: #666;
  white-space: nowrap;
  flex-shrink: 0;
}

.mode-switch {
  display: flex;
  gap: 12rpx;

  .switch-btn {
    padding: 10rpx 24rpx;
    font-size: 24rpx;
    border-radius: 8rpx;
    background: #f5f7fa;
    color: #666;
    transition: all 0.2s;
    border: 1rpx solid #e8e8e8;

    &.btn-active {
      background: #6699ff !important;
      color: #ffffff !important;
      border-color: #6699ff !important;
    }

    &.btn-disabled {
      opacity: 0.6;
    }
  }
}

.power-input-box {
  display: flex;
  align-items: center;
  gap: 12rpx;

  .power-label {
    font-size: 24rpx;
    color: #999;
    white-space: nowrap;
  }

  .param-value-box {
    width: 150rpx;
  }
}

// 开关型参数样式
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
