import { parseStruct, structBytes, createFields, C_TYPE, combine32LH } from './protocol-utils'

// 171C_000A 协议 - BMS电池簇管理
// EnergyData: 212 bytes (B0-B210)
// EnergyControlData: 226 bytes (B0-B224)
// SpecialData: 180 bytes (3组故障记录)

const energyDataFields = createFields([
  // B0-B10: 报警位域 (11字节)
  { name: 'B0', cType: C_TYPE.UINT8, bitfield: true, desc: '组端过压/欠压/放电过流报警' },
  { name: 'B1', cType: C_TYPE.UINT8, bitfield: true, desc: '充电过流/绝缘/充电过温报警' },
  { name: 'B2', cType: C_TYPE.UINT8, bitfield: true, desc: '充电过温/欠温/电压过压报警' },
  { name: 'B3', cType: C_TYPE.UINT8, bitfield: true, desc: '电压欠压/压差/温差报警' },
  { name: 'B4', cType: C_TYPE.UINT8, bitfield: true, desc: '温差/SOC过低/插箱温度/模组过压报警' },
  { name: 'B5', cType: C_TYPE.UINT8, bitfield: true, desc: '模组欠压/DI故障报警' },
  { name: 'B6', cType: C_TYPE.UINT8, bitfield: true, desc: 'DI故障/通讯失联/采集异常' },
  { name: 'B7', cType: C_TYPE.UINT8, bitfield: true, desc: '显控/簇间/PCS/CAN故障' },
  { name: 'B8', cType: C_TYPE.UINT8, bitfield: true, desc: 'CAN通讯/自检/线束/均衡/EMS/BMS故障' },
  { name: 'B9', cType: C_TYPE.UINT8, bitfield: true, desc: '放电过温/欠温/SOC过高/温升快报警' },
  { name: 'B10', cType: C_TYPE.UINT8, bitfield: true, bitMask: [0, 1], desc: '温升快报警2级/3级' },
  { name: 'B11', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  // B12-B26: 电池簇基本数据
  { name: 'B12', cType: C_TYPE.UINT16, scale: 10, desc: '电池簇电压' },
  { name: 'B14', cType: C_TYPE.UINT16, scale: 10, offset: -1600, desc: '电池簇电流值' },
  { name: 'B16', cType: C_TYPE.UINT16, scale: 10, desc: '电池簇总SOC' },
  { name: 'B18', cType: C_TYPE.UINT16, desc: '电池簇总SOH' },
  { name: 'B20', cType: C_TYPE.UINT16, scale: 10, desc: '电池簇总SOE' },
  { name: 'B22', cType: C_TYPE.UINT16, desc: '电池簇绝缘电阻R+' },
  { name: 'B24', cType: C_TYPE.UINT16, desc: '电池簇绝缘电阻R-' },
  { name: 'B26', cType: C_TYPE.UINT16, desc: '电池簇电池状态' },
  // B28-B30: DI/DO状态位域
  { name: 'B28', cType: C_TYPE.UINT8, bitfield: true, desc: 'DI1-DI8状态' },
  { name: 'B29', cType: C_TYPE.UINT8, bitfield: true, bitMask: [0], desc: 'SLP信号' },
  { name: 'B30', cType: C_TYPE.UINT8, bitfield: true, desc: 'DO1-DO8输出状态' },
  { name: 'B31', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  // B32-B50: 温度/电压/SOC数据
  { name: 'B32', cType: C_TYPE.UINT16, desc: '实际温度采集点数' },
  { name: 'B34', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '电池最高温度' },
  { name: 'B36', cType: C_TYPE.UINT16, desc: '电池最高温度所在模块号' },
  { name: 'B38', cType: C_TYPE.UINT16, desc: '电池最高温度模块内序号' },
  { name: 'B40', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '电池最低温度' },
  { name: 'B42', cType: C_TYPE.UINT16, desc: '电池最低温度所在模块号' },
  { name: 'B44', cType: C_TYPE.UINT16, desc: '电池最低温度模块内序号' },
  { name: 'B46', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '电池平均温度' },
  { name: 'B48', cType: C_TYPE.UINT16, desc: '电池组电池总节数' },
  { name: 'B50', cType: C_TYPE.UINT16, scale: 1000, desc: '单体平均电压' },
  { name: 'B52', cType: C_TYPE.UINT16, scale: 1000, desc: '最高单体电压' },
  { name: 'B54', cType: C_TYPE.UINT16, desc: '最高单体电压所在模块号' },
  { name: 'B56', cType: C_TYPE.UINT16, desc: '最高单体电压模块内序号' },
  { name: 'B58', cType: C_TYPE.UINT16, scale: 1000, desc: '最低单体电压' },
  { name: 'B60', cType: C_TYPE.UINT16, desc: '最低单体电压所在模块号' },
  { name: 'B62', cType: C_TYPE.UINT16, desc: '最低单体电压模块内序号' },
  { name: 'B64', cType: C_TYPE.UINT16, scale: 10, desc: '单体平均SOC' },
  { name: 'B66', cType: C_TYPE.UINT16, scale: 10, desc: '最高单体SOC' },
  { name: 'B68', cType: C_TYPE.UINT16, desc: '最高单体SOC所在模块号' },
  { name: 'B70', cType: C_TYPE.UINT16, desc: '最高单体SOC模块内序号' },
  { name: 'B72', cType: C_TYPE.UINT16, scale: 10, desc: '最低单体SOC' },
  { name: 'B74', cType: C_TYPE.UINT16, desc: '最低单体SOC所在模块号' },
  { name: 'B76', cType: C_TYPE.UINT16, desc: '最低单体SOC模块内序号' },
  { name: 'B78', cType: C_TYPE.UINT16, desc: '单体平均SOH' },
  { name: 'B80', cType: C_TYPE.UINT16, desc: '最高单体SOH' },
  { name: 'B82', cType: C_TYPE.UINT16, desc: '最高单体SOH所在模块号' },
  { name: 'B84', cType: C_TYPE.UINT16, desc: '最高单体SOH模块内序号' },
  { name: 'B86', cType: C_TYPE.UINT16, desc: '最低单体SOH' },
  { name: 'B88', cType: C_TYPE.UINT16, desc: '最低单体SOH所在模块号' },
  { name: 'B90', cType: C_TYPE.UINT16, desc: '最低单体SOH模块内序号' },
  { name: 'B92', cType: C_TYPE.UINT16, desc: '单体平均内阻' },
  { name: 'B94', cType: C_TYPE.UINT16, desc: '最高单体内阻' },
  { name: 'B96', cType: C_TYPE.UINT16, desc: '最高单体内阻所在模块号' },
  { name: 'B98', cType: C_TYPE.UINT16, desc: '最高单体内阻模块内序号' },
  { name: 'B100', cType: C_TYPE.UINT16, desc: '最低单体内阻' },
  { name: 'B102', cType: C_TYPE.UINT16, desc: '最低单体内阻所在模块号' },
  { name: 'B104', cType: C_TYPE.UINT16, desc: '最低单体内阻模块内序号' },
  // B106-B126: 电池箱温度/模组电压
  { name: 'B106', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '电池箱最高温度' },
  { name: 'B108', cType: C_TYPE.UINT16, desc: '电池箱最高温度所在模块号' },
  { name: 'B110', cType: C_TYPE.UINT16, desc: '电池箱最高温度模块内序号' },
  { name: 'B112', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '电池箱最低温度' },
  { name: 'B114', cType: C_TYPE.UINT16, desc: '电池箱最低温度所在模块号' },
  { name: 'B116', cType: C_TYPE.UINT16, desc: '电池箱最低温度模块内序号' },
  { name: 'B118', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '电池箱平均温度' },
  { name: 'B120', cType: C_TYPE.UINT16, scale: 10, desc: '电池模组最高电压值' },
  { name: 'B122', cType: C_TYPE.UINT16, desc: '电池模组最高电压序号' },
  { name: 'B124', cType: C_TYPE.UINT16, scale: 10, desc: '电池模组最低电压值' },
  { name: 'B126', cType: C_TYPE.UINT16, desc: '电池模组最低电压序号' },
  // B128-B150: 电量统计
  { name: 'B128', cType: C_TYPE.UINT32, scale: 10, desc: '累计充电电量', read: combine32LH },
  { name: 'B132', cType: C_TYPE.UINT32, scale: 10, desc: '累计放电电量', read: combine32LH },
  { name: 'B136', cType: C_TYPE.UINT16, scale: 10, desc: '单次充电电量' },
  { name: 'B138', cType: C_TYPE.UINT16, scale: 10, desc: '单次放电电量' },
  { name: 'B140', cType: C_TYPE.UINT16, desc: '累计充电次数' },
  { name: 'B142', cType: C_TYPE.UINT16, desc: '累计放电次数' },
  { name: 'B144', cType: C_TYPE.UINT16, scale: 10, desc: '电池组负载电压' },
  { name: 'B146', cType: C_TYPE.UINT16, scale: 10, desc: '电池组总电压-备用1' },
  { name: 'B148', cType: C_TYPE.UINT16, scale: 10, offset: -1600, desc: '电池组电流值-备用1' },
  { name: 'B150', cType: C_TYPE.UINT16, scale: 10, offset: -1600, desc: '电池组电流值-备用2' },
  // B152-B156: 系统状态
  { name: 'B152', cType: C_TYPE.UINT16, desc: '系统运行心跳' },
  { name: 'B154', cType: C_TYPE.UINT16, desc: '绝缘采集状态' },
  { name: 'B156', cType: C_TYPE.UINT8, bitfield: true, bitMask: [0, 1, 2, 3, 4], desc: '禁充/禁放/告警/充满/放空标志' },
  { name: 'B157', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  // B158-B210: 告警/允许值/节号
  { name: 'B158', cType: C_TYPE.UINT16, desc: '系统告警状态-故障码' },
  { name: 'B160', cType: C_TYPE.UINT16, desc: '系统告警状态-禁充禁放解除条件' },
  { name: 'B162', cType: C_TYPE.UINT16, desc: '系统告警状态-禁充禁放解除时间' },
  { name: 'B164', cType: C_TYPE.UINT16, scale: 10, desc: '最大允许充电电流' },
  { name: 'B166', cType: C_TYPE.UINT16, scale: 10, desc: '最大允许放电电流' },
  { name: 'B168', cType: C_TYPE.UINT16, scale: 10, desc: '最大允许充电功率' },
  { name: 'B170', cType: C_TYPE.UINT16, scale: 10, desc: '最大允许放电功率' },
  { name: 'B172', cType: C_TYPE.UINT16, desc: '最大单体电压节号' },
  { name: 'B174', cType: C_TYPE.UINT16, desc: '最小单体电压节号' },
  { name: 'B176', cType: C_TYPE.UINT16, desc: '最大单体温度节号' },
  { name: 'B178', cType: C_TYPE.UINT16, desc: '最小单体温度节号' },
  { name: 'B180', cType: C_TYPE.UINT16, desc: '最大SOC节号' },
  { name: 'B182', cType: C_TYPE.UINT16, desc: '最小SOC节号' },
  { name: 'B184', cType: C_TYPE.UINT16, desc: '最大SOH节号' },
  { name: 'B186', cType: C_TYPE.UINT16, desc: '最小SOH节号' },
  { name: 'B188', cType: C_TYPE.UINT16, desc: '最大电池内阻节号' },
  { name: 'B190', cType: C_TYPE.UINT16, desc: '最小电池内阻节号' },
  { name: 'B192', cType: C_TYPE.UINT32, scale: 10, desc: '单日累计充电电量', read: combine32LH },
  { name: 'B196', cType: C_TYPE.UINT32, scale: 10, desc: '单日累计放电电量', read: combine32LH },
  { name: 'B200', cType: C_TYPE.UINT16, offset: -40, desc: '主控采集NTC温度1' },
  { name: 'B202', cType: C_TYPE.UINT16, offset: -40, desc: '主控采集NTC温度2' },
  { name: 'B204', cType: C_TYPE.UINT16, offset: -40, desc: '主控采集NTC温度3' },
  { name: 'B206', cType: C_TYPE.UINT16, offset: -40, desc: '主控采集NTC温度4' },
  { name: 'B208', cType: C_TYPE.UINT16, desc: '通讯协议版本号主版本' },
  { name: 'B210', cType: C_TYPE.UINT16, desc: '通讯协议版本号子版本' },
])

const energyControlDataFields = createFields([
  // B0-B30: 报警阈值 (电压/电流/温度)
  { name: 'B0', cType: C_TYPE.UINT16, scale: 10, desc: '组端过压1级报警阈值' },
  { name: 'B2', cType: C_TYPE.UINT16, scale: 10, desc: '组端过压2级报警阈值' },
  { name: 'B4', cType: C_TYPE.UINT16, scale: 10, desc: '组端过压3级报警阈值' },
  { name: 'B6', cType: C_TYPE.UINT16, scale: 10, desc: '组端过压报警回差值' },
  { name: 'B8', cType: C_TYPE.UINT16, scale: 10, desc: '组端欠压1级报警阈值' },
  { name: 'B10', cType: C_TYPE.UINT16, scale: 10, desc: '组端欠压2级报警阈值' },
  { name: 'B12', cType: C_TYPE.UINT16, scale: 10, desc: '组端欠压3级报警阈值' },
  { name: 'B14', cType: C_TYPE.UINT16, scale: 10, desc: '组端欠压报警回差值' },
  { name: 'B16', cType: C_TYPE.UINT16, scale: 10, desc: '组端放电过流1级报警阈值' },
  { name: 'B18', cType: C_TYPE.UINT16, scale: 10, desc: '组端放电过流2级报警阈值' },
  { name: 'B20', cType: C_TYPE.UINT16, scale: 10, desc: '组端放电过流3级报警阈值' },
  { name: 'B22', cType: C_TYPE.UINT16, scale: 10, desc: '组端放电过流报警回差值' },
  { name: 'B24', cType: C_TYPE.UINT16, scale: 10, desc: '组端充电过流1级报警阈值' },
  { name: 'B26', cType: C_TYPE.UINT16, scale: 10, desc: '组端充电过流2级报警阈值' },
  { name: 'B28', cType: C_TYPE.UINT16, scale: 10, desc: '组端充电过流3级报警阈值' },
  { name: 'B30', cType: C_TYPE.UINT16, scale: 10, desc: '组端充电过流报警回差值' },
  // B32-B38: 绝缘报警
  { name: 'B32', cType: C_TYPE.UINT16, desc: '组端绝缘1级报警阈值' },
  { name: 'B34', cType: C_TYPE.UINT16, desc: '组端绝缘2级报警阈值' },
  { name: 'B36', cType: C_TYPE.UINT16, desc: '组端绝缘3级报警阈值' },
  { name: 'B38', cType: C_TYPE.UINT16, desc: '组端绝缘报警回差值' },
  // B40-B54: 温度报警
  { name: 'B40', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体充电过温1级报警阈值' },
  { name: 'B42', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体充电过温2级报警阈值' },
  { name: 'B44', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体充电过温3级报警阈值' },
  { name: 'B46', cType: C_TYPE.UINT16, scale: 10, desc: '电池充电过温报警回差值' },
  { name: 'B48', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体充电欠温1级报警阈值' },
  { name: 'B50', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体充电欠温2级报警阈值' },
  { name: 'B52', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体充电欠温3级报警阈值' },
  { name: 'B54', cType: C_TYPE.UINT16, scale: 10, desc: '电池充电欠温报警回差值' },
  // B56-B78: 电压/温度差/SOC报警
  { name: 'B56', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压过压1级报警阈值' },
  { name: 'B58', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压过压2级报警阈值' },
  { name: 'B60', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压过压3级报警阈值' },
  { name: 'B62', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压过压报警回差值' },
  { name: 'B64', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压欠压1级报警阈值' },
  { name: 'B66', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压欠压2级报警阈值' },
  { name: 'B68', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压欠压3级报警阈值' },
  { name: 'B70', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压欠压报警回差值' },
  { name: 'B72', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压差压1级报警阈值' },
  { name: 'B74', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压差压2级报警阈值' },
  { name: 'B76', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压差压3级报警阈值' },
  { name: 'B78', cType: C_TYPE.UINT16, scale: 1000, desc: '单体电压差压报警回差值' },
  // B80-B94: 温度差/SOC过低/插箱温度报警
  { name: 'B80', cType: C_TYPE.UINT16, scale: 10, desc: '单体温度温差1级报警阈值' },
  { name: 'B82', cType: C_TYPE.UINT16, scale: 10, desc: '单体温度温差2级报警阈值' },
  { name: 'B84', cType: C_TYPE.UINT16, scale: 10, desc: '单体温度温差3级报警阈值' },
  { name: 'B86', cType: C_TYPE.UINT16, scale: 10, desc: '单体温度温差报警回差值' },
  { name: 'B88', cType: C_TYPE.UINT16, desc: 'SOC过低1级报警阈值' },
  { name: 'B90', cType: C_TYPE.UINT16, desc: 'SOC过低2级报警阈值' },
  { name: 'B92', cType: C_TYPE.UINT16, desc: 'SOC过低3级报警阈值' },
  { name: 'B94', cType: C_TYPE.UINT16, desc: 'SOC过低报警回差值' },
  // B96-B118: 插箱/模组/放电温度报警
  { name: 'B96', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '动力插箱温度过高1级报警阈值' },
  { name: 'B98', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '动力插箱温度过高2级报警阈值' },
  { name: 'B100', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '动力插箱温度过高3级报警阈值' },
  { name: 'B102', cType: C_TYPE.UINT16, scale: 10, desc: '动力插箱温度过高报警回差值' },
  { name: 'B104', cType: C_TYPE.UINT16, scale: 10, desc: '电池模组过压1级报警阈值' },
  { name: 'B106', cType: C_TYPE.UINT16, scale: 10, desc: '电池模组过压2级报警阈值' },
  { name: 'B108', cType: C_TYPE.UINT16, scale: 10, desc: '电池模组过压3级报警阈值' },
  { name: 'B110', cType: C_TYPE.UINT16, scale: 10, desc: '电池模组过压报警回差值' },
  { name: 'B112', cType: C_TYPE.UINT16, scale: 10, desc: '电池模组欠压1级报警阈值' },
  { name: 'B114', cType: C_TYPE.UINT16, scale: 10, desc: '电池模组欠压2级报警阈值' },
  { name: 'B116', cType: C_TYPE.UINT16, scale: 10, desc: '电池模组欠压3级报警阈值' },
  { name: 'B118', cType: C_TYPE.UINT16, scale: 10, desc: '电池模组欠压报警回差值' },
  // B120-B150: 放电温度/SOC过高/温升快报警
  { name: 'B120', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体放电过温1级报警阈值' },
  { name: 'B122', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体放电过温2级报警阈值' },
  { name: 'B124', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体放电过温3级报警阈值' },
  { name: 'B126', cType: C_TYPE.UINT16, scale: 10, desc: '电池放电过温报警回差值' },
  { name: 'B128', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体放电欠温1级报警阈值' },
  { name: 'B130', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体放电欠温2级报警阈值' },
  { name: 'B132', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '单体放电欠温3级报警阈值' },
  { name: 'B134', cType: C_TYPE.UINT16, scale: 10, desc: '电池放电欠温报警回差值' },
  { name: 'B136', cType: C_TYPE.UINT16, desc: 'SOC过高1级报警阈值' },
  { name: 'B138', cType: C_TYPE.UINT16, desc: 'SOC过高2级报警阈值' },
  { name: 'B140', cType: C_TYPE.UINT16, desc: 'SOC过高3级报警阈值' },
  { name: 'B142', cType: C_TYPE.UINT16, desc: 'SOC过高报警回差值' },
  { name: 'B144', cType: C_TYPE.UINT16, desc: '温升快1级报警阈值' },
  { name: 'B146', cType: C_TYPE.UINT16, desc: '温升快2级报警阈值' },
  { name: 'B148', cType: C_TYPE.UINT16, desc: '温升快3级报警阈值' },
  { name: 'B150', cType: C_TYPE.UINT16, desc: '温升快报警回差值' },
  // B152-B167: 预留 (16字节)
  { name: 'B152', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B153', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B154', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B155', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B156', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B157', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B158', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B159', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B160', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B161', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B162', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B163', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B164', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B165', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B166', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  { name: 'B167', cType: C_TYPE.UINT8, skip: true, desc: '预留' },
  // B168-B224: 控制指令/累计电量/配置参数
  { name: 'B168', cType: C_TYPE.UINT16, desc: '控制指令模式' },
  { name: 'B170', cType: C_TYPE.UINT16, desc: '上下电控制指令' },
  { name: 'B172', cType: C_TYPE.UINT16, desc: 'DO控制' },
  { name: 'B174', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '风扇启动温度' },
  { name: 'B176', cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: '风扇关闭温度' },
  { name: 'B178', cType: C_TYPE.UINT16, desc: 'SOCSOH设置电池序号' },
  { name: 'B180', cType: C_TYPE.UINT16, desc: 'SOCSOH设置' },
  { name: 'B182', cType: C_TYPE.UINT16, desc: '绝缘采集控制' },
  { name: 'B184', cType: C_TYPE.UINT16, desc: '可调风扇控制-占空比' },
  { name: 'B186', cType: C_TYPE.UINT16, desc: '复归指令' },
  { name: 'B188', cType: C_TYPE.UINT16, desc: '跳机指令' },
  { name: 'B190', cType: C_TYPE.UINT16, desc: '显控检测故障' },
  { name: 'B192', cType: C_TYPE.UINT16, desc: '主控均衡控制(预留)' },
  { name: 'B194', cType: C_TYPE.UINT32, scale: 10, desc: '累计充电电量', read: combine32LH },
  { name: 'B198', cType: C_TYPE.UINT32, scale: 10, desc: '累计放电电量', read: combine32LH },
  { name: 'B202', cType: C_TYPE.UINT16, desc: '电池类型' },
  { name: 'B204', cType: C_TYPE.UINT16, desc: '电池容量' },
  { name: 'B206', cType: C_TYPE.UINT16, desc: '电传感器量程1' },
  { name: 'B208', cType: C_TYPE.UINT16, desc: '电传感器量程2' },
  { name: 'B210', cType: C_TYPE.UINT16, desc: '电传感器量程3' },
  { name: 'B212', cType: C_TYPE.UINT16, desc: '簇内电池节数' },
  { name: 'B214', cType: C_TYPE.UINT16, desc: '簇内温度个数' },
  { name: 'B216', cType: C_TYPE.UINT16, desc: '簇内从控模块个数' },
  { name: 'B218', cType: C_TYPE.UINT16, desc: '从控1~48的电压个数' },
  { name: 'B220', cType: C_TYPE.UINT16, desc: '从控1~48的温度个数' },
  { name: 'B222', cType: C_TYPE.UINT16, desc: '从控站址自动分配' },
  { name: 'B224', cType: C_TYPE.UINT16, desc: '风扇控制功能' },
])

// SpecialData: 3组故障记录，每组60字节，共180字节
// 每组: 故障码(2) + 总压(2) + 电流(2) + SOC(2) + 绝缘(2) + 最大电压(2) + 节号(2) + 最小电压(2) + 节号(2)
//       + 最大温度(2) + 节号(2) + 最小温度(2) + 节号(2) + DO(2) + DI(2) + 年(1) + 月(1) + 日(1) + 时(1) + 分(1) + 秒(1)
//       + 24字节预留
function buildSpecialDataFields() {
  const fields = []
  const offsets = [0, 60, 120]
  const labels = ['故障1', '故障2', '故障3']
  for (let i = 0; i < 3; i++) {
    const label = labels[i]
    fields.push(
      { name: `B${offsets[i]}`, cType: C_TYPE.UINT16, desc: `${label}-故障码` },
      { name: `B${offsets[i] + 2}`, cType: C_TYPE.UINT16, scale: 10, desc: `${label}-电池簇总压` },
      { name: `B${offsets[i] + 4}`, cType: C_TYPE.UINT16, scale: 10, offset: -1600, desc: `${label}-电池簇电流` },
      { name: `B${offsets[i] + 6}`, cType: C_TYPE.UINT16, scale: 10, desc: `${label}-电池簇SOC` },
      { name: `B${offsets[i] + 8}`, cType: C_TYPE.UINT16, desc: `${label}-绝缘电值` },
      { name: `B${offsets[i] + 10}`, cType: C_TYPE.UINT16, scale: 1000, desc: `${label}-最大电压` },
      { name: `B${offsets[i] + 12}`, cType: C_TYPE.UINT16, desc: `${label}-最大电压节号` },
      { name: `B${offsets[i] + 14}`, cType: C_TYPE.UINT16, scale: 1000, desc: `${label}-最小电压` },
      { name: `B${offsets[i] + 16}`, cType: C_TYPE.UINT16, desc: `${label}-最小电压节号` },
      { name: `B${offsets[i] + 18}`, cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: `${label}-最大温度` },
      { name: `B${offsets[i] + 20}`, cType: C_TYPE.UINT16, desc: `${label}-最大温度节号` },
      { name: `B${offsets[i] + 22}`, cType: C_TYPE.UINT16, scale: 10, offset: -40, desc: `${label}-最小温度` },
      { name: `B${offsets[i] + 24}`, cType: C_TYPE.UINT16, desc: `${label}-最小温度节号` },
      { name: `B${offsets[i] + 26}`, cType: C_TYPE.UINT16, desc: `${label}-DO状态` },
      { name: `B${offsets[i] + 28}`, cType: C_TYPE.UINT16, desc: `${label}-DI状态` },
      { name: `B${offsets[i] + 30}`, cType: C_TYPE.UINT8, offset: 2000, desc: `${label}-年` },
      { name: `B${offsets[i] + 31}`, cType: C_TYPE.UINT8, desc: `${label}-月` },
      { name: `B${offsets[i] + 32}`, cType: C_TYPE.UINT8, desc: `${label}-日` },
      { name: `B${offsets[i] + 33}`, cType: C_TYPE.UINT8, desc: `${label}-时` },
      { name: `B${offsets[i] + 34}`, cType: C_TYPE.UINT8, desc: `${label}-分` },
      { name: `B${offsets[i] + 35}`, cType: C_TYPE.UINT8, desc: `${label}-秒` },
    )
    // 24字节预留 (B36-B59 / B96-B119 / B156-B179)
    if (i < 2) {
      for (let j = 36; j < 60; j++) {
        fields.push({ name: `B${offsets[i] + j}`, cType: C_TYPE.UINT8, skip: true, desc: '预留' })
      }
    } else {
      // 第三组故障记录后面没有预留
    }
  }
  return createFields(fields)
}

const specialDataFields = buildSpecialDataFields()

export const protocol_171C_000A = {
  deviceType: '171C',
  version: '000A',
  structs: {
    energyData: { fields: energyDataFields, bytes: structBytes(energyDataFields) },
    energyControlData: { fields: energyControlDataFields, bytes: structBytes(energyControlDataFields) },
    specialData: { fields: specialDataFields, bytes: structBytes(specialDataFields) },
  },
  parseEnergyData(bytes) {
    return parseStruct(bytes, energyDataFields)
  },
  parseEnergyControlData(bytes) {
    return parseStruct(bytes, energyControlDataFields)
  },
  parseSpecialData(bytes) {
    return parseStruct(bytes, specialDataFields)
  },
}
