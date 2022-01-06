const MerchantManege = {
  state: {
    tabEdit: null,
    MerchantInfo:{},
    roleEdit:true,
    TabEditClass:true

  },
  mutations: {
    set_TabEdit: (state, tabEdit) => {
      state.tabEdit = tabEdit
    },
    set_TabEditRole: (state, roleEdit) => {
      state.roleEdit = roleEdit
    },
    set_MerchantInfo: (state, MerchantInfo) => {
      state.MerchantInfo = MerchantInfo
    },
    set_TabEditClass:(state,TabEditClass)=>{
      state.TabEditClass = TabEditClass
    }
  }
}


export default MerchantManege