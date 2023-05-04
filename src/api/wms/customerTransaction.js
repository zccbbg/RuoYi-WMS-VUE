import request from '@/utils/request'

// 查询客户账户流水列表
export function listWmsCustomerTransaction(query, pageReq) {
  return request({
    url: '/wms/customerTransaction/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询客户账户流水详细
export function getWmsCustomerTransaction(id) {
  return request({
    url: '/wms/customerTransaction/' + id,
    method: 'get'
  })
}

// 新增客户账户流水
export function addWmsCustomerTransaction(data) {
  return request({
    url: '/wms/customerTransaction',
    method: 'post',
    data: data
  })
}

// 修改客户账户流水
export function updateWmsCustomerTransaction(data) {
  return request({
    url: '/wms/customerTransaction',
    method: 'put',
    data: data
  })
}

// 删除客户账户流水
export function delWmsCustomerTransaction(id) {
  return request({
    url: '/wms/customerTransaction/' + id,
    method: 'delete'
  })
}

// 导出客户账户流水
export function exportWmsCustomerTransaction(query) {
  return request({
    url: '/wms/customerTransaction/export',
    method: 'get',
    params: query
  })
}
