<template>
  <div class='good_monitor'>
    <a-row class="mb">
      <a-col :span="12">
        店铺：
        <a-select class='mr-sm' :allowClear='true'  placeholder='请选择店铺'  style="width:180px " @change="shopchangeHis">
          <a-select-option :value="item.id"  v-for='(item,index) in storeSelect' :key="index">{{item.title}}</a-select-option>
        </a-select>
        <span v-if="siteSelectHis.length" class="ml">国家：</span>
        <a-select v-if="siteSelectHis.length" class='mr-sm' :allowClear='true'  placeholder='请选择国家'  style="width:180px " @change="classchangeHis">
          <a-select-option :value="item.code"  v-for='(item,index) in siteSelectHis' :key="index">{{item.title}}</a-select-option>
        </a-select>
        <a-button type='primary' @click='search'>搜索</a-button>
        <a-button  class='ml' @click='reset'>重置</a-button>
      </a-col>
      <a-col :span="12" style="text-align:right">
        <a-button type='primary' @click='addMonitor'>添加产品</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <a-table
          :pagination="false"
          :dataSource="data"
          :loading = "listLoading"
          rowKey="id">
          <a-table-column
            title="商品图片"
            width="100px">
            <template slot-scope="text, record">
              <a-popover v-show="record.image" placement="rightTop">
                <template slot="content" style="width:200px">
                  <img style="width:200px" :src="record.image" alt="">
                </template>
                <a-button style="width:100px;position:relative;overflow:hidden;height:100px">
                  <img
                    style="width:100px; margin-left:-16px;margin-top:-2px"
                    :src="record.image"
                    alt="暂无订单信息"/>
                </a-button>
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column
            title="商品标题"
            width="500px"
            dataIndex="title">
          </a-table-column>
          <a-table-column
            title="SKU"
            width="200px"
            dataIndex="sku">
          </a-table-column>
          <a-table-column
            title="ASIN"
            width="200px"
            dataIndex="asin">
          </a-table-column>
          <a-table-column
            title="国家"
            dataIndex="country_name">
          </a-table-column>
          <a-table-column
            title="店铺"
            dataIndex="shop_name">
          </a-table-column>
          <a-table-column
            class="time"
            title="更新时间"
            dataIndex="updated_at">
          </a-table-column>
          <a-table-column
            title="当前跟卖对手">
            <template slot-scope="text, record">
              <div v-if="record.productCount==='-1'">
              </div>
              <div v-else-if="record.productCount==='0'">
                <span style="color:#b3b3b3">无人跟卖</span>
                <span style="color:#b3b3b3" class="ml">查看</span>
              </div>
              <div v-else>
                <span style="color:#1890ff">{{record.productCount}}人跟卖</span>
                <a class="ml" @click='lookManitor(record.id)'>查看</a>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="操作">
            <template slot-scope="text, record">
              <a @click='delManitor(record.id)'>移除</a>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>
    <a-row>
      <a-col class='tar mt'>
        <a-pagination
          :pageSizeOptions="pageSizeOptionManage"
          v-model='current'
          showSizeChanger
          @showSizeChange="onShowSizeChange"
          :pageSize.sync="page.pageSize"
          @change='pagechange'
          :total='(page.pageSize*page.lastPage)' />
      </a-col>
    </a-row>
    <a-modal
      title="防跟卖监控"
      :width="1000"
      :footer="null"
      :visible="monitorVisible"
      @ok="monitorOk"
      @cancel="monitorCancel">
      <a-row class="mb" style="display: flex;align-items: center;">
        <a-col :span="2" style="text-align:right">店铺：</a-col>
        <a-col :span="6">
          <a-select class='mr-sm' :allowClear='true'  placeholder='请选择店铺'  style="width:180px " @change="toShop">
            <a-select-option :value="item.id"  v-for='(item,index) in storeSelect' :key="index">{{item.title}}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="2" v-if="countryList.length" style="text-align:right">国家：</a-col>
        <a-col :span="6" v-if="countryList.length">
          <a-select class='mr-sm' :allowClear='true'  placeholder='请选择国家'  style="width:180px " @change="TOcountry">
            <a-select-option :value="item.code"  v-for='(item,index) in countryList' :key="index">{{item.title}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row class="mb" style="display: flex;align-items: center;">
        <a-col :span="2" style="text-align:right">状态：</a-col>
        <a-col :span="22">
          <a-radio-group v-model="addStatus" @change="statusChange">
            <a-radio value="all">
              全部
            </a-radio>
            <a-radio value="1">
              已添加
            </a-radio>
            <a-radio value="0">
              未添加
            </a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row class="mb" style="display: flex;align-items: center;">
        <a-col :span="2" style="text-align:right">查询：</a-col>
        <a-col :span="22">
          <a-input style="width:300px" v-model="keywords" placeholder="请输入ASIN、SKU、商品标题"/>
          <a-button class="ml" type='primary' @click='searchGood'>搜索</a-button>
          <a-button  class='ml' @click='resetSearch'>重置</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-table
            :pagination="false"
            :dataSource="goodList"
            :loading = "listLoading1"
            rowKey="id">
            <a-table-column
              title="商品图片"
              width="100px">
              <template slot-scope="text, record">
                <a-popover v-show="record.image" placement="rightTop">
                  <template slot="content" style="width:200px">
                    <img style="width:200px" :src="record.image" alt="">
                  </template>
                  <a-button style="width:100px;position:relative;overflow:hidden;height:100px">
                    <img
                      style="width:100px; margin-left:-16px;margin-top:-2px"
                      :src="record.image"
                      alt="暂无订单信息"/>
                  </a-button>
                </a-popover>
              </template>
            </a-table-column>
            <a-table-column
              title="商品标题"
              width="300px"
              dataIndex="title">
            </a-table-column>
            <a-table-column
              title="SKU"
              dataIndex="sku">
            </a-table-column>
            <a-table-column
              title="ASIN"
              dataIndex="asin">
            </a-table-column>
            <a-table-column
              title="店铺名称"
              dataIndex="shop_name">
            </a-table-column>
            <a-table-column
              title="国家"
              dataIndex="country_name">
            </a-table-column>
            <a-table-column
              title="状态">
              <template slot-scope='text,record'>
                <span v-if="record.is_add=='1'">已添加</span>
                <span v-if="record.is_add=='0'">未添加</span>
              </template>
            </a-table-column>
            <a-table-column
              title="操作">
              <template slot-scope='text,record'>
                <a-switch v-model="record.is_add=='1'?true:false" @change="(val)=>isAddChange(val,record)"/>
              </template>
            </a-table-column>
          </a-table>
        </a-col>
      </a-row>
      <a-row>
        <a-col class='tar mt'>
          <a-pagination
            :pageSizeOptions="pageSizeOptionManage1"
            v-model='current1'
            showSizeChanger
            @showSizeChange="onShowSizeChange1"
            :pageSize.sync="page1.pageSize"
            @change='pagechange1'
            :total='(page1.pageSize*page1.lastPage)' />
        </a-col>
      </a-row>
    </a-modal>
    <a-modal 
      title='跟卖对手'
      :width="1000"
      :footer="null"
      :visible='monitorVisibles'
      @cancel="lookCancel">
      <a-row>
        <a-col>
          <a-table 
            :columns="columns"
            :pagination="false"
            :loading = "listLoading2" 
            :dataSource="monitorInfo" 
            @expand="openShow" 
            :rowKey="(r, i) => i" 
            :defaultExpandAllRows="false">
            <a-card slot="expandedRowRender" slot-scope="record">
              <a-table
                class='mt'
                :columns="innerColumns"
                :dataSource="record.children1"
                :pagination="false"
                :rowKey="(r, i) => i">
              </a-table>
            </a-card>
          </a-table>
        </a-col>
      </a-row>
      <a-row>
        <a-col class='tar mt'>
          <a-pagination
            :pageSizeOptions="pageSizeOptionManage"
            v-model='current2'
            showSizeChanger
            @showSizeChange="onShowSizeChange2"
            :pageSize.sync="page2.pageSize"
            @change='pagechange2'
            :total='(page2.pageSize*page2.lastPage)' />
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import {getGoodMonitorList,getMyStore,getProductList,addMonitorProduct,getFollowLog,getFollowHistory,delMonitorProduct} from '@/api/collect'
  export default {
    name:"good_monitor",
    components:{
    },
    data(){
      return{
        storeSelect:[],
        shopValueHis:"",
        siteSelectHis:[],
        SelectCountryHis:"",
        current:1,
        page:"",
        pageSizeOptionManage:['10','20','40','60','80','100','200'],
        data:[],
        listLoading:false,
        monitorVisible:false,
        countryList:[],
        shopId:'',
        countryId:'',
        addStatus:'all',
        keywords:'',
        goodList:[],
        listLoading1:false,
        current1:1,
        page1:"",
        pageSizeOptionManage1:['5','10','20','40','60','80','100','200'],
        monitorVisibles:false,
        monitorInfo:[],
        current2:1,
        page2:"",
        listLoading2:false,
        columns:[
          { title: '跟卖状态', dataIndex: 'status_message' },
          { title: '跟卖店铺', dataIndex: 'merchant_name' },
          { title: '最早跟卖时间', dataIndex: 'created_at' },
          { title: '最近跟卖时间', dataIndex: 'updated_at' },
          { title: '历史跟卖次数', dataIndex: 'follow_count' },
        ],
        innerColumns:[
          { title: '跟次数', dataIndex: 'message' },
          { title: '开始跟卖时间', dataIndex: 'created_at' },
          { title: '结束跟卖时间', dataIndex: 'updated_at' },
        ],
      }
    },
    watch: {
    },
    computed: {
      
    },
    methods:{
      // 获取国家和店铺信息
      getMyStores(){
        getMyStore({
          page_type:"mws_upload"
        }).then((res)=>{
          if(res.code === 0){
            this.storeSelect = res.data
          }
        })
      },
      shopchangeHis(val){
        this.shopValueHis = val
        if(val){
          this.storeSelect.forEach((item,index)=>{
            if(val === item.id){
              this.siteSelectHis= item.mws_site
            }
          })
        }else{
          this.siteSelectHis = []
          this.SelectCountryHis = ''
        } 
      },
      classchangeHis(value){
        this.SelectCountryHis = value
      },
      search(){
        this.getMonitorList(this.page.pageSize)
      },
      reset(){
        this.shopValueHis = ''
        this.SelectCountryHis = ''
      },
      //获取列表数据
      getMonitorList(pagesize){
        this.listLoading = true
        getGoodMonitorList({
          page:this.current,
          page_size:pagesize,
          store_id:this.shopValueHis,
          country:this.SelectCountryHis,
        }).then((res)=>{
          if(res.code === 0){
            if(JSON.stringify( res.data)==="{}"){
              this.data = []
            }else{
              this.data = res.data
            }
            this.listLoading = false
            this.page = res.pages
          }else{
            this.listLoading = false
            this.$notification.error({
              message: '提示',
              description: res.msg,
            });
          }
        })
      },
      pagechange(page,pagesize){
        this.current = page
        this.getMonitorList(this.page.pageSize)
      },
      onShowSizeChange(current, pageSize) {
        this.getMonitorList(pageSize)
      },
      addMonitor(){
        this.monitorVisible = true
        this.getProductLists(10)
      },
      monitorOk(){},
      monitorCancel(){
        this.monitorVisible = false
        this.shopId = ''
        this.countryId = ''
        this.countryList = []
        this.addStatus = 'all'
        this.keywords = ''
        this.getMonitorList(this.page.pageSize)
      },
      toShop(val){
        this.shopId = val
        if(val){
          this.storeSelect.forEach((item,index)=>{
            if(val === item.id){
              this.countryList = item.mws_site
            }
          })
        }else{
          this.countryList = []
          this.countryId = ''
        }
      },
      TOcountry(val){
        this.countryId = val
      },
      searchGood(){
        this.getProductLists(this.page1.pageSize)
      },
      resetSearch(){
        this.shopId = ''
        this.countryId = ''
        this.countryList = []
        this.addStatus = 'all'
        this.keywords = ''
      },
      isAddChange(val,obj){
        obj.is_add = val?'1':'0'
        addMonitorProduct({
          ids:obj.id,
        }).then((res)=>{
          if(res.code === 0){
            this.$notification.success({
              message: '提示',
              description: res.msg,
            });
          }else{
            this.$notification.error({
              message: '提示',
              description: res.msg,
            });
          }
        })
      },
      getProductLists(pagesize){
        this.listLoading1 = true
        getProductList({
          page:this.current1,
          page_size:pagesize,
          store_id:this.shopId,
          country:this.countryId,
          keywords:this.keywords,
          is_add: this.addStatus
        }).then((res)=>{
          if(res.code === 0){
            if(JSON.stringify( res.data)==="{}"){
              this.goodList = []
            }else{
              this.goodList = res.data
            }
            this.listLoading1 = false
            this.page1 = res.pages
          }else{
            this.listLoading1 = false
            this.$notification.error({
              message: '提示',
              description: res.msg,
            });
          }
        })
      },
      pagechange1(page,pagesize){
        this.current1 = page
        this.getProductLists(this.page1.pageSize)
      },
      onShowSizeChange1(current, pageSize) {
        this.getProductLists(pageSize)
      },
      lookManitor(id){
        this.monitorVisibles = true
        this.monitorId = id
        this.getFollowLogs(10)
      },
      lookCancel(){
        this.monitorVisibles = false
      },
      pagechange2(page,pagesize){
        this.current2 = page
        this.getFollowLogs(this.page2.pageSize)
      },
      onShowSizeChange2(current, pageSize) {
        this.getFollowLogs(pageSize)
      },
      statusChange(e) {
        this.addStatus = e.target.value
      },
      getFollowLogs(pagesize){
        this.listLoading2 = true
        getFollowLog({
          page:this.current2,
          page_size:pagesize,
          id:this.monitorId,
        }).then((res)=>{
          if(res.code === 0){
            if(JSON.stringify( res.data)==="{}"){
              this.monitorInfo = []
            }else{
              this.monitorInfo = res.data
            }
            this.listLoading2 = false
            this.page2 = res.pages
          }else{
            this.listLoading2 = false
            this.$notification.error({
              message: '提示',
              description: res.msg,
            });
          }
        })
      },
      //展开请求二级数据
      async openShow(expanded, { id }){
        const { code, data, msg } = await getFollowHistory({ id })
        if (code === 0) {
          this.monitorInfo = this.monitorInfo.map(item => ({
            ...item,
            children1: item.id === id ? data : item.children1
          }))
        } else {
          this.$notification.error({ message: '提醒', description: msg })
        }
      },
      delManitor(id){
        delMonitorProduct({
          ids:id,
        }).then((res)=>{
          if(res.code === 0){
            this.getMonitorList(this.page.pageSize)
            this.$notification.success({
              message: '提示',
              description: res.msg,
            });
          }else{
            this.$notification.error({
              message: '提示',
              description: res.msg,
            });
          }
        })
      },
    },
    created(){
      this.getMyStores()
      this.getMonitorList(10)
    },
    mounted(){},
    updated(){},
    destroyed(){},
    filters:{
      priceTlt(val){
        return '￥' + val
      }
    },

  }
</script>
<style lang="less" scpoed>
  .ml{margin-left:10px;}
  .tar{text-align: right;}
  .mr-sm{margin-right: 5px;}
  .list-link{
    color: #1890ff;

  }
  .cur{cursor:pointer;}
  .text-min{
    width:250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dis-flex{
    display:flex;
  }
  .flex-wrap{
    flex-wrap: wrap;
  }
  .highlight{
    color: #1890ff;
    font-weight: 800;
  }
 .default{
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
 } 
</style>