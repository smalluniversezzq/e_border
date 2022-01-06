<template>
  <div class="class-select">
    <a-card class='class-box'>
      <div v-for="(site,index) in siteArrValue" :key="index" style="margin-bottom:10px">
        <a-row>
          <a-col :span="5">
            <a-button type="primary" style="margin-left:10px">{{site.title}}</a-button>
          </a-col>
          <a-col  :span="12" style="position:relative">
            <a-cascader
              style="width:250px"
              :fieldNames="{ label: isToTrans?'tabValue':'label', value: 'value', children: 'children' }"
              v-show="!searchStatus[site.code]"
              v-model="selectDefaultData[site.code]"
              :defaultValue="selectDefaultData[site.code]"
              :options="selectList[site.code] || []"
              @change="(value,selectedOptions)=>onSelectChange(value,selectedOptions,site.code)"
              :loadData="loadDataInfo"
              placeholder="Please select"
            />
            <a-input style="width:250px" v-model="searchDefaultData[site.code].value" placeholder='请输入搜索内容' @keydown="getSearchData($event,site.code,1)" @blur="getSearchData($event,site.code,2)" v-show="searchStatus[site.code]"/>
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
                    </span></div>
                </a-col>
              </a-row>
            </div>
          </a-col>
          <a-col :span="3">
            <a-button style="margin-left:10px" shape="circle" :type="searchStatus[site.code]?'primary':'default'" icon="search" @click="showSearch(site.code)"/>
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
  </div>
</template>

