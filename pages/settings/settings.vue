<template>
  <view class="container">
    <u-navbar title="设置参数" :autoBack="true" :placeholder="true">
      <view slot="right" @click="handleEditConfig" class="edit-btn">
        <uni-icons type="compose" size="18" color="#4488FB"></uni-icons>
        <text class="edit-text">修改配置</text>
      </view>
    </u-navbar>

    <!-- 标签页 -->
    <view class="tab-container">
      <scroll-view scroll-x="true" class="tab-scroll">
        <view class="tab-list">
          <view v-for="(item, index) in tabs" :key="index" class="tab-item" :class="{ active: activeTab === index }"
            @click="switchTab(index)">
            <text>{{ item }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 网侧PCS -->
    <view v-if="activeTab === 0" class="tab-content">
      <view class="control-section">
        <text class="section-title">本地/远程设置</text>
        <view class="control-buttons">
          <view class="control-btn" :class="controlMode === 'local' ? 'active' : ''" @click="setControlMode('local')">本地</view>
          <view class="control-btn" :class="controlMode === 'remote' ? 'active' : ''" @click="setControlMode('remote')">远程</view>
        </view>
      </view>

      <view class="control-section">
        <text class="section-title">并网网设置</text>
        <view class="control-buttons">
          <view class="control-btn" :class="gridMode === 'grid' ? 'active' : ''" @click="setGridMode('grid')">并网</view>
          <view class="control-btn" :class="gridMode === 'offGrid' ? 'active' : ''" @click="setGridMode('offGrid')">离网</view>
        </view>
      </view>

      <view class="control-section">
        <text class="section-title">故障复位</text>
        <view class="action-buttons">
          <view class="action-btn" @click="resetSystem">复位</view>
        </view>
      </view>

      <view class="control-section">
        <text class="section-title">设备启动</text>
        <view class="action-buttons">
          <view class="action-btn" @click="startDevice">启动</view>
        </view>
      </view>

      <view class="control-section">
        <text class="section-title">设备停机</text>
        <view class="action-buttons">
          <view class="action-btn" @click="stopDevice">停机</view>
        </view>
      </view>

      <view class="control-section">
        <text class="section-title">运行模式</text>
        <view class="control-buttons">
          <view class="control-btn" :class="runMode === 'constantVoltage' ? 'active' : ''" @click="setRunMode('constantVoltage')">恒压</view>
        </view>
      </view>

      <view class="control-section">
        <text class="section-title">参数设置</text>
        <view class="param-item">
          <text class="param-label">恒压充电电压设定值</text>
          <view class="param-input">
            <input type="number" v-model="params.pcs.constantVoltage" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">恒流充电电流设定值</text>
          <view class="param-input">
            <input type="number" v-model="params.pcs.constantCurrent" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">离网输出功率设定值</text>
          <view class="param-input">
            <input type="number" v-model="params.pcs.gridPower" placeholder="请输入" />
            <text class="param-unit">Hz</text>
          </view>
        </view>
        <view class="param-item">
          <text class="param-label">离网输出电压设定值</text>
          <view class="param-input">
            <input type="number" v-model="params.pcs.gridVoltage" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
      </view>

      <view class="control-section">
        <text class="section-title">故障复位(BMS)</text>
        <view class="action-buttons">
          <view class="action-btn" @click="resetBms">复位</view>
        </view>
      </view>

      <view class="control-section">
        <text class="section-title">负载DC复位</text>
        <view class="action-buttons">
          <view class="action-btn" @click="resetLoad">复位</view>
        </view>
      </view>
    </view>

    <!-- 储能DC/DC -->
    <view v-if="activeTab === 1" class="tab-content">
      <view class="control-section">
        <text class="section-title">储能DC/DC1</text>
        <view class="param-item">
          <text class="param-label">BUS侧电压给定</text>
          <view class="param-input">
            <input type="number" v-model="params.storage.busVoltage" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="action-buttons">
          <view class="action-btn" @click="resetStorageDc">双向DC/DC</view>
        </view>
        <view class="action-buttons">
          <view class="action-btn" @click="startStorageDc">BUS侧恒压</view>
        </view>
        <view class="param-item">
          <text class="param-label">设备停机</text>
          <view class="param-input">
            <input type="number" v-model="params.storage.stopCurrent" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="control-buttons">
          <view class="control-btn" :class="storageRunMode === 'grid' ? 'active' : ''" @click="setStorageRunMode('grid')">并网</view>
          <view class="control-btn" :class="storageRunMode === 'offGrid' ? 'active' : ''" @click="setStorageRunMode('offGrid')">离网</view>
        </view>
        <view class="action-buttons" style="flex-direction: row; gap: 20rpx;">
          <view class="action-btn primary" @click="startStorage">启动</view>
          <view class="action-btn secondary" @click="stopStorage">停机</view>
          <view class="action-btn secondary" @click="resetStorage">复位</view>
        </view>
      </view>

      <view class="control-section">
        <text class="section-title">储能DC/DC1</text>
        <view class="param-item">
          <text class="param-label">BUS侧电压给定</text>
          <view class="param-input">
            <input type="number" v-model="params.storage.busVoltage2" placeholder="请输入" />
            <text class="param-unit">V</text>
          </view>
        </view>
        <view class="action-buttons">
          <view class="action-btn" @click="resetStorageDc2">双向DC/DC</view>
        </view>
        <view class="action-buttons">
          <view class="action-btn" @click="startStorageDc2">BUS侧恒压</view>
        </view>
        <view class="param-item">
          <text class="param-label">设备停机</text>
          <view class="param-input">
            <input type="number" v-model="params.storage.stopCurrent2" placeholder="请输入" />
            <text class="param-unit">A</text>
          </view>
        </view>
        <view class="control-buttons">
          <view class="control-btn" :class="storageRunMode2 === 'grid' ? 'active' : ''" @click="setStorageRunMode2('grid')">并网</view>
          <view class="control-btn" :class="storageRunMode2 === 'offGrid' ? 'active' : ''" @click="setStorageRunMode2('offGrid')">离网</view>
        </view>
        <view class="action-buttons" style="flex-direction: row; gap: 20rpx;">
          <view class="action-btn primary" @click="startStorage2">启动</view>
          <view class="action-btn secondary" @click="stopStorage2">停机</view>
          <view class="action-btn secondary" @click="resetStorage2">复位</view>
        </view>
      </view>
    </view>

    <!-- 光伏DC/DC -->
    <view v-if="activeTab === 2" class="tab-content">
      <view class="control-section">
        <text class="section-title">光伏DC/DC</text>
        <view class="empty-tip">暂无配置项</view>
      </view>
    </view>

    <!-- 液冷 -->
    <view v-if="activeTab === 3" class="tab-content">
      <view class="control-section">
        <text class="section-title">开关机</text>
        <view class="control-buttons">
          <view class="control-btn" :class="coolingPower === 'on' ? 'active' : ''" @click="setCoolingPower('on')">开机</view>
          <view class="control-btn" :class="coolingPower === 'off' ? 'active' : ''" @click="setCoolingPower('off')">关机</view>
        </view>
      </view>

      <view class="control-section">
        <text class="section-title">液冷工作模式<br/><text class="tip">(关机方可设置)</text></text>
        <view class="control-buttons" style="flex-wrap: wrap;">
          <view class="control-btn" :class="coolingMode === 'auto' ? 'active' : ''" @click="setCoolingMode('auto')">自动模式</view>
          <view class="control-btn" :class="coolingMode === 'cool' ? 'active' : ''" @click="setCoolingMode('cool')">制冷模式</view>
          <view class="control-btn" :class="coolingMode === 'heat' ? 'active' : ''" @click="setCoolingMode('heat')">制热模式</view>
          <view class="control-btn" :class="coolingMode === 'cycle' ? 'active' : ''" @click="setCoolingMode('cycle')">自循环模式</view>
          <view class="control-btn" :class="coolingMode === 'standby' ? 'active' : ''" @click="setCoolingMode('standby')">待机</view>
        </view>
      </view>

      <view class="control-section">
        <text class="section-title">BUS侧电压给定</text>
        <view class="param-input">
          <input type="number" v-model="params.cooling.busVoltage" placeholder="请输入" />
          <text class="param-unit">V</text>
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
      tabs: ['网侧PCS', '储能DC/DC', '光伏DC/DC', '液冷'],
      controlMode: 'local',
      gridMode: 'grid',
      runMode: 'constantVoltage',
      storageRunMode: 'offGrid',
      storageRunMode2: 'offGrid',
      coolingPower: 'off',
      coolingMode: 'cool',
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
      uni.showToast({ title: '进入编辑模式', icon: 'none' })
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
  background: #EFF4FB;
}
.edit-btn {
  display: flex;
  align-items: center;
  margin-right: 20rpx;
}
.edit-text {
  font-size: 28rpx;
  color: #4488FB;
  margin-left: 8rpx;
}
.tab-container {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}
.tab-scroll {
  white-space: nowrap;
}
.tab-list {
  display: flex;
}
.tab-item {
  padding: 20rpx 30rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  position: relative;
}
.tab-item.active {
  color: #4488FB;
  font-weight: 500;
}
.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 30rpx;
  right: 30rpx;
  height: 4rpx;
  background: #4488FB;
  border-radius: 2rpx;
}
.tab-content {
  padding: 0 20rpx 20rpx;
}
.control-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}
.tip {
  font-size: 24rpx;
  color: #999;
}
.control-buttons {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}
.control-btn {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: #F5F7FA;
  color: #333;
}
.control-btn.active {
  background: #4488FB;
  color: #fff;
}
.action-buttons {
  margin-bottom: 20rpx;
}
.action-btn {
  width: 100%;
  padding: 20rpx;
  text-align: center;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: #F5F7FA;
  color: #333;
}
.action-btn.primary {
  background: #4488FB;
  color: #fff;
}
.action-btn.secondary {
  background: #F5F7FA;
  color: #333;
}
.param-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.param-label {
  font-size: 28rpx;
  color: #333;
  width: 340rpx;
}
.param-input {
  flex: 1;
  height: 70rpx;
  display: flex;
  align-items: center;
  border-radius: 12rpx;
  border: 1rpx solid #E5E6EB;
  padding: 0 20rpx;
  background: #fff;
}
.param-input input {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
  color: #333;
}
.param-unit {
  font-size: 28rpx;
  color: #666;
  margin-left: 10rpx;
}
.empty-tip {
  font-size: 28rpx;
  color: #999;
  text-align: center;
  padding: 40rpx 0;
}
</style>