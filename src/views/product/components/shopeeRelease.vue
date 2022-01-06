<template>
  <div class="history">
    <a-row class='mb' v-show="condition==='0'||condition==='3'">
      <a-col :span='1'>
        <span>国家:</span>
      </a-col>
      <a-col
        :span='20'>
        <a-button
          :type='countryId===""?"primary":"default"'
          class='mr'
          size="small"
          @click='countryVal("")'>
          全部
        </a-button>
        <a-button
          class='mr'
          :type='countryId===item.code?"primary":"default"'
          v-for='(item,index) in ShopeeCountryList'
          :key="index"
          @click='countryVal(item.code)'
          size="small">
          {{item.title}}
        </a-button>
      </a-col>
    </a-row>
    <a-row class='mb' type="flex" justify="start" v-show="condition==='0'||condition==='3'">
      <a-col :span='2.5'>
        <a-input   placeholder="请输入搜索的产品名称" style="width:180px " v-model="searchName"></a-input>
      </a-col>
      <a-col :span='1.5'>
        <a-button class='ml' type='primary' @click="shopSearch()">搜索</a-button>
      </a-col>
      <a-col :span='1.5'>
        <a-button class='ml'  @click="() => (searchName = '' ) ">重置</a-button>
      </a-col>
    </a-row> 
    <a-row style="margin-bottom:20px">
      <a-col :md="5" :lg="8" :xl="6" :xxl="4" class=''>
        <a-select  placeholder='请选择店铺'  style="width:100%" @change="shopchangeHis" :allowClear=true>
          <a-select-option :value="item.id"  v-for='(item,index) in storeSelect' :key="index">{{item.title}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :md="5" :lg="8" :xl="6" :xxl="4" class='ml' v-show='showUploadBtn === true'>
        <a-select  placeholder='请选择物流'  style="width:100%" @change="classchangeHis" :allowClear=true mode="multiple">
          <!-- <a-select-option v-if='shopValueHis' :value="'all'" >全部</a-select-option> -->
          <a-select-option :value="item.id"  v-for='(item,index) in siteSelectHis' :key="index">{{item.logistic_name}}</a-select-option>
        </a-select>
      </a-col>
      <a-col  v-if='hasPerm(permsBtn.shopee_release_joinPublishing)'  :md="7" :lg="5" :xl="4" :xxl="2" v-show='showUploadBtn === true'>
        <a-button class='ml' type='primary' @click='UploadTO' :loading='Uploading' :disabled="countDisabledHis">一键发布</a-button>
      </a-col>
      <a-col   v-if='hasPerm(permsBtn.shopee_product_exportAll)'  style="float:right" :md="7" :lg="5" :xl="4" :xxl="2">
        <a-button type='primary'  v-show="condition==='0'" @click='batchExport'>批量导出</a-button>
      </a-col>
      <a-col style="float:right"  v-if='hasPerm(permsBtn.shopee_product_delAll)'  :md="7" :lg="5" :xl="4" :xxl="2">
        <a-button type='primary' v-show="condition==='0'||condition==='3'" @click='delReleasedAll'>批量删除</a-button>
      </a-col>
      <div v-show='setCountTimeHis >= 1' style="color:#f9a100;float:right;margin-left:10px">{{this.countDownTextHis}}</div>
    </a-row>
    <a-row>
      <a-col :md="12" :lg="10" :xl="8" :xxl="6">
        <a-button-group>
          <a-button :disabled='!hasPerm(permsBtn.shopee_history_all)'  :type='screenType ==="0" ? "primary":""'  @click='screen("0")'>待发布</a-button>
          <a-button  :disabled='!hasPerm(permsBtn.shopee_history_loding)'  :type='screenType ==="1" ? "primary":""' @click='screen("1")'>发布中</a-button>
          <a-button  :disabled='!hasPerm(permsBtn.shopee_history_success)' :type='screenType ==="2" ? "primary":""' @click='screen("2")'>已发布</a-button>
          <a-button :disabled='!hasPerm(permsBtn.shopee_history_error)' :type='screenType ==="3" ? "primary":""' @click='screen("3")'>发布失败</a-button>
        </a-button-group>
      </a-col>
    </a-row>
    <a-row class='mt'>
      <a-table 
        :scroll="{ x: 1700 }" 
        :loading="listLoading" 
        :dataSource="dataRecord" 
        :rowSelection="rowSelectionRelease" 
        :pagination="false" 
        rowKey="id">
        <a-table-column
          title="id"
          dataIndex="id"
          width="100px">
        </a-table-column>
        <a-table-column
          title="图片"
          width="100px">
          <template slot-scope="text, record">
            <a-popover v-show="record.image" placement="rightTop">
              <template slot="content" style="width:200px">
                <img style="width:200px" :src="record.image" alt="">
              </template>
              <a-button style="width:59px;position:relative;overflow:hidden;height:49px">
                <img
                  style="width:58px; margin-left:-16px;margin-top:-2px"
                  :src="record.image"
                  alt="暂无订单信息"/>
              </a-button>
            </a-popover>
          </template>
        </a-table-column>
        <a-table-column
          title="标题"
          dataIndex="title">
        </a-table-column>
        <a-table-column
          title="sku"
          dataIndex="sku">
        </a-table-column>
        <a-table-column
          title="价格"
          width="120px">
          <template  slot-scope="text, record">
            <span>{{"￥"}} {{record.ori_price}}</span>
          </template>
        </a-table-column>
        <a-table-column
            title="国家"
            width="150px"
            v-if="showUploadBtn">
            <template slot-scope="text, record">
              <!-- <div v-if="condition==='0'" v-for='(value, key, index) in record.station' :key='index'>
                {{ key ? "(" + codeORcountry[key] + ")" : '' }}
                <span v-if='value == "0"'>未发布</span>
                <span v-if='value == "1"'>已发布</span>
                <span v-if='value == "2"'>不可发布</span>
              </div> -->
              <div>
                {{ codeORcountry[record.station] }}
              </div>
            </template>
        </a-table-column>
        <a-table-column
          v-if="!showUploadBtn"
          title="物流">
          <template slot-scope="text, record">
            <span v-for='(value, index) in record.logistics' :key='index'>
              <span v-for='(val, key, idx) in value' :key='idx'>
                {{ val }}
              </span>
            </span>
          </template>
        </a-table-column>
        <a-table-column
          v-if="!showUploadBtn"
          title="店铺"
          dataIndex="store_title">
        </a-table-column>
        <a-table-column
          title="时间">
          <template  slot-scope="text, record">
            <p>创建时间:{{record.created_at}}</p>
            <p>更新时间:{{record.updated_at}}</p>
          </template>
        </a-table-column>
        <a-table-column
          title="操作"
          width="220px">
          <template slot-scope="text, record">
            <span>
              <a-row>
                <a-col  :span="12">
                  <a-button  type='primary' :disabled='!hasPerm(permsBtn.shopee_release_edit)' v-if='screenType ==="3" || screenType ==="0"'  style="margin-left:10px"   @click='Edits(record.id,"shopee")' >编辑</a-button>
                </a-col>
                <a-col  :span="12">
                  <a-button  type='danger' :disabled='!hasPerm(permsBtn.shopee_release_del)'  v-if='screenType ==="3" || screenType ==="0"' style="margin-left:10px;" @click='delReleased(record.id)'>删除</a-button>
                </a-col>
              </a-row>
            </span>
          </template>
        </a-table-column>
      </a-table>
    </a-row>
    <a-row v-if='dataRecord' class='mt' type="flex" justify="end">
      <a-col>
        <a-pagination
        :pageSizeOptions="pageSizeOption"
        showSizeChanger
        v-model="currentRE" 
        @change='pagechangeRE' 
        :pageSize='pageRE.pageSize' 
        :total='(pageRE.pageSize*pageRE.lastPage)' />
      </a-col>
    </a-row>
    <a-modal
      title="提示"
      :visible="uploadshow"
      @ok="uploadOk"
      :confirmLoading="uploadLoading"
      @cancel="uploadCancel">
      <p>{{uploadText}}</p>
    </a-modal>
    <a-modal
      title="导出选项"
      :visible="modals"
      @ok="exportOk"
      :confirmLoading="modalsLoading"
      @cancel="handleCancelExport">
       确定导出商品
    </a-modal>
    <a-modal
      title="删除"
      :visible="visibles"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel">
      <p>{{ModalText}}</p>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue';
import { country_list, shopeeProductIndex, exportList, publishList ,deletePublish , 
          uploadPublisGoods , uploadResult ,getMyStore ,uploadPublish,countDown,ExportCheck,
          getShopeeStoreList, getShopeeLogistics, getShopeePublishList, shopeePublish, shopeeBatchExport, shopeePublishDeleted} from '@/api/collect'
import { codeORcountry , codeORcountrys, currencyList} from '@/views/order/public/country'
import { constants } from 'crypto';
import { CountDown } from '@/components';
import { permsBtn } from '@/utils/static'
import { ACCESS_TOKEN} from '@/store/mutation-types'
export default {
  name:"released",
  data(){
    return{
      permsBtn,
      codeORcountry,
      codeORcountrys,
      currencyList,
      queryParam:{
        status:"0",
        logistics:"0",
        orderNumber:"",
      },
      pageSizeOption:[10,20,40,60,80,100,200],
      queryStatus:"请输入订单号",
      ScreeningOrder:"0",
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 8 } },
      labelCols: { lg: { span: 6 }, sm: { span: 6 } },
      wrapperCols: { lg: { span: 15 }, sm: { span: 13 } },
      visibles:false,
      uploadshow:false,
      exportshow:false,
      ModalText:"确定要删除吗",
      uploadText:"您即将提交上传商品，十分钟后可以再次提交上传",
      confirmLoading:false,
      uploadLoading:false,
      listLoading: false,
      treeData:"",
      Selectvalue:"",
      orderid:"",
      data:"",
      page:"",
      current:1,
      selectAll:"",
      queryState:false,
      SelectCountry:"",
      delId:"",
      selectkey:"",
      UploadId:"",
      dataRecord:[],
      pageRE:"",
      currentRE:1,
      queryState:false,
      selectAllHistory:"",
      selectkeyHistory:"",
      storeSelect:"",
      siteSelect:[],
      siteSelectTwo:"",
      shopValue:"",
      activeKey:"1",
      shopValueHis:"",
      siteSelectHis:"",
      SelectCountryHis:"",
      SelectCountryHisType:'',
      UploadIdHis:"",
      showUploadBtn:true,
      countryLogo:"",
      countryLogoHis:"￥",
      condition:"0",
      upType:"",
      selectedRowKeys:[],
      selectedRowKeysHis:[],
      screenType:"0",
      loading: false,
      publishObj:"",
      publishObjHistory:"",
      objClone:"",
      copyListHis:"",
      objCloneHis:"",
      copyList:"",
      upLoading:false,
      classValue: '',
      countDisabled: false,
      countDisabledHis: false,
      Exportloading: false,
      prefix:"",
      brand:"",
      ManageLoading: false,
      showWarning:false,
      countryArr: [],
      goods_id: '',
      modalsLoading: false,
      classValueType:"",
      setCountTime: '',
      setCountTimeHis: '',
      countDownText:'',
      countDownTextHis:'',
      countrySelect:"",
      Noexport:[],
      Noexports:"",
      modals:false,
      initialArr: [],
      EXcountryValue:false,
      allCountrysState:false,
      idManege:"",
      EXids:"",
      Uploading:false,
      // 虾皮
      ShopeeCountryList:[
        // {
        //   title:"泰国",
        //   code:"tg"
        // },
        {
          title:"马来西亚",
          code:"MY"
        },
        // {
        //   title:"印度尼西亚",
        //   code:"yd"
        // },
        // {
        //   title:"越南",
        //   code:"yn"
        // },
        // {
        //   title:"新加坡",
        //   code:"SG"
        // },
        // {
        //   title:"菲律宾",
        //   code:"flb"
        // },
        // {
        //   title:"中国台湾地区",
        //   code:"cn"
        // },
      ],
      countryId:'',
      searchName:"",
      shopSearchInfo:"",
      currentManege:1,
    }
  },
  computed: {
    rowSelectionRelease() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRowes) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, '产品发布: ', selectedRowes);
          this.selectAll = selectedRowes;
          this.selectkey = selectedRowKeys;
          this.selectedRowKeys = selectedRowKeys; // 上传后勾选去掉
          console.log(this.selectedRowKeys);
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
          }
        }),
      }
    },
    rowSelectionHistory() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(selectedRowKeys,selectedRows,"---------------------")
          this.selectAllHistory = selectedRows
          this.selectkeyHistory = selectedRowKeys
          this.selectedRowKeys = selectedRowKeys
          console.log(`selectAllHistory: ${this.selectAllHistory}`, '发布历史: ', this.selectkeyHistory);
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
  created(){
      if(this.setCountTime > 0) {
      this.countDisabled = true
    } else if(this.setCountTime <= 0){
      this.countDisabled = false
    }else if(this.setCountTimeHis > 0) {
      this.countDisabledHis = true
    }else{
      this.countDisabledHis = false
    }
  },
  mounted(){
    this.getpublishList('10',this.shopValueHis,this.SelectCountryHis)
    this.getMyStores()
    this.screenType = "0"
    if(Vue.ls.get('countDesInfoShopValue',) && Vue.ls.get('countDesInfoShopValue').length > 0){
      console.log(Vue.ls.get('countDesInfoShopValue'), '8888')
      this.shopValue = Vue.ls.get('countDesInfoShopValue')
      this.classValueType = Vue.ls.get('countDesInfoClassValueType')
      this.getCountDown(Vue.ls.get('countDesInfoShopValue'),Vue.ls.get('countDesInfoClassValueType'))
    }if(Vue.ls.get('countDesInfoShopValueHis',) && Vue.ls.get('countDesInfoShopValueHis').length > 0){
      this.shopValueHis = Vue.ls.get('countDesInfoShopValueHis')
      this.SelectCountryHisType = Vue.ls.get('countDesInfoSelectCountryHisType')
      this.getCountDownHis(Vue.ls.get('countDesInfoShopValueHis'),Vue.ls.get('countDesInfoSelectCountryHisType'))
    }
  },
  updated(){},
  destroyed(){},
  methods:{
    // 虾皮
    countryVal(val){
      this.countryId = val
      //PSEE 虾皮国家国家筛选请求筛选
      this.shopSearch()
    },
    shopSearch(){
      this.getpublishList('10',this.shopValueHis,this.SelectCountryHis)
    },
    // 获取店铺信息
    getMyStores(){
      getShopeeStoreList().then((res)=>{
        if(res.code === 0){
          this.storeSelect = res.data
        }
      })
    },
    //选择店铺
    shopchangeHis(val){
      this.shopValueHis = val
      getShopeeLogistics({
        store_id: val
      }).then((res)=>{
        if(res.code === 0){
          this.siteSelectHis = res.data
          this.getpublishList('10',this.shopValueHis,this.SelectCountryHis)
        }
      })
    },
    //选择物流
    classchangeHis(value,option){
      this.selectedRowKeys = []
      this.selectAllHistory = []
      this.SelectCountryHis = value
      this.getpublishList('10',this.shopValueHis,this.SelectCountryHis)
      // this.currencyList.forEach((item,index) =>{
      //   if(item.id === this.SelectCountryHis){
      //     this.countryLogoHis = item.logo
      //   }
      // })
    },
    //切换状态
    screen(condition){
      this.searchName = ''
      this.condition = condition;
      if(condition === '0' || condition === '3'){
        this.showUploadBtn = true
      }else{
        this.showUploadBtn = false
      }
      if(condition ==='0'){
        this.screenType = '0'
      }else if(condition ==='1'){
        this.countryId = ''
        this.screenType = '1'
      }else if(condition ==='2'){
        this.countryId = ''
        this.screenType = '2'
      }else if(condition ==='3'){
        this.screenType = '3'
      }
      this.getpublishList('10',this.shopValueHis,this.SelectCountryHis)
    },
    // 获取订单列表
    getpublishList(pagesize,shop,country){
      this.listLoading = true
      getShopeePublishList({
        page_size:pagesize,
        page:this.currentRE,
        title:this.searchName,
        area:this.countryId,
        status:this.condition,
        store_id:this.shopValueHis
      }).then(res =>{
        if(res.code === 0){
          this.listLoading = false
          if(res.data.length){
            this.dataRecord = res.data;
          }else{
            this.dataRecord = [];
          }
          this.pageRE = res.pages
        }else{
          this.listLoading = false
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
    },
    //一键发布弹窗
    UploadTO(){
      if(this.shopValueHis){
        if(this.SelectCountryHis){
          if(this.selectAll.length>0){
            let str = '';
            for(var i = 0 ;i < this.selectAll.length ; i++){
              str += (this.selectAll[i].goods_id + ',')
            }
            this.UploadId = str.slice(0,-1)
            this.uploadshow = true
            this.upType = "UploadTO"
            this.copyList = JSON.stringify(this.selectAll),
            this.objClone = JSON.parse(this.copyList);
            let ids = []
            this.objClone.forEach((item,index)=>{
              // Object.keys(item).forEach((im,ix)=>{
              //   if(im !=='goods_id' && im !=='p_country' ){
              //     delete item[im];
              //   }
              // })
              ids.push(item.id)
            })
            // this.publishObj = this.objClone;
            this.publishObj = ids.toString();
            console.log(this.publishObj,'publishObj',this.objClone)
          }else{
            this.loading = false
            this.$notification.error({
              message: '错误',
              description: '请先勾选上传的选项',
            });
          }
        }else{
          this.loading = false
          this.$notification.error({
            message: '错误',
            description: '请先选择物流',
          });
        }
      }else{
        this.loading = false
        this.$notification.error({
          message: '错误',
          description: '请先选择店铺',
        });
      }
    },
    //确认发布
    uploadOk(){
      // 上传的操作   uploadOnekey
      this.Uploading = true ;
      if(this.upType === 'UploadTO'){
        this.toupload()
      }
      // else if(this.upType === 'uploadOnekey'){
      //   this.oneKeyUploadPublish()
      // }
      this.uploadLoading = true
      setTimeout(() => {
        this.uploadshow = false;
        this.uploadLoading = false;
      }, 800);
    },
    uploadCancel(){
      this.uploadshow = false;
      // this.selectedRowKeysHis = []
    },
    // 一键发布 产品发布的 
    toupload(){
      let logisticsId = []
      this.SelectCountryHis.forEach((item,index)=>{
        this.siteSelectHis.forEach((itm,inx)=>{
          if(item==itm.id){
            let obj = {}
            obj[item]=itm.logistic_name
            logisticsId.push(obj)
          }
        })
      })
      shopeePublish({
        goods_ids:this.publishObj,
        store_id:this.shopValueHis,
        logistics:logisticsId
      }).then(res=>{
        if(res.code === 0){
          this.selectedRowKeys = [];
          this.loading = false
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
          // this.activeKey = '2'
          // this.getuploadResult('10')
          this.getpublishList('10',this.shopValueHis,this.SelectCountryHis)
          this.Uploading = false
          if(this.classValue == 'all') {
           this.classValueType = 1
          }else {
            this.classValueType = 0
          }
          this.getCountDown(this.shopValueHis,this.classValueType)
        }else{
          if(this.classValue == 'all') {
           this.classValueType = 1
          }else {
            this.classValueType = 0
          }
          this.getCountDown(this.shopValueHis,this.classValueType)
          this.loading = false
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
          this.Uploading = false
        }
      })
    },
    getCountDown(shopValue,classValueType){
      console.log("执行次数")
      countDown({
        store_id: shopValue,
        all_country: classValueType
      }).then(res => {
        if(res.code === 0) {
          console.log("执行前")
          console.log(typeof (res.data.next_time),"type")
          if(res.data.next_time === 0){
            Vue.ls.remove("countDesInfoShopValue")
            Vue.ls.remove("countDesInfoClassValueType")
            this.countDisabled = false
          }else{
            this.runCountTime(res.data.next_time * 60)
            Vue.ls.set("countDesInfoShopValue",this.shopValue)
            Vue.ls.set("countDesInfoClassValueType",this.classValueType)
            this.countDisabled = true
          }
          this.selectedRowKeys = []
        }else{
        }
      })
    },
    runCountTime(countTime) {
      let obj = null
      var intervals = setInterval(() => {
        countTime--;
        if (countTime > 0) {
          let min = parseInt(countTime / 60)
          let sec = parseInt(countTime % 60 % 60)
          min = min < 10 ? '0' + min : min;
          sec = sec < 10 ? '0' + sec : sec;
          obj = {
            min: min,
            sec: sec
          }
          this.countDownText = obj.min + '分' + obj.sec + '秒后，可再次发布'
          console.log(countTime, "qwe")
          this.countDisabled = true
        } else {
          console.log('清除计时器前', intervals)
          clearInterval(intervals);
          this.countDisabled = false
          Vue.ls.remove("countDesInfoShopValue")
          Vue.ls.remove("countDesInfoClassValueType")
        }
        this.setCountTime = countTime
      }, 1000)
    },
    //导出
    batchExport(){
      this.showWarning = false
      this.modals = true
      if(this.selectAll.length > 0){
        this.Noexport = []
        this.selectAll.forEach((item,index)=>{
          if(item.status === '0'){
            this.Noexport.push(item.id)
          }
        })
        this.Noexports = this.Noexport.join("  ")
        // this.exportpost()
        // setTimeout(() => {
        //   this.modals = false;
        //   this.modalsLoading = false;
        // }, 1000);
        // this.initialArr = []
        // this.selectedRowKeys = [];
        // this.EXcountryValue = false
        // this.allCountrysState = false
      }else{
        this.$notification.error({
          message: '错误',
          description: '请先勾选导出的选项',
        });
      }
    },
    //导出确认
    exportOk(){
      this.exportpost()
      // this.modalsLoading = true;
    },
    handleCancelExport(){
      this.modals = false
    },
    //导出请求
    exportpost(){
      const token = Vue.ls.get(ACCESS_TOKEN)
      if(this.selectAll){
        let str = '';
        for(var i = 0 ;i < this.selectAll.length ; i++){
          str += (this.selectAll[i].id + ',')
        }
        this.idManege = str.slice(0, -1)
      }
      shopeeBatchExport({
        country:this.countryId,
        ids:this.idManege,
      }).then((res)=>{
        if(res.code === 0){
          // 商品导出
          res.data.fileArr.forEach((item,index) => {
            window.open(this.GLOBAL.BASE_URL + item , '_blank')
          })
          this.selectedRowKeys = [];
          this.EXcountryValue = false
          this.allCountrysState = false
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
          this.modals = false
        }else{
          this.selectedRowKeys = [];
          this.EXcountryValue = false
          this.allCountrysState = false
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
        this.initialArr = []
      })
    },
    //批量删除
    delReleasedAll(){
      if(this.selectAll.length > 0){
        let str = '';
        for(var i = 0 ;i < this.selectAll.length ; i++){
          str += (this.selectAll[i].id + ',')
        }
        this.delId = str.slice(0,-1)
        this.visibles = true
      }else{
        this.$notification.error({
          message: '错误',
          description: '请先勾选删除的选项',
        });
      }
    },
    // 删除 待发布信息
    delReleased(id){
      this.visibles = true
      this.delId=id
    },
    handleCancel(e) {
      this.visibles = false
    },
    handleOk(){
      //删除的操作
      this.delRel()
      this.confirmLoading = true;
      setTimeout(() => {
        this.visibles = false;
        this.confirmLoading = false;
      }, 800);
    },
    //删除接口
    delRel(){
      shopeePublishDeleted({
        goods_ids:this.delId
      }).then(res=>{
        if(res.code === 0){
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
          this.getpublishList('10',this.shopValueHis,this.SelectCountryHis)
        }else{
          this.$notification.error({
              message: '错误',
              description: res.msg,
            });
        }
      })
    },
    //编辑
    Edits(id,site){
      this.$router.push({
        path:"/product/shopeeManage/shopeeGoodsEdite",
        query:{
          id:id,
          site:'shopee',
          type:0
        }
      })
    },
    // 产品记录 分页
    pagechangeRE(page,pagesize){
      this.currentRE = page;
      this.getpublishList('10',this.shopValueHis,this.SelectCountryHis)
    },
  },
  filters:{
    priceTlt(val){
      if(val){
        vm.currencyList.forEach((item,index) =>{
          console.log(item)
          if(item.id === vm.SelectCountry){
            return item.logo + "" + val
          }
        })
      }else{
        return ''
      }
    }
  }
}
</script>
<style scoped lang='less'>
  .mt{margin-top: 20px;}
  .mr{margin-right: 20px;}
  .mb{margin-bottom:20px;}
  .mt-xl{margin-top:40px;}
  .title-size{
    font-size:14px;
    color: #000;
  }
  .alert-box{
    min-height: 100px;
    overflow-y:scroll;
  }
</style>
