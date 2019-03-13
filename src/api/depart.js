import request from '@/utils/request'

export function getDeparts(data) {
  return request({
    url: '/attend/org/query-full-departs',
    method: 'post',
    data
  })
}

export function addDepart(data) {
  return request({
    url: '/attend/org/add-department',
    method: 'post',
    data
  })
}

export function updateDepart(data) {
  return request({
    url: '/attend/org/update-department',
    method: 'post',
    data
  })
}

export function deleteDepart(data) {
  return request({
    url: '/attend/org/delete-department',
    method: 'post',
    data
  })
}

