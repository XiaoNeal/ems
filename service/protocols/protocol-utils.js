export const C_TYPE = {
  UINT8: 'uint8',
  UINT16: 'uint16',
  INT16: 'int16',
  UINT32: 'uint32',
  INT32: 'int32',
  FLOAT: 'float',
}

export const C_TYPE_SIZE = {
  uint8: 1,
  uint16: 2,
  int16: 2,
  uint32: 4,
  int32: 4,
  float: 4,
}

export function readValue(dv, pos, cType) {
  switch (cType) {
    case 'uint8':   return dv.getUint8(pos)
    case 'uint16':  return dv.getUint16(pos, false)
    case 'int16':   return dv.getInt16(pos, false)
    case 'uint32':  return dv.getUint32(pos, false)
    case 'int32':   return dv.getInt32(pos, false)
    case 'float':   return dv.getFloat32(pos, false)
    default: throw new Error(`Unknown cType: ${cType}`)
  }
}

export function parseStruct(bytes, structDef) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const result = {}
  let pos = 0

  for (const field of structDef) {
    if (field.skip) {
      pos += C_TYPE_SIZE[field.cType] || 1
      continue
    }
    if (field.bitfield) {
      const byteVal = dv.getUint8(pos)
      const bits = field.bitMask || [0, 1, 2, 3, 4, 5, 6, 7]
      for (const b of bits) {
        result[`${field.name}b${b}`] = (byteVal >> b) & 0x1
      }
      pos += 1
      continue
    }
    if (field.read) {
      const { value, bytesRead } = field.read(dv, pos)
      let v = field.scale ? value / field.scale : value
      if (field.offset != null) v += field.offset
      result[field.name] = v
      pos += bytesRead
    } else {
      const raw = readValue(dv, pos, field.cType)
      let v = field.scale ? raw / field.scale : raw
      if (field.offset != null) v += field.offset
      result[field.name] = v
      pos += C_TYPE_SIZE[field.cType]
    }
  }

  return result
}

export function structBytes(structDef) {
  let total = 0
  for (const field of structDef) {
    if (field.bitfield) {
      total += 1
    } else if (field.read) {
      total += field.readBytes || C_TYPE_SIZE[field.cType] || 1
    } else {
      total += C_TYPE_SIZE[field.cType] || 1
    }
  }
  return total
}

export function createFields(fields) {
  return fields.map(f => {
    const entry = { name: f.name, cType: f.cType, desc: f.desc || '' }
    if (f.scale) entry.scale = f.scale
    if (f.offset != null) entry.offset = f.offset
    if (f.skip) entry.skip = true
    if (f.bitfield) { entry.bitfield = true; if (f.bitMask) entry.bitMask = f.bitMask }
    if (f.read) { entry.read = f.read; entry.readBytes = f.readBytes || 4 }
    return entry
  })
}

// 合并两个 uint16 为 32 位值（低字在前，高字在后）
// 对应 C++: uiL = ReadUint16; uiH = ReadUint16; result = (uiH<<16) | uiL
export function combine32LH(dv, pos) {
  const low = dv.getUint16(pos, false)
  const high = dv.getUint16(pos + 2, false)
  return { value: (high << 16) | low, bytesRead: 4 }
}

// 合并两个 uint16 为混合编码值（高字节左移8位）
// 对应 C++: uiH = ReadUint16; uiL = ReadUint16; result = (uiH<<8) | uiL
export function combineMixed(dv, pos) {
  const first = dv.getUint16(pos, false)
  const second = dv.getUint16(pos + 2, false)
  return { value: (first << 8) | second, bytesRead: 4 }
}

// 频率参数：FREQUENCY_PARAM = 0.00106813
// 对应 C++: ReadUint16 / 0.00106813
export const FREQUENCY_PARAM = 0.00106813

// PT/CT 后处理辅助函数
export function applyPTCorrection(data, pt, ct, ptFields, ctFields, ptctFields) {
  for (const key of ptFields) {
    if (data[key] != null) data[key] *= pt
  }
  for (const key of ctFields) {
    if (data[key] != null) data[key] *= ct
  }
  for (const key of ptctFields) {
    if (data[key] != null) data[key] *= pt * ct
  }
  return data
}