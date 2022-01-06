import {
  axios
} from '@/utils/request'


const api = {}
export default api
//测试
export function test(parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}
// 测试
export function tests(parameter) {
  return axios({
    url: '/child/group-update',
    method: 'post',
    data: parameter
  })
}
// 采集商品上传（后端采集）  crawler/post
export function crawler(parameter) {
  return axios({
    url: '/crawler/get',
    method: 'post',
    data: parameter
  })
}

// 获取采集箱列表  /api/b1/product/box-index
export function productList(parameter) {
  return axios({
    url: '/product/box-index',
    method: 'get',
    params: parameter
  })
}
//产品认领   /api/b1/product/apply
export function productApply(parameter) {
  return axios({
    url: '/product/apply  ',
    method: 'post',
    data: parameter
  })
}
// 商品导出  /api/b1/product/export?ids=3
// export function exportList(parameter) {
//   return axios({
//     url: '/product/export',
//     method: 'post',
//     data: parameter
//   })
// }
// 商品导出  /api/b1/amazon-product/export?ids=3
export function exportList(parameter) {
  return axios({
    url: '/amazon-product/export',
    method: 'post',
    data: parameter
  })
}
// 翻译  /product/trans'
export function trans(parameter) {
  return axios({
    url: '/product/trans',
    method: 'post',
    data: parameter
  })
}

// 获取商品列表 /api/b1/product/index
export function getGoodsList(parameter) {
  return axios({
    url: '/product/index',
    method: 'get',
    params: parameter
  })
}
// 修改商品  /api/b1/product/update
export function updateGood(parameter) {
  return axios({
    url: '/product/update',
    method: 'post',
    data: parameter
  })
}
//图片上传 /api/b1/product/upload
export function upload(parameter) {
  return axios({
    url: '/product/upload',
    method: 'post',
    data: parameter
  })
}
//   产品删除 product/del
export function prodel(parameter) {
  return axios({
    url: '/product/del',
    method: 'post',
    data: parameter
  })
}
// 采集删除 api/b1/product/box-del
export function boxdel(parameter) {
  return axios({
    url: '/product/box-del',
    method: 'post',
    data: parameter
  })
}

// 商品上传 插件上传 /api/b1/crawler/collect
export function crawlerCollect(parameter) {
  return axios({
    url: '/crawler/collect',
    method: 'post',
    data: parameter
  })
}

// 商品上传 插件上传 /api/b1/crawler/collect  分类
export function crawlerCollect1(parameter) {
  return axios({
    url: '/crawler/query-collect',
    method: 'post',
    data: parameter
  })
}

//  商品采集 链接判断 /api/b1/crawler/validate-url
export function validateUrl(parameter) {
  return axios({
    url: '/crawler/validate-url',
    method: 'get',
    params: parameter
  })
}
//   图片拉伸 /api/b1/product/img-resize
export function imgRessize(parameter) {
  return axios({
    url: '/product/img-resize',
    method: 'post',
    data: parameter
  })
}
// 获取菜单分类  /api/b1/mws-auth/country-category
export function authCountry(parameter) {
  return axios({
    url: '/mws-auth/country-category',
    method: 'get',
    params: parameter
  })
}
// 获取我的店铺列表  /api/b1/mws-auth/get-my-store

export function getMyStore(parameter) {
  return axios({
    url: '/mws-auth/get-my-store',
    method: 'get',
    params: parameter
  })
}

//  nodeId 反查菜单  api/b1/mws-auth/country-category-reverse
export function mwsReverse(parameter) {
  return axios({
    url: '/mws-auth/country-category-reverse',
    method: 'get',
    params: parameter
  })
}
//  一键复制/api/b1/amazon-product/copy 
export function productCopy(parameter) {
  return axios({
    url: '/amazon-product/copy',
    method: 'post',
    data: parameter
  })
}
// 生成汇率 /api/b1/product/currency
export function productCurrency(parameter) {
  return axios({
    url: '/product/currency',
    method: 'post',
    data: parameter
  })
}

