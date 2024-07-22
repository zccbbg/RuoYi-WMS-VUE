import { listWarehouseNoPage } from '@/api/wms/warehouse';
import { listAreaNoPage } from '@/api/wms/area';
import { listMerchantNoPage } from "@/api/wms/merchant";
import {defineStore} from "pinia";
import {ref} from "vue";

export const useWmsStore = defineStore('wms', () => {

  // 仓库管理
  const warehouseList = ref([]);
  const warehouseMap = ref(new Map());

  const getWarehouseList = () => {
    listWarehouseNoPage({}).then((res) => {
      warehouseList.value = res;
      const map = new Map();
      warehouseList.value.forEach((supplier) => {
        map.set(supplier.id, supplier.warehouseName);
      });
      warehouseMap.value = map;
    });
  };
  // 库区管理
  const areaList = ref([]);
  const areaMap = ref(new Map());

  const getAreaList = () => {
    listAreaNoPage({}).then((res) => {
      areaList.value = res;
      const map = new Map();
      areaList.value.forEach((supplier) => {
        map.set(supplier.id, supplier.areaName);
      });
      areaMap.value = map;
    });
  };

  // 企业管理
  const merchantList = ref([]);
  const merchantMap = ref(new Map());

  const getMerchantList = () => {
    listMerchantNoPage({}).then((res) => {
      merchantList.value = res;
      const map = new Map();
      merchantList.value.forEach((supplier) => {
        map.set(supplier.id, supplier);
      });
      merchantMap.value = map;
    });
  }

  return {
    // 仓库管理
    warehouseList,
    warehouseMap,
    getWarehouseList,
    // 库区管理
    areaList,
    areaMap,
    getAreaList,
    // 企业管理
    merchantList,
    merchantMap,
    getMerchantList,
  };
});
