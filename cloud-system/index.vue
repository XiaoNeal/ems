<template>
    <view class="container">
        <!-- 添加头部标题栏 -->
        <view class="header">
            <text class="title">{{ tabs[currentTab] }}</text>
        </view>
        <view class="nav-bar">
            <view v-for="(tab, index) in tabs" :key="index" class="nav-item" :class="{ active: currentTab === index }"
                @click="switchTab(index)">
                <uni-icons :type="getIconType(index)" size="24" :color="currentTab === index ? '#007aff' : '#666'" />
                <text class="tab-text">{{ tab }}</text>
            </view>
        </view>
        <view class="content">
            <Home v-if="currentTab === 0" />
            <Operation v-if="currentTab === 1" />
            <Report v-if="currentTab === 2" />
            <Profile v-if="currentTab === 3"></Profile>
        </view>
    </view>
</template>

<style scoped>
.header {
    height: 50px;
    background-color: #fff;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #eee;
    position: fixed;
    top: 50px; /* 增加顶部间距 */
    left: 0;
    right: 0;
    z-index: 1000;
}

.container {
    width: 100%;
   /*height: 100vh; */
    display: flex;
    flex-direction: column;
    position: fixed; /* 新增固定定位 */
    top: 50px;      /* 留出header高度 */
    bottom: 0px;   /* 留出导航栏高度 */
}



.nav-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;
    background-color: #fff;
    border-top: 1px solid #eee;
    position: fixed;
    bottom: 0;  /* 固定在底部 */
    left: 0;
    right: 0;
    z-index: 999;
}

.content {
    flex: 1;
    margin-bottom: 50px; /* 导航栏高度 */
    padding: 10px;
    margin-top: 50px;    /* header高度 */
    margin-bottom: 60px; /* 增加底部间距到60px */
    overflow-y: auto;
    box-sizing: border-box;
    /* height: calc(100vh - 110px); 总高度减去header和导航栏及新增间距 */
}

.nav-item {
    padding: 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24rpx;
}

.nav-item uni-icons {
    margin-bottom: 4rpx;
}

.tab-text {
    font-size: 24rpx;
}

.active .tab-text {
    color: #007aff;
}

.active {
    color: #007aff;
    border-bottom: 2px solid #007aff;
}

.content {
    padding: 10px;
    /* min-height: calc(100vh - 50px); */
    /* 减去底部导航栏高度 */
    flex-grow: 1;
    /* 让内容区域撑满剩余空间 */
    padding-top: 20px; /* 调整为header高度 + 顶部间距 */
}
</style>

<script>
import Home from './home.vue'
import Operation from './operation.vue'
import Report from './report.vue'
import Profile from './profile.vue'

export default {
    components: {
        Home,
        Operation,
        Report,
        Profile
    },
    data() {
        return {
            tabs: ['首页', '设备', '运维', '我的'],
            currentTab: 0 // Remove trailing comma here
        }
    },
    methods: {
        switchTab(index) {
            this.currentTab = index
            console.log(this.currentTab)
        },
        getIconType(index) {
            const icons = ['home', 'settings', 'list', 'person'];
            return icons[index];
        }
    }
}
</script>