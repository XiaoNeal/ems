<template>
  <view class="storage-settings">
    <view class="control-section">
      <text class="section-title">储能DC/DC1</text>
      
      <view class="param-item baud-rate-section">
        <view class="param-label-wrap">
          <text class="param-label">Can波特率设置</text>
          <text class="param-tip">默认: 125kbps</text>
        </view>
        <view class="control-buttons four-btn">
          <view class="control-btn baud-btn" :class="[{ disabled: !isEditing }, canBaudRate === '0' ? 'active' : '']"
            @click="setCanBaudRate('0')">
            <text class="btn-value">1000</text>
            <text class="btn-unit">kbps</text>
          </view>
          <view class="control-btn baud-btn" :class="[{ disabled: !isEditing }, canBaudRate === '1' ? 'active' : '']"
            @click="setCanBaudRate('1')">
            <text class="btn-value">500</text>
            <text class="btn-unit">kbps</text>
          </view>
          <view class="control-btn baud-btn" :class="[{ disabled: !isEditing }, canBaudRate === '2' ? 'active' : '']"
            @click="setCanBaudRate('2')">
            <text class="btn-value">250</text>
            <text class="btn-unit">kbps</text>
          </view>
          <view class="control-btn baud-btn" :class="[{ disabled: !isEditing }, canBaudRate === '3' ? 'active' : '']"
            @click="setCanBaudRate('3')">
            <text class="btn-value">125</text>
            <text class="btn-unit">kbps</text>
          </view>
        </view>
      </view>

      <view class="param-item baud-rate-section">
        <view class="param-label-wrap">
          <text class="param-label">认证标准码</text>
          <text class="param-tip">默认: 中国标准I</text>
        </view>
        <view class="control-buttons four-btn">
          <view class="control-btn baud-btn"
            :class="[{ disabled: !isEditing }, authStandardCode === '0' ? 'active' : '']"
            @click="setAuthStandardCode('0')">
            <text class="btn-value">中国标准I</text>
          </view>
          <view class="control-btn baud-btn"
            :class="[{ disabled: !isEditing }, authStandardCode === '1' ? 'active' : '']"
            @click="setAuthStandardCode('1')">
            <text class="btn-value">中国标准II</text>
          </view>
          <view class="control-btn baud-btn"
            :class="[{ disabled: !isEditing }, authStandardCode === '2' ? 'active' : '']"
            @click="setAuthStandardCode('2')">
            <text class="btn-value">美国标准</text>
          </view>
          <view class="control-btn baud-btn"
            :class="[{ disabled: !isEditing }, authStandardCode === '3' ? 'active' : '']"
            @click="setAuthStandardCode('3')">
            <text class="btn-value">德国标准</text>
          </view>
        </view>
      </view>

      <view class="param-item baud-rate-section">
        <view class="param-label-wrap">
          <text class="param-label">机器类型</text>
          <text class="param-tip">默认: IBDC30060</text>
        </view>
        <view class="control-buttons four-btn">
          <view class="control-btn baud-btn" :class="[{ disabled: !isEditing }, machineType === '1' ? 'active' : '']"
            @click="setMachineType('1')">
            <text class="btn-value">IBDC30060</text>
          </view>
          <view class="control-btn baud-btn" :class="[{ disabled: !isEditing }, machineType === '2' ? 'active' : '']"
            @click="setMachineType('2')">
            <text class="btn-value">IBG30060</text>
          </view>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">故障清除</text>
        <view class="param-actions">
          <view class="param-btn confirm" @click="clearFault">清除所有故障</view>
        </view>
      </view>

      <view class="param-item baud-rate-section">
        <view class="param-label-wrap">
          <text class="param-label">运行状态设置</text>
          <text class="param-tip">默认: 并网</text>
        </view>
        <view class="control-buttons four-btn">
          <view class="control-btn baud-btn" :class="[{ disabled: !isEditing }, runStatus === '0' ? 'active' : '']"
            @click="setRunStatus('0')">
            <text class="btn-value">自适应</text>
          </view>
          <view class="control-btn baud-btn" :class="[{ disabled: !isEditing }, runStatus === '1' ? 'active' : '']"
            @click="setRunStatus('1')">
            <text class="btn-value">并网</text>
          </view>
          <view class="control-btn baud-btn" :class="[{ disabled: !isEditing }, runStatus === '2' ? 'active' : '']"
            @click="setRunStatus('2')">
            <text class="btn-value">离网</text>
          </view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">系统开关机</text>
        <view class="control-buttons">
          <view class="control-btn" :class="[{ disabled: !isEditing }, powerStatus === 'on' ? 'active' : '']"
            @click="setPowerStatus('on')">开机</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, powerStatus === 'off' ? 'active' : '']"
            @click="setPowerStatus('off')">关机</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">恢复出厂设置</text>
        <view class="control-buttons">
          <view class="control-btn" :class="[{ disabled: !isEditing }, factoryReset === 'all' ? 'active' : '']"
            @click="setFactoryReset('all')">恢复所有值</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, factoryReset === 'user' ? 'active' : '']"
            @click="setFactoryReset('user')">恢复用户值</view>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">组ID号</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B12' }">
            <text v-if="editingParam !== 'storage.B12'" class="param-value">{{ params.storage.B12 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B12" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B12'" class="param-btn edit" @click="$emit('edit', 'storage.B12')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B12', '组ID号')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块数量</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B14' }">
            <text v-if="editingParam !== 'storage.B14'" class="param-value">{{ params.storage.B14 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B14" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B14'" class="param-btn edit" @click="$emit('edit', 'storage.B14')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B14', '模块数量')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">电池类型</text>
        <view class="control-buttons">
          <view class="control-btn" :class="[{ disabled: !isEditing }, batteryType === '0' ? 'active' : '']"
            @click="setBatteryType('0')">铅酸电池</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, batteryType === '1' ? 'active' : '']"
            @click="setBatteryType('1')">锂电池</view>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">直流母线电压</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B18' }">
            <text v-if="editingParam !== 'storage.B18'" class="param-value">{{ params.storage.B18 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B18" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B18'" class="param-btn edit" @click="$emit('edit', 'storage.B18')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B18', '直流母线电压')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item baud-rate-section">
        <view class="param-label-wrap">
          <text class="param-label">充放电指令</text>
        </view>
        <view class="control-buttons four-btn">
          <view class="control-btn" :class="[{ disabled: !isEditing }, chargeDischarge === '0' ? 'active' : '']"
            @click="setChargeDischarge('0')">待机</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, chargeDischarge === '1' ? 'active' : '']"
            @click="setChargeDischarge('1')">充电</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, chargeDischarge === '2' ? 'active' : '']"
            @click="setChargeDischarge('2')">放电</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, chargeDischarge === '3' ? 'active' : '']"
            @click="setChargeDischarge('3')">BAT自动</view>
        </view>
        <view class="control-buttons four-btn">
          <view class="control-btn" :class="[{ disabled: !isEditing }, chargeDischarge === '4' ? 'active' : '']"
            @click="setChargeDischarge('4')">BUS自动</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, chargeDischarge === '5' ? 'active' : '']"
            @click="setChargeDischarge('5')">关充电</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, chargeDischarge === '6' ? 'active' : '']"
            @click="setChargeDischarge('6')">高压PV</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, chargeDischarge === '7' ? 'active' : '']"
            @click="setChargeDischarge('7')">低压PV</view>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">充放电功率设定</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B22' }">
            <text v-if="editingParam !== 'storage.B22'" class="param-value">{{ params.storage.B22 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B22" placeholder="请输入" focus />
          </view>
          <text class="param-unit">kW</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B22'" class="param-btn edit" @click="$emit('edit', 'storage.B22')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B22', '充放电功率设定')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">电池均充电压</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B24' }">
            <text v-if="editingParam !== 'storage.B24'" class="param-value">{{ params.storage.B24 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B24" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B24'" class="param-btn edit" @click="$emit('edit', 'storage.B24')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B24', '电池均充电压')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">充电电流设置</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B26' }">
            <text v-if="editingParam !== 'storage.B26'" class="param-value">{{ params.storage.B26 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B26" placeholder="请输入" focus />
          </view>
          <text class="param-unit">A</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B26'" class="param-btn edit" @click="$emit('edit', 'storage.B26')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B26', '充电电流设置')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">电池浮充电压</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B28' }">
            <text v-if="editingParam !== 'storage.B28'" class="param-value">{{ params.storage.B28 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B28" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B28'" class="param-btn edit" @click="$emit('edit', 'storage.B28')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B28', '电池浮充电压')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">放电电压设置</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B30' }">
            <text v-if="editingParam !== 'storage.B30'" class="param-value">{{ params.storage.B30 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B30" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B30'" class="param-btn edit" @click="$emit('edit', 'storage.B30')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B30', '放电电压设置')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">放电电流设置</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B32' }">
            <text v-if="editingParam !== 'storage.B32'" class="param-value">{{ params.storage.B32 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B32" placeholder="请输入" focus />
          </view>
          <text class="param-unit">A</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B32'" class="param-btn edit" @click="$emit('edit', 'storage.B32')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B32', '放电电流设置')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">电池过压关机点</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B34' }">
            <text v-if="editingParam !== 'storage.B34'" class="param-value">{{ params.storage.B34 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B34" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B34'" class="param-btn edit" @click="$emit('edit', 'storage.B34')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B34', '电池过压关机点')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">电池低压告警点</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B36' }">
            <text v-if="editingParam !== 'storage.B36'" class="param-value">{{ params.storage.B36 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B36" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B36'" class="param-btn edit" @click="$emit('edit', 'storage.B36')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B36', '电池低压告警点')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">电池低压关机点</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B38' }">
            <text v-if="editingParam !== 'storage.B38'" class="param-value">{{ params.storage.B38 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B38" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B38'" class="param-btn edit" @click="$emit('edit', 'storage.B38')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B38', '电池低压关机点')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">电池激活功能</text>
        <view class="control-buttons">
          <view class="control-btn" :class="[{ disabled: !isEditing }, batteryActivate === '0' ? 'active' : '']"
            @click="setBatteryActivate('0')">禁止</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, batteryActivate === '1' ? 'active' : '']"
            @click="setBatteryActivate('1')">使能</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">自动重启功能</text>
        <view class="control-buttons">
          <view class="control-btn" :class="[{ disabled: !isEditing }, autoRestart === '0' ? 'active' : '']"
            @click="setAutoRestart('0')">禁止</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, autoRestart === '1' ? 'active' : '']"
            @click="setAutoRestart('1')">使能</view>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">充电母线电压上限</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B44' }">
            <text v-if="editingParam !== 'storage.B44'" class="param-value">{{ params.storage.B44 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B44" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B44'" class="param-btn edit" @click="$emit('edit', 'storage.B44')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B44', '充电母线电压上限')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">放电母线电压下限</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B46' }">
            <text v-if="editingParam !== 'storage.B46'" class="param-value">{{ params.storage.B46 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B46" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B46'" class="param-btn edit" @click="$emit('edit', 'storage.B46')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B46', '放电母线电压下限')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">告警屏蔽码1</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'storage.B48' }">
            <text v-if="editingParam !== 'storage.B48'" class="param-value">{{ params.storage.B48 || "--" }}</text>
            <input v-else type="number" v-model="params.storage.B48" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'storage.B48'" class="param-btn edit" @click="$emit('edit', 'storage.B48')">编辑
          </view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('storage.B48', '告警屏蔽码1')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { sendCommandFrame } from '@/api/control.js'

export default {
  name: 'StorageSettings',
  props: {
    params: {
      type: Object,
      required: true
    },
    editingParam: {
      type: String,
      default: ''
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      idCode: 'FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF',
      deviceAddress: '02',
      userId: 0,
      canBaudRate: '3',
      authStandardCode: '0',
      machineType: '1',
      runStatus: '1',
      powerStatus: 'on',
      factoryReset: 'all',
      batteryType: '1',
      chargeDischarge: '0',
      batteryActivate: '0',
      autoRestart: '0'
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
    async submitParam(paramKey, paramName, value) {
      if (value === undefined) {
        value = this.getParamValue(paramKey)
        if (!value && value !== 0) {
          uni.showToast({ title: '请输入参数值', icon: 'none' })
          return
        }
      }

      uni.showLoading({ title: '下发中...' })
      try {
        const registerMap = {
          'storage.B12': '0000000C', 'storage.B14': '0000000E', 'storage.B18': '00000012',
          'storage.B22': '00000016', 'storage.B24': '00000018', 'storage.B26': '0000001A',
          'storage.B28': '0000001C', 'storage.B30': '0000001E', 'storage.B32': '00000020',
          'storage.B34': '00000022', 'storage.B36': '00000024', 'storage.B38': '00000026',
          'storage.B44': '0000002C', 'storage.B46': '0000002E', 'storage.B48': '00000030'
        }
        const registerAddress = registerMap[paramKey] || '00000000'

        const commandData = {
          apiSufix: 'multiControl',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '0103',
            addr: this.deviceAddress,
            deviceId: '0064',
            registerAddress: registerAddress,
            registerValue: value.toString().padStart(8, '0'),
            valueType: '01',
            registerType: '03',
            extra1: '00',
            extra2: '00',
            extra3: '00'
          }]
        }

        await sendCommandFrame(commandData)
        uni.hideLoading()
        this.$emit('cancel')
        uni.showToast({ title: `${paramName}指令已下发`, icon: 'success' })
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '下发失败', icon: 'none' })
        console.error('命令帧发送失败:', error)
      }
    },
    getParamValue(paramKey) {
      const [module, key] = paramKey.split('.')
      return this.params[module][key]
    },
    setCanBaudRate(value) {
      if (!this.checkEditMode()) return
      this.canBaudRate = value
      const baudValues = { '0': '0x00000000', '1': '0x00010000', '2': '0x00020000', '3': '0x00030000' }
      this.submitParam('storage.B0', 'Can波特率设置', baudValues[value])
    },
    setAuthStandardCode(value) {
      if (!this.checkEditMode()) return
      this.authStandardCode = value
      const codeValues = { '0': '0x00000000', '1': '0x00010000', '2': '0x00020000', '3': '0x00030000' }
      this.submitParam('storage.B2', '认证标准码', codeValues[value])
    },
    setMachineType(value) {
      if (!this.checkEditMode()) return
      this.machineType = value
      const typeValues = { '1': '0x00010000', '2': '0x00020000' }
      this.submitParam('storage.B4', '机器类型', typeValues[value])
    },
    setRunStatus(value) {
      if (!this.checkEditMode()) return
      this.runStatus = value
      const statusValues = { '0': '0x00000000', '1': '0x00010000', '2': '0x00020000' }
      this.submitParam('storage.B6', '运行状态设置', statusValues[value])
    },
    setPowerStatus(value) {
      if (!this.checkEditMode()) return
      this.powerStatus = value
      uni.showLoading({ title: '下发中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: `系统${value === 'on' ? '开机' : '关机'}指令已下发`, icon: 'success' })
      }, 1000)
    },
    setFactoryReset(value) {
      if (!this.checkEditMode()) return
      this.factoryReset = value
      uni.showLoading({ title: '下发中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: `恢复${value === 'all' ? '所有值' : '用户值'}指令已下发`, icon: 'success' })
      }, 1000)
    },
    setBatteryType(value) {
      if (!this.checkEditMode()) return
      this.batteryType = value
      const typeValues = { '0': '0x00000000', '1': '0x00010000' }
      this.submitParam('storage.B16', '电池类型', typeValues[value])
    },
    setChargeDischarge(value) {
      if (!this.checkEditMode()) return
      this.chargeDischarge = value
      const hexValue = `0x000${value}0000`
      this.submitParam('storage.B20', '充放电指令', hexValue)
    },
    setBatteryActivate(value) {
      if (!this.checkEditMode()) return
      this.batteryActivate = value
      const activateValues = { '0': '0x00000000', '1': '0x00010000' }
      this.submitParam('storage.B40', '电池激活功能', activateValues[value])
    },
    setAutoRestart(value) {
      if (!this.checkEditMode()) return
      this.autoRestart = value
      const restartValues = { '0': '0x00000000', '1': '0x00010000' }
      this.submitParam('storage.B42', '自动重启功能', restartValues[value])
    },
    clearFault() {
      if (!this.checkEditMode()) return
      uni.showLoading({ title: '清除中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '故障已清除', icon: 'success' })
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.storage-settings {
  .control-section {
    background: #ffffff;
    border-radius: 20rpx;
    padding: 28rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
  }

  .section-title {
    font-size: 32rpx;
    color: #1F2937;
    font-weight: 600;
    margin-bottom: 28rpx;
    padding-left: 20rpx;
    border-left: 6rpx solid #4488FB;
    display: block;
  }

  .control-buttons {
    display: flex;
    gap: 16rpx;

    &.four-btn {
      gap: 12rpx;
      justify-content: space-between;

      .control-btn {
        padding: 20rpx 16rpx;
        flex: 1;
        min-width: 130rpx;
        height: 76rpx;
        font-size: 26rpx;
        border-radius: 12rpx;
        background: #F8FAFC;
        border: 2rpx solid #E4E7ED;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;

        &.active {
          background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
          color: #ffffff;
          border-color: #4488FB;
          box-shadow: 0 8rpx 24rpx rgba(68, 136, 251, 0.35);
          transform: translateY(-2rpx);
        }

        &.disabled {
          background: #F8FAFC;
          color: #C0C4CC;
          border-color: #E8ECF0;
        }

        &.active.disabled {
          background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
          color: #ffffff;
          border-color: #4488FB;
          box-shadow: 0 8rpx 24rpx rgba(68, 136, 251, 0.35);
          transform: translateY(-2rpx);
        }
      }
    }
  }

  .control-btn {
    flex: 1;
    padding: 24rpx 20rpx;
    text-align: center;
    border-radius: 12rpx;
    font-size: 28rpx;
    background: #F8FAFC;
    color: #4488FB;
    border: 2rpx solid #E4E7ED;
    font-weight: 500;

    &:active {
      transform: scale(0.98);
    }

    &.active {
      background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
      color: #ffffff;
      border-color: #4488FB;
      font-weight: 600;
      box-shadow: 0 6rpx 20rpx rgba(68, 136, 251, 0.35);
    }

    &.disabled {
      background: #F5F7FA;
      color: #D9D9D9;
      border-color: #EFEFEF;
    }

    &.active.disabled {
      opacity: 0.7;
      background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
      color: #ffffff;
      border-color: #4488FB;
      box-shadow: 0 6rpx 20rpx rgba(68, 136, 251, 0.35);
    }
  }

  .param-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #F3F4F6;

    &:last-child {
      border-bottom: none;
    }

    &.inline-param {
      justify-content: flex-start;
      align-items: center;

      .param-label {
        flex-shrink: 0;
      }

      .control-buttons {
        flex: 1;
        display: flex;
        gap: 12rpx;
        justify-content: flex-end;
      }

      .control-btn {
        padding: 16rpx 20rpx;
        flex-shrink: 0;
        min-width: 100rpx;
        font-size: 24rpx;
      }
    }

    &.baud-rate-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 20rpx;
      padding: 24rpx;
      background: #FAFBFC;
      border-radius: 16rpx;
      margin-bottom: 20rpx;
      border: 1rpx solid #F0F2F5;

      &:last-child {
        margin-bottom: 0;
      }

      .control-buttons {
        width: 100%;
      }
    }
  }

  .baud-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6rpx;

    .btn-value {
      font-size: 28rpx;
      font-weight: 600;
      color: #1F2937;
    }

    .btn-unit {
      font-size: 22rpx;
      color: #9CA3AF;
    }

    &.active {
      .btn-value {
        color: #ffffff;
      }

      .btn-unit {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .param-label-wrap {
    display: flex;
    align-items: center;
    gap: 16rpx;
    width: 100%;
  }

  .param-label {
    font-size: 28rpx;
    color: #374151;
    flex-shrink: 0;
    width: 340rpx;
    font-weight: 500;
    word-break: break-all;
    line-height: 1.4;
  }

  .param-tip {
    font-size: 24rpx;
    color: #9CA3AF;
    padding: 8rpx 16rpx;
    background: #F3F4F6;
    border-radius: 20rpx;
    flex-shrink: 0;
  }

  .param-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8rpx;
    min-width: 0;
  }

  .param-input {
    background: #F8FAFC;
    border-radius: 12rpx;
    padding: 12rpx 20rpx;
    min-width: 120rpx;
    max-width: 180rpx;
    text-align: center;
    border: 2rpx solid transparent;
    flex-shrink: 0;

    &.editing {
      background: #E8F0FE;
      border-color: #4488FB;
      box-shadow: 0 0 0 4rpx rgba(68, 136, 251, 0.1);
    }
  }

  .param-value {
    font-size: 28rpx;
    color: #1F2937;
    font-weight: 500;
  }

  .param-unit {
    font-size: 24rpx;
    color: #9CA3AF;
    flex-shrink: 0;
  }

  .param-actions {
    display: flex;
    gap: 16rpx;
    flex-shrink: 0;
    margin-left: 20rpx;
  }

  .param-btn {
    padding: 14rpx 28rpx;
    border-radius: 10rpx;
    font-size: 26rpx;
    font-weight: 500;
    border: 2rpx solid transparent;

    &.edit {
      background: #F8FAFC;
      color: #4488FB;
      border-color: #E4E7ED;
    }

    &.confirm {
      background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
      color: #ffffff;
      box-shadow: 0 4rpx 16rpx rgba(68, 136, 251, 0.3);
    }

    &.cancel {
      background: #F3F4F6;
      color: #6B7280;
    }

    &:active {
      transform: scale(0.96);
    }
  }

  input {
    font-size: 28rpx;
    color: #1F2937;
    text-align: center;
    background: transparent;
    border: none;
    outline: none;
  }

  input::placeholder {
    color: #9CA3AF;
  }
}
</style>