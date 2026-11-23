/**
 * APP 自动更新升级模块
 *
 * 能力清单：
 * 1. 启动时 / 手动检查更新：服务端下发 + 本地版本号二次校验 + 10 分钟节流
 * 2. 自定义升级弹窗页：更新日志、强制更新、忽略版本、下载进度
 * 3. wgt 热更新：应用内下载 + 进度显示 + 安装后重启生效
 * 4. Android 整包更新：应用内下载 APK + 进度显示 + 系统安装器接管
 * 5. iOS 整包更新：跳转 App Store
 * 6. 失败降级：下载 / 安装失败时提供「重试」与「浏览器下载」兜底
 *
 * ⚠️ 厂商安全检测提示（2026-11-09 决策：业务要求保留自动更新升级）
 *    「应用内下载 + 安装」会被荣耀 / 华为等安全引擎计入风险权重
 *    （提示文案「私自下载安装应用」），恢复后必须同时遵守以下约束：
 *      - 只从企业官方服务器 https://iems.neiic.com 下载，只安装本应用自身的新版本；
 *      - 全程需用户主动点击「立即更新」，不做静默下载、静默安装、后台自启；
 *      - 使用正式证书 ems.keystore 签名（SHA1 B2:5E:F7:...），并保留官方误报申诉；
 *      - INSTALL_PACKAGES / DUMP / READ_PHONE_STATE / 短信 / 通讯录等冗余权限
 *        继续在 manifest.json 中以 tools:node="remove" 剔除，不因本次恢复而放开。
 *
 *    一键回退（若后续决定彻底规避该风险）：
 *      1. 把下方 ALLOW_IN_APP_APK_INSTALL 置为 false（APK 整包改走浏览器下载）；
 *      2. 把 manifest.json 中 REQUEST_INSTALL_PACKAGES 改回 tools:node="remove"。
 *      wgt 热更新仍可在应用内自动安装，因为它不需要该权限。
 *    详见 .workbuddy/docs/APK安全误报处置方案.md B3 节。
 */
import { decrypt } from '@/utils/decryptData.js'

// 同一进程内两次自动检查的最小间隔（毫秒）
// 注意：不再写入 storage —— 每次冷启动（进入 APP）都必须真正发起一次检查。
// 旧实现把时间戳写在「发起请求时」且手动检查也会写，导致手动点过「检查更新」后，
// 之后 10 分钟内的冷启动整批被跳过，表现为「进 APP 不自动弹、手动点才弹」。
const CHECK_GAP = 10 * 60 * 1000
let lastAutoCheckAt = 0

// 「稍后再说」只在本次运行内生效：下次冷启动重新提醒，不再永久忽略版本
let snoozedVersion = ''

/**
 * 记录用户在升级弹窗点击「稍后再说」
 * 只影响当前进程；同时清掉旧逻辑写入的永久忽略标记 ignored_version，
 * 避免用户手机上已存在的历史数据继续把自动弹窗挡住。
 */
export function snoozeUpdateVersion(version) {
	snoozedVersion = String(version || '')
	try {
		uni.removeStorageSync('ignored_version')
	} catch (e) { }
}

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
 * 是否允许 APK 整包在应用内下载安装。
 * true  = 完整自动更新升级（需 REQUEST_INSTALL_PACKAGES 权限）
 * false = APK 整包跳浏览器下载，wgt 热更新仍应用内自动安装
 */
export const ALLOW_IN_APP_APK_INSTALL = true

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
 * 检查更新入口（仅 APP-PLUS 生效）
 * @param {boolean} force - true = 手动检查：跳过进程内去重与「稍后再说」，无更新/失败时给 toast
 *
 * 自动检查（App.vue onLaunch 调用）的可靠性约束：
 *   1. 不读写 storage 时间戳，每次冷启动都真正发起一次检查；
 *   2. 只有拿到服务端有效响应才算完成一次检查，失败可有限重试；
 *   3. plus.runtime 早期未就绪时走兜底版本 + 2s 超时，不静默中断；
 *   4. 启动早期网络 / 登录态未就绪导致的失败，最多自动重试 2 次（间隔 3s）。
 */
