import DeviceBase from "./device-base.model"
import { protocol_171F_000A } from '../protocols/171F'

function buildDataFields(structKey) {
  const fields = {}
  const def = protocol_171F_000A.structs[structKey]
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

  constructor() {
    super()
    this.energyData = new EnergyData()
    this.stateData = new StateData()
    this.controlData = new ControlData()
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

class EnergyData {
  constructor() {
    Object.assign(this, buildDataFields('energyData'))
  }
}

class StateData {
}

class ControlData {
  constructor() {
    Object.assign(this, buildDataFields('energyControlData'))
  }
}
