import request from '@/utils/request'

// 查询库存盘点单据详情列表
export function listWmsInventoryCheckDetail(query, pageReq) {
  return request({
    url: '/wms/inventoryCheckDetail/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询库存盘点单据详情详细
export function getWmsInventoryCheckDetail(id) {
  return request({
    url: '/wms/inventoryCheckDetail/' + id,
    method: 'get'
  })
}

// 新增库存盘点单据详情
export function addWmsInventoryCheckDetail(data) {
  return request({
    url: '/wms/inventoryCheckDetail',
    method: 'post',
    data: data
  })
}

// 修改库存盘点单据详情
export function updateWmsInventoryCheckDetail(data) {
  return request({
    url: '/wms/inventoryCheckDetail',
    method: 'put',
    data: data
  })
}

// 删除库存盘点单据详情
export function delWmsInventoryCheckDetail(id) {
  return request({
    url: '/wms/inventoryCheckDetail/' + id,
    method: 'delete'
  })
}

// 导出库存盘点单据详情
export function exportWmsInventoryCheckDetail(query) {
  return request({
    url: '/wms/inventoryCheckDetail/export',
    method: 'get',
    params: query
  })
}
