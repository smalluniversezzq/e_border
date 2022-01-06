<template>
  <div>
    <a-card  class="ant-pro-components-tag-select" title='筛选'>
        <a-row class='mb-l' type="flex" justify="start">
          <a-col :span='2.5'>
            <a-select  :allowClear='true' placeholder='请选择店铺' style="width:180px "  @change="shopchange" >
              <a-select-option value="all">全部</a-select-option>
              <a-select-option :value="item.id" v-for='(item,index) in storeSelect' :key='index'>{{item.title}}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span='2.5'>
            <a-select class='ml'  :allowClear='true'  defaultValue="all"  placeholder='请选择国家'  style="width:180px " @change="countrychange">
               <a-select-option value="all" >全部</a-select-option>
              <a-select-option :value="item.title" v-for='(item,index) in countrySelect' :key='index'>{{item.value}}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span='2.5'>
            <a-input class='ml' placeholder="请输入搜索的产品名称" style="width:180px " v-model="searchName"></a-input>
          </a-col>
          <a-col :span='1.5'>
            <a-button class='ml' type='primary' @click="shopSearch()">搜索</a-button>
          </a-col>
          <a-col :span='1.5'>
            <a-button class='ml'  @click="() => (searchName = '' ) ">重置</a-button>
          </a-col>
        </a-row>
        </a-card>
        <a-card class='mt'>
        <a-row style='margin-bottom:10px'>
          <a-col  :md="20" :sm="20">
            <a-button type="primary"  @click='exportListAll()'>批量导出</a-button>
            <a-button type="primary" style="margin-left:10px;" @click='EditsAll()'>批量编辑</a-button>
            <a-button type="danger"  style="margin-left:10px;" @click='collectdelAll()'>批量删除</a-button>
          </a-col>
          <a-col :md='4'>
             <a-row type='flex' justify='end'>
               <a-col>
                  <a-button type='primary' @click='toReleasedAll'>加入发布</a-button>
               </a-col>
             </a-row>
          </a-col>
        </a-row>
        <a-row>
          <!-- <a-col :span="24"> -->
            <!-- v-if='!data.length <= 0'  -->
            <a-table
              :scroll="{ x: 1300 }"
              :pagination="false"
              :dataSource="data"
              :rowSelection="rowSelection"
              rowKey="id">
              <a-table-column
                title="id"
                dataIndex="id"
                fixed="left"
                width="100px"
              >
              </a-table-column>
              <a-table-column
                title="图片"
                fixed="left"
                width="100px"
              >
              <template slot-scope="text, record">
                <span>
                  <img style='width:60px;' :src="record.image" alt="">
                </span>
              </template>
              </a-table-column>
              <a-table-column
                title="标题"
                dataIndex="title"
              >
              <template slot-scope="text, record">
                <span>
                  <span>{{record.title}}</span>
                </span>
              </template>
              </a-table-column>
              <a-table-column
                title="来源"
                dataIndex="ori_platform"
              >
              </a-table-column>
              <a-table-column
                title="价格"
                dataIndex="price"
              >
                <template  slot-scope="text, record">
                  <span>{{record.price | priceTlt}}</span>
                </template>
                </a-table-column>
                <a-table-column
                  title="标题"
                  dataIndex="title"
                  width='340px'
                >
                <template slot-scope="text, record">
                  <span>
                    <span>{{record.title}}</span>
                  </span>
                </template>
                </a-table-column>
                <a-table-column
                  title="来源"
                  dataIndex="ori_platform"
                  width="145px"
                >
                </a-table-column>
                <a-table-column
                  title="价格"
                  dataIndex="price"
                  width="100px"
                >
                  <template  slot-scope="text, record">
                    <span>{{record.price | priceTlt}}</span>
                  </template>
                </a-table-column>
                <a-table-column
                  title="已认领平台"
                  dataIndex="platformManege"
                  width="125px"
                >
                </a-table-column>
                <a-table-column
                  title="分类"
                  width="210px"
                >
                <template slot-scope="text, record">
                  <div v-for='(item,index) in record.categoryData' :key='index' v-if='item.title'>
                  {{item.country? "("+codeORcountry[item.country]+")" :''}} {{item.title}}
                  </div>
                </template>
                </a-table-column>
                <a-table-column
                  class="time"
                  title="创建时间"
                  dataIndex="created_at"
                  width="140px"
                >
              </a-table-column>
              <a-table-column
                title="已认领平台"
                dataIndex="platform"
                width="110px"
              >
              </a-table-column>
              <a-table-column
                title="分类"
                width="80px"
              >
              <template slot-scope="text, record">
                <div v-for='(item,index) in record.categoryData' :key='index' v-if='item.title'>
                 {{item.country? "("+codeORcountry[item.country]+")" :''}} {{item.title}}
                </div>
              </template>
              </a-table-column>
              <a-table-column
                class="time"
                title="创建时间"
                dataIndex="created_at"
                width="120px"
              >
            </a-table-column>
            <a-table-column
              title="导出"
              width="100px"
            >
              <template slot-scope="text, record">
                <div v-for='(item,index) in record.categoryData' :key='index'>
                 {{item.country? "("+codeORcountry[item.country]+")" :''}}
                <span v-if='item.status === "0"'>否</span>
                <span v-if='item.status === "1"'>是</span>
                </div>
              </template>
            </a-table-column>
              <a-table-column
                title="操作"
                fixed="right"
                width="220px"
              >
                <template slot-scope="text, record">
                  <div v-for='(item,index) in record.categoryData' :key='index'>
                  {{item.country? "("+codeORcountry[item.country]+")" :''}}
                  <span v-if='item.status === "0"'>否</span>
                  <span v-if='item.status === "1"'>是</span>
                  </div>
                </template>
              </a-table-column>
                <a-table-column
                  title="操作"
                  width="240px"
                >
                  <template slot-scope="text, record">
                    <div>
                      <a-row>
                        <a-col :span="12">
                          <a-button type="primary" @click='Edits(record.id,record.platform)'>编辑</a-button>
                        </a-col>
                        <a-col :span="12">
                          <a-button type="danger" style="margin-left:10px;" @click='collectdel(record.id)'>删除</a-button>
                        </a-col>
                      </a-row>
                    </div>
                    <div>
                      <a-row>
                        <a-col :span="12">
                          <a-button class='mt-sm' :loading='copyloading'  @click='copyProduct(record.id)'>一键复制</a-button>
                        </a-col>
                        <a-col :span="12">
                          <a-button v-if='record.join_waite_id === null' class='mt-sm' :loading='copyloading'  @click='released(record.id)'>加入发布</a-button>
                          <a-button v-else  class='mt-sm' :loading='copyloading' >已加入</a-button>
                        </a-col>
                      </a-row>
                    </div>
                  </template>
                </a-table-column>
              </a-table>
            <!-- </a-col> -->
          </a-row>
          <a-row class='mt' v-if='data' type="flex" justify="end">
            <a-col>
              <a-pagination
              :pageSizeOptions="pageSizeOptionManage"
              v-model="currentManege"
              showSizeChanger
              @showSizeChange="onShowSizeChange"
              :pageSize.sync="pageManage.pageSize"
              @change='pagechange'
              :total='(pageManage.pageSize*pageManage.lastPage)' />
            </a-col>
          </a-row>
        </a-card>
    <a-modal
      title="导出选项"
      :visible="modals"
      @ok="exportOk"
      :confirmLoading="modalsLoading"
      @cancel="handleCancel"
    >
      <a-form-item
        label="选择导出国家"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select placeholder="请选择" style="width:100%" @change="EXcountryChange">
          <a-select-option :value="index"  v-for='(item,index) in codeORcountrys' :key='index'>{{item}}</a-select-option>
        </a-select>
      </a-form-item>
      <!-- <a-form-item
        label="币种"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select defaultValue="GBP" v-model='currency' style="width:120px " @change="handleChange">
          <a-select-option value="GBP">GBP</a-select-option>
          <a-select-option value="RMB">RMB</a-select-option>
        </a-select>
      </a-form-item> -->
      <a-form-item
        label="标题前缀"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-model="prefix" placeholder='统一标题前缀'></a-input>
      </a-form-item>
           <a-form-item
        label="厂商"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-model="firm" placeholder='统一厂商'></a-input>
      </a-form-item>
      <a-form-item
        label="品牌"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-model="brand" placeholder='统一品牌'></a-input>
      </a-form-item>

      <a-row v-show='showWarning' type='flex' justify='center'>
        <a-col :span="18">
          <a-alert :message="ExTxt" type="warning" />
        </a-col>
      </a-row>
      <!-- <a-row v-if='Noexport.length > 0' class='mt' type='flex' justify='center'>
        <a-col :span="18">
          <a-alert  :message="'ID为' + Noexports +' 的产品编辑后才能导出'" type="warning" />
        </a-col>
      </a-row> -->
      <!-- <a-form-item
        v-if='Noexport.length > 0'
        label="提示"
        :labelCol="labelCol"
        :wrapperCol="{span: 16 }"
      >
        <div class='danger-color'>
          <span>id为</span>
          <span v-for='(item,index) in Noexport' :key='index'>
            {{item}}
          </span>
          <span>

          </span>
        </div>
      </a-form-item> -->
      <!-- <a-form-item
        label="分类编号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCols"
      >
      <div>
        <a-col :span="11">
           <a-input  v-model="prefixl" placeholder=''></a-input>
        </a-col>
        <a-col :span="1">
          <span>&nbsp;-</span>
        </a-col>
        <a-col :span="11">
           <a-input  v-model="prefix2" placeholder=''></a-input>
        </a-col>
      </div>
      </a-form-item> -->
    </a-modal>
    <a-modal
    title="删除"
    :visible="visibles"
    @ok="handleOk"
    :confirmLoading="ManageLoading"
    @cancel="handleCanceldel"
  >
    <p>{{ModalTextManage}}</p>
  </a-modal>
  <a-modal
    title="批量编辑"
    :maskClosable=false
    :visible="editShow"
    @ok="editOk"
    :confirmLoading="editLoading"
    @cancel="editceldel"
  >
  <a-row>
    <a-col span='4'>选择店铺:</a-col>
    <a-col span='18'>
     <a-select
      style="width:100%;"
      placeholder='请选择店铺'
      v-model='storeId'
      @change="ChangeStore"
     >
        <a-select-option value="0">{{'请选择'}}</a-select-option >
        <a-select-option :value="storeItem.id" v-for="(storeItem,index) in storeSelect" :key='index'>{{storeItem.title}}</a-select-option >
      </a-select>
    </a-col>
  </a-row>
  <a-row class='mt-sm'>
    <a-col span='4'>站点信息:</a-col>
    <a-col span='18'  v-if='storeId !=="0"'>
      <a-checkbox-group   @change="onCheck"  >
        <!-- <a-checkbox  value="CN">{{'中国'}}</a-checkbox> -->
        <a-row  type='flex' align='middle' v-for="(item, index) in siteSelect" :key="index" >
          <a-col>
              <a-checkbox :value="item.title">{{item.value}}</a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group >
    </a-col>
  </a-row>
  <a-row class='mt-sm'>
    <a-col span='4'>品牌:</a-col>
    <a-col span='18'>
       <a-input v-model='brand_name' placeholder="请输入品牌"></a-input>
    </a-col>
  </a-row>
  <a-row class='mt-sm'>
    <a-col span='4'>厂家:</a-col>
    <a-col span='18'>
       <a-input v-model='manufacturer' placeholder="请输入厂家"></a-input>
    </a-col>
  </a-row>
   <a-row class='mt-sm'>
    <a-col span='4'>库存:</a-col>
    <a-col span='18'>
       <a-input v-model='stock' placeholder="请输入库存"></a-input>
    </a-col>
  </a-row>
  <a-row class='mt-sm'>
    <a-col span='4'>五点描述:</a-col>
    <a-col span='18'>
      <a-row>
        <a-col >
          <a-input v-model='bullet_point1' placeholder="请输入描述1"></a-input>
        </a-col >
         <a-col class='mt-sm'>
          <a-input v-model='bullet_point2' placeholder="请输入描述2"></a-input>
        </a-col>
         <a-col class='mt-sm'>
          <a-input v-model='bullet_point3' placeholder="请输入描述3"></a-input>
        </a-col>
         <a-col class='mt-sm'>
          <a-input v-model='bullet_point4' placeholder="请输入描述4"></a-input>
        </a-col>
         <a-col class='mt-sm'>
          <a-input v-model='bullet_point5' placeholder="请输入描述5"></a-input>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
  <a-row class='mt-sm'>
    <a-col span="4">关键词:</a-col>
    <a-col span="18">
      <a-input v-model='keywords' placeholder="请输入关键词"></a-input>
    </a-col>
  </a-row>
  </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import {exportList ,trans ,getGoodsList ,prodel ,productCopy ,getMyStore ,ExportCheck ,insertPublish , batchUpdate} from '@/api/collect'
