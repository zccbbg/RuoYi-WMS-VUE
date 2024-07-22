import request from '@/utils/request'

// 查询入库单列表
export function listReceiptOrder(query) {
  return request({
    url: '/wms/receiptOrder/list',
    method: 'get',
    params: query
  })
}

// 查询入库单详细
export function getReceiptOrder(id) {
  return request({
    url: '/wms/receiptOrder/' + id,
    method: 'get'
  })
}

// 新增入库单
export function addReceiptOrder(data) {
  return request({
    url: '/wms/receiptOrder',
    method: 'post',
    data: data
  })
}

// 作废入库单
export function editReceiptOrderToInvalid(id) {
  return request({
    url: '/wms/receiptOrder/invalid/' + id,
    method: 'put'
  })
}

// 修改入库单
export function updateReceiptOrder(data) {
  return request({
    url: '/wms/receiptOrder',
    method: 'put',
    data: data
  })
}

// 删除入库单
export function delReceiptOrder(id) {
  return request({
    url: '/wms/receiptOrder/' + id,
    method: 'delete'
  })
}
