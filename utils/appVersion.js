/**
 * 全局版本号「唯一数据源」（Single Source of Truth）
 *
 * 【问题背景】
 *   关于页（pages/profile/about.vue）原先两端取值方式不同：
 *     - APP 端：plus.runtime.getProperty 读取运行时资源包版本（wgt 版本，会随热更新变化）
 *     - 小程序端：读取构建期注入的 APP_VERSION
 *   但本项目是 HBuilderX 工程（根目录没有 vue.config.js / chainWebpack），
 *   APP_VERSION 永远不会被注入，小程序端只能落到硬编码兜底值 'V1.0.13'，
 *   而 manifest.json 的 versionName 已是 V1.0.15，
 *   于是出现「APP 显示 V1.0.15 / 微信小程序显示 V1.0.13」的两端版本不一致。
 *
 * 【发版检查清单（三处必须同步，缺一就会「关于我们」显示旧版本号）】
 *   1. 本文件的 APP_VERSION / APP_VERSION_CODE；
 *   2. manifest.json 的 versionName / versionCode（APP 运行时读的就是它）；
 *   3. CHANGELOG.md 新增对应版本条目；微信小程序还要在「微信公众平台-版本管理」
 *      提交相同版本号。
 *   2026-11-12 曾把 manifest 升到 V1.0.17/188 却漏改本文件，
 *   导致小程序「关于我们」仍显示 V1.0.16，与此同因。
 *
 * 【使用规范】
 *   - 所有需要展示、上报版本号的地方统一 import 本模块，禁止再在页面里写死版本号；
 *   - 各端展示格式统一为 "V主版本.次版本.修订号"（如 V1.0.19），不带空格、大小写统一。
 */

/** 展示用版本号（含 V 前缀，必须与 manifest.json 的 versionName 一致） */
export const APP_VERSION = 'V1.0.19'

/** 版本序号（必须与 manifest.json 的 versionCode 一致，用于整包 / wgt 升级比较） */
export const APP_VERSION_CODE = 190

/** 去掉 V/v 前缀，得到纯数字版本号：V1.0.19 -> 1.0.19 */
export function toPlainVersion(version = APP_VERSION) {
	return String(version).replace(/^[Vv]/, '')
}

/** 规范化展示版本号：1.0.19 / v1.0.19 / V1.0.19 -> V1.0.19 */
export function formatVersion(version = APP_VERSION) {
	const plain = toPlainVersion(version)
	return plain ? 'V' + plain : APP_VERSION
}

/**
 * 同步取版本号（不做运行时修正），用于首屏占位渲染，保证页面不会出现空白
 * @returns {string} 展示用版本号
 */
export function getAppVersionSync() {
	return formatVersion(APP_VERSION)
}

/**
 * 获取当前版本号（各端返回值一致，统一带 V 前缀）
 *
 * - APP 端：优先取运行时资源包版本（wgt 热更新后依然准确），异常时回退常量；
 *   注意该值来自打包时的 manifest.json，旧安装包仍会显示旧版本号，需重新打包安装；
 * - 小程序 / H5 端：直接取常量（小程序无本地版本概念，只能与源码常量保持一致）。
 *
 * @returns {Promise<string>} 展示用版本号，如 'V1.0.19'
 */
export function getAppVersion() {
	// #ifdef APP-PLUS
	return new Promise((resolve) => {
		try {
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
				const runtimeVersion = widgetInfo && widgetInfo.version ? String(widgetInfo.version) : ''
				resolve(formatVersion(runtimeVersion || APP_VERSION))
			})
		} catch (e) {
			console.warn('[AppVersion] 读取运行时版本失败，回退常量:', e)
			resolve(formatVersion(APP_VERSION))
		}
	})
	// #endif

	// #ifndef APP-PLUS
	return Promise.resolve(formatVersion(APP_VERSION))
	// #endif
}
