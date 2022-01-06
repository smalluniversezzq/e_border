<template>
  <div class="page-header-index-wide">
    <a-row >
      <a-col span='24' class='left-box'>
        <a-row >
          <a-col class='card-box' :sm="24" :md="24" :xl="24" :style="{ marginBottom: '10px' ,background:'#fff' }">
            <a-row style="margin-bottom:20px">
              <a-col>
                平台:
                <a-button class="platform_icon" style="margin-left:10px;" @click="selectPlatform(1)">
                  <img
                    style="width:90px; margin-left:-5px;margin-top:-5px"
                    :src="platformIcon1"
                    alt=""/>
                  <p v-show="platformSelect==1" class="platform_select">
                    <i class="platform_select1"></i>
                    <a-icon class="platform_select2" type="check"/>
                  </p>
                </a-button>
                <a-button class="platform_icon" style="margin-left:20px;" @click="selectPlatform(2)">
                  <img
                    style="width:90px; margin-left:-5px;margin-top:-5px"
                    :src="platformIcon2"
                    alt=""/>
                  <p v-show="platformSelect==2" class="platform_select">
                    <i class="platform_select1"></i>
                    <a-icon class="platform_select2" type="check"/>
                  </p>
                </a-button>
              </a-col>
            </a-row>
            <a-row>
              <a-col>
                <div  style='fontSize:24px'>费用统计</div>
              </a-col>
            </a-row>
            <a-row >
              <a-col  :sm="24" :md="24" :xl="12" class='mt-sm padding-lr-10' >
                <a-table 
                  :columns="columns" 
                  :dataSource="costList" 
                  bordered
                  :pagination='false' 
                  >
                  <template slot="name" slot-scope="text">
                    <a href="javascript:;">{{text}}</a>
                  </template>
                    <template slot ="rate" slot-scope="text">
                    <span>{{text + '%'}}</span>
                  </template>
                  <template slot="title" slot-scope="currentPageData">
                    <a-row>
                      <a-col span='6'>
                        <a-select placeholder='请选择用户' style="width: 180px" @change="handleStatisticsSelsectChange">
                          <a-select-option value="">全部</a-select-option>
                          <a-select-option v-for='(item,index) in userIdList' :value="item.uid">{{item.username}}</a-select-option>
                        </a-select>
                      </a-col>
                      <a-col span='18' class='tar'>
                        <a-radio-group v-model="FeeStatisticsTime" @change="getFeeStatisticsFn">
                          <a-radio-button value="day">昨日</a-radio-button>
                          <a-radio-button value="week">近7天</a-radio-button>
                          <a-radio-button value="month">近30天</a-radio-button>
                        </a-radio-group>
                      </a-col>
                    </a-row>
                  </template>
                  <template  slot="footer">
                    <span v-if='totalCost'>
                        总计费用：{{totalCost}}元
                    </span>
                  </template>
                </a-table>
              </a-col>
              <a-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
                <a-card :loading="loading" :bordered="false" :style="{ height: '420px' ,overflow:'hidden'}" >
                  <div>
                    <div class='sell-logo' v-show='showSell'>
                      <img :src="showSelllogo" alt="">
                    </div>
                    <div v-show='!showSell'>
                      <v-chart :force-fit="true" :height="405" :data='pieData'  :scale="pieScale" >
                        <v-tooltip :showTitle="false" dataKey="name*percent" />
                        <v-axis />
                        <v-legend dataKey="name"/>
                        <v-pie position="percent" color="name" :vStyle="pieStyle" :label="labelConfig"  />
                        <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                      </v-chart>
                    </div>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row :gutter="24" style='margin-top:10px; margin-bottom:10px' >
          <a-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24" style='height:570px'>
             <!-- title="销售额类别占比" -->
            <a-card :loading="loading" :bordered="false" :style="{ height: '570px' ,overflow:'hidden'}" >
              <a-row>
                <a-col span='6'>
                  <div style='fontSize:24px'>店铺销售分析</div>
                </a-col>
                <a-col  span='6'>
                  <a-button @click='moneyOrOrderSelectShop("money")'>
                    金额
                  </a-button>
                  <a-button @click='moneyOrOrderSelectShop("order")' class='ml-sm'>
                    订单量
                  </a-button>
                </a-col>
                <a-col  :span='12'  class='tar'>
                  <a-radio-group   v-model="shopSalesTime"  @change="getShopSaleAnalyzeFn()">
                    <a-radio-button value="week">近7天</a-radio-button>
                    <a-radio-button value="month">近30天</a-radio-button>
                    <a-radio-button value="quarter">近90天</a-radio-button>
                  </a-radio-group>
                </a-col>
              </a-row>
              <div >
                <div  class='mt-lg'>
                  <v-chart :force-fit="true" :height="405" :data='shopPieData' :scale="pieScale" >
                    <v-tooltip :showTitle="false" dataKey="title*percent" />
                    <v-axis />
                    <v-legend dataKey="title"/>
                    <v-pie position="percent" color="title" :vStyle="pieStyle" :label="shoplabelConfig"  />
                    <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                  </v-chart>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24" style='margin-left:0px ; height:570px'>
            <a-card :loading="loading" :bordered="false" :style="{  minHeight: '570px'  }">
              <div class="salesCard">
                <a-row style='padding-left:0px;'> 
                  <a-col span='6'>
                     <div class='titleSales' style='fontSize:24px'>员工销售排行</div>
                  </a-col>
                  <a-col  span='6'>
                    <a-button @click='moneyOrOrderSelectStaff("money")'>
                      金额
                    </a-button>
                    <a-button @click='moneyOrOrderSelectStaff("order")' class='ml-sm'>
                      订单量
                    </a-button>
                  </a-col>
                  <a-col  span='12' class='tar'>
                    <a-radio-group v-model="staffTime"  @change="getStaffSaleRankFn()">
                      <a-radio-button value="week">近7天</a-radio-button>
                      <a-radio-button value="month">近30天</a-radio-button>
                      <a-radio-button value="quarter">近90天</a-radio-button>
                    </a-radio-group>
                  </a-col>
                </a-row>
                <a-row > 
                  <!-- :rowSelection="rowSelection" -->
                  <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24" >
                    <a-table  
                      :pagination="false"   
                      :dataSource='staffList'
                      :loading = "listLoading">
                      <a-table-column
                        title="排名"
                        dataIndex="sort_id"
                        width="100px"
                      >
                      </a-table-column>
                      <a-table-column
                        title="名称"
                        dataIndex="username"
                        width="100px"
                      >
                      </a-table-column>
                      <a-table-column
                        title="交易金额"
                        width="100px"
                      >
                      <template slot-scope="text, record">
                        <div class='flex'>
                          <div class='mr'>{{record.money}}</div>
                          <span class='text-table'>上周期：{{record.last_money}}</span>
                          <div v-if='record.state == "0"' class='text-pic'>
                            <img :src="up_pic" alt="">
                          </div>
                          <div v-if='record.state == "1"' class='text-pic'>
                            <img :src="down_pic" alt="">
                          </div>
                          <div v-if='record.state == "2"' class='text-pic'>
                            <img :src="up_pic" alt="">
                          </div>
                          <!-- <div style='width:170px'>
                            <a-progress :percent="record.progress" size="small" />
                          </div> -->
                        </div>
                      </template>
                      </a-table-column>
                    </a-table>
                  </a-col>
                </a-row>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Vue from 'vue'
    // 获取某用户下的员工 getUserByUid 员工销售排名 getStaffSaleRank  店铺销售分析接口 getShopSaleAnalyze 费用统计 getFeeStatistics
