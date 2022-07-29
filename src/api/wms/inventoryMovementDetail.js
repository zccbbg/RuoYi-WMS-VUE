import request from '@/utils/request'

// 查询库存移动详情列表
export function listWmsInventoryMovementDetail(query, pageReq) {
  return request({
    url: '/wms/wmsInventoryMovementDetail/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询库存移动详情详细
export function getWmsInventoryMovementDetail(id) {
  return request({
    url: '/wms/wmsInventoryMovementDetail/' + id,
    method: 'get'
  })
}

// 新增库存移动详情
export function addWmsInventoryMovementDetail(data) {
  return request({
    url: '/wms/wmsInventoryMovementDetail',
    method: 'post',
    data: data
  })
}

// 修改库存移动详情
export function updateWmsInventoryMovementDetail(data) {
  return request({
    url: '/wms/wmsInventoryMovementDetail',
    method: 'put',
    data: data
  })
}

// 删除库存移动详情
export function delWmsInventoryMovementDetail(id) {
  return request({
    url: '/wms/wmsInventoryMovementDetail/' + id,
    method: 'delete'
  })
}

// 导出库存移动详情
export function exportWmsInventoryMovementDetail(query) {
  return request({
    url: '/wms/wmsInventoryMovementDetail/export',
    method: 'get',
    params: query
  })
}
