<template>
  <div>
    <a-card>
      <a-row>
        <a-col>添加图片:</a-col>
        <a-col class="mt">
          <div class="clearfix">
          <draggable
            v-model="fileList"
            :options="{ animation:200 }"
            style="display: flex; flex-wrap: wrap; ">
            <div class="image-box mr-sm" v-for="(item,index) in fileList" :key="index">
              <img  :src="item.url" alt="" class="image-box-item over-hidden" :onerror="defaultImg">
              <div class="mask-layer"></div>
              <a-icon type="eye" class="icon-eye" @click="lookBigImage(item.url, item)"/>
              <a-icon type="delete" class="icon-delete" @click="deleteImage(item.uid)"/>
              <a-icon v-if="type!=0" type="plus" class="icon-add" @click="addImage(item.url)"/>
              <!-- <a-icon type="scissor" class="icon-scissor" @click="editeImg(item.url, item)"/> -->
              <!-- <a-icon type="swap" class="icon-swap" @click="translationImg(item.url, item)"/> -->
              <!-- <a-icon v-if="item.imgSetStatus" type="rollback" class="icon-back" @click="revokeImg(item.url, item)"/> -->
            </div>
          </draggable>
          <div class='upload-box' @mouseover='showUpload' @mouseleave ='hideUpload'>
            <div class='mt-lg'>
              <div>
                <a-icon type="plus" />
              </div>
              上传图片
            </div>
            <div v-show='showUploadBox' class='upload-child-box'>
              <div >
                <a-upload
                  :action="this.GLOBAL.BASE_URL+'api/b1/product/upload?token='+this.token"
                  :multiple='true'
                  :defaultFileList="fileList"
                  listType="picture"
                  :fileList="fileList"
                  @preview="handlePreview"
                  @change="handleChange"
                  :beforeUpload="beforeUpload"
                  :remove='removes'
                >
                <div >
                  <a-button>本地上传</a-button>
                </div>
                </a-upload>
              </div>
              <div >
                <a-button  @click='uploadNetwork'>网络图片</a-button>
              </div>
            </div>
          </div>
          <div class="mt">
            <a-input style="width:240px" v-model="collectUrl" placeholder="请输入采集链接"></a-input>
            <a-button class="ml" @click="collectionPic">采集图片</a-button>
          </div>
          <div class='mt'>
            <one-click-stretch  @ToFileList='ToFileList'  :fileList='fileList'>
            </one-click-stretch>
          </div>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img  id='imgbox-gallery' alt="example" style="width: 100%" :src="previewImage" />
            <a-row  class='mt'>
              <a-col v-if='nWidth' :span='4' offset="3">
                <span>{{nWidth}} X {{nHeight}}</span>
              </a-col>
              <a-col offset='17'>
                <a-button @click='toMeitu(previewImage)'>在线美图</a-button>
              </a-col>
            </a-row>
          </a-modal>
        <a-modal
            title="网络图片上传"
            :visible="NetworkInput"
            @ok="NetworkPicOk"
            @cancel="NetworkCancel"
          >
            <div >
              <a-textarea v-model='networkUrl' placeholder="请填写图片URL链接，Enter换行输入多个图片链接" :rows="4" />
            </div>
          </a-modal>
        </div>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" class='mt' v-show="type==='0'">
        <a-col >
          <a-button :disabled="goodsId==''" :loading='subloading' @click="updateImgContent()">保存</a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-modal
      title="选择翻译语言"
      :visible="countryvisible">
      <a-select style="width: 240px; margin:0 aotu" v-model="language">
        <a-select-option v-for="(item,index) in languageList" :value="item.code" :key="index">
          {{item.name}}
        </a-select-option>
      </a-select>
      <template slot="footer">
        <a-row type="flex" justify="end">
          <a-col>
            <a-button :loading="languageLoading" @click="countryhandleOk()">确认</a-button>
          </a-col>
        </a-row>
      </template>
    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import draggable from 'vuedraggable'
  import oneClickStretch from './oneClickStretch'
  import { client } from '@/utils/alioss'
  import moment from 'moment'
  import {
    get_base,
    imgRessize,
    authCountry,
    mwsReverse,
    TupdateImage,
    search_category ,
    getImageKey,
    validateUrl,
    TgetImage,
    crawlerCollect,
    cutOutPic, transPic
  } from '@/api/collect'
  export default {
    name:"",
    components: {
      //调用组件
      draggable,
      oneClickStretch
    },
    props:["goodsId","type"],
    data(){
      return{
        fileList:[],
        token: '',
        previewVisible: false,
        previewImage: '',
        nWidth:"",
        nHeight:"",
        goodsimg:[],
        goodsimgs:"",
        fileID:"",
        fileName:"",
        loading: false,
        imgUrl:"",
        imgId:"",
        imgMain:"",
        M_URL:"",
        subloading:false,
        updateImgList: [],
        showUploadBox:false,
        NetworkInput:false,
        networkUrl:"",
        defaultImg: 'this.src="' + require('@/assets/icons/picAlt.png') + '"', //默认图地址
        fileRandomNum:[],
        oriFileData:[],
        postCount:0,
        chromeCode:"",
        collectUrl:"",
        countryvisible:false,
        languageList:[
          {name:'英语',code:'en'},
          {name:'日语',code:'ja'},
          {name:'法语',code:'fr'},
          {name:'德语',code:'de'},
          {name:'西班牙语',code:'es'},
          {name:'意大利语',code:'it'},
          {name:'阿拉伯语',code:'ar'},
          {name:'葡萄牙语',code:'pt'},
        ],
        language:'en',
        languageLoading:false,
        transPicObj:null
      }
    },
    methods:{
      //一键抠图
      editeImg(url, item){
        cutOutPic({
          image_url:url
        }).then((res)=>{
          if(res.code === 0){
            item.url = res.data.url
            item.imgSetStatus = true
            console.log(res.data)
          }
        })
      },
      //图片翻译
      translationImg(url, item){
        this.countryvisible = true
        this.transPicObj = item
      },
      //选择翻译语言确认
      countryhandleOk(){
        let _this = this
        this.languageLoading = true
        transPic({
          image_url:this.transPicObj.url,
          to:this.language
        }).then((res)=>{
          if(res.code === 0){
            _this.fileList.forEach((item, index) => {
              if(item.uid == _this.transPicObj.uid){
                item.url = res.data.url
                item.imgSetStatus = true
              }
            })
            _this.languageLoading = false
            _this.countryvisible = false;
          }else{
            _this.languageLoading = false
            _this.$notification.error({
              message: '失败',
              description: res.msg,
            });
          }
        })
      },
      //还原
      revokeImg(url,item){
        if(this.oriFileData.length){
          this.oriFileData.forEach((itm,idx)=>{
            if(item.uid == itm.uid){
              item.url = itm.url
              item.imgSetStatus = false
            }
          })
        }
      },
      // 获取商品信息  llll
      getBaseInfo(){
        let _this = this
        TgetImage({
          id:_this.goodsId //_this.goodsId
        }).then((res)=>{
          if(res.code === 0){
            _this.data = res.data;
            _this.cardLoading = false;
            _this.fileList = res.data.image?res.data.image:[];
            if(res.data.image&&res.data.image.length){
              _this.fileList.forEach((item, index) => {
                _this.fileRandomNum.push(item.uid)
              })
            }
            if(res.data.image){
              _this.oriFileData = JSON.parse(JSON.stringify(res.data.image))
            }
            console.log(_this.fileRandomNum,'fileRandomNum',this.fileList)
          }
        })
      },
      lookBigImage(url, item) {
        this.previewVisible = false
        this.handlePreview(item)
      },
      deleteImage(id) {
        this.removes(id)
      },
      setHomeImage(id, fileList) {
        this.setMain(id)
      },
      handlePreview (file ) {
        this.fileID = file.uid
        this.previewImage = file.url || file.thumbUrl
        // console.log(file.thumbUrl)
        this.previewVisible = true;
        setTimeout(() => {
          this.nWidth = document.getElementById('imgbox-gallery').naturalWidth;
          this.nHeight = document.getElementById('imgbox-gallery').naturalHeight;
        }, 300);
      },
      handleChange ({ fileList, file }) {
        this.fileName = file.thumbUrl
        this.fileList = fileList
        this.fileList.forEach((item, index) => {
          if(item.status === "done") {
            this.fileList[index].url = item.response.data.url
            if(item.uid == file.uid){
              file.uid = this.setRandomNum()
              file.url = item.response.data.url
              this.fileList[index].uid = file.uid
              this.oriFileData.push(file)
            }
          }
        })
        // 刷新数组
        this.fileList.reverse().reverse()
        this.updateImgList = fileList
        // this.$store.commit('set_updateImgList', this.updateImgList)
      },
      //设置上传文件随机uid
      setRandomNum(){
        let randomNum = Math.ceil(Math.random()*1000);
        if(this.fileRandomNum.indexOf(randomNum)==-1){
          this.fileRandomNum.push(randomNum)
          return randomNum
        }else{
          this.setRandomNum()
        }
      },
      beforeUpload (file) {
      },
      removes(val){
        console.log(val)
        this.fileList.forEach((item,inx)=>{
          if(val === item.uid){
            this.fileList.splice(inx,1)
          }
          // item.uid = inx+1
        })
        this.oriFileData.forEach((item,inx)=>{
          if(val === item.uid){
            this.oriFileData.splice(inx,1);
          }
          // item.uid = inx+1
        })
        this.fileRandomNum.splice(this.fileRandomNum.indexOf(val),1);
        console.log(this.fileRandomNum,'fileRandomNum')
        console.log(this.oriFileData,'oriFileData')
        // this.fileList.forEach((item,inx)=>{
        //   item.uid = inx+1
        // })
      },
      changePics(){
        let data = []
        let arr = []
        for(var i=0;i<this.fileList.length;i+=3){
            data.push(this.fileList.slice(i,i+3));
        }
        this.loading = true
        let num = 0
        let errNum = 0
        data.forEach((item,index)=>{
          this.changePicAll(item).then((res)=>{
            if(res){
              res.forEach((itm,idx)=>{
                arr.push(itm)
              })
            }
            return arr
          }).then((res)=>{
            num++
            if(arr.length == this.fileList.length){
              this.fileList = arr
              console.log(this.fileList,'拉伸')
              this.loading = false
              this.$notification.success({
                message: '成功',
                description: '拉伸成功',
              });
            }else{
              if(num==data.length){
                this.$notification.error({
                  message: '错误',
                  description: '拉伸失败',
                });
                this.loading = false
              }
            }
          })
          .catch(()=>{
            errNum ++
            if(errNum==1){
              this.loading = false
              this.$notification.error({
                message: '错误',
                description: '拉伸失败,请重新拉伸',
              });
            }
          })
        })
      },
      //  一个请求多张拉伸
      async changePicAll(obj){
        // this.loading = true
        let picUrl = ''
        let picId = ''
        obj.forEach((item,index)=>{
          picUrl += (item.url + '^')
          picId += (item.uid + '^')
        })
        this.imgUrl = picUrl.slice(0,-1)
        this.imgId = picId.slice(0,-1)
      },
      changePicList(){
        var _this = this
        _this.loading = true
        let picUrl = ''
        let arrurl = []
        for (var i = 0; i < _this.fileList.length; i++) {
          (function(a,list) {
            setTimeout(function() {
              imgRessize({
              width:1600,
              height:1600,
              img_array:list.url,
              ids:list.uid
              }).then(res =>{
                if(res.code === 0){
                  arrurl.push(res.data[0])
                  _this.fileList = arrurl
                  if(_this.fileList.length === i){
                    _this.loading = false
                    _this.$notification.success({
                    message: '提醒',
                    description: res.msg,
                    });
                  }
                }else{
                  this.loading = false
                }
              })
            }, a*500); //500代表间隔
          })(i,_this.fileList[i])
        }
      },
      ToFileList(value){
        console.log(value,"ToFileList")
        this.fileList = value
      },
      handleCancel () {
        this.previewVisible = false
      },
      setMain(id){
        this.fileID = id
        this.fileList.forEach((item,index)=>{
          if(this.fileID=== this.fileList[index].uid){
          this.imgMain = this.fileList.splice(index,1)
          this.fileList.unshift(this.imgMain[0])
          }
        })
        this.previewVisible = false
      },
      toMeitu(picUrl){
        this.M_URL={}
        this.M_URL.pic_URL = ''
        this.M_URL.file_ID = ''
        window.open(this.GLOBAL.BASE_URL+"beautify/index.html?url=" + picUrl + "&index=" + this.fileID + '&type=' + '1' + '&token=' + Vue.ls.get("Access-Token"))
        Vue.ls.set("monitor_URL",this.M_URL)
        const clearTime = setInterval(()=>{
          if(Vue.ls.get("monitor_URL").file_ID){
            window.clearInterval(clearTime)
            this.previewImage =  Vue.ls.get("monitor_URL").pic_URL
            this.fileList.forEach((item,index)=>{
              if(item.uid == Vue.ls.get("monitor_URL").file_ID){
                this.fileList[index].url = Vue.ls.get("monitor_URL").pic_URL;
                this.previewVisible = false
                this.handleCancel()
                this.M_URL={}
                this.M_URL.pic_URL = ''
                this.M_URL.file_ID = ''
                Vue.ls.set("monitor_URL",this.M_URL)
              }
            })
            this.fileID = Vue.ls.get("monitor_URL").file_ID
          }
        },500)
      },
      //提交
      updateImgContent(){
        console.log("执行保存图片")
        if(this.goodsId){
          let _this = this;
          this.subloading = true
          let data = []
          let list = []
          console.log(this.fileList,"")
          if(this.fileList.length){
            this.fileList.forEach((item,index)=>{
              list.push(item.url)
              // this.goodsimg=this.goodsimg.concat(item.url)
              if(this.oriFileData.length){
                this.oriFileData.forEach((itm,idx)=>{
                  if(item.uid == itm.uid){
                    let obj = {
                      ori_url:itm.url,
                      new_url:item.url
                    }
                    data.push(obj)
                  }
                })
              }
            })
          }
          console.log(this.goodsId,data,this.collectUrl,this.list,"TupdateImage")
          TupdateImage({
            id:this.goodsId,
            image:data
          }).then((res)=>{
            if(res.code == 0){
              this.goodsimg = []
              this.subloading = false
              let info = {
                title:"TupdateImage",
                type:0
              }
              this.$emit('resultPic',info);
              this.$notification.success({
                message: '提醒',
                description: res.msg,
              });
            }else{
              this.goodsimg = []
              this.subloading = false
              let info = {
                title:"TupdateImage",
                type:1
              }
              this.$emit('resultPic',info);
              // this.$store.commit('set_subTabtwo_T',true)
              this.$notification.error({
                message: '失败',
                description: res.msg,
              });
            }
          })
        }else{
          console.log("缺少ID不能保存")
        }
      },
      showUpload(){
        this.showUploadBox = true
        console.log(this.showUploadBox)
      },
      hideUpload(){
        this.showUploadBox = false
        console.log(this.showUploadBox)
      },
      uploadNetwork(){
        this.NetworkInput = true
      },
      NetworkCancel(){
        this.NetworkInput = false
      },
      NetworkPicOk(){
        console.log(this.networkUrl)
        let reg = /\n/g
        var strs = new Array(); //定义一数组
        strs = this.networkUrl.split(reg)
        console.log(strs)
        strs.forEach((item,index)=>{
          let urlObj = {
            status: 0,
            uid: 0,
            url:"" ,
          }
          urlObj.uid = this.setRandomNum()
          urlObj.url = item
          this.fileList.push(urlObj)
          this.oriFileData.push(urlObj)
        })
        console.log(this.fileList)
        this.NetworkInput = false
        this.networkUrl = ''
      },
      //采集图片
      collectionPic(){
        if(this.collectUrl.length>0){
          this.toCollect()
        }else{
          this.$notification.error({
            message: '错误',
            description: '请输入链接',
          });
        }
      },
   toCollect () {
        let _this = this
        _this.disableds = true
        let h = window.chrome
        let targetExtensionId = this.chromeCode // 插件的ID
        console.log('this.chromeCode', this.chromeCode, targetExtensionId)
        h && h.runtime && h.runtime.sendMessage ?
          window.chrome.runtime.sendMessage(targetExtensionId, {
            type: 'single',
            action: 'detect'
          }, function (response) {
            console.log(response)
            // 插件是否通信成功
            if (response === 'ok') {
              let reg = /\n/g
              if (reg.test(_this.collectUrl)) {
                var strs = new Array() //定义一数组
                strs = _this.collectUrl.split(reg)
                _this.$notification.error({
                  message: '错误',
                  description: '请输入一条链接'
                })
              } else {
                //单个url  category  // single   //fetch   //getHtml
                validateUrl({
                  url: _this.collectUrl
                }).then(res => {
                  if (res.code === 0) {
                    // _this.disableds = false
                    window.chrome.runtime.sendMessage(targetExtensionId, {
                      type: 'single',
                      action: 'getHtml',
                      url: _this.collectUrl,
                      config: ''
                    }, function (response) {
                      _this.html = response.data.html
                      // console.log(_this.html,"over html",_this.collectUrl)
                      //获取到html后发送给后端
                      crawlerCollect({
                        url: _this.collectUrl,
                        html: _this.html,
                        type:"1"  // 采集图片
                      }).then(res => {
                        if (res.code === 0) {
                          _this.disableds = false
                          console.log(res.data,"采集图片")
                          //采集的图片添加到  图片数组里
                          _this.collectToList(res.data)
                          _this.$notification.success({
                            message: '成功',
                            description: res.msg,
                            duration: 10
                          })
                            _this.disableds = false
                            _this.currentManege = 1
                            //获取的图片添加到 fileList
                            // _this.BlackAndWhiteList(Vue.ls.get('PAGE_SIZE'))
                        } else {
                          _this.disableds = false
                          _this.$notification.error({
                            message: '错误',
                            description: res.msg,
                            duration: 10
                          })
                        }
                      })
                    })
                  } else if (res.code === 1) {
                    _this.disableds = false
                    _this.$notification.error({
                      message: '错误',
                      description: '链接不可用'
                    })
                  }
                })
              }
              //判断链接是否可用
            } else {
              _this.disableds = false
              console.log('插件通信失败')
              _this.$notification.success({ message: '提醒', description: '插件通信失败，请检查插件是否安装成功' })
            }
          })(console.log('装了插件')) : (_this.toCollects(), console.log('插件未安裝'))
      },
      //判断插件是否安装
      isChromeEB () {
        console.log("执行了")
        let _this = this
        let h = window.chrome
        //判断插件是否安装了
        // document.location.protocol==="https:"?_this.showChromeUrl=false:h && h.runtime && h.runtime.sendMessage ? _this.showChromeUrl = false : _this.showChromeUrl = true
        if(document.location.protocol=="https:"){
          _this.showChromeUrl = true
          _this.isHttps=true
        }else{
          if(h && h.runtime && h.runtime.sendMessage){
            _this.showChromeUrl = false
          }else{
            _this.showChromeUrl = true
          }
          // h && h.runtime && h.runtime.sendMessage ? _this.showChromeUrl = false : _this.showChromeUrl = true
        }
        // document.location.protocol==="https:"?_this.showChromeUrl=false:""
        console.log(_this.showChromeUrl === true ? '未安装插件' : '安装了插件')
        console.log(_this.showChromeUrl)
      },
      collectToList(data){
        let strs = data
        strs.forEach((item,index)=>{
          let urlObj = {
            status: 0,
            uid: 0,
            url:"" ,
          }
          urlObj.uid = this.setRandomNum()
          urlObj.url = item
          this.fileList.push(urlObj)
          this.oriFileData.push(urlObj)
        })
        console.log(this.fileList)
        this.NetworkInput = false
        this.networkUrl = ''
      },
      // 添加图片至变体
      addImage(pic){
        // console.log(pic,'pic')
        if(this.type ==="1"){
          this.$emit('addVariant',pic)
          console.log("addVariant")
        }else if(this.type ==="2"){
          this.$emit('addVariantAll',pic)
          console.log("addVariantAll")
        }
      },
    },
    mounted(){
      if(this.goodsId){
        console.log(this.goodsId,"goodsId","有goodID")
        this.getBaseInfo();
      }
      this.token = Vue.ls.get('Access-Token')
      this.goodsId = this.$route.query.id;
      this.site = this.$route.query.site;
      this.addNewProduct = this.$route.query.type;
      this.isChromeEB();
      if (Vue.ls.get('CHROME_ID')) {
        console.log('chrome-id')
        this.chromeCode = Vue.ls.get('CHROME_ID')
        this.chromeID = Vue.ls.get('CHROME_ID')
        this.showChromeCode = false
      } else {
        console.log('chrome-id2')
        this.showChromeCode = true
        this.chromeCode = this.GLOBAL.chrome.id
        this.chromeID = this.GLOBAL.chrome.id
        console.log(this.GLOBAL.chrome.routers, 'routers')
        console.log(this.GLOBAL.chrome.id, this.GLOBAL.chrome.id, 'lll')
      }
    if (this.showChromeUrl === false) {
        console.log('安装了插件')
      }
      console.log(this.chromeCode, 'ID-')
      // }
    }
  }
