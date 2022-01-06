<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="旧密码"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} } "
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} } ">
        <a-input
        type='password'
        v-model = "oldPassword"
          v-decorator="[
            'oldPassword',
            {rules: [{ required: true, message: '请输入旧密码' }]}
          ]"
          name="oldPassword"
          placeholder="请输入旧密码" />
      </a-form-item>

      <a-form-item
        label="新密码"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} } "
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} } ">
        <a-input type="password"
         v-model = "newPassword "
            v-decorator="[
              'newPassword',
              {rules: [{ required: true, message: '请输入新密码' }]}
            ]"
            name="newPassword"
            placeholder="请输入新密码" />
      </a-form-item>

      <a-form-item
        label="重复新密码"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} } "
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} } ">
        <a-input type="password"
         v-model = "newPasswords"
            v-decorator="[
              'newPasswords',
              {rules: [{ required: true, message: '请重复输入新密码' }]}
            ]"
            name="newPasswords"
            placeholder="请重复输入新密码" />
      </a-form-item>
        <a-row>
          <a-col @click="toforgetpwd" :md="{offset: 18}" :lg="{offset: 20}" :xl="{offset: 18}" :xxl="{offset: 15}" style="color: #969696">忘记密码</a-col>
        </a-row>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
       <a-row type="flex" justify="center">
         <a-col :md="{span: 10, offset: 6}" :lg="{span: 11, offset: 9}" :xl="{span: 10, offset: 6}" :xxl="{span: 8, offset: 0}">
           <a-button htmlType="submit" type="primary" style="width:100%">提交</a-button>
         </a-col>
       </a-row>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { updatePassword } from '@/api/myinfo'
export default {
  name: 'uppwd',
  data () {
    return {
      value: 1,
      form: this.$form.createForm(this),
      data:"",
      selectoption:'',
      newPasswords:"",
      oldPassword:"",
      newPassword:"",
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
           var reg = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$"); 
           if(this.newPasswords === this.newPassword){
            if(!reg.test(this.newPassword)){
              this.$notification.error({
                  message: '错误',
                  description:'密码不能为纯数字且大于6位',
                });
            }else{
              updatePassword(
                {
                  hasPassword:"1",
                  oldPassword:this.oldPassword,
                  newPassword:this.newPassword
                }
              ).then(res => {
                if(res.code === 0){
                //  提示信息
                  this.$notification.success({
                    message: '成功',
                    description:res.msg,
                  });
                  this.$router.push({
                    path:'/systemSetings/myInfo/myinfos'
                  })
                }else{
                  this.$notification.error({
                    message: '错误',
                    description:res.msg,
                  });
                }
              })
            }
          }else{
            this.$notification.error({
              message: '错误',
              description:'两次输入的密码不一致',
            });
          }
        }
      })
    },
    toforgetpwd(){
      this.$router.push({
        path:"/systemSetings/myInfo/forgetpwd"
      })
    },
    // getgroups () {
    //   getgroup({
    //     type:'options'
    //   }).then(res => {
    //     if(res.code === 0){
    //       this.data = res.data
    //       console.log(res.data,"getgroup")
    //       this.$notification.success({
    //         message:'成功',
    //         description: res.msg,
    //       });
    //     }else{
    //       this.$notification.error({
    //         message:'提醒',
    //         description: res.msg,
    //       });
    //     }
    //   })
    // },
  },
  created(){
    // this.getgroups();
  },
  mounted(){
  }
}
</script>
<style lang="less" scoped>
.ml{margin-left:20px;}
@media screen and (min-width: 1200px) {
  .ml {
    width: 88% !important;
  }
}
</style>

