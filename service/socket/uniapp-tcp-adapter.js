/**
 * uni-app TCP Socket 适配器
 *
 * 把原生 TCP Socket 封装成与 UniappWebSocketAdapter 相同的 WHATWG WebSocket 风格接口，
 * 这样 light-mqtt-client.js 可以无差别使用 TCP 或 WebSocket 传输 MQTT 报文。
 *
 * 平台支持：
 *   - 微信小程序 (基础库 >= 2.7.0)：wx.createTCPSocket() 原生 TCP
 *   - App (Android/iOS)：通过 UTS 插件或降级 WebSocket
 *   - H5：降级 WebSocket
 */

// WHATWG WebSocket readyState 常量（与 UniappWebSocketAdapter 保持一致）
import { logLine } from '../../utils/device-log.js'

const CONNECTING = 0
const OPEN = 1
const CLOSING = 2
const CLOSED = 3

/**
 * APP(Android) plus.android 读取循环的空闲轮询间隔（毫秒）。
 *
 * 「APP 切 tab 偶发 0.6~1.6s 冻结」的根因已由 11:08 真机日志定量确认：
 * 小程序走 wx.createTCPSocket 的事件回调，收数据不占 JS 线程；APP 无该 API，
 * 降级到 plus.android Java Socket，由 JS 轮询 available()，再对收到的每个字节
 * 调用一次 read() —— 全是同步 JS↔原生桥调用。日志显示 桥读≈4000/s 而
 * TCP轮询只有 1~19/s，即单次 readLoop 一次连续做了几千次桥调用，构成 1 秒级
 * 同步长任务；切 tab 的 render patch 排在它后面，就被记成 1461/1538ms 全在
 * 「patch 段」。不是 V8 GC，也不是 Vue/DOM 规模。
 *
 * 128B 切片把「秒级」长任务切碎了，但**不减少桥调用总量**：手机越慢，单次
 * 桥调用越贵，128 次连续桥调用仍可能是上百毫秒的同步阻塞；20ms 空闲轮询
 * 也在持续吃 CPU。这正是「配置差的手机仍然卡」的原因（2026-11-13 处置）。
 */
const TCP_POLL_INTERVAL_MS = 20

/**
 * 单片字节上限（同时是自适应上限）。
 * LightMqttClient._onSocketMessage 有 _recvBuffer 按 MQTT 固定头组包、不足即
 * break 等下一片，任意分片安全；每片仍是一次 available 区间内的连续字节，顺序不变。
 * A/B：TCP_ADAPTIVE_LIMIT=false + 改 8192 = 复现旧的 1.5s 冻结。
 */
const TCP_MAX_READ_PER_TICK = 128

/* ================== 低端机自适应降负载（2026-11-13，仅 APP Java Socket 路径） ================== */

/** 自适应总开关：false = 完全回到「固定 128B + 20ms 轮询」的已验证路径（诊断/一键回退） */
const TCP_ADAPTIVE_LIMIT = true

/** 单片同步段的时间预算（ms）：≈60FPS 一帧的 3/4，给点击与 render 留出余量 */
const TCP_TICK_BUDGET_MS = 12

/** 单片字节下限：再小会被嵌套 setTimeout 的 4ms clamp 拖垮吞吐，反而造成积压 */
const TCP_MIN_READ_PER_TICK = 12

/** 空闲退避阶梯（ms）：连续读不到数据逐级放宽，一有数据立刻回到首档续读 */
const TCP_IDLE_BACKOFF_MS = [20, 40, 70, 100]

/**
 * 每字节桥调用耗时（ms）→ 性能档位：0 高端/未测（128B 片 <6ms）、1 中（6~13ms）、
 * 2 低端（>13ms，已超出单片预算、肉眼掉帧）。档位由 readLoop 实测得出，
 * 页面据此降低屏刷频率；只有档位 2 才尝试批量读，中高端机维持已验证路径。
 */
const TCP_TIER_COST_MS = [0.05, 0.10]

/**
 * 低端机批量读总开关 —— **默认关闭（2026-11-13 真机回归后回退）**。
 *
 * 设想是用 Java byte[] 一次 read(byte[],0,n) + android.util.Base64 一次回传，
 * 把 128B 的桥调用从 128 次降到 3 次。但真机（09:26 日志）出现「CONNACK 成功、
 * 之后一帧数据都没有、无任何异常」：零消费探测只验证了「byte[] 参数被接受」
 * 和「能编码 buf」，**没验证 read() 是否真的写回了 JS 持有的那个数组**。
 * 在 plus.android 的 Java byte[] 传出参数不生效的 ROM 上（首连同批日志已报
 * `Cannot read property '__TYPE__' of null`，桥接层对 Java 对象传参本就不稳），
 * read() 会消费掉流里的字节、返回 n，buf 却仍是探测时的填充值 0x41；
 * 长度校验通过 → 不抛异常 → MQTT 层把 0x41 当 PUBACK 静默丢弃，数据全丢。
 *
 * 因此默认关闭，所有机型回到已验证的逐字节 read(int) 路径。
 * 若要在某台已验证可用的设备上做 A/B，把本开关改 true；启用后仍需通过
 * readBulk 的「填充残留检测」，并在 [perf] 面板确认「桥调用/s」确实下降。
 * 根治方向仍是 UTS/Android 原生按帧回调或 Broker 开 WebSocket，别再赌 byte[] 桥。
 */
