<template>
  <div class="basicinfo">
    <a-row type="flex" justify="end">
      <a-col class="tar">
        <!-- <a-button v-if='addNewProduct===1' type='primary' @click='submitOrAdd()'>保存并继续添加</a-button> -->
      </a-col>
    </a-row>
    <div v-if="this.$store.state.tabStatus.classLoading" class="spin-box">
      <a-spin class="spin" />
    </div>
    <a-form :form="form" :selfUpdate="true">
      <a-card :loading="cardLoading" class="mb-200">
        <a-form-item
          label="商品来源："
          :labelCol="{ md: {span:3}, lg: {span: 3}, xl: {span: 3} ,xxl:{span: 3} } "
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} } "
        >
          <a-input v-model="addNewUrl" v-decorator="['ori_url', { initialValue: data.ori_url }]" :disabled="editState"
                   :style="{ display: 'inline-block', width: 'calc(68% - 12px)' }" />
          <a-button type="primary" @click="jumpto(data.ori_url)" style="margin-left:10px">查看</a-button>
        </a-form-item>
        <a-form-item
          label="品牌名："
          :labelCol="{ md: {span:3}, lg: {span: 3}, xl: {span: 3} ,xxl:{span: 3} }"
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} }">
          <a-input @blur="brandchange()" :style="{ display: 'inline-block', width: 'calc(85% - 12px)'}"
                   placeholder="请输入品牌名"
                   v-decorator="['brand_name', { initialValue: addNewProduct === 0 ? data.brand_name : '',  }]" />
          <a-row class="dis-flex">
            <a-col>
              <a-alert v-if="brandwarning" message="品牌名不能为中文" type="warning" banner />
            </a-col>
          </a-row>
        </a-form-item>
        <!-- <a-form-item
          label="中文名称(报关)："
          :labelCol="{ md: {span:3}, lg: {span: 3}, xl: {span: 3} ,xxl:{span: 3} }"
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} }">
          <a-input placeholder='请输入中文名称' @blur="transBase"
            v-decorator="['clearance_cnName', {initialValue: addNewProduct === 0 ? data.clearance_cn_name : '',  }]"
            :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        </a-form-item> -->
        <!-- <a-form-item
          label="英文名称(报关)："
          :labelCol="{ md: {span:3}, lg: {span: 3}, xl: {span: 3} ,xxl:{span: 3} }"
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} }">
          <a-input placeholder='请输入英文名称'
            v-decorator="['clearance_enName', { initialValue: addNewProduct === 0 ? data.clearance_en_name :'',   }]"
            :style="{ display: 'inline-block', width: 'calc(85% - 12px)' }"/>
        </a-form-item> -->
        <a-form-item
          label="自定义产品分类："
          :labelCol="{ md: {span:3}, lg: {span: 3}, xl: {span: 3} ,xxl:{span: 3} }"
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} }">
          <a-select :disabled="this.$store.state.tabStatus.classLoading" defaultValue="" placeholder="请选择自定义分类"
                    style="width: 150px" @change="PersonalHandleChange">
            <a-select-option :value="item.id" v-for="(item,index) in personalList" :key="index">{{ item.title }}
            </a-select-option>
          </a-select>
          <span>
            选择分类太麻烦？点击这里使用自定义分类吧！
          </span>
        </a-form-item>
        <a-form-item
          label="产品分类："
          :labelCol="{ md: {span:3}, lg: {span: 3}, xl: {span: 3} ,xxl:{span: 3} }"
          :wrapperCol="{ md: {span:20}, lg: {span: 16}, xl: {span: 16} ,xxl:{span: 10} }">
          <div>
            <span>请选择国家：</span>
            <div v-if="plainOptions1">
              <a-checkbox :indeterminate="indeterminate1" @change="onCheckAllChange1" :checked="checkAll1">北美
              </a-checkbox>
              <a-checkbox-group :options="plainOptions1" v-model="checkedList1" @change="onChange1" />
            </div>
            <div v-if="plainOptions2">
              <a-checkbox :indeterminate="indeterminate2" @change="onCheckAllChange2" :checked="checkAll2">欧洲
              </a-checkbox>
              <a-checkbox-group :options="plainOptions2" v-model="checkedList2" @change="onChange2" />
            </div>
            <div v-if="plainOptions3">
              <a-checkbox-group :options="plainOptions3" v-model="checkedList3" @change="onChange3" />
            </div>
          </div>
        </a-form-item>
        <a-row v-if="siteValue.length">
          <a-col :span="3"></a-col>
          <a-col :span="8">
            <a-card>
              <div v-for="(site,index) in siteValue" :key="index" style="margin-bottom:10px">
                <a-row>
                  <a-col :span="5">
                    <a-button type="primary" style="margin-left:10px">{{ site.title }}</a-button>
                  </a-col>
                  <a-col :span="16" style="position:relative">
                    <a-cascader
                      :fieldNames="{ label: isToTrans?'tabValue':'label', value: 'value', children: 'children' }"
                      v-show="!searchStatus[site.code]"
                      v-model="selectDefaultData[site.code]"
                      :defaultValue="selectDefaultData[site.code]"
                      :options="selectList[site.code] || []"
                      @change="(value,selectedOptions)=>onSelectChange(value,selectedOptions,site.code)"
                      :loadData="loadDataInfo"
                      placeholder="Please select"
                    />
                    <a-input
                      v-model="searchDefaultData[site.code].value"
                      placeholder="请输入搜索内容"
                      @keydown="getSearchData($event,site.code,1)"
                      @blur="getSearchData($event,site.code,2)"
                      v-show="searchStatus[site.code]"
                    />
                    <div class="search_card"
                         v-show="searchStatus[site.code] && searchData[site.code].length && searchType[site.code]">
                      <a-row>
                        <a-col class="search_li" v-for="(search,index) in searchData[site.code]" :key="index"
                               @click="setSearchData(search,site.code)">
                          <div>
                            <span v-for="(sch,idex) in search" :key="idex">
                              {{ sch.category_cn }}
                              <i>/</i>
                            </span>
                          </div>
                          <div>
                            <span v-for="(sch,idex) in search" :key="idex">
                              {{ sch.category }}
                              <i>/</i>
                            </span>
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                  </a-col>
                  <a-col :span="3">
                    <a-button style="margin-left:10px" shape="circle" :type="searchStatus[site.code]?'primary':''"
                              icon="search" @click="showSearch(site.code)" />
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="5"></a-col>
                  <a-col :span="16" class="category_li">
                    <span v-for="(item,index) in selectedOptions[site.code]"
                          :key="index">{{ item.tabValue }}<i>/</i></span>
                  </a-col>
                </a-row>
              </div>
            </a-card>
          </a-col>
          <a-col :span="3">
            <!-- <a-button style="margin-left:10px" @click="toTrans()">{{tabTransText}}</a-button> -->
          </a-col>
        </a-row>
        <a-form-item
          :wrapperCol="{md: {span: 20, offset: 0}, lg: {span: 20, offset: 1}, xl: {span: 20, offset: 1}, xxl: {span: 20, offset: 2}}">
          <a-button class="ml" style="margin-left:72px; width:100px;" @click="cancel()">取消</a-button>
          <a-button type="primary" style="margin-left:30px; width:100px;" :loading="subloading" @click="updateContent">
            保存
          </a-button>
        </a-form-item>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import Vue from 'vue'
