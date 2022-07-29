import request from '@/utils/request'

// 查询库存列表
export function listWmsInventory(query, pageReq) {
  return request({
    url: '/wms/wmsInventory/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询库存详细
export function getWmsInventory(id) {
  return request({
    url: '/wms/wmsInventory/' + id,
    method: 'get'
  })
}

// 新增库存
export function addWmsInventory(data) {
  return request({
    url: '/wms/wmsInventory',
    method: 'post',
    data: data
  })
}

// 修改库存
export function updateWmsInventory(data) {
  return request({
    url: '/wms/wmsInventory',
    method: 'put',
    data: data
  })
}

// 删除库存
export function delWmsInventory(id) {
  return request({
    url: '/wms/wmsInventory/' + id,
    method: 'delete'
  })
}

// 导出库存
export function exportWmsInventory(query) {
  return request({
    url: '/wms/wmsInventory/export',
    method: 'get',
    params: query
  })
}
