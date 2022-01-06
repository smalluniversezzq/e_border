import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN, UID, USERNAME } from '@/store/mutation-types'
import global from '@/config/global.js'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist

//路由守卫

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: '/dashboard/workplace' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo')
          .then(res => {
            const roles = res.data && res.data.role
            //是否播报
            let announce = res.data.announce
            //是否提示到期日期
            let expire = res.data.expire
            let end_at = res.data.end_at

            // 获取播报信息
            // result.announce
            if (JSON.stringify(announce).indexOf('title') > 0) {
              let announces = {
                status: true,
                title: announce.title,
                content: announce.content
              }
              store.commit('SET_announce', announces)
            } else {
              // console.log('不播报');
            }
            // 0不提醒 1提醒 2到期退出
            if (expire === 1) {
              let expireinfo = {
                status: true,
                time: end_at,
                type: 1
              }
              store.commit('SET_expireinfo', expireinfo)
            } else if (expire === 2) {
              let expireinfo = {
                status: true,
                time: end_at,
                type: 2
              }
              store.commit('SET_expireinfo', expireinfo)
            }
            //配置
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // console.log("成功了")
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              // console.log("权限路由表",store.getters.addRouters)
              if (to.path === redirect) {
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            // debugger
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
      if (store.getters.roles.length !== 0) {
        //与插件通信传token
        store.dispatch('GetInfoToken').then(res => {
          if (res.data.stop_service) {
            //系统维护时跳转
            next({ path: '/servicestop' })
          }
          Vue.ls.set('CHROME_ID', 'chkfgplodblpnkdckojpdmlogdipkkfd')
          const isHttps = document.location.protocol
          let domain
          if (isHttps === 'https') {
            domain = 'https://' + window.location.host
          } else {
            domain = 'http://' + window.location.host
          }
          if (domain.indexOf("localhost") !== -1) {
            domain = 'http://eborder.com/'
          }
          const token = Vue.ls.get(ACCESS_TOKEN)
          const uid = Vue.ls.get(UID)
          const username = Vue.ls.get(USERNAME)
          if (window.chrome && window.chrome.runtime && window.chrome.runtime.sendMessage) {
            window.chrome.runtime.sendMessage('chkfgplodblpnkdckojpdmlogdipkkfd', {
              type: 'login', msg: 'login', token: token, domain: domain, uid: uid, username: username
            }, function (response) {
              try {
                if (response) {
                  console.log('新插件通信成功', uid, username)
                } else {
                  console.log('新插件通信失败')
                }
              } catch (err) {
                console.log('新插件通信失败')
              }
            })
          }
        })
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {

  NProgress.done() // finish progress bar

})
