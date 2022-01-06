<template>
  <div class='goodsInfo'>
    <a-card   :body-style="{padding: '24px 32px'}" :loading="cardLoading" :bordered="false">
      <a-form  :form="form"  >
        <a-form-item
          :label="'翻译选项'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-select class='mr' v-model='defaultSlate' @change='SlateChange' style="width: 150px"  >
            <a-select-option v-if='GLOBAL.translateType==1' value="1" >谷歌（收费） </a-select-option>
            <!-- <a-select-option  value="2" >有道（收费）</a-select-option> -->
            <a-select-option  value="3" >谷歌（免费） </a-select-option>
            <a-select-option  value="4" >谷歌插件（免费） </a-select-option>
          </a-select>
          <span v-if='Number(this.$store.state.user.balance) <= 0 ' class='cursor character-box' style='color:#3885e1' @click='Recharge()'>
            立即充值
          </span>
          <span class='mr' v-if='Number(this.$store.state.user.balance) > 0'>
            <i  class='character'>{{characterTxt}}</i>
          </span>
        </a-form-item>
        <a-form-item
          :label="'当前语言'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:20}, lg: {span: 20}, xl: {span: 20} ,xxl:{span: 20} }"
        >
          <a-row>
            <a-col :span='24' style='display:flex'>
              <div class='mr' style='justify-content:flex-start'   >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>支持{{"("+languageCodeOrcountry[initLanguage]+")"}}</span>
                  </template>
                  <a-button
                    size="small"
                    :type='initCountry === initLanguage ? "primary":"default"'
                    @click='currentLanguage(initLanguage)'>
                    {{languageCode[initLanguage]}}
                  </a-button>
                </a-tooltip>
                <a-tooltip placement="top" v-if="isTransErr(initLanguage)">
                  <template slot="title">
                    <span>该语言内容字符超出限制，请修改</span>
                  </template>
                  <a-icon type="exclamation" style="color:red;font-size: 14px;margin-left: 5px;"/>
                </a-tooltip>
                <div style="height:20px;width:100%;line-height:20px;text-align:center;color:#cccccc" v-if="!isEdite(initLanguage)">未编辑</div>
              </div>
              <div  class='mr' style='justify-content:flex-start' v-for='(item,index) in orilanguage' :key='index' >
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>支持{{"("+languageCodeOrcountry[item]+")"}}</span>
                  </template>
                  <a-button
                    size="small"
                    :type='initCountry === item ? "primary":"default"'
                    @click='currentLanguage(item)'>
                    {{languageCode[item]}}
                  </a-button>
                </a-tooltip>
                <a-tooltip placement="top" v-if="isTransErr(item)">
                  <template slot="title">
                    <span>该语言内容字符超出限制，请修改</span>
                  </template>
                  <a-icon type="exclamation" style="color:red;font-size: 14px;margin-left: 5px;"/>
                </a-tooltip>
                <div style="height:20px;width:100%;line-height:20px;text-align:center;color:#cccccc" v-if="!isEdite(item)">未编辑</div>
              </div>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          :label="'翻译到：'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-button type='primary'  :loading='tranLoading' @click='toTranslate()'>点击翻译</a-button>
        </a-form-item>
        <a-form-item
          :label="'目标语言'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:20}, lg: {span: 20}, xl: {span: 20} ,xxl:{span: 20} }"
        >
          <a-row>
            <a-col :span='24'>
              <a-button
                class='mr'
                size="small"
                @click='TOlanguageAll("all")'
                :type='languageAll === true ? "primary":"default"'>全部</a-button>
              <a-button
                class='mr'
                v-for='(item,index) in language '
                :key='index'
                size="small"
                :type='languageBtn[item.languages] === true ? "primary":"default"'
                @click='TOlanguage(item.languages)'
              >{{item.name}}</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <!-- 信息 -->
        <a-form-item
          v-show='initCountry == initLanguage'
          :label="'商品标题('+languageCode[initLanguage] + ')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input
            @change="wordCountLimit(3,$event)"
            v-decorator="['title.'+initLanguage,  { initialValue:addNewProduct == 0 ?data[initLanguage].title :''}]"
            :style="{ display: 'inline-block',
          width: 'calc(100% - 84px)'}"/>
          <a-button class='ml' :type='controllerAll.title?"primary":"dashed"' @click='tabController("title")'>{{controllerAll.title?"已选":"未选"}}</a-button>
          <div>
            <span class="limitTip" :class="{beyondClass : istitleBeyond}">{{titleText}}</span>
          </div>


        </a-form-item>
        <a-form-item
          v-for='(item,index) in orilanguage'
          :Key="index"
          v-show = 'initCountry == item'
          :label="'商品标题('+languageCode[item] + ')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input
            @change="wordCountLimit(3,$event)"
            v-decorator="['title.'+item,  {initialValue:data[item] ? data[item].title :'', }]"
            :style="{ display: 'inline-block',
          width: 'calc(100% - 84px)'}"/>
          <a-button class='ml' :type='controllerAll.title?"primary":"dashed"' @click='tabController("title")'>{{controllerAll.title?"已选":"未选"}}</a-button>
          <div>
            <span class="limitTip" :class="{beyondClass : istitleBeyond}">{{titleText}}</span>
          </div>
        </a-form-item>

        <a-form-item
          v-show = 'initCountry == initLanguage'
          :label="'描述信息('+languageCode[initLanguage] + ')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-textarea
            @change="wordCountLimit(1,$event)"
            v-decorator="['detail.'+initLanguage,{initialValue:addNewProduct == 0 ? data[initLanguage].detail: '' } ]"
            :style="{ display: 'inline-block', width: 'calc(100% - 84px)'}"
            placeholder="请输入描述信息" :rows="6"/>
          <a-button class='ml' :type='controllerAll.detail?"primary":"dashed"' @click='tabController("detail")'>{{controllerAll.detail?"已选":"未选"}}</a-button>
          <div>
            <span class="limitTip" :class="{beyondClass : isDetailBeyond}">{{detailText}}</span>
          </div>
        </a-form-item>
        <a-form-item
          v-for='(item,index) in orilanguage'
          :Key="index"
          v-show = 'initCountry == item'
          :label="'描述信息('+languageCode[item] + ')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-textarea
            @change="wordCountLimit(1,$event)"
            v-decorator="['detail.'+item,{initialValue:data[item] ? data[item].detail :'', } ]"
            :style="{ display: 'inline-block', width: 'calc(100% - 84px)'}"
            placeholder="请输入描述信息" :rows="6"/>
          <a-button class='ml' :type='controllerAll.detail?"primary":"dashed"' @click='tabController("detail")'>{{controllerAll.detail?"已选":"未选"}}</a-button>
          <div>
            <span class="limitTip" :class="{beyondClass : isDetailBeyond}">{{detailText}}</span>
          </div>
        </a-form-item>

        <a-form-item
          v-show = 'initCountry == initLanguage'
          :label="'五点描述('+languageCode[initLanguage] + ')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }">
          <a-textarea
            @change="wordCountLimit(4,$event)"
            @blur='changeBullet(initLanguage)'
            v-decorator="['initialAll.'+initLanguage ]"
            :style="{ display: 'inline-block', width: 'calc(100% - 84px)'}"
            placeholder="请输入五点描述(单个描述共可输入500字)" :rows="6"/>
          <a-button class='ml' :type='controllerAll.initialAll?"primary":"dashed"' @click='tabController("initialAll")'>{{controllerAll.initialAll?"已选":"未选"}}</a-button>
          <div>
            <span class="limitTip" :class="{beyondClass : rowCount>5}">已检测{{rowCount}}点描述</span>
            <span class="limitTip" :class="{beyondClass : isInitialAllBeyond}">{{initialAllText}}</span>
          </div>
        </a-form-item>

        <a-form-item
          v-for='(item,index) in orilanguage'
          :Key="index"
          v-show = 'initCountry == item'
          :label="'五点描述('+languageCode[item] + ')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }">
          <a-textarea
            @change="wordCountLimit(4,$event)"
            @blur='changeBullet(item)'
            v-decorator="['initialAll.'+item]"
            :style="{ display: 'inline-block', width: 'calc(100% - 84px)'}"
            placeholder="请输入五点描述(单个描述共可输入500字)" :rows="6"/>
          <a-button
            class='ml'
            :type='controllerAll.initialAll?"primary":"dashed"'
            @click='tabController("initialAll")'>{{controllerAll.initialAll?"已选":"未选"}}</a-button>
          <div>
            <span class="limitTip" :class="{beyondClass : rowCount>5}">已检测{{rowCount}}点描述</span>
            <span class="limitTip" :class="{beyondClass : isInitialAllBeyond}">{{initialAllText}}</span>
          </div>
        </a-form-item>
        <a-form-item
          style='display:none'
          :label="'五点描述('+languageCode[initLanguage] + ')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }">
          <a-input placeholder='描述1'
                   @change="InitInfoFilling()"
                   v-decorator="['bullet_point1.'+initLanguage, { initialValue:addNewProduct == 0 ? data[initLanguage].bullet_point1:''}]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
          <a-input placeholder='描述2'
                   @change="InitInfoFilling()"
                   v-decorator="['bullet_point2.'+initLanguage, { initialValue:addNewProduct == 0 ? data[initLanguage].bullet_point2:''}]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
          <a-input placeholder='描述3'
                   @change="InitInfoFilling()"
                   v-decorator="['bullet_point3.'+initLanguage, { initialValue:addNewProduct == 0 ? data[initLanguage].bullet_point3:''}]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
          <a-input placeholder='描述4'
                   @change="InitInfoFilling()"
                   v-decorator="['bullet_point4.'+initLanguage, { initialValue:addNewProduct == 0 ? data[initLanguage].bullet_point4:''}]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
          <a-input placeholder='描述5'
                   @change="InitInfoFilling()"
                   v-decorator="['bullet_point5.'+initLanguage, { initialValue:addNewProduct == 0 ? data[initLanguage].bullet_point5:''}]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
        </a-form-item>
        <div >
          <a-form-item
            style='display:none'
            v-for='(item,index) in orilanguage'
            :Key="index"
            :label="'五点描述('+languageCode[item] + ')'"
            :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
            :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
          >
            <a-input placeholder='描述1'
                     @change="InitInfoFilling()"
                     v-decorator="['bullet_point1.'+item, {initialValue:data[item] ? data[item].bullet_point1 :'', }]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
            <a-input placeholder='描述2'
                     @change="InitInfoFilling()"
                     v-decorator="['bullet_point2.'+item, {initialValue:data[item] ? data[item].bullet_point2 :'', }]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
            <a-input placeholder='描述3'
                     @change="InitInfoFilling()"
                     v-decorator="['bullet_point3.'+item, {initialValue:data[item] ? data[item].bullet_point3 :'', }]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
            <a-input placeholder='描述4'
                     @change="InitInfoFilling()"
                     v-decorator="['bullet_point4.'+item, {initialValue:data[item] ? data[item].bullet_point4 :'', }]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
            <a-input placeholder='描述5'
                     @change="InitInfoFilling()"
                     v-decorator="['bullet_point5.'+item, {initialValue:data[item] ? data[item].bullet_point5 :'', }]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
          </a-form-item>
        </div>
        <a-form-item
          v-show = 'initCountry == this.initLanguage'
          :label="'关键字('+languageCode[initLanguage] + ')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input
            @change="wordCountLimit(2,$event)"
            v-decorator="['keywords.'+initLanguage,  { initialValue:addNewProduct == 0 ?data[initLanguage].keywords :''}]"
            :style="{ display: 'inline-block',
          width: 'calc(100% - 84px)'}"/>
          <a-button class='ml' :type='controllerAll.keywords?"primary":"dashed"' @click='tabController("keywords")'>{{controllerAll.keywords?"已选":"未选"}}</a-button>
          <div>
            <span class="limitTip" :class="{beyondClass : isKeyBeyond}">{{keywordsText}}</span>
          </div>
        </a-form-item>
        <a-form-item
          v-for='(item,index) in orilanguage'
          :Key="index"
          v-show = 'initCountry == item'
          :label="'关键字('+languageCode[item] + ')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input
            @change="wordCountLimit(2,$event)"
            v-decorator="['keywords.'+item,  {initialValue:data[item] ? data[item].keywords :'', }]"
            :style="{ display: 'inline-block',
          width: 'calc(100% - 84px)'}"/>
          <a-button class='ml' :type='controllerAll.keywords?"primary":"dashed"' @click='tabController("keywords")'>{{controllerAll.keywords?"已选":"未选"}}</a-button>
          <div>
            <span class="limitTip" :class="{beyondClass : isKeyBeyond}">{{keywordsText}}</span>
          </div>
        </a-form-item>
        <!-- llll -->
        <a-form-item :wrapperCol="{md: {span: 20, offset: 0}, lg: {span: 20, offset: 1}, xl: {span: 20, offset: 1}, xxl: {span: 20, offset: 2}}">
          <a-row >
            <a-col  :offset="6">
              <a-button @click='cancel'>取消</a-button>
              <a-button  class='ml-xl' type="primary" @click="nextStep()" style='margin-left:15px; width:100px;'>保存</a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-card>
    <a-modal title="消费确认" :visible="transPayVisibles" @ok="handleOkTrans" @cancel="handleCancelTrans">
      <p>消费类型：翻译</p>
      <p>消费详情谷歌：翻译{{transWordLength}}字节(谷歌)</p>
      <p style="color:#f3ec09">预估本次消费：{{transWordMoney}}元</p>
    </a-modal>

  </div>
