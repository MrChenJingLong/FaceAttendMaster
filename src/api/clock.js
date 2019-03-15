import request from '@/utils/request'

export function addClock(data) {
  return request({
    url: '/attend/clock/create',
    method: 'post',
    data
  })
}

export function getClocks(data) {
  return request({
    url: '/attend/classes/query',
    method: 'post',
    data
  })
}

export function getAllClock(data) {
  return request({
    url: '/attend/classes/query',
    method: 'post',
    data
  })
}
