/**
 * 设备连接运行日志总线（纯内存，底层模块与页面共用一个缓冲区）。
 *
 * 为什么要抽出来：
 * - `pages/profile/components/direct-device/perf-log.js` 在页面目录下，底层
 *   `service/socket/*` 与 `utils/device-wifi.js` 不能反向依赖页面层；
 * - 现场正式包没有调试控制台，adb logcat 也不方便，长按直连页顶部打开的
 *   那个日志面板是唯一能直接看的窗口。连接/WiFi/权限链路的日志必须和
 *   [perf] 性能日志落在同一个缓冲区里，才能按时间顺序对上。
 *
 * 性能约定（重要）：只做一次数组 push + 一次字符串拼接，不写 storage、
 * 不发事件、不触碰响应式数据、不调 console（APP 端 console 要过原生日志桥）。
 * 因此禁止在收包 / readLoop 等热路径调用；只允许连接生命周期这类低频事件
 * 打点（一次连接约 10~20 条）。进程被杀后内存日志自然丢失，属预期行为。
 */

const MAX_LINES = 300
const lines = []

function pad(n, width) {
  let s = String(n)
  while (s.length < width) s = '0' + s
  return s
}

function stamp() {
  const d = new Date()
  return pad(d.getHours(), 2) + ':' + pad(d.getMinutes(), 2) + ':' +
    pad(d.getSeconds(), 2) + '.' + pad(d.getMilliseconds(), 3)
}

/**
 * 写一条运行日志。
 * @param {string} tag 分类标签，如 'perf' | '权限' | 'WiFi' | '连接' | '网络'
 * @param {string} msg 日志内容（面向现场排障，可含底层信息；不要直接用作用户提示）
 */
export function logLine(tag, msg) {
  let text
  try {
    text = String(msg)
  } catch (e) {
    return
  }
  lines.push(stamp() + ' [' + String(tag || '日志') + '] ' + text)
  if (lines.length > MAX_LINES) lines.splice(0, lines.length - MAX_LINES)
}

/**
 * 最新在最上，返回副本，避免面板直接引用内部数组。
 * @param {string} filter 'all'（默认）| 'connect'（只看连接类，排除 perf）
 */
export function getLogLines(filter) {
  const all = lines.slice().reverse()
  if (filter === 'connect') {
    return all.filter(line => line.indexOf('[perf]') < 0)
  }
  return all
}

export function clearLogLines() {
  lines.length = 0
}
