import { protocolRegistry } from '../protocols/index'

/**
 * IEMS 二进制帧解析器
 *
 * 严格对齐 DataCenter C++ 实现：
 *   - Protocol/CommonOper.h  的 FrameType / DataType 枚举、ReadUint16(大端)、GetParseStringWithTimeStamp
 *   - Protocol/PhysicalDevice.cc 的 ParseBasicData（B 字段编号 = 字节偏移）
 *   - DTU/DTUSession.cc 的帧头切分
 *   - 集成 service/protocols/ 协议模块，按 C++ .cc 中的缩放因子/偏移/位域定义解析
 *
 * 帧结构（共 15 + datacount 字节）：
 *   偏移  长度  字段
 *   0     1     frameType   (0x07=设备上报设备信息 / 0x17=普通状态 / 0x18=工程注册)
 *   1-2   2     deviceType  大端 (如 0x171D)
 *   3-4   2     factorySign 大端
 *   5     1     address     设备地址
 *   6     1     datacount   = 2 + payload长度 (含 dataType + startAddr)
 *   7     1     dataType    (1=设备信息 / 2=能源 / 3=状态 / 4=控制)
 *   8     1     startAddr   起始寄存器
 *   9..   datacount-2  payload  寄存器数据，大端
 *   …     6     dateTime    年(2位,+2000)月日时分秒
 *   末尾  2     CRC16       Modbus CRC16，低字节在前
 *
 * 输出 JSON 与 CommonOper::GetParseStringWithTimeStamp 一致：
 *   {"frameType":"17","deviceType":"171D","factorySign":"0001","address":"1E",
 *    "dataType":"4","data":{"B0":3,"B4":1,...},"dateTime":"2026-07-22 15:19:59",
 *    "payload": <Uint8Array>}
 *
 * payload → B 字段：
 *   - 若 protocols/index.js 中注册了对应设备类型，使用协议模块解析（含缩放/偏移/位域）
 *   - 否则回退到通用 16 位有符号整数解析（大端），放电/反向功率为负
 *   - 171E 光伏 DC 用 32 位 IEEE754 float（大端）
 *   - 位域 B{N}b{0~7}：偏移 N 处寄存器的第 0~7 位（告警位常用）
 */

// FrameType 枚举（CommonOper.h:20-54）
export const IEMS_FRAME_TYPE = {
  DEVICE_REPORT: 0x07, // 设备上报设备信息
  COMMON_STATUS: 0x17, // 普通状态（实时数据）
  PROJECT_REGISTER: 0x18, // 工程注册
  COMMON_CONTROL_DEVICE: 0x16 // 普通控制（设备节点，下行控制回包）
}

// DataType 枚举（CommonOper.h:56-74）
export const IEMS_DATA_TYPE = {
  DEVICEINFO: 0x01, // 设备信息(上行) —— 前端通常丢弃
  ENERGY: 0x02, // 能源数据(上行)
  STATE: 0x03, // 状态数据(上行)
  CONTROL: 0x04, // 控制数据(上行)
  // 下行（S2D），一般不出现在设备上报帧中
  S2D_DEVICEINFO: 0xC1,
  S2D_ENERGY: 0xC4,
  S2D_STATE: 0xC3,
  S2D_CONTROL: 0xC2
}

// 使用 float32 解析的设备类型（对应 .so 里的 IEEE754 读取）
const FLOAT32_DEVICE_TYPES = new Set([0x171E])

function getProtocolRegistry() {
  return protocolRegistry
}

const FRAME_TAIL_LEN = 6 + 2 // dateTime(6) + CRC(2)
const FRAME_MIN_LEN = 9 + FRAME_TAIL_LEN // frameType..startAddr(9) + tail

/**
 * Modbus CRC16（低字节在前存储，与 DataCenter 一致）
 */
export function crc16Modbus(buf, offset = 0, length = buf.length) {
  let crc = 0xffff
  for (let i = 0; i < length; i++) {
    crc ^= buf[offset + i]
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? ((crc >> 1) ^ 0xa001) : (crc >> 1)
    }
  }
  return crc & 0xffff
}

/**
 * 判断是否为 IEMS 二进制帧（用于 MQTT payload 自动识别）
 * 仅靠首字节判断，调用方应先用 JSON.parse 失败再走此路径
 */
