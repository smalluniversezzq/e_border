import { axios } from '@/utils/request'



//上传头像 /api/b1/user/upload-avatar
export function uploadAvatar (parameter) {
  return axios({
    url: '/user/upload-avatar',
    method: 'post',
    data: parameter
  })
}

//  修改手机号  /api/b1/user/update-mobile
export function updateMobile (parameter) {
  return axios({
    url: '/user/update-mobile',
    method: 'post',
    data: parameter
  })
}

//修改密码  b1/user/update-password
export function updatePassword (parameter) {
  return axios({
    url: '/user/update-password',
    method: 'post',
    data: parameter
  })
}

// 获取验证码  /api/b1/auth/send-sms-code
export function sendCode (parameter) {
  return axios({
    url: '/auth/send-sms-code',
    method: 'post',
    data: parameter
  })
}

// 获取基本信息 /api/b1/user/personal-center
export function userPersonal (parameter) {
  return axios({
    url: '/user/personal-center',
    method: 'get',
    params: parameter
  })
}

//通用图片上传 /api/b1/api/platform/upload
export function uploadImg (parameter) {
  return axios({
    url: '/platform/upload',
    method: 'post',
    data: parameter
  })
}

// 意见反馈  /api/b1/platform/feedback
export function subFeedback (parameter) {
  return axios({
    url: '/platform/feedback',
    method: 'post',
    data: parameter
  })
}