//  生成upc /api/b1/api/b1/product/generate-upc
export function getUpc(parameter) {
  return axios({
    url: '/product/generate-upc',
    method: 'get',
    params: parameter
  })
}
//  批量生成upc /api/b1/amazon-product/generate-ean
export function getBatchUpc(parameter) {
  return axios({
    url: '/amazon-product/generate-ean',
    method: 'get',
    params: parameter
  })
}
//获取国家  /api/b1/product/get-country
export function getcountry(parameter) {
  return axios({
    url: '/product/get-country',
    method: 'get',
    params: parameter
  })
}

// 获取分类  /api/b1/product/get-category
export function getcategory(parameter) {
  return axios({
    // url: '/product/get-category',
    url: '/mws-auth/country-category',
    method: 'get',
    params: parameter
  })
}
// 获取榜单列表  /api/b1/product/get-product-rank
export function getrank(parameter) {
  return axios({
    url: '/product/get-product-rank',
    method: 'get',
    params: parameter
  })
}
//产品导出预检查 /api/b1/product-product/check-export
// export function ExportCheck(parameter) {
//   return axios({
//     url: '/product/check-export',
//     method: 'post',
//     data: parameter
//   })
// }
export function ExportCheck(parameter) {
  return axios({
    url: '/amazon-product/check-export',
    method: 'post',
    data: parameter
  })
}

//  amazon加入待发布 /api/b1/api/b1/amazon-product/add-wait-publish
export function insertPublish(parameter) {
  return axios({
    url: '/amazon-product/add-wait-publish',
    method: 'post',
    data: parameter
  })
}
//  shopee加入待发布 /api/b1/shopee-product/add-wait-publish
export function insertShopee(parameter) {
  return axios({
    url: '/shopee-product/add-wait-publish',
    method: 'post',
    data: parameter
  })
}

//待发布商品列表   /api/b1/api/b1/mws-upload/waite-publish-list
// export function publishList(parameter) {
//   return axios({
//     url: '/mws-upload/waite-publish-list',
//     method: 'get',
//     params: parameter
//   })
// }
//待发布商品列表   /api/b1/api/b1/new-mws-upload/waite-publish-list
export function publishList(parameter) {
  return axios({
    url: '/new-mws-upload/waite-publish-list',
    method: 'get',
    params: parameter
  })
}

// 倒计时    /api/b1/new-mws-upload/countdown
export function countDown(parameter) {
  return axios({
    url: '/new-mws-upload/countdown',
    method: 'post',
    data: parameter
  })
}



//批量删除待发布的商品  /api/b1/api/b1/mws-upload/delete-waite-publish

// export function deletePublish(parameter) {
//   return axios({
//     url: '/mws-upload/delete-waite-publish',
//     method: 'post',
//     data: parameter
//   })
// }
//批量删除待发布的商品  /api/b1/api/b1/new-mws-upload/delete-waite-publish
export function deletePublish(parameter) {
  return axios({
    url: '/new-mws-upload/delete-waite-publish',
    method: 'post',
    data: parameter
  })
}

// 批量删除发布历史的商品 api/b1/new-mws-upload/failed-deleted
export function failedDeleted(parameter) {
  return axios({
    url: '/new-mws-upload/failed-deleted',
    method: 'post',
    data: parameter
  })
}
//一键发布  mws-upload/publish-goods  舍弃接口

// export function uploadPublisGoods (parameter) {
//   return axios({
//     url: '/mws-upload/publish-goods',
//     method:'post',
//     data:parameter
//   })
// }

// 一键发布新接口  /api/b1/new-mws-upload/new-publish-goods
export function uploadPublisGoods(parameter) {
  return axios({
    url: '/new-mws-upload/new-publish-goods',
    method: 'post',
    data: parameter
  })
}
//已经发布的商品结果列表  /api/b1/api/b1/mws-upload/upload-result
// export function uploadResult(parameter) {
//   return axios({
//     url: '/mws-upload/upload-result',
//     method: 'get',
//     params: parameter
//   })
// }
//已经发布的商品结果列表  /api/b1/api/b1/new-mws-upload/upload-result
export function uploadResult(parameter) {
  return axios({
    url: '/new-mws-upload/upload-result',
    method: 'get',
    params: parameter
  })
}

//  发布失败以后再次一键上传  /api/b1/api/b1/mws-upload/publish
export function uploadPublish(parameter) {
  return axios({
    url: '/mws-upload/publish',
    method: 'post',
    data: parameter
  })
}
// 获取黑名单 /api/b1/api/b1/blacklist/list
export function getBlacklist(parameter) {
  return axios({
    url: '/blacklist/list',
    method: 'get',
    params: parameter
  })
}

