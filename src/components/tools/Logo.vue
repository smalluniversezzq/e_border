<template>
  <div class='logo'>
    <router-link :to="{name:'home'}">
      <img v-if="!status" :src="logo" alt="">
      <h1 v-if="showTitle" :class='status?"yun_font":""' >{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import global from '@/config/global.js'
// 禁用logo
let status = (window.location.href.indexOf("http://www.yunlingkuajing.com/") != -1)?true:false
export default {
  name: 'Logo',
  components: {
    // LogoSvg
  },
  props: {
    title: {
      type: String,
      default: global.logoText,
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  data(){
    return{
      logo:global.picType?require("@/assets/oem/"+global.picType+'/logo.png'):'',
      status,
    }
  },
  mounted(){
  }
}
</script>
<style lang="less">
  .yun_font{
    font-size: 24px !important;
    font-weight: bold !important;
    letter-spacing: 10px;
    color: #09367f !important;
  }
</style>
