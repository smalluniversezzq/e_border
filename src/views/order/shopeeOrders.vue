<template>
  <div class="orderverify">
    <a-card
      :bordered="false"
      title='筛选'>
      <div class="table-page-search-wrapper">
        <a-row
          class='mt'
          type="flex"
          justify="start">
          <a-col
            class='title-size'
            :span='1'>
            店铺
          </a-col>
          <a-col
            :span='1.5'
            style="margin-right:20px">
            <a-button
              :type='shopId===""?"primary":"default"'
              size="small"
              @click='countryVal("")'
            >全部</a-button>
          </a-col>
          <a-col
            class='mb'
            :span='19'>
            <a-button
              class='mr'
              :type='shopId===item.id?"primary":"default"'
              v-for='(item,index) in shopList'
              :key="index"
              @click='countryVal(item.id)'
              size="small">
              {{item.title}}
            </a-button>
          </a-col>
        </a-row>
        <a-row
          class='mt'
          type="flex"
          justify="start">
          <a-col :span="1">
            <span>查询</span>
          </a-col>
          <a-col
            :md="11"
            :lg="7"
            :xl="6"
            :xxl="4">
            <a-input
              style="width:200px"
              v-model='searchValue'
              :placeholder="queryStatus"/>
          </a-col>
          <a-col
            :md="7"
            :lg="8"
            :xl="10"
            :xxl="13">
            <a-button class='ml' @click='toSearch'>筛选</a-button>
            <a-button class='ml' @click="() => (searchValue = '' )">重置</a-button>
          </a-col>
        </a-row>
      </div>
    </a-card>
    <a-card
      :bordered="false"
      class='mt'
      title="订单列表">
      <a-row>
        <a-col
          :md="20"
          :lg="20"
          :xl="20"
          :xxl='20'
          v-if='dataStatus'>
          <a-button-group>
            <a-button
              :type='screenType ==="" ? "primary":"default"'
              @click='screen("")'
            >全部</a-button>
            <a-button
              :type='screenType ==="0" ? "primary":"default"'
              @click='screen("0")'
            >待打单{{dataStatus.status_0?"("+dataStatus.status_0+")":""}}</a-button>
            <a-button
              :type='screenType ==="1" ? "primary":"default"'
              @click='screen("1")'
            >待发货{{dataStatus.status_1?"("+dataStatus.status_1+")":""}}</a-button>
            <a-button
              :type='screenType ==="2" ? "primary":"default"'
              @click='screen("2")'
            >已发货{{dataStatus.status_3?"("+dataStatus.status_3+")":""}}</a-button>
            <a-button
              :type='screenType ==="3" ? "primary":"default"'
              @click='screen("3")'
            >已完成{{dataStatus.status_4?"("+dataStatus.status_4+")":""}}</a-button>
          </a-button-group>
        </a-col>
        <a-col
          :md="{ offset: 2, span: 2 }"
          :lg="{ offset: 2, span: 2 }"
          :xl="{ offset: 2, span: 2 }"
          :xxl="{ offset: 2, span: 2 }">
          <a-row>
            <a-col  v-if='hasPerm(permsBtn.shopee_printing)' >
              <a-button v-if="screenType==='0'" @click="toPrintShow">
                打印
              </a-button>
            </a-col>
            <a-col  v-if='hasPerm(permsBtn.shopee_mark_complete)' >
              <a-button v-if="screenType==='2'" @click="markComplete">
                标记已完成
              </a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <!-- //列表 -->
      <a-row class='mt'>
        <a-table
          :scroll="{ x: 1400 }"
          :dataSource="data"
          :rowSelection="rowSelection"
          :pagination="false"
          :loading="listLoading"
          rowKey="id">
          <a-table-column
            title="订单编号"
            fixed="left"
            width="200px">
            <template slot-scope="text, record">
              <div v-if='record.color_mark'>
                <div v-if='record.color_mark.length>0'  class='flex flex-state'>
                  <div class='mr-sm'  v-for='(item,index) in record.color_mark' @click='tabSetingColor(record.id)' :key='index'>
                    <a-tooltip placement="top" >
                      <template slot="title">
                        <span>{{item.name}}</span>
                      </template>
                      <div :style='{backgroundColor:item.color,width: "20px",height: "20px",marginTop:"5px"}'></div>
                    </a-tooltip>
                  </div>
                </div>
                <div v-else @click='tabSetingColor(record.id)'>
                  <a-tooltip placement="top" >
                    <template slot="title">
                      <span>设置自定义标记</span>
                    </template>
                    <div :style='{backgroundColor:"#8a8a8a",width: "20px",height: "20px",marginTop:"5px"}'></div>
                  </a-tooltip>
                </div>
              </div>
              <div v-else @click='tabSetingColor(record.id)'>
                <a-tooltip placement="top" >
                  <template slot="title">
                    <span>设置自定义标记</span>
                  </template>
                   <div :style='{backgroundColor:"#8a8a8a",width: "20px",height: "20px",marginTop:"5px"}'></div>
                </a-tooltip>
              </div>
              <span>{{record.order_id}}
                <a-popover
                  v-show="record.image"
                  placement="rightTop">
                  <template
                    slot="content"
                    style="width:200px">
                    <img
                      style="width:200px"
                      :src="record.image"
                      alt="">
                  </template>
                  <a-button style="width:59px;position:relative;overflow:hidden;height:49px">
                    <img
                      style="width:58px; margin-left:-16px;margin-top:-2px"
                      :src="record.image"
                      alt="暂无订单信息"
                      @click="jumpToOrderUrl(record.ori_url)"/>
                  </a-button>
                </a-popover>
              </span>
            </template>
          </a-table-column>
          <a-table-column
            title="收件人"
            dataIndex="buyer_name">
          </a-table-column>
          <a-table-column
            title="商品数量"
            dataIndex="quantity">
          </a-table-column>
          <a-table-column
            title="订单金额">
            <template slot-scope="text, record">
              <p v-for='(item,index) in currencyListType' :key='index'>
                <span v-if='item.type === record.currency_code'>
                  {{record.amount + item.logo}}
                </span>
              </p>
            </template>
          </a-table-column>
          <a-table-column 
            title="国家">
            <template slot-scope="text, record">
              <p v-for='(item,index) in currencyList' :key='index'>
                <span v-if='item.id == record.country'>
                  {{item.title}}
                </span>
              </p>
              <span v-if='countrysCode.indexOf(record.country) < 0'>
                {{record.country}}
              </span>
            </template>
          </a-table-column>
          <a-table-column title="时间">
            <template slot-scope="text, record">
              <p>购买时间 {{record.purchase_date}}</p>
              <p>更新时间 {{record.last_update_date}}</p>
            </template>
          </a-table-column>
          <a-table-column
            title="操作人"
            dataIndex="username">
          </a-table-column>
          <!-- <a-table-column title="物流方式">
            <template slot-scope="text, record">
              <div>
                <a-row style="overflow:hidden">
                  <a-col style="float:left">
                    <div v-html="record.inland_info.replace(/\r?\n/g, '<br />')"></div>
                  </a-col>
                </a-row>
              </div>
            </template>
          </a-table-column> -->
          <a-table-column
            title="运单号"
            dataIndex="waybillcode">
            <template slot-scope='text, record'>
              <div>
                <div style="overflow:hidden" v-if="record.tracking_no">
                  <div style="width:90px;float:left">
                    国际物流单号:
                  </div>
                  <div style="float:left">
                    <p style="margin-bottom:5px">
                      {{record.tracking_no}}
                    </p>
                  </div>
                </div>
                <div style="overflow:hidden" v-if="record.inland_info">
                  <div style="width:90px;float:left">
                    备注单号:
                  </div>
                  <div style="float:left">
                    <p style="margin-bottom:5px">
                      {{record.inland_info}}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="状态"
            width='150px'
            dataIndex="order_status">
          </a-table-column>
          <a-table-column
            title="操作"
            width="260px">
            <template slot-scope="text, record">
              <span>
                <a-button  
                  :disabled='!hasPerm(permsBtn.shopee_order_details)'
                  class='mt-sm ml'
                  type="primary"
                  @click='details(record.id)'
                >订单详情</a-button>
                <a-button
                  :disabled='!hasPerm(permsBtn.shopee_note_no)'
                  v-if="screenType==='1'" 
                  class='mt-sm ml'
                  type="primary"
                  @click='addShopeeNotes(record.id)'
                >备注单号</a-button>
              </span>
            </template>
          </a-table-column>
        </a-table>
      </a-row>
      <a-row
        v-if='data'
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
    <a-modal
      width='800px'
      title="标签打印"
      v-if="printVisible"
      :visible="printVisible"
      :footer="null"
      :maskClosable="false"
      @ok="printHandleOk"
      @cancel="printHandleCancel">
      <a-button type='primary' icon="printer" @click="istoPrint">打印</a-button>
      <div style="padding:10px 0;">选择打印单</div>
      <a-table
        :dataSource="printData"
        :pagination="false"
        :rowSelection="rowSelectionOne"
        rowKey="id">
        <a-table-column
          title="物流渠道"
          dataIndex="shipping_carrier">
        </a-table-column>
        <a-table-column
          title="订单编号"
          dataIndex="order_id">
        </a-table-column>
        <a-table-column
          title="国际物流单号">
          <template slot-scope="text, record">
            <span v-if="record.tracking_no">{{record.tracking_no}}</span>
            <span style="color:#1890ff" v-if="!record.tracking_no" @click="getTrackingNo(record.id,record)">获取物流单号</span>
          </template>
        </a-table-column>
        <a-table-column
          title="状态">
          <template slot-scope="text, record">
            <span v-if="record.is_print===0">未打印</span>
            <span v-if="record.is_print===1">已打印</span>
          </template>
        </a-table-column>
      </a-table>
    </a-modal>
    <a-modal
      title="备注单号"
      :visible="noteVisible"
      @ok="noteOk"
      @cancel="noteCancel">
      <p>
        <a-input
          placeholder='请输入备注单号'
          v-model="noteValue"
          :style="{ display: 'inline-block', width: 'calc(60% )'}"/>
      </p>
    </a-modal>
    <a-modal
      title="确认打印"
      :footer="null"
      width="330px"
      :maskClosable="false"
      v-if="isPrintVisible"
      :visible="isPrintVisible"
      @cancel="isPrintCancel">
      <div style="text-align:center;">
        <p>
          <a-checkbox @change="onChange">是否标记为已打印</a-checkbox>
        </p>
        <a-button type='primary' icon="printer" @click="toPrint">确定</a-button>
      </div>
    </a-modal>
    <a-modal
      title="修改订单标记"
      :visible="TabColor"
      :confirm-loading="TabColorLoading"
      @ok="TabColorOk"
      @cancel="TabColorCancel"
      :width='750'
      :maskClosable = 'false'
      >
      <div>
        <a-table 
        :columns="columns" 
        :data-source="colorData" 
        :pagination='false' 
        bordered>
          <template
            v-for="col in ['name', 'color']"
            :slot="col"
            slot-scope="text, record, index"
          >
            <div v-if="col === 'name'" :key="col">
              <a-input
                v-if="record.editable"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChangeName(e.target.value, record.key, col,e)"
                placeholder='请输入描述信息'
              />
              <template v-else>
                <span v-if='text'>
                  {{ text }}
                </span>
                <span v-else>
                  {{'无描述'}}
                </span>
                
              </template>
            </div>
            <div v-if="col === 'color'" :key="col">
              <template >
                <div :style='{backgroundColor:text,width: "20px",height: "20px",marginTop:"5px"}'></div>
              </template>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => save(record.key)">保存</a>
                 &nbsp;&nbsp;
                <a @click="() => use(record.key)">{{record.type?"已使用":"使用"}}</a>
              </span>
              <span v-else>
                <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
                 &nbsp;&nbsp;
                <a @click="() => use(record.key)">{{record.type?"已使用":"使用"}}</a>
              </span>
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: '标记名称',
    dataIndex: 'name',
    width: '40%',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '颜色',
    dataIndex: 'color',
    width: '40%',
    scopedSlots: { customRender: 'color' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];
