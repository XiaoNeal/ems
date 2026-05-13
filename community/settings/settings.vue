<template>
  <view class="container">
    <u-navbar title="设置参数" :autoBack="true" :placeholder="true" :statusBar="true">
    </u-navbar>

    <!-- 标签页 -->
    <view class="tab-container">
      <view class="tab-list">
        <view v-for="(item, index) in tabs" :key="index" class="tab-item" :class="{ active: activeTab === index }"
          @click="switchTab(index)">
          <text>{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 全局操作按钮 -->
    <view class="global-actions" :class="{ editing: isEditing }">
      <view v-if="!isEditing" class="edit-btn primary" @click="handleEditConfig">
        <uni-icons type="compose" size="18" color="#fff"></uni-icons>
        <text class="edit-text">修改配置</text>
      </view>
      <view v-else class="action-btns">
        <view class="edit-btn cancel" @click="cancelEdit">
          <uni-icons type="close" size="18" color="#666"></uni-icons>
          <text class="edit-text">取消</text>
        </view>
        <view class="edit-btn confirm" @click="handleEditConfig">
          <uni-icons type="checkmark" size="18" color="#fff"></uni-icons>
          <text class="edit-text">保存</text>
        </view>
      </view>
    </view>

    <!-- 网侧PCS -->
    <view v-if="activeTab === 0" class="tab-content">
      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">本地/远程设置</text>
        <view class="control-buttons">
          <view class="control-btn" :class="[controlMode === 'local' ? 'active' : '', { disabled: !isEditing }]"
            @click="isEditing && setControlMode('local')">本地
          </view>
          <view class="control-btn" :class="[controlMode === 'remote' ? 'active' : '', { disabled: !isEditing }]"
            @click="isEditing && setControlMode('remote')">
            远程</view>
        </view>
      </view>

      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">并网网设置</text>
        <view class="control-buttons">
          <view class="control-btn" :class="[gridMode === 'grid' ? 'active' : '', { disabled: !isEditing }]"
            @click="isEditing && setGridMode('grid')">并网</view>
          <view class="control-btn" :class="[gridMode === 'offGrid' ? 'active' : '', { disabled: !isEditing }]"
            @click="isEditing && setGridMode('offGrid')">离网
          </view>
        </view>
      </view>

      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">故障复位</text>
        <view class="action-buttons">
          <view class="action-btn" :class="{ disabled: !isEditing }" @click="isEditing && resetSystem">复位</view>
        </view>
      </view>

      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">设备启动</text>
        <view class="action-buttons">
          <view class="action-btn" :class="{ disabled: !isEditing }" @click="isEditing && startDevice">启动</view>
        </view>
      </view>

      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">设备停机</text>
        <view class="action-buttons">
          <view class="action-btn" :class="{ disabled: !isEditing }" @click="isEditing && stopDevice">停机</view>
        </view>
      </view>

      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">运行模式</text>
        <view class="control-buttons">
          <view class="control-btn" :class="[runMode === 'constantVoltage' ? 'active' : '', { disabled: !isEditing }]"
            @click="isEditing && setRunMode('constantVoltage')">恒压</view>
        </view>
      </view>

      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">参数设置</text>
        <view class="param-item">
          <text class="param-label">设置模块工作海拔值</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B0 || "--" }}</text><input v-else type="number" v-model="params.pcs.B0" placeholder="请输入" />
            <text class="param-unit">m</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置模块地址分配方式</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B8 || "--" }}</text><input v-else type="number" v-model="params.pcs.B8" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置离网模式交流侧欠压复位</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B12 || "--" }}</text><input v-else type="number" v-model="params.pcs.B12" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置整流模式直流侧欠压复位</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B16 || "--" }}</text><input v-else type="number" v-model="params.pcs.B16" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置模块工作模式</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B20 || "--" }}</text><input v-else type="number" v-model="params.pcs.B20" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置模块开关机</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B24 || "--" }}</text><input v-else type="number" v-model="params.pcs.B24" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置模块直流侧过压复位</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B28 || "--" }}</text><input v-else type="number" v-model="params.pcs.B28" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置模块短路复位</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B32 || "--" }}</text><input v-else type="number" v-model="params.pcs.B32" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置直流侧电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B36 || "--" }}</text><input v-else type="number" v-model="params.pcs.B36" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置直流侧电流</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B40 || "--" }}</text><input v-else type="number" v-model="params.pcs.B40" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置交流侧总有功功率</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B44 || "--" }}</text><input v-else type="number" v-model="params.pcs.B44" placeholder="请输入" />
            <text class="param-unit">kW</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置交流侧总无功功率</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B48 || "--" }}</text><input v-else type="number" v-model="params.pcs.B48" placeholder="请输入" />
            <text class="param-unit">kVar</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置交流侧功率因素PF</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B52 || "--" }}</text><input v-else type="number" v-model="params.pcs.B52" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置交流侧无功功率类型</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B56 || "--" }}</text><input v-else type="number" v-model="params.pcs.B56" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置交流相电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B60 || "--" }}</text><input v-else type="number" v-model="params.pcs.B60" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置交流频率</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B62 || "--" }}</text><input v-else type="number" v-model="params.pcs.B62" placeholder="请输入" />
            <text class="param-unit">Hz</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置是否错相</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B64 || "--" }}</text><input v-else type="number" v-model="params.pcs.B64" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置直流欠压保护电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B68 || "--" }}</text><input v-else type="number" v-model="params.pcs.B68" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置直流过压保护电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B72 || "--" }}</text><input v-else type="number" v-model="params.pcs.B72" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置一级交流欠压保护线电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B76 || "--" }}</text><input v-else type="number" v-model="params.pcs.B76" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置一级交流欠压保护时间</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B78 || "--" }}</text><input v-else type="number" v-model="params.pcs.B78" placeholder="请输入" />
            <text class="param-unit">s</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置一级交流过压保护线电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B80 || "--" }}</text><input v-else type="number" v-model="params.pcs.B80" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置一级交流过压保护时间</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B82 || "--" }}</text><input v-else type="number" v-model="params.pcs.B82" placeholder="请输入" />
            <text class="param-unit">s</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置一级交流欠频保护频率</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B84 || "--" }}</text><input v-else type="number" v-model="params.pcs.B84" placeholder="请输入" />
            <text class="param-unit">Hz</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置一级交流欠频保护时间</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B86 || "--" }}</text><input v-else type="number" v-model="params.pcs.B86" placeholder="请输入" />
            <text class="param-unit">s</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置一级交流过频保护频率</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B88 || "--" }}</text><input v-else type="number" v-model="params.pcs.B88" placeholder="请输入" />
            <text class="param-unit">Hz</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置一级交流过频保护时间</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B90 || "--" }}</text><input v-else type="number" v-model="params.pcs.B90" placeholder="请输入" />
            <text class="param-unit">s</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置二级交流过频保护频率</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B96 || "--" }}</text><input v-else type="number" v-model="params.pcs.B96" placeholder="请输入" />
            <text class="param-unit">Hz</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置二级交流过频保护时间</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B98 || "--" }}</text><input v-else type="number" v-model="params.pcs.B98" placeholder="请输入" />
            <text class="param-unit">s</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置是否过载输出</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B100 || "--" }}</text><input v-else type="number" v-model="params.pcs.B100" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置二级交流欠压保护线电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B104 || "--" }}</text><input v-else type="number" v-model="params.pcs.B104" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置二级交流欠压保护线时间</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B106 || "--" }}</text><input v-else type="number" v-model="params.pcs.B106" placeholder="请输入" />
            <text class="param-unit">s</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置二级交流过压保护线电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B108 || "--" }}</text><input v-else type="number" v-model="params.pcs.B108" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置二级交流过压保护线时间</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B110 || "--" }}</text><input v-else type="number" v-model="params.pcs.B110" placeholder="请输入" />
            <text class="param-unit">s</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">设置是否使能输入电压环</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pcs.B112 || "--" }}</text><input v-else type="number" v-model="params.pcs.B112" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
      </view>

      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">故障复位(BMS)</text>
        <view class="action-buttons">
          <view class="action-btn" :class="{ disabled: !isEditing }" @click="isEditing && resetBms">复位</view>
        </view>
      </view>

      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">负载DC复位</text>
        <view class="action-buttons">
          <view class="action-btn" :class="{ disabled: !isEditing }" @click="isEditing && resetLoad">复位</view>
        </view>
      </view>
    </view>

    <!-- 储能DC/DC -->
    <view v-if="activeTab === 1" class="tab-content">
      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">储能DC/DC1</text>
        <view class="param-item">
          <text class="param-label">Can波特率设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B0 || "--" }}</text><input v-else type="number" v-model="params.storage.B0" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">认证标准码</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B2 || "--" }}</text><input v-else type="number" v-model="params.storage.B2" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">故障清除</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B4 || "--" }}</text><input v-else type="number" v-model="params.storage.B4" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">运行状态设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B6 || "--" }}</text><input v-else type="number" v-model="params.storage.B6" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">系统开关机</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B8 || "--" }}</text><input v-else type="number" v-model="params.storage.B8" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">恢复出厂设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B10 || "--" }}</text><input v-else type="number" v-model="params.storage.B10" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">组ID号</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B12 || "--" }}</text><input v-else type="number" v-model="params.storage.B12" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块数量</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B14 || "--" }}</text><input v-else type="number" v-model="params.storage.B14" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池类型</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B16 || "--" }}</text><input v-else type="number" v-model="params.storage.B16" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">直流母线电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B18 || "--" }}</text><input v-else type="number" v-model="params.storage.B18" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">充放电指令</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B20 || "--" }}</text><input v-else type="number" v-model="params.storage.B20" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">充放电功率设定</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B22 || "--" }}</text><input v-else type="number" v-model="params.storage.B22" placeholder="请输入" />
            <text class="param-unit">kW</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池均充电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B24 || "--" }}</text><input v-else type="number" v-model="params.storage.B24" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">充电电流设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B26 || "--" }}</text><input v-else type="number" v-model="params.storage.B26" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池浮充电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B28 || "--" }}</text><input v-else type="number" v-model="params.storage.B28" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">放电电压设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B30 || "--" }}</text><input v-else type="number" v-model="params.storage.B30" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">放电电流设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B32 || "--" }}</text><input v-else type="number" v-model="params.storage.B32" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池过压关机点</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B34 || "--" }}</text><input v-else type="number" v-model="params.storage.B34" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池低压告警点</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B36 || "--" }}</text><input v-else type="number" v-model="params.storage.B36" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池低压关机点</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B38 || "--" }}</text><input v-else type="number" v-model="params.storage.B38" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池激活功能</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B40 || "--" }}</text><input v-else type="number" v-model="params.storage.B40" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">自动重启功能</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B42 || "--" }}</text><input v-else type="number" v-model="params.storage.B42" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">充电母线电压上限</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B44 || "--" }}</text><input v-else type="number" v-model="params.storage.B44" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">放电母线电压下限</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B46 || "--" }}</text><input v-else type="number" v-model="params.storage.B46" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">告警屏蔽码1</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage.B48 || "--" }}</text><input v-else type="number" v-model="params.storage.B48" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
      </view>

      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">储能DC/DC2</text>
        <view class="param-item">
          <text class="param-label">Can波特率设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B0 || "--" }}</text><input v-else type="number" v-model="params.storage2.B0" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">认证标准码</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B2 || "--" }}</text><input v-else type="number" v-model="params.storage2.B2" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">故障清除</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B4 || "--" }}</text><input v-else type="number" v-model="params.storage2.B4" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">运行状态设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B6 || "--" }}</text><input v-else type="number" v-model="params.storage2.B6" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">系统开关机</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B8 || "--" }}</text><input v-else type="number" v-model="params.storage2.B8" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">恢复出厂设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B10 || "--" }}</text><input v-else type="number" v-model="params.storage2.B10" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">组ID号</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B12 || "--" }}</text><input v-else type="number" v-model="params.storage2.B12" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块数量</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B14 || "--" }}</text><input v-else type="number" v-model="params.storage2.B14" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池类型</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B16 || "--" }}</text><input v-else type="number" v-model="params.storage2.B16" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">直流母线电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B18 || "--" }}</text><input v-else type="number" v-model="params.storage2.B18" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">充放电指令</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B20 || "--" }}</text><input v-else type="number" v-model="params.storage2.B20" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">充放电功率设定</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B22 || "--" }}</text><input v-else type="number" v-model="params.storage2.B22" placeholder="请输入" />
            <text class="param-unit">kW</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池均充电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B24 || "--" }}</text><input v-else type="number" v-model="params.storage2.B24" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">充电电流设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B26 || "--" }}</text><input v-else type="number" v-model="params.storage2.B26" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池浮充电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B28 || "--" }}</text><input v-else type="number" v-model="params.storage2.B28" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">放电电压设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B30 || "--" }}</text><input v-else type="number" v-model="params.storage2.B30" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">放电电流设置</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B32 || "--" }}</text><input v-else type="number" v-model="params.storage2.B32" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池过压关机点</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B34 || "--" }}</text><input v-else type="number" v-model="params.storage2.B34" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池低压告警点</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B36 || "--" }}</text><input v-else type="number" v-model="params.storage2.B36" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池低压关机点</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B38 || "--" }}</text><input v-else type="number" v-model="params.storage2.B38" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">电池激活功能</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B40 || "--" }}</text><input v-else type="number" v-model="params.storage2.B40" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">自动重启功能</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B42 || "--" }}</text><input v-else type="number" v-model="params.storage2.B42" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">充电母线电压上限</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B44 || "--" }}</text><input v-else type="number" v-model="params.storage2.B44" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">放电母线电压下限</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B46 || "--" }}</text><input v-else type="number" v-model="params.storage2.B46" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">告警屏蔽码1</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.storage2.B48 || "--" }}</text><input v-else type="number" v-model="params.storage2.B48" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 光伏DC/DC -->
    <view v-if="activeTab === 2" class="tab-content">
      <view class="control-section" :class="{ editing: isEditing }">
        <text class="section-title">光伏DC/DC</text>
        <view class="param-item">
          <text class="param-label">模块电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B0 || "--" }}</text><input v-else type="number" v-model="params.pv.B0" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块电流</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B4 || "--" }}</text><input v-else type="number" v-model="params.pv.B4" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块限流点</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B8 || "--" }}</text><input v-else type="number" v-model="params.pv.B8" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块DC板温度</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B12 || "--" }}</text><input v-else type="number" v-model="params.pv.B12" placeholder="请输入" />
            <text class="param-unit">℃</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块输入相电压（直流输入电压）</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B16 || "--" }}</text><input v-else type="number" v-model="params.pv.B16" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块PFC0电压（正半母线）</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B20 || "--" }}</text><input v-else type="number" v-model="params.pv.B20" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块PFC1电压（负半母线）</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B24 || "--" }}</text><input v-else type="number" v-model="params.pv.B24" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块面板（环境）温度</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B28 || "--" }}</text><input v-else type="number" v-model="params.pv.B28" placeholder="请输入" />
            <text class="param-unit">℃</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块交流A相电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B32 || "--" }}</text><input v-else type="number" v-model="params.pv.B32" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块交流B相电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B36 || "--" }}</text><input v-else type="number" v-model="params.pv.B36" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块交流C相电压</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B40 || "--" }}</text><input v-else type="number" v-model="params.pv.B40" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块PFC板温度</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B44 || "--" }}</text><input v-else type="number" v-model="params.pv.B44" placeholder="请输入" />
            <text class="param-unit">℃</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块额定输出功率</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B48 || "--" }}</text><input v-else type="number" v-model="params.pv.B48" placeholder="请输入" />
            <text class="param-unit">kW</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">模块额定输出电流</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B52 || "--" }}</text><input v-else type="number" v-model="params.pv.B52" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">读取当前告警/状态</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B56 || "--" }}</text><input v-else type="number" v-model="params.pv.B56" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">读取组号和拨码地址</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B60 || "--" }}</text><input v-else type="number" v-model="params.pv.B60" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">读取输入功率</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B64 || "--" }}</text><input v-else type="number" v-model="params.pv.B64" placeholder="请输入" />
            <text class="param-unit">kW</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">读取当前设定的海拔值</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B68 || "--" }}</text><input v-else type="number" v-model="params.pv.B68" placeholder="请输入" />
            <text class="param-unit">m</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">读取当前模块输入工作模式</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B72 || "--" }}</text><input v-else type="number" v-model="params.pv.B72" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">读节点SearialNo号低位（ID号）</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B76 || "--" }}</text><input v-else type="number" v-model="params.pv.B76" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">读节点SearialNo号高位</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B80 || "--" }}</text><input v-else type="number" v-model="params.pv.B80" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">读DCDC版本号</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B84 || "--" }}</text><input v-else type="number" v-model="params.pv.B84" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">读PFC版本号</text>
          <view class="param-input" :class="{ active: isEditing }">
            <text v-if="!isEditing" class="param-value">{{ params.pv.B88 || "--" }}</text><input v-else type="number" v-model="params.pv.B88" placeholder="请输入" />
            <text class="param-unit"></text>
          </view>
        </view>
      </view>
    </view>


  </view>
