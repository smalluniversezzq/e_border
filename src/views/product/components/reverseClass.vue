<template>
  <div>
    <a-row>
      <a-col>自定义分类：</a-col>
      <!-- {{selectDefaultData}} -->
    </a-row>
    <a-row class="mt">
      <a-col span="3">
        <a-select
          :disabled="this.$store.state.tabStatus.classLoading"
          defaultValue=""
          placeholder="请选择自定义分类"
          style="width: 150px"
          @change="PersonalHandleChange"
        >
          <a-select-option :value="item.id" v-for="(item, index) in personalList" :key="index">{{
            item.title
          }}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row class="mt">
      <a-col>产品分类</a-col>
    </a-row>
    <a-row class="mt">
      <a-col>
        <div>
          <span>请选择国家：</span>
          <div v-if="plainOptions1.length>0">
            <a-checkbox :indeterminate="indeterminate1" @change="onCheckAllChange1" :checked="checkAll1">北美</a-checkbox>
            <a-checkbox-group :options="plainOptions1" v-model="checkedList1" @change="onChange1" />
          </div>
      
          <div v-if="plainOptions2.length>0">
            <a-checkbox :indeterminate="indeterminate2" @change="onCheckAllChange2" :checked="checkAll2">欧洲</a-checkbox>
            <a-checkbox-group  :options="plainOptions2" v-model="checkedList2" @change="onChange2" />
          </div>
          <div v-if="plainOptions3.length>0">
            <a-checkbox-group :options="plainOptions3" v-model="checkedList3" @change="onChange3" />
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row v-if="siteValue.length">
        <!-- <a-col :span="3"></a-col> -->
        <a-col :span="12">
          <a-card>
            <div v-for="(site,index) in siteValue" :key="index" style="margin-bottom:10px">
              <a-row>
                <a-col :span="5"><a-button type="primary" style="margin-left:10px">{{site.title}}</a-button></a-col>
                <a-col :span="16" style="position:relative">
                  <a-cascader
                   style="width:240px"
                    :fieldNames="{ label: isToTrans?'tabValue':'label', value: 'value', children: 'children' }"
                    v-show="!searchStatus[site.code]"
                    v-model="selectDefaultData[site.code]"
                    :defaultValue="selectDefaultData[site.code]"
                    :options="selectList[site.code] || []"
                    @change="(value,selectedOptions)=>onSelectChange(value,selectedOptions,site.code)"
                    :loadData="loadDataInfo"
                    placeholder="请输入搜索的内容"
                  />
                  <a-input 
                    style="width:240px"
                    v-model="searchDefaultData[site.code].value" 
                    placeholder='请输入搜索内容' 
                    @keydown="getSearchData($event,site.code,1)" 
                    @blur="getSearchData($event,site.code,2)" 
                    v-show="searchStatus[site.code]"
                  />
                  <div class="search_card" v-show="searchStatus[site.code] && searchData[site.code].length && searchType[site.code]">
                    <a-row>
                      <a-col class="search_li" v-for="(search,index) in searchData[site.code]" :key="index" @click="setSearchData(search,site.code)">
                        <div>
                          <span v-for="(sch,idex) in search" :key="idex">
                            {{sch.category_cn}}
                            <i>/</i>
                          </span>
                        </div>
                        <div>
                          <span v-for="(sch,idex) in search" :key="idex">
                            {{sch.category}}
                            <i>/</i>
                          </span>
                        </div>  
                      </a-col>
                    </a-row>
                  </div>
                </a-col>
                <a-col :span="3">
                  <a-button style="margin-left:10px" shape="circle" :type="searchStatus[site.code]?'primary':''" icon="search" @click="showSearch(site.code)"/>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="5"></a-col>
                <a-col :span="16" class="category_li">
                  <span v-for="(item,index) in selectedOptions[site.code]" :key="index">{{item.tabValue}}<i>/</i></span>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
        <a-col :span="3">
          <!-- <a-button style="margin-left:10px" @click="toTrans()">{{tabTransText}}</a-button> -->
        </a-col>
    </a-row>
  </div>
