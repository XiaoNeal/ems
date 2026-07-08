<template>
  <view class="page-wrap">
    <view v-if="loading" class="loading-card">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else>
      <!-- 空设备状态 -->
      <view v-if="esIds.length === 0" class="empty-card">
        <view class="empty-icon-box">
          <uni-icons type="folder-empty" size="96" color="#b4c8eb" />
        </view>
        <text class="empty-title">暂无储能设备</text>
        <text class="empty-desc">扫码或输入设备编号，快速绑定储能设备</text>
        <button class="empty-add-btn" @click="showAddOptions">
          <uni-icons type="plus" size="26" color="#fff" />
          <text>添加设备</text>
        </button>
      </view>

      <!-- 设备列表容器 -->
      <view v-else class="list-card">
      <!-- 列表头部 -->
      <view class="list-header">
        <text class="header-title">我的储能设备</text>
        <view class="header-right-group">
          <text class="device-total">{{ esIds.length }}台设备</text>
          <view class="header-add-btn" @click="showAddOptions">
            <uni-icons type="plus" size="20" color="#4080f0" />
          </view>
        </view>
      </view>

      <scroll-view scroll-y class="device-scroll">
        <view v-for="(esId, index) in esIds" :key="index" class="device-item">
          <view class="device-card" @click.stop="selectDevice(esId)">
            <view class="device-left">
              <view class="device-avatar-wrap">
                <image v-if="esId.imageUrl || esId.imgUrl" :src="esId.imageUrl || esId.imgUrl" mode="aspectFill"
                  class="avatar-img" />
                <image v-else
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20energy%20storage%20device%20icon%20modern%20minimal%20style&image_size=square"
                  mode="aspectFill" class="avatar-img" />
                <view class="status-dot online"></view>
              </view>
              <view class="info-text">
                <view class="name-line">
                  <text class="device-name">{{ getDeviceName(esId) }}</text>
                  <text v-if="isAdmin(esId)" class="admin-label">管理员</text>
                </view>
                <view class="desc-line">
                  <text class="device-id">ID：{{ esId.esId || esId.id }}</text>
                  <text class="device-area" v-if="esId.description">{{ esId.description }}</text>
                </view>
              </view>
            </view>
            <view class="device-right">
              <view class="action-group">
                <view class="action-btn" @click.stop="showDeviceMenu(esId)">
                  <uni-icons type="more-filled" size="24" color="#9499a4" />
                </view>
              </view>
              <uni-icons type="arrowright" size="22" color="#d0d3d9" />
            </view>
          </view>
        </view>
      </scroll-view>
      </view>
    </view>

    <!-- 分享弹窗 -->
    <view v-if="showShareModal" class="modal-mask" @click="closeShareModal">
      <view class="share-modal" @click.stop>
        <view class="modal-head">
          <text class="modal-title">
            {{ shareModalType === 'code' ? '设备分享码' : '分享链接' }}
          </text>
          <view class="modal-close" @click="closeShareModal">
            <uni-icons type="close" size="22" color="#a0a6b2" />
          </view>
        </view>
        <view class="modal-body">
          <view class="form-row">
            <text class="form-label">设备名称</text>
            <text class="form-value">{{ currentShareDeviceName }}</text>
          </view>
          <view class="copy-block">
            <text class="copy-label">
              {{ shareModalType === 'code' ? '8位分享码' : '分享链接' }}
            </text>
            <view class="code-wrap">
              <text selectable class="code-text">
                {{ shareModalType === 'code' ? currentShareCode : currentShareLink }}
              </text>
            </view>
            <text class="copy-tip">长按文本一键复制</text>
          </view>
          <button class="copy-main-btn" @tap="handleCopyClick">
            <uni-icons type="copy" size="20" color="#fff" />
            <text>复制内容</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { bindEsUserByQrId, findUserInfoByCodeId, deleteEsUser } from '@/api/user'

