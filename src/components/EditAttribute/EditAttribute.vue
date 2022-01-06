<template>
  <div class='editAttribute'>
    <!-- {{datall}} -->
    <!-- <br/> -->
    <!-- {{languageCode}} -->
    <!-- {{ColAttribute}} -->
    <!-- {{RowAttribute}} -->
    <a-from :from='form' layout="vertical" hideRequiredMark>
      <div class='mb'>
        <a-checkbox v-model='isClass' @change="onCheckChange">启用变体属性</a-checkbox>
        <span>{{isClass?"（如需单品商品，请取消勾选）":"（如需变体商品，请点击勾选）"}}</span>
      </div>
      <div v-show='isClass'>
        <a-button :disabled='RowAttribute.length>1' @click='addRowAttribute()' >
          添加属性
        </a-button>
        <a-select class='ml' v-model='defaultSlate' @change='SlateChange' style="width: 150px"  >
          <a-select-option  value="1" v-if='GLOBAL.translateType==1'>谷歌（收费） </a-select-option>
          <a-select-option  value="3" >谷歌（免费） </a-select-option>
          <a-select-option  value="4" >谷歌插件（免费） </a-select-option>
        </a-select>
        <span class='ml'> 查看语言：</span>
        <a-select
          v-model='transLanguage'
          @change="transLanguageChange"
          style="width: 150px"  >
          <a-select-option  :value="index" v-for="(item,index) in languageCode" :key='index'>{{item}}</a-select-option>
        </a-select>
        <span class='ml'>翻译到：</span>
        <a-select
          :default-value="['en']"
          allowClear
          maxTagCount = 1
          mode="tags"
          @change='handleChangeLanguage()'
          style="width: 150px"
          v-model='transLanguageAll'
        >
          <a-select-option  value="all">全部</a-select-option>
          <a-select-option   v-if='selectedCountryAll === false' :value="index" v-for="(item,index) in languageCode" :key='index'>{{item}}</a-select-option>
        </a-select>
        <a-button class='ml' :loading='translateLoading' @click='translate()'>
          翻译属性值
        </a-button>
        <a-card class='mt'>
          <a-form-item
            label="属性名"
            :labelCol="{ md: {span:2}, lg: {span: 2}, xl: {span: 2} ,xxl:{span: 2} }"
            :wrapperCol="{ md: {span:20}, lg: {span: 20}, xl: {span: 20} ,xxl:{span: 20} }"
          >
            <a-row>
              <a-col span='6' class='mr' v-for='(item,index) in RowAttribute' :key='index'>
                <a-select
                  style="width:180px"
                  placeholder='请选择属性名'
                  v-model='datall.datarow[index].name'
                >
                  <a-select-option v-if='index === 0' value='color'>{{'color'}}</a-select-option >
                  <a-select-option v-if='index === 0' value='size'>{{'size'}}</a-select-option >
                  <a-select-option v-if='index === 1' :disabled='datall.datarow[0].name === "color"' value='color'>{{'color'}}</a-select-option >
                  <a-select-option v-if='index === 1' :disabled='datall.datarow[0].name === "size"' value='size'>{{'size'}}</a-select-option >
                </a-select>
              </a-col>
              <a-col v-if='RowAttribute.length !== 0'>
                <a-button @click='delRowAttribute()' :disabled='RowAttribute.length ===1'>删除属性</a-button>
              </a-col>
              <a-col style='color:#999 ;width:180px'  v-if='(datall.datarow[0])&& (datall.datarow[1])&&(datall.datarow[0].name === datall.datarow[1].name)'>
                <a-alert message="属性名不能相同" type="warning" showIcon />
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
            label="属性值"
            :labelCol="{ md: {span:2}, lg: {span: 2}, xl: {span: 2} ,xxl:{span: 2} }"
            :wrapperCol="{ md: {span:20}, lg: {span: 20}, xl: {span: 20} ,xxl:{span: 20} }"
          >
            <a-row v-for='(item,index) in ColAttribute' :key='index'>
              <a-col span='6' class='mr'  v-for='(items,indexs) in RowAttribute' :key='indexs' >
                <a-input
                  v-model = 'datall.datacol[index].variant[indexs][transLanguage].value'
                  placeholder='请输入属性值'
                  :style="{ display: 'inline-block', width: 'calc(100% )' }"></a-input>
              </a-col>
              <a-col >
                <!-- :disabled='ColAttribute.length <= 1' -->
                <a-button @click='delColattribute(index,item)'  icon="minus"> </a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <div class='tac mb'>
            <a-button style='width:250px' class='tac' @click='addColattribute' icon="plus">
            </a-button>
          </div>
        </a-card>
      </div>
    </a-from>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        }"
    >
      <a-button :style="{marginRight: '8px'}" @click="editingAllCancel">退出</a-button>
      <a-button @click="nextStep" type="primary">提交</a-button>
    </div>
    <a-modal
      title="确认翻译"
      :visible="transshow"
      @ok="transOk"
      @cancel="transCancel"
    >
      <p>{{'翻译'+transNumber+"个字符，需要花费"+transMoney+"元，确认翻译吗"}}</p>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import {languageCode, language} from '@/views/order/public/country'
