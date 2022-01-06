<template>
  <div class="orderdetails">
    <a-form :form="form"   v-if="data">
    <a-card hoverable :bordered="false" title='收货地址'>
      <a-row>
        <a-col :span="8">
          <a-form-item
            label="收件人"
            :labelCol="{span:8}"
            :wrapperCol="{span:16}"
          >
            <a-input
            :disabled="showInt"
            v-decorator="['Name', { initialValue: data.shipping_address.Name, rules: [{required: false, message: '收件人名称不能为空'}] }]" 
            :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
          </a-form-item>
        </a-col>
          <a-col  :span="8">
            <a-form-item
              label="手机号"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input
              :disabled="showInt"
                v-decorator="['Phone', { initialValue: data.shipping_address.Phone, rules: [{required: false, message: '手机不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="邮编"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input
              :disabled="showInt"
                v-decorator="['PostalCode', { initialValue: data.shipping_address.PostalCode, rules: [{required: false, message: '邮编不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
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
            <!-- disabled -->
            <a-input 
            disabled
            v-decorator="['CountryCode', { initialValue: data.shipping_address.CountryCode, rules: [{required: false, message: '国家不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
          </a-form-item>
        </a-col>
          <a-col  :span="8">
          <a-form-item
            label="州或省"
            :labelCol="{span:8}"
            :wrapperCol="{span:16}"
          >
            <a-input 
            :disabled="showInt"
            v-decorator="['StateOrRegion', { initialValue: data.shipping_address.StateOrRegion, rules: [{required: false, message: '州或省不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
          </a-form-item>
          </a-col>
          <a-col  :span="8">
          <a-form-item
            label="地区"
            :labelCol="{span:8}"
            :wrapperCol="{span:16}"
          >
            <a-input
            :disabled="showInt"
              v-decorator="['District', { initialValue: data.shipping_address.District, rules: [{required: false, message: '省不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
          </a-form-item>
          </a-col>
      </a-row>
      <a-row>
        <a-col  :span="8">
          <a-form-item
            label="县"
            :labelCol="{span:8}"
            :wrapperCol="{span:16}"
          >
            <a-input
            :disabled="showInt"
              v-decorator="['County', { initialValue: data.shipping_address.County, rules: [{required: false, message: '省州不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
          </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="城市"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input 
              :disabled="showInt"
              v-decorator="['City', { initialValue: data.shipping_address.City, rules: [{required: false, message: '城市不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
            </a-form-item>
          </a-col>
      </a-row>
      <a-row>
        <a-col  :span="8">
          <a-form-item
            label="详细地址1"
            :labelCol="{span:8}"
            :wrapperCol="{span:16}"
          >
            <a-input
            :disabled="showInt"
              v-decorator="['AddressLine1', { initialValue: data.shipping_address.AddressLine1, rules: [{required: false, message: '详细地址1不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
          </a-form-item>
        </a-col>
          <a-col  :span="8">
            <a-form-item
              label="详细地址2"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input 
              :disabled="showInt"
              v-decorator="['AddressLine2', { initialValue: data.shipping_address.AddressLine2, rules: [{required: false, message: '详细地址2不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="详细地址3"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input 
              :disabled="showInt"
              v-decorator="['AddressLine3', { initialValue: data.shipping_address.AddressLine3, rules: [{required: false, message: '详细地址3不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
            </a-form-item>
          </a-col>
      </a-row>
    </a-card>
    <!-- {{data.clearance}} -->
    <a-card class='mt relative ' :bordered="false" title='报关信息' >
      <!-- <template  v-slot:extra></template> -->
      <div class='absolute position-solt colors cursor-hand' @click='todeclareInfo'>（关于多条报关信息时填写注意事项&nbsp;<a-icon type="question-circle" />）</div>
      <div style='margin-right:40px;' slot="extra">
        <a-button class="mr" @click="quoteInfo">引用报关信息</a-button>
        <a-button type='primary'  :disabled="(infoList.length >= data.product.length)"  @click='addinfoList'>新增</a-button>
        <!-- <a-button type='primary'    @click='addinfoList'>新增</a-button> -->
        <a-button class='ml'  :disabled="!(infoList.length >1)" type='danger'  @click='delinfoList'>删除</a-button>
      </div>
      <div v-for='(item,index) in infoList' :key='index' >
        <a-row>
          <a-col  :span="8">
            <a-form-item
              label="中文名称"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input 
              :disabled="showInt"
              v-decorator="['cnName.'+index, { initialValue: data.clearance[index].cnName, rules: [{ required:(index===0?true:false) , message: '中文名称不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="英文名称"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input 
              :disabled="showInt"
              v-decorator="['enName.'+index, { initialValue: data.clearance[index].enName, rules: [{required:(index===0?true:false), message: '英文名称不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
            </a-col>
            <a-col  :span="8">
              <a-form-item
                label="申报金额（usd）"
                :labelCol="{span:8}"
                :wrapperCol="{span:16}"
              >
                <a-input 
                :disabled="showInt"
                v-decorator="['usd.'+index, { initialValue:data.clearance[index].usd, rules: [{required: (index===0?true:false), message: '申报金额（usd）不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85%)' }"/>
              </a-form-item>
            </a-col>
        </a-row>
        <a-row>
          <a-col  :span="8">
            <a-form-item
              label="报关重量(g)"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input 
              :disabled="showInt"
              v-decorator="['weight.'+index, { initialValue: data.clearance[index].weight, rules: [{required: (index===0?true:false), message: '报关重量不能为空'}] }]"  
              :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="商品数量"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input-number  
              :min="1"
              :disabled="showInt"
              v-decorator="['quantity.'+index, { initialValue: data.clearance[index].quantity, rules: [{required: (index===0?true:false), message: '报关数量不能为空'}] }]"  
              :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="商品类型"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input 
              :min="1"
              :disabled="showInt"
              v-decorator="['type.'+index, { initialValue: data.clearance[index].type, rules: [{required: false, message: '商品类型不能为空'}] }]"  
              :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8">
            <a-form-item
              label="商品描述 "
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input
              :min="1"
              :disabled="showInt"
              v-decorator="['desc.'+index, { initialValue: data.clearance[index].desc, rules: [{required: false, message: '商品描述不能为空'}] }]"  
              :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8" v-show="true">
            <a-form-item
              label="sku"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input 
              :min="1"
              :disabled="true"
              v-decorator="['sku.'+index, { initialValue: data.clearance[index].sku, rules: [{required: false, message: 'sku不能为空'}] }]"  
              :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
        </a-row>

      </div>
    </a-card>
    <a-card class='mt' :bordered="false" title='物流信息'>
      <a-row>
        <a-col  :span="8">
          <a-form-item
            label="物流名称"
            :labelCol="{span:8}"
            :wrapperCol="{span:16}"
          >
          <a-tree-select
            disabled
            :style="{ display: 'inline-block', width: 'calc(85% )' }"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="treeData"
            placeholder='Please select'
            v-model='valueres'
            @change="onChangeSelect"
          >
          <span style="color: #08c" slot="title" slot-scope="{key, value}" >
            {{key}}{{value}}
          </span>
            </a-tree-select>
          </a-form-item>
          </a-col>
          <a-col  :span="8" >
            <a-form-item
              label="物流单号"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input 
              disabled
              v-decorator="['logistics_channel_code', { initialValue: data.logistics_channel_code, rules: [{required: false, message: '物流单号不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <a-col  :span="8" >
            <a-form-item
              label="备注单号"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input
              disabled
               v-decorator="['inland_info', { initialValue: data.inland_info, rules: [{required: false, message: '物流单号不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col  :span="8" >
            <a-form-item
              label="物流费用"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <a-input 
              disabled
              v-decorator="['logistics_price  ', { initialValue: data.logistics_price  , rules: [{required: false, message: '物流费用不能为空'}] }]"  :style="{ display: 'inline-block', width: 'calc(85% )' }"/>
            </a-form-item>
          </a-col>
          <!-- <a-col  :span="8" >
            <a-form-item
              label="订单备注"
              :labelCol="{span:8}"
              :wrapperCol="{span:16}"
            >
              <span  :style="{ display: 'block', width: 'calc(85% )' }">
                {{data.remark}}
              </span>
            </a-form-item>
          </a-col> -->
        </a-row>
        </a-card>
        <!-- <a-card class='mt' :bordered="false" title='订单标记'>
          <a-row >
            <a-col :span='8'>
              <a-form-item
                label="订单标记"
                :labelCol="{span:8}"
                :wrapperCol="{span:16}"
              >
                <a-select
                :style="{ display: 'inline-block', width: 'calc(85% )' }"
                label-in-value
                :default-value="colorSelectValue"
                @change="handleChangeSign"
                placeholder='请选择订单标记'
              >
                <a-select-option :value="item.key"  v-for='(item,index) in selectColor' :key='index' >
                  {{item.name}}
                </a-select-option>
              </a-select>
              <span class='ml'>
                <a-icon type="setting" @click="tabSetingColor" />
              </span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card> -->
      </a-form>
    <a-card  class='mt' :bordered="false" title='商品信息'>
      <!-- //列表 -->
      <a-row class='mt'>
        <a-col :span="24">
          <a-table  :dataSource="product"  >
            <a-table-column
              title="id"
              dataIndex="order_item_id"
            >
            </a-table-column>
            <a-table-column
              title="图片"
              width='400px'
            >
              <template slot-scope="text, urldata">
                <a-popover  placement="rightTop">
                  <template slot="content" style="width:200px">
                    <img style="width:200px" :src="urldata.image" alt="">
                  </template>
                  <a-button style="width:100px;position:relative;overflow:hidden;height:100px">
                    <img
                      v-if='urldata.image'
                      style="width:100px; margin-left:-16px;margin-top:-2px"
                      :src="urldata.image"
                      alt="暂无订单信息"
                      @click="jumpToOrderUrl(urldata.ori_url)"/>
                       <img
                      v-else
                      style="width:100px; margin-left:-16px;margin-top:-2px"
                      :src="picAlt"
                      alt="暂无订单信息"
                      @click="jumpToOrderUrl(urldata.ori_url)"/>
                  </a-button>
                </a-popover>
              </template>
            </a-table-column>
            <a-table-column
              title="标题"
              width='400px'
            >
              <template slot-scope="text, urldata">
                <a target="_blank" :href="urldata.url">{{urldata.title}}</a>
              </template>
            </a-table-column>
            <a-table-column
              title="sku"
                dataIndex="sku"
            >
            </a-table-column>
            <a-table-column
              title="订单金额"
            >
            <template slot-scope="text, record">
              <span>
                {{record.amount}} ({{record.currency_code}})
              </span>
            </template>
            </a-table-column>
            <a-table-column
              title="量"
              dataIndex="quantity"
            >
            </a-table-column>
            <!-- <a-table-column
              title="操作"
            >
              <template slot-scope="text, record">
                <span>
                  <a-button :type="record.adds==='0'?'primary':''" @click='addtable(record.adds==="0"?record.adds="1":record.adds="0")'>{{record.adds==='0'?"确认添加" + record.adds:"取消添加" +record.adds}}</a-button>
                </span>
              </template>
            </a-table-column> -->
          </a-table>
        </a-col>
      </a-row>
      <a-row class='mt'>
        <a-col>
          <a-form-item :wrapperCol="{span: 12, offset: 10}">
            <a-button @click='cancel()'  style='margin-left:10px' >取消</a-button>
            <a-button v-if='data.status ==="0"' type="primary" style='margin-left:10px' :disabled='showInt' @click="nextStep">保存</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-modal
      title="修改订单标记"
      :visible="TabColor"
      :confirm-loading="TabColorLoading"
      @ok="TabColorOk"
      @cancel="TabColorCancel"
      :width='750'
      :maskClosable = 'false'
      >
      <div>
        <a-table 
        :columns="columns" 
        :data-source="colorData" 
        :pagination='false' 
        bordered>
          <template
            v-for="col in ['name', 'color']"
            :slot="col"
            slot-scope="text, record, index"
          >
            <div v-if="col === 'name'" :key="col">
              <a-input
                v-if="record.editable"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.key, col,e)"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
            <div v-if="col === 'color'" :key="col">
              <a-input
                v-if="record.editable"
                style="margin: -5px 0"
                :value="text"
                type='color'
                @change="e => handleChange(e.target.value, record.key, col,e)"
              />
              <!-- <a-select
                v-if="record.editable"
                :style="{ display: 'inline-block', width: 'calc(100% )' }"
                label-in-value
                :default-value="text"
                 @change="e => handleChangeColor(e.key,record.key,col)"
                placeholder='请选择订单标记'
              >
                <a-select-option  v-for='(item) in selectColor' :key='item.color'>
                  <div :style='{backgroundColor:item.color,width: "20px",height: "20px",marginTop:"5px"}'>
                  </div>
                </a-select-option>
              </a-select> -->
              <template v-else>
                  <div :style='{backgroundColor:text,width: "20px",height: "20px",marginTop:"5px"}'></div>
              </template>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record, index">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => save(record.key)">保存</a>
                &nbsp;&nbsp;
                <a @click="() => del(record.key)">删除</a>
              </span>
              <span v-else>
                <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
                 &nbsp;&nbsp;
                <a @click="() => del(index)">删除</a>
              </span>
            </div>
          </template>
        </a-table>
          <a-button :style="{ display: 'inline-block', width: '100%' }" class='tac mt' @click='addColorDate()' icon="plus">
          </a-button>
      </div>
    </a-modal>
    <a-modal
     :maskClosable="false"
      title="报关列表"
      :visible="clearanceTemplateV"
      @ok='clearanceTemplateOk'
      @cancel="clearanceTemplateCancel"
      width='850px'
    >
    <div>
      <a-table
        :pagination='false' 
        :columns="templateColumns" 
        :data-source="templateData" 
        >        
          <template slot="battery" slot-scope="text, record">
            <div  >
              {{record.battery_status == "0"?"不含电":"含电"}}
            </div>
          </template>
          <template slot="open" slot-scope="text, record">
            <a-popconfirm
               title="确认引用此报关"
              ok-text="Yes"
              cancel-text="No"
              @confirm="templateQuote(record.id)"
              @cancel="templat">
              <div class='edit-title'>引用</div>
            </a-popconfirm>
            
          </template>
      </a-table>
                <a-row
            class='mt'
            type="flex"
            justify="end"
          >
            <a-col>
              <a-pagination
              v-model="templateCurrent" 
              @change='templatePageChange' 
              :pageSize='templatePage.pageSize' 
              :total='(templatePage.pageSize*templatePage.lastPage)' />
            </a-col>
          </a-row>
    </div>
    </a-modal>

  </div>
