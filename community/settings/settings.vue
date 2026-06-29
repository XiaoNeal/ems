<template>
  <view class="container">
    <u-navbar title="设置参数" :autoBack="true" :placeholder="true" :statusBar="true">
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

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y="true">
      <view class="content">
        <!-- 网侧 PCS -->
        <view v-if="activeTab === 0" class="tab-content">
          <PcsSettings />
        </view>

        <!-- 储能 DC/DC -->
        <view v-if="activeTab === 1" class="tab-content">
          <StorageSettings />
        </view>

        <!-- 光伏 DC/DC -->
        <view v-if="activeTab === 2" class="tab-content">
          <PvSettings />
        </view>

        <!-- BMS -->
        <view v-if="activeTab === 3" class="tab-content">
          <BmsSettings />
        </view>
      </view>
    </scroll-view>
  </view>

</template>
<script>
import PcsSettings from './components/PcsSettings.vue'
import StorageSettings from './components/StorageSettings.vue'
import PvSettings from './components/PvSettings.vue'
import BmsSettings from './components/BmsSettings.vue'

export default {
  name: "SettingParams",
  components: {
    PcsSettings,
    StorageSettings,
    PvSettings,
    BmsSettings
  },
  data() {
    return {
      activeTab: 0,
      tabs: ['PCS', '储能DC', '光伏', 'BMS'],
      isEditing: false,
      editingParam: '',
      originalParams: {},
      params: {}
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

    checkEditMode() {
      if (!this.isEditing) {
        uni.showToast({ title: '请先点击修改配置', icon: 'none' })
        return false
      }
      return true
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

    saveEdit() {
      if (!this.isEditing) return
      this.saveConfig()
    },

    closeEdit() {
      this.isEditing = false
      // 恢复原始参数
      Object.assign(this, this.originalParams)
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
    startEdit(paramKey) {
      if (!this.isEditing) {
        this.enterEditMode()
      }
      this.editingParam = paramKey
    },
    cancelParamEdit() {
      this.editingParam = ''
    },
    switchTab(index) {
      this.activeTab = index
    },

  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  background-color: #f2f2f2;
  font-size: 28rpx;
}

.tab-container {
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: flex;
  padding: 0 20rpx;
  justify-content: space-around;
}

.tab-item {
  padding: 20rpx 60rpx;
  border-bottom: 3px solid transparent;
  flex-shrink: 0;
}

.tab-item.active {
  border-bottom: 3px solid #007aff;
}

.tab-item.active text {
  color: #007aff;
  font-weight: bold;
}

.content-scroll {
  height: calc(100vh - 140rpx);
  background-color: #EFF4FB;
}

.content {
  padding: 20rpx;
}

.global-actions {
  padding: 16rpx 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.editing {
    padding: 16rpx 24rpx;
    background: transparent;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
}

.page-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1F2937;
  background: linear-gradient(135deg, #4488FB 0%, #36B37E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  gap: 8rpx;
  padding: 16rpx 32rpx;
  border-radius: 10rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 26rpx;
  font-weight: 500;

  &.primary {
    background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
    color: #fff;
    box-shadow: 0 4rpx 16rpx rgba(68, 136, 251, 0.3);

    &:active {
      transform: scale(0.95);
      box-shadow: 0 2rpx 8rpx rgba(68, 136, 251, 0.4);
    }
  }

  &.cancel {
    background: #fff;
    border: 2rpx solid #E4E7ED;
    color: #606266;

    &:active {
      background: #F5F7FA;
      transform: scale(0.95);
    }
  }

  &.confirm {
    background: linear-gradient(135deg, #36B37E 0%, #52C41A 100%);
    color: #fff;
    box-shadow: 0 4rpx 16rpx rgba(54, 179, 126, 0.3);

    &:active {
      transform: scale(0.95);
      box-shadow: 0 2rpx 8rpx rgba(54, 179, 126, 0.4);
    }
  }

  &.close {
    background: #fff;
    border: 2rpx solid #4488FB;
    color: #4488FB;

    &:active {
      background: rgba(68, 136, 251, 0.1);
      transform: scale(0.95);
    }
  }
}

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

.tip {
  font-size: 24rpx;
  color: #909399;
}

.control-buttons {
  display: flex;
  gap: 20rpx;
}

.inline-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.inline-section .section-title {
  margin-bottom: 0;
  flex-shrink: 0;
}

.inline-section .control-buttons,
.inline-section .action-buttons {
  flex-shrink: 0;
  margin-bottom: 0;
}

.inline-section .control-btn {
  padding: 20rpx 40rpx;
  flex: none;
  width: 140rpx;
}

.inline-section .action-btn {
  width: auto;
  padding: 20rpx 56rpx;
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
}

.control-btn.active {
  background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
  color: #fff;
  border-color: #4488FB;
  font-weight: 600;
  box-shadow: 0 6rpx 20rpx rgba(68, 136, 251, 0.35);

  &::before {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
}

.control-btn.disabled {
  background: #F5F7FA;
  color: #D9D9D9;
  border-color: #EFEFEF;
  cursor: not-allowed;
}

.control-btn.active.disabled {
  opacity: 0.7;
  background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
  color: #fff;
  border-color: #4488FB;
  box-shadow: 0 6rpx 20rpx rgba(68, 136, 251, 0.35);
}

.action-buttons {
  margin-bottom: 20rpx;
}

.action-btn {
  width: 100%;
  padding: 24rpx;
  text-align: center;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
  color: #fff;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  box-shadow: 0 6rpx 20rpx rgba(68, 136, 251, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 3rpx 10rpx rgba(68, 136, 251, 0.4);
  }

  &:active::before {
    left: 100%;
  }
}

.action-btn.disabled {
  background: #F5F7FA;
  color: #C0C4CC;
  border-color: #E4E7ED;
  box-shadow: none;

  &::before {
    display: none;
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
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F0F2F5;
  transition: all 0.25s ease;

  &:last-child {
    border-bottom: none;
  }

  &.inline-param {
    justify-content: space-between;
  }

  &.inline-param .control-buttons {
    flex-shrink: 0;
  }

  &.inline-param .control-btn {
    padding: 16rpx 32rpx;
    flex: none;
    min-width: 140rpx;
  }

  &.vertical {
    flex-direction: column;
    align-items: flex-start;
    gap: 16rpx;
  }

  &.vertical .control-buttons {
    width: 100%;
  }

  .control-buttons.three-btn {
    gap: 12rpx;
  }

  .control-buttons.three-btn .control-btn {
    padding: 16rpx 24rpx;
    min-width: 120rpx;
    font-size: 26rpx;
  }

  .control-buttons.four-btn {
    gap: 12rpx;
    justify-content: space-between;
  }

  .control-buttons.four-btn .control-btn {
    padding: 20rpx 12rpx;
    flex: 1;
    width: 0;
    min-width: 140rpx;
    max-width: 160rpx;
    height: 72rpx;
    font-size: 26rpx;
    border-radius: 12rpx;
    background: linear-gradient(145deg, #FFFFFF, #F5F7FA);
    border: 2rpx solid #E8ECF0;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
      color: #fff;
      border-color: #4488FB;
      box-shadow: 0 8rpx 24rpx rgba(68, 136, 251, 0.35);
      transform: translateY(-2rpx);
    }

    &.disabled {
      background: #F8FAFC;
      color: #C0C4CC;
      border-color: #E8ECF0;
      box-shadow: none;
    }

    &.active.disabled {
      background: linear-gradient(135deg, #4488FB 0%, #6B9DFF 100%);
      color: #fff;
      border-color: #4488FB;
      box-shadow: 0 8rpx 24rpx rgba(68, 136, 251, 0.35);
      transform: translateY(-2rpx);
    }
  }

  .param-label-wrap {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .param-tip {
    font-size: 24rpx;
    color: #9CA3AF;
    padding: 6rpx 16rpx;
    background: #F3F4F6;
    border-radius: 20rpx;
    min-width: fit-content
  }

  .baud-rate-section {
    padding: 24rpx;
    background: linear-gradient(145deg, #FFFFFF, #FAFBFC);
    border-radius: 20rpx;
    border: 2rpx solid #F0F2F5;
    margin-bottom: 24rpx;
  }

  .baud-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rpx;

    .btn-value {
      font-size: 28rpx;
      font-weight: 500;
      line-height: 1.2;
    }

    .btn-unit {
      font-size: 20rpx;
      opacity: 0.7;
    }
  }

  &:active {
    background: rgba(68, 136, 251, 0.03);
    border-radius: 12rpx;
    margin: 0 -8rpx;
    padding-left: 8rpx;
    padding-right: 8rpx;
  }
}

.param-label {
  font-size: 28rpx;
  color: #374151;
  flex-shrink: 1;
  font-weight: 500;
  flex: 0 1 300rpx;
  max-width: 300rpx;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.param-input-wrap {
  display: flex;
  align-items: center;
  gap: 6rpx;
  flex-shrink: 0;
}

.param-input {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 72rpx;
  padding: 0 20rpx;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
  border-radius: 12rpx;
  min-width: 200rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  input {
    width: 100%;
    height: 72rpx;
    font-size: 28rpx;
    color: #1F2937;
    text-align: right;
    background: transparent;
    border: none;
    font-weight: 500;
  }

  &:active {
    background: #fff;
    border-color: #E4E7ED;
  }
}

.param-input.editing {
  background: #fff;
  border: 3rpx solid #4488FB;
  border-radius: 12rpx;
  box-shadow: 0 6rpx 20rpx rgba(68, 136, 251, 0.18);
  min-width: 100rpx;
  width: 160rpx;

  input {
    text-align: right;
    color: #1F2937;
    font-weight: 600;
    width: 100%;
    height: 100%;
    font-size: 28rpx;
  }
}

.param-value {
  font-size: 28rpx;
  color: #1F2937;
  font-weight: 500;
  text-align: right;
}

.param-unit {
  font-size: 26rpx;
  color: #9CA3AF;
  flex-shrink: 0;
  min-width: 48rpx;
  text-align: left;
}

.param-actions {
  display: flex;
  gap: 12rpx;
  margin-left: 20rpx;
  flex-shrink: 0;
}

.param-btn {
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 500;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &.edit {
    background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    color: #4488FB;
    border: 2rpx solid #E4E7ED;

    &:active {
      background: #4488FB;
      color: #fff;
      border-color: #4488FB;
      transform: scale(0.95);
    }
  }

  &.confirm {
    background: linear-gradient(135deg, #36B37E 0%, #52C41A 100%);
    color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(54, 179, 126, 0.3);

    &:active {
      transform: scale(0.95);
      box-shadow: 0 2rpx 6rpx rgba(54, 179, 126, 0.4);
    }
  }

  &.cancel {
    background: #fff;
    color: #6B7280;
    border: 2rpx solid #E4E7ED;

    &:active {
      background: #F5F7FA;
      transform: scale(0.95);
    }
  }
}

.empty-tip {
  font-size: 28rpx;
  color: #9CA3AF;
  text-align: center;
  padding: 80rpx 0;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-content {
  animation: slideUp 0.4s ease-out;
}
</style>