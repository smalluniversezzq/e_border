<template>
  <div>
    <a-card :bordered="false" class='cardmer'>
      <a-row :gutter="8">
        <a-col :span="5" style='background:#fff; border-right: 1px solid #e8e8e8;' >
          <div class="mt">
            <a-button class='ml-sm ' v-if='hasPerm(permsBtn.role_getNumber)' @click='addOrganize'>新增</a-button> 
            <a-button class='ml-sm ' v-if='hasPerm(permsBtn.role_editLogistics)'  @click='edit()' >{{editShow ? "编辑" : "取消编辑"}}</a-button>
          </div>
          <s-tree
            :dataSource="orgTree"
            :openKeys.sync="openKeys"
            :defaultSelectedKeys='defaultSelectedKeys'
            :search="false"
            @click="handleClick"
            @edit="handleEdit"
            @del="handleDel"
            @titleClick="handleTitleClick">
          </s-tree>
        </a-col>
        <a-col :span="19" v-show="allData.length > 0">
          <a-row>
            <a-col style="text-align: right;">
              <a-button type="primary" style="margin-bottom:40px;width:100px" @click="saveData">保存</a-button>
            </a-col>
          </a-row>


          <a-row :gutter="1">
            <a-col :span="6">
              <a-card style="text-align:center;font-weight:bold">
                一级模块
              </a-card>
            </a-col>
            <a-col :span="6">
              <a-card style="text-align:center;font-weight:bold">
                二级模块
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card style="text-align:center;font-weight:bold">
                功能权限
                <a-checkbox v-model="selectAllStatus" @change="selectAll()"></a-checkbox>
              </a-card>
            </a-col>
          </a-row>
          <a-row :gutter="1">
            <a-col :span="6">
              <a-card class="item-wrap" :class="{ active: item.status }" v-for="(item,index) in allData" :key="index" @click="handleModeOne(item)">
                {{item.title}}
              </a-card>
            </a-col>
            <a-col :span="6">
              <!-- <a-card class="item-wrap" v-for="(item,index) in modeTwo" :key="index" @click="handleModeTwo(item, index)" :disabled="disabled"> -->
              <a-card class="item-wrap" v-for="(item,index) in modeTwo" :key="index">
                <span>{{item.title}}</span>
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card style="height:100px" v-for="(item,index) in modeThree" :key="index">
                <a-checkbox style="width:120px;margin-left: 0;"
                  v-model="items.status" v-for="(items, indexs) in item" :key="indexs" @change="selectOne()">
                  {{items.title}}
                </a-checkbox>
              </a-card>
            </a-col>
          </a-row>
          <!-- <a-menu :openKeys="openKeysOne" mode="horizontal" class="level">
            <a-sub-menu key="modeOne" class="mode">
              <span slot="title" class="submenu-title-wrapper">一级模块</span>
              <a-menu-item class="itemMode" v-for="(item, index) in modeOne" :key="index" @click="handleModeOne(item)" style="width:100%">
                {{item.title}}
              </a-menu-item>
            </a-sub-menu>
          </a-menu>

          <a-menu :openKeys="openKeysTwo" mode="horizontal" class="level">
            <a-sub-menu key="modeTwo" class="mode">
              <span slot="title" class="submenu-title-wrapper">二级模块</span>
              <a-menu-item class="itemMode" v-for="(item, index) in modeTwo" :key="index" @click="handleModeTwo(item, index)" :disabled="disabled" style="width:100%">
                {{item.title}}
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
          
          <a-menu :openKeys="openKeysThree" mode="horizontal" class="level">
            <a-sub-menu key="modeThree" class="mode">
              <span slot="title" class="submenu-title-wrapper">权限</span>
              <a-menu-item id='item-level-three-id' v-for="(item, index) in modeThree" :key="index" >
                <a-checkbox  @change="handleModeThree($event,items)" v-for="(items, indexs) in item.menu" :key="indexs" :checked="items.status == '1' ? true : false">
                  {{items.title}}
                </a-checkbox>
              </a-menu-item>
            </a-sub-menu>
          </a-menu> -->
        </a-col>
      </a-row>
    </a-card>
    <a-modal
      :title="addTitle"
      :visible="addvisible"
      :maskClosable='false'
      @ok="addOk"
      :confirmLoading="addLoading"
      @cancel="addCancel"
    >
      <a-row v-if='addstate !== "del"'>
        <!-- <a-col :span="10" v-if='addstate == "add"'>
          <a-select  style="width: 180px" @change="handleChange">
            <a-select-option v-model="item.id" v-for='(item,index) in getPackage' :key='index'>{{item.title}}</a-select-option>
          </a-select>
        </a-col> -->
        <a-col :span='4' class='tar'> 角色名称：</a-col>
        <a-col :span='10'>
          <a-input v-model='bmName' :style="{ display: 'inline-block', width: 'calc(90% - 12px)' }" />
        </a-col>
      </a-row>
      <a-row v-else>
        确认删除角色信息
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import {
  deleteRloe,
  addRloe,
  editRole,
  getMerchants,
  editRule,
  getRoleList,
  getRulest,
  getPermissionInfo,
  getMerchantList,
  addDepartment,
  editMerchant,
  delMerchant,
  getMerchant,
  addMerchant,
  updateStatus,
  delMerchantNew,
  getPackage,
  getPermission
} from '@/api/agents'