const TCP_BULK_READ = false

/** 热路径调试日志总开关：正式包必须关闭（每条 console.log 都要过一次原生日志桥） */
const TCP_DEBUG_LOG = false

/**
 * 供页面 [perf] 面板读取的统计（普通对象，非响应式、不发事件、不跨桥）。
 * 每 10s 由 direct-device.vue 的 _maybePerfReport 读出并清零计数类字段。
 * reads = 估算的 JS↔原生桥调用次数（逐字节路径≈字节数；批量读路径≈3/片），
 *         这样「桥读/s」在两种路径下可直接对比：生效后应从 ~4000/s 降到 ~100/s。
 * tier / limit / bulk / tickMs 是状态量，不清零。
 */
export const tcpReadStats = {
  polls: 0, reads: 0, bytes: 0, chunks: 0, maxPerTick: 0, longTasks: 0,
  tickMs: 0, limit: TCP_ADAPTIVE_LIMIT ? 32 : TCP_MAX_READ_PER_TICK, tier: 0, bulk: 0, errors: 0
}

/** 0=高端/未测 1=中 2=低端。页面据此调屏刷频率；未走 Java Socket 时恒为 0，行为不变 */
export function getTcpPerfTier() {
  return tcpReadStats.tier || 0
}

/* ---------- 批量读：Java byte[] → Base64 字符串 → Uint8Array（纯 JS，不依赖 atob） ---------- */
const B64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const B64_LOOKUP = (() => {
  const t = new Int16Array(128)
  for (let i = 0; i < 128; i++) t[i] = -1
  for (let i = 0; i < 64; i++) t[B64_ALPHABET.charCodeAt(i)] = i
  return t
})()

function b64val(s, i) {
  const c = s.charCodeAt(i)
  return c < 128 ? B64_LOOKUP[c] : -1
}

/** 把 android.util.Base64(NO_WRAP) 产出的字符串解进 out，返回解出的字节数 */
function decodeBase64Into(s, out) {
  let o = 0
  const cap = out.length
  for (let i = 0; i + 3 < s.length && o < cap; i += 4) {
    const c0 = b64val(s, i)
    const c1 = b64val(s, i + 1)
    if (c0 < 0 || c1 < 0) break
    out[o++] = ((c0 << 2) | (c1 >> 4)) & 0xff
    if (s.charCodeAt(i + 2) !== 61) {
      const c2 = b64val(s, i + 2)
      if (c2 < 0 || o >= cap) break
      out[o++] = (((c1 & 15) << 4) | (c2 >> 2)) & 0xff
      if (s.charCodeAt(i + 3) !== 61) {
        const c3 = b64val(s, i + 3)
        if (c3 < 0 || o >= cap) break
        out[o++] = (((c2 & 3) << 6) | c3) & 0xff
      }
    }
  }
  return o
}

/** 检查当前平台是否支持原生 TCP Socket */
function isTcpAvailable() {
  // 微信小程序：wx.createTCPSocket (基础库 >= 2.7.0)
  if (typeof wx !== 'undefined' && wx && typeof wx.createTCPSocket === 'function') {
    console.log('[TCP] wx.createTCPSocket 可用')
    return true
  }
  // uni-app App 端：uni.createTCPSocket (HBuilderX 3.x+)
  if (typeof uni !== 'undefined' && uni && typeof uni.createTCPSocket === 'function') {
    console.log('[TCP] uni.createTCPSocket 可用')
    return true
  }
  // uni-app App 端：plus.android 调用 Java Socket
  if (typeof plus !== 'undefined' && plus.android) {
    console.log('[TCP] plus.android 可用，可尝试 Java Socket')
    return true
  }
  console.log('[TCP] 原生 TCP Socket 不可用, wx=', typeof wx, 'uni=', typeof uni, 'plus=', typeof plus)
  logLine('网络', '当前平台无可用原生 TCP 通道')
  return false
}

