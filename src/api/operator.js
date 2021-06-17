import request from '@/utils/request'

export function getOperatorInfos() {
  return request({
    url: 'operator/info',
    method: 'get'
  })
}

export function addOperator(data) {
  return request({
    url: 'operator/add',
    method: 'put',
    data
  })
}
