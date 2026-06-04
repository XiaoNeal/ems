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
      >
        <view class="device-main" @click="selectDevice(esId)">
          <view class="device-icon">
            <uni-icons type="monitor" size="40" color="#007aff"></uni-icons>
          </view>
          <view class="device-info">
            <text class="device-name">{{ getDeviceName(esId) }}</text>
            <text class="device-id">设备ID: {{ esId.esId || esId.id }}</text>
            <text v-if="isAdmin(esId)" class="admin-tag">管理员</text>
          </view>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#ccc"></uni-icons>
        </view>
        <!-- 管理员操作按钮 -->
        <view v-if="isAdmin(esId)" class="device-actions">
          <view class="action-btn share-btn" @click.stop="shareDevice(esId)">
            <u-icon name="share" size="24" color="#007aff"></u-icon>
            <text>分享</text>
          </view>
        </view>
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
    
    // 判断是否为设备管理员（默认假设为管理员，方便测试分享功能）
    isAdmin(esId) {
      // 检查设备对象中是否有管理员标识
      if (typeof esId === 'object') {
        // 默认假设用户是管理员（测试模式）
        return true
        // 正式环境请使用以下逻辑：
        // return esId.isAdmin === true || esId.admin === true
      }
      return true
    },
    
    selectDevice(esId) {
      uni.setStorageSync('currentEsId', esId)
      this.$emit('selectDevice', esId)
    },
    
    // 显示添加方式选择菜单
    showAddOptions() {
      uni.showActionSheet({
        itemList: ['扫码添加', '输入编号', '分享设备'],
        itemColor: '#333',
        success: (res) => {
          if (res.tapIndex === 0) {
            // 选择扫码添加
            this.scanDevice()
          } else if (res.tapIndex === 1) {
            // 选择输入编号
            this.showInputModal()
          } else if (res.tapIndex === 2) {
            // 选择分享设备
            this.showShareOptions()
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
      // 检查是否需要分享码（设备已被绑定但当前用户不是管理员）
      // 实际项目中应该调用后端接口检查设备状态
      const deviceStatus = await this.checkDeviceStatus(qrId)
      
      if (deviceStatus.needShareCode) {
        // 需要分享码才能绑定
        uni.showModal({
          title: '需要分享码',
          editable: true,
          placeholderText: '请输入分享码',
          confirmText: '确认绑定',
          cancelText: '取消',
          success: async (res) => {
            if (res.confirm && res.content) {
              const shareCode = res.content.trim()
              if (!shareCode) {
                uni.showToast({
                  title: '请输入分享码',
                  icon: 'none'
                })
                return
              }
              
              // 验证分享码并绑定
              await this.bindWithShareCode(qrId, shareCode)
            }
          }
        })
        return
      }
      
      // 可以直接绑定（第一个绑定者成为管理员）
      uni.showLoading({ title: '绑定中...' })
      
      try {
        const esUserId = this.userInfo.userId
        const res = await bindEsUserByQrId(qrId, esUserId)
        
        if (res.code === 200) {
          // 绑定成功，刷新设备列表
          uni.showToast({
            title: '绑定成功，您已成为设备管理员',
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
    },
    
    // 检查设备状态（模拟后端检查）
    async checkDeviceStatus(qrId) {
      // 实际项目中应该调用后端接口检查设备是否已被绑定
      // 这里模拟：如果用户已有设备，则需要分享码
      // 实际逻辑应由后端判断：设备是否存在、是否已有管理员
      
      // 模拟：检查用户是否已有设备
      if (this.esIds.length > 0) {
        // 已有设备，可能需要分享码（由后端决定）
        return {
          needShareCode: true,
          hasAdmin: true
        }
      }
      
      // 没有设备，可以直接绑定成为管理员
      return {
        needShareCode: false,
        hasAdmin: false
      }
    },
    
    // 使用分享码绑定设备
    async bindWithShareCode(qrId, shareCode) {
      uni.showLoading({ title: '绑定中...' })
      
      try {
        // 实际项目中应该调用后端接口验证分享码并绑定
        // 这里模拟分享码验证
        if (shareCode.length === 8) {
          // 分享码格式正确，模拟绑定成功
          const esUserId = this.userInfo.userId
          const res = await bindEsUserByQrId(qrId, esUserId)
          
          if (res.code === 200) {
            uni.showToast({
              title: '绑定成功',
              icon: 'success'
            })
            this.$emit('deviceAdded', qrId)
          } else {
            uni.showToast({
              title: res.message || '绑定失败',
              icon: 'none'
            })
          }
        } else {
          uni.showToast({
            title: '分享码格式错误',
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
    },
    
    // 显示分享选项（无设备时）
    showShareOptions() {
      if (this.esIds.length === 0) {
        uni.showToast({
          title: '请先添加设备',
          icon: 'none'
        })
        return
      }
      
      // 获取管理员设备列表
      const adminDevices = this.esIds.filter(item => this.isAdmin(item))
      
      if (adminDevices.length === 0) {
        uni.showToast({
          title: '您不是任何设备的管理员',
          icon: 'none'
        })
        return
      }
      
      if (adminDevices.length === 1) {
        // 只有一个设备，直接分享
        this.shareDevice(adminDevices[0])
      } else {
        // 多个设备，选择分享哪个
        uni.showActionSheet({
          itemList: adminDevices.map(d => this.getDeviceName(d)),
          itemColor: '#333',
          success: (res) => {
            this.shareDevice(adminDevices[res.tapIndex])
          }
        })
      }
    },
    
    // 分享设备给其他用户
    shareDevice(esId) {
      uni.showActionSheet({
        itemList: ['复制分享码', '生成二维码', '分享链接'],
        itemColor: '#333',
        success: (res) => {
          if (res.tapIndex === 0) {
            // 复制分享码
            this.copyShareCode(esId)
          } else if (res.tapIndex === 1) {
            // 生成二维码
            this.generateQRCode(esId)
          } else if (res.tapIndex === 2) {
            // 分享链接
            this.shareLink(esId)
          }
        },
        fail: () => {
          console.log('用户取消分享')
        }
      })
    },
    
    // 复制分享码
    async copyShareCode(esId) {
      uni.showLoading({ title: '生成中...' })
      
      try {
        const shareCode = this.generateRandomCode()
        
        uni.hideLoading()
        
        // 复制分享码到剪贴板
        uni.setClipboardData({
          data: shareCode,
          success: () => {
            uni.showModal({
              title: '分享码已生成',
              content: `分享码：${shareCode}\n\n已复制到剪贴板，可直接粘贴分享给好友。`,
              showCancel: false,
              confirmText: '知道了',
              success: () => {
                uni.showToast({
                  title: '已复制',
                  icon: 'success'
                })
              }
            })
          },
          fail: () => {
            uni.showModal({
              title: '分享码已生成',
              content: `分享码：${shareCode}\n\n请手动复制分享码。`,
              showCancel: false,
              confirmText: '知道了'
            })
          }
        })
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '生成失败',
          icon: 'none'
        })
      }
    },
    
    // 生成二维码
    async generateQRCode(esId) {
      uni.showLoading({ title: '生成中...' })
      
      try {
        const shareCode = this.generateRandomCode()
        const qrUrl = `https://example.com/share?code=${shareCode}&device=${esId.esId || esId.id}`
        
        uni.hideLoading()
        
        // 显示二维码弹窗
        uni.showModal({
          title: '分享二维码',
          content: `其他用户扫描此二维码即可添加设备。\n\n分享码：${shareCode}`,
          confirmText: '保存图片',
          cancelText: '知道了',
          success: (res) => {
            if (res.confirm) {
              // 模拟保存图片
              uni.showToast({
                title: '图片已保存',
                icon: 'success'
              })
            }
          }
        })
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '生成失败',
          icon: 'none'
        })
      }
    },
    
    // 分享链接
    async shareLink(esId) {
      uni.showLoading({ title: '生成中...' })
      
      try {
        const shareCode = this.generateRandomCode()
        const shareLink = `https://example.com/add-device?code=${shareCode}`
        
        uni.hideLoading()
        
        // 复制链接到剪贴板
        uni.setClipboardData({
          data: shareLink,
          success: () => {
            uni.showModal({
              title: '分享链接已生成',
              content: `分享链接：${shareLink}\n\n已复制到剪贴板，可分享给好友。`,
              showCancel: false,
              confirmText: '知道了',
              success: () => {
                uni.showToast({
                  title: '已复制',
                  icon: 'success'
                })
              }
            })
          },
          fail: () => {
            uni.showModal({
              title: '分享链接已生成',
              content: `分享链接：${shareLink}\n\n请手动复制链接。`,
              showCancel: false,
              confirmText: '知道了'
            })
          }
        })
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '生成失败',
          icon: 'none'
        })
      }
    },
    
    // 生成随机分享码
    generateRandomCode() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = ''
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }
  }
}
</script>

<style scoped lang="scss">
.device-list-container {
  padding: 24rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f4ff 0%, #f5f7fa 50%, #fafbfc 100%);
  box-sizing: border-box;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 12rpx 48rpx rgba(0, 0, 0, 0.08), 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  margin-top: 60rpx;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -100rpx;
    right: -100rpx;
    width: 200rpx;
    height: 200rpx;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -60rpx;
    left: -60rpx;
    width: 120rpx;
    height: 120rpx;
    background: radial-gradient(circle, rgba(147, 197, 253, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
}

.empty-icon {
  width: 180rpx;
  height: 180rpx;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 48rpx;
  box-shadow: 0 12rpx 36rpx rgba(59, 130, 246, 0.2), inset 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
  animation: float 3s ease-in-out infinite, glow 2s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12rpx);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 12rpx 36rpx rgba(59, 130, 246, 0.2), inset 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
    filter: brightness(1);
  }
  50% {
    box-shadow: 0 16rpx 48rpx rgba(59, 130, 246, 0.28), inset 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
    filter: brightness(1.05);
  }
}

.empty-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16rpx;
  letter-spacing: 1.5rpx;
  position: relative;
  z-index: 1;
}

.empty-desc {
  font-size: 28rpx;
  color: #64748b;
  margin-bottom: 72rpx;
  text-align: center;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.add-btn {
  width: 340rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
  color: #fff;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  box-shadow: 0 12rpx 32rpx rgba(59, 130, 246, 0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
    transition: opacity 0.3s ease;
  }
  
  &:active {
    transform: scale(0.94);
    box-shadow: 0 6rpx 16rpx rgba(59, 130, 246, 0.45);
    
    &::before {
      opacity: 0.5;
    }
  }
}

/* 设备列表 */
.device-list {
  background-color: #fff;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 48rpx rgba(0, 0, 0, 0.08), 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  margin-top: 32rpx;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 36rpx;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1rpx solid #e2e8f0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1rpx;
    left: 36rpx;
    right: 36rpx;
    height: 1rpx;
    background: linear-gradient(90deg, transparent 0%, #cbd5e1 50%, transparent 100%);
  }
}

.list-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
}

.list-title::before {
  content: '';
  width: 8rpx;
  height: 32rpx;
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 4rpx;
  margin-right: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(59, 130, 246, 0.3);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.device-count {
  font-size: 26rpx;
  color: #64748b;
  background: #e2e8f0;
  padding: 10rpx 24rpx;
  border-radius: 24rpx;
  font-weight: 500;
}

.add-device-btn {
  width: 64rpx;
  height: 64rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  box-shadow: 0 6rpx 20rpx rgba(59, 130, 246, 0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
  }
  
  &:active {
    transform: scale(0.88);
    box-shadow: 0 3rpx 10rpx rgba(59, 130, 246, 0.45);
  }
}

.device-item {
  padding: 0;
  border-bottom: 1rpx solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: #fafafa;
  }
}

.device-main {
  display: flex;
  align-items: center;
  padding: 36rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.device-main::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(180deg, #dbeafe 0%, #93c5fd 50%, #dbeafe 100%);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.device-main:active::before {
  width: 10rpx;
}

.device-icon {
  width: 108rpx;
  height: 108rpx;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 32rpx;
  box-shadow: 0 6rpx 24rpx rgba(59, 130, 246, 0.12), inset 0 2rpx 6rpx rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  
  .device-item:active & {
    transform: scale(1.08);
    box-shadow: 0 8rpx 32rpx rgba(59, 130, 246, 0.18);
  }
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.device-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12rpx;
  letter-spacing: 0.5rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-id {
  font-size: 24rpx;
  color: #94a3b8;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Monaco, monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-tag {
  display: inline-flex;
  align-items: center;
  font-size: 20rpx;
  color: #fff;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  margin-top: 10rpx;
  font-weight: 600;
  box-shadow: 0 2rpx 8rpx rgba(245, 158, 11, 0.3);
}

/* 管理员操作区域 */
.device-actions {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 36rpx 24rpx;
  gap: 24rpx;
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
  border-top: 1rpx solid #e5e5e5;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 20rpx 40rpx;
  font-size: 26rpx;
  font-weight: 600;
  border-radius: 36rpx;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
  &:active {
    transform: scale(0.93);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
  }
}

.share-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  border: none;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, transparent 50%);
    pointer-events: none;
  }
  
  &:active {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }
}

/* 统一箭头样式 */
.arrow-icon {
  font-size: 28rpx;
  color: #9ca3af;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 16rpx;
  
  .device-item:active & {
    color: #3b82f6;
    transform: translateX(8rpx);
  }
}

/* 安全区域适配 */
@media screen and (max-height: 667px) {
  .empty-state {
    padding: 80rpx 40rpx;
    margin-top: 40rpx;
  }
  
  .empty-icon {
    width: 140rpx;
    height: 140rpx;
    margin-bottom: 32rpx;
  }
  
  .empty-title {
    font-size: 34rpx;
  }
  
  .empty-desc {
    font-size: 26rpx;
    margin-bottom: 56rpx;
  }
  
  .add-btn {
    width: 300rpx;
    height: 84rpx;
    font-size: 30rpx;
  }
}
</style>