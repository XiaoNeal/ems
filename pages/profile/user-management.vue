<template>
  <view class="sub-page" :class="platformClass">
    <!-- 导航栏适配顶部安全区 -->
    <DyNavbar title="用户管理" :placeholder="true" safe-area-top />
    <view class="fixed-placeholder"></view>
    
    <!-- 主滚动容器 适配底部安全区 -->
    <scroll-view class="content" scroll-y>
      <!-- 功能操作卡片 -->
      <view class="card-wrap">
        <view class="list-item tap-feedback" @click="showAddModal = true">
          <uni-icons type="plus" size="20" color="#4A90D9" />
          <text class="item-title">添加用户</text>
          <uni-icons class="arrow-icon" type="arrowright" size="24" color="#ccc" />
        </view>
        <view class="divider" />
        <view class="list-item tap-feedback" @click="getUserList">
          <uni-icons type="refresh" :class="['refresh-icon', loading ? 'rotating' : '']" size="20" color="#999" />
          <text class="item-title">刷新列表</text>
        </view>
      </view>

      <!-- Loading 状态 -->
      <view v-if="loading" class="state-wrap">
        <view class="loading-spinner"></view>
        <text class="loading-text">数据加载中...</text>
      </view>

      <!-- 空数据状态 -->
      <view v-else-if="userList.length === 0" class="state-wrap empty-wrap">
        <view class="empty-icon-box">
          <uni-icons type="users" size="80" color="#ddd" />
        </view>
        <text class="empty-title">暂无绑定用户</text>
        <text class="empty-desc">点击上方「添加用户」绑定电站成员</text>
      </view>

      <!-- 用户列表卡片 -->
      <view v-else class="card-wrap">
        <view
          v-for="(user, index) in userList"
          :key="user._key"
          :wx:key="'_key'"
          class="list-item user-item tap-feedback"
        >
          <view class="card-left">
            <view class="user-avatar">
              <text class="avatar-text">{{ (user.user_name && user.user_name.charAt(0)) || '用' }}</text>
            </view>
            <view class="user-info">
              <view class="user-main">
                <text class="user-name">{{ user.user_name || user.screenName || '--' }}</text>
                <view :class="['role-tag', getRoleClass(user.roleId)]">
                  {{ getRoleName(user.roleId) }}
                </view>
              </view>
              <view class="user-meta">
                <text class="user-phone">手机号：{{ user.mobile_phone || '未填写' }}</text>
                <text class="user-time">加入时间：{{ formatDate(user.createTime) }}</text>
              </view>
            </view>
          </view>
          <view class="card-right">
            <view v-if="user.roleId !== 1" class="action-group">
              <view class="action-btn" @click.stop="openSetAdminModal(user)">
                <text class="action-text">分配权限</text>
                <uni-icons type="arrowright" size="22" color="#ccc" />
              </view>
            </view>
            <view v-else class="action-group">
              <view class="action-btn transfer-btn" @click.stop="openTransferModal()">
                <text class="action-text">转移管理员</text>
                <uni-icons type="arrowright" size="22" color="#ccc" />
              </view>
            </view>
          </view>
        </view>
        <!-- 分割线循环渲染 -->
        <view v-for="i in userList.length - 1" :key="i" :wx:key="i" class="divider" />
      </view>

      <!-- 底部安全区留白 避开底部手势条 -->
      <view class="safe-bottom-space"></view>
    </scroll-view>

    <!-- ========== 弹窗容器（置于scroll-view外部避免遮挡）========== -->
    <!-- 添加用户弹窗 -->
    <view v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">添加电站用户</text>
          <view class="modal-close tap-feedback" @click="showAddModal = false">
            <uni-icons type="close" size="28" color="#999" />
          </view>
        </view>
        <scroll-view class="modal-scroll" scroll-y>
          <view class="modal-body">
            <view class="form-item">
              <view class="form-label-wrap">
                <text class="form-label">手机号码</text>
                <text class="required-mark">*</text>
              </view>
              <view class="input-wrap">
                <uni-icons type="phone" size="24" color="#bbb" />
                <input
                  class="form-input"
                  v-model="addTel"
                  placeholder="请输入对方手机号"
                  type="number"
                  maxlength="11"
                />
              </view>
            </view>
            <view class="form-item">
              <view class="form-label-wrap">
                <text class="form-label">微电站ID</text>
                <text class="required-mark">*</text>
              </view>
              <view class="input-wrap">
                <uni-icons type="location" size="24" color="#bbb" />
                <input
                  class="form-input"
                  v-model="esId"
                  placeholder="当前电站ID自动填充"
                  type="number"
                />
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="modal-footer">
          <button class="modal-btn modal-btn-cancel tap-feedback" @click="showAddModal = false">取消</button>
          <button class="modal-btn modal-btn-confirm tap-feedback" @click="bindUser">确认添加</button>
        </view>
      </view>
    </view>

    <!-- 权限分配弹窗 -->
    <view v-if="showSetAdminModal" class="modal-overlay" @click="showSetAdminModal = false">
      <view class="modal-content permission-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">分配用户权限</text>
          <view class="modal-close tap-feedback" @click="showSetAdminModal = false">
            <uni-icons type="close" size="28" color="#999" />
          </view>
        </view>
        <scroll-view class="modal-scroll" scroll-y>
          <view class="modal-body">
            <view class="permission-info">
              <view class="permission-avatar">
                <text class="permission-avatar-text">{{ (selectedUser.user_name && selectedUser.user_name.charAt(0)) || '用' }}</text>
              </view>
              <view class="permission-detail">
                <text class="permission-name">{{ selectedUser.user_name || selectedUser.screenName || '--' }}</text>
                <text class="permission-phone">{{ selectedUser.mobile_phone || '手机号未填写' }}</text>
              </view>
            </view>
            <view class="permission-tip">
              <uni-icons type="info" size="24" color="#FF9800" />
              <text class="tip-text">请为该用户选择操作角色权限</text>
            </view>
            <view class="role-list">
              <view
                v-for="role in roles"
                :key="role.id"
                :wx:key="'id'"
                class="role-item tap-feedback"
                :class="{ active: selectedRole === role.id }"
                @click="selectedRole = role.id"
              >
                <text class="role-name">{{ role.name }}</text>
                <view v-if="selectedRole === role.id" class="role-check">
                  <uni-icons type="check" size="24" color="#fff" />
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="modal-footer">
          <button class="modal-btn modal-btn-cancel tap-feedback" @click="showSetAdminModal = false">取消</button>
          <button class="modal-btn modal-btn-danger tap-feedback" @click="confirmSetAdmin">确认设置</button>
        </view>
      </view>
    </view>

    <!-- 管理员转移弹窗 -->
    <view v-if="showTransferModal" class="modal-overlay" @click="showTransferModal = false">
      <view class="modal-content transfer-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">转移管理员权限</text>
          <view class="modal-close tap-feedback" @click="showTransferModal = false">
            <uni-icons type="close" size="28" color="#999" />
          </view>
        </view>
        <scroll-view class="modal-scroll" scroll-y>
          <view class="modal-body">
            <text class="transfer-hint">请选择接收管理员权限的用户</text>
            <view class="transfer-user-list">
              <view
                v-for="user in normalUsers"
                :key="user._key"
                :wx:key="'_key'"
                class="transfer-user-item tap-feedback"
                :class="{ selected: transferTargetId === user.id }"
                @click="transferTargetId = user.id"
              >
                <view class="transfer-avatar">
                  <text class="transfer-avatar-text">{{ (user.user_name && user.user_name.charAt(0)) || '用' }}</text>
                </view>
                <view class="transfer-user-info">
                  <text class="transfer-user-name">{{ user.user_name || user.screenName || '--' }}</text>
                  <text class="transfer-user-phone">{{ user.mobile_phone || '无手机号' }}</text>
                </view>
                <view v-if="transferTargetId === user.id" class="transfer-check">
                  <uni-icons type="checkmarkempty" size="28" color="#4A90D9" />
                </view>
              </view>
            </view>
            <view class="permission-tip danger-tip">
              <uni-icons type="info" size="24" color="#f56c6c" />
              <text class="tip-text">确认转移后，您将失去管理员权限，仅保留普通用户身份！</text>
            </view>
          </view>
        </scroll-view>
        <view class="modal-footer">
          <button class="modal-btn modal-btn-cancel tap-feedback" @click="showTransferModal = false">取消</button>
          <button class="modal-btn modal-btn-danger tap-feedback" @click="confirmTransfer">确认转移</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getUserInfoByEsId, bindEsUserByTelAndEsId, changeEsUserByTelAndEsId } from '@/api/user.js'
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'

