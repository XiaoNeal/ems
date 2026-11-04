/**
 * (0x170C) 储能/光伏 DC-DC 设备协议 V1.1 —— 能源数据 / 状态数据解析
 *
 * 依据点表：.dumate/inbox/(0x170C)储能DC设备协议(TCP)-V1.1-20240517.xlsx
 * 说明：地址为「字节地址」，只解析原始值；点表系数在展示层换算。
 *       该协议与旧的 170C_000A（4 个 uint32 字段）完全不同，不能复用旧模块。
 */
import { parseAddrFields, parseControlRaw, u8, u16, i16, bits, bit, ADDR_TYPE_SIZE } from './addr-fields'

// ---- 能源数据（0x02）----
const energyFields = [
  u16(0, 'B0'),    // BAT侧电压给定
  u16(2, 'B2'),    // 最大充电电流限制
  u16(4, 'B4'),    // 最大放电电流限制
  u16(6, 'B6'),    // BUS侧电压给定
  u16(8, 'B8'),    // BUS侧电流给定
  u16(10, 'B10'),  // 下垂电压系数
  u16(12, 'B12'),  // 最大功率限制
  u16(14, 'B14'), u16(16, 'B16'), u16(18, 'B18'), u16(20, 'B20'),
  u16(22, 'B22'), u16(24, 'B24'), u16(26, 'B26'), u16(28, 'B28'),
  // 实时量
  u16(30, 'B30'),  // BAT侧电压显示
  u16(32, 'B32'),  // BUS侧电压显示
  i16(34, 'B34'),  // BUS侧电流显示（有符号）
  i16(36, 'B36'),  // BAT侧电流显示（有符号）
  u16(38, 'B38'),  // 模块最高温度（实际值）
  u16(40, 'B40'),  // 允许运行功率
  i16(42, 'B42'),  // 当前运行功率（负充正放）
  // 累积电量：高 16 位 + 低 16 位
  u16(44, 'B44'), u16(46, 'B46'),
]

// ---- 状态数据（0x03）----
const stateFields = [
  u16(0, 'B0'),   // 启动指令
  u16(2, 'B2'),   // 模块功能选择
  u16(4, 'B4'),   // 工作模式选择
  u16(6, 'B6'),   // 模块并联均流
  bits(8, 'B8'),  // 机器运行状态（16 位掩码，取低 8 位）
  u16(8, 'B8'),   // 机器运行状态原始值
  u16(10, 'B10'), // 故障码
]

export const protocol_170C_V1_1 = {
  deviceType: '170C',
  version: 'V1_1',
  structs: {
    energyData: { fields: energyFields, bytes: 48 },
    specialData: { fields: stateFields, bytes: 12 },
  },
  parseEnergyData(bytes) {
    return parseAddrFields(bytes, energyFields)
  },
  parseSpecialData(bytes) {
    return parseAddrFields(bytes, stateFields)
  },
  parseEnergyControlData(bytes) {
    return parseControlRaw(bytes)
  },
}
