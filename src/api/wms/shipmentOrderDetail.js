import request from '@/utils/request'

// 查询出库单详情列表
export function listShipmentOrderDetail(query) {
  return request({
    url: '/wms/shipmentOrderDetail/list',
    method: 'get',
    params: query
  })
}

// 查询出库单详情详细
export function getShipmentOrderDetail(id) {
  return request({
    url: '/wms/shipmentOrderDetail/' + id,
    method: 'get'
  })
}

// 新增出库单详情
export function addShipmentOrderDetail(data) {
  return request({
    url: '/wms/shipmentOrderDetail',
    method: 'post',
    data: data
  })
}

// 修改出库单详情
export function updateShipmentOrderDetail(data) {
  return request({
    url: '/wms/shipmentOrderDetail',
    method: 'put',
    data: data
  })
}

// 删除出库单详情
export function delShipmentOrderDetail(id) {
  return request({
    url: '/wms/shipmentOrderDetail/' + id,
    method: 'delete'
  })
}

// 查询出库单详情列表
export function listByShipmentOrderId(shipmentOrderId) {
  return request({
    url: '/wms/shipmentOrderDetail/list/' + shipmentOrderId,
    method: 'get'
  })
}
