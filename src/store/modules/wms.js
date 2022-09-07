import { listWmsSupplier } from "@/api/wms/supplier";

const state = {
  supplierList: [],
  supplierMap: new Map()
}
const mutations = {
  SET_SUPPLIERS(state, list) {
    state.supplierList = list;
    state.supplierMap = new Map();
    list.forEach((supplier) => {
      state.supplierMap.set(supplier.id, supplier.supplierName)
    })
    
  }
}
const actions = {
  getSuppliers({ commit }) {
    return listWmsSupplier({}, { page: 0, size: 1000 })
      .then(res => {
        const { content } =res
        commit('SET_SUPPLIERS', content);
      })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}