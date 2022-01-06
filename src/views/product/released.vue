<template>
  <div class="history">
    <a-card>
        <a-tabs @change="callback" type="card" v-model="activeKey">
          <a-tab-pane tab="产品发布" key="1">
            <a-card title='发布列表' class='mt'>
            <a-row>
              <a-col :md="20" :lg="20" :xl="21" :xxl="22">
                <a-row type='flex'>
                  <a-col class='ml' :md="6" :lg="7" :xl="6" :xxl="4">
                    <a-select  placeholder='请选择店铺'  style="width:100% " @change="shopchange" allowClear=true>
                      <a-select-option :value="item.id"  v-for='(item,index) in storeSelect' :key="index">{{item.title}}</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col class='ml' :md="6" :lg="7" :xl="6" :xxl="4">
                    <a-select  placeholder='请选择国家'  style="width:100% " @change="classchange" allowClear=true>
                      <!-- <a-select-option v-if='shopValue' :value="'all'" >全部</a-select-option> -->
                      <!-- <a-select-option :value="item.title"  v-for='(item,index) in siteSelect' :key="index">{{item.value}}</a-select-option> -->
                      <!-- <a-select-option :value="item.title"  v-for='(item,index) in siteSelect' :key="index">{{item.value}}</a-select-option> -->
                      <a-select-option :value="item.code"  v-for='(item,index) in siteSelect' :key="index">{{item.title}}</a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :md="4" :lg="7" :xl="10" :xxl="8">
                    <a-button class='ml' type='primary'  v-if='hasPerm(permsBtn.release_release)' @click='UploadTO' :loading="Uploading" :disabled="countDisabled" style="float:left">一键发布</a-button>
                    <a-button class='ml' type='primary'   v-if='hasPerm(permsBtn.release_export)'  @click='batchExport' :loading="Exportloading" style="float:left">批量导出</a-button>
                    <div v-show='setCountTime >= 1' style="color:#f9a100;float:left;margin-left:10px">{{this.countDownText}}</div>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :md="4" :lg="4" :xl="3" :xxl="2">
                <a-button type='danger' v-if='hasPerm(permsBtn.release_delAll)' icon="delete" @click='delReleasedAll'>批量删除</a-button>
              </a-col>
            </a-row>
          <!-- //列表  产品发布-->
          <a-row class='mt'>
            <!-- <a-col :span="24"> -->
            <a-table
              :scroll="{ x:1700 }"
              :dataSource="data"
              :loading="listLoading"
              :rowSelection="rowSelectionRelease"
              :pagination="false"
              rowKey="id">
              <a-table-column
                title="id"
                dataIndex="goods_id"
                width="100px"
              >
              </a-table-column>
              <a-table-column
                title="图片"
                width="100px"
              >
              <template slot-scope="text, record">
                <!-- <span style="width:70px; height:110px; overflow:hidden; display:block;line-height:110px;">
                  <img style='width:70px;' :src="record.image" alt="">
                </span> -->
                <a-popover v-show="record.image" placement="rightTop">
                  <template slot="content" style="width:200px">
                    <img style="width:200px" :src="record.image" alt="">
                  </template>
                  <a-button style="width:59px;position:relative;overflow:hidden;height:49px">
                    <img
                      style="width:58px; margin-left:-16px;margin-top:-2px"
                      :src="record.image"
                      alt="暂无订单信息"/>
                  </a-button>
                </a-popover>
              </template>
              </a-table-column>
              <a-table-column
                title="标题"
                dataIndex="title"
                width='450px'
              >
              </a-table-column>
              <a-table-column
                title="sku"
                dataIndex="sku"
              >
              </a-table-column>
              <a-table-column
                title="价格"
                dataIndex="price"
                width="120px"
              >
              <template  slot-scope="text, record">
                <span v-if='SelectCountry === "all" || SelectCountry ===""'>{{'￥' + record.c_price }}</span>
                <span v-else>{{countryLogo}} {{record.price}}</span>
              </template>
              </a-table-column>
              <!-- <a-table-column
                title="店铺"
                dataIndex="store_name"
                width="110px"
              >
              </a-table-column> -->
              <!-- <a-table-column
                title="分类"
                >
              <template slot-scope="text, record">
                <div v-for='(item,index) in record.categoryData' :key='index'>
                  {{"("+codeORcountry[item.country]+")"}} {{item.title}}
                </div>
              </template>
              </a-table-column> -->
              <!-- <a-table-column
                title="国家"
                dataIndex="buyer_name"
              >
              <template slot-scope="text, record">
                <span v-if='record.country==index' v-for='(item,index) in codeORcountry' :key='item'>{{record.country==index ? item:""}}</span>
              </template>
              </a-table-column> -->
              <a-table-column
                title="国家"
                dataIndex="buyer_name"
                width="150px"
              >
              <template slot-scope="text, record">
                <!-- <span>{{SelectCountry}}</span> -->
                <!-- <span v-if='record.p_country == index' v-for='(item,index) in codeORcountry' :key='item' >{{ record.p_country == index ? item : "" }}</span> -->
                <!-- <span  v-for='(item,index) in codeORcountry' :key='item'>{{SelectCountry == index ? item : ""}}</span> -->

                <div v-for='(value, key, index) in record.p_country' :key='index'>
                  {{ key ? "(" + codeORcountry[key] + ")" : '' }}
                  <span v-if='value == "0"'>未发布</span>
                  <span v-if='value == "1"'>已发布</span>
                  <span v-if='value == "2"'>不可发布</span>
                </div>
              </template>
              </a-table-column>
              <!-- <a-table-column
                title="状态"
                dataIndex="status"
              >
              </a-table-column> -->
              <a-table-column
                title="操作"
                width="220px"
              >
                <template slot-scope="text, record">
                  <span>
                    <a-row>
                      <a-col :span="12">
                        <a-button   type='primary'  :disabled='!hasPerm(permsBtn.release_edit)'   style="margin-left:10px"   @click='Edits(record.goods_id,record.platform)'>编辑</a-button>
                      </a-col>
                      <a-col :span="12">
                        <a-button  type='danger'  :disabled='!hasPerm(permsBtn.release_del)' style="margin-left:10px;" @click='delReleased(record.goods_id)'>删除</a-button>
                      </a-col>
                    </a-row>
                  </span>
                </template>
              </a-table-column>
            </a-table>
            <!-- </a-col> -->
          </a-row>
              <!--  -->
          <a-row v-if='data' class='mt' type="flex" justify="end">
            <a-col>
              <a-pagination
              :pageSizeOptions="pageSizeOption"
              v-model="current"
              showSizeChanger
              @showSizeChange="onShowSizeChange"
              :pageSize.sync="page.pageSize"
              @change='pagechange'
              :total='(page.pageSize*page.lastPage)' />
            </a-col>
          </a-row>
          <a-modal
            title="导出选项"
            :visible="exportshow"
            @ok="exportOk"
            :confirmLoading="modalsLoading"
            @cancel="handleCancelExport">
            <a-form-item
              label="标题前缀"
              :labelCol="labelCols"
              :wrapperCol="wrapperCols"
            >
              <a-input v-model="prefix" placeholder='统一标题前缀'></a-input>
            </a-form-item>
            <a-form-item
              label="品牌"
              :labelCol="labelCols"
              :wrapperCol="wrapperCols"
            >
              <a-input v-model="brand" placeholder='统一品牌'></a-input>
            </a-form-item>
            <div style="margin-left:80px;margin-bottom:10px;color:#ccc">(选择全部国家则可导出北美三国，澳大利亚，日本)</div>
            <a-row v-show='showWarning' type='flex' justify='center'>
              <a-col :span="18">
                <!-- <a-alert :message="ExTxt" type="warning" /> -->
                <div
                  v-show="item.failData.length > 0"
                  v-for="(item, index) in countryArr"
                  :key="index"
                  style="width: 295px; border: 1px solid #ccc; margin-left: 60px; border-radius: 3px; background: rgb(255,251,230); padding-left: 10px; margin-bottom:5px">
                  ID为:{{item.failData.join(',')}}&nbsp;&nbsp;{{item.countryName}}不可导出;信息填写不完整
                </div>
              </a-col>
            </a-row>
          </a-modal>
          <a-modal
            title="删除"
            :visible="visibles"
            @ok="handleOk"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel">
            <p>{{ModalText}}</p>
          </a-modal>
          <a-modal
            title="提示"
            :visible="uploadshow"
            @ok="uploadOk"
            :confirmLoading="uploadLoading"
            @cancel="uploadCancel">
            <p>{{uploadText}}</p>
          </a-modal>
          <a-modal
            title="导出选项"
            :visible="modals"
            @ok="exportOk"
            :confirmLoading="modalsLoading"
            @cancel="handleCancelExport">
            <a-form-item
              label="导出全部国家"
              :labelCol="labelCols"
              :wrapperCol="wrapperCols">
              <a-checkbox :checked="allCountrysState" @change="onChangeButton">全部</a-checkbox>
              <span v-show="allCountrysState">选择关闭，则可多选国家</span>
              <span v-show="!allCountrysState">点击勾选，则对全部国家生效</span>
            </a-form-item>
            <a-form-item
              label="选择导出国家"
              :labelCol="labelCols"
              :wrapperCol="wrapperCols"
              v-show="!allCountrysState">
              <a-select mode="multiple" placeholder="请选择" style="width:100% " @change="EXcountryChange" v-model="initialArr">
                <a-select-option :value="index"  v-for='(item,index) in codeORcountrys' :key='index'>{{item}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="标题前缀"
              :labelCol="labelCols"
              :wrapperCol="wrapperCols">
              <a-input v-model="prefix" placeholder='统一标题前缀'></a-input>
            </a-form-item>
            <a-form-item
              label="品牌"
              :labelCol="labelCols"
              :wrapperCol="wrapperCols">
              <a-input v-model="brand" placeholder='统一品牌'></a-input>
            </a-form-item>
            <a-row v-show='showWarning' type='flex' justify='center'>
              <a-col :span="18">
                <!-- <a-alert :message="ExTxt" type="warning" /> -->
                <div
                  v-show="item.failData.length > 0"
                  v-for="(item, index) in countryArr"
                  :key="index"
                  style="width: 295px; border: 1px solid #ccc; margin-left: 60px; border-radius: 3px; background: rgb(255,251,230); padding-left: 10px; margin-bottom:5px">
                  ID为:{{item.failData.join(',')}}&nbsp;&nbsp;{{item.countryName}}信息填写不完整，请确认是否导出
                </div>
              </a-col>
            </a-row>
          </a-modal>
        </a-card>
      </a-tab-pane>
      <a-tab-pane tab="发布历史" key="2">
        <a-card title='历史列表' class='mt'>
          <a-row>
            <a-col :md="12" :lg="10" :xl="8" :xxl="6">
              <a-button-group>
                <a-button :type='screenType ==="0" ? "primary":""'  @click='screen(" ","0")'>全部</a-button>
                <a-button  :disabled='!hasPerm(permsBtn.history_loding)'  :type='screenType ==="1" ? "primary":""' @click='screen("1")'>上传中</a-button>
                <a-button  :disabled='!hasPerm(permsBtn.history_success)' :type='screenType ==="2" ? "primary":""' @click='screen("2")'>上传成功</a-button>
                <a-button :disabled='!hasPerm(permsBtn.history_error)' :type='screenType ==="3" ? "primary":""' @click='screen("3")'>上传失败</a-button>
              </a-button-group>
            </a-col>
            <a-col :md="13" :lg="14" :xl="16" :xxl="18">
              <a-row type='flex' justify="end">
                <a-col :md="5" :lg="8" :xl="6" :xxl="4" class='ml' v-show='showUploadBtn === true'>
                  <a-select  placeholder='请选择店铺'  style="width:100%" @change="shopchangeHis" allowClear=true>
                    <a-select-option :value="item.id"  v-for='(item,index) in storeSelect' :key="index">{{item.title}}</a-select-option>
                  </a-select>
                </a-col>
                <a-col :md="5" :lg="8" :xl="6" :xxl="4" class='ml' v-show='showUploadBtn === true'>
                  <a-select  placeholder='请选择国家'  style="width:100%" @change="classchangeHis" allowClear=true>
                    <!-- <a-select-option v-if='shopValueHis' :value="'all'" >全部</a-select-option> -->
                    <a-select-option :value="item.code"  v-for='(item,index) in siteSelectHis' :key="index">{{item.title}}</a-select-option>
                  </a-select>
                </a-col>
                <a-col  v-if='hasPerm(permsBtn.history_updata)'  :md="7" :lg="5" :xl="4" :xxl="2" v-show='showUploadBtn === true'>
                  <a-button class='ml' type='primary' @click='uploadOnekey' :loading='Uploading' :disabled="countDisabledHis">一键上传</a-button>
                </a-col>
                <div v-show='setCountTimeHis >= 1' style="color:#f9a100;float:right;margin-left:10px">{{this.countDownTextHis}}</div>
              </a-row>
            </a-col>
          </a-row>
          <!-- //列表  发布历史-->
          <a-row class='mt'>
            <!-- <a-col :span="24"> -->
            <a-table :scroll="{ x: 1700 }" :loading="listLoading" :dataSource="dataRecord" :rowSelection="rowSelectionHistory" :pagination="false" rowKey="id">
              <a-table-column
                title="id"
                dataIndex="goods_id"
                width="100px"
              >
              </a-table-column>
                <a-table-column
                  title="图片"
                  width="100px"
                >
                  <template slot-scope="text, record">
                    <!-- <span style="width:70px; height:110px; overflow:hidden; display:block;line-height:110px;">
                      <img style='width:70px;' :src="record.image" alt="">
                    </span> -->
                    <a-popover v-show="record.image" placement="rightTop">
                      <template slot="content" style="width:200px">
                        <img style="width:200px" :src="record.image" alt="">
                      </template>
                      <a-button style="width:59px;position:relative;overflow:hidden;height:49px">
                        <img
                          style="width:58px; margin-left:-16px;margin-top:-2px"
                          :src="record.image"
                          alt="暂无订单信息"/>
                      </a-button>
                    </a-popover>
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
                  title="价格"
                  dataIndex="price"
                  width="120px"
                >
                  <template  slot-scope="text, record">
                    <span v-if='SelectCountryHis'>{{countryLogoHis}} {{record.price}}</span>
                    <span v-else>{{"￥"}} {{record.price}}</span>
                  </template>
                </a-table-column>
                <!-- <a-table-column
                  title="店铺"
                  dataIndex="store_name"
                  width="110px"
                >
                </a-table-column> -->
                <a-table-column
                  title="国家"
                  dataIndex="buyer_name"
                  width="120px"
                >
                <template slot-scope="text, record">
                  <!-- <span  v-for='(item,index) in codeORcountry' :key='item'>{{SelectCountry===index ? item : ""}}</span> -->
                  <!-- <span  v-for='(item,index) in codeORcountry' :key='item' v-if='record.p_country == index'>{{record.p_country == index ? item : ""}}</span> -->
                  <div> {{ codeORcountry[record.country] }} </div>
                </template>
                </a-table-column>
                <a-table-column
                    title="创建时间"
                    dataIndex="create_time"
                    width="120px"
                  >
                </a-table-column>
                <a-table-column
                  title="状态"
                  dataIndex="status"
                  width="120px"
                >
                <template slot-scope="text, record">
                  <div v-if='record.endResult === "1"'>上传中</div>
                  <div v-if='record.endResult === "2"'>上传成功</div>
                  <div v-if='record.endResult === "3"'>上传失败
                  <a-popover title="上传失败原因" v-if='record.endResult === "3"' >
                    <template slot="content" >
                      <div class='alert-box' >
                        <a-alert class='mb' v-if='record.base_error_message' :message='record.base_error_message' type="warning" style='width:400px;' />
                        <a-alert class='mb' v-if='record.image_error_message' :message='record.image_error_message' type="warning" style='width:400px;' />
                        <a-alert class='mb' v-if='record.quantity_error_message' :message='record.quantity_error_message' type="warning" style='width:400px;' />
                        <a-alert class='mb' v-if='record.price_error_message' :message='record.price_error_message' type="warning" style='width:400px;' />
                      </div>
                    </template>
                    <a-icon type="question-circle"/>
                  </a-popover>
                  </div>
                </template>
                </a-table-column>
                <a-table-column
                  title="操作"
                  width="220px"
                >
                  <template slot-scope="text, record">
                    <span>
                      <a-row>
                        <a-col  v-if='record.endResult !== "1"' :span="12">
                          <a-button  type='primary'  style="margin-left:10px"   @click='Edits(record.top_goods_id,record.platform)' >编辑</a-button>
                        </a-col>
                        <!-- <a-col :span="12">
                          <a-button  type='danger' style="margin-left:10px;" @click='delReleased(record.goods_id)'>删除</a-button>
                        </a-col> -->
                      </a-row>
                    </span>
                  </template>
                </a-table-column>
              </a-table>
            <!-- </a-col> -->
          </a-row>
          <a-row v-if='data' class='mt' type="flex" justify="end">
            <a-col>
              <a-pagination v-model="currentRE" @change='pagechangeRE' :pageSize='pageRE.pageSize' :total='(pageRE.pageSize*pageRE.lastPage)' />
            </a-col>
          </a-row>
        </a-card>
      </a-tab-pane>
     </a-tabs>
   </a-card>
  </div>
</template>
<script>
import Vue from 'vue';
import { country_list, exportList, publishList ,deletePublish , uploadPublisGoods , uploadResult ,getMyStore ,uploadPublish,countDown,ExportCheck} from '@/api/collect'
import { codeORcountry , codeORcountrys, currencyList} from '@/views/order/public/country'
import { constants } from 'crypto';
import { CountDown } from '../../components';
import { permsBtn } from '@/utils/static'
import { ACCESS_TOKEN} from '@/store/mutation-types'
export default {
  name:"released",
  data(){
    return{
      permsBtn,
      codeORcountry,
      codeORcountrys,
      currencyList,
      queryParam:{
        status:"0",
        logistics:"0",
        orderNumber:"",
      },
      pageSizeOption:[10,20,40,60,80,100,200],
      queryStatus:"请输入订单号",
      ScreeningOrder:"0",
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 8 } },
      labelCols: { lg: { span: 6 }, sm: { span: 6 } },
      wrapperCols: { lg: { span: 15 }, sm: { span: 13 } },
      visibles:false,
      uploadshow:false,
      exportshow:false,
      ModalText:"确定要删除吗",
      uploadText:"您即将提交上传商品，十分钟后可以再次提交上传",
      confirmLoading:false,
      uploadLoading:false,
      listLoading: false,
      treeData:"",
      Selectvalue:"",
      orderid:"",
      data:"",
      page:"",
      current:1,
      selectAll:"",
      queryState:false,
      SelectCountry:"",
      delId:"",
      selectkey:"",
      UploadId:"",
      dataRecord:"",
      pageRE:"",
      currentRE:1,
      queryState:false,
      selectAllHistory:"",
      selectkeyHistory:"",
      storeSelect:"",
      siteSelect:[],
      siteSelectTwo:"",
      shopValue:"",
      activeKey:"1",
      shopValueHis:"",
      siteSelectHis:"",
      SelectCountryHis:"",
      SelectCountryHisType:'',
      UploadIdHis:"",
      showUploadBtn:false,
      countryLogo:"",
      countryLogoHis:"￥",
      condition:"",
      upType:"",
      selectedRowKeys:[],
      selectedRowKeysHis:[],
      screenType:"0",
      loading: false,
      publishObj:"",
      publishObjHistory:"",
      objClone:"",
      copyListHis:"",
      objCloneHis:"",
      copyList:"",
      upLoading:false,
      classValue: '',
      countDisabled: false,
      countDisabledHis: false,
      Exportloading: false,
      prefix:"",
      brand:"",
      ManageLoading: false,
      showWarning:false,
      countryArr: [],
      goods_id: '',
      modalsLoading: false,
      classValueType:"",
      setCountTime: '',
      setCountTimeHis: '',
      countDownText:'',
      countDownTextHis:'',
      countrySelect:"",
      Noexport:[],
      Noexports:"",
      modals:false,
      initialArr: [],
      EXcountryValue:false,
      allCountrysState:false,
      idManege:"",
      EXids:"",
    }
  },
    computed: {
     rowSelectionRelease() {
        const { selectedRowKeys } = this;
        return {
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRowes) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, '产品发布: ', selectedRowes);
            this.selectAll = selectedRowes;
            this.selectkey = selectedRowKeys;
            this.selectedRowKeys = selectedRowKeys; // 上传后勾选去掉
            console.log(this.selectedRowKeys);
          },
          getCheckboxProps: record => ({
            props: {
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }
          }),
        }
      },
      rowSelectionHistory() {
        const { selectedRowKeys } = this;
        return {
          selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRowKeys,selectedRows,"---------------------")
            this.selectAllHistory = selectedRows
            this.selectkeyHistory = selectedRowKeys
            this.selectedRowKeys = selectedRowKeys
            console.log(`selectAllHistory: ${this.selectAllHistory}`, '发布历史: ', this.selectkeyHistory);
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
  created(){
      if(this.setCountTime > 0) {
      this.countDisabled = true
    } else if(this.setCountTime <= 0){
      this.countDisabled = false
    }else if(this.setCountTimeHis > 0) {
      this.countDisabledHis = true
    }else{
      this.countDisabledHis = false
    }
  },
  mounted(){
    this.getpublishList()
    this.getMyStores()
    // this.getCountryList();
    this.screenType = "0"
    if(Vue.ls.get('countDesInfoShopValue',) && Vue.ls.get('countDesInfoShopValue').length > 0){
      console.log(Vue.ls.get('countDesInfoShopValue'), '8888')
      this.shopValue = Vue.ls.get('countDesInfoShopValue')
      this.classValueType = Vue.ls.get('countDesInfoClassValueType')
      this.getCountDown(Vue.ls.get('countDesInfoShopValue'),Vue.ls.get('countDesInfoClassValueType'))
    }if(Vue.ls.get('countDesInfoShopValueHis',) && Vue.ls.get('countDesInfoShopValueHis').length > 0){
      this.shopValueHis = Vue.ls.get('countDesInfoShopValueHis')
      this.SelectCountryHisType = Vue.ls.get('countDesInfoSelectCountryHisType')
      this.getCountDownHis(Vue.ls.get('countDesInfoShopValueHis'),Vue.ls.get('countDesInfoSelectCountryHisType'))
    }
  },
  updated(){},
  destroyed(){
    // this.$store.dispatch('setCountTime', 0, false)
  },
  methods:{
    //获取国家列表
    getCountryList(){
      let _this = this
      _this.countrySelect =[]
      country_list({
        type:1
      }).then((res)=>{
        if(res.code === 0){
          if(res.data.NA){
            res.data.NA.forEach(function(country){
              _this.countrySelect.push({
                title:country.code,
                value:country.title
              })
            })
          }
          if(res.data.EU){
            res.data.EU.forEach(function(country){
              _this.countrySelect.push({
                title:country.code,
                value:country.title
              })
            })
          }
          if(res.data.FE){
            res.data.FE.forEach(function(country){
              _this.countrySelect.push({
                title:country.code,
                value:country.title
              })
            })
          }
        }
      })
    },
    // 获取订单列表
    getpublishList(pagesize,shop,country){
      console.log(this.codeORcountry)
      this.listLoading = true
      if(country ==='all'){
        publishList({
          page_size:pagesize,
          page:this.current,
          store_id:shop
        }).then(res =>{
          if(res.code === 0){
            this.listLoading = false
            if(res.data.length){
              this.data = res.data;
              console.log(this.data)
            }else{
              this.data = [];
            }
            this.page = res.pages
          }else{
            this.listLoading = false
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      }else{
        publishList({
          page_size:pagesize,
          page:this.current,
          country:country,
          store_id:shop
        }).then(res =>{
          if(res.code === 0){
            this.listLoading = false
            if(res.data.length){
              this.data = res.data;
              console.log(this.data)
              this.data.forEach((item, index) => {

              })
            }else{
              this.data = [];
            }
            this.page = res.pages

          }else{
            this.listLoading = false
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      }
    },
    // 获取国家和店铺信息
    getMyStores(){
      getMyStore({
        page_type:"mws_upload"
      }).then((res)=>{
        if(res.code === 0){
          this.storeSelect = res.data
          console.log(this.storeSelect)
        }
      })
    },
    shopchange(val){
      // this.siteSelect.splice(0)
      this.shopValue = val
      console.log("this.shopValue",'店铺',this.shopValue,this.SelectCountry)
      this.storeSelect.forEach((item,index) => {
        if(val === item.id){
          // this.siteSelectTwo = item.mws_site
          this.siteSelect = item.mws_site
          // this.siteSelect.push({ title: 'All',value: '全部国家' })
          // item.mws_site.forEach((item1,index1) => {
          //   this.siteSelect.push(item1)
          // })
          console.log(this.siteSelect,"siteSelect——ChangeStore")
        }
      })
    this.getpublishList('10',this.shopValue,this.SelectCountry)
    console.log(this.shopValue)
    },

    UploadTO(){
      // this.loading = true
      console.log(this.selectAll,'over')
      if(this.shopValue){
        if(this.SelectCountry){
          if(this.selectAll.length>0){
            let str = '';
            for(var i = 0 ;i < this.selectAll.length ; i++){
              str += (this.selectAll[i].goods_id + ',')
            }
            this.UploadId = str.slice(0,-1)
            this.uploadshow = true
            this.upType = "UploadTO"
            console.log(this.selectAll,"ovee")
              this.copyList = JSON.stringify(this.selectAll),
              this.objClone = JSON.parse(this.copyList);
              this.objClone.forEach((item,index)=>{
                Object.keys(item).forEach((im,ix)=>{
                  if(im !=='goods_id' && im !=='p_country' ){
                    delete item[im];
                  }
                })
              })
            this.publishObj = this.objClone;
            console.log(this.publishObj,'publishObj',this.objClone)
          }else{
            this.loading = false
            this.$notification.error({
              message: '错误',
              description: '请先勾选上传的选项',
            });
          }
        }else{
          this.loading = false
          this.$notification.error({
            message: '错误',
            description: '请先选择国家',
          });
        }
      }else{
        this.loading = false
        this.$notification.error({
          message: '错误',
          description: '请先选择店铺',
        });
      }
    },
    // 批量导出
    // batchExport() {
    //   if(this.shopValue){
    //     // console.log(this.shopValue)
    //     let goodIdArr = [];
    //     if(this.SelectCountry){
    //       console.log(this.SelectCountry)
    //       console.log(this.selectAll)
    //       if(this.selectAll.length > 0){
    //         console.log(this.selectAll)
    //         this.exportshow = true
    //         if(this.classValue == 'all') {
    //           var arrCodeORcountrys = []
    //           // 循环对象 ES5 增加了 Object.keys 方法，直接获取对象自己的所有键，返回数组：
    //           arrCodeORcountrys = Object.keys(this.codeORcountry)
    //           arrCodeORcountrys.shift()
    //           console.log(arrCodeORcountrys, 'super')
    //           this.EXcountryValue = arrCodeORcountrys.join(",")
    //           console.log(this.EXcountryValue)
    //         } else {
    //           this.EXcountryValue = this.classValue
    //         }
    //         this.selectAll.forEach((item,index) => {
    //           goodIdArr.push(item.goods_id)
    //         })
    //         this.goods_id = goodIdArr.join(',')
    //         ExportCheck({
    //           country:this.EXcountryValue,
    //           ids:this.goods_id
    //         }).then(res=>{
    //           if(res.code === 0){
    //             if(res.data.length > 0){
    //               this.countryArr = res.data
    //               this.showWarning = true
    //             }else{
    //               this.showWarning = false
    //             }
    //           }
    //         })
    //       }else{
    //         this.$notification.error({
    //           message: '错误',
    //           description: '请先勾选上传的选项',
    //         });
    //       }
    //     }else{
    //       this.$notification.error({
    //         message: '错误',
    //         description: '请先选择国家',
    //       });
    //     }
    //   }else{
    //     this.$notification.error({
    //       message: '错误',
    //       description: '请先选择店铺',
    //     });
    //   }
    // },
    batchExport(){
      this.showWarning = false
      if(this.selectAll.length > 0){
        this.Noexport = []
        this.selectAll.forEach((item,index)=>{
          if(item.status === '0'){
            this.Noexport.push(item.id)
          }
        })
        this.Noexports = this.Noexport.join("  ")
        this.modals = true
      }else{
        this.$notification.error({
          message: '错误',
          description: '请先勾选导出的选项',
        });
      }
    },
    // 导出确认
    // exportOk() {
    //   this.modalsLoading = true;
    //   this.exportpost()
    //   setTimeout(() => {
    //     this.modalsLoading = false;
    //   }, 1000);
    //   // this.initialArr = []
    //   this.selectedRowKeys = []
    //   // this.allCountrysState = false
    //   this.selectAll = []
    //   this.countryArr = []
    //   this.exportshow = false
    //   this.EXcountryValue = false
    //   this.prefix = ''
    //   this.brand = ''
    // },
    exportOk(){
      this.modalsLoading = true;
      this.exportpost()
      setTimeout(() => {
        this.modals = false;
        this.modalsLoading = false;
      }, 1000);
      this.initialArr = []
      this.selectedRowKeys = [];
      this.EXcountryValue = false
      this.allCountrysState = false
    },
    //导出请求
    exportpost(){
      const token = Vue.ls.get(ACCESS_TOKEN)
      if(this.selectAll){
        let str = '';
        for(var i = 0 ;i < this.selectAll.length ; i++){
          str += (this.selectAll[i].goods_id + '-')
        }
        this.idManege = str.slice(0, -1)
      }
      exportList({
        country:this.EXcountryValue,
        ids:this.idManege,
        titlePrefix:this.prefix,
        brandName:this.brand
      }).then((res)=>{
        if(res.code === 0){
          // 商品导出
          res.data.fileArr.forEach((item,index) => {
            window.open(this.GLOBAL.BASE_URL + item , '_blank')
          })
          this.selectedRowKeys = [];
          this.EXcountryValue = false
          this.allCountrysState = false
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
        }else{
          this.selectedRowKeys = [];
          this.EXcountryValue = false
          this.allCountrysState = false
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
    },
    handleCancelExport(e) {
      // this.initialArr = []
      // this.selectedRowKeys = []
      // // this.allCountrysState = false
      // this.selectAll = []
      // this.countryArr = []
      // this.exportshow = false
      // this.EXcountryValue = false
      // this.prefix = ''
      // this.brand = ''

      this.modals = false
      this.initialArr = []
      this.selectedRowKeys = [];
      this.selectAll = []
      this.EXcountryValue = false
      this.allCountrysState = false
    },
    onChangeButton(checked) {
      if(!this.allCountrysState) {
        var arrCodeORcountrys = []
        // 循环对象 ES5 增加了 Object.keys 方法，直接获取对象自己的所有键，返回数组：
        arrCodeORcountrys = Object.keys(codeORcountrys)
        this.EXcountryValue = arrCodeORcountrys.join(",")
        let str='';
        for(var i = 0 ;i < this.selectAll.length ; i++){
          str += (this.selectAll[i].id + ',')
        }
        this.EXids = str.slice(0,-1);
        ExportCheck({
          country:this.EXcountryValue,
          ids:this.EXids
        }).then(res=>{
          if(res.code === 0){
            if(res.data.length > 0){
              this.countryArr = res.data
              this.showWarning = true
            }else{
              this.showWarning = false
            }
          }
        })
      }else {
        this.EXcountryValue = ''
        this.countryArr = []
      }
      this.allCountrysState = !this.allCountrysState
    },
    // change 导出国家选项
    EXcountryChange(value){
      this.EXcountryValue = value.join(",")
      let str='';
      for(var i = 0 ;i < this.selectAll.length ; i++){
        str += (this.selectAll[i].id + ',')
      }
      this.EXids = str.slice(0,-1);
        ExportCheck({
          country:this.EXcountryValue,
          ids:this.EXids
        }).then(res=>{
          if(res.code === 0){
            if(res.data.length > 0){
              this.countryArr = res.data
              this.showWarning = true
            }else{
              this.showWarning = false
            }
          }
        })
    },
    // 导出请求
    // exportpost() {
    //   exportList({
    //     country:this.EXcountryValue,
    //     ids:this.goods_id,
    //     titlePrefix:this.prefix,
    //     brandName:this.brand
    //   }).then((res)=>{
    //     if(res.code === 0){
    //       // 商品导出
    //       //this.GLOBAL.BASE_URL
    //       res.data.fileArr.forEach((item,index) => {
    //         // console.log(item, 'item')
    //         window.open(this.GLOBAL.BASE_URL + item , '_blank')
    //       })
    //       this.$notification.success({
    //         message: '成功',
    //         description: res.msg,
    //       });
    //     }else{
    //       this.$notification.error({
    //         message: '错误',
    //         description: res.msg,
    //       });
    //     }
    //   })
    // },
    // 一键发布 产品发布的 UploadTO
    toupload(){
      uploadPublisGoods({
        goods_list:this.publishObj,
        store_id:this.shopValue,
        publish_type:"1"
      }).then(res=>{
        if(res.code === 0){
          this.selectedRowKeys = [];
          this.loading = false
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
          this.activeKey = '2'
          this.getuploadResult('10')
          this.Uploading = false
          if(this.classValue == 'all') {
           this.classValueType = 1
          }else {
            this.classValueType = 0
          }
          this.getCountDown(this.shopValue,this.classValueType)
        }else{
          if(this.classValue == 'all') {
           this.classValueType = 1
          }else {
            this.classValueType = 0
          }
          this.getCountDown(this.shopValue,this.classValueType)
          this.loading = false
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
          this.Uploading = false
        }
      })
    },
    getCountDown(shopValue,classValueType){
      console.log("执行次数")
      countDown({
        store_id: shopValue,
        all_country: classValueType
      }).then(res => {
        if(res.code === 0) {
          console.log("执行前")
          console.log(typeof (res.data.next_time),"type")
          if(res.data.next_time === 0){
            Vue.ls.remove("countDesInfoShopValue")
            Vue.ls.remove("countDesInfoClassValueType")
            this.countDisabled = false
          }else{
            this.runCountTime(res.data.next_time * 60)
            Vue.ls.set("countDesInfoShopValue",this.shopValue)
            Vue.ls.set("countDesInfoClassValueType",this.classValueType)
            this.countDisabled = true
          }
          this.selectedRowKeys = []
        }else{
        }
      })
    },
    runCountTime(countTime) {
      let obj = null
      var intervals = setInterval(() => {
        countTime--;
        if (countTime > 0) {
          let min = parseInt(countTime / 60)
          let sec = parseInt(countTime % 60 % 60)
          min = min < 10 ? '0' + min : min;
          sec = sec < 10 ? '0' + sec : sec;
          obj = {
            min: min,
            sec: sec
          }
          this.countDownText = obj.min + '分' + obj.sec + '秒后，可再次发布'
          console.log(countTime, "qwe")
          this.countDisabled = true
        } else {
          console.log('清除计时器前', intervals)
          clearInterval(intervals);
          this.countDisabled = false
          Vue.ls.remove("countDesInfoShopValue")
          Vue.ls.remove("countDesInfoClassValueType")
        }
        this.setCountTime = countTime
      }, 1000)
    },

    // 切换 发布历史 **************************************
    callback(key){
      if(key==='2'){
        this.getuploadResult('10');
        this.screenType = '0'
      }
    },
    shopchangeHis(val){
      this.shopValueHis = val
      console.log("历史的","this.shopValueHis",this.shopValueHis)
      this.storeSelect.forEach((item,index)=>{
        if(val === item.id){
          this.siteSelectHis= item.mws_site
        }
      })
      this.getuploadResult('10',this.shopValueHis,this.SelectCountryHis,this.condition)
      console.log(this.siteSelectHis,"siteselectHis")
    },
    classchangeHis(value){
      console.log("his")
      this.selectedRowKeys = []
      this.selectAllHistory = []
      this.SelectCountryHis = value
      console.log(this.SelectCountryHis,"历史国家",'SelectCountryHis')
       this.getuploadResult('10',this.shopValueHis,this.SelectCountryHis,this.condition)
       console.log(this.selectedRowKeys,'selectedRowKeys')
        this.currencyList.forEach((item,index) =>{
        if(item.id === this.SelectCountryHis){
          this.countryLogoHis = item.logo
        }
      })
      console.log(this.selectedRowKeys,"asd")

    },
    //一键上传  发布历史的一键上传
    uploadOnekey(){
      console.log(this.selectAllHistory,'oveee')
      if(this.shopValueHis){
        if(this.SelectCountryHis){
          if(this.selectAllHistory.length>0){
            let str = '';
            for(var i = 0 ;i < this.selectAllHistory.length ; i++){
              str += (this.selectAllHistory[i].id + ',')
            }
            this.UploadIdHis = str.slice(0,-1)
            console.log(this.SelectCountryHis ,"UploadIdHis" ,this.UploadIdHis)
              this.uploadshow = true
              this.upType = "uploadOnekey"
              this.copyListHis = JSON.stringify(this.selectAllHistory),
              this.objCloneHis = JSON.parse(this.copyListHis);
              this.objCloneHis.forEach((item,index)=>{
                Object.keys(item).forEach((im,ix)=>{
                  if(im !=='goods_id' && im !=='country' ){
                    delete item[im];
                  }
                  if(im =='country'){
                    item['p_country'] = item[im]
                    delete item[im];
                  }
                })
              })
            this.publishObjHistory = this.objCloneHis;
            }else{
              this.$notification.error({
                message: '错误',
                description: '请先勾选上传的选项',
              });
          }
        }else{
          this.$notification.error({
            message: '错误',
            description: '请先选择国家',
          });
        }
      }else{
        this.$notification.error({
          message: '错误',
          description: '请先选择店铺',
        });
      }
    },
    // 获取发布历史列表
    getuploadResult(pagesize,shop,country,status){
      this.listLoading = true
      if(country === 'all'){
        uploadResult({
          page_size:pagesize,
          page:this.currentRE,
          store_id:shop,
          status:status,
        }).then(res =>{
          if(res.code === 0){
            this.listLoading = false
            if(res.data.length > 0){
              this.dataRecord = res.data
            }else{
              this.dataRecord = []
            }
          this.pageRE = res.pages
          }else{
            this.listLoading = false
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      }else{
      uploadResult({
        page_size:pagesize,
        page:this.currentRE,
        store_id:shop,
        country:country,
        status:status,
      }).then(res =>{
        if(res.code === 0){
          this.listLoading = false
          if(res.data.length > 0){
            this.dataRecord = res.data
          }else{
            this.dataRecord = []
          }
        this.pageRE = res.pages
        }else{
          this.listLoading = false
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })
      }

    },
    screen(condition,condition1){
      if(condition !=='3'){
        this.getuploadResult('10','','',condition)
      }else{
        this.getuploadResult('10',this.shopValueHis,this.SelectCountryHis,condition)
      }
      this.condition = condition;
      if(condition === '3'){
        this.showUploadBtn = true
      }else{
        this.showUploadBtn = false
      }
      if(condition1 ==='0'){
        this.screenType = '0'
      }else if(condition ==='1'){
        this.screenType = '1'
      }else if(condition ==='2'){
        this.screenType = '2'
      }else if(condition ==='3'){
        this.screenType = '3'
      }
    },
    // 产品发布 分页
    pagechange(page,pagesize){
      this.current = page;
      this.getpublishList(pagesize,this.shopValue,this.SelectCountry)
    },

    onShowSizeChange(current, pageSize) {
      this.getpublishList(pageSize,this.shopValue,this.SelectCountry)
    },
    Edits(id,site){
      this.$router.push({
        path:"/product/manage/goodedit",
        query:{
          id:id,
          site:'amazon',
          type:0
        }
      })
    },
    // 产品记录 分页
    pagechangeRE(page,pagesize){
      this.currentRE = page;
      console.log(page)
      this.getuploadResult(pagesize,this.shopValueHis,this.SelectCountryHis,this.condition)
    },
    // 选择国家
    classchange(value){
      this.selectedRowKeys = []
      this.publishObj = []
      this.selectAll = []
      console.log(value,"SelectCountry")
      this.classValue = value
      // if(value == 'All') {
      //   let str = ''
      //   this.siteSelectTwo.forEach((item, index) => {
      //     str += (item.title + ',')
      //   })
      //   this.SelectCountry = str
      //   console.log(this.SelectCountry)
      //   this.getpublishList('10', this.shopValue, this.SelectCountry)
      // } else {
        this.SelectCountry = value
        this.getpublishList('10',this.shopValue,this.SelectCountry)
        this.currencyList.forEach((item,index) =>{
          if(item.id === this.SelectCountry){
            this.countryLogo = item.logo
          }
        })
      // }
    },
    // 删除 待发布信息
    delReleased(id){
      this.visibles = true
      this.delId=id
    },
    delReleasedAll(){
      console.log(this.selectAll)
      if(this.selectAll){
        let str = '';
        for(var i = 0 ;i < this.selectAll.length ; i++){
          str += (this.selectAll[i].goods_id + ',')
        }
        this.delId = str.slice(0,-1)
        this.visibles = true
        }else{
          this.$notification.error({
            message: '错误',
            description: '请先勾选删除的选项',
          });
        }
    },
    handleCancel(e) {
      this.visibles = false
    },
    handleOk(){
      //删除的操作
      this.delRel()
      this.confirmLoading = true;
      setTimeout(() => {
        this.visibles = false;
        this.confirmLoading = false;
      }, 800);
    },
    uploadOk(){
      // 上传的操作  UploadTO uploadOnekey
      this.Uploading = true ;
      if(this.upType === 'UploadTO'){
        this.toupload()
      }else if(this.upType === 'uploadOnekey'){
        this.oneKeyUploadPublish()
      }
      this.uploadLoading = true
      setTimeout(() => {
        this.uploadshow = false;
        this.uploadLoading = false;
      }, 800);
    },
    // 一键发布 发布历史的
    oneKeyUploadPublish(){
      console.log('id',this.shopValueHis,"country",this.publishObjHistory,'oooo')
      uploadPublisGoods({
        goods_list:this.publishObjHistory,
        store_id:this.shopValueHis,
        publish_type:"2"
      }).then(res=>{
        if(res.code === 0){
          this.$notification.success({
            message: '成功',
            description: res.msg,
          });
          this.Uploading = false
          if(this.SelectCountryHis == 'all') {
            this.SelectCountryHisType = 1
          }else {
            this.SelectCountryHisType = 0
          }
          this.getCountDownHis(this.shopValueHis,this.SelectCountryHisType)
          this.getuploadResult('10',this.shopValueHis,this.SelectCountryHis,this.condition)
        } else{
          if(this.SelectCountryHis == 'all') {
            this.SelectCountryHisType = 1
          }else {
            this.SelectCountryHisType = 0
          }
          this.getCountDownHis(this.shopValueHis,this.SelectCountryHisType)
          this.Uploading = false
          this.$notification.error({
            message: '错误',
            description: res.msg,
          });
        }
      })

    },
    getCountDownHis(shopValueHis,SelectCountryHisType){
      console.log("执行次数")
      countDown({
        store_id: shopValueHis,
        all_country: SelectCountryHisType
      }).then(res => {
        if(res.code === 0) {
          console.log("执行前")
          console.log(typeof (res.data.next_time),"type")
          if(res.data.next_time === 0){
            Vue.ls.remove("countDesInfoShopValueHis")
            Vue.ls.remove("countDesInfoSelectCountryHisType")
            this.countDisabledHis = false
          }else{
            this.runCountTimeHis(res.data.next_time * 60)
            Vue.ls.set("countDesInfoShopValueHis",this.shopValueHis)
            Vue.ls.set("countDesInfoSelectCountryHisType",this.SelectCountryHisType)
            this.countDisabledHis = true
          }
          this.selectedRowKeys = []
        }else{
        }
      })
    },
    runCountTimeHis(countTime) {
      let obj = null
      var Intervalss = setInterval(() => {
        countTime--;
        if (countTime > 0) {
          let min = parseInt(countTime / 60)
          let sec = parseInt(countTime % 60 % 60)
          min = min < 10 ? '0' + min : min;
          sec = sec < 10 ? '0' + sec : sec;
          obj = {
            min: min,
            sec: sec
          }
          this.countDownTextHis = obj.min + '分' + obj.sec + '秒后，可再次上传'
          console.log(countTime, "qwe")
          this.countDisabledHis = true
        } else {
          console.log('清除计时器前', Intervalss)
          clearInterval(Intervalss);
          this.countDisabledHis = false
          Vue.ls.remove("countDesInfoShopValueHis")
          Vue.ls.remove("countDesInfoSelectCountryHisType")
        }
        this.setCountTimeHis = countTime
      }, 1000)
    },
    uploadCancel(){
      this.uploadshow = false;
      // this.selectedRowKeysHis = []
    },
    delRel(){
     deletePublish({
       goods_id:this.delId
     }).then(res=>{
       if(res.code === 0){
        this.$notification.success({
          message: '成功',
          description: res.msg,
        });
        this.getpublishList('10',this.shopValue,this.SelectCountry)
       }else{
        this.$notification.error({
            message: '错误',
            description: res.msg,
          });
       }
     })
    },
  },
  filters:{
    priceTlt(val){
      if(val){
        vm.currencyList.forEach((item,index) =>{
          console.log(item)
          if(item.id === vm.SelectCountry){
            return item.logo + "" + val
          }
        })
      }else{
        return ''
      }
    }
  }
}
</script>
<style scoped lang='less'>
  .mt{margin-top: 20px;}
  .mr{margin-right: 20px;}
  .mb{margin-bottom:20px;}
  .mt-xl{margin-top:40px;}
  .title-size{
    font-size:14px;
    color: #000;
  }
  .alert-box{
    min-height: 100px;
    overflow-y:scroll;
  }
</style>