import {
  trans,
  get_base,
  country_list,
  authCountry,
  mwsReverse,
  update_base,
  search_category,
  changeId,
  getPersonalCategory,
  getAmazonCategory
} from '@/api/collect'
import { currencyList, Europe } from '@/views/order/public/country'

export default {
  name: '',
  props: [],
  data () {
    return {
      form: this.$form.createForm(this),
      addNewUrl: '',
      dataAll: '',
      data: '',
      editState: true,
      cardLoading: false,
      brandwarning: false,
      indeterminate1: false,
      indeterminate2: false,
      indeterminate3: false,
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkedList1: [],
      checkedList2: [],
      checkedList3: ['', ''],
      plainOptions1: [],
      plainOptions2: [],
      plainOptions3: [],
      addNewProduct: '',
      currencyList,
      countryAll: [],
      siteValue: [],
      Europe,
      classValue: '',
      classValueDE: '',
      classValueNL: '',
      classValueSE: '',
      classValueES: '',
      classValueIT: '',
      classValueUS: '',
      classValueCA: '',
      classValueMX: '',
      classValueAE: '',
      classValueBR: '',
      classValueFR: '',
      classValueGB: '',
      classValueIN: '',
      classValueTR: '',
      classValueAU: '',
      classValueJP: '',
      classValuePL: '',
      selectValue: [],
      selectValueDE: [],
      selectValueNL: [],
      selectValueSE: [],
      selectValueES: [],
      selectValueIT: [],
      selectValueUS: [],
      selectValueMX: [],
      selectValueAE: [],
      selectValueBR: [],
      selectValueFR: [],
      selectValueGB: [],
      selectValueIN: [],
      selectValueTR: [],
      selectValueCA: [],
      selectValueAU: [],
      selectValueJP: [],
      selectValuePL: [],
      updataStepIdDE: '',
      updataStepIdNL: '',
      updataStepIdSE: '',
      updataStepIdES: '',
      updataStepIdIT: '',
      updataStepIdUS: '',
      updataStepIdCA: '',
      updataStepIdMX: '',
      updataStepIdAE: '',
      updataStepIdBR: '',
      updataStepIdFR: '',
      updataStepIdGB: '',
      updataStepIdIN: '',
      updataStepIdTR: '',
      updataStepIdAU: '',
      updataStepIdJP: '',
      updataStepIdPL: '',
      updataStepId: '',
      selectList: {
        DE: [],
        NL: [],
        SE: [],
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
        JP: [],
        PL: []
      },
      selectDefaultData: {
        DE: [],
        NL: [],
        SE: [],
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
        JP: [],
        PL: []
      },
      selectDefaultArry: {
        DE: [],
        NL: [],
        SE: [],
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
        JP: [],
        PL: []
      },
      selectListDE: [],
      selectListNL: [],
      selectListSE: [],
      selectListES: [],
      selectListIT: [],
      selectListUS: [],
      selectListCA: [],
      selectListMX: [],
      selectListAE: [],
      selectListBR: [],
      selectListFR: [],
      selectListGB: [],
      selectListIN: [],
      selectListTR: [],
      selectListAU: [],
      selectListJP: [],
      selectListPL: [],
      subloading: false,
      searchStatus: {
        DE: false,
        NL: false,
        SE: false,
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
        JP: false,
        PL: false
      },
      searchData: {
        DE: [],
        NL: [],
        SE: [],
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
        JP: [],
        PL: []
      },
      searchDefaultData: {
        DE: {
          id: '',
          value: ''
        },
        NL: {
          id: '',
          value: ''
        },
        SE: {
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
        },
        PL: {
          id: '',
          value: ''
        }
      },
      searchType: {
        DE: true,
        NL: true,
        SE: true,
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
        JP: true,
        PL: true
      },
      searchValue: '',
      category: {
        DE: '',
        NL: '',
        SE: '',
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
        JP: '',
        PL: ''
      },
      isToTrans: false,
      tabTransText: '将中文翻译成原语言',
      chromeCode: this.GLOBAL.chrome.id,
      selectedOptions: {
        DE: [],
        NL: [],
        SE: [],
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
        JP: [],
        PL: []
      },
      personalList: ''
    }
  },
  methods: {
    jumpto (val) {
      if (val) {
        window.open(val, '_blank')
      } else if (val == null) {
        window.open(this.addNewUrl, '_blank')
      } else {
        this.$notification.error({
          message: '提醒',
          description: '跳转失败'
        })
      }
    },
    // 获取商品信息  llll
    getBaseInfo () {
      let _this = this
      get_base({
        id: _this.goodsId //_this.goodsId
      }).then((res) => {
        if (res.code === 0) {
          _this.data = res.data
          _this.cardLoading = false
          _this.form.setFieldsValue({
            'store_id': '0'
          })
          _this.reverseCheck(res.data.category, '1')
        }
      })
    },
    //反查结果
    reverseCheck (reverseArr, state) {
      let _this = this
      if (state === '0') {
        _this.selectDefaultData = {
          'DE': [],
          'NL': [],
          'SE': [],
          'ES': [],
          'IT': [],
          'US': [],
          'CA': [],
          'MX': [],
          'AE': [],
          'BR': [],
          'FR': [],
          'GB': [],
          'IN': [],
          'TR': [],
          'AU': [],
          'JP': [],
          'PL': []
        }
        _this.selectedOptions = {
          DE: [],
          NL: [],
          SE: [],
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
          JP: [],
          PL: []
        }
        this.$notification.warning({
          message: '提醒',
          description: '自定义分类没有设置值'
        })
        this.$store.commit('set_classLoading', false)
      } else if (state === '1') {
        if (reverseArr.length) {
          reverseArr.forEach(function (item) {
            switch (item.country) {
              case 'DE':
                _this.checkedList2.push('德国')
                _this.countryAll.push('德国')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('德国')
                  }
                })
                break
              case 'NL':
                _this.checkedList2.push('荷兰')
                _this.countryAll.push('荷兰')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('荷兰')
                  }
                })
                break
              case 'SE':
                _this.checkedList2.push('瑞典')
                _this.countryAll.push('瑞典')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('瑞典')
                  }
                })
                break
              case 'ES':
                _this.checkedList2.push('西班牙')
                _this.countryAll.push('西班牙')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('西班牙')
                  }
                })
                break
              case 'IT':
                _this.checkedList2.push('意大利')
                _this.countryAll.push('意大利')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('意大利')
                  }
                })
                break
              case 'US':
                _this.checkedList1.push('美国')
                _this.countryAll.push('美国')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('美国')
                  }
                })
                break
              case 'MX':
                _this.checkedList1.push('墨西哥')
                _this.countryAll.push('墨西哥')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('墨西哥')
                  }
                })
                break
              case 'AE':
                _this.checkedList1.push('阿拉伯联合酋长国')
                _this.countryAll.push('阿拉伯联合酋长国')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('阿拉伯联合酋长国')
                  }
                })
                break
              case 'BR':
                _this.checkedList1.push('巴西')
                _this.countryAll.push('巴西')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('巴西')
                  }
                })
                break
              case 'FR':
                _this.checkedList2.push('法国')
                _this.countryAll.push('法国')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('法国')
                  }
                })
                break
              case 'GB':
                _this.checkedList2.push('英国')
                _this.countryAll.push('英国')
                if (_this.checkedList2.length > 0 && _this.checkedList2.length < _this.plainOptions2.length) {
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('英国')
                  }
                })
                break
              case 'IN':
                _this.checkedList1.push('印度')
                _this.countryAll.push('印度')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('印度')
                  }
                })
                break
              case 'TR':
                _this.checkedList1.push('土耳其')
                _this.countryAll.push('土耳其')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('土耳其')
                  }
                })
                break
              case 'CA':
                _this.checkedList1.push('加拿大')
                _this.countryAll.push('加拿大')
                if (_this.checkedList1.length > 0 && _this.checkedList1.length < _this.plainOptions1.length) {
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('加拿大')
                  }
                })
                break
              case 'AU':
                _this.checkedList3.push('澳大利亚')
                _this.countryAll.push('澳大利亚')
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('澳大利亚')
                  }
                })
                break
              case 'JP':
                _this.checkedList3.push('日本')
                _this.countryAll.push('日本')
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('日本')
                  }
                })
                break
              case 'PL':
                _this.checkedList3.push('波兰')
                _this.countryAll.push('波兰')
                _this.getmwsReverse(item.country, item.category, item.cid).then((res) => {
                  if (res.stepId.length) {
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue('波兰')
                  }
                })
                break
            }
          })
        }
      }
    },
    //反向获取分类id
    getmwsReverse (code, node_id, cid) {
      return mwsReverse({
        country: code,
        node_id: node_id,
        cid: cid
      }).then((res) => {
        if (res.code === 0) {
          this.selectedOptions[code] = []
          res.data.title.forEach((item, index) => {
            this.selectedOptions[code].push({
              tabValue: item
            })
          })
          return res.data
        }
      })
    },
    // 判断 是不是中文 brandchange
    brandchange () {
      if (this.isZN(this.form.getFieldValue('brand_name'))) {
        this.brandwarning = true
      } else {
        this.brandwarning = false
      }
    },
    isZN (txt) {
      let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      if (reg.test(txt)) {
        // 不是英文
        return true
      } else {
        // 是英文
        return false
      }
    },
    onChange1 (checkedList) {
      let _this = this
      this.indeterminate1 = !!checkedList.length && checkedList.length < this.plainOptions1.length
      this.checkAll1 = checkedList.length === this.plainOptions1.length
      let unCheckData = []
      this.plainOptions1.forEach(function (item) {
        if (checkedList.indexOf(item) == -1) {
          unCheckData.push(item)
        }
      })
      if (unCheckData.length) {
        unCheckData.forEach(function (item) {
          if (_this.countryAll.indexOf(item) > -1) {
            _this.countryAll.splice(_this.countryAll.indexOf(item), 1)
            let code = _this.outPutCode(item)
            if (_this.selectList[code]) {
              _this.selectList[code] = []
            }
            _this.selectDefaultData[code] = []
            let siteArry = JSON.parse(JSON.stringify(_this.siteValue))
            siteArry.forEach(function (val, index) {
              if (val.title == item) {
                _this.siteValue.splice(index, 1)
              }
            })
          }
        })
      }
      checkedList.forEach(function (item) {
        if (_this.countryAll.indexOf(item) == -1) {
          _this.countryAll.push(item)
          _this.getSiteValue(item)
        }
      })
      // this.getSiteValue()
    },
    onChange2 (checkedList) {
      let _this = this
      this.indeterminate2 = !!checkedList.length && checkedList.length < this.plainOptions2.length
      this.checkAll2 = checkedList.length === this.plainOptions2.length
      let unCheckData = []
      this.plainOptions2.forEach(function (item) {
        if (checkedList.indexOf(item) == -1) {
          unCheckData.push(item)
        }
      })
      if (unCheckData.length) {
        unCheckData.forEach(function (item) {
          if (_this.countryAll.indexOf(item) > -1) {
            _this.countryAll.splice(_this.countryAll.indexOf(item), 1)
            let code = _this.outPutCode(item)
            if (_this.selectList[code]) {
              _this.selectList[code] = []
            }
            _this.selectDefaultData[code] = []
            let siteArry = JSON.parse(JSON.stringify(_this.siteValue))
            siteArry.forEach(function (val, index) {
              if (val.title == item) {
                _this.siteValue.splice(index, 1)
              }
            })
          }
        })
      }
      checkedList.forEach(function (item) {
        if (_this.countryAll.indexOf(item) == -1) {
          _this.countryAll.push(item)
          _this.getSiteValue(item)
        }
      })
    },
    onChange3 (checkedList) {
      let _this = this
      let unCheckData = []
      this.plainOptions3.forEach(function (item) {
        if (checkedList.indexOf(item) == -1) {
          unCheckData.push(item)
        }
      })
      if (unCheckData.length) {
        unCheckData.forEach(function (item) {
          if (_this.countryAll.indexOf(item) > -1) {
            _this.countryAll.splice(_this.countryAll.indexOf(item), 1)
            let code = _this.outPutCode(item)
            if (_this.selectList[code]) {
              _this.selectList[code] = []
            }
            _this.selectDefaultData[code] = []
            let siteArry = JSON.parse(JSON.stringify(_this.siteValue))
            siteArry.forEach(function (val, index) {
              if (val.title == item) {
                _this.siteValue.splice(index, 1)
              }
            })
          }
        })
      }
      checkedList.forEach(function (item) {
        if (_this.countryAll.indexOf(item) == -1) {
          _this.countryAll.push(item)
          _this.getSiteValue(item)
        }
      })
    },
    onCheckAllChange1 (e) {
      let _this = this
      Object.assign(this, {
        checkedList1: e.target.checked ? this.plainOptions1 : [],
        indeterminate1: false,
        checkAll1: e.target.checked
      })
      if (this.checkAll1) {
        this.plainOptions1.forEach(function (item) {
          if (_this.countryAll.indexOf(item) == -1) {
            _this.countryAll.push(item)
            _this.getSiteValue(item)
          }
        })
      } else {
        this.plainOptions1.forEach(function (item, index) {
          if (_this.countryAll.indexOf(item) > -1) {
            _this.countryAll.splice(_this.countryAll.indexOf(item), 1)
            let code = _this.outPutCode(item)
            if (_this.selectList[code]) {
              delete _this.selectList[code]
            }
            if (_this.selectList[code]) {
              _this.selectList[code] = []
            }
            _this.selectDefaultData[code] = []
            let siteArry = JSON.parse(JSON.stringify(_this.siteValue))
            siteArry.forEach(function (val, index) {
              if (val.title == item) {
                _this.siteValue.splice(index, 1)
              }
            })
          }
        })
      }
    },
    onCheckAllChange2 (e) {
      let _this = this
      Object.assign(this, {
        checkedList2: e.target.checked ? this.plainOptions2 : [],
        indeterminate2: false,
        checkAll2: e.target.checked
      })
      if (this.checkAll2) {
        this.plainOptions2.forEach(function (item) {
          if (_this.countryAll.indexOf(item) == -1) {
            _this.countryAll.push(item)
            _this.getSiteValue(item)
          }
        })
      } else {
        this.plainOptions2.forEach(function (item, index) {
          if (_this.countryAll.indexOf(item) > -1) {
            _this.countryAll.splice(_this.countryAll.indexOf(item), 1)
            let code = _this.outPutCode(item)
            if (_this.selectList[code]) {
              delete _this.selectList[code]
            }
            if (_this.selectList[code]) {
              _this.selectList[code] = []
            }
            _this.selectDefaultData[code] = []
            let siteArry = JSON.parse(JSON.stringify(_this.siteValue))
            siteArry.forEach(function (val, index) {
              if (val.title == item) {
                _this.siteValue.splice(index, 1)
              }
            })
          }
        })
      }
    },
    //输出国家代码
    outPutCode (str) {
      switch (str) {
        case '德国':
          return 'DE'
          break
        case '荷兰':
          return 'NL'
          break
        case '瑞典':
          return 'SE'
          break
        case '西班牙':
          return 'ES'
          break
        case '意大利':
          return 'IT'
          break
        case '美国':
          return 'US'
          break
        case '墨西哥':
          return 'MX'
          break
        case '阿拉伯联合酋长国':
          return 'AE'
          break
        case '巴西':
          return 'BR'
          break
        case '法国':
          return 'FR'
          break
        case '英国':
          return 'GB'
          break
        case '印度':
          return 'IN'
          break
        case '土耳其':
          return 'TR'
          break
        case '加拿大':
          return 'CA'
          break
        case '澳大利亚':
          return 'AU'
          break
        case '日本':
          return 'JP'
          break
        case '波兰':
          return 'PL'
          break
      }
    },
    //获取下拉列表数据
    getSiteValue (code) {
      let _this = this
      switch (code) {
        case '德国':
          _this.siteValue.push({
            title: '德国',
            code: 'DE'
          })
          this.getSelectList('0', 'DE')
          break
        case '荷兰':
          _this.siteValue.push({
            title: '荷兰',
            code: 'NL'
          })
          this.getSelectList('0', 'NL')
          break
        case '瑞典':
          _this.siteValue.push({
            title: '瑞典',
            code: 'SE'
          })
          this.getSelectList('0', 'SE')
          break
        case '西班牙':
          _this.siteValue.push({
            title: '西班牙',
            code: 'ES'
          })
          this.getSelectList('0', 'ES')
          break
        case '意大利':
          _this.siteValue.push({
            title: '意大利',
            code: 'IT'
          })
          this.getSelectList('0', 'IT')
          break
        case '荷兰':
          _this.siteValue.push({
            title: '荷兰',
            code: 'NL'
          })
          this.getSelectList('0', 'NL')
          break
        case '瑞典':
          _this.siteValue.push({
            title: '瑞典',
            code: 'SE'
          })
          this.getSelectList('0', 'NL')
          break
        case '美国':
          _this.siteValue.push({
            title: '美国',
            code: 'US'
          })
          this.getSelectList('0', 'US')
          break
        case '墨西哥':
          _this.siteValue.push({
            title: '墨西哥',
            code: 'MX'
          })
          this.getSelectList('0', 'MX')
          break
        case '阿拉伯联合酋长国':
          _this.siteValue.push({
            title: '阿拉伯联合酋长国',
            code: 'AE'
          })
          this.getSelectList('0', 'AE')
          break
        case '巴西':
          _this.siteValue.push({
            title: '巴西',
            code: 'BR'
          })
          this.getSelectList('0', 'BR')
          break
        case '法国':
          _this.siteValue.push({
            title: '法国',
            code: 'FR'
          })
          this.getSelectList('0', 'FR')
          break
        case '英国':
          _this.siteValue.push({
            title: '英国',
            code: 'GB'
          })
          this.getSelectList('0', 'GB')
          break
        case '印度':
          _this.siteValue.push({
            title: '印度',
            code: 'IN'
          })
          this.getSelectList('0', 'IN')
          break
        case '土耳其':
          _this.siteValue.push({
            title: '土耳其',
            code: 'TR'
          })
          this.getSelectList('0', 'TR')
          break
        case '加拿大':
          _this.siteValue.push({
            title: '加拿大',
            code: 'CA'
          })
          this.getSelectList('0', 'CA')
          break
        case '澳大利亚':
          _this.siteValue.push({
            title: '澳大利亚',
            code: 'AU'
          })
          this.getSelectList('0', 'AU')
          break
        case '日本':
          _this.siteValue.push({
            title: '日本',
            code: 'JP'
          })
          this.getSelectList('0', 'JP')
          break
        case '波兰':
          _this.siteValue.push({
            title: '波兰',
            code: 'PL'
          })
          this.getSelectList('0', 'PL')
          break
      }
      _this.siteValue = _this.uniqueArray(_this.siteValue, 'title')
    },
    uniqueArray (arr, param) {
      if (Array.isArray(arr)) {
        let temp = []
        let newArr = arr.reduce((acc, cur) => {
          if (temp.indexOf(cur[param]) === -1) {
            temp.push(cur[param])
            acc.push(cur)
            return acc
          } else {
            console.log(acc)
            return acc
          }
        }, [])
        return newArr
      }
    },
    setSelectData (data, code) {
      let dataInfo = []
      data.forEach(function (dat) {
        if (dat.is_menu == 0) {
          dataInfo.push({
            value: dat.id,
            label: dat.category_cn,
            tabValue: dat.category,
            code: code,
            categoryid: dat.node_id
          })
        } else {
          dataInfo.push({
            value: dat.id,
            label: dat.category_cn,
            tabValue: dat.category,
            isLeaf: false,
            code: code,
            categoryid: dat.node_id
          })
        }
      })
      return dataInfo
    },
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
    getSelectList (val, code) {
      let _this = this
      authCountry({
        country: code,
        pid: val
      }).then((res) => {
        if (res.code === 0) {
          let selectData = []
          if (code == 'DE') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.DE = selectData
            console.log(_this.selectList, 'selectList')
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.DE, code)
            }
          } else if (code == 'NL') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.NL = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.NL, code)
            }
          } else if (code == 'SE') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.SE = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.SE, code)
            }
          } else if (code == 'ES') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.ES = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.ES, code)
            }
          } else if (code == 'NL') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.NL = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.NL, code)
            }
          } else if (code == 'IT') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.IT = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.IT, code)
            }
          } else if (code == 'US') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.US = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.US, code)
            }
          } else if (code == 'MX') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.MX = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.MX, code)
            }
          } else if (code == 'AE') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.AE = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.AE, code)
            }
          } else if (code == 'BR') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.BR = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.BR, code)
            }
          } else if (code == 'FR') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.FR = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.FR, code)
            }
          } else if (code == 'GB') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.GB = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.GB, code)
            }
          } else if (code == 'IN') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.IN = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.IN, code)
            }
          } else if (code == 'TR') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.TR = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.TR, code)
            }
          } else if (code == 'CA') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.CA = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.CA, code)
            }
          } else if (code == 'AU') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.AU = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.AU, code)
            }
          } else if (code == 'JP') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.JP = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.JP, code)
            }
          } else if (code == 'PL') {
            selectData = _this.setSelectData(res.data, code)
            _this.selectList.PL = selectData
            if (_this.selectDefaultArry[code].length > 0) {
              _this.getChildList(_this.selectList.JP, code)
            }
          }
          setTimeout(() => {
            _this.selectList = _this.selectList
            _this.selectDefaultData[code] = JSON.parse(JSON.stringify(_this.selectDefaultData[code]))
          }, 3000)
        }
      })
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
    //获取国家列表
    getCountryList () {
      let _this = this
      country_list({
        type: 1
      }).then((res) => {
        if (res.code === 0) {
          let countryData = res.data.amazon
          if (countryData.NA) {
            countryData.NA.forEach(function (country) {
              _this.plainOptions1.push(country.title)
            })
          }
          if (countryData.EU) {
            countryData.EU.forEach(function (country) {
              _this.plainOptions2.push(country.title)
            })
          }
          if (countryData.FE) {
            countryData.FE.forEach(function (country) {
              _this.plainOptions3.push(country.title)
            })
          }
        }
      })
    },
    // 反向返显联级菜单多国家
    mwsReversesAll () {
      if (this.dataAll) {
        if (this.siteValue.length) {
          this.siteValue.forEach((item, index) => {
            if (this.dataAll[item]) {
              this.mwsReverses(item, this.dataAll[item].category)
            }
          })
        } else {
          this.Europe.forEach((item, index) => {
            if (this.dataAll[item.title]) {
              this.mwsReverses(item.title, this.dataAll[item.title].category)
            }
          })
        }
      }
    },
    mwsReverses (country, category) {
      // 请求 参数 id
      mwsReverse({
        country: country,
        node_id: category
      }).then((res) => {
        if (res.code === 0) {
          if (country === 'DE') {
            // 把最后一级的nodeID保存
            this.classValueDE = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueDE = res.data.id
            this.updataStepIdDE = []
            for (var i in res.data.id) {
              this.updataStepIdDE[i] = res.data.id[i]
            }
            this.updataStepIdDE.splice(0, 0, '0')
            if (this.classValueDE) {
              this.disabShow = false
            }
            this.updataStepIdDE.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListDE[value] = v
                  if (this.updataStepIdDE.length === (value + 1)) {
                    this.selectListDE.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'NL') {
            this.classValueNL = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueNL = res.data.id
            this.updataStepIdNL = []
            for (var i in res.data.id) {
              this.updataStepIdNL[i] = res.data.id[i]
            }
            this.updataStepIdNL.splice(0, 0, '0')
            if (this.classValueNL) {
              this.disabShow = false
            }
            this.updataStepIdNL.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListNL[value] = v
                  if (this.updataStepIdNL.length === (value + 1)) {
                    this.selectListNL.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'SE') {
            this.classValueSE = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueSE = res.data.id
            this.updataStepIdSE = []
            for (var i in res.data.id) {
              this.updataStepIdSE[i] = res.data.id[i]
            }
            this.updataStepIdSE.splice(0, 0, '0')
            if (this.classValueSE) {
              this.disabShow = false
            }
            this.updataStepIdSE.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListSE[value] = v
                  if (this.updataStepIdSE.length === (value + 1)) {
                    this.selectListSE.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'ES') {
            this.classValueES = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueES = res.data.id
            this.updataStepIdES = []
            for (var i in res.data.id) {
              this.updataStepIdES[i] = res.data.id[i]
            }
            this.updataStepIdES.splice(0, 0, '0')
            if (this.classValueES) {
              this.disabShow = false
            }
            this.updataStepIdES.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListES[value] = v
                  if (this.updataStepIdES.length === (value + 1)) {
                    this.selectListES.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'IT') {
            this.classValueIT = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueIT = res.data.id
            this.updataStepIdIT = []
            for (var i in res.data.id) {
              this.updataStepIdIT[i] = res.data.id[i]
            }
            this.updataStepIdIT.splice(0, 0, '0')
            if (this.classValueIT) {
              this.disabShow = false
            }
            this.updataStepIdIT.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListIT[value] = v
                  if (this.updataStepIdIT.length === (value + 1)) {
                    this.selectListIT.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'US') {
            this.classValueUS = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueUS = res.data.id
            this.updataStepIdUS = []
            for (var i in res.data.id) {
              this.updataStepIdUS[i] = res.data.id[i]
            }
            this.updataStepIdUS.splice(0, 0, '0')
            if (this.classValueUS) {
              this.disabShow = false
            }
            this.updataStepIdUS.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListUS[value] = v
                  if (this.updataStepIdUS.length === (value + 1)) {
                    this.selectListUS.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'MX') {
            this.classValueMX = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueMX = res.data.id
            this.updataStepIdMX = []
            for (var i in res.data.id) {
              this.updataStepIdMX[i] = res.data.id[i]
            }
            this.updataStepIdMX.splice(0, 0, '0')
            if (this.classValueMX) {
              this.disabShow = false
            }
            this.updataStepIdMX.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListMX[value] = v
                  if (this.updataStepIdMX.length === (value + 1)) {
                    this.selectListMX.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'AE') {
            this.classValueAE = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueAE = res.data.id
            this.updataStepIdAE = []
            for (var i in res.data.id) {
              this.updataStepIdAE[i] = res.data.id[i]
            }
            this.updataStepIdAE.splice(0, 0, '0')
            if (this.classValueAE) {
              this.disabShow = false
            }
            this.updataStepIdAE.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListAE[value] = v
                  if (this.updataStepIdAE.length === (value + 1)) {
                    this.selectListAE.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'BR') {
            this.classValueBR = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueBR = res.data.id
            this.updataStepIdBR = []
            for (var i in res.data.id) {
              this.updataStepIdBR[i] = res.data.id[i]
            }
            this.updataStepIdBR.splice(0, 0, '0')
            if (this.classValueBR) {
              this.disabShow = false
            }
            this.updataStepIdBR.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListBR[value] = v
                  if (this.updataStepIdBR.length === (value + 1)) {
                    this.selectListBR.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'FR') {
            this.classValueFR = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueFR = res.data.id
            this.updataStepIdFR = []
            for (var i in res.data.id) {
              this.updataStepIdFR[i] = res.data.id[i]
            }
            this.updataStepIdFR.splice(0, 0, '0')
            if (this.classValueFR) {
              this.disabShow = false
            }
            this.updataStepIdFR.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListFR[value] = v
                  if (this.updataStepIdFR.length === (value + 1)) {
                    this.selectListFR.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'GB') {
            this.classValueGB = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueGB = res.data.id
            this.updataStepIdGB = []
            for (var i in res.data.id) {
              this.updataStepIdGB[i] = res.data.id[i]
            }
            this.updataStepIdGB.splice(0, 0, '0')
            if (this.classValueGB) {
              this.disabShow = false
            }
            this.updataStepIdGB.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListGB[value] = v
                  if (this.updataStepIdGB.length === (value + 1)) {
                    this.selectListGB.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'IN') {
            this.classValueIN = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueIN = res.data.id
            this.updataStepIdIN = []
            for (var i in res.data.id) {
              this.updataStepIdIN[i] = res.data.id[i]
            }
            this.updataStepIdIN.splice(0, 0, '0')
            if (this.classValueIN) {
              this.disabShow = false
            }
            this.updataStepIdIN.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListIN[value] = v
                  if (this.updataStepIdIN.length === (value + 1)) {
                    this.selectListIN.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'TR') {
            this.classValueTR = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueTR = res.data.id
            this.updataStepIdTR = []
            for (var i in res.data.id) {
              this.updataStepIdTR[i] = res.data.id[i]
            }
            this.updataStepIdTR.splice(0, 0, '0')
            if (this.classValueTR) {
              this.disabShow = false
            }
            this.updataStepIdTR.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListTR[value] = v
                  if (this.updataStepIdTR.length === (value + 1)) {
                    this.selectListTR.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'CA') {
            this.classValueCA = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueCA = res.data.id
            this.updataStepIdCA = []
            for (var i in res.data.id) {
              this.updataStepIdCA[i] = res.data.id[i]
            }
            this.updataStepIdCA.splice(0, 0, '0')
            if (this.classValueCA) {
              this.disabShow = false
            }
            this.updataStepIdCA.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListCA[value] = v
                  if (this.updataStepIdCA.length === (value + 1)) {
                    this.selectListCA.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'JP') {
            this.classValueJP = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueJP = res.data.id
            this.updataStepIdJP = []
            for (var i in res.data.id) {
              this.updataStepIdJP[i] = res.data.id[i]
            }
            this.updataStepIdJP.splice(0, 0, '0')
            if (this.classValueJP) {
              this.disabShow = false
            }
            this.updataStepIdJP.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListJP[value] = v
                  if (this.updataStepIdJP.length === (value + 1)) {
                    this.selectListJP.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'AU') {
            this.classValueAU = res.data.stepId[res.data.stepId.length - 1]
            this.selectValueAU = res.data.id
            this.updataStepIdAU = []
            for (var i in res.data.id) {
              this.updataStepIdAU[i] = res.data.id[i]
            }
            this.updataStepIdAU.splice(0, 0, '0')
            if (this.classValueAU) {
              this.disabShow = false
            }
            this.updataStepIdAU.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListAU[value] = v
                  if (this.updataStepIdAU.length === (value + 1)) {
                    this.selectListAU.pop()
                  }
                })
              }, value * 200)
            })
          } else if (country === 'PL') {
            this.classValuePL = res.data.stepId[res.data.stepId.length - 1]
            this.selectValuePL = res.data.id
            this.updataStepIdPL = []
            for (var i in res.data.id) {
              this.updataStepIdPL[i] = res.data.id[i]
            }
            this.updataStepIdPL.splice(0, 0, '0')
            if (this.classValuePL) {
              this.disabShow = false
            }
            this.updataStepIdPL.forEach((item, value) => {
              setTimeout(() => {
                this.getauthCountry(item, country).then((v) => {
                  this.selectListPL[value] = v
                  if (this.updataStepIdPL.length === (value + 1)) {
                    this.selectListPL.pop()
                  }
                })
              }, value * 200)
            })
          }
        }
      })
    },
    onSelectChange (value, selectedOptions, code) {
      this.selectedOptions[code] = selectedOptions
      this.selectDefaultData[code] = value
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
    //提交
    updateContent (type) {
      let _this = this
      this.subloading = true
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          this.siteValue.forEach(function (site) {
            if (_this.searchStatus[site.code]) {
              _this.category[site.code] = _this.searchDefaultData[site.code].id
            } else {
              _this.category[site.code] = _this.selectDefaultData[site.code].slice(-1).toString()
            }
          })
          let category = JSON.parse(JSON.stringify(_this.category))
          for (let cat in category) {
            if (category[cat] == '') {
              delete category[cat]
            }
          }
          changeId({
            ids: category
          }).then((res) => {
            if (res.code == 0) {
              let categoryInfo = {}
              Object.keys(category).forEach((item, index) => {
                let idObj = {
                  node_id: res.data[item],
                  cid: category[item]
                }
                categoryInfo[item] = idObj
              })
              update_base({
                id: _this.goodsId,//_this.goodsId
                ori_url: values.ori_url,
                brand_name: values.brand_name,
                clearance_cnName: values.clearance_cnName,
                clearance_enName: values.clearance_enName,
                category: categoryInfo
              }).then((res) => {
                if (res.code == 0) {
                  this.subloading = false
                  this.goodsId = res.data.id
                  this.$store.commit('set_goodsId', res.data.id)
                  this.$store.commit('set_subTabone', true)
                  if (type === 'forbid') {
                  } else {
                    this.$notification.success({
                      message: '提醒',
                      description: res.msg
                    })
                  }
                } else {
                  this.$store.commit('set_subTabone', false)
                  this.subloading = false
                  if (type === 'forbid') {
                  } else {
                    this.$notification.error({
                      message: '失败',
                      description: res.msg
                    })
                  }
                }
              })
                .catch(() => {
                  let _this = this
                  _this.subloading = false
                  _this.$notification.error({
                    message: '提醒',
                    description: '基本信息保存访问超时，请重新操作'
                  })
                  this.$store.commit('set_subTabone', 'error')
                })
            }
          })

        }
      })
    },
    //切换搜索
    showSearch (code) {
      this.searchStatus[code] = !this.searchStatus[code]
      this.searchData[code] = []
    },
    //切换语言
    toTrans () {
      this.isToTrans = !this.isToTrans
      if (this.isToTrans) {
        this.tabTransText = '将原语言翻译成中文'
      } else {
        this.tabTransText = '将中文翻译成原语言'
      }
    },
    cancel () {
      this.$emit('commonSignOut')
    },
    //自动填充英文报关信息
    transBase (e) {
      let _this = this
      if (e.target.value) {
        _this.chromeTran('auto', 'en', e.target.value)
      }
    },
    // 插件翻译
    chromeTran (sl, tl, q) {
      let _this = this
      let h = window.chrome
      let targetExtensionId = _this.chromeCode // 插件的ID
      let tk = _this.tokenFn(q)
      h && h.runtime && h.runtime.sendMessage ?
        window.chrome.runtime.sendMessage(targetExtensionId, {
          type: 'single',
          action: 'detect'
        }, function (response) {
          if (response === 'ok') {
            window.chrome.runtime.sendMessage(targetExtensionId, {
              action: 'translate',
              transData: {
                sl: 'zh',
                tl: tl,
                tk: tk,
                q: encodeURI(q)
              }
            }, function (response) {
              if (response.state === 'ok') {
                let ret = response.data[0]
                let data = ''
                for (let i = 0; i < ret.length; i++) {
                  if (ret[i][0]) {
                    data += ret[i][0]
                  }
                }
                let resData = data
                _this.form.setFieldsValue({
                  'clearance_enName': resData
                })
              } else {
                _this.totranManage(q)
              }
            })
          } else {
            _this.totranManage(q)
          }
        }) : (console.log('插件未安裝'), _this.totranManage(q))
    },
    totranManage (q) {
      trans({
        q: q,
        to: 'en',
        trans_type: '3'
      }).then((res) => {
        if (res.code === 0) {
          this.form.setFieldsValue({
            'clearance_enName': res.data.en
          })
        }
      })
    },
    tokenFn (a) {
      var k = ''
      var b = 406644
      var b1 = 3293161072
      var jd = '.'
      var sb = '+-a^+6'
      var Zb = '+-3^+b+-f'

      for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var m = a.charCodeAt(g)
        128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023),
          e[f++] = m >> 18 | 240,
          e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224,
          e[f++] = m >> 6 & 63 | 128),
          e[f++] = m & 63 | 128)
      }
      a = b
      for (f = 0; f < e.length; f++) {
        a += e[f],
          a = this.RL(a, sb)
      }
      a = this.RL(a, Zb)
      a ^= b1 || 0
      0 > a && (a = (a & 2147483647) + 2147483648)
      a %= 1E6
      return a.toString() + jd + (a ^ b)
    },
    RL (a, b) {
      var t = 'a'
      var Yb = '+'
      for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2),
          d = d >= t ? d.charCodeAt(0) - 87 : Number(d),
          d = b.charAt(c + 1) == Yb ? a >>> d : a << d
        a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d
      }
      return a
    },
    // 自定义分类相关代码
    // 获取自定义分类列表
    getPersonalCategoryFn () {
      getPersonalCategory().then((res) => {
        if (res.code === 0) {
          this.personalList = res.data
        }
      })
    },
    PersonalHandleChange (value) {
      console.log(value)
      this.getAmazonCategoryFn(value)
      this.$store.commit('set_classLoading', true)
    },
    // 查询自定义分类结果
    getAmazonCategoryFn (val) {
      getAmazonCategory({
        id: val
      }).then((res) => {
        if (res.code === 0) {
          console.log(res.data)
          this.classProcessorFn(res.data)
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg
          })
        }
      })
    },
    //自定义分类根据不同的结果 处理分类反查
    classProcessorFn (data) {
      if (JSON.stringify(data) === '{}') {
        let reverseArr = [
          { country: 'DE', category: '0' },
          { country: 'NL', category: '0' },
          { country: 'SE', category: '0' },
          { country: 'US', category: '0' },
          { country: 'CA', category: '0' },
          { country: 'MX', category: '0' },
          { country: 'ES', category: '0' },
          { country: 'IT', category: '0' },
          { country: 'FR', category: '0' },
          { country: 'GB', category: '0' },
          { country: 'AU', category: '0' },
          { country: 'JP', category: '0' },
          { country: 'PL', category: '0' }
        ]
        this.reverseCheck(reverseArr, '0')
      } else {
        let reverseArr = []
        this.siteValue = []
        this.checkedList1 = []
        this.checkedList2 = []
        this.checkedList3 = ['', '']
        this.searchStatus = {
          DE: false,
          NL: false,
          SE: false,
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
          JP: false,
          PL: false
        }
        Object.keys(data).forEach((item, index, value) => {
          let reverseObj = {
            country: '',
            category: '',
            cid: ''
          }
          if (typeof (data[item].cid) == 'string') {
            reverseObj.cid = data[item].cid
          } else {
            reverseObj.cid = toString(data[item].cid)
          }
          reverseObj.country = item
          reverseObj.category = data[item].node_id
          reverseArr.push(reverseObj)
        })
        this.reverseCheck(reverseArr, '1')
      }
    },
    //保存并添加
    submitOrAdd () {
      this.goodsId = ''
      this.updateContent()
    }
  },
  mounted () {
    this.getCountryList()
    this.$store.commit('set_Tabone', true)
    this.goodsId = this.$route.query.id
    if (this.goodsId) {
      this.$store.commit('set_goodsId', this.goodsId)
    }
    this.site = this.$route.query.site
    this.addNewProduct = Number(this.$route.query.type)
    if (this.addNewProduct === 1) {
      this.editState = false
    } else {
      this.getBaseInfo()
      this.editState = true
    }
    if (Vue.ls.get('CHROME_ID')) {
      this.chromeCode = Vue.ls.get('CHROME_ID')
    } else {
      this.chromeCode = this.GLOBAL.chrome.id
    }
    this.getPersonalCategoryFn()
  }
}
</script>
<style lang="less" scoped>
.tar {
  text-align: right;
}

.basicinfo {

}

.dis-flex {
  display: flex;
  flex-wrap: wrap;
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

.spin-box {
  position: absolute;
  border-radius: 4px;
  margin: 0;
  text-align: center;
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, .05);
  z-index: 100;

  .spin {
    margin-top: 240px;
  }
}

.mb-200 {
  margin-bottom: 100px;
}
</style>
