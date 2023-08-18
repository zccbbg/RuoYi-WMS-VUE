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
    url: '/wms/wave/' + id,
    method: 'get'
  })
}

// 新增波次
export function addWave(data) {
  return request({
    url: '/wms/wave',
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
    url: '/wms/wave/' + id,
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
export function waveAllocatedInventory(id) {
  return request({
    url: '/wms/wave/allocated/' + id,
    method: 'post'
  })
}
// 应用波次作业的仓库
export function confirmWave(data) {
  return request({
    url: '/wms/wave/confirmWave' ,
    method: 'post',
    data: data
  })
}
