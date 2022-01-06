import {
  axios
} from '@/utils/request'

const api = {

}

export default api

//获取商户管理左侧侧边栏数据
export function getMerchantList(parameter) {
  return axios({
    url: '/agent/get-merchant-list',
    method: 'get',
    params: parameter
  })
}
//获取商户管理右侧列表数据
export function getUserList(parameter) {
  return axios({
    url: '/agent/get-user-list',
    method: 'get',
    params: parameter
  })
}
//商户管理左侧新增/编辑
export function editMerchant(parameter) {
  return axios({
    url: '/agent/edit-merchant',
    method: 'post',
    data: parameter
  })
}
//商户管理左侧删除
export function deleteMerchant(parameter) {
  return axios({
    url: '/agent/delete-merchant',
    method: 'get',
    params: parameter
  })
}
//商户管理批量修改权限/api/b1/agent/batch-update-rule
export function batchUpdateRule(parameter) {
  return axios({
    url: '/agent/batch-update-rule',
    method: 'post',
    data: parameter
  })
}
//商户管理开启或禁用 /api/b1/agent/update-status
export function updateStatus(parameter) {
  return axios({
    url: '/agent/update-status',
    method: 'get',
    params: parameter
  })
}
//商户管理获取左侧商户详情  /api/b1/agent/edit-merchant
export function getMerchant(parameter) {
  return axios({
    url: '/agent/get-merchant',
    method: 'get',
    params: parameter
  })
}
//商户管理获取右侧用户详情  /api/b1/user/get-user
export function getUserInfo(parameter) {
  return axios({
    url: '/user/get-user',
    method: 'get',
    params: parameter
  })
}
//商户管理右侧修改
export function editUser(parameter) {
  return axios({
    url: '/user/edit-user',
    method: 'post',
    data: parameter
  })
}
//商户管理右侧删除
export function deleteUser(parameter) {
  return axios({
    url: '/user/delete-user',
    method: 'get',
    params: parameter
  })
}
// 获取代理商角色列表  /api/b1/agent/get-rules
export function getRulest(parameter) {
  return axios({
    url: '/agent/get-roles',
    method: 'post',
    data: parameter
  })
}

export function getPackage(parameter) {
  return axios({
    url: '/agent/get-package',
    method: 'get'
  })
}

//获取商户下的套餐
export function getPackageList(parameter) {
  return axios({
    url: '/agent/get-package-list',
    method: 'get',
    params: parameter
  })
}
//新增套餐
export function addPackage(parameter) {
  return axios({
    url: '/agent/add-package',
    method: 'post',
    data: parameter
  })
}
//修改套餐
export function editPackageName(parameter) {
  return axios({
    url: '/agent/edit-package-name',
    method: 'post',
    data: parameter
  })
}
//删除套餐
export function deletePackage(parameter) {
  return axios({
    url: '/agent/delete-package',
    method: 'get',
    params: parameter
  })
}
//保存套餐权限
export function editPackageRule(parameter) {
  return axios({
    url: '/agent/edit-package-rule',
    method: 'post',
    data: parameter
  })
}

//获取权限信息
export function getPermissionInfo(parameter) {
  return axios({
    url: '/agent/get-permission',
    method: 'get',
    params: parameter
  })
}

//获取端口/api/b1/agent/get-ports
export function getPortsList(parameter) {
  return axios({
    url: '/agent/get-ports',
    method: 'get',
    params: parameter
  })
}

//获取充值用户/api/b1/agent/get-all-user
export function getAllUser(parameter) {
  return axios({
    url: '/agent/get-all-user',
    method: 'get',
    params: parameter
  })
}
//订单状态检测 post /api/b1/platform/order-check
export function orderCheck(parameter) {
  return axios({
    url: '/platform/order-check',
    method: 'post',
    data: parameter
  })
}

//充值订单列表get  /api/b1/platform/pay-list
export function getPayList(parameter) {
  return axios({
    url: '/platform/pay-list',
    method: 'get',
    params: parameter
  })
}
//  用户(物流)余额变动日志 /api/b1/logistics/get-logistics-log
export function getLogisticsLog(parameter) {
  return axios({
    url: '/logistics/get-logistics-log',
    method: 'get',
    params: parameter
  })
}
// 获取部门的余额和累计充值金额 /api/b1/agent/get-department-credit
export function getDepartmentCredit(parameter) {
  return axios({
    url: '/agent/get-department-credit',
    method: 'get',
    params: parameter
  })
}
// 支付二维码生成 POST  /api/b1/platform/recharge
export function getRechange(parameter) {
  return axios({
    url: '/platform/recharge',
    method: 'post',
    data: parameter
  })
}

// 获取操作记录 /api/b1/agent/get-operate-log
export function getOperateLog(parameter) {
  return axios({
    url: '/agent/get-operate-log',
    method: 'get',
    params: parameter
  })
}

//获取系统公告信息
export function getNoticeInfo(parameter) {
  return axios({
    url: '/dashboard/notice',
    method: 'get',
    params: parameter
  })
}

//个人中心基本信息
export function personalCenter(parameter) {
  return axios({
    url: '/agent/personal-center',
    method: 'get',
    params: parameter
  })
}
//保存/更新 个人中心基本信息
export function updatePersonalCenter(parameter) {
  return axios({
    url: '/agent/update-agent-info',
    method: 'post',
    data: parameter
  })
}

//获取省市县信息
export function getProvinces(parameter) {
  return axios({
    url: '/agent/get-region',
    method: 'get',
    params: parameter
  })
}

//获取某个商户下的端口
// export function getPortByUid(parameter) {
//   return axios({
//     url: '/agent/get-port-by-uid',
//     method: 'get',
//     params: parameter
//   })
// }

// 更新商户信息 /api/b1/agent/update-merchant

export function updataMerchant(parameter) {
  return axios({
    url: '/agent/update-merchant',
    method: 'post',
    data: parameter
  })
}

// 获取商户下的角色
export function getRoleList(parameter) {
  return axios({
    url: '/agent/get-role-list',
    method: 'get',
    params: parameter
  })
}

// 新增/修改角色
export function editRole(parameter) {
  return axios({
    url: '/agent/edit-role',
    method: 'post',
    data: parameter
  })
}

//获取所有商户
export function getMerchants(parameter) {
  return axios({
    url: '/agent/get-merchants',
    method: 'get',
    params: parameter
  })
}
//获取商户下的用户/api/b1/agent/get-user-by-uid
export function getUserByUid(parameter) {
  return axios({
    url: '/agent/get-user-by-uid',
    method: 'get',
    params: parameter
  })
}

//新增角色
export function addRloe(parameter) {
  return axios({
    url: '/agent/add-role',
    method: 'post',
    data: parameter
  })
}

//删除角色
export function deleteRloe(parameter) {
  return axios({
    url: '/agent/delete-role',
    method: 'get',
    params: parameter
  })
}

// 删除商户  /api/b1/agent/delete-merchant
// export function delMerchantNew (parameter) {
//   return axios({
//     url: '/agent/delete-merchant',
//     method: 'get',
//     params: parameter
//   })
// }

//获取角色下所有权限/api/b1/agent/permission
export function getPermission(parameter) {
  return axios({
    url: '/agent/permission',
    method: 'get',
    params: parameter
  })
}