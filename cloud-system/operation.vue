<template>
  <view class="container">
    <view class="device-detail">
      <view class="device-tabs">
        <uni-segmented-control :current="currentTab" :values="tabs" @clickItem="handleTabChange" />
      </view>
      <view class="device-content">
        <Photovoltaic v-if="currentTab === 0" />
        <EnergyStorage v-else-if="currentTab === 1" />
        <PowerGrid v-else-if="currentTab === 2" />
        <Load v-else-if="currentTab === 3" />
        <Control v-else-if="currentTab === 4" />
        <FireSafety v-else-if="currentTab === 5" />
      </view>
    </view>
  </view>
</template>

<script>
import Photovoltaic from './components/Photovoltaic.vue';
import EnergyStorage from './components/EnergyStorage.vue'
import PowerGrid from './components/PowerGrid.vue';
import Load from './components/Load.vue';
import Control from './components/Control.vue';
import FireSafety from './components/FireSafety.vue';

export default {
  components: {
    Photovoltaic,
      EnergyStorage,
      PowerGrid,
      Load,
      Control,
      FireSafety
  },
  data() {
    return {
      currentTab: 0,
      tabs: ['光伏', '储能', '电网', '负荷', '调控', '消防']
    };
  },
  computed: {
    // 删除 currentComponent 计算属性
  },
  methods: {
    handleTabChange(e) {
      this.currentTab = Number(e.currentIndex); // Convert to number
    }
  }
};
</script>

<style lang="scss" scoped>
//.container {
 // padding: 20rpx;
 // background-color: #f5f5f5;
//}

// .device-detail {
//   margin-top: 30rpx;
// }

/* 新增分段控制器样式 */
.device-tabs {
  margin-bottom: 30rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  
  /deep/ .uni-segmented-control {
    height: 80rpx;
    
    &__item {
      font-size: 32rpx;
      color: #666;
      transition: all 0.3s;
      border: none !important;
      
      &--active {
        color: #1890FF;
        font-weight: 500;
        background: transparent;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 6rpx;
          background-color: #1890FF;
          border-radius: 3rpx;
        }
      }
    }
    
    &__line {
      display: none;
    }
  }
}

// .device-content {
//   padding: 20rpx;
//   border: 1rpx solid #eee;
//   border-radius: 16rpx;
//   background: #fff;
//   box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
// }
</style>