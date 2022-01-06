<template>
  <div class='domestic'>
    <a-button class='mb' :disabled='packageList.length<=0 ' @click='mergePackage()'>合并包裹</a-button>
    <a-form :form='form' class='mt'>
     <a-checkbox-group @change="onCheckChange" :options="plainOptions" v-model="checkedList" style='width:100%'> 
      <div class='' v-for='(item,index) in packageList' :key='index'>
        <a-row>
          <a-col :span='1' class='check'>
            <a-checkbox :checked="false"  :value='index'></a-checkbox>
          </a-col>
          <a-col :span='20'>
            <a-row >
              <a-col :span='12'>
                <a-form-item
                  v-for='(ivew,inx) in packageList[index].inland_name' :key='inx'
                  :label="'选择国内物流'"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  :validate-status="item.typeinland_name[inx]"
                  has-feedback
                  :help="item.helpinland_name[inx]"
                >
                  <a-select 
                    v-model='packageList[index].inland_name[inx]'
                    placeholder='请选择国内物流方式'
                    style="width: 250px" >
                    <a-select-option
                      :value="index"
                      v-for='(item,index) in logisInfo'
                      :key='index'
                      >{{item}} </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span='12'>
                <a-form-item
                  v-for='(ivew,inx) in packageList[index].inland_code' :key='inx'
                  :label="'国内单号'"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  :validate-status="item.typeinland_code[inx]"
                  has-feedback
                  :help="item.helpinland_code[inx]"
                >
                  <a-input
                  style="width: 250px"
                  placeholder='请填写国内单号'
                  v-model='packageList[index].inland_code[inx]'
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span='12'>
                <a-form-item
                  :label="'重量(g)'"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  :validate-status="item.typeWeight"
                  has-feedback
                  :help="item.helpWeight"
                >
                 <a-input-number
                 id='onlyInt'
                  :style="{ width: '250px'}"
                  placeholder='请填写重量'
                  v-model='item.weight'
                  >
               
                  </a-input-number>
                </a-form-item>
               
              </a-col>
              <a-col :span='12'>
                <a-form-item
                  :label="'是否含电'"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  :validate-status="item.typebattery_status"
                  has-feedback
                  :help="item.helpbattery_status"
                >
                <a-radio-group v-model="packageList[index].battery_status">
                  <a-radio  :value="1">是</a-radio>
                  <a-radio  :value="0">否</a-radio>
                </a-radio-group>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row
              class='mt'
              type="flex"
              justify="start">
              <a-col
                class='title-size'
                :span='3'>
                选择物流公司:
              </a-col>
              <a-col
                :span='4'
                v-show="logisticStatus1"
                style="margin-right:20px"
                @click="selectLogistics(index,1)">
                <a-button class="logistics_icon">
                  <img
                    style="width:90px; margin-left:-5px;margin-top:-5px"
                    :src="DSFlogo"
                    alt=""/>
                  <!-- <p v-show="logisticSelectShow[index] !=1" class="logistics_noselect"></p> -->
                  <p v-show="logisticSelectShow[index] ==1" class="logistics_select">
                    <i class="logistics_select1"></i>
                    <a-icon class="logistics_select2" type="check"/>
                  </p>
                </a-button>
              </a-col>
              <a-col
                :span='4'
                v-show="logisticStatus2"
                style="margin-right:20px"
                @click="selectLogistics(index,2)">
                <a-button class="logistics_icon">
                  <img
                    style="width:90px; margin-left:-5px;margin-top:-5px"
                    :src="YWlogo"
                    alt=""/>
                  <!-- <p v-show="logisticSelectShow[index]!=2" class="logistics_noselect"></p> -->
                  <p v-show="logisticSelectShow[index]==2" class="logistics_select">
                    <i class="logistics_select1"></i>
                    <a-icon class="logistics_select2" type="check"/>
                  </p>
                </a-button>
              </a-col>
              <a-col
                :span='4'
                style="margin-right:20px"
                v-show="logisticStatus3"
                @click="selectLogistics(index,3)">
                <a-button class="logistics_icon">
                  <img
                    style="width:90px; margin-left:-5px;margin-top:-5px"
                    :src="SFlogo"
                    alt=""/>
                  <!-- <p v-show="logisticSelectShow[index]!=3" class="logistics_noselect"></p> -->
                  <p v-show="logisticSelectShow[index]==3" class="logistics_select">
                    <i class="logistics_select1"></i>
                    <a-icon class="logistics_select2" type="check"/>
                  </p>
                </a-button>
              </a-col>
              <a-col
                :span='4'
                style="margin-right:20px"
                v-show="item.company_status">
                <span style="color:#f5222d">物流公司不能为空</span>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span='12'>
                <a-form-item
                  :label="'选择国际物流'"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  :validate-status="item.typelogistics_channel_name"
                  has-feedback
                  :help="item.helplogistics_channel_name"
                >
                  <span v-if="!logisticSelectShow[index]" style="color:#1890ff">请先选择物流公司</span>
                  <a-tree-select
                    v-if="logisticSelectShow[index]"
                    style="width:70%"
                    :dropdownStyle="{ maxHeight:'400px', overflow:'auto'}"
                    :treeData="treeData[index]"
                    placeholder='请选择国际物流方式'
                    @change='channelNameChange(packageList[index].logistics_channel_name,index)'
                    v-model='packageList[index].logistics_channel_name'>
                    <span
                      style="color: #08c"
                      slot="title"
                      slot-scope="{key, value}">
                      {{key}}{{value}}
                    </span>
                  </a-tree-select>
                </a-form-item>
              </a-col>
              <a-col :span='12'>
                <a-form-item
                  :label="'国际单号'"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  :validate-status="item.typelogistics_channel_code"
                  has-feedback
                  :help="item.helplogistics_channel_code"
                >
                  <a-input
                  disabled
                  style="width: 250px"
                  placeholder='点击获取单号自动填充'
                  v-model='packageList[index].logistics_channel_code'
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span='12'>
                <a-form-item
                  :label="'运费预估约'"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                <span  v-if='packageList[index].freight'>{{packageList[index].freight}}元</span>
                </a-form-item>
                <a-form-item
                  :label="'物流限制'"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                <span  v-if='packageList[index].limit'>{{packageList[index].limit}}kg</span>
                </a-form-item>
                <a-form-item
                  :label="'预估到货时间'"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                <span v-if='packageList[index].ArrivalTime'>{{packageList[index].ArrivalTime}}</span>
                </a-form-item>
                <a-form-item
                  :label="'发货仓库地址'"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                <div v-if='packageList[index].address' v-for='(addres,inx) in packageList[index].address' :Key='inx'> {{addres}}</div>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  :label="'备注'"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-textarea placeholder="请输入国内物流的预计到货时间" :rows="5"  v-model='packageList[index].remark'/>
                  <!-- <a-input placeholder="请输入备注信息" :rows="5"  v-model='packageList[index].remark'></a-input> -->
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span='3'>
            <a-button :disabled='packageList.length <= 1 ? true:false ' @click='delDomestic(index)'>删除单号</a-button>
            <a-button v-if='packageList[index].inland_code.length>1'  class='mt'  @click='splitBox(index)'>拆分包裹</a-button>
          </a-col>
        </a-row>
        <a-divider orientation="left"></a-divider>
      </div>
      <div>
        <a-button block  @click='addDomestic()'>添加新包裹</a-button>
      </div>
      </a-checkbox-group>
    </a-form>
    <footer class='footers mt'>
      <a-button :disabled='disabledAll.cancel' @click='cancel()'>取消</a-button>
      <a-button :disabled='disabledAll.returns || reutrnBtn' @click='returns()' class='ml'>返回</a-button>
      <a-button :disabled='disabledAll.getNumbers' :loading='getNumbersLoading' @click='getNumbers()' class='ml'>获取单号</a-button>
      <a-button :disabled='disabledAll.submit' class='ml' :loading='submitLoading' @click='handleSubmit()'>确认</a-button>
    </footer>
    <a-modal
      title="获取运单号"
      :visible="getNumVisible"
      @ok="getNumhandleOk"
      @cancel="getNumhandleCancel"
    >
      <p>获取单号后，将不可进行包裹的合并拆分操作，请谨慎操作</p>
      <!-- <p>点击确认后，将不可进行合并/拆分了。点击取消，则取消获取单号操作</p> -->
    </a-modal>
    <a-modal
      title="确认保存"
      :visible="submitChecked"
      @ok="submitCheckedOk"
      @cancel="submitCheckedCancel"
    >
      <p>保存物流信息后，将不可再次修改物流信息，请谨慎操作</p>
      <!-- <p>点击确认后，将不可进行合并/拆分了。点击取消，则取消获取单号操作</p> -->
    </a-modal>
  </div>
