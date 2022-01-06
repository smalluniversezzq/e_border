<template>
  <div class="history">
    <a-row style="margin-bottom:20px">
      <a-col :md="5" :lg="8" :xl="6" :xxl="4" class="">
        <a-select placeholder="请选择店铺" style="width:100%" @change="shopchangeHis">
          <a-select-option :value="item.id" v-for="(item,index) in storeSelect" :key="index">{{ item.title }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :md="5" :lg="8" :xl="6" :xxl="4" class="ml">
        <a-select placeholder="请选择国家" style="width:100%" @change="classchangeHis">
          <a-select-option :value="item.code" v-for="(item,index) in siteSelectHis" :key="index">{{ item.title }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col v-if="hasPerm(permsBtn.history_updata)" :md="7" :lg="5" :xl="4" :xxl="2" v-show="showUploadBtn === true">
        <a-tooltip>
          <template slot="title">
            <!-- 上传亚马逊有频率限制，建议编辑完后统一提交发布，不要单个商品发布,
            <b>一小时大约能上传6次。</b> -->
            由于亚马逊接收有频率限制，一小时内大约能点击6次一键上传（超出次数会提示超时），建议编辑完后批量发布，不要单个产品发布
          </template>
          <a-button class="ml" type="primary" @click="UploadTO" :loading="Uploading">一键发布</a-button>
        </a-tooltip>
        <!-- :disabled="countDisabledHis" -->
      </a-col>
      <!-- <div v-show='setCountTimeHis >= 1' style="color:#f9a100;float:right;margin-left:10px">{{this.countDownTextHis}}</div> -->
    </a-row>
    <a-row v-if="screenType!=='0'">
      <a-col span="3">
        <a-input v-model="skuSearch" placeholder="请输入sku" @change="searchSku()"></a-input>
      </a-col>
    </a-row>
    <a-row class="mt">
      <a-col :md="12" :lg="10" :xl="8" :xxl="6">
        <a-button-group>
          <a-button :disabled="!hasPerm(permsBtn.history_all)" :type='screenType ==="0" ? "primary":"default"'
                    @click='screen("0")'>待发布
          </a-button>
          <a-button :disabled="!hasPerm(permsBtn.history_loding)" :type='screenType ==="1" ? "primary":"default"'
                    @click='screen("1")'>发布中
          </a-button>
          <a-button :disabled="!hasPerm(permsBtn.history_success)" :type='screenType ==="2" ? "primary":"default"'
                    @click='screen("2")'>已发布
          </a-button>
          <a-button :disabled="!hasPerm(permsBtn.history_error)" :type='screenType ==="3" ? "primary":"default"'
                    @click='screen("3")'>发布失败
          </a-button>
        </a-button-group>
      </a-col>
    </a-row>
    <a-row class="mt" v-if="condition==='0'">
      <a-col :span="12">
        <a-radio-group v-model="currentStatus" @change="statusChange">
          <a-radio :value="3">全部</a-radio>
          <a-radio :value="0">未检测</a-radio>
          <a-radio :value="1">检测中</a-radio>
          <a-radio :value="2">已检测</a-radio>
        </a-radio-group>
      </a-col>
      <a-col :span="12" style="text-align:right">
        <a-button type="primary" class="mr" @click="downCheckExcel">下载检测表格</a-button>
        <a-button type="primary" class="mr" @click="batchCheck">批量检测</a-button>
        <a-button type="primary" class="mr" @click="delReleasedAll">批量删除</a-button>
        <a-button type="primary" @click="batchExport">批量导出</a-button>
      </a-col>
    </a-row>
    <a-row class="mt">
      <a-table
        :scroll="{ x: 1700 }"
        :loading="listLoading"
        :dataSource="dataRecord"
        :rowSelection="rowSelectionRelease"
        :pagination="false"
        rowKey="id">
        <a-table-column
          title="id"
          dataIndex="goods_id"
          width="100px">
        </a-table-column>
        <a-table-column
          title="图片">
          <template slot-scope="text, record">
            <a-popover v-show="record.image" placement="rightTop">
              <template slot="content" style="width:200px">
                <img style="width:200px" :src="record.image" alt="">
              </template>
              <a-button style="width:100px;position:relative;overflow:hidden;height:100px">
                <img
                  style="width:100px; margin-left:-16px;margin-top:-2px"
                  :src="record.image"
                  alt="暂无订单信息"
                  @click="jumpToOrderUrl(record.ori_url)" />
              </a-button>
            </a-popover>
          </template>
        </a-table-column>
        <a-table-column
          title="标题"
          dataIndex="title">
        </a-table-column>

        <a-table-column
          v-if="condition==='0'"
          title="违禁词检测"
          width="120px"
          dataIndex="status">
          <template slot-scope="text, record">
            <span v-if="record.check_status === '0'">未检测</span>
            <span v-else-if="record.check_status === '1'">检测中</span>
            <span v-else-if="record.check_status === '2'">已检测 <a-icon type="check-circle" theme="twoTone"
                                                                      two-tone-color="#52c41a" /></span>
            <span v-else>已检测
                <a-popover title="">
                  <template slot="content">
                    <div v-html="record.check_message"></div>
                  </template>
                  <span>
                    <a-icon type="exclamation-circle" style="color:#ffd400" />
                  </span>
                </a-popover>
              </span>
          </template>
        </a-table-column>

        <a-table-column
          title="sku"
          dataIndex="sku">
        </a-table-column>
        <a-table-column
          title="价格"
          dataIndex="price"
          width="120px">
          <template slot-scope="text, record">
            <span v-if="SelectCountryHis">{{ countryLogoHis }} {{ record.price }}</span>
            <span v-else>{{ '￥' }} {{ record.price }}</span>
          </template>
        </a-table-column>
        <a-table-column
          title="国家"
          dataIndex="buyer_name"
          width="150px">
          <template slot-scope="text, record">
            <div v-if="condition==='0'" v-for="(value, key, index) in record.p_country" :key="index">
              {{ key ? '(' + codeORcountry[key] + ')' : '' }}
              <span v-if='value == "0"'>未发布</span>
              <span v-if='value == "1"'>已发布</span>
              <span v-if='value == "2"'>不可发布</span>
            </div>
            <div v-if="condition!=='0'">
              {{ codeORcountry[record.country] }}
            </div>
          </template>
        </a-table-column>
        <a-table-column
          v-if="condition!=='0'"
          title="创建时间"
          dataIndex="create_time"
          width="120px">
        </a-table-column>
        <a-table-column
          v-if="condition!=='0'"
          title="状态"
          dataIndex="status"
          width="120px">
          <template slot-scope="text, record">
            <div v-if='record.endResult === "1"'>上传中</div>
            <div v-if='record.endResult === "2"'>上传成功</div>
            <div v-if='record.endResult === "3"'>上传失败
              <a-popover title="上传失败原因" v-if='record.endResult === "3"'>
                <template slot="content">
                  <div class="alert-box">
                    <a-alert class="mb" :message="record.error_message" type="warning" style="width:400px;" />
                    <!-- <a-alert class='mb' v-if='record.base_error_message' :message='record.base_error_message' type="warning" style='width:400px;' />
                    <a-alert class='mb' v-if='record.image_error_message' :message='record.image_error_message' type="warning" style='width:400px;' />
                    <a-alert class='mb' v-if='record.quantity_error_message' :message='record.quantity_error_message' type="warning" style='width:400px;' />
                    <a-alert class='mb' v-if='record.price_error_message' :message='record.price_error_message' type="warning" style='width:400px;' /> -->
                  </div>
                </template>
                <a-icon type="question-circle" />
              </a-popover>
            </div>
          </template>
        </a-table-column>
        <a-table-column
          title="操作"
          width="220px">
          <template slot-scope="text, record">
              <span>
                <a-row>
                  <a-col v-if='condition==="0" || record.endResult === "3"' :span="12">
                    <a-button type="primary" style="margin-left:10px"
                              @click='Edits(record.goods_id?record.goods_id:record.id,"amazon")'>编辑</a-button>
                  </a-col>
                  <a-col v-if='condition==="0"' :span="12">
                    <a-button type="danger" style="margin-left:10px;"
                              @click="delReleased(record.goods_id?record.goods_id:record.id)">删除</a-button>
                  </a-col>
                </a-row>
              </span>
          </template>
        </a-table-column>
      </a-table>
    </a-row>
    <a-row v-if="dataRecord" class="mt" type="flex" justify="end">
      <a-col>
        <!--  -->
        <a-pagination
          :pageSizeOptions="pageSizeOptions"
          showSizeChanger
          v-model="currentRE"
          @showSizeChange="onShowSizeChange"
          @change="pagechangeRE"
          :pageSize="pageRE.pageSize"
          :total="(pageRE.pageSize*pageRE.lastPage)" />
      </a-col>
    </a-row>
    <a-modal
      title="提示"
      :visible="uploadshow"
      @ok="uploadOk"
      :confirmLoading="uploadLoading"
      @cancel="uploadCancel">
      <p>{{ uploadText }}</p>
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
          <a-select-option :value="index" v-for="(item,index) in codeORcountrys" :key="index">{{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="标题前缀"
        :labelCol="labelCols"
        :wrapperCol="wrapperCols">
        <a-input v-model="prefix" placeholder="统一标题前缀"></a-input>
      </a-form-item>
      <a-form-item
        label="品牌"
        :labelCol="labelCols"
        :wrapperCol="wrapperCols">
        <a-input v-model="brand" placeholder="统一品牌"></a-input>
      </a-form-item>
      <a-row v-show="showWarning" type="flex" justify="center">
        <a-col :span="18">
          <!-- <a-alert :message="ExTxt" type="warning" /> -->
          <div
            v-show="item.failData.length > 0"
            v-for="(item, index) in countryArr"
            :key="index"
            style="width: 295px; border: 1px solid #ccc; margin-left: 60px; border-radius: 3px; background: rgb(255,251,230); padding-left: 10px; margin-bottom:5px">
            ID为:{{ item.failData.join(',') }}&nbsp;&nbsp;{{ item.countryName }}信息填写不完整，请确认是否导出
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
      <p>{{ ModalText }}</p>
    </a-modal>
  </div>
</template>
<script>
const delay = (function () {
  let timer = 0
  return function (callback, ms) {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
import Vue from 'vue'
import {
  country_list,
  exportList,
  publishList,
  deletePublish,
  failedDeleted,
  uploadPublisGoods,
  uploadResult,
  getMyStore,
  uploadPublish,
  countDown,
  ExportCheck,
  JoinCheckTask
} from '@/api/collect'
import { codeORcountry, codeORcountrys, currencyList } from '@/views/order/public/country'
import { constants } from 'crypto'
import { CountDown } from '@/components'
import { permsBtn } from '@/utils/static'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'released',
  data () {
    return {
      permsBtn,
      codeORcountry,
      codeORcountrys,
      currencyList,
      queryParam: {
        status: '0',
        logistics: '0',
        orderNumber: ''
      },
      pageSizeOptions: ['10', '20', '40', '60', '80', '100', '200'],
      queryStatus: '请输入订单号',
      ScreeningOrder: '0',
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 8 }, sm: { span: 8 } },
      labelCols: { lg: { span: 6 }, sm: { span: 6 } },
      wrapperCols: { lg: { span: 15 }, sm: { span: 13 } },
      visibles: false,
      uploadshow: false,
      exportshow: false,
      ModalText: '确定要删除吗',
      uploadText: '您即将提交上传商品，十分钟后可以再次提交上传',
      confirmLoading: false,
      uploadLoading: false,
      listLoading: false,
      treeData: '',
      Selectvalue: '',
      orderid: '',
      data: '',
      page: '',
      current: 1,
      selectAll: '',
      queryState: false,
      SelectCountry: '',
      delId: '',
      selectkey: '',
      UploadId: '',
      dataRecord: [],
      pageRE: '',
      currentRE: 1,
      selectAllHistory: '',
      selectkeyHistory: '',
      storeSelect: '',
      siteSelect: [],
      siteSelectTwo: '',
      shopValue: '',
      activeKey: '1',
      shopValueHis: '',
      siteSelectHis: '',
      SelectCountryHis: '',
      SelectCountryHisType: '',
      UploadIdHis: '',
      showUploadBtn: true,
      countryLogo: '',
      countryLogoHis: '￥',
      condition: '0',
      upType: '',
      selectedRowKeys: [],
      selectedRowKeysHis: [],
      screenType: '0',
      loading: false,
      publishObj: '',
      publishObjHistory: '',
      objClone: '',
      copyListHis: '',
      objCloneHis: '',
      copyList: '',
      upLoading: false,
      classValue: '',
      countDisabled: false,
      countDisabledHis: false,
      Exportloading: false,
      prefix: '',
      brand: '',
      ManageLoading: false,
      showWarning: false,
      countryArr: [],
      goods_id: '',
      modalsLoading: false,
      classValueType: '',
      setCountTime: '',
      setCountTimeHis: '',
      countDownText: '',
      countDownTextHis: '',
      countrySelect: '',
      Noexport: [],
      Noexports: '',
      modals: false,
      initialArr: [],
      EXcountryValue: false,
      allCountrysState: false,
      idManege: '',
      EXids: '',
      Uploading: false,
      pageSize: 10,
      skuSearch: '',
      timer: null,
      allowClear: true,

      //商品检测
      showHover: false,
      addWarning: '',
      currentStatus: 3
    }
  },

  computed: {
    rowSelectionRelease () {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRowes) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, '产品发布: ', selectedRowes)
          this.selectAll = selectedRowes
          this.selectkey = selectedRowKeys
          this.selectedRowKeys = selectedRowKeys // 上传后勾选去掉
          console.log(this.selectedRowKeys)
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  created () {
    if (this.setCountTime > 0) {
      this.countDisabled = true
    } else if (this.setCountTime <= 0) {
      this.countDisabled = false
    } else if (this.setCountTimeHis > 0) {
      this.countDisabledHis = true
    } else {
      this.countDisabledHis = false
    }
  },
  mounted () {
    this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
    this.getMyStores()
    this.screenType = '0'
    if (Vue.ls.get('countDesInfoShopValue') && Vue.ls.get('countDesInfoShopValue').length > 0) {
      console.log(Vue.ls.get('countDesInfoShopValue'), '8888')
      this.shopValue = Vue.ls.get('countDesInfoShopValue')
      this.classValueType = Vue.ls.get('countDesInfoClassValueType')
      this.getCountDown(Vue.ls.get('countDesInfoShopValue'), Vue.ls.get('countDesInfoClassValueType'))
    }
    if (Vue.ls.get('countDesInfoShopValueHis') && Vue.ls.get('countDesInfoShopValueHis').length > 0) {
      this.shopValueHis = Vue.ls.get('countDesInfoShopValueHis')
      this.SelectCountryHisType = Vue.ls.get('countDesInfoSelectCountryHisType')
      this.getCountDownHis(Vue.ls.get('countDesInfoShopValueHis'), Vue.ls.get('countDesInfoSelectCountryHisType'))
    }
  },
  updated () {
  },
  destroyed () {
  },
  methods: {
    statusChange (e) {
      this.currentStatus = e.target.value
      this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
    },
    // 获取订单列表
    getpublishList (pagesize, shop, country, condition = 0) {
      this.listLoading = true
      if (country === 'all') {
        publishList({
          page_size: pagesize,
          page: this.currentRE,
          store_id: shop,
          status: this.currentStatus
        }).then(res => {
          if (res.code === 0) {
            this.listLoading = false
            if (res.data.length) {
              this.dataRecord = res.data
            } else {
              this.dataRecord = []
            }
            this.pageRE = res.pages
          } else {
            this.listLoading = false
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      } else {
        publishList({
          page_size: pagesize,
          page: this.currentRE,
          country: country,
          store_id: shop,
          status: this.currentStatus
        }).then(res => {
          if (res.code === 0) {
            this.listLoading = false
            if (res.data.length) {
              this.dataRecord = res.data
            } else {
              this.dataRecord = []
            }
            this.pageRE = res.pages
          } else {
            this.listLoading = false
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }
    },
    // 获取国家和店铺信息
    getMyStores () {
      getMyStore({
        page_type: 'mws_upload'
      }).then((res) => {
        if (res.code === 0) {
          this.storeSelect = res.data
          console.log(this.storeSelect)
        }
      })
    },
    getCountDown (shopValue, classValueType) {
      console.log('执行次数')
      countDown({
        store_id: shopValue,
        all_country: 0
      }).then(res => {
        if (res.code === 0) {
          console.log('执行前')
          console.log(typeof (res.data.next_time), 'type')
          if (res.data.next_time === 0) {
            Vue.ls.remove('countDesInfoShopValue')
            Vue.ls.remove('countDesInfoClassValueType')
            // this.countDisabled = false
            this.countDisabled = true
          } else {
            this.runCountTime(res.data.next_time * 60)
            Vue.ls.set('countDesInfoShopValue', this.shopValue)
            Vue.ls.set('countDesInfoClassValueType', this.classValueType)
            this.countDisabled = true
          }
          this.selectedRowKeys = []
        } else {
        }
      })
    },
    getCountDownHis (shopValueHis, SelectCountryHisType) {
      console.log('执行次数')
      countDown({
        store_id: shopValueHis,
        all_country: 0
      }).then(res => {
        if (res.code === 0) {
          console.log('执行前')
          console.log(typeof (res.data.next_time), 'type')
          if (res.data.next_time === 0) {
            Vue.ls.remove('countDesInfoShopValueHis')
            Vue.ls.remove('countDesInfoSelectCountryHisType')
            this.countDisabledHis = false
          } else {
            this.runCountTimeHis(res.data.next_time * 60)
            Vue.ls.set('countDesInfoShopValueHis', this.shopValueHis)
            Vue.ls.set('countDesInfoSelectCountryHisType', this.SelectCountryHisType)
            this.countDisabledHis = true
          }
          this.selectedRowKeys = []
        } else {
        }
      })
    },
    UploadTO () {
      console.log(this.selectedRowKeys)
      // this.loading = true
      console.log(this.selectAll, 'over', this.selectAll.length)
      if (this.shopValueHis) {
        if (this.SelectCountryHis) {
          if (this.selectAll.length > 0) {
            let str = ''
            for (var i = 0; i < this.selectAll.length; i++) {
              str += (this.selectAll[i].goods_id + ',')
            }
            this.UploadId = str.slice(0, -1)
            if (this.screenType === '0') {
              // 待发布
              console.log('待发布1')
              let str = ''
              for (var i = 0; i < this.selectAll.length; i++) {
                str += (this.selectAll[i].id + ',')
              }
              this.UploadIdHis = str.slice(0, -1)
              this.uploadshow = true
              this.upType = 'wait'
              this.copyListHis = JSON.stringify(this.selectAll),
                this.objCloneHis = JSON.parse(this.copyListHis)
              this.objCloneHis.forEach((item, index) => {
                Object.keys(item).forEach((im, ix) => {
                  if (im !== 'goods_id' && im !== 'p_country') {
                    delete item[im]
                  }
                  if (im == 'country') {
                    item['p_country'] = item[im]
                    delete item[im]
                  }
                })
                this.objCloneHis[index].p_country = this.SelectCountryHis
              })
              this.publishObjHistory = this.objCloneHis
              console.log('publishObjHistory', this.publishObjHistory)

            } else {
              console.log('发布历史')
              this.uploadshow = true
              this.upType = 'UploadTO'
              console.log(this.selectAll, 'ovee')
              this.copyList = JSON.stringify(this.selectAll),
                this.objClone = JSON.parse(this.copyList)
              this.objClone.forEach((item, index) => {
                Object.keys(item).forEach((im, ix) => {
                  if (im !== 'goods_id' && im !== 'country') {
                    delete item[im]
                  }
                  if (im == 'country') {
                    item['p_country'] = item[im]
                    delete item[im]
                  }
                })
              })
              this.publishObj = this.objClone
              console.log(this.publishObj, 'publishObj', this.objClone)
            }
          } else {
            this.loading = false
            this.$notification.error({
              message: '错误',
              description: '请先勾选上传的选项'
            })
          }
        } else {
          this.loading = false
          this.$notification.error({
            message: '错误',
            description: '请先选择国家'
          })
        }
      } else {
        this.loading = false
        this.$notification.error({
          message: '错误',
          description: '请先选择店铺'
        })
      }
    },
    batchExport () {
      this.showWarning = false
      if (this.selectAll.length > 0) {
        this.Noexport = []
        this.selectAll.forEach((item, index) => {
          if (item.status === '0') {
            this.Noexport.push(item.id)
          }
        })
        this.Noexports = this.Noexport.join('  ')
        this.modals = true
      } else {
        this.$notification.error({
          message: '错误',
          description: '请先勾选导出的选项'
        })
      }
    },
    //批量检测
    batchCheck () {
      let that = this
      JoinCheckTask({
        ids: that.selectkey
      }).then(res => {
        that.$notification.info({
          message: '提示',
          description: res.msg
        })
        that.getpublishList(that.pageSize, that.shopValueHis, that.SelectCountryHis, that.condition)
      })
    },
    //下载检测表格
    downCheckExcel () {
      let that = this
      if (that.selectkey.length == 0) {
        that.$notification.info({
          message: '提示',
          description: '请选择导出的商品'
        })
        return
      }
      ExportCheckEaxcel({
        ids: that.selectkey
      }).then(res => {
        console.log('hu', res)
        if (res.code == 0) {
          if (res.data.url) {
            window.open(res.data.url, '_blank')
          }
        }
        that.$notification.info({
          message: '提示',
          description: res.msg
        })
      })
    },
    exportOk () {
      this.modalsLoading = true
      this.exportpost()
      setTimeout(() => {
        this.modals = false
        this.modalsLoading = false
      }, 1000)
      this.initialArr = []
      this.selectedRowKeys = []
      this.EXcountryValue = false
      this.allCountrysState = false
    },
    //导出请求
    exportpost () {
      const token = Vue.ls.get(ACCESS_TOKEN)
      if (this.selectAll) {
        let str = ''
        for (var i = 0; i < this.selectAll.length; i++) {
          str += (this.selectAll[i].goods_id + '-')
        }
        this.idManege = str.slice(0, -1)
      }
      exportList({
        country: this.EXcountryValue,
        ids: this.idManege,
        titlePrefix: this.prefix,
        brandName: this.brand
      }).then((res) => {
        if (res.code === 0) {
          // 商品导出
          res.data.fileArr.forEach((item, index) => {
            window.open(this.GLOBAL.BASE_URL + item, '_blank')
          })
          this.selectedRowKeys = []
          this.EXcountryValue = false
          this.allCountrysState = false
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
        } else {
          this.selectedRowKeys = []
          this.EXcountryValue = false
          this.allCountrysState = false
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    handleCancelExport (e) {
      this.modals = false
      this.initialArr = []
      this.selectedRowKeys = []
      this.selectAll = []
      this.EXcountryValue = false
      this.allCountrysState = false
    },
    onChangeButton (checked) {
      if (!this.allCountrysState) {
        var arrCodeORcountrys = []
        // 循环对象 ES5 增加了 Object.keys 方法，直接获取对象自己的所有键，返回数组：
        arrCodeORcountrys = Object.keys(codeORcountrys)
        this.EXcountryValue = arrCodeORcountrys.join(',')
        let str = ''
        for (var i = 0; i < this.selectAll.length; i++) {
          str += (this.selectAll[i].goods_id + ',')
        }
        this.EXids = str.slice(0, -1)
        ExportCheck({
          country: this.EXcountryValue,
          ids: this.EXids
        }).then(res => {
          if (res.code === 0) {
            if (res.data.length > 0) {
              this.countryArr = res.data
              this.showWarning = true
            } else {
              this.showWarning = false
            }
          }
        })
      } else {
        this.EXcountryValue = ''
        this.countryArr = []
      }
      this.allCountrysState = !this.allCountrysState
    },
    // change 导出国家选项
    EXcountryChange (value) {
      this.EXcountryValue = value.join(',')
      let str = ''
      for (var i = 0; i < this.selectAll.length; i++) {
        str += (this.selectAll[i].goods_id + ',')
      }
      this.EXids = str.slice(0, -1)
      ExportCheck({
        country: this.EXcountryValue,
        ids: this.EXids
      }).then(res => {
        if (res.code === 0) {
          if (res.data.length > 0) {
            this.countryArr = res.data
            this.showWarning = true
          } else {
            this.showWarning = false
          }
        }
      })
    },

    runCountTime (countTime) {
      let obj = null
      var intervals = setInterval(() => {
        countTime--
        if (countTime > 0) {
          let min = parseInt(countTime / 60)
          let sec = parseInt(countTime % 60 % 60)
          min = min < 10 ? '0' + min : min
          sec = sec < 10 ? '0' + sec : sec
          obj = {
            min: min,
            sec: sec
          }
          this.countDownText = obj.min + '分' + obj.sec + '秒后，可再次发布'
          console.log(countTime, 'qwe')
          this.countDisabled = true
        } else {
          console.log('清除计时器前', intervals)
          clearInterval(intervals)
          this.countDisabled = false
          Vue.ls.remove('countDesInfoShopValue')
          Vue.ls.remove('countDesInfoClassValueType')
        }
        this.setCountTime = countTime
      }, 1000)
    },

    // 切换 发布历史 **************************************
    callback (key) {
      if (key === '2') {
        this.getuploadResult(this.pageSize)
        this.screenType = '0'
      }
    },
    shopchangeHis (val) {
      this.shopValueHis = val
      this.storeSelect.forEach((item, index) => {
        if (val === item.id) {
          this.siteSelectHis = item.mws_site
        }
      })
      if (this.condition === '0') {
        this.screenType = '0'
        console.log(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition, 'over')
        this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
      } else {
        this.getuploadResult(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition, this.skuSearch)
      }
    },
    classchangeHis (value) {
      this.selectedRowKeys = []
      this.selectAll = []
      this.SelectCountryHis = value
      if (this.condition === '0') {
        this.screenType = '0'
        console.log(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition, 'over')
        this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
      } else {
        this.getuploadResult(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition, this.skuSearch)
      }
      // this.getuploadResult('10',this.shopValueHis,this.SelectCountryHis,this.condition)
      this.currencyList.forEach((item, index) => {
        if (item.id === this.SelectCountryHis) {
          this.countryLogoHis = item.logo
        }
      })
    },
    //一键上传  发布历史的一键上传
    uploadOnekey () {
      if (this.shopValueHis) {
        if (this.SelectCountryHis) {
          if (this.selectAllHistory.length > 0) {
            let str = ''
            for (var i = 0; i < this.selectAllHistory.length; i++) {
              str += (this.selectAllHistory[i].id + ',')
            }
            this.UploadIdHis = str.slice(0, -1)
            this.uploadshow = true
            this.upType = 'wait'
            this.copyListHis = JSON.stringify(this.selectAllHistory),
              this.objCloneHis = JSON.parse(this.copyListHis)
            this.objCloneHis.forEach((item, index) => {
              Object.keys(item).forEach((im, ix) => {
                if (im !== 'goods_id' && im !== 'country') {
                  delete item[im]
                }
                if (im == 'country') {
                  item['p_country'] = item[im]
                  delete item[im]
                }
              })
            })
            this.publishObjHistory = this.objCloneHis
          } else {
            this.$notification.error({
              message: '错误',
              description: '请先勾选上传的选项'
            })
          }
        } else {
          this.$notification.error({
            message: '错误',
            description: '请先选择国家'
          })
        }
      } else {
        this.$notification.error({
          message: '错误',
          description: '请先选择店铺'
        })
      }
    },
    // 获取发布历史列表
    getuploadResult (pagesize, shop, country, status, sku) {
      console.log('params', pagesize, shop, country, status)
      this.listLoading = true
      if (country === 'all') {
        uploadResult({
          page_size: pagesize,
          page: this.currentRE,
          store_id: shop,
          status: status,
          sku: sku
        }).then(res => {
          if (res.code === 0) {
            this.listLoading = false
            if (res.data.length > 0) {
              this.dataRecord = res.data
            } else {
              this.dataRecord = []
            }
            this.pageRE = res.pages
          } else {
            this.listLoading = false
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      } else {
        uploadResult({
          page_size: pagesize,
          page: this.currentRE,
          store_id: shop,
          country: country,
          status: status,
          sku: sku
        }).then(res => {
          if (res.code === 0) {
            this.listLoading = false
            if (res.data.length > 0) {
              this.dataRecord = res.data
            } else {
              this.dataRecord = []
            }
            this.pageRE = res.pages
          } else {
            this.listLoading = false
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }
    },
    screen (condition) {
      this.currentRE = 1
      this.condition = condition
      this.skuSearch = ''
      if (condition === '0' || condition === '3') {
        this.showUploadBtn = true
      } else {
        this.showUploadBtn = false
      }
      if (condition === '0') {
        this.screenType = '0'
        this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
      } else if (condition === '1') {
        this.screenType = '1'
        this.getuploadResult(this.pageSize, '', '', condition)
      } else if (condition === '2') {
        this.screenType = '2'
        this.getuploadResult(this.pageSize, '', '', condition)
      } else if (condition === '3') {
        this.screenType = '3'
        this.getuploadResult(this.pageSize, this.shopValueHis, this.SelectCountryHis, condition)
      }
      this.selectedRowKeys = []
      this.selectAll = []
      console.log(this.selectedRowKeys, 'selectedRowKeys')
    },
    // sku搜索

    // 产品发布 分页
    pagechange (page, pagesize) {
      this.current = page
      this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
    },

    onShowSizeChange (current, pageSize) {
      console.log(current, pageSize, 'onShowSizeChange')
      this.pageSize = pageSize
      if (this.condition === '0') {
        this.screenType = '0'
        this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
      } else {
        this.getuploadResult(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
      }
    },
    Edits (id, site) {
      this.$router.push({
        path: '/product/manage/goodedit',
        query: {
          id: id,
          site: 'amazon',
          type: 0
        }
      })
      this.$store.commit('set_tabnum', '2')
    },
    // 产品记录 分页
    pagechangeRE (page, pagesize) {
      this.currentRE = page
      console.log(page)
      if (this.condition === '0') {
        console.log(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
        this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
      } else {
        // if(this.condition ==="3"){
        this.getuploadResult(pagesize, this.shopValueHis, this.SelectCountryHis, this.condition, this.skuSearch)
        // }else{
        //   this.getuploadResult(pagesize,'','',this.condition)
        // }
      }
    },
    // 删除 待发布信息
    delReleased (id) {
      this.visibles = true
      this.delId = id
    },
    delReleasedAll () {
      console.log(this.selectAll)
      if (this.selectAll.length > 0) {
        let str = ''
        for (var i = 0; i < this.selectAll.length; i++) {
          str += (this.selectAll[i].goods_id + ',')
        }
        this.delId = str.slice(0, -1)
        this.visibles = true
      } else {
        this.$notification.error({
          message: '错误',
          description: '请先勾选删除的选项'
        })
      }
    },
    handleCancel (e) {
      this.visibles = false
    },
    handleOk () {
      //删除的操作
      this.delRel()
      this.confirmLoading = true
      setTimeout(() => {
        this.visibles = false
        this.confirmLoading = false
      }, 800)
    },
    uploadOk () {
      // 上传的操作   wait
      this.Uploading = true
      if (this.upType === 'UploadTO') {
        // console.log('UploadTO','发布历史')
        // console.log(this.publishObj,"publishObj")
        this.toupload()
      } else if (this.upType === 'wait') {
        // console.log('wait','待发布',this.publishObjHistory)
        // console.log('id',this.shopValueHis,"country",this.publishObjHistory,'publish_type','1')
        this.oneKeyUploadPublish()
      }
      this.uploadLoading = true
      setTimeout(() => {
        this.uploadshow = false
        this.uploadLoading = false
      }, 800)
    },
    // 一键发布 发布历史的
    oneKeyUploadPublish () {
      console.log('id', this.shopValueHis, 'country', this.publishObjHistory, 'oooo')
      uploadPublisGoods({
        goods_list: this.publishObjHistory,
        store_id: this.shopValueHis,
        publish_type: '1'
      }).then(res => {
        if (res.code === 0) {
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
          this.Uploading = false
          if (this.SelectCountryHis == '0') {
            this.SelectCountryHisType = 1
          } else {
            this.SelectCountryHisType = 0
          }
          this.getCountDownHis(this.shopValueHis, this.SelectCountryHisType)
          this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
        } else {
          if (this.SelectCountryHis == '0') {
            this.SelectCountryHisType = 1
          } else {
            this.SelectCountryHisType = 0
          }
          this.getCountDownHis(this.shopValueHis, this.SelectCountryHisType)
          this.Uploading = false
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })

    },
    // 一键发布 产品发布的
    toupload () {
      uploadPublisGoods({
        goods_list: this.publishObj,
        store_id: this.shopValueHis,
        publish_type: '2'
      }).then(res => {
        if (res.code === 0) {
          this.selectedRowKeys = []
          this.Uploading = false
          this.$notification.success({
            message: '成功',
            description: res.msg
          })

          if (this.condition === '0') {
            this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
          } else {
            this.getuploadResult(pagesize, this.shopValueHis, this.SelectCountryHis, this.condition)
          }
          this.Uploading = false
          if (this.classValue == 'all') {
            this.classValueType = 1
          } else {
            this.classValueType = 0
          }
          this.getCountDown(this.shopValueHis, this.classValueType)
        } else {
          if (this.classValue == 'all') {
            this.classValueType = 1
          } else {
            this.classValueType = 0
          }
          this.getCountDown(this.shopValueHis, this.classValueType)
          this.Uploading = false
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
          this.Uploading = false
        }
      })
    },

    runCountTimeHis (countTime) {
      let obj = null
      var Intervalss = setInterval(() => {
        countTime--
        if (countTime > 0) {
          let min = parseInt(countTime / 60)
          let sec = parseInt(countTime % 60 % 60)
          min = min < 10 ? '0' + min : min
          sec = sec < 10 ? '0' + sec : sec
          obj = {
            min: min,
            sec: sec
          }
          this.countDownTextHis = obj.min + '分' + obj.sec + '秒后，可再次上传'
          console.log(countTime, 'qwe-His')
          this.countDisabledHis = true
        } else {
          console.log('清除计时器前', Intervalss)
          clearInterval(Intervalss)
          this.countDisabledHis = false
          Vue.ls.remove('countDesInfoShopValueHis')
          Vue.ls.remove('countDesInfoSelectCountryHisType')
        }
        this.setCountTimeHis = countTime
      }, 1000)
    },
    uploadCancel () {
      this.uploadshow = false
      // this.selectedRowKeysHis = []
    },
    delRel () {
      if (this.condition === '0') {
        deletePublish({
          goods_id: this.delId
        }).then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            if (this.condition === '0') {
              this.screenType = '0'
              this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
            } else if (this.condition === '1') {
              this.screenType = '1'
              this.getuploadResult(this.pageSize, '', '', this.condition)
            } else if (this.condition === '2') {
              this.screenType = '2'
              this.getuploadResult(this.pageSize, '', '', condition)
            } else if (this.condition === '3') {
              this.screenType = '3'
              this.getuploadResult(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
            }
          } else {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      } else {
        failedDeleted({ goods_id: this.delId }).then(res => {
          if (res.code === 0) {
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            if (this.condition === '0') {
              this.screenType = '0'
              this.getpublishList(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
            } else if (this.condition === '1') {
              this.screenType = '1'
              this.getuploadResult(this.pageSize, '', '', this.condition)
            } else if (this.condition === '2') {
              this.screenType = '2'
              this.getuploadResult(this.pageSize, '', '', condition)
            } else if (this.condition === '3') {
              this.screenType = '3'
              this.getuploadResult(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition)
            }
          } else {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      }
    },
    jumpToOrderUrl (url) {
      if (url) {
        // console.log(url)
        window.open(url, '_blank')
      } else {
        // console.log('跳转失败')
      }
    },
    //节流 搜索
    searchSku () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getuploadResult(this.pageSize, this.shopValueHis, this.SelectCountryHis, this.condition, this.skuSearch)
      }, 1000)
    },
    //检测
    enter (result) {
      this.showHover = true
      this.addWarning = result
    },
    leave () {
      this.showHover = false
      this.addWarning = ''
    }
  },
  filters: {
    priceTlt (val) {
      if (val) {
        vm.currencyList.forEach((item, index) => {
          console.log(item)
          if (item.id === vm.SelectCountry) {
            return item.logo + '' + val
          }
        })
      } else {
        return ''
      }
    }
  }
}
</script>
<style scoped lang="less">
.mt {
  margin-top: 20px;
}

.mr {
  margin-right: 20px;
}

.mb {
  margin-bottom: 20px;
}

.mt-xl {
  margin-top: 40px;
}

.title-size {
  font-size: 14px;
  color: #000;
}

.alert-box {
  min-height: 100px;
  overflow-y: scroll;
}
</style>
