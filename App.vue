<script>
import {
	checkAppUpdate
} from "@/utils/appUpdate.js"
// #ifdef APP-PLUS
import {
	startNotification,
	resumeNotification
} from "@/utils/alarm-notification.js"
// #endif

// 本地告警通知点击：跳到报警记录页（仅处理本模块发出的消息，payload.local=true）
// #ifdef APP-PLUS
function handleAlarmNoticeClick(msg) {
	try {
		let payload = msg && msg.payload
		if (typeof payload === 'string') {
			payload = JSON.parse(payload)
		}
		if (!payload || payload.local !== true || payload.type !== 'alarm') return
		uni.navigateTo({
			url: '/community/alarm/alarm',
			fail: () => uni.switchTab({
				url: '/pages/index/index',
				fail: () => {}
			})
		})
	} catch (e) { }
}
// #endif

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
		// APP 升级更新：每次冷启动都必须真正发起一次检查（模块内只做进程级去重）
		// 整包/wgt 热更新/强制更新/进度下载，见 utils/appUpdate.js
		checkAppUpdate()

		// 本地告警通知：等 plus 就绪后启动轮询与点击监听（模块内已做平台与登录守卫）
		if (typeof plus !== 'undefined' && plus.push && plus.push.addEventListener) {
			plus.push.addEventListener('click', handleAlarmNoticeClick, false)
		}
		startNotification()
		// #endif
	},

	onShow: function () {
		// #ifdef APP-PLUS
		// 回到前台补检一次：后台期间定时器可能被系统冻结，避免漏掉新告警
		resumeNotification()
		// #endif
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
	/* App 端禁用 webview 边界橡皮筋回弹。必须写在全局非 scoped 样式里：
	   scoped 会把它编译成 page[data-v-xxx]，页面根元素不带该属性，从来不会生效。 */
	/* #ifdef APP-PLUS */
	overscroll-behavior: none;
	overscroll-behavior-y: none;
	/* #endif */
	/* 全局字体栈：安卓 WebView 未显式指定时会落到思源/默认字体，
	   数字与中文混排字重不齐；统一走系统 UI 字体，子组件继承后观感一致 */
	font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC',
		'HarmonyOS Sans', 'Helvetica Neue', 'Microsoft YaHei', sans-serif;
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