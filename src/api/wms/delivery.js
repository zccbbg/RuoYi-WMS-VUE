import request from '@/utils/request'

// 查询发货记录列表
export function listWmsDelivery(query, pageReq) {
  return request({
    url: '/wms/wmsDelivery/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询发货记录详细
export function getWmsDelivery(id) {
  return request({
    url: '/wms/wmsDelivery/' + id,
    method: 'get'
  })
}

// 新增发货记录
export function addWmsDelivery(data) {
  return request({
    url: '/wms/wmsDelivery',
    method: 'post',
    data: data
  })
}

// 修改发货记录
export function updateWmsDelivery(data) {
  return request({
    url: '/wms/wmsDelivery',
    method: 'put',
    data: data
  })
}

// 删除发货记录
export function delWmsDelivery(id) {
  return request({
    url: '/wms/wmsDelivery/' + id,
    method: 'delete'
  })
}

// 导出发货记录
export function exportWmsDelivery(query) {
  return request({
    url: '/wms/wmsDelivery/export',
    method: 'get',
    params: query
  })
}
