import request from '@/utils/request'

export function getChannelInfos() {
  return request({
    url: 'channel/info',
    method: 'get'
  })
}

export function addChannel(data) {
  return request({
    url: 'channel/add',
    method: 'put',
    data
  })
}

export function editChannel(data) {
  return request({
    url: 'channel/modify',
    method: 'put',
    data
  })
}

export function deleteChannel(data) {
  return request({
    url: 'channel/delete',
    method: 'delete',
    data
  })
}
