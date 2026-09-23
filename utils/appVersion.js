/**
 * 全局版本号「唯一数据源」（Single Source of Truth）
 *
 * 【问题背景 / 本次修复说明】
 *   关于页（pages/profile/about.vue）原先两端取值方式不同：
 *     - APP 端：plus.runtime.getProperty 读取运行时资源包版本（wgt 版本，会随热更新变化）
 *     - 小程序端：读取构建期注入的 APP_VERSION
 *   但本项目是 HBuilderX 工程（根目录没有 vue.config.js / chainWebpack），
 *   APP_VERSION 永远不会被注入，小程序端只能落到硬编码兜底值 'V1.0.13'，
 *   而 manifest.json 的 versionName 已是 V1.0.15，
 *   于是出现「APP 显示 V1.0.15 / 微信小程序显示 V1.0.13」的两端版本不一致。
 *
 * 【使用规范】
 *   1. 所有需要展示、上报版本号的地方统一 import 本模块，禁止再在页面里写死版本号；
 *   2. 发版时只改下面两个常量，并同步 manifest.json：
 *        manifest.json -> versionName = APP_VERSION
 *        manifest.json -> versionCode = APP_VERSION_CODE
 *      微信小程序还需在「微信公众平台 - 版本管理」提交相同的版本号；
 *   3. 各端展示格式统一为 "V主版本.次版本.修订号"（如 V1.0.15），不带空格、大小写统一。
 */

/** 展示用版本号（含 V 前缀，必须与 manifest.json 的 versionName 一致） */
export const APP_VERSION = 'V1.0.15'

/** 版本序号（必须与 manifest.json 的 versionCode 一致，用于整包 / wgt 升级比较） */
export const APP_VERSION_CODE = 186

/** 去掉 V/v 前缀，得到纯数字版本号：V1.0.15 -> 1.0.15 */
export function toPlainVersion(version = APP_VERSION) {
	return String(version).replace(/^[Vv]/, '')
}

/** 规范化展示版本号：1.0.15 / v1.0.15 / V1.0.15 -> V1.0.15 */
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
 * - 小程序 / H5 端：直接取常量（小程序无本地版本概念，只能与源码常量保持一致）。
 *
 * @returns {Promise<string>} 展示用版本号，如 'V1.0.15'
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
