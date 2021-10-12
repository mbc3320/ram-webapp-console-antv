import request from '@/utils/request'

const api = {
  saveInfo: '/rbac/permission/save',
  updateInfo: '/rbac/permission/updateById',
  getInfo: '/rbac/permission/getById',
  removeInfo: '/rbac/permission/removeById',
  page: '/rbac/permission/page',
  simpleTree: '/rbac/permission/simpleTree'
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

/**
 * 列表
 * @param {*} parameter
 */
export function simpleTree (parameter) {
  return request({
    url: api.simpleTree,
    method: 'post',
    data: parameter
  })
}
