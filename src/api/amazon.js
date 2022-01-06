import {
  axios
} from '@/utils/request'

const api = {

}

export default api


//获取ASIN监控列表
export function getMonitorList(parameter) {
  return axios({
    url: '/amazon-product/get-monitor-list',
    method: 'get',
    params: parameter
  })
}

//删除ASIN监控
export function deleteMonitor(parameter) {
  return axios({
    url: '/amazon-product/delete-monitor',
    method: 'get',
    params: parameter
  })
}

//保存监控ASIN信息
export function uploadMonitorInfo(parameter) {
  return axios({
    url: '/amazon-product/upload-monitor',
    method: 'post',
    data: parameter
  })
}

export function addMonitorLog(parameter) {
  return axios({
    url: '/amazon-product/add-monitor-log',
    method: 'post',
    data: parameter
  })
}

export function followNotion(parameter) {
  return axios({
    url: '/amazon-product/get-follow-notion',
    method: 'get',
    params: parameter
  })
}

export function followCrawler(parameter) {
  return axios({
    url: '/amazon-to-sell/follow-crawler',
    method: 'post',
    data: parameter
  })
}