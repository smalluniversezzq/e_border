<template>
  <div class="orderdetails">
    <a-form :form="form"   v-if="data">
      <a-card hoverable :bordered="false" title='收货地址'>
        <a-row>
          <a-col :span="8">
            <a-form-item
              label="收件人"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}">
              <a-input
                :disabled="showInt"
                v-decorator="['name', { initialValue: data.shipping_address.name, rules: [{required: false, message: '收件人名称不能为空'}] }]" 
                :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="手机号"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}">
              <a-input
                :disabled="showInt"
                v-decorator="['phone', { initialValue: data.shipping_address.phone, rules: [{required: false, message: '手机不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="邮编"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}">
              <a-input
                :disabled="showInt"
                v-decorator="['zipcode', { initialValue: data.shipping_address.zipcode, rules: [{required: false, message: '邮编不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col  :span="8">
            <a-form-item
              label="国家"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}">
              <a-input 
                disabled
                v-decorator="['country', { initialValue: data.shipping_address.country, rules: [{required: false, message: '国家不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="州或省"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}">
              <a-input 
                :disabled="showInt"
                v-decorator="['state', { initialValue: data.shipping_address.state, rules: [{required: false, message: '州或省不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="地区"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}">
              <a-input
                :disabled="showInt"
                v-decorator="['district', { initialValue: data.shipping_address.district, rules: [{required: false, message: '省不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col  :span="8">
            <a-form-item
              label="县"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}">
              <a-input
                :disabled="showInt"
                v-decorator="['county', { initialValue: '', rules: [{required: false, message: '省州不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="城市"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}">
              <a-input 
                :disabled="showInt"
                v-decorator="['city', { initialValue: data.shipping_address.city, rules: [{required: false, message: '城市不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col  :span="8">
            <a-form-item
              label="详细地址"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}">
              <a-input
                :disabled="showInt"
                v-decorator="['full_address', { initialValue: data.shipping_address.full_address, rules: [{required: false, message: '详细地址不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
    <a-card  class='mt' :bordered="false" title='商品信息'>
      <!-- //列表 -->
      <a-row class='mt'>
        <a-col :span="24">
          <a-table  :dataSource="product"  >
            <a-table-column
              title="id"
              dataIndex="order_item_id">
            </a-table-column>
            <a-table-column
              title="图片"
              width='400px'>
              <template slot-scope="text, urldata">
                <a-popover  placement="rightTop">
                  <template slot="content" style="width:200px">
                    <img style="width:200px" :src="urldata.image" alt="">
                  </template>
                  <a-button style="width:59px;position:relative;overflow:hidden;height:49px">
                    <img
                      v-if='urldata.image'
                      style="width:58px; margin-left:-16px;margin-top:-2px"
                      :src="urldata.image"
                      alt="暂无订单信息"
                      @click="jumpToOrderUrl(urldata.ori_url)"/>
                    <img
                      v-if="!urldata.image"
                      style="width:58px; margin-left:-16px;margin-top:-2px"
                      :src="picAlt"
                      alt="暂无订单信息"
                      @click="jumpToOrderUrl(urldata.ori_url)"/>
                  </a-button>
                </a-popover>
              </template>
            </a-table-column>
            <a-table-column
              title="标题"
              width='400px'>
              <template slot-scope="text, urldata">
                <a target="_blank" :href="urldata.url">{{urldata.title}}</a>
              </template>
            </a-table-column>
            <a-table-column
              title="sku"
                dataIndex="sku">
            </a-table-column>
            <a-table-column
              title="订单金额">
              <template slot-scope="text, record">
                <span>
                  {{record.amount}} ({{record.currency_code}})
                </span>
              </template>
            </a-table-column>
            <a-table-column
              title="数量"
              dataIndex="quantity">
            </a-table-column>
          </a-table>
        </a-col>
      </a-row>
      <a-row class='mt'>
        <a-col>
          <a-form-item :wrapperCol="{span: 12, offset: 10}">
            <a-button @click='cancel()'  style='margin-left:10px' >取消</a-button>
            <!-- <a-button v-if='data.status ==="0"' type="primary" style='margin-left:10px' :disabled='showInt' @click="nextStep">保存</a-button> -->
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import Vue from 'vue'
import { oriOrderList ,groupUpdate , getChannel, getShopeeOrder} from '@/api/order'
export default {
  name:"orderdetails",
  data(){
    return{
      showInt:true,
      data:'',
      product:"",
      id:"",
      form: this.$form.createForm(this),
      picAlt:require('@/assets/icons/picAlt.png'),
    }
  },
  watch: {
    value (key) {
      console.log(key,"key")
    },
  },
  created(){

  },
  mounted(){
    this.id = this.$route.query.id
    this.disableds = this.$route.query.disableds
    if(!this.$route.query.id){
      this.$router.go(-1)
    }
    this.getoriOrderList()
  },
  updated(){},
  destroyed(){},
  methods:{
    getoriOrderList(){
      this.listLoading=true;
      getShopeeOrder({
        id:this.id
      }).then((res)=>{
        if(res.code === 0){
          this.listLoading=false;  
          if(res.data){
            this.data = res.data
            this.product = res.data.product
            // res.data.status==='0'?this.showInt = false:this.showInt=true;
            // if(this.disableds === '0'){
            //   this.showInt=true
            // }
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
          }
        }else{
          this.$notification.error({
            message: '失败',
            description: res.msg,
          });
        }
      })
    },
    cancel(){
      console.log(Vue.ls.get("orderTab"))
      let num = Vue.ls.get("orderTab")?Vue.ls.get("orderTab"):''
      this.$router.push({
        path:'/order/orderverify/shopeeOrders',
        query:{
          orderTab:num
        }
      })
    },
  }
}
</script>
<style scoped lang='less'>
  .mt{margin-top: 20px;}
  .mr{margin-right: 20px;}
  .ml-sm{margin-left:10px;}
  .ant-modal-mask{
  background-color: rgba(0, 0, 0, 0.15) !important;
}
</style>