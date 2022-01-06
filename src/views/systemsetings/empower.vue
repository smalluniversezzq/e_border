<template>
  <div class="empower">
    <a-card
      class='mt'
      :bordered='false'>
      <p>
        平台:
        <a-button class="platform_icon" style="margin-left:10px;" @click="selectPlatform(1)">
          <img
            style="width:90px; margin-left:-5px;margin-top:-5px"
            :src="platformIcon1"
            alt=""/>
          <p v-show="platformSelect==1" class="platform_select">
            <i class="platform_select1"></i>
            <a-icon class="platform_select2" type="check"/>
          </p>
        </a-button>
        <a-button class="platform_icon" style="margin-left:20px;" @click="selectPlatform(2)">
          <img
            style="width:90px; margin-left:-5px;margin-top:-5px"
            :src="platformIcon2"
            alt=""/>
          <p v-show="platformSelect==2" class="platform_select">
            <i class="platform_select1"></i>
            <a-icon class="platform_select2" type="check"/>
          </p>
        </a-button>
      </p>
      <a-button
        v-if='hasPerm(permsBtn.account_add)'
        type='primary'
        @click='toEmpower'>
        添加授权
      </a-button>
      <!-- //列表 -->
      <a-row class='mt'>
        <a-col :span="24">
          <!-- lll -->
          <a-table
            :dataSource="data"
            :pagination="false"
            :loading="listLoading" 
            rowKey="id">
            <!-- <a-table-column
              v-if="platformSelect==1"
              title="端口"
              dataIndex="port">
            </a-table-column> -->
            <a-table-column
              title="店铺名称"
              dataIndex="title">
            </a-table-column>
            <a-table-column
              title="店铺ID"
              dataIndex="mws_seller_id">
            </a-table-column>
            <a-table-column :title="columnTitle">
              <template slot-scope="text, record">
                <div
                  v-for="(item,index) in record.mws_site"
                  :key="index">
                  {{codeORcountry[item]}}
                </div>
              </template>
            </a-table-column>
            <a-table-column
              title="授权时间"
              dataIndex="created_at">
            </a-table-column>
            <a-table-column title="操作">
              <template slot-scope="text, record">
                <span>
                  <a-button
                    :disabled='!hasPerm(permsBtn.account_edit)'
                    type="primary"
                    style="margin-left:10px;"
                    @click='updata(record.id,record.port_id,record.mws_site,record)'>
                    编辑
                  </a-button>

                  <a-button
                    :disabled='!hasPerm(permsBtn.account_del) || $store.state.user.type === "2"'
                    class='ml'
                    :type="record.status === '0' ? 'primary' : 'default'"
                    @click='addtable(record.id,record.status,record.port_id)'>
                    {{record.status === '0' ? "启用" : "禁用" }}
                  </a-button>
                  <a-button
                    :disabled='!hasPerm(permsBtn.account_prohibit) || $store.state.user.type === "2"'
                    type="danger"
                    style="margin-left:10px;"
                    @click='delempower(record.id)'>
                    删除
                  </a-button>
                  <a-button class='ml' v-if='record.type=="0"' @click='toStoreInfo(0,record.id)'>
                    填写店铺额外信息
                  </a-button>
                  <a-button class='ml' v-if='record.type=="1"' @click='toStoreInfo(1,record.id)'>
                    查看店铺额外信息
                  </a-button>
                </span>
              </template>
            </a-table-column>
          </a-table>
        </a-col>
      </a-row>
      <a-modal
        title="删除"
        :visible="visible"
        @ok="handleOk"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel">
        <p>{{ModalText}}</p>
      </a-modal>
      <!-- 虾皮授权 -->
      <a-modal
        title="新增Shopee"
        :visible="shopeeVisible"
        okText="授权"
        @ok="shopeeOk"
        :confirmLoading="shopeeAddLoading"
        @cancel="shopeeCancel">
        <p>
          店铺名称：
          <a-input
            placeholder='请输入店铺名称'
            v-model="shopeeName"
            :style="{ display: 'inline-block', width: 'calc(60% )'}"/>
        </p>
      </a-modal>
      <!-- 虾皮编辑 -->
      <a-modal
        title="编辑Shopee"
        :visible="shopeeEditeVisible"
        @ok="shopeeEditeOk"
        :confirmLoading="shopeeEditLoading"
        @cancel="shopeeEditeCancel">
        <p>
          店铺名称：
          <a-input
            placeholder='请输入店铺名称'
            v-model="shopeeEditeName"
            :style="{ display: 'inline-block', width: 'calc(60% )'}"/>
        </p>
      </a-modal>
      <!-- 授权弹窗 -->
      <a-modal
        v-if='emShow'
        :maskClosable=false
        title="授权"
        :visible="emShow"
        @ok="emOk"
        :confirmLoading="emLoading"
        @cancel="emCancel"
        class='showfoot'
        width="700px">
        <div>
          <a-card
            class="ant-pro-components-tag-select"
            :bordered='false'>
          <a-row >
              <a-col
                offset='3'
                :md='18'>
              </a-col>
            </a-row>
            <a-form
              :form="form"
              @submit="handleSubmit">
              <a-row >
                <a-col
                  :md='24'
                  class='rt'>
                  <a-form-item
                    label="店铺名称"
                    :label-col="{ span: 6 }"
                    :wrapper-col="{ span:18 }">
                    <a-input
                      placeholder='请输入店铺名称'
                      v-decorator="['shopname', {rules: [{ required: true, message: '店铺名称不能为空' }]}]"
                      :style="{ display: 'inline-block', width: 'calc(85% )'}"/>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row >
                <a-col :md='24'>
                  <a-form-item
                    label="MwsSellerID"
                    :label-col="{ span: 6 }"
                    :wrapper-col="{ span:18 }">
                    <a-input
                      :disabled='subType=="2"'
                      placeholder='卖家编号'
                      v-decorator="['MwsSellerID',{rules: [{ required: true, message: '卖家编号不能为空' }]}]"
                      :style="{ display: 'inline-block', width: 'calc(85% )'}"/>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row >
                <a-col :md='24'>
                  <a-form-item
                    label="MWSAuthToken"
                    :label-col="{ span: 6 }"
                    :wrapper-col="{ span:18 }">
                    <a-input
                      placeholder='mws授权令牌'
                      v-decorator="['MWSAuthToken',{rules: [{ required: false, message: '' }]}]"
                      :style="{ display: 'inline-block', width: 'calc(85% )'}"/>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row >
                <a-col :md='24'>
                  <a-form-item
                    label="AuthCode"
                    :label-col="{ span: 6 }"
                    :wrapper-col="{ span:18 }">
                    <a-input
                      v-model='AuthCode'
                      placeholder='授权码'
                      v-decorator="['AuthCode',{rules: [{ required: false, message: '' }]}]"
                      :style="{ display: 'inline-block', width: 'calc(85% )'}"/>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row>
                <a-col :md='24'>
                  <a-form-item
                    label="授权国家"
                    :label-col="{ span: 6 }"
                    :wrapper-col="{ span:18 }">
                    <div class="mb">
                      <a-select
                        :disabled='subType=="2"'
                        v-model='siteValues'
                        style="width: 220px"
                        @change="handleProvinceChange"
                        placeholder='请选择站点'>
                        <a-select-option v-for="(item,index) in provinceData" :value='item.code' :key="index">
                          {{item.title}}
                        </a-select-option>
                      </a-select>
                    </div>
                    <a-row>
                      <a-col :span="5" v-for="(item,index) in authCountrySite" :key="index">
                        <a-button 
                        :type='(authCountryCode.indexOf(item.country) >= 0) ? "primary":"dashed"' 
                        :disabled='item.residue_degree == "0" && subType=="1"' 
                        @click="addAuthCode(item.country)">
                          {{codeORcountrys[item.country]}}
                        </a-button>
                        <div>(剩余{{item.residue_degree}})</div>
                      </a-col>
                    </a-row>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item
                :label-col="{ span: 8 }"
                :wrapper-col="{offset:8, span:16 }">
                <a-button
                  class='mr'
                  @click='emCancel'>
                  取消
                </a-button>
                <a-button
                  type="primary"
                  html-type="submit"
                  :loading='subloading'>
                  确认授权
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </div>
      </a-modal>
      <a-row
        v-if='data'
        class='mt'
        type="flex"
        justify="end">
        <a-col>
          <a-pagination
            v-model="current"
            @change='pagechange'
            :pageSize='page.pageSize'
            :total='(page.pageSize*page.lastPage)'/>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
  const defaultCheckedListOZ = []
  const defaultCheckedListBM = []
  const plainOptionresAS = []
  const defaultCheckedListAS = []
  const plainOptionresRB = []
  const defaultCheckedListRB = []
  const provinceData = [
    {
    title:"欧洲站",
    code:"EU",
    },
    {
    title:"北美站",
    code:"NA",
    },
    {
    title:"远东站",
    code:"FE",
    }
  ];
  const cityData = {
    'EU': [
      { label: '德国', value: 'DE' },
      { label: '法国', value: 'FR' },
      { label: '英国', value: 'GB' },
      { label: '意大利', value: 'IT' },
      { label: '西班牙', value: 'ES' },
      { label: '荷兰', value: 'NL' },
      { label: '瑞典', value: 'SE' },
      { label: '波兰', value: 'PL' },
    ],
    'NA': [
      { label: '美国', value: 'US' },
      { label: '加拿大', value: 'CA' },
      { label: '墨西哥', value: 'MX' }
    ],
    'AU': [
      { label: '澳大利亚', value: 'AU' }
    ],
    'JP': [
      { label: '日本', value: 'JP' }
    ],
    'FE': [
      { label: '澳大利亚', value: 'AU' },
      { label: '日本', value: 'JP' }
    ],
  }
