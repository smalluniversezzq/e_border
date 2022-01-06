<template>
  <div>
    <a-card>
      <a-tabs defaultActiveKey="1" type="card" class="intcardtab" @change="callback">
        <a-tab-pane key="1">
          <span slot="tab">
            单品采集
          </span>
          <a-textarea v-model="collectUrl" placeholder="输入产品链接,Enter换行输入多个商品链接" :rows="4" />
          <a-row class="mt-sm">
            <a-col :md="18" :lg="15" :xl="13" :xxl="10">
              <a-row>
                <a-col v-if="showChromeCode" :md="24" :lg="24" :xl="20" :xxl="20">
                  <a-popover title="" placement="right">
                    <template slot="content">
                      <p>使用插件采集，采集数据更稳定、成功率更高，</p>
                      <p>数据抓取更精准</p>
                    </template>
                    <span class="cursor">
                      温馨提示：单品采集支持淘宝、天猫、京东、1688 数据采集，
                      <span class="txt-color" @click="downloadChrome">点击这里安装插件</span>
                      <router-link style="color: rgb(255 153 0); text-decoration:none;"
                                   :to="{name: 'installTutorial'}" target="_blank">（安装教程）</router-link>
                    </span>
                  </a-popover>
                </a-col>
              </a-row>
              <a-row>
                <a-col v-show="showChromeCode" :span="6">
                  <a-input v-model="chromeCode"></a-input>
                </a-col>
                <a-col :span="2" class="ml">
                  <a-button v-if="showChromeCode" @click="activation">激活插件</a-button>
                  <a-button v-else @click="activationFn">已激活</a-button>
                </a-col>
              </a-row>
            </a-col>
            <a-col :md="6" :lg="9" :xl="11" :xxl="14" style="text-align: right; margin-bottom:10px;">
              <a-button type="primary" v-if="hasPerm(permsBtn.product_scllect)" @click="toCollect()"
                        :loading="disableds">开始采集
              </a-button>
              <a-button style="margin-left: 8px" @click='(()=>(collectUrl=""))'>清空</a-button>
            </a-col>
          </a-row>
          <!-- 采集列表 -->
          <!-- lll -->
          <a-card class="mt">
            <a-row style="margin-bottom:10px">
              <a-col :md="20" :sm="20">
                <a-dropdown>
                  <a-button type="primary" v-if="hasPerm(permsBtn.product_claim_all) " :disabled="claimLoading">批量认领
                    <a-icon type="down" />
                  </a-button>
                  <a-menu slot="overlay">
                    <a-menu-item key="1" @click='ClaimAll("amazon")'>认领到亚马逊商品库</a-menu-item>
                    <a-menu-item key="2" @click='ClaimAll("shopee")'>认领到Shopee商品库</a-menu-item>
                  </a-menu>
                </a-dropdown>
                <a-button type="danger" v-if="hasPerm(permsBtn.product_delAll)" style="margin-left:10px;"
                          @click="collectdelAll()">批量删除
                </a-button>
              </a-col>
              <a-col :md="4">
                <a-row type="flex" justify="end">
                  <a-col>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-row class="mb-l" type="flex" justify="start">
              <a-col :span="2.5">
                <a-input class="" placeholder="请输入产品名称" style="width:180px " v-model="searchName"></a-input>
              </a-col>
              <a-col :span="1.5">
                <a-button class="ml" type="primary" @click="shopSearch()">搜索</a-button>
              </a-col>
              <a-col :span="1.5">
                <a-button class="ml" @click="() => (searchName = '' ) ">重置</a-button>
              </a-col>
              <a-col :span="1.5">
                <a-badge :count="black_count">
                  <a-button :class='!blackSwitch?"ml btn-bgcolor":"ml btn-bgcolorTab"' @click="toBlack()">黑名单</a-button>
                </a-badge>
              </a-col>
            </a-row>
            <a-row>
              <a-table
                :scroll="{ x: 1500 }"
                :pagination="false"
                :dataSource="data"
                :loading="listLoading"
                :rowSelection="rowSelection"
                rowKey="id">
                <a-table-column
                  title="id"
                  dataIndex="id"
                  fixed="left"
                  width="100px"
                >
                </a-table-column>
                <a-table-column
                  title="图片"
                  fixed="left"
                  width="100px">
                  <template slot-scope="text, record">
                    <a-popover v-show="record.image" placement="rightTop">
                      <template slot="content" style="width:200px">
                        <img style="width:200px" :src="record.image" alt="">
                      </template>
                      <a-button style="width:100px;position:relative;overflow:hidden;height:100px">
                        <img
                          style="width:100px; margin-left:-16px;margin-top:-2px"
                          :src="record.image"
                          alt="暂无图片"
                          @click="jumpToOrderUrl(record.ori_url)" />
                      </a-button>
                    </a-popover>
                  </template>
                </a-table-column>
                <a-table-column
                  title="标题"
                  dataIndex="title"
                >
                  <template slot-scope="text, record">
                      <span v-if="!blackSwitch">
                        <span>{{ record.title }}</span>
                      </span>
                    <div v-else class="flex-box ">
                      <a-tooltip placement="right">
                        <template slot="title" style="width:250px">
                          {{ record.ori_title }}
                        </template>
                        <div class="black-box">
                          <img class="black-box-img" :src="blackPic" alt="">
                        </div>
                      </a-tooltip>
                      <div>{{ record.title }}</div>
                    </div>
                  </template>
                </a-table-column>
                <a-table-column
                  title="来源"
                  dataIndex="ori_platform"
                  width="100px"
                >
                </a-table-column>
                <a-table-column
                  title="价格"
                  dataIndex="ori_price"
                  width="100px"
                >
                  <template slot-scope="text, record">
                    <span>{{ record.ori_price | priceTlt }}</span>
                  </template>
                </a-table-column>
                <a-table-column
                  title="状态"
                  width="150px"
                >
                  <template slot-scope="text, record">
                    <div class="sta-box">
                      <div class="sha-width mr lt">Amazon</div>
                      <div class="status-pic ">
                        <img :src="record.amazon_status===1?CheckMarkT:CheckMarkF" alt="">
                      </div>
                      <span
                        :class='record.amazon_status===1?"font-color-green":""'>{{ record.amazon_status === 1 ? '已认领' : '未认领'
                        }}</span>
                    </div>
                    <div class="sta-box">
                      <div class="sha-width mr lt">Shopee</div>
                      <div class="status-pic">
                        <img :src="record.shopee_status===1?CheckMarkT:CheckMarkF" alt="">
                      </div>
                      <span
                        :class='record.shopee_status===1?"font-color-green":""'>{{ record.shopee_status === 1 ? '已认领' : '未认领'
                        }}</span>
                    </div>
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
                  title="操作"
                  width="240px"
                  fixed="right"
                >
                  <template slot-scope="text, record">
                    <div>
                      <a-row>
                        <a-col :span="12">
                          <a-dropdown>
                            <a-button type="primary" :disabled="!hasPerm(permsBtn.product_claim) || claimLoading"
                                      style="margin-left:10px;">认领到
                              <a-icon type="down" />
                            </a-button>
                            <a-menu slot="overlay">
                              <a-menu-item key="1" @click='Claim("amazon",record.id)'>认领到亚马逊商品库</a-menu-item>
                              <a-menu-item key="2" @click='Claim("shopee",record.id)'>认领到Shopee商品库</a-menu-item>
                            </a-menu>
                          </a-dropdown>
                        </a-col>
                        <a-col :span="12">
                          <a-button :disabled="!hasPerm(permsBtn.product_del)" type="danger" style="margin-left:10px;"
                                    @click="collectdel(record.id)">删除
                          </a-button>
                        </a-col>
                      </a-row>
                    </div>
                  </template>
                </a-table-column>
              </a-table>
              <!-- </a-col> -->
            </a-row>
            <a-row class="mt" v-if="data.length !== 0" type="flex" justify="end">
              <a-col>
                <a-pagination
                  :pageSizeOptions="pageSizeOptionManage"
                  v-model="currentManege"
                  showSizeChanger
                  @showSizeChange="onShowSizeChange"
                  :pageSize.sync="pageManage.pageSize"
                  @change="pagechange"
                  :total="(pageManage.pageSize*pageManage.lastPage)" />
              </a-col>
            </a-row>
          </a-card>
          <a-modal
            title="删除"
            :visible="visibles"
            @ok="handleOk"
            :confirmLoading="ManageLoading"
            @cancel="handleCanceldel">
            <p>{{ ModalTextManage }}</p>
          </a-modal>
          <!-- lll -->
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            分类采集
          </span>
          <a-textarea v-model="collectUrlClass" placeholder="请输入搜索结果页网址，只支持单条链接；请用谷歌浏览器进行采集，并且确认已登录采集平台的账号！"
                      :rows="1" />
          <a-row class="mt-sm">
            <a-col :md="18" :lg="15" :xl="13" :xxl="10">
            </a-col>
            <!-- 分类采集 -->
            <a-col :md="6" :lg="9" :xl="11" :xxl="14" style="text-align: right; margin-bottom:10px;">
              <a-button type="primary" @click="toCollectAll()" v-if="hasPerm(permsBtn.product_scllect)"
                        :loading="disabledAll">{{categoryCrawlTitle}}
              </a-button>
              <a-button style="margin-left: 8px" @click='(() => (collectUrlClass = ""))'>清空</a-button>
            </a-col>
          </a-row>
          <!-- 采集列表 -->
          <a-card class="mt">
            <a-row style="margin-bottom:10px">
              <a-col :md="20" :sm="20">
                <a-dropdown>
                  <a-button type="primary" v-if="hasPerm(permsBtn.product_claim_all) " :disabled="claimLoading">批量认领
                    <a-icon type="down" />
                  </a-button>
                  <a-menu slot="overlay">
                    <a-menu-item key="1" @click='ClaimAll("amazon")'>认领到亚马逊商品库</a-menu-item>
                    <a-menu-item key="2" @click='ClaimAll("shopee")'>认领到Shopee商品库</a-menu-item>
                  </a-menu>
                </a-dropdown>
                <a-button type="danger" v-if="hasPerm(permsBtn.product_delAll)" style="margin-left:10px;"
                          @click="collectdelAll()">批量删除
                </a-button>
              </a-col>
            </a-row>
            <a-row class="mb-l" type="flex" justify="start">
              <a-col :span="2.5">
                <a-input placeholder="请输入搜索的产品名称" style="width:180px " v-model="searchName"></a-input>
              </a-col>
              <a-col :span="1.5">
                <a-button class="ml" type="primary" @click="shopSearch()">搜索</a-button>
              </a-col>
              <a-col :span="1.5">
                <a-button class="ml" @click="() => (searchName = '' ) ">重置</a-button>
              </a-col>
              <a-col :span="1.5">
                <a-badge :count="black_count">
                  <a-button :class='!blackSwitch?"ml btn-bgcolor":"ml btn-bgcolorTab"' @click="toBlack()">黑名单</a-button>
                </a-badge>
              </a-col>
            </a-row>
            <a-row>
              <a-table
                :scroll="{ x: 1500 }"
                :pagination="false"
                :dataSource="data"
                :loading="listLoading"
                :rowSelection="rowSelection"
                rowKey="id">
                <a-table-column
                  title="id"
                  dataIndex="id"
                  fixed="left"
                  width="100px"
                >
                </a-table-column>
                <a-table-column
                  title="图片"
                  fixed="left"
                  width="100px">
                  <template slot-scope="text, record">
                    <a-popover v-show="record.image" placement="rightTop">
                      <template slot="content" style="width:200px">
                        <img style="width:200px" :src="record.image" alt="">
                      </template>
                      <a-button style="width:100px;position:relative;overflow:hidden;height:100px">
                        <img
                          style="width:100px; margin-left:-16px;margin-top:-2px"
                          :src="record.image"
                          alt="暂无图片"
                          @click="jumpToOrderUrl(record.ori_url)" />
                      </a-button>
                    </a-popover>
                  </template>
                </a-table-column>
                <a-table-column
                  title="标题"
                  dataIndex="title"
                >
                  <template slot-scope="text, record">
                      <span v-if="!blackSwitch">
                        <span>{{ record.title }}</span>
                      </span>
                    <div v-else class="flex-box ">
                      <a-tooltip placement="right">
                        <template slot="title" style="width:250px">
                          {{ record.ori_title }}
                        </template>
                        <div class="black-box">
                          <img class="black-box-img" :src="blackPic" alt="">
                        </div>
                      </a-tooltip>
                      <div>{{ record.title }}</div>
                    </div>
                  </template>
                </a-table-column>
                <a-table-column
                  title="来源"
                  dataIndex="ori_platform"
                  width="100px"
                >
                </a-table-column>
                <a-table-column
                  title="价格"
                  dataIndex="ori_price"
                  width="100px"
                >
                  <template slot-scope="text, record">
                    <span>{{ record.ori_price | priceTlt }}</span>
                  </template>
                </a-table-column>
                <a-table-column
                  title="状态"
                  width="150px"
                >
                  <template slot-scope="text, record">
                    <div class="sta-box">
                      <div class="sha-width mr lt">Amazon</div>
                      <div class="status-pic ">
                        <img :src="record.amazon_status===1?CheckMarkT:CheckMarkF" alt="">
                      </div>
                      <span
                        :class='record.amazon_status===1?"font-color-green":""'>{{ record.amazon_status === 1 ? '已认领' : '未认领'
                        }}</span>
                    </div>
                    <div class="sta-box">
                      <div class="sha-width mr lt">Shopee</div>
                      <div class="status-pic">
                        <img :src="record.shopee_status===1?CheckMarkT:CheckMarkF" alt="">
                      </div>
                      <span
                        :class='record.shopee_status===1?"font-color-green":""'>{{ record.shopee_status === 1 ? '已认领' : '未认领'
                        }}</span>
                    </div>
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
                  title="操作"
                  width="240px"
                  fixed="right"
                >
                  <template slot-scope="text, record">
                    <div>
                      <a-row>
                        <a-col :span="12">
                          <a-dropdown>
                            <a-button type="primary" :disabled="!hasPerm(permsBtn.product_claim) || claimLoading"
                                      style="margin-left:10px;">认领到
                              <a-icon type="down" />
                            </a-button>
                            <a-menu slot="overlay">
                              <a-menu-item key="1" @click='Claim("amazon",record.id)'>认领到亚马逊商品库</a-menu-item>
                              <a-menu-item key="2" @click='Claim("shopee",record.id)'>认领到Shopee商品库</a-menu-item>
                            </a-menu>
                          </a-dropdown>
                        </a-col>
                        <a-col :span="12">
                          <a-button :disabled="!hasPerm(permsBtn.product_del)" type="danger" style="margin-left:10px;"
                                    @click="collectdel(record.id)">删除
                          </a-button>
                        </a-col>
                      </a-row>
                    </div>
                  </template>
                </a-table-column>
              </a-table>
              <!-- </a-col> -->
            </a-row>
            <a-row class="mt" v-if="data.length !== 0" type="flex" justify="end">
              <a-col>
                <a-pagination
                  :pageSizeOptions="pageSizeOptionManage"
                  v-model="currentManege"
                  showSizeChanger
                  @showSizeChange="onShowSizeChange"
                  :pageSize.sync="pageManage.pageSize"
                  @change="pagechange"
                  :total="(pageManage.pageSize*pageManage.lastPage)" />
              </a-col>
            </a-row>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  country_list,
  crawler,
  productApply,
  boxdel,
  crawlerCollect,
  validateUrl,
  getcategory,
  crawlerQueryCollect,
  getMyStore,
  ExportCheck,
  insertPublish,
  batchUpdate,
  authCountry,
  search_category,
  changeId,
  sourcwList,
  sourceProductDeleted,
  claimProduct
} from '@/api/collect'
import {
  codeORcountry,
  codeORcountrys,
  language,
  languageCode,
  languageCodeOrcountry
} from '@/views/order/public/country'
import { permsBtn } from '@/utils/static'
import { ACCESS_TOKEN, UID, USERNAME } from '@/store/mutation-types'