export default {
  components: { DyNavbar },
  name: "UserManagement",
  data() {
    return {
      platformClass: "",
      addTel: '',
      esId: '',
      userList: [],
      loading: true,
      showAddModal: false,
      showSetAdminModal: false,
      showTransferModal: false,
      selectedUser: null,
      transferTargetId: null,
      selectedRole: null,
      roles: [
        { id: 1, name: '管理员' },
        { id: 2, name: '技术人员' },
        { id: 3, name: '测试人员' },
        { id: 4, name: '普通用户' }
      ]
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === "ios" ? "ios-platform" : "android-platform";
      },
    });
  },
  mounted() {
    const currentDevice = this.$store.state.currentSelectDevice || {}
    this.esId = currentDevice.id || currentDevice.esId || ''
    this.getUserList()
  },
  computed: {
    normalUsers() {
      return this.userList.filter(user => user.roleId !== 1)
    }
  },
  methods: {
    async getUserList() {
      this.loading = true
      try {
        const currentDevice = this.$store.state.currentSelectDevice || {}
        const esId = this.esId || currentDevice.id || currentDevice.esId || 3
        const res = await getUserInfoByEsId(esId)
        console.log('getUserList res:', res)
        
        if (res && res.status === 200) {
          this.userList = (res.data || []).map((user, index) => ({
            ...user,
            _key: user.id || index
          }))
        } else {
          uni.showToast({ title: res && res.msg || '获取用户列表失败', icon: 'none' })
        }
      } catch (e) {
        console.error(e)
        uni.showToast({ title: '网络异常，获取失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    async bindUser() {
      if (!this.addTel) {
        uni.showToast({ title: '请输入手机号', icon: 'none' })
        return
      }
      if (!/^1[3-9]\d{9}$/.test(this.addTel)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }
      if (!this.esId) {
        uni.showToast({ title: '微电站ID不能为空', icon: 'none' })
        return
      }

      uni.showLoading({ title: '绑定用户中...' })
      try {
        const res = await bindEsUserByTelAndEsId(this.addTel, this.esId)
        console.log('bindUser res:', res)
        
        if (res && res.status === 200) {
          uni.showToast({ title: '添加成功', icon: 'success' })
          this.addTel = ''
          this.showAddModal = false
          this.getUserList()
        } else {
          uni.showToast({ title: res && res.msg || '添加失败', icon: 'none' })
        }
      } catch (e) {
        console.error(e)
        uni.showToast({ title: '请求失败，请重试', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
    openSetAdminModal(user) {
      this.selectedUser = user
      this.selectedRole = user.roleId || null
      this.showSetAdminModal = true
    },
    openTransferModal() {
      this.transferTargetId = null
      this.showTransferModal = true
    },
    async confirmSetAdmin() {
      if (!this.selectedUser) return
      
      const tel = this.selectedUser.mobile_phone
      if (!tel) {
        uni.showToast({ title: '该用户无手机号，无法修改权限', icon: 'none' })
        return
      }

      uni.showLoading({ title: '权限设置中...' })
      try {
        const currentDevice = this.$store.state.currentSelectDevice || {}
        const esId = this.esId || currentDevice.id || currentDevice.esId || 3
        const response = await changeEsUserByTelAndEsId(tel, esId)
        console.log('confirmSetAdmin response:', response)
        
        if (response && response.status === 200) {
          uni.showToast({ title: '权限设置成功', icon: 'success' })
          this.showSetAdminModal = false
          this.getUserList()
        } else {
          uni.showToast({ title: response && response.msg || '设置失败', icon: 'none' })
        }
      } catch (e) {
        console.error(e)
        uni.showToast({ title: '操作失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
    async confirmTransfer() {
      if (!this.transferTargetId) {
        uni.showToast({ title: '请选择接收权限的用户', icon: 'none' })
        return
      }
      
      const targetUser = this.userList.find(user => user.id === this.transferTargetId)
      if (!targetUser) {
        uni.showToast({ title: '用户数据异常', icon: 'none' })
        return
      }

      const tel = targetUser.mobile_phone
      if (!tel) {
        uni.showToast({ title: '目标用户未填写手机号', icon: 'none' })
        return
      }

      uni.showLoading({ title: '权限转移中...' })
      try {
        const currentDevice = this.$store.state.currentSelectDevice || {}
        const esId = this.esId || currentDevice.id || currentDevice.esId || 3
        const response = await changeEsUserByTelAndEsId(tel, esId)
        console.log('confirmTransfer response:', response)
        
        if (response && response.status === 200) {
          uni.showToast({ title: '管理员转移完成', icon: 'success' })
          this.showTransferModal = false
          this.getUserList()
        } else {
          uni.showToast({ title: response && response.msg || '转移失败', icon: 'none' })
        }
      } catch (e) {
        console.error(e)
        uni.showToast({ title: '网络异常，请重试', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '--'
      const safeDateStr = dateStr.replace(/-/g, '/')
      const date = new Date(safeDateStr)
      if (isNaN(date.getTime())) return '--'
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${month}-${day}`
    },
    getRoleName(roleId) {
      const role = this.roles.find(r => r.id === roleId)
      return role ? role.name : '普通用户'
    },
    getRoleClass(roleId) {
      const roleMap = {
        1: 'role-admin',
        2: 'role-technician',
        3: 'role-tester',
        4: 'role-user'
      }
      return roleMap[roleId] || 'role-user'
    }
  }
}
</script>

<style lang="scss" scoped>
$primary: #4A90D9;
$danger: #FF6B6B;
$warning: #FF9800;
$text-dark: #333;
$text-normal: #666;
$text-light: #999;
$bg-page: #f5f7fa;
$bg-card: #ffffff;
$bg-gray: #f8fafc;
$border-line: #eee;

.sub-page {
  min-height: 100vh;
  background: $bg-page;

  &.android-platform {
    .fixed-placeholder {
       height: calc(25px + 44px + 20px);
      background: #fff;
    }
  }
  
  &.ios-platform {
    .fixed-placeholder {
      height: calc(44px);
      background: #fff;
    }
  }
}


.content {
  padding: 24rpx;
}

.card-wrap {
  background: $bg-card;
  border-radius: 20rpx;
  padding: 0 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 24rpx;
  overflow: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 0;
  position: relative;
}

.tap-feedback {
  &:active {
    background: rgba(74, 144, 217, 0.06);
  }
}

.item-title {
  flex: 1;
  margin-left: 24rpx;
  font-size: 30rpx;
  color: $text-dark;
}

.divider {
  height: 1rpx;
  background: rgba(0, 0, 0, 0.05);
}

.arrow-icon {
  flex-shrink: 0;
}

// 刷新旋转动画
.refresh-icon {
  transition: transform 0.5s ease;
}
.refresh-icon.rotating {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 空/加载状态
.state-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 40rpx;
}
.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 4rpx solid #e8edf3;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 32rpx;
}
.loading-text {
  font-size: 28rpx;
  color: $text-light;
}
.empty-wrap {
  .empty-icon-box {
    width: 180rpx;
    height: 180rpx;
    background: $bg-gray;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 36rpx;
  }
  .empty-title {
    font-size: 36rpx;
    font-weight: 600;
    color: $text-dark;
    margin-bottom: 16rpx;
  }
  .empty-desc {
    font-size: 26rpx;
    color: $text-light;
    text-align: center;
    line-height: 1.6;
  }
}

.user-item {
  align-items: center;
  gap: 16rpx;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
  min-width: 0;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #E8F0FE, #D4E1FF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 32rpx;
  color: $primary;
  font-weight: 600;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-main {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.user-name {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-dark;
}

.role-tag {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.role-admin {
  color: #fff;
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
}

.role-user {
  color: $text-normal;
  background: $bg-gray;
}

.role-technician {
  color: #fff;
  background: linear-gradient(135deg, #4A90D9, #6BB3FF);
}

.role-tester {
  color: #333;
  background: linear-gradient(135deg, #FFD93D, #FFE66D);
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  margin-top: 8rpx;
}

.user-phone, .user-time {
  font-size: 24rpx;
  color: $text-light;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 4rpx;
}

.action-group {
  display: flex;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  background: rgba(74, 144, 217, 0.08);
  &:active {
    background: rgba(74, 144, 217, 0.15);
  }
}

.action-text {
  font-size: 24rpx;
  color: $primary;
}

.transfer-btn {
  background: rgba(255, 152, 0, 0.08);
  &:active {
    background: rgba(255, 152, 0, 0.15);
  }
}

.transfer-btn .action-text {
  color: $warning;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  width: 100%;
  max-height: 85vh;
  background: $bg-card;
  border-radius: 32rpx 32rpx 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-scroll {
  flex: 1;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid $border-line;
}

.modal-title {
  font-size: 34rpx;
  font-weight: 600;
  color: $text-dark;
}

.modal-close {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: $bg-gray;
}

.modal-body {
  padding: 32rpx;
}

.modal-footer {
  display: flex;
  gap: 24rpx;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + var(--safe-area-inset-bottom));
  border-top: 1rpx solid $border-line;
}

.modal-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
}

.modal-btn-cancel {
  background: $bg-gray;
  color: $text-normal;
}

.modal-btn-confirm {
  background: linear-gradient(135deg, #4A90D9, #6BB3FF);
  color: #fff;
}

.modal-btn-danger {
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  color: #fff;
}

// 表单模块
.form-item {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 32rpx;
}
.form-label-wrap {
  display: flex;
  align-items: center;
}
.form-label {
  font-size: 30rpx;
  color: $text-normal;
}
.required-mark {
  color: $danger;
  margin-left: 6rpx;
}
.input-wrap {
  display: flex;
  align-items: center;
  background: $bg-gray;
  border-radius: 18rpx;
  padding: 0 30rpx;
  height: 100rpx;
  gap: 20rpx;
}
.form-input {
  flex: 1;
  font-size: 30rpx;
  color: $text-dark;
  background: transparent;
}

// 权限弹窗样式
.permission-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 36rpx;
}
.permission-avatar {
  width: 96rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #4A90D9, #6BB3FF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.permission-avatar-text {
  font-size: 38rpx;
  color: #fff;
  font-weight: 600;
}
.permission-detail {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.permission-name {
  font-size: 34rpx;
  font-weight: 600;
  color: $text-dark;
}
.permission-phone {
  font-size: 26rpx;
  color: $text-light;
}
.permission-tip {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 24rpx;
  background: #fff8e1;
  border-radius: 16rpx;
  margin-bottom: 32rpx;
}
.danger-tip {
  background: #fff2f2;
}
.tip-text {
  flex: 1;
  font-size: 26rpx;
  line-height: 1.7;
  color: $warning;
}
.danger-tip .tip-text {
  color: $danger;
}
.role-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.role-item {
  flex: 0 0 calc(50% - 20rpx);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx;
  background: $bg-gray;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
}
.role-item.active {
  background: rgba(74, 144, 217, 0.12);
  border-color: $primary;
}
.role-name {
  font-size: 30rpx;
  color: $text-dark;
}
.role-item.active .role-name {
  color: $primary;
  font-weight: 500;
}
.role-check {
  width: 44rpx;
  height: 44rpx;
  background: $primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 转移管理员弹窗
.transfer-modal {
  max-width: 700rpx;
}
.transfer-hint {
  font-size: 30rpx;
  color: $text-normal;
  margin-bottom: 24rpx;
}
.transfer-user-list {
  max-height: 420rpx;
  margin-bottom: 32rpx;
}
.transfer-user-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: $bg-gray;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  border: 2rpx solid transparent;
}
.transfer-user-item.selected {
  background: #e8f0fe;
  border-color: $primary;
}
.transfer-avatar {
  width: 72rpx;
  height: 72rpx;
  background: linear-gradient(135deg, #4A90D9, #6BB3FF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}
.transfer-avatar-text {
  font-size: 30rpx;
  color: #fff;
  font-weight: 600;
}
.transfer-user-info {
  flex: 1;
}
.transfer-user-name {
  font-size: 30rpx;
  color: $text-dark;
  font-weight: 500;
  display: block;
  margin-bottom: 6rpx;
}
.transfer-user-phone {
  font-size: 26rpx;
  color: $text-light;
}
.transfer-check {
  width: 52rpx;
  height: 52rpx;
  background: $primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>