export function isIemsBinaryFrame(bytes) {
  if (!bytes || bytes.length < FRAME_MIN_LEN) return false
  const first = bytes[0]
  return first === IEMS_FRAME_TYPE.DEVICE_REPORT ||
    first === IEMS_FRAME_TYPE.COMMON_STATUS ||
    first === IEMS_FRAME_TYPE.PROJECT_REGISTER
}

/**
 * 解析一整条 IEMS 帧
 * @param {Uint8Array} frame 完整帧
 * @returns {object} 与 DataCenter GetParseStringWithTimeStamp 输出一致的 JSON
 */
export function parseIemsFrame(frame) {
  if (!frame || frame.length < FRAME_MIN_LEN) {
    throw new Error('IEMS 帧长度不足：' + (frame ? frame.length : 0))
  }

  const byteOffset = frame.byteOffset || 0
  const dv = new DataView(frame.buffer, byteOffset, frame.byteLength)

  const frameType = frame[0]
  const deviceType = dv.getUint16(1, false) // 大端，对应 ReadUint16
  const factorySign = dv.getUint16(3, false)
  const address = frame[5]
  const datacount = frame[6]
  const dataType = frame[7]
  const startAddr = frame[8]

  // payload 长度 = datacount - 2（去掉 dataType + startAddr 两字节）
  const payloadLen = datacount - 2
  if (payloadLen < 0) {
    throw new Error('IEMS datacount 异常：' + datacount)
  }

  // 容错：frame 总长度不够时，payload 取到实际可用位置
  const frameLen = frame.length
  let actualPayloadLen = payloadLen
  if (frameLen < 9 + payloadLen) {
    actualPayloadLen = Math.max(0, frameLen - 9)
    console.warn('[IEMS] payload 截断：声明 payload=' + payloadLen + ' 实际可用=' + actualPayloadLen)
    if (actualPayloadLen === 0) {
      throw new Error('IEMS payload 完全缺失')
    }
  }

  // 提取原始 payload 字节（供协议模块使用）
  const payload = frame.slice(9, 9 + actualPayloadLen)

  const payloadEnd = 9 + actualPayloadLen
  const dateTimeStart = payloadEnd

  // 容错：尾部(dateTime+CRC)不完整时，不抛异常，降级解析
  const tailAvailable = frameLen - dateTimeStart
  let dateTimeStr = ''
  let crcStored = 0
  let crcOk = false
  let tailTruncated = false

  if (tailAvailable < FRAME_TAIL_LEN) {
    // 截断帧：payload 区域仍完整，payload 长度由 datacount 保证
    tailTruncated = true
    console.warn('[IEMS] 帧尾部截断：声明 tail=' + FRAME_TAIL_LEN + ' 实际=' + tailAvailable + '，payload 正常')
  } else {
    // dateTime：年(2位,+2000)月日时分秒，输出 "YYYY-MM-DD HH:mm:ss"
    const year = frame[dateTimeStart] + 2000
    const month = frame[dateTimeStart + 1]
    const day = frame[dateTimeStart + 2]
    const hour = frame[dateTimeStart + 3]
    const minute = frame[dateTimeStart + 4]
    const second = frame[dateTimeStart + 5]
    dateTimeStr =
      `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)} ` +
      `${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}`

    // CRC：高字节在前（大端读取，与设备实际存储一致）
    const crcStart = dateTimeStart + 6
    crcStored = dv.getUint16(crcStart, false)
    const crcCalc = crc16Modbus(frame, 0, crcStart)
    crcOk = crcStored === crcCalc
  }

  // 解析 payload → B 字段
  // 优先使用协议模块（含缩放/偏移/位域），回退到通用 16 位解析
  const deviceTypeHex = padHex(deviceType, 4)
  const data = parsePayloadWithProtocol(payload, deviceTypeHex, dataType)

  // 打印解析后的数据
  const dataTypeName = dataType === 2 ? '能源' : dataType === 4 ? '控制' : dataType === 1 ? '设备信息' : '未知'
  // console.log(`[IEMS解析] ${deviceTypeHex} addr=${padHex(address, 2)} ${dataTypeName}帧 dataType=${dataType} dateTime=${dateTimeStr} CRC=${crcOk ? 'OK' : 'FAIL'} 字段数=${Object.keys(data).length}`)
  // 打印前若干个 B 字段（避免日志过长）
  const fieldEntries = Object.entries(data).slice(0, 12)
  fieldEntries.forEach(([k, v]) => {
    // v 可能是纯数字（协议模块 parseStruct），也可能是对象（带 eng/unit/name 的扩展格式）
    let displayVal, unit, name
    if (v !== null && v !== undefined && typeof v === 'object') {
      displayVal = v.eng !== undefined ? v.eng : (v.value !== undefined ? v.value : v.raw)
      unit = v.unit || ''
      name = v.name || ''
    } else {
      displayVal = v
      unit = ''
      name = ''
    }
    // console.log(`    ${k}: ${name} = ${displayVal}${unit ? ' ' + unit : ''}`)
  })
  // if (Object.keys(data).length > 12) // console.log(`    ... 共 ${Object.keys(data).length} 个字段`)

  // 输出与 GetParseStringWithTimeStamp 一致的结构
  return {
    frameType: padHex(frameType, 2),
    deviceType: deviceTypeHex,
    factorySign: padHex(factorySign, 4),
    address: padHex(address, 2),
    dataType: padHex(dataType, 1), // "%X" 大写十六进制
    data,
    dateTime: dateTimeStr,
    payload, // 原始 payload 字节，供进一步处理
    // 附加校验信息（前端通常不消费）
    crcOk,
    // 数值形式保留，便于程序判断
    _frameTypeNum: frameType,
    _deviceTypeNum: deviceType,
    _addressNum: address,
    _dataTypeNum: dataType,
    _startAddrNum: startAddr
  }
}