</script>
<style lang="less" scoped>
.ml{margin-left:20px;}
.ml-s{margin-left:10px;}
.mt{margin-top:10px;}
.mr{margin-right:10px;}
.ml-sm{margin-left:5px;}
.mr-sm{margin-right:5px;}
.formcolor{
  background: #fff;
  padding:25px 0 1px;
}
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
.pic-box{
  display: flex;
  flex-wrap: wrap;
  width: 660px;
  .pic{
    width: 100px;
    height: 150px;
    margin-right: 10px;
    img{
      width: 100%;
      }
    .btns{
       width: 100%;
      text-align: center;
    }
  }
}
.uploadimg{
  width: 100px;
}
.tal{text-align: left;}
.tar{text-align: right;}
.dis-flex{
  display: flex;
}
.rt{
  float:right;
}
.ant-select-selection-selected-value > .tal > .anticon-right{
  display: none;
}
.dis-flex{
  display: flex;
  flex-wrap: wrap;
}
.image-box {
  width: 104px;
  height: 104px;
  margin-bottom: 5px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  position: relative;
}
.image-box-item {
  width: 86px;
  height: 86px;
  margin: 8px 8px 8px 8px;

}
.mask-layer {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 86px;
  height: 86px;
  background: rgba(41, 41, 41, 0.6);
  color: #ffffff;
  opacity: 0;
  transition:all .5s;
  -moz-transition:all .5s;
  -webkit-transition:all .5s;
  -o-transition:all .5s;
}
.image-box:hover .mask-layer {
  opacity: 0.7;
}
.icon-eye {
  cursor: pointer;
  position: absolute;
  top: 74%;
  left: 30%;
  // top: 45%;
  // left: 20%;
  color: white;
  display: none
}
.icon-delete {
  cursor: pointer;
  position: absolute;
  top: 74%;
  left:  60%;
  // top: 45%;
  // left: 40%;
  color: white;
  display: none
}
.icon-home {
  cursor: pointer;
  position: absolute;
  top: 45%;
  left: 60%;
  color: white;
  display: none
}
.image-box:hover .icon-eye {
  display: block;
}
.image-box:hover .icon-delete {
  display: block;
}
.image-box:hover .icon-home {
  display: block;
}
.image-box:hover .icon-add {
  display: block;
}
.upload-box{
  position: relative;
  border: 1px dashed #d9d9d9;
  width: 104px;
  height: 104px;
  border-radius: 4px;
  background-color: #fafafa;
  text-align: center;
  cursor: pointer;
  -webkit-transition: border-color 0.3s ease;
  transition: border-color 0.3s ease;
  vertical-align: top;
  margin-right: 8px;
  margin-bottom: 8px;
  display: table;
  .upload-child-box{
    position: absolute;
    top: 0;
    left: 102px;
    width: 100px;
    height: 100px;

  }
}
.icon-add{
  width: 14px;
  height: 14px;
  cursor: pointer;
  position: absolute;
  color: white;
  top: 20%;
  left: 30%;
  display: none;
  z-index: 100;
  font-size: 44px;
}
</style>
<style lang="less" >
.mt-lg{
    margin-top: 20px;;
}
.show{
  display: block  !important;
}
.hide{
  display:none !important;
}
.ant-upload-list-picture-card {
  display: none;
}
.over-hidden {
  overflow: hidden;
}
.beyondClass{
  color: red;
}
.limitTip{
  margin-left: 10px;
}
.ant-upload-list-picture-card {
  display: none;
}
.upload-box{
  position: relative;
  border: 1px dashed #d9d9d9;
  width: 104px;
  height: 104px;
  border-radius: 4px;
  background-color: #fafafa;
  text-align: center;
  cursor: pointer;
  -webkit-transition: border-color 0.3s ease;
  transition: border-color 0.3s ease;
  vertical-align: top;
  margin-right: 8px;
  margin-bottom: 8px;
  display: table;
  .upload-child-box{
    position: absolute;
    top: 0;
    left: 102px;
    width: 100px;
    height: 100px;
    .ant-upload-list{
      display:none;
    }
  }
}


</style>