</template>
<script>
const columns = [
  {
    title: '标记名称',
    dataIndex: 'name',
    width: '40%',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '颜色',
    dataIndex: 'color',
    width: '40%',
    scopedSlots: { customRender: 'color' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];
// const colorData = [];
// for (let i = 0; i < 10; i++) {
//   colorData.push({
//     key: i.toString(),
//     name: `Edrward ${i}`,
//     color: 32,
//   });
// }
import Vue from 'vue'
import {deepClone , copyData ,handlerData} from '@/utils/util'
import { 
oriOrderList ,
groupUpdate , 
getChannel, 
amazonOrderDetail,
updateOrderDetail,
getClearanceTemplate
 } from '@/api/order'
export default {
  name:"orderdetails",
  data(){
    
    return{
      product:"",
      id:"",
      treeData:"",
      CountryCode:"",
      selectvalue:"",
      queryParam:{
        status:"0",
        logistics:"0",
      },
      addstatus:true,
      form: this.$form.createForm(this),
      queryStatus:"请输入订单号",
      ScreeningOrder:"0",
      modals:false,
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 8 } },
      externalLogistics:"externalLogistics",
      interiorLogistics:"interiorLogistics",
      logisticscode:"",
      logisticsmoney:"60",
      ModalText:"确认删除吗",
      confirmLoading:false,
      visible:false,
      showInt:"",
      showInts:"",
      data:'',
      listLoading:false,
      valueres:"",
      inlandshow:"",
      infoList:[1],
      disableds:"",
      picAlt:require('@/assets/icons/picAlt.png'),
      columns,
      selectColor:[],
      // 选择框的颜色
      colorData:[],
      cacheData:[],
      colorSelectValue:'',
      TabColor:false,
      TabColorLoading:false,
      // colorData,
      editingKey: '',
      //报关信息
      templateCurrent:1,
      templatePage:"",
      clearanceTemplateV:false,
      templateData:"",
      templateColumns:[
        {
          title: '中文报关',
          dataIndex: 'cnName',
          scopedSlots: { customRender: 'cnName' },
        },
        {
          title: '英文报关',
          className: 'enName',
          dataIndex: 'enName',
        },
        {
          title: '报关金额',
          dataIndex: 'usd',
        },
        {
          title: '重量',
          dataIndex: 'weight',
        },
        {
          title: '商品类型',
          dataIndex: 'type',
        },
        {
          title: '商品描述',
          dataIndex: 'desc',
        },     
        {
          title: '是否含电',
          dataIndex: 'battery_status',
          scopedSlots: { customRender: 'battery' },
        },
        {
          title: '编辑',
          dataIndex: 'edit',
          scopedSlots: { customRender: 'open' },
        },
      ]


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
    console.log(typeof this.disableds)
    if(!this.$route.query.id){
      this.$router.go(-1)
    }
    this.getoriOrderList()
  },
  updated(){},
  destroyed(){},
  methods:{
    jumpToOrderUrl(url) {
      if (url) {
        console.log(url)
        window.open(url, '_blank')
      } else {
        console.log('跳转失败')
      }
    },
    onChangeSelect(value){
      this.Selectvalue =value
      console.log(this.Selectvalue)
    },
    cancel(){
      this.$router.push({
        path:'/order/orderverify/orderverifys',
         query:{
          orderTab:Vue.ls.get("orderTab")
        }
      })
    },
    addinfoList(){
      this.infoList.push(this.infoList[0])
      // console.log(this.infoList)
    },
    delinfoList(){
      this.infoList.pop(this.infoList.length)
      // console.log(this.infoList)
    },
    getChannels(){
      console.log("123")
      getChannel({
        country_code:this.CountryCode
      }).then(res=>{
        this.treeData = handlerData(res.data)
        console.log("treeData",res)
      })
    },
    getoriOrderList(){
      this.listLoading=true;
      amazonOrderDetail({
        id:this.id
      }).then((res)=>{
        if(res.code === 0){
          this.listLoading=false;  
          if(res.data){
            this.data = res.data
            this.product = res.data.product
            this.CountryCode = res.data.shipping_address.CountryCode
            this.valueres = res.data.logistics_channel
            // this.selectColor = res.data.color_mark_options
            // this.colorSelectValue = res.data.color_mark
            // this.selectColor = deepClone(res.data.color_mark_options)
            // this.colorSelectValue = deepClone(res.data.color_mark)
            // this.cacheData = deepClone(res.data.color_mark_options)
            if(res.data.color_mark){
              let  DefaultValue = {
                key:''
              }
              DefaultValue.key = res.data.color_mark.key
              this.colorSelectValue = DefaultValue
            }else{
              let  DefaultValue = {
                key:'0'
              }
              this.colorSelectValue = DefaultValue
            }
            console.log(this.colorSelectValue,'colorSelectValue')
            console.log(res.data.status==='0',this.disableds === '0','uuu')
            res.data.status==='0'?this.showInt = false:this.showInt=true;
            console.log(this.showInt,'上一个禁用')
            // res.data.inland_info===null?this.showInts =false :this.showInts =true
            this.infoList = res.data.clearance
            if(res.data.is_checked === '0'){
              if(res.data.inland_info){
                this.inlandshow = true
              }else{
                this.inlandshow = false
              }
            }
            console.log(this.disableds,typeof(this.disableds),'dis')
            if(this.disableds === '0'){
              console.log('禁用了')
              this.showInt=true
            }
            console.log(this.showInt,'showint')
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });  

          }
        this.getChannels()
        }else{
          this.$notification.error({
            message: '失败',
            description: res.msg,
          });
        }
      })
    },
    nextStep(e){
      //logistics_channel
      const { form: { validateFields } } = this;
      validateFields((errors, values) => {
        if (!errors) {
          // console.log('values', values)
          if(!this.Selectvalue){
            // console.log("用户没选值")
            this.Selectvalue = this.valueres
          }else{
            // console.log("用户选址了")
          }
          if(values.quantity<=0){
            this.$notification.error({
              message: '错误',
              description: '数量不能小于0',
            });
          }else{
            console.log(this.selectColor,'selectColor',this.colorSelectValue,'colorSelectValue')
            updateOrderDetail({
              // logistics_channel:this.Selectvalue,
              // channel_code:this.Selectvalue,
              id:this.id,
              AddressLine1: values.AddressLine1,
              AddressLine2: values.AddressLine2,
              AddressLine3: values.AddressLine3,
              CountryCode: values.CountryCode,
              County: values.County,
              // color_mark:this.colorSelectValue,
              // color_mark_options:this.selectColor,
              District: values.District,
              Name: values.Name,
              Phone: values.Phone,
              PostalCode: values.PostalCode,
              StateOrRegion: values.StateOrRegion,
              City: values.City,
              // cnName:values.cnName,
              // enName: values.enName,
              // usd: values.usd,
              // weight: values.weight,
              // quantity:values.quantity,
              clearance: [
                {
                  cnName: values.cnName.toString(),
                  enName: values.enName.toString(),
                  weight: values.weight.toString(),
                  quantity: values.quantity.toString(),
                  type: values.type.toString(),
                  desc: values.desc.toString(),
                  usd: values.usd.toString(),
                  sku: values.sku.toString(),
                  // battery_status: "0"
                }
              ]
            }).then(res =>{
              console.log(res.data)
              if(res.code === 0){
                this.$notification.success({
                  message: '成功',
                  description: res.msg,
                });
                // 需要做判断 回到上集页面
                this.$router.push({
                  path:'/order/orderverify/orderverifys',
                  query:{
                    orderTab:Vue.ls.get("orderTab")
                  }
                })
              }else{
                this.$notification.error({
                  message: '错误',
                  description: res.msg,
                });
              }
            })
          }
        }
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
    tabSetingColor(){
      this.TabColor = true
      console.log(this.TabColor,'TabColor')
      this.colorData = deepClone(this.selectColor)
    },
    TabColorOk(){
      console.log(this.colorData)
      this.selectColor = deepClone(this.colorData)
      this.TabColor = false
      this.editingKey = ''
    },
    TabColorCancel(){
      this.TabColor = false
      this.editingKey = ''
    },
    handleChange(value, key, column,e) {
      console.log(value,key,column,'column',e)
      //正 0 name
      const newData = [...this.colorData];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.colorData = newData;
      }
    },
    handleChangeColor(value,key,column){
      console.log(column,'column')
      console.log(value,key,column,'column')
      const newData = [...this.colorData];
      const target = newData.filter(item => key === item.key)[0];
      console.log(target)
      if (target) {
        target[column] = value;
        this.colorData = newData;
      }
    },
    edit(key) {
      const newData = [...this.colorData];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.colorData = newData;
      }
    },
    save(key) {
      const newData = [...this.colorData];
      const newCacheData = [...this.cacheData];
      const target = newData.filter(item => key === item.key)[0];
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.colorData = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = '';
    },
    addColorDate(){
      let selectData={
        key:"",
        name:'',
        color:'',
      }
      selectData.key = this.colorData.length
      this.colorData.push(selectData)
      console.log(this.colorData)
      this.cacheData = this.colorData
    },
    del(index){
      console.log(index)
      this.colorData.splice(index,1)
      this.colorData.forEach((item,inx)=>{
        item.key = inx
      })
      this.cacheData = this.colorData
    },
    handleChangeSign(value){
      console.log(value)
      
      this.colorSelectValue = value
      delete this.colorSelectValue.label
    },
    todeclareInfo(){
      let toRouteDeclareInfo = this.$router.resolve({
         path: "/declareInfo",
      })
      window.open(toRouteDeclareInfo.href,"_blank")
    },
    // cancel(key) {
    //   const newData = [...this.colorData];
    //   const target = newData.filter(item => key === item.key)[0];
    //   this.editingKey = '';
    //   if (target) {
    //     Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
    //     delete target.editable;
    //     this.colorData = newData;
    //   }
    // },
    // 引用报关信息
    quoteInfo(){
      this.clearanceTemplateV = true
      this.getClearanceTemplateFn()
    },
    clearanceTemplateOk(){
      this.clearanceTemplateCancel()
    },
    clearanceTemplateCancel(){
      this.clearanceTemplateV = false
    },
   templatePageChange(page,pagesize){
      this.templateCurrent = page;
      this.getClearanceTemplateFn()
      console.log(this.infoList,"infoList")
    },
    getClearanceTemplateFn(){
      getClearanceTemplate({
        page:this.templateCurrent,
        page_size:"10"
      }).then(res =>{
        console.log(res,"getClearanceTemplateFn")
        if(res.code === 0){
          this.templateData = handlerData(res.data)
          this.templatePage = res.pages
          console.log(this.templateData,"templateData")
        }
      })
    },
    templateQuote(id){
      console.log(id,this.infoList,"6666")
      let info = ""
      let infoList = this.infoList[0]
      this.templateData.forEach(v=>v.id===id?info = v:"")
      if(infoList){
        infoList.battery_status =  info.battery_status
        infoList.cnName =  info.cnName
        infoList.enName =  info.enName
        infoList.usd =  info.usd
        infoList.weight =  info.weight
        infoList.type =  info.type
        infoList.desc =  info.desc
      }else{
        this.$notification.error({
          message: '失败',
          description: "报关引用失败"
        })
      }
      this.infoList[0] = infoList
      console.log(this.infoList)
      this.$notification.success({
        message: '成功',
        description: "报关引用成功"
      })
      this.clearanceTemplateCancel()
    }
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
.flex{
  display:flex;
}
.flex-center{
  justify-content: center;
}
.flex-box{
  width: 100px;
}
.tac{
  text-align: center;
}
.relative{
  position:relative;
}
.absolute{
  position:absolute;
}
.position-solt{
  top: 21px;
  left: 100px;

}
.colors{
  color: red;
}
.cursor-hand{
  cursor:pointer;
}
.template-info{
   position:absolute;
   top: 21px;
   left: 300px;
}
.edit-title{
  color: #1890ff;
}


</style>