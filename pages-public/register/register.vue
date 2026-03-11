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
				<text v-show="upwdCheck" class="warning">密码长度为8~14位且至少包含一个字母和数字且不能用特殊符号</text>
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
			<!-- <button class="confirm-btn button" @click="toRegister">注册</button> -->
			<button class="confirm-btn button" @click="toRegister"
				:style="{backgroundImage:(isRead==false?'linear-gradient(-90deg, rgba(27,165,241,0.5) 0%, rgba(87,234,172,0.5) 100%)':'linear-gradient(-90deg, rgb(27,165,241) 0%, rgb(87,234,172) 100%)') }">注册</button>
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
				confirmPassword: '', //确认密码
				verificationCode: '',
				isConfirm: false,
				countdown: 60, //重发验证码倒计时
				text: '获取验证码',
				usernameCheck: false,
				inputText: false,
				upwdCheck: false,
				showUpwIcon: false, //密码框的小眼睛
				showPassword: false, //密码是否可见
				showConfirmUpwIcon: false, //重复密码框的小眼睛
				showConfirmPassword: false, //重复密码是否可见		
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
			checkCode() { //验证码不能为空
				if (!this.verificationCode) {
					this.codeText = true
					return false
				} else {
					this.codeText = false
					return true;
				}
			},

			async toRegister() { //注册
				if (!this.isRead) {
					this.showToast('error', '请先阅读并勾选同意服务条款')
					return
				}
				let nameRes = this.checkUsername()
				if (!nameRes) {
					this.showToast('error', '用户名不能为空')
					return
				}
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

				// let formdata = JSON.stringify({
				// 	userId: 2,
				// 	areaId: this.areaId.trim(),
				// 	phone: this.username.trim(),
				// 	password: Md5.hashStr(this.password.trim()).toString(),
				// 	verificationCode: this.verificationCode.trim(),
				// 	deviceTypeCategoryIds: this.deviceTypeCategoryIds.join(','),
				// 	invitationCode: "",
				// 	isLogin: true
				// })
				// return
				let formdata = JSON.stringify({
					userName: this.username,
					password: Md5.hashStr(this.password).toString(),
					mobile: this.phoneNum,
					address: "zhuhai",
					verificationCode: this.verificationCode,
					allocationUserId: "",
				})
				let registerRes = await appRegister(formdata)
				console.log(registerRes);
				if (registerRes.status == 200) {
					let areaInfo = {
						id: null,
						create_time: null,
						update_time: null,
						name: `${this.username}的GIEMS云能源信息系统`,
						name_en: null,
						country_id: null,
						province_id: null,
						city_id: null,
						address: null,
						latitude: null,
						longitude: null,
						status: null,
						socket_local_url: null,
						search_local_url: null,
						socket_net_url: null,
						search_net_url: null,
						remark1: null,
						remark2: null
					}
					let userId = registerRes.data.id
					let formdata2 = JSON.stringify({
						areaInfo: areaInfo,
						areaLevel: {},
						powerStation: {},
						userId: userId
					})
					console.log('formdata2', formdata2);
					let areaInfoRes = await CreateAreaInfo(formdata2)
					console.log('areaInfoRes', areaInfoRes);
					if (areaInfoRes.status == 200) {
						this.showToast('success', "注册成功");
						this.toLogin(this.username, this.password)
					}
				}else if(registerRes.status==500 && registerRes.msg == '当前用户没有注册账号权限'){
					let that = this
					uni.showModal({
						title:"温馨提示",
						content:"您目前暂无注册权限，请与我们联系或前往实例电站",
						confirmText:"前往示例电站",
						cancelText:"联系我们",
						success(res) {
							if(res.confirm){
								that.toLogin('rocky', 'neiic2024')
							}else if(res.cancel){
								uni.navigateTo({
									url:'/pages-pess/sub-pages/contact-us'
								})
							}
						}
					})
				}else if(registerRes.status==500 && registerRes.msg != '当前用户没有注册账号权限'){
					this.showToast('error',registerRes.msg)
				}
				// else if(registerRes.status==500 && registerRes.msg == '验证码已过期，请重新获取'){
				// 	this.showToast('error',registerRes.msg)
				// }
				// else if(registerRes.status==500 && registerRes.msg == '验证码不正确，请重新输入'){
				// 	this.showToast('error',registerRes.msg)
				// }

				// userRegister(formdata).then(res => {
				// 	if (res.status == 200) {
				// 		this.showToast('success', res.msg);
				// 	} else if (res.status == 500) {
				// 		this.showToast('error', res.msg)
				// 	}
				// })
			},
			checkUsername() {
				if (!this.username) {
					this.usernameCheck = true
					return false
				} else {
					this.usernameCheck = false
					return true
				}
			},
			goBack() {
				uni.reLaunch({
					url: '/pages/login/login'
				})
				// this.$u.vuex('currentTemplate', 0);
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
			checkConfirm() {
				if (this.password != this.confirmPassword) {
					this.confirmUpwdCheck = true
					return false
				} else {
					this.confirmUpwdCheck = false
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

			},

			toLogin(username, password) {
				appLogin(username, Md5.hashStr(password).toString()).then(res => {
					if (res.status == 200) {
						this.appSetLoginInfo(res)
					}
				})
			},
			appSetLoginInfo(res) {
				let codes = res.status
				if (this.isRememberMe) {
					uni.setStorageSync('rememberPassword', this.password)
					uni.setStorageSync('rememberUserName', this.username)
				}
				let currentTemplate;
				this.$u.vuex('currentTemplate', 531);
				this.$u.vuex('hasLogin', true);
				this.$u.vuex('token', '');
				uni.setStorageSync('token', '');
				this.$u.vuex('userName', res.data.userName);
				this.$u.vuex('memberId', res.data.id);
				// this.$u.vuex('deviceCategoryId', category.deviceCategoryId);
				// this.$u.vuex('areaInfoId', category.areaInfoId);
				this.$u.vuex('userAvatar', res.data.imagePath);
				this.$u.vuex('userRole', res.data.role);
				// this.$u.vuex('userPhone', res.data.mobile);
				// this.$u.vuex('currentSystemInfo', category.areaInfo[0]);
				// this.$u.vuex('projectCategory', res.data.projectCategory);
				// this.$u.vuex('urlPrefix', res.data.basePrefix);
				if (res.data.role === 1) {
					uni.redirectTo({
						url: '/pages-pess/sub-pages/admin-index?firstLogin=true'
					})
				} else {
					uni.redirectTo({
						url: '/pages-pess/index'
					})
				}
				this.realTimeService = new RealtimeDataProviderService()
				this.realTimeService.createScoket(currentTemplate, res.data.basePrefix)
				var pages = getCurrentPages()
				var page = pages[pages.length - 1];
				if (page.route == "pages/login/login") {
					// uni.navigateTo({
					// 	url: '/pages/index/index'
					// })
				}

			},
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

	.container {
		// padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100%;
		overflow: auto;

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


	.welcome {
		padding-left: 6vw;
		margin-top: 60rpx;
		font-size: 46upx;
		color: #000;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
	}

	.input-content {
		padding: 0 3vw;
		margin-top: 10vw;
	}

	.confirm-btn {
		letter-spacing: 1vw;
		width: 83vw;
		height: 11vw;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 20rpx;
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

	.privacy-policy {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20rpx;
		font-size: 24rpx;
	}

	.radio-style {
		transform: scale(0.8)
	}

	.point {
		font-weight: bold;
		text-decoration: underline;
		color: #2d3139;
	}
</style>