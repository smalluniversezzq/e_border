import { axios } from '@/utils/request'

const api = {

}

export default api
// 原始订单待审核列表 /api/b1/order/ori-order
export function oriOrderList(parameter) {
  // /api/b1/child/menu
  return axios({
    url: '/order/order',
    method: 'get',
    params: parameter
  })
}
// amazon订单列表 /api/b1/amazon-order/order
export function amazonOrderList(parameter) {
  // /api/b1/child/menu
  return axios({
    url: '/amazon-order/order',
    method: 'get',
    params: parameter
  })
}
// amazon订单详情 /api/b1/amazon-order/order-detail
export function amazonOrderDetail(parameter) {
  // /api/b1/child/menu
  return axios({
    url: '/amazon-order/order-detail',
    method: 'get',
    params: parameter
  })
}
// 原始订单待编辑审核 /api/b1/order/ori-order-update
export function groupUpdate(parameter) {
  return axios({
    url: '/order/ori-order-update',
    method: 'post',
    data: parameter
  })
}
// 原始订单审核 /api/b1/amazon-order/ori-order-check
export function orderCheck(parameter) {
  return axios({
    url: '/amazon-order/ori-order-check',
    method: 'post',
    data: parameter
  })
}
// 获取国家对应的物流渠道列表  /api/b1/logistics/get-channel
export function getChannel(parameter) {
  return axios({
    url: '/logistics/get-channel',
    method: 'get',
    params: parameter
  })
}
//  设置指定订单的物流渠道   /api/b1/logistics/set-channel
export function setChannel(parameter) {
  return axios({
    url: '/logistics/set-channel',
    method: 'post',
    data: parameter
  })
}

// 用户配置物流列表  /api/b1/logistics/user-config
// export function getUserConfig(parameter) {
//   return axios({
//     url: '/logistics/user-config',
//     method: 'get',
//     params: parameter
//   })
// }
// 用户配置物流列表获取一级  /api/b1/logistics/get-logistics-company
export function getLogisticsCompany(parameter) {
  return axios({
    url: '/logistics/get-logistics-company',
    method: 'get',
    params: parameter
  })
}
// 用户配置物流列表获取儿二级  /api/b1/logistics/user-config
export function getUserConfig(parameter) {
  return axios({
    url: '/logistics/user-config',
    method: 'get',
    params: parameter
  })
}

// 用户物流配置启用  /api/b1/logistics/user-status-change
export function tabStatusChange(parameter) {
  return axios({
    url: '/logistics/user-status-change',
    method: 'post',
    data: parameter
  })
}

// 获取物流单号  /api/b1/api/b1/logistics/get-logistics-no
export function getLogisticsNo(parameter) {
  return axios({
    url: '/logistics/get-logistics-no',
    method: 'post',
    data: parameter
  })
}
// 虚拟发货  /api/b1/api/b1/logistics/virtual-deliver
export function deliver(parameter) {
  return axios({
    url: '/logistics/virtual-deliver',
    method: 'post',
    data: parameter
  })
}

// 获取物流  /api/b1/order/get-all-channel  //舍弃
export function getAllChannel(parameter) {
  return axios({
    url: '/order/get-all-channel',
    method: 'get',
    params: parameter
  })
}


// 获取仓库地址  logistics/get-warehouse-address
export function warehouseAddress(parameter) {
  return axios({
    url: '/logistics/get-warehouse-address',
    method: 'get',
    params: parameter
  })
}

//  获取快递信息/api/b1/logistics/get-express-info
export function getExpressInfo(parameter) {
  return axios({
    url: '/logistics/get-express-info',
    method: 'post',
    data: parameter
  })
}
//获取国内物流渠道 /api/b1/logistics/get-inland-code  
export function getInlandCode (parameter) {
  return axios({
    url: '/logistics/get-inland-code ',
    method: 'get',
    params:parameter
  })
}

// 获取仓库地址 /api/b1/logistics/get-warehouse-list
export function getWarehouse (parameter) {
  return axios({
    url: '/logistics/get-warehouse-list',
    method: 'get',
    params:parameter
  })
} 

// 获取国际物流单号 /api/b1/logistics/get-fpx-no
export function getNums(parameter) {
  return axios({
    url: '/logistics/get-fpx-no',
    method: 'post',
    data: parameter
  })
}

//获取物流信息 /api/b1/amazon-order/get-order-logistics
export function getOrderLogistics (parameter) {
  return axios({
    url: '/amazon-order/get-order-logistics',
    method: 'post',
    data: parameter
  })
} 

