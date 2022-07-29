import request from '@/utils/request'

// 查询出库单详情列表
export function listWmsShipmentOrderDetail(query, pageReq) {
  return request({
    url: '/wms/wmsShipmentOrderDetail/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询出库单详情详细
export function getWmsShipmentOrderDetail(id) {
  return request({
    url: '/wms/wmsShipmentOrderDetail/' + id,
    method: 'get'
  })
}

// 新增出库单详情
export function addWmsShipmentOrderDetail(data) {
  return request({
    url: '/wms/wmsShipmentOrderDetail',
    method: 'post',
    data: data
  })
}

// 修改出库单详情
export function updateWmsShipmentOrderDetail(data) {
  return request({
    url: '/wms/wmsShipmentOrderDetail',
    method: 'put',
    data: data
  })
}

// 删除出库单详情
export function delWmsShipmentOrderDetail(id) {
  return request({
    url: '/wms/wmsShipmentOrderDetail/' + id,
    method: 'delete'
  })
}

// 导出出库单详情
export function exportWmsShipmentOrderDetail(query) {
  return request({
    url: '/wms/wmsShipmentOrderDetail/export',
    method: 'get',
    params: query
  })
}
