<template>
	<view class="content" :style="'background-color:' + bGColor">
		<!-- <u-navbar v-if="type != 4" title=" 1111" leftIconColor="#fff" :titleStyle="{ 'color': fontColor, 'width': '100%' }"
			:leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg"></u-navbar> -->
		<u-navbar title=" " :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
			:placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>
		<u-toast ref="uToast"></u-toast>
		<!-- 改用户名 -->
		<view class="modify" v-if="type == 1" :style="'color:' + fontColor">
			<view class="title">更改用户名</view>
			<view style="margin-bottom: 20rpx;">请输入新用户名，此名称用于登录</view>
			<input class="input-text" type="text" v-model="setUserName" style="border: 1px solid;">
			<button @click="modifyUserName">确定</button>
		</view>

		<!-- 更改手机号 -->
		<view class="modify" v-if="type == 2" :style="'color:' + fontColor">
			<view class="title">更改手机号</view>
			<input class="input-text" type="text" placeholder="请输入新手机号" v-model="setUserPhone"
				style="border: 1px solid;">
			<view class="verification-code" style="border: 1px solid;">
				<input style="flex: 1;" type="text" placeholder="请输入验证码" v-model="verificationCodePhone">
				<text :style="'color:' + fontColor" @click="getCode">{{ verificationCodeText }}</text>
			</view>
			<button @click="modifyPhone">确定</button>
		</view>

		<!-- 更改密码 -->
		<view class="modify" v-if="type == 3">
			<view class="page-header">
				<text class="header-title">修改密码</text>
			</view>
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
export default {
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
			countdown: 0,
			codeSending: false,
			codeFocus: false,
			timer: null
		}
	},
	computed: {
		...mapState('user', ['userName', 'mobile', 'id']),
		progressWidth() {
			const index = ['弱', '中', '良', '强'].indexOf(this.passwordStrength);
			return `${(index + 1) * 25}%`;
		},
		strengthIndex() {
			return ['弱', '中', '良', '强'].indexOf(this.passwordStrength);
		},
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

$text-secondary: #606266;

// 容器样式优化
.content {
	padding: 40rpx;
	background: #f5f7fb;

	// 卡片容器
	.modify {
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
	}

	// 输入框样式
	// 密码修改区块优化
	.modify {
		.title {
			font-size: 36rpx;
			font-weight: 600;
			margin-bottom: 60rpx;
		}

		.input-text {
			border: 1px solid $uni-border-color !important;
			border-radius: 12rpx;
			padding: 24rpx;
			margin-bottom: 40rpx;
			transition: all 0.3s;

			&:focus {
				border-color: $uni-color-primary !important;
				box-shadow: 0 0 8rpx rgba($uni-color-primary, 0.2);
			}
		}

		.verification-code {
			display: flex;
			align-items: center;
			border-radius: 12rpx;
			padding: 0 24rpx;
			margin-bottom: 40rpx;

			input {
				padding: 24rpx 0;
			}

			text {
				padding: 16rpx 32rpx;
				border-radius: 8rpx;
				background: linear-gradient(135deg, $uni-color-primary, #7b8bf5);
				color: #fff !important;
			}
		}

		button {
			background: linear-gradient(135deg, $uni-color-primary, #7b8bf5);
			color: #fff;
			border-radius: 12rpx;
			// padding: 24rpx;
			transition: transform 0.2s;

			&[disabled] {
				background: $uni-text-color-grey;
				opacity: 0.6;
			}

			&:active {
				transform: scale(0.98);
			}
		}
	}

	// 动画定义
	@keyframes shake {

		0%,
		100% {
			transform: translateX(0);
		}

		25% {
			transform: translateX(-8rpx);
		}

		75% {
			transform: translateX(8rpx);
		}
	}

	// 账户注销列表
	.list {
		padding: 32rpx;
		border-radius: 16rpx;
		background: #f5f7fb;
		margin: 24rpx 0;
	}
}

.modify {
	padding: 40rpx;
}

.input-field {
	border: 1px solid #e5e5e5;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 30rpx;
	transition: border-color 0.3s;
	height: 100rpx;
	/* 增加输入框高度 */
	line-height: 1.4;
	padding: 20rpx 24rpx;
}

.input-field:focus {
	border-color: v-bind(fontColor);
}

.code-container {
	display: flex;
	align-items: center;
	border: 1px solid #e5e5e5;
	border-radius: 12rpx;
	padding: 24rpx;
	margin-bottom: 40rpx;
}

.code-btn {
	height: 88rpx;
	min-width: 200rpx;
	font-size: 28rpx;
	margin-left: 20rpx;
	background: #f8f9fa;
	border: 2rpx solid #e9ecef;
	border-radius: 12rpx;
	transition: all 0.3s;
	color: #495057;
}

.tip-text {
	padding: 12px 0;
}

.submit-btn {
	height: 96rpx;
	font-size: 32rpx;
	background: linear-gradient(45deg, #4dabf7, #339af0);
	color: white;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 12rpx rgba(51, 154, 240, 0.2);
	margin-top: 60rpx;
}







.strength-labels {
	display: flex;
	justify-content: space-between;
	margin-top: 20rpx;

	text {
		font-size: 24rpx;
		color: #999;
		transition: color 0.3s ease;

		&.active {
			color: #333;
			font-weight: 500;
		}
	}
}

.modify {
	padding: 24rpx;

	.form-container {
		background: #fff;
		border-radius: 16rpx;
		padding: 32rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.input-group {
		margin-bottom: 40rpx;

		.input-label {
			display: block;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 16rpx;
		}

		.input-field {
			height: 96rpx;
			padding: 0 24rpx;
			border: 2rpx solid #e8e8e8;
			border-radius: 8rpx;
			font-size: 28rpx;
			transition: border-color 0.3s;

			&:focus {
				border-color: #1890ff;
				box-shadow: 0 0 8rpx rgba(24, 144, 255, 0.2);
			}
		}
	}

	.password-rules {
		margin: 24rpx 0;
		padding: 16rpx;
		background: #f8f8f8;
		border-radius: 8rpx;

		.rule-item {
			display: flex;
			align-items: center;
			margin: 12rpx 0;
			font-size: 24rpx;

			&.fulfilled {
				color: #52c41a;
			}

			uni-icons {
				margin-right: 12rpx;
			}
		}
	}

	.code-group {
		margin: 40rpx 0;

		.input-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.hint-text {
				font-size: 24rpx;
				color: #999;
			}
		}

		.code-wrapper {
			display: flex;
			gap: 20rpx;
			align-items: center;

			.code-input {
				flex: 1;
				height: 96rpx;
				padding: 0 24rpx;
				border: 2rpx solid #e8e8e8;
				border-radius: 8rpx;
				font-size: 36rpx;
				letter-spacing: 8rpx;
				text-align: center;
				transition: border-color 0.3s;

				&:focus {
					border-color: #1890ff;
				}
			}

			.code-btn {
				width: 220rpx;
				height: 96rpx;
				line-height: 96rpx;
				background: #f0f2f5;
				border-radius: 8rpx;
				font-size: 28rpx;
				color: #1890ff;
				transition: all 0.3s;

				&.disabled {
					background: #f5f5f5;
					color: #999;
					cursor: not-allowed;
				}

				&.loading {
					background: #f5f5f5;
				}
			}
		}
	}

	.submit-btn {
		height: 96rpx;
		line-height: 96rpx;
		background: linear-gradient(135deg, #1890ff, #096dd9);
		color: #fff;
		border-radius: 48rpx;
		font-size: 32rpx;
		margin-top: 64rpx;

		&.disabled {
			opacity: 0.6;
			background: #ccc;
		}
	}
}

.password-toggle {
	position: absolute;
	right: 20rpx;
	top: 50%;
	transform: translateY(-50%);
	color: #999;
}

.input-container {
	position: relative;
}

.input-field {
	padding-right: 80rpx !important;
}
</style>
