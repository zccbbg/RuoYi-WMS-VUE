import { listWmsSupplier } from "@/api/wms/supplier";
import { listWmsWarehouse } from "@/api/wms/warehouse";
import { listWmsArea } from "@/api/wms/area";
import { listWmsRack } from "@/api/wms/rack";
import {listWmsCustomer} from "@/api/wms/customer";
import {listWmsCarrier} from "@/api/wms/carrier";
const state = {
  supplierList: [],
  customerList: [],
  carrierList: [],
  carrierMap: new Map(),
  customerMap: new Map(),
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
  SET_CUSTOMERS(state, list) {
    state.customerList = list;
    state.customerMap = new Map();
    list.forEach((customer) => {
      state.customerMap.set(customer.id, customer.customerName)
    })
  }, SET_CARRIER(state, list) {
  state.carrierList = list;
  state.carrierMap = new Map();
  list.forEach((carrier) => {
    state.carrierMap.set(carrier.id, carrier.carrierName)
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
      state.rackMap.set(rack.id, rack.rackName)
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
  getCustomer({ commit }) {
    return listWmsCustomer({}, { page: 0, size: 1000 })
      .then(res => {
        const { content } =res
        commit('SET_CUSTOMERS', content);
      })
  },
  getCarrier({commit}) {
    return listWmsCarrier({}, {page: 0, size: 1000})
      .then(res => {
        const {content} = res
        commit('SET_CARRIER', content);
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
