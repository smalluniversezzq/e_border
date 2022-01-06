<template>
  <div>
    <a-form :form="form" style="max-width: 700px; margin: 40px auto 0;">
      <a-row>
        <a-col :span='12' style='padding-right:5px'>
          <a-card 
          title='选择角色套餐'>
            <a-row>
              <a-col class='mt'>
                <a-form-item>
                  <a-select
                    width='120px'
                    placeholder="请选择角色套餐"
                    @change='ruleschange'
                   >
                    <a-select-option v-for='(item,index) in rulesData' :value='item.id'>{{item.title}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span='12' style='padding-left:5px'>
          <a-card title='分配数据权限'>
            <a-button :type='countryCodeList.indexOf(item.code) >= 0?"primary":"Dashed"' class='mrb-sm' v-for='(item,index) in country_permission' @click='addCountry(item.code)'>
              {{item.title}}
            </a-button>
          </a-card>
        </a-col>
      </a-row>
      <!-- <a-divider /> -->
      <a-form-item :wrapperCol="{span: 19, offset: 5}" class='mt'>
        <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
        <a-button class='ml' @click="prevStep">上一步</a-button>
        <a-button class='ml' @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getRulest,addMerchant } from '@/api/mermanage'
import {Europe } from '@/views/order/public/country'
export default {
  name: 'Step2',
  data () {
    return {
      Europe,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      timer: 0,
      countryCodeList:[],
      counList:[],
      suncountry:"",
      stepInfo:"",
      rulesData:"",
      rulesValue:"",
      country_permission:"",

    }
  },
  methods: {
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          // console.log('表单 values', values)
          // console.log(that.countryCodeList)
          that.suncountry = that.countryCodeList.join(',')
          that.stepInfo = that.$store.state.MerchantManege.MerchantInfo
          // console.log(that.suncountry,'suncountry',that.$store.state.MerchantManege.MerchantInfo,'页面1的表单')
          // console.log(that.rulesValue,'rulesValue',that.countryCodeList,'页面2的表单')
          // console.table(
          //   {
          //   applicant: that.stepInfo.applicant,
          //   username: that.stepInfo.username,
          //   mobile: that.stepInfo.mobile,
          //   password: that.stepInfo.password,
          //   // departmentName: that.stepInfo.departmentName,
          //   port_number:that.stepInfo.number,
          //   group_id:that.rulesValue,
          //   country_permission: that.countryCodeList,
          //   port_id:that.stepInfo.department_id
          //   },''
          // )
          // console.log(that.rulesValue,that.countryCodeList,'oveeres')
         if(that.rulesValue){
           if(that.countryCodeList.length>0){
             that.submit()
           }else{
            that.loading = false 
           that.$notification.error({
              message: '错误',
              description: '分配数据权限不能为空',
            }); 
           }
         }else{
          that.loading = false 
          that.$notification.error({
            message: '错误',
            description: '角色套餐不能为空',
          });
         }

        } else {
          that.loading = false
        }
      })
    },
    submit(){
      let that = this;
      addMerchant({
        uid:"0",
        applicant: that.stepInfo.applicant,
        username: that.stepInfo.username,
        mobile: that.stepInfo.mobile,
        password: that.stepInfo.password,
        // departmentName: that.stepInfo.departmentName,
        port_number:that.stepInfo.number,
        group_id:that.rulesValue,
        country_permission: that.countryCodeList,
        port_id:that.stepInfo.department_id
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
          that.$store.commit('set_MerchantInfo','')
        }else{
          that.loading = false
          that.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    },
    addCountry(countryCode){
      if(this.countryCodeList.indexOf(countryCode) < 0){
        this.counList.push(countryCode);
        this.countryCodeList = this.removal(this.counList)
      }else{
        this.countryCodeList.splice(this.countryCodeList.indexOf(countryCode),1)
        this.counList.splice(this.counList.indexOf(countryCode),1)
        this.countryCodeList = this.removal(this.counList)
      }
    },
    removal(array){
        var res = [];
        for (var i = 0, len = array.length; i < len; i++) {
          var current = array[i];
          if (res.indexOf(current) === -1) {
              res.push(current)
          }
        }
        return res;
      },
    cancel(){
      this.$emit('cancel')
    },
    // 获取代理商角色列表
    getRulests(){
      getRulest({
      }).then((res)=>{
        if(res.code === 0){
          this.rulesData = res.data
        }
      })
    },
    ruleschange(value){
      this.rulesValue = value
    },
  },
  mounted(){
    this.getRulests()
    this.country_permission = this.$store.state.user.country_permission
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }
</style>
<style lang="less">
.mrb-sm{
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