// 添加黑名单  /api/b1/api/b1/blacklist/add
export function addBlacklist(parameter) {
  return axios({
    url: '/blacklist/add',
    method: 'post',
    data: parameter
  })
}

// 修改黑名单 /api/b1/api/b1/blacklist/update
export function updateblacklist(parameter) {
  return axios({
    url: '/blacklist/update',
    method: 'post',
    data: parameter
  })
}

// 删除黑名单 /api/b1/api/b1/blacklist/del
export function delBlacklist(parameter) {
  return axios({
    url: '/blacklist/del',
    method: 'post',
    data: parameter
  })
}

// 启用/禁用黑名单 /api/b1/api/b1/blacklist/update-status
export function updateBlackStatus(parameter) {
  return axios({
    url: '/blacklist/update-status',
    method: 'post',
    data: parameter
  })
}

//  分类采集获取的url发送给后端 转为urlList的接口
// /crawler/collect
export function crawlerQueryCollect(parameter) {
  return axios({
    url: '/crawler/query-collect',
    method: 'post',
    data: parameter
  })
}
//批量修改    /api/b1/product/batch-update
// export function batchUpdate(parameter) {
//   return axios({
//     url: '/product/batch-update',
//     method: 'post',
//     data: parameter
//   })
// }
//批量修改    /api/b1/amazon-product/batch-update
export function batchUpdate(parameter) {
  return axios({
    url: '/amazon-product/batch-update',
    method: 'post',
    data: parameter
  })
}
// 插件翻译  /api/b1/product/trans
export function transPlugin(parameter) {
  return axios({
    url: '/product/trans',
    method: 'post',
    data: parameter
  })
}
// 获取付费翻译信息  /api/b1/product/trans-fee
export function trans_fee(parameter) {
  return axios({
    url: '/product/trans-fee',
    method: 'post',
    data: parameter
  })
}

//商品属性信息获取
export function getSkuData(parameter) {
  return axios({
    url: '/amazon-product/get-sku',
    method: 'get',
    params: parameter
  })
}
//商品sku变体属性新增
export function skuAddAttributes(parameter) {
  return axios({
    url: '/amazon-product/sku-property-post',
    method: 'post',
    data: parameter
  })
}

//商品sku变体属性获取
export function skuGetAttributes(parameter) {
  return axios({
    url: '/amazon-product/sku-property-get',
    method: 'get',
    params: parameter
  })
}
// 获取授权国家信息  /api/b1/product/trans-fee
export function country_list(parameter) {
  return axios({
    url: '/mws-auth/country-list',
    method: 'get',
    params: parameter
  })
}
// 获取基本信息  /api/b1/amazon-product/get-base
export function get_base(parameter) {
  return axios({
    url: '/amazon-product/get-base',
    method: 'get',
    params: parameter
  })
}
// 更新基本信息  /api/b1/amazon-product/get-base
export function update_base(parameter) {
  return axios({
    url: '/amazon-product/update-base',
    method: 'post',
    data: parameter
  })
}
// 搜索分类信息  /api/b1/mws-auth/search-category
export function search_category(parameter) {
  return axios({
    url: '/mws-auth/search-category',
    method: 'get',
    params: parameter
  })
}
// 更新图片信息  /api/b1/amazon-product/update-image
export function update_img(parameter) {
  return axios({
    url: '/amazon-product/update-image',
    method: 'post',
    data: parameter
  })
}


//商品sku变体属性修改
export function skuAlertAttributes(parameter) {
  return axios({
    url: '/amazon-product/sku-property-put',
    method: 'post',
    data: parameter
  })
}
//商品描述信息获取   /api/b1/amazon-product/get-desc
export function getDesc(parameter) {
  return axios({
    url: '/amazon-product/get-desc',
    method: 'get',
    params: parameter
  })
}
// 商品描述信息更新  /api/b1/amazon-product/update-desc
export function update_desc(parameter) {
  return axios({
    url: '/amazon-product/update-desc',
    method: 'post',
    data: parameter
  })
}


//商品sku变体属性删除
export function skuDeleteAttributes(parameter) {
  return axios({
    url: '/amazon-product/sku-property-delete',
    method: 'post',
    data: parameter
  })
}

