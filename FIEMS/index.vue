<template>
	<view class="custom-template-page">
		<view style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);"
			v-if="currentTemplate!='0' ||currentTemplate!='3'||currentTemplate!='4'">
			<u-loading-icon></u-loading-icon>
		</view>
		<view class="scroll-view-bar">
			<scroll-view :scroll-x="false" :scroll-top="scrollTop" @scroll="scroll" :scroll-y="true"
				:style="'width:100%;height:'+bodyHeight+'px;'">
				<!-- <template v-if="currentTemplate=='0'">
					<login></login>
				</template> -->
				
				<!-- 工厂 -->
				<template v-if="currentTemplate=='3'">
					<fiemsHome v-if="currentTab==0"></fiemsHome>
					<fimesEnergy v-if="currentTab==1"></fimesEnergy>
					<fimesExpert v-if="currentTab==2"></fimesExpert>
					<fiemsUser v-if="currentTab==3"></fiemsUser>
				</template>
				
			</scroll-view>
		</view>
		<u-back-top :scrollTop="scrollUTop" @click="goTop" icon="arrow-up"></u-back-top>
		<view v-if="currentTemplate!='0'" class="footer" :style="'height:'+footerHeight+'px;background:'+headerTabBg">
			<customTabbar :colSpan="colSpan" :footerHeight="footerHeight" :currentTab="currentTab"
				:backgroundTab="headerTabBg" :tabbarList="tabbarList" @changeTab="changeTab"></customTabbar>
		</view>
		
	</view>
</template>

<script>
	// #ifdef APP
	import {
		appUpdate
	} from '../../utils/update';
	// #endif
	import pageData from '@/util/pagedata.js';
	import customTabbar from '@/components/common/tabbar.vue'
	// import login from '@/pages/login/login.vue'

	import fiemsHome from './fiems-home.vue'
	import fiemsUser from './fiems-user.vue'
	import fimesEnergy from './fiems-energy.vue'
	import fimesExpert from './fiems-expert.vue'

	import {
		RealtimeDataProviderService
	} from '@/service/socket/realtime-data-provider' 
	export default {
		components: {
			customTabbar,
			// login,
			fiemsHome,
			fiemsUser,
			fimesEnergy,
			fimesExpert,
		
		},
		data() {
			return {
				scrollUTop: 0,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				tabbarList: [],
				colSpan: 2, //tab数(col布局)
				currentTab: 0, //当前激活的tab项
				bodyHeight: 0, //内容区高度
				footerHeight: 0, //底部高度
				realTimeService: '',
				// backgroundTab: '#fff'
				// currentTemplate: 7
			};
		},
		//监听模板变化
		watch: {
			currentTemplate: function(newValue) {


				console.log("woooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
				this.setHeaderTabBg()
				this.initHeight()
				if (newValue == 0) {
					this.loginOut();
					return
				}
				this.currentTab = 0;
				this.getTabbarList();
			}
		},
		//初始化页面布局
		created: function() {
			this.initHeight();
		},
		//初始化数据,底部的tabbar,激活的tab项
		onLoad: function(option) {
			
			
			

		
			this.setHeaderTabBg()
			this.getTabbarList();
			if (option.activeTabItem != null && option.activeTabItem != undefined) {
				this.currentTab = option.activeTabItem;
			}
			if (this.currentTemplate > 0) {
				this.realTimeService = new RealtimeDataProviderService()
				this.realTimeService.createScoket(this.currentTemplate, this.urlPrefix)
			}

		},
		mounted() {
			// #ifdef APP
			// appUpdate()
			// #endif

			// #ifdef MP-WEIXIN
			wx.onNeedPrivacyAuthorization()
			// #endif
		},
		methods: {
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
				this.scrollUTop = e.detail.scrollTop

			},
			goTop() {
				this.scrollTop = this.old.scrollTop
				this.scrollUTop = 0

				this.$nextTick(() => {
					this.scrollTop = 0
				})
				// this.scrollTop = this.old.scrollTop
			},
			setHeaderTabBg() {
				console.log("woooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
				let headerTabBg = '#fff'
				let bGColor = '#fff'
				let fontColor = "#000"
				if (this.currentTemplate == 3 || this.currentTemplate == 4) {
					headerTabBg = '#003E98'
					bGColor = '#0E2264'
					fontColor = '#fff'
				}
				this.$u.vuex("headerTabBg", headerTabBg);
				this.$u.vuex("bGColor", bGColor);
				this.$u.vuex("fontColor", fontColor);
			},

			initHeight: function() {
				let that = this;
				// #ifdef MP-WEIXIN
				let windowHeight = this.$u.sys().windowHeight;
				// #endif
				// #ifndef MP-WEIXIN
				let windowHeight = this.$u.sys().windowHeight;
				// #endif
				// that.bodyHeight = windowHeight / 10 * 9*1.53;
				// that.footerHeight = windowHeight / 10 * 0.53;
				// that.footerHeight =  50// windowHeight / 10;767.8px
				that.footerHeight = 49
				if (this.currentTemplate == 0) {
					that.bodyHeight = windowHeight
				} else {
					that.bodyHeight = windowHeight - that.footerHeight
				}
			},
			//根据模板获取不同模板的底部tab菜单数据
			getTabbarList: function() {
				let templateId = this.currentTemplate;

				this.tabbarList = pageData.getBottomTabbarList(templateId);
				if (this.tabbarList.length > 0) {
					this.colSpan = Math.ceil(12 / this.tabbarList.length);
				}
			},
			changeTab: function(index) {
				this.currentTab = index;
				uni.switchTab({
					url: '/pages/FIEMS/fiems-energy'
				})
			},

			//退出登录
			loginOut: function() {
				RealtimeDataProviderService.closeSocket()
				// uni.clearStorageSync();
				uni.removeStorageSync("lifeData");
				uni.removeStorageSync("__DC_STAT_UUID");
				uni.removeStorageSync("token");
				uni.removeStorageSync("urlPrefix");
				uni.removeStorageSync("currentTemplate");
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-template-page {
		.footer {
			width: 100%;
			position: absolute;
			// bottom: 2rpx;
			background-color: #FFFFFF;
		}
	}
</style>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>