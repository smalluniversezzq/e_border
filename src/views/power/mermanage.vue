<template>
  <div>
  <a-card :bordered="false" class='cardmer box-height'  title='用户管理'>
    <a-row :gutter="8">
      <!-- <a-col :span="5" style='background:#fff; border-right: 1px solid #e8e8e8;' >
        <div >
          <a-button class='ml-sm ' @click='edit()' >{{editShow?"编辑":"取消编辑"}}</a-button>
        </div>
        <s-tree
          :dataSource="orgTree"
          :openKeys.sync="openKeys"
          :defaultSelectedKeys='defaultSelectedList'
          :search="false"
          @click="handleClick"
          @edit="handleEdit"
          @del="handleDel"
          @titleClick="handleTitleClick">
        </s-tree>
      </a-col> -->
      <a-col :span="24">
        <!-- <a-row>
          <a-col>
            <a-button v-if='hasPerm(permsBtn.staff_power)'  class='ml-sm' @click='openPower'>分配权限及数据</a-button>
          </a-col>
        </a-row> -->
        <a-row>
          <a-col class='ml-sm' :span='20'>
            <a-input class='mt ' placeholder="员工姓名" style="width:150px " v-model="searchPhone"></a-input>
            <a-button class='mt ml-sm' type='primary' @click='serchMerchant'>搜索</a-button>
              <a-radio-group name="radioGroup" v-model="statusRadio" @change='radioStatus(statusRadio)' class='mt ml-sm'>
                <a-radio value="">全部</a-radio>
                <a-radio value="1">启用</a-radio>
                <a-radio value="0">不启用</a-radio>
              </a-radio-group>
          </a-col>
          <a-col class='tar' :span='3'>
            <a-button v-if='hasPerm(permsBtn.staff_addStaff)'  type='primary' @click='addStaff()'>添加员工</a-button>
          </a-col>
        </a-row>
       <!-- :rowSelection="rowSelection" -->

        <a-row class='mt'>
          <a-col>
            <a-table  
            :pagination="false"   
            :dataSource='data'
            :loading = "listLoading">
              <!-- <a-table-column
                title="店铺"
                dataIndex="shop_name"
                width="100px"
              >
              </a-table-column> -->
               <a-table-column
                title="姓名"
                dataIndex="applicant"
                width="100px"
              >
              </a-table-column>
       
              <a-table-column
                title="用户名"
                dataIndex="username"
                width="100px"
              >
              </a-table-column>
              <!-- <a-table-column
                title="用户名"
                dataIndex="mobile"
                width="100px"
              >
              </a-table-column> -->
              <a-table-column
                title="角色"
                dataIndex="rule_name"
                width="100px"
              >
               </a-table-column>
                <!-- dataIndex="rule_name" -->

              <a-table-column
                title="amazon"
                width="100px">
                <!-- slot-scope="text, record" -->
                <template slot-scope="text, record">
                  <!-- <div style="float:left;margin-left:5px" v-for='(item,index) in record.amazon' :key='index'>
                    {{codeORcountrys[item]}}
                  </div> -->
                  <p v-for='(item,index) in record.amazon' :key='index'>
                    <a-dropdown :trigger="['click']">
                      <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                        {{item.store_title}}({{provinceData[item.country_area]}}) <a-icon type="down" />
                      </a>
                      <a-menu slot="overlay">
                        <a-menu-item v-for='(itm,idex) in item.country' :key='idex'>
                          {{codeORcountrys[itm]}}
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </p>
                </template>
              </a-table-column>

              <a-table-column
                title="shopee"
                width="100px">
                <!-- slot-scope="text, record" -->
                <template slot-scope="text, record" v-if="record.shopee.length">
                  <div style="float:left;margin-left:5px" v-for='(item,index) in record.shopee' :key='index'>
                    {{item}}
                  </div>
                </template>
              </a-table-column>
              <!-- <a-table-column
                title="端口"
                dataIndex="port"
                width="100px"
              >
               </a-table-column> -->
              <!-- <a-table-column
                title="状态"
                width="100px"
              >
              <template slot-scope="text, record">
                <span>{{record.status=='1'?'已启用':"未启用"}}</span>
              </template>
              </a-table-column> -->
              <a-table-column
                title="切换状态"
                dataIndex="status"
                width="80px"
              >
              <template slot-scope="text, record">
                <a-button  class='ml-sm' :disabled='!hasPerm(permsBtn.staff_disable)'  :type='record.status=="1"?"primary":"dashed"' @click='(statusTab(record.status,record.uid))'>{{record.status=='1'?'已启用':"未启用"}}</a-button>
                <!-- <a-switch :defaultChecked='record.status=="1"?true:false' @change='statusTab(record.status,record.agent_id)'>
                  <a-icon type="check" slot="checkedChildren" />
                  <a-icon type="close" slot="unCheckedChildren" />
                </a-switch> -->
              </template>
              </a-table-column>
              <a-table-column
                title="操作"
                width="150px"
              >
              <template slot-scope="text, record">
                <a-button class='links ml cursor' :disabled='!hasPerm(permsBtn.staff_edit)' data-list='record.title' @click='updataShow(record.uid,record.port,record.port_id)'> 修改</a-button>
                <a-button class='links ml cursor' :disabled='!hasPerm(permsBtn.staff_details)' @click='DetailsShowBTN(record.uid)'>详情</a-button>
                <a-button class='links ml mt cursor' :disabled='!hasPerm(permsBtn.staff_power)' @click='openPower(record.uid,record.amazon,record.shopee,record.group_id,id)'>分配权限</a-button>
                <a-button class='links ml mt cursor' :disabled='!hasPerm(permsBtn.staff_del)' @click='delmerchant(record.uid)'>删除</a-button>
              </template>
              </a-table-column>
            </a-table>
          </a-col>
        </a-row>
        <a-row
          class='mt'
          type="flex"
          justify="end"
        >
        <a-col v-if='data.length>0'>
          <a-pagination
            v-model="current"
            @change='pagechange'
            :pageSize='page.pageSize'
            :total='(page.pageSize*page.lastPage)'
          />
        </a-col>
      </a-row>
      </a-col>
    </a-row>
    <!-- <org-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" /> -->
  </a-card>
    <a-modal
      :title="addTitle"
      :visible="addvisible"
      :maskClosable='false'
      @ok="addOk"
      :confirmLoading="addLoading"
      @cancel="addCancel">
      <a-row v-if='addstate !== "del"'>
        <a-col :span='6' class='tar lin-height'> 端口名称：</a-col>
        <a-col :span='18'>
          <a-input v-model='bmName' placeholder='请输入端口名称'  :style="{ display: 'inline-block', width: 'calc(68% - 12px)' }"/>
        </a-col>
      </a-row>
      <a-row v-else>
        确认删除端口信息
      </a-row>
    </a-modal>
    <a-modal
      width='1200px'
      title="添加用户"
      :visible="addStaffvisible"
      :maskClosable='false'
      @ok="addStaffOk"
      @cancel="addStaffCancel"
      :footer="null">
      <a-card :bordered="false">
        <!-- <a-steps class="steps" :current="currentTab">
          <a-step title="填写信息" />
          <a-step title="添加用户信息" />
        </a-steps> -->
        <div class="content" v-if='addStaffvisible'>
          <step1 v-if="currentTab === 0" :id='id' :departmentTree='departmentTree' @nextStep="nextStep" @cancel='addStaffCancel'/>
          <!-- <step2 v-if="currentTab === 1" @nextStep="nextStep" @cancel='addStaffCancel'  @prevStep="finish"/> -->
        </div>
      </a-card>
    </a-modal>
    <!-- // 权限控制 -->
    <a-modal
      width='1200px'
      title="权限控制"
      :visible="showOpenPower"
      :maskClosable='false'
      @ok="OpenPowerOk"
      @cancel="OpenPowerCancel"
      :footer="null">
      <a-card :bordered="false">
        <!-- <step3  v-if='showOpenPower' @nextStep="nextStep" :portId='port_id'  @cancel='OpenPowerCancel' :checkAll='checkAll' 
        :countryPermission='country_list' :shopee_site='shopee_site' :group_id='group_id' @prevStep="finish"/> -->
        <step3  v-if='showOpenPower' @nextStep="nextStep" :portId='port_id'  @cancel='OpenPowerCancel' :checkAll='checkAll' 
        :countryPermission='country_list' :shopee_site='shopee_site' :group_id='group_id' @prevStep="finish"/>
      </a-card>
    </a-modal>
    <!-- //修改信息 -->
    <a-modal
      width='1200px'
      title="修改用户信息"
      :visible="updataShows"
      :maskClosable='false'
      @ok="updataShowsOk"
      @cancel="updataShowsCancel"
      :footer="null">
      <a-card :bordered="false">
        <step4 v-if='shownextStep'  @nextStep="nextStep" :port='port'  :departmentTree='departmentTree' :updataID="updataID" :portId='port_id'  @cancel='updataShowsCancel' :checkAll='checkAll' @prevStep="finish"/>
      </a-card>
    </a-modal>
    <!-- //详情页 -->
    <a-modal
      width='1200px'
      title="详情页"
      :visible="DetailsShow"
      :maskClosable='false'
      @cancel="DetailsShowCancel"
      :footer="null">
      <a-card :bordered="false">
        <Step5 
        v-if='DetailsShowStep5'  
        :departmentTree='departmentTree' 
        :DetailID="DetailID"  
        @nextStep="nextStep" 
        @cancel='DetailsShowCancel' 
        :checkAll='checkAll' 
        @prevStep="finish"/>
      </a-card>
    </a-modal>
    <!-- //删除 -->
    <a-modal
      title="删除"
      :visible="delalertShow"
      :maskClosable='false'
      @ok="delOk"
      @cancel="delCancel">
      <span>确定删除吗</span>
    </a-modal>

  </div>
