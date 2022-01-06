import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

// 获取 权限管理添加权限
export function getMenu (parameter) {
  // /api/b1/child/menu
  return axios({
    url: '/child/menu',
    method: 'get',
    params: parameter
  })
}
 // 子账号角色组添加和更新 groupUpdate
export function groupUpdate (parameter) {
  return axios({
    url: '/child/group-update',
    method: 'post',
    data:parameter
  })
}
// 子账号角色组获取  child/group-get
export function getgroup (parameter) {
  return axios({
    url: '/child/group-get',
    method: 'get',
    params: parameter
  })
}
// 删除 roledel
export function groupdel (parameter) {
  return axios({
    url: '/child/group-del',
    method: 'post',
    data: parameter
  })
}
// 获取子账号列表   接口作废
// export function getchildlist (parameter) {
//   return axios({
//     url: '/child/child-get',
//     method: 'get',
//     params: parameter
//   })
// }
// 子账号删除   /api/b1/child/child-del
export function childdel (parameter) {
  return axios({
    url: '/child/child-del',
    method: 'post',
    data: parameter
  })
}
//子账号添加和更新 /api/b1/child/child-update
export function getchildupdate (parameter) {
  return axios({
    url: '/child/child-update',
    method: 'post',
    data: parameter
  })
}
// 获取发件人信息   /api/b1/logistics/address-list
export function getaddresslist (parameter) {
  return axios({
    url: '/logistics/address-list',
    method: 'get',
    params: parameter
  })
}
// 发件人地址修改 /api/b1/logistics/address-update
export function upaddress (parameter) {
  return axios({
    url: '/logistics/address-update',
    method: 'post',
    data: parameter
  })
}
//发件人信息删除  /api/b1/api/b1/logistics/address-del
export function deladdress (parameter) {
  return axios({
    url: '/logistics/address-del',
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

// 自动认领  /api/b1/user/update-crawl-config
export function updataCrawlConfig (parameter) {
  return axios({
    url: '/user/update-crawl-config',
    method: 'post',
    data: parameter
  })
}