/**
 * 使用协议模块解析 payload，若设备类型未注册则回退到通用解析
 * @param {Uint8Array} payload - 原始 payload 字节
 * @param {string} deviceTypeHex - 设备类型十六进制字符串 (如 '171D')
 * @param {number} dataType - 数据类型 (IEMS_DATA_TYPE 枚举值)
 * @returns {Object} 解析后的 B 字段对象
 */
function parsePayloadWithProtocol(payload, deviceTypeHex, dataType) {
  // 尝试匹配协议模块（含版本前缀匹配，如 '171C' 匹配 '171C_V1_1'）
  const registry = getProtocolRegistry()
  let protocol = registry[deviceTypeHex]
  if (!protocol) {
    // 尝试版本前缀匹配
    for (const key of Object.keys(registry)) {
      if (deviceTypeHex.startsWith(key) || key.startsWith(deviceTypeHex + '_')) {
        protocol = registry[key]
        break
      }
    }
  }

  if (protocol) {
    // 确定解析方法
    let parseMethod = null
    if (dataType === IEMS_DATA_TYPE.ENERGY && typeof protocol.parseEnergyData === 'function') {
      parseMethod = 'parseEnergyData'
    } else if (dataType === IEMS_DATA_TYPE.CONTROL && typeof protocol.parseEnergyControlData === 'function') {
      parseMethod = 'parseEnergyControlData'
    } else if (dataType === IEMS_DATA_TYPE.STATE && typeof protocol.parseSpecialData === 'function') {
      parseMethod = 'parseSpecialData'
    }

    if (parseMethod) {
      try {
        const result = protocol[parseMethod](payload)
        // console.log(`[iems-frame-parser] 使用协议模块解析: ${deviceTypeHex}.${parseMethod} 产出${Object.keys(result).length}个字段`)
        return result
      } catch (e) {
        console.warn('[iems-frame-parser] 协议解析失败，回退通用解析:', deviceTypeHex, e.message)
      }
    } else {
      console.warn(`[iems-frame-parser] ${deviceTypeHex} 无匹配的解析方法(dataType=${dataType})，回退通用解析`)
    }
  } else {
    console.warn(`[iems-frame-parser] 未找到 ${deviceTypeHex} 协议模块，回退通用解析`)
  }

  // 回退到通用 16 位解析
  const result = parsePayloadGeneric(payload, parseInt(deviceTypeHex, 16))
  console.log(`[iems-frame-parser] 通用解析产出${Object.keys(result).length}个字段`)
  return result
}

/**
 * 通用 payload 解析（无协议模块时使用）
 * B 字段编号 = 字节偏移（见 PhysicalDevice.cc:27 起）
 */
function parsePayloadGeneric(payload, deviceTypeNum) {
  const data = {}
  if (payload.length <= 0) return data

  const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength)

  if (FLOAT32_DEVICE_TYPES.has(deviceTypeNum)) {
    // 32 位 float，大端（对应 .so 里的 IEEE754ToFloat）
    for (let i = 0; i + 4 <= payload.length; i += 4) {
      data['B' + i] = dv.getFloat32(i, false)
    }
  } else {
    // 16 位有符号整数，大端（对应 ReadInt16_t）
    for (let i = 0; i + 2 <= payload.length; i += 2) {
      data['B' + i] = dv.getInt16(i, false)
    }
    // 位域 B{N}b{0~7}（对应 ReadBit）
    for (const k of Object.keys(data)) {
      const v = data[k]
      if (Number.isInteger(v)) {
        for (let b = 0; b < 8; b++) {
          data[k + 'b' + b] = (v >> b) & 1
        }
      }
    }
  }
  return data
}

