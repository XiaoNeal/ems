<template>
  <view class="container" :class="platformClass">
    <DyNavbar title="操作记录" :placeholder="true" />
    <view class="fixed-placeholder"></view>
    
    <!-- 内容区域 -->
    <scroll-view class="content" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true" @scrolltolower="onScrollToLower" @scroll="onScroll">
      <!-- 加载中状态 -->
      <view v-if="loading" class="loading-state">
        <view class="loading-illustration">
          <view class="loading-spinner"></view>
        </view>
        <view class="loading-content">
          <text class="loading-text">加载中...</text>
        </view>
      </view>
      <!-- 空状态 -->
      <view v-else-if="operationList.length === 0" class="empty-state">
        <view class="empty-illustration">
          <view class="illustration-bg"></view>
          <view class="illustration-main">
            <uni-icons type="calendar" size="48" color="#4488FB"></uni-icons>
          </view>
          <view class="illustration-decoration">
            <view class="deco-dot"></view>
            <view class="deco-line"></view>
            <view class="deco-dot"></view>
          </view>
        </view>
        <view class="empty-content">
          <text class="empty-title">暂无操作记录</text>
          <text class="empty-desc">您还没有任何操作记录</text>
          <text class="empty-hint">操作数据将会在这里显示</text>
        </view>
      </view>
      <!-- 操作记录列表 -->
      <view v-else>
        <view class="operation-item" v-for="operation in operationList" :key="operation._key">
          <view class="operation-header">
            <text class="header-title">{{ getOperationName(operation) }}</text>
            <text class="header-device">{{ getDeviceTypeName(operation) }}</text>
          </view>
          <view class="operation-body">
            <view v-for="param in operation.parsedParams" :key="param._key">
              <view v-for="cmd in (param.commands || [])" :key="cmd._key" class="cmd-row">
                <text class="cmd-label">参数值：</text>
                <text class="cmd-value">{{ getParamValue(cmd.deviceCategory, cmd.registerAddress, cmd.registerValue) }}</text>
              </view>
              <view v-if="isAdmin" class="cmd-row">
                <text class="cmd-label">设备类型：</text>
                <text class="cmd-value">{{ (param.commands && param.commands[0] && param.commands[0].deviceCategory) || '--' }}</text>
              </view>
              <view v-if="isAdmin" class="cmd-row">
                <text class="cmd-label">idcode：</text>
                <text class="cmd-value">{{ param.idCode || '--' }}</text>
              </view>
              <view v-if="isAdmin" class="cmd-row">
                <text class="cmd-label">寄存器地址：</text>
                <text class="cmd-value">{{ (param.commands && param.commands[0] && param.commands[0].registerAddress) || '--' }}</text>
              </view>
            </view>
          </view>
          <view class="operation-footer">
            <text class="footer-username">{{ operation.username || '--' }}</text>
            <text class="footer-time">{{ formatTime(operation.createTime) }}</text>
          </view>
        </view>
      </view>
      
      <view v-if="isLoadingMore" class="loading-more">
        <uni-loading-icon size="18" color="#4488FB"></uni-loading-icon>
        <text>加载中...</text>
      </view>
      <view v-else-if="operationList.length > 0 && operationList.length >= totalCount" class="no-more">
        已加载全部
      </view>
      
      <view class="footer-space"></view>
    </scroll-view>
    
    <view v-if="showBackTop" class="back-top-btn" @click="onBackTop">
      <uni-icons type="arrowup" size="28" color="#fff" />
    </view>
  </view>
</template>

<script>
import { queryQuickControlLog, getOperationLogByUserId } from '@/api/alarm.js'
import { getParamInfo } from '@/utils/device-params.js'
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'