//删除变体商品
export function deleteSku(parameter) {
  return axios({
    url: '/amazon-product/delete-sku',
    method: 'get',
    params: parameter
  })
}
// 获取商品列表(新) /api/b1/amazon-product/index
export function getCollectList(parameter) {
  return axios({
    url: '/amazon-product/index',
    method: 'get',
    params: parameter
  })
}

//变体商品展示图片
export function SkuPicture(parameter) {
  return axios({
    url: '/amazon-product/get-sku-image',
    method: 'get',
    params: parameter
  })
}
//商品列表数据删除(新) /api/b1/amazon-product/del
export function deleteGoodList(parameter) {
  return axios({
    url: '/amazon-product/del',
    method: 'post',
    data: parameter
  })
}

//更新/保存  sku变体数据
export function updateSku(parameter) {
  return axios({
    url: '/amazon-product/update-sku',
    method: 'post',
    data: parameter
  })
}
//分类id和nodeID转换
export function changeId(parameter) {
  return axios({
    url: '/mws-auth/category-id-to-nodeid',
    method: 'post',
    data: parameter
  })
}
// 获取国家权限  /mws-auth/country-list
export function getCountryList(parameter) {
  return axios({
    url: '/mws-auth/country-list',
    method: 'get',
    params: parameter
  })
}

// 2.30版本
// 跟卖采集 /api/b1/amazon-to-sell/to-sell-crawler
export function toSellCrawler(parameter) {
  return axios({
    url: '/amazon-to-sell/to-sell-crawler',
    method: 'post',
    data: parameter
  })
}

// 跟卖列表 /api/b1/amazon-to-sell/to-sell-list toSellList
export function toSellList(parameter) {
  return axios({
    url: '/amazon-to-sell/to-sell-list',
    method: 'get',
    params: parameter
  })
}

//  获取店铺下所有用户信息  /amazon-to-sell/all-user
export function getAllUser(parameter) {
  return axios({
    url: '/amazon-to-sell/all-user',
    method: 'get',
    params: parameter
  })
}

// 跟卖删除 /api/b1/amazon-to-sell/to-sell-delete
export function toSellDel(parameter) {
  return axios({
    url: '/amazon-to-sell/to-sell-delete',
    method: 'post',
    data: parameter
  })
}
//跟卖修改库存和价格 /api/b1/amazon-to-sell/update-sell-info
export function updataSellInfo(parameter) {
  return axios({
    url: '/amazon-to-sell/update-sell-info',
    method: 'post',
    data: parameter
  })
}
//上架 /api/b1/amazon-to-sell/mws-to-sell
export function mwsToSell(parameter) {
  return axios({
    url: '/amazon-to-sell/mws-to-sell',
    method: 'post',
    data: parameter
  })
}
// 下架 /api/b1/amazon-to-sell/mws-sold-out
export function mwsSoldOut(parameter) {
  return axios({
    url: '/amazon-to-sell/mws-sold-out',
    method: 'post',
    data: parameter
  })
}
// 更新并上架 /api/b1/amazon-to-sell/update-and-upload
export function updataAndUpload(parameter) {
  return axios({
    url: '/amazon-to-sell/update-and-upload',
    method: 'post',
    data: parameter
  })
}

// 定时规则添加接口 /api/b1/api/b1/amazon-to-sell/add-timer-rule
export function addTimerRule(parameter) {
  return axios({
    url: '/amazon-to-sell/add-timer-rule',
    method: 'post',
    data: parameter
  })
}

// 定时规则列表 /api/b1/amazon-to-sell/timer-list
export function getTimerList(parameter) {
  return axios({
    url: '/amazon-to-sell/timer-list',
    method: 'get',
    params: parameter
  })
}
// 定时名称列表  /api/b1/amazon-to-sell/get-timer-title
export function getTimerTitle(parameter) {
  return axios({
    url: '/amazon-to-sell/get-timer-title',
    method: 'get',
    params: parameter
  })
}

// 商品定时修改 /api/b1/amazon-to-sell/update-sell-timer
export function updataSellTimer(parameter) {
  return axios({
    url: '/amazon-to-sell/update-sell-timer',
    method: 'post',
    data: parameter
  })
}

