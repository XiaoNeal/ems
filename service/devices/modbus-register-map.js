/**
 * 171C BMS 设备 Modbus 寄存器映射表
 *
 * 规约：寄存器地址 = B 字段号 / 2
 *   例：B12 (电池簇电压) -> reg 6
 *
 * 说明：
 *   - 此映射基于 171C 协议 B 字段命名规约推导，实际部署时需对照设备 Modbus 寄存器手册确认
 *   - scale 字段表示原始值转换为工程值时的乘数
 *   - 32 位合并字段使用 combined: true 并指定 high/low 寄存器地址
 *   - status 字段为枚举映射
 */

export const MONITOR_REGISTER_MAP = [
  // === 电池簇核心测量值 ===
  { reg: 6,  field: 'B12', name: '电池簇电压',     unit: 'V',  scale: 0.1,   decimals: 1, group: 'cluster' },
  { reg: 7,  field: 'B14', name: '电池簇电流',     unit: 'A',  scale: 0.1,   decimals: 1, group: 'cluster' },
  { reg: 8,  field: 'B16', name: '电池簇总 SOC',   unit: '%',  scale: 1,     decimals: 0, group: 'cluster' },
  { reg: 9,  field: 'B18', name: '电池簇总 SOH',   unit: '%',  scale: 1,     decimals: 0, group: 'cluster' },
  { reg: 10, field: 'B20', name: '电池簇总 SOE',   unit: '%',  scale: 1,     decimals: 0, group: 'cluster' },
  { reg: 11, field: 'B22', name: '绝缘电阻 R+',   unit: 'kΩ', scale: 1,     decimals: 0, group: 'cluster' },
  { reg: 12, field: 'B24', name: '绝缘电阻 R-',   unit: 'kΩ', scale: 1,     decimals: 0, group: 'cluster' },
  {
    reg: 13, field: 'B26', name: '电池簇电池状态', unit: '',
    scale: 1, decimals: 0, group: 'cluster',
    status: {
      1: '初始化状态', 2: '自检', 3: '上电', 4: '上电完成',
      5: '禁充', 6: '禁放', 7: '待机', 8: '故障下电',
      9: '故障已清除', 10: '测试模式', 11: '单簇维护',
      12: '下电中', 13: '下电完成'
    }
  },

  // === 温度信息 ===
  { reg: 17, field: 'B34', name: '电池最高温度',   unit: '℃', scale: 0.1,   decimals: 1, group: 'temp' },
  { reg: 18, field: 'B36', name: '最高温度模块号', unit: '',  scale: 1,     decimals: 0, group: 'temp' },
  { reg: 19, field: 'B38', name: '最高温度序号',   unit: '',  scale: 1,     decimals: 0, group: 'temp' },
  { reg: 20, field: 'B40', name: '电池最低温度',   unit: '℃', scale: 0.1,   decimals: 1, group: 'temp' },
  { reg: 21, field: 'B42', name: '最低温度模块号', unit: '',  scale: 1,     decimals: 0, group: 'temp' },
  { reg: 22, field: 'B44', name: '最低温度序号',   unit: '',  scale: 1,     decimals: 0, group: 'temp' },
  { reg: 23, field: 'B46', name: '电池平均温度',   unit: '℃', scale: 0.1,   decimals: 1, group: 'temp' },
  { reg: 24, field: 'B48', name: '电池组电池总节数', unit: '', scale: 1,    decimals: 0, group: 'temp' },

  // === 单体电压信息 ===
  { reg: 25, field: 'B50', name: '单体平均电压',   unit: 'mV', scale: 1,     decimals: 0, group: 'cell' },
  { reg: 26, field: 'B52', name: '最高单体电压',   unit: 'mV', scale: 1,     decimals: 0, group: 'cell' },
  { reg: 27, field: 'B54', name: '最高电压模块号', unit: '',  scale: 1,     decimals: 0, group: 'cell' },
  { reg: 28, field: 'B56', name: '最高电压序号',   unit: '',  scale: 1,     decimals: 0, group: 'cell' },
  { reg: 29, field: 'B58', name: '最低单体电压',   unit: 'mV', scale: 1,     decimals: 0, group: 'cell' },
  { reg: 30, field: 'B60', name: '最低电压模块号', unit: '',  scale: 1,     decimals: 0, group: 'cell' },
  { reg: 31, field: 'B62', name: '最低电压序号',   unit: '',  scale: 1,     decimals: 0, group: 'cell' },

  // === 单体 SOC/SOH ===
  { reg: 32, field: 'B64', name: '单体平均 SOC',  unit: '%',  scale: 1,     decimals: 0, group: 'soc' },
  { reg: 33, field: 'B66', name: '最高单体 SOC',   unit: '%',  scale: 1,     decimals: 0, group: 'soc' },
  { reg: 36, field: 'B72', name: '最低单体 SOC',   unit: '%',  scale: 1,     decimals: 0, group: 'soc' },
  { reg: 39, field: 'B78', name: '单体平均 SOH',   unit: '%',  scale: 1,     decimals: 0, group: 'soc' },

  // === 单体内阻 ===
  { reg: 46, field: 'B92', name: '单体平均内阻',   unit: 'mΩ', scale: 1,     decimals: 0, group: 'cell' },
  { reg: 47, field: 'B94', name: '最高单体内阻',   unit: 'mΩ', scale: 1,     decimals: 0, group: 'cell' },
  { reg: 50, field: 'B100', name: '最低单体内阻',  unit: 'mΩ', scale: 1,    decimals: 0, group: 'cell' },

  // === 电池箱温度 ===
  { reg: 53, field: 'B106', name: '电池箱最高温度', unit: '℃', scale: 0.1, decimals: 1, group: 'box' },
  { reg: 56, field: 'B112', name: '电池箱最低温度', unit: '℃', scale: 0.1, decimals: 1, group: 'box' },
  { reg: 59, field: 'B118', name: '电池箱平均温度', unit: '℃', scale: 0.1, decimals: 1, group: 'box' },

  // === 累计电量（32 位合并） ===
  {
    field: 'B128', name: '累计充电电量', unit: 'kWh',
    combined: true, highReg: 64, lowReg: 65, scale: 0.1, decimals: 1, group: 'energy'
  },
  {
    field: 'B132', name: '累计放电电量', unit: 'kWh',
    combined: true, highReg: 66, lowReg: 67, scale: 0.1, decimals: 1, group: 'energy'
  },

  // === 系统/允许值 ===
  { reg: 76, field: 'B152', name: '系统运行心跳',  unit: '',   scale: 1,     decimals: 0, group: 'system' },
  { reg: 77, field: 'B154', name: '绝缘采集状态',  unit: '',
    scale: 1, decimals: 0, group: 'system',
    status: { 0: '关闭', 1: '开启' }
  },
  { reg: 82, field: 'B164', name: '最大允许充电电流', unit: 'A',  scale: 0.1, decimals: 1, group: 'limit' },
  { reg: 83, field: 'B166', name: '最大允许放电电流', unit: 'A',  scale: 0.1, decimals: 1, group: 'limit' },
  { reg: 84, field: 'B168', name: '最大允许充电功率', unit: 'kW', scale: 0.1, decimals: 1, group: 'limit' },
  { reg: 85, field: 'B170', name: '最大允许放电功率', unit: 'kW', scale: 0.1, decimals: 1, group: 'limit' },

  // === 协议版本 ===
  { reg: 104, field: 'B208', name: '协议主版本',   unit: '', scale: 1, decimals: 0, group: 'system' },
  { reg: 105, field: 'B210', name: '协议子版本',   unit: '', scale: 1, decimals: 0, group: 'system' }
]