export default {
  name: 'collect',
  components: {},
  data () {
    return {
      permsBtn,
      countryArr: [],
      initialArr: [],
      collectData: '',
      collectUrl: '',
      selectManageAll: '',
      selectkey: '',
      site: 'amazon',
      ids: '',
      ModalText: '确定要删除吗',
      loading: false,
      visible: false,
      confirmLoading: false,
      delid: '',
      delAll: '',
      disableds: false,
      page: '',
      current: 1,
      html: '',
      chromeCode: '',
      showChromeCode: false,
      pageSizeOption: [10, 20, 40, 60, 80, 100, 200],
      defaultValues: 'GB',
      productListMenu: '',
      productSubListMenu: [{}],
      rootSubmenuKeys: [],
      keys: '',
      openKeys: '',
      cardLoading: true,
      selectedRowKeys: [],
      collectUrlClass: '',
      htmlAll: '',
      disabledAll: false,
      successNumber: 0,
      errorNumber: 0,
      codeORcountrys,
      codeORcountry,
      data: [],
      selectkeyManage: '',
      siteManage: '',
      idManege: '',
      platformManege: 'amazon',
      ModalTextManage: '确定要删除吗',
      visibles: false,
      modals: false,
      ManageLoading: false,
      listLoading: false,
      editShow: false,
      editLoading: false,
      disabshow: true,
      categoryCN: false,
      tabClassLoading: false,
      delidManage: '',
      delManageAll: '',
      searchName: '',
      labelCol: { lg: { span: 6 }, sm: { span: 6 } },
      wrapperCol: { lg: { span: 15 }, sm: { span: 13 } },
      wrapperCols: { lg: { span: 16 }, sm: { span: 16 } },
      //弹窗
      // language:"EN",
      currency: 'GBP',
      prefix: '',
      firm: '',
      brand: '',
      prefixl: '',
      prefix2: '',
      Noexports: '',
      pageManage: '',
      currentManege: 1,
      pageSizeOptionManage: ['10', '20', '40', '60', '80', '100', '200'],
      addsloading: false,
      addloading: false,
      shop: '',
      // countryManage:"",
      classres: '',
      showclass: false,
      countrySelect: '',
      storeSelect: '',
      EXids: '',
      // failData:"",
      ExTxt: '',
      ReleasedIds: '',
      EXcountryValue: false,
      shopSearchInfo: '',
      clearselect: false,
      dataStatus: '',
      EditAll: '',
      storeId: '0',
      storeEdit: '',
      siteSelect: '',
      checkedValues: '',
      EditStoreId: '',
      brand_name: '',
      stock: '',
      bullet_point1: '',
      bullet_point2: '',
      bullet_point3: '',
      bullet_point4: '',
      bullet_point5: '',
      keywords: '',
      batchData: {
        store_id: '',
        country: '',
        brand_name: '',
        keywords: '',
        quantity: '',
        bullet_point1: '',
        bullet_point2: '',
        bullet_point3: '',
        bullet_point4: '',
        bullet_point5: '',
        category: ''
      },
      defaultSlate: '3',
      copyId: '',
      addId: '',
      bullet_pointAll: '',
      // 分类
      initCountry: '',
      siteValue: '',
      DEnum: '',
      ESnum: '',
      ITnum: '',
      USnum: '',
      CAnum: '',
      MXnum: '',
      AEnum: '',
      BRnum: '',
      FRnum: '',
      GBnum: '',
      INnum: '',
      TRnum: '',
      JPnum: '',
      AUnum: '',
      transWordLength: 0,
      countryCheck: [],
      disabShow: '',
      plainOptions1: [],
      plainOptions2: [],
      plainOptions3: [],
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkedList2: [],
      checkedList3: ['', ''],
      selectList: {
        DE: [],
        ES: [],
        IT: [],
        US: [],
        CA: [],
        MX: [],
        AE: [],
        BR: [],
        FR: [],
        GB: [],
        IN: [],
        TR: [],
        AU: [],
        JP: []
      },
      category: {
        DE: '',
        ES: '',
        IT: '',
        US: '',
        CA: '',
        MX: '',
        AE: '',
        BR: '',
        FR: '',
        GB: '',
        IN: '',
        TR: '',
        AU: '',
        JP: ''
      },
      selectDefaultArry: {
        DE: [],
        ES: [],
        IT: [],
        US: [],
        CA: [],
        MX: [],
        AE: [],
        BR: [],
        FR: [],
        GB: [],
        IN: [],
        TR: [],
        AU: [],
        JP: []
      },
      siteArrValue: [],
      searchStatus: {
        DE: false,
        ES: false,
        IT: false,
        US: false,
        CA: false,
        MX: false,
        AE: false,
        BR: false,
        FR: false,
        GB: false,
        IN: false,
        TR: false,
        AU: false,
        JP: false
      },
      searchDefaultData: {
        DE: {
          id: '',
          value: ''
        },
        ES: {
          id: '',
          value: ''
        },
        IT: {
          id: '',
          value: ''
        },
        US: {
          id: '',
          value: ''
        },
        CA: {
          id: '',
          value: ''
        },
        MX: {
          id: '',
          value: ''
        },
        AE: {
          id: '',
          value: ''
        },
        BR: {
          id: '',
          value: ''
        },
        FR: {
          id: '',
          value: ''
        },
        GB: {
          id: '',
          value: ''
        },
        IN: {
          id: '',
          value: ''
        },
        TR: {
          id: '',
          value: ''
        },
        AU: {
          id: '',
          value: ''
        },
        JP: {
          id: '',
          value: ''
        }
      },
      searchData: {
        DE: [],
        ES: [],
        IT: [],
        US: [],
        CA: [],
        MX: [],
        AE: [],
        BR: [],
        FR: [],
        GB: [],
        IN: [],
        TR: [],
        AU: [],
        JP: []
      },
      searchType: {
        DE: true,
        ES: true,
        IT: true,
        US: true,
        CA: true,
        MX: true,
        AE: true,
        BR: true,
        FR: true,
        GB: true,
        IN: true,
        TR: true,
        AU: true,
        JP: true
      },
      initLanguage: '',
      language,
      languageCode,
      languageCodeOrcountry,
      orilanguage: [],
      tranLoading: false,
      tranIdAll: [],
      languageValue: '',
      controllerAll: {
        title: true,
        detail: true,
        initialAll: true,
        keywords: true
      },
      initialAllCount: 500,
      initialAllText: '',
      isInitialAllBeyond: false,
      rowCount: 0,
      keywordsCount: 250,
      keywordsText: '',
      isKeyBeyond: false,
      addNewProduct: 1,
      form: this.$form.createForm(this),
      black_count: '0',
      blackSwitch: false,
      blackPic: require('@/assets/icons/black.png'),
      personalList: '',
      customClassValue: '',
      CheckMarkT: require('@/assets/icons/CheckMarkT.png'),
      CheckMarkF: require('@/assets/icons/CheckMarkF.png'),
      claimLoading: false,
      crawlNum: 0,
      showDownCrawl: true,
      categoryCrawlTitle: '开始分类采集'
    }
  },
  computed: {
    rowSelection () {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectManageAll = selectedRows,
            this.selectkey = selectedRowKeys,
            this.selectedRowKeys = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User',
            name: record.name
          }
        })
      }
    }
  },
  created () {
  },
  mounted () {
    Vue.ls.set('black', false)
    if (this.$route.query.isBlack) {
      this.blackSwitch = true
      Vue.ls.set('black', true)
      let dataInfo = {
        page: this.current,
        page_size: 10,
        is_black: 1
      }
      this.getCollectListFn(dataInfo)
    } else {
      if (Vue.ls.get('PAGE_SIZE')) {
        this.currentManege = Vue.ls.get('currentManege')
        this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
      } else {
        this.BlackAndWhiteList(10)
      }
    }
    this.getCountryList()
    if (Vue.ls.get('CHROME_ID')) {
      this.chromeCode = Vue.ls.get('CHROME_ID')
      this.showChromeCode = false
    }
    this.initCountry = 'zh'
    this.initLanguage = 'zh'
    this.defaultSlate = Vue.ls.get('SLATE_TYPE')
  },
  methods: {
    getChildList (obj, code) {
      let _this = this
      obj.forEach(function (itm, inx) {
        _this.selectDefaultArry[code].forEach(function (id, index) {
          if (itm.value == id) {
            _this.getauthCountry(id, code).then((res) => {
              if (res.length) {
                let childrenData = []
                res.forEach(function (item) {
                  let status
                  if (item.is_menu == 0) {
                    childrenData.push({
                      value: item.id,
                      label: item.category_cn,
                      tabValue: item.category,
                      code: code,
                      categoryid: item.node_id
                    })
                  } else {
                    childrenData.push({
                      value: item.id,
                      label: item.category_cn,
                      isLeaf: false,
                      tabValue: item.category,
                      code: code,
                      categoryid: item.node_id
                    })
                  }
                })
                itm.children = childrenData
                _this.getChildList(itm.children, code)
              }
            })
          }
        })
      })
      setTimeout(() => {
        _this.$store.commit('set_classLoading', false)
      }, 1000)
    },
    getauthCountry (val, site) {
      return authCountry({
        country: site,
        pid: val
      }).then((res) => {
        if (res.code === 0) {
          return res.data
        }
      })
    },
    loadDataInfo (selectedOptions) {
      let _this = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      this.getauthCountry(targetOption.value, targetOption.code).then((res) => {
        if (res.length) {
          let childrenData = []
          res.forEach(function (item) {
            let status
            if (item.is_menu == 0) {
              childrenData.push({
                value: item.id,
                label: item.category_cn,
                tabValue: item.category,
                code: targetOption.code,
                categoryid: item.node_id
              })
            } else {
              childrenData.push({
                value: item.id,
                label: item.category_cn,
                isLeaf: false,
                tabValue: item.category,
                code: targetOption.code,
                categoryid: item.node_id
              })
            }
          })
          targetOption.children = childrenData
          targetOption.loading = false
          _this.selectList[targetOption.code] = [..._this.selectList[targetOption.code]]
        }
      })
    },
    //搜索
    getSearchData (e, code, num) {
      if (e.target.value) {
        if (num == 1) {
          if (e.keyCode == '13') {
            search_category({
              country: code,
              keyword: e.target.value
            }).then((res) => {
              if (res.code === 0) {
                this.searchData[code] = res.data
                if (this.searchData[code].length) {
                  this.searchType[code] = true
                }
              } else {
                this.$notification.error({
                  message: '错误',
                  description: res.msg
                })
              }
            })
          }
        } else {
          search_category({
            country: code,
            keyword: e.target.value
          }).then((res) => {
            if (res.code === 0) {
              this.searchData[code] = res.data
              if (this.searchData[code].length) {
                this.searchType[code] = true
              }
            } else {
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      }
    },
    setSearchData (arr, code) {
      this.selectDefaultArry[code] = []
      this.selectDefaultData[code] = []
      this.selectedOptions[code] = []
      arr.forEach((item) => {
        this.selectDefaultArry[code].push(item.id)
        this.selectDefaultData[code].push(item.id + '')
        this.selectedOptions[code].push({
          label: item.category_cn,
          tabValue: item.category
        })
      })
      this.getChildList(this.selectList[code], code)
      this.searchDefaultData[code].id = arr.slice(-1)[0].id
      let str = ''
      arr.forEach(function (it, index) {
        if (index == arr.length - 1) {
          str += it.category_cn + ''
        } else {
          str += it.category_cn + '/'
        }
      })
      this.searchDefaultData[code].value = str
      this.searchType[code] = false
      this.searchStatus[code] = !this.searchStatus[code]
      setTimeout(() => {
        this.selectList = this.selectList
        this.selectDefaultData[code] = JSON.parse(JSON.stringify(this.selectDefaultData[code]))
      }, 1000)
    },
    //切换搜索
    showSearch (code) {
      this.searchStatus[code] = !this.searchStatus[code]
      this.searchData[code] = []
    },
    onSelectChange (value, selectedOptions, code) {
      this.selectedOptions[code] = selectedOptions
      this.selectDefaultData[code] = value
    },
    alertErr (val) {
      this.$notification.error({
        message: '错误',
        description: val
      })
    },

    jumpToOrderUrl (url) {
      if (url) {
        window.open(url, '_blank')
      }
    },
    //获取国家列表
    getCountryList () {
      let _this = this
      _this.countrySelect = []
      country_list({
        type: 1
      }).then((res) => {
        if (res.code === 0) {
          if (res.data.NA) {
            res.data.NA.forEach(function (country) {
              _this.countrySelect.push({
                title: country.code,
                value: country.title
              })
              _this.plainOptions1.push(country.title)
            })
          }
          if (res.data.EU) {
            res.data.EU.forEach(function (country) {
              _this.countrySelect.push({
                title: country.code,
                value: country.title
              })
              _this.plainOptions2.push(country.title)
            })
          }
          if (res.data.FE) {
            res.data.FE.forEach(function (country) {
              _this.countrySelect.push({
                title: country.code,
                value: country.title
              })
              _this.plainOptions3.push(country.title)
            })
          }
        }
      })
    },
    toCN () {
      this.categoryCN = !this.categoryCN
    },
    // 激活插件
    activation () {
      Vue.ls.set('CHROME_ID', this.chromeCode)
      let that = this
      this.showChromeCode = false
      const token = Vue.ls.get(ACCESS_TOKEN)
      const uid = Vue.ls.get(UID)
      const username = Vue.ls.get(USERNAME)
      if (window.chrome && window.chrome.runtime && window.chrome.runtime.sendMessage) {
        window.chrome.runtime.sendMessage(that.chromeCode, {
          type: 'login', msg: 'login', token: token, domain: that.GLOBAL.domain, uid: uid, username: username
        }, function (response) {
          try {
            if (response) {
              that.$notification.success({ message: '提醒', description: '插件通信成功' })
            } else {
              that.$notification.error({ message: '提醒', description: '插件通信失败' })
            }
          } catch (err) {
            that.$notification.error({ message: '提醒', description: '插件通信失败' })
          }
        })
      } else {
        that.$notification.error({ message: '提醒', description: '插件通信失败，请检查插件是否安装成功' })
      }
    },
    // 取消激活
    activationFn () {
      this.showChromeCode = true
    },
    // 下载插件
    downloadChrome () {
      window.open(this.GLOBAL.DOWNLOAD_FORMSL_URL, '_blank')
    },
    // 插件采集  单品
    toCollect () {
      this.crawlGood()
    },
    crawlGood () {
      let reg = /\n/g
      if (reg.test(this.collectUrl)) {
        var strs = new Array()
        strs = this.collectUrl.split(reg)
        let all = strs.length
        this.disableds = true
        this.disabledAll = true
        strs.forEach((item, index) => {
          this.newCrawlOneGood(item, 2, all)
        })
      } else {
        this.disableds = true
        this.disabledAll = true
        this.newCrawlOneGood(this.collectUrl, 1, 1)
      }
    },
    newCrawlOneGood(url, type, all) {
      let _this = this
      if (window.chrome && window.chrome.runtime && window.chrome.runtime.sendMessage) {
        window.chrome.runtime.sendMessage(_this.GLOBAL.chromeCode, {
          type: 'single', msg: 'Hello', url: url
        }, function (response) {
          try {
            if (response.code === 0) {
              crawlerCollect({
                url: url,
                html: response.html
              }).then(res => {
                _this.crawlNum += 1
                if (res.code === 0) {
                  if (type === 1) {
                    _this.disableds = false
                    _this.$notification.success({
                      message: '成功',
                      description: res.msg,
                      duration: 10
                    })
                    if (Vue.ls.get('PAGE_SIZE')) {
                      _this.disableds = false
                      _this.disabledAll = false
                      _this.currentManege = 1
                      _this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
                    } else {
                      _this.currentManege = 1
                      _this.disableds = false
                      _this.disabledAll = false
                      _this.BlackAndWhiteList(10)
                    }
                  } else {
                    _this.categoryCrawlTitle = '正在采集第' + _this.crawlNum + '条'
                  }
                  if (type === 2 && _this.crawlNum === all) {
                    _this.categoryCrawlTitle = '开始分类采集'
                    _this.crawlNum = 0
                    if (Vue.ls.get('PAGE_SIZE')) {
                      _this.disableds = false
                      _this.disabledAll = false
                      _this.currentManege = 1
                      _this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
                    } else {
                      _this.currentManege = 1
                      _this.disableds = false
                      _this.disabledAll = false
                      _this.BlackAndWhiteList(10)
                    }
                  }
                } else {
                  _this.categoryCrawlTitle = '开始分类采集'
                  _this.crawlNum = 0
                  _this.disableds = false
                  _this.disabledAll = false
                  _this.$notification.error({
                    message: '错误',
                    description: res.msg,
                    duration: 10
                  })
                }
              })
            } else {
              _this.crawlNum = 0
              _this.$notification.success({ message: '提醒', description: '采集失败' })
            }
          } catch (err) {
            _this.crawlNum = 0
            _this.$notification.success({ message: '提醒', description: '采集失败' })
          }
        })
      }
    },
    // 插件采集  分类采集
    toCollectAll () {
      this.crawlCategoryGood()
    },
    crawlCategoryGood() {
      let _this = this
      _this.disableds = true
      _this.disabledAll = true
      if (window.chrome && window.chrome.runtime && window.chrome.runtime.sendMessage) {
        window.chrome.runtime.sendMessage(_this.GLOBAL.chromeCode, {
          type: 'category', msg: 'Hello', url: _this.collectUrlClass
        }, function (response) {
          if (response.code === 0) {
            crawlerQueryCollect({
              url: _this.collectUrlClass,
              html: response.html
            }).then(res => {
              if (res.code === 0) {
                if (res.data.url.length > 0) {
                  let all = res.data.url.length
                  res.data.url.forEach((item, index) => {
                    _this.newCrawlOneGood(item, 2, all)
                  })
                } else {
                  _this.categoryCrawlTitle = '开始分类采集'
                  _this.disableds = false
                  _this.disabledAll = false
                  _this.$notification.error({
                    message: '错误',
                    description: '采集失败'
                  })
                }
              } else {
                _this.categoryCrawlTitle = '开始分类采集'
                _this.crawlNum = 0
                _this.disableds = false
                _this.disabledAll = false
                _this.$notification.error({
                  message: '错误',
                  description: res.msg
                })
              }
            })
          }
        })
      } else {
        _this.crawlNum = 0
        _this.disableds = false
        _this.disabledAll = false
        _this.$notification.error({
          message: '错误',
          description: '未安装插件，请先安装进行分类采集'
        })
      }
    },
    // 多个链接采集
    collectAll (strs) {
      let _this = this
      let num = 0
      let targetExtensionId = _this.chromeCode // 插件的ID
      strs.forEach((item, index) => {
        validateUrl({
          url: item
        }).then(res => {
          if (res.code === 0) {
            window.chrome.runtime.sendMessage(targetExtensionId, {
              type: 'single',
              action: 'getHtml',
              url: item,
              config: ''
            }, function (response) {
              _this.html = response.data.html
              //获取到html后发送给后端
              crawlerCollect({
                url: item,
                html: _this.html
              }).then(res => {
                num++
                if (res.code === 0) {
                  _this.successNumber += res.data.successCount
                  if (num === strs.length) {
                    if (Vue.ls.get('PAGE_SIZE')) {
                      _this.disableds = false
                      _this.disabledAll = false
                      _this.currentManege = 1
                      _this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
                    } else {
                      _this.disableds = false
                      _this.disabledAll = false
                      _this.currentManege = 1
                      _this.BlackAndWhiteList(10)
                    }
                    _this.disableds = false
                    _this.disabledAll = false
                    _this.$notification.success({
                      message: '成功',
                      description: '采集完成:成功' + _this.successNumber + '条,失败0条!',
                      duration: 10
                    })
                    num = 0
                  }
                } else {
                  _this.errorNumber = strs.length - _this.successNumber
                  if (strs.length - 1 == index) {
                    _this.disabledAll = false
                    _this.disableds = false
                    _this.$notification.error({
                      message: '失败',
                      description: '采集完成:成功' + _this.successNumber + '条,失败' + _this.errorNumber + '条!',
                      duration: 10
                    })
                  }
                }
              })
            })
          } else if (res.code === 1) {
            _this.disabledAll = false
            _this.disableds = false
            _this.$notification.error({
              message: '错误',
              description: '链接不可用'
            })
          }
        })
      })
      _this.successNumber = 0
      _this.errorNumber = 0
    },
    //后端采集
    toCollects () {
      if (this.collectUrl) {
        crawler({ urls: this.collectUrl })
          .then(res => {
            if (res.code === 0) {
              this.$notification.success({
                message: '采集成功',
                description: res.msg
              })
              if (Vue.ls.get('PAGE_SIZE')) {
                this.disableds = false
                this.currentManege = 1
                this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
              } else {
                this.disableds = false
                this.currentManege = 1
                this.BlackAndWhiteList(10)
              }
              this.disableds = false
            } else {
              this.disableds = false
              this.$notification.error({
                message: '采集失败',
                description: res.msg
              })
            }
          })
      } else {
        this.disableds = false
        this.$notification.error({
          message: '错误',
          description: '请输入采集链接'
        })
      }
    },
    // 删除
    prodels () {
      if (this.delAll === false) {
        this.collectData.forEach((item, index) => {
          if (item.id == this.delid) {
            this.collectData.splice(index, 1)
          }
        })
        boxdel({
          ids: this.delid,
          platform: this.platform
        }).then(res => {
          if (res.code === 0) {
            this.ModalText = res.msg
            if (Vue.ls.get('PAGE_SIZE')) {
              this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
            } else {
              this.BlackAndWhiteList(10)
            }
          } else {
          }
        })
      } else {
        if (this.selectManageAll) {
          let str = ''
          for (var i = 0; i < this.selectManageAll.length; i++) {
            str += (this.selectManageAll[i].id + ',')
          }
          this.ids = str.slice(0, -1)
          boxdel({
            ids: this.ids,
            platform: this.platform
          }).then(res => {
            if (res.code === 0) {
              this.ModalText = res.msg
              this.clearSelect()
              if (Vue.ls.get('PAGE_SIZE')) {
                this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
              } else {
                this.BlackAndWhiteList(10)
              }
            } else {
            }
          })
        }
      }
    },
    handleCancel (e) {
      this.visible = false
    },
    //单品认领
    Edits (id) {
      productApply({
        ids: id,
        platform: this.site
      }).then((res) => {
        if (res.code === 0) {
          this.collectData.forEach((item, index) => {
            if (item.id == id) {
              this.collectData.splice(index, 1)
            }
          })
          this.$notification.success({
            message: '提醒',
            description: res.msg
          })
        }
      })
    },
    jumpto (val) {
      window.open(val, '_blank')
    },
    onOpenChange (openKeys) {
      const latestOpenKey = openKeys.find(key => {
        return this.openKeys.indexOf(key) === -1
      })
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    callback (key) {
      if (key === '1' || key === '2') {
        if (Vue.ls.get('PAGE_SIZE')) {
          this.currentManege = Vue.ls.get('currentManege')
          this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
        } else {
          this.BlackAndWhiteList(10)
        }
      }
      this.clearSelect()
    },
    //清空勾选框
    clearSelect () {
      this.selectedRowKeys = []
      this.selectManageAll = []
      this.selectkey = []
    },
    getcategorys (country, id) {
      getcategory({
        country: country,
        pid: id
      }).then((res) => {
        if (res.code === 0) {
          this.rootSubmenuKeys = []
          this.productListMenu = res.data
          this.productListMenu.forEach((item, index) => {
            this.rootSubmenuKeys.push(item.id)
          })
          if (res.data.length > 0) {
            getcategory({
              country: country,
              pid: this.productListMenu[0].id
            }).then((res) => {
              if (res.code === 0) {
                if (res.data.length > 0) {
                }
                this.keys = res.data[0].id
                this.getGoodsList(this.defaultValues, res.data[0].id)
              }
            })
          }
        }
      })
    },
    subcategory (country, id) {
      getcategory({
        country: country,
        pid: id
      }).then((res) => {
        if (res.code === 0) {
          this.productListMenu.forEach((item, index) => {
            if (item.id === id) {
              this.productSubListMenu = res.data
            }
          })
        }
      })
    },
    copyTitle (txt) {
      //原生copy方法
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', txt)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$notification.success({
          message: '复制成功',
          description: '复制内容为:' + txt
        })
      }
      document.body.removeChild(input)
    },
    openTo (link) {
      window.open(link, '_blank')
    },
    pagechange (page, pagesize) {
      this.current = page
      this.currentManege = page
      Vue.ls.set('currentManege', page)
      this.BlackAndWhiteList(pagesize)
      this.clearSelect()
    },
    // 区分黑名单和白名单
    BlackAndWhiteList (pagesize) {
      this.claimLoading = false
      if (!this.blackSwitch) {
        this.getGoodsLists(pagesize)
      } else {
        let dataInfo = {
          page: this.current,
          page_size: pagesize,
          is_black: 1
        }
        this.getCollectListFn(dataInfo)
      }
    },
    // lll
    onShowSizeChange (current, pageSize) {
      this.BlackAndWhiteList(pageSize)
      Vue.ls.set('PAGE_SIZE', pageSize)
      Vue.ls.set('currentManege', current)
    },
    // 获取国家 和店铺信息
    getMyStores () {
      getMyStore({}).then((res) => {
        if (res.code === 0) {
          this.storeSelect = res.data,
            this.storeEdit = res.data
        }
      })
    },
    getGoodsLists (pagesize) {
      // over
      this.listLoading = true
      sourcwList({
        page: this.currentManege,
        page_size: pagesize
      }).then(res => {
        if (res.code == 0) {
          this.listLoading = false
          if (res.data.data.length > 0) {
            this.data = res.data.data
            this.currentManege = parseInt(res.pages.currentPage)
            this.pageManage = res.pages
            this.siteManage = res.data.data.platform
            this.black_count = res.data.black_count
          } else {
            this.data = []
            this.black_count = res.data.black_count
          }
        } else {
          this.listLoading = false
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })
    },
    handleChange (value) {
    },
    // change 导出国家选项
    EXcountryChange (value) {
      this.EXcountryValue = value.join(',')
      let str = ''
      for (var i = 0; i < this.selectManageAll.length; i++) {
        str += (this.selectManageAll[i].id + ',')
      }
      this.EXids = str.slice(0, -1)
      ExportCheck({
        country: this.EXcountryValue,
        ids: this.EXids
      }).then(res => {
        if (res.code === 0) {
          if (res.data.length > 0) {
            this.countryArr = res.data
          } else {
          }
        }
      })
    },
    onCheck (checkedValues) {
      this.checkedValues = checkedValues
      if (this.checkedValues.length == 0) {
        this.disabShow = true
      }
    },
    ChangeStore (val) {
      if (val === '0') {
        this.storeEdit = []
      } else {
        this.storeEdit.forEach((item, index) => {
          if (val === item.id) {
            this.siteSelect = item.mws_site
          }
        })
      }

    },
    editOk () {
      let _this = this
      this.editLoading = true
      let categoryId
      if (this.siteArrValue.length) {
        this.siteArrValue.forEach(function (site) {
          if (_this.searchStatus[site.code]) {
            _this.category[site.code] = _this.searchDefaultData[site.code].id
          } else {
            _this.category[site.code] = _this.selectDefaultData[site.code].slice(-1).toString()
          }
        })
        categoryId = JSON.parse(JSON.stringify(this.category))
        for (let cat in categoryId) {
          if (categoryId[cat] == '') {
            delete categoryId[cat]
          }
        }
        changeId({
          ids: categoryId
        }).then((res) => {
          if (res.code == 0) {
            categoryId = res.data
          }
        })
      } else {
        categoryId = {}
      }

      const { form: { validateFields } } = this
      validateFields((err, values) => {
        this.subvalues = values
      })

      if (this.siteArrValue.length) {
        if (JSON.stringify(categoryId) == '{}') {
          this.editLoading = false
          this.$notification.error({
            message: '错误',
            description: '保存失败，请选择分类'
          })
          return
        }
      }
      if (this.subvalues.initialAll.zh) {
        if (this.orilanguage.length) {
          this.orilanguage.forEach((item, index) => {
            if (!this.subvalues.initialAll[item]) {
              this.editLoading = false
              this.$notification.error({
                message: '错误',
                description: '保存失败，请选择目标语言并成功进行翻译'
              })
              return
            }
          })
        } else {
          this.editLoading = false
          this.$notification.error({
            message: '错误',
            description: '保存失败，请选择目标语言并进行翻译'
          })
          return
        }
      }
      if (this.subvalues.keywords.zh) {
        if (this.orilanguage.length) {
          this.orilanguage.forEach((item, index) => {
            if (!this.subvalues.keywords[item]) {
              this.editLoading = false
              this.$notification.error({
                message: '错误',
                description: '保存失败，请选择目标语言并成功进行翻译'
              })
              return
            }
          })
        } else {
          this.editLoading = false
          this.$notification.error({
            message: '错误',
            description: '保存失败，请选择目标语言并进行翻译'
          })
          return
        }
      }
      if (!this.brand_name && !this.stock && JSON.stringify(categoryId) == '{}' && !this.subvalues.initialAll.zh && !this.subvalues.keywords.zh) {
        this.editLoading = false
        this.$notification.error({
          message: '错误',
          description: '保存失败，如无需进行修改请点击取消'
        })
      } else {
        setTimeout(() => {
          batchUpdate({
            ids: this.EditAll,
            brand_name: this.brand_name,
            quantity: this.stock,
            category: categoryId,
            bullet_point1: this.subvalues.bullet_point1,
            bullet_point2: this.subvalues.bullet_point2,
            bullet_point3: this.subvalues.bullet_point3,
            bullet_point4: this.subvalues.bullet_point4,
            bullet_point5: this.subvalues.bullet_point5,
            keywords: this.subvalues.keywords
          }).then((res) => {
            if (res.code === 0) {
              this.$notification.success({
                message: '成功',
                description: res.msg
              })
              this.delinfo()
              setTimeout(() => {
                this.editShow = false
                this.editLoading = false
              }, 800)
              this.clearSelect()
              this.selectManageAll = ''
              this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))

            } else {
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
              setTimeout(() => {
                this.editShow = false
                this.editLoading = false
              }, 800)
              this.clearSelect()
              this.selectManageAll = ''
            }
          })
        }, 2000)
      }
    },
    editceldel (e) {
      this.delinfo()
      this.editShow = false
      this.storeId = '0'
      this.checkedValues = ''
      this.siteSelect = []
      this.countryCheck = []
      // 取消自定义分类数据
      this.customClassValue = ''
      this.siteArrValue = []
      this.checkedList1 = []
      this.checkedList2 = []
      this.checkedList3 = ['', '']
      this.searchStatus = {
        DE: false,
        ES: false,
        IT: false,
        US: false,
        CA: false,
        MX: false,
        AE: false,
        BR: false,
        FR: false,
        GB: false,
        IN: false,
        TR: false,
        AU: false,
        JP: false
      }

    },
    delinfo () {
      this.bullet_pointAll = ''
      this.brand_name = ''
      this.stock = ''
      this.bullet_point1 = ''
      this.bullet_point2 = ''
      this.bullet_point3 = ''
      this.bullet_point4 = ''
      this.bullet_point5 = ''
      this.keywords = ''
    },
    // 提交
    againNext (hide) {
      if (this.brand_name.length > 0 || this.stock.length > 0 || this.keywords.length > 0 || this.bullet_point1.length > 0 || this.bullet_point2.length > 0 || this.bullet_point3.length > 0 || this.bullet_point4.length > 0 || this.bullet_point5.length > 0 || parseFloat(this.storeId) > 0 || this.EditStoreId.length > 0) {
        batchUpdate({
          ids: this.EditAll,
          data: this.batchData,
          trans_type: this.defaultSlate
        }).then((res) => {
          if (res.code === 0) {
            if (hide) {
              setTimeout(hide, 0)
            }
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.delinfo()
            setTimeout(() => {
              this.editShow = false
              this.editLoading = false
            }, 800)
            this.clearSelect()
            this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
          } else {
            if (hide) {
              setTimeout(hide, 0)
            }
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            setTimeout(() => {
              this.editShow = false
              this.editLoading = false
            }, 800)
            this.clearSelect()
          }
        })
      } else {
        this.editLoading = false
        this.checkedValues = []
        if (hide) {
          setTimeout(hide, 0)
        }
        this.$notification.error({
          message: '错误',
          description: '请填写编辑信息!'
        })
      }
    },
    collectdel (id) {
      this.visibles = true
      this.delidManage = id
      this.delManageAll = false
    },
    prodelsManege () {
      //删除
      if (this.delManageAll === false) {
        this.data.forEach((item, index) => {
          if (item.id == this.delidManage) {
            this.data.splice(index, 1)
          }
        })
        sourceProductDeleted({
          goods_ids: this.delidManage
        }).then(res => {
          if (res.code === 0) {
            console.log(res.msg)
            if (Vue.ls.get('PAGE_SIZE')) {
              this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
            } else {
              this.BlackAndWhiteList(10)
            }
          } else {
          }
        })
      } else {
        //批量删除
        if (this.selectManageAll) {
          let str = ''
          for (var i = 0; i < this.selectManageAll.length; i++) {
            str += (this.selectManageAll[i].id + ',')
          }
          this.idManege = str.slice(0, -1)
          sourceProductDeleted({
            goods_ids: this.idManege
          }).then(res => {
            if (res.code === 0) {
              if (Vue.ls.get('PAGE_SIZE')) {
                this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
              } else {
                this.BlackAndWhiteList(10)
              }
            } else {
              this.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      }
    },
    collectdelAll () {
      if (this.selectManageAll.length > 0) {
        this.visibles = true
        this.delManageAll = true
      } else {
        this.$notification.error({
          message: '错误',
          description: '请先勾选删除的选项'
        })
      }
    },
    // 加入待发布
    released (id) {
      this.addId = id
      this.addloading = true
      insertPublish({
        goods_id: id
      }).then(res => {
        this.addloading = false
        if (res.code === 0) {
          this.addloading = false
          this.$notification.success({
            message: '成功',
            description: res.msg
          })
          this.BlackAndWhiteList(10)
        } else {
          this.addloading = false
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
        .catch(err => {
          this.addloading = false
        })
    },
    // 批量加入待发布
    toReleasedAll () {
      this.addsloading = true
      if (this.selectManageAll.length > 0) {
        let str = ''
        for (var i = 0; i < this.selectManageAll.length; i++) {
          str += (this.selectManageAll[i].id + ',')
        }
        this.ReleasedIds = str.slice(0, -1)
        insertPublish({
          goods_id: this.ReleasedIds
        }).then(res => {
          if (res.code === 0) {
            this.addsloading = false
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.clearSelect()
            this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
          } else {
            this.addsloading = false
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      } else {
        this.addsloading = false
        this.$notification.error({
          message: '错误',
          description: '请先勾选待发布的选项'
        })
      }
    },
    shopSearch () {
      this.blackSwitch = false
      let pagesize = Vue.ls.get('PAGE_SIZE') ? Vue.ls.get('PAGE_SIZE') : 10
      if (this.searchName) {
        this.shopSearchInfo = {
          page: this.currentManege,
          page_size: pagesize,
          title: this.searchName
        }
      } else {
        this.shopSearchInfo = {
          page: this.currentManege,
          page_size: pagesize
        }
      }
      sourcwList(this.shopSearchInfo).then(res => {
        if (res.code === 0) {
          let datas = res.data.data
          if (datas.length > 0) {
            this.data = datas
            this.pageManage = res.pages
            this.siteManage = datas.platform
            this.black_count = res.data.black_count
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
          } else {
            this.data = []
            this.$notification.error({
              message: '提醒',
              description: '获取内容为空'
            })
          }
        } else {
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })
    },
    Recharge () {
      this.$router.push({
        path: '/rechange/fund'
      })
    },
    shopchange (value) {
      this.shop = value
      this.countrySelect = {}
      this.storeSelect.forEach((item, idnex) => {
        if (item.id === this.shop) {
          Object.assign(this.countrySelect, item.mws_site)
        }
      })
    },
    handleBlur () {
    },
    handleFocus (i) {
    },
    handleOk (e) {
      this.prodelsManege()
      this.ManageLoading = true
      setTimeout(() => {
        this.visibles = false
        this.ManageLoading = false
        this.ModalTextManage = '确定要删除吗'
      }, 1000)
    },
    handleCanceldel (e) {
      this.visibles = false
    },

    //导出确认
    exportOk () {
      this.modalsLoading = true
      this.exportpost()
      setTimeout(() => {
        this.modals = false
        this.modalsLoading = false
      }, 1000)
      this.initialArr = []
      this.clearSelect()
      this.EXcountryValue = false
      this.allCountrysState = false
    },

    //字数限制
    wordCountLimit (type, str) {
      let _this = this
      let full_Value = str.target.value
      if (type == 2) {//关键字
        if (full_Value.length > 0 && full_Value.length <= 250) {
          _this.keywordsCount = 250 - full_Value.length
          _this.keywordsText = '还可输入' + _this.keywordsCount + '字'
          _this.isKeyBeyond = false
        } else if (full_Value.length > 250) {
          _this.isKeyBeyond = true
          _this.keywordsCount = full_Value.length - 250
          _this.keywordsText = '已超过' + _this.keywordsCount + '字'
        } else {
          _this.keywordsText = '还可输入250字'
          _this.isKeyBeyond = false
        }
      } else {//五点描述
        let c
        this.rowCount = 0
        for (let i = 0; i < full_Value.length; i++) {
          c = full_Value.substr(i, 1)
          if (c == '\r' || c == '\n') {
            this.rowCount++
          }
        }
        if (this.rowCount) {
          this.rowCount = this.rowCount + 1
        } else if (!this.rowCount && full_Value.length) {
          this.rowCount = this.rowCount + 1
        }
        if (full_Value.length > 0 && full_Value.length <= 2500) {
          _this.initialAllCount = 2500 - full_Value.length
          _this.initialAllText = '还可输入' + _this.initialAllCount + '字'
          _this.isInitialAllBeyond = false
        } else if (full_Value.length > 2500) {
          _this.isInitialAllBeyond = true
          _this.initialAllCount = full_Value.length - 2500
          _this.initialAllText = '已超过' + _this.initialAllCount + '字'
        } else {
          _this.initialAllText = '还可输入2500字'
          _this.isInitialAllBeyond = false
        }
      }
    },
    //黑名单
    toBlack () {
      this.blackSwitch = !this.blackSwitch
      Vue.ls.set('black', this.blackSwitch)
      this.currentManege = 1
      if (this.blackSwitch) {
        let dataInfo = {
          page: this.currentManege,
          page_size: 10,
          is_black: 1
        }
        this.getCollectListFn(dataInfo)
      } else {
        if (Vue.ls.get('PAGE_SIZE')) {
          this.currentManege = Vue.ls.get('currentManege')
          this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
        } else {
          this.BlackAndWhiteList(10)
        }
      }
    },
    getCollectListFn (dataInfo) {
      this.listLoading = true
      sourcwList(dataInfo).then(res => {
        if (res.code === 0) {
          if (res.data.data.length > 0) {
            this.data = res.data.data
            this.pageManage = res.pages
            this.siteManage = res.data.data.platform
            this.black_count = res.data.black_count
            this.listLoading = false
          } else {
            this.data = []
            this.black_count = res.data.black_count
            this.listLoading = false
          }
        } else {
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })

    },
    //虾皮版本
    // 认领相关
    ClaimAll (val) {
      if (this.selectManageAll.length > 0) {
        this.claimLoading = true
        let claimAllSelect = this.selectkey.join(',')
        claimProduct({
          platform: val,
          goods_ids: claimAllSelect
        }).then(res => {
          if (res.code === 0) {
            this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
          } else {
            this.claimLoading = false
            this.$notification.error({
              message: '提醒',
              description: res.msg
            })
            this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
          }
        })
      } else {
        this.$notification.error({
          message: '提醒',
          description: '请勾选认领的商品'
        })
      }
    },
    //单品认领
    Claim (val, id) {
      this.claimLoading = true
      claimProduct({
        platform: val,
        goods_ids: id
      }).then(res => {
        if (res.code === 0) {
          this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
        } else {
          this.claimLoading = false
          this.$notification.error({
            message: '提醒',
            description: res.msg
          })
        }
      })
    }
  },
  filters: {
    priceTlt (val) {
      return '￥' + val
    }
  }
}
</script>
<style lang="less" scoped>
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}

.list-articles-trigger {
  margin-left: 12px;
}

.mlspace {
  margin-left: 10px;
}

.ml {
  margin-left: 10px;
}

.mt {
  margin-top: 20px;
}

.mt-sm {
  margin-top: 10px;
}

.mb {
  margin-bottom: 20px;
}

.txt-color {
  color: #1890ff;
}

.mt-xl {
  margin-top: 40px;
}

.ant-tabs-bar {
  margin: none !important;
}

.font-sizes {
  font-size: 10px;
}

.mb-l {
  margin-bottom: 30px
}

.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}

.list-articles-trigger {
  margin-left: 12px;
}

.danger-color {
  color: #f5222d;
}

// .black-box{
//   width: 16px;
//   height: 16px;
//   img{
//     width: 100%;
//   }
// }

</style>
<style lang="less" scoped>
.mr-sm {
  margin-right: 10px;
}

.mb-sm {
  margin-bottom: 5px;
}

.mr {
  margin-right: 20px;
}

// .rt{
//   float:right;
// }
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.15) !important;
}

.word-wrap {
  word-break: break-all;
}

#id {
  padding-left: 20px
}

.spin-box {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  margin: 0;
  text-align: center;
  min-width: 90%;
  min-height: 90%;
  background: rgba(51, 51, 51, .05);
  z-index: 100;

  .spin {
    margin-top: 240px;
  }
}

.sta-box {
  position: relative;

  .sha-width {
    width: 55px;
  }

}

.status-pic {
  width: 14px;
  height: 14px;
  display: block;
  position: absolute;
  top: 4px;
  left: 58px;

  img {
    width: 100%;
    vertical-align: top;
  }
}

.lt {
  float: left;
}

.font-color-green {
  color: #07C160;
}

</style>
<style>
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.15) !important;
}

.tar {
  text-align: right;
}

/* .intcardtab > .ant-tabs-bar{
background: #fff;
} */

.beyondClass {
  color: red;
}

.limitTip {
  margin-left: 10px;
}

.modal_check_xu .ant-checkbox-group .ant-checkbox-group-item {
  width: 100%;
}

.search_card {
  position: absolute;
  top: 32px;
  left: 0;
  z-index: 10;
  padding: 5px;
  box-sizing: border-box;
  overflow: auto;
  width: 400px;
  height: 200px;
  background-color: #fff;
  border-top: 1px solid #dddddd;
  border-left: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
}

.search_li div span:last-child {
  color: red;
}

.category_li {
  color: #dddddd
}

.category_li span:last-child i {
  display: none;
}

.search_li div span:last-child i {
  display: none;
}

.search_li {
  cursor: pointer;
}

.search_li:hover {
  background-color: #dddddd;
}

.editAll .ant-row {
  margin-bottom: 0 !important
}

.flex-min-max {
  min-width: 100px;
  max-width: 350px;
}

.btn-bgcolor {
  color: #fff;
  background: #cdcdcd;
}

.btn-bgcolor:hover, .btn-bgcolor:focus {
  color: #fff;
  background: #cdcdcd;
  border-color: #fff;
}

.btn-bgcolorTab {
  color: #fff;
  background: #707070;
}

.btn-bgcolorTab:hover, .btn-bgcolorTab:focus {
  color: #fff;
  background: #707070;
  border-color: #fff;
}

.black-box {
  max-width: 22px;
  max-height: 22px;
}

.black-box-img {
  width: 100%;
}

.flex-box {
  /* display: flex; */
  /* justify-content: start; */
}

.overhidden {
  overflow: hidden;
}

</style>

