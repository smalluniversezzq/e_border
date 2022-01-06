<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="角色名称"
        :labelCol="{ md: {span:7}, lg: {span: 9}, xl: {span: 8} ,xxl:{span:8} }"
        :wrapperCol="{ md: {span:14}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }">
        <a-input
          rows="4"
          placeholder="请填写角色名称"
          v-decorator="[
            'userName',
            {rules: [{ required: true, message: '请填写角色名称' }]}
          ]" />
      </a-form-item>
      <a-form-item label="状态"
       :labelCol="{ md: {span:7}, lg: {span: 9}, xl: {span: 8} ,xxl:{span:8} }"
        :wrapperCol="{ md: {span:14}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }">
          <a-select v-model="state" >
            <a-select-option value="1">开启</a-select-option>
            <a-select-option value="0">禁用</a-select-option>
          </a-select>
      </a-form-item>
      <!-- <a-form-item label="拥有权限"
        :labelCol="{ md: {span:7}, lg: {span: 9}, xl: {span: 8} ,xxl:{span:8} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 15}, xl: {span: 16} ,xxl:{span:9} }" >
        <a-row type='flex' align='middle ' v-for="(item, index) in treedata" :key="index" >
          <a-col :md="24" :lg="24" :xl="24" :xxl="24" >
            <a-checkbox-group @change="onChange" :defaultValue="showdefaultValue">
              <a-checkbox style="float:left;" :defaultChecked='true' :value="item.id">{{ item.title}}</a-checkbox>
              <a-checkbox style="float:left;" :defaultChecked='true' :value="i.id" v-for='(i,v) in item.children' :Key="v">{{ i.title}}</a-checkbox>
            </a-checkbox-group >
          </a-col>
        </a-row>
      </a-form-item> -->
      <a-form-item label="拥有权限"
        :labelCol="{ md: {span:7}, lg: {span: 9}, xl: {span: 8} ,xxl:{span:8} }"
        :wrapperCol="{ md: {span:14}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }">
             <a-checkbox-group @change="onChange" :defaultValue="showdefaultValue">
              <a-row  type='flex' align='middle ' v-for="(item, index) in treedata" :key="index" >
                  <a-col>
                    <a-checkbox :defaultChecked='true' :value="item.id">{{ item.title}}</a-checkbox>
                    <a-checkbox :defaultChecked='true' :value="i.id" v-for='(i,v) in item.children' :Key="v">{{ i.title}}</a-checkbox>
                  </a-col>
              </a-row>
             </a-checkbox-group >
       </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-row type="flex" justify="center">
          <a-col :md="{span: 14, offset: 4}" :lg="{span: 11, offset: 5}" :xl="{span: 10, offset: 2}" :xxl="{span: 8, offset: 0}">
            <a-button htmlType="submit" type="primary" style="width:100%">提交</a-button>
          </a-col>
        </a-row>
        <!-- <a-button style="margin-left: 8px">保存</a-button> -->
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { getchildupdate ,getgroup ,getMenu ,groupUpdate} from '@/api/manage'
// import { getRoleList, getPermissions ,getMenu,groupUpdate} from '@/api/manage'
export default {
  name: 'addrole',
  data () {
    return {
      value: 1,
      form: this.$form.createForm(this),
      state:"",
      permissiones:"",
      checkedValues:"",
      jsnames:"",
      names:"",
      permissionId:'',
      id:"",
      userName:"",
      treedata:"",
      showdefaultValue:[],
    }
  },
  created(){
    this.id = this.$route.query.id
    this.getgroups()
  },
  mounted(){
    this.id = this.$route.query.id
    this.loadPermissions()
    this.jsnames = this.$route.query.title
    this.state = this.$route.query.status
    this.form.setFieldsValue({
        userName:this.jsnames,
      });

  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values)
          let str = '';
          // console.log(this.checkedValues)
          if(this.checkedValues.length > 0) {
            for(var i = 0 ;i < this.checkedValues.length ; i++){
              // console.log(this.checkedValues[i])
              str += (this.checkedValues[i] + ',')
            }
            this.permissionId = str.slice(0,-1)
            this.userName = values.userName
            // console.log(this.id,"id", values.userName,"name",this.permissionId,"permissionId",this.state,"status")
            groupUpdate(
              {
                id:this.id,
                title:this .userName,
                rules:this.permissionId,
                status:this.state
              }
            ).then(res => {
              if(res.code === 0){
                this.$router.push({
                  path:'/power/userlist'
                })
              }else{
                this.$notification.error({
                  message: '错误',
                  description:res.msg,
                });
              }
            })
          }else {
            // console.log(this.showdefaultValue)
            str = this.showdefaultValue.join(',')
            // console.log(str)
            this.permissionId = str
            this.userName = values.userName
            groupUpdate(
              {
                id:this.id,
                title:this .userName,
                rules:this.permissionId,
                status:this.state
              }
            ).then(res => {
              if(res.code === 0){
                this.$router.push({
                  path:'/power/userlist'
                })
              }else{
                this.$notification.error({
                  message: '错误',
                  description:res.msg,
                });
              }
            })
          }
        }
      })
    },
    getgroups(){
      // console.log(this.showdefaultValue,"====")
      this.showdefaultValue = []
      getgroup({
        id: this.id
      }).then((res)=>{
        if(res.code === 0 ){
          //   KKK反显出勾选的复选框
          res.data.forEach((item,index)=>{
            this.showdefaultValue.push(item.id)
            // console.log(this.showdefaultValue,"_____________________")
          })
        }
      })
    },
    onChange(checkedValues){
      // console.log('checked = ', checkedValues)
      this.checkedValues = checkedValues
      // console.log(this.checkedValues)
    },
    loadPermissions () {
      getMenu().then(res => {
        if(res.code === 0 ){
          // res.data.shift()
          this.treedata = res.data
          // console.log(this.treedata)
          // console.log(res.data,"addrole")
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
// .mt-sm{margin-top:10px;}
.ant-checkbox-wrapper-disabled {
  margin-right: 8px !important;
}
.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0px;
}
</style>