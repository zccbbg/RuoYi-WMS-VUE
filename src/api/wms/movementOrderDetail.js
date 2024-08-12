import request from '@/utils/request'

// 查询库存移动详情列表
export function listMovementOrderDetail(query) {
  return request({
    url: '/wms/movementOrderDetail/list',
    method: 'get',
    params: query
  })
}

// 查询库存移动详情详细
export function getMovementOrderDetail(id) {
  return request({
    url: '/wms/movementOrderDetail/' + id,
    method: 'get'
  })
}

// 新增库存移动详情
export function addMovementOrderDetail(data) {
  return request({
    url: '/wms/movementOrderDetail',
    method: 'post',
    data: data
  })
}

// 修改库存移动详情
export function updateMovementOrderDetail(data) {
  return request({
    url: '/wms/movementOrderDetail',
    method: 'put',
    data: data
  })
}

// 查询移库单详情列表
export function listByMovementOrderId(movementOrderId) {
  return request({
    url: '/wms/movementOrderDetail/list/' + movementOrderId,
    method: 'get'
  })
}

// 删除库存移动详情
export function delMovementOrderDetail(id) {
  return request({
    url: '/wms/movementOrderDetail/' + id,
    method: 'delete'
  })
}
