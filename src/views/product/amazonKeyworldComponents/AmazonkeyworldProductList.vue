<template>
  <div class="amazonproductlist">
    <a-row>
      <a-col span="2">
        <a-input v-model="searchName" placeholder="请输入标题"></a-input>
      </a-col>
      <a-col span="2">
        <a-input v-model="searchSku" placeholder="请输入sku"></a-input>
      </a-col>
      <a-col span="6" class="ml">
        <datePicker ref="DataList" />
      </a-col>
      <a-col span="2" class="ml">
        <a-button @click="seach()">搜索</a-button>
      </a-col>
      <a-col span="2">
        <a-button @click="clearSearch()">重置</a-button>
      </a-col>
    </a-row>
    <a-row class="mt">
      <a-col span="2">
        <!-- <a-input v-model="searchStoreId" placeholder="请输入店铺ID"></a-input> -->
        <a-select  placeholder='请选择店铺'  style="width:100%" @change="storeChange" :allowClear="true">
          <a-select-option :value="item.id"  v-for='(item,index) in storeSelect' :key="index">{{item.title}}</a-select-option>
        </a-select>
      </a-col>
      <a-col span="2">
        <a-select  placeholder='请选择国家'  style="width:100%" @change="classchange" :allowClear="true">
          <a-select-option :value="item.code"  v-for='(item,index) in siteSelect' :key="index">{{item.title}}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row class="mt">
      <a-col span="4">
        <a-button @click="updataEAN()">替换EAN</a-button>
        <a-checkbox class="ml" @change="onChangeEanType">
          {{EanType?"EAN收费":"EAN免费"}}
        </a-checkbox>
      </a-col>
      <a-col span="2">
        <a-button @click="updataSku()">替换sku</a-button>
      </a-col>
      <a-col v-if="showPublish" span="2"  class="ml">
        <a-button :loading="releaseLoading"  @click="release()">一键发布</a-button>
      </a-col>
    </a-row>
    <a-row class="mt">
      <a-col :md="12" :lg="10" :xl="8" :xxl="6">
        <a-button-group>
          <a-button :type='releaseState ==="0" ? "primary":"default"'  @click='handleChange("0")'>待发布</a-button>
          <a-button :type='releaseState ==="1" ? "primary":"default"' @click='handleChange("1")'>发布中</a-button>
          <a-button :type='releaseState ==="2" ? "primary":"default"' @click='handleChange("2")'>已发布</a-button>
          <a-button :type='releaseState ==="3" ? "primary":"default"' @click='handleChange("3")'>发布失败</a-button>
        </a-button-group>
      </a-col>
    </a-row>
    <a-table 
    class="mt" 
    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    :pagination="false" 
    :columns="columns" 
    :data-source="data"
    :rowKey="(record) => record.id"
    >
    <div class='pic-box' slot="image" slot-scope="text, record">
      <img :src="record.image" alt="">
    </div>
    <div slot="country" slot-scope="text, record">
      {{record.country}}
      <!--  {{codeORcountrys[record.country]}} -->
    </div>
    <div  v-if="releaseState==='0'" slot="publish" slot-scope="text, record">
      {{record.publish==0?"待发布":"已发布"}}
    </div>
    <div v-else  slot="status" slot-scope="text, record">
      {{record.status}}
      <a-popover
      v-if="record.error_message.length > 0"
      title="错误原因"
      >
        <template slot="content">
          <p>{{record.error_message}}</p>
        </template>
        <a-icon type="question-circle" />
      </a-popover>
    </div>
    </a-table>
    <a-row class="mt" type="flex" justify="end">
      <a-col>
        <a-pagination
          v-model="productCurrent"
          :page-size-options="productpageSizeOptions"
          :total='(productpageSize.pageSize*productpageSize.lastPage)'
          show-size-changer
          :pageSize.sync="productpageSize.pageSize"
          @showSizeChange="onShowSizeChangeProduct"
          @change="changeProduct"
        >
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </a-col>
    </a-row>
    <!-- <a-modal
      :maskClosable="false"
      title="更换EAN"
      :visible="EANvisible"
      :confirm-loading="EANconfirmLoading"
      @ok="EANhandleOk"
      @cancel="EANhandleCancel"
    >
      <a-row>
        <a-col>
          <a-select
            label-in-value
            :default-value="0"
            style="width: 240px"
            @change="EANhandleChange"
          >
            <a-select-option :value="1"> 免费 </a-select-option>
            <a-select-option :value="2"> 收费 </a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-modal> -->
  </div>