import { getSkuData, skuGetAttributes, trans , trans_fee } from '@/api/collect'
export default{
  props:[
    'datall',
    'ColAttribute',
    'RowAttribute',
    'isClass'
  ],
  data(){
    return {
      // 翻译
      defaultSlate:'3',
      languageCode,
      form: this.$form.createForm(this),
      // ColAttribute:[],
      // RowAttribute:[],
      datall:{
        datacol:"",
        datarow:"",
      },
      backupData:{
        datacol:"",
        datarow:"",
        ColAttribute:'',
        RowAttribute:'',
      },
      chromeCode:this.GLOBAL.chrome.id,
      translateLoading:false,
      transMoney:"",
      transNumber:"",
      attributeOne:"",
      attributeTow:"",
      attributeOnes:"",
      attributeTows:"",
      transshow:false,
      transLanguage:"zh",
      transLanguageAll:['en'],
      selectedCountryAll:false,
      selectedCountry:"",
      timer:null,
      transSuccess:false,
      tranInfo:[],
      attributeOneStr:"",
      attributeOneStrs:"",
      attributeTowStrs:"",
    }
  },
  methods:{
    // 启用变体属性
    onCheckChange(e){
      // console.log(e.target.checked)
      this.isClass = e.target.checked
      console.log(this.datall.datacol,'ovee',this.datall.datarow,'ColAttribute:',this.ColAttribute,'RowAttribute',this.RowAttribute)
      let col = this.datall.datacol[0]
      let row = this.datall.datacol[0]
      console.log(col,'col')
      if(this.isClass === false){
        console.log('切换单品属性',col)
        this.backupData.datacol = this.deepCopy(this.datall.datacol)
        this.backupData.datarow = this.deepCopy(this.datall.datarow)
        this.backupData.ColAttribute = this.deepCopy(this.ColAttribute)
        this.backupData.RowAttribute = this.deepCopy(this.RowAttribute)
        col.variant = col.variant.splice(0,1)
        col.variant[0].value = ''
        console.log(col,this.datall,'over')
        this.datall.datacol = []
        this.datall.datarow = []
        this.datall.datacol.push(col)
        this.datall.datarow.push(row)
        this.ColAttribute = [0]
        this.RowAttribute = [0]
        console.log(this.datall,'llllllllll')
      }else{
        console.log('切换变体属性')
        console.log(this.backupData)
        if(this.backupData.datacol){
          console.log('执行了')
          this.ColAttribute = this.deepCopy(this.backupData.ColAttribute)
          this.RowAttribute = this.deepCopy(this.backupData.RowAttribute)
          this.datall.datacol = this.deepCopy(this.backupData.datacol)
          this.datall.datarow = this.deepCopy(this.backupData.datarow)
        }else{
          console.log('--1')
        }
      }
    },
    addRowAttribute(){
      // console.log(this.datall,'datall',this.datall.datarow[0].name)
      // console.log(this.datall.datarow.length,'length')
      if(this.datall.datarow.length>0){
        if(this.datall.datarow[0].name === 'color'){
          // console.log('size111')
          this.rows = {
            name: "size",
            prid: "0"
          }
        }else{
          // console.log('color111')
          this.rows = {
            name: "color",
            prid: "0"
          }
        }
      }else{
        this.rows = {
          name: "color",
          prid: "0"
        }
      }
      // console.log(this.datall.datarow)
      this.datall.datarow.push(this.rows)
      this.initdatall("row")
    },
    delRowAttribute(){
      // console.log(this.RowAttribute.length,'ovee')
      this.datall.datarow.splice(this.RowAttribute.length-1,1)
      this.initdatall('del')
    },
    delColattribute(inx,item){
      // console.log(this.ColAttribute,'index:',inx,'item:',item)
      this.datall.datacol.splice(inx,1)
      this.initdatall()
    },
    initdatall(state){
      this.RowAttribute = []
      Object.keys(this.datall.datarow).forEach((item,index)=>{
        console.log(item,index,'2')
        this.RowAttribute.push(index)
      })
      console.log(this.RowAttribute,this.ColAttribute,'RowAttribute')
      this.ColAttribute = []
      console.log(1111)
      Object.keys(this.datall.datacol).forEach((item,index)=>{
        console.log(this.ColAttribute)
        this.ColAttribute.push(index)
        console.log(this.ColAttribute)

        if(state === 'row'){
          console.log('row')
          let rowName = this.datall.datarow[this.datall.datarow.length-1].name
          let rowprid = this.datall.datarow[this.datall.datarow.length-1].prid
          let row = {
            // name: "",
            // prid: "0",
            // sid: "0",
            // value: "",
            "de":{ "sid": "0", "prid": rowprid, "name": rowName, "value": "" },
            "es":{ "sid": "0", "prid": rowprid, "name": rowName, "value": "" },
            "it":{ "sid": "0", "prid": rowprid, "name": rowName, "value": "" },
            "fr":{ "sid": "0", "prid": rowprid, "name": rowName, "value": "" },
            "en":{ "sid": "0", "prid": rowprid, "name": rowName, "value": "" },
            "nl":{ "sid": "0", "prid": rowprid, "name": rowName, "value": "" },
            "ja":{ "sid": "0", "prid": rowprid, "name": rowName, "value": "" },
            "zh":{ "sid": "0", "prid": rowprid, "name": rowName, "value": "" },
            "sv":{ "sid": "0", "prid": rowprid, "name": rowName, "value": "" },
            "pl":{ "sid": "0", "prid": rowprid, "name": rowName, "value": "" },

          }
          console.log(this.datall.datacol,'row',row)
          this.datall.datacol[index].variant.push(row)
        }
        if(state == 'del'){
          this.datall.datacol[index].variant.pop()
        }
      })
    },
    addColattribute(){
      console.log(1)
      var col = {
        battery_status: 0,
        country: "",
        ean: "",
        image: [],
        image_pool: [
          {
            uid: "",
            status: "",
            url: ""
          }
        ],
        variant: [
          {
            "de":{ "sid": "0", "prid": "0", "name": "", "value": "" },
            "es":{ "sid": "0", "prid": "0", "name": "", "value": "" },
            "it":{ "sid": "0", "prid": "0", "name": "", "value": "" },
            "fr":{ "sid": "0", "prid": "0", "name": "", "value": "" },
            "en":{ "sid": "0", "prid": "0", "name": "", "value": "" },
            "nl":{ "sid": "0", "prid": "0", "name": "", "value": "" },
            "ja":{ "sid": "0", "prid": "0", "name": "", "value": "" },
            "zh":{ "sid": "0", "prid": "0", "name": "", "value": "" },
            "sv":{ "sid": "0", "prid": "0", "name": "", "value": "" },
            "pl":{ "sid": "0", "prid": "0", "name": "", "value": "" },
          },
        ],
        ori_url: "",
        price: {
          "DE":"",
          "NL":"",
          "FR":"",
          "GB":"",
          "ES":"",
          "IT":"",
          "US":"",
          "CA":"",
          "MX":"",
          "AU":"",
          "JP":"",
          "SE":"",
          "PL":"",
        },
        profit: {
          "DE":"",
          "NL":"",
          "FR":"",
          "GB":"",
          "ES":"",
          "IT":"",
          "US":"",
          "CA":"",
          "MX":"",
          "AU":"",
          "JP":"",
          "SE":"",
          "PL":"",
        },
        freight:"",
        quantity: "45",
        sid: "0",
        sku: "",
        weight:{
          height: "",
          length: "",
          value_type: "",
          weight: "",
          width: "",
        }
      }
      var colVarant = {
        // name: "",
        // prid: "0",
        // sid: "0",
        // value: ""
        "de":{ "sid": "0", "prid": "0", "name": "", "value": "" },
        "es":{ "sid": "0", "prid": "0", "name": "", "value": "" },
        "it":{ "sid": "0", "prid": "0", "name": "", "value": "" },
        "fr":{ "sid": "0", "prid": "0", "name": "", "value": "" },
        "en":{ "sid": "0", "prid": "0", "name": "", "value": "" },
        "nl":{ "sid": "0", "prid": "0", "name": "", "value": "" },
        "ja":{ "sid": "0", "prid": "0", "name": "", "value": "" },
        "zh":{ "sid": "0", "prid": "0", "name": "", "value": "" },
        "sv":{ "sid": "0", "prid": "0", "name": "", "value": "" },
        "pl":{ "sid": "0", "prid": "0", "name": "", "value": "" },
      }
      //
      console.log(11)
      if(this.datall.datarow.length > 0){
        for(var i = 1;i < this.datall.datarow.length; i++){
          col.variant.push(colVarant)
        }
      }
      // console.log(this.datall.datacol)
      if(this.datall.datacol.length === 0){

      }else{
        col.battery_status = this.datall.datacol[0].battery_status
        col.ean = this.datall.datacol[0].ean
        col.image = this.datall.datacol[0].image
        col.image_pool = this.datall.datacol[0].image_pool
        col.ori_url = this.datall.datacol[0].ori_url
        // col.price = this.datall.datacol[0].price
        col.quantity = this.datall.datacol[0].quantity
        // col.sid = this.datall.datacol[0].sid
        col.sid = 0
        col.sku = this.datall.datacol[0].sku
        col.price = this.datall.datacol[0].price
        col.profit = this.datall.datacol[0].profit
        col.freight = this.datall.datacol[0].freight
        col.weight = this.datall.datacol[0].weight
      }
      console.log(111,col)
      this.datall.datacol.push(col)
      console.log(this.datall)
      this.initdatall()
      // this.ColAttribute.push(this.ColAttribute.length+1)
      // console.log(this.ColAttribute)
    },
    getSku(value) {
      getSkuData({
        id: 303115
      }).then(res => {
        if(res.code === 0) {
          if(value === 1) {
            if(JSON.stringify(res.data) == "{}"){
              this.$notification.error({
                message: '提醒',
                description: '图片更新失败',
              });
            }else{
              res.data.forEach((item, index) => {
                this.dataList.forEach((items, indexs) => {
                  if(item.sid === items.sid) {
                    items.image = item.image
                    items.image_pool = item.image_pool
                  }
                })
              })
              // this.dataList = res.data
              // this.datall.datacol = this.deepCopy(this.dataList)
              this.$notification.success({
                message: '提醒',
                description: '图片更新成功',
              });
            }
          } else {
            if(JSON.stringify(res.data) == "{}"){
              res.data =[]
              this.dataList = res.data
              this.dataList.forEach((item, index) => {
                item['serialNumber'] = index + 1
              })
              this.datall.datacol = this.deepCopy(this.dataList)
            }else{
              this.dataList = res.data
              this.dataList.forEach((item, index) => {
                item['serialNumber'] = index + 1
                if(!item.profit){
                  item.profit = {"DE":"","NL":"","FR":"","GB":"","ES":"","IT":"","US":"","CA":"","MX":"","AU":"","JP":"",'SE':"","PL":""}
                }

              })
              this.datall.datacol = this.deepCopy(this.dataList)
            }
          }

          skuGetAttributes({
            pid: 303115
          }).then(res => {
            if(res.code === 0){
              // 判断data是否为空对象
              if(JSON.stringify(res.data) == "{}"){
                res.data = []
                this.dataLL = res.data
                // this.datall.datarow = this.dataLL
                this.datall.datarow = this.deepCopy(this.dataLL)
                // console.log(this.datall,"ovee")
                this.initdatall()
              }else{
                this.dataLL = res.data
                // this.datall.datarow = this.dataLL
                this.datall.datarow = this.deepCopy(this.dataLL)
                // console.log(this.datall,"ovee")
                this.initdatall()
              }
              this.updateColumns()
            }
          })
          if(this.datall.datacol.length > 1 ){
            console.log('多属性',1,'ovee')
            this.isClass = true
          }else{
            if(this.datall.datacol[0].variant && this.datall.datacol[0].variant.length>0 && this.datall.datacol[0].variant[0].value.length>0){
              console.log('多属性',1,'ovee')
              this.isClass = true
            }else{
              console.log('单品',2,'ovee')
              this.isClass = false
            }
          }
        }
      })
    },
    // 深拷贝
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
    updateColumns(){
      // row.length 1 2
      this.columns = JSON.parse(JSON.stringify(this.columnData))
      let size = {
        title: '尺寸(size)',
        key: 'size',
        align:'center',
        scopedSlots: { customRender: 'size' },
        width:'250px'
      },color={
        title: '颜色(color)',
        key: 'color',
        align:'center',
        scopedSlots: { customRender: 'color' },
        width:'250px'
      }
      let status1=0,status2=0
      if(this.dataLL.length){
        this.dataLL.forEach((item,index)=>{
          if(item.name == 'color'){
            if(this.dataList.length){
              this.dataList.forEach((itm,idx)=>{
                itm.variant.forEach((im,inx)=>{
                  if(im.name == item.name){
                    if(im.value){
                      status1 = 1
                    }
                  }
                })
              })
            }
          }else if(item.name == 'size'){
            if(this.dataList.length){
              this.dataList.forEach((itm,idx)=>{
                itm.variant.forEach((im,inx)=>{
                  if(im.name == item.name){
                    if(im.value){
                      status2 = 1
                    }
                  }
                })
              })
            }
          }
        })
      }
      console.log(status1,status2,'over1111')
      if(status1&&!status2){
        this.columns.splice(2,0,color)
        this.columnWidth=2770
        // Vue.set(this.columns,2,color);
      }else if(!status1&&status2){
        this.columns.splice(2,0,size)
        this.columnWidth=2770
        // Vue.set(this.columns,2,size);
      }else if(status1&&status2){
        console.log('执行了')
        this.columns.splice(2,0,color,size)
        this.columnWidth=3020
        // Vue.set(this.columns,2,color);
        // Vue.set(this.columns,3,size);
      }
    },
    //保存关闭
    editingAllCancel(){
      this.$emit('editingAllCancel');
    },
    nextStep(){
      console.log(this.datall,'datall')
      this.$emit('toDatall', this.datall, this.isClass,this.transLanguage);
    },
    // 翻译属性值
    translate(){
      this.transSuccess === false

      if(this.transLanguageAll.length<1){
        this.transSuccess = false
        this.$notification.error({
          message: '错误',
          description:'翻译到语言不能为空',
        });
      }else{
        this.timer = setTimeout(()=>{
          if(this.transSuccess){
            this.transSuccess === false
            console.log( this.transSucces)
            this.$notification.success({
              message: '成功',
              description:'翻译成功',
            });
            clearInterval(this.timer);
            this.timer = null;
          }
        },1000)
        this.translateLoading = true
        if(this.defaultSlate !=='1'){
          setTimeout(()=>{
            if(this.translateLoading === true ){
              this.$notification.error({
                message: '错误',
                description:'翻译出现错误',
              });
            }
            this.translateLoading = false
          },25000)
        }
        this.attributeOne = []
        this.attributeTow = []
        this.attributeOnes = []
        this.attributeTows = []
        this.transMoney = 0
        this.transNumber = 0
        if(this.datall.datacol.length>0 && this.datall.datarow.length > 0){
          this.datall.datacol.forEach((item,index)=>{
            if(item.variant.length === 1){
              this.attributeOne.push(item.variant[0][this.transLanguage].value)
              this.attributeOnes.push(item.variant[0][this.transLanguage].value+":")
            }else{
              this.attributeOne.push(item.variant[0][this.transLanguage].value)
              this.attributeTow.push(item.variant[1][this.transLanguage].value)
              this.attributeOnes.push(item.variant[0][this.transLanguage].value+":")
              this.attributeTows.push(item.variant[1][this.transLanguage].value+":")
            }
          })
          console.log(this.attributeOne,'attributeOne')
          console.log(this.attributeOnes,'attributeOnes')
          if(this.attributeOne.length>0){
            // if(this.isNumber(this.attributeOne[0])){
            //   //是数字
            // }else{
            this.attributeOneStr = this.attributeOne.join('^')
            this.attributeOneStrs = this.attributeOnes.join('^')
            console.log(this.attributeOneStr,'attributeOneStr','attributeOneStrs',this.attributeOneStrs)
            //去翻译  如果是收费的
            if(this.defaultSlate === '1'){
              trans_fee({
                from:'zh',
                to:this.transLanguageAll,
                trans_type: 1,//1:谷歌翻译  3：谷歌免费翻译
                trans_obj: this.attributeOneStr
              }).then((res)=>{
                if(res.code === 0){
                  this.transMoney = (this.transMoney + parseFloat(res.data.money)).toFixed(2)
                  this.transNumber = this.transNumber + parseFloat(res.data.number)
                  this.transshow = true
                  this.translateLoading = false
                }else{
                  this.translateLoading = false
                  this.$notification.error({
                    message: '错误',
                    description:'翻译费用计算出现错误',
                  });
                }
              })
            }else{
              this.toTrans(this.attributeOneStr,0,this.attributeOneStrs)
            }
            // }
          }
          if(this.attributeTow.length>0){
            // if(this.isNumber(this.attributeTow[0])){
            //是数字
            // }else{
            this.attributeTowStr = this.attributeTow.join('^')
            this.attributeTowStrs = this.attributeTows.join('^')
            if(this.defaultSlate === '1'){
              trans_fee({
                from:'zh',
                to:this.transLanguageAll,
                trans_type: 1,//1:谷歌翻译  3：谷歌免费翻译
                trans_obj: this.attributeTowStr
              }).then((res)=>{
                if(res.code === 0){
                  this.transMoney = (this.transMoney + parseFloat(res.data.money)).toFixed(2)
                  this.transNumber = this.transNumber + parseFloat(res.data.number)
                  // console.log(this.transMoney,this.transNumber)
                  this.transshow = true

                }else{
                  this.translateLoading = false
                  this.$notification.error({
                    message: '错误',
                    description:'翻译费用计算出现错误',
                  });
                }
              })
            }else{
              this.toTrans(this.attributeTowStr,1,this.attributeTowStrs)
            }
            // }
          }
          // console.log(this.attributeOneStr,this.attributeTowStr,'str')
        }else{
          this.translateLoading = false
          this.$notification.error({
            message: '错误',
            description: '缺少多属性值',
          });
        }
      }
    },
    //关闭翻译弹窗
    transCancel(){
      this.transshow = false
      this.translateLoading = false
    },
    // 翻译选项
    transLanguageChange(){
      console.log(this.transLanguage)

    },
    //翻译到国家
    handleChangeLanguage(){
      this.selectedCountry = this.transLanguageAll
      this.selectedCountry.forEach((item,index)=>{
        if(item === 'all'){
          console.log(this.transLanguageAll)
          this.selectedCountryAll = true
          this.transLanguageAll = ["de", "es", "it", "fr", "en", "nl", "ja", "zh", "sv", "pl"]
        }
      })
      if(this.selectedCountryAll === true){
        this.selectedCountry = this.transLanguageAll
      }
      console.log(this.selectedCountry,'selectedCountry')
      if(this.selectedCountry.length === 0 || this.selectedCountry.indexOf('all' == -1)){
        this.selectedCountryAll = false
      }
      console.log(this.selectedCountryAll)
      // this.countrySelect.forEach((item, index) => {
      //   if(item.title === value) {
      //     this.currencyType = item.type
      //   }
      // })

      // this.getproductCurrency(value)
    },
    //校验数字
    isNumber(val){
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if(regPos.test(val) || regNeg.test(val)){
        return true;
      }else{
        return false;
      }
    },
    toTrans(q,leng,qs){
      console.log(q,leng,qs,'toTrans')
      if(this.defaultSlate === '3'){
        //后端翻译
        this.transLanguageAll.forEach((item,index)=>{
          this.freeTrans(q,item,leng)
        })
      }else if(this.defaultSlate === '4'){
        //  插件翻译
        // auto , 到什么语言 ， 翻译的内容 ，国家/语言  ，index
        this.transLanguageAll.forEach((item,index)=>{
          this.chromeToTrans('zh',item,qs,leng)
        })

      }
    },
    // 免费翻译
    freeTrans(q,language,leng){
      trans({
        from:'zh-CHS',
        to:language,
        q:q,
        platform:"amazon"
      }).then(res=>{
        if(res.code === 0){
          // console.log(res.data)
          this.fillInfo(res.data[language][0],leng,'3',language)
          this.translateLoading = false
          this.transSuccess = true
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
          this.transSuccess = false
        }
        this.translateLoading = false
      })
    },
    // 翻译的内容填充到相应的信息
    fillInfo(info,leng,type,language){
      console.log(info,"info",leng)
      this.tranInfo = []
      this.tranInfo = info.split('^')
      console.log(this.tranInfo,this.tranInfo.length,'tranInfo',this.datall.datacol,this.datall.datacol.length)
      this.datall.datacol.forEach((item,index)=>{
        if(type === '3'){
          item.variant[leng][language].value = this.tranInfo[index]
        }else if(type === '4'){
          console.log(this.tranInfo)
          item.variant[leng][language].value = this.myTrim(this.tranInfo[index]).replace(":","").replace("：","")
        }
      })
    },
    transOk(){
      const hide = this.$message.loading('扣费中', 0);
      if(this.attributeOneStr){
        // console.log('One')
        this.transLanguageAll.forEach((item,index)=>{
          this.Chargetrans(this.attributeOneStr,0,hide,item)
        })
      }
      if(this.attributeTowStr){
        // console.log("tow")
        this.transLanguageAll.forEach((item,index)=>{
          this.Chargetrans(this.attributeTowStr,1,hide,item)
        })
      }

    },
    // 收费翻译
    Chargetrans(q,leng,hide,language){
      //后端翻译
      trans({
        from:'zh-CHS',
        to:language,
        q:q,
        trans_type:"1",
        platform:"amazon"
      }).then(res=>{
        if(res.code === 0){
          // console.log(res.data)
          this.fillInfo(res.data[language][0],leng,'3',language)
          this.translateLoading = false
          this.transshow = false
          this.transSuccess = true
          if(hide){
            setTimeout(hide, 0);
          }
        }else{
          setTimeout(hide, 0);
          this.translateLoading = false
          this.transCancel()
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }

      })
    },
    // 翻译的方式
    SlateChange(val){
      Vue.ls.set('SLATE_TYPE',val);
    },
    // 去除空格
    myTrim(x) {
      console.log(x,'myTrim')
      return x.replace(/^\s+|\s+$/gm,'');
    },
    chromeToTrans(form,to,qs,leng){
      console.log(form,to,qs,leng,'chrome')
      let _this = this;
      let h = window.chrome;
      let targetExtensionId = _this.chromeCode; // 插件的ID
      let tk = _this.tokenFn(qs);
      console.log('tk-chrome',tk)

      h && h.runtime && h.runtime.sendMessage ?
        window.chrome.runtime.sendMessage(targetExtensionId,{
          type: 'single',
          action:"detect",
        },function(response){
          if(response === "ok"){
            console.log("ok1",response,'_this.transLanguage',_this.transLanguage,to,tk,qs)
            window.chrome.runtime.sendMessage(targetExtensionId,{
              action:"translate",
              transData:{
                sl:_this.transLanguage,
                tl:to,
                tk:tk,
                // q:encodeURI(qs)
                q:qs
              }
            },function(response){
              console.log(response,'response')
              if(response.state === "ok"){
                console.log('ok2',response)
                let ret = response.data[0];
                console.log(ret,'ret')
                let data = "";
                for (let i = 0; i < ret.length; i++) {
                  if (ret[i][0]) {
                    data += ret[i][0];
                  }
                }
                let resData = [];
                resData.push(data)
                console.log(resData,'resData',leng)
                _this.fillInfo(resData[0],leng,'4',to)
                _this.translateLoading = false;
                _this.transSuccess = true
              }else{
                console.log('err')
                _this.translateLoading  = false;
                clearInterval(_this.timer);
                _this.timer = null;
                _this.$notification.error({
                  message: '错误',
                  description: '插件通信失败',
                });
              }
            })
          }else{
            _this.translateLoading  = false;
            clearInterval(_this.timer);
            _this.timer = null;
            _this.$notification.error({
              message: '错误',
              description: '插件通信失败',
            });
          }
        }) : (console.log("插件未安裝"),
            _this.translateLoading = false,
            clearInterval(_this.timer),
            _this.timer = null,
            this.$notification.error({
              message: '提醒',
              description: '插件未安装'
            })

        )
      //  lll
    },
    tokenFn(a){
      var k = "";
      var b = 406644;
      var b1 = 3293161072;
      var jd = ".";
      var sb = "+-a^+6";
      var Zb = "+-3^+b+-f";
      for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var m = a.charCodeAt(g);
        128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023),
          e[f++] = m >> 18 | 240,
          e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224,
          e[f++] = m >> 6 & 63 | 128),
          e[f++] = m & 63 | 128)
      }
      a = b;
      for (f = 0; f < e.length; f++)
        a += e[f],
          a = this.RL(a, sb);
      a = this.RL(a, Zb);
      a ^= b1 || 0;
      0 > a && (a = (a & 2147483647) + 2147483648);
      a %= 1E6;
      return a.toString() + jd + (a ^ b)
    },
    RL(a, b){
      var t = "a";
      var Yb = "+";
      for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2),
          d = d >= t ? d.charCodeAt(0) - 87 : Number(d),
          d = b.charAt(c + 1) == Yb ? a >>> d : a << d;
        a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d
      }
      return a
    },
  },
  created(){
    this.datalls = {
      "datacol": [
        {
          "sid": "3862149",
          "sku": "DLbfGcQgqNPqSB4-1",
          "pid": "337963",
          "ean": "8853451598235",
          "price": { "CA": "", "MX": "", "US": "", "DE": "", "ES": "", "FR": "", "GB": "", "NL": "", "IT": "", "AU": "", "JP": "" },
          "quantity": "45",
          "weight": { "height": "", "length": "", "value_type": "cm", "weight": "", "width": "" },
          "image": [ "" ], "freight": "0.00",
          "profit": { "CA": "", "MX": "", "US": "", "DE": "", "ES": "", "FR": "", "GB": "", "NL": "", "IT": "", "AU": "", "JP": "" },
          "ori_url": "", "battery_status": "0",
          "image_pool": [ { "uid": 1, "url": "", "status": 0 } ],
          "variant": [
            {
              "de":{ "sid": "3862149", "prid": "351785", "name": "color", "value": "红色de" },
              "es":{ "sid": "3862149", "prid": "351785", "name": "color", "value": "红色es" },
              "it":{ "sid": "3862149", "prid": "351785", "name": "color", "value": "红色it" },
              "fr":{ "sid": "3862149", "prid": "351785", "name": "color", "value": "红色en" },
              "en":{ "sid": "3862149", "prid": "351785", "name": "color", "value": "红色en" },
              "nl":{ "sid": "3862149", "prid": "351785", "name": "color", "value": "红色nl" },
              "ja":{ "sid": "3862149", "prid": "351785", "name": "color", "value": "红色ja" },
              "zh":{ "sid": "3862149", "prid": "351785", "name": "color", "value": "红色zh" },
            },
            {
              "de":{"sid": "3862149", "prid": "351786", "name": "size", "value": "小号"},
              "es":{"sid": "3862149", "prid": "351786", "name": "size", "value": "小号"},
              "it":{"sid": "3862149", "prid": "351786", "name": "size", "value": "小号"},
              "fr":{"sid": "3862149", "prid": "351786", "name": "size", "value": "小号"},
              "en":{"sid": "3862149", "prid": "351786", "name": "size", "value": "小号"},
              "nl":{"sid": "3862149", "prid": "351786", "name": "size", "value": "小号"},
              "ja":{"sid": "3862149", "prid": "351786", "name": "size", "value": "小号"},
              "zh":{"sid": "3862149", "prid": "351786", "name": "size", "value": "小号"},
            }
          ],
          "serialNumber": 1
        },
        { "sid": "3862150",
          "sku": "DLbfGcQgqNPqSB4-2",
          "pid": "337963",
          "ean": "9587343686890",
          "price": { "CA": "", "MX": "", "US": "", "DE": "", "ES": "", "FR": "", "GB": "", "NL": "", "IT": "", "AU": "", "JP": "" },
          "quantity": "45", "weight": { "height": "", "length": "", "value_type": "cm", "weight": "", "width": "" },
          "image": [ "" ],
          "freight": "0.00",
          "profit": { "CA": "", "MX": "", "US": "", "DE": "", "ES": "", "FR": "", "GB": "", "NL": "", "IT": "", "AU": "", "JP": "" },
          "ori_url": "", "battery_status": "0",
          "image_pool": [ { "uid": 1, "url": "", "status": 0 } ],
          "variant": [
            {
              "de":{"sid": "3862150", "prid": "351785", "name": "color", "value": "绿色"},
              "es":{"sid": "3862150", "prid": "351785", "name": "color", "value": "绿色"},
              "it":{"sid": "3862150", "prid": "351785", "name": "color", "value": "绿色"},
              "fr":{"sid": "3862150", "prid": "351785", "name": "color", "value": "绿色"},
              "en":{"sid": "3862150", "prid": "351785", "name": "color", "value": "绿色"},
              "nl":{"sid": "3862150", "prid": "351785", "name": "color", "value": "绿色"},
              "ja":{"sid": "3862150", "prid": "351785", "name": "color", "value": "绿色"},
              "zh":{"sid": "3862150", "prid": "351785", "name": "color", "value": "绿色"},

            },
            {
              "de":{"sid": "3862150", "prid": "351786", "name": "size", "value": "小号" },
              "es":{"sid": "3862150", "prid": "351786", "name": "size", "value": "小号" },
              "it":{"sid": "3862150", "prid": "351786", "name": "size", "value": "小号" },
              "fr":{"sid": "3862150", "prid": "351786", "name": "size", "value": "小号" },
              "en":{"sid": "3862150", "prid": "351786", "name": "size", "value": "小号" },
              "nl":{"sid": "3862150", "prid": "351786", "name": "size", "value": "小号" },
              "ja":{"sid": "3862150", "prid": "351786", "name": "size", "value": "小号" },
              "zh":{"sid": "3862150", "prid": "351786", "name": "size", "value": "小号" }
            }
          ],
          "serialNumber": 2
        }
      ],
      "datarow": [
        { "prid": "351785", "name": "color" },
        { "prid": "351786", "name": "size" }
      ]}
  },
  mounted(){
    this.transLanguage = this.$store.state.tabStatus.ori_language
    if(Vue.ls.get('SLATE_TYPE')){
      this.defaultSlate = Vue.ls.get('SLATE_TYPE')
    }else {
      this.defaultSlate = '3'
    }
    console.log('edit-attribute',this.datall)
    if(Vue.ls.get('CHROME_ID')){
      this.chromeCode = Vue.ls.get('CHROME_ID')
    }else{
      this.chromeCode = this.GLOBAL.chrome.id
    }
  },
  updataed(){},
  destroyed(){}
}
</script>
<style scoped lang='less'>
.mb{
  margin-bottom: 20px;
}
.ml{margin-left:10px;}
</style>