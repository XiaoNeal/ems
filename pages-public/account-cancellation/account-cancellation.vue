<template>
	<view class="container" :class="platformClass">
		<DyNavbar title="账户注销" :titleStyle="{ 'color': fontColor, 'width': '100%', 'font-weight': '600' }" :placeholder="true" :leftIconColor="fontColor"></DyNavbar>
		<view class="fixed-placeholder"></view>
		<u-toast ref="uToast"></u-toast>

		<!-- 第一步：注销须知 -->
		<view v-if="!confirmCancellation" class="page-content">
			<!-- 警示区域 -->
			<view class="warning-card">
				<view class="warning-icon">⚠</view>
				<view class="warning-content">
					<view class="warning-title">重要提醒</view>
					<view class="warning-desc">账户注销后将无法恢复，请谨慎操作</view>
				</view>
			</view>

			<!-- 注销须知卡片 -->
			<view class="section-card">
				<view class="section-header">
					<text class="section-title">注销须知</text>
				</view>
				<view class="section-content">
					<view class="notice-item">
						<text class="notice-number">1</text>
						<text class="notice-text">注销微能站帐号是不可恢复的操作，你应自行备份微能站帐号相关的信息和数据。操作之前，请确认与微能站帐号相关的所有服务均已进行妥善处理。</text>
					</view>
					<view class="notice-item">
						<text class="notice-number">2</text>
						<text class="notice-text">注销后，你将无法登录、使用本微能站帐号，也无法找回个人资料和历史信息（包含昵称、头像、设备信息、发电报告、用电报告等）。</text>
					</view>
					<view class="notice-item">
						<text class="notice-number">3</text>
						<text class="notice-text">在微能站帐号注销期间，如果你的微能站帐号被他人投诉、被国家机关调查或者正处于诉讼、仲裁程序中，微能站有权自行终止注销而无需另行得到你的同意。</text>
					</view>
				</view>
			</view>

			<!-- 确认勾选 -->
			<view class="checkbox-row">
				<radio :checked="isRead" @click="isRead = !isRead" color="#4a8cff" />
				<text :style="{ color: fontColor }">我已阅读并知晓注销须知</text>
			</view>

			<!-- 底部按钮区 -->
			<view class="btn-row">
				<button class="cancel-btn" @click="goBack">取消</button>
				<button class="confirm-btn" :class="{ disabled: !isRead }" @click="nextStep">下一步</button>
			</view>
		</view>

		<!-- 第二步：手机验证 -->
		<view v-if="confirmCancellation" class="page-content">
			<!-- 返回提示 -->
			<view class="back-hint" @click="confirmCancellation = false">
				<view class="back-icon-wrapper">
					<text class="back-arrow">‹</text>
				</view>
				<text class="back-text" :style="{ color: fontColor }">返回上一步</text>
			</view>

			<view class="verify-card">
				<view class="verify-header">
					<view class="verify-icon">📱</view>
					<view class="verify-title">身份验证</view>
					<view class="verify-desc">为确保账户安全，请验证你的身份</view>
				</view>

				<view class="verify-content">
					<view class="phone-info">
						<text :style="{ color: fontColor }">验证码将发送至</text>
						<text class="phone-number">{{ phone }}</text>
					</view>

					<view class="input-group">
						<input type="text" placeholder="请输入验证码" v-model="verificationCodePassword" :disabled="confirmPassword" class="code-input" />
						<text class="code-btn" :class="{ disabled: confirmPassword }" @click="getCodePassword">
							{{ verificationCodeText }}
						</text>
					</view>

					<button class="submit-btn" @click="showConfirmModal">确认注销</button>
				</view>
			</view>
		</view>

		<!-- 二次确认弹窗 -->
		<view v-if="showModal" class="modal-overlay" @click="showModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-icon">😱</view>
				<view class="modal-title">确认注销账户？</view>
				<view class="modal-desc">账户注销后，所有数据将被清除且无法恢复</view>
				<view class="modal-btn-row">
					<button class="modal-cancel" @click="showModal = false">我再想想</button>
					<button class="modal-confirm" @click="confirmAccountDelete">确认注销</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'

	export default {
		components: { DyNavbar },
		data() {
			return {
				platformClass: '',
				isRead: false,
				confirmCancellation: false,
				phone: '',
				verificationCodePassword: '',
				verificationCodeText: '获取验证码',
				confirmPassword: false,
				isLoading: false,
				showModal: false
			}
		},
		onLoad() {
			this.phone = uni.getStorageSync('phone')
			uni.getSystemInfo({
				success: (res) => {
					this.platformClass = res.platform === 'ios' ? 'ios-platform' : 'android-platform'
				}
			})
		},
		methods: {
			nextStep() {
				if (!this.isRead) {
					this.$refs.uToast.show({
						title: '请先阅读并同意注销须知',
						type: 'error'
					})
					return
				}
				this.confirmCancellation = true
			},
			getCodePassword() {
				if (this.confirmPassword) {
					return
				}
				this.confirmPassword = true
				this.verificationCodeText = '60s'
				let num = 60
				let timer = setInterval(() => {
					num--
					this.verificationCodeText = num + 's'
					if (num === 0) {
						clearInterval(timer)
						this.confirmPassword = false
						this.verificationCodeText = '获取验证码'
					}
				}, 1000)
				uni.request({
					url: 'https://serviceiems.gree.com/appletAPI/user/sendVerifyCode',
					method: 'POST',
					data: {
						phone: this.phone,
						type: 3
					},
					success: (res) => {
						if (res.data.code === 200) {
							this.$refs.uToast.show({
								title: '发送成功',
								type: 'success'
							})
						} else {
							this.$refs.uToast.show({
								title: res.data.message,
								type: 'error'
							})
						}
					},
					fail: () => {
						this.$refs.uToast.show({
							title: '网络请求失败',
							type: 'error'
						})
					}
				})
			},
			showConfirmModal() {
				if (!this.verificationCodePassword) {
					this.$refs.uToast.show({
						title: '请输入验证码',
						type: 'error'
					})
					return
				}
				this.showModal = true
			},
			confirmAccountDelete() {
				this.showModal = false
				this.isLoading = true
				uni.showLoading({
					title: '处理中...'
				})
				uni.request({
					url: 'https://serviceiems.gree.com/appletAPI/user/cancelAccount',
					method: 'POST',
					data: {
						phone: this.phone,
						verifyCode: this.verificationCodePassword
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.hideLoading()
							uni.removeStorageSync('token')
							uni.removeStorageSync('phone')
							uni.redirectTo({
								url: '/pages-public/login/login'
							})
						} else {
							this.$refs.uToast.show({
								title: res.data.message,
								type: 'error'
							})
						}
					},
					fail: () => {
						uni.hideLoading()
						this.$refs.uToast.show({
							title: '网络请求失败',
							type: 'error'
						})
					},
					complete: () => {
						this.isLoading = false
						uni.hideLoading()
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background: linear-gradient(180deg, #f0f5ff 0%, #f5f7fb 30%);

		&.android-platform {
			.fixed-placeholder {
				height: calc(25px + 44px + 20px);
			}
		}

		&.ios-platform {
			.fixed-placeholder {
				height: calc(44px);
				background: #fff;
			}
		}
	}

	/* 页面内容 */
	.page-content {
		padding: 24rpx;
		padding-bottom: 160rpx;
	}

	/* 警示卡片 */
	.warning-card {
		display: flex;
		align-items: center;
		background: linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%);
		border-radius: 20rpx;
		padding: 32rpx;
		margin-bottom: 32rpx;
		border-left: 8rpx solid #faad14;
		box-shadow: 0 4rpx 16rpx rgba(250, 173, 20, 0.15);
	}

	.warning-icon {
		font-size: 48rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.warning-content {
		flex: 1;
	}

	.warning-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #d46b08;
		margin-bottom: 8rpx;
	}

	.warning-desc {
		font-size: 24rpx;
		color: #fa8c16;
	}

	/* 注销须知卡片 */
	.section-card {
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
		margin-bottom: 32rpx;
	}

	.section-header {
		text-align: center;
		margin-bottom: 32rpx;
	}

	.section-title {
		font-size: 34rpx;
		font-weight: 600;
		color: #1a1a1a;
	}

	.section-content {
		.notice-item {
			display: flex;
			margin-bottom: 28rpx;
			padding-bottom: 28rpx;
			border-bottom: 2rpx solid #f0f0f0;

			&:last-child {
				border-bottom: none;
				margin-bottom: 0;
				padding-bottom: 0;
			}
		}

		.notice-number {
			flex-shrink: 0;
			width: 48rpx;
			height: 48rpx;
			line-height: 48rpx;
			text-align: center;
			background: linear-gradient(135deg, #4a8cff 0%, #6b9dff 100%);
			color: #fff;
			border-radius: 50%;
			font-size: 24rpx;
			font-weight: 600;
			margin-right: 20rpx;
		}

		.notice-text {
			flex: 1;
			font-size: 26rpx;
			line-height: 1.7;
			color: #555;
		}
	}

	/* 复选框行 */
	.checkbox-row {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 40rpx;
		font-size: 28rpx;

		radio {
			margin-right: 16rpx;
			transform: scale(1.2);
		}
	}

	/* 底部按钮区 */
	.btn-row {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 24rpx 32rpx;
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		background: #fff;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
		display: flex;
		gap: 20rpx;
	}

	.cancel-btn {
		flex: 1;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #666;
		border: 2rpx solid #e0e0e0;
		background: #fff;
		transition: all 0.3s ease;

		&:active {
			background: #f5f5f5;
			transform: scale(0.98);
		}
	}

	.confirm-btn {
		flex: 2;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #fff;
		border: none;
		background: linear-gradient(135deg, #4a8cff 0%, #6b9dff 50%, #4a8cff 100%);
		background-size: 200% 100%;
		box-shadow: 0 8rpx 20rpx rgba(74, 140, 255, 0.3);
		transition: all 0.3s ease;

		&.disabled {
			background: linear-gradient(180deg, #e0e0e0 0%, #d0d0d0 100%);
			box-shadow: none;
			opacity: 0.6;
		}

		&:active:not(.disabled) {
			transform: scale(0.98);
			background-position: 100% 0;
			box-shadow: 0 4rpx 12rpx rgba(74, 140, 255, 0.3);
		}
	}

	/* 返回提示 */
	.back-hint {
		display: flex;
		align-items: center;
		padding: 16rpx 20rpx;
		margin-bottom: 24rpx;
		background: rgba(74, 140, 255, 0.08);
		border-radius: 40rpx;
		width: fit-content;
		transition: all 0.2s ease;

		&:active {
			background: rgba(74, 140, 255, 0.15);
			transform: scale(0.98);
		}

		.back-icon-wrapper {
			width: 48rpx;
			height: 48rpx;
			border-radius: 50%;
			background: linear-gradient(135deg, #4a8cff 0%, #6b9dff 100%);
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 12rpx;
		}

		.back-arrow {
			font-size: 32rpx;
			color: #fff;
			line-height: 1;
			margin-top: -4rpx;
		}

		.back-text {
			font-size: 26rpx;
			font-weight: 500;
		}
	}

	/* 验证卡片 */
	.verify-card {
		background: #fff;
		border-radius: 28rpx;
		padding: 48rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
	}

	.verify-header {
		text-align: center;
		margin-bottom: 48rpx;
	}

	.verify-icon {
		font-size: 80rpx;
		margin-bottom: 20rpx;
	}

	.verify-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 12rpx;
	}

	.verify-desc {
		font-size: 26rpx;
		color: #666;
	}

	.verify-content {
		.phone-info {
			text-align: center;
			font-size: 26rpx;
			color: #666;
			margin-bottom: 40rpx;

			.phone-number {
				color: #4a8cff;
				font-weight: 600;
				font-size: 28rpx;
				margin-left: 8rpx;
			}
		}
	}

	/* 输入组 */
	.input-group {
		display: flex;
		align-items: center;
		gap: 16rpx;
		margin-bottom: 40rpx;
	}

	.code-input {
		flex: 1;
		height: 88rpx;
		padding: 0 28rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 16rpx;
		font-size: 28rpx;
		background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
		box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.04);
		transition: all 0.3s ease;

		&:focus {
			border-color: #4a8cff;
			background: #fff;
			box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.04), 0 0 0 4rpx rgba(74, 140, 255, 0.1);
		}
	}

	.code-btn {
		flex-shrink: 0;
		width: 180rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		border-radius: 16rpx;
		background: linear-gradient(135deg, #f0f5ff 0%, #e6edff 100%);
		border: 2rpx solid #a3c0f5;
		color: #4a8cff;
		font-size: 24rpx;
		font-weight: 500;
		transition: all 0.3s ease;
		box-shadow: 0 4rpx 12rpx rgba(74, 140, 255, 0.1);

		&.disabled {
			background: #f5f5f5;
			border-color: #e0e0e0;
			color: #999;
			box-shadow: none;
		}

		&:active:not(.disabled) {
			transform: scale(0.97);
			background: linear-gradient(135deg, #e6edff 0%, #d3deff 100%);
		}
	}

	/* 提交按钮 */
	.submit-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #fff;
		border: none;
		background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 50%, #ff6b6b 100%);
		background-size: 200% 100%;
		box-shadow: 0 8rpx 20rpx rgba(255, 107, 107, 0.3);
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.98);
			background-position: 100% 0;
			box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.3);
		}
	}

	/* 弹窗遮罩 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* 弹窗内容 */
	.modal-content {
		width: 560rpx;
		background: #fff;
		border-radius: 24rpx;
		padding: 48rpx;
		text-align: center;
		animation: slideUp 0.3s ease;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(40rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.modal-icon {
		font-size: 80rpx;
		margin-bottom: 24rpx;
	}

	.modal-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 16rpx;
	}

	.modal-desc {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 40rpx;
	}

	.modal-btn-row {
		display: flex;
		gap: 20rpx;
	}

	.modal-cancel {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #666;
		border: 2rpx solid #e0e0e0;
		background: #fff;

		&:active {
			background: #f5f5f5;
		}
	}

	.modal-confirm {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #fff;
		border: none;
		background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);

		&:active {
			transform: scale(0.98);
		}
	}
</style>