/**
 * 控制类寄存器映射（用于下发控制指令）
 * 寄存器地址规约同上：B 字段号 / 2
 */
export const CONTROL_REGISTER_MAP = [
  {
    reg: 84, field: 'B168', name: '控制指令模式',
    type: 'switch',
    options: [
      { label: '单簇系统', value: 1 },
      { label: '并簇系统', value: 2 },
      { label: '强控模式', value: 3 }
    ]
  },
  {
    reg: 85, field: 'B170', name: '上下电控制',
    type: 'switch',
    options: [
      { label: '上电', value: 0x5555, dangerous: true },
      { label: '下电', value: 0xAAAA, dangerous: true }
    ]
  },
  {
    reg: 86, field: 'B172', name: 'DO 控制',
    type: 'switch',
    options: [
      { label: '闭合', value: 1 },
      { label: '断开', value: 0 }
    ]
  },
  {
    reg: 91, field: 'B182', name: '绝缘采集控制',
    type: 'switch',
    options: [
      { label: '开启', value: 1 },
      { label: '关闭', value: 0 },
      { label: '无效值', value: 2 }
    ]
  },
  {
    reg: 93, field: 'B186', name: '复归指令',
    type: 'switch',
    options: [
      { label: '默认状态', value: 0 },
      { label: '复归准备', value: 1 }
    ]
  },
  {
    reg: 94, field: 'B188', name: '跳机指令',
    type: 'switch',
    options: [
      { label: '默认状态', value: 0 },
      { label: '跳机', value: 1, dangerous: true }
    ]
  },
  {
    reg: 96, field: 'B192', name: '主控均衡控制',
    type: 'switch',
    options: [
      { label: '关闭均衡', value: 0 },
      { label: '开启均衡', value: 1 },
      { label: '主控自主', value: 2 }
    ]
  }
]

