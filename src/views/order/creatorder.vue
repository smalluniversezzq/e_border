<template>
  <div class="orderverify">
    <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="">
              <a-input  v-model='queryParam.orderNumber' :placeholder="queryStatus"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons" >
              <a-button type="primary">查询</a-button>
              <a-button style="margin-left: 8px"  @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-row >
      <a-col :md='2'>
        <div style='line-height: 32px'>订单号<span>1326556</span></div>
      </a-col>
    </a-row>
    <!-- //列表 -->
    <a-row class='mt'>
      <a-col :span="24">
      <a-table  :dataSource="datas"  >
        <a-table-column
            title="商品图片"
          >
          <template slot-scope="text, record">
            <span>
              <img style='width:60px;' :src="record.pic" alt="">
            </span>
          </template>
          </a-table-column>
          <a-table-column
            title="标题"
              dataIndex="title"
          >
          </a-table-column>
          <a-table-column
            title="sku"
              dataIndex="sku"
          >
          </a-table-column>
          <a-table-column
            title="订单金额"
              dataIndex="orderAmount"
          >
          </a-table-column>
          <a-table-column
            title="报关信息"
              dataIndex="addressee"
          >
          </a-table-column>
          <a-table-column
            title="快递单号"
              dataIndex="orderNumber"
          >
          </a-table-column>
          <a-table-column
            title="状态"
              dataIndex="status"
          >
          </a-table-column>
          <a-table-column
            title="操作"
          >
            <template slot-scope="text, record">
              <span>
                <a-button :type ="record.adds === '0'?'primary':''"
                @click='addtable(record.adds === "0"?record.adds="1":record.adds="0")'>
                {{record.adds==='0'?"确认添加" + record.adds:"取消添加" +record.adds}}
                </a-button>
                <!-- <a-modal
                title="删除"
                :visible="visible"
                @ok="handleOk"
                :confirmLoading="confirmLoading"
                @cancel="handleCancel"
              >
                <p>{{ModalText}}</p>
              </a-modal> -->
              </span>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-row>
    <a-form :form="form" >
    <a-row>
     <a-col :md='2'>
      <div style='line-height: 32px'>收货信息</div>
      </a-col>
    </a-row>
    <a-row>
      <a-col  :span="8">
        <a-form-item
          label="收件人"
          :labelCol="{span:8}"
          :wrapperCol="{span:16}"
        >
          <a-input 
          v-decorator="['Addressee', { initialValue: data.Addressee, rules: [{required: true, message: '收件人名称必须核对'}] }]" 
            :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
        </a-form-item>
      </a-col>
      <a-col  :span="8">
      <a-form-item
        label="电话"
        :labelCol="{span:8}"
        :wrapperCol="{span:16}"
      >
        <a-input v-decorator="['mobile', { initialValue: data.phone, rules: [{required: true, message: '电话必须核对'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
      </a-form-item>
      </a-col>
      <a-col  :span="8">
        <a-form-item
          label="手机"
          :labelCol="{span:8}"
          :wrapperCol="{span:16}"
        >
          <a-input v-decorator="['phone', { initialValue: data.mobile, rules: [{required: true, message: '手机必须核对'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col  :span="8">
        <a-form-item
          label="国家"
          :labelCol="{span:8}"
          :wrapperCol="{span:16}"
        >
          <a-input v-decorator="['country', { initialValue: data.country, rules: [{required: true, message: '国家必须核对'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
        </a-form-item>
        </a-col>
        <a-col  :span="8">
        <a-form-item
          label="省州"
          :labelCol="{span:8}"
          :wrapperCol="{span:16}"
        >
          <a-input v-decorator="['province', { initialValue: data.province, rules: [{required: true, message: '省州必须核对'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
        </a-form-item>
        </a-col>
        <a-col  :span="8">
          <a-form-item
            label="城市"
            :labelCol="{span:8}"
            :wrapperCol="{span:16}"
          >
            <a-input v-decorator="['city', { initialValue: data.city, rules: [{required: true, message: '城市必须核对'}] }]"  :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col  :span="8">
          <a-form-item
            label="地址"
            :labelCol="{span:8}"
            :wrapperCol="{span:16}"
          >
            <a-input v-decorator="['addressone', { initialValue: data.addressone, rules: [{required: true, message: '地址1必须核对'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
          </a-form-item>
         </a-col>
          <a-col  :span="8">
            <a-form-item
              label="邮编"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input v-decorator="['zipcode', { initialValue: data.zipcode, rules: [{required: true, message: '邮编必须核对'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
      </a-row>
      <a-row>
      <a-col :md='2'>
        <div style='line-height: 32px'>报关信息</div>
      </a-col>
      </a-row>
      <a-row>
        <a-col  :span="8">
          <a-form-item
            label="中文名称"
            :labelCol="{span:8}"
            :wrapperCol="{span:16}"
          >
            <a-input 
            v-decorator="['Addressee', { initialValue: data.Addressee, rules: [{required: true, message: '收件人名称必须核对'}] }]" 
             :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
          </a-form-item>
         </a-col>
         <a-col  :span="8">
          <a-form-item
            label="英文名称"
            :labelCol="{span:8}"
            :wrapperCol="{span:16}"
          >
            <a-input v-decorator="['mobile', { initialValue: data.phone, rules: [{required: true, message: '电话必须核对'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
          </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="申报金额"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input v-decorator="['phone', { initialValue: data.mobile, rules: [{required: true, message: '手机必须核对'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
            <a-form-item
              label="报关重量"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input v-decorator="['phone', { initialValue: data.mobile, rules: [{required: true, message: '手机必须核对'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-row>
     <a-col :md='2'>
        <div style='line-height: 32px'>选择物流</div>
      </a-col>
      <a-col :md='4'>
        <label>物流名称（国外）</label>
        <a-select defaultValue="externalLogistics" v-model='externalLogistics' style="width:120px " >
          <a-select-option value="externalLogistics">externalLogistics</a-select-option>
          <a-select-option value="顺丰">顺丰</a-select-option>
        </a-select>
      </a-col>
      <!-- <a-col :md='6'>
        <label>物流名称（国内）</label>
        <a-input v-model='interiorLogistics' style="width:200px " ></a-input>
      </a-col> -->
      <!-- <a-col :md='6'>
        <label>物流单号（国内）</label>
        <a-input style="width:200px " v-model='logisticscode'></a-input>
      </a-col> -->
      <!-- <a-col :md='4'>
        <label>物流费用 :</label>
        <span style="width:120px ">{{'$' + logisticsmoney}}</span>
      </a-col> -->
    </a-row>
    <a-row class='mt'>
      <a-col>
        <a-form-item :wrapperCol="{span: 12, offset: 10}">
          <a-button  style='margin-left:10px' >取消</a-button>
          <a-button type="primary" style='margin-left:10px' @click="nextStep">保存</a-button>
        </a-form-item>
      </a-col>
    </a-row>
  </a-card>
  </div>