// 定时状态更改或删除  /api/b1/amazon-to-sell/timer-update
export function timerUpdate(parameter) {
  return axios({
    url: '/amazon-to-sell/timer-update',
    method: 'post',
    data: parameter
  })
}

// 下架失败撤销  /api/b1/amazon-to-sell/update-sell-status
export function updataSellStatus(parameter) {
  return axios({
    url: '/amazon-to-sell/update-sell-status',
    method: 'post',
    data: parameter
  })
}
// 新增/修改分类 /api/b1/amazon-product/product-category
export function AddproductCategory(parameter) {
  return axios({
    url: '/amazon-product/product-category',
    method: 'post',
    data: parameter
  })
}

// 获取自定义分类 /api/b1/amazon-product/get-personal-category
export function getPersonalCategory(parameter) {
  return axios({
    url: '/amazon-product/get-personal-category',
    method: 'get',
    params: parameter
  })
}

// 根据自定义分类获取关联的亚马逊分类 /api/b1/amazon-product/get-amazon-category
export function getAmazonCategory(parameter) {
  return axios({
    url: '/amazon-product/get-amazon-category',
    method: 'get',
    params: parameter
  })
}

// 删除自定义分类 /api/b1/amazon-product/delete-personal-category
export function deletePersonalCategory(parameter) {
  return axios({
    url: '/amazon-product/delete-personal-category',
    method: 'get',
    params: parameter
  })
}

// 保存分类关系 /api/b1/amazon-product/save-category
export function saveCategory(parameter) {
  return axios({
    url: '/amazon-product/save-category',
    method: 'post',
    data: parameter
  })
}
// 源商品列表接口  /api/b1/source-product/source-list
export function sourcwList(parameter) {
  return axios({
    url: '/source-product/source-list',
    method: 'get',
    params: parameter
  })
}
// 源商品删除接口  /api/b1/source-product/deleted
export function sourceProductDeleted(parameter) {
  return axios({
    url: '/source-product/deleted',
    method: 'post',
    data: parameter
  })
}
//认领接口 /api/b1/source-product/claim-product
export function claimProduct(parameter) {
  return axios({
    url: '/source-product/claim-product',
    method: 'post',
    data: parameter
  })
}
// 虾皮接口 2.4.0
// get 虾皮商品列表 /api/b1/shopee-product/index
export function shopeeProductIndex(parameter) {
  return axios({
    url: '/shopee-product/index',
    method: 'get',
    params: parameter
  })
}
// post 虾皮删除 /api/b1/shopee-product/deleted
export function shopeeDeleted(parameter) {
  return axios({
    url: '/shopee-product/deleted',
    method: 'post',
    data: parameter
  })
}
// post 虾皮批量修改 /api/b1/shopee-product/batch-update
export function shopeeBatchUpdate(parameter) {
  return axios({
    url: '/shopee-product/batch-update',
    method: 'post',
    data: parameter
  })
}
// get 获取基本信息和图片地址 /api/b1/shopee-product/get-base
export function shopeeGetBase(parameter) {
  return axios({
    url: '/shopee-product/get-base',
    method: 'get',
    params: parameter
  })
}
// post 基本信息修改 /api/b1/shopee-product/update-base
export function shopeeUpdateBase(parameter) {
  return axios({
    url: '/shopee-product/update-base',
    method: 'post',
    data: parameter
  })
}
// post 更新图片 /api/b1/shopee-product/update-images
export function shopeeUpdateImages(parameter) {
  return axios({
    url: '/shopee-product/update-images',
    method: 'post',
    data: parameter
  })
}
// get 获取变体信息 /api/b1/shopee-product/get-variant
export function getVariant(parameter) {
  return axios({
    url: '/shopee-product/get-variant',
    method: 'get',
    params: parameter
  })
}
// post 变体更新 /api/b1/shopee-product/update-variant
export function updateVariant(parameter) {
  return axios({
    url: '/shopee-product/update-variant',
    method: 'post',
    data: parameter
  })
}
// get 商品信息 /api/b1/shopee-product/get-product-desc
export function getProductDesc(parameter) {
  return axios({
    url: '/shopee-product/get-product-desc',
    method: 'get',
    params: parameter
  })
}
// POST 更新商品信息 /api/b1/shopee-product/update-product-desc
export function updateProductDesc(parameter) {
  return axios({
    url: '/shopee-product/update-product-desc',
    method: 'post',
    data: parameter
  })
}
// get 获取属性 /api/b1/shopee-product/get-property
export function getProperty(parameter) {
  return axios({
    url: '/shopee-product/get-property',
    method: 'get',
    params: parameter
  })
}
// 虾皮商品导出  /api/b1//shopee-product/batch-export
export function shopeeExportList(parameter) {
  return axios({
    url: '/shopee-product/batch-export',
    method: 'post',
    data: parameter
  })
}
// /shopee-product/add-wait-publish

