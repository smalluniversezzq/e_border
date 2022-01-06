<template>
  <div class='basicinfo'>
    <div v-if='this.$store.state.tabStatus.classLoading' class="spin-box" >
      <a-spin class='spin'/>
    </div>
    <a-form :form="form"  :selfUpdate="true">
      <a-card :loading="cardLoading">
        <a-form-item 
          label="商品来源："
          :labelCol="{ md: {span:3}, lg: {span: 3}, xl: {span: 3} ,xxl:{span: 3} } "
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} } "
          >
         <a-input v-model="addNewUrl" 
         v-decorator="[
         'ori_url', 
         { initialValue: data.ori_url ,rules: [{ required: true, message: '商品来源不能为空' }] }]" :disabled="editState"
          :style="{ display: 'inline-block', width: 'calc(68% - 12px)' }"/>
          <a-button type="primary" @click="jumpto(data.ori_url)" style="margin-left:10px">查看</a-button>
        </a-form-item>
        <!-- {{siteValue}} -->
        <a-form-item 
          label="站点名称："
          :labelCol="{ md: {span:3}, lg: {span: 3}, xl: {span: 3} ,xxl:{span: 3} } "
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} } "
          >
           <!-- v-model='siteValue' -->
           <a-select 
            @change="siteChange"
            v-decorator="[
            'station',
             { initialValue: data.category.station ,rules: [{ required: true, message: '站点不能为空' }]},
            ]"
           placeholder='请选择站点' style="width: 250px" >
            <a-select-option value="MY" >马来西亚</a-select-option>
            <!-- <a-select-option value="SG" >新加坡</a-select-option> -->
          </a-select>
          <!-- <a-select 
           v-model='siteValue'
            @change="siteChange"
            v-decorator="[
            'station',
             { initialValue: data.station ,rules: [{ required: true, message: '站点不能为空' }]},
            ]"
           placeholder='请选择站点' style="width: 250px" >
            <a-select-option :value="item.code" v-for='(item,index) in siteList' :key='index'>{{item.title}}{{item.code}}</a-select-option>
          </a-select> -->
        </a-form-item>
        <a-form-item 
          label="产品分类："
          :labelCol="{ md: {span:3}, lg: {span: 3}, xl: {span: 3} ,xxl:{span: 3} } "
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} } "
          >
          <shopeeClass  
            v-decorator="[
            'shopeeclass',
            { rules: [{ required: true, message: '产品分类不能为空' }] },
            ]"
             @getAttributeList="getAttributeList" ref='shopeeClassRef'></shopeeClass>
        </a-form-item>
        <a-form-item 
          label="产品属性："
          :labelCol="{ md: {span:3}, lg: {span: 3}, xl: {span: 3} ,xxl:{span: 3} } "
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} } "
          >
          <!-- {{JSON.stringify(attributesList)}} -->
          <div  v-if='JSON.stringify(attributesList)!=="{}"' >
            <div :class='attributesList[siteValue].length>0?"product-attribute-box":"product-attribute-box-none"'>
              <div v-for='(item,index) in attributesList[siteValue]' :key='index' >
                <div v-if='item.input_type==="COMBO_BOX" '>
                  <div v-if='item.is_mandatory' class='flex-state'>
                    <!-- 必选select -->
                    <div >
                      <span class='item-require'>*</span>
                      <!-- {{'属性'+ (index+1) +':'}} -->
                    <span class='attribute-txt'>{{item.attribute_name}}</span>
                    <span>{{"("+item.attribute_name_cn+")"}}</span>
                    </div>
                    <a-select
                    :class='checkAttributeWarning[index]?"attribute-warning":""'
                    style='width:250px'
                    allowClear='true'
                      v-model="attribute[index]"
                      placeholder="请输入属性值"
                      @change='updataChange'
                    >
                      <a-select-option v-for='(it,inx) in item.options' :value="it" :key='inx'>
                        {{it}}
                      </a-select-option>
                    </a-select>
                  </div>
                  <div v-else class='flex-state'>
                    <!-- 非必选select -->
                    <div >
                      <!-- {{'属性'+ (index+1) +':'}} -->
                    <span class='attribute-txt'>{{item.attribute_name}}</span>
                    <span>{{"("+item.attribute_name_cn+")"}}</span>
                    </div>
                    <a-select
                      v-model="attribute[index]"
                      allowClear='true'
                      style='width:250px'
                      placeholder="请输入属性值"
                    >
                      <a-select-option v-for='(it,inx) in item.options' :value="it" :key='inx'>
                        {{it}}
                      </a-select-option>
                    </a-select>
                    
                  </div>
                </div>
                <div v-else-if='item.input_type==="DROP_DOWN"'>
                  <div v-if='item.is_mandatory' class='flex-state'>
                    <!-- 必选项 drop_down -->
                    <div >
                      <span class='item-require'>*</span>
                      <!-- {{'属性'+ (index+1) +':'}} -->
                        <span class='attribute-txt'>{{item.attribute_name}}</span>
                    <span>{{"("+item.attribute_name_cn+")"}}</span>
                    </div>
                    <a-select
                      v-model="attribute[index]"
                      allowClear='true'
                      style='width:250px'
                      placeholder="请输入属性值"
                    >
                      <a-select-option v-for='(it,inx) in item.options' :value="it" :key='inx'>
                        {{it}}
                      </a-select-option>
                    </a-select>
                  </div>
                  <div v-else class='flex-state'>
                    <!-- 非必传项drop_down -->
                    <div class='attr-box'>
                      <!-- {{'属性'+ (index+1) +':'}} -->
                      <span class='attribute-txt'>{{item.attribute_name}}</span>
                    <span>{{"("+item.attribute_name_cn+")"}}</span>
                    </div>
                    <a-select
                    v-model="attribute[index]"
                    allowClear='true'
                    style='width:250px'
                      placeholder="请输入属性值"
                    >
                    <a-select-option v-for='(it,inx) in item.options' :value="it" :key='inx'>
                      {{it}}
                    </a-select-option>
                    </a-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
     
        </a-form-item>
        <a-form-item :wrapperCol="{md: {span: 20, offset: 0}, lg: {span: 20, offset: 1}, xl: {span: 20, offset: 1}, xxl: {span: 20, offset: 2}}">
          <a-button class='ml' style='margin-left:72px; width:100px;' @click='cancel()'>取消</a-button>
          <a-button type="primary" style='margin-left:30px; width:100px;' :loading='subloading' @click="updateContent">保存</a-button>
        </a-form-item>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import Vue from 'vue'
