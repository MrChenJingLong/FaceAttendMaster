import request from '@/utils/request'

export function getSchedules(data) {
  return request({
    url: '/attend/org/query-roles',
    method: 'post',
    data
  })
}

export function addSchedule(data) {
  return request({
    url: '/attend/org/query-roles',
    method: 'post',
    data
  })
}