export class UniappTcpAdapter {
  /**
   * @param {string} url 形如 tcp://192.168.1.33:1883
   */
  constructor(url, protocols, options) {
    // 解析 host:port
    const m = /^tcp:\/\/([^:\/]+):(\d+)/i.exec(url || '')
    if (!m) {
      throw new Error('TCP URL 格式错误，应为 tcp://host:port')
    }
    this.host = m[1]
    this.port = parseInt(m[2], 10)

    if (!isTcpAvailable()) {
      throw new Error('当前平台不支持原生 TCP Socket，请使用微信小程序（基础库 >= 2.7.0）或 App 构建')
    }

    this.url = url
    this.protocols = protocols
    this.readyState = CONNECTING
    this.binaryType = 'arraybuffer'
    this.bufferedAmount = 0
    this.extensions = ''
    this.protocol = ''

    this.onopen = null
    this.onmessage = null
    this.onclose = null
    this.onerror = null
    this._tcpSocket = null
    this._javaSocket = null
    this._listeners = { open: [], message: [], close: [], error: [] }

    try {
      // 优先用 wx/uni.createTCPSocket（微信小程序 & HBuilderX App）
      const tcpFactory = (typeof wx !== 'undefined' && wx && wx.createTCPSocket)
        ? wx.createTCPSocket.bind(wx)
        : (typeof uni !== 'undefined' && uni && uni.createTCPSocket)
          ? uni.createTCPSocket.bind(uni)
          : null

      if (tcpFactory) {
        let sock = null
        try {
          sock = tcpFactory()
        } catch (e) {
          // 微信在并发数超限时抛 "[TCPSocket] created too much."
          this.readyState = CLOSED
          logLine('网络', 'TCPSocket 创建抛异常：' + String((e && (e.message || e.errMsg)) || e))
          throw new Error('TCPSocket 创建失败：' + ((e && (e.message || e.errMsg)) || e))
        }
        // 配额耗尽时 createTCPSocket 可能返回 undefined，必须先校验再绑定事件，
        // 否则会变成 "Cannot read property 'onConnect' of undefined"
        if (!sock || typeof sock.onConnect !== 'function') {
          try { sock && typeof sock.close === 'function' && sock.close() } catch (e) {}
          this.readyState = CLOSED
          throw new Error('TCPSocket 创建失败：未返回有效实例（并发连接数已达上限 5 个），请关闭其他页面或重启小程序')
        }
        this._tcpSocket = sock
        console.log('[TCP] Socket 创建成功(wx/uni), 连接', this.host + ':' + this.port)
        logLine('网络', 'TCPSocket 创建成功，连接 ' + this.host + ':' + this.port)
        this._bindWxTcpEvents()
        try {
          sock.connect({ address: this.host, port: this.port })
        } catch (e) {
          this._closeUnderlying()
          this.readyState = CLOSED
          throw new Error('TCPSocket connect 失败：' + ((e && (e.message || e.errMsg)) || e))
        }
      } else if (typeof plus !== 'undefined' && plus.android) {
        // App 端降级：用 Java Socket
        console.log('[TCP] 使用 plus.android Java Socket, 连接', this.host + ':' + this.port)
        logLine('网络', 'App 端使用 Java Socket 连接 ' + this.host + ':' + this.port)
        this._connectWithPlusAndroid()
      } else if (typeof plus !== 'undefined' && plus.ios) {
        // iOS 端：用 OC Socket
        console.log('[TCP] 使用 plus.ios Socket, 连接', this.host + ':' + this.port)
        this._connectWithPlusIOS()
      } else {
        throw new Error('当前平台无可用 TCP API (wx/uni/plus 均不可用)')
      }
    } catch (e) {
      this.readyState = CLOSED
      const msg = String((e && (e.message || e.errMsg)) || e)
      // 传输层创建失败属于致命错误：向上抛，交由 createTransport 决定是否降级 / 上报
      // （不能吞掉后异步 fire error，否则调用方会拿到一个永远连不上的“空壳”适配器）
      if (/^TCPSocket 创建失败|^TCPSocket connect 失败|当前平台无可用 TCP API/.test(msg)) {
        this._closeUnderlying()
        throw new Error(msg)
      }
      setTimeout(() => this._fire('error', { type: 'error', message: msg }), 0)
    }
  }

