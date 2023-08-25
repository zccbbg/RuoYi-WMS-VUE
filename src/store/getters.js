const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.userId,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  topbarRouters: state => state.permission.topbarRouters,
  defaultRoutes: state => state.permission.defaultRoutes,
  sidebarRouters: state => state.permission.sidebarRouters,

  // 字典相关
  items: state => state.dict.items,
  dictTypeMap: state => state.dict.dictTypeMap,
  opTypes: state => {
    const map = state.dict.dictTypeMap
    let res = [];
    ['wms_receipt_type', 'wms_shipment_type', 'wms_movement_type','wms_check_type'].forEach(it => {
      if (!map[it]) {
        return
      }
      res = res.concat(map[it])
    })
    return res
  },
  opTypeMap: (state, getters) => {
    const arr = getters.opTypes, map = {};
    arr.forEach(it => map[it.value] = it.label);
    return map;
  },

  // wms相关
  supplierList: state => state.wms.supplierList,
  customerList: state => state.wms.customerList,
  customerMap: state => state.wms.customerMap,
  carrierList: state => state.wms.carrierList,
  carrierMap: state => state.wms.carrierMap,
  supplierMap: state => state.wms.supplierMap,
  warehouseList: state => state.wms.warehouseList,
  warehouseMap: state => state.wms.warehouseMap,
  areaList: state => state.wms.areaList,
  areaMap: state => state.wms.areaMap,
  rackList: state => state.wms.rackList,
  rackMap: state => state.wms.rackMap
}
export default getters
