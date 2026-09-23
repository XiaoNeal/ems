<script>
import {
	checkAppUpdate
} from "@/utils/appUpdate.js"
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

		// #ifdef APP-PLUS
		// APP 升级更新：整包/wgt 热更新/强制更新/进度下载，见 utils/appUpdate.js
		checkAppUpdate()
		// #endif
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
	box-sizing: border-box;
	/* App 端用 custom navigationStyle，状态栏由 DyNavbar 内部 header-safe-area 处理 */
	/* #ifdef MP */
	padding-top: env(safe-area-inset-top);
	padding-bottom: env(safe-area-inset-bottom);
	/* #endif */
}

:not(noe) {
	box-sizing: border-box;
}

//#endif
</style>