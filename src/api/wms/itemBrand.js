import request from '@/utils/request'

// 查询商品品牌列表
export function listItemBrandPage(query) {
  return request({
    url: '/wms/itemBrand/list',
    method: 'get',
    params: query
  })
}

// 查询商品品牌列表
export function listItemBrand(query) {
  return request({
    url: '/wms/itemBrand/listNoPage',
    method: 'get',
    params: query
  })
}

// 查询商品品牌详细
export function getItemBrand(id) {
  return request({
    url: '/wms/itemBrand/' + id,
    method: 'get'
  })
}

// 新增商品品牌
export function addItemBrand(data) {
  return request({
    url: '/wms/itemBrand',
    method: 'post',
    data: data
  })
}

// 修改商品品牌
export function updateItemBrand(data) {
  return request({
    url: '/wms/itemBrand',
    method: 'put',
    data: data
  })
}

// 删除商品品牌
export function delItemBrand(id) {
  return request({
    url: '/wms/itemBrand/' + id,
    method: 'delete'
  })
}