/**
 * 按连续地址段打包读取请求，避免单点读取消耗过多事务
 * @returns {Array<{startAddr:number, quantity:number, fields:Array}>}
 */
export function getBatchedReadPlan(map = MONITOR_REGISTER_MAP) {
  // 仅取单寄存器项（combined 项单独处理）
  const items = map.filter(p => !p.combined).slice().sort((a, b) => a.reg - b.reg)
  const plan = []
  let cur = null
  for (const it of items) {
    if (!cur) {
      cur = { startAddr: it.reg, quantity: 1, fields: [it] }
    } else {
      const expectedNext = cur.startAddr + cur.quantity
      if (it.reg === expectedNext) {
        cur.quantity++
        cur.fields.push(it)
      } else if (it.reg > expectedNext) {
        // 中间有空隙，看空隙是否可接受（≤3 个寄存器）以减少事务数
        const gap = it.reg - expectedNext
        if (gap <= 3) {
          cur.quantity += gap + 1
          cur.fields.push(it)
        } else {
          plan.push(cur)
          cur = { startAddr: it.reg, quantity: 1, fields: [it] }
        }
      } else {
        // 重叠或乱序，直接开新段
        plan.push(cur)
        cur = { startAddr: it.reg, quantity: 1, fields: [it] }
      }
    }
  }
  if (cur) plan.push(cur)
  return plan
}

// ============ 多设备类型寄存器映射注册表 ============

// 171D 储能变流器能源数据映射
// 注意：IEMS 协议解析层已完成 scale 除法（raw/protocolScale），此处 scale 设为 1
export const MONITOR_REGISTER_MAP_171D = [
  { reg: 0, field: 'B0',  name: 'DCDC故障区标志', unit: '',     scale: 1, decimals: 0, group: 'status' },
  { reg: 1, field: 'B2',  name: '系统工作状态',   unit: '',     scale: 1, decimals: 0, group: 'status' },
  { reg: 2, field: 'B4',  name: '电池工作状态',   unit: '',     scale: 1, decimals: 0, group: 'status' },
  { reg: 3, field: 'B6',  name: '电池充电状态',   unit: '',     scale: 1, decimals: 0, group: 'status' },
  { reg: 4, field: 'B8',  name: '电池电压',       unit: 'V',    scale: 1, decimals: 1, group: 'battery' },
  { reg: 5, field: 'B10', name: '电池电流',       unit: 'A',    scale: 1, decimals: 1, group: 'battery' },
  { reg: 6, field: 'B12', name: '充电功率',       unit: 'kW',   scale: 1, decimals: 0, group: 'power' },
  { reg: 7, field: 'B14', name: '放电功率',       unit: 'kW',   scale: 1, decimals: 0, group: 'power' },
  { reg: 8, field: 'B16', name: 'BUS母线电压',    unit: 'V',    scale: 1, decimals: 1, group: 'bus' },
  { reg: 9, field: 'B18', name: 'BUS+母线电压',   unit: 'V',    scale: 1, decimals: 1, group: 'bus' },
  { reg: 10, field: 'B20', name: 'BUS-母线电压',  unit: 'V',    scale: 1, decimals: 1, group: 'bus' },
  { reg: 11, field: 'B22', name: '环境温度',      unit: '℃',    scale: 1, decimals: 1, group: 'temp' },
  { reg: 16, field: 'B32', name: '协议版本',      unit: '',     scale: 1, decimals: 0, group: 'system' },
  { reg: 17, field: 'B34', name: 'DCDC固件版本',  unit: '',     scale: 1, decimals: 0, group: 'system' },
  { reg: 18, field: 'B36', name: 'DCDC软件版本',  unit: '',     scale: 1, decimals: 0, group: 'system' }
]

