import request from '@/utils/request'

export function getPosts(data) {
  return request({
    url: '/attend/org/query-posts',
    method: 'post',
    data
  })
}

export function getPostsByDepartId(data) {
  return request({
    url: '/attend/org/find-posts-by-depart',
    method: 'post',
    data
  })
}

export function getPostsByUserId(data) {
  return request({
    url: '/attend/org/query-posts-by-user',
    method: 'post',
    data
  })
}

export function addPost(data) {
  return request({
    url: '/attend/org/add-post',
    method: 'post',
    data
  })
}

export function updatePost(data) {
  return request({
    url: '/attend/org/update-post',
    method: 'post',
    data
  })
}

export function deletePost(data) {
  return request({
    url: '/attend/org/delete-post',
    method: 'post',
    data
  })
}

export function deletePosts(data) {
  return request({
    url: '/attend/org/delete-posts',
    method: 'post',
    data
  })
}

export function allotUsers(data) {
  return request({
    url: '/attend/org/allot-users',
    method: 'post',
    data
  })
}

export function allotGrant(data) {
  return request({
    url: '/attend/org/allot-grant',
    method: 'post',
    data
  })
}