import Vue from 'vue'
import {
  oriOrderList,
  groupUpdate,
  orderCheck,
  getChannel,
  setChannel,
  getAllChannel,
  getLogisticsNo,
  deliver,
  warehouseAddress,
  getExpressInfo,
  getUserConfig,
  getInlandCode,
  orderMoveProcess,
  getMyShop,
  getShopeeOrder,
  getLogistics,
  printShopee,
  addShopeeNote,
  updateShopeeStatus,
  updateShopeeMark,
} from '@/api/order'
import { getMyStore ,getCountryList} from '@/api/collect'
import { logisInfo, currencyList ,currencyListType,countrysCode} from './public/country'
import { constants } from 'crypto'
import debounce from 'lodash/debounce'
import { type } from 'os'
import { permsBtn } from '@/utils/static'
import internationalView from './modules/international.vue'
import domesticView from './modules/domestic.vue'
import moment from 'moment'
import {deepClone , copyData} from '@/utils/util'
export default {
  name: 'orderverify',
  components:{
    internationalView,
    domesticView
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.selectAll = selectedRows
          this.selectkey = selectedRowKeys
          this.selectedRowKeys = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.amazon_ship == 1 && record.is_checked == "0", // Column configuration not to be checked
            name: record.name
          }
        })
      }
    },
    rowSelectionOne() {
      const { selectedRowKeysSon } = this
      return {
        selectedRowKeysSon,
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.selectAllOne = selectedRows
          this.selectkeyOne = selectedRowKeys
          this.selectedRowKeys = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.amazon_ship == 1 && record.is_checked == "0", // Column configuration not to be checked
            name: record.name
          }
        }),
        type:'radio'
      }
    }
  },
  data() {
    return {
      permsBtn,
      currencyList,
      currencyListType,
      countrysCode,
      shopList:[],
      shopId:'',
      current: 1,
      screenType: '',
      selectAll: '',
      selectedRowKeys: [],
      selectkey: '',
      searchValue:'',
      data: [],
      dataStatus:"",
      page: '',
      queryStatus: '请输入订单号或者sku',
      listLoading: false,
      queryInfo: '', // 请求状态
      printVisible:false,
      printData:[],
      noteVisible:false,
      noteValue:'',
      noteid:'',
      isPrintVisible:false,
      isPrintStatus:false,
      selectAllOne:'',
      selectkeyOne:'',
      plainOptions:['是否标记为已打印'],
      // 标记相关
      selectColor:[
        {
          color: "#61bd50",
          key: "0",
          name: "",
          type:false

        },
          {
          color: "#eed72e",
          key: "1",
          name: "",
          type:false
        },
          {
          color: "#f9ab4c",
          key: "2",
          name: "",
          type:false
        },
        {
          color: "#f56c6c",
          key: "3",
          name: "",
          type:false
        },
          {
          color: "#f56c6c",
          key: "4",
          name: "",
          type:false
        },
          {
          color: "#137abf",
          key: "5",
          name: "",
          type:false
        }
      ],
      cacheData:[
       {
          color: "#61bd50",
          key: "0",
          name: "",
          type:false

        },
          {
          color: "#eed72e",
          key: "1",
          name: "",
          type:false
        },
          {
          color: "#f9ab4c",
          key: "2",
          name: "",
          type:false
        },
        {
          color: "#f56c6c",
          key: "3",
          name: "",
          type:false
        },
          {
          color: "#f56c6c",
          key: "4",
          name: "",
          type:false
        },
          {
          color: "#137abf",
          key: "5",
          name: "",
          type:false
        }
      ],
      // 选择框的颜色
      colorData:[],
      colorSelectValue:'',
      TabColor:false,
      TabColorLoading:false,
      editingKey: '',
      columns,
    }
  },
  created() {
    // moment  时间处理库
    this.getTomorrow()
  },
  mounted() {
    this.getMyShops()
    if(this.$route.query.orderTab){
      // console.log(this.$route.query.orderTab,"orderTab")
      this.screenType = this.$route.query.orderTab?this.$route.query.orderTab:'';
      this.screen(this.screenType)
    }else{
      this.queryInfo = {
        page: this.current,
        page_size:10,
        status: this.screenType,
        store_id: this.shopId,
        keywords: this.searchValue,
      }
      this.getoriOrderList()
    }
  },
  updated() {},
  destroyed() {},
  methods: {
    moment,
    //获取店铺列表
    getMyShops() {
      getMyShop().then(res => {
        if (res.code === 0) {
          if(JSON.stringify(res.data)!=="{}"){
            this.shopList = res.data
          }
          // else{
          //   this.$notification.error({
          //     message: '错误',
          //     description: '暂无店铺'
          //   })
          // }
        }else{
          this.$notification.error({
            message: '失败',
            description: res.msg
          })
        }
      })
    },
    // 获取订单列表
    getoriOrderList() {
      this.listLoading = true
      getShopeeOrder(this.queryInfo).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          if (res.data) {
            if (res.data.data) {
              this.data = res.data.data
              this.page = res.pages
              this.dataStatus = res.data.countData
            } else {
              this.data = []
            }
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
    //搜索
    toSearch(){
      this.queryInfo = {
        page: this.current,
        page_size:10,
        status: this.screenType,
        store_id: this.shopId,
        keywords: this.searchValue,
      }
      this.getoriOrderList()
    },
    screen(status) {
      this.current = 1
      Vue.ls.set("orderTab",status);
      // 查询状态 筛选  通过id
      if (status === '') {
        this.screenType = ''
        this.queryInfo = {
          page: this.current,
          page_size:10,
          status: this.screenType,
          store_id: this.shopId,
          keywords: this.searchValue,
        }
        this.getoriOrderList()
      } else if (status === '0') {
        // 待审核
        this.screenType = '0'
        this.queryInfo = {
          page: this.current,
          page_size:10,
          status: this.screenType,
          store_id: this.shopId,
          keywords: this.searchValue,
        }
        this.getoriOrderList()
      } else if (status === '1') {
        // 待发货
        this.screenType = '1'
        this.queryInfo = {
          page: this.current,
          page_size:10,
          status: this.screenType,
          store_id: this.shopId,
          keywords: this.searchValue,
        }
        this.getoriOrderList()
      } else if (status === '2') {
        // 已发货
        this.screenType = '2'
        this.queryInfo = {
          page: this.current,
          page_size:10,
          status: this.screenType,
          store_id: this.shopId,
          keywords: this.searchValue,
        }
        this.getoriOrderList()
      } else if (status === '3') {
        // 已完成
        this.screenType = '3'
        this.queryInfo = {
          page: this.current,
          page_size:10,
          status: this.screenType,
          store_id: this.shopId,
          keywords: this.searchValue,
        }
        this.getoriOrderList()
      }
    },
    //打印
    toPrintShow(){
      if(this.selectAll.length>0){
        this.printData = this.deepCopy(this.selectAll)
        let num = 0
        this.printData.forEach((item,index)=>{
          this.getLogisticsData(item.id).then((res)=>{
            if(res){
              item.shipping_carrier = res.shipping_carrier
              item.is_print = res.is_print
              num++
              if(num == this.printData.length){
                this.printVisible = true
              }
            }
          })
        })
      }else{
        this.$notification.error({
          message: '提示',
          description: '请先勾选订单数据'
        })
      }
    },
    //获取物流渠道
    getLogisticsData(id){
      return getLogistics({id:id}).then(res => {
        if (res.code === 0) {
          return res.data[0]
        }else{
          this.$notification.error({
            message: '失败',
            description: res.msg
          })
        }
      })
    },
    //获取国际物流单号
    getTrackingNo(id,obj){
      getInternational({id:id}).then(res => {
        if (res.code === 0) {
          if (res.data) {
            obj.tracking_no = res.data
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    printHandleOk(){},
    printHandleCancel(){
      this.printVisible = false
      this.getoriOrderList()
    },
    //确认打印
    istoPrint(){
      if(this.selectAllOne.length>0){
        this.isPrintVisible = true
      }else{
        this.$notification.error({
          message: '提示',
          description: '请先勾选打印数据'
        })
      }
    },
    isPrintCancel(){
      this.isPrintVisible = false
      this.isPrintStatus = false
    },
    toPrint(){
      this.isPrintVisible = false
      if(this.isPrintStatus){
        this.printData.forEach((item,index)=>{
          console.log(this.selectAllOne)
          console.log(item.id)
          if(this.selectAllOne[0].id==item.id){
            item.is_print = 1
          }
        })
        this.isPrintStatus = false
      }
      // this.printData.reverse().reverse()
      printShopee({id:this.selectAllOne[0].id}).then(res=>{
        if (res.code === 0) {
          if (res.data) {
            window.open(res.data.airway_bill, '_blank')
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    noteOk(){
      addShopeeNote({
        id:this.noteid,
        order_sn:this.noteValue
      }).then(res=>{
        if (res.code === 0) {
          if (res.data) {
            this.noteVisible=false
            this.queryInfo = {
              page: this.current,
              page_size:10,
              status: this.screenType,
              store_id: this.shopId,
              keywords: this.searchValue,
            }
            this.getoriOrderList()
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    noteCancel(){
      this.noteValue = ''
      this.noteVisible=false
    },
    //备注单号
    addShopeeNotes(id){
      this.noteValue = ''
      this.noteid = id
      this.noteVisible=true
    },
    //标记完成
    markComplete(){
      if(this.selectAll.length>0){
        let ids = []
        this.selectAll.forEach((item,index)=>{
          ids.push(item.id)
        })
        updateShopeeStatus({ids:ids}).then(res=>{
          if (res.code === 0) {
            if (res.data) {
              this.screenType='3'
              this.queryInfo = {
                page: this.current,
                page_size:10,
                status: this.screenType,
                store_id: this.shopId,
                keywords: this.searchValue,
              }
              this.getoriOrderList()
              this.selectAll = []
            }
          } else {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }else{
        this.$notification.error({
          message: '提示',
          description: '请先勾选订单数据'
        })
      }
    },
    //进入详情页
    details(id) {
      this.$router.push({
        path: '/order/fictitious/shopeeOrderdetails',
        query: {
          id: id,
          // disableds:this.screenType === '4'?'0':"1"
        }
      })
    },
    pagechange(page, pagesize) {
      this.current = page
      this.getoriOrderList()
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
    onChange(e){
      this.isPrintStatus = e.target.checked
    },




    //新增订单
    addNewList(){
      this.$router.push({
        path:'/order/fictitious/addorder'
      })
    },
    //获取订单审核状态
    getOrderStatus(num){
      let orderDate = moment(num*1000).format('YYYY-MM-DD')
      let count = moment(orderDate,'YYYY-MM-DD').diff(moment(), 'day')
      return count
    },
    //获取订单审核时间
    getOrderDate(num){
      // let orderDate = moment(num*1000).format('YYYY-MM-DD')
      let orderDate = new Date(num*1000)
      let year = orderDate.getFullYear()
      let mounth = orderDate.getMonth()+1
      let day = orderDate.getDate()
      return year+'年'+mounth+'月'+day+'日'
    },
    // 获取国内物流渠道
    getInlandCodeFn(){
      getInlandCode({}).then((res)=>{
        if(res.code === 0){
          this.logisInfo = res.data
        }
      })
    },
    
    jumpToOrderUrl(url) {
      if (url) {
        window.open(url, '_blank')
      } else {
        console.log('跳转失败')
      }
    },
    
    //   筛选查询
    queryParamchange() {
      this.screen(this.orderTabstatus)
    },
    storeVal(id) {
      this.storeId = id
      if (id === 'all') {
        this.CountryList = this.mwsCountry
      }
      this.myStore.forEach((item, index) => {
        if (item.id === id) {
          this.CountryList = item.mws_site
        }
      })
    },
    countryVal(val) {
      this.shopId = val
    },
    
    onChangeSelect(value) {
      this.Selectvalue = value
      this.getwarehouseAddress(value)
    },
    handianchangge(e) {
      console.log(`checked = ${e.target.checked}`, typeof e.target.checked)
      this.checkedHandle = e.target.checked
      if (e.target.checked === true) {
        getChannel({
          country_code: this.CountryCode,
          type: 1 //1支持,
        }).then(res => {
          this.treeData = res.data
        })
      } else {
        getChannel({
          country_code: this.CountryCode
          // type: 0
        }).then(res => {
          this.treeData = res.data
        })
      }
    },
    //  获取物流地址
    getwarehouseAddress(value) {
      warehouseAddress({
        channel_code: value,
        id: this.orderid
      }).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.address = res.data.address
            this.logisticsPrice = res.data.freight
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    
    removal(array){
      var result = [];
        var obj = {};
        for(var i =0; i<array.length; i++){
            if(!obj[array[i].code]){
                result.push(array[i]);
                obj[array[i].code] = true;
            }
        }
      return result
    },
    //批量审核
    examineAll() {
      this.examineLoading =true
      if (this.selectAll.length > 0) {
        let str = ''
        for (var i = 0; i < this.selectAll.length; i++) {
          str += this.selectAll[i].id + ','
        }
        this.ids = str.slice(0, -1)
        orderCheck({
          ids: this.ids
        }).then(res => {
          if (res.code === 0) {
            this.selectedRowKeys = []
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.examineLoading = false
            this.screen('1')
          } else {
            this.examineLoading = false
            this.selectedRowKeys = []
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      } else {
        this.examineLoading = false
        this.$notification.error({
          message: '错误',
          description: '请先勾选审核的选项'
        })
      }
    },
    // 查询订单
    queryOrderList(code) {
      this.info = {
        keywords: code,
        page: this.current,
        status: 'all',
        is_checked: 'all'
      }
      this.allGetOrderList(this.info)
    },
    clearValue(){
      this.queryParam.logistics = "";
      this.storeId = 'all';
      this.countryId = 'all';
      this.CountryList = this.mwsCountry;
      this.channelValue = '';
      this.queryParam.orderNumber = '';
      this.company = '';
      this.logisticSelectShow = 0
      this.screen(this.orderTabstatus)
    },
    allGetOrderList(info) {
      oriOrderList(info).then(res => {
        if (res.code === 0) {
          if (res.data) {
            if (res.data.data) {
              this.data = res.data.data
              this.page = res.pages
              this.dataStatus = res.data.countData
            } else {
              this.data = []
            }
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    getAllChannels() {
      getUserConfig({
        page:1,
        page_size: 100,
        company:this.company
      }).then(res => {
        if (res.code === 0) {
          this.Channel = res.data.data
        }
      })
    },
    //新增订单
    jumpTo() {
      this.$router.push({
        path: '/order/orderverify/creatorder'
      })
    },
    //提交物流信息
    logisticfrom(CountryCode, id, logis, price, infos,battery_status,order_id,type,country_code,) {
      // this.value = undefined
      // this.Selectvalue = ''
      this.battery_status = battery_status
      this.logisticId = id;
      this.CountryCode = CountryCode
      this.orderID = order_id
      this.orderid = id
      this.CurrentLogistics = logis
      this.country_code_param = country_code
      this.orderWeight = infos.weight

      
      this.logisticsPrice = price
      if(type === 0){
        this.modals = true
        this.openInternationalState = '0'
        this.openDomesticState = '0'
      }else if(type === 1){
        this.openInternational()
        this.openInternationalState = '1'
      }else if(type === 2){
        this.openDomestic()
        this.openDomesticState = '2'
      }else if(type === 3){
        this.openDomestic()
        this.openDomesticState = '3'
      }
    },
    // 虚拟发货
    todeliver(id) {
      deliver({ id: id }).then(res => {
        if (res.code === 0) {
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
          this.getoriOrderList()
        }
        if (res.code === 1) {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    // 批量虚拟发货
    suball() {
      let str = ''
      for (var i = 0; i < this.selectAll.length; i++) {
        str += this.selectAll[i].id + ','
      }
      this.subVal = str.slice(0, -1)
      if (this.subVal) {
        deliver({ id: this.subVal }).then(res => {
          if (res.code === 0) {
            this.selectedRowKeys = []
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
          this.screen("2")
          } else {
            this.selectedRowKeys = []
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      } else {
        this.$notification.error({
          message: '错误',
          description: '请先勾选批量提交的单号'
        })
      }
    },

    
    // 物流搜索
    logisticsChange(value) {
      this.channelValue = value
    },
    //  获取运单号
    getcode(CountryCode, id, logis) {
      this.orderid = id
      this.CurrentLogistics = logis
      this.getcodeshow = true
      this.code = ''
    },
    EXCancel(e) {
      this.modals = false
      this.handianstate = false
      // 重置国内物流信息
      this.ifDomestic = false
      // 重置国内物流信息
      this.ifInternational = false
    },
    //打开国际单号
    openInternational(){
      this.showInternational = true;
      this.ifInternational = true
      this.modals = false;

    },
    // 关闭国际单号
    cancelInternational(){
      this.showInternational = false;
      this.ifInternational = false;
      this.getoriOrderList()
    },
    //从国际订单返回
    returnInternational(){
      this.showInternational = false;
      //this.ifInternational = false;
      this.modals = true;
    },
    // 打开国内单号
    openDomestic(){
      this.showDomestic = true;
      this.ifDomestic = true
      this.modals = false;
    },
    // 国内单号取消 
    cancelDomestic(){
      this.showDomestic = false;
      this.ifDomestic = false;
      this.getoriOrderList()
    },
    // 从国内单号返回
    returnDomestic(){
      this.showDomestic = false;
      // this.ifDomestic = false;
      this.modals = true;
    },
    TSOk() {
      this.$router.push({
        path:"/order/fictitious/orderdetails",
        query:{
          id:this.logisticId
        }
      })
      setTimeout(() => {
        this.modalTS = false
        this.TSLoading = false
      }, 1000)
    },
    TSCancel(e) {
      this.modalTS = false
    },

    //删除订单
    orderdel(id) {
      this.visible = true
      this.delId = id
    },
    handleOk() {
      //删除的操作
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 1000)
    },
    handleCancel(e) {
      this.visible = false
    },
    //
    handleChange(value) {
      this.name = value
    },
    getcodeOk() {
      this.getcodeLoading = true
      if (this.name.length <= 0) {
        this.$notification.error({
        message: '错误',
        description: "物流名称不能为空",
        });
        this.getcodeLoading = false
      }else if(this.code.length <= 0){
        this.$notification.error({
          message: '错误',
          description: '物流单号不能为空'
        })
        this.getcodeLoading = false
      } else {
        // this.code = this.code.replace(/\n/g,',')
        getLogisticsNo({
          id: this.orderid,
          inland_channel: this.name,
          inland_code: this.code
        }).then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: '成功',
              description: '物流修改成功'
            })
            this.screen("1") 
            //提交
            setTimeout(() => {
              this.getcodeshow = false
              this.getcodeLoading = false
            }, 500)
          } else {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            this.getcodeLoading = false
          }
        })
      }
    },
    getcodeCancel() {
      this.getcodeshow = false
    },
    // 鼠标防抖
    debounce(fn, delay) {
      var delay = delay || 200
      var timer
      return function() {
        var th = this
        var args = arguments
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(function() {
          timer = null
          fn.apply(th, args)
        }, delay)
      }
    },

    getInfo: debounce(function(ids, types,code) {
      // 存放每条数据对应的id值
      if (this.orderIds != ids || this.types != types) {
        if (types == 1) {
          getExpressInfo({
            id: ids,
            type: types,
            logistics_code:code
          }).then(res => {
            if (res.code === 0) {
              this.RemarksInfo = res.data
            }
            this.orderIds = ids
            this.types = types
          })
        }
        if (types == 2) {
          getExpressInfo({
            id: ids,
            type: types,
            logistics_code:code
          }).then(res => {
            if (res.code === 0) {
              this.ExpressInfo = res.data
            }
            this.orderIds = ids
            this.types = types
          })
        }
      } else {
      }
    }, 200),
    // 获取明天时间
    getTomorrow(){
       var day = new Date();
       day.setTime(day.getTime()+24*60*60*1000);
       var Tomorrow  = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
       return Tomorrow
    },
    toAudited(id){
      console.log(id)
      orderMoveProcess({
        id:id
      }).then((res)=>{
        if(res.code === 0){
            this.$notification.success({
            message: '成功',
            description: res.msg
          })
          this.getoriOrderList()
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //选择物流公司
    selectLogistics(type){
      if(this.logisticSelectShow == type){
        this.logisticSelectShow = 0
        this.company = ''
      }else{
        if(type==1){
          this.logisticSelectShow = 1
          this.company = 'fpx'
        }else if(type==2){
          this.logisticSelectShow = 2
          this.company = 'yw'
        }else if(type==3){
          this.logisticSelectShow = 3
          this.company = 'sf'
        }
        this.queryParam.logistics = ''
        this.getAllChannels()
      }
    },
    //标记
    tabSetingColor(id){
      this.selectColor = [
        {
          color: "#61bd50",
          key: "0",
          name: "",
          type:false

        },
          {
          color: "#eed72e",
          key: "1",
          name: "",
          type:false
        },
          {
          color: "#f9ab4c",
          key: "2",
          name: "",
          type:false
        },
        {
          color: "#f56c6c",
          key: "3",
          name: "",
          type:false
        },
          {
          color: "#f56c6c",
          key: "4",
          name: "",
          type:false
        },
          {
          color: "#137abf",
          key: "5",
          name: "",
          type:false
        }
      ],
      this.EditSignId=id
      console.log(this.data,'dataover','id:',id)
      this.data.forEach((item,index)=>{
        if(item.id === id){
          if(item.color_mark){
            this.selectColor.forEach((it,ix)=>{
              item.color_mark.forEach((im,inx)=>{
                if(it.key === im.key){
                  console.log(it,im,'over1')
                  it.type = im.type
                  it.name = im.name
                }
              })
            })
          }
          console.log(item.id,id,'over')
          console.log('over2',this.selectColor)
        }
      })
      this.colorData = deepClone(this.selectColor)
      console.log(this.colorData,this.selectColor,'selectColor')
      this.TabColor = true
    },
    TabColorOk(){
      console.log(this.colorData)
      let color_mark = []
      this.colorData.forEach((item,index)=>{
        if(item.type){
          color_mark.push(item)
        }
      })
      this.selectColor = deepClone(this.colorData)
      this.updateShopeeMarkFn(this.EditSignId,color_mark)


    },
    //请求保存当前的标记
    updateShopeeMarkFn(id,color_mark){
      updateShopeeMark({
        id:id,
        color_mark:color_mark
      }).then(res=>{
        if(res.code === 0){
          this.getoriOrderList()
          this.TabColor = false
          this.editingKey = ''
        }
      })
    },
    TabColorCancel(){
      this.TabColor = false
      this.editingKey = ''
    },
    edit(key) {
      const newData = [...this.colorData];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.colorData = newData;
      }
    },
    use(key){
      const newData = [...this.colorData];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target.type = !target.type
      }
      console.log(target,'target')
      this.selectColor = newData
      this.colorData = deepClone(this.selectColor)
    },
    save(key) {
      const newData = [...this.colorData];
      const newCacheData = [...this.cacheData];
      const target = newData.filter(item => key === item.key)[0];
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.colorData = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = '';
    },
    handleChangeName(value, key, column,e) {
      console.log(value,key,column,'column',e)
      //正 0 name
      const newData = [...this.colorData];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.colorData = newData;
      }
    },
  },
  filters: {
    prices(val) {
      if (val === '0.00') {
        return ''
      } else {
        return '￥' + val
      }
    },
    logisticsPrices(vals) {
      if (vals === '0.00') {
        return '0.00元'
      } else {
        return vals + '元'
      }
    }
  }
}
</script>
<style scoped lang='less'>
.mt {
  margin-top: 20px;
}
.ml {
  margin-left: 20px;
}
.mr {
  margin-right: 20px;
}
.mt-sm {
  margin-top: 10px;
}
.mr-sm {
  margin-right: 5px;
}
.modal_box {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
}
.tac {
  text-align: center;
}
</style>
<style>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.15) !important;
}
.ant-select-tree li span.ant-select-tree-switcher,
.ant-select-tree li span.ant-select-tree-iconEle {
  width: 100px;
  text-align: right;
  position: absolute;
}
.ant-select-tree li span.ant-select-tree-switcher.ant-select-tree-switcher-noop {
  display: none;
}
.cursor{cursor:pointer;}
.cursor-not{cursor:not-allowed;}
.dis-flex{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.flex{
 display: flex;
 flex-wrap: wrap;
}
.flex-state{
  justify-content: flex-start;
}
.txt-red{
  color: red;
}
.logistics_icon{
  width:140px;
  overflow:hidden;
  height:49px;
  position:relative
}
.logistics_icon:hover .logistics_noselect{
  display: none;
}
.logistics_select{
  position:absolute;
  width:140px;
  height:49px;
  top:0;
  left:0;
}
.logistics_select1{
  width:0;
  height:0;
  border-width:0 0 25px 25px;
  border-style:solid;
  border-color:transparent transparent #1890ff;
  position:absolute;
  right:0;
  bottom:0
}
.logistics_select2{
  color:#fff;
  position:absolute;
  right:2px;
  bottom:1px
}
.logistics_noselect{
  position:absolute;
  width:140px;
  height:49px;
  background-color:#666;
  opacity:0.5;
  top:0;
  left:0;
}
</style>