// 171D 控制数据映射
export const CONTROL_REGISTER_MAP_171D = [
  { reg: 0, field: 'B0',  name: 'Can波特率设置', unit: '', scale: 1, decimals: 0, group: 'control', type: 'switch',
    options: [{ label: '500K', value: 0 }, { label: '250K', value: 1 }, { label: '125K', value: 2 }, { label: '100K', value: 3 }, { label: '50K', value: 4 }] },
  { reg: 2, field: 'B4',  name: '机器类型',       unit: '', scale: 1, decimals: 0, group: 'control' },
  { reg: 4, field: 'B8',  name: '运行模式设置',   unit: '', scale: 1, decimals: 0, group: 'control' },
  { reg: 5, field: 'B10', name: '运行状态设置',   unit: '', scale: 1, decimals: 0, group: 'control' },
  { reg: 6, field: 'B12', name: '系统开关机',     unit: '', scale: 1, decimals: 0, group: 'control', type: 'switch',
    options: [{ label: '开机', value: 85 }, { label: '关机', value: 0 }] },
  { reg: 8, field: 'B16', name: '组ID号',         unit: '', scale: 1, decimals: 0, group: 'control' },
  { reg: 9, field: 'B18', name: '模块数量',       unit: '', scale: 1, decimals: 0, group: 'control' },
  { reg: 10, field: 'B20', name: '电池类型',      unit: '', scale: 1, decimals: 0, group: 'control' },
  { reg: 11, field: 'B22', name: '直流母线电压',   unit: 'V', scale: 1, decimals: 1, group: 'control' },
  { reg: 12, field: 'B24', name: '充放电指令',    unit: '', scale: 1, decimals: 0, group: 'control' },
  { reg: 13, field: 'B26', name: '充放电功率设定', unit: 'kW', scale: 1, decimals: 1, group: 'control' },
  { reg: 14, field: 'B28', name: '电池均充电压',  unit: 'V', scale: 1, decimals: 1, group: 'control' },
  { reg: 16, field: 'B32', name: '电池浮充电压',  unit: 'V', scale: 1, decimals: 1, group: 'control' },
  { reg: 17, field: 'B34', name: '放电电压设置',  unit: 'V', scale: 1, decimals: 1, group: 'control' },
  { reg: 18, field: 'B36', name: '放电电流设置',  unit: 'A', scale: 1, decimals: 1, group: 'control' }
]

// 171B PCS 交流模块能源数据映射
// 基于 protocols/171B.js energyDataFields，IEMS 协议已完成缩放
export const MONITOR_REGISTER_MAP_171B = [
  { reg: 0,  field: 'B0',  name: 'A相电压',       unit: 'V',    scale: 1, decimals: 1, group: 'voltage' },
  { reg: 1,  field: 'B2',  name: 'A相电流',       unit: 'A',    scale: 1, decimals: 1, group: 'current' },
  { reg: 2,  field: 'B4',  name: 'B相电压',       unit: 'V',    scale: 1, decimals: 1, group: 'voltage' },
  { reg: 3,  field: 'B6',  name: 'B相电流',       unit: 'A',    scale: 1, decimals: 1, group: 'current' },
  { reg: 4,  field: 'B8',  name: 'C相电压',       unit: 'V',    scale: 1, decimals: 1, group: 'voltage' },
  { reg: 5,  field: 'B10', name: 'C相电流',       unit: 'A',    scale: 1, decimals: 1, group: 'current' },
  { reg: 6,  field: 'B12', name: 'AB线电压',      unit: 'V',    scale: 1, decimals: 1, group: 'lineVoltage' },
  { reg: 8,  field: 'B16', name: 'BC线电压',      unit: 'V',    scale: 1, decimals: 1, group: 'lineVoltage' },
  { reg: 10, field: 'B20', name: 'CA线电压',      unit: 'V',    scale: 1, decimals: 1, group: 'lineVoltage' },
  { reg: 12, field: 'B24', name: 'A相有功功率',   unit: 'kW',   scale: 1, decimals: 2, group: 'power' },
  { reg: 13, field: 'B26', name: 'A相无功功率',   unit: 'kVar', scale: 1, decimals: 2, group: 'power' },
  { reg: 14, field: 'B28', name: 'B相有功功率',   unit: 'kW',   scale: 1, decimals: 2, group: 'power' },
  { reg: 15, field: 'B30', name: 'B相无功功率',   unit: 'kVar', scale: 1, decimals: 2, group: 'power' },
  { reg: 16, field: 'B32', name: 'C相有功功率',   unit: 'kW',   scale: 1, decimals: 2, group: 'power' },
  { reg: 17, field: 'B34', name: 'C相无功功率',   unit: 'kVar', scale: 1, decimals: 2, group: 'power' },
  { reg: 18, field: 'B36', name: '交流频率',      unit: 'Hz',   scale: 1, decimals: 1, group: 'acSide' },
  { reg: 20, field: 'B40', name: '模块面板温度',  unit: '℃',    scale: 1, decimals: 1, group: 'acSide' },
  { reg: 22, field: 'B44', name: '总有功功率',    unit: 'kW',   scale: 1, decimals: 2, group: 'acSide' },
  { reg: 24, field: 'B48', name: '总无功功率',    unit: 'kVar', scale: 1, decimals: 2, group: 'acSide' },
  { reg: 26, field: 'B52', name: '总视在功率',    unit: 'kVA',  scale: 1, decimals: 2, group: 'acSide' },
  { reg: 28, field: 'B56', name: '直流侧电压',    unit: 'V',    scale: 1, decimals: 1, group: 'dcSide' },
  { reg: 29, field: 'B58', name: '直流侧电流',    unit: 'A',    scale: 1, decimals: 1, group: 'dcSide' },
  { reg: 32, field: 'B64', name: '告警状态',      unit: '',     scale: 1, decimals: 0, group: 'status' },
  { reg: 41, field: 'B82', name: '软件版本号',    unit: '',     scale: 1, decimals: 0, group: 'system' }
]

