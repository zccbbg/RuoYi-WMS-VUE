import request from '@/utils/request'

// 分页查询库存详情列表
export function listInventoryDetail(query) {
  return request({
    url: '/wms/inventoryDetail/list',
    method: 'get',
    params: query
  })
}

// 查询库存详情列表
export function listInventoryDetailNoPage(query) {
  return request({
    url: '/wms/inventoryDetail/listNoPage',
    method: 'get',
    params: query
  })
}

// 查询库存详情详细
export function getInventoryDetail(id) {
  return request({
    url: '/wms/inventoryDetail/' + id,
    method: 'get'
  })
}

// 新增库存详情
export function addInventoryDetail(data) {
  return request({
    url: '/wms/inventoryDetail',
    method: 'post',
    data: data
  })
}

// 修改库存详情
export function updateInventoryDetail(data) {
  return request({
    url: '/wms/inventoryDetail',
    method: 'put',
    data: data
  })
}

// 删除库存详情
export function delInventoryDetail(id) {
  return request({
    url: '/wms/inventoryDetail/' + id,
    method: 'delete'
  })
}
