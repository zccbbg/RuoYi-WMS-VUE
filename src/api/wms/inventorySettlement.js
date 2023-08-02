import request from '@/utils/request'

// 查询库存结算单列表
export function listWmsInventorySettlement(query, pageReq) {
  return request({
    url: '/wms/inventorySettlement/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询库存结算单详细
export function getWmsInventorySettlement(id) {
  return request({
    url: '/wms/inventorySettlement/' + id,
    method: 'get'
  })
}

// 新增库存结算单
export function addWmsInventorySettlement(data) {
  return request({
    url: '/wms/inventorySettlement',
    method: 'post',
    data: data
  })
}
export function addOrUpdateWmsInventorySettlement(data) {
  return request({
    url: '/wms/inventorySettlement/add-or-update',
    method: 'post',
    data: data
  })
}
// 修改库存结算单
export function updateWmsInventorySettlement(data) {
  return request({
    url: '/wms/inventorySettlement',
    method: 'put',
    data: data
  })
}

// 删除库存结算单
export function delWmsInventorySettlement(id) {
  return request({
    url: '/wms/inventorySettlement/' + id,
    method: 'delete'
  })
}

// 导出库存结算单
export function exportWmsInventorySettlement(query) {
  return request({
    url: '/wms/inventorySettlement/export',
    method: 'get',
    params: query
  })
}
