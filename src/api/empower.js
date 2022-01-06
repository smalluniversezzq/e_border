import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */

//亚马逊商户授权信息列表  /mws-auth/list
export function getEmpowerList (parameter) {
  return axios({
    url: '/mws-auth/list',
    method: 'get',
    params: parameter
  })
}
//亚马逊商家授权信息添加  /mws-auth/add
export function addEmpowerInfo (parameter) {
  return axios({
    url: '/mws-auth/add',
    method: 'post',
    data: parameter
  })
}
// 亚马逊商家授权信息删除  mws-auth/delete
export function delEmpowerInfo (parameter) {
  return axios({
    url: '/mws-auth/delete',
    method: 'post',
    data: parameter
  })
}
//修改授权的亚马逊商户信息  mws-auth/update
export function updataEmpowerInfo (parameter) {
  return axios({
    url: '/mws-auth/update',
    method: 'post',
    data: parameter
  })
}
//允许授权国家列表  /api/b1/mws-auth/country-list
export function countryList (parameter) {
  return axios({
    url: '/mws-auth/country-list',
    method: 'get',
    params: parameter
  })
}
// /api/b1/mws-auth/port-list    端口列表
export function getPortList (parameter) {
  return axios({
    url: '/mws-auth/port-list',
    method: 'get',
    params: parameter
  })
}

// /api/b1/auth/get-auth-url    虾皮授权
export function getAuthUrl (parameter) {
  return axios({
    url: '/auth/get-auth-url',
    method: 'get',
    params: parameter
  })
}

// /api/b1/mws-auth/check-auth    获取用户是否开通亚马逊和虾皮
export function getCheckAuth (parameter) {
  return axios({
    url: '/mws-auth/check-auth',
    method: 'get',
    params: parameter
  })
}

// /api/b1/shopee-auth/list  虾皮店铺列表
export function getShopList(parameter) {
  return axios({
    url: '/shopee-auth/list',
    method: 'get',
    params: parameter
  })
}

// /api/b1/shopee-auth/update  更新虾皮店铺信息
export function updateShopeeShop(parameter) {
  return axios({
    url: '/shopee-auth/update',
    method: 'post',
    data: parameter
  })
}

// /api/b1/shopee-auth/delete  删除虾皮店铺
export function deleteShopeeShop(parameter) {
  return axios({
    url: '/shopee-auth/delete',
    method: 'post',
    data: parameter
  })
}

// /api/b1/shopee-auth/add  新增虾皮
export function addShopeeShop(parameter) {
  return axios({
    url: '/shopee-auth/add',
    method: 'post',
    data: parameter
  })
}

// /api/b1/mws-auth/get-auth-country-list  虾皮店铺列表
export function getAuthCountryList(parameter) {
  return axios({
    url: '/mws-auth/get-auth-country-list',
    method: 'get',
    params: parameter
  })
}
// /api/b1/mws-auth/get-extra-info   获取店铺的额外信息 
export function getExtraInfo(parameter) {
  return axios({
    url: '/mws-auth/get-extra-info',
    method: 'get',
    params: parameter
  })
}
// /api/b1/mws-auth/edit-extra-info 添加/更改店铺额外信息
export function editExtraInfo(parameter) {
  return axios({
    url: '/mws-auth/edit-extra-info',
    method: 'post',
    data: parameter
  })
}






/**
 * get user 2step code open?
 * @param parameter {*}
 */
// export function get2step (parameter) {
//   return axios({
//     url: api.twoStepCode,
//     method: 'post',
//     data: parameter
//   })
// }
