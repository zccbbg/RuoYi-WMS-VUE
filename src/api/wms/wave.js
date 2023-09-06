import request from '@/utils/request'

// 查询波次列表
export function listWave(query, pageReq) {
  return request({
    url: '/wms/wave/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}

// 查询波次详细
export function getWave(id) {
  return request({
    url: '/wms/wave/shipment/' + id,
    method: 'get'
  })
}

// 新增波次
export function addWave(data) {
  return request({
    url: '/wms/wave/shipment/add',
    method: 'post',
    data: data
  })
}

// 修改波次
export function updateWave(data) {
  return request({
    url: '/wms/wave',
    method: 'put',
    data: data
  })
}

// 删除波次
export function delWave(id) {
  return request({
    url: '/wms/wave/shipment/' + id,
    method: 'delete'
  })
}

// 导出波次
export function exportWave(query) {
  return request({
    url: '/wms/wave/export',
    method: 'get',
    params: query
  })
}

// 波次单分配仓库
export function waveAllocatedInventory(params) {
  return request({
    url: '/wms/wave/shipment/allocated/',
    method: 'post',
    params
  })
}
// 应用波次作业的仓库
export function confirmWave(data) {
  return request({
    url: '/wms/wave/shipment/confirmWave' ,
    method: 'post',
    data: data
  })
}
// 取消波次作业
export function cancelAllocatedInventory(id) {
  return request({
    url: '/wms/wave/shipment/cancelAllocatedInventory/'+ id ,
    method: 'post'
  })
}


export function getReceiptWave(id) {
  return request({
    url: '/wms/wave/receipt/' + id,
    method: 'get'
  })
}

// 新增波次
export function addWaveForReceipt(data) {
  return request({
    url: '/wms/wave/receipt/add',
    method: 'post',
    data: data
  })
}

// 删除波次
export function delWaveForReceipt(id) {
  return request({
    url: '/wms/wave/receipt/' + id,
    method: 'delete'
  })
}

// 波次单分配仓库
export function waveAllocatedInventoryForReceipt(params) {
  return request({
    url: '/wms/wave/receipt/allocated/',
    method: 'post',
    params
  })
}
// 应用波次作业的仓库
export function confirmWaveForReceipt(data) {
  return request({
    url: '/wms/wave/receipt/confirmWave' ,
    method: 'post',
    data: data
  })
}
// 取消波次作业
export function cancelAllocatedInventoryForReceipt(id) {
  return request({
    url: '/wms/wave/receipt/cancelAllocatedInventory/'+ id ,
    method: 'post'
  })
}
