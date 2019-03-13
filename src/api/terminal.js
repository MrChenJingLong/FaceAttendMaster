import request from '@/utils/request'

export function getTerminals(data) {
  return request({
    url: '/attend/org/query-terminals',
    method: 'post',
    data
  })
}

export function modifyTerminal(data) {
  return request({
    url: '/attend/tm/register-terminal',
    method: 'post',
    data
  })
}

export function deleteTerminals(data) {
  return request({
    url: '/attend/tm/delete-terminals',
    method: 'post',
    data
  })
}

export function allotUsers(data) {
  return request({
    url: '/attend/tm/allot-users',
    method: 'post',
    data
  })
}

export function getFile(data) {
  return request({
    url: '/attend/tm/get-file',
    method: 'post',
    data
  })
}

export function deleteUsersByTerminal(data) {
  return request({
    url: '/attend/tm/delete-users',
    method: 'post',
    data
  })
}

export function copyUserFromTerminals(data) {
  return request({
    url: '/attend/tm/copy-users',
    method: 'post',
    data
  })
}

export function dispatchUsers(data) {
  return request({
    url: '/attend/tm/dispatch-users',
    method: 'post',
    data
  })
}

export function queryTerminalUsers(data) {
  return request({
    url: '/attend/tm/query-users',
    method: 'post',
    data
  })
}

export function findAllTerminal(data) {
  return request({
    url: '/attend/tm/find-all',
    method: 'post',
    data
  })
}
