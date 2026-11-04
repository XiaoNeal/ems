import DeviceBase from "./device-base.model"
import { protocol_171F_000A, protocol_171F_V2 } from '../protocols/171F'

function buildDataFields(protocol, structKey) {
  const fields = {}
  const def = protocol && protocol.structs && protocol.structs[structKey]
  if (!def) return fields
  for (const f of def.fields) {
    if (!f.skip) {
      fields[f.name] = { name: f.desc || f.name, value: '--' }
    }
  }
  return fields
}

export class Model171F extends DeviceBase {
  energyData
  stateData
  controlData

  constructor(protocol) {
    super()
    const proto = protocol || protocol_171F_000A
    // 协议定义体积很大且视图层不绑定，设为非枚举：
    // 避免 Vue observe 与小程序 setData 深克隆把它一起搬到视图层
    Object.defineProperty(this, 'protocol', {
      value: proto,
      enumerable: false,
      writable: true,
      configurable: true
    })
    this.energyData = new EnergyData(proto)
    this.stateData = new StateData()
    this.controlData = new ControlData(proto)
    this.lastUpdateTime = null
  }

  checkDataExpired() {
    if (this.lastUpdateTime) {
      const now = Date.now()
      if (now - this.lastUpdateTime > 5 * 60 * 1000) {
        this.resetDataToDefault()
        this.lastUpdateTime = null
      }
    }
  }

  resetDataToDefault() {
    for (const key in this.energyData) {
      if (this.energyData[key]) {
        this.energyData[key].value = '--'
      }
    }
  }

  getEnergyData(jsonData) {
    const data = jsonData.data || jsonData
    for (const key in data) {
      if (this.energyData.hasOwnProperty(key) && this.energyData[key]) {
        let value = data[key]
        if (key === 'B4' && typeof value === 'number') {
          value = value.toFixed(2)
        }
        if (key === 'B128' && typeof value === 'number') {
          value = Math.round(value)
        }
        this.energyData[key].value = value
      }
    }
    this.lastUpdateTime = Date.now()
  }

  getControlData(jsonData) {
    const data = jsonData.data || jsonData
    for (const key in data) {
      if (this.controlData.hasOwnProperty(key) && this.controlData[key]) {
        if (key === 'B14') {
          const strategyMap = {
            0: '峰谷',
            1: '恒限功率',
            2: '柔度',
            3: '自发自用',
            4: '电池优先',
            5: '削峰填谷',
            6: '售卖优先',
            7: '限制消费',
            8: '零出口',
            9: '1113+防逆流',
            10: 'AI调度'
          }
          this.controlData[key].value = strategyMap[data[key]] || data[key]
        } else {
          this.controlData[key].value = data[key]
        }
      }
    }
  }

  handleEnergyData(jsonData) {
    this.getEnergyData(jsonData)
  }

  handleStateData(jsonData) {
    const data = jsonData.data || jsonData
    for (const key in data) {
      if (this.stateData.hasOwnProperty(key) && this.stateData[key]) {
        this.stateData[key].value = data[key]
      }
    }
  }

  handleControlData(jsonData) {
    this.getControlData(jsonData)
  }
}

/**
 * 50kW 微能站 EMS 网关（服务端 typeCode = 171F_V2）
 * 字段比 V1 多储能/负荷累计电量与自发自用目标功率，帧布局前缀完全兼容
 */
export class Model171F_V2 extends Model171F {
  constructor() {
    super(protocol_171F_V2)
  }
}

class EnergyData {
  constructor(protocol) {
    Object.assign(this, buildDataFields(protocol, 'energyData'))
  }
}

class StateData {
}

class ControlData {
  constructor(protocol) {
    Object.assign(this, buildDataFields(protocol, 'energyControlData'))
  }
}
