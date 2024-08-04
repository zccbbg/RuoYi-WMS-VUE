import request from '@/utils/request'

// 查询出库单列表
export function listShipmentOrder(query) {
  return request({
    url: '/wms/shipmentOrder/list',
    method: 'get',
    params: query
  })
}

// 查询出库单详细
export function getShipmentOrder(id) {
  return request({
    url: '/wms/shipmentOrder/' + id,
    method: 'get'
  })
}

// 新增出库单
export function addShipmentOrder(data) {
  return request({
    url: '/wms/shipmentOrder',
    method: 'post',
    data: data
  })
}

// 修改出库单
export function updateShipmentOrder(data) {
  return request({
    url: '/wms/shipmentOrder',
    method: 'put',
    data: data
  })
}

// 出库
export function shipment(data) {
  return request({
    url: '/wms/shipmentOrder/shipment',
    method: 'put',
    data: data
  })
}

// 删除出库单
export function delShipmentOrder(id) {
  return request({
    url: '/wms/shipmentOrder/' + id,
    method: 'delete'
  })
}