// 虾皮获取店铺 /api/b1/shopee-publish/store-list
export function getShopeeStoreList(parameter) {
  return axios({
    url: '/shopee-publish/store-list',
    method: 'get',
    params: parameter
  })
}
// 虾皮获取物流 /api/b1/shopee-publish/logistics
export function getShopeeLogistics(parameter) {
  return axios({
    url: '/shopee-publish/logistics',
    method: 'get',
    params: parameter
  })
}
// shopee发布列表 shopee-publish/wait-publish
export function getShopeePublishList(parameter) {
  return axios({
    url: '/shopee-publish/wait-publish',
    method: 'get',
    params: parameter
  })
}
// shopee一键发布 /api/b1/shopee-publish/shopee-publish
export function shopeePublish(parameter) {
  return axios({
    url: '/shopee-publish/shopee-publish',
    method: 'post',
    data: parameter
  })
}
// shopee导出 /api/b1/shopee-product/batch-export
export function shopeeBatchExport(parameter) {
  return axios({
    url: '/shopee-product/batch-export',
    method: 'post',
    data: parameter
  })
}
// shopee删除 /api/b1/shopee-publish/deleted
export function shopeePublishDeleted(parameter) {
  return axios({
    url: '/shopee-publish/deleted',
    method: 'post',
    data: parameter
  })
}

//  变体编辑保存 /api/b1/shopee-product/update-property-value
export function updatePropertyValue(parameter) {
  return axios({
    url: '/shopee-product/update-property-value',
    method: 'post',
    data: parameter
  })
}

// 导出原文 /api/b1/amazon-product/export-ori 
export function exportOri(parameter) {
  return axios({
    url: '/amazon-product/export-ori ',
    method: 'post',
    data: parameter
  })
}

//获取商品是否可导出的原因  api/b1/amazon-product/get-export-error

export function getExportError(parameter) {
  return axios({
    url: '/amazon-product/get-export-error',
    method: 'get',
    params: parameter
  })
}

//获取oss秘钥  /api/b1/product/get-image-key
export function getImageKey(parameter) {
  return axios({
    url: '/product/get-image-key',
    method: 'get',
    params: parameter
  })
}

// 推送订单信息  /api/b1/amazon-order/mws-order-push
export function mwsOrderPush(parameter) {
  return axios({
    url: '/amazon-order/mws-order-push',
    method: 'post',
    data: parameter
  })
}

//批量获取商品信息 /api/b1/amazon-product/batch-get-product
export function batchGetProduct(parameter) {
  return axios({
    url: '/amazon-product/batch-get-product',
    method: 'get',
    params: parameter
  })
}

//批量修改标题售价 /api/b1/amazon-product/batch-update-product
export function batchUpdateProduct(parameter) {
  return axios({
    url: '/amazon-product/batch-update-product',
    method: 'post',
    data: parameter
  })
}


//关键词模板
// 新增/修改基本信息 /api/b1/amazon-good-template/update-base-info
export function updateBaseInfo(parameter) {
  return axios({
    url: '/amazon-good-template/update-base-info',
    method: 'post',
    data: parameter
  })
}

// 保存/更新商品模板图片 amazon-good-template/update-image
export function TupdateImage(parameter) {
  return axios({
    url: '/amazon-good-template/update-image',
    method: 'post',
    data: parameter
  })
}
// 获取商品模板的图片 /api/b1/amazon-good-template/get-image
export function TgetImage(parameter) {
  return axios({
    url: '/amazon-good-template/get-image',
    method: 'get',
    params: parameter
  })
}

