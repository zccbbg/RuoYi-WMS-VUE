import { listWmsSupplier } from "@/api/wms/supplier";
import { listWmsWarehouse } from "@/api/wms/warehouse";
import { listWmsArea } from "@/api/wms/area";
import { listWmsRack } from "@/api/wms/rack";

const state = {
  supplierList: [],
  supplierMap: new Map(),
  warehouseList: [],
  warehouseMap: new Map(),
  areaList:[],
  areaMap:new Map(),
  rackList:[],
  rackMap:new Map()
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
  },
  SET_AREA(state, list){
    state.areaList = list;
    state.areaMap = new Map();
    list.forEach((area) => {
      state.areaMap.set(area.id, area.areaName)
    })
  },
  SET_RACK(state, list){
    state.rackList = list;
    state.rackMap = new Map();
    list.forEach((rack) => {
      state.areaMap.set(rack.id, rack.rackName)
    })
  },
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
  },
  getAreaList({ commit }) {
    return listWmsArea({}, { page: 0, size: 1000 })
      .then(res => {
        const { content } =res
        commit('SET_AREA', content);
      })
  },
  getRackList({ commit }) {
    return listWmsRack({}, { page: 0, size: 1000 })
      .then(res => {
        const { content } =res
        commit('SET_RACK', content);
      })
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}