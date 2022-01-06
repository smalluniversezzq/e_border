<template>
  <div class='follow-up'>
    <a-card>
      <a-row>
        <a-col>
          <a-select v-model='asin.classValue' :allowClear='true'  placeholder='请选择国家'  style="width:180px " @change="countrychange">
            <a-select-option :value="item.code"  v-for='(item,index) in countryFollow' :key="index">{{item.title}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row class='mt'>
        <a-col>
          <a-textarea v-model='asin.asinUrl' placeholder="输入ASIN，Enter换行最多可输入20个ASIN" :rows="4"/>
        </a-col>
      </a-row>
      <a-row class='mt'>
        <a-col class='tar'>
          <a-button class='mr-sm'  v-if='hasPerm(permsBtn.followup_colle)' :loading='disableds' @click='addAsin()'>开始采集</a-button>
          <a-button class=''  @click='(()=>(asin={}))'>清空</a-button>
        </a-col>
      </a-row>
      <!-- <a-divider /> -->
      <!-- 搜索 -->
      <a-row>
        <a-col span='24' class='tal'>
          查询：
          <a-select class='mr-sm' v-if='btnState.storeSelect' v-model='searchList.shopSearchValue' :allowClear='true'  placeholder='请选择店铺'  style="width:180px " @change="shopChange">
            <a-select-option :value="item.id"  v-for='(item,index) in storeSelect' :key="index">{{item.title}}</a-select-option>
          </a-select>
          <a-select class='mr-sm' v-if='btnState.countrySelect' v-model='searchList.countrySearchValue' :allowClear='true'  placeholder='请选择国家'  style="width:180px " @change="countryListChange">
            <a-select-option :value="item.code"  v-for='(item,index) in siteListSelect' :key="index">{{item.title}}</a-select-option>
          </a-select>
          <a-select class='mr-sm' v-if='btnState.countrySelectAll'  v-model='searchList.countrySearchValue' :allowClear='true'  placeholder='请选择国家'  style="width:180px " @change="countryListChange">
            <a-select-option :value="item.code"  v-for='(item,index) in countryFollow' :key="index">{{item.title}}</a-select-option>
          </a-select>
          <a-select class='mr-sm'  v-model='searchList.userID' :allowClear='true'  placeholder='请选择用户'  style="width:180px " @change="userChange">
            <a-select-option :value="item.uid" v-for='(item,index) in userList' :key='index'>{{item.user_name}}</a-select-option>
          </a-select>
          <a-select class='mr-sm' v-if='hasPerm(permsBtn.followup_timer)'  :allowClear='true' v-model='searchList.rlue'   placeholder='请选择定时规则'  style="width:180px " @change="timingRuleChange">
            <a-select-option :value="item.id" v-for='(item,index) in timerList' :key='index'>{{item.title}}</a-select-option>
          </a-select>
          <a-input class='mr-sm' style='width:150px' v-model='searchList.asin'  placeholder='请输入ASIN'/>
          <a-button type='primary' @click='search()'>搜索</a-button>
          <a-button  class='ml' @click='(()=>(searchList={}))'>重置</a-button>
        </a-col>
        </a-row>
        <a-row>
        <a-col span='24' class='tal mt dis-flex flex-wrap'>
          <span v-if='btnState.submitUpdata || btnState.upperShelf || btnState.LowerShelf'>操作：</span>
          <a-select class='mr-sm' v-if='btnState.searchStore' :allowClear='true' v-model='searchList.shopListValue'   placeholder='请选择店铺'  style="width:180px " @change="GetShopChange">
            <a-select-option :value="item.id" v-for='(item,index) in storeSelect' :key='index'>{{item.title}}</a-select-option>
          </a-select>
          <a-select class='mr-sm'  v-if='btnState.searchCountry' :allowClear='true' v-model='searchList.countryListValue'   placeholder='请选择国家'  style="width:180px " @change="GetCountryChange">
            <a-select-option :value="item.code"  v-for='(item,index) in GetsiteSelect' :key="index">{{item.title}}</a-select-option>
          </a-select>
          <div v-if='hasPerm(permsBtn.followup_usubmitUpdata)'>
            <a-button v-if='btnState.submitUpdata' class='mr-sm' @click='updata()'>保存并更新</a-button>
          </div>
          <div v-if='hasPerm(permsBtn.followup_upperShelf)'>
            <a-button v-if='btnState.upperShelf'  @click='toShelf()' :loading='shelfLoading'  class='mr-sm'>上架</a-button>
          </div>
          <div v-if='hasPerm(permsBtn.followup_lowerShelf)'>
            <a-button v-if='btnState.LowerShelf' @click='soldOut()'>下架</a-button>
          </div>
        </a-col>
      </a-row>
      <a-row class='mt'>
        <a-col>
          <!-- 商品状态:0 默认,即待上架;1 上架中, 2 上架成功 ; 3 下架中, 4 已下架; 5 上架失败,6 下架失败 -->
         <a-button-group>
            <a-button
              :type='screenType ==="0" ? "primary":"default"'
              @click='screen("0")'
            >待上架</a-button>
            <a-button
              :type='screenType ==="1" ? "primary":"default"'
              @click='screen("1")'
            >上架中</a-button>
            <a-button
              :type='screenType ==="2" ? "primary":"default"'
              @click='screen("2")'
            >已上架</a-button>
            <a-button
              :type='screenType ==="3" ? "primary":"default"'
              @click='screen("3")'
            >下架中</a-button>
            <a-button
              :type='screenType ==="4" ? "primary":"default"'
              @click='screen("4")'
            >已下架</a-button>
            <a-button
              :type='screenType ==="5" ? "primary":"default"'
              @click='screen("5")'
            >上架失败</a-button>
            <a-button
              :type='screenType ==="6" ? "primary":"default"'
              @click='screen("6")'
            >下架失败</a-button>
          </a-button-group>
        </a-col>
      </a-row>
      <a-row >
        <a-col>
          <a-table
            :pagination="false"
            :dataSource="data"
            :loading = "listLoading"
            :rowSelection="rowSelection"
            :scroll="{ x: 1900}"
            rowKey="id">
             <a-table-column
              title="图片"
              fixed="left"
              width="100px">
              <template slot-scope="text, record">
                <a-popover v-show="record.image_url" placement="rightTop">
                  <template slot="content" style="width:200px">
                    <img style="width:200px" :src="record.image_url" alt="">
                  </template>
                  <a-button style="width:100px;position:relative;overflow:hidden;height:100px">
                    <img
                      style="width:100px; margin-left:-16px;margin-top:-2px"
                      :src="record.image_url"
                      alt="暂无订单信息"
                     />
                  </a-button>
                </a-popover>
              </template>
            </a-table-column> 
            <a-table-column
              title="商品标题"
              dataIndex="title"
              width="300px"
            >
            <template slot-scope="text, record">
              <div class='list-link cur text-min' :title='record.title' @click='linkTo(record.source_url)'>{{record.title}}</div>
            </template>
            </a-table-column>
            <a-table-column
              title="ASIN"
              dataIndex="asin"
              width="100px"
            >
            </a-table-column>
            <a-table-column
              v-if='btnState.storeList'
              title="店铺"
              width="100px"
              dataIndex='store_title'
            >
            <!-- <template slot-scope="text, record">
              <div v-for='(item,index) in storeSelect' v-if='item.id == record.store_id' :key='index'>
                <span>{{item.title}}</span>
              </div>
            </template> -->
            </a-table-column>
            <a-table-column
              title="国家"
              width="100px"
            >
            <template slot-scope="text, record">
              {{codeORcountry[record.country]}}
            </template>
            </a-table-column>
            <a-table-column
              v-if='hasPerm(permsBtn.followup_timer)'
              title="定时任务"
              width="250px">
              <template  slot-scope="text, record">
                <span v-if='record.editableTime'>
                  <a-select   :allowClear='true'  v-model="record.task"  placeholder='请选择定时任务'  style="width:180px " >
                    <a-select-option :value="item.id"  v-for='(item,index) in timerList' :key="index">{{item.title}}</a-select-option>
                  </a-select>
                  <span @click='saveTime(record.id,record.task)'>保存</span>
                  <!-- <a-icon  @click='saveTime(record.id,record.task)' type="save"  /> -->
                </span>
                <span v-else>
                  {{record.timer_title}}
                  <span v-if='screenType ==="0" || screenType ==="4" || screenType ==="5"'>
                    <span  @click='EditTime(record.id)'>编辑</span>
                    <!-- <a-icon  type="edit" /> -->
                  </span>
                  <span v-else-if='screenType === "1" || screenType === "3"'>
                    <span  @click='EditTimeMessage' >编辑</span>
                  </span>
                  <span v-else>
                    <!-- <a-icon v-if='record.timer_id != 0' @click='EditTime(record.id)' type="edit" /> -->
                    <span  v-if='record.timer_id != 0 ' @click='EditTime(record.id)'>编辑</span>
                    <span  v-else @click='EditTimeProhibit' >编辑</span>
                    <!-- <a-icon v-else @click='EditTimeProhibit' type="edit" /> -->
                  </span>
            
                </span>
              </template>
            </a-table-column>
            <a-table-column
              title="调价规则"
              width="250px">
              <template  slot-scope="text, record">
                {{record.rule_title}}
                <span @click='EditPrice(record)'>编辑</span>
              </template>
            </a-table-column>
            <a-table-column
              title="售价"
              width="200px"
            >
              <template  slot-scope="text, record">
                <span :class="record.color=='highlight'?'highlight':'default'"  v-for='(item,index) in currencyList' :key='index' v-if='item.id == record.country'>
                  {{item.logo}}
                </span>
                <a-input-number
                :step="0.01"
                :min='0.01'
                v-if='record.editable'
                style="margin: -5px 0 ; width:80px"
                v-model="record.price"
              />
                <span :class="record.color=='highlight'?'highlight':'default'" v-else >{{record.price }}</span>
              </template>
            </a-table-column>
            <a-table-column
              title="库存"
              width="100px"
            >
              <template  slot-scope="text, record">
                <a-input-number
                :min='-1'
                v-if='record.editable'
                style="margin: -5px 0"
                v-model="record.quantity"
              />
                <span :class="record.color=='highlight'?'highlight':'default'" v-else>{{record.quantity }}</span>
              </template>
            </a-table-column>
            <a-table-column
              class="time"
              title="创建时间"
              dataIndex="created_at"
              width="130px"
            >
            </a-table-column>
            <a-table-column
              class="time"
              title="更新时间"
              dataIndex="updated_at"
              width="130px"
            >
            </a-table-column>
            <a-table-column
              class="time"
              title="状态"
              dataIndex="state"
              width="130px"
            >
            <template slot-scope="text, record">
              <span v-if='record.status === "0"'>待上架</span>
              <span v-if='record.status === "1"'>上架中<span v-if='record.timer_start'>{{'（预计'+record.timer_start+'开始上架）'}}</span></span>
              <span v-if='record.status === "2"'>已上架</span>
              <span  v-if='record.status === "3"'>下架中</span>
              <span v-if='record.status === "4"'>已下架</span>
              <span v-if='record.status === "5"'>上架失败</span>
              <span v-if='record.status === "6"'>下架失败</span>
            </template>
            </a-table-column>
            <a-table-column
              class="time"
              title="操作"
              width='210px'
            >
            <template slot-scope="text, record">
                <span v-if="record.editable">
                  <a-button v-if='btnState.editBtn' class='mr-sm' @click="() => save(record.id,record.price,record.quantity,)">确认</a-button>
                </span>
                <span  v-else>
                  <a-button v-if='btnState.editBtn' class='mr-sm' type="primary"  @click='Edits(record.id)'>编辑</a-button>
                </span>
                <a-button v-if='btnState.delBtn' :disabled='!hasPerm(permsBtn.followup_del)'  type="danger" @click='del(record.id)'>删除</a-button>
                <a-button  v-if='btnState.revoke' @click='revoke(record.id)'>撤销</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-col>
      </a-row>
      <a-row class='mt'>
        <a-col class='tar'>
          <a-pagination
              v-model="current"
              @change='pagechange'
              :pageSize='page.pageSize'
              :total='(page.pageSize*page.lastPage)'
            />
        </a-col>
      </a-row>
    </a-card>
    <a-modal 
      title='删除'
      :visible='delVisibles'
      @ok="delOk"
      @cancel="delCancel"
    >
      <div> 
        确认删除吗
      </div>
    </a-modal>
    <a-modal
      title="智能调价"
      :width="720"
      :visible="editPriceVisible"
      @ok="editPriceOk"
      @cancel="editPriceCancel">
      <a-row>
        <a-col :span="4">
          <img style="width:100%;height:80px;display:block" :src="editePriceData?editePriceData.image_url:''" alt="">
        </a-col>
        <a-col :span="10" class="ml">
          <p>{{editePriceData?editePriceData.title:''}}</p>
          <p>商品原始价：${{editePriceData?editePriceData.price:0}}&nbsp;{{editePriceData?codeORcountry[editePriceData.country]:''}}</p>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          最高价：
          <a-input style="width: 120px" v-model="editPrice1" placeholder="" />
        </a-col>
        <a-col :span="8">
          最低价：
          <a-input style="width: 120px" v-model="editPrice2" placeholder="" />
        </a-col>
        <a-col :span="8">
          调价规则：
          <a-select v-model="priceRule" style="width: 120px">
            <a-select-option value="">
              请选择
            </a-select-option>
            <a-select-option :value="item.id" v-for="(item,index) in ruleList" :key="index">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import {getMyStore ,validateUrl , toSellCrawler ,toSellList ,getAllUser ,toSellDel , updataSellInfo,mwsToSell , mwsSoldOut, updataAndUpload ,getTimerTitle ,updataSellTimer , updataSellStatus,getPriceRule,setFollowRule} from '@/api/collect'
import {currencyList , codeORcountry ,countryFollow} from '@/views/order/public/country'
import { permsBtn } from '@/utils/static'
  export default {
    name:"followup",
    components:{
    },
    props:['countrySelect'],
    data(){
      // this.cacheData = this.data.map(item => ({ ...item }));
      return{
        permsBtn,
        shelfLoading:false,
        GetsiteSelect:"",
        countryFollow,
        page:{},
        codeORcountry,
        current:1,
        selectAll:"",
        publishObj:"",
        classValue:"",
        SelectCountry:"",
        currencyList,
        storeSelect:"",
        siteSelect:[],
        timeValue:"",
        delVisibles:false,
        delId:"",
        asin:{},
        searchList:{},
        // 列表参数
        siteListSelect:"",
 
        stateList:[
          {
            name:"待上架",
            code:"0"
          },
          {
            name:"上架中",
            code:"1"
          },
          {
            name:"已上架",
            code:"2"
          },
          {
            name:"已下架",
            code:"3"
          },
          {
            name:"上架失败",
            code:"4"
          }
        ],
        screenType:"0",
        countryLogo:"",
        asinUrl:"",
        listLoading:false,
        selectManageAll:"",
        selectkey:"",
        selectedRowKeys: [],
        data:[],
        timerList:'',
        btnState:{
          editBtn:true,
          delBtn:true,
          upperShelf:true,
          LowerShelf:false,
          submitUpdata:false,
          storeList:true,
          revoke:false,
        },
        num:0,

        //插件相关
        chromeID:this.GLOBAL.chrome.id,
        chromeCode:this.GLOBAL.chrome.id,
        showChromeUrl:false,
        showChromeCode:false,
        successNumber: 0,
        errorNumber: 0,
        disableds:false,
        disabledAll:false,
        html:"",
        siteUrl:{
          "US": "https://www.amazon.com/dp/",  // 美国
          "CA": "https://www.amazon.ca/dp/",      // 加拿大   
          "MX": "https://www.amazon.com.mx/dp/",  // 墨西哥
          "DE": "https://www.amazon.de/dp/",      // 德国
          "ES": "https://www.amazon.es/dp/",      // 西班牙
          "FR": "https://www.amazon.fr/dp/",      // 法国
          "GB": "https://www.amazon.co.uk/dp/",   // 英国
          "IT": "https://www.amazon.it/dp/",      // 意大利
          "AU": "https://www.amazon.com.au/dp/",  // 澳大利亚
          "NL": "https://www.amazon.nl/dp/",      //荷兰 
          "JP": "https://www.amazon.co.jp/dp/",   // 日本
          "PL": "https://www.amazon.pl/dp/",   // 波兰
          "CN": "https://www.amazon.cn/dp/",      // 中国测试采集使用
        },
        userList:[],
        info:{
          store_id:"",
          search_country:"",
          user_id:"",
          asin:"",
          status:"",
          on_rules:"",
          page_size:10,
          page:1,
        },
        //上架传的参数
        mws_to_sell:{
          goods_ids:'',
          country:'',
          store_id:''
        },
        sold_out:{
          goods_ids:''
        },
        updataInfo:{
          goods_infos:[{}]
        },
        contrastCountry:"",
        editPriceVisible:false,
        priceRule:'',
        editPrice1:'',
        editPrice2:'',
        editePriceData:null,
        ruleList:[]
      }
    },
    watch: {
    },
    computed: {
      rowSelection() {
        const { selectedRowKeys } = this;
        return {
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.selectManageAll = selectedRows,
            this.selectkey = selectedRowKeys,
            this.selectedRowKeys = selectedRowKeys
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }
          }),
        }
      }
    },
    methods:{
      //获取店铺信息 校验添加采集
      getMyStoreFn(){
        getMyStore().then((res)=>{
          if(res.code === 0){
            this.storeSelect = res.data
          }
        })
      },
      // 店铺搜索查询
      shopchange(val){
        this.shopValue = val
        if(this.asin.classValue){
          this.asin.classValue = ''
        }
        this.storeSelect.forEach((item,index) => {
          if(val === item.id){
            this.siteSelect = item.mws_site
          }
        })
      }, 
      //国家搜索查询
      countrychange(value){
        console.log(this.currencyList,'currencyList',value,'value')
        // this.selectedRowKeys = []
        this.publishObj = []
        this.selectAll = []
        this.classValue = value
        this.SelectCountry = value
        this.currencyList.forEach((item,index) =>{
          if(item.id === this.SelectCountry){
            // 获取
            this.countryLogo = item.logo
          }
        })
      },

      // 定时规则
      timingRuleChange(value){
        this.timeValue = value
      },
      addAsin(){  
          if(this.asin.classValue){
            if(this.asin.asinUrl){
              this.toCollect()
              console.log('可以采集了')
            }else{
              this.$notification.error({
                message:'错误',
                description: "ASIN不能为空",
              });
            }
          }else{
            this.$notification.error({
              message:'错误',
              description: "国家不能为空",
            });
          }
    
      },
      // 上架筛选店铺
      GetShopChange(value){
        console.log(value,this.storeSelect)
        if(this.searchList.countryListValue){
          this.searchList.countryListValue = ''
        }
        this.storeSelect.forEach((item,index) => {
          if(value === item.id){
            this.GetsiteSelect = item.mws_site
          }
        })
        console.log(this.GetsiteSelect,'GetsiteSelect')
      },
      // 上架筛选国家
      GetCountryChange(value){
        this.store_country = value
        // if(this.screenType === '0'){
        // }else{
        //   // this.info.store_id = value
        //   // this.getGoodsLists(this.info)
        // }
        console.log(this.searchList.countryListValue,'countryListValue')
      },

      // 搜索店铺
      shopChange(val){
        console.log(val,'店铺查询')
        console.log(this.searchList.countrySearchValue)
        if(this.searchList.countrySearchValue){
          this.searchList.countrySearchValue = ''
        }
        this.storeSelect.forEach((item,index) => {
          if(val === item.id){
            this.siteListSelect = item.mws_site
          }
        })
      },
      // 搜索国家
      countryListChange(val){
        console.log(this.searchList.countrySearchValue,'countryListValue')
      },
      userChange(value){
        console.log(this.searchList.userID,'userid')
      },
      search(){
        Object.assign(this, {
          selectedRowKeys: [],
        })
        console.log(
          '店铺',this.searchList.shopSearchValue,
          '国家',this.searchList.countrySearchValue,
          '用户',this.searchList.userID,
          '定时规则',this.searchList.rlue,
          'asin',this.searchList.asin)
        this.info.store_id=this.searchList.shopSearchValue
        this.info.search_country=this.searchList.countrySearchValue
        this.info.asin=this.searchList.asin
        this.info.user_id=this.searchList.userID,
        this.info.on_rules = this.searchList.rlue,
        console.log(this.info,'info')
        this.getGoodsLists(this.info)
      },
      jumpToOrderUrl(){},
      Edits(id){
        // 编辑
        this.num ++
        console.log(this.num)
        const newData = [...this.data];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target.editable = true;
          this.data = newData;
        }
      },
      save(id,price,quantity) {
        this.num --
        console.log(this.num,)
        // console.log(id)
        const newData = [...this.data];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          delete target.editable;
          this.data = newData;
          this.cacheData = newData.map(item => ({ ...item }));
        }
        if(this.screenType === '2'){
          //感觉这里设计不是很好
          console.log('假更新')
          this.data.forEach((item,index)=>{
            if(item.id === id){
               item.color = 'highlight'
            }
          })
        }else{
          this.updataSellInfoFn(id,price,quantity)
        }
      },
      //撤销
      revoke(id){
        updataSellStatus({
          id:id
        }).then((res)=>{
          if(res.code === 0){
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
             this.getGoodsLists(this.info)
          }else{
            this.$notification.error({
              message: '错误',
              description:  res.msg,
            });
          }
        })
      },
      //  保存 售价 库存
      updataSellInfoFn(id,price,quantity){
        updataSellInfo({
          id:id,
          price:price,
          quantity:quantity
        }).then(res =>{
          if(res.code ===0){
            this.$notification.success({
              message:'成功',
              description: "商品价格、库存修改成功",
            });
            this.getGoodsLists(this.info)
          }else{
            this.getGoodsLists(this.info)
            this.$notification.error({
              message:'错误',
              description: res.msg,
            });
          }
        })
      },
      EditTime(id){
        console.log('编辑了')
        const newData = [...this.data];
        if(this.screenType === '1' || this.screenType === '6'){
          this.$message.warn('预计开始上架前5分钟内不可修改定时任务',2.5);
        }
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target.editableTime = true;
          this.data = newData;
        }
      },
      EditTimeProhibit(){
          this.$message.warn('已上架产品未设置定时任务不允许修改',2.5);
      },
      EditTimeMessage(){
         this.screenType === '1'?this.$message.warn('上架中不允许修改',2.5):this.$message.warn('下架中不允许修改',2.5);
      },
      saveTime(id,timer_id){
        //编辑
        console.log('保存')
        console.log(this.num,updataSellTimer)
        if(this.screenType =="0"){
          updataSellTimer({
            good_id:id,
            timer_id:timer_id,
          }).then(res =>{
            if(res.code === 0){
              this.getGoodsLists(this.info)
              const newData = [...this.data];
              const target = newData.filter(item => id === item.id)[0];
              if (target) {
                delete target.editableTime;
                this.data = newData;
                this.cacheData = newData.map(item => ({ ...item }));
              }
            }else{
              this.$notification.error({
                message: '更新失败',
                description: res.msg,
              });
              this.getGoodsLists(this.info)
            }
          })
        }else{
          // if(timer_id){
            updataSellTimer({
              good_id:id,
              timer_id:timer_id,
            }).then(res =>{
              if(res.code === 0){
                this.getGoodsLists(this.info)
                const newData = [...this.data];
                const target = newData.filter(item => id === item.id)[0];
                if (target) {
                  delete target.editableTime;
                  this.data = newData;
                  this.cacheData = newData.map(item => ({ ...item }));
                }
              }else{
                this.$notification.error({
                  message: '更新失败',
                  description: res.msg,
                });
                this.getGoodsLists(this.info)
              }
            })
          // }else{
          //     this.$notification.error({
          //     message: '错误',
          //     description: '定时任务不能为空',
          //   });
          // }
        }
    
      },
      del(id){
        this.delVisibles = true
        this.delId = id
     
      },
      delOk(){
        toSellDel({
          id:this.delId
        }).then((res)=>{
          if(res.code === 0){
            this.$notification.success({
              message:'成功',
              description: "删除成功",
            });
            this.delVisibles = false
            this.getGoodsLists(this.info)
          }
        })
      },
      delCancel(){
        this.delVisibles = false
      },
      screen(type){
        this.screenType = type
        console.log(this.screenType)
        if(type === '0'){
          this.btnState = {
            editBtn:true,
            delBtn:true,
            upperShelf:true,
            LowerShelf:false,
            submitUpdata:false,
            //店铺字段
            storeList:false,
            storeSelect:false,
            countrySelect:false,
            countrySelectAll:true,
            searchStore:true,
            searchCountry:true,
            revoke:false,
          }
          this.info = {
            status:0,
            store_id:"",
            search_country:"",
            user_id:"",
            asin:"",
            on_rules:"",
            page:1
          }
          this.current = 1
          this.getGoodsLists(this.info)
        }else if(type === '1'){
          this.btnState = {
            editBtn:false,
            delBtn:false,
            upperShelf:false,
            LowerShelf:false,
            submitUpdata:false,
            storeList:true,
            storeSelect:true,
            countrySelect:true,
            countrySelectAll:false,
            searchStore:false,
            searchCountry:false,
            revoke:false,
          }
          this.info = {
            status:1,
            store_id:"",
            search_country:"",
            user_id:"",
            asin:"",
            on_rules:"",
            page:1
          }
          this.current = 1
          this.getGoodsLists(this.info)
        }else if(type === '2'){
          this.btnState = {
            editBtn:true,
            delBtn:false,
            upperShelf:false,
            LowerShelf:true,
            submitUpdata:true,
            storeList:true,
            storeSelect:true,
            countrySelect:true,
            countrySelectAll:false,
            searchStore:false,
            searchCountry:false,
            revoke:false,
          } 
          this.info = {
            status:2,
            store_id:"",
            search_country:"",
            user_id:"",
            asin:"",
            on_rules:"",
            page:1,
            page_size:10,
          }
          this.current = 1
          this.getGoodsLists(this.info)
        }else if(type === '3'){
          this.btnState = {
            editBtn:true,
            delBtn:false,
            upperShelf:false,
            LowerShelf:false,
            submitUpdata:false,
            storeList:true,
            storeSelect:true,
            countrySelect:true,
            countrySelectAll:false,
            searchStore:false,
            searchCountry:false,
            revoke:false,
          } 
          this.info = {
            status:3,
            store_id:"",
            search_country:"",
            user_id:"",
            asin:"",
            on_rules:"",
            page:1
          }
          this.current = 1
          this.getGoodsLists(this.info)
        }else if(type === '4'){
          this.btnState = {
            editBtn:true,
            delBtn:true,
            upperShelf:true,
            LowerShelf:false,
            submitUpdata:false,
            storeList:true,
            storeSelect:true,
            countrySelect:true,
            countrySelectAll:false,
            searchStore:true,
            searchCountry:true,
            revoke:false,
          }
          this.info = {
            status:4,
            store_id:"",
            search_country:"",
            user_id:"",
            asin:"",
            on_rules:"",
            page:1
          }
          this.current = 1
          this.getGoodsLists(this.info)
        }else if(type === '5'){
          this.btnState = {
            editBtn:true,
            delBtn:true,
            upperShelf:true,
            LowerShelf:false,
            submitUpdata:false,
            storeList:true,
            storeSelect:true,
            countrySelect:true,
            countrySelectAll:false,
            searchStore:true,
            searchCountry:true,
            revoke:false,
          }
          this.info = {
            status:5,
            store_id:"",
            search_country:"",
            user_id:"",
            asin:"",
            on_rules:"",
            page:1
          }
          this.current = 1
          this.getGoodsLists(this.info)
        }else if(type === '6'){
          this.btnState = {
            editBtn:false,
            delBtn:false,
            upperShelf:false,
            LowerShelf:true,
            submitUpdata:false,
            storeList:true,
            storeSelect:true,
            countrySelect:true,
            countrySelectAll:false,
            searchStore:false,
            searchCountry:false,
            revoke:true,
          }
          this.info = {
            status:6,
            store_id:"",
            search_country:"",
            user_id:"",
            asin:"",
            on_rules:"",
            page:1
          }
          this.current = 1
          this.getGoodsLists(this.info)
        }
         Object.assign(this, {
          selectedRowKeys: [],
        })
      },
      pagechange(page,pagesize){
        console.log(page,pagesize)
        this.current = page
        this.info.page = this.current
        this.getGoodsLists(this.info)
        Object.assign(this, {
          selectedRowKeys: [],
        })
      },
      // 采集相关
      //判断插件是否安装
      isChromeEB(){
        let _this = this
        let h = window.chrome
        //判断插件是否安装了
        h && h.runtime && h.runtime.sendMessage ? _this.showChromeUrl = false : _this.showChromeUrl = true
        console.log(_this.showChromeUrl === true ? "未安装插件": "安装了插件")
      },
      //采集
      toCollect(){
        let _this = this
        _this.disableds = true
        //超时时间
        setTimeout(()=>{
          if(_this.disableds===true){
            _this.disableds=false
            this.$notification.error({
              message:'错误',
              description: "采集出现错误，请重新采集",
            });
          }
        },60000)
        let h = window.chrome
        let targetExtensionId = _this.chromeCode; // 插件的ID
        h && h.runtime && h.runtime.sendMessage ?
        window.chrome.runtime.sendMessage(targetExtensionId, {
          type: 'single',
          action:"detect",
        }, function(response) {
          console.log(response)
          // 插件是否通信成功
          if(response === "ok"){
            console.log("装了插件")
            //这里要判断 单个url还是多个url
            let reg = /\n/g
            if(reg.test(_this.asin.asinUrl)){
              var strs = new Array(); //定义一数组
              strs = _this.asin.asinUrl.split(reg)
              console.log(strs,'拼接前')
              let splitStr = _this.splitUrl(strs,'all')
              console.log(splitStr,'splitStr')
              _this.collectAll(splitStr)
            }else{
              //单个url  category  // single   //fetch   //getHtml
              //单链接采集
              console.log(_this.asin.asinUrl,'单链接2插件')
              let splitStr = _this.splitUrl(_this.asin.asinUrl,'single')
              console.log(splitStr,'splitStr')
              _this.singleCollect(splitStr)
 
            }
            //判断链接是否可用
          }else{
            _this.disableds = false
            console.log("插件通信失败")
            _this.$notification.error({
              message: '错误',
              description: '插件安装失败',
            });
          }
        }) (console.log("装了插件")) : (this.toCollects(), console.log("插件未安裝"))
      },
      //单链接采集
      singleCollect(strs){
        console.log(strs,'单链接插件采集')
        let _this = this
        let targetExtensionId = _this.chromeCode
        validateUrl({
          url:strs
          }).then(res=>{
          if(res.code === 0){
            // _this.disableds = false
              window.chrome.runtime.sendMessage(targetExtensionId, {
                type: 'single',
                action:"getHtml",
                url:strs,
                config:"",
              }, function(response) {
              _this.html = response.data.html;
              console.log(_this.html,"over html,strs",strs)
              console.log(_this.asin.classValue,'this.classValue')
              let strArr = []
              strArr.push(strs)
              //获取到html后发送给后端
              toSellCrawler({
                country:_this.asin.classValue,
                urls:strArr,
                html:_this.html
              }).then(res=>{
                if(res.code === 0){
                  _this.disableds = false
                  // console.log(res.data)
                  _this.$notification.success({
                    message: '成功',
                    description: res.msg,
                    duration: 10
                  });
                    _this.disableds = false
                    _this.screen("0")
                }else{
                  _this.disableds = false
                  _this.$notification.error({
                    message: '错误',
                    description: res.msg,
                    duration: 10
                  });
                }
              })
            });
          }else if(res.code === 1){
            _this.disableds = false
            _this.$notification.error({
              message: '错误',
              description: '链接不可用',
            });
          }
        })
        
      },
      // 批量采集
      collectAll(strs) {
        console.log('执行了',strs)
        let _this = this
        let num = 0
        let targetExtensionId = _this.chromeCode; // 插件的ID
        strs.forEach((item,index) => {
          console.log(item,'item')
          validateUrl({
            url:item
          }).then(res=>{
            if( res.code === 0 ) {
                window.chrome.runtime.sendMessage(targetExtensionId, {
                  type: 'single',
                  action:"getHtml",
                  url:item,
                  config:"",
                }, function(response) {
                  console.log(response.data.html)
                  _this.html = response.data.html;
                  console.log(_this.html,"nihaode html",item,'item')
                //获取到html后发送给后端
                  let strArr = []
                  strArr.push(item) 
                  toSellCrawler({
                    country:_this.asin.classValue,
                    urls:strArr,
                    html:_this.html
                  }).then(res => {
                    num ++
                    if( res.code === 0 ) {
                      _this.successNumber += res.data.successCount
                      // console.log(index,"index",'over',strs.length)
                      if( num === strs.length ) {
                        _this.disableds = false
                        _this.disabledAll = false
                        _this.screen("0")
                        _this.disableds = false
                        _this.disabledAll = false
                        _this.$notification.success({
                          message: '成功',
                          description: '采集完成:成功' + _this.successNumber + '条,失败0条!',
                          duration: 10
                        });
                        num = 0
                      }
                      _this.screen("0")
                    }else {
                      _this.errorNumber = strs.length - _this.successNumber
                      // _this.disabledAll = false
                      // _this.disableds = false
                      if( strs.length - 1 == index ) {
                        _this.disabledAll = false
                        _this.disableds = false
                        _this.$notification.error({
                          message: '失败',
                          description: '采集完成:成功' + _this.successNumber + '条,失败' + _this.errorNumber + '条!',
                          duration: 10
                        });
                      }
                    }
                  })
                });
              }else if( res.code === 1 ) {
                // console.log("链接不可用")
                _this.disabledAll = false
                _this.disableds = false
                _this.$notification.error({
                  message: '错误',
                  description: '链接不可用',
                });
              }
            })
          })
          _this.successNumber = 0
          _this.errorNumber = 0
      },
      //后端采集
      toCollects(){
        console.log('后端采集')
        let _this = this
        let reg = /\n/g
        if(reg.test(_this.asin.asinUrl)){
          var strs = new Array(); //定义一数组
          strs = _this.asin.asinUrl.split(reg)
          let splitStr = _this.splitUrl(strs,'all')
          _this.getCrawler(splitStr)
        }else{
          //单链接采集
          console.log(_this.asin.asinUrl,'单链接')
          let splitStr = _this.splitUrl(_this.asin.asinUrl,'single')
          let strArr = []
          strArr.push(splitStr)
          console.log(strArr,typeof strArr,'strAll')
          _this.getCrawler(strArr)
        }

      },
      getCrawler(splitStr){
        toSellCrawler( { 
          country:this.asin.classValue,
          urls:splitStr
          })
          .then(res => {
            if(res.code === 0){
              this.disableds = false;
              this.screen("0")
              this.disableds = false;
              this.$notification.success({
                message: '采集成功',
                description: res.msg,
              });
            }else{
              this.disableds = false;
              this.$notification.error({
                message: '采集失败',
                description: res.msg,
              });
            }
          })
          .catch(() => {
            this.disableds = false;
            this.$notification.error({
              message: '请求失败',
              description: '请稍后采集',
            });
          })
      },
      // 拼接函数
      splitUrl(strs,type){
        console.log(strs,type,'type')
        let urlAll = []
        let urlSingle = ''
        let urlPost = this.siteUrl[this.asin.classValue]
        console.log(urlPost,'urls')
        if(type == 'all'){
          strs.forEach((item,index)=>{
            urlAll.push(urlPost.concat(item))
          })
          console.log(urlAll)
          return urlAll
        }
        if(type =='single'){
          console.log(urlPost,strs,'----',urlPost.concat(strs))
          return urlPost.concat(strs)
        }
      },
      getGoodsLists(info){
        console.log('请求数据',info)
        toSellList(info).then((res)=>{
          if(res.code === 0){
            if(JSON.stringify( res.data)==="{}"){
              this.data = []
            }else{
              this.data = res.data
            }
            this.page = res.pages
            console.log(this.page)
          }
        })
      },
      // 跳转第三方页面
      linkTo(url){
        console.log(url)
        if(url){
          window.open(url,'_blank')
        }
      },
      // 获取用户信息
      getAllUserFn(){
        getAllUser().then((res) =>{
          if(res.code === 0){
            this.userList = res.data
            console.log(this.userList)
          }
        })
      },
      //上架判断
      toShelf(){
        this.shelfLoading = true
        console.log(this.selectManageAll,'勾选',this.selectedRowKeys)
        if(this.selectedRowKeys.length <= 0){
          console.log(this.selectedRowKeys)
          this.shelfLoading = false
          this.$notification.error({
            message: '错误',
            description: '请先勾选上架的商品',
          });
        }else{
          // 'store_id'  'country'
          let goods = this.selectedRowKeys.join(',')
          if(this.searchList.shopListValue){
            this.mws_to_sell.store_id = this.searchList.shopListValue
            if(this.unify(this.data,this.selectedRowKeys,'country','1')){
              if(this.contrastCountry === this.searchList.countryListValue){
              this.mws_to_sell.country = this.searchList.countryListValue
              console.log('国家店铺统一了')
              //判断售价库存有没有填写
              if(this.unify(this.data,this.selectedRowKeys,'price','2')){
                console.log('填写了售价')
                if(this.unify(this.data,this.selectedRowKeys,'quantity','3')){
                  // 请求接口
                  this.mwsToSellFn(goods,)
                }else{
                  this.shelfLoading = false
                  this.$notification.error({
                    message: '错误',
                    description: '库存填写不正确',
                  }); 
                }
              }else{
                this.shelfLoading = false
                this.$notification.error({
                  message: '错误',
                  description: '售价填写不正确',
                });
                }
              }else{
                this.shelfLoading = false
                this.$notification.error({
                  message: '错误',
                  description: '筛选的国家与上架的国家未统一',
                });
              }
            }else{
              this.shelfLoading = false
              this.$notification.error({
                message: '错误',
                description: '国家未统一请先筛选国家',
              });
            }
          }else{
            this.shelfLoading = false
            this.$notification.error({
              message: '错误',
              description: '请先选择上架的店铺',
            });
          }
          console.log(goods)
        }
      },
      //统一的值
      // 筛选的 数组 id 值 类型
      unify(list,id,val,type){
        console.log(list,id,val,type,'unify')
        let arr = []
        console.log(id,'id')
        list.forEach((item,index)=>{
          id.forEach((im,ix)=>{
            console.log(item.id,id[ix],'===',typeof item.id , typeof id[ix])
            if(item.id === id[ix]){
              console.log(item[val],'店铺')
              arr.push(item[val])
            }
          })
        })
        console.log(arr,'店铺国家')
        if(type == '1'){
          //记录选择的国家
          this.contrastCountry = arr[0]
          return this.isAllEqual(arr)
        }else if(type == '2'){
          if(id.length === arr.length){
            let num = 0
            arr.forEach((im,ix)=>{
              console.log('im',im,typeof im)
              if(im == '0.00'){
                num ++
              }
            })
            if(num == 0){
              return true
            }else{
              return false
            }
          }else{
            console.log('未填写')
            return false
          }
        }else if(type == '3'){
          if(id.length === arr.length){
            console.log('填写了值')
            let num = 0
            arr.forEach((im,ix)=>{
              if(im == '0'){
                num ++
              }
            })
            if(num == 0){
              return true
            }else{
              return false
            }
          }else{
            console.log('未填写')
            return false
          }
        }
      },
      isAllEqual(array) {
        console.log('isAllEqual','array',array)
        if (array.length > 0) {
            return !array.some(function(value, index) {
            return value !== array[0];
          });
        } else {
          return true;
        }
      },
      // 上架接口
      mwsToSellFn(id){
        this.mws_to_sell.goods_ids = id
        console.log(this.mws_to_sell,'mws_to_sell')
        mwsToSell(
         this.mws_to_sell 
        ).then(res =>{
          if(res.code === 0){
            this.getGoodsLists(this.info)
            Object.assign(this, {
              selectedRowKeys: [],
            })
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
            this.shelfLoading = false
          }else{
            this.shelfLoading = false
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      },
      // 下架
      soldOut(){
        if(this.screenType == '2' || this.screenType == '6'){
          if(this.selectedRowKeys.length >0){
            let goods = this.selectedRowKeys.join(',')
            if(this.unify(this.data,this.selectedRowKeys,'store_id','1')){
              if(this.unify(this.data,this.selectedRowKeys,'country','1')){
                //请求下架
                console.log('允许下架了')
                this.mwsSoldOutFn(goods)
              }else{
                this.$notification.error({
                  message: '错误',
                  description: '国家未统一请先筛选国家',
                });
              }
            }else{
              this.$notification.error({
                message: '错误',
                description: '店铺未统一请先筛选店铺',
              });
            }

          }else{
            this.$notification.error({
              message: '错误',
              description: '请先勾选上架的商品',
            });
          }
        }else{
          this.$notification.error({
            message: '错误',
            description: '已上架的商品才允许下架',
          });
        }
      },
      // 下架请求
      mwsSoldOutFn(id){
        this.sold_out.goods_ids = id
        mwsSoldOut(
          this.sold_out
        ).then(res =>{
          if(res.code === 0){
            Object.assign(this, {
              selectedRowKeys: [],
            })
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
          this.getGoodsLists(this.info) 
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      },
      //保存并更新
      updata(){
        console.log(this.selectedRowKeys.length,'length')
        if(this.selectedRowKeys.length > 0){
          let goods = this.selectedRowKeys.join(',')
          if(this.unify(this.data,this.selectedRowKeys,'store_id','1')){
              if(this.unify(this.data,this.selectedRowKeys,'country','1')){
                //请求下架
                console.log(this.selectManageAll,'ovee1')
                //筛选发送的数据
                this.filterAttribute(this.selectManageAll)
                console.log(this.updataInfo,'over2')
                // 请求更新并上架的接口
                // this.selectManageAll.forEach((item,index)=>{
                //   item.color = 'default'
                // })
                this.updataAndUploadFn()
              }else{
                this.$notification.error({
                  message: '错误',
                  description: '国家未统一请先筛选国家',
                });
              }
            }else{
              this.$notification.error({
                message: '错误',
                description: '店铺未统一请先筛选店铺',
              });
            }
        }else{
          this.$notification.error({
            message: '错误',
            description: '请先勾选上架的商品',
          });
        }
      },
      filterAttribute(value){
        this.updataInfo.goods_infos = []
     
        console.log(this.updataInfo,'updataInfo11',value)
        value.forEach((item,index)=>{
          let infos = {
            id:'',
            price:'',
            quantity:''
          }
          infos.id = item.id;
          infos.price = item.price;
          infos.quantity = item.quantity;
          this.updataInfo.goods_infos.push(infos)
          // this.updataInfo.goods_infos[index].id = item.id;
          // this.updataInfo.goods_infos[index].price = item.price;
          // this.updataInfo.goods_infos[index].quantity = item.quantity;
        })
        console.log(this.updataInfo,'updataInfo')
      },
      updataAndUploadFn(){
        updataAndUpload(
          this.updataInfo
        ).then((res)=>{
          if(res.code === 0){
            Object.assign(this, {
              selectedRowKeys: [],
            })
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
          this.getGoodsLists(this.info)
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      },
      //获取定时列表
      getTimerTitleFN(){
        getTimerTitle().then(res=>{
          if(res.code === 0){
            this.timerList = res.data
          }
        })
      },
      //编辑调价规则
      EditPrice(obj){
        this.editePriceData = obj
        this.getRuleData()
        this.editPriceVisible = true
      },
      editPriceOk(){
        setFollowRule({
          id:this.editePriceData.id,
          low_price:this.editPrice2,
          high_price:this.editPrice1,
          price_rule:this.priceRule,
        }).then((res)=>{
          if(res.code === 0){
            this.editPriceVisible = false
            this.screen("0")
          }
        })
      },
      editPriceCancel(){
        this.editPrice1 = ''
        this.editPrice2 = ''
        this.priceRule = ''
        this.editPriceVisible = false
      },
      //获取规则列表数据
      getRuleData(){
        getPriceRule({
          page:1,
          page_size:1000
        }).then((res)=>{
          if(res.code === 0){
            if(JSON.stringify( res.data)==="{}"){
              
            }else{
              this.ruleList = res.data
            }
          }
        })
      },
    },
    created(){
      this.getMyStoreFn()
      this.isChromeEB()
      this.getTimerTitleFN()
      if(Vue.ls.get('CHROME_ID')){
        this.chromeCode = Vue.ls.get('CHROME_ID')
        this.showChromeCode = false
      }else{
        this.showChromeCode = true
        this.chromeCode = this.GLOBAL.chrome.id
      }
      this.screen('2')
      this.getAllUserFn()
    },
    mounted(){},
    updated(){},
    destroyed(){},
    filters:{
      priceTlt(val){
        return '￥' + val
      }
    },

  }
</script>
<style lang="less" scpoed>
  .ml{margin-left:10px;}
  .tar{text-align: right;}
  .mr-sm{margin-right: 5px;}
  .list-link{
    color: #1890ff;

  }
  .cur{cursor:pointer;}
  .text-min{
    width:250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dis-flex{
    display:flex;
  }
  .flex-wrap{
    flex-wrap: wrap;
  }
  .highlight{
    color: #1890ff;
    font-weight: 800;
  }
 .default{
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
 } 
</style>