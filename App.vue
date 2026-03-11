<script>
import {
	decrypt
} from "@/utils/decryptData.js"
export default {
	onLaunch: function () {


		// #ifdef MP-WEIXIN
		const updateManager = wx.getUpdateManager()

		updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			// console.log(res.hasUpdate)
		})

		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success: function (res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})

		updateManager.onUpdateFailed(function () {
			// 新版本下载失败
		})
		// #endif

		//#ifdef APP-PLUS  
		plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
			let version = widgetInfo.version
			let osName = plus.os.name;
			var server = `https://serviceiems.gree.com/appletAPI/downloadAPK?version=${version}&osName=${osName}&AppName=GIEMS云`; //检查新地址
			uni.request({
				url: server,
				// data: req,
				header: {
					"token": this.token
				},
				success: (res) => {
					res = JSON.parse(decrypt(res.data))
					if (res.status == 200 && res.data.updateStatus == 3) {
						return
					} else if (res.status == 200 && res.data.updateStatus === 1) {
						// 整包更新
						if (this.newVersion === res.data.versione) {
							return
						}
						let downapk = 'https://serviceiems.gree.com/home/springboot_service/mobile_service/mobile_apk/GIEMS云.apk'
						uni.showModal({ //提醒用户更新  
							title: "更新提示",
							content: `${res.data.note}`,
							success: (sus) => {
								if (sus.confirm) {
									plus.runtime.openURL(downapk);
								}
								if (sus.cancel) {
									this.$u.vuex('notUpdated', true);
									this.$u.vuex('newVersion', res.data.version);
								}

							}
						})
					} else if (res.status == 200 && res.data.updateStatus === 2) {
						uni.downloadFile({
							url: res.data.url,
							success: (downloadResult) => {
								if (downloadResult.status === 200) {
									plus.runtime.install(downloadResult.tempFilePath, {
										force: false
									},
										function () {
											plus.runtime.restart();
										},
										function (e) { });
								}
							}
						});
					}


				}
			})
		})

		//#endif 
	},
	onShow: function () {


	},
}
</script>

<style lang="scss">
/*每个页面公共css */
@import '@/uni_modules/uni-scss/index.scss';
@import "@/uni_modules/uview-ui/index.scss";
/* #ifndef APP-NVUE */
@import '@/static/customicons.css';

// 设置整个项目的背景色
page {
	// background-image: url('static/main_bg_img_750.jpg');
	height: 100%;
	// padding-top: env(safe-area-inset-top);
	// padding-top: var(--status-bar-height);
	// box-sizing: border-box;
}



:not(noe) {
	box-sizing: border-box;
}

//#endif</style>