import { axios } from '@/utils/request'

// 获取部门列表 /api/b1/agent/get-department
 //  PS  侧边栏
// export function getDepartment (parameter) {
//   return axios({
//     url: '/agent/get-department',
//     method: 'get',
//     params: parameter
//   })
// }
// 获取左侧菜单的商户列表/api/b1/agent/get-merchant-list
export function getDepartment (parameter) {
  return axios({
    url: '/agent/get-port-list',
    method: 'get',
    params: parameter
  })
}

//  新增/修改部门  /api/b1/agent/add-department
// export function addDepartment (parameter) {
//   return axios({
//     url: '/agent/add-department',
//     method: 'post',
//     data: parameter
//   })
// }
//  修改端口名称 /api/b1/agent/update-port
export function addDepartment (parameter) {
  return axios({
    url: '/agent/update-port',
    method: 'post',
    data: parameter
  })
}


//  删除  /api/b1/agent/delete-department
export function delMerchant (parameter) {
  return axios({
    url: '/agent/delete-department',
    method: 'get',
    params: parameter
  })
}
//获取商户列表  /api/b1/agent/get-merchant
//PS table 列表
// export function getMerchant (parameter) {
//   return axios({
//     url: '/agent/get-merchant',
//     method: 'get',
//     params: parameter
//   })
// }
//  获取用户列表  /api/b1/agent/get-port-list
export function getMerchant (parameter) {
  return axios({
    url: '/agent/get-user-list',
    method: 'get',
    params: parameter
  })
}

//新增/修改商户  /api/b1/agent/add-merchant
// export function addMerchant (parameter) {
//   return axios({
//     url: '/agent/add-merchant',
//     method: 'post',
//     data: parameter
//   })
// }
// 新增/修改用户  /api/b1/user/edit-user
export function addMerchant (parameter) {
  return axios({
    url: '/user/edit-user',
    method: 'post',
    data: parameter
  })
}
// 数据权限控制  ？

// 获取代理商角色列表  /api/b1/agent/get-rules
export function getRulest (parameter) {
  return axios({
    url: '/agent/get-roles',
    method: 'post',
    data: parameter
  })
}

// 商户开启或禁用 /api/b1/agent/update-status
export function updateStatus (parameter) {
  return axios({
    url: '/user/update-status',
    method: 'post',
    data: parameter
  })
}

//  批量修改权限/api/b1/agent/batch-update-rule
export function batchUpdateRule (parameter) {
  return axios({
    url: '/agent/batch-update-rule',
    method: 'post',
    data: parameter
  })
}

// 获取商户详情  /agent/edit-merchant',
// export function editMerchant (parameter) {
//   return axios({
//     url: '/agent/edit-merchant',
//     method: 'get',
//     params: parameter
//   })
// }
//  获取用户信息  代替 获取商户详情  /api/b1/user/get-user
export function editMerchant (parameter) {
  return axios({
    url: '/user/get-user',
    method: 'get',
    params: parameter
  })
}

// 更新商户信息 /api/b1/agent/update-merchant

// export function updataMerchant (parameter) {
//   return axios({
//     url: '/agent/update-merchant',
//     method: 'post',
//     data: parameter
//   })
// }
// 新增/修改用户 /api/b1/user/edit-user
export function updataMerchant (parameter) {
  return axios({
    url: '/user/edit-user',
    method: 'post',
    data: parameter
  })
}

// 删除商户  /api/b1/agent/delete-merchant
export function delMerchantNew (parameter) {
  return axios({
    url: '/user/deleted-user',
    method: 'post',
    data: parameter
  })
}
//  角色管理
//获取权限信息
export function getPermissionInfo(parameter) {
  return axios({
    url: '/b1/agent/get-permission',
    method: 'get',
    params: parameter
  })
}

//  新增/修改部门  /api/b1/agent/add-department
export function addDepartments (parameter) {
  return axios({
    url: '/b1/agent/add-department',
    method: 'post',
    data: parameter
  })
}

//新增商户
export function addMerchants(parameter) {
  return axios({
    url: '/agent/add-merchant',
    method: 'post',
    data: parameter
  })
}

// export function getDepartment (parameter) {
//   return axios({
//     url: '/agent/get-port-list',
//     method: 'get',
//     params: parameter
//   })
// }

//获取员工列表
export function getStaffList(parameter) {
  return axios({
    url: '/user/staff-list',
    method: 'get',
    params: parameter
  })
}
//获取分配权限的店铺和国家列表
export function getStoreList(parameter) {
  return axios({
    url: '/mws-auth/get-store-list',
    method: 'get',
    params: parameter
  })
}
//员工分配店铺权限
export function editAuthStaff(parameter) {
  return axios({
    url: '/mws-auth/auth-staff',
    method: 'post',
    data: parameter
  })
}




