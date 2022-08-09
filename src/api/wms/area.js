import request from '@/utils/request'

// 查询库区列表
export function listWmsArea(query, pageReq) {
    return request({
        url: '/wms/area/list',
        method: 'post',
        data: query,
        params: pageReq
    })
}

// 查询库区详细
export function getWmsArea(id) {
    return request({
        url: '/wms/area/' + id,
        method: 'get'
    })
}

// 新增库区
export function addWmsArea(data) {
    return request({
        url: '/wms/area',
        method: 'post',
        data: data
    })
}

// 修改库区
export function updateWmsArea(data) {
    return request({
        url: '/wms/area',
        method: 'put',
        data: data
    })
}

// 删除库区
export function delWmsArea(id) {
    return request({
        url: '/wms/area/' + id,
        method: 'delete'
    })
}

// 导出库区
export function exportWmsArea(query) {
    return request({
        url: '/wms/area/export',
        method: 'get',
        params: query
    })
}