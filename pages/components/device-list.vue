<template>
  <view class="page-wrap">
    <!-- 顶部概览 -->
    <view class="page-hero">
      <view class="hero-decor hero-decor-one"></view>
      <view class="hero-decor hero-decor-two"></view>
      <view class="hero-top">
        <view class="hero-titles">
          <view class="hero-title-row">
            <text class="hero-title">我的设备</text>
            <text v-if="!loading" class="hero-count">{{ esIds.length }} 台</text>
          </view>
          <text class="hero-subtitle">实时查看设备运行状态</text>
        </view>
        <view class="hero-add-btn" @click="showAddOptions">
          <uni-icons type="plus" size="16" color="#ffffff" />
          <text class="hero-add-text">添加设备</text>
        </view>
      </view>
      <view class="hero-foot">
        <view class="hero-stat">
          <view class="stat-dot"></view>
          <text class="stat-text">{{ loading ? '正在同步设备信息' : '已绑定 ' + esIds.length + ' 台设备' }}</text>
        </view>
        <text v-if="!loading && esIds.length > 0" class="hero-tip">点击卡片进入实时监测</text>
      </view>
    </view>

    <view v-if="loading" class="state-card loading-card">
      <view class="loading-spinner"></view>
      <text class="loading-text">正在加载设备列表...</text>
    </view>

    <view v-else-if="esIds.length === 0" class="state-card empty-card">
      <view class="empty-icon-box">
        <uni-icons type="folder-empty" size="72" color="#7fa8ef" />
      </view>
      <text class="empty-title">暂无绑定设备</text>
      <text class="empty-desc">扫码或输入设备编号即可绑定，实时查看设备运行数据</text>
      <button class="empty-add-btn" @click="showAddOptions">
        <uni-icons type="plus" size="18" color="#fff" />
        <text>立即添加设备</text>
      </button>
      <text class="empty-tip-text">一台设备支持多人绑定，管理员拥有全部操作权限</text>
    </view>

    <view v-else class="device-list">
      <view v-for="(esId, index) in esIds" :key="index" class="device-card" @click.stop="selectDevice(esId)">
        <view class="card-main">
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
            <view class="device-name">{{ getDeviceName(esId) }}</view>
            <view class="meta-row">
              <text v-if="isAdmin(esId)" class="role-chip">管理员</text>
              <text class="device-id">编号：{{ esId.es_pile_no || '--' }}</text>
            </view>
          </view>
          <view class="arrow-box">
            <uni-icons type="arrowright" size="18" color="#b6c0d0" />
          </view>
        </view>
        <view class="card-foot">
          <view class="enter-hint">
            <view class="hint-dot"></view>
            <text class="hint-text">查看实时数据</text>
          </view>
          <view class="unbind-btn" @click.stop="deleteDevice(esId)">
            <uni-icons type="trash" size="14" color="#98a2b2" />
            <text class="unbind-text">解绑</text>
          </view>
        </view>
      </view>
      <view class="list-bottom-gap"></view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { bindEsUserByQrId, getUserCenterInfo, deleteEsUser } from '@/api/user'

