// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import {
  VueAxios
} from './utils/request'
import global_ from './config/global.js'

import draggable from 'vuedraggable';
// import VueDND from 'awe-dnd'
// import './mock'
import { hasBtnPermission } from './utils/permissions' // button permission

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
//按需引入 echarts
let echarts = require('echarts/lib/echarts');
// 引入 vxe-table
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
// import 'vxe-table-plugin-antd/dist/style.css'


Vue.use(VXETable)

Vue.prototype.hasPerm = hasBtnPermission
Vue.config.productionTip = false
Vue.prototype.GLOBAL = global_;
// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
// Vue.use(VueDND)
Vue.use(draggable)
// 引入折线图/柱状图等组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/radar')
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll')//图例滚动
//vue全局注入echarts
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  created() {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')