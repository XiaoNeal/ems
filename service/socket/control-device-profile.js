/**
 * 0x3401《IEMS 远程控制协议 V1.2》—— 设备身份表
 *
 * 依据协议附件1「涉及设备」，每条命令块（19 字节）的前 5 字节为设备身份：
 *   偏移 0     设备大类（1 字节，无符号）
 *   偏移 1     设备小类（1 字节，无符号）
 *   偏移 2     设备索引号 ADDR（1 字节，无符号）
 *   偏移 3-4   设备 ID 值（2 字节，无符号，大端）
 *
 * 大类 + 小类 拼成 4 位 hex 即该设备的控制类型码：
 *   0x171B PCS / 0x171D 储能DC / 0x171E 光伏DC / 0x171C BMS / 0x0318 液冷机 / 0x171F EMS
 *
 * ⚠️ 直连页的上行 bucket key（1707 / 170C_STORAGE / 170C_PV / 171C_V2 / 0318）
 *    是**模块级协议码**，不能直接当控制类型码下发——这是此前「指令发出去设备没反应」的主因。
 */

export const DEVICE_PROFILES = {
  // PCS：上行 (0x1707) PCS 模块协议 V3.5，控制下行按 0x171B
  '1707': { category: '171B', addr: 1, deviceId: 1 },
  '171B': { category: '171B', addr: 1, deviceId: 1 },
  // 储能 DC：上行 (0x170C) V1.1，控制下行按 0x171D（索引号/ID = 30）
  '170C_STORAGE': { category: '171D', addr: 30, deviceId: 30 },
  '171D': { category: '171D', addr: 30, deviceId: 30 },
  // 光伏 DC：上行 (0x170C) V1.1，控制下行按 0x171E（索引号/ID = 6）
  '170C_PV': { category: '171E', addr: 6, deviceId: 6 },
  '171E': { category: '171E', addr: 6, deviceId: 6 },
  // BMS：(0x171C) V2.0 主机，索引号/ID = 01
  '171C_V2': { category: '171C', addr: 1, deviceId: 1 },
  '171C': { category: '171C', addr: 1, deviceId: 1 },
  // BMS 告警阈值从机 V2.1~V2.4（帧头设备地址 02~05，下发同池 171C）
  '171C_V2_1': { category: '171C', addr: 2, deviceId: 2 },
  '171C_V2_2': { category: '171C', addr: 3, deviceId: 3 },
  '171C_V2_3': { category: '171C', addr: 4, deviceId: 4 },
  '171C_V2_4': { category: '171C', addr: 5, deviceId: 5 },
  // 液冷机：同飞 (0x0318) V2.3，索引号/ID = 10
  '0318': { category: '0318', addr: 10, deviceId: 10 },
  // 能量控制器（快捷控制 / 运行策略）
  '171F': { category: '171F', addr: 1, deviceId: 1 }
}

const FALLBACK = { category: '171B', addr: 1, deviceId: 1 }

/**
 * 取设备身份（大类小类 / 索引号 / 设备 ID）
 * @param {string|number} deviceType 设备类型码，如 '1707'、'170C_STORAGE'、'0318'
 * @returns {{category: string, addr: number, deviceId: number}}
 */
export function resolveDeviceProfile(deviceType) {
  const key = deviceType === undefined || deviceType === null ? '' : String(deviceType).trim().toUpperCase()
  const hit = DEVICE_PROFILES[key]
  if (hit) return { ...hit }
  // 未知类型：若本身是 4 位 hex 就原样当控制类型码，否则回落到 PCS
  if (/^[0-9A-F]{4}$/.test(key)) return { category: key, addr: 1, deviceId: 1 }
  return { ...FALLBACK }
}
