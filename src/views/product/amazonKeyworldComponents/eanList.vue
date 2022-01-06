<template>
  <div class='eanlist'>
    <a-row>
      <a-col  span="4" >
        <a-button @click="updataEAN()">
          替换EAN
        </a-button>
        <a-checkbox class="ml" @change="onChangeEanType">
          {{EanType?"EAN收费":"EAN免费"}}
        </a-checkbox>
      </a-col>
      <a-col span="2" class='ml'>
        <a-button @click="updataSKU()">
          替换sku
        </a-button>
      </a-col>
      <a-col span="2">
        <a-button :loading="releaseLoading" @click='release()'>
          重新发布
        </a-button>
      </a-col>
    </a-row>
    <a-table
      :pagination="false "
      :columns="columns"
      :data-source="data"
      class="mt sign-s"
      :expandedRowKeys="curExpandedRowKeys"
      :rowKey="(record) => record.id"
    >
      <div slot="open" slot-scope="record">
        <a-button
          :icon="curExpandedRowKeys[0] === record.id ? 'down' : 'right'"
          size="small"
          @click="handleExpand(record.id)"
        ></a-button>
      </div>
      <div slot="image" slot-scope="record">
        <div class='pic-box'>
          <img :src="record.image" />
        </div>
      </div>
      <div slot="country" slot-scope="record">
        {{codeORcountrys[record.country]}}
      </div>
      <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
        
        <a-table
          :row-selection="{ selectedRowKeys: AselectedRowKeys, onChange: onSelectChangeA }"
          :pagination="false"
          :columns="attributeColumns" 
          :data-source="Attributedata"
          :rowKey="(record) => record.id"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <div slot="error_message" slot-scope="record">
            {{record.error_message}}
          </div>
        </a-table>
        <a-row type="flex" justify="end" class="mt">
          <a-col>
            <!--变体分页 -->
            <a-pagination 
            v-model="attributeCurrent" 
            :page-size-options="attributepageSizeOptions"
            :total='(attributepageSize.pageSize*attributepageSize.lastPage)'
            show-size-changer
            :pageSize.sync="attributepageSize.pageSize"
            @showSizeChange="onShowSizeChangeA"
            @change="changeA"
            />
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-col>
        </a-row>
      </p>
    </a-table>
    <a-row type="flex" justify="end" class="mt">
      <a-col>
        <!-- title 分页 -->
        <a-pagination 
          v-model="titleCurrent" 
          :page-size-options="titlepageSizeOptions"
          :total='(titlepageSize.pageSize*titlepageSize.lastPage)'
          show-size-changer
          :pageSize.sync="titlepageSize.pageSize"
          @showSizeChange="onShowSizeChangeT"
          @change="changeT"
        />
        <template slot="buildOptionText" slot-scope="props">
          <span>{{ props.value }}条/页</span>
        </template>
      </a-col>
    </a-row>
  </div>
