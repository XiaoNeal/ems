/**
 * @deprecated 旧版更新入口，业务代码已不再引用（App.vue / about.vue 均使用 utils/appUpdate.js）。
 *
 * 说明（2026-11-09）：业务要求保留「自动更新升级」，完整能力已恢复在 utils/appUpdate.js：
 *   checkAppUpdate / downloadUpdateFile / ensureInstallPermission / installWgt / installApk。
 * 此处保留导出名仅为向后兼容，不再重复实现旧的下载安装逻辑 —— 旧实现同时存在两处缺陷：
 *   1) 读取 res.data.url 而非 res.data.data.url，整包更新地址取不到；
 *   2) 使用已废弃的 serviceiems.gree.com 域名，且无签名校验 / 无进度 / 无失败兜底。
 * 静态扫描仍会扫描本文件，故保持为薄转发层，不含 plus.runtime.install 等重复实现。
 * 详见 .workbuddy/docs/APK安全误报处置方案.md B3 节。
 */
import { checkAppUpdate } from '@/utils/appUpdate.js'

export { checkAppUpdate }

/** 兼容旧调用名：转发到统一的自动更新检查入口 */
export let appUpdate = () => checkAppUpdate()
