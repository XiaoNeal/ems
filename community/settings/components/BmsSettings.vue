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
          <text class="param-name">{{ param.label }}</text>
          <view class="switch-btns-wrapper">
            <view class="switch-btns">
              <view 
                v-for="option in param.options" 
                :key="option.value" 
                class="switch-btn"
                :class="[
                  getParamValue(param.key) === option.value ? 'btn-active' : '', 
                  !isEditing ? 'btn-disabled' : '',
                  clickedButton === param.key + '-' + option.value ? 'btn-clicked' : ''
                ]"
                @click="setSwitchParam(param.key, option.value)"
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
        <view v-for="param in bmsParams" :key="param.key" class="param-row">
          <text class="param-name">{{ param.label }}</text>
          <view class="param-right-wrapper">
            <view class="param-right">
              <view class="param-value-box" :class="{ editing: editingParam === param.key }">
                <text v-if="editingParam !== param.key" class="val-text">{{ params.bms[param.field] || "--" }}</text>
                <input v-else class="val-input" type="number" v-model="params.bms[param.field]" placeholder="请输入" focus />
              </view>
              <text class="unit-text">{{ param.unit || '' }}</text>
            </view>
            <view class="btn-group">
              <view v-if="editingParam !== param.key" class="btn btn-edit" @click="handleParamEdit(param.key)">编辑</view>
              <template v-else-if="editingParam === param.key">
                <view class="btn btn-sure" @click="submitParam(param.key, param.label)">下发</view>
                <view class="btn btn-cancel" @click="handleParamCancel()">取消</view>
              </template>
            </view>
          </view>
        </view>
      </view>
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
      lastSendTime: 0,
      params: {
        bms: {}
      },
      clickedButton: '',
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
          { label: '上电', value: '0x55' },
          { label: '下电', value: '0xAA' }
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
          { label: '跳机', value: '1' }
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
        uni.showToast({ title: '请先点击修改配置', icon: 'none' })
        return false
      }
      return true
    },
    updateParamValue(field, event) {
      if (this.params && this.params.bms) {
        this.params.bms[field] = event.detail.value
      }
    },
    getParamValue(paramKey) {
      const [module, key] = paramKey.split('.')
      if (!this.params || !this.params[module]) {
        return ''
      }
      return this.params[module][key]
    },
    setSwitchParam(paramKey, value) {
      if (!this.checkEditMode()) return
      
      const now = Date.now()
      if (now - this.lastSendTime < 5000) {
        uni.showToast({ title: '请间隔5秒后再下发', icon: 'none' })
        return
      }
      
      const param = this.bmsSwitchParams.find(p => p.key === paramKey)
      if (param) {
        this.clickedButton = paramKey + '-' + value
        this.lastSendTime = now
        
        setTimeout(() => {
          this.clickedButton = ''
        }, 5000)
        
        let hexValue = value
        if (paramKey === 'bms.B170' || paramKey === 'bms.B226') {
          hexValue = parseInt(value, 16).toString()
        }
        
        this.submitParam(paramKey, param.label, hexValue)
      }
    },
    async submitParam(paramKey, paramName, value) {
      if (value === undefined) {
        const [module, key] = paramKey.split('.')
        value = this.params[module][key]
        if (!value && value !== 0) {
          uni.showToast({ title: '请输入参数值', icon: 'none' })
          return
        }
      }

      let registerValue = value
      if (paramKey === 'bms.B0' || paramKey === 'bms.B2' || paramKey === 'bms.B4' || paramKey === 'bms.B6' || paramKey === 'bms.B8' || paramKey === 'bms.B10' || paramKey === 'bms.B12' || paramKey === 'bms.B14' || paramKey === 'bms.B16' || paramKey === 'bms.B18' || paramKey === 'bms.B20' || paramKey === 'bms.B22' || paramKey === 'bms.B24' || paramKey === 'bms.B26' || paramKey === 'bms.B28' || paramKey === 'bms.B30' || paramKey === 'bms.B46' || paramKey === 'bms.B54' || paramKey === 'bms.B80' || paramKey === 'bms.B82' || paramKey === 'bms.B84' || paramKey === 'bms.B86' || paramKey === 'bms.B88' || paramKey === 'bms.B90' || paramKey === 'bms.B92' || paramKey === 'bms.B94' || paramKey === 'bms.B102' || paramKey === 'bms.B104' || paramKey === 'bms.B106' || paramKey === 'bms.B108' || paramKey === 'bms.B110' || paramKey === 'bms.B112' || paramKey === 'bms.B114' || paramKey === 'bms.B116' || paramKey === 'bms.B118' || paramKey === 'bms.B126' || paramKey === 'bms.B134' || paramKey === 'bms.B136' || paramKey === 'bms.B138' || paramKey === 'bms.B140' || paramKey === 'bms.B142' || paramKey === 'bms.B144' || paramKey === 'bms.B146' || paramKey === 'bms.B148' || paramKey === 'bms.B150' || paramKey === 'bms.B194' || paramKey === 'bms.B198') {
        registerValue = parseFloat(value) * 10
      } else if (paramKey === 'bms.B40' || paramKey === 'bms.B42' || paramKey === 'bms.B44' || paramKey === 'bms.B48' || paramKey === 'bms.B50' || paramKey === 'bms.B52' || paramKey === 'bms.B96' || paramKey === 'bms.B98' || paramKey === 'bms.B100' || paramKey === 'bms.B120' || paramKey === 'bms.B122' || paramKey === 'bms.B124' || paramKey === 'bms.B128' || paramKey === 'bms.B130' || paramKey === 'bms.B132' || paramKey === 'bms.B174' || paramKey === 'bms.B176') {
        registerValue = (parseFloat(value) - 40) * 10
      } else if (paramKey === 'bms.B56' || paramKey === 'bms.B58' || paramKey === 'bms.B60' || paramKey === 'bms.B62' || paramKey === 'bms.B64' || paramKey === 'bms.B66' || paramKey === 'bms.B68' || paramKey === 'bms.B70' || paramKey === 'bms.B72' || paramKey === 'bms.B74' || paramKey === 'bms.B76' || paramKey === 'bms.B78') {
        registerValue = parseFloat(value) * 1000
      } else if (paramKey === 'bms.B184') {
        const val = parseFloat(value)
        registerValue = val >= 0 && val <= 100 ? val * 10 : 255
      }

      uni.showLoading({ title: '下发中...' })
      try {
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
        const registerAddress = registerMap[paramKey] || '00000000'

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
        uni.hideLoading()
        // this.$emit('cancelParam')
        uni.showToast({ title: `${paramName}指令已下发`, icon: 'success' })
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '下发失败', icon: 'none' })
        console.error('命令帧发送失败:', error)
      }
    },
    handleEditConfig() {
      this.isEditing = true
    },
    closeEdit() {
      this.isEditing = false
      this.editingParam = ''
    },
    handleParamEdit(paramKey) {
      this.editingParam = paramKey
    },
    handleParamCancel() {
      this.editingParam = ''
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
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.action-btns {
  display: flex;
  gap: 16rpx;
}

.edit-btn {
  padding: 8rpx 24rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  
  &.primary {
    background: #6699ff;
    color: #ffffff;
  }
  
  &.close {
    background: #f5f5f5;
    color: #666;
  }
}

.edit-text {
  font-size: 26rpx;
}

.param-list {
  padding: 0 32rpx;
}

.param-list .param-row {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.param-list .param-name {
  // flex: 1;
  font-size: 28rpx;
  color: #333;
  width:40%;
  max-width: fit-content;
}

.param-right-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  gap: 16rpx;
}

.param-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-right: 20rpx;
}