export default {
  computed: {
    ...mapState(['userInfo'])
  },
  data() {
    return {
      esIds: [],
      loading: true,
      showShareModal: false,
      shareModalType: 'code',
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
      this.refreshDeviceList()
    },
    getDeviceName(esId) {
      return esId.name || esId.nickName || `设备 ${esId.id || esId.esId}`
    },
    isAdmin(esId) {
      const deviceId = esId.id || esId.esId
      const esUsers = this.userInfo && this.userInfo.esUsers || []
      const esUser = esUsers.find(item => item.esId === deviceId)
      return esUser && [1, 2].includes(esUser.esRoleId)
    },
    getDeviceStatus(esId) {
      return 'online'
    },
    showDeviceMenu(esId) {
      const isAdmin = this.isAdmin(esId)
      const menuItems = isAdmin 
        ? ['删除设备'] 
        : ['取消']
      uni.showActionSheet({
        itemList: menuItems,
        itemColor: '#4080f0',
        success: (res) => {
          if (res.tapIndex === 0 && isAdmin) {
            this.deleteDevice(esId)
          }
        }
      })
    },
    selectDevice(esId) {
      const device = typeof esId === 'object' ? esId : { id: esId }
      this.$emit('selectDevice', device)
    },
    deleteDevice(esId) {
      uni.showModal({
        title: '确认删除设备',
        content: `确定移除设备「${this.getDeviceName(esId)}」，删除后无法查看设备数据`,
        confirmText: '确认删除',
        cancelText: '取消',
        confirmColor: '#ee5b5b',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '处理中...' })
            try {
              const userId = this.userInfo.userId
              const areaId = esId.areaId || esId.id || 0
              const levelId = esId.areaLevelId || 0
              const delParams = [{ baseUserInfoId: userId, areaId: areaId, levelId: levelId }]
              const res = await deleteEsUser(delParams)
              if (res.status === 200) {
                uni.showToast({ title: '删除成功', icon: 'success' })
                await this.refreshDeviceList()
                this.$emit('deviceDeleted', esId)
              } else {
                uni.showToast({ title: res.msg || '删除失败', icon: 'none' })
              }
            } catch (err) {
              uni.showToast({ title: '网络异常', icon: 'none' })
            } finally {
              uni.hideLoading()
            }
          }
        }
      })
    },
    showAddOptions() {
      uni.showActionSheet({
        // itemList: ['扫码添加设备', '手动输入编号', '分享我的设备'],
        itemList: ['扫码添加设备', '手动输入编号'],
        itemColor: '#2d3036',
        success: res => {
          if (res.tapIndex === 0) this.scanDevice()
          else if (res.tapIndex === 1) this.showInputModal()
          // else if (res.tapIndex === 2) this.showShareOptions()
        }
      })
    },
    scanDevice() {
      uni.authorize({
        scope: 'scope.camera',
        success: () => this.doScan(),
        fail: () => {
          uni.showModal({
            title: '相机权限',
            content: '需要相机权限扫描设备二维码',
            confirmText: '去设置',
            cancelText: '稍后',
            success: res => res.confirm && uni.openSetting()
          })
        }
      })
    },
    doScan() {
      uni.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode'],
        success: res => {
          let qrId = res.result.trim()
          if (!qrId) return uni.showToast({ title: '识别失败', icon: 'none' })
          let clean = qrId.replace(/[`"'\\s]/g, '')
          const pos = clean.toLowerCase().indexOf('energyqrid=')
          if (pos > -1) {
            let val = clean.slice(pos + 11)
            val = val.split('&')[0]
            qrId = val
          }
          this.validateAndAddDevice(qrId)
        },
        fail: () => uni.showToast({ title: '扫码失败', icon: 'none' })
      })
    },
    showInputModal() {
      uni.showModal({
        title: '绑定设备',
        editable: true,
        placeholderText: '输入设备编号/绑定链接',
        confirmText: '确认绑定',
        cancelText: '取消',
        success: res => {
          if (res.confirm && res.content) {
            let qrId = res.content.trim()
            let clean = qrId.replace(/[`"'\\s]/g, '')
            const pos = clean.toLowerCase().indexOf('energyqrid=')
            if (pos > -1) {
              let val = clean.slice(pos + 11)
              val = val.split('&')[0]
              qrId = val
            }
            this.validateAndAddDevice(qrId)
          }
        }
      })
    },
    validateAndAddDevice(qrId) {
      uni.showModal({
        title: '确认绑定',
        content: '确定绑定该储能设备？',
        success: async res => {
          if (res.confirm) {
            uni.showLoading({ title: '绑定中...' })
            try {
              const uid = this.userInfo.userId
              const res = await bindEsUserByQrId(qrId, uid)
              if (res.status === 200) {
                await this.refreshDeviceList()
                uni.showToast({ title: '绑定成功', icon: 'success' })
                this.$emit('deviceAdded', qrId)
              } else {
                uni.showToast({ title: res.msg || '绑定失败', icon: 'none' })
              }
            } catch {
              uni.showToast({ title: '网络异常', icon: 'none' })
            } finally {
              uni.hideLoading()
            }
          }
        }
      })
    },
    async refreshDeviceList() {
      try {
        const res = await findUserInfoByCodeId(this.userInfo.userId)
        console.log('获取用户设备列表:', res)
        if (res.code === 200 && res.data) {
          this.esIds = res.data.energyStations || []
          const userInfo = { ...this.userInfo }
          userInfo.esIds = this.esIds
          userInfo.esUsers = res.data.es_users || []
          userInfo.roleId = res.data.roleId
          this.$store.commit('SET_LOGIN', userInfo)
        }
      } catch (err) {
        console.error('刷新列表失败', err)
      } finally {
        this.loading = false
      }
    },
    showShareOptions() {
      if (!this.esIds.length) return uni.showToast({ title: '请先添加设备', icon: 'none' })
      const adminList = this.esIds.filter(item => this.isAdmin(item))
      if (!adminList.length) return uni.showToast({ title: '您不是设备管理员', icon: 'none' })
      if (adminList.length === 1) {
        this.shareDevice(adminList[0])
      } else {
        uni.showActionSheet({
          itemList: adminList.map(d => this.getDeviceName(d)),
          success: res => this.shareDevice(adminList[res.tapIndex])
        })
      }
    },
    shareDevice(esId) {
      const name = this.getDeviceName(esId)
      uni.showActionSheet({
        itemList: ['生成8位分享码', '生成分享二维码', '生成分享链接'],
        itemColor: '#4080f0',
        success: res => {
          if (res.tapIndex === 0) {
            this.currentShareCode = this.generateRandomCode()
            this.currentShareDeviceName = name
            this.shareModalType = 'code'
            this.showShareModal = true
          } else if (res.tapIndex === 1) {
            this.generateQRCode(esId, name)
          } else {
            this.currentShareLink = `https://example.com/add-device?code=${this.generateRandomCode()}`
            this.currentShareDeviceName = name
            this.shareModalType = 'link'
            this.showShareModal = true
          }
        }
      })
    },
    handleCopyClick() {
      const text = this.shareModalType === 'code' ? this.currentShareCode : this.currentShareLink
      uni.setClipboardData({
        data: text,
        success: () => uni.showToast({ title: '复制成功', icon: 'success' }),
        fail: () => uni.showToast({ title: '复制失败，请长按', icon: 'none' })
      })
    },
    generateQRCode(esId, name) {
      const code = this.generateRandomCode()
      uni.showModal({
        title: '分享二维码',
        content: `设备：${name}\n分享码：${code}\n他人扫码即可绑定`,
        confirmText: '保存图片',
        cancelText: '关闭',
        success: res => res.confirm && uni.showToast({ title: '已保存相册', icon: 'success' })
      })
    },
    closeShareModal() {
      this.showShareModal = false
    },
    generateRandomCode() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let str = ''
      for (let i = 0; i < 8; i++) str += chars[Math.floor(Math.random() * chars.length)]
      return str
    }
  }
}
</script>