import {  shopeeUpdateBase ,shopeeGetBase} from '@/api/collect'
import { currencyList, Europe } from '@/views/order/public/country'
import shopeeClass from './shopeeClass.vue'
import axios from 'axios'
  export default {
    name:"",
    props:[],
    components:{
      shopeeClass
    },
    data(){
      return{
        form: this.$form.createForm(this),
        addNewUrl:'',
        data:{
          category:[],
          ori_url:"",
        },
        editState:true,
        cardLoading:false,
        addNewProduct:'',
        currencyList,
        countryAll:[],
        Europe,
        subloading:false,
        shopeeClassList:"",
        siteValue:'MY',
        selectList:{
          MY:[],
          SG:[],
        },
        attributesList:{
          MY:"",
          SG:"",
        },
        attribute:[],
        subAttribute:{},
        classValue:"",
        //验证
        checkAttribute:{},
        checkAttributeWarning:{},
        checkWarning:true,
        goodsId:"",
        subloading:false,
        siteList:[
          {"title": "马来西亚", "code": "MY" },
          // {"title": "新加坡", "code": "SG" },
        ]
      }
    },
    methods: {
      siteChange(value){
        console.log('111')
        this.siteValue = value
        this.$refs.shopeeClassRef.siteValue = []
        this.siteList.forEach((item,index)=>{
          if(item.code === this.siteValue){
            this.$refs.shopeeClassRef.siteValue.push(item)
          }
        })
        console.log(this.$refs.shopeeClassRef.siteValue,'site')
       this.$refs.shopeeClassRef.initValue=value
       this.$refs.shopeeClassRef.initClassList('0',value)
      },
      jumpto(val){
        console.log(val)
        if(val) {
          window.open(val, "_blank");
        }else if( val == null ) {
          window.open(this.addNewUrl, "_blank")
        }else {
          this.$notification.error({
            message: '提醒',
            description: '跳转失败',
          });
        }
      },
      // http://service.ekuajing.cn/api/shopee/getCategories?category_id=16
      // 请求产品属性
      getAttributeList(code,country){
        console.log(code,'code','country',country)
        this.attribute = {}
        this.classValue = code
        this.checkAttributeWarning = {}
        this.checkAttribute = {}
        if(code){
          this.form.setFieldsValue({
          'shopeeclass':this.classValue
          });
        }else{
          this.form.setFieldsValue({
          'shopeeclass':''
          });
        }
        this.getAttributeFn(code,country).then(res=>{
          if(res !== 'error'){
            this.subAttribute = []
            // this.attributesList[country] = res
            this.$set(this.attributesList,country,res)
            console.log(this.attributesList,'attributesList')
            console.log(this.attribute)
            // 判断校验
            this.attributesList[country].forEach((item,index)=>{
              console.log(item.is_mandatory)
              this.checkAttribute[index]=item.is_mandatory
              this.subAttribute[index] = {
                name:"",
                attribute_id:""
              }
            })
            console.log(this.checkAttribute,'check',this.subAttribute)
          }
        })
      },
      getAttributeFn(val,country){
        return axios({
          method:'get',
          url:'http://service.ekuajing.cn/api/shopee/getAttribute?country='+country+'&category_id='+val,
        }).then(res=>{
          if(res.data.code === 0){
            return res.data.data
          }else{
            return 'error'
          }
        })
        
      },
      // 反查接口
      getCategoryReverseFn(val){
        return axios({
          method:'get',
          url:'http://service.ekuajing.cn/api/shopee/getCategoryReverse?category_id='+val,
        }).then(res=>{
          if(res.data.code === 0){
            return res.data
          }else{
            return 'error'
          }
        })
      },
      shopeeClassChange(val){
        console.log(val,'val')
      },
      updataChange(val){
        console.log(val,'val')
        console.log(this.attribute)
        this.checkAttributeWarningFn()
      },
      // 保存
      updateContent(type){ 
        let _this = this;
        _this.subloading = true
        const { form: { validateFields } } = this
        console.log('一键保存，11')
        validateFields((err, values) => {
          if (!err) {
            _this.checkWarning = true
            console.log(_this.subAttribute,'subAttribute')
            _this.checkAttributeWarningFn()
            console.log(_this.checkAttributeWarning)
            if(_this.checkWarning){
              console.log('允许保存')
              console.log("_this.subAttribute",_this.subAttribute,"values",values,'_this.classValue',_this.classValue)
              let updataBasicInfo={
                id:this.goodsId,
                category:{
                  ori_url:values.ori_url,
                  station:values.station,
                  browse_node_id:_this.classValue,
                  all_attribute:_this.subAttribute,
                }
              }
              console.log(updataBasicInfo,'updataBasicInfo')
              this.shopeeUpdateBaseFn(updataBasicInfo,type)
            }else{
              // 新加坡不做校验
              if(values.station ==='SG'){
                let updataBasicInfo={
                  id:this.goodsId,
                  category:{
                    ori_url:values.ori_url,
                    station:values.station,
                    browse_node_id:_this.classValue,
                    all_attribute:_this.subAttribute,
                  }
                }
                this.shopeeUpdateBaseFn(updataBasicInfo,type)
              }else{
                console.log('不允许保存')
                console.log(_this.subAttribute,values.station,_this.classValue)
                _this.$store.commit('set_subShopeeTabone','error')
                _this.subloading = false
                _this.$notification.error({
                  message: '提醒',
                  description: '属性值未填写',
                  });
                }
            }
          }else{
            _this.$store.commit('set_subShopeeTabone','error')
            console.log('不允许保存站点名称未填写')
            console.log(_this.$store.state.tabStatus.subShopeeTabone)
            _this.$notification.error({
            message: '提醒',
            description: '属性值未填写',
            }); 
            _this.subloading = false
          }
        })
      },
      //产品保存
      shopeeUpdateBaseFn(info,type){
        shopeeUpdateBase(info).then(res=>{
          if(res.code === 0 ){
          this.subloading = false
          this.goodsId = res.data.id; 
          this.$store.commit('set_goodsId',res.data.id)
          this.$store.commit('set_subShopeeTabone',true)
          if(type === 'forbid'){
            }else{
            this.$notification.success({
              message: '提醒',
              description: res.msg,
            });
          }
          }else{
            this.subloading = false
            this.$store.commit('set_subShopeeTabone',false)
            if(type === 'forbid'){
              }else{
                this.$notification.error({
                  message: '失败',
                  description: res.msg,
                });
              }
            this.$notification.error({
              message: '提醒',
              description: res.msg,
            });
          }
        })
      },
      //产品属性验证
      checkAttributeWarningFn(){
        console.log(this.subAttribute,'subAttribute',this.attribute,'attribute','this.attributesList',this.attributesList)
          this.subAttribute.forEach((item,index)=>{
            if(this.attribute[index]){
               item.name = this.attribute[index]
            }else{
              item.name=''
            }
            this.subAttribute[index].attribute_id = this.attributesList[this.siteValue][index].attribute_id
          })
          console.log(this.subAttribute,'this.subAttribute',this.attribute,"attributesList",this.attributesList)
          Object.keys(this.checkAttribute).forEach((item,index,key)=>{
          if(this.checkAttribute[item]){
            console.log(1)
            if(this.subAttribute[item].name){
              this.checkAttributeWarning[item]=false
            }else{
              this.checkAttributeWarning[item]=true
              this.checkWarning = false
            }
          }else{
            console.log(2)
            this.checkAttributeWarning[item]=false
          }
        })        
      },
      //分类相关
      onSelectChange(value,selectedOptions,code) {
        console.log(value)
        console.log(selectedOptions)
        this.selectedOptions[code] = selectedOptions
        this.selectDefaultData[code] = value;
      }, 
      // 获取基本信息和图片地址
      shopeeGetBaseFn(){
        shopeeGetBase({
          id:this.goodsId
        }).then(res=>{
          if(res.code === 0){
            this.data.category = Array.isArray(res.data.category)?"":res.data.category
            this.data.ori_url =res.data.ori_url
            this.country = res.data.category.station
            this.siteValue = res.data.category.station
            // this.$set(this.attributesList,res.data.category.station,res.data.category.all_attribute)
            this.classValue = res.data.category.browse_node_id
            this.form.setFieldsValue({
            'shopeeclass':this.classValue
            });
            console.log('反查开始')
            //  判断是否更新过，更新过去反查
            if(Array.isArray(this.data.category)){
              // 没有更新过
            }else{
              // 更新过
              this.$refs.shopeeClassRef.Reverse(this.classValue,this.country)
            // this.$refs.shopeeClassRef.Reverse(this.classValue)
              this.getAttributeFn(this.classValue,this.siteValue).then(res=>{
                if(res !== 'error'){
                  // this.attributesList[country] = res
                  this.$set(this.attributesList,this.country,res)
                  console.log(this.attributesList,'attributesList')
                  console.log(this.attribute)
                  // 判断校验
                  console.log(this.attributesList,'123',this.siteValue)
                  console.log(this.attributesList[this.siteValue])
                  this.subAttribute = []
                  this.attributesList[this.siteValue].forEach((item,index)=>{
                    console.log(item.is_mandatory)
                    this.checkAttribute[index]=item.is_mandatory
                    this.subAttribute[index] = {
                      name:"",
                      attribute_id:""
                    }
                  })
                  console.log(this.checkAttribute,'check')
                }
              })
            }
            
            if(!Array.isArray(res.data.category)){
              console.log('asd')
              res.data.category.all_attribute.forEach((item,index)=>{
              this.attribute[index]=item.name
              })
            }
        
            // 反查
            // this.$refs.tabone.updateContent('forbid')
            // this.attributesList.MY = res.data.category.all_attribute
          }
        })
      },
      cancel() {
        this.$emit('shopeeCommonSignOut');
      },
    },
    created(){
    },
    mounted(){
      console.log(this.shopeeClassList,'shopeeClassList')
      this.$store.commit('set_Tabone',true)
      this.goodsId = this.$route.query.id;
      //是否是新增的逻辑
      this.site = this.$route.query.site;
      this.addNewProduct = Number(this.$route.query.type);
      if(this.addNewProduct === 1) {
        this.editState = false
      }else {
        // this.getBaseInfo();
        this.editState = true
      }
      if(Vue.ls.get('CHROME_ID')){
        this.chromeCode = Vue.ls.get('CHROME_ID')
      }else{
        this.chromeCode  = this.GLOBAL.chrome.id
      }
      this.shopeeGetBaseFn()
    },
  }
</script>
<style lang="less" scoped>
  .dis-flex{
    display: flex;
    flex-wrap: wrap;
  }
  .item-require{
    display: inline-block;
    margin-right: 4px;
    font-family: SimSun;
    line-height: 1;
    font-size: 14px;
    color: #f5222d;
  }
  .lt{float:left}
  .flex-state{
    display: flex;
    justify-content: start;
    div{
      width:250px ;
      text-align: right;
      margin-right: 10px;
    }
  }
  .attribute-warning{
    div{
      border-color: #f5222d;
    }
  }
  .attributer-txt{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .product-attribute-box{
    background:#f0f2f5;
    border: 1px solid #e8e8e8;
    padding-top: 10px;
  }
  .product-attribute-box-none{
     padding-top: 0px;
    background:#f0f2f5;
    border: none;
  }
  .pt{
    padding-top: 10px;
  }
</style>
<style>
  .attribute-warning > div {
    border-color: #f5222d;
  }
  .attribute-warning > div:hover{
    border-color: #f5222d; 
  }
  .attribute-warning >svg{
    background: #f5222d;
  }
</style>
