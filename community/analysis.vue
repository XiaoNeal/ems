<template>
    <view class="container">
        <!-- <view class="device-detail"> -->
        <!-- 优化后的分段控制器 -->
        <!-- <view class="device-tabs">
            <uni-segmented-control :current="currentTab" :values="tabs" @clickItem="handleTabChange"
                class="custom-segmented-control" :scroll="true" />
        </view> -->


        <view class="tab-bar">
            <text :class="{ 'active-tab': currentTab === 0 }" @click="switchTab(0)">经济性分析</text>
            <text :class="{ 'active-tab': currentTab === 1 }" @click="switchTab(1)">气象分析</text>
            <text :class="{ 'active-tab': currentTab === 2 }" @click="switchTab(2)">用电分析</text>
            <text :class="{ 'active-tab': currentTab === 3 }" @click="switchTab(3)">电力效能分析</text>
            <text :class="{ 'active-tab': currentTab === 4 }" @click="switchTab(4)">告警分析</text>
        </view>

        <view class="device-content">
            <economic-analysis v-if="currentTab === 0"></economic-analysis>
            <weather-analyze v-if="currentTab === 1"></weather-analyze>
            <electricity-analyze v-if="currentTab === 2"></electricity-analyze>
            <power-efficiency-analyze v-if="currentTab === 3"></power-efficiency-analyze>
            <alarm-analyze v-if="currentTab === 4"></alarm-analyze>
        </view>
        <!-- </view> -->
    </view>
</template>

<script>
import economicAnalysis from './components/economic-analysis.vue';
import electricityAnalyze from './components/electricity-analyze.vue';
import powerEfficiencyAnalyze from './components/power-efficiency-analysis.vue';
import weatherAnalyze from './components/weather.vue';
import alarmAnalyze from './components/alarm-analysis.vue';

export default {
    components: {
        economicAnalysis,
        electricityAnalyze,
        powerEfficiencyAnalyze,
        weatherAnalyze,
        alarmAnalyze,
    },
    data() {
        return {
            currentTab: 0,
            // tabs: ['经济性分析', '气象分析', '用电分析', '电力效能分析', '告警分析']
            tabs: ['经济性分析', '气象分析','用电分析', '电力效能分析', '告警分析']
        };
    },
    methods: {
        handleTabChange(e) {
            this.currentTab = Number(e.currentIndex);
        },
        switchTab(tab) {
            this.currentTab = tab;
        },
    }
};
</script>

<style lang="scss" scoped>
.container {
    // background:#EFF4FB
    // padding: 20rpx 30rpx;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #EFF4FB;
}



/* 选项卡容器 - 优化阴影和背景 */
.device-tabs {
    // margin-bottom: 40rpx;
    // padding: 12rpx;
    background: #FAFBFF;
    border-radius: 20rpx;
    box-shadow:
        inset 0 2rpx 8rpx rgba(0, 0, 0, 0.03),
        0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.tab-bar {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #eee;
    background:#fff
  
}

.tab-bar text {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    color: #333;
    min-width:fit-content;
    font-size: 28rpx;
}

.active-tab {
    color: #007aff;
    border-bottom: 2px solid #007aff;
}

.device-content{
  background:#EFF4FB;
    margin:10rpx;
    border-radius: 6px;
}





</style>
