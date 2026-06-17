<template>
  <view class="page-wrap">
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
        <view
          v-for="(esId, index) in esIds"
          :key="index"
          class="device-item"
        >
          <!-- 设备信息行（带右侧箭头） -->
          <view class="info-row" @click.stop="selectDevice(esId)">
            <view class="device-avatar">
              <image
                v-if="esId.imageUrl || esId.imgUrl"
                :src="esId.imageUrl || esId.imgUrl"
                mode="aspectFill"
                class="avatar-img"
              />
              <image
                v-else
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20energy%20storage%20device%20icon%20modern%20minimal%20style&image_size=square"
                mode="aspectFill"
                class="avatar-img"
              />
            </view>
            <view class="info-text">
              <view class="name-line">
                <text class="device-name">{{ getDeviceName(esId) }}</text>
                <text v-if="isAdmin(esId)" class="admin-label">管理员</text>
              </view>
              <text class="device-id">设备ID：{{ esId.esId || esId.id }}</text>
            </view>
            <uni-icons type="arrowright" size="22" color="#d0d3d9" class="arrow-icon" />
          </view>
          <!-- 单独一行删除按钮，仅垃圾桶图标 -->
          <view class="delete-row">
            <view class="delete-circle-btn" @click.stop="deleteDevice(esId)">
              <uni-icons type="trash" size="19" color="#9499a4" />
            </view>
          </view>
        </view>
      </scroll-view>
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
      if (this.userInfo && this.userInfo.esIds) {
        this.esIds = Array.isArray(this.userInfo.esIds) ? this.userInfo.esIds : []
      } else {
        this.esIds = []
      }
    },
    getDeviceName(esId) {
      return `设备 ${esId.name}`
    },
    isAdmin(esId) {
      return typeof esId === 'object'
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
        itemList: ['扫码添加设备', '手动输入编号', '分享我的设备'],
        itemColor: '#2d3036',
        success: res => {
          if (res.tapIndex === 0) this.scanDevice()
          else if (res.tapIndex === 1) this.showInputModal()
          else if (res.tapIndex === 2) this.showShareOptions()
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
        if (res?.data?.energyStations && Array.isArray(res.data.energyStations)) {
          this.esIds = res.data.energyStations
        }
      } catch (err) {
        console.error('刷新列表失败', err)
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
  padding: 32rpx;
  border-bottom: 1rpx solid $line-color;
  &:last-child {
    border-bottom: none;
  }
  .info-row {
    display: flex;
    align-items: center;
    gap: 26rpx;
    margin-bottom: 26rpx;
  }
  .device-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 18rpx;
    background: #f0f6ff;
    overflow: hidden;
    flex-shrink: 0;
    .avatar-img {
      width: 100%;
      height: 100%;
    }
  }
  .info-text {
    flex: 1;
    overflow: hidden;
    .name-line {
      display: flex;
      align-items: center;
      gap: 16rpx;
      margin-bottom: 10rpx;
      .device-name {
        font-size: 34rpx;
        color: $text-dark;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .admin-label {
        font-size: 22rpx;
        padding: 4rpx 14rpx;
        background: #fff2e0;
        color: #e68a20;
        border-radius: 10rpx;
      }
    }
    .device-id {
      font-size: 26rpx;
      color: $text-gray;
    }
  }
  .arrow-icon {
    flex-shrink: 0;
  }
  // 删除按钮行
  .delete-row {
    display: flex;
    justify-content: flex-end;
    .delete-circle-btn {
      width: 68rpx;
      height: 68rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      transition: background 0.2s;
      &:active {
        background: #f0f1f5;
      }
    }
  }
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