export function checkAppUpdate(force = false) {
	// #ifdef APP-PLUS
	// 进程内去重：只防同一进程内生命周期重复调用；手动检查不占用自动检查配额
	if (!force && lastAutoCheckAt && Date.now() - lastAutoCheckAt < CHECK_GAP) {
		return
	}

	const AUTO_RETRY_MAX = force ? 0 : 2
	const AUTO_RETRY_GAP = 3000
	const fallbackVersion = () => {
		try { return String(plus.runtime.version || '').replace(/^v/i, '') } catch (e) { return '' }
	}
	let checkStarted = false

	const runCheck = (currentVersion, retryCount = 0) => {
		let osName = 'Android'
		try { osName = plus.os.name || osName } catch (e) { }
		const updateUrl = `${UPDATE_API_BASE}/appletAPI/app/checkUpdate?version=${currentVersion}&osName=${osName}`

		const retryLater = (reason) => {
			if (!force && retryCount < AUTO_RETRY_MAX) {
				console.warn('[AppUpdate]', reason, `${AUTO_RETRY_GAP / 1000}s 后自动重试`)
				setTimeout(() => runCheck(currentVersion, retryCount + 1), AUTO_RETRY_GAP)
			} else if (force) {
				uni.showToast({ title: '检查更新失败，请检查网络', icon: 'none' })
			}
		}

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
					retryLater('响应解密失败')
					return
				}
				if (!parsed || parsed.status != 200 || !parsed.data) {
					// 已拿到服务端响应即算一次有效检查，避免「无数据」场景反复重试
					if (!force) lastAutoCheckAt = Date.now()
					return
				}
				// 只有真正完成一次检查才记录时间，失败路径不占用配额
				if (!force) lastAutoCheckAt = Date.now()

				const info = parsed.data

				// 服务端判定无更新
				if (!info.updateStatus || info.updateStatus === 3) {
					if (force) uni.showToast({ title: '当前已是最新版本', icon: 'none' })
					return
				}

				// 本地二次校验：服务端版本必须高于当前版本才提示
				if (info.version && compareVersion(info.version, currentVersion) <= 0) {
					if (force) uni.showToast({ title: '当前已是最新版本', icon: 'none' })
					return
				}

				showUpdatePage(info, force)
			},
			fail: (err) => {
				console.error('[AppUpdate] 检查更新请求失败:', err)
				retryLater('请求失败')
			}
		})
	}

	const startWith = (v) => {
		if (checkStarted) return
		checkStarted = true
		runCheck(v)
	}

	try {
		plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
			const v = (widgetInfo && widgetInfo.version ? String(widgetInfo.version) : '').replace(/^v/i, '')
			startWith(v || fallbackVersion())
		}, (err) => {
			console.warn('[AppUpdate] 读取运行时版本失败，使用兜底版本继续检查:', err)
			startWith(fallbackVersion())
		})
	} catch (e) {
		console.warn('[AppUpdate] plus.runtime 未就绪，使用兜底版本继续检查:', e)
		startWith(fallbackVersion())
	}
	// 个别机型 onLaunch 早期 getProperty 不回调，2s 后强制继续，避免整条检查静默中断
	setTimeout(() => {
		if (!checkStarted) {
			console.warn('[AppUpdate] 读取运行时版本超时，使用兜底版本继续检查')
			startWith(fallbackVersion())
		}
	}, 2000)
	// #endif
}

/**
 * 打开自定义升级弹窗页（pages-public/app-update）
 * onLaunch 早期页面栈未就绪、首页还可能 redirectTo 到登录页，
 * 因此等页面栈就绪后再导航，并对失败自动重试。
 */
function showUpdatePage(info, force = false) {
	// #ifdef APP-PLUS
	const isForce = !!info.force
	// 「稍后再说」只在本次运行内生效；下次冷启动会重新提醒（手动检查不受限）
	if (!force && !isForce && snoozedVersion && snoozedVersion === String(info.version || '')) {
		return
	}

	uni.setStorageSync(PENDING_UPDATE_KEY, info)
	openUpdatePageWhenReady(0, Date.now() + 1200)
	// #endif
}

/**
 * 等待页面栈就绪后打开升级弹窗，最多重试 12 次。
 * 启动瞬间 getCurrentPages() 可能为空、navigateTo 可能失败，
 * 旧实现只在 fail 时无限重试，页面栈未就绪时会静默丢掉弹窗。
 */
function openUpdatePageWhenReady(retry, notBefore) {
	const delay = Math.max(0, notBefore - Date.now()) || (retry ? 500 : 0)
	setTimeout(() => {
		let pages = []
		try { pages = getCurrentPages() || [] } catch (e) { pages = [] }
		const current = pages.length ? pages[pages.length - 1] : null
		if (current && current.route && current.route.indexOf('app-update') > -1) return
		if (!pages.length && retry < 12) {
			openUpdatePageWhenReady(retry + 1, notBefore)
			return
		}
		uni.navigateTo({
			url: '/pages-public/app-update/app-update',
			fail: (err) => {
				console.warn('[AppUpdate] 打开升级弹窗失败，重试:', err)
				if (retry < 12) setTimeout(() => openUpdatePageWhenReady(retry + 1, notBefore), 500)
			}
		})
	}, delay)
}

