<template>
  <div class="page-header-index-wide">
    <a-row >
      <a-col span='18' class='left-box'>
          <a-row  :gutter="24" style='height:190px;'>
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
              <chart-card :loading="loading" title="商品数量(个)" :total="dataField.count | NumberFormat">
                <div>
                  <mini-area  :dataField='dataField.chart'/>
                </div>
                <template slot="footer">日访问量(个)<span> {{ dataField.group | NumberFormat }}</span></template>
              </chart-card>
            </a-col>
            <a-col  :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
              <chart-card :loading="loading" title="订单数量(个)" :total="orderData.count | NumberFormat">
                <div>
                  <mini-bar :orderData='orderData.chart'/>
                </div>
                <template slot="footer">订单国家(个) <span>{{orderData.group}}</span></template>
              </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
              <chart-card :loading="loading" title="待发货(个)" :total="productData.count | NumberFormat">
                  <div>
                    <line-bar :datatherr='productData.chart'/>
                  </div>
                  <template slot="footer">日访问量(个)<span> {{ productData.group | NumberFormat }}</span></template>
              </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '10px' }">
              <chart-card :loading="loading" title="发货中(个)" :total="unfilledData.count | NumberFormat">
                <div>
                  <line-bar :datatherr='unfilledData.chart'/>
                </div>
                <template slot="footer">订单产品类别(个)<span> {{ unfilledData.group | NumberFormat }}</span></template>
              </chart-card>
            </a-col>
        </a-row>
        <!-- 系统公告 -->
        <a-row class='notice' style='background:#fff'>
            <a-col span='4' style='height:80px;'>
              <div class='title-box'>
                <img :src="notice" alt="">
              </div>
            </a-col>
            <a-col span='16' style='height:80px; overflow:hidden;'>
              <div class="swiper-box">
                <swipers :swiperList="swiperList"/>
              </div>
       
            </a-col>
            <a-col span='4'>
              <div class='more cursor' @click="toNews()">更多</div>
            </a-col>
        </a-row>
        <a-row :gutter="24" style='margin-top:10px;' >
          <a-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
             <!-- title="销售额类别占比" -->
            <a-card :loading="loading" :bordered="false" :style="{ height: '420px' ,overflow:'hidden'}" >
              <div style='fontSize:24px'>销售国家统计</div>
              <div>
                <!-- <basic-donut sourceDatas="sourceDatas"/> -->
                <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                  <v-tooltip :showTitle="false" dataKey="country_cn*percent" />
                  <v-axis />
                  <v-legend dataKey="country_cn"/>
                  <v-pie position="percent" color="country_cn" :vStyle="pieStyle" :label="labelConfig"  />
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                </v-chart>
              </div>
            </a-card>
          </a-col>
          <a-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
            <a-card :loading="loading" :bordered="false" :style="{  height: '420px' ,overflow:'hidden' }">
              <div style='fontSize:24px'>销售额排行</div>
              <div class="salesCard">
                <div class="extra-wrapper" slot="tabBarExtraContent">
                  <div class="extra-item">
                    <!-- 1周 2月 3季度 4年 -->
                    <span class='extra-box' :style='tabColor1===true?"color:#1890ff":"color:#000"' @click='tabTime("1")'>本周</span>
                    <span  class='extra-box' :style='tabColor2===true?"color:#1890ff":"color:#000"' @click='tabTime("2")'>本月</span>
                    <span  class='extra-box' :style='tabColor3===true?"color:#1890ff":"color:#000"' @click='tabTime("3")'>本季</span>
                    <span class='extra-box' :style='tabColor4===true?"color:#1890ff":"color:#000"' @click='tabTime("4")'>本年</span>
                  </div>
                </div>
                <a-row>
                  <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                    <bar :data="barData" />
                  </a-col>
                </a-row>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
      <a-col span='6' class='right-box scrolls' >
        <a-card title="消费历史">
          <a-row v-for='(item,index) in postList' :key='index'>
            <a-col  span='18'>
              <div  class="nowrap cursor" @click='jumpTo()'>
              {{item.remark}}
              </div>
            </a-col>
            <a-col span='6'>{{item.created_at | filtertime}}</a-col>
          </a-row>
        </a-card>
        <a-card class='mt' title="销售产品排名">
          <a-row class='mb'>
            <a-col span='4'>排名</a-col>
            <a-col span='16'>商品标题</a-col>
            <a-col span='4'>销售次数</a-col>
          </a-row>
          <a-row class='mb-sm' v-for='(item,index) in goodsList' :key='index'> 
            <!-- //tow -->
            <a-col v-if='index+1 ===1' span='4'>
              <div class="logo">
                <img :src="one" alt="">
              </div>
            </a-col>
            <a-col v-else-if='index+1 ===2' span='4'>
              <div class="logo">
                <img :src="tow" alt="">
              </div>
            </a-col>
            <a-col v-else-if='index+1 ===3' span='4'>
              <div class="logo">
                <img :src="three" alt="">
              </div>
            </a-col>
            <a-col v-else span='4'>
              <div class="logos">
                {{index+1}}
              </div>
            </a-col>
            <a-col span='16' >
              <div class="nowrap cursor">
                {{item.title}}
              </div>
            </a-col>
            <a-col span='4'>
              <p class='ml'>
                {{item.count}}
              </p>
            </a-col>
          </a-row>
        </a-card>
        <a-card class='mt' title="版本历史">
        <a-timeline  >
          <a-timeline-item v-for='(item,index) in noticeListData' :key='index'>{{item.version}}&nbsp;&nbsp;{{item.date}}</a-timeline-item>
        </a-timeline>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
