<template>
	<view class="container" :style="'background-color:'+ bGColor">
		<!-- <u-navbar title="关于"  :titleStyle="{'color':fontColor,'width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar> -->
		<u-navbar title="关于我们" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
		:placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>
		<view class="logo">
			<image src="https://serviceiems.gree.com/sso/img/logo_blue.56e357ea.svg" mode="widthFix" style="width: 80px; border-radius: 10px;margin-bottom: 10px;height:80px"></image>
			<text class="title-container" :style="'color:'+ fontColor">GIEMS云</text>
			<view style="padding: 1rem;text-indent: 2em;">
				<text class="text-color" :style="'color:'+ fontColor">
					光储直柔奋力零碳中国
				</text>
			</view>

		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="list" :style="{'color':fontColor}">
			<view class="items">
				<text>当前版本</text>
				<text style="color: #aaa;">V{{appVersion}}</text>
			</view>
			<view class="items">
				<text>检查更新</text>
				<text style="color: #aaa;" @click="goUpgread">{{isNew}}</text>
			</view>
			<view class="items" @click="goToAgreement('privacy-policy')">
				<text>隐私协议政策</text>
				<uni-icons type="right" style="color: #aaa;"></uni-icons>
			</view>
			<view class="items" @click="goToAgreement('user-agreement')">
				<text>用户服务协议</text>
				<uni-icons type="right" style="color: #aaa;"></uni-icons>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="agreement" :style="{'color':fontColor}">
			<view style="text-align: center;" @click="goToAgreement('privacy-policy')">《GIEMS云隐私协议政策》</view>
			<view style="text-align: center; margin-top: 0.5rem;" @click="goToAgreement('user-agreement')">
				《GIEMS云软件许可及用户服务协议》</view>
			<view style="text-align: center; margin-top: 0.5rem;" @click="showICP">备案号：粤ICP备2024207422号-1X</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef APP -->
		<view class="agreement" :style="{'color':fontColor}">
			<view style="text-align: center; margin-top: 0.5rem;" @click="showICP">计算机软件著作权登记号：2024SR0089155</view>
		</view>
		<!-- #endif -->
		<view class="copyright">
			<text>国创能源互联网创新中心（广东）有限公司</text>
			<text>Copyrigt © 2017-{{thisYear}} NEIIC</text>
			<text>All right reserved</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				appVersion: '',
				isNew: '无新版本',
				isLoading: false // 新增加载状态
			}
		},
		computed: {
			thisYear() {
				let date = new Date()
				let year = date.getFullYear()
				return year
			}
		},
		onLoad() {
			// if (this.currentTemplate == 3) {
			// 	this.fontColor = '#fff'
			// }
		},
		mounted() {
			// #ifdef APP-PLUS
			let version = uni.getSystemInfoSync().appWgtVersion;
			this.appVersion = version.replace(/\./g, '.'); // 格式化版本号
			// #endif
			// #ifdef APP
			this.getUpgrade()
			// #endif
		},
		methods: {
			goUpgread() {
				if (this.isLoading) return; // 防止重复点击
				this.isLoading = true;
				uni.showLoading({
					title: '检查中...'
				});
				if (this.isNew == '有新版本可更新') {
					let downapk = 'https://serviceiems.gree.com/home/springboot_service/mobile_service/mobile_apk/GIEMS云.apk'
					plus.runtime.openURL(downapk);
				}
				setTimeout(() => {
					this.isLoading = false;
					uni.hideLoading();
				}, 1000);
			},
			goToAgreement(e) {
				if (this.isLoading) return; // 防止重复点击
				this.isLoading = true;
				uni.showLoading({
					title: '加载中...'
				});
				uni.navigateTo({
					url: `/pages-public/agreement/${e}`,
					complete: () => {
						this.isLoading = false;
						uni.hideLoading();
					}
				});
			},
			getUpgrade() {
			  let that = this
			  plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
			    let version = widgetInfo.version
			    let osName = plus.os.name;
			    var server = `https://serviceiems.gree.com/appletAPI/downloadAPK?version=${version}&osName=${osName}`; //检查新地址
			    uni.request({
			      url: server,
			      success: (res) => {
			        if (res.statusCode == 200 && res.data.data.updateStatus == 3) {
			          that.isNew = '暂无新版本'
			        } else if (res.statusCode == 200 && res.data.data.updateStatus === 1) {
			          that.isNew = '有新版本可更新'
			        }
			      },
			      fail: (err) => {
			        uni.showToast({
			          title: '网络请求失败，请重试',
			          icon: 'none'
			        });
			      }
			    })
			  })
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100%;

		.title-container {
			font-size: 18px;
			font-weight: bold;
		}

		.logo {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 80px;
		}

		.list {
			padding: 6vw;
			background-color: #fff;
			border-radius: 8px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

			.items {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 20px 0;
				padding: 0 3vw;
				border-bottom: 1px solid #f5f5f5;

				&:last-child {
					border-bottom: none;
				}
			}
		}

		.text-color {
			margin-right: 10px;
		}

		.copyright {
			display: flex;
			flex-direction: column;
			text-align: center;
			font-size: 26rpx;
			color: #aaa;
			position: fixed;
			bottom: 1rem;
			left: 50%;
			transform: translateX(-50%);
			width: 100%;
			// z-index: -100;
		}

		.agreement {
			width: 100vw;
			color: #fff;
			position: fixed;
			left: 50%;
			transform: translateX(-50%);
			bottom: 5rem;
			font-size: 26rpx;
		}
	}
</style>