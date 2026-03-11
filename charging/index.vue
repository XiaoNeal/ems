<template>
    <view class="container">
        <custom-nav-bar :title="currentTab === 'home' ? '充电桩首页' : currentTab === 'scan' ? '扫码充电' : '我的'"
            :showBack="false" :bgColor="navBarBgColor" :textColor="navBarTextColor"></custom-nav-bar>

        <view class="tab-content">
            <!-- 首页 -->
            <home v-if="currentTab === 'home'"></home>

            <!-- 扫码充电 -->
            <scan v-if="currentTab === 'scan'"></scan>

            <!-- 我的 -->
            <my v-if="currentTab === 'my'"></my>
        </view>

        <!-- 底部导航 -->
        <view class="tab-bar" ref="tabBar">
            <view class="tab-item" :class="{ 'active': currentTab === 'home' }" @click="switchTab('home')"
                :style="{ '--active-color': activeColor }">
                <uni-icons type="home" size="22"
                    :color="currentTab === 'home' ? activeColor : defaultColor"></uni-icons>
                <text>首页</text>
            </view>
            <view class="tab-item scan-btn" :class="{ 'active': currentTab === 'scan' }" @click="switchTab('scan')">
                <view class="scan-circle">
                    <uni-icons type="scan" size="26" color="#fff"></uni-icons>
                </view>
                <text>扫码</text>
            </view>
            <view class="tab-item" :class="{ 'active': currentTab === 'my' }" @click="switchTab('my')"
                :style="{ '--active-color': activeColor }">
                <uni-icons type="person" size="22"
                    :color="currentTab === 'my' ? activeColor : defaultColor"></uni-icons>
                <text>我的</text>
            </view>
        </view>
    </view>
</template>

<script>
import CustomNavBar from './components/custom-nav-bar.vue';
import Home from './home.vue';
import Scan from './scan.vue';
import My from './my.vue';

export default {
    components: {
        CustomNavBar,
        Home,
        Scan,
        My
    },
    data() {
        return {
            currentTab: 'home', // 默认显示首页
            activeColor: '#165DFF', // 激活状态颜色
            defaultColor: '#8a8a8a', // 默认颜色
            navBarBgColor: '#165DFF', // 导航栏背景色
            navBarTextColor: '#fff' // 导航栏文字颜色
        };
    },
    methods: {
        switchTab(tab) {
            // 使用nextTick确保DOM更新完成
            this.$nextTick(() => {
                const tabBar = this.$refs.tabBar;
                if (tabBar) {
                    tabBar.classList.add('tab-bar-active');
                    setTimeout(() => {
                        tabBar.classList.remove('tab-bar-active');
                    }, 300);
                }
            });
            
            this.currentTab = tab;
            // 滚动到顶部
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 300
            });
        }
    }
};
</script>

<style scoped>
.container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
}

.tab-content {
    flex: 1;
    overflow-y: auto;
    /* 为导航栏留出空间，具体值由custom-nav-bar组件决定 */
    padding-top: var(--custom-nav-bar-height, 44px);
}

/* 底部导航栏样式 */
.tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background-color: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition: all 0.3s ease;
    z-index: 998;
}

.tab-bar-active {
    transform: translateZ(0);
    box-shadow: 0 -2px 15px rgba(22, 93, 255, 0.15);
}

.tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5px 0;
    width: 25%;
    position: relative;
}

.tab-item text {
    font-size: 12px;
    margin-top: 2px;
    color: #8a8a8a;
    transition: color 0.3s ease;
}

.tab-item.active text {
    color: var(--active-color);
    font-weight: 500;
}

/* 扫码按钮特殊样式 */
.scan-btn {
    position: relative;
    width: 30%;
}

.scan-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #165DFF;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
    position: absolute;
    top: -20px;
    transition: all 0.3s ease;
}

.scan-btn.active .scan-circle {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(22, 93, 255, 0.4);
}

.scan-btn text {
    position: absolute;
    bottom: 5px;
    color: #165DFF;
}

/* 适配底部安全区域 */
@supports (bottom: env(safe-area-inset-bottom)) {
    .tab-bar {
        padding-bottom: env(safe-area-inset-bottom);
        height: calc(56px + env(safe-area-inset-bottom));
    }

    .scan-btn text {
        bottom: calc(5px + env(safe-area-inset-bottom));
    }
}
</style>
