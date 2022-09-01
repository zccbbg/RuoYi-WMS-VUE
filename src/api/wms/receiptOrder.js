import request from '@/utils/request'

// 查询入库单列表
export function listWmsReceiptOrder(query, pageReq) {
  return request({
    url: '/wms/receiptOrder/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询入库单详细
export function getWmsReceiptOrder(id) {
  return request({
    url: '/wms/receiptOrder/' + id,
    method: 'get'
  })
}

// 新增入库单
export function addWmsReceiptOrder(data) {
  return request({
    url: '/wms/receiptOrder',
    method: 'post',
    data: data
  })
}
// 新增或编辑入库单
export function addOrUpdateWmsReceiptOrder(data) {
  return request({
    url: '/wms/receiptOrder/add-or-update',
    method: 'post',
    data: data
  })
}

// 修改入库单
export function updateWmsReceiptOrder(data) {
  return request({
    url: '/wms/receiptOrder',
    method: 'put',
    data: data
  })
}

// 删除入库单
export function delWmsReceiptOrder(id) {
  return request({
    url: '/wms/receiptOrder/' + id,
    method: 'delete'
  })
}

// 导出入库单
export function exportWmsReceiptOrder(query) {
  return request({
    url: '/wms/receiptOrder/export',
    method: 'get',
    params: query
  })
}
