import { listWmsSupplier } from "@/api/wms/supplier";
import { listWmsWarehouse } from "@/api/wms/warehouse";

const state = {
  supplierList: [],
  supplierMap: new Map(),
  warehouseList: [],
  warehouseMap: new Map()
}
const mutations = {
  SET_SUPPLIERS(state, list) {
    state.supplierList = list;
    state.supplierMap = new Map();
    list.forEach((supplier) => {
      state.supplierMap.set(supplier.id, supplier.supplierName)
    })
  },
  SET_WAREHOUSE(state, list){
    state.warehouseList = list;
    state.warehouseMap = new Map();
    list.forEach((warehouse) => {
      state.warehouseMap.set(warehouse.id, warehouse.warehouseName)
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
  },
  getWarehouseList({ commit }) {
    return listWmsWarehouse({}, { page: 0, size: 1000 })
      .then(res => {
        const { content } =res
        commit('SET_WAREHOUSE', content);
      })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}