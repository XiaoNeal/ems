import { queryAllEnergyStationSituation } from "@/api/devices"
import stationInfo from "@/assets/json/station_info.json"

const stationModule = {
  namespaced: true,
  state: () => ({
    stationId: '',
    /**
     * 能源站类型：1-能源站v1, 2-能源站v2, 3-十千瓦级, 4-水熊虫
     */
    stationType: '',
    ammeterList: [],
    deviceList: []
  }),
  mutations: {
    SET_DEVICE_LIST(state, payload) {
      state.deviceList = payload
    },
    SET_AMMETER_LIST(state, payload) {
      state.ammeterList = payload
    },
    SET_STATION_ID(state, payload) {
      state.stationId = payload
    },
    SET_STATION_TYPE(state, payload) {
      state.stationType = payload
    },
  },
  actions: {
    async getDeviceList({ commit, state }, id) {
      commit('SET_STATION_ID', id)
      const stationType = (stationInfo)[id].stationType || 1
      console.log('stationType', stationType)
      const { data } = await queryAllEnergyStationSituation(state.stationId)
      let ammeters = []
      let devices = []
      data.forEach((element) => {
        if (
          element.typeCode == "1803_V2_2" ||
          element.typeCode == "1804_V2_2"
        ) {
          ammeters.push(element);
        } else {
          devices.push(element);
        }
      });
      commit('SET_AMMETER_LIST', ammeters)
      commit('SET_DEVICE_LIST', devices)
    }
  }
}

export default stationModule