export default {
  components: { DyNavbar },
  name: "OperationRecord",
  data() {
    return {
      platformClass: "",
      loading: true,
      operationList: [],
      showBackTop: false,
      scrollTop: 0,
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      isLoadingMore: false
    };
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === "ios" ? "ios-platform" : "android-platform";
      },
    });
  },
  computed: {
    userId() {
      return this.$store.state.userInfo?.userId || this.$store.state.user?.id || 0
    },
    isAdmin() {
      // const currentRoleId = this.$store.state.currentEsRoleId || this.$store.state.userInfo?.roleId || this.$store.state.user?.roleId
      // return [1, 4].includes(currentRoleId)
        const currentRoleId = this.$store.state.currentEsRoleId 
      return [4].includes(currentRoleId)
    }
  },
  mounted() {
    this.getOperationList()
  },
  methods: {
    async getOperationList(isLoadMore = false) {
      if (isLoadMore && this.isLoadingMore) return
      if (isLoadMore) {
        this.isLoadingMore = true
      }
      
      try {

        console.log(this.userInfo, this.$store.state, 'this.userId')
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        if (!this.isAdmin) {
          params.userId = this.userId
        }
        const res = await getOperationLogByUserId(params)

        console.log(res, "-----------------operationLog-------")

        const rawList = res.data?.content || res.data?.list || res.data || []
        const total = res.data?.totalElements || res.data?.total || null
        
        if (total !== null) {
          this.totalCount = total
        } else if (!isLoadMore) {
          this.totalCount = rawList.length
        }
        
        if (rawList.length < this.pageSize) {
          this.totalCount = Math.min(this.totalCount, this.operationList.length + rawList.length)
        }
        
        const parsedList = rawList.map((op, opIndex) => {
          const parsedParams = this.parseJson(op.params)
          return {
            ...op,
            _key: op.id || opIndex,
            parsedParams: parsedParams.map((param, paramIndex) => {
              const commands = param.commands || []
              return {
                ...param,
                _key: paramIndex,
                commands: commands.map((cmd, cmdIndex) => ({
                  ...cmd,
                  _key: cmdIndex
                }))
              }
            })
          }
        }).sort((a, b) => {
          return new Date(b.createTime) - new Date(a.createTime)
        })

        if (isLoadMore) {
          this.operationList = [...this.operationList, ...parsedList]
        } else {
          this.operationList = parsedList
        }

        console.log(res, "-----------------operationLog-------")
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
        this.isLoadingMore = false
      }
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    parseJson(str) {
      try {
        return JSON.parse(str)
      } catch (e) {
        return []
      }
    },
    parseResult(str) {
      try {
        const result = JSON.parse(str)
        return result.msg || JSON.stringify(result)
      } catch (e) {
        return str || '--'
      }
    },
    getDeviceTypeName(operation) {
      const deviceTypeMap = {
        '171F': 'EMS',
        '171B': 'PCS',
        '171D': '储能DC',
        '171E': '光伏DC',
        '171C': 'BMS'
      }
      
      if (operation.parsedParams && operation.parsedParams.length > 0) {
        const param = operation.parsedParams[0]
        if (param.commands && param.commands.length > 0) {
          const deviceCategory = param.commands[0].deviceCategory
          return deviceTypeMap[deviceCategory] || deviceCategory || '--'
        }
      }
      
      return '--'
    },
    getOperationName(operation) {
      if (operation.parsedParams && operation.parsedParams.length > 0) {
        const param = operation.parsedParams[0]
        if (param.commands && param.commands.length > 0) {
          const cmd = param.commands[0]
          return getParamInfo(cmd.deviceCategory, cmd.registerAddress)?.label || '参数设置'
        }
      }
      return '参数设置'
    },
    getParamName(deviceCategory, registerAddress) {
      if (!deviceCategory || !registerAddress) {
        return '--'
      }
      const field = registerAddress
      const paramInfo = getParamInfo(deviceCategory, field)

      // console.log(paramInfo,field, deviceCategory,"-----------------paramInfo-------")
      if (paramInfo) {
        return paramInfo.label || '--'  
      }
      return field 
    },
    getParamValue(deviceCategory, registerAddress, registerValue) {
      if (!registerValue) {
        return registerValue || '--'
      }
      const field = registerAddress
      const paramInfo = getParamInfo(deviceCategory, field)
      
      // 如果有transform函数，使用转换函数处理
      if (paramInfo && paramInfo.transform) {
        return paramInfo.transform(registerValue)
      }
      
      // 如果有valueMap，优先使用映射值
      if (paramInfo && paramInfo.valueMap) {
        const mappedValue = paramInfo.valueMap[registerValue]
        if (mappedValue) {
          return mappedValue
        }
      }
      
      // 如果有ratio，进行倍率转换
      if (paramInfo && paramInfo.ratio !== undefined && paramInfo.ratio !== 1) {
        const rawValue = paramInfo.hex16 ? parseInt(registerValue, 16) : parseFloat(registerValue)
        const numValue = rawValue * paramInfo.ratio
        // 根据ratio确定小数位数
        if (paramInfo.ratio === 0.1) {
          return numValue.toFixed(1) + (paramInfo.unit ? ' ' + paramInfo.unit : '')
        } else if (paramInfo.ratio === 0.01) {
          return numValue.toFixed(2) + (paramInfo.unit ? ' ' + paramInfo.unit : '')
        } else {
          return numValue + (paramInfo.unit ? ' ' + paramInfo.unit : '')
        }
      }
      
      // 根据字段类型进行值转换
      // B100: 储能DC一键控制 1=开机, 2=关机
      if (field === 'B100') {
        return registerValue === '1' ? '开机' : registerValue === '2' ? '关机' : registerValue
      }
      // B102: PCS模式选择 1=并网充电, 2=并网放电, 3=离网
      if (field === 'B102') {
        const modeMap = { '1': '并网充电', '2': '并网放电', '3': '离网' }
        return modeMap[registerValue] || registerValue
      }
      // B104: 充电功率设置
      if (field === 'B104') {
        return (parseInt(registerValue) / 10).toFixed(1) + ' kW'
      }
      // B106: 放电功率设置
      if (field === 'B106') {
        return (parseInt(registerValue) / 10).toFixed(1) + ' kW'
      }
      // B108: PCS开关机 1=开机, 2=关机
      if (field === 'B108') {
        return registerValue === '1' ? '开机' : registerValue === '2' ? '关机' : registerValue
      }
      // B110: 光伏DC控制 1=开机, 2=关机
      if (field === 'B110') {
        return registerValue === '1' ? '开机' : registerValue === '2' ? '关机' : registerValue
      }
      
      // 如果有unit，添加单位
      if (paramInfo && paramInfo.unit) {
        return registerValue + ' ' + paramInfo.unit
      }
      
      return registerValue
    },
    refresh() {
      uni.showLoading({ title: '刷新中...' });
      this.getOperationList().then(() => {
        uni.hideLoading();
        uni.showToast({ title: '刷新成功', icon: 'success' });
      });
    },
    onScroll(e) {
      this.showBackTop = e.detail.scrollTop > 300
    },
    onBackTop() {
      this.scrollTop = 1
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
    onScrollToLower() {
      if (this.isLoadingMore) return
      if (this.operationList.length >= this.totalCount) return
      this.pageNum++
      this.getOperationList(true)
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background: #f5f7fa;
  overflow: hidden;
  
  &.android-platform {
    .fixed-placeholder {
      height: calc(25px + 44px + 20px);
    }
    .content {
      height: calc(100vh - 25px - 44px - 20px);
    }
  }
  
  &.ios-platform {
    .fixed-placeholder {
      height: calc(44px);
      background: #fff;
    }
    .content {
      height: calc(100vh - 44px);
    }
  }
  
  .content {
    padding: 24rpx;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;
}

.loading-illustration {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 32rpx;
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 4rpx solid #f0f0f0;
  border-top: 4rpx solid #4488FB;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.operation-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  border: 1rpx solid #e8e8e8;
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx dashed #e8e8e8;
}

.header-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.header-device {
  font-size: 30rpx;
  color: #4488FB;
  font-weight: bold;
}



.operation-body {
  padding: 20rpx 0;
  border-bottom: 1rpx dashed #e8e8e8;
  margin-bottom: 16rpx;
}

.operation-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-username {
  font-size: 24rpx;
  color: #666;
}

.footer-time {
  font-size: 24rpx;
  color: #999;
}

.cmd-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:not(:last-child) {
    margin-bottom: 8rpx;
  }
}

.cmd-label {
  font-size: 26rpx;
  color: #999;
  font-weight: 500;
}

.cmd-value {
  font-size: 24rpx;
  color: #333;
  font-weight: bold;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 60rpx;
  background: #fff;
  border-radius: 24rpx;
  // margin-top: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(68, 136, 251, 0.08);
}

.empty-illustration {
  position: relative;
  width: 180rpx;
  height: 180rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
}

.illustration-bg {
  position: absolute;
  width: 180rpx;
  height: 180rpx;
  background: linear-gradient(135deg, #EFF6FF 0%, #E8F4FF 100%);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

.illustration-main {
  position: relative;
  z-index: 2;
  width: 100rpx;
  height: 100rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(68, 136, 251, 0.2);
}

.illustration-decoration {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8rpx;
  z-index: 1;
}

.deco-dot {
  width: 8rpx;
  height: 8rpx;
  background: #4488FB;
  border-radius: 50%;
  opacity: 0.6;
}

.deco-line {
  width: 40rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #4488FB, #74B9FF);
  border-radius: 2rpx;
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

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-title {
  font-size: 32rpx;
  color: #2D3748;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #718096;
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #a0aec0;
}

.footer-space {
  height: 120rpx;
}

.back-top-btn {
  position: fixed;
  right: 30rpx;
  bottom: 120rpx;
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #4A90D9, #6BB3FF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(74, 144, 217, 0.4);
  z-index: 999;
}

.loading-more, .no-more {
  text-align: center;
  padding: 30rpx 0;
  color: #999;
  font-size: 24rpx;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}
</style>