<style scoped lang="scss">
$main-color: #4080f0;
$text-dark: #2d3036;
$text-gray: #868c98;
$line-color: #f0f1f5;
$bg-page: #f5f7fb;
$bg-card: #ffffff;

.page-wrap {
  padding: 32rpx;
  min-height: 100vh;
  box-sizing: border-box;
  background: $bg-page;
}

// 加载状态卡片
.loading-card {
  margin-top: 200rpx;
  padding: 100rpx 40rpx;
  background: $bg-card;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 3rpx 20rpx rgba(64, 128, 240, 0.06);

  .loading-spinner {
    width: 80rpx;
    height: 80rpx;
    border: 6rpx solid rgba(64, 128, 240, 0.1);
    border-top-color: $main-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 32rpx;
  }

  .loading-text {
    font-size: 28rpx;
    color: $text-gray;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// 空状态卡片
.empty-card {
  margin-top: 160rpx;
  padding: 100rpx 40rpx;
  background: $bg-card;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 3rpx 20rpx rgba(64, 128, 240, 0.06);

  .empty-icon-box {
    width: 160rpx;
    height: 160rpx;
    background: #f0f6ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 36rpx;
  }

  .empty-title {
    font-size: 36rpx;
    color: $text-dark;
    font-weight: 500;
    margin-bottom: 12rpx;
  }

  .empty-desc {
    font-size: 26rpx;
    color: $text-gray;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 64rpx;
  }

  .empty-add-btn {
    width: 340rpx;
    height: 90rpx;
    background: $main-color;
    border-radius: 45rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    font-size: 30rpx;
    color: #fff;
    transition: all 0.2s;

    &:active {
      background: #336fd8;
      transform: scale(0.97);
    }
  }
}

// 列表外层卡片
.list-card {
  background: $bg-card;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 3rpx 20rpx rgba(64, 128, 240, 0.06);
}

// 列表头部
.list-header {
  padding: 36rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid $line-color;

  .header-title {
    font-size: 38rpx;
    color: $text-dark;
    font-weight: 500;
  }

  .header-right-group {
    display: flex;
    align-items: center;
    gap: 28rpx;

    .device-total {
      font-size: 26rpx;
      color: $text-gray;
    }

    .header-add-btn {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background: #f0f6ff;
      display: flex;
      align-items: center;
      justify-content: center;

      &:active {
        background: #e0ecff;
      }
    }
  }
}

.device-scroll {
  max-height: calc(100vh - 300rpx);
}

// 单设备条目
.device-item {
  padding: 0 32rpx;
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.device-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx;
  background: $bg-card;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
  transition: all 0.2s;

  &:active {
    transform: scale(0.99);
    box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.06);
  }
}

.device-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
  overflow: hidden;
}