import { getUserByUid,getStaffSaleRank,getShopSaleAnalyze,getFeeStatistics} from '@/api/reportfrom'
import { getCheckAuth } from '@/api/empower'
import moment from 'moment'
import { ChartCard, MiniArea, MiniBar, MiniProgress,  Bar, Trend, NumberInfo, MiniSmoothArea ,LineBar ,LaddersBar ,BasicDonut,Swipers} from '@/components'
import { mixinDevice } from '@/utils/mixin'
  const columns = [
    {
      title: '类型',
      dataIndex: 'name',
      // scopedSlots: { customRender: 'name' },
    },
    {
      title: '费用',
      className: '费用',
      dataIndex: 'money',
    },
    {
      title: '占比',
      dataIndex: 'rate',
       scopedSlots: { customRender: 'rate' },
    },
  ];
const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.2%'
}]
export default {
  name: 'statistics',
  mixins: [mixinDevice],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
    LineBar,
    LaddersBar,
    BasicDonut,
    Swipers,
  },
    computed:{
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.selectAll = selectedRows
          this.selectkey = selectedRowKeys
          this.selectedRowKeys = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  data () {
    return {
      pieScale,
      up_pic:require('@/assets/icons/up_picred.png'),
      down_pic:require('@/assets/icons/down_pcigreen.png'),
      listLoading:false,
      selectAll:"",
      selectkey:"",
      selectedRowKeys:"",
      costList:"",
      columns,
      showSelllogo:require('@/assets/image/showsell.png'),
      showSell:false,
      shopDate:"",
      shopPieData:"",

      treeData:"",
      labelConfig: ['percent', {
        formatter: (val, item) => {
          return item.point.name + ': ' + val;
        }
      }],
      shoplabelConfig: ['percent', {
        formatter: (val, item) => {
          return item.point.title + ': ' + val;
        }
      }],
      loading: true,
      // 搜索用户数
      pieData:"",
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },

      statisticsOne:"day",
      shopSalesTime:"week",
      selectValue:"",
      uid:"",
      FeeStatisticsTime:"day",
      userIdList:"",
      selectUid:"",
      totalCost:"",
      shopSelectValue:"",
      staffSelectValue:"",
      StaffSelectValue:"",
      staffTime:"week",
      staffList:"",
      platformIcon1:require("@/assets/image/platformIcon1.png"),
      platformIcon2:require("@/assets/image/platformIcon2.png"),
      platformSelect:1,
      platform:'amazon',
      platformStatus1:'',
      platformStatus2:'',
    }
  },
  methods:{
    // 费用统计
    getFeeStatisticsFn(){
      console.log('states')
      getFeeStatistics({
        id:this.selectUid,
        time:this.FeeStatisticsTime,
        platform:this.platform
      }).then((res)=>{
        if(res.code === 0){
          console.log(res.data,'datas')
          if(JSON.stringify(res.data)!=="{}"){
            this.costList = res.data.data_list;
            this.totalCost = res.data.total_cost;
          }else{
            this.costList = [];
            this.totalCost = '';
          }
          const DataSets = require('@antv/data-set')
          const dv = new DataSets.View().source(this.costList)
          dv.transform({
            type: 'percent',
            field: 'rate',
            dimension: 'name',
            as: 'percent'
          })
          this.pieData = dv.rows
        }else{

        }
      })
    },
    // 选择用户
    handleStatisticsSelsectChange(value){
      console.log(value,'value')
      this.selectUid = value;
      this.getFeeStatisticsFn()
    },
    // 获取某用户下的员工
    getUserByUidFn(){
      getUserByUid({
        id:this.uid,
        platform:this.platform
      }).then((res)=>{
        if(res.code === 0){
          this.userIdList = res.data
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          }); 
        }
      })
    },
    // 店铺销售分析
    getShopSaleAnalyzeFn(){
      getShopSaleAnalyze({
        type:this.shopSelectValue,
        date:this.shopSalesTime,
        platform:this.platform
      }).then((res)=>{
        if(res.code === 0){
          console.log(res.data,'shopdata')
          if(JSON.stringify(res.data)!=="{}"){
            this.shopDate = res.data
          }else{
            this.shopDate = []
          }
          const DataSets = require('@antv/data-set')
          const dv = new DataSets.View().source(this.shopDate)
          dv.transform({
            type: 'percent',
            field: 'rate',
            dimension: 'title',
            as: 'percent'
          })
          this.shopPieData = dv.rows
        }else{
        }
      })
    },
    //店铺销售分析 金额
    moneyOrOrderSelectShop(type){
      this.shopSelectValue = type
      this.getShopSaleAnalyzeFn()
    },
    // 员工销售排名
    getStaffSaleRankFn(){
      getStaffSaleRank({
        type:this.StaffSelectValue,
        date:this.staffTime,
        platform:this.platform
      }).then((res)=>{
        if(res.code === 0){
          if(JSON.stringify(res.data)!=="{}"){
            this.staffList = res.data
          }else{
            this.staffList = []
          }
        }else{}
      })
    },
    moneyOrOrderSelectStaff(type){
      this.StaffSelectValue = type
      this.getStaffSaleRankFn()
    },
    //选择平台
    selectPlatform(type){
      if(type==1){
        this.platformSelect = 1
        this.platform = 'amazon'
      }else if(type==2){
        this.platformSelect = 2
        this.platform = 'shopee'
      }
      this.getFeeStatisticsFn()
      this.getUserByUidFn()
      this.getStaffSaleRankFn()
      this.getShopSaleAnalyzeFn()
    },
    //获取用户是否开通亚马逊和虾皮
    async getCheckAuths(){
      const { code, data, msg } = await getCheckAuth()
      if (code === 0) {
        this.platformStatus1 = data.amazon
        this.platformStatus2 = data.shopee
        if(this.platformStatus1 == 1){
          this.platformSelect = 1
          this.platform = 'amazon'
        }else if(this.platformStatus1 == 2){
          this.platformSelect = 2
          this.platform = 'shopee'
        }else{
          this.platformSelect = 1
          this.platform = 'amazon'
        }
        this.getFeeStatisticsFn()
        this.getUserByUidFn()
        this.getStaffSaleRankFn()
        this.getShopSaleAnalyzeFn()
      } else {
        this.$notification.error({ message: '提醒', description: msg })
      }
    },
  },
  created () {
    this.uid = this.$store.state.user.uid
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  mounted () {
    this.getCheckAuths()
    // this.getFeeStatisticsFn()
    // this.getUserByUidFn()
    // this.getStaffSaleRankFn()
    // this.getShopSaleAnalyzeFn()
  },
}
</script>

