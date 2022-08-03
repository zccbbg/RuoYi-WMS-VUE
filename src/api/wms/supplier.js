import request from '@/utils/request'

// 查询供应商列表
export function listWmsSupplier(query, pageReq) {
  return request({
    url: '/wms/supplier/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询供应商详细
export function getWmsSupplier(id) {
  return request({
    url: '/wms/supplier/' + id,
    method: 'get'
  })
}

// 新增供应商
export function addWmsSupplier(data) {
  return request({
    url: '/wms/supplier',
    method: 'post',
    data: data
  })
}

// 修改供应商
export function updateWmsSupplier(data) {
  return request({
    url: '/wms/supplier',
    method: 'put',
    data: data
  })
}

// 删除供应商
export function delWmsSupplier(id) {
  return request({
    url: '/wms/supplier/' + id,
    method: 'delete'
  })
}

// 导出供应商
export function exportWmsSupplier(query) {
  return request({
    url: '/wms/supplier/export',
    method: 'get',
    params: query
  })
}
