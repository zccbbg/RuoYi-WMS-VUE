import request from '@/utils/request'

// 查询入库单详情列表
export function listWmsReceiptOrderDetail(query, pageReq) {
  return request({
    url: '/wms/receiptOrderDetail/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询入库单详情详细
export function getWmsReceiptOrderDetail(id) {
  return request({
    url: '/wms/receiptOrderDetail/' + id,
    method: 'get'
  })
}

// 新增入库单详情
export function addWmsReceiptOrderDetail(data) {
  return request({
    url: '/wms/receiptOrderDetail',
    method: 'post',
    data: data
  })
}

// 修改入库单详情
export function updateWmsReceiptOrderDetail(data) {
  return request({
    url: '/wms/receiptOrderDetail',
    method: 'put',
    data: data
  })
}

// 删除入库单详情
export function delWmsReceiptOrderDetail(id) {
  return request({
    url: '/wms/receiptOrderDetail/' + id,
    method: 'delete'
  })
}

// 导出入库单详情
export function exportWmsReceiptOrderDetail(query) {
  return request({
    url: '/wms/receiptOrderDetail/export',
    method: 'get',
    params: query
  })
}
