<template>
  <div>
    <a-form :form="form" style="max-width: 700px; margin: 10px auto 0;" >
      <a-form-item
        label="姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <span>
          {{strPdata.applicant?strPdata.applicant:"暂无数据"}}
        </span>
      </a-form-item> 
      <a-form-item
        label="手机号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
      <span>
        {{strPdata.mobile?strPdata.mobile:"暂无数据"}}
      </span>
      </a-form-item>
      <!-- <a-form-item
        label="部门"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
      <span class='mr' v-for='(item,index) in departmentvalueTitle'>
        {{item}}
      </span>
      </a-form-item> -->
      <!-- <a-form-item
        label="可绑定店铺数量"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
      <span>
       {{strPdata.number?strPdata.number:"暂无数据"}}
      </span>
      </a-form-item> -->
      <a-form-item
        label="用户名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
      {{strPdata.username?strPdata.username:"暂无数据"}}
      </a-form-item>
      <a-form-item
        label="密码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <span>
       {{strPdata.password?strPdata.password:"********"}}
      </span>
      </a-form-item>
      <!-- <a-form-item
        label="国家权限"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <span class='mr' v-for='(item,index) in strPdata.country_permission'>
       {{codeORcountrys[item]}}
      </span>
      </a-form-item> -->
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button class='mr'  @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
  </div>
</template>

<script>
import { editMerchant , departmentTree ,updataMerchant} from '@/api/mermanage'
import { codeORcountrys } from '@/views/order/public/country'

export default {
  name: 'Step1',
  props:['DetailID','strPdata','departmentTree'],
  data () {
    return {
      codeORcountrys,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      departmentvalue:[],
      departmentvalueTitle:[],
      departmentvaluearr:"",
      seleTitle:[],
    }
  },
  methods: {
    cancel(){
      this.$emit('cancel')
    },
    // 查询页面信息
    editMerchants(ids){
      console.log('执行请求')
      editMerchant({
        id: ids
      }).then((res)=>{
        if(res.code === 0){
          this.strPdata = res.data
          this.departmentvalueTitle =[]
          this.departmentvaluearr = []
          if(this.strPdata){
            console.log(this.departmentTree,'departmentTree')
          this.departmentTree.forEach((item,index)=>{
            res.data.port.forEach((i,x)=>{
            if(item.key == i.biz_id){
                this.departmentvalueTitle.push(item.title)
                this.departmentvaluearr.push(i.biz_id)
              }
            })
          })
          console.log(this.departmentvaluearr,'ovee')
          this.departmentvalue = this.departmentvaluearr.join(",")
          console.log(this.departmentvalue,'departmentvalue')
        }else{
          this.departmentvalueTitle=[]
        }
          console.log(this.departmentvalueTitle,'department')
        }else{
          this.$notification.error({
          message: '错误',
          description: '用户信息获取失败'
        })
        }
        this.seleTitle = this.departmentvalueTitle
      })
    },
  },
  created(){
    console.log('DetailID',this.DetailID)
    this.editMerchants(this.DetailID)
  },
  mounted(){
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
