import request from '@/utils/request'

// 查询出库单列表
export function listWmsShipmentOrder(query, pageReq) {
  return request({
    url: '/wms/shipmentOrder/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询出库单详细
export function getWmsShipmentOrder(id) {
  return request({
    url: '/wms/shipmentOrder/' + id,
    method: 'get'
  })
}

export function addOrUpdateWmsShipmentOrder(data) {
  return request({
    url: '/wms/shipmentOrder/add-or-update',
    method: 'post',
    data: data
  })
}

// 新增出库单
export function addWmsShipmentOrder(data) {
  return request({
    url: '/wms/shipmentOrder',
    method: 'post',
    data: data
  })
}

// 修改出库单
export function updateWmsShipmentOrder(data) {
  return request({
    url: '/wms/shipmentOrder',
    method: 'put',
    data: data
  })
}

// 删除出库单
export function delWmsShipmentOrder(id) {
  return request({
    url: '/wms/shipmentOrder/' + id,
    method: 'delete'
  })
}

// 导出出库单
export function exportWmsShipmentOrder(query) {
  return request({
    url: '/wms/shipmentOrder/export',
    method: 'get',
    params: query
  })
}

// 单个订单分配仓库
export function allocatedInventory(params) {
  return request({
    url: '/wms/shipmentOrder/allocated',
    params,
    method: 'post'
  })
}
