<template>
	<view class="security-container" :class="platformClass">
		<DyNavbar title="安全设置" :titleStyle="navTitleStyle" :leftIconColor="navIconColor"></DyNavbar>
		<view class="fixed-placeholder"></view>

		<view class="page-content">
			<view class="group-label">账号与安全</view>

			<view class="card">
				<view class="row" hover-class="row-hover" @click="goto(3)">
					<uni-icons type="locked" size="18" :color="iconColor" />
					<text class="row-title">修改密码</text>
					<uni-icons type="right" size="15" color="#c0c4cc" />
				</view>

				<view class="divider"></view>

				<view class="row" hover-class="row-hover" @click="goToAccountCancellation">
					<uni-icons type="trash" size="18" :color="iconColor" />
					<text class="row-title">账户注销</text>
					<uni-icons type="right" size="15" color="#c0c4cc" />
				</view>
			</view>

			<view class="tip">注销账号后，账号资料、设备绑定关系与历史数据将被清除且无法恢复。</view>
		</view>
	</view>
</template>

<script>
	import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'

	export default {
		components: { DyNavbar },
		data() {
			let platform = ''
			try {
				if (typeof uni.getDeviceInfo === 'function') platform = (uni.getDeviceInfo() || {}).platform || ''
			} catch (e) {
				platform = ''
			}
			return {
				// 首帧确定平台，保证顶部占位与固定导航栏等高，避免内容上移
				platformClass: platform === 'ios' ? 'ios-platform' : 'android-platform'
			}
		},
		computed: {
			navIconColor() {
				return typeof this.fontColor === 'string' && this.fontColor ? this.fontColor : '#1a1a1a'
			},
			navTitleStyle() {
				return { color: this.navIconColor, width: '100%' }
			},
			iconColor() {
				return '#5f6570'
			}
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			goToAccountCancellation() { //账户注销
				uni.navigateTo({
					url: '/pages-public/account-cancellation/account-cancellation'
				})
			},
			goto(e) {
				let url = '';
				switch (e) {
					case 3:
						url = '/pages-public/userOptions/setUserName?type=3';
						break;
					case 4:
						url = '/pages-public/userOptions/setUserName?type=4';
						break;
					default:
						return;
				}
				uni.navigateTo({
					url: url
				});
			},
			showToast(type, title) {
				if (this.$refs.uToast) {
					this.$refs.uToast.show({
						type: type,
						icon: false,
						title: '提示',
						message: title
					})
				} else {
					uni.showToast({ title: title, icon: 'none' })
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.security-container {
		min-height: 100vh;
		background: #f5f6f8;
	}

	/* 占位与 DyNavbar 实际高度一致：安卓 89px（25+20 状态栏 + 44 导航条），
	   iOS 103px（59 安全区 + 44 导航条）。写小了内容会被固定导航栏遮住。 */
	.fixed-placeholder {
		height: calc(25px + 44px + 20px);

		.ios-platform & {
			height: calc(59px + 44px);
		}
	}

	.page-content {
		padding: 24rpx 28rpx 40rpx;
	}

	.group-label {
		padding: 0 8rpx 16rpx;
		font-size: 24rpx;
		color: #9aa0a8;
	}

	.card {
		background: #fff;
		border: 2rpx solid #eceef2;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.row {
		display: flex;
		align-items: center;
		padding: 32rpx 28rpx;
	}

	.row-hover {
		background: #fafbfc;
	}

	.row-title {
		flex: 1;
		margin-left: 20rpx;
		font-size: 28rpx;
		color: #1a1a1a;
	}

	.divider {
		height: 2rpx;
		background: #f0f1f4;
		margin-left: 88rpx;
	}

	.tip {
		padding: 24rpx 8rpx 0;
		font-size: 22rpx;
		line-height: 1.6;
		color: #a0a5ad;
	}
</style>
