import request from '@/utils/otherPlatRequest'

// 获取路由
export function getMiniWechatImg(params){
  return request({
    url: `/no-auth/wechat/code`,
    method: 'get',
    params
  })
}

export function judgeQrCode(params){
  return request({
    url: `/no-auth/verified/code`,
    method: 'get',
    params
  })
}
