<template>
  <view class="pcs-settings">

    <view class="control-section">
      <text class="section-title">运行模式</text>
      <view class="control-buttons">
        <view class="control-btn" :class="[{ disabled: !isEditing }, gridMode === 'auto' ? 'active' : '']"
          @click="setGridMode('auto')">自适应</view>
        <view class="control-btn" :class="[{ disabled: !isEditing }, gridMode === 'grid' ? 'active' : '']"
          @click="setGridMode('grid')">并网</view>
        <view class="control-btn" :class="[{ disabled: !isEditing }, gridMode === 'offgrid' ? 'active' : '']"
          @click="setGridMode('offgrid')">离网</view>
      </view>
    </view>

    <view class="control-section">
      <text class="section-title">设备状态</text>
      <view class="control-buttons">
        <view class="control-btn" :class="{ disabled: !isEditing }" @click="sendCommand('0x0055')">开机</view>
        <view class="control-btn" :class="{ disabled: !isEditing }" @click="sendCommand('0x00AA')">关机</view>
      </view>
    </view>

    <view class="control-section">
      <text class="section-title">恢复设置</text>
      <view class="control-buttons">
        <view class="control-btn" :class="{ disabled: !isEditing }" @click="sendCommand('0x0055')">恢复所有值</view>
        <view class="control-btn" :class="{ disabled: !isEditing }" @click="sendCommand('0x00AA')">恢复用户值</view>
      </view>
    </view>

    <view class="param-section">
      <text class="section-title">参数设置</text>
      <view class="param-item">
        <text class="param-label">设置模块工作海拔值</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B0' }">
            <text v-if="editingParam !== 'pcs.B0'" class="param-value">{{ params.pcs.B0 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B0" placeholder="请输入" focus />
          </view>
          <text class="param-unit">m</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B0'" class="param-btn edit" @click="$emit('edit', 'pcs.B0')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pcs.B0', '设置模块工作海拔值')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置模块额定输出功率</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B2' }">
            <text v-if="editingParam !== 'pcs.B2'" class="param-value">{{ params.pcs.B2 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B2" placeholder="请输入" focus />
          </view>
          <text class="param-unit">kW</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B2'" class="param-btn edit" @click="$emit('edit', 'pcs.B2')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pcs.B2', '设置模块额定输出功率')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置组号</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B4' }">
            <text v-if="editingParam !== 'pcs.B4'" class="param-value">{{ params.pcs.B4 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B4" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B4'" class="param-btn edit" @click="$emit('edit', 'pcs.B4')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="submitParam('pcs.B4', '设置组号')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置模块地址分配方式</text>
        <view class="control-buttons">
          <view class="control-btn" :class="[{ disabled: !isEditing }, addressMode === 'auto' ? 'active' : '']"
            @click="setAddressMode('auto')">自动分配</view>
          <view class="control-btn" :class="[{ disabled: !isEditing }, addressMode === 'dip' ? 'active' : '']"
            @click="setAddressMode('dip')">拨码设置</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置离网模式交流侧欠压复位</text>
        <view class="control-buttons">
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, acUndervoltageReset === 'disable' ? 'active' : '']"
            @click="setAcUndervoltageReset('disable')">禁止</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, acUndervoltageReset === 'reset' ? 'active' : '']"
            @click="setAcUndervoltageReset('reset')">复位</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置整流模式直流侧欠压复位</text>
        <view class="control-buttons">
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, rectifierDcUndervoltageReset === 'disable' ? 'active' : '']"
            @click="setRectifierDcUndervoltageReset('disable')">禁止</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, rectifierDcUndervoltageReset === 'reset' ? 'active' : '']"
            @click="setRectifierDcUndervoltageReset('reset')">复位</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置模块直流侧过压复位</text>
        <view class="control-buttons">
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, dcOvervoltageReset === 'disable' ? 'active' : '']"
            @click="setDcOvervoltageReset('disable')">禁止</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, dcOvervoltageReset === 'reset' ? 'active' : '']"
            @click="setDcOvervoltageReset('reset')">复位</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置模块短路保护复位</text>
        <view class="control-buttons">
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, shortCircuitReset === 'disable' ? 'active' : '']"
            @click="setShortCircuitReset('disable')">禁止</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, shortCircuitReset === 'reset' ? 'active' : '']"
            @click="setShortCircuitReset('reset')">复位</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置模块直流电压模式</text>
        <view class="control-buttons">
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, dcVoltageMode === 'disable' ? 'active' : '']"
            @click="setDcVoltageMode('disable')">禁止</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, dcVoltageMode === 'enable' ? 'active' : '']"
            @click="setDcVoltageMode('enable')">使能</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置无功功率类型</text>
        <view class="control-buttons">
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, reactivePowerType === 'none' ? 'active' : '']"
            @click="setReactivePowerType('none')">无</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, reactivePowerType === 'capacitive' ? 'active' : '']"
            @click="setReactivePowerType('capacitive')">容性</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, reactivePowerType === 'inductive' ? 'active' : '']"
            @click="setReactivePowerType('inductive')">感性</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置相位误差保护</text>
        <view class="control-buttons">
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, phaseError === 'disable' ? 'active' : '']"
            @click="setPhaseError('disable')">禁止</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, phaseError === 'enable' ? 'active' : '']"
            @click="setPhaseError('enable')">使能</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置过载输出</text>
        <view class="control-buttons">
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, overloadOutput === 'disable' ? 'active' : '']"
            @click="setOverloadOutput('disable')">禁止</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, overloadOutput === 'enable' ? 'active' : '']"
            @click="setOverloadOutput('enable')">使能</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置输入电压环</text>
        <view class="control-buttons">
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, inputVoltageLoop === 'disable' ? 'active' : '']"
            @click="setInputVoltageLoop('disable')">禁止</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, inputVoltageLoop === 'enable' ? 'active' : '']"
            @click="setInputVoltageLoop('enable')">使能</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置交流电压环</text>
        <view class="control-buttons">
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, acVoltageLoop === 'disable' ? 'active' : '']"
            @click="setAcVoltageLoop('disable')">禁止</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, acVoltageLoop === 'enable' ? 'active' : '']"
            @click="setAcVoltageLoop('enable')">使能</view>
        </view>
      </view>

      <view class="param-item inline-param">
        <text class="param-label">设置电流环</text>
        <view class="control-buttons">
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, currentLoop === 'disable' ? 'active' : '']"
            @click="setCurrentLoop('disable')">禁止</view>
          <view class="control-btn"
            :class="[{ disabled: !isEditing }, currentLoop === 'enable' ? 'active' : '']"
            @click="setCurrentLoop('enable')">使能</view>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置交流电压环比例系数</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B40' }">
            <text v-if="editingParam !== 'pcs.B40'" class="param-value">{{ params.pcs.B40 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B40" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B40'" class="param-btn edit" @click="$emit('edit', 'pcs.B40')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B40', '设置交流电压环比例系数')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置交流电压环积分系数</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B44' }">
            <text v-if="editingParam !== 'pcs.B44'" class="param-value">{{ params.pcs.B44 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B44" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B44'" class="param-btn edit" @click="$emit('edit', 'pcs.B44')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B44', '设置交流电压环积分系数')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置电流环比例系数</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B48' }">
            <text v-if="editingParam !== 'pcs.B48'" class="param-value">{{ params.pcs.B48 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B48" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B48'" class="param-btn edit" @click="$emit('edit', 'pcs.B48')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B48', '设置电流环比例系数')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置电流环积分系数</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B52' }">
            <text v-if="editingParam !== 'pcs.B52'" class="param-value">{{ params.pcs.B52 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B52" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B52'" class="param-btn edit" @click="$emit('edit', 'pcs.B52')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B52', '设置电流环积分系数')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置直流电压环比例系数</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B60' }">
            <text v-if="editingParam !== 'pcs.B60'" class="param-value">{{ params.pcs.B60 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B60" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B60'" class="param-btn edit" @click="$emit('edit', 'pcs.B60')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B60', '设置直流电压环比例系数')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置直流电压环积分系数</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B62' }">
            <text v-if="editingParam !== 'pcs.B62'" class="param-value">{{ params.pcs.B62 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B62" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B62'" class="param-btn edit" @click="$emit('edit', 'pcs.B62')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B62', '设置直流电压环积分系数')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置交流电压环限幅上限</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B68' }">
            <text v-if="editingParam !== 'pcs.B68'" class="param-value">{{ params.pcs.B68 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B68" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B68'" class="param-btn edit" @click="$emit('edit', 'pcs.B68')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B68', '设置交流电压环限幅上限')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置交流电压环限幅下限</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B72' }">
            <text v-if="editingParam !== 'pcs.B72'" class="param-value">{{ params.pcs.B72 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B72" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B72'" class="param-btn edit" @click="$emit('edit', 'pcs.B72')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B72', '设置交流电压环限幅下限')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置电流环限幅上限</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B76' }">
            <text v-if="editingParam !== 'pcs.B76'" class="param-value">{{ params.pcs.B76 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B76" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B76'" class="param-btn edit" @click="$emit('edit', 'pcs.B76')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B76', '设置电流环限幅上限')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置电流环限幅下限</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B78' }">
            <text v-if="editingParam !== 'pcs.B78'" class="param-value">{{ params.pcs.B78 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B78" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B78'" class="param-btn edit" @click="$emit('edit', 'pcs.B78')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B78', '设置电流环限幅下限')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置直流电压环限幅上限</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B80' }">
            <text v-if="editingParam !== 'pcs.B80'" class="param-value">{{ params.pcs.B80 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B80" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B80'" class="param-btn edit" @click="$emit('edit', 'pcs.B80')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B80', '设置直流电压环限幅上限')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置直流电压环限幅下限</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B82' }">
            <text v-if="editingParam !== 'pcs.B82'" class="param-value">{{ params.pcs.B82 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B82" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B82'" class="param-btn edit" @click="$emit('edit', 'pcs.B82')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B82', '设置直流电压环限幅下限')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置有功功率参考值</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B84' }">
            <text v-if="editingParam !== 'pcs.B84'" class="param-value">{{ params.pcs.B84 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B84" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B84'" class="param-btn edit" @click="$emit('edit', 'pcs.B84')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B84', '设置有功功率参考值')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置无功功率参考值</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B86' }">
            <text v-if="editingParam !== 'pcs.B86'" class="param-value">{{ params.pcs.B86 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B86" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B86'" class="param-btn edit" @click="$emit('edit', 'pcs.B86')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B86', '设置无功功率参考值')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置直流电压参考值</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B88' }">
            <text v-if="editingParam !== 'pcs.B88'" class="param-value">{{ params.pcs.B88 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B88" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B88'" class="param-btn edit" @click="$emit('edit', 'pcs.B88')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B88', '设置直流电压参考值')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置交流电压参考值</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B90' }">
            <text v-if="editingParam !== 'pcs.B90'" class="param-value">{{ params.pcs.B90 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B90" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B90'" class="param-btn edit" @click="$emit('edit', 'pcs.B90')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B90', '设置交流电压参考值')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置频率参考值</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B96' }">
            <text v-if="editingParam !== 'pcs.B96'" class="param-value">{{ params.pcs.B96 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B96" placeholder="请输入" focus />
          </view>
          <text class="param-unit">Hz</text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B96'" class="param-btn edit" @click="$emit('edit', 'pcs.B96')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B96', '设置频率参考值')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置功率因数参考值</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B98' }">
            <text v-if="editingParam !== 'pcs.B98'" class="param-value">{{ params.pcs.B98 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B98" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B98'" class="param-btn edit" @click="$emit('edit', 'pcs.B98')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B98', '设置功率因数参考值')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置限流系数</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B104' }">
            <text v-if="editingParam !== 'pcs.B104'" class="param-value">{{ params.pcs.B104 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B104" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B104'" class="param-btn edit" @click="$emit('edit', 'pcs.B104')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B104', '设置限流系数')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置电压环系数</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B106' }">
            <text v-if="editingParam !== 'pcs.B106'" class="param-value">{{ params.pcs.B106 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B106" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B106'" class="param-btn edit" @click="$emit('edit', 'pcs.B106')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B106', '设置电压环系数')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置电流环系数</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B108' }">
            <text v-if="editingParam !== 'pcs.B108'" class="param-value">{{ params.pcs.B108 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B108" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B108'" class="param-btn edit" @click="$emit('edit', 'pcs.B108')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B108', '设置电流环系数')">下发</view>
            <view class="param-btn cancel" @click="$emit('cancel')">取消</view>
          </template>
        </view>
      </view>

      <view class="param-item">
        <text class="param-label">设置频率环系数</text>
        <view class="param-input-wrap">
          <view class="param-input" :class="{ editing: editingParam === 'pcs.B110' }">
            <text v-if="editingParam !== 'pcs.B110'" class="param-value">{{ params.pcs.B110 || "--" }}</text>
            <input v-else type="number" v-model="params.pcs.B110" placeholder="请输入" focus />
          </view>
          <text class="param-unit"></text>
        </view>
        <view class="param-actions">
          <view v-if="editingParam !== 'pcs.B110'" class="param-btn edit" @click="$emit('edit', 'pcs.B110')">编辑</view>
          <template v-else>
            <view class="param-btn confirm" @click="$emit('submit', 'pcs.B110', '设置频率环系数')">下发</view>
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
  name: 'PcsSettings',
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
      deviceAddress: '01',
      userId: 0,
      gridMode: 'grid',
      addressMode: 'dip',
      acUndervoltageReset: 'disable',
      rectifierDcUndervoltageReset: 'disable',
      dcOvervoltageReset: 'disable',
      shortCircuitReset: 'disable',
      dcVoltageMode: 'disable',
      reactivePowerType: 'none',
      phaseError: 'disable',
      overloadOutput: 'disable',
      inputVoltageLoop: 'disable',
      acVoltageLoop: 'disable',
      currentLoop: 'disable'
    }
  },
  methods: {
    async sendCommand(cmd) {
      if (!this.checkEditMode()) return
      
      let value = cmd
      let registerAddress = '00000000'
      
      if (typeof cmd === 'object') {
        if (cmd.value == null) {
          uni.showToast({ title: '命令参数无效', icon: 'none' })
          return
        }
        value = cmd.value
        registerAddress = cmd.registerAddress || '00000000'
      } else if (!cmd && cmd !== 0) {
        uni.showToast({ title: '命令参数无效', icon: 'none' })
        return
      }
      
      uni.showLoading({ title: '发送中...' })
      try {
        const commandData = {
          apiSufix: 'multiControl',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '0102',
            addr: this.deviceAddress,
            deviceId: '0064',
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
        uni.hideLoading()
        uni.showToast({ title: '命令已发送', icon: 'success' })
        this.$emit('cancel')
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '下发失败', icon: 'none' })
        console.error('命令帧发送失败:', error)
      }
    },
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
          'pcs.B0': '00000000', 'pcs.B4': '00000004', 'pcs.B8': '00000008',
          'pcs.B12': '0000000C', 'pcs.B16': '00000010', 'pcs.B20': '00000014',
          'pcs.B24': '00000018', 'pcs.B28': '0000001C', 'pcs.B32': '00000020',
          'pcs.B56': '00000038', 'pcs.B64': '00000040', 'pcs.B100': '00000064',
          'pcs.B112': '00000070'
        }
        const registerAddress = registerMap[paramKey] || '00000000'

        const commandData = {
          apiSufix: 'multiControl',
          idCode: this.idCode,
          typeCode: '3401',
          address: this.deviceAddress,
          userId: this.userId,
          commands: [{
            deviceCategory: '0102',
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
    setGridMode(mode) {
      if (!this.checkEditMode()) return
      this.gridMode = mode
      let value = '0x00000000'
      if (mode === 'rectifier') value = '0x00010000'
      if (mode === 'offGrid') value = '0x00020000'
      this.submitParam('pcs.B4', '并网/整流/离网设置', value)
    },
    setAddressMode(mode) {
      if (!this.checkEditMode()) return
      this.addressMode = mode
      this.submitParam('pcs.B12', '地址分配方式', mode === 'auto' ? '0x00010000' : '0x00000000')
    },
    setAcUndervoltageReset(mode) {
      if (!this.checkEditMode()) return
      this.acUndervoltageReset = mode
      this.submitParam('pcs.B16', '离网模式交流侧欠压复位', mode === 'disable' ? '0x00000000' : '0x00010000')
    },
    setRectifierDcUndervoltageReset(mode) {
      if (!this.checkEditMode()) return
      this.rectifierDcUndervoltageReset = mode
      this.submitParam('pcs.B20', '整流模式直流侧欠压复位', mode === 'disable' ? '0x00000000' : '0x00010000')
    },
    setDcOvervoltageReset(mode) {
      if (!this.checkEditMode()) return
      this.dcOvervoltageReset = mode
      this.submitParam('pcs.B24', '模块直流侧过压复位', mode === 'disable' ? '0x00000000' : '0x00010000')
    },
    setShortCircuitReset(mode) {
      if (!this.checkEditMode()) return
      this.shortCircuitReset = mode
      this.submitParam('pcs.B28', '模块短路复位', mode === 'disable' ? '0x00000000' : '0x00010000')
    },
    setDcVoltageMode(mode) {
      if (!this.checkEditMode()) return
      this.dcVoltageMode = mode
      this.submitParam('pcs.B32', '直流侧电压', mode === 'disable' ? '0x00000000' : '0x00010000')
    },
    setReactivePowerType(type) {
      if (!this.checkEditMode()) return
      this.reactivePowerType = type
      let value = '0x00A00000'
      if (type === 'pf') value = '0x00A10000'
      if (type === 'reactive') value = '0x00A20000'
      this.submitParam('pcs.B56', '交流侧无功功率类型', value)
    },
    setPhaseError(mode) {
      if (!this.checkEditMode()) return
      this.phaseError = mode
      this.submitParam('pcs.B64', '是否错相', mode === 'disable' ? '0x00000000' : '0x00010000')
    },
    setOverloadOutput(mode) {
      if (!this.checkEditMode()) return
      this.overloadOutput = mode
      this.submitParam('pcs.B100', '是否过载输出', mode === 'disable' ? '0x00000000' : '0x00010000')
    },
    setInputVoltageLoop(mode) {
      if (!this.checkEditMode()) return
      this.inputVoltageLoop = mode
      this.submitParam('pcs.B112', '是否使能输入电压环', mode === 'disable' ? '0x00000000' : '0x00010000')
    },
    setAcVoltageLoop(mode) {
      if (!this.checkEditMode()) return
      this.acVoltageLoop = mode
      this.submitParam('pcs.B114', '是否使能交流电压环', mode === 'disable' ? '0x00000000' : '0x00010000')
    },
    setCurrentLoop(mode) {
      if (!this.checkEditMode()) return
      this.currentLoop = mode
      this.submitParam('pcs.B116', '是否使能电流环', mode === 'disable' ? '0x00000000' : '0x00010000')
    }
  }
}
</script>

<style lang="scss" scoped>
.pcs-settings {
  .control-section {
    background: #fff;
    border-radius: 20rpx;
    padding: 28rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:active {
      transform: scale(0.995);
    }
  }

  .control-section.editing {
    border: 3rpx solid #4488FB;
    box-shadow: 0 8rpx 28rpx rgba(68, 136, 251, 0.15);
  }

  .section-title {
    font-size: 30rpx;
    color: #1F2937;
    font-weight: 600;
    margin-bottom: 24rpx;
    display: block;
    padding-left: 16rpx;
    border-left: 6rpx solid transparent;
    border-image: linear-gradient(180deg, #4488FB 0%, #6B9DFF 100%) 1;
  }

  .control-section.editing .section-title {
    color: #4488FB;
  }

  .control-buttons {
    display: flex;
    gap: 20rpx;

    &.three-btn {
      gap: 12rpx;

      .control-btn {
        padding: 16rpx 24rpx;
        min-width: 120rpx;
        font-size: 26rpx;
      }
    }
  }

  .control-btn {
    flex: 1;
    padding: 24rpx;
    text-align: center;
    border-radius: 12rpx;
    font-size: 28rpx;
    background: #F8FAFC;
    color: #4488FB;
    border: 2rpx solid #E4E7ED;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(68, 136, 251, 0.1), transparent);
      transition: left 0.5s ease;
    }

    &:active::before {
      left: 100%;
    }

    &.active {
      background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
      color: #fff;
      border-color: #4488FB;
      font-weight: 600;
      box-shadow: 0 6rpx 20rpx rgba(68, 136, 251, 0.35);

      &::before {
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      }
    }

    &.disabled {
      background: #F5F7FA;
      color: #D9D9D9;
      border-color: #EFEFEF;
      cursor: not-allowed;
    }

    &.active.disabled {
      opacity: 0.7;
      background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
      color: #fff;
      border-color: #4488FB;
      box-shadow: 0 6rpx 20rpx rgba(68, 136, 251, 0.35);
    }
  }

  .param-section {
    background: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
  }

  .param-item {
    display: flex;
    align-items: center;
    padding: 24rpx 16rpx;
    border-bottom: 1rpx solid #F0F2F5;
    transition: all 0.25s ease;
    box-sizing: border-box;

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

    &.vertical {
      flex-direction: column;
      align-items: flex-start;
      gap: 16rpx;

      .control-buttons {
        width: 100%;
      }
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
    font-size: 28rpx;
    color: #1F2937;
  }

  .param-unit {
    font-size: 24rpx;
    color: #9CA3AF;
  }

  .param-actions {
    display: flex;
    gap: 16rpx;
    flex-shrink: 0;
    margin-left: 24rpx;
  }

  .param-btn {
    padding: 12rpx 24rpx;
    border-radius: 8rpx;
    font-size: 26rpx;
    transition: all 0.2s ease;

    &.edit {
      background: #F8FAFC;
      color: #4488FB;
    }

    &.confirm {
      background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
      color: #fff;
    }

    &.cancel {
      background: #F3F4F6;
      color: #6B7280;
    }

    &:active {
      opacity: 0.7;
    }
  }

  .tip {
    font-size: 24rpx;
    color: #909399;
  }

  input {
    font-size: 28rpx;
    color: #1F2937;
    text-align: center;
  }
}
</style>