//处理只填写国际物流的订单 /api/b1/order/handler-foreign-order
export function handlerForeignOrder(parameter) {
  return axios({
    url: '/order/handler-foreign-order',
    method: 'post',
    data: parameter
  })
}

//  处理填写国内和国际物流信息的订单 /api/b1/order/handler-domestic-order
export function handlerDomesticOrder(parameter) {
  return axios({
    url: '/order/handler-domestic-order',
    method: 'post',
    data: parameter
  })
}

// 获取国际物流  /api/b1/logistics/get-foreign-channel
export function getForeignChannel (parameter) {
  return axios({
    url: '/logistics/get-foreign-channel',
    method: 'get',
    params:parameter
  })
}

// 移动已发货订单到待审核 /api/b1/order/move-process
export function orderMoveProcess (parameter) {
  return axios({
    url: '/order/move-process',
    method: 'get',
    params:parameter
  })
}

// 根据sku搜索商品 /api/b1/order/search
export function skuSearch (parameter) {
  return axios({
    url: '/order/search',
    method: 'get',
    params:parameter
  })
}

//  处理填写国内和国际物流信息的订单 /api/b1/order/add-order
export function addOrders(parameter) {
  return axios({
    url: '/order/add-order',
    method: 'post',
    data: parameter
  })
}

// 获取shopee店铺列表 /api/b1/shopee-auth/get-my-shop
export function getMyShop (parameter) {
  return axios({
    url: '/shopee-auth/get-my-shop',
    method: 'get',
    params:parameter
  })
}

// 获取shopee订单 /api/b1/shopee-order/order
export function getShopeeOrder(parameter) {
  return axios({
    url: '/shopee-order/order',
    method: 'post',
    data: parameter
  })
}
// 获取shopee物流渠道 /api/b1/shopee-order/get-logistics
export function getLogistics (parameter) {
  return axios({
    url: '/shopee-order/get-logistics',
    method: 'get',
    params:parameter
  })
}
// 获取shopee订单物流单号 /api/b1/shopee-order/get-international-number
export function getInternational(parameter) {
  return axios({
    url: '/shopee-order/get-international-number',
    method: 'post',
    data: parameter
  })
}
// 打印shopee订单 /api/b1/shopee-order/print
export function printShopee(parameter) {
  return axios({
    url: '/shopee-order/print',
    method: 'post',
    data: parameter
  })
}
// 打印shopee订单 /api/b1/shopee-order/add-note-number
export function addShopeeNote(parameter) {
  return axios({
    url: '/shopee-order/add-note-number',
    method: 'post',
    data: parameter
  })
}
// 标记完成shopee订单 /api/b1/shopee-order/update-status
export function updateShopeeStatus(parameter) {
  return axios({
    url: '/shopee-order/update-status',
    method: 'post',
    data: parameter
  })
}
// 标记完成amazon订单 /api/b1/order/update-status
export function updateAmazonStatus(parameter) {
  return axios({
    url: '/order/update-status',
    method: 'post',
    data: parameter
  })
}
// 修改标记 api/b1/order/update-color-mark
export function updataColorMark(parameter) {
  return axios({
    url: '/order/update-color-mark',
    method: 'post',
    data: parameter
  })
}
// shopee修改订单标记  shopee-order/update-mark
export function updateShopeeMark(parameter) {
  return axios({
    url: '/shopee-order/update-mark',
    method: 'post',
    data: parameter
  })
}

// 获取订单收件人信息  /api/b1/amazon-order/get-address
export function orderGetAddress(parameter) {
  return axios({
    url: '/amazon-order/get-address',
    method: 'post',
    data: parameter
  })
}

//更新收件人信息  /api/b1/amazon-order/update-address
export function orderUpdaAddress(parameter) {
  return axios({
    url: '/amazon-order/update-address',
    method: 'post',
    data: parameter
  })
}

// 获取订单的报关信息  /api/b1/amazon-order/get-clearance
export function orderClearance(parameter) {
  return axios({
    url: '/amazon-order/get-clearance',
    method: 'post',
    data: parameter
  })
}

// 更新报关信息  /api/b1/amazon-order/update-clearance
export function updateClearance(parameter) {
  return axios({
    url: '/amazon-order/update-clearance',
    method: 'post',
    data: parameter
  })
}

// 订单移到搁置  /api/b1/amazon-order/move-shelve
export function moveShelve(parameter) {
  return axios({
    url: '/amazon-order/move-shelve',
    method: 'post',
    data: parameter
  })
}

