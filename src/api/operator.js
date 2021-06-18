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

export function editOperator(data) {
  return request({
    url: 'operator/modify',
    method: 'put',
    data
  })
}

export function deleteOperator(data) {
  return request({
    url: 'operator/delete',
    method: 'delete',
    data
  })
}
