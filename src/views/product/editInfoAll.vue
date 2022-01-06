<template>
  <div class="table">
    <div class='spin' v-if="data.length===0">
      <a-spin></a-spin>
    </div>
    <a-card class="card" v-else>
      <table>
        <tr>
          <th class='tac'>图片</th>
          <th class='tac'>标题
            <a-button size="small" @click='translation()'>
              一键翻译
            </a-button>
          </th>
          <th>
            <div class='tac bb-solid header-title' >
              变体属性
            </div>
            <ul class='table-attribute-title'>
              <li class='attribute-pic'>
                变体图片
              </li>
              <li class='attribute-value' v-if='data[variantValue].variant[0].attribute.color.length>=0'>
                color
              </li>
              <li class='attribute-value' v-if='data[variantValue].variant[0].attribute.size.length>=0'>
                size
              </li>
              <li class='attribute-price'>
                售价 
                <a-icon type="edit" @click='handlePriceAll'/>
              </li>
            </ul>
          </th>
        </tr>
        <tr v-for='(item,index) in data' :key='index' @mouseenter='enter(index)' @mouseleave='leave()' :style="{background:tableBg===index?'#e6f7ff':''}">
          <td>
            <a-popover placement="rightTop">
              <template slot="content">
                <div class='table-img-popover'>
                  <img :src="item.pic" alt=""> 
                </div>
              </template>
              <div class='table-img'>
                <img :src="item.pic" alt="">
              </div>
            </a-popover>
          </td>
          <td @dblclick="changeTitle(index,inx)">
            <div v-if='signTitle[0]===index && signTitle[1]===inx'>
              <a-input size="small" style='width:600px' v-model='item.title'></a-input>
            </div>
            <div v-else class=' pd-sm' style='maxWidth:600px'>
              {{item.title}}
            </div>
          </td>
          <td width='800' class="attrTd">
            <div class='attribute-box'  v-for="(itm,inx) in item.variant" :key="inx"  >
                <div class='attribute-list'  :style="{borderBottom:inx===item.variant.length-1?'none':'1px solid #e8e8e8'}">
                  <a-popover placement="rightTop">
                    <template slot="content">
                      <div class='table-img-popover'>
                        <img :src="item.pic?item.pic:picAlt" alt=""> 
                      </div>
                    </template>
                    <div class='attributePics'>
                      <img :src="item.pic?item.pic:picAlt" alt="">
                    </div>
                  </a-popover>
                </div>
                <div @dblclick="changeColor(index,inx)" class='attribute-list'  v-if='!itm.attribute.color || itm.attribute.color.length>=0' :style="{borderBottom:inx===item.variant.length-1?'none':'1px solid #e8e8e8'}">
                  <div v-if='signColor[0]===index && signColor[1]===inx'>
                      <a-input size="small" style='width:100px' v-model='itm.attribute.color'></a-input>
                    </div>
                    <div v-else>
                      {{itm.attribute.color}}
                    </div>
                </div>
                <div @dblclick="changeSize(index,inx)" class='attribute-list' v-if='!itm.attribute.size || itm.attribute.size.length>=0' :style="{borderBottom:inx===item.variant.length-1?'none':'1px solid #e8e8e8'}">
                  <div v-if='signSize[0]===index && signSize[1]===inx'>
                    <a-input size="small" style='width:100px' v-model='itm.attribute.size'></a-input>
                  </div>
                  <div v-else >
                    {{itm.attribute.size}}
                  </div>
                </div>
          
                <div @dblclick="changePrice(index,inx)" :data-index='index' class='attribute-list pointer' :style="{borderBottom:inx===item.variant.length-1?'none':'1px solid #e8e8e8'}">
                  <div v-if='signPrice[0]===index && signPrice[1]===inx'>
                    <a-input size="small" style='width:100px' v-model='itm.price'></a-input>
                  </div>
                  <div v-else>
                    {{itm.price}}
                  </div>
                </div>
              </div>
         
          </td>
        </tr>
      </table>
      <a-row class='mt' type="flex" justify="center">
        <a-col  span='2'>
          <a-button @click="submit">保存</a-button>
        </a-col>
        <a-col>
          <a-button class='ml' @click='cancel'>取消</a-button>
        </a-col>
      </a-row>
    </a-card>
      <a-modal
      :maskClosable="false" 
      v-model="editPrice" 
      title="修改售价" 
      @ok="handlePriceOk"
      >
        售价修改为：
        <a-input-number style='width:250px' :min="0" v-model='editPriceValue'></a-input-number>
      </a-modal>
  </div>
