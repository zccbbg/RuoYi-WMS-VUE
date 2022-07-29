import request from '@/utils/request'

// 查询物料列表
export function listWmsItem(query, pageReq) {
  return request({
    url: '/wms/wmsItem/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询物料详细
export function getWmsItem(id) {
  return request({
    url: '/wms/wmsItem/' + id,
    method: 'get'
  })
}

// 新增物料
export function addWmsItem(data) {
  return request({
    url: '/wms/wmsItem',
    method: 'post',
    data: data
  })
}

// 修改物料
export function updateWmsItem(data) {
  return request({
    url: '/wms/wmsItem',
    method: 'put',
    data: data
  })
}

// 删除物料
export function delWmsItem(id) {
  return request({
    url: '/wms/wmsItem/' + id,
    method: 'delete'
  })
}

// 导出物料
export function exportWmsItem(query) {
  return request({
    url: '/wms/wmsItem/export',
    method: 'get',
    params: query
  })
}
