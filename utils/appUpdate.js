/**
 * APP 升级更新模块（参考同行业主流方案：微信/支付宝及 uniapp 生态通用做法）
 *
 * 能力清单：
 * 1. 自定义升级弹窗页（pages-public/app-update）：卡片式 UI + 更新日志 + 下载进度条
 * 2. 整包更新（Android）：应用内下载 APK + 进度显示 + 自动拉起系统安装器
 * 3. 整包更新（iOS）：直接跳转 App Store 下载页
 * 4. wgt 热更新：应用内下载 + 进度显示 + 安装后重启生效
 * 5. 强制更新：弹窗不可关闭、返回键拦截
 * 6. 忽略版本：非强制更新允许"稍后再说"，同版本不再打扰
 * 7. 版本号二次校验：服务端版本必须高于本地才提示（防止服务端误发）
 * 8. 失败降级：下载/安装失败时提供"重试"与"浏览器下载"兜底
 * 9. 检查节流：短时间内重复启动不重复弹窗
 *
 * 注意：Android 整包更新需在 manifest.json 的 APP 模块权限中
 *       声明 android.permission.REQUEST_INSTALL_PACKAGES
 */
import { decrypt } from '@/utils/decryptData.js'

// 两次检查更新的最小间隔（毫秒）：10 分钟
const CHECK_GAP = 10 * 60 * 1000

// ============================================================
// 检查更新接口地址
// 联调调试时可临时切换为电脑局域网地址（手机与电脑同一 Wi-Fi），如：
//   http://192.168.1.33:9201
// 生产环境必须为服务器地址，且 Nginx 需将 /appletAPI/app/ 转发到 chargePile
// ============================================================
const UPDATE_API_BASE = 'https://iems.neiic.com'

// 待处理更新信息在 storage 中的键名（升级页读取）
export const PENDING_UPDATE_KEY = 'pending_update_info'

/**
 * 语义化版本比较：v1 > v2 返回 1，相等返回 0，v1 < v2 返回 -1
 * 支持 "1.2.3"、"1.2.3-beta" 等格式（忽略非数字段），逐段数字比较
 */
export function compareVersion(v1 = '', v2 = '') {
	const toArr = (v) => String(v).replace(/[^0-9.]/g, '').split('.').map(n => parseInt(n) || 0)
	const a = toArr(v1)
	const b = toArr(v2)
	const len = Math.max(a.length, b.length)
	for (let i = 0; i < len; i++) {
		const x = a[i] || 0
		const y = b[i] || 0
		if (x > y) return 1
		if (x < y) return -1
	}
	return 0
}

/**
 * 启动时检查更新入口（仅 APP-PLUS 生效）
 * @param {boolean} force - true 时跳过节流与"忽略版本"，用于设置页手动检查
 */
export function checkAppUpdate(force = false) {
	// #ifdef APP-PLUS
	// 节流：短时间内重复启动不重复检查（手动检查不受限）
	const lastCheck = uni.getStorageSync('last_update_check_time') || 0
	if (!force && Date.now() - lastCheck < CHECK_GAP) {
		console.log('[AppUpdate] 10 分钟内已检查过，跳过（force 可跳过此限制）')
		return
	}
	uni.setStorageSync('last_update_check_time', Date.now())

	plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
		// 去掉可能的 V/v 前缀，统一为纯数字版本号（如 V1.0.12 -> 1.0.12）
		const currentVersion = (widgetInfo.version || '').replace(/^v/i, '')
		const osName = plus.os.name
		const updateUrl = `${UPDATE_API_BASE}/appletAPI/app/checkUpdate?version=${currentVersion}&osName=${osName}`
		console.log('[AppUpdate] 开始检查更新:', updateUrl)

		uni.request({
			url: updateUrl,
			header: {
				token: uni.getStorageSync('token') || ''
			},
			success: (res) => {
				let parsed
				try {
					parsed = JSON.parse(decrypt(res.data))
				} catch (e) {
					console.error('[AppUpdate] 解密失败，原始响应前 50 字符:', String(res.data).slice(0, 50), e)
					return
				}
				if (!parsed || parsed.status != 200 || !parsed.data) {
					console.log('[AppUpdate] 接口异常或无数据:', JSON.stringify(parsed))
					return
				}

				const info = parsed.data
				console.log('[AppUpdate] 服务端返回:', JSON.stringify(info), '| 本地版本:', currentVersion)

				// 服务端判定无更新
				if (!info.updateStatus || info.updateStatus === 3) {
					console.log('[AppUpdate] 服务端判定无更新')
					if (force) uni.showToast({ title: '当前已是最新版本', icon: 'none' })
					return
				}

				// 本地二次校验：服务端版本必须高于当前版本才提示
				if (info.version && compareVersion(info.version, currentVersion) <= 0) {
					console.log('[AppUpdate] 服务端版本不高于本地版本，忽略:', info.version, '当前:', currentVersion)
					if (force) uni.showToast({ title: '当前已是最新版本', icon: 'none' })
					return
				}

				showUpdatePage(info, force)
			},
			fail: (err) => {
				console.error('[AppUpdate] 检查更新请求失败:', err)
				if (force) uni.showToast({ title: '检查更新失败，请检查网络', icon: 'none' })
			}
		})
	})
	// #endif
}

