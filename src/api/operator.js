import request from '@/utils/request'

export function getOperatorInfos() {
    return request({
      url: 'operator/info',
      method: 'get'
    })
}