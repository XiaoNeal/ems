<template>
	<view :style="'background-color:' + bGColor" class="container">
		<u-navbar title=" " :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
			:placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>
		<u-toast ref="uToast"></u-toast>
		
		
		<u-navbar title="账户注销" leftIconColor="#fff" left-icon="back" @clickLeft="goBack"
			:titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true" :placeholder="true"
			:bgColor="headerTabBg"></u-navbar>
		<u-toast ref="uToast"></u-toast>
		<view v-if="!confirmCancellation">
			<view style="font-size: 40rpx;text-align: center;font-weight: bolder;margin: 3vw 0;"
				:style="{ 'color': fontColor }">注销须知</view>
			<view :style="{ 'color': fontColor }">
				<p>注销微能站帐号是不可恢复的操作，你应自行备份微能站帐号相关的信息和数据。操作之前，请确认与微能站帐号相关的所有服务均已进行妥善处理�?/p>
				<p>请谨记：注销微能站帐号，你将无法再使用微能站帐号或找回你添加或绑定的任何内容或信息（即使你使用相同的手机号码再次注册并使用微能站），包括但不限于：</p>
				<p>�?）你将无法登录、使用本微能站帐号�?/p>
				<p>�?）你微能站帐号的个人资料和历史信息（包含昵称、头像、设备信息、发电报告、用电报告等）都将无法找回�?/p>
				<p>�?）在微能站帐号注销期间，如果你的微能站帐号被他人投诉、被国家机关调查或者正处于诉讼、仲裁程序中，微能站有权自行终止你微能站帐号的注销而无需另行得到你的同意�?/p>
			</view>
			<view :style="{ 'color': fontColor }"
				style="display: flex;align-items: center;justify-content: center;margin-top: 20vw;">
				<radio :checked="isRead" @click="isRead = !isRead" /><text>我已阅读并知晓注销须知</text>
			</view>

			<view class="btn-row">
				<button class="logoutBtn"
					:style="{ backgroundImage: (isRead == false ? 'linear-gradient(-90deg, rgba(58,64,255,0.5) 0%, rgba(50,199,255,0.5) 100%)' : 'linear-gradient(-90deg, rgb(58,64,255) 0%, rgb(50,199,255) 100%)') }"
					@click="nextStep">下一�?/button>
			</view>
		</view>
		<view v-if="confirmCancellation" :style="{ 'color': fontColor }">
			<view style="text-align: center;font-size: 40rpx;font-weight: bolder;margin-bottom: 5vw;">手机验证</view>
			<view>
				<view style="margin-bottom: 30rpx;padding-left: 20rpx;font-size: 30rpx;">注销账户将发送验证码至{{ phone }}</view>
				<view class="verification-code" style="border: 1px solid;">
					<input style="flex: 1;" type="text" placeholder="请输入验证码" v-model="verificationCodePassword"
						:disabled="confirmPassword">
					<text :style="'color:' + fontColor" @click="getCodePassword">{{ verificationCodeText }}</text>
				</view>
			</view>
			<view>
				<button class="logoutBtn" @click="hereWeGo">确认注销</button>
			</view>
		</view>
	</view>
</template>

<script>
// import {updateUserInfo,sendSmsCode} from "@/api/user.js"
import { sendSmsCode } from '../../api/user.js'
export default {
	data() {
		return {
			isRead: false,
			confirmCancellation: false,
			phone: '',
			verificationCodePassword: '',
			confirmPassword: true,
			countdown: 60,
			isGetCode: true,
			userPhone: '',
			verificationCodeText: '获取验证�?,
		}
	},
	mounted() {
		this.phone = this.userPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		hereWeGo() { //确认注销账户
			if (!this.verificationCodePassword) {
				this.showToast({
					type: 'error',
					icon: false,
					title: '失败主题',
					message: '验证码不能为�?,
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
				})
				return
			}
			uni.showModal({
				content: '点击确认即注销该账号，数据将无法找�?,
				title: '温馨提示'
			})
		},
		getCodePassword() { //修改密码时获取的验证�?
			if (!this.isGetCode) return
			let timer = setInterval(() => {
				if (this.countdown == 0) {
					clearInterval(timer)
					this.verificationCodeText = '获取验证�?
					this.countdown = 60
					this.isGetCode = true
				} else {
					this.countdown--
					this.verificationCodeText = `${this.countdown}秒后重新获取`
					this.isGetCode = false
				}
			}, 1000)
			sendSmsCode(this.userPhone).then(res => {
			})
			this.confirmPassword = false
		},
		nextStep() {
			if (!this.isRead) {
				this.showToast({
					type: 'error',
					icon: false,
					title: '失败主题',
					message: '请先阅读并勾选同意服务条�?,
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
				})
				return
			}
			this.confirmCancellation = true
		},
		showToast(params) {
			this.$refs.uToast.show({
				...params
			})
		}

	}
}
</script>

<style scoped lang="scss">
.container {
	height: 100%;
	padding: 3vw;
}

p {
	text-indent: 2rem;
	margin-bottom: 1vw;
}

.logoutBtn {
	margin-top: 3vw;
	color: white;
	font-size: 4.53vw;
	// width: 82.93vw;
	line-height: 10.67vw;
	background-image: linear-gradient(-90deg, #3A40ff 0%, #32C7ffff 100%);
	box-shadow: 0vw 3vw 3vw 0vw rgba(50, 199, 255, 0.18);
	border-radius: 12px;
	letter-spacing: 1vw;

	&::after {
		border: none;
	}
}

.verification-code {
	margin-bottom: 50rpx;
	border: 1px solid rgba(15, 38, 92, .5);
	border-radius: 30rpx;
	padding-left: 30rpx;
	padding-right: 30rpx;
	height: 80rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>