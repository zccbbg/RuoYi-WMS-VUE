import request from '@/utils/request'

// 查询物料类型表列表
export function listWmsItemType(query, pageReq) {
  return request({
    url: '/wms/itemType/list',
    method: 'post',
    data: query,
    params: pageReq
  })
}
// 查询部门下拉树结构
export function itemTypeTreeselect() {
  return request({
    url: '/wms/itemType/treeselect',
    method: 'get'
  })
}
// 查询物料类型表列表
export function listWmsItemTypeNoPage(query) {
  return request({
    url: '/wms/itemType/noPageList',
    method: 'get',
    params: query
  })
}

// 查询物料类型表详细
export function getWmsItemType(itemTypeId) {
  return request({
    url: '/wms/itemType/' + itemTypeId,
    method: 'get'
  })
}

// 新增物料类型表
export function addWmsItemType(data) {
  return request({
    url: '/wms/itemType',
    method: 'post',
    data: data
  })
}

// 修改物料类型表
export function updateWmsItemType(data) {
  return request({
    url: '/wms/itemType',
    method: 'put',
    data: data
  })
}

// 删除物料类型表
export function delWmsItemType(itemTypeId) {
  return request({
    url: '/wms/itemType/' + itemTypeId,
    method: 'delete'
  })
}

// 导出物料类型表
export function exportWmsItemType(query) {
  return request({
    url: '/wms/itemType/export',
    method: 'get',
    params: query
  })
}