/**
 * 清理历史下载的安装包，避免 _doc 目录长期堆积 APK/wgt。
 * 只删除本模块生成的 app_update_<时间戳>.<apk|wgt>，且不动当前包。
 * 纯清理动作，失败静默，不影响主流程。
 */
function cleanupOldPackages(keepPath) {
	// #ifdef APP-PLUS
	try {
		plus.io.resolveLocalFileSystemURL('_doc/', (dir) => {
			const reader = dir.createReader()
			reader.readEntries((entries) => {
				(entries || []).forEach((entry) => {
					if (!entry || !entry.isFile) return
					if (!/^app_update_\d+\.(apk|wgt)$/i.test(entry.name)) return
					if (keepPath && '_doc/' + entry.name === keepPath) return
					entry.remove(() => {}, () => {})
				})
			}, () => {})
		}, () => {})
	} catch (e) {
		// 清理失败不影响下载
	}
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

		// 固定落盘到应用私有目录 _doc 下，文件名带时间戳和正确后缀
		const savePath = `_doc/app_update_${Date.now()}.${ext}`
		cleanupOldPackages(savePath)

		// #ifndef APP-PLUS
		reject(new Error('应用内自动更新仅支持 APP 端'))
		// #endif

		// #ifdef APP-PLUS
		const task = uni.downloadFile({
			url,
			filePath: savePath,
			success: (res) => {
				if (res.statusCode === 200) {
					// 优先使用显式落盘路径，部分基础库只返回 tempFilePath
					resolve(res.filePath || res.tempFilePath || savePath)
				} else {
					reject(new Error('下载失败，HTTP 状态码 ' + res.statusCode))
				}
			},
			fail: (err) => reject(err)
		})
		if (task && task.onProgressUpdate) {
			task.onProgressUpdate((p) => {
				if (typeof onProgress === 'function') onProgress(p.progress)
			})
		}
		// #endif
	})
}

/**
 * Android 8.0+ 需要「允许安装未知应用」运行时权限（仅 APK 整包需要，wgt 不需要）
 * 返回 Promise<boolean>：true 已授权可继续，false 已引导用户去设置
 */
export function ensureInstallPermission() {
	return new Promise((resolve) => {
		// #ifndef APP-PLUS
		resolve(true)
		// #endif
		// #ifdef APP-PLUS
		try {
			const main = plus.android.runtimeMainActivity()
			const Build = plus.android.importClass('android.os.Build')
			if (Build && Build.VERSION && Build.VERSION.SDK_INT >= 26) {
				const pm = main.getPackageManager()
				// canRequestPackageInstalls() 为 Android 8+ PackageManager 实例方法
				const canInstall = pm && typeof pm.canRequestPackageInstalls === 'function'
					? pm.canRequestPackageInstalls()
					: true
				if (!canInstall) {
					const Uri = plus.android.importClass('android.net.Uri')
					const Intent = plus.android.importClass('android.content.Intent')
					const Settings = plus.android.importClass('android.provider.Settings')
					const intent = new Intent(
						Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
						Uri.parse('package:' + main.getPackageName())
					)
					main.startActivity(intent)
					uni.showModal({
						title: '需要安装权限',
						content: '请在设置中允许本应用安装未知来源应用，返回后重新点击「立即更新」即可继续',
						showCancel: false
					})
					resolve(false)
					return
				}
			}
			resolve(true)
		} catch (e) {
			console.warn('[AppUpdate] 安装权限检查失败，直接尝试安装:', e)
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
		// #ifndef APP-PLUS
		reject(new Error('wgt 安装仅支持 APP 端'))
		// #endif
		// #ifdef APP-PLUS
		plus.runtime.install(filePath, { force: false }, () => {
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
 * 安装 APK 整包（拉起系统安装器，由用户确认安装）
 */
export function installApk(filePath) {
	return new Promise((resolve, reject) => {
		// #ifndef APP-PLUS
		reject(new Error('APK 安装仅支持 APP 端'))
		// #endif
		// #ifdef APP-PLUS
		plus.runtime.install(filePath, { force: false }, () => resolve(), (e) => reject(normalizeInstallError(e, filePath)))
		// #endif
	})
}

/**
 * 失败兜底 / 关闭应用内 APK 安装时：跳转浏览器或 App Store
 * @param {string} url 服务端下发的下载地址
 */
export function openInBrowser(url) {
	// #ifdef APP-PLUS
	if (url) plus.runtime.openURL(url)
	// #endif
}
