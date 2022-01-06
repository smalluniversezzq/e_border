<template>
  <div class="main">
    <div class="login" v-if='tablogin==="login"'>
      <div class='tar'>
        <!-- <a-icon :style="{ fontSize: '18px' }" @click='istab' type="swap" /> -->
      </div>
      <div class='login-title'>欢迎登录</div>
      <div class='come'>{{loginTxt}}</div>
      <a-form
        id="formLogin"
        class="user-layout-login"
        ref="formLogin"
        :form="form"
        @submit="handleSubmit"
      >
        <a-row class='mt'>
          <a-form-item>
            <a-input
              type="text"
              placeholder="请输入帐户"
              v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入帐户' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              type="password"
              autocomplete="false"
              placeholder="请输入密码"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入6位以上密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-row>
        <a-row>
          <a-col :span='12'>
            <!-- <a-checkbox @change="onChange" v-model="rememberPwd">记住密码</a-checkbox> -->
          </a-col>
          <a-col :span='12'>
            <div class='pwd-forget cursor'   @click='forgetPwd'>忘记密码?</div>
          </a-col>
        </a-row> 
          <a-form-item style="margin-top:40px">
            <a-button
              size="large"
              type="primary"
              htmlType="submit"
              class="pwd-button"
            >登录</a-button>
          </a-form-item>
      </a-form>
    </div>
    <div class="tabPwd" v-if='tablogin==="pwd"'  >
      <div class='tar'>
        <span  class='cursor' @click='istab'>返回登录</span>
        <!-- <a-icon :style="{ fontSize: '18px' }" @click='istab' type="swap" /> -->
      </div>
      <div class='login-title'>忘记密码</div>
      <a-form @submit="handlePwd" :form="forms">

        <a-form-item
          label="手机号"
          :labelCol="{lg: {span: 6}}"
          :wrapperCol="{lg: {span: 15} }">
          <a-input type="text"
          v-model = "mobile "
          v-decorator="[
            'mobile',
            {rules: [{ required: true, message: '请输入手机号' }]}
          ]"
          name="mobile"
          placeholder="请输入手机号" >
           <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>
                <a-form-item
          label="新密码"
          :labelCol="{lg: {span: 6}}"
          :wrapperCol="{lg: {span: 15} }">
          <a-input
          id='ico-only'
          :type="types === false?'password':'txt'"
          v-model = "newPassword"
          v-decorator="[
          'newPassword',
            {rules: [{ required: true, message: '请输入新密码' }]}
            ]"
            name="newPassword"
            placeholder="请输入新密码" >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            <a-icon  slot="suffix"  theme='outlined' :type="types === false ?'eye':'eye-invisible' "  :style="{ color: 'rgba(0,0,0,.2)' ,background:'#fff' }" @click='txtOrpwd'/>
          </a-input>
        </a-form-item>
        <!-- eye-invisible -->
        <a-form-item
          label="验证码"
          :labelCol="{lg: {span: 6}}"
          :wrapperCol="{lg: {span: 16} }">
          <a-input style='width:110px' type="type"
          v-model = "code"
          v-decorator="[
          'code',{rules: [{ required: true, message: '请输入验证码' }]}]"
          name="code"
          placeholder="请输入验证码" >
          </a-input>
            <a-button style="100px;" :disabled="timerFlag" @click='handSmsCode()' class='ml-sm'>
              {{getCode}}
            </a-button>
        </a-form-item>
        <a-form-item
          mt-xxl
          :wrapperCol="{ span: 18 ,offset:'3'} "
          style="text-align: center"
        >
          <!-- <a-button
          htmlType="submit"
          type="primary"
          class="login-button" >提交</a-button> -->
            <a-button
              size="large"
              type="primary"
              htmlType="submit"
              class="pwd-button"
            >确定</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getSmsCaptcha, } from '@/api/login'
import { updatePassword ,sendCode} from '@/api/myinfo'
import global from '@/config/global.js'

