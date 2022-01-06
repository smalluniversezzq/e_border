<template>
  <div>
    <a-form :form="form" style="max-width: 700px; margin: 40px auto 0;">
      <a-form-item
        label="姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input 
        v-decorator="['applicant', 
        { initialValue:data ? data.applicant :'',
        rules: [{required: true,message: '姓名不能为空'},] }]"
        placeholder='请输入姓名'
        />
      </a-form-item>
      <a-form-item
        label="手机号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <!-- rules: [{validator:handConfirmMobile},]}]" -->
      <a-input 
        v-decorator="['mobile', 
        { initialValue:data ? data.mobile :'',
        rules: [{required: true,message: '手机号不能为空'},] }]"
        placeholder='请输入手机号'
      />
      </a-form-item>
  
      <!-- <a-form-item
        label="端口"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        placeholder='请输入端口'
      >
        <a-select 
          mode="tags"
          disabled 
          style="width: 100%"
          :tokenSeparators="[',']" 
          :defaultValue="departmentvalueTitle"
          @change="departmentSelectChange">
          <a-select-option v-for="(item,index) in departmentTree" :value='item.title' :key="index">{{item.title}}</a-select-option>
        </a-select>
      </a-form-item> -->
      <a-form-item
        label="用户名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input 
        v-decorator="['username', 
        { initialValue:data ? data.username :'', 
        rules: [{required: true,
         message: '用户名不能为空'}] }]"
         placeholder='请输入用户名'
         />
      </a-form-item>
      <a-form-item
        label="密码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input 
        type='password' 
        v-decorator="['password', 
        {  initialValue:data ? data.password :''
        ,rules: [{required: true, 
        message: '密码不能为空'}] }]"
        placeholder='请输入密码'
        />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button class='mr'  @click="cancel">取消</a-button>
        <a-button type="primary" @click="nextStep" :loading='nextStepLoding'>提交</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
  </div>
</template>
<script>
import { addMerchant } from '@/api/mermanage'
export default {
  name: 'Step1',
  props:['departmentTree','id'],
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      merchantInfo:{
        mobile:'', 
        password:'', 
        // number:'', 
        applicant:'', 
        username: '', 
        department_id: '', 
      },
      departmentvalue:[],
      departmentvalueTitle:[],
      seleTitle:[],
      data:"",
      department:"",
      nextStepLoding:false,
      
    }
  },
  methods: {
    nextStep () {
      let that = this
      this.nextStepLoding = true
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          // console.log(values)
          // this.merchantInfo.mobile = values.mobile
          // this.merchantInfo.password = values.password
          // // this.merchantInfo.number = values.number
          // this.merchantInfo.applicant = values.applicant
          // this.merchantInfo.username = values.username
          // this.merchantInfo.department_id = this.departmentvalue
          // this.$store.commit('set_MerchantInfo',this.merchantInfo)
          // console.log(this.$store.state.MerchantManege.MerchantInfo,'this.$store.state.MerchantManege.MerchantInfo')
          // this.$emit('nextStep')
          addMerchant({
            uid:"0",
            applicant: values.applicant,
            username: values.username,
            mobile: values.mobile,
            password: values.password,
            port_id:that.id,
          }).then((res)=>{
            if(res.code === 0){
              that.timer = setTimeout(function () {
              that.loading = false
              //提交的操作
                  that.$emit('cancel')
                  that.$notification.success({
                    message: '成功',
                    description: res.msg,
                  });
                }, 1500)
                this.nextStepLoding = false
              }else{
                this.nextStepLoding = false
                that.loading = false
                that.$notification.error({
                  message: '错误',
                  description: res.msg,
                });
              }
          })
        }else{
          this.nextStepLoding = false
        }
      })
    },
    departmentSelectChange(value,option){
      this.seleTitle = []
      // console.log(value,option,'departmentSelectChange',this.departmentTree)
      this.departmentTree.forEach((item,index)=>{
        // console.log("departmentTree")
        value.forEach((i,x)=>{
          if(item.title == i){
            // console.log('相同的',item.title,i)
            this.seleTitle.push(item.key)
          }
        })
      })
      this.departmentvalue = this.seleTitle.join(',')
      // console.log(this.departmentvalue,'departmentvalue')

    },
    handConfirmMobile(rule,value,callback){
      // console.log(value,'value')
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if(!reg.test(value)){
        callback('手机号不正确')
      }else{
        callback()
      }
    },
    cancel(){
      this.$emit('cancel')
      // console.log('退出执行')
    },
    mobileregexp(rule,value){
      // console.log(rule,value,'验证')

    }
  },
  created(){
    
  },
  mounted(){
    // console.log(this.departmentTree,'departmentTree',this.id,'id')
    //反显
    this.data = this.$store.state.MerchantManege.MerchantInfo
      // console.log(this.departmentvalue,'departmentvalue')
      this.departmentTree.forEach((item,index)=>{
          if(item.key == this.id){
            this.departmentvalueTitle.push(item.title)
          }
      })
    this.seleTitle = this.departmentvalueTitle
  },
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
