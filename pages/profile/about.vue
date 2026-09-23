<template>
	<view class="container" :class="[platformClass, { 'theme-dark': !isLightTheme }]" :style="{ backgroundColor: pageBg }">
		<DyNavbar title="关于我们" :bgColor="pageBg" :titleStyle="navTitleStyle" :placeholder="true" :leftIconColor="navIconColor"></DyNavbar>
		<view class="fixed-placeholder"></view>

		<!-- 品牌区：应用图标 + 名称 + 标语 -->
		<view class="hero">
			<image class="hero-logo" src="/static/logo.png" mode="aspectFill"></image>
			<text class="hero-name">微能站</text>
			<view class="hero-slogan">
				<view class="slogan-line"></view>
				<text class="slogan-text">光储直柔 · 奋力零碳中国</text>
				<view class="slogan-line"></view>
			</view>
		</view>

		<!-- 信息卡片：APP / 微信小程序统一结构，版本号统一取 utils/appVersion.js 的同一数据源 -->
		<view class="card">
			<view class="row">
				<view class="row-left">
					<view class="row-icon">
						<uni-icons type="info" size="18" :color="iconColor"></uni-icons>
					</view>
					<text class="row-label">当前版本</text>
				</view>
				<text class="row-value">{{ appVersion }}</text>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="row row-link" hover-class="row-hover" :hover-stay-time="80" @click="goUpgread">
				<view class="row-left">
					<view class="row-icon">
						<uni-icons type="reload" size="18" :color="iconColor"></uni-icons>
					</view>
					<text class="row-label">检查更新</text>
				</view>
				<view class="row-right">
					<text class="row-value row-value-action">点击检查</text>
					<view class="row-chevron">
						<uni-icons type="right" size="14" :color="arrowColor"></uni-icons>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<view class="row row-link" hover-class="row-hover" :hover-stay-time="80" @click="goToAgreement('privacy-policy')">
				<view class="row-left">
					<view class="row-icon">
						<uni-icons type="auth" size="18" :color="iconColor"></uni-icons>
					</view>
					<text class="row-label">隐私协议政策</text>
				</view>
				<view class="row-right">
					<view class="row-chevron">
						<uni-icons type="right" size="14" :color="arrowColor"></uni-icons>
					</view>
				</view>
			</view>
			<view class="row row-link" hover-class="row-hover" :hover-stay-time="80" @click="goToAgreement('user-agreement')">
				<view class="row-left">
					<view class="row-icon">
						<uni-icons type="compose" size="18" :color="iconColor"></uni-icons>
					</view>
					<text class="row-label">用户服务协议</text>
				</view>
				<view class="row-right">
					<view class="row-chevron">
						<uni-icons type="right" size="14" :color="arrowColor"></uni-icons>
					</view>
				</view>
			</view>
		</view>

		<!-- 备案 / 软著：平台差异项，样式保持一致 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="foot-note" hover-class="row-hover" :hover-stay-time="80" @click="showIcpInfo">
			<text>备案号：粤ICP备2024207422号-1X</text>
		</view>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		<view class="foot-note" hover-class="row-hover" :hover-stay-time="80" @click="showCopyrightInfo">
			<text>计算机软件著作权登记号：2024SR0089155</text>
		</view>
		<!-- #endif -->

		<!-- 弹性占位：内容不足一屏时把版权区压到底部 -->
		<view class="flex-space"></view>

		<view class="copyright">
			<text class="copyright-company">国创能源互联网创新中心（广东）有限公司</text>
			<text class="copyright-line">Copyright © 2017-{{ thisYear }} NEIIC</text>
			<text class="copyright-line">All rights reserved</text>
		</view>
	</view>
</template>

