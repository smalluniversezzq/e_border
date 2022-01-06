<template>
  <div>
    <a-form :form="form" style="max-width: 700px; margin: 40px auto 0;" >
      <a-form-item
        label="姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input 
        v-decorator="['applicant', { initialValue:strPdata ? strPdata.applicant :'',rules: [{required: true, message: '姓名不能为空'}] }]"
        />
      </a-form-item>
      <a-form-item
        label="手机号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
      <a-input 
        v-decorator="['mobile', 
        { initialValue:strPdata ? strPdata.mobile :'',
        rules: [{validator:handConfirmMobile}] }]"/>
      </a-form-item>
      <!-- <a-form-item
        label="端口"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select 
          v-if='strPdata'
          mode="tags" 
         style="width: 100%"
         disabled
         :tokenSeparators="[',']" 
         :defaultValue="departmentvalueTitle"
         @change="departmentSelectChange">
          <a-select-option v-for="(item,index) in departmentTree" :value='item.title' :key="index">{{item.title}}</a-select-option>
        </a-select>
      </a-form-item> -->
      <!-- <a-form-item
        label="可绑定店铺数量"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['number', { initialValue:strPdata ? strPdata.number :'',rules: [{required: true, message: '可绑定店铺数量不能为空'}] }]"/>
      </a-form-item> -->
      <a-form-item
        label="用户名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['username', { initialValue:strPdata ? strPdata.username :'', rules: [{required: true, message: '用户名不能为空'}] }]"/>
      </a-form-item>
      <a-form-item
        label="密码重置"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input  v-decorator="['password', {  initialValue:strPdata ? strPdata.password :'',rules: [{required: false, message: '密码不能为空'}] }]"/>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button class='mr'  @click="cancel">取消</a-button>
        <a-button type="primary" @click="nextStep">保存</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
  </div>
</template>

<script>
import { editMerchant , departmentTree ,updataMerchant} from '@/api/mermanage'
export default {
  name: 'Step1',
  props:['updataID','strPdata','departmentTree','port','portId'],
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
        // department_id: '', 
        uid:"",
        port_id:'',
        // group_id:"",
      },
      departmentvalue:[],
      departmentvalueTitle:[],
      departmentvaluearr:"",
      seleTitle:[],
      // data:"",
      portIds:"",
      
    }
  },
  methods: {
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        // console.log(this.portId,'this.port_id')
        if (!err) {
          console.log(values)
          this.merchantInfo.applicant = values.applicant
          this.merchantInfo.username = values.username
          this.merchantInfo.mobile = values.mobile
          this.merchantInfo.password = values.password
          // this.merchantInfo.port_number = values.number
          // this.merchantInfo.group_id = this.portIds
          this.merchantInfo.uid = this.updataID
          this.merchantInfo.port_id = this.departmentvalue
          console.log(this.merchantInfo)
          this.updataMerchants(this.merchantInfo)
        }
      })
    },
    //departmentvalue
    // 保存接口
    updataMerchants(merchantInfo){
      updataMerchant(
        merchantInfo
      ).then((res)=>{
        if(res.code === 0){
          this.$emit('cancel')
        }else{
          // console.log("未成功")
          this.$notification.error({
            message: '错误',
            description:res.msg,
          });
        }
      })
    },
    handConfirmMobile(rule,value,callback){
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if(!reg.test(value)){
        callback('手机号不正确')
      }else{
        callback()
      }
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
      console.log(this.departmentvalue,'departmentvalue')

    },
    cancel(){
      this.$emit('cancel')
    },
    // 查询页面信息
    editMerchants(id){
      console.log('执行请求')
      editMerchant({
        id: id
      }).then((res)=>{
        if(res.code === 0){
          this.strPdata = res.data
          this.departmentvalueTitle =[]
          this.departmentvaluearr = []
          if(this.strPdata){
          this.departmentTree.forEach((item,index)=>{
            res.data.port.forEach((i,x)=>{
            if(item.key == i.biz_id){
                this.departmentvalueTitle.push(item.title)
                this.departmentvaluearr.push(i.biz_id)
              }
            })
          })
          // console.log(this.departmentvaluearr,'ovee')
          this.departmentvalue = this.departmentvaluearr.join(",")
          // console.log(this.departmentvalue,'departmentvalue')
        }else{
          this.departmentvalueTitle=[]
        }
          // console.log(this.departmentvalueTitle,'department')
        }else{
            this.$notification.error({
            message: '错误',
            description: '用户信息获取失败'
          })
        }
        this.seleTitle = this.departmentvalueTitle
      })
    },
    getPortId(){
      var portIdArr = []
      // console.log(this.portId,'portId')
      this.portId.forEach((item,index)=>{
        // console.log(item)
        portIdArr.push(item.biz_id);  
      })
      this.portIds = portIdArr.join(',')
      // console.log(this.portIds,'portIds')
    }
  },
  created(){
    this.editMerchants(this.updataID)
  },
  mounted(){
    this.getPortId()
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
