import request from '@/utils/request'

export function login(username, password) {
  const data = {
    username: username,
    password: password
  }
  return request({
    url: '/attend/sys/sign-in',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/attend/sys/get-user',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/attend/sys/sign-out',
    method: 'post'
  })
}