// dataField 据统计字段     // 饼图 countrySellData  系统公告 dashboardNotice 版本发布记录 versionLog 销售排行榜 saleProductRank
import { getDataField ,dataField , countrySellData , dashboardNotice , versionLog , saleProductRank ,saleDataChart} from '@/api/home'
import {getLogisticsLog} from '@/api/rechange'
//getLogisticsLog
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import moment from 'moment'
import { ChartCard, MiniArea, MiniBar, MiniProgress, RankList, Bar, Trend, NumberInfo, MiniSmoothArea ,LineBar ,LaddersBar ,BasicDonut,Swipers} from '@/components'
import { mixinDevice } from '@/utils/mixin'

// const barData = []

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}
const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0,
    max: 10
  }]

const searchTableColumns = [
  {
    dataIndex: 'index',
    title: '排名',
    width: 90
  },
  {
    dataIndex: 'keyword',
    title: '搜索关键词'
  },
  {
    dataIndex: 'count',
    title: '用户数'
  },
  {
    dataIndex: 'range',
    title: '周涨幅',
    align: 'right',
    sorter: (a, b) => a.range - b.range,
    scopedSlots: { customRender: 'range' }
  }
]
const searchData = []
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
}
const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%'
}]
export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
    LineBar,
    LaddersBar,
    BasicDonut,
    Swipers,
  },
  data () {
    return {
      // datatherr,
      swipers:[
        require('@/assets/image/one.png'),
        require('@/assets/image/tow.png'),
        require('@/assets/image/therr.png'),
      ],
      barData:'',
      notice:require('@/assets/image/Notice.png'),
      //@/assets/icons/bx-analyse.svg
      goods:require('@/assets/image/goods.png'),
      order:require('@/assets/image/order.png'),
      sendgoods:require('@/assets/image/sendgoods.png'),
      takegoods:require('@/assets/image/takegoods.png'),
      one:require('@/assets/one.png'),
      tow:require('@/assets/tow.png'),
      three:require('@/assets/three.png'),
      treeData:"",
      dataField:"",
      swiperList:'',
      labelConfig: ['percent', {
        formatter: (val, item) => {
          return item.point.country_cn + ': ' + val;
        }
      }],
      titleCol:{
        xs:{ span: 20, offset:2 } ,
        sm:{ span: 13, offset: 5 },
        md:{ span: 10, offset: 1 } ,
        lg:{ span: 9, offset: 2 },
        xl:{span:6,offset:0}
      },
      noticeListData:"",
      goodsList:[],
      loading: true,
      rankList,
      postList:"",
      // 搜索用户数
      searchUserData,
      searchUserScale,
      searchTableColumns,
      searchData,
      pieScale,
      pieData:"",
      datatherr :[
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 90 },
      ],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      dataField:"",
      orderData:"",
      productData:"",
      unfilledData:"",
      swiperClone:"",
      swiperLists:"",
      tabColor1:true,
      tabColor2:false,
      tabColor3:false,
      tabColor4:false,
    }
  },
  methods:{
    getDataField(){
      getDataField({}).then(res =>{
        if(res.code === 0){
          console.log(res.data)
          this.dataField = res.data
        }
      })
    },
    // 邮费历史
    getLogisticsList(){
      getLogisticsLog({
        page:"1",
        page_size:"5"
      }).then((res)=>{
        if(res.code===0){
          this.postList = res.data
        }
      })
    },
    // dataField 据统计字段     // 饼图 countrySellData  系统公告 dashboardNotice 版本发布记录 versionLog 销售排行榜 saleProductRank
    //据统计字段
    getDataFields(){
      getDataField({}).then(res =>{
        if(res.code === 0){
          console.log(res.data)
          // 商品数量 dataField  订单数量orderData 待发货(个)productData 发货中(个)unfilledData
          //  count 总数量 chart 图表数据 group 分类数据
          this.dataField = res.data.filledData
          this.orderData = res.data.orderData
          this.productData = res.data.productData
          this.unfilledData = res.data.unfilledData
          this.productData.chart.forEach((item,index)=>{
            item.key=item.key.slice(5)
          })
          console.log(this.productData,"over")
          this.unfilledData.chart.forEach((item,index)=>{
            item.key=item.key.slice(5)
          })
        }
      })
    },
    // 饼图
    getcountrySellData(){
      countrySellData({}).then(res =>{
        if(res.code === 0){
          const DataSet = require('@antv/data-set')
          const sourceData = res.data
          const dv = new DataSet.View().source(sourceData)
          dv.transform({
            type: 'percent',
            field: 'rate',
            dimension: 'country_cn',
            as: 'percent'
          })
          this.pieData = dv.rows
        }
      })
    },
    //系统公告
    getdashboardNotice(){
      dashboardNotice({}).then(res =>{
        if(res.code === 0){
          this.swiperList = res.data
        }
      })
    },
    
    tabTime(val){
      if(val === '1'){
        this.tabColor1 = true
        this.tabColor2 = false
        this.tabColor3 = false
        this.tabColor4 = false
      }else if(val === '2'){
        this.tabColor1 = false
        this.tabColor2 = true
        this.tabColor3 = false
        this.tabColor4 = false
      }else if(val === '3'){
        this.tabColor1 = false
        this.tabColor2 = false
        this.tabColor3 = true
        this.tabColor4 = false
      }else if(val === '4'){
        this.tabColor1 = false
        this.tabColor2 = false
        this.tabColor3 = false
        this.tabColor4 = true
      }
      this.getSaleDataChart(val)
    },
    //销售额
    getSaleDataChart(val){
      saleDataChart({
        type:val
      }).then(res=>{
        this.barData = []
        this.barData = res.data

        // for (let i = 0; i < 12; i += 1) {
        //   this.barData.push({
        //     date: `${i + 1}月`,
        //     week: Math.floor(Math.random() * 1000) + 200
        //   })
        // }
      })
    },
    //版本发布记录
    getversionLog(){
      versionLog({}).then(res =>{
        if(res.code === 0){
          this.noticeListData =  res.data
        }
      })
    },
    //销售排行榜
    getsaleProductRank(){
      saleProductRank({}).then(res =>{
        if(res.code === 0){
          this.goodsList = res.data
        }
      })
    },
    toNews(){
        this.$router.push({
        path:'/home/homes/news'
      })
    },
    jumpTo(){
      this.$router.push({
        path:'/rechange/fund'
      })
    },
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  mounted () {
    this.getDataFields()
    this.getLogisticsList()
    this.getcountrySellData()
    this.getdashboardNotice()
    this.getversionLog()
    this.getsaleProductRank()
    this.getSaleDataChart('1')
    var mySwiper = new Swiper('.swiper-container', {
      // autoplay:true,
      autoplay:{
        stopOnLastLide:true,
        disableOnInteraction: false,
      },
      direction:'vertical',
      loop:true,
      pagination:{
        el: '.swiper-pagination',
        clickable: true
      },
      // pagination : '.swiper-pagination',
      // paginationType : 'bullets',
      // paginationClickable :true,
      // paginationHide :false,
    })
  },
  filters:{
    filtertime(val){
      return val.slice(0,10)
    }
  }
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
</style>

