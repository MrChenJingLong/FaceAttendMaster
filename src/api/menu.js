import request from '@/utils/request'

export function getAllMenu(token) {
  return request({
    url: '/attend/org/get-all-grant',
    method: 'get',
    params: { token }
  })
}

export function getMenus(token) {
  return request({
    url: '/attend/user/query-grant',
    method: 'get',
    params: { token }
  })
}

export function getMenusByPost(data) {
  return request({
    url: '/attend/org/query-grant-by-post',
    method: 'post',
    data
  })
}
