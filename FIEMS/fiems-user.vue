<template>
	<view class="container">
		<!-- <u-navbar title="G-FIEMS"
			:titleStyle="{'color':'#fff','width':'100%','text-align':'left','padding-left':'40rpx'}" :leftIcon="null"
			:leftText="null" :placeholder="true" :bgColor="headerTabBg"></u-navbar> -->
			<u-navbar :title="currentSystemInfo.areaName"
				:titleStyle="{'color':'#fff','width':'100%','text-align':'left','padding-left':'40rpx'}" :leftIcon="null"
				:leftText="null" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>
		<view class="center">

			<view class="logo" @click="bindLogin" :hover-class="!hasLogin ? 'logo-hover' : ''">
				<!-- <view style="padding-top: 44px;margin-bottom: 13.07vw;">GIEMS云</view> -->
				<view style="display: flex;align-items: center;height: 22vw;">
					<view class="circular-img">
						<image class="logo-img" :src="avatarUrl"></image>
					</view>

					<view class="logo-title">
						<text class="uer-name">Hi，{{hasLogin ? userName : '您未登录'}}</text>
						<text class="go-login navigat-arrow" v-if="!hasLogin">&#xe65e;</text>
					</view>
				</view>

			</view>

		<view class="center-list" @click="goLink('userOptions')">
			<view class="center-list-item">
				<!-- <uni-icons type="gear" class="list-icon" size="22" color="#0faeff"></uni-icons> -->
				<image class="list-img" src="https://serviceiems.gree.com/api/upload/wximages/uiImages/set.png"
					mode=""></image>
				<text class="list-text">设置</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
			<button  class="center-list" open-type="contact" >
				<view class="center-list-item">
					
					<image class="list-img"
						src="https://serviceiems.gree.com/api/upload/wximages/uiImages/customerService.png" mode="">
					</image>
					<text class="list-text">联系客服</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
			</button >
			
			<view class="center-list" @click="goLink('about')">
				<view class="center-list-item">
					<!-- <text class="list-icon">&#xe614;</text> -->
					<image class="list-img" src="https://serviceiems.gree.com/api/upload/wximages/uiImages/about.png"
						mode=""></image>
					<text class="list-text">关于应用</text>
					<!-- <u-icon name="photo" color="#2979ff" size="28" @click="show=true"></u-icon> -->
			
					<!-- <text class="navigat-arrow" @click="show=true">&#xe65e;</text> -->
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
			
			</view>
			<!-- 切换项目 -->