.param-value-box {
  width: 180rpx;
  height: 60rpx;
  line-height: 60rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  text-align: center;
  
  &.editing {
    background: #ffffff;
    border: 1rpx solid #6699ff;
  }
}

.val-text {
  font-size: 28rpx;
  color: #333;
}

.val-input {
  width: 100%;
  height: 100%;
  font-size: 28rpx;
  text-align: center;
  background: transparent;
  border: none;
  
  &:focus {
    outline: none;
  }
}

.unit-text {
  font-size: 26rpx;
  color: #999;
}

.btn-group {
  display: flex;
  gap: 12rpx;
  flex-direction: column;
}

.btn {
  padding: 10rpx 24rpx;
  font-size: 24rpx;
  border-radius: 8rpx;
}

.btn-edit {
  color: #6699ff;
  background: #ffffff;
  border: 1rpx solid #6699ff;
}

.btn-sure {
  color: #ffffff;
  background: #6699ff;
}

.btn-cancel {
  color: #999;
  background: #f5f5f5;
}

.divider {
  height: 16rpx;
  background: #f8f9fa;
  margin: 0;
}

.switch-section {
  padding: 0 32rpx;
}

.switch-section .param-row {
  padding: 20rpx 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1rpx solid #f5f5f5;
}

.switch-section .param-name {
  font-size: 28rpx;
  color: #333;
  flex-shrink: 0;
  margin-right: 20rpx;
  min-width: 160rpx;
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
  padding: 12rpx 32rpx;
  font-size: 26rpx;
  border: 1rpx solid #6699ff;
  border-radius: 5px;
  color: #6699ff;
  background: #ffffff;
  transition: all 0.15s ease;
  
  &:active {
    transform: scale(0.95);
    background: #f0f5ff;
    border-color: #4a8cff;
    color: #4a8cff;
  }
}

.btn-active {
  border-color: #6699ff;
  color: #ffffff;
  background: #6699ff;
  box-shadow: 0 4rpx 12rpx rgba(102, 153, 255, 0.3);
  
  &:active {
    background: #4a8cff;
    border-color: #3d7ef0;
    transform: scale(0.95);
    box-shadow: 0 2rpx 6rpx rgba(102, 153, 255, 0.3);
  }
}

.btn-clicked {
  border-color: #4488fb !important;
  color: #ffffff !important;
  background: #4488fb !important;
  box-shadow: 0 4rpx 16rpx rgba(68, 136, 251, 0.4) !important;
}

.btn-disabled {
  opacity: 0.7;
  pointer-events: none;
}
</style>