import { listWarehouseNoPage } from '@/api/wms/warehouse';
import { listAreaNoPage } from '@/api/wms/area';
import { listMerchantNoPage } from "@/api/wms/merchant";
import { listItem } from "@/api/wms/item";
import { listItemSku } from "@/api/wms/itemSku";
import { listItemCategory, treeSelectItemCategory } from "@/api/wms/itemCategory";
import {defineStore} from "pinia";
import {ref} from "vue";

export const useWmsStore = defineStore('wms', () => {

  // 仓库管理
  const warehouseList = ref([]);
  const warehouseMap = ref(new Map());

  const getWarehouseList = () => {
    listWarehouseNoPage({}).then((res) => {
      warehouseList.value = res.data;
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
      areaList.value = res.data;
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
      merchantList.value = res.data;
      const map = new Map();
      merchantList.value.forEach((supplier) => {
        map.set(supplier.id, supplier);
      });
      merchantMap.value = map;
    });
  }

  // 商品管理
  const itemList = ref([])
  const itemMap = ref(new Map())

  // 商品规格管理
  const itemSkuList = ref([])
  const itemSkuMap = ref(new Map())

  const getItemAndItemSku = async () => {
    const tempItemList = []
    const tempItemMap = new Map()
    const tempItemSkuList = []
    const tempItemSkuMap = new Map()
    const itemRes = await listItem({})
    const itemSkuRes = await listItemSku({})
    itemRes.data.forEach(item => {
      const data = {
        ...item,
        itemCategoryInfo: itemCategoryMap.value.get(item.itemCategory),
        itemSkuList: itemSkuRes.data.filter(sku => sku.itemId === item.id)
      }
      tempItemList.push(data)
      tempItemMap.set(item.id, data)
    })
    itemSkuRes.data.forEach(sku => {
      const itemInfo = itemRes.data.filter(item => item.id === sku.itemId)[0]
      const data = {
        ...sku,
        itemInfo: itemInfo,
        itemCategoryInfo: itemCategoryMap.value.get(itemInfo?.itemCategory),
        itemCategoryId: itemInfo?.itemCategory
      }
      tempItemSkuList.push(data)
      tempItemSkuMap.set(sku.id, data)
    })
    itemList.value = tempItemList
    itemMap.value = tempItemMap
    itemSkuList.value = tempItemSkuList
    itemSkuMap.value = tempItemSkuMap
  }

  // 商品分类管理
  const itemCategoryList = ref([])
  const itemCategoryTreeList = ref([])
  const itemCategoryMap = ref(new Map())

  const getItemCategoryList = () => {
    listItemCategory({}).then(res => {
      itemCategoryList.value = res.data;
      const map = new Map()
      itemCategoryList.value.forEach(supplier => {
        map.set(supplier.id, supplier)
      })
      itemCategoryMap.value = map
    })
  }

  const getItemCategoryTreeList = () => {
    treeSelectItemCategory().then(res => {
      itemCategoryTreeList.value = res.data
    })
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
    // 商品管理
    itemList,
    itemMap,
    getItemAndItemSku,
    // 商品规格管理
    itemSkuList,
    itemSkuMap,
    // 商品分类管理
    itemCategoryList,
    itemCategoryTreeList,
    itemCategoryMap,
    getItemCategoryList,
    getItemCategoryTreeList
  };
});