export default {
  props: {
    // 被 index.vue 内嵌时由父级统一拉取，避免父级 fetchDeviceList 与本组件 mounted 重复请求
    autoFetch: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  data() {
    return {
      esIds: [],
      loading: true
    }
  },
  watch: {
    // 统一从 Vuex 登录态同步列表：父级 fetchDeviceList / 本组件绑定解绑后的 SET_LOGIN 都会更新
    'userInfo.esIds': {
      handler(val) {
        if (Array.isArray(val)) {
          this.esIds = val
          this.loading = false
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.autoFetch) {
      this.initEsIds()
    }
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
      if (!this.userInfo || !this.userInfo.sessionId) {
        this.loading = false
        return
      }
      try {
        const userId = this.userInfo.userId
        let stations = []
        let userData = {}
        // 站点清单统一取用户中心接口返回的 energyStations（内部按 ES 用户查 user_es_mapping），
        // 账号密码登录与手机号/验证码登录同源，不再额外调 /api/energyStation/findEnergyStation：
        // 那个接口的 userId 属于另一套用户体系，传 ES 用户 id 只会返回空数组，会把已登录的站点覆盖成 0 台。
        const userInfoRes = await getUserCenterInfo(userId)
        const fetched = (userInfoRes && userInfoRes.code === 200 && userInfoRes.data) ? userInfoRes.data : null
        userData = fetched || {}
        if (fetched) {
          stations = (userData.energyStations || []).map(item => ({ ...item, esId: item.esId || item.id }))
        } else {
          // 接口异常时回退到登录态已缓存的清单，避免把已有设备清空
          stations = this.userInfo.energyStations || this.userInfo.esIds || []
        }
        this.esIds = stations
        const userInfo = { ...this.userInfo, ...userData }
        userInfo.esIds = stations
        userInfo.esUsers = userData.es_users || []
        if (!userInfo.sessionId) {
          userInfo.sessionId = this.userInfo.sessionId
        }
        this.$store.commit('SET_LOGIN', userInfo)
        this.$emit('deviceListUpdated', stations)
      } catch (err) {
        console.error('刷新列表失败', err)
      } finally {
        this.loading = false
      }
    },
  }
}
</script>

<style scoped lang="scss">
$main-color: #3b7bf0;
$main-light: #eaf2ff;
$text-dark: #1c2432;
$text-normal: #5c6676;
$text-gray: #8b95a6;
$text-light-gray: #a8b1c0;
$line-color: #edf1f7;
$bg-page: #f4f7fc;
$bg-card: #ffffff;
$warn-orange: #c2691f;
$danger-red: #ee5b5b;
$radius-sm: 12rpx;
$radius-md: 16rpx;
$radius-lg: 24rpx;
$radius-xl: 28rpx;

.page-wrap {
  padding: 24rpx 28rpx 40rpx;
  min-height: 100vh;
  box-sizing: border-box;
  background: $bg-page;
}

// 顶部概览卡
.page-hero {
  position: relative;
  overflow: hidden;
  padding: 36rpx 32rpx 26rpx;
  margin-bottom: 28rpx;
  border-radius: $radius-xl;
  background: linear-gradient(120deg, #e8f1ff 0%, #f4f8ff 52%, #e6efff 100%);
  border: 1rpx solid #e0ebff;
}
.hero-decor {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.hero-decor-one {
  width: 240rpx;
  height: 240rpx;
  right: -80rpx;
  top: -130rpx;
  background: rgba(255, 255, 255, 0.55);
}
.hero-decor-two {
  width: 150rpx;
  height: 150rpx;
  right: 60rpx;
  bottom: -110rpx;
  background: rgba(255, 255, 255, 0.38);
}
.hero-top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hero-titles {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.hero-title-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
}
.hero-title {
  font-size: 40rpx;
  font-weight: 700;
  color: $text-dark;
  letter-spacing: 1rpx;
}
.hero-count {
  font-size: 22rpx;
  font-weight: 600;
  color: $main-color;
  background: #ffffff;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(59, 123, 240, 0.1);
}
.hero-subtitle {
  font-size: 24rpx;
  color: #7b8aa3;
}
.hero-add-btn {
  position: relative;
  flex-shrink: 0;
  height: 64rpx;
  padding: 0 24rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: linear-gradient(135deg, #4b89f5, #2f6ae0);
  box-shadow: 0 8rpx 18rpx rgba(59, 123, 240, 0.26);
  transition: transform 0.2s ease;
  &:active { transform: scale(0.96); }
  .hero-add-text {
    font-size: 26rpx;
    font-weight: 500;
    color: #ffffff;
    white-space: nowrap;
  }
}
.hero-foot {
  position: relative;
  margin-top: 30rpx;
  padding-top: 22rpx;
  border-top: 1rpx solid rgba(120, 155, 215, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hero-stat {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.stat-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: $main-color;
  box-shadow: 0 0 0 6rpx rgba(59, 123, 240, 0.12);
}
.stat-text {
  font-size: 24rpx;
  color: #5d7093;
}
.hero-tip {
  font-size: 22rpx;
  color: #94a3bd;
}

// 加载 / 空状态通用卡
.state-card {
  margin-top: 120rpx;
  padding: 90rpx 40rpx;
  background: $bg-card;
  border-radius: $radius-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6rpx 24rpx rgba(30, 64, 120, 0.05);
  border: 1rpx solid #f0f3f9;
}
.loading-spinner {
  width: 84rpx;
  height: 84rpx;
  border: 6rpx solid rgba(59, 123, 240, 0.1);
  border-top-color: $main-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 36rpx;
}
.loading-text {
  font-size: 28rpx;
  color: $text-gray;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-card {
  padding: 80rpx 40rpx 72rpx;

  .empty-icon-box {
    width: 172rpx;
    height: 172rpx;
    background: linear-gradient(145deg, #eaf2ff, #dce9ff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;
  }
  .empty-title {
    font-size: 38rpx;
    color: $text-dark;
    font-weight: 600;
    margin-bottom: 16rpx;
  }
  .empty-desc {
    font-size: 26rpx;
    color: $text-gray;
    text-align: center;
    line-height: 1.7;
    padding: 0 20rpx;
    margin-bottom: 56rpx;
  }
  .empty-add-btn {
    width: 360rpx;
    height: 92rpx;
    background: linear-gradient(135deg, #4b89f5, #2f6ae0);
    border-radius: 46rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    font-size: 30rpx;
    color: #fff;
    box-shadow: 0 8rpx 20rpx rgba(59, 123, 240, 0.24);
    transition: all 0.2s ease;

    &:active {
      transform: scale(0.96);
      box-shadow: 0 2rpx 8rpx rgba(59, 123, 240, 0.15);
    }
  }
  .empty-tip-text {
    margin-top: 32rpx;
    font-size: 24rpx;
    color: $text-light-gray;
    text-align: center;
  }
}

// 设备卡片列表
.device-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.device-card {
  background: $bg-card;
  border-radius: 26rpx;
  padding: 28rpx 28rpx 0;
  border: 1rpx solid #f0f3f9;
  box-shadow: 0 6rpx 24rpx rgba(30, 64, 120, 0.06);
  overflow: hidden;
  transition: transform 0.2s ease, background 0.2s ease;

  &:active {
    background: #fbfcff;
    transform: scale(0.995);
  }
}
.card-main {
  display: flex;
  align-items: center;
  gap: 22rpx;
}
.device-avatar-wrap {
  width: 112rpx;
  height: 112rpx;
  flex-shrink: 0;
  border-radius: 22rpx;
  background: linear-gradient(145deg, #eaf2ff, #dce9ff);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .avatar-img { width: 100%; height: 100%; }
  .avatar-default { padding: 6rpx; box-sizing: border-box; }
}
.info-text {
  flex: 1;
  min-width: 0;
}
.device-name {
  font-size: 32rpx;
  font-weight: 600;
  color: $text-dark;
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}
.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
}
.role-chip {
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 20rpx;
  font-weight: 500;
  line-height: 1.6;
  color: $warn-orange;
  background: #fff4e8;
  border: 1rpx solid #ffe3c2;
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
}
.device-id {
  font-size: 24rpx;
  color: $text-gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.arrow-box {
  flex-shrink: 0;
  width: 36rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.card-foot {
  margin: 26rpx -28rpx 0;
  padding: 0 28rpx;
  height: 76rpx;
  box-sizing: border-box;
  border-top: 1rpx solid $line-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.enter-hint {
  display: flex;
  align-items: center;
  gap: 10rpx;
  .hint-dot {
    width: 10rpx;
    height: 10rpx;
    border-radius: 50%;
    background: #95b6f0;
  }
  .hint-text {
    font-size: 24rpx;
    color: #8aa0c4;
  }
}
.unbind-btn {
  height: 48rpx;
  padding: 0 20rpx;
  border-radius: 24rpx;
  background: #f4f6fb;
  display: flex;
  align-items: center;
  gap: 6rpx;
  transition: background 0.2s;
  &:active { background: #e8edf7; }
  .unbind-text {
    font-size: 24rpx;
    color: $text-gray;
  }
}
.list-bottom-gap {
  height: 48rpx;
}

</style>