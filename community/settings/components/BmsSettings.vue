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
              <view 
                v-for="option in param.options" 
                :key="option.value" 
                class="switch-btn"
                :class="[
                  getParamValue(param.key) === option.value ? 'btn-active' : '', 
                  !isEditing ? 'btn-disabled' : '',
                  clickedButton === param.key + '-' + option.value ? 'btn-clicked' : '',
                  isDangerousOption(option) ? 'btn-danger' : ''
                ]"
                @click="handleSwitchClick(param, option)"
              >
                {{ option.label }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 数值型参数 -->
      <view class="divider"></view>
      <view class="param-list">
        <view v-for="param in bmsParams" :key="param.key" class="param-row" :class="{ 'editing-row': editingParam === param.key }">
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
                <input v-else class="val-input" type="digit" v-model="tempValue" :min="param.min"
                  :max="param.max" placeholder="请输入" focus @blur="handleInputBlur(param)" @confirm="handleInputConfirm(param)" />
              </view>
              <text class="unit-text">{{ param.unit || '' }}</text>
            </view>
            <view class="btn-group">
              <view v-if="editingParam !== param.key" class="btn btn-edit" @click="handleParamEdit(param)">
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
      <uni-icons :type="operationLog.type === 'success' ? 'checkmarkempty' : 'closeempty'" size="20" :color="operationLog.type === 'success' ? '#52c41a' : '#ff4d4f'"></uni-icons>
      <text class="toast-text">{{ operationLog.message }}</text>
    </view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'

export default {
  name: 'BmsSettings',
  props: {},
  computed: {
    userId() {
      return this.$store.state.userInfo?.userId || 0
    }
  },
  data() {
    return {
      idCode: 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF',
      deviceAddress: '04',
      isEditing: false,
      editingParam: '',
      tempValue: '',
      isSubmitting: false,
      lastSendTime: 0,
      clickedButton: '',
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
        { key: 'bms.B0', field: 'B0', label: '组端过压 1 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B2', field: 'B2', label: '组端过压 2 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B4', field: 'B4', label: '组端过压 3 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B6', field: 'B6', label: '组端过压报警回差值', unit: 'V', min: 0, max: 25 },
        { key: 'bms.B8', field: 'B8', label: '组端欠压 1 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B10', field: 'B10', label: '组端欠压 2 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B12', field: 'B12', label: '组端欠压 3 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B14', field: 'B14', label: '组端欠压报警回差值', unit: 'V', min: 0, max: 25 },
        { key: 'bms.B16', field: 'B16', label: '组端放电过流 1 级报警阈值', unit: 'A', min: 0, max: 1000 },
        { key: 'bms.B18', field: 'B18', label: '组端放电过流 2 级报警阈值', unit: 'A', min: 0, max: 1000 },
        { key: 'bms.B20', field: 'B20', label: '组端放电过流 3 级报警阈值', unit: 'A', min: 0, max: 1000 },
        { key: 'bms.B22', field: 'B22', label: '组端放电过流报警回差值', unit: 'A', min: 0, max: 25 },
        { key: 'bms.B24', field: 'B24', label: '组端充电过流 1 级报警阈值', unit: 'A', min: 0, max: 1000 },
        { key: 'bms.B26', field: 'B26', label: '组端充电过流 2 级报警阈值', unit: 'A', min: 0, max: 1000 },
        { key: 'bms.B28', field: 'B28', label: '组端充电过流 3 级报警阈值', unit: 'A', min: 0, max: 1000 },
        { key: 'bms.B30', field: 'B30', label: '组端充电过流报警回差值', unit: 'A', min: 0, max: 25 },
        { key: 'bms.B32', field: 'B32', label: '组端绝缘 1 级报警阈值', unit: 'kΩ', min: 0, max: 60000 },
        { key: 'bms.B34', field: 'B34', label: '组端绝缘 2 级报警阈值', unit: 'kΩ', min: 0, max: 60000 },
        { key: 'bms.B36', field: 'B36', label: '组端绝缘 3 级报警阈值', unit: 'kΩ', min: 0, max: 60000 },
        { key: 'bms.B38', field: 'B38', label: '组端绝缘报警回差值', unit: 'kΩ', min: 0, max: 255 },
        { key: 'bms.B40', field: 'B40', label: '单体充电过温 1 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B42', field: 'B42', label: '单体充电过温 2 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B44', field: 'B44', label: '单体充电过温 3 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B46', field: 'B46', label: '电池充电过温报警回差值', unit: '℃', min: 0, max: 100 },
        { key: 'bms.B48', field: 'B48', label: '单体充电欠温 1 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B50', field: 'B50', label: '单体充电欠温 2 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B52', field: 'B52', label: '单体充电欠温 3 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B54', field: 'B54', label: '单体充电欠温报警回差值', unit: '℃', min: 0, max: 100 },
        { key: 'bms.B56', field: 'B56', label: '单体电压过压 1 级报警阈值', unit: 'mV', min: 0, max: 4.5 },
        { key: 'bms.B58', field: 'B58', label: '单体电压过压 2 级报警阈值', unit: 'mV', min: 0, max: 4.5 },
        { key: 'bms.B60', field: 'B60', label: '单体电压过压 3 级报警阈值', unit: 'mV', min: 0, max: 4.5 },
        { key: 'bms.B62', field: 'B62', label: '单体电压过压报警回差值', unit: 'mV', min: 0, max: 0.25 },
        { key: 'bms.B64', field: 'B64', label: '单体电压欠压 1 级报警阈值', unit: 'mV', min: 0, max: 4.5 },
        { key: 'bms.B66', field: 'B66', label: '单体电压欠压 2 级报警阈值', unit: 'mV', min: 0, max: 4.5 },
        { key: 'bms.B68', field: 'B68', label: '单体电压欠压 3 级报警阈值', unit: 'mV', min: 0, max: 4.5 },
        { key: 'bms.B70', field: 'B70', label: '单体电压欠压报警回差值', unit: 'mV', min: 0, max: 0.25 },
        { key: 'bms.B72', field: 'B72', label: '单体电压差压 1 级报警阈值', unit: 'mV', min: 0, max: 4.5 },
        { key: 'bms.B74', field: 'B74', label: '单体电压差压 2 级报警阈值', unit: 'mV', min: 0, max: 4.5 },
        { key: 'bms.B76', field: 'B76', label: '单体电压差压 3 级报警阈值', unit: 'mV', min: 0, max: 4.5 },
        { key: 'bms.B78', field: 'B78', label: '单体电压差压报警回差值', unit: 'mV', min: 0, max: 0.25 },
        { key: 'bms.B80', field: 'B80', label: '单体温度温差 1 级报警阈值', unit: '℃', min: 0, max: 100 },
        { key: 'bms.B82', field: 'B82', label: '单体温度温差 2 级报警阈值', unit: '℃', min: 0, max: 100 },
        { key: 'bms.B84', field: 'B84', label: '单体温度温差 3 级报警阈值', unit: '℃', min: 0, max: 100 },
        { key: 'bms.B86', field: 'B86', label: '单体温度温差报警回差值', unit: '℃', min: 0, max: 10 },
        { key: 'bms.B88', field: 'B88', label: 'SOC 过低 1 级报警阈值', unit: '%', min: 0, max: 100 },
        { key: 'bms.B90', field: 'B90', label: 'SOC 过低 2 级报警阈值', unit: '%', min: 0, max: 100 },
        { key: 'bms.B92', field: 'B92', label: 'SOC 过低 3 级报警阈值', unit: '%', min: 0, max: 100 },
        { key: 'bms.B94', field: 'B94', label: 'SOC 过低报警回差值', unit: '%', min: 0, max: 100 },
        { key: 'bms.B96', field: 'B96', label: '动力插箱温度过高 1 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B98', field: 'B98', label: '动力插箱温度过高 2 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B100', field: 'B100', label: '动力插箱温度过高 3 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B102', field: 'B102', label: '动力插箱温度过高报警回差值', unit: '℃', min: 0, max: 25 },
        { key: 'bms.B104', field: 'B104', label: '电池模组过压 1 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B106', field: 'B106', label: '电池模组过压 2 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B108', field: 'B108', label: '电池模组过压 3 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B110', field: 'B110', label: '电池模组过压报警回差值', unit: 'V', min: 0, max: 25 },
        { key: 'bms.B112', field: 'B112', label: '电池模组欠压 1 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B114', field: 'B114', label: '电池模组欠压 2 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B116', field: 'B116', label: '电池模组欠压 3 级报警阈值', unit: 'V', min: 0, max: 1000 },
        { key: 'bms.B118', field: 'B118', label: '电池模组欠压报警回差值', unit: 'V', min: 0, max: 25 },
        { key: 'bms.B120', field: 'B120', label: '单体放电过温 1 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B122', field: 'B122', label: '单体放电过温 2 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B124', field: 'B124', label: '单体放电过温 3 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B126', field: 'B126', label: '单体放电过温报警回差值', unit: '℃', min: 0, max: 100 },
        { key: 'bms.B128', field: 'B128', label: '单体放电欠温 1 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B130', field: 'B130', label: '单体放电欠温 2 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B132', field: 'B132', label: '单体放电欠温 3 级报警阈值', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B134', field: 'B134', label: '电池放电欠温报警回差值', unit: '℃', min: 0, max: 100 },
        { key: 'bms.B136', field: 'B136', label: 'SOC 过高 1 级报警阈值', unit: '%', min: 0, max: 100 },
        { key: 'bms.B138', field: 'B138', label: 'SOC 过高 2 级报警阈值', unit: '%', min: 0, max: 100 },
        { key: 'bms.B140', field: 'B140', label: 'SOC 过高 3 级报警阈值', unit: '%', min: 0, max: 100 },
        { key: 'bms.B142', field: 'B142', label: 'SOC 过高报警回差值', unit: '%', min: 0, max: 100 },
        { key: 'bms.B144', field: 'B144', label: '温升快 1 级报警阈值', unit: '℃/min', min: 0, max: 100 },
        { key: 'bms.B146', field: 'B146', label: '温升快 2 级报警阈值', unit: '℃/min', min: 0, max: 100 },
        { key: 'bms.B148', field: 'B148', label: '温升快 3 级报警阈值', unit: '℃/min', min: 0, max: 100 },
        { key: 'bms.B150', field: 'B150', label: '温升快报警回差值', unit: '℃/min', min: 0, max: 100 },
        { key: 'bms.B174', field: 'B174', label: '风扇启动温度', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B176', field: 'B176', label: '风扇关闭温度', unit: '℃', min: -40, max: 120 },
        { key: 'bms.B178', field: 'B178', label: 'SOC/SOH 设置电池序号', unit: '', min: 0, max: 480 },
        { key: 'bms.B180', field: 'B180', label: 'SOC/SOH 设置', unit: '' },
        { key: 'bms.B184', field: 'B184', label: '可调风扇控制-占空比', unit: '%', min: 0, max: 100 },
        { key: 'bms.B194', field: 'B194', label: '累计充电电量', unit: 'kWh', min: 0, max: 100000 },
        { key: 'bms.B198', field: 'B198', label: '累计放电电量', unit: 'kWh', min: 0, max: 100000 },
        { key: 'bms.B204', field: 'B204', label: '电池容量', unit: 'Ah' },
        { key: 'bms.B206', field: 'B206', label: '电传感器量程 1', unit: '' },
        { key: 'bms.B208', field: 'B208', label: '电传感器量程 2', unit: '' },
        { key: 'bms.B210', field: 'B210', label: '电传感器量程 3', unit: '' },
        { key: 'bms.B212', field: 'B212', label: '簇内电池节数', unit: '' },
        { key: 'bms.B214', field: 'B214', label: '簇内温度个数', unit: '' },
        { key: 'bms.B218', field: 'B216', label: '簇内从控模块个数', unit: '' },
        { key: 'bms.B220', field: 'B218', label: '从控 1~48 的电压个数', unit: '' },
        { key: 'bms.B222', field: 'B220', label: '从控 1~48 的温度个数', unit: '' },
        { key: 'bms.B222', field: 'B222', label: '从控站址自动分配', unit: '' }
      ],
      bmsSwitchParams: [
        { key: 'bms.B168', label: '控制指令模式', options: [
          { label: '单簇系统', value: '1' },
          { label: '并簇系统', value: '2' },
          { label: '强控模式', value: '3' }
        ]},
        { key: 'bms.B170', label: '上下电控制指令', options: [
          { label: '上电', value: '0x55', dangerous: true },
          { label: '下电', value: '0xAA', dangerous: true }
        ]},
        { key: 'bms.B172', label: 'DO 控制', options: [
          { label: '闭合', value: '1' },
          { label: '断开', value: '0' }
        ]},
        { key: 'bms.B182', label: '绝缘采集控制', options: [
          { label: '开启', value: '1' },
          { label: '关闭', value: '0' },
          { label: '无效值', value: '2' }
        ]},
        { key: 'bms.B186', label: '复归指令', options: [
          { label: '默认状态', value: '0' },
          { label: '复归准备', value: '1' }
        ]},
        { key: 'bms.B188', label: '跳机指令', options: [
          { label: '默认状态', value: '0' },
          { label: '跳机', value: '1', dangerous: true }
        ]},
        { key: 'bms.B190', label: '显控检测故障', options: [
          { label: '无故障', value: '0' },
          { label: '故障', value: '1' }
        ]},
        { key: 'bms.B192', label: '主控均衡控制', options: [
          { label: '关闭均衡', value: '0' },
          { label: '开启均衡', value: '1' },
          { label: '主控自主', value: '2' }
        ]},
        { key: 'bms.B202', label: '电池类型', options: [
          { label: '磷酸铁锂电池', value: '1' },
          { label: '钛酸锂电池', value: '2' },
          { label: '锰酸锂电池', value: '3' },
          { label: '三元电池', value: '4' }
        ]},
        { key: 'bms.B224', label: '风扇控制功能', options: [
          { label: '风扇开启', value: '0x1' },
          { label: '风扇关闭', value: '0x2' },
          { label: '退出控制', value: '0x3' }
        ]}
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

      const now = Date.now()
      if (now - this.lastSendTime < 5000) {
        this.showToast('请间隔5秒后再下发', 'warning')
        return
      }

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
        this.executeSwitchCommand(param, option)
      }
    },

    async executeSwitchCommand(param, option) {
      this.clickedButton = param.key + '-' + option.value
      this.lastSendTime = Date.now()

      setTimeout(() => {
        this.clickedButton = ''
      }, 5000)

      try {
        await this.submitSwitchParam(param, option.value)
        this.showToast(`${param.label}设置成功`, 'success')
      } catch (error) {
        this.showToast(`${param.label}设置失败`, 'error')
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

    async executeSubmitParam(param, value) {
      this.isSubmitting = true

      try {
        let registerValue = value
        
        if (param.key === 'bms.B0' || param.key === 'bms.B2' || param.key === 'bms.B4' || param.key === 'bms.B6' || param.key === 'bms.B8' || param.key === 'bms.B10' || param.key === 'bms.B12' || param.key === 'bms.B14' || param.key === 'bms.B16' || param.key === 'bms.B18' || param.key === 'bms.B20' || param.key === 'bms.B22' || param.key === 'bms.B24' || param.key === 'bms.B26' || param.key === 'bms.B28' || param.key === 'bms.B30' || param.key === 'bms.B46' || param.key === 'bms.B54' || param.key === 'bms.B80' || param.key === 'bms.B82' || param.key === 'bms.B84' || param.key === 'bms.B86' || param.key === 'bms.B88' || param.key === 'bms.B90' || param.key === 'bms.B92' || param.key === 'bms.B94' || param.key === 'bms.B102' || param.key === 'bms.B104' || param.key === 'bms.B106' || param.key === 'bms.B108' || param.key === 'bms.B110' || param.key === 'bms.B112' || param.key === 'bms.B114' || param.key === 'bms.B116' || param.key === 'bms.B118' || param.key === 'bms.B126' || param.key === 'bms.B134' || param.key === 'bms.B136' || param.key === 'bms.B138' || param.key === 'bms.B140' || param.key === 'bms.B142' || param.key === 'bms.B144' || param.key === 'bms.B146' || param.key === 'bms.B148' || param.key === 'bms.B150' || param.key === 'bms.B194' || param.key === 'bms.B198') {
          registerValue = parseFloat(value) * 10
        } else if (param.key === 'bms.B40' || param.key === 'bms.B42' || param.key === 'bms.B44' || param.key === 'bms.B48' || param.key === 'bms.B50' || param.key === 'bms.B52' || param.key === 'bms.B96' || param.key === 'bms.B98' || param.key === 'bms.B100' || param.key === 'bms.B120' || param.key === 'bms.B122' || param.key === 'bms.B124' || param.key === 'bms.B128' || param.key === 'bms.B130' || param.key === 'bms.B132' || param.key === 'bms.B174' || param.key === 'bms.B176') {
          registerValue = (parseFloat(value) - 40) * 10
        } else if (param.key === 'bms.B56' || param.key === 'bms.B58' || param.key === 'bms.B60' || param.key === 'bms.B62' || param.key === 'bms.B64' || param.key === 'bms.B66' || param.key === 'bms.B68' || param.key === 'bms.B70' || param.key === 'bms.B72' || param.key === 'bms.B74' || param.key === 'bms.B76' || param.key === 'bms.B78') {
          registerValue = parseFloat(value) * 1000
        } else if (param.key === 'bms.B184') {
          const val = parseFloat(value)
          registerValue = val >= 0 && val <= 100 ? val * 10 : 255
        }

        const registerMap = {
          'bms.B0': '0', 'bms.B2': '2', 'bms.B4': '4',
          'bms.B6': '6', 'bms.B8': '8', 'bms.B10': '10',
          'bms.B12': '12', 'bms.B14': '14', 'bms.B16': '16',
          'bms.B18': '18', 'bms.B20': '20', 'bms.B22': '22',
          'bms.B24': '24', 'bms.B26': '26', 'bms.B28': '28',
          'bms.B30': '30', 'bms.B32': '32', 'bms.B34': '34',
          'bms.B36': '36', 'bms.B38': '38', 'bms.B40': '40',
          'bms.B42': '42', 'bms.B44': '44', 'bms.B46': '46',
          'bms.B48': '48', 'bms.B50': '50', 'bms.B52': '52',
          'bms.B54': '54', 'bms.B56': '56', 'bms.B58': '58',
          'bms.B60': '60', 'bms.B62': '62', 'bms.B64': '64',
          'bms.B66': '66', 'bms.B68': '68', 'bms.B70': '70',
          'bms.B72': '72', 'bms.B74': '74', 'bms.B76': '76',
          'bms.B78': '78', 'bms.B80': '80', 'bms.B82': '82',
          'bms.B84': '84', 'bms.B86': '86', 'bms.B88': '88',
          'bms.B90': '90', 'bms.B92': '92', 'bms.B94': '94',
          'bms.B96': '96', 'bms.B98': '98', 'bms.B100': '100',
          'bms.B102': '102', 'bms.B104': '104', 'bms.B106': '106',
          'bms.B108': '108', 'bms.B110': '110', 'bms.B112': '112',
          'bms.B114': '114', 'bms.B116': '116', 'bms.B118': '118',
          'bms.B120': '120', 'bms.B122': '122', 'bms.B124': '124',
          'bms.B126': '126', 'bms.B128': '128', 'bms.B130': '130',
          'bms.B132': '132', 'bms.B134': '134', 'bms.B136': '136',
          'bms.B138': '138', 'bms.B140': '140', 'bms.B142': '142',
          'bms.B144': '144', 'bms.B146': '146', 'bms.B148': '148',
          'bms.B150': '150', 'bms.B168': '168', 'bms.B170': '170',
          'bms.B172': '172', 'bms.B174': '174', 'bms.B176': '176',
          'bms.B178': '178', 'bms.B180': '180', 'bms.B182': '182',
          'bms.B184': '184', 'bms.B186': '186', 'bms.B188': '188',
          'bms.B190': '190', 'bms.B192': '192', 'bms.B194': '194',
          'bms.B198': '198', 'bms.B202': '202', 'bms.B204': '204',
          'bms.B206': '206', 'bms.B208': '208', 'bms.B210': '210',
          'bms.B212': '212', 'bms.B214': '214', 'bms.B216': '216',
          'bms.B218': '218', 'bms.B220': '220', 'bms.B222': '222',
          'bms.B224': '224'
        }
        const registerAddress = registerMap[param.key] || '00000000'

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
            registerAddress: registerAddress,
            registerValue: registerValue.toString().padStart(8, '0'),
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
        this.showToast(`${param.label}下发成功`, 'success')
      } catch (error) {
        this.showToast('下发失败', 'error')
        console.error('命令帧发送失败:', error)
      } finally {
        this.isSubmitting = false
      }
    },

    async submitSwitchParam(param, value) {
      const registerMap = {
        'bms.B168': '168', 'bms.B170': '170', 'bms.B172': '172',
        'bms.B182': '182', 'bms.B186': '186', 'bms.B188': '188',
        'bms.B190': '190', 'bms.B192': '192', 'bms.B202': '202',
        'bms.B224': '224'
      }
      const registerAddress = registerMap[param.key] || '00000000'

      let hexValue = value
      if (param.key === 'bms.B170') {
        hexValue = parseInt(value, 16).toString()
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
          registerAddress: registerAddress,
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
      this.isEditing = true
      this.showToast('已进入编辑模式', 'success')
    },

    closeEdit() {
      this.isEditing = false
      this.editingParam = ''
      this.showToast('已退出编辑模式', 'success')
    },

    handleParamEdit(param) {
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
  padding: 20rpx;
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
  width: 160rpx;
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
  min-width: 60rpx;
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