  /** 绑定 wx/uni TCPSocket 事件 */
  _bindWxTcpEvents() {
    this._tcpSocket.onConnect(() => {
      console.log('[TCP] onConnect 触发!')
      logLine('网络', 'TCP 已连上设备（onConnect）')
      this.readyState = OPEN
      this._fire('open', { type: 'open' })
    })

    this._tcpSocket.onMessage((res) => {
    
      
      let payload = res && res.message
      if (payload && typeof payload === 'object' && typeof payload.byteLength === 'number') {
        try {
          if (ArrayBuffer.isView(payload)) {
            payload = new Uint8Array(payload.buffer, payload.byteOffset, payload.byteLength)
          } else {
            payload = new Uint8Array(payload)
          }
        } catch (e) {
          console.error('[TCP] Uint8Array 转换失败:', e.message)
        }
      }
        // console.log( payload)
      this._fire('message', { type: 'message', data: payload })
    })

    this._tcpSocket.onClose((res) => {
      console.log('[TCP] onClose, res=', JSON.stringify(res))
      logLine('网络', 'TCP 连接关闭')
      this.readyState = CLOSED
      this._fire('close', { type: 'close', code: res && res.code, reason: res && res.reason, wasClean: true })
    })

    this._tcpSocket.onError((err) => {
      const msg = (err && (err.errMsg || err.message || err.errCode))
        ? String(err.errMsg || err.message || err.errCode)
        : 'TCP socket error'
      console.log('[TCP] onError:', msg, JSON.stringify(err))
      // 这一条是现场判权限问题的关键：无「附近的设备」权限时，
      // 系统常回 EACCES / ENETUNREACH / EHOSTUNREACH / permission denied。
      logLine('网络', 'TCP 错误：' + msg)
      if (this.readyState === CONNECTING) {
        this.readyState = CLOSED
      }
      this._fire('error', { type: 'error', message: msg })
    })
  }

  /** App 端 plus.android Java Socket 连接 */
  _connectWithPlusAndroid() {
    const startedAt = Date.now()
    try {
      const Socket = plus.android.importClass('java.net.Socket')
      const InetSocketAddress = plus.android.importClass('java.net.InetSocketAddress')

      const socket = new Socket()
      // 3 秒连接超时
      const addr = new InetSocketAddress(this.host, this.port)
      socket.connect(addr, 3000)

      // 关键：先把 Socket/InputStream/OutputStream 全量 importClass
      // 让所有方法直接桥接，以后 obj.method() 直接调，不用 plus.android.invoke
      plus.android.importClass(socket)
      this._javaSocket = socket
      this._javaInput = socket.getInputStream()
      this._javaOutput = socket.getOutputStream()
      plus.android.importClass(this._javaInput)
      plus.android.importClass(this._javaOutput)

      // 设置读取超时
      socket.setSoTimeout(2000)   // 2 秒超时，避免阻塞
      socket.setTcpNoDelay(true)

      console.log('[TCP] plus.android Socket 连接成功, isConnected=' + socket.isConnected())
      logLine('网络', 'Java Socket 已连上设备，isConnected=' + socket.isConnected())
      this.readyState = OPEN

      const _this = this
      setTimeout(() => {
        console.log('[TCP] plus.android 异步触发 open')
        _this._fire('open', { type: 'open' })
        _this._startAndroidReadLoop()
      }, 10)
    } catch (e) {
      const errMsg = String((e && e.message) || e)
      const elapsed = Date.now() - startedAt
      const isBridgeError = errMsg.indexOf('__TYPE__') >= 0
      // Android 刚进页面时 plus.android 桥接层偶发未就绪，会报
      // "Cannot read property '__TYPE__' of null"（09:26 真机首连日志）。
      // 这类是「毫秒级」的瞬时失败：重建一次即可，同一实例只重试一次。
      //
      // 但 14:30 真机日志是另一种情况：每次都恰好 3s（= socket.connect 的
      // 超时）才报同一个 __TYPE__ 错误。这是 Java Socket 连设备超时后，桥接层
      // 包装异常对象时读到 null 的 __TYPE__ 产生的「次生错误」，真因是设备
      // 192.168.88.1:1883 没有响应。这时再重建一次只会又白等 3s，把单次连接
      // 拖到 6s，正好撞上 MqttDirectClient 的 APP 6s 首连超时，形成死循环。
      // 因此只有快速失败才按「桥未就绪」重建；慢失败直接按普通错误上报。
      if (isBridgeError && elapsed < 1500 && !this._androidBridgeRetried) {
        this._androidBridgeRetried = true
        logLine('网络', '原生桥对象为空（' + elapsed + 'ms），立即重建一次连接')
        try { this._closeUnderlying() } catch (e2) {}
        return this._connectWithPlusAndroid()
      }
      console.error('[TCP] plus.android 连接失败:', errMsg)
      // 权限提示只在错误里真的含系统拒绝码时追加。以前无条件拼上
      // 「若含 EACCES / permission denied，多为附近的设备权限被禁」，现场据此
      // 去改权限是无效的，反而掩盖了「设备没响应 / 桥接异常」这两类真因。
      let hint = ''
      if (/EACCES|permission denied|EPERM/i.test(errMsg)) {
        hint = '（系统拒绝访问，多为「附近的设备」权限被禁，请到系统设置里开启）'
      } else if (isBridgeError && elapsed >= 1500) {
        hint = '（耗时 ' + elapsed + 'ms ≈ 连接超时，设备未响应；桥接层异常为次生错误，非权限问题）'
      } else if (isBridgeError) {
        hint = '（原生桥对象为空，非权限问题）'
      }
      logLine('网络', 'Java Socket 连接失败（' + elapsed + 'ms）：' + errMsg + hint)
      this.readyState = CLOSED
      // 构造函数里同步 fire('error') 一定会被丢：上层要等 createTransport()
      // 返回后才赋 ws.onerror，此刻监听器还没挂上（真机日志表现为「Java Socket
      // 连接失败」之后紧接着才「原生 TCP 通道已创建」，随后干等 6s 连接超时）。
      // 改到下一个任务再发，LightMqttClient 才能立刻 reject 并排重连。
      setTimeout(() => {
        this._fire('error', { type: 'error', message: 'Android Socket 连接失败: ' + errMsg })
      }, 0)
    }
  }

