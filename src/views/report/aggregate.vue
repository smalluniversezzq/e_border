<template>
  <a-card>
    <div style="margin-bottom:20px">
      <a-input-search 
      placeholder="用户姓名/手机号" 
      @search="siteChange()" 
      enterButton="搜索" 
      style="width:210px;margin-right:20px" 
      v-model="searchName"/>
      <a-select v-model="shopValue" style="width: 160px;margin-right:20px" @change="shopchange">
        <a-select-option value="">请选择店铺</a-select-option>
        <a-select-option :value="item.id"  v-for='(item,index) in storeSelect' :key="index">{{item.title}}</a-select-option>
      </a-select>
      <a-select v-model="siteValue" style="width: 160px;margin-right:20px" @change="siteChange">
        <a-select-option value="">请选择国家</a-select-option>
        <a-select-option :value="item.code"  v-for='(item,index) in siteSelect' :key="index">{{item.title}}</a-select-option>
      </a-select>
      <a-radio-group v-model="timeStatus" buttonStyle="solid" style="margin-right:20px" @change="setTimeRange">
        <a-radio-button value="a">昨日</a-radio-button>
        <a-radio-button value="b">近七天</a-radio-button>
        <a-radio-button value="c">近三十天</a-radio-button>
      </a-radio-group>
      <a-date-picker
        :disabledDate="disabledStartDate"
        format="YYYY-MM-DD"
        v-model="startValue"
        placeholder="开始时间"
        @change="onChange"
        @openChange="handleStartOpenChange"
      />
      至
      <a-date-picker
        :disabledDate="disabledEndDate"
        format="YYYY-MM-DD"
        placeholder="结束时间"
        v-model="endValue"
        :open="endOpen"
        @change="onChange"
        @openChange="handleEndOpenChange"
      />
      <a-button v-if='hasPerm(permsBtn.report_export)'  style="float:right" icon="download" @click="exportExcel()">导出Excel</a-button>
      <a-button v-if='hasPerm(permsBtn.report_custom)' style="float:right;margin-right:20px" icon="setting" @click="setShowData()">自定义数据</a-button>
    </div>
    <div style="margin:30px 0;font-size: 16px;" v-show="amountDataInfo.length">
      总计：
      <span v-for="(item,index) in amountDataInfo" :key="index" style="margin-right:10px">
        <span>{{item.title}}</span>
        <span v-if="item.title=='总费用' || item.title=='翻译总费用' || item.title=='邮费总费用' || item.title=='已完成订单总金额' || item.title=='订单金额'" :class="{ active: item.title=='总费用' }">{{item.value}}元</span>
        <span v-if="item.title=='订单数量' || item.title=='新增商品总数量' || item.title=='采集商品总数量' || item.title=='商品总数量' || item.title=='已取消订单总量' || item.title=='已发货订单总量' || item.title=='未审核订单总量' || item.title=='待付款订单总量' || item.title=='已签收订单总量' || item.title=='上架商品总量'">{{item.value}}</span>
      </span>
    </div>
    <a-table
      :columns="columns"
      :loading="listLoading"
      :pagination="false "
      :dataSource="orderList"
      rowKey="uid">
      <span slot="titles" slot-scope="text, record">
        <div v-for="(item,index) in record.titles" :key="index">{{item}}</div>
      </span>
      <span slot="country" slot-scope="text, record">
        <div v-if='Array.isArray(record.country)'>
          <div v-for="(item,index) in record.country" :key="index">{{codeORcountry[item]}}</div>
        </div>
        <div v-if='!Array.isArray(record.country)'>{{codeORcountry[record.country]}}</div>
      </span>
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="getDetail(record.uid)">详情</a>
      </span>
    </a-table>
    <a-row
      v-if='orderList.length'
      class='mt'
      type="flex"
      justify="end">
      <a-col>
        <a-pagination
          v-model="current"
          @change='pagechange'
          :pageSize='page.pageSize'
          :total='(page.pageSize*page.lastPage)'/>
      </a-col>
    </a-row>
    <a-modal title="自定义数据" :maskClosable="false" :visible="setShow" @ok="setOk" @cancel="setCancel">
      <div>
        <a-checkbox-group class="modal_check_xu" :options="plainOptions" v-model="setDataValue">
          <span slot="label" slot-scope="{value}">{{value}}</span>
        </a-checkbox-group>
      </div>
    </a-modal>
  </a-card>
</template>
<script>
import Vue from 'vue'
import { getGatherData, exportGatherData, getAmountData, saveColumnsData } from '@/api/aggregate'
import { codeORcountry } from '@/views/order/public/country'
import { getMyStore } from '@/api/collect'
import moment from 'moment'
import { permsBtn } from '@/utils/static'

