import request from '@/utils/request'

const api = {
  saveInfo: '/rbac/role/save',
  updateInfo: '/rbac/role/updateById',
  getInfo: '/rbac/role/getById',
  removeInfo: '/rbac/role/removeById',
  page: '/rbac/role/page',
  grant: '/rbac/role/grant',
  revoke: '/rbac/role/revoke',
  permissionGrant: '/rbac/role/permissionGrant',
  findAuthPermissionTree: '/rbac/role/findAuthPermissionTree',
  authRolePage: '/rbac/role/authRolePage'
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
 * 授权用户角色
 * @param {*} parameter
 */
 export function grant (parameter) {
  return request({
    url: api.grant,
    method: 'post',
    data: parameter
  })
}

/**
 * 撤销用户角色
 * @param {*} parameter
 */
 export function revoke (parameter) {
  return request({
    url: api.revoke,
    method: 'post',
    data: parameter
  })
}

/**
 * 授权角色权限
 * @param {*} parameter
 */
 export function permissionGrant (parameter) {
  return request({
    url: api.permissionGrant,
    method: 'post',
    data: parameter
  })
}

/**
 * 权限树
 * @param {*} parameter
 */
 export function findAuthPermissionTree (parameter) {
  return request({
    url: api.findAuthPermissionTree,
    method: 'post',
    data: parameter
  })
}

/**
 * 角色分页查询（角色授权用户）
 * @param {*} parameter
 */
 export function authRolePage (parameter) {
  return request({
    url: api.authRolePage,
    method: 'post',
    data: parameter
  })
}
