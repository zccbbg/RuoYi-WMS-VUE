import request from '@/utils/request'

// 查询客户列表
export function listWmsCustomer(query, pageReq) {
  return request({
    url: '/wms/customer/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询客户详细
export function getWmsCustomer(id) {
  return request({
    url: '/wms/customer/' + id,
    method: 'get'
  })
}

// 新增客户
export function addWmsCustomer(data) {
  return request({
    url: '/wms/customer',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateWmsCustomer(data) {
  return request({
    url: '/wms/customer',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delWmsCustomer(id) {
  return request({
    url: '/wms/customer/' + id,
    method: 'delete'
  })
}

// 导出客户
export function exportWmsCustomer(query) {
  return request({
    url: '/wms/customer/export',
    method: 'get',
    params: query
  })
}
