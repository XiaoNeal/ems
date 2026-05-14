<template>
  <view class="device-list-container">
    <!-- 空列表状态 -->
    <view v-if="esIds.length === 0" class="empty-state">
      <view class="empty-icon">
        <uni-icons type="plus-circle" size="80" color="#ccc"></uni-icons>
      </view>
      <text class="empty-title">暂无设备</text>
      <text class="empty-desc">点击下方按钮添加您的第一个设备</text>
      <button class="add-btn" @click="showAddOptions">添加设备</button>
    </view>

    <!-- 设备列表 -->
    <view v-else class="device-list">
      <view class="list-header">
        <text class="list-title">我的设备</text>
        <view class="header-right">
          <text class="device-count">{{ esIds.length }} 台设备</text>
          <button class="add-device-btn" @click="showAddOptions">
            <uni-icons type="plus" size="24" color="#fff"></uni-icons>
          </button>
        </view>
      </view>
      
      <view 
        v-for="(esId, index) in esIds" 
        :key="index" 
        class="device-item"
        @click="selectDevice(esId)"
      >
        <view class="device-icon">
          <uni-icons type="monitor" size="40" color="#007aff"></uni-icons>
        </view>
        <view class="device-info">
          <text class="device-name">{{ getDeviceName(esId) }}</text>
          <text class="device-id">设备ID: {{ esId.esId || esId.id }}</text>
        </view>
        <uni-icons type="arrowright" size="24" color="#999"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { bindEsUserByQrId } from '@/api/user'