/**
 * 打开自定义升级弹窗页（pages-public/app-update）
 * onLaunch 早期页面栈未就绪，延迟导航并对失败自动重试
 */
function showUpdatePage(info, force = false) {
	// #ifdef APP-PLUS
	// 已在升级页则不重复打开
	const pages = getCurrentPages()
	if (pages.length && pages[pages.length - 1].route.indexOf('app-update') > -1) return

	// 非强制更新：用户上次忽略的版本不再重复打扰（手动检查不受限）
	const isForce = !!info.force
	const ignoredVersion = uni.getStorageSync('ignored_version') || ''
	if (!force && !isForce && ignoredVersion === info.version) {
		console.log('[AppUpdate] 版本', info.version, '曾被用户忽略，跳过弹窗')
		return
	}
	console.log('[AppUpdate] 命中更新，打开升级弹窗页:', info.version, 'force:', isForce)

	uni.setStorageSync(PENDING_UPDATE_KEY, info)

	const nav = () => {
		uni.navigateTo({
			url: '/pages-public/app-update/app-update',
			fail: () => setTimeout(nav, 800)
		})
	}
	// 等待首页渲染完成再弹出，避免启动瞬间白屏闪烁
	setTimeout(nav, 1500)
	// #endif
}

/**
 * 下载更新包（apk/wgt），通过 onProgress 回调实时回报进度百分比
 *
 * 关键点：必须显式指定落盘路径和正确的文件后缀。
 * 下载接口形如 /appletAPI/downloadAPK?id=xxx，URL 末尾没有 .wgt/.apk，
 * uni.downloadFile 默认生成的临时文件无后缀，plus.runtime.install 无法识别包类型会直接安装失败。
 *
 * @param {string} url 下载地址
 * @param {(p:number)=>void} onProgress 进度回调
 * @param {string} fileExt 包类型后缀：'wgt' | 'apk'（URL 自带后缀时优先取 URL）
 * @returns Promise<string> 下载完成的本地文件路径（带正确后缀，可直接传给 plus.runtime.install）
 */
export function downloadUpdateFile(url, onProgress, fileExt) {
	return new Promise((resolve, reject) => {
		// 优先使用 URL 路径中的后缀，其次使用调用方传入的类型，默认 wgt
		let ext = fileExt || 'wgt'
		const urlPath = String(url || '').split('?')[0].split('#')[0]
		const match = urlPath.match(/\.(wgt|apk)$/i)
		if (match) ext = match[1].toLowerCase()

		// #ifdef APP-PLUS
		// 固定落盘到应用私有目录 _doc 下，文件名带时间戳和正确后缀（_doc 目录必然存在，无需创建子目录）
		const savePath = `_doc/app_update_${Date.now()}.${ext}`
		console.log('[AppUpdate] 下载目标路径:', savePath)
		// #endif

		const task = uni.downloadFile({
			url,
			// #ifdef APP-PLUS
			filePath: savePath,
			// #endif
			success: (res) => {
				console.log('[AppUpdate] 下载完成 statusCode=', res.statusCode, '临时路径=', res.tempFilePath, '落盘路径=', res.filePath)
				if (res.statusCode === 200) {
					// 优先使用显式落盘路径，部分基础库只返回 tempFilePath
					resolve(res.filePath || res.tempFilePath)
				} else {
					reject(new Error('下载失败，HTTP 状态码 ' + res.statusCode))
				}
			},
			fail: (err) => reject(err)
		})
		task.onProgressUpdate((p) => {
			if (typeof onProgress === 'function') onProgress(p.progress)
		})
	})
}

