/**
 * 液冷机（0318 V2.3）展示字段表 —— 直连设备页「液冷机」监测 tab
 *
 * 对应点表：.dumate/inbox/(0x0318)同飞液冷机转发通信协议-V2.3-25.6.23.xlsx
 * 与《液冷机参数》栏目保持一致：运行状态（机组状态+开关量）/ 设备信息 / 故障报警
 *
 * 字段说明同 direct-device-50kw-fields.js：
 *   key 由 service/protocols/0318_V2_3.js 产出（B 号为字节地址，B38/B39/B41 为单字节位信号）
 *   scale：显示值 = 原始值 / scale
 */

// 启动模式
export const COOL_START_MODE = { 0: '手动', 1: '自动' }
// 工作模式
export const COOL_WORK_MODE = { 0: '待机', 1: '制冷', 2: '加热', 3: '自循环', 4: '自动' }
// 供回水控制目标
export const COOL_SUPPLY_TARGET = { 0: '供水', 1: '回水' }
// 波特率
export const COOL_BAUD_RATE = { 0: '9600', 1: '4800', 2: '19200' }
// 机组运行状态：低字节=状态，高字节=模式
export const COOL_RUN_STATUS = ['空闲', '准备启动', '运行', '延时停机', '故障']
export const COOL_RUN_MODE = ['待机', '制冷', '制热', '自循环']

// 设备信息（数值型，按《液冷机参数》栏目顺序：温度 → 开度/转速 → 压力 → 故障码 → 功率 → 累计运行）
// 点表：B114 传输值=实际值*10，单位 0.1kW → 显示 kW；周数项单位为天
export const COOL_RUN_ITEMS = [
  { key: 'B42', label: '供液温度(℃)', scale: 10, decimals: 1, unit: '℃' },
  { key: 'B44', label: '回液温度(℃)', scale: 10, decimals: 1, unit: '℃' },
  { key: 'B46', label: '系统蒸进(℃)', scale: 10, decimals: 1, unit: '℃' },
  { key: 'B50', label: '蒸出温度(℃)', scale: 10, decimals: 1, unit: '℃' },
  { key: 'B52', label: '环境温度(℃)', scale: 10, decimals: 1, unit: '℃' },
  { key: 'B54', label: '系统冷凝(℃)', scale: 10, decimals: 1, unit: '℃' },
  { key: 'B58', label: '节流电膨当前开度(步)', scale: 1, decimals: 0, unit: '步' },
  { key: 'B60', label: '水泵当前转速(%)', scale: 1, decimals: 0, unit: '%' },
  { key: 'B62', label: '压缩机当前转速(RPS)', scale: 1, decimals: 0, unit: 'RPS' },
  { key: 'B64', label: '风机转速(RPS)', scale: 1, decimals: 0, unit: 'RPS' },
  { key: 'B72', label: '供水压力(bar)', scale: 10, decimals: 1, unit: 'bar' },
  { key: 'B74', label: '回水压力(bar)', scale: 10, decimals: 1, unit: 'bar' },
  { key: 'B78', label: '排气压力(bar)', scale: 10, decimals: 1, unit: 'bar' },
  { key: 'B100', label: '变频器故障代码', scale: 1, decimals: 0, unit: '' },
  { key: 'B104', label: '系统总故障等级', scale: 1, decimals: 0, unit: '' },
  { key: 'B106', label: '系统总故障代码', scale: 1, decimals: 0, unit: '' },
  { key: 'B112', label: '三相PFC故障号', scale: 1, decimals: 0, unit: '' },
  { key: 'B114', label: '变频器输出功率(kW)', scale: 10, decimals: 1, unit: 'kW' },
  { key: 'B116', label: '水泵累计运行小时(h)', scale: 1, decimals: 0, unit: 'h' },
  { key: 'B118', label: '水泵累计运行周数(天)', scale: 1, decimals: 0, unit: '天' },
  { key: 'B120', label: '加热累计运行小时(h)', scale: 1, decimals: 0, unit: 'h' },
  { key: 'B122', label: '加热累计运行周数(天)', scale: 1, decimals: 0, unit: '天' },
  { key: 'B124', label: '压缩机累计运行小时(h)', scale: 1, decimals: 0, unit: 'h' },
  { key: 'B126', label: '压缩机累计运行周数(天)', scale: 1, decimals: 0, unit: '天' },
  { key: 'B128', label: '风机累计运行时长(h)', scale: 1, decimals: 0, unit: 'h' },
  { key: 'B130', label: '风机累计运行周数(天)', scale: 1, decimals: 0, unit: '天' }
]

/**
 * 开关量（单字节位信号）
 *   B38/B39 为电平信号：0 低电平 / 1 高电平
 *   B41 为输出信号：0 断开 / 1 输出
 */
