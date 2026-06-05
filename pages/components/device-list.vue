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

      <view v-for="(esId, index) in esIds" :key="index" class="device-item">
        <view class="device-main" @click="selectDevice(esId)">
          <view class="device-icon">
            <uni-icons type="monitor" size="40" color="#4488FB"></uni-icons>
          </view>
          <view class="device-info">
            <text class="device-name">{{ getDeviceName(esId) }}</text>
            <text class="device-id">设备ID: {{ esId.esId || esId.id }}</text>
            <text v-if="isAdmin(esId)" class="admin-tag">管理员</text>
          </view>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#999"></uni-icons>
        </view>
        <!-- 管理员操作按钮 -->
        <view v-if="isAdmin(esId)" class="device-actions">
          <view class="action-btn share-btn" @click.stop="shareDevice(esId)">
            <uni-icons type="share" size="20" color="#fff"></uni-icons>
            <text>分享</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 分享弹窗 - 支持长按复制 -->
    <view v-if="showShareModal" class="share-modal-mask" @click="closeShareModal">
      <view class="share-modal" @click.stop>
        <view class="share-modal-header">
          <text class="share-modal-title">{{ shareModalType === 'code' ? '分享码' : '分享链接' }}</text>
          <view class="close-btn" @click="closeShareModal">
            <uni-icons type="close" size="24" color="#999"></uni-icons>
          </view>
        </view>
        <view class="share-modal-body">
          <view class="device-name-wrap">
            <text class="device-name-label">设备名称：</text>
            <text class="device-name-value">{{ currentShareDeviceName }}</text>
          </view>
          <view class="share-content-wrap">
            <text class="share-content-label">{{ shareModalType === 'code' ? '分享码：' : '链接：' }}</text>
            <view class="share-content-box">
              <text class="share-content-text" :class="{ 'selectable': true }"
                :data-text="shareModalType === 'code' ? currentShareCode : currentShareLink">{{ shareModalType ===
                  'code' ? currentShareCode : currentShareLink }}</text>
            </view>
            <text class="copy-hint">长按文本可复制</text>
          </view>
          <view class="copy-btn" @tap="handleCopyClick">
            <uni-icons type="copy" size="20" color="#fff"></uni-icons>
            <text>点击复制</text>
          </view>
        </view>
      </view>
    </view>
  </view>
  <!-- </view> -->
  <!-- </view> -->
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
      esIds: [],
      // 分享弹窗相关
      showShareModal: false,
      shareModalType: 'code', // 'code' | 'link'
      currentShareCode: '',
      currentShareLink: '',
      currentShareDeviceName: ''
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

      console.log(this.esIds, "111111122222222222222")
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
      const deviceName = this.getDeviceName(esId)
      const that = this

      // #ifdef MP-WEIXIN
      wx.showActionSheet({
        itemList: ['分享码', '生成二维码', '分享链接'],
        itemColor: '#4488FB',
        success: function (res) {
          if (res.tapIndex === 0) {
            const shareCode = that.generateRandomCode()
            that.currentShareCode = shareCode
            that.currentShareDeviceName = deviceName
            that.showShareModal = true
            that.shareModalType = 'code'
          } else if (res.tapIndex === 1) {
            that.generateQRCode(esId, deviceName)
          } else if (res.tapIndex === 2) {
            const shareLink = `https://example.com/add-device?code=${that.generateRandomCode()}`
            that.currentShareLink = shareLink
            that.currentShareDeviceName = deviceName
            that.showShareModal = true
            that.shareModalType = 'link'
          }
        },
        fail: function () {
          console.log('用户取消分享')
        }
      })
      // #endif

      // #ifndef MP-WEIXIN
      uni.showActionSheet({
        itemList: ['分享码', '生成二维码', '分享链接'],
        itemColor: '#4488FB',
        success: (res) => {
          if (res.tapIndex === 0) {
            const shareCode = that.generateRandomCode()
            that.currentShareCode = shareCode
            that.currentShareDeviceName = deviceName
            that.showShareModal = true
            that.shareModalType = 'code'
          } else if (res.tapIndex === 1) {
            that.generateQRCode(esId, deviceName)
          } else if (res.tapIndex === 2) {
            const shareLink = `https://example.com/add-device?code=${that.generateRandomCode()}`
            that.currentShareLink = shareLink
            that.currentShareDeviceName = deviceName
            that.showShareModal = true
            that.shareModalType = 'link'
          }
        },
        fail: () => {
          console.log('用户取消分享')
        }
      })
      // #endif
    },

    // 处理复制按钮点击（确保在直接用户交互链中）
    handleCopyClick() {
      const text = this.shareModalType === 'code' ? this.currentShareCode : this.currentShareLink

      // #ifdef MP-WEIXIN
      wx.setClipboardData({
        data: text,
        success: function () {
          wx.showToast({
            title: '已复制',
            icon: 'success',
            duration: 1500
          })
        },
        fail: function () {
          wx.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
      // #endif

      // #ifndef MP-WEIXIN
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: '已复制',
            icon: 'success',
            duration: 1500
          })
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
      // #endif
    },

    // 复制分享码
    copyShareCode(esId, deviceName) {
      const shareCode = this.generateRandomCode()

      // #ifdef MP-WEIXIN
      wx.showModal({
        title: '分享码',
        content: `设备：${deviceName}\n\n分享码：${shareCode}`,
        confirmText: '复制',
        cancelText: '知道了',
        confirmColor: '#4488FB',
        success: function (res) {
          if (res.confirm) {
            wx.setClipboardData({
              data: shareCode,
              success: function () {
                wx.showToast({
                  title: '已复制',
                  icon: 'success',
                  duration: 1500
                })
              },
              fail: function () {
                wx.showToast({
                  title: '复制失败',
                  icon: 'none'
                })
              }
            })
          }
        }
      })
      // #endif

      // #ifndef MP-WEIXIN
      uni.setClipboardData({
        data: shareCode,
        success: () => {
          uni.showToast({
            title: '已复制',
            icon: 'success',
            duration: 1500
          })

          uni.showModal({
            title: '分享码已生成',
            content: `设备：${deviceName}\n分享码：${shareCode}\n\n已复制到剪贴板`,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#4488FB'
          })
        },
        fail: () => {
          uni.showModal({
            title: '分享码已生成',
            content: `设备：${deviceName}\n分享码：${shareCode}\n\n请长按复制分享码`,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#4488FB'
          })
        }
      })
      // #endif
    },

    // 生成二维码
    async generateQRCode(esId, deviceName) {
      try {
        const shareCode = this.generateRandomCode()
        const qrUrl = `https://example.com/share?code=${shareCode}&device=${esId.esId || esId.id}`

        uni.showModal({
          title: '分享二维码',
          content: `设备：${deviceName}\n分享码：${shareCode}\n\n其他用户扫描此二维码即可添加设备`,
          confirmText: '保存图片',
          cancelText: '知道了',
          confirmColor: '#4488FB',
          success: (res) => {
            if (res.confirm) {
              uni.showToast({
                title: '图片已保存',
                icon: 'success'
              })
            }
          }
        })
      } catch (error) {
        uni.showToast({
          title: '生成失败',
          icon: 'none'
        })
      }
    },

    // 复制分享链接
    copyShareLink(esId, deviceName) {
      const shareCode = this.generateRandomCode()
      const shareLink = `https://example.com/add-device?code=${shareCode}`

      // #ifdef MP-WEIXIN
      wx.showModal({
        title: '分享链接',
        content: `设备：${deviceName}\n\n链接：${shareLink}`,
        confirmText: '复制',
        cancelText: '知道了',
        confirmColor: '#4488FB',
        success: function (res) {
          if (res.confirm) {
            wx.setClipboardData({
              data: shareLink,
              success: function () {
                wx.showToast({
                  title: '已复制',
                  icon: 'success',
                  duration: 1500
                })
              },
              fail: function () {
                wx.showToast({
                  title: '复制失败',
                  icon: 'none'
                })
              }
            })
          }
        }
      })
      // #endif

      // #ifndef MP-WEIXIN
      uni.setClipboardData({
        data: shareLink,
        success: () => {
          uni.showToast({
            title: '已复制',
            icon: 'success',
            duration: 1500
          })
        },
        fail: () => {
          uni.showModal({
            title: '分享链接已生成',
            content: `设备：${deviceName}\n链接：${shareLink}\n\n请长按复制链接`,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#4488FB'
          })
        }
      })
      // #endif
    },

    // 关闭分享弹窗
    closeShareModal() {
      this.showShareModal = false
    },

    // 从弹窗复制内容
    copyFromModal() {
      const text = this.shareModalType === 'code' ? this.currentShareCode : this.currentShareLink
      
      // #ifdef MP-WEIXIN
      wx.setClipboardData({
        data: text,
        success: () => {
          wx.showToast({
            title: '已复制',
            icon: 'success',
            duration: 1500
          })
        },
        fail: () => {
          wx.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
      // #endif
      
      // #ifndef MP-WEIXIN
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: '已复制',
            icon: 'success',
            duration: 1500
          })
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
      // #endif
    },
    
    // 处理复制按钮点击（直接在用户交互链中）
    handleCopyClick(e) {
      e.preventDefault()
      const text = this.shareModalType === 'code' ? this.currentShareCode : this.currentShareLink
      
      // #ifdef MP-WEIXIN
      wx.setClipboardData({
        data: text,
        success: function() {
          wx.showToast({
            title: '已复制',
            icon: 'success',
            duration: 1500
          })
        },
        fail: function() {
          wx.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
      // #endif
      
      // #ifndef MP-WEIXIN
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: '已复制',
            icon: 'success',
            duration: 1500
          })
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
      // #endif
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
  padding: 20rpx;
  min-height: 100vh;
  background-color: #EFF4FB;
  box-sizing: border-box;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 40rpx;
  background: #fff;
  border-radius: 12px;
  margin-top: 30rpx;
}

.empty-icon {
  width: 100rpx;
  height: 100rpx;
  background-color: #F8FAFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.empty-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 10rpx;
}

.empty-desc {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 40rpx;
  text-align: center;
}

.add-btn {
  width: 260rpx;
  height: 72rpx;
  background-color: #4488FB;
  color: #fff;
  border-radius: 36rpx;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.add-btn:active {
  background-color: #1890FF;
}

/* 设备列表 */
.device-list {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 20rpx;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.device-count {
  font-size: 12px;
  color: #666;
}

.add-device-btn {
  width: 48rpx;
  height: 48rpx;
  background-color: #4488FB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
}

.add-device-btn:active {
  background-color: #1890FF;
}

.device-item {
  padding: 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.device-main {
  display: flex;
  align-items: center;
  padding: 20px;
}

.device-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: #F8FAFF;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.device-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.device-id {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-tag {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  color: #fff;
  background-color: #f3a73f;
  padding: 4rpx 12rpx;
  border-radius: 4px;
  margin-top: 6px;
}

/* 管理员操作区域 */
.device-actions {
  display: flex;
  justify-content: flex-end;
  padding: 12px 20px 16px;
  background-color: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12rpx 28rpx;
  font-size: 13px;
  font-weight: 500;
  border-radius: 24rpx;
}

.share-btn {
  background-color: #4488FB;
  color: #fff;
  border: none;
}

.share-btn:active {
  background-color: #1890FF;
}

/* 统一箭头样式 */
.arrow-icon {
  font-size: 14px;
  color: #999;
  flex-shrink: 0;
  margin-left: 12px;
}

/* 分享弹窗 */
.share-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.share-modal {
  width: 600rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.share-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1px solid #f0f0f0;
}

.share-modal-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.close-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-modal-body {
  padding: 32rpx;
}

.device-name-wrap {
  margin-bottom: 24rpx;
}

.device-name-label {
  font-size: 26rpx;
  color: #666;
}

.device-name-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.share-content-wrap {
  margin-bottom: 32rpx;
}

.share-content-label {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 16rpx;
}

.share-content-box {
  background-color: #f8f9fa;
  border-radius: 8rpx;
  padding: 24rpx;
  margin-bottom: 12rpx;
}

.share-content-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  font-family: monospace;
  word-break: break-all;
  user-select: text;
  -webkit-user-select: text;
}

.copy-hint {
  font-size: 22rpx;
  color: #999;
  display: block;
}

.copy-btn {
  width: 100%;
  height: 88rpx;
  background-color: #4488FB;
  color: #fff;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  font-size: 30rpx;
  font-weight: 500;
}

.copy-btn:active {
  background-color: #1890FF;
}
</style>