</template>
<script>
const datas = [
  {
    id:"1",
    pic:"https://cbu01.alicdn.com/img/ibank/2017/491/735/4502537194_96529336.jpg",
    title:"title",
    sku:"sku",
    orderAmount:"orderAmount",
    addressee:"addressee",
    orderNumber:"orderNumber",
    orderTime:"orderTime",
    paymentTime:"paymentTime",
    logistics:"logistics",
    freightMoney:"freightMoney",
    status:"status",
    adds:"0"

  },
    {
    id:"2",
    pic:"https://cbu01.alicdn.com/img/ibank/2017/491/735/4502537194_96529336.jpg",
    title:"title",
    sku:"sku",
    orderAmount:"orderAmount",
    addressee:"addressee",
    orderNumber:"orderNumber",
    orderTime:"orderTime",
    paymentTime:"paymentTime",
    logistics:"logistics",
    freightMoney:"freightMoney",
    status:"status",
    adds:"1"
  },
  {
    id:"3",
    pic:"https://cbu01.alicdn.com/img/ibank/2017/491/735/4502537194_96529336.jpg",
    title:"title",
    sku:"sku",
    orderAmount:"orderAmount",
    addressee:"addressee",
    orderNumber:"orderNumber",
    orderTime:"orderTime",
    paymentTime:"paymentTime",
    logistics:"logistics",
    freightMoney:"freightMoney",
    status:"status",
    adds:"1"
  },
]
export default {
  name:"orderverify",
  data(){
    return{
      datas,
      queryParam:{
        status:"0",
        logistics:"0",
        orderNumber:"",
      },
      addstatus:true,
      form: this.$form.createForm(this),
      queryStatus:"请输入订单号",
      ScreeningOrder:"0",
      modals:false,
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 8 } },
      externalLogistics:"externalLogistics",
      interiorLogistics:"",
      logisticscode:"",
      logisticsmoney:"60",
      ModalText:"确认删除吗",
      confirmLoading:false,
      visible:false,
      data:{
        Addressee:"李洛克",
        phone:"15003000300",
        mobile:"037168752365",
        country:"米国",
        province:"华盛顿",
        city:"罗克福",
        addressone:"666号",
        addresstow:"888号",
        zipcode:"920375"
      }
    }
  },
  created(){},
  mounted(){},
  updated(){},
  destroyed(){},
  methods:{
    nextStep(e){
      const { form: { validateFields } } = this;
      validateFields((errors, values) => {
        console.log(values,"提交的数据")
        console.log(this.datas,this.logisticscode,this.logisticsmoney,this.interiorLogistics,this.externalLogistics)
        // ...
      });
    },
    addtable(add,i){
    },
    onstatus(){
      if(this.queryParam.status === '0'){
        this.queryStatus = '请输入订单号'
      }else if(this.queryParam.status === '1'){
        this.queryStatus = '请输入sku'
      }
    },
    // 删除订单
    orderdel(){
      this.visible=true
    },
    handleOk(){
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 1000);
    },
      handleCancel(e) {
      this.visible = false
    },
  }
}
</script>
<style scoped lang='less'>
  .mt{margin-top: 20px;}
  .mr{margin-right: 20px;}
</style>