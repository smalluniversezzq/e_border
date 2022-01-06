import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'
import publics from './publics'
import publicAttributes from './modules/publicAttributes'
import tabStatus from './modules/goodedit'
import MerchantManege from './modules/MerchantManege'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    publics,
    publicAttributes,
    tabStatus,
    MerchantManege,
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})