<style lang="less" scoped>
  // .notice-list{
  //   // height: 250px;
  // }
  .scrolls{
    height: 700px;
    overflow-y:scroll;
  }
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;
      .extra-box {
        margin-left: 24px;
      }
    }
  }
  @media only screen and (min-width: 767px) and (max-width: 1200px) {
    .notice {
    margin-top: 200px;
    }
  }
  @media only screen and (max-width: 767px) {
    .notice {
    margin-top: 570px;
    }
  }
  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;

    &.desktop div[class^=ant-col]:last-child {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
    }
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
  .pos_r{
    position: relative;
  }
  .pos_a{
    position: absolute;
  }
  .box_h{
    width: 100%;
    // height: 100%;
    min-height:100px;
  }
  .pos_img{
    width: 100%;
    top: 0;
    left: 0;
  }
  .pos_title{
    width: 100%;
    text-align: center;
    top: 20%;
    left: 0;
    font-size: 22px;
    color: white;
  }
  .pos_num{
    width: 100%;
    text-align: center;
    top: 60%;
    left: 0;
    font-size: 32px;
    color: white;
  }
  .mt{
    margin-top: 10px;
  }
  .mb-sm{margin-bottom:5px;}
  .left-box{
    // background: #00aaee;
  }
  .right-box{
    padding-left: 20px;
    // background: #aaee00;
  }
  .notice{
    // margin-top: 20px;
    height: 80px;
  }
  .title-box{
    padding: 20px;
    width: 126px;
    height: 60px;
    img{
      width: 100%;
    }
  }
  .swiper-box{
    margin-top: 15px;
    height: 80px;
    overflow: hidden;
  } 
  .swiper-boxs{
    margin-top: 6px;
    height: 20px;
    overflow: hidden;
  }  
  .mb-sm{
    margin-bottom: 1px;
  }
  .more{
    width: 100%;
    text-align: right;
    margin: 15px 20px 0 0;
    padding-right: 20px;
  }
  .nowrap{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .logo{
    width: 28px;
    height: 28px;
    img{
      width:100%;
    }
  }
  .logos{
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border-radius: 50%;
    background: #ecedef;
  }
  .dis-flex{
    display: flex;
    flex-wrap: wrap;
    justify-content:  space-between;
  }
  .titleSales{
    width: 200px;
  }
  .sell-logo{
    height: 405px;
    img{
      width: 100%;
    }
  }
  .mt-sm{
    margin-top:10px;
  }
  .pd-left-12{
    padding-left: 12px;
  }
  .pd-right-12{
    padding-right: 12px;
  }
  .ml-sm{
    margin-left: 10px;
  }
  .flex{
    display: flex;
    flex-wrap: wrap;
  }
  .tar{
    text-align: right;
  }
  .padding-lr-10{
    padding:  0 12px 0 0;
  }
  .card-box{
    padding: 24px;
  }
  .text-table{
    color: #bababa;
  }
  .text-pic{
    width: 15px;
    height: 15px;
    margin-left: 5px;
    img{
      width: 100%;
    }
  }
  .text-pics{
    width: 30px;
    height: 30px;
    margin-left: 5px;
  }
  .mt-lg{
    margin-top: 20px;
  }
  .sell-logo{
    height: 405px;
    img{
      width: 100%;
    }
  }
  .center{
    text-align: center;
  }
</style>
<style lang="less">
.platform_icon{
  width:140px;
  overflow:hidden;
  height:49px;
  position:relative
}
.platform_select{
  position:absolute;
  width:140px;
  height:49px;
  top:0;
  left:0;
}
.platform_select1{
  width:0;
  height:0;
  border-width:0 0 25px 25px;
  border-style:solid;
  border-color:transparent transparent #1890ff;
  position:absolute;
  right:0;
  bottom:0
}
.platform_select2{
  color:#fff;
  position:absolute;
  right:2px;
  bottom:1px
}
.platform_noselect{
  position:absolute;
  width:140px;
  height:49px;
  line-height: 49px;
  background-color:#666;
  opacity:0.5;
  top:0;
  left:0;
  text-align: center;
}
.platform_noselect1{
  position:absolute;
  width:140px;
  height:49px;
  line-height: 49px;
  top:0;
  left:0;
  color: #fff;
  text-align: center;
}
</style>

