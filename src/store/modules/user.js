import Vue from 'vue'
import {
  login,
  getInfo,
  logout,
} from '@/api/login'
import {
  ACCESS_TOKEN, UID, USERNAME
} from '@/store/mutation-types'
import {
  welcome
} from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    type: '',
    uid: '',
    nickname: '',
    username: '132132',
    balance: '',
    balance_msg:"",
    buttons: [],
    country_permission:'',
    gather:'',
    announce:{
      status:false,
      title:'',
      content:'',
    },
    expireinfo:{
      status:false,
      time:''
    }
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {
      name,
      welcome
    }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_TYPE: (state, type) => {
      state.type = type
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    },
    SET_NICKNAME: (state, nickname) => {
      state.nickname = nickname
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_BALANCE: (state, balance) => {
      state.balance = balance
    },
    SET_BALANCE_MSG: (state, balance_msg) => {
      state.balance_msg = balance_msg
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons
    },
    SET_COUNTRY_PRRMISSION:(state,country_permission) =>{
      state.country_permission = country_permission
    },
    SET_GATHER:(state,gather)=>{
      state.gather = gather
    },
    SET_announce:(state,announce)=>{
      state.announce = announce
    },
    SET_expireinfo:(state,expireinfo)=>{
      state.expireinfo = expireinfo
    },

  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response.data
          const btnper = response.data.role_btn

          // 按钮权限
          const buttonAuthList = []
          btnper.forEach(button => {
            if (button.perms) {
              buttonAuthList.push(button.perms)
            }
          })
        commit('SET_BUTTONS', buttonAuthList)
          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => {
                  return action.actions
                })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => {
              return permission.permissionId
            })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('用户信息获取失败'))
          }
          commit('SET_NAME', {
            name: result.name,
            welcome: welcome()
          })
          if (result.avatar) {
            commit('SET_AVATAR', result.avatar)
          } else {
            commit('SET_AVATAR', 'http://pic.51yuansu.com/pic3/cover/01/69/80/595f67c042c1b_610.jpg')
          }
          commit('SET_BALANCE', result.balance)
          commit('SET_BALANCE_MSG', result.balance_msg)
          commit('SET_NICKNAME', result.username)
          commit('SET_COUNTRY_PRRMISSION', result.country_permission)
          commit('SET_USERNAME', result.username)
          commit('SET_TYPE', result.type)
          commit('SET_UID', result.uid)
          Vue.ls.set(UID, result.uid)
          Vue.ls.set(USERNAME, result.username)
          commit('SET_GATHER', result.data_gather_title)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 插件发送token
    GetInfoToken ({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getInfo({
          type:'base'
        }).then(response => {
          const result = response.data
          commit('SET_NAME', {
            name: result.name,
            welcome: welcome()
          })
          if (result.avatar) {
            commit('SET_AVATAR', result.avatar)
          } else {
            commit('SET_AVATAR', 'http://pic.51yuansu.com/pic3/cover/01/69/80/595f67c042c1b_610.jpg')
          }
          commit('SET_BALANCE', result.balance)
          commit('SET_NICKNAME', result.username)
          // commit('SET_COUNTRY_PRRMISSION', result.country_permission)
          commit('SET_USERNAME', result.username)
          commit('SET_TYPE', result.type)
          commit('SET_UID', result.uid)
          // if(type ==='1'){

          // }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({
      commit,
      state
    }) {
      // console.log("user退出登录",state)
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_BUTTONS', [])
        Vue.ls.remove(ACCESS_TOKEN)
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user