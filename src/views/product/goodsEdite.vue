<template>
  <div>
    <a-card>
      <div class='tar'>
        <a-button class='tar' type='primary' @click='submitAll'>一键保存</a-button>
      </div>
      <a-tabs defaultActiveKey="1" type="card" @change='callback'>
        <a-tab-pane tab="基本信息" key="1">
          <basicInfo @commonSignOut="commonSignOut" ref='tabone'></basicInfo>
        </a-tab-pane>
        <a-tab-pane tab="商品图片" :disabled='!this.$store.state.tabStatus.goodsId && addNewProduct == 1' key="2">
          <goodsImg @commonSignOut="commonSignOut" ref='tabtwo'></goodsImg>
        </a-tab-pane>
        <a-tab-pane tab="属性信息" :disabled='!this.$store.state.tabStatus.goodsId && addNewProduct == 1' key="3">
          <attributeInfo @commonSignOut="commonSignOut" ref='tabthree'></attributeInfo>
        </a-tab-pane>
        <a-tab-pane tab="商品描述" :disabled='!this.$store.state.tabStatus.goodsId && addNewProduct == 1' key="4">
          <goodsInfo @commonSignOut="commonSignOut" ref='tabfour'></goodsInfo>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-modal
      title='确认提交'
      :visible='submitAllVisibles'
      @ok="submitAllOk"
      @cancel="submitAllCancel"
      :confirmLoading="SubmitAllLoading"

    >{{'确认一键保存'}}
    </a-modal>
    <a-modal
      title='返回'
      :visible='cancelVisibles'
      @ok="cancelOk"
      @cancel="cancelCancel"
    >
      <div>
        <span v-for='(item) in cancelAllText' :key='index'>
          {{item}}
        </span>
        暂未保存,确认退出吗?
      </div>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import basicInfo from '@/views/product/components/basicInfo.vue'
