import { axios } from '@/utils/request'

//数据统计字段  /api/b1/dashboard/data-field
export function getDataField (parameter) {
  return axios({
    url: '/dashboard/data-field',
    method: 'get',
    params: parameter
  })
}
//数据统计树状图 post /api/b1/dashboard/data-tree-map
// export function getTreeMap (parameter) {
//   return axios({
//     url: '/dashboard/data-tree-map',
//     method: 'get',
//     params: parameter
//   })
// }
//系统公告 post /api/b1/dashboard/notice
export function noticeList (parameter) {
  return axios({
    url: '/dashboard/notice',
    method: 'get',
    params: parameter
  })
}

//系统公告 post /api/b1/dashboard/notice
export function orderCheck (parameter) {
  return axios({
    url: '/platform/order-check',
    method: 'post',
    data: parameter
  })
}
// 数据统计字段 /api/b1/dashboard/data-field
export function dataField (parameter) {
  return axios({
    url: '/dashboard/data-field',
    method: 'get',
    params: parameter
  })
}

// 国家销售分类统计-饼状图   /api/b1/dashboard/country-sell-data   改为 dashboard/country-data-chart
export function countrySellData (parameter) {
  return axios({
    url: 'dashboard/country-data-chart',
    method: 'get',
    params: parameter
  })
}

// 系统公告  /api/b1/dashboard/notice
export function dashboardNotice (parameter) {
  return axios({
    url: 'dashboard/notice',
    method: 'get',
    params: parameter
  })
}

// 版本发布记录  /api/b1/api/b1/dashboard/version-log
export function  versionLog(parameter) {
  return axios({
    url: 'dashboard/version-log',
    method: 'get',
    params: parameter
  })
}

//  销售排行榜 /api/b1/dashboard/sale-product-rank
export function  saleProductRank(parameter) {
  return axios({
    url: 'dashboard/sale-product-rank',
    method: 'get',
    params: parameter
  })
}

//  销售额数据-树状图  /api/b1/dashboard/sale-data-chart
export function saleDataChart (parameter) {
  return axios({
    url: 'dashboard/sale-data-chart',
    method: 'get',
    params: parameter
  })
}

//运费测算 post /api/b1/logistics/freight-measure
export function freightMeasure (parameter) {
  return axios({
    url: '/logistics/freight-measure',
    method: 'post',
    data: parameter
  })
}
//测试
export function translateTest (parameter) {
  return axios({
    url: 'https://translate.google.cn/translate_a/single',
    method: 'get',
    params: parameter
  })
}
// 待办事项 /api/b1/dashboard/statistics
export function dashboardStatistics (parameter) {
  return axios({
    url: '/dashboard/statistics',
    method: 'post',
    data: parameter
  })
}

// 获取店铺信息 /api/b1/mws-auth/get-my-store
export function getStore (parameter) {
  return axios({
    url: '/mws-auth/get-my-store',
    method: 'get',
    params: parameter
  })
}

//销售统计  /api/b1/dashboard/sale-statistics

export function saleStatistics (parameter) {
  return axios({
    url: '/dashboard/sale-statistics',
    method: 'post',
    data: parameter
  })
}

// 获取消息列表 /api/b1/system/get-message-list
export function getMessageList (parameter) {
  return axios({
    url: '/system/get-message-list',
    method: 'get',
    params: parameter
  })
}

// 标记已读 /api/b1/system/mark-read
export function markRead (parameter) {
  return axios({
    url: '/system/mark-read',
    method: 'post',
    data: parameter
  })
}

// 全部已读 /api/b1/system/mark-read-all
export function markReadAll (parameter) {
  return axios({
    url: '/system/mark-read-all',
    method: 'post',
    data: parameter
  })
}

// 获取消息类型菜单 /api/b1/system/get-message-menu
export function getMessageMenu (parameter) {
  return axios({
    url: '/system/get-message-menu',
    method: 'get',
    params: parameter
  })
}

// 设置接收哪些消息 /api/b1/system/set-message
export function setMessage (parameter) {
  return axios({
    url: '/system/set-message',
    method: 'post',
    data: parameter
  })
}