</template>

<script>
export default {
  name: "SettingParams",
  data() {
    return {
      activeTab: 0,
      tabs: ['网侧PCS', '储能DC/DC', '光伏DC/DC'],
      isEditing: false,
      controlMode: 'local',
      gridMode: 'grid',
      runMode: 'constantVoltage',
      storageRunMode: 'offGrid',
      storageRunMode2: 'offGrid',
      coolingPower: 'off',
      coolingMode: 'cool',
      originalParams: {},
      params: {
        pcs: {
          constantVoltage: '',
          constantCurrent: '',
          gridPower: '',
          gridVoltage: ''
        },
        storage: {
          busVoltage: '',
          stopCurrent: '',
          busVoltage2: '',
          stopCurrent2: ''
        },
        cooling: {
          busVoltage: ''
        }
      }
    }
  },
  methods: {
    handleEditConfig() {
      if (this.isEditing) {
        // 退出编辑模式，保存修改
        this.saveConfig()
      } else {
        // 进入编辑模式，保存原始数据
        this.enterEditMode()
      }
    },

    enterEditMode() {
      // 保存当前参数的副本，用于取消时恢复
      this.originalParams = JSON.parse(JSON.stringify({
        controlMode: this.controlMode,
        gridMode: this.gridMode,
        runMode: this.runMode,
        storageRunMode: this.storageRunMode,
        storageRunMode2: this.storageRunMode2,
        coolingPower: this.coolingPower,
        coolingMode: this.coolingMode,
        params: this.params
      }))
      this.isEditing = true
      uni.showToast({ title: '已进入编辑模式', icon: 'none' })
    },

    saveConfig() {
      uni.showModal({
        title: '确认保存',
        content: '确定要保存当前配置吗？',
        confirmColor: '#4488FB',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '保存中...' })
            try {
              // 收集所有配置参数
              const configData = {
                activeTab: this.activeTab,
                controlMode: this.controlMode,
                gridMode: this.gridMode,
                runMode: this.runMode,
                storageRunMode: this.storageRunMode,
                storageRunMode2: this.storageRunMode2,
                coolingPower: this.coolingPower,
                coolingMode: this.coolingMode,
                params: this.params
              }

              // 模拟API调用
              await new Promise(resolve => setTimeout(resolve, 1500))

              uni.hideLoading()
              this.isEditing = false
              uni.showToast({ title: '保存成功', icon: 'success' })
            } catch (error) {
              uni.hideLoading()
              uni.showToast({ title: '保存失败', icon: 'none' })
            }
          }
        }
      })
    },

    cancelEdit() {
      if (!this.isEditing) return

      uni.showModal({
        title: '确认取消',
        content: '确定要放弃修改吗？',
        confirmColor: '#4488FB',
        success: (res) => {
          if (res.confirm) {
            // 恢复原始参数
            Object.assign(this, this.originalParams)
            this.isEditing = false
            uni.showToast({ title: '已取消修改', icon: 'none' })
          }
        }
      })
    },
    switchTab(index) {
      this.activeTab = index
    },
    setControlMode(mode) {
      this.controlMode = mode
    },
    setGridMode(mode) {
      this.gridMode = mode
    },
    setRunMode(mode) {
      this.runMode = mode
    },
    setStorageRunMode(mode) {
      this.storageRunMode = mode
    },
    setStorageRunMode2(mode) {
      this.storageRunMode2 = mode
    },
    setCoolingPower(power) {
      this.coolingPower = power
    },
    setCoolingMode(mode) {
      this.coolingMode = mode
    },
    resetSystem() {
      uni.showModal({ title: '系统复位', content: '确定复位系统？', success: (res) => res.confirm && uni.showToast({ title: '复位成功', icon: 'success' }) })
    },
    startDevice() {
      uni.showModal({ title: '设备启动', content: '确定启动设备？', success: (res) => res.confirm && uni.showToast({ title: '启动成功', icon: 'success' }) })
    },
    stopDevice() {
      uni.showModal({ title: '设备停机', content: '确定停机设备？', success: (res) => res.confirm && uni.showToast({ title: '停机成功', icon: 'success' }) })
    },
    resetBms() {
      uni.showModal({ title: 'BMS复位', content: '确定复位BMS？', success: (res) => res.confirm && uni.showToast({ title: 'BMS复位成功', icon: 'success' }) })
    },
    resetLoad() {
      uni.showModal({ title: '负载复位', content: '确定复位负载？', success: (res) => res.confirm && uni.showToast({ title: '负载复位成功', icon: 'success' }) })
    },
    resetStorageDc() { uni.showToast({ title: '储能DC/DC复位', icon: 'none' }) },
    startStorageDc() { uni.showToast({ title: 'BUS侧恒压启动', icon: 'none' }) },
    startStorage() { uni.showToast({ title: '储能启动', icon: 'none' }) },
    stopStorage() { uni.showToast({ title: '储能停机', icon: 'none' }) },
    resetStorage() { uni.showToast({ title: '储能复位', icon: 'none' }) },
    resetStorageDc2() { uni.showToast({ title: '储能DC/DC2复位', icon: 'none' }) },
    startStorageDc2() { uni.showToast({ title: 'BUS侧恒压2启动', icon: 'none' }) },
    startStorage2() { uni.showToast({ title: '储能2启动', icon: 'none' }) },
    stopStorage2() { uni.showToast({ title: '储能2停机', icon: 'none' }) },
    resetStorage2() { uni.showToast({ title: '储能2复位', icon: 'none' }) }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #F5F7FA;
  padding-bottom: 40rpx;
}

