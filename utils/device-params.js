export const deviceParams = {
  // 171F设备参数
  _171F: {
    // 快捷控制参数
    '100': {
      label: '储能DC一键控制',
      type: 'switch',
      valueMap: {
        '0': '不启用',
        '1': '一键开机',
        '2': '关机'
      }
    },
    '102': {
      label: 'PCS模式选择',
      type: 'switch',
      valueMap: {
        '0': '不启用',
        '1': '并网充电',
        '2': '并网放电',
        '3': '离网'
      }
    },
    '104': { label: '充电功率设置', unit: 'kW', ratio: 0.1 },
    '106': { label: '放电功率设置', unit: 'kW', ratio: 0.1 },
    '108': {
      label: 'PCS开关机',
      type: 'switch',
      valueMap: {
        '0': '不启用',
        '1': '开机',
        '2': '关机'
      }
    },
    '110': {
      label: '光伏DC控制',
      type: 'switch',
      valueMap: {
        '0': '不启用',
        '1': '一键开机',
        '2': '关机'
      }
    },
    '112': {
      label: '运行策略总开关', type: 'switch', valueMap: {
        '0': '默认',
        '1': '开启',
      }
    },
    '114': {
      label: '运行策略',
      type: 'switch',
      valueMap: {
        '0': '峰谷',
        '1': '恒限功率',
        '2': '柔度',
        '3': '自发自用',
        '4': '电池优先',
        '5': '削峰填谷',
        '6': '售卖优先',
        '7': '限制消费',
        '8': '零出口',
        '9': '防逆流',
        '10': 'AI调度'
      }
    },
    // 设置参数
  },
  // 171B设备参数
  pcs_171B: {
    '0x0077': { address: '0x0077', registerAddress: '40', label: '设置直流侧电压', unit: 'V', ratio: 0.001 },
    '0x0079': { address: '0x0079', registerAddress: '44', label: '设置直流侧电流', unit: 'A', ratio: 0.001 },
    '0x0080': { address: '0x0080', registerAddress: '48', label: '设置交流侧总有功功率', unit: 'kW', ratio: 0.01 },
    '0x0087': { address: '0x0087', registerAddress: '72', label: '设置直流欠压保护电压', unit: 'V', ratio: 0.1 },
    '0x0088': { address: '0x0088', registerAddress: '76', label: '设置直流过压保护电压', unit: 'V', ratio: 0.1 },
    '0x0089': { address: '0x0089', registerAddress: '80', label: '设置一级交流欠压保护', unit: 's', ratio: 0.01 },
    '0x008A': { address: '0x008A', registerAddress: '84', label: '设置一级交流过压保护', unit: 's', ratio: 0.01 },
    '0x008B': { address: '0x008B', registerAddress: '88', label: '设置一级交流欠频保护', unit: 's', ratio: 0.01 },
    '0x008C': { address: '0x008C', registerAddress: '92', label: '设置一级交流过频保护', unit: 's', ratio: 0.01 },
    '0x008D': { address: '0x008D', registerAddress: '96', label: '设置二级交流欠频保护', unit: 's', ratio: 0.01 },
    '0x008E': { address: '0x008E', registerAddress: '100', label: '设置二级交流过频保护', unit: 's', ratio: 0.01 },
    '0x0090': { address: '0x0090', registerAddress: '108', label: '设置二级交流欠压保护', unit: 's', ratio: 0.01 },
    '0x0091': { address: '0x0091', registerAddress: '112', label: '设置二级交流过压保护', unit: 's', ratio: 0.01 },
    '0x0024': {
      address: '0x0024', registerAddress: '12', label: '设置离网模式交流侧欠压复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x0025': {
      address: '0x0025', registerAddress: '16', label: '设置整流模式直流侧欠压复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x002F': {
      address: '0x002F', registerAddress: '20', label: '设置模块工作模式', type: 'switch', valueMap: {
        '0x00000000': '并网模式',
        '0x00010000': '离网模式',
        '0x00020000': '整流模式',
      }
    },
    '0x0030': {
      address: '0x0030', registerAddress: '24', label: '设置模块开关机', type: 'switch', valueMap: {
        '0x00000000': '开机',
        '0x00010000': '关机',
      }
    },
    '0x0031': {
      address: '0x0031', registerAddress: '28', label: '设置模块直流侧过压复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x0042': {
      address: '0x0042', registerAddress: '32', label: '设置逆变模式直流侧欠压复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x0044': {
      address: '0x0044', registerAddress: '36', label: '设置模块短路复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    }
  },
  pv_171E: {
    '0x0017': { address: '0x0017', registerAddress: '0', label: '设置模块工作海拔值', unit: 'm', ratio: 1 },
    '0x001B': { address: '0x001B', registerAddress: '4', label: '设置模块输出电流值', unit: 'A', ratio: 0.000977 },
    '0x001E': { address: '0x001E', registerAddress: '8', label: '设置组号', unit: '', ratio: 1 },
    '0x0020': { address: '0x0020', registerAddress: '16', label: '设置模块输出功率', unit: 'kW', ratio: 0.05 },
    '0x0021': { address: '0x0021', registerAddress: '20', label: '设置模块输出电压', unit: 'V', ratio: 1 },
    '0x0022': { address: '0x0022', registerAddress: '24', label: '设置模块限流点', unit: 'A', ratio: 1 },
    '0x0023': { address: '0x0023', registerAddress: '28', label: '设置模块输出电压上限值', unit: 'V', ratio: 1 },
    '0x001F': {
      address: '0x001F', registerAddress: '12', label: '设置模块地址分配方式', type: 'switch', valueMap: {
        '0x00000000': '自动分配',
        '0x00010000': ':拨码设置',
      }
    },
    '0x0030': {
      address: '0x0030', registerAddress: '32', label: '开关机', type: 'switch', valueMap: {
        '0x00000000': '开机',
        '0x00010000': '关机',
      }
    },
    '0x0031': {
      address: '0x0031', registerAddress: '36', label: '设置模块过压复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x003E': {
      address: '0x003E', registerAddress: '40', label: '设置模块输出过压保护关联是否允许', type: 'switch', valueMap: {
        '0x00000000': '允许',
        '0x00010000': '禁止',
      }
    },
    '0x0044': {
      address: '0x0044', registerAddress: '44', label: '设置模块短路复位', type: 'switch', valueMap: {
        '0x00000000': '禁止',
        '0x00010000': '复位',
      }
    },
    '0x0046': {
      address: '0x0046', registerAddress: '48', label: '设置模块输入模式', type: 'switch', valueMap: {
        '0x00000001': '交流模式',
        '0x00000002': '直流模式',
      }
    }
  },
  storage_171D: {
    '60040': { address: '60040', registerAddress: '22', label: '直流母线电压', unit: 'V', ratio: 0.1 },
    '60043': { address: '60043', registerAddress: '26', label: '充放电功率设定', unit: '%', ratio: 0.1 },
    '60044': { address: '60044', registerAddress: '28', label: '电池均充电压', unit: 'V', ratio: 0.1 },
    '60045': { address: '60045', registerAddress: '30', label: '充电电流设置', unit: 'A', ratio: 0.1 },
    '60046': { address: '60046', registerAddress: '32', label: '电池浮充电压', unit: 'V', ratio: 0.1 },
    '60047': { address: '60047', registerAddress: '34', label: '放电电压设置', unit: 'V', ratio: 0.1 },
    '60048': { address: '60048', registerAddress: '36', label: '放电电流设置', unit: 'A', ratio: 0.1 },
    '60049': { address: '60049', registerAddress: '38', label: '电池过压关机点', unit: 'V', ratio: 0.1 },
    '60050': { address: '60050', registerAddress: '40', label: '电池欠压告警点', unit: 'V', ratio: 0.1 },
    '60051': { address: '60051', registerAddress: '42', label: '电池欠压关机点', unit: 'V', ratio: 0.1 },
    '60054': { address: '60054', registerAddress: '48', label: '充电母线电压上限', unit: 'V', ratio: 0.1 },
    '60055': { address: '60055', registerAddress: '49', label: '放电母线电压下限', unit: 'V', ratio: 0.1 },
    '60019': {
      address: '60019', registerAddress: '6', label: '故障清除', type: 'switch', valueMap: {
        '0x0055': '清除所有故障',
      }
    },
    '60021': {
      address: '60021', registerAddress: '10', label: '运行状态设置', type: 'switch', valueMap: {
        '0': '自适应',
        '1': '并网',
        '2': '离网',
      }
    },
    '60022': {
      address: '60022', registerAddress: '12', label: '系统开关机', type: 'switch', valueMap: {
        '0x0055': '开机',
        '0x00AA': '关机',
      }
    },
    '60042': {
      address: '60042', registerAddress: '24', label: '充放电指令', type: 'switch', valueMap: {
        '0': '待机',
        '1': '充电',
        '2': '放电',
        '3': 'BAT自动切换',
        '4': 'BUS自动切换',
        '5': '关充电',
        '6': '高压PV模式',
        '7': '低压PV模式',
      }
    }
  },
  bms_171C: {
    '1': { label: '组端过压 1 级报警阈值', unit: 'V', ratio: 0.1 },
    '2': { label: '组端过压 2 级报警阈值', unit: 'V', ratio: 0.1 },
    '3': { label: '组端过压 3 级报警阈值', unit: 'V', ratio: 0.1 },
    '4': { label: '组端过压报警回差值', unit: 'V', ratio: 0.1 },
    '5': { label: '组端欠压 1 级报警阈值', unit: 'V', ratio: 0.1 },
    '6': { label: '组端欠压 2 级报警阈值', unit: 'V', ratio: 0.1 },
    '7': { label: '组端欠压 3 级报警阈值', unit: 'V', ratio: 0.1 },
    '8': { label: '组端欠压报警回差值', unit: 'V', ratio: 0.1 },
    '9': { label: '组端放电过流 1 级报警阈值', unit: 'A', ratio: 0.1 },
    '10': { label: '组端放电过流 2 级报警阈值', unit: 'A', ratio: 0.1 },
    '11': { label: '组端放电过流 3 级报警阈值', unit: 'A', ratio: 0.1 },
    '12': { label: '组端放电过流报警回差值', unit: 'A', ratio: 0.1 },
    '13': { label: '组端充电过流 1 级报警阈值', unit: 'A', ratio: 0.1 },
    '14': { label: '组端充电过流 2 级报警阈值', unit: 'A', ratio: 0.1 },
    '15': { label: '组端充电过流 3 级报警阈值', unit: 'A', ratio: 0.1 },
    '16': { label: '组端充电过流报警回差值', unit: 'A', ratio: 0.1 },
    '17': { label: '组端绝缘 1 级报警阈值', unit: 'kΩ', ratio: 0.1 },
    '18': { label: '组端绝缘 2 级报警阈值', unit: 'kΩ', ratio: 0.1 },
    '19': { label: '组端绝缘 3 级报警阈值', unit: 'kΩ', ratio: 0.1 },
    '20': { label: '组端绝缘报警回差值', unit: 'kΩ', ratio: 0.1 },
    '21': { label: '单体充电过温 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '22': { label: '单体充电过温 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '23': { label: '单体充电过温 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '24': { label: '电池充电过温报警回差值', unit: '℃', ratio: 0.1 },
    '25': { label: '单体充电欠温 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '26': { label: '单体充电欠温 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '27': { label: '单体充电欠温 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '28': { label: '单体充电欠温报警回差值', unit: '℃', ratio: 0.1 },
    '29': { label: '单体电压过压 1 级报警阈值', unit: 'mV', ratio: 1 },
    '30': { label: '单体电压过压 2 级报警阈值', unit: 'mV', ratio: 1 },
    '31': { label: '单体电压过压 3 级报警阈值', unit: 'mV', ratio: 1 },
    '32': { label: '单体电压过压报警回差值', unit: 'mV', ratio: 1 },
    '33': { label: '单体电压欠压 1 级报警阈值', unit: 'mV', ratio: 1 },
    '34': { label: '单体电压欠压 2 级报警阈值', unit: 'mV', ratio: 1 },
    '35': { label: '单体电压欠压 3 级报警阈值', unit: 'mV', ratio: 1 },
    '36': { label: '单体电压欠压报警回差值', unit: 'mV', ratio: 1 },
    '37': { label: '单体电压差压 1 级报警阈值', unit: 'mV', ratio: 1 },
    '38': { label: '单体电压差压 2 级报警阈值', unit: 'mV', ratio: 1 },
    '39': { label: '单体电压差压 3 级报警阈值', unit: 'mV', ratio: 1 },
    '40': { label: '单体电压差压报警回差值', unit: 'mV', ratio: 1 },
    '41': { label: '单体温度温差 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '42': { label: '单体温度温差 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '43': { label: '单体温度温差 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '44': { label: '单体温度温差报警回差值', unit: '℃', ratio: 0.1 },
    '45': { label: 'SOC 过低 1 级报警阈值', unit: '%', ratio: 0.1 },
    '46': { label: 'SOC 过低 2 级报警阈值', unit: '%', ratio: 0.1 },
    '47': { label: 'SOC 过低 3 级报警阈值', unit: '%', ratio: 0.1 },
    '48': { label: 'SOC 过低报警回差值', unit: '%', ratio: 0.1 },
    '49': { label: '动力插箱温度过高 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '50': { label: '动力插箱温度过高 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '51': { label: '动力插箱温度过高 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '52': { label: '动力插箱温度过高报警回差值', unit: '℃', ratio: 0.1 },
    '53': { label: '电池模组过压 1 级报警阈值', unit: 'V', ratio: 0.1 },
    '54': { label: '电池模组过压 2 级报警阈值', unit: 'V', ratio: 0.1 },
    '55': { label: '电池模组过压 3 级报警阈值', unit: 'V', ratio: 0.1 },
    '56': { label: '电池模组过压报警回差值', unit: 'V', ratio: 0.1 },
    '57': { label: '电池模组欠压 1 级报警阈值', unit: 'V', ratio: 0.1 },
    '58': { label: '电池模组欠压 2 级报警阈值', unit: 'V', ratio: 0.1 },
    '59': { label: '电池模组欠压 3 级报警阈值', unit: 'V', ratio: 0.1 },
    '60': { label: '电池模组欠压报警回差值', unit: 'V', ratio: 0.1 },
    '61': { label: '单体放电过温 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '62': { label: '单体放电过温 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '63': { label: '单体放电过温 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '64': { label: '单体放电过温报警回差值', unit: '℃', ratio: 0.1 },
    '65': { label: '单体放电欠温 1 级报警阈值', unit: '℃', ratio: 0.1 },
    '66': { label: '单体放电欠温 2 级报警阈值', unit: '℃', ratio: 0.1 },
    '67': { label: '单体放电欠温 3 级报警阈值', unit: '℃', ratio: 0.1 },
    '68': { label: '电池放电欠温报警回差值', unit: '℃', ratio: 0.1 },
    '69': { label: 'SOC 过高 1 级报警阈值', unit: '%', ratio: 0.1 },
    '70': { label: 'SOC 过高 2 级报警阈值', unit: '%', ratio: 0.1 },
    '71': { label: 'SOC 过高 3 级报警阈值', unit: '%', ratio: 0.1 },
    '72': { label: 'SOC 过高报警回差值', unit: '%', ratio: 0.1 },
    '73': { label: '温升快 1 级报警阈值', unit: '℃/min', ratio: 0.1 },
    '74': { label: '温升快 2 级报警阈值', unit: '℃/min', ratio: 0.1 },
    '75': { label: '温升快 3 级报警阈值', unit: '℃/min', ratio: 0.1 },
    '76': { label: '温升快报警回差值', unit: '℃/min', ratio: 0.1 },
    '102': { label: '风扇启动温度', unit: '℃', ratio: 1 },
    '103': { label: '风扇关闭温度', unit: '℃', ratio: 1 },
    '104': { label: 'SOC/SOH 设置电池序号', unit: '' },
    '105': { 
      label: 'SOC/SOH 设置', 
      unit: '%', 
      type: 'combined', 
      modeOptions: [{ label: 'SOC', value: '1' }, { label: 'SOH', value: '2' }], 
      min: 0, 
      max: 100,
      transform: (val) => {
        const num = typeof val === 'string' ? parseInt(val, 16) : val
        const highByte = (num >> 8) & 0xFF
        const lowByte = num & 0xFF
        const mode = highByte === 1 ? 'SOC' : highByte === 2 ? 'SOH' : '--'
        return mode !== '--' ? `${mode}: ${lowByte}%` : '--'
      }
    },
    '107': { label: '可调风扇控制-占空比', unit: '%', ratio: 0.1 },
    '112': { label: '累计充电电量(高16位)', unit: 'kWh', ratio: 0.1, hex16: true },
    '113': { label: '累计充电电量(低16位)', unit: 'kWh', ratio: 0.1, hex16: true },
    '114': { label: '累计放电电量(高16位)', unit: 'kWh', ratio: 0.1, hex16: true },
    '115': { label: '累计放电电量(低16位)', unit: 'kWh', ratio: 0.1, hex16: true },
    '117': { label: '电池容量', unit: 'Ah', ratio: 1 },
    '118': { label: '电传感器量程 1', unit: '' },
    '119': { label: '电传感器量程 2', unit: '' },
    '120': { label: '电传感器量程 3', unit: '' },
    '121': { label: '簇内电池节数', unit: '' },
    '122': { label: '簇内电压个数', unit: '' },
    '123': { label: '簇内从控模块个数', unit: '' },
    '124': { label: '从控 1~48 的电压个数', unit: '' },
    '172': { label: '从控 1~48 的温度个数', unit: '' },
    '220': { label: '从控站址自动分配', unit: '' },
    '101': {
      label: 'DO 控制', type: 'switch', valueMap: {
        '1': '闭合',
        '0': '断开',
      }
    },
    '106': {
      label: '绝缘采集控制', type: 'switch', valueMap: {
        '1': '开启绝缘采集',
        '0': '关闭绝缘采集',
        '2': '无效值，主控自主控制',

      }
    },
    '108': {
      label: '复归指令', type: 'switch', valueMap: {
        '1': '复归',
        '0': '默认状态',
      }
    },
    '109': {
      label: '跳机指令', type: 'switch', valueMap: {
        '1': '跳机',
        '0': '默认状态',
      }
    },
    '110': {
      label: '显控检测故障', type: 'switch', valueMap: {
        '0': '无故障',
        '1': '有故障',
      }
    },

    '111': {
      label: '主控均衡控制', type: 'switch', valueMap: {
        '1': '开启',
        '0': '关闭',
        '2': '主控自主控制',
      },

      '116': {
        label: '电池类型', type: 'switch', valueMap: {
          '1': '磷酸铁锂电池',
          '2': '钛酸锂电池',
          '3': '锰酸锂电池',
          '4': '三元电池'
        }
      }
    }
  }
}





export const deviceCategoryMap = {
  '171F': '_171F',
  '171B': 'pcs_171B',
  '171E': 'pv_171E',
  '171D': 'storage_171D',
  '171C': 'bms_171C'
}

export function getParamInfo(deviceCategory, field) {
  const categoryKey = deviceCategoryMap[deviceCategory] || deviceCategory.toLowerCase()
  const deviceParamsMap = deviceParams[categoryKey] || {}

  // 对于 _171F 和 bms_171C，直接使用 field 作为键名
  if (categoryKey === '_171F' || categoryKey === 'bms_171C') {
    return deviceParamsMap[field] || null
  }

  // 对于 pcs_171B、pv_171E、storage_171D，通过 registerAddress 字段查找
  for (const key in deviceParamsMap) {
    if (deviceParamsMap[key].address === field) {
      return deviceParamsMap[key]
    }
  }

  return null
}