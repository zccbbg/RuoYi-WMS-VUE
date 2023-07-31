import request from '@/utils/request'

// 查询库存列表
export function listWmsInventory(query, pageReq) {
  return request({
    url: '/wms/inventory/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询预警库存列表
export function listWarnInventory(pageReq) {
  return request({
    url: '/wms/inventory/warnList',
    method: 'post',
    params: pageReq
  })
}

// 查询库存详细
export function getWmsInventory(id) {
  return request({
    url: '/wms/inventory/' + id,
    method: 'get'
  })
}

// 新增库存
export function addWmsInventory(data) {
  return request({
    url: '/wms/inventory',
    method: 'post',
    data: data
  })
}

// 修改库存
export function updateWmsInventory(data) {
  return request({
    url: '/wms/inventory',
    method: 'put',
    data: data
  })
}

// 删除库存
export function delWmsInventory(id) {
  return request({
    url: '/wms/inventory/' + id,
    method: 'delete'
  })
}
// 删除库存
export function delWmsInventoryByItem(id) {
  return request({
    url: '/wms/inventory/item/' + id,
    method: 'delete'
  })
}

// 删除库存
export function delWmsInventoryByWarehouse(id) {
  return request({
    url: '/wms/inventory/warehouse/' + id,
    method: 'delete'
  })
}

// 导出库存
export function exportWmsInventory(query) {
  return request({
    url: '/wms/inventory/export',
    method: 'get',
    params: query
  })
}