// 171E 光伏整流模块能源数据映射
// 基于 protocols/171E.js energyDataFields，IEMS 协议已完成缩放
export const MONITOR_REGISTER_MAP_171E = [
  { reg: 0,  field: 'B0',  name: '模块电压',      unit: 'V',    scale: 1, decimals: 1, group: 'electrical' },
  { reg: 2,  field: 'B4',  name: '模块电流',      unit: 'A',    scale: 1, decimals: 1, group: 'electrical' },
  { reg: 4,  field: 'B8',  name: '模块限流点',    unit: 'A',    scale: 1, decimals: 1, group: 'electrical' },
  { reg: 6,  field: 'B12', name: 'DC板温度',      unit: '℃',    scale: 1, decimals: 1, group: 'electrical' },
  { reg: 8,  field: 'B16', name: '输入相电压',    unit: 'V',    scale: 1, decimals: 1, group: 'electrical' },
  { reg: 10, field: 'B20', name: 'PFC0电压',      unit: 'V',    scale: 1, decimals: 1, group: 'electrical' },
  { reg: 12, field: 'B24', name: 'PFC1电压',      unit: 'V',    scale: 1, decimals: 1, group: 'electrical' },
  { reg: 14, field: 'B28', name: '面板温度',      unit: '℃',    scale: 1, decimals: 1, group: 'electrical' },
  { reg: 22, field: 'B44', name: 'PFC板温度',     unit: '℃',    scale: 1, decimals: 1, group: 'electrical' },
  { reg: 32, field: 'B64', name: '输入功率',      unit: 'kW',   scale: 1, decimals: 2, group: 'electrical' },
  { reg: 28, field: 'B56', name: '告警状态',      unit: '',     scale: 1, decimals: 0, group: 'status' },
  { reg: 30, field: 'B60', name: '组号与地址',    unit: '',     scale: 1, decimals: 0, group: 'status' },
  { reg: 36, field: 'B72', name: '工作模式',      unit: '',     scale: 1, decimals: 0, group: 'status' },
  { reg: 38, field: 'B76', name: 'SerialNo低位',  unit: '',     scale: 1, decimals: 0, group: 'info' },
  { reg: 40, field: 'B80', name: 'SerialNo高位',  unit: '',     scale: 1, decimals: 0, group: 'info' },
  { reg: 42, field: 'B84', name: 'DCDC版本号',    unit: '',     scale: 1, decimals: 0, group: 'info' },
  { reg: 44, field: 'B88', name: 'PFC版本号',     unit: '',     scale: 1, decimals: 0, group: 'info' }
]

