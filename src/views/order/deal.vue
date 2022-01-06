<template>
  <div class="deal">
    <a-card :bordered="false"  title='筛选'>
      <div class="table-page-search-wrapper" >
      <a-row  class='mt'>
        <a-col  class='title-size' :span='2'>店铺名称</a-col>
        <a-col :span='1' >
          <a-button size="small" @click='storeVal("all")'>全部</a-button>
        </a-col>
        <a-col :span='20'  >
          <a-button class='mr'  v-for='(item,index) in myStore' :key='index'  size="small" @click='storeVal(item.id)'>{{item.title}}</a-button>
        </a-col>
      </a-row>
      <a-row  class='mt'>
        <a-col  class='title-size' :span='2'>国家</a-col>
        <a-col :span='1'>
          <a-button size="small" @click='countryVal("all")'>全部</a-button>
        </a-col>
        <a-col class='mb'  :span='20'  >
          <a-button class='mr' v-for='(item,index) in CountryList'  :key="index"  @click='countryVal(item.title)' size="small">{{item.value}}</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="48" class='mt'>
        <a-col :md='2' :sm='24'>
          <span>查询方式</span>
        </a-col>
        <a-col :md="4" :sm="24">
            <a-select v-model="queryParam.status" placeholder="请选择" style='width:120px' size='small' @change='onstatus' default-value="0">
              <a-select-option value="0">订单号</a-select-option>
              <a-select-option value="1">sku</a-select-option>
            </a-select>
        </a-col>
        <a-col :md="4" :sm="24">
          <a-input style="width:200px"  v-model='queryParam.orderNumber' :placeholder="queryStatus"/>
        </a-col>
        <a-col :md="4" :sm="24">
          <span class="table-page-search-submitButtons" >
            <a-button type="primary" @click='queryOrderList(queryParam.status,queryParam.orderNumber)'>查询</a-button>
            <a-button style="margin-left: 8px"  @click="() => queryParam = {}">重置</a-button>
          </span>
        </a-col>
      </a-row>
      </div>
      </a-card>
      <a-card title='订单列表' class='mt'>
      <a-row>
        <!-- <a-col :md="2">
          <a-button  type='primary' >
            全部
          </a-button>
        </a-col>
        <a-col :md="2">
          <a-button >
            未获取
          </a-button>
        </a-col>
        <a-col :md="2">
          <a-button >
              已获取
          </a-button>
        </a-col>
        <a-col :md="2">
          <a-select v-model="selectsatus" placeholder="选择发货状态" style='width:200px'  >
            <a-select-option value="0">已发货</a-select-option>
            <a-select-option value="1">未发货</a-select-option>
          </a-select>
      </a-col>
      <a-col :md="2" :offset='10'>
        <a-button type="primary" >
          提交至平台
      </a-button>
      </a-col> -->
    </a-row>
    <!-- //列表 -->
    <a-row >
      <a-col :span="24">
      <a-table 
      :dataSource="data" 
      :rowSelection="rowSelection" 
      :pagination="false " 
      rowKey="id">
          <a-table-column 
            width='400px'
            title="标题"
            dataIndex="title"
          >
          </a-table-column>
          <a-table-column
            title="sku"
              dataIndex="sku"
          >
          </a-table-column>
          <a-table-column
            title="订单金额"
              dataIndex="amount"
          >
          </a-table-column>
          <a-table-column
            title="收件人"
              dataIndex="buyer_name"
          >
          </a-table-column>
          <a-table-column
            title="订单编号"
              dataIndex="order_id"
          >
          </a-table-column>
          <a-table-column
              title="时间"
            >
            <template slot-scope="text, record">
              <p>购买时间  {{record.purchase_date}}</p>
              <p>更新时间  {{record.last_update_date}}</p>
            </template>
          </a-table-column>
          <a-table-column
            title="物流方式"
          >
           <template slot-scope="text, record">
              <div>
                {{record.logistics_channel}}
                <a-icon v-if='!record.inland_info' @click='logisticfrom(record.country_code,record.id,record.logistics_channel)'  type="form" />
              </div>
              <p>{{record.freightMoney}}</p>
            </template>
          </a-table-column>
          <a-table-column
            title="运单号"
            dataIndex="waybillcode"
          >
          <template slot-scope='text, record'>
            <div v-if='record.status = "0"'>
              <p>物流单号</p>
              <p>{{record.logistics_channel_code}}</p>
              <p>备注单号</p>
              <p>{{record.inland_info}}</p>
            </div>
            <div v-if='!record.inland_info' class='only'>
              <a-button size='small'   @click='getcode(record.country_code,record.id,record.logistics_channel)'>获取运单号</a-button>
             
            </div>
          </template>
          </a-table-column>
          <a-table-column
            title="状态"
              dataIndex="order_status"
          >
          </a-table-column>
          <a-table-column
            title="操作"
          >
            <template slot-scope="text, record">
              <a-row>
                <a-popover title="提醒">
                  <template slot="content">
                    <p>中转仓未收到货前，提前把亚马逊订单变成发货状态</p>
                  </template>
                    <a-button @click='todeliver(record.id)'>虚拟发货</a-button>
                </a-popover>
                <a-modal
                  title="删除"
                  :visible="visible"
                  @ok="handleOk"
                  :confirmLoading="confirmLoading"
                  @cancel="handleCancel"
                >
                  <p>{{ModalText}}</p>
                </a-modal>
              </a-row>
              <a-row>
                <a-col>
                  <a-popover title="提醒">
                    <template slot="content">
                      <p>FBA备货模式</p>
                    </template>
                     <a-button @click='clickme()'  class='mt' >发货</a-button>
                  </a-popover>
                </a-col>
              </a-row>
              <a-row class='mt'>
                <a-col>
                  <a-button v-if='record.status == "status"' type="danger" @click='ordercancel(record.id)'>取消订单</a-button>
                  <a-button v-if='record.status == "status2"' type="danger"  @click='orderdel(record.id)'>删除订单</a-button>
                  <a-button    @click='details(record.id)'>订单详情</a-button>
                  <a-modal
                    title="取消订单"
                    :visible="cancelordershow"
                    @ok="cancelOk"
                    :confirmLoading="cancelLoading"
                    @cancel="orderCancel"
                  >
                    <p>{{ModalcancelText}}</p>
                  </a-modal>
                </a-col>
              </a-row>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>
     <a-row v-if='data' class='mt' type="flex" justify="end">
      <a-col>
         <a-pagination v-model="current" @change='pagechange' :pageSize='page.pageSize' :total='(page.pageSize*page.lastPage)' />
      </a-col>
    </a-row>
    <a-modal
      title="选择物流方式"
      :visible="modals"
      @ok="exportOk"
      :confirmLoading="modalsLoading"
      @cancel="EXCancel"
      rowKey="id"
    >
      <a-form-item
        label="当前物流"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <span >{{CurrentLogistics}}</span>
      </a-form-item>
      <a-form-item
        label="选择物流"
        :labelCol="labelCol"
      >
          <!-- value='403-5672131-2566767' -->
        <a-tree-select
          style="width: 300px"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="treeData"
          placeholder='请选择物流'
          @change="onChangeSelect"
          >
          <span style="color: #08c" slot="title" slot-scope="{key, value}" >
            {{key}}{{value}}
          </span>
        </a-tree-select>
        <!-- <a-select defaultValue="顺丰" v-model='logistics' style="width:120px " >
          <a-select-option value="邮政">邮政</a-select-option>
          <a-select-option value="顺丰">顺丰</a-select-option>
        </a-select> -->
      </a-form-item>
    </a-modal>
    <a-modal
        title="填写物流信息"
        :visible="getcodeshow"
        @ok="getcodeOk"
        :confirmLoading="getcodeLoading"
        @cancel="getcodeCancel"
      >
      <a-form-item
          label="当前物流"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <span >{{CurrentLogistics}}</span>
        </a-form-item>
        <a-form-item
          label="物流名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <!-- <a-input v-model='name' placeholder='请填写国内物流名称'></a-input> -->
          <a-select  style="width: 120px" @change="handleChange">
            <a-select-option :value="item.no" v-for='(item,index) in logisInfo'  :key='index'>{{item.com}} </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="物流单号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
        <a-input v-model='code' placeholder='请填写国内物流单号'></a-input>
        </a-form-item>
      </a-modal>
  </a-card>
  </div>
