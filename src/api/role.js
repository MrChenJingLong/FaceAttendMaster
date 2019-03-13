import request from '@/utils/request'

export function getRoles(data) {
  return request({
    url: '/attend/org/query-roles',
    method: 'post',
    data
  })
}

export function findRoles(data) {
  return request({
    url: '/attend/org/find-roles',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/attend/org/add-role',
    method: 'post',
    data
  })
}

export function delRole(data) {
  return request({
    url: '/attend/org/del-role',
    method: 'post',
    data
  })
}

export function delRoles(data) {
  return request({
    url: '/attend/org/del-roles',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/attend/org/update-role',
    method: 'post',
    data
  })
}

export function findPostById(data) {
  return request({
    url: '/attend/org/query-posts-by-role',
    method: 'post',
    data
  })
}

export function findPosts(data) {
  return request({
    url: '/attend/org/query-posts',
    method: 'post',
    data
  })
}

export function allotPosts(data) {
  return request({
    url: '/attend/org/allot-posts',
    method: 'post',
    data
  })
}
