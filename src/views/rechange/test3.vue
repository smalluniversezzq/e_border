<template>
    <div class="index">
      <!-- {{keys}} -->
      <!-- <button @click='timers'>用时</button> -->
      <!-- {{times}} -->
      <a-button :loading="fileLoading"  @click='drawing'>一键拉伸</a-button>
      <!-- <br>
      file
      <div style='width:100px;height:100px'>
         <img :src="pic" alt="" style='width:100%'>
      </div>
      base64
      <br>
      <div style='width:100px;height:100px'>
        <img :src="basePic" alt="" style='width:100%'>
      </div>
      {{fileList}} -->
    </div>
</template>
<script>
  import moment from 'moment'
  import {getImageKey} from '@/api/collect'
  import Vue from 'vue'
  export default {
    name: '',
    data () {
      return {
        keys:"",
        client:"",
        ossFile:"",
        pic:"",
        basePic:"",
        start:"",
        ends:"",
        times:"",
        typeNum:"",
        typeNums:0,
        ossFileList:[],
        fileList:[],
        fileLoading:false,
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
      drawing(){
        this.fileLoading = true
        if(Vue.ls.get('getImageKeys')){
          this.fileExamine()
        }else{
          console.log(1)
          this.getImageKeyFn(1)
          console.log(2)
          
        }
      },
      fileExamine(){
        this.start = new Date().getTime()
       
        this.fileList = [ { "uid": 1, "url": "https://cbu01.alicdn.com/img/ibank/2018/762/763/8962367267_666095688.jpg", "status": 0 }, { "uid": 2, "url": "https://cbu01.alicdn.com/img/ibank/2018/430/803/8901308034_666095688.jpg", "status": 0 }, { "uid": 3, "url": "https://cbu01.alicdn.com/img/ibank/2018/518/246/8884642815_666095688.jpg", "status": 0 }, { "uid": 4, "url": "https://cbu01.alicdn.com/img/ibank/2018/982/876/8884678289_666095688.jpg", "status": 0 }, { "uid": 5, "url": "https://cbu01.alicdn.com/img/ibank/2018/282/042/8970240282_666095688.jpg", "status": 0 }, { "uid": 6, "url": "https://cbu01.alicdn.com/img/ibank/2018/315/395/9571593513_666095688.jpg", "status": 0 }, { "uid": 7, "url": "https://cbu01.alicdn.com/img/ibank/2020/320/005/13542500023_666095688.jpg", "status": 0 }, { "uid": 8, "url": "https://cbu01.alicdn.com/img/ibank/2018/732/495/8943594237_666095688.jpg", "status": 0 }, { "uid": 9, "url": "https://cbu01.alicdn.com/img/ibank/2018/221/841/9010148122_666095688.jpg", "status": 0 }, { "uid": 10, "url": "https://cbu01.alicdn.com/img/ibank/2018/946/503/9618305649_666095688.jpg", "status": 0 }, { "uid": 11, "url": "https://cbu01.alicdn.com/img/ibank/2018/433/028/8864820334_666095688.jpg", "status": 0 }, { "uid": 12, "url": "https://cbu01.alicdn.com/img/ibank/2018/557/036/9181630755_666095688.jpg", "status": 0 }, { "uid": 13, "url": "https://cbu01.alicdn.com/img/ibank/2018/915/875/9571578519_666095688.jpg", "status": 0 }, { "uid": 14, "url": "https://cbu01.alicdn.com/img/ibank/2018/810/506/9571605018_666095688.jpg", "status": 0 }, { "uid": 15, "url": "https://cbu01.alicdn.com/img/ibank/2018/833/833/9618338338_666095688.jpg", "status": 0 }, { "uid": 16, "url": "https://cbu01.alicdn.com/img/ibank/2018/216/842/8901248612_666095688.jpg", "status": 0 }, { "uid": 17, "url": "https://cbu01.alicdn.com/img/ibank/2020/176/684/13458486671_666095688.jpg", "status": 0 }, { "uid": 18, "url": "https://cbu01.alicdn.com/img/ibank/2018/630/833/9618338036_666095688.jpg", "status": 0 }, { "uid": 19, "url": "https://cbu01.alicdn.com/img/ibank/2018/956/116/9357611659_666095688.jpg", "status": 0 }, { "uid": 20, "url": "https://cbu01.alicdn.com/img/ibank/2018/313/995/9571599313_666095688.jpg", "status": 0 }, { "uid": 21, "url": "https://cbu01.alicdn.com/img/ibank/2018/685/806/8963608586_666095688.jpg", "status": 0 }, { "uid": 22, "url": "https://cbu01.alicdn.com/img/ibank/2018/196/206/8963602691_666095688.jpg", "status": 0 }, { "uid": 23, "url": "https://cbu01.alicdn.com/img/ibank/2018/832/923/9618329238_666095688.jpg", "status": 0 }, { "uid": 24, "url": "https://cbu01.alicdn.com/img/ibank/2018/793/785/9571587397_666095688.jpg", "status": 0 }, { "uid": 25, "url": "https://cbu01.alicdn.com/img/ibank/2018/120/066/8992660021_666095688.jpg", "status": 0 }, { "uid": 26, "url": "https://cbu01.alicdn.com/img/ibank/2018/307/203/9618302703_666095688.jpg", "status": 0 }, { "uid": 27, "url": "https://cbu01.alicdn.com/img/ibank/2018/325/023/9618320523_666095688.jpg", "status": 0 }, { "uid": 28, "url": "https://cbu01.alicdn.com/img/ibank/2020/250/915/13458519052_666095688.jpg", "status": 0 }, { "uid": 29, "url": "https://cbu01.alicdn.com/img/ibank/2020/969/954/13458459969_666095688.jpg", "status": 0 }, { "uid": 30, "url": "https://cbu01.alicdn.com/img/ibank/2018/319/397/8864793913_666095688.jpg", "status": 0 }, { "uid": 31, "url": "https://cbu01.alicdn.com/img/ibank/2018/028/314/9338413820_666095688.jpg", "status": 0 }, { "uid": 32, "url": "https://cbu01.alicdn.com/img/ibank/2020/286/284/13542482682_666095688.jpg", "status": 0 }, { "uid": 33, "url": "https://cbu01.alicdn.com/img/ibank/2018/681/134/9338431186_666095688.jpg", "status": 0 }, { "uid": 34, "url": "https://cbu01.alicdn.com/img/ibank/2020/767/035/13496530767_666095688.jpg", "status": 0 }, { "uid": 35, "url": "https://cbu01.alicdn.com/img/ibank/2020/304/164/13542461403_666095688.jpg", "status": 0 }, { "uid": 36, "url": "https://cbu01.alicdn.com/img/ibank/2020/669/174/13458471966_666095688.jpg", "status": 0 }, { "uid": 37, "url": "https://cbu01.alicdn.com/img/ibank/2020/695/105/13458501596_666095688.jpg", "status": 0 }, { "uid": 38, "url": "https://cbu01.alicdn.com/img/ibank/2020/164/155/13496551461_666095688.jpg", "status": 0 }, { "uid": 39, "url": "https://cbu01.alicdn.com/img/ibank/2018/584/695/9571596485_666095688.jpg", "status": 0 }, { "uid": 40, "url": "https://cbu01.alicdn.com/img/ibank/2018/440/756/8992657044_666095688.jpg", "status": 0 }, { "uid": 41, "url": "https://cbu01.alicdn.com/img/ibank/2020/772/135/13458531277_666095688.jpg", "status": 0 }, { "uid": 42, "url": "https://cbu01.alicdn.com/img/ibank/2018/842/006/9200600248_666095688.jpg", "status": 0 }, { "uid": 43, "url": "https://cbu01.alicdn.com/img/ibank/2018/011/966/9181669110_666095688.jpg", "status": 0 }, { "uid": 44, "url": "https://cbu01.alicdn.com/img/ibank/2020/061/315/13458513160_666095688.jpg", "status": 0 } ]
        let num = 0
        this.typeNums = 0
        this.ossFileList = []
        this.fileList.forEach((item,index)=>{
          if(item.url){
            if(item.url.indexOf('x-oss-process=image/resize,m_fixed,w_1600,h_1600,limit_0')===-1 || item.url.indexOf('x-oss-process=image/resize,m_fixed,w_1000,h_1000,limit_0')>0){
              num ++
              this.getBlob(item.url,item.uid,1)
              this.typeNum = num
            }else{
              consoel.log('以前拉伸过了')
              console.log(item.uid)
            }
          }
        })
      },
      getBlob(url,value,num) { 
        console.log('getBlob')
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.responseType = 'blob'
        xhr.onload = () => {
          console.log(xhr.response,'response')
          this.toFile(xhr.response,value,num)
        }
        xhr.send()
      },
      toFile(blob,value,num){
        const files = new window.File([blob], `abc.${blob.type.split('/')[1]}`, { type: blob.type })
        this.filechang(files,value,num)
      },
      filechang(e,value,num){
          var _this = this;
          console.log('filechang')
          let file = e
          console.log(file)
          let maths = _this.randomn()
          let last = file.name.substr(file.name.lastIndexOf("."),file.name.length)
          let fileName=`${_this.$store.state.user.uid}_${moment(new Date()).format("YYYYMMDD")}_${maths}${last}`;
          console.log(_this.keys,'key')
          let client = new OSS({
              accessKeyId:_this.keys.accessKeyId,
              accessKeySecret:_this.keys.accessKeySecret,
              stsToken:_this.keys.securityToken,
              region:_this.keys.region,
              bucket:_this.keys.bucket,
          });
          client.multipartUpload(fileName, file).then(function (result) {
            _this.pic = result.res.requestUrls[0].slice(0,result.res.requestUrls[0].indexOf("?"))+"?x-oss-process=image/resize,m_fixed,w_1600,h_1600,limit_0"
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
            _this.ends = new Date().getTime()
            _this.timers()
          }).catch(function (err) {
              console.log(err.toString(),'err');
              // 如果存在id重复 重新获取key并重新执行  一键拉伸
              console.log(err.toString().indexOf("The OSS Access Key Id you provided does not exist in our records.")!==-1)

          });
        },
      timers(){
        // console.log(this.ends, this.start)
        this.times = (this.ends - this.start)+"ms";
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

      },
      // 随机数字
      randomn() {
        var num = '';
        for(var i=0;i<5;i++)
        {
          num+=Math.floor(Math.random()*10);
        }
        return num
      },
      getImageKeyFn(type){
        console.log(11)
        getImageKey({}).then(res=>{
          if(res.code === 0){
            console.log(res.data)
            // Vue.ls.set('getImageKeys',res.data,30 * 60 * 1000);
            Vue.ls.set('getImageKeys',res.data, 10 * 1000);
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
          console.log(111)
        })
        setTimeout(()=>{
          console.log(Vue.ls.get('getImageKeys'),'getImageKeys')
        },11000)
      }
    },
  }
</script>