//  保存/更新商品模板描述信息 amazon-good-template/update-desc
export function TupdateDesc(parameter) {
  return axios({
    url: '/amazon-good-template/update-desc',
    method: 'post',
    data: parameter
  })
}
//获取组合后的标题 amazon-good-template/combined-title
export function TcombinedTitle(parameter) {
  return axios({
    url: '/amazon-good-template/combined-title',
    method: 'post',
    data: parameter
  })
}
// 保存/更新商品模板变体信息 amazon-good-template/update-sku
export function TupdateSku(parameter) {
  return axios({
    url: '/amazon-good-template/update-sku',
    method: 'post',
    data: parameter
  })
}
// 获取商品模板列表  amazon-good-template/get-good-list
export function TgetGoodList(parameter) {
  return axios({
    url: '/amazon-good-template/get-good-list',
    method: 'get',
    params: parameter
  })
}

//获取标题列表 amazon-good-template/get-title-list\
export function TgetTitleList(parameter) {
  return axios({
    url: '/amazon-good-template/get-title-list',
    method: 'get',
    params: parameter
  })
}
//复制商品 amazon-good-template/copy-good
export function TcopyGood(parameter) {
  return axios({
    url: '/amazon-good-template/copy-good',
    method: 'post',
    data: parameter
  })
}
//删除模板商品 amazon-good-template/delete-good
export function TdeleteGood(parameter) {
  return axios({
    url: '/amazon-good-template/delete-good',
    method: 'post',
    data: parameter
  })
}
//加入发布 amazon-good-template/join-publish
export function TjoinPublish(parameter) {
  return axios({
    url: '/amazon-good-template/join-publish',
    method: 'post',
    data: parameter
  })
}

//加入检测 /new-mws-upload/join-check-task
export function JoinCheckTask(parameter) {
  return axios({
    url: '/new-mws-upload/join-check-task',
    method: 'post',
    data: parameter
  })
}

//下载检测表格 /new-mws-upload/export-check-excel
export function ExportCheckEaxcel(parameter) {
  return axios({
    url: '/new-mws-upload/export-check-excel',
    method: 'post',
    data: parameter
  })
}

//获取基本信息 amazon-good-template/get-base-info
export function TgetBaseInfo(parameter) {
  return axios({
    url: '/amazon-good-template/get-base-info',
    method: 'get',
    params: parameter
  })
}

// 获取商品模板变体信息 amazon-good-template/get-sku
export function TgetSku(parameter) {
  return axios({
    url: '/amazon-good-template/get-sku',
    method: 'get',
    params: parameter
  })
}
//获取商品模板的描述信息 amazon-good-template/get-desc
export function TgetDesc(parameter) {
  return axios({
    url: '/amazon-good-template/get-desc',
    method: 'get',
    params: parameter
  })
}
//导出表格 amazon-good-template/export
export function Texport(parameter) {
  return axios({
    url: '/amazon-good-template/export',
    method: 'post',
    data: parameter
  })
}
// 获取待发布列表  amazon-good-template/get-publish-list
export function TgetPublishList(parameter) {
  return axios({
    url: '/amazon-good-template/get-publish-list',
    method: 'get',
    params: parameter
  })
}
// 获取发布结果列表 amazon-good-template/get-result-list
export function TgetResultList(parameter) {
  return axios({
    url: '/amazon-good-template/get-result-list',
    method: 'get',
    params: parameter
  })
}
// 一键发布 amazon-good-template/publish
export function TPublish(parameter) {
  return axios({
    url: '/amazon-good-template/publish',
    method: 'post',
    data: parameter
  })
}
// 重新发布 amazon-good-template/publish-again
export function TPublishAgain(parameter) {
  return axios({
    url: '/amazon-good-template/publish-again',
    method: 'post',
    data: parameter
  })
}
//批量更换EAN  amazon-good-template/change-ean
export function TchangeEan(parameter) {
  return axios({
    url: '/amazon-good-template/change-ean',
    method: 'post',
    data: parameter
  })
}
// 批量更换SKU  /api/b1/amazon-good-template/change-sku
export function TchangeSku(parameter) {
  return axios({
    url: '/amazon-good-template/change-sku',
    method: 'post',
    data: parameter
  })
}
//获取部分失败的商品列表  /amazon-good-template/get-fail-ean-good
export function TgetFailEanGood(parameter) {
  // /api/b1/child/menu
  return axios({
    url: '/amazon-good-template/get-fail-ean-good',
    method: 'get',
    params: parameter
  })
}
// 获取失败的EAN列表 amazon-good-template/get-fail-ean-list
export function TgetFailEanList(parameter) {
  // /api/b1/child/menu
  return axios({
    url: '/amazon-good-template/get-fail-ean-list',
    method: 'get',
    params: parameter
  })
}
// 更换失败的SKU amazon-good-template/change-variant-sku
export function TchangeVariantSku(parameter) {
  return axios({
    url: '/amazon-good-template/change-variant-sku',
    method: 'post',
    data: parameter
  })
}
// 更换失败的EAN amazon-good-template/change-variant-ean
export function TchangeVariantEan(parameter) {
  return axios({
    url: '/amazon-good-template/change-variant-ean',
    method: 'post',
    data: parameter
  })
}
// 更换EAN或SKU重新上传 amazon-good-template/publish-good-by-ean
export function TpublishGoodByEan(parameter) {
  return axios({
    url: '/amazon-good-template/publish-good-by-ean',
    method: 'post',
    data: parameter
  })
}
// 一键抠图 product/cut-out-pic
export function cutOutPic(parameter) {
  return axios({
    url: '/product/cut-out-pic',
    method: 'post',
    data: parameter
  })
}
// 图片翻译 product/trans-pic
export function transPic(parameter) {
  return axios({
    url: '/product/trans-pic',
    method: 'post',
    data: parameter
  })
}

