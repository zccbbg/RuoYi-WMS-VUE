import request from '@/utils/request'

// 查询仓库列表
export function listWmsWarehouse(query, pageReq) {
  return request({
    url: '/wms/warehouse/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询仓库详细
export function getWmsWarehouse(id) {
  return request({
    url: '/wms/warehouse/' + id,
    method: 'get'
  })
}

// 新增仓库
export function addWmsWarehouse(data) {
  return request({
    url: '/wms/warehouse',
    method: 'post',
    data: data
  })
}

// 修改仓库
export function updateWmsWarehouse(data) {
  return request({
    url: '/wms/warehouse',
    method: 'put',
    data: data
  })
}

// 删除仓库
export function delWmsWarehouse(id) {
  return request({
    url: '/wms/warehouse/' + id,
    method: 'delete'
  })
}

// 导出仓库
export function exportWmsWarehouse(query) {
  return request({
    url: '/wms/warehouse/export',
    method: 'get',
    params: query
  })
}