</template>
<script>
import datePicker from '@/components/dateTime/datePicker.vue'
import {codeORcountrys , currencyList} from "@/views/order/public/country"
import { 
  TgetPublishList,
  TgetResultList,
  TPublish,
  TPublishAgain,
  TchangeEan,
  TchangeSku,
  getMyStore,
  
} from "@/api/collect"

import { handlerData} from "@/utils/util"
import moment from "moment"
export default {
  name: 'amazonproductlist',
  components: {
    datePicker,
  },
  computed: {
  },
  data() {
    return {
      data:[],
      columns:[
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id',
          width: 100,
        },
        {
          title: 'sku',
          dataIndex: 'sku',
          key: 'sku',
          width: 250,
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          ellipsis: true,
        },
        {
          title: '图片',
          dataIndex: 'image',
          key: 'image',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'image' },
        },
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
          width: 250,
          ellipsis: true,
        },
        {
          title: '国家',
          dataIndex: 'country',
          key: 'country',
          width: 100,
          scopedSlots: { customRender: 'country' },
        },

        {
          title: '创建时间',
          dataIndex: 'created_at',
          key: 'created_at',
        },
        {
          title: '状态',
          dataIndex: 'publish',
          key: 'publish',
          scopedSlots: { customRender: 'publish' },
        },
        // publish
      ],
      codeORcountrys,
      currencyList,
      moment,
      productpageSizeOptions: ['10', '20', '30', '40', '50'],
      productCurrent: 1,
      productpageSize: 10,
      releaseState: '2',
      EANvisible: false,
      EANconfirmLoading: false,
      selectedRowKeys:[],
      selectedRows:[],
      searchName: '',
      // searchCountry: '',
      searchSku: '',
      // searchStoreId: '',
      startValue:"",
      endValue:"",
      showPublish:true,
      // 店铺信息
      storeSelect:"",
      siteSelect:"",
      SelectCountry:"",
      countryLogo:"",
      EanType:false,
      releaseLoading:false,
    }
  },
  methods: {
    onSelectChange(selectedRowKeys,selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows
    },
    error(msg,info){
      this.$notification.error({
        message: msg,
        description: info,
        duration: 10
      });
    },
    success(msg,info){
      this.$notification.success({
        message: msg,
        description: info,
        duration: 10
      });
    },
    seach() {
      console.log(this.$refs.DataList.startValue, this.$refs.DataList.endValue, this.searchName, this.releaseState)
      this.startValue = moment(this.$refs.DataList.startValue).format('YYYY-MM-DD')
      this.endValue = moment(this.$refs.DataList.endValue).format('YYYY-MM-DD')
      console.log("startValue",this.startValue,"endValue",this.endValue,)
      this.getListFn(0)
    },
    handleChange(value) {
      // 0待发布 1发布中 2已发布 3发布失败
      console.log(`selected ${value}`)
      this.releaseState = value
      if(this.releaseState==0){
        this.getListFn(1)
      }else{
        this.getListFn(2)
      }
      if(this.releaseState==1 || this.releaseState==2){
        this.showPublish = false
      }else{
        this.showPublish = true
      }
      
    },
    clearSearch() {
      this.searchName = ''
      // this.releaseState = '0'
      this.searchSku = ""
      this.$refs.DataList.childClearSearch()
    },
    // updataSku(){
    //   if(this.selectedRows.length>0){
    //     //更新sku
    //   }else{
    //     this.$notification.error({
    //       message:'提醒',
    //       description:"请勾选更新sku的选项",
    //     });
    //   }
    // },
    updataEAN() {
      if(this.selectedRows.length>0){
        this.EANvisible = true
      }else{
        this.$notification.error({
          message:'提醒',
          description:"请勾选更新EAN的选项",
        });
      }
    },
    // EANhandleOk() {
    //   console.log(this.EANType,)
    // },
    // EANhandleChange(value) {
    //   console.log(`selected ${value}`)
    //   this.EANType = value
    //   console.log(this.EANType,"EANType")
    // },
    EANhandleCancel() {
      this.EANvisible = false
    },
    // 一键发布
    release() {
      this.releaseLoading = true
      if(this.selectedRowKeys.length>0){
        if(this.storeValue){
          if(this.SelectCountry){
            console.log("允许上传")
            console.log(this.selectedRowKeys,this.storeValue,this.SelectCountry)
            if(this.releaseState==0){
              this.TPublishFn(this.selectedRowKeys)
            }else if(this.releaseState==3){
              this.TPublishAgainFn(this.selectedRowKeys)
            }
          }else{
            this.releaseLoading = false
            this.error("错误","请筛选国家")
          }
        }else{
          this.releaseLoading = false
          this.error("错误","请筛选店铺")
        }
      }else{
        this.releaseLoading = false
        this.error("错误","请勾选上传的选项")
      }
      this.getListFn(0)
      this.selectedRowKeys = []
      this.selectedRows = []

    },
    // 发布
    TPublishFn(id){
      TPublish({
        ids:id,
        store_id:this.storeValue,
        country:this.SelectCountry,
      }).then(res =>{
        if( res.code === 0){
          this.success("成功","发布成功")
          this.releaseLoading = false
        }else{
          this.error("失败",res.msg)
          this.releaseLoading = false
        }
      })
    },
    // 重新发布
    TPublishAgainFn(id){
      TPublishAgain({
        ids:id,
        store_id:this.storeValue,
        country:this.SelectCountry,
      }).then(res =>{
        if(res.code === 0){
          this.success("成功","发布成功")
          this.releaseLoading = false
        }else{
          this.error("失败",res.msg)
          this.releaseLoading = false
        }
      })
    },
    updataEAN(){
      if(this.selectedRowKeys.length>0){
        this.TchangeEanFn(this.selectedRowKeys)
      }else{
        this.error("错误","请勾引替换EAN的选项")
      }
    },
    updataSku(){
      if(this.selectedRowKeys.length>0){
        this.TchangeSkuFn(this.selectedRowKeys)
      }else{
        this.error("错误","请勾引替换sku的选项")
      }
    },
    TchangeEanFn(id){
      console.log(this.EanType?1:0)
      TchangeEan({
        ids:id,
        type:this.EanType?1:0
      }).then(res=>{
        if(res.code === 0){
          this.success("成功","EAN替换成功")
          this.selectedRowKeys=[]
          this.selectedRows=[]
        }else{
          this.error("失败",res.msg)
        }
      })
    },
    onChangeEanType(e){
      console.log(`checked = ${e.target.checked}`);
      this.EanType = e.target.checked
      console.log("点击checkout",this.EANType)
    },
    TchangeSkuFn(id){
      TchangeSku({
        ids:id,
      }).then(res=>{
        if(res.code === 0){
          this.success("成功","EAN替换成功")
        }else{
          this.error("失败",res.msg)
        }
      })
    },
    //分页
    onShowSizeChangeProduct(page,pageSize){
      console.log(page,pageSize,"onShowSizeChangeProduct")
      this.productCurrent = page
      this.productpageSize = pageSize;
      // 区分请求结果还是 待发布
      this.TgetResultListFn(page,pageSize)
    },
    changeProduct(page,pageSize){
      console.log(page,pageSize,"changeProduct")
      this.productCurrent = page
      this.productpageSize = pageSize;
      this.TgetResultListFn(page,pageSize)
    },
    // 请求分支
    getListFn(type){
      console.log(type,"type")
      // 0 根据默认选项  1 待发布  2 发布结果
      let status = [
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id',
          width: 100,
        },
        {
          title: 'sku',
          dataIndex: 'sku',
          key: 'sku',
          width: 250,
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          ellipsis: true,
        },
        {
          title: '图片',
          dataIndex: 'image',
          key: 'image',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'image' },
        },
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
          width: 250,
          ellipsis: true,
        },
        {
          title: '国家',
          dataIndex: 'country',
          key: 'country',
          width: 100,
          scopedSlots: { customRender: 'country' },
        },

        {
          title: '创建时间',
          dataIndex: 'created_at',
          key: 'created_at',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        // publish
      ]
      let publish =[
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id',
          width: 100,
        },
        {
          title: 'sku',
          dataIndex: 'sku',
          key: 'sku',
          width: 250,
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          ellipsis: true,
        },
        {
          title: '图片',
          dataIndex: 'image',
          key: 'image',
          width: 100,
          ellipsis: true,
          scopedSlots: { customRender: 'image' },
        },
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
          width: 250,
          ellipsis: true,
        },
        {
          title: '国家',
          dataIndex: 'country',
          key: 'country',
          width: 100,
          scopedSlots: { customRender: 'country' },
        },

        {
          title: '创建时间',
          dataIndex: 'created_at',
          key: 'created_at',
        },
        {
          title: '状态',
          dataIndex: 'publish',
          key: 'publish',
          scopedSlots: { customRender: 'publish' },
        },
        // publish
      ]
      if(type == 0){
        if(this.releaseState == "0"){
          this.columns = publish
          this.TgetPublishListFn(this.productCurrent,this.productpageSize.pageSize)
        }else{
          this.columns = status
          this.TgetResultListFn(this.productCurrent,this.productpageSize.pageSize)
        }
      }else if(type==1){
        this.releaseState = "0"
        this.columns = publish
        this.TgetPublishListFn(this.productCurrent,this.productpageSize.pageSize)
      }else if(type == 2){
        this.columns = status
        this.TgetResultListFn(this.productCurrent,this.productpageSize.pageSize)
      }
      this.selectedRowKeys = []
      this.selectedRows = []
      console.log(this.selectedRowKeys,this.selectedRows)
    },
    // 获取发布结果
    TgetResultListFn(page,pageSize){
      TgetResultList({
        page:page, 
        page_size:pageSize, 
        keyword:this.searchName,
        country:this.SelectCountry, 
        store_id:this.storeValue, 
        sku:this.searchSku, 
        status:this.releaseState,  // 1:发布中2发布成功:3:发布失败
        start_time:this.startValue,
        end_time:this.endValue,
      }).then(res=>{
        if(res.code === 0){
          this.data = handlerData(res.data)
          console.log(this.data)
          console.log(res.data,"TgetResultList")
          this.productCurrent = parseInt(res.pages.currentPage)
          this.productpageSize = res.pages
        }else{
          
        }
      })
    },
    // 获取待发布列表
    TgetPublishListFn(page,pageSize){
      TgetPublishList({
        page:page, 
        page_size:pageSize, 
        keyword:this.searchName,
        sku:this.searchSku, 
        store_id:this.storeValue,
        country:this.SelectCountry,
        start_time:this.startValue,
        end_time:this.endValue,
      }).then(res =>{
        if(res.code === 0){
          console.log(res.data,"TgetPublishListFn")
          this.data = handlerData(res.data)
          console.log(this.data)
          this.productCurrent = parseInt(res.pages.currentPage)
          this.productpageSize = res.pages
        }else{

        }
      })

    },
    // 获取店铺 和国家信息
    getMyStores(){
      getMyStore({
        page_type:"mws_upload"
      }).then((res)=>{
        if(res.code === 0){
          this.storeSelect = res.data
          console.log(this.storeSelect,"storeSelect")
        }
      })
    }, 
    storeChange(val){
      this.selectedRowKeys = []
      this.selectedRows = []
      this.storeValue = val
      this.storeSelect.forEach((item,index)=>{
        if(val === item.id){
          this.siteSelect= item.mws_site
        }
      })
      if(this.releaseState ==0){
        // this.screenType = '0'
        this.getListFn(1)
      }else{
        this.getListFn(2)
      }
    },
    classchange(value){
      this.selectedRowKeys = []
      this.selectedRows = []
      this.SelectCountry = value
      if(this.releaseState ==='0'){
        // this.screenType = '0'
        this.getListFn(1)
      }else{
        this.getListFn(2)
      }
      // this.getuploadResult('10',this.shopValueHis,this.SelectCountryHis,this.condition)
      this.currencyList.forEach((item,index) =>{
        if(item.id === this.SelectCountry){
          this.countryLogo = item.logo
        }
      })
    },
  },
  created() {},
  mounted() {
    this.getMyStores()
  },
}
</script>
<style scoped lang="less">
.ml{margin-left: 10px;}
  .pic-box{
    width: 100px;
    img{
      width: 100%;
    }
  }
</style>