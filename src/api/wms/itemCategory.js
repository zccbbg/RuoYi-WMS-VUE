import request from '@/utils/request';

/**
 * 查询物料类型列表
 * @param query
 * @returns {*}
 */

export function listItemCategoryPage(query) {
  return request({
    url: '/wms/itemCategory/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料类型列表
 * @param query
 * @returns {*}
 */

export function listItemCategory(query) {
  return request({
    url: '/wms/itemCategory/listNoPage',
    method: 'get',
    params: query
  });
};

/**
 * 获取物料类型下拉树列表
 * @param query
 * @returns {*}
 */

export function treeSelectItemCategory(query) {
  return request({
    url: '/wms/itemCategory/treeselect',
    method: 'get',
    params: query
  });
};

/**
 * 查询物料类型详细
 * @param id
 */
export function getItemCategory(id) {
  return request({
    url: '/wms/itemCategory/' + id,
    method: 'get'
  });
};

/**
 * 新增物料类型
 * @param data
 */
export function addItemCategory(data) {
  return request({
    url: '/wms/itemCategory',
    method: 'post',
    data: data
  });
};

/**
 * 修改物料类型
 * @param data
 */
export function updateItemCategory(data) {
  return request({
    url: '/wms/itemCategory',
    method: 'put',
    data: data
  });
};

/**
 * 删除物料类型
 * @param id
 */
export function delItemCategory(id) {
  return request({
    url: '/wms/itemCategory/' + id,
    method: 'delete'
  });
};

/**
 * 删除物料类型
 * @param data
 */
export function updateOrderNum(data) {
  return request({
    url: '/wms/itemCategory/update/orderNum',
    method: 'post',
    data: data
  });
};
