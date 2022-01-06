<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item label="选择用户角色"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} } "
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} } ">
        <a-select placeholder="请选择" v-model='selectoption' v-decorator="[ 'selectoption', { rules: [{ required: true, message: '请选择用户角色' }] } ]">
          <a-select-option v-for='(item,index) in data' :value="item.id" :key='index'>{{item.title}}</a-select-option>
        </a-select>
        <div v-if="this.data.length === 0" style="position:absolute; right:-115px; top:-10px; cursor:pointer; color:rgb(22,182,232)" @click="jumpRouterSet()">无角色, 去设置 →</div>
      </a-form-item>
      <a-form-item
        label="用户名称"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }"
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }">
        <a-input
        v-model = "username"
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入用户名称' }]}
          ]"
          name="name"
          placeholder="请输入用户名称" />
      </a-form-item>

      <a-form-item
        label="密码"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span:8} }"
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span:8} }">
        <a-input type="password"
         v-model = "pwd"
            v-decorator="[
              'password',
              {rules: [{ required: true, message: '请输入密码' }]}
            ]"
            name="password"
            placeholder="请输入密码" />
      </a-form-item>
      <!-- <a-form-item
        label="手机号"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
         v-model = "mobile"
          v-decorator="[
            'mobile',
            {rules: [{ required: true, message: '请输入11位手机号' }]}
          ]"
          name="mobile"
          placeholder="请输入11位手机号" />
      </a-form-item> -->

      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-row type="flex" justify="center">
          <a-col :md="{span: 10, offset: 6}" :lg="{span: 11, offset: 9}" :xl="{span: 10, offset: 6}" :xxl="{span: 8, offset: 0}">
            <a-button htmlType="submit" type="primary" style="width:100%">提交</a-button>
          </a-col>
        </a-row>
        <!-- <a-button style="margin-left: 8px">保存</a-button> -->
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { getchildupdate ,getgroup} from '@/api/manage'
export default {
  name: 'BaseForm',
  data () {
    return {
      value: 1,
      username:"",
      pwd:"",
      mobile:"",
      address:"",
      form: this.$form.createForm(this),
      data:[],
      selectoption:'',
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          getchildupdate(
            {
              group_id:this.selectoption,
              username:this.username,
              password:this.pwd,
            }
          ).then(res => {
            if(res.code === 0){
            //  提示信息
              this.$notification.success({
                message: '成功',
                description:res.msg,
              });
              this.$router.push({
                path:'/systemSetings/myInfo'
              })
            }else{
              this.$notification.error({
                message: '错误',
                description:res.msg,
              });
            }
          })
        }
      })
    },
    getgroups () {
      getgroup({
        type:'options'
      }).then(res => {
        if(res.code === 0){
          if(res.data.length > 0) {
            this.data = res.data
            console.log(this.data)
          }
          // console.log(res.data,"getgroup")
          // this.$notification.success({
          //   message:'成功',
          //   description: res.msg,
          // });
        }else{
          this.$notification.error({
            message:'提醒',
            description: res.msg,
          });
        }
      })
    },
    jumpRouterSet() {
      this.$router.push({
        name: 'addrole'
      })
    }
  },
  created(){
    this.getgroups();
  },
  mounted(){
  }
}
</script>
<style lang="less" scoped>
 .ant-select-enabled {
   position:relative;
  }
</style>