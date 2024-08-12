import request from '@/utils/request'

// 查询移库单列表
export function listMovementOrder(query) {
  return request({
    url: '/wms/movementOrder/list',
    method: 'get',
    params: query
  })
}

// 查询移库单详细
export function getMovementOrder(id) {
  return request({
    url: '/wms/movementOrder/' + id,
    method: 'get'
  })
}

// 新增移库单
export function addMovementOrder(data) {
  return request({
    url: '/wms/movementOrder',
    method: 'post',
    data: data
  })
}

// 修改移库单
export function updateMovementOrder(data) {
  return request({
    url: '/wms/movementOrder',
    method: 'put',
    data: data
  })
}

// 删除移库单
export function delMovementOrder(id) {
  return request({
    url: '/wms/movementOrder/' + id,
    method: 'delete'
  })
}

// 移库
export function movement(data) {
  return request({
    url: '/wms/movementOrder/move',
    method: 'post',
    data: data
  })
}
