/**
 * 50kW 展示字段 → DataGrid items 的换算工具
 * 把字段表（direct-device-50kw-fields.js）+ 原始寄存器 bucket 转成 {label, value, unit}
 */

/** 读取原始值（支持单 key / 双字节合并 / 时钟 6 段合并 / 字节内位组） */
function readRaw(item, bucket) {
  if (!bucket) return undefined
  // 位组：从整字节里取 [start, start+width) 位（点表里 0x0/0x1/0x2/0x3 的多值枚举）
  if (item.bitField) {
    const bf = item.bitField
    const byte = Number(bucket[bf.key])
    if (bucket[bf.key] === undefined || bucket[bf.key] === null || !Number.isFinite(byte)) return undefined
    const width = bf.width || 1
    const mask = (1 << width) - 1
    return (byte >> (bf.start || 0)) & mask
  }
  if (item.combine === 'clock') {
    const nums = item.keys.map(k => Number(bucket[k]))
    if (nums.some(n => !Number.isFinite(n))) return undefined
    const [sec, min, hour, day, month, year] = nums
    if (!year || !month || !day) return undefined
    const p2 = n => String(n).padStart(2, '0')
    return `${year}-${p2(month)}-${p2(day)} ${p2(hour)}:${p2(min)}:${p2(sec)}`
  }
  if (item.keys && item.keys.length === 2) {
    const low = Number(bucket[item.keys[0]])
    const high = Number(bucket[item.keys[1]])
    if (!Number.isFinite(low) || !Number.isFinite(high)) return undefined
    return ((high & 0xffff) * 0x10000) + (low & 0xffff)
  }
  if (item.key === undefined) return undefined
  const v = bucket[item.key]
  if (v === undefined || v === null || v === '') return undefined
  return v
}

/**
 * 单字段 → DataGrid item
 * @param {Object} item 字段定义
 * @param {Object} bucket 原始寄存器 bucket
 */
export function fmtItem(item, bucket) {
  const raw = readRaw(item, bucket)

  // 枚举：直接映射文案
  if (item.map) {
    if (raw === undefined) return { label: item.label, value: '--', unit: '' }
    const txt = item.map[String(raw)]
    return { label: item.label, value: txt !== undefined ? txt : String(raw), unit: '' }
  }

  // 时钟字符串
  if (item.combine === 'clock') {
    return { label: item.label, value: raw === undefined ? '--' : String(raw), unit: '' }
  }

  if (raw === undefined) return { label: item.label, value: '--', unit: '' }
  const num = Number(raw)
  if (!Number.isFinite(num)) return { label: item.label, value: '--', unit: '' }
  // 点表用 (实际值 + N) 编码的字段（偏移 -1000 的电流、偏移 -50 的温度）：
  // 原始值 0 表示未采集/无效，若照公式换算会显示成 -1000.0A、-50℃ 这类不存在的读数
  if (item.offset && num === 0) return { label: item.label, value: '--', unit: '' }
  const scale = item.scale || 1
  let val = num / scale
  if (item.offset) val += item.offset
  const decimals = item.decimals !== undefined ? item.decimals : 1
  return { label: item.label, value: val.toFixed(decimals), unit: item.unit || '' }
}

/** 批量转换 */
export function fmtItems(items, bucket) {
  return (items || []).map(it => fmtItem(it, bucket))
}

/**
 * 帧前缀容错：同一部设备的状态帧键带 `S_`、能源帧键不带前缀，
 * 部分字段在两种帧里都可能出现（如 171C 的系统配置 S_B70、131C 的环境量）。
 * 这里为每个键补齐「裸键 / S_ / C_」三种写法，取到值即用，避免因帧类型不同显示 `--`。
 */
export function withPrefixAliases(bucket) {
  const src = bucket || {}
  const out = {}
  Object.keys(src).forEach(k => {
    const v = src[k]
    const bare = String(k).replace(/^[SC]_/, '')
    if (out[k] === undefined) out[k] = v
    if (out[bare] === undefined) out[bare] = v
    if (out['S_' + bare] === undefined) out['S_' + bare] = v
    if (out['C_' + bare] === undefined) out['C_' + bare] = v
  })
  return out
}

/**
 * 机器运行状态徽标（170C 状态帧 B8 掩码）
 * @returns {Array<{name, active, tone}>}
 */
export function decodeRunState(bitsDef, rawValue) {
  const num = Number(rawValue)
  const valid = Number.isFinite(num)
  return bitsDef.map(def => {
    const active = valid && ((num >> def.bit) & 1) === 1
    let tone = 'blue'
    if (def.name.indexOf('故障') >= 0 || def.name.indexOf('停机') >= 0) tone = 'red'
    else if (def.name.indexOf('运行') >= 0) tone = 'green'
    else if (def.name.indexOf('过载') >= 0) tone = 'orange'
    return { name: def.name, active, tone }
  })
}

/**
 * 故障码 chips：列出所有枚举项，命中的置为 active
 * @param {Object} enumMap { code: name }
 * @param {Number} current 当前故障码
 */
export function buildFaultChips(enumMap, current) {
  const cur = Number(current)
  const codes = Object.keys(enumMap)
    .map(c => Number(c))
    .sort((a, b) => a - b)
  // 「保留」项不展示
  return codes
    .filter(c => enumMap[c] !== '保留')
    .map(c => ({
      code: c,
      name: enumMap[c],
      active: Number.isFinite(cur) && cur === c
    }))
}
