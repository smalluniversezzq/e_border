const tabStatus = {
  state: {
    tabone: false,
    tabtwo: false,
    tabthree: false,
    tabfour: false,
    subtabone: true,
    subShopeeTabone: true,
    subtabtwo: true,
    subtabthree: true,
    subtabfour: true,
    goodsId: '',
    key: false,
    updateImgList: [],
    fileList: [],
    classLoading:false,
    //虾皮状态
    attributeState:false,
    tabnum:'',
    ori_language:""
  },
  mutations: {
    set_Tabone: (state, tabone) => {
      state.tabone = tabone
    },
    set_Tabtwo: (state, tabtwo) => {
      state.tabtwo = tabtwo
    },
    set_Tabthree: (state, tabthree) => {
      state.tabthree = tabthree
    },
    set_Tabfour: (state, tabfour) => {
      state.tabfour = tabfour
    },
    set_subTabone: (state, subtabone) => {
      state.subtabone = subtabone
    },
    //虾皮
    set_subShopeeTabone: (state, subShopeeTabone) => {
      state.subShopeeTabone = subShopeeTabone
    },
    set_subTabtwo: (state, subtabtwo) => {
      state.subtabtwo = subtabtwo
    },
    set_subTabthree: (state, subtabthree) => {
      state.subtabthree = subtabthree
    },
    set_subTabfour: (state, subtabfour) => {
      state.subtabfour = subtabfour
    },
    set_goodsId: (state, goodsId) => {
      state.goodsId = goodsId
    },
    set_key: (state, key) => {
      state.key = key
    },
    set_updateImgList: (state, updateImgList) => {
      state.updateImgList = updateImgList
    },
    set_fileList: (state, fileList) => {
      state.fileList = fileList
    },
    set_classLoading: (state, classLoading) => {
      state.classLoading = classLoading
    },
    // set_keyNum: (state, keyNum) => {
    //   state.keyNum = keyNum
    // },
    set_attributeState: (state, attributeState) => {
      state.attributeState = attributeState
    },
    set_tabnum: (state, tabnum) => {
      state.tabnum = tabnum
    },
    set_ori_language: (state,ori_language) =>{
      state.ori_language = ori_language
    }
  },
}


export default tabStatus