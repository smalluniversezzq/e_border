<template>
  <div>
    <!-- {{countryCodeList}}
    <br>
    {{jurisdictionTitle}} -->
    <a-form :form="form" style="max-width: 900px; margin: 40px auto 0;">
      <a-row>
        <a-col :span='10' style='padding-right:5px'>
          <a-card 
          title='选择角色'>
            <a-row>
              <a-col class='mt'>
                <a-form-item>
                  <a-select
                    width='120px'
                    placeholder="请选择角色套餐"
                    @change='ruleschange'
                    v-model="rulesValue">
                    <a-select-option v-for='(item,index) in rulesData' :value='item.id' :key="index">{{item.title}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span='14' style='padding-left:5px'>
          <a-card title='分配店铺'>
            <a-row>
              <a-col :span="10">
                <a-button class="platform_icon">
                  <img
                    style="width:90px; margin-left:-5px;margin-top:-5px"
                    :src="platformIcon1"
                    alt=""/>
                </a-button>
              </a-col>
              <a-col :span="14">
                <a-row v-for='(item,index) in country_list_a' :key='index'>
                  <a-col style="float:left">
                    <a-button 
                      type='dashed' 
                      class='mrb-sm'>
                      {{item.title}}
                    </a-button>
                  </a-col>
                  <a-col style="float:left">
                    <a-select
                      allowClear
                      mode="multiple"
                      style="width:162px"
                      :maxTagCount="1"
                      @change="addCountry($event,item.auth_id)"
                      :default-value="jurisdictionTitle[index][item.title]"
                      placeholder='请选择国家'>
                      <a-select-option v-for='(itm,idex) in item.country' :value='itm.code' :key='idex'>
                        {{itm.title}}
                      </a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-row style="margin-top:10px">
              <a-col :span="10">
                <a-button class="platform_icon">
                  <img
                    style="width:90px; margin-left:-5px;margin-top:-5px"
                    :src="platformIcon2"
                    alt=""/>
                </a-button>
              </a-col>
              <a-col :span="14">
                <span v-for='(item,index) in country_list_s' :key='index' >
                  <a-button 
                    v-if='shopee_site_list.indexOf(item.title) >= 0'
                    :type='(shopeeCodeList.indexOf(item.title) >= 0) ? "primary":"dashed"' 
                    class='mrb-sm'  
                    @click='addShopee(item.title,item.id)'>
                    {{item.title}}
                  </a-button>
                  <a-button 
                    v-if='shopee_site_list.indexOf(item.title) < 0'
                    :disabled='item.selected == "2"'
                    :type='(shopeeCodeList.indexOf(item.title) >= 0) ? "primary":"dashed"' 
                    class='mrb-sm'  
                    @click='addShopee(item.title,item.id)'>
                    {{item.title}}
                  </a-button>
                </span>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
      <a-form-item :wrapperCol="{span: 19, offset: 5}" class='mt'>
        <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
        <a-button class='ml' @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getRulest,batchUpdateRule, getStoreList, editAuthStaff } from '@/api/mermanage'