// 1707 V3.5 PCS 储能变流器能源数据映射（实际协议）
// 字段对齐 1707V3_5-model.js EnergyData，模型层已完成缩放（÷10/÷100/÷1000），此处 scale=1
export const MONITOR_REGISTER_MAP_1707 = [
  // === 端口电压 / 输出电流 ===
  { reg: 0,  field: 'B0',  name: 'A相电压',       unit: 'V',    scale: 1, decimals: 1, group: 'voltage' },
  { reg: 1,  field: 'B2',  name: 'B相电压',       unit: 'V',    scale: 1, decimals: 1, group: 'voltage' },
  { reg: 2,  field: 'B4',  name: 'C相电压',       unit: 'V',    scale: 1, decimals: 1, group: 'voltage' },
  { reg: 3,  field: 'B6',  name: 'A相电流',       unit: 'A',    scale: 1, decimals: 1, group: 'current' },
  { reg: 4,  field: 'B8',  name: 'B相电流',       unit: 'A',    scale: 1, decimals: 1, group: 'current' },
  { reg: 5,  field: 'B10', name: 'C相电流',       unit: 'A',    scale: 1, decimals: 1, group: 'current' },
  // === 频率 / 温度 ===
  { reg: 6,  field: 'B12', name: '电网频率',      unit: 'Hz',   scale: 1, decimals: 2, group: 'acSide' },
  { reg: 26, field: 'B52', name: '散热器温度',    unit: '℃',    scale: 1, decimals: 0, group: 'acSide' },
  // === 有功功率 A/B/C/总 ===
  { reg: 7,  field: 'B14', name: 'A相有功功率',   unit: 'kW',   scale: 1, decimals: 1, group: 'power' },
  { reg: 8,  field: 'B16', name: 'B相有功功率',   unit: 'kW',   scale: 1, decimals: 1, group: 'power' },
  { reg: 9,  field: 'B18', name: 'C相有功功率',   unit: 'kW',   scale: 1, decimals: 1, group: 'power' },
  { reg: 10, field: 'B20', name: '总有功功率',    unit: 'kW',   scale: 1, decimals: 1, group: 'power' },
  // === 无功功率 A/B/C/总 ===
  { reg: 11, field: 'B22', name: 'A相无功功率',   unit: 'kVar', scale: 1, decimals: 1, group: 'power' },
  { reg: 12, field: 'B24', name: 'B相无功功率',   unit: 'kVar', scale: 1, decimals: 1, group: 'power' },
  { reg: 13, field: 'B26', name: 'C相无功功率',   unit: 'kVar', scale: 1, decimals: 1, group: 'power' },
  { reg: 14, field: 'B28', name: '总无功功率',    unit: 'kVar', scale: 1, decimals: 1, group: 'power' },
  // === 视在功率 A/B/C/总 ===
  { reg: 15, field: 'B30', name: 'A相视在功率',   unit: 'kVA',  scale: 1, decimals: 1, group: 'power' },
  { reg: 16, field: 'B32', name: 'B相视在功率',   unit: 'kVA',  scale: 1, decimals: 1, group: 'power' },
  { reg: 17, field: 'B34', name: 'C相视在功率',   unit: 'kVA',  scale: 1, decimals: 1, group: 'power' },
  { reg: 18, field: 'B36', name: '总视在功率',    unit: 'kVA',  scale: 1, decimals: 1, group: 'power' },
  // === 功率因数 A/B/C/总 ===
  { reg: 19, field: 'B38', name: 'A相功率因数',   unit: '',     scale: 1, decimals: 3, group: 'power' },
  { reg: 20, field: 'B40', name: 'B相功率因数',   unit: '',     scale: 1, decimals: 3, group: 'power' },
  { reg: 21, field: 'B42', name: 'C相功率因数',   unit: '',     scale: 1, decimals: 3, group: 'power' },
  { reg: 22, field: 'B44', name: '总功率因数',    unit: '',     scale: 1, decimals: 3, group: 'power' },
  // === 直流（输入）侧 ===
  { reg: 23, field: 'B46', name: '输入功率',      unit: 'kW',   scale: 1, decimals: 1, group: 'dcSide' },
  { reg: 24, field: 'B48', name: '输入电压',      unit: 'V',    scale: 1, decimals: 1, group: 'dcSide' },
  { reg: 25, field: 'B50', name: '输入电流',      unit: 'A',    scale: 1, decimals: 1, group: 'dcSide' },
  // === BMS/CMS 数据（PCS 帧内转发）===
  { reg: 74, field: 'B148', name: 'BMS工作指令',  unit: '',     scale: 1, decimals: 0, group: 'bms' },
  { reg: 75, field: 'B150', name: '允许充电电流', unit: 'A',    scale: 1, decimals: 1, group: 'bms' },
  { reg: 76, field: 'B152', name: '允许放电电流', unit: 'A',    scale: 1, decimals: 1, group: 'bms' },
  { reg: 77, field: 'B154', name: 'SOC',          unit: '%',    scale: 1, decimals: 1, group: 'bms' },
  { reg: 78, field: 'B156', name: '可充电电量',   unit: 'kWh',  scale: 1, decimals: 1, group: 'bms' },
  { reg: 79, field: 'B158', name: '可放电电量',   unit: 'kWh',  scale: 1, decimals: 1, group: 'bms' },
  { reg: 80, field: 'B160', name: '总电压',       unit: 'V',    scale: 1, decimals: 1, group: 'bms' },
  { reg: 81, field: 'B162', name: '总电流',       unit: 'A',    scale: 1, decimals: 1, group: 'bms' },
  { reg: 82, field: 'B164', name: '单体最高SOC',  unit: '%',    scale: 1, decimals: 1, group: 'bms' },
  { reg: 83, field: 'B166', name: '单体最低SOC',  unit: '%',    scale: 1, decimals: 1, group: 'bms' },
  { reg: 84, field: 'B168', name: '单体最高电压', unit: 'V',    scale: 1, decimals: 1, group: 'bms' },
  { reg: 85, field: 'B170', name: '单体最低电压', unit: 'V',    scale: 1, decimals: 1, group: 'bms' },
  { reg: 86, field: 'B172', name: '单体最高温度', unit: '℃',    scale: 1, decimals: 1, group: 'bms' },
  { reg: 87, field: 'B174', name: '单体最低温度', unit: '℃',    scale: 1, decimals: 1, group: 'bms' },
  { reg: 88, field: 'B176', name: '允许充电功率', unit: 'kW',   scale: 1, decimals: 1, group: 'bms' },
  { reg: 89, field: 'B178', name: '允许放电功率', unit: 'kW',   scale: 1, decimals: 1, group: 'bms' },
  // === 系统信息 ===
  { reg: 35, field: 'B70', name: '通讯状态字',    unit: '',     scale: 1, decimals: 0, group: 'system' },
  { reg: 42, field: 'B84', name: 'PCS程序版本',   unit: '',     scale: 1, decimals: 1, group: 'system' },
  { reg: 43, field: 'B86', name: 'FPGA程序版本',  unit: '',     scale: 1, decimals: 0, group: 'system' }
]

