<template>
  <div class="page-header-index-wide">
    <a-row >
      <a-col span='18' class='left-box ov-hidden'>
        <a-row class='sale-bg'>
          <a-col>
            <div class="content-top flex wrap start">
              <span class="content-title ml">销售统计</span>
              <div class="ml">
                <a-radio-group v-model="time"  @change="handleChange">
                  <a-radio-button  value="week">
                    本周
                  </a-radio-button>
                  <a-radio-button value="month">
                    本月
                  </a-radio-button>
                  <a-radio-button value="year">
                    本年
                  </a-radio-button>
                </a-radio-group>
              </div>
              <div class="ml">
                <a-select default-value='all'  style="width: 180px" @change="shopChangle">
                  <a-select-option value="all" >
                    全部
                  </a-select-option>
                  <a-select-option :value="item.id" v-for="(item,index) in store" :key='index'>
                    {{item.title}}
                  </a-select-option>
                </a-select>
              </div>
              <div class="ml">
                <a-select default-value="amount" style="width: 180px" @change="orderChangle">
                  <a-select-option value="amount">
                    按订单金额
                  </a-select-option>
                  <a-select-option value="number">
                    按订单数量
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="content-center ">
              <a-checkbox-group @change="onCountryChange">
                <a-row type='flex'>
                  <a-col :span='4' class='mt' v-for="(item,index) in counterListAll" :key='index'>
                    <div :class='country_value.includes(item.code)? "mr check-box border-style-focus":"mr check-box  border-style-not"'>
                      <div  class='check-title flex wrap between'>
                        <div>{{item.name}}{{type==="amount"?"销售额":"销售量"}}</div>
                        <div class='country-color' :style='{background:item.color}'>
                        </div>
                      </div>
                      <div class="check-content flex wrap  start ">
                        <div class='pic-country' v-if='item.pic'>
                          <img :src="item.pic" alt="">
                        </div>
                        <div class='pic-country' v-else>
                        </div>
                        <div class='amount-money mt'>
                          {{item.number}}
                          <span class='company'>{{type==="amount"?"￥":"个"}}</span>
                        </div>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </div>
            <div class="content-viser relative">
              <a-spin v-show='loadingSpin'  class='absolute position'/>
              <diagram ref='diagram'  :echrartTitle="type==='amount'?'销售额（￥）':'销售量（个）'"></diagram>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col span='6' class='right-box scrolls' >
        <a-card>
          <p>
            <a style="margin-left:50px;display:inline-block;position:relative" @mouseover="mouseOver(1)" @mouseleave="mouseLeave(1)">
              <a-button class="platform_icon" @click="selectPlatform(1)">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="platformIcon1"
                  alt=""/>
                <p v-show="platformSelect==1&&platformAllNo" class="platform_select">
                  <i class="platform_select1"></i>
                  <a-icon class="platform_select2" type="check"/>
                </p>
              </a-button>
              <p class="platform_noselect" v-show="authorizeStatus1"></p>
              <p class="platform_noselect1" v-show="authorizeStatus1" @click="goAuthorize(1)">授权店铺</p>
            </a>
            <a style="display:inline-block;position:relative" @mouseover="mouseOver(2)" @mouseleave="mouseLeave(2)">
              <a-button class="platform_icon" @click="selectPlatform(2)">
                <img
                  style="width:90px; margin-left:-5px;margin-top:-5px"
                  :src="platformIcon2"
                  alt=""/>
                <p v-show="platformSelect==2&&platformAllNo" class="platform_select">
                  <i class="platform_select1"></i>
                  <a-icon class="platform_select2" type="check"/>
                </p>
              </a-button>
              <p class="platform_noselect" v-show="authorizeStatus2"></p>
              <p class="platform_noselect1" v-show="authorizeStatus2" @click="goAuthorize(2)">授权店铺</p>
            </a>
          </p>
          <p style="padding:0 110px">
            <img
              style="width:180px; margin-left:-5px;margin-top:-5px"
              :src="platformIcon1"
              v-show="platformSelect==1"/>
            <img
              style="width:180px; margin-left:-5px;margin-top:-5px"
              :src="platformIcon2"
              v-show="platformSelect==2"/>
          </p>
          <p style="text-align:center" v-show="platformSelect==1">亚马逊全球开店遍布北美、欧洲、日本、澳洲大海外站点</p>
          <p style="text-align:center" v-show="platformSelect==2">Shopee东南亚与台湾市场知名电商平台</p>
        </a-card>
        <!-- 待办事项 -->
         <a-card title='待办事项' class='card mt'>
              <a-row>
                <a-col span='24'>
                  <div class='card-box'>
                    <div class='card-title'>商品编辑</div>
                    <div>
                      <div class='card-content'>
                        <span class='span-txt'>
                          已编辑商品数
                        </span>
                        <span  class='spans'>
                          {{statistics.editCount}}
                        </span>
                      </div>
                      <div class='card-content'>
                        <span class='span-txt'>
                        未编辑商品数
                        </span>
                        <span class='spans'>
                          {{statistics.unEditCount}}
                        </span>
                      </div>
                    </div>
                  </div>
                </a-col>
                 <a-col span='24'>
                  <div class='card-box'>
                    <div class='card-title'>商品发布</div>
                    <div>
                      <div class='card-content'>
                        <span class='span-txt'>
                          等待发布商品数
                        </span>
                        <span  class='spans'>
                          {{statistics.waitCount}}
                        </span>
                      </div>
                      <div class='card-content'>
                        <span class='span-txt'>
                          发布成功商品数
                        </span>
                        <span class='spans'>
                          {{statistics.successCount}}
                        </span>
                      </div>
                    </div>
                  </div>
                </a-col>
                <a-col span='24'>
                  <div class=' card-box'>
                    <div class='card-title'>订单处理
                      <!-- <a-icon class='card-info' style='fontSize:18px;lineHeight:18px' type="question-circle" /> -->
                    </div>
                    <div>
                      <div class='card-content'>
                        <span class='span-txt'>
                          待处理订单数
                        </span>
                        <span  class='spans'>
                          {{statistics.unDealCount}}
                        </span>
                        </div>
                      <div class='card-content'>
                        <span class='span-txt'>
                        已处理订单数
                        </span>
                        <span class='spans'>
                          {{statistics.dealCount}}
                        </span>
                      </div>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </a-card>
        <!-- 系统公告 -->
        <a-card class='mt'>
          <a-row>
            <a-col span='4'>
              <div style="width:100%;height:60px">
                <img :src="notice" alt="" style="width:100%">
              </div>
            </a-col>
            <a-col span='20' style="padding-left:20px">
              <div>
                <a-row style="margin-bottom: 5px;" v-for="(item,index) in swiperList" :key='index' v-if="index<3">
                  <a-col span='12'>{{item.title}}!</a-col>
                  <a-col span='12'>{{item.created_at}}</a-col>
                </a-row>
              </div>
              <div class='more cursor' @click="toNews()">更多</div>
            </a-col>
          </a-row>
        </a-card>
        <a-card class='mt' title="销售产品排名">
          <a-row class='mb'>
            <a-col span='4'>排名</a-col>
            <a-col span='13'>商品标题</a-col>
            <a-col span='7'>销售次数</a-col>
          </a-row>
          <a-row class='mb-sm' v-for='(item,index) in goodsList' :key='index'>
            <!-- //tow -->
            <a-col v-if='index + 1 === 1' span='4'>
              <div class="logo">
                <img :src="one" alt="">
              </div>
            </a-col>
            <a-col v-else-if='index + 1 === 2' span='4'>
              <div class="logo">
                <img :src="tow" alt="">
              </div>
            </a-col>
            <a-col v-else-if='index + 1 === 3' span='4'>
              <div class="logo">
                <img :src="three" alt="">
              </div>
            </a-col>
            <a-col v-else span='4'>
              <div class="logos">
                {{index + 1}}
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
        <a-card class='mt' title="版本记录">
          <a-timeline  >
            <a-timeline-item v-for='(item,index) in noticeListData' :key='index' >
              <div class='flex flex-wrap justify'>
                <div>
                  {{item.version}}&nbsp;&nbsp;{{item.date}}
                </div>
                <div v-if="item.url">
                   <i  @click='jumpToVideo(item.url)' class='bg-pic'></i>
                </div>
                <div v-else>
                   <i  class='bg-pic-empty'></i>
                </div>
              </div>
            </a-timeline-item>
          </a-timeline>
          <div class='more cursor' @click="getversionLog()">{{versionLogText}}</div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Vue from 'vue'