.tab-container {
  background: #fff;
  margin: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.tab-list {
  display: flex;
  background: #FAFBFC;
}

.tab-item {
  flex: 1;
  padding: 28rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #909399;
  position: relative;
  transition: all 0.3s ease;
}

.tab-item.active {
  color: #4488FB;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 48rpx;
  height: 4rpx;
  background: #4488FB;
  border-radius: 4rpx;
}

.tab-content {
  padding: 0 24rpx 24rpx;
}

.global-actions {
  padding: 0 24rpx 24rpx;
  display: flex;
  justify-content: flex-end;

  &.editing {
    padding: 16rpx 24rpx;
    background: transparent;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
}

.action-btns {
  display: flex;
  gap: 16rpx;
  justify-content: flex-end;
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  transition: all 0.3s ease;

  &.primary {
    background: #4488FB;

    .edit-text {
      color: #fff;
      font-weight: 500;
    }
  }

  &.cancel {
    background: #fff;
    border: 2rpx solid #DCDFE6;

    .edit-text {
      color: #666;
    }
  }

  &.confirm {
    background: #4488FB;

    .edit-text {
      color: #fff;
      font-weight: 500;
    }
  }

  .edit-text {
    font-size: 24rpx;
  }
}

.control-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
}

.control-section.editing {
  border: 2rpx solid #4488FB;
  box-shadow: 0 4rpx 16rpx rgba(68, 136, 251, 0.12);
}

.section-title {
  font-size: 28rpx;
  color: #303133;
  font-weight: 600;
  margin-bottom: 20rpx;
  display: block;
  padding-left: 12rpx;
  border-left: 4rpx solid #4488FB;
}

.control-section.editing .section-title {
  color: #4488FB;
}

.tip {
  font-size: 24rpx;
  color: #909399;
}

.control-buttons {
  display: flex;
  gap: 16rpx;
}

.control-btn {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  border-radius: 10rpx;
  font-size: 26rpx;
  background: #EEF3FA;
  color: #3055A0;
  transition: all 0.3s ease;
  font-weight: 500;
}

.control-btn.active {
  background: #4488FB;
  color: #fff;
  font-weight: 600;
}

.control-btn.disabled {
  background: #E8ECF0;
  color: #A0A8B2;
}

.action-buttons {
  margin-bottom: 16rpx;
}

.action-btn {
  width: 100%;
  padding: 20rpx;
  text-align: center;
  border-radius: 10rpx;
  font-size: 26rpx;
  background: #EEF3FA;
  color: #3055A0;
  transition: all 0.3s ease;
  font-weight: 500;
}

.action-btn.disabled {
  background: #E8ECF0;
  color: #A0A8B2;
}

.param-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F0F0F0;

  &:last-child {
    border-bottom: none;
  }
}

.param-label {
  font-size: 26rpx;
  color: #3D5A80;
  flex-shrink: 0;
  font-weight: 500;
}

.param-input {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 60rpx;
  padding: 0;
  background: transparent;

  input {
    width: 100%;
    height: 60rpx;
    font-size: 26rpx;
    color: #303133;
    text-align: right;
    background: transparent;
    border: none;
  }
}

.param-input.active {
  padding: 0 16rpx;
  background: #fff;
  border: 2rpx solid #4488FB;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(68, 136, 251, 0.15);

  input {
    text-align: left;
    color: #303133;
  }
}

.param-unit {
  font-size: 24rpx;
  color: #909399;
  margin-left: 8rpx;
  flex-shrink: 0;
}

.empty-tip {
  font-size: 28rpx;
  color: #909399;
  text-align: center;
  padding: 60rpx 0;
}
</style>