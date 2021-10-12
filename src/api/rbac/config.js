import request from '@/utils/request'

const api = {
  saveInfo: '/rbac/config/save',
  updateInfo: '/rbac/config/updateById',
  getInfo: '/rbac/config/getById',
  removeInfo: '/rbac/config/removeById',
  page: '/rbac/config/page',
  getGlobalConfig: '/rbac/config/getGlobalConfig',
  saveOrUpdateGlobalConfig: '/rbac/config/saveOrUpdateGlobalConfig'
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
 * 获取系统全局设定
 * @param {*} parameter
 */
export function getGlobalConfig (parameter) {
  return request({
    url: api.getGlobalConfig,
    method: 'post',
    data: parameter
  })
}

/**
 * 保存或更新系统全局配置
 * @param {*} parameter
 */
 export function saveOrUpdateGlobalConfig (parameter) {
  return request({
    url: api.saveOrUpdateGlobalConfig,
    method: 'post',
    data: parameter
  })
}