import Vue from 'vue'
import { 
  getEmpowerList, 
  addEmpowerInfo, 
  delEmpowerInfo, 
  updataEmpowerInfo, 
  countryList,
  getPortList, 
  getAuthUrl, 
  getCheckAuth, 
  getShopList, 
  updateShopeeShop, 
  deleteShopeeShop, 
  addShopeeShop,
  getAuthCountryList} from '@/api/empower'
import { codeORcountry , codeORcountrys, currencyList} from '@/views/order/public/country'
import { permsBtn } from '@/utils/static'
import { setTimeout } from 'timers'
export default {
  name: 'empower',
  components: {},
  computed: {},
  data() {
    return {
      codeORcountry,
      codeORcountrys,
      provinceData,
      cityData,
      cities:"",
      secondCity:'',
      siteValues:provinceData[0].code,
      cities: cityData[provinceData[0].code],
      secondCity: cityData[provinceData[0].code][0].value,
      permsBtn,
      listLoading: false,
      //欧洲
      checkedListOZ: defaultCheckedListOZ,
      indeterminateOZ: false,
      checkAllOZ: false,
      plainOptionsOZ:[
      ],
      plainOptionresOZ:[],
      checkedOZ: '', //勾选的 欧洲国家
      checkAll_OZ: [],
      // 北美
      checkedBM: '',
      checkedListBM: defaultCheckedListBM,
      indeterminateBM: false,
      checkAllBM: false,
      plainOptionsBM:[
      ],
      plainOptionresBM:[],
      checkAll_BM: [],
      // 澳洲
      checkedAS: '',
      checkedListAS: defaultCheckedListAS,
      indeterminateAS: false,
      checkAllAS: false,
      plainOptionsAS:[],
      plainOptionresAS,
      checkAll_AS: [],
      // 日本
      checkedRB: '',
      checkedListRB: defaultCheckedListRB,
      indeterminateRB: false,
      checkAllRB: false,
      plainOptionsRB:[],
      plainOptionresRB,
      checkAll_RB: [],

      // sites,
      data: [],
      page: {firstPage: 1, currentPage: 1, lastPage: 1, pageSize: 10},
      current: 1,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      platform: 'amazon',
      visible: false,
      confirmLoading: false,
      emShow: false,
      emLoading: false,
      selectAll: '',
      selectkey: '',
      delAll: '',
      delid: '',
      ModalText: '删除店铺后数据将彻底删除，且不可恢复（包含：订单数据与发布商品数据）',
      adds: '',
      site: '',
      siteValue: '',
      checked: true,
      updataId: '',
      subType: '1', // 1授权  2编辑
      checkAll: '',
      portList:'',
      port_id:"",
      countryData:"",
      subloading:false,
      empower_per:"",
      platformIcon1:require("@/assets/image/platformIcon1.png"),
      platformIcon2:require("@/assets/image/platformIcon2.png"),
      platformSelect:1,
      shopeeVisible:false,
      shopeeEditeVisible:false,
      shopeeName:'',
      shopeeEditeName:'',
      platform:'amazon',
      columnTitle:"授权国家",
      platformStatus1:'',
      platformStatus2:'',
      shopeeId:'',
      shopeeAddLoading:false,
      shopeeEditLoading:false,
      pageStatus:1,
      authCountry:[],
      authCountrySite:[],
      authCountryCode:[]
    }
  },
  created() {
    this.shopeeId = this.$route.query.shop_id;
    if (this.shopeeId == undefined || !this.shopeeId) {
      let shopeeAuthArr = window.location.href.match(/shop_id=(\S*)\/#\//)
      console.log('shopee', shopeeAuthArr)
      if (!shopeeAuthArr) {
        shopeeAuthArr = window.location.href.match(/shop_id=(\S*)#\//)
        console.log('shopee', shopeeAuthArr)
        if (shopeeAuthArr) {
          this.shopeeId = shopeeAuthArr[1]
        }
      } else {
        this.shopeeId = shopeeAuthArr[1]
      }
    }
    this.pageStatus = this.$route.query.status?this.$route.query.status:1;
    if(this.shopeeId){
      this.platformSelect = 2
      this.platform = 'shopee'
    }else{
      if(this.pageStatus==1){
        this.platformSelect = 1
        this.platform = 'amazon'
      }else if(this.pageStatus==2){
        this.platformSelect = 2
        this.platform = 'shopee'
      }
    }
    // this.getCheckAuths()
  },
  mounted() {
    this.getcountryList()
    // this.getAuthCountrys()
    // this.getPortListFn()
  },
  updated() {},
  destroyed() {},
  methods: {
    //保存
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.authCountryCode.length > 0?this.submits(values, this.authCountryCode): this.$notification.error({ message: '错误', description: '请选择国家' })
        }
      })
    },

    onChangeOZ(checkedListOZ) {
      this.checkedOZ = checkedListOZ
      this.indeterminateOZ = !!checkedListOZ.length && checkedListOZ.length < this.plainOptionsOZ.length
      this.checkAllOZ = checkedListOZ.length === this.plainOptionsOZ.length
    },
    onCheckAllChangeOZ(e) {
      Object.assign(this, {
        checkedListOZ: e.target.checked ? this.plainOptionresOZ : [],
        indeterminateOZ: false,
        checkAllOZ: e.target.checked
      })
      this.checkedOZ = e.target.checked ? this.plainOptionresOZ : []
    },
    onChangeBM(checkedListBM) {
      this.checkedBM = checkedListBM
      this.indeterminateBM = !!checkedListBM.length && checkedListBM.length < this.plainOptionsBM.length
      this.checkAllBM = checkedListBM.length === this.plainOptionsBM.length
    },
    onCheckAllChangeBM(e) {
      Object.assign(this, {
        checkedListBM: e.target.checked ? this.plainOptionresBM : [],
        indeterminateBM: false,
        checkAllBM: e.target.checked
      })
      this.checkedBM = e.target.checked ? this.plainOptionresBM : []
    },
    onChangeAS(checkedListAS) {
      this.checkedAS = checkedListAS
      this.indeterminateAS = !!checkedListAS.length && checkedListAS.length < this.plainOptionsAS.length
      this.checkAllAS = checkedListAS.length === this.plainOptionsAS.length
    },
    onCheckAllChangeAS(e) {
      Object.assign(this, {
        checkedListAS: e.target.checked ? this.plainOptionresAS : [],
        indeterminateAS: false,
        checkAllAS: e.target.checked
      })
      this.checkedAS = e.target.checked ? this.plainOptionresAS : []
    },
    onChangeRB(checkedListRB) {
      this.checkedRB = checkedListRB
      this.indeterminateRB = !!checkedListRB.length && checkedListRB.length < this.plainOptionsRB.length
      this.checkAllRB = checkedListRB.length === this.plainOptionsRB.length
    },
    onCheckAllChangeRB(e) {
      Object.assign(this, {
        checkedListRB: e.target.checked ? this.plainOptionresRB : [],
        indeterminateRB: false,
        checkAllRB: e.target.checked
      })
      this.checkedRB = e.target.checked ? this.plainOptionresRB : []
    },
    addtable(id, status,port_id) {
      if (status === '0') {
        this.adds = '1'
      } else if (status === '1') {
        this.adds = '0'
        console.log(this.adds, status)
      }
      console.log('platform', this.platform)
      if (this.platform == 'amazon') {
        updataEmpowerInfo({
          id: id,
          status: this.adds,
          port_id:port_id

        }).then(res => {
          if (res.code === 0) {
            this.data.forEach((item, index) => {
              item.id === id ? (this.data[index].status = res.data.status) : ''
            })
          } else {
          }
        })
      } else {
        updateShopeeShop({
          id: id,
          status: this.adds,
        }).then(res => {
          if (res.code === 0) {
            this.data.forEach((item, index) => {
              item.id === id ? (this.data[index].status = res.data.status) : ''
            })
          }
        })
      }
    },
    // 获取国家列表
    getcountryList() {
      countryList({
        type:'1'
      }).then(res => {
        if (res.code === 0) {
          this.countryData = res.data
          this.empower_per = []
          if(this.countryData.FE){
            this.countryData.FE.forEach((item,index)=>{
              this.empower_per.push(item.code)
            })
          }
          this.site = {}
          let data = {}
          if(res.data.amazon.EU){
            this.plainOptionsOZ=[]
            this.plainOptionresOZ = []
            res.data.amazon.EU.forEach((item,index)=>{
            let plainOptionsOZObj = new Object()
              switch(item.code){
                case "DE":
                  data.DE=item.title
                  break;
                case "ES":
                  data.ES=item.title
                  break;
                case "FR":
                  data.FR=item.title
                  break;
                case "GB":
                  data.GB=item.title
                  break;
                case "IT":
                  data.IT=item.title
                  break;
                case "NL":
                  data.NL=item.title
                case "SE":
                  data.SE=item.title
                  break;
                case "PL":
                  data.PL=item.title
                  break;
              }
              // 欧洲国家赋值
              this.plainOptionresOZ.push(item.code)
              plainOptionsOZObj.label = item.title
              plainOptionsOZObj.value = item.code
              this.plainOptionsOZ.push(plainOptionsOZObj)
            })
          }
          if(res.data.amazon.NA){
            this.plainOptionsBM = []
            this.plainOptionresBM=[]
            res.data.amazon.NA.forEach((item)=>{
              let plainOptionsBMObj = new Object()
              switch(item.code){
                case "CA":
                  data.CA=item.title
                  break;
                case "MX":
                  data.MX=item.title
                  break;
                case "US":
                  data.US=item.title
                  break;
              }
              // 北美
              this.plainOptionresBM.push(item.code)
              plainOptionsBMObj.label = item.title
              plainOptionsBMObj.value = item.code
              this.plainOptionsBM.push(plainOptionsBMObj)
            })
          }
          if(res.data.amazon.FE){
            // 其他
            this.plainOptionresAS = [];
            this.plainOptionresRB = [];
            this.plainOptionsAS = [];
            this.plainOptionsRB = [];
            res.data.amazon.FE.forEach((item)=>{
              let plainOptionsASObj = new Object()
              let plainOptionsRBObj = new Object()
              if(item.code === 'JP'){
                plainOptionsRBObj.label = item.title
                plainOptionsRBObj.value = item.code
              }else if(item.code === 'AU'){
                plainOptionsASObj.label = item.title
                plainOptionsASObj.value = item.code
              }
              switch(item.code){
                case "AU":
                  data.AU=item.title
                  break;
                case "JP":
                  data.JP=item.title
                  break;
              }
              // 澳洲日本赋值
              if(JSON.stringify(plainOptionsASObj) !== '{}'){
                this.plainOptionsAS.push(plainOptionsASObj)
                this.plainOptionresAS.push(item.code)
              }
              if(JSON.stringify(plainOptionsRBObj) !== '{}'){
                this.plainOptionsRB.push(plainOptionsRBObj)
                this.plainOptionresRB.push(item.code)
              }
            })
          }
          if(res.data.shopee){
            res.data.shopee.forEach((item)=>{
              switch(item.code){
                case "SG":
                  data.SG='新加坡'
                  break;
                case "VN":
                  data.VN='越南'
                  break;
                case "TW":
                  data.TW='台湾'
                  break;
                case "PH":
                  data.PH='菲律宾'
                  break;
              }
            })
          }
          Object.assign(this.site, data)
          console.log(this.site,'site')
          this.getCheckAuths()
        }
      })
    },
    sitechange(value) {
      // console.log(value, '')
    },
    toStoreInfo(type,id){
      this.$router.push({
        path:"storeinfo",
        query:{
          type,
          id
        }
      })

    },
    //添加授权
    toEmpower() {
      var _this = this
      this.getAuthCountrys().then((res)=>{
        //清空残留数据样式
        if(_this.platformSelect==1){
          _this.emShow = true
          _this.subType = '1'
          _this.form.setFieldsValue({
            port_id:'',
            shopname: '',
            MwsSellerID: '',
            MWSAuthToken: '',
            AuthCode: ''
          })
          _this.secondCity = []
          _this.authCountryCode = []

        }else if(_this.platformSelect==2){
          if(_this.platformStatus2==0||_this.platformStatus2==3){
            _this.$notification.error({
              message: '提醒',
              description: '请联系客服开通平台权限',
            });
          }else{
            _this.shopeeVisible = true
          }
        }
      })
    },
    getPortListFn(){
      getPortList({}).then((res)=>{
        if(res.code === 0){
          this.portList = res.data
        }
      })
    },
    delempower(id) {
      this.visible = true
      this.delid = id
      this.delAll = false
    },
    //编辑
    updata(id,port_id,site,record) {
      var _this = this
      this.getAuthCountrys().then((res)=>{
        if(_this.platformSelect==1){
          _this.port_id = port_id
          _this.subType = '2'
          Object.keys(_this.cityData).forEach((item,value,index)=>{
            _this.cityData[item].forEach((im,ix)=>{
              if(site[0]){
                if(site[0] === im.value){
                  _this.siteValues = item
                  _this.secondCity = site
                }
              }
            })
          })
          _this.authCountryCode = JSON.parse(JSON.stringify(site))
          if(site[0]=='JP'||site[0]=='AU'){
            _this.authCountrySite = _this.authCountry['FE']
          }else{
            Object.keys(_this.cityData).forEach((item,value,index)=>{
              _this.cityData[item].forEach((im,ix)=>{
                if(site[0]){
                  if(site[0] === im.value){
                    _this.authCountrySite = _this.authCountry[item]
                    return
                  }
                }
              })
            })
          }
          _this.emShow = true
          setTimeout(()=>{
            _this.form.setFieldsValue({
              port_id:record.port_id,
              shopname:record.title,
              MwsSellerID:record.mws_seller_id,
              MWSAuthToken:record.mws_auth_token,
              AuthCode: record.auth_code
            })
          },100)
          _this.updataId = id
        }else if(_this.platformSelect==2){
          _this.shopeeEditeVisible = true
          _this.updataId = id
        }
      })  
    },
    handleOk(e) {
      this.prodels()
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
        this.ModalText = '确定要删除吗'
      }, 800)
    },
    handleCancel(e) {
      this.visible = false
    },
    async shopeeOk(e) {
      this.shopeeAddLoading = true
      Vue.ls.set('SHOPEE_NAME',this.shopeeName)
      const { code, data, msg } = await getAuthUrl()
      if (code === 0) {
        this.shopeeAddLoading = false
        Vue.ls.set('SHOPEE_ADD_STATUS',0)
        window.open(data.auth_url,'_self');
      } else {
        this.shopeeAddLoading = false
        this.$notification.error({ message: '提醒', description: msg })
      }
    },
    shopeeCancel(e) {
      this.shopeeVisible = false
    },
    async saveShopeeAdd(id){
      const { code, data, msg } = await addShopeeShop({
        shop_id:id,
        title:Vue.ls.get('SHOPEE_NAME')
      })
      if (code === 0) {
        this.shopeeId = ''
        Vue.ls.set('SHOPEE_ADD_STATUS',1)
        this.getShopeeShopList()
      }
      else {
        this.listLoading = false
        this.getShopeeShopList()
        this.$notification.error({ message: '提醒', description: msg })
      }
    },
    async shopeeEditeOk(){
      this.shopeeEditLoading = true
      const { code, data, msg } = await updateShopeeShop({
        id:this.updataId,
        title:this.shopeeEditeName
      })
      if (code === 0) {
        this.shopeeEditLoading = false
        this.getShopeeShopList()
        this.shopeeEditeVisible = false
        this.shopeeEditeName = ''
      } else {
        this.shopeeEditLoading = false
        this.$notification.error({ message: '提醒', description: msg })
        this.shopeeEditeVisible = false
        this.shopeeEditeName = ''
      }
    },
    shopeeEditeCancel(e) {
      this.shopeeEditeVisible = false
    },
    emOk() {
      //授权的操作
    },
    emCancel(e) {
      this.emShow = false
      this.checkAllBM = false
      this.siteValues = this.provinceData[0].code
      this.authCountrySite = this.authCountry[this.provinceData[0].code]
      this.authCountryCode = []
    },
    prodels() {
      if (this.delAll === false) {
        if (this.platform == 'amazon') {
          delEmpowerInfo({
            id: this.delid
          }).then(res => {
            if (res.code === 0) {
              this.$notification.success({
                message: '删除成功',
                description: res.msg
              })
              this.getlist()
            } else {
              this.getlist()
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        } else {
          deleteShopeeShop({
            id: this.delid
          }).then(res => {
            if (res.code === 0) {
              this.$notification.success({
                message: '删除成功',
                description: res.msg
              })
              this.getShopeeShopList()
            } else {
              this.getShopeeShopList()
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      } else {
        if (this.selectAll) {
          let str = ''
          for (var i = 0; i < this.selectAll.length; i++) {
            str += this.selectAll[i].id + ','
          }
          this.ids = str.slice(0, -1)
          if (this.platform == 'amazon') {
            delEmpowerInfo({
              id: this.ids
            }).then(res => {
              if (res.code === 0) {
                this.$notification.success({
                  message: '删除成功',
                  description: res.msg
                })
                this.getlist()
              } else {
                this.$notification.error({
                  message: '错误',
                  description: res.msg
                })
              }
            })
          }
        } else {
          deleteShopeeShop({
            id: this.delid
          }).then(res => {
            if (res.code === 0) {
              this.$notification.success({
                message: '删除成功',
                description: res.msg
              })
              this.getShopeeShopList()
            } else {
              this.getShopeeShopList()
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      }
    },
    // lll
    pagechange(page, pagesize) {
      this.current = page
      this.getlist()
    },
    //获取虾皮店铺列表
    getShopeeShopList() {
      this.listLoading = true
      this.data = []
      getShopList({
        page: this.current,
        platform: this.platform
      }).then(res => {
        if (res.code === 0) {
          this.listLoading = false
          if(JSON.stringify(res.data) !== '{}'){
            this.data = res.data
          }else{
            this.data = []
          }
          this.page = res.pages
        } else {
          this.listLoading = false
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    getlist() {
      this.listLoading = true
      getEmpowerList({
        page: this.current,
        platform: this.platform
      }).then(res => {
          if (res.code === 0) {
            this.listLoading = false
            if(JSON.stringify(res.data) !== '{}'){
              this.data = res.data
            }else{
              this.data = []
            }
            this.page = res.pages
          } else {
            this.listLoading = false
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
        .catch(err => {
          this.listLoading = false
        })
    },
    submits(val, country) {
      this.subloading = true
      if (this.subType === '1') {
        let siteVal = country.join(',')
        console.log(siteVal,'siteVal')
        addEmpowerInfo({
          port_id:val.port_id,
          MwsSellerID: val.MwsSellerID,
          MwsAuthToken: val.MWSAuthToken,
          AuthCode: val.AuthCode,
          MwsSite: siteVal,
          title: val.shopname
        }).then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.getlist()
            this.form.resetFields()
            this.emShow = false
            this.subloading =false
          } else {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            this.subloading =false
          }
        })
      } else if (this.subType === '2') {
        let siteVal = country.join(',')
        updataEmpowerInfo({
          id: this.updataId,
          MwsSite: siteVal,
          port_id: this.port_id,
          title: val.shopname
        }).then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.getlist()
            this.form.resetFields()
            this.emShow = false
            this.subloading =false
          } else {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            this.subloading =false
          }
        })
      }
    },
    Edits(id) {
      // console.log(id)
    },
    handleReset() {
      this.form.resetFields()
    },
    // 联动选择
    handleProvinceChange(value) {
      this.cities = this.cityData[value];
      this.secondCity = []
      this.secondCity.push(this.cityData[value][0].value);
      this.authCountrySite = this.authCountry[value]
    },
    //
    addAuthCode(value){
      if(this.authCountryCode.indexOf(value) == -1){
        this.authCountryCode.push(value)
      }else{
        this.authCountryCode.splice(this.authCountryCode.indexOf(value),1)
      }
    },
    //获取站点数据
    getAuthCountrys(){
      return getAuthCountryList().then(res => {
        if (res.code === 0) {
          this.authCountry = res.data
          this.authCountrySite = this.authCountry[this.provinceData[0].code]
          return res.data
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
      .catch(err => {
        
      })
    },
    //选择平台
    selectPlatform(type){
      if(type==1){
        this.platformSelect = 1
        this.platform = 'amazon'
        this.columnTitle = '授权国家'
        this.getlist()
      }else if(type==2){
        this.platformSelect = 2
        this.platform = 'shopee'
        this.columnTitle = '站点'
        this.getShopeeShopList()
      }
    },
    //获取用户是否开通亚马逊和虾皮
    async getCheckAuths(){
      this.listLoading = true
      const { code, data, msg } = await getCheckAuth()
      if (code === 0) {
        console.log(data)
        this.platformStatus1 = data.amazon
        this.platformStatus2 = data.shopee
        if(this.platformSelect == 2){
          this.platformSelect = 2
          this.platform = 'shopee'
          this.columnTitle = '站点'
          //添加虾皮店铺授权
          if(this.shopeeId){
            console.log(Vue.ls.get('SHOPEE_ADD_STATUS'),'SHOPEE_ADD_STATUS')
            let status = Vue.ls.get('SHOPEE_ADD_STATUS')
            if(status === 1){
              this.shopeeId = ''
              this.getShopeeShopList()
            }else{
              this.saveShopeeAdd(this.shopeeId)
            }
          }else{
            this.getShopeeShopList()
          }
        }else{
          this.getlist()
        }
      } else {
        this.listLoading = false
        this.$notification.error({ message: '提醒', description: msg })
      }
    },
  }
}
</script>
<style lang='less' scoped>
.mt {
  margin-top: 20px;
}
.mr {
  margin-right: 20px;
}
.ml{margin-left: 10px;}
</style>
<style>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.15) !important;
}
.showfoot > .ant-modal-content > .ant-modal-footer {
  display: none !important;
}
</style>
<style lang="less">
.platform_icon{
  width:140px;
  overflow:hidden;
  height:49px;
  position:relative
}
.platform_select{
  position:absolute;
  width:140px;
  height:49px;
  top:0;
  left:0;
}
.platform_select1{
  width:0;
  height:0;
  border-width:0 0 25px 25px;
  border-style:solid;
  border-color:transparent transparent #1890ff;
  position:absolute;
  right:0;
  bottom:0
}
.platform_select2{
  color:#fff;
  position:absolute;
  right:2px;
  bottom:1px
}
.platform_noselect{
  position:absolute;
  width:140px;
  height:49px;
  line-height: 49px;
  background-color:#666;
  opacity:0.5;
  top:0;
  left:0;
  text-align: center;
}
.platform_noselect1{
  position:absolute;
  width:140px;
  height:49px;
  line-height: 49px;
  top:0;
  left:0;
  color: #fff;
  text-align: center;
}
</style>
