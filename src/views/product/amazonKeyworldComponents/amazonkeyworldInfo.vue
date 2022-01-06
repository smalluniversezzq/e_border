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
            <!-- <a-select-option v-if='GLOBAL.translateType==1' value="1" >谷歌（收费） </a-select-option> -->
            <!-- <a-select-option  value="2" >有道（收费）</a-select-option> -->
            <!-- <a-select-option  value="3" >谷歌（免费） </a-select-option> -->
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

        <a-form-item
          v-show = 'initCountry == initLanguage'
          :label="'详情('+languageCode[initLanguage] + ')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
          >
          <a-textarea
          @change="wordCountLimit(1,$event)"
          v-decorator="['detail.'+initLanguage,{initialValue:addNewProduct == 0 ? data[initLanguage].detail: '' } ]" 
          :style="{ display: 'none', width: 'calc(100% - 84px)'}"
          placeholder="请输入描述信息" :rows="6"/>
        </a-form-item>
        <a-form-item
        v-for='(item,index) in orilanguage'
        :Key="index"
        v-show = 'initCountry == item'
        :label="'详情('+languageCode[item] + ')'"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
        <a-textarea
        @change="wordCountLimit(1,$event)"
        v-decorator="['detail.'+item,{initialValue:data[item] ? data[item].detail :'', } ]" 
        :style="{ display: 'none', width: 'calc(100% - 84px)'}"
        placeholder="请输入描述信息" :rows="6"/>
        </a-form-item>
        <a-row>
          <a-col span="4">
          </a-col>
          <a-col :md="17" :lg="13" :xl="13" :xxl="8" >
            <Editor 
              :style="{ display: 'inline-block', width: 'calc(100% - 100px)'}"
              ref="editor"
              @toData="toDatas"
              :data="data[initCountry].detail"
              :language="initCountry"
              >
            </Editor>
            <a-button class='ml' :type='controllerAll.detail?"primary":"dashed"' @click='tabController("detail")'>{{controllerAll.detail?"已选":"未选"}}</a-button>
            <div>
              <span class="limitTip" :class="{beyondClass : isDetailBeyond}">{{detailText}}</span>  
            </div>
          </a-col>
      
        </a-row>

        <a-form-item
          style='display:none'
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
          style='display:none'
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
          v-show = 'initCountry == initLanguage'
          :label="'五点描述('+languageCode[initLanguage] + ')'"
          :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
          :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }">
          <a-input placeholder='描述1'
            @change="InitInfoFilling(),wordCountLimit(5,$event)"
            @blur='changeBullet(initLanguage)'
            v-decorator="['bullet_point1.'+initLanguage, { initialValue:addNewProduct == 0 ? data[initLanguage].bullet_point1:''}]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
          <div>
            <span class="limitTip" :class="{beyondClass : beyond[5]}">{{describe[5].text}}</span>
          </div>
          <a-input placeholder='描述2'
            @change="InitInfoFilling(),wordCountLimit(6,$event)"
            @blur='changeBullet(initLanguage)'
            v-decorator="['bullet_point2.'+initLanguage, { initialValue:addNewProduct == 0 ? data[initLanguage].bullet_point2:''}]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
          <div>
            <span class="limitTip" :class="{beyondClass : beyond[6]}">{{describe[6].text}}</span>
          </div>
          <a-input placeholder='描述3'
            @change="InitInfoFilling(),wordCountLimit(7,$event)"
            @blur='changeBullet(initLanguage)'
            v-decorator="['bullet_point3.'+initLanguage, { initialValue:addNewProduct == 0 ? data[initLanguage].bullet_point3:''}]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
          <div>
            <span class="limitTip" :class="{beyondClass : beyond[7]}">{{describe[7].text}}</span>
          </div>
          <a-input placeholder='描述4'
            @change="InitInfoFilling(),wordCountLimit(8,$event)"
            @blur='changeBullet(initLanguage)'
            v-decorator="['bullet_point4.'+initLanguage, { initialValue:addNewProduct == 0 ? data[initLanguage].bullet_point4:''}]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
          <div>
            <span class="limitTip" :class="{beyondClass : beyond[8]}">{{describe[8].text}}</span>
          </div>              
          <a-input placeholder='描述5'
            @change="InitInfoFilling(),wordCountLimit(9,$event)"
            @blur='changeBullet(initLanguage)'
            v-decorator="['bullet_point5.'+initLanguage, { initialValue:addNewProduct == 0 ? data[initLanguage].bullet_point5:''}]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
            <div>
            <span class="limitTip" :class="{beyondClass : beyond[9]}">{{describe[9].text}}</span>
          </div>             
        </a-form-item>
        <div >
        <a-form-item
        v-for='(item,index) in orilanguage'
        v-show = 'initCountry == item'
        :Key="index"
        :label="'五点描述('+languageCode[item] + ')'"
        :labelCol="{ md: {span:4}, lg: {span: 4}, xl: {span: 4} ,xxl:{span: 4} }"
        :wrapperCol="{ md: {span:17}, lg: {span: 13}, xl: {span: 13} ,xxl:{span: 8} }"
        >
          <a-input placeholder='描述1'
            @change="InitInfoFilling(),wordCountLimit(5,$event)"
            @blur='changeBullet(item)'
            v-decorator="['bullet_point1.'+item, {initialValue:data[item] ? data[item].bullet_point1 :'', }]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
          <div>
            <span class="limitTip" :class="{beyondClass : beyond[5]}">{{describe[5].text}}</span>
          </div>
          <a-input placeholder='描述2'
            @change="InitInfoFilling(),wordCountLimit(6,$event)"
            @blur='changeBullet(item)'
            v-decorator="['bullet_point2.'+item, {initialValue:data[item] ? data[item].bullet_point2 :'', }]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
            <div>
              <span class="limitTip" :class="{beyondClass : beyond[6]}">{{describe[6].text}}</span>
            </div>
          <a-input placeholder='描述3'
            @change="InitInfoFilling(),wordCountLimit(7,$event)"
            @blur='changeBullet(item)'
            v-decorator="['bullet_point3.'+item, {initialValue:data[item] ? data[item].bullet_point3 :'', }]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
            <div>
              <span class="limitTip" :class="{beyondClass : beyond[7]}">{{describe[7].text}}</span>
            </div>
          <a-input placeholder='描述4'
            @change="InitInfoFilling(),wordCountLimit(8,$event)"
            @blur='changeBullet(item)'
            v-decorator="['bullet_point4.'+item, {initialValue:data[item] ? data[item].bullet_point4 :'', }]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
            <div>
              <span class="limitTip" :class="{beyondClass : beyond[8]}">{{describe[8].text}}</span>
            </div>
          <a-input placeholder='描述5'
            @change="InitInfoFilling(),wordCountLimit(9,$event)"
            @blur='changeBullet(item)'
            v-decorator="['bullet_point5.'+item, {initialValue:data[item] ? data[item].bullet_point5 :'', }]" :style="{ display: 'inline-block', width: 'calc(100% - 84px)' }"/>
            <div>
              <span class="limitTip" :class="{beyondClass : beyond[9]}">{{describe[9].text}}</span>
            </div>
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
          v-decorator="['keywords.'+initLanguage,  { initialValue:data[initLanguage].keywords}]"
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
        <a-row type="flex" justify="center">
          <a-col>
            <a-button  class='ml-xl' :disabled="goodsId==''" @click="nextStep()" >保存</a-button>
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
import { 
  trans_fee , 
  getDesc,
  TgetDesc ,
  TupdateDesc ,
  trans ,
  transPlugin
} from '@/api/collect'
import { permsBtn } from '@/utils/static'
import Editor from "@/views/product/amazonKeyworldComponents/editor"
import E from 'wangeditor'
import { language ,languageCode ,languageCodeOrcountry} from '@/views/order/public/country'
  export default {
    name:"",
    props:["goodsId"],
    components:{
      Editor,
    },
    data(){
      return{
        permsBtn,
        initLanguage:"",
        data:{
          de: "",
          fr: "",
          it: "",
          nl: "",
          es: "",
          en: "",
          ja: "",
          zh: "",
        },
        tranLoading:false,
        initCountry:"",
        language,
        languageCode ,
        languageCodeOrcountry,
        form: this.$form.createForm(this),
        cardLoading:true,
        defaultSlate:"3",
        characterTxt:"（100万字符=142.228人民币）",
        countryValue:"",
        languageBtn:{
          de:false,
          nl:false,
          es:false,
          it:false,
          fr:false,
          en:false,
          ja:false,
          zh:false,

        },
        languageAll:false,
        controllerAll:{
          title:true,
          detail:true,
          initialAll:true,
          keywords:true,
        },
        transAll:{
          // title:"",
          detail:"",
          keywords:"",
          bullet_point1:"",
          bullet_point2:"",
          bullet_point3:"",
          bullet_point4:"",
          bullet_point5:"",
          replaceInfo:"",
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
        addNewProduct:0,
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
          nl:[]
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
        transStatus:{},
        describe:{
          5:{
            describeInfo:{
              text:"",
              count:"",
            }
          },
          6:{
            describeInfo:{
              text:"",
              count:"",
            }
          },
          7:{
            describeInfo:{
              text:"",
              count:"",
            }
          },
          8:{
            describeInfo:{
              text:"",
              count:"",
            }
          },
          9:{
            describeInfo:{
              text:"",
              count:"",
            }
          },
          
        },
        beyond:{
          5:"",
          6:"",
          7:"",
          8:"",
          9:"",
        },
    
      }
    },
    created(){
    },
    mounted(){
      // this.goodsId = this.$route.query.id
      // this.$store.commit('set_Tabfour',true)
      if(this.goodsId){
        console.log(this.goodsId,"goodsId")
        this.getDescInfo(this.goodsId)
      }else{
        console.log("没有goodsId")
        this.cardLoading = false
        this.initCountry = 'zh'
        this.initLanguage = 'zh'   
        this.orilanguage=["de","fr","it","nl","es","sv","en","ja","zh"]
        // this.getDescInfo()
        let dataInfos = {
          bullet_point1: "",
          bullet_point2: "",
          bullet_point3: "",
          bullet_point4: "",
          bullet_point5: "",
          detail: "",
          keywords: "",
        }
        this.data={
          de: dataInfos,
          fr: dataInfos,
          it: dataInfos,
          nl: dataInfos,
          es: dataInfos,
          sv: dataInfos,
          en: dataInfos,
          ja: dataInfos,
          zh: dataInfos,
        }
        this.transStatus['zh'] = false
        console.log(this.data,"data")
      }
      console.log("editr111")
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
      getDescInfo(goodsId){
        console.log("getdesc",goodsId,"ID")
        TgetDesc({
          id:goodsId
          //id:687068
        }).then((res)=>{
          if(res.code === 0){
            console.log("getDescInfo")
            if(JSON.stringify(res.data) !== '{}'){
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
              }
              console.log(this.data,"getDescInfo")
              Object.keys(this.data).forEach((item,index)=>{
                // console.log(item,index,"item")
                // if(this.data[item].is_ori == '1'){
                //   // console.log("item",item,this.data[item].is_ori)
                //   this.initLanguage = item
                //   this.initCountry = item
                //   console.log(this.initLanguage,'赋值后的initLanguage')
                // }
                // if(item !== this.initLanguage){
                //   this.orilanguage.push(item)
                // }
                this.transStatus[item] = false
              })
              this.cardLoading = false
            }else{
              console.log("有数据getDescInfo")
              this.addNewProduct = 0
              this.initCountry = 'zh'
              this.initLanguage = 'zh'
              // this.$store.commit('set_goodsId',this.goodsId)
              this.cardLoading = false
              this.transStatus['zh'] = false
            }
          }
  
          console.log(this.transStatus,'transStatus')
          // console.log(this.orilanguage,'过滤前')
          this.orilanguage = this.removal(this.orilanguage)
          console.log(this.orilanguage,'orilanguage',this.initLanguage,this.initCountry,'init')
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
      // 切换当前语言
      currentLanguage(val){
        console.log(val,"currentLanguage")
        this.initCountry = val
        this.wordsLimitShow(val)
        this.$refs.editor.addText()
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
      console.log("五点描述All分别填充到五点描述")
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
        this.replaceInfo = this.$refs.editor.replaceInfo
        console.log(this.replaceInfo,"replaceInfo1")
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
        console.log(this.controllerAll,"controllerAll")
        Object.keys(this.controllerAll).forEach((item,index)=>{
          if(index === 0 ){
            // this.controllerAll.title === true?this.transAll.title = this.form.getFieldValue('title.'+this.initCountry):this.transAll.title=''
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
        this.transAll.replaceInfo = this.replaceInfo[this.initCountry]
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
          // console.log("1")
          _this.transPayVisibles = false;
          // 批量翻译
          //  console.log("需要翻译的内容",this.transAll)
        }else{
          _this.transPayVisibles = false;
          _this.toNewTrans(hide);
        }
      },
    //  新收费的翻译
    toNewTrans(hide){
      if(this.defaultSlate == 4){
        //走插件翻译
        // 去重
        this.orilanguage = this.removal(this.orilanguage)
        let siteArr = this.languageValue.split(',')
        // console.log(siteArr,'siteArr11111')
        siteArr.forEach((item,index)=>{
          // console.log(item,index)
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
            // console.log(this.orilanguage,'ovee')
            setTimeout(()=>{
              let siteArr = this.languageValue.split(',')
              this.language.forEach((item,index)=>{
                siteArr.forEach((itm,idx)=>{
                  if(item.languages == itm){
                    // console.log(itm,'语言',res.data[itm])
                    if(this.controllerAll.detail ===true){
                      console.log("免费翻译填充")
                      // this.form.setFieldsValue({
                      //   ['detail.'+ itm]:res.data[itm].detail
                      // })
                      // 翻译填充editor  detail(标签)   replaceInfo(转义)
                      this.toEditorFn(itm,res.data[itm].replaceInfo)
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
    toEditorFn(country,data){
      console.log(country,data,"toEditorFn")
      let resultData = "_P你好我很好_Q_P我真的和那后_Q_Pasda_Q_Padasdasdadasda_Q_Ps_Q_P_B_Q_P_B_Q_P_B_Q_P_B_Q_P_B_Q_P_B_Q"
      let newdata = data
      .replace(/_P/g,"<p>")
      .replace(/_p/g,"</p>")
      .replace(/_R/g,"<br>")
      .replace(/_N/g,"&nbsp;")
      .replace(/_U/g,"<ul>")
      .replace(/_u/g,"</ul>")
      .replace(/_L/g,"<li>")
      .replace(/_l/g,"</li>")
      .replace(/_B/g,"<b>")
      .replace(/_b/g,"</b>")
      .replace(/_I/g,"<i>")
      .replace(/_i/g,"</i>")
      .replace(/_D/g,"<div>")
      .replace(/_d/g,"</div>")
      console.log(newdata,"newdata")
      // this.$refs.editor.replaceInfo[country] = data
      console.log(this.data)
      this.data[country].detail = newdata
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
      console.log(country,data,"fillingFn")
      if(this.controllerAll.detail)
      this.toEditorFn(country,data[7])
      if(this.controllerAll.keywords)
      this.form.setFieldsValue({
        ['keywords.'+ country]:data[1]
      })
      if(this.controllerAll.initialAll)
      this.form.setFieldsValue({
        ['bullet_point1.'+ country]:data[2],
        ['bullet_point2.'+ country]:data[3],
        ['bullet_point3.'+ country]:data[4],
        ['bullet_point4.'+ country]:data[5],
        ['bullet_point5.'+ country]:data[6],
      })
    },
    // edditor model >  view
    toDatas(info){
      console.log(info,"toDatas")
      this.data[info.language].detail=info.content
      console.log(this.data)
      let wordInfo = {
        target:{
          value:info.content
        }
      }
      this.wordCountLimit(1,wordInfo)
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
        for(let i = 1; i<6;i++){
          console.log(123)
          console.log('bullet_point'+i+'.'+tabVal);
          if(this.form.getFieldValue('bullet_point'+i+'.'+tabVal)){
            console.log(this.form.getFieldValue('bullet_point'+i+'.'+tabVal))
            let initialLimit = this.form.getFieldValue('bullet_point'+i+'.'+tabVal)
            this.describeFn((i+4),initialLimit)
          }
        }
        // if(this.form.getFieldValue('bullet_point1.'+tabVal)){
        //   let initialLimit = this.form.getFieldValue('bullet_point1.'+tabVal).length;
        //    if(initialLimit<=initialLimit){
        //     num4 = 500-initialLimit;
        //     this.initialAllText = "还可输入"+num4+"字";
        //     this.isInitialAllBeyond = false;
        //   }else if(initialLimit>500){
        //     num4 = initialLimit-500;
        //     this.initialAllText = "已超过"+num4+"字";
        //     this.isInitialAllBeyond = true;
        //   }
        // }
      },500)
      for(let i = 1; i<6;i++){
        console.log(123)
        console.log('bullet_point'+i+'.'+tabVal);
        if(this.form.getFieldValue('bullet_point'+i+'.'+tabVal)){
          console.log(this.form.getFieldValue('bullet_point'+i+'.'+tabVal))
          let initialLimit = this.form.getFieldValue('bullet_point'+i+'.'+tabVal)
          this.describeFn((i+4),initialLimit)
        }
      }
    },
    
    wordCountLimit(type,str){
      console.log(type,str,"wordCountLimit")
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
      }else if(type == 5  || type == 6 || type == 7 || type == 8 || type == 9){
        this.describeFn(type,full_Value)
        // let describeInfo = {
        //   text:"",
        //   count:"",
        //   beyond:false,
        // }
        // if(full_Value.length>0&&full_Value.length<=500){
        //   describeInfo.count = 500 - full_Value.length;
        //   describeInfo.text = "还可输入"+_this.titleCount+"字";
        //   describeInfo.beyond = false;
        // }else if(full_Value.length>500){
        //   describeInfo.count = full_Value.length-500;
        //   describeInfo.text = "已超过"+_this.titleCount+"字";
        //   describeInfo.beyond = true;
        // }else{
        //   describeInfo.text = "还可输入500字";
        //   describeInfo.beyond = false;
        // }
        // this.describe[5] = describeInfo
      }else{
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
        let arr = full_Value.split(/\n/g)
        arr.forEach((item,index)=>{
          if(item.length>500){
            this.isInitialAllBeyond = true
            this.initialAllText = "检测到”"+item.substring(0,4)+"...“描述超出字符限制"
          }
        })
      }
    },
    describeFn(type,full_Value){
      let describeInfo = {
        text:"",
        count:"",
      }
      if(full_Value.length>0&&full_Value.length<=500){
        describeInfo.count = 500 - full_Value.length;
        describeInfo.text = "还可输入"+describeInfo.count+"字";
        this.beyond[type] = false;
      }else if(full_Value.length>500){
        describeInfo.count = full_Value.length-500;
        describeInfo.text = "已超过"+describeInfo.count+"字";
        this.beyond[type] = true;
      }else{
        describeInfo.text = "还可输入500字";
        this.beyond[type] = false;
      }
      this.describe[type] = describeInfo
      console.log(this.describe,"describe")
    },
      handleCancelTrans(){
        this.tranLoading = false
        this.transPayVisibles = false;
      },
      //  数据提交
      nextStep(type){
        console.log("nextStep")
        const { form: { validateFields } } = this
        validateFields((err, values) => {
          console.log(values,"提交的内容")
          this.subvalues = values
          this.submitGoodsInfo(type)
        })
      },
      submitGoodsInfo(type){
        // console.log(this.$store.state.tabStatus.goodsId)
        TupdateDesc({
          id:this.goodsId,
          detail:this.subvalues.detail,
          keywords:this.subvalues.keywords,
          bullet_point1:this.subvalues.bullet_point1,
          bullet_point2:this.subvalues.bullet_point2,
          bullet_point3:this.subvalues.bullet_point3,
          bullet_point4:this.subvalues.bullet_point4,
          bullet_point5:this.subvalues.bullet_point5,
        }).then(res=>{
          if(res.code === 0){
            // this.$store.commit('set_Tabfour',false)
            // this.$store.commit('set_subTabfour',true)
            let info = {
              title:"TupdateDesc",
              type:0
            }
            this.$emit("resultInfo",info)
              this.$notification.success({
                message: '提醒',
                description: res.msg,
              });
          }else{
            // this.$store.commit('set_subTabfour',false)
            let info = {
              title:"TupdateDesc",
              type:1
            }
            this.$emit("resultInfo",info)
            this.$notification.error({
              message: '失败',
              description: res.msg,
            });
          }
        })
        .catch(()=>{
          let _this = this
          _this.subloading = false
          _this.$notification.error({
            message: '提醒',
            description: '商品描述保存访问超时，请重新操作',
          });
          let info = {
            title:"TupdateDesc",
            type:1
          }
          this.$emit("resultInfo",info)
          // this.$store.commit('set_subTabfour','error')
        })
      },
      // 创建 富文本
      cancel(){
      //  this.$emit('shopeeCommonSignOut');
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
      // 父组件调用
      onlySite(value){
        let country = value.code
        console.log("country",country)
        console.log("orilanguage",this.orilanguage,value,this.language,"onlySite")
        //语言与 国家 不匹配
        // this.language = this.language.filter(item => item.country===country?item:"");
        //  德语 DE  法语 FR 意大利语 IT  荷兰 NL 西班牙语 ES  MX 瑞典 SE  英语 GB US CA AU 日语 JP
        let screenCountry = []
        this.language.forEach((item)=>{
          if(country == "US" || country == "GB" || country == "CA" || country == "AU" ){
            if(item.country==="GB"){
              console.log(item)
              screenCountry.push(item)
            }
          }
          if(country == "ES" || country == "MX"){
            if(item.country==="ES"){
              console.log(item)
              screenCountry.push(item)
            }
          }
          if(item.country===country){
            console.log(item)
            screenCountry.push(item)
          }
        })
        this.language = screenCountry
        console.log(this.language,"this.language")
        this.orilanguage = this.orilanguage.filter(item => item===this.language[0].languages?item:"")
        setTimeout(()=>{
          this.orilanguage = this.removal(this.orilanguage)
        },500)
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
