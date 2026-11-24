<template>
	<view class="container" :class="platformClass">
		<DyNavbar title="账户注销" :titleStyle="{ 'color': fontColor, 'width': '100%', 'font-weight': '600' }"
			:placeholder="true" :leftIconColor="fontColor"></DyNavbar>
		<view class="fixed-placeholder"></view>
		<u-toast ref="uToast"></u-toast>

		<view class="page-content">
			<!-- 步骤指示 -->
			<view class="steps">
				<view class="step-item" :class="{ active: currentStep >= 1 }">
					<view class="step-dot">
						<text v-if="currentStep > 1" class="step-check">✓</text>
						<text v-else>1</text>
					</view>
					<text class="step-text">注销须知</text>
				</view>
				<view class="step-line" :class="{ active: currentStep > 1 }"></view>
				<view class="step-item" :class="{ active: currentStep >= 2 }">
					<view class="step-dot">2</view>
					<text class="step-text">身份验证</text>
				</view>
			</view>

			<!-- 第一步：注销须知 -->
			<view v-if="currentStep === 1" class="step-panel">
				<view class="warning-banner">
					<view class="warning-icon">!</view>
					<view class="warning-content">
						<view class="warning-title">注销后不可恢复</view>
						<view class="warning-desc">请确认已备份重要数据，并妥善处理账号相关服务</view>
					</view>
				</view>

				<view class="section-card">
					<view class="section-head">
						<text class="section-title">注销须知</text>
						<text class="section-subtitle">请逐项确认</text>
					</view>

					<view class="notice-list">
						<view class="notice-item">
							<text class="notice-index">1</text>
							<text class="notice-text">注销能源站账号是不可恢复的操作，请先自行备份账号相关信息与数据。</text>
						</view>
						<view class="notice-item">
							<text class="notice-index">2</text>
							<text class="notice-text">注销后，你将无法登录或使用当前账号，也无法找回个人资料、设备绑定关系及历史数据。</text>
						</view>
						<view class="notice-item">
							<text class="notice-index">3</text>
							<text class="notice-text">若账号存在投诉、调查、诉讼或仲裁等未结事项，平台有权依法终止注销申请。</text>
						</view>
					</view>
				</view>

				<view class="scope-card">
					<view class="scope-title">注销将清除</view>
					<view class="scope-tags">
						<text class="scope-tag">用户资料</text>
						<text class="scope-tag">设备绑定</text>
						<text class="scope-tag">消息记录</text>
						<text class="scope-tag">登录会话</text>
					</view>
					<view class="scope-note">能源站设备与公共数据不会被删除。</view>
				</view>

				<view class="agreement-row" @click="toggleAgreement">
					<view class="agreement-checkbox" :class="{ checked: isRead }">
						<text v-if="isRead" class="agreement-check-mark">✓</text>
					</view>
					<text class="agreement-text">我已阅读并知晓注销须知</text>
				</view>
			</view>

			<!-- 第二步：身份验证 -->
			<view v-else class="step-panel">
				<view class="back-hint" @click="prevStep">
					<view class="back-icon-wrapper">
						<text class="back-arrow">‹</text>
					</view>
					<text class="back-text">返回上一步</text>
				</view>

				<view class="verify-card">
					<view class="verify-head">
						<view class="verify-icon">
							<uni-icons type="phone" size="28" color="#4a8cff"></uni-icons>
						</view>
						<view class="verify-title">验证绑定手机号</view>
						<view class="verify-desc">为确保账号安全，请输入该手机号收到的验证码</view>
					</view>

					<view class="phone-row">
						<text class="phone-label">手机号</text>
						<text class="phone-number">{{ maskedPhone || '未获取到绑定手机号' }}</text>
					</view>

					<view class="form-item">
						<view class="input-wrap">
							<uni-icons type="locked" size="20" color="#9aa0a8"></uni-icons>
							<input class="code-input" type="number" maxlength="6" v-model.trim="verificationCode"
								placeholder="请输入6位验证码" placeholder-class="input-placeholder" />
							<view class="code-btn" :class="{ disabled: isCounting || codeSending }"
								@click="getCodePassword">
								{{ codeButtonText }}
							</view>
						</view>
						<view class="form-tip">验证码有效时间为 2 分钟，请勿向任何人提供。</view>
					</view>

					<button class="submit-btn" :class="{ 'is-loading': isLoading }" @click="showConfirmModal">
						{{ isLoading ? '正在处理...' : '确认注销' }}
					</button>
				</view>

				<view class="bottom-note">
					<view class="bottom-note-line"></view>
					<text>注销完成后，当前账号将自动退出登录</text>
					<view class="bottom-note-line"></view>
				</view>
			</view>
		</view>

		<!-- 底部操作区 -->
		<view v-if="currentStep === 1" class="footer-bar">
			<button class="footer-btn cancel-btn" @click="goBack">取消</button>
			<button class="footer-btn next-btn" :class="{ 'is-disabled': !isRead }" @click="nextStep">下一步</button>
		</view>

		<!-- 二次确认 -->
		<view v-if="showModal" class="modal-overlay" @click="closeModal">
			<view class="modal-content" @click.stop>
				<view class="modal-icon">!</view>
				<view class="modal-title">确认注销账号？</view>
				<view class="modal-desc">账号注销后，所有个人数据及关联关系将被清除，且无法恢复。</view>
				<view class="modal-btn-row">
					<button class="modal-btn modal-cancel" @click="closeModal">我再想想</button>
					<button class="modal-btn modal-confirm" :disabled="isLoading" @click="confirmAccountDelete">
						{{ isLoading ? '处理中...' : '确认注销' }}
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'
	import { sendSmsCode, cancelAccount } from '@/api/user'
	import { destroySocket } from '@/service/websocket'

	export default {
		components: { DyNavbar },
		data() {
			let platform = ''
			try {
				if (typeof uni.getDeviceInfo === 'function') {
					platform = (uni.getDeviceInfo() || {}).platform || ''
				}
			} catch (e) {
				platform = ''
			}
			return {
				// 首帧就确定平台，保证顶部占位高度与导航栏一致，避免内容上移闪一下
				platformClass: platform === 'ios' ? 'ios-platform' : 'android-platform',
				currentStep: 1,
				isRead: false,
				phone: '',
				userId: '',
				verificationCode: '',
				verificationCodeText: '获取验证码',
				countdown: 0,
				codeTimer: null,
				isCounting: false,
				codeSending: false,
				isLoading: false,
				showModal: false
			}
		},
		computed: {
			fontColor() {
				return this.$store.state.fontColor || '#1a1a1a'
			},
			maskedPhone() {
				return this.phone ? this.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''
			},
			codeButtonText() {
				if (this.codeSending) return '发送中...'
				if (this.isCounting) return `${this.countdown}s 后重发`
				return '获取验证码'
			}
		},
		onLoad() {
			this.loadAccount()
			this.setPlatformClass()
		},
		onUnload() {
			this.clearCountdown()
		},
		onHide() {
			this.clearCountdown()
		},
		methods: {
			loadAccount() {
				let lifeUser = {}
				try {
					lifeUser = (uni.getStorageSync('lifeData') || {}).userInfo || {}
				} catch (e) {
					lifeUser = {}
				}
				const userInfo = this.$store.state.userInfo || lifeUser || {}
				const moduleUser = this.$store.state.user || {}
				this.phone = userInfo.mobile_phone || userInfo.mobile || moduleUser.mobile || uni.getStorageSync('phone') || ''
				this.userId = userInfo.userId || userInfo.id || moduleUser.id || ''
			},
			setPlatformClass() {
				let platform = ''
				try {
					if (typeof uni.getDeviceInfo === 'function') {
						platform = (uni.getDeviceInfo() || {}).platform || ''
					}
				} catch (e) {
					platform = ''
				}
				this.platformClass = platform === 'ios' ? 'ios-platform' : 'android-platform'
			},
			showToast(title, type = 'none') {
				if (this.$refs.uToast) {
					this.$refs.uToast.show({ title, type, duration: 1800 })
				} else {
					uni.showToast({ title, icon: type === 'success' ? 'success' : 'none', duration: 1800 })
				}
			},
			toggleAgreement() {
				this.isRead = !this.isRead
			},
			goBack() {
				uni.navigateBack({
					fail: () => uni.reLaunch({ url: '/pages/index/index' })
				})
			},
			nextStep() {
				if (!this.isRead) {
					this.showToast('请先阅读并确认注销须知', 'error')
					return
				}
				if (!this.phone || !/^1[3-9]\d{9}$/.test(this.phone)) {
					this.showToast('未获取到有效手机号，请重新登录', 'error')
					return
				}
				this.currentStep = 2
			},
			prevStep() {
				this.currentStep = 1
				this.clearCountdown()
			},
			clearCountdown() {
				if (this.codeTimer) {
					clearInterval(this.codeTimer)
					this.codeTimer = null
				}
				this.isCounting = false
				this.countdown = 0
				this.verificationCodeText = '获取验证码'
			},
			startCountdown() {
				this.clearCountdown()
				this.isCounting = true
				this.countdown = 60
				this.codeTimer = setInterval(() => {
					this.countdown--
					if (this.countdown <= 0) {
						this.clearCountdown()
					}
				}, 1000)
			},
			getCodePassword() {
				if (this.codeSending || this.isCounting) return
				if (!this.phone || !/^1[3-9]\d{9}$/.test(this.phone)) {
					this.showToast('未获取到有效手机号，请重新登录', 'error')
					return
				}
				this.codeSending = true
				sendSmsCode(this.phone).then(res => {
					if (res && (res.code === 200 || res.status === 200)) {
						this.startCountdown()
						this.showToast('验证码已发送', 'success')
					} else {
						const message = (res && (res.msg || res.message)) || '验证码发送失败'
						this.showToast(message, 'error')
					}
				}).catch(() => {
					this.showToast('验证码发送失败，请稍后重试', 'error')
				}).finally(() => {
					this.codeSending = false
				})
			},
			showConfirmModal() {
				const code = String(this.verificationCode || '').trim()
				if (!/^\d{6}$/.test(code)) {
					this.showToast('请输入6位短信验证码', 'error')
					return
				}
				this.verificationCode = code
				this.showModal = true
			},
			closeModal() {
				if (this.isLoading) return
				this.showModal = false
			},
			async confirmAccountDelete() {
				if (this.isLoading) return
				this.isLoading = true
				this.showModal = false
				uni.showLoading({ title: '正在注销...', mask: true })

				try {
					const res = await cancelAccount({
						userId: this.userId ? Number(this.userId) : undefined,
						tel: this.phone,
						code: Number(this.verificationCode)
					})
					uni.hideLoading()
					if (res && (res.code === 200 || res.status === 200)) {
						uni.showToast({ title: '账号已注销', icon: 'success', duration: 1200 })
						await this.clearLoginState()
						setTimeout(() => {
							uni.reLaunch({ url: '/pages/login/login' })
						}, 800)
					} else {
						const message = (res && (res.msg || res.message)) || '注销失败，请稍后重试'
						this.showToast(message, 'error')
					}
				} catch (e) {
					uni.hideLoading()
					this.showToast('注销失败，请稍后重试', 'error')
				} finally {
					this.isLoading = false
				}
			},
			async clearLoginState() {
				this.clearCountdown()
				try {
					destroySocket()
				} catch (e) { }
				try {
					await this.$store.dispatch('user/logout')
				} catch (e) { }
				try {
					this.$store.commit('CLEAR_DEVICE_STATE')
					this.$store.commit('$uStore', { name: 'userInfo', value: {} })
					this.$store.commit('$uStore', { name: 'hasLogin', value: false })
					this.$store.commit('$uStore', { name: 'token', value: '' })
					this.$store.commit('$uStore', { name: 'currentSelectDevice', value: {} })
				} catch (e) { }
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background: #f5f6f8;
		color: #1a1a1a;
	}

	/* 占位必须与 DyNavbar 实际高度一致：
	   安卓 状态栏(25px+20px) + 导航条 44px = 89px；
	   iOS  安全区 59px + 导航条 44px = 103px。
	   否则内容会上移被固定导航栏遮住（步骤圆点显示不全）。 */
	.fixed-placeholder {
		height: calc(25px + 44px + 20px);

		.ios-platform & {
			height: calc(59px + 44px);
		}
	}

	.page-content {
		padding: 28rpx 28rpx 220rpx;
	}

	/* 步骤指示 */
	.steps {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8rpx 40rpx 32rpx;
	}

	.step-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 120rpx;
	}

	.step-dot {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		border: 2rpx solid #d8dce3;
		background: #fff;
		color: #9aa0a8;
		font-size: 26rpx;
		line-height: 44rpx;
		text-align: center;
		font-weight: 600;
	}

	.step-item.active .step-dot {
		background: #4a8cff;
		border-color: #4a8cff;
		color: #fff;
	}

	.step-check {
		font-size: 28rpx;
	}

	.step-text {
		margin-top: 12rpx;
		font-size: 24rpx;
		color: #9aa0a8;
	}

	.step-item.active .step-text {
		color: #1a1a1a;
		font-weight: 500;
	}

	.step-line {
		flex: 1;
		height: 2rpx;
		background: #e5e8ed;
		/* 让连线对齐圆点垂直中心（圆点 48rpx，其中心距顶部 24rpx） */
		margin: -23rpx 16rpx 0;
	}

	.step-line.active {
		background: #4a8cff;
	}

	.step-panel {
		animation: fade-in 0.2s ease;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* 警示条 */
	.warning-banner {
		display: flex;
		align-items: flex-start;
		padding: 24rpx;
		background: #fff5f4;
		border: 2rpx solid #ffd9d5;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
	}

	.warning-icon {
		flex-shrink: 0;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: #e54d42;
		color: #fff;
		font-size: 28rpx;
		font-weight: 700;
		line-height: 40rpx;
		text-align: center;
		margin-right: 18rpx;
	}

	.warning-content {
		flex: 1;
	}

	.warning-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #b52d24;
		margin-bottom: 6rpx;
	}

	.warning-desc {
		font-size: 24rpx;
		line-height: 1.55;
		color: #a6524b;
	}

	/* 内容卡片 */
	.section-card,
	.verify-card {
		background: #fff;
		border: 2rpx solid #eceef2;
		border-radius: 20rpx;
		padding: 32rpx;
		box-shadow: 0 4rpx 20rpx rgba(24, 32, 48, 0.04);
	}

	.section-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding-bottom: 24rpx;
		border-bottom: 2rpx solid #f0f1f4;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
	}

	.section-subtitle {
		font-size: 22rpx;
		color: #a0a5ad;
	}

	.notice-list {
		padding-top: 8rpx;
	}

	.notice-item {
		display: flex;
		align-items: flex-start;
		padding: 24rpx 0;
		border-bottom: 2rpx solid #f4f5f7;

		&:last-child {
			border-bottom: none;
			padding-bottom: 4rpx;
		}
	}

	.notice-index {
		flex-shrink: 0;
		width: 40rpx;
		height: 40rpx;
		margin-right: 18rpx;
		border-radius: 50%;
		background: #f0f4fb;
		color: #4a8cff;
		font-size: 24rpx;
		line-height: 40rpx;
		text-align: center;
		font-weight: 600;
	}

	.notice-text {
		flex: 1;
		font-size: 26rpx;
		line-height: 1.7;
		color: #555b64;
	}

	.scope-card {
		margin-top: 24rpx;
		padding: 28rpx 32rpx;
		background: #fff;
		border: 2rpx solid #eceef2;
		border-radius: 20rpx;
	}

	.scope-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 20rpx;
	}

	.scope-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
	}

	.scope-tag {
		padding: 10rpx 20rpx;
		border-radius: 28rpx;
		background: #f5f7fa;
		border: 2rpx solid #e9ebef;
		color: #5f6570;
		font-size: 24rpx;
	}

	.scope-note {
		margin-top: 20rpx;
		font-size: 22rpx;
		color: #9aa0a8;
	}

	.agreement-row {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 36rpx 0 12rpx;
	}

	.agreement-checkbox {
		width: 34rpx;
		height: 34rpx;
		margin-right: 14rpx;
		border: 2rpx solid #c8ccd3;
		border-radius: 8rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.agreement-checkbox.checked {
		background: #4a8cff;
		border-color: #4a8cff;
	}

	.agreement-check-mark {
		color: #fff;
		font-size: 24rpx;
		line-height: 1;
	}

	.agreement-text {
		font-size: 26rpx;
		color: #4a4f57;
	}

	/* 验证步骤 */
	.back-hint {
		display: inline-flex;
		align-items: center;
		padding: 8rpx 20rpx 8rpx 8rpx;
		margin-bottom: 24rpx;
	}

	.back-icon-wrapper {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: #edf3ff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12rpx;
	}

	.back-arrow {
		font-size: 34rpx;
		color: #4a8cff;
		line-height: 1;
		margin-top: -4rpx;
	}

	.back-text {
		font-size: 26rpx;
		color: #4a8cff;
	}

	.verify-head {
		text-align: center;
		padding-bottom: 32rpx;
		border-bottom: 2rpx solid #f0f1f4;
	}

	.verify-icon {
		width: 76rpx;
		height: 76rpx;
		margin: 0 auto 20rpx;
		border-radius: 50%;
		background: #edf3ff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.verify-title {
		font-size: 34rpx;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 10rpx;
	}

	.verify-desc {
		font-size: 24rpx;
		line-height: 1.6;
		color: #8a9099;
	}

	.phone-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx 0 24rpx;
	}

	.phone-label {
		font-size: 26rpx;
		color: #8a9099;
	}

	.phone-number {
		font-size: 30rpx;
		font-weight: 600;
		color: #1a1a1a;
	}

	.form-item {
		margin-bottom: 36rpx;
	}

	.input-wrap {
		display: flex;
		align-items: center;
		height: 92rpx;
		padding: 0 24rpx;
		border: 2rpx solid #e3e6eb;
		border-radius: 14rpx;
		background: #fafbfc;
	}

	.code-input {
		flex: 1;
		height: 88rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #1a1a1a;
	}

	.input-placeholder {
		color: #b3b8c0;
	}

	.code-btn {
		flex-shrink: 0;
		min-width: 160rpx;
		text-align: center;
		font-size: 26rpx;
		color: #4a8cff;
		font-weight: 500;
	}

	.code-btn.disabled {
		color: #a8adb5;
	}

	.form-tip {
		margin-top: 16rpx;
		font-size: 22rpx;
		line-height: 1.5;
		color: #9aa0a8;
	}

	.submit-btn {
		width: 100%;
		height: 92rpx;
		line-height: 92rpx;
		border: none;
		border-radius: 14rpx;
		background: #e54d42;
		color: #fff;
		font-size: 30rpx;
		font-weight: 600;
	}

	.submit-btn::after,
	.footer-btn::after,
	.modal-btn::after {
		border: none;
	}

	.submit-btn.is-loading {
		opacity: 0.75;
	}

	.bottom-note {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 40rpx;
	}

	.bottom-note-line {
		width: 60rpx;
		height: 2rpx;
		background: #e3e6eb;
		margin: 0 20rpx;
	}

	.bottom-note text {
		font-size: 22rpx;
		color: #a0a5ad;
	}

	/* 底部操作 */
	.footer-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		gap: 20rpx;
		padding: 20rpx 28rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		background: #fff;
		border-top: 2rpx solid #eceef2;
		z-index: 100;
	}

	.footer-btn {
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 14rpx;
		font-size: 28rpx;
		font-weight: 500;
	}

	.cancel-btn {
		flex: 1;
		border: 2rpx solid #dfe2e8;
		background: #fff;
		color: #5f6570;
	}

	.next-btn {
		flex: 2;
		border: none;
		background: #4a8cff;
		color: #fff;
	}

	.next-btn.is-disabled {
		background: #d8dfec;
		color: #fff;
	}

	/* 弹窗 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 48rpx;
		background: rgba(18, 22, 28, 0.45);
		z-index: 1000;
		animation: fade-in 0.18s ease;
	}

	.modal-content {
		width: 100%;
		max-width: 600rpx;
		padding: 40rpx 36rpx 32rpx;
		border-radius: 22rpx;
		background: #fff;
		text-align: center;
	}

	.modal-icon {
		width: 76rpx;
		height: 76rpx;
		margin: 0 auto 22rpx;
		border-radius: 50%;
		background: #fff1f0;
		border: 2rpx solid #ffd4d0;
		color: #e54d42;
		font-size: 44rpx;
		font-weight: 700;
		line-height: 72rpx;
	}

	.modal-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 16rpx;
	}

	.modal-desc {
		font-size: 26rpx;
		line-height: 1.7;
		color: #6b7078;
		margin-bottom: 36rpx;
	}

	.modal-btn-row {
		display: flex;
		gap: 20rpx;
	}

	.modal-btn {
		flex: 1;
		height: 84rpx;
		line-height: 84rpx;
		border-radius: 14rpx;
		font-size: 28rpx;
		font-weight: 500;
	}

	.modal-cancel {
		border: 2rpx solid #dfe2e8;
		background: #fff;
		color: #5f6570;
	}

	.modal-confirm {
		border: none;
		background: #e54d42;
		color: #fff;
	}
</style>
