<template>
  <div class='international'>
    <main>
      <a-form :form='form' >
        <div class='' v-for='(item,index) in packageList' :key='index'>
          <a-row>
            <a-col :span='18'>
              <a-form-item
                label="选择国际物流"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :validate-status="item.typeOne"
                has-feedback
                :help="item.helpOne"
              >
                <a-select 
                  v-model='packageList[index].logistics_channel'
                  placeholder='请选择国际物流方式'
                  style="width: 250px" >
                  <a-select-option
                    :value="item.channel_code"
                    v-for='(item,index) in Channel'
                    :key='index'
                  >{{item.channel_name}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item
                :label="'国际单号'"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :validate-status="item.typeTow"
                has-feedback
                :help="item.helpTow"
              >
                <a-input
                style="width: 250px"
                placeholder='请填写国际单号'
                v-model='packageList[index].logistics_code'
                />
              </a-form-item>
            </a-col>
            <a-col :span='6'>
              <a-button :disabled='packageList.length <= 1 ? true:false ' @click='delLogisticsList(index)'>删除</a-button>
            </a-col>
          </a-row>
          <a-divider orientation="left"></a-divider>
        </div>
        <div>
          <a-button block  @click='addLogisticsList()'>添加新包裹</a-button>
        </div>
         <a-divider orientation="left"></a-divider>
         <a-row>
           <a-col :span='18'>
              <a-form-item
                :label="'订单备注'"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-textarea v-model='remark' placeholder="请填写订单备注信息" :rows="4" />
              </a-form-item>
           </a-col>
         </a-row>
      </a-form>
    </main>  
    <footer class='footers mt'>
      <a-button @click='cancel()'>取消</a-button>
      <a-button @click='returns()' :disabled='openInternationalState==="0"?false:true' class='ml'>返回</a-button>
      <a-button  class='ml' @click='handleSubmit()'>确认</a-button>
    </footer>
  </div>
</template>
<script>
import {getOrderLogistics , handlerForeignOrder ,getForeignChannel} from  '@/api/order'
  export default{
    name:"international",
    components:{

    },
    props:['orderID','openInternationalState'],
    data(){
      return{
        labelCol: { lg: { span: 5 }, sm: { span: 5 } },
        wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
        form: this.$form.createForm(this),
        packageList:[],
      // 提交的list
      submitList:"",
      // 提交的备注
      remark:"",
      Channel:""
      }
    },
    methods:{
      handleSubmit() {
        let num = 0;
        // console.log("执行了");
        this.packageList.forEach((item,index)=>{
          if(item.logistics_channel.length<=0 || item.logistics_code.length<=0){
            num ++ 
            if(item.logistics_channel.length<=0){
              this.packageList[index].typeOne="error",
              this.packageList[index].helpOne="国际物流不能为空"
            }else{
              this.packageList[index].typeOne="success",
              this.packageList[index].helpOne=""
            }
            if(item.logistics_code.length<=0){
              this.packageList[index].typeTow="error",
              this.packageList[index].helpTow="国际单号不能为空"
            }else{
              this.packageList[index].typeTow="success",
              this.packageList[index].helpTow=""
            }
          }else{
            this.packageList[index].typeOne="success",
            this.packageList[index].helpTow=""
            this.packageList[index].typeTow="success"
            this.packageList[index].helpOne=""
          }
        })
        //更新数组
        this.packageList.reverse().reverse()
        // console.log(this.packageList,'packageList')
        if(num === 0){
          this.submitList = []
          this.packageList.forEach((item,index)=>{
            var info = {
              logistics_channel:"",
              logistics_code:"",
            }
            info.logistics_channel = item.logistics_channel
            info.logistics_code = item.logistics_code
            this.submitList[index]=info;
          })
          // console.log(this.packageList,'packageList','success',this.submitList,'submitList')
          //保存接口
          // console.log('保存前')
          handlerForeignOrder({
            id:this.orderID,
            package:this.submitList,
            remark:this.remark
          }).then((res)=>{
            if(res.code === 0){
              // console.log('保存成功',res)
              this.$notification.success({
                message: '成功',
                description: res.msg
              })
              this.cancel()
            }else{
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      },
      cancel(){
        this.$emit('cancelInternational')
      },
      returns(){
       this.$emit('returnInternational') 
      },
      addLogisticsList(){
        const packageInfo = {
          logistics_channel:"",
          logistics_code:"",
          typeOne:"",
          helpOne:"",
          typeTow:"",
          helpTow:"",
        }
        this.packageList.push(packageInfo);
      },
      delLogisticsList(inx){
        this.packageList.splice(inx,1)
      },
      // 数据初始化
      initData(){
        if(this.openInternationalState === '0'){
          this.packageList = [
            {
              logistics_channel:"",
              logistics_code:"",
            }
          ]
        }else{
          getOrderLogistics({
            ids:this.orderID
          }).then(res=>{
            if(res.code === 0){
              this.packageList = res.data.package;
              this.remark = res.data.remark;
            }else{
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      },
      // 获取国际物流
      getForeignChannelFn(){
        getForeignChannel({}).then(res=>{
          if(res.code === 0){
            this.Channel = res.data
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }
    },
    created (){
      this.initData()
      this.getForeignChannelFn()
    },
    mounted (){
      
    },
    destroyed (){},
  }
</script>
<style lang="less" scoped>
  .international{
    .footers{
      
      text-align: right;
    }
  }
  
</style>