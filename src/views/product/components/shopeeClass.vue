<template>
<div class="shopee-class">
  <!-- <a-card> -->
    <!-- {{selectList[initValue]}}
    {{selectDefaultData[initValue]}} -->
    <div v-for="(site,index) in siteValue" :key="index" style="margin-bottom:10px">
      <a-row>
        <!-- <a-col :span="5"><a-button type="primary" style="margin-left:10px">{{site.title}}</a-button></a-col> -->
        <a-col :span="10" style="position:relative">
            <!-- v-show="!searchStatus[site.code]" -->
            <!-- {{selectDefaultData[site.code]}} -->
            <!-- :options="selectList[site.code] || []"     多个国家使用-->
          <a-cascader
            v-show="!searchStatus[initValue]"
            class='cascader-style'
            :fieldNames="{ label: isToTrans?'tabValue':'label', value: 'value', children: 'children' }"
            v-model="selectDefaultData[initValue]"
            :defaultValue="selectDefaultData[initValue]"
            :options="selectList[initValue] || []"
            @change="(value,selectedOptions)=>onSelectChange(value,selectedOptions,initValue)"
            @click='initSelect'
            placeholder="请选择分类"
            :loadData="loadDataInfo"
          />
          <a-input 
            style="width:250px" 
            v-model="searchDefaultData[initValue].value" 
            placeholder='请输入搜索内容' 
            @keydown="getSearchData($event,initValue,1)" 
            @blur="getSearchData($event,initValue,2)" 
            v-show="searchStatus[initValue]"
          />
          <!-- {{searchStatus[initValue] +'---'+ searchData[initValue].length +'---'+ searchType[initValue]}}
          {{searchStatus[initValue] && searchData[initValue].length && searchType[initValue]}} -->
          <div class="search_card" v-show="searchStatus[initValue] && searchData[initValue].length && searchType[initValue]">
            <a-row>
              <a-col class="search_li" v-for="(search,index) in searchData[initValue]" :key="index" @click="setSearchData(search,initValue)">
                <div>
                  <span v-for="(sch,idex) in search" :key="idex">
                    {{sch.category_name_cn}}
                    <i>/</i>
                  </span>
                </div>
                <div>
                  <span v-for="(sch,idex) in search" :key="idex">
                    {{sch.category_name}}
                    <i>/</i>
                  </span>
                </div>  
              </a-col>
            </a-row>
          </div>

        </a-col>
        <a-col offset = '1' :span="3">
          <a-button style="margin-left:10px" shape="circle" :type="searchStatus[initValue]?'primary':''" icon="search" @click="showSearch(initValue)"/>
        </a-col>
      </a-row>
      <!-- {{selectedOptions[initValue]}} -->
      <a-row>
        <a-col :span="16" class="category_li">
          <span v-for="(item,index) in selectedOptions[initValue]" :key="index">{{item.label}}<i >/</i></span>
        </a-col>
      </a-row>
    </div>
  <!-- </a-card>  -->
