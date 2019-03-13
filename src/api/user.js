import request from '@/utils/request'

export function getUsers(data) {
  return request({
    url: '/attend/org/query-users',
    method: 'post',
    data
  })
}

export function findUsers(data) {
  return request({
    url: '/attend/org/get-users',
    method: 'post',
    data
  })
}

export function modifyUser(data) {
  return request({
    url: '/attend/org/modify-user',
    method: 'post',
    data
  })
}

export function deleteUsers(data) {
  return request({
    url: '/attend/org/delete-users',
    method: 'post',
    data
  })
}

export function resetPwds(data) {
  return request({
    url: '/attend/org/reset-pwds',
    method: 'post',
    data
  })
}

export function queryRelateTerminals(data) {
  return request({
    url: '/attend/org/query-terminal-by-user',
    method: 'post',
    data
  })
}

export function allotPostsByUser(data) {
  return request({
    url: '/attend/org/allot-posts-by-user',
    method: 'post',
    data
  })
}

export function allotTerminals(data) {
  return request({
    url: '/attend/org/allot-terminals',
    method: 'post',
    data
  })
}

