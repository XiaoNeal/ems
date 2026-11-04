/**
 * 按「字节地址」解析协议负载（用于 50kW 新协议：1707 V3.5 / 170C V1.1 / 171C V2.0）
 *
 * 老协议模块（protocol-utils.parseStruct）是「顺序游标」解析，字段宽度必须严格连续；
 * 而新协议点表是「字节地址 + 位地址」表，存在：
 *   - 同一个字节既作 16bit 值又按位拆分（B2b0~B2b7 设备状态位）
 *   - 单字节字段与双字节字段混排（B118~B125 每个字节一个 IGBT 温度）
 *   - 32bit 字段占 4 字节（171C V2.0 的累计电量、总使用时间）
 * 因此这里按显式地址读取，宽度由 type 决定，不做缩放（缩放交由展示层按点表系数处理）。
 */

export const ADDR_TYPE_SIZE = {
  u8: 1,
  i8: 1,
  u16: 2,
  i16: 2,
  u32: 4,
  i32: 4,
  f32: 4,
}

/** 字段简写构造器 */
export const u8 = (addr, name) => ({ addr, name, type: 'u8' })
export const i8 = (addr, name) => ({ addr, name, type: 'i8' })
export const u16 = (addr, name) => ({ addr, name, type: 'u16' })
export const i16 = (addr, name) => ({ addr, name, type: 'i16' })
export const u32 = (addr, name) => ({ addr, name, type: 'u32' })
export const i32 = (addr, name) => ({ addr, name, type: 'i32' })
/** 单精度浮点（4 字节，大端 IEEE754），环境监测 131C 使用 */
export const f32 = (addr, name) => ({ addr, name, type: 'f32' })
/** 该字节 8 位全部展开为 B{addr}b0 ~ B{addr}b7 */
export const bits = (addr, name) => ({ addr, name, type: 'bits' })
/** 只取该字节的某一位 */
export const bit = (addr, name, b) => ({ addr, name, type: 'bit', bit: b })

/**
 * 控制帧负载解析：既产出偶数偏移的 16bit 值（B0/B2/…），也产出每个字节的 8 个位（B3b0…）
 * 50kW 设置页的位命令（上高压/强控等）按位寻址，必须同时提供位键
 */
export function parseControlRaw(payload) {
  const out = {}
  if (!payload || payload.length <= 0) return out
  const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength)
  for (let i = 0; i < payload.length; i++) {
    const byteVal = dv.getUint8(i)
    for (let b = 0; b < 8; b++) out[`B${i}b${b}`] = (byteVal >> b) & 0x1
    if (i % 2 === 0 && i + 2 <= payload.length) out['B' + i] = dv.getInt16(i, false)
  }
  return out
}

/**
 * 按字节地址解析字段表
 * @param {Uint8Array} payload 帧负载（从 startAddr 起的数据区）
 * @param {Array} fields 字段定义
 * @returns {Object} { B0: 123, B2b0: 1, ... } 原始寄存器值（未缩放）
 */
export function parseAddrFields(payload, fields) {
  const out = {}
  if (!payload || payload.length <= 0) return out
  const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength)

  for (const f of fields) {
    if (f.addr === undefined || f.addr === null) continue

    if (f.type === 'bits' || f.type === 'bit') {
      if (f.addr >= dv.byteLength) continue
      const byteVal = dv.getUint8(f.addr)
      if (f.type === 'bit') {
        out[`${f.name}b${f.bit}`] = (byteVal >> f.bit) & 0x1
      } else {
        for (let b = 0; b < 8; b++) out[`${f.name}b${b}`] = (byteVal >> b) & 0x1
      }
      continue
    }

    const size = ADDR_TYPE_SIZE[f.type] || 2
    if (f.addr + size > dv.byteLength) continue
    let v
    switch (f.type) {
      case 'u8': v = dv.getUint8(f.addr); break
      case 'i8': v = dv.getInt8(f.addr); break
      case 'u16': v = dv.getUint16(f.addr, false); break
      case 'i16': v = dv.getInt16(f.addr, false); break
      case 'u32': v = dv.getUint32(f.addr, false); break
      case 'i32': v = dv.getInt32(f.addr, false); break
      case 'f32': v = dv.getFloat32(f.addr, false); break
      default: continue
    }
    out[f.name] = v
  }
  return out
}