// 订单批量虚拟发货 /api/b1/amazon-order/virtual-send
export function orderVirtualSend(parameter) {
  return axios({
    url: '/amazon-order/virtual-send',
    method: 'post',
    data: parameter
  })
}

// 订单移到待审核 /api/b1/amazon-order/move-process
export function moveProcess(parameter) {
  return axios({
    url: '/amazon-order/move-process',
    method: 'post',
    data: parameter
  })
}

// 订单还原到之前的状态 /api/b1/amazon-order/revert
export function orderRevert(parameter) {
  return axios({
    url: '/amazon-order/revert',
    method: 'post',
    data: parameter
  })
}

//订单的国内物流信息  /api/b1/amazon-order/get-order-inland
export function getOrderLnland(parameter) {
  return axios({
    url: '/amazon-order/get-order-inland',
    method: 'post',
    data: parameter
  })
}

// 搁置的订单批量删除 /api/b1/amazon-order/batch-delete
export function batchDelete(parameter) {
  return axios({
    url: '/amazon-order/batch-delete',
    method: 'post',
    data: parameter
  })
}

// 申请国际单号 /api/b1/amazon-order/apply-number
export function createOrder(parameter) {
  return axios({
    url: '/amazon-order/apply-number',
    method: 'post',
    data: parameter
  })
}

// 订单详情编辑 /api/b1/amazon-order/ori-order-update
export function updateOrderDetail(parameter) {
  return axios({
    url: '/amazon-order/ori-order-update',
    method: 'post',
    data: parameter
  })
}

// 根据订单和物流方获取渠道 /api/b1/amazon-order/get-channel
export function getAmazonChannel(parameter) {
  return axios({
    url: '/amazon-order/get-channel',
    method: 'post',
    data: parameter
  })
}

// 设置订单的物流方式 /api/b1/amazon-order/set-logistics
export function saveLogisticsData(parameter) {
  return axios({
    url: '/amazon-order/set-logistics',
    method: 'post',
    data: parameter
  })
}

// 设置订单的国内物流信息   /api/b1/amazon-order/set-order-inland
export function setOrderLnland(parameter) {
  return axios({
    url: '/amazon-order/set-order-inland',
    method: 'post',
    data: parameter
  })
}

// 获取仓库地址   /api/b1/amazon-order/get-warehouse-address
export function getWarehouseAddressFund(parameter) {
  return axios({
    url: '/amazon-order/get-warehouse-address',
    method: 'post',
    data: parameter
  })
}

// 判断余额是否足够创建订单   /api/b1/amazon-order/judge-balance
export function judgeBalance(parameter) {
  return axios({
    url: '/amazon-order/judge-balance',
    method: 'post',
    data: parameter
  })
}

// 根据订单ID计算冻结金额   /api/b1/amazon-order/judge-by-ids
export function judgeByIds(parameter) {
  return axios({
    url: '/amazon-order/judge-by-ids',
    method: 'post',
    data: parameter
  })
}

// 批量标记订单 /api/b1/amazon-order/batch-mark
export function orderBatchMark(parameter) {
  return axios({
    url: '/amazon-order/batch-mark',
    method: 'post',
    data: parameter
  })
}

// 标记已完成 /amazon-order/mark-complete
export function orderMarkComlete(parameter) {
  return axios({
    url: '/amazon-order/mark-complete',
    method: 'post',
    data: parameter
  })
}

// 标记已完成 /amazon-order/sync-order
export function syncOrder(parameter) {
  return axios({
    url: '/amazon-order/sync-order',
    method: 'post',
    data: parameter
  })
}
//请求 获取报关模板列表  /amazon-order/get-clearance-template
export function getClearanceTemplate(parameter) {
  // /api/b1/child/menu
  return axios({
    url: '/amazon-order/get-clearance-template',
    method: 'get',
    params: parameter
  })
}
//请求 获取报关模板列表  /amazon-order/edit-clearance-template
export function editclearancetemplate(parameter) {
  return axios({
    url: '/amazon-order/edit-clearance-template',
    method: 'post',
    data: parameter
  })
}
// 删除报关模板
export function deleteClearanceTemplate(parameter) {
  // /api/b1/child/menu
  return axios({
    url: '/amazon-order/delete-clearance-template',
    method: 'get',
    params: parameter
  })
}
// 批量设置报关模板
export function batchSetClearance(parameter) {
  return axios({
    url: '/amazon-order/batch-set-clearance',
    method: 'post',
    data: parameter
  })
}

// 订单导出
export function exportOrder(parameter) {
  return axios({
    url: '/amazon-order/export-order',
    method: 'get',
    params: parameter
  })
}
