<template>
  <view class="container">
    <custom-nav-bar title="充电桩首页" :showBack="false"></custom-nav-bar>
    <view class="content">
      <!-- 充电桩列表 -->
      <view class="charging-pile-list">
        <view class="charging-pile-item" v-for="pile in piles" :key="pile.id" @click="goToPileDetail(pile.id)">
          <view class="pile-info">
            <view class="pile-name">{{ pile.name }}</view>
            <view class="pile-status"
              :class="{ 'available': pile.status === 'available', 'unavailable': pile.status !== 'available' }">{{
                pile.status === 'available' ? '空闲' : '使用中' }}</view>
          </view>
          <view class="pile-location">{{ pile.location }}</view>
          <view class="pile-power">{{ pile.power }}kW | {{ pile.type }}</view>
        </view>
      </view>

    </view>
  </view>

</template>

<script>

export default {

  data() {
    return {
      piles: [
        // 模拟数据，实际应从服务器获取
        { id: 1, name: '充电桩A', status: 'available', location: 'A区1号车位', power: 7, type: '交流快充' },
        { id: 2, name: '充电桩B', status: 'unavailable', location: 'A区2号车位', power: 20, type: '直流快充' },
        { id: 3, name: '充电桩C', status: 'available', location: 'B区1号车位', power: 7, type: '交流快充' }
      ]
    };
  },
  methods: {
    goToScan() {
      uni.navigateTo({
        url: '/charging/scan'
      });
    },
    goToPileDetail(id) {
      uni.navigateTo({
        url: `/charging/charging-detail?id=${id}`
      });
    },
    switchTab(tab) {
      if (tab === 'home') {
        // 已经在首页
      } else if (tab === 'scan') {
        this.goToScan();
      } else if (tab === 'my') {
        uni.navigateTo({
          url: '/charging/my'
        });
      }
    },
    loadPiles() {
      // 实际项目中，这里应该调用API获取充电桩数据
      // 为简化示例，使用模拟数据
    }
  },
  onLoad() {
    // 加载充电桩列表
    this.loadPiles();
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding-top: 44px;
  /* 为自定义导航栏留出空间 */
  padding-bottom: 50px;
  /* 为底部导航留出空间 */
  box-sizing: border-box;
}

.content {
  padding: 15px;
}

.charging-pile-list {
  margin-bottom: 20px;
}

.charging-pile-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pile-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.pile-name {
  font-size: 16px;
  font-weight: bold;
}

.pile-status {
  padding: 3px 8px;
  border-radius: 15px;
  font-size: 12px;
}

.available {
  background-color: #00B42A;
  color: #fff;
}

.unavailable {
  background-color: #8a8a8a;
  color: #fff;
}

.pile-location,
.pile-power {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.scan-btn {
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #165DFF;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 99;
}

.scan-btn image {
  width: 30px;
  height: 30px;
  tint-color: #fff;
  margin-bottom: 5px;
}

.scan-btn text {
  color: #fff;
  font-size: 12px;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #fff;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tab-item image {
  width: 24px;
  height: 24px;
  margin-bottom: 3px;
}

.tab-item text {
  font-size: 10px;
  color: #8a8a8a;
}

.tab-item.active text {
  color: #165DFF;
}
</style>