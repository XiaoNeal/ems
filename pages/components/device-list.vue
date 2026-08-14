<template>
  <view class="page-wrap">
    <!-- 全局下拉刷新预留区域 -->
    <view class="page-top-gap"></view>

    <view v-if="loading" class="loading-card">
      <view class="loading-spinner"></view>
      <text class="loading-text">正在加载设备列表...</text>
    </view>

    <view v-else>
      <!-- 空设备状态 -->
      <view v-if="esIds.length === 0" class="empty-card">
        <view class="empty-icon-box">
          <uni-icons type="folder-empty" size="96" color="#8cb0e8" />
        </view>
        <text class="empty-title">暂无绑定设备</text>
        <text class="empty-desc">扫码或输入设备编号即可绑定，实时查看设备运行数据</text>
        <button class="empty-add-btn" @click="showAddOptions">
          <uni-icons type="plus" size="26" color="#fff" />
          <text>立即添加设备</text>
        </button>
        <view class="empty-tip-text">一台设备支持多人绑定，管理员拥有全部操作权限</view>
      </view>

      <!-- 设备列表容器 -->
      <view v-else class="list-card">
        <!-- 列表头部 -->
        <view class="list-header">
          <view class="header-left">
            <text class="header-title">我的设备</text>
            <text class="header-subtitle">实时查看设备运行状态</text>
          </view>
          <view class="header-right-group">
            <text class="device-total">共{{ esIds.length }}台</text>
            <view class="header-add-btn" @click="showAddOptions">
              <uni-icons type="plus" size="20" color="#4080f0" />
            </view>
          </view>
        </view>

        <scroll-view scroll-y class="device-scroll" scrollbar-hidden>
          <view v-for="(esId, index) in esIds" :key="index" class="device-card" @click.stop="selectDevice(esId)">
            <view class="device-top">
              <view class="device-left">
                <view class="device-avatar-wrap">
                  <image
                    v-if="esId.imageUrl || esId.imgUrl"
                    :src="esId.imageUrl || esId.imgUrl"
                    mode="aspectFill"
                    class="avatar-img"
                  />
                  <image
                    v-else
                    src="/static/images/device.png"
                    mode="aspectFit"
                    class="avatar-img avatar-default"
                  />
                </view>
                <view class="info-text">
                  <view class="name-line">
                    <text class="device-name">{{ getDeviceName(esId) }}</text>
                    <text v-if="isAdmin(esId)" class="admin-label">管理员</text>
                  </view>
                  <view class="desc-line">
                    <text class="device-id">编号：{{ esId.es_pile_no || '--' }}</text>
                  </view>
                </view>
              </view>
              <uni-icons type="arrowright" size="22" color="#c2c7d2" />
            </view>
            <view class="action-btn" @click.stop="deleteDevice(esId)">
              <uni-icons type="trash" size="14" color="#b3b8c2" />
              <text class="action-text">解绑</text>
            </view>
          </view>
          <!-- 底部留白，避免scroll被底部tab遮挡 -->
          <view class="scroll-bottom-safe"></view>
        </scroll-view>
      </view>
    </view>

    <!-- 分享弹窗 -->
    <view v-if="showShareModal" class="modal-mask" @click="closeShareModal">
      <view class="share-modal" @click.stop>
        <view class="modal-head">
          <text class="modal-title">
            {{ shareModalType === 'code' ? '设备分享码' : '设备分享链接' }}
          </text>
          <view class="modal-close" @click="closeShareModal">
            <uni-icons type="close" size="22" color="#a0a6b2" />
          </view>
        </view>
        <view class="modal-body">
          <view class="form-row">
            <text class="form-label">分享设备</text>
            <text class="form-value">{{ currentShareDeviceName }}</text>
          </view>
          <view class="copy-block">
            <text class="copy-label">
              {{ shareModalType === 'code' ? '分享码（有效期7天）' : '分享链接' }}
            </text>
            <view class="code-wrap">
              <text selectable class="code-text">
                {{ shareModalType === 'code' ? currentShareCode : currentShareLink }}
              </text>
            </view>
            <text class="copy-tip">长按文本可复制，发送给同事即可绑定设备</text>
          </view>
          <button class="copy-main-btn" @tap="handleCopyClick">
            <uni-icons type="copy" size="20" color="#fff" />
            <text>复制分享内容</text>
          </button>
          <text class="share-safe-tip">仅设备管理员可生成分享内容</text>
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
    selectDevice(esId) {
      const device = typeof esId === 'object' ? esId : { id: esId }
      this.$emit('selectDevice', device)
    },
    deleteDevice(esId) {
      uni.showModal({
        title: '解绑设备',
        content: `确定解绑「${this.getDeviceName(esId)}」？解绑后将无法查看该设备的实时与历史数据`,
        confirmText: '确认解绑',
        cancelText: '再想想',
        confirmColor: '#ee5b5b',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '解绑中...' })
            try {
              const userId = this.userInfo.userId
              const areaId = esId.areaId || esId.id || 0
              const levelId = esId.areaLevelId || 0
              const delParams = [{ baseUserInfoId: userId, areaId: areaId, levelId: levelId }]
              const res = await deleteEsUser(delParams)
              if (res.status === 200) {
                uni.showToast({ title: '解绑成功', icon: 'success' })
                await this.refreshDeviceList()
                this.$emit('deviceDeleted', esId)
              } else {
                uni.showToast({ title: res.msg || '解绑失败，请重试', icon: 'none' })
              }
            } catch (err) {
              uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
            } finally {
              uni.hideLoading()
            }
          }
        }
      })
    },
    showAddOptions() {
      uni.showActionSheet({
        itemList: ['扫码添加设备', '手动输入编号绑定'],
        itemColor: '#2d3036',
        success: res => {
          if (res.tapIndex === 0) this.scanDevice()
          else if (res.tapIndex === 1) this.showInputModal()
        }
      })
    },
    scanDevice() {
      uni.authorize({
        scope: 'scope.camera',
        success: () => this.doScan(),
        fail: () => {
          uni.showModal({
            title: '需要相机权限',
            content: '扫码绑定需要相机权限，请前往系统设置开启',
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
          if (!qrId) return uni.showToast({ title: '二维码识别失败', icon: 'none' })
          let clean = qrId.replace(/[`"'\\s]/g, '')
          const pos = clean.toLowerCase().indexOf('energyqrid=')
          if (pos > -1) {
            let val = clean.slice(pos + 11)
            val = val.split('&')[0]
            qrId = val
          }
          this.validateAndAddDevice(qrId)
        },
        fail: () => uni.showToast({ title: '扫码失败，请重新对准二维码', icon: 'none' })
      })
    },
    showInputModal() {
      uni.showModal({
        title: '手动绑定设备',
        editable: true,
        placeholderText: '请输入设备编号',
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
        title: '确认绑定设备',
        content: '绑定成功后即可查看设备运行数据',
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
                uni.showToast({ title: res.msg || '编号不存在，绑定失败', icon: 'none' })
              }
            } catch {
              uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
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
          const userInfo = { ...this.userInfo, ...res.data }
          userInfo.esIds = this.esIds
          userInfo.esUsers = res.data.es_users || []
          if (!userInfo.sessionId) {
            userInfo.sessionId = this.userInfo.sessionId
          }
          this.$store.commit('SET_LOGIN', userInfo)
        }
      } catch (err) {
        console.error('刷新列表失败', err)
      } finally {
        this.loading = false
      }
    },
    showShareOptions() {
      if (!this.esIds.length) return uni.showToast({ title: '请先绑定设备', icon: 'none' })
      const adminList = this.esIds.filter(item => this.isAdmin(item))
      if (!adminList.length) return uni.showToast({ title: '仅设备管理员可生成分享码', icon: 'none' })
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
        itemList: ['生成分享码', '生成分享二维码', '生成分享链接'],
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
        success: () => uni.showToast({ title: '已复制，可直接分享', icon: 'success' }),
        fail: () => uni.showToast({ title: '复制失败，请长按文本复制', icon: 'none' })
      })
    },
    generateQRCode(esId, name) {
      const code = this.generateRandomCode()
      uni.showModal({
        title: '设备分享二维码',
        content: `设备：${name}\n分享码：${code}\n他人扫码即可绑定设备`,
        confirmText: '保存到相册',
        cancelText: '关闭',
        success: res => res.confirm && uni.showToast({ title: '二维码已保存到相册', icon: 'success' })
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
$main-light: #f0f6ff;
$text-dark: #1a1d24;
$text-normal: #444852;
$text-gray: #868c98;
$text-light-gray: #b0b6c2;
$line-color: #eff2f8;
$bg-page: #f7f9fe;
$bg-card: #ffffff;
$warn-orange: #ea580c;
$danger-red: #ee5b5b;
$radius-sm: 12rpx;
$radius-md: 16rpx;
$radius-lg: 24rpx;
$radius-xl: 32rpx;

.page-wrap {
  padding: 0 32rpx;
  min-height: 100vh;
  box-sizing: border-box;
  background: $bg-page;
}
.page-top-gap {
  height: 20rpx;
}
.scroll-bottom-safe {
  height: 160rpx;
}

// 加载状态卡片
.loading-card {
  margin-top: 200rpx;
  padding: 100rpx 40rpx;
  background: $bg-card;
  border-radius: $radius-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 14rpx rgba(64, 128, 240, 0.05);

  .loading-spinner {
    width: 84rpx;
    height: 84rpx;
    border: 6rpx solid rgba(64, 128, 240, 0.08);
    border-top-color: $main-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 36rpx;
  }
  .loading-text {
    font-size: 28rpx;
    color: $text-gray;
  }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

// 空状态卡片
.empty-card {
  margin-top: 200rpx;
  padding: 110rpx 40rpx;
  background: $bg-card;
  border-radius: $radius-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 14rpx rgba(64, 128, 240, 0.05);

  .empty-icon-box {
    width: 180rpx;
    height: 180rpx;
    background: $main-light;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;
  }
  .empty-title {
    font-size: 40rpx;
    color: $text-dark;
    font-weight: 500;
    margin-bottom: 16rpx;
  }
  .empty-desc {
    font-size: 28rpx;
    color: $text-gray;
    text-align: center;
    line-height: 1.7;
    padding: 0 20rpx;
    margin-bottom: 60rpx;
  }
  .empty-add-btn {
    width: 360rpx;
    height: 96rpx;
    background: linear-gradient(135deg, #4080f0, #5996ff);
    border-radius: 48rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14rpx;
    font-size: 32rpx;
    color: #fff;
    box-shadow: 0 6rpx 16rpx rgba(64, 128, 240, 0.22);
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.96);
      box-shadow: 0 2rpx 8rpx rgba(64, 128, 240, 0.15);
    }
  }
  .empty-tip-text {
    margin-top: 32rpx;
    font-size: 24rpx;
    color: $text-light-gray;
  }
}

// 列表外层卡片
.list-card {
  background: $bg-card;
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: 0 2rpx 14rpx rgba(64, 128, 240, 0.05);
}

// 列表头部
.list-header {
  padding: 40rpx 36rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid $line-color;

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    .header-title {
      font-size: 40rpx;
      color: $text-dark;
      font-weight: 600;
    }
    .header-subtitle {
      font-size: 24rpx;
      color: $text-gray;
    }
  }

  .header-right-group {
    display: flex;
    align-items: center;
    gap: 24rpx;
    .device-total {
      font-size: 26rpx;
      color: $text-gray;
    }
    .header-add-btn {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background: $main-light;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      &:active { background: #d4e4ff; }
    }
  }
}

.device-scroll {
  max-height: calc(100vh - 340rpx);
}

// 单设备条目
.device-card {
  display: flex;
  flex-direction: column;
  padding: 32rpx 36rpx 24rpx;
  background: $bg-card;
  border-bottom: 1rpx solid $line-color;
  transition: background 0.2s ease;

  &:last-child { border-bottom: none; }
  &:active { background: #f7f9fe; }
}

.device-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.device-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
  overflow: hidden;
}
.device-avatar-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: $radius-md;
  background: #f3f5fa;
  overflow: hidden;
  flex-shrink: 0;

  .avatar-img { width: 100%; height: 100%; }
  .avatar-default { padding: 8rpx; box-sizing: border-box; }
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
      font-size: 32rpx;
      color: $text-dark;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .admin-label {
      font-size: 22rpx;
      padding: 4rpx 14rpx;
      background: linear-gradient(135deg, #fff7ed, #ffedd5);
      color: $warn-orange;
      border-radius: $radius-sm;
      font-weight: 500;
    }
  }
  .desc-line {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex-wrap: wrap;
    .device-id { font-size: 26rpx; color: $text-gray; }
  }
}

.action-btn {
  align-self: flex-end;
  margin-top: 20rpx;
  padding: 10rpx 20rpx;
  display: flex;
  align-items: center;
  gap: 6rpx;
  border-radius: 24rpx;
  transition: background 0.2s;
  &:active { background: rgba(0, 0, 0, 0.04); }
  .action-text {
    font-size: 22rpx;
    color: #b3b8c2;
  }
}

// 分享弹窗
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.share-modal {
  width: 680rpx;
  background: $bg-card;
  border-radius: $radius-xl;
  overflow: hidden;
}
.modal-head {
  padding: 44rpx 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid $line-color;
  .modal-title {
    font-size: 38rpx;
    color: $text-dark;
    font-weight: 600;
  }
  .modal-close {
    width: 66rpx;
    height: 66rpx;
    border-radius: 50%;
    background: #f3f5fa;
    display: flex;
    align-items: center;
    justify-content: center;
    &:active { background: #e9ebf2; }
  }
}
.modal-body {
  padding: 44rpx 40rpx;
  .form-row {
    display: flex;
    margin-bottom: 40rpx;
    .form-label {
      width: 170rpx;
      font-size: 30rpx;
      color: $text-gray;
    }
    .form-value {
      flex: 1;
      font-size: 30rpx;
      color: $text-dark;
    }
  }
  .copy-block {
    margin-bottom: 52rpx;
    .copy-label {
      font-size: 30rpx;
      color: $text-normal;
      display: block;
      margin-bottom: 22rpx;
    }
    .code-wrap {
      background: $main-light;
      border: 1rpx solid #d4e4ff;
      padding: 36rpx 30rpx;
      border-radius: $radius-lg;
      margin-bottom: 16rpx;
      .code-text {
        font-size: 34rpx;
        color: $main-color;
        font-family: monospace;
        word-break: break-all;
        letter-spacing: 2rpx;
      }
    }
    .copy-tip {
      font-size: 24rpx;
      color: $text-light-gray;
      line-height: 1.6;
    }
  }
  .copy-main-btn {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, #4080f0, #5996ff);
    border-radius: 48rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14rpx;
    font-size: 34rpx;
    color: #fff;
    box-shadow: 0 6rpx 16rpx rgba(64, 128, 240, 0.2);
    transition: all 0.2s;
    &:active {
      transform: scale(0.97);
      box-shadow: 0 2rpx 8rpx rgba(64, 128, 240, 0.12);
    }
  }
  .share-safe-tip {
    display: block;
    margin-top: 28rpx;
    font-size: 24rpx;
    color: $text-light-gray;
    text-align: center;
  }
}
</style>