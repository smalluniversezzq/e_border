import api from './index'
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
export function login (parameter) {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo (parameter) {
  return axios({
    url: '/auth/get-user-info',
    method: 'get',
    params: parameter
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8'
    // }
  })
}
// 请求路由权限 按钮权限权限
export function getRole (){
  return axios({
    url: '/auth/get-role',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getBese () {
  return axios({
    url: '/auth/get-user-bese',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 退出登录
export function logout () {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
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
