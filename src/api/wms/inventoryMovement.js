import request from '@/utils/request'

// 查询库存移动列表
export function listWmsInventoryMovement(query, pageReq) {
  return request({
    url: '/wms/inventoryMovement/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询库存移动详细
export function getWmsInventoryMovement(id) {
  return request({
    url: '/wms/inventoryMovement/' + id,
    method: 'get'
  })
}

export function addOrUpdateWmsInventoryMovement(data) {
  return request({
    url: '/wms/inventoryMovement/add-or-update',
    method: 'post',
    data: data
  })
}

// 新增库存移动
export function addWmsInventoryMovement(data) {
  return request({
    url: '/wms/inventoryMovement',
    method: 'post',
    data: data
  })
}

// 修改库存移动
export function updateWmsInventoryMovement(data) {
  return request({
    url: '/wms/inventoryMovement',
    method: 'put',
    data: data
  })
}

// 删除库存移动
export function delWmsInventoryMovement(id) {
  return request({
    url: '/wms/inventoryMovement/' + id,
    method: 'delete'
  })
}

// 导出库存移动
export function exportWmsInventoryMovement(query) {
  return request({
    url: '/wms/inventoryMovement/export',
    method: 'get',
    params: query
  })
}