</template>
<script>
const columns = [
  { title: '展开', dataIndex: '', key: 'open', scopedSlots: { customRender: 'open' } },
  { title: '标题', dataIndex: 'title', key: 'title' ,widht:200 , ellipsis: true,},
  // { title: 'sku', dataIndex: 'sku', key: 'sku'  },
  // { title: 'ean', dataIndex: 'ean', key: 'ean' ,  },
  { title: '图片', dataIndex: '', key: 'image' , scopedSlots: { customRender: 'image' } },
  { title: '国家', dataIndex: '', key: 'country' , scopedSlots: { customRender: 'country' } },
  { title: '更新时间', dataIndex: 'created_at', key: 'created_at' }
]
const attributeColumns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: 'ean',
    dataIndex: 'ean',
    width:200,
    key: 'ean'
  },
  {
    title: 'sku',
    dataIndex: 'sku',
    width:250,
    key: 'sku'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    width:250,
    key: 'created_at'
  },
  {
    title: '失败原因',
    dataIndex: '',
    key: 'error_message', 
    scopedSlots: { customRender: 'error_message' }
  },
  // {
  //   title: 'Address',
  //   dataIndex: 'address',
  // },
];

  import {codeORcountrys } from "@/views/order/public/country"
  import {
    TgetFailEanGood,
    TgetFailEanList,
    TchangeVariantSku,
    TchangeVariantEan,
    TpublishGoodByEan
  } from '@/api/collect'
  export default {
    computed: {

    },
    data() {
      return{
        columns,  
        data:[],  
        codeORcountrys,  
        attributeColumns,
        Attributedata:"",
        curExpandedRowKeys:[],
        openNum:"",
        attributeCurrent:1,
        attributepageSizeOptions: ['10', '20', '30', '40', '50'],
        attributepageSize:10,
        releaseLoading:false,
        titleCurrent:1,
        titlepageSizeOptions: ['10', '20', '30', '40', '50'],
        titlepageSize:10,
        AselectedRowKeys:[],
        AselectedRows:[],
        EanType:"",
      }
    },
    methods: {
      onSelectChangeA(selectedRowKeys,selectedRows){
        this.AselectedRowKeys = selectedRowKeys;
        this.AselectedRows = selectedRows
      },
      handleExpand(rowkey) {
        this.openNum = rowkey
        // 请求
        if (this.curExpandedRowKeys.length > 0) {
          let index = this.curExpandedRowKeys.indexOf(rowkey)
          if (index > -1) {
            this.curExpandedRowKeys.splice(index, 1)
          } else {
            this.AselectedRowKeys = []
            this.AselectedRows = []
            // this.TgetTitleListFn(this.openNum,this.attributeCurrent,this.attributepageSize.pageSize)
            this.TgetFailEanListFn(this.attributeCurrent,this.attributepageSize)
            this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
            this.curExpandedRowKeys.push(rowkey)
            this.AselectedRowKeys = []
            this.AselectedRows = []
          }
        } else {
          this.TgetFailEanListFn(this.attributeCurrent,this.attributepageSize)
          // this.TgetTitleListFn(this.openNum,this.attributeCurrent,this.attributepageSize.pageSize)
          this.curExpandedRowKeys.push(rowkey)
        }
      },
          
      // 变体分页
      onShowSizeChangeA(page,pageSize){
        this.attributeCurrent = page
        this.attributepageSize = pageSize;
        this.TgetFailEanListFn(page,pageSize)
      },
      changeA(page,pageSize){
        this.attributeCurrent = page
        this.attributepageSize = pageSize;
        this.TgetFailEanListFn(page,pageSize)
      },
       // 标题分页
      onShowSizeChangeT(page,pageSize){
        this.titleCurrent = page
        this.titleCurrent = pageSize;
        this.TgetFailEanGoodFn(page,pageSize)
      },
      changeT(page,pageSize){
        this.titleCurrent = page
        this.titlepageSize = pageSize;
        this.TgetFailEanGoodFn(page,pageSize)
      },
      // 请求 失败商品列表
      TgetFailEanGoodFn(page,pageSize){
        TgetFailEanGood({
          page:page,
          page_size:pageSize
        }).then(res=>{
          if(res.code === 0){
            this.data = res.data
            this.titleCurrent = parseInt(res.pages.currentPage)
            this.titlepageSize = res.pages
          }else{
          }
        })
      },
      //请求 失败EAN列表
      TgetFailEanListFn(page,pageSize){
        TgetFailEanList({
          page:page,
          page_size:pageSize,
          id:this.openNum
        }).then(res=>{
          if(res.code === 0){
            this.Attributedata = res.data
            this.attributeCurrent = parseInt(res.pages.currentPage)
            this.attributepageSize = res.pages
          }else{

          }
        })
      },
      onChangeEanType(e){
        this.EanType = e.target.checked
      },
      updataEAN(){
        if(this.AselectedRowKeys.length>0){
          this.TchangeVariantEanFn(this.AselectedRowKeys)
        }else{
          this.error("错误","请勾选二级列表替换的选项")
        }
      },
      updataSKU(){
        if(this.AselectedRowKeys.length>0){
          this.TchangeVariantSkuFn(this.AselectedRowKeys)
        }else{
          this.error("错误","请勾选二级列表替换的选项")
        }
      },
      // 更换SKU
      TchangeVariantSkuFn(id){
        TchangeVariantSku({
          ids:id
        }).then(res=>{
          if(res.code === 0){
            this.success("成功","替换成功")
            this.AselectedRowKeys=[]
            this.AselectedRows=[]
          }else{
            this.error("错误",res.msg)
            this.AselectedRowKeys=[]
            this.AselectedRows=[]
          }
        })
      },
      // 更换EAN
      TchangeVariantEanFn(id){
        TchangeVariantEan({
          ids:id,
          type:this.EanType?1:0
        }).then(res=>{
          if(res.code === 0){
            this.success("成功","替换成功")
            this.AselectedRowKeys=[]
            this.AselectedRows=[]
          }else{
            this.error("错误",res.msg)

          }
        })
      },
      // 发布
      release(){
        this.releaseLoading = true
        if(this.AselectedRowKeys.length>0){
          this.TpublishGoodByEanFn(this.AselectedRowKeys)
        }else{
          this.error("错误","请勾选上传的选项")
          this.releaseLoading = false
        }
      },
      TpublishGoodByEanFn(id){
        TpublishGoodByEan({
          ids:id
        }).then(res=>{
          if(res.code === 0){
            this.releaseLoading = false
          }else{
            this.error("错误",res.msg)
            this.AselectedRowKeys=[]
            this.AselectedRows=[]
            this.releaseLoading = false
          }
        })
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
    },
    created() {
    },
    mounted() {
      // this.TgetFailEanGoodFn()
    },
  }
</script>
<style scoped lang='less'>
  .pic-box{
    width:100px;
    img{
      width: 100%;
    }
  }
  .ml{margin-left: 10px;}
</style>
<style >
.sign-s .ant-table-row-expand-icon {
  width: 0;
  border-right: 0 !important;
  display: none;
}

</style>

