<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="旧手机号"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }"
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }"
      >
        <a-input
          v-decorator="[
            'oldMobile',
            {rules: [{ required: true, message: '请输入旧手机号' }]}
          ]"
          name="oldMobile"
          placeholder="请输入旧手机号" />
      </a-form-item>

      <a-form-item
        label="密码验证"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} } "
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span: 8} }">
        <a-input
          type='password'
          v-decorator="[
            'pwd',
            {rules: [{ required: true, message: '请输入密码' }]}
          ]"
          name="pwd"
          placeholder="请输入密码" />
      </a-form-item>
      <a-form-item
        label="新手机号"
        :labelCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span:8} }"
        :wrapperCol="{ md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span:8} }">
        <a-input type="text"
            v-decorator="[
              'newMobile',
              {rules: [{ required: true, message: '请输入新手机号' }]}
            ]"
            name="newMobile"
            placeholder="请输入新手机号" />
      </a-form-item>
         <!-- v-model = "smscode" -->
      <a-form-item
        label="验证码"
        :labelCol="{md: {span:10}, lg: {span: 11}, xl: {span: 10},xxl:{span:8}}"
        :wrapperCol="{md: {span:10}, lg: {span: 11}, xl: {span: 10} ,xxl:{span:8} }">
        <a-row>
          <a-col :md="15" :lg="17" :xl="17" :xxl="17">
            <a-input type="type"
            v-decorator="[
              'smscode',
              {rules: [{ required: true, message: '请输入验证码' }]}
            ]"
            name="smscode"
            placeholder="请输入密码" />
          </a-col>
          <a-col :md="9" :lg="7" :xl="7" :xxl="7">
            <a-button :disabled="timerFlag" @click='handSmsCode()' class='ml' style="width: 85%">
              {{getCode}}
            </a-button>
          </a-col>
        </a-row>
      </a-form-item>
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
import { getchildupdate ,getgroup} from '@/api/manage'
import { updateMobile ,sendCode} from '@/api/myinfo'
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
      // oldMobile:"",
      // newMobile:"",
      showcode:false,
      smscode:"",
      mobile:""
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if(values.oldMobile === values.newMobile){
            this.$notification.error({
              message: '错误',
              description:"旧手机号与新手机号不能一致",
            });
          }else if(values.length <=0){
            this.$notification.error({
              message: '错误',
              description:"手机验证码不能为空",
            });
          }else{
            console.log()
            updateMobile(
              {
                oldMobile:values.oldMobile,
                newMobile:values.newMobile,
                code:values.smscode,
                password:values.pwd
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
    handSmsCode () {
      var reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
      if (!reg.test(this.form.getFieldValue('newMobile'))) {
        this.$notification.error({
          message:'提醒',
          description: '新手机号不正确',
        });
      }else{
        if (this.timerFlag === false) {
          sendCode({
            mobile:this.form.getFieldValue('newMobile'),
            type:"update_mobile"
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
    this.mobile = this.$route.query.mobile
    this.form.setFieldsValue({
       oldMobile:this.mobile,
    })
  }
}
</script>
<style lang="less" scoped>
.ml{margin-left:18px;}
@media screen and (min-width: 1200px) {
  .ml {
    width: 88% !important;
  }
}
</style>

