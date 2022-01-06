<template>
  <a-card hoverable :bordered="false">
      <a-row>
        <a-col :span="24">
          <a-form-item
            label="目的地："
            :labelCol="{span:3}"
            :wrapperCol="{span:16}">
            <a-select placeholder='请选择国家' v-model="siteValue" style="width:180px">
              <a-select-option value="">请选择国家</a-select-option>
              <a-select-option v-model="item.title" v-for='(item,index) in countrySelect' :key='index'>{{item.value}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col  :span="24">
          <a-form-item
            label="属性："
            :labelCol="{span:3}"
            :wrapperCol="{span:16}">
            <span>重量(g)：</span>
            <a-input v-model="numValue" style="width:100px" type="number" :min="0"/>
            <span style="margin-left:10px">尺寸(cm)：</span>
            <a-input v-model="longValue" placeholder="长(cm)" style="width:100px" type="number" :min="0" />
            <a-input v-model="widthValue" placeholder="宽(cm)" style="width:100px" type="number" :min="0" />
            <a-input v-model="heightValue" placeholder="高(cm)" style="width:100px" type="number" :min="0" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col  :span="6">
          <a-form-item
            label="货物类型："
            style=""
            :labelCol="{span:12}"
            :wrapperCol="{span:12}">
            <a-radio-group v-model="radio_status">
              <a-radio :value="1">不含电</a-radio>
              <a-radio :value="2">含电</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col  :span="18">
          <a-button type="primary" @click="getList()">试算¥</a-button>
          <span style="margin-left:20px">运费测算仅供参考</span>
        </a-col>
      </a-row>
      <a-row
        type="flex"
        justify="start"
        style="margin-bottom:20px">
        <a-col
          class='title-size'
          :span='3'
          style="text-align:right;width:216px">
          筛选物流:   
        </a-col>
        <a-col
          :span='2'
          v-show="logisticStatus1"
          style="margin-right:20px;margin-left:10px"
          @click="selectLogistics(1)">
          <a-button class="logistics_icon">
            <img
              style="width:90px; margin-left:-5px;margin-top:-5px"
              :src="DSFlogo"
              alt=""/>
            <p v-show="logisticSelectShow==1" class="logistics_select">
              <i class="logistics_select1"></i>
              <a-icon class="logistics_select2" type="check"/>
            </p>
          </a-button>
        </a-col>
        <a-col
          :span='2'
          v-show="logisticStatus2"
          style="margin-right:20px"
          @click="selectLogistics(2)">
          <a-button class="logistics_icon">
            <img
              style="width:90px; margin-left:-5px;margin-top:-5px"
              :src="YWlogo"
              alt=""/>
            <p v-show="logisticSelectShow==2" class="logistics_select">
              <i class="logistics_select1"></i>
              <a-icon class="logistics_select2" type="check"/>
            </p>
          </a-button>
        </a-col>
        <a-col
          :span='2'
          v-show="logisticStatus3"
          style="margin-right:20px"
          @click="selectLogistics(3)">
          <a-button class="logistics_icon">
            <img
              style="width:90px; margin-left:-5px;margin-top:-5px"
              :src="SFlogo"
              alt=""/>
            <p v-show="logisticSelectShow==3" class="logistics_select">
              <i class="logistics_select1"></i>
              <a-icon class="logistics_select2" type="check"/>
            </p>
          </a-button>
        </a-col>
        <a-col
          :span='2'
          v-show="logisticStatus4"
          style="margin-right:20px"
          @click="selectLogistics(4)">
          <a-button class="logistics_icon">
            <img
              style="width:90px; margin-left:-5px;margin-top:-5px"
              :src="YTlogo"
              alt=""/>
            <p v-show="logisticSelectShow==4" class="logistics_select">
              <i class="logistics_select1"></i>
              <a-icon class="logistics_select2" type="check"/>
            </p>
          </a-button>
        </a-col>
        <a-col
          :span='2'
          v-show="logisticStatus5"
          style="margin-right:20px"
          @click="selectLogistics(5)">
          <a-button class="logistics_icon">
            <img
              style="width:90px; margin-left:-5px;margin-top:-5px"
              :src="YZlogo"
              alt=""/>
            <p v-show="logisticSelectShow==5" class="logistics_select">
              <i class="logistics_select1"></i>
              <a-icon class="logistics_select2" type="check"/>
            </p>
          </a-button>
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :loading="listLoading"
        :pagination="false "
        :dataSource="orderList"
        @change="handleTableChange"
        rowKey="id">
        <template slot="address" slot-scope="text, record">
          <p v-for="(item,index) in record.address" :key="index" >
            <span>
              {{item}}
            </span>
          </p>
        </template>
          <template slot="remark" slot-scope="text, record">
            <span v-html='record.remark'>
            </span>
        </template>
      </a-table>
    </a-card>
</template>

<script>
import { freightMeasure } from '@/api/home'
import { getLogisticsCompany } from '@/api/order'
import { countrySelect } from '@/views/order/public/country'

export default {
  name: 'news',
  data() {
    return {
      siteValue:"",
      numValue:"",
      longValue:"",
      widthValue:"",
      heightValue:"",
      radio_status:1,
      countrySelect,
      orderList: [],
      listLoading:false,
      page: '',
      current: 1,
      sortedInfo: {
        order: 'ascend',
        columnKey: 'freight',
      },
      sort: null,
      order_by: null,
      DSFlogo:require("@/assets/image/dsf.jpg"),
      YWlogo:require("@/assets/image/yw.jpg"),
      SFlogo:require("@/assets/image/sf.jpg"),
      YTlogo:require("@/assets/image/yt.png"),
      YZlogo:require("@/assets/image/yz.png"),
      logisticSelectShow:0,
      company:'',
      logisticStatus1:false,
      logisticStatus2:false,
      logisticStatus3:false,
      logisticStatus4:false,
      logisticStatus5:false,
    }
  },
  methods: {
    getList () {
      freightMeasure({
        country:this.siteValue,
        weight:this.numValue,
        length:this.longValue,
        width:this.widthValue,
        height:this.heightValue,
        battery_status:this.radio_status,
        sort:this.sort,
        order_by:this.order_by,
        company:this.company
      }).then((res)=>{
        if(res.code === 0){
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
          if(JSON.stringify(res.data) != "{}"){
            this.orderList = res.data;
            this.orderList.forEach((item, index) => {
              item.id = index+1
            })
          }else{
            this.orderList = [];
          }
          this.cardLoading = false;
        }else{
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
    },
    pagechange(page, pagesize) {
      this.current = page
      this.getList()
    },
    handleTableChange(pagination, filters, sorter) {
      if(sorter.columnKey=="freight"){
        this.sort = "freight"
        if(sorter.order=="ascend"){
          this.order_by = 0
        }else{
          this.order_by = 1
        }
      }
      if(sorter.columnKey=="day"){
        this.sort = "day"
        if(sorter.order=="ascend"){
          this.order_by = 0
        }else{
          this.order_by = 1
        }
      }
      this.getList()
    },
    //选择物流公司
    selectLogistics(type){
      if(this.logisticSelectShow == type){
        this.logisticSelectShow = 0
        this.company = ''
      }else{
        if(type==1){
          this.logisticSelectShow = 1
          this.company = 'fpx'
        }else if(type==2){
          this.logisticSelectShow = 2
          this.company = 'yw'
        }else if(type==3){
          this.logisticSelectShow = 3
          this.company = 'sf'
        }else if(type==4){
          this.logisticSelectShow = 4
          this.company = 'yt'
        }else if(type==5){
          this.logisticSelectShow = 5
          this.company = 'yz'
        }
      }
      this.getList()
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
              }else if(item.code=='yt'){
                this.logisticStatus4 = true
              }else if(item.code=='yz'){
                this.logisticStatus5= true
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
  computed: {
    columns() {
      const columns = [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          align:'center'
        },
        {
          title: '渠道',
          dataIndex: 'services',
          key: 'services',
          align:'center'
        },
        {
          title: '物流方式',
          dataIndex: 'channel_name',
          key: 'channel_name',
          align:'center'
        },
        {
          title: '重量段',
          dataIndex: 'weight',
          key: 'weight',
          align:'center'
        },
        {
          title: '运费',
          dataIndex: 'freight',
          key: 'freight',
          sorter: true,
          align:'center',
        },
        {
          title: '递送天数',
          dataIndex: 'day',
          key: 'day',
          sorter: true,
          align:'center',
        },
        {
          title: '出货仓库',
          key: 'address',
          align:'center',
          scopedSlots: { customRender: 'address' },
        },
        {
          title: '尺寸备注',
          dataIndex: 'remark',
          key: 'remark',
          align:'left',
          width:'600px',
          scopedSlots: { customRender: 'remark' },
        },
      ];
      return columns;
    },
  },
  created() {},
  mounted() {
    this.getLogisticsCompanys()
  },
  uptated() {},
  destroyed() {}
}
</script>
<style lang='less' scoped>
.ml {
  margin-left: 20px;
}
.mt {
  margin-top: 20px;
}
.tar {
  text-align: right;
}
.title {
  color: #000;
  font-size: 14px;
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