</div>
</template>
<script>
import axios from 'axios'
export default {
  name:"",
  props:[],
  data(){
    return {
      siteValue:[ { "title": "马来西亚", "code": "MY" }, ],
      isToTrans:true,
      selectDefaultData:{
        MY:[],
        SG:[],
      },
      selectList:{
        MY:[],
        SG:[],
      },
      selectDefaultArry:{
        MY:[],
        SG:[],
      },
      selectedOptions:{
        MY:[],
        SG:[],
      },
      //classselect的id
      category:{
        MY:'',
        SG:'',
      },
      //产品属性
      attributesList:{
        MY:'',
        SG:'',
      },
      searchDefaultData:{
        MY:{
          id:'',
          value:''
        },
        SG:{
          id:'',
          value:''
        },
      },
      searchStatus:{
        MY:false,
        SG:false,
      },
      searchData:{
        MY:[],
        SG:[],
      },
      searchType:{
        MY:true,
        SG:true,
      },
      classValue:"",
      initValue:""
    }
  },
  methods:{
    //分类选择
    onSelectChange(value,selectedOptions,code) {
      console.log('1111')
      this.selectedOptions[code] = selectedOptions
      this.selectDefaultData[code] = value;
      this.category[code] = this.selectDefaultData[code].slice(-1).toString();
      this.classValue = this.category[code]
      // vue.ls.set('set_attributeState',true)
      console.log(code,'code')
      this.$emit('getAttributeList',this.category[code],code);
      // console.log(this.selectList,'lklk')
      // this.getAttributeFn(this.category[code]).then(res=>{
      //   if(res !== 'error'){
      //     this.attributesList[code] = res
      //     console.log(this.attributesList,'attributesList')
      //   }
      // })
    },
    // 初始化 分类  init
    initSelect(){
      console.log(123,this.classValue)
      if(this.classValue){
        // 点击反查
        this.getSelectListFn("0",this.initValue)   
        this.selectDefaultArry[this.initValue] = this.selectDefaultData[this.initValue]
      }else{
        console.log(false)
      }

    },
    getSelectListFn(val,code){
      console.log(val,code,'111')
      let _this = this
      _this.getauthCountry(val,code).then((res)=>{
          let selectData = [];
          if(code == _this.initValue){
            console.log('MYs',_this.selectList)
            selectData = _this.setSelectData(res,code)  
            _this.selectList[_this.initValue] = selectData
            console.log(_this.selectList[_this.initValue],code,'getSelectListFn',_this.selectDefaultArry)
            if(_this.selectDefaultArry[code].length>0){
              _this.getChildList(_this.selectList[_this.initValue],code);
            }
          }
          setTimeout(()=>{
            _this.selectList = _this.selectList
            // _this.selectedOptions = _this.selectList
            console.log(_this.selectList,'selectList')
            _this.selectDefaultData[code] = JSON.parse(JSON.stringify(_this.selectDefaultData[code]))
          },3000)
      })
    },
    getChildList(obj,code){
        console.log('getChildList')
        let _this = this;
        obj.forEach(function(itm,inx){
           console.log(_this.selectDefaultArry,'ovee',obj)
          _this.selectDefaultArry[code].forEach(function(id,index){
            if(itm.value == id){
              if(id!==_this.selectDefaultArry[_this.initValue][_this.selectDefaultArry[_this.initValue].length-1]){
                _this.getauthCountry(id,code).then((res)=>{
                  if(res.length){
                    let childrenData = []
                    res.forEach(function(item){
                      let status;
                      if(!item.has_children){
                        childrenData.push({
                          value: item.category_id,
                          label: item.category_name,
                          tabValue:item.category_name_cn,
                          code:code,
                          categoryid:item.category_id
                        })
                      }else{
                        childrenData.push({
                          value: item.category_id,
                          label: item.category_name,
                          tabValue:item.category_name_cn,
                          isLeaf: false,
                          code:code,
                          categoryid:item.category_id
                        })
                      }
                    })
                    itm.children = childrenData
                    console.log(itm.children,code,'llll')
                    _this.getChildList(itm.children,code);
                  }
                })
              }else{
                console.log('123')
              }
            }
          })
        })
        setTimeout(()=>{
          _this.$store.commit('set_classLoading',false)
        },1000)
      },
    // 搜索虾皮分类接口
    getCategoriesSearchFn(keyword,code){
      return axios({
        method:'get',
        url:'http://service.ekuajing.cn/api/shopee/getCategories?keyword='+keyword+'&country='+code,
        }).then((res)=> {
          if(res.data.code === 0){
            if(res.data.data.length > 0){
              return res.data.data
            }else{
              return 'error'
            }
          }else{
            return 'error'
          }
        });
    },
    // 虾皮分类请求
    getCategoriesFn(site,val){
      console.log(site,val,'getCategoriesFn')
      return axios({
        method:'get',
        url:'http://service.ekuajing.cn/api/shopee/getCategories?country='+site+'&category_id='+val,
        }).then((res)=> {
          if(res.data.code === 0){
            return res.data.data
          }else{
            return 'error'
          }
        });
    },
    // 反查接口
    getCategoryReverseFn(val,country){
        return axios({
          method:'get',
          url:'http://service.ekuajing.cn/api/shopee/getCategoryReverse?country='+country+'&category_id='+val,
        }).then(res=>{
          console.log(res,'反查')
          if(res.data.code === 0){
            return res.data
          }else{
            return 'error'
          }
        })
      },
    Reverse(val,country){
      this.initValue =  country
      console.log('调用',country,val)
        this.getCategoryReverseFn(val,country).then(res =>{
        if(res!=='error'){
          let parent_id = []
          var reverseList = this.setSelectInfo(res.data,this.initValue)
          var classvalues = []
          console.log(reverseList,'reverseList')
            reverseList.forEach((item,index)=>{
              console.log(item,'item')
              if(item.isLeaf === false){
                let ll = []
                ll.push(reverseList[index+1])
                item.children = ll
              }
              // this.selectList.MY[LIstItem].children = this.setSelectInfo(item,'MY')
              console.log(item,'item.category_id')
              classvalues.push(item.categoryid)
              this.selectedOptions[country].push({
                label: item.label,
                tabValue:item.tabValue,
              })
            })
            console.log(this.selectedOptions,'selectedOptions')
            console.log(reverseList[0],'reverseList',classvalues)
            this.selectDefaultData[this.initValue] = classvalues
            console.log(this.selectDefaultData[this.initValue],'123')
            this.classValue = this.selectDefaultData[this.initValue][this.selectDefaultData[this.initValue].length-1]
            console.log(this.classValue,'llllll')
          let ls = []
          ls.push(reverseList[0])
          this.selectList[this.initValue]=ls
          console.log(parent_id,'parent_id','',reverseList)
          console.log(this.selectList,'selectList')
        }
      })
    },
    setSelectInfo(data,code){
      console.log(data,'data')
      let dataInfo = []
      data.forEach(function(dat){
        // dat.is_menu==0
        if(!dat.has_children){
          dataInfo.push({
            value: dat.category_id,
            label: dat.category_name,
            tabValue:dat.category_name_cn,
            code:code,
            categoryid:dat.category_id
          })
        }else{
          dataInfo.push({
            value: dat.category_id,
            label: dat.category_name,
            tabValue:dat.category_name_cn,
            isLeaf: false,
            code:code,
            categoryid:dat.category_id
          })
        }
      })
      return dataInfo;
    },

    // 虾皮格式转控件格式
    setSelectData(data,code){
      console.log(data,'data')
      let dataInfo = []
      data.forEach(function(dat){
        // dat.is_menu==0
        if(!dat.has_children){
          dataInfo.push({
            value: dat.category_id,
            label: dat.category_name,
            tabValue:dat.category_name_cn,
            code:code,
            categoryid:dat.category_id
          })
        }else{
          dataInfo.push({
            value: dat.category_id,
            label: dat.category_name,
            tabValue:dat.category_name_cn,
            isLeaf: false,
            code:code,
            categoryid:dat.category_id
          })
        }
      })
      return dataInfo;
    },

    //请求虾皮马来西亚分类 请求的id-val 国家code
    getSelectList(val,code){
      let _this = this
      _this.getCategoriesFn(code,val).then(res=>{
        console.log(res,'res')
        if(res !=='error'){
          let selectData = [];
          if(code == _this.initValue){
              selectData = _this.setSelectData(res,code)  
              _this.selectList[_this.initValue] = selectData
              console.log(_this.selectList,'selectList')
              if(_this.selectDefaultArry[code].length>0){
                _this.getChildList(_this.selectList[_this.initValue],code);
              }
            }
          // _this.selectList[this.siteValue] = res

          console.log(res)
        }
      })
    },
    // 联动选择
      loadDataInfo(selectedOptions) {
        console.log(selectedOptions)
        let _this = this;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        console.log(targetOption.value,targetOption.code,'ovee11')
        _this.getauthCountry(targetOption.value,targetOption.code).then((res)=>{
          if(res.length){
            console.log(res.length,'ovee')
            let childrenData = []
            res.forEach(function(item){
              let status;
              if(!item.has_children){
                childrenData.push({
                  value: item.category_id,
                  label: item.category_name,
                  tabValue:item.category_name_cn,
                  code:targetOption.code,
                  categoryid:item.category_id
                })

              }else{
                childrenData.push({
                  value: item.category_id,
                  label: item.category_name,
                  tabValue:item.category_name_cn,
                  isLeaf: false,
                  code:targetOption.code,
                  categoryid:item.category_id
                })
              }
            })
            targetOption.children = childrenData
            targetOption.loading = false;
            _this.selectList[targetOption.code] = [..._this.selectList[targetOption.code]];
          }
        });
      },
      getauthCountry(val,code){
        console.log(val,code,'0',[this.initValue])
        return this.getCategoriesFn(code,val).then(res=>{
           if(code == this.initValue){
            //  console.log(res,'voee')
              return res
           }
        })
      },
    //搜索接口封装
    search_category(keyword,code){
      return this.getCategoriesSearchFn(keyword,code).then(res=>{
        console.log(res,'keyword')
        return res
        
      })
    },
    initClassList(val,code){
      this.getSelectList(val,code)
    },
    // 虾皮搜索
    showSearch(code){
      this.searchStatus[code] = !this.searchStatus[code];
      this.searchData[code]=[]
    },
    //搜索
    getSearchData(e,code,num){
      // console.log(e,code,num,'搜索')
      if(e.target.value){
        if(num == 1){
          if(e.keyCode == '13'){
            this.search_category(e.target.value,code).then((res)=>{
              if(res !=='error'){
                  this.searchData[code] =res
                  console.log(this.searchData[code],'search')
                  if(this.searchData[code].length){
                    this.searchType[code] = true;
                  }
                }else{
                this.$notification.error({
                  message: '错误',
                  description: '搜索的分类不存在',
                });
              }
            })
          } 
        }else{
          this.search_category(e.target.value,code).then((res)=>{
            if(res !=='error'){
                this.searchData[code] =res
                console.log(this.searchData[code],'search')
                if(this.searchData[code].length){
                  this.searchType[code] = true;
                }
              }else{
              this.$notification.error({
                message: '错误',
                description: '搜索的分类不存在',
              });
              }
            // if(res.code === 0){
            //   this.searchData[code] =res.data;
            //   if(this.searchData[code].length){
            //     this.searchType[code] = true;
            //   }
            // }else{
            //   this.$notification.error({
            //     message: '错误',
            //     description: res.msg,
            //   });
            // }
          })
        }
      }
    },
    setSearchData(arr,code){
      console.log(arr,code)
       var reverseList = this.setSelectInfo(arr,this.initValue)
       console.log(reverseList,'reverseList')
       var classvalues = []
       let parent_id = []
       this.selectedOptions[code] = []
        reverseList.forEach((item,index)=>{
          console.log(item,'item')
          if(item.isLeaf === false){
            let ll = []
            ll.push(reverseList[index+1])
            item.children = ll
          }
          // this.selectList.MY[LIstItem].children = this.setSelectInfo(item,'MY')
          console.log(item,'item.category_id')
          classvalues.push(item.categoryid)

          this.selectedOptions[code].push({
            label: item.label,
            tabValue:item.tabValue,
          })
        })
        console.log(reverseList)
        let ls = []
        ls.push(reverseList[0])
        this.selectDefaultData[this.initValue] = classvalues
        console.log(this.selectDefaultData[this.initValue],'123')
        this.classValue = this.selectDefaultData[this.initValue][this.selectDefaultData[this.initValue].length-1]
        console.log(this.classValue,'最后一位',reverseList[0])
        this.selectList[this.initValue] = ls
        this.searchType[code] = false;
        this.searchStatus[code] = !this.searchStatus[code];
        this.$emit('getAttributeList',this.classValue,code);

    },

  },
  mounted(){
    // this.search_category('迷你连衣裙')
  },
}
</script>
<style lang='less' scoped>
.cascader-style{
  width:250px;
}
.search_card{
    position:absolute;
    top:37px;
    left:0;
    z-index:10;
    padding:5px;
    box-sizing:border-box;
    overflow:auto;
    width: 400px;
    height:200px;
    background-color:#fff;
    border-top: 1px solid #dddddd;
    border-left:1px solid #dddddd;
    border-right:1px solid #dddddd;
    border-bottom:1px solid #dddddd;
  }
  .category_li{
    color: #dddddd
  }
  .category_li span:last-child i{
    display: none;
  }
  
  .search_li div span:last-child{
    color: red;
  }
  .search_li div span:last-child i{
    display: none;
  }
  .search_li{
    cursor: pointer;
  }
  .search_li:hover{
    background-color: #dddddd;
  }


</style>