import request from '@/utils/request'

// 查询库存盘点单据详情列表
export function listCheckOrderDetail(query) {
  return request({
    url: '/wms/checkOrderDetail/list',
    method: 'get',
    params: query
  })
}

// 查询库存盘点单据详情详细
export function getCheckOrderDetail(id) {
  return request({
    url: '/wms/checkOrderDetail/' + id,
    method: 'get'
  })
}

// 新增库存盘点单据详情
export function addCheckOrderDetail(data) {
  return request({
    url: '/wms/checkOrderDetail',
    method: 'post',
    data: data
  })
}

// 修改库存盘点单据详情
export function updateCheckOrderDetail(data) {
  return request({
    url: '/wms/checkOrderDetail',
    method: 'put',
    data: data
  })
}

// 删除库存盘点单据详情
export function delCheckOrderDetail(id) {
  return request({
    url: '/wms/checkOrderDetail/' + id,
    method: 'delete'
  })
}

// 根据盘库单id查询盘库单详情列表
export function listByCheckOrderId(checkOrderId) {
  return request({
    url: '/wms/checkOrderDetail/list/' + checkOrderId,
    method: 'get'
  })
}
