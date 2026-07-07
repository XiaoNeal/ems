<template>
	<view class="content" :style="'background-color:' + bGColor" :class="platformClass">
		<!-- <u-navbar v-if="type != 4" title=" 1111" leftIconColor="#fff" :titleStyle="{ 'color': fontColor, 'width': '100%' }"
			:leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg"></u-navbar> -->
		<DyNavbar :title="pageTitle" :titleStyle="{ 'color': fontColor, 'width': '100%', 'font-weight': '600' }" :placeholder="true" :leftIconColor="fontColor"></DyNavbar>
		<view class="fixed-placeholder"></view>
		<u-toast ref="uToast"></u-toast>
		<!-- 改用户名 -->
		<view class="modify" v-if="type == 1">
			<view class="section-title">更改用户名</view>
			<view class="section-desc">请输入新用户名，此名称用于登录</view>
			<input class="input-text" type="text" v-model="setUserName" placeholder="请输入用户名">
			<button class="primary-btn" @click="modifyUserName">确定</button>
		</view>

		<!-- 更改手机号 -->
		<view class="modify" v-if="type == 2">
			<view class="section-title">更改手机号</view>
			<input class="input-text" type="text" placeholder="请输入新手机号" v-model="setUserPhone">
			<view class="verification-code">
				<input class="code-input" type="text" placeholder="请输入验证码" v-model="verificationCodePhone">
				<view class="code-btn" @click="getCode">{{ verificationCodeText }}</view>
			</view>
			<button class="primary-btn" @click="modifyPhone">确定</button>
		</view>

		<!-- 更改密码 -->
		<view class="modify" v-if="type == 3">
			<view class="form-container">
				<view class="tip-text">验证码将发送至 {{ mobile }}</view>

				<!-- 新密码输入 -->
				<view class="input-group">
					<text class="input-label">新密码</text>

					<view class="input-container">
						<input class="input-field" :type="showPassword ? 'text' : 'password'" placeholder="至少6位字母和数字组合"
							v-model.trim="newPassword" @focus="showPasswordRules = true"
							@blur="validatePasswordStrength" maxlength="20">
						<uni-icons :type="showPassword ? 'eye-filled' : 'eye-closed-filled'"
							@click="showPassword = !showPassword" class="password-toggle"></uni-icons>
					</view>

				</view>

				<!-- 密码强度实时反馈 -->
				<transition name="slide-fade">
					<view v-if="showPasswordRules" class="password-rules">
						<view class="rule-item" v-for="(rule, index) in passwordRules" :key="index"
							:class="{ fulfilled: rule.condition }">
							<uni-icons :type="rule.condition ? 'checkbox-filled' : 'circle'" size="14"
								:color="rule.condition ? '#52c41a' : '#999'" />
							<text>{{ rule.text }}</text>
						</view>
					</view>
				</transition>

				<!-- 确认密码 -->
				<view class="input-group">
					<text class="input-label">确认密码</text>
					<view class="input-container">
						<input class="input-field" :type="showConfirmPassword ? 'text' : 'password'"
							placeholder="再次输入新密码" v-model.trim="confirmNewPassword" @blur="validatePasswordMatch"
							maxlength="20">
						<uni-icons :type="showConfirmPassword ? 'eye-filled' : 'eye-closed-filled'"
							@click="showConfirmPassword = !showConfirmPassword" class="password-toggle"></uni-icons>
					</view>
				</view>

				<!-- 验证码区域 -->
				<view class="code-group">
					<view class="input-header">
						<text class="input-label">短信验证码</text>
					</view>
					<view class="code-wrapper">
						<input class="code-input" type="text" placeholder="6位验证码" v-model="verificationCode"
							maxlength="6">
						<button class="code-btn" @click="handleGetCode" :disabled="isCounting || codeSending">
							<text v-if="!codeSending">
								{{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
							</text>
							<uni-load-more v-else status="loading" :icon-size="16" color="#999" />
						</button>
					</view>
				</view>

				<button class="submit-btn" @click="modifyPassword">
					确认修改
				</button>
			</view>
		</view>

	</view>
</template>

<script>
import { updateUserInfo, sendSmsCode, UpdatePasswordBySms } from "@/api/user.js"
import { mapState } from 'vuex';
import md5 from "@/utils/md5.min.js"
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'

export default {
	components: { DyNavbar },
	data() {
		return {
			showConfirmPassword: false,
			verificationCodeText: '获取验证码',
			countdown: 0,
			isGetCode: true,
			setUserPhone: '',
			phone: '',
			type: '',
			setUserName: '',
			newPassword: '',
			confirmNewPassword: '',
			verificationCodePassword: '',
			confirmPassword: true,
			verificationCodePhone: '',
			passwordStrength: 'weak',
			passwordRules: [
				{ text: '至少6个字符', condition: false },
				{ text: '包含字母', condition: false },
				{ text: '包含数字', condition: false }
			],
			showPasswordRules: false,
			passwordMatchError: false,
			verificationCode: '',
			isCounting: false,
			codeSending: false,
			codeFocus: false,
			timer: null,
			platformClass: ''
		}
	},
	computed: {
		...mapState('user', ['userName', 'mobile', 'id']),
		pageTitle() {
			switch (this.type) {
				case '1':
					return '更改用户名';
				case '2':
					return '更改手机号';
				case '3':
					return '修改密码';
				default:
					return '设置';
			}
		},
		progressWidth() {
			const index = ['弱', '中', '良', '强'].indexOf(this.passwordStrength);
			return `${(index + 1) * 25}%`;
		},
		strengthIndex() {
			return ['弱', '中', '良', '强'].indexOf(this.passwordStrength);
		},
	},
	onLoad() {
		uni.getSystemInfo({
			success: (res) => {
				this.platformClass = res.platform === "ios" ? "ios-platform" : "android-platform";
			},
		});
	},
	mounted() {
		let pages = getCurrentPages()
		let curr = pages[pages.length - 1].options.type
		this.type = curr
		this.setUserName = this.userName
		this.phone = this.mobile

		console.log(this.id, "=----=", this.user);

		// this.userPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
		// if(this.currentTemplate == 3){
		// 	this.fontColor ='#fff'
		// }
	},
	// 更新密码验证方法
	methods: {
		formatVerificationCode() {
			this.verificationCode = this.verificationCode
				.replace(/[^\d]/g, '')
				.replace(/(\d{3})(?=\d)/g, '$1 ')
		},
		handlePasswordInput(e) {
			this.newPassword = e.detail.value;
			// 延迟300ms验证避免频繁触发
			clearTimeout(this.validateTimer);
			this.validateTimer = setTimeout(() => {
				this.validatePassword();
			}, 300);
		},
		validatePassword() {
			// 强化密码规则：至少8位，包含大小写字母、数字和特殊符号
			// const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

			// 实时验证两次密码一致性
			if (this.newPassword && this.confirmNewPassword) {
				this.passwordMismatch = this.newPassword !== this.confirmNewPassword;
			}

			// 添加密码复杂度评分
			let score = 0;
			if (/[A-Z]/.test(this.newPassword)) score++;
			if (/[a-z]/.test(this.newPassword)) score++;
			if (/\d/.test(this.newPassword)) score++;
			if (/[!@#$%^&*]/.test(this.newPassword)) score++;
			this.passwordStrength = ['弱', '中', '良', '强'][Math.min(3, score)];
		},


		// 更新验证方法
		validatePasswordStrength() {
			this.passwordRules = this.passwordRules.map(rule => {
				if (rule.text === '至少6个字符') return { ...rule, condition: this.newPassword.length >= 6 }
				if (rule.text === '包含字母') return { ...rule, condition: /[a-zA-Z]/.test(this.newPassword) }
				if (rule.text === '包含数字') return { ...rule, condition: /\d/.test(this.newPassword) }
				return rule
			});

			const fulfilledCount = this.passwordRules.filter(r => r.condition).length;
			this.passwordStrength = ['弱', '中', '强'][Math.floor(fulfilledCount / 2)];
		},

		validatePasswordMatch() {
			if (this.newPassword && this.confirmNewPassword) {
				this.passwordMatchError = this.newPassword !== this.confirmNewPassword
				if (this.passwordMatchError) {
					uni.showToast({
						title: '两次输入密码不一致',
						icon: 'none',
						duration: 2000
					})
				}
			}
		},

		// 在提交时增加验证
		async modifyPassword() {
			if (!this.newPassword.match(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/)) {
				uni.showToast({
					title: '密码需至少6位且包含字母和数字',
					icon: 'none'
				});
				return;
			}
			if (!this.verificationCode || this.verificationCode.length !== 6) {
				uni.showToast({
					title: '验证码必须为6位数字',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			if (this.newPassword !== this.confirmNewPassword) {
				this.showToast({
					type: 'error',
					message: '两次输入的密码不一致',
				})
				return
			}

			//
			let that = this
			let formData = JSON.stringify({
				userId: that.id,
				tel: that.mobile,
				password: md5(that.newPassword).toString(),
				code: that.verificationCode
			})
			console.log(formData, "验证码");
			UpdatePasswordBySms(formData).then(res => {
				console.log(res, "修改密码");
				if (res.status == 200) {
					uni.showModal({
						title: '温馨提示',
						content: '修改完成，请点击确定重新登录',
						showCancel: false,
						success(response) {
							if (response.confirm) {
								uni.navigateBack({
									delta: 2
								})
								that.$u.vuex('currentTemplate', 0);
							}
						}
					})
				} else if (res.status == 500 && res.msg == '用户名已存在,请重新设置') {
					that.showToast({
						type: 'error',
						message: res.msg
					})
				}
			})
		},
		goBack() {
			uni.navigateBack()
		},
		goToAccountCancellation() { //账户注销
			uni.navigateTo({
				url: '/pages-public/account-cancellation/account-cancellation'
			})
		},
		modifyPhone() { //修改手机号
			let that = this
			if (!that.setUserPhone) {
				that.showToast({
					type: 'error',
					message: '手机号不能为空',
				})
				return
			}
			let formData = JSON.stringify({
				userId: that.memberId,
				newPhone: that.setUserPhone,
				verificationCode: that.verificationCodePhone
			})
			updateUserInfo(formData).then(res => {
				if (res.status == 200) {
					uni.showModal({
						title: '温馨提示',
						content: '修改完成，请点击确定重新登录',
						showCancel: false,
						success(response) {
							if (response.confirm) {
								uni.navigateBack({
									delta: 2
								})
								that.$u.vuex('currentTemplate', 0);
							}
						}
					})
				} else if (res.status == 500 && res.msg == '手机号已存在') {
					that.showToast({
						type: 'error',
						message: res.msg
					})
				}
			})
		},
		modifyUserName() { //修改用户名
			let that = this
			if (!that.setUserName) {
				that.showToast({
					type: 'error',
					message: '用户名不能为空',
				})
				return
			}
			if (that.setUserName == that.userName) {
				that.showToast({
					type: 'error',
					message: '新用户名与旧用户名一致',
				})
				return
			}
			let formData = JSON.stringify({
				userId: that.memberId,
				newUserName: that.setUserName
			})
			updateUserInfo(formData).then(res => {
				if (res.status == 200) {
					uni.showModal({
						title: '温馨提示',
						content: '修改完成，请点击确定重新登录',
						showCancel: false,
						success(response) {
							if (response.confirm) {
								// uni.reLaunch({
								// 	url: '/pages/index/index'
								// })
								that.$u.vuex('currentTemplate', 0);
							}
						}
					})
				} else if (res.status == 500 && res.msg == '用户名已存在,请重新设置') {
					that.showToast({
						type: 'error',
						message: res.msg
					})
				}
			})
		},
		async handleGetCode() {
			if (this.codeSending) return

			this.codeSending = true
			try {
				sendSmsCode(this.mobile).then(res => {
					// console.log(res, "验证码");
					// res = JSON.parse(decrypt(res));
					console.log(res);
					if (res.code === 200) {
						this.startCountdown()
						uni.showToast({ title: '验证码已发送', icon: 'success' })
					}
				})

			} catch (error) {
				console.error('发送失败:', error)
			} finally {
				this.codeSending = false
			}
		},
		startCountdown() {
			this.isCounting = true
			this.countdown = 60
			this.timer = setInterval(() => {
				if (this.countdown <= 0) {
					clearInterval(this.timer)
					this.isCounting = false
					return
				}
				this.countdown--
			}, 1000)
		},


		// getCodePassword() { //修改密码时获取的验证码
		// 	// if (!this.newPassword || !this.confirmNewPassword) {
		// 	// 	this.showToast({
		// 	// 		type: 'error',
		// 	// 		message: '密码不能为空',
		// 	// 	})
		// 	// 	return
		// 	// }
		// 	// if (this.newPassword !== this.confirmNewPassword) {
		// 	// 	this.showToast({
		// 	// 		type: 'error',
		// 	// 		message: '两次输入的密码不一致',
		// 	// 	})
		// 	// 	return
		// 	// }
		// 	if (!this.isGetCode) return

		// 	sendSmsCode(this.mobile).then(res => {
		// 		res = JSON.parse(decryptData(res));
		// 		console.log(res);
		// 		if (res.code === 200) {
		// 			this.showToast({
		// 				type: 'success',
		// 				message: '验证码已发送',
		// 				duration: 1500
		// 			});

		// 			// 倒计时逻辑优化
		// 			this.countdown = 60;
		// 			this.isGetCode = false;
		// 			this.verificationCodeText = `${this.countdown}秒后重获`;

		// 			const timer = setInterval(() => {
		// 				if (this.countdown <= 0) {
		// 					clearInterval(timer);
		// 					this.isGetCode = true;
		// 					this.verificationCodeText = '获取验证码';
		// 				} else {
		// 					this.countdown--;
		// 					this.verificationCodeText = `${this.countdown}秒后重获`;
		// 				}
		// 			}, 1000);
		// 		}
		// 	}).catch(err => {
		// 		this.showToast({
		// 			type: 'error',
		// 			message: '发送失败: ' + err.message
		// 		});
		// 	});
		// },
		getCode() { //修改手机时获取的验证码
			if (!this.isGetCode) return
			let reg = /^1([38]\d|4[579]|5[0-3,5-9]|66|7[0135678]|9[89])\d{8}$/
			if (!reg.test(this.setUserPhone)) {
				// 弹出提示框
				this.showToast({
					type: 'error',
					message: '请输入正确的手机号'
				})
				return
			}
			this.showToast({
				type: 'success',
				message: "验证码已发送，请查收"
			});
			let timer = setInterval(() => {
				if (this.countdown == 0) {
					clearInterval(timer)
					this.verificationCodeText = '获取验证码'
					this.countdown = 60
					this.isGetCode = true
				} else {
					this.countdown--
					this.verificationCodeText = `${this.countdown}秒后重新获取`
					this.isGetCode = false
				}
			}, 1000)
			sendSmsCode(this.setUserPhone).then(res => {
				if (res.status == 200) {
					this.confirmPassword = false
				}
			})

		},
		showToast(params) {
			this.$refs.uToast.show({
				...params
			})
		}
	},
}
</script>

<style lang="scss" scoped>
// 主容器样式
.content {
	min-height: 100vh;
	background: linear-gradient(180deg, #f0f5ff 0%, #f5f7fb 30%);
	padding: 32rpx;
	padding-top: calc(25px + 100rpx);
	box-sizing: border-box;

	.fixed-placeholder {
		height: calc(25px + 44px);
	}

	&.android-platform {
		.fixed-placeholder { height: calc(25px + 44px + 20px); }
	}

	&.ios-platform {
		.fixed-placeholder { height: calc( 44px); 
			background: #fff;
		}
	}
}

// 卡片容器
.modify {
	background: #fff;
	border-radius: 24rpx;
	padding: 48rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
	margin-bottom: 32rpx;
}

// 区块标题
.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 16rpx;
	text-align: center;
}

// 区块描述
.section-desc {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 32rpx;
	text-align: center;
	line-height: 1.6;
}

// 提示文字
.tip-text {
	font-size: 24rpx;
	color: #555;
	margin-bottom: 32rpx;
	text-align: center;
	padding: 20rpx 28rpx;
	background: linear-gradient(135deg, #fffbe6 0%, #fff7e6 100%);
	border-radius: 12rpx;
	border-left: 6rpx solid #faad14;
	line-height: 1.5;
	box-shadow: 0 2rpx 8rpx rgba(250, 173, 20, 0.12);
}

// 输入框基础样式
.input-text {
	width: 100%;
	height: 88rpx;
	padding: 0 28rpx;
	border: 2rpx solid #e0e0e0;
	border-radius: 16rpx;
	font-size: 28rpx;
	background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-sizing: border-box;
	box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.04);

	&:focus {
		border-color: #4a8cff;
		background: #ffffff;
		box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.04), 0 0 0 4rpx rgba(74, 140, 255, 0.1);
	}
}

// 验证码输入区域
.verification-code {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 32rpx;

	.code-input {
		flex: 1;
		height: 88rpx;
		padding: 0 28rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 16rpx;
		font-size: 28rpx;
		background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.04);

		&:focus {
			border-color: #4a8cff;
			background: #ffffff;
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
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4rpx 12rpx rgba(74, 140, 255, 0.1);

		&:active {
			transform: scale(0.97);
			background: linear-gradient(135deg, #e6edff 0%, #d3deff 100%);
			box-shadow: 0 2rpx 6rpx rgba(74, 140, 255, 0.1);
		}
	}
}

// 表单容器
.form-container {
	background: linear-gradient(180deg, #ffffff 0%, #fefefe 100%);
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.06), 0 2rpx 6rpx rgba(0, 0, 0, 0.04);
	border: 2rpx solid rgba(255, 255, 255, 0.8);
}

// 输入组
.input-group {
	margin-bottom: 36rpx;

	.input-label {
		display: block;
		font-size: 26rpx;
		color: #333;
		margin-bottom: 16rpx;
		font-weight: 500;
	}

	.input-container {
		position: relative;
	}

	.input-field {
		width: 100%;
		height: 88rpx;
		padding: 0 28rpx;
		padding-right: 80rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 16rpx;
		font-size: 28rpx;
		background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
		box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.04);

		&:focus {
			border-color: #4a8cff;
			background: #ffffff;
			box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.04), 0 0 0 4rpx rgba(74, 140, 255, 0.1);
		}
	}

	.password-toggle {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		color: #999;
		font-size: 28rpx;
		transition: color 0.3s ease;

		&:active {
			color: #4a8cff;
		}
	}
}

// 密码规则提示
.password-rules {
	margin: -16rpx 0 32rpx;
	padding: 24rpx;
	background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
	border-radius: 12rpx;
	border: 2rpx solid #e8edf8;

	.rule-item {
		display: flex;
		align-items: center;
		margin: 16rpx 0;
		font-size: 24rpx;
		color: #555;

		&.fulfilled {
			color: #52c41a;
		}

		uni-icons {
			margin-right: 16rpx;
			font-size: 22rpx;
		}
	}
}

// 验证码组
.code-group {
	margin-bottom: 36rpx;

	.input-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;

		.input-label {
			font-size: 26rpx;
			color: #333;
			font-weight: 500;
		}
	}

	.code-wrapper {
		display: flex;
		gap: 16rpx;
		align-items: center;
	}

	.code-input {
		flex: 1;
		height: 88rpx;
		padding: 0 28rpx;
		border: 2rpx solid #e0e0e0;
		border-radius: 16rpx;
		font-size: 32rpx;
		letter-spacing: 16rpx;
		text-align: center;
		background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.04);

		&:focus {
			border-color: #4a8cff;
			background: #ffffff;
			box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.04), 0 0 0 4rpx rgba(74, 140, 255, 0.1);
		}
	}

	.code-btn {
		width: 180rpx;
		height: 88rpx;
		line-height: 88rpx;
		background: linear-gradient(135deg, #f0f5ff 0%, #e6edff 100%);
		border: 2rpx solid #a3c0f5;
		border-radius: 16rpx;
		font-size: 24rpx;
		color: #4a8cff;
		font-weight: 500;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4rpx 12rpx rgba(74, 140, 255, 0.1);

		&[disabled] {
			background: #f5f5f5;
			border-color: #e0e0e0;
			color: #999;
			box-shadow: none;
		}

		&:active:not([disabled]) {
			transform: scale(0.97);
			background: linear-gradient(135deg, #e6edff 0%, #d3deff 100%);
			box-shadow: 0 2rpx 6rpx rgba(74, 140, 255, 0.1);
		}
	}
}

// 提交按钮
.submit-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background: linear-gradient(135deg, #4a8cff 0%, #6b9dff 50%, #4a8cff 100%);
	background-size: 200% 100%;
	color: #fff;
	border-radius: 44rpx;
	font-size: 28rpx;
	font-weight: 500;
	margin-top: 36rpx;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 8rpx 20rpx rgba(74, 140, 255, 0.3), 0 2rpx 8rpx rgba(74, 140, 255, 0.15);
	border: 2rpx solid rgba(255, 255, 255, 0.3);

	&[disabled] {
		background: linear-gradient(180deg, #e0e0e0 0%, #d0d0d0 100%);
		box-shadow: none;
		opacity: 0.6;
		border-color: transparent;
	}

	&:active:not([disabled]) {
		transform: scale(0.98);
		background-position: 100% 0;
		box-shadow: 0 4rpx 12rpx rgba(74, 140, 255, 0.3), 0 2rpx 4rpx rgba(74, 140, 255, 0.15);
	}
}

// 主按钮样式
.primary-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background: linear-gradient(135deg, #4a8cff 0%, #6b9dff 50%, #4a8cff 100%);
	background-size: 200% 100%;
	color: #fff;
	border-radius: 44rpx;
	font-size: 28rpx;
	font-weight: 500;
	margin-top: 36rpx;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 8rpx 20rpx rgba(74, 140, 255, 0.3), 0 2rpx 8rpx rgba(74, 140, 255, 0.15);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;

	&[disabled] {
		background: linear-gradient(180deg, #e0e0e0 0%, #d0d0d0 100%);
		box-shadow: none;
		opacity: 0.6;
		border-color: transparent;
	}

	&:active:not([disabled]) {
		transform: scale(0.98);
		background-position: 100% 0;
		box-shadow: 0 4rpx 12rpx rgba(74, 140, 255, 0.3), 0 2rpx 4rpx rgba(74, 140, 255, 0.15);
	}
}

// 通用按钮样式
button {
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	background: linear-gradient(135deg, #4a8cff 0%, #6b9dff 100%);
	color: #fff;
	border-radius: 50rpx;
	font-size: 32rpx;
	font-weight: 500;
	margin-top: 32rpx;
	transition: all 0.3s ease;
	box-shadow: 0 8rpx 24rpx rgba(74, 140, 255, 0.3);
	border: none;

	&[disabled] {
		background: #d9d9d9;
		box-shadow: none;
		opacity: 0.6;
	}

	&:active:not([disabled]) {
		transform: scale(0.98);
		box-shadow: 0 4rpx 12rpx rgba(74, 140, 255, 0.3);
	}
}

// 页面头部
.page-header {
	padding: 24rpx 32rpx;
	display: flex;
	align-items: center;
	background: #fff;
	border-bottom: 1rpx solid #eee;

	.header-back {
		padding: 12rpx;
		margin-right: 20rpx;
	}

	.header-title {
		font-size: 34rpx;
		color: #333;
		font-weight: 500;
	}
}

// 版本号样式
.version-info {
	text-align: center;
	font-size: 26rpx;
	color: #999;
	margin: 20rpx 0;
}
</style>