/**
 * 将 MQTT 二进制 payload 解析为前端可消费的 JSON
 * 输出与 DataCenter 推送给前端的格式一致
 *
 * @param {Uint8Array} bytes
 * @param {string} [gateway] 网关条码，可选
 */
export function parseIemsMqttPayload(bytes, gateway) {
  const parsed = parseIemsFrame(bytes)
  if (gateway) parsed.gateway = gateway
  return parsed
}

/**
 * 判断是否为 IEMS 下行控制帧（0x16 COMMON_CONTROL_DEVICE）
 * 用于 MQTT payload 自动识别：首字节=0x16
 */
export function isIemsControlFrame(bytes) {
  if (!bytes || bytes.length < 11) return false // 至少 9(header) + 2(payload最小) + 2(CRC)
  return bytes[0] === IEMS_FRAME_TYPE.COMMON_CONTROL_DEVICE
}

/**
 * 解析 IEMS 下行控制帧（0x16）
 * 与 parseIemsFrame 不同：下行帧没有 dateTime 字段
 *
 * 帧结构：frameType(1) + deviceType(2,BE) + factorySign(2,BE) + address(1)
 *        + datacount(1) + dataType(1) + startAddr(1) + payload(datacount-2)
 *        + CRC16(2,高字节在前)
 *        总长度 = 9 + datacount + 2 = datacount + 11
 *        datacount = 2 + payloadLen (dataType + startAddr + payload)
 *
 * @param {Uint8Array} frame 完整的 0x16 帧
 * @returns {object} 解析结果
 */
export function parseIemsControlFrame(frame) {
  if (!frame || frame.length < 11) {
    throw new Error('IEMS 控制帧长度不足：' + (frame ? frame.length : 0))
  }
  if (frame[0] !== IEMS_FRAME_TYPE.COMMON_CONTROL_DEVICE) {
    throw new Error('非下行控制帧，frameType=' + frame[0])
  }

  const dv = new DataView(frame.buffer, frame.byteOffset || 0, frame.byteLength)
  const frameType = frame[0]
  const deviceType = dv.getUint16(1, false)
  const factorySign = dv.getUint16(3, false)
  const address = frame[5]
  const datacount = frame[6]
  const dataType = frame[7]
  const startAddr = frame[8]

  const payloadLen = datacount - 2
  if (payloadLen < 0) throw new Error('datacount 异常: ' + datacount)

  const payload = frame.slice(9, 9 + payloadLen)
  const crcStored = dv.getUint16(frame.length - 2, false)
  const crcCalc = crc16Modbus(frame, 0, frame.length - 2)
  const crcOk = crcStored === crcCalc

  // 解析 payload 为寄存器 B 字段
  const registers = {}
  for (let i = 0; i + 2 <= payload.length; i += 2) {
    const regAddr = startAddr + i
    registers['B' + regAddr] = dv.getInt16(9 + i, false)
  }

  console.log(`[IEMS控制帧解析] deviceType=0x${deviceType.toString(16).padStart(4,'0')} addr=${address} startAddr=${startAddr} payloadLen=${payloadLen} CRC=${crcOk?'OK':'FAIL'}`)

  return {
    frameType: padHex(frameType, 2),
    deviceType: padHex(deviceType, 4),
    factorySign: padHex(factorySign, 4),
    address: padHex(address, 2),
    dataType: padHex(dataType, 2),
    startAddr,
    payload,
    registers,
    crcOk,
    _deviceTypeNum: deviceType,
    _dataTypeNum: dataType
  }
}

