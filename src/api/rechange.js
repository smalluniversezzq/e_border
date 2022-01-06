import { axios } from '@/utils/request'

// 支付二维码生成 POST  /api/b1/platform/recharge
export function getRechange (parameter) {
  return axios({
    url: '/platform/recharge',
    method: 'post',
    data: parameter
  })
}
//充值订单列表get  /api/b1/platform/pay-list
export function getPayList (parameter) {
  return axios({
    url: '/platform/pay-list',
    method: 'get',
    params: parameter
  })
}
//订单状态检测 post /api/b1/platform/order-check
export function orderCheck (parameter) {
  return axios({
    url: '/platform/order-check',
    method: 'post',
    data: parameter
  })
}
//意见反馈get   /api/b1/platform/feedback
export function subFeedback (parameter) {
  return axios({
    url: '/platform/feedback',
    method: 'get',
    params: parameter
  })
} 
// 图片上传 post  /api/b1/api/site/upload
export function upload (parameter) {
  return axios({
    url: '/site/upload',
    method: 'post',
    data: parameter
  })
}

//  用户(物流)余额变动日志 /api/b1/logistics/get-logistics-log
export function getLogisticsLog (parameter) {
  return axios({
    url: 'logistics/get-logistics-log',
    method: 'get',
    params: parameter
  })
}
//导出消费记录
export function exportConsume(parameter) {
  return axios({
    url: 'agent/export-from-consume',
    method: 'get',
    params: parameter
  })
}