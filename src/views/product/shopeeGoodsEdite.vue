<template>
  <div>
    <a-card>
     <div class='tar'>
       <a-button class='tar' type='primary' @click='submitAll'>一键保存</a-button>
     </div>
      <a-tabs defaultActiveKey="1" type="card" @change='callback'>
        <a-tab-pane tab="基本信息" key="1">
          <shopeeBasicInfo @shopeeCommonSignOut="shopeeCommonSignOut" ref='tabone'></shopeeBasicInfo>
        </a-tab-pane>
        <a-tab-pane tab="商品图片" :disabled='!this.$store.state.tabStatus.goodsId && addNewProduct == 1' key="2">
          <shopeeGoodsImg @shopeeCommonSignOut="shopeeCommonSignOut" ref='tabtwo'></shopeeGoodsImg>
        </a-tab-pane>
        <a-tab-pane tab="属性信息" :disabled='!this.$store.state.tabStatus.goodsId && addNewProduct == 1' key="3">
          <shopeeAttributeInfo @shopeeCommonSignOut="shopeeCommonSignOut" ref='tabthree'></shopeeAttributeInfo>
        </a-tab-pane>
        <a-tab-pane tab="商品描述" :disabled='!this.$store.state.tabStatus.goodsId && addNewProduct == 1' key="4">
          <shopeeGoodsInfo @shopeeCommonSignOut="shopeeCommonSignOut" ref='tabfour'></shopeeGoodsInfo>
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
  import shopeeBasicInfo from '@/views/product/components/shopeeBasicInfo.vue'
  import shopeeGoodsImg from '@/views/product/components/shopeeGoodsImg.vue'
  import goodsImg from '@/views/product/components/goodsImg.vue'
  import attributeInfo from '@/views/product/components/attributeInfo.vue'
  import shopeeAttributeInfo from '@/views/product/components/shopeeAttributeInfo.vue'
  import shopeeGoodsInfo from '@/views/product/components/shopeeGoodsInfo.vue'
  import goodsInfo from '@/views/product/components/goodsInfo.vue'
  export default {
    components:{
      shopeeBasicInfo,
      goodsImg,
      shopeeGoodsImg,
      attributeInfo,
      goodsInfo,
      shopeeGoodsInfo,
      shopeeAttributeInfo
    },
    data() {
      return {
        submitAllVisibles:false,
        cancelVisibles:false,
        keys:"",
        addNewProduct:"",
        cancelAllText:"",
        alertTxt:"",
        SubmitAllLoading:false
      };
    },
    methods: {
      callback(key) {
        key == 4 ? this.$store.commit('set_Tabfour',true) : ""
        key == 1 ? this.$store.commit('set_Tabone',true) : ""
        key == 2 ? this.$store.commit('set_Tabtwo',true) : ""
        key == 3 ? this.$store.commit('set_Tabthree',true) : ""
        key == 3 ? this.$store.commit('set_key', true) : ""
        // this.$store.commit('set_KeyNum', key)
      },
      //批量提交
      submitAll(){
        this.submitAllVisibles = true
      },
      cancelCancel(){
        this.submitAllVisibles = false
      },
      submitAllOk(){
        console.table(
          this.$store.state.tabStatus.tabone,
          this.$store.state.tabStatus.tabtwo,
          this.$store.state.tabStatus.tabthree, 
          this.$store.state.tabStatus.tabfour
        )
        this.$store.state.tabStatus.tabone === true ? (this.$refs.tabone.updateContent('forbid'),this.$store.commit('set_subTabone',false)):''
        this.$store.state.tabStatus.tabtwo === true ? (this.$refs.tabtwo.updateImgContent('forbid'),this.$store.commit('set_subTabtwo',false)):''
        this.$store.state.tabStatus.tabthree === true ? (this.$refs.tabthree.saveData('forbid'),this.$store.commit('set_subTabthree',false)):''
        this.$store.state.tabStatus.tabfour === true ? (this.$refs.tabfour.nextStep('forbid'),this.$store.commit('set_subTabfour',false)):''
        console.table(
          this.$store.state.tabStatus.tabone,
          this.$store.state.tabStatus.tabtwo,
          this.$store.state.tabStatus.tabthree, 
          this.$store.state.tabStatus.tabfour
        )

        this.monitoringSubmitAll()
      },
      monitoringSubmitAll(){
        console.log('lll')
        console.log(this.$store.state.tabStatus.subShopeeTabone,this.$store.state.tabStatus.subtabtwo,this.$store.state.tabStatus.subtabthree,this.$store.state.tabStatus.subtabfour)
        this.SubmitAllLoading = true
        let nums = 0
        setTimeout(()=>{
          if(this.$store.state.tabStatus.subShopeeTabone === true && this.$store.state.tabStatus.subtabtwo === true && this.$store.state.tabStatus.subtabthree === true && this.$store.state.tabStatus.subtabfour === true ){
            console.log(this.$store.state.tabStatus.subShopeeTabone,this.$store.state.tabStatus.subtabtwo,this.$store.state.tabStatus.subtabthree,this.$store.state.tabStatus.subtabfour)
            console.log('全部成功')
            this.$notification.success({
              message: '成功',
              description: '全部保存成功',
            }); 
          this.submitAllVisibles = false
          this.SubmitAllLoading = false
          if(Vue.ls.get("black")){
            this.$router.push({
              path:'/product/shopeeManage',
              query:{
                isBlack:Vue.ls.get("black")
              }
            })
          }else{
            this.$router.push('/product/shopeeManage')
          }
            nums++
          }else{
            console.log('未保存',nums)
            if(nums>5){
              console.log(this.$store.state.tabStatus.subShopeeTabone,this.$store.state.tabStatus.subtabtwo,this.$store.state.tabStatus.subtabthree,this.$store.state.tabStatus.subtabfour)
              this.alertTxt = ''
              if(this.$store.state.tabStatus.subShopeeTabone === false){
                this.alertTxt += "基本信息,"
              } 
              if(this.$store.state.tabStatus.subtabtwo === false){
                this.alertTxt+="商品图片,"
              } 
              if(this.$store.state.tabStatus.subtabthree === false){
                this.alertTxt+="属性信息,"
              }
              if(this.$store.state.tabStatus.subtabfour === false){
                this.alertTxt+="商品描述"
              }
              console.log(this.alertTxt,'this.alertTxt')
                this.$notification.error({
                message: '提醒',
                description: this.alertTxt+"未保存成功",
              }); 
              this.alertTxt = ''
              this.submitAllVisibles = false
              this.SubmitAllLoading = false
            }else{
              
              if(this.$store.state.tabStatus.subShopeeTabone === 'error' || this.$store.state.tabStatus.subtabtwo === 'error' || this.$store.state.tabStatus.subtabthree === 'error' || this.$store.state.tabStatus.subtabfour === 'error'){
                console.log('保存错误了')
                this.SubmitAllLoading = false
                this.submitAllVisibles = false
              }else{
                this.monitoringSubmitAll()
              }
            }
            console.log(nums)

          }
        },2000)

      },
      //公共取消
      shopeeCommonSignOut(){
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
              path:'/product/shopeeManage',
              query:{
                isBlack:Vue.ls.get("black")
              }
            })
          }else{
            this.$router.push('/product/shopeeManage')
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
            path:'product/shopeeManage',
            query:{
              isBlack:Vue.ls.get("black")
            }
          })
        }else{
          this.$router.push('/product/shopeeManage')
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


