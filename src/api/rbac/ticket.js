import request from '@/utils/request'

const api = {
  page: '/rbac/ticket/page',
  kick: '/rbac/ticket/kickOutById'
}

export default api

/**
 * 分页查询
 * @param {*} parameter
 */
export function page (parameter) {
  return request({
    url: api.page,
    method: 'post',
    data: parameter
  })
}

/**
 * 踢出ticket
 * @param {*} parameter
 */
 export function kick (parameter) {
  return request({
    url: api.kick,
    method: 'post',
    data: parameter
  })
}