</template>

<script>
import {getDepartment ,addDepartment ,editMerchant, delMerchant,getMerchant ,addMerchant, updateStatus ,delMerchantNew, getStaffList} from '@/api/mermanage'
import STree from '@/components/Tree/Tree'
import Step1 from './modules/step1.vue'
import Step2 from './modules/step2.vue'
import Step3 from './modules/step3.vue'
import Step4 from './modules/step4.vue'
import Step5 from './modules/step5.vue'
import { permsBtn } from '@/utils/static'
import { codeORcountrys } from '@/views/order/public/country'

const provinceData = {
  "EU":"欧洲",
  "NA":"北美",
  "FE":"远东",
};

export default {
  name: 'TreeList',
  components: {
    STree,
    Step1,
    Step2,
    Step3,
    Step4,
    Step5
  },
  data () {
    return {
      provinceData,
      codeORcountrys,
      permsBtn,
      defaultSelectedList:[],
      currentTab: 0,
      openKeys: ['1'],
      searchName:"",
      // 表头
      addvisible:false,
      addLoading:false,
      orgTree: [],
      selectedRowKeys: [],
      selectedRows: [],
      data:[],
      searchPhone:"",
      listLoading:false,
      statusType:true,
      bmName:"",
      bmId:"",
      editShow:true,
      addstate:"",
      addStaffvisible:false,
      current:1,
      page:"",
      status:"",
      statusRadio:"",
      departmentTree:"",
      showOpenPower:false,
      updataShows:false,
      checkAll:"",
      updataID:"",
      addTitle:"",
      strPdata:"",
      selectAll:"",
      shownextStep:false,
      DetailsShow:false,
      DetailsShowStep5:false,
      DetailID:"",
      delalertShow:false,
      delId:"",
      port:"",
      port_id:"",
      countryList:"",
      country_list:"",
      shopee_site:[],
      group_id:''
    }
  },
  methods: {
    handleClick (e) {
      console.log('点击了列表',e)
      this.id = e.key
      // this.oldRortId = e.key
      this.getMerchants()
      // console.log('handleClick', e,'行集合')
      // this.queryParam = {
      //   key: e.key
      // }
      // this.$refs.table.refresh(true)
      // 点击列表时触发
    },
    handleEdit (item,type) {
      console.log('edit')
      // console.log('handleEdit', item,type)
      // this.$message.info(`提示：你点了edit ${item.key} - ${item.title}  `)
      // this.$refs.modal.add(item.key)
      this.addTitle = '编辑端口'
      this.addvisible = true
      this.addstate = 'edit'
      this.bmId= item.key

    },
    handleDel(item,type){
      // console.log('handleDel', item,type)
      this.bmId= item.key
      this.addTitle = '删除端口'
      this.addstate = 'del'
      this.addvisible = true
    },
    handleTitleClick (item) {
      // console.log('handleTitleClick', item)
    },
    titleClick (e) {
      // console.log('titleClick', e)
    },
    handleSaveOk () {

    },
    handleSaveClose () {

    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // tabStatus(){
    //   this.statusType = !this.statusType
    // },
    radioStatus(e){
      // console.log(e,'radioStatus')
      this.getMerchants()
    },
    // 搜索代理商
    searchMerchantName(){
      if(this.searchName.length==0){
        this.$notification.error({
          message: '错误',
          description: '搜索内容不能为空',
        });
      }else{
      }
      // console.log(this.searchName)
    },
    // 编辑
   edit(){
     this.editShow = !this.editShow
     //store
     this.$store.commit('set_TabEdit',this.editShow)
   },
    // 新增代理商
    addOrganize(){
      this.bmName = ''
      this.addvisible=true
      this.addTitle = '新增端口'
      this.addstate = 'add'
    },
    // 新增弹窗
    addOk(){
      // console.log(this.bmName,'bmName')
      //请求新增端口名称
      this.addvisible=false
      if(this.addstate == 'edit'){
        //编辑
        this.addDepartments()
      }else if(this.addstate == 'add'){
        //新增
        this.bmId = ''
        this.addDepartments()
      }else if(this.addstate == 'del'){
        //删除
        this.delMerchants()
      }
    },
    // 新增、修改
    addDepartments(){
      // 把部门id赋值给id 为了获取正确的右侧员工列表
      this.id = this.bmId
      addDepartment({
        uid:this.bmId,
        title:this.bmName
      }).then((res)=>{
        if(res.code === 0){
          // console.log(res.data,'adddata')
          this.getDepartmentList('ban')
          this.bmName = ''
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    delMerchants(){
      delMerchant({
        id:this.bmId
      }).then((res)=>{
        if(res.code === 0){
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
          this.getDepartmentList()
          
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    addCancel(){
      this.addvisible=false
    },
    // 添加员工
    addStaff(){
      this.addStaffvisible = true
    },
    addStaffOk(){
      
    },
    addStaffCancel(){
      this.addStaffvisible = false
      this.currentTab = 0
      this.getMerchants()

    },
    // 分步表单
      // handler
    nextStep () {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.currentTab = 0
    },
    cancel(){
      this.addStaffvisible = false
    },
    // 获取商户列表右侧 员工列表
    getMerchants(){
      getStaffList({
        page_size:"10",
        page:this.current,
        keyword:this.searchPhone,
        status:this.statusRadio,
        // uid:this.id
      }).then((res)=>{
        if(res.code === 0){
          if(Array.isArray(res.data) == true){
            this.data = res.data
            this.page = res.pages
            this.searchPhone = ''
          }else{
            this.data = []
          }
     
          // console.log(this.data,this.searchPhone,'ovee')
          // console.log(Array.isArray(res.data),"isArray")
        }
      })
    },
    // 获取代理商列表 
    getDepartmentList(type){
      getDepartment({
      }).then((res)=>{
        if(res.code === 0){
          this.orgTree = res.data
          this.departmentTree = res.data
          if(res.data){
            let arrayStr = []
            // this.defaultSelectedList = res.data[0].key
            this.defaultSelectedList = arrayStr.concat(res.data[0].key)
            // console.log(this.defaultSelectedList,'defaultSelectedList',this.orgTree)
            if(type != 'ban'){
              this.id = res.data[0].key
            }
            this.getMerchants()
          }
        }
      })
    },
    pagechange(page,pagesize){
      // console.log(page,pagesize)
      this.current = page
      this.getMerchants()

    },
    //切换状态
    statusTab(type,id) {
      let types = type
      if(type =='1'){
        types='0'
      }else if(type =='0'){
        types='1'
      }
      // console.log(id ,type);
      updateStatus({
        id:id,
        status:types
      }).then((res)=>{
        if(res.code === 0){
          this.getMerchants()
        }else{
          this.getMerchants()
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
    },
    // 搜索商户
    serchMerchant(){
      if(this.searchPhone.length>0){
        this.getMerchants()
      }else{
        this.$notification.error({
          message: '错误',
          description: '搜索内容不能为空',
        });
      }
    },
    // 开启权限
    openPower(listId,country_list,shopee_site,group_id,port_id){
      this.port_id = port_id
      this.checkAll=listId
      this.country_list = country_list
      // console.log(this.checkAll,'checkAll')
      this.showOpenPower = true
      this.shopee_site = shopee_site
      this.group_id = group_id
    },
    OpenPowerOk(){

    },
    OpenPowerCancel(){
      this.showOpenPower = false
      this.getMerchants()

    },
    //修改信息
    updataShow(id,port,port_id){
      this.port_id = port_id
      this.updataID = id
      this.port = port
      this.updataShows = true
      this.shownextStep =true
      
    },
    updataShowsOk(){
    },
    updataShowsCancel(){
      this.updataShows = false
      this.shownextStep =false
      this.getMerchants()
    },
    // 详情页
    DetailsShowBTN(id){
      this.DetailID = id
      this.DetailsShow = true
      this.DetailsShowStep5 = true

    },
    DetailsShowCancel(){
      this.DetailsShow = false
      this.DetailsShowStep5 = false

    },
    // 删除商户信息  delMerchantNew
    delmerchant(id){
      this.delalertShow = true
      this.delId = id
    },
    delOk(){
      this.delMerchantNews(this.delId)
    },
    delCancel(){
      this.delalertShow = false
    },
    delMerchantNews(id){
      delMerchantNew({
        id:id
      }).then((res)=>{
        if(res.code === 0){
          this.getMerchants()
          this.delalertShow =false
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
    }

  },
  created () {
    // this.getDepartmentList()
    this.getMerchants()
  },
  mounted(){
    this.$store.commit('set_TabEdit',this.editShow)
  },
}
</script>

<style lang="less">
.ml-sm{margin-left: 10px;}
  .custom-tree {
    /deep/ .ant-menu-item-group-title {
      position: relative;
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .ant-menu-item {
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .btn {
      display: none;
      position: absolute;
      top: 0;
      right: 50px;
      width: 20px;
      height: 40px;
      line-height: 40px;
      z-index: 1050;

      // &:hover {
      //   transform: scale(1.2);
      //   transition: 0.5s all;
      // }
    }
  }
  .tree-title{
    background:#1890ff;
    height: 40px;
    // border-radius: 5px;
    line-height: 40px;
    .title-txt{
      color: #fff;
      
    }
    .cardmer{
      background:#f0f2f5;
      padding:0;
    }
  }
</style>
<style lang="less" >
  .tree-wrapper .ant-menu-inline{
      border-right: 0 solid #e8e8e8;
    }
  .links{
    color: #1890ff;
  }
  .tar{text-align: right;}
  .tree-height{
    max-height: 650px;
    overflow-y:scroll;
    overflow-x:hidden;
  }
  .cursor{cursor:pointer}
  ::-webkit-scrollbar-track-piece { //滚动条凹槽的颜色，还可以设置边框属性
  background-color:#f8f8f8;
  }
  ::-webkit-scrollbar {//滚动条的宽度
  width:9px;
  height:9px;
  }
  ::-webkit-scrollbar-thumb {//滚动条的设置
  background-color:#dddddd;
  background-clip:padding-box;
  min-height:28px;
  }
  ::-webkit-scrollbar-thumb:hover {
  background-color:#1890ff;
  }
  .box-height{
    min-height:600px;
  }
  .lin-height{
    line-height: 32px;
  }
  .over-menu{
  width:100% !important; 
  }
</style>