</template>
<script>
import { getPersonalCategory ,getAmazonCategory ,mwsReverse ,authCountry ,country_list,search_category} from '@/api/collect'
import { currencyList, Europe } from '@/views/order/public/country'
export default {
  data() {
    return {
//自定义分类
      personalList: '',
      // 分类
      plainOptions1:[],
      plainOptions2:[],
      plainOptions3:[],
      indeterminate1: false,
      indeterminate2: false,
      indeterminate3: false,
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkedList1: [],
      checkedList2: [],
      checkedList3: ['',''],
      addNewProduct:'',
      currencyList,
      countryAll:[],
      siteValue:[],
      Europe,
      classValue:"",
      classValueDE:"",
      classValueNL:"",
      classValueES:"",
      classValueIT:"",
      classValueUS:"",
      classValueCA:"",
      classValueMX:"",
      classValueAE:"",
      classValueBR:"",
      classValueFR:"",
      classValueGB:"",
      classValueIN:"",
      classValueTR:"",
      classValueAU:"",
      classValueJP:"",
      classValuePL:"",
      selectValue:[],
      selectValueDE:[],
      selectValueNL:[],
      selectValueES:[],
      selectValueIT:[],
      selectValueUS:[],
      selectValueMX:[],
      selectValueAE:[],
      selectValueBR:[],
      selectValueFR:[],
      selectValueGB:[],
      selectValueIN:[],
      selectValueTR:[],
      selectValueCA:[],
      selectValueAU:[],
      selectValueJP:[],
      selectValuePL:[],
      updataStepIdDE:"",
      updataStepIdNL:"",
      updataStepIdES:"",
      updataStepIdIT:"",
      updataStepIdUS:"",
      updataStepIdCA:"",
      updataStepIdMX:"",
      updataStepIdAE:"",
      updataStepIdBR:"",
      updataStepIdFR:"",
      updataStepIdGB:"",
      updataStepIdIN:"",
      updataStepIdTR:"",
      updataStepIdAU:"",
      updataStepIdJP:"",
      updataStepIdPL:"",
      updataStepId:"",
      selectList:{
        DE:[],
        NL:[],
        ES:[],
        IT:[],
        US:[],
        CA:[],
        MX:[],
        AE:[],
        BR:[],
        FR:[],
        GB:[],
        IN:[],
        TR:[],
        AU:[],
        JP:[],
        PL:[]
      },
      selectDefaultData:{
        DE:[],
        NL:[],
        ES:[],
        IT:[],
        US:[],
        CA:[],
        MX:[],
        AE:[],
        BR:[],
        FR:[],
        GB:[],
        IN:[],
        TR:[],
        AU:[],
        JP:[],
        PL:[]
      },
      selectDefaultArry:{
        DE:[],
        NL:[],
        ES:[],
        IT:[],
        US:[],
        CA:[],
        MX:[],
        AE:[],
        BR:[],
        FR:[],
        GB:[],
        IN:[],
        TR:[],
        AU:[],
        JP:[],
        PL:[]
      },
      selectListDE:[],
      selectListNL:[],
      selectListES:[],
      selectListIT:[],
      selectListUS:[],
      selectListCA:[],
      selectListMX:[],
      selectListAE:[],
      selectListBR:[],
      selectListFR:[],
      selectListGB:[],
      selectListIN:[],
      selectListTR:[],
      selectListAU:[],
      selectListJP:[],
      selectListPL:[],
      subloading:false,
      searchStatus:{
        DE:false,
        NL:false,
        ES:false,
        IT:false, 
        US:false,
        CA:false,
        MX:false,
        AE:false,
        BR:false,
        FR:false,
        GB:false,
        IN:false,
        TR:false,
        AU:false,
        JP:false,
        PL:false
      },
      searchData:{
        DE:[],
        NL:[],
        ES:[],
        IT:[],
        US:[],
        CA:[],
        MX:[],
        AE:[],
        BR:[],
        FR:[],
        GB:[],
        IN:[],
        TR:[],
        AU:[],
        JP:[],
        PL:[]
      },
      searchDefaultData:{
        DE:{
          id:'',
          value:''
        },
        NL:{
          id:'',
          value:''
        },
        ES:{
          id:'',
          value:''
        },
        IT:{
          id:'',
          value:''
        },
        US:{
          id:'',
          value:''
        },
        CA:{
          id:'',
          value:''
        },
        MX:{
          id:'',
          value:''
        },
        AE:{
          id:'',
          value:''
        },
        BR:{
          id:'',
          value:''
        },
        FR:{
          id:'',
          value:''
        },
        GB:{
          id:'',
          value:''
        },
        IN:{
          id:'',
          value:''
        },
        TR:{
          id:'',
          value:''
        },
        AU:{
          id:'',
          value:''
        },
        JP:{
          id:'',
          value:''
        },
        PL:{
          id:'',
          value:''
        }
      },
      searchType:{
        DE:true,
        NL:true,
        ES:true,
        IT:true,
        US:true,
        CA:true,
        MX:true,
        AE:true,
        BR:true,
        FR:true,
        GB:true,
        IN:true,
        TR:true,
        AU:true,
        JP:true,
        PL:true
      },
      searchValue:'',
      category:{
        DE:'',
        NL:'',
        ES:'',
        IT:'',
        US:'',
        CA:'',
        MX:'',
        AE:'',
        BR:'',
        FR:'',
        GB:'',
        IN:'',
        TR:'',
        AU:'',
        JP:'',
        PL:''
      },
      selectedOptions:{
        DE:[],
        NL:[],
        ES:[],
        IT:[],
        US:[],
        CA:[],
        MX:[],
        AE:[],
        BR:[],
        FR:[],
        GB:[],
        IN:[],
        TR:[],
        AU:[],
        JP:[],
        PL:[]
      },
      isToTrans:false,
    }
  },
  created() {},
  mounted() {
    this.getCountryList()
    this.getPersonalCategoryFn()
  },
  methods:{
    // 自定义分类相关代码
    // 获取自定义分类列表
    // 父组件调用
    reverseCheck(reverseArr,state){
      console.log(reverseArr,"reverseArr")
      let _this = this;
      if(state === '0'){
        _this.selectDefaultData = { "DE": [], "NL": [],"ES": [], "IT": [], "US": [], "CA": [], "MX": [], "AE": [], "BR": [], "FR": [], "GB": [], "IN": [], "TR": [], "AU": [], "JP": [], "PL": [] }
        // _this.Subheading = false
        _this.selectedOptions={
          DE:[],
          NL:[],
          ES:[],
          IT:[],
          US:[],
          CA:[],
          MX:[],
          AE:[],
          BR:[],
          FR:[],
          GB:[],
          IN:[],
          TR:[],
          AU:[],
          JP:[],
          PL:[]
        }
        this.$notification.warning({
          message: '提醒',
          description: '自定义分类没有设置值',
        });
        this.$store.commit('set_classLoading',false)
      }else if(state ==='1'){
        if(reverseArr.length){
          console.log(reverseArr,'reverseArr1')
          reverseArr.forEach(function(item){
            switch(item.country){
              case "DE":
                _this.checkedList2.push("德国")
                _this.countryAll.push("德国")
                if(_this.checkedList2.length>0&&_this.checkedList2.length<_this.plainOptions2.length){
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("德国")
                  }
                });
                break;
                case "NL":
                _this.checkedList2.push("荷兰")
                _this.countryAll.push("荷兰")
                if(_this.checkedList2.length>0&&_this.checkedList2.length<_this.plainOptions2.length){
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("荷兰")
                  }
                });
                break;
              case "ES":
                _this.checkedList2.push("西班牙")
                _this.countryAll.push("西班牙")
                if(_this.checkedList2.length>0&&_this.checkedList2.length<_this.plainOptions2.length){
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("西班牙")
                  }
                });
                break;
              case "IT":
                _this.checkedList2.push("意大利")
                _this.countryAll.push("意大利")
                if(_this.checkedList2.length>0&&_this.checkedList2.length<_this.plainOptions2.length){
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("意大利")
                  }
                });
                break;
              case "US":
                _this.checkedList1.push("美国")
                _this.countryAll.push("美国")
                if(_this.checkedList1.length>0&&_this.checkedList1.length<_this.plainOptions1.length){
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("美国")
                  }
                });
                break;
              case "MX":
                _this.checkedList1.push("墨西哥")
                _this.countryAll.push("墨西哥")
                if(_this.checkedList1.length>0&&_this.checkedList1.length<_this.plainOptions1.length){
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("墨西哥")
                  }
                });
                break;
              case "AE":
                _this.checkedList1.push("阿拉伯联合酋长国")
                _this.countryAll.push("阿拉伯联合酋长国")
                if(_this.checkedList1.length>0&&_this.checkedList1.length<_this.plainOptions1.length){
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("阿拉伯联合酋长国")
                  }
                });
                break;
              case "BR":
                _this.checkedList1.push("巴西")
                _this.countryAll.push("巴西")
                if(_this.checkedList1.length>0&&_this.checkedList1.length<_this.plainOptions1.length){
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("巴西")
                  }
                });
                break;
              case "FR":
                _this.checkedList2.push("法国")
                _this.countryAll.push("法国")
                if(_this.checkedList2.length>0&&_this.checkedList2.length<_this.plainOptions2.length){
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("法国")
                  }
                });
                break;
              case "GB":
                _this.checkedList2.push("英国")
                _this.countryAll.push("英国")
                if(_this.checkedList2.length>0&&_this.checkedList2.length<_this.plainOptions2.length){
                  _this.indeterminate2 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("英国")
                  }
                });
                break;
              case "IN":
                _this.checkedList1.push("印度")
                _this.countryAll.push("印度")
                if(_this.checkedList1.length>0&&_this.checkedList1.length<_this.plainOptions1.length){
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("印度")
                  }
                });
                break;
              case "TR":
                _this.checkedList1.push("土耳其")
                _this.countryAll.push("土耳其")
                if(_this.checkedList1.length>0&&_this.checkedList1.length<_this.plainOptions1.length){
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("土耳其")
                  }
                });
                break;
              case "CA":
                _this.checkedList1.push("加拿大")
                _this.countryAll.push("加拿大")
                if(_this.checkedList1.length>0&&_this.checkedList1.length<_this.plainOptions1.length){
                  _this.indeterminate1 = true
                }
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("加拿大")
                  }
                });
                break;
              case "AU":
                _this.checkedList3.push('澳大利亚')
                _this.countryAll.push("澳大利亚")
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("澳大利亚")
                  }
                });
                break;
              case "JP":
                _this.checkedList3.push('日本')
                _this.countryAll.push("日本")
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("日本")
                  }
                });
                break;
              case "PL":
                _this.checkedList3.push('波兰')
                _this.countryAll.push("波兰")
                _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                  if(res.stepId.length){
                    _this.selectDefaultData[item.country] = res.id
                    _this.selectDefaultArry[item.country] = res.id
                    _this.getSiteValue("波兰")
                  }
                });
                break;
            }
          })
 
        }
      } 
    },
    //反向获取分类id
    getmwsReverse(code,node_id,cid){
      console.log(code,node_id,cid,"123")
      return mwsReverse({
        country:code,
        node_id:node_id,
        cid:cid
      }).then((res)=>{
        if(res.code === 0){
          this.selectedOptions[code] = []
          console.log(res.data.title,'title')
          res.data.title.forEach((item,index)=>{
            this.selectedOptions[code].push({
              tabValue:item
            })
          })
          return res.data
        }
      })
    },
    getPersonalCategoryFn() {
      getPersonalCategory().then((res) => {
        if (res.code === 0) {
          this.personalList = res.data
        }
      })
    },
    PersonalHandleChange(value) {
      console.log(value)
      this.getAmazonCategoryFn(value)
      this.$store.commit('set_classLoading', true)
    },
    // 查询自定义分类结果
    getAmazonCategoryFn(val) {
      getAmazonCategory({
        id: val,
      }).then((res) => {
        if (res.code === 0) {
          console.log(res.data)
          this.classProcessorFn(res.data)
        } else {
          this.$notification.error({
            message: '错误',
            description: res.msg,
          })
        }
      })
    },
    //自定义分类根据不同的结果 处理分类反查
    classProcessorFn(data) {
      if (JSON.stringify(data) === '{}') {
        console.log('是空对象')
        let reverseArr = [
          { country: 'DE', category: '0' },
          { country: 'NL', category: '0' },
          { country: 'US', category: '0' },
          { country: 'CA', category: '0' },
          { country: 'MX', category: '0' },
          { country: 'ES', category: '0' },
          { country: 'IT', category: '0' },
          { country: 'FR', category: '0' },
          { country: 'GB', category: '0' },
          { country: 'AU', category: '0' },
          { country: 'JP', category: '0' },
          { country: 'PL', category: '0' },
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
          PL: false,
        }
        console.log(data,"classProcessorFn")
        Object.keys(data).forEach((item, index, value) => {
          console.log(item, index, data[item])
          let reverseObj = {
            country: '',
            category: '',
            cid: '',
          }
          reverseObj.country = item
          reverseObj.category = data[item].node_id
          console.log(toString(data[item].cid),"toString",data[item].cid)
          reverseObj.cid = data[item].cid
          console.log(reverseObj,"reverseObj")
          reverseArr.push(reverseObj)
        })
        console.log(reverseArr, 'reverseArr')
        
        this.reverseCheck(reverseArr, '1')
      }
    },
      onChange1(checkedList) {
        console.log(checkedList,"checkedList")
        let _this = this;
        this.indeterminate1 = !!checkedList.length && checkedList.length < this.plainOptions1.length;
        this.checkAll1 = checkedList.length === this.plainOptions1.length;
        let unCheckData = [];
        this.plainOptions1.forEach(function(item){
          if(checkedList.indexOf(item)==-1){
            unCheckData.push(item)
          }
        })
        if(unCheckData.length){
          unCheckData.forEach(function(item){
            if(_this.countryAll.indexOf(item)>-1){
              _this.countryAll.splice(_this.countryAll.indexOf(item),1);
              let code = _this.outPutCode(item);
              if(_this.selectList[code]){
                _this.selectList[code] = [];
              }
              _this.selectDefaultData[code] = [];
              let siteArry = JSON.parse(JSON.stringify(_this.siteValue));
              siteArry.forEach(function(val,index){
                if(val.title == item){
                  _this.siteValue.splice(index,1);
                }
              })
            }
          })
        }
        checkedList.forEach(function(item){
          if(_this.countryAll.indexOf(item)==-1){
            _this.countryAll.push(item)
            _this.getSiteValue(item)
          }
        })
        // this.getSiteValue()
      },
      onChange2(checkedList) {
        let _this = this;
        this.indeterminate2 = !!checkedList.length && checkedList.length < this.plainOptions2.length;
        this.checkAll2 = checkedList.length === this.plainOptions2.length;
        let unCheckData = [];
        this.plainOptions2.forEach(function(item){
          if(checkedList.indexOf(item)==-1){
            unCheckData.push(item)
          }
        })
        if(unCheckData.length){
          unCheckData.forEach(function(item){
            if(_this.countryAll.indexOf(item)>-1){
              _this.countryAll.splice(_this.countryAll.indexOf(item),1)
              let code = _this.outPutCode(item);
              if(_this.selectList[code]){
                _this.selectList[code] = [];
              }
              _this.selectDefaultData[code] = [];
              let siteArry = JSON.parse(JSON.stringify(_this.siteValue));
              siteArry.forEach(function(val,index){
                if(val.title == item){
                  _this.siteValue.splice(index,1);
                }
              })
            }
          })
        }
        checkedList.forEach(function(item){
          if(_this.countryAll.indexOf(item)==-1){
            _this.countryAll.push(item)
            _this.getSiteValue(item)
          }
        })
        // this.getSiteValue()
      },
      onChange3(checkedList) {
        console.log(checkedList,"checkedList")
        let _this = this;
        let unCheckData = [];
        this.plainOptions3.forEach(function(item){
          if(checkedList.indexOf(item)==-1){
            unCheckData.push(item)
          }
        })
        if(unCheckData.length){
          unCheckData.forEach(function(item){
            if(_this.countryAll.indexOf(item)>-1){
              _this.countryAll.splice(_this.countryAll.indexOf(item),1)
              let code = _this.outPutCode(item);
              if(_this.selectList[code]){
                _this.selectList[code] = [];
              }
              _this.selectDefaultData[code] = [];
              let siteArry = JSON.parse(JSON.stringify(_this.siteValue));
              siteArry.forEach(function(val,index){
                if(val.title == item){
                  _this.siteValue.splice(index,1);
                }
              })
            }
          })
        }
        checkedList.forEach(function(item){
          if(_this.countryAll.indexOf(item)==-1){
            _this.countryAll.push(item)
            _this.getSiteValue(item)
          }
        })
      },
      onCheckAllChange1(e) {
        console.log(e,"onCheckAllChange1")
        let _this = this;
        Object.assign(this, {
          checkedList1: e.target.checked ? this.plainOptions1 : [],
          indeterminate1: false,
          checkAll1: e.target.checked,
        });

        if(this.checkAll1){
          this.plainOptions1.forEach(function(item){
            if(_this.countryAll.indexOf(item)==-1){
              _this.countryAll.push(item)
              _this.getSiteValue(item)
            }
          })
        }else{
          this.plainOptions1.forEach(function(item,index){
            if(_this.countryAll.indexOf(item)>-1){
              _this.countryAll.splice(_this.countryAll.indexOf(item),1)
              let code = _this.outPutCode(item);
              if(_this.selectList[code]){
                delete _this.selectList[code];
              }
              if(_this.selectList[code]){
                _this.selectList[code] = [];
              }
              _this.selectDefaultData[code] = [];
              let siteArry = JSON.parse(JSON.stringify(_this.siteValue));
              siteArry.forEach(function(val,index){
                if(val.title == item){
                  _this.siteValue.splice(index,1);
                }
              })
            }
          })
        }
        // this.getSiteValue()
        setTimeout(()=>{
          this.checkedList1 = this.removal(this.checkedList1)
        },1000)
      },
      onCheckAllChange2(e) {
        let _this = this;
        Object.assign(this, {
          checkedList2: e.target.checked ? this.plainOptions2 : [],
          indeterminate2: false,
          checkAll2: e.target.checked,
        });
        if(this.checkAll2){
          this.plainOptions2.forEach(function(item){
            if(_this.countryAll.indexOf(item)==-1){
              _this.countryAll.push(item)
              _this.getSiteValue(item)
            }
          })
        }else{
          this.plainOptions2.forEach(function(item,index){
            if(_this.countryAll.indexOf(item)>-1){
              _this.countryAll.splice(_this.countryAll.indexOf(item),1)
              let code = _this.outPutCode(item);
              if(_this.selectList[code]){
                delete _this.selectList[code];
              }
              if(_this.selectList[code]){
                _this.selectList[code] = [];
              }
              _this.selectDefaultData[code] = [];
              let siteArry = JSON.parse(JSON.stringify(_this.siteValue));
              siteArry.forEach(function(val,index){
                if(val.title == item){
                  _this.siteValue.splice(index,1);
                }
              })
            }
          })
        }
        // this.getSiteValue()
         setTimeout(()=>{
          this.checkedList2 = this.removal(this.checkedList2)
        },1000)
      },
      outPutCode(str){
        switch(str){
          case "德国":
            return 'DE'
            break;
          case "荷兰":
            return 'NL'
            break;
          case "西班牙":
            return 'ES'
            break;
          case "意大利":
            return 'IT'
            break;
          case "美国":
            return 'US'
            break;
          case "墨西哥":
            return 'MX'
            break;
          case "阿拉伯联合酋长国":
            return 'AE'
            break;
          case "巴西":
            return 'BR'
            break;
          case "法国":
            return 'FR'
            break;
          case "英国":
            return 'GB'
            break;
          case "印度":
            return 'IN'
            break;
          case "土耳其":
            return 'TR'
            break;
          case "加拿大":
            return 'CA'
            break;
          case "澳大利亚":
            return 'AU'
            break;
          case "日本":
            return 'JP'
            break;
          case "波兰":
            return 'PL'
            break;
        }
      },
      getSiteValue(code){
        console.log(code,'code')
        let _this = this
        // this.siteValue = [];
        switch(code){
          case "德国":
            _this.siteValue.push({
              title:"德国",
              code:"DE"
            })
            this.getSelectList("0","DE")
            break;
          case "荷兰":
            _this.siteValue.push({
              title:"荷兰",
              code:"NL"
            })
            this.getSelectList("0","NL")
            break;
          case "西班牙":
            _this.siteValue.push({
              title:"西班牙",
              code:"ES"
            })
            this.getSelectList("0","ES")
            break;
          case "意大利":
            _this.siteValue.push({
              title:"意大利",
              code:"IT"
            })
            this.getSelectList("0","IT")
            break;
          case "荷兰":
            _this.siteValue.push({
              title:"荷兰",
              code:"NL"
            })
            this.getSelectList("0","NL")
          break;
          case "美国":
            _this.siteValue.push({
              title:"美国",
              code:"US"
            })
            this.getSelectList("0","US")
            break;
          case "墨西哥":
            _this.siteValue.push({
              title:"墨西哥",
              code:"MX"
            })
            this.getSelectList("0","MX")
            break;
          case "阿拉伯联合酋长国":
            _this.siteValue.push({
              title:"阿拉伯联合酋长国",
              code:"AE"
            })
            this.getSelectList("0","AE")
            break;
          case "巴西":
            _this.siteValue.push({
              title:"巴西",
              code:"BR"
            })
            this.getSelectList("0","BR")
            break;
          case "法国":
            _this.siteValue.push({
              title:"法国",
              code:"FR"
            })
            this.getSelectList("0","FR")
            break;
          case "英国":
            _this.siteValue.push({
              title:"英国",
              code:"GB"
            })
            this.getSelectList("0","GB")
            break;
          case "印度":
            _this.siteValue.push({
              title:"印度",
              code:"IN"
            })
            this.getSelectList("0","IN")
            break;
          case "土耳其":
            _this.siteValue.push({
              title:"土耳其",
              code:"TR"
            })
            this.getSelectList("0","TR")
            break;
          case "加拿大":
            _this.siteValue.push({
              title:"加拿大",
              code:"CA"
            })
            this.getSelectList("0","CA")
            break;
          case "澳大利亚":
            _this.siteValue.push({
              title:"澳大利亚",
              code:"AU"
            })
            this.getSelectList("0","AU")
            break;
          case "日本":
            _this.siteValue.push({
              title:"日本",
              code:"JP"
            })
            this.getSelectList("0","JP")
            break;
          case "波兰":
            _this.siteValue.push({
              title:"波兰",
              code:"PL"
            })
            this.getSelectList("0","PL")
            break;
        }
         _this.siteValue = _this.uniqueArray(_this.siteValue,'title');
         console.log(_this.siteValue,"siteValue")
      },
      uniqueArray(arr,param) {
      console.log(arr,'arr')
      if (Array.isArray(arr)) {
        let temp = [];
        let newArr = arr.reduce((acc, cur) => {
          if (temp.indexOf(cur[param]) === -1) {
            temp.push(cur[param]);
            acc.push(cur);
            return acc;
          } else {
            console.log(acc);
            return acc;
          }
        }, []);
        // 可以用别的方法判断是否有重复，毕竟已经把重复的项过滤掉了
        let isDuplicate = newArr.length === arr.length;
        return newArr
      }
    },
    setSelectData(data,code){
      let dataInfo = []
      data.forEach(function(dat){
        if(dat.is_menu==0){
          dataInfo.push({
            value: dat.id,
            label: dat.category_cn,
            tabValue:dat.category,
            code:code,
            categoryid:dat.node_id
          })
        }else{
          dataInfo.push({
            value: dat.id,
            label: dat.category_cn,
            tabValue:dat.category,
            isLeaf: false,
            code:code,
            categoryid:dat.node_id
          })
        }
      })
      return dataInfo;
    },
    getChildList(obj,code){
        let _this = this;
        obj.forEach(function(itm,inx){
          _this.selectDefaultArry[code].forEach(function(id,index){
            if(itm.value == id){
              _this.getauthCountry(id,code).then((res)=>{
                if(res.length){
                  let childrenData = []
                  res.forEach(function(item){
                    let status;
                    if(item.is_menu == 0){
                      childrenData.push({
                        value: item.id,
                        label: item.category_cn,
                        tabValue:item.category,
                        code:code,
                        categoryid:item.node_id
                      })
                    }else{
                      childrenData.push({
                        value: item.id,
                        label: item.category_cn,
                        isLeaf: false,
                        tabValue:item.category,
                        code:code,
                        categoryid:item.node_id
                      })
                    }
                  })
                  itm.children = childrenData
                  _this.getChildList(itm.children,code);
                }
              })
            }
          })
        })
        setTimeout(()=>{
          _this.$store.commit('set_classLoading',false)
        },1000)
      },
      getSelectList(val,code){
        let _this = this
        // this.selectList = "";
        authCountry({
          country:code,
          pid:val
        }).then((res)=>{
          if(res.code === 0){
            let selectData = [];
            if(code == "DE"){
              selectData = _this.setSelectData(res.data,code)  
              _this.selectList.DE = selectData
              console.log(_this.selectList,'selectList')
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.DE,code);
              }
            }else if(code == "NL"){
              selectData = _this.setSelectData(res.data,code)  
              _this.selectList.NL = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.NL,code);
              }
            }else if(code == "ES"){
              selectData = _this.setSelectData(res.data,code)  
              _this.selectList.ES = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.ES,code);
              }
            }else if(code == "NL"){
              selectData = _this.setSelectData(res.data,code)  
              _this.selectList.NL = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.NL,code);
              }
            }else if(code == "IT"){
              selectData = _this.setSelectData(res.data,code) 
              _this.selectList.IT = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.IT,code);
              }
            }else if(code == "US"){
              selectData = _this.setSelectData(res.data,code) 
              _this.selectList.US = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.US,code);
              }
            }else if(code == "MX"){
              selectData = _this.setSelectData(res.data,code) 
              _this.selectList.MX = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.MX,code);
              }
            }else if(code == "AE"){
              selectData = _this.setSelectData(res.data,code) 
              _this.selectList.AE = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.AE,code);
              }
            }else if(code == "BR"){
              selectData = _this.setSelectData(res.data,code) 
              _this.selectList.BR = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.BR,code);
              }
            }else if(code == "FR"){
              selectData = _this.setSelectData(res.data,code) 
              _this.selectList.FR = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.FR,code);
              }
            }else if(code == "GB"){
              selectData = _this.setSelectData(res.data,code)
              _this.selectList.GB = selectData 
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.GB,code);
              }
            }else if(code == "IN"){
              selectData = _this.setSelectData(res.data,code)
              _this.selectList.IN = selectData 
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.IN,code);
              }
            }else if(code == "TR"){
              selectData = _this.setSelectData(res.data,code) 
              _this.selectList.TR = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.TR,code);
              }
            }else if(code == "CA"){
              selectData = _this.setSelectData(res.data,code) 
              _this.selectList.CA = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.CA,code);
              }
            }else if(code == "AU"){
              selectData = _this.setSelectData(res.data,code) 
              _this.selectList.AU = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.AU,code);
              }
            }else if(code == "JP"){
              selectData = _this.setSelectData(res.data,code) 
              _this.selectList.JP = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.JP,code);
              }
            }else if(code == "PL"){
              selectData = _this.setSelectData(res.data,code) 
              _this.selectList.PL = selectData
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList.PL,code);
              }
            }
            setTimeout(()=>{
              _this.selectList = _this.selectList
              _this.selectDefaultData[code] = JSON.parse(JSON.stringify(_this.selectDefaultData[code]))
            },3000)
            // _this.selectList = _this.selectList
          }
        })
      },
      getauthCountry(val,site){
        return authCountry({
          country:site,
          // country:"DE",
          pid:val
        }).then((res)=>{
          if(res.code === 0){
            return res.data
          }
        })
      },
      //获取国家列表
      getCountryList(){
        console.log("执行了")
        let _this = this
        country_list({
          type:1
        }).then((res)=>{
          if(res.code === 0){
            let countryData = res.data.amazon
            console.log(countryData,'countryData')
            if(countryData.NA){
              countryData.NA.forEach(function(country){
                _this.plainOptions1.push(country.title)
              })
            } 
            if(countryData.EU){
              countryData.EU.forEach(function(country){
                _this.plainOptions2.push(country.title)
              })
            }
            if(countryData.FE){
              countryData.FE.forEach(function(country){
                _this.plainOptions3.push(country.title)
              })
            }
          }
        })
      },
      // 反向返显联级菜单多国家
      mwsReversesAll(){
        console.log('反查111')
        if(this.dataAll){
          if(this.siteValue.length){
            this.siteValue.forEach((item,index)=>{
              if(this.dataAll[item]){
                this.mwsReverses(item,this.dataAll[item].category)
              }
            })
          }else{
            this.Europe.forEach((item,index)=>{
              console.log(this.dataAll[item.title])
              if(this.dataAll[item.title]){
                this.mwsReverses(item.title,this.dataAll[item.title].category)
              }
            })
          }
        }
      },
      mwsReverses(country,category){
        // 请求 参数 id
        mwsReverse({
          country:country,
          node_id:category
        }).then((res)=>{
          if(res.code === 0){
            if(country === 'DE'){
              // 把最后一级的nodeID保存
              this.classValueDE = res.data.stepId[res.data.stepId.length-1];
              this.selectValueDE = res.data.id;
              this.updataStepIdDE = [];
              for (var i in res.data.id) {
                this.updataStepIdDE[i] = res.data.id[i];
              }
              this.updataStepIdDE.splice(0,0,'0')
              if(this.classValueDE){
                this.disabShow = false
              }
              this.updataStepIdDE.forEach((item,value)=>{
                setTimeout(()=>{
                  this.getauthCountry(item,country).then((v)=>{
                    this.selectListDE[value]=v
                    console.log(this.selectList,'arr?object')
                    if(this.updataStepIdDE.length === (value+1)){
                      this.selectListDE.pop()
                    }
                  })
                },value*200)
              })
              console.log(this.selectListDE,'selectListDE')
            }else if(country === 'NL'){
              this.classValueNL = res.data.stepId[res.data.stepId.length-1];
              this.selectValueNL = res.data.id;
              this.updataStepIdNL = [];
              for (var i in res.data.id) {
                this.updataStepIdNL[i] = res.data.id[i];
              }
              this.updataStepIdNL.splice(0,0,'0')
              if(this.classValueNL){
                this.disabShow = false
              }
              this.updataStepIdNL.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListNL[value]=v
                if(this.updataStepIdNL.length === (value+1)){
                  this.selectListNL.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListNL,'selectListNL')
            }else if(country === 'ES'){
              this.classValueES = res.data.stepId[res.data.stepId.length-1];
              this.selectValueES = res.data.id;
              this.updataStepIdES = [];
              for (var i in res.data.id) {
                this.updataStepIdES[i] = res.data.id[i];
              }
              this.updataStepIdES.splice(0,0,'0')
              if(this.classValueES){
                this.disabShow = false
              }
              this.updataStepIdES.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListES[value]=v
                if(this.updataStepIdES.length === (value+1)){
                  this.selectListES.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListES,'selectListES')
            }else if(country === 'IT'){
              this.classValueIT = res.data.stepId[res.data.stepId.length-1];
              this.selectValueIT = res.data.id;
              this.updataStepIdIT = [];
              for (var i in res.data.id) {
                this.updataStepIdIT[i] = res.data.id[i];
              }
              this.updataStepIdIT.splice(0,0,'0')
              if(this.classValueIT){
                this.disabShow = false
              }
              this.updataStepIdIT.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListIT[value]=v
                if(this.updataStepIdIT.length === (value+1)){
                  this.selectListIT.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListIT,'selectListIT')
            }else if(country === 'US'){
              this.classValueUS = res.data.stepId[res.data.stepId.length-1];
              this.selectValueUS = res.data.id;
              this.updataStepIdUS = [];
              for (var i in res.data.id) {
                this.updataStepIdUS[i] = res.data.id[i];
              }
              this.updataStepIdUS.splice(0,0,'0')
              if(this.classValueUS){
                this.disabShow = false
              }
              this.updataStepIdUS.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListUS[value]=v
                if(this.updataStepIdUS.length === (value+1)){
                  this.selectListUS.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListUS,'selectListUS')
            }else if(country === 'MX'){
              this.classValueMX = res.data.stepId[res.data.stepId.length-1];
              this.selectValueMX = res.data.id;
              this.updataStepIdMX = [];
              for (var i in res.data.id) {
                this.updataStepIdMX[i] = res.data.id[i];
              }
              this.updataStepIdMX.splice(0,0,'0')
              if(this.classValueMX){
                this.disabShow = false
              }
              this.updataStepIdMX.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListMX[value]=v
                if(this.updataStepIdMX.length === (value+1)){
                  this.selectListMX.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListMX,'selectListMX')
            }else if(country === 'AE'){
              this.classValueAE = res.data.stepId[res.data.stepId.length-1];
              this.selectValueAE = res.data.id;
              this.updataStepIdAE = [];
              for (var i in res.data.id) {
                this.updataStepIdAE[i] = res.data.id[i];
              }
              this.updataStepIdAE.splice(0,0,'0')
              if(this.classValueAE){
                this.disabShow = false
              }
              this.updataStepIdAE.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListAE[value]=v
                if(this.updataStepIdAE.length === (value+1)){
                  this.selectListAE.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListAE,'selectListAE')
            }else if(country === 'BR'){
              this.classValueBR = res.data.stepId[res.data.stepId.length-1];
              this.selectValueBR = res.data.id;
              this.updataStepIdBR = [];
              for (var i in res.data.id) {
                this.updataStepIdBR[i] = res.data.id[i];
              }
              this.updataStepIdBR.splice(0,0,'0')
              if(this.classValueBR){
                this.disabShow = false
              }
              this.updataStepIdBR.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListBR[value]=v
                if(this.updataStepIdBR.length === (value+1)){
                  this.selectListBR.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListBR,'selectListBR')
            }else if(country === 'FR'){
              this.classValueFR = res.data.stepId[res.data.stepId.length-1];
              this.selectValueFR = res.data.id;
              this.updataStepIdFR = [];
              for (var i in res.data.id) {
                this.updataStepIdFR[i] = res.data.id[i];
              }
              this.updataStepIdFR.splice(0,0,'0')
              if(this.classValueFR){
                this.disabShow = false
              }
              this.updataStepIdFR.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListFR[value]=v
                if(this.updataStepIdFR.length === (value+1)){
                  this.selectListFR.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListFR,'selectListFR')
            }else if(country === 'GB'){
              this.classValueGB = res.data.stepId[res.data.stepId.length-1];
              this.selectValueGB = res.data.id;
              this.updataStepIdGB = [];
              for (var i in res.data.id) {
                this.updataStepIdGB[i] = res.data.id[i];
              }
              this.updataStepIdGB.splice(0,0,'0')
              if(this.classValueGB){
                this.disabShow = false
              }
              this.updataStepIdGB.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListGB[value]=v
                if(this.updataStepIdGB.length === (value+1)){
                  this.selectListGB.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListGB,'selectListGB')
            }else if(country === 'IN'){
              this.classValueIN = res.data.stepId[res.data.stepId.length-1];
              this.selectValueIN = res.data.id;
              this.updataStepIdIN = [];
              for (var i in res.data.id) {
                this.updataStepIdIN[i] = res.data.id[i];
              }
              this.updataStepIdIN.splice(0,0,'0')
              if(this.classValueIN){
                this.disabShow = false
              }
              this.updataStepIdIN.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListIN[value]=v
                if(this.updataStepIdIN.length === (value+1)){
                  this.selectListIN.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListIN,'selectListIN')
            }else if(country === 'TR'){
              this.classValueTR = res.data.stepId[res.data.stepId.length-1];
              this.selectValueTR = res.data.id;
              this.updataStepIdTR = [];
              for (var i in res.data.id) {
                this.updataStepIdTR[i] = res.data.id[i];
              }
              this.updataStepIdTR.splice(0,0,'0')
              if(this.classValueTR){
                this.disabShow = false
              }
              this.updataStepIdTR.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListTR[value]=v
                if(this.updataStepIdTR.length === (value+1)){
                  this.selectListTR.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListTR,'selectListTR')
            }else if(country === 'CA'){
              this.classValueCA = res.data.stepId[res.data.stepId.length-1];
              this.selectValueCA = res.data.id;
              this.updataStepIdCA = [];
              for (var i in res.data.id) {
                this.updataStepIdCA[i] = res.data.id[i];
              }
              this.updataStepIdCA.splice(0,0,'0')
              if(this.classValueCA){
                this.disabShow = false
              }
              this.updataStepIdCA.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListCA[value]=v
                if(this.updataStepIdCA.length === (value+1)){
                  this.selectListCA.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListCA,'selectListCA')
            }else if(country === 'JP'){
              this.classValueJP = res.data.stepId[res.data.stepId.length-1];
              this.selectValueJP = res.data.id;
              this.updataStepIdJP = [];
              for (var i in res.data.id) {
                this.updataStepIdJP[i] = res.data.id[i];
              }
              this.updataStepIdJP.splice(0,0,'0')
              if(this.classValueJP){
                this.disabShow = false
              }
              this.updataStepIdJP.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListJP[value]=v
                if(this.updataStepIdJP.length === (value+1)){
                  this.selectListJP.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListJP,'selectListJP')
            }else if(country === 'AU'){
              this.classValueAU = res.data.stepId[res.data.stepId.length-1];
              this.selectValueAU = res.data.id;
              this.updataStepIdAU = [];
              for (var i in res.data.id) {
                this.updataStepIdAU[i] = res.data.id[i];
              }
              this.updataStepIdAU.splice(0,0,'0')
              if(this.classValueAU){
                this.disabShow = false
              }
              this.updataStepIdAU.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListAU[value]=v
                if(this.updataStepIdAU.length === (value+1)){
                  this.selectListAU.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListAU,'selectListAU')
            }else if(country === 'PL'){
              this.classValuePL = res.data.stepId[res.data.stepId.length-1];
              this.selectValuePL = res.data.id;
              this.updataStepIdPL = [];
              for (var i in res.data.id) {
                this.updataStepIdPL[i] = res.data.id[i];
              }
              this.updataStepIdPL.splice(0,0,'0')
              if(this.classValuePL){
                this.disabShow = false
              }
              this.updataStepIdPL.forEach((item,value)=>{
              setTimeout(()=>{
              this.getauthCountry(item,country).then((v)=>{
                this.selectListPL[value]=v
                if(this.updataStepIdPL.length === (value+1)){
                  this.selectListPL.pop()
                  }
                })
              },value*200)
              })
              console.log(this.selectListPL,'selectListPL')
            }
          }
        })
      },
      onSelectChange(value,selectedOptions,code) {
        console.log(value)
        console.log(selectedOptions)
        this.selectedOptions[code] = selectedOptions
        this.selectDefaultData[code] = value;
      },
      //搜索
      getSearchData(e,code,num){
        if(e.target.value){
          if(num == 1){
            if(e.keyCode == '13'){
              search_category({
                country:code,
                keyword:e.target.value,
              }).then((res)=>{
                if(res.code === 0){
                  this.searchData[code] =res.data;
                  if(this.searchData[code].length){
                    this.searchType[code] = true;
                  }
                }else{
                  this.$notification.error({
                    message: '错误',
                    description: res.msg,
                  });
                }
              })
            } 
          }else{
            search_category({
              country:code,
              keyword:e.target.value,
            }).then((res)=>{
              if(res.code === 0){
                this.searchData[code] =res.data;
                if(this.searchData[code].length){
                  this.searchType[code] = true;
                }
              }else{
                this.$notification.error({
                  message: '错误',
                  description: res.msg,
                });
              }
            })
          }
        }
      },
      setSearchData(arr,code){
        this.selectDefaultArry[code] = [];
        this.selectDefaultData[code] = [];
        this.selectedOptions[code] =[];
        arr.forEach((item)=>{
          this.selectDefaultArry[code].push(item.id)
          this.selectDefaultData[code].push(item.id+'')
          this.selectedOptions[code].push({
            label: item.category_cn,
            tabValue:item.category,
          })
        })
        this.getChildList(this.selectList[code],code);
        this.searchDefaultData[code].id = arr.slice(-1)[0].id;
        let str = '';
        arr.forEach(function(it,index){
          if(index == arr.length-1){
            str += it.category_cn + '';
          }else{
            str += it.category_cn + '/';
          }
        })
        this.searchDefaultData[code].value = str;
        this.searchType[code] = false;
        this.searchStatus[code] = !this.searchStatus[code];
        setTimeout(()=>{
          this.selectList = this.selectList
          this.selectDefaultData[code] = JSON.parse(JSON.stringify(this.selectDefaultData[code]))
        },1000)
      },
      loadDataInfo(selectedOptions) {
        let _this = this;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        this.getauthCountry(targetOption.value,targetOption.code).then((res)=>{
          if(res.length){
            let childrenData = []
            res.forEach(function(item){
              let status;
              if(item.is_menu == 0){
                childrenData.push({
                  value: item.id,
                  label: item.category_cn,
                  tabValue:item.category,
                  code:targetOption.code,
                  categoryid:item.node_id
                })
              }else{
                childrenData.push({
                  value: item.id,
                  label: item.category_cn,
                  isLeaf: false,
                  tabValue:item.category,
                  code:targetOption.code,
                  categoryid:item.node_id
                })
              }
            })
            targetOption.children = childrenData
            targetOption.loading = false;
            _this.selectList[targetOption.code] = [..._this.selectList[targetOption.code]];
          }
        });
      },
      toTrans(){
        this.isToTrans = !this.isToTrans
        if(this.isToTrans){
          this.tabTransText = '将原语言翻译成中文'
        }else{
          this.tabTransText = '将中文翻译成原语言'
        }
      },
      //切换搜索
      showSearch(code){
        this.searchStatus[code] = !this.searchStatus[code];
        this.searchData[code]=[]
      },
      //切换语言
      toTrans(){
        this.isToTrans = !this.isToTrans
        if(this.isToTrans){
          this.tabTransText = '将原语言翻译成中文'
        }else{
          this.tabTransText = '将中文翻译成原语言'
        }
      },
      removal(array){
        console.log("去重")
        var res = [];
        for (var i = 0, len = array.length; i < len; i++) {
          var current = array[i];
          if (res.indexOf(current) === -1) {
              res.push(current)
          }
        }
        console.log(res)
        return res;
      },
      // 父组件调用方法
      onlySite(value){
        let country = value.title
        console.log(value,"onlySite",value.title)
        console.log("onlySite",value,this.plainOptions1,this.plainOptions2,this.plainOptions3)
        this.plainOptions1 = this.plainOptions1.filter((item) => item===country?item:"")
        this.plainOptions2 = this.plainOptions2.filter((item) => item===country?item:"")
        this.plainOptions3 = this.plainOptions3.filter((item) => item===country?item:"")
        console.log("plainOptions1",this.plainOptions1,"plainOptions2",this.plainOptions2,"plainOptions3",this.plainOptions3)
        // this.checkedList1 = this.checkedList1.push(value.title)
        console.log("plainOptions1",this.plainOptions1,"checkedList1",this.checkedList1)
        if(value.title === "美国" || value.title === "墨西哥" || value.title === "加拿大"){
          let e = {
            target:{
              checked:true
            }
          }
          this.onCheckAllChange1(e)
        }else if(value.title === "德国" || value.title === "法国" || value.title === "英国" || value.title === "荷兰" || value.title === "瑞典" || value.title === "意大利" || value.title === "波兰" ){
           let e = {
            target:{
              checked:true
            }
          }
          this.onCheckAllChange2(e)
        }else if(value.title === "澳大利亚" || value.title === "日本"){
          let checkedListValue = []
          checkedListValue[0] = value.title
          this.onChange3(checkedListValue)
          this.checkedList3[0] = value.title
        }
        this.plainOptions1 = this.removal(this.plainOptions1)
        this.plainOptions2 = this.removal(this.plainOptions2)
      },
  } 
}
</script>
<style lang="less" scoped>

</style>