export default {
  name: 'aggregate',
  components: {
    
  },
  data () {
    return {
      permsBtn,
      codeORcountry,
      storeSelect:[],
      siteSelect:[],
      shopValue:'',
      siteValue:'',
      searchName:'',
      timeStatus:'a',
      timeValue:null,
      startValue: null,
      endValue: null,
      endOpen: false,
      orderList: [],
      listLoading:false,
      page: '',
      current: 1,
      columns:[],
      columnsData:[
        {
          title: '用户',
          dataIndex: 'username',
          key: 'username',
        },{
          title: '店铺',
          // dataIndex: 'title',
          key: 'titles',
          scopedSlots: { customRender: 'titles' },
        },{
          title: '国家',
          // dataIndex: 'country',
          key: 'country',
          scopedSlots: { customRender: 'country' },
        },{
          title: '订单数量',
          dataIndex: 'all_order_number',
          key: 'all_order_number',
        },{
          title: '订单金额',
          dataIndex: 'all_order_amount',
          key: 'all_order_amount',
        },{
          title: '商品总数量',
          dataIndex: 'all_product',
          key: 'all_product',
        },{
          title: '总费用',
          dataIndex: 'all_fee_number',
          key: 'all_fee_number',
        },{
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
        }
      ],
      setShow:false,
      setDataValue:[],
      plainOptions:['已签收订单量','已完成订单金额','待付款订单','未审核订单','已发货订单','已取消订单','采集商品数量','新增商品数量','翻译费用','邮费费用','上架商品总量'],
      listId:'',
      amountData:[],
      amountDataInfo:[],
      initColumnsData:[]
    }
  },
  created () {
    
  },
  mounted () {
    let columnsStatus = this.$store.state.user.gather
    if(columnsStatus.length){
      let tableData = this.getObjectValues(columnsStatus)
      this.setDataValue = tableData
    }else{
      this.setDataValue = []
    }
    this.initColumnsData = JSON.parse(JSON.stringify(this.setDataValue))
    let dateValue = this.fun_date(1)
    this.startValue = moment(dateValue, 'YYYY-MM-DD')
    this.endValue = moment(dateValue, 'YYYY-MM-DD')
    this.getMyStores()
    this.getAggregateList()
    this.getAmountDataInfo()
    // this.setOk()
  },
  methods:{
    moment,
    getObjectValues(object){
      let values = [];
      object.forEach((item,index)=>{
        Object.keys(item).forEach((key)=>{
          values.push(item[key])
        })
      })
      return values;
    },
    // 获取国家和店铺信息
    getMyStores(){
      getMyStore().then((res)=>{
        if(res.code === 0){
          this.storeSelect = res.data
        }
      })
    },
    shopchange(){
      if(this.shopValue){
        this.siteValue = ''
        this.storeSelect.forEach((item,index) => {
          if(this.shopValue === item.id){
            this.siteSelect = item.mws_site
          }
        })
      }else{
        this.siteSelect = []
        this.siteValue = ''
      }
      this.getAggregateList()
      this.getAmountDataInfo()
    },
    fun_date(time){
      let date1 = new Date()
      let date2 = new Date(date1)
      date2.setDate(date1.getDate()-time)
      return date2
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() > moment().subtract(1, 'days').valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf() || endValue.valueOf() > moment().subtract(1, 'days').valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    //选择时间范围
    setTimeRange(){
      if(this.timeStatus=="a"){
        let dateValue = this.fun_date(1)
        this.startValue = moment(dateValue, 'YYYY-MM-DD')
      }else if(this.timeStatus=="b"){
        let dateValue = this.fun_date(7)
        this.startValue = moment(dateValue, 'YYYY-MM-DD')
      }else if(this.timeStatus=="c"){
        let dateValue = this.fun_date(30)
        this.startValue = moment(dateValue, 'YYYY-MM-DD')
      }
      this.endValue = moment(this.fun_date(1), 'YYYY-MM-DD')
      this.getAggregateList()
      this.getAmountDataInfo()
    },
    onChange(){
      this.timeStatus = ''
      this.getAggregateList()
      this.getAmountDataInfo()
    },
    siteChange(){
      this.getAggregateList()
      this.getAmountDataInfo()
    },
    //获取列表数据
    getAggregateList(){
      this.listLoading = true
      let timeValue1 = ''
      let timeValue2 = ''
      if(!this.startValue){
        timeValue1 = ''
      }else{
        timeValue1 = moment(this.startValue).format('YYYY-MM-DD')
      }
      if(!this.endValue){
        timeValue2 = ''
      }else{
        timeValue2 = moment(this.endValue).format('YYYY-MM-DD')
      }
      getGatherData({
        uid:this.listId,
        store_id:this.shopValue,
        country:this.siteValue,
        keyword:this.searchName,
        time:timeValue1+','+timeValue2,
        page:this.current
      }).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          if (JSON.stringify(res.data) != "{}" && res.data.length) {
            this.orderList = res.data
            this.page = res.pages
          } else {
            this.orderList = []
          }
        } else {
          this.listLoading = false
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    setAllData(){
      let data = []
      this.columns.forEach((item,index)=>{
        switch(item.title){
          case "订单数量":
            data.push({
              title:'订单数量',
              value:this.amountData.all_employee_order
            })
            break;
          case "订单金额":
            data.push({
              title:'订单金额',
              value:this.amountData.all_employee_order_amount
            })
            break;
          case "已签收订单量":
            data.push({
              title:'已签收订单总量',
              value:this.amountData.sign_order
            })
            break;
          case "已完成订单金额":
            data.push({
              title:'已完成订单总金额',
              value:this.amountData.sign_order_amount
            })
            break;
          case "待付款订单":
            data.push({
              title:'待付款订单总量',
              value:this.amountData.obligation_order
            })
            break;
          case "未审核订单":
            data.push({
              title:'未审核订单总量',
              value:this.amountData.unchecked_order
            })
            break;
          case "已发货订单":
            data.push({
              title:'已发货订单总量',
              value:this.amountData.shipped_order
            })
            break;
          case "已取消订单":
            data.push({
              title:'已取消订单总量',
              value:this.amountData.cancel_order
            })
            break;
          case "商品总数量":
            data.push({
              title:'商品总数量',
              value:this.amountData.product_number
            })
            break;
          case "采集商品数量":
            data.push({
              title:'采集商品总数量',
              value:this.amountData.crawl_product_number
            })
            break;
          case "新增商品数量":
            data.push({
              title:'新增商品总数量',
              value:this.amountData.add_product_number
            })
            break;
          case "翻译费用":
            data.push({
              title:'翻译总费用',
              value:this.amountData.all_translation_fee
            })
            break;
          case "邮费费用":
            data.push({
              title:'邮费总费用',
              value:this.amountData.all_order_freight
            })
            break;
          case "总费用":
            data.push({
              title:'总费用',
              value:this.amountData.all_fee
            })
            break;
          case "上架商品总量":
            data.push({
              title:'上架商品总量',
              value:this.amountData.all_employee_publish_number
            })
            break;
        }
      })
      return data
    },
    //获取统计数据
    getAmountDataInfo(){
      let timeValue1 = ''
      let timeValue2 = ''
      if(!this.startValue){
        timeValue1 = ''
      }else{
        timeValue1 = moment(this.startValue).format('YYYY-MM-DD')
      }
      if(!this.endValue){
        timeValue2 = ''
      }else{
        timeValue2 = moment(this.endValue).format('YYYY-MM-DD')
      }
      getAmountData({
        store_id:this.shopValue,
        country:this.siteValue,
        keyword:this.searchName,
        time:timeValue1+','+timeValue2
      }).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.amountData = res.data
            this.conversionColumns()
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    pagechange(page, pagesize) {
      this.current = page
      this.getAggregateList()
    },
    //导出
    exportExcel(){
      let timeValue1 = ''
      let timeValue2 = ''
      if(!this.startValue){
        timeValue1 = ''
      }else{
        timeValue1 = moment(this.startValue).format('YYYY-MM-DD')
      }
      if(!this.endValue){
        timeValue2 = ''
      }else{
        timeValue2 = moment(this.endValue).format('YYYY-MM-DD')
      }
      exportGatherData({
        store_id:this.shopValue,
        country:this.siteValue,
        keyword:this.searchName,
        time:timeValue1+','+timeValue2
      }).then(res => {
        if (res.code === 0) {
          window.open(this.GLOBAL.BASE_URL + res.data.fileArr , '_blank')
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //自定义数据
    setShowData(){
      this.setShow = true
    },
    //转换表头数据
    conversionColumns(){
      // if(this.setDataValue.length<5){
      //   this.$notification.error({
      //     message: '提示',
      //     description: '最少需选五个',
      //   });
      //   return
      // }
      this.columns = []
      this.columns = JSON.parse(JSON.stringify(this.columnsData))
      let arr1= []
      let arr2= []
      let arr3= []
      let arr4= []
      arr1 = JSON.parse(JSON.stringify(this.plainOptions));
      arr3 = JSON.parse(JSON.stringify(this.plainOptions));
      this.setDataValue.forEach((item,index)=>{
        arr1.forEach((itm,idx)=>{
          if(item == itm){
            arr1.splice(idx,1,'')
          }
        })
      })
      arr1.forEach((item)=>{
        if(item != ''){
          arr2.push(item)
        }
      })
      arr2.forEach((item,index)=>{
        arr3.forEach((itm,idx)=>{
          if(item == itm){
            arr3.splice(idx,1,'')
          }
        })
      })
      arr3.forEach((item)=>{
        if(item != ''){
          arr4.push(item)
        }
      })
      this.setDataValue = arr4;
      this.setDataValue.forEach((item,index)=>{
        let obj= this.setColumns(item)
        this.columns.splice(this.columns.length-1,0,obj)
      })
      this.setShow = false
      this.amountDataInfo = this.setAllData()
    },
    setOk(){
      this.conversionColumns()
      this.saveColumns()
    },
    saveColumns(){
      let data = []
      this.columns.forEach((item,index)=>{
        let obj = {}
        let name = item.key,
            value = item.title;
        obj[name] = value;
        data.push(obj)
      })
      saveColumnsData({
        title_list:data,
      }).then(res => {
        if (res.code === 0) {
          this.initColumnsData = JSON.parse(JSON.stringify(this.setDataValue))
          this.getAggregateList()
          this.$store.dispatch('GetInfo')
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    setColumns(item){
      if(item == '已签收订单量'){
        return {
          title: '已签收订单量',
          dataIndex: 'sign_order_number',
          key: 'sign_order_number',
        }
      }else if(item == '已完成订单金额'){
        return {
          title: '已完成订单金额',
          dataIndex: 'order_amount',
          key: 'order_amount',
        }
      }else if(item == '待付款订单'){
        return {
          title: '待付款订单',
          dataIndex: 'obligation_order_number',
          key: 'obligation_order_number',
        }
      }else if(item == '未审核订单'){
        return {
          title: '未审核订单',
          dataIndex: 'unchecked_order_number',
          key: 'unchecked_order_number',
        }
      }else if(item == '已发货订单'){
        return {
          title: '已发货订单',
          dataIndex: 'shipped_order_number',
          key: 'shipped_order_number',
        }
      }else if(item == '已取消订单'){
        return {
          title: '已取消订单',
          dataIndex: 'cancel_order_number',
          key: 'cancel_order_number',
        }
      }else if(item == '商品总数量'){
        return {
          title: '商品总数量',
          dataIndex: 'all_product',
          key: 'all_product',
        }
      }else if(item == '采集商品数量'){
        return {
          title: '采集商品数量',
          dataIndex: 'crawl_product',
          key: 'crawl_product',
        }
      }else if(item == '新增商品数量'){
        return {
          title: '新增商品数量',
          dataIndex: 'add_product',
          key: 'add_product',
        }
      }else if(item == '翻译费用'){
        return {
          title: '翻译费用',
          dataIndex: 'translation_fee',
          key: 'translation_fee',
        }
      }else if(item == '邮费费用'){
        return {
          title: '邮费费用',
          dataIndex: 'order_freight',
          key: 'order_freight',
        }
      }else if(item == '总费用'){
        return {
          title: '总费用',
          dataIndex: 'all_fee_number',
          key: 'all_fee_number',
        }
      }else if(item == '上架商品总量'){
        return {
          title: '上架商品总量',
          dataIndex: 'all_success_publish',
          key: 'all_success_publish',
        }
      }
    },
    setCancel(){
      this.setDataValue = JSON.parse(JSON.stringify(this.initColumnsData))
      this.setShow = false
    },
    //获取详情
    getDetail(uid){
      let timeValue1 = ''
      let timeValue2 = ''
      if(!this.startValue){
        timeValue1 = ''
      }else{
        timeValue1 = moment(this.startValue).format('YYYY-MM-DD')
      }
      if(!this.endValue){
        timeValue2 = ''
      }else{
        timeValue2 = moment(this.endValue).format('YYYY-MM-DD')
      }
      this.$router.push({
        path:"/report/gatherDetail",
        query:{
          uid:uid,
          store_id:this.shopValue,
          country:this.siteValue,
          startValue:timeValue1,
          endValue:timeValue2,
        }
      })
    }
  },
  filters:{
    
  }
}
</script>

<style lang="less">
  .modal_check_xu .ant-checkbox-group-item{
    width: 140px;
  }
  .active{
    color: red
  }
</style>

