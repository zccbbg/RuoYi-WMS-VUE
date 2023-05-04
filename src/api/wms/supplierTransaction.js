import request from '@/utils/request'

// 查询供应商账户流水列表
export function listWmsSupplierTransaction(query, pageReq) {
  return request({
    url: '/wms/supplierTransaction/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询供应商账户流水详细
export function getWmsSupplierTransaction(id) {
  return request({
    url: '/wms/supplierTransaction/' + id,
    method: 'get'
  })
}

// 新增供应商账户流水
export function addWmsSupplierTransaction(data) {
  return request({
    url: '/wms/supplierTransaction',
    method: 'post',
    data: data
  })
}

// 修改供应商账户流水
export function updateWmsSupplierTransaction(data) {
  return request({
    url: '/wms/supplierTransaction',
    method: 'put',
    data: data
  })
}

// 删除供应商账户流水
export function delWmsSupplierTransaction(id) {
  return request({
    url: '/wms/supplierTransaction/' + id,
    method: 'delete'
  })
}

// 导出供应商账户流水
export function exportWmsSupplierTransaction(query) {
  return request({
    url: '/wms/supplierTransaction/export',
    method: 'get',
    params: query
  })
}