// 170C V1.1 储能 DC-DC 变流器能源数据映射（实际协议）
// 字段对齐 170C_V1_1-model.js EnergyData，云端数据已为工程值，此处 scale=1
export const MONITOR_REGISTER_MAP_170C = [
  // === 参数给定 / 限制 ===
  { reg: 0,  field: 'B0',  name: 'BAT侧电压给定', unit: 'V',    scale: 1, decimals: 1, group: 'set' },
  { reg: 1,  field: 'B2',  name: '最大充电电流限制', unit: 'A', scale: 1, decimals: 1, group: 'set' },
  { reg: 2,  field: 'B4',  name: '最大放电电流限制', unit: 'A', scale: 1, decimals: 1, group: 'set' },
  { reg: 3,  field: 'B6',  name: 'BUS侧电压给定', unit: 'V',    scale: 1, decimals: 1, group: 'set' },
  { reg: 4,  field: 'B8',  name: 'BUS侧电流给定', unit: 'A',    scale: 1, decimals: 1, group: 'set' },
  { reg: 5,  field: 'B10', name: '下垂电压系数',  unit: 'V',    scale: 1, decimals: 1, group: 'set' },
  // === 电池侧实时量 ===
  { reg: 15, field: 'B30', name: 'BAT侧电压',     unit: 'V',    scale: 1, decimals: 1, group: 'battery' },
  { reg: 18, field: 'B36', name: 'BAT侧电流',     unit: 'A',    scale: 1, decimals: 1, group: 'battery' },
  // === BUS 侧实时量 ===
  { reg: 16, field: 'B32', name: 'BUS侧电压',     unit: 'V',    scale: 1, decimals: 1, group: 'bus' },
  { reg: 17, field: 'B34', name: 'BUS侧电流',     unit: 'A',    scale: 1, decimals: 1, group: 'bus' },
  // === 功率 / 温度 / 电量 ===
  { reg: 6,  field: 'B12', name: '最大功率限制',  unit: 'kW',   scale: 1, decimals: 1, group: 'power' },
  { reg: 20, field: 'B40', name: '允许运行功率',  unit: 'kW',   scale: 1, decimals: 1, group: 'power' },
  { reg: 21, field: 'B42', name: '当前运行功率',  unit: 'kW',   scale: 1, decimals: 1, group: 'power' },
  { reg: 19, field: 'B38', name: '模块最高温度',  unit: '℃',    scale: 1, decimals: 0, group: 'temp' },
  { reg: 22, field: 'B44', name: '累积电量',      unit: 'kWh',  scale: 1, decimals: 1, group: 'power' },
  // === 保护参数 ===
  { reg: 7,  field: 'B14', name: 'BAT侧欠压保护点', unit: 'V',  scale: 1, decimals: 1, group: 'protect' },
  { reg: 8,  field: 'B16', name: 'BAT侧过压保护点', unit: 'V',  scale: 1, decimals: 1, group: 'protect' },
  { reg: 9,  field: 'B18', name: 'BUS侧欠压保护点', unit: 'V',  scale: 1, decimals: 1, group: 'protect' },
  { reg: 10, field: 'B20', name: 'BUS侧过压保护点', unit: 'V',  scale: 1, decimals: 1, group: 'protect' },
  { reg: 11, field: 'B22', name: 'BAT侧充电过流保护点', unit: 'A', scale: 1, decimals: 1, group: 'protect' },
  { reg: 12, field: 'B24', name: 'BAT侧放电过流保护点', unit: 'A', scale: 1, decimals: 1, group: 'protect' },
  { reg: 13, field: 'B26', name: 'BUS侧充电过流保护点', unit: 'A', scale: 1, decimals: 1, group: 'protect' },
  { reg: 14, field: 'B28', name: 'BUS侧放电过流保护点', unit: 'A', scale: 1, decimals: 1, group: 'protect' }
]