</template>
<script>

import { oriOrderList ,groupUpdate , orderCheck ,getChannel ,setChannel ,getLogisticsNo ,deliver} from '@/api/order'
import { getMyStore } from '@/api/collect'
import { country , logisInfo} from './public/country'
import { Screen } from '@/components/order/screen.vue'
export default {
  name:"deal",
  components:{
    Screen
  },
  computed: {
     rowSelection() {
        const { selectedRowKeys } = this;
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }
          }),
        }
      }
    },

  data(){
    return{
      data:"",
      queryParam:{
        status:"0",
        logistics:"0",
        orderNumber:"",
        country:"0"
      },
      queryStatus:"请输入订单号",
      selectsatus:"0",
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 8 } },
      logistics:"邮政",
      modals:false,
      visible:false,
      ModalText:"确定要删除吗",
      modalsLoading:false,
      confirmLoading:false,
      listLoading:false,
      getcodeshow:false,
      getcodeLoading:false,
      ModalcancelText:"确定取消订单",
      cancelLoading:false,
      cancelordershow:false,
      name:"",
      code:"",
      queryState:false,
      current:1,
      page:"",
      selectAll:"",
      treeData:"",
      Selectvalue:"",
      CurrentLogistics:"",
      myStore:"",
      CountryList:"",
      country,
      logisInfo,
      logisticsName:"",
    }
  },
  created(){
   this.CountryList = this.country 
  },
  mounted(){
    this.getoriOrderList()
    this.getMyStores()
  },
  updated(){},
  destroyed(){},
  methods:{
    onstatus(){
      if(this.queryParam.status === '0'){
        this.queryStatus = '请输入订单号'
      }else if(this.queryParam.status === '1'){
        this.queryStatus = '请输入sku'
      }
    },
    storeVal(id){
      this.storeId = id
      this.info = {
        page:this.current,
        status:0,
        is_checked:0,
        store_id:this.storeId,
        country:"all"
      }
      if(id ==='all'){
        this.CountryList = this.country
      }
      this.allGetOrderList(this.info)
      this.myStore.forEach((item,index) =>{
        if(item.id ===id){
          this.CountryList = item.mws_site
        }
      })
    },
    countryVal(val){
      this.countryId = val
      this.info = {
        page:this.current,
        status:0,
        is_checked:0,
        store_id:this.storeId,
        country:this.countryId,
      }
      this.allGetOrderList(this.info)
    },
    getMyStores(){
      getMyStore({}).then((res)=>{
        if(res.code === 0){
          console.log(res.data)
          this.myStore=res.data
        }
      })
    },
    //获取订单列表
    getoriOrderList(){
      this.listLoading=true;
      oriOrderList({
        page:this.current,
        status:0,
        is_checked:1
      }).then(res =>{
        if(res.code === 0){
          // lll
          this.listLoading=false;
          if(res.data.length>0){
            this.data = res.data
            this.page = res.pages
            // console.log(res.pages,'666')
            // this.$notification.success({
            //   message: '成功',
            //   description: res.msg,
            // });
          }
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
          this.listLoading=false;
        }
      })
    },
    clickme(){
      console.log("666")
    },
    todeliver(id){
      deliver({id:id}).then(res=>{
        if(res.code === 0){
          this.$notification.success({
            message: '成功',
            description: res.msg,
          }); 
          this.getoriOrderList()
        }
      })
    },
    pagechange(page,pagesize){
      this.current = page;
      if(this.queryState === false){
        this.getoriOrderList()
      }else{
        this.queryOrderList(this.queryParam.status,this.queryParam.orderNumber)
      }
    },
    // 查询订单
    queryOrderList(mode,code){
      if(mode === '0'){
        this.info = {
          ids:code,
          page:this.current,
          status:0,
          is_checked:0
        }
      }else if(mode === '1'){
        this.info = {
          keywords:code,
          page:this.current,
          status:0,
          is_checked:0
        }
      }
      this.allGetOrderList(this.info)
    },
    allGetOrderList(info){
      oriOrderList(info).then(res=>{
        if(res.code === 0){
          this.data = res.data
          this.page = res.pages
          this.queryState = true
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
    },
   onChangeSelect(value){
      this.Selectvalue =value
      console.log(this.Selectvalue)
    },
    //删除订单
    orderdel(){
      // handleOk
      this.visible = true
    },
    ordercancel(){
      this.cancelordershow = true;
    },
  //提交物流信息
    logisticfrom(CountryCode,id,logis){
      this.orderid = id
      this.CurrentLogistics = logis
      this.modals = true
     // 获取select列表
      getChannel({
        country_code:CountryCode
      }).then(res=>{
        this.treeData = res.data
        console.log("res",res)
      })

    },
    //订单详情
    details(id){
      this.$router.push({
        path:"/order/fictitious/orderdetails",
        query:{
          id:id
        }
      })
    },
    //修改物流
    exportOk(){
      console.log(this.Selectvalue,'Selectvalue')
      setChannel({
        channel:this.Selectvalue,
        id:this.orderid
      }).then(res=>{
        if(res.code === 0 ){
          this.getoriOrderList()
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });

        }else{
            this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
      this.modalsLoading = true;
      setTimeout(() => {
        this.modals = false;
        this.modalsLoading = false;
      }, 1000);
    },
 
    //取消订单
    cancelOk(){
      this.cancelLoading = true;
      setTimeout(() => {
        this.cancelordershow = false;
        this.cancelLoading = false;
      }, 1000);
    },
    orderCancel(e){
      this.cancelordershow = false
    },
    EXCancel(e) {
      this.modals = false
    },
    handleCancel(e) {
      this.visible = false
    },
    handleOk(){
      //删除的操作
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 1000);
    },
    getcode(CountryCode,id,logis){
      this.orderid = id
      this.CurrentLogistics = logis
      this.getcodeshow=true;
    },
    handleChange(value){
      console.log(value)
      this.name = value
    },
    getcodeOk(){
      if(this.name.length <=0){
        this.$notification.error({
        message: '错误',
        description: "物流名称不能为空",
        });

      }else if(this.code.length <= 0){
        this.$notification.error({
          message: '错误',
          description: "物流单号不能为空",
        });
      }else{
        getLogisticsNo({
          id:this.orderid,
          inland_channel:this.name,
          inland_code:this.code
        }).then((res)=>{
          if(res.code === 0){
              this.$notification.success({
              message: '成功',
              description: "物流修改成功",
            });
          this.getcodeLoading = true;
      //提交
          setTimeout(() => {
            this.getcodeshow = false;
            this.getcodeLoading = false;
          }, 500);
          }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
          }
        })
      }

      // this.getcodeLoading = true;
      // //提交
      // setTimeout(() => {
      //   this.getcodeshow = false;
      //   this.getcodeLoading = false;
      // }, 800);
    },
    getcodeCancel(){
      this.getcodeshow=false;
    }
  }
}
</script>
<style scoped lang='less'>
  .mt{margin-top: 20px;}
  .mr{margin-right: 20px;}
  .ll{text-align: right;}
  .mt-xl{margin-top:40px;}
  .ant-modal-mask{
    background: rgba(0, 0, 0, 0.15) !important;
  }
</style>


