import request from '@/utils/request';

/**
 * 查询物料列表
 * @param query
 * @returns {*}
 */

export function listItemPage(query) {
  return request({
    url: '/wms/item/list',
    method: 'get',
    params: query
  });
};

export function listItem(query) {
  return request({
    url: '/wms/item/listNoPage',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料列表 以sku为维度
 * @param query
 * @returns {*}
 */

export function listItemGroupBySku(query) {
  return request({
    url: '/wms/itemSku/selectList',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料详细
 * @param id
 */
export function getItem(id) {
  return request({
    url: '/wms/item/' + id,
    method: 'get'
  });
};

/**
 * 新增物料
 * @param data
 */
export function addItem(data) {
  return request({
    url: '/wms/item',
    method: 'post',
    data: data
  });
};

/**
 * 修改物料
 * @param data
 */
export function updateItem(data) {
  return request({
    url: '/wms/item',
    method: 'put',
    data: data
  });
};

/**
 * 删除物料
 * @param id
 */
export function delItem(id) {
  return request({
    url: '/wms/item/' + id,
    method: 'delete'
  });
};