import {  countryList } from '@/api/empower'
import {Europe } from '@/views/order/public/country'
export default {
  name: 'Step3',
  props:['checkAll','countryPermission','portId','shopee_site','group_id'],
  data () {
    return {
      Europe,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      timer: 0,
      countryCodeList:[],
      counList:[],
      suncountry:"",
      rulesData:"",
      rulesValue:"",
      country_permission:"",
      country_list_a:[],
      country_list_s:[],
      platformIcon1:require("@/assets/image/platformIcon1.png"),
      platformIcon2:require("@/assets/image/platformIcon2.png"),
      shopeeCodeList:[],
      shopeeList:[],
      shopeeId:[],
      shopeeIdList:[],
      shopee_site_list:[],
      jurisdictionTitle:[],
    }
  },
  methods: {
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          if(that.rulesValue){
            that.submit()
          }else{
            that.loading = false 
            that.$notification.error({
              message: '错误',
              description: '角色套餐不能为空',
            });
          }
        } else {
          that.loading = false
        }
      })
    },
    submit(){
      let that = this
      let country = []
      that.countryCodeList.forEach((item,index)=>{
        let obj = {
          "auth_id": "",
          "country": ""
        }
        Object.keys(item).forEach((itm,idx)=>{
          obj.country = item[itm].toString()
          that.country_list_a.forEach((im,ix)=>{
            if(im.auth_id==itm){
              obj.auth_id = im.auth_id
            }
          })
        })
        country.push(obj)
      })
      editAuthStaff({
        uid:that.checkAll,
        auth_infos: country,
        rule_id:that.rulesValue,
        shopee:that.shopeeIdList.toString()
      }).then((res)=>{
        if(res.code === 0){
        that.timer = setTimeout(function () {
        that.loading = false
          that.$emit('cancel')
          }, 1500)
          that.$notification.success({
            message: '成功',
            description: res.msg
          })  
        }else{
          that.loading = false
          that.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    },
    addCountry(value,title){
      console.log(value,title,this.countryCodeList,"countryCodeList")
      this.countryCodeList.forEach((item,index)=>{
        Object.keys(item).forEach((itm,idx)=>{
          console.log(item,title,"123",itm)
          if(itm == title){
            item[itm] = value
          }
        })
      })
      console.log(this.countryCodeList,"countryCodeList")
    },
    addShopee(shopeeCode,id){
      if(this.shopeeCodeList.indexOf(shopeeCode) < 0){
        this.shopeeCodeList.push(shopeeCode);

        this.shopeeIdList.push(id);
      }else{
        this.shopeeCodeList.splice(this.shopeeCodeList.indexOf(shopeeCode),1)

        this.shopeeIdList.splice(this.shopeeIdList.indexOf(id),1)
      }
    },
    removal(array){
        var res = [];
        for (var i = 0, len = array.length; i < len; i++) {
          var current = array[i];
          if (res.indexOf(current) === -1) {
              res.push(current)
          }
        }
        return res;
      },
    cancel(){
      this.$emit('cancel')
      //  取消点亮效果
      this.countryCodeList = []
      // console.log('退出执行')
    },

    // 获取代理商角色列表
    getRulests(){
      getRulest({
      }).then((res)=>{
        if(res.code === 0){
          this.rulesData = res.data
          // console.log(res.data,'data')
        }
      })
    },
    ruleschange(value){
      // console.log(value,'value')
      this.rulesValue = value
    },
    // 获取数据权限
    countryLists(){
      getStoreList({
        // port_id:this.portId,
        uid:this.checkAll
      }).then((res)=>{
        if(res.code === 0){
          if(JSON.stringify(res.data)!=="{}"){
            this.country_list_a = []
            this.country_list_s = []
            // Object.keys(res.data.amazon).forEach((item,index,value)=>{
            //   res.data.amazon[item].forEach((item,index)=>{
            //     this.country_list_a.push(item)
            //   })
            // })
            res.data.amazon.forEach((item,index)=>{
              this.country_list_a.push(item)
            })

            if(this.countryPermission){
              let countryData = this.deepCopy(this.countryPermission)
              res.data.amazon.forEach((item,index)=>{
                let obj = {}
                let titleObj = {}
                obj[item.auth_id] = []
                titleObj[item.title] = []
                countryData.forEach((itm,idex)=>{
                  if(item.auth_id == itm.store_id){
                    obj[item.auth_id] = itm.country
                    titleObj[item.title] = itm.country
                  }
                })
                this.countryCodeList.push(obj)
                this.jurisdictionTitle.push(titleObj)
              })
            }else{
              res.data.amazon.forEach((item,index)=>{
                let obj = {}
                let titleObj = {}
                obj[item.auth_id] = []
                titleObj[item.title] = []
                this.countryCodeList.push(obj)
                this.jurisdictionTitle.push(titleObj)
              })
            }
            console.log(this.countryCodeList,"jurisdictionTitle",this.jurisdictionTitle)
            // 虾皮的逻辑需要改
            res.data.shopee.forEach((item,index)=>{
              this.country_list_s.push(item)
            })
            //对比 title会出错 ,  改为对比id
            if(this.shopee_site){
              this.shopee_site.forEach((item, index) => {
                this.shopee_site_list.push(item)
                this.shopeeCodeList.push(item)
                this.country_list_s.forEach((itm, idx) => {
                  if(item==itm.title){
                    this.shopeeIdList.push(itm.id)
                  }
                })
              })
            }
          }
        }
      })
    },
    deepCopy(obj){
      let str, newobj = obj.constructor === Array ? [] : {};
      if(typeof obj !== 'object'){
        return;
      } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
      } else {
        for(var i in obj){
          newobj[i] = typeof obj[i] === 'object' ? 
          cloneObj(obj[i]) : obj[i]; 
        }
      }
      return newobj;
    },
  },
  mounted(){
    // console.log('分配权限')
    this.getRulests()
    if(this.group_id!=='0'){
      this.rulesValue = this.group_id
    }else{
      this.rulesValue = ''
    }
    this.countryLists()
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>
<style lang="less">
.mrb-sm{
  margin-right: 5px;
  margin-bottom: 5px;
}
.platform_icon{
  width:140px;
  overflow:hidden;
  height:49px;
  position:relative
}
</style>
