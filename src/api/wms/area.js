import request from '@/utils/request';

/**
 * 查询库区列表
 * @param query
 * @returns {*}
 */

export function listArea(query) {
  return request({
    url: '/wms/area/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询库区列表
 * @param query
 * @returns {*}
 */

export function listAreaNoPage(query) {
  return request({
    url: '/wms/area/listNoPage',
    method: 'get',
    params: query
  });
};

/**
 * 查询库区详细
 * @param id
 */
export function getArea(id) {
  return request({
    url: '/wms/area/' + id,
    method: 'get'
  });
};

/**
 * 新增库区
 * @param data
 */
export function addArea(data) {
  return request({
    url: '/wms/area',
    method: 'post',
    data: data
  });
};

/**
 * 修改库区
 * @param data
 */
export function updateArea(data) {
  return request({
    url: '/wms/area',
    method: 'put',
    data: data
  });
};

/**
 * 删除库区
 * @param id
 */
export function delArea(id) {
  return request({
    url: '/wms/area/' + id,
    method: 'delete'
  });
};
