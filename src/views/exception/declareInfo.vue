<template>
  <div class="declareInfo">
    <h1 class='title'>关于多条报关信息时填写注意事项</h1>
    <div class="content">
      <span class='indent'>
        &nbsp;&nbsp;&nbsp;&nbsp;当一个买家购买了两件甚至多件sku不相同的商品时，系统会自动根据订单中的商品sku数生成对应条数的报关信息，如果出现该情况填写报关信息就需要将每条报关信息中的申报金额<span class="txt-color">平均填写</span>，保证所有申报金额数量不<span class="txt-color">大于20USD（美元）</span>，原因是 <span class="txt-color">超出申报金额的部分</span> 清关时会 <span class="txt-color">收相应的关税</span> 。(关税会在物流费用冲减时从ERP账户余额中一起扣除）。
      </span>
      <p class='txt-color'>如下图所示：</p>
      <div class='pic-box'>
        <img class='pic-box-img' :src="pic1" alt="">
      </div>
      <p>
        <span>
           &nbsp;&nbsp;&nbsp;&nbsp;也可以 <span class="txt-color">仅填多条报关信息中的一条</span>（此方法仅适用于该买家的商品是<span class="txt-color">一个包裹发出</span>的情况，若订单中的商品是多个包裹发给买家时，就需按照实际报关信息填写，可参考上述方式），当只填写一条报关信息时，系统会自动将填写有内容的报关信息上传至物流打单系统，此时只需确保填写的信息中，申报金额<span class='txt-color'>不超过20（USD）</span> 即可。
        </span>
      </p>
      <div class="pic-box">
        <img  class='pic-box-img' :src="pic2" alt="">
      </div>
      <br>
      <br>
      <p class='txt-color'>
         &nbsp;&nbsp;&nbsp;&nbsp;关于报关信息填写有任何疑问请及时联系负责的售后人员避免订单申报金额过高而增加物流费用的情况出现，谢谢配合。
      </p>
      <br>
      <br>
    </div>
  </div>
</template>
<script>
export default {
  name:"declareInfo",
  components: {
  },
  data(){
    return {
      pic1:require("@/assets/image/declareInfo1.png"),
      pic2:require("@/assets/image/declareInfo2.png"),

    }
  },
  methods:{

  },
  created(){},
  mounted(){},
  updata(){},
  destroyed(){}
}
</script>

<style lang="less">
  .declareInfo{
    text-align: center;
    width: 1200px;
    margin: 10px auto 0;
    .title{
      color: red;
    }
    .content{
      font-size: 18px;
      text-align: left;
      .pic-box{
        width:1200px;
        img{
          width:100%;
        }
      }
    }

  }
  .txt-color{
    color: red;
    font-size: 20px;
  }
  // .pic-box{
  //   width: 1200px;
  // }
  // .pic-box-img{
  //   width: 100%;
  // }
</style>
