<template>
  <div class="imgdrap">
      <div>
        <!-- <div v-for="(item, index) in ImgList" v-dragging="{ list: ImgList, item: item, group: 'image' }" :key="index">
    　　　　<img :src="item" alt="">
    　　</div> -->
    </div>
  </div>
</template>
<script>
  export default{
    props:[],
    data () {
      return {
        // ImgList:[
        // ],

      }
    },
    mounted(){
      this.$dragging.$on('dragged', (value) => {
        console.log(value.value.list)
　　　})
    }
  }
</script>