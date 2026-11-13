/**
 * 直连设备页日志采集器（兼容层）。
 *
 * 缓冲区已上移到 `utils/device-log.js`：连接 / WiFi / 权限链路的底层模块
 * 不能反向依赖页面目录，统一写到中立的总线里，长按顶部打开的面板就能
 * 按时间顺序同时看到 [perf] 性能日志与 [连接]/[权限]/[WiFi] 运行日志。
 * 这里保留 perfLog / getPerfLogs / clearPerfLogs 三个导出，页面无需改动。
 *
 * 性能约定（重要）：只做一次数组 push，不写 storage、不发事件、不触碰
 * 响应式数据、不引入任何跨桥调用，因此不会污染 [perf] 正在测量的耗时。
 * 进程被杀后内存日志自然丢失，属预期行为；需要留存请用面板里的「复制」。
 */

import { logLine, getLogLines, clearLogLines } from '@/utils/device-log.js'

/** 写一条性能日志：控制台（HBuilderX / logcat）与页面内面板同时可见 */
export function perfLog(msg) {
  const text = String(msg)
  try {
    console.log('[perf] ' + text)
  } catch (e) { /* 个别机型 console 被裁剪，不影响采集 */ }
  logLine('perf', text)
}

/**
 * 最新在最上，返回副本，避免面板直接引用内部数组。
 * @param {string} filter 'all'（默认）| 'connect'（只看连接类日志）
 */
export function getPerfLogs(filter) {
  return getLogLines(filter)
}

export function clearPerfLogs() {
  clearLogLines()
}
