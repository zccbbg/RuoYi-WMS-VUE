import request from '@/utils/request'

// 查询库存盘点单据列表
export function listWmsInventoryCheck(query, pageReq) {
  return request({
    url: '/wms/inventoryCheck/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询库存盘点单据详细
export function getWmsInventoryCheck(id) {
  return request({
    url: '/wms/inventoryCheck/' + id,
    method: 'get'
  })
}

// 新增库存盘点单据
export function addWmsInventoryCheck(data) {
  return request({
    url: '/wms/inventoryCheck',
    method: 'post',
    data: data
  })
}

export function addOrUpdateWmsInventoryCheck(data) {
  return request({
    url: '/wms/inventoryCheck/add-or-update',
    method: 'post',
    data: data
  })
}

// 修改库存盘点单据
export function updateWmsInventoryCheck(data) {
  return request({
    url: '/wms/inventoryCheck',
    method: 'put',
    data: data
  })
}

// 删除库存盘点单据
export function delWmsInventoryCheck(id) {
  return request({
    url: '/wms/inventoryCheck/' + id,
    method: 'delete'
  })
}

// 导出库存盘点单据
export function exportWmsInventoryCheck(query) {
  return request({
    url: '/wms/inventoryCheck/export',
    method: 'get',
    params: query
  })
}