// 保存图片修改 product/save-product-image
export function saveProductImg(parameter) {
  return axios({
    url: '/product/save-product-image',
    method: 'post',
    data: parameter
  })
}

// 获取智能调价规则列表 follow/get-rule-list
export function getPriceRule(parameter) {
  return axios({
    url: '/follow/get-rule-list',
    method: 'get',
    params: parameter
  })
}
// 获取智能调价规则详情 follow/get-rule-list
export function getPriceRuleDetail(parameter) {
  return axios({
    url: '/follow/get-rule',
    method: 'get',
    params: parameter
  })
}
// 添加调价规则 follow/add-rule
export function addPriceRule(parameter) {
  return axios({
    url: '/follow/add-rule',
    method: 'post',
    data: parameter
  })
}
// 修改规则状态 follow/change-status
export function changeStatus(parameter) {
  return axios({
    url: '/follow/change-status',
    method: 'post',
    data: parameter
  })
}
// 更新规则 follow/update-rule
export function updatePriceRule(parameter) {
  return axios({
    url: '/follow/update-rule',
    method: 'post',
    data: parameter
  })
}
// 删除规则 follow/delete-rule
export function delPriceRule(parameter) {
  return axios({
    url: '/follow/delete-rule',
    method: 'post',
    data: parameter
  })
}
// 设置跟卖商品的最高最低价和规则 follow/set-price
export function setFollowRule(parameter) {
  return axios({
    url: '/follow/set-price',
    method: 'post',
    data: parameter
  })
}
// 获取监控商品列表 follow/get-monitor-list
export function getGoodMonitorList(parameter) {
  return axios({
    url: '/follow/get-monitor-list',
    method: 'get',
    params: parameter
  })
}
// 获取添加监控所有商品列表 follow/get-product-list
export function getProductList(parameter) {
  return axios({
    url: '/follow/get-product-list',
    method: 'get',
    params: parameter
  })
}
// 设置跟卖商品的最高最低价和规则 follow/add-monitor-product
export function addMonitorProduct(parameter) {
  return axios({
    url: '/follow/add-monitor-product',
    method: 'post',
    data: parameter
  })
}
// 获取跟卖日志 follow/get-follow-log
export function getFollowLog(parameter) {
  return axios({
    url: '/follow/get-follow-log',
    method: 'get',
    params: parameter
  })
}
// 获取跟卖历史 follow/get-follow-history
export function getFollowHistory(parameter) {
  return axios({
    url: '/follow/get-follow-history',
    method: 'get',
    params: parameter
  })
}
// 设置跟卖商品的最高最低价和规则 follow/delete-monitor-product
export function delMonitorProduct(parameter) {
  return axios({
    url: '/follow/delete-monitor-product',
    method: 'post',
    data: parameter
  })
}