  /**
   * plus.android 读取循环 —— 自适应长任务切片 + 空闲退避 + 低端机批量读。
   * 仅 APP(Android) Java Socket 路径调用；小程序走 wx/uni TCPSocket 事件回调，一行不碰。
   */
  _startAndroidReadLoop() {
    const _this = this
    let loopCount = 0
    // 首片保守起步：还没测出这台机器的桥调用成本时，弱机上直接读满 128B
    // 会形成一次百毫秒级长任务。2 片内自适应就会把上限调到实测值。
    let limit = TCP_ADAPTIVE_LIMIT ? 32 : TCP_MAX_READ_PER_TICK
    let idleLevel = 0
    let starvation = 0
    let lastAvailable = 0
    let sampleMs = 0
    let sampleBytes = 0
    let costEma = 0
    // 复用写缓冲：每片只 slice 一次，热路径不再产生 [] + push + new Uint8Array 两次分配
    const scratch = new Uint8Array(TCP_MAX_READ_PER_TICK)
    // 批量读状态：0=未探测 1=启用 -1=探测失败/运行异常（永久回退逐字节）
    let bulk = 0
    let javaBuf = null
    let base64Cls = null
    let base64ClsTried = false

    if (TCP_DEBUG_LOG) {
      console.log('[TCP] readLoop 启动, 轮询=' + TCP_POLL_INTERVAL_MS +
        'ms, 单片上限=' + TCP_MAX_READ_PER_TICK + 'B, 自适应=' + TCP_ADAPTIVE_LIMIT)
    }

    /**
     * 零消费探测：确认 byte[] 参数能被桥接受、read(byte[],int,int) 重载可调用、
     * Base64 能把整片编码回 JS。任一步不符就返回 null，永久回退逐字节路径。
     * read(buf,0,0) 按 Java InputStream 规范直接返回 0，不会消费任何字节，
     * 所以探测失败也绝不会丢数据。
     */
    function probeBulkRead() {
      if (typeof plus === 'undefined' || !plus.android) return null
      try {
        const seed = new Array(TCP_MAX_READ_PER_TICK + 1).join('A')
        const jStr = plus.android.newObject('java.lang.String', seed)
        const buf = plus.android.invoke(jStr, 'getBytes')
        if (!buf) return null
        if (Number(plus.android.invoke(_this._javaInput, 'read', buf, 0, 0)) !== 0) return null
        if (!base64ClsTried) {
          base64ClsTried = true
          try { base64Cls = plus.android.importClass('android.util.Base64') } catch (e) { base64Cls = null }
        }
        let encoded = null
        if (base64Cls) {
          try { encoded = plus.android.invoke(base64Cls, 'encodeToString', buf, 0, 1, 2) } catch (e) {}
        }
        if (encoded == null) {
          try { encoded = plus.android.invoke('android.util.Base64', 'encodeToString', buf, 0, 1, 2) } catch (e) {}
        }
        // buf 全 'A'(0x41)，单字节 NO_WRAP(2) 编码应恰为 'QQ=='
        if (String(encoded).replace(/\s/g, '') !== 'QQ==') return null
        return buf
      } catch (e) {
        if (TCP_DEBUG_LOG) console.log('[TCP] 批量读探测失败：' + ((e && e.message) || e))
        return null
      }
    }

    /** 一次 read(byte[]) + 一次 Base64 回传，替代 n 次逐字节 read() */
    function readBulk(n) {
      const got = Number(plus.android.invoke(_this._javaInput, 'read', javaBuf, 0, n))
      if (!(got > 0)) return 0
      let b64 = null
      if (base64Cls) {
        try { b64 = plus.android.invoke(base64Cls, 'encodeToString', javaBuf, 0, got, 2) } catch (e) {}
      }
      if (b64 == null) b64 = plus.android.invoke('android.util.Base64', 'encodeToString', javaBuf, 0, got, 2)
      const decoded = decodeBase64Into(String(b64).replace(/[\r\n\s]/g, ''), scratch)
      // 长度不符说明该 ROM 的编码链路有差异；抛出去由外层断线重建，绝不静默喂错位字节
      if (decoded !== got) throw new Error('批量读数据长度不符')
      // 必须验证 read() 真的写回了 JS 持有的 byte[]：plus.android 上「返回 n 但 buf
      // 没变」是静默失败，整片会保持探测时的填充值 0x41，喂给 MQTT 后被当 PUBACK
      // 丢弃，表现为「已连接、一帧数据都没有」。真实帧首字节是 0x20/0x30/0x90…，
      // 整片全 0x41 只可能是填充残留；宁可误判回退，也不能静默吞数据。
      if (decoded > 3) {
        let allSeed = true
        for (let i = 0; i < decoded; i++) {
          if (scratch[i] !== 0x41) { allSeed = false; break }
        }
        if (allSeed) throw new Error('批量读未写回缓冲区')
      }
      return decoded
    }

    function readByteByByte(n) {
      let count = 0
      for (let i = 0; i < n; i++) {
        const b = _this._javaInput.read()   // 无参 read() 逐字节读，返回 0-255 或 -1
        if (b === -1) break
        scratch[count++] = b & 0xff
      }
      return count
    }

    function readLoop() {
      if (_this.readyState !== OPEN || !_this._javaInput) {
        if (TCP_DEBUG_LOG) console.log('[TCP] readLoop 退出, readyState=' + _this.readyState)
        return
      }
      try {
        loopCount++
        tcpReadStats.polls++
        const t0 = Date.now()
        const available = Number(_this._javaInput.available())
        let toRead = 0
        let readBytes = 0
        let bridgeCalls = 0

        if (available > 0) {
          idleLevel = 0
          // 只取一片，绝不在一次同步任务里连做几千次桥调用
          toRead = Math.min(available, limit)
          if (bulk === 1) {
            readBytes = readBulk(toRead)
            bridgeCalls = 3                    // available + read(byte[]) + encodeToString
          } else {
            readBytes = readByteByByte(toRead)
            bridgeCalls = 1 + readBytes        // available + 每字节一次 read
          }
        } else if (TCP_ADAPTIVE_LIMIT && idleLevel < TCP_IDLE_BACKOFF_MS.length - 1) {
          // 空闲越久轮询越稀：低端机空闲期桥调用从 50/s 降到 10/s
          idleLevel++
        }

        // 只量「读取段」，不含下面的 message 分发（分发耗时由页面侧的提交节流负责）
        const elapsed = Date.now() - t0

        if (readBytes > 0) {
          tcpReadStats.reads += bulk === 1 ? bridgeCalls : readBytes
          tcpReadStats.bytes += readBytes
          if (readBytes > tcpReadStats.maxPerTick) tcpReadStats.maxPerTick = readBytes
          if (bulk !== 1 && readBytes > TCP_MAX_READ_PER_TICK) tcpReadStats.longTasks++
          tcpReadStats.chunks++
          tcpReadStats.tickMs = elapsed
          // ⚡ 正式包关闭：以前每片都要 slice().map().join() 拼一段 hex 再走一次原生日志桥。
          if (TCP_DEBUG_LOG) {
            console.log('[TCP] 收到 ' + readBytes + 'B, hex: ' +
              Array.from(scratch.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' '))
          }
          _this._fire('message', { type: 'message', data: scratch.slice(0, readBytes) })
        }

        // ---- 自适应：按实测「每字节同步段耗时」把单片压进 12ms 预算 ----
        if (TCP_ADAPTIVE_LIMIT && readBytes > 0) {
          sampleMs += elapsed
          sampleBytes += readBytes
          // 累计到 24ms / 64B 再更新，避开 Date.now() 在单片上的 1ms 量化噪声
          if (sampleMs >= 24 || sampleBytes >= 64) {
            const cost = sampleMs / Math.max(1, sampleBytes)
            costEma = costEma ? costEma * 0.75 + cost * 0.25 : cost
            sampleMs = 0
            sampleBytes = 0

            // 只有「积压还在增长」才说明读速追不上、片太小被 setTimeout clamp 卡住了，
            // 这时才逐步放宽预算。若只判「有积压」，设备一秒内正常突发就会把片推回
            // 128B，让 12ms 预算形同虚设。
            starvation = (available > toRead && available >= lastAvailable)
              ? Math.min(4, starvation + 1)
              : Math.max(0, starvation - 1)
            // 批量读探测失败（永久逐字节）时基准预算加倍：低端机逐字节本就吃紧，
            // 宁可单片稍长也要先把数据读出来，避免 TCP 缓冲持续积压。
            const baseBudget = bulk === -1 ? TCP_TICK_BUDGET_MS * 2 : TCP_TICK_BUDGET_MS
            const budget = baseBudget + starvation * 3
            const next = Math.round(budget / Math.max(0.001, costEma))
            limit = Math.max(TCP_MIN_READ_PER_TICK, Math.min(TCP_MAX_READ_PER_TICK, next))
            tcpReadStats.limit = limit
            tcpReadStats.tier = costEma >= TCP_TIER_COST_MS[1] ? 2
              : (costEma >= TCP_TIER_COST_MS[0] ? 1 : 0)

            // 只在低端机尝试批量读：高端机维持已验证的逐字节路径不动。
            // 探测零消费，失败永久回退，最差也只是回到本次优化前的调度方式。
            if (bulk === 0 && TCP_BULK_READ && tcpReadStats.tier === 2) {
              javaBuf = probeBulkRead()
              bulk = javaBuf ? 1 : -1
              tcpReadStats.bulk = bulk
              if (TCP_DEBUG_LOG) console.log('[TCP] 批量读' + (bulk === 1 ? '启用' : '不可用，回退逐字节'))
            }
          }
        }

        if (TCP_DEBUG_LOG && (loopCount <= 3 || loopCount % 200 === 0)) {
          console.log('[TCP] readLoop #' + loopCount + ' available=' + available +
            ', limit=' + limit + ', tier=' + tcpReadStats.tier + ', bulk=' + bulk)
        }
        // 还有积压 → 让出一次事件循环后立刻续读（setTimeout 0 在嵌套调用里会被
        // clamp 到 ≥4ms，足够让点击 / Vue nextTick(microtask) 插进来）；空闲才退避轮询。
        // 本次一字节都没读到（read() 提前返回 -1 等）时不按积压处理，避免 0ms 忙循环。
        const hasBacklog = readBytes > 0 && available > toRead
        lastAvailable = available
        const idleMs = TCP_ADAPTIVE_LIMIT ? TCP_IDLE_BACKOFF_MS[idleLevel] : TCP_POLL_INTERVAL_MS
        setTimeout(readLoop, hasBacklog ? 0 : idleMs)
      } catch (e) {
        const msg = (e && e.message) || String(e)
        // 批量读异常不能吞：字节可能已从流里取走，继续读会把错位数据喂给 MQTT。
        // 永久回退并断开，由上层重连重建一条干净的连接。
        if (bulk === 1) {
          bulk = -1
          javaBuf = null
          tcpReadStats.bulk = -1
          tcpReadStats.errors++
          logLine('网络', '批量读异常，已回退逐字节并重建连接：' + msg)
          _this.readyState = CLOSED
          _this._fire('error', { type: 'error', message: '设备连接已断开，请重新连接后重试' })
          _this._fire('close', { type: 'close', wasClean: false })
          return
        }
        if (msg.indexOf('SocketTimeout') >= 0 || msg.indexOf('timed out') >= 0) {
          setTimeout(readLoop, TCP_POLL_INTERVAL_MS)  // SoTimeout 是我们设的 2s，继续轮询
          return
        }
        if (msg.indexOf('Stream closed') >= 0 || msg.indexOf('Connection reset') >= 0) {
          console.log('[TCP] 连接断开:', msg)
          logLine('网络', '读取中断开：' + msg)
          _this.readyState = CLOSED
          _this._fire('close', { type: 'close', wasClean: false })
          return
        }
        console.error('[TCP] plus.android 读取异常:', msg)
        logLine('网络', '读取异常：' + msg)
        _this.readyState = CLOSED
        _this._fire('error', { type: 'error', message: msg })
        _this._fire('close', { type: 'close', wasClean: false })
      }
    }
    readLoop()
  }

