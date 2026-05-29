<template>
  <view class="pv-settings">
    <view class="control-section">
      <text class="section-title">光伏DC/DC</text>
      
      <view class="param-item">
        <text class="param-label">模块电压</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B0' }">
            <text v-if="editingParam !== 'pv.B0'" class="param-value">{{ params.pv.B0 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B0" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B0'" class="param-btn edit" @click="$emit('edit', 'pv.B0')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B0', '模块电压')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块电流</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B4' }">
            <text v-if="editingParam !== 'pv.B4'" class="param-value">{{ params.pv.B4 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B4" placeholder="请输入" focus />
          </view>
          <text class="param-unit">A</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B4'" class="param-btn edit" @click="$emit('edit', 'pv.B4')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B4', '模块电流')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块限流点</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B8' }">
            <text v-if="editingParam !== 'pv.B8'" class="param-value">{{ params.pv.B8 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B8" placeholder="请输入" focus />
          </view>
          <text class="param-unit">A</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B8'" class="param-btn edit" @click="$emit('edit', 'pv.B8')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B8', '模块限流点')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块DC板温度</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B12' }">
            <text v-if="editingParam !== 'pv.B12'" class="param-value">{{ params.pv.B12 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B12" placeholder="请输入" focus />
          </view>
          <text class="param-unit">℃</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B12'" class="param-btn edit" @click="$emit('edit', 'pv.B12')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B12', '模块DC板温度')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块输入相电压（直流输入电压）</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B16' }">
            <text v-if="editingParam !== 'pv.B16'" class="param-value">{{ params.pv.B16 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B16" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B16'" class="param-btn edit" @click="$emit('edit', 'pv.B16')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B16', '模块输入相电压（直流输入电压）')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块PFC0电压（正半母线）</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B20' }">
            <text v-if="editingParam !== 'pv.B20'" class="param-value">{{ params.pv.B20 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B20" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B20'" class="param-btn edit" @click="$emit('edit', 'pv.B20')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B20', '模块PFC0电压（正半母线）')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块PFC1电压（负半母线）</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B24' }">
            <text v-if="editingParam !== 'pv.B24'" class="param-value">{{ params.pv.B24 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B24" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B24'" class="param-btn edit" @click="$emit('edit', 'pv.B24')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B24', '模块PFC1电压（负半母线）')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块面板（环境）温度</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B28' }">
            <text v-if="editingParam !== 'pv.B28'" class="param-value">{{ params.pv.B28 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B28" placeholder="请输入" focus />
          </view>
          <text class="param-unit">℃</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B28'" class="param-btn edit" @click="$emit('edit', 'pv.B28')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B28', '模块面板（环境）温度')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块交流A相电压</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B32' }">
            <text v-if="editingParam !== 'pv.B32'" class="param-value">{{ params.pv.B32 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B32" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B32'" class="param-btn edit" @click="$emit('edit', 'pv.B32')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B32', '模块交流A相电压')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块交流B相电压</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B36' }">
            <text v-if="editingParam !== 'pv.B36'" class="param-value">{{ params.pv.B36 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B36" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B36'" class="param-btn edit" @click="$emit('edit', 'pv.B36')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B36', '模块交流B相电压')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块交流C相电压</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B40' }">
            <text v-if="editingParam !== 'pv.B40'" class="param-value">{{ params.pv.B40 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B40" placeholder="请输入" focus />
          </view>
          <text class="param-unit">V</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B40'" class="param-btn edit" @click="$emit('edit', 'pv.B40')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B40', '模块交流C相电压')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块PFC板温度</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B44' }">
            <text v-if="editingParam !== 'pv.B44'" class="param-value">{{ params.pv.B44 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B44" placeholder="请输入" focus />
          </view>
          <text class="param-unit">℃</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B44'" class="param-btn edit" @click="$emit('edit', 'pv.B44')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B44', '模块PFC板温度')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块额定输出功率</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B48' }">
            <text v-if="editingParam !== 'pv.B48'" class="param-value">{{ params.pv.B48 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B48" placeholder="请输入" focus />
          </view>
          <text class="param-unit">kW</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B48'" class="param-btn edit" @click="$emit('edit', 'pv.B48')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B48', '模块额定输出功率')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">模块额定输出电流</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B52' }">
            <text v-if="editingParam !== 'pv.B52'" class="param-value">{{ params.pv.B52 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B52" placeholder="请输入" focus />
          </view>
          <text class="param-unit">A</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B52'" class="param-btn edit" @click="$emit('edit', 'pv.B52')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B52', '模块额定输出电流')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">读取当前告警/状态</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B56' }">
            <text v-if="editingParam !== 'pv.B56'" class="param-value">{{ params.pv.B56 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B56" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B56'" class="param-btn edit" @click="$emit('edit', 'pv.B56')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B56', '读取当前告警/状态')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">读取组号和拨码地址</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B60' }">
            <text v-if="editingParam !== 'pv.B60'" class="param-value">{{ params.pv.B60 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B60" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B60'" class="param-btn edit" @click="$emit('edit', 'pv.B60')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B60', '读取组号和拨码地址')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">读取输入功率</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B64' }">
            <text v-if="editingParam !== 'pv.B64'" class="param-value">{{ params.pv.B64 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B64" placeholder="请输入" focus />
          </view>
          <text class="param-unit">kW</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B64'" class="param-btn edit" @click="$emit('edit', 'pv.B64')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B64', '读取输入功率')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">读取当前设定的海拔值</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B68' }">
            <text v-if="editingParam !== 'pv.B68'" class="param-value">{{ params.pv.B68 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B68" placeholder="请输入" focus />
          </view>
          <text class="param-unit">m</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B68'" class="param-btn edit" @click="$emit('edit', 'pv.B68')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B68', '读取当前设定的海拔值')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">读取当前模块输入工作模式</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B72' }">
            <text v-if="editingParam !== 'pv.B72'" class="param-value">{{ params.pv.B72 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B72" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B72'" class="param-btn edit" @click="$emit('edit', 'pv.B72')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B72', '读取当前模块输入工作模式')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">读节点SearialNo号低位（ID号）</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B76' }">
            <text v-if="editingParam !== 'pv.B76'" class="param-value">{{ params.pv.B76 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B76" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B76'" class="param-btn edit" @click="$emit('edit', 'pv.B76')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B76', '读节点SearialNo号低位（ID号）')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">读节点SearialNo号高位</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B80' }">
            <text v-if="editingParam !== 'pv.B80'" class="param-value">{{ params.pv.B80 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B80" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B80'" class="param-btn edit" @click="$emit('edit', 'pv.B80')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B80', '读节点SearialNo号高位')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">读DCDC版本号</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B84' }">
            <text v-if="editingParam !== 'pv.B84'" class="param-value">{{ params.pv.B84 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B84" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B84'" class="param-btn edit" @click="$emit('edit', 'pv.B84')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B84', '读DCDC版本号')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">读PFC版本号</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pv.B88' }">
            <text v-if="editingParam !== 'pv.B88'" class="param-value">{{ params.pv.B88 || "--" }}</text>
            <input v-else type="number" v-model="params.pv.B88" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pv.B88'" class="param-btn edit" @click="$emit('edit', 'pv.B88')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pv.B88', '读PFC版本号')">下发</view>
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
  name: 'PvSettings',
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
      deviceAddress: '03',
      userId: 0
    }
  },
  methods: {
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
          'pv.B0': '00000000', 'pv.B4': '00000004', 'pv.B8': '00000008',
          'pv.B12': '0000000C', 'pv.B16': '00000010', 'pv.B20': '00000014',
          'pv.B24': '00000018', 'pv.B28': '0000001C', 'pv.B32': '00000020',
          'pv.B36': '00000024', 'pv.B40': '00000028', 'pv.B44': '0000002C',
          'pv.B48': '00000030', 'pv.B52': '00000034', 'pv.B56': '00000038',
          'pv.B60': '0000003C', 'pv.B64': '00000040', 'pv.B68': '00000044',
          'pv.B72': '00000048', 'pv.B76': '0000004C', 'pv.B80': '00000050',
          'pv.B84': '00000054', 'pv.B88': '00000058'
        }
        const registerAddress = registerMap[paramKey] || '00000000'

        const commandData = {
          apiSufix: 'multiControl',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '0104',
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
    }
  }
}
</script>

<style lang="scss" scoped>
.pv-settings {
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

  .param-item {
    display: flex;
    align-items: center;
    padding: 24rpx 16rpx;
    border-bottom: 1rpx solid #F3F4F6;
    box-sizing: border-box;

    &:last-child {
      border-bottom: none;
    }
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
    font-size: 26rpx;
    color: #1F2937;
    font-weight: 500;
    word-break: break-all;
  }

  .param-unit {
    font-size: 22rpx;
    color: #9CA3AF;
    flex-shrink: 0;
    min-width: 40rpx;
    text-align: left;
  }

  .param-actions {
    display: flex;
    gap: 8rpx;
    flex-shrink: 0;
    margin-left: 12rpx;
  }

  .param-btn {
    padding: 10rpx 20rpx;
    border-radius: 8rpx;
    font-size: 22rpx;
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