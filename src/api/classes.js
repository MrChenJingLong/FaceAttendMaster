import request from '@/utils/request'

export function addClasses(data) {
  return request({
    url: '/attend/classes/create',
    method: 'post',
    data
  })
}

export function getClasses(data) {
  return request({
    url: '/attend/classes/query',
    method: 'post',
    data
  })
}