.device-avatar-wrap {
  position: relative;
  width: 96rpx;
  height: 96rpx;
  border-radius: 16rpx;
  background: #f5f7fb;
  overflow: hidden;
  flex-shrink: 0;

  .avatar-img {
    width: 100%;
    height: 100%;
  }

  .status-dot {
    position: absolute;
    bottom: 4rpx;
    right: 4rpx;
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    border: 3rpx solid #fff;

    &.online {
      background: #07c160;
    }

    &.offline {
      background: #9499a4;
    }

    &.alarm {
      background: #ee5b5b;
      animation: pulse 1.5s infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

.info-text {
  flex: 1;
  overflow: hidden;

  .name-line {
    display: flex;
    align-items: center;
    gap: 14rpx;
    margin-bottom: 8rpx;

    .device-name {
      font-size: 32rpx;
      color: $text-dark;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .admin-label {
      font-size: 22rpx;
      padding: 4rpx 12rpx;
      background: linear-gradient(135deg, #fff7ed, #ffedd5);
      color: #ea580c;
      border-radius: 8rpx;
      font-weight: 500;
    }
  }

  .desc-line {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex-wrap: wrap;

    .device-id {
      font-size: 24rpx;
      color: $text-gray;
    }

    .device-area {
      font-size: 24rpx;
      color: $text-gray;
      padding: 2rpx 12rpx;
      background: #f0f1f5;
      border-radius: 6rpx;
    }
  }
}

.device-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
}

.action-group {
  display: flex;
  align-items: center;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;

  &:active {
    background: #f0f1f5;
  }
}

.arrow-icon {
  flex-shrink: 0;
}

// 分享弹窗
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.share-modal {
  width: 660rpx;
  background: $bg-card;
  border-radius: 30rpx;
  overflow: hidden;
}

.modal-head {
  padding: 40rpx 36rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid $line-color;

  .modal-title {
    font-size: 36rpx;
    color: $text-dark;
    font-weight: 500;
  }

  .modal-close {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background: #f5f7fb;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      background: #e9ebf2;
    }
  }
}

.modal-body {
  padding: 40rpx 36rpx;

  .form-row {
    display: flex;
    margin-bottom: 36rpx;

    .form-label {
      width: 160rpx;
      font-size: 28rpx;
      color: $text-gray;
    }

    .form-value {
      flex: 1;
      font-size: 28rpx;
      color: $text-dark;
    }
  }

  .copy-block {
    margin-bottom: 48rpx;

    .copy-label {
      font-size: 28rpx;
      color: $text-gray;
      display: block;
      margin-bottom: 20rpx;
    }

    .code-wrap {
      background: #f0f6ff;
      border: 1rpx solid #d4e4ff;
      padding: 32rpx 28rpx;
      border-radius: 16rpx;
      margin-bottom: 12rpx;

      .code-text {
        font-size: 32rpx;
        color: $main-color;
        font-family: monospace;
        word-break: break-all;
        user-select: text;
      }
    }

    .copy-tip {
      font-size: 24rpx;
      color: #b0b6c2;
    }
  }

  .copy-main-btn {
    width: 100%;
    height: 92rpx;
    background: $main-color;
    border-radius: 46rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    font-size: 32rpx;
    color: #fff;

    &:active {
      background: #336fd8;
      transform: scale(0.97);
    }
  }
}
</style>