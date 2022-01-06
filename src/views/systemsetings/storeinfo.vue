<template>
  <div class="storeinfo">
    <a-card title='基本信息'>
      <a-row>
        <a-col :span='colNum' class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>公司:</a-col>
            <a-col v-if='state' class='lebtxt'>{{data.base_info.company}}</a-col>
            <a-col v-else  >
              <a-input v-model='data.base_info.company'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum'  class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>业务员:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.base_info.business_man}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.base_info.business_man'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum'  class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>销售平台名称:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.base_info.platform}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.base_info.platform'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum'  class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>账号法人名称:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.base_info.registrant}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.base_info.registrant'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum'  class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>营业执照注册号:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.base_info.business_license}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.base_info.business_license'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum' class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>账号邮箱:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.base_info.email}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.base_info.email'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum' class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>邮箱密码:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.base_info.account_password}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.base_info.account_password'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum' class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>登录密码:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.base_info.login_password}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.base_info.login_password'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum' class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>备注信息:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.base_info.remark}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.base_info.remark'></a-input>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
    <a-card class='mt' title='VPS平台'>
      <a-row>
        <a-col :span='colNum' class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>登录平台:</a-col>
            <a-col v-if='state' class='lebtxt'>{{data.vps_info.platfrom}}</a-col>
            <a-col v-else  >
              <a-input v-model='data.vps_info.platfrom'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum'  class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>IP:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.vps_info.IP}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.vps_info.IP'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum'  class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>用户名:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.vps_info.username}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.vps_info.username'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum'  class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>密码:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.vps_info.password}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.vps_info.password'></a-input>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-card>
    <a-card class='mt' title='支付平台'>
      <a-row>
        <a-col :span='colNum' class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>收款平台:</a-col>
            <a-col v-if='state' class='lebtxt'>{{data.payment_platform.platfrom}}</a-col>
            <a-col v-else  >
              <a-input v-model='data.payment_platform.platfrom'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum'  class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>注册账号:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.payment_platform.register_account}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.payment_platform.register_account'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum'  class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>收款账号:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.payment_platform.receive_account}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.payment_platform.receive_account'></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span='colNum'  class='mb'>
          <a-row type='flex' justify='start' >
            <a-col class='mr-sm lebtxt'>实际收款人:</a-col>
            <a-col v-if='state' class='lebtxt'>
              {{data.payment_platform.payee}}
            </a-col>
            <a-col v-else>
              <a-input v-model='data.payment_platform.payee'></a-input>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row class='mt-xl mb'  type='flex' justify='center'>
      <a-col>
        <a-button v-if='!state' class='mr' @click='submit'>保存</a-button>
        <a-button v-else class='mr' @click='edit'>编辑</a-button>
        <a-button @click='close'>返回</a-button>
      </a-col>
    </a-row>
    </a-card>

  </div>
</template>
<script>
import { 
  getExtraInfo,
  editExtraInfo
} from '@/api/empower'
  export default{
    name:'storeinfo',
    data(){
      return {
        colNum:8,
        state:true,
        id:"",
        type:"",
        data:{}
      }
    },
    methods:{
      submit(){
        this.data.auth_id = this.id
        editExtraInfo(this.data).then(res=>{
          if(res.code === 0){
            this.$notification.success({
              message: '提醒',
              description: '保存成功',
            });
          this.state = true
          }else{
            this.$notification.error({
              message: '提醒',
              description: res.msg,
            });
          }
        })
      },
      edit(){
        this.state = !this.state
      },
      close(){
        this.$router.push({
          path:"empowers"
        })
      },
      getExtraInfoFn(){
        getExtraInfo({
          auth_id:this.id
        }).then(res=>{
          if(res.code === 0){
            this.data = res.data
          }
        })
      }
    },
    created(){
      this.type = this.$route.query.type
      this.$route.query.type=="0"?this.state=false:this.state=true
      this.id=this.$route.query.id
    },
    mounted(){
      this.getExtraInfoFn()

    },
  }
</script>
<style lang="less" scoped>
  .mr-sm{
    margin-right: 5px;
  }
  .lebtxt{
    line-height:32px;
  }
  .mt-xl{margin-top: 40px;}
  .mt{margin-top:20px ;}
  .mb{margin-bottom:20px;}
  .mr{margin-right: 20px;}
</style>>