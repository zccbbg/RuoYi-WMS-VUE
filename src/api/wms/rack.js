import request from '@/utils/request'

// 查询货架列表
export function listWmsRack(query, pageReq) {
  return request({
    url: '/wms/rack/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询货架详细
export function getWmsRack(id) {
  return request({
    url: '/wms/rack/' + id,
    method: 'get'
  })
}

// 新增货架
export function addWmsRack(data) {
  return request({
    url: '/wms/rack',
    method: 'post',
    data: data
  })
}

// 修改货架
export function updateWmsRack(data) {
  return request({
    url: '/wms/rack',
    method: 'put',
    data: data
  })
}

// 删除货架
export function delWmsRack(id) {
  return request({
    url: '/wms/rack/' + id,
    method: 'delete'
  })
}

// 导出货架
export function exportWmsRack(query) {
  return request({
    url: '/wms/rack/export',
    method: 'get',
    params: query
  })
}