import { ACCESS_TOKEN} from '@/store/mutation-types'
import { codeORcountry ,codeORcountrys} from '@/views/order/public/country'
export default {
  name:"manage",
  components: {
  },
  data () {
    return {
      codeORcountrys,
      codeORcountry,
      data:"",
      selectManageAll:"",
      selectkeyManage:"",
      siteManage:"",
      idManege:"",
      platformManege:"amazon",
      ModalTextManage: '确定要删除吗',
      visibles: false,
      modals:false,
      modalsLoading:false,
      ManageLoading: false,
      listLoading:false,
      editShow:false,
      editLoading:false,
      delidManage:"",
      delManageAll:"",
      searchName:"",
      labelCol: { lg: { span: 6 }, sm: { span: 6 } },
      wrapperCol: { lg: { span: 12 }, sm: { span: 8 } },
      wrapperCols: { lg: { span: 16 }, sm: { span:16 } },
      //弹窗
      language:"EN",
      currency:"GBP",
      prefix:"",
      firm:"",
      brand:"",
      prefixl:"",
      prefix2:"",
      Noexport:[],
      Noexports:"",
      pageManage:"",
      currentManege:1,
      pageSizeOptionManage:[10,20,40,60,80,100,200],
      copyloading:false,
      shop:"",
      countryManage:"",
      classres:"",
      showclass:false,
      countrySelect:"",
      storeSelect:"",
      EXids:"",
      failData:"",
      showWarning:false,
      ExTxt:"",
      ReleasedIds:"",
      EXcountryValue:false,
      selectedRowKeys: [],
      shopSearchInfo:"",
      clearselect:false,
      dataStatus:"",
      EditAll:"",
      storeId:"0",
      storeEdit:"",
      siteSelect:"",
      checkedValues:"",
      EditStoreId:"",
      brand_name:"",
      manufacturer:"",
      stock:"",
      bullet_point1:"",
      bullet_point2:"",
      bullet_point3:"",
      bullet_point4:"",
      bullet_point5:"",
      keywords:"",
      batchData:{
        store_id:"",
        countryManage:"",
        brand_name:"",
        manufacturer:"",
        keywords:"",
        quantity:"",
        bullet_point1:"",
        bullet_point2:"",
        bullet_point3:"",
        bullet_point4:"",
        bullet_point5:"",
      },
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        // hideDefaultSelections: true,
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectManageAll = selectedRows
          this.selectkeyManage = selectedRowKeys
          this.selectedRowKeys = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            defaultChecked : this.checkinit === true ,
            name: record.name,
          }
        }),
      }
    }
  },
  created(){
  },
  mounted(){
    console.log(Vue.ls.get('PAGE_SIZE'), Vue.ls.get('currentManege'))
    const baseUrls=this.GLOBAL.BASE_URL
    // const classId=this.$route.query.classId
    console.log(baseUrls,"baseurl")
    if(Vue.ls.get('PAGE_SIZE')){
      this.currentManege = Vue.ls.get('currentManege')
      console.log(this.currentManege)
      this.getGoodsLists(Vue.ls.get('PAGE_SIZE'))
      this.getMyStores()
    }else{
      this.getGoodsLists(10)
      this.getMyStores()
    }
  },
  methods: {
    // 获取 
    pagechange(page,pagesize){
      this.currentManege = page;
      Vue.ls.set('currentManege',page)
      this.getGoodsLists(pagesize)
      console.log(page,'page',pagesize,'pagesize', Vue.ls.get('currentManege'),'currentManege')
    },
    // lll
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize,"pagesizi");
      this.getGoodsLists(pageSize)
      Vue.ls.set('PAGE_SIZE',pageSize)
      Vue.ls.set('currentManege',current)
    },
    // 获取国家 和店铺信息
    getMyStores(){
      getMyStore({}).then((res)=>{
        if(res.code === 0){
          this.storeSelect = res.data,
          this.storeEdit = res.data
        }
      })
    },
    getGoodsLists(pagesize){
      this.listLoading = true
      getGoodsList({
        page:this.currentManege,
        page_size:pagesize
      }).then(res => {
        if(res.code === 0){
          this.listLoading = false
          if(res.data.length>0){
            this.data = res.data
            this.pageManage = res.pages
            this.siteManage = res.data.platform
            // this.$notification.success({
            // message:'成功',
            // description: res.msg,
            // });
          }
        }else{
          this.$notification.error({
          message:'提醒',
          description: res.msg,
          });
        }
      }) 
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    // change 导出国家选项
    EXcountryChange(value){
      this.EXcountryValue = value
      console.log(value,"value");
      let str='';
      for(var i = 0 ;i < this.selectManageAll.length ; i++){
        str += (this.selectManageAll[i].id + ',')
      }
      this.EXids = str.slice(0,-1);
      console.log(this.EXid,"EXid")
      ExportCheck({
        country:value,
        ids:this.EXids
      }).then(res=>{
        if(res.code === 0){
          if(res.data.failData.length>0){
            // this.$notification.error({
            //   message:'提醒',
            //   description: "产品不可导出",
            // });
            this.failData=res.data.failData
            this.showWarning = true
            this.ExTxt = `ID为${this.failData.join("  ")},没有此国家分类将不能导出`
          }else{
            this.showWarning = false

          }
        }
      })
    },
    Edits(id,siteManage){
      this.$router.push({
        path:"/product/manage/goodedit",
        query:{
          id:id,
          site:siteManage
        }
      })
      Vue.ls.set("MANAGE_ID",id);
    },
    collectClaim(){
    },
    // 批量编辑
    EditsAll(){
      if(this.selectManageAll.length > 0){
        console.log(this.selectManageAll,"selectManageAll")
        let str = '';
        for(var i = 0 ;i < this.selectManageAll.length ; i++){
          str += (this.selectManageAll[i].id + ',')
        }
        this.EditAll = str.slice(0,-1)
        console.log(this.EditAll,"over")
        this.editShow = true;
      }else{
        this.$notification.error({
          message: '错误',
          description: '请先勾选批量编辑的选项',
        });
      }
    },
    onCheck(checkedValues){
      console.log('checked = ', checkedValues)
      this.checkedValues = checkedValues
      console.log(this.treedata)
    },
    ChangeStore(val){
      if(val ==='0'){
        this.storeEdit = []
      }else{
        this.storeEdit.forEach((item,index)=>{
          if(val === item.id){
            this.siteSelect= item.mws_site
            console.log(this.siteSelect,"siteSelect——ChangeStore")
          }
        })
      }

    },
    editOk() {
      this.editLoading = true;
      let str = '';
      for(var i = 0 ;i < this.checkedValues.length ; i++){
        console.log(this.checkedValues[i])
        str += (this.checkedValues[i] + ',')
      }
      this.EditStoreId = str.slice(0,-1)
      this.subEdit()
      setTimeout(() => {
        this.editShow = false;
        this.editLoading = false;
      }, 800);
    },
    editceldel(e) {
      this.editShow = false;
      this.storeId = '0'
      this.checkedValues = ''

    },
    subEdit(){
      console.log(this.EditAll,'商品id',this.EditStoreId,'勾选的国家',this.storeId,'国家',this.brand_name,"品牌",
      this.manufacturer,'厂家',this.stock,'库存',
      this.bullet_point1,
      this.bullet_point2,
      this.bullet_point3,
      this.bullet_point4,
      this.bullet_point5,
      '五点描述',
      this.keywords,'关键词')
      this.batchData.store_id = this.storeId
      this.batchData.countryManage = this.EditStoreId
      this.batchData.brand_name = this.brand_name
      this.batchData.manufacturer = this.manufacturer
      this.batchData.keywords = this.keywords
      this.batchData.quantity = this.stock
      this.batchData.bullet_point1 = this.bullet_point1
      this.batchData.bullet_point2 = this.bullet_point2
      this.batchData.bullet_point3 = this.bullet_point3
      this.batchData.bullet_point4 = this.bullet_point4
      this.batchData.bullet_point5 = this.bullet_point5
      console.log(this.batchData)
      batchUpdate({
        ids:this.EditAll,
        data:this.batchData,
      }).then((res)=>{
        if(res.code === 0){
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
    },
    copyProduct(id){
      this.copyloading = true
      productCopy({
        id:id
      }).then(res=>{
        if(res.code === 0){
          if(Vue.ls.get('PAGE_SIZE')){
            this.currentManege = Vue.ls.get('currentManege')
            console.log(this.currentManege)
            this.getGoodsLists(Vue.ls.get('PAGE_SIZE'))
            this.copyloading = false
          }else{
            this.copyloading = false
          }
          this.getGoodsLists(10)
        }
      })
    },
    collectdel(id){
      this.visibles = true
      this.delidManage = id
      this.delManageAll = false 
    },
    toSearch(){
      this.listLoading =true
      getGoodsList({
        keywords:this.searchName
      }).then(res => {
        if(res.code === 0){
          this.listLoading =false
          if(res.data.length>0){
            this.data = res.data
            this.siteManage = res.data.platform
          }
        }else{
          
        }
      }) 
    },
    prodels(){
      //删除
      if(this.delManageAll === false){
        this.data.forEach((item,index) =>{
          if(item.id == this.delidManage){
            this.data.splice(index,1)
          }
        })
        prodel({
          ids:this.delidManage,
          platform:this.platformManege
        }).then(res => {
          if(res.code === 0){
            this.ModalTextManage = res.msg;
            console.log(res.msg)
          }else{
          }
        }) 
      }else{
        //批量删除
        if(this.selectManageAll){
          let str = '';
          for(var i = 0 ;i < this.selectManageAll.length ; i++){
            str += (this.selectManageAll[i].id + ',')
          }
          this.idManege = str.slice(0,-1)
            prodel({
            ids:this.idManege,
            platform:this.platformManege
          }).then(res => {
            if(res.code === 0){
              this.ModalTextManage = res.msg;
              console.log(res.msg)
              this.getGoodsLists(10)
            }else{
              this.$notification.error({
                message: '错误',
                description: res.msg,
              });
            }
          }) 
        }
      }
    },
    collectdelAll(){
      if(this.selectManageAll.length > 0){
        this.visibles = true
        this.delManageAll = true 
      }else{
        this.$notification.error({
          message: '错误',
          description: '请先勾选删除的选项',
        });
      }
    },
    // 加入待发布
    released(id){
      console.log(id)
        insertPublish({
          goods_id:id
        }).then(res=>{
          if(res.code === 0){
            this.$notification.success({
                message: '成功',
                description: res.msg,
              });
          this.getGoodsLists(10)
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
    },
    // 批量加入待发布
    toReleasedAll(){
      if(this.selectManageAll.length > 0){
        console.log(this.selectManageAll,"selectManageAll")
        let str = '';
        for(var i = 0 ;i < this.selectManageAll.length ; i++){
          str += (this.selectManageAll[i].id + ',')
        }
        this.ReleasedIds = str.slice(0,-1)
        console.log(this.ReleasedIds)
        insertPublish({
          goods_id:this.ReleasedIds
        }).then(res=>{
          if(res.code === 0){
            this.$notification.success({
                message: '成功',
                description: res.msg,
              });
            this.selectedRowKeys = [];
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      }else{
        this.$notification.error({
          message: '错误',
          description: '请先勾选待发布的选项',
        });
      }
    },
    //批量导出
    exportListAll(){
      this.showWarning = false
      if(this.selectManageAll.length > 0){
        console.log(this.selectManageAll)
        this.Noexport = []
        this.selectManageAll.forEach((item,index)=>{
          if(item.status === '0'){
            this.Noexport.push(item.id)
          }
        })
        console.log(this.Noexport)
        this.Noexports = this.Noexport.join("  ")
        this.modals = true
      }else{
        this.$notification.error({
          message: '错误',
          description: '请先勾选导出的选项',
        });
      }
    },
    //导出请求
    exportpost(){
      const token = Vue.ls.get(ACCESS_TOKEN)
      if(this.selectManageAll){
        let str = '';
        for(var i = 0 ;i < this.selectManageAll.length ; i++){
          str += (this.selectManageAll[i].id + '-')
        }
        this.idManege = str.slice(0,-1)
      }
      exportList({
        country:this.EXcountryValue,
        ids:this.idManege,
        titlePrefix:this.prefix,
        brandName:this.brand,
        manufacturer:this.firm,
      }).then((res)=>{
        if(res.code === 0){
          // 商品导出
          //this.GLOBAL.BASE_URL
          window.open(this.GLOBAL.BASE_URL+res.data.file + '?&token=' + token , '_blank')
          // window.open('http://47.92.107.105' + res.data.file + '?&token=' + token , '_blank')
        }else{
          this.$notification.error({
          message: '错误',
          description: res.msg,
        });
        }
        // window.open(window.location.host + res.data.file + '?&token=' + token , '_blank')
        // window.open('http://192.168.1.91' + res.data.file + '?&token=' + token , '_blank')
      })
      console.log(this.language,this.currency,this.prefix,this.firm,this.brand,this.prefixl,this.prefix2)
      console.log(this.idManege,token)
    },
    //复制一项
    copy(){

    },
    shopSearch(){
      let pagesize = Vue.ls.get('PAGE_SIZE')?Vue.ls.get('PAGE_SIZE'):10
      let countryManage = this.countryManage !=='all' ? this.countryManage : '' 
      if(this.searchName){
        this.shopSearchInfo={
          page:this.currentManege,
          page_size:pagesize,
          store_id:this.shop,
          country:countryManage,
          keywords:this.searchName 
        }
      }else{
          this.shopSearchInfo={
          page:this.currentManege,
          page_size:pagesize,
          store_id:this.shop,
          country:countryManage,
        }
      }
      getGoodsList(this.shopSearchInfo).then(res => {
        if(res.code === 0){
          if(res.data.length > 0){
            this.data = res.data
            this.pageManage = res.pages
            this.siteManage = res.data.platform
            this.$notification.success({
            message:'成功',
            description: res.msg,
            });
          }else{
            this.data = []
            this.$notification.error({
            message:'提醒',
            description: '获取内容为空',
            });
          }
        }else{
          this.$notification.error({
          message:'提醒',
          description: res.msg,
          });
        }
      }) 
    },
    shopchange(value){
      console.log(value)
      this.shop = value
      this.countrySelect = {}
      this.storeSelect.forEach((item,idnex)=>{
        if(item.id === this.shop){
          Object.assign(this.countrySelect,item.mws_site)
        }
      })
    },
    countrychange(value){
      this.countryManage = value
      console.log(this.countryManage)
    },
    classchange(value){
      this.class = value
    },
    handleOk(e) {
      this.prodels()
      this.ManageLoading = true;
      setTimeout(() => {
        this.visibles = false;
        this.ManageLoading = false;
        this.ModalTextManage = '确定要删除吗'
      }, 1000);
    },
    handleCanceldel(e) {
      this.visibles = false
    },
    //导出确认
    exportOk(){
      this.modalsLoading = true;
      this.exportpost()
      setTimeout(() => {
        this.modals = false;
        this.modalsLoading = false;
      }, 1000);
    },
    handleCancel(e) {
      this.modals = false
    },
  },
  filters:{
    priceTlt(val){
      return '￥' + val
    }
  }
}
</script>

<style lang="less" scoped>
.ml{margin-left:10px;}
.mb-l{margin-bottom:30px}
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}
.list-articles-trigger {
  margin-left: 12px;
}

.danger-color{
  color: #f5222d;
}
.mt-sm{
  margin-top: 10px;
}
.mt{margin-top: 20px;};
</style>
<style lang="less" scoped>
.ant-modal-mask{
  background-color: rgba(0, 0, 0, 0.15) !important;
}
.word-wrap {
  word-break: break-all;
}
#id {
  padding-left: 20px
}
</style>

