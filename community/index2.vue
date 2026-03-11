<template>
    <view class="index">

        <view v-if="tabberPageLoadFlag[0]" :style="{ display: currentIndex === 0 ? '' : 'none' }">
            <scroll-view class="custom-tabbar-page" scroll-y enable-back-to-top @scrolltolower="tabbarPageScrollLower">
                <Home ref="home"></Home>
            </scroll-view>
        </view>
        <view v-if="tabberPageLoadFlag[1]" :style="{ display: currentIndex === 1 ? '' : 'none' }">
            <scroll-view class="custom-tabbar-page" scroll-y enable-back-to-top @scrolltolower="tabbarPageScrollLower">
                <Monitor ref="monitor"></Monitor>
            </scroll-view>
        </view>
        <view v-if="tabberPageLoadFlag[2]" :style="{ display: currentIndex === 2 ? '' : 'none' }">
            <scroll-view class="custom-tabbar-page" scroll-y enable-back-to-top @scrolltolower="tabbarPageScrollLower">
                <analysis ref="analysis"></analysis>
            </scroll-view>
        </view>
        <view v-if="tabberPageLoadFlag[3]" :style="{ display: currentIndex === 3 ? '' : 'none' }">
            <scroll-view class="custom-tabbar-page" scroll-y enable-back-to-top @scrolltolower="tabbarPageScrollLower">
                <Report ref="report"></Report>
            </scroll-view>
        </view>
        <view v-if="tabberPageLoadFlag[4]" :style="{ display: currentIndex === 4 ? '' : 'none' }">
            <scroll-view class="custom-tabbar-page" scroll-y enable-back-to-top @scrolltolower="tabbarPageScrollLower">
                <Profile ref="about"></Profile>
            </scroll-view>
        </view>

        <!-- <tn-tabbar v-model="currentIndex" :list="tabbarList" activeColor="#838383" inactiveColor="#AAAAAA"
            activeIconColor="tn-cool-bg-color-7" :animation="true" :safeAreaInsetBottom="true"
            @change="switchTabbar"></tn-tabbar> -->
        <view class="nav-bar">
            <view v-for="(tab, index) in tabs" :key="index" class="nav-item" :class="{ active: currentTab === index }"
                @click="switchTab(index)">
                <uni-icons v-if="index === 3" :type="getIconType(index)" :size="iconSize"
                    :color="currentTab === index ? '#007aff' : '#666'" />
                <image v-else class="icon-img" :src="currentTab === index ? activeIcons[index] : inactiveIcons[index]"
                    mode="aspectFit" :style="{ width: iconSize + 'px', height: iconSize + 'px' }" />
                <text class="tab-text" :style="{ fontSize: textFontSize + 'px' }">{{ tab }}</text>
            </view>
        </view>

    </view>
</template>

<script>


import Home from './home.vue'
import Report from './report.vue'
import Monitor from './monitor.vue'
import analysis from './analysis.vue'
import Profile from './profile.vue'

export default {
    components: {
        Home,
        Monitor,
        analysis,
        Profile,
        Report
    },
    data() {
        return {
            // 底部tabbar菜单数据
            tabbarList: [
                {
                    title: '首页',
                    activeIcon: 'count-fill',
                    inactiveIcon: 'menu'
                },
                {
                    title: '监测',
                    activeIcon: 'honor-fill',
                    inactiveIcon: 'honor'
                },
                {
                    title: '分析',
                    activeIcon: 'vip-fill',
                    inactiveIcon: 'vip',
                    activeIconColor: '#FFFFFF',
                    inactiveIconColor: '#FFFFFF',
                    iconSize: 50,
                    out: true
                },
                {
                    title: '报告',
                    activeIcon: 'discover-fill',
                    inactiveIcon: 'discover',
                    count: 100
                },
                {
                    title: '我的',
                    activeIcon: 'computer-fill',
                    inactiveIcon: 'computer',
                    dot: true
                }
            ],
            // tabbar当前被选中的序号
            currentIndex: 0,
            // 自定义底栏对应页面的加载情况
            tabberPageLoadFlag: [],
            tabs: ['首页', '监测', '分析', '报告', '我的'],
            currentTab: 0,
            activeIcons: {
                0: require('@/static/images/home-active.png'),
                1: require('@/static/images/monitor-active.png'),
                2: require('@/static/images/analysis-active.png'),
                4: require('@/static/images/mine-active.png')
            },
            inactiveIcons: {
                0: require('@/static/images/home.png'),
                1: require('@/static/images/monitor.png'),
                2: require('@/static/images/analysis.png'),
                4: require('@/static/images/mine.png')
            },
        }
    },
    onLoad(options) {
        const index = Number(options.index || 0)
        // 根据底部tabbar菜单列表设置对应页面的加载情况
        this.tabberPageLoadFlag = this.tabbarList.map((item, tabbar_index) => {
            return index === tabbar_index
        })
        this.switchTabbar(index)
    },
    methods: {
        // 切换导航
        // switchTabbar(index) {
        //     this._switchTabbarPage(index)
        // },

        switchTab(index) {
            // this.currentTab = index;
            this.tabberPageLoadFlag= index;
            console.log(`当前选中: ${this.tabs[index]}`);
        },
        getIconType(index) {
            const icons = ['home', 'list', 'settings', 'list', 'person'];
            return icons[index];
        },


        // 导航页面滚动到底部
        tabbarPageScrollLower(e) {
        },

        // 切换导航页面
        _switchTabbarPage(index) {
            const selectPageFlag = this.tabberPageLoadFlag[index]
            if (selectPageFlag === undefined) {
                return
            }
            if (selectPageFlag === false) {
                this.tabberPageLoadFlag[index] = true
            }
            this.currentIndex = index
        }
    }
}
</script>

<style lang="scss" scoped>
.index {
    overflow: hidden;
    height: 100%;
}

.custom-tabbar-page {
    height: calc(100vh - (100rpx + env(safe-area-inset-bottom) / 2));
}
</style>
