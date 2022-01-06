import { axios } from '@/utils/request'

// 数据汇总列表数据  /api/b1/dashboard/data-gather
export function getGatherData (parameter) {
  return axios({
    url: '/dashboard/data-gather',
    method: 'get',
    params: parameter
  })
}
// 数据汇总导出列表数据  /api/b1/dashboard/export-data
export function exportGatherData (parameter) {
  return axios({
    url: '/dashboard/export-data',
    method: 'post',
    data: parameter
  })
}
// 数据汇总详情数据  /api/b1/dashboard/user-data
export function getUserData (parameter) {
  return axios({
    url: '/dashboard/user-data',
    method: 'get',
    params: parameter
  })
}
// 数据汇总统计数据  /api/b1/dashboard/all-data-amount
export function getAmountData (parameter) {
  return axios({
    url: '/dashboard/all-data-amount',
    method: 'post',
    data: parameter
  })
}
// 数据汇总自定义表头  /api/b1/dashboard/title-list
export function saveColumnsData (parameter) {
  return axios({
    url: '/dashboard/title-list',
    method: 'post',
    data: parameter
  })
}

