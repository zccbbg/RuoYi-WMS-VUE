import request from '@/utils/request'

// 查询往来单位列表
export function listMerchant(query) {
  return request({
    url: '/wms/merchant/list',
    method: 'get',
    params: query
  })
}

// 查询往来单位列表
export function listMerchantNoPage(query) {
  return request({
    url: '/wms/merchant/listNoPage',
    method: 'get',
    params: query
  })
}

// 查询往来单位详细
export function getMerchant(id) {
  return request({
    url: '/wms/merchant/' + id,
    method: 'get'
  })
}

// 新增往来单位
export function addMerchant(data) {
  return request({
    url: '/wms/merchant',
    method: 'post',
    data: data
  })
}

// 修改往来单位
export function updateMerchant(data) {
  return request({
    url: '/wms/merchant',
    method: 'put',
    data: data
  })
}

// 删除往来单位
export function delMerchant(id) {
  return request({
    url: '/wms/merchant/' + id,
    method: 'delete'
  })
}