  /** plus.ios Socket 连接 */
  _connectWithPlusIOS() {
    // iOS 用 NSStream
    this.readyState = CLOSED
    this._fire('error', { type: 'error', message: 'iOS App 端 TCP 暂不支持，请使用微信小程序或 WebSocket 模式' })
  }

  send(data) {
    if (this.readyState !== OPEN) {
      throw new Error('TCP Socket 未连接，无法发送')
    }
    // 统一转成干净独立的 ArrayBuffer，避免底层共享 buffer 问题
    let cleanAb
    if (data && typeof data === 'string') {
      // string → UTF-8 ArrayBuffer
      const bytes = []
      for (let i = 0; i < data.length; i++) {
        const c = data.charCodeAt(i)
        if (c < 0x80) bytes.push(c)
        else if (c < 0x800) { bytes.push(0xc0 | (c >> 6)); bytes.push(0x80 | (c & 0x3f)) }
        else { bytes.push(0xe0 | (c >> 12)); bytes.push(0x80 | ((c >> 6) & 0x3f)); bytes.push(0x80 | (c & 0x3f)) }
      }
      cleanAb = new Uint8Array(bytes).buffer
    } else if (data && typeof data === 'object' && typeof data.byteLength === 'number') {
      // ArrayBuffer 或 TypedArray → new Uint8Array 复制一份干净的
      cleanAb = new Uint8Array(data).buffer
    } else {
      cleanAb = new Uint8Array(0).buffer
    }

    if (TCP_DEBUG_LOG) {
      const hexPreview = Array.from(new Uint8Array(cleanAb).slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' ')
      console.log('[TCP] send() byteLen=', cleanAb.byteLength, 'hexPreview:', hexPreview)
    }

    try {
      // wx/uni TCPSocket
      if (this._tcpSocket && typeof this._tcpSocket.write === 'function') {
        this._tcpSocket.write(cleanAb)
      }
      // plus.android Java Socket —— 逐字节 write(int) 绕过 JSB byte[] 桥不可靠问题
      else if (this._javaOutput) {
        const u8 = new Uint8Array(cleanAb)
        for (let i = 0; i < u8.length; i++) {
          this._javaOutput.write(u8[i] & 0xff)
        }
        this._javaOutput.flush()
        if (TCP_DEBUG_LOG) console.log('[TCP] Java write逐字节+' + u8.length + 'B flush OK, isConnected=' + this._javaSocket.isConnected())
      }
      if (TCP_DEBUG_LOG) console.log('[TCP] write() called OK')
    } catch (e) {
      console.error('[TCP] write() FAILED:', e.message, e.stack)
      this._fire('error', { type: 'error', message: String(e.message || e) })
    }
  }