<!-- 			<picker mode="selector" :range="templateList" :disabled='isProjectChange' @change="changeProject">
				<view class="center-list" @click="noOtherProjects"  >
		
					<view class="center-list-item">
						<image class="list-img" src="https://serviceiems.gree.com/api/upload/wximages/uiImages/set.png"
							mode=""></image>
						<text class="list-text">切换项目</text>
						<text class="navigat-arrow">&#xe65e;</text>
					</view>
				</view>
			</picker> -->

			<view class="btn-row">
				<button class="logoutBtn" v-if="hasLogin" :loading="logoutBtnLoading" @tap="bindLogout">退出登录</button>
			</view>
			<!-- <view class="u-m-l-20 u-m-r-20 item-box logout btn-row">
					<logoutPage class="btn-row" :justQuit="false" :mainColor="themeColor" @loginOut="loginOut"></logoutPage>
			</view> -->
			<u-modal :show="show" @confirm="() => show = false">
				<view class="slot-content">
					<rich-text :nodes="content"></rich-text>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		name: "fiemsUser",
		data() {
			return {
				bgColor: '#003E98',
				avatarUrl: "https://serviceiems.gree.com/api/upload/wximages/img/logo.png",
				inviteUrl: '',
				logoutBtnLoading: false,
				hasPwd: uni.getStorageSync('uni_id_has_pwd'),
				show: false,
				content: `"物理世界数字化，能源视角看天下。"格力电器及创新中心和伙伴致力于研究能源信息化和能效管理，
				坚持零碳直流的创新理念，在能源数字化、可视化的路上不断探索，紧跟国家政策导向，
				为构建清洁低碳的能源体系持续科技创新，努力研发适应能源信息网络化的新产品，以科技创新助力零碳中国。`,
				// projectList:['变流器','PCS储能','工厂']
				projectList: [],
				isProjectChange: false
				// hasLogin: ,
				// userName:
			}
		},
		computed: {
			...mapState({
				// hasLogin: state => state.user.hasLogin,
				// userName: state => state.user.userName
			})

		},
		mounted() {
			if (this.projectList.length == 0) {
				this.isProjectChange = true
			}
		},

		methods: {
			dialogToggle() {
				// this.msgType = type
				this.$refs.alertDialog.open()
			},
			getProjectList() { //获取用户其他的项目

			},
			noOtherProjects() { //没有其他项目
				if (this.isProjectChange == false) return
				uni.showModal({
					title: "温馨提示",
					content: `目前暂无其他产品，如有需要请联系我们`,
					showCancel: false
				})
			},
			changeProject(e) {
				let that = this
				if (e.detail.value == 0) {
					that.isChange('变流器', 1)
				} else if (e.detail.value == 1) {
					that.isChange('PCS储能', 30)
				} else if (e.detail.value == 2) {
					that.isChange('工厂', 31)
				}
			},
			isChange(project, projectId) { //是否真的切换项目
				let that = this
				uni.showModal({
					title: "温馨提示",
					content: `点击确定切换到${project}项目`,
					success(res) {
						if (res.confirm) {
							that.$u.vuex('currentTemplate', projectId);
						} else if (res.cancel) {
						}
					}
				})
			},
			...mapMutations(['logout']),
			goLink(e) {
				uni.navigateTo({
					url: `/pages-public/${e}/${e}`,
					fail(err) {
					}
				})
			},
			addDevice() {
				uni.navigateTo({
					url: '/pages/addDevice/addDevice'
				})
			},

			bindLogin() {
				if (!this.hasLogin) {
					// univerifyLogin().catch(err => {
					// 	if (err === false) return;
					// 	uni.navigateTo({
					// 		url: '../login/login',
					// 	});
					// })
					this.$u.vuex('currentTemplate', 0);
				}
			},
			bindLogout() {
				this.$u.vuex('currentTemplate', 0);
				this.$u.vuex('urlPrefix', '');
				uni.removeStorageSync('urlPrefix')
			},
			toInvite() {
				var req = { //升级检测数据
					"appid": plus.runtime.appid,
					"version": plus.runtime.version,
					"name": plus.os.name,
				};
				uni.showModal({
					title: '提示',
					content: `当前版本${req.appid}`,
					success: function(res) {
						if (res.confirm) {
						} else if (res.cancel) {
						}
					}
				});
			},
			goto() {
				uni.navigateTo({
					url: '../pwd/update-password'
				})
			},
			scan() {
				uni.navigateTo({
					url: '/pages/addDevice/addDevice'
				})
				// let that = this
				// // this.show = true;
				// // this.content = `${res.scanType}<br>${res.result}`
				// uni.scanCode({
				// 	success: function(res) {
				// 		that.getBarcode(res)
				// 	},
				// 	complete: function(res) {
				// 		uni.showLoading({
				// 			'title': '识别中'
				// 		});
				// 		setTimeout(() => {
				// 			uni.hideLoading()
				// 		}, 2000)
				// 	},
				// 	fail: function() {
				// 		setTimeout(() => {
				// 			uni.hideLoading()
				// 		}, 2000)
				// 	}
				// });
			},
			getBarcode(res) {
				this.content = `条码类型：${res.scanType}<br>条码内容：${res.result}`
				this.show = true;
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		font-size: 14px;
		line-height: 24px;
		background-color: #0E2264;
		height: 100%;
		overflow: auto
	}

	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}


	.logoutBtn {
		margin-top: 14vw;
		color: white;
		font-size: 4.53vw;
		width: 82.93vw;
		line-height: 10.67vw;
		background-image: linear-gradient(-90deg, #3A40ff 0%, #32C7ffff 100%);
		box-shadow: 0vw 3.07vw 2.8vw 0vw rgba(168, 150, 255, 0.38);
		border-radius: 12px;
		letter-spacing: 1vw;

		&::after {
			border: none;
		}
	}



	.center {
		flex-direction: column;
	}

	.logo {

		height: 46vw;
		padding-left: 8vw;
		padding-right: 8vw;
		box-sizing: border-box;
		// background-image: linear-gradient(rgba(170, 152, 255, 1), rgba(88, 234, 172, 0));
		align-items: center;
		display: flex;
		justify-content: center;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.circular-img {
		position: relative;
		width: 21.33vw;
		height: 21.33vw;
		border-radius: 50%;
		background-image: linear-gradient(rgba(119, 170, 255, 0.3), rgba(88, 234, 172, .2), rgba(170, 152, 255, 1));
	}

	.logo-img {
		position: absolute;
		width: 19.33vw;
		height: 19.33vw;
		border-radius: 1000px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.logo-title {
		line-height: 150rpx;
		flex: 1;
		margin-left: 20rpx;
	}

	.uer-name {
		height: 60rpx;
		line-height: 60rpx;
		font: 4.53vw;
		color: #fff;
	}

	.go-login.navigat-arrow {
		color: #FFFFFF;
	}

	.login-title {
		height: 150rpx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.center-list {
		background-color: #16379A;
		padding-left: 9vw;
		padding-right: 9vw;
		margin: 1rem;
		font-size:28rpx;
		height:4rem
		
	}

	.center-list-item {
		border-bottom: 1px solid rgba(0, 0, 0, .1);
		padding: 5vw 0;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.border-bottom {
		border-bottom-width: 1rpx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40rpx;
		color: #0faeff;
		text-align: center;
		font-family: texticons;
		margin-right: 20rpx;
	}

	.list-img {
		width: 4.7vw;
		height: 4.7vw;
		margin-right: 1.87vw;
	}

	.list-text {
		color: #fff;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		width: 40rpx;
		color: #fff;
		text-align: right;
		font-family: texticons;
	}

	image {
		height: 1rem;
		width: 1rem
	}
</style>