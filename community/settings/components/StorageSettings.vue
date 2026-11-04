<template>
  <view class="storage-settings">
    <view class="param-card">
      <view class="card-header">
        <view class="card-title-wrap">
          <text class="card-title">储能 DC/DC 参数设置</text>
          <text class="card-subtitle">设备类型：{{ isHighCapacity ? '170C_V1_1（储能 1E）' : '171D' }}</text>
        </view>
        <view class="action-btns">
          <view v-if="!isEditing" class="edit-btn primary" @click="handleEditConfig">
            <text class="edit-text">修改配置</text>
          </view>
          <view v-else class="edit-btn close" @click="closeEdit">
            <text class="edit-text">关闭编辑</text>
          </view>
        </view>
      </view>

      <!-- 旧协议（20kW 微能站）：171D 参数 -->
      <template v-if="!isHighCapacity">
      <!-- 开关型参数 -->
      <view class="switch-section">
        <view v-for="param in storageSwitchParams" :key="param.key" class="param-row">
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
        <view v-for="param in storageParams" :key="param.key" class="param-row"
          :class="{ 'editing-row': editingParam === param.key }">
          <view class="param-info">
            <text class="param-name">{{ param.label }}</text>
            <text v-if="param.min != null && param.max != null" class="param-range">
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
        </view>
      </view>
      </template>

      <!-- 新协议（50kW 微能站）：对齐网页 MonitoringData.vue 的参数设置结构 -->
      <template v-if="isHighCapacity">
        <view v-if="device170CStorage" class="hc-body">
          <!-- 命令 / 模式（选择后下发） -->
          <view v-if="storage170CChooseParams.length" class="hc-group">
            <view class="hc-group-title">
              <view class="hc-bar"></view>
              <text class="hc-group-name">命令 / 模式（选择后下发）</text>
              <text class="hc-group-count">{{ storage170CChooseParams.length }}</text>
            </view>
            <view class="param-list">
              <view v-for="param in storage170CChooseParams" :key="param.key" class="param-row">
                <view class="param-info">
                  <text class="param-name">{{ param.name }}</text>
                </view>
                <view class="switch-btns-wrapper">
                  <view class="switch-btns">
                    <view v-for="option in param.options" :key="option.value"
                      class="switch-btn"
                      :class="[
                        isHcOptionActive(param, option.value) ? 'btn-active' : '',
                        !isEditing ? 'btn-disabled' : '',
                        clickedButton === param.key + '-' + option.value ? 'btn-clicked' : ''
                      ]"
                      @click="handleHcSwitchClick(param, option)">
                      {{ option.label }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 数值设定（输入后下发） -->
          <view v-if="storage170CNumberParams.length" class="hc-group">
            <view class="hc-group-title">
              <view class="hc-bar"></view>
              <text class="hc-group-name">数值设定（输入后下发）</text>
              <text class="hc-group-count">{{ storage170CNumberParams.length }}</text>
            </view>
            <view class="param-list">
              <view v-for="param in storage170CNumberParams" :key="param.key" class="param-row"
                :class="{ 'editing-row': editingHcParam === param.key }">
                <view class="param-info">
                  <text class="param-name">{{ param.name }}</text>
                </view>
                <view class="param-right">
                  <view class="param-value-box" :class="{ editing: editingHcParam === param.key }">
                    <text v-if="editingHcParam !== param.key" class="val-text">{{ param.value }}</text>
                    <input v-else class="val-input" type="digit" v-model="hcTempValue"
                      placeholder="请输入" focus />
                  </view>
                  <text v-if="param.unit" class="unit-text">{{ param.unit }}</text>
                </view>
                <view class="btn-group">
                  <view v-if="editingHcParam !== param.key" class="btn btn-edit"
                    :class="{ 'btn-disabled': !isEditing }" @click="handleHcParamEdit(param)">
                    <uni-icons type="compose" size="14" color="#6699ff"></uni-icons>
                    <text>编辑</text>
                  </view>
                  <template v-else>
                    <view class="btn btn-sure" :class="{ 'btn-loading': isSubmitting }" @click="submitHcParam(param)">
                      <text v-if="!isSubmitting">下发</text>
                      <view v-else class="loading-spinner"></view>
                    </view>
                    <view class="btn btn-cancel" @click="handleHcParamCancel()">
                      <uni-icons type="closeempty" size="14" color="#999"></uni-icons>
                    </view>
                  </template>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-if="!device170CStorage" class="hc-empty">
          <uni-icons type="info" size="36" color="#c0c4cc"></uni-icons>
          <text class="hc-empty-text">未检测到储能 DC 设备（170C_V1_1 / 地址1E）</text>
        </view>
      </template>
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
import {
  MOVED_170C_ENERGY_KEYS, MOVED_170C_STATE_KEYS, STORAGE_171D_MODE_OPTIONS,
  STORAGE_171D_ADDRESS_MAP, PARAM_SCALE10_ADDRESS, PARAM_SCALE100_ADDRESS,
  PARAM_OFFSET_SCALE_ADDRESS
} from '../param-settings-constants.js'


export default {
  name: 'StorageSettings',

  data() {
    return {
      deviceList: [],
      idCode: '',
      deviceAddress: '02',
      isEditing: false,
      clickedButton: '',
      lastSendTimes: {},
      editingParam: '',
      tempValue: '',
      isSubmitting: false,
      // 50kW 单项编辑态（对齐 20kW 行内编辑风格）
      editingHcParam: '',
      hcTempValue: '',
      params: {
        storage: {}
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
      storageParams: [
        // { key: 'storage.B16', field: 'B16', address: '60024', label: '组ID号', unit: '', min: 1, max: 31, default: 1 },
        // { key: 'storage.B18', field: 'B18', address: '60025', label: '模块数量', unit: '', min: 1, max: 31, default: 1 },
        { key: 'storage.B22', field: 'B22', address: '60040', label: '直流母线电压', unit: 'V', min: 350, max: 850, scale: 10, default: 720 },
        { key: 'storage.B26', field: 'B26', address: '60043', label: '充放电功率设定', unit: '%', min: 0, max: 130, scale: 10, default: 100 },
        { key: 'storage.B28', field: 'B28', address: '60044', label: '电池均充电压', unit: 'V', min: 40, max: 360, scale: 10, default: 60 },
        { key: 'storage.B30', field: 'B30', address: '60045', label: '充电电流设置', unit: 'A', min: 0, max: 130, scale: 10, default: 100 },
        { key: 'storage.B32', field: 'B32', address: '60046', label: '电池浮充电压', unit: 'V', min: 40, max: 360, scale: 10, default: 60 },
        { key: 'storage.B34', field: 'B34', address: '60047', label: '放电电压设置', unit: 'V', min: 40, max: 360, scale: 10, default: 40 },
        { key: 'storage.B36', field: 'B36', address: '60048', label: '放电电流设置', unit: 'A', min: 0, max: 130, scale: 10, default: 100 },
        { key: 'storage.B38', field: 'B38', address: '60049', label: '电池过压关机点', unit: 'V', min: 40, max: 370, scale: 10, default: 370 },
        { key: 'storage.B40', field: 'B40', address: '60050', label: '电池欠压告警点', unit: 'V', min: 35, max: 355, scale: 10, default: 450 },
        { key: 'storage.B42', field: 'B42', address: '60051', label: '电池欠压关机点', unit: 'V', min: 35, max: 355, scale: 10, default: 350 },
        { key: 'storage.B48', field: 'B48', address: '60054', label: '充电母线电压上限', unit: 'V', min: 350, max: 850, scale: 10, default: 630 },
        { key: 'storage.B50', field: 'B50', address: '60055', label: '放电母线电压下限', unit: 'V', min: 350, max: 850, scale: 10, default: 570 }
      ],
      storageSwitchParams: [
        // {
        //   key: 'storage.B0', field: 'B0', address: '60016', label: 'Can波特率设置', options: [
        //     { label: '1000kbps', value: '0' },
        //     { label: '500kbps', value: '1' },
        //     { label: '250kbps', value: '2' },
        //     { label: '125kbps', value: '3' }
        //   ]
        // },
        // {
        //   key: 'storage.B2', field: 'B2', address: '60017', label: '认证标准码', options: [
        //     { label: '中国标准I', value: '0' },
        //     { label: '中国标准II', value: '1' },
        //     { label: '美国标准', value: '2' },
        //     { label: '德国标准', value: '3' }
        //   ]
        // },
        // {
        //   key: 'storage.B4', field: 'B4', address: '60018', label: '机器类型', options: [
        //     { label: 'IBDC30060', value: '1' },
        //     { label: 'IBG30060', value: '2' }
        //   ]
        // },
        {
          key: 'storage.B6', field: 'B6', address: '60019', label: '故障清除', options: [
            { label: '清除所有故障', value: '0x0055', dangerous: true }
          ]
        },
        // {
        //   key: 'storage.B8', field: 'B8', address: '60020', label: '运行模式设置', options: [
        //     { label: '无输出模式', value: '0' },
        //     { label: '正常运行模式', value: '1' },
        //     { label: '开环调试模式', value: '2' },
        //     { label: '发波调试模式', value: '3' }
        //   ]
        // },
        {
          key: 'storage.B10', field: 'B10', address: '60021', label: '运行状态设置', options: [
            { label: '自适应', value: '0' },
            { label: '并网', value: '1' },
            { label: '离网', value: '2' }
          ]
        },
        {
          key: 'storage.B12', field: 'B12', address: '60022', label: '系统开关机', options: [
            { label: '开机', value: '0x0055', dangerous: true },
            { label: '关机', value: '0x00AA', dangerous: true }
          ]
        },
        // {
        //   key: 'storage.B14', field: 'B14', address: '60023', label: '恢复出厂设置', options: [
        //     { label: '恢复所有值', value: '0x0055', dangerous: true },
        //     { label: '恢复用户值', value: '0x00AA', dangerous: true }
        //   ]
        // },
        // {
        //   key: 'storage.B20', field: 'B20', address: '60038', label: '电池类型', options: [
        //     { label: '铅酸电池', value: '0' },
        //     { label: '锂电池', value: '1' }
        //   ]
        // },
        {
          key: 'storage.B24', field: 'B24', address: '60042', label: '充放电指令', options: [
            { label: '待机', value: '0' },
            { label: '充电', value: '1' },
            { label: '放电', value: '2' },
            // { label: 'BAT自动', value: '3' },
            { label: 'BUS自动', value: '4' },
            // { label: '关充电', value: '5' },
            // { label: '高压PV', value: '6' },
            // { label: '低压PV', value: '7' }
          ]
        },
        // {
        //   key: 'storage.B44', field: 'B44', address: '60052', label: '电池激活功能', options: [
        //     { label: '禁止', value: '0' },
        //     { label: '使能', value: '1' }
        //   ]
        // },
        // {
        //   key: 'storage.B46', field: 'B46', address: '60053', label: '自动重启功能', options: [
        //     { label: '禁止', value: '0' },
        //     { label: '使能', value: '1' }
        //   ]
        // },
        // {
        //   key: 'storage.B53b1', field: 'B53b1', address: '60100', label: '告警屏蔽位1-Bit1', options: [
        //     { label: 'CAN通讯使能位', value: '0' },
        //     { label: '485通讯使能位', value: '1' }
        //   ]
        // }
        // {
        //   key: 'storage.B53b0', field: 'B53b0', address: '60100', label: 'CAN通讯使能位', options: [
        //     { label: '禁止', value: '0' },
        //     { label: '使能', value: '1' }
        //   ]
        // },
        // {
        //   key: 'storage.B53b1', field: 'B53b1', address: '60100', label: '485通讯使能位', options: [
        //     { label: '禁止', value: '0' },
        //     { label: '使能', value: '1' }
        //   ]
        // }
      ]
    }
  },
  computed: {
    isHighCapacity() {
      const station = this.$store.state.currentSelectDevice || {}
      const cap = Number(station.totalInstalledCapacity)
      if (Number.isFinite(cap) && cap > 0) return cap >= 50
      const newTypes = ['1707_V3_5', '1707V3_5', '170C_V1_1', '171C_V2', '171C_V2_1', '171C_V2_2', '171C_V2_3', '171C_V2_4', '0318_V2_3', '0318V2_3']
      return (station.list || []).some(item => newTypes.includes(String(item.typeCode || item.deviceType || '').trim()))
    },
    userId() {
      return this.$store.state.userInfo?.userId
    },
    device171D() {
      return this.deviceList.find(item => item && item.deviceType === '171D')
    },
    device170CStorage() {
      const norm = v => (v === undefined || v === null ? '' : String(v).toUpperCase())
      return this.deviceList.find(item => item && item.deviceType === '170C_V1_1' && norm(item.address) === '1E')
    },
    device171F() {
      return this.deviceList.find(item => item && item.deviceType === '171F')
    },
    storage170CDisplay() {
      const toList = (obj) => obj
        ? Object.keys(obj).map(key => ({ key, name: obj[key].name, value: obj[key].value, unit: obj[key].unit }))
        : [];
      const dev = this.device170CStorage
      return {
        energy: toList(dev && dev.energyData).filter(f => f.value !== undefined && f.value !== null && f.value !== ''),
        state: toList(dev && dev.stateData).filter(f => f.value !== undefined && f.value !== null && f.value !== '')
      }
    },
    // ========== 50kW 新协议（170C_V1_1 储能 DC / 地址1E）对齐网页 ==========
    storage170CParams() {
      const dev = this.device170CStorage
      const list = [
        ...this.__pickFromKeys(dev && dev.energyData, MOVED_170C_ENERGY_KEYS),
        ...this.__pickFromKeys(dev && dev.stateData, MOVED_170C_STATE_KEYS)
      ]
      // 枚举项：按点表说明做「值 ↔ 文字」映射，编辑时以按钮组选择，选中值即下发值
      const normalize = v => String(v === undefined || v === null ? '' : v).replace(/\s/g, '')
      return list.map(item => {
        const address = STORAGE_171D_ADDRESS_MAP[item.key]
        const options = STORAGE_171D_MODE_OPTIONS[item.key]
        if (options && options.length) {
          const matched = options.find(opt =>
            String(opt.value) === String(item.value) || normalize(opt.label) === normalize(item.value)
          )
          return { ...item, address, kind: 'select', options, value: matched ? matched.value : '' }
        }
        return { ...item, address, kind: 'number' }
      })
    },
    storage170CChooseParams() {
      return this.storage170CParams.filter(p => p.kind !== 'number')
    },
    storage170CNumberParams() {
      return this.storage170CParams.filter(p => p.kind === 'number')
    },
    storage170CMonitorDisplay() {
      const dev = this.device170CStorage
      const energy = this.__toList(dev && dev.energyData)
        .filter(f => !MOVED_170C_ENERGY_KEYS.includes(f.key) && f.value !== undefined && f.value !== null && f.value !== '')
      const state = this.__toList(dev && dev.stateData)
        .filter(f => !MOVED_170C_STATE_KEYS.includes(f.key) && f.value !== undefined && f.value !== null && f.value !== '')
      return { energy, state }
    }
  },
  watch: {
    // device171D: {
    //   handler(newDevice) {
    //     if (newDevice) {
    //       this.params.storage = { ...(newDevice.controlData || {}) }
    //     }
    //   },
    //   immediate: true
    // }
  },
  mounted() {
    const currentDevice = this.$store.state.currentSelectDevice || {}
    const deviceControl = currentDevice.list.find(item => item.controlType == 1);
    if (deviceControl) {
      this.idCode = deviceControl.homeBarCode || deviceControl.barCode || '';
    }
    this.initDevice()
    this.deviceList = this.takeDeviceSnapshot()
    // 实时帧高频到达，节流合并刷新，避免整页频繁重渲染导致点击卡顿
    realtimeDataProvider.onDataUpdate = () => {
      if (this._dataUpdateTimer) return
      this._dataUpdateTimer = setTimeout(() => {
        this._dataUpdateTimer = null
        this.deviceList = this.takeDeviceSnapshot()
      }, 500)
    }
  },
  beforeDestroy() {
    realtimeDataProvider.onDataUpdate = null
    if (this._dataUpdateTimer) {
      clearTimeout(this._dataUpdateTimer)
      this._dataUpdateTimer = null
    }
  },
  methods: {
    // ========== 内部工具（必须是 methods 而不是 computed，Vue2 computed 不支持带参数调用） ==========
    __toList(obj) {
      if (!obj) return []
      return Object.keys(obj)
        .map(key => {
          const f = obj[key] || {}
          return { key, name: f.name, value: f.value, unit: f.unit }
        })
    },
    __pickFromKeys(source, keys) {
      const src = source || {}
      return keys.map(key => {
        const field = src[key] || {}
        // 枚举类状态字段优先取后端原始码值(raw)，保证与下发值/按钮组选项一一对应
        const val = field.raw !== undefined && field.raw !== null && field.raw !== '' ? field.raw : field.value
        return {
          key,
          name: field.name || key,
          value: val === undefined || val === null || val === '' ? '--' : val,
          unit: field.unit || ''
        }
      })
    },
    /**
     * 设备数据冻结快照（实现在 realtime-data-provider，统一维护）
     * 快照不被 Vue observe，render 不订阅实时字段，仅引用替换时刷新
     */
    takeDeviceSnapshot() {
      return realtimeDataProvider.takeSnapshot()
    },
    initDevice() {
      const currentDevice = this.$store.state.currentSelectDevice || {}
      const deviceTypes = this.isHighCapacity ? ['170C_V1_1', '171F'] : ['171D', '171F']
      const defaultAddress = this.isHighCapacity ? '1E' : '1E'
      const deviceList = deviceTypes.map(deviceType => {
        const foundDevice = currentDevice.list?.find(item =>
          item.typeCode === deviceType || item.deviceType === deviceType || item.description?.includes(deviceType)
        )
        const is171F = deviceType === '171F'
        const addr = is171F ? '01' : (defaultAddress)
        return foundDevice ? {
          deviceType,
          typeCode: deviceType,
          address: foundDevice.address || addr,
          barCode: foundDevice.barCode || foundDevice.homeBarCode || '',
          deviceId: foundDevice.deviceId || `${deviceType}${addr}`,
          name: foundDevice.name || `设备${deviceType}`
        } : {
          deviceType,
          typeCode: deviceType,
          address: addr,
          barCode: '',
          deviceId: `${deviceType}${addr}`,
          name: `设备${deviceType}`
        }
      })
      realtimeDataProvider.initDeviceList(deviceList)
    },

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
          action: () => this.executeSwitchCommand(param, option)
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
      const device = this.device171D
      if (device && device.controlData && device.controlData[param.field]) {
        const value = device.controlData[param.field].value
        if (value !== undefined && value !== null && value !== '' && value !== '--') {
          return value
        }
      }
      const value = this.params.storage[param.field]
      if (value === undefined || value === null || value === '' || value === '--') {
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

      const decimals = param.decimals != null
        ? param.decimals
        : (param.scale && param.scale !== 1 ? String(param.scale).length - 1 : 0)
      value = parseFloat(value.toFixed(decimals))
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
        oldValue: this.params.storage[param.field] || '--',
        newValue: value + (param.unit || ''),
        isDangerous: false,
        param: param,
        action: () => this.executeSubmitParam(param, value)
      })
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

        // 支持 scale 参数：传输值 = 实际值 × scale
        const scale = param.scale || 1
        const registerValue = (Math.round(parseFloat(value) * scale)).toString()

        const commandData = {
          apiSufix: 't3401_171D_control',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '171D',
            addr: 30,
            deviceId: '30',
            registerAddress: registerAddress,
            registerValue: registerValue,
            valueType: '01',
            registerType: '03',
            extra1: '00',
            extra2: '00',
            extra3: '00'
          }]
        }

        await sendCommandFrame(commandData)
        this.params.storage[param.field] = value
        this.editingParam = ''
        this.showToast(`${param.label}: ${value}${param.unit || ''}下发成功`, 'success')
      } catch (error) {
        this.showToast(`${param.label}下发失败`, 'error')
        console.error('命令帧发送失败:', error)
      } finally {
        this.isSubmitting = false
      }
    },

    async submitSwitchParam(param, value) {
      // const registerMap = {
      //   'storage.B0': '0', 'storage.B2': '2', 'storage.B4': '4',
      //   'storage.B6': '6', 'storage.B8': '8', 'storage.B10': '10',
      //   'storage.B12': '12', 'storage.B14': '14', 'storage.B20': '20',
      //   'storage.B24': '24', 'storage.B44': '44', 'storage.B46': '46',
      //   'storage.B53b0': '53', 'storage.B53b1': '53'
      // }
      // const registerAddress = registerMap[param.key] || '00000000'

      const registerAddress = param.address

      const commandData = {
        apiSufix: 'multiControl',
        idCode: this.idCode,
        typeCode: '3401',
        address: this.deviceAddress,
        userId: this.userId,
        commands: [{
          deviceCategory: '171D',
          addr: 30,
          deviceId: '30',
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

      const [module, key] = param.key.split('.')
      this.params[module][key] = value
    },

    getParamValue(paramKey) {
      const [module, key] = paramKey.split('.')
      const device = this.device171D

      if (device) {
        if (device.controlData && device.controlData['B2']) {
          const systemStatus = device.controlData['B2'].value
          if (systemStatus !== undefined && systemStatus !== null && systemStatus !== '--') {
            if (key === 'B12') {
              return systemStatus === '待机' ? '0x00AA' : '0x0055'
            }
            if (key === 'B10') {
              const statusMap = { '待机': '0', '并网运行': '1', '离网运行': '2', 'MPPT运行': '1', '开环运行': '1', '调试模式': '1' }
              return statusMap[systemStatus] || '0'
            }
          }
        }

        if (device.controlData && device.controlData['B24']) {
          const chargeStatus = device.controlData['B24'].value
          if (chargeStatus !== undefined && chargeStatus !== null && chargeStatus !== '--') {
            if (key === 'B24') {
              // console.log(chargeStatus, 'chargeStatus',key)
              
              const chargeMap = { '0': '待机', '1': '充电', '2': '放电', '3': 'BAT自动切换', '4': 'BUS自动切换', '5': '关充电', '6': '高压PV模式', '7': '低压PV模式' }
              // return chargeMap[String(chargeStatus)] || '未知'
              return String(chargeStatus)
            }
          }
        }

        if (device.controlData && device.controlData[key]) {
          const controlValue = device.controlData[key].value
          if (controlValue !== undefined && controlValue !== null && controlValue !== '--') {
            return String(controlValue)
          }
        }
      }

      const localValue = this.params[module] && this.params[module][key]
      return localValue !== undefined && localValue !== null ? String(localValue) : '--'
    },

    handleEditConfig() {
      const currentRoleId = this.$store.state.currentEsRoleId
      if (![1, 2, 4, 5].includes(currentRoleId)) {
        uni.showToast({ title: '无权限操作', icon: 'none' });
        return;
      }
      const device171F = this.device171F
      const b12Value = device171F && device171F.controlData && device171F.controlData.B12 && device171F.controlData.B12.value

      if (b12Value === undefined || b12Value === null || b12Value === '' || b12Value === '--') {
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
      this.$emit('interaction-change', true)
      this.showToast('已进入编辑模式', 'success')
    },

    closeEdit() {
      this.isEditing = false
      this.editingParam = ''
      this.editingHcParam = ''
      this.hcTempValue = ''
      this.$emit('interaction-change', false)
      this.showToast('已退出编辑模式', 'success')
    },

    // ========== 50kW（170C_V1_1 储能DC）单项编辑 / 下发 —— 对齐 20kW 交互风格 ==========
    // 按钮激活态：按当前值判定（枚举已换算为原始值）
    isHcOptionActive(param, optionValue) {
      const current = param.value
      if (current === optionValue) return true
      if (current === null || current === undefined || current === '' || current === '--') return false
      return String(current) === String(optionValue)
    },
    // 命令/模式按钮点击：停机/复位等执行类先弹确认，其余直接下发
    handleHcSwitchClick(param, option) {
      if (!this.isEditing) {
        this.showToast('请先点击修改配置', 'warning')
        return
      }
      if (!param.address) {
        this.showToast(`「${param.name}」缺少寄存器地址，无法下发`, 'warning')
        return
      }
      const current = param.value
      if (String(current) === String(option.value)) {
        this.showToast('已经是当前设置', 'warning')
        return
      }
      const isDangerous = param.key === 'startOrder' && (option.value === '2' || option.value === '3')
      if (isDangerous) {
        this.openConfirmPopup({
          title: '危险操作确认',
          content: `确定要执行"${param.name}"的"${option.label}"操作吗？此操作可能影响系统运行。`,
          oldValue: (param.options.find(o => String(o.value) === String(current)) || {}).label || '--',
          newValue: option.label,
          isDangerous: true,
          action: () => this.executeHcCommand(param, option)
        })
      } else {
        this.executeHcCommand(param, option)
      }
    },
    // 命令/模式下发（5 秒节流，与 20kW 一致）
    async executeHcCommand(param, option) {
      const now = Date.now()
      const paramLastSendTime = this.lastSendTimes[param.key] || 0
      if (now - paramLastSendTime < 5000) {
        this.showToast('请间隔5秒后再下发', 'warning')
        return
      }
      this.clickedButton = param.key + '-' + option.value
      this.lastSendTimes[param.key] = now
      setTimeout(() => { this.clickedButton = '' }, 5000)
      try {
        await this.sendHcCommand(param, String(option.value))
        this.showToast(`${param.name}: ${option.label}成功`, 'success')
      } catch (error) {
        this.showToast(`${param.name}: ${option.label}失败`, 'error')
      }
    },
    // 数值参数：进入行内编辑
    handleHcParamEdit(param) {
      if (!this.isEditing) {
        this.showToast('请先点击修改配置', 'warning')
        return
      }
      this.editingHcParam = param.key
      this.hcTempValue = param.value === '--' ? '' : String(param.value)
    },
    handleHcParamCancel() {
      this.editingHcParam = ''
      this.hcTempValue = ''
    },
    // 数值参数：校验 → 确认弹窗 → 下发
    submitHcParam(param) {
      if (!param.address) {
        this.showToast(`「${param.name}」缺少寄存器地址，无法下发`, 'warning')
        return
      }
      const value = this.hcTempValue
      if (!value && value !== '0') {
        this.showToast('请输入参数值', 'warning')
        return
      }
      if (isNaN(parseFloat(value))) {
        this.showToast('请输入有效的数值', 'warning')
        return
      }
      this.openConfirmPopup({
        title: '参数下发确认',
        content: `确定要下发"${param.name}"参数吗？`,
        oldValue: (param.value === '--' ? '--' : param.value) + (param.unit || ''),
        newValue: value + (param.unit || ''),
        isDangerous: false,
        param: param,
        action: () => this.executeSubmitHcParam(param, value)
      })
    },
    async executeSubmitHcParam(param, value) {
      this.isSubmitting = true
      try {
        await this.sendHcCommand(param, this.applyHcScale(value, param.address))
        this.showToast(`${param.name}下发成功`, 'success')
        this.handleHcParamCancel()
      } catch (error) {
        this.showToast(`${param.name}下发失败`, 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    // 按地址映射文档的「传输值」说明换算下发值。
    // 优先级：PARAM_OFFSET_SCALE_ADDRESS ((实际值+offset)×scale) → PARAM_SCALE100_ADDRESS (×100)
    // → PARAM_SCALE10_ADDRESS (×10) → 原样返回。
    applyHcScale(value, address) {
      const deviceCategory = '171D'
      const num = Number(value)
      if (!Number.isFinite(num)) return String(value)
      const addr = String(address)
      const offsetScaleMap = PARAM_OFFSET_SCALE_ADDRESS[deviceCategory]
      if (offsetScaleMap && offsetScaleMap[addr]) {
        const { offset = 0, scale = 1 } = offsetScaleMap[addr]
        return String(Math.round((num + offset) * scale))
      }
      const scale100List = PARAM_SCALE100_ADDRESS[deviceCategory]
      if (scale100List && scale100List.indexOf(addr) >= 0) {
        return String(Math.round(num * 100))
      }
      const list = PARAM_SCALE10_ADDRESS[deviceCategory]
      if (list && list.indexOf(addr) >= 0) {
        return String(Math.round(num * 10))
      }
      return String(value)
    },
    // 50kW 统一下发通道：multiControl，deviceCategory 171D / addr 01
    sendHcCommand(param, registerValue) {
      return sendCommandFrame({
        apiSufix: 'multiControl',
        idCode: this.idCode,
        typeCode: '3401',
        address: '01',
        userId: this.userId,
        commands: [{
          deviceCategory: '171D',
          addr: '01',
          deviceId: '1',
          registerAddress: param.address,
          registerValue,
          valueType: '01',
          registerType: '03',
          extra1: '00',
          extra2: '00',
          extra3: '00'
        }]
      })
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
      this.tempValue = this.formatParamValue(param) || ''
    },

    handleParamCancel() {
      this.editingParam = ''
      this.tempValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.storage-settings {
  background: #f5f5f5;
  min-height: 100vh;
  // padding: 20rpx;
}

.param-card {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 24rpx;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.card-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.card-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #1a1a1a;
  letter-spacing: 2rpx;
}

.card-subtitle {
  font-size: 22rpx;
  color: #999;
  letter-spacing: 1rpx;
}

.action-btns {
  display: flex;
  gap: 16rpx;
}

.edit-btn {
  padding: 14rpx 28rpx;
  border-radius: 40rpx;
  font-size: 24rpx;
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
  font-size: 24rpx;
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

// 50kW 编辑态可选按钮
.btn-editable {
  border-color: #6699ff;
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

// ===== 50kW 新协议只读展示 =====
.hc-body {
  padding: 12rpx 24rpx 28rpx;
}

.hc-group {
  margin-top: 16rpx;
}

.hc-group-title {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.hc-bar {
  width: 6rpx;
  height: 26rpx;
  border-radius: 3rpx;
  margin-right: 12rpx;
  background: linear-gradient(180deg, #6699ff 0%, #4488fb 100%);
}

.hc-group-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.hc-group-count {
  margin-left: 12rpx;
  padding: 2rpx 16rpx;
  font-size: 20rpx;
  color: #4488fb;
  background: #eef4ff;
  border-radius: 999rpx;
}

.hc-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.hc-tile {
  width: 48.5%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin-bottom: 16rpx;
  padding: 24rpx 24rpx;
  background: linear-gradient(135deg, #f8fafc 0%, #f2f6fc 100%);
  border: 1rpx solid #e8eef6;
  border-radius: 16rpx;
}

.hc-tile-name {
  font-size: 22rpx;
  color: #888;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hc-tile-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.hc-tile-unit {
  font-size: 22rpx;
  color: #999;
  font-weight: 400;
}

.hc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
}

.hc-empty-text {
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #999;
}
</style>