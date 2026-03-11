<template>
	<view class="container">
		<view class="wrapper">
			<u-toast ref="uToast"></u-toast>
			<!-- H5、Android、IOS登录授权界面 -->
			<view class="box">
				<view style="padding-left: 50upx;">
					<uni-icons type="left" size="20px" @click="goBack"></uni-icons>
					<text style="font-size: 20px;margin-left: 2vw;">重置密码</text>
				</view>
				<view class="left-top-sign">RESET</view>
				<view class="welcome">重置密码</view>
			</view>

			<view class="input-content">


				<!-- 密码 -->
				<view class="input-box">
					<uni-easyinput trim="all" v-model="password" type="password" placeholder="请输入新密码"
						:inputBorder="false" @blur="checkUpwd"></uni-easyinput>
				</view>
				<text v-show="upwdCheck" class="warning">密码长度为8~14位且至少包含一个字母和数字且不能用特殊符号</text>
				<!-- 再次输入密码 -->
				<view class="input-box">
					<uni-easyinput trim="all" v-model="confirmPassword" type="password" placeholder="请再次输入新密码"
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
			<button class="confirm-btn button" @click="toRegister">提交</button>

		</view>
		<u-toast ref="uToast"></u-toast>
		
	</view>
</template>

<script>
	import {
		sendSmsCode,
		userRegister
	} from '@/api/user.js'
	import {UpdatePassword} from "@/api/new-app/user.js"
	import {
		Md5
	} from 'ts-md5'
	export default {
		data() {
			return {
				confirmPassword: '',
				phoneNum: '',
				username: '',
				password: '',
				verificationCode: '',
				isConfirm: false,
				countdown: 60, //重发验证码倒计时
				text: '获取验证码',
				inputText: false,
				upwdCheck: false,
				showUpwIcon: false, //密码框的小眼睛
				showPassword: false, //密码是否可见
				showConfirmUpwIcon: false, //重复密码框的小眼睛
				showConfirmPassword: false, //重复密码是否可见		
				confirmUpwdCheck: false,
				codeText: false
			}
		},
		mounted() {
			uni.removeStorageSync('isRegister')
		},
		methods: {
			checkCode() { //验证码不能为空
				if (!this.verificationCode) {
					this.codeText = true
					return false
				} else {
					this.codeText = false
					return true
				}
			},
			toRegister() { //注册
				// 验证手机
				// 验证密码
				let upwdRes = this.checkUpwd()
				if (!upwdRes) {
					this.showToast('error', '请输入正确密码')
					return
				}
				// 验证再次输入密码
				let confirmUpwdRes = this.checkConfirm()
				if (!confirmUpwdRes) {
					this.showToast('error', '两次输入的密码不一致')
					return
				}
				// 验证手机
				let phoneRes = this.checkPhone()
				if (!phoneRes) {
					this.showToast('error', '请输入正确的手机号')
					return
				}
				// 验证验证码
				let codeRes = this.checkCode()
				if (!codeRes) {
					this.showToast('error', '验证码不能为空')
					return
				}
				let formdata = JSON.stringify({
					password: Md5.hashAsciiStr(this.password.trim()).toString(),
					mobile: this.phoneNum.trim(),
					verificationCode: this.verificationCode.trim()
				})
				console.log(formdata);
		
				UpdatePassword(formdata).then(res=>{
					console.log(res);
					if(res.status==200){
						this.password = ''
						this.confirmPassword = ''
						this.phoneNum = ''
						this.verificationCode = ''
						this.showToast('success',res.msg)
					}else if(res.status == 500){
						this.showToast('error',res.msg)
					}
				})
				// userRegister(formdata).then(res=>{
				// })
			},
			goBack() {
				uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			checkConfirm() {
				if (this.password != this.confirmPassword) {
					this.confirmUpwdCheck = true
					return false
				} else {
					this.confirmUpwdCheck = false
					return true
				}
			},
			checkUpwd() {
				let reg = /^[A-Za-z0-9]{7,17}$/
				if (!reg.test(this.password)) {
					this.upwdCheck = true
					return false
				} else {
					this.upwdCheck = false
					return true
				}
			},
			checkPhone() {
				let reg = /^1([38]\d|4[579]|5[0-3,5-9]|66|7[0135678]|9[89])\d{8}$/
				if (!reg.test(this.phoneNum)) {
					// 让字体变红色
					this.inputText = true
					return false
				} else {
					this.inputText = false
					return true
				}
			},
			showToast(type, title) {
				this.$refs.uToast.show({
					type: type,
					icon: false,
					title: '失败主题',
					message: title
				})
			},
			confirm() {
				uni.showModal({
					title: '注册成功，点击确认跳转登录',
					showCancel: false,
					complete(res) {
						if (res.confirm) {
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}
					}
				})
			},
			getCode() {
				let reg = /^1([38]\d|4[579]|5[0-3,5-9]|66|7[0135678]|9[89])\d{8}$/
				if (!reg.test(this.phoneNum)) {
					// 弹出提示框
					this.showToast('error', '请输入正确的手机号')
					// 让字体变红色
					this.inputText = true
					return
				} else {
					this.inputText = false
				}
				this.isConfirm = true
				this.showToast('success', "验证码已发送，请查收");
				// this.text=`${this.countdown}秒后重新获取`
				let timer = setInterval(() => {
					if (this.countdown == 0) {
						clearInterval(timer)
						this.text = '获取验证码'
						this.isConfirm = false
						// this.countdown = 
					} else {
						this.countdown--
						this.text = `${this.countdown}秒后可重发`
					}
				}, 1000)
				sendSmsCode(this.phoneNum).then(res => {
					this.countdown = 60
				})

			}
		}
	}
</script>

<style scoped lang="scss">
	/* 页面左右间距 */
	$page-row-spacing: 30upx;
	$page-color-base: #f8f8f8;
	$page-color-light: #f8f6fc;
	$base-color: #fa436a;

	/* 文字尺寸 */
	$font-sm: 24upx;
	$font-base: 28upx;
	$font-lg: 32upx;
	/*文字颜色*/
	$font-color-dark: #303133;
	$font-color-base: #606266;
	$font-color-light: #909399;
	$font-color-disabled: #C0C4CC;
	$font-color-spec: #4399fc;
	/* 边框颜色 */
	$border-color-dark: #DCDFE6;
	$border-color-base: #E4E7ED;
	$border-color-light: #EBEEF5;
	/* 图片加载中颜色 */
	$image-bg-color: #eee;
	/* 行为相关颜色 */
	$uni-color-primary: #fa436a;
	$uni-color-success: #4cd964;
	$uni-color-warning: #f0ad4e;
	$uni-color-error: #dd524d;


	page {
		background: #fff;
	}

	.getcode {
		box-sizing: border-box;
		line-height: 7vw;
		width: 30vw;
		background-color: #fff;
		color: rgba(0, 0, 0, 0.3);
		border-radius: 100px;
		padding: 0;
		border: 1px solid rgba(0, 0, 0, 0.3);

	}

	.use-input {
		height: 12vw;
		flex: 1;
		font-size: 4vw;
		color: rgba(0, 0, 0, 0.3);
	}


	.container {
		// padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		// background-image: url('/static/longin_bg_img750.jpg');
	}

	.box {
		padding-top: 44px;
		background-image: linear-gradient(rgba(26, 165, 241, 0.6), rgb(200, 240, 240), rgba(88, 234, 172, 0));
		height: 200px;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: rgba(41, 182, 224, .3);
		position: relative;
		left: -16upx;
		top: 120upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: '';
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: 10upx;
		font-size: 46upx;
		color: #000;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
	}

	.input-content {
		padding: 0 3vw;
		margin-top: 10vw;

		.input-box {
			border-radius: 500px;
			margin-top: 5vw;
			background-color: #f3f8ff;
			padding: 2vw 3vw;
		}

		.warning {
			color: red;
			font-size: 3vw;
			padding-left: 3vw;
		}
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.sms-code-btn {
		position: absolute;
		right: 0;
		border: none;
		color: #ccc;
		background: transparent;
		font-size: 14px;
	}

	.correct_phone_number {
		color: #000;
	}


	.confirm-btn {
		letter-spacing: 1vw;
		width: 83vw;
		height: 11vw;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 19vw;
		// background: $uni-color-primary;
		color: #fff;
		font-size: 5vw;
		background-image: linear-gradient(-90deg, #1ba5f1 0%, #57eaac 100%);
		box-shadow: 0vw 3vw 3vw 0vw rgba(34, 217, 233, 0.38);
		border-radius: 5vw;

		&:after {
			border-radius: 100px;
			border: 0;
		}
	}

	.forget-section {
		font-size: $font-sm + 2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
</style>