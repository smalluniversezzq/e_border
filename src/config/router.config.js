// eslint-disable-next-line

import {
  UserLayout,
  BasicLayout,
  RouteView,
  BlankLayout,
  PageView
} from '@/layouts'
import {
  bxAnaalyse
} from '@/core/icons'
import global from '@/config/global.js'

export const asyncRouterMap = [{
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/home/homes/index',
    children: [{
        path: '/home',
        name: 'home',
        component: PageView,
        redirect: '/home/homes/index',
        hideChildrenInMenu: true,
        meta: {
          title: global.logoText + '首页',
          icon: bxAnaalyse,
          permission: ['home']
        },
        children: [{
            path: '/home/homes/index',
            name: 'homes',
            component: () => import('@/views/home/index'),
            meta: {
              title: '首页',
              hidden: true,
              keepAlive: false
            }
          },
          {
            path: '/home/homes/news',
            name: 'news',
            component: () => import('@/views/home/news'),
            meta: {
              title: '消息中心',
              hidden: true,
              keepAlive: false
            }
          },
          {
            path: '/power/feedback',
            name: 'feedback',
            component: () => import('@/views/systemsetings/feedback'),
            meta: {
              title: '意见反馈',
              keepAlive: false,
              hidden: false
            }
          },
        ]
      },
      {
        path: '/product',
        name: 'product',
        component: PageView,
        meta: {
          title: '产品管理',
          icon: 'switcher',
          permission: ['product']
        },
        children: [
          //产品采集
          {
            path: '/product/collect',
            name: 'collect',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/product/collect/gather',
            meta: {
              title: '采集/认领',
              keepAlive: false,
              permission: ['collection-editing']
            },
            children: [{
                path: '/product/collect/gather',
                name: 'collect',
                component: () => import('@/views/product/collect'),
                meta: {
                  title: '产品列表',
                  keepAlive: false,
                  hidden: true,
                }
              },
              {
                path: '/product/collect/installTutorial',
                name: 'installTutorial',
                component: () => import('@/views/product/installTutorial'),
                meta: {
                  title: '安装说明',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/product/collect/installTutorial1',
                name: 'installTutorial1',
                component: () => import('@/views/product/installTutorial1'),
                meta: {
                  title: '安装说明',
                  keepAlive: false,
                  hidden: true
                }
              },
            ]
          },
          {
            path: '/product/amazonManage',
            name: 'amazonManage',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/product/amazonManage',
            meta: {
              title: 'Amazon产品列表',
              keepAlive: false,
              permission: ['amazonProduct-manage']
            },
            children: [{
                path: '/product/amazonManage',
                name: 'collect',
                component: () => import('@/views/product/amazonManage'),
                meta: {
                  title: 'Amazon产品列表',
                  keepAlive: false,
                  hidden: true,
                }
              },
              {
                path: '/product/manage/goodedit',
                name: 'goodedit',
                component: () => import('@/views/product/goodsEdite'),
                meta: {
                  title: 'Amazon产品编辑',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/product/manage/editInfoAll',
                name: 'editInfoAll',
                component: () => import('@/views/product/editInfoAll'),
                meta: {
                  title: '批量修改信息',
                  keepAlive: false,
                  hidden: true
                }
              },
            ]
          },
          {
            path: '/product/shopeeManage',
            name: 'shopeeManage',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/product/shopeeManage',
            meta: {
              title: 'Shopee产品列表',
              keepAlive: false,
              permission: ['shopeeProduct-manage']
            },
            children: [{
                path: '/product/shopeeManage',
                name: 'collect',
                component: () => import('@/views/product/shopeeManage'),
                meta: {
                  title: 'Shopee产品列表',
                  keepAlive: false,
                  hidden: true,
                }
              },
              {
                path: '/product/shopeeManage/shopeeGoodsEdite',
                name: 'shopeeGoodsEdite',
                component: () => import('@/views/product/shopeeGoodsEdite'),
                meta: {
                  title: 'Shopee产品编辑',
                  keepAlive: false,
                  hidden: true
                }
              },
            ]
          },
          {
            path: '/product/followUp',
            name: 'followUp',
            component: RouteView,
            component: () => import('@/views/product/followUp'),
            meta: {
              title: '跟卖采集',
              keepAlive: false,
              permission: ['product-followUp']
            }
          },
          // {
          //   path: '/product/followMonitor',
          //   name: 'followMonitor',
          //   component: RouteView,
          //   component: () => import('@/views/product/followMonitor'),
          //   meta: {
          //     title: '亚马逊跟卖监控',
          //     keepAlive: false,
          //     permission: ['product-followMonitor']
          //   }
          // },
          {
            path: '/product/blacklist',
            name: 'blacklist',
            component: RouteView,
            component: () => import('@/views/product/blacklist'),
            meta: {
              title: '违禁词检测',
              keepAlive: false,
              permission: ['product-blacklist']
            },
          }
        ]
      },
      //订单
      {
        path: '/order',
        name: 'order',
        component: PageView,
        redirect: '/order/orderverify',
        meta: {
          title: '订单管理',
          icon: 'profile',
          permission: ['order']
        },
        children: [
          // amazon订单
          {
            path: '/order/orderverify',
            name: 'verify',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/order/orderverify/orderverifys',
            meta: {
              title: 'Amazon订单',
              keepAlive: false,
              permission: ['amazon-order-manage']
            },
            children: [{
                path: '/order/orderverify/orderverifys',
                name: 'orderverifys',
                component: () => import('@/views/order/orderverify'),
                meta: {
                  title: '订单列表',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/order/fictitious/orderdetails',
                name: 'orderdetails',
                component: () => import('@/views/order/orderdetails'),
                meta: {
                  title: '订单详情',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/order/fictitious/addorder',
                name: 'addorder',
                component: () => import('@/views/order/addorder'),
                meta: {
                  title: '新增订单',
                  keepAlive: false,
                  hidden: true
                }
              },
            ]
          },
          //shopee订单
          {
            path: '/order/shopeeOrderverify',
            name: 'shopeeVerify',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/order/orderverify/shopeeOrders',
            meta: {
              title: 'Shopee订单',
              keepAlive: false,
              permission: ['shopee-order-manage']
            },
            children: [{
                path: '/order/orderverify/shopeeOrders',
                name: 'orderverifys',
                component: () => import('@/views/order/shopeeOrders'),
                meta: {
                  title: '订单列表',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/order/fictitious/shopeeOrderdetails',
                name: 'shopeeOrderdetails',
                component: () => import('@/views/order/shopeeOrderdetails'),
                meta: {
                  title: '订单详情',
                  keepAlive: false,
                  hidden: true
                }
              },
            ]
          },
        ]
      },
      //物流管理  logistics
      {
        path: '/logistics',
        name: 'logistics',
        component: PageView,
        redirect: '/logistics/logisticsList',
        meta: {
          title: '物流管理',
          icon: 'car',
          permission: ['logistics']
        },
        children: [
          //物流列表
          {
            path: '/logistics/logisticsList',
            name: 'logisticsList',
            component: () => import('@/views/logistics/logisticsList'),
            meta: {
              title: '物流列表',
              keepAlive: false,
              permission: ['logistics-logisticsList']
            },
          },
          {
            path: '/logistics/address',
            name: 'address',
            component: () => import('@/views/logistics/address'),
            meta: {
              title: '仓库地址',
              keepAlive: false,
              permission: ['logistics-address']
            },
          },
          {
            path: '/home/homes/feeCalculate',
            name: 'feeCalculate',
            component: () => import('@/views/home/feeCalculate'),
            meta: {
              title: '运费测算',
              keepAlive: false,
              permission: ['freight']
            },
          },
        ]
      },
      //数据报表
      {
        path: '/report',
        name: 'report',
        component: PageView,
        redirect: '/report/orderverify',
        meta: {
          title: '数据报表',
          icon: 'profile',
          permission: ['report']
        },
        children: [
          // 数据报表
          {
            path: '/report/aggregate',
            name: 'aggregate',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/report/aggregate',
            meta: {
              title: '数据汇总',
              keepAlive: false,
              permission: ['report-summary']
            },
            children: [{
                path: '/report/aggregate',
                name: 'aggregate',
                component: () => import('@/views/report/aggregate'),
                meta: {
                  title: '列表',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/report/gatherDetail',
                name: 'gatherDetail',
                component: () => import('@/views/report/gatherDetail'),
                meta: {
                  title: '数据详情',
                  keepAlive: false,
                  hidden: true
                }
              }
            ]
          },
          {
            path: '/report/statistics',
            name: 'statistics',
            component: () => import('@/views/report/statistics'),
            meta: {
              title: '图表统计',
              keepAlive: false,
              permission: ['report-statistics']
            }
          }
        ]
      },
      //系统设置
      {
        path: '/systemSetings',
        name: 'systemSetings',
        component: PageView,
        redirect: '/systemSetings/empower',
        meta: {
          title: '系统设置',
          icon: 'setting',
          permission: ['systemSetings']
        },
        children: [
          //授权账号 systemSetings-myInfo
          {
            path: '/systemSetings/myInfo',
            name: "myInfo",
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/systemSetings/myInfo/myinfos',
            meta: {
              title: '我的账号',
              keepAlive: false,
              permission: ['systemSetings']
            },
            children: [{
                path: '/systemSetings/myInfo/myinfos',
                name: 'myinfos',
                component: () => import('@/views/systemsetings/myinfo'),
                meta: {
                  title: '我的账号',
                  keepAlive: false,
                  hidden: true
                },
              },
              {
                path: '/power/addrole',
                name: 'addrole',
                component: () => import('@/views/power/addrole'),
                meta: {
                  title: '添加角色',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/power/adduser',
                name: 'adduser',
                component: () => import('@/views/power/adduser'),
                meta: {
                  title: '添加子账号',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/systemSetings/myInfo/upphone',
                name: 'upphone',
                component: () => import('@/views/systemsetings/upphone'),
                meta: {
                  title: '修改手机号',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/systemSetings/myInfo/uppwd',
                name: 'uppwd',
                component: () => import('@/views/systemsetings/uppwd'),
                meta: {
                  title: '修改密码',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/systemSetings/myInfo/forgetpwd',
                name: 'forgetpwd',
                component: () => import('@/views/systemsetings/forgetpwd'),
                meta: {
                  title: '忘记密码',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/systemSetings/myInfo/uploaduser',
                name: 'uploaduser',
                component: () => import('@/views/power/uploaduser'),
                meta: {
                  title: '修改子账号',
                  keepAlive: false,
                  hidden: true
                }
              },
            ]
          },
          {
            path: '/systemSetings/empower',
            name: 'empower',
            component: RouteView,
            hideChildrenInMenu: true,
            redirect: '/systemsetings/empower/empowers',
            meta: {
              title: '授权账号',
              keepAlive: false,
              permission: ['systemSetings-empower']
            },
            children: [{
                path: '/systemsetings/empower/empowers',
                name: 'empowers',
                component: () => import('@/views/systemsetings/empower'),
                meta: {
                  title: '授权账号',
                  keepAlive: false,
                  hidden: true
                }
              },
              {
                path: '/systemsetings/empower/storeinfo',
                name: 'storeinfo',
                component: () => import('@/views/systemsetings/storeinfo'),
                meta: {
                  title: '店铺额外信息',
                  keepAlive: false,
                  hidden: true
                }
              }
            ]
          },
          {
            path: '/rechange/role',
            name: 'rolemermanage',
            component: () => import('@/views/power/rolemanage'),
            meta: {
              title: '角色管理',
              keepAlive: false,
              permission: ['systemSetings-role']
            },
          },
          {
            path: '/rechange/mermanage',
            name: 'mermanage',
            component: () => import('@/views/power/mermanage'),
            meta: {
              title: '用户管理',
              keepAlive: false,
              permission: ['systemSetings-staff']
            },
          },
          {
            path: '/rechange/fund',
            name: 'fund',
            component: () => import('@/views/rechange/fund'),
            meta: {
              title: '平台充值',
              keepAlive: false,
              permission: ['systemSetings-rechange']
            },
          }
        ]
      },
      // {
      //   path: '/amazonMail',
      //   name: 'amazonMail',
      //   component: PageView,
      //   redirect: '/amazonMail/mail',
      //   hideChildrenInMenu: true,
      //   meta: {
      //     title: '邮件',
      //     icon: 'mail',
      //     // permission: ['amazonMail']
      //   },
      //   children: [{
      //     path: '/amazonMail/mail',
      //     name: 'mail',
      //     component: () => import('@/views/amazonMail/mail'),
      //     meta: {
      //       title: '亚马逊邮件',
      //       hidden: true,
      //       keepAlive: false
      //     }
      //   }]
      // }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [{
        path: 'login',
        name: 'login',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [{
      path: 'home',
      name: 'TestHome',
      component: () => import('@/views/Home')
    }]
  },

  {
    path: '/404',
    component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/404')
  },
  {
    path: '/servicestop',
    component: () => import('@/views/exception/servicestop.vue')
  },
  {
    path: '/declareInfo',
    component: () => import('@/views/exception/declareInfo.vue')
  },

]