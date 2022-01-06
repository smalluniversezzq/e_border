<template>
  <a-card>
    <div style="margin-bottom:20px">
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
    </div>
    <a-table
      :columns="columns"
      :loading="listLoading"
      :pagination="false "
      :dataSource="orderList">
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
  </a-card>
</template>
<script>
import Vue from 'vue'
import { getUserData } from '@/api/aggregate'
import moment from 'moment'

export default {
  name: 'gatherDetail',
  components: {
    
  },
  data () {
    return {
      uid:'',
      timeStatus:'a',
      startValue: null,
      endValue: null,
      store_id:'',
      country:'',
      endOpen: false,
      orderList: [],
      listLoading:false,
      page: '',
      current: 1,
      setDataValue:[],
      columns:[],
      columnsData:[
        {
          title: '时间',
          dataIndex: 'date_time',
          key: 'date_time',
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
        }
      ],
      plainOptions:['已签收订单量','已完成订单金额','待付款订单','未审核订单','已发货订单','已取消订单','采集商品数量','新增商品数量','翻译费用','邮费费用','上架商品总量'],
    }
  },
  created () {
    this.$store.dispatch('GetInfo')
  },
  mounted () {
    this.uid = this.$route.query.uid;
    this.startValue = this.$route.query.startValue;
    this.endValue = this.$route.query.endValue;
    this.store_id = this.$route.query.store_id;
    this.country = this.$route.query.country;
    this.startValue = moment(this.startValue, 'YYYY-MM-DD')
    this.endValue = moment(this.endValue, 'YYYY-MM-DD')
    let num = this.endValue.diff(this.startValue, 'day')
    // if(num==0){
    //   this.timeStatus = 'a'
    // }else if(num==6){
    //   this.timeStatus = 'b'
    // }else if(num==29){
    //   this.timeStatus = 'c'
    // }else{
      this.timeStatus = ''
    // }
    let columnsStatus = this.$store.state.user.gather
    if(columnsStatus.length){
      let tableData = this.getObjectValues(columnsStatus)
      this.setDataValue = tableData
    }else{
      this.setDataValue = []
    }
    // let tableData = this.getObjectValues(columnsStatus)
    // this.setDataValue = tableData
    this.conversionColumns()
    this.getAggregateList()
  },
  methods:{
    moment,
    getObjectValues(object){
      let values = [];
      object.forEach((item,index)=>{
        Object.keys(item).forEach((key)=>{
          if(key!='username'&&key!='titles'&&key!='country'&&key!='action'){
            values.push(item[key])
          }
        })
      })
      return values;
    },
    //转换表头数据
    conversionColumns(){
      this.columns = []
      this.columns = JSON.parse(JSON.stringify(this.columnsData))
      this.setDataValue.forEach((item,index)=>{
        if(item!='订单数量'&&item!='订单金额'&&item!='商品总数量'&&item!='总费用'){
          let obj= this.setColumns(item)
          this.columns.push(obj)
        }
      })
      console.log(this.columns)
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
      return startValue.valueOf() >= endValue.valueOf() || endValue.valueOf() > moment().subtract(1, 'days').valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    onChange(){
      this.timeStatus = ''
      this.getAggregateList()
    },
    fun_date(time){
      let date1 = new Date()
      let date2 = new Date(date1)
      date2.setDate(date1.getDate()-time)
      return date2
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
      getUserData({
        uid:this.uid,
        store_id:this.store_id,
        country:this.country,
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
    pagechange(page, pagesize) {
      this.current = page
      this.getAggregateList()
    },
  },
  filters:{
    
  }
}
</script>

<style lang="less">
  .modal_check_xu .ant-checkbox-group-item{
    width: 140px;
  }
</style>

