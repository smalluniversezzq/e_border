<template>
  <div class="servicestop">
    <div class="imgBlock">
      <div class="imgEle" :style="{backgroundImage: `url(${error_serveseShop})`}">
      </div>
    </div>
    <div class="content">
      <h1>系统维护</h1>
      <div class="desc">抱歉，系统正在维护更新中，请稍后再试</div>
      <div class="actions">
        <!-- <a-button class='btn-fff' type="primary" @click="handleToHome">返回首页</a-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  getInfo,
} from '@/api/login'
export default {
  name: 'servicestop',

  data () {
    return {
      typt:404,
      timer:null,
      error_serveseShop:require('@/assets/state/error_shopservese.png')
    }
  },
  methods: {
    handleToHome () {
      this.$router.push({ path:'/home/homes/index' })
    },
    Rotation(){
      this.timer = setInterval(()=>{
        getInfo({
          type:'base'
        }).then((res)=>{
          if(res.code === 0){
            if(res.data.stop_service){

            }else{
              this.$router.push({ path:'/home/homes/index'})
            }
          }
        })
      },3000)
    }
  },
  mounted(){
    this.Rotation()
  },
  beforeDestroy() { 
    clearInterval(this.timer); 
    this.timer = null;
  }
}
</script>
<style lang="less" scoped>
  .servicestop{
    .imgBlock{
      width: 62.5%;
    }
  }
  .btn-fff{
    color: #ffffff;
  }
@import "~ant-design-vue/lib/style/index";

.servicestop {
  display: flex;
  align-items: center;
  height: 80%;
  min-height: 500px;

  .imgBlock {
    flex: 0 0 62.5%;
    width: 62.5%;
    padding-right: 152px;
    zoom: 1;
    &::before,
    &::after {
      content: ' ';
      display: table;
    }
    &::after {
      clear: both;
      height: 0;
      font-size: 0;
      visibility: hidden;
    }
  }

  .imgEle {
    float: right;
    width: 100%;
    max-width: 530px;
    height: 560px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: contain;
  }

  .content {
    flex: auto;

    h1 {
      margin-bottom: 24px;
      color: #434e59;
      font-weight: 600;
      font-size: 68px;
      line-height: 72px;
    }

    .desc {
      margin-bottom: 16px;
      color: @text-color-secondary;
      font-size: 20px;
      line-height: 28px;
    }

    .actions {
      button:not(:last-child) {
        margin-right: 8px;
        
      }
    }
  }
}

@media screen and (max-width: @screen-xl) {
  .exception {
    .imgBlock {
      padding-right: 88px;
    }
  }
}

@media screen and (max-width: @screen-sm) {
  .exception {
    display: block;
    text-align: center;
    .imgBlock {
      margin: 0 auto 24px;
      padding-right: 0;
    }
  }
}

@media screen and (max-width: @screen-xs) {
  .exception {
    .imgBlock {
      margin-bottom: -24px;
      overflow: hidden;
    }
  }
}
</style>