</template>
<script>
import Vue from 'vue'
import { trans_fee , getDesc , update_desc ,trans ,transPlugin} from '@/api/collect'
import { permsBtn } from '@/utils/static'
import { language ,languageCode ,languageCodeOrcountry} from '@/views/order/public/country'
export default {
  name:"",
  props:[],
  data(){
    return{
      permsBtn,
      initLanguage:"",
      data:{
        de: "",
        fr: "",
        it: "",
        nl: "",
        sv: "",
        es: "",
        en: "",
        ja: "",
        zh: "",
        pl: ''
      },
      tranLoading:false,
      initCountry:"",
      language,
      languageCode ,
      languageCodeOrcountry,
      form: this.$form.createForm(this),
      cardLoading:true,
      goodsId:'',
      defaultSlate:"3",
      characterTxt:"（100万字符=142.228人民币）",
      countryValue:"",
      languageBtn:{
        de:false,
        nl:false,
        sv:false,
        es:false,
        it:false,
        fr:false,
        en:false,
        ja:false,
        zh:false,
        pl: false
      },
      languageAll:false,
      controllerAll:{
        title:true,
        detail:true,
        initialAll:true,
        keywords:true,
      },
      transAll:{
        title:"",
        detail:"",
        keywords:"",
        bullet_point1:"",
        bullet_point2:"",
        bullet_point3:"",
        bullet_point4:"",
        bullet_point5:"",
      },
      ENList:"",
      transPayVisibles:false,
      languageValue:"",
      transWordLength:0,
      transWordMoney:0,
      orilanguage:[],
      subvalues:"",
      againModalType:2,
      orilanguages:"",
      addNewProduct:"",
      isDetailBeyond:false,
      detailCount:2000,
      keywordsText:'',
      keywordsCount:250,
      detailText:'',
      isKeyBeyond:false,
      titleCount:200,
      titleText:'',
      istitleBeyond:false,
      initialAllCount:500,
      initialAllText:'',
      isInitialAllBeyond:false,
      rowCount:0,
      chromeCode:this.GLOBAL.chrome.id,
      InitFive:{
        zh:[],
        en:[],
        es:[],
        fr:[],
        it:[],
        ja:[],
        de:[],
        nl:[],
        sv:[],
        pl:[]
      },
      tranIdAll:[],
      is_ori:{
        zh:"1"
      },
      translanguage:"",
      errOri:{
        nullzh:"",
        nullEn:"",
        zh:'',
        en:''
      },
      transStatus:{}
    }
  },
  created(){
  },
  mounted(){
    this.goodsId = this.$route.query.id
    this.addNewProduct = Number(this.$route.query.type);
    this.$store.commit('set_Tabfour',true)
    if(this.addNewProduct === 0){
      this.getDescInfo()
    }else{
      this.cardLoading = false
      this.initCountry = 'zh'
      this.initLanguage = 'zh'
      this.orilanguage=[ "en"]
      this.getDescInfo()
      // setTimeout(()=>{
      //   this.nextStep()
      // },800)
    }
    this.defaultSlate = Vue.ls.get('SLATE_TYPE')
    if(this.defaultSlate ==="1"){
      this.characterTxt = '（100万字符=20美元）'
    }else if(this.defaultSlate ==="2"){
      this.characterTxt = '（100万字符=48人民币）'
    }else if(this.defaultSlate ==="3" || this.defaultSlate ==="4"){
      this.characterTxt = '（注：免费翻译会不准确，有时出现无法翻译现象！）'
    }
    if(Vue.ls.get('CHROME_ID')){
      this.chromeCode = Vue.ls.get('CHROME_ID')
    }else{
      this.chromeCode = this.GLOBAL.chrome.id
    }
  },
  methods:{
    isEdite(str){
      let str1 = this.form.getFieldValue('title.'+str)
      let str2 = this.form.getFieldValue('detail.'+str)
      let str3 = this.form.getFieldValue('keywords.'+str)
      let str4 = this.form.getFieldValue('bullet_point1.'+str)
      let str5 = this.form.getFieldValue('bullet_point2.'+str)
      let str6 = this.form.getFieldValue('bullet_point3.'+str)
      let str7 = this.form.getFieldValue('bullet_point4.'+str)
      let str8 = this.form.getFieldValue('bullet_point5.'+str)
      let status1 = true
      let status2 = false
      if(str1||str2||str3||str4||str5||str6||str7||str8){
        return status1
      }else{
        return status2
      }
    },
    isTransErr(str){
      let str1 = this.form.getFieldValue('title.'+str)
      let str2 = this.form.getFieldValue('detail.'+str)
      let str3 = this.form.getFieldValue('keywords.'+str)
      let str4 = this.form.getFieldValue('bullet_point1.'+str)
      let str5 = this.form.getFieldValue('bullet_point2.'+str)
      let str6 = this.form.getFieldValue('bullet_point3.'+str)
      let str7 = this.form.getFieldValue('bullet_point4.'+str)
      let str8 = this.form.getFieldValue('bullet_point5.'+str)
      str1 = str1?str1:''
      str2 = str2?str2:''
      str3 = str3?str3:''
      str4 = str4?str4:''
      str5 = str5?str5:''
      str6 = str6?str6:''
      str7 = str7?str7:''
      str8 = str8?str8:''
      let status1 = true
      let status2 = false
      if(str1.length>200||str2.length>2000||str3.length>250||str4.length>500||str5.length>500||str6.length>500||str7.length>500||str8.length>500){
        return status1
      }else{
        return status2
      }
    },
    // 获取商品信息1
    getDescInfo(){
      getDesc({
        id:this.goodsId
      }).then((res)=>{
        if(res.code === 0){
          if(JSON.stringify(res.data) !== '{}'){
            // this.data = res.data
            // Object.keys(res.data).forEach((item,index)=>{
            //   console.log(res.data[item],index)
            //   this.data[item]=res.data[item]
            // })
            this.data={
              de: res.data.de,
              fr: res.data.fr,
              it: res.data.it,
              nl: res.data.nl,
              es: res.data.es,
              sv: res.data.sv,
              en: res.data.en,
              ja: res.data.ja,
              zh: res.data.zh,
              pl: res.data.pl
            }
            console.log(this.data)
            Object.keys(this.data).forEach((item,index)=>{
              // console.log(item,index,"item")
              if(this.data[item].is_ori == '1'){
                // console.log("item",item,this.data[item].is_ori)
                this.initLanguage = item
                this.initCountry = item
                console.log(this.initLanguage,'赋值后的initLanguage')
              }
              if(item !== this.initLanguage){
                this.orilanguage.push(item)
              }
              this.transStatus[item] = false
            })
            this.cardLoading = false
          }else{
            this.addNewProduct = 1
            this.initCountry = 'zh'
            this.initLanguage = 'zh'
            this.$store.commit('set_goodsId',this.goodsId)
            this.cardLoading = false
            this.transStatus['zh'] = false
          }
        }
        console.log(this.transStatus,'transStatus')
        // console.log(this.orilanguage,'过滤前')
        this.orilanguage = this.removal(this.orilanguage)
        // console.log(this.orilanguage,'orilanguage',this.initLanguage,this.initCountry,'init')
        //延迟判断字符数量
        console.log(this.initLanguage,'this.initLanguage')
        setTimeout(()=>{
          this.wordsLimitShow(this.initLanguage)
          this.InitInfoFilling()
        },200)
      })
    },
    //五点描述 主动填充
    InitInfoFilling(){
      // console.log(this.data,'oveell','五点描述填充2')
      if(this.data){
        // console.log(this.initLanguage,)
        setTimeout(()=>{
          this.InitFive[this.initLanguage]=[]
          this.InitFive[this.initLanguage].push(this.form.getFieldValue('bullet_point1.'+this.initLanguage),this.form.getFieldValue('bullet_point2.'+this.initLanguage),this.form.getFieldValue('bullet_point3.'+this.initLanguage),this.form.getFieldValue('bullet_point4.'+this.initLanguage),this.form.getFieldValue('bullet_point5.'+this.initLanguage))
          // console.log(this.InitFive[this.initLanguage])
          let num1 = 0;
          this.InitFive[this.initLanguage].forEach((item,index)=>{
            if(item){
              num1++
            }
          })
          if(num1){
            this.form.setFieldsValue({
              ['initialAll.'+this.initLanguage]:this.InitFive[this.initLanguage].join("\n")
            })
          }
          // this.form.setFieldsValue({
          //   ['initialAll.'+this.initLanguage]:this.InitFive[this.initLanguage].join("\n")
          // })
          this.orilanguage.forEach((item,index)=>{
            if(item !== this.initLanguage){
              this.InitFive[item]=[]
              // console.log(this.InitFive[item],'asd',item)
              this.InitFive[item].push(
                this.form.getFieldValue('bullet_point1.'+ item),
                this.form.getFieldValue('bullet_point2.'+ item),
                this.form.getFieldValue('bullet_point3.'+ item),
                this.form.getFieldValue('bullet_point4.'+ item),
                this.form.getFieldValue('bullet_point5.'+ item))
              // console.log(this.InitFive[item].join("\n"),"initovee")
              let num2 = 0;
              this.InitFive[item].forEach((item,index)=>{
                if(item){
                  num2++
                }
              })
              if(num2){
                this.form.setFieldsValue({
                  ['initialAll.' + item]:this.InitFive[item].join("\n")
                })
              }
            }
          })
        },200)
      }else{
        // 新增商品
        setTimeout(()=>{
          this.InitFive[this.initLanguage]=[]
          this.InitFive[this.initLanguage].push(this.form.getFieldValue('bullet_point1.'+this.initLanguage),this.form.getFieldValue('bullet_point2.'+this.initLanguage),this.form.getFieldValue('bullet_point3.'+this.initLanguage),this.form.getFieldValue('bullet_point4.'+this.initLanguage),this.form.getFieldValue('bullet_point5.'+this.initLanguage))
          // console.log(this.InitFive[this.initLanguage])
          this.form.setFieldsValue({
            ['initialAll.'+this.initLanguage]:this.InitFive[this.initLanguage].join("\n")
          })

          this.orilanguage.forEach((item,index)=>{
            // console.log(item,'123')
            if(item !== this.initLanguage){
              this.InitFive[item]=[]
              // console.log(this.InitFive[item],'asd')
              this.InitFive[item].push(this.form.getFieldValue('bullet_point1.'+ item),this.form.getFieldValue('bullet_point2.'+ item),this.form.getFieldValue('bullet_point3.'+ item),this.form.getFieldValue('bullet_point4.'+ item),this.form.getFieldValue('bullet_point5.'+ item))
              // console.log(this.InitFive[item].join("\n"),"initovee")
              this.form.setFieldsValue({
                ['initialAll.' + item]:this.InitFive[item].join("\n")
              })
            }
          })
        },200)
      }

    },
    removal(array){
      var res = [];
      for (var i = 0, len = array.length; i < len; i++) {
        var current = array[i];
        if (res.indexOf(current) === -1) {
          res.push(current)
        }
      }
      return res;
      // 舍弃ES6
      // return new Set(arr);
    },
    // 切换当前语言
    currentLanguage(val){
      // console.log(val)
      this.initCountry = val
      this.wordsLimitShow(val)
    },
    //五点描述填充
    InfoFilling(CountryCode){
      // console.log('五点描述填充1')
      setTimeout(()=>{
        // console.log(this.form.getFieldValue('bullet_point1.'+CountryCode),"over")
        let InfoAreaAll=[]
        InfoAreaAll[0]=this.form.getFieldValue('bullet_point1.'+CountryCode)
        InfoAreaAll[1]=this.form.getFieldValue('bullet_point2.'+CountryCode)
        InfoAreaAll[2]=this.form.getFieldValue('bullet_point3.'+CountryCode)
        InfoAreaAll[3]=this.form.getFieldValue('bullet_point4.'+CountryCode)
        InfoAreaAll[4]=this.form.getFieldValue('bullet_point5.'+CountryCode)
        // console.log(InfoAreaAll,"InfoAreaAll")
        var ll = InfoAreaAll.join(`\n`)
        this.form.setFieldsValue({
          ['initialAll.' + CountryCode]:ll
        });
      },200)
    },
    // 五点描述All分别填充到五点描述
    changeBullet(count){
      let bulletREG = /\n/g
      let bulletArr = new Array()
      bulletArr = this.form.getFieldValue('initialAll.'+count).split(bulletREG).filter(d=>d)
      let arres = ["bullet_point1","bullet_point2","bullet_point3","bullet_point4","bullet_point5"]
      bulletArr.forEach((item,index)=>{
        if(bulletArr.length >= arres.length){
          this.form.setFieldsValue({
            [arres[index]+"."+count]:item
          });
        }else{
          if(bulletArr.length === 4){
            // console.log(bulletArr.length,"length")
            this.form.setFieldsValue({
              [arres[index]+"."+count]:item
            });
            this.form.setFieldsValue({
              [arres[4]+"."+count]:""
            });
          }else if(bulletArr.length === 3){
            // console.log(bulletArr.length,"length")
            this.form.setFieldsValue({
              [arres[index]+"."+count]:item
            });
            this.form.setFieldsValue({
              [arres[3]+"."+count]:""
            });
            this.form.setFieldsValue({
              [arres[4]+"."+count]:""
            });
          }else if(bulletArr.length === 2){
            // console.log(bulletArr.length,"length")
            this.form.setFieldsValue({
              [arres[index]+"."+count]:item
            });
            this.form.setFieldsValue({
              [arres[3]+"."+count]:""
            });
            this.form.setFieldsValue({
              [arres[4]+"."+count]:""
            });
            this.form.setFieldsValue({
              [arres[2]+"."+count]:""
            });
          }else if(bulletArr.length === 1){
            this.form.setFieldsValue({
              [arres[index]+"."+count]:item
            });
            this.form.setFieldsValue({
              [arres[1]+"."+count]:""
            });
            this.form.setFieldsValue({
              [arres[3]+"."+count]:""
            });
            this.form.setFieldsValue({
              [arres[4]+"."+count]:""
            });
            this.form.setFieldsValue({
              [arres[2]+"."+count]:""
            });
          }
        }
      })
    },
    SlateChange(val){
      Vue.ls.set('SLATE_TYPE',val);
      // console.log(val,"over",typeof val)
      if(val ==="1"){
        this.characterTxt = '（100万字符=20美元）'
      }else if(val ==="2"){
        this.characterTxt = '（100万字符=48人民币）'
      }else if(val ==="3" || val ==="4"){
        this.characterTxt = '（注：免费翻译会不准确，有时出现无法翻译现象！）'
      }
    },
    TOlanguage(country){
      var showlanguageAll = []
      this.languageBtn[country]=!this.languageBtn[country]
      Object.keys(this.languageBtn).forEach((item,index)=>{
        if(this.languageBtn[item] === true){
          showlanguageAll.push(item)
        }
      })
      if(showlanguageAll.length === 8){
        this.languageAll = true
      }else{
        this.languageAll = false
      }
    },
    TOlanguageAll(){
      this.languageAll = !this.languageAll
      if(this.languageAll === true){
        Object.keys(this.languageBtn).forEach((key)=>{
          this.languageBtn[key] = true
        })
      }else{
        Object.keys(this.languageBtn).forEach((key)=>{
          this.languageBtn[key] = false
        })
      }
    },
    tabController(core){
      this.controllerAll[core] = !this.controllerAll[core]
    },
    toTranslate(){
      var tranId = []
      var languags = ''
      this.tranLoading = true
      setTimeout(() => {
        if( this.tranLoading === true){
          this.tranLoading = false
          this.alertErr("翻译出现错误请重新翻译");
        }
      }, 30000);
      // console.log(this.languageBtn)
      Object.keys(this.languageBtn).forEach((item,index,key)=>{
        // console.log(item,index,key,'ovee')
        if(this.languageBtn[item] === true){
          // console.log(item)
          tranId.push(item)
        }
      })
      // console.log(tranId,"获取可翻译的id信息");
      this.tranIdAll = tranId
      tranId.forEach((item,index)=>{
        // if(item !== this.initLanguage){
        languags += (item + ",")
        // }
      })
      console.log(languags,'languags')
      this.languageValue = languags.slice(0,-1)
      console.log(this.languageValue,'languageValue')
      console.log(this.controllerAll)
      Object.keys(this.controllerAll).forEach((item,index)=>{
        if(index === 0 ){
          this.controllerAll.title === true?this.transAll.title = this.form.getFieldValue('title.'+this.initCountry):this.transAll.title=''
        }else if(index === 1){
          this.controllerAll.detail === true?this.transAll.detail = this.form.getFieldValue('detail.'+this.initCountry):this.transAll.detail=''
        }else if(index === 2){
          this.controllerAll.initialAll === true?this.transAll.bullet_point1 = this.form.getFieldValue('bullet_point1.'+this.initCountry):this.transAll.bullet_point1=''
          this.controllerAll.initialAll === true?this.transAll.bullet_point2 = this.form.getFieldValue('bullet_point2.'+this.initCountry):this.transAll.bullet_point2=''
          this.controllerAll.initialAll === true?this.transAll.bullet_point3 = this.form.getFieldValue('bullet_point3.'+this.initCountry):this.transAll.bullet_point3=''
          this.controllerAll.initialAll === true?this.transAll.bullet_point4 = this.form.getFieldValue('bullet_point4.'+this.initCountry):this.transAll.bullet_point4=''
          this.controllerAll.initialAll === true?this.transAll.bullet_point5 = this.form.getFieldValue('bullet_point5.'+this.initCountry):this.transAll.bullet_point5=''
        }else if(index === 3){
          this.controllerAll.keywords === true?this.transAll.keywords = this.form.getFieldValue('keywords.'+this.initCountry):this.transAll.keywords=''
        }
      })
      console.log(this.transAll,'transAll')

      if(tranId.length>0){
        if(this.defaultSlate ==1){
          trans_fee({
            to: this.languageValue,
            trans_type: 1,//1:谷歌翻译 2：有道翻译 3：谷歌免费翻译
            trans_obj: this.transAll
          }).then((res)=>{
            if(res.code === 0){
              this.transPayVisibles = true;
              this.transWordLength = res.data.number;
              this.transWordMoney = Number(res.data.money).toFixed(2);
            }
          })
        }else{
          this.toNewTrans();
        }
      }else{
        this.tranLoading = false
        this.$notification.error({
          message: '失败',
          description:'请选择翻译到的语言',
        });
      }
    },
    //点击 确认翻译接口
    handleOkTrans(){
      let _this = this;
      const hide = this.$message.loading('扣费中', 0);
      if(this.againModalType == 1){
        _this.transPayVisibles = false;
      }else{
        _this.transPayVisibles = false;
        _this.toNewTrans(hide);
      }
    },
    //  新的翻译
    toNewTrans(hide){
      if(this.defaultSlate == 4){
        //走插件翻译
        this.orilanguage = this.removal(this.orilanguage)
        let siteArr = this.languageValue.split(',')
        siteArr.forEach((item,index)=>{
          transPlugin({
            "trans_type":"encode",
            "trans_obj":this.transAll
          }).then((res)=>{
            if(res.code === 0 ){
              this.chromeToTransAll('auto',item,res.data,item,index);
            }else{
            }
          })
        })
      }else{
        trans({
          trans_type:this.defaultSlate,
          from:'auto',
          to:this.languageValue,
          q:this.transAll,
          platform:"amazon"
        }).then((res)=>{
          if(res.code === 0 ){
            this.tranLoading = false
            // 去重
            this.orilanguage = this.removal(this.orilanguage)
            setTimeout(()=>{
              let siteArr = this.languageValue.split(',')
              this.language.forEach((item,index)=>{
                siteArr.forEach((itm,idx)=>{
                  if(item.languages == itm){
                    // console.log(itm,'语言',res.data[itm])
                    if(this.controllerAll.title ===true){
                      if(itm==='en'){
                        let fillingArr = res.data[itm].title.split(" ");
                        for(var i = 0;i<fillingArr.length;i++){
                          if(fillingArr[i] === 'of' || fillingArr[i] === 'and' || fillingArr[i] === 'for' ){
                          }else{
                            console.log(fillingArr[i].charAt(0).toUpperCase(),'+_+++',fillingArr[i].slice(1))
                            fillingArr[i]=fillingArr[i].charAt(0).toUpperCase()+fillingArr[i].slice(1);
                          }
                        }
                        let fillingArrs = fillingArr.join(" ")
                        this.form.setFieldsValue({
                          ['title.'+ itm]:fillingArrs
                        })
                      }else{
                        this.form.setFieldsValue({
                          ['title.'+ itm]:res.data[itm].title
                        })
                      }
                      // this.form.setFieldsValue({
                      //   ['title.'+ itm]:res.data[itm].title
                      // })
                    }
                    if(this.controllerAll.detail ===true){
                      this.form.setFieldsValue({
                        ['detail.'+ itm]:res.data[itm].detail
                      })
                    }
                    if(this.controllerAll.keywords ===true){
                      this.form.setFieldsValue({
                        ['keywords.'+ itm]:res.data[itm].keywords
                      })
                    }
                    if(this.controllerAll.initialAll ===true){
                      this.form.setFieldsValue({
                        ['bullet_point1.'+ itm]:res.data[itm].bullet_point1,
                        ['bullet_point2.'+ itm]:res.data[itm].bullet_point2,
                        ['bullet_point3.'+ itm]:res.data[itm].bullet_point3,
                        ['bullet_point4.'+ itm]:res.data[itm].bullet_point4,
                        ['bullet_point5.'+ itm]:res.data[itm].bullet_point5,
                      })
                    }
                    this.InitInfoFilling()

                  }
                  // this.wordsLimitShow(item)
                  if(hide){
                    setTimeout(hide, 0);
                  }
                })
              })
            },1000)
            if(hide){
              setTimeout(hide, 0);
            }
            this.tranLoading  = false;
            this.$notification.success({
              message: '成功',
              description: res.msg,
            });
          }else{
            this.tranLoading  = false;
            if(hide){
              setTimeout(hide, 0);
            }
            this.$notification.error({
              message: '错误',
              description: res.msg,
            });
          }
        })
      }
    },
    //插件一键翻译  auto , 到什么语言 ， 翻译的内容 ，国家/语言  ，index
    chromeToTransAll(sl,tl,q,country,count){
      // console.log('chromeToTransAll',count)
      console.log(sl,tl,q,country,count,'tree')
      let _this = this;
      // console.log(_this.orilanguage)
      let h = window.chrome;
      let targetExtensionId = _this.chromeCode; // 插件的ID
      let tk = _this.tokenFn(q);
      h && h.runtime && h.runtime.sendMessage ?
        window.chrome.runtime.sendMessage(targetExtensionId,{
          type: 'single',
          action:"detect",
        },function(response){
          if(response === "ok"){
            window.chrome.runtime.sendMessage(targetExtensionId,{
              action:"translate",
              transData:{
                sl:sl,
                tl:tl,
                tk:tk,
                q:encodeURI(q)
              }
            },function(response){
              if(response.state === "ok"){
                console.log(response,'response')
                let ret = response.data[0];
                let data = "";
                for (let i = 0; i < ret.length; i++) {
                  if (ret[i][0]) {
                    data += ret[i][0];
                  }
                }
                let resData = data;
                // console.log(resData,'resData','插件返回的')
                // let resData = response.data;
                transPlugin({
                  "trans_type":"decode",
                  "trans_obj":resData
                }).then((res)=>{
                  if(res.code === 0 ){
                    _this.tranLoading = false
                    // console.log(res.data,"data",'country',country,'后端解析后的')
                    console.log('填充到')
                    _this.fillingFn(country,res.data)
                    let siteArr = _this.languageValue.split(',')
                    if(count>=siteArr.length-1){
                      // console.log(count,siteArr.length-1)
                      _this.tranLoading = false;
                      _this.$notification.success({
                        message: '成功',
                        description: '翻译成功',
                      });
                      setTimeout(()=>{
                        // console.log(_this.initLanguage,'initLanguage','')
                        _this.wordsLimitShow(_this.initLanguage)
                        _this.InitInfoFilling()
                      },500)
                    }
                  }else{
                    _this.tranLoading  = false;
                    // console.log('请求失败')
                  }
                })
              }else{
                _this.tranLoading  = false;
                // console.log("插件通信失败")
              }
            })
          }else{
            _this.tranLoading  = false;
            // console.log("插件通信失败")
          }
        }) : (console.log("插件未安裝"),_this.tranLoading  = false,this.$notification.success({message: '提醒',description: '插件未安装'}))
    },
    //插件填充
    fillingFn(country,data){
      console.log(data)
      if(this.controllerAll.title)
        if(country==='en'){
          let fillingArr = data[0].split(" ");
          for(var i = 0;i<fillingArr.length;i++){
            if(fillingArr[i] === 'of' || fillingArr[i] === 'and' || fillingArr[i] === 'for' ){

            }else{
              console.log(fillingArr[i].charAt(0).toUpperCase(),'+_+++',fillingArr[i].slice(1))
              fillingArr[i]=fillingArr[i].charAt(0).toUpperCase()+fillingArr[i].slice(1);
            }
          }
          let fillingArrs = fillingArr.join(" ")
          this.form.setFieldsValue({
            ['title.'+ country]:fillingArrs
          })
        }else{
          this.form.setFieldsValue({
            ['title.'+ country]:data[0]
          })
        }
      if(this.controllerAll.detail)
        this.form.setFieldsValue({
          ['detail.'+ country]:data[1]
        })
      if(this.controllerAll.keywords)
        this.form.setFieldsValue({
          ['keywords.'+ country]:data[2]
        })
      if(this.controllerAll.initialAll)
        this.form.setFieldsValue({
          ['bullet_point1.'+ country]:data[3],
          ['bullet_point2.'+ country]:data[4],
          ['bullet_point3.'+ country]:data[5],
          ['bullet_point4.'+ country]:data[6],
          ['bullet_point5.'+ country]:data[7],
        })


    },
    tokenFn(a){
      var k = "";
      var b = 406644;
      var b1 = 3293161072;

      var jd = ".";
      var sb = "+-a^+6";
      var Zb = "+-3^+b+-f";

      for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var m = a.charCodeAt(g);
        128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023),
          e[f++] = m >> 18 | 240,
          e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224,
          e[f++] = m >> 6 & 63 | 128),
          e[f++] = m & 63 | 128)
      }
      a = b;
      for (f = 0; f < e.length; f++)
        a += e[f],
          a = this.RL(a, sb);
      a = this.RL(a, Zb);
      a ^= b1 || 0;
      0 > a && (a = (a & 2147483647) + 2147483648);
      a %= 1E6;
      return a.toString() + jd + (a ^ b)
    },
    RL(a, b){
      var t = "a";
      var Yb = "+";
      for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2),
          d = d >= t ? d.charCodeAt(0) - 87 : Number(d),
          d = b.charAt(c + 1) == Yb ? a >>> d : a << d;
        a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d
      }
      return a
    },
    wordsLimitShow(tabVal){
      // console.log(tabVal,'popo2')
      //显示字数限制
      let num1,num2,num3,num4;
      if(this.form.getFieldValue('detail.'+tabVal)){
        // console.log(this.form.getFieldValue('detail.'+tabVal))
        let detailLimit = this.form.getFieldValue('detail.'+tabVal).length;
        // console.log(detailLimit)
        if(detailLimit<=2000){
          num1 = 2000-detailLimit;
          this.detailText = "还可输入"+num1+"字";
          this.isDetailBeyond = false;
        }else if(detailLimit>2000){
          num1 = detailLimit-2000;
          this.detailText = "已超过"+num1+"字";
          this.isDetailBeyond = true;
        }
      }else{
        this.detailText = "还可输入2000字";
        this.isDetailBeyond = false;
      }

      if(this.form.getFieldValue('keywords.'+tabVal)){
        // console.log(this.form.getFieldValue('keywords.'+tabVal),'popo',this.form.getFieldValue('keywords.'+tabVal).length)
        let KeyWordLimit = this.form.getFieldValue('keywords.'+tabVal).length;
        if(KeyWordLimit<=250){
          num2 = 250-KeyWordLimit;
          this.keywordsText = "还可输入"+num2+"字";
          this.isKeyBeyond = false;
        }else if(KeyWordLimit>250){
          num2 = KeyWordLimit-250;
          this.keywordsText = "已超过"+num2+"字";
          this.isKeyBeyond = true;
        }
      }else{
        this.keywordsText = "还可输入250字";
        this.isKeyBeyond = false;
      }

      if(this.form.getFieldValue('title.'+tabVal)){
        // console.log(this.form.getFieldValue('title.'+tabVal),'popo',this.form.getFieldValue('title.'+tabVal).length)
        let titleLimit = this.form.getFieldValue('title.'+tabVal).length;
        if(titleLimit<=200){
          num3 = 200-titleLimit;
          this.titleText = "还可输入"+num3+"字";
          this.istitleBeyond = false;
        }else if(titleLimit>200){
          num3 = titleLimit-200;
          this.titleText = "已超过"+num3+"字";
          this.istitleBeyond = true;
        }
      }else{
        this.titleText = "还可输入200字";
        this.istitleBeyond = false;
      }

      setTimeout(()=>{
        if(this.form.getFieldValue('initialAll.'+tabVal)){
          let initialAllLimit = this.form.getFieldValue('initialAll.'+tabVal).length;
          if(initialAllLimit<=2500){
            num4 = 2500-initialAllLimit;
            this.initialAllText = "还可输入"+num4+"字";
            this.isInitialAllBeyond = false;
          }else if(initialAllLimit>2500){
            num4 = initialAllLimit-2500;
            this.initialAllText = "已超过"+num4+"字";
            this.isInitialAllBeyond = true;
          }
          let rowStr = this.form.getFieldValue('initialAll.'+tabVal)
          let bulletREG = /\n/g
          console.log(rowStr.split(bulletREG),'dfgsdgsdfgsdfgsdfg')
          this.rowCount = rowStr.split(bulletREG).filter(d=>d).length

          //单条超出判断
          let arr = rowStr.split(/\n/g)
          arr.forEach((item,index)=>{
            if(item.length>500){
              this.isInitialAllBeyond = true
              this.initialAllText = "检测到”"+item.substring(0,4)+"...“描述超出字符限制"
            }
          })
          // console.log(this.rowCount)
        }else{
          this.initialAllText = "还可输入2500字";
          this.isInitialAllBeyond = false;
        }
      },500)
    },
    wordCountLimit(type,str){
      let _this = this;
      let full_Value = str.target.value;
      if(type == 1){//详情
        if(full_Value.length>0&&full_Value.length<=2000){
          _this.detailCount = 2000 - full_Value.length;
          _this.detailText = "还可输入"+_this.detailCount+"字";
          _this.isDetailBeyond = false;
        }else if(full_Value.length>2000){
          _this.isDetailBeyond = true;
          _this.detailCount = full_Value.length-2000;
          _this.detailText = "已超过"+_this.detailCount+"字";
        }else{
          _this.detailText = "还可输入2000字";
          _this.isDetailBeyond = false;
        }
      }else if(type == 2){//关键字
        if(full_Value.length>0&&full_Value.length<=250){
          _this.keywordsCount = 250 - full_Value.length;
          _this.keywordsText = "还可输入"+_this.keywordsCount+"字";
          _this.isKeyBeyond = false;
        }else if(full_Value.length>250){
          _this.isKeyBeyond = true;
          _this.keywordsCount = full_Value.length-250;
          _this.keywordsText = "已超过"+_this.keywordsCount+"字";
        }else{
          _this.keywordsText = "还可输入250字";
          _this.isKeyBeyond = false;
        }
      }else if(type == 3){//标题
        if(full_Value.length>0&&full_Value.length<=200){
          _this.titleCount = 200 - full_Value.length;
          _this.titleText = "还可输入"+_this.titleCount+"字";
          _this.istitleBeyond = false;
        }else if(full_Value.length>200){
          _this.istitleBeyond = true;
          _this.titleCount = full_Value.length-200;
          _this.titleText = "已超过"+_this.titleCount+"字";
        }else{
          _this.titleText = "还可输入200字";
          _this.istitleBeyond = false;
        }
      }else{//五点描述
        // let c;
        // this.rowCount = 0
        // for (let i = 0; i < full_Value.length; i++) {
        //   c = full_Value.substr(i, 1);
        //   if(c=="\r"||c=="\n"){
        //     this.rowCount++
        //   }
        // }
        // if(this.rowCount){
        //   this.rowCount = this.rowCount + 1
        // }else if(!this.rowCount&&full_Value.length){
        //   this.rowCount = this.rowCount + 1
        // }
        let bulletREG = /\n/g
        console.log(full_Value.split(bulletREG),'dfgsdgsdfgsdfgsdfg')
        console.log(full_Value.split(bulletREG).filter(d=>d))
        this.rowCount = full_Value.split(bulletREG).filter(d=>d).length
        if(full_Value.length>0&&full_Value.length<=2500){
          _this.initialAllCount = 2500 - full_Value.length;
          _this.initialAllText = "还可输入"+_this.initialAllCount+"字";
          _this.isInitialAllBeyond = false;
        }else if(full_Value.length>2500){
          _this.isInitialAllBeyond = true;
          _this.initialAllCount = full_Value.length-2500;
          _this.initialAllText = "已超过"+_this.initialAllCount+"字";
        }else{
          // console.log(full_Value.length)
          _this.initialAllText = "还可输入2500字";
          _this.isInitialAllBeyond = false;
        }

        //单条超出判断
        let arr = full_Value.split(/\n/g)
        arr.forEach((item,index)=>{
          if(item.length>500){
            this.isInitialAllBeyond = true
            this.initialAllText = "检测到”"+item.substring(0,4)+"...“描述超出字符限制"
          }
        })
      }
    },
    handleCancelTrans(){
      this.tranLoading = false
      this.transPayVisibles = false;
    },
    //  数据提交
    nextStep(type){
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        // console.log(values,"提交的内容")
        this.subvalues = values
        this.submitGoodsInfo(type)
      })
    },
    submitGoodsInfo(type){
      // console.log(this.$store.state.tabStatus.goodsId)
      update_desc({
        id:this.addNewProduct === 0?this.goodsId:this.$store.state.tabStatus.goodsId,
        is_ori:this.addNewProduct === 1?this.is_ori:'',
        title:this.subvalues.title,
        detail:this.subvalues.detail,
        keywords:this.subvalues.keywords,
        brand_name:this.subvalues.brand_name,
        bullet_point1:this.subvalues.bullet_point1,
        bullet_point2:this.subvalues.bullet_point2,
        bullet_point3:this.subvalues.bullet_point3,
        bullet_point4:this.subvalues.bullet_point4,
        bullet_point5:this.subvalues.bullet_point5,
      }).then(res=>{
        if(res.code === 0){
          this.$store.commit('set_Tabfour',false)
          this.$store.commit('set_subTabfour',true)
          if(type === 'forbid'){
          }else{
            this.$notification.success({
              message: '提醒',
              description: res.msg,
            });
          }
        }else{
          this.$store.commit('set_subTabfour',false)
          if(type === 'forbid'){
          }else{
            this.$notification.error({
              message: '失败',
              description: res.msg,
            });
          }
        }
      })
        .catch(()=>{
          let _this = this
          _this.subloading = false
          _this.$notification.error({
            message: '提醒',
            description: '商品描述保存访问超时，请重新操作',
          });
          this.$store.commit('set_subTabfour','error')
        })
    },
    cancel(){
      this.$emit('shopeeCommonSignOut');
    },
    // 公共err弹窗
    // 深拷贝
    deepCopy(obj){
      let str, newobj = obj.constructor === Array ? [] : {};
      if(typeof obj !== 'object'){
        return;
      } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
          newobj = JSON.parse(str); //还原
      } else {
        for(var i in obj){
          newobj[i] = typeof obj[i] === 'object' ?
            cloneObj(obj[i]) : obj[i];
        }
      }
      return newobj;
    },
    alertErr(val){
      this.$notification.error({
        message: '错误',
        description: val,
      });
    },
  }
}
</script>
<style lang="less" scoped>
.ml{margin-left: 20px}
ml-xl{margin-left: 30px}
.flex-min-max{
  min-width: 100px;
  max-width: 350px;
}
</style>