<script>
import { authCountry ,search_category ,mwsReverse  } from '@/api/collect'
export default {
  name: 'classSelect',
  props:['selectData'],
  components:{
  },
  data(){
    return {
      siteArrValue:[],
      isToTrans:false,
      searchStatus:{
        DE:false,
        NL:false,
        SE:false,
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
        SE:[],
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
        SE:[],
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
      selectList:{
        DE:[],
        NL:[],
        SE:[],
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
        SE:{
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
      selectedOptions:{
        DE:[],
        NL:[],
        SE:[],
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
      searchType:{
        DE:true,
        NL:true,
        SE:true,
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
      selectDefaultArry:{
        DE:[],
        NL:[],
        SE:[],
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
      checkedList1: [],
      checkedList2: [],
      checkedList3: ['',''],
      countryAll:[],
      plainOptions1:[],
      plainOptions2:[],
      plainOptions3:[],
      category:{
        DE:'',
        NL:'',
        SE:'',
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
      categorys:{
        DE:'',
        NL:'',
        SE:'',
        ES:'',
        IT:'',
        US:'',
        CA:'',
        MX:'',
        FR:'',
        GB:'',
        AU:'',
        JP:'',
        PL:''
      },
      siteValue:[],
      submitstatus:false,
      Subheading:true,

    }
  },
  methods:{
    submits(){
      let _this = this;
      let site = ['DE','NL','SE','ES','IT','FR','GB','US','CA','MX','AU','JP','PL']
      site.forEach(function(site){
        _this.categorys[site] = _this.selectDefaultData[site].slice(-1).toString();
      })
      let category = JSON.parse(JSON.stringify(_this.categorys));
      _this.categorys = category
      _this.submitstatus = true
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
      },3000)
    },
    onSelectChange(value,selectedOptions,code) {
      this.selectedOptions[code] = selectedOptions
      this.selectDefaultData[code] = value;
    },
    // 获取所有国家分类
    getcountryClass(){
      let countryList = ['德国','荷兰','瑞典','西班牙','意大利','法国','英国','美国','加拿大','墨西哥','澳大利亚','日本','波兰']
      countryList.forEach((item,index)=>{
        this.getSiteValue(item)
      })
    },
    //获取下拉列表数据
    getSiteValue(code){
      let _this = this
      switch(code){
        case "德国":
          _this.siteArrValue.push({
            title:"德国",
            code:"DE"
          })
          this.getSelectList("0","DE")
          break;
        case "荷兰":
          _this.siteArrValue.push({
            title:"荷兰",
            code:"NL"
          })
          this.getSelectList("0","NL")
          break;
        case "瑞典":
          _this.siteArrValue.push({
            title:"瑞典",
            code:"SE"
          })
          this.getSelectList("0","SE")
          break;
        case "西班牙":
          _this.siteArrValue.push({
            title:"西班牙",
            code:"ES"
          })
          this.getSelectList("0","ES")
          break;
        case "意大利":
          _this.siteArrValue.push({
            title:"意大利",
            code:"IT"
          })
          this.getSelectList("0","IT")
          break;
        case "美国":
          _this.siteArrValue.push({
            title:"美国",
            code:"US"
          })
          this.getSelectList("0","US")
          break;
        case "墨西哥":
          _this.siteArrValue.push({
            title:"墨西哥",
            code:"MX"
          })
          this.getSelectList("0","MX")
          break;
        case "阿拉伯联合酋长国":
          _this.siteArrValue.push({
            title:"阿拉伯联合酋长国",
            code:"AE"
          })
          this.getSelectList("0","AE")
          break;
        case "巴西":
          _this.siteArrValue.push({
            title:"巴西",
            code:"BR"
          })
          this.getSelectList("0","BR")
          break;
        case "法国":
          _this.siteArrValue.push({
            title:"法国",
            code:"FR"
          })
          this.getSelectList("0","FR")
          break;
        case "英国":
          _this.siteArrValue.push({
            title:"英国",
            code:"GB"
          })
          this.getSelectList("0","GB")
          break;
        case "印度":
          _this.siteArrValue.push({
            title:"印度",
            code:"IN"
          })
          this.getSelectList("0","IN")
          break;
        case "土耳其":
          _this.siteArrValue.push({
            title:"土耳其",
            code:"TR"
          })
          this.getSelectList("0","TR")
          break;
        case "加拿大":
          _this.siteArrValue.push({
            title:"加拿大",
            code:"CA"
          })
          this.getSelectList("0","CA")
          break;
        case "澳大利亚":
          _this.siteArrValue.push({
            title:"澳大利亚",
            code:"AU"
          })
          this.getSelectList("0","AU")
          break;
        case "日本":
          _this.siteArrValue.push({
            title:"日本",
            code:"JP"
          })
          this.getSelectList("0","JP")
          break;
        case "波兰":
          _this.siteArrValue.push({
            title:"波兰",
            code:"PL"
          })
          this.getSelectList("0","PL")
          break;
      }
      _this.siteArrValue = _this.uniqueArray(_this.siteArrValue,'title');
    },
    uniqueArray(arr,param) {
      if (Array.isArray(arr)) {
        let temp = [];
        let newArr = arr.reduce((acc, cur) => {
          if (temp.indexOf(cur[param]) === -1) {
            temp.push(cur[param]);
            acc.push(cur);
            return acc;
          } else {
            return acc;
          }
        }, []);
        // 可以用别的方法判断是否有重复，毕竟已经把重复的项过滤掉了
        let isDuplicate = newArr.length === arr.length;
        return newArr
      }
    },
    getSelectList(val,code){
      let _this = this
      authCountry({
        country:code,
        pid:val
      }).then((res)=>{
        if(res.code === 0){
          let selectData = [];
          if(code == "DE"){
            selectData = _this.setSelectData(res.data,code)
            _this.selectList.DE = selectData
            console.log(_this.selectDefaultArry[code],'mw')
            if(_this.selectDefaultArry[code].length>0){
              _this.getChildList(_this.selectList.DE,code);
            }
          }else if(code == "NL"){
            selectData = _this.setSelectData(res.data,code)
            _this.selectList.NL = selectData
            console.log(_this.selectDefaultArry[code],'mw')
            if(_this.selectDefaultArry[code].length>0){
              _this.getChildList(_this.selectList.NL,code);
            }
          }else if(code == "SE"){
            selectData = _this.setSelectData(res.data,code)
            _this.selectList.SE = selectData
            console.log(_this.selectDefaultArry[code],'mw')
            if(_this.selectDefaultArry[code].length>0){
              _this.getChildList(_this.selectList.SE,code);
            }
          }else if(code == "ES"){
            selectData = _this.setSelectData(res.data,code)
            _this.selectList.ES = selectData
            if(_this.selectDefaultArry[code].length>0){
              _this.getChildList(_this.selectList.ES,code);
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
        }
      })
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
    showSearch(code){
      this.searchStatus[code] = !this.searchStatus[code];
      this.searchData[code]=[]
    },
    getauthCountry(val,site){
      return authCountry({
        country:site,
        pid:val
      }).then((res)=>{
        if(res.code === 0){
          return res.data
        }
      })
    },
    // 搜索
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
                // console.log('1',this.searchType)
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
    // 反查  (父组件调用 getAmazonCategoryFn)
    reverseCheck(reverseArr,state){
      let _this = this
      _this.searchDefaultData = {
        DE:{
          id:'',
          value:''
        },
        NL:{
          id:'',
          value:''
        },
        SE:{
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
      }
      if(state === '0'){
        _this.searchDefaultData =
          _this.selectDefaultData = { "DE": [],"NL": [],"SE": [], "ES": [], "IT": [], "US": [], "CA": [], "MX": [], "AE": [], "BR": [], "FR": [], "GB": [], "IN": [], "TR": [], "AU": [], "JP": [], "PL": [] }
        // _this.Subheading = false
        _this.selectedOptions={
          DE:[],
          NL:[],
          SE:[],
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
        this.$store.commit('set_classLoading',false)
      }else if(state ==='1'){
        _this.selectDefaultData = { "DE": [],"NL": [], "SE": [], "ES": [], "IT": [], "US": [], "CA": [], "MX": [], "AE": [], "BR": [], "FR": [], "GB": [], "IN": [], "TR": [], "AU": [], "JP": [], "PL": [] }
        _this.selectedOptions={
          DE:[],
          NL:[],
          SE:[],
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
        setTimeout(()=>{
          _this.Subheading = true
          if(reverseArr.length){
            console.log(reverseArr,'reverseArr')
            reverseArr.forEach(function(item){
              switch(item.country){
                case "DE":
                  _this.checkedList2.push("德国")
                  _this.countryAll.push("德国")
                  // console.log(_this.checkedList2,'checkedList2',_this.plainOptions2)
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
                case "SE":
                  _this.checkedList2.push("瑞典")
                  _this.countryAll.push("瑞典")
                  if(_this.checkedList2.length>0&&_this.checkedList2.length<_this.plainOptions2.length){
                    _this.indeterminate2 = true
                  }
                  _this.getmwsReverse(item.country,item.category,item.cid).then((res)=>{
                    if(res.stepId.length){
                      _this.selectDefaultData[item.country] = res.id
                      _this.selectDefaultArry[item.country] = res.id
                      _this.getSiteValue("瑞典")
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
          }else{
            // console.log('不是数组')
          }
        },1000)
      }
    },
    //反向获取分类id
    getmwsReverse(code,node_id,cid){
      return mwsReverse({
        country:code,
        node_id:node_id,
        cid:cid
      }).then((res)=>{
        if(res.code === 0){
          this.selectedOptions[code] = []
          res.data.title.forEach((item,index)=>{
            this.selectedOptions[code].push({
              tabValue:item
            })
          })
          return res.data
        }
      })
    },
  },
  created(){},
  mounted(){
    this.getcountryClass();
  },
}
</script>

<style lang="less" scoped>
.class-select{

}
.class-box{
  padding-bottom: 180px;
}
</style>