/**
 * Android 8.0+ 需要"允许安装未知应用"运行时权限
 * 返回 Promise<boolean>：true 已授权可继续，false 已引导用户去设置
 */
export function ensureInstallPermission() {
	return new Promise((resolve) => {
		// #ifdef APP-PLUS
		try {
			const main = plus.android.runtimeMainActivity()
			const Settings = plus.android.importClass('android.provider.Settings')
			const Build = plus.android.importClass('android.os.Build')

			if (Build.VERSION.SDK_INT >= 26) {
				if (!Settings.canRequestPackageInstalls(main)) {
					const Uri = plus.android.importClass('android.net.Uri')
					const intent = new plus.android.content.Intent()
					intent.setAction(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES)
					intent.setData(Uri.parse(`package:${main.getPackageName()}`))
					main.startActivity(intent)
					uni.showModal({
						title: '需要安装权限',
						content: '请在设置中允许本应用安装未知来源应用，返回后重新点击"立即更新"即可继续',
						showCancel: false
					})
					resolve(false)
					return
				}
			}
			resolve(true)
		} catch (e) {
			console.warn('[AppUpdate] 权限检查失败，直接尝试安装:', e)
			resolve(true)
		}
		// #endif
	})
}

/**
 * plus.runtime.install 常见错误码 → 可读原因
 * 依据 DCloud 官方文档整理，便于快速定位 wgt 安装失败原因
 */
const INSTALL_ERROR_MAP = {
	'-2': '安装包文件不存在或路径错误',
	'-3': '安装包签名校验失败（wgt 包与 App 签名/AppID 不匹配）',
	'-4': '应用信息错误（wgt 包内 AppID 与当前 App 不一致）',
	'-5': '不支持的版本（wgt 与当前 App 基础版本不兼容）',
	'-8': '安装包版本号低于当前版本（制作 wgt 前需提高 manifest 中的 versionCode）',
	'-9': '平台不支持该安装包',
	'-12': '安装包格式错误（不是有效的 wgt 包，需用 HBuilderX「制作 wgt 包」生成，不能手动改 zip 后缀）'
}

/**
 * 把 plus.runtime.install 的失败回调对象转换为带可读信息的 Error
 */
function normalizeInstallError(e, filePath) {
	const code = e && (e.code !== undefined ? e.code : e.errCode)
	const rawMsg = (e && e.message) || ''
	const reason = INSTALL_ERROR_MAP[String(code)] || rawMsg || '未知错误'
	const err = new Error(`安装失败（错误码 ${code === undefined ? '未知' : code}）：${reason}`)
	err.code = code
	err.raw = e
	err.filePath = filePath
	console.error('[AppUpdate] plus.runtime.install 失败:', JSON.stringify({
		code,
		message: rawMsg,
		filePath
	}))
	return err
}

/**
 * 安装 wgt 热更新包，完成后提示重启
 */
export function installWgt(filePath) {
	return new Promise((resolve, reject) => {
		// #ifdef APP-PLUS
		console.log('[AppUpdate] 开始安装 wgt，文件路径:', filePath)
		plus.runtime.install(filePath, { force: false }, () => {
			console.log('[AppUpdate] wgt 安装成功')
			uni.showModal({
				title: '更新完成',
				content: '新版本已安装，是否立即重启应用？',
				showCancel: false,
				success: () => plus.runtime.restart()
			})
			resolve()
		}, (e) => reject(normalizeInstallError(e, filePath)))
		// #endif
	})
}

/**
 * 安装 APK 整包（系统安装器接管，应用随安装流程退出）
 */
export function installApk(filePath) {
	return new Promise((resolve, reject) => {
		// #ifdef APP-PLUS
		console.log('[AppUpdate] 开始安装 apk，文件路径:', filePath)
		plus.runtime.install(filePath, { force: false }, () => resolve(), (e) => reject(normalizeInstallError(e, filePath)))
		// #endif
	})
}

/**
 * 失败兜底：跳转浏览器/外部下载
 */
export function openInBrowser(url) {
	// #ifdef APP-PLUS
	if (url) plus.runtime.openURL(url)
	// #endif
}