  /**
   * 释放底层 socket（幂等）
   * 微信 TCPSocket 有并发上限（5 个），只要有一个没 close 就会挡住后续所有连接，
   * 所以无论是正常关闭、连接失败还是被上层丢弃，都必须走到这里。
   */
  _closeUnderlying() {
    const sock = this._tcpSocket
    this._tcpSocket = null
    if (sock) {
      // 先解绑回调，避免 close 触发的 onClose 再次进入上层重连逻辑
      try { typeof sock.offConnect === 'function' && sock.offConnect() } catch (e) {}
      try { typeof sock.offMessage === 'function' && sock.offMessage() } catch (e) {}
      try { typeof sock.offClose === 'function' && sock.offClose() } catch (e) {}
      try { typeof sock.offError === 'function' && sock.offError() } catch (e) {}
      try { typeof sock.close === 'function' && sock.close() } catch (e) {}
    }
    if (this._javaSocket) {
      try { this._javaInput && this._javaInput.close() } catch (e) {}
      try { this._javaOutput && this._javaOutput.close() } catch (e) {}
      try { this._javaSocket.close() } catch (e) {}
      this._javaInput = null
      this._javaOutput = null
      this._javaSocket = null
    }
  }

  close(code, reason) {
    const alreadyClosed = (this.readyState === CLOSED || this.readyState === CLOSING)
    this.readyState = CLOSING
    this._closeUnderlying()
    this.readyState = CLOSED
    // 已关闭过的不再重复抛 close 事件，避免上层重复排程重连
    if (alreadyClosed) return
    this._fire('close', { type: 'close', code, reason, wasClean: true })
  }

