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
				<!-- <view class="left-top-sign">SIGNUP</view> -->
				<!-- <view class="welcome">欢迎注册</view> -->
			</view>
			<view style="margin:8vw">
				<text class="u-block__title" style="font-weight: 800;font-size: 16px;">选择项目板块</text>
				<u-checkbox-group v-model="checkboxValue1" placement="column" @change="checkboxChange">
					<u-checkbox :customStyle="{marginBottom: '8px'}" v-for="(item, index) in checkboxList1" :key="index"
						:label="item.name" :name="item.value">
					</u-checkbox>
				</u-checkbox-group>
			</view>
			<view class="input-content">
				<view class="input-box">
					<text style="margin-right: 2vw;">+86</text>
					<input class="use-input" type="number" @input="showIcon=true" v-model="username" @blur="checkPhone"
						:style="{color:(inputText==true?'red':'rgba(0, 0, 0, 0.5)')}" placeholder="请输入手机号">
					<button class="getcode" :disabled="isConfirm" @click="getCode">{{text}}</button>
				</view>
				<text v-show="inputText" style="color: red;font-size: 3vw;position: absolute;">请输入正确的手机号</text>

				<view style="margin-top: 5vw;" class="input-box">
					<input class="use-input" type="number" @input="showUpwIcon=true" @blur="checkCode"
						v-model="verificationCode" placeholder="验证码">
				</view>
				<text v-show="codeText" style="color: red;font-size: 3vw;position: absolute;">验证码不能为空</text>
				<!-- <view style="margin-top: 5vw;" class="input-box">
					<input class="use-input" v-model="verificationCode" placeholder="输入用户名">
				</view> -->
				<view style="margin-top: 5vw;" class="input-box">
					<input v-show="showPassword" class="use-input" type="text" @input="showUpwIcon=true"
						@blur="checkUpwd" v-model="password" placeholder="输入密码">
					<input v-show="!showPassword" class="use-input" type="password" @input="showUpwIcon=true"
						@blur="checkUpwd" v-model="password" placeholder="输入密码">
					<uni-icons v-show="showUpwIcon" :type="showPassword?'eye':'eye-slash'" size="20px"
						@click="showPassword=!showPassword"></uni-icons>
				</view>
				<!-- 
				<view style="margin-top: 5vw;" class="input-box">
					<input v-show="showPassword" class="use-input" type="text" @input="showUpwIcon=true"
						@blur="checkUpwd" v-model="password" placeholder="再次输入密码">
					<input v-show="!showPassword" class="use-input" type="password" @input="showUpwIcon=true"
						@blur="checkUpwd" v-model="password" placeholder="再次输入密码">
					<uni-icons v-show="showUpwIcon" :type="showPassword?'eye':'eye-slash'" size="20px"
						@click="showPassword=!showPassword"></uni-icons>
				</view> -->
				<text v-show="upwdCheck"
					style="color: red;font-size: 3vw;position: absolute;">密码长度为8~14位且至少包含一个字母和数字且不能用特殊符号</text>
				<!-- 	<view style="margin-top: 5vw;" class="input-box">

					<input class="use-input" :type="showConfirmPassword?'text':'password'"
						@input="showConfirmUpwIcon=true" @blur="checkConfirmUpwd" v-model="confirmPassword"
						placeholder="重复密码">
					<uni-icons v-show="showConfirmUpwIcon" :type="showConfirmPassword?'eye':'eye-slash'" size="20px"
						@click="showConfirmPassword=!showConfirmPassword"></uni-icons>
				</view> -->
				<text v-show="confirmUpwdCheck" style="color: red;font-size: 3vw;position: absolute;">密码不一致</text>
				<view style="margin-top: 5vw;" class="input-box">
					<input class="use-input" type="number" @input="showUpwIcon=true" v-model="areaId" placeholder="工程号">
				</view>
			</view>
			<button class="confirm-btn button" @click="toRegister">注册</button>

		</view>
	<!-- 	<view style="text-align: center;">
			用户注册代表同意<text style="color:rgba(26, 165, 241, 0.6);">《用户协议》</text>
		</view> -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		sendSmsCode,
		userRegister
	} from '@/api/user.js'
	import {
		Md5
	} from 'ts-md5'
	export default {
		data() {
			return {
				areaId:'',
				username: '',
				password: '',
				confirmPassword: '', //确认密码
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
				codeText: false,
				checkboxValue1: [],
				deviceTypeCategoryIds:[],
				checkboxList1: [{
						name: '逆变器',
						value:'29',
						disabled: false
					},
					{
						name: '家居/社区能源管理系统',
						value:'30',
						disabled: false
					},
					{
						name: '工厂/园区能源管理系统',
						value:'31',
						disabled: false
					},
					{
						name: '储能PCS',
						value:'32',
						disabled: false
					},
					{
						name: '离心机',
						value:'33',
						disabled: false
					},
					{
						name: '储能',
						value:'34',
						disabled: false
					},
					{
						name: '多联机/户储',
						value:'36',
						disabled: false
					}
				],
			}
		},
		mounted() {
			uni.removeStorageSync('isRegister')
		},
		methods: {

			checkboxChange(n) {
				
				this.deviceTypeCategoryIds = n
			},
			checkCode() { //验证码不能为空
				if (!this.verificationCode) {
					this.codeText = true
					return
				} else {
					this.codeText = false
				}
			},
			
			toRegister() { //注册
				// 验证手机
				let reg = /^1([38]\d|4[579]|5[0-3,5-9]|66|7[0135678]|9[89])\d{8}$/
				if (!reg.test(this.username)) {
					// 弹出提示框
					this.showToast({
						type: 'error',
						icon: false,
						title: '失败主题',
						message: '请输入正确的手机号',
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
					})
					// 让字体变红色
					this.inputText = true
					return
				} else {
					this.inputText = false
				}
				// 验证验证码
				if (!this.verificationCode) {
					this.codeText = true
					return
				} else {
					this.codeText = false
				}
				// 验证密码
				let regupw = /^[A-Za-z0-9]{7,13}$/
				if (!regupw.test(this.password)) {
					this.upwdCheck = true
					return
				} else {
					this.upwdCheck = false
				}

				let formdata = JSON.stringify({
					userId:2,
					areaId:this.areaId.trim(),
					phone: this.username.trim(),
					password: Md5.hashStr(this.password.trim()).toString(),
					verificationCode: this.verificationCode.trim(),
					deviceTypeCategoryIds: this.deviceTypeCategoryIds.join(','),
					invitationCode:"",
					isLogin:true
				})
				// return
				userRegister(formdata).then(res => {
					if (res.status == 200) {
						this.showToast({
							type: 'success',
							title: '成功主题(带图标)',
							message: res.msg,
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
						});
					} else if (res.status == 500) {
						this.showToast({
							type: 'error',
							icon: false,
							title: '失败主题',
							message: res.msg,
							iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
						})
					}

				})
			},
			goBack() {
				uni.reLaunch({
					url: '/pages/login/login'
				})
				// this.$u.vuex('currentTemplate', 0);
			},
			// checkConfirmUpwd() {
			// 	if (this.password !== this.confirmPassword) {
			// 		this.confirmUpwdCheck = true
			// 	} else if (this.password === this.confirmPassword) {
			// 		this.confirmUpwdCheck = false
			// 	}
			// },
			checkUpwd() {
				let reg = /^[A-Za-z0-9]{7,17}$/
				if (!reg.test(this.password)) {
					this.upwdCheck = true
				} else {
					this.upwdCheck = false
				}
			},
			checkPhone() {
				let reg = /^1([38]\d|4[579]|5[0-3,5-9]|66|7[0135678]|9[89])\d{8}$/
				if (!reg.test(this.username)) {
					// 弹出提示框
					this.showToast({
						type: 'error',
						icon: false,
						title: '失败主题',
						message: '请输入正确的手机号',
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
					})
					// 让字体变红色
					this.inputText = true
					return
				} else {
					this.inputText = false
				}
			},
			showToast(params) {
				this.$refs.uToast.show({
					...params
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
				if (!reg.test(this.username)) {
					// 弹出提示框
					this.showToast({
						type: 'error',
						icon: false,
						title: '失败主题',
						message: '请输入正确的手机号',
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
					})
					// 让字体变红色
					this.inputText = true
					return
				} else {
					this.inputText = false
				}
				this.isConfirm = true
				this.showToast({
					type: 'success',
					message: "验证码已发送，请查收",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				});
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
				sendSmsCode(this.username).then(res => {
					this.countdown=60
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

	.input-box {
		display: flex;
		border-bottom: 1px solid #ccc;
		align-items: center;
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
		// height: 200px;
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
		padding: 0 60upx;
		margin-top: 13vw;
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