</template>
<script>
const plainOptions = []
import {deepClone , copyData} from '@/utils/util'
import Vue from 'vue'
import { getNums , warehouseAddress ,getOrderLogistics , handlerDomesticOrder,getChannel,getLogisticsCompany} from '@/api/order'
export default{
  name:"domestic",
  components:{
  },
  props:['orderID','Channel','openDomesticState','logisInfo','country_code_param','battery_status','orderWeight'],
  data(){
    return{
      plainOptions,
      checkedList:[],
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      packageList:[
        {
          id:"",
          inland_name:[],
          inland_code:[],
          logistics_channel_name:"",
          logistics_channel_code:"",
          battery_status:"",
          address:[],
          ArrivalTime:"",
          remark:"",
          weight:"",
          freight:"",
          limit:"",
          typeinland_name:[],       
          helpinland_name:[], 
          typeinland_code:[],
          helpinland_code:[],
          company:"",
        }
      ],
      initPackageList:{
        id:"",
        inland_name:[],
        inland_code:[],
        weight:"",
        battery_status:'0',
        logistics_channel_name:"",
        logistics_channel_code:"",
        freight:"",
        limit:"3",
        ArrivalTime:"",
        address:[],
        remark:"",
        typeinland_name:['',''],       
        helpinland_name:['',''], 
        typeinland_code:[],
        helpinland_code:[],
        company:"",
      },
      checkMerge:"",
      submitList:"",
      checkValue:"",
      agentPackageList:"",
      checkInsert:"",
      inland_codeAll:"",
      getNumVisible:false,
      getNumbersLoading:false,
      NoOperationBox:false,
      getNumFrequency:0,
      getNumbersAll:[],
      NumbersAlls:[],
      remarkState:false,
      submitLoading:false,
      disabledAll:{
        cancel:false,
        returns:false,
        getNumbers:false,
        submit:false,
      },
      treeData:[],
      reutrnBtn:false,
      submitChecked:false,
      is_type:2,
      DSFlogo:require("@/assets/image/dsf.jpg"),
      YWlogo:require("@/assets/image/yw.jpg"),
      SFlogo:require("@/assets/image/sf.jpg"),
      logisticSelectShow:[0],
      logisticSelectIndex:0,
      nums:"",
      logisticStatus1:false,
      logisticStatus2:false,
      logisticStatus3:false,
    }
  },
  methods:{
    handleSubmit() {
      let num = 0;
      console.log("执行了",this.packageList);
      this.submitLoading = true
      this.packageList.forEach((item,index)=>{
        if(item.inland_name.length<=0 || item.inland_code.length<=0 || item.weight.length <=0 || item.battery_status.length<=0 || item.logistics_channel_name.length<=0 || item.logistics_channel_code.length <= 0){
          num ++ 
          console.log(item.inland_name.length,'inland_name.length')
          //判断国内物流
          if(item.inland_name.length <= 0 ){
            this.packageList[index].typeinland_name = 'error'
            this.packageList[index].helpinland_name = '国内物流不能为空'
          }else{
            item.inland_name.forEach((ive,inx)=>{
              if(ive.length<=0){
                this.packageList[index].typeinland_name[inx]='error'
                this.packageList[index].helpinland_name[inx]='国内物流不能为空'
              }else{
                this.packageList[index].typeinland_name[inx]='success'
                this.packageList[index].helpinland_name[inx]=''
              }
            })
          }
          //判断国内单号
          if(item.inland_code.length <= 0){
            // console.log(item.inland_code.length,'inland_code.length')
            this.packageList[index].typeinland_code="error",
            this.packageList[index].helpinland_code="国内单号不能为空"
          }else{
            item.inland_code.forEach((ivew,inx)=>{
              if(ivew.length <=0){
                // console.log(this.packageList[index].typeinland_code)
                // console.log(this.packageList[index].typeinland_code[inx])
                this.packageList[index].typeinland_code[inx]='error'
                this.packageList[index].helpinland_code[inx]='国内单号不能为空'
              }else{
                this.packageList[index].typeinland_code[inx]='success'
                this.packageList[index].helpinland_code[inx]=''
              }
            })
          }
          // 判断重量
          if(item.weight.length<=0){
            this.packageList[index].typeWeight="error",
            this.packageList[index].helpWeight="重量不能为空"
          }else{
            this.packageList[index].typeWeight="success",
            this.packageList[index].helpWeight=""
          }
          //判断是否含电
          if(item.battery_status.length<=0){
            this.packageList[index].typebattery_status="error",
            this.packageList[index].helpbattery_status="是否含电不能为空"
          }else{
            this.packageList[index].typebattery_status="success",
            this.packageList[index].helpbattery_status=""
          }
          //判断是否选择物流公司
          if(item.company){
            this.packageList[index].company_status = 0
            //判断国际物流
            if(item.logistics_channel_name.length<=0){
              this.packageList[index].typelogistics_channel_name="error",
              this.packageList[index].helplogistics_channel_name="国际物流不能为空"
            }else{
              this.packageList[index].typelogistics_channel_name="success",
              this.packageList[index].helplogistics_channel_name=""
            }
          }else{
            this.packageList[index].company_status = 1
            this.packageList[index].typelogistics_channel_name="",
            this.packageList[index].helplogistics_channel_name=""
          }
          
          //判断国际单号
          if(item.logistics_channel_code.length<=0){
            this.packageList[index].typelogistics_channel_code="error",
            this.packageList[index].helplogistics_channel_code="国际单号不能为空"
          }else{
            this.packageList[index].typelogistics_channel_code="success",
            this.packageList[index].helplogistics_channel_code=""
          }
          //如果没选物流公司，阻断代码
          if(this.packageList[index].company_status){
            return
          }
          // console.log(this.packageList,'list')
        }else{
          console.log('校验通过')
          item.inland_code.forEach((ivew,inx)=>{
            if(ivew.length <=0){
              this.packageList[index].typeinland_code[inx]='error'
              this.packageList[index].helpinland_code[inx]='国内单号不能为空'
            }else{
              this.packageList[index].typeinland_name[inx]="success",
              this.packageList[index].helpinland_name[inx]=""
              this.packageList[index].typeinland_code[inx]="success"
              this.packageList[index].helpinland_code[inx]=""
              this.packageList[index].typeWeight="success"
              this.packageList[index].helpWeight=""
              this.packageList[index].typebattery_status="success"
              this.packageList[index].helpbattery_status=""
              this.packageList[index].typelogistics_channel_name="success"
              this.packageList[index].helplogistics_channel_name=""
              this.packageList[index].typelogistics_channel_code="success"
              this.packageList[index].helplogistics_channel_code=""
              this.packageList[index].company_status = 0
            }
          })
        }
      })
      //更新数组
      this.packageList.reverse().reverse()
      console.log(this.packageList,'packageList')
      if(num === 0){
        console.log("num0")
        this.submitList = []
        this.packageList.forEach((item,index)=>{
          var info = {
            inland_name:"",
            inland_code:"",
            weight:"",
            battery_status:"",
            logistics_channel_name:"",
            logistics_channel_code:"",
            remark:"",
            id:"",
            company:""
          }
          info.company = item.company
          info.inland_name = item.inland_name
          info.inland_code = item.inland_code
          info.weight = item.weight
          info.battery_status = item.battery_status
          info.logistics_channel_name = item.logistics_channel_name
          info.logistics_channel_code = item.logistics_channel_code
          info.remark = item.remark
          info.id = item.id
          this.submitList[index]=info;
        })
        console.log(this.packageList,'packageList','success',this.submitList,'submitList')
        this.submitChecked = true
        //调用保存接口
        
      }else{
        this.submitLoading = false
        console.log(this.packageList,'packageList','error')
      }
    },
    submitCheckedOk(){
      this.handlerDomesticOrderFn(this.submitList)
    },
    submitCheckedCancel(){
      this.submitChecked = false
      this.submitLoading = false
    },
    // 提交接口
    handlerDomesticOrderFn(submitList){
      handlerDomesticOrder({
        package:submitList,
        id:this.orderID
      }).then((res=>{
        if(res.code === 0){
            this.submitLoading = false
          console.log('保存完成')
          this.cancel()
          this.submitChecked = false
        }else{
          console.log('保存失败')
            this.submitLoading = false
            this.submitChecked = false
        }
      }))
    },
    // 合并包裹校验
    mergeBoxCheck() {
      let num = 0;
      this.packageList.forEach((item,index)=>{
        if(this.checkValue.indexOf(index)>-1){
          if(item.inland_name.length <=0 || item.inland_code.length <=0 ){
            num ++ 
            //判断国内物流
            if(item.inland_name.length <= 0 ){
              this.packageList[index].typeinland_name = 'error'
              this.packageList[index].helpinland_name = '国内物流不能为空'
            }else{
              item.inland_name.forEach((ive,inx)=>{
                if(ive.length<=0){
                  this.packageList[index].typeinland_name[inx]='error'
                  this.packageList[index].helpinland_name[inx]='国内物流不能为空'
                }else{
                  this.packageList[index].typeinland_name[inx]='success'
                  this.packageList[index].helpinland_name[inx]=''
                }
              })
            }
            //判断国内单号
            if(item.inland_code.length <= 0){
              // console.log(item.inland_code.length,'inland_code.length')
              this.packageList[index].typeinland_code="error",
              this.packageList[index].helpinland_code="国内单号不能为空"
            }else{
              item.inland_code.forEach((ivew,inx)=>{
                if(ivew.length <=0){
                  this.packageList[index].typeinland_code[inx]='error'
                  this.packageList[index].helpinland_code[inx]='国内单号不能为空'
                }else{
                  this.packageList[index].typeinland_code[inx]='success'
                  this.packageList[index].helpinland_code[inx]=''
                }
              })
            }
          }else{
            item.inland_code.forEach((ivew,inx)=>{
              if(ivew.length <=0){
                this.packageList[index].typeinland_code[inx]='error'
                this.packageList[index].helpinland_code[inx]='国内单号不能为空'
                num++
              }else{
                this.packageList[index].typeinland_code[inx]='success'
                this.packageList[index].helpinland_code[inx]=''
              }
            })
            item.inland_name.forEach((ivew,inx)=>{
              if(ivew.length <=0){
              this.packageList[index].typeinland_name[inx]='error'
              this.packageList[index].helpinland_name[inx]='国内物流不能为空'
                num++
              }else{
                this.packageList[index].typeinland_name[inx]='success'
                this.packageList[index].helpinland_name[inx]=''
              }
            })
          }
        }else{
          
        }
      })
      //更新数组
      this.packageList.reverse().reverse()
      if(num === 0){
        return true
      }else{
        this.$notification.error({
          message: '错误',
          description: '信息未填写完整',
        });
        return false
      }
    },
    // 获取单号校验
    getNumCheck(){
      let num = 0
      //选择国内物流 国内单号 重量 选择国际物流
      this.packageList.forEach((item,index)=>{
          //清空保存信息时的验证效果
          this.packageList[index].typelogistics_channel_code="",
          this.packageList[index].helplogistics_channel_code=""
        if(item.inland_name.length <=0 || item.inland_code.length <=0 ||item.weight.length <=0 || item.battery_status.length<=0 || item.logistics_channel_name.length<=0){
          num ++ 
          //判断国内物流
          if(item.inland_name.length <= 0 ){
            this.packageList[index].typeinland_name = 'error'
            this.packageList[index].helpinland_name = '国内物流不能为空'
          }else{
            item.inland_name.forEach((ive,inx)=>{
              if(ive.length<=0){
                this.packageList[index].typeinland_name[inx]='error'
                this.packageList[index].helpinland_name[inx]='国内物流不能为空'
              }else{
                this.packageList[index].typeinland_name[inx]='success'
                this.packageList[index].helpinland_name[inx]=''
              }
            })
          }
          //判断国内单号
          if(item.inland_code.length <= 0){
            this.packageList[index].typeinland_code="error",
            this.packageList[index].helpinland_code="国内单号不能为空"
          }else{
            item.inland_code.forEach((ivew,inx)=>{
              if(ivew.length <=0){
                this.packageList[index].typeinland_code[inx]='error'
                this.packageList[index].helpinland_code[inx]='国内单号不能为空'
              }else{
                this.packageList[index].typeinland_code[inx]='success'
                this.packageList[index].helpinland_code[inx]=''
              }
            })
          }
          // 判断重量
          if(item.weight.length<=0){
            this.packageList[index].typeWeight="error",
            this.packageList[index].helpWeight="重量不能为空"
          }else{
            this.packageList[index].typeWeight="success",
            this.packageList[index].helpWeight=""
          }
          //判断是否含电
          if(item.battery_status.length<=0){
            this.packageList[index].typebattery_status="error",
            this.packageList[index].helpbattery_status="是否含电不能为空"
          }else{
            this.packageList[index].typebattery_status="success",
            this.packageList[index].helpbattery_status=""
          }
          //判断国际物流
          if(item.logistics_channel_name.length<=0){
            this.packageList[index].typelogistics_channel_name="error",
            this.packageList[index].helplogistics_channel_name="国际物流不能为空"
          }else{
            this.packageList[index].typelogistics_channel_name="success",
            this.packageList[index].helplogistics_channel_name=""
          }
        }else{
          item.inland_code.forEach((ivew,inx)=>{
            if(ivew.length <=0){
              this.packageList[index].typeinland_code[inx]='error'
              this.packageList[index].helpinland_code[inx]='国内单号不能为空'
              num++
            }else{
              this.packageList[index].typeinland_code[inx]='success'
              this.packageList[index].helpinland_code[inx]=''
            }
          })
          item.inland_name.forEach((ivew,inx)=>{
            if(ivew.length <=0){
            this.packageList[index].typeinland_name[inx]='error'
            this.packageList[index].helpinland_name[inx]='国内物流不能为空'
              num++
            }else{
              this.packageList[index].typeinland_name[inx]='success'
              this.packageList[index].helpinland_name[inx]=''
            }
          })
          if(num === 0){
            this.packageList[index].typeWeight="success",
            this.packageList[index].helpWeight=""
            this.packageList[index].typelogistics_channel_name="success",
            this.packageList[index].helplogistics_channel_name=""
            this.packageList[index].typebattery_status="success",
            this.packageList[index].helpbattery_status=""
          }
        }
      })
      this.packageList.reverse().reverse()
      if(num === 0){
        return true
      }else{
        this.$notification.error({
          message: '错误',
          description: '信息未填写完整',
        });
        return false
      }
    },
    //判断国内单号是否重复
    Numcheck(){
      this.inland_codeAll = []
      this.packageList.forEach((item,index)=>{
        if(item.inland_code.length>1){
          //多个国内单号
          item.inland_code.forEach((im,ix)=>{
            this.inland_codeAll.push(im)
          })
        }else{
          // 单个国内单号
          this.inland_codeAll.push(item.inland_code[0])
        }
      })
      let setLen = [...new Set(this.inland_codeAll)].length
      if(this.inland_codeAll.length === setLen){
        return true
      }else{
        this.$notification.error({
          message: '错误',
          description: '获取失败，国内单号重复',
        });
      }
        return false
    },
    cancel(){
      this.$emit('cancelDomestic')
    },
    returns(){
      this.$emit('returnDomestic') 
    },
    addDomestic(){
      const packageInfo = {
        typeinland_name:[],
        helpinland_name:[],
        typeinland_code:[],
        helpinland_code:[],
        inland_name:[''],
        inland_code:[''],
        weight:"",
        battery_status:'',
        logistics_channel_name:"",
        logistics_channel_code:"",
        freight:"",
        limit:"",
        remark:"",
        id:"",
        company:""
      }
      this.packageList.push(packageInfo);
      this.logisticSelectShow.push(0);
    },
    delDomestic(inx){
        this.packageList.splice(inx,1)
    },
    // select选择chenge
    onCheckChange(value){
      this.checkValue = value
    },
    // 合并包裹
    mergePackage(){
      if(this.checkValue.length <= 0){
        this.$notification.error({
          message: '错误',
          description: '请先勾选合并的包裹',
        });
      }else if(this.checkValue.length <= 1){
        this.$notification.error({
          message: '错误',
          description: '至少两个包裹才能合并',
        });
      }else{
        // 如果勾选的包裹存才国际单号不允许合并包裹
        if(this.ifChannelCode(1)){
            this.compose()
          // }
        }else{
          this.$notification.error({
            message: '错误',
            description: '存在国际单号的包裹不允许合并',
          });
        }
      }
    },
    // 判断包裹是否有国际单号
    ifChannelCode(type,inx){
      let num = 0
      let testList = ''
      testList= deepClone(this.packageList)
      if(type === 1){
        this.checkValue.forEach((item,index)=>{
          if(this.packageList[item].logistics_channel_code.length>0){
            num++
          }
        })
      }else if(type === 2){
        if(this.packageList[inx].logistics_channel_code.length>0){
          num++
        }
      }
      if(num === 0){
        return true
      }else{
        return false
      }
    },
    // 合并包裹函数
    compose(){
      this.agentPackageList = deepClone(this.packageList)
      let num = 0
      this.checkValue.forEach((item,index)=>{
        // 合并国内物流
        if(this.agentPackageList[item].inland_name.length>1){
          this.agentPackageList[item].inland_name.forEach((i,x)=>{
          this.initPackageList.inland_name.push(i)
          })
        }else{
          this.initPackageList.inland_name.push(this.agentPackageList[item].inland_name[0])
        }
        // 合并国内单号
        if(this.agentPackageList[item].inland_code.length>1){
          this.agentPackageList[item].inland_code.forEach((i,x)=>{
            this.initPackageList.inland_code.push(i)
          })
        }else{
          this.initPackageList.inland_code.push(this.agentPackageList[item].inland_code[0])
        }
        // 合并重量
        if(this.initPackageList.weight){
          this.initPackageList.weight = parseFloat(this.initPackageList.weight) + (this.agentPackageList[item].weight?parseFloat(this.agentPackageList[item].weight):0)
        }else{
          this.initPackageList.weight = (0 + (this.agentPackageList[item].weight?parseFloat(this.agentPackageList[item].weight):0))
        }
        //是否含电
        if(this.agentPackageList[item].battery_status == 1){
          num ++
        }
      })
      num === 0?this.initPackageList.battery_status=0:this.initPackageList.battery_status=1
      this.checkValue.sort(function (a, b) {
        return a - b;
      })
      this.checkValue.reverse()
      this.checkValue.forEach((item,index)=>{
        if(index === this.checkValue.length-1){
          this.checkInsert = item
        }
        this.packageList.splice(item,1)
      })
      this.packageList.splice(this.checkInsert,0,this.initPackageList)
      this.initPackageList = {
        inland_name:[],
        inland_code:[],
        weight:"",
        battery_status:0,
        logistics_channel_name:"",
        logistics_channel_code:"",
        freight:"",
        limit:"",
        ArrivalTime:"",
        address:[],
        remark:"",
        typeinland_name:[''],       
        helpinland_name:[''], 
        typeinland_code:[],
        helpinland_code:[],
      }
      // 选择框置空
      Object.assign(this, {
        checkedList:[],
      });
      this.$notification.success({
        message: '成功',
        description: '合并包裹成功'
      })
    },
    //拆分包裹
    splitBox(index){
      let Intinfo = {
        inland_name:[],
        inland_code:[],
        weight:"",
        battery_status:0,
        logistics_channel_name:"",
        logistics_channel_code:"",
        freight:"",
        limit:"",
        ArrivalTime:"",
        address:[],
        remark:"",
        typeinland_name:[],       
        helpinland_name:[], 
        typeinland_code:[],
        helpinland_code:[],
      }
      //如果存在订单号不允许拆分包裹
      if(this.ifChannelCode(2,index)){
        if(this.packageList[index].inland_code.length >=2){
          //允许拆分
          this.packageList[index].inland_code.forEach((item,inx)=>{
            var info = []
            info = deepClone(Intinfo)
            info.inland_name[0]=this.packageList[index].inland_name[inx]
            info.inland_code[0]=this.packageList[index].inland_code[inx]
            this.packageList.splice(index+(inx+1),0,info)
          })
        this.packageList.splice(index,1)
        this.$notification.success({
          message: '成功',
          description: '拆分包裹成功'
        })
        }else{
          this.$notification.error({
            message: '错误',
            description: '不允许拆分包裹',
          });
        }
      }else{
        this.$notification.error({
          message: '错误',
          description: '包裹存在国际单号不允许拆分',
        });
      }
    },
    // 获取运单号
    getNumbers(){
      this.getNumVisible = true;
    },
    //获取订单号弹窗确认
    getNumhandleOk(){
      this.getNumVisible = false
      this.getNumbersLoading = true
      // //只允许获取一个包裹的单号
      //先判断 选择国内物流 国内单号 重量 选择国际物流
      if(this.getNumCheck()===true){
        //再判断 国内单号是否重复
        if(this.Numcheck() === true){
          this.fakeInfoReplace()
          getNums({
            package:this.submitList,
            id:this.orderID
          }).then((res)=>{
            if(res.code === 0){
            //请求获取运单号并填充
            this.fill(res.data.package)
            this.getNumbersLoading = false
            //获取运单号成功后 不允许返回
            this.reutrnBtn = true
            // 设置变量记录获取几次单号
            // this.getNumFrequency++
            // 记录本次国际单号
            // this.recordNumber(res.data.package,this.getNumFrequency-1)
            }else{
              this.getNumbersLoading = false
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }else{
          this.getNumbersLoading = false
        }
      }else{
        this.getNumbersLoading = false
      }
    },
    // 获取订单号弹窗取消
    getNumhandleCancel(){
      this.getNumVisible = false
    },
    // 伪数据 赋值给 真数据
    fakeInfoReplace(){
      this.submitList = []
      this.packageList.forEach((item,index)=>{
        let info = {
          id:"0",
          inland_name:"",
          inland_code:"",
          weight:"",
          logistics_channel_name:"",
          battery_status:"",
          remark:""
        }
        info.inland_name = item.inland_name
        info.inland_code = item.inland_code
        //新增的id为''  // item.id.length>0?item.id:'0'
        info.id = item.id
        info.weight = item.weight
        info.logistics_channel_name = item.logistics_channel_name
        info.battery_status = item.battery_status
        info.remark = item.remark
        this.submitList[index]=info;
      })
    },
    // 真实数据 复制给 伪数据
    realInfoReplace(info,type){
      // let copyInfo = deepClone(info)
      // console.log(copyInfo == info)
      if(type === 3){
        info.forEach((item,index)=>{
          let info = {
            id:"",
            inland_name:[],
            inland_code:[],
            logistics_channel_name:"",
            logistics_channel_code:"",
            battery_status:"",
            address:[],
            ArrivalTime:"",
            remark:"",
            weight:"",
            freight:"",
            limit:"",
            typeinland_name:[],       
            helpinland_name:[], 
            typeinland_code:[],
            helpinland_code:[],
            company:""
          }
          info.company = item.company
          info.inland_name = item.inland_name
          info.inland_code = item.inland_code
          info.weight = item.weight
          info.battery_status = parseInt(item.battery_status)
          info.logistics_channel_code = item.logistics_channel_code
          info.logistics_channel_name = item.logistics_channel_name
          info.remark = item.remark
          info.freight = item.freight
          info.ArrivalTime = item.ArrivalTime
          info.address = item.address
          info.limit = item.limit
          info.id = item.id
          this.$set(this.packageList, index, this.deepCopy(info))
          this.fillCompany(item.company,item.logistics_channel_name,index)
        })
        console.log('真数据》伪数据',this.packageList,this.packageList[0].inland_code[0])
      }else if(type === 2){
        info.forEach((item,index)=>{
          let info = {
            id:"",
            inland_name:[],
            inland_code:[],
            logistics_channel_name:"",
            logistics_channel_code:"",
            battery_status:"",
            address:[],
            ArrivalTime:"",
            remark:"",
            weight:"",
            freight:"",
            limit:"",
            typeinland_name:[],       
            helpinland_name:[], 
            typeinland_code:[],
            helpinland_code:[],
            company:""
          }
          info.company = item.company
          info.inland_name = item.inland_name
          info.inland_code = item.inland_code
          info.weight = item.weight
          info.battery_status = parseInt(item.battery_status)
          info.logistics_channel_code = item.logistics_channel_code
          info.logistics_channel_name = item.logistics_channel_name
          info.remark = item.remark
          info.freight = item.freight
          info.ArrivalTime = item.ArrivalTime
          info.address = item.address
          info.limit = item.limit
          info.id = item.id
          this.packageList[index]=info;
          this.fillCompany(item.company,item.logistics_channel_name,index)
        })
      }
      this.packageList.reverse().reverse()
    },
    //填充选择物流信息
    fillCompany(company,name,index){
      if(company=="fpx"){
        this.logisticSelectShow[index] = 1
      }else if(company=="yw"){
        this.logisticSelectShow[index] = 2
      }else if(company=="sf"){
        this.logisticSelectShow[index] = 3
      }
      this.getChannelFn(this.is_type,company,index)
      this.packageList[index].logistics_channel_name = name
    },
    //填充信息
    fill(info){
      this.packageList.forEach((item,index)=>{
        item.logistics_channel_code = info[index].logistics_channel_code
        item.id = info[index].id
      })
    },
    deepCopy(obj){
      let str, newobj = obj.constructor === Array ? [] : {};
      if(typeof obj !== 'object'){
        return;
      } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
      } else {
        for(var i in obj){
          newobj[i] = typeof obj[i] === 'object' ? 
          cloneObj(obj[i]) : obj[i]; 
        }
      }
      return newobj;
    },
    //记录单号
    recordNumber(info,num){
      // this.getNumbersAll[getNumFrequency]
      this.getNumbersAll[num] = []
      info.forEach((item,index)=>{
        this.getNumbersAll[num].push(item.logistics_channel_code);
      })
      if(num>=1){
        this.remarkState = true
        let record = []
        this.packageList.forEach((item,index)=>{
          record[index]=[]
          this.getNumbersAll.forEach((im,ix)=>{
            record[index].push(im[index])
          })
          item.remark = `更改记录：${record[index].slice(0,record[index].length-1)} , 已被更改，新的单号为：${record[index].slice(-1)}`
        })
      }
    },
    channelNameChange(value,inx){
      // 获取国际物流信息
      this.getwarehouseAddress(value,inx)
    },
    //  获取物流地址
    getwarehouseAddress(value,inx) {
      warehouseAddress({
        weight:this.packageList[inx].weight,
        channel_code: value,
        id: this.orderID
      }).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) === '{}') {
            this.packageList[inx].freight = ''
            this.packageList[inx].address = []
          } else {
            this.packageList[inx].address = res.data.address
            this.packageList[inx].freight = res.data.freight
            this.packageList[inx].ArrivalTime = res.data.ArrivalTime
            this.packageList[inx].freight = res.data.freight
            this.packageList[inx].limit = res.data.limit
          }
        } else {
          this.packageList[inx].freight = ''
          this.packageList[inx].address = []
          this.packageList[inx].ArrivalTime = ''
          this.packageList[inx].freight = ''
          this.packageList[inx].limit = ''
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
        if(this.packageList[inx].weight<50){
          this.$notification.warning({
            message: '提示',
            description: '重量小于50g时，将按最小物流标准50g计算'
          })
        }
        this.packageList.reverse().reverse()
      })
    },
    //数据初始化
    initData(){
      // 0 初始化  2已经保存了信息 3获取运单号未保存
      if(this.openDomesticState === "0"){
        this.packageList = [
          {
            inland_name:[''],
            inland_code:[''],
            id:"",
            weight:this.orderWeight,
            battery_status:this.battery_status?this.battery_status:0,
            logistics_channel_name:"",
            logistics_channel_code:"",
            freight:"",
            limit:"",
            ArrivalTime:"",
            address:[],
            remark:'',
            typeinland_name:['',''],       
            helpinland_name:['',''], 
            typeinland_code:[],
            helpinland_code:[],
            company:''
          },
        ]
      }else if(this.openDomesticState === '2'){
        // 需要请求数据 禁用保存 和返回  (只读状态) 只能取消
        this.disabledAll = {
          cancel:false,
          returns:true,
          getNumbers:true,
          submit:true,
        }
        getOrderLogistics({
          ids:this.orderID
        }).then((res)=>{
          let dataList = 
          this.realInfoReplace(res.data,2)
        })

      }else if(this.openDomesticState === '3'){
        // 需要请求数据 只允许 保存 获取运单号  取消
        this.disabledAll = {
          cancel:false,
          returns:true,
          getNumbers:false,
          submit:false,
        }
        getOrderLogistics({
          ids:this.orderID
        }).then((res)=>{
          if(res.code === 0){
            this.realInfoReplace(res.data,3)
          }else{

          }
        })
      }
    },
    //获取国际物流列表
    async getChannelFn(type,company,index){
      console.log('调用了')
      const { code, data, msg } = await getChannel({
        country_code: this.country_code_param,
        type: type,     //1支持,
        company:company
      })
      if (code === 0) {
        this.treeData[index] = data
        this.treeData.reverse().reverse()
      } else {
        this.$notification.error({ message: '提醒', description: msg })
      }
    },
    //选择物流公司
    selectLogistics(index,type){
      if(this.logisticSelectShow[index] == type){
        this.logisticSelectShow[index] = 0
        this.packageList[index].company = ''
        this.packageList[index].typelogistics_channel_name="",
        this.packageList[index].helplogistics_channel_name=""
      }else{
        if(type==1){
          this.logisticSelectShow[index] = 1
          this.packageList[index].company = 'fpx'
        }else if(type==2){
          this.logisticSelectShow[index] = 2
          this.packageList[index].company = 'yw'
        }else if(type==3){
          this.logisticSelectShow[index] = 3
          this.packageList[index].company = 'sf'
        }
        this.getChannelFn(this.is_type,this.packageList[index].company,index)
      }
      this.packageList[index].typelogistics_channel_name=''
      this.packageList[index].logistics_channel_name = ''
      this.packageList[index].freight = ''
      this.packageList[index].limit = ''
      this.packageList[index].ArrivalTime = ''
      this.packageList[index].address = ''
      this.logisticSelectIndex = index;
      this.$set(this.logisticSelectShow, index, this.logisticSelectShow[index]);
    },
    //获取物流权限
    getLogisticsCompanys(){
      getLogisticsCompany().then(res=>{
        if (res.code === 0) {
          if (res.data.data) {
            res.data.data.forEach((item,index)=>{
              if(item.code=='fpx'){
                this.logisticStatus1 = true
              }else if(item.code=='yw'){
                this.logisticStatus2 = true
              }else if(item.code=='sf'){
                this.logisticStatus3 = true
              }
            })
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
  },
  created (){
    this.initData()
    console.log(this.openDomesticState,'openDomesticState')
    this.getChannelFn(this.is_type)
    this.getLogisticsCompanys()
  },
  mounted (){
  },
  destroyed (){},
}
</script>
<style lang="less" scoped>
  .domestic{

    .footers{
      text-align: right;
    }
  }
  .check{
    height: 39px;
    line-height: 39px;
  }
  .mt{margin-top: 10px;}
  .position-r{
    position: relative;
  }
  .position-a{
    position: absolute;
    right: 10px;
    top: 0px;
  }
  .logistics_icon{
    width:140px;
    overflow:hidden;
    height:49px;
    position:relative
  }
  .logistics_icon:hover .logistics_noselect{
    display: none;
  }
  .logistics_select{
    position:absolute;
    width:140px;
    height:49px;
    top:0;
    left:0;
  }
  .logistics_select1{
    width:0;
    height:0;
    border-width:0 0 25px 25px;
    border-style:solid;
    border-color:transparent transparent #1890ff;
    position:absolute;
    right:0;
    bottom:0
  }
  .logistics_select2{
    color:#fff;
    position:absolute;
    right:2px;
    bottom:1px
  }
  .logistics_noselect{
    position:absolute;
    width:140px;
    height:49px;
    background-color:#666;
    opacity:0.5;
    top:0;
    left:0;
  }
</style>