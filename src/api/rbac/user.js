import request from '@/utils/request'

const api = {
  saveInfo: '/rbac/user/save',
  updateInfo: '/rbac/user/updateById',
  getInfo: '/rbac/user/getById',
  removeInfo: '/rbac/user/removeById',
  page: '/rbac/user/page'
}

export default api

/**
 * 保存
 * @param {*} parameter
 */
export function save (parameter) {
  return request({
    url: api.saveInfo,
    method: 'post',
    data: parameter
  })
}

/**
 * 通过ID更新
 * @param {*} parameter
 */
export function update (parameter) {
  return request({
    url: api.updateInfo,
    method: 'post',
    data: parameter
  })
}

/**
 * 通过ID查询
 * @param {*} parameter
 */
export function get (parameter) {
  return request({
    url: api.getInfo,
    method: 'post',
    data: parameter
  })
}

/**
 * 删除
 * @param {*} parameter
 */
export function remove (parameter) {
  return request({
    url: api.removeInfo,
    method: 'post',
    data: parameter
  })
}

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
