import { axios } from '@/utils/request'

// 获取某用户下的员工  /api/b1/agent/get-user-by-uid
export function getUserByUid (parameter) {
  return axios({
    url: '/agent/get-user-by-uid',
    method: 'get',
    params: parameter
  })
}
// 员工销售排名   /api/b1/dashboard/staff-sale-rank 
export function getStaffSaleRank (parameter) {
  return axios({
    url: 'dashboard/staff-sale-rank',
    method: 'post',
    data: parameter
  })
}
// 店铺销售分析接口 /api/b1/dashboard/shop-sale-analyze
export function getShopSaleAnalyze (parameter) {
  return axios({
    url: 'dashboard/shop-sale-analyze',
    method: 'post',
    data: parameter
  })
}
// 费用统计 /api/b1/dashboard/fee-statistics
export function getFeeStatistics (parameter) {
  return axios({
    url: 'dashboard/fee-statistics',
    method: 'post',
    data: parameter
  })
}