</template>
<script>
import Vue from 'vue';
import {  batchGetProduct ,batchUpdateProduct} from '@/api/collect'
  export default {
    data(){
      return {
        isText:true,
        picAlt:require("@/assets/icons/picAlt.png"),
        data:[],
        signPrice:[],
        signSize:[],
        signColor:[],
        signTitle:[],
        editPrice:false,
        editPriceValue:"",
        tableBg:"",
        chromeCode:this.GLOBAL.chrome.id,
        translateLoading:false,
        selectID:"",
        variantValue:"",


      }
    },
    methods:{
      changePrice(index,inx){
        if(this.signPrice[0] === index && this.signPrice[1] === inx){
         this.signPrice = [] 
        }else{
          this.signPrice = []
          this.signPrice.push(index,inx)
          console.log(this.signPrice)
        }
        this.signSize = []
        this.signColor = []
        this.signTitle = []
      },
      changeSize(index,inx){
        if(this.signSize[0] === index && this.signSize[1] === inx){
         this.signSize = [] 
        }else{
          this.signSize = []
          this.signSize.push(index,inx)
          console.log(this.signSize)
        }
        this.signPrice = []
        this.signColor = []
        this.signTitle = []
      }, 
      changeColor(index,inx){
        if(this.signColor[0] === index && this.signColor[1] === inx){
         this.signColor = [] 
        }else{
          this.signColor = []
          this.signColor.push(index,inx)
          console.log(this.signColor)
        }
        this.signPrice = []
        this.signSize = []
        this.signTitle = []
      },
      changeTitle(index,inx){
        if(this.signTitle[0] === index && this.signTitle[1] === inx){
         this.signTitle = [] 
        }else{
          this.signTitle = []
          this.signTitle.push(index,inx)
          console.log(this.signTitle)
        }
        this.signPrice = []
        this.signSize = []
        this.signColor = []
      },
      handlePriceAll(){
        console.log('handlePriceAll')
        this.editPrice = true
      },
      handlePriceOk(){
        if(this.editPriceValue){
          console.log(this.editPriceValue)
          this.data.forEach((item,index)=>{
            item.variant.forEach((itm,inx)=>{
              itm.price = this.editPriceValue 
            })
          })
          this.editPrice = false
          this.editPriceValue = ""
        }else{
          this.$notification.warning({
            message: '警告',
            description: '价格必须是数字并且不能为空',
          });
        }
      },
      enter(index){
        this.tableBg = index
      },
      leave(){
        this.tableBg = -1
      },
      translation(){
        console.log('一键翻译',this.data)
        let oriTitle = []
        this.data.forEach((item,index)=>{
          oriTitle.push(item.title) 
        })
        console.log(oriTitle)
        let q = oriTitle.join(",")
        console.log(q,"q")
        this.chromeToTrans("zh","en",q);
      },
      chromeToTrans(form,to,qs){
        console.log('form,to,qs',form,to,qs)
        let _this = this;
        let h = window.chrome;
        let targetExtensionId = _this.chromeCode; // 插件的ID
        let tk = _this.tokenFn(qs);
        h && h.runtime && h.runtime.sendMessage ?
        window.chrome.runtime.sendMessage(targetExtensionId,{
          type: 'single',
          action:"detect",
        },function(response){
          if(response === "ok"){
            window.chrome.runtime.sendMessage(targetExtensionId,{
              action:"translate",
              transData:{
                sl:form,
                tl:to,
                tk:tk,
                q:encodeURI(qs)
              }
            },function(response){
              if(response.state === "ok"){
                let ret = response.data[0];
                console.log(ret,'ret')
                let data = "";
                for (let i = 0; i < ret.length; i++) {
                  if (ret[i][0]) {
                    data += ret[i][0];
                  }
                }
                let resData = [];
                resData.push(data)
                console.log(resData,'resData')
                let info = resData[0].split(",")
                console.log(info)
                _this.fillInfo(info)
                // _this.translateLoading = false;
              }else{
                _this.translateLoading  = false;
                _this.$notification.error({
                  message: '错误',
                  description: '插件通信失败',
                });
              }
            })
          }else{
            _this.translateLoading  = false;
            _this.$notification.error({
              message: '错误',
              description: '插件通信失败',
            });
          }
        }) : (console.log("插件未安裝"),_this.translateLoading  = false,this.$notification.error({message: '提醒',description: '插件未安装'}))

      },
      fillInfo(info){
        this.data.forEach((item,index)=>{
          item.title = info[index]
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
      batchGetProductFn(){
        batchGetProduct({
          ids:this.selectID
        }).then(res=>{
          if(res.code===0){
            console.log(res.data,'data')
            this.data = res.data
            this.data.forEach((v,x)=>{
              if(v.variant.length>0) {
                this.variantValue = x
                console.log(this.variantValue,"variantValue")
              }             
            })
          }
        })
      },
      submit(){
        console.log(this.data)
        this.data.forEach((item,index)=>{
          delete item.pic
          item.variant.forEach((im,ix)=>{
            delete im.attributePic
          })
        })
        batchUpdateProduct({
          goods:this.data
        }).then(res=>{
          if(res.code === 0){
            this.$notification.success({
              message: '成功',
              description: res.msg
            })
            this.$router.push("/product/amazonManage")
          }else{
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
          }
        })
      },
      cancel(){
        this.$router.push("/product/amazonManage")
      },
    },
    created() {},
    mounted() {
      //获取数据
      console.log(this.$route.params.code)
      this.selectID = this.$route.query.code
      if(this.selectID){
        this.batchGetProductFn()
      }

      if(Vue.ls.get('CHROME_ID')){
        this.chromeCode = Vue.ls.get('CHROME_ID')
      }else{
        this.chromeCode = this.GLOBAL.chrome.id
      }
    },
  }
</script>
<style lang="less" scpoed>
.table{
  table, td, th{
    border:1px solid #e8e8e8;
  }
  th{
    background:#fafafa;
  }
}
  th,td{
    padding: 0;
  }
  .table-img{
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .table-img > img{
    padding: 5px;
    width: 100%;
  }
  .table-img-popover{
    width: 250px;
    img{
      width: 100%;
    }
  }
  .attribute-box{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .attribute-list{
      width: 25%;
      line-height: 50px;
      height: 50px;
      text-align: center;
      border-right: 1px solid #e8e8e8;
    }
  }
  .table-attribute-title{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    .attribute-pic{
      width: 10%;
     
    }
    .attrTd{
      padding: 0 !important;
    }
    .attribute-value{
      width: 40%;
    }
    .attribute-price{
      width: 10%;
    }
    li{
      height: 33px;
      // width: 20%;
      text-align: center;
      line-height: 30px;
      border-right: 1px solid #e8e8e8;
    }
  }
  .table-attribute-title > li:nth-last-child(1){
    border-right: none;
  }
  .attribute-box > .attribute-list:nth-last-child(1){
    border-right: none;
  }
  .attribute-box>.attribute-list:nth-child(1){
    width: 10%;
    overflow: hidden;
  }
  .attribute-box > .attribute-list:nth-last-child(1){
    width: 10%;
  }
   .attribute-box>.attribute-list:nth-child(2),.attribute-box>.attribute-list:nth-child(3){
    width:40%;
   }
  li{
    list-style-type: none;
  }
  .tac{
    text-align: center;
  }
  .header-title{
    height: 30px;
    line-height: 30px;
  }
  .bb-solid{
    border-bottom: 1px solid #e8e8e8;
  }
  .pd-sm{
    padding: 0 10px;
  }
  .not-allowed{
     cursor:not-allowed;
  }
  .pointer{
    cursor:pointer;
  }
  .attributePics{
    width: 50px;
    height: 50px;
    margin: 0 auto;
    img{
      width: 100%;
      padding: 5px;
    }
  }
  .spin{
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>