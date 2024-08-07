import request from '@/utils/request'

// 查询库存记录列表
export function listInventoryHistory(query) {
  return request({
    url: '/wms/inventoryHistory/list',
    method: 'get',
    params: query
  })
}

// 查询库存记录详细
export function getInventoryHistory(id) {
  return request({
    url: '/wms/inventoryHistory/' + id,
    method: 'get'
  })
}

// 新增库存记录
export function addInventoryHistory(data) {
  return request({
    url: '/wms/inventoryHistory',
    method: 'post',
    data: data
  })
}

// 修改库存记录
export function updateInventoryHistory(data) {
  return request({
    url: '/wms/inventoryHistory',
    method: 'put',
    data: data
  })
}

// 删除库存记录
export function delInventoryHistory(id) {
  return request({
    url: '/wms/inventoryHistory/' + id,
    method: 'delete'
  })
}