import { handlerData } from '@/utils/util'
import STree from '@/components/Tree/TreeOne.jsx'
// import STree from '@/components/Tree/Tree'
import { permsBtn } from '@/utils/static'

export default {
  name: 'rule',
  components: {
    STree
  },
  data() {
    return {
      permsBtn,
      id: 0,
      role_id: '',  //角色ID
      modeOne: [], //一级模块
      modeTwo: [],//二级模块
      modeThree: [],//三级模块权限
      current: ['mail'],
      openKeysOne: ['modeOne'],
      openKeysTwo: [],
      openKeysThree: [],
      allLevelList: [], // 二级三级的 id
      status: '',
      // checkAll: false
      searchName:"",
      orgTree: [],
      openKeys: ['1'],
      defaultSelectedKeys:[],
      editShow:true,
      addTitle:"",
      addvisible:false,
      addLoading:false,
      addstate:"",
      bmName:"",
      role_id: "",
      bmId: '',
      levelArr: [],
      threeList: [],
      getPackage: [],
      userId: '',
      disabled: false,
      selectAllStatus:false,
      allData:[]
    }
  },
  created() {
    //获取权限列表
    this.getDepartmentList()
  },
  mounted() {
    this.$store.commit('set_TabEdit', this.editShow)
  },

  methods: {
    // 获取代理商列表
    getDepartmentList(type) {
      console.log("getDepartmentList")
      getRoleList({
        })
        .then((res) => {
          if (res.code === 0) {
            let data = handlerData(res.data)
            this.orgTree = data
            this.departmentTree = data
            if (data.length > 0) {
              this.role_id = data[0].key
              this.id = 0
              this.getPermission(0)
              this.defaultSelectedKeys[0] = data[0].key
              // this.role_id = data[0].key
            }
            if (type) {
              this.$notification.success({
                message: '提示',
                description: res.msg
              })
            }
          } else {
            this.$notification.error({
              message: '提示',
              description: res.msg
            })
          }
        })
    },
    handleClick (e) {
      this.role_id = e.key
      // console.log('handleClick', e, '行集合')
      this.getPermission(0)
      // this.getMerchants()
      // this.queryParam = {
      //   key: e.key
      // }
      // this.$refs.table.refresh(true)
      // 点击列表时触发
    },
    handleEdit(item, type) {
      // console.log('edit')
      // console.log('handleEdit', item, type)
      // this.$message.info(`提示：你点了edit ${item.key} - ${item.title} 111 `)
      // this.$refs.modal.add(item.key)
      this.bmName = item.title
      this.addTitle = '编辑角色'
      this.addvisible = true
      this.addstate = 'edit'
      this.bmId= item.key
    },
    handleDel(item, type) {
      // console.log('handleDel', item, type)
      // this.bmName = item.title
      this.bmId= item.key
      this.addTitle = '删除角色'
      this.addstate = 'del'
      this.addvisible = true
    },
    handleTitleClick(item) {
      // console.log('handleTitleClick', item)
    },
    // 搜索代理商
    searchMerchantName(){
      if(this.searchName.length == 0) {
        this.$notification.error({
          message: '错误',
          description: '搜索内容不能为空',
        });
      }else{
        this.getDepartmentList()
      }
      // console.log(this.searchName)
    },
    //获取代理商下的套餐  接口
    getPackageList() {
      getPackage({})
        .then(res => {
          if(res.code == 0) {
            this.getPackage = res.data
          }
        })
    },
    // 新增代理商
    addOrganize(){
      // 获取代理商下的套餐
      // console.log('asd')
      // this.getPackageList()
      this.bmName = ''
      this.addvisible=true
      this.addTitle = '新增角色'
      this.addstate = 'add'
    },
     // 编辑
    edit(){
      this.editShow = !this.editShow
      //store
      this.$store.commit('set_TabEdit', this.editShow)
      this.$store.commit('set_TabEdit', this.editShow)
      // console.log(this.$store.state.MerchantManege.tabEdit,'editShow')
    },
    // 新增、修改
    // addDepartments(){
    //   addDepartment({
    //     id:this.bmId,
    //     name:this.bmName
    //   }).then((res)=>{
    //     if(res.code === 0){
    //       // console.log(res.data,'adddata')
    //       this.getDepartmentList()
    //     }else{
    //       this.$notification.error({
    //         message: '错误',
    //         description: res.msg
    //       })
    //     }
    //   })
    // },
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
    // 新增弹窗
    addOk() {
      // console.log(this.bmName, 'bmName')
      //请求新增角色名称
      this.addvisible = false
      if (this.addstate == 'edit') {
        //编辑
        this.editRole()
      } else if (this.addstate == 'add') {
        //新增
        this.addRloe()
      } else if (this.addstate == 'del') {
        //删除
        this.deleteRloe()
      }
    },
    // 新增
    addRloe() {
      addRloe({
          // group_id: this.userId,
          title: this.bmName
        })
        .then(res => {
          if (res.code === 0) {
            this.getDepartmentList(1)
          } else {
            this.$notification.error({
              message: res.msg,
              description: res.msg
            })
          }
        })
    },
    // 编辑
    editRole() {
      editRole({
          title: this.bmName,
          id: this.bmId
        })
        .then(res => {
          if (res.code === 0) {
            this.getDepartmentList(1)
          } else {
            this.$notification.error({
              message: res.msg,
              description: res.msg
            })
          }
          
        })
    },
    // 删除
    deleteRloe() {
      deleteRloe({
          id: this.bmId
        })
        .then(res => {
          if (res.code === 0) {
            this.getDepartmentList(1)
          } else {
            this.$notification.error({
              message: res.msg,
              description: res.msg
            })
          }
          
        })
    },
    addCancel() {
      this.addvisible = false
    },
    getPermissionData(type,id){
      return getPermission({
        id: this.role_id,
        // id: this.id
      }).then(res=>{
        if (res.code === 0) {
          return res.data
        }
      })
    },
    getPermission(type){
      let _this = this
      _this.allData = []
      _this.getPermissionData(type).then(res=>{
        //一级
        _this.modeOne = handlerData(res)
        _this.modeOne.forEach((item,index)=>{
          _this.allData.push({
            id:item.id,
            title:item.title,
            status:0,
            children1:[],
            children2:[]
          })
        })
        //二级
        _this.allData.forEach((item,index)=>{
          let data = _this.modeOne
          if(index == 0){
            item.status = 1
            _this.modeTwo = data[0].child
          }
          item.children1 = data[index].child
          //三级
          item.children1.forEach((itm,idx)=>{
            if(itm.child){
              item.children2.push(itm.child)
            }else{
              item.children2.push([])
            }
          })
          if(index==0){
            _this.modeThree = item.children2
            let count = 0
            _this.modeThree.forEach((itm,idx)=>{
              itm.forEach((itms,idxs)=>{
                if(!itms.status){
                  count++
                }
              })
            })
            if(count){
              _this.selectAllStatus = false
            }else{
              _this.selectAllStatus = true
            }
          }
        })
      })
    },
    // getPermission(type, index, status) {
    //   getPermissionInfo({
    //       level: type,
    //       role_id: this.role_id,
    //       id: this.id
    //     })
    //     .then(res => {
    //       if (res.code === 0) {
    //         // console.log(res.data)
    //         // 一级模块
    //         if (type === 0) {
    //           //赋值给一级模块列表权限
    //           this.modeOne = res.data
    //           this.modeTwo = []
    //           this.modeThree = []
    //         }
    //         // 二级模块
    //         if (type === 1) {
    //           this.modeTwo = res.data
    //           if (this.modeTwo.length > 0) {
    //             this.openKeysTwo.push('modeTwo')
    //           } else {
    //             this.openKeysTwo.splice(0, 1)
    //             this.$notification.error({
    //               message: '提示',
    //               description: '没有下级菜单',
    //               duration: 3
    //             });
    //           }
    //         }
    //         // 三级权限
    //         if (type === 2) {
    //           if (JSON.stringify(res.data) !== '{}') {
    //             if (status == 1) {
    //               this.threeList.push(res.data)
    //               this.modeThree.splice(index, 0, res.data)
    //               if (this.modeThree.length > 0) {
    //                 this.openKeysThree = ['modeThree']
    //               } else {
    //                 this.openKeysThree.splice(0, 1)
    //               }
    //               // } else if(this.status === 'false') {
    //             } else if (status == 0) {
    //               this.threeList.forEach((item, index) => {
    //                 if (this.id == item.id) {
    //                   this.threeList.splice(index, 1)
    //                 }
    //               })
    //               this.modeThree.forEach((item, index) => {
    //                 if (this.id == item.id) {
    //                   this.modeThree.splice(index, 1)
    //                 }
    //               })
    //               if (this.modeThree.length < 0) {
    //                 // this.modeThree.splice(index, 1)
    //                 this.modeThree = []
    //               }

    //               // 控制样式
    //               if (this.modeThree.length > 0) {
    //                 this.openKeysThree = ['modeThree']
    //               } else {
    //                 this.openKeysThree.splice(0, 1)
    //               }
    //             }
    //           } else {
    //             this.$notification.error({
    //               message: '提示',
    //               description: '没有下级权限',
    //               duration: 3
    //             });
    //           }
    //         }
    //       } else {
    //         this.$notification.error({
    //           message: '提示',
    //           description: res.msg,
    //           duration: 3
    //         });
    //       }
    //     })
    // },
    handleModeOne(items) {
      this.allData.forEach((itm,index)=>{
        if(itm.id == items.id){
          itm.status = 1
          this.modeTwo = itm.children1
          this.modeThree = itm.children2
          let count = 0
          this.modeThree.forEach((itm,idx)=>{
            itm.forEach((itms,idxs)=>{
              if(!itms.status){
                count++
              }
            })
          })
          if(count){
            this.selectAllStatus = false
          }else{
            this.selectAllStatus = true
          }
        }else{
          itm.status = 0
        }
      })
      
      //获取二级模块
      // this.id = items.id
      // this.modeThree = []
      // this.modeTwo = []
      // this.getPermission(1)
    },
    handleModeTwo(items, index) {
      let _this = this
      _this.id = items.id
      // console.log(index)
      // console.log(items.status)
      _this.modeTwo.forEach((item, index) => {
        if (item.id == _this.id) {
          if (item.status == 0) {
            item.status = 1
          } else {
            item.status = 0
          }
        }
      })
      //获取三级模块
      _this.disabled = true
      _this.getPermission(2, index, items.status)
      setTimeout(function() {
        _this.disabled = false
      }, 1200)
    },
    handleModeThree(e, items) {
      // console.log(`checked = ${e.target.checked}`);
      this.id = items.id
      if (`${e.target.checked}` === 'true') {
        items.status = 1
        this.threeList.forEach((item, index) => {
          item.menu.forEach((itemss, index) => {
            if (this.id == itemss.id) {
              itemss.status = items.status
            }
          })
        })
      } else {
        items.status = 0
        this.threeList.forEach((item, index) => {
          item.menu.forEach((itemss, index) => {
            if (this.id == itemss.id) {
              itemss.status = items.status
            }
          })
        })
      }
      // console.log(this.threeList)
      // console.log(this.levelArr, '三级')
    },
    handleChange(value) {
      this.userId = value
      // console.log(value)
    },
    saveData() {
      // console.log(this.levelArr, '最后的levelArr')
      // let saveDataList = []
      // let threeDataList = []
      // let rules = ''
      // this.threeList.forEach((item, index) => {
      //   item.menu.forEach((items, index) => {
      //     threeDataList.push(items)
      //   })
      // })
      // threeDataList.forEach((item, index) => {
      //   if (item.status == 1) {
      //     saveDataList.push(item.id)
      //   }
      // })
      // this.levelArr.forEach((item, index) => {
      //   if (item.status == 1) {
      //     saveDataList.push(item.id)
      //   }
      // })
      // console.log(saveDataList)
      // rules = saveDataList.join(',')
      // console.log(rules, 'rules')
      let rules = []
      this.allData.forEach((data,index)=>{
        data.children2.forEach((item,indx)=>{
          item.forEach((itm,idx)=>{
            if(itm.status == 1){
              rules.push(itm.id)
            }
          })
        })
      })
      editRole({
          id: this.role_id,
          // rules: rules,
          rules: rules.toString(),
        })
        .then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
          } else {
            this.$notification.error({
              message: '提示',
              description: res.msg
            })
          }
        })
    },
    selectAll(){
      // this.selectAllStatus = !this.selectAllStatus;
      if(this.selectAllStatus){
        this.modeThree.forEach((itm,idx)=>{
          itm.forEach((itms,idxs)=>{
            itms.status = 1
          })
        })
      }else{
        this.modeThree.forEach((itm,idx)=>{
          itm.forEach((itms,idxs)=>{
            itms.status = 0
          })
        })
      }
      // console.log(this.allData)
    },
    selectOne(){
      let count = 0
      this.modeThree.forEach((itm,idx)=>{
        itm.forEach((itms,idxs)=>{
          if(itms.status != 1){
            count++
          }
        })
      })
      if(count){
        this.selectAllStatus = false
      }else{
        this.selectAllStatus = true
      }
    }
  },
}
</script>