export const COOL_LEVEL_BITS = [
  { key: 'B38b1', label: '加热管过载', on: '高电平', off: '低电平', danger: true },
  { key: 'B38b2', label: '风机过载', on: '高电平', off: '低电平', danger: true },
  { key: 'B39b0', label: '系统高压', on: '高电平', off: '低电平', danger: true },
  { key: 'B39b2', label: '系统低压', on: '高电平', off: '低电平', danger: true },
  { key: 'B39b5', label: '液位开关', on: '高电平', off: '低电平', danger: false },
  { key: 'B39b6', label: '供水泵过载', on: '高电平', off: '低电平', danger: true }
]

export const COOL_OUTPUT_BITS = [
  { key: 'B41b3', label: '风机输出', on: '输出', off: '断开', danger: false },
  { key: 'B41b5', label: '加热管输出', on: '输出', off: '断开', danger: false },
  { key: 'B41b6', label: '报警继电器输出', on: '输出', off: '断开', danger: true },
  { key: 'B41b7', label: '加热带输出', on: '输出', off: '断开', danger: false }
]

/**
 * 故障位极性：false 表示 1=有故障、0=无故障（与点表原文一致）
 *
 * 依据：现场确认该机组此刻处于全故障状态，实测帧（2026-11-04 09:59）
 *   B86=0xFF、B87=0xFF、B88=0x3F、B89=0xFF、B90=0x0F、B91~B95=0xFF
 * 按点表「0：无故障，1：有故障」解读即绝大多数故障位为 1，与现场状态吻合。
 * 因此本页严格按点表极性显示：位为 1 → 置红。
 */
export const COOL_FAULT_ACTIVE_LOW = false

/**
 * 故障区「全 0xFF」是否表示为设备未上报
 * false：0xFF 是有效的全故障数据，必须照常判定
 * （仅控制帧 C_ 来源的 0xFF 才作为填充值丢弃，见 LiquidCoolingTab.faultWords）
 */
export const COOL_FAULT_FF_AS_UNREPORTED = false

/**
 * 故障报警字（B86~B95，每字节 8 位）
 * bits 数组下标即 bit 号，空串表示点表中该位「备用」
 */
export const COOL_FAULT_WORDS = [
  {
    key: 'B86', title: '故障字1', groupTitle: '水路与电压',
    bits: ['供水压力传感器故障', '主板IIC故障', '回水压力低故障', '供水压力过高预警', '电压过高', '电压过低', '风机驱动电流过载', '供回水压差超低报警']
  },
  {
    key: 'B87', title: '故障字2', groupTitle: '水泵驱动',
    bits: ['供水泵故障', '泵空转保护', '泵堵转保护', '泵过流故障', '泵欠压故障', '泵过压故障', '泵缺相/电流采样偏移/失步/预充故障', '泵驱动过热保护故障']
  },
  {
    key: 'B88', title: '故障字3', groupTitle: '变频器通讯',
    bits: ['风机变频器通讯故障', '压机变频器其他故障', '风机变频器其他故障', '供回水压差低报警', '', '', '', '']
  },
  {
    key: 'B89', title: '故障字4', groupTitle: '制冷系统',
    bits: ['系统低压', '电加热保护', '风机过载', '系统高压故障', '蒸发进口探头故障', '蒸发出口探头故障', '系统高压报警锁定', '压机变频器通讯故障']
  },
  {
    key: 'B90', title: '故障字5', groupTitle: '掉电与液位',
    bits: ['掉电报警', '液位故障', '', '', '', '', '', '']
  },
  {
    key: 'B91', title: '故障字6', groupTitle: '温度压力探头',
    bits: ['液温探头故障', '回液探头故障', '环境探头故障', '液温过高', '回水压力传感器故障', '排气压力传感器故障', '液温过低', '供水压力过高预警']
  },
  {
    key: 'B92', title: '故障字7', groupTitle: '压缩机保护',
    bits: ['压机运行中欠压', '压机输出缺相', '压机功率器件保护', '压机过热', '压机过载', '压机检测压机过载', '压机负载过重', '压机速度过大']
  },
  {
    key: 'B93', title: '故障字8', groupTitle: '压缩机过流',
    bits: ['压机起动瞬间过流', '压机加速运行过流', '压机减速运行过流', '压机恒速运行过流', '压机加速运行过压', '压机减速运行过压', '压机恒速运行过压', '压机待机时过压']
  },
  {
    key: 'B94', title: '故障字9', groupTitle: '转子与PFC',
    bits: ['压机中断溢出1', '压机中断溢出2', '压机启动中转子抖动过大', '压机运行中转子抖动过大', 'PFC过流', 'PFC峰值电流过大', 'PFC有效值电流过大', '']
  },
  {
    key: 'B95', title: '故障字10', groupTitle: '压缩机故障',
    bits: ['压机D轴电流过大', '压机Q轴电流过大', '压机参数存储失败', '压机通讯异常', '压机电流检测故障', '压机启动中电机堵转', '压机运行中电机堵转', '压机失速故障']
  }
]