  /** 静默销毁：只释放资源，不触发 close/error 事件（供客户端重建传输层时调用） */
  destroy() {
    this.onopen = null
    this.onmessage = null
    this.onerror = null
    this.onclose = null
    this._listeners = { open: [], message: [], close: [], error: [] }
    this.readyState = CLOSED
    this._closeUnderlying()
  }

  // ---------- 事件分发 ----------
  _fire(type, evt) {
    // console.log('[TCP] _fire("' + type + '") handler=', typeof this['on' + type], 'listeners=', (this._listeners[type] || []).length)
    const handler = this['on' + type]
    if (typeof handler === 'function') {
      try { handler.call(this, evt) } catch (e) { console.error('TCP Socket handler error:', e) }
    }
    const arr = this._listeners[type] || []
    for (const fn of arr) {
      try { fn.call(this, evt) } catch (e) { console.error('TCP Socket listener error:', e) }
    }
  }

  addEventListener(type, listener) {
    if (!this._listeners[type]) this._listeners[type] = []
    this._listeners[type].push(listener)
  }

  removeEventListener(type, listener) {
    if (!this._listeners[type]) return
    this._listeners[type] = this._listeners[type].filter(fn => fn !== listener)
  }

  dispatchEvent(evt) {
    if (!evt || !evt.type) return
    this._fire(evt.type, evt)
  }
}

// 静态常量
UniappTcpAdapter.CONNECTING = CONNECTING
UniappTcpAdapter.OPEN = OPEN
UniappTcpAdapter.CLOSING = CLOSING
UniappTcpAdapter.CLOSED = CLOSED
UniappTcpAdapter.isAvailable = isTcpAvailable
