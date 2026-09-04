<script>
import {
	decrypt
} from "@/utils/decryptData.js"
export default {
	onLaunch: function () {
		// 启动时清除直连激活标记——防止 storage 残留 enabled:true 但用户并未真正进入直连模式
		// 直连标记只在用户真正进入 direct-device 页面并连上 MQTT 时才会被设置
		try {
			uni.removeStorageSync('direct_device_activated');
		} catch (e) { }

		// #ifdef MP-WEIXIN
		const updateManager = wx.getUpdateManager()

		updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回�?
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
			// 新版本下载失�?
		})
		// #endif

		//#ifdef APP-PLUS  
		plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
			let version = widgetInfo.version
			let osName = plus.os.name;
			var server = `https://serviceiems.gree.com/appletAPI/downloadAPK?version=${version}&osName=${osName}&AppName=微能站`; //检查新地址
			uni.request({
				url: server,
				// data: req,
				header: {
					"token": this.token
				},
				success: (res) => {
					let parsed
					try {
						parsed = JSON.parse(decrypt(res.data))
					} catch (e) {
						console.error('更新信息解密失败:', e)
						return
					}
					if (!parsed || parsed.status != 200 || !parsed.data) return
					const data = parsed.data
					if (data.updateStatus == 3) {
						return
					} else if (data.updateStatus === 1) {
						// 整包更新
						if (this.newVersion === data.version) {
							return
						}
						let downapk = data.url
						uni.showModal({ //提醒用户更新
							title: "更新提示",
							content: `${data.note}`,
							success: (sus) => {
								if (sus.confirm) {
									plus.runtime.openURL(downapk);
								}
								if (sus.cancel) {
									this.$u.vuex('notUpdated', true);
									this.$u.vuex('newVersion', data.version);
								}

							}
						})
					} else if (data.updateStatus === 2) {
						uni.downloadFile({
							url: data.url,
							success: (downloadResult) => {
								if (downloadResult.statusCode === 200) {
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
	padding-top: env(safe-area-inset-top);
	padding-bottom: env(safe-area-inset-bottom);
	box-sizing: border-box;
}

:not(noe) {
	box-sizing: border-box;
}

//#endif
</style>