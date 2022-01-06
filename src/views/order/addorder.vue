<template>
  <div class="addorder">
    <a-form :form="form" v-if="data">
      <a-card class='mt' :bordered="false" title='订单信息'>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="订单号"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input 
                v-decorator="['order_id', { initialValue: pageData?pageData.order_id:'', rules: [{required: false, message: '订单号不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77%)' }"/>
              <a-button type='primary' style="margin-left:8px" @click="openQuoteOrder">引用单号</a-button>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="收件人"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input 
                v-decorator="['buyer_name', { initialValue: pageData?pageData.buyer_name:'', rules: [{required: false, message: '收件人名称不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="手机号"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input  
                v-decorator="['Phone', { initialValue: pageData?pageData.shipping_address.Phone:'', rules: [{required: false, message: '手机号不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col  :span="8">
            <a-form-item
              label="店铺"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-select v-decorator="['store_id', { initialValue: pageData?pageData.store_id:'', rules: [{required: false, message: '手机号不能为空'}] }]" 
                :style="{ display: 'inline-block', width: 'calc(77%)' }">
                <a-select-option value="">请选择店铺</a-select-option>
                <a-select-option :value="item.id"  v-for='(item,index) in shopData' :key="index">{{item.title}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card class='mt' :bordered="false" title='收货地址'>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="国家"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-select v-decorator="['CountryCode', { initialValue: pageData?pageData.shipping_address.CountryCode:'', rules: [{required: false, message: '国家不能为空'}] }]" 
                :style="{ display: 'inline-block', width: 'calc(77%)' }">
                <a-select-option value="">请选择国家</a-select-option>
                <a-select-option value="CA">加拿大</a-select-option>
                <a-select-option value="MX">墨西哥</a-select-option>
                <a-select-option value="US">美国</a-select-option>
                <a-select-option value="DE">德国</a-select-option>
                <a-select-option value="ES">西班牙</a-select-option>
                <a-select-option value="FR">法国</a-select-option>
                <a-select-option value="GB">英国</a-select-option>
                <a-select-option value="PL">波兰</a-select-option>
                <a-select-option value="IT">意大利</a-select-option>
                <a-select-option value="AU">澳大利亚</a-select-option>
                <a-select-option value="JP">日本</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="州或省"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input
                v-decorator="['StateOrRegion', { initialValue: pageData?pageData.shipping_address.StateOrRegion:'', rules: [{required: false, message: '州或省不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="地区"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input  
                v-decorator="['District', { initialValue: pageData?pageData.shipping_address.StateOrRegion:'', rules: [{required: false, message: '省不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="县"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input
                v-decorator="['County', { initialValue: pageData?pageData.shipping_address.County:'', rules: [{required: false, message: '省州不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77%)' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="城市"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input 
                v-decorator="['City', { initialValue: pageData?pageData.shipping_address.City:'', rules: [{required: false, message: '城市不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="邮编"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input 
                v-decorator="['PostalCode', { initialValue: pageData?pageData.shipping_address.PostalCode:'', rules: [{required: false, message: '邮编不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="详细地址1"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input
                v-decorator="['AddressLine1', { initialValue: pageData?pageData.shipping_address.AddressLine1:'', rules: [{required: false, message: '详细地址1不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77%)' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="详细地址2"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input 
                v-decorator="['AddressLine2', { initialValue: pageData?pageData.shipping_address.AddressLine2:'', rules: [{required: false, message: '详细地址2不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="详细地址3"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input 
                v-decorator="['AddressLine3', { initialValue: pageData?pageData.shipping_address.AddressLine3:'', rules: [{required: false, message: '详细地址3不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card class='mt' :bordered="false" title='报关信息'>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="中文名称"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input 
                v-decorator="['cnName', { initialValue: pageData?pageData.clearance_info.cnName:'', rules: [{required: true, message: '中文名称不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77%)' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="英文名称"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input 
                v-decorator="['enName', { initialValue: pageData?pageData.clearance_info.enName:'', rules: [{required: true, message: '英文名称不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="申报金额(usd)"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input  
                v-decorator="['usd', { initialValue:pageData?pageData.clearance_info.usd:'', rules: [{required: true, message: '申报金额不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="报关重量(g)"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input 
                v-decorator="['weight', { initialValue: pageData?pageData.clearance_info.weight:'', rules: [{required: true, message: '报关重量不能为空'}] }]" 
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="商品数量"
              :labelCol="{span:7}"
              :wrapperCol="{span:17}">
              <a-input  
                v-decorator="['quantity', { initialValue: pageData?pageData.clearance_info.quantity:'', rules: [{required: true, message: '商品数量不能为空'}] }]"
                :style="{ display: 'inline-block', width: 'calc(77% )' }"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card class='mt' :bordered="false" title='商品信息'>
        <a-row>
          <a-col :span="12">
            <a-button type='primary' @click="addSkuList">新增</a-button>
            <a-table :pagination="false" :columns="columns" :dataSource="tableData">
              <span slot="sku">
                <span style="color:red">*</span>
                商品SKU
              </span>
              <span slot="productTitle">
                <span style="color:red">*</span>
                商品标题
              </span>
              <span slot="num">
                <span style="color:red">*</span>
                数量
              </span>
              <span slot="price">
                <span style="color:red">*</span>
                单价
              </span>
              <template slot="sku" slot-scope="text, record">
                <a-input style="width:100px" v-model="record.sku"/>
                <a-button type='primary' style="width:80px;margin-left:10px" @click="assignSku(record.position_id)">指定SKU</a-button>
              </template>
              <template slot="productTitle" slot-scope="text, record">
                <a-input style="width:100px" v-model="record.title"/>
              </template>
              <template slot="num" slot-scope="text, record">
                <a-input style="width:100px" v-model="record.quantity"/>
              </template>
              <template slot="price" slot-scope="text, record">
                <a-input style="width:100px" v-model="record.amount"/>
              </template>
              <template slot="action" slot-scope="text, record">
                <span style="color:#f5222d" @click="delSkuList(record.position_id)">删除</span>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </a-card>
      <a-card class='mt' :bordered="false" title='备注信息'>
        <a-row>
          <a-col :span="10" :offset="1">
            <a-textarea placeholder="" :rows="4" 
              v-decorator="['remark', { initialValue: pageData?pageData.remark:'', rules: [{required: false, message: '备注不能为空'}] }]"/>
          </a-col>
        </a-row>
        <a-row class='mt'>
          <a-col>
            <a-form-item :wrapperCol="{span: 12, offset: 8}">
              <a-button style='margin-left:10px' @click='cancel()'>取消</a-button>
              <a-button type="primary" style='margin-left:20px' :loading='showInt' @click="saveOrderData">保存</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
    <a-modal
      width='800px'
      title="引用订单"
      :visible="quoteVisible"
      :footer="null"
      @ok="quoteHandleOk"
      @cancel="quoteHandleCancel">
      <a-select v-model="quoteStatus" style="width: 160px;margin-right:20px">
        <a-select-option value="all">全部</a-select-option>
        <a-select-option value="0">待审核</a-select-option>
        <a-select-option value="1">代发货</a-select-option>
        <a-select-option value="2">已发货</a-select-option>
        <a-select-option value="3">已完成</a-select-option>
      </a-select>

      <span>订单编号:</span>
      <a-input style="width:200px;" v-model="quoteValue"/>
      <a-button type='primary' style="margin-left:10px" @click="getoriOrderList(1)">搜索</a-button>
      <a-table
        :dataSource="quoteData"
        rowKey="id"
        :pagination="false"
        :loading="listLoading">
        <a-table-column
          title="订单编号"
          dataIndex="order_id">
        </a-table-column>
        <a-table-column
          title="收件人"
          dataIndex="buyer_name">
        </a-table-column>
        <a-table-column
          title="商品数量"
          dataIndex="product_count">
        </a-table-column>
        <a-table-column
          title="操作人"
          dataIndex="username">
        </a-table-column>
        <a-table-column
          title="状态">
          <template slot-scope="text, record">
            <div v-if='record.is_checked=="0" && record.amazon_ship==0 && record.is_fba!="1"'>
              <div v-if='record.status =="20"'>
                等待付款
              </div>
              <div v-if='record.status !="20"'>
                待审核
              </div>
            </div>
            <div v-if='record.is_checked=="0" && record.amazon_ship==1 && record.is_fba!="1"'>
              <div>
                <span>已发货</span>
              </div>
            </div>
            <div v-if='record.is_checked!="0"'>
              <span v-if='record.remark '>
                {{record.order_status}}
                <span class='txt-red'>{{'('+record.remark+')'}}</span>
              </span>
              <span v-else>
                {{record.order_status}}
              </span>
            </div>
          </template>
        </a-table-column>
        <a-table-column
          title="操作">
          <template slot-scope="text, record">
            <span style="color:#1890ff" @click="quoteOrderNum(record)">引用</span>
          </template>
        </a-table-column>
      </a-table>
      <a-row
        v-if='quoteData'
        class='mt'
        type="flex"
        justify="end">
        <a-col>
          <a-pagination
            v-model="current"
            @change='getoriOrderList'
            :pageSize='page.pageSize'
            :total='(page.pageSize*page.lastPage)'/>
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      width='800px'
      title="搜索"
      :visible="skuVisible"
      :footer="null"
      @ok="skuHandleOk"
      @cancel="skuHandleCancel">
      <span>订单编号:</span>
      <a-input style="width:200px;" v-model="skuValue"/>
      <a-button type='primary' style="margin-left:10px" @click="getSkuList">搜索</a-button>
      <a-table
        :dataSource="skuData"
        :pagination="false"
        :loading="skuLoading"
        rowKey="id">
        <a-table-column
          title="图片">
          <template slot-scope="text, record">
            <img
              style="width:100px"
              :src="record.image"
              alt="">
          </template>
        </a-table-column>
        <a-table-column
          title="标题"
          dataIndex="title">
        </a-table-column>
        <a-table-column
          title="SKU"
          dataIndex="sku">
        </a-table-column>
        <a-table-column
          title="价格"
          dataIndex="amount">
        </a-table-column>
        <a-table-column
          title="操作"
          width="80px">
          <template slot-scope="text, record">
            <span style="color:#1890ff" @click="addSkuData(record)">添加</span>
          </template>
        </a-table-column>
      </a-table>
      <a-row
        v-if='skuData'
        class='mt'
        type="flex"
        justify="end">
        <a-col>
          <a-pagination
            v-model="skuCurrent"
            @change='getSkuList'
            :pageSize='skuPage.pageSize'
            :total='(skuPage.pageSize*skuPage.lastPage)'/>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { oriOrderList ,groupUpdate , getChannel, skuSearch, addOrders } from '@/api/order'
import { getEmpowerList, countryList } from '@/api/empower'
export default {
  name:"addorder",
  data(){
    return{
      form: this.$form.createForm(this),
      product:'',
      data:[],
      CountryCode:'',
      valueres:'',
      inlandshow:'',
      infoList:[1],
      disableds:'',
      platformValue:'',
      shopValue:'',
      columns:[
        {key: 'sku',align:'center',slots: { title: 'sku' },scopedSlots: { customRender: 'sku' }},
        {key: 'productTitle',align:'center',slots: { title: 'productTitle' },scopedSlots: { customRender: 'productTitle' }},
        {key: 'num',align:'center',slots: { title: 'num' },scopedSlots: { customRender: 'num' }},
        {key: 'price',align:'center',slots: { title: 'price' },scopedSlots: { customRender: 'price' }},
        {title: '操作',key: 'action',width:'120px',align:'center',scopedSlots: { customRender: 'action' },}
      ],
      tableData:[
        {id:'',position_id:0,sku:null,title:null,quantity:null,amount:null}
      ],
      quoteVisible:false,
      quoteStatus:'all',
      quotePlatform:'',
      quoteValue:'',
      quoteData:[],
      skuVisible:false,
      skuValue:'',
      skuData:[],
      listLoading:false,
      skuLoading:false,
      current: 1,
      page:'',
      pageData:'',
      shopData:[],
      skuListId:'',
      skuPage:'',
      skuCurrent:1,
      showInt:false
    }
  },
  watch: {
  },
  created(){
  },
  mounted(){
    this.getShoplist()
  },
  updated(){},
  destroyed(){},
  methods:{
    //获取订单数据
    getoriOrderList(page){
      this.current = page
      this.listLoading=true
      let status = ''
      let is_checked = ''
      if(this.quoteStatus == 'all'){
        status = 'all'
        is_checked = 'all'
      }else if(this.quoteStatus == '0'){
        status = '0'
        is_checked = '0'
      }else if(this.quoteStatus == '1'){
        status = '0'
        is_checked = '1'
      }else if(this.quoteStatus == '2'){
        status = '1'
        is_checked = '1'
      }else if(this.quoteStatus == '3'){
        status = '4'
        is_checked = '1'
      }
      oriOrderList({
        page:this.current,
        is_checked:is_checked,
        status:status,
        keywords:this.quoteValue,
        pageSize:5
      }).then((res)=>{
        if(res.code === 0){
          this.listLoading=false;  
          if(res.data){
            this.quoteData = res.data.data 
            this.page = res.pages
          }
        }else{
          this.$notification.error({
            message: '失败',
            description: res.msg,
          });
        }
      })
    },
    //打开引用单号
    openQuoteOrder(num){
      this.quoteVisible = true
      this.getoriOrderList(1)
    },
    //引用单号
    quoteOrderNum(data){
      this.pageData = data
      this.tableData = data.product
      if(this.tableData.length){
        this.tableData.forEach((item,index)=>{
          item.position_id = index
        })
      }
      this.quoteVisible = false
    },
    quoteHandleOk(){},
    quoteHandleCancel(){
      this.quoteVisible = false
    },
    //新增sku列表
    addSkuList(){
      let obj = {
        id:'',
        position_id:this.tableData.length,
        sku:null,
        title:null,
        quantity:null,
        amount:null
      }
      this.tableData.push(obj)
      console.log(this.tableData)
    },
    //删除sku列表
    delSkuList(num){
      this.tableData.forEach((item,index)=>{
        if(item.position_id == num){
          this.tableData.splice(index,1)
        }
      })
      this.tableData.forEach((item,index)=>{
        item.position_id = index
      })
      console.log(this.tableData)
    },
    //指定sku
    assignSku(id){
      let store_id = this.form.getFieldValue('store_id')
      if(store_id){
        this.skuVisible = true
        this.skuListId = id
        this.getSkuList()
      }else{
        this.$notification.error({
          message: '提示',
          description: '请选择店铺',
        });
      }
    },
    //获取sku列表
    getSkuList(){
      this.skuLoading=true; 
      skuSearch({
        page:this.skuCurrent,
        page_size:10,
        sku:this.skuValue,
      }).then((res)=>{
        if(res.code === 0){
          this.skuLoading=false;  
          if(res.data){
            if(JSON.stringify(res.data)!=="{}"){
              this.skuData = res.data 
              this.skuPage = res.pages
            }else{
              this.skuData = []
            }
          }else{
            this.skuData = []
          }
        }else{
          this.$notification.error({
            message: '失败',
            description: res.msg,
          });
        }
      })
    },
    //添加sku数据
    addSkuData(obj){
      this.tableData.forEach((item,index)=>{
        if(item.position_id == this.skuListId){
          item.id = obj.id
          item.sku = obj.sku
          item.title = obj.title
          item.quantity = obj.quantity
          item.amount = obj.amount
        }
      })
      this.skuVisible = false
    },
    skuHandleOk(){

    },
    skuHandleCancel(){
      this.skuVisible = false
      this.skuListId = ''
      this.skuValue = ''
    },
    //获取店铺
    getShoplist() {
      getEmpowerList({
        page: 1,
        platform: 'amazon'
      }).then(res => {
        if (res.code === 0) {
          if(JSON.stringify(res.data) !== '{}'){
            this.shopData = res.data
          }else{
            this.shopData = []
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //复制数据
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
    cancel(){
      this.$router.push({
        path:'/order/orderverify/orderverifys',
        query:{
          orderTab:this.$route.query.orderTab
        }
      })
    },
    //保存
    saveOrderData(e){
      this.showInt = true
      const { form: { validateFields } } = this;
      validateFields((errors, values) => {
        if (!errors) {
          let productData = this.deepCopy(this.tableData)
          let status
          if(productData.length){
            productData.forEach((item,index)=>{
              if(!item.sku || !item.title || !item.quantity || !item.amount){
                this.$notification.error({
                  message: '提示',
                  description: '商品信息请填写完整',
                });
                this.showInt = false
                status = true
              }
            })
          }else{
            this.showInt = false
            status = true
            this.$notification.error({
              message: '提示',
              description: '请添加商品',
            });
          }
          if(status){
            return
          }
          addOrders({
            order_id:values.order_id,//订单号
            shop_id:values.store_id,//店铺
            shipping_address:{
              Name:values.buyer_name,//收件人
              Phone:values.Phone,//手机号
              CountryCode:values.CountryCode,//国家
              StateOrRegion:values.StateOrRegion,//州或省
              District:values.District,//地区
              County:values.County,//县
              City:values.City,//城市
              PostalCode:values.PostalCode,//邮编
              AddressLine1: values.AddressLine1,//详细地址1
              AddressLine2: values.AddressLine2,//详细地址2
              AddressLine3: values.AddressLine3,//详细地址3
            },
            clearance:{
              cnName: values.cnName,//中文名称
              enName: values.enName,//英文名称
              usd: values.usd,//申报金额
              weight: values.weight,//报关重量
              quantity: values.weight,//商品数量
            },
            product:productData,
            remark: values.remark
          }).then(res =>{
            if(res.code === 0){
              this.$notification.success({
                message: '成功',
                description: res.msg,
              });
              this.showInt = false
              this.$router.push({
                path:'/order/orderverify/orderverifys',
                query:{
                  orderTab:this.$route.query.orderTab
                }
              })
            }else{
              this.showInt = false
              this.$notification.error({
                message: '错误',
                description: res.msg,
              });
            }
          })
        }else{
          this.showInt = false
        }
      });
    }
  }
}
</script>
<style scoped lang='less'>
  .mt{margin-top: 20px;}
  .mr{margin-right: 20px;}
  .ml-sm{margin-left:10px;}
  .ant-modal-mask{
  background-color: rgba(0, 0, 0, 0.15) !important;
}
</style>