import goodsImg from '@/views/product/components/goodsImg.vue'
import attributeInfo from '@/views/product/components/attributeInfo.vue'
import goodsInfo from '@/views/product/components/goodsInfo.vue'
export default {
  components:{
    basicInfo,
    goodsImg,
    attributeInfo,
    goodsInfo
  },
  data() {
    return {
      submitAllVisibles:false,
      cancelVisibles:false,
      keys:"",
      addNewProduct:"",
      cancelAllText:"",
      alertTxt:"",
      SubmitAllLoading:false,
      saveNums:0,
    };
  },
  methods: {
    callback(key) {
      key == 4 ? this.$store.commit('set_Tabfour',true) : ""
      key == 1 ? this.$store.commit('set_Tabone',true) : ""
      key == 2 ? (this.$store.commit('set_Tabtwo',true),this.$refs.tabtwo.getBaseInfo()) : ""
      key == 3 ? this.$store.commit('set_Tabthree',true) : ""
      key == 3 ? (this.$store.commit('set_key', true),this.$refs.tabthree.getSku()) : ""
      // this.$store.commit('set_KeyNum', key)
    },
    //批量提交
    submitAll(){
      this.submitAllVisibles = true
    },
    submitAllOk(){
      // console.log('tabone:',this.$store.state.tabStatus.tabone,
      // 'tabtwo:',this.$store.state.tabStatus.tabtwo,
      // 'tabthree:',this.$store.state.tabStatus.tabthree,
      // 'tabfour:',this.$store.state.tabStatus.tabfour,)
      this.$store.state.tabStatus.tabone === true ? (this.$refs.tabone.updateContent('forbid'),this.$store.commit('set_subTabone',false)):''
      this.$store.state.tabStatus.tabtwo === true ? (this.$refs.tabtwo.updateImgContent('forbid'),this.$store.commit('set_subTabtwo',false)):''
      this.$store.state.tabStatus.tabthree === true ? (this.$refs.tabthree.saveData('forbid'),this.$store.commit('set_subTabthree',false)):''
      this.$store.state.tabStatus.tabfour === true ? (this.$refs.tabfour.nextStep('forbid'),this.$store.commit('set_subTabfour',false)):''
      // 监听保存是否成功
      this.monitoringSubmitAll()
    },
    monitoringSubmitAll(){
      let _this = this
      this.SubmitAllLoading = true
      // let nums = 0
      setTimeout(()=>{
        if(_this.$store.state.tabStatus.subtabone === true && _this.$store.state.tabStatus.subtabtwo === true && _this.$store.state.tabStatus.subtabthree === true && _this.$store.state.tabStatus.subtabfour === true ){
          console.log(_this.$store.state.tabStatus.subtabone,_this.$store.state.tabStatus.subtabtwo,_this.$store.state.tabStatus.subtabthree,_this.$store.state.tabStatus.subtabfour)
          console.log('全部成功')
          _this.$notification.success({
            message: '成功',
            description: '全部保存成功',
          });
          _this.submitAllVisibles = false
          _this.SubmitAllLoading = false
          if(Vue.ls.get("black")){
            _this.$router.push({
              path:'/product/amazonManage',
              query:{
                isBlack:Vue.ls.get("black")
              }
            })
          }else{
            _this.$router.push('/product/amazonManage')
          }
          // _this.saveNums++
        }else{
          if(_this.saveNums>10){
            console.log(_this.$store.state.tabStatus.subtabone,_this.$store.state.tabStatus.subtabtwo,_this.$store.state.tabStatus.subtabthree,_this.$store.state.tabStatus.subtabfour)
            _this.alertTxt = ''
            if(_this.$store.state.tabStatus.subtabone === false){
              _this.alertTxt += "基本信息,"
            }
            if(_this.$store.state.tabStatus.subtabtwo === false){
              _this.alertTxt+="商品图片,"
            }
            if(_this.$store.state.tabStatus.subtabthree === false){
              _this.alertTxt+="属性信息,"
            }
            if(_this.$store.state.tabStatus.subtabfour === false){
              _this.alertTxt+="商品描述"
            }
            console.log(_this.alertTxt,'this.alertTxt')
            _this.$notification.error({
              message: '提醒',
              description: _this.alertTxt+"未保存成功",
            });
            _this.alertTxt = ''
            _this.submitAllVisibles = false
            _this.SubmitAllLoading = false
          }else{
            if(_this.$store.state.tabStatus.subtabone === 'error' || _this.$store.state.tabStatus.subtabtwo === 'error' || _this.$store.state.tabStatus.subtabthree === 'error' || _this.$store.state.tabStatus.subtabfour === 'error'){
              console.log('保存错误了')
              _this.SubmitAllLoading = false
              _this.submitAllVisibles = false
            }else{
              _this.monitoringSubmitAll()
            }
          }
          console.log(_this.saveNums)
        }
        _this.saveNums++
      },2000)

    },
    //公共取消
    commonSignOut(){
      console.log(this.$store.state.tabStatus.tabone,this.$store.state.tabStatus.tabtwo,this.$store.state.tabStatus.tabthree,this.$store.state.tabStatus.tabfour)
      this.cancelAllText=[]
      if(this.$store.state.tabStatus.tabone || this.$store.state.tabStatus.tabtwo || this.$store.state.tabStatus.tabthree || this.$store.state.tabStatus.tabfour){
        if(this.$store.state.tabStatus.tabone === true){
          this.cancelAllText.push('基本信息')
        }
        if(this.$store.state.tabStatus.tabtwo === true){
          this.cancelAllText.push('商品图片')
        }
        if(this.$store.state.tabStatus.tabthree === true){
          this.cancelAllText.push('属性信息')
        }
        if(this.$store.state.tabStatus.tabfour === true){
          this.cancelAllText.push('商品描述')
        }
        this.cancelVisibles = true
        console.log(this.cancelAllText,'cancelAllText')
      }else{
        console.log("全部保存了")
        if(Vue.ls.get("black")){
          this.$router.push({
            path:'/product/amazonManage',
            query:{
              isBlack:Vue.ls.get("black")
            }
          })
        }else{
          this.$router.push('/product/amazonManage')
        }
      }
    },
    submitAllCancel(){
      this.submitAllVisibles = false
    },
    // 退出
    cancelOk(){
      if(Vue.ls.get("black")){
        this.$router.push({
          path:'/product/amazonManage',
          query:{
            isBlack:Vue.ls.get("black")
          }
        })
      }else{
        this.$router.push('/product/amazonManage')
      }

    },
    cancelCancel(){
      this.cancelVisibles = false
    }
  },
  mounted(){
    this.$store.commit('set_goodsId','')
    this.$store.commit('set_Tabone',true)
    this.addNewProduct = Number(this.$route.query.type);
  },
  beforeDestroy(){
    this.$store.commit('set_Tabone',false)
    this.$store.commit('set_Tabtwo',false)
    this.$store.commit('set_Tabthree',false)
    this.$store.commit('set_Tabfour',false)
    this.$store.commit('set_subTabone',true)
    this.$store.commit('set_subTabtwo',true)
    this.$store.commit('set_subTabthree',true)
    this.$store.commit('set_subTabfour',true)
  }
};
</script>
<style lang="less" scoped>
.tar{text-align: right;}
</style>