/**
 * 构建 IEMS 下行控制帧（0x16 COMMON_CONTROL_DEVICE + 0xC2 S2D_CONTROL）
 *
 * 用于 App 通过 MQTT 向设备下发控制指令。
 * 真实设备间使用这种二进制帧通信，不是 JSON。
 *
 * 帧结构：frameType(1,0x16) + deviceType(2,BE) + factorySign(2,BE) + address(1)
 *        + datacount(1) + dataType(1,0xC2) + startAddr(1) + payload(datacount-2)
 *        + CRC16(2,高字节在前)
 *        无 dateTime 字段
 *
 * @param {number|string} deviceType 设备类型，十六进制字符串(如 '171F')或数字(0x171F)
 * @param {number} address 设备地址，默认 1
 * @param {number} startAddr 起始寄存器地址，默认 0
 * @param {object} registerValues 寄存器值映射，如 { B0: 1, B2: 0, B12: 256 }
 *                                key 为 'B{N}' 格式，value 为整数值
 *                                寄存器号从 startAddr 开始按 2 字节递增排列
 *                                会自动填充未指定的中间寄存器为 0
 * @returns {Uint8Array} 完整的二进制帧
 *
 * @example
 * // 向 171F 设备下发控制指令：B0=2(关机), B2=1(并网整流模式)
 * const frame = buildIemsControlFrame('171F', 1, 0, { B0: 2, B2: 1 })
 * // 然后通过 MQTT PUBLISH 发送 frame.buffer
 */
export function buildIemsControlFrame(deviceType, address, startAddr, registerValues) {
  // 1. 解析 deviceType
  let dtNum
  if (typeof deviceType === 'string') {
    dtNum = parseInt(deviceType, 16)
    if (isNaN(dtNum)) throw new Error('无效的 deviceType: ' + deviceType)
  } else {
    dtNum = deviceType
  }

  address = address || 1
  startAddr = startAddr || 0
  registerValues = registerValues || {}

  // 2. 找出需要编码的寄存器范围
  let maxReg = startAddr
  for (const key of Object.keys(registerValues)) {
    const m = key.match(/^B(\d+)$/)
    if (m) {
      const regNum = parseInt(m[1], 10)
      if (regNum > maxReg) maxReg = regNum
    }
  }

  // 3. 构建 payload 字节（每个寄存器 2 字节，大端）
  // payload 长度 = (maxReg - startAddr + 2) —— 从 startAddr 到 maxReg，每个寄存器 2 字节
  // 但要确保对齐到偶数（16位寄存器）
  const payloadLen = maxReg - startAddr + 2 // 包含 startAddr 到 maxReg 的所有寄存器（偶数对齐）
  const payload = new Uint8Array(payloadLen)
  const dv = new DataView(payload.buffer)

  for (let reg = startAddr; reg <= maxReg; reg += 2) {
    const key = 'B' + reg
    let val = registerValues[key]
    if (val === undefined || val === null) val = 0
    dv.setUint16(reg - startAddr, val & 0xffff, false) // 大端
  }

  // 4. 组装帧头
  const datacount = 2 + payloadLen // dataType(1) + startAddr(1) + payload
  const header = new Uint8Array(9)
  const hdv = new DataView(header.buffer)
  header[0] = IEMS_FRAME_TYPE.COMMON_CONTROL_DEVICE
  hdv.setUint16(1, dtNum, false) // deviceType 大端
  hdv.setUint16(3, 0x0001, false) // factorySign
  header[5] = address & 0xff
  header[6] = datacount & 0xff
  header[7] = IEMS_DATA_TYPE.S2D_CONTROL
  header[8] = startAddr & 0xff

  // 5. 合并 header + payload
  const withoutCrc = new Uint8Array(header.length + payload.length)
  withoutCrc.set(header, 0)
  withoutCrc.set(payload, header.length)

  // 6. 计算 CRC16 Modbus（高字节在前存储）
  const crc = crc16Modbus(withoutCrc)
  const crcBytes = new Uint8Array(2)
  const cdv = new DataView(crcBytes.buffer)
  cdv.setUint16(0, crc, false)

  // 7. 最终帧 = withoutCrc + crcBytes
  const result = new Uint8Array(withoutCrc.length + 2)
  result.set(withoutCrc, 0)
  result.set(crcBytes, withoutCrc.length)

  // 日志
  const hexStr = Array.from(result).map(b => b.toString(16).padStart(2, '0')).join(' ')
  console.log(`[IEMS控制帧构建] deviceType=0x${dtNum.toString(16).padStart(4,'0')} startAddr=${startAddr} payloadLen=${payloadLen} CRC=0x${crc.toString(16).padStart(4,'0')}`)
  console.log(`[IEMS控制帧构建] hex: ${hexStr}`)

  return result
}

function pad(num, width) {
  return String(num).padStart(width, '0')
}

function padHex(num, width) {
  return Number(num).toString(16).toUpperCase().padStart(width, '0')
}