export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      forms: this.$form.createForm(this),
      state: {
        time: 10,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      tablogin:"login",
      selectoption:'',
      getCode: '获取验证码',
      timerFlag: false,
      oldphone:"",
      newphone:"",
      showcode:false,
      code:"",
      mobile:"",
      newPassword:"",
      no_re:'no-repeat',
      rememberPwd:false,
      username:"",
      password:"",
      types:false,
      logoText:global.logoText,
      loginTxt:global.loginTxt,
    }
  },
  created () {
    // console.log(get2step)
    // get2step({ })
    //   .then(res => {
    //     this.requiredTwoStepCaptcha = res.result.stepCode
    //   })
    //   .catch(() => {
    //     this.requiredTwoStepCaptcha = false
    //   })
    // this.requiredTwoStepCaptcha = true
  },
  mounted(){
    //  this.getCookie();
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },

    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    forgetPwd(){
      this.tablogin = 'pwd';
      this.types = false;

    },
    istab(){
      if(this.tablogin === 'login'){
        this.tablogin = 'pwd'
      }else{
         this.tablogin = 'login'
      }
    },
    //设置cookie
    // setCookie(c_name, c_pwd, exdays) {
    //     console.log("执行了")
    //     var exdate = new Date(); //获取时间
    //     exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
    //     //字符串拼接cookie
    //     window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
    //     window.document.cookie = "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
        
    // },
    //读取cookie
    // getCookie() {
    //     if (document.cookie.length > 0) {
    //       console.log("存账号密码了，----")
    //       this.rememberPwd = true;
    //         var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
    //         for (var i = 0; i < arr.length; i++) {
    //             var arr2 = arr[i].split('='); //再次切割
    //             //判断查找相对应的值
    //             if (arr2[0] == 'userName') {
    //                 this.username = arr2[1]; //保存到保存数据的地方
    //             } else if (arr2[0] == 'userPwd') {
    //                 this.password = arr2[1];
    //             }
    //         }
    //     }else{
    //       this.rememberPwd = false;
    //       console.log("没有存密码")
    //     }
    // },
    //清除cookie
    // clearCookie() {
    //     this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    // },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true
      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          var _this = this
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          loginParams.password = values.password
          _this.username = values.username
          _this.password = values.password
        // if (_this.rememberPwd == true) {
        //     console.log("rememberPwd == true");
        //     //传入账号名，密码，和保存天数3个参数
        //     _this.setCookie(values.username, values.password, 7);
        //     }else {
        //       // console.log("清空Cookie");
        //       //清空Cookie
        //       // _this.clearCookie();
        //     }
            Login(loginParams).then((res) => {
            console.log("登录成功")
            if(res.code == '0'){
              this.loginSuccess(res)
            }else{
              this.$notification.open({
                message: '登录失败',
                description: res.msg,
              });
            }
          }).catch(err => {
            console.log(err)
            this.requestFailed(err)
          })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    txtOrpwd(){
      this.types = !this.types
    },
    handlePwd (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
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
              this.tablogin = 'login'
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
    onChange(e){
    },
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
    },
    // getCaptcha (e) {
    //   e.preventDefault()
    //   const { form: { validateFields }, state } = this

    //   validateFields(['mobile'], { force: true }, (err, values) => {
    //     if (!err) {
    //       state.smsSendBtn = true

    //       const interval = window.setInterval(() => {
    //         if (state.time-- <= 0) {
    //           state.time = 60
    //           state.smsSendBtn = false
    //           window.clearInterval(interval)
    //         }
    //       }, 1000)

    //       const hide = this.$message.loading('验证码发送中..', 0)
    //       getSmsCaptcha({ mobile: values.mobile }).then(res => {
    //         setTimeout(hide, 2500)
    //         this.$notification['success']({
    //           message: '提示',
    //           description: '验证码获取成功，您的验证码为：' + res.result.captcha,
    //           duration: 8
    //         })
    //       }).catch(err => {
    //         setTimeout(hide, 1)
    //         clearInterval(interval)
    //         state.time = 60
    //         state.smsSendBtn = false
    //         this.requestFailed(err)
    //       })
    //     }
    //   })
    // },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      this.$router.push({ name: 'index' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    },
    requestFailed (err) {
      console.log(err,'aaaa')
      this.$notification['error']({
        message: '错误',
        description: ((err.res || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  color: #fff;
}
.mt{
  margin-top: 10px;
}
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #fff;
      }
    }

    .register {
      float: right;
    }
  }
}
.login-title{
  font-size: 25px;
  color:#fff;
  text-align: center;
  margin-bottom: 15px;
  margin-top: 30px;
}
.pwd-forget{
  color: #fff;
  font-size: 16px;
  text-align: right;
}
.mt-xxl{margin-top: 40px;}
.ml-sm{margin-left: 10px;}
.pwd-button{
  padding: 0 15px;
  font-size: 16px;
  height: 40px;
  width: 100%;
}
.tar{text-align: right;}

.come{
  text-align: center;
  font-size:18px;
  color: #ffffff;
}
.ant-input-group-addon{
  background-color: #fff;
}
</style>
