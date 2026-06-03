<template>
	<view class="container">
		<view class="wrapper">
			<u-toast ref="uToast"></u-toast>
			<!-- H5、Android、IOS登录授权界面 -->
			<view class="box">
				<view style="padding-left: 50upx;">
					<uni-icons type="left" size="20px" @click="goBack"></uni-icons>
					<text style="font-size: 20px;margin-left: 2vw;">注册</text>
				</view>
				<view class="welcome">欢迎注册</view>
			</view>
			<view class="" style="font-size: 14px;color: #a4abb4;padding: 3vw 6vw 0;">
				温馨提示：如果你想使用本APP完整的功能<text class="point" @click="gotCon">请与我们取得联系</text>，你也可以前往<text class="point" @click="gotoShili">示例电站</text>体验。
			</view>
			<view class="input-content">
				<!-- 用户名 -->
				<view class="input-box">
					<uni-easyinput trim="all" v-model="username" placeholder="请输入用户名" :inputBorder="false"
						@blur="checkUsername"></uni-easyinput>
				</view>
				<text v-show="usernameCheck" class="warning">用户名不能为空</text>
				<!-- 密码 -->
				<view class="input-box">
					<uni-easyinput trim="all" v-model="password" type="password" placeholder="请输入密码"
						:inputBorder="false" @blur="checkUpwd"></uni-easyinput>
				</view>
				<text v-show="upwdCheck" class="warning">密码长度6~14位且至少包含一个字母和数字且不能用特殊符号</text>
				<!-- 再次输入密码 -->
				<view class="input-box">
					<uni-easyinput trim="all" v-model="confirmPassword" type="password" placeholder="请再次输入密码"
						:inputBorder="false" @blur="checkConfirm"></uni-easyinput>
				</view>
				<text v-show="confirmUpwdCheck" class="warning"
					style="color: red;font-size: 3vw;padding-left: 3vw;">密码不一致</text>
				<!-- 手机号 -->
				<view class="input-box">
					<uni-easyinput trim="all" v-model="phoneNum" type="number" placeholder="请输入手机号" :inputBorder="false"
						@blur="checkPhone"></uni-easyinput>
				</view>
				<text v-show="inputText" class="warning">请输入正确的手机号</text>
				<!-- 验证码 -->
				<view class="input-box" style="display: flex;align-items: center;justify-content: space-between;">
					<uni-easyinput type="number" v-model="verificationCode" :inputBorder="false" placeholder="请输入验证码"
						@blur="checkCode"></uni-easyinput>
					<view @tap="getCode" style="color: #4488fb;">{{text}}</view>
				</view>
				<text v-show="codeText" class="warning">验证码不能为空</text>

			</view>

			<view class="privacy-policy" style="margin-top: 15vw;">
				<radio class="radio-style" color="rgba(26, 165, 241, 0.6)" :checked="isRead" @click="isRead=!isRead" />
				我已阅读并同意<text style="color: rgb(30, 138, 214);" @click="goToAgreement(1)">《用户协议》</text>和<text
					style="color: rgb(30, 138, 214);" @click="goToAgreement(2)">《隐私政策》</text>
			</view>
			<view class="privacy-policy">
				注册成功后将自动跳转登录
			</view>
			<button class="confirm-btn button" @click="toRegister"
				:style="{backgroundImage:(isRead==false?'linear-gradient(-90deg, rgba(27,165,241,0.5) 0%, rgba(87,234,172,0.5) 100%)':'linear-gradient(-90deg, rgb(27,165,241) 0%, rgb(87,234,172) 100%)') }">注册</button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		sendSmsCode,
		userRegister,
		appRegister,
		appLogin
	} from '@/api/user.js'

	import {
		CreateAreaInfo
	} from "@/api/new-app/index.js"
	import {
		Md5
	} from 'ts-md5'

	export default {
		data() {
			return {
				isRead: false,
				phoneNum: '',
				areaId: '',
				username: '',
				password: '',
				confirmPassword: '',
				verificationCode: '',
				isConfirm: false,
				countdown: 60,
				text: '获取验证码',
				usernameCheck: false,
				inputText: false,
				upwdCheck: false,
				showUpwIcon: false,
				showPassword: false,
				showConfirmUpwIcon: false,
				showConfirmPassword: false,
				confirmUpwdCheck: false,
				codeText: false,
				deviceTypeCategoryIds: [],
			}
		},
		mounted() {
			uni.removeStorageSync('isRegister')
		},
		onBackPress(e) {},
		methods: {
			gotoShili(){
				this.toLogin('rocky', 'neiic2024')
			},
			gotCon(){
				uni.navigateTo({
					url:'/pages-pess/sub-pages/contact-us'
				})
			},
			
			goToAgreement(e) {
				if (e == 1) {
					uni.navigateTo({
						url: '/pages-public/agreement/user-agreement'
					})
				} else {
					uni.navigateTo({
						url: '/pages-public/agreement/privacy-policy'
					})
				}
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			checkPhone() {
				var phone = this.phoneNum;
				var reg = /^1[3-9]\d{9}$/;
				if (phone.length == 0) {
					this.inputText = true;
				} else if (!reg.test(phone)) {
					this.inputText = true;
				} else {
					this.inputText = false;
				}
			},
			checkUsername() {
				if (!this.username) {
					this.usernameCheck = true;
				} else {
					this.usernameCheck = false;
				}
			},
			checkUpwd() {
				var reg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,14}$/;
				if (!this.password) {
					this.upwdCheck = true;
				} else if (!reg.test(this.password)) {
					this.upwdCheck = true;
				} else {
					this.upwdCheck = false;
				}
			},
			checkConfirm() {
				if (this.password !== this.confirmPassword) {
					this.confirmUpwdCheck = true;
				} else {
					this.confirmUpwdCheck = false;
				}
			},
			checkCode() {
				if (!this.verificationCode) {
					this.codeText = true;
				} else {
					this.codeText = false;
				}
			},
			getCode() {
				if (this.inputText || !this.phoneNum) {
					this.$refs.uToast.show({
						title: '请输入正确的手机号',
						type: 'error'
					});
					return;
				}
				if (this.countdown != 60) {
					return;
				}
				sendSmsCode({
					phone: this.phoneNum,
					type: 1
				}).then(res => {
					if (res.code == 200) {
						this.$refs.uToast.show({
							title: '发送成功',
							type: 'success'
						});
						this.countdown = 59;
						var timer = setInterval(() => {
							this.countdown--;
							this.text = this.countdown + 's';
							if (this.countdown == 0) {
								clearInterval(timer);
								this.countdown = 60;
								this.text = '获取验证码';
							}
						}, 1000);
					} else {
						this.$refs.uToast.show({
							title: res.message,
							type: 'error'
						});
					}
				}).catch(err => {
					this.$refs.uToast.show({
						title: '获取验证码失败',
						type: 'error'
					});
				});
			},
			toRegister() {
				if (!this.isRead) {
					this.$refs.uToast.show({
						title: '请阅读并同意用户协议和隐私政策',
						type: 'error'
					});
					return;
				}
				if (!this.username) {
					this.$refs.uToast.show({
						title: '请输入用户名',
						type: 'error'
					});
					return;
				}
				if (!this.password) {
					this.$refs.uToast.show({
						title: '请输入密码',
						type: 'error'
					});
					return;
				}
				if (!this.phoneNum) {
					this.$refs.uToast.show({
						title: '请输入手机号',
						type: 'error'
					});
					return;
				}
				if (!this.verificationCode) {
					this.$refs.uToast.show({
						title: '请输入验证码',
						type: 'error'
					});
					return;
				}
				var reg = /^1[3-9]\d{9}$/;
				if (!reg.test(this.phoneNum)) {
					this.$refs.uToast.show({
						title: '请输入正确的手机号',
						type: 'error'
					});
					return;
				}
				var pwdReg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,14}$/;
				if (!pwdReg.test(this.password)) {
					this.$refs.uToast.show({
						title: '密码长度6~14位且至少包含一个字母和数字',
						type: 'error'
					});
					return;
				}
				if (this.password !== this.confirmPassword) {
					this.$refs.uToast.show({
						title: '两次输入的密码不一致',
						type: 'error'
					});
					return;
				}
				uni.showLoading({
					title: '注册中...'
				});
				userRegister({
					username: this.username,
					password: Md5.hashStr(this.password).toString(),
					phone: this.phoneNum,
					verifyCode: this.verificationCode
				}).then(res => {
					uni.hideLoading();
					if (res.code == 200) {
						this.$refs.uToast.show({
							title: '注册成功',
							type: 'success'
						});
						setTimeout(() => {
							this.toLogin(this.username, this.password);
						}, 1500);
					} else {
						this.$refs.uToast.show({
							title: res.message,
							type: 'error'
						});
					}
				}).catch(err => {
					uni.hideLoading();
					this.$refs.uToast.show({
						title: '注册失败',
						type: 'error'
					});
				});
			},
			toLogin(username, password) {
				appLogin({
					username: username,
					password: Md5.hashStr(password).toString()
				}).then(res => {
					if (res.code == 200) {
						uni.setStorageSync('token', res.data.token);
						uni.setStorageSync('phone', res.data.phone);
						uni.switchTab({
							url: '/pages/community/index'
						});
					} else {
						this.$refs.uToast.show({
							title: res.message,
							type: 'error'
						});
					}
				}).catch(err => {
					this.$refs.uToast.show({
						title: '登录失败',
						type: 'error'
					});
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		background: linear-gradient(-90deg, rgb(27, 165, 241) 0%, rgb(87, 234, 172) 100%);
	}

	.wrapper {
		background: #fff;
		border-radius: 40rpx 40rpx 0 0;
		margin-top: 30rpx;
		padding-bottom: 100rpx;
	}

	.box {
		padding: 50rpx 0;
		text-align: center;
	}

	.welcome {
		font-size: 40rpx;
		font-weight: bolder;
		margin-top: 20rpx;
		color: #333;
	}

	.input-content {
		padding: 0 30rpx;
	}

	.input-box {
		border-bottom: 1px solid #f5f5f5;
		padding: 20rpx 0;
	}

	.warning {
		font-size: 24rpx;
		color: #ff4d4f;
		padding-left: 10rpx;
		margin-bottom: 10rpx;
		display: block;
	}

	.privacy-policy {
		text-align: center;
		font-size: 24rpx;
		color: #999;
		padding: 20rpx 0;
	}

	.radio-style {
		transform: scale(0.8);
	}

	.confirm-btn {
		width: 90%;
		height: 88rpx;
		border-radius: 44rpx;
		font-size: 32rpx;
		color: #fff;
		border: none;
		margin: 30rpx auto;
		display: block;
	}

	.point {
		color: #1a8ad6;
	}
</style>
