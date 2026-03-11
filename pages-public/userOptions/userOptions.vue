<template>
	<view :style="'background-color:'+ bGColor" class="container">
		<!-- <u-navbar title="G-FIEMS" :titleStyle="{'color':'#fff','width':'100%','text-align':'left','padding-left':'40rpx'}" :leftIcon="null" :leftText="null" :placeholder="true" :bgColor="headerTabBg"></u-navbar> -->
		<u-navbar title="设置" leftIconColor="#fff" :titleStyle="{'color':fontColor,'width':'100%'}" :leftText="null"
			:autoBack="true" :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>
		<view class="list" :style="'color:'+fontColor">
			<text style="flex: 1;">个人头像</text>
			<image :src="imgSrc" mode="widthFix" style="margin-right: 10px;border-radius: 50%;" @click="changeAvatar">
			</image>
			<uni-icons type="right" :color="fontColor"></uni-icons>
		</view>
		<view class="list" @click="goto(1)" :style="'color:'+fontColor">
			<text style="flex: 1;">用户名</text>
			<text>{{userName}}</text>
			<uni-icons type="right" :color="fontColor"></uni-icons>
		</view>
		<view class="list" @click="goto(2)" :style="'color:'+fontColor">
			<text style="flex: 1;">手机号码</text>
			<text>{{userPhone}}</text>
			<uni-icons type="right" :color="fontColor"></uni-icons>
		</view>

		<view class="list" @click="goto(3)" :style="'color:'+fontColor">
			<text style="flex: 1;">修改密码</text>
			<uni-icons type="right" :color="fontColor"></uni-icons>
		</view>

		<view class="list" @click="goto(4)" :style="'color:'+fontColor">
			<text style="flex: 1;">账户与安全</text>
			<uni-icons type="right" :color="fontColor"></uni-icons>
		</view>
		<u-toast ref="uToast"></u-toast>
		<view class=" logout" @click="logout">
			退出登录
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import {
		updateUserInfo
	} from "@/api/user.js"
	import md5 from "@/utils/md5.min.js"
	export default {
		data() {
			return {
				setUserName: '',
				setUserPhone: '',
				setUserPassword: '',
				isOK: true,
				oldPassword: '',
				// iconColor:'#000',
				imgSrc: 'https://serviceiems.gree.com/api/upload/wximages/img/logo.png',
				isAdmin: null
			}
		},
		mounted() {
			this.imgSrc = `https://serviceiems.gree.com/appletAPI${this.userAvatar}`
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			// if(this.currentTemplate == 3){
			// 	this.iconColor ='#fff'
			// }else{
			// 	this.iconColor ='#000'
			// }
			this.isAdmin = option.admin
		},


		methods: {
			logout() {
				this.$u.vuex('clearPasswordToo', true);
				this.$u.vuex('currentTemplate', 0);
				// uni.reLaunch({
				// 	url: '/pages/index/index'
				// })
			},
			goto(e) {
				if (this.isAdmin == "admin") {
					this.showToast('error', '您无权修改该账号个人信息')
					return
				}
				uni.navigateTo({
					url: `/pages-public/userOptions/setUserName?type=${e}`
				})
			},
			save() { //保存
				let that = this
				if (!that.isOK) return
				let obj = {
					userId: that.memberId,
					userName: that.setUserName ? that.setUserName : that.userName,
				}
				if (that.setUserPhone != '') {
					obj['Phone'] = that.setUserPhone
				}
				if (that.setUserPassword != '') {
					if (that.oldPassword == '') {
						that.showToast('error', '旧密码不能为空')
						return
					} else {
						obj.oldPassword = md5(that.oldPassword).toString()
						obj.newPassword = md5(that.setUserPassword).toString()
					}

				}

				let formData = JSON.stringify(obj)
				updateUserInfo(formData).then(res => {
					if (res.status == 200) {
						uni.showModal({
							title: '温馨提示',
							content: '修改完成，请点击确定重新登录',
							showCancel: false,
							success(response) {
								if (response.confirm) {
									uni.navigateBack()
									that.$u.vuex('currentTemplate', 0);
								}
							}
						})
					} else if (res.status == 500 && res.msg == '原密码不正确') {
						that.showToast('error', res.msg)
					}
				})
			},
			// checkPhone() {
			// 	let reg = /^1([38]\d|4[579]|5[0-3,5-9]|66|7[0135678]|9[89])\d{8}$/
			// 	if (!reg.test(this.setUserPhone)) {
			// 		// 弹出提示框
			// 		this.showToast({
			// 			type: 'error',
			// 			icon: false,
			// 			title: '失败主题',
			// 			message: '请输入正确的手机号',
			// 			iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
			// 		})
			// 		this.isOK = false
			// 		return
			// 	} else {
			// 		this.isOK = true
			// 	}
			// },

			changeAvatar() {
				if (this.isAdmin == "admin") {
					this.showToast('error', '您无权修改该账号个人信息')
					return
				}
				let that = this
				uni.chooseImage({
					count: 1,
					success(res) {
						let tempFilePaths = res.tempFilePaths
						that.imgSrc = tempFilePaths[0]
						let form = JSON.stringify({
							userId: that.memberId,
							xPoint: 200,
							yPoint: 200
						})
						uni.uploadFile({
							url: 'https://serviceiems.gree.com/appletAPI/user/updateImgById', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							header: {
								token: store.state.token
							},
							formData: {
								data: form
							},
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data)

								if (uploadFileRes) {
									that.showToast('success', '上传成功')
									that.$u.vuex('userAvatar', data.data.imagePath);
								}
							},
							fail(err) {}
						});
					}

				})
			},
			showToast(type, title) {
				this.$refs.uToast.show({
					type: type,
					icon: false,
					title: '失败主题',
					message: title
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100%
	}

	.list {
		display: flex;
		align-items: center;
		padding: 0.8rem;
		border-bottom: 1px solid #f2f2f2;


		image {
			width: 80rpx;
			height: 80rpx;
		}
	}

	.center-list {
		background-color: #16379A;
		padding-left: 9vw;
		padding-right: 9vw;
		margin: 1rem;

		image {
			width: 80rpx;
			height: 80rpx;
		}

	}

	.logout {
		position: fixed;
		bottom: 0;
		left: 50%;
		right: 50%;
		transform: translate(-50%, -50%);
		width: 50%;
		text-align: center;
		background-color: #fff;
		border-radius: 100px;
		padding: 3vw 6vw;
		border: 1px solid #f3f8ff;
		border-radius: 20rpx;
	}
</style>