<template>
  <div class="index" style="display:flex;justify-content: left;align-items:center">
    <a-button :loading="fileLoading"  @click='drawing'>一键拉伸</a-button>
<!--    <a-dropdown :trigger="['click']">-->
<!--      <a-button style="margin-left: 8px" @click="e => e.preventDefault()"> 一键智能 <a-icon type="down" /> </a-button>-->
<!--      <a-menu slot="overlay" @click="editeImgs">-->
<!--        <a-menu-item key="1">-->
<!--          <span>一键图片白底</span>-->
<!--        </a-menu-item>-->
<!--        <a-menu-item key="2">-->
<!--          <span>一键图片翻译</span>-->
<!--        </a-menu-item>-->
<!--      </a-menu>-->
<!--    </a-dropdown>-->
<!--    <a-tooltip placement="right" class="ml">-->
<!--      <template slot="title">-->
<!--        说明：图片的一键智能操作因为是AI智能化操作，所以会有部分图片AI识别不准，建议先通过美图简单修改降低AI识别的图片难度后，再进行图片的一键智能操作-->
<!--      </template>-->
<!--      <a-icon type="question-circle" />-->
<!--    </a-tooltip>-->
  </div>
</template>
<script>
  import moment from 'moment'
   import Vue from 'vue'
  import {getImageKey} from '@/api/collect'
  export default {
    name: 'oneClickStretch',
    props:['fileList'],
    data () {
      return {
        keys:"",
        client:"",
        ossFile:"",
        pic:"",
        basePic:"",
        typeNum:"",
        typeNums:0,
        ossFileList:[],
        fileLoading:false,
        type: '',
      }
    },
    mounted(){
      if(!Vue.ls.get("getImageKeys")){
        this.getImageKeyFn(2)
      }else{
        this.keys={
          region: Vue.ls.get('getImageKeys').oss.region,
          accessKeyId: Vue.ls.get('getImageKeys').token.AccessKeyId,
          accessKeySecret: Vue.ls.get('getImageKeys').token.AccessKeySecret,
          securityToken:Vue.ls.get('getImageKeys').token.SecurityToken,
          bucket: Vue.ls.get('getImageKeys').oss.bucket,
          url:Vue.ls.get('getImageKeys').oss.url,
        }
      }
    },
    methods:{
      editeImgs(e){
        this.type = 'pic'
        this.$emit('ToFileList', this.fileList, e.key, this.type)
      },
      drawing(e){
        this.type = 'draw'
        e.preventDefault()
        this.fileLoading = true
        if(Vue.ls.get('getImageKeys')){
          this.fileExamine()
        }else{
          this.getImageKeyFn(1)
        }
      },
      fileExamine(){
        // this.fileList = [ { "uid": 1, "url": "https://cbu01.alicdn.com/img/ibank/2018/762/763/8962367267_666095688.jpg", "status": 0 }, { "uid": 2, "url": "https://cbu01.alicdn.com/img/ibank/2018/430/803/8901308034_666095688.jpg", "status": 0 }, { "uid": 3, "url": "https://cbu01.alicdn.com/img/ibank/2018/518/246/8884642815_666095688.jpg", "status": 0 }, { "uid": 4, "url": "https://cbu01.alicdn.com/img/ibank/2018/982/876/8884678289_666095688.jpg", "status": 0 }, { "uid": 5, "url": "https://cbu01.alicdn.com/img/ibank/2018/282/042/8970240282_666095688.jpg", "status": 0 }, { "uid": 6, "url": "https://cbu01.alicdn.com/img/ibank/2018/315/395/9571593513_666095688.jpg", "status": 0 }, { "uid": 7, "url": "https://cbu01.alicdn.com/img/ibank/2020/320/005/13542500023_666095688.jpg", "status": 0 }, { "uid": 8, "url": "https://cbu01.alicdn.com/img/ibank/2018/732/495/8943594237_666095688.jpg", "status": 0 }, { "uid": 9, "url": "https://cbu01.alicdn.com/img/ibank/2018/221/841/9010148122_666095688.jpg", "status": 0 }, { "uid": 10, "url": "https://cbu01.alicdn.com/img/ibank/2018/946/503/9618305649_666095688.jpg", "status": 0 }, { "uid": 11, "url": "https://cbu01.alicdn.com/img/ibank/2018/433/028/8864820334_666095688.jpg", "status": 0 }, { "uid": 12, "url": "https://cbu01.alicdn.com/img/ibank/2018/557/036/9181630755_666095688.jpg", "status": 0 }, { "uid": 13, "url": "https://cbu01.alicdn.com/img/ibank/2018/915/875/9571578519_666095688.jpg", "status": 0 }, { "uid": 14, "url": "https://cbu01.alicdn.com/img/ibank/2018/810/506/9571605018_666095688.jpg", "status": 0 }, { "uid": 15, "url": "https://cbu01.alicdn.com/img/ibank/2018/833/833/9618338338_666095688.jpg", "status": 0 }, { "uid": 16, "url": "https://cbu01.alicdn.com/img/ibank/2018/216/842/8901248612_666095688.jpg", "status": 0 }, { "uid": 17, "url": "https://cbu01.alicdn.com/img/ibank/2020/176/684/13458486671_666095688.jpg", "status": 0 }, { "uid": 18, "url": "https://cbu01.alicdn.com/img/ibank/2018/630/833/9618338036_666095688.jpg", "status": 0 }, { "uid": 19, "url": "https://cbu01.alicdn.com/img/ibank/2018/956/116/9357611659_666095688.jpg", "status": 0 }, { "uid": 20, "url": "https://cbu01.alicdn.com/img/ibank/2018/313/995/9571599313_666095688.jpg", "status": 0 }, { "uid": 21, "url": "https://cbu01.alicdn.com/img/ibank/2018/685/806/8963608586_666095688.jpg", "status": 0 }, { "uid": 22, "url": "https://cbu01.alicdn.com/img/ibank/2018/196/206/8963602691_666095688.jpg", "status": 0 }, { "uid": 23, "url": "https://cbu01.alicdn.com/img/ibank/2018/832/923/9618329238_666095688.jpg", "status": 0 }, { "uid": 24, "url": "https://cbu01.alicdn.com/img/ibank/2018/793/785/9571587397_666095688.jpg", "status": 0 }, { "uid": 25, "url": "https://cbu01.alicdn.com/img/ibank/2018/120/066/8992660021_666095688.jpg", "status": 0 }, { "uid": 26, "url": "https://cbu01.alicdn.com/img/ibank/2018/307/203/9618302703_666095688.jpg", "status": 0 }, { "uid": 27, "url": "https://cbu01.alicdn.com/img/ibank/2018/325/023/9618320523_666095688.jpg", "status": 0 }, { "uid": 28, "url": "https://cbu01.alicdn.com/img/ibank/2020/250/915/13458519052_666095688.jpg", "status": 0 }, { "uid": 29, "url": "https://cbu01.alicdn.com/img/ibank/2020/969/954/13458459969_666095688.jpg", "status": 0 }, { "uid": 30, "url": "https://cbu01.alicdn.com/img/ibank/2018/319/397/8864793913_666095688.jpg", "status": 0 }, { "uid": 31, "url": "https://cbu01.alicdn.com/img/ibank/2018/028/314/9338413820_666095688.jpg", "status": 0 }, { "uid": 32, "url": "https://cbu01.alicdn.com/img/ibank/2020/286/284/13542482682_666095688.jpg", "status": 0 }, { "uid": 33, "url": "https://cbu01.alicdn.com/img/ibank/2018/681/134/9338431186_666095688.jpg", "status": 0 }, { "uid": 34, "url": "https://cbu01.alicdn.com/img/ibank/2020/767/035/13496530767_666095688.jpg", "status": 0 }, { "uid": 35, "url": "https://cbu01.alicdn.com/img/ibank/2020/304/164/13542461403_666095688.jpg", "status": 0 }, { "uid": 36, "url": "https://cbu01.alicdn.com/img/ibank/2020/669/174/13458471966_666095688.jpg", "status": 0 }, { "uid": 37, "url": "https://cbu01.alicdn.com/img/ibank/2020/695/105/13458501596_666095688.jpg", "status": 0 }, { "uid": 38, "url": "https://cbu01.alicdn.com/img/ibank/2020/164/155/13496551461_666095688.jpg", "status": 0 }, { "uid": 39, "url": "https://cbu01.alicdn.com/img/ibank/2018/584/695/9571596485_666095688.jpg", "status": 0 }, { "uid": 40, "url": "https://cbu01.alicdn.com/img/ibank/2018/440/756/8992657044_666095688.jpg", "status": 0 }, { "uid": 41, "url": "https://cbu01.alicdn.com/img/ibank/2020/772/135/13458531277_666095688.jpg", "status": 0 }, { "uid": 42, "url": "https://cbu01.alicdn.com/img/ibank/2018/842/006/9200600248_666095688.jpg", "status": 0 }, { "uid": 43, "url": "https://cbu01.alicdn.com/img/ibank/2018/011/966/9181669110_666095688.jpg", "status": 0 }, { "uid": 44, "url": "https://cbu01.alicdn.com/img/ibank/2020/061/315/13458513160_666095688.jpg", "status": 0 } ]
        let num = 0
        let errNum = 0
        this.typeNums = 0
        this.ossFileList = []
        this.fileList.forEach((item,index)=>{
          if(item.url){
            // if(item.url.indexOf('x-oss-process=image/resize,m_fixed,w_1600,h_1600,limit_0')===-1 || item.url.indexOf('x-oss-process=image/resize,m_fixed,w_1000,h_1000,limit_0')>0){
            if(true){
              num ++
              // blob方法
              // this.getBlob(item.url,item.uid,1)
              // base64方法
              // url 链接  uid 图片的uid  1
              console.log('imagetobase64开始前')
              this.imagetobase64(item.url,item.uid,1)
              // this.imageLastName = item.url.substr(item.url.lastIndexOf("."),item.url.length)
              console.log(item.url,'item.url')
              this.typeNum = num
            }else{
              errNum ++
              console.log(item.uid,"拉伸过得数据")
              if(this.fileList.length===errNum){
                this.fileLoading = false
                this.$notification.info({
                  message: '提醒',
                  description:'图片重复拉伸',
                });
              }
            }
          }
        })
      },
      getBlob(url,value,num) {
        console.log('getBlob','url',url)
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.responseType = 'blob'
        xhr.onload = () => {
          this.toFile(xhr.response,value,num)
        }
        xhr.send()
      },
      toFile(blob,value,num){
        let maths = this.randomn()
        console.log(blob,'blob')
        const files = new window.File([blob], `${maths}.${blob.type.split('/')[1]}`, { type: blob.type })
         console.log(files,'files')
        this.filechang(files,value,num)
      },
      imagetobase64(url,value,num){
        let _this = this
        console.log("imagetobase64")
        let urls = url
        let img = new Image();
        img.src = urls;
        img.onload = function(){
          console.log('width:'+img.width+',height:'+img.height);
          _this.getBase64FromImageURL(url,(base64URL)=> {
            console.log(123)
            _this.basePic = base64URL
            var urlBase = _this.getFileFromBase64(base64URL,'imgName');
            console.log(urlBase);
            _this.filechang(urlBase,value,num,img.width===img.height?1:0)
          })
        }



      },
      // bae64的方法
      getBase64FromImageURL(url, callback) {
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
          console.log(img.height,img.width)
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img, 0, 0);
          console.log(url,'url')
          var ext = url.substring(url.lastIndexOf(".")+1).toLowerCase();
          console.log(ext)
          var base64URL = canvas.toDataURL('image/'+ext);
          callback(base64URL);
          canvas = null;
        };
        img.src = url;
      },
       /* 将base64转换为file类型 */
      getFileFromBase64(base64URL, filename) {
        var arr = base64URL.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
        },
      filechang(e,value,num,type){
          var _this = this;
          console.log('filechang')
          let file = e
          console.log(file,'files')
          let maths = _this.randomn()
          console.log(file.name,'file.name')
          let last = file.name.lastIndexOf(".")!==-1?file.name.substr(file.name.lastIndexOf("."),file.name.length):""
          console.log(last,'last')
          let fileName=`${_this.$store.state.user.uid}_${moment(new Date()).format("YYYYMMDDHHMMSS")}_${maths}${last}`;
          console.log(_this.keys,'key',fileName,"fileName")
          let client = new OSS({
              accessKeyId:_this.keys.accessKeyId,
              accessKeySecret:_this.keys.accessKeySecret,
              stsToken:_this.keys.securityToken,
              region:_this.keys.region,
              bucket:_this.keys.bucket,
          });
          client.multipartUpload(fileName, file).then(function (result) {
            _this.pic = type===1?'http://'+_this.keys.url+"/"+fileName+"?x-oss-process=image/resize,m_fixed,w_1600,h_1600,limit_0":'http://'+_this.keys.url+"/"+fileName+"?x-oss-process=image/resize,m_pad,w_1600,h_1600,color_FFFFFF"
            console.log(_this.pic,'pic')
            _this.typeNums++
            let pics = {
              uid:value,
              url:_this.pic
            }
            _this.ossFileList.push(pics)
            if(_this.typeNum === _this.typeNums){
              console.log('拉伸结束')
              _this.replaceFileList()
              _this.fileLoading = false
            }
          }).catch(function (err) {
            console.log(err.toString(),'err');
            // 如果存在id重复 重新获取key并重新执行  一键拉伸
            console.log(err.toString().indexOf("The OSS Access Key Id you provided does not exist in our records.")!==-1)
          });
        },
      replaceFileList(){
        this.fileList.forEach((item,index)=>{
          this.ossFileList.forEach((im,it)=>{
            if(item.uid === im.uid){
              item.url = im.url
            }
          })
        })
        console.log(this.fileList)
        // 组件的数据给父组件
        this.$emit('ToFileList',this.fileList,'attribute')
        this.$notification.success({
          message: '成功',
          description:'图片拉伸完毕',
        });
      },
      // 随机数字
      randomn() {
        var num = '';
        for(var i=0;i<5;i++){
          num+=Math.floor(Math.random()*10);
        }
        return num
      },
      getImageKeyFn(type){
        console.log(11)
        getImageKey({}).then(res=>{
          if(res.code === 0){
            console.log(res.data)
            Vue.ls.set('getImageKeys',res.data,30 * 60 * 1000);
            // Vue.ls.set('getImageKeys',res.data,5 * 60 * 1000);
            this.keys={
              region: Vue.ls.get('getImageKeys').oss.region,
              accessKeyId: Vue.ls.get('getImageKeys').token.AccessKeyId,
              accessKeySecret: Vue.ls.get('getImageKeys').token.AccessKeySecret,
              securityToken:Vue.ls.get('getImageKeys').token.SecurityToken,
              bucket: Vue.ls.get('getImageKeys').oss.bucket,
              url: Vue.ls.get('getImageKeys').oss.url
            }
          }
          if(type===1){
            this.fileExamine()
          }
        })
      }
    },
  }
</script>