<style lang="less" scoped>
  .active{
    background-color: #e6f7ff;
  }
  .item-wrap{
    text-align:center;
    height:100px;
    line-height: 50px;
  }
  .ml-sm{margin-left: 10px;}
  // .cardmer {
  //   background:#ffffff;
  //   padding:0;
  //   min-height: 1050px;
  // }
  .tree-title{
    background:#1890ff;
    height: 40px;
    line-height: 40px;
    .title-txt{
      color: #fff;
      
    }
    .cardmer{
      background:#f0f2f5;
      padding:0;
    }
  }
@media screen and (min-width: 312px) and (max-width: 800px) {
  .level {
    width: 190px;
  }
  .mode {
    width: 190px;
  }
  .itemMode {
    width: 190px;
  }
  #item-level-three-id {
    width: 190px;
  }
}
@media screen and (min-width: 801px) and (max-width: 1280px) {
  .level {
    width: 200px;
  }
  .mode {
    width: 200px;
  }
  .itemMode {
    width: 200px;
  }
  #item-level-three-id {
    width: 200px;
  }
}
@media screen and (min-width: 1281px) and (max-width: 1400px) {
  .level {
    width: 230px;
  }
  .mode {
    width: 230px;
  }
  .itemMode {
    width: 230px;
  }
  #item-level-three-id {
    width: 230px;
  }
}
@media screen and (min-width: 1401px) and (max-width: 1600px) {
  .level {
    width: 250px;
  }
  .mode {
    width: 250px;
  }
  .itemMode {
    width: 250px;
  }
  #item-level-three-id {
    width: 250px;
  }
}
@media screen and (min-width: 1601px) {
  .level {
    width: 300px;
  }
  .mode {
    width: 300px;
  }
  .itemMode {
    width: 300px;
  }
  #item-level-three-id {
    width: 300px;
  }
}
  .level {
    float: left;
  }
  .mode {
    border: 1px solid #efefef;
    height: 58px;
    line-height: 58px;
    text-align: center;
  }
  .itemMode {
    border: 1px solid #efefef;
    height: 70px;
    line-height: 70px;
    margin-top: 0px;
    margin-bottom: 0px;
    text-align: center;
  }
  .ant-menu-vertical .ant-menu-item:not(:last-child), .ant-menu-vertical-left .ant-menu-item:not(:last-child), .ant-menu-vertical-right .ant-menu-item:not(:last-child), .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin-bottom: 0px;
  }
  .ant-menu-vertical.ant-menu-sub .ant-menu-item, .ant-menu-vertical-left.ant-menu-sub .ant-menu-item, .ant-menu-vertical-right.ant-menu-sub .ant-menu-item {
    border-right: 1px;
  }
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
</style>
<style lang="less" scoped>
.ant-card-wider-padding .ant-card-body{
      padding: 10px 32px  24px!important;
}
  #item-level-three-id{
    border: 1px solid #efefef;
    height: 70px;
    line-height: 35px;
    margin-top: 0px;
    margin-bottom: 0px;
    text-align: center;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap ;
    overflow-y: scroll;
    justify-content:  flex-start;
  }
  .tree-wrapper .ant-menu-inline{
      border-right: 0 solid #e8e8e8;
    }
  .links{
    color: #1890ff;
  }
  .tar{text-align: right;}
  .tree-height{
    min-height: 650px;
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
  .ant-menu-submenu-popup {
    z-index: 0
  }
  .ant-menu-submenu .ant-menu-submenu-popup .ant-menu-light {
    top:250px;

  }
</style>
<style lang="less">
  // .custom-tree {
  //   /deep/ .ant-menu-item-group-title {
  //     position: relative;
  //     &:hover {
  //       .btn {
  //         display: block;
  //       }
  //     }
  //   }

  //   /deep/ .ant-menu-item {
  //     &:hover {
  //       .btn {
  //         display: block;
  //       }
  //     }
  //   }

  //   /deep/ .btn {
  //     display: none;
  //     position: absolute;
  //     top: 0;
  //     right: 50px;
  //     width: 20px;
  //     height: 40px;
  //     line-height: 40px;
  //     z-index: 1050;

  //     // &:hover {
  //     //   transform: scale(1.2);
  //     //   transition: 0.5s all;
  //     // }
  //   }
  // }

  //分割
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
.over-menu{
  width:100% !important; 
}
.tar{
  text-align: right;
}
</style>
