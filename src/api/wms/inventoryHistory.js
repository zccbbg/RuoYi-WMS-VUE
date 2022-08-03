import request from '@/utils/request'

// 查询库存记录列表
export function listWmsInventoryHistory(query, pageReq) {
  return request({
    url: '/wms/inventoryHistory/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询库存记录详细
export function getWmsInventoryHistory(id) {
  return request({
    url: '/wms/inventoryHistory/' + id,
    method: 'get'
  })
}

// 新增库存记录
export function addWmsInventoryHistory(data) {
  return request({
    url: '/wms/inventoryHistory',
    method: 'post',
    data: data
  })
}

// 修改库存记录
export function updateWmsInventoryHistory(data) {
  return request({
    url: '/wms/inventoryHistory',
    method: 'put',
    data: data
  })
}

// 删除库存记录
export function delWmsInventoryHistory(id) {
  return request({
    url: '/wms/inventoryHistory/' + id,
    method: 'delete'
  })
}

// 导出库存记录
export function exportWmsInventoryHistory(query) {
  return request({
    url: '/wms/inventoryHistory/export',
    method: 'get',
    params: query
  })
}