//    系统公告 dashboardNotice 版本发布记录 versionLog 销售排行榜 saleProductRank
import {
  dashboardNotice ,
  versionLog ,
  saleProductRank ,
  saleDataChart ,
  dashboardStatistics,
  getStore,
  saleStatistics,
} from '@/api/home'
import { getCheckAuth } from '@/api/empower'
import {getLogisticsLog} from '@/api/rechange'
//getLogisticsLog
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import { ChartCard, MiniArea, MiniBar, MiniProgress, RankList, Bar, Trend, NumberInfo, MiniSmoothArea ,LineBar ,LaddersBar ,BasicDonut,Swipers} from '@/components'
import { mixinDevice } from '@/utils/mixin'
import Diagram from '@/components/viser/diagram'
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
    Diagram,
  },
  data () {
    return {
      showSelllogo:require('@/assets/image/showsell.png'),
      notice:require('@/assets/image/Notice.png'),
      one:require('@/assets/one.png'),
      tow:require('@/assets/tow.png'),
      three:require('@/assets/three.png'),
      treeData:"",
      swiperList:'',
      labelConfig: ['percent', {
        formatter: (val, item) => {
          return item.point.country_cn + ': ' + val;
        }
      }],
      noticeListData:"",
      goodsList:[],
      loading: true,
      postList:"",
      // 搜索用户数
      searchData,
      pieScale,
      swiperClone:"",
      swiperLists:"",
      tabColor1:true,
      tabColor2:false,
      tabColor3:false,
      tabColor4:false,
      // idZ:"27",
      platformIcon1:require("@/assets/image/platformIcon1.png"),
      platformIcon2:require("@/assets/image/platformIcon2.png"),
      pic1:require("@/assets/icons/pic1.png"),
      pic2:require("@/assets/icons/pic2.png"),
      pic3:require("@/assets/icons/pic3.png"),
      pic4:require("@/assets/icons/pic4.png"),
      platformSelect:1,
      platform:'amazon',
      authorizeShow1:false,
      authorizeShow2:false,
      platformStatus1:'',
      platformStatus2:'',
      shopeeScale:[
        {
          dataKey: 'total',
        },
        {
          dataKey: 'realDate',
        }
      ],
      authorizeStatus1:false,
      authorizeStatus2:false,
      platformAllNo:true,
      versionLogText:'更多',
      versionLogStatus:false,
      counterListAll:[
        {
          name:"德国",
          code:"DE",
          pic:require("@/assets/country/de.png"),
          type:true,
          color:"#2fc25b",
          number:"0",
        },
        {
          name:"西班牙",
          code:"ES",
          pic:require("@/assets/country/es.png"),
          type:true,
          color:"#1890ff",
          number:"0",

        },
        {
          name:"意大利",
          code:"IT",
          pic:require("@/assets/country/it.png"),
          type:true,
          color:"#facc14",
          number:"0",
        },
        {
          name:"荷兰",
          code:"NL",
          pic:require("@/assets/country/nl.png"),
          type:true,
          color:"#13c2c2",
          number:"0",
        },
        {
          name:"法国",
          code:"FR",
          pic:require("@/assets/country/fr.png"),
          type:true,
          color:"#ef5b9c",
          number:"0",
        },
        {
          name:"英国",
          code:"GB",
          pic:require("@/assets/country/gb.png"),
          type:true,
          color:"#8552a1",
          number:"0",
        },
        {
          name:"波兰",
          code:"PL",
          pic:require("@/assets/country/pl.png"),
          type:true,
          color:"#8552a1",
          number:"0",
        },
        {
          name:"瑞典",
          code:"SE",
          pic:require("@/assets/country/se.png"),
          type:true,
          color:"#006AA6",
          number:"0",
        },
        {
          name:"美国",
          code:"US",
          pic:require("@/assets/country/us.png"),
          type:true,
          color:"#ed1941",
          number:"0",
        },
        {
          name:"加拿大",
          code:"CA",
          pic:require("@/assets/country/ca.png"),
          type:true,
          color:"#009ad6",
          number:"0",
        },
        {
          name:"墨西哥",
          code:"MX",
          pic:require("@/assets/country/mx.png"),
          type:true,
          color:"#bed742",
          number:"0",
        },
        {
          name:"澳大利亚",
          code:"AU",
          pic:require("@/assets/country/au.png"),
          type:true,
          color:"#f391a9",
          number:"0",
        },
        {
          name:"日本",
          code:"JP",
          pic:require("@/assets/country/jp.png"),
          type:true,
          color:"#f8aba6",
          number:"0",
        },
        {
          name:"全部",
          code:"ALL",
          pic:'',
          type:true,
          color:"#130c0e",
          number:"0",
        },
      ],
      country_value:"",
      statistics:"",
      store:"",
      time:"week",
      store_id:"all",
      type:"amount",
      country_list:"",
      country_chart:"",
      loadingSpin:false,

    }
  },
  methods:{
    handleChange(e){
      this.time = e.target.value
      this.saleStatisticsFn()
    },
    shopChangle(value){
      this.store_id = value
      this.saleStatisticsFn()
    },
    orderChangle(value){
      this.type = value
      this.saleStatisticsFn()
    },
    onCountryChange(value){
      this.country_value = value
    },
    // 销售统计筛选
    saleStatisticsFn(){
      this.loadingSpin = true
      saleStatistics({
        platform:this.platform,
        store_id:this.store_id,
        date:this.time,
        type:this.type,
      }).then(res=>{
        if(res.code === 0){
          this.country_list = res.data.statistics
          this.country_chart = res.data.chart
          this.country_list.forEach((item,index)=>{
            this.counterListAll.forEach((im,ix)=>{
              if(item.country === im.code){
                im.number = item.number
                im.type = item.type=="1"?true:false
              }
            })
          })
          // country_chart 发给组件
          this.$refs.diagram.dataConversion(this.country_chart);
        }
        this.loadingSpin = false
      })
    },
    //鼠标移入
    mouseOver(num){
      if(num==1){
        if(this.authorizeShow1){
          this.authorizeStatus1 = true
        }
      }else{
        if(this.authorizeShow2){
          this.authorizeStatus2 = true
        }
      }
    },
    //鼠标移出
    mouseLeave(num){
      if(num==1){
        this.authorizeStatus1 = false
      }else{
        this.authorizeStatus2 = false
      }
    },
    // 邮费历史
    getLogisticsList(){
      getLogisticsLog({
        page:"1",
        page_size:"5"
      }).then((res)=>{
        if(res.code === 0){
          this.postList = res.data
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
    },
    //版本发布记录
    getversionLog() {
      this.versionLogStatus = !this.versionLogStatus
      let size
      if(this.versionLogStatus){
        size = 5
        this.versionLogText = '更多'
      }else{
        size = 1000
        this.versionLogText = '收起'
      }
      versionLog({
        page_size:size
      }).then( res => {
        if(res.code === 0){
          this.noticeListData =  res.data
        }
      })
    },
    //销售排行榜
    getsaleProductRank(){
      saleProductRank({
        platform:this.platform
      }).then( res => {
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
    //选择平台
    selectPlatform(type){
      if(type==1){
        this.platformSelect = 1
        this.platform = 'amazon'
        this.getdashboardNotice()//系统公告
        this.getversionLog()//版本发布记录
        this.getsaleProductRank()//销售排行榜
      }else if(type==2){
        this.platformSelect = 2
        this.platform = 'shopee'
        this.getdashboardNotice()//系统公告
        this.getversionLog()//版本发布记录
        this.getsaleProductRank()//销售排行榜
      }
    },
    //授权店铺
    goAuthorize(type){
      if(type==1){
        if(this.platformStatus1==0){
          this.$router.push({
            path:'/systemSetings/empower',
            query:{ status:1}
          })
        }
      }else if(type==2){
        if(this.platformStatus2==0){
          this.$notification.error({
            message: '提醒',
            description: '请联系客服开通平台权限',
          });
        }else{
          this.$router.push({
            path:'/systemSetings/empower',
            query:{ status:2}
          })
        }
      }
    },
    //获取用户是否开通亚马逊和虾皮
    async getCheckAuths(){
      const { code, data, msg } = await getCheckAuth()
      if (code === 0) {
        this.platformStatus1 = data.amazon
        this.platformStatus2 = data.shopee
        if(this.platformStatus1==0||this.platformStatus1==2){
          this.authorizeShow1 = true
        }
        if(this.platformStatus2==0||this.platformStatus2==2){
          this.authorizeShow2 = true
        }
        if(!this.authorizeShow1){
          this.platformSelect = 1
          this.platform = 'amazon'
          this.getdashboardNotice()//系统公告
          this.getversionLog()//版本发布记录
          this.getsaleProductRank()//销售排行榜
        }else if(!this.authorizeShow2){
          this.platformSelect = 2
          this.platform = 'shopee'
          this.getdashboardNotice()//系统公告
          this.getversionLog()//版本发布记录
          this.getsaleProductRank()//销售排行榜
        }else{
          this.platformSelect = 1
          this.platformAllNo = false
          this.platform = 'amazon'
          this.getdashboardNotice()//系统公告
          this.getversionLog()//版本发布记录
          this.getsaleProductRank()//销售排行榜
        }
      } else {
        this.$notification.error({ message: '提醒', description: msg })
      }
    },
    jumpToVideo(url){
      //视频跳转链接
      if(url){
        window.open(url,'_blank')
      }
    },
    //代办事项
    dashboardStatisticsFn(){
      dashboardStatistics({
        platform:this.platform
      }).then(res=>{
        if(res.code === 0){
          this.statistics = res.data
        }
      })
    },
    getStoreFn(){
      getStore({}).then(res=>{
        if(res.code === 0){
          this.store = res.data
        }
      })
    }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  mounted () {
    this.getCheckAuths()
    this.dashboardStatisticsFn()
    this.getStoreFn()
    //获取销售统计
    this.saleStatisticsFn()
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
    })
  },
  filters:{
    filtertime(val){
      return val.slice(0,10)
    }
  }
}
</script>
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
<style lang="less" scoped>
  .card-box{
    display: flex;
    flex-wrap: wrap;
  }
  .flex{
    display: flex;
  }
  .wrap{
    flex-wrap: wrap;
  }
  .between {
    justify-content: space-between;
  }
  .start{
    justify-content: start;
  }
  .sale-bg{
    background: #fff;
  }
  .content-top{
    height: 60px;
    line-height: 60px;
    .content-title{
      font-size:16px;
    }

  }
  .ov-hidden{
    overflow: hidden;
  }
  .mt-37{
    margin-top: 37px;
  }
  .center{
    justify-content: center;
  }
  .ico-box{
    span{
      line-height: 50px;
      margin-right: 10px
    }
  }
  .content-center{
    padding: 0 20px;
  }
  .check-box{
    height: 100px;
    border-radius: 5px;
    background: #f2f2f2;
    padding: 8px;
    overflow: hidden;
    .check-title{
      position: relative;
      div{
        // width: 100px;
      }
    }
    .check-content{
      margin-top: 25px;
      .pic-country{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        img{
          width: 100%;
        }
      }
      .amount-money{
        width: 50%;
        font-size: 18px;
        line-height: 8px;
        text-align: right;
      }
    }

  }
  .pic-box{
    width: 42px;
    margin-right: 10px;
    img{
      width: 100%;
    }
  }
  .card-title{
    margin-right: 20px;
    width: 100px;
    margin-bottom: 10px;
    font-size: 16px;
    .card-info{
      width: 12px;
      height: 12px;

    }
  }
  .card-content{
    margin-bottom: 10px;
    width: 200px;
    display: flex;
    flex-wrap: wrap;
    .span-txt{
      display: block;
      color: #707070;
      width:120px;
      margin-right:15px;
    }
    .spans{
      display: block;
      font-size: 16px;
      color: #1890ff;
      font-weight: 600;
      line-height: 24px;
    }
  }

  .scrolls{
    height: 750px;
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
.border-style-focus{
  border: 1px solid #1890ff;
}
.border-style-not{
  border: 1px solid #f2f2f2;
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
  .flex{
    display: flex;
  }
  .flex-wrap{
    flex-wrap: wrap;
  }
  .justify{
    justify-content: space-between;
  }
  .bg-pic{
    cursor:pointer;
    display: block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    background: url('../../assets/sprite/sprite.png') no-repeat -45px -8px;
  }
  .bg-pic-empty{
    cursor:pointer;
    display: block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    background: url('../../assets/sprite/sprite.png') no-repeat -79px -8px;
  }
  .content-viser{
    width: 100%;
    height: 450px;
    margin-top: 20px;
  }
  .country-color{
    position: absolute;
    width: 40px;
    height: 40px;
    background: red;
    right: -32px;
    top: -26px;
    transform:rotate(50deg);
  }
  .company{
    font-size: 12px;
  }
  .relative{
    position: relative;
  }
  .absolute{
    position: absolute;
  }
  .position{
    z-index: 999;
    top: 20%;
    left: 50%;
    margin-top:-12.5px;
    margin-left: -10px;
  }


</style>

