<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="账户名"
        :labelCol="{lg: {span: 10}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 5}, sm: {span: 17} }">
        <span>{{this.$store.state.user.username}}</span>
      </a-form-item>

      <a-form-item
        label="新密码"
        :labelCol="{lg: {span: 10}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 5}, sm: {span: 17} }">
        <a-input
        type='password'
        v-model = "newPassword"
          v-decorator="[
            'newPassword',
            {rules: [{ required: true, message: '请输入新密码' }]}
          ]"
          name="newPassword"
          placeholder="请输入新密码" />
      </a-form-item>

      <a-form-item
        label="手机号"
        :labelCol="{lg: {span: 10}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 5}, sm: {span: 17} }">
        <a-input type="text"
         v-model = "mobile "
            v-decorator="[
              'mobile',
              {rules: [{ required: true, message: '请输入手机号' }]}
            ]"
            name="mobile"
            placeholder="请输入手机号" />
      </a-form-item>
      <a-form-item
        label="验证码"
        :labelCol="{lg: {span: 10}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 5}, sm: {span: 17} }">
        <a-input style='width:100px' type="type"
         v-model = "code"
            v-decorator="[
              'code',
              {rules: [{ required: true, message: '请输入验证码' }]}
            ]"
            name="code"
            placeholder="请输入验证码" />
            <a-button :disabled="timerFlag" @click='handSmsCode()' class='ml'>
              {{getCode}}
            </a-button>
      </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit"  type="primary">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { updatePassword ,sendCode} from '@/api/myinfo'
export default {
  name: 'BaseForm',
  data () {
    return {
      value: 1,
      form: this.$form.createForm(this),
      data:"",
      selectoption:'',
      getCode: '获取验证码',
      timerFlag: false,
      oldphone:"",
      newphone:"",
      showcode:false,
      code:"",
      mobile:"",
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
          if(!reg.test(this.newPassword)){
            this.$notification.error({
              message: '错误',
              description:'密码不能为纯数字且大于6位',
            });
          } else {
            updatePassword(
              {
                hasPassword:"0",
                newPassword:this.newPassword,
                mobile:this.mobile,
                code:this.code,
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
        }
      })
    },
    // 点击获取验证码
    handSmsCode (){
      if (!/[0-9]{11}/.test(this.mobile)) {
        this.$notification.error({
          message:'提醒',
          description: '手机号不正确',
        });
      }else{
        if (this.timerFlag === false) {
          sendCode({
            mobile:this.mobile,
            type:"update_password"
          }).then(res => {
            if(res.code === 0){
              this.timerFlag = !this.timerFlag
              this.countDown(120)
              this.$notification.success({
                message:'成功',
                description: res.msg,
              });

            }else{
              this.$notification.error({
                message:'提醒',
                description: res.msg,
              });
            }
          })
        } else {
        }
      }
    },
    // 每秒执行
    countDown (time) {
      let count = time
      setTimeout(() => {
        count--
        if (time <= 0) {
          this.getCode = '获取验证码'
          this.timerFlag = false
        } else if (count !== time) {
          this.getCode = '重新获取' + count
          this.countDown(count)
        }
      }, 1000)
    }
  },
  created(){
  },
  mounted(){
  }
}
</script>
<style>
.ml{margin-left:20px;}
</style>

