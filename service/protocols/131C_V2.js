/**
 * (0x131C) GDCS1000_EM42 环境监测模块协议 V2.0 —— 温度 / 湿度
 *
 * 依据点表：.dumate/inbox/(0x131C)GDCS1000_EM42环境监测模块设备协议(TCP)-V2.0-20231205.xlsx
 * 关键点：环境量为 **4 字节单精度浮点（大端 IEEE754）**，且「传输值=实际值」，不做系数换算。
 *   - 字节 0：温度（℃）
 *   - 字节 4：湿度（%RH）
 * 直连页 BMS 的「环境数据」栏目取该设备数据。
 */
import { parseAddrFields, f32 } from './addr-fields'

const envFields = [
  f32(0, 'B0'), // 温度（℃）
  f32(4, 'B4'), // 湿度（%RH）
]

export const protocol_131C_V2 = {
  deviceType: '131C',
  version: 'V2_0',
  structs: {
    energyData: { fields: envFields, bytes: 8 },
    specialData: { fields: envFields, bytes: 8 },
  },
  // 环境量既可能走能源帧（0x02）也可能走状态帧（0x03），两种都按同一张表解析
  parseEnergyData(bytes) {
    return parseAddrFields(bytes, envFields)
  },
  parseSpecialData(bytes) {
    return parseAddrFields(bytes, envFields)
  },
}