/**
 * 设备类型 → 寄存器映射注册表
 * key: 设备类型十六进制字符串 (如 '171C', '171D', '171F')
 * value: { monitor: [...], control: [...] }
 */
export const DEVICE_REGISTER_MAP = {
  '1707': { monitor: MONITOR_REGISTER_MAP_1707, control: [] },
  '170C': { monitor: MONITOR_REGISTER_MAP_170C, control: [] },
  // 50kW bucket key 别名（与 _normalizeDeviceType 输出一致）——复用基类映射，前缀匹配自动处理
  '170C_STORAGE': { monitor: MONITOR_REGISTER_MAP_170C, control: [] },
  '170C_PV': { monitor: MONITOR_REGISTER_MAP_170C, control: [] },
  '171B': { monitor: MONITOR_REGISTER_MAP_171B, control: [] },
  '171C': { monitor: MONITOR_REGISTER_MAP, control: CONTROL_REGISTER_MAP },
  // 50kW BMS V2：目前复用 171C 旧协议寄存器（直连 50kW 监控面板仍显示旧协议字段，
  // 设置面板走 SETTINGS_PANELS_50KW 的独立定义）
  '171C_V2': { monitor: MONITOR_REGISTER_MAP, control: CONTROL_REGISTER_MAP },
  '171D': { monitor: MONITOR_REGISTER_MAP_171D, control: CONTROL_REGISTER_MAP_171D },
  '171E': { monitor: MONITOR_REGISTER_MAP_171E, control: [] },
  '171F': { monitor: MONITOR_REGISTER_MAP, control: CONTROL_REGISTER_MAP }, // 171F 复用 171C 映射
  // 液冷机 0318_V2_3：目前无专用监控寄存器映射，回退时不会再误落到 171C 旧协议
  '0318': { monitor: [], control: [] },
}

/**
 * 根据设备类型获取对应的寄存器映射
 */
export function getRegisterMap(deviceType) {
  const hex = String(deviceType || '').toUpperCase()
  // 直接命中
  if (DEVICE_REGISTER_MAP[hex]) return DEVICE_REGISTER_MAP[hex]
  // 前缀匹配（如 '171D_000A' → '171D'）
  for (const key of Object.keys(DEVICE_REGISTER_MAP)) {
    if (hex.startsWith(key) || key.startsWith(hex)) {
      return DEVICE_REGISTER_MAP[key]
    }
  }
  // 默认回退到 171C
  return { monitor: MONITOR_REGISTER_MAP, control: CONTROL_REGISTER_MAP }
}
