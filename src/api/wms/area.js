import request from '@/utils/request'

// 查询货区列表
export function listWmsArea(query, pageReq) {
  return request({
    url: '/wms/wmsArea/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询货区详细
export function getWmsArea(id) {
  return request({
    url: '/wms/wmsArea/' + id,
    method: 'get'
  })
}

// 新增货区
export function addWmsArea(data) {
  return request({
    url: '/wms/wmsArea',
    method: 'post',
    data: data
  })
}

// 修改货区
export function updateWmsArea(data) {
  return request({
    url: '/wms/wmsArea',
    method: 'put',
    data: data
  })
}

// 删除货区
export function delWmsArea(id) {
  return request({
    url: '/wms/wmsArea/' + id,
    method: 'delete'
  })
}

// 导出货区
export function exportWmsArea(query) {
  return request({
    url: '/wms/wmsArea/export',
    method: 'get',
    params: query
  })
}
