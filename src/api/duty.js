import request from '@/utils/request'

export function getMyDutys(data) {
  return request({
    url: '/attend/my/query-dutys',
    method: 'post',
    data
  })
}