<script>
	import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'
	import { checkAppUpdate } from '@/utils/appUpdate.js'
	// 版本号唯一数据源：APP 与微信小程序共用同一常量，保证两端展示一致
	import { getAppVersion, getAppVersionSync } from '@/utils/appVersion.js'

	export default {
		components: { DyNavbar },
		data() {
			return {
				// 首屏先用常量占位，避免版本号短暂空白；onLoad 中再取运行时精确值
				appVersion: getAppVersionSync(),
				isLoading: false,
				platformClass: ''
			}
		},
		computed: {
			thisYear() {
				let date = new Date()
				let year = date.getFullYear()
				return year
			},
			/** 浅色主题判定：bGColor 为空或白色按浅色处理（当前产品默认浅色） */
			isLightTheme() {
				const bg = String(this.bGColor || '').trim().toLowerCase()
				return !bg || bg === '#fff' || bg === '#ffffff'
			},
			/** 页面背景：浅色用浅灰蓝底衬托白色卡片，非浅色主题沿用主题底色 */
			pageBg() {
				return this.isLightTheme ? '#f4f6f9' : this.bGColor
			},
			navTitleStyle() {
				return { color: this.isLightTheme ? '#2b2f36' : '#e8eaee', width: '100%', fontWeight: '600' }
			},
			navIconColor() {
				return this.isLightTheme ? '#2b2f36' : '#e8eaee'
			},
			iconColor() {
				return this.isLightTheme ? '#a9b0ba' : '#8f97a1'
			},
			arrowColor() {
				return this.isLightTheme ? '#c3c9d1' : '#767e88'
			}
		},
		onLoad(options) {
			// 版本号：各端统一走 utils/appVersion.js
			// APP 端优先取运行时资源包版本（wgt 热更新后仍准确），失败回退常量；
			// 小程序端取常量（无本地版本概念），两端展示格式保持完全一致
			getAppVersion().then((version) => {
				this.appVersion = version
			})

			uni.getSystemInfo({
				success: (res) => {
					this.platformClass = res.platform === "ios" ? "ios-platform" : "android-platform";
				},
			});
		},
		mounted() {
		},
		methods: {
			/** 手动检查更新：跳过节流与忽略版本，无更新时 toast 提示（仅 APP 端） */
			goUpgread() {
				checkAppUpdate(true)
			},
			goToAgreement(e) {
				if (this.isLoading) return;
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
			/** ICP 备案信息（小程序端展示，微信要求可查看备案号） */
			showIcpInfo() {
				uni.showModal({
					title: '备案信息',
					content: '备案号：粤ICP备2024207422号-1X\n主办单位：国创能源互联网创新中心（广东）有限公司',
					showCancel: false,
					confirmText: '我知道了'
				})
			},
			/** 计算机软件著作权登记信息（APP 端展示） */
			showCopyrightInfo() {
				uni.showModal({
					title: '软件著作权',
					content: '软件名称：微能站\n登记号：2024SR0089155\n著作权人：国创能源互联网创新中心（广东）有限公司',
					showCancel: false,
					confirmText: '我知道了'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		/* 底部安全区兼容：老基础库只认 constant()，新基础库认 env() */
		padding-bottom: 24rpx;
		padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));

		&.android-platform {
			.fixed-placeholder { height: calc(25px + 44px + 20px); }
		}
		&.ios-platform {
			.fixed-placeholder { height: calc(44px); }
		}

		/* ---------- 品牌区 ---------- */
		.hero {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 48rpx 0 56rpx;
		}

		.hero-logo {
			width: 128rpx;
			height: 128rpx;
			border-radius: 28rpx;
			box-shadow: 0 8rpx 24rpx rgba(31, 51, 89, 0.16);
		}

		.hero-name {
			margin-top: 28rpx;
			font-size: 38rpx;
			font-weight: 600;
			letter-spacing: 4rpx;
			color: #2b2f36;
		}

		.hero-slogan {
			display: flex;
			align-items: center;
			margin-top: 20rpx;

			.slogan-line {
				width: 48rpx;
				height: 1rpx;
				background-color: #d4d9e0;
			}

			.slogan-text {
				margin: 0 20rpx;
				font-size: 24rpx;
				letter-spacing: 2rpx;
				color: #8a9099;
			}
		}

		/* ---------- 信息卡片 ---------- */
		.card {
			margin: 0 24rpx;
			background-color: #ffffff;
			border-radius: 20rpx;
			border: 1rpx solid #eef0f4;
			box-shadow: 0 4rpx 16rpx rgba(31, 51, 89, 0.04);
			overflow: hidden;
		}

		.row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 28rpx;

			&:not(:last-child) {
				border-bottom: 1rpx solid #f2f4f7;
			}
		}

		.row-left {
			display: flex;
			align-items: center;
		}

		.row-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 44rpx;
			margin-right: 20rpx;
		}

		.row-label {
			font-size: 28rpx;
			color: #2b2f36;
		}

		.row-right {
			display: flex;
			align-items: center;
		}

		.row-value {
			font-size: 26rpx;
			color: #8a9099;
		}

		.row-chevron {
			display: flex;
			align-items: center;
			margin-left: 10rpx;
		}

		/* 按压反馈：透明黑叠加，浅色/深色主题均适用 */
		.row-hover {
			background-color: rgba(0, 0, 0, 0.03);
		}

		/* ---------- 备案 / 软著脚注 ---------- */
		.foot-note {
			margin: 24rpx 24rpx 0;
			padding: 22rpx 0;
			text-align: center;
			font-size: 24rpx;
			color: #a0a6ad;
			background-color: #ffffff;
			border-radius: 16rpx;
			border: 1rpx solid #eef0f4;
		}

		/* ---------- 版权区 ---------- */
		.flex-space {
			flex: 1;
		}

		.copyright {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 40rpx 24rpx 8rpx;

			.copyright-company {
				font-size: 24rpx;
				color: #8a9099;
			}

			.copyright-line {
				margin-top: 8rpx;
				font-size: 22rpx;
				color: #a9afb6;
			}
		}

		/* ---------- 深色主题适配（预留：bGColor 非白色时自动生效） ---------- */
		&.theme-dark {
			.hero-name { color: #e8eaee; }

			.hero-slogan {
				.slogan-line { background-color: rgba(255, 255, 255, 0.16); }
				.slogan-text { color: #9aa2ac; }
			}

			.card {
				background-color: rgba(255, 255, 255, 0.06);
				border-color: rgba(255, 255, 255, 0.10);
				box-shadow: none;
			}

			.row {
				&:not(:last-child) {
					border-bottom-color: rgba(255, 255, 255, 0.08);
				}
			}

			.row-label { color: #e8eaee; }
			.row-value { color: #9aa2ac; }

			.foot-note {
				color: #9aa2ac;
				background-color: rgba(255, 255, 255, 0.06);
				border-color: rgba(255, 255, 255, 0.10);
			}

			.copyright {
				.copyright-company { color: #9aa2ac; }
				.copyright-line { color: #767e88; }
			}
		}
	}
</style>
