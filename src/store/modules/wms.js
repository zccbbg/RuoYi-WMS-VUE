import { listWarehouse } from '@/api/wms/warehouse';
import { listArea } from '@/api/wms/area';
import {defineStore} from "pinia";
import {ref} from "vue";

export const useWmsStore = defineStore('wms', () => {

  // 仓库管理
  const warehouseList = ref([]);
  const warehouseMap = ref(new Map());

  const getWarehouseList = () => {
    const query = {
      pageSize: 1000,
      pageNum: 0
    };
    listWarehouse(query).then((res) => {
      warehouseList.value = res.rows;
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
    const query = {
      pageSize: 1000,
      pageNum: 0
    };
    listArea(query).then((res) => {
      areaList.value = res.rows;
      const map = new Map();
      areaList.value.forEach((supplier) => {
        map.set(supplier.id, supplier.areaName);
      });
      areaMap.value = map;
    });
  };
  // 货架管理

  return {
    // 仓库管理
    warehouseList,
    warehouseMap,
    getWarehouseList,
    // 库区管理
    areaList,
    areaMap,
    getAreaList,
  };
});