export default {
  computed: {
    ...mapState(['userInfo'])
  },
  data() {
    return {
      esIds: []
    }
  },
  mounted() {
    this.initEsIds()
  },
  methods: {
    initEsIds() {
      // 从 userInfo 中获取 esIds
      if (this.userInfo && this.userInfo.esIds) {
        this.esIds = Array.isArray(this.userInfo.esIds) ? this.userInfo.esIds : []
      } else {
        this.esIds = []
      }

      console.log(this.esIds,"111111122222222222222")
    },
    
    getDeviceName(esId) {
      return `设备 ${esId.name}`
    },
    
    selectDevice(esId) {
      uni.setStorageSync('currentEsId', esId)
      this.$emit('selectDevice', esId)
    },
    
    // 显示添加方式选择菜单
    showAddOptions() {
      uni.showActionSheet({
        itemList: ['扫码添加', '输入编号'],
        itemColor: '#333',
        success: (res) => {
          if (res.tapIndex === 0) {
            // 选择扫码添加
            this.scanDevice()
          } else if (res.tapIndex === 1) {
            // 选择输入编号
            this.showInputModal()
          }
        },
        fail: () => {
          console.log('用户取消选择')
        }
      })
    },
    
    // 扫码添加设备
    scanDevice() {
      // 检查相机权限
      uni.authorize({
        scope: 'scope.camera',
        success: () => {
          // 权限获取成功，开始扫码
          this.doScan()
        },
        fail: () => {
          // 权限被拒绝，引导用户开启权限
          uni.showModal({
            title: '权限提示',
            content: '需要相机权限才能扫码，请在设置中开启',
            confirmText: '去设置',
            cancelText: '取消',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting({
                  success: (res) => {
                    console.log('设置返回:', res)
                  }
                })
              }
            }
          })
        }
      })
    },
    
    // 执行扫码
    doScan() {
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode'],
        success: (res) => {
          console.log('扫码结果:', res)
          // 二维码内容即为 qrId
          const qrId = res.result.trim()
          if (qrId) {
            this.validateAndAddDevice(qrId)
          } else {
            uni.showToast({
              title: '无法识别二维码',
              icon: 'none'
            })
          }
        },
        fail: (err) => {
          console.error('扫码失败:', err)
          uni.showToast({
            title: '扫码失败',
            icon: 'none'
          })
        }
      })
    },
    
    // 解析扫码结果
    parseScanResult(result) {
      // 尝试从扫码结果中提取设备编号
      // 支持格式：纯数字、URL参数、JSON等
      
      // 1. 尝试直接转换为数字
      const num = parseInt(result)
      if (!isNaN(num) && num > 0) {
        return num
      }
      
      // 2. 尝试从URL中提取esId参数
      try {
        const url = new URL(result)
        const esIdParam = url.searchParams.get('esId')
        if (esIdParam) {
          return parseInt(esIdParam)
        }
      } catch (e) {
        // 不是URL格式，继续尝试
      }
      
      // 3. 尝试从JSON中提取
      try {
        const json = JSON.parse(result)
        if (json.esId) {
          return parseInt(json.esId)
        }
        if (json.deviceId) {
          return parseInt(json.deviceId)
        }
      } catch (e) {
        // 不是JSON格式
      }
      
      // 4. 尝试正则匹配数字
      const match = result.match(/(\d+)/)
      if (match) {
        return parseInt(match[1])
      }
      
      return null
    },
    
    // 显示输入编号弹窗
    showInputModal() {
      uni.showModal({
        title: '添加设备',
        editable: true,
        placeholderText: '请输入设备二维码编号',
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm && res.content) {
            const qrId = res.content.trim()
            if (!qrId) {
              uni.showToast({
                title: '请输入二维码编号',
                icon: 'none'
              })
              return
            }
            this.validateAndAddDevice(qrId)
          }
        }
      })
    },
    
    validateAndAddDevice(qrId) {
      // 确认添加设备
      uni.showModal({
        title: '确认添加',
        content: `确定要使用此二维码绑定设备吗？`,
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.doAddDevice(qrId)
          }
        }
      })
    },
    
    async doAddDevice(qrId) {
      uni.showLoading({ title: '绑定中...' })
      
      try {
        const esUserId = this.userInfo.userId
        const res = await bindEsUserByQrId(qrId, esUserId)
        
        if (res.code === 200) {
          // 绑定成功，刷新设备列表
          uni.showToast({
            title: '绑定成功',
            icon: 'success'
          })
          
          // 通知父组件刷新设备列表
          this.$emit('deviceAdded', qrId)
        } else {
          uni.showToast({
            title: res.message || '绑定失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('绑定设备失败:', error)
        uni.showToast({
          title: '网络异常，绑定失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.device-list-container {
  padding: 30rpx;
  min-height: 100%;
  background: linear-gradient(180deg, #f0f5ff 0%, #f5f7fa 100%);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 50rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
  margin-top: 40rpx;
}

.empty-icon {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.15);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.empty-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20rpx;
  letter-spacing: 1rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #6b7280;
  margin-bottom: 60rpx;
  text-align: center;
}

.add-btn {
  width: 320rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  border-radius: 44rpx;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.96);
    box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.4);
  }
}

/* 设备列表 */
.device-list {
  background-color: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
  margin-top: 30rpx;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1rpx solid #e2e8f0;
}

.list-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
}

.list-title::before {
  content: '';
  width: 6rpx;
  height: 28rpx;
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 3rpx;
  margin-right: 16rpx;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.device-count {
  font-size: 26rpx;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.add-device-btn {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.92);
    box-shadow: 0 2rpx 6rpx rgba(59, 130, 246, 0.4);
  }
}

.device-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f1f5f9;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 60%;
    background: linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%);
    border-radius: 0 8rpx 8rpx 0;
    transition: width 0.3s ease;
  }
  
  &:active {
    background-color: #f8fafc;
    
    &::after {
      width: 8rpx;
    }
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.device-icon {
  width: 96rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
  box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.1);
  transition: transform 0.3s ease;
  
  .device-item:active & {
    transform: scale(1.05);
  }
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.device-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8rpx;
  letter-spacing: 0.5rpx;
}

.device-id {
  font-size: 24rpx;
  color: #94a3b8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.device-item uni-icons:last-child {
  font-size: 28rpx;
  color: #cbd5e1;
  transition: all 0.3s ease;
  
  .device-item:active & {
    color: #3b82f6;
    transform: translateX(4rpx);
  }
}

/* 分割线装饰 */
.divider {
  height: 20rpx;
  background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
  margin: 20rpx 0;
}
</style>